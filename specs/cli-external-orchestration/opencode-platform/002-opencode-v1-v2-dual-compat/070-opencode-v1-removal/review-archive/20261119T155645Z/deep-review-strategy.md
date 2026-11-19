---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Branch worktrees/477-opencode-v1-removal, its own commits since origin/main: ba9720f2f08 (runtime code), fc8b3a9a241 (CI and packages), af87a2aa13a (docs), 96e3d8a8f24 (spec packet), 3ef324c3de1 (renames), 4c72145b752 (live evidence), plus the a793f3ad733 merge conflict resolution in cli-opencode/references/providers-and-models.md. The work removes OpenCode 1 support; OpenCode 2 (@opencode/cli 2.3.2) is the only supported major.

Review target type: files (the branch diff). Dimension queue: correctness -> security -> traceability -> maintainability. Stop policy: max-iterations (5).

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Changes merged in from origin/main by a793f3ad733, except its conflict resolution in cli-opencode/references/providers-and-models.md.
- The Mac cleanup (out of repo scope, gated by a separate operator yes).
- Historical files the packet excludes: changelog/ folders and benchmark/reports/.
- Fixing anything: the review target is read-only.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: convergence is telemetry until iteration 5.
- Hard stops: maxIterationsReached (5), maxDurationReached (120 min), 3 consecutive failed iterations, executor unavailable, operator pause sentinel.

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet -- populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| [D1 Correctness] | [PASS/CONDITIONAL/FAIL] | [N] | [1-sentence result] |
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

## 10. EXHAUSTED APPROACHES (do not retry)
[Populated when a review approach has been tried from multiple angles without yielding new findings]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific review approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful review approaches in this category]
- Prefer for: [related dimensions where this category may help]

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded
<!-- MACHINE-OWNED: END -->

---

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

## 12. NEXT FOCUS
<!-- MACHINE-OWNED: START -->
Iteration 1: inventory pass plus correctness over the runtime code commit ba9720f2f08 (version resolution in opencode-version.cjs, dispatch-iteration.cjs, fanout-run.cjs, the cli-dispatch hook lib, the plugins and v2-bridge.js, the session readers) and its tests.
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT
Continuity ladder: no handover.md and no implementation-summary.md at the phase parent; spec.md read. The ripgrep recipe over the target text returned exit 1 (clean no-hit).

spec.md summary: the phase parent removes OpenCode 1.x so OpenCode 2.3.2 is the only supported major, in three children: 001 runtime code and tests, 002 CI and package pins, 003 docs and playbooks. Binding operator decisions: major 1 resolves as unsupported; native deep-loop lineages (v1-only run --command deep/<loop>) are dropped with no replacement; the legacy session/message table branches in the session readers are removed; --pure text is removed from the deep-loop protocol docs. What stays: .opencode/plugins/lib/v2-bridge.js (only its v1-facing server key goes) and EVENT_ALIASES. Recorded blockers: phase 001 T004 live capture not run; phase 002 CI run needs a push go-ahead; phase 003 AC-004 needs a live deep-loop iteration or an ADR waiver.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .github/workflows/opencode-v2-battery.yml | - | - | - | pending |
| .github/workflows/README.md | - | - | - | pending |
| .opencode/package-lock.json | - | - | - | pending |
| .opencode/package.json | - | - | - | pending |
| .opencode/plugins/ARCHITECTURE.md | - | - | - | pending |
| .opencode/plugins/lib/opencode-goal-core.js | - | - | - | pending |
| .opencode/plugins/lib/v2-bridge.js | - | - | - | pending |
| .opencode/plugins/opencode-goal.js | - | - | - | pending |
| .opencode/plugins/README.md | - | - | - | pending |
| .opencode/plugins/system-dist-freshness-guard.js | - | - | - | pending |
| .opencode/plugins/system-skill-advisor.js | - | - | - | pending |
| .opencode/plugins/system-spec-gate.js | - | - | - | pending |
| .opencode/plugins/system-speckit-completion.js | - | - | - | pending |
| .opencode/plugins/tests/classifier-injection-screen.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/decision-capture.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/env-secret-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/mcp-route-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-capabilities.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-continuation.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-export-contract.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-handover.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-lifecycle.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-render-parity.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-state.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-supervisor.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/opencode-goal-tool-path.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/plugin-inventory.json | - | - | - | pending |
| .opencode/plugins/tests/README.md | - | - | - | pending |
| .opencode/plugins/tests/session-cleanup.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/session-handover.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/sk-code-post-edit-quality.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/sk-git-message-gate.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/source-root-consumers.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-completion-sentinel.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-deep-loop-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-dist-freshness-guard.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-skill-advisor.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-spec-gate.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/system-speckit-completion.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-bridge.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-hard-plugins.test.cjs | - | - | - | pending |
| .opencode/plugins/tests/v2-registration.test.cjs | - | - | - | pending |
| .opencode/README.md | - | - | - | pending |
| .skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json | - | - | - | pending |
| .skilled/bin/skilled-loop | - | - | - | pending |
| .skilled/bin/tests/opencode-compat-layout.test.cjs | - | - | - | pending |
| .skilled/bin/tests/opencode-config-shape.test.cjs | - | - | - | pending |
| .skilled/changelog/skilled/v4.1.0.0.md | - | - | - | pending |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | - | - | - | pending |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | - | - | - | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | - | - | - | pending |
| .skilled/commands/deep/assets/deep-research.yaml | - | - | - | pending |
| .skilled/commands/deep/assets/deep-review-presentation.txt | - | - | - | pending |
| .skilled/commands/deep/assets/deep-review.yaml | - | - | - | pending |
| .skilled/commands/deep/assets/legacy/deep-review.body.markdown | - | - | - | pending |
| .skilled/commands/doctor/scripts/git-setup-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/opencode-version-battery.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/README.markdown | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/README.markdown | - | - | - | pending |
| .skilled/CROSS-CLI.md | - | - | - | pending |
| .skilled/hooks/cli-dispatch/codex/codex-shell-tool.test.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-audit.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/opencode-version-corpus.json | - | - | - | pending |
| .skilled/hooks/cli-dispatch/lib/opencode-version.mjs | - | - | - | pending |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs | - | - | - | pending |
| .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs | - | - | - | pending |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs | - | - | - | pending |
| .skilled/hooks/injection-contract.md | - | - | - | pending |
| .skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs | - | - | - | pending |
| .skilled/hooks/session-cleanup/README.md | - | - | - | pending |
| .skilled/hooks/session-handover/runtime-behavior.md | - | - | - | pending |
| .skilled/hooks/session-handover/tests/adapter-conformance.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-claim-goal.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-launch-arguments.test.cjs | - | - | - | pending |
| .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs | - | - | - | pending |
| .skilled/hooks/shared/hook-stdin-deadline.test.mjs | - | - | - | pending |
| .skilled/hooks/shared/session-readers/opencode.d.mts | - | - | - | pending |
| .skilled/hooks/shared/session-readers/opencode.d.mts.map | - | - | - | pending |
| .skilled/hooks/shared/session-readers/opencode.mjs | - | - | - | pending |
| .skilled/hooks/shared/tests/session-readers/fixtures.mjs | - | - | - | pending |
| .skilled/hooks/shared/tests/session-readers/opencode.test.mjs | - | - | - | pending |
| .skilled/package-lock.json | - | - | - | pending |
| .skilled/package.json | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-devin/references/providers-and-models.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/assets/prompt-templates.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v2.0.0.0.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/context-leaf-agent.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-research-agent-iterations.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/deep-review-agent-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/general-agent-default.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/multi-ai-council-multi-strategy.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/orchestrate-agent-multi-agent.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/agent-routing/review-agent-security-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/dir-flag-working-directory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/file-attachment-via-f-flag.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/format-default-vs-json.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/pure-and-print-logs.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/attach-remote-server.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/cross-repo-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/from-claude-code.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/integration-patterns/memory-epilogue-handback.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/intra-routing-recall/cross-repo.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/multi-provider/variant-levels-comparison.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/ablation-suite.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/parallel-detached-session.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/parallel-detached/worker-farm-loop.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/classifier-injection-screen.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/cli-dispatch-audit.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/codex-hooks-watchdog.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/mcp-route-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/opencode-goal.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/run-plugin-scenario.sh | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/session-cleanup.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-code-post-edit-quality.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-git-message-gate.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/sk-git-preflight-advisory.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-completion-sentinel.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-deep-loop-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-dist-freshness-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-skill-advisor.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-spec-gate.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/plugin-utilization/system-speckit-completion.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/minimax-design-context-manifest.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/prompt-templates/template-applied-to-real-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/continue-last-session.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/fork-and-share.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/session-continuity/resume-by-session-id.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/stress/sandbox-permission.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/README.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/context-budget.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/opencode-tools.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/ROUTER.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-models-form.test.cjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode-setup-classify.test.cjs | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/feature-catalog/opencode-version-dispatch/opencode-version-dispatch.md | - | - | - | pending |
| .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md | - | - | - | pending |
| .skilled/skills/sk-code/manual-testing-playbook/plugins-and-hooks/post-edit-quality-router.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md | - | - | - | pending |
| .skilled/skills/sk-code/sk-code-skilled/references/javascript/quality-standards/security-testing-and-exemptions.md | - | - | - | pending |
| .skilled/skills/sk-doc/manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md | - | - | - | pending |
| .skilled/skills/sk-git/references/worktree-workflows.md | - | - | - | pending |
| .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/exhausted-approach-respect.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/pause-sentinel-halt.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/resource-map-toggle.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-native-sequential-research.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/executor-selection-contract.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/fanout-dispatch.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/leaf-only-nested-dispatch-refusal.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/resource-map-coverage-gate.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/setup-yaml-handoff.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/synthesis-save-boundary.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/three-artifact-iteration-contract.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-native-sequential-review.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/opencode-version.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/README.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/executor-audit-cli-branch-receipts.test.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-loop-prompt-in-process.test.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/fanout-review-focus.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-suite.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/shims/adapter-shim-core.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/executor-branch-contract.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/opencode-dual-dispatch.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/vitest.config.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs | - | - | - | pending |
| .skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs | - | - | - | pending |
| .skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/opencode-plugin-bridge.md | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/compiled-routing-consumption.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/skill-graph-diagnostic-redaction.vitest.ts | - | - | - | pending |
| .skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-handover-loop.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/dist-freshness-guard.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-cleanup-plugin.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-pi-opencode.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-cli-driven-slug.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-remediation-rule.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/comment-hygiene-opencode-plugin.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts | - | - | - | pending |
| README.md | - | - | - | pending |
| SECURITY.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/acceptance-criteria.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/decision-record.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/implementation-summary.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/plan.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/.gitkeep | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/after.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/baseline.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/consumers.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/event-capture.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/scratch/justified.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/acceptance-criteria.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/implementation-summary.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/plan.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/.gitkeep | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/after.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/gated-suites.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/sdk-usage.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/variant.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/scratch/versions.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/acceptance-criteria.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/implementation-summary.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/plan.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000001.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000002.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000003.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000004.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000005.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000006.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-audit-ledger/frames/0000000000000007.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-config.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-dashboard.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000001.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000002.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000003.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000004.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000005.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000006.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-ledger/frames/0000000000000007.frame | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-state.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deep-research-strategy.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/deltas/iter-001.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/dispatch-receipts/dispatch-research-i1-g1.completion.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/dispatch-receipts/dispatch-research-i1-g1.intent.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/findings-registry.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/iterations/iteration-001.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/locks-and-fencing-v1/3068150e6d888ae96b4387058ce2a375a706fb9aa66f593dd212a4db0fd55ca6/coordinator-state.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/locks-and-fencing-v1/3068150e6d888ae96b4387058ce2a375a706fb9aa66f593dd212a4db0fd55ca6/grant-journal.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/observability-events.jsonl | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/prompts/iteration-1.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/research.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/research/resource-map.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/.gitkeep | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/baseline.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/changelog-baseline.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/doc-inventory.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/justified.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live-version.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/live.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/locations.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/scratch/mac-cleanup.txt | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/spec.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/003-v1-docs-and-playbooks-sweep/tasks.md | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/description.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/graph-metadata.json | - | - | - | pending |
| specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/spec.md | - | - | - | pending |
| specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/cli-external-orchestration/manifest.json | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10 (stopPolicy max-iterations)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-19T15:28:38.046Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-19T15:28:38.046Z
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
