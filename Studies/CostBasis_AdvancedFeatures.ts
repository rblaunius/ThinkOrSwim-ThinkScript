#Hint: This is for option charts only, and will only show if (a) you own the option, and (b) your account is approved for futures (or atleast has advanced features enabled). THIS STUDY WILL ONLY SHOW IF YOU OWN THE OPTION

plot entryPrice;

# User Inputs (defaults)
input pLType = ProfitLossMode.COST_BASIS;
input showColorFills = yes;

# Position Details variables
def qty = GetQuantity();
def isOwned = if (qty > 0) then  (yes) else (no);
def isStock = if (IsOptionable() == 0) then (no) else (yes);
def purchasePrice = 
    if isOwned then 
        if isStock then GetAveragePrice() 
        else (GetAveragePrice() * 100)
    else 0.00;

# Plot
entryPrice = 
    if (purchasePrice > 0.01) then
        (purchasePrice)
    else (Double.NaN);
entryPrice.AssignValueColor(
    if (close < purchasePrice) then
        Color.DOWNTICK 
    else Color.UPTICK);
entryPrice.SetLineWeight(1);
entryPrice.SetStyle(Curve.SHORT_DASH);

#SYMBOL
AddLabel(yes, GetSymbol(), Color.GRAY);

#BASIS
def basis = qty * entryPrice; 
AddLabel(isOwned, ("BOT"+qty + "@" + AsDollars(purchasePrice) + " (" + AsDollars(basis) + ")"), Color.GRAY);

#PL $:
def profitloss = GetOpenPL (GetSymbol(), pLType);
AddLabel(isOwned, 
    if profitloss < 0 then "P/L: -$" + Round(-1.00 * profitloss, 2) 
    else if profitloss > 0 then "P/L: +" + AsDollars(profitloss)
    else "P/L: " + AsDollars(profitloss)
, if profitloss > 0 then Color.UPTICK 
  else if profitloss == 0 then Color.WHITE 
  else Color.DOWNTICK);

#PL %:
def perc = Round((profitloss / basis) * 100, 2);
AddLabel(isOwned, 
    if perc > 0 then ("+" + perc + "%")
    else if perc < 0 then ("-" + perc + "%")
    else (perc + "%")
, if profitloss < 0 then Color.RED 
  else if profitloss > 0 then Color.GREEN 
  else Color.WHITE);

#PL/shr
AddLabel(isOwned and isStock, 
    if profitloss < 0 then "-$" + (-profitloss / qty) + "/shr"
    else if profitloss > 0 then "+" + AsDollars(profitloss / qty) + "/shr"
    else "$0.00/shr"
, if profitloss > 0 then Color.UPTICK
  else if profitloss == 0 then Color.WHITE
  else Color.DOWNTICK);

#PL/call
def isCall = if (!isStock and isPut()) then (0) else if (!isStock and !isPut()) then (1) else (0);
AddLabel(isOwned and isCall, 
    if (profitloss < 0) then 
        "-$" + (-profitloss / qty) + "/call" 
    else  
        "+" + AsDollars(profitloss / qty) + "/call", 
    if profitloss > 0 then 
        Color.UPTICK 
    else  
        Color.DOWNTICK
);

#PL/put
AddLabel(isOwned and isPut(), 
    if (profitloss < 0) then 
        "-$" + (-profitloss / qty) + "/put" 
    else  
        "+" + AsDollars(profitloss / qty) + "/put", 
    if profitloss > 0 then 
        Color.UPTICK 
    else  
        Color.DOWNTICK
);

#COLORS
AddCloud(entryPrice, 
    if showColorFills and qty != 0 then close 
    else entryPrice
  , Color.DOWNTICK
  , Color.UPTICK);