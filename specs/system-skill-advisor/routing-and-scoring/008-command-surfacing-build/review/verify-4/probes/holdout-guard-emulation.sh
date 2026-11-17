#!/usr/bin/env bash
# Emulates the slice test's three holdout-relevant checks over a live capture into
# which one holdout id has been published in .rows. Ids only; no prompt is read.
# Usage: holdout-guard-emulation.sh <live-capture.json> <all-holdout-ids.txt> <plain-holdout-ids.txt>
# The leaked id is the first plain holdout id, so the live fit- prefix check cannot catch it.
RAD=/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy
HID=$(head -1 "$3")
jq --arg h "$HID" '.rows[$h] = {expected_command: null, top: "x", top1: false, top3: false, offered: false}' "$1" > "$1.leaked"
jq -n --slurpfile l "$1.leaked" --slurpfile b "$RAD/command-routing-baseline.json" --rawfile ids "$2" '
  ($ids | split("\n") | map(select(. != ""))) as $hold
  | {
      liveRowsHoldHoldoutId: ([$l[0].rows | keys[] | select(. as $k | $hold | index($k))] | length),
      rowByRowDriftAfterHoldoutFilter: ([($l[0].rows | keys[]), ($b[0].rows | keys[])] | unique | map(select(. as $k | ($hold | index($k)) | not)) | map(select($l[0].rows[.] != $b[0].rows[.])) | length),
      publicationCheckReadsBaseline: ([$b[0].rows | keys[] | select(. as $k | $hold | index($k))] | length),
      liveFitPrefixCheck: ([($l[0].rows | keys[]), ($l[0].attachedMetrics.attachedRows | keys[]), ($l[0].attachedMetrics.typedRows | keys[])] | map(select(startswith("fit-"))) | length),
      totalsEqual: ($l[0].metrics == $b[0].metrics and $l[0].unreachable == $b[0].unreachable and $l[0].commands == $b[0].commands and $l[0].attachedMetrics == $b[0].attachedMetrics)
    }'
rm -f "$1.leaked"
