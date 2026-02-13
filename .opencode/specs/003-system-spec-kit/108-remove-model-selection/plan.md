---
title: Plan — Remove Model Selection Logic
level: 1
status: complete
created: 2026-02-11
---

# Plan — Remove Model Selection Logic

## Approach

Systematic find-and-remove across 15 files using 3 parallel waves.

### Wave 1: MD Command Files (5 files)

3 parallel agents editing the 5 MD command files:
- Remove worker model questions (Q4/Q5) and renumber downstream questions
- Remove Q2 AI Model from debug.md and update mermaid diagram
- Remove "(opus)" from dispatch mode descriptions
- Update example outputs to reflect new question numbering

### Wave 2: YAML Asset Files (10 files)

3 parallel agents cleaning 10 YAML files:
- Remove `worker_model` field from variables, config, and template lines
- Remove `selected_model` and `model_selection` from debug YAML variants
- Preserve hardcoded `model: "opus"` on orchestrator dispatch entries

### Wave 3: Verification

1 verification agent:
- Grep all 15 files for remaining `worker_model`, `selected_model`, `model_selection` references
- Confirm zero remaining references (except hardcoded orchestrator `model:` entries)
- Create spec folder documentation

## Total Changes

~120 individual reference removals/modifications across 15 files.
