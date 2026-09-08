---
title: "Pi Subagent Directive Removal"
description: "Remove the pi-subagents package mandate from the Pi runtime: drop the per-turn dispatch directive injected by prompt-advisor.ts, retire its compact-prototype shadow machinery, update the enforcement hook's dead marker and reason text, and align the injection contract and .pi runtime docs."
trigger_phrases:
  - "pi subagent directive removal"
  - "remove subagent dispatch directive"
  - "pi-subagents package removal"
  - "drop the injected dispatch mandate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/011-pi-subagent-directive-removal"
    last_updated_at: "2026-09-08T09:30:00Z"
    last_updated_by: "pi-helper"
    recent_action: "Removed the pi-subagents dispatch directive and shadow machinery after the package was uninstalled from the runtime config"
    next_safe_action: "Confirm the working tree diff and commit the removal packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts"
      - ".opencode/hooks/dispatch/pi/directive-dedup.test.ts"
      - ".opencode/hooks/injection-contract.md"
      - ".pi/PLUGINS.md"
      - ".pi/SYNC.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-hook-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the dispatch enforcement hook stay? Yes — it remains a raw-user authorization guard at the tool-call boundary and is required for cli-* dispatch safety; only its dead directive marker and stale reason text were removed."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Pi Subagent Directive Removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 11 |
| **Predecessor** | 010-cross-runtime-coverage-and-verification |
| **Successor** | None planned |
| **Handoff Criteria** | The per-turn dispatch directive is no longer emitted, the compact shadow machinery is gone, all three test suites pass, and the injection contract plus `.pi` runtime docs no longer reference the removed package mandate. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 injected a Pi-only per-turn directive mandating the native pi-subagents plugin for subagent delegation, and phase 006 added tool-call enforcement of the same policy. The package was then removed from the runtime config entirely (see the operator-side package removal preceding this phase). The directive kept mandating a plugin that no longer exists: `prompt-advisor.ts` still injected the 554-byte `PI_SUBAGENT_DISPATCH_DIRECTIVE` on every input turn, its compact-prototype shadow machinery kept observing a directive that is never emitted, and the enforcement hook still stripped a marker line that no longer appears in the prompt.

### Purpose
Remove the dead dispatch mandate end to end without touching the shared advisor bridge, the raw-user capture used for dispatch authorization, or the independent tool-call deny guard.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Drop `PI_SUBAGENT_DISPATCH_DIRECTIVE` and `PI_COMPACT_SUBAGENT_DISPATCH_DIRECTIVE`, their byte-count exports, the prototype flag, the delivery-state receipts, the policy-plan observation sink, and the lifetime handlers' shadow resets from `prompt-advisor.ts`.
- Keep and re-scope the Pi-local advisor-brief de-duplication (it dedups the shared advisor brief, not the removed directive) and the advisor-debug opt-in line.
- Remove the enforcement hook's `DIRECTIVE_MARKER` stripping and the stale "native subagent tool" reason suffix.
- Update `injection-contract.md`, `.pi/PLUGINS.md`, and `.pi/SYNC.md` to stop asserting the removed package mandate.
- Update the two test suites that asserted the directive content and the shadow receipts.

### Out of Scope
- The dispatch enforcement hook itself (`shouldDenyPiDispatch`) — it stays as the raw-user authorization guard.
- The cli-pi skill packet references and the manual-testing-playbook PI-009 scenario that document the community package — those remain as third-party documentation rather than runtime configuration.
- The shared advisor renderer and its directive lifecycle — untouched.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:changes -->
## 4. CHANGES

| File | Change |
|---|---|
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Remove the dispatch directive constants, the compact prototype flag + shadow receipts + policy-plan machinery, and the directive append; keep the advisor bridge, raw capture, brief de-dup, advisor-debug |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Remove `DIRECTIVE_MARKER` from transform recognition and injected-content stripping; drop the "use the native subagent tool" clause from the deny reason |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Remove the compact semantic/suites and directive-content assertions; keep the deny matrix and boundary authorization tests |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts` | Replace the directive-append test with a no-context no-transform test |
| `.opencode/hooks/injection-contract.md` | Replace the Pi-only directive ownership bullet with the forwarder-only statement |
| `.pi/PLUGINS.md` | Remove the `pi-subagents (v0.50.0)` plugin entry |
| `.pi/SYNC.md` | Record that the agent-discovery package is no longer installed |

### Tests
| Suite | Command | Result |
|---|---|---|
| Dispatch preflight | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | 32/32 |
| Directive de-dup | `npx vitest run .opencode/hooks/dispatch/pi/directive-dedup.test.ts` | 14/14 |
| Prompt advisor | `npx vitest run .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts` | 3/3 |
<!-- /ANCHOR:changes -->

---

## RELATED DOCUMENTS

- **Phase children**: none (terminating phase)
- **Parent history**: packets `003-pi-directive-capsule`, `004-pi-directive-enforcement`, `009-injection-contract-directive-sync`, `010-cross-runtime-coverage-and-verification`
