# Deep Review Iteration 008

## Dimension

Maintainability

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28-40` — severity definitions and advisory-vs-blocking calibration.
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166-176` — per-iteration artifact contract.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-state.jsonl:3-23` — prior iteration and duplicate-finding context.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:9-228` — active finding registry and severity baseline.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:1196-1398` — prior clean-search proof and search-coverage context.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-strategy.md:111-358` — exhausted approaches and next-focus state.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-164` — approved scope, active model intent, and phase completion claims.
- `.opencode/specs/sk-prompt/007-sk-prompt-parent/008-cutover-and-rollout/implementation-summary.md:55-122` — terminal stale-reference and known-limitation evidence.
- `.opencode/skills/sk-prompt/SKILL.md:20-28` — parent hub mode list and prompt-models GLM coverage claim.
- `.opencode/skills/sk-prompt/SKILL.md:32-85` — registry-driven hub routing and packet boundary.
- `.opencode/skills/sk-prompt/README.md:31-35` — hub README active model list.
- `.opencode/skills/sk-prompt/mode-registry.json:16-40` — workflow-mode tool-surface contracts.
- `.opencode/skills/sk-prompt/hub-router.json:16-27` — routing signals and model vocabulary.
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md:76-99` — prompt-improve resource-domain contract.
- `.opencode/skills/sk-prompt/prompt-improve/README.md:143-205` — related skills and verification surface.
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:20-28` — prompt-models active model list includes GLM-5.2.
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:201-220` — dispatch matrix includes GLM-5.2 as active.
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md:226-240` — prompt-models rules require keeping the in-scope model set honest.
- `.opencode/skills/sk-prompt/prompt-models/README.md:23-26` — README at-a-glance active model list omits GLM-5.2.
- `.opencode/skills/sk-prompt/prompt-models/README.md:84-96` — framework map omits GLM-5.2.
- `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md:22-31` — canonical model index includes GLM-5.2 with framework and profile.
- `.opencode/skills/sk-prompt/prompt-models/references/models/glm-5.2.md:58-87` — GLM-5.2 profile exists and records empirical framework evidence.
- `.opencode/skills/sk-prompt/prompt-models/assets/model_profiles.json:1-4` — registry description lists GLM-5.2 as active.
- `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md:236-244` — operational verification command still targets the removed top-level prompt-models path.

## Findings By Severity

### P0

None.

### P1

None.

### P2

#### R8-P2-001 [P2] prompt-models README omits GLM-5.2 from its maintainer-facing framework map

- File: `.opencode/skills/sk-prompt/prompt-models/README.md:84`
- Evidence: The README's at-a-glance row says the packet works on DeepSeek, Kimi, MiniMax, MiMo, and optional Haiku, but omits GLM-5.2 [SOURCE: `.opencode/skills/sk-prompt/prompt-models/README.md:23-26`]. Its Framework Map likewise lists only DeepSeek, Kimi, MiniMax, and MiMo [SOURCE: `.opencode/skills/sk-prompt/prompt-models/README.md:84-96`]. The runtime contract and data sources disagree: `prompt-models/SKILL.md` lists GLM-5.2 as active [SOURCE: `.opencode/skills/sk-prompt/prompt-models/SKILL.md:20-28`; `.opencode/skills/sk-prompt/prompt-models/SKILL.md:201-220`; `.opencode/skills/sk-prompt/prompt-models/SKILL.md:226-240`], the model index includes `glm-5.2` with COSTAR/TIDD-EC evidence [SOURCE: `.opencode/skills/sk-prompt/prompt-models/references/models/_index.md:22-31`], and the GLM profile exists with benchmark-backed guidance [SOURCE: `.opencode/skills/sk-prompt/prompt-models/references/models/glm-5.2.md:58-87`].
- Finding class: matrix/evidence
- Scope proof: Exact grep for `glm-5.2|GLM-5.2|zai` under `prompt-models` found the active runtime, index, profile, and registry surfaces; the omission is isolated to the README summary/map rather than the underlying dispatch contract.
- Affected surface hints: [`prompt-models README`, `active model documentation`, `small-model framework map`]
- riskScore: 2 (advisory only)
- Recommendation: Add GLM-5.2 to the README at-a-glance list and framework map, mirroring the index row and GLM profile rather than inventing new framework text.

#### R8-P2-002 [P2] context_budget verification command still points at the removed top-level prompt-models path

- File: `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md:243`
- Evidence: The operational verification command is `jq empty .opencode/skills/prompt-models/assets/per_model_budgets.json` [SOURCE: `.opencode/skills/sk-prompt/prompt-models/references/context_budget.md:236-244`]. The folded packet now lives under `.opencode/skills/sk-prompt/prompt-models/`; the parent spec required the full tree move into `sk-prompt/prompt-models/` [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-93`; `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:108-113`], and live prompt-models docs point at the nested asset path [SOURCE: `.opencode/skills/sk-prompt/prompt-models/SKILL.md:256-268`].
- Finding class: instance-only
- Scope proof: Exact grep for `.opencode/skills/prompt-models|prompt-models/README|prompt-models/SKILL` under `.opencode/skills/sk-prompt` found already-known README stale paths plus this separate `context_budget.md` command; prior registry entries cover README command paths but do not mention this reference file.
- Affected surface hints: [`prompt-models context-budget reference`, `manual verification command`]
- riskScore: 2 (advisory only)
- Recommendation: Repoint the command to `.opencode/skills/sk-prompt/prompt-models/assets/per_model_budgets.json`, or make it relative to the packet root if that is the local documentation convention.

## Traceability Checks

- Core `spec_code`: PASS for hub topology and routing shape. The parent spec requires the two workflow modes, zero extensions, and prompt-models as the nested packet; the live hub/registry/router still match that shape [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/spec.md:88-93`; `.opencode/skills/sk-prompt/SKILL.md:32-85`; `.opencode/skills/sk-prompt/mode-registry.json:16-40`; `.opencode/skills/sk-prompt/hub-router.json:16-27`].
- Core `checklist_evidence`: PARTIAL by prior active findings. This pass found only P2 maintainer-documentation drift, but the registry still carries active P1 findings from earlier iterations [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:9-154`].
- Overlay `skill_agent`: PARTIAL. The runtime contract includes GLM-5.2 and nested prompt-models paths, but two maintainer-facing prompt-models references lag behind the folded model/path state.
- Overlay `agent_cross_runtime`: NOT RETRIED as a new direction because stale runtime-agent `/prompt` metadata remains covered by `R1-P1-001` [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-findings-registry.json:10-38`].
- Overlay `feature_catalog_code`: NOT APPLICABLE. No feature-catalog file is in the declared review scope [SOURCE: `.opencode/specs/sk-prompt/007-sk-prompt-parent/review/deep-review-strategy.md:16-90`].
- Overlay `playbook_capability`: DEFERRED. Ordered-bundle and D1/D4 benchmark follow-ups remain known non-blocking work; this iteration did not re-open them as maintainability findings [SOURCE: `.opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md:41-47`].

## SCOPE VIOLATIONS

None. Reviewed target files stayed read-only; only review artifacts were written.

## Verdict

PASS. This iteration found two P2 maintainability advisories and no P0/P1 findings.

## Next Dimension

All dimensions are covered; continue the configured max-iteration stabilization cycle.

Review verdict: PASS
