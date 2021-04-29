#hint: This study will show you your cost basis and porfolio details of any open position, entered manually. The colors on the chart adapt to visualize whether your position is in good or bad shape.

plot entryPrice;
plot adjustedEntry;
plot SMA;

input showDetails = yes;
input showBasis = yes;
input showProfitLoss = yes;
input showFills = no;
input qty = 100;
input purchasePrice = 10.00;
input MovingAvgLength = 200;
input netProfitLossPastTrades = 0.00;

# Entry Price
entryPrice = purchasePrice;
entryPrice.AssignValueColor(if close < purchasePrice then Color.DOWNTICK else Color.UPTICK);
entryPrice.SetLineWeight(2);
entryPrice.SetStyle(Curve.SHORT_DASH);

# Basis Calculation
def basis = (qty * purchasePrice) - (netProfitLossPastTrades); 

# Moving Average
SMA = SimpleMovingAvg(close, MovingAvgLength);

# Effective Trade Price
adjustedEntry = if basis/qty <= 0 then 0.01 else basis/qty;
adjustedEntry.AssignValueColor(if close < (basis / qty) then Color.DOWNTICK else Color.UPTICK);
adjustedEntry.SetLineWeight(2);
adjustedEntry.SetStyle(Curve.MEDIUM_DASH);
adjustedEntry.SetHiding(if adjustedEntry == entryPrice then yes else no);

# Cloud Fills
AddCloud(adjustedEntry, if showFills then close else adjustedEntry, Color.DOWNTICK, Color.UPTICK);
AddCloud(SMA, if showFills then close else SMA, Color.DOWNTICK, Color.UPTICK);
AddCloud(entryPrice, if showFills then close else entryPrice, Color.DOWNTICK, Color.UPTICK);

#Labels
AddLabel(showDetails, qty + "@" + AsDollars(purchasePrice), Color.GRAY);
AddLabel(showBasis and netProfitLossPastTrades == 0.0, "Basis: " + AsDollars(basis), if basis > (qty * close) then Color.DOWNTICK else Color.UPTICK);
AddLabel(showBasis and  netProfitLossPastTrades != 0.0, "Basis (adj): " + AsDollars(basis), if basis > (qty * close) then Color.DOWNTICK else Color.UPTICK);
def pl = (close - entryprice)*qty;
AddLabel(showProfitLoss, "P/L: " + AsDollars(pl), if pl > 0 then Color.UPTICK else if pl == 0 then Color.WHITE else Color.DOWNTICK);
AddLabel(showProfitLoss, "P/L/Share: " + AsDollars(close - entryPrice), if (close - entryPrice) > 0 then Color.UPTICK else if (close - entryPrice) == 0 then Color.WHITE else Color.DOWNTICK);