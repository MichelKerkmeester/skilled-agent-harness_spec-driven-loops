# Iteration 5: Which facts earn a machine check

## Focus

Ring 5 of the packet strategy: given rings 1-4, say exactly which facts are worth pinning with a
test and which are not, with the test shape for each recommendation. A check that cannot fail for
a real reason is not a recommendation.

## Findings

**F1. Three environment variables are read by the goal plugin and documented nowhere.**
`opencode-goal.js` reads `OPENCODE_GOAL_VERIFIER_TIMEOUT_MS`,
`OPENCODE_GOAL_CONTINUATION_TIMEOUT_MS` and `OPENCODE_GOAL_JSONL_MAX_BYTES` through name constants
(lines 78-80) into `process.env[...]` (lines 245-247), each with a default (lines 49-51). None of
the three appears in `.env.example` (which documents 17 other `OPENCODE_GOAL_*` names) nor in
`goal-plugin.md`'s 18-name env table. An operator can set them, but cannot discover them. This is
the same defect class as `OPENCODE_GOAL_RUNTIME_LABEL` (ring 2, F5), now with three more members —
and unlike that one, these are absent from every surface, so even the example file does not teach
them. [SOURCE: `.opencode/plugins/opencode-goal.js:49-51,78-80,245-247`; counts over
`.env.example` and `.opencode/hooks/goal/goal-plugin.md`]

**F2. A roster-name check passes today and fails for a name that disables nothing.** Scanning the
eight roster documents for goal kill-switch names against the resolver's real contract
(`CONCERN_CANONICAL.goal = OPENCODE_GOAL_DISABLED`, `LEGACY_ALIASES.goal = [OPENCODE_GOAL_PLUGIN_DISABLED,
MK_GOAL_DISABLED, MK_GOAL_PLUGIN_DISABLED]`, `.opencode/hooks/shared/hook-flags.cjs:51-52`) yields
zero violations today. The check fails for exactly the defect the remediation fixed:
`SYSTEM_GOAL_DISABLED` was documented in a roster, is in neither list, and disables nothing.
[SOURCE: scan replayed over `.env.example`, `hook-flags.env.example`, `hooks/README.md`,
`hooks/shared/README.md`, `hooks/goal/README.md`, `goal-plugin.md`, `plugins/README.md`,
`ENV-REFERENCE.md`, 2026-09-12]

**F3. The README goal section's checkable half is exactly the half ring 3 named, and the path scan
passes today.** The section's claims about `goal-opencode` and `goal-pi` resolve to real
registrations (`.opencode/commands/goal-opencode.md:7`, `.opencode/hooks/goal/pi/goal-context.ts:181`)
and its cadence claims match the host configs (`.cursor/hooks.json` sessionStart only;
`.devin/hooks.v1.json:2,39` SessionStart + UserPromptSubmit). The contract test's citation regex over
`README.md` finds five cited paths and all five exist. A check on these facts fails the day a
command is renamed, which is the failure the section cannot currently report.
[SOURCE: ring 3 F2/F3, re-verified 2026-09-12]

**F4. The manifest name and the checker's default can diverge silently; one comparison closes it.**
After ring 4's rename, the workflow prose names the manifest (`.opencode/commands/deep/assets/deep-review-auto.yaml:374`)
and the checker defaults to its own directory (`.opencode/.../check-goal-file-manifest.sh:5`). If
one is renamed without the other, the checker looks for a file that is not there and fails closed —
which is correct behaviour, but only when it runs. A two-line assertion that both name the same
basename is cheap and fails for a real reason. [SOURCE: the two files, read 2026-09-12]

**F5. Four adjacent facts do not earn a check.** (a) Prose line width: ring 1 measured that no
prose standard exists and that enforcing one would flag ~216,500 lines; a check cannot fail for a
reason anyone cares about. (b) Per-copy scanning of the four support-story restatements: their
claims are already pinned at the code and config layer (F3); scanning prose copies for phrases
turns a rephrasing into a false failure, and the rename failure that matters is covered by F3.
(c) The state-directory README's claims: a check would only fail when someone edits the README, not
when behaviour drifts — the opposite of a useful signal. (d) Historical citations in benchmark
reports and review records: ring 2 F8 and ring 4 F4 established they are evidence of past runs;
path-existence checks over them would be a false-positive machine.

## Sources Consulted

- `.opencode/plugins/opencode-goal.js:49-51,78-80,245-247`
- `.env.example`, `.opencode/hooks/goal/goal-plugin.md` (env tables)
- `.opencode/hooks/shared/hook-flags.cjs:51-52`, the eight roster documents
- `.opencode/commands/deep/assets/deep-review-auto.yaml:374`, `.../001-whole-system-gate/check-goal-file-manifest.sh:5`
- Ring 1-4 evidence, re-verified where a test-shape claim depended on it

## Assessment

**newInfoRatio: 0.9.** Five findings. The ring's own contribution is the verdict table and the
placement rule; the three undocumented variables (F1) are a new defect discovered by prototyping
the check rather than reasoning about it.

**Novelty justification:** rings 1-4 produced candidate facts; this iteration is the first to run
each candidate check against the tree and report whether it passes, fails, or cannot fail at all.

**Confidence:** F1-F4 are observed replays. F5's verdicts are CLAIMs grounded in the measurements
of earlier rings; the strongest is (a), where the measurement is a completed count, and the weakest
is (b), where the false-positive risk is an argument rather than a measurement.

## Reflection

**What worked.** Prototyping each check before recommending it. The roster scan looked like it
would fail on the alias-first wording; run against the real resolver contract it passes cleanly,
which changed the recommendation from "fix the rosters" to "add the gate that keeps them clean".
The env-var scan looked like a formality and instead found three undocumented variables.

**What failed.** The first env-var scan only matched `process.env.OPENCODE_GOAL_*` literally and
found nothing; the plugin reads its three new names through constants (`_ENV = '...'`). The scan
shape had to be corrected to string literals, and that correction is now part of the recommendation
— a check written the naive way would have passed while missing the defect.

**Ruled out.** (a) A blocking gate over every node test: the advisory lane exists because the node
suites carry a known-failing backlog; promoting the whole lane would import that backlog into a
blocking job. (b) A line-length check in any form (see F5a). (c) Checking prose copies of the
support story for exact phrases.

## Recommended Next Focus

Synthesis: consolidate the five rings into `research/research.md`, with one recommendation per ring
and the machine-check package, then record the terminal state at the iteration cap.

---

## Recommendation (ring 5)

**Add three checks — undocumented env vars, roster names, README goal-section facts — plus the
manifest-name agreement assertion, as one new vitest file in the spec-kit CLI test project (the
lane CI actually blocks on), and do not add any check for prose line width or for the support-story
restatements.**

- **The checks.** (1) Env-var documentation: collect every `OPENCODE_GOAL_*` string literal in the
  engine and plugin non-test sources (constant indirection included, per F1) and assert each name
  appears in `.env.example` — this fails today for three names, so the same change adds the three
  doc lines, then the check lands green. (2) Roster names: assert every `*GOAL*DISABLED` name in
  the eight roster documents is either the canonical name or a member of
  `LEGACY_ALIASES.goal` read from the resolver — passes today and fails on a dead name being taught
  again. (3) README goal section: the citation scan plus the two command registrations and the two
  cadence configs, per ring 3. (4) The manifest-name agreement assertion, folded in with ring 4's
  rename.
- **Why this lane.** The existing goal-document contract test runs only in the advisory node-test
  job (`continue-on-error: true`), so a failure there is a report; the spec-kit CLI vitest project
  runs in the blocking workflow. These checks are cheap, pass-today-with-one-fix, and guard facts
  whose failure is silent, which is the profile that belongs in a blocking lane.
- **Cost.** One new test file of roughly 60-80 lines, three documentation lines for the
  undocumented variables, and the four `README.md`/manifest assertions from rings 3 and 4. No new
  runner, no dependency.
- **Blast radius.** One test file and three documentation lines. From then on, a new
  `OPENCODE_GOAL_*` knob, a resurrected dead flag name, a renamed goal command, or a renamed
  manifest file fails a blocking check instead of waiting for the next research pass. The env-var
  check constrains future code slightly (document your knob or fail), which is its purpose.
