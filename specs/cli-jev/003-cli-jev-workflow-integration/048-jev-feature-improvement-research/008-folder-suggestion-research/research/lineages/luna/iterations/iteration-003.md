# Iteration 3 — Candidate reach, reuse, and default-on controls

## Focus

Trace what the current save validators can offer to Jev, identify nearby .skilled judgments with a useful semantic-ranking analogue, and define a bounded default-on suggestion design with measured cost and explicit safety controls.

## Actions Taken

- Re-read the lineage steer.md path before this iteration; the file is absent.
- Traced the content and folder validator candidate lists and the two folder-detector save paths.
- Read the Jev option and input construction, skill-advisor semantic ranking, trigger-index ranking, and Gate 3 classifier.

## Findings

1. **Candidate recall is a hard ceiling on chooser accuracy.** Jev’s row options are only the current target, listed alternatives, and none-of-these. The content validator considers numbered, non-archived folders but retains only folders scoring above the target, capped at three. The folder validator ranks numbered siblings, caps the list at three, and only offers it when the top alternative beats the current score. If the correct folder is absent, Jev cannot select it. Measure gold-in-candidate-set recall before model accuracy; then improve retrieval with scoped sibling and parent/child candidates, richer folder metadata, and controlled semantic retrieval. Preserve none-of-these as an abstention choice. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:556-567] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:522-537, 641-668]

2. **The two save paths impose different rollout boundaries.** An explicit CLI folder reaches validateContentAlignment and logs a better match as ALIGNMENT_BYPASSED, preserving the requested path. The data path validates sibling folders and returns a selected alternative when the operator chooses one. Feature 022 likewise documents that only the data path can switch. A first default-on suggestion should therefore run only on eligible low-match data saves, while a CLI-explicit path can display an advisory without changing the target unless the caller explicitly opts into a change. Noninteractive calls should retain the current folder. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1032-1049, 1148-1168] [SOURCE: specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:86-89]

3. **The closest reuse target is skill-advisor routing; trigger retrieval is a second candidate.** system-skill-advisor already embeds prompts, computes a semantic_shadow lane with default weight 0.05, can use exact semantic reranking when candidates are close under RRF, and filters visible recommendations through confidence and uncertainty thresholds. The Jev evaluation method can help test prompt-to-skill destination choices and measure when semantic signals improve over lexical or explicit signals; it should complement the existing scorer and abstention policy. The trigger index has a parallel query-to-document judgment: substring candidate phrases are scored per document and ranked under a result limit, so semantic candidate discovery may help paraphrased triggers. Gate 3 is a policy boundary: its deterministic ordering keeps memory-save and resume rules explicit, so semantic matching should supply context or a suggestion there, never silently grant or suppress a required gate. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-18] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:488-499, 766-795, 890-914] [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:549-563] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:155-211] [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:782-859]

4. **A default-on integration should default to a confirmed suggestion, not an unreviewed path change.** Invoke Jev only for a low-match save with a usable candidate set; pass bounded context and the candidate descriptions; show the suggested folder and a short reason; require the existing explicit selection step before data-path switching. Keep the CLI-explicit and noninteractive behavior stable, and fall back to the deterministic validator if Jev is unavailable, times out, or abstains. Retain the approved-spec-root check before using any returned path. The evaluator currently costs 3 choice calls per row plus one auth check per run; a live one-pass design would cost approximately one choice call per eligible save, with actual token cost and latency still to be measured. Use the three-pass path for offline evaluation, not as the live default. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:1011-1057, 1097-1107, 1115-1140] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1151-1168]

5. **The main default-on risks are bad destinations, context exposure, untrusted input, and latency.** The scorer feeds row.state to the choice process and includes folder descriptions in the options; those fields may carry private or instruction-like content. Minimize and redact context, delimit it as data, keep paths and descriptions trusted by the application, and validate the final path against approved roots. Log model/provider/version, eligible-save count, abstentions, operator acceptance or correction, timeout, and p50/p95 latency. Set an explicit latency budget and rollback switch before rollout. Do not claim a dollar budget until actual token use and provider pricing are recorded. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:830-878, 980-989, 1097-1107] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1151-1155]

## Questions Answered

- **What drove the measured result?** The scorer’s rich state and description input plausibly explains its advantage over lexical folder-name matching, but no ablation establishes causality. The 39/40 result is against a same-corpus-selected top alternative; it is not lift over the target or a production estimate.
- **How can accuracy improve or cost fall?** Measure and improve candidate recall first; bound live inference to one call on eligible interactive data saves, reuse bounded folder metadata, and keep repeated calls for offline reliability measurement.
- **How can the measurement become more trustworthy?** Use independent labels tied to final save outcomes, preserve label provenance and raw calls, predeclare the baseline, hold out folder families or projects, and report the two save paths separately.
- **Where else could the judgment help?** Skill-advisor prompt-to-skill ranking and trigger-index query-to-context retrieval are the closest lower-risk targets. Gate 3 remains deterministic.
- **What would default-on require?** A bounded candidate set, one-call latency and token telemetry, explicit operator confirmation, approved-root validation, data minimization, untrusted-input handling, safe fallback, and a reversible rollout control.

## Questions Remaining

- Does a one-pass Jev call reach acceptable agreement and latency on real, independently labeled low-match saves?
- How much is lost to candidate recall, and do parent/child or cross-track candidates improve recall without producing distracting alternatives?
- What are the actual per-save token usage, price, acceptance rate, and correction rate under the intended provider and model?

## Sources Consulted

- steer.md — checked before this iteration; absent.
- specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/spec.md:86-89
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts:522-537, 641-668
- .skilled/skills/system-spec-kit/runtime/cli/spec-folder/folder-detector.ts:1032-1049, 1148-1168
- .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts:556-567, 830-878, 980-989, 1011-1057, 1097-1107, 1115-1140
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-18
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:488-499, 766-795, 890-914
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:549-563
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:155-211
- .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:782-859

## Assessment

- newInfoRatio: 0.71
- Justification: This pass maps the candidate-recall ceiling, proves the live save-path asymmetry, identifies two reuse candidates, and specifies the confirmation, fallback, privacy, latency, and cost controls for integration.
- Confidence: High for candidate bounds, current routing behavior, and advisor/retrieval mechanics; medium for the future one-call quality and cost because they require new measured data.

## Reflection

The most useful product step is to improve and measure the candidate set before changing the chooser. A confirmed one-call suggestion on the data path fits today’s switching behavior; silently rewriting explicit CLI destinations would not.

## Recommended Next Focus

No further loop iteration is due: the configured three-iteration cap is reached. Synthesize the findings and record stopReason=maxIterationsReached.
