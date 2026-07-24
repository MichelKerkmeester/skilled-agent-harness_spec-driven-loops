# Deep Review Strategy: Compiled-Routing Coverage Build-Out

## Topic
Review the completed compiled-routing coverage build-out and default-on cutover against its canonical packet, six implementation commits, routing runtime, parity harness, and lockstep documentation surfaces.

## Review Dimensions
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness
- [ ] D2 Security
- [ ] D3 Traceability
- [ ] D4 Maintainability
<!-- MACHINE-OWNED: END -->

## Non-Goals
- Do not modify implementation or canonical packet documents.
- Do not review unrelated worktree changes or the operator-gated merge.
- Do not substitute prose claims for direct implementation, test, or commit evidence.

## Stop Conditions
- Run exactly 10 iterations. Convergence before iteration 10 is telemetry only.
- Stop at the hard ceiling with `maxIterationsReached`, preserving failed gates as evidence.

## Completed Dimensions
<!-- MACHINE-OWNED: START -->
None yet.
<!-- MACHINE-OWNED: END -->

## Running Findings
<!-- MACHINE-OWNED: START -->
- P0: 0 active
- P1: 1 active
- P2: 0 active
<!-- MACHINE-OWNED: END -->

## What Worked
- Commit-bounded scope discovery identified concrete producer, consumer, test, manifest, and documentation surfaces before review.
- Direct producer/test comparison exposed the refresh race without relying on speculative caller behavior (iteration 1).

## What Failed
- Spec Memory trigger retrieval was unavailable (`Not connected`); canonical packet continuity and direct repository evidence are the fallback.

## Exhausted Approaches
- None yet.

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## Ruled Out Directions
- No review of unrelated dirty paths outside the target and lineage packet.
- Compile-failure partial writes and CLI exit-code inversion are ruled out for the manifest refresh path (iteration 1).

## Next Focus
<!-- MACHINE-OWNED: START -->
- Dimension: correctness
- Focus area: compiled router scoring, selection, and parity-classification semantics
- Reason: verify the six-commit behavioral claims against the actual producers and tests
<!-- MACHINE-OWNED: END -->

## Known Context
- Target packet claims all seven hubs are `compiled-serving`, default-on, reversible, and frozen-scorer clean.
- Six commits define the implementation range: `f19ee17179`, `e56361ee53`, `f9f639674b`, `b03b1dd882`, `6ba5f2957f`, `7dfffa0c93`.
- Canonical continuity is contradictory: `spec.md`, `checklist.md`, and `implementation-summary.md` claim completion, while `plan.md`, `tasks.md`, and `decision-record.md` retain planned or blocked metadata and unchecked work.
- `resource-map.md` is absent, so the resource-map coverage gate is skipped.

### Bounded Context Snapshot
- Target pointers: the 34 files listed in `deep-review-config.json`, bounded to implementation, tests, runtime consumers, lockstep skill/template surfaces, and canonical packet docs.
- Behavior claims: compiled routes equal legacy for all seven hubs; kill-switch and cohort removal restore legacy; manifest refresh fails closed; frozen scorer files remain unchanged.
- Reuse and conventions: sk-design router is the reference implementation; parity is measured by the route-gold harness; compiled decisions must not exceed legacy targets.
- Risks and gaps: completion-metadata drift, harness-vs-routing attribution, default-on cohort duplication, stale evidence, and absent full seven-hub LUNA-HIGH acceptance.

## Cross-Reference Status
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|---|---|---|---:|---|
| `spec_code` | core | pending | - | Normative claims require direct implementation evidence. |
| `checklist_evidence` | core | pending | - | Checked claims require current evidence. |
| `skill_agent` | overlay | notApplicable | - | Target is a spec folder. |
| `agent_cross_runtime` | overlay | notApplicable | - | Target is a spec folder. |
| `feature_catalog_code` | overlay | pending | - | Default-on catalog wording is in scope. |
| `playbook_capability` | overlay | pending | - | Acceptance and route-gold capability claims are in scope. |
<!-- MACHINE-OWNED: END -->

## Files Under Review
<!-- MACHINE-OWNED: START -->
Scope is the ordered `reviewScopeFiles` list in `deep-review-config.json` (34 files). Coverage begins at 0/34.
<!-- MACHINE-OWNED: END -->

## Review Boundaries
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Stop policy: max-iterations
- Convergence threshold: 0.10
- Dimensions: correctness, security, traceability, maintainability
- Session: `fanout-sol-high-1784691838667-iv78vk`, generation 1, lineage `new`
- Artifact root: `review/lineages/sol-high`
- Resource-map coverage: skipped (source map absent at init)
- Target files: read-only
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
- P1 (Required): 5
- P2 (Suggestions): 2
- Resolved: 2

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `checklist_evidence`: fail for CHK-010/CHK-030's broad identity wording; the evidence proves corpus parity, not arbitrary-prompt identity. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: fail for CHK-010/CHK-030's broad identity wording; the evidence proves corpus parity, not arbitrary-prompt identity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail for CHK-010/CHK-030's broad identity wording; the evidence proves corpus parity, not arbitrary-prompt identity.

### `checklist_evidence`: fail; byte-identical resolver copies do not establish closure-wide source/mirror parity. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checklist_evidence`: fail; byte-identical resolver copies do not establish closure-wide source/mirror parity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail; byte-identical resolver copies do not establish closure-wide source/mirror parity.

### `checklist_evidence`: fail; current test replay contradicts the green-suite completion claim. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: fail; current test replay contradicts the green-suite completion claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail; current test replay contradicts the green-suite completion claim.

### `checklist_evidence`: fail; F003 and F007 contradict the packet's completion evidence. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checklist_evidence`: fail; F003 and F007 contradict the packet's completion evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail; F003 and F007 contradict the packet's completion evidence.

### `checklist_evidence`: fail; unchecked required rows and unreconciled statuses conflict with `complete`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: fail; unchecked required rows and unreconciled statuses conflict with `complete`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: fail; unchecked required rows and unreconciled statuses conflict with `complete`.

### `checklist_evidence`: not executed in this iteration. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `checklist_evidence`: not executed in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: not executed in this iteration.

### `checklist_evidence`: partial; 7-hub corpus parity remains supported, while arbitrary-prompt identity is not. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence`: partial; 7-hub corpus parity remains supported, while arbitrary-prompt identity is not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial; 7-hub corpus parity remains supported, while arbitrary-prompt identity is not.

### `checklist_evidence`: partial; the static security claims are supported, while live command evidence is reserved for verification iterations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: partial; the static security claims are supported, while live command evidence is reserved for verification iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial; the static security claims are supported, while live command evidence is reserved for verification iterations.

### `checklist_evidence`: pass for CHK-121's fleet flag-off drill; all seven live status rows report `causeCode: flag-off`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: pass for CHK-121's fleet flag-off drill; all seven live status rows report `causeCode: flag-off`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: pass for CHK-121's fleet flag-off drill; all seven live status rows report `causeCode: flag-off`.

### `feature_catalog_code`: pass for default-on wording and seven-hub cohort naming. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code`: pass for default-on wording and seven-hub cohort naming.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass for default-on wording and seven-hub cohort naming.

### `feature_catalog_code`: pass from iteration 5. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: pass from iteration 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass from iteration 5.

### `feature_catalog_code`: pass; the previously reviewed default-on wording remains aligned. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `feature_catalog_code`: pass; the previously reviewed default-on wording remains aligned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass; the previously reviewed default-on wording remains aligned.

### `feature_catalog_code`: pending; lockstep wording will be checked separately. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: pending; lockstep wording will be checked separately.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pending; lockstep wording will be checked separately.

### `playbook_capability`: partial because the negative lexical class is absent from route-gold coverage. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: partial because the negative lexical class is absent from route-gold coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial because the negative lexical class is absent from route-gold coverage.

### `playbook_capability`: partial; route-gold tests exist, but the cutover gate has the non-route false-pass from F002. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: partial; route-gold tests exist, but the cutover gate has the non-route false-pass from F002.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; route-gold tests exist, but the cutover gate has the non-route false-pass from F002.

### `playbook_capability`: partial; the targeted parity suite is green, but F002 and F007 leave cutover and manifest gates incomplete. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `playbook_capability`: partial; the targeted parity suite is green, but F002 and F007 leave cutover and manifest gates incomplete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial; the targeted parity suite is green, but F002 and F007 leave cutover and manifest gates incomplete.

### `playbook_capability`: pass for the targeted parity suite (49/49). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: pass for the targeted parity suite (49/49).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pass for the targeted parity suite (49/49).

### `selectionKind` actor/evidence tie classification drift: focused tests cover one-actor and multi-actor shapes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:593-647] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `selectionKind` actor/evidence tie classification drift: focused tests cover one-actor and multi-actor shapes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:593-647]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `selectionKind` actor/evidence tie classification drift: focused tests cover one-actor and multi-actor shapes. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:593-647]

### `spec_code`: fail for byte-identical routing as a universal behavior claim; direct negative replay found drift. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: fail for byte-identical routing as a universal behavior claim; direct negative replay found drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail for byte-identical routing as a universal behavior claim; direct negative replay found drift.

### `spec_code`: fail remains for sk-doc universal byte-identity; the class is now bounded by direct counterexamples on the other relevant hubs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: fail remains for sk-doc universal byte-identity; the class is now bounded by direct counterexamples on the other relevant hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail remains for sk-doc universal byte-identity; the class is now bounded by direct counterexamples on the other relevant hubs.

### `spec_code`: fail; F001, F002, F005, and F007 remain source-backed implementation or closure defects. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `spec_code`: fail; F001, F002, F005, and F007 remain source-backed implementation or closure defects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail; F001, F002, F005, and F007 remain source-backed implementation or closure defects.

### `spec_code`: fail; shipped code no longer follows the documented authored-source-to-promoted-mirror regeneration path for four hubs. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: fail; shipped code no longer follows the documented authored-source-to-promoted-mirror regeneration path for four hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: fail; shipped code no longer follows the documented authored-source-to-promoted-mirror regeneration path for four hubs.

### `spec_code`: partial; major runtime claims are implemented, but two P1 correctness defects remain. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: partial; major runtime claims are implemented, but two P1 correctness defects remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial; major runtime claims are implemented, but two P1 correctness defects remain.

### `spec_code`: partial; promoted runtime state is fresh and compiled-serving for all seven hubs, but authored closure resolution is incomplete. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: partial; promoted runtime state is fresh and compiled-serving for all seven hubs, but authored closure resolution is incomplete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial; promoted runtime state is fresh and compiled-serving for all seven hubs, but authored closure resolution is incomplete.

### `spec_code`: partial; the fail-closed and field-preservation claims hold for sequential execution, but concurrent preservation is not demonstrated. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial; the fail-closed and field-preservation claims hold for sequential execution, but concurrent preservation is not demonstrated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial; the fail-closed and field-preservation claims hold for sequential execution, but concurrent preservation is not demonstrated.

### `spec_code`: partial; the primary parity harness distinguishes actions correctly, but the cutover playbook executor does not. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: partial; the primary parity harness distinguishes actions correctly, but the cutover playbook executor does not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial; the primary parity harness distinguishes actions correctly, but the cutover playbook executor does not.

### `spec_code`: pass for fleet kill-switch, invalid-value fail-closed behavior, and manifest freshness gating. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: pass for fleet kill-switch, invalid-value fail-closed behavior, and manifest freshness gating.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass for fleet kill-switch, invalid-value fail-closed behavior, and manifest freshness gating.

### `spec_code`: pass for NFR-S01 and NFR-S02 in the reviewed runtime surfaces; no compiled-routing runtime source contains a `.opencode/specs` reference, and route targets remain typed decisions checked against the selected policy identity. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: pass for NFR-S01 and NFR-S02 in the reviewed runtime surfaces; no compiled-routing runtime source contains a `.opencode/specs` reference, and route targets remain typed decisions checked against the selected policy identity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass for NFR-S01 and NFR-S02 in the reviewed runtime surfaces; no compiled-routing runtime source contains a `.opencode/specs` reference, and route targets remain typed decisions checked against the selected policy identity.

### Acronym-containment instance in current hub-router vocabularies: no bare boundary acronyms were found. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Acronym-containment instance in current hub-router vocabularies: no bare boundary acronyms were found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Acronym-containment instance in current hub-router vocabularies: no bare boundary acronyms were found.

### Activation-manifest copy drift as F007 root cause. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Activation-manifest copy drift as F007 root cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Activation-manifest copy drift as F007 root cause.

### CLI exit-code inversion: ruled out by direct branch and test review. [SOURCE: .opencode/bin/compiled-route-manifest.cjs:63-77] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: CLI exit-code inversion: ruled out by direct branch and test review. [SOURCE: .opencode/bin/compiled-route-manifest.cjs:63-77]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CLI exit-code inversion: ruled out by direct branch and test review. [SOURCE: .opencode/bin/compiled-route-manifest.cjs:63-77]

### Cohort-copy drift today: a dedicated equality test compares runtime and advisor sets. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Cohort-copy drift today: a dedicated equality test compares runtime and advisor sets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cohort-copy drift today: a dedicated equality test compares runtime and advisor sets.

### Downgrading F001 to P2: rejected because preservation is the function's stated behavioral contract and the write is unguarded. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Downgrading F001 to P2: rejected because preservation is the function's stated behavioral contract and the write is unguarded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Downgrading F001 to P2: rejected because preservation is the function's stated behavioral contract and the write is unguarded.

### Escalating any active finding to P0: rejected because no blocker meets the demonstrated-impact threshold. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Escalating any active finding to P0: rejected because no blocker meets the demonstrated-impact threshold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating any active finding to P0: rejected because no blocker meets the demonstrated-impact threshold.

### Explicit P1 deferral approval: no canonical packet document records one. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Explicit P1 deferral approval: no canonical packet document records one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Explicit P1 deferral approval: no canonical packet document records one.

### F006 affecting live routing: direct runtime matrix is correct; only benchmark telemetry is stale. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: F006 affecting live routing: direct runtime matrix is correct; only benchmark telemetry is stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F006 affecting live routing: direct runtime matrix is correct; only benchmark telemetry is stale.

### Fleet-wide instance of F005: disproved for every other hub carrying bare `review` vocabulary. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Fleet-wide instance of F005: disproved for every other hub carrying bare `review` vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fleet-wide instance of F005: disproved for every other hub carrying bare `review` vocabulary.

### Frozen scorer drift: all three hashes match. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Frozen scorer drift: all three hashes match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Frozen scorer drift: all three hashes match.

### Global manifest corruption: all seven status records are valid and fresh. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Global manifest corruption: all seven status records are valid and fresh.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Global manifest corruption: all seven status records are valid and fresh.

### Invalid routing flag enabling compiled mode: invalid values return false. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:67-75] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Invalid routing flag enabling compiled mode: invalid values return false. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:67-75]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Invalid routing flag enabling compiled mode: invalid values return false. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:67-75]

### Kill-switch coverage limited to a subset: all seven cohort hubs were observed. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Kill-switch coverage limited to a subset: all seven cohort hubs were observed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Kill-switch coverage limited to a subset: all seven cohort hubs were observed.

### Missing SD-015 dedicated test: disproved by named positive and negative cases. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Missing SD-015 dedicated test: disproved by named positive and negative cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing SD-015 dedicated test: disproved by named positive and negative cases.

### Partial write caused by compile failure: ruled out because compilation precedes the write. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:565-590] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Partial write caused by compile failure: ruled out because compilation precedes the write. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:565-590]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Partial write caused by compile failure: ruled out because compilation precedes the write. [SOURCE: .opencode/bin/lib/compiled-route-manifest.cjs:565-590]

### Promoted closure currently failing to serve. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Promoted closure currently failing to serve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Promoted closure currently failing to serve.

### Prompt-driven code execution: no `eval`, dynamic `Function`, or prompt-derived shell command exists in reviewed live routers. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Prompt-driven code execution: no `eval`, dynamic `Function`, or prompt-derived shell command exists in reviewed live routers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-driven code execution: no `eval`, dynamic `Function`, or prompt-derived shell command exists in reviewed live routers.

### Resolver-copy drift as F007 root cause. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Resolver-copy drift as F007 root cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resolver-copy drift as F007 root cause.

### SD-015 exemption leaking into served routes: directly covered by a negative twin test. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:502-534] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: SD-015 exemption leaking into served routes: directly covered by a negative twin test. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:502-534]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SD-015 exemption leaking into served routes: directly covered by a negative twin test. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/compiled-routing-parity.vitest.ts:502-534]

### Stale policy serving: resolver compares both hash and generation before returning a route. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:108-118] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Stale policy serving: resolver compares both hash and generation before returning a route. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:108-118]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale policy serving: resolver compares both hash and generation before returning a route. [SOURCE: .opencode/bin/lib/compiled-routing/011-runtime-engine/lib/resolve.cjs:108-118]

### Targeted parity regression suite failure: 49/49 passed. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Targeted parity regression suite failure: 49/49 passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Targeted parity regression suite failure: 49/49 passed.

### The flag telemetry defect changing live routing: exact search found it in reporting/tests only. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The flag telemetry defect changing live routing: exact search found it in reporting/tests only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The flag telemetry defect changing live routing: exact search found it in reporting/tests only.

### Treating F007 as stale test-only noise: rejected because the sync build itself requires authored closure resolution before promotion. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating F007 as stale test-only noise: rejected because the sync build itself requires authored closure resolution before promotion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating F007 as stale test-only noise: rejected because the sync build itself requires authored closure resolution before promotion.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Hard ceiling reached: synthesize the deduplicated registry. - Aggregate verdict: CONDITIONAL because five active P1 findings remain. - Stop reason: `maxIterationsReached`. - Required follow-up: remediation planning before a release-complete claim. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
