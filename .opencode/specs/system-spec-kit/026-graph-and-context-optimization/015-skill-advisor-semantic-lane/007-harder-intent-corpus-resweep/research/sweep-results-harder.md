# Harder Intent Corpus Lane Weight Sweep

Generated: 2026-05-14T05:53:08Z

## Seed Status

- providerModelId: `hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8`
- cacheHits: 15
- cacheMisses: 0
- seededSkills: 15
- promptEmbeddings: 46
- harderPrompts: 22
- varianceDetected: false

Cache invalidation evidence: the seeded sweep reused 15 cached skill embeddings and produced 0 misses. This packet did not edit skill metadata, so no affected skill embedding cache rows were invalidated.

Default provider note: the default provider path skipped locally with `Failed to create context`; the explicit `EMBEDDINGS_PROVIDER=hf-local` run completed and produced the numbers below.

Original-24 baseline from 015/004 V0: accuracyTotal 0.6667, todayCorrect 1.0000, intentDescribed 0.3333, flippedFromBaseline 0.

## Per-Vector Accuracy

| vectorLabel | weights | harder accuracyTotal | delta accuracyTotal vs original V0 | todayCorrect | delta todayCorrect vs original V0 | harder intentDescribed | delta intentDescribed vs original V0 | flippedFromBaseline | delta flippedFromBaseline vs original V0 |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| V0-baseline-015-002 | explicit=0.4200, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0500 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |
| V1-pre-015-002 | explicit=0.4500, lexical=0.3000, graph=0.1500, derived=0.1500, semantic=0.0000 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |
| V2-slightly-higher | explicit=0.4000, lexical=0.2800, graph=0.1300, derived=0.1200, semantic=0.0700 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |
| V3-medium | explicit=0.3800, lexical=0.2700, graph=0.1200, derived=0.1200, semantic=0.1100 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |
| V4-aggressive | explicit=0.3500, lexical=0.2500, graph=0.1200, derived=0.1300, semantic=0.1500 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |
| V5-explicit-heavy | explicit=0.5000, lexical=0.2500, graph=0.1000, derived=0.1000, semantic=0.0500 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |
| V6-cosine-dominant | explicit=0.3000, lexical=0.2000, graph=0.1000, derived=0.1000, semantic=0.3000 | 0.2273 | -0.4394 | n/a | n/a | 0.2273 | -0.1060 | 0 | +0.0000 |

## Per-Case Routing Diff

All candidate vectors routed each harder prompt identically to V0; `changedAcrossVectors` is `none` for every case.

| prompt | expectedSkill | V0 actual | all-vector actual | correct | changedAcrossVectors |
|---|---|---|---|---|---|
| Before the next handoff, rebuild the work packet ledger and prove the closure gates are internally consistent. | system-spec-kit | system-spec-kit | system-spec-kit | yes | none |
| Capture the current operating state so a later session can resume without rereading every artifact. | system-spec-kit | null | null | no | none |
| Turn this scattered onboarding note into a polished operator-facing playbook with examples and stable headings. | sk-doc | sk-doc | sk-doc | yes | none |
| Rework this usage narrative so it reads like an install path people can follow without extra explanation. | sk-doc | null | null | no | none |
| Package these local edits into a reviewable change with a clean history and remote branch ready for handoff. | sk-git | sk-git | sk-git | yes | none |
| Set up an isolated lane for this risky experiment, then publish the final patch series for maintainers. | sk-git | null | null | no | none |
| Rewrite these instructions so a smaller model follows the constraints instead of improvising around them. | sk-prompt | null | null | no | none |
| Score this task brief for ambiguity, missing inputs, and whether the requested behavior is testable. | sk-prompt | null | null | no | none |
| I only know the behavior in plain language; locate the implementation without relying on symbol names. | mcp-coco-index | null | null | no | none |
| Find modules that behave like this description even if their filenames and exported functions say something else. | mcp-coco-index | null | null | no | none |
| Bundle several connector calls into one typed execution and return only the compact structured result. | mcp-code-mode | null | null | no | none |
| Drive the external integrations through a single script so the transcript stays small. | mcp-code-mode | null | null | no | none |
| Open the local interface, reproduce the broken interaction, and capture the page evidence from the runtime. | mcp-chrome-devtools | null | null | no | none |
| Inspect what the rendered page actually did after the click, including network and visual proof. | mcp-chrome-devtools | null | null | no | none |
| Ask the search-grounded external model to sweep the architecture and report what this repo is missing. | cli-gemini | cli-gemini | cli-gemini | yes | none |
| Use the Google-backed second opinion for a wide-context read before we decide on the design. | cli-gemini | system-spec-kit | system-spec-kit | no | none |
| Run repeated evidence-gathering passes until the question stops producing new information, then synthesize. | deep-research | null | null | no | none |
| Keep an external state trail while investigating this unknown area across multiple fresh passes. | deep-research | null | null | no | none |
| Make several independent passes over this change, stop when findings converge, and rank the release risks. | deep-review | sk-code-review | sk-code-review | no | none |
| Audit the implementation repeatedly with a persistent state log until only residual issues remain. | deep-review | sk-code-review | sk-code-review | no | none |
| Have multiple perspectives argue the plan, compare tradeoffs, and leave the decision artifacts in the packet. | deep-ai-council | system-spec-kit | system-spec-kit | no | none |
| Stage a structured design deliberation with separate seats and converge on the least risky option. | deep-ai-council | deep-ai-council | deep-ai-council | yes | none |

## Recommendation

Recommended next weight: stay at `0.05`.

The harder corpus reduced baseline intent-described accuracy from 0.3333 to 0.2273, confirming that the new prompts are materially harder. It still produced no routing variance across semantic weights from 0.00 to 0.30. There is no evidence in this sweep that raising semantic_shadow improves top-skill routing.
