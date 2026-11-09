---
title: "Implementation Plan: Phase 17: over-engineering-cuts"
description: "Delete the unread branch-leases-waves module and two unread palette sheets, keep the importers compiling, and refresh every doc, manifest and fixture that names them."
trigger_phrases:
  - "over engineering cuts plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: over-engineering-cuts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime, HTML assets, JSON manifests and fixtures |
| **Framework** | system-deep-loop runtime, sk-design chart, sk-doc and spec-kit fixture generators |
| **Storage** | Tracked files only |
| **Testing** | deep-loop typecheck and vitest, sk-design package and parent checks, sk-doc python tests, spec-kit retrieval vitest |

### Overview
A repository scan gates each deletion; the importers get local types; generators refresh the fixtures that name the deleted paths.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Deep-loop vitest at 2884 minus the 18 deleted tests, typecheck clean, sk-design, sk-doc and retrieval checks green
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scan, delete, then refresh what is derived.

### Key Components
- **`mode-contracts/substrate-ports.ts`, `conditional-fanin/types.ts`**: the only importers, both type-only.
- **`sk-design/leaf-manifest.json`**: lists every leaf the hub serves.
- **Fixture generators**: `test_readme_manifest.py --write`, `test_readme_verdict_parity.py --write`, `generate-trigger-index.mjs`.

### Data Flow
N/A: no runtime path reads the removed files.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `branch-leases-waves` and suite | Unread module | delete | typecheck, runtime suite |
| Two importers | Type imports | local types | typecheck |
| system-deep-loop READMEs, ARCHITECTURE.md | Name the module | update | `rg` prints nothing |
| Ordered and categorical palette sheets, screenshots | Unread assets | delete | `rg` prints nothing |
| `sk-design/leaf-manifest.json` | Lists them | update | package and parent checks |
| sk-doc code-folder fixtures, spec-kit retrieval fixtures | Name the paths | regenerate | their tests |

Required inventories:
- Importers: `rg -n "branch-leases-waves|palette-sheet-ordered|palette-sheet-categorical|source-globals" --glob '!specs/**' --glob '!**/node_modules/**' .`
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup baselines every check that reads the tree. Two DeepSeek workers delete the module and the assets. The orchestrator regenerates the fixtures, reviews the diff and reruns the checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deep-loop runtime suite and typecheck | vitest, tsc |
| Integration | sk-design package and parent checks; sk-doc fixture tests; retrieval tests | python, node, vitest |
| Manual | `rg` negative control for each deleted name | rg |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex `gpt-6-luna` high fast | External | Quota exhausted | Writes on DeepSeek, review by the orchestrator |
| cli-pi `opencode-go/deepseek-v4.1-flash` max | External | Green | Only model reachable after GPT quota ran out |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Something turns out to read a deleted file.
- **Procedure**: `git revert` the phase commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 006 and 007 committed | Implementation |
| Implementation | Baseline recorded | Verification |
| Verification | Implementation and review | None |
<!-- /ANCHOR:phase-deps -->

---
