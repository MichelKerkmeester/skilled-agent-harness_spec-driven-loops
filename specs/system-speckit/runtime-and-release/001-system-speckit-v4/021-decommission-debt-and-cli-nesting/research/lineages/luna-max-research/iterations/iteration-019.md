# Iteration 19: Residue-sweep coverage

## Focus

Audit the active memory-residue sweep as a detector, not as proof that the
repository is clean. Compare what it searches and how it classifies matches
with the retired surfaces named by the decommission programme.

## Findings

1. **LUNA-058 — The residue sweep cannot detect several retired surfaces named by the decommission review. P1. CONFIRMED detector-coverage gap; clean-gate interpretation is INFERRED.** The sweep documents its question as live consumers of the retired memory MCP surface and its complete literal/tool vocabulary contains only the memory MCP tool names plus `.system-spec-memory-launcher`, `mcp__system_spec_memory__`, `spec-memory.cjs`, and `system-spec-memory`. It has no search terms for database paths or filenames, `zvec`, `system-plugins`, or the old `mcp-server` identity. Its exit code is based only on live records produced from that term set. A clean result therefore means “none of this narrower vocabulary was live,” not “the decommissioned surface is absent.” Smallest fix: publish a versioned retired-surface manifest covering each named surface and make the sweep consume it, or add separate detectors with independent exit/report fields for database paths, zvec, system-plugins, and package identity. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:5-6,30-30,60-118] [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:203-212,423-458] [INFERENCE: a live omitted term can survive while this sweep exits clean; complementary manual scans in this lineage found the detector's scope was narrower than the review topic]

2. **LUNA-059 — Any matching JSONL path is forced into the historical bucket, even outside a historical directory. P2. CONFIRMED classification rule and test contract; live-state masking impact is INFERRED.** `classifyLifecycle` returns `historical` immediately whenever a matched relative path ends in `.jsonl`, before it checks whether the path is under a declared historical segment. The focused test explicitly requires `.opencode/state/session.jsonl` to be historical “wherever it sits.” Because only `counts.live` drives the sweep's nonzero exit, a retired tool name in a live JSONL state, registration, or execution record would not count as a live hit. Smallest fix: classify by declared path roots first and treat the extension as historical only for known evidence/state locations, with a fixture proving that a live JSONL control file is not silently downgraded. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:120-144,220-227,437-458,524-549] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/sweep-memory-residue.vitest.ts:94-106] [INFERENCE: the current rule can hide a live JSONL control record from the exit gate; no such control file was synthesized]

## Ruled Out

- The sweep's use of hidden files, global-ignore bypass, JSONL parsing, streaming, and explicit allowlist validation is deliberate and tested; these hardening choices do not compensate for the omitted term vocabulary. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:8-24,203-212,301-326] [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/sweep-memory-residue.vitest.ts:148-165,212-250]
- Historical directory classification itself was not promoted as a defect; the issue is the unconditional `.jsonl` shortcut and the detector's named-surface coverage. [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:130-144,220-227]

## Dead Ends

- No claim was made that every file mentioning `memory` is live residue. The detector's own allowlist and the previous iterations' owner-boundary checks remain necessary to separate successor code, tests, and historical evidence.

## Edge Cases

- Expanding the vocabulary without lifecycle/ownership classification would turn historical decommission records into noise. The manifest should carry term, owner, and historical exclusions together.
- JSONL may be a legitimate historical event log, but the path rule should express that through an allowlisted root or explicit evidence directory rather than by extension alone.

## Questions Remaining

- Q1 gains a confirmed automated-detector coverage gap for database/zvec/system-plugins/old-identity residue.
- Q6 gains a confirmed detector contract that is narrower than the successor/decommission coverage question.
- Q7 gains a supplementary false-negative path through lifecycle classification.
- Q2-Q5 remain open for registrations, dependencies, tests, and documentation drift.

## Sources Consulted

- [SOURCE: .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs:5-6,30-30,60-118,120-144,203-227,423-458,524-549]
- [SOURCE: .opencode/skills/system-spec-kit/scripts/tests/sweep-memory-residue.vitest.ts:94-106,148-165,212-250]

## Assessment

- New information ratio: 0.90
- Questions addressed: Q1, Q6, Q7
- Questions answered: Q1 = expanded (detector scope); Q6 = expanded (coverage contract); Q7 = expanded (JSONL classification false negative)
- Confidence: high for the term-set and classification behavior; medium for operational impact because the sweep was not executed against the repository

## Reflection

- What worked and why: reading the detector's term constants, exit condition, and tests together showed exactly what a clean sweep can and cannot prove.
- What did not work and why: running the detector on the full repository was intentionally skipped to avoid producing out-of-lineage report artifacts and broad excluded-file reads.
- What I would do differently: use the final iteration for a bounded cross-angle synthesis check and to record any remaining ruled-out surfaces before phase_synthesis.

## Recommended Next Focus

Final iteration: cross-check the highest-severity findings and ensure no distinct live successor/decommission angle remains unreviewed before synthesis.
