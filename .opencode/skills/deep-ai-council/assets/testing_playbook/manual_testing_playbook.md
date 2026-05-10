---
title: "Deep AI Council: Manual Testing Playbook"
description: "Manual validation scenarios for the deep-ai-council skill, runtime rename, and packet-local council artifact helpers."
---

# Deep AI Council: Manual Testing Playbook

This playbook validates the `deep-ai-council` skill and runtime rename with deterministic operator checks. It intentionally excludes advisor regression finalization and graph support.

---

## 1. OVERVIEW

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DAC-001 | Runtime rename | Verify active dispatch name is `@deep-ai-council` | "Use the deep AI council to compare two implementation plans." | Read orchestrator routing -> read runtime agent mirror -> grep old/new names | Orchestrators cite `@deep-ai-council`; old primary name is absent from active routing | Grep output and file citations | PASS if all runtime routing uses the new name | Check orchestrator mirrors and Codex config |
| DAC-002 | Artifact persistence | Verify helper parses a council report and writes packet-local artifacts | "Persist this council report for packet X." | Run `node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> --input-file <report>` | `ai-council/` contains config, state, seats, deliberation, and report | Command output plus artifact tree | PASS if command exits 0 and state has `council_complete` | Check required report headings in `references/output-schema.md` |
| DAC-003 | Completion advisory | Verify incomplete state is reported without failing hard | "Check whether this council run completed." | Run `node .opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs <packet>` | Human advisory lists missing report/state issues or says no advisories | Command output | PASS if command exits 0 with actionable advisory text | Check packet path and `ai-council-state.jsonl` |
| DAC-004 | Graph exclusion | Verify no graph support is created in Phase 001 | "Add graph-backed council storage." | Inspect skill rules and changed files | Skill escalates graph requests; no graph DB/MCP files exist | File citations | PASS if graph support remains absent | Defer to Phase 002 |

---

## 2. EXECUTION NOTES

- Use temporary packet folders for persistence tests when possible.
- Do not mutate authored spec docs during manual validation.
- Capture command, exit code, and the final `ai-council-state.jsonl` tail for persistence scenarios.
