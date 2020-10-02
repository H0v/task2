const { name, random } = faker;

class Gladiator {
  constructor(health, power, speed, name) {
    this.health = health;
    this.power = power;
    this.speed = speed;
    this.name = name;
    this.initialHealth = health;
    this.initialPower = power;
  }
}
let gladiators = [];
const rNum = (min, max, precision) =>
  random.number({
    min,
    max,
    precision,
  });
const createGladiators = (numberOfGladiators) => {
  for (let i = 0; i < numberOfGladiators; i++) {
    gladiators = [
      ...gladiators,
      new Gladiator(
        rNum(80, 100, 1),
        rNum(2, 5, 0.1),
        rNum(1, 5, 0.001),
        name.findName()
      ),
    ];
  }
};

const speedCorrection = () => {
  gladiators.forEach(
    (gladiator) =>
      (gladiator.speed =
        gladiator.speed * (gladiator.health / gladiator.initialHealth))
  );
};

let stopGame = false;
const cesarDecide = (gladiator, index) => {
  const answer = random.number(1);
  if (answer === 0) {
    console.log(
      `Caesar showed -👎 to [${gladiator.name} x${gladiator.health}]`
    );
    gladiators = gladiators.filter((warrior) => warrior != gladiator);
  } else if (answer === 1) {
    console.log(
      `Caesar showed +👍 to [${gladiator.name} x${gladiator.health}]`
    );
    gladiator.health = +gladiator.health + 50;
  }
  speedCorrection();
  stopGame = false;
};

getRandomIndex = (index) => {
  const randomIndex = random.number(gladiators.length - 1);
  if (randomIndex === index) {
    return getRandomIndex(index);
  } else {
    return randomIndex;
  }
};

const hit = (randomGladiator, index) => {
  console.log(
    `[${gladiators[index].name} X ${gladiators[index].health}] hits [${randomGladiator.name} X ${randomGladiator.health}]`
  );
  randomGladiator.health = (+(
    randomGladiator.health - gladiators[index].power
  )).toFixed(1);
};
const checkHealth = (index) => {
  if (gladiators.some((gladiator) => gladiator.health <= 0)) {
    stopGame = true;
    cesarDecide(
      gladiators.find((gladiator) => gladiator.health <= 0),
      index
    );
    return true;
  }
  if (gladiators.some((gladiator) => gladiator.health <= 30)) {
    stopGame = true;
    const currentGladiators = gladiators.filter(
      (gladiator) => gladiator.health <= 30
    );
    currentGladiators.forEach((gladiator) => {
      if (gladiator.power === gladiator.initialPower) {
        gladiator.power = (gladiator.power * 3).toFixed(1);
      }
    });
    stopGame = false;
  }
};
const fight = (index) => {
  if (stopGame) {
    return;
  }
  if (gladiators.length <= 1) {
    console.log(gladiators[0].name, " won");
    stopGame = true;
    return;
  }
  const randomIndex = getRandomIndex(index);
  const randomGladiator = gladiators[randomIndex];
  if (gladiators[index]) {
    hit(randomGladiator, index);
  }
  checkHealth(index);

  if (gladiators[index]) {
    setTimeout(fight, 5000 / gladiators[index].speed, index);
  }
};

createGladiators(2);

const play = () => {
  if (stopGame) {
    return;
  }
  gladiators.forEach((gladiator, index) => {
    fight(index);
  });
};

play();
