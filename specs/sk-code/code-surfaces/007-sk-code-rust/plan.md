---
title: "Implementation Plan: Rust standards in sk-code, informed by rust-anything"
description: "A deep research loop over rust-anything ranks the edits, then the existing Rust references and checklist under sk-code-skilled are edited in place. The router sync check, the package validator and a copy check prove the result."
trigger_phrases:
  - "sk code rust plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Rust standards in sk-code, informed by rust-anything

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference parts and JSON router files in a Skilled skill |
| **Framework** | The sk-code parent hub and its sk-code-skilled surface |
| **Storage** | None |
| **Testing** | `verify-router-sync.cjs`, `validate_skill_package.py`, `validate.sh --strict` |

### Overview
A `/deep:research` fan-out of three Vibe lineages reads rust-anything and writes a ranked list of edits into `research/research.md`. The main session checks each cited line, then edits the Rust references and checklist parts in place. The router sync check, the package validator and a copy check against the reference repository prove the result.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` before the first edit, the baseline taken on 2026-11-26
- [ ] `research/research.md` exists with a ranked edit list
- [ ] Every cited rust-anything line in the ranked list was opened and resolves

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is `Met`
- [ ] `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` after the last edit
- [ ] Spec, plan and tasks agree on the final file list
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Edit in place.

### Key Components
- **`sk-code-skilled/references/rust/`**: the three split folders, style-guide, quality-standards and quick-reference, that a Rust task loads inside Skilled.
- **`sk-code-skilled/assets/checklists/rust-checklist/`**: the four checklist parts the quality gate loads for `.rs` files.

A new split part is added only when a finding has no home in an existing part. Extending a part in place fails then because the part would hold two unrelated topics, and the climbing sentence is written in `tasks.md` beside that task.

### Data Flow
rust-anything source lines become ranked findings in `research/research.md`. Each finding becomes one edit to one part, and the hub's file lists in `ROUTER.md` and `mode-registry.json` follow any new part.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the deep research and checks its citations. Implementation edits the Rust parts in place and records the version and changelog. Verification runs the router sync check, the package validator, the copy check and the packet validator. The ordered work is in `tasks.md`.

### Final File List

Set by `research/research.md` section 4 and changed in place. No part was added, so the hub router, `mode-registry.json` and the LS-006 scenario stay unchanged.

- `.skilled/skills/sk-code/sk-code-skilled/SKILL.md`: the TypeScript-contract rule is scoped, and the version moves to 2.3.0.0.
- `.skilled/skills/sk-code/sk-code-skilled/changelog/v2.3.0.0.md`: created.
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/overview-and-p0-parity.md`: app-style scope and the process contract row.
- `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/rust-checklist/p1-required.md`: `#[expect]` over `#[allow]` and the infallible exception.
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/docs-errors-and-async.md`: `anyhow` in an app and §Application Entry Point.
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/build-and-organization.md`: app layout, single-crate lints, binary tests and child stdout.
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/determinism-and-parity.md`: §Porting Against a Recorded Original and the `serde_json` features.
- `.skilled/skills/sk-code/sk-code-skilled/references/rust/quality-standards/modeling-collections-and-api.md`: regex engines and Java `char`.

The spec's expected targets `toolchain-and-project-structure.md`, `interop-model.md`, the quick reference and `p2-evidence-validation-and-resources.md` are not edited. The research found the finish gate already covered, placed the value mapping in `modeling-collections-and-api.md` and took no agent recipe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The hub's routing: every routed Rust path exists and the compiled routes agree | `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed` |
| Integration | The sk-code-skilled package format | `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py .skilled/skills/sk-code/sk-code-skilled` reports no error |
| Manual | The LS-006 sandbox prompt still loads both the Rust and the TypeScript trios | The scenario in `manual-testing-playbook/language-sub-detection/skilled-rust.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `vibe` CLI with the `deepseek-flash` model | External | Green, used by earlier runs in this repository | The research cannot run under the operator's executor rule |
| `specs/z_external-repo-library/rust-anything-main` | Internal, read-only | Green | Nothing to research |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `verify-router-sync.cjs` fails after an edit, or a binding rule from before the change is missing after it.
- **Procedure**: revert the commit that changed the Rust parts with `git revert <sha>`. The research commit stays, because it changes no skill file.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The worktree and this packet | Implementation, because no edit runs before its finding is checked |
| Implementation | The checked ranked list | Verification |
| Verification | Every edit | Closure |
<!-- /ANCHOR:phase-deps -->

---
