/*********************************************/

const gamesUntilBankrupt = 13;
const cashOutPercent = 213;

/*********************************************/

function getOptimalBaseBet(gamesUntilBankrupt) {
  const balance = engine.getBalance();
  let baseBet = balance;
  for (let i = 0; i < gamesUntilBankrupt; i++) {
    baseBet *= 0.5;
  }

  console.log(
    `%c Optimal base bet for ${gamesUntilBankrupt} games until bankrupt... ${Math.floor(
      baseBet
    )}`,
    "background: #222; color: #bada55"
  );

  const roundedBet = Math.floor(baseBet / 100) * 100;
  return roundedBet;
}

const username = engine.getUsername();

let bet = getOptimalBaseBet(gamesUntilBankrupt);

let totalStake = 0;
let totalBonus = 0;

engine.on("game_starting", function(info) {
  console.log("Game Starting in " + info.time_till_start);
  console.log(`Placing bet ${bet}`);
  engine.placeBet(bet, cashOutPercent);
  totalStake = totalStake + bet;
});

engine.on("game_started", function(data) {
  console.log("Game Started", data);
});

engine.on("game_crash", function(data) {
  console.log("Game crashed at ", data.game_crash);
  console.log(data);
  bet = bet * 2;
  if (data.game_crash >= cashOutPercent) {
    bet = getOptimalBaseBet(gamesUntilBankrupt);
  }

  if (data.bonuses && data.bonuses[username]) {
    totalBonus = totalBonus + data.bonuses[username];
  }

  console.log("Total Stake:  ", totalStake);
  console.log("Total Bonus:  ", totalBonus);
  console.log("Percent Edge: ", (100 * totalBonus) / totalStake);
});
