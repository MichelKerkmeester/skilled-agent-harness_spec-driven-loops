# Deep Review Strategy

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review of specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing (spec-folder): the series parent rule in the phase docs, the Gate 3 option C wording, the recent-packets listing and seeded trigger phrases in create.sh, the template-default class in phrase-judge.mjs, and their tests. Shipped on main in commits 6a21c6b5311, bff396f481e, f53d63e4615 and a3bec035edc.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Rewriting or fixing anything: findings only.
- The 195 older specs that keep the template trigger phrases (deliberately out of scope in the target spec).
- The Gate 3 runtime hook and the global ~/.claude/CLAUDE.md copy (both excluded by the target spec).

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: run all 3 iterations; convergence is telemetry only.
- Stop on a pause sentinel or an unrecoverable dispatch error.

---

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
- P1 (Required): 4
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Runtime-first reading order: the listing and seed code paths bounded what the traceability sweep had to check (iteration 2)
- Re-running each prior finding's exact evidence line instead of trusting the registry: all six re-confirmed active, no drift (iteration 2)
- Adversarial framing of the new stderr surface (which bytes can reach the terminal?) exposed R2-P2-001 where functional tests cannot see it (iteration 2)
- Production-input tracing for the listing: following `derived.created_at` from the reader to the scaffold stub and parser refuted the drift hypothesis with three citations, rather than filing it (iteration 3)

---

## 9. WHAT FAILED
- Executing tests: banned by the read-only dispatch, so AC-007's "96 tests" and REQ-007 stay assertion-read only (iteration 2)
- Line-reviewing the generated trigger-index.json diff: ~2.2k lines, deliberately omitted and carried as an omitted high-risk target (iteration 1)
- The packet's own threshold-restatement sweep still missed the feature-catalog knowledge node; a repo sweep for the threshold wording plus a `series parent` check found it in one pass (iteration 3)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Listing metadata contract]: Is `derived.created_at` actually produced in production, or only by test fixtures? Ruled out as a defect: `create.sh:617` writes it in the scaffold stub and `runtime/lib/graph/graph-metadata-parser.ts:1503` preserves it on refresh; 006 and 007 metadata carry it (iteration 3, evidence: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:617`, `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts:1503`).
- [Label gate weakness]: `test-phase-command-workflows.js:104-105,128` accepts `Option E` as one of several permissive markers, so it cannot catch a stale-label reintroduction. Recorded as corroborating context for R1-P1-002 only; the gate does not require the stale label, and filing it separately would duplicate the registered label drift (iteration 3).
- [Listing cap and constants]: the 14-day window, 10-row cap and 100-char truncation are inline anonymous numbers with no boundary test on the cap. Advisory-only surface, below the registration bar (iteration 3).
- [Fixture harness duplication]: the `beforeEach` scaffold harness is near-identical across `create-root-numbering.vitest.ts:21-55` and `create-track-refresh.vitest.ts:21-70`; two copies only, abstraction deliberately deferred per the two-is-not-a-pattern restraint (iteration 3).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior context: the target packet's implementation-summary.md and acceptance-criteria.md record AC-001..AC-007 as Met, with 96 tests passing in six files and validate.sh --strict PASSED 7/7. The orchestrator fixed three DeepSeek worker defects before commit: punctuation left in the description phrase, a crash when the track folder is missing, and a misplaced function comment. Known limitations recorded by the target: global CLAUDE.md drift, advisor packet 026 groups by outcome not artifact, about 195 specs keep template phrases.

- Target pointers: the 19 files in Files Under Review.
- Behavior claims: target spec.md section 4 REQ-001..REQ-007 and acceptance-criteria.md AC-001..AC-007.
- Reuse and conventions: create.sh existing perl/node -e patterns; phrase-judge.mjs GENERIC_TRIGGER_WORDS path.
- Review risks and gaps: the listing reads graph-metadata derived.created_at; the seeded phrase is built with tr and perl.
- Iteration 2 result (2026-10-07): 4 new P2s (R2-P2-001 terminal-escape passthrough in the listing; R2-P2-002 AC continuity metadata stale; R2-P2-003 AC-004 sub-folder clause untested; R2-P2-004 template phrase literals duplicated). All six iteration-1 findings re-verified active at HEAD; seed-path injection re-confirmed ruled out.
- Iteration 3 result (2026-10-07): 2 new findings -- R3-P1-001 (REQ-003 third missed doc: `feature-catalog/tooling-and-scripts/phase-system-knowledge-node.md:29` restates both thresholds with no series-parent exception) and R3-P2-001 (006 `spec.md` In-Scope and Files-to-Change omit `spec-folder-authoring-checklist.md`, which the packet modified per `implementation-summary.md`). All ten prior findings re-verified active at HEAD, no drift. Listing `derived.created_at` production input ruled out (`create.sh:617` stub writes it; `graph-metadata-parser.ts:1503` preserves it).

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | REQ-001/004/005/006 met by read; REQ-002 (R1-P1-002) and REQ-003 (R1-P1-003 plus the R3-P1-001 catalog miss) still unmet; REQ-007 assertion-read only |
| `checklist_evidence` | core | partial | 3 | AC-001/005/006 hold; AC-002/003 under-scope (R1-P1-002/003); AC-004 sub-folder clause untested (R2-P2-003); AC continuity stale (R2-P2-002); AC-007 not machine-verifiable in a read-only dispatch |
| `skill_agent` | overlay | pass | 3 | SKILL.md:511 rule 16 names the exception; no agent definition touched |
| `agent_cross_runtime` | overlay | notApplicable | 3 | no agent mirrors changed by 006 |
| `feature_catalog_code` | overlay | partial | 3 | the phase-system knowledge node restates the thresholds without the exception (R3-P1-001) |
| `playbook_capability` | overlay | pass | 3 | the manual-testing-playbook documents `--level phase-parent`; unchanged by 006 |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-spec-kit/references/structure/phase-definitions.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/structure/sub-folder-versioning.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/structure/phase-system.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/workflows/quick-reference.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/SKILL.md | - | - | - | pending |
| AGENTS.md | - | - | - | pending |
| .skilled/commands/speckit/assets/speckit-plan.yaml | - | - | - | pending |
| .skilled/commands/speckit/assets/speckit-complete.yaml | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts | - | - | - | pending |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/spec.md | - | - | - | pending |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/plan.md | - | - | - | pending |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/tasks.md | - | - | - | pending |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/acceptance-criteria.md | - | - | - | pending |
| specs/system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing/implementation-summary.md | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.10 (stopPolicy max-iterations: telemetry only)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-07T05:11:34.566Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-07T05:11:34.566Z
- Resource Map Coverage: resource-map.md not present; skipping coverage gate.
<!-- MACHINE-OWNED: END -->

---
