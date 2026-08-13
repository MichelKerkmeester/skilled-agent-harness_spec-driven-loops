---
title: Communication Projection Deep-Research — merged synthesis
type: research
status: complete
spec_folder: specs/sk-doc/028-sk-communication-skill
loop_type: research
lineages: [luna (cli-codex gpt-5.6-luna max/fast), deepseek (cli-opencode opencode-go/deepseek-v4-pro)]
iterations: 10 (5 per lineage, stop-policy max-iterations)
---

# Communication Projection — Merged Deep-Research Synthesis

Two independent models each ran 5 forced-depth iterations grounded in the real source. They **converged** on the same verdict, the same root causes, the same recommendation, and the same value boundary. DeepSeek added two sharper, highly actionable findings LUNA did not surface. A third lineage (GLM 5.2 via cli-devin) failed all attempts on the `devin -p` single-turn limitation and was replaced by DeepSeek.

Per-lineage sources: [`lineages/luna/research.md`](lineages/luna/research.md) · [`lineages/deepseek/research.md`](lineages/deepseek/research.md)

## Executive verdict (both lineages agree)

Local-tokenize → model → local-restore is the **correct** privacy/exactness primitive. The underwhelming smoke is not a flaw in the security design — it is that the current whole-message path hands the model a writing task it is not set up to do well. The fix is a **hybrid**: render a deterministic skeleton from the typed event envelope, and have the model rewrite only **bounded prose slots** using the existing protect/restore primitive. Keep the security boundary; do not move exactness/privacy across the provider boundary.

## Why the rewrites underwhelm

### Confirmed by BOTH models
1. **Broad protection, no adjacent-span coalescing.** `collectProtectedRanges` tokenizes far more than secrets/paths (blocks, commands, list markers, links, URLs, flags, hashes, variables, numbers, identifiers); one ~48-char opaque marker per range; ranges are only overlap-filtered, never merged. A 95-char sentence measured at 270 chars / 5 tokens. (`fidelity/dialect.ts`, `fidelity/protected-spans.ts:396-415`)
2. **The prompt never teaches token-carrying.** `adapters.ts:96-100` sends one value-centric system line ("keep every fact, name, number, path") + the whole encoded body — but those values are already opaque markers the model can't see. No token contract, no examples. The safe model behavior is to copy everything verbatim → "barely changed". (`providers/adapters.ts:96-100`, `contracts/prompt.ts`)
3. **The meaning judge is not wired into production.** No source connects the provider candidate to `validateProjectionCandidate`/the judge outside the evaluation modules; `executeProviderRoute → decideRender` skips it. (`providers/executor.ts`, `render/decision.ts`)
4. **The semantic layer is a reject-only veto, not a clarity scorer.** It never ranks prose for fluency/directness. (`fidelity/semantics.ts:61-107`)

### Added by DeepSeek (sharper, directly explain the smoke)
5. **The unchanged echo is structurally ACCEPTED.** The validator only runs its structure + semantic-veto stages when `restored.text !== sourceText`; a verbatim echo skips every check and passes. "Some barely changed" is *rewarded, not detected* — this is exactly why the dependency-install scenario passed nearly unchanged. (`fidelity/validator.ts:183-222`)
6. **The control knobs are gated fail-closed.** The shipped DeepSeek preset marks `temperature-control`/`thinking-control` `unknown`, so `compilePromptControls` returns `unsupported` and the profile returns exact-original **before transport**. Temperature/thinking/tier tuning is *not even reachable* through the shipped preset without fresh capability evidence. (`providers/controls.ts:100-116`, `providers/presets.ts:171-179`)
7. **`evaluateFidelityVeto` hard-codes `judgeMode: 'disabled'`** — the judge is doubly unwired. (`evaluation/fidelity-veto.ts:30-50`)

## The fix — priorities (union of both lineages)

- **A. Make the prompt a token-contract copy-editing contract** — explicit "copy each `⟦pcp:…⟧` marker exactly once, in order; rewrite only words between markers" + synthetic-token few-shot, as a versioned `PromptProfileRecord` revision. (My smoke proved this works: forcing "sealed black-box" tokens took restore from 0/6 → 6/6.)
- **B. Reduce model burden** — coalesce bounded adjacent spans / short wire aliases, keeping the canonical byte-map + strict restore. (Alias format is itself a privacy-policy surface.)
- **C. Wire the meaning judge** at a local (or separately privacy-approved) reject-only boundary, after restoration; any failure stays exact-original.
- **D. Reject the no-op** — treat a verbatim echo as "no improvement → deterministic fallback"; require minimal edit distance before presenting a projection.
- **E. Unblock control knobs** with fresh capability evidence, or tuning is unreachable on the shipped preset.

## When projection is actually worth it (both agree)

Conditional value — **only** high-friction, multi-sentence warnings / caveats / consequences / recovery explanations. Short statuses, typed lifecycle events, command/result summaries, and raw tool data → deterministic/native or exact-original. Full atomic projection is Codex-App-Server-only today (`completeMessage`/`atomicRenderDecision` CONFIRMED_YES). It is a value **hypothesis** — there is no user-value benchmark, and release is gated on a powered blinded human study (`assertHumanCertifiable` rejects proxy/provisional).

## Cross-model agreement

- Root causes 1–4, the hybrid recommendation, the value boundary, and every "ruled-out" direction (relax token checks, hosted judge after restore, semantic-diff-as-generator, remote structured rendering, project-everything) match across both lineages.
- DeepSeek uniquely surfaced #5 (unchanged-echo acceptance) and #6 (control-knobs fail-closed) — both concrete and actionable, and both directly explain observed smoke behavior.
- No contradictions between the lineages.

## Concrete sequence

1. Versioned model-facing span representation (adjacency coalescing / short aliases), canonical map retained.
2. Prompt-profile revision: token contract + synthetic few-shot + one-to-one marker rule; validate + digest.
3. Supply fresh capability evidence so controls are reachable.
4. Compose provider → deterministic validation → local reject-only meaning judge → render, in one production path; exact-original on every failure.
5. Reject the no-op echo (fall back to deterministic).
6. Deterministic skeletons for typed classes + bounded prose slots; start append/sidecar.
7. Fixed-corpus paired study (deterministic-only vs whole-message vs hybrid), content-free artifacts.
8. Live credentialed smoke + powered blinded human non-inferiority before promotion.

## Open questions

Efficacy of any specific coalescing scheme, alias format, prompt profile, model tier, or hybrid slot schema is **not** confirmed — the decisive test is a fixed-corpus, human-rated hybrid-vs-deterministic comparison, which has not been run.
