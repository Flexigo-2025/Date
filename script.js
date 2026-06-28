/* ==========================================
   ONE TINY QUESTION ❤️
   PART 1
========================================== */

const screens = document.querySelectorAll(".screen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");

const yesBtn = document.getElementById("yesBtn");
const hmmBtn = document.getElementById("hmmBtn");

const message = document.getElementById("pleadingMessage");

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let currentScreen = 0;

let hmmClicks = 0;

const romanticLines = [

"Awww... don't make me use my best flirting skills already. 🥺❤️",

"I may or may not have already picked a café where we can argue about desserts. 🍰😌",

"Imagine us laughing over absolutely nothing... sounds like a pretty good day, doesn't it? ✨",

"My little heart keeps whispering... 'Maybe she'll say yes this time.' 🥺❤️",

"One coffee ☕ One walk 🌇 One beautiful memory ❤️",

"Okay okay... last try... pretty please? 🥺👉👈"

];


/* ==============================
   Screen Change
============================== */

function showScreen(index){

screens.forEach(screen=>{

screen.classList.remove("active");

});

screens[index].classList.add("active");

currentScreen=index;

}


/* ==============================
   Buttons
============================== */

startBtn.addEventListener("click",()=>{

showScreen(1);

playMusic();

});


nextBtn.addEventListener("click",()=>{

showScreen(2);

});


/* ==============================
   Music
============================== */

let musicPlaying=false;

function playMusic(){

if(!musicPlaying){

music.play();

musicPlaying=true;

}

}

musicBtn.addEventListener("click",()=>{

if(music.paused){

music.play();

musicBtn.innerHTML="🎵";

}

else{

music.pause();

musicBtn.innerHTML="🔇";

}

});

/* ==========================================
   HMM BUTTON MAGIC ❤️
========================================== */

hmmBtn.addEventListener("click", () => {

    if(hmmClicks < romanticLines.length){

        message.innerHTML = romanticLines[hmmClicks];

    }

    hmmClicks++;

    // Yes button becomes larger
    let scale = 1 + (hmmClicks * 0.12);
    yesBtn.style.transform = `scale(${scale})`;

    // Hmm button becomes smaller
    let hmmScale = Math.max(0.35, 1 - (hmmClicks * 0.12));
    hmmBtn.style.transform = `scale(${hmmScale})`;

    // Move Hmm button randomly

    const x = Math.random() * 180 - 90;
    const y = Math.random() * 120 - 60;

    hmmBtn.style.left = `${x}px`;
    hmmBtn.style.top = `${y}px`;

    // Background slowly becomes dreamier

    document.body.style.background = `
    linear-gradient(
    135deg,
    #ffd6ea,
    #f3d9ff,
    #ffe8f3,
    #fff5d9
    )
    `;

    // Tiny Heart Pop ❤️

    createHeart();

    // Last Click

    if(hmmClicks >= romanticLines.length){

        message.innerHTML =

        "🥺❤️ At this point...<br><br>I think even the stars are waiting for a Yes.";

        hmmBtn.innerHTML = "🙈 Oops...";

    }

});


/* ==========================================
   HEART POP EFFECT
========================================== */

function createHeart(){

    const heart=document.createElement("div");

    heart.innerHTML="❤️";

    heart.style.position="fixed";

    heart.style.left=Math.random()*window.innerWidth+"px";

    heart.style.top=(window.innerHeight-100)+"px";

    heart.style.fontSize=(20+Math.random()*20)+"px";

    heart.style.pointerEvents="none";

    heart.style.transition="2.5s ease";

    document.body.appendChild(heart);

    setTimeout(()=>{

        heart.style.transform=
        "translateY(-350px) scale(1.8)";

        heart.style.opacity="0";

    },50);

    setTimeout(()=>{

        heart.remove();

    },2500);

}

/* ==========================================
   YES BUTTON CELEBRATION ❤️
========================================== */

yesBtn.addEventListener("click", () => {

    // Hide question
    document.querySelector(".ask-content").innerHTML = `

        <h2 style="font-size:38px;color:#ff4fa3;">
            Processing the best decision of today... ✨
        </h2>

        <br>

        <div class="loader">

            <div class="loader-fill"></div>

        </div>

        <br>

        <p style="font-size:20px;color:#666;">
            Just getting everything ready... ❤️
        </p>

    `;

    createConfetti();

    setTimeout(() => {

        document.querySelector(".ask-content").innerHTML = `

        <h1 style="
        font-size:58px;
        color:#ff3d93;
        margin-bottom:20px;
        ">

        YAYYY!! ❤️

        </h1>

        <p style="
        font-size:22px;
        line-height:1.8;
        color:#555;
        ">

        You just made my day a whole lot brighter. ☀️

        <br><br>

        I promise...

        lots of laughs 😂

        good food 🍕🍰

        random conversations ☕

        and hopefully...

        one beautiful memory we'll both smile about later. 🌸

        </p>

        <br><br>

        <button
        id="finalBtn"
        class="btn btn-primary">

        Let's Plan Our Date ✨

        </button>

        `;

        document.getElementById("finalBtn")
        .addEventListener("click", finalScene);

    },2500);

});


/* ==========================================
   FINAL SCENE
========================================== */

function finalScene(){

document.body.innerHTML=`

<div style="

display:flex;
justify-content:center;
align-items:center;
flex-direction:column;

height:100vh;

text-align:center;

background:
linear-gradient(
135deg,
#ffcadf,
#ffd9a8,
#ffeec9,
#fff7ef);

font-family:Poppins;

padding:30px;

">

<h1 style="

font-size:52px;

color:#ff3d93;

margin-bottom:25px;

">

🌅

</h1>

<h2 style="

font-size:34px;

color:#444;

">

Our first adventure officially begins now... ❤️

</h2>

<p style="

margin-top:25px;

font-size:22px;

line-height:1.8;

color:#555;

max-width:700px;

">

Here's to one coffee...

one walk...

countless laughs...

and a memory we'll randomly remember months from now with a smile. 🌸

</p>

<h3 style="

margin-top:45px;

color:#ff4fa3;

font-size:28px;

">

Date Ticket 🎫

</h3>

<p style="

font-size:20px;

margin-top:15px;

">

✅ Valid For:

<br><br>

☕ One Coffee

<br>

🌇 One Walk

<br>

😂 Unlimited Laughs

<br>

❤️ Great Company

</p>

</div>

`;

}


/* ==========================================
   SIMPLE CONFETTI
========================================== */

function createConfetti(){

for(let i=0;i<150;i++){

const conf=document.createElement("div");

conf.innerHTML=["❤️","🌸","✨","💖","🎉"][Math.floor(Math.random()*5)];

conf.style.position="fixed";

conf.style.left=Math.random()*100+"vw";

conf.style.top="-50px";

conf.style.fontSize=(16+Math.random()*20)+"px";

conf.style.transition="4s linear";

document.body.appendChild(conf);

setTimeout(()=>{

conf.style.transform=`translateY(${window.innerHeight+100}px)
rotate(${Math.random()*720}deg)`;

conf.style.opacity="0";

},50);

setTimeout(()=>{

conf.remove();

},4200);

}

}
