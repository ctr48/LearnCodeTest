const challenges = [
  {
    text: 'Write a COBOL program that prints "Hello, World!" to the console.',
    expectedOutput: 'Hello, World!',
    isCorrect: false
  },
  {
    text: 'Create a COBOL program that accepts user input for a person\'s name and age, then prints out a greeting message including their name and age.',
    expectedOutput: 'Hello, John! You are 25 years old.',
    isCorrect: false
  },
  {
    text: 'Develop a COBOL program that calculates the sum of two numbers provided by the user.',
    expectedOutput: 'The sum is: 15',
    isCorrect: false
  },
  {
    text: 'Write a COBOL program that determines whether a given year is a leap year or not.',
    expectedOutput: '2024 is a leap year.',
    isCorrect: false
  },
  {
    text: 'Create a COBOL program that generates the Fibonacci sequence up to a specified number of terms.',
    expectedOutput: '0, 1, 1, 2, 3, 5, 8, 13, 21, 34',
    isCorrect: false
  }
];

let currentChallengeIndex = 0;

function getCurrentChallenge() {
  return challenges[currentChallengeIndex];
}

function checkAnswer(userOutput) {
  const currentChallenge = getCurrentChallenge();
  return userOutput.trim() === currentChallenge.expectedOutput;
}