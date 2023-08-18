function convertToUpperCase(inputElement) {
    inputElement.value = inputElement.value.toUpperCase();
  }
  
  function generateAnagrams(prefix, remaining, wordList) {
    if (remaining.length === 0) {
      wordList.add(prefix);
      return;
    }
  
    for (let i = 0; i < remaining.length; i++) {
      const currentChar = remaining.charAt(i);
      const newPrefix = prefix + currentChar;
      const newRemaining = remaining.slice(0, i) + remaining.slice(i + 1);
      generateAnagrams(newPrefix, newRemaining, wordList);
    }
  }
  
  async function findAnagrams(inputWord) {
    const loadingMessage = document.getElementById("loadingMessage");
    loadingMessage.style.display = "block"; // Show the loading message
  
    const wordList = new Set();
    generateAnagrams("", inputWord.toLowerCase(), wordList);
    wordList.delete(inputWord.toLowerCase()); // Remove the original word from the set of anagrams
  
    const validAnagrams = [];
    for (const word of wordList) {
      if (await isValidWord(word)) {
        validAnagrams.push(word.toUpperCase()); // Convert anagram to uppercase
      }
    }
  
    loadingMessage.style.display = "none"; // Hide the loading message after API call is completed
  
    return validAnagrams;
  }
  
  async function isValidWord(word) {
    try {
      const response = await fetch(`https://api.datamuse.com/words?sp=${word}`);
      const data = await response.json();
      return data.some((item) => item.word === word);
    } catch (error) {
      console.error(error);
      return false; // Return false in case of any error
    }
  }
  
  async function showAnagrams() {
    const inputWord = document.getElementById("inputWord").value;
    const result = await findAnagrams(inputWord);
  
    const resultContainer = document.getElementById("resultContainer");
    resultContainer.innerHTML = ""; // Clear previous results
  
    if (result.length === 0) {
      resultContainer.innerHTML = "No valid anagrams found.";
      return;
    }
  
    for (const word of result) {
      const wordElement = document.createElement("div");
      wordElement.textContent = word;
      wordElement.classList.add("wordItem");
      resultContainer.appendChild(wordElement);
    }
  }
  