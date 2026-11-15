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
Review the decision-capture series code and documentation in specs/system-speckit/043-decision-capture; all four review dimensions, seven-iteration ceiling, convergence threshold 0.10.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
This is a read-only review. Do not alter reviewed code or docs, run test suites, use live sessions, or review the external conversation-runner implementation. Keep every generated artifact inside this lineage.

---

## 5. STOP CONDITIONS
Stop on legal convergence or after iteration 7. Stop state changes if the append gateway refuses a row; never write the state log directly. Keep graph storage, event payloads, iterations, deltas, and synthesis inside this lineage.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 3
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Core checklist_evidence: fail — stale child closure statements contradict Met rows or current completion summaries. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core checklist_evidence: fail — stale child closure statements contradict Met rows or current completion summaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: fail — stale child closure statements contradict Met rows or current completion summaries.

### Core checklist_evidence: fail, carried forward from iteration 3. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: Core checklist_evidence: fail, carried forward from iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: fail, carried forward from iteration 3.

### Core checklist_evidence: not evaluated in this correctness pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core checklist_evidence: not evaluated in this correctness pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: not evaluated in this correctness pass.

### Core checklist_evidence: pending for the dedicated traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core checklist_evidence: pending for the dedicated traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core checklist_evidence: pending for the dedicated traceability pass.

### Core spec_code: fail — the phase map, parent binding and phase-007 goal do not define one closure scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core spec_code: fail — the phase map, parent binding and phase-007 goal do not define one closure scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: fail — the phase map, parent binding and phase-007 goal do not define one closure scope.

### Core spec_code: fail, carried forward from iteration 3. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: Core spec_code: fail, carried forward from iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: fail, carried forward from iteration 3.

### Core spec_code: partial for this pass; runtime path selection and candidate behavior reviewed, full code-to-spec mapping deferred. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core spec_code: partial for this pass; runtime path selection and candidate behavior reviewed, full code-to-spec mapping deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: partial for this pass; runtime path selection and candidate behavior reviewed, full code-to-spec mapping deferred.

### Core spec_code: partial for this security pass; the runtime state README promises local storage and the queue path implementation does not enforce that boundary. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core spec_code: partial for this security pass; the runtime state README promises local storage and the queue path implementation does not enforce that boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core spec_code: partial for this security pass; the runtime state README promises local storage and the queue path implementation does not enforce that boundary.

### Cross-runtime adapter boundary: reviewed for the project-directory handoff; no additional adapter-specific path construction was found. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Cross-runtime adapter boundary: reviewed for the project-directory handoff; no additional adapter-specific path construction was found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-runtime adapter boundary: reviewed for the project-directory handoff; no additional adapter-specific path construction was found.

### No additional maintainability issue or unnecessary abstraction was confirmed in the reviewed code. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No additional maintainability issue or unnecessary abstraction was confirmed in the reviewed code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional maintainability issue or unnecessary abstraction was confirmed in the reviewed code.

### No direct text-to-path injection was found in the operator-decision payload: `sourceKey` has a restrictive character set and is used as a key, while `question`, `answer`, and `carriedBy` are serialized as record content. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No direct text-to-path injection was found in the operator-decision payload: `sourceKey` has a restrictive character set and is used as a key, while `question`, `answer`, and `carriedBy` are serialized as record content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No direct text-to-path injection was found in the operator-decision payload: `sourceKey` has a restrictive character set and is used as a key, while `question`, `answer`, and `carriedBy` are serialized as record content.

### No evidence in the reviewed slice that the Claude/Pi sweep writes outside the current project's local decision-capture queue. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No evidence in the reviewed slice that the Claude/Pi sweep writes outside the current project's local decision-capture queue.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence in the reviewed slice that the Claude/Pi sweep writes outside the current project's local decision-capture queue.

### No feature-catalog or README runtime-matrix drift was found in the reviewed rows. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No feature-catalog or README runtime-matrix drift was found in the reviewed rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No feature-catalog or README runtime-matrix drift was found in the reviewed rows.

### No mismatch was found in the live-conversation scenario’s runtime answer paths or nudge expectations. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No mismatch was found in the live-conversation scenario’s runtime answer paths or nudge expectations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No mismatch was found in the live-conversation scenario’s runtime answer paths or nudge expectations.

### No symlink containment check exists at the shared state path, so the queue escape remains an active P2 finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No symlink containment check exists at the shared state path, so the queue escape remains an active P2 finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No symlink containment check exists at the shared state path, so the queue escape remains an active P2 finding.

### No tests were run, as required by this review workflow. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No tests were run, as required by this review workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No tests were run, as required by this review workflow.

### No tests were run; the review strategy marks runtime tests as out of scope for this read-only loop. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No tests were run; the review strategy marks runtime tests as out of scope for this read-only loop.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No tests were run; the review strategy marks runtime tests as out of scope for this read-only loop.

### Overlay agent_cross_runtime: pass — the catalog, README and live-conversation matrix agree on live versus save-time capture and nudge differences. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay agent_cross_runtime: pass — the catalog, README and live-conversation matrix agree on live versus save-time capture and nudge differences.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: pass — the catalog, README and live-conversation matrix agree on live versus save-time capture and nudge differences.

### Overlay agent_cross_runtime: pass, carried forward. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay agent_cross_runtime: pass, carried forward.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: pass, carried forward.

### Overlay agent_cross_runtime: pass; runtime capability descriptions remain consistent outside the transcript-sweeps finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay agent_cross_runtime: pass; runtime capability descriptions remain consistent outside the transcript-sweeps finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay agent_cross_runtime: pass; runtime capability descriptions remain consistent outside the transcript-sweeps finding.

### Overlay feature_catalog_code: pass — runtime modes and save steps match the catalog and OpenCode implementation. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay feature_catalog_code: pass — runtime modes and save steps match the catalog and OpenCode implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code: pass — runtime modes and save steps match the catalog and OpenCode implementation.

### Overlay feature_catalog_code: pass, carried forward. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay feature_catalog_code: pass, carried forward.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code: pass, carried forward.

### Overlay feature_catalog_code: pass; save and runtime boundaries remain aligned. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay feature_catalog_code: pass; save and runtime boundaries remain aligned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code: pass; save and runtime boundaries remain aligned.

### Overlay feature_catalog_code: pending for the dedicated traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay feature_catalog_code: pending for the dedicated traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code: pending for the dedicated traceability pass.

### Overlay feature_catalog_code: queued for the traceability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay feature_catalog_code: queued for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay feature_catalog_code: queued for the traceability pass.

### Overlay playbook_capability: fail — the transcript-sweeps playbook misstates OpenCode and Devin live-hook availability. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay playbook_capability: fail — the transcript-sweeps playbook misstates OpenCode and Devin live-hook availability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook_capability: fail — the transcript-sweeps playbook misstates OpenCode and Devin live-hook availability.

### Overlay playbook_capability: fail, carried forward from iteration 3. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: Overlay playbook_capability: fail, carried forward from iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook_capability: fail, carried forward from iteration 3.

### Overlay playbook_capability: pending for the dedicated traceability pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay playbook_capability: pending for the dedicated traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook_capability: pending for the dedicated traceability pass.

### Overlay playbook_capability: queued for the traceability pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay playbook_capability: queued for the traceability pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay playbook_capability: queued for the traceability pass.

### Overlay skill_agent: not applicable — no separate dispatched agent contract owns decision-capture behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay skill_agent: not applicable — no separate dispatched agent contract owns decision-capture behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: not applicable — no separate dispatched agent contract owns decision-capture behavior.

### Overlay skill_agent: not applicable; no separate agent contract owns this feature. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay skill_agent: not applicable; no separate agent contract owns this feature.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: not applicable; no separate agent contract owns this feature.

### Overlay skill_agent: not applicable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay skill_agent: not applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay skill_agent: not applicable.

### The independent transcript readers reflect different runtime storage formats; their small CLI wrappers have meaningful runtime-specific behavior. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The independent transcript readers reflect different runtime storage formats; their small CLI wrappers have meaningful runtime-specific behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The independent transcript readers reflect different runtime storage formats; their small CLI wrappers have meaningful runtime-specific behavior.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: correctness coverage stabilized; all four configured dimensions remain covered. - Focus area: Record the existing active findings and synthesize the conditional review result. - Reason: The required stabilization pass followed the iteration that first brought dimension coverage to 100%. - Required evidence: Iteration deltas, reducer registry, legal convergence vote, and graph convergence event. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Prior context: the root goal binds phases 001–006, while the root spec phase map now lists 001–007; phase 007's goal appears scaffolded and needs traceability review. Root handover is stale relative to later phase completion. Root resource-map.md is absent. Focus is the decision-capture code, save wiring, coverage docs, feature catalog, and conversation scenarios. Graph DB and observability writes are redirected to this lineage.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: the parent spec and child packets 001–007; capture-core, chat-question, runtime adapters and sweeps; OpenCode plugin; writer, matcher, CLI and save workflow; hook coverage docs, feature catalog, and decision-capture playbook scenarios.
- Behavior claims: one queued decision per answer; process questions excluded; hand-written table matches are consumed without rewriting the record; transcript read failures are visible; orphan answers are surfaced; nudges and live scenario expectations match the adapters.
- Reuse and conventions: the shared capture core, writer-owned consumed-log reader, OpenCode record mapper, existing `takeNudge`, registry as adapter inventory, and the four core/overlay traceability protocols.
- Review risks and gaps: root handover predates later completion; phase 007 is present in the phase map but its goal appears scaffolded and is absent from the root binding table; no root resource map exists. Review the 065 runner only as an interface reference, not as target implementation.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

resource-map.md not present; skipping coverage gate.

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
| .claude/settings.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .codex/config.toml | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .devin/hooks.v1.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/decision-capture.js | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .opencode/plugins/tests/decision-capture.test.cjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .pi/settings.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/commands/speckit/save.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/README.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/coverage-rationale.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/.skilled/logs/cli-dispatch-audit.log | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.jsonl | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/claude-chat-questions.labels.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/codex-chat-rollout.jsonl | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/codex-request-user-input.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/devin-chat-session.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/opencode-chat-session.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/opencode-question-parts.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/opencode-session-message.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/pi-ask-user-question.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/fixtures/pi-chat-session.jsonl | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-codex.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-devin.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-opencode.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-pi.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-transcript.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/claude/fixtures/claude-posttooluse-askuserquestion.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/devin/fixtures/devin-posttooluse-ask-user-question.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/lib/capture-core.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/lib/capture-core.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/lib/chat-questions.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/lib/chat-questions.test.mjs | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/pi/decision-capture.test.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/hooks/decision-capture/pi/decision-capture.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-kill-switch-conversation.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-sibling-reproof-conversation.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-transcript-sweeps.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/api/index.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/match-decision-table.vitest.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/001-decision-capture-build/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/002-table-row-matching/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/003-codex-and-pi-capture/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/004-opencode-devin-live-capture/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/005-chat-question-detection/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/006-live-conversation-test/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/acceptance-criteria.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/implementation-summary.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/plan.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/007-gap-closure/tasks.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/decision-record.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/goal.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/handover.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/open-questions.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |
| specs/system-speckit/043-decision-capture/spec.md | [] | — | 0 P0, 0 P1, 0 P2 | pending |

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-luna-1793649602423-v8rh6g, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-02T20:05:07Z
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
