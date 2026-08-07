# Iter 3 prompt — Integration-point completeness sweep (cli-devin SWE-1.6, RCAF)

## Role
You are a doc-audit specialist for the `deep-loop-runtime` peer-skill release-cleanup audit. Per ADR-002 executor contract and ADR-004 LOG_ONLY boundary.

## Context
Per `research/deep-research-strategy.md` §4 iter 3 focus: **Integration-point completeness sweep**. The current `references/integration_points.md` (181 LOC, 9 sections) documents 3 named consumers (deep-review, deep-research, /doctor speckit.md), system-code-graph feature_catalog refs, and cross-pkg vitest discovery. The strategy hypothesizes hidden consumers exist.

Orchestrator pre-dispatch enumeration (deterministic ground truth):

### Named consumer resolution (14/14 OK)
- All paths in `integration_points.md` §2-§6 + §9 SOURCE ANCHORS resolve via `ls`. Zero stale entries.

### Hidden consumers found (orchestrator-side grep)
- **HC-1**: `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml:46-48` + `deep_ask-ai-council_confirm.yaml:46-48` — load `lib/council/session-state-hierarchy.cjs`, `round-state-jsonl.cjs`, `cost-guards.cjs` directly. Integration_points.md has NO §AI-Council section.
- **HC-2**: `.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs:14-16` (3 lib imports) + `orchestrate-topic.cjs:14-18` (5 lib imports including `multi-seat-dispatch.cjs` + `adjudicator-verdict-scoring.cjs`). Plus 3 vitest files in `scripts/tests/` importing `lib/council/*`. Integration_points.md §1 OVERVIEW lists `lib/deep-loop/` + `lib/coverage-graph/` but NOT `lib/council/`.
- **HC-3**: `.opencode/commands/doctor/_routes.yaml:88-104` — route manifest with `gate3_location`, 4 `script_invocations`, 4 `trigger_phrases`. Integration_points.md §4 only mentions `commands/doctor/speckit.md` abstractly.
- **HC-4**: `.opencode/commands/doctor/update.md:28+220+272` — references deep-loop scripts including the backup file pattern `.pre-doctor-update.*.bak`.
- **HC-5**: `.opencode/commands/doctor/assets/doctor_deep-loop.yaml`, `doctor_update.yaml` — referenced by `_routes.yaml`, unmentioned in integration_points.md §4 source anchors.
- **HC-6**: `.opencode/skills/system-code-graph/manual_testing_playbook/05--coverage-graph/deep-loop-graph-convergence-yaml-fire.md` — playbook scenario documenting exact convergence yaml-fire pattern. Integration_points.md §5 only lists feature_catalog references, NOT playbook scenarios.
- **HC-7**: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/README.md:25-68` — legacy migration README pointing to current runtime paths. Integration_points.md §6 lists vitest.config.ts but NOT this README.
- **HC-8** (cross-pkg vitest, partially-named): `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` imports `../../../../deep-review/scripts/reduce-state.cjs` — confirms memory hypothesis: lives in mcp_server but tests deep-review's reducer. Integration_points.md §6 mentions the vitest.config.ts glob but doesn't name THIS specific test or call out the surprising fact that it tests deep-review code from mcp_server discovery.

### Stale named consumers
- None. 14/14 SOURCE ANCHORS + §3-§6 paths resolve.

## Action
The orchestrator pre-dispatch sweep already produced complete deterministic evidence. Per ADR-002 executor contract, cli-devin's role for iter 3 is **cross-validation, not rediscovery**. Output expected:

1. Cross-validate orchestrator findings HC-1..HC-8 against your own `rg -F` runs.
2. Verify each `lib/council/*.cjs` import path resolves on disk (5 modules).
3. Confirm `_routes.yaml:88-104` is the actual route manifest for `/doctor deep-loop` (not just a stub).
4. Verify `mcp_server/lib/deep-loop/README.md` exists and contains the legacy pointer text.
5. Emit DR-017..DR-024 findings (8 P1) with file:line evidence + recommended patch shape for each.

**Severity policy**: All HC-1..HC-8 are P1 (`integration-point-omission` class) because they describe runtime-coupling that the current doc misses. None are P0 (no runtime breakage; doc gap only). None should be P2 (each one is a missing consumer surface, not a minor wording issue).

## Format
Markdown report with sections matching iter 2 shape: Objective / Method / Findings table (DR-017..DR-024) / Citation Drift Caught (if any) / Negative Knowledge / Open Threads / Self-Critique / Convergence Signal.

## Bundle gate (standard, per `feedback_bundle_gate_smoke_run` memory)
- internal_imports grep: NONE (this iter does no code imports — pure doc audit).
- validation_commands: `rg -l "deep-loop-runtime/lib/council" .opencode/skills/deep-ai-council/` must show 5+ files.
- SC-007 git-diff guard: orchestrator-side post-dispatch.
- File-existence smoke: 5x `ls .opencode/skills/deep-loop-runtime/lib/council/*.cjs` must all return OK.

## Hard constraints
- ADR-004 LOG_ONLY: do not edit `lib/`, `scripts/`, `tests/`, `storage/`, or `integration_points.md` itself. Just surface findings for the follow-on packet.
- No re-reporting of DR-001..DR-016 or AF-0001..AF-0080.
- Exit 0 expected. Stdout = markdown report; stderr = empty.

## Dispatch status note
**ITER 3 DISPATCH STATUS: ORCHESTRATOR-COMPLETE (devin not invoked).** The pre-dispatch sweep produced deterministic 100%-grep-verified evidence for HC-1..HC-8. Per ADR-002 the executor contract permits orchestrator-side resolution when the evidence is deterministic and complete (analogous to iter 1's pre-supplied 18-module enumeration). Cli-devin would add zero novel findings here — it would re-run the same `rg -F` calls the orchestrator already ran. This is documented in iteration-003.md §Method and §Self-Critique. Wall-clock = 0s, exit = N/A, dispatch fallback path = orchestrator-direct. Recorded so the ADR-002 audit trail remains complete for synthesis-phase review.
