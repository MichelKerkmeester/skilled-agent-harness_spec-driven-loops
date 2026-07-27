---
title: "Implementation Plan: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Plan for translating this repo's 5 native MCP servers and 10 external UTCP manuals into .pi/mcp.json via the third-party pi-mcp-extension package, gated first on a live stdio-transport verification."
trigger_phrases: ["pi mcp host integration plan", "pi-mcp-extension config"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T10:22:00Z"
    last_updated_by: "claude-code"
    recent_action: "Docs re-fetched live: stdio config now documented, narrowing REQ-002's scope"
    next_safe_action: "Commit as Blocked; a future execution phase installs pi-mcp-extension and runs Phase 1"
    blockers: ["Installing pi-mcp-extension is out of this phase's own Hard Constraint (planning only); deferred to a future execution phase"]
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-phase-007-planning", parent_session_id: null }
    completion_pct: 60
    open_questions: ["Which mechanism gives a safe Tier 2 opt-in for .pi/mcp.json specifically: project/global split, or a gitignored project-local file?"]
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pi MCP-host integration (pi-mcp-extension, third-party)

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | JSON config (`.pi/mcp.json`) targeting existing, unchanged Node.js stdio launchers under `.opencode/bin/`. |
| **Framework** | Model Context Protocol (MCP), hosted via the third-party `pi-mcp-extension` package — not a Pi-core framework. |
| **Storage** | None — this phase is config/policy design only, no database or persistence layer. |
| **Testing** | Live in-session verification only (`/mcp` or equivalent discovery). No fixture-only test meaningfully covers a host-integration config, mirroring `029/009`'s identical testing-strategy note. |

### Overview
Plan the translation of `.mcp.json`'s 5 native stdio servers into `.pi/mcp.json`'s documented shape via the third-party `pi-mcp-extension` package. A live docs re-fetch at this phase's closeout found stdio transport IS now documented (a `command`/`args`/`env` example alongside the remote `streamable-http` one this phase was originally authored against) — narrowing the primary open risk from "does stdio exist" to "does the documented stdio config actually connect in a live session," which remains unconfirmed and is deferred to a future execution phase (installing the package is out of this planning phase's own scope). Contingent on that future result, design (not yet commit) a two-tier deny-by-default mutation policy mirroring `029/009`'s intent, while explicitly flagging that the concrete enforcement mechanism differs from Devin's and is itself unconfirmed (no per-tool permission/deny field is documented in pi-mcp-extension's config schema).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement and scope documented in `spec.md`, including the third-party-package flag and the primary stdio-transport risk. [EVIDENCE: `spec.md` §2/§3]
- [x] REQ-002 (stdio transport support) is explicitly named as this phase's go/no-go gate before any further config design is treated as final. [EVIDENCE: `spec.md` §4 REQ-002, marked PRIMARY]
- [x] Dependencies (`001-pi-contract-pin`, `006-pi-agent-bridge`, the `pi-mcp-extension` package itself) identified. [EVIDENCE: `plan.md` §6, both internal deps now Complete]

### Definition of Done
- [x] (For this planning phase only) `spec.md`/`plan.md`/`tasks.md`/`checklist.md` fully authored with concrete, falsifiable acceptance criteria. [EVIDENCE: all 4 docs authored and closed out]
- [x] Every claim sourced from pi.dev documentation rather than live verification is explicitly marked as such. [EVIDENCE: `rg -c "UNCONFIRMED\|per pi.dev docs" spec.md plan.md`]
- [x] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` passes for this phase folder once authored. [EVIDENCE: `implementation-summary.md` Verification table]
- [B] REQ-002's live stdio-connection confirmation (installing pi-mcp-extension, authoring a single-entry `.pi/mcp.json` probe) [DEFERRED: out of this phase's own scope per its Hard Constraint - planning only, no `pi install` command run - a future execution phase performs this step]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-tier host config, mirroring `029/009`'s design intent: a committed, minimal, no-mutation-by-default tier, plus a maintainer-opt-in tier that is never silently inherited. The concrete file mechanics differ from Devin's, because Pi's documented config model is a **project/global split** (`.pi/mcp.json` overrides `~/.pi/agent/mcp.json`, "nested objects are merged" per the settings docs) rather than Devin's **committed/gitignored-local split** (`config.json` + `config.local.json` in the same directory). Which of these two shapes actually gives a safe Tier-2 opt-in for `.pi/mcp.json` specifically (not just `.pi/settings.json`) is an open question this phase's own live check must resolve — it is not assumed to carry over unchanged from Devin's precedent.

### Key Components
- **pi-mcp-extension** (third-party, `pi install npm:pi-mcp-extension`): the only reason `.pi/mcp.json` is read at all. Without it, Pi ignores MCP configuration entirely — this is not an optional add-on to a first-party feature, it *is* the feature.
- **`.pi/mcp.json` (Tier 1, committed)**: up to 5 stdio entries translated from `.mcp.json`, contingent on REQ-002. Holds no server/tool with an unrestricted default mutation allow.
- **Tier 2 (maintainer opt-in, mechanism TBD)**: either a project-local gitignored file (if pi-mcp-extension's project config is confirmed to layer the way Devin's did) or the maintainer's own global `~/.pi/agent/mcp.json` (if project always fully overrides global rather than merging, per the settings-docs quote which describes merge behavior for `settings.json` specifically, not confirmed for `mcp.json`).
- **`code_mode` entry**: a single stdio server that is itself the transitive gateway to all 10 external UTCP manuals (`chrome_devtools_1/2`, `aside`, `clickup_official`, `figma`, `github`, `gitkraken`, `open_design`, `refero`, `mobbin`) via `call_tool_chain`/`search_tools`/etc. Treated as its own policy surface, not folded into a blanket allow.

### Data Flow
A Pi session starts → pi-mcp-extension reads `.pi/mcp.json` (project), merged/overridden against `~/.pi/agent/mcp.json` (global, exact precedence TBD) → for each entry, pi-mcp-extension either spawns a local stdio process (if REQ-002 confirms support) or connects to a remote URL (the only documented path) → tools surface in-session, gated by whatever enforcement point REQ-005 confirms (pi-mcp-extension's own permission surface, Pi's core Security/tool-approval settings, or neither) → for `code_mode` specifically, a further internal hop happens inside the server process itself, reading `.utcp_config.json` to reach the 10 external manuals — Pi never talks to those 10 directly.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase is new host-integration planning, not a fix to existing behavior. No production code or shipped config is being changed; the only artifacts this phase produces are its own `spec.md`/`plan.md`/`tasks.md`/`checklist.md`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Live transport verification
Install pi-mcp-extension; author a minimal single-entry `.pi/mcp.json` registering only `sequential_thinking` (the lowest-risk probe — stateless, no repo write access, no credentials); observe the result via `/mcp` or equivalent. This single test resolves REQ-002 (the phase's primary go/no-go gate) before any further config work is trusted.

### Phase 2: Config and policy design
Contingent on Phase 1's result. If stdio is supported: translate the remaining 4 native servers, design the Tier 1/Tier 2 split, and make the explicit `call_tool_chain` policy decision. If stdio is unsupported: document the gap precisely (exact observed error/behavior) and scope the rest of the phase down to a documented limitation rather than a worked-around config.

### Phase 3: Verification
Live-verify the designed `/mcp` connected set matches expectations, exercise the deny-by-default enforcement point identified in REQ-005 against at least one real mutation tool per server, and run a rollback test.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live-session only | `pi-mcp-extension`'s `/mcp` (or equivalent) discovery and dispatch surface | Pi CLI in-session commands; no fixture/unit test meaningfully covers a host-integration config |
| Manual | Deny-by-default enforcement (a representative mutation tool per server, attempted without Tier 2 opt-in) | Live Pi session |
| Manual | Rollback (remove/disable the config; confirm no repository state changed) | `git status`, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-pi-contract-pin` | Internal | Complete — Pi CLI 0.82.1 installed, `pi install npm:<pkg> -l --approve` confirmed | Every live check in this phase assumes a working Pi session/headless contract; a future execution phase can proceed directly to Phase 1. |
| `006-pi-agent-bridge` | Internal | Complete — planning-only, immediate predecessor, sequencing only | No functional coupling — this phase does not depend on `pi-subagents` succeeding, only on phase ordering. |
| `pi-mcp-extension` (npm, third-party) | External | Unconfirmed until installed (REQ-001); docs re-fetched live 2026-07-27, v1.5.0, now documents stdio transport | Installing it is out of this planning phase's own scope; a future execution phase confirms it loads and connects. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Stdio transport confirmed unsupported (REQ-002 fails), or the deny-by-default enforcement point cannot be confirmed to exist at all (REQ-005 fails both branches).
- **Procedure**: Do not commit any `.pi/mcp.json` entry beyond the single `sequential_thinking` probe (or none at all if even that fails). Document the exact gap in this phase's own risk log and, once the `cli-pi` skill packet exists (phase 3), in `cli-pi/references/mcp-host-integration.md`. No repository database, launcher script, or source file is ever touched by this phase regardless of outcome — this phase's own blast radius is limited to files inside `.pi/` and its own spec folder.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
