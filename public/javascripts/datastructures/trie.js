
var TrieNode = function(character, wordEnd) {

	this.character = character;
	this.useCount = 1; // Had to have used it by virtue of having to instantiate it
	this.depth = 0; // What is the height of the subtree at this node 
	this.children = []; // Array of children...also TrieNodes
	this.wordEnd = wordEnd;

	TrieNode.prototype.addWord = function(word) {
		if (word.length == 0)
			return; // Word was already added to trie

		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.character == word[0]) {
				child.addWord(word.substr(1));
				return;
			}
		}

		// Exited for loop, means no matching children. Must start new branch
		var newChild = new TrieNode(word[0], word.length == 1);
		this.children.push(newChild);
		newChild.addWord(word.substr(1)); // Need to fill out rest of this branch
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
		if(word.length == 0)
			return;
		for(var i=0; i < this.children.length; i++) {
			if(word[0] == this.children[i].character) {
				var child = this.children[i];
				child.useCount++;
				this.children.sort(function(childA, childB) {
					return childB.useCount - childA.useCount;
				});
				child.incrementWord(word.substr(1));
				return;
			}
		}
	};

};

var Trie = function() {

	this.root = new TrieNode("", false); // Sentinel Root Node

	Trie.prototype.findMatches = function(prefix) {
		return this.root.prefixMatches(prefix);
	};

	Trie.prototype.addWord = function(word) {
		this.root.addWord(word);
	};

	Trie.prototype.incrementWord = function(word) {
		this.root.incrementWord(word);
	};

};