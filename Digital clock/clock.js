const formatToggle = document.getElementById("formatToggle");
const dateDisplay = document.getElementById("dateDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const ampmBadge = document.getElementById("ampmBadge");

let is24HourFormat = false;

function updateClock() {
    const now = new Date();

    const dateOptions = { 
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric' 
    };
    dateDisplay.textContent = now.toLocaleDateString(undefined, dateOptions);  
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    if (is24HourFormat) {
        ampmBadge.classList.add("hidden");
        hours = String(hours).padStart(2, '0');
    } else {
        ampmBadge.classList.remove("hidden");
        const ampm = hours >= 12 ? 'PM' : 'AM';
        ampmBadge.textContent = ampm;

        hours = hours % 12;
        hours = hours ? hours : 12; 
        hours = String(hours).padStart(2, '0');
    }
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}
formatToggle.addEventListener("change", () => {
    is24HourFormat = !is24HourFormat;
    formatToggle.textContent = is24HourFormat ? "Switch to 12-hour format" : "Switch to 24-hour format";
    updateClock();
});
updateClock();
setInterval(updateClock, 1000);