# Deep Review Report: Reference Evidence Research

## 1. Executive Summary

- **Verdict:** CONDITIONAL, from 0 P0, 1 P1 and 26 P2 active findings. These are the counts the verdict used, as the merge and `review-verdict.cjs` returned them.
- **hasAdvisories:** false, because the verdict is not PASS.
- **Remediation done:** every finding was then checked against its cited lines by a separate worker and fixed in `research/research.md` and `research/regrade-log.md`. 25 findings hold and 2 partly hold. None was rejected. The per-finding record is `fix-log.md` in this folder. The same pass also applied 19 items from an independent single-pass review and skipped 1 that concerns a text outside the repository.
- **Lineage trust:** the runner marked both lineages `failed` with failure class `exit`, because neither state log holds a `terminal_gates` row. Both exited 0 and each wrote 10 iteration records and its own `review-report.md`. The merge carries both as untrusted. Their findings were therefore not taken on trust and each was re-checked before any fix.
- **Self-check outcomes:** the re-check in `fix-log.md` stands in for the adversarial self-check. It confirmed 25, confirmed 2 in part and called none a false positive.
- **Scope:** 42 files, `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`, listed in `fanout-review-scope.txt`. The reference repos and the 003 build plan were read as evidence, not reviewed.
- **Operator review focus:** none was given.

## 2. Planning Trigger

`/speckit:plan` is not required. The one P1 and all P2 findings were fixed inside this packet, so no remediation workstream is left for a plan.

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "R2-P1-001",
      "severity": "P1",
      "dimension": "traceability",
      "file": "research/research.md:24",
      "disposition": "holds, fixed"
    },
    {
      "id": "R1-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:34",
      "disposition": "holds, fixed"
    },
    {
      "id": "R1-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:663",
      "disposition": "holds, fixed"
    },
    {
      "id": "R10-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:38",
      "disposition": "holds, fixed"
    },
    {
      "id": "R2-P2-001",
      "severity": "P2",
      "dimension": "traceability",
      "file": "research/research.md:707",
      "disposition": "holds, fixed"
    },
    {
      "id": "R3-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:34",
      "disposition": "holds, fixed"
    },
    {
      "id": "R4-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:278",
      "disposition": "holds, fixed"
    },
    {
      "id": "R4-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:278",
      "disposition": "holds, fixed"
    },
    {
      "id": "R5-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:62",
      "disposition": "holds, fixed"
    },
    {
      "id": "R5-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:336",
      "disposition": "partly holds, fixed in part"
    },
    {
      "id": "R6-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:690",
      "disposition": "holds, fixed"
    },
    {
      "id": "R6-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:583",
      "disposition": "holds, fixed"
    },
    {
      "id": "R7-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:499",
      "disposition": "holds, fixed"
    },
    {
      "id": "R7-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:448",
      "disposition": "holds, fixed"
    },
    {
      "id": "R8-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:26",
      "disposition": "holds, fixed"
    },
    {
      "id": "R8-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:26",
      "disposition": "holds, fixed"
    },
    {
      "id": "R9-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:745",
      "disposition": "holds, fixed"
    },
    {
      "id": "R9-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:22",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R1-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:186",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R1-P2-002",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:196",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R10-P2-001",
      "severity": "P2",
      "dimension": "traceability",
      "file": "research/research.md:34",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R2-P2-001",
      "severity": "P2",
      "dimension": "security",
      "file": "research/research.md:305",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R3-P2-001",
      "severity": "P2",
      "dimension": "traceability",
      "file": "research/regrade-log.md:3",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R4-P2-001",
      "severity": "P2",
      "dimension": "maintainability",
      "file": "research/research.md:707",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R5-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:175",
      "disposition": "holds, fixed"
    },
    {
      "id": "V2-R6-P2-001",
      "severity": "P2",
      "dimension": "security",
      "file": "research/research.md:206",
      "disposition": "partly holds, fixed in part"
    },
    {
      "id": "V2-R9-P2-001",
      "severity": "P2",
      "dimension": "correctness",
      "file": "research/research.md:286",
      "disposition": "holds, fixed"
    }
  ],
  "remediationWorkstreams": [],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": [
    "research/research.md",
    "research/regrade-log.md"
  ],
  "fixCompletenessRequired": false
}
```

Planning Packet above. `findingClasses` is `UNKNOWN` because the merged registry carries no finding class for these rows.

## 3. Active Finding Registry

The registry is the merged one. Disposition is from `fix-log.md`, where each entry holds the evidence and the change made.

| ID | Severity | Title | Dimension | File and line | Lineage | Disposition |
|---|---|---|---|---|---|---|
| R2-P1-001 | P1 | Nine origin ids resolve to no finding in the record they name, and eight of the sixteen net-new candidates carry one | traceability | research/research.md:24 | vibe-1 | holds, fixed |
| R1-P2-001 | P2 | Section 1 says a finding graded wrong is not in the document, and 27 wrong origins are credited in the Origin column of surviving rows | correctness | research/research.md:34 | vibe-1 | holds, fixed |
| R1-P2-002 | P2 | Section 9 says the checker resolved every source tag in the 40 records, and 3 tags are in neither column | correctness | research/research.md:663 | vibe-1 | holds, fixed |
| R10-P2-001 | P2 | The bottom line's lift list names 4 of the 20 lift rows section 3 carries and does not say it is a selection | correctness | research/research.md:38 | vibe-1 | holds, fixed |
| R2-P2-001 | P2 | Section 12 says the table states where each of the 13 registry questions stands, and the table holds 12 rows | traceability | research/research.md:707 | vibe-1 | holds, fixed |
| R3-P2-002 | P2 | Section 2 says the plan lacks about twenty guards, and section 3 pitfall tables hold 32 rows | correctness | research/research.md:34 | vibe-1 | holds, fixed |
| R4-P2-001 | P2 | Section 2's guard 3 repeats the incomplete encoded-forms list, so the gap appears in two places | correctness | research/research.md:278 | vibe-1 | holds, fixed |
| R4-P2-002 | P2 | The 008 hex justification cites a value-file line for a keychain read | correctness | research/research.md:278 | vibe-1 | holds, fixed |
| R5-P2-001 | P2 | A fifth row says a claim is inferred, which section 2's inventory does not name | correctness | research/research.md:62 | vibe-1 | holds, fixed |
| R5-P2-002 | P2 | The 010 paste row calls its mechanism an inference when the 003 row in the same document establishes it with two citations | correctness | research/research.md:336 | vibe-1 | partly holds, fixed in part |
| R6-P2-001 | P2 | Section 11 says nine depth-2 nodes and its own table accounts for ten | correctness | research/research.md:690 | vibe-1 | holds, fixed |
| R6-P2-002 | P2 | Section 7 says the plan closed all three S2 vault findings, and the third was accepted as a residual rather than closed | correctness | research/research.md:583 | vibe-1 | holds, fixed |
| R7-P2-001 | P2 | The ranked order flags two of the four weak candidates and ranks the other two in the top four without a flag | correctness | research/research.md:499 | vibe-1 | holds, fixed |
| R7-P2-002 | P2 | The tinychannels row says diff -rq prints only wiki/ lines, and it prints 34 lines of which 13 are wiki/ | correctness | research/research.md:448 | vibe-1 | holds, fixed |
| R8-P2-001 | P2 | The licence summary collapses Apache-2.0's obligations into "its notice", erasing the distinction the plan draws | correctness | research/research.md:26 | vibe-1 | holds, fixed |
| R8-P2-002 | P2 | The licence paragraph says every row names the licence, and 49 of 101 numbered rows do not | correctness | research/research.md:26 | vibe-1 | holds, fixed |
| R9-P2-001 | P2 | Section 14 reports the resource map's 28 "missing" entries as 28 missing files, and 22 of them are citation forms no file could satisfy | correctness | research/research.md:745 | vibe-1 | holds, fixed |
| R9-P2-002 | P2 | The reading guide names two of the six regrade outcomes, leaving 144 findings with no stated home | correctness | research/research.md:22 | vibe-1 | holds, fixed |
| V2-R1-P2-001 | P2 | The 003 lift row says the full checkout adds a build log, but the log sits outside the checkout | correctness | research/research.md:186 | vibe-2 | holds, fixed |
| V2-R1-P2-002 | P2 | The 002 lift row names contracts/prompt-sections.md as the owner of the prompt order, and that file says phase 005 owns it | correctness | research/research.md:196 | vibe-2 | holds, fixed |
| V2-R10-P2-001 | P2 | The Bottom Line calls 303 raw findings and partitions them into 121 kept plus a 332-row remainder, which cannot close | traceability | research/research.md:34 | vibe-2 | holds, fixed |
| V2-R2-P2-001 | P2 | The 008 pitfall 1 guard does not say whether lib/secrets-guard.ts is still lifted, so T013 and AC-012 lose their file | security | research/research.md:305 | vibe-2 | holds, fixed |
| V2-R3-P2-001 | P2 | The regrade log's outcome vocabulary is never defined, and `wrong` covers both a false fact and a true fact with a false implication | traceability | research/regrade-log.md:3 | vibe-2 | holds, fixed |
| V2-R4-P2-001 | P2 | Section 12's table is described as covering the thirteen registry questions but holds twelve rows, and the four resolved questions are named only in section 11 | maintainability | research/research.md:707 | vibe-2 | holds, fixed |
| V2-R5-P2-001 | P2 | The 005 opening says the references add two design checks and one test while the section carries six rows, and the three it omits include a confirmed plan defect | correctness | research/research.md:175 | vibe-2 | holds, fixed |
| V2-R6-P2-001 | P2 | The 006 kind-list row catches the plan kind order but not its kind count, so the plan OpenBot six kinds stands against a reference type that declares seven | security | research/research.md:206 | vibe-2 | partly holds, fixed in part |
| V2-R9-P2-001 | P2 | The 009 opening counts the name-and-description list among what is worth taking, but no lift row takes it and the differences table defers it | correctness | research/research.md:286 | vibe-2 | holds, fixed |

Evidence, impact, scope proof and fix recommendation for each finding are in the lineage iteration records named by the finding id (`lineages/vibe-1/iterations/` for ids without a `V2-` prefix, `lineages/vibe-2/iterations/` for the rest). The registry carries no `scopeProof` or `affectedSurfaceHints` values for these rows.

## 4. Remediation Workstreams

None open. The fix pass ran as one workstream over the two research files.

1. **P1, traceability.** R2-P1-001, the origin ids. Ids that could be matched to their record now point at the right finding. Section 1 of the synthesis now says how ids were assigned and maps the ids that do not follow the record's own numbering. Three of them (`V2-2-16`, `V2-2-17`, `V2-2-19`) were matched by claim text only.
2. **P2 advisories.** The 26 P2 findings, mostly counts that did not close and summary sentences that overstated their tables. All fixed. Where a total cannot close, because the regrade log and the kept rows are both row counts that group or split findings, the synthesis now says so in plain words.

## 5. Spec Seed

- None. The review target is a finished research record, and the fixes were made in it directly.

## 6. Plan Seed

- None. No follow-on plan is needed for the research record itself. Applying the synthesis to the 003 build plan is separate work for a later packet.

## 7. Traceability Status

**Core protocols**

- `spec_code`: pass in the merged registry. Evidence: the synthesis rows on `openhuman-full` and its crates.
- `checklist_evidence`: pass. Evidence: the net-new reference files the registry names.

**Overlay protocols**

- `integration_naming`: pass, advisory. Evidence: the two tinychannels trees.
- `AC_COVERAGE`: exempt. The target type is `files`, not a spec folder.

## Resource Map Coverage Gate

- Entries touched: not applicable. This packet has no `applied/T-*.md` reports, because the review changed research documents and no implementation.
- Entries not touched: not applicable, for the same reason.
- Implementation paths absent from resource-map: none, because no implementation path exists.

## 8. Deferred Items

- The runtime defect behind the untrusted lineages: Vibe review lineages end without a `terminal_gates` row, and vibe-1's closeout row carries the root session id instead of its own lineage id. That belongs to the deep-loop runtime, outside this packet.
- The merged registry carries no frontier, so no frontier node is left to list.

## Dimension Expansion Map

Both lineages ran the four canonical dimensions with no divergent pivot. The merged registry records no saturated directions, completed or failed pivots, overrides, Council artifacts or remaining frontier for either lineage.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

The merged registry's `searchCoverage`, `candidateCoverage` and `searchDebt` are empty. It lists 19 ruled-out candidates, which sit in `deep-review-findings-registry.json`.

## 10. Audit Appendix

**Convergence summary.** Stop policy `max-iterations`, so convergence was telemetry only. Each lineage ran 10 of 10 iterations and reports the stop reason `maxIterationsReached`. vibe-1 reported its last four iterations still finding new issues. vibe-2 recorded a PASS of its own with 9 P2 findings.

**Coverage summary.** 2 lineages, 20 iterations, the 42 scoped files and the four dimensions correctness, security, traceability and maintainability.

**Ruled-out claims.** In the merged registry under `ruledOutCandidates`.

**Sources reviewed.** `fanout-review-scope.txt`, and the evidence each iteration record cites.

**Core Protocols**

- `spec_code` and `checklist_evidence`, as in section 7.

**Overlay Protocols**

- `integration_naming`, as in section 7. `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` do not apply to a research record.
