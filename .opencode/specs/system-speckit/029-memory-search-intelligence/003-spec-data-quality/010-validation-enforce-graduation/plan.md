---
title: "Implementation Plan: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift"
description: "Three sequential phases, each a census-driven backfill-then-flip: (1) SPECKIT_STATUS_CROSS_DOC_ENFORCE, pure shell, after 017 and 015 land; (2) SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE, with a fresh (not reused) census accounting for the post-008 re-nest campaign; (3) SPECKIT_CHILD_DRIFT_ENFORCE, gated on a new dist-presence freshness guard built first, reusing the existing dist-freshness.cjs infrastructure."
trigger_phrases:
  - "validation enforce graduation plan"
  - "status cross-doc enforce flip plan"
  - "metadata disk consistency enforce flip plan"
  - "child drift enforce flip plan"
  - "dist presence freshness guard plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/003-spec-data-quality/010-validation-enforce-graduation"
    last_updated_at: "2026-07-11T00:00:00.000Z"
    last_updated_by: "markdown"
    recent_action: "All three validation flags graduated and completion evidence synchronized"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-019-validation-enforce-graduation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (the three rule scripts, sourced by `validate.sh`), TypeScript (`capability-flags.ts`, compiled to `mcp_server/dist`), Node/CommonJS (`dist-freshness.cjs`) |
| **Framework** | `validate.sh`'s rule-sourcing harness; `dist-freshness.cjs`'s existing `DIST_PACKAGES` registry for source-vs-dist staleness |
| **Storage** | None new — reads spec-doc text, `description.json`/`graph-metadata.json`, and (Phase 3) file mtimes/hashes under the existing freshness-cache convention |
| **Testing** | `scripts/tests/validation-gate-hardening.vitest.ts` already covers Phase 1 and 2's advisory/enforce toggle at unit level (`:145-180`); `scripts/tests/check-graph-metadata-child-drift.sh` already covers Phase 3's advisory/enforce toggle and the rc=20/21 branch. New coverage is additive: the census driver's own correctness, and the new dist-presence guard |

### Overview

Three independent flag flips, each following the same three-step shape (backfill to zero → verify zero tree-wide → flip the default), sequenced by risk, not by file order. Phase 1 (`STATUS_CROSS_DOC_ENFORCE`) is pure shell-side status classification with zero daemon or build-dependency risk, and is additionally sequenced after both 017 (flag-parsing trustworthiness, a hard external precondition) and 015 (`validation-hardening-fixes`, whose classifier fix changes how many folders this exact rule can even compare). Phase 2 (`METADATA_DISK_CONSISTENCY_ENFORCE`) reuses the same shape but with one explicit deviation from the closest precedent (`008-metadata-rename-reconciliation`): the census must be taken fresh, immediately before backfill, because 008's own baseline predates a folder re-nest campaign known to have re-dirtied this exact drift class. Phase 3 (`CHILD_DRIFT_ENFORCE`) is qualitatively different — its enforce mode fails closed on scanner-dependency unavailability — so it is not safe to graduate with the same shape alone; it needs a new dist-presence/freshness guard built and independently verified first, which this plan designs by extending the already-existing `dist-freshness.cjs` registry rather than inventing new tooling.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md complete)
- [ ] Success criteria measurable (SC-001..005)
- [ ] Dependencies identified (017 hard-blocking; 015 soft-sequencing for Phase 1; 008 as stale-baseline caveat for Phase 2)
- [ ] Architecture decisions documented (ADR-001..003 in decision-record.md)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..004)
- [ ] P1 acceptance criteria met (REQ-005..008) — none deferred, or deferral explicitly recorded with operator approval
- [ ] Each phase's flip committed independently (per the rollback design below)
- [ ] `validate.sh --strict` tree-wide sweep shows no net-new regression (REQ-008)
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three independent, sequentially-gated flag graduations, each a small pure-function/config change (the actual flip is a one-line default change in `capability-flags.ts`) preceded by a disposable, purpose-built census script — no new permanent harness, matching how 008's and 015's own repo-wide reconciliation passes were run.

### Key Components

- **Census driver** (new, disposable, one per phase or a single parameterized script): temporarily forces the target `SPECKIT_*_ENFORCE` env var `true` for a read-only measurement pass (never left set), loops `validate.sh --strict --json --no-recursive` (the same flag combination `strict-pass-freshness.ts` already uses at `sweep/strict-pass-freshness.ts:32-34`) across every spec folder under `.opencode/specs`, parses each folder's `--json` `results[]` array for the one target rule's `status` (the JSON shape is `{"rule":"...","status":"pass|warn|error|info","message":"..."}`, emitted by `validate.sh`'s own `_json_escape`-based result builders at `scripts/spec/validate.sh:327-343`), and tallies `warn` counts as the violation census.
- **`classify_status()` / `classifyStatus()`** (`scripts/lib/status-classifier.sh:26-52`, `scripts/sweep/strict-pass-freshness.ts:89-96`): already fixed for `Implemented`/`Implementing` by 015 — Phase 1's census consumer, not something this plan re-touches.
- **`check-metadata-disk-consistency-helper.cjs`** (invoked by `check-metadata-disk-consistency.sh:33`): already computes the mismatch list Phase 2's census reads; no change needed to the comparator itself.
- **`dist-freshness.cjs`'s `DIST_PACKAGES` registry** (`scripts/lib/dist-freshness.cjs:21-161`): already has a `system-spec-kit/scripts` package entry (`:31-38`) whose `sourceCandidates: ['.']` covers `scripts/spec/is-phase-parent.ts`, but whose only `distEntries` key (`default: 'dist/tsconfig.tsbuildinfo'`) does not point at the specific file the child-drift rule loads (`dist/spec/is-phase-parent.js`). Phase 3 adds a named entry for it, following the exact pattern already used for `'validation-orchestrator'` (`:46`) and `'spec-memory-cli'` (`:45`) — a per-entry key with matching `entrySourceCandidates`.
- **`check-graph-metadata-child-drift.sh`'s rc=20/21 branch** (`:99-107`): today only distinguishes "scanner unavailable" from "drift found" from "clean" — it has no freshness dimension. Phase 3 adds a guard check ahead of the scanner import, reusing the `STALE_EXIT_CODE=69` convention `validate.sh`'s own orchestrator dispatch already uses for a different package (`scripts/spec/validate.sh:993-1011`, calling `dist-freshness.cjs check --package system-spec-kit/mcp_server --entry validation-orchestrator`).

### Data Flow

Each phase: census driver sets the target flag `true` transiently → loops `validate.sh --strict --json` per folder → aggregates `warn` counts for the one target rule → for each violation, the appropriate canonical tool reconciles it (Phase 1: a docs-only `Status` field edit or an explicit intentional-difference note; Phase 2: `generate-description.js`/`backfill-graph-metadata.js` regeneration, never hand-edited JSON; Phase 3: `backfill-graph-metadata.js`'s `children_ids` merge, still union-only, still never pruning) → re-run the census → on a confirmed zero (or an individually-explained residual), flip the flag's real default in `capability-flags.ts` and update `ENV_REFERENCE.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies because this phase changes three validation gates' pass/fail behavior across every spec folder in the repo, not just this one — the same reasoning `015-validation-hardening-fixes` used for its own affected-surfaces table.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `check-status-cross-doc-consistency.sh:51` | Advisory gate on `SPECKIT_STATUS_CROSS_DOC_ENFORCE` | Flip the flag's resolved default (via `capability-flags.ts`, not by hand-editing the rule script) | Census reports zero `warn` post-backfill; a representative folder's `--strict` output changes from advisory-pass to a real pass/fail comparison |
| `check-metadata-disk-consistency.sh:55` | Advisory gate on `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` | Same flip pattern, fresh census first | Census reports zero post-backfill; spot-check a folder 008 did NOT touch (created after 008's run) still classifies correctly |
| `check-graph-metadata-child-drift.sh:56,68,70,75` (scanner resolution + rc 20/21) | Fail-closed under enforce on total unavailability only | Add a freshness dimension (Phase 3 guard) ahead of the existing branch | A deliberately-stale dist fixture is now caught pre-flip; a fresh dist still passes with no added overhead |
| `dist-freshness.cjs`'s `system-spec-kit/scripts` package entry (`:31-38`) | Watches the whole `scripts` package via one `default` entry | Add a named `is-phase-parent` entry mirroring `validation-orchestrator`'s pattern (`:46`) | `node dist-freshness.cjs check --package system-spec-kit/scripts --entry is-phase-parent` reports `fresh`/`stale`/`missing` correctly against fixture states |
| `capability-flags.ts` (three flag resolvers) | Each reads its env var with a `false`/off default | Flip each resolved default; update doc-comments to record graduation | `mcp_server` typecheck/build clean; a unit test asserts the new resolved default with the env var unset |
| `ENV_REFERENCE.md:167-168,469-470` | Documents two of the three flags as default-OFF-advisory | Update both rows to enforcing; add the currently-missing `SPECKIT_CHILD_DRIFT_ENFORCE` row | Grep confirms all three flags now have a documented row consistent with their real resolved default |

Required inventories:
- Other consumers of `SPECKIT_STATUS_CROSS_DOC_ENFORCE` / `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` / `SPECKIT_CHILD_DRIFT_ENFORCE`: `rg -n 'SPECKIT_STATUS_CROSS_DOC_ENFORCE|SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE|SPECKIT_CHILD_DRIFT_ENFORCE' .opencode/skills/system-spec-kit` (expected: the three rule scripts, their vitest/bash test files, and `ENV_REFERENCE.md`; confirm no other consumer during implementation, since this plan's own research did not find one beyond those).
- Other consumers of `dist-freshness.cjs`'s `DIST_PACKAGES` registry: `rg -n 'dist-freshness' .opencode/skills/system-spec-kit/scripts .opencode/skills/system-spec-kit/mcp_server` (expected: `validate.sh`'s orchestrator dispatch is the only current caller; adding a new entry must not change its existing `'validation-orchestrator'`/`'spec-memory-cli'` behavior).
- Matrix axes for the Phase 3 guard: dist missing / dist present-but-stale (source newer) / dist fresh, crossed with `SPECKIT_CHILD_DRIFT_ENFORCE` on/off — four of the six cells matter (advisory mode should stay unaffected by dist state, matching the rule's existing "best-effort" comment at `:98`).
- Algorithm invariant: with every flag still at its pre-flip default, `validate.sh` output for every folder is byte-identical to today's, per NFR-R01 in spec.md.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Precondition Gate
- [ ] Confirm 017 (flag-parsing trustworthiness) has landed: its own `validate.sh --strict` passes
- [ ] Confirm 015 (`validation-hardening-fixes`) has landed: `classify_status()`/`classifyStatus()` recognize `Implemented`/`Implementing`, and its own REQ-006 reconciliation (006/010) is still clean, not re-dirtied
- [ ] Write the parameterized census driver (folder loop + `--json` result parse + per-rule tally), read-only, no side effects

### Phase 1: `SPECKIT_STATUS_CROSS_DOC_ENFORCE` graduation
- [ ] Run the tree-wide advisory census for `STATUS_CROSS_DOC_CONSISTENCY`
- [ ] Reconcile every real mismatch (Status field correction, or an explicit intentional-difference note when the difference is deliberate)
- [ ] Re-run the census, confirm zero (or record an individually-explained residual)
- [ ] Flip the resolved default in `capability-flags.ts`; update its doc-comment and `ENV_REFERENCE.md:168,470`
- [ ] Spot-check 2-3 representative folders' `validate.sh --strict` output changes from advisory-pass to a real comparison
- [ ] Commit Phase 1 independently

### Phase 2: `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` graduation
- [ ] Take a **fresh** mismatch census immediately before backfilling — do not reuse 008's baseline
- [ ] Cross-reference the census against the known post-008 re-nest campaign moves to confirm those folders' drift is accounted for, not assumed already-fixed
- [ ] Reconcile every real mismatch via `generate-description.js`/`backfill-graph-metadata.js` (never hand-edited JSON)
- [ ] Re-run the census, confirm zero (or record an individually-explained residual, per 008's own precedent for honest disclosure)
- [ ] Flip the resolved default; update doc-comment and `ENV_REFERENCE.md:167,469`
- [ ] Spot-check a folder created after 008's run to confirm it classifies correctly
- [ ] Commit Phase 2 independently

### Phase 3: Dist-presence guard, then `SPECKIT_CHILD_DRIFT_ENFORCE` graduation
- [ ] Add a named `is-phase-parent` entry to `dist-freshness.cjs`'s `system-spec-kit/scripts` package (`distEntries` + matching `entrySourceCandidates` pointing at `scripts/spec/is-phase-parent.ts`)
- [ ] Wire the guard into `check-graph-metadata-child-drift.sh` ahead of the existing scanner import, so a missing-or-stale dist under `SPECKIT_CHILD_DRIFT_ENFORCE=true` fails closed with a rebuild-command remediation message (reusing the `STALE_EXIT_CODE=69` convention)
- [ ] Verify the guard against three fixture states (missing dist, stale dist, fresh dist) crossed with enforce on/off, before touching the census
- [ ] Run the tree-wide advisory census for `GRAPH_METADATA_CHILD_DRIFT`
- [ ] Reconcile every real `children_ids` drift via `backfill-graph-metadata.js` (union-only, never pruning, matching the writer's existing contract)
- [ ] Re-run the census, confirm zero
- [ ] Flip the resolved default; add the currently-missing `ENV_REFERENCE.md` row
- [ ] Re-verify the guard's fail-closed behavior against a deliberately-broken fixture with the flag now truly enforcing
- [ ] Commit Phase 3 independently

### Phase 4: Verification
- [ ] Full tree-wide `validate.sh --strict` sweep (or `strict-pass-freshness.ts`) with all three flags at their new defaults, confirm no net-new regression
- [ ] Record before/after counts and evidence commands in `implementation-summary.md`
- [ ] Mark `checklist.md` items with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Existing advisory/enforce toggle coverage for all three rules (`validation-gate-hardening.vitest.ts:145-180`, `check-graph-metadata-child-drift.sh`) re-run to confirm still green after the flips | Vitest, bash test harness |
| Unit (new) | Dist-presence guard: missing dist, stale dist (source mtime newer), fresh dist, each crossed with enforce on/off | Bash fixture invocation, extending `check-graph-metadata-child-drift.sh`'s existing test file |
| Integration | Tree-wide census correctness: a synthetic small fixture tree with known mismatches, confirming the census driver's tally matches a hand-count | New fixture-based test alongside the census driver |
| Repo-wide | Post-flip `validate.sh --strict` sweep across `.opencode/specs`, all three flags enforcing | `strict-pass-freshness.ts` or an equivalent full loop |
| Manual | Confirm `ENV_REFERENCE.md`'s three rows read consistently with the real resolved defaults | Read tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| 017 (flag-parsing trustworthiness) | Internal, upstream | Not yet landed (hard blocker) | No phase of this packet may start |
| 015-validation-hardening-fixes | Internal, soft-sequencing (Phase 1 only) | In progress as of this spec (own frontmatter: not yet committed) | Phase 1's census would miscount newly-`Implemented`-comparable folders if run first |
| 008-metadata-rename-reconciliation | Internal, precedent + stale-baseline caveat (Phase 2 only) | Complete (shipped) | Not a blocker — its baseline is simply not reusable as-is; informs REQ-003's fresh-census requirement |
| `dist-freshness.cjs`'s existing `DIST_PACKAGES` infrastructure | Internal | Green (exists, unmodified by other phases) | Phase 3's guard reuses it rather than building new tooling; if this infra were ever removed, Phase 3 would need a bespoke fallback |
| `capability-flags.ts` build/typecheck | Internal | Green | A flag-default edit that fails typecheck blocks all three flips equally, since they share the file |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A phase's post-flip verification sweep (Phase 4, or an ad-hoc check after any individual phase) shows a net-new regression not attributable to the phase's own deliberate reconciliation.
- **Procedure**: Each phase's flip is a single, independently committed default change in `capability-flags.ts`. Revert that phase's commit alone; the other two phases' flips (already merged) are unaffected, since the three flags are read independently by three separate rule scripts with no shared state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Precondition Gate) ──> Phase 1 (Status) ──> Phase 2 (Metadata Disk) ──> Phase 3 (Child Drift) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Precondition Gate | 017, 015 (external) | Phase 1 |
| Phase 1 (Status) | Precondition Gate | Phase 2 (sequenced, not strictly technically dependent) |
| Phase 2 (Metadata Disk) | Phase 1 landed (sequencing convention, not a technical coupling) | Phase 3 |
| Phase 3 (Child Drift) | Phase 2 landed; its own dist-presence guard sub-steps | Phase 4 |
| Phase 4 (Verify) | Phases 1-3 | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Precondition Gate + census driver | Low | 2-3 hours |
| Phase 1 (Status) | Low | 2-4 hours (mostly census + reconciliation volume, not code) |
| Phase 2 (Metadata Disk) | Low-Med | 3-5 hours (fresh census plus re-nest cross-reference) |
| Phase 3 (Child Drift + guard) | Medium | 6-10 hours (new guard code, fixture tests, then the same census shape) |
| Phase 4 (Verify) | Low | 1-2 hours |
| **Total** | | **14-24 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each phase's census re-run immediately before its own flip (not stale from an earlier planning pass)
- [ ] `capability-flags.ts` and `mcp_server` build/typecheck green before any flip commit
- [ ] `ENV_REFERENCE.md` updated in the same commit as its corresponding flip

### Rollback Procedure
1. Identify which phase's flip introduced the regression (each phase commits independently, so `git bisect`-equivalent isolation is trivial)
2. Revert that phase's single commit
3. Re-run `validate.sh --strict` tree-wide to confirm the regression is gone and the other two phases' behavior is untouched
4. Record the rollback and root cause in this packet's `implementation-summary.md`

### Data Reversal
- **Has data migrations?** No new schema; Phase 2/3 reconciliation writes generated JSON via existing idempotent generators, which are themselves already reversible (re-running against the pre-flip state reproduces the prior output)
- **Reversal procedure**: N/A beyond the flag-default revert above — no destructive data operation is introduced by this packet
<!-- /ANCHOR:l2-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐
│  017 (external)      │
│  015 (external, soft)│
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  Precondition Gate   │
│  + Census Driver      │
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  Phase 1: Status      │
│  Cross-Doc Enforce     │
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  Phase 2: Metadata     │
│  Disk-Path Enforce      │
│  (fresh census)         │
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  Phase 3: Dist-Presence │
│  Guard, then Child       │
│  Drift Enforce            │
└──────────┬───────────┘
           ▼
┌─────────────────────┐
│  Phase 4: Verify        │
└─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Census driver | Precondition Gate | Per-folder, per-rule violation tallies | All three phase censuses |
| Phase 1 flip | Zero-violation census | Enforcing `STATUS_CROSS_DOC_ENFORCE` | Nothing technically, sequenced first by convention |
| Phase 2 fresh census | Phase 1 landed (convention) | Zero-violation confirmation, re-nest-aware | Phase 2 flip |
| Phase 3 dist-presence guard | `dist-freshness.cjs` registry | Fail-closed-safe enforce path | Phase 3 flip |
| Phase 3 flip | Guard verified + zero-violation census | Enforcing `CHILD_DRIFT_ENFORCE` | Phase 4 |
| Phase 4 sweep | All three flips | Regression confirmation | Packet completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **017 + 015 landing** (external) — CRITICAL, not owned by this packet
2. **Precondition Gate + census driver** — 2-3 hours — CRITICAL
3. **Phase 1 (Status)** — 2-4 hours — CRITICAL
4. **Phase 2 (Metadata Disk)** — 3-5 hours — CRITICAL
5. **Phase 3 (Child Drift + guard)** — 6-10 hours — CRITICAL, longest single phase
6. **Phase 4 (Verify)** — 1-2 hours — CRITICAL

**Total Critical Path** (excluding external 017/015 wait time): 14-24 hours

**Parallel Opportunities**:
- The census driver can be written and unit-tested before Phase 0's precondition check resolves (no dependency on 017/015 landing to write the tool itself, only to run it for real).
- Phase 3's guard code and its fixture tests can be developed in parallel with Phase 1/2's census-and-reconcile work, since the guard has no dependency on either flag's own state.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Precondition confirmed, census driver built | 017/015 landed; driver unit-tested against a fixture | Day 1 |
| M2 | Phase 1 flipped | Zero-violation census, flag flipped, committed | Day 1-2 |
| M3 | Phase 2 flipped | Fresh census, zero violations, flag flipped, committed | Day 2 |
| M4 | Phase 3 guard proven | Missing/stale/fresh fixture matrix all pass | Day 2-3 |
| M5 | Phase 3 flipped, tree-wide verify clean | Zero violations, flag flipped, Phase 4 sweep clean | Day 3-4 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Reuse the `SPECKIT_GENERATED_METADATA_GRANDFATHER` backfill→verify→flip pattern | Already proven in this repo; inventing a new mechanism would be unjustified novelty for an identically-shaped problem |
| ADR-002 | Sequence least-risky-first: Status → Metadata Disk → Child Drift | Matches the task's own explicit ordering rationale; each phase's evidence de-risks the next |
| ADR-003 | Build the Phase 3 dist-presence guard by extending `dist-freshness.cjs`'s existing registry, not a bespoke checker | Reuses proven infrastructure (`STALE_EXIT_CODE` convention already load-bearing for the orchestrator) rather than duplicating staleness-detection logic |

<!-- /ANCHOR:l3-adr-summary -->

---

## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Confirm 017 (flag-parsing trustworthiness) has landed and its own `validate.sh --strict` passes
- [ ] Confirm 015 (`validation-hardening-fixes`) has landed and its own reconciliation is still clean
- [ ] Confirm the census driver is unit-tested against a known-mismatch fixture before running it against the real tree
- [ ] Confirm the target phase's prior phase (if any) already flipped and committed independently

### Task Execution Rules

| ID | Rule |
|----|------|
| TASK-SEQ-001 | Phases execute in the recorded order (Setup → Status → Metadata Disk → Child-Drift Guard → Child-Drift Flip → Verify); never skip ahead to a later phase's flip |
| TASK-SCOPE-001 | A phase's backfill reconciles only the violation class its own rule detects; it never hand-edits generated JSON outside the canonical generator scripts |
| TASK-SCOPE-002 | A flag flip is a single-line default change in `capability-flags.ts`, committed independently per phase |

### Status Reporting Format

Each phase reports: census timestamp, folder count, violation count before backfill, violation count after re-census, and the flip commit SHA — recorded in `implementation-summary.md`, not asserted from memory.

### Blocked Task Protocol

A `[B]` blocked task (T001/T002 in `tasks.md`) halts all downstream phase work until its blocking dependency (017, then 015) is confirmed landed via a real `validate.sh --strict` run on the dependency's own folder, not an assumption from this doc's snapshot.

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Full dependency graph, critical path, milestones, ADR summary
- Planning-only: no phase checkboxes marked
-->
