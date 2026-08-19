---
title: "Implementation Summary: Extract md-generator and styles to a standalone skill root"
description: "Extraction complete: 7,932 clean git-mv renames relocated md-generator + styles to a standalone top-level skill root, build and corpus intact, tree transiently unwired for phase 003."
trigger_phrases:
  - "extract md-generator summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/002-extract-md-generator-and-styles"
    last_updated_at: "2026-08-19T05:04:07Z"
    last_updated_by: "spec-author"
    recent_action: "7,932 clean renames; standalone skill recognized by the advisor at the new path"
    next_safe_action: "Phase 003: rewire the 5 outward refs + create standalone-root metadata + prove functional"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Extract md-generator and styles to a standalone skill root

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Level** | 1 |
| **Mutation Class** | mutates (directory `git mv`; no content edits) |
| **Executor** | main agent (mechanical filesystem move — cli-devin reserved for the cognitive phases 004/006) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The surviving skill relocated out of the doomed hub to a standalone top-level root:

- `.opencode/skills/sk-design/sk-design-md-generator/` → `.opencode/skills/sk-design-md-generator/` (120 tracked).
- `.opencode/skills/sk-design/styles/` → `.opencode/skills/sk-design-md-generator/styles/` (7,812 tracked).

The advisor now lists `sk-design-md-generator` as a standalone skill at the new path. The tree is transiently unwired (the 5 outward refs identified in 001 dangle) until phase 003.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two ordered directory-level `git mv` operations (md-generator first, then styles nested into it). A directory `git mv` stages the tracked renames in the index and filesystem-moves the whole directory, so the gitignored `backend/node_modules` (72M), `backend/dist`, and `styles/database` travelled without a reinstall. No content was edited — paths only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Directory `git mv` over per-file** — one move per subtree carries ignored build/corpus content atomically and records clean renames, avoiding a 72M `npm install` in 003.
- **Move-only phase** — the outward-ref rewiring is deferred to 003 by design; the transiently broken tree is safe because no deletion happens until 005.
- **Executor: main agent** — a deterministic filesystem move is not cognitive work; running it directly is faster and safer than a sandboxed model dispatch (which is reserved for the distillation/reconciliation phases).
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `git status --porcelain | grep -c '^R'` = **7,932** (120 + 7,812) — a pure rename; `git ls-files` shows 0 tracked files left at either old path.
- Sentinel `test -e` on `SKILL.md` and `styles/lib/paths.mjs` at the new root pass; `test ! -e` on both old paths pass.
- `backend/node_modules` (72M), `backend/dist`, `styles/database` all present at the new location.
- Baseline `git status` diff shows only the two-subtree renames plus this packet; all other working-tree entries are pre-existing environmental churn (other sessions / background skill installs), not this move.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The tree is intentionally unwired between 002 and 003 — md-generator's `../shared/*` links and the `styles` test path dangle until 003 repairs them.
- Fully reversible while uncommitted (reverse the two `git mv`); nothing is committed or pushed.
<!-- /ANCHOR:limitations -->
