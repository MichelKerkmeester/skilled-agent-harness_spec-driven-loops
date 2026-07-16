# GOAL PROMPT — GPT Behavioral Hardening: Follow-Up Research (Phase 007)

> Seeds a `/deep:research:auto` run in this spec folder. Target spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research`

---

## 1. OBJECTIVE

Determine what packet 031 still needs to prove or build to make GPT-backed OpenCode (GPT-5.5 high/fast) reliably invoke and execute deep-loop workflows the way Claude Sonnet/Opus does — correctly, promptly, without getting stuck on pre-defined flows or over-literal misreads. This is the follow-up to phases 002-006: those phases built and (inconclusively) tested an agent-layer fix; this research investigates what's still missing given real-world operator evidence that the underlying problem persists.

---

## 2. WHAT'S ALREADY ESTABLISHED (do not re-derive; cite and build on)

- Root cause: `subagent_type` is normalized to `"general"` for every custom-agent dispatch — specialized identity is only prompt-injected, never runtime-enforced (soft identity boundary). See `../001-deep-agent-router-and-orchestration/research/research.md`.
- Phases 002-004 (route-proof validation, `deep.md` primary router, `orchestrate.md` Deep Route field, pre-route headers) are code-complete and independently re-verified.
- Phase 005 (GPT verification smoke, the acceptance gate) is **inconclusive, not a clean pass**: 0/4 command-owned smokes reached a real leaf dispatch — all blocked upstream by `cli-opencode` self-invocation guards before actual routing behavior could be observed. The one path every phase-005 doc names as decisive — rerun the full smoke from a genuine external, non-OpenCode shell — was never taken.
- Phase 006 (host-hard-identity/FIX-5) stays Parked on that inconclusive evidence, not on proof the agent-layer fix works.
- `deep.md` (`mode: primary`, deterministic table lookup, 8-step routing workflow with only one judgment call) is materially more literal-model-safe than `orchestrate.md`'s Deep Route field, which requires GPT to self-derive `mode=`/`execution=` from a free-text Priority table that doesn't even list `deep-context`/`deep-review` as rows.
- `ai-council` is currently `mode: all` (directly invocable in OpenCode), not subagent-only.
- Operator symptom report (2026-07-01, real-world usage): GPT is very slow as `@orchestrate` primary agent; frequently fails to invoke the correct deep sub-agent; gets stuck on pre-defined flows (deep-loop commands especially, possibly others); overthinks and needs literal, deterministic instructions.

---

## 3. KEY QUESTIONS

**KQ1 — Decisive smoke evidence.** Can a genuinely external, non-OpenCode shell run of the full command-owned smoke (all 4 modes) be designed precisely enough for a follow-up implementation phase to execute and get a clean PASS/FAIL, instead of the infrastructure-blocked result phase 005 produced? What exactly needs to be true of the execution environment (no `OPENCODE_PID`, no nested self-invocation guard)?

**KQ2 — Real-world mis-route mechanism.** Given phases 002-004 are landed, what does the operator's reported symptom set (slow orchestrate, wrong sub-agent, stuck flows, overthinking) actually indicate is still broken? Is it the same class of mis-dispatch the research already named (modes A/B/C), a new mode, or a latency/UX issue distinct from mis-routing?

**KQ3 — `ai-council` subagent-only conversion.** Should `ai-council` convert from `mode: all` to subagent-only? What direct-invocation use cases would break? What's the safest migration path, and does it require `deep.md`/`orchestrate.md` changes too?

**KQ4 — `@orchestrate` hardening v2.** Can `orchestrate.md`'s deep-dispatch path delegate entirely to `deep.md` (single source of routing truth) instead of duplicating a judgment-dependent Deep Route field? What's the smallest edit that converts orchestrate's deep-routing from judgment-grade to table-lookup-grade, matching `deep.md`'s determinism?

**KQ5 — Sub-agent-enforcement plugin.** Is a genuine OpenCode plugin (hook-based, comparable to the `mk-goal` injection-plugin pattern from packet 032) feasible to structurally force correct sub-agent selection at dispatch time, rather than relying on prompt discipline? What's the mechanism, and where should it live — `system-skill-advisor`, or a new small plugin? What's in scope vs. out of scope relative to phase 006/FIX-5 (host hard identity)?

**KQ6 — GPT-vs-Claude behavioral benchmark.** What's a minimal, repeatable benchmark (latency + first-dispatch correctness across all 4 deep modes) comparing GPT-5.5 (high/fast) against Claude Sonnet/Opus, usable now as a baseline and later as a regression gate for any fix this research proposes?

**KQ7 — Literal-instruction-following pattern.** What concretely makes `deep.md` more literal-model-safe than `orchestrate.md`? Extract the generalizable pattern (deterministic table + single clarification-question judgment call vs. free-text inference) and identify which other commands/skills in the deep-loop family should adopt it.

**KQ8 — Propagation scope.** Beyond `orchestrate.md` and `deep.md`, which other commands/skills need the same hardening treatment? Enumerate concretely (file paths).

**KQ9 — FIX-5 unpark decision.** Given the operator's real-world evidence, should phase 006/FIX-5 unpark now, wait on KQ1's decisive smoke, or neither? State a clear decision criterion, not just a restatement of the existing (already-inconclusive) one.

---

## 4. RESEARCH BOUNDARIES

**In scope:** everything in KQ1-KQ9 above.

**Out of scope (cite prior research, do not re-derive):**
- The original mis-route root-cause taxonomy (modes A/B/C) — already established.
- Route-proof validator mechanics — already implemented and verified (phase 002... wait, phase numbering: the validator work is phase 002-route-proof-validation).
- Whether `deep.md`/orchestrate's existing Deep Route field syntax is well-formed — already verified in phases 003-004.

## 5. NON-GOALS

- Do not implement code in this research pass; produce a design + evidence-backed recommendations.
- Do not treat "phases 002-004 are complete" as sufficient without addressing why phase 005 never reached a real leaf dispatch.
- Do not over-constrain Claude — preserve its existing flexibility while hardening for GPT.

## 6. STOP CONDITIONS

- Do NOT converge early. Minimum 30 iterations. If a coverage/quality plateau is reached before iteration 30, actively change investigative angle (different KQ, different evidence source, adversarial re-check of an earlier conclusion) rather than stopping.
- Stop only when all of KQ1-KQ9 have evidence-backed answers with file:line citations, AND at least 30 iterations have completed.

## 7. EXPECTED SYNTHESIS OUTPUT

`research/research.md` should deliver, per KQ: a concrete recommendation, the evidence backing it, and an explicit residual-risk/deferral statement where applicable. Final section: a proposed phase breakdown (numbering continues from 007) for whichever of KQ3-KQ6/KQ8 warrant implementation phases, plus the KQ9 unpark decision.

## 8. SUGGESTED RUN CONFIG

Two independent lineages, both targeting this spec folder, neither allowed to converge before 30 iterations:

```
/deep:research:auto "GPT behavioral hardening follow-up for packet 031 -- see research-prompt.md in this spec folder" :auto \
  --executors='[{"executor":"cli-opencode","model":"zai-coding-plan/glm-5.2","reasoning":"max","label":"glm-max"},{"executor":"cli-opencode","model":"openai/gpt-5.5-fast","reasoning":"high","label":"gpt-fast-high"}]' \
  --max-iterations=30
```

Before launch: smoke-test that `--reasoning max` actually forwards to GLM-5.2 (per `sk-prompt-models/references/models/glm-5.2.md`, the `--variant`/`reasoning_effort` mapping is unverified) and that each lineage's `deep-research-config.json` has `antiConvergence.minIterations` raised to 30 (or `convergenceMode` handled) so neither lineage stops early — the default floor is 3.

Spec folder: `.opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research`

---

## 9. CRITICAL RE-REVIEW ROUND (operator-directed, 2026-07-01)

The first two lineages (`glm-max`, `gpt-fast-high`) completed and produced `research/research.md`. The operator has now reviewed it and flagged a real methodological flaw plus new first-hand evidence. This round exists to correct both.

### 9.1 Ground truth has changed — read this before anything else

**The operator has directly, personally experienced all four reported symptoms during real OpenCode usage: GPT is slow as `@orchestrate`, invokes the wrong sub-agent, gets stuck on pre-defined flows, and overthinks/needs literal instructions.** This is CONFIRMED first-hand operator evidence, not a hypothesis. Do **not** spend iterations re-litigating whether the problem exists, hedging with "not yet proven," "inferred not measured," or "awaiting external smoke evidence" language about *whether GPT actually misbehaves*. Phase 005's inconclusive smoke and the KQ1 external-shell requirement are still valid asks for *route-proof-level* evidence — but they are no longer the gate for whether real GPT behavioral problems exist. They exist. The remaining work is diagnosing mechanism and designing fixes.

### 9.2 A real flaw in the prior round: GPT investigating GPT

The `gpt-fast-high` lineage was `openai/gpt-5.5-fast` researching failures in GPT-backed dispatch — an inherent conflict of interest. A model assessing its own failure modes is structurally prone to: understating severity, preferring conclusions that don't implicate itself, and over-hedging toward "insufficient evidence" rather than "here is what's actually wrong." Re-read `research/research.md` and both lineage-level syntheses (`lineages/glm-max/research.md`, `lineages/gpt-fast-high/research.md`) with this lens explicitly. Name every place where `gpt-fast-high`'s framing looks softer, more deferential, or more self-protective than the evidence actually supports, and correct it.

### 9.3 What this round must do

1. **Be critical, not confirmatory.** Treat the existing consolidated synthesis as a draft to stress-test, not a settled answer. Actively look for: places where a recommendation was watered down, places where "wait for more evidence" was used to avoid a harder conclusion, and places where the two original lineages agreed with each other for the wrong reason (shared blind spot, not independent confirmation).
2. **Ground every finding in the confirmed symptom set** (§9.1), not in whether the symptoms exist. Ask: given GPT really does get stuck, really does misroute, really is slow, and really does overthink — what is the mechanism, and what is the concrete fix? Cite file:line evidence for mechanism and fix, same evidentiary bar as before — just not for "does the problem exist."
3. **Produce concrete, implementation-ready improvements**, not more diagnostic scaffolding. If the prior round's answer to a KQ was itself already concrete, either sharpen it, find its weak point, or confirm it survives adversarial pressure and say why. Do not restate it unchanged without adding something.
4. **Do not assume "not proven" is available as an escape hatch.** If earlier research treated something as unproven, and the operator's direct experience now confirms it, update the verdict and say explicitly that this changes the prior finding.

### 9.4 Stop conditions for this round

- 10 iterations per lineage. `stopPolicy: max-iterations`. No early convergence — treat any convergence signal before iteration 10 as telemetry only, same discipline as the first round (which needed a live fix mid-run last time because a lineage's own agent tried to converge early against its dispatch prompt's ambiguous wording — this round's dispatch prompt has already been corrected to remove that ambiguity).
- Read `research/research.md` and both prior lineage syntheses as required input before iteration 1.

### 9.5 Run config for this round

**Update (2026-07-01):** `sonnet-critical` (`claude-sonnet-5`) completed cleanly (10/10, excellent quality). `glm-critical` (`zai-coding-plan/glm-5.2`) stalled reproducibly on iteration 2 across 3 attempts (~29-50 min each, near-zero CPU consumption during the stall — an API-side quota/usage-exhaustion symptom, not a genuine slow-reasoning case; operator confirmed GLM usage was at 0). GLM was abandoned for this round after the 3rd stall. `glm-critical/iteration-001.md` (7 findings, newInfoRatio 0.92, independently confirmed the ai-council route-proof bug) is preserved and counted as a partial contribution. Replacement lineages below.

Two lineages, added alongside `sonnet-critical` (do not touch `lineages/glm-max/`, `lineages/gpt-fast-high/`, `lineages/sonnet-critical/`, or the partial `lineages/glm-critical/`):

```
node .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs \
  --spec-folder .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research \
  --loop-type research \
  --research-topic "Critical re-review of GPT behavioral hardening research (packet 031) -- operator-confirmed symptoms, correct for GPT-self-assessment bias, find concrete fixes -- see research-prompt.md §9" \
  --fanout-config-json '{"executors":[{"kind":"cli-claude-code","model":"claude-opus-4-8","reasoningEffort":"high","label":"opus-critical","iterations":10},{"kind":"cli-opencode","model":"openai/gpt-5.5-fast","reasoningEffort":"high","label":"gpt-critical","iterations":10}]}' \
  --base-artifact-dir .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/007-gpt-behavioral-hardening-research/research \
  --stop-policy max-iterations
```

After both complete: re-run `fanout-merge.cjs` across all lineages with a real registry (`glm-max`, `gpt-fast-high`, `sonnet-critical`, `opus-critical`, `gpt-critical` — `glm-critical`'s single-iteration registry may or may not carry a `deep-research-findings-registry.json`; check before assuming it merges), then rewrite `research/research.md` to integrate the critical round's findings, explicitly marking which prior conclusions were confirmed, sharpened, or overturned.
