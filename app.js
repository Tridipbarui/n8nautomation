console.log("LeadPilot AI Loaded");

const buttons=document.querySelectorAll("button");

buttons.forEach(btn=>{

btn.addEventListener("click",()=>{

console.log(btn.innerText);

});

});