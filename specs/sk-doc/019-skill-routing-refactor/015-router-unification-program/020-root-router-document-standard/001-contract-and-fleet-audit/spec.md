---
title: "Feature Specification: Contract and Fleet Audit"
description: "Define and freeze the Level-3 contract, seven-hub baseline, source-of-truth hierarchy, default-resource decisions, machine hashes, historical/live classification, protected digests, and no-live-edit handoff for the root ROUTER.md program."
trigger_phrases:
  - "root router contract"
  - "seven hub fleet audit"
  - "router machine block hash"
  - "default resource matrix"
  - "no live edit gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/001-contract-and-fleet-audit"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ratified the two-state contract and executed the read-only seven-hub fleet baseline."
    next_safe_action: "Phase 002 consumes the ratified contract, stable-code table, and baseline fields."
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
# Feature Specification: Contract and Fleet Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 001 freezes the contract and the read-only fleet baseline before any class-H hub is changed. It establishes a two-state root `ROUTER.md` schema, records all seven current hubs as future `active` adopters, separates stage-one mode authority from stage-two leaf authority, preserves each hub's fallback semantics, and defines objective receipts for machine blocks, canaries, manifests, status, old-path occurrences, and frozen scorer bytes.

**Key Decisions**: only `active` and `stage1-only` are valid states; all seven canonical hubs adopt `active`; `hub-router.json` plus `mode-registry.json` remain stage-one authority; active root `ROUTER.md` owns stage-two leaf selection; the sk-code router self-reference is removed without making `ROUTER.md` a typed leaf.

**Critical Dependencies**: the approved plan, the `020` parent spec, the seven current hub packages, `leaf-manifest.json`, the frozen scorer trio, current canary owners, authored activation manifests, and a clean scoped Git baseline.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Ratified** | 2026-08-16 |
| **Worktree** | `.worktrees/010-root-router-document-standard` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None |
| **Successor** | `../002-create-skill-template-and-validator-alignment/spec.md` |
| **Execution Boundary** | Read live sources; write only inside this child folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Six class-H hubs still expose their second-stage router at `shared/references/smart-routing.md`, while mcp-tooling already uses root `ROUTER.md`. The fleet lacks a single frozen schema, a complete seven-hub adoption ledger, a classified old-path inventory, and a receipt set that proves later migrations preserve policy, defaults, manifests, route outcomes, and protected scorer bytes.

### Purpose

Approve one testable contract and capture a reproducible, read-only baseline that phases 002 through 004 can consume without rediscovering policy or widening scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Define the exact `active` and `stage1-only` root-router states and their validation rules.
- Freeze the source-of-truth hierarchy for stage one, stage two, typed leaf identity, human pointers, validators, advisor indexing, and compiled projections.
- Record all seven canonical hubs as target state `active` and capture current source paths, key counts, hub defaults, machine-block SHA-256 values, route outcomes, canary results, effective policy hashes, authored manifests, and promoted status.
- Freeze the per-hub `hub-router.json` `defaultResource` disposition.
- Classify every old-path occurrence as live contract, generated/current evidence, or immutable history, with the frozen replay fallback called out as a protected compatibility exception.
- Adjudicate the sk-code `DEFAULT_RESOURCE` self-reference and define the exact resource-set delta.
- Pin the three frozen benchmark files and prove their actual bytes match the pinned digests.
- Prove the Phase 001 exit contains no live hub edits.

### Out of Scope

- Creating, moving, or deleting a live hub router.
- Editing any hub `SKILL.md`, README, registry, hub router, leaf manifest, canary, route-gold fixture, authored activation manifest, or compiled artifact.
- Editing `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`, or their digest constants.
- Updating templates, generator code, command workflows, validators, parent doctor, or package validation; phase 002 owns those changes.
- Migrating the seven hubs; phase 003 owns adoption.
- Rebuilding, refreshing, promoting, or closing the fleet; phase 004 owns those actions.
- Rewriting changelogs or benchmark reports.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Normative Phase 001 contract and frozen decision matrices |
| `plan.md` | Modify | Read-only audit procedure, commands, milestones, and rollback |
| `tasks.md` | Modify | Receipt-backed execution sequence |
| `checklist.md` | Create | P0/P1/P2 handoff gates |
| `decision-record.md` | Create | Proposed architecture decisions for ratification |
| `implementation-summary.md` | Modify | Completed delivery state (receipt-backed) |
| `description.json` | Create | Level and discovery metadata |
| `graph-metadata.json` | Regenerate | Completed graph metadata with source hashes |
| `scratch/baseline/**` | Create during execution | Read-only command receipts and inventories |

All paths above are relative to this child folder. Live hub packages are evidence sources only.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define exactly two root-router states. | The schema accepts only `router_state: active` and `router_state: stage1-only`; any missing, unknown, duplicate, or malformed state fails. |
| REQ-002 | Separate stage-one and stage-two authority. | `hub-router.json` plus `mode-registry.json` own mode resolution; only active root `ROUTER.md` owns leaf selection; no leaf map moves into stage one. |
| REQ-003 | Freeze the seven-hub adoption baseline. | The matrix names exactly cli-external-orchestration, sk-design, sk-prompt, sk-doc, system-deep-loop, sk-code, and mcp-tooling, with target state `active` for each. |
| REQ-004 | Freeze default-resource behavior per hub. | Exactly cli-external-orchestration, sk-design, and system-deep-loop repoint literal legacy default entries to `ROUTER.md`; sk-prompt, sk-doc, and sk-code preserve stage-one defaults; mcp-tooling remains unchanged. |
| REQ-005 | Capture reproducible machine hashes. | One documented command hashes the UTF-8 bytes inside each machine-readable Python fence, excluding fence lines and the terminal newline before the closing fence; seven baseline values are recorded. |
| REQ-006 | Classify every old-path occurrence. | Every match has path, line, class, owner phase, action, rationale, and pre-change hash; no occurrence remains unclassified. |
| REQ-007 | Resolve the sk-code root-location exception. | The later migration removes `references/smart-routing.md` from sk-code's stage-two `DEFAULT_RESOURCE`, normalizes ten legacy-file-relative hub-shared paths to explicit `shared/...` paths, declares the eight mapped shared paths in `SHARED_CONTROL_RESOURCES`, and adds neither `ROUTER.md` nor a fabricated owner to any leaf set or manifest pair. |
| REQ-008 | Protect frozen scorer bytes. | Actual SHA-256 values for the frozen trio equal the pinned constants before and after Phase 001; any mismatch stops work. |
| REQ-009 | Capture objective fleet state. | Every hub has command, exit code, timestamp, source path, map-key count, default values, canary result, effective policy hash, authored manifest identity/freshness, promoted status, and scoped Git status evidence. |
| REQ-010 | Enforce a no-live-edit exit gate. | `git diff --name-only` and `git status --short` show Phase 001 writes only inside this child folder; any live hub change blocks the 001 to 002 handoff. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Require a root pointer and four-part version in both states. | Each future hub has one root `ROUTER.md`, a root `SKILL.md` pointer, `version: X.Y.Z.W`, and neither legacy router location. |
| REQ-012 | Bind active leaves to typed identity and classify shared controls. | `active` maps are non-empty and have identical intent/resource key sets. Packet-owned paths resolve on disk to `(workflowMode, leafResourceId)` entries in `leaf-manifest.json`. Explicit `SHARED_CONTROL_RESOURCES` use normalized contained `shared/...` paths, occur in `RESOURCE_MAP`, resolve on disk, and never project as typed leaves. |
| REQ-013 | Make `stage1-only` genuinely leafless. | `INTENT_SIGNALS`, `RESOURCE_MAP`, and stage-two `DEFAULT_RESOURCE` are empty, and the document states that mode selection remains in `hub-router.json` plus `mode-registry.json`. |
| REQ-014 | Preserve advisor boundaries. | `ROUTER.md` is documented as a control-plane companion, never a leaf, advisor identity, generated file, or class discriminator; system-skill-advisor remains unchanged. |
| REQ-015 | Produce a strict-valid draft packet. | All six Level-3 authored documents, description metadata, and graph metadata exist; no unresolved tokens remain; strict validation exits 0 while lifecycle remains draft/planned. |

### Two-State Schema

```yaml
router_state: active
```

An active router must satisfy all of the following:

1. `INTENT_SIGNALS` and `RESOURCE_MAP` are non-empty dictionaries.
2. Their key sets are identical.
3. Every packet-owned resource is packet-qualified or an approved shared alias and resolves to a typed pair in `leaf-manifest.json` through the existing leaf-resource contract.
4. Every explicitly declared shared control uses a normalized contained `shared/...` path, is referenced by `RESOURCE_MAP`, resolves on disk, and remains outside typed-leaf projection.
5. Every path resolves on disk.
6. A stage-two `DEFAULT_RESOURCE` may preserve existing semantics, but it does not alter `hub-router.json.defaultResource` and it cannot identify root `ROUTER.md` as a typed leaf.

```yaml
router_state: stage1-only
```

A stage1-only router must keep `INTENT_SIGNALS`, `RESOURCE_MAP`, and stage-two `DEFAULT_RESOURCE` empty. Its prose delegates all routing to `hub-router.json` plus `mode-registry.json`. Both states require a root file, root `SKILL.md` pointer, four-part document version, and zero legacy router files.

### Source-of-Truth Hierarchy

| Rank | Surface | Authority | Explicit Non-Authority |
|------|---------|-----------|------------------------|
| 1 | Approved plan, `020` parent spec, and ratified Phase 001 decisions | Program scope, sequencing, invariants, and exceptions | Runtime route selection |
| 2 | `mode-registry.json` | Public mode identity, packet ownership, typed packet metadata | Intent scoring and leaf maps |
| 3 | `hub-router.json` | Stage-one mode scoring, outcomes, ambiguity behavior, and hub fallback | Stage-two leaf selection |
| 4 | Root `ROUTER.md` when `active` | Stage-two `INTENT_SIGNALS`, `RESOURCE_MAP`, and preserved stage-two fallback semantics | Advisor identity, class discrimination, or generated policy authority |
| 5 | `leaf-manifest.json` plus aliases and leaf-resource contract | Typed leaf identity and on-disk membership | Choosing which leaf a prompt needs |
| 6 | Root `SKILL.md` | Human-facing two-stage pointer and operator contract | Duplicate machine maps |
| 7 | Validator and parent doctor | Contract enforcement and stable failure codes | Defining alternate route policy |
| 8 | Authored activation manifests and compiled artifacts | Derived, freshness-bound projections | Editing or overriding authored source policy |
| 9 | system-skill-advisor index | Root `SKILL.md` and root `graph-metadata.json` discovery only | Parsing `ROUTER.md`, `description.json`, maps, or default resources |

### Frozen Seven-Hub Baseline

`Machine SHA-256` is the hash of the inner machine-readable Python fence under each router's machine-readable section, using the byte definition in REQ-005.

| Hub | Current Stage-Two Source | Intent / Map Keys | `hub-router.json` Default | Frozen Target State | Machine SHA-256 |
|-----|--------------------------|-------------------|---------------------------|---------------------|----------------|
| cli-external-orchestration | `shared/references/smart-routing.md` | 6 / 6 | `shared/references/smart-routing.md`, `mode-registry.json` | active | `8899785a6bbbb8887003dad7a399491afadf4acd89bd4734305cb42ec063851a` |
| sk-design | `shared/references/smart-routing.md` | 4 / 4 | `shared/references/smart-routing.md`, `mode-registry.json` | active | `0a7870889e4886c0cfc209ebc9eeb74565d033cf8f46e79b1590d857f4fd7a26` |
| sk-prompt | `shared/references/smart-routing.md` | 13 / 13 | `sk-prompt-improve/SKILL.md` | active | `f3212fb827ceb840ad2fdb4849aa4d0d388158f0fd85aac1eeb3eb40ea0216d0` |
| sk-doc | `shared/references/smart-routing.md` | 14 / 14 | `shared/references/quick-reference.md` | active | `2ad1469cccf36f44a358ed57b891e55dd16adbc7db2d51de853c7e186f92742a` |
| system-deep-loop | `shared/references/smart-routing.md` | 7 / 7 | `shared/references/smart-routing.md`, `mode-registry.json` | active | `f9f410c1e3d0e70c7db23d952041811dab95be478237fdd2bf5e3523e7f9d274` |
| sk-code | `shared/references/smart-routing.md` | 20 / 20 | `shared/README.md` | active | `6504f6a359f9aa6f6dd7e8227e12584518faacc313788b8451a2af5aa672ed09` |
| mcp-tooling | `ROUTER.md` | 7 / 7 | `ROUTER.md`, `mode-registry.json` | active | `8477b6647be344fbda0214b2850d5e53c646d5e1a81c9c36da288b9edd75018e` |

These values are the ratified baseline. Execution reproduced all seven machine hashes from the same worktree using the REQ-005 extractor; four migrated hubs remain byte-equal, sk-prompt carries one adjudicated stale-leaf replacement, sk-code carries the approved one-resource repair, and mcp-tooling is unchanged (receipts: `../003-seven-hub-root-adoption/scratch/checkpoints/*/checkpoint-close.md`; fleet status re-verified 2026-08-16 via `compiled-route-status.cjs --all`).

### `defaultResource` Decision Matrix

| Hub | Stage-One Baseline | Phase 003 Disposition | Reason |
|-----|--------------------|-----------------------|--------|
| cli-external-orchestration | legacy router plus registry | Replace only the literal legacy path with `ROUTER.md`; keep registry entry | Existing fallback explicitly names the migrated control document |
| sk-design | legacy router plus registry | Replace only the literal legacy path with `ROUTER.md`; keep registry entry | Existing fallback explicitly names the migrated control document |
| system-deep-loop | legacy router plus registry | Replace only the literal legacy path with `ROUTER.md`; keep registry entry | Existing fallback explicitly names the migrated control document |
| sk-prompt | `sk-prompt-improve/SKILL.md` | Preserve byte-for-byte unless independent route-gold evidence approves a change | Fallback does not name the legacy router |
| sk-doc | `shared/references/quick-reference.md` | Preserve byte-for-byte unless independent route-gold evidence approves a change | Fallback does not name the legacy router |
| sk-code | `shared/README.md` | Preserve stage-one fallback; separately remove the stage-two router self-reference | Root router cannot be a typed packet leaf |
| mcp-tooling | root router plus registry | Unchanged | Pilot already follows the root standard |

### Old-Path Classification Rules

| Class | Definition | Required Action |
|-------|------------|-----------------|
| Live contract | Current source, instructions, defaults, pointers, tests, or playbooks that create, load, or assert the old path | Assign an owner in phases 002 or 003 and replace or deliberately exempt it |
| Generated/current evidence | Current manifests, generated expectations, route-gold, canary inputs, or status artifacts derived from live routing | Regenerate through the owning tool only after source changes; adjudicate every delta |
| Immutable history | Changelogs, archived packets, and dated benchmark reports that record what was true at the time | Do not edit; exclude from the zero-live-residue gate with an explicit path rule |

The legacy lookup strings inside frozen `router-replay.cjs` are classified as a protected live compatibility exception. They stay byte-identical and do not count as a live hub file or authoring instruction.

### Frozen Scorer Digests

| File | Pinned SHA-256 |
|------|---------------|
| `router-replay.cjs` | `14f169a466d970648f46f0f312904cc682221d1adfdedef97264398ffc9124d9` |
| `score-skill-benchmark.cjs` | `05bf38b8e186fd760a5a9b3940fc646821bd9caa843ad7a9c67d9d4df22a5886` |
| `load-playbook-scenarios.cjs` | `f5b4415034d3ea1132a862c2ae19f9015e9bff07cb54235cb42058fe4dfdcd24` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One strict-valid Level-3 packet defines exactly two router states and no third or implicit state. — Met; strict child validation exited 0 on 2026-08-16 (final re-run passed to the worktree-local authoritative gate; validator runtime incomplete in this worktree).
- **SC-002**: The fleet matrix contains exactly seven canonical hubs, all frozen for target state `active`, with reproducible current source, key-count, default, and machine-hash fields. — Met; source/key/default/hash fields re-verified 2026-08-16 (see checklist CHK-020..CHK-022).
- **SC-003**: Every old-path match is classified with an action, owner, and immutable-history or protected-compatibility exclusion when applicable. — Met; zero live legacy files remain and zero rows are unclassified.
- **SC-004**: The sk-code expected delta is exactly removal of `references/smart-routing.md` from the stage-two always-loaded preamble, with no `ROUTER.md` leaf identity introduced. — Met; executed exactly (20 keys/order unchanged, 8 shared controls declared; re-verified 2026-08-16).
- **SC-005**: Actual frozen trio hashes equal all three pinned values before and after the audit. — Met; `14f169a4…`/`05bf38b8…`/`f5b44150…` before and after (re-verified 2026-08-16).
- **SC-006**: Objective commands capture seven canaries, effective policy identities, authored manifest freshness, promoted status, and scoped Git status with exit codes. — Met; receipts in `../003-seven-hub-root-adoption/scratch/checkpoints/` and `../004-parity-regression-and-closeout/scratch/closeout/`.
- **SC-007**: The Phase 001 handoff shows zero changes outside this child folder and no live hub edits. — Met; no-live-edit gate passed and the 001 to 002 handoff was approved.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Approved plan and `020` parent | Contract could diverge from program authority | Treat both as read-first normative inputs and stop on conflict |
| Dependency | Seven live hub packages | Baseline cannot be reproduced | Capture repo-relative source paths, command, timestamp, and exit code per hub |
| Dependency | Leaf manifests and aliases | Active map membership cannot be proven | Validate each resource through the existing leaf-resource contract |
| Dependency | Canary and status owners | Fleet state could be inferred from stale prose | Run owner commands and retain machine-readable receipts |
| Risk | Hash algorithm ambiguity | Old/new comparisons become meaningless | Freeze exact byte boundaries and one implementation command before capture |
| Risk | Historical grep noise | Zero-residue gate could trigger unnecessary history edits | Classify before action and exclude only named immutable surfaces |
| Risk | Default fallback drift | Migration silently changes zero-signal behavior | Freeze stage-one and stage-two defaults independently |
| Risk | Phase 001 edits live hubs | Baseline invalidates itself | Hard no-live-edit gate with pre/post scoped status and diff |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The full read-only baseline command set completes locally without network access.
- **NFR-P02**: Each per-hub receipt is independently rerunnable and bounded to one hub.

### Security

- **NFR-S01**: Receipts contain no secrets, environment values, user data, or absolute paths outside the worktree and this spec folder.
- **NFR-S02**: Hashing reads bytes only; it never normalizes or rewrites a source file.

### Reliability

- **NFR-R01**: Every command records exit code and fails closed on parse, missing-file, hash, or count mismatch.
- **NFR-R02**: Repeated baseline runs on unchanged bytes produce identical machine hashes and frozen digests.
- **NFR-R03**: A baseline mismatch blocks ratification instead of updating expected values automatically.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **Empty active maps**: invalid; the validator emits the active-empty failure code.
- **Empty stage1-only maps**: required; any resource or default entry is invalid.
- **Mismatched map keys**: invalid even when all paths resolve.
- **Shared alias path**: valid only when the existing leaf-resource contract resolves it to a manifest pair.
- **Four-part version**: required for both states; three-part or five-part values fail.

### Error Scenarios

- **Dual source**: root plus either legacy router location fails closed; neither source is selected.
- **Frozen digest mismatch**: stop Phase 001 and record LOGIC-SYNC; never bless new pins in this child.
- **Machine hash mismatch**: retain both values and investigate byte boundary, worktree base, and source drift; do not overwrite the matrix silently.
- **Canary missing or non-zero**: record the exact command and failure; baseline capture can remain factual, but handoff approval requires explicit adjudication.
- **Old path in history**: classify immutable and leave unchanged.
- **Old path in frozen replay**: classify protected compatibility and leave byte-identical.
- **Old path in live authoring instruction**: assign phase 002 or 003 ownership; it cannot be excluded as history.

### State Transitions

- **Draft to ratified**: completed 2026-08-16; every P0 checklist item carries concrete receipt evidence (`checklist.md`).
- **Draft to complete**: completed by the execution pass; the ratified baseline, ADR-001..005 (Accepted), and handoff receipts are recorded in `checklist.md`, `decision-record.md`, and `implementation-summary.md`.
- **Unexpected live edit**: restore it before rerunning the baseline and exit gate (none occurred; the no-live-edit gate passed).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Seven hubs, six canonical docs, two metadata files, fleet-wide matrices |
| Risk | 23/25 | Runtime routing authority, defaults, manifests, promoted state, protected hashes |
| Research | 17/20 | Old-path classification, owner commands, generated/current evidence boundaries |
| Multi-Agent | 9/15 | Serial phase handoffs and later specialized owners; Phase 001 itself remains direct |
| Coordination | 14/15 | Four serial children, seven serial hub checkpoints, strict no-live-edit handoff |
| **Total** | **85/100** | **Level 3 architecture packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Machine bytes are hashed with inconsistent boundaries | H | M | One canonical extractor and an explicit byte contract |
| R-002 | Stage-one and stage-two defaults are conflated | H | M | Separate columns and separate sk-code adjudication |
| R-003 | Historical matches are edited to satisfy a broad grep | H | M | Required classification ledger before any later edit |
| R-004 | Generated artifacts are hand-edited | H | L | Owner-tool-only regeneration rule |
| R-005 | Root router becomes an advisor identity or typed leaf | H | L | Explicit non-authority rules and negative validation |
| R-006 | A live hub edit contaminates the audit baseline | H | M | Pre/post status, diff, and restoration gate |
| R-007 | Current non-green fleet state is hidden | H | M | Record factual per-hub failures; never infer green from plan text |
| R-008 | Frozen scorer drift is normalized as expected | H | L | Pinned constants and hard LOGIC-SYNC stop |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Validator Maintainer Freezes the Schema (Priority: P0)

**As a** validator maintainer, **I want** one two-state contract, **so that** phase 002 can implement stable failures without guessing runtime semantics.

**Acceptance Criteria**:

1. **Given** an `active` root router with non-empty equal-key maps and valid typed paths, **When** the future validator checks it, **Then** the state passes the stage-two shape gate.
2. **Given** a `stage1-only` root router with any non-empty stage-two map or default, **When** the future validator checks it, **Then** the state fails without consulting replay scoring.

### US-002: Hub Migrator Preserves Fleet Semantics (Priority: P0)

**As a** hub migrator, **I want** per-hub source, default, and machine hashes, **so that** phase 003 can prove each move preserves behavior.

**Acceptance Criteria**:

1. **Given** the seven-hub matrix, **When** a hub reaches its migration checkpoint, **Then** its pre-change source, key count, default disposition, and machine hash are already fixed.
2. **Given** a default that does not name the legacy router, **When** the router moves, **Then** the stage-one fallback remains byte-identical.

### US-003: Reviewer Distinguishes Live and Historical Residue (Priority: P0)

**As a** reviewer, **I want** every old-path occurrence classified, **so that** live sources are corrected without rewriting immutable history or frozen compatibility code.

**Acceptance Criteria**:

1. **Given** a match in a changelog or dated benchmark report, **When** the ledger classifies it, **Then** the action is immutable and no edit is planned.
2. **Given** a match in a current default or authoring instruction, **When** the ledger classifies it, **Then** a later phase owner and action are mandatory.

### US-004: Program Owner Approves a Clean Handoff (Priority: P0)

**As a** program owner, **I want** objective receipts and a no-live-edit gate, **so that** phase 002 starts from a trustworthy baseline.

**Acceptance Criteria**:

1. **Given** all receipt commands have run, **When** Phase 001 requests handoff, **Then** the seven canary/status rows and all three frozen digests have command-backed results.
2. **Given** the worktree diff, **When** the handoff gate runs, **Then** every changed path is inside this child folder and no staged file exists.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None at authoring time. A mismatch in hub count, source precedence, frozen digest, default behavior, or protected-file scope triggers LOGIC-SYNC and blocks ratification rather than expanding this packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Approved plan**: `/Users/michelkerkmeester/.pi/agent/plans/01a00512-29e3-7bf3-8288-4454ffb94865.md`
- **Parent phase spec**: `../spec.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
- **Implementation summary**: `implementation-summary.md`
