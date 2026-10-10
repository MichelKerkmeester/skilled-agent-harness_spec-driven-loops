#!/usr/bin/env bash
# Prints the document validator verdict and the voice-scan hard-blocker count for each edited Markdown file.
# Run from the repository root: bash <this file>
set -u
LIST="specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/label-files.txt"
while IFS= read -r f; do
  invalid="$(python3 -I .skilled/skills/sk-doc/scripts/validate_document.py "$f" | grep -cw INVALID)"
  hard="$(python3 -I .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py "$f" | grep 'hard blockers' | tr -s ' ')"
  echo "$f invalid=$invalid$hard"
done < "$LIST"
