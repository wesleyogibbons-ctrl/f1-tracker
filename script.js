const COLS = 5
const ROW_HEIGHT = 85
const MIDDLE_OUT = [2,3,1,4,0]

let debug=false

function toggleDebug(){

debug=!debug

document.querySelectorAll(".track").forEach(t=>{
t.classList.toggle("debugGrid",debug)
})

}

const TEAM_COLORS = {

red_bull:"#1E41FF",
ferrari:"#DC0000",
mercedes:"#00D2BE",
mclaren:"#FF8700",
aston_martin:"#006F62",
alpine:"#0090FF",
williams:"#005AFF",
rb:"#2B4562",
sauber:"#52E252",
haas:"#B6BABD",
audi:"#A60000",
cadillac:"#002E6D"

}

function createGrid(rows){

let grid=[]

for(let r=0;r<rows;r++){

grid[r]=Array(COLS).fill(false)

}

return grid

}

function placeCar(points,grid){

let row = Math.floor(points)

for(let offset=0; offset<grid.length; offset++){

let r = row + offset
if(r>=grid.length) break

for(let c of MIDDLE_OUT){

if(!grid[r][c]){

grid[r][c]=true
return {row:r,col:c}

}

}

}

return {row:0,col:0}

}

function createCar(track,item){

let el = document.createElement("div")
el.className="car"

let label = document.createElement("div")
label.className="label"
label.innerText=item.name

el.appendChild(label)

track.appendChild(el)

return el

}

function updatePositions(data,track){

track.innerHTML=""

let rows = 200
let grid = createGrid(rows)

data.forEach(item=>{

let car = createCar(track,item)

let pos = placeCar(item.points,grid)

let x = pos.col * (track.clientWidth / COLS)
let y = pos.row * ROW_HEIGHT

car.style.transform=`translate(${x}px, ${y}px)`
car.style.backgroundColor = TEAM_COLORS[item.team] || "#888"

})

}

async function updateData(){

try{

let driversRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverStandings.json")
let driversJson = await driversRes.json()

let teamsRes = await fetch("https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json")
let teamsJson = await teamsRes.json()

let drivers = driversJson.MRData.StandingsTable.StandingsLists[0].DriverStandings.map(d=>({

name:d.Driver.familyName,
points:parseInt(d.points),
team:d.Constructors[0].constructorId

}))

let teams = teamsJson.MRData.StandingsTable.StandingsLists[0].ConstructorStandings.map(t=>({

name:t.Constructor.name,
points:parseInt(t.points),
team:t.Constructor.constructorId

}))

updatePositions(drivers,document.getElementById("driversTrack"))
updatePositions(teams,document.getElementById("teamsTrack"))

}
catch(err){

console.error(err)

}

}

updateData()

setInterval(updateData,300000)
