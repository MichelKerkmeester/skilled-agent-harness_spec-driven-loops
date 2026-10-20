---
title: "Tasks: Phase 31: plugin-scanner-ast"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "plugin scanner ast tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 31: plugin-scanner-ast

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Item 8: find a parser already installed where the plugin tests can load it Done: none of acorn, @babel/parser, espree, typescript or esbuild is installed under `.opencode/node_modules` or `.skilled/node_modules`; `rolldown` 1.2.12 is, through vitest's vite, and is pinned in `.skilled/package-lock.json`. `rolldown/parseAst` returns ESTree with decoded string values, UTF-16 offsets that index the source directly, and throws on a syntax error.
- [x] T002 Take the baselines (`scratch/baseline/plugin-suite.txt`) Done: `node --test .opencode/plugins/tests/` 417 of 417, plus the old helper's handled and unscanned lists for all 16 bridged plugins. The old helper also hangs on the 515 KB sk-vision bundle, which the inventory never scans because sk-vision is native-dual.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Item 8: replace the text scan with the parser (`.opencode/plugins/tests/helpers/plugin-inventory.cjs`) Done: section 4 parses once and applies one rule per node type; a case label counts only under a switch on the event type, a collection resolves only as a `const` literal that is only ever read, and the event type is followed through plain and destructured aliases. `stripComments` is no longer exported.
- [x] T004 Item 8: fixtures for each recorded limit, aliases and a parse failure (`.opencode/plugins/tests/plugin-inventory.test.cjs`) Done: six new tests; the `stripComments` test is gone and the case-label fixture now sits under `switch (eventType)`.
- [x] T005 Item 9: check symlinked plugin entries (`.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts`) Done: a link must be relative, stay in the repository and resolve to a built file with a plugin extension before the shared contract checks run; `SK_VISION_AUTOINSPECT` is held off for the run so the check never starts the GPU runtime.
- [x] T006 Item 9: build the sk-vision bundle in Spec-Kit Check (`.github/workflows/spec-kit-check.yml`) Done: bun 1.3.9, a frozen install and `bun run build` before the vitest projects. A clean `git archive` of `.skilled/skills/sk-vision` built `dist/plugin.js` with install and build both exiting 0.
- [x] T007 Item 9: list every suite (`.opencode/plugins/tests/README.md`) Done: rows for `classifier-injection-screen`, `claude-fable-subagent-guard`, `goal-doc-contract`, `mcp-route-guard` and `session-relaunch`, and the full tree; every `*.test.cjs` in the folder is now named.
- [x] T008 Describe the guard and the purity test as they now work (`.opencode/plugins/ARCHITECTURE.md`, `.opencode/plugins/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Item 8: same output on the real plugins (`scratch/mutation/scan-parity.txt`) Done: identical handled and unscanned lists for all 16 bridged plugins.
- [x] T010 Item 8: the fixtures fail on the old helper and on targeted mutants (`scratch/mutation/scanner-old-helper.txt`) Done: old helper exit 1, 12 pass and 6 fail, all six new tests; mutant m1 (switch discriminant check removed) and m2 (collection mutation check removed) each fail exactly one test; the unmodified helper passes 18 of 18.
- [x] T011 Item 9: broken links fail the new purity test only (`scratch/mutation/purity-symlink.txt`) Done: an absolute link, a link to a missing bundle and a link to a non-plugin module each exit 0 on the old test and 1 on the new one; the restored link exits 0.
- [x] T012 Run the full plugin suite and lint the workflow Done: `node --test .opencode/plugins/tests/` 422 of 422 (417, less the removed `stripComments` test, plus six); `actionlint` exit 0; `check-gate-inputs.sh` RESULT: PASSED with 0 failures.
- [ ] T013 Review the change read-only with Luna until PASS (`scratch/review/`)
- [ ] T014 Validate this folder strict and 082 recursively, each RESULT: PASSED
- [ ] T015 Item 9: Spec-Kit Check and the dual-version battery pass on CI at the pushed main commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
