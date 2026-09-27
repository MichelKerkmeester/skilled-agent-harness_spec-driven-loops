---
title: "Implementation Plan: Fixing the Phase 10 Observations"
description: "The orchestrator fixes each observation in place, a departure from the parent's frozen D1 that the operator was not asked about first, and GPT-6 Luna through cli-codex verifies the code edits. The create.sh change is proven by a test that fails first, and the GitHub action waits for the operator's yes."
trigger_phrases:
  - "phase 10 observations plan"
  - "appended phase numbering fix"
  - "drift guard docs plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fixing the Phase 10 Observations

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (`create.sh` and the drift-guard wrapper), TypeScript advisor hooks and runtime, Markdown skill and spec docs |
| **Framework** | Node 26, vitest, the spec-kit description generator and the Hermes mirror sync |
| **Storage** | `description.json` files, the advisor metrics directory under `$TMPDIR` and GitHub's Dependabot alert state |
| **Testing** | vitest for `create.sh`, the advisor suite and typecheck, the drift-guard wrapper, the sk-doc validator, `check-placeholders.sh` and `validate.sh --strict` |

### Overview
The orchestrator fixes each observation directly. Every change is a few lines and has an objective check, so briefing executor lanes would cost more than it catches. That departs from the parent's frozen D1, which gives code fixes to Grok through cli-cursor, and the operator was not asked first. GPT-6 Luna max fast through cli-codex therefore verifies the five code files after they are written, with a reverse check, and the close-out proposes a D1 amendment. The one behavior change, the numbering in `create.sh`, gets a test that fails before the fix. The Dependabot dismissals leave this machine, so they wait for the operator's yes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each observation confirmed in code or data by the orchestrator, with file and line
- [x] Baselines recorded before any edit: advisor 129 files, 971 passed and 6 skipped at `eaa02a56f5`, `create-root-numbering.vitest.ts` 5 passed and strict validation of the 13 other folders, 10 PASSED and 3 scratch FAILED

### Definition of Done
- [x] The `create.sh` test fails against the committed script and passes after the fix
- [x] Every suite and validator matches or beats its baseline
- [x] GPT-6 Luna through cli-codex returns PASS on the five code files, and its reverse check reproduces `Phase 1: third-step`
- [x] `validate.sh --strict --recursive` prints `RESULT: PASSED` for packet 030
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One orchestrator and no implementer lane, against D1 as the overview says. One GPT-6 Luna verifier run covers the five code files once they are written. Each fix is followed by its own check before the next one starts.

### Key Components
- **`create.sh` child loop**: computes each child's phase number from `PHASE_START_INDEX` and uses it in the graph summary, the description and the scaffold title.
- **Description generator**: `generate-description.js` rebuilds a folder's `description.json` from its `spec.md`, or from an explicit `--description`.
- **Hermes mirror sync**: `sync-skills-hermes.cjs` writes into a scratch folder, and only the sk-code-opencode file is copied back.

### Data Flow
Observation, then a check that shows it, then the fix, then the same check again. The folder-level validators run last, from the final state.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The numbering change in `create.sh` is the one behavior change, and its test fails against the committed script with `Phase 1: third-step`. Doc and comment fixes are checked by the sk-doc validator, a residue grep and the drift-guard wrapper. The advisor suite reruns in full because two of its source files changed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The operator's yes for the Dependabot dismissals, given on 2026-09-27.
- The built description generator, `runtime/cli/dist/spec-folder/generate-description.js` under system-spec-kit.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Code and docs: revert the phase commit. The advisor dist rebuilds with `npm run build`.
- Descriptions: `git checkout <commit>^ -- <folder>/description.json` restores any regenerated file.
- Dependabot: `gh api -X PATCH repos/{owner}/{repo}/dependabot/alerts/<n> -f state=open` for 1066, 1068, 1070, 1071, 1072 and 1073.
- Metrics log modes: `evidence/metrics-log-modes.txt` names the 46 logs that changed, and `chmod 644` on each restores them.
<!-- /ANCHOR:rollback -->

---
