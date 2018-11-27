/*********************************************/

const gamesUntilBankrupt = 5000;
const baseCashOutPercent = 120;

/*********************************************/

let cashOutPercent = baseCashOutPercent;
const username = engine.getUsername();

let bet = getOptimalBaseBet(gamesUntilBankrupt);

let totalStake = 0;
let totalBonus = 0;

function getOptimalBaseBet(gamesUntilBankrupt) {
  const balance = engine.getBalance();
  let baseBet = balance / gamesUntilBankrupt;

  const roundedBet = Math.floor(baseBet / 100) * 100;

  console.log(
    `Optimal base bet for ${gamesUntilBankrupt} games until bankrupt... ${Math.floor(
      roundedBet
    )}`
  );

  return roundedBet > 100 ? roundedBet : 100;
}

const handleStart = info => {
  console.log("Game Starting in " + info.time_till_start);
  console.log(`Placing bet ${bet} at ${cashOutPercent / 100}x`);
  engine.placeBet(bet, cashOutPercent);
  totalStake += bet;
};

const handleCrash = data => {
  console.log("Game crashed at ", data.game_crash);
  console.log(data);
  if (data.game_crash >= cashOutPercent) {
    cashOutPercent = baseCashOutPercent;
  } else {
    cashOutPercent += 100;
  }

  if (data.bonuses && data.bonuses[username]) {
    totalBonus += data.bonuses[username];
  }

  console.log("Total Stake:  ", totalStake);
  console.log("Total Bonus:  ", totalBonus);
  console.log("Percent Edge: ", (100 * totalBonus) / totalStake);
};

engine.on("game_starting", handleStart);

engine.on("game_started", function(data) {
  console.log("Game Started", data);
});

engine.on("game_crash", handleCrash);
