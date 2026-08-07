# Deep-review leaf — iteration 9 of 40 (correctness)

You are a deep-review LEAF executing exactly ONE iteration of a review loop. The loop
orchestrator (not you) owns all state files. You are READ-ONLY: do not create, modify,
or delete ANY file. Your entire output is your final message.

GATE-3 PRE-RESOLVED (A) — write authority is owned by the orchestrator; never ask the
A-E documentation question. Do not run any state-mutating command.

## Target
The `system-deep-loop` skill (repo root is CWD). Scope list:
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt`.

## This iteration's dimension: CORRECTNESS
## Focus
Alignment engine: deep-alignment/scripts scoping.cjs, adapters (all variants), partition-corpus.cjs, check-convergence.cjs, reducer wiring

Go DEEP on the focus surface: read the actual implementation files end to end, trace
the load-bearing paths, and hunt for genuine defects. Prefer depth on the focus over
breadth. You may follow references out of the focus when a suspected defect crosses
module boundaries.

## Already-known open findings (do NOT re-report these; DO deepen/refute if evidence warrants)
- F-008-03 [P1/correctness] Direct rollback trusts an unbound backup file @ .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs
- F-008-02 [P1/correctness] Benchmark sweep scores raw event JSON when assistant text is absent @ .opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs
- F-008-01 [P1/correctness] Non-finite score values bypass promotion gates @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
- F-007-03 [P1/correctness] Model score references are not ownership-bound to the target trial @ .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-reducers/model-benchmark-reducer.ts
- F-007-02 [P1/correctness] Artifact origin validation omits scoped identity binding @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts
- F-007-01 [P1/correctness] Mode certificate receipts fabricate ledger head sequences @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts
- F-006-04 [P1/correctness] Council certificates do not bind artifact scope to event scope @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-certificates/deep-ai-council-certificates.ts
- F-006-03 [P1/correctness] Council source references ignore round identity @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers/deep-ai-council-reducer.ts
- F-006-02 [P1/correctness] Alignment parity derives both paths from one typed projection @ .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-shadow-parity/harness-adapter.ts
- F-006-01 [P1/correctness] Council parity discards the real reducer projection @ .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-shadow-parity/harness-adapter.ts
- F-005-02 [P1/correctness] Rollback-window success count trusts unauthenticated execution claims @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-rollback-gate/mode-gate.ts
- F-005-01 [P1/correctness] Initial research replay silently accepts stream-sequence gaps @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts
- F-004-04 [P1/correctness] Resume treats a caller assertion as ledger-authoritative result evidence @ .opencode/skills/system-deep-loop/runtime/lib/dispatch-receipts/resume-projection.ts
- F-004-03 [P1/correctness] Concurrent exact attestation writes do not converge idempotently @ .opencode/skills/system-deep-loop/runtime/lib/replay-fingerprint/replay-fingerprint-attestation.ts
- F-004-02 [P1/correctness] Conflicting operator decisions can both commit and drive side effects @ .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts
- F-004-01 [P1/correctness] Concurrent recovery callers can both execute the same unresolved effect @ .opencode/skills/system-deep-loop/runtime/lib/receipts-and-effect-recovery/effect-gateway.ts
- F-003-03 [P1/correctness] Malformed delta rows bypass strict corruption handling @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
- F-003-02 [P1/correctness] Leaf artifact publication can leave an orphaned delta without a canonical state record @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/leaf-artifact-writer.ts
- F-003-01 [P1/correctness] Lock release can unlink a successor owner's lock after a reclaim race @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts
- F-002-02 [P1/correctness] Cyclic or throwing request data bypasses durable default denial @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts
- F-002-01 [P1/correctness] Torn-tail recovery can quarantine bytes without durable recovery evidence @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/immutable-frame-store.ts
- F-003-04 [P2/correctness] Auto research convergence never persists graph snapshots @ .opencode/commands/deep/assets/deep-research-auto.yaml
- F-002-03 [P2/correctness] Transition policy registry digest depends on process locale @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts
- F-001-03 [P2/traceability] Research README describes an obsolete workflow roster @ .opencode/skills/system-deep-loop/deep-research/README.md
- F-001-02 [P2/traceability] Deep-alignment adapter inventory omits a registered adapter variant @ .opencode/skills/system-deep-loop/deep-alignment/README.md
- F-001-01 [P2/maintainability] Runtime scripts README links to a removed parent SKILL.md @ .opencode/skills/system-deep-loop/runtime/scripts/README.md

## Output contract (STRICT)
Output ONLY a fenced JSON block, nothing after it:

```json
{
  "iteration": 9,
  "dimension": "correctness",
  "summary": "<3-6 sentences: what you examined and the risk picture>",
  "findings": [ { "severity": "P0|P1|P2", "dimension": "correctness", "title": "<short>", "file": "<repo-relative path>", "line": 0, "evidence": "<what you actually read there — quote or describe the exact code>", "recommendation": "<fix direction>" } ],
  "refutations": [ { "id": "<known finding id>", "verdict": "confirmed|refuted|deepened", "reason": "<evidence>" } ],
  "coverage": { "filesExamined": 0, "keyPaths": ["<the main files you read>"] }
}
```

Severity bar: P0 = would certify/authorize something false, lose data, or permit
unauthorized mutation at authority cutover; P1 = real defect with a concrete trigger;
P2 = quality/maintainability. Every finding MUST cite a file you actually read (line
where possible). No speculative findings — an empty findings array with honest deep
coverage beats padded findings.
