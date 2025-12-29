exports.handler = async function(event, context) {
  // Simple Pay Table (Scatter Pays)
  // Symbols: 0-8 (Low to High), 9 (Scatter)
  // Win if 8+ of same symbol appear anywhere

  const symbols = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const grid = [];
  const rows = 5;
  const cols = 6;

  // Generate random grid
  for (let i = 0; i < rows * cols; i++) {
    const rand = Math.random();
    let symbol = 0;
    if (rand < 0.2) symbol = 0;
    else if (rand < 0.35) symbol = 1;
    else if (rand < 0.48) symbol = 2;
    else if (rand < 0.58) symbol = 3;
    else if (rand < 0.67) symbol = 4; // Gem
    else if (rand < 0.75) symbol = 5; // Chalice
    else if (rand < 0.82) symbol = 6; // Ring
    else if (rand < 0.88) symbol = 7; // Hourglass
    else if (rand < 0.93) symbol = 8; // Crown
    else if (rand < 0.95) symbol = 9; // Scatter (Zeus)
    else symbol = 0; // Fallback

    grid.push(symbol);
  }

  // Calculate Win
  const counts = {};
  grid.forEach(s => counts[s] = (counts[s] || 0) + 1);

  let totalWin = 0;
  const paytable = {
      0: 0.2, 1: 0.4, 2: 0.5, 3: 0.8, 4: 1.0,
      5: 1.5, 6: 2.0, 7: 5.0, 8: 10.0, 9: 100.0
  };

  const winLines = [];

  for (const [symbol, count] of Object.entries(counts)) {
      if (parseInt(symbol) === 9 && count >= 4) {
          // Scatter Pay
          totalWin += paytable[9] * (count - 3); // Simple scatter logic
          winLines.push({ symbol: 9, count: count, win: paytable[9] * (count - 3) });
      } else if (count >= 8) {
          const baseWin = paytable[symbol] || 0;
          let multiplier = 1;
          if (count >= 10) multiplier = 2;
          if (count >= 12) multiplier = 5;
          const win = baseWin * multiplier;
          totalWin += win;
          winLines.push({ symbol: parseInt(symbol), count: count, win: win });
      }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
        grid: grid,
        win: totalWin,
        details: winLines
    })
  };
}
