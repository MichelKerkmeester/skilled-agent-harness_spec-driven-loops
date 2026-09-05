# Iteration 009: Generated Metadata And Completion Attestation

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: adjudicate.

## Files Reviewed
- `description.json:1-30`
- `graph-metadata.json:1-64,211-229`
- `acceptance-criteria.md:11-28,36-91`
- `implementation-summary.md:11-29,208-245,324-376`
- `spec.md:18-32,118-143`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/continuity-freshness.ts:252-279,327-385`
- `.opencode/skills/system-spec-kit/runtime/cli/core/memory-metadata.ts:398-438`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/continuity-freshness.vitest.ts:223-259`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/generated-metadata-drift.ts:75-103`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/generated-metadata-drift.vitest.ts:167-246`

## Findings - New
### P1 Findings
1. **Completion claims carry the zero fingerprint that the freshness rule explicitly skips** -- `acceptance-criteria.md:23-28` -- the packet declares `completion_pct: 100`, `next_safe_action: None; packet closeable` and a zero `session_dedup.fingerprint`. The continuity freshness implementation treats that zero value as a passing `zero_fingerprint` skip at `continuity-freshness.ts:352-357`, so the completion claim has no content attestation. The generated metadata source hashes are current, and the causal summary explicitly preserves historical wording, so no separate metadata-drift finding is admitted.
- Finding class: matrix/evidence
- Scope proof: Direct comparison of acceptance/summary continuity metadata, freshness implementation and the zero-fingerprint regression test.
- Affected surface hints: ["completion attestation", "session_dedup fingerprint", "freshness gate"]
- Claim adjudication: {"type":"claim-adjudication","claim":"The packet's completion claim is content-attested","evidenceRefs":["acceptance-criteria.md:23-28","runtime/cli/validation/continuity-freshness.ts:352-357","runtime/cli/tests/continuity-freshness.vitest.ts:249-259"],"counterevidenceSought":"Checked the stamping implementation and current graph source hashes; no non-zero packet fingerprint was present.","alternativeExplanation":"The zero fingerprint may be an intentional grandfathered skip, but the packet states closeable rather than grandfathered.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"A canonical save or explicit waiver records a non-zero matching fingerprint and explains the grandfathered state."}

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | fail | hard | `acceptance-criteria.md:23-28`; `continuity-freshness.ts:352-357` | Completion claim is not bound to current content. |
| checklist_evidence | fail | hard | `acceptance-criteria.md:85-90`; `implementation-summary.md:208-231` | Closeable claim relies on a skipped attestation and un-replayed recorded gates. |
| feature_catalog_code | pass | advisory | `graph-metadata.json:43-63,223-229` | Key files and source hashes reflect current paths and source docs. |
| playbook_capability | partial | advisory | `generated-metadata-drift.ts:75-103` | Drift bridge is read-only and tested, but packet-level freshness is not replayed. |

## Integration Evidence
- `memory-metadata.ts:401-438` can stamp a non-zero fingerprint after a save when a completion claim exists.
- `continuity-freshness.ts:359-385` would fail or warn on a stale non-zero fingerprint, but it intentionally skips the zero placeholder.
- `graph-metadata.json:223-229` source hashes match the current canonical packet documents as independently hashed during this review.

## Edge Cases
- The causal summary at `graph-metadata.json:211` says “When this phase opened” and then identifies the current `runtime/cli` and `@spec-kit/cli` names. It is historical context, not an admitted stale-identity contradiction.
- `description.json:lastUpdated` is older than the current packet file mtimes, but no content mismatch is inferred from timestamps alone.

## Confirmed-Clean Surfaces
- Generated-metadata drift tests include no-write, hash-change and grandfather/enforced behavior at `generated-metadata-drift.vitest.ts:191-272`.
- The graph metadata source-document hashes match current packet file hashes for the four listed source docs.

## Ruled Out
- Stale graph source hashes: ruled out by direct hash comparison.
- Current graph causal summary falsely claiming the package is still `scripts`: ruled out because the sentence explicitly distinguishes historical `scripts` from current `runtime/cli` and `@spec-kit/cli`.

## Next Focus
- dimension: maintainability
- focus area: final adversarial replay of all findings and artifact integrity
- reason: one attestation finding is new; final pass must ensure no P0 and no duplicate unsupported findings
- rotation status: final stabilization pass
- blocked/productive carry-forward: generated metadata integrity is mostly supported; zero fingerprint remains active
- required evidence: all cited findings, state artifacts and current packet claims
- recovery note: max-iterations policy requires one more pass even though convergence is telemetry-only

Review verdict: CONDITIONAL
