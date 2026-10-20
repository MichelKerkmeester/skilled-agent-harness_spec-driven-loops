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
Review whether automatic in-session handover fires on Claude Code, Pi, OpenCode, Codex, and Hermes, including linked .skilled repositories; review Cursor and Devin command-only handoff paths.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Automatic execution and live provider-backed hops are not exercised in this static review.
- Cursor and Devin are reviewed only through their command handoff path, as directed by the lead.

## 5. STOP CONDITIONS
- Run all 10 iterations; convergence signals are telemetry only.
- Stop on an unrecoverable gateway or artifact-integrity failure, recording the verified partial state.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 1
- P1 (Required): 4
- P2 (Suggestions): 1
- Resolved: 1

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- None yet; iteration 1 has not started.

## 9. WHAT FAILED
- None yet; iteration 1 has not started.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### agent_cross_runtime: all five automatic registration locations were inspected; a .skilled-only symlink does not provision them. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: agent_cross_runtime: all five automatic registration locations were inspected; a .skilled-only symlink does not provision them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: all five automatic registration locations were inspected; a .skilled-only symlink does not provision them.

### agent_cross_runtime: checked all seven shell runtime functions; automatic and command-only paths remain distinct in the shim. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: agent_cross_runtime: checked all seven shell runtime functions; automatic and command-only paths remain distinct in the shim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: checked all seven shell runtime functions; automatic and command-only paths remain distinct in the shim.

### agent_cross_runtime: inspected documented argument carry across Claude, Pi, OpenCode, Codex, Cursor, Hermes, and Devin. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: agent_cross_runtime: inspected documented argument carry across Claude, Pi, OpenCode, Codex, Cursor, Hermes, and Devin.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: inspected documented argument carry across Claude, Pi, OpenCode, Codex, Cursor, Hermes, and Devin.

### agent_cross_runtime: the registered event surfaces were checked for all five automatic runtimes. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: agent_cross_runtime: the registered event surfaces were checked for all five automatic runtimes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: the registered event surfaces were checked for all five automatic runtimes.

### Checklist evidence and full command-template conformance remain assigned to later passes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Checklist evidence and full command-template conformance remain assigned to later passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Checklist evidence and full command-template conformance remain assigned to later passes.

### Checklist evidence and the command-contract dimension remain assigned to later passes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Checklist evidence and the command-contract dimension remain assigned to later passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Checklist evidence and the command-contract dimension remain assigned to later passes.

### Checklist evidence: deferred to the later traceability passes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Checklist evidence: deferred to the later traceability passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Checklist evidence: deferred to the later traceability passes.

### checklist_evidence: AC-001/002 are packet-recorded as Met; AC-004/005/006 remain open; T008-T013 remain outstanding. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: checklist_evidence: AC-001/002 are packet-recorded as Met; AC-004/005/006 remain open; T008-T013 remain outstanding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: AC-001/002 are packet-recorded as Met; AC-004/005/006 remain open; T008-T013 remain outstanding.

### checklist_evidence: deferred to a later traceability pass. -- BLOCKED (iteration 7, 2 attempts)
- What was tried: checklist_evidence: deferred to a later traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: deferred to a later traceability pass.

### checklist_evidence: deferred to iteration 10. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: checklist_evidence: deferred to iteration 10.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: deferred to iteration 10.

### checklist_evidence: deferred to iteration 10's final adversarial pass. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: checklist_evidence: deferred to iteration 10's final adversarial pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: deferred to iteration 10's final adversarial pass.

### Core spec: phase 013 states the nudge must run only inside skilled-loop; phase 016 asks that the automatic hop fire on each automatic runtime. The reviewed null-usage return creates a silent missed-hop edge case; no contradiction was found in the cited requirements. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core spec: phase 013 states the nudge must run only inside skilled-loop; phase 016 asks that the automatic hop fire on each automatic runtime. The reviewed null-usage return creates a silent missed-hop edge case; no contradiction was found in the cited requirements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec: phase 013 states the nudge must run only inside skilled-loop; phase 016 asks that the automatic hop fire on each automatic runtime. The reviewed null-usage return creates a silent missed-hop edge case; no contradiction was found in the cited requirements.

### Cross-runtime adapter parity: deferred to later iterations. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Cross-runtime adapter parity: deferred to later iterations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-runtime adapter parity: deferred to later iterations.

### duplicate_review_finding: iteration 9's prior-report search found no matching Cursor-name or continuity-save finding; adjacent handoff findings were rechecked as addressed. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: duplicate_review_finding: iteration 9's prior-report search found no matching Cursor-name or continuity-save finding; adjacent handoff findings were rechecked as addressed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: duplicate_review_finding: iteration 9's prior-report search found no matching Cursor-name or continuity-save finding; adjacent handoff findings were rechecked as addressed.

### feature_catalog_code: README presents five automatic runtimes and separates command-only paths; the linked-repository registration gap contradicts automatic behavior in that topology. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: feature_catalog_code: README presents five automatic runtimes and separates command-only paths; the linked-repository registration gap contradicts automatic behavior in that topology.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: README presents five automatic runtimes and separates command-only paths; the linked-repository registration gap contradicts automatic behavior in that topology.

### feature_catalog_code: the feature's command-only runtime description aligns with a manual trigger, while the per-runtime trigger names need clarification. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: feature_catalog_code: the feature's command-only runtime description aligns with a manual trigger, while the per-runtime trigger names need clarification.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: the feature's command-only runtime description aligns with a manual trigger, while the per-runtime trigger names need clarification.

### Full event registration and Hermes process-exit timing remain scheduled for the later hook-registration/runtime-lifecycle passes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Full event registration and Hermes process-exit timing remain scheduled for the later hook-registration/runtime-lifecycle passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Full event registration and Hermes process-exit timing remain scheduled for the later hook-registration/runtime-lifecycle passes.

### Phase 016 requires reviewing whether automatic handover fires every time and fixing confirmed P1 findings. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Phase 016 requires reviewing whether automatic handover fires every time and fixing confirmed P1 findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 016 requires reviewing whether automatic handover fires every time and fixing confirmed P1 findings.

### Phase 016 states that the review must determine whether automatic handover fires every time on the five automatic runtimes and requires confirmed P1 findings to be fixed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Phase 016 states that the review must determine whether automatic handover fires every time on the five automatic runtimes and requires confirmed P1 findings to be fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 016 states that the review must determine whether automatic handover fires every time on the five automatic runtimes and requires confirmed P1 findings to be fixed.

### playbook_capability: source and recorded-test evidence only; this pass makes no provider-backed runtime claim. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: playbook_capability: source and recorded-test evidence only; this pass makes no provider-backed runtime claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: source and recorded-test evidence only; this pass makes no provider-backed runtime claim.

### Shared `armableRecord` checks loop, session, runtime, status, and live-killer ownership. `arm()` restamps `armedAt` and cwd; the earlier duplicate-Claude-arm defect is guarded in current code. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Shared `armableRecord` checks loop, session, runtime, status, and live-killer ownership. `arm()` restamps `armedAt` and cwd; the earlier duplicate-Claude-arm defect is guarded in current code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shared `armableRecord` checks loop, session, runtime, status, and live-killer ownership. `arm()` restamps `armedAt` and cwd; the earlier duplicate-Claude-arm defect is guarded in current code.

### skill_agent: deferred to iteration 9 for the handoff command contract. -- BLOCKED (iteration 7, 2 attempts)
- What was tried: skill_agent: deferred to iteration 9 for the handoff command contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: deferred to iteration 9 for the handoff command contract.

### skill_agent: iteration 9 will check the sk-doc command contract. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: skill_agent: iteration 9 will check the sk-doc command contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: iteration 9 will check the sk-doc command contract.

### skill_agent: plain-command structure, frontmatter, examples, status output, and router-contract applicability checked; invocation naming and the blocking-save gate have findings. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: skill_agent: plain-command structure, frontmatter, examples, status output, and router-contract applicability checked; invocation naming and the blocking-save gate have findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: plain-command structure, frontmatter, examples, status output, and router-contract applicability checked; invocation naming and the blocking-save gate have findings.

### skill_agent: the self-detection requirement is conditional in SKILL.md:244 and conflicts with the template's universal wording; the save-failure gap remains P2. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: skill_agent: the self-detection requirement is conditional in SKILL.md:244 and conflicts with the template's universal wording; the save-failure gap remains P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: the self-detection requirement is conditional in SKILL.md:244 and conflicts with the template's universal wording; the save-failure gap remains P2.

### spec_code: shell-shim behavior matches the lead's requirement to start interactive sessions through the nearest wrapper while allowing noninteractive commands to pass through. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: spec_code: shell-shim behavior matches the lead's requirement to start interactive sessions through the nearest wrapper while allowing noninteractive commands to pass through.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: shell-shim behavior matches the lead's requirement to start interactive sessions through the nearest wrapper while allowing noninteractive commands to pass through.

### spec_code: the command-only path is documented for Cursor and Devin, but Cursor's file-derived invocation name is not the namespaced name in the runtime matrix. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: spec_code: the command-only path is documented for Cursor and Devin, but Cursor's file-derived invocation name is not the namespaced name in the runtime matrix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: the command-only path is documented for Cursor and Devin, but Cursor's file-derived invocation name is not the namespaced name in the runtime matrix.

### spec_code: the linked-.skilled requirement is not satisfied by wrapper discovery alone; the ten iteration artifacts now contain the review result, with the inline-executor limitation stated above. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: spec_code: the linked-.skilled requirement is not satisfied by wrapper discovery alone; the ten iteration artifacts now contain the review result, with the inline-executor limitation stated above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: the linked-.skilled requirement is not satisfied by wrapper discovery alone; the ten iteration artifacts now contain the review result, with the inline-executor limitation stated above.

### spec_code: the phase 016 requirement explicitly includes a repository that symlinks .skilled; the link-only setup does not provide the project hook surfaces listed by the runtime matrix. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: spec_code: the phase 016 requirement explicitly includes a repository that symlinks .skilled; the link-only setup does not provide the project hook surfaces listed by the runtime matrix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: the phase 016 requirement explicitly includes a repository that symlinks .skilled; the link-only setup does not provide the project hook surfaces listed by the runtime matrix.

### spec_code: the receiver and wrapper path was traced against the handover requirement; no mismatch found in this dimension. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: spec_code: the receiver and wrapper path was traced against the handover requirement; no mismatch found in this dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: the receiver and wrapper path was traced against the handover requirement; no mismatch found in this dimension.

### The current killer checks hop cap and armed-record freshness before signaling, waits a fresh grace period after SIGTERM, and re-reads a record before timeout cleanup. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The current killer checks hop cap and armed-record freshness before signaling, waits a fresh grace period after SIGTERM, and re-reads a record before timeout cleanup.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current killer checks hop cap and armed-record freshness before signaling, waits a fresh grace period after SIGTERM, and re-reads a record before timeout cleanup.

### The handoff command defines spec_folder as the sending session's Gate 3 answer and instructs the receiver to resume the packet only when a path is present. The phase 016 review requires reliable handoff behavior on the automatic runtimes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The handoff command defines spec_folder as the sending session's Gate 3 answer and instructs the receiver to resume the packet only when a path is present. The phase 016 review requires reliable handoff behavior on the automatic runtimes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The handoff command defines spec_folder as the sending session's Gate 3 answer and instructs the receiver to resume the packet only when a path is present. The phase 016 review requires reliable handoff behavior on the automatic runtimes.

### The phase 013 requirement says a nudge is useful only inside skilled-loop; the shared decision returns quietly when the wrapper identifier is absent. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The phase 013 requirement says a nudge is useful only inside skilled-loop; the shared decision returns quietly when the wrapper identifier is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The phase 013 requirement says a nudge is useful only inside skilled-loop; the shared decision returns quietly when the wrapper identifier is absent.

### The phase 016 review target asks for each automatic runtime. Claude, Pi, OpenCode, Codex, and Hermes use the shared suppression and threshold decision; Pi and OpenCode add stateful delivery behavior that was reviewed here. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The phase 016 review target asks for each automatic runtime. Claude, Pi, OpenCode, Codex, and Hermes use the shared suppression and threshold decision; Pi and OpenCode add stateful delivery behavior that was reviewed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The phase 016 review target asks for each automatic runtime. Claude, Pi, OpenCode, Codex, and Hermes use the shared suppression and threshold decision; Pi and OpenCode add stateful delivery behavior that was reviewed here.

### The timeout supersession check now protects a different handoff path; it does not identify a new record that reuses the same path. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The timeout supersession check now protects a different handoff path; it does not identify a new record that reuses the same path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The timeout supersession check now protects a different handoff path; it does not identify a new record that reuses the same path.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- None yet; each ruled-out direction will carry its evidence and iteration.

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile ten iterations, the active registry, checklist evidence, and the execution-mode limitation; emit the terminal max-iteration synthesis event. - Reason: the configured 10-iteration cap has been reached; only synthesis and final-state verification remain. - Rotation status: all four review dimensions were covered across the lineage. - Blocked/productive carry-forward: fix active findings and run provider-backed live hops in the owning implementation workflow. - Required evidence: reducer-owned registry/dashboard/strategy, all ten iteration and delta artifacts, final report, and gateway synthesis event. Review verdict: FAIL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot
- Target pointers: .skilled/hooks/session-relaunch/, .skilled/bin/skilled-loop, .skilled/bin/skilled-loop-shell.sh, the five runtime registration surfaces, and /speckit:handoff.
- Behavior claims to verify: 80% default effective-window threshold; usage source per runtime; no nudge outside the loop; note/save/prepare/arm/kill/relaunch/claim lifecycle; linked .skilled repository path behavior.
- Reuse and conventions: shared relaunch-core.cjs, context-usage.cjs, nudge.cjs, killer.cjs, runtime-specific adapters, and wrapper shims.
- Review risks: no root resource-map.md; the YAML graph seed is omitted because its writer targets shared graph storage outside this lineage. Archived review and research reports are deduplication references, not current code evidence.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| spec_code | core | pending | — | Verify spec claims against current runtime code. |
| checklist_evidence | core | pending | — | Review checklist and implementation evidence. |
| skill_agent | overlay | pending | — | Check command and sk-doc contract alignment. |
| agent_cross_runtime | overlay | pending | — | Check runtime adapters and registrations. |
| feature_catalog_code | overlay | pending | — | Review only where the target claims are represented. |
| playbook_capability | overlay | pending | — | Review documented runtime capability evidence. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .claude/settings.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .codex/hooks.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .hermes/plugins/repo-guards/__init__.py | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .hermes/plugins/repo-guards/plugin.yaml | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .hermes/plugins/repo-guards/tests/test_session_relaunch.py | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/session-relaunch.js | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/session-relaunch.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .pi/extensions/session-relaunch.ts | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .pi/settings.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/bin/skilled-loop | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/bin/skilled-loop-shell.sh | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/speckit/handoff.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/README.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/bin/session-relaunch.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/claude/context-nudge.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/claude/stop-arm.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/codex/context-nudge.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/codex/prompt-seed.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/codex/shared.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/codex/stop-arm.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/hermes/context-nudge.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/hermes/session-end-arm.mjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/lib/context-usage.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/lib/killer.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/lib/nudge.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/opencode/session-relaunch.js | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/pi/session-relaunch.ts | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/README.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/adapter-conformance.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/codex-adapters.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/context-usage.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-rollout-token-count.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-spawn-recorder.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-stop.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/codex-user-prompt-submit.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-end.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-finalize.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-on-session-start.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-post-api-request.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-pre-api-request.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-pre-verify.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/hermes-usage.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/opencode-assistant-message-updated.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/payload-post-tool-use.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/payload-stop.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/payload-user-prompt-submit.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/pi-assistant-message-end.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/fixtures/transcript-usage.jsonl | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/killer.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/nudge.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-doc/sk-create-command/SKILL.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/sk-doc/sk-create-command/assets/command-contract.json | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason/acceptance-criteria.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason/implementation-summary.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason/plan.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason/spec.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/013-live-hop-and-notice-reason/tasks.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion/acceptance-criteria.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion/implementation-summary.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion/plan.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion/spec.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/014-handover-docs-promotion/tasks.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog/acceptance-criteria.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog/implementation-summary.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog/plan.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog/spec.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/015-v4-0-0-13-changelog/tasks.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/acceptance-criteria.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/implementation-summary.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/plan.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/tasks.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/goal.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/hooks/023-session-relaunch-loop/spec.md | — | — | 0 P0, 0 P1, 0 P2 | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1; convergence mode: default; stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-1792514860659-ivxs3k, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: deep-review-findings-registry.json
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code,checklist_evidence; overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-20T16:53:01Z
<!-- MACHINE-OWNED: END -->

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
