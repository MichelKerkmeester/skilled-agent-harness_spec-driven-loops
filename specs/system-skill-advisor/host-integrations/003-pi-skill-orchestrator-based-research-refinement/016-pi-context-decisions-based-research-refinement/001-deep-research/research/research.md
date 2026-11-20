# Research Synthesis: pi-context-decisions Mechanisms Against System Skill Advisor

This synthesis covers a single-lineage `/deep:research` run on 2026-11-18. Claude Opus 5.5 ran 5 iterations at medium effort through cli-claude-code on the operator's second Claude account. The orchestrator checked every verdict against the code. Three iteration claims were corrected by checks that the iterations could not run, and section 14 lists them.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Scope, Method and Inputs](#2-scope-method-and-inputs)
- [3. RQ1 Decision Model Versus Local Scorer](#3-rq1-decision-model-versus-local-scorer)
- [4. RQ2 Additive Per-Branch Advertising](#4-rq2-additive-per-branch-advertising)
- [5. RQ3 Context Beyond the Prompt](#5-rq3-context-beyond-the-prompt)
- [6. RQ4 Thresholds, Caps and Calibration](#6-rq4-thresholds-caps-and-calibration)
- [7. RQ5 Allowlists and Pins](#7-rq5-allowlists-and-pins)
- [8. RQ6 Failure Modes](#8-rq6-failure-modes)
- [9. RQ7 Tool and MCP Filtering](#9-rq7-tool-and-mcp-filtering)
- [10. RQ8 Observability](#10-rq8-observability)
- [11. Recommendations](#11-recommendations)
- [Eliminated Alternatives](#eliminated-alternatives)
- [Divergence Map](#divergence-map)
- [12. Open Questions](#12-open-questions)
- [13. Proposed Refinement Phases](#13-proposed-refinement-phases)
- [14. Citation Verification Ledger](#14-citation-verification-ledger)
- [15. Evidence Quality and Caveats](#15-evidence-quality-and-caveats)
- [16. References](#16-references)
- [17. Convergence Report](#17-convergence-report)

---

## 1. Executive Summary

Most of what pi-context-decisions does does not transfer. The reason is structural. The extension replaces or withholds an advertisement: it rewrites Pi's native skills section and can hide a tool. The advisor adds one hint on top of a skill list the host still shows in full. Additive-only advertising, pins, the inventory floor, fail-closed by name and tool filtering all exist to protect a list that can lose entries, and the advisor's list never does.

What transfers is measurement, observability and one failure-visibility fix:

- **ADOPT** a design rule for any history view: show what was recorded when the brief was emitted, and mark gaps `unknown`, never a re-score (R1).
- **ADAPT** a visible fallback on the crash path in the Claude and Pi hooks. Today a crash is silent to the model there, while a timeout is visible. The OpenCode plugin already does this right and is the pattern to copy (R2).
- **ADAPT** a weak-follow-up guard, gated on a benchmark. A live probe shows "fix that too" gets a passing brief for both sk-code and sk-doc, at the 0.82 confidence floor, with no context (R3).
- **ADAPT** opt-in "why" fields (confidence, uncertainty, dominant lane) under `SKILL_ADVISOR_DEBUG` (R4).
- **ADAPT** a floored-confidence count in diagnostics, because the 0.82 floor decides passes the way the extension's expectation score blurs its labels (R5).
- **ADAPT, research only** a shadow tie-break lane that asks a hosted decision model to score ambiguity clusters off the hook path, through the existing `cli-jev` route (R6).
- **ADAPT, smaller than proposed** churn measurement (R7) and an `acceptable` class in the routing corpus (R8). Both are narrower than the iterations claimed.

Fourteen ideas are rejected. The full table is section 11, and the reasons are in Eliminated Alternatives.

## 2. Scope, Method and Inputs

| Item | Value |
|------|-------|
| Source | `../context/pi-context-decisions-main/`, v4.2.2 |
| Advisor side | `.skilled/skills/system-skill-advisor/` runtime, hooks and references, `.opencode/plugins/system-skill-advisor.js`, `.skilled/skills/cli-classifier/cli-jev/` |
| Executor | cli-claude-code, `claude-opus-5-5`, `--effort medium`, `CLAUDE_CONFIG_DIR=/Users/michelkerkmeester/.claude-account2` |
| Iterations | 5, stop policy `max-iterations` |
| Questions | RQ1 to RQ8 from the phase `spec.md`, grouped into 5 strategy questions |
| Prior work excluded | The sibling pi-skill-orchestrator verdicts in `../../001-deep-research/research/research.md` |

How the run was dispatched (a deviation the operator approved):

- The cli-claude-code skill refuses to dispatch `claude` from inside Claude Code. The runtime enforces this through an ancestry guard.
- The operator approved overriding it to use the second account. The orchestrator ran each documented workflow step by hand, in the YAML's order, and started each dispatch detached through `dispatch-iteration.cjs`, so the guard did not see a Claude ancestor.
- `dispatch-iteration.cjs` forwards `configDir` only for review loops. The account was therefore set through `CLAUDE_CONFIG_DIR` in the detached process's environment.
- In iterations 1, 2 and 4, the headless leaf could not get its gateway call through the permission layer. Each time it wrote the iteration file, the delta and the event file, and the orchestrator appended the leaf's own `type:iteration` row through the append gateway. All five iterations then passed `verify-iteration.cjs`.

## 3. RQ1 Decision Model Versus Local Scorer

**Finding.** A hosted per-skill 0-to-2 score cannot replace the fusion scorer, though it could help in one narrow place.

- The extension marks a skill eligible when `score >= 2 * threshold` and caps the selection at 12 [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:23-25].
- At its default policy the benchmark kept about 10 of 30 skills, for tasks that need 3 or 4. That is precision 0.39 at recall 1.00 [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:173].
- Picker time ranged from 254 to 5,704 ms [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:124].
- The advisor brief pushes one route, or an ambiguous pair. Top-1 precision is its whole job, and its OpenCode hook budget is 3,000 ms [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts:28].

The narrow place is ambiguity clusters, scored off the hook path and logged, never shown to the model. A `semantic_shadow` seam whose weight is zeroed while not live already exists [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:363-368], and so does a shadow sink [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/shadow/shadow-sink.ts:1].

## 4. RQ2 Additive Per-Branch Advertising

**Finding.** The extension is additive because of where it injects, not because additive routing works better.

- It rewrites Pi's system-prompt skills section [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/runtime.ts:274], so retracting a skill would rewrite an earlier system section and break the cached prefix.
- The advisor injects into the newest user turn: the Pi hook appends to `event.text` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:356], and the Claude hook emits `additionalContext` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:446].
- So the advisor does not have the problem additive advertising solves.

Churn between prompts is unmeasured. The advisor dedups the directive text on a repeat [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121], but nothing reports how often the top skill flips within a session.

## 5. RQ3 Context Beyond the Prompt

**Finding.** Very short follow-ups do not route at all. Mid-length follow-ups route with no context, and the live probe confirms they can produce a confident, split brief.

- "continue" and "do it" fall under the prompt-policy floors [SOURCE: .skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json:84]. The live probe returned no recommendations for either, so the previous brief in history carries the route.
- "fix that too" fires through the work-intent path [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:182].
- Live probe, run by the orchestrator: the scorer returns sk-code and sk-doc, each with confidence 0.82, uncertainty 0.26 and dominant lane lexical, and `ambiguous: false`. Both pass the 0.8 and 0.35 bars. A three-word follow-up therefore yields a two-skill brief decided by the confidence floor, with nothing tying it to the session's task.
- "yes, apply the second option" returned no recommendation in the same probe.
- The extension sends up to 2,000 characters of the previous reply to the decision model [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/skill-picking.md:33].
- Feeding that text into the advisor's lexical lanes would pull them toward every skill the reply mentions, and it would break the exact-prompt cache key [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/prompt-cache.ts:33].

## 6. RQ4 Thresholds, Caps and Calibration

**Finding.** The advisor already has what the extension's benchmark asks for, except a per-model key.

- The defaults are 0.8 and 0.35, and each can be overridden through an environment variable [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:10-11] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/compat/contract.ts:25-35].
- The extension's own sweep puts the best threshold between 1.0 and 1.75 depending on the model [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:297]. For the Jev model our `cli-jev` route targets, F1 rises from 0.40 to 0.88 [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/docs/benchmarks/relevance-choice-vs-score.md:283]. So the extension's 0.375 default should not be copied anywhere.
- The advisor's confidence floor at 0.82 collapses evidence in the same way, and `ambiguity.ts` concedes it by dropping floored members from the margin cluster [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:29-32]. The section 5 probe shows the result.
- The advisor's calibration bench is stronger than anything in the extension: reliability buckets, ECE and a Brier/ECE tolerance gate [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:145-168].
- Abstain scoring already exists, contrary to iterations 1 and 5. `labeled-prompts.jsonl` holds 18 rows labeled `none`, and the eval ratchet counts `goldNoneFalseFire` [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:203]. Only the Gate 2 golden fixture lacks negative rows [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:1].

## 7. RQ5 Allowlists and Pins

**Finding.** Pins exist because filtering can hide a skill. The advisor never hides one.

The extension's pins skip scoring and the cap [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:76-78]. In the advisor, a pin would repeat a constant line on every prompt, which is the churn the directive dedup was built to remove [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:390-427]. The "always route X" need is already met outside the advisor, by the framework's Gate 2 artifact trigger.

## 8. RQ6 Failure Modes

**Finding.** The two systems mean opposite things by fail-closed and fail-open, and the advisor has one real gap.

- In the extension, fail-closed keeps only pins and unfilterable skills [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/apps/skill-filter.ts:68-74].
- An advisor that emits nothing already reaches that outcome. So the name does not transfer. What transfers is the question of which failure each policy hides from whom.
- The gap is the crash path:
  - **Claude:** the unhandled-exception catch returns `{}` after a diagnostic [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:468-479].
  - **Pi:** it sets `advisorFailed` and delivers nothing [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:323-333], while its timeout path does emit the fallback directive [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:309-313].
  - **OpenCode:** the plugin already pushes a visible fallback on its unhandled catch, inside its own try [SOURCE: .opencode/plugins/system-skill-advisor.js:1574-1596]. It is the pattern to copy.

## 9. RQ7 Tool and MCP Filtering

**Finding.** Our stack does not have the problem the tool filter solves.

Claude Code and OpenCode each register one MCP server, `code_mode` [SOURCE: .mcp.json:3] [SOURCE: opencode.json:22], with seven fixed meta-tools [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:245]. The 13 manuals' tools reach context only through a `search_tools` pull [SOURCE: .skilled/skills/mcp-code-mode/mcp-server/index.ts:281]. The extension says its own gate is "NOT a sandbox" [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/tool-filter.ts:8]. In our stack, access is decided by static permissions, not by a model score.

## 10. RQ8 Observability

**Finding.** After the fact, nothing can say why a skill surfaced.

- The extension's history marks each advertised skill with the score and threshold it was recorded with, and marks a missing value `unknown` instead of recomputing it [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/context/pi-context-decisions-main/src/extension/decisions-history.ts:12-27].
- The advisor's diagnostic record has `skillLabel` but no confidence, uncertainty, lane or session key [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50-64]. Persistence also strips `skillLabel` unless `SKILL_ADVISOR_DEBUG` is set [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:456-460].
- "Why" is therefore answerable only by re-running a prompt live.

## 11. Recommendations

> **Revised after the second-lens review.** A fresh Claude Fable 5.2 reviewer at medium effort checked this list against the code (`review-fable-5-2.md`). The orchestrator re-ran its load-bearing claims and confirmed them all. Read each row below together with these changes:
> - **R2 covers four runtimes, not two.** Pi, Vibe and DSH all load the Claude handler (`hooks/pi/prompt-advisor.ts:77`, `hooks/vibe/prompt-advisor.mjs:33`, `hooks/dsh/prompt-advisor.mjs:18`). One edit to the shared catch covers inner crashes on all four. Each adapter also has its own silent path to cover.
> - **R3 should use the routing head the hooks already store.** The Vibe adapter keeps a per-session head (`hooks/vibe/prompt-advisor.mjs:168-188`), and the guard can compare against it with no reply text. Plan it together with the sibling research's R10.
> - **R6 becomes a single-winner `choice` tie-break.** That benchmark arm reached precision 1.00 for four of five models, Jev included, in 201 to 758 ms (`relevance-choice-vs-score.md:126`, `:193-215`). It needs no per-model threshold. Only 4 calls were made per model, so this shows direction, not proof.
> - **The "suppress already-surfaced skills" rejection is weakened.** The Vibe head dedup already delivers nothing when the head repeats.
> - **The central thesis is too broad.** On Pi, `pi-cache-optimizer` (loaded at `.pi/settings.json:24`) compresses the skills section into an index once at least 4 skills exist (`.pi/extensions/pi-cache-optimizer/index.ts:204-209`). On OpenCode, the brief goes into the system prompt (`.opencode/plugins/system-skill-advisor.js:1566`, `:1671`), not the user turn.
> - **New N1, confirmed live:** with `SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD=0.99`, `advisor_recommend` still reports `confidenceThreshold: 0.8`. Section 6's "configurable per deployment" claim does not hold through the CLI.
> - **New N3, confirmed live:** a pasted earlier reply that names sk-doc and sk-git, placed in front of a refactor task, makes sk-doc the top skill at 0.95. The extension strips non-task envelopes before it scores, and the advisor only caps bytes.
> - **Section 5 correction:** "fix that too" passes three skills (sk-code, sk-doc and local-webflow, all at 0.82), not two.

Ranked by benefit for cost. "Lens" records whether one model family's reading needs a second opinion before the item becomes a phase (REQ-005).

| Rank | Verdict | Change | Benefit | Cost | Risk | Evidence | Lens |
|------|---------|--------|---------|------|------|----------|------|
| R1 | ADOPT (design rule) | Any advisor history or "why" view shows emit-time values and marks gaps `unknown` | Stops a re-score after a rebuild from passing as history | None until R4 is built | None | iter 2 f7; `decisions-history.ts:27` | Not needed, it is a rule |
| R2 | ADAPT | On the unhandled catch in the Claude and Pi hooks, emit `renderAdvisorTimeoutFallback()` inside its own try, as OpenCode does | The model can tell "advisor crashed" from "advisor off" | Two small hook edits plus tests | A render fault in the catch, which the inner try contains | iter 2 f3, iter 5 f2, orchestrator read of the OpenCode plugin | Confirmed in code, no second lens needed |
| R3 | ADAPT, gated | Benchmark follow-up pairs first. If they contradict, suppress the brief when a weak-path prompt's top pass sits on the confidence floor | Stops context-free follow-ups from steering away from the session's task | One benchmark and one policy branch | A terse real topic change gets no brief, the same outcome as "continue" today | iter 3 f4-f6, live probe in section 5 | Yes, the harm is inferred until the benchmark runs |
| R4 | ADAPT | Under `SKILL_ADVISOR_DEBUG` only, persist the top recommendation's confidence, uncertainty and `dominantLane` | After-the-fact "why" without the prompt text | Three optional fields on the diagnostic record | None for the default path, which stays prompt-free | iter 2 f6, `metrics.ts:50-64` | Not needed |
| R5 | ADAPT | Count passing top-1s whose confidence was floored, in diagnostics and in the calibration bench | Shows how often the floor, not the evidence, decides a pass | One counter | None | iter 1 f3, live probe | Yes, the size of the effect is unmeasured |
| R6 | ADAPT, research only | Shadow tie-break: score only ambiguity-cluster members with a decision model through `cli-jev`, off the hook path, and log to the shadow sink with a per-model threshold | Measures whether a model resolves ties better than lexical lanes | A daemon path, prompt egress, about $0.0002-0.0018 per call | Privacy, because the prompt leaves the machine. Needs operator consent | iter 1 f5-f6 | Yes, a design judgment from one family |
| R7 | ADAPT, narrowed | Measure the top-skill flip rate per session. This needs a non-identifying session key on the diagnostic record, which does not exist today | Learns whether churn matters before building anything for it | One field plus an offline script | A session key is new persisted data | iter 3 f2, corrected by orchestrator | Yes |
| R8 | ADAPT, narrowed | Add an `acceptable` class to the routing corpora, so an adjacent hit is scored apart from a wrong route. Abstain scoring already exists | Separates a near miss from a wrong route | Label work | Labels drift without a pinned inventory hash | iter 1 f7, corrected by orchestrator | Not needed |

Fourteen REJECTs: V1, V3, V6, V7, V9, V10, V12, V15, V18 and V19 from iteration 5's table, V20 (keep the static floor we already have, no work), and V14, V16 and V17, which were folded into R2, R4 and R1. See Eliminated Alternatives.

## Eliminated Alternatives

| Idea | Why rejected | Evidence |
|------|--------------|----------|
| Hosted model score replacing fusion | 0.39 precision at the default policy and up to 5.7 s latency, against a top-1 brief and a 3 s hook budget | Section 3 |
| One global normalized threshold | The best threshold varies by model, from 1.0 to 1.75 | Section 6 |
| Inventory floor of 8 | The advisor hides nothing, so there is no listing to protect | iter 1 f8 |
| Additive-only advertising | The cache problem it solves does not exist at a user-turn injection point | Section 4 |
| Suppressing already-surfaced skills | Compaction can drop the earlier brief, so the skill would be lost | iter 3 f3 |
| Previous-reply text in the lexical lanes | Pulls the lanes toward skills the reply merely mentions, and breaks the cache key | Section 5 |
| `failMode: "closed"` by name | The polarity inverts for an additive hint | Section 8 |
| Pinned always-surface set | No skill is hidden, so a pin is a constant line on every prompt | Section 7 |
| Tool and MCP advertisement filter | Seven fixed meta-tools, nothing to withhold | Section 9 |
| Relevance-scored call gate | A model score should never decide access | iter 4 f4 |
| Operator warning per failed decision | R2 covers the gap through the model, and the fail-open rate covers outages | iter 2 f4 |

## Divergence Map

- Saturated directions: none. Each iteration took a new research question, and newInfoRatio fell from 0.88 to 0.45 only in the consolidation pass.
- Pivots taken: none. The divergent mode was not enabled.
- Pivot failures and audited overrides: none.
- Remaining frontier: whether the skill listing the host injects makes parts of the advisor brief redundant (deferred in iterations 4 and 5).

## 12. Open Questions

- Do weak follow-ups contradict the session's route often enough to matter? R3's benchmark decides it.
- How many tokens do the seven Code Mode tool schemas cost in a fresh session? This would turn the "no saved tokens" claim in section 9 into a measurement.
- Is the brief partly redundant with the host's own skill listing? This is the remaining frontier.
- Which recommendations does the operator adopt? Decided after this synthesis.

## 13. Proposed Refinement Phases

Only once the operator adopts them:

1. `002-crash-path-fallback` for R2, with R1 as the governing rule. Smallest and fully confirmed, so it goes first.
2. `003-advisor-why-diagnostics` for R4 and R5 together. Both touch the diagnostic record and the calibration bench.
3. `004-follow-up-routing-benchmark` for R3. Benchmark first; the guard ships only if the benchmark shows harm.
4. R6, R7 and R8 stay as research or backlog until 2 and 3 land, because each needs either egress consent or a new persisted field.

## 14. Citation Verification Ledger

| Check | Result |
|-------|--------|
| Every `[SOURCE: path:line]` tag across `iterations/iteration-001.md` to `iteration-005.md`, deduplicated | 120 unique citations, 120 resolve (file exists, line in range), 0 failed |
| Content check of each citation behind an ADOPT or ADAPT | Opened by the orchestrator: `user-prompt-submit.ts:466-480`, `prompt-advisor.ts:305-336`, `render.ts:666-675`, `metrics.ts:50-64`, `contract.ts:10-35`, `fusion.ts:363-368`, `ambiguity.ts:29-32`, `decisions-history.ts:12-27`, `skill-filter.ts:23-25,68-78` |
| Correction 1 (V5, iterations 1 and 5) | "The golden fixture has no negative controls" is true only of `gate2-golden-prompts.jsonl`. `labeled-prompts.jsonl` has 18 `none` rows, scored by `scorer-eval-baseline-ratchet.vitest.ts:203`. R8 was narrowed to the `acceptable` class |
| Correction 2 (V8, iteration 3) | "Compute the flip rate from existing records" fails. `AdvisorHookDiagnosticRecord` has no session key (`metrics.ts:50-64`). R7 now names the field it needs |
| Correction 3 (V13, iteration 5's open question) | The OpenCode plugin does not share the silent crash path: it emits a fallback at `system-skill-advisor.js:1574-1596`. R2 scope is Claude and Pi only |
| Live probes the leaf could not run | `advisor_recommend` on four follow-ups (section 5). Output read and recorded |

## 15. Evidence Quality and Caveats

- **One model family.** Every verdict came from Claude Opus 5.5 at medium effort, and the orchestrator is the same family. Section 11's Lens column names the verdicts that need a second family or a measurement before they become phases: R3, R5, R6 and R7.
- **The extension's benchmark is small.** It covers 4 tasks, 2 trials and 5 models, and the document says itself that it is descriptive, not statistical. Section 3 cites it for direction, not for magnitude.
- **The probes ran the scorer, not the hook.** `advisor_recommend` does not run the prompt-policy gate. "fix that too" fires the gate by code trace, but the probe output is what the scorer would emit, not a captured hook turn.
- **Permission layer.** In 3 of 5 iterations the leaf's gateway call was refused. The orchestrator appended the leaf's own delta record unchanged, and `verify-iteration.cjs` passed all five.

## 16. References

- Phase brief: `../spec.md`, Research Brief anchor
- Iterations: `iterations/iteration-001.md` to `iteration-005.md`
- Deltas: `deltas/iter-001.jsonl` to `iter-005.jsonl`
- Resource map: `resource-map.md`
- Sibling research: `../../../001-deep-research/research/research.md`

## 17. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: RQ2 additive advertising and brief churn, RQ3 previous-reply context (0.83); run 4: RQ7 tool and MCP filtering (0.75); run 5: consolidation of RQ1-RQ8 verdicts (0.45)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores and checkpoint metrics are experimental and omitted from the live report.
