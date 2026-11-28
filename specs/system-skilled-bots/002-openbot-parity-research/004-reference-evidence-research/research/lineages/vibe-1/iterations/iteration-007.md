# Iteration 7: Phases 012, 013 and 014 — test manifests, skill evals and doc-alignment linters

## Focus

Phases `013-manual-testing-scenarios`, `014-skilled-and-doc-alignment` and `015-deep-review` against
the test and documentation surfaces of `context/buzz-main`, `context/hermes-muse-main` and
`context/turnstone-main`.

This iteration corrects a premise. The 003 synthesis states for 012: "Reference to study first: no
context repository applies"
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:013-manual-testing-scenarios],
and for 013 it points only at the repo's own `.skilled/commands/` files
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:014-skilled-and-doc-alignment].
Both statements are wrong. Three of the ten reference repos carry exactly the artifacts these two
phases are supposed to produce: a machine-readable scenario manifest, a skill-adherence eval, and
four different doc-alignment linters. The synthesis's own gap tables for these phases are about
*missing artifacts* (012 gap 2, 013 gap 1) — the artifacts exist in the references and were never
looked for.

`steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among
the sources as absent.

## Findings

### F-7-1 — A scenario manifest is JSON with a paraphrase set, a run count and a match mode (phase 012)

`turnstone-main/tests.json` is a 414-line behaviour-test manifest with three top-level keys:
`description`, `defaults: {n_runs: 5, max_turns: 15}`, and `cases`
[SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:1-7]. Each case carries `id`,
`description`, `user_prompt`, an inline `setup.files` map, `expected_actions: [{tool, args}]`,
`match_mode`, and — the part that matters — a `user_prompts` array of **ten paraphrases of the same
request** [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:8-44].

Observed. Four design decisions a manual-testing scenario set should copy:

- **The paraphrase set is the test.** The case is not "does the agent read before editing when asked this way" but "does it read before editing when asked any of ten ways" — `"Fix the typo in config.py"`, `"In config.py, correct the misspelling"`, `"Kindly rectify the typographical error"`, `"Hey, swap 'recieve' for 'receive'"` [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:32-43]. A single-prompt scenario tests the prompt, not the behaviour.
- **`n_runs: 5`** [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:4] — a non-deterministic subject is run five times and the case is judged on the aggregate, not on one lucky pass.
- **`match_mode: "ordered_subset"`** [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:31] — the expected actions must appear in order, but other actions may interleave. This is the difference between a scenario that fails on any harmless extra step and one that fails only on a wrong order.
- **`setup.files` is inline** [SOURCE: specs/system-skilled-bots/context/turnstone-main/tests.json:12-16] — the fixture is a string in the manifest, so a scenario is one self-contained record with no fixture directory to keep in sync.

### F-7-2 — Test discovery by module-name convention, plus a guard that enforces the convention (phase 012)

`buzz-main/crates/buzz-db/TESTING.md` documents a CI lane that "discovers tests and Cargo packages
by structure rather than by exact lists"
[SOURCE: specs/system-skilled-bots/context/buzz-main/crates/buzz-db/TESTING.md:3-5]. The convention
is four rules: the test lives in a module whose name ends in `postgres_tests`; it is marked
`#[ignore = "requires Postgres"]` so infrastructure-free jobs stay fast; it connects through
`crate::test_support::database_url()`; and tests needing more than Postgres and Redis go in an
`external_infra*_tests` module
[SOURCE: specs/system-skilled-bots/context/buzz-main/crates/buzz-db/TESTING.md:9-16].

The convention is enforced, not just documented: step 5 says to run
`scripts/test-postgres-test-discovery.sh` after adding or moving a test, and "the same guard runs in
CI immediately after changed-path detection"
[SOURCE: specs/system-skilled-bots/context/buzz-main/crates/buzz-db/TESTING.md:17-18]. The guard is
`scripts/check-postgres-test-discovery.py`, which parses Rust source with a `sanitize_rust` pass that
"blanks comments and literals while preserving byte offsets and braces"
[SOURCE: specs/system-skilled-bots/context/buzz-main/scripts/check-postgres-test-discovery.py:30-31]
before matching `#[ignore]` attributes against `mod` names
[SOURCE: specs/system-skilled-bots/context/buzz-main/scripts/check-postgres-test-discovery.py:15-20].

Observed. Phase 012's scenario corpus has the same problem this solves: a new scenario must be
*findable* without anyone editing a list. The pattern is a naming convention plus a script that
fails when a scenario violates it. The `sanitize_rust` detail is the non-obvious part — a naive
regex over source matches `#[ignore]` inside comments and string literals, so the guard blanks them
first while preserving offsets so line numbers stay correct.

### F-7-3 — A falsifiability standard for tests, with the PR numbers that earned it (phases 012 and 014)

`buzz-main/TESTING.md` carries a section headed "Review-Proven Test Standards", described as "Mined
from the last 25 PRs' review threads"
[SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:19-23]. The rule:

> **Regression tests must bind the production seam and be falsifiable.** A guard whose removal
> doesn't fail any test protects nothing — mutations survived the full mobile suite twice (PRs
> #6996, #7013). Don't bind a regression test to a test-only helper instead of the production code
> path (PR #7013). Give pure predicates a table test over the full input combination space (PR
> #6807). Scope Playwright locators — unscoped `getByText` in a required smoke test is a strict-mode
> flake (PR #6980).
> [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:25-32]

Observed. Two things to lift. First, the standard itself: a test that still passes when the guard is
deleted is not a test, and the way to know is to delete the guard and watch it fail. Second, the
*form* — each rule carries the PR that produced it, so a reader can check the claim and a future
maintainer can tell a hard-won rule from an opinion. Phase 014's deep review is where this belongs:
it is the review criterion, stated once, with evidence.

### F-7-4 — A skill eval embeds the skill body inline, so the eval is self-contained (phase 013)

`turnstone-main/eval_skill_adherence.json` has `defaults: {n_runs: 3}` and three cases
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-5]. Each case
carries the skill's **content inline** as a string, not a path:

```json
"skill": { "name": "search-first",
           "content": "# Search First\n\nBefore answering ANY question about where something lives in the codebase, you MUST call the `search` tool first. Never answer from memory." }
```
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:8-11]

then a `user_prompt`, `expected_actions`, `match_mode` and `max_turns`
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:12-16]. The three
cases test three different skill shapes: a tool-mandate skill (`search-first`), a
sequence-mandate skill (`test-after-edit`, expecting `write_file` then a `bash` command matching
`pytest`) [SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:17-35],
and a side-effect skill (`changelog-update`, expecting an `edit_file` on `CHANGELOG.md` with
`match_mode: "subset"`) [SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:36-54].

Observed. This is the missing artifact for 013. "Skill alignment" in the plan means the skill text
matches the runtime; the reference tests the stronger claim — that a model given the skill text
*does the thing*. Embedding the content inline is what makes it a test of the text rather than a
test of whatever the skill file currently says. Note also `args_pattern: {command: "pytest"}`
[SOURCE: specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:31] — a partial
argument match, so the eval does not pin the exact command line.

### F-7-5 — A residue linter: named regexes for things a prior round fixed that must not come back (phase 013)

`turnstone-main/lint_hypothesis.py` is a "Consistency linter for HYPOTHESIS.md" with seven
deterministic checks, A through G
[SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:3-11]. Check B is the
transferable one: a `residue` dict of **13 labelled regexes**, each naming a defect a previous round
fixed
[SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:127-141] — for example
`"halt/ready leftover": r"halt/ready"`, `"R=id ill-typed": r"R=\\mathrm{id}"`, `"orphan τ^star
(unify→τ_H)": r"\\tau\\^\\star"`, `"unbraced _\\cmd subscript (style: brace it)": r"_\\\\"`. Two
further checks are structural rather than textual: bare `$…$` math and an indented ```` ```math ````
fence [SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:145-154].

The linter has a `--check` mode that "stops after sections A and B and exits non-zero if a
delimiter, fence, span-body or residue check failed (the pre-commit hook)"
[SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:19-22], implemented as
`sys.exit(1 if errors else 0)` [SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:162-164].
It also documents its own false positives: "Known benign flags: E flags the γ,ρ symbol-table row; G2
flags τ_H" [SOURCE: specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:24-25].

Observed. This is the mechanism 013 lacks. A doc-alignment pass that fixes findings has no memory:
the same defect returns in the next edit. A residue list is that memory, and it is cheap — one regex
and one human label per defect, appended when a finding is fixed. The documented benign flags are
the part most linters omit and most maintainers need, because an unexplained false positive is how a
linter gets disabled.

### F-7-6 — A generated reference document is checked by regenerating it and diffing (phase 013)

`hermes-muse-main/.github/workflows/test.yml` runs, as one CI step:

```yaml
- name: Generated interface reference is current
  run: python -m hermes_muse.surface && git diff --exit-code skills/companion/references/interface.md
```
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:26-27]

Observed. The strongest available form of doc alignment: the document is *generated*, so it cannot
drift, and the check is `git diff --exit-code` on the committed copy. There is no separate
"is the doc up to date" review step because there is nothing to review — either the generator's
output matches the committed file or CI fails. Phase 013's gap 2 is that its reports are written
outside the checkout and cannot be checked later
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:014-skilled-and-doc-alignment];
a generated-and-diffed artifact is the opposite arrangement and the one to prefer wherever the
content is derivable.

### F-7-7 — A removal-completeness linter with a false-positive control (phase 013)

`hermes-muse-main/scripts/check_callers.py` is described as "A11: find 0.3.x Muse dependencies in
external callers (cron prompts, scripts) before the cutover"
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:1]. It scans
four classes of residue: removed `muse_manage` action names, old `cron_<job id>_` session-id
prefixes, direct reads of the old `muse/state.db` `records` table, and imports of removed
`hermes_muse` modules
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:3-9]. The
removed-action list is 27 names
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:15-19]. It is
run in CI over `prompts templates skills after-install.md`
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:23] and exits
1 when anything is found [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:51-54].

The false-positive control is the finding. Bare words that are also ordinary English — `context`,
`status`, `delegate` — count **only on a line that mentions `muse_manage`**, while underscored names
count anywhere:

```python
hits += [("action", m) for m in WORD.findall(line) if "muse_manage" in line or "_" in m]
```
[SOURCE: specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:34-35]

Observed. Phase 013's job is to find stale references across skills and docs, and the naive version
of that search drowns in false positives because the removed names are common words. The reference's
answer is a per-name rule: a distinctive name is matched anywhere, a common word only in the
neighbourhood of the tool it belongs to. That is one line of code and it is the difference between a
linter people run and a linter people ignore.

## Ruled Out

- **Reading `buzz-main/crates/buzz-acp/TESTING.md` and `buzz-cli/TESTING.md`.** The `buzz-db` file already yielded the discovery-by-structure pattern (F-7-2); the other two are per-crate variants of the same shape. Reading them would produce redundant evidence for a pattern already established.
- **Reading `hermes-muse-main/scripts/check_boundaries.py`.** Named in the same CI job as `check_callers.py` [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:22], but "boundaries" is an architecture-import check, which belongs to 014's review criteria rather than 013's doc alignment. Deferred.
- **Treating `tests.json` as a test runner.** First read suggested a runner config; the `cases` array with `expected_actions` and `match_mode` shows it is a declarative manifest whose runner is elsewhere. The manifest is the liftable artifact, not the runner.

## Dead Ends

- **A single-prompt scenario format.** `tests.json`'s `user_prompts` array of ten paraphrases makes a one-prompt scenario look under-specified by comparison. Any 012 scenario written with one prompt is contradicted by the reference's own design. Candidate for the reducer's exhausted list: "one prompt per manual scenario".
- **A hand-maintained list of scenarios.** `buzz-db/TESTING.md`'s discovery-by-structure plus its guard script is the counter-example; a list is the thing the guard exists to avoid. Candidate for the exhausted list: "register each scenario in an index file".

## Edge Cases

- Ambiguous input: the focus named three phases at once. Resolved by treating each finding's phase as the phase whose *closing artifact* it is — 012 for scenario manifests and test standards, 013 for skill evals and doc linters, 014 for the review criterion in F-7-3. F-7-3 is recorded under both 012 and 014 because the standard governs 012's tests and is applied in 014's review.
- Contradictory evidence: the 003 synthesis says "no context repository applies" to 012, and three context repositories carry 012-shaped artifacts. Recorded as a premise correction in the Focus section rather than as a contradiction, because the synthesis's claim is about what it looked for, not about what exists.
- Missing dependencies: `steer.md` absent (checked before this iteration). No other dependency missing.
- Partial success: none. All planned reads resolved.

## Sources Consulted

- `specs/system-skilled-bots/context/turnstone-main/tests.json:1-44`
- `specs/system-skilled-bots/context/turnstone-main/eval_skill_adherence.json:1-55`
- `specs/system-skilled-bots/context/turnstone-main/lint_hypothesis.py:1-164`
- `specs/system-skilled-bots/context/buzz-main/TESTING.md:1-40`
- `specs/system-skilled-bots/context/buzz-main/crates/buzz-db/TESTING.md:1-45`
- `specs/system-skilled-bots/context/buzz-main/scripts/check-postgres-test-discovery.py:1-40`
- `specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:1-50`
- `specs/system-skilled-bots/context/hermes-muse-main/scripts/check_callers.py:1-55`
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md` (phases 012, 013, 014 sections)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md` (absent)

## Assessment

- New information ratio: 0.86
- Questions addressed: what a 012 scenario set looks like as an artifact; how a scenario corpus stays discoverable; what standard a 012 test must meet; what a 013 skill eval looks like; how 013 remembers a fixed finding; how 013 keeps a doc from drifting; how 013 finds stale references without false positives
- Questions answered: all seven

Five of seven findings are fully new to the packet (F-7-1, F-7-2, F-7-4, F-7-5, F-7-7). Two are
partially new: F-7-3 and F-7-6 address territory the 003 synthesis names as a gap (012 gap 2, 013
gap 2) but supply the mechanism rather than the gap. (5 + 0.5×2) / 7 = 0.86.

## Reflection

- What worked and why: searching for *artifact-shaped files* rather than reading source. `tests.json`, `eval_skill_adherence.json` and `lint_hypothesis.py` are all top-level files whose names say what they are, and each one is the closing artifact of a phase the synthesis had written off. The lesson is that a phase about producing a document should be researched by looking for that document in the references, not by looking for the feature it documents.
- What did not work and why: the first pass looked for test *code* (`*_test.rs`, `test_*.py`) and found hundreds of files with nothing to say about 012. The signal was in the manifests and the linters, which are not tests at all.
- What I would do differently: for 014, look for the review *criterion* rather than the review output. `TESTING.md`'s "Review-Proven Test Standards" is a criterion mined from review threads; that is the shape 014 needs, and I found it by accident while looking for 012 material.

## Recommended Next Focus

Net-new from `openhuman-full`'s vendored crates. The dispatch names `openhuman-full` as the
first-read repo because no earlier run studied it, and iteration 3 established that its
`vendor/` tree is 21 crates totalling roughly 4.7M lines of Rust — tinyagents (510k), tinycomputer
(630k), tinyjuice (636k), tinyvoice (568k), tinysecurity (288k), tinychannels (274k), tinyflows
(242k), tinybox (159k), tinymcp (151k), tinywallet (130k), tinyconnectors (113k), tinymemory (100k),
tinyeventqueues (89k), tinysearch (87k), tinydocs (84k), tinyskills (78k), tinybus (80k),
tinystoragedrivers (73k), tinyhosts (67k), tinyhumans-sdk (13k), tiny-artifacts (6.7k). The question
is which of these carry a capability neither the fourteen phases nor the section 13 skip list covers,
ranked by value to a small team. Start with the four largest that no phase names — tinycomputer,
tinyjuice, tinyvoice, tinysecurity — and with tinydocs and tinyskills, which map onto 013.
