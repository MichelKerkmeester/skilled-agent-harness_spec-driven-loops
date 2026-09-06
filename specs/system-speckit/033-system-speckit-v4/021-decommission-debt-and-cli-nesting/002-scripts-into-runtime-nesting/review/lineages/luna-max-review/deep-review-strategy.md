---
title: Deep Review Strategy
description: Lineage-local review strategy for the scripts-to-runtime nesting packet.
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

This strategy tracks the ten required inline passes. The review is bounded by `scratch/review-scope.txt`; convergence is telemetry only because the stop policy is `max-iterations`.

## 2. TOPIC

Review of `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting` and its declared 420-file scope.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] traceability
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS

- No source, target spec, generated repository artifact, git state, or external service changes.
- No execution of repository validation or test commands that may write outside this lineage.
- No resource-map coverage gate because no resource map existed at initialization.

## 5. STOP CONDITIONS

The workflow runs all ten iterations. A pause sentinel, malformed canonical state, or unrecoverable append refusal would be recorded as a blocker; convergence before iteration ten is not terminal.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
[None yet]

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 2
- P1 (Required): 9
- P2 (Suggestions): 0
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 8. WHAT WORKED

- Bounded source inspection and exact line citations are the primary evidence method.

## 9. WHAT FAILED

- Coverage-graph mutation is unavailable in this detached lineage because the user restricted all writes to this directory; graph status is recorded as unavailable.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: fail because the final review still has unresolved P0/P1 findings and the packet evidence has not been reconciled. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checklist_evidence`: fail because the final review still has unresolved P0/P1 findings and the packet evidence has not been reconciled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail because the final review still has unresolved P0/P1 findings and the packet evidence has not been reconciled.

### `checklist_evidence`: fail for F003; the packet reports broad test verification without a resolved proof that the moved CLI suite is discovered. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: fail for F003; the packet reports broad test verification without a resolved proof that the moved CLI suite is discovered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for F003; the packet reports broad test verification without a resolved proof that the moved CLI suite is discovered.

### `checklist_evidence`: fail for F004; completion evidence is present but contradictory across packet-owned documents and generated metadata. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: fail for F004; completion evidence is present but contradictory across packet-owned documents and generated metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for F004; completion evidence is present but contradictory across packet-owned documents and generated metadata.

### `checklist_evidence`: fail for F005; the moved package's own operational documentation does not resolve to the moved package. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: fail for F005; the moved package's own operational documentation does not resolve to the moved package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for F005; the moved package's own operational documentation does not resolve to the moved package.

### `checklist_evidence`: fail for F006 and F007; the claimed verification does not establish that registry entries or CI setup commands resolve after relocation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence`: fail for F006 and F007; the claimed verification does not establish that registry entries or CI setup commands resolve after relocation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for F006 and F007; the claimed verification does not establish that registry entries or CI setup commands resolve after relocation.

### `checklist_evidence`: fail for F008; the resolver inventory passes shape checks without proving that its file anchors resolve after relocation. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: fail for F008; the resolver inventory passes shape checks without proving that its file anchors resolve after relocation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for F008; the resolver inventory passes shape checks without proving that its file anchors resolve after relocation.

### `checklist_evidence`: fail for F009; the moved test evidence cannot be replayed from the paths recorded in the harnesses. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checklist_evidence`: fail for F009; the moved test evidence cannot be replayed from the paths recorded in the harnesses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for F009; the moved test evidence cannot be replayed from the paths recorded in the harnesses.

### `checklist_evidence`: fail remains active for F001/F009; residual tests do not provide evidence that would close either finding. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: fail remains active for F001/F009; residual tests do not provide evidence that would close either finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail remains active for F001/F009; residual tests do not provide evidence that would close either finding.

### `checklist_evidence`: partial; direct path guards are present, but the packet’s completion evidence does not reconcile the missing manifest and stale lockfile. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: partial; direct path guards are present, but the packet’s completion evidence does not reconcile the missing manifest and stale lockfile.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial; direct path guards are present, but the packet’s completion evidence does not reconcile the missing manifest and stale lockfile.

### `checklist_evidence`: partial; the packet records passing workspace/test evidence, but the required workspace manifest and lockfile state are inconsistent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial; the packet records passing workspace/test evidence, but the required workspace manifest and lockfile state are inconsistent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial; the packet records passing workspace/test evidence, but the required workspace manifest and lockfile state are inconsistent.

### `feature_catalog_code`: not applicable in this pass. -- BLOCKED (iteration 5, 4 attempts)
- What was tried: `feature_catalog_code`: not applicable in this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not applicable in this pass.

### `feature_catalog_code`: not applicable to this pass. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: not applicable to this pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not applicable to this pass.

### `feature_catalog_code`: partial; current runtime paths are used by the inspected executable tests, while F005 covers stale moved documentation. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `feature_catalog_code`: partial; current runtime paths are used by the inspected executable tests, while F005 covers stale moved documentation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: partial; current runtime paths are used by the inspected executable tests, while F005 covers stale moved documentation.

### `feature_catalog_code`: partial; current runtime surfaces are represented, but stale registry and documentation anchors remain active findings. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `feature_catalog_code`: partial; current runtime surfaces are represented, but stale registry and documentation anchors remain active findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: partial; current runtime surfaces are represented, but stale registry and documentation anchors remain active findings.

### `feature_catalog_code`: partial; feature-catalog references use the new runtime/cli paths, but the operational registry and workflow consumers do not. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `feature_catalog_code`: partial; feature-catalog references use the new runtime/cli paths, but the operational registry and workflow consumers do not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: partial; feature-catalog references use the new runtime/cli paths, but the operational registry and workflow consumers do not.

### `feature_catalog_code`: partial; feature-catalog tables mostly use runtime/cli paths, but the executable inventory is stale. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: partial; feature-catalog tables mostly use runtime/cli paths, but the executable inventory is stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: partial; feature-catalog tables mostly use runtime/cli paths, but the executable inventory is stale.

### `feature_catalog_code`: partial; most maintained CLI tests use `runtime/cli`, but these moved legacy harnesses still encode the retired tree. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `feature_catalog_code`: partial; most maintained CLI tests use `runtime/cli`, but these moved legacy harnesses still encode the retired tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: partial; most maintained CLI tests use `runtime/cli`, but these moved legacy harnesses still encode the retired tree.

### `playbook_capability`: fail for F005 and F002; operator-facing build and execution examples retain retired paths. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: fail for F005 and F002; operator-facing build and execution examples retain retired paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail for F005 and F002; operator-facing build and execution examples retain retired paths.

### `playbook_capability`: fail; a coverage audit driven by `SPEC_ROOT_RESOLVERS` can report evidence for nonexistent source paths. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: fail; a coverage audit driven by `SPEC_ROOT_RESOLVERS` can report evidence for nonexistent source paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail; a coverage audit driven by `SPEC_ROOT_RESOLVERS` can report evidence for nonexistent source paths.

### `playbook_capability`: fail; a test run can report a dependency/path failure or a skip instead of exercising the moved implementation. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `playbook_capability`: fail; a test run can report a dependency/path failure or a skip instead of exercising the moved implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail; a test run can report a dependency/path failure or a skip instead of exercising the moved implementation.

### `playbook_capability`: fail; CI, registry, resolver, package, and moved-harness defects prevent a trustworthy replay claim. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `playbook_capability`: fail; CI, registry, resolver, package, and moved-harness defects prevent a trustworthy replay claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail; CI, registry, resolver, package, and moved-harness defects prevent a trustworthy replay claim.

### `playbook_capability`: fail; registry-driven discovery and the two CI gates retain retired paths. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `playbook_capability`: fail; registry-driven discovery and the two CI gates retain retired paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: fail; registry-driven discovery and the two CI gates retain retired paths.

### `playbook_capability`: partial; current runtime and hook paths are coherent, but the active harness defects still reduce replay confidence. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `playbook_capability`: partial; current runtime and hook paths are coherent, but the active harness defects still reduce replay confidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; current runtime and hook paths are coherent, but the active harness defects still reduce replay confidence.

### `playbook_capability`: partial; freshness paths are updated, but the configured test proof does not cover the moved test root. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: partial; freshness paths are updated, but the configured test proof does not cover the moved test root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; freshness paths are updated, but the configured test proof does not cover the moved test root.

### `playbook_capability`: partial; production hook source selection is updated, but the separate execution handoff still names the retired memory path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability`: partial; production hook source selection is updated, but the separate execution handoff still names the retired memory path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; production hook source selection is updated, but the separate execution handoff still names the retired memory path.

### `playbook_capability`: partial; the execution handoff contains an obsolete executable path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: partial; the execution handoff contains an obsolete executable path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; the execution handoff contains an obsolete executable path.

### `playbook_capability`: partial; the packet documents the intended move and reports execution, but its handoff and metadata do not form one consistent state machine. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: partial; the packet documents the intended move and reports execution, but its handoff and metadata do not form one consistent state machine.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; the packet documents the intended move and reports execution, but its handoff and metadata do not form one consistent state machine.

### `spec_code`: fail due to active F001 and the packet's contradictory completion claims. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `spec_code`: fail due to active F001 and the packet's contradictory completion claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail due to active F001 and the packet's contradictory completion claims.

### `spec_code`: fail for F001; the declared workspace topology does not resolve to a package manifest. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: fail for F001; the declared workspace topology does not resolve to a package manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail for F001; the declared workspace topology does not resolve to a package manifest.

### `spec_code`: fail remains active because the missing nested workspace manifest invalidates a declared executable contract. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: fail remains active because the missing nested workspace manifest invalidates a declared executable contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active because the missing nested workspace manifest invalidates a declared executable contract.

### `spec_code`: fail remains active for F001; no new production root consumer was found in this partition. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: fail remains active for F001; no new production root consumer was found in this partition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active for F001; no new production root consumer was found in this partition.

### `spec_code`: fail remains active for F001; the CI and registry consumers also contradict the packet's claimed completed move. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: fail remains active for F001; the CI and registry consumers also contradict the packet's claimed completed move.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active for F001; the CI and registry consumers also contradict the packet's claimed completed move.

### `spec_code`: fail remains active for F001; the root-resolution calculation also remains dependent on the absent nested manifest. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: fail remains active for F001; the root-resolution calculation also remains dependent on the absent nested manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active for F001; the root-resolution calculation also remains dependent on the absent nested manifest.

### `spec_code`: fail remains active for F001; these harnesses add independent consumers of the incomplete nested package contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: fail remains active for F001; these harnesses add independent consumers of the incomplete nested package contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active for F001; these harnesses add independent consumers of the incomplete nested package contract.

### `spec_code`: fail remains active for the declared workspace and lockfile mismatch. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: fail remains active for the declared workspace and lockfile mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active for the declared workspace and lockfile mismatch.

### `spec_code`: fail remains active for the missing nested workspace manifest. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: fail remains active for the missing nested workspace manifest.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains active for the missing nested workspace manifest.

### `spec_code`: fail remains carried from the unresolved workspace manifest; a missing nested manifest changes the root selected by the config walk and therefore affects the executable’s approved-root calculations. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: fail remains carried from the unresolved workspace manifest; a missing nested manifest changes the root selected by the config walk and therefore affects the executable’s approved-root calculations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains carried from the unresolved workspace manifest; a missing nested manifest changes the root selected by the config walk and therefore affects the executable’s approved-root calculations.

### A finding for old-path strings in migration and metadata fixtures was not admitted because those strings are the explicit inputs under test and are not used as live filesystem roots. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A finding for old-path strings in migration and metadata fixtures was not admitted because those strings are the explicit inputs under test and are not used as live filesystem roots.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A finding for old-path strings in migration and metadata fixtures was not admitted because those strings are the explicit inputs under test and are not used as live filesystem roots.

### A mere source-fingerprint mismatch was ruled out by independently hashing all four source documents and comparing them with `graph-metadata.json:225-229`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A mere source-fingerprint mismatch was ruled out by independently hashing all four source documents and comparing them with `graph-metadata.json:225-229`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A mere source-fingerprint mismatch was ruled out by independently hashing all four source documents and comparing them with `graph-metadata.json:225-229`.

### A new symlink traversal vulnerability in the moved path helpers was not supported by the source inspection; canonicalization and relative containment are both applied. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A new symlink traversal vulnerability in the moved path helpers was not supported by the source inspection; canonicalization and relative containment are both applied.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new symlink traversal vulnerability in the moved path helpers was not supported by the source inspection; canonicalization and relative containment are both applied.

### A plain old-path grep was not used as the sole proof; the workspace manifest, lockfile, tree listing, package deletion, and executable handoff were inspected directly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A plain old-path grep was not used as the sole proof; the workspace manifest, lockfile, tree listing, package deletion, and executable handoff were inspected directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A plain old-path grep was not used as the sole proof; the workspace manifest, lockfile, tree listing, package deletion, and executable handoff were inspected directly.

### A production environment-variable redirection of the stop-hook executable was not supported; the override is test-gated. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A production environment-variable redirection of the stop-hook executable was not supported; the override is test-gated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A production environment-variable redirection of the stop-hook executable was not supported; the override is test-gated.

### A second finding for README/topology residue in the remaining support directories was not admitted because F005 already covers the same moved-package documentation contract. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A second finding for README/topology residue in the remaining support directories was not admitted because F005 already covers the same moved-package documentation contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second finding for README/topology residue in the remaining support directories was not admitted because F005 already covers the same moved-package documentation contract.

### A stale hook mirror was not found in the four configured host hook files. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A stale hook mirror was not found in the four configured host hook files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale hook mirror was not found in the four configured host hook files.

### A stale production TypeScript include was not found in the nested CLI config; its source folders are enumerated under the new root. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A stale production TypeScript include was not found in the nested CLI config; its source folders are enumerated under the new root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale production TypeScript include was not found in the nested CLI config; its source folders are enumerated under the new root.

### A valid old-path package alias was not found: `scripts/package.json` is absent and the old directory contains only residual generated/link material. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A valid old-path package alias was not found: `scripts/package.json` is absent and the old directory contains only residual generated/link material.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A valid old-path package alias was not found: `scripts/package.json` is absent and the old directory contains only residual generated/link material.

### Generated `dist` absence was not promoted to a source-path finding because the review did not build the environment-dependent artifact surface. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Generated `dist` absence was not promoted to a source-path finding because the review did not build the environment-dependent artifact surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generated `dist` absence was not promoted to a source-path finding because the review did not build the environment-dependent artifact surface.

### No additional finding was created for synthetic migration values, fixture paths, or the inert `scripts/tests/**` exclusion glob. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No additional finding was created for synthetic migration values, fixture paths, or the inert `scripts/tests/**` exclusion glob.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional finding was created for synthetic migration values, fixture paths, or the inert `scripts/tests/**` exclusion glob.

### No additional production relative-import defect was established in the inspected retrieval or test helper files. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No additional production relative-import defect was established in the inspected retrieval or test helper files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional production relative-import defect was established in the inspected retrieval or test helper files.

### No compatibility package or symlink was found that would make the singular `.opencode/skill` path valid. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No compatibility package or symlink was found that would make the singular `.opencode/skill` path valid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No compatibility package or symlink was found that would make the singular `.opencode/skill` path valid.

### No convergence-based early stop was taken; synthesis follows the configured max-iterations terminal condition. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No convergence-based early stop was taken; synthesis follows the configured max-iterations terminal condition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No convergence-based early stop was taken; synthesis follows the configured max-iterations terminal condition.

### No current generated module was found at either the direct or doubled `wrap-all-templates` output path, so the observed issue is a stale test path/skip contract rather than a confirmed production module import failure. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No current generated module was found at either the direct or doubled `wrap-all-templates` output path, so the observed issue is a stale test path/skip contract rather than a confirmed production module import failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No current generated module was found at either the direct or doubled `wrap-all-templates` output path, so the observed issue is a stale test path/skip contract rather than a confirmed production module import failure.

### No duplicate canonical finding was created for the reducer's legacy projection variants; the report will use the evidence-backed F001-F009 identity set. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No duplicate canonical finding was created for the reducer's legacy projection variants; the report will use the evidence-backed F001-F009 identity set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No duplicate canonical finding was created for the reducer's legacy projection variants; the report will use the evidence-backed F001-F009 identity set.

### Synthetic old-path strings in architecture-boundary and graph-metadata fixture tests are test inputs, not runtime path consumers. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Synthetic old-path strings in architecture-boundary and graph-metadata fixture tests are test inputs, not runtime path consumers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Synthetic old-path strings in architecture-boundary and graph-metadata fixture tests are test inputs, not runtime path consumers.

### The CI failures are not caused solely by the registry: both workflows contain an independent, unconditional `cd .../scripts && npm ci`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The CI failures are not caused solely by the registry: both workflows contain an independent, unconditional `cd .../scripts && npm ci`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The CI failures are not caused solely by the registry: both workflows contain an independent, unconditional `cd .../scripts && npm ci`.

### The metadata drift is not explained by an absent target-layout decision; the decision is present in the packet and in the implementation summary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The metadata drift is not explained by an absent target-layout decision; the decision is present in the packet and in the implementation summary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The metadata drift is not explained by an absent target-layout decision; the decision is present in the packet and in the implementation summary.

### The stale README commands are not confined to historical prose; they appear in command blocks labeled entrypoints, commands, and validation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The stale README commands are not confined to historical prose; they appear in command blocks labeled entrypoints, commands, and validation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The stale README commands are not confined to historical prose; they appear in command blocks labeled entrypoints, commands, and validation.

### The test omission is not explained by a missing test suite: 146 moved CLI Vitest files are present. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The test omission is not explained by a missing test suite: 146 moved CLI Vitest files are present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The test omission is not explained by a missing test suite: 146 moved CLI Vitest files are present.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
<!-- ANCHOR:ruled-out -->
[None yet]
<!-- /ANCHOR:ruled-out -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesize the canonical report, emit the lineage resource map from the completed evidence ledger, append terminal synthesis and completion events, then release the lineage lock and perform final artifact/state checks. Review verdict: FAIL

<!-- /ANCHOR:next-focus -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `scratch/inventory.md`, `scratch/path-map.json`, `scratch/review-scope.txt`, and the bounded changed-file list.
- Behavior claims: scripts are nested under `runtime/cli`; continuity is moved from `memory` to `continuity`; runtime/scripts remains distinct; the packet claims completion and records 63 known CLI test failures.
- Reuse and conventions: runtime CLI package, generated `dist`, symlinked `runtime/cli/runtime`, path-map special cases, and deep-loop append/reducer contracts.
- Risks and gaps: packet metadata is internally inconsistent on completion state; several execution instructions still mention old `memory` paths; graph writes and repository validation are intentionally unavailable in this lineage.

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference -->
| Protocol | Level | Status | Iteration | Notes |
|---|---|---|---:|---|
| `spec_code` | core | pending | 0 | Compare packet claims with the bounded changed-file surface. |
| `checklist_evidence` | core | pending | 0 | Reconcile checklist and acceptance evidence. |
| `skill_agent` | overlay | notApplicable | 0 | Target is a spec-folder move, not a skill-agent implementation. |
| `agent_cross_runtime` | overlay | notApplicable | 0 | No cross-agent runtime contract is in scope. |
| `feature_catalog_code` | overlay | conditional | 0 | Check only if the moved CLI package is catalogued. |
| `playbook_capability` | overlay | conditional | 0 | Check only if command/playbook references are in the bounded list. |
<!-- /ANCHOR:cross-reference -->

## 15. FILES UNDER REVIEW
<!-- ANCHOR:file-coverage -->
Scope inventory is the authoritative list: 420 paths from `scratch/review-scope.txt`. Per-file coverage is evidenced by each iteration’s `Files Reviewed` section and delta.
<!-- /ANCHOR:file-coverage -->

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:boundaries -->
- Max iterations: 10
- Convergence threshold: 3.0
- Stop policy: max-iterations
- Session lineage: sessionId=fanout-luna-max-review-1788599924929-d9wrhj, parentSessionId=null, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Artifact root: `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/review/lineages/luna-max-review`
<!-- /ANCHOR:boundaries -->
