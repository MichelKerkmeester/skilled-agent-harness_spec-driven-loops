---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/020-obsidian-plugin-reduction/003-hub-routing-and-validation"
    last_updated_at: "2026-09-11T06:42:02Z"
    last_updated_by: "orchestrator"
    recent_action: "Pruned hub routing vocabulary and ran the four gates"
    next_safe_action: "Packet complete; operator decides whether to commit"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/hub-router.json"
      - ".opencode/skills/mcp-tooling/mode-registry.json"
      - ".opencode/skills/mcp-tooling/leaf-manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "orchestrator-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->

## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 3 of 3 |
| **Status** | Complete |
| **Date** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Executor** | DeepSeek V4.1 Flash at `--thinking max`, dispatched through `cli-pi` over the DevPass gateway |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->

## What Was Built

Three files under `.opencode/skills/mcp-tooling/` now describe the reduced mode.

| File | Change |
|------|--------|
| `hub-router.json` | Dropped `charts-render`, `dataview-query`, `outliner-editing` and `vault-git` from the mcp-obsidian class list and deleted those four vocabulary-class definitions. 51 lines removed |
| `mode-registry.json` | Removed twelve alias phrases from the mcp-obsidian mode, leaving 26. 12 lines removed |
| `leaf-manifest.json` | The mcp-obsidian leaf list fell from 83 to 26, dropping exactly the 57 deleted files |

Two further surfaces were repaired after an adversarial review found them, both outside the
original scope but broken by this packet's own deletions.

| File | Change |
|------|--------|
| `mcp-tooling/mcp-notion/references/migration-inventory.md` | Three recovery-routing pointers into deleted mcp-obsidian doc sets, repointed at the migration method and the plugins' own documentation |
| `system-spec-kit/runtime/data/trigger-index.json` and its `retrieval/fixtures/` manifest pair | Regenerated. The committed index still mapped live phrases onto 61 deleted files and predated the release; it now carries zero dead mcp-obsidian paths and indexes changelog v0.24.0.0 |

`graph-metadata.json` was deliberately not edited, per ADR-005.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->

## How It Was Delivered

One dispatch to DeepSeek V4.1 Flash through `cli-pi` for `hub-router.json` and `mode-registry.json`,
briefed with the exact entries to remove and the exact list that had to remain.

`leaf-manifest.json` changed outside any declared write boundary during an earlier dispatch. It is
a generated artifact, and the hub gate's byte-drift check confirms it matches a fresh regeneration,
so the content was audited and accepted rather than reverted: all 57 removed leaves are genuinely
deleted files, no leaf was added, and the other eight modes' leaf counts are unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->

## Key Decisions

ADR-005 was verified rather than assumed: a scan of `graph-metadata.json` for removed-plugin
vocabulary returned zero hits, and a grep for health vocabulary returned zero, so stage-one advisor
scoring needed no edit.

ADR-006 held. The compiled router answers `{"servingAuthority":"legacy"}` for this hub, which means
`hub-router.json` is read at request time and no bundle rebuild was warranted.

`excalidraw-drawing` was left in place. Excalidraw was removed from the vault in August, so that
vocabulary class is already stale, but it predates this packet and is reported rather than fixed.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->

## Verification

Each gate was run from the final state with its known failure mode countered.

- Per-hub check, hub path passed explicitly: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling` printed `Parent skill: .opencode/skills/mcp-tooling` in its subject line and closed with `OK: parent-skill-check — all hard invariants passed, 0 warnings`. Check `5c` confirms all 21 referenced vocabulary classes are defined, `5d` that every router resource path resolves, and `10b-byte-drift` that the committed leaf manifest matches a fresh regeneration byte for byte.
- Both JSON files parse. The mcp-obsidian class list holds six entries and none of the four removed classes is still defined. The alias list holds 26 entries.
- Route replay through the live advisor: `iconic icon rules rulebook` scores `mcp-tooling` at 0.829, above the 0.8 invocation bar. `dataview query dql inline field` returns no recommendation at all, so removed vocabulary no longer claims this hub.
- Repository-wide residue scan for `references/plugins/<removed>/` paths found four live files
  still carrying them, all since fixed: `mcp-tooling/mcp-notion/references/migration-inventory.md`
  held three dead pointers, and the retrieval trio `runtime/data/trigger-index.json`,
  `retrieval/fixtures/corpus-manifest.json` and `retrieval/fixtures/generation-diagnostics.json`
  held 61 dead paths and were regenerated as a pair. The remaining 1,197 hits are changelog history
  and `specs/` research artifacts, which record what was true when they were written.
- The first attempt at that scan never ran. It sat after a `grep -c` in an AND-chain; that grep
  matched nothing, exited 1, and the chain stopped before the scan. Empty output was read as a
  clean result. An adversarial read-only review by the same executor caught it.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->

## Known Limitations

The advisor does not surface this hub for `health.md apple health chart`, which returns no
recommendation. This is not a regression: `graph-metadata.json` carries no health vocabulary at
all and was never edited by this packet, so the gap predates it. Health.md requests still reach the
mode's `PLUGIN_HEALTH` intent once the hub is loaded; what is missing is stage-one discovery by
health vocabulary alone.

`excalidraw-drawing` vocabulary still routes to a plugin the vault no longer has. Pre-existing,
recorded, not fixed.
<!-- /ANCHOR:limitations -->

---


