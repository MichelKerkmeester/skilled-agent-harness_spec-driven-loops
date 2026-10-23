---
title: "Tasks: Phase 7: playbook-catalog-readme-alignment"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command, and each dispatched task carries its full worker brief."
trigger_phrases:
  - "playbook catalog readme alignment tasks"
  - "template authoring scenario brief"
  - "catalog and readme alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: playbook-catalog-readme-alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` with the command whose output proves the task.

Shell variables used below, set once by the conductor:
- `WORKTREE`: the build worktree path recorded in `../goal.md` section 4.
- `PHASE`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment`
- `S`: `.skilled/skills/system-spec-kit`
- `START`: the commit hash recorded by T002.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check the tools, the provider and the predecessor artifacts (no file). Verify: `opencode2 --version && opencode2 models --standalone | grep -c 'llmgateway/deepseek-v4.1-flash-1017' && test -f $S/runtime/cli/spec/check-example-drift.sh && echo drift-guard-present && test -f $S/runtime/cli/spec/check-card-sync.sh && echo card-guard-present && test -f $S/references/workflows/spec-authoring-card.md && echo card-present` prints a version line, a count of at least 1, then `drift-guard-present`, `card-guard-present` and `card-present`. A missing guard or card means phase 4 or phase 5 is not closed: STOP the phase and record which one.
- [ ] T002 Record the start state (`goal.md`, `scratch/baseline/status-start.txt`, `scratch/baseline/start-commit.txt`, `scratch/baseline/suite-start.txt`). Run `mkdir -p "$PHASE/scratch/baseline"`, then run `git -C "$WORKTREE" rev-parse HEAD`, replace the `Pending` cell of the `Start commit` row in the Progress table in `goal.md` section 4 with the hash, then run `git -C "$WORKTREE" status --porcelain > "$PHASE/scratch/baseline/status-start.txt"`, then run `npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-start.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-start.txt"`. Phases 8 and 9 compare their suite runs with this file. Verify: `grep -cE '^\| Start commit \| [0-9a-f]{7,}' "$PHASE/goal.md"` prints `1`, and `tail -1 "$PHASE/scratch/baseline/suite-start.txt"` prints an `exit=` line, and `grep -cE '^ *(Test Files|Tests) ' "$PHASE/scratch/baseline/suite-start.txt"` prints at least `2`.
- [ ] T003 Read the three owner contracts and record the target baseline (`scratch/baseline/contracts.txt`, `scratch/baseline/counts.txt`). Read `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`, `.skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md` and `.skilled/skills/sk-doc/sk-create-readme/SKILL.md` completely. Then run this block from `$WORKTREE`. Verify: `cat "$PHASE/scratch/baseline/contracts.txt"` prints three `=present` lines, and `cat "$PHASE/scratch/baseline/counts.txt"` prints four `=` lines.

  ```bash
  for f in sk-create-manual-testing-playbook sk-create-feature-catalog sk-create-readme; do
    test -f ".skilled/skills/sk-doc/$f/SKILL.md" && echo "$f=present"
  done > "$PHASE/scratch/baseline/contracts.txt"
  {
    echo "playbook_md=$(find $S/manual-testing-playbook -name '*.md' | wc -l | tr -d ' ')"
    echo "catalog_leaf_md=$(find $S/feature-catalog -mindepth 2 -name '*.md' | wc -l | tr -d ' ')"
    echo "readme_lines=$(wc -l < $S/README.md | tr -d ' ')"
    echo "templates_readme_lines=$(wc -l < $S/templates/README.md | tr -d ' ')"
  } > "$PHASE/scratch/baseline/counts.txt"
  ```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Lane A: write the eight scenario files (`$S/manual-testing-playbook/template-authoring/*.md`). Write the brief to `scratch/briefs/T004-A.txt` from the skeleton in `plan.md` section AI EXECUTION PROTOCOL, then append the lane text below. Dispatch with the plan's dispatch command. Verify: `for f in placeholder-token-warning-while-draft placeholder-token-error-after-draft placeholder-gate-legacy-stamp-unchanged example-drift-guard-catches-leak golden-render-all-levels authoring-card-router-intents authoring-card-sync-guard level-1-packet-authored-from-card; do test -f "$S/manual-testing-playbook/template-authoring/$f.md" && printf '%s %s\n' "$f" "$(grep -c '^## ' "$S/manual-testing-playbook/template-authoring/$f.md")"; done` prints eight lines, and every line ends with `5`.

  ```text
  ALLOWED WRITE PATHS:
    .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/

  TASK: Create one category folder and eight scenario files.
  1. Read .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md and
     .skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md
     before you write.
  2. Run: mkdir -p .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring
  3. Open specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/plan.md.
     Sections 3.2 to 3.9 hold eight fenced blocks, one per file, in this
     order: placeholder-token-warning-while-draft, placeholder-token-error-after-draft,
     placeholder-gate-legacy-stamp-unchanged, example-drift-guard-catches-leak,
     golden-render-all-levels, authoring-card-router-intents, authoring-card-sync-guard,
     level-1-packet-authored-from-card.
  4. For each block, copy the text inside the fence into
     .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/<name>.md.
     Do not copy the outer four-backtick fence. Do not change a word. Do not add or
     remove a section.
  5. Do not create any other file.

  VERIFY before you finish:
    for f in placeholder-token-warning-while-draft placeholder-token-error-after-draft placeholder-gate-legacy-stamp-unchanged example-drift-guard-catches-leak golden-render-all-levels authoring-card-router-intents authoring-card-sync-guard level-1-packet-authored-from-card; do test -f ".skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/$f.md" && printf '%s %s\n' "$f" "$(grep -c '^## ' ".skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/$f.md")"; done
  Every line must end with 5.
  RETURN exactly one line: T004 DONE - 8 files
  ```

- [ ] T005 [P] Lane B: write the four catalog leaves (`$S/feature-catalog/tooling-and-scripts/*.md`). Write the brief to `scratch/briefs/T005-B.txt` from the skeleton in `plan.md` section AI EXECUTION PROTOCOL, then append the lane text below. Dispatch with the plan's dispatch command. Verify: `for f in versioned-placeholder-gate template-section-fill-guidance example-drift-guard spec-authoring-card; do test -f "$S/feature-catalog/tooling-and-scripts/$f.md" && printf '%s %s\n' "$f" "$(grep -c '^## ' "$S/feature-catalog/tooling-and-scripts/$f.md")"; done` prints four lines, and every line ends with `4`.

  ```text
  ALLOWED WRITE PATHS:
    .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/

  TASK: Write four feature catalog leaves.
  1. Read .skilled/skills/sk-doc/sk-create-feature-catalog/SKILL.md and
     .skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-snippet-template.md
     before you write.
  2. Open specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/plan.md.
     Sections 3.10.1 to 3.10.4 hold four fenced blocks, one per file, in
     this order: versioned-placeholder-gate, template-section-fill-guidance,
     example-drift-guard, spec-authoring-card.
  3. For each block, copy the text inside the fence into
     .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/<name>.md.
     Do not copy the outer backtick fence. Do not change a word. Do not add or remove a
     section. Do not change the frontmatter title or description.
  4. Do not create any other file.

  VERIFY before you finish:
    for f in versioned-placeholder-gate template-section-fill-guidance example-drift-guard spec-authoring-card; do test -f ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/$f.md" && printf '%s %s\n' "$f" "$(grep -c '^## ' ".skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/$f.md")"; done
  Every line must end with 4.
  RETURN exactly one line: T005 DONE - 4 files
  ```

- [ ] T006 [P] Lane C: apply the six document edits (`$S/README.md`, `$S/templates/README.md`, `$S/references/validation/validation-rules.md`, `$S/references/validation/path-scoped-rules.md`, `$S/references/templates/template-style-guide.md`, `$S/references/workflows/quick-reference.md`). Write the brief to `scratch/briefs/T006-C.txt` from the skeleton in `plan.md` section AI EXECUTION PROTOCOL, then append the lane text below. Dispatch with the plan's dispatch command. Verify: `rg -c 'YOUR_VALUE_HERE' $S/README.md` prints at least `1`, `rg -c 'check-example-drift.sh' $S/README.md` prints `1`, `rg -c 'Lifecycle For Docs Stamped v2.3 Or Later' $S/references/validation/validation-rules.md` prints `1`, `rg -c 'ERROR or WARNING' $S/references/validation/path-scoped-rules.md` prints `1`, `rg -c 'Placeholder completion while Draft' $S/references/templates/template-style-guide.md` prints `1`, `rg -c 'spec-authoring-card.md' $S/references/workflows/quick-reference.md` prints `1`, and `rg -c 'PLACEHOLDER\]' $S/references/templates/template-guide.md` prints nothing.

  ```text
  ALLOWED WRITE PATHS:
    .skilled/skills/system-spec-kit/README.md
    .skilled/skills/system-spec-kit/templates/README.md
    .skilled/skills/system-spec-kit/references/validation/validation-rules.md
    .skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md
    .skilled/skills/system-spec-kit/references/templates/template-style-guide.md
    .skilled/skills/system-spec-kit/references/workflows/quick-reference.md

  TASK: Apply six sets of exact text edits.
  1. Read .skilled/skills/sk-doc/sk-create-readme/SKILL.md before you edit a README.
  2. Open specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/plan.md section 3.11.
     It holds edits E1.1 to E6.1. Each edit names a file, an
     exact old text and an exact new text.
  3. Apply each edit with the edit tool. Apply them in the order E1.1, E1.2, E1.3, E1.4,
     E1.5, E2.1, E2.2, E3.1, E3.2, E4.1, E4.2, E5.1, E5.2, E6.1.
  4. If an old text does not match exactly once, stop that file and report the file plus
     the old text. Do not guess a replacement.
  5. Do not edit .skilled/skills/system-spec-kit/references/templates/template-guide.md.
     Phase 3 owns it. Only check it.

  VERIFY before you finish:
    rg -c 'YOUR_VALUE_HERE' .skilled/skills/system-spec-kit/README.md
    rg -c 'check-example-drift.sh' .skilled/skills/system-spec-kit/README.md
    rg -c 'Lifecycle For Docs Stamped v2.3 Or Later' .skilled/skills/system-spec-kit/references/validation/validation-rules.md
    rg -c 'ERROR or WARNING' .skilled/skills/system-spec-kit/references/validation/path-scoped-rules.md
    rg -c 'Placeholder completion while Draft' .skilled/skills/system-spec-kit/references/templates/template-style-guide.md
    rg -c 'spec-authoring-card.md' .skilled/skills/system-spec-kit/references/workflows/quick-reference.md
    rg -c 'PLACEHOLDER\]' .skilled/skills/system-spec-kit/references/templates/template-guide.md || true
  The first six commands print 1 or more. The last command prints nothing.
  RETURN exactly one line: T006 DONE - 14 edits
  ```

- [ ] T007 Add the playbook category and the index section (`$S/manual-testing-playbook/manual-testing-playbook.md`). Two edits. Edit 1 adds the category bullet. Edit 2 adds Section 7.9 before Section 8. The two fenced blocks below are indented two spaces for list layout. Remove the two leading spaces from every copied line. Verify: `for id in 476 477 478 479 480 481 482 483; do rg -c "^\| $id \|" "$S/manual-testing-playbook/manual-testing-playbook.md"; done | awk '{s+=$1} END {print s}'` prints `8`, and `rg -c 'template-authoring/' "$S/manual-testing-playbook/manual-testing-playbook.md"` prints `9`.

  Edit 1, old text:

  ```text
  - `retrieval/`
  - `tooling-and-scripts/`
  - `ux-hooks/`
  ```

  Edit 1, new text:

  ```text
  - `retrieval/`
  - `template-authoring/` - placeholder gate, fill guidance, example drift guard and the authoring card
  - `tooling-and-scripts/`
  - `ux-hooks/`
  ```

  Edit 2, old text:

  ```text
  ## 8. AUTOMATED TEST CROSS-REFERENCE
  ```

  Edit 2, new text:

  ```text
  ### 7.9 Template Authoring

  | Playbook ID | Scenario | Scenario File | Catalog Entry |
  |---|---|---|---|
  | 476 | Placeholder token warning while Draft | [476](template-authoring/placeholder-token-warning-while-draft.md) | [versioned-placeholder-gate](../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md) |
  | 477 | Placeholder token error after Draft | [477](template-authoring/placeholder-token-error-after-draft.md) | [versioned-placeholder-gate](../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md) |
  | 478 | Placeholder gate unchanged for a v2.2 doc | [478](template-authoring/placeholder-gate-legacy-stamp-unchanged.md) | [versioned-placeholder-gate](../feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md) |
  | 479 | Example drift guard catches a leaked description | [479](template-authoring/example-drift-guard-catches-leak.md) | [example-drift-guard](../feature-catalog/tooling-and-scripts/example-drift-guard.md) |
  | 480 | Golden render of every level | [480](template-authoring/golden-render-all-levels.md) | [template-section-fill-guidance](../feature-catalog/tooling-and-scripts/template-section-fill-guidance.md) |
  | 481 | Authoring card loaded by four intents | [481](template-authoring/authoring-card-router-intents.md) | [spec-authoring-card](../feature-catalog/tooling-and-scripts/spec-authoring-card.md) |
  | 482 | Authoring card sync guard | [482](template-authoring/authoring-card-sync-guard.md) | [spec-authoring-card](../feature-catalog/tooling-and-scripts/spec-authoring-card.md) |
  | 483 | Level 1 packet authored from the card | [483](template-authoring/level-1-packet-authored-from-card.md) | [spec-authoring-card](../feature-catalog/tooling-and-scripts/spec-authoring-card.md) |

  ---

  ## 8. AUTOMATED TEST CROSS-REFERENCE
  ```

- [ ] T008 Add the four catalog root entries (`$S/feature-catalog/feature-catalog.md`). Four insertions, C1 to C4 in `plan.md` section 3.10.5. Each block goes immediately above the heading in its table row. Verify: `for t in 'Example drift guard' 'Spec authoring card' 'Template section fill guidance' 'Versioned placeholder gate'; do rg -c "^### $t$" "$S/feature-catalog/feature-catalog.md"; done` prints `1` four times, and `rg -c 'tooling-and-scripts/(example-drift-guard|spec-authoring-card|template-section-fill-guidance|versioned-placeholder-gate)\.md' "$S/feature-catalog/feature-catalog.md"` prints `4`.
- [ ] T009 Run the playbook package validator (`scratch/validation/playbook.txt`). Run `mkdir -p "$PHASE/scratch/validation"`, then run `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --format text > "$PHASE/scratch/validation/playbook.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/validation/playbook.txt"`. Verify: `grep -c 'violations=0' "$PHASE/scratch/validation/playbook.txt"` prints `1`, and `tail -1 "$PHASE/scratch/validation/playbook.txt"` prints `exit=0`. A `PATH_MISSING` finding means a link in the new section names a file that does not exist: fix the link, then rerun.
- [ ] T010 Run the catalog package validator (`scratch/validation/catalog.txt`). Run `mkdir -p "$PHASE/scratch/validation"`, then run `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-spec-kit > "$PHASE/scratch/validation/catalog.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/validation/catalog.txt"`. Verify: `grep -c 'PASS: 0 violations' "$PHASE/scratch/validation/catalog.txt"` prints `1`, and `tail -1 "$PHASE/scratch/validation/catalog.txt"` prints `exit=0`. A parity finding names the root heading and the leaf field that disagree: align the leaf to the root block in `plan.md` section 3.10.5, then rerun.
- [ ] T011 Run the document validators (`scratch/validation/docs.txt`). Run this block from `$WORKTREE`. Verify: `cat "$PHASE/scratch/validation/docs.txt"` prints one `VALID` line per document and no `INVALID` line.

  ```bash
  mkdir -p "$PHASE/scratch/validation"
  V=.skilled/skills/sk-doc/shared/scripts/validate_document.py
  {
    python3 "$V" --type reference "$S/manual-testing-playbook/manual-testing-playbook.md"
    python3 "$V" --type readme "$S/feature-catalog/feature-catalog.md"
    python3 "$V" "$S/README.md"
    python3 "$V" --no-exclude "$S/templates/README.md"
    for f in "$S"/feature-catalog/tooling-and-scripts/versioned-placeholder-gate.md "$S"/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md "$S"/feature-catalog/tooling-and-scripts/example-drift-guard.md "$S"/feature-catalog/tooling-and-scripts/spec-authoring-card.md "$S"/references/validation/validation-rules.md "$S"/references/validation/path-scoped-rules.md "$S"/references/templates/template-style-guide.md "$S"/references/workflows/quick-reference.md; do
      python3 "$V" "$f"
    done
  } > "$PHASE/scratch/validation/docs.txt" 2>&1
  ```
- [ ] T012 Run the two spec-kit documentation tests (`scratch/validation/provenance.txt`, `scratch/validation/vocabulary.txt`). Verify: `grep -c 'Tests  3 passed (3)' "$PHASE/scratch/validation/provenance.txt"` prints `1`, and `grep -c 'Tests  2 passed (2)' "$PHASE/scratch/validation/vocabulary.txt"` prints `1`.

  ```bash
  mkdir -p "$PHASE/scratch/validation"
  ( cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/playbook-provenance-paths.vitest.ts --config vitest.config.ts ) > "$PHASE/scratch/validation/provenance.txt" 2>&1
  ( cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/workflow-invariance.vitest.ts --config vitest.config.ts ) > "$PHASE/scratch/validation/vocabulary.txt" 2>&1
  ```
- [ ] T013 Run the index and hygiene scans (`scratch/validation/hygiene.txt`). Run this block from `$WORKTREE`. Verify: `cat "$PHASE/scratch/validation/hygiene.txt"` prints `ids=8`, `category_links=9`, `provenance_files=8`, `bad_words=0` and `em_dash=0`.

  ```bash
  P="$S/manual-testing-playbook"
  C="$S/feature-catalog/tooling-and-scripts"
  {
    printf 'ids=%s\n' "$(for id in 476 477 478 479 480 481 482 483; do rg -c "^\| $id \|" "$P/manual-testing-playbook.md"; done | awk '{s+=$1} END {print s+0}')"
    printf 'category_links=%s\n' "$(rg -c 'template-authoring/' "$P/manual-testing-playbook.md")"
    printf 'provenance_files=%s\n' "$(rg -l '^Provenance:' "$P"/template-authoring/*.md | wc -l | tr -d ' ')"
    printf 'bad_words=%s\n' "$(rg -i -c '\b(preset|capabilit(y|ies)|kind|manifest)\b' "$P"/template-authoring/*.md "$C"/versioned-placeholder-gate.md "$C"/template-section-fill-guidance.md "$C"/example-drift-guard.md "$C"/spec-authoring-card.md 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')"
    printf 'em_dash=%s\n' "$(rg -c '\x{2014}' "$P"/template-authoring/*.md "$C"/versioned-placeholder-gate.md "$C"/template-section-fill-guidance.md "$C"/example-drift-guard.md "$C"/spec-authoring-card.md 2>/dev/null | awk -F: '{s+=$2} END {print s+0}')"
  } > "$PHASE/scratch/validation/hygiene.txt"
  ```

- [ ] T014 Compare the spec-kit suite with the start (`scratch/baseline/suite-end.txt`). Run the suite once, then extract the three summary lines from each file and compare them. Verify: `diff "$PHASE/scratch/baseline/suite-lines-start.txt" "$PHASE/scratch/baseline/suite-lines-end.txt" && echo SUITE_SAME` prints `SUITE_SAME`.

  ```bash
  npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-end.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-end.txt"
  grep -E '^ *(Test Files|Tests) |^exit=' "$PHASE/scratch/baseline/suite-start.txt" > "$PHASE/scratch/baseline/suite-lines-start.txt"
  grep -E '^ *(Test Files|Tests) |^exit=' "$PHASE/scratch/baseline/suite-end.txt" > "$PHASE/scratch/baseline/suite-lines-end.txt"
  tail -1 "$PHASE/scratch/baseline/suite-start.txt" > "$PHASE/scratch/baseline/suite-exit-start.txt"
  tail -1 "$PHASE/scratch/baseline/suite-end.txt" > "$PHASE/scratch/baseline/suite-exit-end.txt"
  ```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Frontier review of the diff (`scratch/review/T015.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Run `mkdir -p "$PHASE/scratch/review"`, write the brief below to `$PHASE/scratch/review/T015-brief.txt`, then run this read-only invocation: `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" -c approval_policy=never --sandbox read-only -o "$PHASE/scratch/review/T015.txt" "$(cat "$PHASE/scratch/review/T015-brief.txt")" </dev/null > "$PHASE/scratch/review/T015-run.log" 2>&1`. Verify: `test -s "$PHASE/scratch/review/T015.txt" && awk 'NF && $0 != "NO FINDINGS" && $0 !~ /^(P0|P1|P2) /{bad++} END{print bad+0}' "$PHASE/scratch/review/T015.txt"` prints `0`.

  ```text
  You are a read-only reviewer. Do not edit, create or delete any file.
  Read the diff between the start commit and the working tree. Focus on these files:
  .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md,
  the eight files under manual-testing-playbook/template-authoring/,
  .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md,
  the four new files under feature-catalog/tooling-and-scripts/,
  .skilled/skills/system-spec-kit/README.md,
  .skilled/skills/system-spec-kit/templates/README.md,
  the four edited files under references/.
  For each file check: (1) the claim matches the code or script the doc names,
  (2) a command prints what the doc says it prints, (3) a link resolves,
  (4) the prose follows Human Voice Rules with no em dash, no semicolon and no
  serial comma, (5) no scenario leaves a track behind.
  Return one line per finding in this form, and nothing else:
  P0|P1|P2 <file>:<line> | <what is wrong> | <the fix>
  Return the single line NO FINDINGS when there are none.
  ```

- [ ] T016 Apply review findings (`goal.md`). For each finding, fix the named line, or record in `goal.md` section 4 why it was not applied. Write one line per finding in `goal.md` section 4 as `T016-APPLIED <file>:<line>` or `T016-RECORDED <file>:<line> <reason>`, using the `<file>:<line>` from the T015 reply. Write no T016 line when T015 is `NO FINDINGS`. Verify: `test "$(grep -cE '^(P0|P1|P2) ' "$PHASE/scratch/review/T015.txt")" -eq "$(grep -cE '^T016-(APPLIED|RECORDED) ' "$PHASE/goal.md")" && echo T016_COUNTS_MATCH` prints `T016_COUNTS_MATCH`.
- [ ] T017 Close the phase (this folder). Run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$PHASE" --apply`, then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PHASE" --strict`, then `git -C "$WORKTREE" status --porcelain` and compare it with `scratch/baseline/status-start.txt`. Fill `implementation-summary.md` and mark each `acceptance-criteria.md` row. Verify: `RESULT: PASSED` with `Errors: 0`, and the status diff lists only paths inside this phase folder and the file table in `spec.md` section 3.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion marked `Met` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the eight scenario texts, the four catalog texts and the exact edit rows
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

- [ ] CHK-001 [P0] Phases 2 to 6 closed, shown by T001
- [ ] CHK-002 [P0] Launch preconditions recorded as met in `../goal.md` section 4
- [ ] CHK-003 [P1] Every brief saved under `scratch/briefs/` before dispatch
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Document Quality

- [ ] CHK-010 [P0] Every new scenario file has the five required sections in order, shown by T004
- [ ] CHK-011 [P0] Every new catalog leaf has the four required sections, shown by T005
- [ ] CHK-012 [P1] Every old text in `plan.md` section 3.11 matched exactly once, shown by T006
- [ ] CHK-013 [P1] No new file uses an em dash or a banned word, shown by T013
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The playbook validator prints `violations=0` in T009
- [ ] CHK-022 [P0] The catalog validator prints `PASS: 0 violations` in T010
- [ ] CHK-023 [P1] Every edited document prints `VALID` in T011
- [ ] CHK-024 [P1] The provenance and workflow-invariance tests pass in T012
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every playbook row links a scenario file that exists
- [ ] CHK-FIX-002 [P0] Every catalog leaf has one root entry and every root entry has one leaf
- [ ] CHK-FIX-003 [P0] Every doc that named the `PLACEHOLDER` marker now names the value token
- [ ] CHK-FIX-004 [P1] The phase 3 text in `template-guide.md` and `validation-rules.md` is verified, not rewritten
- [ ] CHK-FIX-005 [P1] Each scenario names the script or test it exercises, and that path exists
- [ ] CHK-FIX-006 [P1] Evidence is pinned to the start commit recorded in T002
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, token or key
- [ ] CHK-031 [P0] Every worker ran with `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0`
- [ ] CHK-032 [P1] No scenario writes outside its throwaway track
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the eight scenario IDs and the four catalog titles
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit, each dispatch and each blocker
- [ ] CHK-042 [P2] `scratch/validation/hygiene.txt` keeps the five counts for phase 8
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [ ] CHK-051 [P1] No throwaway track `specs/zz-pb-*` exists at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 24 | 0/24 |
| P2 Items | 8 | 0/8 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001, ADR-002 and ADR-003 in `plan.md` are followed by T007, T008 and T006
- [ ] CHK-101 [P1] Every ADR has status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No data migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Each lane returns within 40 minutes or is re-dispatched once
- [ ] CHK-111 [P1] Each scenario except 483 finishes under 10 minutes
- [ ] CHK-112 [P2] Scenario 483 finishes under 20 minutes
- [ ] CHK-113 [P2] No load test applies to this phase
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside the declared file table and this phase folder changed, shown by T017
- [ ] CHK-122 [P1] Phase 8 can start: the playbook validator is green and the eight files exist
- [ ] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [ ] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] The frontier review ran read-only and its reply is saved
- [ ] CHK-131 [P1] No new dependency was installed
- [ ] CHK-132 [P2] No user data is handled by this phase
- [ ] CHK-133 [P2] No security surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [ ] CHK-141 [P1] `implementation-summary.md` cites the playbook validator and the catalog validator
- [ ] CHK-142 [P1] Every new scenario is listed in the playbook index
- [ ] CHK-143 [P2] Every new catalog leaf is listed in the catalog root
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the diff read-only | Pending | |
| Operator | Merges the phase commit | Pending | |
<!-- /ANCHOR:sign-off -->
