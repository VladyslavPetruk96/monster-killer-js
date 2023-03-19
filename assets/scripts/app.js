const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 9;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_STRONG_PLAYER_ATTACK = "STRONG_PLAYER_ATTACK";
const LOG_EVENT_MOSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredUserValue = +prompt(
  "Maximum life for you and your monster",
  "100"
);

let choosenMaxLife = enteredUserValue;
let battleLog = [];

if (isNaN(choosenMaxLife) || choosenMaxLife < 0) {
  choosenMaxLife = 100;
}

let currentMosterHealth = choosenMaxLife;
let currentPlayerHealth = choosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(choosenMaxLife);

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MOSTER_ATTACK,
    playerDamage,
    currentMosterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Your extra life saved you");
  }

  if (currentMosterHealth > 0 && currentPlayerHealth <= 0) {
    alert("You lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMosterHealth,
      currentPlayerHealth
    );
  } else if (currentMosterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMosterHealth,
      currentPlayerHealth
    );
  } else if (currentMosterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMosterHealth,
      currentPlayerHealth
    );
  }

  if (currentMosterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMoster(mode) {
  let maxDamage;
  let logEvent;
  if (mode === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    logEvent = LOG_EVENT_PLAYER_ATTACK;
  } else if (mode === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    logEvent = LOG_EVENT_STRONG_PLAYER_ATTACK;
  }

  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMosterHealth -= monsterDamage;
  writeToLog(logEvent, monsterDamage, currentMosterHealth, currentPlayerHealth);
  endRound();
}

function attackHandler() {
  attackMoster(MODE_ATTACK);
}

function strongAttackHandler() {
  attackMoster(MODE_STRONG_ATTACK);
}

function healHandler() {
  let healValue;
  if (currentPlayerHealth >= choosenMaxLife - HEAL_VALUE) {
    alert("You can`t heal more than youe max initial health.");
    healValue = choosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMosterHealth,
    currentPlayerHealth
  );
  endRound();
}

function reset() {
  currentMosterHealth = choosenMaxLife;
  currentPlayerHealth = choosenMaxLife;
  resetGame(choosenMaxLife);
}

function writeToLog(event, value, finalMonsterHealth, finalPlayerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: finalMonsterHealth,
    finalPlayerHealth: finalPlayerHealth,
  };

  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MOSTER";
      break;
    case LOG_EVENT_STRONG_PLAYER_ATTACK:
      logEntry.target = "MOSTER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_MOSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
  }

  battleLog.push(logEntry);
}

function printLogHandler() {
  console.table(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
logBtn.addEventListener("click", printLogHandler);
