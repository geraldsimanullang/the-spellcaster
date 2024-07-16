const playerMove = {power: 8, element: 'water'}

const healthPoint = {
  player: 100,
  opponent: 100
}

const availableAttack = {
  player: {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true, 10:true,},
  opponent: {1:true, 2:true, 3:true, 4:true, 5:true, 6:true, 7:true, 8:true, 9:true, 10:true,}
}

const cooldowns = {
  player: {2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0,},
  opponent: {1:0, 2:0, 3:0, 4:0, 5:0, 6:0, 7:0, 8:0, 9:0, 10:0,}
}

const attackHistory = {
  player: [],
  opponent: []
}


function main(playerMove) {

/*         --- PLAYER SIDE START ---       */

  const playerPower = playerMove.power;
  const playerElement = playerMove.element;

  // PUSH PLAYER ATTACK HISTORY
  attackHistory.player.push([playerPower, playerElement])
  
  // REDUCE PLAYER COOLDOWN
  for (power in cooldowns.player) {
    if (cooldowns.player[power] > 0) cooldowns.player[power] -= 1;
    else availableAttack.player[power] = true;
  }

  // DISABLE PLAYER POWER OPTION AND SET COOLDOWN
  availableAttack.player[playerPower] = false;
  cooldowns.player[playerPower.toString()] = playerPower - 1;

/*         --- PLAYER SIDE END ---       */


/*         --- OPPONENT SIDE START ---       */

  // GENERATE OPPONENT MOVE
  const opponentMove = generateOpponentMove(availableAttack.opponent); 
  
  // PUSH OPPONENT ATTACK HISTORY
  attackHistory.opponent.push([opponentMove.power, opponentMove.element])

  // REDUCE OPPONENT COOLDOWN
  


/*         --- OPPONENT SIDE END ---       */
  
  
  // CALCULATE DAMAGE
  const damageTaken = generateDamageTaken(playerMove, opponentMove)



  // CHECKPOINT
  // console.log('player move :', playerMove)
  // console.log('opponent move :', opponentMove)
  // console.log('attackHistory :', attackHistory)
  // console.log(damageTaken)

  console.log(attackHistory)
  return ''
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

console.log(main(playerMove))


