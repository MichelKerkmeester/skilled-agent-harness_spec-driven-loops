# Iteration 2: D2 Security — Trust boundaries of shipped validation and budget code

## Focus
Dimension: security. Scope: `check-scope-adherence.sh` change-set handling, AC_COVERAGE escape hatch, `memory-search.ts` token-budget truncation, and `inline-gate-renderer.ts` CLI write path.

## Scorecard
- Dimensions covered: security
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.29

## Findings

### P0, Blocker
- None.

### P1, Required
- **F006**: SCOPE_ADHERENCE treats any basename-matching canonical doc as in-scope, `.opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:136`, [Evidence: the skip uses `" ${changed_file##*/} "` against a space-padded list of names (`spec.md`, `plan.md`, …). A change-set entry such as `specs/unrelated-packet/spec.md` or `tmp/spec.md` is skipped and never compared to Files to Change. REQ-005's purpose (catch out-of-scope writes, including the 033 wander) is bypassed by filename collision. Rule is warn/opt-in, but the bypass is in the control itself.]

### P2, Suggestion
- **F007**: Declared-prefix matching uses substring containment, `.opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:141`, [Evidence: `[[ "$changed_file" == *"/$declared_prefix"* ]]` accepts any path that contains `/$declared_prefix` as a substring, so a declared `scripts/rules/check-ac-coverage.sh` also matches `vendor/scripts/rules/check-ac-coverage.sh`. Over-accepts rather than over-rejects.]
- **F008**: Change-set splitting destroys paths that contain whitespace, `.opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:67`, [Evidence: `printf '%s\n' "$changed_text" | tr '[:space:]' '\n'` tokenizes on every whitespace. A legitimate path with a space becomes two tokens and can false-positive as out-of-scope or drop the real path.]

## Claim adjudication

```json
{
  "findingId": "F006",
  "claim": "The canonical-doc exception in check-scope-adherence.sh matches on basename only, so any file named spec.md (or other canonical names) is treated as in-scope regardless of directory.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:129",
    ".opencode/skills/system-spec-kit/scripts/rules/check-scope-adherence.sh:136"
  ],
  "counterevidenceSought": "Checked whether the comparison uses a packet-relative prefix (folder/spec.md) or a path-normalized relative path. It uses changed_file##*/ only. Confirmed the rule is warn-severity and no-ops without MK_SCOPE_*.",
  "alternativeExplanation": "The exception is intentionally global because any spec.md is documentation. Rejected: the header comment says a packet's own canonical documents, not every file with those names in the repo.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the skip is restricted to paths under $folder, or the rule is documented as basename-global, downgrade to P2.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | check-scope-adherence.sh:136, memory-search.ts:2384 | REQ-006 budget runs before feedback (ADR-006). REQ-005 control has a basename bypass. |
| checklist_evidence | n/a this pass | hard | | Deferred to D3 |

## Assessment
- New findings ratio: 0.29
- Dimensions addressed: security
- Novelty justification: F006–F008 are new control-logic issues in the scope rule. Memory-search budget ordering and absence of exec/secret APIs were verified and produced no new finding (ADR-005/006 stand).

## Ruled Out
- memory_search command injection / secret leakage: [no exec/spawn/eval/credential APIs in memory-search.ts], [rg over handler]
- git diff injection via MK_SCOPE_BASE: [`git diff --name-only "$scope_base" --` uses `--` to stop option parsing], [check-scope-adherence.sh:55]
- Renderer --out-dir as a sandbox escape: [operator-chosen output directory; writes use basename only], [inline-gate-renderer.ts:279-290]
- Shared enforceTokenBudget reuse as a security defect: [ADR-005 accepted after verifying different truncation strategies], [decision-record.md:86]

## Dead Ends
- Treating F005 (pi-flash duplicated budget helper) as still open: ADR-005 records it as an intentional split.

## Recommended Next Focus
D3 Traceability — spec_code + checklist_evidence in full: REQ-004 INFO vs WARNING wording, AC_COVERAGE 0/8 on this packet, tasks.md vs checklist, overlay feature_catalog/playbook.

Review verdict: CONDITIONAL
