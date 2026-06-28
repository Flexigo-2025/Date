let current = 1;

function next(n){
  document.querySelector(".screen.active").classList.remove("active");
  document.getElementById("screen"+n).classList.add("active");
  current = n;

  if(n === 2) typeWriter();
  if(n === 4) loadOptions();
}

function typeWriter(){
  const text = "Some people quietly become special without trying... and you are one of them ❤️";
  let i = 0;
  let el = document.getElementById("typeText");

  let interval = setInterval(()=>{
    el.innerHTML += text[i];
    i++;
    if(i >= text.length) clearInterval(interval);
  }, 30);
}

/* YES / NO GAME */

let noClicks = 0;
let reasons = [
  "Are you sure? 😏",
  "Think again 💕",
  "You smiled just now 😌",
  "Okay but I’ll wait ❤️",
  "Last chance 🥺"
];

function no(){
  document.getElementById("reaction").innerText =
    reasons[Math.min(noClicks, reasons.length-1)];
  noClicks++;
}

function yes(){
  next(4);
}

/* OPTIONS */

let selected = [];

function loadOptions(){
  const acts = ["Coffee","Food","Walk","Movie","Drive","Ice Cream"];
  const comp = ["Hold Hands","Hug","Kiss","Waist Hold"];

  let a = document.getElementById("activities");
  let c = document.getElementById("comp");

  a.innerHTML = "";
  c.innerHTML = "";

  acts.forEach(x=>{
    let d = document.createElement("div");
    d.className = "item";
    d.innerText = x;
    d.onclick = ()=> d.classList.toggle("selected");
    a.appendChild(d);
  });

  comp.forEach(x=>{
    let d = document.createElement("div");
    d.className = "item";
    d.innerText = x;
    d.onclick = ()=> d.classList.toggle("selected");
    c.appendChild(d);
  });
}

/* CONFIRM */

function confirmDate(){
  let date = document.getElementById("date").value;
  let time = document.getElementById("time").value;

  let items = document.querySelectorAll(".item.selected");

  let list = "";
  items.forEach(i=>{
    list += "<p>"+i.innerText+"</p>";
  });

  document.getElementById("summary").innerHTML = `
    <h3>${date} ${time}</h3>
    ${list}
    <p>💌 Note saved ❤️</p>
  `;

  next(5);
}

/* DOWNLOAD */

function download(){
  window.print();
}
