---
title: "Implementation Plan: Per-command deliverable output contract for /design:*"
description: "planning. Add outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs} to command-metadata.json, an Emit Deliverable section to each wrapper, and extend design-command-surface-check.mjs to ban generic artifact names while keeping drift=0."
trigger_phrases:
  - "deliverable output contract plan"
  - "design command output contract"
  - "emit deliverable section"
  - "outputContract metadata"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/005-deliverable-output-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Mark plan phases complete; rename L2 anchors to the manifest contract"
    next_safe_action: "Run D2-R6 sibling-discriminator phase for the /design:* command surface"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r5-deliverable-output-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Per-command deliverable output contract for /design:*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), JSON (metadata SSOT), Markdown (command wrappers) |
| **Surface** | `sk-design` `/design:*` command wrappers + `command-metadata.json` SSOT |
| **Checker** | `design-command-surface-check.mjs` (additive extension; no behavior removed) |
| **Testing** | `node --check` parse + surface-check run (STATUS=PASS, invalid=0, drift=0) + evergreen grep scan |

### Overview
Each `/design:*` wrapper currently declares only a `STATUS=OK|FAIL` tail, leaving the deliverable's name, kind, required fields, and file outputs undefined (evidence: `commands/design/audit.md:26`). This phase makes the concrete artifact each command produces explicit and machine-checkable by: (1) adding an `outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs}` block per command to the `command-metadata.json` SSOT, reconciled with the existing `returns`/`proofFields`; (2) adding a generated `Emit Deliverable` section to each of the five wrappers describing that artifact and its required fields; and (3) extending `design-command-surface-check.mjs` to require the contract, ban generic artifact names, and reconcile the contract against `toolPolicy`/`proofFields`. The change is additive: the existing frontmatter drift checks must continue to pass (drift=0).

### Recommended outputContract per command
`requiredFields` mirrors each record's existing `proofFields` for self-consistency. Read-only modes carry empty `fileOutputs`; only the mutating `md-generator` writes a file.

| Command | primaryArtifactName | artifactKind | requiredFields (= proofFields) | fileOutputs |
|---------|--------------------|--------------|--------------------------------|-------------|
| `/design:audit` | `Design Quality Audit Report` | `report` | target, evidenceInventory, severityFindings, qualityScore | `[]` |
| `/design:foundations` | `Visual System Foundations Plan` | `plan` | axis, target, tokenDecisions, contrastEvidence | `[]` |
| `/design:interface` | `Interface Direction Spec` | `spec` | target, register, designDials, preflightResult | `[]` |
| `/design:md-generator` | `Style Reference DESIGN.md` | `reference-doc` | sourceUrl, extractedTokensDigest, fidelityScore | `["<output>/DESIGN.md"]` |
| `/design:motion` | `Motion Design Spec` | `spec` | componentState, motionPurpose, timingModel, reducedMotionPath | `[]` |

Generic-name ban set (reject when `primaryArtifactName`, trimmed+lowercased, equals or is composed solely of): `output, result, artifact, deliverable, data, response, file, document, thing, stuff`. Controlled `artifactKind` vocabulary: `report | plan | spec | reference-doc`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source of truth identified (phase `spec.md` + research §5 D2-R5)
- [x] Real target files enumerated (five wrappers, metadata, checker)
- [x] Reconciliation rule chosen (`requiredFields == proofFields`; `fileOutputs` ↔ `mutatesWorkspace`)
- [x] No-regression baseline defined (existing frontmatter drift stays 0)

### Definition of Done
- [x] `outputContract` present on all five metadata records with the four sub-fields — five blocks in `command-metadata.json`.
- [x] `Emit Deliverable` section present in all five wrappers, mirroring metadata — `## 3. EMIT DELIVERABLE` names each `primaryArtifactName`.
- [x] Checker requires the contract, bans generic names, and reconciles fields — `outputContract` in `REQUIRED_FIELDS`, ban set, enum, reconciliation.
- [x] Surface-check returns STATUS=PASS, invalid=0, drift=0; `node --check` passes — both verified by the orchestrator.
- [x] No spec/packet/phase IDs or spec paths in any output artifact (evergreen) — grep over the seven files is clean.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Metadata-as-SSOT with a deterministic surface checker projecting/validating the wrappers. The wrappers stay thin bridges; the contract lives in `command-metadata.json` and is mirrored (not authored) into each wrapper body.

### Key Components
- **`command-metadata.json`** (SSOT) — gains one `outputContract` block per command record.
- **`/design/*.md` wrappers** — each gains a generated `## 3. EMIT DELIVERABLE` section naming the artifact, kind, and required fields. Frontmatter is untouched.
- **`design-command-surface-check.mjs`** — extended with: `outputContract` in `REQUIRED_FIELDS`, sub-shape validation, generic-name ban, `requiredFields == proofFields` and `fileOutputs ↔ mutatesWorkspace` reconciliation, `artifactKind` enum, and a body-drift check for wrapper section presence.
- **`mode-registry.json`** — read-only; remains the `workflowMode` source the checker validates `ownerMode` against.

### Data Flow
1. Author resolves `outputContract` per command from the recommended table, reconciling `requiredFields` to existing `proofFields` and `fileOutputs` to `toolPolicy.mutatesWorkspace`.
2. Each metadata record gains its `outputContract` block.
3. Each wrapper gains an `Emit Deliverable` section mirroring its record (artifact name + required fields), with no frontmatter change.
4. The checker validates: contract presence/shape, non-generic `primaryArtifactName`, `artifactKind ∈ {report,plan,spec,reference-doc}`, `requiredFields == proofFields`, `fileOutputs` non-empty iff `mutatesWorkspace`, and that each wrapper body contains its `Emit Deliverable` section naming the artifact.
5. Verification: `node --check`, surface-check run (PASS / invalid=0 / drift=0), negative tests in scratch, evergreen grep.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the five wrappers, `command-metadata.json`, the checker, and `mode-registry.json` — all read before editing.
- [x] Capture the pre-edit surface-check baseline (expect invalid=0, drift=0) — baseline captured by the implementer.
- [x] Extract each record's `proofFields` to drive `requiredFields` reconciliation — `requiredFields` mirror each `proofFields`.

### Phase 2: Core Implementation
- [x] Add `outputContract` to all five records in `command-metadata.json` — five blocks present.
- [x] Add a `## 3. EMIT DELIVERABLE` section to each of the five wrappers — heading + artifact name in all five.
- [x] Extend the checker: `REQUIRED_FIELDS` + sub-shape validation — `outputContract` required; sub-shape validated.
- [x] Extend the checker: generic-name ban + `artifactKind` enum — `GENERIC_ARTIFACT_NAMES` + `report|plan|spec|reference-doc`.
- [x] Extend the checker: `requiredFields == proofFields` and `fileOutputs ↔ mutatesWorkspace` — both reconciliations enforced.
- [x] Extend the checker: body-drift check for the wrapper `Emit Deliverable` section — `emit-deliverable` drift field added.

### Phase 3: Verification
- [x] `node --check` the extended checker — exits 0.
- [x] Run surface-check → STATUS=PASS, invalid=0, drift=0 — confirmed by the orchestrator.
- [x] Negative test (scratch): generic name → INVALID; missing section → drift>0; restore — synthetic break flips to INVALID, then reverted.
- [x] Evergreen grep scan over the seven output files; sync spec docs; clean scratch — grep clean; docs synced.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | Checker remains valid ESM after extension | `node --check design-command-surface-check.mjs` |
| Contract | Metadata shape + reconciliation + non-generic names | `node design-command-surface-check.mjs` (expect invalid=0) |
| Surface drift | Wrapper frontmatter + Emit Deliverable section reconcile with metadata | `node design-command-surface-check.mjs` (expect drift=0) |
| Negative control | Gate actually fails on generic name / missing section | Temporary scratch mutation → expect non-zero exit, then revert |
| Evergreen | No spec/packet/phase IDs or spec paths in outputs | `rg` over wrappers + metadata + checker |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js runtime | External | Green | Cannot run `node --check` or the surface-check |
| `command-metadata.json` | Internal | Green | No SSOT to attach `outputContract` to |
| `mode-registry.json` | Internal | Green | Checker cannot resolve `workflowMode` set |
| Five `/design/*.md` wrappers | Internal | Green | No surface to carry the Emit Deliverable section |
| `design-command-surface-check.mjs` | Internal | Green | Contract cannot be enforced |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Surface-check regresses (invalid>0 or drift>0) that cannot be reconciled, or the body-drift check proves too brittle.
- **Procedure**: Revert the edits to `command-metadata.json`, the five wrappers, and `design-command-surface-check.mjs`. Each change is isolated to those seven files; reverting restores the prior drift=0 baseline.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Metadata + Wrappers + Checker) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Metadata (`outputContract`) | Setup | Wrappers, Checker reconciliation, Verify |
| Wrappers (Emit Deliverable) | Metadata | Checker body-drift, Verify |
| Checker extension | Metadata, Wrappers | Verify |
| Verify | Metadata, Wrappers, Checker | None |

> Metadata edit precedes wrappers so the section text mirrors the SSOT; the checker reconciliation and body-drift checks depend on both being in place.

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + baseline | Low | 25 minutes |
| `outputContract` in metadata (5 records) | Low | 30 minutes |
| Emit Deliverable section (5 wrappers) | Low | 50 minutes |
| Checker extension (validation + ban + reconcile + body-drift) | Medium | 1.5 hours |
| Verification + negative tests + evergreen | Low | 40 minutes |
| **Total** | | **~3.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline surface-check output captured (invalid=0, drift=0) before edits — implementer captured the baseline.
- [x] Negative-test mutations performed only in scratch, never in tracked files — synthetic break run then reverted; no tracked residue.
- [x] Evergreen grep clean before completion — grep over the seven files returns no spec/packet/phase IDs.

### Rollback Procedure
1. **Metadata**: revert `outputContract` additions in `command-metadata.json`
2. **Wrappers**: remove the `## 3. EMIT DELIVERABLE` sections from the five `/design/*.md` files
3. **Checker**: revert `design-command-surface-check.mjs` to its prior validation set
4. **Verify**: re-run `node design-command-surface-check.mjs` → confirm invalid=0, drift=0 against the prior baseline

### Data Reversal
- **Has data migrations?** No — documentation/metadata/script edits only
- **Reversal procedure**: `git checkout` the seven listed files

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Additive contract; no-regression target drift=0
-->
