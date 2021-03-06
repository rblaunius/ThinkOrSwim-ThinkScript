#Hint: Put this on any option chart and see details on any option or stock. The graph will only show if the study is on an options chart.

declare lower;
plot entry;

#Inputs
input showGreeks = yes;
input showUnderlying = yes;

#Position Details
def isStock = if (IsOptionable() == 0) then (no)
              else (yes);
def condPUT = if (!isStock and IsPut()) then yes else no;
def condCALL = if (!isStock and !IsPut()) then yes else no;
def purchaseprice = if (isStock) then (GetAveragePrice())
                    else (GetAveragePrice() * 100);
def qty = GetQuantity();
def strike = if (!isStock) then (GetStrike()) else (0.00);
def breakevenOWN = if condPUT then (strike - purchaseprice)
                   else if condCALL then (strike + purchaseprice)
                   else (0.00);
def breakevenNOW = if condPUT then (strike - close)
                    else (strike + close);

# PLOT
entry = if showUnderlying and !isStock then close(GetUnderlyingSymbol()) 
             else Double.NaN;
entry.AssignValueColor(
    if (purchaseprice < close) then
        (Color.UPTICK)
    else if (purchaseprice > close) then 
        (Color.DOWNTICK)
    else
        (Color.gray)
);
entry.SetDefaultColor(Color.gray);

#Check if you have a position or not
def isOpen = if qty > 0 then yes 
             else no;
def isClose = if qty <= 0 then yes 
              else no;
def pl = GetOpenPL();
def basis = if isStock then (qty * purchaseprice)
            else (100 * qty * purchaseprice);

#Volume Change calcluations
def volume10min = volume;
def oIntToday = open_interest;

#Shared Labels
AddLabel(yes, GetSymbol(), Color.GRAY);
AddLabel(yes,"volume: " + volume10min, Color.GRAY);
AddLabel(isClose, "No Position", Color.GRAY);
AddLabel(isOpen, "BOT" + qty + "@" + AsDollars(purchaseprice), Color.gray);
AddLabel(yes, if !isStock then "now: " + AsDollars(close * 100) + "/contract" else "now: " + AsDollars(close) + "/shr", if pl < 0 then Color.DOWNTICK else if pl > 0 then Color.UPTICK else Color.gray);

#Option Labels

AddLabel(!isStock and isOpen,
         "break-even (exp): " + AsDollars(breakevenOWN),
         if pl > 0 then Color.UPTICK
         else if pl < 0 then Color.DOWNTICK
         else Color.gray
);

AddLabel(!isStock,
         "break-even (now): " + AsDollars(breakevenNOW),
         if pl > 0 then Color.UPTICK
         else if pl < 0 then Color.DOWNTICK
         else Color.Gray
);

AddLabel(!isStock and showGreeks,
         "delta: " + Delta() + "    gamma: " + Gamma() + "    theta: " + Theta() + "    vega: " + Vega(),
         Color.Gray
);
