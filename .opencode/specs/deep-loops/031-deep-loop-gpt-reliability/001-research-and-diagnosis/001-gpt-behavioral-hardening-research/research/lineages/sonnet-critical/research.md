# Research Synthesis: Critical Re-Review of GPT Behavioral Hardening Research (sonnet-critical)

Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research`

Lineage artifact dir: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/research/lineages/sonnet-critical`

Stop reason: `maxIterationsReached`. Iterations completed: 10/10. Questions answered: 9/9 (KQ-CRIT-1 through KQ-CRIT-9). Sibling lineage: `glm-critical`. Prior round: `glm-max`, `gpt-fast-high` (30/30 iterations each).

> This is the operator-directed critical re-review round (`research-prompt.md` §9). Per §9.1, the operator has directly, personally experienced all four reported symptoms (GPT is slow as `@orchestrate`, invokes the wrong sub-agent, gets stuck on pre-defined flows, overthinks/needs literal instructions) — this is CONFIRMED first-hand evidence, not a hypothesis, and this synthesis does not re-litigate whether the problem exists.

## 1. Executive Summary

The prior round's evidence was accurately sourced but under-leveraged: every correction in this round comes from reading a citation both prior lineages already had more completely, or connecting two citations neither lineage cross-referenced against each other — not from finding fabricated or misattributed evidence (§8, citation audit). Two of the prior round's findings are **materially strengthened**: Mode D moves from an inferred hypothesis to a confirmed-in-at-least-one-instance mechanism with an exact cited cause (the Phase 0 "GENERAL AGENT REQUIRED" self-check, verbatim-matched to a real phase-005 failure), and the KQ5 enforcement-plugin feasibility claim gains its actual load-bearing technical mechanism (`tool.execute.before`), previously argued only by analogy. One high-confidence, "full agreement" recommendation is **corrected**: KQ4's literal "orchestrate dispatches `@deep` and STOP" violates orchestrate's own documented nesting-depth cap; a corrected, NDP-safe registry-reuse fix preserves the same intent. One recommendation is **precisified from a soft hygiene fix into a hard precondition**: the ai-council "naming drift" is a code-traced, deterministic validator bug that must be fixed before any GPT-vs-Claude benchmark's ai-council leg is interpretable. KQ9's "wait, do not unpark FIX-5 yet" verdict **survives** this round's self-assessment-bias check — it is independently reached by the non-GPT `glm-max` lineage and is reinforced, not weakened, by this round's own findings (FIX-5 would not even fix 2 of the operator's 4 confirmed symptoms).

## 2. Confirmed / Sharpened / Overturned — per original KQ

| KQ | Prior consolidated verdict | This round's verdict | Disposition |
|---|---|---|---|
| KQ1 | 8-run external-shell harness needed | Claude/native leg does not require the external shell; only the GPT leg does. Benchmark also needs a failure-classification schema addition (§6). | SHARPENED |
| KQ2 | Mix: mis-routing + Mode D (glm-max only) + latency | Mode D upgraded from inferred to confirmed-in-at-least-one-instance, with exact mechanism cited | SHARPENED |
| KQ3 | Keep ai-council `mode: all`; fix naming drift | "Naming drift" is a code-traced emitter/validator self-contradiction in one file, not registry-vs-YAML; "do not convert" itself unchanged | SHARPENED |
| KQ4 | Orchestrate dispatches `@deep` and STOP | Literal Task-dispatch reading violates orchestrate's own NDP depth cap; corrected fix supplied; an alternative session-handoff reading may be NDP-safe (ambiguity itself is now a named finding) | OVERTURNED (literal reading) |
| KQ5 | Feasible detection-only plugin | Actual hook (`tool.execute.before`) now cited; fail-closed-vs-mutate-only is a named open question, previously asserted as settled | SHARPENED |
| KQ6 | 4x2 benchmark, route-proof + latency | Two preconditions added: ai-council validator fix, Mode D failure-classification bucket | SHARPENED |
| KQ7 | `deep.md` pattern → routing surfaces only | Confirmed; reinforced with a concrete counter-example (Phase 0 self-check) the pattern would fix | CONFIRMED |
| KQ8 | orchestrate.md, 4 command YAML seams, ai-council YAML, plugin surface | Adds the 8 command `.md` Phase-0 self-check blocks as a propagation target | SHARPENED |
| KQ9 | Wait; unpark only on negative-gate | Confirmed, and confirmed NOT primarily GPT-bias-driven (independent glm-max convergence); reinforced by a coverage argument; "gate cannot fire" residual downgraded in severity | CONFIRMED (bias-checked) |

## 3. Where gpt-fast-high's Framing Was Self-Protective (charter §9.2)

- **Executive Summary hedge**: "the operator's real-world symptoms are enough to keep the problem active, but they are not yet a route-proof failure artifact" [gpt-fast-high/research.md:11] uses a narrow, validator-level evidentiary bar (route-proof artifact) to gate a broad decision (whether to treat the operator's confirmed problem as real/urgent), rather than separating "is this real" from "how big is this" the way glm-max explicitly does (Mode D: "CONFIRMED-in-mechanism, INFERRED-in-magnitude").
- **"Phase 005 did not prove the agent-layer fix works... failed before real leaf dispatch"** [gpt-fast-high/research.md:11] is technically accurate but launders a 4/4 FAIL result table into "did not prove... works" framing — passive, absence-of-success language rather than "failed on every attempted mode." Both prior lineages inherited "inconclusive" from the packet's own upstream framing (`research-prompt.md` §2) without re-deriving it from the source table (`verification-smoke.md` §6), which records `FAIL` and `FAIL/BLOCKED` explicitly, not "inconclusive."
- **`stuck_latency` as a catch-all failure class** [gpt-fast-high/research.md:43] conflates "halts on a misread advisory gate" (Mode D) with generic slowness, avoiding the more specific, more damaging (to GPT's reliability narrative) diagnosis glm-max's Mode D hypothesis reaches toward — and this round confirms with a concrete instance (§4).

This bias operates on **framing and emphasis of accurate evidence**, not on evidence fabrication — see §8's citation audit. The correct characterization for the final packet-level synthesis is "under-leveraged accurate evidence," not "unreliable research."

## 4. Mode D — From Hypothesis to Confirmed Instance

Every one of the 8 `/deep:*` command entrypoint files (`research`, `review`, `context`, `ai-council`, `skill-benchmark`, `agent-improvement`, `model-benchmark`, `ai-system-improvement`) opens with an identical-shaped "Phase 0: @GENERAL AGENT VERIFICATION" self-check: "Are you operating as the @general agent?" with fuzzy multi-bullet indicators, and "IF NO or UNCERTAIN: HARD BLOCK." [SOURCE: .opencode/commands/deep/research.md:39-72; .opencode/commands/deep/review.md:25-58] This is exactly glm-max's Mode D definition — soft advisory command-prose functioning as a hard, model-administered gate.

Phase 005's own results table records the `research` mode's failure as: "Halted at Phase 0... FAIL: `GENERAL AGENT REQUIRED failure`" [SOURCE: 005-gpt-verification-smoke/verification-smoke.md:119] — the literal `STATUS=FAIL ERROR="General agent required"` string this exact Phase 0 block returns [research.md:71]. **One of phase 005's four already-observed GPT dispatch failures is a directly-confirmed, already-fired instance of Mode D**, not an inferred mechanism awaiting future measurement. Causation is very likely (the error string is specific and appears nowhere else as a failure label; no transcript is available to prove the model's actual reasoning at that step, so this is stated as "very likely," not "certain").

glm-max's own citation for Mode D (`loop_protocol.md:166-180`) is, on direct re-read, about convergence/quality-guard/pause-sentinel logic — a different, more abstract mechanism, not the Phase-0 self-check. glm-max's intuition was correct; its evidence citation pointed at the wrong section.

**Concrete fix** (see §7, Deliverable 1): replace the self-assessment question with a deterministic dispatch-context signal, applied identically across all 8 command files — a new, concrete KQ8 propagation target neither prior lineage named.

## 5. The ai-council Route-Proof Bug Is Code-Traced, Not a Registry Drift

Both prior lineages describe the bug as registry-vs-YAML naming drift [gpt-fast-high/research.md:61; glm-max implies the same]. Direct reading of `deep_ai-council_auto.yaml:95-140` shows the workflow's own emitter (`step_build_session_state`, :117-118: `mode: ai-council, target_agent: "@ai-council"`) already correctly matches `mode-registry.json` (:66,71). The actual bug is 15 lines later, in the SAME step's `post_dispatch_validate.route_proof` block (:132-136: `mode: council, target_agent: deep-ai-council`) — the workflow's own validator disagreeing with its own emitter, inside one file.

Tracing the actual comparator function, `validateRouteProofRecord` [SOURCE: .opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665], confirms this is not a probable mismatch but a guaranteed one: `record.mode !== routeProof.mode` evaluates `'ai-council' !== 'council'` → `true`, for any executor. **This means the planned KQ1/KQ6 GPT-vs-Claude benchmark's ai-council leg is currently uninterpretable** — it would record a route-proof FAIL for both models regardless of behavior, and this failure would be misattributed to model reliability rather than a pre-existing harness bug. This must be fixed before phase 010's benchmark runs the ai-council leg (see §7, Deliverable 2).

## 6. KQ6 Benchmark Design — Two Preconditions Added

Both prior lineages' KQ6 answer (4 modes x 2 models, route-proof + latency) is sound in shape but would currently produce misleading results without:

1. **The ai-council validator fix (§5, Deliverable 2)** — otherwise the ai-council leg's route-proof FAIL is a harness artifact, not a model signal, for both legs.
2. **A failure-classification schema distinguishing Mode D (Phase-0 self-check) from route_mismatch/missing_artifact** — otherwise a Mode D failure (fixable cheaply, §4) gets counted as unresolved GPT unreliability, the same conflation `stuck_latency` already produced in the prior round.

## 7. Implementation-Ready Deliverables

**Deliverable 1 — Mode D fix.** Replace the Phase 0 self-assessment gate in all 8 `/deep:*` command files with a deterministic dispatch-context check (was this file invoked directly as a command, or handed to a sub-agent via Task delegation?) rather than a fuzzy self-classification question. Full proposed replacement text: `iterations/iteration-007.md` Deliverable 1.

**Deliverable 2 — ai-council validator fix.** In `deep_ai-council_auto.yaml:132-136`, change `route_proof.mode`/`target_agent`/`resolved_route` to mirror the emitter block at `:117-118` exactly (`mode: ai-council`, `target_agent: "@ai-council"`). A 4-line value change, zero structural risk. Sequence before the KQ1/KQ6 benchmark.

**Deliverable 3 — Orchestrate deep-routing fix (NDP-safe, supersedes the literal KQ4 wording).** Add a deterministic routing rule to `orchestrate.md` §2: resolve `workflowMode`/`target_agent`/`artifactRoot` by reading `mode-registry.json` directly (the same table `deep.md` §0 uses — read `deep.md` as reference, do NOT Task-dispatch `@deep`, which is `mode: primary`, not a depth-1 LEAF target, and would create an illegal `Orch(0) → Sub-Orch(1) → @leaf(2)` chain per orchestrate.md's own documented ILLEGAL NESTING examples), then dispatch the resolved LEAF agent directly at Depth 1. Full text: `iterations/iteration-007.md` Deliverable 3. Note (iteration 9 self-check): an alternative reading of the prior round's recommendation — `@deep` as a session-level handoff rather than a Task dispatch — may not violate NDP; this fix is NDP-safe under either reading and the implementation phase should pick one explicitly.

**Deliverable 4 — Sequencing correction.** Within phase 008, land Deliverable 2 (ai-council validator, zero-risk) and Deliverable 1 (Mode D, targets a confirmed-fired failure) before Deliverable 3 (corrects an unexercised recommendation) and well before phase 010's benchmark.

## 8. Citation Audit (KQ-CRIT-9)

Every citation this round independently re-read against its source — `verification-smoke.md:117-124`, `decision-record.md:22`, `cli-opencode/SKILL.md:319`, `research.md:39-72`/`review.md:25-58`, `deep_ai-council_auto.yaml:117-118,132-136`, `mode-registry.json:60-80`, `orchestrate.md:44-45,120,148`, `deep.md:4,51-59,77`, `post-dispatch-validate.ts:619-665` — checked out as accurate at the cited range. No correction in this round required identifying a fabricated or misattributed citation from either prior lineage. The self-assessment bias this round was charged with correcting operates at the level of *conclusion-drawing from accurate evidence*, not evidence integrity.

## 9. Adversarial Self-Check of This Round's Own Findings (iteration 9)

Applying the same skepticism used against the prior round to this round's own output: Findings on the native/Claude baseline (§ referenced in iter 2/6) are downgraded from "solved" to "a directionally informative partial check" (dispatch mechanism, not just model, changes when substituting `cli-claude-code`/native for `cli-opencode`). This lineage's own clean execution as incidental evidence is downgraded to "suggestive corroboration," not proof (one mode, one executor tuple, different packet than phase 005's). The KQ4 NDP-violation claim (§ Deliverable 3) is downgraded from a certain defect to "certain under the Task-dispatch reading, unresolved under an alternative session-handoff reading" — the proposed fix is unaffected either way. Mode D causation (§4) is downgraded from "proven" to "very likely" (no transcript evidence available). Findings on the ai-council validator, plugin hook mechanism, citation audit, and KQ9 bias-check survive this pass unchanged.

## 10. Residual Risks Carried Forward (updated from consolidated `research.md` §4)

- **Gate runnability**: downgraded from "entire 010-012 chain unreachable without external shell" — only the GPT leg needs it; the Claude/native leg is runnable now (§ iter 2/6).
- **ai-council benchmark validity**: NEW residual — the KQ1/KQ6 benchmark's ai-council leg is uninterpretable until Deliverable 2 lands.
- **Mode D magnitude**: still unmeasured across all modes/models (only the research-mode instance is confirmed); the KQ6 benchmark, with the failure-classification addition (§6), remains the measurement path.
- **KQ4 NDP-safe-vs-unsafe reading ambiguity**: the implementation phase must pick an explicit reading (Task-dispatch vs. session-handoff) for any future `@deep`-involving proposal, not just adopt Deliverable 3 by default.
- **Plugin fail-closed capability**: `tool.execute.before` is confirmed to exist and to expose mutable `args`; whether a plugin can actually reject (not just rewrite) a dispatch is unconfirmed from the type surface alone.
- Mis-route taxonomy (A/B/C) and FIX-1…FIX-5 ranking remain operator-asserted axioms, unchanged from the predecessor research and out of this round's scope.

## 11. Convergence Report

- Stop reason: `maxIterationsReached` (stop policy = max-iterations; 10 of 10 completed). Convergence signals were treated as telemetry only throughout, per charter §9.4.
- Iterations completed: 10 of 10.
- Questions answered: 9/9 (KQ-CRIT-1 through KQ-CRIT-9), each with file:line citations.
- newInfoRatio trend: `0.85 -> 0.75 -> 0.80 -> 0.65 -> 0.70 -> 0.55 -> 0.45 -> 0.35 -> 0.30 -> 0.10`.
- No stuck recovery, no blocked stops, no salvaged iterations.
- Self-adversarial check (iteration 9) applied against this lineage's own findings, symmetric to the pressure applied against the prior round.

## 12. References

- `research/research.md` (consolidated synthesis of the prior round)
- `research/lineages/glm-max/research.md`, `research/lineages/gpt-fast-high/research.md`
- `research-prompt.md` §9 (this round's charter)
- `../001-deep-agent-router-and-orchestration/research/research.md` §0, §5, §8b
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/005-gpt-verification-smoke/verification-smoke.md:117-131`
- `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/006-host-hard-identity-fix5/decision-record.md:18-38`
- `.opencode/agents/deep.md`, `.opencode/agents/orchestrate.md:38-230`, `.opencode/agents/ai-council.md:1-10`
- `.opencode/commands/deep/research.md:1-90`, `.opencode/commands/deep/review.md:25-60`
- `.opencode/commands/deep/assets/deep_ai-council_auto.yaml:95-140`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:60-80`
- `.opencode/skills/cli-opencode/SKILL.md:16,175,271,310-420`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:619-665`
- `.opencode/plugins/README.md`; `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:195-317`

---

*Synthesis by the sonnet-critical fan-out lineage (cli-claude-code / claude-sonnet-5 / reasoning high) from 10 fresh-context iterations, stop policy max-iterations per operator-directed charter §9.4. Sibling lineage: glm-critical. Iteration narratives in `iterations/`; structured deltas in `deltas/`; state log in `deep-research-state.jsonl`.*
