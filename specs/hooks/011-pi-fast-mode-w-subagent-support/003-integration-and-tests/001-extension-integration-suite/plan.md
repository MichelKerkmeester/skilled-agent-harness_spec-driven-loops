---
title: "Implementation Plan: Phase 1 extension-integration-suite"
description: "Extend deterministic FakePi coverage across config, lifecycle, status, handoff, and command registration."
trigger_phrases:
  - "extension-integration-suite plan"
  - "FakePi integration tests"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Planned deterministic integration suite"
    next_safe_action: "Map observable boundaries and extend the fake"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Phase 1 extension-integration-suite

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Pi Extension API fake |
| **Storage** | Temporary config directories |
| **Testing** | Vitest and `tsc --noEmit` |

### Overview
Mirror the upstream structural FakePi: capture registrations and invoke handlers directly. Add cross-boundary cases for config compatibility, model selection, status updates, handoff lifecycle, and command registration, then run the full suite.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Earlier package and handoff children define production boundaries.
- [x] Research names the FakePi and layered testing approach.

### Definition of Done
- [ ] Cross-boundary cases pass.
- [ ] Full Vitest and typecheck pass.
- [ ] No settings/npm mutation occurs.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Observable structural fake, not a full runtime mock.

### Key Components
- Fake registration maps for commands, flags, hooks, and status calls.
- Temporary directories for config/migration fixtures.
- Assertions over returned payloads and registered command names.

### Data Flow
Extension factory → fake registrations → lifecycle invocation → observable state/status/payload assertions.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory upstream tests and identify missing cross-boundary rows.
- [ ] Define temporary directory cleanup and model fixtures.

### Phase 2: Core Implementation
- [ ] Extend the FakePi and config fixture helpers.
- [ ] Add model selection, status, handoff, and command registration cases.

### Phase 3: Verification
- [ ] Run focused suites, then full Vitest and typecheck.
- [ ] Capture a clean settings/npm status proving no install mutation.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Pattern Citation
Mirror the upstream structural FakePi exactly as `context/pi-openai-fast-mode/tests/extension.test.ts` does: spy on registration methods (`registerFlag`, `registerCommand`, `getFlag`, `on`) with `vi.fn()`, capture event handlers in a `Map<event, Function[]>`, capture registered commands in a `Map<string, RegisteredCommand>`, fabricate a context with `cwd`/`model` via a `makeCtx` helper, and invoke handlers directly. Do NOT mock the whole Pi module — the fake is a plain structural object passed to the extension factory. [SOURCE: `context/pi-openai-fast-mode/tests/extension.test.ts:13-79`; research.md §10 items 1-3 and 5]

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Existing commands/config/payload/status | Vitest |
| Integration | Lifecycle and registration boundaries | Vitest structural FakePi |
| Static | No-emit and scope boundary | `tsc`, `git status` |

### In-Process vs Live-Only Boundary
This leaf draws an explicit boundary between what the structural FakePi proves in-process and what stays live-only:

- **In-process (proven here):** registration of the `fast` command and `fast` flag; `session_start`/`model_select`/`session_shutdown` ordering; config scope resolution plus the one-time legacy migration; cloned-payload `service_tier` semantics; namespaced `setStatus` calls; handoff-state application on a supported model.
- **Live-only (NOT proven here; owned by `002-install-transition/` and `003-live-verification-and-sync/`):** real command-suffix renumbering after removing an earlier extension, live RPC/TUI rendering, and real child-process spawn.
- **Helper exposure:** this leaf exports the command-ownership helper the live probe consumes, so ownership can be re-asserted against real `get_commands` output after install.

### Affected Surfaces

| Surface | Path (fork-relative) | Change Type |
|---------|----------------------|-------------|
| Cross-boundary test suite | `tests/integration.test.ts` (split into `tests/lifecycle.test.ts` and `tests/config-migration.test.ts` where clearer) | Create |
| Structural FakePi fixture | `tests/helpers/fake-pi.ts` | Create |
| Command-ownership helper | `tests/helpers/command-ownership.ts` (exported for the live probe) | Create |
| Static/test gate | `npm run typecheck` (`tsc --noEmit`) + `npm test` (full Vitest) | Run/verify |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fork/package children | Internal | Green | No completed extension to test |
| Handoff children | Internal | Green | No lifecycle contract to test |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: FakePi becomes a second implementation or tests fail outside the intended boundary.
- **Procedure**: Revert only test harness additions and keep earlier production children unchanged.
<!-- /ANCHOR:rollback -->
