
let currentIndex = 0;
let clues = [];
let score = 0;
let startTime = Date.now();
let playerName = "";

fetch("quests/nova_final_clues.json")
    .then(response => response.json())
    .then(data => {
        clues = data;
        // askPlayerName();
    });

function askPlayerName() {
    const input = document.getElementById("name-input");
    playerName = input.value.trim() || "Anonymous";
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game").style.display = "block";
    updateClue();
    updateTimer();
    setInterval(updateTimer, 1000);
}

function submitAnswer() {
    const input = document.getElementById("answer-input");
    const userAnswer = input.value.trim().toLowerCase();
    const correctAnswer = clues[currentIndex].answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        score++;
        alert("Correct!");
        currentIndex++;
        input.value = "";
        if (currentIndex < clues.length) {
            updateClue();
        } else {
            endGame();
        }
    } else {
        alert("Wrong! Try again or use a hint.");
    }
}

function showHint() {
    alert("Hint: " + (clues[currentIndex].hint || "No hint available."));
    score = Math.max(score - 1, 0); // Deduct 1 point for hint
}

function updateClue() {
    document.getElementById("clue-text").textContent = clues[currentIndex].clue;
    document.getElementById("progress").textContent = `Clue ${currentIndex + 1} of ${clues.length}`;
}

function updateTimer() {
    const now = Date.now();
    const seconds = Math.floor((now - startTime) / 1000);
    document.getElementById("timer").textContent = `Time: ${seconds}s`;
}

function endGame() {
    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    const newScore = { name: playerName, score: score, time: duration };
    let leaderboard = JSON.parse(localStorage.getItem("campusLeaderboard")) || [];
    leaderboard.push(newScore);
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    leaderboard = leaderboard.slice(0, 5);
    localStorage.setItem("campusLeaderboard", JSON.stringify(leaderboard));

    showResults(duration, leaderboard);
}

function showResults(duration, leaderboard) {
    document.getElementById("game").style.display = "none";
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";

    let leaderboardHTML = "<h3>🏆 Leaderboard (Top 5)</h3><ol>";
    leaderboard.forEach(entry => {
        leaderboardHTML += `<li>${entry.name}: ${entry.score}/${clues.length} in ${entry.time}s</li>`;
    });
    leaderboardHTML += "</ol>";

    resultDiv.innerHTML = `
        <h2>Game Over</h2>
        <p>Score: ${score}/${clues.length}</p>
        <p>Time: ${duration} seconds</p>
        ${leaderboardHTML}
    `;
}

function toggleMap() {
    const mapDiv = document.getElementById("map-container");
    mapDiv.style.display = mapDiv.style.display === "none" ? "block" : "none";
}

function startGame() {
    askPlayerName();
}


function showLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("campusLeaderboard")) || [];
    if (leaderboard.length === 0) {
        alert("No scores yet. Be the first to play!");
        return;
    }

    document.getElementById("start-screen").style.display = "none";
    const resultDiv = document.getElementById("result");
    resultDiv.style.display = "block";

    let leaderboardHTML = "<h2>🏆 Leaderboard (Top 5)</h2><ol>";
    leaderboard.forEach(entry => {
        leaderboardHTML += `<li>${entry.name}: ${entry.score} pts in ${entry.time}s</li>`;
    });
    leaderboardHTML += "</ol><br><button onclick='goBackToMenu()'>⬅ Back to Menu</button>`;

    resultDiv.innerHTML = leaderboardHTML;
}

function goBackToMenu() {
    document.getElementById("result").style.display = "none";
    document.getElementById("start-screen").style.display = "block";
}
