# Deep-Review Strategy — 028 docs-alignment (10 iterations, stop_policy=max-iterations)

Scope authority: verify documentation completeness + alignment with sk-doc/sk-code standards for the Phase R remediation + 017-023 reconciliation merge (origin tip 8d52813080).

## Iteration slice plan
1. Packet-root navigation: spec.md phase map, graph-metadata children, context-index migration bridge — VERIFY-OR-REFUTE seed findings S1-S4 below.
2. Children 006-008: template conformance, Phase R evidence quality, status coherence (sk-doc standards).
3. Children 009-012: same lenses.
4. Children 013-016: same lenses.
5. mcp_server/handlers/README.md vs merged handler code (memory-index, memory-search, save/spec-folder-mutex).
6. lib/search/README.md + lib/storage/README.md vs merged code (drift-healing, processing-sweep, incremental-index, channel telemetry).
7. ENV_REFERENCE.md truthfulness vs actual flag reads post-merge (orphan-sweep rows, enforce defaults, consumption log, calibration rows).
8. system-spec-kit SKILL.md + references/ alignment for surfaces touched by Phase R + 022/023 (drift-marker entrypoint, scripts/README prune contract).
9. Comment hygiene across merged sources + doc drift introduced by the 017-023 merge (their packet docs vs merged reality, incl. 019 graduation comments).
10. Re-verification sweep: confirm/refute every open finding, close coverage gaps, final verdict.

## Seed hypotheses (from a rejected shallow run — UNVERIFIED, re-derive with evidence)
- S1: root spec.md phase map omits direct children (017-023 era) vs graph-metadata children_ids.
- S2: 002-spec-data-quality/SUMMARY.md reports incompatible states for 051-053.
- S3: context-index.md migration bridge retains an obsolete roster.
- S4: 005-speckit-surface-alignment/spec.md heading retains an old phase number.

## Dimension rotation
Odd iterations: traceability (docs<->code/state truth). Even: maintainability (doc quality, template conformance). Iteration 10: both.

## Iteration log

### Iteration 001 — traceability — 2026-07-10

- Confirmed S1 as `R1-P1-001`: the root phase map exposes 000-005 while graph metadata declares 000-023 direct children.
- Confirmed S2 as `R1-P1-002`: the bridge calls 051-053 shipped and verified while the data-quality index calls them draft and unstarted.
- Confirmed S3 as `R1-P1-003`: the bridge's current-scope roster retains extracted `002-skill-advisor`.
- Confirmed S4 as `R1-P2-001`: `005-speckit-surface-alignment/spec.md` still uses the former `008` heading.
- Verdict: CONDITIONAL. Next slice: children 006-008 template conformance, evidence quality, and status coherence.

### Iteration 002 — maintainability — 2026-07-10

- Confirmed `R2-P1-001`: child 006's Phase R task addendum expands completed work beyond the packet's recorded scope and delivered-files evidence.
- Confirmed `R2-P1-002`: children 007 and 008 publish conflicting lifecycle status across continuity, plans, checklists, and implementation summaries.
- Confirmed `R2-P2-001`: child 007 retains template-path suffixes in user-facing title metadata.
- Verdict: CONDITIONAL. Next slice: children 009-012 traceability review.

### Iteration 003 — traceability — 2026-07-10

- Confirmed `R3-P1-001`: child 011's CHK-064 is checked and cites completed benchmark measurements, while its spec, task, checklist summary, and implementation summary still state that the same numeric latency benchmark was not executed.
- Confirmed `R3-P1-002`: child 012's F1 evidence claims that the refresh-cadence test exercises the real DELETE cascade, but the measured test only enqueues fresh suspects and asserts that all indexed rows remain after that scan; deletion is covered only by its separate follow-up-scan test.
- Verdict: CONDITIONAL. Next slice: children 013-016 template conformance, evidence quality, and status coherence.

### Iteration 004 — maintainability — 2026-07-10

- Confirmed `R4-P1-001`: child 014 declares verification complete while its plan retains two unchecked required pre-merge decisions.
- Confirmed `R4-P1-002`: child 015's plan preserves the superseded 83/2,121 validation-impact figure after its specification corrects it to 80/2,235.
- Confirmed `R4-P1-003`: child 016's implementation summary documents reverted broad truthy parsing as shipped despite the task record's final strict `{true,1}` decision.
- Confirmed `R4-P2-001` and `R4-P2-002`: children 013 and 016 retain template markers in public `spec.md` titles.
- Verdict: CONDITIONAL. Next slice: `mcp_server/handlers/README.md` traceability against merged handler code.

### Iteration 005 — traceability — 2026-07-10

- Reviewed every substantive `handlers/README.md` claim against the named merged handler implementations.
- Ruled out README drift for scan coalescing plus unscoped orphan/suspect recovery, query-time existence filtering, save-pipeline locking, and context-mode routing.
- No new findings. Verdict: PASS. Next slice: `lib/search/README.md` and `lib/storage/README.md` maintainability alignment.

### Iteration 006 — traceability retry — 2026-07-10

- Reviewed the `lib/search/README.md` and `lib/storage/README.md` contracts against drift-healing, stale processing-marker recovery, incremental-index decisions, shared active-row filtering, channel exceptions, and graph-preservation telemetry.
- Ruled out a documentation contradiction: the README directory trees are curated topologies, while their concrete behavioral claims match the reviewed source and boot-time recovery call site.
- No new findings. Verdict: PASS. Next slice: `ENV_REFERENCE.md` feature-flag truthfulness against post-merge reads and defaults.

### Iteration 007 — traceability retry — 2026-07-10

- Confirmed `R7-P1-001`: `ENV_REFERENCE.md` labels `SPECKIT_INCLUDE_ARCHIVED_VECTOR` graduated ON, while the startup path calls the same behavior opt-in/default-off. One contract is stale, so unset-variable archive-vector behavior is ambiguous to operators.
- Ruled out equivalent drift in the reviewed orphan-sweep budget, graduated enforcement, evaluation logging, and consumption-log contracts.
- Verdict: CONDITIONAL. Next slice: system-spec-kit skill and reference alignment for touched drift-marker and generated-metadata surfaces.

### Iteration 008 — maintainability — 2026-07-10

- Reviewed the system-spec-kit skill, script entrypoint documentation, and deep-review cross-skill reference seam for Phase R and 022/023 documentation drift.
- Ruled out new authority-chain drift: `SKILL.md` delegates script architecture to `scripts/README.md`, whose generated-metadata pruning contract retains report-before-apply, confirmation-hash, stale-report, backup, and recovery safeguards.
- Ruled out cross-skill resolver drift: the deep-review surface still points to the canonical system-spec-kit artifact-root seam.
- No new findings. Verdict: PASS. Next slice: comment hygiene and reconciliation-merge documentation drift.

### Iteration 009 — traceability — 2026-07-10

- Reviewed the 019 graduation narrative, 022 drift-marker entrypoint summary, and 023 self-healing consolidation summary against their documented implementation and verification claims.
- Confirmed `R9-P2-001`: 022 retains a user-visible `[template:level_2/implementation-summary.md]` placeholder in its frontmatter title.
- Ruled out a new documentation contradiction in the reviewed 019 and 023 summary claims at the documentation layer; no concrete prohibited source comment was evidenced in the changed-source inventory.
- Verdict: PASS with advisory. Next slice: correctness re-verification sweep for open findings and remaining coverage gaps.

### Iteration 010 — traceability + maintainability — 2026-07-10

- Re-verified every active registry entry against the current tree. All five P1 findings remain active: the root map still excludes metadata-declared direct children; the bridge still conflicts with the local 051-053 status index and lists an extracted child; child 006 still records cross-cutting Phase R work outside its documented presentation-layer scope and delivery list; and child 008 still claims completion while its plan's Definition of Done remains unchecked. Child 007's Phase R wording is narrowed to the addendum and does not independently create a packet-completion contradiction.
- Re-verified all three P2 findings. The obsolete 005 heading and template placeholders in 007 and 022 remain present.
- Closed the deferred `implementation_alignment` direction with representative direct source checks: the documented memory-context floor, handler-owned envelope budget, and public-schema constitutional option are present in current source. No new correctness or security defect was evidenced in this documentation-alignment slice.
- Code graph was empty, so the final sweep used direct-read and exact-search fallback. No review scope mutations were required.
- Verdict: CONDITIONAL. Maximum iteration count reached; five P1 documentation defects require remediation before PASS.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 11
- P2 (Suggestions): 5
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: Not applicable to this documentation-only slice. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: Not applicable to this documentation-only slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: Not applicable to this documentation-only slice.

### `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not applicable; no such claim producer is in this documentation-only slice. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not applicable; no such claim producer is in this documentation-only slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: not applicable; no such claim producer is in this documentation-only slice.

### `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: NOT_APPLICABLE. No artifact of those types is a claim producer in this slice. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: NOT_APPLICABLE. No artifact of those types is a claim producer in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: NOT_APPLICABLE. No artifact of those types is a claim producer in this slice.

### `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: NOT_APPLICABLE. No artifact of those types produces a claim in this documentation-only sweep. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: NOT_APPLICABLE. No artifact of those types produces a claim in this documentation-only sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`: NOT_APPLICABLE. No artifact of those types produces a claim in this documentation-only sweep.

### `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: Not applicable. No such artifact is a claim producer in this slice. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: Not applicable. No such artifact is a claim producer in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: Not applicable. No such artifact is a claim producer in this slice.

### `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: NOT_APPLICABLE. No agent-runtime, feature-catalog, or manual-testing-playbook artifact is a claim producer in this slice. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: NOT_APPLICABLE. No agent-runtime, feature-catalog, or manual-testing-playbook artifact is a claim producer in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: NOT_APPLICABLE. No agent-runtime, feature-catalog, or manual-testing-playbook artifact is a claim producer in this slice.

### `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: NOT_APPLICABLE. The target has no agent-runtime, feature-catalog, or manual-playbook artifact. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: NOT_APPLICABLE. The target has no agent-runtime, feature-catalog, or manual-playbook artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: NOT_APPLICABLE. The target has no agent-runtime, feature-catalog, or manual-playbook artifact.

### `agent_cross_runtime`: Not applicable; no agent-runtime artifacts were in this slice. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: Not applicable; no agent-runtime artifacts were in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Not applicable; no agent-runtime artifacts were in this slice.

### `agent_cross_runtime`: NOT_APPLICABLE; no runtime-agent artifact produces a claim in this slice. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `agent_cross_runtime`: NOT_APPLICABLE; no runtime-agent artifact produces a claim in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: NOT_APPLICABLE; no runtime-agent artifact produces a claim in this slice.

### `checklist_evidence`: FAIL for child 008 lifecycle truthfulness because all Definition of Done entries remain unchecked while the child declares completion. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/008-metadata-rename-reconciliation/plan.md:94-105`; `.opencode/specs/system-speckit/029-memory-search-intelligence/008-metadata-rename-reconciliation/spec.md:30,57`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checklist_evidence`: FAIL for child 008 lifecycle truthfulness because all Definition of Done entries remain unchecked while the child declares completion. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/008-metadata-rename-reconciliation/plan.md:94-105`; `.opencode/specs/system-speckit/029-memory-search-intelligence/008-metadata-rename-reconciliation/spec.md:30,57`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: FAIL for child 008 lifecycle truthfulness because all Definition of Done entries remain unchecked while the child declares completion. [SOURCE: `.opencode/specs/system-speckit/029-memory-search-intelligence/008-metadata-rename-reconciliation/plan.md:94-105`; `.opencode/specs/system-speckit/029-memory-search-intelligence/008-metadata-rename-reconciliation/spec.md:30,57`]

### `checklist_evidence`: fail for child 014; unchecked pre-merge decisions conflict with its all-verified completion declaration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: fail for child 014; unchecked pre-merge decisions conflict with its all-verified completion declaration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for child 014; unchecked pre-merge decisions conflict with its all-verified completion declaration.

### `checklist_evidence`: Failed for the lifecycle/status direction. Child 007's unchecked P0/P1 checklist entries conflict with its active continuity completion claim; child 008's unchecked plan definition-of-done conflicts with completion claims. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: Failed for the lifecycle/status direction. Child 007's unchecked P0/P1 checklist entries conflict with its active continuity completion claim; child 008's unchecked plan definition-of-done conflicts with completion claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Failed for the lifecycle/status direction. Child 007's unchecked P0/P1 checklist entries conflict with its active continuity completion claim; child 008's unchecked plan definition-of-done conflicts with completion claims.

### `checklist_evidence`: Not applicable. This slice reviews maintained skill documentation rather than a delivery checklist. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checklist_evidence`: Not applicable. This slice reviews maintained skill documentation rather than a delivery checklist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Not applicable. This slice reviews maintained skill documentation rather than a delivery checklist.

### `checklist_evidence`: NOT_APPLICABLE; this code-folder reference slice has no delivery checklist that governs its claims. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: NOT_APPLICABLE; this code-folder reference slice has no delivery checklist that governs its claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT_APPLICABLE; this code-folder reference slice has no delivery checklist that governs its claims.

### `checklist_evidence`: NOT_APPLICABLE. This code-folder documentation slice has no delivery checklist whose completion state changes the truth of its claims. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence`: NOT_APPLICABLE. This code-folder documentation slice has no delivery checklist whose completion state changes the truth of its claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT_APPLICABLE. This code-folder documentation slice has no delivery checklist whose completion state changes the truth of its claims.

### `checklist_evidence`: NOT_APPLICABLE. This documentation-to-handler slice has no scoped delivery checklist whose completion evidence changes the truth of the README claims. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: NOT_APPLICABLE. This documentation-to-handler slice has no scoped delivery checklist whose completion evidence changes the truth of the README claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT_APPLICABLE. This documentation-to-handler slice has no scoped delivery checklist whose completion evidence changes the truth of the README claims.

### `checklist_evidence`: NOT_APPLICABLE. This slice adjudicated implementation-summary documentation and changed-source inventory, not a delivery checklist. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: NOT_APPLICABLE. This slice adjudicated implementation-summary documentation and changed-source inventory, not a delivery checklist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: NOT_APPLICABLE. This slice adjudicated implementation-summary documentation and changed-source inventory, not a delivery checklist.

### `checklist_evidence`: The root handoff contract at `spec.md:141-144` is incomplete for direct children declared only in graph metadata. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: The root handoff contract at `spec.md:141-144` is incomplete for direct children declared only in graph metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: The root handoff contract at `spec.md:141-144` is incomplete for direct children declared only in graph metadata.

### `comment_hygiene`: No new finding from the available changed-source inventory. The reviewed 019 summary describes graduation comments at lines 71 and 126 but does not itself contain an ephemeral finding/task/spec-path code comment. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `comment_hygiene`: No new finding from the available changed-source inventory. The reviewed 019 summary describes graduation comments at lines 71 and 126 but does not itself contain an ephemeral finding/task/spec-path code comment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `comment_hygiene`: No new finding from the available changed-source inventory. The reviewed 019 summary describes graduation comments at lines 71 and 126 but does not itself contain an ephemeral finding/task/spec-path code comment.

### `feature_catalog_code`: Not applicable; no catalog or code surface was in this slice. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: Not applicable; no catalog or code surface was in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Not applicable; no catalog or code surface was in this slice.

### `feature_catalog_code`: NOT_APPLICABLE; no feature catalog is in scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: NOT_APPLICABLE; no feature catalog is in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: NOT_APPLICABLE; no feature catalog is in scope.

### `playbook_capability`: Not applicable; no manual-testing playbook was in this slice. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: Not applicable; no manual-testing playbook was in this slice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Not applicable; no manual-testing playbook was in this slice.

### `playbook_capability`: NOT_APPLICABLE; no manual-testing playbook is in scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: NOT_APPLICABLE; no manual-testing playbook is in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: NOT_APPLICABLE; no manual-testing playbook is in scope.

### `security`: No new security finding. The reviewed material contains no authentication, authorization, secret-handling, or destructive-operation contract contradicted by the representative source checks. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `security`: No new security finding. The reviewed material contains no authentication, authorization, secret-handling, or destructive-operation contract contradicted by the representative source checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `security`: No new security finding. The reviewed material contains no authentication, authorization, secret-handling, or destructive-operation contract contradicted by the representative source checks.

### `skill_agent`: Covered. The review followed the deep-review artifact and severity contract. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `skill_agent`: Covered. The review followed the deep-review artifact and severity contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Covered. The review followed the deep-review artifact and severity contract.

### `skill_agent`: PASS; narrative, evidence citations, and severity handling follow the loaded deep-review and review-core contracts. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `skill_agent`: PASS; narrative, evidence citations, and severity handling follow the loaded deep-review and review-core contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS; narrative, evidence citations, and severity handling follow the loaded deep-review and review-core contracts.

### `skill_agent`: pass; review artifacts follow the deep-review and review-core evidence contracts. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`: pass; review artifacts follow the deep-review and review-core evidence contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: pass; review artifacts follow the deep-review and review-core evidence contracts.

### `skill_agent`: PASS. The iteration artifacts, evidence citations, v2 depth ledger, and final-line verdict follow the loaded deep-review and review-core contracts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent`: PASS. The iteration artifacts, evidence citations, v2 depth ledger, and final-line verdict follow the loaded deep-review and review-core contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The iteration artifacts, evidence citations, v2 depth ledger, and final-line verdict follow the loaded deep-review and review-core contracts.

### `skill_agent`: PASS. The narrative, severity ordering, evidence citations, and exact final-line verdict conform to the loaded deep-review and review-core contracts. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `skill_agent`: PASS. The narrative, severity ordering, evidence citations, and exact final-line verdict conform to the loaded deep-review and review-core contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The narrative, severity ordering, evidence citations, and exact final-line verdict conform to the loaded deep-review and review-core contracts.

### `skill_agent`: PASS. The reviewed folder guides preserve the handler-to-library boundary and do not claim MCP-tool ownership. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:20-31`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19-29,56-59`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `skill_agent`: PASS. The reviewed folder guides preserve the handler-to-library boundary and do not claim MCP-tool ownership. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:20-31`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19-29,56-59`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The reviewed folder guides preserve the handler-to-library boundary and do not claim MCP-tool ownership. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:20-31`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:19-29,56-59`]

### `skill_agent`: PASS. The target skill distinguishes packet-governance policy, script ownership, memory behavior, and review workflow ownership; its deep-review cross-reference names the canonical artifact resolver. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `skill_agent`: PASS. The target skill distinguishes packet-governance policy, script ownership, memory behavior, and review workflow ownership; its deep-review cross-reference names the canonical artifact resolver.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. The target skill distinguishes packet-governance policy, script ownership, memory behavior, and review workflow ownership; its deep-review cross-reference names the canonical artifact resolver.

### `skill_agent`: PASS. This narrative, registry update, state record, and delta use the deep-review/review-core severity and evidence contracts. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `skill_agent`: PASS. This narrative, registry update, state record, and delta use the deep-review/review-core severity and evidence contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: PASS. This narrative, registry update, state record, and delta use the deep-review/review-core severity and evidence contracts.

### `skill_agent`: Reviewed against the deep-review iteration artifact and evidence requirements. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: Reviewed against the deep-review iteration artifact and evidence requirements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Reviewed against the deep-review iteration artifact and evidence requirements.

### `spec_code`: FAIL for the archived-vector default claim; the documentation and runtime startup contract conflict. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: FAIL for the archived-vector default claim; the documentation and runtime startup contract conflict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: FAIL for the archived-vector default claim; the documentation and runtime startup contract conflict.

### `spec_code`: Not applicable to this navigation-only slice; no implementation behavior was reviewed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: Not applicable to this navigation-only slice; no implementation behavior was reviewed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Not applicable to this navigation-only slice; no implementation behavior was reviewed.

### `spec_code`: Not applicable. This slice was restricted to packet documentation; source-code claims were not adjudicated. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: Not applicable. This slice was restricted to packet documentation; source-code claims were not adjudicated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Not applicable. This slice was restricted to packet documentation; source-code claims were not adjudicated.

### `spec_code`: partial; documentation-to-code truth was not the primary slice, but final flag behavior was reconciled across the summary and task evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: partial; documentation-to-code truth was not the primary slice, but final flag behavior was reconciled across the summary and task evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial; documentation-to-code truth was not the primary slice, but final flag behavior was reconciled across the summary and task evidence.

### `spec_code`: PARTIAL. The 019 summary identifies its default-flip locations and verification evidence at lines 71-75 and 158-185; the 023 summary identifies queue-only discovery, next-cycle confirmation, and targeted checks at lines 55-71 and 116-122. This iteration did not establish a conflicting documentation claim. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: PARTIAL. The 019 summary identifies its default-flip locations and verification evidence at lines 71-75 and 158-185; the 023 summary identifies queue-only discovery, next-cycle confirmation, and targeted checks at lines 55-71 and 116-122. This iteration did not establish a conflicting documentation claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PARTIAL. The 019 summary identifies its default-flip locations and verification evidence at lines 71-75 and 158-185; the 023 summary identifies queue-only discovery, next-cycle confirmation, and targeted checks at lines 55-71 and 116-122. This iteration did not establish a conflicting documentation claim.

### `spec_code`: PASS for the deferred implementation-alignment direction. The source retains the documented minimum-results floor and reports a floor overflow, the envelope honors handler-owned `memory_context` budgets, and the public schema exposes `includeConstitutional`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:749-762`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:677-691`; `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:214-225`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `spec_code`: PASS for the deferred implementation-alignment direction. The source retains the documented minimum-results floor and reports a floor overflow, the envelope honors handler-owned `memory_context` budgets, and the public schema exposes `includeConstitutional`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:749-762`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:677-691`; `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:214-225`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS for the deferred implementation-alignment direction. The source retains the documented minimum-results floor and reports a floor overflow, the envelope honors handler-owned `memory_context` budgets, and the public schema exposes `includeConstitutional`. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:749-762`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:677-691`; `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:214-225`]

### `spec_code`: PASS for the documentation seam. `SKILL.md` points to `scripts/README.md` as the script entrypoint authority, while the latter supplies the command-level report-then-apply pruning contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: PASS for the documentation seam. `SKILL.md` points to `scripts/README.md` as the script entrypoint authority, while the latter supplies the command-level report-then-apply pruning contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS for the documentation seam. `SKILL.md` points to `scripts/README.md` as the script entrypoint authority, while the latter supplies the command-level report-then-apply pruning contract.

### `spec_code`: PASS. README scan-coalescing and orphan/suspect recovery claims match lease handling and unscoped maintenance phases in `memory-index.ts:660-697,993-1080,1775-1789`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: PASS. README scan-coalescing and orphan/suspect recovery claims match lease handling and unscoped maintenance phases in `memory-index.ts:660-697,993-1080,1775-1789`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. README scan-coalescing and orphan/suspect recovery claims match lease handling and unscoped maintenance phases in `memory-index.ts:660-697,993-1080,1775-1789`.

### `spec_code`: PASS. The active-row predicate consistently excludes tombstones and applies tier/lane policy; its use spans hybrid, lexical, vector, causal, and handler read paths. The README's final-filter and vector/retrieval boundary descriptions remain compatible with this shared policy. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154-176,188-197`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts:41-85`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79,570,815,2634`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: PASS. The active-row predicate consistently excludes tombstones and applies tier/lane policy; its use spans hybrid, lexical, vector, causal, and handler read paths. The README's final-filter and vector/retrieval boundary descriptions remain compatible with this shared policy. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154-176,188-197`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts:41-85`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79,570,815,2634`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The active-row predicate consistently excludes tombstones and applies tier/lane policy; its use spans hybrid, lexical, vector, causal, and handler read paths. The README's final-filter and vector/retrieval boundary descriptions remain compatible with this shared policy. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:154-176,188-197`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/active-row-predicate.ts:41-85`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:79,570,815,2634`]

### `spec_code`: PASS. The context mode claim is supported by the five configured modes and the deep/focused/resume strategy implementations in `memory-context.ts:1184-1369`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: PASS. The context mode claim is supported by the five configured modes and the deep/focused/resume strategy implementations in `memory-context.ts:1184-1369`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The context mode claim is supported by the five configured modes and the deep/focused/resume strategy implementations in `memory-context.ts:1184-1369`.

### `spec_code`: PASS. The opt-in query-time existence-filter claim matches the runtime flag gate, canonical-row filtering, exclusion, and deferred suspect collection in `memory-search.ts:1642-1695,1841-1853`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: PASS. The opt-in query-time existence-filter claim matches the runtime flag gate, canonical-row filtering, exclusion, and deferred suspect collection in `memory-search.ts:1642-1695,1841-1853`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The opt-in query-time existence-filter claim matches the runtime flag gate, canonical-row filtering, exclusion, and deferred suspect collection in `memory-search.ts:1642-1695,1841-1853`.

### `spec_code`: PASS. The save-pipeline concurrency boundary is implemented by the per-folder in-process queue and interprocess lock lifecycle in `spec-folder-mutex.ts:287-337` and is used by `memory-save.ts:2888`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: PASS. The save-pipeline concurrency boundary is implemented by the per-folder in-process queue and interprocess lock lifecycle in `spec-folder-mutex.ts:287-337` and is used by `memory-save.ts:2888`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The save-pipeline concurrency boundary is implemented by the per-folder in-process queue and interprocess lock lifecycle in `spec-folder-mutex.ts:287-337` and is used by `memory-save.ts:2888`.

### `spec_code`: PASS. The search README's channel-exception, graph-preservation, entity-density, and telemetry descriptions are supported by `channel-exceptions.ts`, `query-router.ts`, and the retrieval call sites. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:169-184`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-exceptions.ts:19-77`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:199-305,467-509`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: PASS. The search README's channel-exception, graph-preservation, entity-density, and telemetry descriptions are supported by `channel-exceptions.ts`, `query-router.ts`, and the retrieval call sites. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:169-184`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-exceptions.ts:19-77`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:199-305,467-509`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The search README's channel-exception, graph-preservation, entity-density, and telemetry descriptions are supported by `channel-exceptions.ts`, `query-router.ts`, and the retrieval call sites. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md:169-184`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/channel-exceptions.ts:19-77`; `.opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts:199-305,467-509`]

### `spec_code`: PASS. The storage README accurately assigns drift-suspect queue ownership to `memory-drift-healing.ts` and describes the scan-oriented incremental decision path. The startup processing-marker recovery is a supporting module, not an unsupported contradictory claim. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:140-148`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts:84-232`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-processing-sweep.ts:247-264`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2256-2284`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: PASS. The storage README accurately assigns drift-suspect queue ownership to `memory-drift-healing.ts` and describes the scan-oriented incremental decision path. The startup processing-marker recovery is a supporting module, not an unsupported contradictory claim. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:140-148`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts:84-232`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-processing-sweep.ts:247-264`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2256-2284`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: PASS. The storage README accurately assigns drift-suspect queue ownership to `memory-drift-healing.ts` and describes the scan-oriented incremental decision path. The startup processing-marker recovery is a supporting module, not an unsupported contradictory claim. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/storage/README.md:140-148`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-healing.ts:84-232`; `.opencode/skills/system-spec-kit/mcp_server/lib/storage/memory-drift-processing-sweep.ts:247-264`; `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:2256-2284`]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
