## Row 101 (ambiguous)
- Doc: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/011-deep-research-swe-2/research/lineages/swe-2-research/iterations/iteration-004.md:47`
- Citation: `goal.md:116`
- Candidates: `.claude/commands/create/goal.md`, `.skilled/commands/create/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/003-deep-loop-executor-support/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/004-cli-hermes-skill-packet/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/005-hermes-runtime-folder/goal.md`, `specs/cli-external-orchestration/071-cli-hermes-creation/006-hermes-hook-and-plugin-layer/goal.md` and 456 more

```text
**11. When the deletion surface turns out to be load-bearing, halt — do not work around it.** Phase 005 found the MCP `Server` object was the socket's request handler, not a stdio transport, and stopped rather than deleting the socket the CLI depends on; the phase reopened and the wire migration shipped in `3def6d6c9b`. [SOURCE: command:`git show 3def6d6c9b`]

**12. Rename after the removal, and carry everything that names the path — including generated artifacts, which are regenerated, not edited.** `git mv` plus 407 path updates: launcher, CLI shim, plugin, doctor scripts, tsconfig outputs, freshness key, the cross-package shim, and the committed trigger index (`f5c55c7eb8`). Renaming first would hide deletions inside a move diff. [SOURCE: command:`git show 3feab865ea`] [SOURCE: file:goal.md:116] [SOURCE: file:spec.md:158]

### D. Sweep residue by claims, over the whole repo, with explicit keep-classes
```

## Row 103 (ambiguous)
- Doc: `specs/sk-prompt/007-sk-prompt-parent/review/deep-review-strategy.md:336`
- Citation: `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json:108`
- Candidates: `.pi/extensions/pi-cache-optimizer/benchmark/reports/2026-08-17--manual-testing-playbook--cache-behavior/skill-benchmark-report.json`, `.pi/extensions/pi-fast-mode-w-subagent-support/benchmark/reports/2026-08-17--manual-testing-playbook--fast-mode-usage/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--verify--luna-high/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-07-29--manual-testing-playbook--goal-hook/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-claude-code/benchmark/reports/2026-08-08--manual-testing-playbook--claude/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-2/skill-benchmark-report.json`, `.skilled/skills/cli-external-orchestration/cli-codex/benchmark/reports/2026-08-08--manual-testing-playbook--agent-routing-3/skill-benchmark-report.json` and 279 more

```text
- What was tried: Overlay `playbook_capability`: DEFERRED for ordered-bundle scenario coverage. `hub-router.json` advertises `orderedBundle`, but the current playbook/benchmark evidence exercises four single-mode routing scenarios only; no gold row proves bundle behavior is a required correctness contract. [SOURCE: `.opencode/skills/sk-prompt/hub-router.json:8-14`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.md:38-58`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json:108-117`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: DEFERRED for ordered-bundle scenario coverage. `hub-router.json` advertises `orderedBundle`, but the current playbook/benchmark evidence exercises four single-mode routing scenarios only; no gold row proves bundle behavior is a required correctness contract. [SOURCE: `.opencode/skills/sk-prompt/hub-router.json:8-14`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.md:38-58`; `.opencode/skills/sk-prompt/benchmark/reports/2026-07-10--router-final--router/skill-benchmark-report.json:108-117`]

### Overlay `playbook_capability`: DEFERRED to maintainability/traceability dimensions; this iteration only checked README and agent command-path correctness. -- BLOCKED (iteration 1, 1 attempts)
```

## Row 105 (ambiguous)
- Doc: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-011.md:21`
- Citation: `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:127`
- Candidates: `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/008-invalid-anchors/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/009-valid-priority-tags/spec.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/010-valid-evidence/spec.md` and 4650 more

```text
4. **Verifier ownership follows evidence production order and is rechecked at the last mutable boundary — CONFIRM Decision 2 and EXTEND iteration 10's earliest-owner rule.** Admission verifies proposal and dependency closure; the seal verifier owns executable content; the organization-policy compiler owns source-rule provenance; the gate service owns authenticated human decision and dependency freshness; budget authority owns reservations, debits, settlements, leases, and budget heads; the graph evidence resolver verifies their immutable references and current heads; the 036 gateway alone owns…

…get receipt are invalid effect capabilities. This preserves reference closure without collapsing ledgers or creating one omnibus graph receipt. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:54-56] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/spec.md:127-129] [INFERENCE: separation is the runtime composition of iterations 6 and 9]…

6. **Compatibility is additive, versioned, and authority-neutral until the 036 cutover plane selects it — REFINE iterations 4, 8, and 10.** Existing V1 authorization requests, decision events, frame bytes, registry digests, and replay remain unchanged. Add graph payload definitions at version 1, a graph evidence verifier/adapter, and a refusal evidence reader; introduce an adjac
```

## Row 106 (ambiguous)
- Doc: `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/iterations/iteration-008.md:15`
- Citation: `specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62`
- Candidates: `.claude/commands/speckit/plan.md`, `.skilled/commands/speckit/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/003-valid-level2/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/004-valid-level3/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/005-unfilled-placeholders/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/006-missing-required-files/plan.md`, `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/007-valid-anchors/plan.md` and 4099 more

```text
1. **GraphARC has several locally useful records but no single reference-closed source of truth — CONFIRM Decision 4 and CONTRADICT the trace module's audit-trail claim.** Trace JSONL captures observed node/sub-step activity and drives replay, cost, metrics, and OTel, but truncates values, omits reducer identity, infers parentage, and is disconnected from policy JSONL and session SQLite. Policy audit can be absent on compiled paths; session rows and checkpoints separately describe inputs, status, and state. The system contract therefore makes verified 036 domain, authorization-audit, refusal-e…

… the existing event envelope and append receipt. Durations, token chunks, host/PID, span IDs, and rendered state are observations or projections and do not decide replay order or authority. [SOURCE: specs/system-deep-loop/037-graph-engineering/002-graphene-main/research/research.md:99-145] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/004-transition-authorization-gateway/plan.md:62-85] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:215-235]…

3. **Deterministic replay requires reference-closed multi-ledger cuts and exact reducer identity — CONFIRM Graphene P2 and REFINE GraphARC replay.** Domain and authorization ledgers have independent sequences; a valid cut includes every authorization reference required by its domain range and classif
```

## Row 107 (ambiguous)
- Doc: `specs/sk-code/001-sk-code-parent/025-code-quality-and-shared-research/research/research.md:84`
- Citation: `.opencode/skills/sk-code/code-quality/SKILL.md:187`
- Candidates: `.hermes/skills/agent-ai-council/SKILL.md`, `.hermes/skills/agent-code/SKILL.md`, `.hermes/skills/agent-context/SKILL.md`, `.hermes/skills/agent-debug/SKILL.md`, `.hermes/skills/agent-deep-improvement/SKILL.md`, `.hermes/skills/agent-deep-research/SKILL.md`, `.hermes/skills/agent-deep-review/SKILL.md`, `.hermes/skills/agent-design/SKILL.md` and 131 more

```text
4. **P2 / fourth:** tune parent router/advisor vocabulary and scorer cases without creating a separate `code-quality` identity; the parent already routes the single `sk-code` identity and has quality aliases. [SOURCE: .opencode/skills/sk-code/mode-registry.json:10] [SOURCE: .opencode/skills/sk-code/mode-registry.json:35] [SOURCE: .opencode/skills/sk-code/hub-router.json:42]
5. **P2 / fifth:** add sk-code-owned hook coverage and a deep-review consumption note after the docs/schema are explicit. Current manual coverage includes dist staleness but lacks comment-hygiene branch coverage. [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:298] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:322] [SOURCE: .opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md:324]
…nt authority, completion claims, copied shared references, or packet-local graph metadata to `code-quality`; defer delta-file ownership to deep-loop, and involve system-spec-kit only if deltas become canonical governed artifacts. [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:185] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:187] [SOURCE: .opencode/skills/sk-code/code-quality/SKILL.md:192] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/verify-iteration.cjs:159] [SOURCE: .opencode/agents/deep-research.md:71] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:410]…

## Convergence Recommendation (Iteration 9)
```
