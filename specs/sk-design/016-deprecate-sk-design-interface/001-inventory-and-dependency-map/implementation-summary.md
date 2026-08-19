---
title: "Implementation Summary: sk-design reference inventory and dependency map"
description: "Read-only inventory complete: 305 out-of-tree references classified into 5 reconcile buckets; dependency-map.md produced for phases 002-006."
trigger_phrases:
  - "sk-design inventory summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/001-inventory-and-dependency-map"
    last_updated_at: "2026-08-19T04:55:00Z"
    last_updated_by: "spec-author"
    recent_action: "Produced dependency-map.md; classified 305 refs (78 frozen / 19 generated / 208 live-contract)"
    next_safe_action: "Author + execute phase 002 extraction via cli-devin"
    blockers: []
    key_files:
      - "dependency-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: sk-design reference inventory and dependency map

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Mutation Class** | read-only (only `dependency-map.md` written) |
| **Executor** | main agent (read-only, context already loaded — cli-devin carve-out flagged) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`dependency-map.md` — the authoritative classification of every `sk-design`/`interface:` reference outside the doomed tree, into five buckets with per-file actions:

- **to-extract** (7,932): md-generator (120) + styles (7,812) → new standalone root.
- **to-delete** (336): hub minus md-generator+styles (328) + `commands/interface/**` (8).
- **frozen-evidence** (78): benchmark reports + deep-improvement fixtures — leave untouched.
- **generated-artifact** (19): compiled-routing + advisor graph — regenerate via tooling.
- **live-contract** (~208): reconcile in 006, split into ~55 actionable-runtime (Groups A-F, with per-file actions) + ~150 incidental (Group H, default no-change).

Also captured: the 5 md-generator outward refs needing rewire (1 code path + 4 `shared/` links salvaged in 004), the standalone-root metadata to create, and two flagged ambiguities (`/interface:design-reference` survival vs `commands/interface/` deletion; `design` agent fate).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

`git grep -lI` sweeps for `sk-design` and `interface:` over tracked files, piped through path filters to bucket each hit; counts reconciled against the raw totals. The map was authored directly (Write) into the packet. No referenced file was touched — the phase's only write is `dependency-map.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **`git grep` over `rg`** — a full-repo `rg` timed out (large tree); `git grep` on tracked files is fast and naturally excludes node_modules/untracked.
- **Executor carve-out** — the plan names cli-devin, but two dispatch attempts failed (accept-edits rejected exec; then a session teardown killed the sandbox run mid-flight). Per cli-devin's own "When NOT to Use: context already loaded," this read-only inventory was done directly. The write-heavy phases 002-006 still route to cli-devin (`gemini-3-7-flash-high`, sandbox autonomous — verified working).
- **Live-contract split** — separating actionable-runtime from incidental prevents over-editing changelogs/examples in 006.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `dependency-map.md` exists and classifies every pool hit (305 = 78 + 19 + 208 ±1 overlap). Reconciled against `git grep -lI` totals.
- Read-only proven: `git status` diff vs a captured baseline shows the only in-scope addition is `dependency-map.md` inside this packet; all other working-tree changes are pre-existing environmental churn (sk-code-mobile-cli, sk-communication install), not this phase's.
- `validate.sh --strict` on this folder: see closeout run.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Bucket counts carry a ±1 tolerance from files matching both `sk-design` and `interface:` tokens.
- Group G (deep-improvement skill-benchmark) and Group H (incidental) are marked "review" — their final disposition is confirmed during 006, not pre-decided here.
<!-- /ANCHOR:limitations -->
