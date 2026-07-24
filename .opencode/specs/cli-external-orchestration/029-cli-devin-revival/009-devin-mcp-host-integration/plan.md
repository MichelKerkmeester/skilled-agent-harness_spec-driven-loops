---
title: "Implementation Plan: Devin MCP-host integration"
description: "Plan for registering this repo's 3 MCP servers with Devin CLI under a two-tier deny-by-default permission policy."
trigger_phrases: ["devin mcp host integration plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/009-devin-mcp-host-integration"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 plan: dependency graph, critical path, milestones, ADR pointer"
    next_safe_action: "Live-verify devin mcp surface, then enumerate mutation tools"
    blockers: ["devin auth login needed for live verification"]
    key_files: ["spec.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does Devin normalize hyphenated server IDs to underscores?"]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin MCP-host integration

<!-- ANCHOR:summary -->
## 1. SUMMARY
Register 3 stdio MCP servers with Devin under a two-tier permission policy (shared deny-by-default project config + maintainer-local opt-in override), then live-verify discovery, deny enforcement, deny-survival, cross-session-mode resolution, and rollback safety.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- No server-wide or global MCP permission wildcard anywhere in the committed config.
- `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` never appears in the committed `.devin/config.json`.
- Every mutation tool has an explicit deny/ask entry, enumerated from a live `tools/list`, not source inspection alone.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Two-tier config: Tier 1 (`.devin/config.json`, committed) holds the 3 stdio server registrations and the exact per-tool permission matrix (deny-by-default for mutations). Tier 2 (`.devin/config.local.json`, gitignored) holds any maintainer-chosen opt-in (explicit trust for advisor mutations, provider secrets) and is never inherited by anyone who hasn't created their own copy.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
None - this is new-file creation, not a fix to existing behavior.
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Live contract and mutation-tool enumeration
Live-verify `devin mcp add/list/get/remove/enable/disable` + config schema; confirm namespace normalization and the absence of a `cwd` field; enumerate the exact mutation-tool list per server from a live `tools/list` call.

### Phase 2: Config and policy authoring
Write `.devin/config.json` (Tier 1), `.devin/config.local.json.example` (Tier 2 template), update `.gitignore`, and author the reference doc.

### Phase 3: Live verification
Run the full acceptance matrix: discovery, deny enforcement, deny-survival against a broad grant, cross-session-mode resolution, cold-bootstrap evidence, rollback test.

### Phase 4: Closeout
Re-evaluate `mcp-route-guard.cjs`'s dormancy (phase 008); finalize `implementation-summary.md`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
All testing here is live-session testing against an authenticated `devin` instance - there is no meaningful fixture-only test for a host-integration config. The acceptance matrix in `spec.md` §5/§12 and `checklist.md` is the test plan.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
`001-devin-contract-pin` only (Complete). Not blocked by 002-008. Shares the packet-wide `devin auth login` blocker.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`devin mcp remove` all 3 entries, or delete `.devin/config.json`'s `mcpServers` block. No repository database or source file is ever touched by this phase - confirmed by REQ-verification, not assumed.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Phase 1 (contract/enumeration) gates Phase 2 (config authoring), which gates Phase 3 (live verification), which gates Phase 4 (closeout).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
Medium - config/policy authoring is contained, but the live acceptance matrix (7 criteria) is thorough and each requires an authenticated session.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
No feature flag needed - additive, Devin-only, no data migration.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
`001-devin-contract-pin` → Phase 1 (contract/enumeration) → Phase 2 (config authoring) → Phase 3 (live verification) → Phase 4 (closeout, incl. phase 008 cross-reference).
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 mutation-tool enumeration** - CRITICAL, everything downstream depends on an accurate, live-verified list
2. **Phase 2 config authoring** - CRITICAL
3. **Phase 3 live verification** - CRITICAL

**Parallel Opportunities**: the reference doc (part of Phase 2) can be drafted in parallel with the config files once the policy shape is settled.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|---|---|---|
| M1 | Contract + mutation list confirmed | Live `tools/list` enumerated for all 3 servers |
| M2 | Config authored | `.devin/config.json` + template + gitignore complete |
| M3 | Acceptance matrix passed | All 7 live-verification criteria pass |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

4 ADRs govern this phase: the two-tier permission policy itself (ADR-001), the additive-phase confirmation (ADR-002), the embedding/network tier choice (ADR-003), and the working-directory/cold-bootstrap contract (ADR-004). See `decision-record.md` for full context, alternatives, consequences, and rollback notes.

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirmed phase 001 is Complete (it already is)
- [ ] Confirmed all 4 ADRs in `decision-record.md` are Accepted before writing config
- [ ] Confirmed an authenticated `devin` session is available for the live acceptance matrix, or explicitly deferred with a documented reason

### Execution Rules
| Rule | Requirement |
|---|---|
| TASK-SEQ | Enumerate mutation tools live (Phase 1) before finalizing any deny/ask rule (Phase 2) |
| TASK-SCOPE | Touch only `.devin/config.json`, `.devin/config.local.json.example`, `.gitignore`, and the new reference doc - never edit the 3 servers' own source or the launcher scripts |

### Status Reporting Format
Report each completed task as `T### done: <one-line evidence>`; report blocked tasks as `T### blocked: <reason>`.

### Blocked Task Protocol
If live evidence shows a mutation tool was missed in the initial enumeration, or that a deny rule doesn't survive a broader grant, mark the affected task `[B]`, record the actual observed behavior, and fix the policy before claiming the acceptance matrix passed - do not report partial coverage as complete.
<!-- /ANCHOR:ai-execution -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`, `decision-record.md`
