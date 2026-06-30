---
title: "Tasks — 097 cli-opencode stdin-redirect fix"
description: "Per-file task list for applying </dev/null to all 4 YAML workflows + cli-opencode skill files + 2 stress scripts."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 097 cli-opencode stdin-redirect fix

<!-- SPECKIT_LEVEL: 2 -->

---

## P0 — Mandatory (REQ-001 through REQ-006)

| # | Task | File | Method | Done |
|---|------|------|--------|------|
| T1 | Patch deep-research auto YAML | `.opencode/commands/speckit/assets/speckit_deep-research_auto.yaml` | Edit: insert `</dev/null` after line 727 (after `"$(cat ...)"` end) | [ ] |
| T2 | Patch deep-research confirm YAML | `.opencode/commands/speckit/assets/speckit_deep-research_confirm.yaml` | Edit: insert `</dev/null` after line 659 | [ ] |
| T3 | Patch deep-review auto YAML | `.opencode/commands/speckit/assets/speckit_deep-review_auto.yaml` | Edit: insert `</dev/null` after line 791 | [ ] |
| T4 | Patch deep-review confirm YAML | `.opencode/commands/speckit/assets/speckit_deep-review_confirm.yaml` | Edit: insert `</dev/null` after line 768 | [ ] |
| T5 | Add ALWAYS rule to cli-opencode SKILL.md | `.opencode/skills/cli-opencode/SKILL.md` | Edit: append new ALWAYS rule N to §4 list with rationale + position guidance | [ ] |
| T6 | Update integration_patterns.md §6 | `.opencode/skills/cli-opencode/references/integration_patterns.md` | Edit: generalize §6 from `while read` to all non-interactive callsites | [ ] |
| T7 | Patch stress script (010) | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/010-stress-test-rerun-v1-0-2/scripts/dispatch-cli-opencode.sh` | Edit: add `</dev/null` to opencode run line | [ ] |
| T8 | Patch stress script (001-scenario-design) | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/001-scenario-design/scripts/dispatch-cli-opencode.sh` | Edit: add `</dev/null` to opencode run line | [ ] |
| T9 | Update CHANGELOG with §Fix 4 | `.opencode/skills/cli-opencode/CHANGELOG-2026-05-08-tool-name-regex-fix.md` | Edit: add §Fix 4 entry, update §TL;DR to "three issues", correct §Symptom B diagnosis | [ ] |
| T10 | Mirror to Barter (conditional) | `barter/.opencode/skill/cli-opencode/SKILL.md` (if exists) | Edit: same ALWAYS rule | [ ] |

## P1 — Required (REQ-007, REQ-008)

| # | Task | File | Method | Done |
|---|------|------|--------|------|
| T11 | Update cli_reference.md flag-reference note | `.opencode/skills/cli-opencode/references/cli_reference.md` | Edit: add stdin note near `--format`/`--dir` | [ ] |
| T12 | Update prompt_templates.md copy-paste | `.opencode/skills/cli-opencode/assets/prompt_templates.md` | Edit: add `</dev/null` to background-dispatch templates | [ ] |
| T13 | Update README.md (if has dispatch snippets) | `.opencode/skills/cli-opencode/README.md` | Edit: add `</dev/null` to example | [ ] |

## P0 — Validation

| # | Task | Method | Done |
|---|------|--------|------|
| T14 | Verify each YAML still parses | `python3 -c "import yaml; yaml.safe_load(open('<path>'))"` for each | [ ] |
| T15 | Verify each shell script still bash-clean | `bash -n <script>` for each | [ ] |
| T16 | Smoke test 1 modified YAML pattern | Run a 30-second PONG dispatch through the modified deep-research auto YAML pattern | [ ] |
| T17 | Run strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/skilled-agent-orchestration/z_archive/080-cli-opencode-stdin-fix --strict` | [ ] |
| T18 | Write implementation-summary.md | All tasks above complete + file:line evidence per task | [ ] |
