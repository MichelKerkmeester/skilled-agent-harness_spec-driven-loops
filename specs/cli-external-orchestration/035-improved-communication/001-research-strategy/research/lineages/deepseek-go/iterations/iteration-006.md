# Iteration 6: Fidelity validation, protected spans, exact-original fallback, evaluation methods

## Focus

Define how protected spans are encoded before inference, how fidelity is objectively validated (rejecting missing, duplicated, changed, or reordered protected spans), the exact-original fallback contract, and evaluation methods for perceptual 1:1 communication parity.

## Actions Taken

- Read the phase spec REQ-006, REQ-010, REQ-011, NFR-R01/R02, and edge-case sections (spec.md).
- Read the plan.md testing strategy: golden corpus, release gates, regression signals.
- Read the checklist testing/security sections (CHK-020..CHK-025, CHK-040..CHK-043).
- Cross-checked the reference's absence of any fidelity validator (rewrite.sh has none; confirmed in iteration 1).

## Findings

1. **The reference has no deterministic fidelity validator (confirmed)** — `rewrite.sh` rebuilds the full message, calls the model once, extracts `.message.content`, and emits it unconditionally on success (`rewrite.sh:117`, `:168`, `:215-224`). There is no protected-span codec, no post-rewrite comparison, no rejection path. The "keep every fact, name, number, and file path" instruction is prompt-only. This is the core gap the portable design must close. [SOURCE: file:../context/claudish-to-english-main/rewrite.sh:117,168,215-224]

2. **Protected-span classes are already specified (confirmed)** — Spec REQ-006 and checklist CHK-020 define the classes: code, paths, commands, flags, variables, URLs, hashes, identifiers, quotes, names, and numbers. Fenced code blocks must remain unchanged. The validator must reject "missing, duplicated, or changed protected spans; new facts; polarity or requirement-strength changes; empty/refused/truncated output; malformed Markdown; and changed fenced code." [SOURCE: spec.md:126, plan.md:246]

3. **Encoding strategy: placeholder substitution before inference (inferred, grounded)** — The plan's architecture positions `ProtectedSpanCodec` as replacing code, paths, flags, variables, URLs, hashes, quoted literals, identifiers, and numbers with opaque placeholders before inference, then decoding after (plan.md:97). Rationale: protecting literals before inference means the model cannot subtly alter them and the validator can do exact-match restoration checks. Opaque tokens must be collision-free (e.g., `⟦#span-0001⟧`), never recognizable natural text the model could "fix." [SOURCE: plan.md:97]

4. **Objective rejection gates (confirmed to be required)** — The spec's "make fidelity objectively rejectable" contract (REQ-006) maps to the plan's release gates: zero changed/missing/duplicated/illegally reordered protected spans; fenced code and required Markdown structure intact; no new fact, omission, polarity change, weakened/strengthened requirement, altered uncertainty, or changed next step; reject refusal, empty output, malformed stream, truncation, missing stop state, or token-limit completion. Every rejected rewrite renders the exact original. [SOURCE: spec.md:126, plan.md:244-254]

5. **Fallback contract: fail to exact original (confirmed)** — NFR-R01: "every rewrite failure yields the exact original presentation with at most one bounded notice per session." The reference's fail-open behavior (emit nothing / re-show original, `rewrite.sh:174-212`) is the model, but the portable design must make the original-reshow guaranteed even in replace mode by never suppressing before a validated replacement exists (fixing the iteration-1 blank-screen window at `rewrite.sh:113`). [SOURCE: spec.md:187, rewrite.sh:113]

6. **Deterministic gates must be automatic (confirmed)** — The spec demands the evaluation contract "can automatically reject any changed protected literal, code fence, URL, number, path, or completion failure and can route back to original output" (SC-003). This is a machine gate, not a human review step. [SOURCE: spec.md:146]

7. **Semantic gates need adjudication (inferred, grounded)** — New-fact/omission/polarity/requirement-strength detection is not reliably machine-decidable today. The plan gates these behind human-adjudicated meaning review: "Human-adjudicated semantic regressions block release. Automatic style improvement cannot override a meaning failure." Machine signals (SARI, LENS, semantic similarity) inform investigation but cannot independently prove fidelity (CHK-025). [SOURCE: plan.md:254-255, checklist.md:91]

8. **Evaluation corpus design (confirmed)** — A versioned, secret-free corpus from representative assistant communication: progress updates, final summaries, blockers, corrections, plans, reviews, terse messages; Markdown with headings, lists, tables, links, inline/fenced code, commands, paths, flags, hashes, identifiers, names, numbers, units, negations, caveats, priorities, requirement language; long/code-only/adversarial/refusal/truncation/malformed outputs; event fixtures for all six runtimes (deltas, tools, approvals, subagents, status, cancellation, duplication, reordering, missing completion). [SOURCE: plan.md:234-242]

9. **Blind human rubric (confirmed)** — Blind raters score meaning preservation, target plainness, and fluency separately, then choose reference-likeness with an `indistinguishable` option; at least three runs per provider/model/prompt because style quality is distributional. [SOURCE: plan.md:242-243, checklist.md:90]

10. **Operational metrics (confirmed)** — Record p50/p95 first-token and full rewrite latency, local cold/warm latency, fallback rate, token use, cost, and privacy class per provider/model/prompt. [SOURCE: plan.md:252]

11. **Protected-span validation vs display-time atomicity (inferred)** — The validator must run BEFORE any display mutation. In replace-capable runtimes (Claude `displayContent`, Pi `message_end`), the validated rewrite is committed atomically; on any rejection the runtime shows the original. In pipeline-owner runtimes (Codex/OpenCode/Devin/Cursor clients), the client renders the original until a validated rewrite is ready, then swaps — which is naturally atomic because the client owns the frame. This removes the reference's process-death blank-screen risk entirely.

## Questions Answered

- Q5 (partial): Protected-span encoding strategy (opaque placeholder substitution), objective rejection gates (all confirmed-required by spec), exact-original fallback contract (fail to original, atomic commit, no suppression before validation), and evaluation methods (deterministic gates + blind human rubric + operational metrics + regression signals).

## Questions Remaining

- Q5: Exact placeholder-token grammar and the automated new-fact/polarity gate implementation (design detail for a downstream phase).
- Q4, Q7, Q8: unchanged.

## Next Focus

Concurrency/failure boundaries (streaming, ordering, buffering, cancellation, retry) and the recommended downstream phase decomposition.

## Assessment

- newInfoRatio: 0.50
- noveltyJustification: Translated the confirmed spec/plan gates into a concrete protected-span encoding + atomic-commit model, and identified that pipeline-owner runtimes make display swap naturally atomic (new synthesis from confirmed surfaces).
- Confidence: High for confirmed gate requirements (spec/plan primary docs); placeholder grammar and semantic-gate implementation are design hypotheses.

## Reflection

What worked: grounding every gate in spec/plan citations and closing the process-death gap identified in iteration 1.
What failed / ruled out:
- Trusting prompt-only preservation: the reference proves it is insufficient (confirmed, ruled out).
- Machine-only semantic proof: SARI/LENS cannot independently prove fidelity (confirmed, ruled out).
Ruled out: none additional.
