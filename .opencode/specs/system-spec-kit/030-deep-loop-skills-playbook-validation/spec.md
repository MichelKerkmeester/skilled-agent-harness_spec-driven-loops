---
title: "Feature Specification: Deep-Loop Skills Playbook Validation"
description: "Operator validation run of all five deep-loop skill manual testing playbooks (177 scenarios) via cli-devin SWE-1.6 and cli-codex GPT-5.5, producing per-skill verdict ledgers and a release-readiness matrix."
trigger_phrases:
  - "deep loop skills playbook validation"
  - "deep-loop manual testing run"
  - "030 deep loop skills playbook validation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-deep-loop-skills-playbook-validation"
    last_updated_at: "2026-05-27T19:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "All phases + 007/008/009/010 done - 177/177 PASS, verdict READY"
    next_safe_action: "Packet complete - READY (0 PARTIAL/FAIL/SKIP); operator review"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/deep-ai-council/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/deep-review/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/deep-research/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/deep-agent-improvement/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-05-27-deep-loop-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Execution scope: SCAFFOLD STRUCTURE ONLY this session; CLI execution deferred — operator confirmed 2026-05-27"
      - "Failure handling: RECORD + REMEDIATE (remediation children 007+ on confirmed FAIL) — operator confirmed 2026-05-27"
      - "Executors: cli-devin SWE-1.6 (deterministic inspection) + cli-codex GPT-5.5 medium-fast (A/B comparison, triage) — operator directed"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase list + what needs done only. -->

# Feature Specification: Deep-Loop Skills Playbook Validation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (Phase Parent) |
| **Priority** | P1 |
| **Status** | Complete — 177/177 verdicts (177 PASS / 0 PARTIAL / 0 FAIL / 0 SKIP); release verdict **READY**; 4 remediation children (007, 008, 009, 010) shipped + re-verified |
| **Created** | 2026-05-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (system-spec-kit track) |
| **Parent Packet** | system-spec-kit |
| **Predecessor** | 029-code-graph-playbook-validation |
| **Successor** | None |
| **Handoff Criteria** | All 177 playbook scenarios run with PASS/PARTIAL/FAIL/SKIP + evidence; release-readiness matrix assembled in phase 006; confirmed FAILs remediated via 007+ children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five deep-loop skills — `deep-loop-runtime` (22), `deep-ai-council` (32), `deep-review` (45), `deep-research` (41), and `deep-agent-improvement` (37) — ship manual testing playbooks totalling **177 scenarios**. Each playbook's Execution Policy requires scenarios to be "executed for real, not mocked." There is no captured, dated operator run on record across these five skills, so release readiness for the deep-loop family cannot be asserted.

### Purpose
Govern a full validation run of all 177 scenarios via cross-AI dispatch, capturing per-scenario evidence (command, output excerpt, verdict) in per-skill verdict ledgers and assembling a single cross-skill release-readiness matrix. Deterministic inspection scenarios dispatch to `cli-devin` SWE-1.6 (free tier); A/B comparison and failure-triage scenarios dispatch to `cli-codex` GPT-5.5 medium-fast. Confirmed FAILs are remediated via follow-on children (`007+`).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All planning, task breakdowns, verdict ledgers, the dispatch runbook, and per-scenario evidence live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Running all 177 manual-testing-playbook scenarios across the five deep-loop skills.
- Cross-AI dispatch via `cli-devin` (`swe-1.6`) and `cli-codex` (`gpt-5.5`, medium reasoning, fast tier).
- Per-scenario evidence capture and per-skill verdict ledgers (in each child's `checklist.md`).
- A final cross-skill PASS/PARTIAL/FAIL/SKIP release-readiness matrix (phase 006).
- Remediation of confirmed FAILs via follow-on children (`007+`), per the record+remediate model.
- Disposable-sandbox discipline for the CP-* stress scenarios that mutate files/state.

### Out of Scope
- **This scaffold session:** any CLI dispatch or scenario execution (deferred to later sessions).
- Editing the playbook scenarios or the deep-loop skill runtimes themselves (except scoped remediation in `007+`).
- Re-running scenarios already green in another packet.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `030-.../001-deep-loop-runtime-scenarios/**` | Create | 001 | Verdict ledger + evidence for 22 runtime scenarios |
| `030-.../002-deep-ai-council-scenarios/**` | Create | 002 | Verdict ledger + evidence for 32 council scenarios |
| `030-.../003-deep-review-scenarios/**` | Create | 003 | Verdict ledger + evidence for 45 review scenarios |
| `030-.../004-deep-research-scenarios/**` | Create | 004 | Verdict ledger + evidence for 41 research scenarios |
| `030-.../005-deep-agent-improvement-scenarios/**` | Create | 005 | Verdict ledger + evidence for 37 improvement scenarios |
| `030-.../006-release-readiness-synthesis/**` | Create | 006 | Dispatch runbook + cross-skill release-readiness matrix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each phase is an independently executable child spec folder. Implementation detail lives inside the children.

| Phase | Folder | Focus | Scenarios | Status |
|-------|--------|-------|-----------|--------|
| 001 | `001-deep-loop-runtime-scenarios/` | Foundational runtime: executor, prompt, validation, state, scoring, coverage-graph, scripts, council | 22 | Complete — 22/22 (22 PASS) |
| 002 | `002-deep-ai-council-scenarios/` | Council deliberation, persistence, convergence, scope, writer, council-graph (08) + value comparison (09) | 32 | Complete — 32/32 (32 PASS; DAC PARTIALs resolved via 010) |
| 003 | `003-deep-review-scenarios/` | Review entry/init/iteration/convergence/pause-resume/synthesis + stress (07) + depth-v2 (08) | 45 | Complete — 45/45 (45 PASS; CP via 009, PARTIALs via 010) |
| 004 | `004-deep-research-scenarios/` | Research entry/init/iteration/convergence/quality-guards/pause-resume/synthesis + stress (07) | 41 | Complete — 41/41 (41 PASS; PARTIALs + DR-032 SKIP resolved via 010) |
| 005 | `005-deep-agent-improvement-scenarios/` | Scanner, profiler, 5D scorer, benchmark, reducer, end-to-end, runtime-truth + discipline stress (08) | 37 | Complete — 37/37 (37 PASS; E2E/5D/CP resolved via 010) |
| 006 | `006-release-readiness-synthesis/` | Dispatch runbook + aggregate 177 verdicts into release-readiness matrix | — | Complete — matrix populated, CONDITIONAL verdict |

### Skill → Phase Mapping (execution order; dependency-driven)

| Order | Skill | Child | Dependency |
|-------|-------|-------|------------|
| 1 | deep-loop-runtime | 001 | None (foundational) |
| 2 | deep-ai-council | 002 | 001 council/coverage-graph/script categories must be non-FAIL before DAC-019..032 |
| 3 | deep-review | 003 | Inherits runtime; independent |
| 4 | deep-research | 004 | Inherits runtime; independent |
| 5 | deep-agent-improvement | 005 | Independent |
| 6 | (synthesis) | 006 | All of 001-005 verdicts captured |

### Phase Transition Rules
- Each phase passes `validate.sh --strict` independently before its execution begins.
- Parent tracks aggregate progress via this map.
- Resume a phase via `/spec_kit:resume 030-deep-loop-skills-playbook-validation/[NNN-phase]/`.
- Confirmed FAILs spawn remediation children `007+` (record+remediate); created on-demand, not pre-scaffolded.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 22 runtime verdicts captured; council/coverage-graph categories non-FAIL | child 001 ledger complete |
| 002-005 | 006 | Each skill's verdict ledger fully populated | child checklists complete |
| 006 | done | 177/177 verdicts aggregated; FAIL/SKIP triaged; remediations resolved | release-readiness matrix present |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Dispatch concurrency: confirmed SEQUENTIAL (single-dispatch discipline). Re-confirm before any operator-authorized parallel dispatch.
- Batch granularity per category: one dispatch per category (default) vs sub-split for categories >8 scenarios (deep-review 03/04, deep-research 04).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: `001-deep-loop-runtime-scenarios/` … `006-release-readiness-synthesis/`
- **Dispatch runbook**: `006-release-readiness-synthesis/dispatch-runbook.md`
- **Playbook sources**: `.opencode/skills/<skill>/manual_testing_playbook/manual_testing_playbook.md`
- **Graph Metadata**: `graph-metadata.json` (`derived.last_active_child_id`)
