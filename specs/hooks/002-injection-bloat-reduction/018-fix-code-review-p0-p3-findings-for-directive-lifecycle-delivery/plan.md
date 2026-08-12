---
title: "Implementation Plan: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery"
description: "Implement a host-wired lifecycle epoch, transcript high-water tracking, fail-open identity and stat handling, a no-follow file store, evidence taxonomy, adapter parity, append-only benchmark provenance, and phase reconciliation. Verification starts with a durable whole-gate baseline and ends by rerunning the identical manifest."
status: "in_progress"
completion_pct: 95
trigger_phrases:
  - "directive lifecycle remediation plan"
  - "host lifecycle epoch"
  - "file directive lifecycle store hardening"
  - "scenario 457 proof matrix"
importance_tier: "high"
contextType: "plan"
parent: "../spec.md"
predecessor: "017-adapter-live-delivery-verification"
successor: "None"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
    last_updated_at: "2026-08-11T19:57:46Z"
    last_updated_by: "codex"
    recent_action: "Completed the runtime remediation, focused proof, and identical whole-gate comparison"
    next_safe_action: "Run fresh deep review, then regenerate metadata and execute final strict validation"
    blockers:
      - "Fresh post-implementation review and final metadata reconciliation remain"
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks"
      - ".opencode/skills/system-spec-kit/benchmark/reports"
    session_dedup:
      fingerprint: "sha256:2e6af976023d9528cafe76e7ee70333323a28c9da9428d594850ce5ba7f07c25"
      session_id: "2026-08-11-directive-lifecycle-review-planning"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Option A is selected; always-full remains the immediate rollback"
---
# Implementation Plan: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Node.js ESM for the canonical hooks; plain JavaScript ESM for the OpenCode plugin mirror; one Devin CJS lifecycle adapter |
| **Framework** | OpenCode plugin hooks plus Claude/Codex/Cursor/Devin registered hook adapters |
| **Storage** | Versioned per-session JSON records in a bounded file store; in-process `Map` for OpenCode |
| **Testing** | Vitest, adapter subprocess probes, symlink/no-follow filesystem fixtures, scenario 457, strict spec validation, and an identical whole-gate baseline/post-run manifest |
| **Status** | In progress, 95%; implementation and regression proof complete, fresh review and metadata pending |
| **Formal Gates** | P0/P1/P2 only; P3 is a non-gating residual-risk register |

### Overview

Option A from `decision-record.md` is implemented: heuristic-only transcript shrink handling is replaced by a versioned record containing directive content, transcript path, transcript high-water bytes, a host-owned lifecycle epoch, and the store-wide invalidation generation last observed by that record. Suppression requires a known current stat, an unchanged path, a size at or above the stored high-water mark, matching trusted epoch and store generation, unchanged directives, and an unambiguous session id. An unidentified host boundary increments the store generation. Every uncertainty returns full directives and does not create reusable suppression proof.

The repository-resident whole-gate manifest was frozen and run before implementation. State IO, host reset hooks, OpenCode identity handling, adapter parity, discovery-link preservation, scenario 457, benchmark provenance, test isolation, and Pi repeat suppression are implemented. The unchanged final manifest comparison reports zero blockers; only fresh review and final metadata/strict reconciliation remain.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `evidence/whole-gate/manifest.json` lists exact commands, cwd values, relevant environment allowlist, runtime versions, expected timeout, and output paths.
- [x] The manifest and all pre-change logs are repository-relative and SHA-256 hashed.
- [x] Current discovery symlink targets are captured before any reconciliation.
- [x] Existing dirty-checkout paths are recorded so unrelated user changes are not mistaken for this implementation.
- [x] P0 review gate reports zero active findings; any new P0 blocks all later phases.

### Definition of Done

- [x] Every implemented P1 requirement in `spec.md` has command and artifact evidence in `checklist.md`; final review and metadata rows remain open.
- [x] File-store adversarial tests prove containment, ownership, no-follow, record validation, and bounded temp cleanup.
- [x] Actual host lifecycle entry points advance the epoch; synthetic prompt-only lifecycle fields cannot be the only proof.
- [x] Scenario 457 and benchmark records use evidence classes and honest Cursor status.
- [x] All discovery symlinks remain present and resolve to registered dist targets.
- [ ] Phases 014-018 and the parent expose one status/fingerprint truth; 017 is superseded by 018.
- [x] The post-change whole-gate run uses the byte-identical manifest and introduces zero new failure identity, missing lane, lost test file, reduced test total, or unexplained skipped/todo delta.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fail-open epoch and high-water state machine with a trusted-storage boundary and typed evidence pipeline.

### Key Components

- **Versioned lifecycle record**: `{ schemaVersion, directives, transcriptPath, transcriptHighWaterBytes, lifecycleEpoch, storeGeneration }`; unknown/malformed/legacy-unsafe records are non-authoritative and cause full delivery.
- **High-water decision**: known growth updates high-water even when route-only is emitted; any known shrink below high-water or any unknown/missing stat delivers full.
- **Host epoch bridge**: actual registered session-start/resume/compact adapters advance a per-session epoch through one canonical, fail-open reset entry point. When an event has no usable session identity, that entry point increments a store-wide invalidation generation; any record carrying an older generation forces full delivery on its next prompt. The user-prompt shim reads trusted store state; test-only payload fields cannot forge a reset.
- **Hardened file store**: anchors operations to verified directory handles where the platform permits, or performs equivalent post-open inode and ancestry verification before trusting a result; final records and temps use no-follow/exclusive flags, validated type/size/owner/mode/link count, and bounded cleanup. If intermediate-component race safety cannot be proven, durable suppression is disabled for that platform.
- **Conflict-aware OpenCode identity resolver**: collects all supported identity candidates, normalizes them, and returns known only when non-empty candidates agree; missing, object-shaped, ambiguous, or conflicting candidates remain ineligible for suppression.
- **Contract-vector fixture**: one data fixture drives the canonical TypeScript decision tests and the OpenCode mirror tests. Drift is recorded under RR-001 and becomes actionable if vectors diverge.
- **Evidence taxonomy**: enum values `unit`, `adapter-driven`, `registered-path`, and `native-host-delivered`; each verdict binds to one class and cannot imply a stronger class.
- **Append-only benchmark provenance**: new reports carry repository-relative evidence, hashes, runtime/version, exact command, sanitized payload, class, executor, and clean model provenance. A new supersession manifest marks old immutable runs non-current.
- **Whole-gate comparator**: one immutable command manifest produces baseline and post-run result sets with exit code, duration, log hash, and normalized failure identities.

### Data Flow

```text
actual host session-start/resume/compact event
  -> registered runtime adapter
  -> canonical epoch-reset entry point
       identified session -> advance lifecycleEpoch
       unidentified session -> increment storeGeneration
  -> older per-session records become ineligible for suppression

user prompt
  -> registered runtime user-prompt adapter
  -> shared advisor shim
  -> resolve unambiguous session + known transcript stat + stored epoch/high-water/generation
  -> canonical directive decision
       uncertain / shrink / new epoch or generation / changed directives -> FULL + safe record update
       same epoch and generation / known growth-or-equal / same directives -> ROUTE-ONLY + high-water update
  -> runtime-specific envelope
  -> evidence artifact tagged with its actual proof class
```

OpenCode follows its real plugin event path for epoch reset and its system transform for prompt delivery. Conflicting identity candidates never reach the in-process dedup map.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor/hooks/lib/directive-lifecycle.ts` | Canonical decision and file/in-memory stores | Add epoch/high-water invariants, harden IO, clean failed temps | Core adversarial suite plus record-schema vectors |
| `system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Shared model-context prompt consumer | Require trusted epoch and known stat before suppression | Shim tests and registered-path cadence |
| `system-spec-kit/mcp-server/hooks/claude/*` | Claude lifecycle producer | Advance epoch on registered SessionStart/PreCompact | Execute `.claude/settings.json` command targets |
| `system-spec-kit/mcp-server/hooks/codex/*` | Codex lifecycle producer | Advance epoch on registered SessionStart/PreCompact | Execute `.codex/hooks.json` command targets |
| `system-spec-kit/mcp-server/hooks/cursor/*` | Cursor registered lifecycle producer | Wire reset, but retain dormant native-event status | Registered-path proof; native status remains unconfirmed |
| `system-spec-kit/mcp-server/hooks/devin/*` | Devin lifecycle producer | Advance epoch on SessionStart/PostCompact | Execute `.devin/hooks.v1.json` command targets |
| `plugins/mk-skill-advisor.js` | OpenCode mirror, lifecycle event consumer, system transform | Resolve identities conflict-aware; consume real plugin events | Plugin event plus transform tests |
| `plugins/lib/opencode-message-identity.js` | Shared transform identity helper | Reuse or extend only if it can preserve fail-open conflict semantics | Identity table tests and consumer grep |
| Runtime discovery links | Host-visible adapter paths | Preserve; never delete or replace with regular files | `test -L`, `readlink`, `realpath`, and dual-path probe |
| `directive-lifecycle.vitest.ts` | Canonical behavior/store proof | Add required negative controls and adversarial store matrix | Focused vitest with row count captured |
| Shim/plugin suites | Consumer behavior and isolation | Add host-reset/identity cases and exhaustive teardown | Hostile-order repeated run |
| New adapter parity suite | Cross-runtime normalization/envelope proof | Add Codex/Cursor/Devin matrix | 3 runtimes × 6 required axes, with explicit row count |
| Scenario 457 | Manual operator contract | Split evidence classes; remove temp-only PASS; mark Cursor native unconfirmed | Playbook grep plus schema validation |
| Manual benchmark wrapper/renderers | Report producer | Enforce provenance and durable evidence before PASS | Wrapper unit tests with rejection fixtures |
| Existing reports | Historical evidence | Keep byte-immutable; mark superseded externally | Before/after directory hashes plus supersession manifest |
| Parent and phases 014-017 | Continuity/status consumers | Reconcile truth; 017 superseded by 018 | Strict recursive validation and generated source hashes |

Required inventories before implementation:

1. Same-class producers: `rg -n 'decideDirectiveLifecycleDelivery|FileDirectiveLifecycleStore|directiveDedupBySession|session_identity|transcriptBytes|lifecycle_event' .opencode/skills/system-skill-advisor .opencode/plugins .opencode/skills/system-spec-kit/mcp-server/hooks`.
2. Lifecycle registrations: `rg -n 'SessionStart|sessionStart|PreCompact|preCompact|PostCompact|post-compaction|session\.compacted|session\.resumed' .claude .codex .cursor .devin .opencode/plugins`.
3. Evidence consumers: `rg -n 'ux-hooks-directive-lifecycle-dedup|scenario 457|providerModel|evidence' .opencode/skills/system-spec-kit .opencode/skills/system-deep-loop`.
4. Phase truth: compare status, completion, continuity fingerprint, description, graph status, children, active child, and source hashes for the parent plus 014-018.

Algorithm invariant: route-only is permitted only when identity, session epoch, store generation, directive content, transcript path, and known transcript high-water continuity are all proven. File IO must also prove race-safe containment. Any failed proof emits full directives. Duplicate-full delivery is acceptable; stale suppression is not.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Freeze `evidence/whole-gate/manifest.json` and capture runtime versions, existing failure identities, discovery symlink targets, historical report hashes, and the pre-change whole-gate run.
- [x] Record the initial affected-surface inventories and confirm active P0 remains zero.
- [x] Mark phase 017's deletion plan as prohibited in this packet before any cleanup work begins.

### Phase 2: Core Implementation

- [x] Extend the record schema and decision with lifecycle epoch and transcript high-water behavior.
- [x] Add the canonical reset entry point and connect Claude/Codex/Cursor/Devin registered lifecycle sources; connect OpenCode real lifecycle events to the same contract semantics.
- [x] Harden all file-store path, open, record, rename, eviction, and temp-cleanup operations.
- [x] Make OpenCode identity resolution conflict-aware and fail-open.
- [x] Add shared behavior vectors to expose TypeScript/JavaScript drift without making RR-001 a formal completion priority.

### Phase 3: Verification

- [x] Add and run canonical, shim, plugin, and adapter parity matrices, including `5 KB → 10 KB → 7 KB`, `null → null`, symlink/no-follow injection, failures, timeouts, missing fields, and discovery versus real path.
- [x] Rework scenario 457, wrapper validation, durable evidence, clean model provenance, and append-only supersession metadata.
- [x] Restore all mutated test process state and run hostile-order/repeat isolation checks.
- [ ] Reconcile phases 014-018 and the parent, regenerate fingerprints through the canonical save path, and run strict validation.
- [x] Rerun the exact whole-gate manifest and compare normalized failures to baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Required Whole-Gate Manifest

The implementation owner writes these commands once to `evidence/whole-gate/manifest.json`; baseline and post-run execute the same serialized entries rather than retyping commands:

| Gate | Command | Required Capture |
|------|---------|------------------|
| Advisor typecheck | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server run typecheck` | Exit code, duration, full log, SHA-256, runtime versions |
| Advisor full suite | `npm --prefix .opencode/skills/system-skill-advisor/mcp-server test` | Exit code, normalized failures, discovered test-file inventory, passed/failed/skipped/todo totals, missing lanes, full log, and SHA-256 |
| Spec-kit typecheck | `npm --prefix .opencode/skills/system-spec-kit/mcp-server run typecheck` | Exit code, duration, full log, SHA-256 |
| Spec-kit full suite | `npm --prefix .opencode/skills/system-spec-kit/mcp-server test` | Exit code, normalized failures, discovered test-file inventory, passed/failed/skipped/todo totals, missing lanes, full log, and SHA-256 |
| Pi full suite | `cd .opencode/hooks/dispatch/pi && npx vitest run` | Exit code, discovered test-file inventory, passed/failed/skipped/todo totals, missing lanes, full log, and SHA-256 |
| Discovery links | `for p in .claude .codex .cursor .devin; do test -L "$p/hooks/user-prompt-submit.js" && readlink "$p/hooks/user-prompt-submit.js"; done` | Four links and canonical targets |
| Packet strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery --strict` | Zero validation errors for current packet |
| Parent recursive validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/hooks/002-injection-bloat-reduction --recursive --strict` | Baseline/post error identity comparison |

### Proof Matrix

| Evidence Class | What It Proves | Runtime Rows | PASS Rule | Durable Artifact |
|----------------|----------------|--------------|-----------|------------------|
| `unit` | Pure decision, store, resolver, and renderer behavior | Canonical core, TS/JS contract vectors | All required branches and adversarial rows pass | `evidence/scenario-457/unit.json` plus hashed logs |
| `adapter-driven` | Adapter normalization and envelope using injected/subprocess seams | Claude, Codex, Cursor, Devin, OpenCode, Pi as applicable | Correct payload/envelope/cadence; no native-host claim | `evidence/scenario-457/adapter-driven/<runtime>.json` |
| `registered-path` | The repository's discovery or config target executes the built adapter | Claude, Codex, Cursor, Devin | Discovery and canonical paths agree; symlink remains intact | `evidence/scenario-457/registered-path/<runtime>.json` |
| `native-host-delivered` | A real host fired the event and a receipt reached model-visible context | Per host when available | Real receipt with host/runtime version; Cursor remains `UNCONFIRMED` until event fires | `evidence/scenario-457/native-host/<runtime>.json` |

### Matrix Axes and Minimum Rows

| Matrix | Independent Axes | Minimum Rows |
|--------|------------------|--------------|
| Lifecycle decision | first/repeat, known growth, shrink below high-water, null stat, path change, epoch change, directive change, kill-switch, unknown session | 12 |
| File store security | base/intermediate/project/record/temp symlink, intermediate replacement race, outside-root, owner, mode, hard link, directory/FIFO, malformed/oversized JSON, write/rename failure, bounded cleanup, unsupported-platform fallback | 18 |
| OpenCode identity | one candidate, equal duplicates, conflicting candidates, explicit ambiguity, object candidate, missing candidate, global sentinel, lifecycle event reset | 8 |
| Adapter parity | runtime × payload, envelope, malformed output, timeout, missing fields, discovery path, real path | 21 or more; each runtime covers all six required behavior classes |
| Test isolation | env, singleton store, plugin instance, fake timer, delayed timer, module mock/cache, repeated suite order | 7 |

### Negative Controls

- `5 KB → 10 KB → 7 KB` must be FULL → ROUTE-ONLY with high-water update → FULL.
- `null → null` must be FULL → FULL.
- Equal directives plus a different trusted epoch or older store-wide invalidation generation must be FULL.
- An unidentified host reset must increment the store generation; the next prompt for every older session record must be FULL.
- Conflicting OpenCode identities must be FULL and must not mutate suppression state.
- Every unsafe file topology must be FULL and leave no outside-root write.
- A failed write or rename must leave no owned `.tmp-*` file beyond the bounded cleanup contract.
- Cursor adapter cadence may pass at adapter/registered-path classes while native-host-delivered remains unconfirmed.
<!-- /ANCHOR:testing -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Read the current task, its dependencies, and the affected producer/consumer inventory.
- Confirm the pre-change whole-gate manifest and baseline artifacts exist before runtime edits.
- Confirm the four discovery symlinks still resolve and no unrelated file is staged.
- Reproduce the exact negative control before changing its responsible code.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` dependency order; security hardening follows record-schema correctness, and evidence reconciliation follows runtime proof. |
| TASK-SCOPE | Modify only files named by the active task; stop on unexpected consumer or schema impact. |
| TASK-PROOF | Run focused checks during repair, then rerun the unchanged whole-gate manifest before closeout. |
| TASK-FAIL-OPEN | Any identity, epoch, transcript, filesystem, or evidence uncertainty must choose full delivery or an unconfirmed verdict. |
| TASK-WRITER | Keep one writer in the active checkout; parallel work is review/validation only. |

### Status Reporting Format

After each task report: task id, files changed, negative control result, commands with exit codes, whole-gate impact, intentionally unchanged consumers, and any residual risk or decision needed.

### Blocked Task Protocol

Stop immediately when a required baseline is missing, a registered path conflicts with documentation, a test or strict validation fails unexpectedly, a symlink or unrelated user file would be modified, or a P0 finding appears. Record the blocker in `implementation-summary.md`, keep the kill-switch/always-full rollback available, and escalate instead of weakening the gate.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Registered lifecycle configurations in `.claude`, `.codex`, `.cursor`, `.devin` | Internal | Available, must be preserved | Host-owned epoch proof cannot be completed; suppression must remain always-full for that runtime. |
| `system-skill-advisor` and `system-spec-kit` build chains | Internal | Available; current dist freshness must be measured | Registered-path evidence cannot be upgraded beyond source/unit evidence. |
| Node filesystem flags, directory-handle semantics, and ownership metadata | Platform | Capability-dependent | Unsupported race-safe containment disables durable suppression and is reported; security PASS cannot be claimed for that capability. |
| Manual benchmark wrapper/report renderers | Internal | Implemented and verified | Durable evidence PASS is rejected unless the controlled provenance contract is satisfied. |
| Canonical spec save/fingerprint workflow | Internal | Available | Parent/phase reconciliation cannot claim complete without regenerated hashes. |
| Whole-gate runtime budget | Operational | Baseline and final run captured | The comparator normalizes equivalent timeout infrastructure and blocks new failure identities or lost coverage. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any stale suppression, cross-session suppression, path escape, record injection acceptance, symlink deletion/replacement, benchmark provenance regression, or new whole-gate failure.
- **Immediate procedure**: set `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` to restore always-full delivery. Keep the discovery symlinks and historical reports untouched.
- **Code rollback**: revert only the packet-owned core, lifecycle bridge, adapter, plugin, wrapper, and test changes to the captured baseline diff. Rebuild the affected dist packages and rerun the same whole-gate manifest.
- **State rollback**: treat version-mismatched records as invalid and delete only the contained directive-lifecycle state directory after owner/no-follow validation. State is disposable; deletion causes full delivery.
- **Evidence rollback**: never delete or rewrite an immutable report. Mark a bad new run superseded in a later append-only manifest.
- **Documentation rollback**: do not restore phase 017's deletion plan. If implementation is rolled back, phase 018 returns to planned/blocked and parent truth points at the kill-switch state.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Baseline + P0 gate + symlink snapshot
                |
                v
Core schema/high-water/store hardening
        |                       |
        v                       v
Host epoch wiring       OpenCode identity/vector work
        \                       /
         v                     v
       Adapter parity + test isolation
                    |
                    v
     Scenario/evidence/provenance correction
                    |
                    v
       Phase/parent truth reconciliation
                    |
                    v
       Identical whole-gate rerun + compare
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | All runtime and evidence edits |
| Core correctness/security | Baseline | Host wiring, consumer tests, evidence cadence |
| Host epoch wiring | Core record/reset API | Registered-path lifecycle proof |
| OpenCode identity/vectors | Baseline; canonical contract | Plugin proof and RR-001 status |
| Adapter parity/isolation | Core and host/plugin wiring | Scenario registered-path results |
| Evidence/provenance | Adapter proof schema | Corrected benchmark reports |
| Reconciliation | Verified implementation and evidence | Final strict validation |
| Whole-gate comparison | All implementation and reconciliation | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and inventories | Medium | 2-4 hours |
| Core correctness and store hardening | High | 8-14 hours |
| Host lifecycle and OpenCode identity wiring | High | 6-10 hours |
| Adapter parity and test isolation | High | 6-10 hours |
| Evidence schema, scenario, and durable runs | High | 6-10 hours |
| Phase reconciliation and identical rerun | Medium | 4-8 hours |
| **Total** | | **32-56 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Whole-gate baseline and diff snapshot captured.
- [x] Always-full kill-switch verified through every registered prompt path.
- [x] Discovery symlink targets and historical report directory hashes captured.

### Rollback Procedure

1. Enable the always-full kill-switch and verify the full directive block on two consecutive prompts.
2. Revert packet-owned runtime changes without touching discovery links or immutable reports.
3. Rebuild affected dist outputs and invalidate only safely-contained versioned state.
4. Rerun the identical whole-gate manifest and compare against the original baseline.
5. Reconcile parent/phase status to planned or blocked, preserving 017 as superseded.

### Data Reversal

- **Has data migrations?** Yes, a disposable versioned lifecycle-record schema and append-only evidence metadata.
- **Reversal procedure**: reject unsupported record versions and safely clear contained state; keep report artifacts immutable and supersede by index entry rather than mutation.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
┌─────────────────────┐
│ Baseline + snapshots│
└──────────┬──────────┘
           v
┌─────────────────────┐      ┌─────────────────────┐
│ Core/store invariant│----->│ Host epoch adapters │
└──────────┬──────────┘      └──────────┬──────────┘
           │                             │
           v                             v
┌─────────────────────┐      ┌─────────────────────┐
│ OpenCode identity   │----->│ Parity/isolation    │
└──────────┬──────────┘      └──────────┬──────────┘
           └──────────────┬──────────────┘
                          v
                ┌─────────────────────┐
                │ Evidence/provenance │
                └──────────┬──────────┘
                           v
                ┌─────────────────────┐
                │ Truth reconciliation│
                └──────────┬──────────┘
                           v
                ┌─────────────────────┐
                │ Identical gate diff │
                └─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Whole-gate baseline | Current checkout and runtime tools | Hashed manifest and failure baseline | Every completion claim |
| Canonical core/store | Baseline | Safe record and decision API | Host/plugin consumers |
| Host lifecycle adapters | Reset API and registrations | Real epoch advancement | Registered-path lifecycle proof |
| OpenCode plugin | Conflict-aware resolver and vectors | Safe in-process suppression | OpenCode evidence |
| Adapter parity | Built consumers and preserved links | Payload/envelope/path proof | Scenario registered-path rows |
| Evidence pipeline | Proof artifacts and schema | Durable current reports | Reconciliation/final review |
| Reconciliation | Final implementation evidence | One parent/phase truth | Strict recursive validation |
| Post-run comparator | All prior components | Regression delta | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Freeze and run the whole-gate baseline** - 2-4 hours - CRITICAL
2. **Land high-water, epoch, and hardened-store invariants** - 8-14 hours - CRITICAL
3. **Wire actual lifecycle adapters and prove registered paths** - 6-10 hours - CRITICAL
4. **Correct evidence/provenance and reconcile truth** - 10-18 hours - CRITICAL
5. **Rerun identical gates and compare** - 4-8 hours - CRITICAL

**Total Critical Path**: 30-54 hours

**Parallel Opportunities**:
- OpenCode identity conflict tests can proceed beside file-store hardening after the baseline is frozen.
- Adapter fixture design and benchmark schema tests can proceed beside host epoch wiring, but final expectations wait for the core contract.
- Phase truth inventory can run early, while actual reconciliation waits for final evidence.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baseline frozen | Hashed manifest, logs, failure identities, symlink and report snapshots exist in packet evidence | End of Phase 1 |
| M2 | Safety invariant implemented | High-water/null controls, host epoch, identity conflict, and store adversarial matrices pass | End of Phase 2 |
| M3 | Evidence made honest and durable | Scenario classes, adapter parity, provenance, supersession manifest, and Cursor status validate | Mid Phase 3 |
| M4 | Repository truth reconciled | Parent and 014-018 metadata/status/fingerprints agree; 017 superseded | Late Phase 3 |
| M5 | Release decision ready | Identical post-run has no new failure identity and strict packet validation passes | End of Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Use Explicit Epoch, High-Water State, Hardened Storage, and Evidence Taxonomy

**Status**: Accepted and implemented; fresh review and final metadata reconciliation pending

**Context**: Heuristic transcript shrink and synthetic lifecycle fields do not prove that retained context is safe, the durable store trusts filesystem topology, and current reports blur proof strength.

**Decision**: Implement the explicit state and proof architecture in Option A. Keep always-full delivery as the immediate rollback.

**Consequences**:
- Correctness and security become explicit, testable invariants.
- More host adapters and evidence producers must participate in one contract.
- Unknown state produces duplicate full delivery rather than stale suppression.

**Alternatives Rejected**:
- **Option B, heuristic-only patch**: cannot close host epoch or storage injection findings.
- **Option C, permanent always-full delivery**: safe rollback but abandons the bloat-reduction goal; retained only as the kill-switch path.
