---
title: "Implementation Plan: Seven-Hub Root Adoption"
description: "Execute seven serial root-router checkpoints: mcp-tooling idempotence, four byte-equal moves, bounded sk-prompt and sk-code routing repairs, fallback preservation, owner-tool regeneration, gated legacy deletion, and final live-residue proof."
trigger_phrases:
  - "seven hub adoption plan"
  - "root router checkpoint procedure"
  - "legacy deletion gate plan"
  - "hub migration receipts"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed the serial seven-checkpoint Phase 003 adoption plan end to end."
    next_safe_action: "Hand the seven checkpoint receipts and adjudicated maps to phase 004."
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
# Implementation Plan: Seven-Hub Root Adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter, JSON, Bash, Node.js CommonJS, Python |
| **Framework** | system-spec-kit Level 3 packet; class-H two-stage routing contracts |
| **Storage** | Child-local `scratch/checkpoints/<hub>/` receipts plus authored packet docs |
| **Testing** | root-router validator, parent doctor, package gate, replay/benchmark route-gold, hub canaries, SHA-256 byte checks, link resolution, residue scans, strict spec validation, scoped Git diff |
| **Mutation Policy** | Authoring pass writes only inside this child folder; the execution pass may modify approved live hub surfaces serially |

### Overview

The phase runs seven serial checkpoints in the frozen order CP1 through CP7. Each migration captures a pre-state, moves the stage-two router to root `ROUTER.md`, preserves the machine block byte-for-byte (one approved sk-code delta), rebases links, preserves defaults, regenerates derived metadata through owner tooling, aligns version/changelog additively, runs five gates, and only then deletes the legacy file and rescans live residue. CP1 is the golden/idempotent verification of mcp-tooling. The phase closes when exactly seven root routers are active, zero live legacy files remain, and the 003 to 004 handoff gate passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Approved plan, parent spec, and Phase 001 contract have been reread from the active worktree context.
- [x] Phase 002 validator, doctor, and package fixtures pass their own gate.
- [x] Frozen replay and scorer pins match before the first checkpoint.
- [x] Worktree path, repository root, child path, and receipt paths resolve without traversal.
- [x] `git diff --cached --name-only` is empty and initial scoped status is captured.
- [x] The fixed seven-checkpoint order matches `spec.md` REQ-001.
- [x] Per-hub old/new machine-hash comparison rules and the sk-code delta contract are approved.
- [x] Advisor index rebuild/validation is deferred until hub files are final.

### Definition of Done for the 003 to 004 Handoff

- [x] Exactly seven canonical hubs serve root `ROUTER.md` with `router_state: active`.
- [x] Five migrated hubs show byte-equal machine hashes; sk-code shows exactly one adjudicated delta; mcp-tooling is unchanged.
- [x] All live legacy router files are deleted after their gates pass.
- [x] Every hub has a complete checkpoint receipt set and an adjudicated old/new map delta.
- [x] Per-hub versions and changelogs are additive; historical entries untouched.
- [x] Frozen replay/scorer digests match before and after every checkpoint.
- [x] Live-vs-history residue scan reports zero live matches.
- [x] Strict child validation exits 0.
- [x] Final Git evidence shows no staged files and no changed path outside the child folder or approved hub surfaces.
- [x] Lifecycle is Complete; delivery and handoff evidence are recorded in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Serial checkpoint pipeline: one hub at a time, pre-state capture, byte-preserving move, link/default/version alignment, owner-tool regeneration, five-gate proof, gated legacy deletion, residue rescan, and receipt closure.

### Key Components

- **Checkpoint Enumerator**: one fixed seven-entry array `[mcp-tooling, cli-external-orchestration, sk-design, sk-prompt, sk-doc, system-deep-loop, sk-code]` prevents reordering and accidental hub inclusion.
- **Pre-State Capturer**: reads old map hash, route receipts, `defaultResource`, manifest freshness, and live references into `scratch/checkpoints/<hub>/before/`.
- **Router Mover**: creates root `ROUTER.md` with `router_state: active`, moves four machine blocks verbatim, and applies only the adjudicated sk-prompt/sk-code repairs.
- **Link Rebaser**: rewrites document-relative targets for the root location and asserts every target resolves on disk.
- **Default Preserver**: applies the Phase 001 matrix; only literal legacy entries are repointed.
- **Metadata Regenerator**: runs the hub's owning tool for derived leaf metadata and captures the exact delta.
- **Gate Runner**: executes root-router validator, parent doctor, package gate, replay/benchmark route-gold, and hub canary serially.
- **Legacy Deleter**: deletes the legacy file only after all five gates pass, then rescans live sources.
- **Residue Classifier**: separates live matches from immutable history and protected replay fallbacks.
- **Boundary Guard**: compares initial and final Git status and rejects out-of-scope paths.

### Data Flow

```text
CP1 mcp-tooling golden (idempotent, no changes)
        |
        v
CP2 cli-external-orchestration -> CP3 sk-design -> CP4 sk-prompt
        |
        v
CP5 sk-doc -> CP6 system-deep-loop -> CP7 sk-code (delta, last)
        |
        v
frozen-digest recheck -> residue scan -> strict validation -> handoff gate
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Phase 003 Action | Verification |
|---------|--------------|------------------|--------------|
| mcp-tooling root `ROUTER.md` | Root-router pilot | Golden verify; no edits | Contract conformance, zero changed paths |
| Six legacy `shared/references/smart-routing.md` files | Current stage-two policy | Move to root `ROUTER.md`; delete only after gates | Old/new machine-hash comparison and residue rescan |
| Seven root `ROUTER.md` files | Stage-two authority after adoption | Create/move with `router_state: active` | Root-router validator per hub |
| Seven root `SKILL.md` files | Human two-stage pointer | Update pointer, layout, rules, references, graph paths | Live-doc consistency check |
| Seven `hub-router.json` files | Stage-one authority | Repoint literal legacy defaults only (3 hubs); preserve others | Default matrix comparison |
| Seven `mode-registry.json` files | Stage-one mode authority | No change | Frozen digest or byte comparison |
| Seven `leaf-manifest.json` files | Typed leaf identity | Regenerate through owner tooling; inspect delta | Owner-tool regeneration receipt and delta adjudication |
| Hub READMEs and live source docs | Authoring surface | Update legacy path references | Live residue rescan |
| Hub changelogs | Release history | Add one new entry per hub; never rewrite history | Changelog diff inspection |
| Hub canary owners | Route/policy/rollback health | Run serially per checkpoint | Exit 0 plus JSON status capture |
| Activation manifests | Compiled eligibility | Read-only freshness inspection; no refresh | `compiled-route-manifest.cjs freshness` |
| Frozen replay and scorer trio | Protected substrate | Hash before and after every checkpoint; never edit | Pinned digest equality |
| system-skill-advisor index | Discovery surface | Rebuild/validate only after hub files are final | Post-finalization validation only |
| This child folder | Phase 003 authored docs and receipts | Only writable surface during authoring | Final changed-path prefix assertion |

Required inventories:

- Same-class source inventory: the seven canonical hub roots and the six legacy router files.
- Consumer inventory: live defaults, pointers, docs, tests, playbooks, generated/current evidence, frozen replay fallbacks, and immutable history that mention either legacy path.
- Matrix axes: checkpoint, hub, pre-source, post-source, target state, stage-one default disposition, machine hash before/after, link-rebase count, metadata delta, gate exits, legacy deletion, residue scan result.
- Algorithm invariant: identical source bytes and extraction boundaries yield identical hashes; sk-prompt and sk-code must match their exact recorded delta manifests.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Golden Verification (CP1)

- [x] Re-read approved plan, parent spec, and Phase 001 contract.
- [x] Confirm Phase 002 tooling gates pass.
- [x] Capture frozen replay/scorer pins.
- [x] Run mcp-tooling conformance: root `ROUTER.md` active, 7/7 keys, machine block present, no legacy file.
- [x] Prove CP1 is idempotent: `git status` shows zero changed paths after verification.
- [x] Close CP1 with a golden receipt set.

### Phase 2: CP2 cli-external-orchestration

- [x] Capture old map hash, route receipts, default, manifest state, live references.
- [x] Move to root `ROUTER.md`; preserve machine block byte-for-byte.
- [x] Rebase links for the root location; resolve every target.
- [x] Update root `SKILL.md` pointer and live docs.
- [x] Repoint the literal legacy default entry; keep the registry entry.
- [x] Regenerate derived metadata through owner tooling; inspect delta.
- [x] Add version/changelog entry; keep history untouched.
- [x] Run validator, doctor, package, replay/benchmark, and canary gates.
- [x] Delete the legacy file; rescan live sources.
- [x] Close CP2 with receipts.

### Phase 3: CP3 sk-design and CP4 sk-prompt

- [x] Repeat the CP2 procedure for sk-design (4/4 keys; legacy default repoint).
- [x] Repeat the CP2 procedure for sk-prompt (13/13 keys; stage-one default preserved).
- [x] Close each checkpoint only after its full receipt set.

### Phase 4: CP5 sk-doc and CP6 system-deep-loop

- [x] Repeat the CP2 procedure for sk-doc (14/14 keys; stage-one default preserved).
- [x] Repeat the CP2 procedure for system-deep-loop (7/7 keys; legacy default repoint).
- [x] Close each checkpoint only after its full receipt set.

### Phase 5: CP7 sk-code and Handoff

- [x] Capture sk-code's pre-state including the stage-two `DEFAULT_RESOURCE` set (20/20 keys).
- [x] Move to root `ROUTER.md`; remove the self-reference, normalize ten shared paths, and declare eight mapped shared controls.
- [x] Preserve the stage-one default `shared/README.md`.
- [x] Run the five gates; adjudicate the resource-set delta.
- [x] Delete the legacy file; rescan live sources.
- [x] Re-run frozen replay/scorer pins.
- [x] Run the fleet-wide live-vs-history residue scan; assert zero live matches.
- [x] Run strict child validation.
- [x] Run the final scoped diff, no-staged-files check, and 003 to 004 handoff gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Pass Condition |
|-----------|-------|-------|----------------|
| Structural | Six Level-3 docs and two metadata files | `validate.sh --strict`, anchor grep | Exit 0; required files and anchors present |
| Golden idempotency | mcp-tooling conformance | root-router validator, `git status` | Conformance passes; zero changed paths |
| Machine bytes | Six migrated hubs | Node.js `crypto` over the machine fence | Old/new equality except sk-code's one-delta |
| Link resolution | Every rebased path | On-disk existence check plus validator path gate | All targets resolve |
| Defaults | Stage-one and stage-two fallback arrays | JSON parse plus Phase 001 matrix | Values match the frozen matrix |
| Resource identity | Active map resources | leaf-resource contract, shared-control allowlist, and manifest freshness | Packet leaves are typed; declared contained shared controls resolve and remain non-leaf |
| Gate receipts | Five gates per hub | Validator, doctor, package, replay/benchmark, canary | Exit 0 with child-local receipts |
| Frozen substrate | Replay and scorer trio | `sha256sum` plus pinned digest assertion | Three actual values equal pins after every checkpoint |
| Residue | All live old-path matches | `rg` plus classification ledger | Zero live matches; immutable/protected rows path-explicit |
| Boundary | Worktree changes and staging | Git read-only commands | No staged files; changed paths in approved surfaces only |

### Objective Command Sketches

Run from the worktree repository root. The execution pass redirects outputs into `scratch/checkpoints/<hub>/` inside this child. Command shapes follow the Phase 002 tool contracts; exact flags are confirmed against those tools at execution time and recorded in the receipts.

#### 1. Preflight and Frozen Substrate Pins

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption'
mkdir -p "$CHILD/scratch/pins"
git status --short | tee "$CHILD/scratch/pins/git-status-before.txt"
git diff --cached --name-only | tee "$CHILD/scratch/pins/git-staged-before.txt"
test ! -s "$CHILD/scratch/pins/git-staged-before.txt"
sha256sum \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/pins/frozen-substrate-before.txt"
```

#### 2. Per-Checkpoint Pre-State Capture (CP2-CP7)

```bash
set -euo pipefail
HUB=cli-external-orchestration
CP="specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption/scratch/checkpoints/$HUB"
mkdir -p "$CP/before"
# old machine hash via the frozen loadSurfaceRouter() plus the Phase 001 byte boundary
node -e "..." > "$CP/before/router-before.json"
node .opencode/bin/compiled-route-manifest.cjs freshness --hub "$HUB" --skill-root ".opencode/skills/$HUB" \
  > "$CP/before/manifest-before.jsonl"
rg -n 'shared/references/smart-routing\.md|references/smart-routing\.md' ".opencode/skills/$HUB" \
  > "$CP/before/live-references-before.txt" || true
```

#### 3. Per-Checkpoint Gate Set (after the move)

```bash
set -euo pipefail
HUB=cli-external-orchestration
CP="specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption/scratch/checkpoints/$HUB"
# root router contract validator (Phase 002 library)
node .opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs ".opencode/skills/$HUB" \
  > "$CP/validator.txt" 2>&1
# parent doctor
node .opencode/commands/doctor/scripts/parent-skill-check.cjs ".opencode/skills/$HUB" \
  > "$CP/doctor.txt" 2>&1
# package gate
python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py ".opencode/skills/$HUB" \
  > "$CP/package.txt" 2>&1
# replay/benchmark route-gold and hub canary owner per the 009-parent-hub-rollout harness
node "specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/<entry>/harness/validate-canary.cjs" \
  > "$CP/canary.json" 2> "$CP/canary.stderr"
```

#### 4. Legacy Deletion and Residue Rescan

```bash
set -euo pipefail
HUB=cli-external-orchestration
CP="specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption/scratch/checkpoints/$HUB"
# delete the legacy file only after every gate exit is 0
# then rescan the hub root and resolve or classify every remaining match
rg -n 'shared/references/smart-routing\.md|references/smart-routing\.md' ".opencode/skills/$HUB" \
  > "$CP/after/residue.txt" || true
# every row must be classified immutable-history or protected replay fallback
```

#### 5. Final 003 to 004 Handoff Gate

```bash
set -euo pipefail
CHILD='specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption'
git status --short | tee "$CHILD/scratch/pins/git-status-after.txt"
git diff --cached --name-only | tee "$CHILD/scratch/pins/git-staged-after.txt"
test ! -s "$CHILD/scratch/pins/git-staged-after.txt"
sha256sum \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs \
  .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs \
  | tee "$CHILD/scratch/pins/frozen-substrate-after.txt"
diff "$CHILD/scratch/pins/frozen-substrate-before.txt" "$CHILD/scratch/pins/frozen-substrate-after.txt"
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$CHILD" --strict
```

Checkpoint closing rule: a checkpoint closes only after pre-state capture, migration, machine-hash comparison, link resolution, gate receipts, legacy deletion, and residue rescan are all complete in `scratch/checkpoints/<hub>/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Ratified Phase 001 contract and matrix | Normative | Available | Migration cannot start without frozen decisions |
| Phase 002 validator, doctor, package fixtures | Enforcement | Planned | CP1 cannot close; no hub can be gated |
| Frozen replay loader and scorer trio | Read-only runtime | Available and digest-pinned | Route receipts and canaries cannot be trusted if drifted |
| Seven rollout canary owners | Read-only tests | Present | Missing owner blocks a checkpoint close |
| Owner-tool metadata generators | Regeneration | Present | Derived metadata deltas cannot be proven |
| Compiled route manifest CLI | Read-only freshness | Present | Manifest state cannot be inspected pre/post |
| Seven hub changelogs | Release history | Present | Additive entry requires the current file |
| Git index and worktree | Boundary evidence | Available | Handoff diff cannot be proven without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A machine hash differs from the frozen value (sk-code beyond one delta), a frozen substrate pin differs, a checkpoint closes without all gates, a legacy file is deleted before its gates pass, an out-of-scope path appears in the diff, or a partial restore is attempted.
- **Procedure**: Stop immediately. Preserve diagnostics inside `scratch/checkpoints/<hub>/`. Restore the hub as one policy-consistent unit using Git in the isolated worktree plus the retained compiled-route-sync rollback closure: root `ROUTER.md`, `SKILL.md`/live docs, `hub-router.json` default, derived metadata, changelog entry, and legacy file together. Never restore router prose without its matching policy and manifest state, and never touch unrelated pre-existing work. Re-run frozen pins and the affected checkpoint gates before resuming.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
CP1 mcp-tooling golden
        |
        v
CP2 cli-external-orchestration
        |
        v
CP3 sk-design -> CP4 sk-prompt
        |
        v
CP5 sk-doc -> CP6 system-deep-loop
        |
        v
CP7 sk-code -> residue scan -> handoff
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Golden verification | Phase 002 gates, frozen pins, Phase 001 contract | All migrations |
| CP2 | CP1 close | All later migrations |
| CP3 and CP4 | CP2 close | CP5 |
| CP5 and CP6 | CP3/CP4 closes | CP7 |
| CP7 and handoff | All prior checkpoint closes | Phase 004 start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Golden verification (CP1) | Low | 1 hour |
| Per-hub migration (CP2-CP6) | High | 2-3 hours each |
| sk-code adoption (CP7) | High | 3-4 hours |
| Residue scan and handoff | Medium | 1-2 hours |
| **Total** | | **14-23 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [x] Initial changed paths recorded.
- [x] No staged files present.
- [x] Frozen replay/scorer pins pass.
- [x] Receipt roots resolve inside `scratch/checkpoints/`.
- [x] No build, refresh, promotion, sync-publication, or revert verb runs in Phase 003.

### Rollback Procedure

1. Stop the failing checkpoint sequence.
2. Capture the command, exit code, stderr, and affected paths inside the checkpoint receipt root.
3. Compare affected paths to the initial status snapshot.
4. Restore the whole hub as one Git plus compiled-route-sync unit; do not touch unrelated pre-existing paths.
5. Re-run frozen pins, the affected hub's five gates, and the residue rescan.
6. Resume only after the restored hub is again consistent and gated.

### Data Reversal

- **Has data migrations?** Yes: six legacy router moves, three literal default repoints, one sk-code resource removal, owner-tool metadata regeneration, and six legacy deletions.
- **Reversal procedure**: Each hub's pre-state capture in `scratch/checkpoints/<hub>/before/` plus Git restoration and the retained compiled-route-sync rollback closure reconstruct the pre-migration hub exactly. Historical changelog entries and frozen substrate files are never reversed because they are never changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌─────────────────────┐
│ Phase 001 Contract  │
└──────────┬──────────┘
           v
┌─────────────────────┐     ┌─────────────────────┐
│ Phase 002 Tooling   │────►│ Frozen Substrate    │
└──────────┬──────────┘     └──────────┬──────────┘
           v                           v
┌─────────────────────┐     ┌─────────────────────┐
│ CP1 Golden Verify   │────►│ CP2..CP6 Migrations │
└──────────┬──────────┘     └──────────┬──────────┘
           v                           v
┌─────────────────────┐     ┌─────────────────────┐
│ CP7 sk-code Delta   │────►│ Residue Scan + Gate │
└─────────────────────┘     └──────────┬──────────┘
                                       v
                            ┌─────────────────────┐
                            │ 003 to 004 Handoff  │
                            └─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| CP1 golden | Phase 001/002 gates, pins | Idempotent conformance proof | All migrations |
| CP2-CP6 migrations | Prior checkpoint closes | Root routers, receipts, deletions | Later checkpoints |
| CP7 sk-code | CP6 close | One-delta root router | Residue scan |
| Residue scan | All seven checkpoint closes | Zero-live-legacy proof | Handoff |
| Handoff gate | Residue scan, pins, strict validation | Phase 004 start | Phase 004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Golden verification (CP1)** - 1 hour - CRITICAL.
2. **Six serial hub migrations (CP2-CP7)** - 14-21 hours - CRITICAL.
3. **Legacy deletion and residue rescan per hub** - inside each migration - CRITICAL.
4. **Fleet residue scan and handoff gate** - 1-2 hours - CRITICAL.

**Total Critical Path**: 16-24 hours.

**Parallel Opportunities**:

- None for checkpoint execution. The serial order is deliberate: mcp-tooling proves the target shape, each migration proves the move mechanics, and sk-code's delta runs last so a single adjudicated deviation never contaminates a byte-equal hub.
- Residue classification review may be grouped by class after the first raw inventory exists, but the final ledger is reconciled serially against all seven hubs.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline safe to migrate | Phase 002 gates pass, pins pass, fixed order, clean stage | Pre-CP1 |
| M2 | Pilot golden verified | mcp-tooling conforms idempotently with zero changed paths | CP1 |
| M3 | Five byte-equal migrations closed | CP2-CP6 receipts complete; legacy files deleted | CP2-CP6 |
| M4 | sk-code delta adopted and adjudicated | Exactly one resource removed; gates pass; legacy deleted | CP7 |
| M5 | Handoff ready | Zero live residue, pins unchanged, strict validation exit 0, no staged files | Post-CP7 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

Phase 003 executes directly within the child boundary plus the approved live hub surfaces. Generated prose, inferred green status, or a successful router parse is never sufficient evidence without the named checkpoint receipt.

### Pre-Task Checklist

- [x] Re-read the approved plan, parent spec, Phase 001 contract, and this child's spec/plan/tasks.
- [x] Confirm the checkpoint ID, expected receipt paths, hub source paths, and write boundary.
- [x] Confirm frozen replay/scorer pins still pass.
- [x] Confirm the next operation is the correct serial step and hub.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute checkpoints in the frozen order and the ten per-hub steps in order; never skip a gate. |
| TASK-SCOPE | Write only inside this child folder plus the approved hub surfaces for the active checkpoint. |
| TASK-EVIDENCE | Record command, timestamp, exit code, stdout path, stderr path, and interpretation per gate. |
| TASK-HASH | Never normalize source bytes before hashing; compare old/new machine blocks per hub. |
| TASK-FAIL-CLOSED | Stop on missing source, parse error, unknown hub, hash mismatch, gate failure, out-of-scope path, or premature deletion. |
| TASK-NO-LEGACY | Never delete a legacy file before its hub's five gates pass. |
| TASK-NO-PROMOTION | Never build, refresh, publish, promote, activate, revert, or finalize a compiled route in Phase 003. |
| TASK-NO-ADVISOR | Never edit advisor runtime/scorer code; rebuild/validate the index only after hub files are final. |

### Status Reporting Format

Use `CHECKPOINT=<CPn> HUB=<hub> STATUS=PASS|FAIL|BLOCKED GATES=<validator,doctor,package,replay,canary> RECEIPT=<child-relative-path> EXIT=<code>`. A phase report uses `STATUS=DRAFT` until every P0 handoff item has receipt evidence and approval.

### Blocked Task Protocol

If a machine hash, default value, gate exit, frozen pin, checkpoint order, canary owner, or write boundary differs from this plan, stop the affected lane. Preserve the mismatch receipt, mark the task blocked, and request LOGIC-SYNC. Do not update expected hashes, reinterpret a hub as non-canonical, delete a legacy file early, or edit a live source to make a gate pass.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

Adoption is a location migration, not a policy migration. Stage-one authority stays in `mode-registry.json` plus `hub-router.json`, stage-two leaf selection moves from a nested legacy file to the root control document, typed identity stays in `leaf-manifest.json`, and compiled projections remain derived. The machine block, defaults, versions, and history are the invariants; the root location, links, live docs, and changelog head are the moved surface.
<!-- /ANCHOR:architecture-overview -->

---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Mitigation | Verification |
|------|------------|--------------|
| Machine-byte drift | Byte-boundary comparison per hub | Old/new hash receipts and recorded byte counts |
| Dangling rebased links | Resolve every target on disk | Validator path gate plus link-resolution receipt |
| Default fallback drift | Repoint only literal legacy entries | Phase 001 matrix comparison |
| Premature deletion | Gated deletion after all five gates | Legacy-deletion receipt ordered after gate exits |
| History churn | Classify before acting; path-explicit exclusions | Zero live residue; immutable rows unchanged |
| sk-code boundary leak | One-resource delta contract | Resource-set before/after comparison |
| Intermediate-state index | Defer index work until files final | Post-finalization validation only |
| Partial restore | Whole-hub restore unit | Rollback receipt and re-run of all gates |
<!-- /ANCHOR:risk-mitigation -->

---

## L3: ARCHITECTURE DECISION SUMMARY

| ADR | Decision | Ratified Outcome |
|-----|----------|---------------|
| ADR-001 | Fixed serial checkpoint order with mcp-tooling golden first and sk-code last | Proposed for ratification |
| ADR-002 | Machine-block byte preservation with one sk-code delta | Proposed for ratification |
| ADR-003 | Link rebasing and provenance for the root location | Proposed for ratification |
| ADR-004 | Literal-legacy default repoints only | Proposed for ratification |
| ADR-005 | Gated legacy deletion | Proposed for ratification |
| ADR-006 | Additive versions and changelogs | Proposed for ratification |
| ADR-007 | Owner-tool metadata regeneration | Proposed for ratification |
| ADR-008 | Live-vs-history residue classification | Proposed for ratification |
| ADR-009 | Whole-hub rollback via Git plus the retained closure | Proposed for ratification |

See `decision-record.md` for full context, alternatives, consequences, and rollback.
