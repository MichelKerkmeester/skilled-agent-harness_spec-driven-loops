# Independent Review: pi-context-decisions Research (Fable 5.2)

Reviewer: Claude Fable 5.2, read-only, 2026-11-18. Subject: `research.md` and `iterations/iteration-001.md` to `iteration-005.md` in this folder, produced by Claude Opus 5.5 at medium effort ("claude2").

**Bottom line.** Ten of nineteen verdicts hold as written, eight hold only in part and one is contradicted by shipped code. The central thesis is too broad: it is false on two of the runtimes the advisor serves. The research also read the wrong arm of the extension's benchmark for the model-score question, which makes R6 look more expensive and less promising than the evidence says.

Path prefixes used below:

- `CTX/` = `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/`
- `ADV/` = `.skilled/skills/system-skill-advisor/`
- `JEV/` = `.skilled/skills/cli-classifier/`

Claim marks: **CONFIRMED** means I read the code or ran the command and read its output. **INFERRED** means reasoning from confirmed facts, with what would confirm it.

Commands run (all exit 0, output read): the live scorer `printf '%s' '{"prompt":"<text>"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json` on ten prompts, and the same with `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` set. I did not run the hooks, because a hook run writes diagnostic and receipt state.

---

## 1. Verdict Table (Part A)

Nineteen items: R1 to R8 from section 11, and the eleven rows of Eliminated Alternatives (E1 to E11, in table order).

| Item | claude2 verdict | My verdict | Evidence (both sides) | Reason |
|------|-----------------|------------|-----------------------|--------|
| R1 History shows emit-time values, gaps `unknown` | ADOPT, design rule | AGREE | `CTX/src/extension/decisions-history.ts:18` ("Never inferred from current settings"), `:52` (`UNKNOWN_MARK`). `CTX/test/extension-real-pi-session.test.ts:44-45` asserts the recorded mark. `ADV/runtime/lib/metrics.ts:50-64` | CONFIRMED. The cited range `:12-27` is only the interface. The `unknown` mark lives at `:52`. The advisor record already carries `generation` (`metrics.ts:60`), which is the pin a history view needs. |
| R2 Visible fallback on the crash path, Claude and Pi | ADAPT | PARTLY | `ADV/hooks/claude/user-prompt-submit.ts:468-479`, `:326`, `:340`, `:356`. `ADV/hooks/pi/prompt-advisor.ts:285-324`. `ADV/hooks/dsh/prompt-advisor.mjs:124`, `:181-184`. `ADV/hooks/vibe/prompt-advisor.mjs:190-195`, `:244-246`. `.opencode/plugins/system-skill-advisor.js:1574-1599`. `ADV/runtime/lib/render.ts:651-674` | The gap is CONFIRMED. The scope is wrong in three ways. See correction 2 below the table. |
| R3 Weak-follow-up guard, gated on a benchmark | ADAPT, gated | PARTLY | `ADV/runtime/lib/prompt-policy.ts:182`. `ADV/runtime/lib/render.ts:540`, `:590-619`. `ADV/runtime/lib/scorer/scoring-constants.ts:190-192`. Live probe | The probe reproduces, but the stated result is wrong. "fix that too" returns three passing skills (sk-code, sk-doc, local-webflow), `ambiguous: false`. The renderer then names only the top one (`render.ts:618-619`), so the brief is a single-skill brief for sk-code, not "a two-skill brief". CONFIRMED by probe and code read. The item also overlaps sibling R10 (soft session-family preference, deferred behind a replay) without citing it. |
| R4 Opt-in "why" fields under `SKILL_ADVISOR_DEBUG` | ADAPT | AGREE | `ADV/runtime/lib/metrics.ts:50-64`, `:456-461`. `ADV/runtime/lib/scorer/types.ts:174` | CONFIRMED. Two additions: the closed-schema validator at `metrics.ts:443` must accept the new fields, and `confidenceFloored` should be the fourth field because it already exists on the recommendation. |
| R5 Floored-confidence count | ADAPT | AGREE | `ADV/runtime/lib/scorer/fusion.ts:1383-1400`. `ADV/runtime/lib/scorer/types.ts:174`. `ADV/runtime/lib/scorer/ambiguity.ts:29-33`, `:73` | CONFIRMED, and cheaper than stated. The scorer already sets `confidenceFloored: true` per recommendation. The flag is dropped from the public CLI output (my probe shows no such field), so the work is one counter and one pass-through. |
| R6 Shadow tie-break through `cli-jev`, per-model threshold | ADAPT, research only | PARTLY | `CTX/docs/benchmarks/relevance-choice-vs-score.md:126`, `:181-193`, `:395-407`. `JEV/shared/scripts/jev-transport.mjs:4`, `:90`, `:142`, `:608`. `JEV/cli-jev/SKILL.md:100`. `ADV/runtime/lib/scorer/lane-registry.ts:13`. `ADV/runtime/handlers/advisor-recommend.ts:610-621` | Right idea, wrong question type and wrong cost. See correction 1. |
| R7 Per-session flip rate, needs a new session key | ADAPT, narrowed | PARTLY | `ADV/runtime/lib/metrics.ts:50-64`. `ADV/hooks/vibe/prompt-advisor.mjs:74-77`, `:168-188`. `ADV/hooks/lib/directive-lifecycle.ts:129-170`. `ADV/runtime/lib/render.ts:469-497`. `ADV/runtime/lib/policy-plan.ts:836-881` | The diagnostic record has no session key: CONFIRMED. "Which does not exist today" is too broad. Session-keyed state already exists in three places, and the Vibe head receipt already compares this turn's routing head with the last one for the session (`vibe:185`). A counter at that comparison measures flips with no new persisted identifier. |
| R8 `acceptable` class in the routing corpora | ADAPT, narrowed | AGREE | `ADV/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` (195 rows, 18 with `skill_top_1: none`, counted). `ADV/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:199-203`, `:247-249`. `CTX/scripts/benchmark-relevance-methods.ts:384-400` | CONFIRMED. The orchestrator's correction of iterations 1 and 5 is right. The ratchet pins the corpus hash but not the skill inventory, which the extension's benchmark does pin. |
| E1 Hosted model score replacing fusion | REJECT | PARTLY | `CTX/docs/benchmarks/relevance-choice-vs-score.md:120-126`, `:173`, `:181-193` | The verdict stands. The evidence is from the wrong arm. See correction 1. |
| E2 One global normalized threshold | REJECT | AGREE | `CTX/docs/benchmarks/relevance-choice-vs-score.md:283-297` | CONFIRMED. Jev F1 0.40 at 0.75 and 0.88 at 1.75 match the doc. |
| E3 Inventory floor of 8 | REJECT | PARTLY | `CTX/src/apps/skill-filter.ts:147-155`. `.pi/extensions/pi-cache-optimizer/index.ts:209`, `:612-650`, `:679-696`. `.pi/settings.json:24` | REJECT stands, the reason does not. "The advisor hides nothing" is false on Pi in this repository, where the skills section is already rewritten. See section 2. |
| E4 Additive-only advertising | REJECT | PARTLY | `CTX/src/extension/runtime.ts:274-278`. `ADV/hooks/claude/user-prompt-submit.ts:447-451`. `ADV/hooks/pi/prompt-advisor.ts:356-357`. `.opencode/plugins/system-skill-advisor.js:1566`, `:1671` | "The advisor injects into the newest user turn" is CONFIRMED for Claude and Pi and false for OpenCode, where the brief is pushed into `output.system` through `experimental.chat.system.transform`. The research cites only the two runtimes that fit. |
| E5 Suppressing already-surfaced skills | REJECT | DISAGREE | `ADV/hooks/vibe/prompt-advisor.mjs:7-8`, `:156-188`. `ADV/hooks/lib/directive-lifecycle.ts:72-74`, `:165-170` | The repository ships this on Vibe. See correction 3. |
| E6 Previous-reply text in the lexical lanes | REJECT | AGREE | `CTX/src/extension/decision-activity.ts:28-39`. `ADV/runtime/lib/prompt-cache.ts:33-40`. Live probe D | The inferred pull is now CONFIRMED by probe: prefixing a task with "You said: I used sk-doc ... and sk-git ..." flips top-1 from sk-code to sk-doc and sets `ambiguous: true`. The cache-key reason is weak (a key can carry a context digest, and the OpenCode key already includes the session at `system-skill-advisor.js:504`). The research missed that the extension has a second, smaller context channel, see N4. |
| E7 `failMode: "closed"` by name | REJECT | AGREE | `CTX/src/apps/skill-filter.ts:68-74`, `:170-171`. `ADV/runtime/lib/render.ts:651-666` | CONFIRMED. One principle next to it does transfer and was not picked up: an invalid policy never opts in to the permissive mode (`skill-filter.ts:69-70`). See N3. |
| E8 Pinned always-surface set | REJECT | AGREE | `CTX/src/apps/skill-filter.ts:58`, `:76-78`. `ADV/hooks/claude/user-prompt-submit.ts:390-431` | CONFIRMED on the cited code. The "Gate 2 artifact trigger" that covers the need is an instruction in `AGENTS.md`, not code, so that half is INFERRED. |
| E9 Tool and MCP advertisement filter | REJECT | AGREE | `.mcp.json`, `opencode.json`, `.pi/mcp.json`, `.codex/config.toml:12` (each registers only `code_mode`). `.skilled/skills/mcp-code-mode/mcp-server/index.ts` (7 `registerTool` calls, counted) | CONFIRMED, and on four runtime configs where the research checked two. |
| E10 Relevance-scored call gate | REJECT | AGREE | `CTX/src/extension/tool-filter.ts:6-8` | CONFIRMED. The extension says itself that the gate is not a sandbox. |
| E11 Operator warning per failed decision | REJECT | PARTLY | `CTX/src/extension/runtime.ts:79-92`, `:329`. `CTX/src/extension/footer-status.ts:12-30`. `ADV/runtime/lib/metrics.ts:71`. `.pi/statusline.sh` (0 matches for "advisor") | R2 tells the model, not the operator. The extension has a channel that costs no model context: a footer flag with a closed error code. The research rejected the noisy form and never weighed the quiet one. See N5. |

Counts: 10 AGREE, 8 PARTLY, 1 DISAGREE.

### Correction 1. The model-score evidence comes from the wrong benchmark arm (E1, R6)

The research rejects a hosted score on "precision 0.39" and "254 to 5,704 ms". Both numbers are CONFIRMED in the doc, and both describe the per-skill score arm, which selects a set of about ten skills from thirty. That is a multi-label task. The advisor's job is top-1.

The same benchmark has a third arm that is the top-1 task: one `choice` question over all skills plus `none` (`CTX/docs/benchmarks/relevance-choice-vs-score.md:28`). Its results, CONFIRMED from the doc:

- Latency 201 to 758 ms, median 279 ms (`:126`).
- Cost $0.000020 to $0.000060 per request (`:134-146`).
- Precision 1.00 for four of five models, Jev included (`:181-193`).
- `none` returned on the unrelated control by four of five models (`:395-407`).

The 5,704 ms figure is one request, flagged in the doc as that model's first call of the run (`:115`). No other score request passed 1,647 ms.

Two consequences:

1. E1 still stands, because a network call on every prompt adds a failure mode and sends the prompt off the machine. The latency and precision argument does not support it.
2. R6 should be a `choice` question over the ambiguity-cluster members plus `none`, not a per-skill `score`. `cli-jev`'s Pi transport maps only `choice` and `noul` (`JEV/shared/scripts/jev-transport.mjs:4`, `:608`), and `score` stays on the CLI (`JEV/cli-jev/SKILL.md:100`). A `choice` needs no per-model threshold, so that part of R6 falls away. The quoted cost of "$0.0002-0.0018 per call" is the thirty-question arm. A two or three option tie-break is INFERRED to cost at or below the single-winner figure.

Caveat I owe the reader: the single-winner arm is 4 calls per model. It is direction, not proof.

### Correction 2. R2's scope is one shared handler plus four adapters, not "Claude and Pi"

`handleClaudeUserPromptSubmit` is the handler for Claude, Pi (`pi/prompt-advisor.ts:289`), DSH (`dsh/prompt-advisor.mjs:124`) and Vibe (`vibe/prompt-advisor.mjs:192`). CONFIRMED by reading each call site. It catches its own faults and returns `{}` (`user-prompt-submit.ts:468-479`), so it never rejects.

That changes the Pi claim. The research says a Pi crash "sets `advisorFailed` and delivers nothing" (`pi/prompt-advisor.ts:323-324`). That branch is reached only when the dynamic import fails. A fault inside the handler arrives at Pi as a resolved `{}`, `context` stays undefined and `advisorFailed` stays false. So:

- One edit in the shared catch covers inner crashes on four runtimes.
- Each adapter has its own silent path that the shared edit does not reach: Pi `:323-324`, DSH `:181-184`, Vibe `:244-246`.
- Pi has a second silent path with no catch at all. When the imported module lacks a `handleClaudeUserPromptSubmit` function, the `if` at `:285` has no `else`, and nothing is delivered or flagged.
- The two `PARSE_FAIL` returns (`user-prompt-submit.ts:340`, `:356`) are equally silent to the model.

The benefit is also understated. The fallback text carries the comment-hygiene directive (`render.ts:663`), so a crash today drops that directive as well as the route.

How often the unhandled catch fires is unknown. `fail_open` with `errorCode: UNKNOWN` in the diagnostics file would count it.

### Correction 3. Session memory of the surfaced route is shipped code on Vibe (E5)

The research rejects "suppressing already-surfaced skills" because compaction could drop the earlier brief. `ADV/hooks/vibe/prompt-advisor.mjs:168-188` does exactly this: it stores the routing head per session and delivers nothing when the head is unchanged (`:185`). CONFIRMED by reading.

The compaction risk is already handled by the mechanism the research cites for something else. The shared handler redelivers the full block on `startup`, `resume`, `compact` and `clear`, and on a transcript that shrank (`directive-lifecycle.ts:72-74`, `:165-170`). A full block resets the Vibe receipt (`vibe:176-178`).

So the open question is not whether to build this. It is whether Claude, Pi and OpenCode should get the head reduction Vibe has. That is a parity item with a working reference, and the research's own RQ2 asked for it.

---

## 2. Thesis Check

The thesis: "most ideas do not transfer because the extension replaces or withholds an advertisement, while the advisor only adds a hint on top of a skill list the host still shows in full."

**Where it holds.** On Claude Code. The hook can only add `additionalContext` (`user-prompt-submit.ts:447-451`), and nothing in this repository edits the host's skill listing there. The rejections of pins, the fail-closed name and the tool filter follow from that. CONFIRMED.

**Where it fails.**

1. **Pi, in this repository.** `.pi/settings.json:24` loads `extensions/pi-cache-optimizer`. That extension replaces Pi's skills section with a compressed index that keeps names and locations and drops every per-skill description (`.pi/extensions/pi-cache-optimizer/index.ts:596-606`, `:679-696`). It is on by default from four skills up (`:209`, `:683-687`). So on Pi the host does not show the list in full, and this repository is already in the business of rewriting the advertisement. CONFIRMED from code. That the rewrite applies in a live session is INFERRED: line `:690` makes it a no-op when Pi's format does not match, and a captured Pi system prompt would confirm it. On Pi the advisor brief is then the only place a description-level signal reaches the model, which raises the stakes of every brief-quality item.
2. **OpenCode.** The brief goes into the system prompt (`system-skill-advisor.js:1566`, `:1671`). The prompt-cache argument the research uses to dismiss additive advertising ("the problem does not exist at a user-turn injection point") is about a different injection point than the one OpenCode uses. Whether a per-prompt system change costs cache hits there is INFERRED. A cache-read token comparison across two prompts in one OpenCode session would confirm it.
3. **Vibe.** The advisor already withholds its own repeated hint per session (correction 3). "Only adds" does not describe it.
4. **The thesis is about the output channel, and half the extension is about the input side.** How the task text is bounded and cleaned, how config is validated, how stale results are discarded and how failures are classified do not depend on whether the output replaces or adds. Section 3 lists what the thesis filtered out.

**Net.** The thesis is a fair summary for Claude Code and an over-generalisation as a statement about "the advisor". Three of the eleven rejections lean on it where it is false (E3, E4, E5).

---

## 3. New Findings (Part B)

Each idea was checked against the advisor before being called a gap. Verdicts use the brief's terms.

### N1. An override that fails silently, and a client setting the daemon ignores. ADAPT

- **Extension mechanism.** Invalid settings are a visible error and never a quiet fallback: `CTX/src/settings.ts:263-266` ("never a fallback to a different paid backend"), unknown fields warn (`:87-92`), removed keys fail by name (`CTX/src/apps/relevance.ts:74-79`), and an invalid policy cannot select the permissive mode (`CTX/src/apps/skill-filter.ts:69-70`, `:170-171`). A settings change bumps a generation and drops caches (`CTX/src/extension/runtime.ts:137-138`).
- **Advisor counterpart.** `ADV/runtime/lib/compat/contract.ts:17-35`. An out-of-range or non-numeric value falls back to the default with no warning. `parseFloat` also accepts `0.9xyz` as 0.9.
- **What I ran.** With `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD` set to `abc`, `1.5`, `0.99` and `0.9xyz`, the CLI reported `effectiveThresholds.confidenceThreshold: 0.8` every time, with no warning, including on a cache miss and with `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1`. CONFIRMED. So a valid override set in the caller's environment had no visible effect on the documented front door.
- **Why.** INFERRED: the CLI is daemon-backed (`.skilled/bin/skill-advisor.cjs:5`, `:26`) and `fusion.ts:72-73` reads the thresholds at module load in the daemon's process. Restarting the daemon with the variable set, then re-running the probe, would confirm it.
- **Why it matters here.** Section 6 of the research says each bar "can be overridden through an environment variable" and iteration 5 marks it CONFIRMED and calls it "the per-deployment threshold knob". The code path is confirmed. The effect is not.
- **Change.** Report the threshold source in `effectiveThresholds` (default, env or request). Emit a warning in `warnings[]` when an env value is rejected. Decide whether the daemon or the caller owns the value and say so in the contract.
- **Benefit.** An operator who tunes a bar can see whether it took. **Cost.** Small, one resolver and one output field. **Risk.** A new public field needs a schema bump.

### N2. Tie-break by single `choice`, not per-skill `score`. ADAPT (replaces R6's design)

Covered in correction 1. Extension evidence `CTX/docs/benchmarks/relevance-choice-vs-score.md:28`, `:126`, `:181-193`. Advisor side: the shadow seam `ADV/runtime/lib/scorer/lane-registry.ts:13`, the sink that already stores an HMAC of the prompt and not the prompt (`ADV/runtime/handlers/advisor-recommend.ts:610-621`), and the `choice` transport (`JEV/shared/scripts/jev-transport.mjs:181-196`). **Benefit.** A measurable answer to "does a model break our ties better" at about a tenth of the quoted cost. **Cost.** A daemon-side async call and a labelled ambiguity slice, which exists (`scorer-eval-baseline-ratchet.vitest.ts:208`). **Risk.** Prompt egress, unchanged from R6.

### N3. Score the task, not the text around it. ADAPT

- **Extension mechanism.** `taskWithoutExpandedSkill` strips a host-expanded skill envelope before scoring and refuses a malformed one (`CTX/src/apps/skill-filter.ts:107-117`). Non-user messages get no task (`CTX/src/extension/runtime.ts:263`).
- **Advisor counterpart.** A byte cap only (`ADV/hooks/claude/user-prompt-submit.ts:174-190`, `ADV/runtime/lib/skill-advisor-brief.ts:461`). I searched the prompt-policy, brief, cache, handler, CLI-fallback, Pi hook and OpenCode plugin files for `<skill`, `system-reminder` and `<command-` and found no stripping.
- **What I ran.** Base prompt "rename the helper function in the parser module and run its tests" gives sk-code at 0.83. Wrapped in a quoted earlier advisor line naming sk-design, it becomes `ambiguous: true` with sk-design at 0.83. Prefixed with a pasted reply naming sk-doc and sk-git, top-1 becomes sk-doc at 0.93. CONFIRMED.
- **Change.** Before scoring, drop quoted advisor lines and host-injected envelopes, and discount skill names that appear inside quoted or pasted spans.
- **Benefit.** Stops pasted transcripts from steering the route, a failure that exists today without any new feature. **Cost.** One normaliser plus corpus rows. **Risk.** Over-stripping a prompt that really is about a named skill. The explicit-author lane must keep unquoted names.
- **Limit.** The expanded-skill envelope case is hypothetical for our hooks, which see the prompt before expansion (INFERRED). The pasted-text case is real.

### N4. A prior-route signal for weak follow-ups, without reply text. ADAPT (sharpens R3)

- **Extension mechanism.** Two bounded context channels, not one. The previous final reply, taken only when the run ended with `stopReason: stop` and no tool call (`CTX/src/extension/decision-activity.ts:28-31`). And past-turn summaries: at most 12 items of 240 characters, 2,000 in total, written only for the session and generation that asked (`CTX/src/extension/past-turn-summaries.ts:19-25`, `:59-63`). The research weighed only the first.
- **Advisor counterpart.** The last routing head per session already exists on Vibe (`ADV/hooks/vibe/prompt-advisor.mjs:74-85`), and the lifecycle store is session-keyed on every runtime (`ADV/hooks/lib/directive-lifecycle.ts:129-170`).
- **Change.** For R3's guard, use state the advisor already holds. When the policy reason is `work_intent_with_meaningful_tokens`, the top pass is floored and the session has a previous head naming a different skill, emit nothing. No reply text enters the lanes, so E6's objection does not apply.
- **Benefit.** Removes the specific failure the probe shows: "fix that too" pulls sk-code in a session that may be about anything. **Cost.** One policy branch plus the head receipt on the runtimes that lack it. **Risk.** The stickiness risk sibling R10 already names. This item needs that replay too, and should be planned with R10, not beside it.

### N5. A status flag for the operator that costs no model context. ADAPT

- **Extension mechanism.** `CTX/src/extension/footer-status.ts:12-30` shows a fixed glyph, a count and a closed error code such as `!config` or `!timeout`. Free text never reaches it (`:16`). Headless reports are deduplicated in a bounded set and go to stderr, never the RPC stream (`CTX/src/extension/runtime.ts:79-92`).
- **Advisor counterpart.** A rolling fail-open rate that someone has to query (`ADV/runtime/lib/metrics.ts:66-74`). `.pi/statusline.sh` has no advisor segment (0 matches for "advisor"). The OpenCode plugin has a status tool (`system-skill-advisor.js:1675`).
- **Change.** One status-line segment per runtime that has a status line: last status and error code from the newest diagnostic record.
- **Benefit.** The operator sees an outage on the turn it happens. R2 informs the model only. **Cost.** Small per runtime. **Risk.** A stale segment if the record is not written, which is the same fault it should report.

### N6. A closed error code at the catch, not `UNKNOWN`. ADAPT (fold into R2)

- **Extension mechanism.** Every failure maps to one of ten codes and the raw error is never passed on (`CTX/src/decision/errors.ts:4`, `:13`, `:28-31`. `CTX/src/apps/skill-filter.ts:102-106`). HTTP status maps to code and to a retryable flag (`CTX/src/core/http.ts:29-34`).
- **Advisor counterpart.** A closed code set exists (`ADV/runtime/lib/metrics.ts:40`), but the unhandled catch discards the error object and records `errorCode: 'UNKNOWN'` with a fixed string (`user-prompt-submit.ts:468-478`).
- **Change.** Bind the error in the catch and classify it by name or code into the existing set.
- **Benefit.** R2 makes the crash visible. This makes it diagnosable, and it gives the count that says how often R2's path fires. **Cost.** A few lines. **Risk.** None for the default path, as long as no message text is persisted.

### N7. A test against the real host for the invariants that only the host can break. ADAPT, low priority

- **Extension mechanism.** `CTX/test/extension-real-pi-session.test.ts:16-62` runs a real Pi `AgentSession` with an offline faux provider. It asserts that the first system message is identical across two prompts (`:49`) and that recorded state survives compaction and a context edit (`:59-61`).
- **Advisor counterpart.** `ADV/runtime/tests/hooks/prompt-advisor.vitest.ts` drives the Pi hook through a hand-built host object. I found no import of a Pi session API under `system-skill-advisor` (searched for `createAgentSession` and the Pi package names). Sibling R7 covers the dist path only.
- **Change.** One test that loads the Pi hook into a real session and asserts that the brief lands in the user turn and that the system prompt is unchanged between two prompts.
- **Benefit.** Catches a host-contract drift that a fake cannot. **Cost.** A Pi SDK dev dependency and its version pin. **Risk.** Maintenance on every Pi release. That cost is why this is low priority.

### N8. Budget gates for any live classifier measurement. ADAPT, only if N2 or R6 is built

- **Extension mechanism.** Two independent opt-ins before any billable call (`CTX/scripts/benchmark-relevance-methods.ts:411`, `:703`). A hard request cap enforced by a counting `fetch` wrapper across resumes (`:228-236`). A soft cost stop between runs (`:462-463`). The inventory hash and policy are written into the report and checked on resume (`:384-400`, `:429`). Labels were fixed before any output was seen (`CTX/docs/benchmarks/relevance-choice-vs-score.md:83`).
- **Advisor counterpart.** None found. I searched the `JEV/benchmark` and `JEV/shared/scripts` `.mjs` files for `maxRequests`, `max-requests`, `maxCost`, `--live` and `LIVE=1`. The only "budget" hits are a row budget and a time budget.
- **Change.** Give the shadow tie-break run the same four gates.
- **Benefit.** A shadow lane that scores live prompts cannot overspend or silently change inventory mid-run. **Cost.** Small. **Risk.** None.

### Checked and not a gap

- **Stale-result guard** (`CTX/src/extension/runtime.ts:264`, `:282`). The OpenCode plugin has an epoch check (`system-skill-advisor.js:1385`), and the other hooks run one process per prompt. REJECT.
- **Record at commit, not at compute** (`runtime.ts:334-347`). The advisor defers its receipt until delivery (`user-prompt-submit.ts:396`, `:453-459`). Already present.
- **Large-inventory sharding and one shared deadline** (`CTX/src/apps/relevance.ts:112-155`, `:182-236`). A local scorer has no batches. REJECT, except as input to N2.
- **HTTP layer: endpoint allowlist, `redirect: "error"`, byte caps, bounded Retry-After** (`CTX/src/core/http.ts:23-27`, `:44-52`, `:83-97`). The advisor makes no HTTP call, and `cli-jev` shells out. REJECT.
- **Subagent manager and parent-routed diagnostics** (`CTX/src/extension/manager-diagnostics.ts:13-26`). The advisor gives child sessions no brief (`vibe:62-66`, `render.ts:529`). The principle "never infer a capability from a name or an installed file" is sound, and Pi `:285` is its one local violation, noted under R2. REJECT as a feature.
- **Changelog and publishing discipline** (`CTX/docs/publishing.md`, `CTX/test/changelog.test.ts`). This repository has its own changelog system under `sk-doc`. Not compared in depth. REJECT for the advisor.
- **Secret rejection in settings** (`CTX/src/settings.ts:93-100`). The advisor stores no settings file. REJECT.

---

## 4. Method Issues

1. **Runtime coverage was two of five.** Claims about "the advisor" rest on the Claude and Pi hooks. The OpenCode plugin was read only by the orchestrator and only for its catch block. DSH and Vibe were not read. Three verdicts change once they are (R2, E4, E5).
2. **An inference promoted to CONFIRMED.** Iteration 5 finding 1 marks the env override CONFIRMED from reading the resolver. Reading a resolver confirms the code path, not the effect. My probe shows no effect at the CLI (N1).
3. **A probe result reported past what it showed.** Section 5 says the follow-up "yields a two-skill brief". The probe returns a ranked list. The brief is produced by the renderer, which the probe does not run. Section 15 admits the probe skips the policy gate but not that it skips the renderer.
4. **RQ1 answered from one arm of a three-arm benchmark**, and the arm chosen is the one least like the advisor's task (correction 1).
5. **RQ3 answered for half the mechanism.** The extension's `history` channel (past-turn summaries, shipped in v4.2.0 the day before the run) appears in iteration 3 but never reaches a verdict.
6. **RQ7 answered narrowly.** "Does anything in our stack have the over-advertising problem" was answered for MCP tools only. The skill listing itself is the largest advertisement in the stack, and this repository already compresses it on Pi (section 2). The research defers that as "the remaining frontier" when it is the centre of the question.
7. **`src/decision/` and `src/core/` were in the brief's reading list and produced no finding.** The iterations and synthesis contain no mention of the error taxonomy, validation, retry, auth, sharding, the footer, the subagent manager, the real-session tests or the settings model (searched all six files for each term, zero hits). Five iterations at medium effort were enough for the eight questions but not for the reading list.
8. **Sibling overlap not stated.** R3 sits on sibling R10's ground (session-aware preference, deferred behind a replay) and R2 next to sibling R1 and R4 (fallback reach and wording). Neither is cited, so the reader cannot tell what is new. The brief asked for that.
9. **The citation ledger checks resolution, not content, for 111 of 120 citations.** Section 14 says so honestly. The nine that were opened are the ones I also found accurate, apart from the `decisions-history.ts:12-27` range noted under R1.
10. **Single lens, stated.** The synthesis names this itself. This review is a second read by the same model family, so it narrows that risk but does not remove it.

---

## 5. What I Could Not Check

| Not checked | Why | What would confirm it |
|-------------|-----|-----------------------|
| What the hook emits for "fix that too" end to end | Running a hook writes diagnostic and receipt state, outside my one allowed write | Pipe the prompt to the Claude hook in a scratch state dir and read `additionalContext` |
| Why the threshold env has no effect (N1) | Needs a daemon restart | Restart the daemon with the variable set and re-run the probe |
| Whether pi-cache-optimizer's compression applies in a live Pi session | No Pi session available to me | Capture one Pi system prompt and look for the `<available_skills>` block |
| Whether OpenCode's system-prompt injection costs cache hits | Needs provider cache counters | Compare cache-read tokens on two consecutive prompts with different briefs |
| How often the unhandled catch fires | The diagnostics file is runtime state I did not read | Count `fail_open` rows with `errorCode: UNKNOWN` |
| The single-winner benchmark numbers against raw data | Read from the doc, not recomputed from `relevance-methods-raw.json` | Recompute hit rate and latency for the `choice-shortlist` records |
| Cost of a two-option `choice` through `cli-jev` | No billable call made | One gated call, read `usage` |
| V20 (`allowed-tools` as the static floor) and iteration 4's findings on Code Mode pull behaviour | Not opened beyond the MCP configs and the tool count | Read `mcp-code-mode/mcp-server/index.ts:245-290` against iteration 4 |
| Whether the Codex adapter shares the Claude handler | Only `.codex/hooks.json:53` was read, which points at a built spec-kit adapter | Read `system-spec-kit/runtime/hooks/codex/user-prompt-submit` source |
| The `acceptable` label design for R8 | Judgment, not code | A second labeller on twenty rows |
