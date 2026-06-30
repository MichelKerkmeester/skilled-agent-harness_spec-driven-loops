# Deep Review Report — glm Fan-Out Lineage

> **Lineage**: `fanout-glm-1782805948784-ypcv5r` · **Executor**: cli-opencode model=zai-coding-plan/glm-5.2 · **Target**: `skilled-agent-orchestration/123-agent-loops-improved`

## 1. Executive Summary

**Verdict: CONDITIONAL.** The lineage completed 50/50 iterations under `stopPolicy=max-iterations` and recorded **0 P0, 5 P1, 2 P2** active findings. `hasAdvisories=true` (P2 advisories F006, F007). Release readiness remains **in-progress** until the active P1s are remediated or explicitly accepted.

GLM independently confirms the five P1 findings surfaced by the sibling codex lineage (F001–F005) from direct code reads, and contributes two GLM-unique P2 advisories (F006 write-boundary, F007 salvage-recovery fragility). No P0 correctness/security failure survived adversarial replay.

## 2. Planning Trigger

Route to remediation planning because active P1 findings remain. Highest-value fixes, in priority order: (1) bind the supplied fan-out session id through review init (F002), (2) reconcile the CLI fan-out prompt with the LEAF deep-review agent contract (F003), (3) restore fan-out test parity (F004), (4) replace phase-009 placeholders or downgrade its status (F001), (5) remove ephemeral finding-id comments from the workflow YAML (F005). The P2 advisories (F006, F007) are defense-in-depth and reliability improvements that can ride along.

## 3. Active Finding Registry

### F001 (P1) — Phase 009 spec is marked Complete while retaining scaffold placeholders
- Status: active · Dimension: traceability · Class: spec_drift
- Evidence: [SOURCE: .opencode/specs/skilled-agent-orchestration/123-agent-loops-improved/009-loop-systems-remediation/spec.md:50]; [SOURCE: …/spec.md:25]; [SOURCE: …/spec.md:85]; [SOURCE: …/spec.md:97]; [SOURCE: …/spec.md:121]; [SOURCE: …/spec.md:191]
- Claim: Phase 009 declares `Status: Complete` (line 50) and `completion_pct: 100` (line 25) while Problem, Purpose, Scope, Requirements, Success Criteria, Risks, Handoff Criteria, and the Phase Documentation Map rows remain unfilled template placeholders. The parent spec.md:106 lists 009 as In Progress — a direct parent/child contradiction.
- Recommendation: Downgrade Status to In Progress / Scaffolded, or replace every placeholder with real remediation scope, requirements, and handoff evidence before closing phase 009.
- Adversarial replay: survived (iterations 8, 15, 17, 43). No evidence found backing the Complete claim.

### F002 (P1) — Fan-out lineage session id is discarded during review init
- Status: active · Dimension: correctness · Class: state_identity_drift
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1281]; [SOURCE: …/fanout-run.cjs:788]; [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:373]; [SOURCE: …/deep_review_auto.yaml:410]; [SOURCE: …/deep_review_auto.yaml:415]
- Claim: fanout-run.cjs builds a concrete `sessionId = fanout-${lineage.label}-${runId}` (line 1281) and passes it to the lineage prompt (line 788), but review init writes `sessionId: {ISO_8601_NOW}` in config (373), state log (410), and registry (415). Every fan-out lineage therefore records an unrelated timestamp as its identity, breaking lineage traceability across config/state/registry and convergence events.
- Recommendation: Bind the supplied `session_id` into review init and reuse it across config, state, registry, and synthesis. The native path (`buildNativeCommandInput`) already pre-binds lineage identity; the CLI/LEAF prompt path must do the same.
- Adversarial replay: survived (iterations 9, 24, 44).

### F003 (P1) — CLI fan-out prompt names the deep-review agent and instructs it to run the full loop
- Status: active · Dimension: traceability · Class: agent_contract_conflict
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:806]; [SOURCE: …/fanout-run.cjs:816]; [SOURCE: .opencode/agents/deep-review.md:34]; [SOURCE: …/deep-review.md:54]; [SOURCE: …/deep-review.md:64]
- Claim: The generated CLI lineage prompt opens with "You are a ${agentName} agent running a fan-out lineage" (806) and instructs "Run phase_init, phase_main_loop … and phase_synthesis" (816). For review lineages `agentName` resolves to "deep-review", whose contract (deep-review.md:34, 54-64) is exactly ONE iteration, LEAF-only, and MUST NOT run the full loop. The prompt contradicts the agent contract it names.
- Recommendation: Render CLI lineage prompts as command-host/orchestrator prompts (the subprocess owns the /deep:review loop, it is not the LEAF agent), or dispatch through the command surface directly.
- Adversarial replay: survived (iterations 10, 22, 45).

### F004 (P1) — Native-only fan-out test no longer matches the flat-pool implementation
- Status: active · Dimension: correctness · Class: test_contract_drift
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1174]; [SOURCE: …/fanout-run.cjs:1177]; [SOURCE: .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts:323]; [SOURCE: …/fanout-run.vitest.ts:344]; [SOURCE: …/fanout-run.vitest.ts:351]
- Claim: fanout-run.cjs:1177 sets `cliLineages = allLineages` (pool owns every lineage kind, including native, per 1174-1177), but the vitest at 323-352 still asserts a native-only config produces zero CLI lineage work, empty results, and an `empty_tick` convergence summary. The focused native-only test is stale and will fail.
- Recommendation: Update the native-only tests to the new pool-owned native contract (with a native/opencode stub) or restore a true no-CLI branch; keep the legal-convergence phrase assertion synchronized with the current `summarizeSnapshots` wording.
- Adversarial replay: survived (iterations 11, 18, 46).

### F005 (P1) — Review workflow YAML carries ephemeral finding-id comments
- Status: active · Dimension: maintainability · Class: comment_hygiene_violation
- Evidence: [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:395]; [SOURCE: …/deep_review_auto.yaml:408]
- Claim: deep_review_auto.yaml embeds `<!-- F-010-B5-04 -->` markers at lines 395 and 408, violating the comment-hygiene rule that forbids ephemeral artifact/finding identifiers in durable code or workflow comments.
- Recommendation: Remove the F-010-B5-04 markers; keep only the durable rationale for honoring the parsed `--no-resource-map` flag (the existing prose already explains it).
- Adversarial replay: survived (iterations 12, 20, 47).

### F006 (P2 — advisory) — Lineage write boundary enforced by prompt text, not a path-scoped sandbox
- Status: active · Dimension: security · Class: defense_in_depth_gap
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1287]; [SOURCE: …/fanout-run.cjs:1291]; [SOURCE: …/fanout-run.cjs:1294]
- Claim: The lineageDir-only write boundary is enforced by the prompt instruction ("Do not touch any path outside lineageDir") rather than a narrower sandbox; the sandbox defaults to write-capable so the review subprocess can write its own artifacts. A non-compliant executor can write outside lineageDir with no OS-level barrier. Defense-in-depth gap, not an active exploit.
- Recommendation: When the CLIs expose a path-scoped workspace-write mode, switch the default for review/research lineages to it; until then document the prompt-only boundary as a known limitation.

### F007 (P2 — advisory) — Salvage recovery depends on stdout parsing and re-runs the same weak executor
- Status: active · Dimension: maintainability · Class: recovery_fragility
- Evidence: [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1382]; [SOURCE: …/fanout-run.cjs:1388]; [SOURCE: review/orchestration-status.log:5]
- Claim: `runSalvageSweep` (1382) recovers missing artifacts by parsing captured stdout of a clean-exiting lineage, and a missing-artifact lineage is classified `salvage_miss` with `retry_verdict: transient` (orchestration-status.log:5). The retry re-dispatches the same executor/prompt that already exited 0 without writing artifacts; a deterministic failure for that executor burns the retry budget without changing the outcome (the prior glm attempt was exactly this case).
- Recommendation: On a `salvage_miss` retry, surface a structured artifact checklist in the retry prompt and/or escalate after the first identical `salvage_miss` rather than retrying identically up to `maxRetries`.

## 4. Remediation Workstreams

1. **Lineage state integrity (F002)** — Patch review init to consume the supplied `session_id`; verify consistency across config, JSONL, registry, and synthesis. Highest leverage: unblocks correct lineage traceability for all future fan-out runs.
2. **Agent/command contract fidelity (F003)** — Adjust CLI lineage prompt rendering (orchestrator framing) or dispatch through the command host so LEAF-only agent instructions are not contradicted.
3. **Verification recovery (F004)** — Update fanout-run tests to the current native-pool contract; rerun the focused `fanout-run.vitest.ts` + `fanout-merge.vitest.ts` suite.
4. **Spec/document hygiene (F001, F005)** — Replace phase-009 placeholders or downgrade its status; remove ephemeral finding-id comments from the workflow YAML.
5. **Defense-in-depth + reliability (F006, F007)** — Track as P2 improvements; F007 is directly actionable for the fan-out retry path.

## 5. Spec Seed

Add a remediation scope (or expand phase 009) to explicitly cover: fan-out lineage identity propagation (F002), CLI prompt vs LEAF-agent contract (F003), native-pool test alignment (F004), phase-009 placeholder/status reconciliation (F001), and workflow comment hygiene (F005). Acceptance: supplied `session_id` appears in config/state/registry; CLI prompt no longer names the LEAF agent as the loop runner; focused fan-out suite passes; phase-009 status matches its evidence; no ephemeral finding-id markers in `deep_review_auto.yaml`.

## 6. Plan Seed

1. Patch `deep_review_auto.yaml` init steps (373, 410, 415) to bind `{session_id}` instead of `{ISO_8601_NOW}`; thread `session_id` from the fan-out prompt into the workflow setup.
2. In `fanout-run.cjs` `buildLoopPrompt`, reframe the CLI lineage prompt as a command-host/orchestrator prompt (not "${agentName} agent") for review/research loops; keep the LEAF agent for the native dispatch path.
3. Update `fanout-run.vitest.ts` native-only case (323-352) to the pool-owned native contract with a stub, or restore a no-CLI branch; resync the legal-convergence phrase assertion.
4. Replace phase-009 spec placeholders or set `Status: In Progress` / `completion_pct` to match evidence; reconcile with parent spec.md:106.
5. Remove `<!-- F-010-B5-04 -->` markers at deep_review_auto.yaml:395,408.
6. (P2) Add a structured artifact-checklist retry prompt for `salvage_miss`; (P2) document the prompt-only write boundary as a known limitation until path-scoped workspace-write is available.

## 7. Traceability Status

| Protocol | Tier | Status | Gate | Evidence |
|----------|------|--------|------|----------|
| spec_code | core | partial | hard | F001 (009 placeholders vs Complete), F003 (prompt vs contract) |
| checklist_evidence | core | partial | hard | F004 focused test failure; 009 Level-1 has no checklist.md |
| feature_catalog_code | overlay | partial | advisory | F002/F003 fan-out dispatch drift |
| playbook_capability | overlay | partial | advisory | F004 verification drift, F007 salvage reliability |

## 8. Deferred Items

- P2 advisories F006 (write boundary) and F007 (salvage recovery) are deferred to a hardening pass; not release-blocking.
- No external/web checks were run; the review remained strictly local and code-only.
- The `/goal` plugin and phases 001-008 were spot-checked for scope integrity (iterations 16, 29-35) with no findings; a dedicated deep review of those subsystems is out of scope for this lineage.

## 9. Audit Appendix

- **Stop reason**: `maxIterationsReached` (50/50; convergence computed as telemetry only under `stopPolicy=max-iterations` and did not end the run).
- **Iterations**: 50. Waves: discovery (1-7), adversarial replay (8-14), core cross-reference protocols (15-21), overlay protocols (22-28), coverage sweep (29-35), regression/parity (36-42), stabilization re-confirmation (43-49), final coverage (50).
- **Dimensions covered**: correctness, security, traceability, maintainability (all `true` in registry).
- **Severity counts (active)**: P0=0, P1=5, P2=2.
- **Verdict logic**: no P0 → not FAIL; active P1 present → CONDITIONAL; P2 present → `hasAdvisories=true`. Verdict lock respected.
- **Adversarial replay**: every P1 was replayed at least twice (waves 2 and 7); all survived. No P0 findings to downgrade.
- **Cross-model parity**: GLM independently confirms codex F001-F005 from direct code reads; adds F006/F007 as GLM-unique advisories. Strongest-restriction merge with codex yields CONDITIONAL (no P0 in either lineage).
- **Verification run**: focused vitest not re-executed by this lineage (observation-only); evidence for F004 is the static drift between `fanout-run.cjs:1177` and `fanout-run.vitest.ts:323-352`.
- **Resource map coverage**: `resource-map.md` was not present at init → coverage gate omitted per SKILL.md §3 (no failure).
