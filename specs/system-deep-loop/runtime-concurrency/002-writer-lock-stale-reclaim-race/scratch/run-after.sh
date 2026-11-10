#!/bin/zsh
cd ../../../../.skilled/skills/system-deep-loop/runtime || exit 1
S=../../../../specs/system-deep-loop/041-writer-lock-stale-reclaim-race/scratch
npm run typecheck > $S/after-typecheck.txt 2>&1; echo "exit=$?" >> $S/after-typecheck.txt
npm test > $S/after-suite.txt 2>&1; echo "exit=$?" >> $S/after-suite.txt
$S/run-plain-loop.sh 200 > $S/stress-after.txt 2>&1
