# Deep Research Strategy

## Research Topic

How to reliably prevent AI agents, dispatched sub-agents, and small models such as MiniMax-M3 via cli-opencode from missing or under-loading relevant `sk-design` sub-skill context during design and UI build work.

## Known Context

- Operator observations to explain: skipped shared register, late foundations contrast creating a WCAG-AA P1, ad-hoc audit instead of the pre-flight card, and a thin MiniMax prompt.
- `resource-map.md` not present at the target spec folder; skipping coverage gate.
- Artifact root was bound directly to `config.fanout_lineage_artifact_dir` as requested.

## Key Questions

- [x] When should `sk-design` auto-pair `interface`, `foundations`, and `audit` instead of selecting one smallest mode?
- [x] What context must be loaded before visual choices?
- [x] How should contrast discipline be encoded before implementation?
- [x] What audit artifacts must be loaded before release claims?
- [x] What must be passed to dispatched sub-agents and small models?
- [x] How should MiniMax-M3 prompts differ from frontier-model prompts?
- [x] What hard gates prevent repeat misses?
- [x] How should fan-out outputs be verified and adopted?
- [x] When does a candidate context-loading rule become canonical?
- [x] How should lineages preserve attribution?

## Answered Questions

- The default mode router is correct for narrow design questions, but UI build work needs a bundle because the interface packet itself requires register, dials, quality floor, mechanical pre-flight, and handoff context.
- Foundations context must be loaded whenever color/theme/contrast tokens or text-over-background pairs are created, not only when the user explicitly says "palette."
- Audit context must be loaded before release-readiness or accessibility claims, and the evidence worksheet should prevent confirmed/inferred/not-assessed drift.
- Small-model dispatch needs a context manifest plus model-specific prompt scaffold. MiniMax-M3 needs TIDD-EC and dense pre-planning.
- Fan-out merge provides cross-lineage attribution; adoption needs a separate thresholded promotion gate.

## What Worked

- Reading the shared register first explained why the missed register propagated into density, motion, color dosage, copy and audit severity.
- Reading foundations color references explained the late contrast miss as missing pair inventory, not a one-off color choice.
- Reading audit references separated two gates: interface pre-flight for ship/fix, and audit contract for evidence/scoring.
- Reading MiniMax profile clarified why a thin prompt is especially weak for MiniMax-M3.
- Reading fan-out merge and promotion-gate contracts clarified merge versus adoption.

## What Failed

- No existing packet docs were present beyond the orchestration status log, so observed session misses are grounded in the operator prompt rather than local packet artifacts.
- The executable YAML command runner was not invoked because the lineage prompt explicitly required direct artifact-dir binding and path-constrained output.

## Exhausted Approaches

- Leaving generic UI builds as `interface` only.
- Relying on post-build visual inspection for contrast.
- Using prose-only audit summaries.
- Asking a small model to "use sk-design" without a context manifest.
- Treating fan-out merge as automatic canonical adoption.

## Ruled-Out Directions

| Approach | Reason | Evidence |
|---|---|---|
| Interface-only for UI builds | Interface success criteria already requires register, dials, quality floor and pre-flight context. | [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:247] |
| Late contrast audit | Contrast repair starts with actual pairs and measured thresholds. | [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:61] |
| Ad-hoc audit prose | Audit requires evidence labels, severity, scoring and evidence limits. | [SOURCE: file:.opencode/skills/sk-design/design-audit/references/audit_contract.md:61] |
| Thin MiniMax delegation | MiniMax profile requires TIDD-EC and dense pre-planning. | [SOURCE: file:.opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md:56] |
| Winner-by-vibes adoption | Promotion requires gated evidence and explicit approval before canonical mutation. | [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md:22] |

## Next Focus

Synthesis complete. Next implementation packet should add a deterministic `sk-design` context-loading manifest and a pre-dispatch design gate.

## Non-Goals

- Do not implement changes to `sk-design` or CLI skills in this lineage.
- Do not mutate the target spec parent or parent research folder.
- Do not run external CLI sub-dispatches from inside this lineage.

## Stop Conditions

- Stop once all key questions are answered with file-cited evidence.
- Stop before any write outside the lineage artifact directory.
- Stop before canonical adoption; this lineage can recommend gates but not promote them.
