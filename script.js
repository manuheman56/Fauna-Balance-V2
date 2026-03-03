let totalPlayers = 0;
let currentPlayer = 1;
let allScores = [];

function initApp(num) {
    totalPlayers = num;
    currentPlayer = 1;
    allScores = [];
    document.getElementById('welcome-screen').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    updateUI();
}

function nextStep(n) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step${n}`).classList.add('active');
    document.getElementById('step-indicator').innerText = `PASO ${n}/4`;
}

function updateUI() {
    document.getElementById('player-indicator').innerText = `RECUENTO: JUGADOR ${currentPlayer} de ${totalPlayers}`;
    document.getElementById('finish-btn').innerText = currentPlayer < totalPlayers ? `GUARDAR JUGADOR ${currentPlayer} ➔` : "VER RESULTADOS FINALES 🏆";
}

// Carga dinámica de Fauna
window.onload = () => {
    const grid = document.getElementById('fauna-grid');
    for(let i=1; i<=9; i++) {
        grid.innerHTML += `
            <div class="bg-white rounded-2xl p-2 text-center shadow-sm border border-amber-200">
                <img src="assets/FAUNA${i}.png" class="w-full aspect-square rounded-xl object-cover mb-2">
                <input type="number" placeholder="Pts" class="fauna-input w-full p-1 text-center text-sm font-bold bg-amber-50 rounded-lg">
            </div>`;
    }
};

function savePlayerData() {
    // 1. PAISAJES [8, 10, 11]
    const trees = (Number(document.getElementById('t1').value)||0)*1 + (Number(document.getElementById('t2').value)||0)*3 + (Number(document.getElementById('t3').value)||0)*7;
    const mnt = (Number(document.getElementById('m2').value)||0)*3 + (Number(document.getElementById('m3').value)||0)*7;
    const fields = (Number(document.getElementById('fld').value)||0)*5;
    const buildings = (Number(document.getElementById('bld').value)||0)*5;
    
    // 2. AGUA (Regla +4 a partir de 6) [12]
    const wVal = Number(document.getElementById('w-val').value)||0;
    const water = document.getElementById('w-mode').value === 'A' 
        ? (wVal <= 2 ? 0 : wVal === 3 ? 5 : wVal === 4 ? 8 : wVal === 5 ? 11 : wVal === 15 ? 15 : 15 + (wVal-6)*4)
        : wVal * 5;

    // 3. FAUNA Y ESPÍRITUS [5, 13]
    let fauna = 0;
    document.querySelectorAll('.fauna-input').forEach(i => fauna += Number(i.value)||0);
    let spirit = document.getElementById('spirit-check').checked ? (Number(document.getElementById('spirit-pts').value)||0) : 0;
    
    const total = trees + mnt + fields + buildings + water + fauna + spirit;
    const cubes = Number(document.getElementById('tie-cubes').value)||0;

    allScores.push({ player: currentPlayer, points: total, cubes: cubes, sideA: document.getElementById('w-mode').value === 'A', spirit: document.getElementById('spirit-check').checked });

    if(currentPlayer < totalPlayers) {
        currentPlayer++;
        resetInputs();
        updateUI();
        nextStep(1);
        window.scrollTo(0,0);
    } else {
        showRanking();
    }
}

function showRanking() {
    // Ordenar por puntos, luego por cubos (Desempate oficial [4])
    allScores.sort((a,b) => b.points - a.points || b.cubes - a.cubes);
    
    let html = `<h3 class="text-2xl font-black italic uppercase tracking-tighter text-slate-800">Balance Final</h3>`;
    allScores.forEach((s, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '👤';
        html += `<div class="flex justify-between items-center bg-slate-800 p-5 rounded-3xl text-white shadow-lg border border-slate-700">
                    <div class="text-left"><p class="text-[10px] font-bold text-slate-400 uppercase">Puesto ${i+1}</p><p class="font-black italic">${medal} JUGADOR ${s.player}</p></div>
                    <div class="text-right text-amber-400 font-black text-3xl">${s.points}<span class="text-xs ml-1">pts</span></div>
                 </div>`;
    });

    if(totalPlayers === 1) {
        calculateSoloSoles(allScores);
    }

    document.getElementById('ranking-list').innerHTML = html;
    nextStep(4);
}

function calculateSoloSoles(s) {
    const table = { 40:1, 70:2, 90:3, 110:4, 130:5, 140:6, 150:7, 160:8 };
    let count = 0;
    Object.keys(table).forEach(pts => { if(s.points >= pts) count = table[pts]; });
    if(s.sideA) count += 1;
    if(s.spirit) count += 1;
    
    document.getElementById('solo-info').classList.remove('hidden');
    document.getElementById('soles-display').innerText = "☀️".repeat(count);
}

function resetInputs() {
    document.querySelectorAll('input[type="number"]').forEach(i => i.value = "");
    document.getElementById('spirit-check').checked = false;
}

function resetApp() { location.reload(); }