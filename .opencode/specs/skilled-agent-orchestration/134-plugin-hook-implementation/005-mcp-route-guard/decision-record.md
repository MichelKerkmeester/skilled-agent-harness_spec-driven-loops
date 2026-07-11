---
title: "Decision Record: External MCP Route Guard"
description: "Architectural decisions for the warn-first external MCP route guard: the shared-core-plus-two-adapters boundary and the advisory, fail-open posture with the manifest-strict vs broad fork."
trigger_phrases:
  - "mcp route guard adr"
  - "warn-only guard decision"
  - "shared core two adapters"
  - "manifest-strict vs broad"
  - "fail-open guard posture"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/005-mcp-route-guard"
    last_updated_at: "2026-07-11T06:21:17.709Z"
    last_updated_by: "spec-author"
    recent_action: "Authored ADR-001 (core plus two adapters) and ADR-002 (advisory fail-open posture)"
    next_safe_action: "Get an operator ruling on ADR-002 Option A vs Option B before core step 6"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs"
      - ".opencode/plugins/mk-mcp-route-guard.js"
      - ".opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs"
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-mcp-route-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-002 Option A (manifest-strict) vs Option B (broad advisory, env-gated) awaits an operator ruling"
    answered_questions: []
---
# Decision Record: External MCP Route Guard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Runtime-neutral policy core plus two thin runtime adapters

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Phase 5 spec author, packet 134 owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

The guard runs under two runtimes. OpenCode intercepts a call through `tool.execute.before`; Claude intercepts it through a `PreToolUse` command hook. Both must apply the same policy: parse the MCP tool name, normalize the server token, exempt internal servers, and consult the manifest family set. If each runtime carried its own copy of that logic, the two copies would drift and the test surface would double. The repo already solves this exact shape once: `dispatch-guard.cjs` holds the policy while `mk-deep-loop-guard.js` and `task-dispatch-guard.cjs` are thin transport maps.

### Constraints

- The core is CommonJS (`.cjs`) so both the ESM-default OpenCode plugin and the Claude `PreToolUse` hook can require it.
- The core must never write stdout/stderr or the log. OpenCode paints stdout over the TUI chat input, and Claude reads stdout as a hook protocol channel, so only the adapters may emit.
- The core stays free of loop-state and session persistence, which makes it simpler than `dispatch-guard.cjs`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one runtime-neutral `.cjs` core (`evaluateNativeMcpCall`) plus two thin adapters that only map their runtime transport onto it.

**How it works**: each adapter reads the incoming tool name from its own transport, calls `evaluateNativeMcpCall({ toolName, projectDir, env })`, and surfaces the returned warnings. The OpenCode adapter appends a warning to the bounded log; the Claude adapter emits it as `additionalContext`. All parsing, normalization, exemption, and manifest lookup stay in the core.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared core plus two thin adapters** | One source of truth; both runtimes match; matches the proven dispatch-guard shape | Requires a cross-tree require of a `.cjs` from an ESM plugin | 9/10 |
| Two independent implementations | No shared-module wiring | Logic drifts across runtimes; double the tests; two places to fix a normalization bug | 3/10 |
| Core plus one runtime only (Claude) | Smaller surface today | Leaves OpenCode without parity when a native external MCP is added to opencode.json | 5/10 |

**Why this one**: the shared core keeps the load-bearing normalization in one tested place, and the repo already runs this exact pattern for the deep-loop guard.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Both runtimes apply identical policy from one file, so a normalization fix lands once.
- The core carries the full truth table, so most tests target a pure function with no transport mocking.

**What it costs**:
- The OpenCode ESM plugin must require a `.cjs` core across the skill tree. Mitigation: import the core as the ESM default export, exactly as `mk-deep-loop-guard.js` does.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An adapter writes stdout/stderr and corrupts the TUI or hook channel | M | Keep all emit in adapters; review that the core is I/O-free; test that the core returns data only |
| Cross-tree require breaks under a loader change | L | Follow the existing dispatch-guard import shape that already ships |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two runtimes need identical policy; drift is a real failure mode |
| 2 | **Beyond Local Maxima?** | PASS | Weighed independent implementations and Claude-only against the shared core |
| 3 | **Sufficient?** | PASS | One core plus two ~40-line adapters is the smallest shape that serves both runtimes |
| 4 | **Fits Goal?** | PASS | The core carries the load-bearing normalization on the critical path |
| 5 | **Open Horizons?** | PASS | A new runtime adds one thin adapter, not a new policy copy |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs` holds `evaluateNativeMcpCall` and the manifest loader.
- `.opencode/plugins/mk-mcp-route-guard.js` and `.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` require the core and map their transports onto it.

**How to roll back**: delete the two adapter files. The core file then has no callers and is inert; no other code references `evaluateNativeMcpCall`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Advisory, fail-open posture and the manifest-strict vs broad fork

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-11 |
| **Deciders** | Packet 134 owner, operator (fork ruling required) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The `mcp-code-mode` SKILL already declares Code Mode MANDATORY (`SKILL.md:18`) and documents that Code Mode only routes tools present in `.utcp_config.json` (`SKILL.md:271`). The guard is a runtime reminder of that existing mandate, not new policy. Two questions drive its behavior. First, the posture: does the guard ever block, or only advise? Second, the fork: when an agent calls an external server that Code Mode cannot route (absent from the manifest), does the guard stay silent or nudge the operator to register it?

The manifest today lists `chrome_devtools_1/2`, `clickup_official`, `figma`, `github`, `gitkraken`, `open_design`, and `refero` (`.utcp_config.json:14-165`). The large native connectors an account can enable (Webflow, Notion, Gmail, Calendar, Drive) are absent, so a manifest-strict guard warns on essentially one family today (ClickUp) and stays silent on the rest.

### Constraints

- The warn-first mandate forbids a block path. The `mk-dist-freshness-guard` precedent keeps the hard mandate at documentation level and the runtime warn-only.
- A guard bug must never impede a correctly-routed or unrelated call, so every error path fails open.
- Claude spawns a fresh node process per matched `PreToolUse` call, so the hook stays lean and honors the 5s timeout.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: an advisory, fail-open guard with a warn-only contract (no reject path exists) and an env kill-switch, defaulting to manifest-strict so every warning is actionable.

**How it works**: the core returns only `allow` or `warn`. A normalized server that matches the manifest family set returns `warn` with the manual name; any miss returns `allow` silently under manifest-strict. Broad mode, which nudges the operator to register an unrouteable server, is available behind an env flag that defaults off. Every error resolves to `allow`.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: Manifest-strict, warn-only, fail-open (default)** | Every warning is actionable; zero noise on unrouteable servers; smallest surface | Active warn-set is ~one family today (ClickUp); silent on the biggest native connectors | 8/10 |
| B: Broad advisory (env-gated, default off) | Nudges the operator to grow manifest coverage; surfaces the coverage gap | Warns on servers Code Mode cannot route yet, which reads as noise until the manifest catches up | 6/10 |
| C: Enforcing block on native calls | Hard guarantee of routing | Violates the warn-first mandate; a bug blocks real work; rejected outright | 1/10 |

**Why this one**: manifest-strict keeps advice actionable and value scales automatically as the manifest grows, while broad mode stays one env flag away for operators who want the coverage nudge.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No call is ever blocked, and no error impedes work, so the guard is safe to ship at low blast radius.
- Warnings map one-to-one to a registered manual, so the operator can act on each one.
- Adding a manual name to the manifest expands coverage with no code change.

**What it costs**:
- The live value today is a single family (ClickUp), with the OpenCode surface dormant. Mitigation: document the ceiling honestly and let the operator pick broad mode if they want the registration nudge sooner.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operators read manifest-strict silence as "nothing to route" and never grow coverage | M | Surface the fork in spec Open Questions; offer broad mode behind an env flag |
| Broad mode, once enabled, produces noise on unrouteable servers | M | Keep it default off; document that it targets manifest growth, not per-call routing |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The mandate is documentation-only today; nothing reminds the agent at call time |
| 2 | **Beyond Local Maxima?** | PASS | Weighed manifest-strict, broad advisory, and an enforcing block |
| 3 | **Sufficient?** | PASS | Warn-only plus fail-open plus an env kill-switch covers the safety and growth needs |
| 4 | **Fits Goal?** | PASS | Advisory posture matches the warn-first mandate and the mk-dist-freshness-guard precedent |
| 5 | **Open Horizons?** | PASS | Broad mode and manifest growth are both reachable without a redesign |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The core returns only `allow` or `warn`; there is no reject branch to write.
- An env flag selects broad mode; it defaults off, and an env kill-switch disables warnings entirely.

**How to roll back**: set the kill-switch env flag to disable warnings, or remove the `.claude/settings.json` matcher block and the OpenCode plugin to disable the surfaces. The core stays inert with no callers.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
