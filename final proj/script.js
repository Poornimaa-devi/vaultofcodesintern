const puzzles = [
  {
    clues: ["Canvas", "Palette", "Brush", "Easel", "Painting"],
    answer: "art"
  },
  {
    clues: ["Hammer", "Nail", "Wrench", "Saw", "Screwdriver"],
    answer: "tool"
  },
  {
    clues: ["Base", "Hand", "Basket", "Volley", "Foot"],
    answer: "ball"
  },{
    clues: ["Scroll", "Post", "Feed", "Profile", "Likes"],
    answer: "social media"
  },
  {
    clues: ["Email", "Notes", "Message", "Books", "Newspaper"],
    answer: "things you can read"
  },
  
];

let current, index, tries;

function loadPuzzle() {
  current = puzzles[Math.floor(Math.random() * puzzles.length)];
  index = 0;
  tries = 0;
  document.getElementById("cluesBox").innerHTML = "";
  document.getElementById("feedback").textContent = "";
  document.getElementById("guess").value = "";
  showNextClue();
}

function showNextClue() {
  if (index < current.clues.length) {
    const clueDiv = document.createElement("div");
    clueDiv.className = "clue";
    clueDiv.textContent = `Clue ${String(index + 1).padStart(2, '0')}: ${current.clues[index]}`;
    document.getElementById("cluesBox").appendChild(clueDiv);
  }
}

function makeGuess() {
  const guess = document.getElementById("guess").value.trim().toLowerCase();
  if (!guess) return;

  tries++;

  if (guess === current.answer.toLowerCase()) {
    document.getElementById("feedback").textContent = `✅ Correct! You solved it in ${tries} guess${tries > 1 ? 'es' : ''}!`;
  } else {
    index++;
    if (index < current.clues.length) {
      document.getElementById("feedback").textContent = `❌ Try again! Here's another clue.`;
      showNextClue();
    } else {
      document.getElementById("feedback").textContent = `❌ Game over. The answer was "${current.answer}".`;
    }
  }
}

document.getElementById("tryBtn").onclick = makeGuess;
document.getElementById("restart").onclick = loadPuzzle;

loadPuzzle();