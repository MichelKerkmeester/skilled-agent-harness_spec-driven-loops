---
title: "Implementation Plan: Phase 009 — Apply plugin-docs research recommendations"
description: "Apply the seven 006 synthesis edit tables to the shipped mcp-obsidian docs, P0 first, verifying each correctness-critical row against the installed plugin main.js, then validate every changed doc."
trigger_phrases:
  - "015 apply plugin doc recs plan"
  - "mcp-obsidian docs remediation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/009-apply-plugin-doc-recs"
    last_updated_at: "2026-08-22T18:35:00Z"
    last_updated_by: "claude"
    recent_action: "Applied deferred notion-bases dataview and claudian P1 and P2 content"
    next_safe_action: "None — optional advanced-config split and version bumps remain deferred"
    blockers: []
    key_files:
      - "spec.md"
      - "../006-plugin-docs-deep-research/006-meta-bind/synthesis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-009-apply-plugin-doc-recs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 009 — Apply plugin-docs research recommendations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference + feature-catalog docs under `mcp-obsidian` |
| **Framework** | Seven 006 `synthesis.md` prioritized edit tables (target file · anchor · change · evidence) |
| **Storage** | Edits to shipped skill docs; read-only plugin `main.js` in the operator's vault for verification |
| **Testing** | `validate_document.py --type reference/feature_catalog` per changed doc; `validate.sh --strict` on this phase folder |

### Overview
Apply each synthesis edit table to the shipped docs in priority order (P0 → P1 → P2), plugin by plugin. Before applying any flagged correctness row, confirm it against the installed plugin `main.js`; if `main.js` contradicts a synthesis claim, trust `main.js` and record the correction. Validate every changed doc, then author this phase package to the actual result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All seven 006 `synthesis.md` files read in full
- [x] Installed plugin bundles located and readable (meta-bind, js-engine, notion-bases, realclaudian)
- [x] Scope lock understood — only `mcp-obsidian/` shipped docs + this phase folder are writable

### Definition of Done
- [x] Every P0 correctness row applied across all five active plugins (project-manager no-op)
- [x] Each correctness-critical row confirmed against `main.js`; contradictions (none) would trust `main.js`
- [x] Every changed shipped doc passes `validate_document.py` (0 issues)
- [x] Remaining P1/P2 content (notion-bases P1×8, dataview P1×15/P2×3, full claudian schema/validation) applied per the operator's "apply ALL" decision; only the 2 SKIP-by-instruction dataview VERIFY rows and optional notion-bases split/version bumps deferred
- [x] `validate.sh <this-folder> --strict` = Errors:0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Priority-ordered documentation application: read synthesis table → verify correctness-critical rows against `main.js` → apply edits as coherent sets (VERIFY-lift across five files; wrong-key fix across three files; one merged meta-bind/js-engine recipe) → validate.

### Key Components
- **main.js verification** — grep the installed bundles for each flagged fact before applying (evaluate handling, js file base, execution-context object, getPlugin, processFrontMatter-absence, notion-bases keys + marker, claudian settings path).
- **Coherent-set application** — the advanced-canvas VERIFY-lift touches five files; the notion-bases key fix repeats across data-model/workflows/troubleshooting/index/catalog; the meta-bind `=now()` fix repeats across four files — each applied as a set so the docs stay internally consistent.
- **Cross-leg reconciliation** — 006 (meta-bind) and 007 (js-engine) both edit the meta-bind tree; merged into one `§6 JS Engine companion` recipe presenting both the Meta Bind `engine.getPlugin(...).api` and Obsidian-core `app.fileManager.processFrontMatter` write paths with a when-to-use.

### Data Flow
synthesis table → main.js confirm → Edit shipped doc → `validate_document.py` → author this phase package to the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches exactly two surfaces: the shipped docs under `.opencode/skills/mcp-tooling/mcp-obsidian/` (five plugin reference trees + four feature-catalog cards) and this phase folder. The deep-loop runtime, the 006 research trees, and any concurrent-session lane are never written. The operator's iCloud-synced vault is read-only — only plugin `main.js`/`manifest.json` were read for verification.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup & verification
- [x] Read all seven 006 `synthesis.md` edit tables
- [x] Locate + confirm installed plugin manifests/versions (meta-bind 1.5.1, js-engine 0.3.6, notion-bases 1.12.0, realclaudian 2.2.4)
- [x] Grep each installed `main.js` for the flagged correctness facts

### Phase 2: Apply P0 correctness (all plugins)
- [x] advanced-canvas VERIFY-lift + collapsedData/zIndex set (5 files)
- [x] notion-bases wrong→correct keys + mandatory marker (5 files)
- [x] meta-bind `=now()` fix + resolved-VERIFY framing (5 files)
- [x] js-engine execution-context + frontmatter recipe, merged into the meta-bind tree
- [x] claudian mcp.json delete-not-write + `.claude/`→`.claudian/` paths (5 files)
- [x] dataview inline-field + DQL-order corrections (3 files)

### Phase 3: Apply P1/P2 where in budget
- [x] advanced-canvas P1/P2 (interdimensional recipe, z-order section, ratio/id/fromEnd/styleAttributes-null)
- [x] meta-bind P1/P2 (js signature, ObsAPI coupling, enable-JS prereq, input types, bind-target `memory^`, mathjs VIEW, action/actions)
- [x] notion-bases key P2s (marker, VERIFY-removal, silent-ignore troubleshooting)
- [x] notion-bases P1×8 (§7 advanced schema keys) + P2-4/5/6 troubleshooting
- [x] dataview P1×15 / P2×3 (DataviewJS API, type inference, DQL grammar, null-comparison trap, silent-render) — 2 VERIFY rows skipped per instruction
- [x] full claudian schema/validation (P1-7 §4a, P1-9 §2, P1-10 §3, P1-11 §4c, P2-12 §4b), confirmed against v2.2.4 `main.js`
- [x] 007 successor lineage fields repointed to 009 + 007 metadata refreshed

### Phase 4: Verification
- [x] `validate_document.py` on every changed shipped doc — 0 issues
- [x] Author this phase package to the actual result
- [x] `validate.sh <this-folder> --strict` = Errors:0
- [x] `git status` scoped to `mcp-obsidian/` + this phase folder only
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Every changed reference/catalog doc | `validate_document.py --type reference/feature_catalog` |
| Correctness | Each flagged row vs. the installed bundle | grep the plugin `main.js` before applying |
| Packet | This phase folder | `validate.sh <folder> --strict` |
| Scope containment | No write outside the two allowed surfaces | `git status --short` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Seven 006 synthesis edit tables | Internal | Green | No source of edits |
| Installed plugin bundles | External (vault) | Green (read-only) | Correctness rows can't be verified |
| `validate_document.py` / `validate.sh` | Internal | Green | No completion gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a shipped-doc edit is found wrong on review.
- **Procedure**: `git checkout -- <changed mcp-obsidian doc>` for the affected file; edits are contained to `mcp-obsidian/` and reversible with no runtime impact.
- **Data reversal**: none — documentation-only, no migrations, no vault writes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup+verify) ──> Phase 2 (P0) ──> Phase 3 (P1/P2) ──> Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup+verify | None | P0 |
| P0 | Setup+verify | P1/P2 |
| P1/P2 | P0 | Verify |
| Verify | P1/P2 | Completion |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + main.js verification | Medium | 45 minutes |
| P0 application (5 plugins) | High | 3-4 hours |
| P1/P2 (advanced-canvas + meta-bind full) | Medium | 1.5 hours |
| Verification + phase package | Low-Med | 45 minutes |
| **Total** | | **~6-7 hours** |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every correctness-critical row has a confirming `main.js` observation
- [x] No authored code fence embeds spec paths / rec-ids (comment hygiene)

### Rollback Procedure
1. `git checkout -- <changed file>` for any doc found wrong
2. Re-run `validate_document.py` on the reverted file
3. No vault or runtime state to reverse — documentation-only

### Data Reversal
- **Has data migrations?** No. Documentation-only; the vault was read-only.
<!-- /ANCHOR:l2-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
