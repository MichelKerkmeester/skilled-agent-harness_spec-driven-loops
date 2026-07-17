---
title: "Implementation Summary: Smart-router pseudocode retrofit (sk-doc mode packets)"
description: "Retrofitted canonical def route_… pseudocode into the nine sk-doc mode packets that carried simplified prose routers, split create-flowchart's merged SMART ROUTING heading, closed a validator loophole that let a merged heading skip the router marker check, and verified the registry-driven parent hub — all 11 packets PASS package_skill.py --strict, parent-skill-check.cjs STRICT exit 0."
trigger_phrases:
  - "smart router retrofit summary"
  - "014 sk-doc phase 029 summary"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/029-smart-router-pseudocode-retrofit"
    last_updated_at: "2026-07-17T14:36:44Z"
    last_updated_by: "claude-opus"
    recent_action: "Retrofit + loophole fix + parent-hub verify all complete; spec docs authored"
    next_safe_action: "Commit the worktree change set and push non-force to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/create-flowchart/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-smart-router-pseudocode-retrofit |
| **Completed** | 2026-07-14 (implemented + verified in worktree; commit/push is the remaining delivery step) |
| **Level** | 2 |
| **Deliverable** | Canonical `def route_…` router in all 11 sk-doc mode packets + the closed `validate_smart_router` loophole + a verified registry-driven parent hub |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-doc` mode packets had drifted from the router canon: `create-skill`/`create-command` carried full `def route_…` pseudocode, but the other nine packets shipped a "smart router" that was really a prose call-sequence or a one-line routing note. The packaging validator only ever required three marker tokens in the SMART ROUTING section, so the drift never tripped a gate — and worse, a merged heading (`## 1. When To Use + Smart Routing`) made the validator skip the marker check entirely, which `create-flowchart` was silently relying on.

This packet gives every mode packet a proper tiered router and removes the escape hatch.

### Router retrofit (nine packets)
- **TIER FLAT** (no `references/<key>/` subdirs) — create-agent, create-changelog, create-diff, create-feature-catalog, create-flowchart, create-manual-testing-playbook, create-quality-control, create-readme. Each scores intents, loads the flat refs/assets that exist, and returns `UNKNOWN_FALLBACK` with a disambiguation checklist on low confidence. `create-changelog` was authored first as the golden reference; the six mechanical ones were dispatched to parallel agents mirroring its helper functions verbatim.
- **TIER KEYED** (real `references/<family>/` subtrees) — create-benchmark. Its six benchmark families ARE the routing key; `get_routing_key` selects `references/<family>/` + `assets/<family>/` + `references/shared/` with a three-tier fallback (unknown key → guide-only notice → happy path).

### create-flowchart heading fix
Split the merged `## 1. When To Use + Smart Routing` into standalone `## 1. WHEN TO USE` + `## 2. SMART ROUTING`, renumbered the trailing sections 3-12, and repaired the "Pattern Selection" cross-references that shifted.

### Validator loophole fix
`validate_smart_router` now detects a merged/non-standalone SMART ROUTING heading with a secondary regex, emits `SMART ROUTING must be its own H2 section`, and that token is in `STRICT_PROMOTED_MARKERS` so `--strict` turns it into an error instead of a silently-skipped check.

### Files Changed
Nine packet `SKILL.md` files (routers), one `create-flowchart/SKILL.md` (heading + renumber, same file), and `create-skill/scripts/package_skill.py` (loophole fix) — 10 files, `git diff --stat` 670 insertions / 118 deletions. `create-command` and `create-skill` were already conformant and left untouched.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work happened in an isolated git worktree on `skilled/v4.0.0.0` (primary checkout carries a concurrent session's dirty files — never touched, per sk-git ALWAYS #15). The golden router block was proven on create-changelog first, then the shared FLAT+KEYED template drove six parallel agents for the mechanical packets while the delicate edits (flowchart heading split, benchmark keyed router, validator patch) were done directly. Python validators (`package_skill.py`) run from the worktree; the node validator (`parent-skill-check.cjs`) was run from the main tree against worktree paths because the worktree lacks `node_modules`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Tiered routers, "simpler where needed" (per the operator).** Flat-resource packets do not need a `get_routing_key` keyed subtree — inventing `references/<key>/` subdirs they do not have would be a lie. FLAT packets therefore route intent → documented template; only create-benchmark, which genuinely has five family subtrees, uses the KEYED tier.
2. **create-benchmark: compact block + redundancy trim.** The packet was at 4989/5000 words before any edit, so a full inline router would have breached the strict word cap. Resolution: a compact KEYED block that references the shared canonical helpers in prose (the `_guard_in_skill` marker appears once, in the intro, rather than re-inlining the body), plus trimming lane-ownership prose that was stated three times (table columns + "Routing Decision" + "Family Boundary"). Every unique fact — the two "hard stops", the `graph-metadata.json` rule — was preserved. Final: 4998 words, PASS.
3. **Parent hub verified, not reshaped.** The `sk-doc` hub SKILL.md router is registry-driven (`mode-registry.json` + `hub-router.json`, `defer(...)` fallback) and validated by `parent-skill-check.cjs`, a different contract from the packet-level resource router. Per the operator's scope answer it was verified (STRICT exit 0, 0 warnings) but deliberately NOT forced into the `def route_…` shape.
4. **Loophole fix flags rather than early-returns.** The merged-heading branch now warns + strict-promotes instead of returning "no section to validate", so the marker check can never again be silently skipped.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Packaging sweep** — `package_skill.py <pkt> --check --strict` for all 11 packets: `create-agent, create-benchmark, create-changelog, create-command, create-diff, create-feature-catalog, create-flowchart, create-manual-testing-playbook, create-quality-control, create-readme, create-skill` → **11/11 PASS**.
- **Marker + heading audit** — every packet: `discover_markdown_resources` ≥2 (benchmark 2), `_guard_in_skill` ≥1 (benchmark 1 via shared-helper reference; others 2), `UNKNOWN_FALLBACK` ≥2, exactly one `## N. SMART ROUTING`, one packet-specific `def route_<packet>_request`.
- **create-benchmark word count** — 4998 words (< 5000 strict cap), PASS.
- **Loophole unit test** — importing `validate_smart_router`: merged heading → `["SMART ROUTING must be its own H2 section; found it merged into another heading …"]`; standalone + 3 markers → `warnings: []`; `STRICT_PROMOTED_MARKERS` contains the merged-heading token.
- **Parent hub** — `parent-skill-check.cjs <hub>`: 35 checks PASS, "all hard invariants passed, 0 warnings", exit 0 (12 modes / 11 packet dirs; `create-skill-parent` reuses `create-skill`; 111 unique aliases).
- **Spec docs** — `validate.sh --recursive --strict` on the 029 packet: Errors:0 (recorded at completion).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The FLAT-tier packet routers are documentation pseudocode (they mirror the canon), not executed code — they describe intended load behavior, consistent with how `create-skill`/`create-command` present theirs.
- `create-benchmark` intentionally diverges from the other packets by referencing the shared marker helpers in prose instead of re-inlining their bodies; this is the "simpler where needed" concession to its word ceiling, not an omission.
- Delivery (commit + non-force push to `origin/skilled/v4.0.0.0`) is the one remaining step after this summary; nothing is force-pushed and the parent-hub / registry vocabulary is unchanged.
<!-- /ANCHOR:limitations -->
