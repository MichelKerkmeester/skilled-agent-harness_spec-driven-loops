---
title: "Iteration 2: D2 Security — Trust boundaries of the coverage parsers"
trigger_phrases: []
---
# Iteration 2: D2 Security — Trust boundaries of the coverage parsers

## Focus
Dimension: security. Scope: `check-ac-coverage.sh` parsers, env flags, path joins, escaped-pipe handling, and lifecycle status matching. The rule is specified as read-only (NFR-S01).

## Scorecard
- Dimensions covered: security
- Files reviewed: 3
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.33

## Findings

### P0, Blocker
- None. The module writes no files, interpolates no shell from table cells, and does not eval awk from untrusted strings.

### P1, Required
- None. No credential, injection, or auth-bypass issue in this read-only advisory.

### P2, Suggestion
- **F005**: Lifecycle Status match treats "incomplete" as "complete", `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:66`, [Evidence: `[[ "$status" == *"complete"* ]]` is a glob on the whole Status table row after lowercasing. The substring `complete` occurs inside `incomplete`, so a packet whose Status is Incomplete would activate the gate. Intended tokens include in-progress/implemented/complete/shipped. Edge-case prose wants mid-implementation measured, so this is over-accept rather than under-measure.]
- **F006**: Canonical row count still binds AC-ID as awk `$2`, not by header name, `.opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:139`, [Evidence: `_ac_count_canonical_rows` uses `id = norm($2)` while `_ac_analyze_canonical` binds `ac-id` by header (`:200-208`). REQ-005 and the extra-column test (`scripts/tests/check-ac-coverage.sh:88-92`) cover Verification shift, not an inserted column before AC-ID. If rows > total, `:330-332` bumps total to rows, so the ratio still cannot under-count; it is a residual split of the class of bug this packet exists to close.]

## Claim adjudication

No new P0/P1 this iteration. F005/F006 stay P2.

```json
{
  "findingId": "F005",
  "claim": "The Status glob *complete* matches the word incomplete, activating the lifecycle gate on an Incomplete packet.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:64",
    ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:66"
  ],
  "counterevidenceSought": "Checked whether Status is extracted as a single cell. It is not: awk prints the whole markdown row containing **Status**, then the glob runs on that line. Confirmed no test case uses Status Incomplete.",
  "alternativeExplanation": "Operators never write Incomplete, only Complete/in-progress. Possible, but the glob is still accidental rather than tokenized.",
  "finalSeverity": "P2",
  "confidence": 0.84,
  "downgradeTrigger": "If Status is parsed as the value cell and matched with anchored tokens, drop the finding.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery" }
  ]
}
```

## Traceability Checks (this iteration)
- `spec_code`: NFR-S01 holds (`check-ac-coverage.sh` has no write path). NFR-S02 escaped-pipe protection is implemented in `_ac_analyze_canonical` (`:196-198`) and not in `_ac_count_canonical_rows` / `_ac_analyze_traceability` (those still split on raw `|`). Advisory-only; no P1.
- Overlays: not the focus this pass.

## Security notes that did not become findings
- `SPECKIT_AC_COVERAGE_FLOOR` is coerced with awk `raw + 0` and clamped (`:19-27`). Not eval.
- Folder paths are concatenated as `$folder/acceptance-criteria.md` and passed as awk file operands, not interpolated into the awk program.
- Default-on flag `SPECKIT_AC_COVERAGE:-true` (`:11`) matches registry copy (`validator-registry.json:102`).

## Adversarial self-check
- Hunter: re-read `:50-83`, `:125-232`, `:281-358`.
- Skeptic: F006 does not change reported coverage when the bump at `:330` fires. Kept P2.
- Referee: no P0/P1 this iteration.

## Next Dimension
D3 Traceability — spec_code on REQ/AC rows, checklist_evidence on T/CHK marks, feature_catalog and playbook overlays.

Review verdict: PASS
