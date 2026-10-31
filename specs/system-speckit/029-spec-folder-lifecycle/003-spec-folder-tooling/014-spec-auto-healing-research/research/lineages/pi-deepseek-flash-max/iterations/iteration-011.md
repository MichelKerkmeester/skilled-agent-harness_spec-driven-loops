# Iteration 11: Q4, the CI rebuild job, the seeder and the Gate 3 wording

## Focus

Judge what should be hardened in the branch's own changes: the trigger-index CI rebuild and its token push, the seeder, and the Gate 3 series-parent wording. Evidence is the committed workflow, the generator's output contract, and the seeder's phrase lists.

## Actions Taken

- Read `.github/workflows/trigger-index-rebuild.yml` in full and its diff in `01b0773d067`.
- Read the generator's output contract in `generate-trigger-index.mjs`.
- Read the Gate 3 changes in `spec-gate-core.mjs` and the Pi dialog diff in `spec-gate-enforce.ts`; counted the series-parent copy surface.
- Read the seeder's phrase arrays in `create.sh`.

## Findings

1. The rebuild workflow is well guarded in its core: push-triggered to `main` and `skilled/**`, `contents: write`, per-ref concurrency without cancel, a loop guard keyed to the rebuild commit's subject (because the push runs under the token owner's name), checkout with `TRIGGER_INDEX_PUSH_TOKEN || github.token`, and a push failure message naming the secret and the ruleset. [SOURCE: .github/workflows/trigger-index-rebuild.yml:12] CONFIRMED
2. Hardening gap in what gets committed: the generator writes four outputs (the index plus `corpus-manifest.json`, `generation-diagnostics.json` and `phrase-variants.json` beside it), but the workflow stages only the index path (`INDEX=...trigger-index.json`; `git add "$INDEX"`). Sidecar drift from the same corpus change is therefore never self-healed. [SOURCE: .github/workflows/trigger-index-rebuild.yml:36] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:35] CONFIRMED
3. No postcondition and no retry: after committing, the job never runs `generate-trigger-index.mjs --check`, so a broken commit is only discovered by the next advisory run; and a push race (another push between checkout and push) fails as non-fast-forward with a ruleset-flavored error that names the wrong likely cause. [SOURCE: .github/workflows/trigger-index-rebuild.yml:44] CONFIRMED
4. The token fallback couples CI healing to a personal credential: `github.token` cannot bypass the main ruleset, so the job only succeeds when the secret exists and is owned by a bypass actor. That is a sound local fix, but it is not portable to external users, who need the workflow to state the alternates (relax the ruleset for this path, or run the rebuild as a required check with a bot identity). [SOURCE: .github/workflows/trigger-index-rebuild.yml:19] CONFIRMED
5. Gate 3 wording is single-sourced only partially: the four choice labels are exported constants (`GATE_3_CHOICE_*`), and the Pi dialog consumes all four, but `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE` still inline option C and use two different D wordings; the constant `GATE_3_CHOICE_RELATED` is not used by either menu list. The copy surface is 34 files outside `specs/` that mention the series parent, so the menus can drift from the constants again. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:149] CONFIRMED
6. The seeder duplicates the template-default phrase lists a third time: `create.sh` hardcodes five four-phrase arrays that restate the templates and the `phrase-judge.mjs` frozen sets, alongside a stop-word list that is shared with the cleanup tool and pinned by a test. Pinning tests catch disagreement, but the runtime still holds three copies of the same 20 phrases. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:403] CONFIRMED
7. The loop guard has a benign edge: a merge whose head commit subject starts with the rebuild message is skipped, and `workflow_dispatch` bypasses the guard entirely (by design for manual repair). Both are acceptable, but the guard is message-shaped rather than identity-shaped, so a future commit-message rewrite silently disables it. [SOURCE: .github/workflows/trigger-index-rebuild.yml:20] CONFIRMED

## Ruled Out

- Replacing the subject-based loop guard with an actor check: the token push runs under the owner's name, which is exactly why the original actor check failed; the subject guard is the right shape for this constraint.
- Treating the personal-token dependency as a defect: in this repository it is the only mechanism that satisfies the ruleset; the hardening is documenting alternates, not removing it.

## Dead Ends

- None; each surface resolved from the committed files.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the commit message and the workflow agree on why the token exists.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.github/workflows/trigger-index-rebuild.yml`
- git commit `01b0773d067` (workflow diff)
- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/spec-gate-enforce.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`

## Assessment

- New information ratio: 0.85 (6 of 7 findings fully new; 1 consolidates the workflow's guard design and counts as half new)
- Questions addressed: Q4 (CI rebuild, seeder, Gate 3, token), Q5 (postcondition checks)
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-029 | Commit every generator output, not just the index: derive the staged path list from the generator (for example a `--json` list of written paths) and add a post-commit `--check` that fails when the committed index is not fresh; retry the push once with a rebase instead of failing on a race | Q4, Q5 | `.github/workflows/trigger-index-rebuild.yml` | S | Low; CI-only, and the check is the same generator | Workflow | Generator writes four outputs; workflow stages one; no `--check` postcondition | CONFIRMED gap | Yes (the `--check` gate proves it) | Revert the workflow commit | No |
| R-030 | Single-source the template-default phrases: keep them in the templates (or one data file generated from them) and have `phrase-judge.mjs`, the census/cleanup tools and `create.sh` read that one source; keep the pinning test as an extraction test instead | Q4 | `templates/`, `phrase-judge.mjs`, `create.sh` | M | Med; touches the phrase pipeline, but tests currently pin every copy | Phrase lists across three owners | create.sh:403 arrays duplicate the judge sets and templates | CONFIRMED duplication | Yes (same values, one source) | Revert the commit | No |
| R-031 | Use the exported Gate 3 constants in both menu lists (including one D wording) and add a drift test that scans every menu copy for the exact constant strings, so the 34-file copy surface cannot silently diverge again | Q4, Q5 | `spec-gate-core.mjs` plus a test; the copy surface under `.skilled/commands` and runtime mirrors | S to M | Low; wording only, but it is operator-facing | Gate core, test | The constants exist; the menus inline C and disagree on D | CONFIRMED | Yes (test is deterministic) | Revert the commit | Operator-facing wording only; no packet prose |

## Reflection

- What worked and why: reading the workflow and the generator's own output contract together exposed the sidecar gap immediately; the Gate 3 constants-versus-inline comparison came from one read of the menu block.
- What did not work and why: nothing failed; both surfaces are compact.
- What I would do differently: count the copy surface before judging a wording change, since 34 files is the true drift risk and it was one command away.

## Recommended Next Focus

Iteration 12: finish Q4 on the cleanup tools and the corpus apply: what the dry-run skip counts hide (files with no frontmatter delimiter), what verification the 375/541-folder applies used, and what a machine-checkable post-apply audit should assert about marker-only diffs.
