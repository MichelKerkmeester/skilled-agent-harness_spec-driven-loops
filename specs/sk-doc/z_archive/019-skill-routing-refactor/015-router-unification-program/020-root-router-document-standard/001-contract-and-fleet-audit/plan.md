---
title: "Implementation Plan: Contract and Fleet Audit"
description: "Execute a serial, read-only audit that ratifies the two-state root-router contract and captures seven-hub machine, default, route, canary, manifest, status, old-path, and protected-digest receipts before any live migration."
trigger_phrases:
  - "contract and fleet audit plan"
  - "root router baseline commands"
  - "seven hub baseline receipts"
  - "frozen scorer digest gate"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/001-contract-and-fleet-audit"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the serial read-only Phase 001 audit plan end to end."
    next_safe_action: "Hand the ratified baseline and receipts to phase 002."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Contract and Fleet Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Bash, Node.js CommonJS |
| **Framework** | system-spec-kit Level 3 packet; class-H two-stage routing contracts |
| **Storage** | Child-local `scratch/baseline/` receipts plus authored packet docs |
| **Testing** | SHA-256 byte checks, JSON parsing, router replay loading, canary validators, manifest freshness, status probes, strict spec validation, scoped Git diff |
| **Mutation Policy** | No live hub edits; writes remain inside this child folder |

### Overview

The audit runs in five serial phases: lock the worktree and hash definitions, freeze the normative schema and authority hierarchy, capture seven per-hub baselines, classify old-path and protected surfaces, then run the no-live-edit handoff. Every operational claim comes from a machine-readable command receipt with a timestamp and exit code. The plan records current authoring snapshots, but Phase 001 is not ratified until execution reproduces them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Approved plan and `../spec.md` have been reread from the active worktree context.
- [x] Worktree path, repository root, child path, and writable receipt path resolve without traversal.
- [x] `git diff --cached --name-only` is empty.
- [x] Initial scoped status and full changed-path inventory are captured.
- [x] Seven-hub order and canonical source roots match `spec.md` REQ-003.
- [x] Machine-fence byte boundaries and SHA-256 algorithm are ratified before hashing.
- [x] Frozen trio actual digests match all pinned constants.

### Definition of Done for the Phase 001 Handoff

- [x] Two-state schema and source-of-truth hierarchy are ratified in `decision-record.md`.
- [x] Seven hubs have complete baseline rows and raw receipts.
- [x] All seven target states remain `active`.
- [x] Stage-one and stage-two default decisions are independently recorded.
- [x] Every old-path occurrence is classified with owner and action.
- [x] sk-code's one-resource expected delta is explicitly approved.
- [x] Frozen trio hashes match before and after capture.
- [x] Strict child validation exits 0.
- [x] Final Git evidence shows no staged files and no changes outside this child folder.
- [x] Lifecycle is Complete; delivery and handoff evidence are recorded in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only evidence pipeline with deterministic serialization, explicit authority layers, content-addressed receipts, and a hard write-boundary gate.

### Key Components

- **Normative Contract**: `spec.md` and `decision-record.md` define states, authorities, defaults, exceptions, and failure behavior.
- **Fleet Enumerator**: one fixed seven-hub array prevents accidental fixture or temporary-hub inclusion.
- **Router Extractor**: calls the frozen `loadSurfaceRouter()` for source path, map counts, and stage-two defaults, while separately parsing `hub-router.json` for stage-one defaults.
- **Machine-Fence Hasher**: extracts the first Python fence after the machine-readable heading and hashes only its inner UTF-8 bytes.
- **Old-Path Ledger**: records every match with class, owner, action, and immutable/protected disposition.
- **Canary Runner**: invokes each `009-parent-hub-rollout` canary owner and retains stdout, stderr, and exit code.
- **Manifest and Status Probe**: reads authored manifest freshness and promoted serving status without minting, refreshing, building, or publishing.
- **Boundary Guard**: compares initial and final Git status and rejects any changed path outside this child folder.

### Data Flow

```text
Approved plan + parent spec
          |
          v
Ratified schema and authority hierarchy
          |
          v
Fixed seven-hub list -> source/default/hash receipts -> canary/manifest/status receipts
          |                                      |
          +------------> old-path ledger <-------+
                              |
                              v
                 protected-digest recheck
                              |
                              v
            strict validation + no-live-edit gate
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Phase 001 Action | Verification |
|---------|--------------|------------------|--------------|
| Seven live hub roots | Read-only authored routing sources | Inventory only | Git boundary guard shows zero hub changes |
| Six legacy smart routers | Current stage-two policy | Hash and classify only | Machine hash and `loadSurfaceRouter()` receipt |
| mcp-tooling root `ROUTER.md` | Root-router pilot | Hash and treat as golden current location | Source precedence and hash receipt |
| Seven `hub-router.json` files | Stage-one policy and defaults | Read and freeze defaults | JSON parse and exact array capture |
| Seven `mode-registry.json` files | Mode and packet authority | Read and inventory | Parse success and mode identity receipt |
| Seven `leaf-manifest.json` files | Typed leaf identity | Read and validate membership | Existing leaf-resource contract and freshness checks |
| Seven canary owners | Route, policy, rollback, and protected-hash baseline | Execute read-only validators | Exit 0 plus JSON `status`/`stageGate` capture |
| Seven activation manifests | Authored compiled eligibility | Freshness read only | `compiled-route-manifest.cjs freshness` |
| Promoted runtime closure | Serving status baseline | Probe only | `compiled-route-status.cjs --all --pretty` |
| Frozen scorer trio | Protected evaluation substrate | Hash before and after; never edit | Pinned digest equality |
| Changelogs and benchmark reports | Immutable history | Classify and exclude from edits | Old-path ledger class `immutable-history` |
| This child folder | Phase 001 authored docs and receipts | Only writable surface | Final changed-path prefix assertion |

Required inventories:

- Same-class source inventory: every root or legacy router candidate for the fixed seven hubs.
- Consumer inventory: live defaults, pointers, docs, tests, playbooks, generated/current evidence, frozen replay fallbacks, and immutable history that mention either legacy path.
- Matrix axes: hub, source location, target state, stage-one default, stage-two default, intent keys, resource keys, machine hash, manifest state, canary state, promoted state, history class.
- Algorithm invariant: identical source bytes and identical extraction boundaries yield identical hashes; a one-byte machine-fence change changes the hash.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Byte Contract

- [x] Resolve repository, child, and receipt paths.
- [x] Capture initial `git status --short`, `git diff --name-only`, and staged-file inventory.
- [x] Freeze the seven-hub array and canary owner map.
- [x] Ratify the machine-fence extraction boundary.
- [x] Verify the frozen trio before any other baseline command.

### Phase 2: Contract Ratification

- [x] Review the `active` positive and negative shape.
- [x] Review the `stage1-only` positive and negative shape.
- [x] Ratify source-of-truth hierarchy and advisor exclusions.
- [x] Ratify default-resource disposition and sk-code exception.
- [x] Record proposed ADR outcomes without changing lifecycle to complete.

### Phase 3: Seven-Hub Baseline Capture

- [x] Run source/default/map-count/hash inventory for all seven hubs.
- [x] Run per-hub router load and route receipt capture.
- [x] Run all seven canary owners serially.
- [x] Run authored manifest freshness for each hub.
- [x] Run promoted status for all canonical hubs.
- [x] Record effective policy hash, manifest fingerprint, canary status, and command exit per row.

### Phase 4: Classification and Adjudication

- [x] Inventory every old-path occurrence from current source roots and relevant specs.
- [x] Assign live contract, generated/current evidence, or immutable history.
- [x] Mark frozen replay fallbacks as protected live compatibility exceptions.
- [x] Confirm every live match has a later-phase owner.
- [x] Freeze expected old/new machine-hash comparison rules and sk-code's one-resource delta.

### Phase 5: Verification and Handoff

- [x] Re-run frozen trio digest equality.
- [x] Verify receipt JSON parses and contains seven unique canonical hubs.
- [x] Verify no live source mtime or Git path changed from Phase 001 activity.
- [x] Run unresolved-token scan and Level-3 anchor checks.
- [x] Run strict child validation.
- [x] Run final scoped diff, no-staged-files check, and no-live-edit prefix assertion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Pass Condition |
|-----------|-------|-------|----------------|
| Structural | Six Level-3 docs and two metadata files | `validate.sh --strict`, anchor grep | Exit 0; required files and anchors present |
| Determinism | Machine-fence extraction and SHA-256 | Node.js `crypto` | Repeated run yields identical seven hashes |
| Protected bytes | Frozen scorer trio | `sha256sum`, compiled parity digest assertion | Three actual values equal pins before and after |
| Source precedence | Root, shared legacy, references legacy | Frozen `loadSurfaceRouter()` | Exactly one source selected per hub; mcp-tooling resolves root first |
| Defaults | Stage-one and stage-two fallback arrays | JSON parse plus frozen replay loader | Values match the frozen matrix |
| Resource identity | Active map resources | leaf-resource contract, explicit shared-control allowlist, and manifest freshness | Packet leaves are typed; contained shared controls resolve and remain non-leaf |
| Canary | Seven rollout owners | `validate-canary.cjs` | Exit and JSON status captured factually for every hub |
| Manifest | Seven authored manifests | `compiled-route-manifest.cjs freshness` | Valid/fresh result captured; no refresh verb used |
| Promoted state | Canonical fleet only | `compiled-route-status.cjs --all --pretty` | Seven canonical rows captured with cause and effective hash |
| Classification | All old-path matches | `rg`, JSON/Markdown ledger review | Zero unclassified matches |
| Boundary | Worktree changes and staging | Git read-only commands | No staged files; all changed paths start with child prefix |

### Objective Baseline Commands

Run from the worktree repository root. Redirect outputs only into `scratch/baseline/` inside this child when Phase 001 executes.

#### 1. Preflight and Scope Snapshot

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/001-contract-and-fleet-audit'
mkdir -p "$CHILD/scratch/baseline"
printf 'captured_at=%s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee "$CHILD/scratch/baseline/capture-time.txt"
git status --short | tee "$CHILD/scratch/baseline/git-status-before.txt"
git diff --name-only | tee "$CHILD/scratch/baseline/git-diff-before.txt"
git diff --cached --name-only | tee "$CHILD/scratch/baseline/git-staged-before.txt"
test ! -s "$CHILD/scratch/baseline/git-staged-before.txt"
```

#### 2. Seven-Hub Source, Default, Count, and Machine-Hash Receipt

```bash
node <<'NODE' | tee "$CHILD/scratch/baseline/router-fleet.json"
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const replay = require('./.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs');
const hubs = [
  'cli-external-orchestration', 'sk-design', 'sk-prompt', 'sk-doc',
  'system-deep-loop', 'sk-code', 'mcp-tooling',
];
const records = hubs.map((hub) => {
  const root = path.resolve('.opencode/skills', hub);
  const surface = replay.loadSurfaceRouter(root);
  if (!surface) throw new Error(`${hub}: no stage-two router`);
  const source = path.join(root, surface.sourceRel);
  const text = fs.readFileSync(source, 'utf8');
  const marker = text.search(/^## .*MACHINE-READABLE ROUTER/m);
  if (marker < 0) throw new Error(`${hub}: machine heading missing`);
  const match = text.slice(marker).match(/```python\n([\s\S]*?)\n```/);
  if (!match) throw new Error(`${hub}: machine fence missing`);
  const hubRouter = JSON.parse(fs.readFileSync(path.join(root, 'hub-router.json'), 'utf8'));
  return {
    hub,
    targetRouterState: 'active',
    sourceRel: surface.sourceRel,
    intentCount: Object.keys(surface.intentSignals).length,
    mapKeyCount: Object.keys(surface.resourceMap).length,
    stageOneDefaultResource: hubRouter.routerPolicy.defaultResource,
    stageTwoDefaultResource: surface.defaultResource,
    machineFenceBytes: Buffer.byteLength(match[1], 'utf8'),
    machineFenceSha256: crypto.createHash('sha256').update(match[1], 'utf8').digest('hex'),
  };
});
if (records.length !== 7 || new Set(records.map((row) => row.hub)).size !== 7) {
  throw new Error('canonical hub cardinality mismatch');
}
process.stdout.write(`${JSON.stringify({ schemaVersion: 1, records }, null, 2)}\n`);
NODE
```

#### 3. Frozen Scorer Digest Gate

```bash
sha256sum \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/baseline/frozen-scorer-sha256.txt"
node -e "const p=require('./.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs'); const r=p.assertFrozenScorerDigests(); console.log(JSON.stringify(r,null,2)); if(!r.ok) process.exit(1)" \
  | tee "$CHILD/scratch/baseline/frozen-scorer-pin-check.json"
```

#### 4. Serial Canary Capture

```bash
set -euo pipefail
BASE='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout'
: > "$CHILD/scratch/baseline/canary-exits.tsv"
for entry in \
  '001-sk-code' \
  '002-system-deep-loop' \
  '003-mcp-tooling' \
  '004-cli-external-orchestration' \
  '005-sk-prompt' \
  '006-sk-design' \
  '007-sk-doc'
do
  hub="${entry#*-}"
  set +e
  node "$BASE/$entry/harness/validate-canary.cjs" \
    > "$CHILD/scratch/baseline/canary-$hub.json" \
    2> "$CHILD/scratch/baseline/canary-$hub.stderr"
  code=$?
  set -e
  printf '%s\t%s\n' "$hub" "$code" >> "$CHILD/scratch/baseline/canary-exits.tsv"
done
```

Each canary exit is captured before continuing. A non-zero exit remains a factual failure and is never converted to success.

#### 5. Authored Manifest Freshness and Promoted Status

```bash
set -euo pipefail
: > "$CHILD/scratch/baseline/manifest-freshness.jsonl"
: > "$CHILD/scratch/baseline/manifest-freshness-exits.tsv"
for hub in cli-external-orchestration sk-design sk-prompt sk-doc system-deep-loop sk-code mcp-tooling
do
  set +e
  node .opencode/bin/compiled-route-manifest.cjs freshness \
    --hub "$hub" --skill-root ".opencode/skills/$hub" \
    >> "$CHILD/scratch/baseline/manifest-freshness.jsonl"
  code=$?
  set -e
  printf '%s\t%s\n' "$hub" "$code" >> "$CHILD/scratch/baseline/manifest-freshness-exits.tsv"
done
node .opencode/bin/compiled-route-status.cjs --all --pretty \
  > "$CHILD/scratch/baseline/compiled-route-status-all.json"
set +e
node .opencode/bin/compiled-route-sync.cjs --check \
  > "$CHILD/scratch/baseline/compiled-route-sync-check.txt" \
  2> "$CHILD/scratch/baseline/compiled-route-sync-check.stderr"
printf '%s\n' "$?" > "$CHILD/scratch/baseline/compiled-route-sync-check.exit"
set -e
```

Phase 001 may run only the `freshness`, `--all`, and `--check` read paths. It must not run manifest `mint` or `refresh`, build artifacts, sync publication, promotion, or revert.

#### 6. Old-Path Inventory

```bash
rg -n --hidden --no-ignore-vcs \
  'shared/references/smart-routing\.md|references/smart-routing\.md' \
  .opencode/skills .opencode/commands specs/sk-doc/019-skill-routing-refactor/015-router-unification-program \
  > "$CHILD/scratch/baseline/old-path-occurrences.txt"
```

Convert every output row into the classification ledger. Do not use grep exclusions until after the full inventory is classified.

#### 7. Final No-Live-Edit Gate

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/001-contract-and-fleet-audit'
git status --short | tee "$CHILD/scratch/baseline/git-status-after.txt"
git diff --cached --name-only | tee "$CHILD/scratch/baseline/git-staged-after.txt"
test ! -s "$CHILD/scratch/baseline/git-staged-after.txt"
if git status --porcelain=v1 | sed -E 's/^.. //' | grep -Ev "^${CHILD}(/|$)" > "$CHILD/scratch/baseline/out-of-scope-paths.txt"; then
  echo 'Phase 001 boundary violation' >&2
  exit 1
fi
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$CHILD" --strict
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Approved plan and `020` parent | Normative | Available | Stop on semantic conflict |
| Isolated 010 worktree | Workspace | Available | Do not execute implementation writes from the primary checkout |
| Frozen router replay loader | Read-only runtime | Available and digest-pinned | Source precedence and map baseline cannot be trusted if drifted |
| Seven rollout canary owners | Read-only tests | Present | Missing owner blocks complete fleet receipt set |
| Compiled route manifest/status CLIs | Read-only observability | Present | Manifest or promoted state remains unproven |
| Seven hub leaf manifests | Authored identity | Present | Active map typed membership cannot be frozen |
| Git index and worktree status | Boundary evidence | Available | No-live-edit gate cannot be proven without it |
| Phase 002 contract consumer | Downstream | Planned | Stable failure codes and fixtures wait for ratified Phase 001 decisions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any command writes outside this child, a live hub path appears in the diff, a frozen digest differs, a receipt is generated from the wrong worktree, or a baseline command mutates a manifest or compiled closure.
- **Procedure**: Stop immediately; preserve diagnostic stdout/stderr inside `scratch/baseline/`; restore only task-created out-of-scope changes using the verified preflight diff as the reference; delete invalid receipts; re-run preflight, digest pins, and the affected baseline command. Never restore or rewrite unrelated pre-existing work.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup and byte contract
          |
          v
Contract ratification
          |
          v
Seven-hub capture
          |
          v
Classification and adjudication
          |
          v
Verification and handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and byte contract | Approved plan, parent spec, isolated worktree | All later audit work |
| Contract ratification | Setup and frozen pins | Fleet field interpretation |
| Seven-hub capture | Ratified field definitions | Classification and handoff |
| Classification | Complete raw inventory and hub receipts | Live-residue ownership and default decisions |
| Verification | All receipts and classifications | Phase 002 start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and byte contract | Medium | 1-2 hours |
| Contract ratification | High | 2-3 hours |
| Seven-hub capture | High | 3-5 hours |
| Classification and adjudication | High | 2-4 hours |
| Verification and handoff | Medium | 1-2 hours |
| **Total** | | **9-16 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [x] Initial changed paths recorded.
- [x] No staged files present.
- [x] Frozen scorer pins pass.
- [x] Receipt root resolves inside this child.
- [x] No write verbs appear in manifest, sync, build, promotion, or Git commands.

### Rollback Procedure

1. Stop the failing command sequence.
2. Capture the command, exit code, stderr, and affected paths inside the child receipt root.
3. Compare affected paths to the initial status snapshot.
4. Restore only new task-created out-of-scope changes; do not touch unrelated pre-existing paths.
5. Re-run frozen hashes and the no-live-edit prefix assertion.
6. Resume only after the baseline is again read-only and reproducible.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Delete invalid child-local receipts and regenerate them from unchanged source bytes. No live manifest, runtime closure, hub policy, or historical artifact is eligible for Phase 001 reversal because none is eligible for Phase 001 mutation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌─────────────────────┐
│ Plan + Parent Spec  │
└──────────┬──────────┘
           v
┌─────────────────────┐     ┌─────────────────────┐
│ Two-State Contract  │────►│ Baseline Schema     │
└─────────────────────┘     └──────────┬──────────┘
┌─────────────────────┐                │
│ Frozen Digest Pins  │────────────────┤
└─────────────────────┘                v
                            ┌─────────────────────┐
                            │ Seven Hub Receipts  │
                            └──────────┬──────────┘
                                       v
                            ┌─────────────────────┐
                            │ Classification      │
                            └──────────┬──────────┘
                                       v
                            ┌─────────────────────┐
                            │ No-Live-Edit Gate   │
                            └─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Two-state contract | Plan and parent | Validator-ready rules | Phase 002 implementation |
| Baseline schema | Contract fields | Stable receipt shape | Per-hub capture |
| Router extractor | Frozen replay bytes | Source, counts, stage-two defaults | Hash and source ledger |
| Hub JSON reader | Seven hub roots | Stage-one defaults | Default decision matrix |
| Canary runners | Existing rollout owners | Route/effective-policy/rollback receipts | Fleet adjudication |
| Manifest/status probes | Authored and promoted closures | Freshness and serving baseline | Phase 004 comparison |
| Classification ledger | Full old-path inventory | Owner/action matrix | Phase 002/003 scopes |
| Boundary guard | Preflight status | Clean handoff proof | Phase 002 start |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Preflight and frozen pins** - 1-2 hours - CRITICAL.
2. **Ratify state and authority contract** - 2-3 hours - CRITICAL.
3. **Capture seven serial hub baselines** - 3-5 hours - CRITICAL.
4. **Classify all old-path matches and exceptions** - 2-4 hours - CRITICAL.
5. **Strict validation and no-live-edit handoff** - 1-2 hours - CRITICAL.

**Total Critical Path**: 9-16 hours.

**Parallel Opportunities**:

- None for hub mutation or handoff. Phase 001 deliberately serializes fleet capture so command failures and worktree drift remain attributable.
- After one immutable raw old-path inventory exists, classification review can be grouped by class, but the final ledger is reconciled serially against all seven hub rows.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline safe to read | Correct worktree, empty stage, fixed hub list, frozen pins pass | Phase 1 |
| M2 | Contract ratified | Two states, hierarchy, defaults, sk-code exception, hash rule approved | Phase 2 |
| M3 | Fleet captured | Seven complete hub rows, canary receipts, manifest and promoted status | Phase 3 |
| M4 | Residue adjudicated | Every old-path occurrence classified with owner/action | Phase 4 |
| M5 | Handoff ready | Strict validation passes; frozen pins unchanged; no live edits | Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

Phase 001 executes directly within this child boundary. Generated prose, inferred green status, or a successful router parse is never sufficient evidence without the named command receipt.

### Pre-Task Checklist

- [x] Re-read the approved plan and `../spec.md`.
- [x] Confirm the task ID, expected receipt, source paths, and write boundary.
- [x] Confirm frozen scorer pins still pass.
- [x] Confirm the next command is read-only outside this child.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in numeric order and hubs in the fixed order recorded in `tasks.md`. |
| TASK-SCOPE | Write only authored docs and receipts inside this child folder. |
| TASK-EVIDENCE | Record command, timestamp, exit code, stdout path, stderr path, and interpretation. |
| TASK-HASH | Never normalize source bytes before hashing. |
| TASK-FAIL-CLOSED | Stop on missing source, parse error, unknown hub, cardinality drift, digest mismatch, or out-of-scope path. |
| TASK-NO-PROMOTION | Never mint, refresh, build, publish, promote, activate, revert, or finalize a compiled route in Phase 001. |

### Status Reporting Format

Use `TASK=<id> STATUS=PASS|FAIL|BLOCKED RECEIPT=<child-relative-path> EXIT=<code> NOTE=<short-fact>`. A phase report uses `STATUS=DRAFT` until every P0 handoff item has receipt evidence and approval. Phase 001 execution completed 2026-08-15/16 with `STATUS=COMPLETE`; the phase report and receipts are in `checklist.md`, `tasks.md`, and `implementation-summary.md`.

### Blocked Task Protocol

If a frozen digest, hub count, source precedence, default value, canary owner, manifest path, promoted-status row, or write boundary differs from this plan, stop the affected lane. Preserve the mismatch receipt, mark the task blocked, and request LOGIC-SYNC. Do not update expected hashes, reinterpret a hub as non-canonical, or edit a live source to make the baseline pass.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

The audit treats authored routing policy, typed identity, compiled projections, and advisor discovery as distinct planes. Stage one resolves public mode identity, stage two resolves leaves, manifests bind leaf paths to typed identities, compiled artifacts project authored policy, and the advisor indexes only root identity documents. Evidence flows downward from authored sources to projections; authority never flows upward from a generated artifact or benchmark report to redefine source policy.
<!-- /ANCHOR:architecture-overview -->

---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation | Verification |
|------|------------|--------------|
| Byte-boundary drift | One machine-fence extractor and recorded byte counts | Repeat hash command twice on unchanged tree |
| Hidden fallback change | Separate stage-one and stage-two default fields | Seven-row default decision matrix |
| Historical churn | Full inventory before exclusions | Zero unclassified rows; immutable paths unchanged |
| sk-code leaf identity leak | Approve one deletion only; never add root router to leaf manifest | Old/new resource-set comparison |
| Frozen scorer drift | Pin before and after every canary batch | `assertFrozenScorerDigests().ok === true` |
| Non-green baseline hidden | Record factual exit/status, not expected green | Raw canary, freshness, and status receipts |
| Out-of-scope mutation | Initial/final path inventories and prefix assertion | Empty out-of-scope receipt and empty staged list |
| Generated artifact edit | Read verbs only in Phase 001 command allowlist | Command review plus Git diff |
<!-- /ANCHOR:risk-mitigation -->

---

## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Ratified Outcome |
|-----|----------|---------------|
| ADR-001 | Exactly two root-router states | Proposed for ratification |
| ADR-002 | Stage one and stage two remain separate authorities | Proposed for ratification |
| ADR-003 | Preserve per-hub defaults with three literal-path repoints | Proposed for ratification |
| ADR-004 | Remove sk-code router self-reference without creating a leaf identity | Proposed for ratification |
| ADR-005 | Classify history and protect the frozen scorer trio | Proposed for ratification |

See `decision-record.md` for full context, alternatives, consequences, and rollback.
