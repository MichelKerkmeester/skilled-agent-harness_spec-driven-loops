---
title: "Tasks: 027/001/006 Peck Verification Discipline"
description: "Scoped task list for the agent-roster prompt-guidance slice of the peck verification-discipline bundle. The source proposal calls this Packet 009; this implementation folder is phase 006."
trigger_phrases:
  - "027 phase 006"
  - "peck verification discipline"
  - "completion-verdict freshness"
  - "anti-verdict-softening"
  - "reviewer read-budget"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/006-peck-verification-discipline"
    last_updated_at: "2026-06-10T08:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented T5/T7/T9 guidance"
    next_safe_action: "Route T6 through mcp_server pipeline"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md", "decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Tasks: 027/001/006 Peck Verification Discipline

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

> Single packet, no nested phase-child folders. The proposal's five rules + UX/automation opportunities are implementation groups A-F under Phase 2; T6 freshness is the anchor (Group A).

> Scope reconciliation: the current authorized run implements only the agent-roster prompt-guidance slice: read-budget discipline for `review`, adapted read-budget/freshness language for `context`, `deep-research`, and `deep-review`, plus consume-only verdict/escalation awareness for `orchestrate`. Validator, command, skill, daemon, fixture, and package files remain out of scope for this run.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm 010 reviewer-benchmark fixtures (stale-verdict, softened-Fail, over-read) exist; if absent, mark all ERROR-promotion tasks `[B]` and ship warn-only.
- [ ] T002 Read the completion gate: `CLAUDE.md` §2, `AGENTS.md`, `.opencode/skills/system-spec-kit/constitutional/verify-before-completion-claims.md`.
- [ ] T003 Read `scripts/validation/continuity-freshness.ts`, `mcp_server/lib/validation/spec-doc-structure.ts`, and the `validate.sh` strict path; locate the fingerprint helpers (`normalizeForFingerprint`/`buildContinuityFingerprint`).
- [ ] T004 Read `mcp_server/lib/validation/save-quality-gate.ts` to copy the warn->error rollout pattern (default-on, warn window, would-reject logging, persisted activation timestamp).
- [ ] T005 Record the preservation baseline: current non-strict `validate.sh` behavior; the read/verdict contracts of `@review`, `@context`, `@deep-research`, `@deep-review`, `@orchestrate`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Group A — Completion-verdict freshness (T6, anchor):**
- [ ] T010 Recompute `session_dedup.fingerprint` against content in `mcp_server/lib/validation/spec-doc-structure.ts` (reuse existing helpers; never trust the stored value).
- [ ] T011 Add recompute + clean-tree precondition (packet-scoped default) + in-scope-edit invalidation in `scripts/validation/continuity-freshness.ts`; review the `clock_drift` PASS path.
- [ ] T012 Wire `CONTINUITY_FRESHNESS` as a strict-only check in `scripts/spec/validate.sh`; add the `How to Fix`/`fix:` hint line to the summary.
- [ ] T013 Add `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` to `mcp_server/ENV_REFERENCE.md`; implement the warn->error gate copying `save-quality-gate.ts`.
- [ ] T014 Update the completion rule in `CLAUDE.md` §2 and mirror it in `AGENTS.md` (freshness precondition + clean tree).
- [ ] T015 Add the freshness precondition to `constitutional/verify-before-completion-claims.md`.
- [ ] T016 Document the freshness rule + severity + `How to Fix` in `references/validation/validation_rules.md`; register it in `scripts/lib/validator-registry.json`.

**Group B — Escalation gates (T5):**
- [x] T020 [P] Add the escalation block to `sk-code/SKILL.md` (one-sentence-root-cause-or-escalate; spec-conflict->AMENDMENT-not-workaround; 3-strike; reviewers-contradict). Evidence: Escalation Discipline section added.
- [x] T021 [P] Reference the amendment path from `CLAUDE.md` Logic-Sync; one consolidated escalation prompt fired only after a contradiction/3-strike. Evidence: repo-local `CLAUDE.md` addendum added; `AGENTS.md` Logic-Sync mirror updated additively.

**Group C — Anti-softening (T7):**
- [ ] T030 [B] Add "always emit a single parseable verdict; do not relabel a Fail as conditional/partial" to `verify-before-completion-claims.md` + the completion ritual. Deferred: file is outside approved write paths for this run.
- [x] T031 Add the VERDICT_LOCK verdict line to `deep-review/SKILL.md` (active P0 => exact `FAIL`; one of `PASS|CONDITIONAL|FAIL`). Evidence: Verdict Lock section and final-line mapping added.
- [ ] T032 Enforce the single-verdict/no-softening rule in `deep_start-review-loop_auto.yaml` + `..._confirm.yaml` legal-stop/verdict gates.

**Group D — Reviewer read-budget (T8):**
- [x] T040 ADOPT in `.opencode/agents/review.md`: state the reason before each non-diff Read; never re-read a new/full-content file. Evidence: Read-Budget Discipline section added.
- [x] T041 ADAPT in `.opencode/agents/context.md`, `deep-research.md`, `deep-review.md` (P0 rereads exempt); add awareness in `orchestrate.md`. Evidence: Read-Budget Adaptation, read-budget freshness, Verification Discipline, and Review Verdict Discipline sections added.
- [x] T042 Mirror T040/T041 into the `.claude/agents/*` equivalents (or record a mirror-lag decision). Evidence: matching `.claude` and `.codex` runtime mirrors updated for all five agents.

**Group E — Numeric-severity note (T9, docs only):**
- [x] T050 [P] Add the `+/-2 context` note + optional advisory `riskScore` (explicitly non-gating) to `sk-code-review/SKILL.md` + `references/review_core.md`. Evidence: numeric calibration note added; numeric thresholds explicitly rejected.
- [x] T051 [P] Add the optional advisory `riskScore` field to the deep-review report schema; do NOT adopt `score>=4 blocks`. Evidence: deep-review finding details may include non-gating `riskScore`; verdict mapping ignores it.

**Group F — Net-new UX/automation opportunities (integration-plan §6):**
- [ ] T060 Validator auto-fix hints: emit `fix:` lines in failures + JSON so `/speckit:complete` shows "run this / edit this".
- [ ] T061 Startup/brief freshness indicator: `completion-freshness: stale|fresh` in the startup/advisor brief (fail-open) via `references/config/hook_system.md` + `references/hooks/skill_advisor_hook.md`.
- [ ] T062 One-command "refresh completion fingerprint" helper.
- [ ] T063 Single deep-review verdict in `/speckit:complete` Step-12 summary (`reviewVerdict: ...`) in both complete YAMLs.
- [ ] T064 Checklist evidence quick-fill from changed files + test output in both complete YAMLs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T070 Run each 010 fixture (stale-verdict, softened-Fail, over-read) against the shipped rules; confirm green before any ERROR promotion.
- [ ] T071 Confirm flags-off + non-strict behavior is unchanged (preservation grep + clean non-strict `validate.sh` run).
- [ ] T072 Grep-confirm no memory-subsystem file, no 010 fixture/scorer, and no 011 AC-gate file changed.
- [x] T073 Confirm each `.opencode/agents/*` edit has a matching `.claude/agents/*` mirror (or a recorded mirror-lag decision). Evidence: `.opencode`, `.claude`, and `.codex` mirrors changed for review, context, deep-research, deep-review, and orchestrate.
- [ ] T074 Add manual test cases for verdict-lock + read-budget to the deep-review manual_testing_playbook.
- [x] T075 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/006-peck-verification-discipline --strict`. Evidence: passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are satisfied (freshness recompute + clean-tree + strict-only + warn-first flag; anti-softening one-verdict; each rule on an existing surface; automation classes documented; numeric note docs-only).
- [ ] Freshness ships warn-first behind `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE` and is not promoted to ERROR before its 010 fixture is green.
- [ ] The deep-review verdict line emits one exact parseable verdict and never relabels a Fail; completion ritual remains deferred because its file was excluded from approved write paths.
- [x] Read-budget ADOPTed for `@review`, ADAPTed for deep-*/`@context` (P0 rereads exempt), `.claude/agents/*` and `.codex/agents/*` mirrors updated.
- [ ] Net-new UX/automation opportunities are implemented.
- [ ] No files outside the approved write-path set changed; no memory-subsystem, benchmark, coverage-gate, validator, command, package, or daemon file touched.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Source Proposal**: `../../research/006-peck-source-deep-mining/sub-packet-proposal.md` §1, §6, §7
- **Integration Plan**: `../../research/006-peck-source-deep-mining/integration-plan.md`
- **Verdict Evidence**: `../../research/006-peck-source-deep-mining/research.md` §2 (T5-T9)
- **Upstream Dependency**: `../005-reviewer-prompt-benchmark-substrate` (regression fixtures)
<!-- /ANCHOR:cross-refs -->
