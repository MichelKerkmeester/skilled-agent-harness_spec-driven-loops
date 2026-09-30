---
title: "Feature Specification: Phase 11: spec-validator-fixes"
description: "AC_COVERAGE counts any file:line shape in a Verification cell as evidence without checking that the file exists or the line is in range, check-goal.cjs refuses a path that ends in goal.md, and create.sh --phase --parent labeled each new child by its position in the batch until another packet fixed it at the source. This phase fixes the first two and pins the third with a test, with every existing contract kept."
trigger_phrases:
  - "ac coverage unresolved citation"
  - "ac coverage file line existence check"
  - "check-goal goal.md path"
  - "spec validator owner fixes"
  - "create.sh phase label folder number"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: spec-validator-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 17 |
| **Predecessor** | 010-trigger-index-search-fixes |
| **Successor** | 012-sk-doc-validator-and-reference-fixes |
| **Handoff Criteria** | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` ends with `0 failed`, `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` reports `fail 0`, and this phase's Files to Change table shares no file with 010 or 012 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Owner fixes and follow-ups found during the classifier research specification. It plans two owner fixes the round-3 research recorded for the spec validators (`../007-classifier-deep-research/research/research.md` section 6, `## 6. D: Validators`, line 466, question 48 at line 1171 and ledger row 97 at line 1468), plus one `create.sh` labeling fix the orchestrator confirmed on 2026-09-27 while adding phases 010 to 017 to this packet. No classifier is used and no model is called.

**Scope Boundary**: Two validators and their tests and docs. `check-ac-coverage.sh` (owner `system-spec-kit`) gains a resolution rule for a cited `file:line` and reports the citations that do not resolve. Its floor, cutoff, advisory default and covered count stay exactly as they are. `check-goal.cjs` (owner `sk-doc/sk-create-goal`) accepts a path ending in `goal.md` at its command line. Its five checks, its exports and its exit codes 0, 1 and 2 stay exactly as they are. `create.sh` (owner `system-spec-kit`) labels each child it adds with the number in the child's folder prefix. That fix landed at its source in `8036425eaa`, from another packet, so this phase edits no line of `create.sh` and only adds the shell test that pins the labels.

**Dependencies**:
- None on other phases. 010 and 012 touch no file in this phase's Files to Change table
- The completed packet `specs/system-speckit/033-system-speckit-v4/032-recorded-findings-closure/015-criteria-file-line-enforcement`, whose cutoff, lifecycle activation and floor this phase keeps unchanged
- Phase 006 (`../006-goal-criteria-lint`) plans a check that `check-goal.cjs` is unchanged by its own build. See Risks

**Deliverables**:
- An unresolved-citation detail line from `AC_COVERAGE`, with the covered count unchanged
- `check-goal.cjs <folder>/goal.md` behaving exactly like `check-goal.cjs <folder>`
- Test cases for both, and one sentence of owner documentation for each
- A recorded owner decision on whether an unresolved citation should stop counting as coverage
- `create.sh --phase --parent` labels matching each child's folder number, with an append-mode test
- A recorded owner decision on whether `validate.sh` or `repair-derived.cjs` should catch a label that disagrees with the folder number

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`AC_COVERAGE` treats any `file:line` shape in a Verification cell as evidence. The shape test is `has_file_line()` at `check-ac-coverage.sh:291` for the canonical criteria table, used at `:327`, and a second copy at `:346` for the legacy traceability table. Neither checks that the file exists or that the line is inside it, so a typo or a stale path counts the same as a real citation. A read-only scan on 2026-09-27 of the 374 `acceptance-criteria.md` files under `specs/` (outside `z_archive`) found 1,112 citations in 787 rows. 455 of them name no file under the resolution rule this phase plans (packet folder, then repository root), and none names a line past the end of a file that exists. Separately, `check-goal.cjs` rejects `<folder>/goal.md`: `loadPacketContext()` throws `packet path is not a directory` (`check-goal.cjs:89-92`) and the run exits 2. Reproduced on 2026-09-27 against `006-goal-criteria-lint/goal.md`, while the same folder passes 4/4 and exits 0. Third, at planning time `create.sh --phase --parent <existing parent>` built each new child's label from the loop index `_i` (`create.sh:1489` for `graph-metadata.json`, `:1511` for `description.json` and `:1523` for the scaffold title), so the label was the child's position in this batch. `8036425eaa` has since fixed this at the source, and the labels now use `_phase_number` at `create.sh:1494`, `:1516` and `:1528`. The folder name, the phase map and the metadata row already used `_phase_number` (`create.sh:1236`, `:1252` and `:1541`). When phases 010 to 017 were added to this packet, 010 got "Phase 1", 011 "Phase 2", 012 "Phase 3" and 015 "Phase 6", and 018 later got "Phase 1". Neither `repair-derived.cjs` nor `validate.sh --strict` noticed. A read-only scan of 2,183 `description.json` files on 2026-09-27 found 27 with a `Phase N:` label, 14 of them disagreeing with their folder number, across three tracks.

### Purpose
A reader of `validate.sh` output can see which cited `file:line` does not resolve, `check-goal.cjs` checks the right folder when it is handed that folder's `goal.md`, and a child added by `create.sh --phase --parent` carries its folder's number, with no other contract changed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A resolution rule for each cited `file:line` in both `AC_COVERAGE` parsers: an absolute path as written, else the packet folder, else the repository root. A citation resolves when that file can be read and its line number is between 1 and the file's line count
- One `RULE_DETAILS` line that names every unresolved citation with its AC id. The covered count, the rule status, the floor, the cutoff and the advisory default do not change
- A `check-goal.cjs` command-line argument whose last segment is `goal.md` and that is not a directory is replaced by its folder before the checks run
- Test cases for both changes, one sentence in `validation-rules.md` and one line in the sk-create-goal `scripts/README.md`
- A recorded owner decision on counting, with each option's measured cost
- An append-mode case in `tests/test-phase-system.sh` that pins the folder-number labels in `create.sh`'s child loop. The loop change itself landed in `8036425eaa`
- A recorded owner decision on detecting a label that disagrees with its folder number

### Out of Scope
- Making an unresolved citation stop counting as coverage. The measured cost is in section 10, and the choice is the owner's
- A wider resolution rule, such as a skill-root or a file-suffix search. It is option C of the open decision, not this build
- The floor, `SPECKIT_AC_COVERAGE_CUTOFF`, `SPECKIT_AC_COVERAGE_ENFORCE`, the lifecycle activation and the Manual-infeasible exemption. The completed packet `015-criteria-file-line-enforcement` owns them
- The shape test itself, including `file:12-20` range citations it does not match. Changing what counts as a citation changes the covered count
- The exported `check-goal.cjs` functions. Their documented argument stays a packet directory
- `check-goal.cjs --all`, and the README's description of its exit code
- Retrofitting any packet's citations
- Relabeling the 13 mismatched folders outside this one. Their owners, or option C of the label decision, handle them
- Any other `create.sh` behavior, including the `phase ${_i}` wording in its two generator warnings
- Building label detection in `validate.sh` or `repair-derived.cjs`. It waits for the owner's answer

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh` | Modify | Resolve each cited `file:line` in `_ac_analyze_canonical()` and `_ac_analyze_traceability()`, return the unresolved list as a new field and add one detail line in `run_check()` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` | Modify | Add cases for a resolving citation, a missing file, a line past the end, repository-root resolution and the legacy path |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Add unresolved citations to the list of what the advisory rule reports (the paragraph at line 95) |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` | Modify | In `main()`, replace a `goal.md` file argument with its folder before `checkGoalPacket()` |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs` | Modify | Add a command-line case for a `goal.md` path and one for a non-goal file path |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/README.md` | Modify | Say in section 5 that `<packet>` may be the folder or its `goal.md` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | None | Not edited by this phase. `8036425eaa` already uses the folder's phase number in the three labels |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` | Modify | Log each generator `--description` in the stub and assert "Phase 2" and "Phase 3" labels for children appended after `001` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `AC_COVERAGE` resolves each cited `file:line` in both parsers. An absolute path is used as written. A relative path is tried in the packet folder, then in the repository root from `git -C <folder> rev-parse --show-toplevel`, falling back to the working directory as `check-spec-doc-integrity.sh:13-15` does. A citation resolves only when the file can be read and 1 <= line <= its line count |
| REQ-002 | Every unresolved citation appears in one detail line, `Unresolved evidence citation(s): AC-003 (runtime/x.ts:12), ...`, naming the AC id and the citation as written, including an unresolved citation in a row that also has a resolving one |
| REQ-003 | The covered count, the rule status, the floor, the cutoff and the advisory default are unchanged. All 25 existing cases in `tests/check-ac-coverage.sh` pass without edits, and a fixture's `covered/total` is the same whether its cited files exist or not |
| REQ-004 | `check-goal.cjs <folder>/goal.md` prints the same lines and exits with the same code as `check-goal.cjs <folder>` |
| REQ-005 | The `check-goal.cjs` exit contract is frozen: `module.exports` is unchanged, a finding still exits 1 and an error still exits 2 from `main()` and its `require.main` caller, and a path to a file not named `goal.md` still exits 2 with `packet path is not a directory` |
| REQ-009 | `create.sh --phase --parent <existing parent>` labels each new child `Phase <N>: <slug>`, where N is the child folder's `NNN` prefix read as a base-10 number (`10#`), at the three label sites in the child loop. A new parent's children keep the labels they get today, since their prefix equals their position. `8036425eaa` meets this at `create.sh:1494`, `:1516` and `:1528`, computing N with the formula that builds the folder prefix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | New tests cover each changed surface with a happy path and one edge case: the canonical parser, the legacy parser and the `check-goal.cjs` command line. Both suites pass in full |
| REQ-007 | `validation-rules.md` names unresolved citations among what `AC_COVERAGE` reports, and the sk-create-goal `scripts/README.md` says `<packet>` may be a folder or its `goal.md` |
| REQ-008 | The owner decision on counting (section 10) is recorded with its options and measured costs, and the build makes no counting change without the `system-spec-kit` owner's yes |
| REQ-010 | `tests/test-phase-system.sh` gains an append-mode case: after `001-foundation` exists, `--phase --parent --phases 2` labels `002-implementation` "Phase 2" and `003-integration` "Phase 3" in `description.json` (through the stub log), `graph-metadata.json` and the `spec.md` title. The existing 10 cases still pass |
| REQ-011 | The owner decision on detecting a label that disagrees with its folder number (section 10) is recorded with its options and the measured count, and the build adds no detection without the `system-spec-kit` owner's yes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on a packet whose criteria cite a missing file prints an `AC_COVERAGE` detail naming that AC id, and its `covered/total` equals the value before the change
- **SC-002**: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md` exits 0 with `RESULT: PASSED (5/5 checks)`, where before this phase it exited 2
- **SC-003**: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` and `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` both report zero failures, from a baseline of 25 passed and 18 passed on 2026-09-27 (the planning run recorded 15)
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` reports 0 failed with more than 10 passed, from a baseline of `10 passed, 0 failed (of 10)` on 2026-09-27
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `015-criteria-file-line-enforcement` (Complete) owns the floor, cutoff, enforce switch and lifecycle activation | A change to any of them would reopen that packet's closure | REQ-003 keeps all of them. The existing 25 cases are the regression guard |
| Dependency | Phase 006 plans `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` after its build and copies the parser at `check-goal.cjs:135-144`, `:162-201` and `:207-212` | An uncommitted 011 edit would fail 006's check. A line shift would move 006's citations | The 011 edit sits in `main()`, below every copied line, so none of them shift. Commit 011 before 006's check runs, or run 006's check before 011 starts. The orchestrator chooses the order |
| Risk | Many real citations do not resolve under this rule. 455 of 1,112 name no file, often skill-relative paths such as `runtime/cli/rules/check-ac-coverage.sh:381` in `specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/010-template-contract-alignment/acceptance-criteria.md:61` | The detail line is long on older packets | Report only. The counting change waits for the owner (REQ-008) |
| Risk | `read` with a tab `IFS` merges empty fields, so an empty malformed-id field followed by a new field shifts the read at `check-ac-coverage.sh:430` | The unresolved list lands in the wrong variable | Write `-` for an empty id list and treat `-` as empty when reading |
| Risk | A folder prefix with a leading zero, such as `008`, read as octal by bash arithmetic | `$((008))` is an error in bash | Read it as `$((10#${_child_folder%%-*}))`, and cover `008` or higher in the test if the fixture reaches it |
| Risk | awk `getline` behaves differently on a directory across BSD awk and gawk | macOS awk aborts the whole program with `i/o error` and exit 2, which would stop the rule | Resolved in the build: awk only carries the citations out, and bash builtins in `run_check` resolve them, so a directory is reported unresolved and the rule exits 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rule reads each cited file once per citation, with bash builtins after the awk pass. The build times `validate.sh --strict` on the packet with the most citations before and after, and records both numbers
- **NFR-P02**: No new process per citation. One `git rev-parse` call per rule run finds the repository root

### Security
- **NFR-S01**: The rule only reads files. It never writes, never follows a citation into a command and never prints file content, only the citation text
- **NFR-S02**: `check-goal.cjs` stays read-only. The path change only picks which folder to read

### Reliability
- **NFR-R01**: A citation that cannot be read, for any reason, is reported as unresolved and never stops the rule
- **NFR-R02**: With git unavailable the root falls back to the working directory, as the existing precedent does, and the rule still runs
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a Verification cell with no citation is unchanged. It is either prose (malformed) or blank, exactly as today
- Maximum length: a row with several citations lists each unresolved one. The detail line is not capped, since a criteria table holds tens of rows at most
- Invalid format: line 0, or a line past the end of the file, is unresolved. A path with an ellipsis such as `.../x.md:20` is unresolved

### Error Scenarios
- External service failure: git missing or the folder outside a repository. The root falls back to the working directory
- Network timeout: not applicable. No network call
- Concurrent access: not applicable. Both validators only read

### State Transitions
- Partial completion: if only one of the two fixes lands, each stands alone. They share no file
- Session expiry: not applicable
- `check-goal.cjs` given `<folder>/goal.md` where the folder has no `goal.md`: the existing read error surfaces and the run exits 2
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Seven files in two skills: shell and awk in the rule, 5 lines of JavaScript, three test files and two doc lines. No `create.sh` line |
| Risk | 9/25 | A shared validator used by every `validate.sh` run. Report-only keeps the pass and fail outcome unchanged |
| Research | 4/20 | The defects, lines and corpus impact are measured already |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Owner decision (system-spec-kit): should an unresolved citation stop counting as coverage?** Measured on 2026-09-27 by a read-only scan of 374 criteria files. Option A, report only, is what this phase builds. It costs nothing in outcomes, and a shape-only citation still counts, now with a visible detail. Option B: a row whose citations all fail to resolve stops counting. 56 of the 97 packets at or above the 0.9 floor today would fall under it, and with `SPECKIT_AC_COVERAGE_ENFORCE=true` a post-cutoff packet among them would fail. Option C: option B plus a wider resolution rule (a skill root or a unique `git ls-files` suffix match). It recovers skill-relative citations, but adds ambiguity, more reads and a second rule to maintain. Recommendation: A now, then B once the owner retrofits or accepts the drop
- **Owner decision (system-spec-kit): should anything catch a phase label that disagrees with its folder number?** Measured on 2026-09-27: 27 of 2,183 `description.json` files carry a `Phase N:` label and 14 disagree with their folder, in `cli-jev`, `system-speckit` and `cli-external-orchestration`. Many leaves replace the label with a real description, so a mismatch only survives in untouched scaffold text. Option A: fix at the source only. It costs nothing, and the 13 other mismatched folders stay wrong until their owners edit them. Option B: a `validate.sh` warning when a `description.json`, `graph-metadata.json` or `spec.md` title starting `Phase N:` names a number other than the folder's. It costs one more rule, and it would warn on every existing mismatch at once. Option C: `repair-derived.cjs` rewrites a label only when it exactly matches the scaffold default `Phase N: <folder slug>` and N differs from the folder number. It leaves authored text alone and fixes the 13 on the next repair run. Recommendation: A in this build, then C, because the label is derived data only while it is the untouched default
- Should the exported `check-goal.cjs` functions also accept a `goal.md` path? This phase says no, because their JSDoc documents a packet directory. The sk-create-goal owner can widen it later
<!-- /ANCHOR:questions -->

---

