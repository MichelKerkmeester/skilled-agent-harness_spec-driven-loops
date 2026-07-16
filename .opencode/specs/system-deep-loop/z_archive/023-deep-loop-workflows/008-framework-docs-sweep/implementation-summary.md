---
title: "Implementation Summary: Framework documentation sweep"
description: "Phase 008: rewrote the framework docs from the five-skill model to the two-skill model (root README, CLAUDE.md/AGENTS.md paired edits, the deep-loop-runtime README, constitutional deep-skill rule, and sibling Related-skills lines) and stamped the merged deep-loop-workflows skill v1.0.0 while preserving per-mode changelog history. Shipped as part of the deep-loop merge."
trigger_phrases:
  - "deep-loop-workflows phase 008 summary"
  - "framework docs sweep five to two"
  - "deep-loop-runtime readme rewrite done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/023-deep-loop-workflows/008-framework-docs-sweep"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored impl-summary; framework docs rewritten to 2-skill model and v1.0.0 stamped in merge"
    next_safe_action: "Orchestrator reconciles parent Phase Map evidence for phase 008"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/README.md"
      - ".opencode/skills/deep-loop-runtime/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-008-framework-docs-sweep-implsummary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fresh v1.0.0 vs inherited-max version resolved: deep-loop-workflows stamped v1.0.0"
      - "descriptions.json and changelog history excluded from the rename sweep (per-mode history preserved)"
---
# Implementation Summary: Framework documentation sweep

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 008 of 009 |
| **Status** | Complete (shipped in the deep-loop merge; live in `027`) |
| **Date** | 2026-06-16 |
| **Depends on** | phase 007 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The cross-repo framework documentation was rewritten from the five-skill model (five public `deep-*` loop skills) to the two-skill model (one `deep-loop-workflows` hub with modes plus the frozen MCP-free `deep-loop-runtime` backend), and the merged skill was version-stamped:

- **Root `README.md`** — the Deep Loop sections and customization table were rewritten to the two-skill architecture, removing the five-public-skill enumeration and the per-skill README links that would 404 after the folder move.
- **`.opencode/skills/README.md`** — the skills catalog counts and the deep-loop family rows were updated to match the post-merge skill directories.
- **`CLAUDE.md` + `AGENTS.md`** — the hand-mirrored deep-loop policy lines were updated as one paired edit at matching positions, so the two mirror files do not drift.
- **`deep-loop-runtime/README.md`** — rewritten from a five-consumer model to a one-consumer-with-modes model, while keeping the explicit statement that the backend adds no MCP tools (the MCP-free boundary).
- **Constitutional rule** — `constitutional/deep-skill-workflow-required.md` was updated to name the merged `deep-loop-workflows` skill and the preserved `/deep:*` commands, no longer presenting the five old folder names as loadable skills.
- **Sibling Related-skills lines** — the `system-spec-kit` and `cli-opencode` related-skill / protocol-link references were repointed off the old `deep-*` skill paths (artifact filename references such as `deep-research-state.jsonl` were left intact).
- **Version stamp** — the merged hub `deep-loop-workflows` was stamped **v1.0.0**, with each source mode's prior changelog history preserved as mode history (the rename sweep excludes `descriptions.json` and append-only `changelog/` history).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran as the documentation-only strata of the deep-loop merge, after phases 003-007 had already created `deep-loop-workflows`, collapsed routing, and consolidated governance. The work was partitioned by disjoint doc strata so independent surfaces (root catalog docs, runtime README, constitutional, sibling lines) could be drafted in parallel, with the `CLAUDE.md`/`AGENTS.md` pair treated as a single mirrored unit and final stale-reference grep plus validation reserved for one lead. `mode-registry.json` was the terminology source so the prose matched the actual mode names, and no nested per-mode `graph-metadata.json` was recreated under the hub. The edits were textual only — command YAML, agents, runtime scripts/lib, advisor code, Barter contracts, and changelog history were explicitly out of this strata's diff.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Fresh v1.0.0 for the merged skill.** The hub is stamped `v1.0.0` rather than inheriting the max version of any source mode, with per-mode changelog history preserved as mode history.
- **`CLAUDE.md`/`AGENTS.md` as one paired edit.** The two files are hand-mirrored at matching positions; editing them as a single unit is the main correctness trap and was treated accordingly.
- **Exclude `descriptions.json` and `changelog/` from the rename sweep.** `descriptions.json` holds only historical spec-folder slugs (no live skill refs) and `changelog/` is append-only history — both are excluded so the textual rewrite does not corrupt historical records.
- **Documentation-only diff.** The sweep deliberately did not broaden into command, agent, or code rewrites; any stale path found outside the planned doc set is triaged as docs vs historical, not used to expand scope.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Shipped + system-level validation:** this phase shipped as part of the deep-loop merge, which is functionally validated by the **351 deep-loop-runtime tests passing** with **all requires resolving** (packet-156 review-report.md and implementation-summary.md). Because the sweep is documentation-only, the runtime behavior it documents is unchanged by construction.
- **Hub state (host-confirmed):** exactly **1** `graph-metadata.json` exists under `deep-loop-workflows` (the hub, `family: deep-loop`) — no nested per-mode graph metadata was reintroduced by the docs sweep.
- **Two-skill architecture live:** the merged `deep-loop-workflows` skill and the frozen `deep-loop-runtime` backend are present in `027`; the packet-156 review found the trio "functionally sound" with the MCP-free boundary holding.
- **Structural:** `validate.sh --strict` passes on this phase folder (this summary closes the one missing Level-2 file the packet-156 review flagged for `152/004/005/006/008`).

> **Honest scope note.** This phase's own `checklist.md` was authored but **not fully gate-run** (its Verification Summary reads `0/20` P0 and "pending execution"). In particular, the phase-001 byte-parity harness and the final stale-path grep across the full target doc set were not independently re-captured in this summary; the completion evidence above is the SYSTEM-level merge validation plus the packet-156 review, NOT a per-CHK sign-off on this child's checklist.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Per-phase checklist not gate-run.** The parent `spec.md` records this packet as Complete and the merge as "Merged & functional (351 runtime tests); formal per-phase gate sign-off pending." The per-CHK P0/P1 rows in this child's `checklist.md` were not individually run; system-level validation stands in for them.
- **Stale-reference grep not re-captured here.** A clean `rg` for `.opencode/skills/deep-{research,review,context,ai-council,improvement}/` across the full phase-008 doc set (with approved changelog excludes) is asserted by the merge but not re-run and recorded in this summary.
- **Old skill directories survive.** The five old `deep-*` directories remain on disk until phase 009 by design, so historical/excluded surfaces may still contain old folder names even though the live framework docs no longer present them as loadable skills.

<!-- /ANCHOR:limitations -->
