---
iteration: 4
focus: traceability
status: complete
newInfoRatio: 0.91
dimensions:
  - traceability
---

# Iteration 004 — Traceability: scope manifest and execution map

## Review objective

Reconcile the packet's review manifest and execution path map with the current
moved tree, package identity and the evidence cited by the closure criteria.
This pass is static only; no repository command was executed.

## Sources read

- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/review-scope.txt:169-172,370-373`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/path-map.json:113-126`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/inventory.md:20-50,100-120`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/scratch/execute-plan.md:20-50,140-160`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/acceptance-criteria.md:55-95`
- `.opencode/specs/system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting/implementation-summary.md:50-72,130-150,210-245`
- `.opencode/skills/system-spec-kit/runtime/cli/package.json:1-22`

## Findings

### F008 — Review-scope manifest contains three non-existent moved paths

- **Severity:** P1
- **Class:** coverage/traceability
- **Evidence:** `scratch/review-scope.txt:169-172` lists
  `runtime/cli/.scan-one-fast.sh` and `runtime/cli/.scan-validate-all.py`,
  but the tree contains only the `.sh` and `.txt` variants. Line 372 lists
  `runtime/cli/tests/test-embeddings-factory.js`, while the live registry and
  tree use `test-embeddings-factory.cjs`. A direct existence check found 453
  manifest entries but three missing paths, including one real test file that
  the manifest omits.
- **Impact:** The bounded review scope is not a faithful inventory of the
  moved tree. Any coverage, changed-file audit or follow-on review that trusts
  this manifest can report coverage over deleted files while skipping the live
  embeddings test, undermining the packet's claimed evidence boundary.
- **Required correction:** Replace the three stale entries with the current
  files, add the `.cjs` test path, and regenerate the manifest count and any
  evidence rows that quote 453 entries.

### F009 — Execution path map preserves a retired package identity

- **Severity:** P2
- **Class:** contract/evidence
- **Evidence:** `scratch/path-map.json:116-126` instructs the executor to keep
  the moved package name `@spec-kit/scripts`. The live
  `runtime/cli/package.json:1` is named `@spec-kit/cli`, and
  `implementation-summary.md:190-200` records that the old identity was
  superseded and renamed.
- **Impact:** The path map is a replay input for the move, but its package-name
  instruction now contradicts the shipped workspace and lockfile contract.
  Reusing it for a repair or audit can reintroduce the retired package name or
  falsely mark the package-identity decision as unresolved.
- **Required correction:** Update the path map to record the final
  `@spec-kit/cli` identity and the supersession rationale, or explicitly mark
  the old instruction as historical/non-authoritative.

## Quality-gate notes

- The implementation summary does cite the moved package and current runtime
  paths, so the package identity conflict is localized to the execution map.
- The manifest mismatch is independently confirmed by filesystem existence and
  the current scripts registry; it is not inferred from stale prose alone.
- Convergence remains telemetry only; six further passes remain.

## Next focus

Maintainability: inspect post-move module boundaries, duplicated path contracts,
and documentation or test structures that will drift under future changes.

Review verdict: FAIL
