---
title: "Tasks: Phase 4: template-section-fill-guidance"
description: "Task Format: T### [P?] Description (file path). Each task names a verify command and the output that proves it."
trigger_phrases:
  - "template section fill guidance tasks"
  - "example drift guard source"
  - "fill guidance test source"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: template-section-fill-guidance

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
- `PHASE`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance`
- `S`: `.skilled/skills/system-spec-kit`
- `START`: the commit hash recorded by T002.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check tools and the phase 003 result (`scratch/baseline/locator-form.txt`). Run `mkdir -p "$PHASE/scratch/baseline" "$PHASE/scratch/briefs" "$PHASE/scratch/runs" "$PHASE/scratch/review" "$PHASE/scratch/test"`, `node --version`, `cd "$S" && ./node_modules/.bin/vitest --version`, `which rg awk git`, `rg -c 'YOUR_VALUE_HERE' "$S/templates/core/spec.md.tmpl" || echo 0`, then `printf 'TOKEN=%s\n' "$(rg -c 'YOUR_VALUE_HERE' "$S/templates/core/spec.md.tmpl" || echo 0)" > "$PHASE/scratch/baseline/locator-form.txt"`. Verify: the first two lines hold a version, the next three hold a path, and `cat "$PHASE/scratch/baseline/locator-form.txt"` prints one `TOKEN=` line. A number above `0` selects the post-003 locator form in `plan.md` section 3 and `0` selects the pre-token form.

- [ ] T002 Record the start state (`goal.md`, `scratch/baseline/status-start.txt`, `scratch/baseline/suite-start.txt`). Run `git -C "$WORKTREE" rev-parse HEAD`, write the row `| Start commit | Recorded | <hash> |` into the Progress table in `goal.md` section 4 with `<hash>` replaced by that output, run `git -C "$WORKTREE" status --porcelain > "$PHASE/scratch/baseline/status-start.txt"`, then run `npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-start.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-start.txt"`. Verify: `grep -c 'Start commit' "$PHASE/goal.md"` prints `1` and `tail -1 "$PHASE/scratch/baseline/suite-start.txt"` prints an `exit=` line.

- [ ] T003 Record the anchor baseline (`scratch/baseline/anchor-counts.txt`, `scratch/baseline/anchor-lists.txt`). Run this from `$WORKTREE`. Verify: `wc -l < "$PHASE/scratch/baseline/anchor-counts.txt"` prints `16`, `wc -l < "$PHASE/scratch/baseline/anchor-lists.txt"` prints `16`, `grep -c '^1 spec 7$' "$PHASE/scratch/baseline/anchor-counts.txt"` prints `1`, `grep -c '^3+ plan 17$' "$PHASE/scratch/baseline/anchor-counts.txt"` prints `1`, and `grep -c '^1 spec: metadata problem questions requirements risks scope success-criteria$' "$PHASE/scratch/baseline/anchor-lists.txt"` prints `1`.

  ```bash
  : > "$PHASE/scratch/baseline/anchor-counts.txt"
  : > "$PHASE/scratch/baseline/anchor-lists.txt"
  for lvl in 1 2 3 3+; do
    for doc in spec plan tasks implementation-summary; do
      n=$(bash "$S/runtime/cli/templates/inline-gate-renderer.sh" --level "$lvl" "$S/templates/core/$doc.md.tmpl" | grep -c '<!-- ANCHOR:')
      echo "$lvl $doc $n" >> "$PHASE/scratch/baseline/anchor-counts.txt"
      names=$(bash "$S/runtime/cli/templates/inline-gate-renderer.sh" --level "$lvl" "$S/templates/core/$doc.md.tmpl" | rg -o '<!-- ANCHOR:[a-z0-9-]+' | sed 's/.*://' | sort | paste -sd' ' -)
      echo "$lvl $doc: $names" >> "$PHASE/scratch/baseline/anchor-lists.txt"
    done
  done
  ```

  The frozen result is:

  ```text
  1 spec 7
  1 plan 7
  1 tasks 6
  1 implementation-summary 6
  2 spec 10
  2 plan 11
  2 tasks 15
  2 implementation-summary 6
  3 spec 7
  3 plan 14
  3 tasks 21
  3 implementation-summary 6
  3+ spec 11
  3+ plan 17
  3+ tasks 21
  3+ implementation-summary 6
  ```

- [ ] T004 Record the golden baseline (no file). Run `cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts`. Verify: the output contains `Tests  12 passed (12)`.

- [ ] T005 Write the two guards and the fill test (`$S/runtime/cli/spec/check-example-drift.sh`, `$S/runtime/cli/tests/example-drift.vitest.ts`, `$S/runtime/cli/tests/template-fill-guidance.vitest.ts`). Write the three files exactly as they appear in the code blocks below, then run `chmod +x "$S/runtime/cli/spec/check-example-drift.sh"`. Verify: `bash -n "$S/runtime/cli/spec/check-example-drift.sh"` exits 0 and `ls -1 "$S/runtime/cli/spec/check-example-drift.sh" "$S/runtime/cli/tests/example-drift.vitest.ts" "$S/runtime/cli/tests/template-fill-guidance.vitest.ts"` prints the three paths.

  `check-example-drift.sh` source:

  ```bash
  #!/usr/bin/env bash
  # Guard: every hand-written example keeps the template's required anchors, adds no
  # anchor the template does not allow, and carries a description a reader can use.
  # Read-only. Prints one line per failure and exits 1.
  set -uo pipefail

  ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
  TEMPLATES="$ROOT/templates"
  UTIL="$ROOT/runtime/cli/utils/template-structure.js"
  EXAMPLES="${1:-$TEMPLATES/examples}"
  status=0

  fail() {
    printf 'FAIL %s: %s\n' "$1" "$2"
    status=1
  }

  for dir in "$EXAMPLES"/level-*; do
    level="${dir##*/level-}"
    for example in "$dir"/*.md; do
      name="$(basename "$example")"
      desc="$(awk '/^description:/{sub(/^description:[[:space:]]*/,""); print; exit}' "$example")"
      bare="${desc%\"}"
      bare="${bare#\"}"
      [[ "$bare" == *"-->"* ]] && fail "$example" "description holds an HTML comment tail"
      [[ "$bare" == [[:lower:]]* ]] && fail "$example" "description starts lowercase"
      [[ "$bare" == *. ]] || fail "$example" "description does not end with a period"

      report="$(node "$UTIL" compare "$level" "$name" "$example" anchors 2>&1)"
      rc=$?
      if [[ $rc -ne 0 ]]; then
        fail "$example" "template-structure compare exited $rc"
        continue
      fi
      printf '%s\n' "$report" | rg '^(missing_anchor|extra_anchor)' \
        | while read -r kind anchor; do
            printf 'FAIL %s: %s %s\n' "$example" "$kind" "$anchor"
          done
      printf '%s\n' "$report" | rg -q '^(missing_anchor|extra_anchor)' && status=1
    done
  done

  [[ $status -eq 0 ]] && echo "EXAMPLE_DRIFT_OK"
  exit $status
  ```

  `example-drift.vitest.ts` source:

  ```ts
  import { execFileSync } from 'node:child_process';
  import path from 'node:path';
  import { describe, expect, it } from 'vitest';

  const SCRIPT = path.resolve(__dirname, '../spec/check-example-drift.sh');

  describe('example drift guard', () => {
    it('passes on the shipped examples', () => {
      const args: string[] = [];
      args.push(SCRIPT);
      const output = execFileSync('bash', args, { encoding: 'utf8' });
      expect(output.trim()).toBe('EXAMPLE_DRIFT_OK');
    });
  });
  ```

  `template-fill-guidance.vitest.ts` source:

  ```ts
  import fs from 'node:fs';
  import path from 'node:path';
  import { describe, expect, it } from 'vitest';
  import { renderInlineGates, type RenderLevel } from '../templates/inline-gate-renderer';

  const SKILL_ROOT = path.resolve(__dirname, '../../..');
  const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates');
  const LEVELS: RenderLevel[] = ['1', '2', '3', '3+'];
  const DOCS = ['spec', 'plan', 'tasks', 'implementation-summary'] as const;

  const ANCHOR_COUNTS: Record<string, number> = {
    '1/spec': 7,
    '1/plan': 7,
    '1/tasks': 6,
    '1/implementation-summary': 6,
    '2/spec': 10,
    '2/plan': 11,
    '2/tasks': 15,
    '2/implementation-summary': 6,
    '3/spec': 7,
    '3/plan': 14,
    '3/tasks': 21,
    '3/implementation-summary': 6,
    '3+/spec': 11,
    '3+/plan': 17,
    '3+/tasks': 21,
    '3+/implementation-summary': 6,
  };

  function sections(markdown: string): Array<{ heading: string; body: string }> {
    const out: Array<{ heading: string; body: string[] }> = [];
    let inFence = false;
    for (const line of markdown.split(/\r?\n/u)) {
      if (/^\s*(`{3}|~~~)/u.test(line)) {
        inFence = !inFence;
      }
      if (!inFence && /^## /u.test(line)) {
        out.push({ heading: line, body: [] });
        continue;
      }
      const last = out.at(-1);
      if (last) {
        last.body.push(line);
      }
    }
    return out.map((section) => ({ heading: section.heading, body: section.body.join('\n') }));
  }

  describe('template section fill guidance', () => {
    for (const level of LEVELS) {
      for (const doc of DOCS) {
        it(`gives every Level ${level} ${doc} section one fill line`, () => {
          const source = fs.readFileSync(path.join(TEMPLATE_ROOT, 'core', `${doc}.md.tmpl`), 'utf8');
          const rendered = renderInlineGates(source, level);
          const anchors = (rendered.match(/<!-- ANCHOR:/gu) ?? []).length;
          expect(anchors, 'anchor count changed').toBe(ANCHOR_COUNTS[`${level}/${doc}`]);
          const parts = sections(rendered);
          expect(parts.length).toBeGreaterThan(0);
          for (const part of parts) {
            const fill = part.body.match(/<!-- FILL: .* -->/gu) ?? [];
            expect(fill, `${part.heading} needs one FILL line`).toHaveLength(1);
            const inner = fill[0].slice('<!-- FILL: '.length, -' -->'.length);
            expect(inner).not.toContain('[YOUR_VALUE_HERE:');
            expect(inner).not.toContain('[NEEDS');
            expect(inner).not.toContain('-->');
            expect(inner.trim().endsWith('.')).toBe(true);
          }
        });
      }
    }
  });
  ```

- [ ] T006 Record the failing-first result (`scratch/test/failing-first.txt`). Run the fill test before any template edit, then run the drift guard on a broken copy. Verify: `cat "$PHASE/scratch/test/failing-first.txt"` prints exactly two lines, `fill test: 16 failed` and `drift guard: description holds an HTML comment tail`, and `tail -1 "$PHASE/scratch/test/drift-before.txt"` is not `guard exit=0`.

  ```bash
  cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts > "$PHASE/scratch/test/fill-before.txt" 2>&1
  mkdir -p "$PHASE/scratch/test/examples/level-2"
  cp "$S/templates/examples/level-2/acceptance-criteria.md" "$PHASE/scratch/test/examples/level-2/"
  perl -0pi -e 's/(description: "The criteria)/$1 leaked -->/' "$PHASE/scratch/test/examples/level-2/acceptance-criteria.md"
  bash "$S/runtime/cli/spec/check-example-drift.sh" "$PHASE/scratch/test/examples" > "$PHASE/scratch/test/drift-before.txt" 2>&1
  echo "guard exit=$?" >> "$PHASE/scratch/test/drift-before.txt"
  {
    printf 'fill test: %s failed\n' "$(grep -c 'needs one FILL line' "$PHASE/scratch/test/fill-before.txt")"
    printf 'drift guard: %s\n' "$(grep -m1 -o 'description holds an HTML comment tail' "$PHASE/scratch/test/drift-before.txt")"
  } > "$PHASE/scratch/test/failing-first.txt"
  ```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 [P] Lane A: fill `spec.md.tmpl` and `plan.md.tmpl` and repair the spec crossings (`$S/templates/core/spec.md.tmpl`, `$S/templates/core/plan.md.tmpl`). Write the brief to `scratch/briefs/T007-A.txt` from the skeleton in `plan.md` section AI EXECUTION PROTOCOL, then append the lane text below. Dispatch with the Task tool: subagent_type `general`, description `T007-A`, prompt = the full text of `$PHASE/scratch/briefs/T007-A.txt`. When the subagent returns, write its final reply verbatim to `$PHASE/scratch/runs/T007-A.txt` with the write tool. Verify: `rg -c '<!-- FILL: '` on the two files prints `24` and `18`, the awk crossing command from `plan.md` section 3 on the two files prints nothing, `bash "$S/runtime/cli/templates/inline-gate-renderer.sh" --level 2 "$S/templates/core/spec.md.tmpl" | awk '/<!-- ANCHOR:/{o++} /<!-- \/ANCHOR:/{c++} END{print "open="o" close="c}'` prints `open=10 close=10`, and the Level 1 and Level 3 anchor counts still match `scratch/baseline/anchor-counts.txt`.

  ```text
  ALLOWED WRITE PATHS:
    .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl
    .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl

  TASK: Copy the fill text from plan.md section 3 into two templates.
  1. Open plan.md and read FILL TEXT TABLE A rows A01 to A14 and FILL TEXT TABLE B
     rows B01 to B28. Rows whose Template cell is core/spec.md.tmpl belong to spec.
     Rows whose Template cell is core/plan.md.tmpl belong to plan.
  2. For each row, find the heading in the Heading cell. It occurs once in that
     template. Insert one line immediately below the heading. Build the line with
     the rule in plan.md section 3: FILL instruction, then GOOD and WEAK when both
     cells hold text, wrapped in an HTML comment. One physical line.
  3. Do not change any heading, anchor, gate marker or existing token.
  4. Apply fixes S1, S2, S3 and S4 from plan.md section 3 to spec.md.tmpl. Each fix
     gives the exact old text and the exact new text.
  5. Apply fixes R1, R2 and R3 only if you own research.md.tmpl. You do not.

  VERIFY before you finish:
    rg -c '<!-- FILL: ' .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl
    rg -c '<!-- FILL: ' .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl
    The two numbers must be 24 and 18.
  RETURN exactly one line: T007-A DONE - 24 spec and 18 plan fill lines
  ```

- [ ] T008 [P] Lane B: fill `tasks.md.tmpl`, `implementation-summary.md.tmpl` and every addon template, and repair the research crossings (`$S/templates/core/tasks.md.tmpl`, `$S/templates/core/implementation-summary.md.tmpl`, `$S/templates/addons/*.tmpl`). Write the brief to `scratch/briefs/T008-B.txt`, then dispatch with the Task tool: subagent_type `general`, description `T008-B`, prompt = the full text of `$PHASE/scratch/briefs/T008-B.txt`. When the subagent returns, write its final reply verbatim to `$PHASE/scratch/runs/T008-B.txt` with the write tool. Verify: `rg -c '<!-- FILL: '` prints `22` for tasks, `6` for implementation-summary and these ten addon counts: acceptance 3, before-after 5, debug-delegation 5, decision-record 1, goal 4, handover 5, research 20, resource-map 11, roadmap 4, timeline 3. The awk crossing command on `research.md.tmpl` prints nothing, and `bash "$S/runtime/cli/templates/inline-gate-renderer.sh" --level 2 "$S/templates/addons/research.md.tmpl" | awk '/<!-- ANCHOR:/{o++} /<!-- \/ANCHOR:/{c++} END{print "open="o" close="c}'` prints `open=9 close=9`.

  ```text
  ALLOWED WRITE PATHS:
    .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl
    .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl
    .skilled/skills/system-spec-kit/templates/addons/

  TASK: Copy the fill text from plan.md section 3 into the tasks template, the
  implementation-summary template and the ten addon templates.
  1. Read FILL TEXT TABLE A rows A15 to A26, FILL TEXT TABLE B rows B29 to B44 and
     all of FILL TEXT TABLE C.
  2. For each row, find the heading in the Heading cell. It occurs once in that
     template. Insert one line immediately below the heading, built by the rule in
     plan.md section 3. One physical line.
  3. Do not change any heading, anchor, gate marker or existing token.
  4. Apply fixes R1, R2 and R3 from plan.md section 3 to research.md.tmpl. Each fix
     gives the exact old text and the exact new text.

  VERIFY before you finish:
    rg -c '<!-- FILL: ' .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl
    rg -c '<!-- FILL: ' .skilled/skills/system-spec-kit/templates/core/implementation-summary.md.tmpl
    rg -c '<!-- FILL: ' .skilled/skills/system-spec-kit/templates/addons/*.tmpl
    The numbers must match the list in the task.
  RETURN exactly one line: T008-B DONE - tasks 22, implementation-summary 6, addons 61
  ```

- [ ] T009 [P] Lane C: align the 14 examples in the plan's alignment table (`$S/templates/examples/level-*/*`). Write the brief to `scratch/briefs/T009-C.txt`, then dispatch with the Task tool: subagent_type `general`, description `T009-C`, prompt = the full text of `$PHASE/scratch/briefs/T009-C.txt`. When the subagent returns, write its final reply verbatim to `$PHASE/scratch/runs/T009-C.txt` with the write tool. Phase 002 owns the 18 description repairs and must be closed first: on a pre-002 tree the guard reports 18 description failures, so `EXAMPLE_DRIFT_OK` is expected only on the post-002 tree. Verify: `bash "$S/runtime/cli/spec/check-example-drift.sh"` prints `EXAMPLE_DRIFT_OK`.

  ```text
  ALLOWED WRITE PATHS:
    .skilled/skills/system-spec-kit/templates/examples/

  TASK: Apply the example alignment table in plan.md section 3.
  1. Read the table row for each file. Remove the anchor pairs in the Remove
     column, rename the anchors in the Rename column, and add the anchors in the
     Add column.
  2. Removing an anchor pair removes only the two comment lines. Keep the content
     between them.
  3. Renaming changes only the name inside the two comment lines.
  4. For a file whose Add column names the nine Verification Checklist anchors,
     append the block in tasks.md T012 to the end of that file, with one blank
     line before it. Drop the leading `+` from every line first.
  5. For a file whose Add column names how-delivered, insert this block after the
     What Was Built section and before the next section:

     <!-- ANCHOR:how-delivered -->
     ## How It Was Delivered

     <the sentence from tasks.md T012 for that level>
     <!-- /ANCHOR:how-delivered -->

  6. For a file whose Add column names decisions, wrap the existing Key Decisions
     section in the anchor pair named decisions. Do not change the heading.
  7. Do not edit a file that is not in the table.

  VERIFY before you finish:
    bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh
    It must print EXAMPLE_DRIFT_OK.
  RETURN exactly one line: T009-C DONE - EXAMPLE_DRIFT_OK
  ```

- [ ] T010 Refresh the golden snapshots (`$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`). Run `cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts -u`, then run the same command without `-u`. Then prove the test notices a render change. The mutation adds one Level 1-only line, so exactly one of the 12 tests fails. Verify: the first two runs print `Tests  12 passed (12)`, `grep -F 'Tests  1 failed | 11 passed (12)' "$PHASE/scratch/test/golden-mutation.txt"` prints that line, `tail -1 "$PHASE/scratch/test/golden-mutation.txt"` prints `exit=1`, the final run prints `Tests  12 passed (12)`, and `git -C "$WORKTREE" diff --name-only -- "$S/runtime/cli/tests/snapshots/"` prints exactly one path.

  ```bash
  SPEC="$S/templates/core/spec.md.tmpl"
  cp "$SPEC" "$PHASE/scratch/test/spec.md.tmpl.probe-backup"
  perl -0pi -e 's/(<!-- IF level:1 -->\n<!-- ANCHOR:questions -->\n## 7\. OPEN QUESTIONS\n)/$1\nMUTATION PROBE\n/' "$SPEC"
  cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts > "$PHASE/scratch/test/golden-mutation.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/test/golden-mutation.txt"
  cp "$PHASE/scratch/test/spec.md.tmpl.probe-backup" "$SPEC"
  cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/scaffold-golden-snapshots.vitest.ts --config vitest.config.ts
  ```

- [ ] T011 Run the fill test (no file). Run `cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/template-fill-guidance.vitest.ts --config vitest.config.ts`. Verify: the output contains `Tests  16 passed (16)`.

- [ ] T012 Run the drift guard and its wrapper (no file). Run `bash "$S/runtime/cli/spec/check-example-drift.sh"` and `cd "$S" && ./node_modules/.bin/vitest run runtime/cli/tests/example-drift.vitest.ts --config vitest.config.ts`. The guard passes only on the post-002 tree, because phase 002 repairs the 18 example descriptions. Verify: the first prints `EXAMPLE_DRIFT_OK` and the second prints `Tests  1 passed (1)`.

  Use this block for the three tasks examples in T009. It carries the nine required anchors and the counts 12, 13 and 1. The block is shown as an addition, so every line starts with `+`. The `+` is not part of the appended text.

  ```text
  +---
  +
  +## Verification Checklist
  +
  +<!-- ANCHOR:protocol -->
  +## Verification Protocol
  +
  +| Priority | Handling | Completion Impact |
  +|----------|----------|-------------------|
  +| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
  +| **[P1]** | Required | Must complete OR get user approval |
  +| **[P2]** | Optional | Can defer with documented reason |
  +<!-- /ANCHOR:protocol -->
  +
  +---
  +
  +<!-- ANCHOR:pre-impl -->
  +## Pre-Implementation
  +
  +- [ ] CHK-001 [P0] Requirements documented in spec.md
  +- [ ] CHK-002 [P0] Technical approach defined in plan.md
  +- [ ] CHK-003 [P1] Dependencies identified and available
  +<!-- /ANCHOR:pre-impl -->
  +
  +---
  +
  +<!-- ANCHOR:code-quality -->
  +## Code Quality
  +
  +- [ ] CHK-010 [P0] Code passes lint/format checks
  +- [ ] CHK-011 [P0] No console errors or warnings
  +- [ ] CHK-012 [P1] Error handling implemented
  +- [ ] CHK-013 [P1] Code follows project patterns
  +<!-- /ANCHOR:code-quality -->
  +
  +---
  +
  +<!-- ANCHOR:testing -->
  +## Testing Checklist
  +
  +- [ ] CHK-020 [P0] All acceptance criteria met
  +- [ ] CHK-021 [P0] Manual testing complete
  +- [ ] CHK-022 [P1] Edge cases tested
  +- [ ] CHK-023 [P1] Error scenarios validated
  +<!-- /ANCHOR:testing -->
  +
  +---
  +
  +<!-- ANCHOR:fix-completeness -->
  +## Fix Completeness
  +
  +- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class.
  +- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed.
  +- [ ] CHK-FIX-003 [P0] Consumer inventory completed.
  +- [ ] CHK-FIX-004 [P0] Security fixes include adversarial cases.
  +- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed.
  +- [ ] CHK-FIX-006 [P1] Hostile env variant executed when needed.
  +- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or diff range.
  +<!-- /ANCHOR:fix-completeness -->
  +
  +---
  +
  +<!-- ANCHOR:security -->
  +## Security
  +
  +- [ ] CHK-030 [P0] No hardcoded secrets
  +- [ ] CHK-031 [P0] Input validation implemented
  +- [ ] CHK-032 [P1] Auth/authz working correctly
  +<!-- /ANCHOR:security -->
  +
  +---
  +
  +<!-- ANCHOR:docs -->
  +## Documentation
  +
  +- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  +- [ ] CHK-041 [P1] Code comments adequate
  +- [ ] CHK-042 [P2] README updated when applicable
  +<!-- /ANCHOR:docs -->
  +
  +---
  +
  +<!-- ANCHOR:file-org -->
  +## File Organization
  +
  +- [ ] CHK-050 [P1] Temp files in scratch/ only
  +- [ ] CHK-051 [P1] scratch/ cleaned before completion
  +<!-- /ANCHOR:file-org -->
  +
  +---
  +
  +<!-- ANCHOR:summary -->
  +## Verification Summary
  +
  +| Category | Total | Verified |
  +|----------|-------|----------|
  +| P0 Items | 12 | 0/12 |
  +| P1 Items | 13 | 0/13 |
  +| P2 Items | 1 | 0/1 |
  +
  +**Verification Date**: 2026-10-24
  +<!-- /ANCHOR:summary -->
  ```

  Use this sentence for the `how-delivered` block, by level:
  - Level 1: `Merged after the two manual runs in tasks T008 and T009.`
  - Level 2: `Merged after the unit and integration runs in Verification and one manual pass over the happy path.`
  - Level 3: `Merged after the unit, integration and manual runs in Verification Results, with the checklist at 100 percent.`
  - Level 3+: `Merged after the unit, integration, manual and workstream sync runs in Verification Results, with the governance checkpoints signed.`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Compare the anchor counts with the baseline (`scratch/baseline/anchor-counts-after.txt`). Run the T003 loop again, writing to the new file, then `diff "$PHASE/scratch/baseline/anchor-counts.txt" "$PHASE/scratch/baseline/anchor-counts-after.txt"`. Verify: `diff` prints nothing and exits 0, and `wc -l` on the new file prints `16`.

- [ ] T014 Run the full gate (no file). Run `npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/baseline/suite-after.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/baseline/suite-after.txt"`, then `bash "$S/runtime/cli/spec/validate.sh" "$PHASE" --strict`, then `git -C "$WORKTREE" status --porcelain`. Verify: `tail -1 suite-after.txt` prints `exit=0`, the suite adds exactly 17 tests over `suite-start.txt` (16 fill tests and 1 drift test) and changes no existing test result, validate prints `RESULT: PASSED` with `Errors: 0`, and the status list holds only the paths named in `spec.md` section 3 plus this phase folder.

- [ ] T015 Frontier review of the fill text (`scratch/review/T015.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Write this brief to `scratch/briefs/T015.txt`, then run the literal command below from `$WORKTREE`. Verify: the file exists and every line matches `^(P0|P1|P2) ` or the single line `NO FINDINGS`.

  ```text
  You are a read-only reviewer. Do not edit, create or delete any file.
  Read specs/system-speckit/054-weak-model-spec-authoring/004-template-section-fill-guidance/plan.md
  and the templates it changes. For each FILL line in the four core templates and the ten
  addon templates, check:
  (1) the instruction names one action and ends with a period,
  (2) the good example is concrete and the weak example shows a real failure,
  (3) the line holds no value token, no semicolon and no HTML comment tail,
  (4) an optional section says N/A or delete, and a required section says N/A and never delete,
  (5) the running example is the same feature in every line.
  Then read the example alignment table and check that every listed edit matches the
  contract output. Return one line per finding in this form, and nothing else:
  P0|P1|P2 <template>:<heading> | <what is wrong> | <the fix>
  Return the single line NO FINDINGS when there are none.
  ```

  Run this command:

  ```bash
  cd "$WORKTREE"
  AI_SESSION_CHILD=1 codex exec \
    --model gpt-6-luna \
    -c model_reasoning_effort="max" \
    -c service_tier="fast" \
    -c approval_policy=never \
    --sandbox read-only \
    -o "$PHASE/scratch/review/T015.txt" \
    "$(cat "$PHASE/scratch/briefs/T015.txt")" > "$PHASE/scratch/review/T015.log" 2>&1 </dev/null &
  CODEX_PID=$!
  wait "$CODEX_PID"
  kill -9 "$CODEX_PID" 2>/dev/null
  pkill -9 -P "$CODEX_PID" 2>/dev/null
  ```

- [ ] T016 Close the phase (this folder, `goal.md`, `acceptance-criteria.md`, `implementation-summary.md`). Fill `implementation-summary.md`, mark each `acceptance-criteria.md` row, and write the close entry in `goal.md` section 4. Verify: validate prints `RESULT: PASSED`, every acceptance row is `Met`, and `git status --porcelain` lists only the allowed paths.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion marked `Met` with its evidence
- [ ] The fill test prints `16 passed`, the golden test prints `12 passed`, the drift guard prints `EXAMPLE_DRIFT_OK`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the fill text tables, the crossing fixes and the example alignment table
- **Goal**: See `goal.md`, which holds the durable directive and the log
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

- [ ] CHK-001 [P0] Phase 003 is closed and the core templates carry the v2.3 stamp
- [ ] CHK-002 [P0] T002 recorded the start commit and the suite baseline
- [ ] CHK-003 [P1] T003 recorded all 16 anchor counts and they match the frozen table
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every FILL line matches `<!-- FILL: ... -->` on one physical line
- [ ] CHK-011 [P0] No FILL line holds a value token, a semicolon or an HTML comment tail
- [ ] CHK-012 [P0] No heading, anchor or gate marker changed outside the seven crossing fixes
- [ ] CHK-013 [P1] Every instruction opens with an imperative sentence, holds one to three sentences and ends with a period
- [ ] CHK-014 [P1] Every good and weak example uses the `--quiet` feature
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] The fill test prints `16 passed`
- [ ] CHK-021 [P0] The golden test prints `12 passed` without `-u`
- [ ] CHK-022 [P0] The drift guard prints `EXAMPLE_DRIFT_OK`
- [ ] CHK-023 [P1] T006 recorded the failing-first result for both guards
- [ ] CHK-024 [P1] T013 shows the anchor counts unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every core Level 1 section in Table A has one row
- [ ] CHK-FIX-002 [P0] Every core Level 2 and Level 3 section in Table B has one row
- [ ] CHK-FIX-003 [P0] Every addon content section in Table C has one row
- [ ] CHK-FIX-004 [P0] The awk crossing command prints nothing on every template
- [ ] CHK-FIX-005 [P1] Every row in the example alignment table was applied
- [ ] CHK-FIX-006 [P1] No example outside the table was edited
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the start commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief contains a credential, token or key
- [ ] CHK-031 [P0] The drift guard opens every file read-only and writes nothing
- [ ] CHK-032 [P1] Every worker ran as one Task subagent whose brief carried the pre-resolution preamble
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` agree on the target files
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit, each lane and each blocker
- [ ] CHK-042 [P2] The handoff to phase 005 names what the card may assume
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files live under this phase's `scratch/` only
- [ ] CHK-051 [P1] The three new runtime files sit at the paths named in `spec.md` section 3
- [ ] CHK-052 [P1] `find "$PHASE/scratch" -name 'acceptance-criteria.md' -not -path '*/test/*'` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 is followed: every line is an HTML comment below the heading
- [ ] CHK-101 [P0] ADR-003 is followed: the guard calls `template-structure.js compare`
- [ ] CHK-102 [P1] All six ADRs have status Accepted
- [ ] CHK-103 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-104 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The 16 renders in the fill test finish under 60 seconds
- [ ] CHK-111 [P1] The drift guard finishes under 30 seconds on 21 example documents
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] The suite runtime is compared with `suite-start.txt`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] The rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside the paths in `spec.md` section 3 changed
- [ ] CHK-122 [P1] Phase 005 can start: every core section has a fill line and the guards pass
- [ ] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [ ] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] The frontier review ran read-only and its reply is saved
- [ ] CHK-131 [P1] No new dependency was installed
- [ ] CHK-132 [P2] No user data is handled by this phase
- [ ] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [ ] CHK-141 [P1] `implementation-summary.md` cites the fill test, the golden test and the drift guard
- [ ] CHK-142 [P2] No user-facing documentation changed, phase 007 owns it
- [ ] CHK-143 [P2] The handoff to phases 005, 006 and 007 is written in `goal.md` section 4
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the fill text read-only | Pending | |
| Operator | Merges the phase commit | Pending | |
<!-- /ANCHOR:sign-off -->
