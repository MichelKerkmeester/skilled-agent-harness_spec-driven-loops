# Iteration 001 - Correctness (inventory + core logic slices)

Resolved route: mode=review target_agent=deep-review

- **Iteration**: 1 of 3 (mimo lineage, `stopPolicy: max-iterations`)
- **Focus**: correctness, over the highest-risk slices of the manifest
- **Session**: fanout-mimo-1790437845885-htqb7q | generation 1 | lineageMode new

## Dimension

Correctness (logic, invariants, error handling) plus the inventory pass over the manifest slices with the densest changed logic: the Pi `edit_lines` hash-verified edits section, the advisor directive-lifecycle dedup, the fallback status heads, and the deep-loop `step_convergence_report` close in both workflow families.

## Files Reviewed

- `.pi/extensions/pi-cache-optimizer/index.ts:7895-8551` (hash-verified edits section only; rest is context)
- `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:60-160` (directive dedup)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:386-499` (brief render + fallback heads)
- `.skilled/commands/deep/assets/deep-review-auto.yaml:2255-2470` (`step_convergence_report` only)
- `.skilled/commands/deep/assets/deep-research-auto.yaml:2027-2260` (`step_convergence_report` only)

## Findings by Severity

### P0

None.

### P1

**R1-P1-001 — `edit_lines` interior-hash verification is conditional, contradicting its stated invariant.**
`validateEdits` states "Every line in the range is verified, not just the endpoints: a replacement whose interior drifted would otherwise be written over silently", but the interior loop only checks a line when the caller supplied `line_hashes[i - fromIdx]`, and `line_hashes` is optional in `editLinesSchema` (required is `['from','from_hash','to','to_hash','new_text']`). When `line_hashes` is omitted — the schema-legal minimal call — an interior line that changes between the model's read and its `edit_lines` call, with unchanged endpoints and unchanged line count, is overwritten silently. That is the exact failure class the capability exists to prevent; `line_count` detects insertion/removal and the endpoint hashes detect boundary drift, but interior-only drift is the one path left unguarded.

Claim adjudication (R1-P1-001):
```json
{
  "findingId": "R1-P1-001",
  "claim": "edit_lines can silently overwrite interior line drift when the optional line_hashes array is omitted, despite the code comment claiming every line in the range is verified.",
  "evidenceRefs": [".pi/extensions/pi-cache-optimizer/index.ts:8201-8216", ".pi/extensions/pi-cache-optimizer/index.ts:7965-7975", ".pi/extensions/pi-cache-optimizer/index.ts:8288-8296"],
  "counterevidenceSought": "Checked whether execute() rejects calls without line_hashes, whether validateEdits verifies interiors unconditionally through another path, and whether the schema marks line_hashes required. execute() passes edits through unchanged (index.ts:8478-8481), the interior loop is the only interior check and is gated on `claimed !== undefined` (index.ts:8205), and the schema's required list omits line_hashes (index.ts:7965-7975).",
  "alternativeExplanation": "The design may intentionally treat line_hashes as an opt-in strengthening, with endpoints plus line_count as the baseline guarantee, and the comment as aspirational. That reading makes the defect a documentation overstatement rather than a missing check; it does not remove the silent-overwrite path.",
  "finalSeverity": "P1",
  "confidence": 0.72,
  "downgradeTrigger": "If the operator accepts endpoints+line_count as the published contract and treats the comment as internal shorthand, downgrade to P2 (comment overstates the guarantee)."
}
```

### P2

**R1-P2-002 — directive-dedup normalization never participates in dedup identity.**
`splitPiDirectiveBrief` normalizes headless fallback briefs to the separator-prefixed form "so an identical directive block dedups to the same key whether or not a head was present", but `decidePiDirectiveDelivery` compares and stores the raw `context` string (`map.get(key) === context`, `map.set(key, context)`); the normalized `parts` are used only as an eligibility gate. A headed brief and a headless brief with identical directives therefore never share a dedup key. The behavior is fail-open (changed content re-delivers, which is the safer direction), so this is a contract/comment mismatch plus a latent trap for a future maintainer who trusts the comment and changes the comparison. [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:84-92,138-143]

**R1-P2-003 — review-side `step_convergence_report` never folds lineage state logs, unlike its research sibling.**
The research variant folds lineage logs into its invariant inputs and computes `totalIterations` from them (`deep-research-auto.yaml:2185-2188`); the review variant reads only the root `deep-review-state.jsonl` (`deep-review-auto.yaml:2407`) and takes `totalIterations` from the `{iteration_count}` placeholder (`deep-review-auto.yaml:2435,2458`), which `step_hydrate_summary_metrics` counts from that same root log. In a fan-out close the root packet has no state log at all (confirmed: `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/010-checklist-full-retirement/review/` holds `lineages/`, `observability-events.jsonl`, `orchestration-summary.json` and no `deep-review-state.jsonl`), so the review close's finding-reflects-in-registry invariants are vacuous and its `synthesis_complete` record reports `totalIterations: 0` while the lineages hold the real iterations. Telemetry/evidence accounting only; per-lineage records and the merged registry still carry real counts, so no verdict logic is affected. [SOURCE: .skilled/commands/deep/assets/deep-review-auto.yaml:2407-2414,2435,2458] [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:2185-2188]

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| spec_code | core | partial | Iteration 1 checked `edit_lines` behavior against the section's own documented contract and the ../005 hash-verified-edits intent; full spec-code pass is iteration 3 |
| checklist_evidence | core | n/a | Level 1 packet, no checklist.md |
| skill_agent | overlay | partial | prompt-advisor dedup contract vs its comment (R1-P2-002) |
| agent_cross_runtime | overlay | deferred | iteration 3 |
| feature_catalog_code | overlay | n/a | no feature catalog entry for these slices |
| playbook_capability | overlay | n/a | no playbook claims these capabilities |

## State-Write Note (iteration 1)

State records for this lineage are written only through `append-mode-event.cjs` (ledger + projection). Two init-time repairs were needed inside this lineage dir and are recorded here for the operator: (1) the gateway schema requires token-safe `filesReviewed` entries (leading-dot repo paths fail `SYSTEM_TOKEN_PATTERN`; recorded as `repo/...`) and `targetRefs` as identifier strings; (2) the projection's `no-attribution-loss-on-replace` guard refuses to replace a hand-seeded rich config row, so the hand-seeded row was cleared and `deep_review.run_initialized` was appended through the gateway — the state log is now fully fold-generated from the ledger (config row + minimal iteration rows; rich per-iteration fields live in `deltas/`). The iteration-1 event is durable in `deep-review-ledger` seq 1 (receipt `recordHash 1aad47e4…`).

## Verdict

CONDITIONAL — one P1 (R1-P1-001), two P2 advisories. No P0.

`newFindingsRatio` this iteration: 0.35 (weighted new findings (5+1+1)/20; weights P0=10, P1=5, P2=1).

## Next Dimension

Security — hook shims and the advisor daemon request path (`user-prompt-submit` shims, `prompt-advisor.ts` full file, `skill-advisor-cli-fallback.ts`, `advisor-recommend.ts`, `skill-advisor-cli.ts`, plugin mirror).

Review verdict: CONDITIONAL
