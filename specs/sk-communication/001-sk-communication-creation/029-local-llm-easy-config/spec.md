---
title: "Feature Specification: Phase 029 Local LLM Easy Config"
description: "Research and design the simplest possible operator experience for configuring a local LLM (LM Studio or Ollama endpoint) so the communication projection automatically activates and uses that model after a minimal one-time setup, with no further steps."
trigger_phrases:
  - "local-llm-easy-config"
  - "local LLM easy configuration"
  - "automatic projection activation"
  - "LM Studio projection setup"
  - "Ollama projection endpoint"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/029-local-llm-easy-config"
    last_updated_at: "2026-08-14T17:10:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Accepted the GROK research synthesis and closed the research phase"
    next_safe_action: "Open a build phase to implement the localProvider loader and wire the two call sites"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-029-local-llm-easy-config-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined: a research-only phase that delivers a ranked design recommendation, never runtime code."
      - "The GROK 4.6 lineage completed 5/5 iterations and produced the accepted ranked recommendation in research/research.md."
      - "The GLM 5.2 MAX leg failed without output; both lineages were containment-reverted over .pi/settings.json, and the operator accepted the single-model synthesis without another cross-check."
      - "The shipped reject-only judge accepts candidates at 0.5 or greater token coverage; the current no-op is caused by empty glue."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 029 Local LLM Easy Config

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This research phase designs the simplest possible way for a person to configure their own local LLM, such as an LM Studio or Ollama endpoint, so that the communication projection automatically activates and uses that model after a minimal one-time setup, with no further steps. Today the projection engine cannot use any local model through the shipped entry points: the OpenCode plugin hands `projectMessage` an empty provider config (`candidateProviderIds: []`, `judgeMode: 'disabled'`, empty policy), and no shipped entry point is pre-wired with a provider, although a concrete HTTP transport and OpenAI-compatible plus Ollama adapters already exist. The research corrected the original judge premise: the shipped reject-only judge accepts candidates at 0.5 or greater token coverage. The no-op is empty config-and-glue, not an always-reject judge or a missing network layer.

**Key decision**: this is a research-only phase. It investigates and ranks the operator UX and the activation seam, and the deliverable is a ranked design recommendation produced by a deep-research loop, not runtime code.

**Critical dependency**: the shipped projection engine surfaces this phase designs against — the OpenCode plugin at `.opencode/plugins/mk-communication-projection.js`, the wrapper at `bin/cli-output-wrapper.mjs`, the HTTP transport at `src/transports/http.ts`, the provider adapters at `src/providers/adapters.ts`, and the reject-only judge at `src/fidelity/reject-only-judge.ts`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 29 (research child appended after Phase 028) |
| **Predecessor** | `028-wiring-docs-and-operator-rollout` |
| **Successor** | Parent-packet decision; a later build phase implements the chosen recommendation |
| **Handoff Criteria** | The deep-research loop produces `research/research.md` containing a validated, ranked design recommendation for the easy-config plus automatic-use UX, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This completed research phase designs how a person configures their own local LLM for the communication projection. The engine already has the network and adapter layer: `src/transports/http.ts` provides local, hosted, and default provider transports, and `src/providers/adapters.ts` maps OpenAI-compatible and Ollama wire formats. What does not exist is the config-and-glue: no shipped entry point discovers a provider configuration and auto-constructs a local endpoint. The shipped reject-only judge already accepts candidates at 0.5 or greater token coverage.

**Scope boundary**: research and design only. This phase authors the research plan and later the research findings; it changes no shipped runtime, plugin, wrapper, transport, adapter, or judge. The actual build is a later phase.

**Dependencies**:

- The shipped OpenCode plugin at `.opencode/plugins/mk-communication-projection.js`, which today passes `projectMessage` an empty provider config
- The wrapper library and entry point at `src/wrapper/run.ts` and `bin/cli-output-wrapper.mjs`, where projection config is caller-supplied
- The HTTP transport at `src/transports/http.ts` and the provider adapters at `src/providers/adapters.ts`, which already support local OpenAI-compatible and Ollama endpoints
- The reject-only meaning judge at `src/fidelity/reject-only-judge.ts`, which today only adds rejections
- The `/deep:research` loop mechanics used to produce the ranked recommendation

**Deliverables**:

- A research plan recording the design question, the grounding gaps, the scope, and the fixed deep-research method
- A ranked design recommendation for the easy-config plus automatic-use UX, written by the deep-research loop into `research/research.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Research Question

Design the simplest possible way for a person to configure their own local LLM, for example an LM Studio or Ollama endpoint, for the communication projection, such that after a minimal one-time setup the projection AUTOMATICALLY activates and uses that model as expected, with no further steps.

### Grounding: The Real Current Gaps

The shipped code already contains the engine, the transport, and the adapters, but no activation path exists for a local model. The four concrete gaps this research must solve:

1. The OpenCode plugin at `.opencode/plugins/mk-communication-projection.js:256-258` hands `projectMessage` an empty provider config — `candidateProviderIds: []`, `judgeMode: 'disabled'`, and an empty `policy` (frozen empty `providerControlMappings` at `.opencode/plugins/mk-communication-projection.js:59`) — so it is a guaranteed no-op today.
2. The default judge is reject-only (`src/fidelity/reject-only-judge.ts`; composed when `judgeMode` is `required` at `src/runtime/project-message.ts:192`), but the research confirmed it accepts candidates at 0.5 or greater token coverage. The current no-op comes from empty provider, policy, prompt, and judge-mode glue.
3. No shipped entry point — the plugin or `bin/cli-output-wrapper.mjs` — is pre-wired with a provider; the wrapper library accepts a transport, but `bin/cli-output-wrapper.mjs:107` records that projection config (context, provider, policy) is caller-supplied.
4. A concrete HTTP transport (`src/transports/http.ts` exposes `createLocalHttpTransport`, `createHostedHttpTransport`, and `createDefaultProviderTransport`) and OpenAI-compatible plus Ollama adapters (`src/providers/adapters.ts`) DO exist, so the engine can call a local endpoint once wired — the gap is the config-and-glue, not the network layer.

### Purpose

Produce a validated, ranked design recommendation that specifies the operator UX and the activation seam for local LLM easy-config: config-file and environment-variable discovery, provider auto-construction, a judge default that permits local accepts without weakening the reject-only safety contract, privacy defaults that keep traffic local-only, and how the plugin and wrapper automatically pick up the configured provider with no further operator steps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Research and design the operator UX for local LLM easy-config: what a person writes, where it lives, and how little of it is needed for a minimal one-time setup.
- Design the activation seam: configuration file and environment-variable discovery, precedence, and provider auto-construction from a discovered local endpoint.
- Design a judge default that permits accepts locally while preserving the reject-only safety contract for hosted projection.
- Design privacy defaults for local-only traffic, including the boundary that must never route local-classified content to a hosted endpoint without explicit consent.
- Design how the shipped entry points (the OpenCode plugin and the CLI-output wrapper) automatically pick up the configured provider with no further steps.
- Record the fixed research method: a deep-research loop of 10 iterations with no early convergence, split 5 iterations GROK 4.6 via cli-cursor then 5 iterations GLM 5.2 MAX via cli-devin, writing `research/research.md`.

### Out of Scope

- The actual build or implementation of the chosen design, which is a later phase.
- Changing any shipped runtime now: the plugin, the wrapper, the transport, the adapters, the judge, or any canonical behavior.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Configuring, installing, or wiring a specific local LLM during this phase.
- Any hosted provider configuration or remote egress of message content.

### Technical Approach

Run the recorded deep-research loop against the shipped code as the ground truth, rank the candidate easy-config and activation-seam designs against the four grounding gaps, and deliver a validated, ranked design recommendation in `research/research.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Research-phase specification, scope, and acceptance contract |
| `plan.md` | Create | Recorded deep-research method and research design |
| `tasks.md` | Create | Execution and evidence tracking for the research loop |
| `checklist.md` | Create | Level-2 verification contract for the planned phase |
| `research/research.md` | Workflow-generated | Ranked design recommendation produced by the deep-research loop; NOT authored in this planning step |
| `029-local-llm-easy-config/` | Create | Record the planned Level-2 research packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | State the research question and the grounding gaps. | The spec names the easy-config plus auto-use research question and pins each of the four shipped gaps to the exact code surface: empty plugin provider config, reject-only default judge, no pre-wired entry point, and the existing transport and adapters. |
| REQ-002 | Record the research method and actual outcome. | The plan records the intended 5/5 executor split and the observed outcome: the GROK 4.6 lineage completed 5/5 iterations, the GLM 5.2 MAX leg failed without output, both lineages were containment-reverted over `.pi/settings.json`, and the operator accepted the GROK synthesis. |
| REQ-003 | Design the config surface. | The recommendation ranks a config file and environment-variable discovery scheme whose precedence is explicit and whose minimal one-time setup leaves no further operator steps. |
| REQ-004 | Design provider auto-construction. | The recommendation specifies how a discovered local endpoint auto-constructs the provider used by the plugin and the wrapper, including LM Studio and Ollama OpenAI-compatible cases. |
| REQ-005 | Design a judge default that permits local accepts. | The recommendation uses `judgeMode: 'required'` with the shipped reject-only judge, which accepts at 0.5 or greater token coverage while preserving deterministic rejection behavior. |
| REQ-006 | Design local-only privacy defaults. | The recommendation keeps local-classified content on the local endpoint by default and never cascades it to a hosted service without explicit consent. |
| REQ-007 | Rank the design options. | The recommendation is ranked with named trade-offs and a clear first choice, grounded in the shipped code. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Keep the phase research-only. | No shipped runtime, plugin, wrapper, transport, adapter, or judge is changed by this phase; only the planned packet docs and the loop-produced `research/research.md` are written. |
| REQ-009 | Record execution honestly. | The packet records that 5/5 GROK iterations synthesized, the GLM leg failed without output, both lineages were containment-reverted over `.pi/settings.json`, and the operator accepted the single-model result. |
| REQ-010 | Prove the acceptance condition. | The phase completes when the operator-accepted GROK synthesis exists at `research/research.md` as the ranked design recommendation and the packet passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The spec and plan name the easy-config plus auto-use research question and pin all four grounding gaps to the shipped code.
- **SC-002**: The plan records the intended executor split and the actual partial outcome without claiming a successful GLM leg.
- **SC-003**: `research/research.md` contains a validated, ranked design recommendation covering config discovery, provider auto-construction, a local-permissive judge default, local-only privacy defaults, and automatic pickup by the plugin and wrapper.
- **SC-004**: The recommendation explicitly ranks options with trade-offs and names a first choice grounded in the shipped code.
- **SC-005**: Phase 029 passes strict validation with `Errors: 0  Warnings: 0` from the final state.

### Acceptance Scenarios

1. **Given** the partial deep-research outcome, **When** the operator reviews the completed GROK synthesis and failed GLM leg, **Then** the operator may accept the single-model synthesis as the phase deliverable with the divergence recorded honestly.
2. **Given** the shipped plugin, **When** the recommendation is applied in a later phase, **Then** the empty-provider no-op gap is the design target, not an open question.
3. **Given** the default judge, **When** the recommendation is applied in a later phase, **Then** a good local rewrite can be accepted while hosted projection stays reject-only.
4. **Given** the existing transport and adapters, **When** the recommendation is applied in a later phase, **Then** a discovered LM Studio or Ollama endpoint auto-constructs the provider with no further operator steps.
5. **Given** the completed research, **When** the packet is validated, **Then** `research/research.md` exists with a ranked recommendation and strict validation reports zero errors and warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The deep-research loop executors (GROK 4.6 via cli-cursor, GLM 5.2 MAX via cli-devin) | High | The GROK lineage completed; the GLM leg failed without output, and the operator explicitly accepted the single-model result without another cross-check |
| Dependency | The shipped engine surfaces the design targets | High | Research against the exact plugin, wrapper, transport, adapter, and judge paths, never against assumed APIs |
| Risk | The recommendation drifts from the reject-only safety contract | High | The local-permissive judge default must be designed as a default that preserves reject-only guarantees for hosted projection |
| Risk | Privacy defaults weaken and route local content to hosted services | High | Local-only privacy defaults are a named design requirement and never default to remote egress |
| Risk | The research claims auto-use without proving the activation seam | High | The ranked recommendation must map each activation step to a shipped surface the later build phase can consume |
| Risk | The loop converges early or skips iterations | High | The method fixes exactly 10 iterations with no early convergence, and the checklist verifies iteration counts per executor |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The recommended config surface adds no runtime latency: discovery and auto-construction happen once at activation, not per message.
- **NFR-P02**: Local-only projection keeps the rewrite round-trip on the local endpoint and bounds latency to the local model's own response time.

### Security and Privacy

- **NFR-S01**: The recommendation keeps local-classified content local by default and requires explicit consent before any hosted fallback.
- **NFR-S02**: The packet and the loop-produced research contain no credentials, message content, or protected spans; configuration design covers how credentials and endpoints are stored without being logged.

### Reliability

- **NFR-R01**: Auto-activation is deterministic: given the same config surface, the plugin and wrapper resolve the same provider and fail closed to exact-original output when no provider can be constructed.
- **NFR-R02**: A missing or malformed local config never breaks canonical output; the projection stays off and original-only until a valid provider is discovered.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- No config present: the projection stays a no-op and the exact original is rendered.
- LM Studio and Ollama both configured: precedence and merge behavior must be explicit.
- The local endpoint is down or slow: the projection must fail closed to the exact original, never hang or emit a partial rewrite.
- The judge is locally permissive but the local model returns a poor rewrite: deterministic fidelity validators still reject and fall back to the original.
- A hosted provider config appears alongside a local one: local-only privacy defaults must prevent accidental hosted routing of local-classified content.
- The plugin and the wrapper disagree on config: the shared discovery scheme must resolve to one provider.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Operator UX plus an activation seam across two entry points |
| Risk | 16/25 | Reject-only safety and local-only privacy must survive an easy default |
| Research | 18/20 | Ten forced-depth iterations across two executors plus shipped-code grounding |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Extend the git-ignored `enablement.local.json` with `localProvider: { kind, model, endpoint? }` while retaining environment force-on and force-off precedence.
- Use `judgeMode: 'required'` with the shipped reject-only judge, which accepts at 0.5 or greater token coverage.
- Require `enabled: true` plus a valid `localProvider`; missing or malformed config fails closed to the exact original.

These questions are answered by the operator-accepted synthesis in `research/research.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
- **Predecessor**: `../028-wiring-docs-and-operator-rollout/spec.md`
