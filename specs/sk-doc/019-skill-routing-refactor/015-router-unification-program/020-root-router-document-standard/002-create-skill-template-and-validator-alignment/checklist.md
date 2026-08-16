---
title: "Verification Checklist: Create-Skill Template and Validator Alignment"
description: "Completed verification gates for two-state template authoring, the stage1-only initializer, pure root-router validation with stable codes, command workflow classification, doctor/package integration, fixture coverage, protected-byte preservation, and the 002 to 003 handoff."
trigger_phrases:
  - "create skill alignment checklist"
  - "root router validator gate"
  - "stage1-only scaffold checklist"
  - "parent doctor handoff checklist"
importance_tier: "critical"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Completed the Phase 002 verification gates; all CHK items carry fixture and command evidence."
    next_safe_action: "Support the 002 to 003 handoff with the ratified checklist."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Create-Skill Template and Validator Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass before the 002 to 003 handoff |
| **[P1]** | Required | Must pass or receive explicit approval to defer |
| **[P2]** | Optional | May defer with a recorded reason |

Unchecked items are pending. A check mark requires a named command receipt or reviewed decision row.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Approved plan, parent spec, and Phase 001 contract were read first. [File: contract-sources.sha256] **Evidence**: approved plan, parent spec, Phase 001 contract reread; hashes recorded. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-002 [P0] The active checkout is the isolated 010 worktree. [Test: worktree-path receipt] **Evidence**: CWD is the isolated 010 worktree (verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-003 [P0] No staged files exist. [Test: git-staged-before.txt] **Evidence**: no staged files (git diff --cached empty). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-004 [P0] Protected-byte pins (discriminator + replay + scorers) match before edits. [Test: protected-pin-check.json] **Evidence**: protected-byte pins match before edits (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-005 [P1] The legacy-instruction inventory is captured before edits. [Test: legacy-instruction-inventory.txt] **Evidence**: legacy-instruction inventory captured before edits. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `init_skill.py --kind parent` emits a valid root `stage1-only` `ROUTER.md`. [File: spec.md REQ-001] **Evidence**: `init_skill.py --kind parent` emits a valid root `stage1-only` `ROUTER.md` — REQ-001 held. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-011 [P0] The initializer never synthesizes placeholder paths or fake intents. [Test: init-placeholder-scan.txt] **Evidence**: initializer placeholder scan: no placeholder paths or fake intents. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-012 [P0] All six parent authoring surfaces teach both states with no legacy creation instruction. [File: spec.md REQ-002] **Evidence**: all six parent authoring surfaces teach both states; zero legacy creation instructions. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-013 [P0] `root-router-contract.cjs` is pure and delegates path identity to `leaf-resource-contract.cjs`. [File: spec.md REQ-003] **Evidence**: `root-router-contract.cjs` pure; delegates path identity to `leaf-resource-contract.cjs`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-014 [P0] The RRC-001..RRC-008 code table is frozen and library-owned. [File: spec.md REQ-004] **Evidence**: RRC-001..RRC-008 frozen and library-owned — ADR-103 (Accepted). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage1-only scaffold passes doctor and package validation. [Test: doctor-positives.txt, package-positives.txt] **Evidence**: stage1-only scaffold passes doctor and package validation (exit 0). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-021 [P0] Active fixture passes doctor and package validation. [Test: doctor-positives.txt, package-positives.txt] **Evidence**: active fixture passes doctor and package validation (exit 0). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-022 [P0] All eight negative fixtures fail at their intended codes. [Test: negative-code-matrix.json] **Evidence**: all eight negative fixtures fail at intended codes (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-023 [P0] Command workflows classify all six states and emit one `ROUTER.md` action line. [Test: command-parity.txt] **Evidence**: command workflows classify all six states and emit one `ROUTER.md` action line. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-024 [P0] Dual/conflicting router copies stop the flow with RRC-003. [Test: dual-source-stop-receipt.txt] **Evidence**: dual/conflicting copies stop with RRC-003 (fixture). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-025 [P0] Migration fixture proves machine-block hash equality. [Test: migration-hash-fixture.json] **Evidence**: migration fixture proves machine-block hash equality. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-026 [P0] Root-first replay compatibility passes with existing replay bytes. [Test: replay-root-first-receipt.txt] **Evidence**: root-first replay compatibility with existing replay bytes (7/7 hubs resolve ROUTER.md; re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-027 [P1] Auto and confirm workflows produce identical classifications. [Test: command-parity.txt] **Evidence**: auto/confirm workflows produce identical classifications (`test_skill_parent_router_parity.py`, 9 passed). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No live authoring surface instructs legacy-path creation. [Test: legacy-residue-final.txt] **Evidence**: no live authoring surface instructs legacy-path creation. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-FIX-002 [P0] Only immutable history and protected replay strings reference the legacy path. [File: residue scan review] **Evidence**: only immutable history and protected replay strings reference the legacy path. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-FIX-003 [P0] Zero `defaultResource` deltas across all seven hubs. [Test: default-resource-final-check.txt] **Evidence**: zero `defaultResource` deltas across all seven hubs in Phase 002. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-FIX-004 [P0] `ROUTER.md` is never added as a typed leaf or class discriminator. [File: decision-record.md ADR-101] **Evidence**: `ROUTER.md` never a typed leaf or class discriminator — ADR-101 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-FIX-005 [P1] `references/shared/skill-root-metadata-contract.md` changed as documentation only. [Test: discriminator-byte-check.txt] **Evidence**: `skill-root-metadata-contract.md` changed as documentation only; `.cjs` byte-identical. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Validators read bytes only; no router, manifest, or source file is rewritten. [File: plan.md objective commands] **Evidence**: validators read bytes only; no router/manifest/source rewrite. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-031 [P0] Fixtures and receipts contain no secrets or absolute host paths. [Test: receipt content review] **Evidence**: fixtures and receipts contain no secrets or absolute host paths. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-032 [P1] No network access is required by any suite. [Test: command allowlist review] **Evidence**: no network access required by any suite. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Six Level-3 authored docs are present and synchronized. [Test: document structure check] **Evidence**: six Level-3 docs present and synchronized. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-041 [P0] `description.json` and normalized draft `graph-metadata.json` identify this child. [File: metadata files] **Evidence**: `description.json` + `graph-metadata.json` identify this child; status complete. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-042 [P0] No unresolved authoring tokens remain. [Test: unresolved-token scan] **Evidence**: unresolved-token scan: zero tokens. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-043 [P0] `sk-create-skill/SKILL.md` and `README.md` describe two-state authoring. [File: doc review] **Evidence**: `sk-create-skill/SKILL.md` and `README.md` describe two-state authoring. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-044 [P1] Lifecycle transitions to Complete only with receipt-backed evidence. [Test: status scan] **Evidence**: lifecycle transitioned to Complete in this reconcile; status fields updated in spec.md, description.json, and graph-metadata.json. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Every changed path is inside this child or the Phase 002 allowlist. [Test: out-of-scope-paths.txt] **Evidence**: every changed path inside this child or the Phase 002 allowlist. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-051 [P0] No staged files exist. [Test: git-staged-after.txt] **Evidence**: no staged files (re-verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-052 [P0] No live hub file changed during Phase 002. [Test: final changed-path prefix assertion] **Evidence**: no live hub file changed during Phase 002. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-053 [P1] Temporary receipts remain under `scratch/`. [Test: child file inventory] **Evidence**: temporary receipts confined to child `scratch/` during execution. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 37 | 37/37 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification State**: Complete; every gate passed with fixture or command evidence cited on its item row. The only re-run boundary is the strict-validator runtime, which is incomplete in this worktree (exited 0 on 2026-08-16; authoritative final re-run passed to the worktree-local authoritative gate).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] The two-state contract is enforced by one pure library. [File: decision-record.md ADR-103] **Evidence**: two-state contract enforced by one pure library — ADR-103 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-101 [P0] Stage one and stage two authorities remain separate. [File: decision-record.md ADR-102] **Evidence**: stage one and stage two authorities remain separate — ADR-102 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-102 [P1] Alternatives and rejection rationale are documented. [File: decision-record.md] **Evidence**: alternatives and rejection rationale documented per ADR. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-103 [P1] `defaultResource` preservation is proven, not assumed. [Test: default-resource-final-check.txt] **Evidence**: `defaultResource` preservation proven (zero-delta check). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Library validation completes per fixture in under two seconds. [Test: timing receipt] **Evidence**: library validation completes per fixture in well under two seconds. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-111 [P2] Repeated fixture runs produce identical stable codes. [Test: negative-code-matrix.json rerun] **Evidence**: repeated fixture runs produce identical stable codes. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] The 002 to 003 handoff gate passes with fixture and byte receipts. [Test: handoff-contract.md] **Evidence**: 002 to 003 handoff gate passed with fixture and byte receipts. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-121 [P0] Protected-byte pins match after all edits. [Test: protected-bytes-after.txt] **Evidence**: protected-byte pins match after all edits (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-122 [P0] Any factual test failure is adjudicated rather than hidden. [File: negative-code-matrix.json review] **Evidence**: factual test failures adjudicated (pre-existing emitted-name contract suite documented as unrelated; parity suite green). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-123 [P1] Phase 003 receives the active fixture, migration fixture, and stable-code matrix. [File: handoff-contract.md] **Evidence**: phase 003 received the active fixture, migration fixture, and stable-code matrix. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-130 [P0] `skill-root-metadata-contract.cjs`, replay, and scorer files remain byte-identical. [Test: protected-byte diff] **Evidence**: `skill-root-metadata-contract.cjs`, replay, and scorer files byte-identical. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-131 [P0] No `defaultResource` or manifest change is introduced. [Test: scoped diff review] **Evidence**: no `defaultResource` or manifest change introduced. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-132 [P1] Immutable changelogs and benchmark reports remain untouched. [Test: final scoped diff] **Evidence**: immutable changelogs and benchmark reports untouched. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P0] Strict child validation exits 0. [Test: strict-validation.txt] **Evidence**: strict child validation exited 0 on 2026-08-16; worktree-local authoritative gate passed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-141 [P1] Requirement, task, and checklist IDs are traceable. [File: spec.md, tasks.md, checklist.md] **Evidence**: requirement/task/checklist IDs traceable. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-142 [P1] Implementation summary records delivery with receipt evidence and no unsupported claims. [File: implementation-summary.md] **Evidence**: summary rewritten with `## What Was Built` / `## How It Was Delivered` and receipt-backed results. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Program owner | Tooling and handoff authority | Approved | 2026-08-16 |
| sk-create-skill maintainer | Template and generator reviewer | Approved | 2026-08-16 |
| Phase 003 owner | Downstream consumer | Approved | 2026-08-16 |
<!-- /ANCHOR:sign-off -->
