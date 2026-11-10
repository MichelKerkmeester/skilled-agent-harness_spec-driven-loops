# Iteration 008 — Advisor unread releases (surfaceHint, doctor routing)

Iteration 8 of 10. Segment 1. Focus: the three unread advisor release claims (v4.0.0.6 surfaceHint, v4.0.0.12 and v4.0.1.0 doctor suggestions), where doctor-command routing lives, and whether it covers every doctor command on disk.

## Focus

1. v4.0.0.6: `advisor_recommend` accepts `surfaceHint` of 1–64 chars and forwards it; the OpenCode plugin sends the surface its workspace markers name.
2. v4.0.0.12: "help me set up skilled" suggests `/doctor:setup`; "check my environment variables" suggests `/doctor:env list`. v4.0.1.0: the advisor suggests `/doctor:helper` when a prompt describes a problem.
3. Where doctor-command routing lives, and whether it lists every command under `.skilled/commands/doctor/`.

## Actions Taken

1. Read the advisor surfaceHint schema in four places (tool manifest, CLI manifest, zod schema, handler) to locate the enforced bounds and the forwarding call.
2. Ran `advisor_recommend` on the three release-note prompts through the real CLI.
3. Ran `advisor_recommend` with a deliberately invalid `surfaceHint` (`''`, then 65 chars) to test the bounds end to end rather than reading them off the schema.
4. Read the OpenCode plugin's surface-marker logic (marker classes kept, precedence, the `.skilled` restriction, the omit-when-null send).
5. Read the doctor helper hand-off gate in `fusion.ts` and the cue/match functions it depends on, to explain the third prompt's result.
6. Enumerated `.skilled/commands/doctor/` and diffed it against the generated doctor-command string table.

## Findings

### f-iter008-001 — P1 — drift + operator UX: a problem-worded doctor question reaches no doctor command

v4.0.1.0 states the advisor "also suggests the new doctor commands when a prompt describes their problem" [SOURCE: .skilled/changelog/skilled/v4.0.1.0.md:102]. Measured, on the canonical hooks problem:

```
node .skilled/bin/skill-advisor.cjs advisor_recommend \
  --json '{"prompt":"my hooks are not firing, what do I run","options":{"includeCompiledRoute":false}}' \
  --format json
```

returns `ambiguous: true` with **no doctor command anywhere in the top three**:

| rank | skillId | score | confidence |
|---|---|---|---|
| 1 | cli-external-orchestration | 0.128817 | 0.82 |
| 2 | mcp-code-mode | 0.109385 | 0.82 |
| 3 | cli-classifier | 0.093333 | 0.82 |

All three top scores sit under 0.13 — the advisor is not so much choosing a skill as picking the least-bad lexical residue. Meanwhile the two commands that actually answer the question, `/doctor:skill-advisor` and `/doctor:runtime-mirrors`, are absent.

The gate that produces this is the second early return in `applyDoctorHelperHandoff`:

```ts
const skillPasses = ranked.some((recommendation) => (
  !isDoctorBridge(recommendation) && recommendation.passes_threshold
));
const cue = doctorProblemCue(context.prompt);
if (skillPasses && cue !== 'strong') return [...ranked];
```

[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:998]

The guard is keyed on *cue strength*, not on *problem likelihood*. Any non-doctor skill that merely passes threshold suppresses the hand-off unless the prompt contains a strong problem cue, so a prompt that scores 0.13 for a CLI skill still outranks a doctor command that would score far higher. A weak-but-real doctor problem therefore loses to noise. **Confirmed:** the end state above (exit 0, output read). **Inferred:** that the `skillPasses && cue !== 'strong'` clause is the specific clause that fired — the cue word lists live in `doctor-helper-handoff.ts` (`STRONG_PROBLEM_CUE`/`WEAK_PROBLEM_CUE`) and I did not read them, so "not firing" is presumed uncovered rather than shown uncovered. **What would confirm it:** evaluate `doctorProblemCue("my hooks are not firing, what do I run")` directly and check `matchDoctorProblem(...)` on the same string; if cue is `weak`/`null` while `skillPasses` is true, the block is this line.

Release that introduced it: v4.0.1.0. Verify command: the node invocation above.

### f-iter008-002 — P2 — drift (README vs schema): the option names in the README are rejected at top level

`README.md` says "`advisor_recommend` accepts seven options: `topK` sets how many candidates to return (1 to 10) … `includeCompiledRoute` is an optional boolean that defaults to true" [SOURCE: .skilled/skills/system-skill-advisor/README.md:135], and the command table repeats the bare names [SOURCE: .skilled/skills/system-skill-advisor/README.md:182]. The schema accepts them only nested under `options`, and rejects the bare and nested-alike forms the README implies:

```
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"audit the webflow css","topK":2}' --format json
{"status":"error","error":"Invalid arguments for advisor_recommend: Unknown parameter(s): topK","exitCode":64}

$ ... --json '{"prompt":"…","includeCompiledRoute":false}'
{"status":"error","error":"Invalid arguments for advisor_recommend: Unknown parameter(s): includeCompiledRoute","exitCode":64}
```

Exit 64 both times, while `{"options":{"includeCompiledRoute":false}}` succeeds. The README never shows the nesting, so an operator or agent hand-building the documented call hits a hard failure with no hint. This cost me two tool calls in this iteration; it will cost an operator the same. Cheapest fix: one clause saying the seven belong under `options`, or a top-level alias. Both failure modes observed and exit statuses read. Release that introduced it: v4.0.0.6 (the option count and surfaceHint sentence). Verify: the two commands above.

### f-iter008-003 — P2 — drift risk: doctor-command routing is duplicated across a generated table and the scorer projection

Routing is spread over three sites: the generated `DOCTOR_COMMAND_STRINGS` table (35 entries, marked `BEGIN GENERATED DOCTOR COMMANDS`, derived by `derive-command-bridges.cjs`) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:113], the scorer projection entries [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:250], and `isDoctorBridgeId`'s prefix test [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:212] which makes *any* `command-doctor-*` id render as a command rather than a skill. The tests exercise unmapped ids (`command-doctor-not-a-route`, `command-doctor-stale`) and `doctorCommandString` returns `null` for them, so an unmapped doctor bridge renders *nothing* rather than falling back to its id — a silent drop, not a visible error.

Coverage is currently complete: all 17 files under `.skilled/commands/doctor/` (agents-md, ci, deep-loop, env, git, helper, install, mcp, overlay, runtime-mirrors, setup, sk-code, sk-skill, skill-advisor, speckit, symlink, update) map into the 35-entry table. So there is no defect today; the finding is the *shape*: adding a doctor command requires regeneration, and the failure mode of forgetting is an invisible one. Confirm with `node .skilled/bin/tests/` surface-hint/doctor suites plus a diff of the generated block after adding a route. Release: v4.0.1.0 (doctor bridge generation).

### Confirmations (no finding)

- **v4.0.0.6 surfaceHint bounds hold end to end.** `surfaceHint: ''` → `"advisor_recommend.options.surfaceHint must be at least 1 character(s)"`; 65 chars → `"must be at most 64 character(s)"`; both exit 64. Bounds declared three times consistently [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:290] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:24]. Release claim verified, not drifted.
- **Plugin half of v4.0.0.6 also holds.** `advisorCliRequest` spreads the hint only when truthy (`...(surfaceHint ? { surfaceHint } : {})`) so a null detection sends no hint at all rather than an empty one [SOURCE: .opencode/plugins/system-skill-advisor.js:869]; `detectWorkspaceSurface` returns a specific surface when the workspace holds its path/file markers and falls back to hub-registry order, with OpenCode only for a workspace inside this repository's `.skilled` folder [SOURCE: .opencode/plugins/system-skill-advisor.js:852]. Matches the release note's wording exactly.
- **v4.0.0.12 first two claims hold.** "help me set up skilled" → `command-doctor-setup` sole recommendation, 0.7 / confidence 0.8962, `ambiguous: false`. "check my environment variables" → `command-doctor-env` first at 0.7 / 0.8962, `system-spec-kit` second at 0.668667 — top route correct, but `ambiguous: true` because the gap is ~0.03. Worth noting for UX: the right answer arrives wearing an ambiguity flag.

## Questions Answered

None of the three strategy key questions closed this iteration; the focus was the unread release claims. Partial progress on the "UX" question: f-iter008-001 and f-iter008-002 are both operator/AI-user blocks with concrete repros.

## Questions Remaining

- **Advisor transport (v4.0.0.0, v4.0.0.16)** — degraded local scoring and the shared daemon lease/race remain unexercised. **Six** iterations carried. Still the largest untested claim in the run.
- **New:** what are `STRONG_PROBLEM_CUE` / `WEAK_PROBLEM_CUE` word lists, and does `matchDoctorProblem` on the hooks prompt clear `DOCTOR_HELPER_UNCUED_MIN_SCORE`? That single read converts f-iter008-001 from "inferred clause" to a located line, and would show whether the fix is the cue list or the `skillPasses` guard.
- **New:** why does the hook brief for this same phrase render `/doctor:env list` at `0.82/0.28` against `sk-code 0.95/0.16`, while a direct CLI call scores `/doctor:env` `0.8962/0.16` against `system-spec-kit 0.8794/0.12`? Recorded as an observation only: the hook scores the whole iteration prompt, not the phrase, so the divergence is confounded and proves nothing yet.
- **Hook safety (v4.0.0.8, v4.0.0.16)** — the git-call time-limit half is still unexamined.
- **Which layer drops the advisor redirect** (CLI handler vs the shim's `recommend_with_native_advisor()`) — carried unchanged.
- **Advisor follow-ups from generation 1** — the sk-doc `sk-create-skill-parent` shared-packet entry and the duplicate `package_skill.py`. Untouched, eighth iteration.
- **UX and extension** proper — the relaunch-enable, brief-reading and history-recovery blocks. Only reached sideways.
- **New:** does `hook-flags.sh`'s 113-line table drift from `hook-flags.cjs` today (one-shot differential)?
- Carried: which of the 132 non-shared adapters import the flag module vs hand-roll env reads; `leaf-scopes.json` optionality; `f-iter007-003` live Claude hang; `f-iter004-005` live Codex compaction.

## Next Focus

Turn f-iter008-001 from inference into a located line: read `STRONG_PROBLEM_CUE`/`WEAK_PROBLEM_CUE` and `DOCTOR_HELPER_UNCUED_MIN_SCORE` in `doctor-helper-handoff.ts`, and score the hooks prompt against `/doctor:helper`'s own ranker. Then spend the remaining iterations on the two genuinely untouched areas — advisor transport degraded/daemon (six iterations stale) and the relaunch/history UX surface, which has never been reached in eight.

## SCOPE VIOLATIONS

None. All writes landed in the lineage run directory; every researched path was read-only.
