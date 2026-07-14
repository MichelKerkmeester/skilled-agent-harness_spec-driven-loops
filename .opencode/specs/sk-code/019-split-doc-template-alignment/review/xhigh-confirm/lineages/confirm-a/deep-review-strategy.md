# Deep Review Strategy: sk-code Split-Doc Template Alignment

## 1. OVERVIEW

### Purpose

Track a four-pass review of the completed split-document template alignment packet and its declared sk-code deliverables.

### Usage

Each LEAF iteration reviews one dimension, updates the machine-owned state, and rotates to the next uncovered dimension. Convergence is telemetry-only until iteration 4.

## 2. TOPIC

Review `.opencode/specs/sk-code/019-split-doc-template-alignment` against its structural conformance, preservation, link-repair, and evidence claims.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness: behavior and structural claims match the current files — score 4/5 (iteration 1, PASS; historical preservation replay deferred)
- [x] D2 Security: documentation examples and trust-boundary claims do not create in-scope hazards — score 4/5 (iteration 2, PASS with one P2 framing advisory)
- [x] D3 Traceability: requirements, checked evidence, and implementation surfaces agree — score 4/5 (iteration 3, PASS with two P2 evidence/handoff advisories)
- [x] D4 Maintainability: resulting resource documents remain clear and mechanically supportable — score 4/5 (iteration 4, PASS; three existing P2 advisories carried unchanged)
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Do not modify the reviewed spec or sk-code resource documents.
- Do not reopen unrelated content-quality concerns unless they contradict this packet's completion claims.
- Do not review paths outside the spec packet and the three declared sk-code surface resource/asset trees.

## 5. STOP CONDITIONS

- Dispatch exactly four iterations under `stopPolicy=max-iterations` unless an unrecoverable workflow error occurs.
- Treat convergence before iteration 4 as telemetry and broaden the next angle.
- Never stop with missing iteration narrative, canonical JSONL record, or delta file.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | PASS (4/5) | 1 | 163-file current-state structure, naming, overview order, duplicate, and link checks passed; historical preservation was not replayed. |
| Security | PASS (4/5) | 2 | Documentation-only scope confirmed; one packet-added usage wrapper frames a pre-existing unconstrained script loader too broadly (P2). |
| Traceability | PASS (4/5) | 3 | R1-R3/R5 and current corpus evidence align; stale follow-up prose and non-replayable checklist/task evidence contracts produced two P2 advisories. |
| Maintainability | PASS (4/5) | 4 | Template/validator/link-scan ownership is documented; stabilization found no new P0/P1 and carried the three distinct P2 advisories unchanged. |

<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 3 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Iteration 1: A scope-wide deterministic sweep reproduced the 163-file 65/95/3 distribution and narrowed two literal-heading candidates plus one documented link exception for direct adjudication.
- Iteration 1: Focused reads ruled out all three candidates without severity inflation; direct packet evidence remained sufficient after Spec Memory was unavailable.
- Iteration 2: Exact sink searches narrowed security-sensitive examples to dynamic scripts, cookies, DOM sinks, shell input, and secrets; focused reads separated clearly labeled anti-patterns from one in-scope framing advisory.
- Iteration 2: Counterevidence in the remediated third-party loader supplied the concrete allowlist/SRI model needed to scope P2-001 without escalating it.
- Iteration 3: Explicit-root corpus inventories reconciled the current 65/95/3 distribution without repeating the prior broad-root scope error.
- Iteration 3: Packet-to-resource reads separated current implementation truth from stale follow-up prose and preserved historical provenance as an explicit limitation.
- Iteration 4: Packet-level template, validator, surface-scan, and whole-hub link guidance supplied durable maintenance ownership without requiring a new advisory.
- Iteration 4: Direct rereads kept P2-001, P2-002, and P2-003 distinct and unchanged while the stabilization search found no overlooked P0/P1 class.

## 9. WHAT FAILED

- Spec Memory context lookup timed out twice; packet docs and direct file evidence are the fallback.
- Iteration 1: The rendered prompt names review-depth v2 envelopes but omits their field-level schema; the canonical record retains explicit applicability, selection, coverage, ledger, and limitations.
- Iteration 2: Historical provenance for risky body snippets was not replayed against a pre-change baseline; the iteration relies on the packet's R4 preservation claim and limits the active finding to current wrapper framing.
- Iteration 3: Historical R4 preservation, commit sequencing, and push evidence remain non-replayable because task/checklist rows do not carry the commands or output pointers their protocols claim.
- Iteration 4: The declared `code-quality/references` root is absent; one scoped Grep request returned parent-directory hits, which were discarded and cannot support review conclusions.

## 10. EXHAUSTED APPROACHES (do not retry)

- Repeated Spec Memory calls are blocked for this lineage after two timeouts; use direct reads and exact searches.
- The absent `code-quality/references` root must not be searched again; treat it as empty and use only the existing `code-quality/assets` root at synthesis.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Resource-map coverage: target packet has no `resource-map.md`; the workflow coverage gate is skipped.
- Iteration 1: Two apparent missing `When to Use` headings were semantic-heading variants with concrete usage content; ruled out by direct reads.
- Iteration 1: The illustrative `/specs/005-example.com/...` link is the documented pre-existing non-navigational artifact, not a renamed-file referrer.
- Iteration 1 limitation: historical verbatim-content preservation was not replayed against a pre-change baseline and remains explicit traceability follow-up.
- Iteration 2: The disclosed cookie contradiction is no longer current because the file now distinguishes non-sensitive client-set cookies from server-set `HttpOnly` session cookies.
- Iteration 2: The disclosed arbitrary-input third-party loader concern is no longer current because the file now validates HTTPS, allowlists hosts, and notes SRI.
- Iteration 2: P0/P1 escalation for the remaining `resource_loading.md` loader was ruled out because its shown caller uses a static URL and the reviewed target is documentation-only.
- Iteration 3: Current cookie and allowlist defects named by the summary follow-up were ruled out by live file reads; the defect is stale packet prose, not current resource behavior.
- Iteration 3: P2-001 refinement/duplication was ruled out because the traceability findings concern packet evidence and handoff wording rather than the existing loader-framing instance.
- Iteration 4: A new generic ownership finding was ruled out because the packet names the template/package authority, per-file validator, snake-case scan, and whole-hub link scan.
- Iteration 4: P2-001/P2-002/P2-003 merge, refinement, severity change, and resolution were ruled out; their producers and remediation surfaces remain distinct.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: synthesis/adversarial replay
- Focus area: terminal synthesis of cumulative findings and adversarial replay of carried gate-relevant claims
- Reason: all four dimensions are complete at the max-iteration boundary with three active P2 advisories and no P0/P1
- Rotation status: 4 of 4 dimensions complete; no fifth review iteration
- Blocked/productive carry-forward: historical baseline replay and the absent `code-quality/references` root remain exhausted; direct cited evidence and cumulative state remain productive
- Required evidence: reconcile P2-001/P2-002/P2-003 against the registry, replay release gates, preserve R4 search debt, and verify state/delta identity before final report rendering
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and all Markdown under the declared `code-opencode`, `code-webflow`, and `code-quality` reference/asset trees.
- Behavior claims: 163 files conform; all split names are snake_case; required frontmatter/version/overview structure is present; substantive content is preserved; renamed-file references resolve.
- Reuse and conventions: create-skill resource templates and `validate_document.py` are the documented authorities.
- Review risks and gaps: memory retrieval is unavailable; the packet notes that surface `SKILL.md` package checks and two pre-existing non-navigational artifacts are out of scope.
- Resource map: `resource-map.md` not present; skipping coverage gate.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | R1-R3/R5 current-state checks pass; R4 historical preservation baseline was not replayed. |
| `checklist_evidence` | core | partial | 3 | All 26 checked claims reconciled; current-state claims corroborate, while absent command/replay pointers produced P2-003. |
| `completion_follow_up` | focused | partial | 3 | Two named content defects are fixed in current files, but the summary still presents them as active follow-up (P2-002). |
| `security_scope_claim` | focused | partial | 2 | Documentation-only/no-executable claim holds; one packet-added usage wrapper creates a P2 recommendation-framing advisory. |
| `feature_catalog_code` | overlay | notApplicable | - | No feature catalog is part of the target. |
| `playbook_capability` | overlay | notApplicable | - | No manual testing playbook is part of the target. |

<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File or scope | Dimensions Reviewed | Last Iteration | Findings | Status |
|---------------|---------------------|----------------|----------|--------|
| `.opencode/specs/sk-code/019-split-doc-template-alignment/*.md` | correctness, security, traceability, maintainability | 4 | 2 P2 | maintenance authority is explicit; stale follow-up prose and non-replayable evidence-row contracts remain |
| `.opencode/skills/sk-code/code-opencode/{references,assets}/**/*.md` | correctness, security, traceability, maintainability | 4 | 0 | no new packet-caused maintenance blocker found by explicit-root stabilization search |
| `.opencode/skills/sk-code/code-webflow/{references,assets}/**/*.md` | correctness, security, traceability, maintainability | 4 | 1 P2 | P2-001 remains active and distinct; P2-002 counterevidence remains current |
| `.opencode/skills/sk-code/code-quality/{references,assets}/**/*.md` | correctness, security, traceability, maintainability | 4 | 0 | three asset files remain the existing surface; absent references root is exhausted |

<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: sessionId=`fanout-confirm-a-1783921047347-ky9ry5`, parentSessionId=null, generation=1, lineageMode=new
- Artifact root: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-confirm/lineages/confirm-a`
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness state: in-progress
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=`spec_code,checklist_evidence`; overlays=`feature_catalog_code,playbook_capability`
- Started: 2026-07-13T05:42:21Z
<!-- MACHINE-OWNED: END -->

## RELATED RESOURCES

- `.opencode/skills/system-deep-loop/deep-review/SKILL.md`
- `.opencode/commands/deep/assets/deep_review_auto.yaml`

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
- P1 (Required): 0
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence` (hard): **partial / one advisory evidence gap**. All 26 checked task/checklist claims were reconciled. Current corpus, naming, structure, and narrowed link claims are consistent [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:38-61`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-60,87-97`], while P2-003 records the absent command/replay evidence for historical and process claims. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` (hard): **partial / one advisory evidence gap**. All 26 checked task/checklist claims were reconciled. Current corpus, naming, structure, and narrowed link claims are consistent [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:38-61`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-60,87-97`], while P2-003 records the absent command/replay evidence for historical and process claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (hard): **partial / one advisory evidence gap**. All 26 checked task/checklist claims were reconciled. Current corpus, naming, structure, and narrowed link claims are consistent [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/tasks.md:38-61`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-60,87-97`], while P2-003 records the absent command/replay evidence for historical and process claims.

### `checklist_evidence`: **partial / current-state checks pass**. The count, naming, structural, duplicate, and link checks corroborate the checked testing rows [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-52`] and the 163/65/95/3 summary [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-46`]. Historical content preservation and commit-message evidence were not replayed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: **partial / current-state checks pass**. The count, naming, structural, duplicate, and link checks corroborate the checked testing rows [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-52`] and the 163/65/95/3 summary [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-46`]. Historical content preservation and commit-message evidence were not replayed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **partial / current-state checks pass**. The count, naming, structural, duplicate, and link checks corroborate the checked testing rows [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:38-52`] and the 163/65/95/3 summary [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-46`]. Historical content preservation and commit-message evidence were not replayed.

### `checklist_evidence`: **partial / P2-003 carried**. Current-state gates are described, but commands and replay pointers are still absent from checked rows [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25,48-60,87-95`]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: **partial / P2-003 carried**. Current-state gates are described, but commands and replay pointers are still absent from checked rows [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25,48-60,87-95`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **partial / P2-003 carried**. Current-state gates are described, but commands and replay pointers are still absent from checked rows [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:23-25,48-60,87-95`].

### `maintainability_supportability`: **partial / advisory-only debt**. The packet names the template, per-file validator, surface scans, and whole-hub link scan as the durable maintenance mechanism [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:33-38,61-72`], while P2-002 and P2-003 preserve the stale-handoff and replayability costs rather than silently converting them into a clean pass. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `maintainability_supportability`: **partial / advisory-only debt**. The packet names the template, per-file validator, surface scans, and whole-hub link scan as the durable maintenance mechanism [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:33-38,61-72`], while P2-002 and P2-003 preserve the stale-handoff and replayability costs rather than silently converting them into a clean pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maintainability_supportability`: **partial / advisory-only debt**. The packet names the template, per-file validator, surface scans, and whole-hub link scan as the durable maintenance mechanism [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:33-38,61-72`], while P2-002 and P2-003 preserve the stale-handoff and replayability costs rather than silently converting them into a clean pass.

### `preservation_provenance`: **partial / baseline not replayed**. The packet explicitly says substantive body content was preserved and only structure was added [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-48`]. No pre-change baseline was replayed in this bounded iteration, so the loader body's age is accepted from packet evidence while the current wrapper is reviewed directly. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `preservation_provenance`: **partial / baseline not replayed**. The packet explicitly says substantive body content was preserved and only structure was added [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-48`]. No pre-change baseline was replayed in this bounded iteration, so the loader body's age is accepted from packet evidence while the current wrapper is reviewed directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `preservation_provenance`: **partial / baseline not replayed**. The packet explicitly says substantive body content was preserved and only structure was added [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:39-48`]. No pre-change baseline was replayed in this bounded iteration, so the loader body's age is accepted from packet evidence while the current wrapper is reviewed directly.

### `security_scope_claim`: **partial / advisory only**. The declared deliverables are Markdown-only and add no executable tooling [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68`]. One packet-added usage wrapper nevertheless broadens the recommendation framing around a pre-existing unconstrained script-loader example, producing P2-001 rather than a P0/P1 gate failure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `security_scope_claim`: **partial / advisory only**. The declared deliverables are Markdown-only and add no executable tooling [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68`]. One packet-added usage wrapper nevertheless broadens the recommendation framing around a pre-existing unconstrained script-loader example, producing P2-001 rather than a P0/P1 gate failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `security_scope_claim`: **partial / advisory only**. The declared deliverables are Markdown-only and add no executable tooling [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`; `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md:65-68`]. One packet-added usage wrapper nevertheless broadens the recommendation framing around a pre-existing unconstrained script-loader example, producing P2-001 rather than a P0/P1 gate failure.

### `spec_code` (hard): **partial / current-state alignment passes**. R1-R3 and R5 agree across the requirement list, the live 163-file inventory, the prior deterministic current-tree sweep, and the completion tables [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-48,71-79`]. R4 remains historical provenance that cannot be proved from the current tree and was not retried after the strategy marked baseline replay blocked. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` (hard): **partial / current-state alignment passes**. R1-R3 and R5 agree across the requirement list, the live 163-file inventory, the prior deterministic current-tree sweep, and the completion tables [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-48,71-79`]. R4 remains historical provenance that cannot be proved from the current tree and was not retried after the strategy marked baseline replay blocked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (hard): **partial / current-state alignment passes**. R1-R3 and R5 agree across the requirement list, the live 163-file inventory, the prior deterministic current-tree sweep, and the completion tables [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:64-71`; `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md:37-48,71-79`]. R4 remains historical provenance that cannot be proved from the current tree and was not retried after the strategy marked baseline replay blocked.

### `spec_code`: **partial / carried search debt**. R1-R3/R5 remain supported by current packet evidence; historical R4 preservation still requires the unavailable pre-change baseline and was not retried [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: **partial / carried search debt**. R1-R3/R5 remain supported by current packet evidence; historical R4 preservation still requires the unavailable pre-change baseline and was not retried [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **partial / carried search debt**. R1-R3/R5 remain supported by current packet evidence; historical R4 preservation still requires the unavailable pre-change baseline and was not retried [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`].

### `spec_code`: **partial / current-state checks pass**. R1-R3 and R5 were checked against the 163-file current tree and the completion evidence [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`]. R4 is a historical preservation claim and was not replayed against a pre-change baseline in this bounded iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: **partial / current-state checks pass**. R1-R3 and R5 were checked against the 163-file current tree and the completion evidence [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`]. R4 is a historical preservation claim and was not replayed against a pre-change baseline in this bounded iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **partial / current-state checks pass**. R1-R3 and R5 were checked against the 163-file current tree and the completion evidence [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-71`]. R4 is a historical preservation claim and was not replayed against a pre-change baseline in this bounded iteration.

### `stabilization_replay`: **pass for P0/P1 discovery**. Current packet scope is documentation-only [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`], the active surfaces were reread, and no maintainability defect with must-fix correctness, spec, or security impact was evidenced. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `stabilization_replay`: **pass for P0/P1 discovery**. Current packet scope is documentation-only [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`], the active surfaces were reread, and no maintainability defect with must-fix correctness, spec, or security impact was evidenced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `stabilization_replay`: **pass for P0/P1 discovery**. Current packet scope is documentation-only [SOURCE: `.opencode/specs/sk-code/019-split-doc-template-alignment/plan.md:23-29`], the active surfaces were reread, and no maintainability defect with must-fix correctness, spec, or security impact was evidenced.

### A new or refined P2-001: ruled out because the traceability defect is stale packet prose, not the separate `resource_loading.md` framing advisory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A new or refined P2-001: ruled out because the traceability defect is stale packet prose, not the separate `resource_loading.md` framing advisory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new or refined P2-001: ruled out because the traceability defect is stale packet prose, not the separate `resource_loading.md` framing advisory.

### Active arbitrary-input flaw in `best_practices_and_summary.md`: ruled out by HTTPS parsing, host allowlisting, and the SRI note at lines 39-60. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Active arbitrary-input flaw in `best_practices_and_summary.md`: ruled out by HTTPS parsing, host allowlisting, and the SRI note at lines 39-60.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Active arbitrary-input flaw in `best_practices_and_summary.md`: ruled out by HTTPS parsing, host allowlisting, and the SRI note at lines 39-60.

### Active cookie good-vs-bad contradiction: ruled out by the explicit non-sensitive/client-set versus sensitive/server-set distinction at lines 91-100 and 237-260. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Active cookie good-vs-bad contradiction: ruled out by the explicit non-sensitive/client-set versus sensitive/server-set distinction at lines 91-100 and 237-260.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Active cookie good-vs-bad contradiction: ruled out by the explicit non-sensitive/client-set versus sensitive/server-set distinction at lines 91-100 and 237-260.

### Broken renamed-file reference in `webflow_constraints.md`: ruled out because the candidate is the packet-documented illustrative absolute example, not a renamed-file referrer. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Broken renamed-file reference in `webflow_constraints.md`: ruled out because the candidate is the packet-documented illustrative absolute example, not a renamed-file referrer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broken renamed-file reference in `webflow_constraints.md`: ruled out because the candidate is the packet-documented illustrative absolute example, not a renamed-file referrer.

### Current arbitrary-input defect in `best_practices_and_summary.md`: ruled out by protocol and host validation plus the SRI guidance. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Current arbitrary-input defect in `best_practices_and_summary.md`: ruled out by protocol and host validation plus the SRI guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Current arbitrary-input defect in `best_practices_and_summary.md`: ruled out by protocol and host validation plus the SRI guidance.

### Current cookie contradiction: ruled out by the explicit non-sensitive client-cookie versus sensitive server-cookie distinction. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Current cookie contradiction: ruled out by the explicit non-sensitive client-cookie versus sensitive server-cookie distinction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Current cookie contradiction: ruled out by the explicit non-sensitive client-cookie versus sensitive server-cookie distinction.

### Duplicate/refinement event across P2-001, P2-002, and P2-003: ruled out because each has a separate producer, impact, and fix surface. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Duplicate/refinement event across P2-001, P2-002, and P2-003: ruled out because each has a separate producer, impact, and fix surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate/refinement event across P2-001, P2-002, and P2-003: ruled out because each has a separate producer, impact, and fix surface.

### Historical preservation replay: deferred, not ruled out; the pre-change baseline remains unavailable and the approach is exhausted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Historical preservation replay: deferred, not ruled out; the pre-change baseline remains unavailable and the approach is exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Historical preservation replay: deferred, not ruled out; the pre-change baseline remains unavailable and the approach is exhausted.

### Missing When-to-Use content in `mutation_and_intersection.md`: ruled out by the observer-vs-polling decision table at lines 25-34. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing When-to-Use content in `mutation_and_intersection.md`: ruled out by the observer-vs-polling decision table at lines 25-34.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing When-to-Use content in `mutation_and_intersection.md`: ruled out by the observer-vs-polling decision table at lines 25-34.

### Missing When-to-Use content in `tokens_state_machine_and_triggers.md`: ruled out by the explicit scenario list at lines 33-39. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing When-to-Use content in `tokens_state_machine_and_triggers.md`: ruled out by the explicit scenario list at lines 33-39.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing When-to-Use content in `tokens_state_machine_and_triggers.md`: ruled out by the explicit scenario list at lines 33-39.

### New generic ownership advisory: ruled out because the packet already identifies the template/package authority and verification mechanism; a vague request for more ownership prose would not be actionable. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: New generic ownership advisory: ruled out because the packet already identifies the template/package authority and verification mechanism; a vague request for more ownership prose would not be actionable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New generic ownership advisory: ruled out because the packet already identifies the template/package authority and verification mechanism; a vague request for more ownership prose would not be actionable.

### New P0/P1 maintainability finding: ruled out because no current documentation structure or ownership ambiguity was shown to break a required contract, and the target introduces no executable behavior. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: New P0/P1 maintainability finding: ruled out because no current documentation structure or ownership ambiguity was shown to break a required contract, and the target introduces no executable behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New P0/P1 maintainability finding: ruled out because no current documentation structure or ownership ambiguity was shown to break a required contract, and the target introduces no executable behavior.

### P0/P1 escalation for either new finding: ruled out because both concern replayability/handoff quality, while current resource conformance remains corroborated and no executable behavior changed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: P0/P1 escalation for either new finding: ruled out because both concern replayability/handoff quality, while current resource conformance remains corroborated and no executable behavior changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P0/P1 escalation for either new finding: ruled out because both concern replayability/handoff quality, while current resource conformance remains corroborated and no executable behavior changed.

### P0/P1 escalation for P2-001: ruled out because the only shown call passes a static example URL, no untrusted caller is evidenced, and the target is documentation-only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: P0/P1 escalation for P2-001: ruled out because the only shown call passes a static example URL, no untrusted caller is evidenced, and the target is documentation-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P0/P1 escalation for P2-001: ruled out because the only shown call passes a static example URL, no untrusted caller is evidenced, and the target is documentation-only.

### Structural graph analysis: not applicable to this Markdown/current-tree stabilization pass; cited graphless direct reads and explicit-root searches cover the selected bug classes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Structural graph analysis: not applicable to this Markdown/current-tree stabilization pass; cited graphless direct reads and explicit-root searches cover the selected bug classes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural graph analysis: not applicable to this Markdown/current-tree stabilization pass; cited graphless direct reads and explicit-root searches cover the selected bug classes.

### Structural-impact analysis: not applicable to this documentation-corpus/current-tree review; no local unified diff was declared. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Structural-impact analysis: not applicable to this documentation-corpus/current-tree review; no local unified diff was declared.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural-impact analysis: not applicable to this documentation-corpus/current-tree review; no local unified diff was declared.

### Structural-impact graph analysis: not applicable to this Markdown corpus/current-tree review; graphless exact-search and direct-read evidence covers the security bug classes selected here. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Structural-impact graph analysis: not applicable to this Markdown corpus/current-tree review; graphless exact-search and direct-read evidence covers the security bug classes selected here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural-impact graph analysis: not applicable to this Markdown corpus/current-tree review; graphless exact-search and direct-read evidence covers the security bug classes selected here.

### Unsafe `eval`, shell-input, DOM-sink, and hardcoded-secret snippets presented as recommendations: ruled out because the inspected occurrences are explicitly labeled dangerous/bad or paired with safe alternatives. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Unsafe `eval`, shell-input, DOM-sink, and hardcoded-secret snippets presented as recommendations: ruled out because the inspected occurrences are explicitly labeled dangerous/bad or paired with safe alternatives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unsafe `eval`, shell-input, DOM-sink, and hardcoded-secret snippets presented as recommendations: ruled out because the inspected occurrences are explicitly labeled dangerous/bad or paired with safe alternatives.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis/adversarial replay - Focus area: terminal synthesis of cumulative findings and adversarial replay of carried gate-relevant claims - Reason: all four configured dimensions are complete; the loop is at its max-iteration boundary with three active P2 advisories and no P0/P1 - Rotation status: 4 of 4 dimensions complete; no fifth review iteration - Blocked/productive carry-forward: historical baseline replay and the absent `code-quality/references` root remain exhausted; direct cited evidence and cumulative state remain productive for synthesis - Required evidence: reconcile P2-001/P2-002/P2-003 against the registry, replay release gates, preserve the R4 search debt, and verify state/delta identity before rendering the final report Review verdict: PASS

<!-- /ANCHOR:next-focus -->
