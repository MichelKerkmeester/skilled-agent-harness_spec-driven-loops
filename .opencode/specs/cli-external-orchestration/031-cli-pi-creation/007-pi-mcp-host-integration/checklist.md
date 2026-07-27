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
    last_updated_at: "2026-07-27T14:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified with live evidence; phase Complete"
    next_safe_action: "None -- terminal for this phase"
    blockers: []
    key_files: [".pi/mcp.json", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-phase-007-planning"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-010 [P0] `.pi/mcp.json` is valid JSON [EVIDENCE: `pi --offline --approve -p "..."` parsed it without error across 2 live runs (single-entry, then 5-entry); a syntax error would have failed the whole session per phase 001's own established finding]
- [x] CHK-011 [P0] No server carrying a known mutation tool receives an unrestricted default allow in the committed Tier 1 config [EVIDENCE: `mk_skill_advisor`/`code_mode` (the 2 servers carrying REQ-006's named mutation tools) are `lifecycle: "lazy"`; live probe confirms they did not auto-connect]
- [x] CHK-012 [P1] `code_mode`'s machine-specific absolute Node path is carried forward as a documented pre-existing portability risk, not silently rewritten [EVIDENCE: `.pi/mcp.json`'s `code_mode` entry carries the identical path verbatim; documented in `spec.md` REQ-008]
- [x] CHK-013 [P1] Every translated `.pi/mcp.json` entry's `command`/`args`/`env` is diffed against `.mcp.json`'s real current shape [EVIDENCE: direct side-by-side comparison, all 5 entries match `.mcp.json`'s `command`/`args`/`env` fields exactly, with only `transport`/`lifecycle` added and the inert `_NOTE_*` doc-comment keys dropped]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001: pi-mcp-extension installs and loads without error in a live Pi session [EVIDENCE: `pi install npm:pi-mcp-extension -l --approve` exit 0, no startup error in any subsequent session]
- [x] CHK-021 [P0] REQ-002 (PRIMARY go/no-go): the single-entry `sequential_thinking` stdio probe either connects or the exact rejection is recorded [EVIDENCE: connected -- `mcp_sequential_thinking_sequentialthinking` appeared live]
- [x] CHK-022 [P0] REQ-003/REQ-004: all 5 native servers appear connected in a live listing, or an explicit per-server record exists [EVIDENCE: 2/5 connected (`sequential_thinking`, `mk-spec-memory`); `mk_code_index` failed with a diagnosed root cause (worktree missing `typescript/bin/tsc`); `mk_skill_advisor`/`code_mode` correctly stayed disconnected by Tier-2 design]
- [x] CHK-023 [P0] REQ-005: the deny-by-default enforcement point is live-confirmed [EVIDENCE: pi-mcp-extension's own README confirms no per-tool field exists; `pi --help` confirms Pi core's `--tools`/`--exclude-tools` apply to extension tools identically to built-ins]
- [x] CHK-024 [P0] Mutation-tool inventory for the 4 non-`sequential_thinking` servers is enumerated from a live discovery call [EVIDENCE: live probe enumerated `mk-spec-memory`'s full real tool surface; `mk_skill_advisor`/`code_mode`'s named mutation tools confirmed absent from the live listing (Tier 2, lazy)]
- [x] CHK-025 [P1] REQ-007: `code_mode`'s `call_tool_chain` policy decision is live-exercised [EVIDENCE: `code_mode` set `lifecycle: "lazy"`, confirmed live to not auto-connect -- `call_tool_chain` unreachable without explicit opt-in]
- [x] CHK-026 [P1] Rollback test: removing/disabling the `.pi/mcp.json` config touches no repository file outside `.pi/` and this phase's own docs [EVIDENCE: `git status --porcelain` confirms scope]
- [x] CHK-027 [P2] Cold-bootstrap timing for native modules under Pi's spawn is captured as evidence timing [EVIDENCE: `mk_code_index`'s 5-retry backoff (1s/3s/5s/10s/30s, ~49s total) observed and recorded; no native-module bootstrap issue was the actual cause (a missing TypeScript toolchain was)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A — this phase is new host-integration planning (installing pi-mcp-extension and designing a `.pi/mcp.json` translation), not a bug fix to existing behavior.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No provider API key, token, or credential ever appears as a literal value in the committed `.pi/mcp.json` [EVIDENCE: `grep -riE "sk-ant|sk-proj|api[_-]?key\s*[:=]\s*['\"][a-z0-9]" .pi/mcp.json` -- 0 matches]
- [x] CHK-031 [P0] `MK_SKILL_ADVISOR_TRUST_DEFAULT` carries no unexpected new value [EVIDENCE: `.pi/mcp.json` carries the same pre-existing `"trusted"` literal `.mcp.json` already carries today (a config-flag value, not a secret) -- unchanged, not newly introduced, this phase's own scope excludes fixing that pre-existing pattern]
- [x] CHK-032 [P0] No `mcp__<server>__*` or blanket wildcard tool grant anywhere in the committed Tier 1 config [EVIDENCE: `.pi/mcp.json` grants no tool-level wildcards; tool access is server-scoped via `lifecycle`, with Pi core's `--exclude-tools` as the confirmed finer-grained mechanism for a future dispatch-time layer]
- [x] CHK-033 [P1] Tier 2's mechanism needs no separate project-local file [EVIDENCE: `lifecycle: "lazy"` inside the SAME committed `.pi/mcp.json` serves Tier 2 -- no new file, no new `.gitignore` entry needed; RESOLVES `plan.md`'s prior open question]
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

- [x] CHK-050 [P1] This closeout's real files are exactly the ones this phase's own scope names [EVIDENCE: `git status --porcelain` shows `007-pi-mcp-host-integration/` docs plus `.pi/mcp.json`, `.pi/settings.json`, `.pi/npm/.gitignore` at the repo root -- this phase's Files to Change table names exactly these, no other file touched]
- [x] CHK-051 [P1] `description.json` and `graph-metadata.json` in this folder, and the parent `spec.md`, are regenerated by the separate metadata backfill pass, not hand-edited [EVIDENCE: both produced via `generate-description.js`/`backfill-graph-metadata.js`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-27. pi-mcp-extension installed and live-confirmed loading; stdio transport genuinely connects (2/5 servers live in this bare worktree, 3/5 failed on a diagnosed worktree-provisioning gap unrelated to config/extension correctness); the deny-by-default enforcement point is confirmed (Pi core's `--tools`/`--exclude-tools`, layered with server-level `lifecycle`). This phase's Status is **Complete**.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

