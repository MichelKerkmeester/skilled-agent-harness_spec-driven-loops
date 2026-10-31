trigger-index-rebuild.yml: both jobs carry a condition, so T092 and T093 AND the switch onto them
## R26 proof
switches 42 expected 42
gate RESULT: PASSED
mutant: rejected

## R26 notes

Per-group switched jobs in the tree: FRESHNESS 11 jobs in 8 files, TESTS 24 in 17, REVIEW 3 in 3, REPORTS 3 in 2, MESSAGES 1 in 1, which is 42. The unswitched jobs are the two in `dependabot-auto-merge.yml`.

Bare switch lines: 39, each directly above its job's `runs-on:`. ANDed conditions: 3 (`trigger-index-rebuild.yml` `rebuild` and `push`, `skill-doc-frontmatter.yml` `doc-version-raise`), each with the original expression as the last conjunct, checked as a verbatim substring of the parsed `if:` string.

Deviations from the task text:
- `command-tree-parity.yml` took `SKILLED_CI_TESTS`, not the `SKILLED_CI_FRESHNESS` its task names, because the README path-filtered row and `switch-groups.md` list it under TESTS. The task's literal FRESHNESS grep printed `0` on that file.
- `chart-corpus.yml` took `SKILLED_CI_TESTS` although no switch task names it. Without it the tree holds 41 switches, not the 42 the proof requires.
- The negative control's perl pattern was written against the pre-AND text of the `rebuild` condition and is a no-op on the current line (observed: the copy came out identical to the original). The run used a pattern that matches the whole current `rebuild` line (`s/^    if: "[^\n]*endsWith[^\n]*$/.../m`) so the control could fail. The mutant's `push` line reads the ANDed form, which contains `needs.rebuild.outputs.committed == 'true'`, not the bare original line the task describes.
- Negative control for the validators: `validate-message.mjs` exits `1` on a non-conforming subject, and `actionlint` exits `1` on an unbalanced expression, so their silent exit `0` on the real files is a pass they could have failed.
