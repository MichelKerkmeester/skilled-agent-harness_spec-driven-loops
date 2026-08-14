---
title: "Feature Specification: Phase 030 Local Provider Loader"
description: "Add a shared local-provider config loader that turns the operator's enablement.local.json localProvider block into the full projection wiring (a local ProviderModelRecord, a local-only privacy policy, judgeMode required, a concrete local HTTP transport, and a shipped copy-editing prompt), and wire both entry points so a configured local provider projects automatically while any absent or malformed config fails closed to the exact original."
trigger_phrases:
  - "local-provider-loader"
  - "local provider loader"
  - "enablement.local.json localProvider"
  - "local LLM easy config build"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/030-local-provider-loader"
    last_updated_at: "2026-08-14T18:42:57.776Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the shared local-provider loader and both entry-point wirings."
    next_safe_action: "Consume the loader from operator rollout documentation when the opt-in story is written."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-030-local-provider-loader-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The Phase 029 research first choice is the shared loader consumed by the OpenCode plugin and the CLI-output wrapper bin."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 030 Local Provider Loader

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The communication projection already ships everything needed to call a local model: `createLocalHttpTransport`, the OpenAI-compatible and Ollama-native adapters, and `createOllamaModelRecord` / `createLlamaCppModelRecord`. What is missing is config-and-glue: after a person opts in, no shipped entry point discovers a provider or constructs the `projectMessage` input, so the projection never uses a local model. This phase ships one shared loader under `src/config/` that reads the operator's existing git-ignored `enablement.local.json` and turns its optional `localProvider` object into the full projection wiring: a local `ProviderModelRecord` built from the shipped presets, a local-only privacy policy, `judgeMode: 'required'`, a concrete local HTTP transport pointed at the configured endpoint, and a shipped copy-editing prompt. The OpenCode plugin's input builder and `bin/cli-output-wrapper.mjs` both call that loader, so after the one-time file write the projection activates automatically. Missing or malformed provider config fails closed: the exact-original fallback stays byte-identical to today.

**Key decision**: one shared loader consumed by both entry points, reusing the shipped presets, privacy router, transports, and reject-only judge rather than inventing a new provider path.

**Critical dependency**: the Phase 029 research design (`029-local-llm-easy-config/research/research.md`), the shipped projection engine (`src/config/`, `src/providers/presets.ts`, `src/privacy/`, `src/transports/http.ts`, `src/runtime/project-message.ts`), and the two entry points this phase wires (`.opencode/plugins/mk-communication-projection.js` and `bin/cli-output-wrapper.mjs`).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `sk-communication/0152-local-provider-build` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 30 of 28 |
| **Predecessor** | `029-local-llm-easy-config` |
| **Successor** | none (terminal build phase) |
| **Handoff Criteria** | A shared loader parses `enablement.local.json` and returns the full projection wiring or null on any absent or malformed input. Both the OpenCode plugin and the CLI-output wrapper bin call the loader and project when it returns a config. The null path keeps today's exact-original fallback byte-identical. `npm run check` ends fully green, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This build phase implements the first-choice design of the Phase 029 deep research on easy local-LLM configuration. The projection engine already contains every network and adapter primitive. The gap is that no entry point constructs the `projectMessage` input from an operator-provided local provider. This phase adds a shared loader and wires the two shipped entry points to it.

**Scope boundary**: The loader, the two entry points, the committed enablement example, and the package tests. Transports, adapters, presets, the reject-only judge, and the privacy router are consumed, never modified.

**Dependencies**:

- The Phase 029 research synthesis, which is the design source and first-choice authority
- The shipped projection engine: enablement config, provider presets, privacy router and policy types, HTTP transports, and the `projectMessage()` / `runWrapperProjection()` entrypoints
- The OpenCode plugin at `.opencode/plugins/mk-communication-projection.js` and the wrapper launcher at `bin/cli-output-wrapper.mjs`

**Deliverables**:

- A shared loader module under `src/config/` that parses the `localProvider` block and returns the full projection wiring or null (fail closed)
- Both entry points wired to the loader with the exact-original fallback preserved
- Focused tests: loader unit tests, a plugin/runtime projection test, and a wrapper test
- The extended committed enablement example and the closed Level-3 packet
- The follow-up user-facing `localProvider` documentation in `docs/enablement.md` and `docs/configuration.md`, delivered after the packet closed
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`createOllamaModelRecord`, `createLlamaCppModelRecord`, the OpenAI-compatible and Ollama-native adapters, and `createLocalHttpTransport` are all shipped and tested, but no entry point builds the `projectMessage` input from them. The OpenCode plugin passes `candidateProviderIds: []`, `judgeMode: 'disabled'`, an empty `policy`, and an empty `systemInstruction`. The wrapper bin records that projection config is caller-supplied and writes captured bytes through. Turning enablement on therefore no-ops both entry points. [SOURCE: `.opencode/plugins/mk-communication-projection.js:254-258` and `bin/cli-output-wrapper.mjs:106-115`]

### Purpose

After a person opts in once, a configured local provider must project automatically through both entry points, and any absent, malformed, unknown, or disabled provider config must fail closed to the byte-exact original exactly as today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend the `enablement.local.json` parsing surface with an optional `localProvider` object (`kind`, `model`, optional `endpoint`) while keeping the existing `enabled` behavior intact and backward-compatible.
- A shared loader under `src/config/` that, given the parsed config, returns the full projection wiring: a local `ProviderModelRecord` from the shipped presets, a local-only privacy policy (`egressConsent: false`, loopback-derived allow classes), `judgeMode: 'required'`, a concrete local HTTP transport, and a non-empty shipped copy-editing prompt.
- Fail-closed behavior: absent or malformed `localProvider` returns null so both entry points keep today's exact-original no-op and never throw into the session.
- Wiring the OpenCode plugin input builder and the CLI-output wrapper bin to the loader, with the null path keeping the exact-original fallback exactly as today.
- Tests: loader unit tests, a plugin/runtime projection test, a wrapper test, and plugin test-suite additions.
- Extending the committed `enablement.local.json.example` to document the optional `localProvider` block.

### Out of Scope

- Any change to transports, wire adapters, provider presets, the reject-only judge, or privacy router behavior.
- New providers, new judges, new adapters, or hosted defaults.
- Rank-2 environment-variable overlays (`COMMUNICATION_PROJECTION_LOCAL_*`) beyond v1.
- Changes to `docs/` other than the follow-up user-facing `localProvider` documentation in `docs/enablement.md` and `docs/configuration.md`, and no changes to other phases' folders.

### Technical Approach

Add `src/config/local-provider.ts` exporting `parseLocalProjectionConfig(parsed, options)` (pure, testable), `buildLocalProjectionConfig(provider, options)`, and `loadLocalProjectionConfig(options)` (reads the git-ignored file). The plugin's input builder and the wrapper bin call `loadLocalProjectionConfig()`. A non-null result supplies records, policy, judge, prompt, transport, context, and capabilities to the projection input. A null result leaves the exact-original fallback untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/config/local-provider.ts` | Create | Shared loader: parse, build, and load the local-provider projection wiring |
| `src/config/index.ts` | Modify | Re-export the loader from the package barrel |
| `enablement.local.json.example` | Modify | Document the optional `localProvider` block |
| `.opencode/plugins/mk-communication-projection.js` | Modify | Call the loader from the input builder |
| `bin/cli-output-wrapper.mjs` | Modify | Call the loader and project when configured |
| `test/config/local-provider.test.ts` | Create | Loader unit tests |
| `test/runtime/local-provider-runtime.test.ts` | Create | Plugin/runtime projection test |
| `test/wrapper/local-provider-wrapper.test.ts` | Create | Wrapper projection test |
| `.opencode/plugins/tests/mk-communication-projection.test.cjs` | Modify | Plugin loader-path test cases |
| `030-local-provider-loader/` | Create | Record the planned Level-3 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide a shared loader that turns a parsed `localProvider` into the full projection wiring. | `parseLocalProjectionConfig()` returns a config carrying records, candidateProviderIds, policy, judgeMode `required`, prompt, transport, context, and capabilities, with the record built from the shipped presets and the endpoint pointed at the configured value. |
| REQ-002 | Fail closed on absent or malformed provider config. | A missing `localProvider`, a non-`true` `enabled`, an unknown `kind`, a missing `model`, or an invalid `endpoint` yields null. The caller keeps the exact-original fallback and nothing throws into the session. |
| REQ-003 | Keep the existing enablement contract intact. | The `enabled` parsing and precedence in `src/config/enablement.ts` are unchanged. Env force-off still stops everything and the outer enablement gate still runs before projection. |
| REQ-004 | Keep privacy local-only. | The loader policy sets `egressConsent: false`, derives allowed privacy classes from the endpoint host, and the default judge is `required` with no accept-only override. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Wire the OpenCode plugin to the loader. | The plugin input builder calls the loader. A non-null result supplies the projection wiring (and a rewrite-without-context context). A null result keeps the exact-original fallback with empty provider config and the snapshot/restore, fail-open, and no-stdout-or-stderr behavior preserved. |
| REQ-006 | Wire the CLI-output wrapper bin to the loader. | The bin calls the loader after a successful parse and projects when a config is returned, otherwise passes the captured bytes through byte-exactly. |
| REQ-007 | Make the loader deterministic and testable. | The parse/build core is a pure function of the parsed file and injected options (now, transport), exhaustively testable without network access. |

### P2 - Optional

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Document the extended schema in the committed example. | `enablement.local.json.example` shows the optional `localProvider` block while staying disabled by default. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A valid `localProvider` block produces the full wiring (record family, policy, judge, prompt, transport) for every supported kind.
- **SC-002**: An absent or malformed `localProvider` yields null and both entry points emit the exact original byte-identically.
- **SC-003**: With a local provider configured, the OpenCode plugin and the wrapper project the rewritten text through the shared pipeline.
- **SC-004**: Privacy stays local-only: `egressConsent: false`, loopback-derived classes, and no hosted call on any local path.
- **SC-005**: `npm run check` ends fully green (typecheck + build + all tests + import smoke, 0 failed).

### Acceptance Scenarios

1. **Given** `enablement.local.json` with `enabled: true` and `localProvider: { kind: 'ollama', model: '...' }`, **When** the loader parses the file, **Then** it returns a config whose record is an Ollama local record, policy is local-only, judge is `required`, prompt is non-empty, and transport targets the default Ollama endpoint.
2. **Given** a file with `enabled: false` or a missing/malformed `localProvider`, **When** the loader parses it, **Then** it returns null and the entry point falls back to the exact original.
3. **Given** a configured local provider, **When** the OpenCode plugin handles a message, **Then** the rewritten text replaces the assistant parts and no stdout or stderr is written.
4. **Given** a configured local provider, **When** the wrapper bin captures and parses a stream, **Then** the projected text is written instead of the captured bytes.
5. **Given** the package suite, **When** `npm run check` runs from the final state, **Then** typecheck, build, all tests, and the import smoke pass with 0 failed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 029 research design | High | This build implements the research's first choice. The research is read end to end before implementation. |
| Risk | An entry point projects on unsafe provider config | High | REQ-002 and the loader's fail-closed parse keep any absent/malformed/disabled config at the exact original. |
| Risk | LM Studio naming maps to the wrong family | High | REQ-001 reuses the llama-cpp preset with a per-kind default endpoint. No new adapter is invented. |
| Risk | A capability-confirmed record is required for controls to compile | High | REQ-001 confirms prompt controls on the preset record through the shipped snapshot-merge path, matching the test-helper pattern. |
| Risk | The plugin seam has no transcript and would always fall back | High | REQ-005 switches the context fallback to rewrite-without-context only when the loader returns a config, keeping the null path byte-identical. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Discovery and construction run once per activation (per message for the plugin, per capture for the wrapper), not per token.
- **NFR-P02**: The loader is synchronous except for the projection pipeline it configures. No new network probe is added.

### Security and Privacy

- **NFR-S01**: Privacy routing runs before any provider call, and everything the loader builds is local (`deploymentMode: 'local'`, `egressConsent: false`).
- **NFR-S02**: The loader, its diagnostics, and the packet contain no credentials, message content, or protected spans. The configured endpoint is a URL, never a credential.

### Reliability

- **NFR-R01**: The loader fails closed: absent or malformed provider config returns null, never throws, and never degrades the exact-original fallback.
- **NFR-R02**: The parse/build core is deterministic given the parsed file and injected options.

## 8. EDGE CASES

- `enabled: true` with no `localProvider`: exact original.
- `enabled: false` with a valid `localProvider`: exact original (no projection).
- Unknown `kind`, missing `model`, or a non-URL `endpoint`: exact original.
- A non-loopback endpoint host: policy allows `local-networked` alongside `local-offline`. A loopback host allows `local-offline` only.
- A local endpoint that is down, slow, or truncated: existing provider/timeout paths return the exact original.
- A poor rewrite: deterministic validators plus the reject-only judge return the exact original.
- A hosted record present alongside the local easy config: the local-only policy with `egressConsent: false` denies it before any call.
- Plugin vs wrapper: both entry points call the same loader, so both resolve the same provider.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 18/25 | One loader module plus two entry-point wirings and a test matrix |
| Risk | 18/25 | Fail-closed default, privacy-before-call, and entry-point fallback preservation |
| Research | 16/20 | Grounding the loader against the shipped presets, router, transports, and judge |
| Multi-Agent | 6/15 | Single-session implementation with focused tests |
| Coordination | 12/15 | Explicit dependency on the Phase 029 design and the two entry points |
| **Total** | **70/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | An entry point projects on unsafe or malformed provider config | High | Low | Fail-closed parse and the exact-original fallback at both entry points |
| R-002 | LM Studio wires to the wrong family | High | Low | Per-kind default endpoints over the llama-cpp preset. No new adapter |
| R-003 | Controls cannot compile on a preset record | High | Low | Shipped snapshot-merge confirms the controls the shipped prompt relies on |
| R-004 | The no-transcript seam silently no-ops | High | Medium | Rewrite-without-context only on a non-null loader config. Null keeps exact-original |

## 11. USER STORIES

### US-001: Configure once, project automatically (Priority: P0)

**As a** CLI user with a local model, **I want** to write one `localProvider` block in the git-ignored enablement file, **so that** the OpenCode plugin and the CLI-output wrapper project my assistant output through the local model without further setup.

**Acceptance Criteria**:

1. **Given** `enabled: true` and a valid `localProvider` block, **When** either entry point activates, **Then** the local model projects the output.
2. **Given** any absent or malformed provider config, **When** either entry point activates, **Then** the output stays the byte-exact original.

### US-002: Local means private (Priority: P0)

**As a** privacy-conscious operator, **I want** the easy config to stay local-only, **so that** no content is ever egressed by the loader path.

**Acceptance Criteria**:

1. **Given** a local easy config, **When** projection runs, **Then** the policy has `egressConsent: false` and only local privacy classes are allowed.

### US-003: Same provider everywhere (Priority: P1)

**As an** operator, **I want** the plugin and the wrapper to use the same provider, **so that** behavior does not diverge between entry points.

**Acceptance Criteria**:

1. **Given** one `localProvider` block, **When** both entry points load it, **Then** both resolve the same record, policy, judge, prompt, and endpoint.

## 12. OPEN QUESTIONS

No unresolved question blocks implementation. The exact capability-expiry window the loader stamps and the prompt version string are recorded as loader constants, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Design Source**: `../029-local-llm-easy-config/research/research.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
