---
title: "Implementation Plan: Rollback, Audit Integrity & Non-Hub Policy"
description: "How activate-hub.cjs gains --rollback, flip-serving.cjs's stale serving-prior guard and ambiguous fence-advance are fixed, both drivers gain append-only audit history, and the non-hub policy plus P2 canary naming and the routingRecommendation field fix land — behind the still-off SPECKIT_COMPILED_ROUTING flag, without disturbing the seven already-activated hubs."
trigger_phrases:
  - "rollback audit integrity plan"
  - "non-hub policy plan"
  - "canary profile naming plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Rollback, Audit Integrity & Non-Hub Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
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
| **Language/Stack** | Zero-dependency CommonJS (`activate-hub.cjs`, `flip-serving.cjs`), JSONL (new `flip-history.jsonl`), Markdown (policy + canary docs), TypeScript (`session-snapshot.ts`), YAML (`speckit-resume-auto.yaml`) |
| **Touched driver status** | `activate-hub.cjs` is an already-shipped, Status: Complete driver (`010-live-activation`) that has activated all seven hubs; `flip-serving.cjs` is the P4b driver that flipped all seven hubs to `servingAuthority: compiled` |
| **Frozen inputs** | Three pinned scorer digests — read-only evidence only; both drivers already re-hash these on every invocation, unchanged by this child |
| **Dependency** | `002-runtime-promotion-and-status-foundation` (sequencing baseline; REQ-007's `skillRouterStatus` shape cross-references 002's status-probe contract) |

### Overview

Four tracks, each additive to already-shipped, live drivers. First, add `--rollback` to `activate-hub.cjs`, reusing its existing `proveRollback()` hash-validation as a real command instead of only a pre-flight drill. Second, fix `flip-serving.cjs`'s stale `serving-prior` guard (make the resave unconditional) and give its fence state a persisted `direction` (or restore-prior-epoch alternative), so cutover and recovery are distinguishable. Third, add an append-only `flip-history.jsonl` per hub so re-mint history is never lost. Fourth, author the non-hub ineligibility policy with negative fixtures, name the P2 canary profile/owner/window/thresholds, and fix the `routingRecommendation` field collision plus the resume/priming sufficiency probe requirement. Every change is additive; none alters the routing decision any of the seven already-activated hubs currently serves.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `activate-hub.cjs` and `flip-serving.cjs` are re-read in full immediately before implementation (this planning pass already read both in full this session; re-confirm no drift before editing).
- [ ] The seven hubs' current activation state (`servingAuthority: compiled` for all 7, per `010-live-activation`'s implementation-summary.md) is confirmed unchanged before and after this child's work.
- [ ] The three frozen scorer digests are confirmed unchanged immediately before work starts.

### Definition of Done
- [ ] `activate-hub.cjs --rollback` restores the byte-identical prior manifest via `proveRollback()`, without touching any other hub.
- [ ] `flip-serving.cjs`'s `serving-prior` resave is unconditional; a rollback-then-reflip sequence retains the correct current prior.
- [ ] `fence-state.json` (or the chosen alternative) distinguishes cutover-advance from recovery-advance.
- [ ] `flip-history.jsonl` accumulates every CAS/flip/rollback event per hub, never erasing a prior entry.
- [ ] The non-hub ineligibility policy names all 5 candidates correctly; negative fixtures pass.
- [ ] (P1) The P2 canary profile/owner/window/thresholds/rollback-trigger are named, with the owner as an explicit placeholder.
- [ ] (P1) `session-snapshot.ts`'s field collision is fixed; a live router-status probe is required before the resume/priming sufficiency early-exit.
- [ ] Frozen-scorer SHA-256 unchanged pre/post; the seven hubs' committed activation state unchanged except through this child's own proven rollback path; `validate.sh --strict` on this child folder reports Errors: 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive-fix-to-live-driver, four independent tracks. Nothing here introduces a new activation mechanism — it closes gaps in the two drivers that already exist and are already in production use for all seven hubs, plus ships two new naming/policy documents and one field-collision fix in session/resume code.

### Key Components
- **`activate-hub.cjs` (`--rollback`)**: reuses `proveRollback()` as a committed recovery command.
- **`flip-serving.cjs` (unconditional `serving-prior`, persisted `direction`)**: closes the stale-prior and ambiguous-fence-advance gaps.
- **`flip-history.jsonl`** (new, per hub): append-only audit sibling to both drivers' existing single-record files.
- **Non-hub eligibility policy + canary-profile documents** (new): the named, cross-referenced contracts CF-ACT-9 and CF-ACT-11 require.
- **`session-snapshot.ts` / `speckit-resume-auto.yaml` / `session-prime.ts`**: the field-rename and sufficiency-probe fix.

### Data Flow

An operator or a future automated rollback trigger invokes `activate-hub.cjs --hub <id> --rollback` → `proveRollback()`'s existing hash-validation logic restores the byte-identical prior manifest → a `flip-history.jsonl` entry is appended. Separately, `flip-serving.cjs`'s forward-flip path now unconditionally resaves `serving-prior` before every flip → the fence-state write records `direction` → its own `flip-history.jsonl` entry is appended (same per-hub directory, same file). Independently: the non-hub policy document is consulted by the P4 cutover controller (`011`, future) to confirm the 5 named routers are never included in the seven-hub flip order; the canary-profile document is consulted by whoever executes the P2 canary; the `session-snapshot.ts` fix changes what `session_bootstrap`/resume surfaces report, with no effect on compiled routing itself.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child edits two already-live drivers that all seven hubs depend on — the surface inventory and its verification are required before any edit, not optional.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `activate-hub.cjs` `parseArgs()` (~L79-92) | Accepts `--hub/--child/--verify/--json` only | Add `--rollback` | `node activate-hub.cjs --hub <id> --rollback` restores the byte-identical prior manifest; every other hub's `manifest.json` is byte-unchanged |
| `activate-hub.cjs` `activation-record.json` write (~L244) | Plain overwrite | Also append to `flip-history.jsonl` | Two consecutive activations of the same hub leave two entries in the JSONL, not one |
| `flip-serving.cjs` `serving-prior` capture (~L124) | `if (!fs.existsSync(...))` — first-flip-only | Unconditional resave before every forward flip | A second forward flip (after a rollback) produces a `serving-prior` matching the immediately-prior state, not the original first-ever state |
| `flip-serving.cjs` fence advance (~L105 rollback, ~L128 forward) | Both call `nextFence = fence + 1`, indistinguishable | Persist `direction`, or restore prior epoch on rollback | `fence-state.json` (or its replacement) answers "was this transition a cutover or a recovery" without external context |
| `flip-serving.cjs` `serving-flip-record.json` write (bottom of file) | Plain overwrite | Also append to `flip-history.jsonl` | Same per-hub JSONL as `activate-hub.cjs`'s entries; both drivers' events are visible in one file |
| `session-snapshot.ts` `routingRecommendation` (~L33, ~L161-167) | Grep-vs-code-graph search guidance, misleadingly named | Rename to `codeSearchRecommendation`; add `skillRouterStatus` | `grep -n "routingRecommendation" session-snapshot.ts` returns zero hits; a new field exists with a router-posture shape |
| `speckit-resume-auto.yaml` (~L110), `session-prime.ts` (~L292) | Sufficiency early-exit with no router-status probe | Require a live probe for router-cutover-relevant packets | A resume/prime pass on this program's own packets includes a router-status read before declaring context sufficient |
| The seven already-activated hubs' committed `manifest.json`/`fence-state.json` | Live, production activation state | **Unchanged except through the new, proven `--rollback` path** | Before/after byte-diff of all seven hubs' committed state, run immediately before and after this child's implementation (not just its own new-hub test cases) |
| Frozen scorer trio | Re-hashed by both drivers on every invocation already; never edited by this child | **Unchanged — not a consumer** | Pre/post SHA-256 identical |

Required inventories before implementation:
- Re-read `activate-hub.cjs` and `flip-serving.cjs` in full immediately before editing (this planning pass's reads are the baseline, not a substitute for a fresh read at build time).
- Snapshot all seven hubs' current `manifest.json` + `fence-state.json` bytes before any change, to prove byte-identity afterward for every hub this child does not deliberately roll back in a test.
- Confirm the durable location for the non-hub policy and canary-profile documents (Open Question in `spec.md` §7) before creating them.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

**Focus**: Baseline snapshot + `activate-hub.cjs --rollback`.

- [ ] Snapshot all seven hubs' current `manifest.json` + `fence-state.json` bytes as the before-state.
- [ ] Add `--rollback` to `activate-hub.cjs`'s `parseArgs()`, reusing `proveRollback()`.
- [ ] Prove the new rollback path on a non-production test hub or fixture before touching any live hub's committed state.

### Phase 2: Implementation

**Focus**: `flip-serving.cjs` fixes + append-only history + policy/canary docs.

- [ ] Replace `flip-serving.cjs`'s first-flip-only `serving-prior` guard with an unconditional resave.
- [ ] Persist `direction` in `fence-state.json` (or implement the restore-prior-epoch alternative) for both drivers.
- [ ] Add `flip-history.jsonl` emission to both `activate-hub.cjs` and `flip-serving.cjs`.
- [ ] Author the non-hub ineligibility policy document with negative fixtures for all 5 candidates.
- [ ] (P1) Author the canary-profile document naming profile/window/thresholds/rollback-trigger, owner as placeholder.

### Phase 3: Verification

**Focus**: `session-snapshot.ts` fix (P1) + full regression + final verification.

- [ ] (P1) Rename `routingRecommendation` to `codeSearchRecommendation`; add `skillRouterStatus`; wire the resume/priming sufficiency probe requirement.
- [ ] Byte-diff all seven hubs' `manifest.json`/`fence-state.json` against the Phase 1 snapshot — confirm unchanged except for any hub deliberately exercised by this child's own rollback test.
- [ ] Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
- [ ] Run `validate.sh --strict` on this child folder.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rollback proof | `activate-hub.cjs --rollback` byte-exact restore | `proveRollback()`'s existing hash-validation, now exercised as a real command |
| Regression | `flip-serving.cjs`'s existing forward-flip and rollback behavior unchanged for a single-flip hub | Before/after diff on a fixture hub with exactly one flip |
| New-behavior proof | `flip-serving.cjs`'s fixed `serving-prior` guard on a rollback-then-reflip sequence | A fixture hub exercised through rollback then a second forward flip |
| Audit | `flip-history.jsonl` accumulates without erasure | Two consecutive activation/flip/rollback events on the same fixture hub |
| Negative fixtures | Non-hub ineligibility for all 5 candidates | One fixture per candidate asserting legacy/shadow-only status |
| Fleet regression | All seven already-activated hubs' committed state unchanged | Byte-diff snapshot before/after this child's full implementation |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `002-runtime-promotion-and-status-foundation` | Internal | Planned (not started) | REQ-007's `skillRouterStatus` shape cross-references 002's contract; REQ-001..REQ-006 have no confirmed hard dependency on 002 |
| `010-live-activation` (already Complete) | Internal | Complete — all 7 hubs activated | This child directly modifies its `activate-hub.cjs`; any regression here risks the seven already-shipped activations |
| `011-runtime-engine` (already built; flipped all 7 hubs) | Internal | Complete | This child directly modifies its `flip-serving.cjs`; same regression risk as above |
| `009-non-hub-rollout/` (4 real children, cross-referenced only) | Internal | Shadow-only, in progress | REQ-005's policy document must accurately describe these children's real state; no edit to them from this child |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any phase's regression check finds an already-activated hub's committed `manifest.json` or `fence-state.json` changed by anything other than a deliberate, in-scope test rollback; or the frozen scorer digests drift.
- **Procedure**: This child's own code changes (the new `--rollback` flag, the guard fix, the `direction` field, the `flip-history.jsonl` emission, the new documents, the field rename) are all additive and revert with a plain `git revert`. If a regression check finds live hub state was disturbed, the immediate recovery is `activate-hub.cjs --rollback` or `flip-serving.cjs --rollback` (the very capability this child builds/fixes) restoring the byte-identical prior manifest for the affected hub, followed by reverting this child's code diff.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline snapshot + activate-hub --rollback) ──► Phase 2 (flip-serving fixes + audit + policy/canary docs) ──► Phase 3 (session-snapshot fix + full regression + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (snapshot + activate-hub rollback) | — | Phase 2, and the Phase 3 regression check |
| Implementation (flip-serving fixes + audit + docs) | Setup | Phase 3 |
| Verification (session-snapshot fix + regression + final) | Implementation | Completion |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|--------------------|
| Setup (snapshot + activate-hub rollback) | Med | Reuses existing `proveRollback()`; new CLI wiring only |
| Implementation (flip-serving fixes + audit + docs) | Med-High | Two live-driver fixes + two new documents |
| Verification (session-snapshot fix + regression) | Med | The fleet regression check (7 hubs) is the highest-care item |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] Frozen-scorer digests re-verified before any change.
- [ ] All seven hubs' committed `manifest.json`/`fence-state.json` bytes snapshotted.
- [ ] `activate-hub.cjs` and `flip-serving.cjs` re-read in full immediately before editing.

### Rollback procedure
1. If any already-activated hub's committed state was disturbed outside an in-scope test: run `activate-hub.cjs --rollback` or `flip-serving.cjs --rollback` for that hub to restore the byte-identical prior manifest.
2. `git revert` this child's code diff (driver fixes, new flag, new field, new documents).
3. Confirm the frozen scorer digests are still unchanged after the revert.
4. Byte-diff all seven hubs' committed state against the Phase 1 snapshot to confirm full restoration.

### Data reversal
- **Has runtime effect?** Only through the exact rollback capability this child builds/fixes — which is designed precisely to make any such effect byte-exactly reversible.
- **Reversal procedure**: `--rollback` on the affected driver, then a plain code revert; no other external committed effect exists to undo.

<!-- /ANCHOR:enhanced-rollback -->
