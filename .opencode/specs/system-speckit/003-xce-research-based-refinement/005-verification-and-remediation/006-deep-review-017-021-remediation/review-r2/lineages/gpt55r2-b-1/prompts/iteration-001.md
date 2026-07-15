# Rendered Iteration Prompt

STATE SUMMARY (auto-generated, review mode):
Iteration: 1 of 1 | Mode: review
Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002` (spec-folder)
Dimensions: 0/4 complete | Next: correctness/data-integrity
Findings: P0:0 P1:0 P2:0 active
Traceability: core=pending overlay=pending
Provisional verdict: PENDING | hasAdvisories=false

Review Target: memory store/index/lifecycle code under `.opencode/skills/system-spec-kit/mcp_server/` outside search/retrieval.
Focus Files: `handlers/memory-index.ts`, `handlers/memory-index-scan-jobs.ts`, `handlers/save/atomic-index-memory.ts`, `handlers/memory-save.ts`, `lib/ops/job-store.ts`, `lib/storage/transaction-manager.ts`, `lib/storage/incremental-index.ts`, `lib/storage/idempotency-receipts.ts`.
Constraints: LEAF agent, no sub-agents, target files read-only, write outputs only to the provided lineage artifact directory.
