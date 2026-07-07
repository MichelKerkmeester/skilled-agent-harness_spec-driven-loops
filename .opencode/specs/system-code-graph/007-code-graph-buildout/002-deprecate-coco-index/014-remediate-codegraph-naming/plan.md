---
title: "Implementation Plan: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming [template:level_2/plan.md]"
description: "Documentation-only remediation: surgically edit 11 system-code-graph docs to replace ccc-era handler/adapter/catalog/schema names with code-graph's real current names, remove links to deleted artifacts, and correct tree-sitter-vs-binary prose. Gated by a zero-ccc grep."
trigger_phrases:
  - "code-graph ccc residue plan"
  - "ccc doc cleanup plan"
  - "code-graph naming remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/002-deprecate-coco-index/014-remediate-codegraph-naming"
    last_updated_at: "2026-05-25T15:05:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored plan from verified residue map"
    next_safe_action: "Edit docs in dependency order (simple → structural)"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediate-codegraph-naming-001"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remove residual ccc references from system-code-graph docs and align doc names to code-graph's own current naming

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (system-code-graph skill) |
| **Framework** | Spec-kit doc conventions (feature_catalog, manual_testing_playbook, READMEs) |
| **Storage** | N/A (docs in git) |
| **Testing** | `rg -i ccc` grep gate + `validate.sh --strict` |

### Overview
Code-graph's source already uses its own clean names (`status.ts`/`scan.ts`/`verify.ts`, `code_graph_*` tools, tree-sitter engine, `lib/{ipc,shared,utils}/`); only the docs lag. This plan edits the 11 affected docs to match reality: rename `ccc-*.ts` → real handlers, drop links to deleted `lib/ccc/` / `07--ccc-integration/` / `ccc_bridge_integration.md` / `retired-search-path.ts`, replace dead `cccStatus` schema refs with the real `code-graph-tools.ts → handlers/*.ts` dispatch, fix ghost test names, and correct "local `ccc` binary" prose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (zero-ccc grep)
- [x] Dependencies identified (none — code already renamed)

### Definition of Done
- [ ] `rg -i ccc system-code-graph` (excl changelog + package-lock) == 0
- [ ] No doc links to deleted artifacts
- [ ] `validate.sh <packet> --strict` clean; spec/plan/tasks/checklist/summary reconciled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation alignment (post-refactor doc-sweep) — no architecture change.

### Key Components
- **Handler docs** (`handlers/README.md`, `README.md`, `tool_surface.md`): name the real `status.ts`/`scan.ts`/`verify.ts` + `code_graph_*` tools.
- **Catalog/playbook** (`feature_catalog.md`, `manual_testing_playbook.md`, `SKILL.md`): remove the deleted `07--ccc-integration/` section + `ccc_bridge_integration.md` cross-refs.
- **Shared/test docs** (`lib/shared/README.md`, `tests/README.md`, `tests/lib/README.md`, `tools/README.md`, `stress_test/.../README.md`): drop ghost `retired-search-path.ts` / ghost test names.

### Data Flow
Source tree (truth) → docs (aligned). Each doc reference is mapped to an existing file or a deletion before edit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from the 013 deep-review FAIL verdict (the code-graph doc-residue finding class).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/*.ts` (status/scan/verify) | Real handlers (producers) | unchanged (code already clean) | `ls handlers/` shows no `ccc-*.ts` |
| `code-graph-tools.ts` | Tool dispatch | unchanged | `rg code_graph_status` → `handleCodeGraphStatus` |
| The 11 docs | Consumers (describe the code) | update | `rg -i ccc` == 0 post-edit |
| Deleted: `lib/ccc/`, `07--ccc-integration/`, `ccc_bridge_integration.md`, `retired-search-path.ts` | n/a (gone) | remove all links | `ls`/`fd` confirm absence |

Required inventories (run pre-edit, done this session):
- Same-class refs: `rg -n -i ccc .opencode/skills/system-code-graph -g '*.md'` → 11 files mapped.
- Ghost files: `rg --files | rg 'retired-search|ccc'` → 0 (all such names are dead).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Residue fully enumerated + each replacement target verified against real tree
- [x] Spec folder created (Level 2, on main)

### Phase 2: Core Implementation (simple → structural)
- [ ] Simple name-swaps: `handlers/README.md`, `tool_surface.md`, `tools/README.md`, `lib/shared/README.md`, `tests/README.md`, `tests/lib/README.md`, `stress_test/.../README.md`
- [ ] Cross-ref removals: `README.md`, `SKILL.md`
- [ ] Structural section removal: `feature_catalog.md`, `manual_testing_playbook.md` (drop the `07--ccc-integration` section + ToC anchors)

### Phase 3: Verification
- [ ] `rg -i ccc` gate == 0
- [ ] No broken links to deleted files
- [ ] `validate.sh --strict`; reconcile packet docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep gate | Zero `ccc` in code-graph docs | `rg -i ccc` |
| Link check | No refs to deleted files | `rg` for `07--ccc-integration`/`ccc_bridge_integration`/`retired-search-path`/`lib/ccc` |
| Validate | Packet structural integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Code already renamed (013 confirmed) | Internal | Green | n/a — precondition met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A removed ref turns out to be live, or validate regresses.
- **Procedure**: `git checkout -- <doc>` for the affected file (changes are isolated per-doc, doc-only, no code).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup, done) ──► Phase 2 (Edit docs) ──► Phase 3 (Verify gate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Edit |
| Edit | Setup | Verify |
| Verify | Edit | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | done |
| Core Implementation | Low | ~30–45 min (11 docs, surgical) |
| Verification | Low | ~10 min |
| **Total** | | **~1 hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes (doc-only)
- [x] Changes isolated to `system-code-graph/` docs

### Rollback Procedure
1. `git checkout -- <doc>` for any regressed file.
2. Re-run `rg -i ccc` to confirm baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
