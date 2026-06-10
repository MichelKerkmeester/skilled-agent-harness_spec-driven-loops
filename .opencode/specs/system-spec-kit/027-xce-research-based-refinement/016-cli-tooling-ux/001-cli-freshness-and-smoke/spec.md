---
title: "Feature Specification: CLI Freshness Gate Fix and Offline Smoke [template:level_1/spec.md]"
description: "Durably fix the spec-memory stale-dist freshness gate, surface stale-dist as an actionable plugin status, and add a unified offline smoke check of the 37/8/9 list-tools counts without a daemon, build, or scan."
trigger_phrases:
  - "cli freshness and smoke"
  - "spec-memory stale dist gate"
  - "cli list-tools smoke 37 8 9"
  - "stale dist plugin status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/001-cli-freshness-and-smoke"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level-1 child from assessment rows 1, 10, 13"
    next_safe_action: "Plan the durable freshness-gate fix and offline smoke script"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-001-cli-freshness-and-smoke"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CLI Freshness Gate Fix and Offline Smoke

<!-- SPECKIT_LEVEL: 1 -->
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
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spec-memory shim's mtime-based freshness gate (`.opencode/bin/spec-memory.cjs:24-42`, guard observed at `:29-40`) exits `69` ("spec-memory dist entrypoint is stale...") and blocks dispatch even when dist content is current. Root cause: `tsc --build` is content-hash incremental and will not rewrite dist when a watched source file's mtime bumps without a content change, so a plain rebuild is a no-op and only `tsc --build --force` restores freshness — the gate then trips permanently. With `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `list-tools` returns `count=37`, proving this is a gate bug, not a zero-count coverage bug. The advertised offline parity expectation is documented at `manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md:16-20` and its scenario at `:32-56`, but there is no single offline smoke command an agent or CI can run to verify the 37/8/9 list-tools counts and stale-dist health without a daemon, build, or scan. Separately, when the shim exits `69` with actionable stderr, the plugin bridges redact stderr to `[stderr-present]` (`mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs:266-280`), so plugin status shows a generic skipped/fail-open state instead of a diagnosable "dist stale, rebuild required".

### Purpose
Make the offline fallback parity check work durably: gate on content hash (or have the build always touch dist so a plain rebuild restores freshness), surface stale-dist as an actionable plugin status (not generic skipped/fail-open) while keeping stderr sanitized, and add one unified offline smoke command/script verifying the 37/8/9 list-tools counts plus stale-dist health without a daemon, build, or scan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Durable freshness-gate fix in the spec-memory shim: gate on content hash, or make the build always touch dist so a plain rebuild restores freshness.
- Actionable stale-dist state surfaced in plugin status (distinguishable from generic skipped/fail-open), with stderr kept sanitized.
- A unified offline smoke command/script verifying the 37/8/9 list-tools counts and stale-dist health without a daemon, build, or scan.

### Out of Scope
- Tool coverage changes (the three CLIs already enumerate dynamically from the shared registries).
- Cold-spawning the daemon from prompt-time hooks.
- The per-command help, alias, error, doc, envelope, and completion work owned by sibling sub-phases 002-005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/spec-memory.cjs` (freshness gate `:24-42`/`:29-40`) | Modify | Durable content-hash gate or always-touch-dist so a plain rebuild restores freshness |
| `mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` (`:266-280`) | Modify | Surface actionable "dist stale, rebuild required" status; keep stderr sanitized |
| Offline smoke command/script (new) | Create | Verify 37/8/9 list-tools counts + stale-dist health with no daemon/build/scan |
| `manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md` (`:16-20`, `:32-56`) | Modify | Point the parity scenario at the unified smoke check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spec-memory freshness gate no longer trips on an mtime-only bump after a content-clean rebuild | After a plain (non-`--force`) rebuild, `spec-memory --help` and `spec-memory list-tools` exit `0`; an mtime-only touch of a watched source no longer produces a false stale-`69` |
| REQ-002 | A single offline smoke command/script verifies the 37/8/9 list-tools counts and stale-dist health with no daemon, build, or scan | Smoke run reports `spec-memory=37`, `code-index=8`, `skill-advisor=9` and a stale-dist health verdict; exit code reflects pass/fail; no daemon spawned, no trusted command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Plugin status surfaces an actionable stale-dist state distinct from generic skipped/fail-open, with stderr kept sanitized | Status payload distinguishes "dist stale, rebuild required"; raw stderr is still redacted to a sanitized marker (guardrail: keep stderr sanitized per assessment #10 risk) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A plain rebuild restores spec-memory CLI freshness (no permanent stale-`69`); mtime-only churn does not trip the gate.
- **SC-002**: The offline smoke check confirms 37/8/9 counts and stale-dist health with no daemon, build, or scan, and is runnable by CI and agents.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Loosening the freshness gate could mask a genuinely stale dist | Med | Gate on content hash rather than removing the gate; smoke check independently verifies dist health |
| Risk | Surfacing stale-dist status could leak raw stderr | Low | Keep stderr sanitized (assessment #10 guardrail); surface only a classified state + sanitized marker |
| Dependency | Offline smoke wraps the parity playbook scenario | Low | Reuse `cli-list-tools-parity.md:32-56` as the scenario source of truth |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the freshness gate use a content hash of watched sources, or should the build step always touch dist so the existing mtime gate stays valid?
- Should the offline smoke check live as a standalone script under `scripts/` or as a `smoke` subcommand on one of the CLIs?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
