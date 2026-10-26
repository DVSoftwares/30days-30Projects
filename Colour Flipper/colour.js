const body = document.getElementsByTagName('body')[0];

function changeColor(color){
    body.style.backgroundColor = color;
}
function randomColor(){
    const red = Math.floor(Math.random() * 255);
    const green = Math.floor(Math.random() * 255);
    const blue = Math.floor(Math.random() * 255);
    const color = `rgb(${red}, ${green}, ${blue})`; 
    body.style.backgroundColor = color;
}