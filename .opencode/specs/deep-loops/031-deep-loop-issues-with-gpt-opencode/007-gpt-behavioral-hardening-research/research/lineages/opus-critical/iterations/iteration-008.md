# Iteration 8 — KQ9 FIX-5: a coverage argument that is independent of self-assessment bias

**Focus:** KQ-OPUS-8 — The charter (§9.2) flags that a GPT lineage recommending "wait on FIX-5" could be self-protective. Does the "wait" verdict survive once bias is controlled, and on what grounds?

## What was read (this iteration)

- `006-host-hard-identity-fix5/decision-record.md:11-38` (re-read: what FIX-5 actually is/does)
- Synthesis of this lineage's confirmed mechanisms (iters 3, 6, 7) mapped against the operator's 4 confirmed symptoms

## Finding 1 — Bias control: the "wait" verdict is reached by non-GPT lineages

The self-assessment-bias concern applies to `gpt-fast-high`. But the same "do not unpark FIX-5 now" verdict is independently reached by `glm-max` (`zai-coding-plan/glm-5.2`, KQ9 `:119-124`), by `sonnet-critical` (`claude-sonnet-5`, §2 KQ9 CONFIRMED), and now by this lineage (`claude-opus-4-8`). Three non-GPT models converge on it. So "wait" cannot be primarily a GPT self-protective artifact — the artifact hypothesis predicts the non-GPT lineages would diverge, and they do not. Confirms sonnet-critical's bias-check.

## Finding 2 — The decisive argument is coverage, not evidence-availability

FIX-5 is "native→CLI subprocess executor, process isolation" / host-runtime hard identity (`decision-record.md:13-14`) — it binds `agent_slug` as runtime identity and prevents wrong-agent dispatch. Map that against the operator's four CONFIRMED symptoms:

| Confirmed symptom | Mechanism (this round) | Does FIX-5 fix it? |
|---|---|---|
| Wrong sub-agent invoked | soft identity / missing orchestrate rows (iter 5) | **Partially** — hard identity prevents wrong-agent dispatch |
| Stuck on pre-defined flows | Mode D: Phase-0 self-check halt (iter 7) | **No** — a prose self-check halt is upstream of dispatch identity |
| Overthinks / needs literal instructions | judgment-dependent routing + Mode D (iter 5, 7) | **No** — hard identity does not make prose deterministic |
| Slow as `@orchestrate` | role-resolution latency (predecessor §3.1) | **No** — process isolation may *add* subprocess latency |

So FIX-5 addresses at most **one** of four confirmed symptoms, and could worsen the latency one. This is a *coverage* argument: even granting the operator's evidence in full (which §9.1 requires), FIX-5 is the wrong primary lever because ≥3 of 4 symptoms live in the prompt/routing layer that the cheaper phases (orchestrate rows, Mode D rewrite, ai-council naming) actually target. This is independent of whether the KQ1 external smoke ever runs — a sharper basis than "wait for evidence," which is the framing the charter warned could be an escape hatch. [SOURCE: 006-host-hard-identity-fix5/decision-record.md:13-14; research-prompt.md §9.1]

## Finding 3 — Do not close FIX-5 as permanently unnecessary either

Symptom 1 (wrong agent) IS partially a hard-identity target, and the predecessor's soft-identity root cause (`subagent_type:"general"`) is real. So the correct verdict is unchanged from prior rounds: **wait — unpark only on a negative gate** (cheaper layers land, external smoke runs, GPT route-proof `< 4/4` while Claude `= 4/4`). What this lineage adds is *why* waiting is not just risk-aversion: the cheaper layers have larger symptom coverage, so they should be tried first on the merits, not merely because they are cheaper.

## Ruled out this iteration

- Treating "wait on FIX-5" as primarily a GPT self-protective artifact — RULED OUT; three non-GPT models converge on it.
- Treating "wait" as justified mainly by missing external-smoke evidence — RULED OUT (partially); the stronger, evidence-independent basis is symptom-coverage (FIX-5 misses ≥3 of 4 confirmed symptoms).

## Status

`insight` — reframes the KQ9 verdict on a coverage basis that survives the bias charge without leaning on missing evidence.

newInfoRatio: 0.40 — novelty: a symptom-coverage table that makes "wait" an on-the-merits verdict rather than an evidence-deferral, plus a three-model bias control.
