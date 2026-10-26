---
title: "Feature Specification: Phase 7: checker-debt-closeout"
description: "Close the four checker limitations phase 001 left: the ceiling report reads comment text through the checker, bare Python string statements are checked, the whole tree reaches zero findings and the live CI failure run is recorded."
trigger_phrases:
  - "checker debt closeout"
  - "phase 7 checker debt closeout"
  - "ceiling report shared extraction"
  - "bare string statement hygiene"
  - "zero finding comment hygiene tree"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: Phase 7: checker-debt-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-26 |
| **Branch** | `worktrees/227-quality-checker-debt` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 001-honest-checker |
| **Successor** | 006-measurement |
| **Handoff Criteria** | The whole-tree checker run prints 0 findings, the ceiling report holds no comment scanner of its own, phase 001's Known Limitations items 1 to 4 read as closed, and 006-measurement can measure the final checker |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the program that makes sk-code-quality a codebase-agnostic, executable author gate. The parent packet is `specs/sk-code/015-quality-agnostic-gate/`. It closes every known limitation that phase 001 left on the checker side, so nothing from that phase stays deferred. It is numbered 7 because it was added after the six planned phases, and it lands before 006-measurement, which measures the final checker.

**Scope Boundary**: The comment-hygiene checker and its family table, the ceiling report and its suite, the flagged comments in tracked files under `specs/`, the record of the live CI failure run, and phase 001's Known Limitations items 1 to 4. The phase changes no CI or pre-commit file scope, no runner code, no router code and no doctrine.

**Dependencies**:
- `001-honest-checker` only. This phase changes the checker, the family table and the ceiling report that phase 001 built, and it extends the suites phase 001 wrote. Phase 001 is on main.
- `002-builtin-runner` is on main and reads the checker's `--json` output. Nothing in this phase depends on it, but its `node --test` suite is a consumer check, so it must still pass.
- `003-config-and-doctor` and `004-doctrine` build in parallel worktrees and are not on main yet. Neither is a dependency. Both change the version files this phase changes, so the coordinator rebases and re-picks versions at landing.
- `006-measurement` depends on this phase, because it measures the checker this phase leaves.

**Deliverables**:
- One comment extraction: the ceiling report loads the checker file and reads language, family and comment text through its functions.
- Template literals and shell heredocs read as strings in that extraction, for the checker and the report alike.
- Every bare Python string statement read as comment text, with f-strings and every data position kept as data.
- A whole-tree checker run with 0 findings, with live comments rewritten and frozen evidence marked under ADR-005.
- The live CI failure run recorded from the coordinator's proof file.
- Phase 001's Known Limitations items 1 to 4 marked closed.
- Versions: sk-code-quality 1.9.0.0 and the sk-code hub 3.5.0.0, each with a changelog file. Phases 003 and 004 land 1.7.0.0 with 3.3.0.0 and 1.8.0.0 with 3.4.0.0 first, and the coordinator re-picks at landing if the order changes.

**Changelog**:
- When this phase closes, write `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-007-checker-debt-closeout.md` with `nested-changelog.js --write`. It names the tree count before and after and the delta classes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 closed with four checker limitations open. The ceiling report keeps its own copy of the comment rules, so it reads a YAML block scalar, a multi-line string and a docstring line as a comment: on 2026-10-26 it listed a `# ceiling:` line inside each of five probe files, a YAML `run: |` block, a docstring, a triple-quoted data string, a JavaScript template literal and a shell heredoc. The checker treats a Python string statement as comment text only in a documented position, so a triple-quoted string used as a block comment after other code goes unchecked. The whole-tree run at main `f69e5cd2e8` reports 63 findings in 41 files, all under `specs/`, and each file fails pre-commit the next time it is touched. The comment-hygiene CI job runs only on pull requests, so its fail-and-annotate path had no live run when phase 001 closed.

### Purpose
After this phase one extraction decides what is comment text for both tools, every bare string statement is checked, the whole tree reports 0 findings, and the live CI failure run is on record, so phase 001 leaves nothing deferred.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make the ceiling report load `check-comment-hygiene.sh` as a module and take language, family and comment text from it (ADR-001).
- Teach that extraction to read a multi-line template literal and a shell heredoc body as strings (ADR-002), and let a ceiling marker start without a comment prefix (ADR-003).
- Check every bare Python string statement as comment text, and keep f-strings, assigned strings, call arguments, return values and dict values as data (ADR-004).
- Drive the whole-tree run to 0 findings: rewrite live comments to their durable reason, and mark frozen evidence with a per-line `hygiene-ok` (ADR-005), under the delta rule in ADR-006.
- Record the live CI failure run, mark phase 001's Known Limitations items 1 to 4 closed, and ship the version bumps and changelogs.

### Out of Scope
- Any change to the whole-file scope of CI or pre-commit, and any change to `.github/workflows/comment-hygiene.yml`. The parent's ADR-004 keeps both.
- Narrowing the `phase 0` and `T\d{3,4}` patterns. Phase 001's ADR-007 keeps both.
- Parsing `${...}` interpolation beyond reading it as code. The interpolation reads as code with a nested template literal tracked on a stack, as section L2 Edge Cases records, and no other interpolation form is parsed.
- Phase 001's Known Limitations items 5 and 6. Item 5 is the universal checklist retitle that phase 004 owns, and item 6 is the main checkout's pre-commit hook.
- The runner, the post-edit router and their contracts. Both read the family table's `languages` block only, which this phase does not change.
- Any file under `specs/hooks/023-session-relaunch-loop/research/lineages/`, which belongs to another session's live lineage.
- A path-wide exclusion of `z_archive/`, backups or lineages in the checker, the CI job or pre-commit. It could hide live code (ADR-005).

### Files to Change

`Q/` stands for `.skilled/skills/sk-code/sk-code-quality/` and `H/` for `.skilled/skills/sk-code/`. The flagged-file rows list the 38 files the cleanup edited, out of the 41 the whole-tree run flagged at `f69e5cd2e8`. T034 reconciled this table with `git status`: the extraction change in Step 1 cleared the other 3 without an edit.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `Q/scripts/ceiling-report.sh` | Modify | Loads the checker as a module, reads language, family and comment text through it, keeps its own marker grammar with an optional prefix, and drops its own scanner |
| `Q/scripts/ceiling-report.test.sh` | Modify | String cases for a YAML block scalar, a docstring, a data string, a template literal and a heredoc, plus the shebang and missing-checker cases |
| `Q/scripts/check-comment-hygiene.sh` | Modify | Template literal and heredoc state, the bare-string rule, f-strings as data, and the comments that describe them |
| `Q/scripts/check-comment-hygiene.test.sh` | Modify | Template literal, heredoc and bare-string cases, and `py_string_after_code` flipped to expect exit 1 |
| `Q/assets/comment-syntax.json` | Modify | The backtick moves to the c family's `multilineStrings`, and the hash family gains `heredocs` |
| `Q/scripts/README.md` | Modify | The ceiling report row says it reads comment text through the checker |
| `Q/SKILL.md` | Modify | The ceiling report line, and version 1.9.0.0 |
| `Q/changelog/v1.9.0.0.md` | Create | Quality release notes with the delta classes and the tree count |
| `H/SKILL.md`, `H/description.json`, `H/hub-router.json`, `H/mode-registry.json` | Modify | Hub version 3.5.0.0 |
| `H/changelog/v3.5.0.0.md` | Create | Hub release notes |
| `H/README.md` | Modify | The newest-entry row names `v3.5.0.0.md`, and the document version |
| `.hermes/skills/sk-code/SKILL.md`, `.hermes/skills/sk-code-quality/SKILL.md` | Regenerate | `sync-skills-hermes.cjs` copies of the two edited `SKILL.md` files |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/` | Regenerate, if stale | `compiled-route-manifest.cjs refresh --hub sk-code`, only when `compiled-route-guard.cjs` reports the hub stale after the version bump |
| `specs/system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/{001-search-intelligence-stress-playbook/002-search-scenario-design/scripts/dispatch-cli-copilot.sh,010-stress-test-close-loop-measurement-rerun/scripts/dispatch-cli-copilot.sh,011-research-post-stress-finding-followups/review/run-iterations.sh}` (3 files) | Modify | Live: each flagged comment rewritten to its durable reason |
| `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/{005-q4-quantization/scratch/fp32-vs-q4-similarity.mjs,007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh,014-onnx-cross-platform-backend/scratch/perf-investigation/scripts/common.py}` (3 files) | Modify | Live: rewritten. The two `run-deep-review.sh` files this row also named at `f69e5cd2e8` dropped out in Step 1, because their flagged lines sit in a heredoc body, so they need no edit |
| `specs/system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/004-extended-bake-off/evidence/run-extended-bake-off{,-with-hybrid-rerank}.sh` (2 files) | Modify | Live: rewritten |
| `specs/system-speckit/026-graph-and-context-optimization/scratch/reorg-2026-04-25/rewrite_relative_refs.py`, `specs/system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/020-cooperative-heavy-phases/scratch/diag-lag-read.sh`, `specs/system-speckit/050-open-knowledge-format-adoption/{002-baseline-and-decisions/scratch/agreement.py,011-frontmatter-values-to-sk-doc/scratch/corpus.py}` (4 files) | Modify | Live: rewritten |
| `specs/cli-external-orchestration/z_archive/018-cli-devin-prompt-quality/007-cross-model-validation/scripts/cross-model-confirm.cjs`, `specs/mcp-tooling/z_archive/011-routing-remediation/scratch/replay-driver.cjs` (2 files) | Modify | Frozen: `hygiene-ok` appended per line (ADR-005) |
| `specs/sk-doc/z_archive/006-sk-doc-agent-template-alignment/improvement/pre-promote-backup/.codex__agents__deep-{research,review}.toml`, `specs/system-deep-loop/z_archive/{013-agent-deep-review-optimization/improvement/pre-promote-backup/.codex-agents-deep-review.toml,014-agent-deep-research-optimization/improvement/pre-promote-backup/.codex-agents-deep-research.toml}` (4 files) | Modify | Frozen backup copies: `hygiene-ok` appended per line |
| `specs/sk-doc/z_archive/016-create-diff-mode/{011-skill-anchor-toc-removal/002-toc-removal/strip_toc_anchors.py,013-catalog-playbook-snippet-denumbering/review/baseline/apply-fixes.cjs}` (2 files) | Modify | Frozen: `hygiene-ok` appended per line. The `run-lineage.cjs` file this row also named at `f69e5cd2e8` dropped out in Step 1, because its flagged line sits in a template literal, so it needs no edit |
| `specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/scratch/it1-precommit-block/repo/.opencode/scripts/git-hooks/commit-msg`, `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/002-per-runtime-reference-map/research/lineages/deepseek-pi/working/gen-map-a.py` (2 files) | Modify | Frozen research lineage working trees: `hygiene-ok` appended per line |
| `specs/system-deep-loop/z_archive/006-deep-skill-evolution/{001-release-cleanup/011-deep-ai-council-release-cleanup,001-release-cleanup/013-deep-agent-improvement-release-cleanup,007-deep-stack-cross-cutting/003-doc-evolution-spec-and-resource-map}/resource-map.yaml` (3 files), `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/010-sk-deep-research-review-improvement-2/review/dispatch-20-iterations.sh` (1 file) | Modify | Frozen: `hygiene-ok` appended per line |
| `specs/system-speckit/026-graph-and-context-optimization/z_archive/wave-4-2026-05-26-reorg/017-phase-reorg-and-renumber/scratch/exec-moves.cjs`, `specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/065-anchor-system-implementation/scratch/test-runtime-anchors.js`, `specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/launch-qa-validation.sh` (3 files) | Modify | Frozen: `hygiene-ok` appended per line |
| `specs/system-speckit/z_archive/001-fix-command-dispatch/z_archive/072-speckit-template-memory-ranking-release/tests/{run-all-tests.js,run-all-tests.sh,spec-069-core.test.js,spec-069-integration.test.js,spec-070-composite.test.js,spec-070-scoring.test.js,spec-071-scripts.test.js,spec-071-templates.test.js,test-utils.js}` (9 files) | Modify | Frozen: `hygiene-ok` appended per line |
| `specs/sk-code/015-quality-agnostic-gate/001-honest-checker/implementation-summary.md` | Modify | Known Limitations items 1 to 4 marked closed, and the continuity block |
| `specs/sk-code/015-quality-agnostic-gate/007-checker-debt-closeout/evidence/` | Create | `tree-before.txt`, `delta.txt`, `validate-before.tsv` and `validate-after.tsv`, kept so the closure claims stay checkable |
| `specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-007-checker-debt-closeout.md` | Create | Packet changelog, written when the phase closes |
| `specs/sk-code/015-quality-agnostic-gate/spec.md`, `specs/sk-code/015-quality-agnostic-gate/graph-metadata.json`, `specs/sk-code/015-quality-agnostic-gate/001-honest-checker/graph-metadata.json` and this phase's `graph-metadata.json` and `description.json` | Edit, Regenerate | The parent phase map row and status, the derived metadata of `001-honest-checker` which the spec-remint gate re-derived once its summary gained the closure sentences, and this phase's derived metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The ceiling report loads `check-comment-hygiene.sh` from beside its own real path as a module, and it takes each file's language, family and comment text from that module's `load_table`, `language_for`, `ScanState` and `comment_text`. It defines no comment-scanning function of its own, and loading the checker writes no file, so no `__pycache__` folder appears (ADR-001). |
| REQ-002 | The shared extraction reads a JavaScript or TypeScript template literal that spans lines as a string, so no line inside it is comment text. A backslash before a backtick does not close the literal, and a comment after the closing backtick is still checked (ADR-002). |
| REQ-003 | The shared extraction reads a shell heredoc body as text. The body starts on the line after an opener `<<WORD`, `<<-WORD`, `<<'WORD'` or `<<"WORD"`, and it ends at the line that holds only the word, after leading tabs for `<<-`. A here-string `<<<` and an arithmetic shift such as `$((1<<2))` open no heredoc, and a comment on the opener line is still checked (ADR-002). |
| REQ-004 | The ceiling suite holds one case each for a YAML block scalar, a Python docstring, a Python triple-quoted data string, a template literal and a shell heredoc, and each case expects what the checker reads as comment text: the docstring marker is listed, and the other four are not. |
| REQ-005 | A ceiling marker is comment text that starts, after an optional comment prefix, with `ceiling:` or `intentional-limit:`. A docstring line and a block-comment body line can therefore carry a marker, and prose that holds the word later in the text still does not count (ADR-003). |
| REQ-006 | The checker reads every bare string expression statement as comment text, wherever it stands. That is a string literal, single, double or triple quoted, with an optional `r`, `u` or `b` prefix, that opens a logical line at bracket depth 0. A string with `f` in its prefix is data in every position, docstring positions included (ADR-004). |
| REQ-007 | Checker suite cases prove that an assigned string, an f-string, a call argument, a return value and a dict value stay data, and that a bare string after other code, a bare string in an `if` body and a bare single-quoted string are checked. `py_string_after_code` expects exit 1. |
| REQ-008 | The final checker run over `git ls-files -z` prints 0 findings and writes nothing to stderr. |
| REQ-009 | Every flagged comment in a live packet is rewritten to its durable reason and keeps its meaning. Each rewritten file still parses: `bash -n` for shell, `node --check` for JavaScript, `ast.parse` for Python, and YAML or TOML that loads to the same data as at the commit before the change. |
| REQ-010 | Every flagged comment in frozen evidence keeps its text and gains the suffix ` hygiene-ok` at the end of its comment text, per ADR-005. Frozen evidence is anything under a `z_archive/` folder, a `pre-promote-backup/` copy, a research or review lineage working tree and a review baseline. No path-wide exclusion is added to the checker, the CI job or pre-commit. |
| REQ-011 | Every touched packet validates no worse than before. For each one, the strict validator's error count and warning count after the change are at most its counts before, read from `evidence/validate-before.tsv` and `evidence/validate-after.tsv`. Derived metadata is regenerated only for a packet whose staged `.md` documents the pre-commit spec-remint gate covers, which excludes `scratch/` and `z_archive/` documents. |
| REQ-012 | The baseline delta of the commit-before checker against the working-tree checker, over every tracked file, is saved in `evidence/delta.txt`, and every delta line falls in a class named in the quality changelog. ADR-006 applies: a delta line outside `specs/` is fixed in the same change, and more than 50 added lines or 20 added files outside `specs/` stops the phase for the operator. |
| REQ-013 | Every comment in changed code states a durable reason only. No spec path, packet or phase number, requirement id, task id, ADR id or ticket id appears in a comment this phase writes (parent decision G3). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-014 | The live run of the comment-hygiene CI failure path is recorded with its run URL, its job conclusion and its annotation lines, copied from the coordinator's proof file. While that file does not exist, the task stays open with that reason. |
| REQ-015 | Phase 001's `implementation-summary.md` Known Limitations items 1 to 4 each say they are closed by this phase and name what closed them. Nothing else in that file changes except its continuity block. |
| REQ-016 | sk-code-quality is 1.9.0.0 with `changelog/v1.9.0.0.md`, and the hub is 3.5.0.0 in `SKILL.md`, `description.json`, `hub-router.json` and `mode-registry.json`, with `changelog/v3.5.0.0.md`. The coordinator re-picks both at landing if phases 003 and 004 land in another order. The packet changelog exists when the phase closes. |
| REQ-017 | The ceiling report's docstring and comments, the ceiling row of `Q/scripts/README.md` and the ceiling line of `Q/SKILL.md` describe the shared extraction, and the checker's comments describe the template literal, heredoc and bare-string rules. No text still says the report tracks no block, docstring or block scalar state. |
| REQ-018 | The four quality bash suites, the runner's `node --test` suite, `parent-skill-check.cjs`, `compiled-route-guard.cjs`, `generate-leaf-manifest.cjs --check` and `sync-skills-hermes.cjs --check` all pass on the final tree. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git ls-files -z | xargs -0 python3 -B .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh -- | wc -l` prints `0`, against `63` at `f69e5cd2e8`.
- **SC-002**: The checker suite and the ceiling suite each exit 0 and print their All-passed lines, and the ceiling suite names the five string cases.
- **SC-003**: `rg -c 'def (find_unquoted_comment|comment_text|family_reader)' .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` prints nothing and exits 1.
- **SC-004**: The before and after validation records list the same packets, and no packet shows more errors or more warnings after the change.
- **SC-005**: `tasks.md` records run `40276844110` with the job conclusion `failure` and the annotation on `ci-hygiene-proof.sh` line 2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001-honest-checker: the checker, the family table, the ceiling report and the suites | This phase changes them, so it cannot start without them | Phase 001 is on main. T004 re-checks every line this spec cites before the first edit |
| Risk | A stray backtick in a regex literal, or an unbalanced `${...}`, keeps a template literal open and hides the comments after it | High: a false negative in a HARD BLOCK detector | T015 reads every finding the delta removes, and each must sit inside a real string. A removal that does not is a stop |
| Risk | A heredoc fed to `bash` holds script comments that stop being checked | Med | Phase 001 made the same trade for YAML `run:` block scalars, which also hold shell. ADR-002 records it |
| Risk | Editing frozen evidence changes a record | Med | Only the ` hygiene-ok` suffix is added. T018 checks that every changed line equals its old line plus that suffix |
| Risk | A restored pre-promote backup carries a marked label into a live agent file | Low | ADR-005 names the four backup lines, and a restore drops the suffix and rewrites the comment |
| Risk | Phases 003 and 004 change the same version files in parallel worktrees | Med: merge conflicts at landing | The coordinator rebases this phase and re-picks versions at landing (parent risk 11) |
| Risk | An archived packet already fails strict validation | Low | The rule is no worse, read from the before and after records, not a pass |
| Risk | Main moves before this phase starts, so the counts change | Low | T002 re-measures the tree and T003 re-lists the packets, and the plan uses the new numbers |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The whole-tree checker run is timed before and after. It took 31.6 seconds of wall time at `f69e5cd2e8` on this machine. The time is recorded, not gated.
- **NFR-P02**: The whole-tree ceiling report is timed before and after. It took 11.78 seconds at `f69e5cd2e8` and printed `markers=3 no-trigger=1 no-signal=1`. The time is recorded, not gated.

### Security
- **NFR-S01**: The ceiling report writes no file. It turns bytecode writing off before it loads the checker, and the suite checks that no `__pycache__` folder appears beside the scripts.
- **NFR-S02**: No rewrite or suffix adds a secret or a credential. T018 limits frozen edits to the suffix, and the rewritten live lines are read by hand.

### Reliability
- **NFR-R01**: The ceiling report exits 2 with a one-line message, never a stack trace, when the checker file or the family table cannot be loaded.
- **NFR-R02**: The checker still runs from a copied file with no sibling module, so the `missing_table` case, which copies the checker alone, and the 6.4 baseline recipe, which copies the checker and its table, keep working.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: the checker with no arguments still exits 3, and the ceiling report in a repository with no tracked code file prints `markers=0 no-trigger=0 no-signal=0` and exits 0.
- Maximum length: unchanged. Both tools read each file whole.
- Invalid format: a heredoc whose word never closes, or a template literal that never closes, makes the rest of the file text. Bash and JavaScript read it the same way, so the checker reports nothing after it.

### Error Scenarios
- The checker file is missing beside the report: the report prints `ceiling-report: cannot load the comment-hygiene checker` with the path and exits 2.
- The family table is unreadable: the report exits 2 and the checker exits 3, as today.
- A file named on the report's command line has no known language: the report reads it with the table's hash family, as it always did.

### State Transitions
- Partial cleanup: the tree count is above 0, so the phase stays open. Each touched file is clean, so a commit of part of the cleanup still passes pre-commit.
- Interpolation: `${ ... }` inside a template literal reads as code, and a template literal nested inside one is tracked on a stack, so a comment inside an interpolation is checked and the template text around it is not.
- A bare string whose closing line goes on with code, such as `""".strip()`, reads as comment text, because an expression statement's value is discarded and only a person reads it.
- Two heredoc openers on one line queue their words, and the bodies close in order, as bash reads them.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Five quality files, six version files, 41 flagged files across 31 packets, and two packet records |
| Risk | 15/25 | Changes what a HARD BLOCK detector reads as comment text, and edits frozen evidence in other packets |
| Research | 6/20 | The tree, the five probes and the Python string statements were measured on 2026-10-26. The live CI run exists |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Operator: confirm ADR-002, which stops checking text inside template literals and heredocs. Default taken: both are strings.
- Operator: confirm ADR-005, which marks frozen evidence with `hygiene-ok` instead of rewriting it. Default taken: mark it.
- The parent `goal.md` has no binding row for this phase and still counts six phases in its completion criteria. That file is outside this phase's authoring scope, so the coordinator adds the row with `/create:goal` phase-add. The same holds for `006-measurement/spec.md`, which still reads `6 of 6` and does not name this phase as a dependency.

None of these blocks Step 1 in `plan.md`.
<!-- /ANCHOR:questions -->

---
