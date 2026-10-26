# Review: template example neutralization

Read-only review of `git diff HEAD` over `S/templates/core`, `S/templates/addons` and `S/references/workflows/spec-authoring-card.md`, where `S` is `.skilled/skills/system-spec-kit`. Line numbers are in the working tree.

## Checks

| Check | Result |
|-------|--------|
| (1) Only `GOOD:`/`WEAK:` text changed for this phase; instructions keep their meaning | Pass. Every fill-note instruction is byte-identical before `GOOD:`, except `spec.md.tmpl:111` (new Measured Behavior note), `spec.md.tmpl:436` (RELATED DOCUMENTS, four to three links), `tasks.md.tmpl:167` (Fix Completeness to FIX ADDENDUM). Those three belong to phases 016 and 017 and do not break a note. WEAK edits only swap "flag" for "option" or drop "quiet mode". |
| (2) One GOOD then one WEAK; GOOD concrete, WEAK vague | Pass on order and count in every changed note. Concreteness issues listed below. |
| (3) One story, internally consistent | Mostly. Paths `scripts/rotate-logs.sh` and `logs/archive/`, counts 10, 3 and 10, and exit 2 for a missing value agree across files. Four notes drift; see findings. |
| (4) `rg -n -e '--quiet' -e 'recommend-level' -e '17-line' -e 'prints 1 and 17' S/templates/core S/templates/addons` | Printed nothing, exit 1. Pass. |
| (5) Weak-model misreads | See findings. |

## Findings

1. P1 `templates/core/spec.md.tmpl:404`: "GOOD: v1.0 2026-10-24: added `--keep <n`." The code span drops the closing `>`. A weak model copies GOOD text literally and will write a malformed option. Fix: `--keep <n>`.

2. P1 `templates/addons/research.md.tmpl:843`: "GOOD: `--keep` with no value exited 2: the parser never checked the next word." Exit 2 on a missing value is the designed behavior everywhere else (`spec.md.tmpl:189`, `:320`, `:328`, card section 7), yet this note presents it as the failure. The cause also contradicts the symptom: a parser that never checks the next word would not exit 2. A model may treat exit 2 as a bug or invert the rule. Fix example: "`--keep` with no value deleted every archive: the parser never checked the next word. Fix: exit 2 before any delete."

3. P1 `templates/addons/research.md.tmpl:403`: "GOOD: 1. Read the `-k` value." Introduces a short option `-k` that no other file names. A model may add a `-k` alias or think the option is `-k`. Fix: "Read the `--keep` value."

4. P2 `templates/addons/research.md.tmpl:777`: "`--dry-run`: lists what it would delete." Names a second feature outside the `--keep` story. A model may add `--dry-run` to scope. Either drop it or use an existing behavior (for example "No option: deletes nothing.").

5. P2 `templates/core/implementation-summary.md.tmpl:128`: "GOOD: Flag over config file: one run can pick a different count without editing config." Every other note says "option", and the rejected alternative elsewhere is an env var (`research.md.tmpl:111` "An env var adds a hidden input"). Not wrong, but two rejected alternatives across one story and the leftover word "Flag". Suggest "Option over env var: ...".

6. P2 `templates/core/spec.md.tmpl:310`, `:415`, `:425` versus `:320`: three open-question notes say "Does `--keep 0` delete every archive? Decision: no, a zero value exits 2", the fourth says a missing value exits 2. Both can be true, but the brief's story names only the missing-value exit. A model filling a single spec sees only one variant, so this is harmless per file, but `--keep 0 exits 2` is a new rule a model may copy into scope. Consider making all four the missing-value question, which also matches `:189` and `:328`.

7. P2 `templates/core/spec.md.tmpl:253`, `:258`: "Empty input: the script exits 2 with usage." In this story "empty input" reads as an empty `logs/archive/`, and exiting 2 there would be odd; the intended case is a missing `--keep` value. Suggest "Empty input: `--keep` with no value exits 2 with usage."

8. P2 timing numbers drift: `spec.md.tmpl:207`/`:212` "a run over 10,000 archives finishes in under one second", `tasks.md.tmpl:242` "`--keep 3` finishes in under 5 ms", `research.md.tmpl:621` "The new check adds under 5 ms". Not contradictory (different sizes), but the spec note also says "adds no measurable time" next to a one-second bound, which a model may copy as a self-contradicting NFR. Low risk.

9. P2 `templates/addons/debug-delegation.md.tmpl:95`: "confirm one `rm` on the `--keep` path." With 10 archives and `--keep 3`, seven files go; "one `rm`" only holds if `rm` takes all seven at once. Ambiguous, low risk. Suggest "confirm seven deletions on the `--keep 3` path."

10. P2, out of phase scope, noted because it touches a fill note: `templates/core/plan.md.tmpl:124` says "name the three phases", while the rewritten card section 6 says "A plan names its 3 or 4 phases". Same in the pre-existing quality-gate note `plan.md.tmpl:67`, "prints the new branch before the task starts", which cannot be true before implementation; carried over unchanged from the old example.

## Story consistency summary

Consistent across files: `scripts/rotate-logs.sh`, `logs/archive/`, 10 archives, 3 after `--keep 3`, 10 after a plain run, missing value exits 2, branch `feat/rotate-logs-keep` / `feat/keep`, packet `004-rotate-logs-keep`. Card section 6 ("ten archives become three") and section 7 (T001 line) match the templates.

Verdict: CHANGES NEEDED

## Re-review 2026-10-26

Fresh read-only re-review of the shared tree. `S` = `.skilled/skills/system-spec-kit`.

All ten first-review findings are fixed: (1) `S/templates/core/spec.md.tmpl:408` reads `--keep <n>`; (2) `S/templates/addons/research.md.tmpl:843` is now a real defect (4 archives kept on a tied sort); (3) `research.md.tmpl:403` reads the `--keep` value, and `rg -e '-k`'` over the templates prints nothing; (4) `rg dry-run` prints nothing, `research.md.tmpl:777` describes only `--keep <n>`; (5) `S/templates/core/implementation-summary.md.tmpl:128` reads "Option over environment variable"; (6) `spec.md.tmpl:314`, `:324`, `:419`, `:429` all ask the missing-value question; (7) `spec.md.tmpl:253`, `:262` say an empty `logs/archive/` exits 0 and a missing value exits 2; (8) `spec.md.tmpl:207`, `:212` read "adds under 5 ms", no one-second bound; (9) `S/templates/addons/debug-delegation.md.tmpl:95` reads "deletes exactly 7 of the 10 archives"; (10) `S/templates/core/plan.md.tmpl:124` and card `S/references/workflows/spec-authoring-card.md:91` both name three phases, and `plan.md.tmpl:67` now checks the archive count before the task.

Checks rerun: term gate `G` over `FILL:` lines in `S/templates/core` and `S/templates/addons` prints one line, the D3 instruction at `research.md.tmpl:777`; snapshot gate prints 0; card `rg -c -i 'quiet|recommend-level'` prints 7 and the card is 176 lines; every changed template has balanced IF and ANCHOR markers; `template-fill-guidance.vitest.ts` 24 passed, `scaffold-golden-snapshots.vitest.ts` 12 passed, `CARD SYNC OK`, `EXAMPLE_DRIFT_OK`. Every `GOOD:` example that states a count agrees with the story (10 archives, 3 after `--keep 3`, 10 after a plain run, missing value exits 2). The per-file `git diff --numstat` values on `tasks.md:52` to `:63` match the tree.

Findings:

1. P1 closeout honesty. `acceptance-criteria.md:58` (AC-001) and `:65` (AC-008) are marked `Met` with recorded deviations, but the closure statement at `acceptance-criteria.md:94` says "AC-001, AC-003 and AC-008 are unmet", `tasks.md:150` (CHK-020) says the same, `tasks.md:151` (CHK-021) and `tasks.md:163` (CHK-FIX-001) stay open on the term gate printing 1, and `next_safe_action` in `acceptance-criteria.md:14` and `implementation-summary.md:14` still asks to decide AC-001 and AC-008. The docs disagree on the completion state. Fix: pick one state. If the D3 exclusion deviation stands, keep AC-001 and AC-008 Met, make the closure name only AC-003 (or none once this re-review's verdict is recorded), tick CHK-021 and CHK-FIX-001 with the excluded-gate evidence, and update both `next_safe_action` fields; otherwise mark both rows Unmet.
2. P2 `tasks.md:140` and `:141` (CHK-010, CHK-011) say `git diff --numstat` was "not run, because the closeout brief bars git", while `tasks.md:52` to `:63` report numstat values that do match the tree. Fix: say CHK-010 was run per file and is replaced by the accounting on T005 to T016.
3. P2 the scope count is stale: `acceptance-criteria.md:65`, `implementation-summary.md:110` and `tasks.md:78` say 52 paths; `git diff --name-only -- . ':!specs' | wc -l` now prints 54 tracked paths (plus 4 untracked new files). Membership still holds. Fix: say "every path in the list" without a number, or update it.
4. P2 `S/changelog/v2.12.0.0.md:30` says the 87 lines sit in "12 template, card and example files"; the sweep covered 11 templates and the card, and `spec.md:84` puts `templates/examples/level-*` out of scope. Fix: "12 template and card files".

VERDICT: CHANGES NEEDED

## Fix check 2026-10-26

A fresh checker read the tree after the fixer's pass.

1. P1 closeout state: fixed. AC-001 and AC-008 are Met with deviations (`acceptance-criteria.md:58`, `:65`); the closure statement reads "No. AC-003 is unmet." (`:94`); CHK-020 stays open naming only AC-003 (`tasks.md:150`); CHK-021 and CHK-FIX-001 are ticked with the excluded-gate evidence (`tasks.md:151`, `:163`); both `next_safe_action` fields name T024 (`acceptance-criteria.md:14`, `implementation-summary.md:14`). The excluded line is the D3 instruction at `templates/addons/research.md.tmpl:777` and names no benchmark task. P0 tally 11/13 matches the boxes (11 ticked, 2 open).
2. P2 CHK-010 and CHK-011: fixed (`tasks.md:140`, `:141`), both now say the check ran and is replaced by the per-task accounting on T005 to T016.
3. P2 path count: fixed. `acceptance-criteria.md:65`, `tasks.md:78` and `implementation-summary.md:110` say "more than 13 paths" and keep the membership claim.
4. P2 release notes: fixed. `S/changelog/v2.12.0.0.md:30` reads "12 template and card files".

Strict validation of this phase with `SPECKIT_DRAFT_AUTO_REPAIR=0`: Errors 0, Warnings 0, RESULT: PASSED, exit 0. Open paperwork: AC-003, CHK-020 and T024 still read unmet and need updating to cite this verdict.

VERDICT: PASS
