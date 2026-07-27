---
title: "Implementation Plan: Pi CLI contract pin"
description: "Plan for installing the real Pi CLI and live-verifying its contract - binary, .pi/ merge, skills/prompts/extensions discovery, auth, headless dispatch - before any executor or skill-packet work depends on pi.dev-documentation-only assumptions."
trigger_phrases:
  - "pi cli contract pin plan"
  - "pi headless dispatch verification plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin"
    last_updated_at: "2026-07-27T08:03:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan authored from pi.dev live WebFetch documentation findings; not yet executed."
    next_safe_action: "Execute Phase 1 (install) before any later phase of this plan."
    blockers: ["Pi CLI is not yet installed on this machine."]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pi CLI contract pin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Pi CLI is Node/TypeScript-based (`@earendil-works/pi-coding-agent`); no build system change to this repo. |
| **Framework** | N/A - external CLI install, no application framework touched. |
| **Storage** | `.pi/` (repo-root, project config) and `~/.pi/` (user-global config) - both external to this repo's tracked files. |
| **Testing** | Live command execution and stdout/stderr/exit-code capture only; no automated test suite for this phase. |

### Overview
Install Pi via npm global install (curl installer as documented fallback), then live-verify every surface phases 002-011 depend on: `.pi/` directory creation and `settings.json` merge, skills discovery pointed at `.opencode/skills/`, prompt-template discovery, extension auto-discovery, auth/provider configuration, and the Programmatic Usage / headless dispatch surface with real exit-code semantics. Each fact is either confirmed live or explicitly flagged as an open question for the phase that depends on it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (spec.md §6 - pi.dev docs, npm registry, third-party packages)

### Definition of Done
- [ ] Every REQ-001..008 in spec.md has a citation to either a live command's stdout/exit-code or an explicitly-flagged "documented, unconfirmed" gap
- [ ] `implementation-summary.md` written with citable evidence once this phase actually executes
- [ ] checklist.md P0/P1 items verified with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only, evidence-producing verification pass - not a code-shipping phase. No new repo components.

### Key Components
- **Pi binary (`pi`)**: the installed CLI itself; source of `--version`/`--help` and interactive-session behavior.
- **`.pi/settings.json` (project) / `~/.pi/agent/settings.json` (global, or equivalent global path)**: the merge target this phase live-tests.
- **`.opencode/skills/` (this repo)**: the real skill tree this phase points Pi's `"skills"` config at, to observe discovery behavior against a real 12-hub, 51-`SKILL.md` tree.
- **Probe artifacts (local-machine only)**: a throwaway `.pi/prompts/probe.md`, a throwaway `.pi/extensions/probe.ts`, used purely to exercise discovery mechanisms - never committed to the repo.

### Data Flow
Pi is installed and pointed (via its own config) at this repo's real skill/command surfaces for observation purposes only; nothing in this repo is modified. Findings (live command output, doc citations, confirmed-vs-unconfirmed status per REQ) flow forward into phase 002's executor-kind design and phase 003's `SKILL.md`/README content, exactly as the 029/030 precedents' phase 1 fed their phase 2/3.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A - this phase is not a bug fix, not planning from a deep-review verdict, and touches no repository security/path/env/schema/persistence/response/policy surface. It is a read-only live-verification pass against an external CLI; no repository code is a "producer" or "consumer" of this phase's findings until phase 002 begins.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Install
- [ ] Run the documented npm global install: `npm install -g --ignore-scripts @earendil-works/pi-coding-agent` (fallback: `curl -fsSL https://pi.dev/install.sh | sh`, per pi.dev docs - no brew/cargo path is documented).
- [ ] Confirm `pi` resolves on `PATH` (`which pi`) and record the live version/build via `pi --version`.
- [ ] Capture `pi --help` in full to enumerate the real subcommand/flag surface before trusting any doc-nav page.

### Phase 2: Core contract verification
- [ ] Launch `pi` once interactively in a scratch directory; confirm `.pi/` is created and inspect its initial contents.
- [ ] Write a project-level `.pi/settings.json` with one overriding key and a global-level equivalent; confirm the documented merge ("nested objects are merged", project overrides global) live, not just quoted.
- [ ] Add a `"skills"` entry in `.pi/settings.json` pointing at this repo's `.opencode/skills/`; start a session and inspect what Pi's skill-discovery UI/output reports discovered - specifically whether it lists 12 hub-level skills or every nested mode/reference `SKILL.md` as well.
- [ ] Drop a probe `.pi/prompts/probe.md` with `$1`/`${1:-default}` placeholders; confirm it surfaces as `/probe` and that argument substitution behaves as documented; confirm a same-named file one directory deeper is NOT discovered (non-recursive check).
- [ ] Drop a minimal no-op `.pi/extensions/probe.ts`; confirm Pi's startup output acknowledges loading it.
- [ ] Inspect the auth/provider configuration surface (`pi` subcommands or docs-referenced config keys for registering a provider/API key); attempt a dispatch with no provider configured and record the exact failure behavior.
- [ ] Fetch and read the Programmatic Usage doc pages (SDK, RPC Mode, JSON Event Stream Mode) under `pi.dev/docs/latest`; identify the real invocation syntax for non-interactive/headless dispatch.
- [ ] Run one successful-path headless dispatch and one deliberately-failing dispatch (e.g. unset/invalid provider auth); record both exit codes and full stdout/stderr verbatim - do not accept "exit 0" as proof of success without inspecting output content, per the `cursor-agent -p` precedent.
- [ ] Attempt `pi install npm:pi-subagents` (or the equivalent for `pi-mcp-extension`) far enough to confirm the real install-verb syntax; do not proceed into full package configuration (that is phases 006/007).

### Phase 3: Cross-check and record
- [ ] Cross-check every live-observed behavior against the specific `pi.dev/docs/latest/**` page that documented it; note any drift.
- [ ] For any REQ that could not be live-confirmed (e.g. an auth-gated or environment-specific behavior), mark it explicitly "documented, unconfirmed" rather than asserting it as fact.
- [ ] Write `implementation-summary.md` citing a live command's stdout/exit-code or a `pi.dev/docs` URL for every REQ-001..008 in `spec.md`.
- [ ] Update this phase's frontmatter continuity (`completion_pct`, `answered_questions`, `open_questions`) to reflect what was actually confirmed once execution happens.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A - no repository code produced by this phase | N/A |
| Integration | N/A - deferred to phase 002 once `cli-pi` becomes a real executor kind | N/A |
| Manual | `pi --version`/`--help`, `.pi/settings.json` merge probe, skills/prompts/extensions discovery probes, one failure-path and one success-path headless dispatch, one `pi install npm:<pkg>` attempt - all read-only or fully-reversible local-machine actions | Terminal, `pi` CLI itself, `WebFetch` for `pi.dev/docs` cross-checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| npm registry / `@earendil-works/pi-coding-agent` package | External | Green (public npm package, no known access restriction) | Falls back to the documented `curl` shell installer |
| `pi.dev/docs/latest/**` documentation pages | External | Yellow (`install` and `mcp` sub-pages 404; homepage/overview and package-catalog page used instead) | Reduces citation precision for those two surfaces; does not block install or most live probes |
| A configured AI provider/API key for Pi | External | Yellow (not yet configured on this machine) | Blocks the success-path headless dispatch probe in REQ-007 until a provider is registered; the failure-path probe (no auth) remains testable regardless |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The Pi integration is abandoned, or the install/verification pass needs to be undone for any reason.
- **Procedure**: Uninstall via `npm uninstall -g @earendil-works/pi-coding-agent` (or remove the shell-installer's binary/symlinks per its documented uninstall path if that install method was used instead); delete the local `.pi/` and `~/.pi/` directories created during verification. No repository files are touched by this phase, so no repo-side revert is needed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Install) ──────► Phase 2 (Core contract verification) ──► Phase 3 (Cross-check and record)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Install | None (first phase of the packet) | Core contract verification |
| Core contract verification | Install | Cross-check and record |
| Cross-check and record | Core contract verification | Phase 002 of the packet (`002-deep-loop-executor-support`), and by extension every phase 003-011 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Install | Low | 10-15 minutes |
| Core contract verification | Medium | 45-60 minutes (8 distinct live probes: settings merge, skills discovery, prompts, extensions, auth, headless success path, headless failure path, install-verb) |
| Cross-check and record | Low-Med | 20-30 minutes (doc cross-check + `implementation-summary.md` authoring) |
| **Total** | | **~75-105 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No production/deployment surface touched - this phase installs a local CLI tool and reads documentation only.
- [ ] No feature flag needed - `cli-pi` is not routable anywhere in the repo until phase 003 registers it.
- [ ] No monitoring/alerting surface - single-operator local verification.

### Rollback Procedure
1. Uninstall the `pi` binary (`npm uninstall -g @earendil-works/pi-coding-agent`).
2. Delete local `.pi/` and `~/.pi/` directories created during verification.
3. No repository code to revert - `git status` should show zero changes from this phase outside `001-pi-contract-pin/`.
4. No stakeholder notification needed - purely local, reversible, non-shared state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - no persistent data outside the operator's own local `~/.pi/`/`.pi/` directories, both fully removable.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md` (this phase - no `implementation-summary.md` yet, status Planned)
