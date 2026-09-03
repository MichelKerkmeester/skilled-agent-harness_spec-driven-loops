---
title: "Iteration 003: D2 Security — Validator/Generator Trust Boundaries & Status-Signal Integrity"
trigger_phrases: []
---
# Iteration 003: D2 Security — Validator/Generator Trust Boundaries & Status-Signal Integrity

## Focus
Security dimension over the packet's code-adjacent surfaces: check-anchors.sh (validation-gate integrity), create.sh (document-generation pipeline input handling), graph-metadata-parser.ts deriveStatus (status-signal integrity), example corpus (secrets/trust patterns).

## Scorecard
- Dimensions covered: security (+ correctness for F014's nature)
- Files reviewed: 5 (scripts/rules/check-anchors.sh, scripts/lib/shell-common.sh, scripts/spec/create.sh [re-check], mcp-server/lib/graph/graph-metadata-parser.ts, templates/examples/level-2/spec.md)
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.24

## Findings

### P1, Required
- **F014**: deriveStatus precedence silently suppresses tasks.md state whenever checklist.md exists, `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1186-1198`, [Description: the ranked status lookup is `implementation-summary.md > checklist.md > tasks.md > plan.md > spec.md` (lines 1186-1198); when checklist.md is present its status wins and tasks.md's is never consulted. The doc comment at lines 1228-1232 confirms tasks.md open items only gate when checklist.md is absent. Any L2+ packet carrying both docs silently ignores authored task state in derived status — the exact problem 002-tasks-checklist-merge describes (spec.md:89), verified against shipped code.] (dimension: correctness, surfaced during security/data-integrity sweep)

### P2, Suggestion
- **F013**: check-anchors.sh depends on an externally-sourced is_phase_parent, `.opencode/skills/system-spec-kit/scripts/rules/check-anchors.sh:34`, [Description: line 34 calls `is_phase_parent "$folder"` but the function is defined only in `scripts/lib/shell-common.sh:48`, not in check-anchors.sh. Standalone runs of the rule (as the 002 spec's BLOCKER describes, spec.md:174) silently miss the phase-parent early branch under `set -euo pipefail` (undefined command in an if-condition is just false), so phase parents get full Level-N anchor expectations → false-positive ANCHORS_VALID failures. This is the environmental-sensitivity behind the check-anchors-vs-compare divergence.] (dimension: security — validation-gate integrity)
- **F015**: create.sh template substitution is fragile to special characters in feature names, `.opencode/skills/system-spec-kit/scripts/spec/create.sh:529-545`, [Description: feature names/descriptions are interpolated directly into perl `s///` replacement strings (`s/\[NAME\]/$ENV{FEATURE_NAME}/g`, line 530); a name containing `/`, `\`, or `"` corrupts the substitution — silent document corruption or hard scaffold failure, with no escaping or validation of the operator-supplied name.] (dimension: security — input handling in generation pipeline)

## Adversarial / Negative Findings (recorded, no finding)
- No secrets, credentials, or API keys anywhere in the reviewed corpus (examples, templates, specs).
- No command-injection surface in check-anchors.sh: all grep/sed/awk patterns are static; file content only reaches awk via `-v id=` from a regex-constrained character class.
- No network/auth surfaces: the packet touches local doc tooling only.
- SPECKIT_LEVEL markers are consistent with metadata Level fields in the 036 packet (001=1, parent=2), so no marker-spoofing drift observed here.

## Claim Adjudication Packets (new P0/P1)

```json
{
  "findingId": "F014",
  "claim": "Derived status ranks implementation-summary > checklist > tasks, so whenever checklist.md exists the tasks.md status/checkbox state is never consulted.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1186-1198",
    ".opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts:1227-1232",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/spec.md:89"
  ],
  "counterevidenceSought": "Read the deriveStatus block and its surrounding comments; checked whether per-doc statuses are computed from identical underlying signals (which would make precedence inert). The ranking takes each doc's independent status field, and the no-checklist fallback explicitly gates on tasks.md open items — precedence is load-bearing.",
  "alternativeExplanation": "The precedence may be intentional (implementation-summary and checklist are stronger signals than tasks). Rejected as harmless: the 002 spec itself declares it a defect with a P0 requirement (REQ-002 no-regression proof) and a silent divergence hazard.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If tasks.md status is derived from the same completion_pct signal as checklist.md (making the two statuses identical by construction), downgrade to P2 duplication debt.",
  "transitions": [{ "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery during status-signal integrity sweep" }]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 002 spec.md:89 claim verified at graph-metadata-parser.ts:1186-1198; check-anchors divergence claim partially verified (is_phase_parent external dependency) | Deeper claim sweep in iterations 4-5 |

## Assessment
- New findings ratio: 0.24
- Dimensions addressed: security (primary), correctness (F014)
- Novelty justification: all three findings are new code-level observations; F013/F014 directly substantiate claims made in the 002 spec

## Ruled Out
- Secrets exposure: none in corpus (grep-level sweep of examples/templates).
- Command injection in check-anchors.sh: patterns static, id constrained by regex class.

## Dead Ends
- SPECKIT_LEVEL spoofing: no drift between marker and metadata in the 036 packet.

## Recommended Next Focus
- Dimension: traceability — spec_code protocol
- Focus area: Sweep normative claims in 002-006 specs against shipped surfaces (manifest .tmpl existence, spec-kit-docs.json entries, check-ac-coverage.sh bindings, mcp-server validator files, scaffold-golden-snapshots.vitest.ts), and the 002 BLOCKER's check-anchors second code path (lines ~100-172 pairing/order block) claim.

## Review verdict: CONDITIONAL
