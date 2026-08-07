---
title: "Implementation Plan: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk [template:level_3/plan.md]"
description: "Bash and TypeScript validators that audit every phase parent's children_ids against its on-disk phase children, backfill the drifted set (including sk-design and 003-spec-data-quality), and add a drift check to the validation pipeline so the gap cannot silently accumulate again."
trigger_phrases:
  - "graph-metadata drift plan"
  - "children_ids reconciliation"
  - "phase parent backfill plan"
  - "drift check implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/017-graph-metadata-child-drift-audit-and-harden"
    last_updated_at: "2026-07-06T12:51:15.752Z"
    last_updated_by: "michel-kerkmeester"
    recent_action: "Authored Level 3 plan for graph-metadata child-drift audit + harden"
    next_safe_action: "Author tasks.md, checklist.md, decision-record.md and implementation-summary.md for this phase"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata.sh"
      - ".opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts"
      - ".opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/051-graph-metadata-child-drift-audit-and-harden"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Audit and harden graph-metadata.json child-drift, where a phase parent's children_ids silently lags the phase-child folders present on disk

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (validation rules) + TypeScript compiled to `scripts/dist/` |
| **Framework** | None. CLI scripts inside the system-spec-kit validation pipeline (`validate.sh` / `progressive-validate.sh`) |
| **Storage** | Filesystem JSON (`graph-metadata.json` per spec folder). No database involved. |
| **Testing** | Bash fixture harness: a temp parent folder with a deliberately unlisted child proves RED, backfill plus rerun proves GREEN |

### Overview
`is-phase-parent.ts` already computes the on-disk `^[0-9]{3}-` child set for its `countPhaseChildren` health check, but nothing compares that set against a parent's `children_ids`. This plan exposes the existing child-set resolver for reuse, runs a repo-wide audit with it, backfills every drifted parent through the existing `backfill-graph-metadata.js`, and wires a new drift check into `check-graph-metadata.sh` with a RED/GREEN fixture test. No new discovery mechanism gets built. The phase reuses what already exists and closes the one missing comparison.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CLI validation-pipeline extension. No MVC or service layer. This is a scripts-plus-rules integration inside the existing system-spec-kit tooling.

### Key Components
- **Phase-child set resolver** (`is-phase-parent.ts`): `countPhaseChildren` already walks `readdirSync` and filters `^[0-9]{3}-` entries holding `spec.md`/`description.json`. This phase exports the actual child-name set (not just the count) so the drift check can diff it against `children_ids`.
- **Drift check** (`check-graph-metadata.sh`): New comparison step. For every folder `is-phase-parent.ts` already qualifies as a phase parent, load `graph-metadata.json`, resolve the on-disk child set, and report when the sorted sets disagree.
- **Backfill runner** (`backfill-graph-metadata.js`): Existing reconciliation mechanism (readdir-based discovery, already used for `--all` and single-folder runs). Reused unchanged against every parent the audit flags as drifted.
- **RED/GREEN fixture test**: New test under `scripts/tests/` that builds a temp parent with an unlisted child folder (RED), runs the drift check, then runs the backfill and reruns the check (GREEN).

### Data Flow
```
readdirSync(parent) -> on-disk child set (^[0-9]{3}- with spec.md/description.json)
                              |
                              v
graph-metadata.json.children_ids ---compare---> drift report (parent, missing[], extra[])
                              |
                     drifted?  yes -> backfill-graph-metadata.js <parent> -> children_ids reconciled
                              |
                     drifted?  no  -> validate.sh --strict stays clean
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This addendum applies: the drift check becomes part of shared validation policy (`validate.sh --strict`), so every packet in the repo is a consumer the moment it ships.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `check-graph-metadata.sh` | Validates `graph-metadata.json` shape and status derivation, no drift comparison today | Update: add the children_ids-vs-on-disk comparison | RED/GREEN fixture test; `validate.sh --strict` on a reconciled tree stays clean |
| `is-phase-parent.ts` (source + `scripts/dist/spec/is-phase-parent.js`) | Computes `countPhaseChildren` for the manifest-size health check only | Update: export the child-name set alongside the count | `rg -n "countPhaseChildren|export function" .opencode/skills/system-spec-kit/scripts/spec/is-phase-parent.ts` |
| `backfill-graph-metadata.js` (source + dist) | Reconciles `children_ids` on demand, per-folder or `--all` | Unchanged: reused as the remediation mechanism, not modified | `git diff` after a backfill run touches only `children_ids` and continuity fingerprint fields |
| Every phase-parent `graph-metadata.json` under `.opencode/specs/**` and skill-adjacent spec trees | Declares `children_ids` for graph traversal and `last_active_child_id` resume | Backfilled for every parent the audit flags as drifted, including `sk-design` (8 to 9) and `003-spec-data-quality` (13 to current on-disk count) | Audit rerun shows zero drift; `sk-design` `children_ids` includes `009-sk-design-claude-parity` |
| `progressive-validate.sh` PHASE_LINKS surface | Already checks phase-parent linkage shape | Not a consumer of the new check unless the decision-record picks the PHASE_LINKS surface over `check-graph-metadata.sh`; note either way in decision-record.md | `rg -n "PHASE_LINKS" .opencode/skills/system-spec-kit/scripts/spec/progressive-validate.sh` |

Required inventories:
- Same-class producers: `rg -n "countPhaseChildren|children_ids" .opencode/skills/system-spec-kit/scripts/` confirms `is-phase-parent.ts` and `backfill-graph-metadata.ts` are the only two producers of the on-disk child set and the persisted `children_ids` value respectively.
- Consumers of changed symbols: `rg -n "countPhaseChildren|isPhaseParent" . --glob '*.ts' --glob '*.js' --glob '*.sh'` before changing the exported shape of `is-phase-parent.ts`, so no caller breaks when the function starts returning a set instead of (or alongside) a count.
- Matrix axes for the drift check: parent-with-no-drift, parent-with-one-missing-child, parent-with-malformed `children_ids` (not an array), non-parent folder (zero `^[0-9]{3}-` children), folder with a numbered child that has neither `spec.md` nor `description.json`.
- Algorithm invariant: the expected child set is exactly the `^[0-9]{3}-` folders holding `spec.md` or `description.json`; anything else (support folders like `research/`, `review/`, `scratch/`, or an empty numbered stub) is never part of the comparison in either direction.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Export the on-disk child-name set from `is-phase-parent.ts` (reuse `countPhaseChildren`'s filter, return the names, not just the length)
- [ ] Confirm the child-set definition against spec.md's edge cases (support folders excluded, spec.md/description.json required)
- [ ] Wire a `--audit` (or equivalent) mode into `check-graph-metadata.sh` that reports drift without failing, for the initial repo-wide pass

### Phase 2: Core Implementation
- [ ] Run the repo-wide audit and capture the drifted-parent list with before/after counts
- [ ] Backfill every drifted parent via `backfill-graph-metadata.js`, overlap-checking each one against the concurrent-session dirty set first and skipping (with a note) any hot parent
- [ ] Add the `children_ids`-vs-on-disk drift comparison to `check-graph-metadata.sh`, surfaced under `validate.sh --strict`
- [ ] Write the RED/GREEN fixture test (unlisted child folder fails, reconciled parent passes)

### Phase 3: Verification
- [ ] Rerun the repo-wide audit and confirm zero drift, including `sk-design` (children_ids includes `009-sk-design-claude-parity`) and `003-spec-data-quality`
- [ ] Run `validate.sh --strict` across the affected parents and confirm the new check is clean
- [ ] Confirm the decision-record documents severity and flag-vs-auto-regen with rationale
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Fixture (RED/GREEN) | Drift check against a temp parent with an unlisted child, then the same parent post-backfill | Bash fixture harness under `scripts/tests/`, mirroring existing `rules/*.sh` fixture patterns |
| Regression | Non-phase-parent folders and support-folder children never trigger a false positive | Same fixture harness, additional negative cases |
| Manual | Full repo audit run against the live `.opencode/specs/**` tree | `validate.sh --strict` plus the standalone audit invocation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `backfill-graph-metadata.js` children discovery (readdir-based) | Internal | Green | No independent reconciliation mechanism exists; the phase would need to build one from scratch |
| `is-phase-parent.ts` `countPhaseChildren` | Internal | Green | The on-disk child set would need a second implementation, risking a definition mismatch with the health check |
| `check-graph-metadata.sh` / `progressive-validate.sh` pipeline | Internal | Green | No home for the new check under `validate.sh --strict` |
| Concurrent-session dirty set (git status) | Internal | Yellow | Backfilling a parent mid-edit by another session could clobber in-flight work; mitigated by an overlap check before each write |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The drift check false-positives on a real, non-drifted parent under `--strict`, or a backfill run mutates a field other than `children_ids`/fingerprint on a parent.
- **Procedure**: Revert the `check-graph-metadata.sh` change (git revert the commit that added the comparison) to unblock validation immediately, then restore any touched `graph-metadata.json` from git history (`git checkout <sha>^ -- <path>/graph-metadata.json`) for the affected parents before re-attempting.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: export child set) ──► Phase 2 (Core: audit, backfill, drift check, test) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Export an existing filter's result set; no new algorithm |
| Core Implementation | Medium | Repo-wide audit run, N-parent backfill with overlap checks, one new validator branch, one fixture test |
| Verification | Low | Rerun audit and `validate.sh --strict` |
| **Total** | | Small tooling change plus a bounded, one-time repo-wide reconciliation pass |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Repo-wide audit output captured before any backfill (so before/after counts are provable)
- [ ] Concurrent-session dirty set checked (git status) before touching any parent
- [ ] `check-graph-metadata.sh` change isolated to one commit for easy revert

### Rollback Procedure
1. **Immediate**: Revert the `check-graph-metadata.sh` commit if the check produces false positives under `--strict`.
2. **Revert code**: `git revert` the validator change; the backfill commits stay (they only reconcile real drift, they are not tied to the check's correctness).
3. **Verify rollback**: Rerun `validate.sh --strict` on a sample of parents to confirm the pipeline is unblocked.
4. **Notify stakeholders**: Not user-facing; note the revert in the phase's implementation-summary.md.

### Data Reversal
- **Has data migrations?** No. `graph-metadata.json` edits are plain JSON field updates, not a schema migration.
- **Reversal procedure**: `git checkout <pre-backfill-sha> -- <parent>/graph-metadata.json` restores a specific parent's prior `children_ids` if a backfill needs undoing.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────┐
│  Export child    │────►│  Audit + Backfill +  │────►│   Verify    │
│  set (Setup)     │     │  Drift check + Test  │     │             │
└─────────────────┘     └──────────┬───────────┘     └─────────────┘
                                    │
                          ┌─────────▼─────────┐
                          │  Decision-record   │
                          │  (severity, mode)  │
                          └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Child-set export (`is-phase-parent.ts`) | None | Reusable on-disk child set | Audit, drift check |
| Repo-wide audit | Child-set export | Drifted-parent list with counts | Backfill |
| Backfill run | Audit, overlap check | Reconciled `children_ids` per parent | Verification |
| Drift check (`check-graph-metadata.sh`) | Child-set export | `validate.sh --strict` surfacing | RED/GREEN test, Verification |
| RED/GREEN test | Drift check | Proof the check fires and clears | Verification |
| Decision-record | None (parallel) | Severity + flag-vs-auto-regen ruling | Drift check's failure mode |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Export the on-disk child set** - Setup - CRITICAL
2. **Run the repo-wide audit** - Core - CRITICAL
3. **Backfill every drifted parent** - Core - CRITICAL
4. **Add the drift check + RED/GREEN test** - Core - CRITICAL
5. **Re-verify with `validate.sh --strict`** - Verify - CRITICAL

**Total Critical Path**: Five sequential steps; each depends on the prior step's output (the audit needs the exported child set, backfill needs the audit's drift list, the check needs the same exported child set, verification needs both the check and the backfill).

**Parallel Opportunities**:
- The decision-record (severity, flag-vs-auto-regen) can be drafted in parallel with the audit run; it does not block backfilling.
- Writing the RED/GREEN test fixture can start as soon as the child-set export lands, before the audit finishes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Child set exposed | `is-phase-parent.ts` returns the on-disk child names, not just a count | End of Setup |
| M2 | Drift mapped | Repo-wide audit lists every drifted parent with before/after counts | Mid Core |
| M3 | Drift reconciled | Every drifted parent, including `sk-design` and `003-spec-data-quality`, backfilled | Late Core |
| M4 | Check shipped | Drift check live under `validate.sh --strict`, RED/GREEN test passing both directions | End of Core |
| M5 | Clean repo | Full audit rerun shows zero drift; decision-record accepted | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Drift-check severity and remediation mode

**Status**: Proposed

**Context**: A parent's `children_ids` only updates when someone re-runs the backfill by hand, so the array silently falls behind the folders on disk. The fix needs two calls: how loud the check is when it fires, and whether it can fix the drift itself.

**Decision**: Surface drift as a warning under `validate.sh --strict` that only becomes blocking once the full repo is reconciled, and keep it flag-only. No auto-regen of `children_ids`.

**Consequences**:
- Every parent stays reconciled going forward without a human having to remember to run the backfill.
- A human still confirms every `children_ids` change, so an intentional exclusion never gets silently overwritten. Mitigation: the flag names the exact missing or extra children so reconciling takes one command.

**Alternatives Rejected**:
- **Hard error from day one**: Would fail unrelated completions on pre-existing drift the moment the check ships, before the repo-wide reconciliation pass runs.
- **Silent auto-regen**: Would mask a deliberate exclusion (a child folder that should not be a tracked phase) as if it were a bug.

See `decision-record.md` for the full ADR, including the Five Checks evaluation.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
