# Iteration 7 — Mode D: confirm the smoking-gun, stress-test it as a redundant gate

**Focus:** KQ-OPUS-7 — Independently verify the Phase-0 self-check ↔ phase-005 failure match, and pressure-test whether the self-check is a *necessary* gate or a redundant one that only creates a halt risk.

## What was read (this iteration)

- `.opencode/commands/deep/research.md:19-72` — the EXECUTION PROTOCOL and Phase 0 `@GENERAL AGENT VERIFICATION` self-check
- `verification-smoke.md:119` — the research-mode failure row

## Finding 1 — Mode D confirmed from source (independent)

`commands/deep/research.md:44-71` embeds a model-administered self-classification gate:

```
SELF-CHECK: Are you operating as the @general agent?
├─ INDICATORS that you ARE @general agent: [3 fuzzy capability bullets]
├─ IF YES (all indicators present): general_agent_verified = TRUE → continue
└─ IF NO or UNCERTAIN:
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

Phase 005's research-mode row: "Halted at Phase 0 … FAIL: `GENERAL AGENT REQUIRED failure`; YAML not reached" (`verification-smoke.md:119`). The failure label is the literal `ERROR="General agent required"` string this block returns (`research.md:71`). So one of phase 005's four GPT failures is a **directly-fired instance** of glm-max's "Mode D" (soft advisory prose read/administered as a hard gate). I confirm sonnet-critical's smoking-gun from the same two sources. Causation is very likely, not certain (no transcript of the model's actual reasoning at that step). [SOURCE: .opencode/commands/deep/research.md:44-71; 005-gpt-verification-smoke/verification-smoke.md:119]

## Finding 2 — The self-check is redundant with the router, so it is pure downside for a literal model

New pressure this lineage adds: is the Phase-0 self-check load-bearing? The command's own text says it "orchestrates the deep-research loop" and is "general-agent based" (`research.md:37,64`). But the actual routing/identity resolution is done by `deep.md` (registry lookup + agent-definition load, iter 4). The Phase-0 self-check does not *route* anything — it asks the model to self-attest a role it already has by virtue of having been invoked. For a native/general dispatch it is a no-op ("yes I can run Read/Write/Bash" → TRUE). For a literal, self-doubting model (GPT) it is a coin-flip halt on fuzzy indicators ("UNCERTAIN → HARD BLOCK"). So the gate contributes **no routing value and a nonzero halt probability** — asymmetric downside. That strengthens the case for Deliverable 1 (replace self-classification with a deterministic dispatch-context signal): it is not just "make the gate more literal," it is "the gate as written can only hurt, because the thing it checks is already guaranteed by invocation."

## Finding 3 — Propagation is all 8 command files, but priority is the 4 runtime modes

sonnet-critical noted the self-check appears in all 8 `/deep:*` command files. I confirm the shape is identical in `research.md:39-72`. Prioritization: the operator symptoms name the 4 runtime-loop modes (research/review/context/ai-council); the improvement-family 4 (skill-benchmark/agent-improvement/model-benchmark/ai-system-improvement) share the pattern but are lower priority (glm-max `:113` deferral). Fix all 8 in one pass (identical edit) but gate acceptance on the 4 runtime modes.

## Ruled out this iteration

- Treating the Phase-0 self-check as a necessary safety gate whose only flaw is fuzziness — RULED OUT; it is redundant with `deep.md`'s registry routing and provides no routing value, so it is pure halt-risk for a literal model. Replace, don't merely tighten.

## Status

`insight` — confirms Mode D and adds the redundancy argument that makes the fix unambiguously net-positive.

newInfoRatio: 0.45 — novelty: confirmation of the smoking-gun plus a new "no routing value → pure downside" argument for why the deterministic replacement strictly dominates.
