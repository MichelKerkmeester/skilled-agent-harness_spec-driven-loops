  FAIL [mark-policy] --extra/mutant.html: the MARKS block declares points "often", which is outside none, sparse and all. A figure adds no marks, marks the readings it singles out, or marks every reading, and nothing in between

  FAIL [tooltip-indicator] --extra/mutant.html: the indicator kind "blob" is outside swatch and rule. A key is the shape of the mark it stands for, and a mark is either filled or stroked
  FAIL [tooltip-indicator] --extra/mutant.html: the file draws 2 keys and consults the declared kind 1 time. A key painted without reading the declaration goes on painting whatever it painted before
  FAIL [tooltip-indicator] --extra/mutant.html: the figure draws a key but declares no indicator kind. A square standing for a line tells the reader the series is a bar, so the shape a key takes is stated where the series is named
  FAIL [reference-line] --extra/mutant.html: the plot carries a value scale but declares no REFERENCE block. A form that can hold a target or an average states whether it holds one, so a later editor adds the line by filling a list rather than by inventing markup
  FAIL [reference-line] --extra/mutant.html: a REFERENCE entry is missing its value, its label or its why. An unnamed line is a rule the reader cannot read, and an unexplained one is a claim nobody signed
  FAIL [reference-line] --extra/mutant.html: the drawing never reads REFERENCE. A declared line the paint code ignores leaves the form claiming a level it does not draw
  FAIL [cursor-guide] --extra/mutant.html: the figure opens a card on a mark but never says whether it guides the pointer. Whether a hairline crosses the plot on every hover is a decision the form makes, so it makes it where the other mark decisions are written
  FAIL [cursor-guide] --extra/mutant.html: the figure guides the pointer with 0 declared series and 4 readings. One short series marks its own readings, and a line crossing the plot on every hover is then one more thing to look past
  FAIL [cursor-guide] --extra/mutant.html: the figure declares a guide it never draws. A form that says it follows the pointer and does not is the declaration this corpus keeps deleting
  FAIL [cursor-guide] --extra/mutant.html: the guide is never moved onto a reading, or never cleared when the pointer leaves. A hairline left behind marks a reading nobody is reading
  FAIL [cursor-guide] --extra/mutant.html: the figure declares no guide but carries the code for one. The declaration is what a later editor reads, so it cannot disagree with what the file draws

## Second pass: assertions that passed for an incidental reason

Each line below is a mutated copy that the family missed before the review and catches after it.

  FAIL [tooltip-indicator] --extra/mutant.html: the figure draws a key but declares no indicator kind. A square standing for a line tells the reader the series is a bar, so the shape a key takes is stated where the series is named
  FAIL [tooltip-indicator] --extra/mutant.html: the file draws 2 keys and consults the declared kind 1 time. A key painted without reading the declaration goes on painting whatever it painted before
  FAIL [mark-policy] --extra/mutant.html: the MARKS block declares fill not at all, which is outside none, gradient and flat. An area either does not exist, fades toward the baseline, or sits at one flat opacity
  FAIL [mark-policy] --extra/mutant.html: the MARKS block declares a flat fill and the file sets no fill-opacity. A flat area is one opacity held across the shape, and a file that sets none is not painting one
  FAIL [mark-policy] --extra/mutant.html: the MARKS block promises marks on the readings and the drawing places none. A figure that says it marks its readings and draws no mark is the drift this block exists to stop
  FAIL [mark-policy] --extra/mutant.html: the MARKS block calls its zero meaningful and no reading falls below it. A zero every mark stands on is a floor, and calling it a reading gives the axis a significance the data does not carry
  FAIL [mark-policy] --extra/mutant.html: the MARKS block calls its zero a baseline and the readings cross it. A figure with signed readings is read against its zero, and drawing it as a floor hides the sign
  FAIL [reference-line] --extra/mutant.html: the drawing walks REFERENCE without putting a rule in the document. A loop that reads the list and appends nothing is the form claiming a level it does not draw
  FAIL [reference-line] --extra/mutant.html: the file draws a reference rule and carries no style for it. An SVG line with no stroke is invisible, so the level would be declared, appended and unseen
  FAIL [cursor-guide] --extra/mutant.html: the guide element is built and never put in the document. A hairline that exists only as a variable is a guide the reader never sees
  FAIL [cursor-guide] --extra/mutant.html: the guide is never moved onto a reading, or never cleared when the pointer leaves. A hairline left behind marks a reading nobody is reading
  FAIL [colour-literals] --extra/mutant.html: the drawing code hands stroke the literal "flat". A colour reaches a mark through a var(--chart-…) token, or through the class that carries one, so one palette edit reaches the whole file
