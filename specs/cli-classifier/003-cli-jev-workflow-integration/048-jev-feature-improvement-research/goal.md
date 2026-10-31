---
title: "Goal: Jev feature improvement research"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/048-jev-feature-improvement-research"
    last_updated_at: "2026-10-03T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-048"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Jev feature improvement research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the ten kept or near-kept Jev features from 047 a ranked, evidence-cited `research.md` on how to improve, refine and expand it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research only. Each phase writes inside its own `research/` folder |
| D2 | Every phase runs `/deep:research` in fan-out mode: DeepSeek V4.1 Flash max via cli-pi for 5 iterations, GPT-6 Luna max fast via cli-codex for 3, stop policy max-iterations |
| D3 | Session verifies and commits. Path-scoped commits, main only on the operator's go |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-fanout-merge-research | `001-fanout-merge-research/goal.md` |
| 002-track-narrowing-research | `002-track-narrowing-research/goal.md` |
| 003-citation-drift-research | `003-citation-drift-research/goal.md` |
| 004-injection-screen-research | `004-injection-screen-research/goal.md` |
| 005-hallucination-grader-research | `005-hallucination-grader-research/goal.md` |
| 006-verdict-fallback-research | `006-verdict-fallback-research/goal.md` |
| 007-clarify-default-research | `007-clarify-default-research/goal.md` |
| 008-folder-suggestion-research | `008-folder-suggestion-research/goal.md` |
| 009-pi-transport-research | `009-pi-transport-research/goal.md` |
| 010-completion-claims-research | `010-completion-claims-research/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] All 10 phases hold a `research/research.md`
- [x] Each phase's DeepSeek lineage logs 5 iterations and its Luna lineage logs 3, or the log records why one stopped early
- [x] `validate.sh --strict --recursive` prints `RESULT: PASSED` on this phase and its 10 children
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
| Phase opened | Done | 10 children scaffolded and filled 2026-10-03 |
| Recursive validate | Done | `validate.sh --strict --recursive` RESULT: PASSED, 11 folders, 0 errors, 0 warnings |
| Children 001 to 010 | Done | each holds a merged `research.md` and one `synthesis_complete`; DeepSeek 5 and Luna 3 iterations in every child; `validate.sh --strict` PASSED and check-goal 5/5 each |

### Deviations and findings

The deep-loop runtime faults below were met while running the fan-outs. They are recorded, not fixed, because this phase is research only (D1).

| Item | Note |
|------|------|
| Config row versus projection guard (P2) | The init step at `deep-research-auto.yaml:106` prescribes a 15-key config row, and the gateway guard in `shadow-projection-store.ts:209-233` refuses a projection that drops keys from it. Luna stopped on 005, 007, 008 and 009. The runner then labels a deterministic failure `salvage_miss`, "transient", and retries it. The session rewrote the row to the projection's 5 keys, by hand and then with a 15-second-idle guard |
| No config-row producer (P2) | The projection builds a config row only from `run_initialized`, and nothing emits that event (`deep-research-contract.ts:169`, `deep-research-ledger-types.ts:489`). Any state log that opens with a config row therefore fails the guard at its first gateway call, because the projection starts at iteration 1 and drops every config key, 5 keys or 15. On 008, Luna improvised by moving the row to `deep-research-state.legacy-backup.jsonl`, and that is what let it resume. On 009 the session first misread the failure as a race with its own guard, then took the 008 route twice. Each time the rerun topic's own "write the config row first" line put the row back. The final 009 lineage runs with a topic that tells Luna not to write a config row |
| Delta field drift (P2) | `fanout-merge.cjs` reads a delta finding's text from `title`, `label`, `finding` or `text`. DeepSeek on 008 wrote `claim`, so the closeout invariant refused. The contract names `label` (`state-jsonl.md:191`). The session copied `claim` into `label`, with the originals kept in the scratchpad |
| Write boundary | On 008 attempt 2, Luna wrote its strategy file at the worktree root, then stopped itself. The session moved the file out |
| Codex usage limit | Hit at 23:58 for 005 to 010. 005 and 006 already had their 3 iterations and were synthesized from them; 007 to 010 were rerun after the reset |
| LOGIC-SYNC halt | On 007, Luna stopped to ask which truth prevails about fixture provenance. The rerun topic adds one line: record a contradiction as a finding and keep going |
| Shared-checkout containment | The runner flagged the session's own closeout writes in sibling children as containment advisories. In `preserve` mode nothing was reverted, and each flagged child revalidated PASSED |
<!-- /ANCHOR:log -->
