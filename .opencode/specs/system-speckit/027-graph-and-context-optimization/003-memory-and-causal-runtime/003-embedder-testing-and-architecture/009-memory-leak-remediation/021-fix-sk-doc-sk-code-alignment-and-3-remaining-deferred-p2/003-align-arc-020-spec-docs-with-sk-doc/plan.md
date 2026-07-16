---
title: "Plan: Arc 020 Spec Docs sk-doc Alignment"
description: "Implementation plan for the final arc 021 sk-doc structure sweep across arc 020 docs and selected skill surfaces."
trigger_phrases:
  - "021 003 plan"
  - "arc 020 sk-doc sweep plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc"
    last_updated_at: "2026-05-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed sk-doc sweep and strict validation"
    next_safe_action: "Review and commit documentation-only packet if desired"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0210030210030210030210030210030210030210030210030210030210030210"
      session_id: "021-003-sk-doc-arc-020-spec-sweep"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Arc 020 Spec Docs sk-doc Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
This packet is documentation-only. It audits closed arc 020 child packet docs and selected runtime skill surfaces for sk-doc structure and evergreen citation rules.

### Overview
Scaffold and validate the packet, enumerate arc 020 child markdown docs, run targeted drift scans, patch only actual drift, write a CSV tally, then run strict validation for every arc 020 child, this packet, and the arc 021 parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- User pre-approved the Level 2 spec folder.
- Target paths are limited to this packet, arc 020 child docs with drift, and the seven skill surfaces with drift.
- sk-doc and system-spec-kit instructions are loaded.

### Definition of Done
- Tally CSV records every audited arc 020 child doc.
- Any fixes are mechanical documentation fixes only.
- Checklist, ADR, implementation summary, and metadata are synchronized.
- Strict validation exits 0 for all requested packet folders.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use scanner-backed documentation normalization. The scanner identifies drift categories, and edits are limited to those categories.

### Key Components
- Arc 020 child packet markdown docs.
- `system-rerank-sidecar` runtime documentation surfaces.
- Five skill-local `doctor.sh` scripts.
- Spec-kit `validate.sh` strict validation.

### Data Flow
Read-only audit output feeds minimal patches and the packet-local tally. Validation output feeds checklist and implementation-summary evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Risk | Guard |
|---------|------|-------|
| Arc 020 child docs | Medium | H2-only or field-fill fixes, then strict child validation |
| Runtime skill docs | Medium | Evergreen packet-ID grep before any edit |
| Doctor scripts | Low | Header/shebang/set-option check only |
| Packet docs | Low | Strict scaffold and final validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Create the 021/003 Level 2 packet from the 021/002 sibling shape.
- Fill packet metadata for the sk-doc sweep.
- Run strict scaffold validation.

### Phase 2: Arc 020 Sweep
- Enumerate arc 020 child markdown docs.
- Check H2 casing, ADR evidence rows, continuity fields, anchors, and citation freshness.
- Apply minimal fixes where drift is found.
- Emit `scratch/sk-doc-sweep-tally.csv`.

### Phase 3: Skill-Surface Sweep
- Check rerank sidecar `SKILL.md` and `README.md` for current-state mutable packet IDs.
- Check five `doctor.sh` scripts for bash shebang, `set -euo pipefail`, and `COMPONENT:` header.
- Patch only actual drift.

### Phase 4: Verification
- Validate every arc 020 child packet strictly.
- Validate this packet strictly.
- Validate the arc 021 parent strictly.
- Fill checklist, ADR, implementation summary, and handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Layer | Coverage |
|-------|----------|
| Structure scan | H2 case, ADR evidence, continuity fields, and selected evergreen patterns |
| Skill-surface audit | Packet-ID grep and doctor shell header rules |
| Spec validation | Six arc 020 children, this packet, and arc 021 parent with `--strict` |
| Diff review | Confirm no logic files or executable shell behavior changed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Use |
|------------|-----|
| `sk-doc` quick reference | H2 and evergreen packet-ID rules |
| `system-spec-kit` validation rules | Strict packet validation |
| Arc 021/002 sibling | Packet scaffold shape |
| Arc 020 child packets | Sweep target set |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the packet docs and any drift-fixed documentation files. If validation regresses on an arc 020 child after a fix, revert that file and record a DEFERRED note rather than expanding scope.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Exit Criteria |
|-------|------------|---------------|
| Setup | User pre-approved folder | Strict scaffold validation exits 0 |
| Arc 020 sweep | Setup | Tally CSV written and drift fixes applied |
| Skill-surface sweep | Setup | Seven surfaces audited and any drift fixed |
| Verification | Sweeps | Requested strict validations exit 0 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Scaffold | Small | Sibling packet provides Level 2 shape |
| Arc 020 sweep | Medium | Multiple packet docs and strict validation |
| Skill-surface sweep | Small | Seven files with targeted checks |
| Verification/docs | Medium | Checklist, ADR, implementation summary, and parent validation |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- Confirm touched files are inside approved scope.
- Confirm no logic files changed.

### Rollback Procedure
- Revert packet-local docs and any documentation-only drift fixes.
- Re-run strict validation on affected packets.

### Data Reversal
No persistent data migration is involved.
<!-- /ANCHOR:enhanced-rollback -->
