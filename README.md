# NowNote
- A Web Based Note Editor that gives you relevant Word Suggestions in an intellisense style drop down list as you type

## How do I get Word Suggestions?
- Start of by typing in a couple tags related to what your Notes are going to be about.
	- Backend will find Wikipedia articles relevant to those tags and will scrape other Wikipedia Articles linked within them.
		- The titles for each of the scraped Wikipedia articles will be added to the Note Editor as possible Word Suggestions
		
- Each time you select a word suggestion from the drop down menu, the backend will go ahead and find the Wikipedia article for that suggestion, and will scrape for other Wikipedia articles linked with it.
	- The scraped Wikipedia articles are then added to the Note Editor as possible Word Suggestions