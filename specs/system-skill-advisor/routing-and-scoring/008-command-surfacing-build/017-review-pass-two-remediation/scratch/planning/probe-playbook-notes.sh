#!/bin/bash
# Run from the repository root: bash <this file>
# Compares the advisor playbook's inventory note, its result folder and the tests
# README row with the tree. Reads files only.
SKA=.skilled/skills/system-skill-advisor
PB=$SKA/manual-testing-playbook
echo "scenario files: $(find "$PB" -mindepth 2 -name '*.md' | wc -l | tr -d ' ')"
echo "NNN-*.md scenario files: $(find "$PB" -mindepth 2 -name '[0-9][0-9][0-9]-*.md' | wc -l | tr -d ' ')"
echo "note: $(rg -o 'the source category tree contains [0-9]+ `NNN-\*\.md` scenario files' "$PB/manual-testing-playbook.md")"
echo "result folder named: $(rg -o 'system-skill-advisor/benchmark/reports/<dated-run-label>/' "$PB/manual-testing-playbook.md")"
echo "renderer sentence: $(rg -o 'Generated report Markdown is renderer-owned and never hand-authored\.' "$PB/manual-testing-playbook.md")"
echo "benchmark folder exists: $(test -d "$SKA/benchmark" && echo yes || echo no)"
echo "standard: $(rg -o 'The wrapper that once persisted them' .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md)"
echo "tests README row: $(rg -o '\| `manual-testing-playbook.vitest.ts` \| [^|]+\|' "$SKA/runtime/tests/README.md")"
