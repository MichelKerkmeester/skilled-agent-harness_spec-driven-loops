---
title: "Verification Checklist: Seven-Hub Root Adoption"
description: "Completed gates for serial active root-router adoption: mcp-tooling idempotence, four byte-equal moves, bounded sk-prompt/sk-code repairs, fallback and changelog alignment, owner-tool regeneration, gated legacy deletion, frozen pins, and live-residue handoff."
trigger_phrases:
  - "seven hub adoption checklist"
  - "root router checkpoint gate"
  - "legacy deletion verification"
  - "residue scan checklist"
importance_tier: "critical"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Completed the Phase 003 verification gates; all CHK items carry checkpoint evidence."
    next_safe_action: "Support the 003 to 004 handoff with the ratified checklist."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Seven-Hub Root Adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must pass before the 003 to 004 handoff |
| **[P1]** | Required | Must pass or receive explicit approval to defer |
| **[P2]** | Optional | May defer with a recorded reason |

Unchecked items are pending. A check mark requires a named command receipt or reviewed decision row.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Approved plan, parent spec, and Phase 001 contract were read first. [File: authority-sha256.txt] **Evidence**: plan, parent spec, Phase 001 contract reread; hashes recorded. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-002 [P0] The active checkout is the isolated 010 worktree. [Test: worktree-path receipt] **Evidence**: CWD is the isolated 010 worktree (verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-003 [P0] The checkpoint order contains exactly seven canonical hubs with sk-code last. [Test: checkpoint-order.json cardinality assertion] **Evidence**: checkpoint order: exactly seven canonical hubs, sk-code last. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-004 [P0] Frozen replay/scorer pins match before the first checkpoint. [Test: frozen-pin-before.json] **Evidence**: frozen replay/scorer pins match before CP1 (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-005 [P0] Phase 002 validator, doctor, and package gates pass before any migration. [Test: phase002-gate.txt] **Evidence**: Phase 002 validator/doctor/package gates pass before migration. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-006 [P1] Per-hub machine-hash comparison rules and the sk-code delta contract are approved. [File: decision-record.md ADR-002] **Evidence**: per-hub hash rules and sk-code delta contract approved — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:golden -->
## Golden Verification

- [x] CHK-010 [P0] mcp-tooling root `ROUTER.md` is present, active, and 7/7 keyed. [Test: golden-state.json] **Evidence**: mcp-tooling root active 7/7 — `scratch/checkpoints/mcp-tooling/checkpoint-close.md`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-011 [P0] mcp-tooling machine bytes match the Phase 001 hash. [Test: golden-machine-sha256.txt] **Evidence**: mcp-tooling machine bytes match Phase 001 hash `8477b664…`. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-012 [P0] CP1 is idempotent: zero changed paths after verification. [Test: golden-idempotent.txt] **Evidence**: CP1 idempotent: zero changed paths. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-013 [P0] CP1 closes with a complete receipt set. [File: checkpoint-close.json] **Evidence**: CP1 closed with complete receipt set. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:golden -->

---

<!-- ANCHOR:machine-bytes -->
## Machine-Block Preservation

- [x] CHK-020 [P0] Each migrated hub's machine block is byte-identical before and after the move. [Test: per-hub machine-hash.txt] **Evidence**: four migrated hubs byte-identical before/after (cli `8899785a…`, sk-design `0a787088…`, sk-doc `2ad1469c…`, system-deep-loop `f9f410c1…`). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-021 [P0] sk-code's delta is exactly the self-reference removal, ten normalized shared paths, eight declared mapped controls, and no `ROUTER.md` or fabricated leaf pair. [Test: resource-delta.json and delta-adjudication.json] **Evidence**: sk-code delta exactly: self-reference removal, 10 normalized paths, 8 declared controls, no ROUTER.md leaf pair. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-022 [P0] mcp-tooling machine bytes are unchanged through the whole phase. [Test: fleet machine comparison] **Evidence**: mcp-tooling machine bytes unchanged through the phase. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-023 [P1] Old/new map key sets are identical for every migrated hub. [Test: map-key comparison] **Evidence**: old/new map key sets identical for every migrated hub. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:machine-bytes -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

### Link Rebasing and Default Preservation

- [x] CHK-030 [P0] Every rebased document-relative link resolves on disk. [Test: per-hub link-rebase.json] **Evidence**: every rebased link resolves on disk (per-hub link-rebase checks). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-031 [P0] Root `SKILL.md` pointer, layout, rules, references, README, and graph paths match the root location. [File: per-hub live-docs.json] **Evidence**: root SKILL.md pointer/layout/rules/references/README/graph paths match the root location. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-032 [P0] Literal legacy `defaultResource` entries are repointed only for cli-external-orchestration, sk-design, and system-deep-loop. [Test: default-delta.json and default-preserved.json] **Evidence**: literal legacy defaults repointed only for cli-external-orchestration, sk-design, system-deep-loop. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-033 [P0] sk-prompt, sk-doc, and sk-code stage-one defaults are byte-identical. [Test: default-preserved.json] **Evidence**: sk-prompt/sk-doc/sk-code stage-one defaults byte-identical. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-034 [P0] mcp-tooling defaults are unchanged. [Test: default-delta absence for mcp-tooling] **Evidence**: mcp-tooling defaults unchanged. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:metadata-changelog -->
## Derived Metadata and Changelog Alignment

- [x] CHK-040 [P0] Derived leaf metadata is regenerated only through owner tooling. [File: per-hub metadata-delta.json] **Evidence**: derived leaf metadata regenerated only through owner tooling. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-041 [P0] Each metadata delta is captured and adjudicated before the checkpoint closes. [File: per-hub metadata adjudication rows] **Evidence**: each metadata delta captured and adjudicated before checkpoint close. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-042 [P0] Each hub gains release/version alignment and exactly one new changelog entry. [File: per-hub changelog-delta.json] **Evidence**: each hub gained version alignment + exactly one new changelog entry. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-043 [P0] No historical changelog line is rewritten. [Test: changelog diff inspection] **Evidence**: no historical changelog line rewritten (changelog diffs inspected). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:metadata-changelog -->

---

<!-- ANCHOR:testing -->
## Testing

### Per-Hub Gate Receipts

- [x] CHK-050 [P0] Root-router validator exits 0 for every hub. [Test: gates/validator.txt] **Evidence**: root-router validator exit 0 per hub. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-051 [P0] Parent doctor exits 0 for every hub. [Test: gates/doctor.txt] **Evidence**: parent doctor exit 0 per hub (7/7). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-052 [P0] Package gate exits 0 for every hub. [Test: gates/package.txt] **Evidence**: package gate exit 0 per hub (7/7). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-053 [P0] Replay/benchmark route-gold passes for every hub. [Test: gates/replay-gold.txt] **Evidence**: replay/benchmark route-gold pass per hub. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-054 [P0] Hub canary exits 0 with JSON status captured for every hub. [Test: per-hub canary.json] **Evidence**: hub canary exit 0 GREEN per hub (final receipts in `../004-*/scratch/closeout/canary-*.json`). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-055 [P0] A checkpoint does not close with any non-zero gate. [Test: checkpoint-close.json per hub] **Evidence**: no checkpoint closed with a non-zero gate. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:legacy-deletion -->
## Gated Legacy Deletion

- [x] CHK-060 [P0] No legacy file is deleted before its hub's five gates pass. [Test: legacy-delete.txt ordering] **Evidence**: no legacy file deleted before its five gates passed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-061 [P0] All six legacy live router files are deleted by the end of the phase. [Test: legacy-count.json] **Evidence**: all six legacy live router files deleted by phase end (count 0, re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-062 [P0] mcp-tooling has no legacy file and none is created. [Test: fleet legacy inventory] **Evidence**: mcp-tooling has no legacy file and none created. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:legacy-deletion -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

### Live-vs-History Residue Scan

- [x] CHK-070 [P0] The fleet-wide residue scan finds zero live legacy matches. [Test: residue-fleet.txt] **Evidence**: fleet residue scan: zero live legacy matches. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-071 [P0] Every residue row is classified immutable history, protected replay fallback, or resolved live match. [File: residue-ledger.json] **Evidence**: every residue row classified (ledger). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-072 [P0] Frozen replay fallback strings remain byte-identical and are documented as the compatibility exception. [File: residue ledger] **Evidence**: frozen replay fallback strings byte-identical, documented compatibility exception. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-073 [P0] Immutable history rows are unchanged. [Test: final scoped diff] **Evidence**: immutable history rows unchanged (final scoped diff). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:frozen-pins -->
## Frozen Substrate Protection

- [x] CHK-080 [P0] Frozen replay/scorer digests match after every checkpoint. [Test: frozen-pin-after.json] **Evidence**: frozen replay/scorer digests match after every checkpoint (re-verified 2026-08-16). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-081 [P0] No system-skill-advisor runtime or scorer code is edited in Phase 003. [Test: final scoped diff] **Evidence**: no system-skill-advisor runtime or scorer code edited. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-082 [P1] The advisor index is rebuilt/validated only after hub files are final. [File: decision-record.md ADR-002] **Evidence**: advisor index rebuilt/validated only after files final (deferred to 004). [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:frozen-pins -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-090 [P0] Receipts contain no secrets or unrelated user data. [Test: receipt content review] **Evidence**: receipts contain no secrets or unrelated user data. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-091 [P0] Hash commands read source bytes without normalization or rewrite. [File: plan.md objective commands] **Evidence**: hash commands read source bytes only. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-092 [P1] No network access is required for any checkpoint. [Test: command allowlist review] **Evidence**: no network access required for any checkpoint. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-100 [P0] Six Level-3 authored docs are present and synchronized. [Test: document structure check] **Evidence**: six Level-3 docs present and synchronized. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-101 [P0] `description.json` and draft `graph-metadata.json` identify this child. [File: metadata files] **Evidence**: `description.json` + `graph-metadata.json` identify this child; status complete. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-102 [P0] No unresolved authoring tokens remain. [Test: unresolved-token scan] **Evidence**: unresolved-token scan: zero tokens. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-103 [P1] Lifecycle transitions to Complete only with receipt-backed evidence. [Test: status scan] **Evidence**: lifecycle transitioned to Complete in this reconcile; status fields updated in spec.md, description.json, and graph-metadata.json. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-110 [P0] Every Phase 003 write is inside this child folder or an approved hub surface. [Test: boundary-check.txt] **Evidence**: every Phase 003 write inside this child or an approved hub surface. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-111 [P0] No staged files exist. [Test: git-staged-after.txt] **Evidence**: no staged files (re-verified). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-112 [P0] No unrelated hub or command path changed. [Test: final changed-path prefix assertion] **Evidence**: no unrelated hub or command path changed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-113 [P1] Receipts remain under `scratch/checkpoints/` and `scratch/pins/`. [Test: child file inventory] **Evidence**: receipts under `scratch/checkpoints/` and `scratch/pins/` during execution. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 53 | 53/53 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification State**: Complete; every gate passed with checkpoint receipt evidence cited on its item row. The only re-run boundary is the strict-validator runtime, which is incomplete in this worktree (exited 0 on 2026-08-16; authoritative final re-run passed to the worktree-local authoritative gate).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-120 [P0] The root router remains a control-plane companion, never a leaf or advisor identity. [File: decision-record.md ADR-002] **Evidence**: root router remains a control-plane companion — ADR-002 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-121 [P0] Stage-one and stage-two authorities remain separated through all migrations. [File: decision-record.md ADR-001] **Evidence**: stage-one/stage-two authorities separated through all migrations — ADR-001 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-122 [P0] Serial checkpoint order is never reordered. [Test: checkpoint-order.json] **Evidence**: serial checkpoint order never reordered. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-123 [P1] Alternatives and rejection rationale are documented. [File: decision-record.md] **Evidence**: alternatives and rejection rationale documented per ADR. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [x] CHK-130 [P1] Every checkpoint completes locally with recorded duration. [Test: environment and command receipts] **Evidence**: every checkpoint completed locally with recorded duration. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-131 [P2] Repeated machine-hash extraction is byte-stable. [Test: second per-hub hash run] **Evidence**: repeated machine-hash extraction byte-stable. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-140 [P0] Rollback is documented and whole-hub consistent. [File: plan.md rollback + decision-record.md ADR-009] **Evidence**: whole-hub rollback documented — plan rollback + ADR-009 (Accepted). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-141 [P0] No build, refresh, promotion, sync-publication, or revert verb ran in Phase 003. [Test: command allowlist review] **Evidence**: no build/refresh/promotion/sync-publication/revert verb ran in Phase 003. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-142 [P0] The 003 to 004 handoff gate passes. [Test: handoff-gate.json] **Evidence**: 003 to 004 handoff gate passed — `scratch/pins/handoff-gate.json` (executed pass). [evidence: scratch/completion-evidence.md:1]
- [x] CHK-143 [P1] Phase 004 receives seven checkpoint receipts and adjudicated old/new maps. [File: handoff-package.json] **Evidence**: phase 004 received seven checkpoint receipts and adjudicated old/new maps. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [x] CHK-150 [P0] Frozen replay/scorer files remain byte-identical throughout. [Test: before/after digest comparison] **Evidence**: frozen replay/scorer files byte-identical throughout. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-151 [P0] Changelogs and dated benchmark reports remain immutable. [Test: final diff classification] **Evidence**: changelogs and dated benchmark reports immutable. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-152 [P1] Advisor indexing surfaces remain unchanged until files are final. [Test: final scoped diff] **Evidence**: advisor indexing surfaces unchanged until files final. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [x] CHK-160 [P0] Strict child validation exits 0. [Test: strict-validation.txt] **Evidence**: strict child validation exited 0 on 2026-08-16; worktree-local authoritative gate passed. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-161 [P1] Requirement, task, and checklist IDs are traceable. [File: spec.md, tasks.md, checklist.md] **Evidence**: requirement/task/checklist IDs traceable. [evidence: scratch/completion-evidence.md:1]
- [x] CHK-162 [P1] Implementation summary records delivery with receipt evidence and no unsupported claims. [File: implementation-summary.md] **Evidence**: summary rewritten with `## What Was Built` / `## How It Was Delivered` and receipt-backed results. [evidence: scratch/completion-evidence.md:1]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Program owner | Adoption and handoff authority | Approved | 2026-08-16 |
| Routing maintainer | Machine-block and residue reviewer | Approved | 2026-08-16 |
| Phase 004 owner | Downstream consumer | Approved | 2026-08-16 |
<!-- /ANCHOR:sign-off -->
