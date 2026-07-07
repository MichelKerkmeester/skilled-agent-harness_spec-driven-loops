---
title: "Implementation Summary: Phase 3 — Exact-Wording Guards (canary)"
description: "Summary of the rule-canary guard (Review-status triplet + Iron Law invariant) + test + CI workflow."
trigger_phrases:
  - "phase 3 summary canary guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/003-wording-invariant-guards
    last_updated_at: 2026-06-13T15:20:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 3 implemented and verified; canary script + test + CI"
    next_safe_action: "/speckit:plan Phase 4"
    fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
---
# Implementation Summary: Phase 3 — Exact-Wording Guards (canary)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Implementation (phase child) |
| **Status** | Complete — implemented (Opus 4.8 via claude2) + verified |
| **Parent** | `142-sk-code-ponytail-based-refinement` (phase 3 of 6) |
| **Source recs** | research.md #3, #8 (fixes Bonus Bug 1) |
| **Diff** | 3 new files, 0 existing files edited |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

A rule-canary guard that fails loudly when load-bearing wording drifts:

- **`sk-code-review/scripts/check-rule-copies.js`** (ESM, no deps, `--root <dir>` override): asserts the `Review status:` vocabulary per file (full `APPROVED`/`REQUESTED_CHANGES`/`COMMENTED` triplet in SKILL.md + README.md; `COMMENTED`-only in the changelog + `pr_state_dedup.md`), and asserts the `Iron Law` line in `sk-code/SKILL.md` and `CLAUDE.md` contains (case-insensitive) both "completion claim" and "verification". Collects all failures; missing file = failure; exit 1 on drift, 0 when clean.
- **`sk-code-review/scripts/check-rule-copies.test.sh`** (run_case style): PASS on the real repo; FAIL on a tampered copy missing `Review status: APPROVED`; FAIL on a reworded Iron Law dropping "verification".
- **`.github/workflows/rule-canary-sync.yml`**: pull_request → main, runs the canary, `::error::` + non-zero on drift, `::warning::` + exit 0 if the script is missing — mirroring `comment-hygiene.yml`.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by Opus 4.8 via the account-2 `claude` CLI (`bypassPermissions`, Gate-3 pre-approved, scope-locked to 3 new files). The orchestrator independently re-ran the script, the test suite, and a negative control before claiming completion.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **No CLAUDE.md / SKILL.md wording edit.** Rather than canonicalize the Iron Law to identical text (which would erase the deliberate "surface" vs "stack" scope difference), the canary locks the minimal shared tokens that already appear in both ("completion claim" + "verification"). Same drift protection, no constitution edit.
- **ESM, not `require`.** `.opencode/package.json` is `"type": "module"`, so the `.js` uses `import` (zero deps, keeps the `'use strict';` the alignment verifier requires).
- **Script + workflow, not a vitest** — no vitest is CI-gated in this repo (research finding); a vitest would silently not block PRs.
- **Per-file canary scope** — the changelog + `pr_state_dedup.md` legitimately carry only `COMMENTED` (round-2 correction), so the full triplet is required only where it actually appears.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- `node --check` → no syntax error.
- `node check-rule-copies.js` (repo root) → exit 0 ("all rule invariants present").
- `bash check-rule-copies.test.sh` → 3/3 PASS.
- Negative control (orchestrator): pointing the canary at a tampered root → exit 1 with a BLOCKED summary — it genuinely catches drift.
- `verify_alignment_drift.py --root sk-code-review/` → exit 0 (the `.js` has `'use strict';`).
- `check-comment-hygiene.sh` on the `.js` → exit 0 (durable-WHY header, no forbidden labels).
- Scope: only the 3 new files added; no existing file modified.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The canary guards a fixed list of files/strings — when a new load-bearing string appears, the INVARIANTS list must be extended (intentional: keep the list tiny, parsed-or-safety strings only).
- The workflow gates PRs to `main`; it does not run on feature-branch pushes (matches the existing comment-hygiene gate scope).
- Not committed — sits in the working tree on branch `028-mcp-to-cli-tool-transition`.

<!-- /ANCHOR:limitations -->
