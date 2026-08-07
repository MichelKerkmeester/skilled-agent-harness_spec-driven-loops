# Deep Review Report

## 1. Executive Summary

Verdict: **FAIL**. The three configured review iterations completed across correctness, security, traceability, and maintainability. The lineage contains four active findings: one P0 blocker, two P1 required fixes, and one P2 resilience suggestion. Release readiness is **release-blocking** until the P0 and P1 findings are remediated and verified.

The strongest confirmed issue is in the authored filesystem boundary: an existing symlink at an allowed authored filename can redirect `writeFile` into a measured artifact. The parent packet topology is also stale against its registered children, and the authored Markdown export has weaker validation than the structured token export.

No production or target spec files were changed. All workflow outputs are confined to this lineage directory.

## 2. Planning Trigger

Planning is required because the review ended with active P0/P1 findings and no advisory-only outcome.

```json
{
  "triggered": true,
  "triggerReason": "active P0/P1 findings",
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": ["F004", "F001", "F002", "F003"],
  "remediationWorkstreams": ["authored-boundary-hardening", "packet-topology-reconciliation", "authored-export-contract", "paired-export-recovery"],
  "specSeed": "Reconcile the hallmark phase-parent topology and harden authored output boundaries without changing measured artifacts.",
  "planSeed": "Fix the P0 boundary first, then reconcile parent metadata, enforce the Markdown contract, and add recovery coverage for paired exports.",
  "findingClasses": ["authored-measured-boundary-bypass", "parent-child-topology-drift", "authored-output-integrity", "paired-export-consistency"],
  "affectedSurfacesSeed": ["authored writer", "measured artifacts", "phase resume", "recursive validation", "authored exports"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Finding | Evidence | Impact | Recommended disposition |
|---|---|---|---|---|---|
| F004 | P0 | Authored leaf symlinks can redirect a permitted write into measured data. | `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:66-72`; adversarial coverage at `.opencode/skills/sk-design/shared/scripts/brand-first-boundary.test.mjs:25-31`. | A permitted authored filename can clobber `DESIGN.md`, `tokens.json`, or another measured target through a pre-existing symlink. | Reject symlinked destinations with `lstat`; use no-follow or atomic final-write semantics; add a symlink redirection regression test. |
| F001 | P1 | Phase-parent scope and lifecycle metadata omit a completed fifth child. | Parent scope/map at `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:72,90`; child status at `005-measured-composition-and-retrieval-facets/spec.md:51`; graph registration at `graph-metadata.json:11`. | Resume, recursive validation, and navigation can retain a Planned parent and miss a completed child. | Reconcile parent scope, phase map, status, and generated metadata with the five-child topology. |
| F002 | P1 | Authored Markdown export is only provenance-marker checked. | `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:76-82`; template requirements at `authored-design-template.md:25,38`. | A malformed or mismatched `AUTHORED-DESIGN.md` can be published beside valid structured tokens. | Validate the rendered Markdown contract or render both exports from the validated structured brand. |
| F003 | P2 | Paired authored exports are not refreshed atomically. | `.opencode/skills/sk-design/shared/authored-brand/authored-brand-boundary.mjs:93-96`. | Partial I/O can leave the Markdown and JSON exports from different refreshes. | Stage both files and commit the pair atomically, or add rollback and consistency recovery. |

All P0/P1 claims have typed claim-adjudication packets in the iteration artifacts. Three adjudication events passed with no missing packets.

## 4. Remediation Workstreams

1. **Authored-boundary hardening — P0.** Make the final destination resistant to symlink redirection, preserve the measured files byte-for-byte, and add a regression test for an existing authored-name symlink.
2. **Packet-topology reconciliation — P1.** Decide whether the fifth child belongs to this parent. If it does, update the parent scope, phase map, lifecycle status, and generated metadata consistently; if it does not, remove the contradictory parent registration and pointer.
3. **Authored-export contract — P1.** Establish one authoritative representation and validate the complete Markdown provenance contract before writing it.
4. **Paired-export recovery — P2.** Define and test failure behavior when one export write succeeds and the other fails.

## 5. Spec Seed

**Intent:** restore agreement between the phase-parent packet graph and the shipped children, while preserving the authored/measured boundary.

**Scope:** the parent packet metadata and the authored-brand writer/test boundary named by F001-F004.

**Requirements:**

- The authored writer must reject final-path symlink redirection before any measured artifact can be modified.
- The parent packet must describe the same child topology that graph metadata and child packets register.
- The authored Markdown and structured-token exports must be generated or validated from one consistent provenance contract.
- Paired export failure semantics must be explicit and covered by tests.

**Constraints:** do not overwrite measured artifacts, do not broaden the design-system surface, and preserve the existing authored filename allowlist.

## 6. Plan Seed

| Order | Work | Exit evidence |
|---:|---|---|
| 1 | Harden final-path handling and add adversarial symlink coverage. | Boundary test proves measured files remain unchanged when an authored-name symlink exists. |
| 2 | Reconcile parent/child topology and regenerate lifecycle metadata. | Parent scope, phase map, child registration, and statuses agree. |
| 3 | Enforce or deterministically render the authored Markdown contract. | Malformed/mismatched Markdown is rejected or impossible at the boundary. |
| 4 | Define paired-export recovery semantics. | Failure-injection test proves no silently inconsistent pair remains. |
| 5 | Run the complete packet validation and relevant test gates. | Validation output is captured against the reconciled packet state. |

## 7. Traceability Status

| Protocol | Status | Gate | Evidence |
|---|---|---|---|
| `spec_code` | FAIL | hard | Parent map and lifecycle state disagree with the registered child topology; F001. |
| `checklist_evidence` | PARTIAL | hard | Existing checks cover direct path negatives and static card constraints, but not the F002/F003/F004 boundary cases. |
| `feature_catalog_code` | PARTIAL | advisory | The authored boundary is centralized, but its Markdown contract and final-path policy are incomplete. |
| `playbook_capability` | FAIL | advisory | The never-clobber invariant is documented but not enforced for symlinked authored destinations. |
| `AC_COVERAGE` | NOT EVALUATED | advisory | No resource map was present and graph coverage was unavailable; no acceptance-coverage claim is inferred. |

Search debt is zero. The review used direct reads and exact grep where graph evidence was unavailable.

## 8. Deferred Items

- F003 remains a P2 recommendation after the P0/P1 work; it is not release-blocking by itself but affects rerun recovery.
- No separate SQL-injection or measured-indexer path-escape finding was raised: retrieval inputs are parameterized and measured corpus reads use resolved containment checks.
- No separate card-content finding was raised: the seven structural-card files, index, and schema passed the exact exclusion grep and are static Markdown.

## 9. Verification and Release Readiness

- Iterations completed: **3 of 3**.
- Stop policy: **max-iterations**; convergence was recorded as telemetry and did not end the loop early.
- New-finding ratios: `0.55 -> 0.80 -> 0.00`.
- Reducer result: four active findings, zero resolved findings, zero corrupted JSONL records, zero search-debt items.
- Dimension coverage: correctness, security, traceability, and maintainability all covered.
- Claim adjudication: runs 1-3 passed; missing packets: none.
- Graph convergence: unavailable (`graphConvergenceScore: 0.00`); this does not reduce the directly evidenced findings.
- Production changes: none; this was a read-only review of the target with lineage-only artifact writes.

Release readiness: **release-blocking** because F004 is P0 and F001/F002 are P1.

## Dimension Expansion Map

| Iteration | Dimension | Review angle | Result |
|---:|---|---|---|
| 1 | correctness | Parent/child state, authored output contract, paired export behavior | F001, F002, F003 |
| 2 | security | Symlink redirection, measured corpus containment, untrusted retrieval inputs | F004; corpus and SQL paths ruled out |
| 3 | traceability | Parent map, child metadata, checklist evidence, generated claims | F001 confirmed |
| 3 | maintainability | Single-source export contract and recovery semantics | F002/F003 confirmed |

## Search Ledger

| Evidence source | Method | Result |
|---|---|---|
| Parent packet and child metadata | Direct file reads | Five registered children conflict with the parent’s four-lane/four-phase description. |
| Authored boundary and tests | Direct source reads | Final-path symlink case is unguarded and untested; rendered Markdown is marker-only validated. |
| Structural-card index/schema/cards | Exact grep and scoped file listing | Seven cards exist; forbidden catalog identifiers were not found in the card set, index, or schema. |
| Measured indexer/retrieval | Direct source reads | Realpath containment and parameterized SQL found; no separate finding raised. |
| Code graph | MCP route unavailable | Direct-read fallback used; no graph-derived coverage claim made. |

## Audit Appendix

- Session: `fanout-luna-xhigh-1784786065794-6evsk5`
- Executor: `cli-codex`, model `gpt-5.6-luna`, reasoning effort `xhigh`, service tier `fast`
- Review target: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system`
- Artifact root: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/review/lineages/luna-xhigh`
- Review dimensions: correctness, security, traceability, maintainability
- Resource map: absent by configuration; no resource-map artifact emitted
- Terminal stop: `maxIterationsReached`
