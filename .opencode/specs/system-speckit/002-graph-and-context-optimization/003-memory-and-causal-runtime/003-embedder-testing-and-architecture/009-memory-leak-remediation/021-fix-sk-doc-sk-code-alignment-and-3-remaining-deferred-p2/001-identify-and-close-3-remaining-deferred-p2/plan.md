---
title: "Plan: Identify and Close 3 Remaining Deferred P2 Findings"
description: "Implementation plan for reconciling the original 68 P2 findings, identifying the 3 still-deferred IDs, and closing or ADR-deferring them."
trigger_phrases:
  - "021 001 plan"
  - "remaining deferred p2 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/001-identify-and-close-3-remaining-deferred-p2"
    last_updated_at: "2026-05-23T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded closure plan"
    next_safe_action: "Validate scaffold, sweep P2 checklist closure, then edit code only after 65+3 reconciliation"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/015-deep-research-drift-and-simplification/research/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0210010210010210010210010210010210010210010210010210010210010210"
      session_id: "021-001-identify-close-remaining-p2"
      parent_session_id: null
    completion_pct: 10
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Identify and Close 3 Remaining Deferred P2 Findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
This packet is the final cleanup pass for the P2 findings originally registered in arc 015. The primary constraint is sequencing: source files must remain untouched until the checklist sweep proves exactly 68 P2 findings split into 65 CLOSED and 3 DEFERRED.

### Overview
First scaffold and validate the Level 2 packet. Then parse the 015 registry, sweep every required child checklist for closure evidence, emit `scratch/p2-closure-tally.csv`, and proceed only if the math reconciles. The three identified findings are then closed in their owning implementation/test files or documented as DEFERRED-AGAIN with explicit ADRs and consumer evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Packet folder contains canonical Level 2 docs and metadata.
- Strict validation passes before source edits.
- P2 registry and every required child checklist path are readable.
- The 68-row tally reconciles to 65 CLOSED and 3 DEFERRED.

### Definition of Done
- `scratch/p2-closure-tally.csv` exists with `id,severity,status,last-mention-path,last-mention-line,fingerprint-from-registry`.
- Each of the 3 identified findings is CLOSED or DEFERRED-AGAIN.
- `decision-record.md` has at least one ADR per identified finding.
- Requested pytest, vitest, typecheck, and strict spec validation commands exit 0, except any explicitly documented DEFERRED-AGAIN halt.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use an evidence-first reconciliation pass before implementation. Treat historical checklist rows as frozen audit inputs, and write new evidence only in this packet.

### Key Components
- 015 `findings-registry.json` as the source list of P2 IDs and fingerprints.
- Child packet `checklist.md` files from arcs 016, 017, 018, 019, and 020 as closure evidence.
- Python launcher twin `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` for JS/Python parity findings, if identified.
- Embedder barrel exports under `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/index.ts`, if one zero-importer export remains.

### Data Flow
Registry P2 rows feed the tally script. Each ID is matched against child checklists and classified as CLOSED if a checked closure marker mentions the ID; otherwise DEFERRED. The implementation phase consumes only the three DEFERRED rows from that reconciled CSV.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Risk | Guard |
|---------|------|-------|
| P2 reconciliation CSV | Medium | Halt if 68 != 65 CLOSED + 3 DEFERRED |
| Python sidecar launcher twin | Medium | Port only JS-hardening parity already accepted in predecessor ADRs |
| Embedder barrel exports | Medium | Remove only when `rg` proves no live consumer |
| Packet docs | Low | Keep edits inside the 021/001 leaf packet |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Scaffold Level 2 docs and metadata.
- Run strict validation before code edits.
- Read registry and required child checklists.

### Phase 2: Core Implementation
- Emit and inspect the P2 closure tally.
- Halt with `scratch/reconciliation-error.md` if the math does not reconcile.
- Close parity drift findings by porting JS hardening to the Python twin and adding pytest parity fixtures.
- Close zero-importer barrel findings only after consumer grep proves no live production consumer.

### Phase 3: Verification
- Run requested pytest, embedders vitest, bin vitest, mcp-server typecheck, and strict packet validation.
- Fill checklist evidence, ADRs, implementation summary, and commit handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Coverage |
|-------|----------|
| Reconciliation | CSV has 68 P2 rows and totals 65 CLOSED + 3 DEFERRED |
| Python parity | Pytest fixtures assert Python launcher hardening matches JS behavior where findings require it |
| Barrel export | Vitest/typecheck cover any changed embedder export surface if a zero-importer finding is closed |
| Regression suites | Requested pytest, vitest, and typecheck commands exit 0 |
| Spec validation | `validate.sh <spec-folder> --strict` exits 0 before and after implementation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Use |
|------------|-----|
| 015 findings registry | Source of the 68 P2 IDs and fingerprints |
| Arc 016-020 child checklists | Closure evidence sweep inputs |
| Arc 020/001 Bucket 6 ADR | Pattern for zero-importer barrel export removal |
| Arc 020/003 ADRs | Filesystem durability baseline for JS launcher hardening |
| Arc 010 F69/F101/F102 ADRs | JS/Python parity precedent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only this packet's docs/scratch files and any source/test files actually changed to close the three identified findings. Do not modify frozen arc 010/016/017/018/019/020 packet docs during rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Exit Criteria |
|-------|------------|---------------|
| Setup | Existing `spec.md` | Strict validate exit 0 |
| Sweep | Setup | CSV totals 68 rows, 65 CLOSED, 3 DEFERRED |
| Closure | Sweep | Each deferred finding has code closure or DEFERRED-AGAIN ADR |
| Verification | Closure | Requested commands and final strict validation exit 0 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Scaffold and validation | Small | Existing sibling packet provides canonical shape |
| Registry/checklist sweep | Medium | Many child checklists, but deterministic matching |
| Parity closure | Medium | Likely Python launcher and pytest fixture |
| Barrel export closure | Small | Only if consumer grep proves zero live callers |
| Verification/docs | Medium | Full requested suite plus packet evidence |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm code edits did not start before the CSV reconciliation passed.
- Confirm changed files are limited to this packet plus closure-owned implementation/test files.

### Rollback Procedure
- Revert scoped implementation/test edits.
- Keep or regenerate the tally as audit evidence if reconciliation remains valid.

### Data Reversal
No persistent data migration is involved.
<!-- /ANCHOR:enhanced-rollback -->
