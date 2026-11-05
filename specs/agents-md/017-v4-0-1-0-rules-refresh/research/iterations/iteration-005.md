# Iteration 5: Final behavior sweep — do the commands the rules cite behave as the rules say?

## Focus

Iterations 1-2 proved *existence*: every path and command the rule layer cites still resolves.
This iteration attacks the axis that existence checks cannot reach — **behavior**. A path can
exist while a flag it is invoked with was renamed, an output line it promises was reworded, or an
exit taxonomy it relies on was restructured. The question per name:

> Does `git log v4.0.0.16..v4.0.1.0` on this script show a change that moves any flag, output line
> or exit code the rule quotes?

Three sub-sweeps, as the dispatch directed:

1. The seven scripts `AGENTS.md`'s gates invoke **by name**.
2. The commands and paths the four named repo rules quote (`communication-handoff.md`,
   `delegation-and-orchestration.md`, `evidence-and-proof.md`, `blast-radius.md`).
3. The deferred / follow-up items the two named sibling packets hand onward.

**Non-goal restated from the packet.** This is not a re-run of existence. No finding is raised for
a path that merely resolves differently; only a quoted flag, output line, exit code or statement
that the range made **wrong**.

## Actions Taken

1. Read packet state: config (`max-iterations: 5`, `progressiveSynthesis: true`), the state
   projection (4 iteration records + 1 `iteration_start` for run 5), and `deep-research-strategy.md`
   including the full EXHAUSTED APPROACHES list — 21 blocked directions, checked before focus
   selection so nothing here re-treads them.
2. Read iterations 3 and 4 delta findings (`f-iter003-001..005`, `f-iter004-001..005`) so this sweep
   would not re-audit the delivery-prefix budget or the A6 mechanism.
3. Ran a per-path `git log` over the seven named gate scripts in `v4.0.0.16..v4.0.1.0`.
4. Extracted every backticked path-like token from the four named rule files with a parser, resolved
   each to a real path, and ran the same range query on each resolved target.
5. Verified the two candidate findings the extraction surfaced (`.codex/config.toml` change,
   `@juicesharp/...` "missing" token) before writing either as a finding.
6. Read the deferral surfaces of `016-doctor-agents-md` and `051-hub-routing-quality/002`.

## Findings

**1. All seven gate scripts are untouched in the range, so every flag, output line and exit code
`AGENTS.md` quotes for them is unchanged by v4.0.1.0.** Commit counts across
`v4.0.0.16..v4.0.1.0`: `lookup-trigger-index.mjs` 0, `skill-advisor.cjs` 0,
`gate-3-classifier.ts` 0, `validate.sh` 0, `generate-context.js` 0, `goal.cjs` 0,
`recommend-level.sh` 0. Each is a distinct query against the path itself, so a zero is a zero for
that path and not an aggregate accident. The rule layer's load-bearing invocations —
`--json --scoring-only`, `advisor_recommend --json ... --format json`, `classifyPrompt()`,
`--strict` and its `RESULT: PASSED` line, `packet` / `packet_budget=ok` — therefore cannot have been
invalidated by this release.
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs]
[SOURCE: .skilled/bin/skill-advisor.cjs]
[SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/generate-context.js]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/goal.cjs]
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh]

**2. Of the thirteen rule-layer targets the four named files quote, twelve are untouched in the
range and the thirteenth changed in a way the rule already describes.** Every backticked token with a
path shape in the four files resolves to an existing file. Range query: ten of the thirteen rule
files have 0 commits; `communication-handoff.md` has 1 (`02eb283d7c`) and `AGENTS.md` /
`REPO RULES.md` have their already-audited commits. The one non-rule target that did change,
`.codex/config.toml`, changed by adding exactly `default_mode_request_user_input = true` at line 2
(`fa2f8321f8`, "turn on the question tool in the repository's Codex config"), and
`communication-handoff.md:155` already states that Codex exposes `request_user_input` "only behind
the `default_mode_request_user_input` feature, which ships off and this repository's
`.codex/config.toml` turns on". **The change implements the sentence; it does not stale it.** No edit
owed.
[SOURCE: .skilled/repo-rules/communication-handoff.md:155]
[SOURCE: .codex/config.toml:2]

**3. The two deferrals in `016-doctor-agents-md` hand no work to `AGENTS.md` or the repo rules.**
`goal.md:111` names exactly two follow-ups outside that packet: `README.md:1039`'s command count and
a closed child spec still reading `Status: Draft`. Both are the packet's own bookkeeping, in files
this packet's surface does not include. `spec.md:93`'s deferral — activating the advisor bridges —
was handed to that packet's phase 003, which shipped it here. Nothing in the list names a gate, a
rule file or `REPO RULES.md`. Same for `051/002`, whose `spec.md:152` states only that the 014 spec
"lists the follow-up items and each one has a probe prompt" — a pointer to a routing-data backlog,
not a rule obligation.
[SOURCE: specs/agents-md/016-doctor-agents-md/goal.md:111]
[SOURCE: specs/agents-md/016-doctor-agents-md/spec.md:93]
[SOURCE: specs/sk-doc/051-hub-routing-quality/002-skill-routing-and-clarity/spec.md:152]

**4. `@juicesharp/rpiv-ask-user-question` is a package name, not a repo path, and it resolves.**
My existence probe flagged `communication-handoff.md:153`'s token as missing, which would have been a
P1 "the Pi row cites a vanished extension". It is recorded as an installed plugin, v2.15.0, with its
upstream tree, at `.pi/PLUGINS.md:16-17` — which is precisely the authority the rule's own
"How this is known" column cites ("Recorded as installed in `.pi/PLUGINS.md`"). Not a finding.
[SOURCE: .skilled/repo-rules/communication-handoff.md:153]
[SOURCE: .pi/PLUGINS.md:16]

**5. The two files this packet has been editing are the only rule-layer files the range changed, and
both changes are the ones iterations 1-4 already audited.** `AGENTS.md` gained the section manifest
and repository block (`e0fb2624dd`); `REPO RULES.md` gained the hub-routing naming fix
(`6a3ecd37f5`). No third surface was missed by the earlier iterations — the range's touch set over
`AGENTS.md`, `REPO RULES.md` and `.skilled/repo-rules/` is exactly those two plus the single
`communication-handoff.md` commit. **The behavior axis is clean; nothing in v4.0.1.0 needs a rule
change beyond `f-iter001-001`'s already-ranked proposal.**
[SOURCE: REPO RULES.md]
[SOURCE: .skilled/repo-rules/communication-handoff.md]

## Questions Answered

None at the strategy level — all five key questions were already ticked by iterations 1-4, so
`answeredQuestions` is `[]`. This iteration closes the last open *refinement*: carried-forward item
(b) of iteration 4 (behavior, as distinct from existence) is now verified rather than assumed.

## Questions Remaining

None researchable in scope. Two operator-owned notes survive, unchanged and both outside this
packet's write authority:

- `f-iter004-002`'s 89-byte wording now has 13 bytes of headroom against the 16,384-byte delivery
  prefix. Any future edit above the last anchor must re-measure; no trim is owed today.
- `research/research.md` synthesis remains unowned while the dispatch allowlist excludes it.

## Next Focus

No further iteration. The packet's research question is answered: **v4.0.1.0 changes the rule layer
in exactly three places, all already audited, and leaves every command the gates invoke by name
behaviorally untouched.** If the loop is resumed for another reason, the only unexhausted direction
is the one this packet's allowlist forbids — editing `AGENTS.md:70` — which is implementation, not
research.

## Sources Consulted

Per-path range queries (`git log v4.0.0.16..v4.0.1.0 -- <path>`), all zero commits unless noted:

- `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` — 0 commits
- `.skilled/bin/skill-advisor.cjs` — 0 commits
- `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` — 0 commits
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` — 0 commits
- `.skilled/skills/system-spec-kit/runtime/cli/spec/generate-context.js` — 0 commits
- `.skilled/skills/system-spec-kit/runtime/cli/spec/goal.cjs` — 0 commits
- `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh` — 0 commits
- `.skilled/commands/doctor/scripts/agents-md-check.cjs` — 3 commits (`3457ed2ff8`, `c8a3fcf13e`, `52f8141215`), all inside `016`'s already-audited surface
- `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` — 1 commit (`f494536b42`), already audited in iteration 4
- `.skilled/sk-doc/sk-create-skill/scripts/package_skill.py` — 11 commits, all already audited in iteration 2
- `.skilled/repo-rules/communication-handoff.md` — 1 commit (`02eb283d7c`); the Codex row at `:155` and the Pi row at `:153` read directly
- `.skilled/repo-rules/communication.md`, `communication-decisions.md`, `delegation-and-orchestration.md`, `evidence-and-proof.md`, `prevent-overengineering.md`, `root-cause-and-debugging.md`, `scope-discipline.md`, `uncertainty-and-honesty.md` — 0 commits each
- `.codex/config.toml` — 1 commit (`fa2f8321f8`), diff read; key lands at `:2`
- `.pi/PLUGINS.md` — 0 commits; plugin registry entry at `:16`
- `REPO RULES.md` — 1 commit (`6a3ecd37f5`); `AGENTS.md` — 1 commit (`e0fb2624dd`); both audited in iterations 1-4
- `specs/agents-md/016-doctor-agents-md/goal.md:111`, `specs/agents-md/016-doctor-agents-md/spec.md:93`
- `specs/sk-doc/051-hub-routing-quality/002-skill-routing-and-clarity/spec.md:152`

[SOURCE: .skilled/repo-rules/communication-handoff.md:153]
[SOURCE: .codex/config.toml:2]
[SOURCE: .pi/PLUGINS.md:16]

## Ruled Out

- **"The seven named gate scripts changed behavior in this release."** All seven return zero commits
  when queried per path. A behavior finding here would have had to name a commit, and there is none.
- **"The `.codex/config.toml` change staled the `communication-handoff.md` Codex row."** `fa2f8321f8`
  adds exactly the flag the rule already names at `:155`. The change implements the rule.
- **"The sibling packets' deferrals hand work to `AGENTS.md` or the repo rules."** Both name only
  their own bookkeeping.
- **"A backticked token missing as a repo path is a vanished citation."** `@juicesharp/rpiv-ask-user-question`
  is a plugin package, recorded at its own cited authority `.pi/PLUGINS.md:16`.
- **"The range touched a third rule-layer surface that iterations 1-4 missed."** The touch set is
  exactly `AGENTS.md`, `REPO RULES.md` and `communication-handoff.md`.

## Edge Cases

- **Ambiguous input:** none. The focus named its own tool set and its own query shape.
- **Contradictory evidence:** none. The `.codex/config.toml` commit and the rule sentence agree on the
  flag name; there is no competing claim to adjudicate.
- **Missing dependency:** none. Every script, rule file and sibling packet the focus named exists and
  was read.
- **Partial success:** one limit, stated rather than smoothed. `051/002`'s `spec.md:152` points at the
  014 spec as the holder of that program's follow-up list. I read the pointer, not all of 014's spec,
  so finding 3's negative claim for `051/002` rests on the program-level statement rather than a
  line-by-line read of every phase. The claim it supports — no rule obligation is handed onward — is
  what `spec.md:152` itself asserts, so the residual risk is bounded.

## Assessment

- **New information ratio:** 0.80 — 3 of 5 findings fully new, 1 partially new, 1 redundant (0.70),
  plus the 0.10 simplicity bonus for converting the gate-behavior axis from unverified to verified.
- **Questions addressed:** the final behavior sweep, and carried-forward refinement (b) of iteration 4.
- **Questions answered:** none at the strategy level; all five key questions were ticked earlier.

## Reflection

- **What worked and why:** choosing a query whose answer is a *count* rather than a *reading*. A
  zero-commit result over a named path is falsifiable in one line and cannot be mistaken for a green
  read, which is the failure mode this packet hit twice (iterations 3 and 4 each quoted a correct
  line and drew the wrong conclusion from it). The second thing that worked was verifying both
  candidate findings before writing either. One dissolved into a probe artifact, and publishing it
  would have repeated iteration 1's guessed-path false positive exactly.
- **What did not work and why:** the rule-file token extractor's first filter required a literal `/`
  in the token and returned an empty set, which reads like "these rules quote no commands" rather
  than "the filter was wrong". Root cause is identical to iteration 2's `realpath` probe: a probe that
  returns nothing everywhere is a broken probe. The second miss was structural — the narrative was
  written without its `## Sources Consulted` section and had to be repaired after verification, which
  is the one gate in the checklist that a self-run check should not be catching.
- **What I would do differently:** emit the artifact with its full section skeleton first and fill it,
  rather than composing prose that has to be re-sutured to the contract afterwards.

