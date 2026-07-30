# Deep-review leaf — iteration 18 of 40 (security)

You are a deep-review LEAF executing exactly ONE iteration of a review loop. The loop
orchestrator (not you) owns all state files. You are READ-ONLY: do not create, modify,
or delete ANY file. Your entire output is your final message.

GATE-3 PRE-RESOLVED (A) — write authority is owned by the orchestrator; never ask the
A-E documentation question. Do not run any state-mutating command.

## Target
The `system-deep-loop` skill (repo root is CWD). Scope list:
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/goal-file-manifest.txt`.

## This iteration's dimension: SECURITY
## Focus
Races: locks, leases, fencing, TOCTOU on state files and atomic writers

Go DEEP on the focus surface: read the actual implementation files end to end, trace
the load-bearing paths, and hunt for genuine defects. Prefer depth on the focus over
breadth. You may follow references out of the focus when a suspected defect crosses
module boundaries.

## Already-known open findings (do NOT re-report these; DO deepen/refute if evidence warrants)
- F-017-05 [P0/security] Candidate controls evaluator identity and derived rubric @ .opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs
- F-017-04 [P0/security] Rollback hash guard is bypassable through the candidate-hash alternative @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/rollback-candidate.cjs
- F-017-03 [P0/security] Ship trusts a caller-forged acceptance receipt @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
- F-017-02 [P0/security] Promotion has no candidate or artifact-output containment @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
- F-017-01 [P0/security] Promotion accepts evaluator receipts for a different artifact @ .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/promote-candidate.cjs
- F-016-03 [P0/security] cli-opencode silently ignores read-only and workspace-write sandbox modes @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- F-016-02 [P0/security] Native fanout dispatch always bypasses permissions and has no write containment @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- F-016-01 [P0/security] Fanout shell wrappers interpolate unescaped attacker-controlled values @ .opencode/commands/deep/assets/deep-research-auto.yaml
- F-015-02 [P0/security] Deep Review certificates bind artifacts to events using metadata only @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/deep-review-certificates.ts
- F-015-01 [P0/security] Creation evidence accepts a different full reference sharing partial digests @ .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/artifact-events.ts
- F-014-03 [P0/security] Policy identity omits captured authorization state @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts
- F-014-02 [P0/security] Caller-controlled identity strings can forge writer authority @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts
- F-014-01 [P0/security] Ledger append can bypass the fencing-token boundary @ .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/append-only-ledger.ts
- F-013-02 [P0/correctness] Standalone rollback switches trust an unbound allow decision @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/rollback-switch.ts
- F-013-01 [P0/correctness] Standalone readiness gates do not bind sealed artifacts to the verified certificate @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts
- F-011-03 [P0/correctness] Common offline certificates leave semantic artifact identity fields unchecked @ .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-certificates/deep-improvement-common-certificates.ts
- F-011-01 [P0/correctness] Public deletion and restoration cutovers trust unverified authorization objects @ .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts
- F-010-02 [P0/correctness] Max-iteration completion trusts child-authored synthesis counters @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- F-010-01 [P0/correctness] Fan-out fulfills lineages with only a top-level report @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- F-009-04 [P0/correctness] Live-render adapter passes without render evidence @ .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design-live-render.cjs
- F-009-03 [P0/correctness] Adapter variants collide under the same lane identity @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs
- F-009-02 [P0/correctness] Coverage accepts checked identifiers outside the corpus @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs
- F-009-01 [P0/correctness] Missing or corrupt corpus becomes 100% coverage @ .opencode/skills/system-deep-loop/deep-alignment/scripts/check-convergence.cjs
- F-016-06 [P1/security] Standalone Codex dispatch forwards the entire parent environment @ .opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs
- F-016-05 [P1/security] Containment fails open when the artifact scope is outside the worktree @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts
- F-016-04 [P1/security] Write containment exempts pre-existing dirty paths by pathname only @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts
- F-013-06 [P1/correctness] Deep-research and deep-review gates throw on malformed top-level input @ .opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts
- F-013-05 [P1/correctness] Certificate conformance accepts evidence-unbound certificates @ .opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts
- F-013-04 [P1/correctness] Reducer conformance accepts an event-unbound reducer @ .opencode/skills/system-deep-loop/runtime/lib/mode-contracts/conformance.ts
- F-013-03 [P1/correctness] Closure context is only shallowly immutable @ .opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/context.ts
- F-012-04 [P1/correctness] Deep-review parity converts reducer failure into legacy success @ .opencode/skills/system-deep-loop/runtime/lib/deep-review-shadow-parity/harness-adapter.ts
- F-012-03 [P1/correctness] Skill-benchmark ledger parity discards the reducer projection @ .opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-shadow-parity/harness-adapter.ts
- F-012-02 [P1/correctness] Model-benchmark ledger parity discards the reducer projection @ .opencode/skills/system-deep-loop/runtime/lib/model-benchmark-shadow-parity/harness-adapter.ts
- F-012-01 [P1/correctness] Agent-improvement ledger parity returns the legacy projection @ .opencode/skills/system-deep-loop/runtime/lib/agent-improvement-shadow-parity/harness-adapter.ts
- F-011-04 [P1/correctness] Alignment output provenance accepts lifecycle events without artifact identity binding @ .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-certificates/deep-alignment-certificates.ts
- F-011-02 [P1/correctness] Verified sealed reads do not enforce the claimed canonicalization profile @ .opencode/skills/system-deep-loop/runtime/lib/sealed-reference-artifacts/sealed-artifact-store.ts
- F-010-04 [P1/correctness] Executor JSONL audits collapse materially different dispatches @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts
- F-010-03 [P1/correctness] Fan-out discards invocation provenance before spawning @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- F-009-06 [P1/correctness] Interactive scoping discards the selected adapter @ .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs
- F-009-05 [P1/correctness] Live-render artifacts have no partition identity @ .opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs

## Output contract (STRICT)
Output ONLY a fenced JSON block, nothing after it:

```json
{
  "iteration": 18,
  "dimension": "security",
  "summary": "<3-6 sentences: what you examined and the risk picture>",
  "findings": [ { "severity": "P0|P1|P2", "dimension": "security", "title": "<short>", "file": "<repo-relative path>", "line": 0, "evidence": "<what you actually read there — quote or describe the exact code>", "recommendation": "<fix direction>" } ],
  "refutations": [ { "id": "<known finding id>", "verdict": "confirmed|refuted|deepened", "reason": "<evidence>" } ],
  "coverage": { "filesExamined": 0, "keyPaths": ["<the main files you read>"] }
}
```

Severity bar: P0 = would certify/authorize something false, lose data, or permit
unauthorized mutation at authority cutover; P1 = real defect with a concrete trigger;
P2 = quality/maintainability. Every finding MUST cite a file you actually read (line
where possible). No speculative findings — an empty findings array with honest deep
coverage beats padded findings.
