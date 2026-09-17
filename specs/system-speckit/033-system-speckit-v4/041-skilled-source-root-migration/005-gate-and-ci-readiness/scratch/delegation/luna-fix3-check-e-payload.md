# Edits for unit luna-fix3-check-e

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text

scan_workflow() { # scan_workflow <relpath>
  local rel="$1" out ln kind tok twin owner
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$WORKFLOW_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
~~~~

NEW:

~~~~text

scan_workflow() { # scan_workflow <relpath>
  local rel="$1" ln kind tok twin owner
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$WORKFLOW_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
~~~~

## Edit 2

File: `.github/scripts/check-gate-inputs.sh`

OLD:

~~~~text

scan_dependabot() { # scan_dependabot <relpath>
  local rel="$1" out ln kind tok twin
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$DEPENDABOT_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
~~~~

NEW:

~~~~text

scan_dependabot() { # scan_dependabot <relpath>
  local rel="$1" ln kind tok twin
  run_parser "$rel" "$LEX_AWK$TWIN_AWK$DEPENDABOT_AWK"
  while IFS=$'\t' read -r ln kind tok twin; do
~~~~
