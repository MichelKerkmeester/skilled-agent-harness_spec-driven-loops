---
title: "Tasks: Phase 15: frontmatter-yaml-validity"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "frontmatter yaml validity tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: frontmatter-yaml-validity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`V` is `.skilled/skills/sk-doc/shared/scripts/validate_document.py`. `U` is `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_yaml.py`. `F` is `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_fleet.py`. `S` is `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh`. `BASE` is the commit the branch starts from, `65bafca332`. "The scan" is `yaml.safe_load` over the frontmatter of every tracked `.skilled` Markdown file whose first line is `---`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the scan at `BASE`. Verify: it printed `29 blocks rejected`, among them `.skilled/skills/sk-code/sk-code-quality/SKILL.md:3: mapping values are not allowed here`, `.skilled/skills/sk-doc/manual-testing-playbook/unknown-fallback/disambiguation-required.md:15`, and three template assets reporting `found unhashable key`.
- [x] T002 Run the base validator on the base quality `SKILL.md`. Verify: `python3 <base V> ... --json` printed `"total_issues": 0, "valid": true`, and the diff of `V` shows no YAML parse before this change.
- [x] T003 Inventory the author field and its readers. Verify: the scan of `BASE` frontmatter printed `9`, all `SKILL.md` files with `author: OpenCode`; `rg -n 'metadata\.author'` over `.skilled .opencode .hermes` scripts printed nothing, and the one `'author'` literal in code is a stop-word entry in `system-spec-kit/shared/trigger-extractor.ts:58`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Quote the value in the 27 blocks a strict parser rejected (`27 tracked .skilled/**` Markdown files). Verify: the scan names none of the 27, and a per-key comparison against `BASE` prints 0 changed values once the added quotes are stripped.
- [x] T005 Move the `version:` line out of the list in `.skilled/skills/sk-doc/manual-testing-playbook/unknown-fallback/disambiguation-required.md` to the end of its frontmatter. Verify: the file parses, and its before/after keys are equal - `expected_leaf_resources` keeps both entries and `version` keeps `2.1.0.20`.
- [x] T006 Add `validate_frontmatter_yaml`, `_frontmatter_block` and `_unquoted_colon_line` to `V`, and call the first from `validate_document` (`V`). Verify: the base quality `SKILL.md` prints 1 blocking `frontmatter_invalid_yaml` at line 3 and the repaired file prints `"total_issues": 0`.
- [x] T007 Write the unit test (`U`). Verify: `python3 U` and `/opt/homebrew/bin/python3 U` each printed `17/17 passed`, exit 0.
- [x] T008 Write the fleet test, with the one fixture excluded by name (`F`). Verify: `python3 -m pytest -q F` printed `2 passed in 3.96s`, exit 0, and the fixture itself fails the parse it asserts stays excluded.
- [x] T009 Remove the `author` line from the nine `SKILL.md` metadata blocks and from `.hermes/plugins/repo-guards/plugin.yaml`, then regenerate the Hermes mirrors. Verify: no tracked `SKILL.md` or plugin manifest carries an `author` key, and `family` and `packetKind` are still there.
- [x] T010 Write the 24 changelog entries and step their carriers (`changelog/*.md`, the `SKILL.md` version lines, and the five hubs' `description.json`, `hub-router.json` and `mode-registry.json`). Verify: `validate_document.py <entry> --json` printed `"total_issues": 0` for every one of the 24.
- [x] T011 Refresh the compiled manifests and export the skill graph. Verify: `node .skilled/bin/compiled-route-guard.cjs` exited 0 with `all 55 served copies match their authored files`, and `node .skilled/bin/compiled-route-sync.cjs --check` exited 0.
- [x] T012 Record the new verdict in the code-folder baseline (`.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json`). Verify: `S` passes with the entry that now carries `frontmatter_invalid_yaml` for the scratch README holding a table block.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Run the scan over the working tree. Verify: it prints `1 block rejected`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/grep-convention/non-yaml.md:2: expected a comment or a line break, but found 'C'`.
- [x] T014 Run both tests and the suite. Verify: `U` printed `17/17 passed` under both interpreters, `F` printed `2 passed`, and `S` printed `all sk-doc script tests passed` with 45 `PASS` lines and 0 `FAIL`, exit 0.
- [x] T015 Run `parent-skill-check` on the five touched hubs and the setup battery. Verify: all five hubs printed `all hard invariants passed, 0 warnings`; the battery printed 8 `PASS` legs and its one `FAIL` is the drift guard on `sk-code-review/scripts/README.md:43`, which this branch does not touch.
- [x] T016 Validate this packet. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The scan reports only the deliberate fixture
- [x] `validate.sh --strict` on this folder prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-007 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `/usr/bin/python3` reports PyYAML 6.0.3; `/opt/homebrew/bin/python3` reports ImportError for `yaml`, which the fallback covers.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The validator's suites pass. Evidence: `S` printed `all sk-doc script tests passed`, 45 `PASS`, 0 `FAIL`, exit 0.
- [x] CHK-011 [P0] Every new changelog entry validates. Evidence: 24 entries, each `"total_issues": 0`.
- [x] CHK-012 [P1] The new functions carry the file's docstring and comment style: what the stand-in is for, and which shapes it skips.
- [x] CHK-013 [P1] The fallback skips the shapes a parser also accepts: block scalars, flow collections, list items, quoted values and trailing comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] The check fails before and passes after on the same file. Evidence: T002 and T006.
- [x] CHK-022 [P1] Both interpreters give the same verdicts. Evidence: 17/17 under each in T007.
- [x] CHK-023 [P1] The fleet test fails on the fixture and passes on the rest. Evidence: T008, and `test_exclusions_are_live` fails when the fixture starts passing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: the quoting shape is `class-of-bug` (28 files), and the validator's blind spot is `cross-consumer`, because it shapes every document's verdict.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n frontmatter .skilled/skills/sk-doc/shared/scripts` names `V` and `quick_validate.py`. The second still reads keys line by line and is unchanged; the fleet test covers every file whichever checker runs.
- [x] CHK-FIX-003 [P0] Consumers: the `n` wrapper, the create-skill assets and the sk-doc tests call the validator, and none match on the new issue type; the code-folder baseline records its shape and was refreshed.
- [x] CHK-FIX-004 [P0] N/A: no path, parser-input or redaction logic changed; the parser reads the content the validator was handed.
- [x] CHK-FIX-005 [P1] Matrix: two interpreters by five block shapes, ten rows, all green.
- [x] CHK-FIX-006 [P1] N/A: no process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence is against base `65bafca332` plus the uncommitted diff in worktree `253-frontmatter-yaml-validity`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the new code reads no environment variable and opens no file the validator was not given.
- [x] CHK-031 [P0] Input validation: a fence whose body holds no key line is not parsed, so a thematic break is never read as frontmatter.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same function, the same two tests and the same 24 carriers.
- [x] CHK-041 [P1] Code comments state why the parse is optional and what the line check stands in for.
- [x] CHK-042 [P2] A changelog entry exists for every touched skill and mode, 24 in all.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files lived in `/tmp` only; the tests use `tempfile` and leave nothing behind.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->

---
