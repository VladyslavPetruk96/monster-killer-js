const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 9;

const enteredUserValue = +prompt(
  "Maximum life for you and your monster",
  "100"
);

let choosenMaxLife = enteredUserValue;
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

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("Your extra life saved you");
  }

  if (currentMosterHealth > 0 && currentPlayerHealth <= 0) {
    alert("You lost");
  } else if (currentMosterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You won");
  } else if (currentMosterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("Draw");
  }

  if (currentMosterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMoster(mode) {
  let maxDamage;
  if (mode === "ATTACK") {
    maxDamage = ATTACK_VALUE;
  } else if (mode === "STRONG_ATTACK") {
    maxDamage = STRONG_ATTACK_VALUE;
  }

  const monsterDamage = dealMonsterDamage(maxDamage);
  currentMosterHealth -= monsterDamage;
  endRound();
}

function attackHandler() {
  attackMoster("ATTACK");
}

function strongAttackHandler() {
  attackMoster("STRONG_ATTACK");
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
  endRound();
}

function reset() {
  currentMosterHealth = choosenMaxLife;
  currentPlayerHealth = choosenMaxLife;
  resetGame(choosenMaxLife);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healHandler);
