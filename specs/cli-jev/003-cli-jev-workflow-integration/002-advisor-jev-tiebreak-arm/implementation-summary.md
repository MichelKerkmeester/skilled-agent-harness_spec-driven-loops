---
title: "Implementation Summary: Offline Advisor Jev Tie-Break Arm (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal, amended twice on 2026-09-27 and once on 2026-09-28, describe one read-only script and its vitest file that measure a Jev or local Deem choice against the advisor's near-tie order under a keep rule fixed before any run, and no result exists."
trigger_phrases:
  - "advisor jev tie-break summary"
  - "score-jev-tiebreak status"
  - "jev arm planned"
  - "jev tie-break results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm"
    last_updated_at: "2026-09-28T10:30:00Z"
    last_updated_by: "amendment-leaf"
    recent_action: "Amended for the wave 3 directive: the Keep Rule for 009, build roles and the skill docs"
    next_safe_action: "Build after 008 and 016: the advisor dist, then the zero-call census, comparators and power line"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "How many rows are movable, and how many gold-first rows can a pick demote"
      - "Should the Jev half of the Gate 3 calibration also run at no headroom"
      - "Does a Deem choice beat the scorer's order and hold across 3 option orders"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Offline Advisor Jev Tie-Break Arm (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-advisor-jev-tiebreak-arm |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no code, report or measurement exists for it.

### Phase 2: advisor-jev-tiebreak-arm

The plan is one read-only script, `score-jev-tiebreak.mjs`, beside the advisor's routing-accuracy evals, and one vitest file under the advisor's `tests/parity/`. By default the script reads the near-tie cluster for every skill-firing row of the labeled and holdout files and counts the rows whose gold skill is in the cluster but not first. It scores the scorer's order against three zero-call comparators and prints a power line that says whether a `keep` is reachable, all with zero Jev calls. Behind `--jev`, and only when `jev 0.6.2` is on PATH and `jev auth status --provider P` exits 0 for the provider the judgments use, it asks a Jev `choice` inside each cluster three times and returns one pre-registered verdict. When the census finds only 1 to 4 movable rows, the same switch runs the Jev half of a Gate 3 calibration instead. Behind `--deem` (proposed), and only when `cli-deem health` (proposed, phase 008) passes the pinned Deem check, it asks the local Deem the same `choice` in three option orders over at most 25 cluster keys plus `none` and returns a verdict in its own column. Every `--deem` run also runs R21's Deem half, 195 local `noul` calls. Each column's verdict follows the Keep Rule in `spec.md` section 4, fixed on 2026-09-28 before any run. A Deem `keep` under it unlocks phase 009 for the commit pair on its verdict line. The build also updates system-skill-advisor's `SKILL.md`, README, changelog, feature catalog and playbook through sk-doc. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Authored, then amended on 2026-09-27 and on 2026-09-28 | Planning documents for this phase. No code file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were first written from recommendation R1 and proposed phase 002 in `../001-deep-research/research/research.md`. On 2026-09-27 they were amended from the final synthesis, `../004-deep-research-expansion/research/research.md` section 13, with the key gate from the parent goal's amended decision D5. A second amendment the same day added the Deem arm and R21's Deem half from `../007-classifier-deep-research/research/research.md` section 14, under the parent goal's D1 and D5. A third, on 2026-09-28, followed the wave 3 directive: the Keep Rule that phase 009 cites (parent D4), the build roles (parent D5) and the skill docs (parent D6). `spec.md` section 4 traces each changed requirement, and the goal log lists them one per line.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new script instead of extending `score-outcome-rerank.mjs` | That script promises a read-only eval of outcome weights, runs on import and its flip rule decides that flag, so a network arm inside it would change what it means. A separate file deletes cleanly |
| The default run makes zero calls and prints the power line first | The census can end the work at zero movable rows before anything is billed, and the power line tells the operator whether a `keep` is reachable at all |
| Gold-first rows count as decided rows | A movable-only deck cannot lose, so a pick that demotes correct rows could still earn `keep` |
| An aggregate flip rate replaces a per-row one | With 3 reruns a row's rate is 0, 1/3 or 2/3, so a per-row limit of 0.10 is a unanimity test |
| One `--provider` on the gate, `auth test` and every judgment | `auth status` defaults to `official` while judgments follow `JEV_PROVIDER`, so an unscoped check can pass or fail for the wrong key |
| Every gate failure exits 0 with the census intact | Dormant is the normal state without a key, so the report says which check stopped the arm instead of failing the run |
| The keep rule is fixed in full before any run | Parent D4 lets a Deem `keep` here unlock phase 009, so its inputs, order and verdict line cannot change after the numbers are seen |
| `SKILL.md`'s `description` and Keywords line stay unchanged | The advisor's projection reads both, so a doc edit there could move the pinned 53/70 and void every run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build and measurement | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder after each authoring pass. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No numbers exist yet.** Movable and decided rows, the comparator metrics, the verdict and per-call latency are all UNKNOWN until the census and one keyed run.
2. **A keep may be out of reach.** At most 55 rows can move. Between 5 and 20 decided rows a `keep` needs a true win rate of 0.80 to 0.96, which the power line will state before any call.
3. **Each arm needs an operator step.** A Jev key for the provider the judgments use must be set before `--jev` does anything. Without one the arm prints `jev arm skipped: no credential`. The Deem arm needs `cli-deem` from phase 008 and a server the operator started with `deem-ctl`. Without them it prints a `deem arm skipped:` line.
4. **No verdict is recorded yet.** Every column's verdict line goes here once the arms run, for the parent goal's log. Without a Deem `keep`, phase 009 stays Planned and this phase still closes.
<!-- /ANCHOR:limitations -->

---
