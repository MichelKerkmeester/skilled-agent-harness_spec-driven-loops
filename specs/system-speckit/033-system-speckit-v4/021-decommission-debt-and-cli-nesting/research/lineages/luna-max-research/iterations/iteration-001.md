# Iteration 1: Programme charter baseline

## Focus

Read the mandated sources in order and map what the landing, rename, and debt-fixes packets already closed, deferred, or contradict. This establishes the exclusion set for later live-surface searches; it does not treat historical review prose as current-tree truth.

## Findings

1. **LUNA-001 — 054 is not yet closeable. P1. CONFIRMED.** The packet makes the six 052 debt rows, the trigger-index move, retired rollback-runbook deletion, and standards alignment in scope, while T009 (alignment/readmes) and T010-T012 (verification and closure) remain unchecked. All seven acceptance criteria are still `Unmet`. Smallest fix: complete or explicitly defer each open task with evidence before claiming packet closure. [SOURCE: specs/system-speckit/054-decommission-debt-fixes/spec.md:47-57] [SOURCE: specs/system-speckit/054-decommission-debt-fixes/tasks.md:47-62] [SOURCE: specs/system-speckit/054-decommission-debt-fixes/acceptance-criteria.md:55-63]

2. **LUNA-002 — The 052 LOG contains D6 debt outside 054's six-row scope. P1. CONFIRMED.** The landing log separately records validator class defects, machine-local sqlite dependence in command-reference checks, pre-existing deleted hook mirrors, and an unproved clean-install dependency placement. D6 defines skipped gates and docs/hooks that describe or serve retired surfaces as debt. Smallest fix: carry each row into a named follow-up packet or an approved 054 extension; do not let 054 closure imply that the whole programme debt inventory is clear. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:60-62] [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:116-122] [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:197-208]

3. **LUNA-003 — The last 053 PASS report is stale for its two active P2s. P2. CONFIRMED.** The report lists an MCP-server label in `README.md` and `.opencode/bin/README.md`, plus dependency-count arithmetic drift. The live 052 LOG records those items as fixed at `85d9791eb3`, and the current 053 summary says the runtime declares three dependencies and nine were removed. Smallest fix: mark those report rows superseded by the fixing commit or regenerate the report against the final tree. [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md:73-118] [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:124-127] [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:54-57]

4. **LUNA-004 — 053's implementation summary contradicts its own review status. P2. CONFIRMED.** Its verification table says the ten-iteration rename review passed, while Known Limitation 5 says the review has not run and AC-010 remains open. The 052 LOG records a later PASS lineage. Smallest fix: reconcile the limitation and acceptance status with the authoritative final review artifact, preserving the earlier limitation only as historical chronology if needed. [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:180-181] [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:205-211] [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:124-127]

5. **LUNA-005 — 053 explicitly carried unfinished tests and stale references into later work. P2. CONFIRMED.** The summary reports an inconclusive runtime suite with 669 passing and 24 failing, and names an allowlisted nonexistent playbook path plus fixtures referring to a never-existent `shared/mcp-server/database` path. Those are outside 054's six debt rows. Smallest fix: add isolated reproduction and ownership rows to the debt inventory before using 053 as a clean baseline. [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:177-179] [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:197-203] [SOURCE: specs/system-spec-kit/053-spec-kit-runtime-rename/implementation-summary.md:222-226]

6. **LUNA-006 — The 052 LOG names a stalled review lineage whose report is not established by the mandated report set. P2. INFERRED.** The LOG says attempt 1 was kept at `review/lineages/luna-max-pass3.attempt-1-stalled`, but the available reports read for this iteration are the final PASS and conditional attempt-3 report. The absence of the named attempt-1 report was not independently resolved here. Smallest fix: verify the exact `specs/` and `.opencode/specs/` paths and either preserve the report or correct the LOG pointer. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:124-126] [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md:58-71] [INFERENCE: the named attempt-1 artifact may be absent, relocated, or represented only by the LOG]

## Ruled Out

- Treating every finding in the final 053 PASS report as a current live defect was ruled out after the 052 LOG and current implementation summary recorded the two P2 fixes.

## Dead Ends

- No live-code search was attempted in this baseline iteration; that is deferred to the next focus so historical evidence is not conflated with executable residue.

## Edge Cases

- Ambiguous input: “review reports” was interpreted as the two available `review-report.md` files under the requested 053 review lineage tree; missing attempt artifacts remain an explicit finding.
- Contradictory evidence: 053 verification and limitation sections conflict; both were retained and the later 052 LOG entry is better temporal evidence, but the packet document remains inconsistent.
- Missing dependencies: no external dependency was needed for this baseline.
- Partial success: all mandated starting documents and available reports were read; no live-surface search was performed by design.

## Questions Remaining

- Q1-Q7 remain open; next is Q1 live retired-surface residue.

## Sources Consulted

- [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:50-212]
- [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/implementation-summary.md:170-226]
- [SOURCE: specs/system-speckit/054-decommission-debt-fixes/spec.md:44-104]
- [SOURCE: specs/system-speckit/054-decommission-debt-fixes/tasks.md:44-73]
- [SOURCE: specs/system-speckit/054-decommission-debt-fixes/acceptance-criteria.md:50-80]
- [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3/review-report.md:55-124]
- [SOURCE: specs/system-speckit/053-spec-kit-runtime-rename/review/lineages/luna-max-pass3.attempt-3-conditional/review-report.md:68-103]

## Assessment

- New information ratio: 1.00
- Questions addressed: programme scope, deferred debt, stale review evidence, contradictory completion claims
- Questions answered: none fully; Q1-Q7 remain open for live verification
- Confidence: high for the document-to-document contradictions; medium for the missing attempt-1 artifact because only the named path and available reports were checked.

## Reflection

- What worked and why: reading the four requested packets before the review reports created a stable scope and evidence baseline.
- What did not work and why: using a PASS report as current-tree truth would have repeated two already-fixed P2s; the report is historical evidence, not a live inventory.
- What I would do differently: switch to exact live-surface searches and producer-consumer traces immediately, preserving the baseline only as exclusions.

## Recommended Next Focus

Angle 1: search live code and configuration for retired memory-database, memory MCP, spec-memory launcher, zvec, system-plugins, and old runtime identity residue. Exclude advisor-owned MCP references and historical evidence unless a live consumer is proven.
