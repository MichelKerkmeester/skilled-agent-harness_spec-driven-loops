# Iteration 1 — Correctness: default-output allocation

## Dispatcher

- Dimension: correctness
- Budget profile: verify
- Scope: default Lane C report destination allocation and write sequence.

## Files Reviewed

- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/run-storage-convention.vitest.ts`

## Findings - New

### P0 Findings

- None.

### P1 Findings

1. **Default output allocation is not concurrency-safe** — `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:151` — `defaultOutputsDir` selects a candidate by checking `existsSync`, but the directory is not created until the later recursive `mkdirSync` at line 415. Two processes can therefore both select the same free dated name and both overwrite the same report files. The sequential ordinal test does not exercise this interleaving.
   - Finding class: cross-consumer
   - Scope proof: the default path is the only no-`--outputs-dir` route and every report plus companion write uses the selected directory.
   - Affected surface hints: Lane C default path; report writer; reports index.
   - Recommendation: reserve the candidate atomically (or use an atomic exclusive marker) before report writes, then add a concurrent allocation regression.
   - Claim adjudication: {"type":"claim_adjudication","claim":"Concurrent default runs can choose and write the same folder.","evidenceRefs":[".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:151-155",".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:411-415"],"counterevidenceSought":"The focused storage test verifies sequential -2/-3 allocation only.","alternativeExplanation":"The harness could be externally serialized, but the public default writer has no locking precondition or guard.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"A documented process-wide lock that covers allocation through writes."}

### P2 Findings

- None.

## Traceability Checks

- `spec_code`: partial — the stated same-day preservation requirement is satisfied sequentially but not under concurrent callers.
- `checklist_evidence`: partial — CHK-035 provides sequential evidence only.

## Integration Evidence

- The selected path is used for JSON, Markdown, all five companions, and the report-index update.

## Edge Cases

- The 100-attempt ceiling can also return an already occupied `-100` candidate; the atomic-reservation fix should define exhaustion behavior.

## Confirmed-Clean Surfaces

- Explicit `--outputs-dir` paths remain caller-owned and are outside this allocator's implied uniqueness contract.

## Ruled Out

- This is not an index-only issue: report files are written before the index call.

## Next Focus

- Dimension: security
- Focus area: path and input boundaries around report archival and snapshot discovery.
- Reason: the correctness finding is recorded; inspect whether untrusted labels or paths widen it into a security issue.

Review verdict: CONDITIONAL
