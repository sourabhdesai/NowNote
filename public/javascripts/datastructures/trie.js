var MIN_PRUNE_THRESH = 3;

var TrieNode = function(character, wordEnd) {

	this.character = character;
	this.useCount = 1; // Had to have used it by virtue of having to instantiate it
	this.depth = 0; // What is the height of the subtree at this node 
	this.children = []; // Array of children...also TrieNodes
	this.wordEnd = wordEnd;

	TrieNode.prototype.addWord = function(word) {
		if (word.length == 0)
			return false; // Word was already added to trie

		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.character == word[0]) {
				var isNewWord = child.addWord(word.substr(1));
				return isNewWord;
			}
		}

		// Exited for loop, means no matching children. Must start new branch
		var newChild = new TrieNode(word[0], word.length == 1);
		this.children.push(newChild);
		newChild.addWord(word.substr(1)); // Need to fill out rest of this branch
		return true; // Added a new Word
	};

	TrieNode.prototype.prefixMatches = function(prefix) {
		return this.prefixMatchesRecursive(prefix, 0);
	};

	TrieNode.prototype.prefixMatchesRecursive = function(prefix, idx) {
		if (prefix.length == idx)
			return this.getAllChildWords();

		for(var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.character == prefix[idx]) {
				var matches = child.prefixMatchesRecursive(prefix, idx+1);
				for (var i = 0; i < matches.length; i++) {
					matches[i] = this.character + matches[i];
				};
				return matches;
			}
		}

		return [];
	};

	// Quick and dirty...could be optimized if need be
	TrieNode.prototype.getAllChildWords = function() {
		if (this.children.length == 0)
			return [this.character];
		var suffixes = [];
		for (var i = 0; i < this.children.length; i++) {
			var childSuffixes = this.children[i].getAllChildWords();
			for (var it = 0; it < childSuffixes.length; it++) {
				childSuffixes[it] = this.character + childSuffixes[it];
			}
			suffixes = suffixes.concat(childSuffixes);
		};
		if (this.wordEnd)
			suffixes.push(this.character);
		return suffixes;
	};

	TrieNode.prototype.incrementWord = function(word) {
		if(word.length == 0) {
			this.wordEnd = true;
			return this.useCount;
		}
		for(var i=0; i < this.children.length; i++) {
			if(word[0] == this.children[i].character) {
				var child = this.children[i];
				child.useCount++;
				this.children.sort(function(childA, childB) {
					return childB.useCount - childA.useCount;
				});
				var wordUseCount = child.incrementWord(word.substr(1));
				return wordUseCount;
			}
		}

		return 0; // Didn't find given word in trie
	};

	TrieNode.prototype.prune = function(word, pruneThresh) {
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.character == word[0]) {
				child.useCount--;
				if (word.length == 1) {
					var mustDelete = (child.useCount <= pruneThresh) && (child.children.length == 0) && child.wordEnd;
					if (mustDelete)
						this.children.splice(i,1); // remove index i from array
					return {
						deletedWord: mustDelete,
						deletedChild: mustDelete
					};
				} else {
					var deleteds = child.prune(word.substr(1), pruneThresh);
					//  mustDelete if it has no more children and it isn't the ending to another word
					var mustDelete = deleteds.deletedChild && child.children.length == 0 && !child.wordEnd;
					if (mustDelete)
						this.children.splice(i,1); // remove index i from array
					deleteds.deletedChild = mustDelete;
					return deleteds;
				}
			}
		};

		return false; // Couldn't find word in trie ... odd
	};

};

var Trie = function() {
	this.root = new TrieNode("", false); // Sentinel Root Node
	this.numWords = 0;

	Trie.prototype.findMatches = function(prefix) {
		return this.root.prefixMatches(prefix);
	};

	Trie.prototype.addWord = function(word) {
		var newWord = this.root.addWord(word);
		if (newWord)
			this.numWords++;
	};

	Trie.prototype.incrementWord = function(word) {
		this.root.incrementWord(word);
	};

	Trie.prototype.prune = function(word) {
		var deleteds = this.root.prune(word, MIN_PRUNE_THRESH);
		if(deleteds.deletedWord)
			this.numWords--;
		return deleteds.deletedWord;
	};

	Trie.prototype.getNumWords = function() {
		return this.numWords;
	};

};