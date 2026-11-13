#!/bin/bash
# Run from the repository root: bash <this file>
# Prints the A10 runtime-copies verdict for this repository with the state and
# kind of each entry, so the count can be read against the entries. Reads only.
node .skilled/commands/doctor/scripts/agents-md-check.cjs --root . --json \
  | jq -r '.rows[] | select(.id == "A10") | "A10 \(.state) | \(.detail)", (.entries[] | "  \(.path): \(.state) \(.kind)")'
