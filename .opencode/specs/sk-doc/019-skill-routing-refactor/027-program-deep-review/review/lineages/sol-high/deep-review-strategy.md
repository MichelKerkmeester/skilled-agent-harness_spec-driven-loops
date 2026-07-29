# Deep Review Strategy: Skill-Metadata Program

## 2. TOPIC
Review the skill-metadata program in commit range `2fa9fc480c..a39e6ea716` against the six scoped surfaces in the target `spec.md`.

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness — CONDITIONAL (iteration 001)
- [x] D2 Security — CONDITIONAL (iteration 002)
- [x] D3 Traceability — CONDITIONAL (iteration 003)
- [x] D4 Maintainability — CONDITIONAL (iteration 004)
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS
- Do not implement fixes.
- Do not review unrelated files from the broad commit range.
- Do not write outside this detached lineage packet.

## 5. STOP CONDITIONS
- Dispatch exactly five iterations because `stopPolicy=max-iterations`.
- Treat earlier convergence as telemetry and broaden later review angles.

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| Correctness | CONDITIONAL | 001 | P1: standalone packet and command choreography probes lack normalized containment checks. |
| Security | CONDITIONAL | 002 | P1-001 remains a validator-integrity defect; no privilege-crossing read/write path justified escalation to P0. |
| Traceability | CONDITIONAL | 003 | P1: command-metadata-only changes do not trigger the authoritative CI fleet gate. |
| Maintainability | CONDITIONAL | 004 | P1: fleet discovery errors collapse into a successful zero-root scan; P2: family policy is mirrored across doctor and advisor consumers. |
| Cross-reference stabilization | CONDITIONAL | 005 | P1-001 and P1-002 remain active; P1-003 is downgraded to P2 after exact caller replay and expanded to the adjacent freshness gate. |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 2 active
- **P2 (Minor):** 2 active
- **Delta this iteration:** +0 new findings; P1-001 and P1-002 reaffirmed, P1-003 refined across both fleet gates and downgraded to P2, P2-001 carried unchanged
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED
- Initial scope is explicit in `spec.md`; use the named six program surfaces and the commit-range diff.
- Iteration 001: commit-range mapping followed by direct generator, fleet-gate, schema, scaffold-journey, and watcher reads exposed a cross-consumer path-containment class.
- Iteration 002: direct trust-boundary tracing plus targeted contract tests bounded P1-001's security impact and verified watcher, quarantine, delete/recreate, and `--fix` containment surfaces.
- Iteration 003: a spec-to-authored-data matrix plus exact doctrine, consumer, CI, and hook reads exposed missing CI enrollment while distinguishing the fleet consumer from doctor/advisor surfaces.
- Iteration 004: direct failure-path execution proved the fleet gate can false-green without scanning roots; an exact doctor/advisor contract comparison bounded a second issue to P2 because the mirrored family lists still match.
- Iteration 005: exact producer/consumer/caller replay preserved two P1s, found the same zero-root behavior in manifest freshness, and used mandatory caller containment to downgrade that class to P2; all three scoped test programs passed.

## 9. WHAT FAILED
- Memory preflight timed out; packet docs and direct source evidence are authoritative for this run.
- Iteration 001: structural-impact tooling was unavailable; plain diff mapping was retained as a caveat and direct reads supplied evidence.
- Iteration 002: memory MCP remained unavailable from preflight and was not retried per carry-forward; direct packet/source evidence remained sufficient.
- Iteration 003: `feature_catalog_code` had no artifact in the declared review scope and `playbook_capability` was already exhausted, so neither was silently upgraded to a pass.
- Iteration 004: exact-path Grep surfaced adjacent out-of-scope siblings; those hits were discarded, and only configured review-scope files supplied evidence.
- Iteration 005: memory preflight timed out and graph/structural signals remained unavailable; direct scoped reads, exact callers, and local tests supplied graphless stabilization evidence.

## 10. EXHAUSTED APPROACHES (do not retry)
- None.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Repository-wide changes outside the six scope surfaces are out of scope despite appearing in the commit range.
- Iteration 001: standalone scaffold incompleteness was ruled out because the owning workflow and journey require the derivation `--fix` step.

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
- Dimension: terminal synthesis
- Focus area: terminal synthesis and remediation planning for two active P1s and two P2 advisories
- Reason: max-iterations is reached with all configured dimensions covered; release readiness remains conditional
- Rotation status: review rotation complete; no sixth LEAF iteration is authorized
- Blocked/productive carry-forward: preserve exact generator/schema/fleet, CI/pre-push, and discovery/freshness evidence; do not reopen exhausted protocols
- Required evidence: synthesis must retain P1-001/P1-002, record P1-003's P2 downgrade, and explain graphless verification
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT
### Bounded Context Snapshot
- Target pointer: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:48-60`.
- Behavior claims: H/S class metadata requirements, core command schema, generated manifest freshness, watcher ingestion, authored-template fidelity, doctrine honesty, and CI/hook wiring.
- Commit range: `2fa9fc480c..a39e6ea716`.
- Resource map: `resource-map.md not present; skipping coverage gate`.
- Missing packet artifacts: no `plan.md`, `tasks.md`, `checklist.md`, or `implementation-summary.md`; checklist evidence protocol is therefore expected to be notApplicable.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 005 | Producer/consumer replay remains aligned, but CI still omits command-metadata-only changes from both trigger paths. |
| `checklist_evidence` | core | notApplicable | - | Target has no checklist.md. |
| `feature_catalog_code` | overlay | notApplicable | 003 | No feature-catalog implementation artifact is in the declared review scope. |
| `playbook_capability` | overlay | partial | 001 | Create journey proves scaffold → fleet --fix → clean gate → doctor. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| Surface | Representative paths | Dimensions Reviewed | Last Iteration | Findings | Status |
|---------|----------------------|---------------------|----------------|----------|--------|
| Contract and fleet gate | `create-skill/scripts/lib/*.cjs`, `ci-skill-root-metadata.cjs`, manifest scripts | correctness, security, traceability, maintainability, stabilization | 005 | 2 | partial |
| Advisor watcher | `mcp-server/lib/daemon/watcher.ts`, watcher tests | correctness, security, maintainability | 004 | 0 | complete |
| Authored metadata/templates | seven `command-metadata.json` roots, `create-skill/assets/**`, `init_skill.py` | correctness, security, traceability, maintainability | 004 | 1 | partial |
| Doctrine | create-skill and advisor docs changed by the program | traceability, maintainability | 004 | 0 | complete |
| Tests | create-skill contract/journey tests and watcher suites | correctness, security, traceability, maintainability, stabilization | 005 | 2 | partial |
| CI/hooks | routing registry workflow and pre-push hook | traceability, maintainability, stabilization | 005 | 2 | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Artifact root: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/review/lineages/sol-high`
- Max iterations: 5
- Stop policy: max-iterations
- Convergence threshold: 0.1
- Session lineage: sessionId=`fanout-sol-high-1785257671132-a9gil1`, parentSessionId=null, generation=1, lineageMode=new
- Severity threshold: P2
- Review target type: spec-folder
- Target files are read-only.
<!-- MACHINE-OWNED: END -->

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
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: **notApplicable (carried, not retried)** — the target has no `checklist.md`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: **notApplicable (carried, not retried)** — the target has no `checklist.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **notApplicable (carried, not retried)** — the target has no `checklist.md`.

### `checklist_evidence`: **notApplicable (carried, not retried)** — the target packet has no `checklist.md`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: **notApplicable (carried, not retried)** — the target packet has no `checklist.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **notApplicable (carried, not retried)** — the target packet has no `checklist.md`.

### `checklist_evidence`: **notApplicable** — the target packet has no `checklist.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: **notApplicable** — the target packet has no `checklist.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **notApplicable** — the target packet has no `checklist.md`.

### `checklist_evidence`: **notApplicable**; the packet has no `checklist.md`, and the blocked protocol was not retried. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: **notApplicable**; the packet has no `checklist.md`, and the blocked protocol was not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: **notApplicable**; the packet has no `checklist.md`, and the blocked protocol was not retried.

### `feature_catalog_code`: **notApplicable** — no feature-catalog implementation artifact is in the declared review scope; no coverage claim was inferred from unrelated advisor prose. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code`: **notApplicable** — no feature-catalog implementation artifact is in the declared review scope; no coverage claim was inferred from unrelated advisor prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: **notApplicable** — no feature-catalog implementation artifact is in the declared review scope; no coverage claim was inferred from unrelated advisor prose.

### `feature_catalog_code`: **pending** — blocked/exhausted for this iteration by strategy; not retried. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `feature_catalog_code`: **pending** — blocked/exhausted for this iteration by strategy; not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: **pending** — blocked/exhausted for this iteration by strategy; not retried.

### `feature_catalog_code`: **pending** — not part of this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: **pending** — not part of this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: **pending** — not part of this correctness pass.

### `playbook_capability`: **partial (carried, not retried)** — prior journey evidence remains applicable; this pass only verified its `--fix` containment assertions. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability`: **partial (carried, not retried)** — prior journey evidence remains applicable; this pass only verified its `--fix` containment assertions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: **partial (carried, not retried)** — prior journey evidence remains applicable; this pass only verified its `--fix` containment assertions.

### `playbook_capability`: **partial (carried, not retried)** — the prior create-journey scaffold-to-`--fix` proof remains applicable; strategy marks repeating that approach exhausted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability`: **partial (carried, not retried)** — the prior create-journey scaffold-to-`--fix` proof remains applicable; strategy marks repeating that approach exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: **partial (carried, not retried)** — the prior create-journey scaffold-to-`--fix` proof remains applicable; strategy marks repeating that approach exhausted.

### `playbook_capability`: **partial** — the create journey proves scaffolding followed by the fleet `--fix` and clean rerun at `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:53-75`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: **partial** — the create journey proves scaffolding followed by the fleet `--fix` and clean rerun at `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:53-75`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: **partial** — the create journey proves scaffolding followed by the fleet `--fix` and clean rerun at `.opencode/skills/sk-doc/create-skill/scripts/tests/create-journey-proof.test.cjs:53-75`.

### `spec_code`: **fail** — the seven root files obey the documented array contract and the schema/fleet consumer match the doctrine, but CI trigger coverage does not enroll command-metadata-only changes [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:9-35,95-180`; `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-303,352-357`; `.github/workflows/routing-registry-drift.yml:15-52,101-110`]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: **fail** — the seven root files obey the documented array contract and the schema/fleet consumer match the doctrine, but CI trigger coverage does not enroll command-metadata-only changes [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:9-35,95-180`; `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-303,352-357`; `.github/workflows/routing-registry-drift.yml:15-52,101-110`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **fail** — the seven root files obey the documented array contract and the schema/fleet consumer match the doctrine, but CI trigger coverage does not enroll command-metadata-only changes [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/lib/command-metadata-schema.cjs:9-35,95-180`; `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs:254-303,352-357`; `.github/workflows/routing-registry-drift.yml:15-52,101-110`].

### `spec_code`: **partial** — checked correctness claims for H/S required/generated files, command metadata existence probing, standalone generation/freshness, scaffolder-to-`--fix` journey, and watcher addDir/unlinkDir transitions against implementation. Remaining dimensions and broader surface fidelity rotate to later iterations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: **partial** — checked correctness claims for H/S required/generated files, command metadata existence probing, standalone generation/freshness, scaffolder-to-`--fix` journey, and watcher addDir/unlinkDir transitions against implementation. Remaining dimensions and broader surface fidelity rotate to later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **partial** — checked correctness claims for H/S required/generated files, command metadata existence probing, standalone generation/freshness, scaffolder-to-`--fix` journey, and watcher addDir/unlinkDir transitions against implementation. Remaining dimensions and broader surface fidelity rotate to later iterations.

### `spec_code`: **partial** — security claims for probe containment, `--fix` write scope, watcher target containment, quarantine ordering, and delete/recreate behavior were checked against implementation [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:51-58`]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: **partial** — security claims for probe containment, `--fix` write scope, watcher target containment, quarantine ordering, and delete/recreate behavior were checked against implementation [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:51-58`].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: **partial** — security claims for probe containment, `--fix` write scope, watcher target containment, quarantine ordering, and delete/recreate behavior were checked against implementation [SOURCE: `.opencode/specs/sk-doc/019-skill-routing-refactor/027-program-deep-review/spec.md:51-58`].

### `spec_code`: carried as **fail** from iteration 003; not retried because the strategy marks that approach exhausted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: carried as **fail** from iteration 003; not retried because the strategy marks that approach exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: carried as **fail** from iteration 003; not retried because the strategy marks that approach exhausted.

### Did not retry `feature_catalog_code`, `playbook_capability`, memory MCP, structural-impact tooling, or checklist evidence where strategy marks the direction blocked/exhausted or not applicable. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Did not retry `feature_catalog_code`, `playbook_capability`, memory MCP, structural-impact tooling, or checklist evidence where strategy marks the direction blocked/exhausted or not applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not retry `feature_catalog_code`, `playbook_capability`, memory MCP, structural-impact tooling, or checklist evidence where strategy marks the direction blocked/exhausted or not applicable.

### Maintainability contract matrix: **partial** — pure leaf/root/command libraries centralize their immediate validators, but the fleet discovery error path fails open and family policy remains mirrored across exact consumers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Maintainability contract matrix: **partial** — pure leaf/root/command libraries centralize their immediate validators, but the fleet discovery error path fails open and family policy remains mirrored across exact consumers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Maintainability contract matrix: **partial** — pure leaf/root/command libraries centralize their immediate validators, but the fleet discovery error path fails open and family policy remains mirrored across exact consumers.

### No P0: the reproduced failure is a validation false-green, not an exploit, authorization bypass, destructive write, or data-loss path. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No P0: the reproduced failure is a validation false-green, not an exploit, authorization bypass, destructive write, or data-loss path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0: the reproduced failure is a validation false-green, not an exploit, authorization bypass, destructive write, or data-loss path.

### No separate scaffold-template-equivalence finding: the parent scaffolder hard-codes a minimal valid instance while templates document richer manual authoring shapes, but the scoped journey proves the generated hub passes the fleet gate and doctor. Without a present behavioral mismatch, this remains follow-up context rather than another active finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No separate scaffold-template-equivalence finding: the parent scaffolder hard-codes a minimal valid instance while templates document richer manual authoring shapes, but the scoped journey proves the generated hub passes the fleet gate and doctor. Without a present behavioral mismatch, this remains follow-up context rather than another active finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No separate scaffold-template-equivalence finding: the parent scaffolder hard-codes a minimal valid instance while templates document richer manual authoring shapes, but the scoped journey proves the generated hub passes the fleet gate and doctor. Without a present behavioral mismatch, this remains follow-up context rather than another active finding.

### P1-001 and P1-002 were not restated; this iteration found no new evidence changing their severity or scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: P1-001 and P1-002 were not restated; this iteration found no new evidence changing their severity or scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: P1-001 and P1-002 were not restated; this iteration found no new evidence changing their severity or scope.

### Ruled out a broad `--fix` mutation finding: implementation and tests agree that authored files and hub aliases are not rewritten. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out a broad `--fix` mutation finding: implementation and tests agree that authored files and hub aliases are not rewritten.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a broad `--fix` mutation finding: implementation and tests agree that authored files and hub aliases are not rewritten.

### Ruled out a second doctrine finding for P1-001: documentation accurately describes resolution/existence validation and does not falsely claim containment. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out a second doctrine finding for P1-001: documentation accurately describes resolution/existence validation and does not falsely claim containment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a second doctrine finding for P1-001: documentation accurately describes resolution/existence validation and does not falsely claim containment.

### Ruled out a watcher path-traversal finding: exact-parent checks, lexical/realpath containment, and `followSymlinks: false` constrain the reviewed event and derived-file surfaces. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out a watcher path-traversal finding: exact-parent checks, lexical/realpath containment, and `followSymlinks: false` constrain the reviewed event and derived-file surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a watcher path-traversal finding: exact-parent checks, lexical/realpath containment, and `followSymlinks: false` constrain the reviewed event and derived-file surfaces.

### Ruled out escalation of P1-001 to P0: the verified paths expose validator/routing integrity risk, but no untrusted ingress, sensitive-content read, or out-of-root privileged write was found. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Ruled out escalation of P1-001 to P0: the verified paths expose validator/routing integrity risk, but no untrusted ingress, sensitive-content read, or out-of-root privileged write was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out escalation of P1-001 to P0: the verified paths expose validator/routing integrity risk, but no untrusted ingress, sensitive-content read, or out-of-root privileged write was found.

### Ruled out the initial hypothesis that `init_skill.py` incorrectly claims a fully gate-clean standalone output: the owning workflow explicitly requires `ci-skill-root-metadata.cjs --fix`, and the journey test verifies that transition. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out the initial hypothesis that `init_skill.py` incorrectly claims a fully gate-clean standalone output: the owning workflow explicitly requires `ci-skill-root-metadata.cjs --fix`, and the journey test verifies that transition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out the initial hypothesis that `init_skill.py` incorrectly claims a fully gate-clean standalone output: the owning workflow explicitly requires `ci-skill-root-metadata.cjs --fix`, and the journey test verifies that transition.

### Ruled out treating advisor ingestion or the doctor as command-metadata consumers; direct source shows advisor identity ingestion and doctor class-presence checks only. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Ruled out treating advisor ingestion or the doctor as command-metadata consumers; direct source shows advisor identity ingestion and doctor class-presence checks only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating advisor ingestion or the doctor as command-metadata consumers; direct source shows advisor identity ingestion and doctor class-presence checks only.

### Ruled out treating current authored metadata values as proof of validator containment; present-data cleanliness does not exercise the negative contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Ruled out treating current authored metadata values as proof of validator containment; present-data cleanliness does not exercise the negative contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating current authored metadata values as proof of validator containment; present-data cleanliness does not exercise the negative contract.

### Structural-impact tooling and memory MCP were not retried because strategy marks those approaches blocked for this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Structural-impact tooling and memory MCP were not retried because strategy marks those approaches blocked for this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural-impact tooling and memory MCP were not retried because strategy marks those approaches blocked for this iteration.

### Structural-impact tooling was unavailable in this runtime; direct commit-range diff mapping plus direct file reads supplied the scoped evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Structural-impact tooling was unavailable in this runtime; direct commit-range diff mapping plus direct file reads supplied the scoped evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural-impact tooling was unavailable in this runtime; direct commit-range diff mapping plus direct file reads supplied the scoped evidence.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: terminal synthesis
- Focus area: remediation planning for the two active P1 findings and two P2 advisories
- Reason: iteration 005 reaches max-iterations with complete dimension coverage and a conditional release state
- Rotation status: review rotation complete; no sixth LEAF iteration is authorized
- Blocked/productive carry-forward: preserve exact generator/schema/fleet, CI/pre-push, and discovery/freshness evidence; do not reopen exhausted protocols
- Required evidence: retain P1-001/P1-002, record P1-003 as downgraded P2, and explain graphless verification

<!-- /ANCHOR:next-focus -->
