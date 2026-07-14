---
title: Deep Review Strategy - xhigh-c
description: Detached lineage strategy for the sk-code split-document template-alignment verification review.
---

# Deep Review Strategy - xhigh-c

## 1. TOPIC

Review `.opencode/specs/sk-code/019-split-doc-template-alignment` against the Markdown deliverables selected by its configured scope globs.

## 2. REVIEW CHARTER

- Target: `.opencode/specs/sk-code/019-split-doc-template-alignment` (`spec-folder`)
- Scope: the Markdown files under the configured reference/asset roots, with canonical packet docs used for traceability. Independent iteration-3 enumeration confirms 163 lexical-unique Markdown path entries (160 resolved document targets because three shared workflow documents are each exposed by two surface symlinks).
- Non-goals: implementation fixes, files outside the configured roots, surface `SKILL.md` header conformance, and changes to the reviewed target.
- Stop condition: dispatch all four configured iterations; convergence before iteration 4 is telemetry only.

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
- P1 (Required): 2
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 6. WHAT WORKED

- Iteration 1: Forced-type validation plus an independent opening-shape/link/frontmatter scan covered all 163 configured files; direct rereads confirmed the single wrapper defect and the seven-instance intro-length advisory.
- Iteration 2: Scope-corrected security searches plus direct counterevidence reads isolated contradictory session-cookie guidance and a CDN-loader hardening gap while ruling out endorsed hardcoded secrets, client-only authorization, direct input execution, and destructive shell bootstrap guidance.
- Iteration 3: Independent enumeration reconciled the command-owned Markdown scope at 163 lexical entries, executed both core traceability protocols by narrow evidence reads, and classified both overlays as evidence-backed notApplicable without repeating saturated sweeps.
- Iteration 4: Exact maintainability searches isolated six tautological `When to Use` sections; direct reads against the create-skill reference template confirmed one new P2. Narrow counterevidence rereads preserved all four prior findings without duplication, and git history established representative rename lineage for two content-preservation samples.

## 7. WHAT FAILED

- Memory trigger and focused context retrieval timed out at initialization; direct packet evidence is the fallback.
- Iteration 1: `validate_document.py` alone could not prove R3 because its no-numbered-H2 path accepts the malformed Rust reference; validation success was retained as counterevidence rather than treated as conformance proof.
- Iteration 2: An initial directory-level discovery search surfaced six non-Markdown asset files outside the rendered `**/*.md` scope. Those hits were discarded, the search was rerun with `--glob '*.md'`, and no finding relies on the excluded files.
- Iteration 3: Iteration 2's 157-count explanation was disproved. Ripgrep-style discovery omitted six symlink entries; all 163 configured matches are Markdown, representing 160 unique resolved document targets.
- Iteration 4: Two representative rename diffs showed 81% and 90% similarity with substantive body lines retained, but narrow history cannot prove R4 across the other 158 resolved targets; `content_preservation` remains deferred rather than passed.

## 8. RULED OUT DIRECTIONS

- Runtime behavior and executable security paths: the packet is documentation-only and claims no runtime changes.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence` (core): **failed, carried forward without re-execution** -- prior validator evidence still cannot establish R3; no checklist sweep was repeated. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence` (core): **failed, carried forward without re-execution** -- prior validator evidence still cannot establish R3; no checklist sweep was repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **failed, carried forward without re-execution** -- prior validator evidence still cannot establish R3; no checklist sweep was repeated.

### `checklist_evidence` (core): **failed, carried forward without re-execution** -- the blocked validator-evidence approach was not retried. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` (core): **failed, carried forward without re-execution** -- the blocked validator-evidence approach was not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **failed, carried forward without re-execution** -- the blocked validator-evidence approach was not retried.

### `checklist_evidence` (core): **failed** -- `checklist.md:49` records a real 163/163 validator pass, but that checker does not establish the wrapper invariant for a file with no numbered H2. The completion evidence is therefore insufficient for R3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core): **failed** -- `checklist.md:49` records a real 163/163 validator pass, but that checker does not establish the wrapper invariant for a file with no numbered H2. The completion evidence is therefore insufficient for R3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): **failed** -- `checklist.md:49` records a real 163/163 validator pass, but that checker does not establish the wrapper invariant for a file with no numbered H2. The completion evidence is therefore insufficient for R3.

### `feature_catalog_code` / `playbook_capability` (overlay): **notApplicable, carried forward** -- iteration 3 resolved applicability from packet scope; no overlay sweep was repeated. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code` / `playbook_capability` (overlay): **notApplicable, carried forward** -- iteration 3 resolved applicability from packet scope; no overlay sweep was repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` / `playbook_capability` (overlay): **notApplicable, carried forward** -- iteration 3 resolved applicability from packet scope; no overlay sweep was repeated.

### `feature_catalog_code` / `playbook_capability` (overlay): **pending** -- not executed in the security dimension; their strategy entries are marked blocked and must not be retried without a later protocol-resolution decision. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code` / `playbook_capability` (overlay): **pending** -- not executed in the security dimension; their strategy entries are marked blocked and must not be retried without a later protocol-resolution decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` / `playbook_capability` (overlay): **pending** -- not executed in the security dimension; their strategy entries are marked blocked and must not be retried without a later protocol-resolution decision.

### `feature_catalog_code` / `playbook_capability`: **pending** -- not required for the correctness focus and preserved for a later traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code` / `playbook_capability`: **pending** -- not required for the correctness focus and preserved for a later traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` / `playbook_capability`: **pending** -- not required for the correctness focus and preserved for a later traceability iteration.

### `skill_agent` / `agent_cross_runtime`: **notApplicable** -- the target is a spec-folder/document corpus, not an agent definition. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent` / `agent_cross_runtime`: **notApplicable** -- the target is a spec-folder/document corpus, not an agent definition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` / `agent_cross_runtime`: **notApplicable** -- the target is a spec-folder/document corpus, not an agent definition.

### `spec_code` (core): **failed, carried forward without re-execution** -- iteration 1's active R3 mismatch remains open; the saturated correctness structural sweep was not repeated. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` (core): **failed, carried forward without re-execution** -- iteration 1's active R3 mismatch remains open; the saturated correctness structural sweep was not repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **failed, carried forward without re-execution** -- iteration 1's active R3 mismatch remains open; the saturated correctness structural sweep was not repeated.

### `spec_code` (core): **failed, carried forward without re-execution** -- the active R3 mismatch remains represented by `I1-P1-001`; the saturated traceability protocol was not repeated. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` (core): **failed, carried forward without re-execution** -- the active R3 mismatch remains represented by `I1-P1-001`; the saturated traceability protocol was not repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **failed, carried forward without re-execution** -- the active R3 mismatch remains represented by `I1-P1-001`; the saturated traceability protocol was not repeated.

### `spec_code` (core): **failed** -- R3 requires the wrapper on every scoped file, but `interop_errors_and_parity.md:19` begins substantive content without it. The 1-2 sentence intro rule also has seven advisory mismatches. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core): **failed** -- R3 requires the wrapper on every scoped file, but `interop_errors_and_parity.md:19` begins substantive content without it. The 1-2 sentence intro rule also has seven advisory mismatches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): **failed** -- R3 requires the wrapper on every scoped file, but `interop_errors_and_parity.md:19` begins substantive content without it. The 1-2 sentence intro rule also has seven advisory mismatches.

### A full R4 content-preservation pass: ruled out; two representative rename diffs cannot prove all 160 resolved targets. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A full R4 content-preservation pass: ruled out; two representative rename diffs cannot prove all 160 resolved targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A full R4 content-preservation pass: ruled out; two representative rename diffs cannot prove all 160 resolved targets.

### A new finding for split-title description suffixes: ruled out as a consistent disambiguation pattern aligned with the intro/description template contract. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A new finding for split-title description suffixes: ruled out as a consistent disambiguation pattern aligned with the intro/description template contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding for split-title description suffixes: ruled out as a consistent disambiguation pattern aligned with the intro/description template contract.

### A new traceability finding for the active R3 mismatch: ruled out as a duplicate of `I1-P1-001`; the current read confirms rather than expands it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A new traceability finding for the active R3 mismatch: ruled out as a duplicate of `I1-P1-001`; the current read confirms rather than expands it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new traceability finding for the active R3 mismatch: ruled out as a duplicate of `I1-P1-001`; the current read confirms rather than expands it.

### Broken scoped navigational Markdown-link class: ruled out by a fenced-code-aware relative-link scan. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Broken scoped navigational Markdown-link class: ruled out by a fenced-code-aware relative-link scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broken scoped navigational Markdown-link class: ruled out by a fenced-code-aware relative-link scan.

### Client-side-only authorization as approved guidance: ruled out by the explicit server-verification requirement. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Client-side-only authorization as approved guidance: ruled out by the explicit server-verification requirement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Client-side-only authorization as approved guidance: ruled out by the explicit server-verification requirement.

### Content-preservation R4: **deferred, narrowed but unresolved** -- git history traces two representative files through 81% and 90% similarity renames and shows their substantive body lines retained while wrappers, numbering, and renamed links changed. That is useful counterevidence, but it does not prove verbatim preservation for the other 158 resolved targets, so the full-corpus debt remains deferred. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Content-preservation R4: **deferred, narrowed but unresolved** -- git history traces two representative files through 81% and 90% similarity renames and shows their substantive body lines retained while wrappers, numbering, and renamed links changed. That is useful counterevidence, but it does not prove verbatim preservation for the other 158 resolved targets, so the full-corpus debt remains deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Content-preservation R4: **deferred, narrowed but unresolved** -- git history traces two representative files through 81% and 90% similarity renames and shows their substantive body lines retained while wrappers, numbering, and renamed links changed. That is useful counterevidence, but it does not prove verbatim preservation for the other 158 resolved targets, so the full-corpus debt remains deferred.

### Content-preservation R4: **deferred** -- no pre-transformation manifest/content baseline was available in this iteration; absence of evidence was not converted into a pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Content-preservation R4: **deferred** -- no pre-transformation manifest/content baseline was available in this iteration; absence of evidence was not converted into a pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Content-preservation R4: **deferred** -- no pre-transformation manifest/content baseline was available in this iteration; absence of evidence was not converted into a pass.

### Destructive shell bootstrap guidance in the Markdown scope: ruled out by exact search. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Destructive shell bootstrap guidance in the Markdown scope: ruled out by exact search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Destructive shell bootstrap guidance in the Markdown scope: ruled out by exact search.

### Direct execution of user input as approved guidance: ruled out; all matched examples were negative demonstrations. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Direct execution of user input as approved guidance: ruled out; all matched examples were negative demonstrations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct execution of user input as approved guidance: ruled out; all matched examples were negative demonstrations.

### Duplicate findings for `I1-P1-001`, `I2-P1-001`, `I1-P2-001`, and `I2-P2-001`: ruled out because current evidence reconfirms the registered claims without expanding their scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Duplicate findings for `I1-P1-001`, `I2-P1-001`, `I1-P2-001`, and `I2-P2-001`: ruled out because current evidence reconfirms the registered claims without expanding their scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate findings for `I1-P1-001`, `I2-P1-001`, `I1-P2-001`, and `I2-P2-001`: ruled out because current evidence reconfirms the registered claims without expanding their scope.

### Endorsed hardcoded-secret guidance: ruled out by exact search plus the direct secret-management read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Endorsed hardcoded-secret guidance: ruled out by exact search plus the direct secret-management read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Endorsed hardcoded-secret guidance: ruled out by exact search plus the direct secret-management read.

### Exact intro/Purpose duplication class: ruled out across 163 files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Exact intro/Purpose duplication class: ruled out across 163 files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Exact intro/Purpose duplication class: ruled out across 163 files.

### Hyphenated scoped filename class: ruled out across 163 files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Hyphenated scoped filename class: ruled out across 163 files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hyphenated scoped filename class: ruled out across 163 files.

### Missing frontmatter/version class: ruled out across 163 files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Missing frontmatter/version class: ruled out across 163 files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing frontmatter/version class: ruled out across 163 files.

### Security evidence: **complete for this iteration** -- each active security finding has direct Markdown file:line evidence and the P1 received an in-iteration skeptic/referee pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Security evidence: **complete for this iteration** -- each active security finding has direct Markdown file:line evidence and the P1 received an in-iteration skeptic/referee pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Security evidence: **complete for this iteration** -- each active security finding has direct Markdown file:line evidence and the P1 received an in-iteration skeptic/referee pass.

### The claim that six non-Markdown assets explain the prior discrepancy: ruled out because every one of the 163 matched entries has a `.md` suffix; the discrepancy comes from symlink traversal behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The claim that six non-Markdown assets explain the prior discrepancy: ruled out because every one of the 163 matched entries has a `.md` suffix; the discrepancy comes from symlink traversal behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The claim that six non-Markdown assets explain the prior discrepancy: ruled out because every one of the 163 matched entries has a `.md` suffix; the discrepancy comes from symlink traversal behavior.

### The claim that the explicit Markdown globs currently match only 157 files: ruled out by independent enumeration of all six configured patterns. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The claim that the explicit Markdown globs currently match only 157 files: ruled out by independent enumeration of all six configured patterns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The claim that the explicit Markdown globs currently match only 157 files: ruled out by independent enumeration of all six configured patterns.

### Unresolved `TODO`/`TBD`/`FIXME`/placeholder debt: ruled out; all scoped matches are instructional examples or named guidance. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Unresolved `TODO`/`TBD`/`FIXME`/placeholder debt: ruled out; all scoped matches are instructional examples or named guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Unresolved `TODO`/`TBD`/`FIXME`/placeholder debt: ruled out; all scoped matches are instructional examples or named guidance.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Do not widen into unrelated sk-code skills or runtime implementation.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: `synthesis` - Focus area: consolidate the two active P1s, three active P2s, failed core traceability gates, and deferred content-preservation debt into the planning packet. - Reason: all four configured dimensions are complete and iteration 4 is the required final pass under `max-iterations`. - Rotation status: correctness, security, traceability, and maintainability complete; stop the iteration loop. - Blocked/productive carry-forward: preserve exact finding IDs and the 163-path/160-target distinction; carry the six-instance `When to Use` class once and do not duplicate reconfirmed findings. - Required evidence: reducer-registry reconciliation, exact file:line citations, and the final conditional verdict with `hasAdvisories=true`. - Recovery note: `content_preservation` remains deferred for the 158 resolved targets not covered by the two representative rename diffs. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: six configured reference/asset roots totaling 163 Markdown path entries and 160 resolved document targets; packet docs are the governing claims.
- Behavior claims: five-field frontmatter, four-part versions, snake_case names, H1/intro/Overview structure, preserved substantive content, and repaired in-hub references.
- Reuse and conventions: create-skill reference/asset templates and `validate_document.py` are the stated authority.
- Review risks and gaps: prior post-ship review remediated duplicated Purpose text and narrowed a broken-link claim; memory MCP timed out; no packet resource map exists.
- Iteration 1 carry-forward: one active P1 wrapper omission; seven advisory intro-length mismatches; R4 content preservation remains unverified without a pre-transformation baseline; prior inventory distribution was stale although its total remained 163.
- Iteration 2 carry-forward: one new P1 for contradictory JavaScript session-cookie guidance and one new P2 for CDN-loader integrity/allowlist hardening.
- Iteration 3 carry-forward: the explicit Markdown globs independently match 163 path entries, not 157; six symlink paths expose three shared workflow documents under both surfaces, yielding 160 resolved targets. Core protocols remain failed on the active R3 mismatch; both overlays are notApplicable by packet scope.
- Iteration 4 carry-forward: six generated `When to Use` sections are too tautological to guide safe selection (new P2); all four prior findings remain active without duplication. Two representative git rename diffs narrow but do not close the R4 preservation debt.
- Out of scope: surface `SKILL.md` header shape and unrelated deep-loop artifacts.

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | failed | 1, 3 | Narrow current reread confirms the active R3 wrapper mismatch; no saturated sweep was repeated. |
| `checklist_evidence` | core | failed | 1, 3 | The real 163/163 validator result still does not establish R3 because the current wrapper counterexample remains. |
| `feature_catalog_code` | overlay | notApplicable | 3 | `spec.md:59` excludes feature-catalog files; the packet makes no feature-catalog capability claim. |
| `playbook_capability` | overlay | notApplicable | 3 | `spec.md:59` excludes manual-testing playbooks and `plan.md:26` declares no code/runtime change. |
| `skill_agent` | overlay | notApplicable | - | Target type is spec-folder. |
| `agent_cross_runtime` | overlay | notApplicable | - | Target type is spec-folder. |

## 14. FILES UNDER REVIEW

| Root | Files | Dimensions Reviewed | Status |
|------|------:|---------------------|--------|
| `.opencode/skills/sk-code/code-opencode/references/**/*.md` | 50 | correctness, security, traceability, maintainability | reviewed-with-findings |
| `.opencode/skills/sk-code/code-opencode/assets/**/*.md` | 15 | correctness, security, traceability, maintainability | reviewed-clean |
| `.opencode/skills/sk-code/code-webflow/references/**/*.md` | 86 | correctness, security, traceability, maintainability | reviewed-with-findings |
| `.opencode/skills/sk-code/code-webflow/assets/**/*.md` | 9 | correctness, security, traceability, maintainability | reviewed-clean |
| `.opencode/skills/sk-code/code-quality/references/**/*.md` | 0 | - | notApplicable |
| `.opencode/skills/sk-code/code-quality/assets/**/*.md` | 3 | correctness, security, traceability, maintainability | reviewed-clean |

## 15. REVIEW BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Session lineage: `fanout-xhigh-c-1783915428096-y929h9`, generation 1, lineageMode new
- Artifact root: `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-verify/lineages/xhigh-c`
- Writable boundary: artifact root only
- Resource map coverage gate: skipped because the packet has no `resource-map.md`
