---
title: "Implementation Plan: Phase 21: pi-fast-mode-trusted-flag"
description: "Trace the missing flag to a claim that forgot which real path claimed, then key the claim on the claiming copy's real package root so copies at one real path both register while a copy at another path still stands down. A mutation test proves the new branch, a six-run help probe proves the flag in both layouts, and the README counts are set from the run that finally measured them."
trigger_phrases:
  - "pi fast mode trusted flag plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: pi-fast-mode-trusted-flag

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, built with tsc and run by Pi 1.3.0 as an extension |
| **Framework** | Vitest over an in-process fake `ExtensionAPI` and a fake event bus |
| **Storage** | A JSON config file under the Pi agent dir, never the real `~/.pi` in tests |
| **Testing** | The extension's own vitest suite, a mutation run against the old code, a six-run help probe and a print-mode probe |

### Overview
The research row 1 caused the flag loss: the claim was a boolean, so the project copy stood down behind the user-scope copy that Pi loaded pre-trust at the same real path, and Pi then kept only the project copy and lost the flag. The fix records the claiming copy's real package root in the claim and lets a copy stand down only when a copy at a different real root claimed first. A new test proves two copies at one real path both register, the comment above `claimPackage` is corrected to Pi's real conflict model, and the README counts are set from the run that measured them.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A small claim protocol over Pi's shared event bus, with recorded before/after evidence. The phase changes one extension source file, its test file and three READMEs.

### Key Components
- **`claimPackage(pi, root)` in `src/index.ts`**: emits the claim channel with a probe that carries `claimedBy`. It stands down only when `claimedBy` is set and differs from its own root; otherwise it subscribes as the claimer and records its own root.
- **`realRoot(extensionDir)`**: resolves the package root one level above the extension dir with `realpathSync`, falling back to `path.resolve` when the path cannot be resolved. This is the value the claim compares.
- **The event bus**: Pi's pre-trust pass and trusted pass share one bus, and the earlier pass's listeners stay subscribed, so the first copy to claim keeps the package and a copy at another real path stays silent.
- **The new test**: builds a real package directory and a symlink to it under a temporary root, loads both copies on one fake bus and expects both to register a flag.

### Data Flow
Each copy computes its real package root, emits the claim probe, and reads `claimedBy`. When `claimedBy` is unset, the copy subscribes as the claimer and stores its root; when it equals the copy's own root, the copy registers too, because Pi folds copies at one real path into one entry; when it differs, the copy returns before it registers anything. Pi then keys the loaded extensions by real path, so the copies at one root collapse rather than replace each other.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The verification tasks in `tasks.md` carry the runs. The new test is proven twice: it fails on the old code with 1 failed, 12 passed and exit 1 (`scratch/mutation/old-code-run.txt`), and passes on the new code with 13 passed and exit 0 (`scratch/mutation/new-code-run.txt`). The baseline before any edit was 7 files and 80 tests (`scratch/mutation/baseline-vitest.txt`), and the full suite after the change is 7 files and 81 tests with `tsc --noEmit` exit 0. `scratch/probe/probe.sh` writes the six-run help probe (`scratch/probe/probe-4layout.txt`) using a temporary `PI_CODING_AGENT_DIR`, never `~/.pi`; the print-mode probe follows (`scratch/probe/print-after.txt`). No testing beyond them is planned.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Rows 1, 19, 21 and 22 of `../014-post-merge-deep-research/research/research.md` supply every claim this phase makes, and the installed Pi 1.3.0 supplies the loader lines the cause rests on: `dist/core/resource-loader.js:560-570` for the pre-trust preload, `584-590` and around `975-1007` for the two-real-path conflict. `specs/system-deep-loop/040-cli-pi-worktree-extension-clash/spec.md:35` records that print mode fails on that conflict, which is why the research's first suggestion was rejected.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `src/index.ts`, `tests/extension.test.ts` and the three READMEs. The old claim then stands down again on a second copy at one real path, which restores the missing `--fast` in a plain run of the trusted main checkout, so the revert is a known regression rather than a neutral one. The records under `scratch/` stay as history.
<!-- /ANCHOR:rollback -->

---
