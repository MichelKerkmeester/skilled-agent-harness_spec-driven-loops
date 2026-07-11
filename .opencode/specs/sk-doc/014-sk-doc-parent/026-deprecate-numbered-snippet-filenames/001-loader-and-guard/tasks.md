---
title: "Tasks: make the Lane C playbook loader number-agnostic + add a no-new-numbered-snippet guard"
description: "Task breakdown for the content-gate loader change, the oracle re-base, the optional `stage:` field, and the no-new-numbered-snippet regression guard."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/001-loader-and-guard"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase tasks authored"
    next_safe_action: "Implement the loader content-gate change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Make the Lane C Playbook Loader Number-Agnostic + Add a No-New-Numbered-Snippet Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Read `load-playbook-scenarios.cjs` in full (`parseRootIndex()` and `loadYamlFrontmatterScenarios()`) and
  confirm every caller of `loadPlaybookScenarios()` / `loadYamlFrontmatterScenarios()`.
- [ ] Read `code-opencode-playbook-ids.vitest.ts` and confirm the `^\d{3}-.*\.md$` test at `:28` inside
  `countFeatureFiles()` is the only oracle re-implementing the old gate.
- [ ] Read `check_no_numbered_categories.py` as the architectural precedent for the new guard's shape
  (`CATEGORY_ROOTS`, exit codes, `--json` mode).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] Replace the `^\d{3}-.*\.md$` basename gate at `load-playbook-scenarios.cjs:302` with the
  structural-plus-frontmatter content gate (subfolder-of-playbook-root + parseable YAML frontmatter).
- [ ] Add optional `stage: routing|holdout|negative` frontmatter parsing, defaulting to `routing`, and attach
  it to the returned scenario object.
- [ ] Re-base `countFeatureFiles()` in `code-opencode-playbook-ids.vitest.ts` onto the same content gate as
  the loader.
- [ ] Author the no-new-numbered-snippet guard script (mirrors `check_no_numbered_categories.py`'s shape,
  scoped to per-scenario filenames) that FAILS on a new `feature_catalog|manual_testing_playbook/<category>/NNN-*.md`
  file and PASSES on a de-numbered one.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] Add fixtures: numbered scenario, de-numbered scenario, root index file, non-scenario file in a category
  subfolder (negative), scenario with `stage:`, scenario without `stage:`, newly created numbered snippet
  file.
- [ ] De-numbered scenario → loaded; numbered scenario → loaded; root index → NOT loaded; non-scenario file →
  NOT loaded.
- [ ] `stage: holdout` fixture → surfaces `holdout`; no-`stage:` fixture → surfaces `routing`.
- [ ] Oracle count (`countFeatureFiles()`) agrees with the loader's parsed scenario count on the live
  `code-opencode` playbook tree.
- [ ] New numbered snippet file → guard FAILS; de-numbered file → guard PASSES.
- [ ] Existing skill-benchmark vitest suite passes (no regression).
- [ ] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
The Lane C loader tolerates numbered + de-numbered snippet filenames (excludes the root index), reads the
optional `stage:` field with a `routing` default, the vitest oracle agrees with the loader, the
no-new-numbered-snippet guard rejects new numbered files, and the existing suite is green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
Foundation for Phase 003 (migration tooling authors against the tolerant loader) and Phase 004 (rename must
not land until this tolerant loader ships — ADR-002). Independent of Phase 002 (generator alignment). Phase
005 re-runs the Lane C benchmark to prove zero corpus loss once this loader and Phase 004's rename both land.
<!-- /ANCHOR:cross-refs -->
