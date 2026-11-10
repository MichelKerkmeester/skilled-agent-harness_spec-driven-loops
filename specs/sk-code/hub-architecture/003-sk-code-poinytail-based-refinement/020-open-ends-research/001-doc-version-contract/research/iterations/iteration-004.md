# Iteration 4: Q5 Consolidation Pass 2 — CI Wiring Source-Verified, Engine-Test Claim Refined

## Focus

Q5 consolidation, dispatched while the strategy's Q5 box is already ticked (Section 3) and listed as carried-forward. Iteration 3 closed the inventory, but two load-bearing legs lacked direct wiring evidence and one iteration-2 dead-end sits next to a workflow that was never examined:

1. Iteration 3 named "CI's coverage guard" but cited only the guard script's header — the workflow that actually runs it (`.github/workflows/skill-doc-frontmatter.yml`) was never read.
2. Iteration 2 ruled out "the engine's `.mjs` tests as a wired CI check" via the claim that CI globs `test_*.py` only — but `.github/workflows/sk-doc-script-tests.yml` exists and runs a suite containing Python tests that invoke the engine binary. Whether that changes the "no CI doc-version check" conclusion needed direct evidence.

Both were resolved with fresh file reads. This pass treats Q5 as a re-verification exercise, not fresh ground. Deferred alternatives: Q2, Q3, Q4 remain open and are the recommendation below.

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-strategy.md`, the state-log projection (7 lines, 3 iteration records), and `iterations/iteration-003.md`; verified `iterations/iteration-004.md` and `deltas/iter-004.jsonl` absent; listed `.github/workflows/` and the hook/git-hook surfaces.
2. Read `.github/workflows/skill-doc-frontmatter.yml` in full.
3. Read `.github/workflows/sk-doc-script-tests.yml` in full.
4. Ran one combined search over `.github`, `.skilled/hooks`, `.opencode/scripts` and the sk-doc scripts tree for `frontmatter-version` with `--glob '!**/*.md'`; listed the sk-doc tests directory; read the test runner head; grepped the test tree for engine invocations; captured iteration 3's record shape and the frontmatter-templates version literals.

## Findings

1. **The CI coverage guard is a real wired workflow — and its checked contract still has no `version` field.** `.github/workflows/skill-doc-frontmatter.yml` runs on PRs to `main` and pushes to `main`/`skilled/**` when skill `references/**` or `assets/**` paths change, fails closed if the guard file is missing, and executes `bash "$GUARD" . --coverage` [SOURCE: .github/workflows/skill-doc-frontmatter.yml:28-42]. The guard's header contract remains the five fields iteration 2 read — `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8]. Net: CI does check skill-doc frontmatter coverage, but it cannot see any document's stored version.

2. **CI does exercise the engine — via Python tests, against fixtures, not against repository docs.** `.github/workflows/sk-doc-script-tests.yml` runs on every push/PR to `main` and `skilled/**` and executes `bash .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh` [SOURCE: .github/workflows/sk-doc-script-tests.yml:50-53]. The runner's loop globs `test_*.py` only [SOURCE: .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh:12], dispatching each file through pytest or plain python [SOURCE: .opencode/skills/sk-doc/scripts/tests/run-script-tests.sh:19-22]. One file in that glob, `test_validation_switch.py`, invokes the engine: `frontmatter-version.mjs gate --from-manifest` [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183] and `frontmatter-version.mjs apply --paths` [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:205]. Consequences: (a) iteration 2's narrow claim stands — the `.mjs` file `test-frontmatter-version.mjs` is not run by any workflow; (b) the broad gloss "the engine is untested in CI" would be wrong — its CLI modes run on every push; (c) no CI step inspects any real document's stored version, so the Q5 conclusion is unchanged. Recorded as a partial SUPERSEDES of the iteration-2 dead-end text.

3. **Fresh no-caller re-verification: `verify` and fleet `apply` still have no automated caller.** A non-markdown search for `frontmatter-version` across `.github`, `.skilled/hooks`, `.opencode/scripts` and the sk-doc scripts tree returns only the post-edit router (Row 3, gate mode, presence+format) and test files [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:38]. No workflow or hook invokes `verify` or an operator-scaled `apply`; the `apply` leg in `test_validation_switch.py` runs against an empty path list inside a test [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:205].

4. **The version field is born from a template literal, not a generator.** The `frontmatter-templates` asset carries literal `version:` values (`1.0.0.0`, `1.7.0.0`, `0.1.2.0`, and similar) as the authoring surface where a document's first version value is typed by hand [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:411][SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md:476]. With `apply` as the only automated writer [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:445], every version value originates from a template literal or an operator command — never from a pipeline.

5. **Q5 final inventory, with the CI legs now source-cited:** writers — `apply` only, operator-run; automated checkers — post-edit gate (skill-tree versioned docs, presence+format), package validators (command-run, presence+format), CI coverage guard (five-field contract, version excluded), CI script tests (engine fixtures only); `verify` — no caller anywhere. All three artifacts of this iteration cite the two previously uncited CI surfaces.

## Questions Answered

- Q5: Which hooks, generators or CI steps write or check a doc version today, if any? — re-verified with fresh automation-surface evidence. The CI wiring legs are now source-cited; the conclusion is unchanged: no automated writer exists, all automated checks are presence/format (or engine-fixture tests), and `verify` has no caller.

## Questions Remaining

- Q2: What should doc versions mean for an external author?
- Q3: What is the smallest contract that stays green by construction?
- Q4: Should the per-doc version exist at all?

## Ruled Out

- **CI script tests as a doc-version check.** The suite runs the engine against fixtures in gate/apply modes [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183]; it never inspects real repository documents, so it cannot fail on a stored version and does not close the enforcement gap.
- **Re-running the Q5 inventory as fresh ground.** Iteration 3 already consolidated Q5; this pass's value was adversarial re-verification plus the two uncited CI wiring surfaces. Repeating the inventory itself would add no new evidence.

## Dead Ends

- None newly eliminated for the Q5 focus. The iteration-2 `.mjs`-suite claim is refined, not reversed: `test-frontmatter-version.mjs` remains unrun by any workflow, while a sibling Python test does invoke the engine in CI.

## Edge Cases

- Ambiguous input: the dispatch asked to consolidate Q5 while strategy Section 3 already ticks it. Chosen interpretation: an adversarial re-verification pass over the Q5 closure's load-bearing claims (CI wiring, engine-test status, no-caller claim), recording Q2/Q3/Q4 as deferred. Alternatives deferred, not dropped.
- Contradictory evidence: iteration 2's dead-end text ("engine `.mjs` tests … unreferenced by any workflow") against `.github/workflows/sk-doc-script-tests.yml` running a suite that invokes the engine. Resolution: the `.mjs`-specific claim holds; the generalized reading does not. Both readings preserved with citations and recorded as a SUPERSEDES edge on the broad gloss.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.github/workflows/skill-doc-frontmatter.yml` (lines 28-42)
- `.github/workflows/sk-doc-script-tests.yml` (lines 50-53)
- `.opencode/skills/sk-doc/scripts/tests/run-script-tests.sh` (lines 12, 19-22)
- `.opencode/skills/sk-doc/scripts/tests/test_validation_switch.py` (lines 183, 205)
- `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` (lines 411, 476)
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` (line 38; Row 3 lines 198-212 per iteration 3)
- `.opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh` (lines 7-8 per iteration 2)
- Search surfaces: `.github/`, `.skilled/hooks/`, `.opencode/scripts/`, `.opencode/skills/sk-doc/scripts/tests/`

## Assessment

- New information ratio: 0.70
- Questions addressed: Q5 (pass 2)
- Questions answered: Q5

## Reflection

- What worked and why: reading the two CI workflow files end to end instead of trusting the iteration-3 summary. The workflow files are the authoritative wiring evidence, and one of them contained a fact (a Python test invoking the engine) that the dead-end ledger had generalized away. Checking the test runner's glob line directly is what separated "engine tests unreferenced" into its true and false halves.
- What did not work and why: nothing failed. The one inefficiency was ordering: the workflow listing was available in iteration 3's state read, so this pass could have been scheduled earlier.
- What I would do differently: on a consolidation pass over an already-closed question, start from the claims that were cited with the fewest sources — the CI legs here rested on one script header each — rather than re-reading the narrative.

## Recommended Next Focus

Q3: What is the smallest contract that stays green by construction? With the enforcement inventory now closed and both CI legs source-cited — every automated check is presence/format or engine-fixture only, and `verify` has no caller — Q3 can be answered against a fixed constraint set: what property can a stored per-doc version assert such that no automated surface can ever fail on it while it remains meaningful. Q4 (should it exist at all) and Q2 (external-author meaning) follow, since the viable contract shapes from Q3 bound both.

## SCOPE VIOLATIONS

None. All writes stayed under the iteration and delta allowed-write paths; the append gateway is the only writer of the state projection.
