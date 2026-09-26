---
title: "Goal: Pi Skill Orchestrator Research for Skill Advisor Refinement"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Pi Skill Orchestrator Research for Skill Advisor Refinement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every refined advisor surface works in all five CLI runtimes, with each related scenario passing there and the fixes pushed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Grok 4.7 xhigh-fast through cli-cursor implements code fixes, and GPT-6 Luna max fast through cli-codex verifies them. Opus agents lead design and docs. The orchestrator dispatches every CLI run itself. |
| D2 | The session never edits the operator's global `~/.codex/hooks.json`. The operator removes its duplicate advisor entry. |
| D3 | The spec-kit hook shim keeps not forwarding its child's stderr. Scenarios read advisor diagnostics from the diagnostics JSONL. |
| D4 | danger-full-access for cli-codex applies to scenario test runs only. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-deep-research | `001-deep-research/goal.md` |
| 002-hook-deadline-and-diagnostics | `002-hook-deadline-and-diagnostics/goal.md` |
| 003-hook-path-cli-spawn-trim | `003-hook-path-cli-spawn-trim/goal.md` |
| 004-headless-fallback-status-and-dedup | `004-headless-fallback-status-and-dedup/goal.md` |
| 005-follow-up-fixes | `005-follow-up-fixes/goal.md` |
| 006-fanout-deep-review | `006-fanout-deep-review/goal.md` |
| 007-docs-and-standards-alignment | `007-docs-and-standards-alignment/goal.md` |
| 008-cross-cli-manual-testing | `008-cross-cli-manual-testing/goal.md` |
| 009-test-findings-remediation | `009-test-findings-remediation/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `opencode run --print-logs` shows no `failed to load plugin` line for `system-skill-advisor.js`, and an OpenCode session lists the `spec_kit_skill_advisor_status` tool.
- [ ] The Pi dispatch suite in `.skilled/hooks/dispatch/pi`, the advisor runtime suite, the spec-kit hook suites and the plugin tests each exit 0 with no failed or errored file.
- [ ] A sandboxed advisor daemon started with `SYSTEM_SKILL_ADVISOR_DB_DIR` set leaves `.skilled/skills/.state/advisor/skill-graph-generation.json` unchanged.
- [ ] Scenarios CL-001, CL-005, CL-006, CP-003, CP-004, NC-001, NC-004, 433 and 457 each report PASS when rerun in cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, or a FAIL the orchestrator traces to a named environment limit.
- [ ] `validate.sh` on packet 030 with `--strict --recursive` prints `RESULT: PASSED` for every folder.
- [ ] The fixes are committed and pushed to origin/main, and the operator has the exact duplicate Codex hook entry to remove.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| 001-deep-research | Done | Phase Documentation Map in `spec.md` reads Complete |
| 002-hook-deadline-and-diagnostics | Done | Phase Documentation Map in `spec.md` reads Complete |
| 003-hook-path-cli-spawn-trim | Done | Phase Documentation Map in `spec.md` reads Complete |
| 004-headless-fallback-status-and-dedup | Done | Phase Documentation Map in `spec.md` reads Complete |
| 005-follow-up-fixes | Done | Phase Documentation Map in `spec.md` reads Complete |
| 006-fanout-deep-review | Done | Phase Documentation Map in `spec.md` reads Complete |
| 007-docs-and-standards-alignment | Done | Phase Documentation Map in `spec.md` reads Complete |
| 008-cross-cli-manual-testing | In Progress | Phase Documentation Map in `spec.md` reads Active or Pending, and the orchestrator reports it open |
| 009-test-findings-remediation | In Progress | Phase Documentation Map in `spec.md` reads Active or Pending, and the orchestrator reports it open |

### Deviations and findings

| Item | Note |
|------|------|
| Child criteria source | No phase is Level 2, so none has `acceptance-criteria.md`. Each child goal takes its criteria from its own `spec.md` requirements table and success criteria, as the operator approved |
<!-- /ANCHOR:log -->
