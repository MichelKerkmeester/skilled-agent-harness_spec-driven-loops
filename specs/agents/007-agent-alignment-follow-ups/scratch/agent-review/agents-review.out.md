There is substantial real improvement available, and most of it is correctness of the workflows, not wording: seven of the eleven agents carry at least one instruction they cannot satisfy or two instructions that contradict each other. The largest share sits in three places: tool-call budgets that the mandatory steps exceed, completion and retry rules that disagree (`code`, `ai-council`, `orchestrate`), and `orchestrate` routing work to agents that will refuse or fail it. The house contract is part of the problem, because `sync-agent-roster.cjs --check` passes (`agent-roster: OK`, exit 0) on all of this: it checks headings, not behavior.

All paths below are under `.skilled/agents/` unless stated.

## context

- **High** — `context.md:79` "Read `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` directly." That file is 5.2 MB and 159,371 lines, so a Read cannot load it, and the agent's budget is 10-20 calls with ~4K tokens out. Fix: "Grep the index for the request's key phrases; never Read it whole."
- **Medium** — `context.md:206` "`rg --no-config --fixed-strings ...`" and `:209` "Exit `1` is a clean no-hit and exit `2` or higher is a broken invocation." Bash is denied (`:78`), and the Grep tool exposes neither exit codes nor `--json`. Fix: restate the recipe as Grep parameters and delete the exit-code line.
- **Medium** — `context.md:252` "Record #[ID]: [Title]" and `:355` "memory ID". Retrieval is lexical over files, so no IDs exist and the template invites invented ones. Fix: replace with `path:line`.
- **Low** — `context.md:268-272` "Status: `_No sub-agents dispatched (policy)_`" is a constant the caller cannot check, and nesting is restated in §0, §2, §6, §10 and §11. Fix: drop the section and §6.

## deep-research

- **High** — `deep-research.md:183` "Target 8-11 total tool calls, hard max 12." By my count the mandatory steps need 12 with no slack: three state reads, one existence check, three research actions, iteration file, record file, gateway, delta, verification. `:413` allows "Write outputs | 2-3 | 3" where four calls are mandatory. The workflow disagrees (`deep-research-auto.yaml:98` `tool_call_budget: { target: 12, max: 24 }`). Fix: take the budget from the workflow.
- **High** — `deep-research.md:196` "if Tier 1-2 recovery fails ... set status to `error`" contradicts `:168` "Use `error` only for unrecoverable state corruption, missing required control files, or write failures" and `:495` "report timeout status". The status drives the loop. Fix: change `:196` and `:404` to `timeout` or `stuck`.
- **Medium** — `deep-research.md:249` "Append the structured JSONL record." contradicts `:254` "never write `research/deep-research-state.jsonl` directly". Fix: "Record it through the gateway (Step 8)."
- **Medium** — `deep-research.md:257` requires `"timestamp":"ISO-8601","durationMs":NNNNN`, but no step measures either and the one Bash call is spent on the gateway. Fix: have the gateway stamp them.
- **Low** — Recovery tiers appear twice (`:193-196`, `:401-404`), write rules four times and verification twice, roughly 120 lines. `:43-53` explains convergence thresholds although `:30` says the workflow owns convergence.

## ai-council

- **High** — `ai-council.md:570` "record each `artifact_written` event through the append gateway (exit 0 receipt)" contradicts `:405` "Bash is denied here, so name each event in the report". Question 11 can never be YES, and `:569` then says "DO NOT CLAIM COMPLETION". Fix: Q11 becomes "artifact set written and every event named in order".
- **High** — `ai-council.md:739` "The LEAF council is the sole writer authority ... The dispatching parent does not write to council artifacts." The registry (`agent-registry.json:44`) tells `orchestrate` to run `persist-artifacts.cjs <packet>` "to persist `ai-council/` artifacts", and the command workflow persists each seat itself (`deep-ai-council-auto.yaml:169`). Fix: name one writer; if it is the helper, the agent returns the report only.
- **High** — `ai-council.md:685` "read the state log and resume from the next incomplete event" cannot work for the agent's own loop (`:678` "repeat from step 3"), because events are recorded by the caller only after it returns. `max_rounds` has no default in the file (`:652`). Fix: one round per invocation, with the caller owning the loop.
- **Medium** — `ai-council.md:16` `task: allow` on a registry LEAF, and `:63` "Otherwise, operate at Depth 0". A dispatch that forgets the marker gets fan-out. Fix: dispatch seats only when the prompt states operator invocation.
- **Medium** — `ai-council.md:110-111` list `cli-opencode` and `cli-claude-code` as vantages, but Bash is denied, and `:241` has each seat declare itself simulated. `:244` "Operate at temperature <TEMP>" cannot be set by a prompt. Fix: call them lenses and drop the temperature column.
- **Medium** — `ai-council.md:343` "required when seats are within 15 points; skip only when one seat leads by 25+" leaves 15-25 undefined, and `:380-381` leave 10-15 undefined. Fix: one threshold table.
- **Medium** — 816 lines against a 600 cap. §14, §16 and §17 describe scripts "this agent never runs" (`:748`) and a file move it cannot do (`:788`). Fix: move §12-17 into the deep-ai-council references and repoint the twelve citations.

## markdown

- **Medium** — `markdown.md:118` "BEFORE any state read or workflow step, this agent MUST emit one canonical BINDING line", including `:126` `BINDING: template=`. The template is only known after steps 4-5 read `sk-doc` and the packet file (`:205`). Fix: emit bindings after step 5.
- **Medium** — `markdown.md:252` "report `DQI=<manual-score>`". A scripted score and a self-assigned one look identical to the caller, and the scorer (`extract_structure.py`) is never named. Fix: name the command and report `DQI=<n> SOURCE=script|manual`, or `n/a` for non-markdown outputs.
- **Medium** — `markdown.md:170` "`memory` | Optional continuity save". No such tool is granted. Fix: delete the row.
- **Low** — `markdown.md:52-64` repeats the thirteen commands of the §5 table, plus the count at `:101`. Fix: "any command in §5".

## review

- **High** — `review.md:63` "LOAD STANDARDS still runs ... Max 5 tool calls." Loading takes at least four calls (two skill files, the resolver, `review-core.md`) plus three checklists "on every review" (`:198`), before any reviewed file is read. Fix: count the cap after the standards load.
- **Medium** — `review.md:386` "Skip in Fast Path mode" contradicts `:362` "Did I run adversarial self-check on all P0/P1 findings?" with `:364` "If ANY is NO → DO NOT SEND". Fix: add "or fast path" to question 6.
- **Medium** — `review.md:372` "LOW | Missing key verification steps | DO NOT send until fixed" has no exit when a gap cannot be closed, yet the output defines `low_confidence` (`:290`). Fix: send as `COMMENTED` with the gap on `Not checked:`.
- **Medium** — `review.md:250` "The mode's final-line checker fails a report where they disagree." The checkers exist and read stdin, and the agent has Bash, but no step runs them. Fix: pipe the report through both in step 7.
- **Medium** — No untrusted-content rule, although it reads PR diffs and runs `gh pr view` (`:103`) with Bash allowed. Fix: copy the sentence from `deep-review.md:92`.
- **Low** — The advisory score costs 19 lines (`:168-186`) and is declared non-deciding about ten times. `:229-233` define gate types `orchestrate` never sends.

## deep-review

- **High** — `deep-review.md:506` "Exceed tool budget (max 13 calls)". By my count the mandatory calls are at least 15: four state reads, two doctrine reads, three analysis actions, iteration file, strategy edit, record file, gateway, delta, verification. The workflow carries the same cap (`deep-review-auto.yaml:90`), so the contract itself is short. Fix: raise it in both, or inline doctrine and state in the dispatch.
- **Medium** — `deep-review.md:104` "BEFORE any state read" requires bindings for `maxIterations`, `convergence` and `dimensions`, which live in the config. Fix: emit after reading config.
- **Medium** — `deep-review.md:33` "Writable files are limited to the iteration artifact, strategy file, and JSONL state log" contradicts `:234` "never write `review/deep-review-state.jsonl` directly" and omits the delta file. Fix: reword.
- **Medium** — `deep-review.md:357` "Active `P0` exists or any binary gate fails" versus `:377` "FAIL when any active P0 remains". Fix: add gate failure to the mapping.
- **Low** — `:493` demands `noveltyJustification`, which the required list at `:236` lacks. `:394-398` and `:448` describe command-owned lifecycle.

## code

- **High** — `code.md:80` "NO internal retry. NO loop-fix." contradicts `:73` "`BLOCKED` means fix in place or escalate", `:205` "Continue fixing if in-scope" and `:426` "fails after the targeted in-scope fix". Fix: "one targeted in-scope fix after a failed verify, then return".
- **High** — `code.md:389` puts "Verification fails" under "Return BLOCKED", while `:319` says "verification failures with actionable fixes can still be retried" as ordinary `FAIL`. `FAIL` is never defined, and the circuit breaker counts `BLOCKED`. Fix: define both.
- **Medium** — `code.md:67` "escalate `UNKNOWN_ROUTE`" (also `:89`, `:130`, `:138`), but the return enum at `:328` only has `UNKNOWN_STACK`. Fix: one name.
- **Medium** — `code.md:28-37`: "HALT" without a marker, then "A direct operator invocation satisfies this gate ... no marker is required". The two cases look identical to the agent, so the gate never fires. Fix: delete it and keep "state packet and scope when no brief".
- **Medium** — `code.md:114` "Max 5 tool calls" against six mandatory ones.
- **Medium** — §6 gates PASS on a self-score of 70 while `:187` calls it "a communication aid". §8 (`:279-313`) defines gate types that `orchestrate.md` never names. Roughly 120 lines. Fix: delete §8 and reduce §6 to the severity table.

## debug

- **High** — `debug.md:351` "Same error? → Try next post-challenge hypothesis" never reverts the failed fix, so edits stack against `:335` "single fix at a time". `:350` restarts Phase 1 with no cycle bound. Fix: "revert first; stop after three rejected hypotheses in total".
- **Medium** — `debug.md:61` "ONLY @debug may create, edit, or replace `debug-delegation.md`", but the workflow scaffolds it (`speckit-implement.yaml:510`). `:631` makes writing it ALWAYS while `:339` and `:531` make it conditional, and no path is given. Fix: "update the file the handoff names; otherwise report only".
- **Medium** — `debug.md:419-421` pre-ticked "- [x] Tests pass" carries no command or exit code, against `:561` "actual output shown, not assumed". Fix: use the Command and Exit Code lines from `code.md:336-338`.
- **Medium** — The handoff to `@code` sits under "You receive structured input" (`:128-132`), and nothing says when to fix versus hand off. When it fixes, it skips the quality gate `code.md` requires. Fix: move the block to §7 and fix only when the dispatch allows it.
- **Medium** — `debug.md:139` "Ask for missing information" (a sub-agent cannot), two escalation templates (`:462`, `:535`), and `:153` "Max 5 tool calls" across five phases.

## design

- **High** — `design.md:24` "The agent's first job is knowing which of the four a request is", but the routing tree (`:53-75`) has two branches and `:171` offers "DECIDE, MEASURE, or both". Charts and diagrams appear only in the table at `:129-132`. Fix: add two branches and a short Step 2c.
- **Medium** — `design.md:87` "follow the prompt and report the conflict" contradicts `:192` NEVER "Write a Style Reference from a brief alone". Fix: exempt the NEVER rules.
- **Medium** — `design.md:64` routes "a change to an interface" here with write access, while `:134` says "`code` implements the values this agent decides". Routing against `@code` is ambiguous, and `:97` "hands the author gates to `sk-code-quality`" names no command. Fix: state which files it edits and name the command.

## prompt-improver

- **High** — `prompt-improver.md:53-54` deny Opus and Fable, and `:73` says such a model "must refuse". No agent pins a model (`README.txt:14`), and the workflow dispatches with none (`prompt_improve_auto.yaml:85`), so on those sessions the agent refuses its only job. Fix: move the table to the dispatcher, which passes the model.
- **Medium** — `prompt-improver.md:231` "TEST: <ran: summary of old vs new on 2-3 inputs | NOT RUN>" against `:40` "NEVER execute the prompt it constructs". The honest value is always NOT RUN. Fix: fix the field to NOT RUN here.
- **Medium** — `:102` names `@general-purpose` as primary caller and `:103` `/prompt-improve`; the registry says `/prompt:improve` and `orchestrate`. The INT-* table (`:98-108`) feeds no caller. Fix: rename and delete the table.

## orchestrate

- **High** — `orchestrate.md:80` routes "Evidence / iterative investigation" to `@deep-research` and `:140` says "dispatch that leaf at depth 1". That leaf hard-blocks without state files only the command creates (`deep-research.md:113-116`). `:233` "any of the 4 `@deep-*`/`@ai-council` agents" and "execution semantics": the registry has three modes and no execution field. Fix: route to the command and drop `execution`.
- **High** — Three retry ladders: `:602` "after 2 rejections", `:645-647` retry twice then reassign then escalate, `:661` "3 consecutive failures, 60s cooldown". Fix: keep one.
- **High** — `orchestrate.md:816` "13+ | MUST SPLIT" and `:833` "more than 12 tool calls ... STOP" against the agents' own budgets (context 10-20, markdown 8-25). A leaf that obeys the footer stops mid-task. Fix: take budgets from the agent files.
- **High** — `orchestrate.md:444` "Route ... spec-doc creation through `@markdown`" versus `:461` "The main agent writes spec-folder docs directly" and `:499` "REJECT output". Fix: choose one owner.
- **Medium** — `:152` "INCLUDE the agent file's content in the delegation prompt" while `:153` already loads it by name, so each child gets its definition twice. Fix: include only on the general-purpose fallback.
- **Medium** — `:781` has agents write to `scratch/`, which `context.md:43` forbids "even when the orchestrator asks".
- **Medium** — Unmeasurable gates: self-assigned "Quality score ≥ 70" (`:555`), "(2 min)" (`:687`), "Context approaching 80%?" (`:789`), and "50,000 tokens" (`:876`) against "~150K" (`:854`).
- **Medium** — Stale text: `:535` lists "@general-purpose, @review, @debug" as action agents, `:406` gives `@code` the review mode `code.md:129` excludes, and `:452` tells read-only leaves to run `/speckit:save`.

## Across agents

- **Budgets.** Fast-path "Max 5 tool calls" (`review`, `code`, `debug`), the deep-loop caps and the orchestrator's split rule are each below what the mandatory steps cost.
- **Self-attested output.** Pre-ticked checklists (`deep-research.md:549`, `deep-review.md:540`, `debug.md:419`), four separate 100-point self-scores and self-reported `durationMs` give the caller nothing it can check.
- **Canonical refusal.** The template says "All LEAF agents must use this exact string" (`agent-template.md:307`); two of ten do. Either require it or drop "all".
- **Untrusted content.** Only `deep-research` and `deep-review` carry the rule; `review`, `context`, `debug`, `code` and `ai-council` (which has WebFetch) do not.
- **Copied boilerplate.** The "Daemon-free retrieval" paragraph is in six files, and "Skip Layer 1" is in three files that have no Layer 1.
- **Size.** `orchestrate` 910, `ai-council` 816 and `debug` 648 lines against the 600 cap.

## First five changes

1. Set tool budgets from one source and remove the fast-path caps: leaves stop choosing between breaching the budget and skipping verification.
2. In `code.md`, state one retry rule, define `FAIL` versus `BLOCKED` and unify `UNKNOWN_ROUTE`: the orchestrator's retries and circuit breaker become deterministic.
3. In `ai-council.md`, name one persistence owner, fix Q11, run one round per invocation and move §12-17 out: the agent can finish, and loses about 250 lines.
4. In `orchestrate.md`, route deep work to the commands, keep one retry ladder and one spec-doc owner, and stop double-loading definitions: fewer dead dispatches and smaller child prompts.
5. Move model eligibility from `prompt-improver.md` to its dispatcher: the agent stops refusing its job on Opus and Fable sessions. The `design` chart and diagram branches are next.

## Not checked

- No agent was run; every behavior claim comes from reading, and the tool-call minimums are my count of the written steps.
- The `.claude`, `.codex` and `.pi` mirrors, beyond the tool lists shown in this session.
- The internals of `orchestrate-session.cjs` and `lib/persist-artifacts.cjs`; the two-writers finding rests on the registry note and one workflow line.
- The `sk-code-review`, `sk-design` chart and diagram, and `sk-prompt` reference files, beyond the lines grepped.
- The twelve skill files said to cite `ai-council` sections by number; I took the registry's word.
- `validate_document.py` and the other sk-doc validators were not run.
