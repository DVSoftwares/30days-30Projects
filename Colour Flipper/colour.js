const body = document.getElementById('pageBody');
const colourCode = document.getElementById('colourCode');
const copyBtn = document.getElementById('copyBtn');

function changeColour(hexColour) {
    body.style.backgroundColor = hexColour;
    colourCode.textContent = hexColour.toUpperCase();
}
function randomColour() {
    const hexValues = '0123456789ABCDEF';
    let hexColour = '#';
    for (let i = 0; i < 6; i++) {
        hexColour += hexValues[Math.floor(Math.random() * 16)];
    }
    changeColour(hexColour);
}
async function copyToClipboard() {
    const hexColour = colourCode.textContent;
    try{
        await navigator.clipboard.writeText(hexColour);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.replace('bg-gray-500', 'bg-green-500');
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.replace('bg-green-500', 'bg-gray-500');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}