# Deep Review Iteration 002

## Dispatcher

- Route: `mode=review`, `target_agent=deep-review`, single LEAF iteration.
- Focus: security.
- Budget profile: `verify`.
- Session: `fanout-confirm-a-1783921047347-ky9ry5`; generation 1; lineage mode `new`.
- Read-only target: `.opencode/specs/sk-code/019-split-doc-template-alignment` plus the three declared sk-code resource/asset trees.

## Files Reviewed

- Packet security and scope claims: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- Exact hazard/framing searches across the declared `code-opencode`, `code-webflow`, and `code-quality` reference/asset trees.
- Focused security-sensitive reads:
  - `.opencode/skills/sk-code/code-webflow/references/performance/resource_loading.md:21-38,287-325,344-443`
  - `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:20-66`
  - `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:20-170,237-262`
  - `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/owasp_prototype_and_safe_access.md:317-331`
  - `.opencode/skills/sk-code/code-webflow/references/shared/dev_workflow/automation_errors_and_compat.md:250-259`
  - `.opencode/skills/sk-code/code-opencode/references/shell/quality_standards/validation_security_and_shellcheck.md:200-229`
  - `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:150-182`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The new usage wrapper presents an unconstrained dynamic script loader as an implementation pattern** -- `.opencode/skills/sk-code/code-webflow/references/performance/resource_loading.md:21-38,303-325` -- The packet-added OVERVIEW says to apply the documented loading patterns, while `loadScript(src)` assigns an unconstrained caller value to `script.src` without stating that `src` must be a trusted static URL, validating an HTTPS origin, or using integrity metadata. A nearby authoritative example demonstrates the missing origin allowlist and SRI guidance [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60`]. The body is documented as pre-existing, so this is not reported as a new executable vulnerability; the in-scope framing change makes the unsafe trust contract more readily consumable and warrants an advisory clarification.
   - Finding class: instance-only
   - Scope proof: An exact scoped search for dynamic script sinks found this generic unconstrained loader and the separate allowlisted implementation; the reviewed shell, DOM-sink, cookie, and secret examples were explicitly marked dangerous or bounded to non-sensitive data.
   - Affected surface hints: `resource-loading reference`, `dynamic script loader guidance`, `AI/context consumers`

## Traceability Checks

- `security_scope_claim`: **partial / advisory only**. The declared deliverables are Markdown-only and add no executable tooling [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68`]. One packet-added usage wrapper nevertheless broadens the recommendation framing around a pre-existing unconstrained script-loader example, producing P2-001 rather than a P0/P1 gate failure.
- `preservation_provenance`: **partial / baseline not replayed**. The packet explicitly says substantive body content was preserved and only structure was added [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-48`]. No pre-change baseline was replayed in this bounded iteration, so the loader body's age is accepted from packet evidence while the current wrapper is reviewed directly.

## Integration Evidence

- YAML-owned dispatch and write constraints: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/prompts/iteration-002.md:18-50`.
- Canonical LEAF workflow and state contract: `.opencode/agents/deep-review.md:124-140,233-258`.
- Severity doctrine: `.opencode/skills/sk-code/code-review/references/review_core.md:28-49,77-103`.
- Frozen review-depth v2 schema: `.opencode/skills/system-deep-loop/deep-review/references/state/state_jsonl.md:346-423`.
- Spec Memory trigger retrieval timed out; the lineage already marks repeated memory retrieval exhausted, so direct reads and exact searches were used. No sub-agent or external AI CLI was invoked.

## Edge Cases

- The packet summary still describes the third-party loader as accepting arbitrary input without an allowlist [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:91-93`], but the current target now validates HTTPS and allowlisted hosts and mentions SRI [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60`]. The stale prose is retained for the traceability iteration rather than misreported as a current security defect.
- The previously disclosed cookie contradiction is no longer active: client-set cookies are limited to non-sensitive values, while session cookies are explicitly server-set and `HttpOnly` [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:91-100,237-260`].
- Historical proof that every risky body snippet predates the structural work was not replayed. Severity therefore stays P2: current recommendation framing is evidenced, but no new executable path or untrusted caller is evidenced.

## Confirmed-Clean Surfaces

- DOM injection, command execution, `eval`, sensitive browser storage, and hardcoded-secret examples inspected in the focused set are clearly labeled unsafe and paired with safer alternatives [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:37-87,129-170,237-260`; `.opencode/skills/sk-code/code-opencode/references/shell/quality_standards/validation_security_and_shellcheck.md:200-229`; `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns/organization_security_and_examples.md:172-182`].
- The remediated third-party loader performs protocol/host validation and identifies SRI as the stronger integrity control [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60`].
- The review scope contains documentation, not executable runtime or tooling changes [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:54-60`; `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`].

## Ruled Out

- P0/P1 escalation for P2-001: ruled out because the only shown call passes a static example URL, no untrusted caller is evidenced, and the target is documentation-only.
- Active cookie good-vs-bad contradiction: ruled out by the explicit non-sensitive/client-set versus sensitive/server-set distinction at lines 91-100 and 237-260.
- Active arbitrary-input flaw in `best_practices_and_summary.md`: ruled out by HTTPS parsing, host allowlisting, and the SRI note at lines 39-60.
- Unsafe `eval`, shell-input, DOM-sink, and hardcoded-secret snippets presented as recommendations: ruled out because the inspected occurrences are explicitly labeled dangerous/bad or paired with safe alternatives.
- Structural-impact graph analysis: not applicable to this Markdown corpus/current-tree review; graphless exact-search and direct-read evidence covers the security bug classes selected here.

## Next Focus

- Dimension: traceability
- Focus area: reconcile packet requirements, checked evidence, implementation-summary claims, and current resource-document state
- Reason: security completed with one advisory; historical preservation and stale summary prose remain evidence-boundary questions
- Rotation status: 2 of 4 dimensions complete; traceability next
- Blocked/productive carry-forward: Spec Memory remains blocked and historical baseline replay remains deferred; exact searches plus focused direct reads remain productive
- Required evidence: direct packet-to-surface citations for R1-R5, checked rows, narrowed link claims, preserved-content limits, and the stale follow-up statement

Review verdict: PASS
