# UX, performance and cross-CLI usefulness after phases 005 to 008 — ux lineage

Detached research lineage `ux`, session `fanout-ux-1794523629654-v541y3`, generation 1. Five iterations, 2026-11-12. The topic: what to improve in command surfacing after the planned phases 005 to 008 on the UX angle, with the cross-CLI start question as the spine. Phases 005 to 008 are planned, not built; nothing here repeats them. Every recommendation names the file it changes, the measurable gain and the check that proves it.

## 1. Executive verdict

Command surfacing will not fail for lack of a brief. It will fail in three quieter places, each measured here:

1. **The funnel is unobservable.** The harness records that a skill was recommended, never that a command was offered, so "declined" and "never offered" are the same number. The before arm proves it: 0 `COMMAND:` lines on four of six runtimes, one on dsh, and no command in the brief at all.
2. **The policy stops at the command.** The `ask` and must-not-start classes bind a command that is in the brief, not the skill workflow that can do the same work. Devin created a council scratch folder and pi wrote a fixture on `ask` rows without asking, before any offer existed.
3. **Discovery and first run each lose commands silently.** Claude exposes 32 of 44 commands because one file is named `skill.md`; a target repo with its own hook config never receives the advisor hook; and `/doctor:setup` skips its advisor and embedder legs on exactly the cold install it is meant to confirm.

Steady-state cost is not the problem. The hook is 196 ms median and 273 bytes per prompt against a 2,200 ms budget, and a warm embedding is 6.57 ms. The expensive prompt is the first one after install, where a 2,500 ms embedder-cascade probe can outlast the whole hook budget.

## 2. Answers to key questions

- **KQ1 — what the brief emits and whether a model can act on it: half answered.** The payload is measured (242 to 298 bytes, 60 to 75 tokens, three lines, a 320-byte head cap with at most 96 bytes used). It carries no document path and no offer state. Whether a model *acts* on the planned head needs the post arm.
- **KQ2 — what explains the before-arm start rates: answered.** Adoption follows capability, not the aggregate. Claude starts 3 of 4 read-only doctor rows and 0 of 8 mutating create rows; opencode and dsh start 3 of 8 mutating rows; codex starts nothing. Devin produced the command's artifacts without reading its document, so a low start rate can hide delivery.
- **KQ3 — which discovery defects exist: answered.** One confirmed collision costs 12 commands on Claude (`32/44`), the same file is mirrored into OpenCode untested, the same command has three native spellings, and Devin has no command surface at all. No check measures any of it. (The strategy box stays unticked because the iteration record's text dropped the backticks around `skill.md`; the answer is in `iterations/iteration-003.md`.)
- **KQ4 — what an external repository sees first: answered.** A confirmation step that skips its advisor and embedder legs when the daemon is cold, a first start whose cascade probe (2,500 ms) exceeds the hook child budget (2,200 ms), and a pre-existing hook config that silently wins the merge.
- **KQ5 — measured cost and what stays invisible: answered.** 196.2 ms median / 352.4 ms p95 and 273 bytes per prompt; warm embed 6.57 ms; CLI 63 to 71 ms. The cost is recorded and aggregated but not surfaced by `advisor_status` or any setup leg, and no session total exists.

## 3. Findings

Twenty findings across five iterations; `iterations/iteration-00N.md` carries the full evidence, and `deltas/iter-00N.jsonl` carries the structured rows. The fourth iteration's spelling correction is folded into item 13. The unique ones, grouped:

### 3.1 The brief

1. The brief is three lines of 242 to 298 bytes; 233 bytes of it is the static comment-hygiene directive, so 78 to 96 percent of a short brief is prompt-independent. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:162]
2. The head uses 72 to 96 of its 320 available bytes; the planned command-bearing head is about 72 bytes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97]
3. The brief names a command but never its document path. Phase 006's bullet gives only the convention, and for the 13 `create:*` commands on Claude the Skill-tool route is closed by the `skill.md` collision, so the path is the only route. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/scratch/bullet-draft.txt]
4. No start in the before arm is attributable to the advisor: the brief names no command and `COMMAND:` narration is 0 of 24 on claude, codex, pi and opencode and 1 of 12 on dsh. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl]

### 3.2 Measurement integrity

5. The closed diagnostic record carries `skillLabel`, `emittedBytes` and `directivesSuppressed`, and no command or policy, so an offer cannot be distinguished from a decline. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50]
6. The aggregate start rate hides a policy split that inverts per runtime: claude 3 of 4 `run` and 0 of 8 `start`; opencode 3 of 8 and 2 of 4; dsh 3 of 8 and 1 of 4; codex 0 and 0. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:640]
7. The start rate measures the path, not the outcome: devin produced `.skilled/agents/`, `.claude/agents/` and `.devin/agents/` from `/create:agent` while scoring `started: false`, and 5 of 8 mutating devin rows wrote. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl]
8. An argued doctor route can never be scored from its document read: `commandParts('/doctor:git hooks')` looks up `doctor/git hooks.md`; reproduced false for the argued form and true for `/doctor:git`. 28 of 35 doctor strings carry an argument. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:449]
9. The "write target per command" that phase 002 declares is prose in `gate3_location` ("a new or updated OpenCode skill package at --path"), not a path any check can match. [SOURCE: .skilled/skills/sk-doc/command-metadata.json]

### 3.3 Risk and the skill path

10. The run-or-ask policy stops at the command. Gate 2 has no command clause today; phase 006 binds the words to a command in the brief. On `ask` rows with no offer, devin created `specs/sk-prompt/010-sk-prompt-improvements/scratch/council/` and pi wrote a retrieval fixture, both without asking. [SOURCE: AGENTS.md:63]
11. Pi is the only runtime with 3 unsafe runs in 24; two changed paths and at least one unsafe is a self-chosen `:auto`. [INFERENCE: the scorer's unsafe rule plus the two changed runs]

### 3.4 Discovery

12. Claude exposes 32 of 44 tracked commands: `.claude/commands/create/skill.md` collapses 13 files into one entry. The same file reaches `.opencode/commands/create/skill.md`, and OpenCode's rule is untested. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt]
13. The same command has three native spellings: folder `/create:readme` on Claude and OpenCode, flat `create-readme` on Cursor, Codex and Pi, and no command surface on Devin. The install guide documents the hyphen rule, but the brief carries only the canonical form. [SOURCE: INSTALL-SKILLED.md:65] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:202]
14. No committed check measures per-runtime command visibility; `sync-runtime-mirrors.cjs --check` validates link shape only and covers two of the six roots. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:53]

### 3.5 First run

15. `/doctor:setup`'s advisor leg is `--warm-only` and returns SKIP when the daemon is not running; phase 008's embedder leg copies that shape. The guide calls step 5 "Confirms the whole setup works", so the two legs that matter are skipped on a cold install. [SOURCE: .skilled/commands/doctor/assets/doctor-setup.yaml:57] [SOURCE: INSTALL-SKILLED.md:118]
16. The first daemon start runs the embedder cascade with a 2,500 ms per-provider probe, which exceeds the Claude shim's 2,200 ms child budget. One slow provider can cost the first prompt its brief. [SOURCE: .skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:117] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38]
17. A project with its own `.claude/settings.json` (or codex/cursor/devin hook file) keeps it through the merge and never receives the `UserPromptSubmit` entry; no setup leg reads the target's hook wiring. [SOURCE: .skilled/commands/doctor/scripts/symlink-engine.cjs:821] [SOURCE: INSTALL-SKILLED.md:143]

### 3.6 Cost

18. Steady state is cheap: 196.2 ms median, 352.4 ms p95 over 40 samples, 273-byte mean payload, 16 percent of the child budget at p95. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38]
19. The cost is measured but not shown: `advisor-hook-health` holds the rolling p95, cache-hit rate and fail-open rate, and only `advisor_validate` returns it; `advisor_status` does not, and no setup leg prints it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:472] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-validate.ts:624]

## 4. Recommendations

Ordered by the risk each removes, not by file. None repeats a phase 005 to 008 task; where a recommendation extends a planned artifact, the phase is named. `P1` = closes a measured silent failure; `P2` = makes a number or a surface honest; `P3` = needs a later decision first.

| ID | Pri | Recommendation | Exact file | Measurable gain | Verify |
|---|---|---|---|---|---|
| R1 | P1 | Bind the command's policy to the skill path that runs the same workflow | `AGENTS.md` Gate 2 bullet (the 006 text) | The `ask`-row writes by devin and pi stop being allowed; the before arm shows 2 such rows and pi 3 unsafe | `rg -c "policy applies to the skill path" AGENTS.md` prints 1; `agents-md-check.cjs --json \| jq -r .status` prints `OK`; post arm `unsafe 0` per runtime |
| R2 | P1 | Record the offered command and policy in the closed diagnostic schema | `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts` (record + validator) and `hooks/claude/user-prompt-submit.ts:415` | Offer rate becomes countable in the row already written; today 0 of 1,000+ rows can say a command was offered; no extra write or latency | Fixture with both fields serializes; `advisor_status --format json` reports a per-command offer count |
| R3 | P1 | Record the offer per arm row and report starts per offer | `runtime/scripts/routing-accuracy/run-command-behaviour.mjs` and `score-command-transcripts.mjs` | Separates "offer worked" from prompt affinity; costs about 1.6 s per 24-row arm at 65 ms per CLI call | Each run line carries `offeredCommand`/`offeredPolicy`; `--summary` prints `offered 12 of 12` and starts-per-offer |
| R4 | P1 | Report the start rate and a `wrote` count per policy class | `score-command-transcripts.mjs` (`--summary`) | Makes `0 of 8 start, 5 of 8 wrote` on devin visible against `3 of 4 run` on claude; a risky-class regression cannot hide in the aggregate | `--summary --json \| jq '.devin.pre.byPolicy.start'` prints `{"started":0,"total":8,"wrote":5}` |
| R5 | P1 | Check the target repo's hook wiring on first run | New `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, called from `/doctor:symlink check --root` | Turns a silent no-brief install into `hook-missing <runtime>` with a repair; covers 4 native hook configs | Fixture without the entry exits 1 naming `hook-missing claude`; with the entry exits 0; the checkout exits 0 for four runtimes |
| R6 | P1 | Bound the daemon-start cascade below the hook budget | `.skilled/bin/system-skill-advisor-launcher.cjs` (set `SPECKIT_CASCADE_PROBE_TIMEOUT_MS=750`) | The first prompt is bounded by 2,200 ms instead of losing the brief to a 2,500 ms probe; today the bound is inverted | A hung-stub launch returns inside 2,200 ms and reports `prompt_embedding_timeout` |
| R7 | P1 | Carry the command document path in the brief head | `runtime/lib/render.ts` (`renderAdvisorBrief`) | Reaches the 12 hidden `create:*` commands on Claude and removes one inference per start; measured head 96 + about 40 bytes, still under the 140-byte guard | Golden heads carry a path that `test -f` resolves; `npm test` in `ADV` 0 failed |
| R8 | P1 | Print a per-runtime command-visibility count with a one-entry allowlist | `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` (`--check`) | Makes `claude 32/44` visible on every check and stops a new collision shipping; gives G5 a standing guard | Counts print today; a second `skill.md` makes `--check` exit 1 |
| R9 | P2 | Add the once-per-command clause unconditionally | `AGENTS.md` Gate 2 (phase 007 makes it conditional on T030) | Stops a re-phrased prompt re-offering a command already started; the scorer already counts `repeated` | `rg -c "once per command" AGENTS.md` prints 1; post arm `repeated 0` |
| R10 | P2 | Add a "Prove it" step to the install guide | `INSTALL-SKILLED.md` section 2, after "Check the Install" | A cold install gets a pass or a named failure instead of SKIP; the command starts the daemon on purpose, so the setup route stays read-only | The documented command prints `sk-doc` on a healthy checkout and `/create:readme` after 005 |
| R11 | P2 | Surface hook health and mean brief bytes | `runtime/handlers/advisor-status.ts` + the advisor leg's presentation in `DOC/assets/doctor-setup.yaml` | The person sees `p95 352 ms, 273 bytes` instead of needing `/doctor:skill-advisor tune` | `advisor_status --format json \| jq '.data.hookHealth.rollingP95Ms'` prints a number |
| R12 | P2 | Fix the argued-route document lookup | `score-command-transcripts.mjs` (`commandParts` / `documentTails`) | 28 of 35 doctor strings become scorable from a document read; a doctor row cannot report a false decline | A `/doctor:git hooks` case reading `doctor/git.md` returns `started: true`; vitest 0 failed |
| R13 | P2 | Add a native-spelling column to the 006 surface table | `hooks/skill-advisor-hook.md` `### Starting a surfaced command` | A person and a model can use the runtime's own spelling instead of only the canonical one | A test resolves each spelling to a file in that runtime's root |
| R14 | P2 | Guard the head length across all 44 command-bearing heads | The 005 golden-head matrix in `ADV/tests` | A future field cannot silently add bytes to every prompt; worst case today 136 of 140 bytes | The matrix reports 44 rows; a 141-byte fixture fails |
| R15 | P2 | Commit a session-shaped brief-cost script | New `runtime/scripts/measure-brief-cost.mjs` | A reproducible session total (N prompts + daemon start + embedder load), which no number covers today | `node … \| jq -c '[.n,.medianMs,.p95Ms,.meanBytes,.session20]'` prints five numbers; `git status --short` unchanged |
| R16 | P2 | Run the g5 listing probe on OpenCode | `007/scratch/g5/` (two listing files) | Settles whether the 12-command loss is Claude-only or shared, which sizes R8's allowlist | Two listing files name whether `create:readme` is offered |
| R17 | P3 | Give `gate3_location` a machine-readable `write_targets` companion | `.skilled/skills/*/command-metadata.json` + `derive-command-bridges.cjs` | Makes "did the run deliver the command's output" answerable per command rather than per run | `jq` prints three agent roots for `/create:agent`; `--check` prints `fresh` |

The three that carry the build's own success criterion are R2 and R3 (without them the before/after start rate cannot be attributed), R1 (the only recommendation that addresses the unsafe writes already observed), and R5 and R6 (the only ones that make a first install work before the first prompt).

## 5. Per-runtime notes

Before arm scored 2026-11-12T23:01:49Z; the arm was still growing, so denominators differ.

| Runtime | Start | Split | Unsafe | Surface | Note |
|---|---|---|---|---|---|
| claude | 3 of 12 | 3 of 4 `run`, 0 of 8 `start` | 0 | folder tree, 32 of 44 visible | Adopts only checks it cannot improvise |
| codex | 0 of 12 | 0 of 8, 0 of 4 | 0 | flat prompts (`create-readme`) | No adoption at all |
| opencode | 5 of 12 | 3 of 8 `start`, 2 of 4 `run` | 0 | folder tree, same `skill.md` risk | Adopts mutating creation workflows |
| dsh | 4 of 12 | 3 of 8 `start`, 1 of 4 `run` | 0 | flat prompts | Adopts mutating creation workflows; only runtime with a `COMMAND:` line |
| devin | 3 of 12 | aggregate only | 2 | no command surface, 14 skills | Produced create-agent artifacts without a document read; improvised a council run |
| pi | 0 of 12 | aggregate only | 3 | flat prompts | Wrote on an `ask` row and chose `:auto` at least once |

## 6. Cost ledger

| Item | Measured | Source |
|---|---|---|
| Brief payload, 40 samples | 242-298 bytes, mean 273 (61-75 tokens) | Iteration 5 probe |
| Hook latency, 40 samples | median 196.2 ms, p95 352.4 ms, max 371.2 ms | Iteration 5 probe |
| Hook budget | 2,200 ms child inside 2,500 ms hook | `skill-advisor-hook.md:38` |
| Advisor CLI | 62.7-71.3 ms | `008/scratch/measured-2026-11-12.txt:18` |
| Warm prompt embedding | 6.57 ms median, 10.99 ms p95 | `008/scratch/measured-2026-11-12.txt:12` |
| Embedder model | 274,302,450 bytes on disk, 335,733,063 resident loaded | `008/scratch/measured-2026-11-12.txt:4` |
| Static directive block | 233 bytes (78-96% of a short brief) | `render.ts:162` |
| Head budget | 320 bytes; measured max 96 used | `render.ts:97` |
| Cold start | UNMEASURED; bounded by a 2,500 ms probe against a 2,200 ms budget | `auto-select.ts:117` |
| Session total | UNMEASURED; inference 20 prompts ≈ 5,460 bytes, ≈ 3.9 s | Iteration 5 |

## 7. Hard blockers and decisions

- **Q025** leaves the `create` command ids as a recorded limitation, so `.skilled/commands/create/skill.md` may not be renamed. R7 and R8 reach the hidden commands without it.
- **Q037** keeps the hook brief unchanged for a degraded meaning lane, so no brief line may announce `semantic_lane_off`; the setup check, status tool and JSON warning are the chosen surfaces (phase 008).
- **D2 / Q011** keep the model free to choose between the command and the skill, so no recommendation may force the command path. R1 binds only the *policy* of the workflow, not the choice of path.
- **The `/doctor:setup` invariant** forbids starting the advisor daemon, so the first-run proof (R10) belongs in the install guide, not in a setup leg.

## 8. Eliminated Alternatives

- **Trim the comment-hygiene directive to cut tokens.** It carries a repo hard block and is deliberately injected beside every brief. Iteration 1, 5.
- **Rename `.skilled/commands/create/skill.md`.** Blocked by Q025; the document path (R7) and the visibility check (R8) reach the same commands.
- **Treat the low Claude start rate as a briefing failure.** The same brief yields 3 of 4 read-only starts and 0 of 8 mutating starts; the cause is the model's capability judgment.
- **Re-run the before arm to stabilise the numbers.** Phase 007 owns the 24-per-runtime freeze; a research pass must not start CLI runs.
- **Add a recommendation leg to `/doctor:setup`.** The route's invariant forbids starting the daemon; R10 puts the proof in the guide.
- **Show the degraded lane in the brief.** Ruled out by Q037.
- **Lower the 250 ms CLI fallback default.** `resolveSkillAdvisorCliFallbackTimeoutMs` already returns the caller's 2,200 ms budget, so the default never applies to the Claude hook.
- **Collapse the shim/handler/CLI process chain to save latency.** The p95 uses 16 percent of the budget; the refactor would buy milliseconds the person cannot feel while touching the timeout boundary.

## 9. Divergence Map

No divergent pivots were taken. Saturated directions: directive trimming (blocked by an operator rule), `create` rename (blocked by Q025), steady-state latency work (blocked by measurement), and the 250 ms fallback (a false lead resolved by reading the resolver). Remaining frontier: the post-arm behaviour of the planned head, the cold start, and OpenCode's folder rule.

## 10. Open Questions

1. **Does the offer move mutating starts on claude and codex?** The pre-arm cannot answer it; the post arm with R2 and R3 can.
2. **Does OpenCode collapse a folder that holds `skill.md`?** One listing run (R16) decides it.
3. **What does a cold first prompt cost end to end?** The daemon cannot be stopped under this lineage's rules; a future phase with daemon authority can measure it.
4. **Does Devin need a command surface, or is its skill route enough?** The install guide says `/system-spec-kit`; no measurement shows whether a Devin user reaches it.
5. **Will the `wrote` count (R4) be enough to judge delivery, or does R17's `write_targets` have to land first?** R4 answers "did anything happen"; R17 answers "was it the right thing".

## 11. Review cross-check

Checked against the four child plans and task lists:

- **005** builds the table, fields, head, degraded contract and six golden heads. R7 adds a field to the head and R14 extends the golden matrix; neither is in 005's tasks.
- **006** adds the Gate 2 bullet, the Cursor pointer, the router handoff, the Gate 3 notice and the child downgrade. R1 adds one policy sentence to that bullet, R9 makes 007's conditional clause unconditional, R13 adds a column to the table 006 T018 builds. All are extensions, not repeats.
- **007** builds the scorer and runner, runs the before and after arms, and adds the clause only if missing. R3 and R4 change what the scorer reports; R12 fixes a lookup its tests do not cover.
- **008** adds the measurement script, status fields, deadline, warning, route, setup leg and guide tables. R6 bounds the daemon-start cascade (008's deadline covers the prompt embedding, not the cascade), R11 exposes the hook health 008 does not touch, R15 adds a brief-cost script beside `measure-embedder-cost.mjs`.
- **Operator decisions**: R7 and R8 respect Q025; R1, R9 and R13 respect D2/Q011; R10 and R11 respect Q037; R10 respects the setup route's read-only invariant.

## 12. References

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md`, `decision-record.md`, `goal.md`
- `005-recommendation-contract-and-brief/plan.md`, `tasks.md`
- `006-gate-2-binding-and-runtime-pointers/plan.md`, `tasks.md`, `scratch/bullet-draft.txt`
- `007-per-runtime-behaviour-proof/plan.md`, `tasks.md`, `scratch/runs-pre.jsonl`, `scratch/g5/result.txt`
- `008-embedder-setup-and-cost/plan.md`, `tasks.md`, `scratch/measured-2026-11-12.txt`
- `AGENTS.md:63-70`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `lib/metrics.ts`, `handlers/advisor-status.ts`, `handlers/advisor-validate.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, `run-command-behaviour.mjs`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`, `hooks/skill-advisor-hook.md`, `hooks/lib/skill-advisor-cli-fallback.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`
- `.skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts`
- `.skilled/commands/doctor/assets/doctor-setup.yaml`, `scripts/symlink-engine.cjs`
- `INSTALL-SKILLED.md`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md`
- `.skilled/skills/sk-doc/command-metadata.json`
- This lineage: `steer.md`, `iterations/iteration-001.md` to `iteration-005.md`, `deltas/iter-001.jsonl` to `iter-005.jsonl`

## 13. Implementation notes (non-goals of this run)

No file outside this lineage was modified. No live CLI run, no pi invocation, no ollama control, no process kill, no full vitest suite and no git write was performed. One rule deviation is recorded in `iteration-002.md`: a `sed -i ''` timestamp correction inside the lineage, which the workflow's banned-operations list forbids even in the write surface. The later edits use the file-edit tool. One incidental write is recorded here: measuring the real hook (47 invocations across iterations 1 and 5) appends diagnostic rows to the advisor's durable metrics store under the OS temp directory (`$TMPDIR/speckit-skill-advisor-metrics/`), never into the repository; those rows are the hook's own runtime telemetry and were not read back into any finding.

## 14. Lineage metadata

- Lineage: `ux`, session `fanout-ux-1794523629654-v541y3`, generation 1, parent null
- Loop type: research, stop policy convergence, threshold 0.05, floor 3, max 5
- Iterations: 5, all `complete`
- Executor: `cli-opencode`, model `opencode-go/deepseek-v4.1-flash`, reasoning `max`
- Write surface: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/`
- Reducer: `reduce-state.cjs` run after every iteration; registry, strategy and dashboard are reducer-owned
- Projection note: the gateway's `deep-research-state.jsonl` projection carries a subset of each iteration row (`iteration`, `run`, `status`, `newInfoRatio`, `ruledOut`, `focus`, `timestamp`); the full row with `findingsCount`, `noveltyJustification`, `toolsUsed` and `sourcesQueried` is the one handed to the gateway and the one stored first in `deltas/iter-00N.jsonl`. The reducer read the deltas: the registry records 20 key findings and 5 iterations.

## Convergence Report

- Stop reason: `maxIterationsReached` (5 of 5). Question coverage is 3 of 5 ticked and 4 of 5 substantively answered; KQ3's box did not tick because the iteration record's answer text dropped the backticks the strategy's question carries, and KQ1 is half answered because the model side needs the post arm. Convergence on the 0.05 threshold was therefore not claimed.
- Total iterations: 5
- Questions answered: 4 / 5 substantively (KQ2, KQ3, KQ4, KQ5); 3 of 5 ticked in the reducer registry
- Remaining questions: 1 (KQ1, half answered)
- newInfoRatio trend: 0.90, 0.88, 0.83, 0.88, 0.88 (mean 0.874)
- Last 3 iteration summaries: run 3 discovery surface (0.83); run 4 first run (0.88); run 5 cost (0.88)
- Convergence threshold: 0.05
- Divergence summary: no pivots; four saturated directions, all blocked by an operator rule, a decision or a measurement
