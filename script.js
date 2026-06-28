/* ==========================================
   ONE TINY QUESTION ❤️
   PREMIUM VERSION - PART 1
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

const stories = [

{
button:"🙈 Hmm...",
title:"🤍 Little Secret #1",
text:`
Good conversations are rare...

Yet somehow...

ours never feel long enough.

Maybe...

it's time we continue one

over coffee instead. ☕❤️`
},

{
button:"🤔 Still Thinking...",
title:"🌸 Little Promise #2",
text:`
You choose the café.

I'll happily pretend

your coffee order

doesn't confuse me...

and I promise

not to steal your dessert.

...unless it looks amazing. 🍰😏`
},

{
button:"😅 Maybe...",
title:"✨ Tiny Confession #3",
text:`
I genuinely believe...

one random evening

with you

could become

one of those memories

we randomly smile about

months later. 🌇❤️`
},

{
button:"🙃 Convince Me...",
title:"😂 Friendly Deal #4",
text:`
If I don't make you laugh

at least three times...

Dessert

is completely on me.

That's an official deal. 🤝🍰`
},

{
button:"🤭 One More...",
title:"💖 Honest Truth #5",
text:`
I can't promise perfection.

But I CAN promise...

good conversations,

terrible jokes,

lots of laughs,

and a day

worth remembering. ❤️`
},

{
button:"🥺 Last Chance...",
title:"🌹 Final Reason",
text:`
I've officially

run out of clever reasons...

because the biggest one

is actually

very simple.

I'd really...

really enjoy

spending that day

with you. ❤️`
}

];

const yesTexts=[

"❤️ Yes!",

"💕 Maybe Yes",

"🥰 Sounds Nice",

"☕ Coffee? Sure!",

"🌸 Let's Go",

"💖 You Win",

"❤️ Okay... Yes"

];

/* ==============================
SCREEN CHANGE
============================== */

function showScreen(index){

screens.forEach(screen=>{

screen.classList.remove("active");

});

screens[index].classList.add("active");

currentScreen=index;

}

startBtn.addEventListener("click",()=>{

showScreen(1);

playMusic();

});

nextBtn.addEventListener("click",()=>{

showScreen(2);

});

/* ==============================
MUSIC
============================== */

let musicPlaying=false;

function playMusic(){

if(!musicPlaying){

music.play().catch(()=>{});

musicPlaying=true;

}

}

musicBtn.addEventListener("click",()=>{

if(music.paused){

music.play();

musicBtn.innerHTML="🎵";

}else{

music.pause();

musicBtn.innerHTML="🔇";

}

});

/* ==========================================
HMM BUTTON
========================================== */

hmmBtn.addEventListener("click",()=>{

if(hmmClicks<stories.length){

message.innerHTML=`

<h3>${stories[hmmClicks].title}</h3>

<p>${stories[hmmClicks].text}</p>

`;

hmmBtn.innerHTML=stories[hmmClicks].button;

}

/* YES grows slowly */

let scale=Math.min(1.30,1+hmmClicks*0.05);

yesBtn.style.transform=`scale(${scale})`;

if(hmmClicks<yesTexts.length){

yesBtn.innerHTML=yesTexts[hmmClicks];

}

/* NO shrinks slowly */

let noScale=Math.max(0.20,1-hmmClicks*0.12);

hmmBtn.style.transform=`scale(${noScale})`;

/* Safe mobile movement */

const positions=[

{x:0,y:0},

{x:20,y:-10},

{x:-20,y:10},

{x:25,y:18},

{x:-25,y:-18},

{x:12,y:-22},

{x:-12,y:22}

];

const p=positions[hmmClicks%positions.length];

hmmBtn.style.position="relative";

hmmBtn.style.left=p.x+"px";

hmmBtn.style.top=p.y+"px";

/* Dreamier background */

document.body.style.background=`
linear-gradient(
135deg,
#ffe4ef,
#f7e8ff,
#fff8eb,
#ffeff8
)`;

/* Floating heart */

createHeart();

hmmClicks++;
/* ==============================
SPECIAL ENDINGS
============================== */

if(hmmClicks==6){

message.innerHTML=`

<h3>🥺 Uh Oh...</h3>

<p>

My <b>"No"</b> button...

has started losing confidence.

<br><br>

I think it's secretly hoping

you'll give me

one tiny chance. ❤️

</p>

`;

}

if(hmmClicks==7){

message.innerHTML=`

<h3>🌸 Tiny Confession</h3>

<p>

This little button

pulled me aside...

and whispered...

<br><br>

<b>

"I'd honestly press Yes

if I could."

</b>

🥺❤️

</p>

`;

hmmBtn.style.opacity="0.35";

}

if(hmmClicks>=8){

message.innerHTML=`

<h3>💖 Final Little Reason</h3>

<p>

Looks like...

the <b>No</b> button

has officially retired.

<br><br>

It simply couldn't find

enough reasons

to stay.

<br><br>

Maybe...

it's time

we create

one beautiful memory

together. ❤️✨

</p>

`;

hmmBtn.style.display="none";

yesBtn.style.transform="scale(1.35)";

yesBtn.innerHTML="💖 Yes... Let's Make A Memory";

}

});

/* ==========================================
FLOATING HEART EFFECT
========================================== */

function createHeart(){

const emojis=[

"❤️",

"💖",

"💕",

"🌸",

"✨"

];

const heart=document.createElement("div");

heart.innerHTML=

emojis[Math.floor(Math.random()*emojis.length)];

heart.style.position="fixed";

heart.style.left=Math.random()*window.innerWidth+"px";

heart.style.top=(window.innerHeight-80)+"px";

heart.style.fontSize=(20+Math.random()*20)+"px";

heart.style.pointerEvents="none";

heart.style.transition="2.5s ease";

heart.style.zIndex="999";

document.body.appendChild(heart);

setTimeout(()=>{

heart.style.transform=`
translateY(-${250+Math.random()*150}px)
rotate(${Math.random()*180-90}deg)
scale(2)
`;

heart.style.opacity="0";

},50);

setTimeout(()=>{

heart.remove();

},2600);

}
/* ==========================================
   YES BUTTON ❤️
========================================== */

yesBtn.addEventListener("click",()=>{

// Heart burst

for(let i=0;i<25;i++){

createHeart();

}

// Fade screen

document.querySelector(".ask-content").style.animation=
"fadeOut 0.8s forwards";

setTimeout(()=>{

document.querySelector(".ask-content").innerHTML=`

<div class="celebrate">

<h2 class="loaderTitle">

✨ Processing the happiest decision of today... ✨

</h2>

<div class="loveLoader">

<div class="loveFill"></div>

</div>

<p class="loaderText">

Reserving one unforgettable memory...

☕❤️🌇

</p>

</div>

`;

},700);

setTimeout(()=>{

document.querySelector(".ask-content").innerHTML=`

<div class="celebrate">

<h1 class="yay">

YAYYYYY!! ❤️

</h1>

<h2>

You just made my entire day brighter.

☀️

</h2>

<br>

<p>

Here's my little promise...

</p>

<br>

<p>

😂 Terrible jokes.

<br>

☕ Endless conversations.

<br>

🍰 Dessert negotiations.

<br>

🌇 A beautiful evening.

<br>

❤️ And hopefully...

the first of many wonderful memories.

</p>

<br><br>

<button

id="beginAdventure"

class="btn btn-primary btn-large">

🌸 Begin Our Little Adventure

</button>

</div>

`;

createConfetti();

document.getElementById("beginAdventure")
.addEventListener("click", () => {

    showScreen(3); // this will be screen-4 visually

});

},3200);

});
/* ==========================================
FINAL PREMIUM SCENE ❤️
========================================== */

function finalScene(){

createConfetti();

document.body.innerHTML=`

<div class="finalPage">

<div class="sunsetGlow"></div>

<h1 class="finalTitle">

🌅 Our Little Adventure Begins...

</h1>

<p class="finalText">

One coffee.

One walk.

A few terrible jokes.

Lots of random conversations.

And hopefully...

one memory

that randomly makes us smile

months from now.

❤️

</p>

<div class="datePass">

<h2>

✨ PREMIUM DATE PASS ✨

</h2>

<div class="passLine"></div>

<p>

👩 VIP Guest

<br><br>

☕ Unlimited Conversations

<br>

🍰 Dessert Sharing Rights

<br>

😂 Unlimited Laughs

<br>

🌇 Sunset Included

<br>

❤️ Great Company Guaranteed

</p>

<div class="passLine"></div>

<p>

Valid For:

One unforgettable evening.

</p>

</div>

<button
class="btn btn-primary btn-large"

onclick="location.reload()">

❤️ Replay Our Story

</button>

</div>

`;

}

        /* ADD SCREEN 4 SUPPORT */
const screen4 = document.querySelector(".screen-4"); 
let selectedPlan = "";

/* PLAN SELECT */
document.addEventListener("click", (e) => {

    if (e.target.classList.contains("option")) {

        document.querySelectorAll(".option").forEach(o =>
            o.classList.remove("active")
        );

        e.target.classList.add("active");
        selectedPlan = e.target.innerText;

    }
});
document.addEventListener("click", (e) => {

    if (e.target.id === "confirmDateBtn") {

        const date = document.getElementById("datePicker").value;
        const time = document.getElementById("timePicker").value;

        if (!date || !time || !selectedPlan) {
            alert("Complete everything ❤️");
            return;
        }

        e.target.innerText = "Reserving... ❤️";

        setTimeout(() => {

            document.body.innerHTML = `

            <div class="finalPage">

                <div class="sunsetGlow"></div>

                <h1 class="finalTitle">
                    🌸 Date Confirmed
                </h1>

                <div class="datePass">

                    <h2>✨ VIP DATE PASS ✨</h2>

                    <div class="passLine"></div>

                    <p>
                    📅 ${date}<br>
                    🕒 ${time}<br>
                    💕 ${selectedPlan}
                    </p>

                    <div class="passLine"></div>

                    <p>
                    Status: CONFIRMED ❤️
                    </p>

                </div>

                <button class="btn btn-primary" onclick="finalScene()">
                    🌅 Continue Story
                </button>

            </div>

            `;

        }, 2500);
    }
});
