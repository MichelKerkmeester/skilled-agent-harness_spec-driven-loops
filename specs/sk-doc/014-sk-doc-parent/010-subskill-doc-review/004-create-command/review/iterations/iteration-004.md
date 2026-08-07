# Deep Review Iteration 004

## Dispatcher

- target_agent: deep-review
- resolved_route: /deep:review:auto -> .opencode/agents/deep-review.md
- agent_definition_loaded: true
- mode: review
- target: .opencode/skills/sk-doc/create-command/
- focus: security, least-privilege, destructive/privileged gate fidelity, and final cross-check
- budgetProfile: verify

## Files Reviewed

- .opencode/skills/sk-doc/create-command/SKILL.md
- .opencode/skills/sk-doc/create-command/README.md
- .opencode/skills/sk-doc/create-command/references/argument_hints_and_modes.md
- .opencode/skills/sk-doc/create-command/references/common_pitfalls.md
- .opencode/skills/sk-doc/create-command/references/router_presentation_split.md
- .opencode/skills/sk-doc/create-command/assets/command/command_template.md
- .opencode/skills/sk-doc/create-command/assets/command/command_presentation_template.md
- .opencode/skills/sk-code/code-review/references/review_core.md
- review/deep-review-state.jsonl
- review/deep-review-findings-registry.json
- review/deep-review-strategy.md
- review/deep-review-config.json

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Presentation template fails the declared reference validation gate** -- .opencode/skills/sk-doc/create-command/assets/command/command_presentation_template.md:20 -- The final all-doc validation pass reports this target doc as `INVALID` for `--type reference` because it lacks a required overview section. The file moves directly from the H1 into `## How To Use` at line 20 and the full file contains no `overview` heading, so the packet cannot honestly claim all target docs validate under the shared doc-quality gate. Impact: release/readiness synthesis would be based on a false validation pass unless this asset gains the expected overview section or the validation contract explicitly exempts this asset type. Fix: add a concise `## 1. OVERVIEW` section to the presentation template before usage instructions, or amend the validation plan to use a validator/type that is documented for asset templates.
   - Finding class: instance-only
   - Scope proof: Full target-doc validation ran across SKILL.md, README.md, references/*.md, and assets/command/*.md; only `assets/command/command_presentation_template.md` produced a blocking validation error.
   - Affected surface hints: ["presentation asset template", "doc validation gate", "create-command packet release readiness"]
   - Claim adjudication:
     ```json
     {
       "type": "validation-gate",
       "claim": "The create-command target docs do not all pass the declared shared doc-quality validation gate because command_presentation_template.md lacks the required overview section for --type reference.",
       "evidenceRefs": [
         ".opencode/skills/sk-doc/create-command/assets/command/command_presentation_template.md:14",
         ".opencode/skills/sk-doc/create-command/assets/command/command_presentation_template.md:20",
         ".opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/004-create-command/review/deep-review-strategy.md:48"
       ],
       "counterevidenceSought": "Reread the full presentation template and reran the shared validator across SKILL.md, README.md, references/*.md, and assets/command/*.md. Earlier iteration state claimed validators pass, but current command output shows this asset has one blocking missing_required_section error.",
       "alternativeExplanation": "If command asset templates are intentionally exempt from --type reference validation, the validation plan should say so and this would downgrade to a documentation-contract mismatch rather than a target-doc validation failure.",
       "finalSeverity": "P1",
       "confidence": 0.86,
       "downgradeTrigger": "A documented validator/type exemption for assets/command/command_presentation_template.md, or a validator update that classifies this template as valid without an overview section."
     }
     ```

### P2 Findings

None.

## Traceability Checks

- Least-privilege guidance is explicit in SKILL.md: `allowed-tools` must list every tool actually used, must not add broad tools just in case, and must use fully qualified MCP names in frontmatter.
- Mandatory input gates are explicit in SKILL.md: required arguments must stop on missing input, wait for the user, and forbid inference from context, screenshots, conversation history, or open files.
- Destructive-action safety is explicit in SKILL.md and the command template: destructive commands require confirmation by default, affected-state display, logging, completion verification, recovery guidance, and cancellation status.
- Router/presentation separation preserves gate and permission semantics: the split must not change routing semantics, required inputs, confirmation behavior, or tool permissions.
- Final validation cross-check contradicted prior clean validation state for one asset template: `command_presentation_template.md` is currently invalid as `--type reference` due to missing overview.

## Integration Evidence

- .opencode/skills/sk-code/code-review/references/review_core.md:28-34 provided P0/P1/P2 severity definitions.
- .opencode/skills/sk-doc/shared/scripts/validate_document.py was run against all target docs using skill/readme/reference types; exit output was valid for SKILL.md, README.md, references/README.md, argument_hints_and_modes.md, common_pitfalls.md, router_presentation_split.md with warnings, worked_example.md with warnings, command_template.md with warnings, and invalid for command_presentation_template.md.
- review/deep-review-state.jsonl and review/deep-review-strategy.md were checked for continuity across iterations 1-3 before deriving iteration 4.

## Edge Cases

- Prior iteration 3 state says validators pass, but the current final validation command produced a blocking error for `assets/command/command_presentation_template.md`; implementation/tool evidence is treated as current truth.
- Validator warnings for numbered headings inside examples remain warning-only and are not active findings.
- The dispatcher requested `review-report.md` and findings-registry updates, but this leaf agent's writable contract is limited to the iteration artifact, strategy file, and JSONL state log. The report and reducer-owned registry were therefore not modified by this iteration.

## Confirmed-Clean Surfaces

- No reviewed guidance encourages broad tool permissions by default; the packet repeatedly says to keep `allowed-tools` least-privilege and accurate.
- No reviewed guidance permits fabricated user approval; required input and confirmation gates require explicit user input or cancellation.
- No reviewed guidance permits silent destructive writes; destructive workflows require confirmation, affected-state display, verification, logging, and recovery guidance.
- Router/presentation split guidance keeps routing, gates, modes, and tool permissions in the router/workflow boundary rather than in display-only assets.

## Ruled Out

- Unsafe broad `allowed-tools` guidance in the authoritative SKILL.md.
- `:auto` guidance that permits inventing required inputs or destructive decisions.
- Presentation split guidance that allows silent changes to gates or permissions.
- Destructive template that omits affected-state display or recovery guidance.

## Next Focus

- dimension: final synthesis / remediation planning
- focus area: address P1 validation-gate mismatch, then rerun the target-doc validation command and reducer/final report generation in the owning workflow.
- reason: iteration 4 reached maxIterations=4 and found one gate-relevant P1 in final validation cross-check; no P0 findings were found.
- rotation status: final iteration complete under stop_policy=max-iterations; all planned dimensions have been reviewed.
- blocked/productive carry-forward: productive security review; blocked final report/registry writes in this leaf because those artifacts are outside the leaf writable contract.
- required evidence: after remediation, rerun shared validators for SKILL.md, README.md, references/*.md, and assets/command/*.md, then refresh reducer-owned registry and review-report.md from the owning workflow.
