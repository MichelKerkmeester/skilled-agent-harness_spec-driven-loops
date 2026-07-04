---
title: "Feature Specification: Detection-Layer Sub-Agent-Routing Enforcement Plugin"
description: "Build a tool.execute.before OpenCode plugin hook that inspects/rewrites Task-dispatch args against mode-registry.json + orchestrate's Priority table, and smoke-test whether fail-closed (throw) rejection actually works on the installed OpenCode version, or only mutate-and-warn is available."
trigger_phrases:
  - "deep route guard plugin"
  - "tool execute before hook"
  - "sub-agent enforcement plugin"
  - "detection only enforcement"
importance_tier: "high"
contextType: "implementation"
predecessor_research: "../007-gpt-behavioral-hardening-research/research/research.md"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/001-deep-route-guard-plugin"
    last_updated_at: "2026-07-01T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 012"
    blockers: []
    key_files:
      - "../007-gpt-behavioral-hardening-research/research/research.md"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-011-init"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Plugin home: system-skill-advisor (existing skill with adjacent routing concerns) vs a new standalone .opencode/plugins/ entry. Resolve during plan.md Phase 1."
      - "Whether tool.execute.before can genuinely reject (throw) a dispatch on the installed OpenCode version, vs only mutate-and-warn, is unconfirmed without a live smoke test (research.md §5) — this phase's own Phase 3 verification is where that gets answered, not assumed in advance."
    answered_questions:
      - "Mechanism confirmed feasible by research (round 2 resolved what round 1 could only argue by analogy): tool.execute.before can inspect and rewrite dispatch args."
      - "Hard limits confirmed by multiple lineages: (a) cannot create hard runtime identity — that remains FIX-5/host territory; (b) does not catch a schema-valid, route-matched artifact that does semantically wrong-mode work internally."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Detection-Layer Sub-Agent-Routing Enforcement Plugin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `031-deep-loop-issues-with-gpt-opencode` |
| **Predecessor** | `../010-ai-council-subagent-only/` (routing identity must be correct first) |
| **Successor** | `../012-gpt-claude-benchmark/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 008-010 fix routing *identity* (correct table rows, correct registry values, correct reachability) but do nothing to *enforce* it at the moment of dispatch — a model can still construct a Task-tool call with a mismatched `mode`/`target_agent` pair and nothing currently stops it before the dispatch happens. Research (research.md §1, §3) confirmed a detection-only enforcement mechanism is feasible via OpenCode's `tool.execute.before` hook, which can inspect and rewrite the `args` of an outgoing Task-tool call. Research also confirmed hard limits on what this buys: (a) it cannot create hard runtime identity — that remains FIX-5/host territory, out of scope until phase 013's checkpoint says otherwise; (b) whether it can genuinely **reject** (throw, blocking the dispatch) vs. only **mutate-and-warn** (rewrite args and log, but let it through) is host-dependent and was explicitly left unconfirmed by research without a live smoke test; (c) it cannot catch a schema-valid, route-matched artifact that internally does semantically wrong-mode work.

### Purpose

Build the plugin as a detection layer that inspects/rewrites Task-dispatch args against `mode-registry.json` and orchestrate's Priority table, and settle — via an actual live smoke test, not analogy — whether this OpenCode installation supports fail-closed (throw) rejection or only mutate-and-warn. This phase's own verification step is where that open question gets answered, not before.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Design and implement a `tool.execute.before` hook that, on Task-tool dispatch, reads the outgoing `mode`/`target_agent` (or equivalent) fields, resolves the expected values from `mode-registry.json` for the requested deep mode, and either rewrites mismatched fields or rejects the call — whichever the live smoke test in Phase 3 confirms is actually supported.
- Choose and document the plugin's home (system-skill-advisor vs. a new standalone `.opencode/plugins/` entry) with a stated rationale.
- A live smoke test on the installed OpenCode version specifically targeting: does throwing from `tool.execute.before` actually block the dispatch, or does the tool call proceed regardless?
- Document the plugin's hard limits explicitly in its own README/comments-equivalent (no hard identity; no semantic-content catch) so future readers don't over-trust it.

### Out of Scope

- Any change to host-runtime identity or process isolation (FIX-5) — `../013-fix5-checkpoint/`.
- The GPT-vs-Claude benchmark itself — `../012-gpt-claude-benchmark/` (this phase's plugin may be exercised by that benchmark, but building the benchmark is separate work).
- Retroactively re-validating phases 008-010's own routing fixes — this phase assumes they are correct and enforces against them.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Create | Plugin implementation (default-export-only, per repo convention); renamed 2026-07-01 from `deep-route-guard.js` for `mk-*` naming parity |
| Hard-limits documentation | Create | Header comment inside the plugin file itself |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plugin registers and fires on Task dispatch | `tool.execute.before` hook confirmed to actually invoke on a real Task-tool call in this OpenCode installation (default-export-only entrypoint, per research's confirmed gotcha — hooks silently don't register otherwise). |
| REQ-002 | Fail-closed capability is tested, not assumed | A live smoke test determines and records whether a thrown rejection actually blocks the dispatch, or only mutate-and-warn works; the plugin's design matches whichever is actually true. |
| REQ-003 | Enforcement checks against the registry, not forked logic | The plugin reads `mode-registry.json` (or a value derived directly from it) rather than hardcoding its own copy of the mode/agent mapping. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Plugin fires reliably on Task dispatch in a real smoke test.
- **SC-002**: The fail-closed vs. mutate-and-warn question is answered with direct evidence (smoke-test output), not left as an open question in this phase's own docs.
- **SC-003**: Plugin's documented limits explicitly state what it does NOT catch (semantic wrong-mode work, hard identity).
- **SC-004**: `validate.sh --strict` passes for this phase folder once implementation lands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `tool.execute.before` cannot genuinely reject on this OpenCode version | Plugin degrades to detection/logging only, weaker than assumed | Confirmed by live smoke test in Phase 3; design documented to match reality, not aspiration |
| Risk | Plugin is over-trusted as a full enforcement layer | False sense of safety; semantic wrong-mode dispatches still slip through | Explicit, prominent "hard limits" documentation shipped with the plugin |
| Dependency | Phases 008-010 (routing identity fixes) | Correctness of what's being enforced | Must land first |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Plugin failure (e.g., a hook exception) must not itself block unrelated, correctly-routed dispatches — a bug in the guard must fail open for correct calls, not fail closed universally.

### Maintainability
- **NFR-M01**: Plugin logic must read from `mode-registry.json` directly or via a thin, tested accessor — never a hand-copied mapping that can drift.

### Compatibility
- **NFR-C01**: Plugin installation must not require changes to existing agent definitions beyond what phases 008-010 already land.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A Task dispatch for a non-deep mode (e.g., `@code`, `@review`) should pass through the guard without modification — the plugin's scope is deep-mode routing correctness, not general dispatch validation.

### Error Scenarios
- Registry file missing/unreadable at hook-fire time: plugin must fail open (allow dispatch, log a warning) rather than blocking all dispatch traffic.
- Hook fires but `mode-registry.json` has since drifted from the plugin's cached copy (if any caching is used): plugin must re-read fresh, not rely on a stale in-memory copy.

### State Transitions
- This phase can begin only after phase 010 lands. Phase 012's benchmark may exercise this plugin but does not require it to exist first.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | New plugin surface, one hook, registry-backed logic |
| Risk | 14/25 | Detection-only by design; worst case is a plugin bug that needs the fail-open safeguard |
| Research | 16/20 | Mechanism and hard limits both confirmed by research; only the fail-closed-vs-warn question is genuinely open pending a live test |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md` §1 (enforcement plugin finding), §3 (KQ table), §4 item 3
- **Predecessor**: `../010-ai-council-subagent-only/`
- **Parent Spec**: `../spec.md`
