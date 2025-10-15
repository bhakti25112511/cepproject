/* ===========================
   BreatheEasy - script.js
   Core Website Functionality
=========================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
        
        // Close menu when a link is clicked (mobile navigation)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }


    // --- AQI DASHBOARD LOGIC ---

    const aqiCard = document.getElementById('aqiCard');
    const aqiValueEl = document.getElementById('aqiValue');
    const aqiStatusEl = document.getElementById('aqiStatus');
    const aqiDescriptionEl = document.getElementById('aqiDescription');
    const lastUpdatedEl = document.getElementById('lastUpdated');
    const userLocationEl = document.getElementById('userLocation');
    const citySelect = document.getElementById('citySelect');
    const alertSection = document.getElementById('alertSection');
    const alertMessageEl = document.getElementById('alertMessage');
    
    // Pollutant elements
    const pm25ValueEl = document.getElementById('pm25Value');
    const pm10ValueEl = document.getElementById('pm10Value');
    const no2ValueEl = document.getElementById('no2Value');
    const o3ValueEl = document.getElementById('o3Value');
    const pm25BarEl = document.getElementById('pm25Bar');
    const pm10BarEl = document.getElementById('pm10Bar');
    const no2BarEl = document.getElementById('no2Bar');
    const o3BarEl = document.getElementById('o3Bar');


    // 2. Dummy Data (Replace with real API calls later)
    const aqiData = {
        Sangamner: {
            aqi: 155, status: 'Unhealthy', description: 'Air quality is poor. Active children and adults, and people with respiratory diseases, such as asthma, should limit prolonged outdoor exertion.',
            pm25: 65, pm10: 90, no2: 25, o3: 80, time: new Date().toLocaleTimeString(),
            hourly: [120, 115, 130, 155, 140, 145, 135, 130, 125, 110, 105, 100, 105, 110, 120, 130, 145, 160, 155, 150, 145, 140, 135, 130]
        },
        Nashik: {
            aqi: 78, status: 'Moderate', description: 'Air quality is acceptable. However, there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
            pm25: 20, pm10: 55, no2: 15, o3: 65, time: new Date().toLocaleTimeString(),
            hourly: [60, 65, 70, 75, 78, 80, 75, 70, 68, 65, 60, 55, 60, 65, 70, 75, 80, 85, 90, 85, 80, 75, 70, 65]
        },
        Nagar: {
            aqi: 45, status: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
            pm25: 10, pm10: 25, no2: 8, o3: 30, time: new Date().toLocaleTimeString(),
            hourly: [40, 42, 45, 43, 40, 38, 35, 30, 35, 40, 45, 50, 55, 50, 45, 40, 38, 35, 30, 25, 30, 35, 40, 45]
        },
        Akole: {
            aqi: 22, status: 'Good', description: 'Air quality is satisfactory, and air pollution poses little or no risk.',
            pm25: 5, pm10: 15, no2: 5, o3: 20, time: new Date().toLocaleTimeString(),
            hourly: [20, 22, 25, 23, 20, 18, 15, 12, 15, 20, 25, 30, 35, 30, 25, 20, 18, 15, 12, 10, 15, 20, 22, 25]
        },
        Sinner: {
            aqi: 105, status: 'Unhealthy for Sensitive Groups', description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
            pm25: 35, pm10: 70, no2: 18, o3: 55, time: new Date().toLocaleTimeString(),
            hourly: [80, 85, 90, 95, 105, 100, 95, 90, 85, 80, 75, 70, 75, 80, 85, 90, 95, 100, 105, 110, 105, 100, 95, 90]
        }
    };

    // Helper function to map AQI to class
    function getAqiClass(aqi) {
        if (aqi <= 50) return 'good';
        if (aqi <= 100) return 'moderate';
        if (aqi <= 150) return 'unhealthy-sensitive'; // Unhealthy for sensitive groups
        if (aqi <= 200) return 'unhealthy';
        return 'hazardous';
    }
    
    // Helper function for pollutant bar width (max value for scaling is 100 μg/m³)
    function getBarWidth(value) {
        return Math.min(100, (value / 100) * 100);
    }
    
    // 3. Update Dashboard Function
    function updateDashboard(city) {
        const data = aqiData[city];

        // 3.1 Update AQI Card
        aqiValueEl.textContent = data.aqi;
        aqiStatusEl.textContent = data.status;
        aqiDescriptionEl.textContent = data.description;
        lastUpdatedEl.textContent = data.time;
        userLocationEl.textContent = city;
        
        // Remove existing classes and add new one
        aqiCard.className = 'aqi-card ' + getAqiClass(data.aqi);

        // 3.2 Update Pollutant Data
        pm25ValueEl.textContent = data.pm25;
        pm10ValueEl.textContent = data.pm10;
        no2ValueEl.textContent = data.no2;
        o3ValueEl.textContent = data.o3;
        
        pm25BarEl.style.width = getBarWidth(data.pm25) + '%';
        pm10BarEl.style.width = getBarWidth(data.pm10) + '%';
        no2BarEl.style.width = getBarWidth(data.no2) + '%';
        o3BarEl.style.width = getBarWidth(data.o3) + '%';
        
        // 3.3 Alert System for Asthma Patients (AQI > 100)
        if (data.aqi > 100) {
            alertMessageEl.textContent = High AQI (${data.aqi}) detected. The air quality is ${data.status}. Limit outdoor activities and have your reliever inhaler ready.;
            alertSection.style.display = 'flex';
        } else {
            alertSection.style.display = 'none';
        }

        // 3.4 Update Chart
        updateAqiChart(data.hourly);
    }
    
    // 4. City Selector Listener
    citySelect.addEventListener('change', (e) => {
        updateDashboard(e.target.value);
    });

    // 5. Chart.js Initialization
    let aqiChartInstance = null;
    
    function updateAqiChart(hourlyData) {
        const ctx = document.getElementById('aqiChart').getContext('2d');
        const labels = Array.from({ length: 24 }, (_, i) => ${i % 12 === 0 ? 12 : i % 12}${i < 12 ? 'AM' : 'PM'});

        if (aqiChartInstance) {
            aqiChartInstance.data.datasets[0].data = hourlyData;
            aqiChartInstance.update();
        } else {
            aqiChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'AQI Over 24 Hours',
                        data: hourlyData,
                        borderColor: '#4F46E5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        tension: 0.4,
                        fill: true,
                        pointRadius: 3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: { display: true, text: 'AQI' }
                        },
                        x: {
                            title: { display: true, text: 'Time' }
                        }
                    }
                }
            });
        }
    }

    // --- ASTHMA DIARY LOGIC ---
    
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    const saveDiaryBtn = document.getElementById('saveDiary');
    const peakFlowInput = document.getElementById('peakFlow');
    const symptomsCheckboxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]');
    const diaryNotesTextarea = document.getElementById('diaryNotes');
    const diaryEntriesContainer = document.getElementById('diaryEntries');
    
    let selectedFeeling = null;
    
    // 6. Emoji Selection Handler
    emojiButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove 'selected' from all
            emojiButtons.forEach(b => b.classList.remove('selected'));
            // Add 'selected' to clicked button
            btn.classList.add('selected');
            selectedFeeling = btn.getAttribute('data-feeling');
        });
    });

    // 7. Save Diary Entry Handler
    saveDiaryBtn.addEventListener('click', () => {
        if (!selectedFeeling) {
            alert('Please select how you are feeling.');
            return;
        }

        const peakFlow = peakFlowInput.value;
        const symptoms = Array.from(symptomsCheckboxes)
                            .filter(cb => cb.checked)
                            .map(cb => cb.value)
                            .join(', ') || 'None';
        const notes = diaryNotesTextarea.value.trim();
        const date = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Get current AQI for the entry
        const currentCity = citySelect.value;
        const currentAqi = aqiData[currentCity].aqi;
        const currentAqiStatus = aqiData[currentCity].status;


        const entry = {
            date,
            currentTime,
            feeling: selectedFeeling,
            peakFlow,
            symptoms,
            notes,
            currentCity,
            currentAqi,
            currentAqiStatus
        };

        addDiaryEntryToDisplay(entry);
        
        // Save to local storage (optional, for persistence)
        let entries = JSON.parse(localStorage.getItem('breatheEasyDiary')) || [];
        entries.unshift(entry); // Add to the beginning
        localStorage.setItem('breatheEasyDiary', JSON.stringify(entries));

        // Clear form
        peakFlowInput.value = '';
        diaryNotesTextarea.value = '';
        symptomsCheckboxes.forEach(cb => cb.checked = false);
        emojiButtons.forEach(b => b.classList.remove('selected'));
        selectedFeeling = null;
        alert('Diary entry saved successfully!');
    });
    
    // 8. Display Diary Entries
    function addDiaryEntryToDisplay(entry) {
        const entryDiv = document.createElement('div');
        entryDiv.classList.add('diary-entry');

        entryDiv.innerHTML = `
            <div class="entry-header">
                <span>${entry.date} at ${entry.currentTime}</span>
                <span>Feeling: <span class="feeling-${entry.feeling}">${getEmoji(entry.feeling)}</span></span>
            </div>
            <div class="entry-details">
                <div><strong>Peak Flow:</strong> ${entry.peakFlow || '--'} L/min</div>
                <div><strong>Symptoms:</strong> ${entry.symptoms}</div>
                <div><strong>Location/AQI:</strong> ${entry.currentCity} (${entry.currentAqi} - ${entry.currentAqiStatus})</div>
                ${entry.notes ? <div class="entry-notes">Notes: ${entry.notes}</div> : ''}
            </div>
        `;
        // Insert as the first child
        diaryEntriesContainer.prepend(entryDiv);
    }
    
    function getEmoji(feeling) {
        switch (feeling) {
            case 'great': return '😊';
            case 'good': return '🙂';
            case 'okay': return '😐';
            case 'poor': return '😟';
            case 'bad': return '😰';
            default: return '❓';
        }
    }

    // 9. Load entries on startup
    function loadDiaryEntries() {
        const entries = JSON.parse(localStorage.getItem('breatheEasyDiary')) || [];
        entries.forEach(addDiaryEntryToDisplay);
    }

    // --- INITIALIZATION ---
    // Load initial data and diary
    updateDashboard(citySelect.value); // Load data for the default selected city
    loadDiaryEntries();
});
