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
    packet_pointer: "system-speckit/033-system-speckit-v4/017-memory-database-decommission/003-spec-memory-server-removal"
    last_updated_at: "2026-09-03T21:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed all fourteen acceptance rows"
    next_safe_action: "Take the three open decisions to the operator, then start phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-003-spec-memory-server-removal"
      parent_session_id: null
    completion_pct: 100
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

**Packet:** system-speckit/033-system-speckit-v4/017-memory-database-decommission/003-spec-memory-server-removal
**Level:** 3
**Status:** Complete
**Date:** 2026-09-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

The seam rows AC-010 to AC-014 each carry the same rule. A mixed row, one that matches a memory term
inside a file with a surviving owner, is closed by a source-level edit that keeps the owner working.
A token deletion or a line drop does not satisfy the criterion even when the search comes back clean.
Surface inventory: `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five runtime config roots, When each is read after removal, Then none of `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.pi/mcp.json` or `opencode.json` declares a `system-spec-memory` server or grants its tools | Grep count 0 in each of the five roots: no declaration and no grant survives in any runtime | Met | - |
| AC-002 | REQ-002 | Given a cold start in any runtime, When the session opens, Then no memory daemon process exists and no connection attempt or timeout notice appears in the session log | Cold boot per runtime from the worktree with a non-interactive one-word prompt: claude, codex and pi exit 0, cursor exits 0 with the trust flag, opencode booted and created its session but exited 124 on a provider stream error from the flash model rather than an MCP error. In all five, zero memory processes afterwards and zero memory mentions or timeout notices in stderr | Met | - |
| AC-003 | REQ-002 | Given a completed session, When the launcher lease path is inspected, Then no memory launcher lock directory was created | No launcher lock directory was created by any of the five boots. The `/tmp/system-spec-memory` subdirectories on the machine predate them and belong to the main checkout's still-running daemon on another branch, and `.opencode/bin/system-spec-memory-launcher.cjs` is deleted | Met | - |
| AC-004 | REQ-002 | Given a session that has ended, When the process table is inspected, Then no orphan memory process survives it | Zero memory processes after each of the five boots; `orphan-mcp-sweeper.sh` lost its memory context-server branch and strands nothing, with the advisor socket surviving the pass (orphan-sweeper-ipc-preserve test 7 pass) | Met | - |
| AC-005 | REQ-003 | Given the server tree is gone, When a live skill-advisor call is made, Then the advisor embedder resolves over the shared socket and returns a scored recommendation | `node .opencode/bin/skill-advisor.cjs advisor_recommend` returns scored recommendations, exit 0, and `advisor_status` reports freshness live, from a daemon running the worktree's pruned code with no memory process | Met | - |
| AC-006 | REQ-004 | Given an existing spec packet, When `validate.sh --strict` runs against it, Then it emits rule lines and an explicit `RESULT: PASSED` | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/system-deep-loop/040-cli-lineage-nesting-and-containment-guard --strict` (that packet merged 2026-09-05 to `specs/system-deep-loop/036-deep-loop-innovation/028-cli-lineage-nesting-and-containment-guard`): rule lines emitted, Errors 0, Warnings 0, `RESULT: PASSED`, exit 0. `repair-derived.cjs` inspected=1 repairable=0 failed=0 and a continuity save through `generate-context.js` exit 0 with the graph-metadata refresh logged | Met | - |
| AC-007 | REQ-005 | Given `.env.example` and `ENV-REFERENCE.md`, When they are read after removal, Then no flag remains whose only owner was the removed subsystem, and every advisor, shared model-server and shared IPC flag is still present | `.env.example` lost 190 engine-only rows and its memory-titled sections, 409 to 220 names, and every remaining `SPECKIT` row has a live reader or a shared owner. `ENV-REFERENCE.md` 351 to 146 documented variables and 856 to 480 lines, every row with a verified reader; env-reference-drift test 5 pass, exit 0 | Met | - |
| AC-008 | REQ-006 | Given the final state, When the closing residue sweep runs, Then no live instruction, config, hook, bin or plugin path describes the removed tools as available, and every remaining hit is historical evidence or a resolved seam | Sweep from the worktree root in the final state, now covering `mcp-server` because its exclusion was removed and the sweep test updated (29 pass): live 0, livePaths 0 across 3,171 paths and 30,705 records, with 43 reasoned allowlist entries carrying the historical evidence | Met | - |
| AC-009 | REQ-003 | Given the preserve set in `spec.md` section 3, When each of the five entries is checked after removal, Then each is present and working, proven positively rather than by an absent search hit | Advisor: a live scored recommendation with no memory process (AC-005). Shared model server and `hf-embed` socket: the live two-launcher test, 3 passed 2 skipped, plus `hf-local`'s default socket directory `/tmp/system-hf-embed`. Deep-loop locks, projections and reducers: full runtime suite, 153 files and 2,534 tests, exit 0. Historical evidence: carried by the 43 reasoned allowlist entries. Generic graph and completion infrastructure: `validate.sh --strict` PASSED and the graph-metadata refresh logged | Met | - |
| AC-010 | REQ-004 | Given seam 1, When the scripts package is built with the server tree absent, Then it compiles because `workflow.ts` carries a source-owned index and lease implementation rather than a deleted import | `scripts/core/workflow.ts` also lost its provider retry-manager dynamic import and the step that processed the embedding retry queue, because no source retries any more — an edit, not a removed line. Package build, workspace build from a wiped dist and typecheck each exit 0 with the engine gone, and `finalize-dist` now checks real artifacts where it previously passed on stale dist residue | Met | - |
| AC-011 | REQ-002 | Given seam 2, When deploy, orphan and session cleanup run, Then the memory branch is gone by source edit and the advisor socket survives the pass | `deploy-mcp.sh`, `orphan-mcp-sweeper.sh` and `session-cleanup.sh` each lost their memory context-server branch by source edit while the advisor socket survives: orphan-sweeper-ipc-preserve test 7 pass | Met | - |
| AC-012 | REQ-003 | Given seam 3, When the shared embedding and IPC files are read, Then only the memory-only DB branches were removed and the shared model-server socket path is intact | `shared/embeddings/adapter.ts`, `providers/hf-local.ts` and `shared/ipc/socket-server.ts` carry only shared model-server paths, with `hf-local` defaulting to the socket directory `/tmp/system-hf-embed`; proven live by the two-launcher test, 3 passed 2 skipped, and by AC-005 | Met | - |
| AC-013 | REQ-003 | Given seam 4, When the deep loop runs, Then its MCP persistence is gone by source edit while locks, projections and reducer state still work | `deep-research-auto.yaml` and the deep-loop runtime lost their MCP persistence while locks, projections and reducers work: full deep-loop suite, 153 files and 2,534 tests, exit 0 | Met | - |
| AC-014 | REQ-006 | Given seam 5, When one artifact is regenerated per producer, Then the generated output contains no removed tool name, because the producer was updated before its consumers were deleted | `install-all.sh`, `create-skill-auto.yaml` and the resolver template each regenerate with no removed tool name, and the sweep of the fresh output is live 0 | Met | - |

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

**Closeable:** Yes

AC-008 and AC-009 carried the phase: the closing sweep now includes the `mcp-server` tree it used to
exclude and still returns zero live records, and every preserve-set entry was proven by something
running rather than by a search that found nothing. Consciously left out: the removal is partial
under option A, so the package survives as the spec-kit engine at 333 files instead of being deleted
whole; the eight dependencies that now have no importer were left in `package.json` because removing
them regenerates a lockfile shared with the main checkout; and the shared model server's default
spawner, `lib/description/repair.ts`, the stale sk-doc frozen manifest and the unbumped frontmatter
versions are recorded as limitations rather than fixed here.
<!-- /ANCHOR:closure -->
