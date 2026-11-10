#!/bin/bash
R="$1"; SP="$2"; cd "$R" || exit 1
probe() { local name="$1"; shift; local out code
  out=$(node scripts/enable-modes.cjs "$@" 2>/dev/null); code=$?
  printf '%-24s EXIT=%s  %s\n' "$name" "$code" "$(echo "$out" | head -c 100)"; }
probe resume-guard        --state "$SP/real-state.json"
probe nothing-to-resume   --state "$SP/nope.json" --resume
probe unknown-flag        --state "$SP/x.json" --bogus
probe no-state
probe state-no-value      --state --dry-run
probe dryrun-with-value   --dry-run "$SP/z.json" --state "$SP/z2.json"
