---
title: "Tasks: Boundaries, Containment and Naming"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "containment tasks"
  - "naming rename tasks"
  - "specifier normalisation tasks"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/021-code-conformance-alignment"
_memory:
  continuity:
    packet_pointer: "sk-code/021-code-conformance-alignment/005-boundaries-containment-and-naming"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown for the judgment tier"
    next_safe_action: "Run T001 once child 001 has landed and Q3 is answered"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Boundaries, Containment and Naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm every finding against HEAD before any edit, and reconcile the three evidence corrections carried into this child. **(a)** RB-004-12 must be re-scoped: its boxed-header claim is **false** — the header is present — so only the ESM-in-ordinary-`.js` module-format decision survives; record the correction rather than inheriting the over-claim. **(b)** RB-007-08 claims sixteen snake_case functions in the wait-pattern asset; a count at HEAD found fifteen. Establish the true count before the coordinated rename. **(c)** RB-002-05 names four symbols in the vector-index store; two matched the cited grep form and two use a different declaration form — find them with a corrected pattern. Six findings were confirmed by the synthesis author and must still reproduce (both `startsWith` lines in the skill-graph store; the unvalidated hub identifier reaching the path joins; bare built-in imports under `module: "nodenext"`; the 2,288-line entrypoint). Five are unverified and must be reproduced or struck here.
- [ ] T002 Capture per-package baselines before any edit: `tsc --noEmit` result, build result, and full-suite pass/fail counts for the spec-kit MCP server, the skill advisor, the md-generator backend, and every other package this child touches.
- [ ] T003 [P] Run the containment producer inventory: `rg -n 'startsWith\(' --glob '*.ts' --glob '*.cjs' --glob '*.js' --glob '!node_modules'`, filtered to path-scope comparisons. Confirm it finds the five named sites and record any sixth that no finding named.
- [ ] T004 [P] Run the bare-specifier inventory across the three NodeNext packages: `rg -n "from '(fs|path|os|url|crypto|child_process|util|stream|events)'" --glob '*.ts'`. The population, not the cited files, is the work list.
- [ ] T005 [P] Run the consumer inventory for every symbol slated for rename, including markdown, because pattern assets and documentation quote these names. Record which symbols have external consumers and therefore need a compatibility alias.
- [ ] T006 [P] Inventory the callers of the two ESM-in-ordinary-`.js` files, so the module-format decision is made against a real caller set rather than a guess.
- [ ] T007 [B] Resolve **[OPERATOR-DECISION: Q3 — containment helper ownership]** and record the helper's import path, or invoke the fallback and record the shared location chosen for later adoption.
- [ ] T008 Record every decision before its edit: the two module-format choices with their caller impact, the alias policy per renamed symbol with a removal condition, and the extraction targets for the entrypoint (`decision-record.md`).
- [ ] T009 [P] Agree the per-file ordering with child 003 for every file both children touch, so header edits and structural edits do not interleave.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Containment cluster

- [ ] T010 Write the failing regression pair for each of the five sites before any fix — a sibling-prefix case and a symlinked-ancestor case, plus a `..`-segment case, a legitimate-inside case, and a non-existent-target case. Twenty-five rows total; each adversarial row must fail against the current code.
- [ ] T011 [B] Replace the two raw `source_path.startsWith` scope checks with the shared canonical containment helper (`skill-graph-db.ts:1271,1343`).
- [ ] T012 [B] Replace the prefix match with canonical containment in the benchmark cwd scorer (`cwd-check.cjs`).
- [ ] T013 [B] Replace the symlink-blind lexical check on model-inferred paths with canonical containment (`extract-files-from-markdown.cjs`).
- [ ] T014 [B] Add an allowlist and a containment check for the hub identifier before it reaches the archive-root and path-join calls; reject empty, absolute, separator-containing and `..`-containing identifiers (`archive-compiled-routing.cjs`).

### Imports and module-format cluster

- [ ] T015 Normalise bare Node built-in specifiers to `node:` across the spec-kit MCP server's production sources via an AST codemod, confirm the imported-binding multiset is unchanged per file, then **rebuild the package** before any runtime verification.
- [ ] T016 Same for the skill advisor's production sources, with its own rebuild.
- [ ] T017 Same for the md-generator backend's production sources, with its own rebuild.
- [ ] T018 [B] Implement the module-format decision for `validate-doc-model-refs.js` — rename to `.mjs` with every caller updated, or convert to CommonJS — per the T008 decision. Its boxed header is already present and must not be touched.
- [ ] T019 [B] Implement the module-format decision for the review canary `.js` utility, per the T008 decision.

### Naming cluster

- [ ] T020 Introduce camelCase names for the snake_case exports in the vector-index store, with explicit compatibility aliases only where the T005 inventory shows a consumer requires one. Record a removal condition for every alias (`vector-index-store.ts`).
- [ ] T021 Rename the snake_case functions in the wait-pattern asset as one coordinated update covering the declarations, every internal call, and every example in the file. The asset is copied downstream by design, so its examples must stay consistent (`wait-patterns.js`).

### Organisation cluster

- [ ] T022 Extract the first cohesive lifecycle domain from the entrypoint behind an existing contract; verify startup ordering and MCP runtime behaviour against a rebuilt `dist`; commit. Repeat one extraction at a time, stopping when the next extraction is no longer safe, and record the resulting line count honestly (`context-server.ts`).
- [ ] T023 Build the move-simulation test that renames the old spec packet and asserts the rebuild path still resolves — before the promotion, not after.
- [ ] T024 Promote the compiled-routing authored source out of the renumberable spec packet and repoint the sync and guard scripts at the new authority. Regenerate the outputs and confirm byte parity (`compiled-route-sync.cjs`, `compiled-route-guard.cjs`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T025 Test happy path manually: start the MCP server after the final extraction, against a rebuilt `dist`, and confirm it serves; confirm startup ordering matches the captured pre-change ordering.
- [ ] T026 Test edge cases: run all twenty-five containment matrix rows and confirm each adversarial row is rejected and each legitimate row is accepted. Confirm every adversarial row failed before its fix.
- [ ] T027 Confirm `rg -n 'startsWith'` over the five touched files returns no remaining path-scope comparison, and that any sixth site found in T003 is either fixed or explicitly recorded as out of scope.
- [ ] T028 Confirm zero bare Node built-in specifiers remain in the three packages' production sources, and that each package's imported-binding multiset is unchanged.
- [ ] T029 Confirm every consumer of every renamed symbol resolves — through the new name or an explicit alias — and that every alias carries a removal condition.
- [ ] T030 Confirm compiled-routing regenerated outputs are byte-identical and the move-simulation test passes.
- [ ] T031 Run every touched package's typecheck, build and full suite, and report each as a delta against its T002 baseline.
- [ ] T032 Update documentation: reconcile `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` and `implementation-summary.md`, including an honest statement of the entrypoint's final line count against the guideline.
- [ ] T033 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every containment test demonstrated failing before its fix
- [ ] Every TypeScript package rebuilt before its runtime verification
- [ ] The entrypoint's residual line count stated honestly, not claimed as closed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
