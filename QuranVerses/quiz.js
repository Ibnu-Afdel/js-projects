let score = parseInt(localStorage.getItem("score") || "0");
let correctAnswer = "";

const fetchQuizData = async () => {
    const currentAyah = Math.floor(Math.random() * 6236) + 1;
    const apiUrl = `https://api.alquran.cloud/v1/ayah/${currentAyah}/en.sahih`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "OK") {
            const { text: ayahText, surah, numberInSurah} = data.data;
            correctAnswer = surah.englishName;

            document.getElementById("ayah-text").innerText = ayahText;
            
            document.getElementById("ayah-number").innerText = `Surah: ${surah.englishName}, Ayah: ${numberInSurah}`;

            const allSurahs = await fetch("https://api.alquran.cloud/v1/surah").then((res) =>
                res.json()
            );

            if (allSurahs.status === "OK") {
                const surahOptions = [correctAnswer];
                while (surahOptions.length < 4) {
                    const randomSurah =
                        allSurahs.data[Math.floor(Math.random() * allSurahs.data.length)].englishName;
                    if (!surahOptions.includes(randomSurah)) surahOptions.push(randomSurah);
                }
                surahOptions.sort(() => Math.random() - 0.5);

                const optionsHtml = surahOptions
                    .map(
                        (surah) =>
                            `<label class="option">
                                <input type="radio" name="surah" value="${surah}" required>
                                ${surah}
                            </label>`
                    )
                    .join("");
                document.getElementById("options").innerHTML = optionsHtml;

                // Reset result message and styling
                document.getElementById("result-message").innerHTML = "";
                document.getElementById("next-button").style.display = "none";
                document.getElementById("quiz-form").reset();
            }
        }
    } catch (error) {
        console.error(error);
    }
};

document.getElementById("quiz-form").addEventListener("change", (e) => {
    const userAnswer = e.target.value;

    // Highlight correct and incorrect options
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
        const input = option.querySelector("input");
        option.classList.remove("correct", "incorrect");
        if (input.value === correctAnswer) {
            option.classList.add("correct");
        } else if (input.checked) {
            option.classList.add("incorrect");
        }
    });

    // Fetch current Ayah text and Ayah number
    const ayahText = document.getElementById("ayah-text").innerText;
    const ayahNumber = document.getElementById("ayah-number").innerText;

    const resultMessage = document.getElementById("result-message");
    if (userAnswer === correctAnswer) {
        score++;
        resultMessage.innerHTML = `
            <div class="result correct">
                <p><strong>Correct!</strong></p>
                <p>The Ayah text was:</p>
                <blockquote>${ayahText}</blockquote>
                <p>${ayahNumber}</p>
            </div>`;
    } else {
        score--;
        resultMessage.innerHTML = `
            <div class="result incorrect">
                <p><strong>Incorrect!</strong></p>
                <p>You chose: <em>${userAnswer}</em></p>
                <p>The correct answer is: <em>${correctAnswer}</em></p>
                <p>The Ayah text was:</p>
                <blockquote>${ayahText}</blockquote>
                <p>${ayahNumber}</p>
            </div>`;
    }

    // Update score
    document.getElementById("score").innerText = score;
    localStorage.setItem("score", score);

    // Show the "Next" button
    document.getElementById("next-button").style.display = "block";
});


// Handle the Next button
document.getElementById("next-button").addEventListener("click", () => {
    fetchQuizData();
});

// Initial Load
fetchQuizData();
