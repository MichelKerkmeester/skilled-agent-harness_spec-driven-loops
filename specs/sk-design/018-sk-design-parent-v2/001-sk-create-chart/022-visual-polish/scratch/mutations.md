  FAIL [finding-cue] --extra/mutant.html: the FINDING block declares no direction of up, down or none. A trend outside that set cannot decide what the cue before the finding says
FAIL [number-format] --extra/mutant.html: the READOUT block has no unit field. The card prints the unit after the value, and an empty string is the way to say there is none

## source-line (re-recorded by the conductor)

```
  FAIL [source-line] --extra/mutant.html: the source line still carries the retarget instruction, so the line the reader sees mixes provenance with editing directions. That instruction governs the script, so it belongs in the comment above the data block, not in the reader-visible source line
```

## table-disclosure (re-recorded by the conductor)

```
  FAIL [table-disclosure] --extra/mutant.html: the disclosure carries open although the form answers the pointer in a tooltip. A tooltip-bearing form keeps the table folded, because the opened card would duplicate a table the reader did not ask for
```

## number-format, unit never read (added by the conductor after review)

```
  FAIL [number-format] --extra/mutant.html: the readout code never reads READOUT.unit, so a declared unit would not reach the card
```
