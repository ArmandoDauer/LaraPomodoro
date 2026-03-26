let sessions = JSON.parse(localStorage.getItem("sessions")) || [
{type:"focus",time:25},
{type:"relax",time:5}
]

let tempSessions=[...sessions]

let currentSession=0
let timer
let remaining
let total
let paused=false

let focusMinutesToday = parseInt(localStorage.getItem("focusStats")) || 0

document.getElementById("focusStats").innerText=focusMinutesToday

const progressCircle=document.querySelector(".progress")
const circumference=2*Math.PI*120

progressCircle.style.strokeDasharray=circumference


function updateClock(){

let minutes=Math.floor(remaining/60)
let seconds=remaining%60

document.getElementById("time").innerText=
String(minutes).padStart(2,"0")+":"+
String(seconds).padStart(2,"0")

let offset=circumference-(remaining/total)*circumference
progressCircle.style.strokeDashoffset=offset

}


function startTimer(){

paused=false
clearInterval(timer)
document.getElementById("pauseBtn").innerText = "Pause"

let session=sessions[currentSession]

remaining=session.time*60
total=remaining

switchMode(session.type)

updateClock()

runTimer()

}


function runTimer(){

timer=setInterval(()=>{

if(paused) return

remaining--

updateClock()

if(remaining<=0){

if(sessions[currentSession].type==="focus"){

focusMinutesToday+=sessions[currentSession].time
localStorage.setItem("focusStats",focusMinutesToday)
document.getElementById("focusStats").innerText=focusMinutesToday

}

currentSession++

if(currentSession>=sessions.length){
currentSession=0
}

startTimer()

}

},1000)

}


function pauseTimer(){

const btn = document.getElementById("pauseBtn")

if(!paused){

  paused = true
  document.getElementById("focusMusic").pause()
  document.getElementById("relaxMusic").pause()
  btn.innerText = "Continue"

} else {

  paused = false
  btn.innerText = "Pause"

  const currentType = sessions[currentSession].type
  if(currentType === "focus"){
    document.getElementById("focusMusic").play()
  } else {
    document.getElementById("relaxMusic").play()
  }

}

}


function switchMode(type){

const panda=document.getElementById("panda")

const focusMusic=document.getElementById("focusMusic")
const relaxMusic=document.getElementById("relaxMusic")

focusMusic.pause()
relaxMusic.pause()

panda.classList.add("bounce")

setTimeout(()=>panda.classList.remove("bounce"),300)

if(type==="focus"){

panda.src="img/focus.png"
document.getElementById("mode").innerText="Stay Focused"
focusMusic.play()

}else{

panda.src="img/relax.png"
document.getElementById("mode").innerText="Relax Time"
relaxMusic.play()

}

}


/* popup builder */

function openPopup(){

document.getElementById("sessionPopup").style.display="flex"
tempSessions=[...sessions]
renderMap()

}

function addSession(type){

let time=prompt("Enter minutes")

if(!time) return

tempSessions.push({type:type,time:parseInt(time)})

renderMap()

}

function clearSessions(){

tempSessions=[]
renderMap()

}

function saveSessions(){

sessions=[...tempSessions]

localStorage.setItem("sessions",JSON.stringify(sessions))

document.getElementById("sessionPopup").style.display="none"

currentSession=0

}

function renderMap(){

const map=document.getElementById("sessionMap")
map.innerHTML=""

tempSessions.forEach((s,i)=>{

let b=document.createElement("div")
b.classList.add("balloon")

if(s.type==="focus"){
b.classList.add("focusBalloon")
b.innerText=`Focus ${s.time}m`
}else{
b.classList.add("relaxBalloon")
b.innerText=`Relax ${s.time}m`
}

map.appendChild(b)

if(i<tempSessions.length-1){

let a=document.createElement("div")
a.classList.add("arrow")
a.innerText="→"

map.appendChild(a)

}

})

}


/* sakura generator */

function createPetal(){

const petal=document.createElement("div")
petal.classList.add("petal")

petal.style.left=Math.random()*100+"vw"

petal.style.animationDuration=(5+Math.random()*5)+"s"

petal.style.opacity=Math.random()

document.getElementById("petals").appendChild(petal)

setTimeout(()=>petal.remove(),10000)

}

setInterval(createPetal,300)
