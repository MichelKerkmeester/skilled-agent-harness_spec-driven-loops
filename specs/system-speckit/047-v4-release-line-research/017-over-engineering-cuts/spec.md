---
title: "Feature Specification: Phase 17: over-engineering-cuts"
description: "A 3,165-line deep-loop module ships with no runtime importer, and two chart palette sheets ship with no reader. This phase removes the verified dead weight and keeps every check that reads the tree green."
trigger_phrases:
  - "over engineering cuts"
  - "phase 17 over engineering cuts"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: over-engineering-cuts

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 17 |
| **Predecessor** | 016-authoring-hub-manifests-and-drift |
| **Successor** | None |
| **Handoff Criteria** | The cuts are gone, no reference points at a missing path, and the deep-loop, sk-design, sk-doc and retrieval checks hold their baselines |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the v4 release line remediation specification.

**Scope Boundary**: Cut-list rows marked "Luna verified" or "orch confirmed": the `branch-leases-waves` module (V23), the `if_cli_copilot` branches (V05), and the unused evilcharts palette sheets. The lead opened sk-design and the four fixtures that name the deleted paths for this phase.

**Dependencies**:
- Phases 006 and 007 committed
- Findings V23 and V05 and the cut list in `../research/research.md` section 4

**Deliverables**:
- The module, its suite and two palette sheets removed, with docs, manifests and fixtures matching
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`system-deep-loop/runtime/lib/branch-leases-waves` is 3,165 lines whose only importers are two type-only imports, and it carries its own unit suite. Two evilcharts palette sheets and their screenshots have no reader besides their own self-declaration and the leaf manifest. Every doc, fixture and manifest that lists them keeps the dead weight in view.

### Purpose
The tree carries only code and assets something reads.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "branch-leases-waves" (repo, excluding specs and node_modules), importers only
runtime/lib/mode-contracts/substrate-ports.ts:10   import type { DurableBranchOrchestrator }
runtime/lib/conditional-fanin/types.ts:19          type import block
$ rg -n "palette-sheet-ordered|palette-sheet-categorical" (same scope)
own <meta name="chart-template"> line and leaf-manifest.json:7, :9 only
$ rg -n "source-globals" (same scope)
origin.md:3, :30, :34, :82 and changelog v0.14.0.0.md:20 -> kept
$ rg -n "if_cli_copilot" .skilled/commands/deep/assets/*.yaml
(no output; removed in phase 006)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `branch-leases-waves` and its suite; give the two importers local types; update the READMEs and ARCHITECTURE.md that name it.
- Delete the two unreferenced palette sheets and their screenshots; update `leaf-manifest.json`.
- Regenerate or edit the four fixtures that name the deleted paths, as their owners document.

### Out of Scope
- `source-globals.css` - `origin.md` and a changelog cite it, so it stays.
- `CROSS_ANCHOR_CONTAMINATION` - research assigns the wire-or-delete call to phase 010.
- Every cut-list row marked "child evidence only".
- Regenerating the sk-design compiled-routing manifest - an operator item.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/branch-leases-waves/**`, `tests/unit/branch-leases-waves.vitest.ts` | Delete | Dead module and suite |
| `runtime/lib/mode-contracts/substrate-ports.ts`, `runtime/lib/conditional-fanin/types.ts` | Modify | Local types |
| system-deep-loop READMEs and `ARCHITECTURE.md` | Modify | No pointer at a missing path |
| `sk-design/sk-design-chart/assets/style-reference/evilcharts/palette-sheet-{ordered,categorical}.html` and screenshots | Delete | Unread assets |
| `sk-design/leaf-manifest.json` | Modify | Matches the tree |
| sk-doc code-folder fixtures, spec-kit retrieval fixtures | Regenerate | Owned by their generators |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | After the cuts, the deep-loop typecheck and unit suite pass with no loss beyond the deleted suite's own tests. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | No file outside `specs/` names a deleted path. |
| REQ-003 | The sk-design package check, the parent-skill check, the sk-doc code-folder tests and the retrieval fixture tests pass. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every check named in REQ-001 and REQ-003 passes from the final tree.
- **SC-002**: `rg` for each deleted name outside `specs/` prints nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dynamic import the scan missed | Med | Full deep-loop suite and typecheck rerun |
| Risk | A fixture suite cannot go green | Med | Three attempts, then revert the module deletion and record it (goal G7) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: deletions only.

### Security
- **NFR-S01**: N/A: no credential or permission path changes.

### Reliability
- **NFR-R01**: N/A: no runtime path changes behavior; only unreachable code is removed.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A, nothing reads the removed code.
- Maximum input: N/A.
- Failure path: a check that reads a deleted path fails and names it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One module, two assets, four fixtures, docs |
| Risk | 8/25 | Deletions guarded by importer scans |
| Research | 4/20 | Verified cut list |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
