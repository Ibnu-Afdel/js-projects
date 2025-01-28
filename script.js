const MAX_AYAH = 6236;
const MIN_AYAH = 1;
const ayahDetailsDiv = document.getElementById("ayahDetails");

if (!localStorage.getItem("currentAyah")) {
    localStorage.setItem("currentAyah", Math.floor(Math.random() * MAX_AYAH) + 1);
}

async function displayAyah() {
    const currentAyah = localStorage.getItem("currentAyah");

    try {
        const [sahihResponse, amharicResponse] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/ayah/${currentAyah}/en.sahih`),
            fetch(`https://api.alquran.cloud/v1/ayah/${currentAyah}/am.sadiq`)
        ]);

        if (!sahihResponse.ok || !amharicResponse.ok) throw new Error("API Error");

        const sahihData = await sahihResponse.json();
        const amharicData = await amharicResponse.json();

        if (sahihData.status === "OK" && amharicData.status === "OK") {
            const ayahTextSahih = sahihData.data.text;
            const surahNameSahih = sahihData.data.surah.englishName;
            const ayahNumberSahih = sahihData.data.numberInSurah;

            const ayahTextAmharic = amharicData.data.text;

            ayahDetailsDiv.innerHTML = `
                <div class="verse-container">
                    <h2>Sahih International (English)</h2>
                    <p><strong>Surah:</strong> ${surahNameSahih}</p>
                    <p><strong>Ayah Number:</strong> ${ayahNumberSahih}</p>
                    <p><strong>Translation:</strong> ${ayahTextSahih}</p>
                </div>
                <div class="translation-container">
                    <h2>Amharic Translation</h2>
                    <p>${ayahTextAmharic}</p>
                </div>
            `;
        } else {
            throw new Error("Invalid response data");
        }
    } catch (error) {
        ayahDetailsDiv.innerHTML = `<p>Error: Unable to retrieve the Ayah. Please try again later.</p>`;
        console.error(error);
    }
}

function updateAyah(action) {
    let currentAyah = parseInt(localStorage.getItem("currentAyah"), 10);

    if (action === "random") {
        currentAyah = Math.floor(Math.random() * MAX_AYAH) + 1;
    } else if (action === "next" && currentAyah < MAX_AYAH) {
        currentAyah += 1;
    } else if (action === "prev" && currentAyah > MIN_AYAH) {
        currentAyah -= 1;
    }

    localStorage.setItem("currentAyah", currentAyah);
    displayAyah();
}

document.getElementById("randomBtn").addEventListener("click", () => updateAyah("random"));
document.getElementById("prevBtn").addEventListener("click", () => updateAyah("prev"));
document.getElementById("nextBtn").addEventListener("click", () => updateAyah("next"));

displayAyah();
