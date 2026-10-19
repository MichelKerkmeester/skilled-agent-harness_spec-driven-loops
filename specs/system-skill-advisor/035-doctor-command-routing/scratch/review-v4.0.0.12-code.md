# Code review: v4.0.0.12 doctor routing and the v4.0.0.13 fixes

Read-only review of the code side of v4.0.0.12 ("The Advisor Sends You to the Right Doctor") and its v4.0.0.13 follow-ups, done on 2026-10-16 at HEAD `22a33af6d9`. Paths below are from the repository root, and `runtime/` means `.skilled/skills/system-skill-advisor/runtime/`.

**Verdict: no P0, four P1 and ten P2.** All four P1 findings pass every shipped test, because the gates score prompts in a way the hooks never do. Three of them break the release's own claims: short skill prompts that used to route now get nothing, the "skill first, doctor second" line disappears whenever three skills pass, and "run /doctor:setup" no longer puts the doctor command first.

Each finding marks its evidence. Observed means I ran it and read the output and exit status. Derived means it follows from code I read, with the step stated. Nothing below is only inferred.

---

## 1. Findings

### P0

None.

### P1

**P1-1. Unanchored doctor bridges make short skill prompts abstain.**

- Location: `runtime/lib/scorer/fusion.ts:943`, which runs after `fusion.ts:862` (ambiguity) and `fusion.ts:870` (low-information abstention).
- Defect: `requireDoctorPhraseAnchor` drops a doctor bridge that has no phrase match only after that bridge has joined the ambiguity cluster. The cluster then sets the low-information uncertainty floor on the skill it tied with, so the skill fails too.
- Failure scenario: "git hooks", "git hook", "git setup", "git standards" and "git hooks broken" now return no recommendation. With the doctor entries removed from the same projection, each routes to sk-git at 0.82/0.16. "speckit doctor" loses system-spec-kit the same way. For "git setup" the hook then prints the `/doctor:setup` hint in place of sk-git.
- Evidence (observed): in-process `scoreAdvisorPrompt` on the built dist under the pinned force-local regime, run with the full projection and with the `command-doctor-*` entries filtered out. For "git hooks", sk-git carried `ambiguousWith: ["command-doctor-git-hooks", "command-doctor-git-setup"]`. Both bridges had an explicit-author raw score of 0. sk-git's uncertainty was 0.42, the low-information floor, against the 0.35 threshold. The live CLI (`node .skilled/bin/skill-advisor.cjs advisor_recommend`) returned an empty list for "git hooks" and "git standards" with freshness live. This contradicts the changelog line "no prompt that routed correctly before changed its answer". The per-prompt corpus comparison could not see it, because no pinned corpus holds these two-word prompts.

**P1-2. The doctor second line is cut whenever three or more skills pass.**

- Location: `runtime/lib/scorer/fusion.ts:676-693` together with `runtime/handlers/advisor-recommend.ts:556` and `:570`. The hooks request three results at `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:216` and `.opencode/plugins/system-skill-advisor.js:720`.
- Defect: the ordering rule moves every doctor bridge to just after the last passing skill. The handler then keeps only the first three recommendations, so the bridge is gone before the renderer can add the `Also:` line.
- Failure scenario: "update skilled to the latest release" is the case the operator settled (Q5) as "skill first, `/doctor:update` second". Through the live CLI it returns sk-code, system-deep-loop and sk-git and no `/doctor:update`. "change commit message rules", "skill budget audit" and "parent skill structure audit" lose their doctor line the same way.
- Evidence (observed): live CLI output for those four prompts. In process, 8 of the 41 reach-probe rows that pass as "second" sit at index 3 or later of the passing list. So do 4 of the 16 slice rows that expect a second line. The slice test and the reach probe both call `scoreAdvisorPrompt` with no result limit, so they pass for the wrong reason.

**P1-3. "run /doctor:setup" no longer counts as typing the command.**

- Location: `runtime/lib/scorer/fusion.ts:680` and `runtime/scripts/skill_advisor.py:887`.
- Defect: since v4.0.0.13 a doctor command counts as typed only when the prompt starts with `/doctor:`. An imperative such as "run /doctor:setup" is therefore treated like a quoted reference, and any passing skill outranks it.
- Failure scenario: "run /doctor:setup" and "please run /doctor:setup for me" put cli-external-orchestration first at 0.82/0.34, tied with mcp-code-mode and cli-classifier. Through the live CLI the doctor bridge is also cut by P1-2, so the brief names cli-external-orchestration and shows no doctor line at all. "run /doctor:git setup" puts sk-git first. Before v4.0.0.13 the substring rule kept the doctor command first for all three.
- Evidence (observed): in-process probe and live CLI. The Python script already keeps a list of invocation verbs for this distinction elsewhere (`skill_advisor.py:2684`: execute, kick off, launch, run, start, use).

**P1-4. `/doctor:setup` reports a stale or missing advisor build as a harmless SKIP.**

- Location: `.skilled/commands/doctor/assets/doctor-setup.yaml:56`, with `.skilled/bin/skill-advisor.cjs:70-78` and `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:83`.
- Defect: the advisor leg reads exit 75 as "the daemon is not running". The CLI shim also exits 75 when the advisor build is stale or missing and `--warm-only` is set, and the leg always sets it.
- Failure scenario: an operator pulls v4.0.0.13 and skips the rebuild both changelogs ask for. The hook now fails open on every prompt. `/doctor:setup` shows the advisor leg as SKIP and its troubleshooting row says "This is not a failure, and any advisor command starts it on demand", while the real repair is the rebuild. A related gap: exit 0 always passes, and `advisor_status` exits 0 even when it reports freshness stale or absent (`runtime/skill-advisor-cli.ts:1585`). The leg therefore never reports the skill-graph state that its own repair, `/doctor:skill-advisor rebuild`, exists to fix.
- Evidence (derived): `skill-advisor.cjs:78` calls `fail(result.message, warmOnly ? EXIT_RETRYABLE : EXIT_PROTOCOL, ...)`, and `EXIT_RETRYABLE` is 75. The leg command in `doctor-setup.yaml:56` passes `--warm-only`. I did not reproduce it, because making the build stale would write to the tree. In this case the shim adds a `staleDistWarning` field to its error payload, which the leg could read.

### P2, group A: scorer and phrases

**P2-1. `/doctor:update`'s two-word phrases fire on unrelated text.**

- Location: `.skilled/commands/doctor/_routes.yaml:375` ("doctor update") and `:377` ("release update"), against the three-word rule at `_routes.yaml:31-32` and REQ-010.
- Failure scenario: "my doctor update came in" makes `/doctor:update` the top pick at 0.82/0.20. "the release update is late" and "draft the release update notes" both get `Also: /doctor:update`.
- Evidence (observed): in-process probe.

**P2-2. Typing `/doctor:sk-code` puts sk-code first in TypeScript, and the reach probe accepts it.**

- Location: `runtime/lib/scorer/lanes/explicit.ts:253-269` counts "sk-code" inside the slash string as a mention of the skill. `fusion.ts:823` turns off the 0.08 command demotion for any prompt containing `/`. `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:202` and `:212` accept "second" for the runnable string.
- Failure scenario: the prompt "/doctor:sk-code" renders "use sk-code 0.90/0.16 pass." with `Also: /doctor:sk-code`. Python `--force-local` puts `command-doctor-sk-code` first, so the two scorers disagree. The spec's edge case says a typed command puts the doctor bridge first.
- Evidence (observed): in-process probe, Python `--force-local` run, and the reach-probe JSON row `second command-doctor-sk-code "/doctor:sk-code" top=sk-code`.

**P2-3. The Python local scorer still ranks a quoted doctor command above the skill.**

- Location: `runtime/scripts/skill_advisor.py:2910-2917` (substring match) and `:4553-4554` (priority 2 for the matched command).
- Failure scenario: "fix the git hook that /doctor:git setup lists" with `--force-local` returns `command-doctor-git-setup` first and sk-git second, both at 0.95. TypeScript puts sk-git first. REQ-018 says both scorers apply the rule, but only the native wrapper at `skill_advisor.py:887` changed, and the Python test at `runtime/tests/python/test_skill_advisor.py:1002-1027` covers only that wrapper.
- Evidence (observed): Python `--force-local` run.

**P2-4. The Python native sort puts a doctor bridge below non-doctor commands as well.**

- Location: `runtime/scripts/skill_advisor.py:888-895` against `fusion.ts:681-692`.
- Failure scenario: when no skill passes, TypeScript keeps a doctor bridge where it scored. The Python key moves it below every other recommendation, commands included.
- Evidence (observed at unit level): a stubbed native result of `command-doctor-env` 0.90 and `memory:save` 0.85 came back from `recommend_with_native_advisor` as `memory:save` then `command-doctor-env`. I tried five mixed prompts and found no natural one that hits this, because each had a passing skill.

### P2, group B: the setup hint

**P2-5. The setup-wording check is quadratic and runs on every prompt.**

- Location: `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:52-58` and `:345`. The OpenCode copy is at `.opencode/plugins/lib/skill-advisor-render.js:28-34`, used at `.opencode/plugins/system-skill-advisor.js:1298`.
- Defect: the `check` branch carries an unbounded lookahead, so every "check" re-scans the rest of the prompt. Both hooks compute the flag before they know whether a brief exists, and the brief path never reads it.
- Failure scenario: a 150,000-character paste with 5,000 "check" words and no tooling word takes 409 ms. A 600,000-character paste takes 6.6 seconds. The Claude hook caps prompts at 64 KB, where the worst case measured 388 ms. The OpenCode plugin tests the full prompt.
- Evidence (observed): `node` timing of the exported regex.

**P2-6. The hint wording has false positives and false negatives.**

- Failure scenario: the hint fires on everyday words because the lookahead spans the whole prompt. Examples are "check the tool rental hours at the hardware store" and "check whether the coat hooks are loose". It misses common setup wording such as "check my config", "reinstall skilled", "set-up skilled", "installer is broken" and "configurations".
- Evidence (observed): `node` run of the exported regex on each prompt.

### P2, group C: the command, the deriver and the tests

**P2-7. The sk-git leg gives exit 2 two meanings.**

- Location: `.skilled/commands/doctor/assets/doctor-setup.yaml:53` maps every exit other than 0 and 3 to FAIL with repair `/doctor:git setup`. `doctor-setup.yaml:65` says a leg that crashes is ERROR.
- Failure scenario: `git-setup-check.cjs` exits 2 on a usage error (`:1086`, `:1096`) and on a crash (`:1119`). A misspelled `--tool` value or a crashed battery shows as FAIL, and the repair it names is the same battery.
- Evidence (derived): code read of both files.

**P2-8. The deriver silently drops a standalone command's phrases.**

- Location: `runtime/scripts/command-bridges/derive-command-bridges.cjs:219-222`, against `:197` for routes.
- Failure scenario: one malformed `/doctor:update` phrase, such as a bare YAML number, empties all its keywords without an error. The same mistake in a route throws a named error. The reach probe catches it later, but reports it as phrases that reach nobody.
- Evidence (derived): code read.

**P2-9. The `Also:` line can be cut mid-command, and its cap test cannot fail.**

- Location: `runtime/lib/render.ts:508-511` caps the whole line, companion included. OpenCode sets the cap from `SYSTEM_SKILL_ADVISOR_MAX_TOKENS` (`.opencode/plugins/system-skill-advisor.js:340` and `:596`). The test is `runtime/tests/doctor-brief-render.vitest.ts:100-111`.
- Failure scenario: with a token cap of 20 the brief ends in `Also: /doctor:skill-a...`, which is not a runnable command. The test compares a line of about 90 characters with a 320-character cap.
- Evidence (observed): `renderAdvisorBrief` on the built dist at caps of 80, 22 and 20.

**P2-10. The slice and the probe miss the cases above.**

- Location: `runtime/scripts/routing-accuracy/doctor-prompts.jsonl`, `runtime/tests/doctor-routing-slice.vitest.ts:85` and `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs:197-216`.
- Defect: the slice has no two-word prompt, no "run /doctor:x" prompt, no quoted-command row and no negative control that uses doctor vocabulary. Neither gate applies the three-result limit the hooks use. That is how P1-1 to P1-3 and P2-1 ship green. Both gates also count a doctor bridge behind a doctor top pick as reaching the second line, but `render.ts:484-486` never shows a second line under a doctor top pick. No current row hits that last case.
- Evidence (observed): the 7 doctor-related test files pass, 140 of 140 tests, exit 0, while every P1 above reproduces.

---

## 2. Checked and found sound

Rendering and hooks:

- A doctor bridge renders only as its runnable string. An unmapped doctor id renders nothing, and the ambiguous path never repeats the second pick as an `Also:` line (`render.ts:476-506`).
- The Claude hook and the OpenCode plugin carry the same setup regex, held by a source-and-flags equality test. Both print the same no-match and outage text, and the Pi deadline path passes the flag.
- The added code comments carry no spec paths or ticket labels.

Scorer and generator:

- "Help me set up skilled", "check my environment variables", "check my git hooks setup" and a typed "/doctor:git setup" behave as documented, in process and through the live CLI.
- `derive-command-bridges.cjs --check` reports `"status": "fresh"` with 16 doctor routes and exits 0. The renderer lookup and the projection match the manifest.
- The reach probe refuses a stale build with exit 2, and `--json` reports 15 bridges, 82 phrases and 0 missed, exit 0.

The `/doctor:setup` command:

- The sk-git leg's `--tool` names match the battery's list, and exit 3 as DEGRADED matches the battery's own status fold. The trigger-index exit codes match its route entry.
- `/doctor:sk-code setup`, named as a repair, is accepted by that router.
- The advisor leg command exits 0 with freshness live against the running daemon.

---

## 3. Recommendations

Required, in order of impact:

1. **P1-1.** Run the phrase-anchor rule where `passes_threshold` is first set, before the ambiguity pass at `fusion.ts:862`, so an unanchored doctor bridge never joins a cluster. Add slice controls "git hooks" and "git standards", both expecting sk-git.
2. **P1-2.** Insert moved doctor bridges at most at index 2, after the top two passing skills, rather than after the last passing skill. The top skill, its ambiguity rival and the doctor line then all survive the three-result limit. The trade-off is that a fourth or later passing skill now ranks below the doctor bridge, which matters only to callers asking for more than three results. Make the slice test and the reach probe cut to three results before they read the second line.
3. **P1-3.** Count a doctor command as typed when the prompt starts with it, or when it follows an invocation verb (run, execute, start, launch, use, kick off) and sits outside backticks and quotes. Apply the same rule at `fusion.ts:680` and `skill_advisor.py:887`. Add a "run /doctor:setup" row expecting the doctor first, and keep the quoted row expecting the skill first.
4. **P1-4.** In the advisor leg, treat exit 75 with `staleDistWarning` in the error payload as FAIL, naming `npm --prefix .skilled/skills/system-skill-advisor/runtime run build`. Keep exit 75 without it as SKIP. Treat exit 0 with a freshness other than live as DEGRADED, naming `/doctor:skill-advisor rebuild`. Update the troubleshooting row at `doctor-setup-presentation.txt:83` to match.

Smaller fixes:

1. **P2-1.** Replace "doctor update" and "release update" with three-word diagnostic phrases, or drop them. Have `route-validate.sh` reject an activated phrase under three words, since this false fire is exactly what the header rule exists to prevent.
2. **P2-2.** When the prompt starts with a doctor runnable string, move that bridge to first place in the ordering rule, and make the reach probe require "top" for runnable strings.
3. **P2-3.** In `analyze_request`, give a doctor bridge the explicit-command priority only under the typed rule from P1-3, and add a `--force-local` case for the quoted prompt to the Python test.
4. **P2-4.** Key the Python sort on "a doctor bridge while at least one skill passes", which is what TypeScript does.
5. **P2-5 and P2-6.** Compute the flag only in the no-brief branch. Bound the lookahead to a short window, such as 120 characters, which removes the quadratic cost and most false positives. Add "config", "reinstall" and "set-up" if the operator wants that wording covered.

Housekeeping:

1. **P2-7.** Map exit 2 to ERROR in `doctor-setup.yaml:53`, so the leg agrees with the output contract at line 65.
2. **P2-8.** Validate standalone `trigger_phrases` with the same `stringArray` call routes use.
3. **P2-9.** Drop the `Also:` line when it does not fit whole instead of truncating it, and test that at a small cap.
4. **P2-10.** Add slice rows for the cases above: "git hooks", "git standards", "run /doctor:setup", the quoted command, and "my doctor update came in" expecting no doctor line. Make `secondDoctor` and the probe return no second line under a doctor top pick.

---

## 4. Evidence log

- Targeted tests: `npm --prefix runtime test` on the 7 doctor-related files passed 140 of 140, exit 0.
- Full suite, run with `TMPDIR` pointed at a scratch folder: 142 of 143 files passed. Tests: 1 failed, 1110 passed, 6 skipped, exit 1. The one failure, AS10 in `tests/legacy/advisor-freshness.vitest.ts`, passes alone with the default temp folder (12 of 12, exit 0), so my temp-folder override caused it, not this code. I did not rerun the whole suite with the default temp folder.
- `derive-command-bridges.cjs --check`: fresh, exit 0.
- `doctor-phrase-reach.cjs --json`: ok, 15 bridges, 82 phrases, 0 missed, exit 0.
- Live CLI: `advisor_recommend` for each prompt quoted above, and the `/doctor:setup` advisor leg command, which exited 0 with freshness live.
- Python: `skill_advisor.py --force-local` for the quoted, typed and plain prompts, plus one stubbed call to `recommend_with_native_advisor`.
- Not run: `route-validate.sh`, the doctor test runner and the drift guards.
