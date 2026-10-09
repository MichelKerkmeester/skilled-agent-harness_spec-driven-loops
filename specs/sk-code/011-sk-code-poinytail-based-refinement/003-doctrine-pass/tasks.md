---
title: "Tasks: Phase 3: doctrine-pass"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctrine pass tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: doctrine-pass

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

Run every command from the repository root. Short names used below:

| Name | Path |
|------|------|
| `CQS` | `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` |
| `WI` | `.skilled/skills/sk-code/shared/references/workflow-implement.md` |
| `CANARY` | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` |
| `CANARY_TEST` | `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` |
| `CANARY_README` | `.skilled/skills/sk-code/sk-code-review/scripts/README.md` |
| `DR001` | `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` |
| `PHASE` | `specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass` |

- [x] T001 Confirm phase 002 is complete (CQS). Run `rg -n "OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`. Expected: one hit, on the paragraph that starts `The ladder consumes the detected surface`. If it prints nothing, phase 002 has not landed: stop, and do not start Phase 2 below. On 2026-10-09 this printed nothing (`CQS:53` still reads `OPENCODE > WEBFLOW > UNKNOWN`). Evidence: previous run
- [x] T002 Snapshot the six in-scope files for rollback and size baseline (`PHASE/scratch/before/`). Run `mkdir -p specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass/scratch/before && cp .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh .skilled/skills/sk-code/sk-code-review/scripts/README.md .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass/scratch/before/`. Expected: six files in that folder; the basenames do not collide. Evidence: previous run
- [x] T003 [P] Measure the "before" size (CQS, WI). Run `wc -l -c .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/shared/references/workflow-implement.md` and record both numbers in `implementation-summary.md`. CQS is the only always-loaded file this phase changes (`.skilled/skills/sk-code/ROUTER.md:320-324`); WI is loaded per surface and is measured for information only. Reference values on the pre-002 tree, 2026-10-09: CQS 173 lines / 10139 bytes, WI 125 lines / 7656 bytes. Phase 002 adds about 10 bytes to CQS, so record the post-002 values, not these. Evidence: CQS 173 lines 10150 bytes; WI 125 lines 7656 bytes (orchestrator rerun from scratch/before)
- [x] T004 [P] Capture the canary baseline (CANARY, CANARY_TEST). Run `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` and `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh; echo "exit=$?"`. Expected on 2026-10-09: `OK: all rule invariants present (4 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s)).` with exit 0, and seven `PASS` lines then `All rule-canary test cases passed` with exit 0. Evidence: previous run
- [x] T005 [P] Capture the rung-order baseline (CQS, WI). Run the T019 command. Expected now (checked 2026-10-09): `FAIL ladder has 6 rungs, expected 7`, `FAIL ladder: missing or out of order: codebase`, `FAIL workflow: missing or out of order: codebase`, `FAIL`, exit 1. Evidence: previous run
- [x] T006 [P] Capture the drift-guard baseline. Run `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh 2>&1 | tail -4; echo "exit=${PIPESTATUS[0]}"` and `python3 .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root . --check-router 2>&1 | rg "check-rule-copies|code-quality-standards|workflow-implement|design-restraint-ladder"`. Expected in the worktree on 2026-10-09 (the main checkout differs because of an unrelated uncommitted file there): the runner prints `run-all-drift-guards: all 2 guards PASSED` and exits 0, alignment-drift reports `Errors: 0` and `Warnings: 247`, stack-folders prints `PASS`, and the `rg` prints nothing. Record the error and warning counts. The alignment-drift scan takes over two minutes. Evidence: worktree runner exit 0, all 2 guards PASSED; alignment-drift Errors: 0, Warnings: 247; rg on touched files empty (exit 1, expected)
- [x] T007 [P] Capture the comment-hygiene baseline (CANARY, CANARY_TEST). Run `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh; echo "exit=$?"`. Expected on 2026-10-09: no findings, exit 0. Evidence: exit=0, no findings
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Line numbers are pre-edit and shift after T009. Find each edit by the quoted anchor text. Use the replacement text exactly as given in the code blocks.

- [x] T008 Depends on phase 002 being complete (T001 passed). In the ladder intro paragraph that starts `Before writing NEW code for an implementation task`, change `rungs 2-4 require reading what already exists` to `rungs 2-5 require reading what already exists`. Change nothing else on the line (CQS:44). Evidence: updated
- [x] T009 Insert the reuse rung as rung 2 (CQS:46-51). Add this line directly after rung 1 (the line starting `1. **Does this need to exist at all? (YAGNI)**`): Evidence: updated

  ```markdown
  2. **Already in this codebase (a helper, component, service, pattern)?** Use it the way the surrounding code does.
  ```

  Then renumber the five rungs that follow by changing only the leading digit: `2. **Standard library` to `3.`, `3. **Native platform` to `4.`, `4. **An already-installed dependency?**` to `5.`, `5. **Can it be one line?**` to `6.`, `6. **Only then: the minimum code that works.**` to `7.`. The ladder then has seven rungs.
- [x] T010 Add the never-cut pointer below the ladder (CQS, between the last rung and the paragraph that starts `The ladder consumes the detected surface`, pre-edit `:51-53`). Insert it as its own paragraph with one blank line above and below: Evidence: updated

  ```markdown
  Restraint never cuts a P0 item in §3 below, such as input validation, error handling, secrets handling and accessibility, or anything the user asked for.
  ```

  Do not copy the P0 list into the ladder; the spec's risk row asks for a pointer, not a copy. Leave the precedence paragraph as phase 002 left it.
- [x] T011 Add accessibility as P0 item 8 (CQS:81). Insert this line directly after item 7 (the line starting `7. **No ephemeral-artifact pointers in comments**`) and before the blank line and `---` that close §3: Evidence: updated

  ```markdown
  8. **Accessibility** (user-facing UI): interactive elements stay keyboard-operable, carry an accessible name and keep a visible focus state.
  ```

  Accessibility is P0, per the spec's In Scope line "Point the ladder at the P0 tier and add accessibility to it".
- [x] T012 Widen the reach list (WI:51). Replace the line `2. Read nearby conventions, callers, and existing examples before introducing new shapes.` with: Evidence: updated

  ```markdown
  2. List every place the change must reach (callers, tests, fixtures, config and exports), and read them with nearby conventions and existing examples before introducing new shapes.
  ```
- [x] T013 Align the ladder summary (WI:66). Replace the whole paragraph that starts `Apply the restraint ladder before adding code:` with: Evidence: updated

  ```markdown
  Apply the Design Restraint Ladder from the universal code quality standards before adding code, in its order: verify the code needs to exist, reuse what this codebase already has (a helper, component, service or pattern), then the standard library, then a native platform or runtime feature, then an already-installed dependency, then one line, and only then write the minimum code that satisfies the stated requirement. It never cuts a P0 item or anything the user asked for. If requested scope looks unnecessary or risky, implement the requirement and raise a scope-amendment recommendation; do not silently cut scope.
  ```

  No file path is used because WI is read through three surface symlinks, where a relative path would resolve differently.
- [x] T014 Align the reuse step (WI:73). Replace `4. Reuse existing helpers, templates, and patterns before adding abstractions.` with: Evidence: updated

  ```markdown
  4. Reuse existing helpers, components, services, templates and patterns the way the surrounding code uses them before adding abstractions.
  ```
- [x] T015 Pin the never-cut items in the canary (CANARY:35-60). Add this entry as the last element of `EXACT_INVARIANTS`, after the `pr-state-dedup.md` entry that ends at `:59`, keeping the file's two-space indent: Evidence: updated

  ```js
  {
    file: '.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md',
    strings: [
      'never cuts a P0 item',
      'anything the user asked for',
      '**Input validation**',
      '**No silent failures**',
      '**No hardcoded secrets**',
      '**Accessibility**',
    ],
  },
  ```

  Then add one sentence to the header comment, after the line ending `turning a silent divergence into a required, visible fix.` (CANARY:11): `// It also pins the items the restraint ladder may never cut, so a reword of the quality standard cannot silently drop one.` No spec, phase or requirement ids in the comment.
- [x] T016 Seed the new file and test each pin in the tamper harness (CANARY_TEST:22-29, :113). First add `".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"` as the last entry of the `TARGETS` array (`:22-29`), so every seeded tree holds every file the canary reads. Then insert this block after the `delivery_prefix_names_ceiling` case (`:111`) and before the summary `if` at `:113`. It must sit below `expect_output`, which is defined at `:82-96`: Evidence: seeded_tree_consistent and six pin pairs pass

  ```bash
  # PASS: an untampered seeded tree. This proves TARGETS holds every file the
  # canary reads, so each tamper case fails for its own mutation alone.
  CASE_SEEDED="$TMP_DIR/seeded_untampered"
  seed_tree "$CASE_SEEDED"
  run_case 0 "seeded_tree_consistent" node "$CHECKER" --root "$CASE_SEEDED"

  # FAIL: each item the restraint ladder may never cut, deleted one at a time.
  NEVER_CUT_PINS=(
    'never cuts a P0 item'
    'anything the user asked for'
    '**Input validation**'
    '**No silent failures**'
    '**No hardcoded secrets**'
    '**Accessibility**'
  )
  pin_index=0
  for pin in "${NEVER_CUT_PINS[@]}"; do
    pin_index=$((pin_index + 1))
    CASE_PIN="$TMP_DIR/never_cut_$pin_index"
    seed_tree "$CASE_PIN"
    PIN="$pin" node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").split(process.env.PIN).join(""));' \
      "$CASE_PIN/.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
    run_case 1 "never_cut_removed_$pin_index" node "$CHECKER" --root "$CASE_PIN"
    expect_output "missing exact invariant string: \"$pin\"" "never_cut_names_$pin_index" node "$CHECKER" --root "$CASE_PIN"
  done
  ```

  The pin list must match T015's `strings` exactly. This block replaces the throwaway tamper loop the earlier plan carried: its untampered control is now `seeded_tree_consistent`, and its one-reason check is now `expect_output` naming the deleted pin. `bash -n` on this block exited 0 on 2026-10-09.
- [x] T017 Update the ladder scenario to seven rungs (DR001). Four edits: Evidence: updated
  1. `DR001:11`: replace the whole line with:

     ```markdown
     This scenario verifies that for an implementation-intent request, sk-code climbs the Design Restraint Ladder and picks the laziest viable rung before writing any new code: does this need to exist at all (YAGNI), then a helper, component, service or pattern already in this codebase, then a standard-library primitive, a native platform or runtime feature, an already-installed dependency, a one-line expression, and only then minimal custom code.
     ```
  2. Under `**Expected ladder behavior**:`, insert this bullet directly after the bullet that starts `- The ladder runs AFTER surface and intent routing` (`DR001:43`):

     ```markdown
     - The codebase-reuse rung is checked before the standard library. Reusing a suitable exported helper that already exists is also a PASS; otherwise the trace names where it looked and moves on.
     ```
  3. In the Expected Signals table (`DR001:77`), replace the row that starts `| 4 | The ladder selects a standard-library or one-line rung` with:

     ```markdown
     | 4 | The ladder checks the codebase-reuse rung, then selects an existing helper, a standard-library or a one-line rung (e.g. `new Set`) and explicitly rejects writing a custom loop. |
     ```
  4. In the PASS line (`DR001:82`), change `(stdlib / native / one-liner over custom)` to `(codebase reuse / stdlib / native / one-liner over custom)`.

  Leave `DR001:13` alone: its `OPENCODE over WEBFLOW over UNKNOWN` is surface precedence, not a rung, and this phase's scope for the file is "Seven rungs".
- [x] T018 Update the canary README's coverage and expected output (CANARY_README). Three edits: Evidence: updated
  1. Frontmatter `description` (`CANARY_README:3`): change `(review-status vocabulary, the Iron Law)` to `(review-status vocabulary, the Iron Law, the restraint ladder's never-cut items)`.
  2. The two CONTENTS rows (`CANARY_README:20-21`): replace them with:

     ```markdown
     | `check-rule-copies.js` | Asserts that `Review status: APPROVED/REQUESTED_CHANGES/COMMENTED` appear verbatim in `sk-code-review/SKILL.md` and `sk-code-review/README.md`, that `COMMENTED` appears in the changelog and dedup reference, that `code-quality-standards.md` keeps the items the restraint ladder may never cut, that at least one Iron Law line in `workflow-verify.md` and `AGENTS.md` carries both "completion claim" and "verification", and that the binding `AGENTS.md` clauses end inside its 16,384-byte delivery prefix with the file under 32,768 bytes. A canary, not a generator, it never rewrites anything |
     | `check-rule-copies.test.sh` | Self-contained bash test. It runs the canary against the real repo tree and an untampered copy (expects pass), then against tampered copies (expects each to fail): a deleted status string, a reworded Iron Law line, each never-cut item deleted in turn, binding clauses pushed past the delivery prefix, and an oversized `AGENTS.md` |
     ```
  3. The expected-output line (`CANARY_README:33`): replace `` Expected: `OK: all rule invariants present (4 exact-string file(s) + 3 Iron Law file(s)).` and exit code 0. `` with:

     ```markdown
     Expected: `OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s)).`, then the delivery-prefix byte report, and exit code 0.
     ```

  The old line was already stale before this phase: the canary has read two Iron Law files, not three, since `IRON_LAW_FILES` (`CANARY:67-70`), and printed the delivery-prefix count.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 REQ-001, ladder and workflow agree (CQS, WI). Run: Evidence: PASS; exactly two hits

  ```bash
  node -e 'const fs=require("fs");const R=".skilled/skills/sk-code/shared/references/";const k=["to exist","codebase","standard library","native platform","installed dependency","one line","minimum code"];const a=fs.readFileSync(R+"universal/code-quality-standards.md","utf8");const s=a.slice(a.indexOf("### Design Restraint Ladder"));const ladder=s.slice(0,s.indexOf("\n---")).toLowerCase();const rungs=(ladder.match(/^\d+\. \*\*/gm)||[]).length;const w=(fs.readFileSync(R+"workflow-implement.md","utf8").split("\n").find(l=>l.startsWith("Apply the"))||"").toLowerCase();let ok=rungs===7;if(!ok)console.log("FAIL ladder has "+rungs+" rungs, expected 7");for(const [n,t] of [["ladder",ladder],["workflow",w]]){let p=-1;for(const x of k){const i=t.indexOf(x,p+1);if(i<0){console.log("FAIL "+n+": missing or out of order: "+x);ok=false;break}p=i}}console.log(ok?"PASS: ladder and workflow list the same 7 rungs in order":"FAIL");process.exit(ok?0:1)'; echo "exit=$?"
  ```

  Expected: `PASS: ladder and workflow list the same 7 rungs in order`, exit 0. Also run `rg -n "callers, tests, fixtures, config and exports|components, services, templates and patterns" .skilled/skills/sk-code/shared/references/workflow-implement.md`; expected two hits, the reach list and the reuse step.
- [x] T020 REQ-002, coverage floor kept (CQS). Run `rg -n "Test coverage at boundaries.*happy path plus at least one edge case per public surface\.$" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` (expected: exactly one hit, in §4 P1) and `diff specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass/scratch/before/code-quality-standards.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | rg "Test coverage"` (expected: no output, exit 1). Evidence: one hit; empty output, exit 1
- [x] T021 REQ-003, size measured (CQS, WI). Run `wc -l -c` on both files again and record before, after and delta in `implementation-summary.md`. Expected with the exact text above: CQS grows by 4 lines and 412 bytes over its post-002 size (rung 2, the pointer line and its blank line, P0 item 8); WI keeps its line count and grows by 367 bytes. Report the measured numbers, not these estimates. Evidence: CQS 173/10150 to 177/10562 (+4 lines, +412 bytes); WI 125/7656 to 125/8023 (+0 lines, +367 bytes); recorded in implementation-summary.md
- [x] T022 REQ-004, the canary fails when a never-cut item is removed (CANARY_TEST). Run `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh 2>&1 | rg "seeded_tree_consistent|never_cut_"`. Expected: 13 lines, all starting `PASS`: `seeded_tree_consistent`, then `never_cut_removed_1` to `never_cut_removed_6` and `never_cut_names_1` to `never_cut_names_6`. Then prove the cases can fail: temporarily delete `'**Accessibility**',` from the `strings` list in CANARY, rerun the test, and expect `FAIL never_cut_removed_6` and `FAIL never_cut_names_6` with a non-zero exit; restore the line and rerun to green. Evidence: 13 PASS lines; expected negative-control failures; restored suite passed
- [x] T023 SC-001, the ladder alone shows the reuse step and what it may not cut (CQS). Run `sed -n '/^### Design Restraint Ladder/,/^---$/p' .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md | rg -c "Already in this codebase|never cuts a P0 item"`. Expected: `2`. Then read the printed section once and confirm a reader sees the rung and the pointer without opening another file. Evidence: 2; reuse rung and pointer present
- [x] T024 SC-002, the canary and its tamper tests pass (CANARY, CANARY_TEST). Run `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` (expected: `OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s)).`, exit 0) and `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh; echo "exit=$?"` (expected: 20 `PASS` lines, the 7 from T004 plus the 13 from T022, then `All rule-canary test cases passed`, exit 0). Evidence: expected OK line; 20 PASS lines and suite summary
- [x] T025 Playbook scenario and canary README match the change (DR001, CANARY_README). Run `rg -c "already in this codebase|codebase-reuse rung|codebase reuse / stdlib" .skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md` (expected: `4`) and `rg -n "5 exact-string file\(s\) \+ 2 Iron Law file\(s\) \+ 21 delivery-prefix anchor\(s\)|never-cut|never cut" .skilled/skills/sk-code/sk-code-review/scripts/README.md` (expected: hits on the description, both CONTENTS rows and the expected-output line). Then confirm the README's expected-output line matches the first line T024 printed, character for character. Evidence: playbook rg -c prints 4; README rg hits lines 3, 20, 21, 33; README expected-output line matches canary first line exactly (orchestrator rerun after widening the pattern to never cut)
- [x] T026 No new drift or hygiene findings (CQS, WI, CANARY, CANARY_TEST, DR001). Rerun the two T006 commands and the T007 command. Expected: alignment-drift error and warning counts equal the T006 baseline, the `rg` prints nothing, and comment hygiene exits 0 with no findings on either script. Evidence: runner exit 0, all 2 guards PASSED; alignment-drift Errors: 0, Warnings: 247, equal to T006; rg empty; comment hygiene exit 0 on both scripts (orchestrator rerun)
- [x] T027 Strict spec validation (PHASE). Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/003-doctrine-pass --strict`. Expected: an explicit `RESULT: PASSED`. Evidence: validate.sh --strict prints RESULT: PASSED, Errors: 0 Warnings: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
