---
title: "Implementation Plan: Phase 4: continuity-single-source"
description: "Consolidate the duplicated continuity block at the template and validator layers while preserving the existing runtime single-source path. Relax validators first, verify the real save behavior, then remove only the four non-canonical template emissions."
trigger_phrases:
  - "continuity single source plan"
  - "FRONTMATTER_MEMORY_BLOCK validator"
  - "SESSION_LINEAGE scope"
  - "resume ladder continuity"
importance_tier: "important"
contextType: "general"
---
# Implementation Plan: Phase 4: continuity-single-source

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Markdown templates, YAML frontmatter, Bash, and Node.js |
| **Framework** | system-spec-kit validation, resume, and scaffold contracts |
| **Storage** | Specification packet frontmatter and template sources; no new storage |
| **Testing** | Strict validation, real save inspection, status comparison, and targeted regression checks |

### Overview
The continuity save path is already single-source by design: `implementation-summary.md` is the continuity source read by the resume ladder, status derivation, and freshness gate. This phase removes the repeated continuity block at the template and documentation layers, after relaxing validators and confirming that a real save writes only the canonical source.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The spec names the roughly 80 duplicated lines, the validator order constraint, and the canonical implementation-summary source.
- [x] The validator, resume, save, and template paths are identified.
- [x] The four requirements have measurable acceptance criteria.

### Definition of Done
- [ ] `FRONTMATTER_MEMORY_BLOCK` and `SESSION_LINEAGE` accept the canonical continuity model before template emissions change.
- [ ] The real save behavior matches the single-source design, with no runtime arbitration change.
- [ ] The four redundant template emissions are removed and representative strict validation has no new failure.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validator-first contract relaxation followed by template-level deduplication. Runtime consumers remain unchanged.

### Key Components
- **Continuity validator**: `.opencode/skills/system-spec-kit/mcp-server/lib/validation/spec-doc-structure.ts` changes `FRONTMATTER_MEMORY_BLOCK` to recognize `implementation-summary.md` as the canonical host.
- **Cross-document validator**: `.opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts` reviews `SESSION_LINEAGE` without requiring stale copies in non-canonical documents.
- **Non-canonical templates**: `.opencode/skills/system-spec-kit/templates/{spec,plan,tasks,checklist}.md.tmpl` stop emitting `_memory.continuity`.
- **Unchanged consumers**: `.opencode/skills/system-spec-kit/mcp-server/lib/resume/resume-ladder.ts`, `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts`, and `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` continue to use the canonical implementation-summary path.

### Data Flow
The validators change first and pass against a shipped packet that still has five continuity copies. A real save then confirms the write behavior. The four non-canonical templates lose their repeated block, while the implementation-summary template remains the only canonical emitter. Strict validation and consumer checks prove that runtime behavior stays unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory `FRONTMATTER_MEMORY_BLOCK`, `SESSION_LINEAGE`, `resume-ladder.ts`, `graph-metadata-parser.ts`, and `generate-context.ts` before editing.
- [ ] Capture the shipped five-copy strict-validation case and confirm the real save output before removing any template block.

### Phase 2: Core Implementation
- [ ] Relax the continuity requirement in `spec-doc-structure.ts` first, then rescope the session-lineage scan in `orchestrator.ts`.
- [ ] Prove the validator changes against the old five-copy packet before editing templates.
- [ ] Remove `_memory.continuity` from the four non-canonical manifest templates and retain it in `implementation-summary.md.tmpl`.

### Phase 3: Verification
- [ ] Confirm the resume ladder, `deriveStatus`, and continuity freshness gate still use implementation-summary without behavior changes.
- [ ] Run representative strict validation across shipped levels and check for new `FRONTMATTER_MEMORY_BLOCK` or `SESSION_LINEAGE` failures.
- [ ] Record the real-save result and the validator-first evidence in the phase acceptance record.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator contract | Canonical continuity host, old five-copy compatibility, and session-lineage scope | Targeted rule checks and `validate.sh --strict` |
| Save behavior | Whether a real save rewrites continuity in multiple documents or only implementation-summary | `generate-context.js` and direct packet inspection |
| Consumer compatibility | Resume ladder, `deriveStatus`, and freshness source selection | Source inspection and before/after status checks |
| Fleet regression | Representative shipped L1/L2/L3 packets | `.opencode/skills/system-spec-kit/scripts/spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec-doc-structure.ts` continuity rule | Internal validator contract | Green | Templates cannot drop copies safely |
| `orchestrator.ts` session-lineage scan | Internal validator contract | Yellow | Strict validation may reject canonical-only packets |
| `resume-ladder.ts` and `graph-metadata-parser.ts` | Runtime consumers | Green | Continuity behavior could change |
| `generate-context.ts` and compiled save entry point | Save path | Yellow | REQ-004 remains unconfirmed |
| Four non-canonical manifest templates | Template sources | Green | Redundant continuity bytes remain |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A strict-validation failure, a new fleet validator failure, or any change in resume, status, freshness, or save behavior.
- **Procedure**:
  1. Restore the prior validator, orchestrator, and template sources as one phase change set.
  2. Restore the five-copy template behavior and rebuild the compiled runtime surfaces used by validation.
  3. Re-run the shipped-packet strict-validation and consumer checks before reopening the consolidation.
<!-- /ANCHOR:rollback -->
