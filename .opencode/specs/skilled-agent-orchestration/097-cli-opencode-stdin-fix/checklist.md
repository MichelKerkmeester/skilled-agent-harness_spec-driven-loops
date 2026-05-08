---
title: "Checklist — 097 cli-opencode stdin-redirect fix"
description: "QA validation checklist for the </dev/null fix packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: 097 cli-opencode stdin-redirect fix

<!-- SPECKIT_LEVEL: 2 -->

Mark each item `[x]` only with file:line evidence after completion.

---

## P0 — REQ-001 (4 YAML workflows)

- [ ] **C-001a**: `spec_kit_deep-research_auto.yaml` `if_cli_opencode` block contains `</dev/null` — evidence: `grep -n "</dev/null" .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml`
- [ ] **C-001b**: `spec_kit_deep-research_confirm.yaml` `if_cli_opencode` block contains `</dev/null`
- [ ] **C-001c**: `spec_kit_deep-review_auto.yaml` `if_cli_opencode` block contains `</dev/null`
- [ ] **C-001d**: `spec_kit_deep-review_confirm.yaml` `if_cli_opencode` block contains `</dev/null`
- [ ] **C-001e**: All 4 YAMLs still parse with `python3 -c "import yaml; yaml.safe_load(...)"` (Exit 0)

## P0 — REQ-002 (cli-opencode SKILL.md ALWAYS rule)

- [ ] **C-002a**: New ALWAYS rule added to §4 ALWAYS list — evidence: `grep "</dev/null" .opencode/skills/cli-opencode/SKILL.md`
- [ ] **C-002b**: Rule includes (a) rationale, (b) position-in-command guidance, (c) failure-mode summary

## P0 — REQ-003 (integration_patterns.md §6)

- [ ] **C-003a**: §6 generalizes from `while read` to all non-interactive cases
- [ ] **C-003b**: Section includes hang-symptom diagnostic (0% CPU, log-stops-at-snapshot-prune)

## P0 — REQ-004 (2 stress-test scripts)

- [ ] **C-004a**: 010-stress-test-rerun script contains `</dev/null`
- [ ] **C-004b**: 001-scenario-design script contains `</dev/null`
- [ ] **C-004c**: Both scripts pass `bash -n` syntax check

## P0 — REQ-005 (CHANGELOG §Fix 4)

- [ ] **C-005a**: CHANGELOG-2026-05-08-tool-name-regex-fix.md adds §Fix 4 (stdin redirect)
- [ ] **C-005b**: §TL;DR updated from "Two issues" to "Three issues"
- [ ] **C-005c**: §Symptom B section corrected to identify stdin-startup-deadlock as the actual root cause

## P0 — REQ-006 (Barter mirror)

- [ ] **C-006a**: `barter/.opencode/skill/cli-opencode/SKILL.md` updated OR documented absent in implementation-summary.md

## P1 — REQ-007 / REQ-008

- [ ] **C-007a**: cli-opencode README.md updated (if has dispatch snippets)
- [ ] **C-007b**: assets/prompt_templates.md templates updated where applicable
- [ ] **C-008a**: references/cli_reference.md flag-reference note added near `--format`/`--dir`

## P0 — Validation

- [ ] **C-V01**: `bash validate.sh ... --strict` exits 0
- [ ] **C-V02**: Smoke test (PONG dispatch through modified YAML pattern) returns within 30s with non-zero stdout
- [ ] **C-V03**: implementation-summary.md authored with completion percentage and file:line evidence per requirement
