---
title: "Implementation Plan: sk-doc shared/ audit for integration, utilisation and usefulness"
description: "Evidence-first audit method: measure consumers per file, decide placement, repair only proved defects, and prove the hub gates that were green stay green."
trigger_phrases:
  - "shared audit method"
  - "consumer measurement plan"
  - "sk-doc shared repair plan"
  - "shared placement decision"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-doc shared/ audit for integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON under `.opencode/skills/sk-doc/shared/` |
| **Framework** | sk-doc parent-hub contract: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-aliases.json` |
| **Storage** | Filesystem only; no runtime state |
| **Testing** | `shared/scripts/validate_document.py`, `doctor/scripts/parent-skill-check.cjs`, `sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs`, `system-spec-kit/scripts/check-markdown-links.cjs` |

### Overview

Measure before deciding. For each file, count consumers with a path-qualified grep that excludes frozen benchmark reports and frozen spec history, then check the two routing surfaces that can make a file reachable without a textual reference: `ROUTER.md` `RESOURCE_MAP` and `leaf-aliases.json`. Placement follows from the count: two or more consuming packets means the file stays in `shared/`, one means it belongs in that packet, zero means it is an orphan. Only then repair, and only what the measurement proved wrong.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline captured for every shared markdown file before any edit
- [x] Hub gate baselines captured: `parent-skill-check`, `leaf-resource-contract`, `check-markdown-links`
- [x] Ownership boundary confirmed against the stream brief

### Definition of Done
- [x] Every audited file carries a verdict with named evidence
- [x] Every repaired path checked against the filesystem
- [x] `validate.sh <folder> --strict` prints `RESULT: PASSED`
- [x] No hub gate regressed relative to its captured baseline
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-layer routing. `hub-router.json` picks a workflow mode; `ROUTER.md` picks the leaf resources within it. A `shared/` file becomes routable by appearing in `ROUTER.md` `RESOURCE_MAP` as a `shared/...` disk path that `leaf-aliases.json` converts into a `(workflowMode, leafResourceId)` pair. This is why a consumer count from grep alone is incomplete: six of the thirteen shared files are reachable through the alias table.

### Key Components

- **`leaf-aliases.json`**: binds six `shared/` disk paths to a workflow mode. An alias is a routing convenience, not an ownership claim; `changelog-template.md` is aliased solely to sk-create-changelog yet has consumers in four runtimes and a second skill.
- **`template-rules.json`**: the document-type contract `validate_document.py` reads. Its `documentTypes` keys are the authoritative answer to "is this a real document class", which is how the `llms.txt` fiction was proved.
- **`shared/scripts/` facades**: six symlinks under `sk-doc/scripts/`. They are why a bare `scripts/x.py` path in a shared reference resolves from the hub root while a bare `assets/x.md` path does not.

### Data Flow

A request defers at the hub, `SKILL.md` loads `hub-router.json` `routerPolicy.defaultResource`, and the caller receives `shared/references/quick-reference.md`. Every other shared file arrives either through a mode's own `SKILL.md` and references, or through a `ROUTER.md` leaf pair.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the phase checkboxes and task state.

### Phase 1: Baseline

Capture the validator result for every shared markdown file, and the three hub gate results, into this packet before touching anything. Confirm `shared/` is clean in `git status` so every later change is attributable to this stream.

### Phase 2: Measure and decide

Count consumers per file, read the two routing surfaces, resolve apparent orphans by basename search, and grep for inbound anchor links before renaming any heading. Only then write a verdict.

### Phase 3: Repair and prove

Edit only the files whose defects the measurement proved, re-run every baseline check, and attribute each delta to a stream. Write down the changes that belong to another owner rather than applying them.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each repair is proved by the same check that exposed it, run before and after.

- D1 carried a negative control: the heading rename was applied to a scratch copy first, and `validate_document.py` moved from exit 1 to exit 0 on that copy before the real file was touched.
- D6 carried a negative control in the opposite direction: a scratch file deliberately named `my_under_score.md` validated clean, which proved the claim that `validate_document.py` enforces a filename rule is false.
- Path repairs are proved by `find` and `ls` against the filesystem, not by reading another document.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Three other agents write this tree concurrently, so gate results move under this packet's feet. Two transient failures were observed mid-run and both belonged to another stream's in-flight `sk-create-with-human-voice` directory: `parent-skill-check` invariant 6a rejecting it as an unregistered hub child, and `check-markdown-links` reporting two broken links inside it. Both cleared once that stream registered its mode.

Final state matches the captured baseline. `parent-skill-check` passes every hard invariant with 0 warnings, and `check-markdown-links` reports the same 3 pre-existing breaks in `system-spec-kit/assets/template-mapping.md` that it reported before this packet started. None of them is reachable from any file this packet touched.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Six worktree changes, nothing staged and nothing committed. Reverting is a checkout of the six paths listed in `spec.md` section 3. No generated artifact, database or index was written, so there is no second surface to undo.
<!-- /ANCHOR:rollback -->

---
