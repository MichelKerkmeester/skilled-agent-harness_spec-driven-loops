---
title: "Verification Checklist: Pi MCP-host integration (pi-mcp-extension, third-party)"
description: "Verification checklist for the Pi MCP-host integration phase (pi-mcp-extension, third-party package)."
trigger_phrases:
  - "pi mcp host integration checklist"
  - "pi-mcp-extension checklist"
  - "pi mcp.json verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/007-pi-mcp-host-integration"
    last_updated_at: "2026-07-27T10:22:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pre-work items closed out live; install-dependent items deferred, phase Blocked"
    next_safe_action: "Commit as Blocked; phase 008 proceeds independently"
    blockers: ["Installing pi-mcp-extension and live-confirming its now-documented stdio config is out of this phase's own scope; deferred to a future execution phase"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-007-planning"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi MCP-host integration (pi-mcp-extension, third-party)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements (REQ-001 through REQ-008), success criteria (SC-001 through SC-005), and the third-party-package flag are documented in `spec.md` [EVIDENCE: `spec.md:127` §4, 8/8 REQs present]
- [x] CHK-002 [P0] Technical approach (two-tier deny-by-default design, Phase 1-3 structure gated on REQ-002) defined in `plan.md` [EVIDENCE: `plan.md:71` §3 Architecture, `plan.md:97` §4 Phase 1-3]
- [x] CHK-003 [P0] `001-pi-contract-pin`'s live headless/session contract is confirmed available, and `006-pi-agent-bridge`'s status is confirmed (sequencing-only predecessor, no functional coupling) before any task in this phase starts [EVIDENCE: both re-confirmed Complete during this closeout, `plan.md` §6 dependency table]
- [x] CHK-004 [P1] pi-mcp-extension's package docs page (https://pi.dev/packages/pi-mcp-extension) is re-read live before authoring any config, since the docs snapshot informing this planning pass may have drifted by execution time [EVIDENCE: live WebFetch of `pi.dev/packages/pi-mcp-extension` during closeout - v1.5.0 now documents stdio transport, a material update from the authoring-time snapshot]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [B] CHK-010 [P0] Any authored `.pi/mcp.json` is valid JSON (`jq empty` or equivalent passes) [DEFERRED: no `.pi/mcp.json` file exists yet - authoring it is out of this planning phase's own scope, deferred to a future execution phase]
- [B] CHK-011 [P0] No server carrying a known mutation tool receives an unrestricted default allow in the committed Tier 1 config [DEFERRED: no Tier 1 config is committed by this phase; the policy intent is designed (`plan.md` §3, `tasks.md` T011) but not yet enforced in a real file]
- [x] CHK-012 [P1] `code_mode`'s machine-specific absolute Node path (`/Users/michelkerkmeester/.nvm/versions/node/v24.9.0/bin/node`, per `.mcp.json`'s current entry) is carried forward as a documented pre-existing portability risk, not silently rewritten [EVIDENCE: re-confirmed live via direct read of `.mcp.json`, path present verbatim; documented in `spec.md` REQ-008]
- [B] CHK-013 [P1] Every translated `.pi/mcp.json` entry's `command`/`args`/`env` is diffed against `.mcp.json`'s real current shape [DEFERRED: no entries are translated yet since `.pi/mcp.json` authoring is out of scope; `.mcp.json`'s real current shape was itself re-read live this closeout and confirmed to match spec.md's description exactly (5 servers, same command/args/env structure)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [B] CHK-020 [P0] REQ-001: pi-mcp-extension installs and loads without error in a live Pi session [DEFERRED: installing pi-mcp-extension is out of this planning phase's own scope (Hard Constraint); install verb re-confirmed unchanged (`pi install npm:pi-mcp-extension`) via the live docs re-fetch, but not yet executed]
- [B] CHK-021 [P0] REQ-002 (PRIMARY go/no-go): the single-entry `sequential_thinking` stdio probe either connects or the exact rejection is recorded [DEFERRED: requires installing pi-mcp-extension, out of this phase's own scope; the docs re-fetch narrowed the question (stdio config is now documented) but did not resolve whether it connects live]
- [B] CHK-022 [P0] REQ-003/REQ-004: if CHK-021 confirms stdio support, all 5 native servers appear connected in a live `/mcp` listing [DEFERRED: gated on CHK-021]
- [B] CHK-023 [P0] REQ-005: the deny-by-default enforcement point is live-confirmed [DEFERRED: requires a live installed session; docs confirm no per-tool field exists in pi-mcp-extension's own schema, but whether Pi's core Security settings substitute is unconfirmed without an install]
- [B] CHK-024 [P0] Mutation-tool inventory for the 4 non-`sequential_thinking` servers is enumerated from a live discovery call [DEFERRED: requires a live installed session; the source-inspection cross-check was re-verified this closeout via direct `.mcp.json` read]
- [B] CHK-025 [P1] REQ-007: `code_mode`'s `call_tool_chain` policy decision is live-exercised [DEFERRED: requires a live installed session]
- [B] CHK-026 [P1] Rollback test: removing/disabling the `.pi/mcp.json` config touches no repository file outside `.pi/` [DEFERRED: no config exists yet to roll back; this closeout's own edits are independently confirmed scoped to this phase folder via `git status --porcelain`]
- [B] CHK-027 [P2] Cold-bootstrap timing for native modules under Pi's spawn is captured as evidence timing [DEFERRED: requires a live installed session]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — this phase is new host-integration planning (installing pi-mcp-extension and designing a `.pi/mcp.json` translation), not a bug fix to existing behavior.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [B] CHK-030 [P0] No provider API key, token, or credential ever appears as a literal value in a committed `.pi/mcp.json` entry [DEFERRED: no `.pi/mcp.json` exists yet to check; the policy requirement is documented in `spec.md` REQ-006/plan.md's Tier design for a future execution phase to enforce]
- [B] CHK-031 [P0] `grep -r "MK_SKILL_ADVISOR_TRUST_DEFAULT" .pi/mcp.json` (once authored) returns zero literal-value matches [DEFERRED: no `.pi/mcp.json` exists yet; re-confirmed live this closeout that `.mcp.json` itself DOES carry a literal `"trusted"` value for this env var today - a pre-existing Claude/OpenCode-side pattern, out of this phase's scope to fix, but worth carrying forward as a caution for whoever authors the Pi translation]
- [B] CHK-032 [P0] No `mcp__<server>__*` or blanket wildcard tool grant anywhere in the committed Tier 1 config [DEFERRED: no Tier 1 config is committed by this phase]
- [B] CHK-033 [P1] If REQ-006 confirms Tier 2 needs a project-local file, that file is added to `.gitignore` and confirmed gitignored [DEFERRED: REQ-006's mechanism question (global vs. project-local) is itself unresolved without a live pi-mcp-extension session, per `plan.md`'s own open question]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Every claim sourced from pi.dev documentation rather than confirmed live Pi behavior is explicitly marked as such in `spec.md`/`plan.md` [EVIDENCE: `rg -c "UNCONFIRMED\|per pi.dev docs" spec.md plan.md` — non-zero in both]
- [x] CHK-041 [P1] `spec.md`/`tasks.md` name the future target path `.opencode/skills/cli-external-orchestration/cli-pi/references/mcp-host-integration.md` [EVIDENCE: `spec.md:119` Files to Change table, `tasks.md` Cross-References]
- [x] CHK-042 [P1] REQ-002's outcome is recorded plainly enough that `008-pi-hook-extension-layer` and `009-pi-model-registry-and-routing` can consume it without re-deriving it [EVIDENCE: `implementation-summary.md` Known Limitations records the docs-drift finding and the still-open live-connection gap]
- [x] CHK-043 [P2] The community-maintained/version-drift risk for pi-mcp-extension is recorded in `spec.md`'s risk log [EVIDENCE: `spec.md` §6 Risks table, version pinned to `1.5.0` per this closeout's live re-fetch]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] This authoring pass modifies no file outside `007-pi-mcp-host-integration/` [EVIDENCE: `git status --porcelain` scoped to `031-cli-pi-creation/007-pi-mcp-host-integration/` only]
- [x] CHK-051 [P1] `description.json` and `graph-metadata.json` in this folder, and the parent `spec.md`, are regenerated by the separate metadata backfill pass, not hand-edited [EVIDENCE: both produced via `generate-description.js`/`backfill-graph-metadata.js`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 4/14 (+10 accepted-deferred, all install-dependent) |
| P1 Items | 10 | 6/10 (+4 accepted-deferred) |
| P2 Items | 2 | 0/2 (+2 accepted-deferred) |

**Verification Date**: 2026-07-27. All achievable pre-work (docs re-fetch, dependency status, source-tree re-reads) is complete and re-verified live — most notably, the docs re-fetch found pi-mcp-extension now documents stdio transport, narrowing REQ-002's premise. Every install-dependent item (CHK-010/011/013/020-027/030-033) is accepted-deferred with an explicit reason, not silently skipped: installing pi-mcp-extension crosses this planning phase's own Hard Constraint. This phase's Status is **Blocked**, not Complete — CHK-021 (the primary stdio-connection go/no-go gate) remains the first item any future execution phase must resolve.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

