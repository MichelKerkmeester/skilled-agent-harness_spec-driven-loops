# Deep Review Iteration 003

## Dispatcher

- Route: `mode=review`, `target_agent=deep-review`, single LEAF iteration.
- Focus: traceability.
- Budget profile: `verify`.
- Session: `fanout-confirm-a-1783921047347-ky9ry5`; generation 1; lineage mode `new`.
- Reduced-scope retry: all file reads and searches were confined to the packet root and the six explicitly allowed resource/asset roots.
- Read-only target: `.opencode/specs/sk-code/019-split-doc-template-alignment` plus the three declared sk-code resource/asset surfaces.

## Files Reviewed

- Packet requirements and evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- Current corpus inventory: `code-opencode/references`, `code-opencode/assets`, `code-webflow/references`, `code-webflow/assets`, and `code-quality/assets`; the declared `code-quality/references` root contains no review files.
- Focused current-state reads:
  - `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-100,237-262`
  - `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:34-65`
  - `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:1-31`
  - `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:13-29`
  - `.opencode/skills/sk-code/code-opencode/assets/scripts/README.md:1-10`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **P2-002: Post-completion follow-up presents remediated issues as still active** -- `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:91-93` -- The summary still recommends follow-up for a cookie contradiction and an arbitrary-input third-party loader, but the current security reference explicitly separates non-sensitive client-set cookies from server-set `HttpOnly` session cookies [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:91-100,249-260`] and the current loader validates HTTPS plus an origin allowlist and identifies SRI [SOURCE: `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:39-60`]. Exact searches in each existing allowed root also found no instance of the quoted generic “when implementing or troubleshooting” phrase. The stale follow-up can send future work toward already-remediated defects.
   - Finding class: cross-consumer
   - Scope proof: The packet’s follow-up list was checked against both named live resources, and its quoted generic phrase was searched separately in every existing allowed resource/asset root with no match.
   - Affected surface hints: `implementation summary`, `future content-quality planning`, `security reference handoff`

2. **P2-003: Task and checklist evidence contracts overstate the evidence stored in their rows** -- `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:23-25`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25,30-82` -- The task file says every checked row carries evidence and the checklist says every item carries a command plus result, but the checked rows contain completion statements without commands, output references, or replay pointers. The summary itself acknowledges checklist rows without inline evidence markers [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:83-86`]. Current-state structure and corpus claims remain corroborated, but historical R4 preservation, commit sequencing, push state, and pre-commit gate claims cannot be replayed from these rows.
   - Finding class: matrix/evidence
   - Scope proof: All 11 checked task rows and all 15 checked checklist rows were reconciled; the gap is packet-wide evidence formatting, not an isolated unchecked item or a current resource-conformance failure.
   - Affected surface hints: `tasks evidence rows`, `checklist verification protocol`, `historical provenance replay`

## Traceability Checks

- `spec_code` (hard): **partial / current-state alignment passes**. R1-R3 and R5 agree across the requirement list, the live 163-file inventory, the prior deterministic current-tree sweep, and the completion tables [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-48,71-79`]. R4 remains historical provenance that cannot be proved from the current tree and was not retried after the strategy marked baseline replay blocked.
- `checklist_evidence` (hard): **partial / one advisory evidence gap**. All 26 checked task/checklist claims were reconciled. Current corpus, naming, structure, and narrowed link claims are consistent [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:38-61`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-60,87-97`], while P2-003 records the absent command/replay evidence for historical and process claims.

## Integration Evidence

- YAML-owned route, scope, write boundary, lineage, executor, and strict-v2 requirement: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a/prompts/iteration-003.md:1-50`.
- Canonical LEAF workflow and severity doctrine were loaded in the no-write attempt immediately preceding this YAML-authorized reduced-scope retry: `.opencode/agents/deep-review.md:124-258` and `.opencode/skills/sk-code/code-review/references/review_core.md:28-103`.
- No sub-agent, external AI CLI, code graph, or broad-root search was invoked in this retry; graphless direct reads, per-root Glob, and per-root Grep supplied the evidence.

## Edge Cases

- The `code-quality/references` root yielded no files, while `code-quality/assets` contains the documented three files; this is consistent with the packet’s “code-quality (assets)” distribution [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:41-46`].
- R4 content preservation and commit/push sequencing are historical assertions. Their absence from replayable row evidence is preserved as a limitation and P2-003, not converted into a current implementation failure.
- The summary’s Post-Completion Follow-Up conflicts with current resource content. Implementation evidence wins for current behavior, while the stale prose remains actionable as P2-002.
- P2-001 was revisited only for deduplication: its current resource-loader framing is distinct from the packet-summary staleness and was neither duplicated nor refined.

## Confirmed-Clean Surfaces

- The live inventory still reconciles to 163 Markdown files: code-opencode 65, code-webflow 95, and code-quality assets 3.
- R1-R3/R5 current-state claims remain consistent with the prior deterministic corpus sweep and current completion tables; no contrary live file was found in the reduced-scope pass.
- The rust overview ordering, third-party Purpose de-duplication, narrowed renamed-link wording, and lowercase asset trigger phrase named by the summary are present in the current files [SOURCE: `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:1-31`; `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/overview_hls_and_lenis.md:13-29`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:71-78`; `.opencode/skills/sk-code/code-opencode/assets/scripts/README.md:1-10`].

## Ruled Out

- Current cookie contradiction: ruled out by the explicit non-sensitive client-cookie versus sensitive server-cookie distinction.
- Current arbitrary-input defect in `best_practices_and_summary.md`: ruled out by protocol and host validation plus the SRI guidance.
- A new or refined P2-001: ruled out because the traceability defect is stale packet prose, not the separate `resource_loading.md` framing advisory.
- P0/P1 escalation for either new finding: ruled out because both concern replayability/handoff quality, while current resource conformance remains corroborated and no executable behavior changed.

## Next Focus

- Dimension: maintainability
- Focus area: clarity, supportability, and pattern consistency across the resulting resource documents
- Reason: traceability completed with two P2 advisories; the remaining pass should assess safe follow-on change cost without retrying historical provenance
- Rotation status: 3 of 4 dimensions complete; maintainability next
- Blocked/productive carry-forward: Spec Memory and historical baseline replay remain blocked; explicit-root inventories, exact per-root searches, and focused direct reads remain productive
- Required evidence: current file:line proof for repeated maintenance burdens, unclear ownership, fragile cross-resource patterns, or clean supportability

Review verdict: PASS
