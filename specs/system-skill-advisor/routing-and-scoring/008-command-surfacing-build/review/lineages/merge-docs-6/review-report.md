# Review Report - merge-docs lineage, command-surfacing pass six

## 1. Executive Summary

- **Overall verdict: FAIL** — gate-level, not defect-level. No P0 and no P1 finding exists. Two P2 advisories are active. The FAIL comes from one required terminal quality gate: coverage stability was not achieved before the iteration cap (see section 8).
- **hasAdvisories: false** — the advisory flag applies only to a PASS verdict.
- **Active findings: P0=0, P1=0, P2=2.**
- **Review scope**: the twelve files from `review/review-scope-6.txt` whose area is `merge-docs`, plus the code their changed claims name. Reviewed across three iterations: traceability, correctness and security, maintainability.
- **Iterations**: 3 of 3. **Stop reason**: `maxIterationsReached`.
- **Release readiness**: `in-progress`.
- **Operator review focus (verbatim)**: "Review pass six. First read specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-6.txt and follow it: it names your area by lineage label, the scope file review/review-scope-6.txt, the diff command for each area, the recorded limits not to re-report and the holdout rule. Every finding is P0, P1 or P2 with file:line and a concrete input. Change no code and write only inside your lineage folder."

### Why the verdict is FAIL

The review itself is complete for its declared scope: all four configured dimensions have a full iteration, both findings carry file:line evidence, and every finding sits inside the dispatched review scope. The terminal coverage gate still fails for one mechanical reason:

- `coverageAge = 0`. Maintainability was first covered in iteration 3, the same iteration the cap ended the loop, so the required one-pass coverage stabilization never ran (`terminal-gates.cjs` reason `coverage-too-young`).

The config conflict is real: `maxIterations=3` with four dimensions and a one-pass stabilization requirement cannot satisfy coverage stability. The traceability and scope gates pass, and the registry records `traceabilityCovered: true`, so this is not a missing-check false negative. The gate is carried in section 8.

## 2. Planning Trigger

`/speckit:plan` is required for the two advisory remediations and for the coverage-stability follow-up. The packet is built from the reducer registry plus the iteration `findingDetails`; no field is inferred from prose.

```json
{
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["MD6-P2-001", "MD6-P2-002"],
  "remediationWorkstreams": [
    "WS-1 Release-note index accuracy",
    "WS-2 README health-record scope",
    "WS-3 Coverage stabilization follow-up"
  ],
  "specSeed": [
    "Make the v4.0.2.1 closing index name the newest system-spec-kit changelog, or generate the range from the changelog folder.",
    "State the OpenCode exception in the README health-record paragraph, so the durable doc and the release note agree."
  ],
  "planSeed": [
    "Extend the system-spec-kit range at .skilled/changelog/skilled/v4.0.2.1.md:480 to 2.13.4.0 or add the missing release-note section.",
    "Add one clause to README.md:682 naming the OpenCode plugin as the runtime that writes no health record.",
    "Run one stabilization pass for coverage, or amend a future four-dimension lineage to maxIterations=5."
  ],
  "findingClasses": ["instance-only"],
  "affectedSurfacesSeed": [
    "release notes: v4.0.2.1 closing index",
    "README: advisor observability",
    "system-spec-kit changelog index",
    "OpenCode plugin delivery path"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

Both findings are P2, active, and evidenced with file:line. Neither relies on inference.

### MD6-P2-001 — The release note's system-spec-kit range stops one version short

- **Dimension**: traceability
- **File**: `.skilled/changelog/skilled/v4.0.2.1.md:480`
- **Evidence**: the paragraph says `system-spec-kit` has entries "for this release" from `v2.12.41.0 to v2.13.3.0`; `.skilled/skills/system-spec-kit/SKILL.md:5` and `.skilled/skills/system-spec-kit/changelog/v2.13.4.0.md:11` are `2.13.4.0`, and the merge commit added the v2.13.4.0 file when it bumped the skill.
- **Case**: a reader auditing what v4.0.2.1 contains reads the closing index, sees the sequence end at 2.13.3.0, and never opens v2.13.4.0, so the release-level summary omits the "no command file named skill.md" rule the same merge added.
- **Impact**: the release note understates its own content by one system-spec-kit entry.
- **Fix**: extend the range to `2.13.4.0`, or add a v4.0.2.2 note that carries the entry.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: `rg -n "v2\\.12\\.41\\.0 to v2\\.13\\.[0-9]\\.0"` over the twelve scope files returns only line 480; every other skill range on that line matches its `SKILL.md` version.
- **Affected surface hints**: `["release notes", "system-spec-kit changelog index", "upgrade checklist"]`

### MD6-P2-002 — The README promises a health record on every prompt hook without the OpenCode exception

- **Dimension**: traceability
- **File**: `README.md:682`
- **Evidence**: the added paragraph says "Every prompt hook run also writes a small health record"; only the Claude-family hook calls `persistAdvisorHookDiagnosticRecord` (`.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:258`), and `.opencode/plugins/system-skill-advisor.js` imports no diagnostics writer. The release note names the exception at `.skilled/changelog/skilled/v4.0.2.1.md:114`, and the doctor setup contract says "OpenCode has no prompt hook that writes one" at `.skilled/commands/doctor/assets/doctor-setup.yaml:59`.
- **Case**: an OpenCode user reads the README, runs one prompt, then `advisor_status`; the response has no `hookHealth` section because the plugin never wrote a record, so the README's promise does not hold on that runtime.
- **Impact**: one runtime's observability is overstated in the durable README.
- **Fix**: add "except the OpenCode plugin" or an equivalent clause to the README paragraph.
- **Disposition**: active. **Finding class**: instance-only.
- **Scope proof**: `rg -n "persistAdvisorHookDiagnosticRecord" .opencode/plugins` returns nothing, while the Claude hook is the only non-test binding; `rg -n "hookHealth" .opencode/plugins` also returns nothing.
- **Affected surface hints**: `["README advisor section", "OpenCode plugin delivery path", "advisor_status observability"]`

## 4. Remediation Workstreams

1. **WS-1 Release-note index accuracy** — MD6-P2-001. Extend the range at `.skilled/changelog/skilled/v4.0.2.1.md:480` to `2.13.4.0`. Optional durable fix: generate the range from the changelog folder so the hand-maintained list cannot drift again.
2. **WS-2 README health-record scope** — MD6-P2-002. Add the OpenCode exception to `README.md:682`. Keep the release note's existing carve-out; only the README copy is missing it.
3. **WS-3 Coverage stabilization follow-up** — gate-level only, no finding. Schedule one stabilization pass for this area, or raise a future four-dimension review's `maxIterations` to five. The review content is complete; only the gate clock is short.

## 5. Spec Seed

- The release-level changelog index should name every system-spec-kit version it carries, including the one added by a merge, or be generated from the changelog directory.
- The README's advisor observability paragraph should describe the same runtime coverage as the release note, naming the OpenCode plugin as the exception.
- A four-dimension review with a one-pass stabilization rule needs an iteration cap of at least five; state that relation in the review packet's config guidance.

## 6. Plan Seed

- Correct `.skilled/changelog/skilled/v4.0.2.1.md:480` to `v2.12.41.0 to v2.13.4.0` and confirm the v2.13.4.0 entry is linked from the release section.
- Add the OpenCode exception clause to `README.md:682`, then diff the README paragraph against `.skilled/changelog/skilled/v4.0.2.1.md:114` for any other missing carve-out.
- For the next pass over this area, set `maxIterations` to five or accept the coverage gate's mechanical failure at the cap.

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Merge-loss sweep over the twelve paths found no main-held line dropped; every behavior claim tested in iterations 1-2 resolves to a file:line. |
| `checklist_evidence` | core | notApplicable | No `checklist.md` at the packet root; the pass-six brief and scope file are the operative checklist and both were read. |
| `skill_agent` | overlay | pass | `.skilled/agents/markdown.md:197,290` name `/create:sk-skill`; the command file exists and the 13 related-resource entry files all resolve. |
| `agent_cross_runtime` | overlay | pass | `.vibe/agents/markdown.toml:1` matches the canonical body line for line; the other runtime agent mirrors carry the rename. |
| `feature_catalog_code` | overlay | notApplicable | No feature-catalog claim is touched by the twelve paths. |
| `playbook_capability` | overlay | notApplicable | No manual-testing-playbook claim is touched by the twelve paths. |

**AC_COVERAGE**: exempt. The review target has no `checklist.md` and no `implementation-summary.md`, so the spec-folder lifecycle predicate is not active.

## 8. Deferred Items

- **Coverage stabilization (gate-level FAIL cause).** All four dimensions are covered, but `coverageAge=0` because maintainability landed in iteration 3, the cap iteration. The 3-iteration cap and the one-pass stabilization rule conflict. Recovery: run a fourth pass, or amend a future run's `maxIterations` to five for a four-dimension review.
- **The hand-maintained release-note index.** MD6-P2-001 is the symptom; the closing paragraph at `.skilled/changelog/skilled/v4.0.2.1.md:480` lists every skill's range by hand. A generated range would prevent recurrence, but that is a separate tooling change and is not required to close the advisory.
- **The README/release-note overlap.** MD6-P2-002 exists because both copies describe hook health and only one names the OpenCode exception. Removing either copy is not the fix; the durable README should carry the full exception.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept directions: traceability (merge loss and doc claims), correctness and security (generated policy, CI wiring, privacy and shell-reader behavior), maintainability (references, generated boundaries, duplicate workflow block).
- No dimension was pivoted; no direction was exhausted as a retry.

## 9. Search Ledger

| ID | Dimension | Direction | Result | Disposition |
|----|-----------|-----------|--------|-------------|
| SL-01 | traceability | Per-merge line comparison of main's additions against each merge result | No main-held line dropped in the twelve paths | ruled out |
| SL-02 | traceability | Every changed doc claim against its code | Two mismatches; the rest hold | findings MD6-P2-001/002 |
| SL-03 | correctness | Run the real sk-doc compiled-route resolver against the regenerated manifest | Hash and generation match the live snapshot | ruled out |
| SL-04 | correctness | Workflow path filters and Vibe check ordering | `command-tree-parity.yml` carries the same checks and the install runs before them | ruled out |
| SL-05 | security | Hook health persistence and schema | Prompt-free record; validator rejects forbidden fields | ruled out |
| SL-06 | security | Vibe hook-wiring shell reader | Tokenizes only; depth capped; never executes | ruled out |
| SL-07 | maintainability | Every path named by the changed doc lines | All 13 entry files, the command and the packet path exist | ruled out |
| SL-08 | maintainability | Duplicated workflow path block and generated boundaries | Copies agree; generated files state or prove their source | ruled out |

## 10. Audit Appendix

- Iterations: 3. Stop reason: `maxIterationsReached`. Terminal gate rows: evidence pass, scope pass, coverage fail (`coverage-too-young`).
- Convergence script gates at the stop: `convergenceGate` pass (score 0.55), `dimensionCoverageGate` fail (`missing=[]`, `coverageAge=0`, `traceabilityCovered=true`), `p0ResolutionGate` pass, `evidenceDensityGate` pass, `hotspotSaturationGate` fail, `claimAdjudicationGate` pass, `fixCompletenessReplayGate` pass, `candidateCoverageGate` fail, `graphlessFallbackGate` fail.
- The terminal cap is legal at `maxIterationsReached`; the failed gates are recorded as synthesis evidence, and only coverage is a required terminal gate.
- State records went through `append-mode-event.cjs` (run open, three iteration records, terminal gates); the reducer ran after every iteration.
- No review target, config, registry, reducer output, command, skill, agent or mirror was modified. All writes stayed inside `review/lineages/merge-docs-6/`.
- The coverage graph was not seeded because `upsert.cjs` writes outside the lineage; the reducer and `convergence.cjs` ran on the graphless fallback and reported `graphConvergenceScore: 0` with the registry coverage signals intact.
