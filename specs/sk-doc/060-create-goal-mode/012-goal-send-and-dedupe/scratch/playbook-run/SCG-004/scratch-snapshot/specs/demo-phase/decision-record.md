---
title: "Decision Record: Fix Concurrent Appends to counter.txt"
description: "Arguments behind the frozen choices in goal.md, kept here so the goal can state each choice alone."
importance_tier: "normal"
contextType: "general"
---
# Decision Record: Fix Concurrent Appends to counter.txt

The frozen choices live in `goal.md`. This record keeps the argument for each one, so the goal states only the choice a later author must honor.

## D1: Counter lines are plain text and append-only

A plain-text line is readable by an operator without a parser and diffable by ordinary tools, so the proof of the append behavior stays checkable by reading the file alone. Append-only means the only write any run performs starts at the current end of the file and moves that end forward, so two concurrent runs can only land before or after each other and can never overwrite each other's bytes. The failure this packet exists to fix, duplicated or lost lines under concurrent appends, comes from writes that are not single appends, so freezing the write shape to append-only is the choice every later change must honor.

## D2: The alpha phase carries the proof

An evaluator reading only the directive should still see what the single phase delivers, while the binding in `goal.md` makes `001-alpha/goal.md` authoritative for the phase. A reader who finds any difference between the parent restatement and the child goal follows the child file and names the conflict rather than resolving it silently.

## D3: The run identifier is recorded on the line itself

Attribution lives in the file rather than in a side record because counter.txt is the artifact the criteria check and a side record could disagree with it. The identifier is part of the line text rather than a separate structured column format because D1 freezes the lines as plain text and a column layout would be a new decision, not an application of this one. With the identifier on the line, interleaved runs can be told apart after the fact and the append order compared with the run start order without any external log.

## D4: Order is judged by run start order

Start order is the only order both runs agree on before either runs, so it is the only order a checker can compare against without racing the writers. A finish-order rule would make the required file state depend on scheduling this packet cannot control, and a wall-clock write-time rule would make it depend on clock resolution, so neither can be the frozen rule.
