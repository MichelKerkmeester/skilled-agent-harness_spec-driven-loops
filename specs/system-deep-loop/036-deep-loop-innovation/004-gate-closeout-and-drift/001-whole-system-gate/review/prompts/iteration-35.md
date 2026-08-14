# Deep-review leaf — iteration 35 of 40 (maintainability)

You are a deep-review LEAF executing exactly ONE iteration of a review loop. The loop
orchestrator (not you) owns all state files. You are READ-ONLY: do not create, modify,
or delete ANY file. Your entire output is your final message.

GATE-3 PRE-RESOLVED (A) — write authority is owned by the orchestrator; never ask the
A-E documentation question. Do not run any state-mutating command.

## Target
The `system-deep-loop` skill (repo root is CWD). Scope list:
`.opencode/specs/system-deep-loop/036-deep-loop-innovation/001-whole-system-gate/goal-file-manifest.txt`.

## This iteration's dimension: MAINTAINABILITY
## Focus
Shared services + governance: shared/, hub files, top-level docs coherence

Go DEEP on the focus surface: read the actual implementation files end to end, trace
the load-bearing paths, and hunt for genuine defects. Prefer depth on the focus over
breadth. You may follow references out of the focus when a suspected defect crosses
module boundaries.

## Already-known open findings (do NOT re-report these; DO deepen/refute if evidence warrants)
- F-029-02 [P0/traceability] Mandatory legacy-writer-retirement evidence does not exist @ .opencode/specs/system-deep-loop/036-deep-loop-innovation/004-legacy-writer-retirement/checklist.md
- F-028-01 [P0/traceability] Codex ai-council conversion loses the no-shell and scoped-write boundary @ .codex/agents/ai-council.toml
- F-021-01 [P0/security] Autonomous model benchmark fabricates promotion approval @ .opencode/commands/deep/assets/deep-model-benchmark-auto.yaml
- F-019-02 [P0/security] Council topic identifiers traverse outside the packet @ .opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-topic.cjs
- F-019-01 [P0/security] Council writer scopes writes relative to an attacker-chosen root @ .opencode/skills/system-deep-loop/deep-ai-council/scripts/lib/persist-artifacts.cjs
- F-018-03 [P0/security] Branch worker side effects are not fenced for the lease lifetime @ .opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/durable-orchestrator.ts
- F-018-02 [P0/security] Lock release can delete a successor after a stale identity check @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts
- F-018-01 [P0/security] Stale lock reclamation can move a refreshed lock without identity verification @ .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts
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
- F-034-03 [P1/maintainability] Shared spawn timeout never settles when the child ignores SIGTERM @ .opencode/skills/system-deep-loop/runtime/tests/helpers/spawn-cjs.ts
- F-034-02 [P1/maintainability] File-wide timeout overrides can hide a hung test for a day @ .opencode/skills/system-deep-loop/runtime/tests/unit/model-benchmark-resume-adapter.vitest.ts
- F-034-01 [P1/maintainability] Aggregate suites register independently discovered tests a second time @ .opencode/skills/system-deep-loop/runtime/tests/unit/agent-improvement-rollback-gate.vitest.ts
- F-033-02 [P1/maintainability] Documented nested legacy fixture corpus is skipped by the loader @ .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs
- F-033-01 [P1/maintainability] Seven shipped benchmark profiles reference nonexistent fixture IDs @ .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v3.json
- F-032-05 [P1/maintainability] Context merge mode silently reads research artifacts @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs
- F-032-04 [P1/maintainability] Missing or unreadable event files produce SCRIPT_ERROR instead of input validation @ .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs
- F-032-03 [P1/maintainability] Misspelled reducer flags silently redirect writes @ .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs
- F-032-02 [P1/maintainability] Invalid fanout schemas are reported as generic script failures @ .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs

## Output contract (STRICT)
Output ONLY a fenced JSON block, nothing after it:

```json
{
  "iteration": 35,
  "dimension": "maintainability",
  "summary": "<3-6 sentences: what you examined and the risk picture>",
  "findings": [ { "severity": "P0|P1|P2", "dimension": "maintainability", "title": "<short>", "file": "<repo-relative path>", "line": 0, "evidence": "<what you actually read there — quote or describe the exact code>", "recommendation": "<fix direction>" } ],
  "refutations": [ { "id": "<known finding id>", "verdict": "confirmed|refuted|deepened", "reason": "<evidence>" } ],
  "coverage": { "filesExamined": 0, "keyPaths": ["<the main files you read>"] }
}
```

Severity bar: P0 = would certify/authorize something false, lose data, or permit
unauthorized mutation at authority cutover; P1 = real defect with a concrete trigger;
P2 = quality/maintainability. Every finding MUST cite a file you actually read (line
where possible). No speculative findings — an empty findings array with honest deep
coverage beats padded findings.
