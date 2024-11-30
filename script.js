let correctAns = ""; // initialize correctAns variable
let questionCount = 1; // initialize questionCount variable
let score = 0; // initialize score variable
let questionLimit = 5;
console.log ("Current Question:" + questionCount); // log the current question number

async function fetchAnimeImg(){
    document.getElementById("loading").style.display = "block";
    try {
        let randomizeAnime = Math.floor(Math.random() * 25);
        const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${randomizeAnime}&type=tv`);

        if (!response.ok) {
            throw new Error("HTTP Error! Status:" + response.status); //detect and handle errors HTTP errors 404, 500, etc.
        }
        const data = await response.json();
        const animeList = data.data;

        const randomAnimeIndex = Math.floor(Math.random() * animeList.length);
        const correctAnime = animeList[randomAnimeIndex];


        // Update the anime image
        animeImage.src = correctAnime.images.webp.image_url;
        animeImage.alt = correctAnime.title;

        // Get random incorrect options
        const incorrectOptions = getRandomOptions(animeList, correctAnime, 3);

        // Combine correct and inccorect options
        const allOptions = [correctAnime, ...incorrectOptions];

        // Shuffle the options
        const shuffledOptions = shuffleArray(allOptions);

        // Populate options
        const labels = document.querySelectorAll("label");
        const options = document.querySelectorAll('input[type="radio"]');
        shuffledOptions.forEach((option, index) => {
            labels[index].textContent = option.title;
            options[index].value = option.title;
        });

        // Store the correct answer
        correctAnswer = correctAnime.title;

        // Hide loading text
        document.getElementById("loading").style.display = "none";

    } catch (error) {
        console.error("Error fetching anime data", error);
        return null;
    }
}

// Helper function to get random incorrect options
function getRandomOptions(animeList, correctAnime, count) {
    const filteredList = animeList.filter(anime => anime.title !== correctAnime.title);
    const randomOptions = [];
    while (randomOptions.length < count) {
        const randomIndex = Math.floor(Math.random() * filteredList.length);
        const randomAnime = filteredList[randomIndex];
        if (!randomOptions.includes(randomAnime)) {
            randomOptions.push(randomAnime);
        }
    }
    return randomOptions;
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Function to check the correct answer
function checkCorrectAns() {
    const userAns = document.querySelector('input[name="question1"]:checked');
    if (!userAns) {
    document.getElementById("textToChange").innerText = "Please select an answer!";
    document.getElementById("textToChange").style.color = "red";
    document.getElementById("textToChange").style.textDecoration = "underline";
    return;
    }

    if (userAns.value === correctAnswer) {
    score++;
    document.getElementById("textToChange").style.textDecoration = "none"
    document.getElementById("textToChange").innerText = "Sugoi-desu! ٩(◕‿◕｡)۶ You got it right! Keep it up!";
    document.getElementById("textToChange").style.color = "green";
    } else {
    document.getElementById("textToChange").style.textDecoration = "none"
    document.getElementById("textToChange").innerText = `Gomen... (；一_一) Try again, kouhai! The correct answer is: ${correctAnswer}`;
    document.getElementById("textToChange").style.color = "red";
    }
    document.getElementById('btn-next').style.display = 'block';
    document.getElementById('btn-submit').style.display = 'none';
}

function refreshPage() {
    questionCount++;
    console.log("Current Question:" + questionCount);

    // Retrieve the username from localStorage
    const username = localStorage.getItem("username") || "Participant";
    console.log("Retrieved username:". username);

    if (questionCount > questionLimit) {
        document.getElementById("btn-next").style.display = "none";
        document.getElementById("btn-submit").style.display = "none";

        // Update result line to include the username
        document.getElementById("textToChange").innerText = 
            `Quiz completed! Thank you, ${username}, for participating! Your score is: ${score}/${questionLimit}`;

        document.getElementById("btn-retry").style.display = "block";
        return;
    }

    // Reset the form and prepare for the next question
    document.getElementById("btn-submit").style.display = "block";
    document.querySelector("form").reset();
    document.getElementById("btn-next").style.display = "none";
    document.getElementById("textToChange").innerText = "";
    document.getElementById("textToChange").style.textDecoration = "none";

    // Fetch a new anime image (or other functionality)
    fetchAnimeImg();
}

function retryQuiz(){
    questionCount = 0;
    score = 0;

    document.getElementById("btn-retry").style.display = "none";
    document.getElementById("btn-submit").style.display = "block";
    document.querySelector("form").reset();
    document.getElementById("textToChange").innerText = "";
    document.getElementById("textToChange").style.textDecoration = "none";

    fetchAnimeImg();
}

document.getElementById("btn-submit").addEventListener("click", checkCorrectAns);
document.getElementById("btn-next").addEventListener("click", refreshPage);
document.getElementById("btn-retry").addEventListener("click", retryQuiz);

fetchAnimeImg();