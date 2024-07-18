/*   --- INITIALIZATION START ---   */
if (!localStorage.getItem('healthPoint')) { // HEALTH POINT
  const initialHP = {
    player: 50,
    opponent: 50
  }
  localStorage.setItem('healthPoint', JSON.stringify(initialHP));
}

const healthPoint = JSON.parse(localStorage.getItem('healthPoint'));


if (!localStorage.getItem('availableAttack')) { // AVAILABLE ATTACK
  const initialAvailableAttack = {
    player: {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true, 10:true},
    opponent: {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true, 10:true}
  }
  localStorage.setItem('availableAttack', JSON.stringify(initialAvailableAttack));
}

const availableAttack = JSON.parse(localStorage.getItem('availableAttack'));

if (!localStorage.getItem('cooldowns')) { // COOLDOWNS
  const initialCooldowns = {
    player: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0,},
    opponent: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0,}
  }
  localStorage.setItem('cooldowns', JSON.stringify(initialCooldowns));
}

const cooldowns = JSON.parse(localStorage.getItem('cooldowns'));

if (!localStorage.getItem('attackHistory')) {
  const initialAttackHistory = {
    player: [],
    opponent: []
  }
  localStorage.setItem('attackHistory', JSON.stringify(initialAttackHistory));
}

const attackHistory = JSON.parse(localStorage.getItem('attackHistory'))

updateHpBar();
powerPermission();
addAttackHistory();
checkWinner();
/*   --- INITIALIZATION END --- */


function main(playerMove) {
  // validation
  if(!playerMove.power && !playerMove.element) {
    return alert('Silahkan pilih kekuatan dan elemen terlebih dahulu')
  } else if (!playerMove.power) {
    return alert('Kekuatan belum dipilih')
  } else if (!playerMove.element) {
    return alert('Elemen belum dipilih')
  }

  powerPermission();
  // player side
  const playerPower = playerMove.power;
  const playerElement = playerMove.element;
  attackHistory.player.push([playerPower, playerElement]);
  for (power in cooldowns.player) {
    if (cooldowns.player[power] > 1) cooldowns.player[power] -= 1;
    else availableAttack.player[power] = true;
  }
  availableAttack.player[playerPower] = false;
  cooldowns.player[playerPower.toString()] = playerPower - 1; 
  
  
  
  // opponent side
  const opponentMove = generateOpponentMove(availableAttack.opponent); 
  attackHistory.opponent.push([opponentMove.power, opponentMove.element]);
  for (power in cooldowns.opponent) {
    if (cooldowns.opponent[power] > 0) cooldowns.opponent[power] -= 1;
    else availableAttack.opponent[power] = true;
  }
  availableAttack.opponent[opponentMove.power] = false;
  cooldowns.opponent[opponentMove.power.toString()] = opponentMove.power - 1;
  
  
  
  // calculate damage
  const damageTaken = generateDamageTaken(playerMove, opponentMove)
  healthPoint.player -= damageTaken.player;
  healthPoint.opponent -= damageTaken.opponent;
  
  // auto-save
  localStorage.setItem('availableAttack', JSON.stringify(availableAttack));
  localStorage.setItem('attackHistory', JSON.stringify(attackHistory));
  localStorage.setItem('cooldowns', JSON.stringify(cooldowns));
  localStorage.setItem('healthPoint', JSON.stringify(healthPoint));
  
  // update bar hp & disable power
  updateHpBar();
  powerPermission();
  addAttackHistory();
  checkWinner();// PLAYER SIDE END 
  
  // CHECKPOINT
  // console.log('player move :', playerMove)
  // console.log('opponent move :', opponentMove)
  // console.log('attack history :', attackHistory)
  // console.log('cooldowns :', cooldowns)
  // console.log('damage taken:', damageTaken)

  return healthPoint;
}

function generateOpponentMove(availableAttack) {
  const opponentMove = {};
  const choiceArr = [];

  for (const choice in availableAttack) {
    if (availableAttack[choice] === true) {
      choiceArr.push(choice);
    }
  }

  const randomIndex = Math.round(Math.random() * (choiceArr.length - 1));
  opponentMove.power = +choiceArr[randomIndex];

  const randomElement = Math.ceil(Math.random() * 3);
  switch (randomElement) {
    case 1: opponentMove.element = 'fire'; break;
    case 2: opponentMove.element = 'wind'; break;
    case 3: opponentMove.element = 'water'; break;
  }

  return opponentMove;
}

function generateDamageTaken(playerMove, opponentMove){

  let playerDamage = playerMove.power;
  let opponentDamage = opponentMove.power;


  if (playerMove.element === 'fire') {
    switch (opponentMove.element) {
      case 'wind': playerDamage *= 2; break;
      case 'water': opponentDamage *= 2; break;
    }
  } else if (playerMove.element === 'wind') {
    switch (opponentMove.element) {
      case 'water': playerDamage *= 2; break;
      case 'fire': opponentDamage *= 2; break;
    }  
  } else if (playerMove.element === 'water') {
    switch (opponentMove.element) {
      case 'fire': playerDamage *= 2; break;
      case 'wind': opponentDamage *= 2; break;
    }
  }

  const damageTaken = {player: 0, opponent: 0};

  if (playerDamage > opponentDamage) damageTaken.opponent = playerDamage - opponentDamage;
  else damageTaken.player = opponentDamage - playerDamage; 

  return damageTaken;
}

function updateHpBar() {
  document.getElementById('player-health').value = healthPoint.player.toString();
  document.getElementById('opponent-health').value = healthPoint.opponent.toString();
}

function powerPermission() {
  const powers = document.getElementsByName('power');
  powers.forEach(function(power) {
    power.checked = false;
  });

  for (let i = 2; i <= 10; i++) {
    if (availableAttack.player[i.toString()] === false) {
      document.getElementById(i.toString()).disabled = true;
    } else {
      document.getElementById(i.toString()).disabled = false;
    }
  }
}

function addAttackHistory(){
  const opponentNode = document.getElementById('opponent-history');
  opponentNode.innerHTML = '';
  const opponentText = document.createElement("p");
  opponentText.innerHTML = 'Opponent'
  opponentText.style.width = '6%'
  opponentText.style.color = "white";
  opponentText.setAttribute("align", "right")
  opponentNode.appendChild(opponentText);


  for (let i = 0; i < attackHistory.opponent.length; i++) {
    const opponentPower = document.createElement("p");
    opponentPower.style.margin = '0'
    opponentPower.style.marginLeft = '0.5%'
    opponentPower.style.width = '1.5%'
    opponentPower.style.color = "white";
    opponentPower.innerHTML = attackHistory.opponent[i][0];
    opponentNode.append(opponentPower)

    const opponentElem = document.createElement("img");
    opponentElem.setAttribute("src", `Assets/${attackHistory.opponent[i][1]}icon.png`);
    opponentElem.style.margin = "0 0.5% 0 0";
    opponentElem.style.width = "1.5%"
    opponentNode.appendChild(opponentElem);
  }
  
  const playerNode = document.getElementById('player-history');
  playerNode.innerHTML= '';
  const playerText = document.createElement("p");
  playerText.innerHTML = 'You'
  playerText.style.width = '6%'
  playerText.style.color = "white";
  playerText.setAttribute("align", "right")
  playerNode.appendChild(playerText);

  for (let i = 0; i < attackHistory.player.length; i++) {
    const playerPower = document.createElement("p");
    playerPower.style.margin = '0'
    playerPower.style.marginLeft = '0.5%'
    playerPower.style.width = '1.5%'
    playerPower.style.color = "white";
    playerPower.innerHTML = attackHistory.player[i][0];
    playerNode.append(playerPower)

    const playerElem = document.createElement("img");
    playerElem.setAttribute("src", `Assets/${attackHistory.player[i][1]}icon.png`);
    playerElem.style.margin = "0 0.5% 0 0";
    playerElem.style.width = "1.5%"
    playerNode.appendChild(playerElem);
  }
}

function checkWinner() {
  if (healthPoint.player <= 0 && healthPoint.opponent > 0) {
    alert('Anda tidak berhasil mengalahkan lawan! \n silahkan tekan tombol Restart untuk mencoba lagi.')
  } else if (healthPoint.player > 0 && healthPoint.opponent <= 0) {
    alert('Selamat anda berhasil mengalahkan lawan! \n silahkan tekan tombol Restart untuk mencoba lagi.')
  } else if (healthPoint.player <= 0 && healthPoint.opponent <= 0) {
    alert('Seri! \n silahkan tekan tombol Restart untuk mencoba lagi.')
  }
}

function reset() {
  localStorage.clear()
  location.reload()
}
