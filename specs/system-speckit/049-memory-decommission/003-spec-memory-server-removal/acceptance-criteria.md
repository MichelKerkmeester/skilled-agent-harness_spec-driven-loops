---
title: "Acceptance Criteria: Phase 3: spec-memory-server-removal"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-spec-memory-server-removal"
    last_updated_at: "2026-09-02T11:04:54Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: spec-memory-server-removal

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/049-memory-decommission/003-spec-memory-server-removal
**Level:** 3
**Status:** Draft
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The seam rows AC-010 to AC-014 each carry the same rule. A mixed row, one that matches a memory term
inside a file with a surviving owner, is closed by a source-level edit that keeps the owner working.
A token deletion or a line drop does not satisfy the criterion even when the search comes back clean.
Surface inventory: `specs/system-speckit/049-memory-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five runtime config roots, When each is read after removal, Then none of `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json` or `opencode.json` declares a `system-spec-memory` server or grants its tools | `rg -n --no-ignore-global 'system-spec-memory' .claude/mcp.json .codex/config.toml .cursor/mcp.json .pi/mcp.json opencode.json` returns no match | Unmet | - |
| AC-002 | REQ-002 | Given a cold start in any runtime, When the session opens, Then no memory daemon process exists and no connection attempt or timeout notice appears in the session log | Session log plus `ps` output captured per runtime at boot | Unmet | - |
| AC-003 | REQ-002 | Given a completed session, When the launcher lease path is inspected, Then no memory launcher lock directory was created | Lease directory listing after a full session, plus `.system-spec-memory-launcher.json` absent | Unmet | - |
| AC-004 | REQ-002 | Given a session that has ended, When the process table is inspected, Then no orphan memory process survives it | `ps` after session exit, cross-checked with an `orphan-mcp-sweeper.sh` run reporting nothing stranded | Unmet | - |
| AC-005 | REQ-003 | Given the server tree is gone, When a live skill-advisor call is made, Then the advisor embedder resolves over the shared socket and returns a scored recommendation | A live advisor recommend call returning a score with no memory process running (T028) | Unmet | - |
| AC-006 | REQ-004 | Given an existing spec packet, When `validate.sh --strict` runs against it, Then it emits rule lines and an explicit `RESULT: PASSED` | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" <existing-packet> --strict` | Unmet | - |
| AC-007 | REQ-005 | Given `.env.example` and `ENV-REFERENCE.md`, When they are read after removal, Then no flag remains whose only owner was the removed subsystem, and every advisor, shared model-server and shared IPC flag is still present | Row-by-row diff of the removed flags against the preserve-set inventory from T003 | Unmet | - |
| AC-008 | REQ-006 | Given the final state, When the closing residue sweep runs, Then no live instruction, config, hook, bin or plugin path describes the removed tools as available, and every remaining hit is historical evidence or a resolved seam | `rg --json --ignore-case --no-ignore-global -g '!.git' -g '!node_modules' -g '!z_archive' 'system-spec-memory\|memory_[a-z_]+\|spec-memory' .` read by owner | Unmet | - |
| AC-009 | REQ-003 | Given the preserve set in `spec.md` section 3, When each of the five entries is checked after removal, Then each is present and working, proven positively rather than by an absent search hit | Preserve-set audit (T009) against the T003 inventory, one positive check per entry | Unmet | - |
| AC-010 | REQ-004 | Given seam 1, When the scripts package is built with the server tree absent, Then it compiles because `workflow.ts` carries a source-owned index and lease implementation rather than a deleted import | Package build with the tree gone, plus `scripts/core/workflow.ts:101-106,605-640` showing an edit, not a removed line | Unmet | - |
| AC-011 | REQ-002 | Given seam 2, When deploy, orphan and session cleanup run, Then the memory branch is gone by source edit and the advisor socket survives the pass | `scripts/deploy-mcp.sh:49-82`, `.opencode/scripts/orphan-mcp-sweeper.sh:204-212,296-301,409-434,504-515`, `.opencode/scripts/session-cleanup.sh:102-113` reviewed, plus a cleanup run leaving `hf-embed.sock` alive | Unmet | - |
| AC-012 | REQ-003 | Given seam 3, When the shared embedding and IPC files are read, Then only the memory-only DB branches were removed and the shared model-server socket path is intact | `shared/embeddings/adapter.ts:4-13`, `shared/embeddings/providers/hf-local.ts:32-35,371-382`, `shared/ipc/socket-server.ts:134,187,202-203`, confirmed by AC-005 | Unmet | - |
| AC-013 | REQ-003 | Given seam 4, When the deep loop runs, Then its MCP persistence is gone by source edit while locks, projections and reducer state still work | `.opencode/commands/deep/assets/deep-research-auto.yaml:1757-1782,2339-2347` and `system-deep-loop/runtime/tests/unit/deep-research-memory-upsert-yaml.vitest.ts:55-87`, plus the surviving suite passing | Unmet | - |
| AC-014 | REQ-006 | Given seam 5, When one artifact is regenerated per producer, Then the generated output contains no removed tool name, because the producer was updated before its consumers were deleted | `.opencode/install-guides/install-scripts/install-all.sh:5-34,209-223`, `.opencode/commands/create/assets/create-skill-auto.yaml`, `system-spec-kit/templates/addons/resource-map.md.tmpl:21-48`, plus a regenerated artifact | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
