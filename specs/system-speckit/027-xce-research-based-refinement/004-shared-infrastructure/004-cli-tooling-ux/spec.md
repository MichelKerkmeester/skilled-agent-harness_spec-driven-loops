---
title: "Feature Specification: Daemon CLI Front-Door UX Hardening (Phase Parent)"
description: "Phase-parent packet hardening the UX, documentation, integration, and automation layers of 027's three daemon-backed CLI front-doors (spec-memory, code-index, skill-advisor)."
trigger_phrases:
  - "cli tooling ux hardening"
  - "daemon cli front door"
  - "spec-memory stale dist gate"
  - "cli list-tools smoke"
  - "cli help aliases errors"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux"
    last_updated_at: "2026-06-11T03:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All 5 CLI-tooling child phases shipped; deep-review CONDITIONAL remediated"
    next_safe_action: "None; phase complete, deep-reviewed, and remediated"
    blockers: []
    key_files:
      - "spec.md"
      - "001-cli-freshness-and-smoke/spec.md"
      - "002-cli-help-aliases-errors/spec.md"
      - "003-cli-reference-and-skill-docs/spec.md"
      - "004-cli-fallback-envelope-and-bridge/spec.md"
      - "005-cli-automation-compact-completion/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-cli-tooling-ux"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "016 belongs inside 027 because the three daemon CLI front-doors were built by 027 phase 010 (mcp-to-cli-tool-transition)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Daemon CLI Front-Door UX Hardening (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Handoff Criteria** | Each sub-phase ships and validates independently; CLI tool coverage stays untouched (UX/docs/integration/automation only) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
027 phase 010 (`010-mcp-to-cli-tool-transition`) shipped three daemon-backed CLI front-doors over the existing mk-* MCP daemons: spec-memory (`.opencode/bin/spec-memory.cjs` -> `system-spec-kit/mcp_server/spec-memory-cli.ts`, 37 tools), code-index (`.opencode/bin/code-index.cjs` -> `system-code-graph/mcp_server/code-index-cli.ts`, 8 tools), and skill-advisor (`.opencode/bin/skill-advisor.cjs` -> system-skill-advisor cli, 9 tools). Tool coverage is registry-backed, with an explicit parity guard for code-index that requires manual acceptance when the shared tool schema changes. The gaps are in the UX, documentation, integration, and automation layers around those CLIs, not in coverage. A live bug confirms the gap: the spec-memory shim's mtime-based freshness gate (`.opencode/bin/spec-memory.cjs:24-42`) trips permanently when a watched source file's mtime bumps without a content change, because `tsc --build` is content-hash incremental and will not rewrite dist (a plain rebuild is a no-op; only `tsc --build --force` restores it), so the advertised offline parity check exits `69` until manually worked around.

### Purpose
Harden the UX, documentation, integration, and automation around 027's three daemon CLI front-doors so the advertised offline fallback parity check works durably, discoverability does not require a warm daemon, recovery guidance is in one canonical place, hook consumers see a normalized fallback envelope, and machine automation can consume compact tool lists and shell completion. Tool coverage is explicitly NOT in scope; this packet improves the layer around the tools, not the tool set.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level; optional cross-cutting docs may also live here. All detailed planning, task breakdowns, checklists, and continuity live inside the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Durable fix + offline health surface for the spec-memory stale-dist freshness gate, plus a unified offline smoke check of the 37/8/9 list-tools counts (sub-phase 001).
- Per-command help/schema, consistent command aliases, and improved unknown-command errors across the three CLIs (sub-phase 002).
- One unified Daemon CLI Reference page plus per-system SKILL.md recovery/exit-code documentation and `jsonl` clarification (sub-phase 003).
- Normalized warm-fallback result envelopes/reason codes across the three hook helpers, plus a prompt-time allowlist on the spec-memory plugin bridge (sub-phase 004).
- Machine-friendly compact/names-only list-tools output and generated shell completion across the three CLIs (sub-phase 005).

### Out of Scope
- Tool coverage changes (the CLIs are registry-backed; code-index also has an explicit parity guard that must be manually accepted when the shared schema changes).
- Making the CLI the primary transport (CLI is additive; MCP remains primary).
- Cold-spawning daemons from prompt-time hooks (violates the documented warm-only latency/safety contract).
- A full interactive TUI/wizard, a daemon-backed `describe` command, or collapsing the three CLIs into one monolithic CLI.

### Files to Change
Summary of aggregate file scope across all sub-phases. Per-phase detail and exact file:line evidence live in each child's spec.md and plan.md. This phase is scaffold-only; no CLI source is edited here.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/bin/spec-memory.cjs` freshness gate + offline smoke script | Modify/Create | 001 | Durable stale-dist fix + unified offline smoke |
| spec-memory + code-index CLI help/alias/error paths | Modify | 002 | Per-command help, aliases, better unknown-command errors |
| Unified Daemon CLI Reference + per-system SKILL.md docs | Create/Modify | 003 | Documentation consolidation + `jsonl` clarification |
| Three hook fallback helpers + spec-memory plugin bridge | Modify | 004 | Normalized envelope/reason codes + prompt-time allowlist |
| Three CLI list-tools output + shell completion generation | Modify/Create | 005 | Compact JSON + shell completion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-cli-freshness-and-smoke/` | Durable spec-memory stale-dist fix, actionable stale-dist plugin status, and a unified offline smoke check of the 37/8/9 list-tools counts (assessment #1 + #10 + #13) | Complete |
| 002 | `002-cli-help-aliases-errors/` | Per-command help/schema for spec-memory + code-index, consistent snake/kebab/camel aliases across all three, and better unknown-command errors with a list-tools hint + closest-match suggestion (assessment #2 + #3 + #4) | Complete |
| 003 | `003-cli-reference-and-skill-docs/` | One unified Daemon CLI Reference page, per-system SKILL.md recovery/exit-code docs, and `jsonl` single-line-payload clarification (assessment #5 + #6 + #7) | Complete |
| 004 | `004-cli-fallback-envelope-and-bridge/` | Normalized warm-fallback result envelopes/reason codes across the three hook helpers and an explicit prompt-time allowlist on the spec-memory plugin bridge (assessment #8 + #9) | Complete |
| 005 | `005-cli-automation-compact-completion/` | Machine-friendly compact/names-only list-tools output and generated bash/zsh shell completion across the three CLIs (assessment #11 + #12) | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Parent spec tracks aggregate progress via this map.
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase.
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| 001-cli-freshness-and-smoke | 005-cli-automation-compact-completion | The offline smoke check and stale-dist health surface exist before automation consumes compact list-tools output. | 001 validation evidence; smoke script runs without a daemon/build/scan. |
| 002-cli-help-aliases-errors | 005-cli-automation-compact-completion | Aliases and per-command help land before completion generation reads the same manifests. | 002 alias-collision test evidence. |
| 003-cli-reference-and-skill-docs | (none) | Documentation phase is independent; links the smoke/help/envelope surfaces produced by 001/002/004. | 003 doc review evidence. |
| 004-cli-fallback-envelope-and-bridge | (none) | Envelope normalization is additive; hook consumers keep working on current shapes during rollout. | 004 envelope contract tests. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:rejected -->
## REJECTED / OUT OF SCOPE

The CLI tooling assessment evaluated and rejected the following ideas. They are recorded here so future phases do not re-litigate them:

| Idea | Reason rejected |
|------|-----------------|
| Make the CLI the primary transport replacing MCP | Docs correctly state the CLI is additive and MCP remains primary (`README.md:110`, `ENV_REFERENCE.md:540`). |
| Cold-spawn daemons from prompt-time hooks for reliability | Violates the documented latency/safety contract (`ENV_REFERENCE.md:542`, `AGENTS.md:135-143`). Prompt-time stays warm-only. |
| Build a full interactive TUI/wizard | Not worth it for daemon fallback CLIs; per-command help, compact JSON, and completion solve the practical DX gaps with far less surface area. |
| Add a separate daemon-backed `describe` command | Unnecessary if per-command help is local/offline; discoverability must not depend on a warm daemon. |
| Collapse the three CLIs into one monolithic CLI | Thin daemon-specific shims map cleanly to ownership and failure domains; a small offline smoke script covers the cross-cutting automation need. |
<!-- /ANCHOR:rejected -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the unified Daemon CLI Reference live under `system-spec-kit/` docs or at a cross-cutting top-level location, given it spans three skills?
- Should shell completion generation be wired into a build/CI step, or remain an on-demand `completion` command per CLI?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md, implementation-summary.md.
- **Parent Spec**: See `../spec.md` (027 phase parent).
- **Origin phase**: See `../010-mcp-to-cli-tool-transition/` for the dual-stack CLI front-doors this packet hardens.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer.
