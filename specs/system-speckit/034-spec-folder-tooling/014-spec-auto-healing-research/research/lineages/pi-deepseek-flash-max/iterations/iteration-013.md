# Iteration 13: Q5, where each proposed check belongs

## Focus

Answer Q5 by inventorying what CI and the git hooks already run, then placing each proposed drift check where it is cheapest and catches the drift earliest. The evidence is the workflow set and the pre-commit/pre-push hook contracts.

## Actions Taken

- Read `changed-packet-validation.yml` (per-change gate) and `strict-pass-freshness-report.yml` (weekly report).
- Read the workflows README inventory and the advisory-checks role.
- Read the pre-commit and pre-push hook contracts in `.skilled/scripts/git-hooks/`.

## Findings

1. The per-change gate is already the right first line: `changed-packet-validation.yml` selects only packets whose own graded documents changed, validates with `--strict --no-recursive`, blocks only regressions by comparing against a merge-base worktree, and fails closed when the validator emits no verdict. It installs the toolchain because a missing build reads as failing packets. [SOURCE: .github/workflows/changed-packet-validation.yml:48] CONFIRMED
2. Whole-corpus visibility exists but is deliberately not a gate: the weekly `strict-pass-freshness-report` sweep reports only, with an explicit rationale that a report misread as a gate is worse than none. That is the natural home for corpus-class census output, not for blocking checks. [SOURCE: .github/workflows/strict-pass-freshness-report.yml:5] CONFIRMED
3. The advisory suite already runs the trigger-index freshness check (`generate-trigger-index.mjs --check`) without gating, so index staleness is reported on every relevant change and repaired by the rebuild workflow after merge. [SOURCE: .github/workflows/README.md:20] CONFIRMED
4. The pre-commit hook already demonstrates repair-on-commit: it auto re-mints a packet's `graph-metadata.json` when staged documents change and blocks only when it cannot fix it, alongside route re-mint, mirror sync, comment hygiene and card-sync gates. A cheap deterministic repair belongs here; a corpus-wide sweep does not. [SOURCE: .skilled/scripts/git-hooks/pre-commit:535] CONFIRMED
5. The pre-push hook owns volume and history gates: a mass-deletion ceiling, remote-allowlist approval, the route guard, per-ref track-root drift and commit-message templates. New checks over a whole pushed range belong here (or in CI), not in pre-commit. [SOURCE: .skilled/scripts/git-hooks/pre-push:20] CONFIRMED
6. Placement for the proposed checks: the scaffold-render anchor test, the Gate 3 constants drift test and the phrase-list single-source test are deterministic unit checks and belong in the spec-kit test suites that `spec-kit-check.yml` already runs on path-filtered changes; the corpus census and per-class counts belong as an added section of the weekly freshness report or the advisory suite; the applied-state audit and phrase-cleanup diff rule belong in CI advisory or pre-push because they need a base revision and volume; the trigger-index sidecar staging and post-commit `--check` belong inside the rebuild workflow. [SOURCE: .github/workflows/README.md:38] INFERRED placement from the existing gates' contracts; confirmable by writing one test and one report section
7. The cheapest check that would have caught the iteration-4 template bug does not exist anywhere: no workflow or hook renders the templates and checks the rendered anchor pairing, so the nesting shipped through every existing gate into every new scaffold. [SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:184] CONFIRMED for the absence (no template-render check in the workflow inventory), INFERRED as the cheapest catch

## Ruled Out

- Adding a corpus-wide sweep to pre-commit: the pre-commit contract is per-commit and fast; the derived-metadata re-mint is the ceiling of what belongs there.
- Making the weekly report a gate: the workflow explains why a non-failing gate is worse than none; visibility and gating are separate jobs.

## Dead Ends

- Looking for a template-render validation job in the workflow inventory: none exists; the templates are only ever copied, never re-checked as rendered output.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none; the README's push-versus-PR table and the workflow contracts agree.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.github/workflows/changed-packet-validation.yml`
- `.github/workflows/strict-pass-freshness-report.yml`
- `.github/workflows/README.md`
- `.skilled/scripts/git-hooks/pre-commit`
- `.skilled/scripts/git-hooks/pre-push`
- `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl`

## Assessment

- New information ratio: 0.80 (4 of 7 findings fully new; 3 consolidate existing gates and placement and count as half new)
- Questions addressed: Q5 fully at placement level
- Questions answered: none yet

## Recommendations

| ID | Recommendation | Question | Where it lives | Effort | Risk | Files touched | Evidence | Standing | Idempotent? | Reversed by | Changes document prose? |
|----|----------------|----------|----------------|--------|------|---------------|----------|----------|-------------|-------------|--------------------------|
| R-035 | Add a scaffold-render anchor test: render `spec.md` (and the other core docs) for Levels 1, 2 and 3 from the templates and assert every anchor pair is matched, ordered and non-nested; run it in the spec-kit CLI suite that `spec-kit-check.yml` already triggers on cli/template changes | Q5, Q2 | `.skilled/skills/system-spec-kit/runtime/cli/tests/` under the existing workflow | S | Low; deterministic render, no writes outside temp | New test file | No existing gate renders templates; the nesting bug shipped through all gates | CONFIRMED absence | Yes (test) | Delete the test | No |
| R-036 | Add a Gate 3 constants drift test in the runtime hook suites: assert both menu lists contain the exported `GATE_3_CHOICE_*` strings and one D wording, so the 34-file copy surface cannot silently diverge from the constants again | Q5, Q4 | `.skilled/skills/system-spec-kit/runtime/tests/hooks/` | S | Low | Test file plus the menu strings | The constants exist but are only partially consumed (iteration 11, finding 5) | CONFIRMED | Yes (test) | Delete the test | No |
| R-037 | Place the corpus census as a section of the weekly freshness report or the advisory suite (reports, not gates), and keep per-commit gates to the per-packet validator: corpus counts cost minutes and belong on a schedule | Q5, Q3 | `strict-pass-freshness-report.yml` or `advisory-checks.yml` | S | Low; report-only | Workflow or report script | The weekly report exists and explains its non-gating role | CONFIRMED placement, INFERRED content | Yes (report) | Delete the section | No |
| R-038 | Put the applied-state audit and the phrase-cleanup diff rule in CI advisory or pre-push, never pre-commit: both need a base revision or a staged range and do not fit the per-commit budget; the derived-metadata re-mint stays the pre-commit ceiling | Q5, Q4 | `.github/workflows/` advisory or the pre-push hook | M | Med; rule must tolerate legitimate adjacent metadata edits | New check | The audit needs the base revision; pre-commit is per-commit by contract | INFERRED from gate contracts | Yes (check) | Delete the check | No |

## Reflection

- What worked and why: the workflows README's push/PR table plus the two hook contracts gave the full placement map without reading all 28 workflows; the per-change gate's regression-only design is the key precedent for every new packet check.
- What did not work and why: nothing failed; the inventory is well documented, which is itself worth noting.
- What I would do differently: read the hooks README first in any future placement question; it names every gate and where it runs.

## Recommended Next Focus

Iteration 14: adversarial pass. Try to refute the top recommendations against the code, especially every idempotency, reversibility and never-change-prose claim, and record any refutations as findings with both sources.
