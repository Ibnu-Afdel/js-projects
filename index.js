// Initialize LocalStorage
if (!localStorage.getItem("currentAyah")) {
    localStorage.setItem("currentAyah", Math.floor(Math.random() * 6236) + 1);
}

const fetchAyahDetails = async (ayahNumber) => {
    const apiUrlSahih = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/en.sahih`;
    const apiUrlAmharic = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/am.sadiq`;

    try {
        const [responseSahih, responseAmharic] = await Promise.all([
            fetch(apiUrlSahih),
            fetch(apiUrlAmharic),
        ]);

        const dataSahih = await responseSahih.json();
        const dataAmharic = await responseAmharic.json();

        if (dataSahih.status === "OK" && dataAmharic.status === "OK") {
            const { text: ayahTextSahih, surah, numberInSurah } = dataSahih.data;
            const ayahTextAmharic = dataAmharic.data.text;

            document.getElementById("ayah-details").innerHTML = `
                <div class="verse-container">
                    <h2>Sahih International (English)</h2>
                    <p><strong>Surah:</strong> ${surah.englishName}</p>
                    <p><strong>Ayah Number:</strong> ${numberInSurah}</p>
                    <p><strong>Translation:</strong> ${ayahTextSahih}</p>
                </div>
                <div class="translation-container">
                    <h2>Amharic Translation</h2>
                    <p>${ayahTextAmharic}</p>
                </div>`;
        } else {
            document.getElementById("ayah-details").innerHTML =
                "<p>Error: Unable to retrieve the Ayah. Please try again later.</p>";
        }
    } catch (error) {
        document.getElementById("ayah-details").innerHTML =
            "<p>Error: Unable to connect to the API. Please check your internet connection.</p>";
    }
};

const updateAyah = (operation) => {
    let currentAyah = parseInt(localStorage.getItem("currentAyah"));

    if (operation === "random") {
        currentAyah = Math.floor(Math.random() * 6236) + 1;
    } else if (operation === "next" && currentAyah < 6236) {
        currentAyah += 1;
    } else if (operation === "prev" && currentAyah > 1) {
        currentAyah -= 1;
    }

    localStorage.setItem("currentAyah", currentAyah);
    fetchAyahDetails(currentAyah);
};

// Event Listeners
document.getElementById("random-btn").addEventListener("click", () => updateAyah("random"));
document.getElementById("next-btn").addEventListener("click", () => updateAyah("next"));
document.getElementById("prev-btn").addEventListener("click", () => updateAyah("prev"));

// Initial Load
fetchAyahDetails(localStorage.getItem("currentAyah"));
