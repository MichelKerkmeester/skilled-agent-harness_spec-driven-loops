---
title: "Feature Specification: Packaging and Activation Fixes"
description: "Make communication projection build on install, ship its operator entry points, and provide a loader-valid LM Studio example."
trigger_phrases:
  - "packaging-and-activation-fixes"
  - "communication projection packaging"
  - "LM Studio enablement example"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/032-packaging-and-activation-fixes"
    last_updated_at: "2026-08-15T09:15:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the packaging and activation fixes."
    next_safe_action: "Use the shipped install and LM Studio activation path."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-032-packaging-and-activation-fixes-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The existing lmstudio kind is the correct loader route for LM Studio."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Packaging and Activation Fixes

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

This phase makes the communication projection package usable after plain install and from its packed artifact. The package lifecycle builds ignored runtime output, the tarball includes the wrapper and enablement example, and the example is one real LM Studio configuration that resolves to the request endpoint used by the local transport.

**Key decision**: keep build activation in the package lifecycle and provider resolution in the existing loader.

**Critical dependency**: the existing TypeScript build, local provider loader, release rehearsal, and exact-original safety suite.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `031-improvement-research` |
| **Handoff Criteria** | Install builds `dist/`, packed artifacts contain the wrapper and example, the LM Studio example parses into a usable local projection config, `npm run check` passes, and strict packet validation has zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

Phase 031 verified that ignored build output, an incomplete package allowlist, and a decorative LM Studio example blocked reliable activation. This build phase implements only those P1 package findings.

**Scope boundary**: package lifecycle and packed files, the committed example, narrow LM Studio endpoint resolution, focused tests, and this packet.

**Dependencies**:

- The existing `npm run build` TypeScript output
- The existing `lmstudio` provider kind and local-only privacy route
- The existing release rehearsal that packs and clean-installs the tarball

**Deliverables**:

- Install-built `dist/` output
- Shipped wrapper and enablement example
- A loader-valid LM Studio example
- Focused config and tarball tests
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The communication projection entry points depend on ignored build output. A fresh install has no lifecycle build hook, and the package allowlist excludes the wrapper and local enablement example. The example also contains a decorative LM Studio block that the loader ignores. These gaps make activation unreliable outside an already-built monorepo checkout. [SOURCE: `../../../../../.opencode/skills/sk-communication/cli-communication-projection/package.json`, `enablement.local.json.example`, and Phase 031 findings F001, F002, F006, F030, F031, and F033]

The purpose of this phase is to make install, packing, and LM Studio activation coherent without changing canonical data, privacy routing, or exact-original fallback behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add a package lifecycle hook that builds `dist/` during install.
- Include `bin/` and `enablement.local.json.example` in the packed artifact.
- Publish the wrapper through the package `bin` map.
- Replace the decorative LM Studio block with one loader-owned `localProvider` block.
- Normalize the documented LM Studio `/v1` base URL to the OpenAI chat-completions route.
- Add focused loader and packed-artifact tests.

### Out of Scope

- Changes to the outer `.opencode/package.json` or lockfile.
- Changes to the OpenCode plugin, provider privacy policy, canonical bytes, or hosted routing.
- Documentation or skill-router findings outside the three requested P1 items.

### Files to Change

| File Path | Change |
|-----------|--------|
| Package `package.json` | Add `prepare`, packed files, and wrapper bin mapping |
| `enablement.local.json.example` | Make LM Studio the real local provider example |
| `src/config/local-provider.ts` | Resolve the LM Studio API base to the request endpoint |
| Package tests | Verify example parsing, fail-closed behavior, and packed contents |
| This packet | Record scope, evidence, and closeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve projection safety invariants. | Disabled, absent, malformed, or failed configuration still yields null or exact-original behavior, with no hosted call added. |
| REQ-002 | Pass the package hard gate. | `npm run check` completes with typecheck, build, all tests, and import smoke at zero failures. |

### P1 Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Build ignored output during install. | `prepare` runs the existing build and a package install produces `dist/index.js`. |
| REQ-004 | Ship operator entry points. | The packed artifact includes `bin/cli-output-wrapper.mjs` and `enablement.local.json.example`, with a package bin mapping for the wrapper. |
| REQ-005 | Make the LM Studio example executable configuration. | The example contains one enabled `localProvider` using `kind: lmstudio`, a model, and `http://localhost:1234/v1`, and parsing yields a valid local config targeting chat completions. |
| REQ-006 | Preserve fail-closed parsing. | Focused tests cover absent and malformed configuration without weakening existing tests. |
| REQ-007 | Keep packed contents bounded. | The tarball excludes package source, tests, and dependencies beyond the existing allowlist policy. |
| REQ-008 | Avoid duplicate runtime authorities. | The wrapper stays unchanged and no second provider kind or launcher-side config parser is added. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `npm install` runs the package build and produces `dist/index.js`.
- `npm pack --json` reports the wrapper and enablement example in the tarball.
- The shipped example parses through `parseLocalProjectionConfig()` and creates a local-offline LM Studio provider record.
- Absent and malformed configuration continue to return null without throwing.
- `npm run check` reports 0 failed.
- `validate.sh --strict` reports zero errors and zero warnings for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| A base API URL is sent as a request URL | LM Studio activation fails | Normalize only the LM Studio `/v1` base to `/v1/chat/completions` and test the resulting record |
| Package packing omits operator files | Consumers cannot activate the wrapper | Assert the real `npm pack` file list |
| Lifecycle scripts recurse or use a different build | Install becomes unreliable | `prepare` calls only the existing `npm run build` script |
| Loader changes weaken fallback behavior | Unsafe projection becomes possible | Keep validation unchanged and retain absent and malformed negative tests |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Canonical bytes remain unchanged.
- Every disabled, unsafe, failed, or unconfigured path keeps exact-original behavior.
- Local provider configuration remains local-only and adds no credential or hosted fallback.
- Package contents remain limited to built output, docs, the wrapper, and the enablement example.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Missing `dist/` before install is repaired by `prepare`.
- A malformed or absent config returns null without a throw.
- An LM Studio `/v1/` endpoint receives the same normalization as `/v1`.
- An explicit `/v1/chat/completions` endpoint remains unchanged.
- A non-loopback endpoint retains the existing local-networked privacy classification.
- A synthetic prebuilt downgrade package skips lifecycle scripts because it contains no source compiler inputs.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 10/25 | One package manifest, one config example, one loader helper, and focused tests |
| Risk | 16/25 | Runtime activation and privacy-preserving fallback behavior |
| Research | 10/20 | Findings were already verified in Phase 031 |
| Multi-Agent | 2/15 | Single implementation session |
| Coordination | 8/15 | Package, loader, tests, and Level 3 closeout |
| **Total** | **46/100** | **Level 3 due to activation and privacy risk** |
<!-- /ANCHOR:complexity -->

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Install does not create runtime output | High | Low | `prepare` delegates to the tested build and install proof checks `dist/index.js` |
| R-002 | Packed consumers miss operator files | High | Low | Real tarball file-list assertions |
| R-003 | LM Studio posts to the API base instead of chat completions | High | Low | Loader normalization and focused example test |
| R-004 | Config handling weakens fail-closed behavior | High | Low | Existing negative matrix and full package gate |

## 11. USER STORIES

### US-001: Install and activate (Priority: P1)

**As a** package operator, **I want** plain install to build the runtime and ship the wrapper, **so that** activation does not depend on monorepo-only output.

**Acceptance Criteria**:

1. **Given** absent build output, **When** `npm install` runs, **Then** `dist/index.js` exists.
2. **Given** a packed artifact, **When** its file list is inspected, **Then** the wrapper and enablement example are present.

### US-002: Copy the LM Studio example (Priority: P1)

**As a** local model operator, **I want** the shipped example to be the real loader config, **so that** copying it activates LM Studio without translating a decorative block.

**Acceptance Criteria**:

1. **Given** the shipped example, **When** the loader parses it, **Then** it returns local-offline projection wiring targeting chat completions.

## 12. OPEN QUESTIONS

No unresolved question blocks implementation. The existing `lmstudio` kind is authoritative, and the wrapper remains dependent on install-built output rather than duplicating loader logic in the launcher.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Research Source**: `../031-improvement-research/research/research.md`
