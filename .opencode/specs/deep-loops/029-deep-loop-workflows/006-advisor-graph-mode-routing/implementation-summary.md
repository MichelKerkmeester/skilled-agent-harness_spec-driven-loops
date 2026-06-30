---
title: "Implementation Summary: Advisor graph mode-routing collapse"
description: "Phase 006: corrected the council+improvement advisor family sk-util->deep-loop FIRST, collapsed the five deep-* skill IDs into deep-loop-workflows plus a mode-alias/discriminator layer, and resolved the deep-context Candidate-3 asymmetry (kept metadata-routed). Shipped as part of the deep-loop merge; advisor registry<->map routing parity re-verified True in packet 156."
trigger_phrases:
  - "deep-loop-workflows phase 006 summary"
  - "advisor graph mode routing collapse built"
  - "skill advisor family correction deep-loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/006-advisor-graph-mode-routing"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored impl-summary; advisor collapse shipped in merge, routing parity re-verified in 156"
    next_safe_action: "Orchestrator reconciles parent Phase Map evidence for phase 006"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-006-advisor-graph-mode-routing-implsummary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "B7 family correction sequenced first: council+improvement family is deep-loop before any ID removal"
      - "B3 deep-context resolved: stays metadata-routed (not a Candidate-3 mode); DEEP_ROUTING_SKILLS stays 3"
      - "B6 aliases.ts schema resolved: nested skill->modes with canonical=deep-loop-workflows"
---
# Implementation Summary: Advisor graph mode-routing collapse

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 006 of 009 |
| **Status** | Complete (shipped in the deep-loop merge; live in `027`) |
| **Date** | 2026-06-16 |
| **Depends on** | phase 005 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The advisor graph and scorer surface were migrated from five `deep-*` skill IDs to one `deep-loop-workflows` skill plus a mode-alias/discriminator layer, with the family correction performed first so routing never failed closed mid-migration:

- **Family correction (B7, sequenced first):** the `deep-ai-council` and `deep-improvement` advisor families were corrected from `sk-util` to `deep-loop` BEFORE any old skill ID was removed. The merged hub `deep-loop-workflows/graph-metadata.json` carries `family: deep-loop` (host-confirmed: `skill_id` and `family` present, single hub node).
- **Skill-ID collapse:** the five old `deep-*` advisor nodes collapsed into one `deep-loop-workflows` node; the finite inbound edges (system-skill-advisor, sk-code-review, sk-prompt, system-spec-kit, deep-loop-runtime) were repointed to the merged node with unioned, deduped keywords and trigger phrases.
- **Mode-alias / discriminator layer:** `aliases.ts` was restructured to the nested `skill -> modes` schema (B6 resolved) with `canonical = deep-loop-workflows`, deriving `ALIAS_TO_MODE` so a prompt routes to both the merged skill AND a concrete mode rather than a flat alias.
- **`deep-context` asymmetry (B3) resolved:** `deep-context` stays metadata-routed (it is NOT promoted to a Candidate-3 mode); `DEEP_ROUTING_SKILLS` remains 3.
- **Scorer + Python mirror:** `PHRASE_BOOSTS` (explicit.ts), `CATEGORY_HINTS` (lexical.ts), and the Python `SKILL_ALIAS_GROUPS` / intent maps in `skill_advisor.py` were repointed to `deep-loop-workflows + mode`, preserving relative weights; the Candidate-3 payload returns `{skill: deep-loop-workflows, mode}`.
- **Routing-parity fixtures:** the two `routing-parity-deep-*` vitest fixtures were updated to assert BOTH `deep-loop-workflows` AND the concrete mode (flat alias equality is explicitly insufficient).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase was executed as the advisor-routing strata of the larger deep-loop merge, following the plan's fail-closed sequencing: the family correction (G1) ran and was gated FIRST, then the cross-surface contract was frozen (nested `aliases.ts` schema, the `{skill, mode}` result shape, and the `deep-context` metadata-routed decision), then the scorer/Python/graph edits landed, and finally the graph collapse landed as one atomic node-repoint-plus-delete so that retargeting external edges and removing old nodes never left a dangling target. Read-only analysis and parity capture ran on `gpt-5.5-fast` seats; the file edits ran on opus seats; the orchestrator reduced and validated. The old skill directories were left intact (deletion is phase 009 only), keeping this strata independently revertible.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Family-correct before collapse (B7).** Correcting `deep-ai-council` + `deep-improvement` to `family: deep-loop` BEFORE removing any old skill ID is the keystone ordering — doing it in the other order would fail routing closed mid-migration.
- **`deep-context` stays metadata-routed (B3).** It is not promoted to a Candidate-3 mode; `DEEP_ROUTING_SKILLS` stays 3. This avoids a routing-behavior change for a mode the merge did not intend to alter.
- **Nested `aliases.ts` schema (B6).** A nested `skill -> modes` map with a derived `ALIAS_TO_MODE` is chosen over a flat alias table so parity asserts skill AND mode, preserving per-mode routing winners.
- **One atomic graph collapse.** Repointing external inbound edges and deleting the five old nodes are mutually dependent, so they land as a single commit + single scan rather than incrementally.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Shipped + system-level validation:** this phase shipped as part of the deep-loop merge, which is functionally validated by the **351 deep-loop-runtime tests passing** with **all requires resolving** (packet-156 review-report.md and implementation-summary.md).
- **Independent advisor re-verification (packet 156):** the merged advisor routing was re-verified in the packet-156 deep-loop-skill-system review, which records **registry<->map routing parity as True** and states "live advisor<->parent-skill routing parity is proven."
- **Hub graph state (host-confirmed):** exactly **1** `graph-metadata.json` under `deep-loop-workflows` (the hub), with `skill_id: deep-loop-workflows` and `family: deep-loop`.
- **Structural:** `validate.sh --strict` passes on this phase folder (this summary closes the one missing Level-2 file the packet-156 review flagged for `152/004/005/006/008`).

> **Honest scope note.** This phase's own `checklist.md` was authored but **not fully gate-run** (its Verification Summary reads `0/15` P0 and "pending execution"). The completion evidence above is the SYSTEM-level merge validation (351 runtime tests) plus the independent packet-156 routing re-verification — NOT a per-CHK sign-off on this child's checklist. The CHK-level evidence rows were not individually executed and marked.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Per-phase checklist not gate-run.** The parent `spec.md` records this packet as Complete and the merge as "Merged & functional (351 runtime tests); formal per-phase gate sign-off pending." The per-CHK P0/P1 rows in this child's `checklist.md` were not individually run; system-level validation stands in for them.
- **Byte-parity replay not independently re-run here.** Behavior-preserving routing is asserted by the updated fixtures and the packet-156 re-verification; a standalone phase-001 byte-parity replay against this child alone was not separately captured in this summary.
- **Old skill directories survive.** The five old `deep-*` directories remain on disk until phase 009 by design (per-strata rollback), so the old paths still physically exist even though the advisor graph no longer points at them.

<!-- /ANCHOR:limitations -->
