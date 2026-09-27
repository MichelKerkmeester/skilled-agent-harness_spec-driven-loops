---
title: "Fix Phase: sk-doc Validator Notices and Dead Playbook Citations"
description: "validate_document.py applies README rules to any document whose type it cannot detect and says nothing, and quick_validate.py fails a non-qualified MCP tool token in a command but only warns in a skill. Three playbook files cite lines past the end of their target. This phase plans the owner fixes."
trigger_phrases:
  - "validate_document readme fallback notice"
  - "quick_validate mcp token severity"
  - "dead file:line playbook citation"
  - "sk-doc validator owner fix"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Fix Phase: sk-doc Validator Notices and Dead Playbook Citations

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Owner** | `sk-doc` for the two validators, their tests and the hub `README.md`. `system-deep-loop` for the two deep-research playbook files. `system-spec-kit` for the session-capturing playbook file |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 18 |
| **Predecessor** | 011-spec-validator-fixes |
| **Successor** | 013-sk-prompt-framework-docs |
| **Handoff Criteria** | An auto-detected fallback prints a `document_type_fallback` warning with the exit code unchanged, `quick_validate.py` exits 1 for a skill with a non-qualified MCP token, the four dead citations are gone, the owner suite fails no file beyond its baseline failing set (four files at planning, two at the build baseline, both on 2026-09-27) and `validate.sh --strict` passes on this phase |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the cli-jev workflow integration specification. It plans three owner fixes the classifier research recorded in `007-classifier-deep-research/research/research.md` (the owner-report rows at `:468-469`, the citation count at `:478` and ledger rows 101, 103 and 110 to 112). Every file it changes belongs to another skill, so the build follows each owner's contract: `sk-doc`'s `SKILL.md`, `shared/scripts/README.md` and `sk-create-quality-control/references/validation-and-enforcement.md` for the validators. For the three playbook files it follows the manual-testing-playbook format that `validate_document.py` checks as `playbook_feature`. No step calls Jev or Deem, so parent decision D1 has nothing to gate here.

**Scope Boundary**: The README fallback in `validate_document.py`, the MCP-token branch in `quick_validate.py`, one test file per validator, one troubleshooting row in the sk-doc `README.md` and the four dead citations in three playbook files. Every other detection rule, severity, exit code and citation stays as it is.

**Dependencies**:
- None from 008 to 011. The phase can start any time
- 011 changes `sk-create-goal/scripts/check-goal.cjs` and a `system-spec-kit` rule script. Neither file is in this phase's Files to Change table

**Deliverables**:
- A visible warning whenever `validate_document.py` falls back to README rules for a document it could not type
- One blocking severity for a non-qualified MCP tool token in both skill and command frontmatter
- Two deep-research playbook rows repointed to the lines that now hold their anchor text
- Two spec-kit playbook rows removed from a recorded capture, with the capture's note saying why

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name. At close, `specs/cli-jev/003-cli-jev-workflow-integration/changelog/` did not exist, so there was nothing to refresh (see `implementation-summary.md` Deviations).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`detect_document_type` in `.skilled/skills/sk-doc/shared/scripts/validate_document.py` ended with `# Default to readme for general markdown` and `return 'readme'` (`:266-267` at the build-start HEAD `6f47c32dce`). A document no rule matches is checked against README rules, and the output only says `Document type: readme`. Two real cases, run on 2026-09-27: `.skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md` exits 0 as `readme`, and `.skilled/repo-rules/communication.md` exits 1 as `readme` with `Missing required section: overview`. The reader cannot tell a README verdict from a guess. Separately, `quick_validate.py` returns invalid for a non-qualified MCP tool token when the target is a command, but appends a warning and stayed valid for a skill (`:248-251` before the build), although its own comment says "Either surface must fully-qualify any MCP tool token" (`:240-241` after the build). Finally, three playbook files cite lines past the end of their target: `.skilled/commands/deep/research.md` has 159 lines and is cited at `:307-317` and `:176-185`, and `runtime/cli/tests/memory-pipeline-regressions.vitest.ts` has 62 lines and is cited at `:67` and `:109`.

### Purpose
A fallback verdict says it is a fallback, one MCP-token rule holds for every package kind and the four dead citations either point at the text they describe or are gone.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One non-blocking `document_type_fallback` warning when `validate_document.py` reaches the final README default with no `--type` given
- One blocking result for a non-qualified MCP tool token in `quick_validate.py`, for skills as for commands
- Tests for both changes, happy path plus one edge case each, in the owner's existing test files
- One row in the sk-doc `README.md` troubleshooting table that names the new warning
- Repointing the two deep-research playbook citations to `deep-research-presentation.txt`, where the anchor text now lives
- Removing the two memory-pipeline rows from the recorded capture in the spec-kit playbook and extending the capture's existing note

### Out of Scope
- Changing any detection rule, so that a playbook root index or a repo-rule document gets its own type. That is a new rule set the owner has not asked for
- Failing the run on a fallback. Callers such as `create-manual-testing-playbook-auto.yaml:176` and `create-feature-catalog-confirm.yaml:205` validate root index files without `--type` and would start failing
- The `Unknown document type` path inside `validate_document()` in `validate_document.py`, which returns without a `document_type` key. It is reachable only through an explicit `--type` whose rules are missing and was not named by the research
- A citation-drift scanner (R24 in the research). This phase fixes the four counted dead citations by hand
- Other citations in the same playbook tables. Several have drifted inside their file, and one (`iteration-citation-jsonl.md:102`, `research.md:157-179`) ends past line 159. The research did not count them as dead, so they are recorded as an open question
- Any Jev or Deem call

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Mark a detection that reached the README default and add one `document_type_fallback` warning to the result when the caller gave no type. Exit codes stay 0, 1 and 2 |
| `.skilled/skills/sk-doc/shared/scripts/quick_validate.py` | Modify | Return invalid for a non-qualified MCP tool token whatever the package kind. Add the rule to the docstring's `Validates:` list |
| `.skilled/skills/sk-doc/scripts/tests/test_structure_validation.py` | Modify | Two pytest cases for the fallback warning |
| `.skilled/skills/sk-doc/scripts/tests/test_quick_validate_086.py` | Modify | Two cases for the MCP-token rule on a skill fixture |
| `.skilled/skills/sk-doc/README.md` | Modify | The "Wrong document type detected" row at `:159` names the new warning |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md` | Modify | Row at `:119` cites `deep-research-presentation.txt:379-388` instead of `research.md:307-317` |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md` | Modify | Row at `:105` cites `deep-research-presentation.txt:233-236` instead of `research.md:176-185` |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/session-capturing-pipeline-quality-coverage.md` | Modify | Remove capture rows `:117-118` and extend the note at `:100` to say why |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Make the README fallback visible. When `validate_document()` runs with no `doc_type` and detection reaches the final default, the result's `warnings` carries one entry of type `document_type_fallback` that names the file, says README rules were applied because no type rule matched and gives the fix hint to pass `--type`. The entry has severity `warning`, so `valid` and `exit_code` do not change. `detect_document_type()` keeps its signature and return value, so the three test files that import it (`test_changelog_validator.py`, `test_category_classification_denumbered.py` and `test_root_name_consumer_matrix.py`) are untouched. An explicit `--type`, a detected type and a skipped path produce no such entry. The owner's contract picks a notice over a failure: `validation-and-enforcement.md` makes exit 1 the delivery block for a document defect, and a missing type rule is not one |
| REQ-002 | Give a non-qualified MCP tool token one severity. `quick_validate.py` returns invalid for such a token in a skill exactly as it does for a command, with the message that tells the author to use `mcp__<server>__<tool>`. The standard is the owner's own: the comment at `quick_validate.py:240-241`, `sk-create-command/SKILL.md:220` and the MCP example at `sk-create-frontmatter/assets/frontmatter-templates.md:329-330`. Blocking breaks no current file: 0 of 226 tracked markdown files with `allowed-tools` outside `specs/` carry a non-qualified token (counted 2026-09-27) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Repoint the `exhausted-approach-respect.md` source row. Its anchor, "command differences include externalized state and negative knowledge", now lives in the Key Differences block of `.skilled/commands/deep/assets/deep-research-presentation.txt` (`:379` heading, `:383` externalized state, `:386` negative knowledge, `:388` last bullet). The row cites `:379-388` |
| REQ-004 | Repoint the `pause-sentinel-halt.md` source row. Its anchor, "command output contract names research packet state", now lives in the Contract block of the same presentation file (`:233` heading, `:236` the `**Outputs:**` line naming the `{artifact_dir}` research packet and its state files). The row cites `:233-236` |
| REQ-005 | Remove the two dead rows in the spec-kit playbook. The content is gone: `memory-pipeline-regressions.vitest.ts` has 62 lines and no import from `../../shared/embeddings` (its one mention is a `vi.doUnmock` string at `:28`). The rows sit inside a recorded `npm run check` capture, so the build removes rows `:117-118` and extends the capture's own note at `:100` to say they were removed and why, rather than rewriting the capture's `17 violation(s)` count |
| REQ-006 | Add no failure to the owner suite. `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` already fails before this phase: on 2026-09-27 it exited 1 with `4 failing: test_create_skill_contract.py test_readme_manifest.py test_rename_tooling_fixture_harness.py test_root_name_consumer_matrix.py`, one of them on a missing `@spec-kit/shared/frontmatter/parse-frontmatter.js` module. After the change the failing set is the same four files or a subset, `test_structure_validation.py` and `test_quick_validate_086.py` print `PASS`, and `validate_document.py` still reports each of the three edited playbook files `VALID` as `playbook_feature`. The four existing failures are not this phase's to fix. At the build baseline on 2026-09-27 only two of them failed (`test_readme_manifest.py` and `test_rename_tooling_fixture_harness.py`), so the build compared against that set by name |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/manual-testing-playbook/manual-testing-playbook.md --json` prints a `document_type_fallback` warning and still exits 0.
- **SC-002**: A skill fixture whose `allowed-tools` holds `mcp__code_mode` makes `quick_validate.py` exit 1, and the same fixture with `mcp__code_mode__call_tool_chain` exits 0.
- **SC-003**: `rg -n -e 'deep/research\.md:307' -e 'deep/research\.md:176' -e 'regressions\.vitest\.ts:67' -e 'regressions\.vitest\.ts:109' .skilled/skills` prints nothing, and each repointed range lies inside its 407-line target.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The owners' recent history. `validate_document.py` last changed in `666abc1a22e` and `e33f1a6ff3e` (both 2026-09-27, after planning, which moved its pins by 11 lines; `aa07fae5fa` of 2026-09-18 was the last change at planning), `quick_validate.py` in `db8af052ca` (2026-09-17), the two deep-research playbook files in `e14d5b196b` and the spec-kit playbook file in `56772cb93c` (both 2026-09-17), the presentation file in `38f6fa4521` (2026-09-23). `git status` showed no uncommitted change on any of these paths on 2026-09-27 | A newer owner change lands first and moves the cited lines | T001 reruns the history and the line pins before any edit |
| Dependency | 011 edits `check-goal.cjs` and `check-ac-coverage.sh`, 013 edits sk-prompt files | None share a file with this phase | Files to Change tables compared at handoff |
| Risk | A caller treats any warning as failure | Low. No CI or hook calls either validator (`rg` over `.github` and `.skilled/hooks` found none), and `test_validator.py` compares exit codes and blocking errors only | REQ-006 reruns the whole owner suite |
| Risk | The owner suite is already red, so a new failure could hide among the old ones | Med | REQ-006 compares the failing file set by name before and after, not the exit code |
| Risk | A skill author relied on the old warning to ship a non-qualified token | Low. The count found none | The failure message names the fully qualified form |
| Risk | The presentation file moves again and the new pins drift | Med | Anchor text is kept in each row, so a later reader can find the block by its words |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fallback check adds one comparison per validation run and no file read.
- **NFR-P02**: Not applicable beyond that. No change touches a loop over the corpus.

### Security
- **NFR-S01**: No step reads `.env` or any credential, and no step makes a network call.
- **NFR-S02**: Blocking a non-qualified MCP token narrows what a skill may declare. It never widens it.

### Reliability
- **NFR-R01**: `validate_document.py` keeps exits 0, 1 and 2 as documented in its docstring (`:18-21`) and in `shared/scripts/README.md`. `quick_validate.py` keeps `sys.exit(0 if valid else 1)` (`:326` after the build).
- **NFR-R02**: The JSON output keeps every existing key. The notice arrives through the existing `warnings` list.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty markdown file with no `--type` still reaches the default and gets the notice.
- Maximum length: not applicable.
- Invalid format: a server-only token (`mcp__code_mode`) and a bare `mcp_` token are non-qualified. A wildcard tool (`mcp__code_mode__*`) and any token outside the `mcp_` namespace stay valid, as `_MCP_FULLY_QUALIFIED_RE` (`quick_validate.py:119-122`) already defines.

### Error Scenarios
- External service failure: none. Both validators are local.
- Network timeout: not applicable.
- Concurrent access: not applicable.

### State Transitions
- Partial completion: each of the three fixes lands alone. A reverted validator change leaves the citation fixes intact.
- Session expiry: not applicable.
- `--fix` run: the re-validation after fixes (in `validate_document.py`'s `main()`) passes the same `--type`, so the notice appears again only when it applied the first time.
- `--blocking-only`: warnings are hidden, the notice with them. That flag asks for blocking output only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Eight files across three owners. About 40 changed lines of code and tests, plus four citation edits |
| Risk | 5/25 | Exit contracts stay. One warning becomes a failure that no current file triggers |
| Research | 2/20 | Every cited line reopened on 2026-09-27 |
| **Total** | **14/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Other drifted playbook citations (for `system-deep-loop`).** The same deep-research playbook tables hold citations that are in range but no longer point at their anchor, such as `spec-fence-writeback.md:102` citing `research.md:35-38` for a lock note that now sits at `:51-54`. `iteration-citation-jsonl.md:102` cites `research.md:157-179`, which ends past line 159. The research counted only start lines past the end as dead. Should the owner fix these by hand now, or wait for a drift scanner?
- **A type rule for index files (for `sk-doc`).** After this phase a playbook root index and a feature-catalog root index still validate as `readme`, now with a notice. Should they get their own types?
<!-- /ANCHOR:questions -->

---
