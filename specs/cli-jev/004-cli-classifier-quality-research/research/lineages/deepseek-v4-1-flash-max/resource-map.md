---
title: "Resource Map — cli-classifier quality audit (deepseek-v4-1-flash-max lineage)"
description: "Evidence-derived resource map for the detached deepseek-v4-1-flash-max lineage."
trigger_phrases: []
---

# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

## Summary

- Scope: the shipped cli-classifier hub, its cli-jev packet, shared transport and scorer-report scripts, benchmark assets, feature catalog, manual testing playbook, changelogs and READMEs, plus every live caller of the shared transport — audited on seven axes, read only.
- Generated from: five mechanically verified iteration deltas (`deltas/iter-001.jsonl` … `iter-005.jsonl`).
- Primary local authorities: the hub source tree, the sk-doc validator and reference template, the sk-code-opencode JavaScript style guide and checklist, the system-skill-advisor skill graph and parity fixtures, the dispatch hook engine, and the cli-jev packet records that hold the live measurement results.
- Resource status is an evidence snapshot dated 2026-10-04; the hub's compiled-routing policy and advisor graph are live surfaces that can move.

## Local Integration Sources

| Path | Action | Status | Evidence use |
|---|---|---|---|
| `.skilled/skills/cli-classifier/SKILL.md` | Analyzed | OK | Hub routing contract; F-001 source line |
| `.skilled/skills/cli-classifier/README.md` | Validated | OK | README rules; verification commands run (3 pass) |
| `.skilled/skills/cli-classifier/ROUTER.md` | Validated | OK | Stage-two router; keys equal, paths resolve |
| `.skilled/skills/cli-classifier/mode-registry.json` | Analyzed | OK | Mode registry, aliases, advisorRouting metadata |
| `.skilled/skills/cli-classifier/hub-router.json` | Analyzed | OK | Vocabulary classes; router policy |
| `.skilled/skills/cli-classifier/leaf-manifest.json` | Validated | OK | All 5 RESOURCE_MAP paths are registered leaves |
| `.skilled/skills/cli-classifier/description.json` | Analyzed | OK | Hub doctor metadata; F-008 timestamp |
| `.skilled/skills/cli-classifier/graph-metadata.json` | Analyzed | OK | Advisor signals; F-008 timestamp |
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Read | OK | Transport selection, Pi/CLI routes; F-001 evidence |
| `.skilled/skills/cli-classifier/shared/scripts/scorer-report.mjs` | Read | OK | Report primitives; no bugs found |
| `.skilled/skills/cli-classifier/shared/scripts/tests/` | Executed | OK | 42 + 8 tests pass, containment-safe |
| `.skilled/skills/cli-classifier/benchmark/injection-screen/` | Executed | OK | 57 tests pass; F-008/F-009 evidence |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/` | Executed | OK | 46 tests pass; F-005 evidence |
| `.skilled/skills/cli-classifier/benchmark/reports/` | Read | OK | With/without routing results visible |
| `.skilled/skills/cli-classifier/feature-catalog/` | Read | OK | F-002/F-004 evidence |
| `.skilled/skills/cli-classifier/manual-testing-playbook/` | Read | OK | Scenario contracts; JEV-019 claim verified |
| `.skilled/skills/cli-classifier/cli-jev/` (packet) | Read | OK | SKILL, README, references, hard rules, playbook |
| `.skilled/skills/cli-classifier/changelog/` | Read | OK | Release history; F-008 gap |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Executed | OK | All 79 hub markdown docs validated |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md` | Read | OK | Overview requirement behind F-003 |
| `.skilled/skills/sk-code/sk-code-opencode/references/javascript/style-guide.md` | Read | OK | Header/strict-mode rules applied |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Read | OK | Hub identity, signals, adjacency |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Read | OK | F-006 entry |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` + tests | Executed | OK | Hard-rule implementations; 20 tests pass |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Read | OK | jev → cli-classifier dispatch registry |
| `.claude/settings.json` | Read | OK | PreToolUse hook registration |
| `.skilled/bin/compiled-route.cjs` + activation manifest | Executed | OK | Live route + matching policy hash |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Executed | OK | All hard invariants pass |
| `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/` | Read | OK | Original injection-screen scope and gate |
| `specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/` | Read | OK | Cited live run file verified present |
| `specs/cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/004-injection-screen-improvements/` | Read | OK | F-008/F-009 evidence; live verdict record |
| `.claude/skills/cli-classifier/` (runtime mirror) | Diffed | OK | Byte-identical to the source tree |

## Notes

- No external network sources were used; this audit is local-only and read-only.
- Every executed check ran with temp writes redirected inside the lineage; `git status` diffs showed no repository writes.
