---
title: "Implementation Plan: Parity, Regression, and Closeout"
description: "Serialize the Phase 004 closeout: bounded routing-only remediation, owner-harness rebuilds, the seven-canary fleet gate, adjudication-before-write for authored hashes and route-gold, graduated manifest refresh with authored freshness, compiled-route-sync check/promotion/verify with retained rollback and late finalize, canonical-seven status, recursive strict validation, metadata/continuity regeneration, and the final scoped closeout."
trigger_phrases:
  - "parity closeout plan"
  - "seven canary plan"
  - "fleet promotion plan"
  - "compiled route sync plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout"
    last_updated_at: "2026-08-16T07:53:20.991Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the serial Phase 004 parity, promotion, and closeout plan end to end."
    next_safe_action: "Retry the final daemon-owned Phase 020 index scan when the memory service is available."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Parity, Regression, and Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (compiled-routing tool chain and harnesses), Bash (receipts and gates), Markdown/JSON/YAML (authored surfaces), system-spec-kit Level 3 packet |
| **Framework** | `009-parent-hub-rollout` harness owners, `compiled-route-manifest.cjs`, `compiled-route-sync.cjs`, `compiled-route-status.cjs`, `compiled-route.cjs`, `compiled-route-guard.cjs`, `generate-context.js`, `validate.sh` |
| **Storage** | Child-local `scratch/closeout/` receipts plus the authored packet docs |
| **Testing** | Owner-harness rebuilds, seven canaries, route-gold and parity, authored-freshness checks, sync check/promote/verify, kill-switch and representative route probes, recursive strict validation, metadata regeneration, scoped Git diff |
| **Mutation Policy** | Authoring pass writes only inside this child folder; the execution pass mutates only the named compiled-routing surfaces through their owning tools |

### Overview

Phase 004 runs seven serial stages: preflight and frozen pins, owner-harness rebuilds, the seven-canary fleet gate, adjudication-before-write expectation updates, graduated manifest refresh with authored freshness, the compiled-route-sync check/promotion/verify sequence with retained rollback, then canonical-seven status, recursive strict validation, metadata/continuity regeneration, and the final scoped diff. Any post-publish failure reverts and stops; rollback finalizes only after every gate passes. Commit, merge, and push remain outside the implementation pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Approved plan, parent spec, and Phases 001-003 specs reread from the worktree.
- [x] Seven Phase 003 checkpoint receipt sets exist and the frozen substrate pins match the Phase 001 values.
- [x] The compiled-routing tool usage contract is reread and the exact flags are recorded.
- [x] No staged files; initial scoped status captured.
- [x] The receipt root resolves below this child folder.
- [x] The graduated manifest set and the canonical hub list match the Phase 001 matrix.

### Definition of Done for the 004 Closeout Handoff

- [x] Every changed hub rebuilds through its owner harness with a canonical `status: built` receipt.
- [x] All seven canaries exit 0 with route-gold, mode, leaf, bundle, and fallback rows captured.
- [x] Every authored-hash or route-gold update has a prior adjudication row.
- [x] Frozen replay and scorer digests match the Phase 001 pins before and after every action.
- [x] Only graduated manifests refresh; authored freshness is proven for all seven.
- [x] `compiled-route-sync.cjs --check` exits 0, promotion retains its rollback, promoted `--verify` exits 0.
- [x] Parity, kill-switch, and representative route/bundle/defer/rollback probes pass.
- [x] Any post-publish failure reverts with `--revert <rollback>` and stops; rollback finalizes only after all gates pass.
- [x] `compiled-route-status.cjs --all` asserts the seven canonical hubs compiled-serving and fresh.
- [x] Recursive strict validation exits 0; metadata and continuity regeneration complete; final daemon index refresh deferred after retryable timeouts.
- [x] Final Git evidence shows no staged files, no out-of-scope path, and no task-created temporary residue.
- [x] Lifecycle is Complete for the worktree implementation; canonical metadata is complete and final index freshness is explicitly deferred.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Serial fleet-closeout pipeline: prove each changed hub rebuilds, prove all seven canaries, write adjudication before any expectation changes, refresh only graduated manifests, then move through the canonical sync/promotion/verify sequence with a retained rollback, assert canonical status, and close with recursive validation plus metadata regeneration.

### Key Components

- **Remediation Guard**: applies the REQ-001 eligibility table before any repair; anything outside routing inputs, migration-changed expectations, compilation, canary/parity fixtures, manifest freshness, or promoted-closure construction is denied.
- **Owner Rebuilder**: invokes each changed hub's own `009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs` and canonicalizes the receipt.
- **Canary Runner**: runs the seven hub canary owners and captures route-gold, mode names, typed leaf sets, bundle/ambiguous routes, and zero-signal fallback rows.
- **Adjudication Ledger**: records the prior value, migration cause, expected delta, and decision before any authored-hash or route-gold write.
- **Graduated Refresher**: refreshes only existing graduated activation manifests through `compiled-route-manifest.cjs refresh`, preserving generation, serving authority, shadow-only state, and fencing semantics.
- **Freshness Prover**: asserts authored manifest validity and freshness for all seven before the sync check.
- **Sync Promoter**: runs `compiled-route-sync.cjs --check`, promotion, promoted `--verify`, and on failure `--revert <rollback>`; `--finalize <rollback>` runs only after every post-publish gate passes.
- **Status Asserter**: runs `compiled-route-status.cjs --all` and asserts the seven canonical hubs report compiled-serving and fresh, excluding temporary fixtures.
- **Validation Finisher**: runs per-child strict validation, the `015` recursive strict run, `generate-context.js` regeneration, and the final scoped diff.

### Data Flow

```text
preflight + frozen pins
        |
        v
owner rebuilds -> seven canaries -> adjudication rows -> expectation updates
        |
        v
graduated manifest refresh -> authored freshness (7/7)
        |
        v
sync --check -> promotion (retained rollback) -> --verify -> probes
        |
        v
post-publish gate (pass: status 7/7 + finalize; fail: --revert and stop)
        |
        v
recursive strict validation -> generate-context.js -> completed canonical metadata and index gate -> final diff
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Phase 004 Action | Verification |
|---------|--------------|------------------|--------------|
| `009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs` (per hub) | Owner rebuild harness | Rebuild every changed hub through its owner | Canonical JSON receipt with `status: built` |
| `009-parent-hub-rollout/<entry>/harness/validate-canary.cjs` (per hub) | Per-hub canary owner | Run all seven canaries | Exit 0 plus inspection rows |
| Authored activation manifests | Compiled eligibility | Graduated refresh through `compiled-route-manifest.cjs refresh` | Freshness 7/7; before/after diff |
| Authored hashes and route-gold fixtures | Parity expectations | Update only after an adjudication row | Adjudication ledger precedes every write |
| `compiled-route-sync.cjs` closure | Promoted runtime | `--check`, promote, `--verify`, `--revert`, `--finalize` | Exit 0 at each gate; rollback retained until finalize |
| `compiled-route-status.cjs --all` | Serving status | Assert the seven canonical hubs compiled-serving and fresh | 7/7 canonical rows; fixtures excluded |
| `compiled-route.cjs` probes | Representative routing | Run route, bundle, defer, and rollback probes per hub | Machine-readable probe receipts |
| Kill switch | Flag-gated compiled serving | Disable/enable the compiled-routing switch and probe fallback | Fallback restores; compiled resumes on enable |
| Frozen replay and scorer trio | Protected substrate | Hash before and after every action; never edit | Pins match the Phase 001 values |
| Child packet docs and metadata | Authored closeout surface | Six Level-3 docs plus `description.json` and `graph-metadata.json` | Strict validation exit 0 |
| `015-router-unification-program` and ancestors | Program topology | Recursive strict validation and metadata regeneration | Recursive strict exit 0; continuity refreshed |
| Canonical metadata/index runtime | Existing bound runtime | Run child saves and index scans | Metadata complete; final daemon index refresh deferred |

Required inventories:

- Canonical hub-to-entry map: sk-code `001-sk-code`, system-deep-loop `002-system-deep-loop`, mcp-tooling `003-mcp-tooling`, cli-external-orchestration `004-cli-external-orchestration`, sk-prompt `005-sk-prompt`, sk-design `006-sk-design`, sk-doc `007-sk-doc`.
- Graduated manifest inventory: every existing activation manifest eligible for `refresh`, with its generation, serving authority, shadow-only state, and fencing attributes captured before any refresh.
- Expectation inventory: every authored hash and route-gold fixture that this migration can legitimately change, each mapped to the Phase 003 delta that causes it.
- Probe inventory: the representative route, bundle, defer, and rollback probe definitions per canonical hub.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preflight and Frozen Pins

- [x] Confirm the repository root is the isolated 010 worktree.
- [x] Re-read the approved plan, `../spec.md`, and Phases 001-003 specs; record their hashes.
- [x] Capture initial scoped status and assert no staged files.
- [x] Run actual SHA-256 over the frozen replay and scorer trio and compare to the Phase 001 pins.
- [x] Confirm the seven Phase 003 checkpoint receipts exist and the canonical hub-to-entry map matches.
- [x] Read the usage contract of `compiled-route-manifest.cjs`, `compiled-route-sync.cjs`, and `compiled-route-status.cjs`; record exact flags.

### Phase 2: Rebuilds and the Seven-Canary Gate

- [x] Run each changed hub's `build-artifacts.cjs` owner and canonicalize the receipt.
- [x] Run all seven `validate-canary.cjs` owners and capture route-gold, mode, leaf, bundle, and fallback rows.
- [x] Record every non-zero or missing canary factually; the fleet gate stays open.
- [x] Confirm frozen digests still match after rebuilds and canaries.

### Phase 3: Adjudication and Expectation Updates

- [x] Write an adjudication row for every authored hash or route-gold change this migration causes.
- [x] Update expectations only after their adjudication rows exist.
- [x] Keep the frozen replay and scorer digests out of any adjudication; a mismatch halts with LOGIC-SYNC.
- [x] Re-run the seven canaries after expectation updates and confirm still green.

### Phase 4: Graduated Manifest Refresh and Freshness

- [x] Capture the graduated manifest inventory with generation, serving authority, shadow-only state, and fencing attributes.
- [x] Refresh existing graduated manifests through `compiled-route-manifest.cjs refresh` only.
- [x] Inspect the before/after manifest diff and confirm no non-graduated manifest moved.
- [x] Prove authored freshness for all seven; a stale manifest blocks the sync check.
- [x] Confirm no `activate-hub` invocation and no mcp-tooling direct-mirror exception usage.

### Phase 5: Sync, Promotion, Verify, and Probes

- [x] Run `compiled-route-sync.cjs --check` and confirm exit 0 with no writes.
- [x] Run the canonical promotion and capture the retained rollback root.
- [x] Run promoted `--verify` and confirm exit 0.
- [x] Run parity, kill-switch, and representative route/bundle/defer/rollback probes; capture machine-readable receipts.
- [x] On any post-publish failure, run `--revert <rollback>` immediately and stop; never finalize.

### Phase 6: Status, Validation, Metadata, and Closeout

- [x] Run `compiled-route-status.cjs --all` and assert the seven canonical hubs report compiled-serving and fresh.
- [x] Run `--finalize <rollback>` only after every post-publish gate passes.
- [x] Run strict validation on every `020` child and recursive strict validation on `015`.
- [x] Regenerate child, `020`, `015`, and ancestor metadata/continuity through `generate-context.js`.
- [x] Run the canonical metadata and index scan through the worktree-bound complete runtime.
- [x] Inspect the final scoped diff, remove task-created temporary artifacts, and leave commit/merge/push unperformed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Pass Condition |
|-----------|-------|-------|----------------|
| Owner rebuild | Every changed hub | `009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs` | Canonical JSON with `status: built` |
| Seven-canary fleet gate | All seven hubs | Per-hub `validate-canary.cjs` owner | Exit 0 with route-gold, mode, leaf, bundle, fallback rows |
| Adjudication | Authored hashes and route-gold | Adjudication ledger diff | Every expectation write has a prior row |
| Manifest refresh | Graduated manifests only | `compiled-route-manifest.cjs refresh` | Generation/authority/shadow/fencing preserved; freshness 7/7 |
| Sync check | Authored closure | `compiled-route-sync.cjs --check` | Exit 0, no writes |
| Promotion and verify | Promoted closure | `compiled-route-sync.cjs` then `--verify` | Promotion retains rollback; verify exits 0 |
| Probes | Parity, kill-switch, route/bundle/defer/rollback | `compiled-route.cjs`, flag flips, guard | All probes green; fallback restores on switch-off |
| Status | Canonical seven | `compiled-route-status.cjs --all` | 7/7 canonical hubs compiled-serving and fresh |
| Frozen substrate | Replay and scorer trio | `sha256sum` plus Phase 001 pins | Identical before and after every action |
| Spec gates | Every `020` child and `015` | `validate.sh --strict` and `--recursive --strict` | All exit 0 |
| Metadata | Child, `020`, `015`, ancestors | `generate-context.js` | Continuity and derived metadata regenerate |
| Boundary | Worktree changes and staging | Git read-only commands | No staged files; scoped diff clean |

### Objective Commands

Run from the worktree repository root. The execution pass redirects outputs into `scratch/closeout/` inside this child. Exact flags are confirmed against each tool's usage contract at execution time and recorded in the receipts.

#### 1. Preflight and Frozen-Substrate Pins

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
mkdir -p "$CHILD/scratch/closeout"
git status --short | tee "$CHILD/scratch/closeout/git-status-before.txt"
git diff --cached --name-only | tee "$CHILD/scratch/closeout/git-staged-before.txt"
test ! -s "$CHILD/scratch/closeout/git-staged-before.txt"
sha256sum \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/closeout/frozen-substrate-before.txt"
# compare every row to the Phase 001 pinned values in ../001-contract-and-fleet-audit/spec.md
```

#### 2. Owner Rebuild (one command per changed hub)

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
HUB=cli-external-orchestration
ENTRY=004-cli-external-orchestration
node "specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/$ENTRY/harness/build-artifacts.cjs" \
  > "$CHILD/scratch/closeout/rebuild-$HUB.json" 2> "$CHILD/scratch/closeout/rebuild-$HUB.stderr"
grep -q '"status": "built"' "$CHILD/scratch/closeout/rebuild-$HUB.json"
```

#### 3. Seven-Canary Fleet Gate

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
# Fixed canonical hub-to-entry map from the affected-surfaces inventory:
#   cli-external-orchestration 004 | sk-design 006 | sk-prompt 005 |
#   sk-doc 007 | system-deep-loop 002 | sk-code 001 | mcp-tooling 003
# Each canary owner writes $CHILD/scratch/closeout/canary-<hub>.json and must exit 0.
# Exact runner flags are confirmed against each harness usage contract and recorded in the receipts.
```

#### 4. Adjudication Ledger (before any expectation write)

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
# One JSON row per expectation: prior value, migration cause, expected delta, reviewer decision.
# The expectation write command runs only after its adjudication row exists in the ledger.
```

#### 5. Graduated Manifest Refresh and Freshness

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
node .opencode/bin/compiled-route-manifest.cjs refresh \
  > "$CHILD/scratch/closeout/manifest-refresh.txt" 2>&1
node .opencode/bin/compiled-route-manifest.cjs freshness \
  > "$CHILD/scratch/closeout/manifest-freshness.txt" 2>&1
```

#### 6. Sync Check, Promotion, Verify, and Revert

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
node .opencode/bin/compiled-route-sync.cjs --check \
  | tee "$CHILD/scratch/closeout/sync-check.txt"
node .opencode/bin/compiled-route-sync.cjs \
  | tee "$CHILD/scratch/closeout/promote.txt"   # retain the reported rollback root
node .opencode/bin/compiled-route-sync.cjs --verify \
  | tee "$CHILD/scratch/closeout/promoted-verify.txt"
# On any post-publish gate failure:
#   node .opencode/bin/compiled-route-sync.cjs --revert <retained-rollback-root>
# On every post-publish gate passing:
#   node .opencode/bin/compiled-route-sync.cjs --finalize <retained-rollback-root>
```

#### 7. Canonical-Seven Status and Probes

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
node .opencode/bin/compiled-route-status.cjs --all \
  | tee "$CHILD/scratch/closeout/status-all.txt"
node .opencode/bin/compiled-route.cjs --hub cli-external-orchestration --prompt 'how do I call an external cli tool' \
  | tee "$CHILD/scratch/closeout/probe-cli-external-orchestration.json"
```

#### 8. Recursive Strict Validation and Final Boundary Gate

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout'
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$CHILD" --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  specs/sk-doc/019-skill-routing-refactor/015-router-unification-program --recursive --strict
git status --short | tee "$CHILD/scratch/closeout/git-status-after.txt"
git diff --cached --name-only | tee "$CHILD/scratch/closeout/git-staged-after.txt"
test ! -s "$CHILD/scratch/closeout/git-staged-after.txt"
sha256sum \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/closeout/frozen-substrate-after.txt"
diff "$CHILD/scratch/closeout/frozen-substrate-before.txt" "$CHILD/scratch/closeout/frozen-substrate-after.txt"
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 contract, matrix, and pinned digests | Normative | Available | Parity and pins cannot be asserted |
| Phase 003 seven checkpoint receipt sets | Baseline | Available | No frozen adoption baseline to prove against |
| `009-parent-hub-rollout` harness owners | Rebuild/canary | Present | Owner rebuilds and canaries cannot run |
| Graduated activation manifests | Refresh target | Present | Authored freshness cannot be proven |
| `compiled-route-manifest.cjs` / `compiled-route-sync.cjs` / `compiled-route-status.cjs` | Tool chain | Present | Promotion and status cannot run |
| Frozen replay and scorer trio | Protected substrate | Digest-pinned | Any drift invalidates the fleet gate |
| `generate-context.js` and existing primary dependencies | Metadata/index | Available | Canonical child saves completed; final daemon index refresh deferred |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A frozen digest differs, a canary fails, an expectation is written without adjudication, a non-graduated manifest refreshes, `--check` or promoted `--verify` fails, a post-publish probe fails, or any unrelated surface is touched.
- **Procedure**: Stop immediately. Preserve diagnostics in `scratch/closeout/`. For a post-publish failure, run `compiled-route-sync.cjs --revert <retained-rollback>` as the canonical reversal and do not finalize. For pre-publish state, restore via Git in the isolated worktree as one policy-consistent unit covering routers, expectations, manifests, and receipts together. Never restore prose without its matching policy and manifest state, and never touch unrelated pre-existing work. Re-run frozen pins and the affected gate before resuming.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Preflight and frozen pins
          |
          v
Rebuilds and seven-canary gate
          |
          v
Adjudication and expectation updates
          |
          v
Graduated manifest refresh and freshness
          |
          v
Sync, promotion, verify, and probes
          |
          v
Status, validation, metadata, and closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preflight and pins | Plan, parent, Phases 001-003 | Every later phase |
| Rebuilds and canaries | Preflight pins | Adjudication and expectations |
| Adjudication and expectations | Canary gate | Manifest refresh and freshness |
| Manifest refresh and freshness | Adjudicated expectations | Sync check and promotion |
| Sync, promotion, verify, probes | Fresh manifests | Status and closeout |
| Status, validation, metadata, closeout | Post-publish gates | Program handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preflight and frozen pins | Low | 1 hour |
| Rebuilds and seven-canary gate | Medium | 2-3 hours |
| Adjudication and expectation updates | Medium | 2-4 hours |
| Manifest refresh and freshness | Medium | 2-3 hours |
| Sync, promotion, verify, and probes | High | 3-5 hours |
| Status, validation, metadata, closeout | Medium | 2-4 hours |
| **Total** | | **12-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [x] No staged files.
- [x] Frozen-substrate pins recorded against the Phase 001 values.
- [x] Graduated manifest inventory captured.
- [x] Canonical hub-to-entry map confirmed.
- [x] Receipt root resolves inside this child.

### Rollback Procedure

1. Stop the failing stage and capture command, exit code, stderr, and affected paths.
2. Compare affected paths to the eligibility table and the initial status snapshot.
3. For post-publish failure, run `--revert <rollback>` and keep the closure until finalize conditions hold.
4. For pre-publish state, restore the full policy-consistent unit from Git; never partially revert expectations, manifests, and routers.
5. Re-run frozen pins, canaries, and the affected gate before resuming.

### Data Reversal

- **Has data migrations?** Compiled serving and graduated manifests, reversible only through the retained rollback closure and the canonical `--revert` path.
- **Reversal procedure**: Git restoration of the worktree for authored state plus `compiled-route-sync.cjs --revert <rollback>` for the promoted closure. Frozen files, historical artifacts, and unrelated surfaces are never eligible for reversal because they are never eligible for mutation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌──────────────────────────┐
│ Phases 001-003 baseline  │
└────────────┬─────────────┘
             v
┌──────────────────────────┐
│ preflight + frozen pins  │
└────────────┬─────────────┘
             v
┌──────────────────────────┐
│ owner rebuilds + 7 canary│
└────────────┬─────────────┘
             v
┌──────────────────────────┐
│ adjudication -> gold/    │
│ hash expectation writes  │
└────────────┬─────────────┘
             v
┌──────────────────────────┐
│ graduated refresh ->     │
│ freshness 7/7            │
└────────────┬─────────────┘
             v
┌──────────────────────────┐
│ sync --check -> promote  │
│ -> --verify -> probes    │
└─────┬──────────────┬─────┘
      v              v
  pass           fail: --revert
 status 7/7       and stop
 --finalize
      └──────┬─────┘
             v
┌──────────────────────────┐
│ recursive strict ->      │
│ generate-context -> diff │
└──────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Remediation guard | Eligibility table | Denied out-of-scope repairs | Every repair |
| Owner rebuilder | Preflight pins, hub inputs | Canonical build receipts | Canary gate |
| Canary runner | Rebuilt artifacts | Fleet-gate receipts | Adjudication |
| Adjudication ledger | Canary rows | Expectation-write authority | Gold and hash updates |
| Graduated refresher | Adjudicated expectations | Fresh graduated manifests | Sync check |
| Sync promoter | Fresh manifests | Promoted closure and rollback | Verify and probes |
| Status asserter | Post-publish gates | Canonical 7/7 row | Finalize |
| Validation finisher | Status and pins | Recursive strict, metadata, diff | Program handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Preflight and frozen pins** - 1 hour - CRITICAL.
2. **Rebuilds and seven-canary gate** - 2-3 hours - CRITICAL.
3. **Adjudication and expectation updates** - 2-4 hours - CRITICAL.
4. **Manifest refresh and freshness** - 2-3 hours - CRITICAL.
5. **Sync, promotion, verify, and probes** - 3-5 hours - CRITICAL.
6. **Status, validation, metadata, closeout** - 2-4 hours - CRITICAL.

**Total Critical Path**: 12-20 hours.

**Parallel Opportunities**: Probe definitions and the graduated manifest inventory can be drafted once the canonical hub-to-entry map is fixed; expectation inventories can be prepared while canaries run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline safe | No staged files, pins match, receipts present, entry map fixed | Phase 1 |
| M2 | Fleet proven | Owner rebuilds canonical; seven canaries green; gold adjudicated | Phases 2-3 |
| M3 | Fleet fresh | Graduated manifests refreshed; freshness 7/7 | Phase 4 |
| M4 | Fleet promoted | Check, promote, verify, and probes green; rollback retained | Phase 5 |
| M5 | Closeout ready | Status 7/7, rollback finalized, recursive strict exit 0, metadata regenerated, diff clean | Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

Phase 004 executes within the named compiled-routing surfaces plus this child folder.

### Pre-Task Checklist

- [x] Re-read the approved plan, `../spec.md`, and Phases 001-003 specs.
- [x] Confirm task ID, expected receipts, and the eligibility-table write boundary.
- [x] Confirm frozen-substrate pins.
- [x] Confirm the next change is inside an eligible surface or this child.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in numeric order; phases in plan order. |
| TASK-SCOPE | Write only eligible routing surfaces plus this child folder. |
| TASK-EVIDENCE | Record command, timestamp, exit code, stdout, stderr, and interpretation. |
| TASK-ADJUDICATE | Never update an authored hash or route-gold expectation without a prior adjudication row. |
| TASK-GRADUATED | Refresh only existing graduated manifests; never `activate-hub`; never the direct-mirror exception. |
| TASK-BYTES | Never rewrite frozen replay, scorers, or their digests. |
| TASK-FAIL-CLOSED | Stop on pin drift, canary failure, unadjudicated write, non-graduated refresh, verify failure, or probe failure. |
| TASK-REVERT | On post-publish failure, run `--revert <rollback>` and stop; finalize only after every gate passes. |
| TASK-NO-CLAIM | Never claim commit, merge, or push without operator action. |

### Status Reporting Format

Use `TASK=<id> STATUS=PASS|FAIL|BLOCKED RECEIPT=<child-relative-path> EXIT=<code> NOTE=<short-fact>`. A phase report stays `STATUS=DRAFT` until every P0 handoff item has receipt evidence.

### Blocked Task Protocol

If a pin, canary, freshness, adjudication, graduated-manifest, promotion, or status expectation differs from this plan, stop the affected lane, preserve the mismatch receipt, mark the task blocked, and request LOGIC-SYNC. If 7/7 requires an unrelated advisor feature, command behavior, packet redesign, or product change, halt with LOGIC-SYNC instead of widening scope. Do not weaken a gate, update a pin, or edit a protected file to make a check pass.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

Phase 004 treats the Phase 001 contract and Phase 003 receipts as the frozen baseline, the compiled-routing tool chain as the only mutation surface, and the canonical-seven status as the only completion trigger. Every operation is either a read-only proof, an owner-tool regeneration, a graduated refresh, or a canonical promotion step with a retained rollback. Nothing in the phase rewrites frozen policy bytes, refreshes non-graduated manifests, or widens into unrelated behavior.
<!-- /ANCHOR:architecture-overview -->

---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation | Verification |
|------|------------|--------------|
| Scope widening | Eligibility table before any repair | Denial receipt for ineligible repairs |
| Unadjudicated gold writes | Adjudication ledger first | Ledger diff precedes every write |
| Frozen digest drift | Pins before and after every action | Diff empty against the Phase 001 values |
| Non-graduated refresh | Graduated-only rule | Before/after manifest inventory diff |
| Broken promotion | Retained rollback and revert | `--revert` fires on any post-publish failure |
| Premature finalize | Late `--finalize` gate | Finalize only after all post-publish gates |
| False 7/7 green | Canonical-only assertion | Temporary fixtures excluded explicitly |
| Stale metadata | `generate-context.js` regeneration | Continuity refreshed; final daemon index freshness deferred |
<!-- /ANCHOR:risk-mitigation -->

---

## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Ratified Outcome |
|-----|----------|---------------|
| ADR-001 | Bounded routing-only remediation with LOGIC-SYNC stop | Proposed |
| ADR-002 | Owner-harness rebuilds before any fleet gate | Proposed |
| ADR-003 | Seven-canary gate before any expectation change | Proposed |
| ADR-004 | Adjudication before authored-hash or route-gold writes | Proposed |
| ADR-005 | Graduated manifest refresh; no `activate-hub` or direct-mirror exception | Proposed |
| ADR-006 | Sync check, promotion, verify, revert, late finalize | Proposed |
| ADR-007 | Canonical-seven status is the only completion trigger | Proposed |
| ADR-008 | Canonical metadata and continuity regeneration with explicit index disposition | Accepted |

See `decision-record.md` for full context, alternatives, consequences, and rollback.
