# Iteration 004 - Maintainability

## Dispatcher

- Session: `deep-review-066-20260503T211436Z`
- Generation: `1`
- Lineage mode: `new`
- Mode: review
- Focus: maintainability pass over unified `sk-code` routing/resource organization, public agent/command wording, and moved verifier references.
- Budget profile: `verify` (selected for route/resource evidence plus command cross-checks)
- Status: complete

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/prompts/iteration-4.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-state.jsonl`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-findings-registry.json`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-strategy.md`
- `.opencode/specs/skilled-agent-orchestration/066-sk-code-opencode-merger/review/deep-review-config.json`
- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/skills/sk-code/SKILL.md`
- `.opencode/skills/sk-code/README.md`
- `.opencode/skills/sk-code/references/router/code_surface_detection.md`
- `.opencode/skills/sk-code/references/router/resource_loading.md`
- `.opencode/skills/sk-code/references/router/intent_classification.md`
- `.opencode/skills/sk-code/references/router/phase_lifecycle.md`
- `.opencode/skills/sk-code/scripts/verify_alignment_drift.py`
- `.opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md`
- `.opencode/agents/code.md`
- `.opencode/agents/review.md`
- `.opencode/agents/orchestrate.md`
- `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_implement_confirm.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml`
- `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- **F004**: Workflow review-agent standards contract names the wrong baseline skill -- `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:213` -- The public workflow `standards_contract` for `review` lists `baseline: "sk-code"` and `overlay: "Load sk-code router-selected evidence"`, but the review agent contract says `sk-code-review` is the review baseline and `sk-code` is loaded afterward only for router-selected standards evidence. The same inverted baseline appears in the implement-confirm and complete workflows, while the adjacent dual-phase labels still describe `sk-code-review baseline + sk-code router-selected evidence`, making the command metadata internally contradictory and harder to maintain safely. [SOURCE: `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:213`] [SOURCE: `.opencode/commands/spec_kit/assets/spec_kit_implement_confirm.yaml:199`] [SOURCE: `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:310`] [SOURCE: `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml:319`] [SOURCE: `.opencode/agents/review.md:76`] [SOURCE: `.opencode/agents/review.md:77`]
  - Finding class: cross-consumer
  - Scope proof: Scoped exact checks found the same `baseline: "sk-code"` / `overlay: "Load sk-code router-selected evidence"` pattern in all four public implement/complete workflow assets, while `.opencode/agents/review.md:76-77` and `.opencode/agents/orchestrate.md:99` define the intended baseline+overlay order.
  - Affected surface hints: [`spec_kit_implement_auto`, `spec_kit_implement_confirm`, `spec_kit_complete_auto`, `spec_kit_complete_confirm`, `@review standards contract`]
  - Recommendation: Change the workflow `standards_contract.baseline` values for review-agent entries to `sk-code-review` and keep `sk-code` as the router-selected overlay so command metadata, review agent doctrine, and dual-phase labels share one maintainable contract.
  - Claim adjudication:
    ```json
    {
      "type": "compact-skeptic-referee",
      "claim": "The public workflow review-agent standards_contract fields invert the intended review baseline and sk-code overlay, creating a cross-workflow maintainability defect.",
      "evidenceRefs": [
        ".opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:213",
        ".opencode/commands/spec_kit/assets/spec_kit_implement_confirm.yaml:199",
        ".opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:310",
        ".opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml:319",
        ".opencode/agents/review.md:76",
        ".opencode/agents/review.md:77",
        ".opencode/agents/orchestrate.md:99"
      ],
      "counterevidenceSought": "Checked adjacent dual_phase labels in the same workflow blocks and public review/orchestrator agent contracts. The labels and agents consistently name sk-code-review as baseline, so the baseline field is the outlier rather than an intentional new contract.",
      "alternativeExplanation": "The field may be descriptive-only and not parsed for runtime dispatch, but it is still a public workflow contract next to blocking review-gate metadata and duplicated across four assets.",
      "finalSeverity": "P1",
      "confidence": "high",
      "downgradeTrigger": "Downgrade to P2 only if the reducer/orchestrator proves these standards_contract fields are never consumed and are treated as non-authoritative comments."
    }
    ```

### P2 Findings

- None.

## Traceability Checks

| Check | Status | Evidence |
|---|---|---|
| Review doctrine loaded | pass | `.opencode/skills/sk-code-review/references/review_core.md:20` defines P0/P1/P2 severity handling. |
| Unified router organization | pass | `.opencode/skills/sk-code/SKILL.md:92-99` and `.opencode/skills/sk-code/README.md:29-64` present a coherent router/resource/script structure. |
| Surface detection sustainability | pass | `.opencode/skills/sk-code/references/router/code_surface_detection.md:26-46` states first-match detection order and UNKNOWN fallback. |
| Resource loading sustainability | pass | `.opencode/skills/sk-code/references/router/resource_loading.md:12-20` defines load tiers and `.opencode/skills/sk-code/references/router/resource_loading.md:39-76` maps OPENCODE resources and verifier command. |
| Moved verifier path | pass | `.opencode/skills/sk-code/references/opencode/shared/alignment_verification_automation.md:15-18` and `.opencode/skills/sk-code/scripts/verify_alignment_drift.py:92-105` agree on the verifier script path and CLI contract. |
| Public workflow standards wording | fail | Four command workflow assets name `sk-code` as the review baseline despite review-agent doctrine requiring `sk-code-review` baseline plus `sk-code` overlay. |

## Integration Evidence

- `.opencode/agents/review.md:76-77` defines the intended review standards split: `sk-code-review` baseline, then `sk-code` router-selected standards.
- `.opencode/agents/orchestrate.md:99` routes code review/security to `@review` with `sk-code-review baseline + sk-code router-selected evidence`.
- `.opencode/commands/spec_kit/assets/spec_kit_implement_auto.yaml:213-216`, `.opencode/commands/spec_kit/assets/spec_kit_implement_confirm.yaml:199-202`, `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml:310-313`, and `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml:319-322` carry the contradictory baseline metadata across all checked public workflow variants.

## Edge Cases

- Prior ADR/spec/plan/resource-map state-drift findings were not duplicated; they remain active carry-forward findings from earlier iterations.
- Broad historical `sk-code-opencode` searches remain intentionally noisy inside this spec packet, so this pass used targeted public workflow and router-resource inspection.
- The command `standards_contract` fields may be descriptive metadata rather than executable dispatch logic; severity remains P1 because the duplicated public contract sits in blocking review-gate workflow sections and contradicts the live review agent doctrine.

## Confirmed-Clean Surfaces

- Unified `sk-code` router docs consistently describe only WEBFLOW, OPENCODE, and UNKNOWN surfaces and keep Go/NextJS as unsupported removed placeholders rather than live route branches.
- `README.md` structure inventory aligns with the merged resource layout and moved verifier script.
- The verifier script and verifier automation reference agree on `.opencode/skills/sk-code/scripts/verify_alignment_drift.py` and repeatable `--root` usage.
- Public agent wording sampled in `.opencode/agents/code.md`, `.opencode/agents/review.md`, and `.opencode/agents/orchestrate.md` consistently delegates stack/surface details to `sk-code` instead of embedding removed route specifics.

## Ruled Out

- New P0 maintainability or runtime-safety failure in the unified router organization: ruled out for checked router/resource files.
- Duplicate traceability finding for stale ADR/spec/plan/resource-map current state: ruled out as already captured by F001, F002, and F003.
- Moved verifier stale-path defect: ruled out for checked canonical verifier reference and script path.

## Next Focus

- dimension: convergence / release-readiness cross-check
- focus area: verify whether active P1 findings remain unresolved after reducer refresh and check whether any public workflow metadata fix changed the standards contract.
- reason: all configured dimensions are now covered; release readiness remains conditional because active P1 findings are present.
- rotation status: correctness, security, traceability, and maintainability complete.
- blocked/productive carry-forward: avoid broad historical old-skill searches; use targeted checks against active public workflow metadata and packet current-state docs.
- required evidence: file:line citations for any resolved or still-active F001-F004 state.

## Assessment

Dimensions addressed: maintainability
