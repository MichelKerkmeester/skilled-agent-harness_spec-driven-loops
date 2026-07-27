---
title: "Feature Specification: Pi CLI contract pin"
description: "Plan to install the real Pi CLI (pi.dev, open-source @earendil-works/pi-coding-agent) and live-verify its whole contract - binary/install, .pi/ dir, settings merge, skills/prompts/extensions discovery, auth/providers, headless/programmatic dispatch and exit-code semantics - before any downstream cli-pi phase treats pi.dev's documentation as confirmed behavior."
trigger_phrases:
  - "pi cli contract pin"
  - "pi.dev cli verification"
  - "pi headless dispatch contract"
  - "earendil-works pi-coding-agent"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin"
    last_updated_at: "2026-07-27T08:03:00Z"
    last_updated_by: "claude-code"
    recent_action: "Installed Pi CLI and executed the live verification tasks"
    next_safe_action: "Phase 002 may design against these confirmed facts"
    blockers: ["No provider API key on this machine - successful-path dispatch unobserved"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Skills-discovery flattening question (REQ-003) unresolved - owned by phase 004"
      - "Prompt-template discovery/argument substitution (REQ-004) unresolved - owned by phase 005"
      - "Successful-path dispatch exit code unobserved without provider credentials"
    answered_questions:
      - "Headless dispatch is --print/-p combined with --mode text/json/rpc; --mode rpc is a persistent JSONL protocol, not one-shot"
      - "Pi shares the cursor-agent-class exit-0-on-failure gotcha - and worse, is inconsistent (0 then 1) across identical failed runs"
      - "pi install npm:<pkg> -l --approve is the confirmed install verb; a project-trust gate blocks it without --approve"
      - "Extensions are actively validated (must export a factory function) and fail the whole session, not just the bad extension, on an invalid one"
---
# Feature Specification: Pi CLI contract pin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete - 6/8 REQs live-confirmed; REQ-003 (skills flattening) and REQ-004 (prompt-template discovery) remain unconfirmed, owned by phases 004/005 |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/031-cli-pi-creation` |
| **Predecessor** | None (first phase) |
| **Successor** | `002-deep-loop-executor-support` |
| **Handoff Criteria** | `pi --version` succeeds locally and the live-probed non-interactive/headless dispatch syntax is documented with real exit-code behavior on both success and failure. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All 10 downstream phases of this packet plan their work against pi.dev's live-fetched documentation, not against a locally-installed and tested binary. The docs describe an MIT open-source, multi-provider CLI with a native `SKILL.md`-format skill system, a flat non-recursive prompt-template layer, and a first-party TypeScript extension system - but the Programmatic Usage dispatch surface (SDK, RPC mode, JSON event stream mode) that deep-loop's executor wiring would depend on has no example invocation syntax or exit-code semantics documented anywhere on the fetched pages, and `https://pi.dev/docs/latest/install` and `.../mcp` both 404 (install content lives on the homepage/docs-overview page instead; MCP is documented only at the package-catalog page, not a core docs page - itself a signal MCP support may be genuinely peripheral to core Pi, not confirmed first-class). Building phases 002-011 on these documentation claims without a real install repeats the exact class of mistake the Devin and Cursor precedents each made once: `cursor-agent -p`'s exit-0-on-auth-failure gotcha, and Devin's hooks config schema being misdiagnosed as unsupported before it was ever live-tested.

### Purpose
Install Pi for real, then convert every pi.dev-doc-sourced claim this packet currently treats as documented-but-unconfirmed into either a live-confirmed fact (with the literal command/output that proves it) or an explicitly flagged unresolved gap that downstream phases must treat as still open - covering binary/version, `.pi/` directory creation and `settings.json` merge, skills discovery (including recursive-vs-hub-level exposure against this repo's 12 skill hubs), prompt-template discovery (confirm non-recursive), extension auto-discovery, auth/provider configuration, and the Programmatic Usage/headless dispatch surface including exit-code semantics on both success and failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Install Pi via the documented npm global install (`npm install -g --ignore-scripts @earendil-works/pi-coding-agent`, or the `curl -fsSL https://pi.dev/install.sh | sh` shell installer) and confirm the live binary version and `--help` output.
- Confirm `.pi/` (repo-root) config-directory creation and `settings.json` merge behavior live - project settings overriding global settings with nested-object merge, per the docs quote: "Project settings (`.pi/settings.json`) override global settings. Nested objects are merged."
- Point Pi's skills discovery at `.opencode/skills/` (via a `settings.json` `"skills"` array entry or `--skill` flag) and live-verify whether recursive `SKILL.md` discovery surfaces only the 12 hub-level `SKILL.md` files or also every nested mode/reference `SKILL.md` as an independently-discovered skill (this repo currently has 51 `SKILL.md` files across 12 hubs under `.opencode/skills/`).
- Confirm prompt-template discovery from `.pi/prompts/*.md` is non-recursive as documented, and confirm `$1`/`$2`/`$@`/`${1:-default}` argument-substitution syntax against one real invocation.
- Confirm extension auto-discovery from `.pi/extensions/*.ts` (project-local) using a minimal no-op probe extension - proving the discovery mechanism exists, not proving hook-event parity (that is phase 008's job).
- Confirm the auth/provider configuration surface: how a provider/API key is registered, and what Pi reports for an unauthenticated dispatch attempt.
- Confirm the Programmatic Usage / headless dispatch surface (SDK, RPC mode, JSON event stream mode): live-probe the actual invocation syntax and capture real exit codes on both a successful dispatch and an auth/dispatch failure, explicitly checking for the `cursor-agent`-class gotcha (exit 0 on failure).
- Confirm the exact `pi install npm:<pkg>` verb syntax against at least one of the two third-party packages (`pi-subagents` or `pi-mcp-extension`) far enough to prove the install command itself - full package integration is phases 006/007, not this phase, but both of those phases' plans depend on this phase confirming the install-verb syntax.

### Out of Scope
- Full `pi-subagents`/`pi-mcp-extension` package integration (agent-file translation, MCP server wiring) - phases 006/007.
- Any deep-loop executor wiring (`ExecutorKind`, `buildPiLineageCommand`) - phase 002.
- Skill packet creation or hub registration - phase 003.
- Live-verifying every one of the repo's 49 commands or 14 agents against Pi - phases 005/006.
- Completing any interactive OAuth-style provider login flow if Pi's auth turns out to require one - operator-only action, mirroring the Devin/Cursor precedents' deliberate login deferral.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| (none - verification only) | N/A | This phase produces evidence (command output, doc citations), not repository code changes. Any `.pi/` scaffold, probe extension, or prompt-template file created during live verification is local machine state outside the repo, not a tracked file. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Pi CLI installed via the documented npm global install (or shell installer as fallback) and its live binary version/help output confirmed via `pi --version` / `pi --help`. | P0 |
| REQ-002 | `.pi/` repo-root directory creation and `settings.json` project-over-global merge behavior confirmed live, not just quoted from docs. | P0 |
| REQ-003 | Skills discovery confirmed live by pointing `settings.json` `"skills"` at `.opencode/skills/` - specifically whether recursive discovery surfaces only the 12 hub-level `SKILL.md` files or also every nested mode/reference `SKILL.md` as an independent skill. | P0 |
| REQ-004 | Prompt-template discovery from `.pi/prompts/*.md` confirmed non-recursive live, and `$1`/`$2`/`$@`/`${1:-default}` argument substitution confirmed against a real invocation. | P1 |
| REQ-005 | Extension auto-discovery from `.pi/extensions/*.ts` confirmed live via a minimal no-op probe extension (existence-of-mechanism only, not hook-event parity). | P1 |
| REQ-006 | Auth/provider configuration surface confirmed: how a provider/API key is registered, and what an unauthenticated dispatch attempt reports. | P0 |
| REQ-007 | Programmatic Usage / headless dispatch surface (SDK, RPC mode, JSON event stream mode) confirmed live: real invocation syntax plus exit codes on both a successful dispatch and an auth/dispatch failure, explicitly checked against the `cursor-agent`-class "exit 0 on failure" gotcha. | P0 |
| REQ-008 | `pi install npm:<pkg>` verb syntax confirmed live against at least one of `pi-subagents`/`pi-mcp-extension`, far enough to prove the exact command (not full package integration). | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `pi --version` returns a live version string, and `.pi/` is confirmed created with the documented project-over-global merge behavior.
- **SC-002**: Every REQ above has a citation to either a live command's stdout/exit-code or a `pi.dev/docs` URL explicitly marked "documented, unconfirmed" wherever live verification genuinely could not be completed - no doc claim is carried forward as fact without a live check attempted.
- **SC-003**: The headless-dispatch exit-code semantics on both success and failure are captured verbatim, with explicit confirmation of whether Pi shares the `cursor-agent -p` "exit 0 on auth failure" gotcha or fails closed correctly.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `pi.dev/docs/latest` pages (skills, prompt-templates, extensions) | Docs may drift from the exact installed build's real behavior | Cross-check every doc claim against live `--help`/`settings.json` output, same discipline as 029/030 |
| Risk | Headless dispatch may exit 0 on auth/dispatch failure like `cursor-agent -p` | High - a silent-failure dispatch guard would ship into phase 002 | Explicitly test a failure-path dispatch and record stdout/stderr content; never key phase 002's guard on exit code alone |
| Risk | `pi-mcp-extension`'s only documented config example is remote `streamable-http`; local stdio-transport support is UNCONFIRMED | Medium-High - blocks phase 007's core MCP bridge if stdio is unsupported | Confirm only the install-verb syntax here; live-probe `/mcp` with a stdio-shaped test server in phase 007, document explicitly if unsupported rather than assume |
| Risk | Recursive skill discovery may flatten every nested mode `SKILL.md`, diverging from the single-advisor-identity parent-hub design | Medium - reshapes or blocks phase 004 | Live-verify against the real `.opencode/skills/` tree (12 hubs, 51 `SKILL.md` files) before phase 004 assumes hub-level-only exposure |
| Dependency | `pi.dev/docs/latest/install` and `.../mcp` both 404 | Low - info already relocated, not missing | Treat the homepage/docs-overview page and the package-catalog page as the authoritative sources instead |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A - this phase is a one-time live verification pass, not a deployed service; no response-time target applies.
- **NFR-P02**: N/A - no throughput target; single-session CLI dispatch only.

### Security
- **NFR-S01**: Any provider API key or OAuth token obtained during auth verification must never be logged, printed into a committed file, or added to the repo - `.pi/` and `~/.pi/` credential material stays ephemeral, local-machine state only.
- **NFR-S02**: `pi install npm:<pkg>` commands fetch only from the public npm registry via Pi's own installer; no unofficial or mirrored package sources are used.

### Reliability
- **NFR-R01**: N/A - no uptime target; this is a manual, one-time verification pass.
- **NFR-R02**: Every live command's exit code and full stdout/stderr are captured verbatim so a real failure is distinguishable from a documentation gap.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No-argument invocation: confirm `pi` with no args launches its interactive TUI rather than erroring, per the docs' "Start with `pi` in a terminal" framing.
- Pointing `settings.json` `"skills"` at `.opencode/skills/` before the discovery mechanism is confirmed reachable: confirm whether Pi errors, warns, or silently skips an unreadable/empty-looking path.

### Error Scenarios
- Provider auth failure during headless dispatch: capture the exact exit code and stdout/stderr content - do not assume exit 0 means success (per the `cursor-agent -p` precedent gotcha).
- `pi install npm:<pkg>` against a package name that fails to resolve: capture the failure mode to distinguish "install verb syntax wrong" from "package genuinely unavailable."
- A probe `.pi/extensions/*.ts` file with a deliberate syntax error: confirm whether Pi fails the whole session or just skips the broken extension with a warning.

### State Transitions
- Repeated `.pi/settings.json` edits mid-session: confirm whether Pi requires a restart to pick up config changes or hot-reloads them.
- Project-level trust prompt for `.pi/skills`/`.agents/skills` (per docs, project skills require "a trust prompt"): confirm what happens on decline vs. accept, and whether the decision persists across sessions.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Single external binary install plus live probes across six documented surfaces (settings merge, skills, prompts, extensions, auth, headless dispatch); no repository files change. |
| Risk | 10/25 | Auth/headless dispatch exit-code semantics unconfirmed (cursor-agent-class gotcha risk); third-party package install-verb syntax inferred, not confirmed - wrong facts here propagate into phases 002/006/007. |
| Research | 15/20 | Six `pi.dev/docs/latest` pages already fetched and quoted; two pages (`install`, `mcp`) 404 and must be worked around via the homepage and the package-catalog page. |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **RESOLVED**: Headless dispatch is `--print`/`-p`, structured output is `--mode json` (one-shot JSONL event stream: `session` header then `agent_start/end`/`turn_*`/`message_*`/`tool_execution_*` events) or `--mode rpc` (a **persistent** stdin/stdout JSON-Lines protocol, architecturally different from every sibling CLI's one-shot pattern - phase 002 should default to `--mode json -p`, not `--mode rpc`). Exit-code behavior is confirmed **unreliable**: the same auth failure returned exit 0 on the first invocation and exit 1 on every later one - phase 002's guard must inspect stderr content, never exit code alone.
- **STILL UNKNOWN**: Whether pointing `settings.json` `"skills"` at `.opencode/skills/` surfaces only the 12 hub-level `SKILL.md` files or also flattens every nested mode/reference `SKILL.md` as an independent skill - could not be observed without a successful dispatch (no provider credentials on this machine); remains phase 004's live-verification burden.
- **RESOLVED**: `pi install npm:<pkg> -l --approve` is the confirmed install verb (`-l` for project-local, `--approve` to pass the project-trust gate; omitting `--approve` fails cleanly with "Project is not trusted"). Confirmed against a real install of `pi-subagents`.
- **STILL UNKNOWN**: Whether `pi-mcp-extension` supports a local stdio transport at all - not tested this phase (install-verb confirmation used `pi-subagents`, not `pi-mcp-extension`, since neither package needed full configuration here); phase 007's job once the package is actually installed and configured.
- **NEW, UNPLANNED FINDING**: An invalid `.pi/extensions/*.ts` (not exporting a factory function) fails the entire session, not just that extension - `pi -ne` is the documented escape hatch. Phase 008's extension-bridge design must assume fail-closed-for-the-whole-session on a malformed guard-core translation, not fail-open-with-a-warning.
- **NEW, UNPLANNED FINDING**: `--verbose` without `--offline` hung 2+ minutes with no reachable network path. Any automated dispatch (phase 002) should pass `--offline` explicitly rather than rely on a fast failure.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase - no `implementation-summary.md` yet, status Planned)
- `../002-deep-loop-executor-support/spec.md` (consumes this phase's contract facts once confirmed)
