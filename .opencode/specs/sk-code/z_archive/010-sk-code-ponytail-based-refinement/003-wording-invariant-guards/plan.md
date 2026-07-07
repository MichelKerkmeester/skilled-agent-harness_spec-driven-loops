---
title: "Plan: Phase 3 — Exact-Wording Guards (canary) + Iron Law invariant"
description: "Implementation plan for the rule-canary guard (Review-status triplet + Iron Law invariant) wired as a script + CI workflow."
trigger_phrases:
  - "phase 3 plan canary guard"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/003-wording-invariant-guards
    last_updated_at: 2026-06-13T15:20:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 3 implemented and verified; canary script + test + CI"
    next_safe_action: "/speckit:plan Phase 4"
---
# Plan: Phase 3 — Exact-Wording Guards (canary) + Iron Law invariant

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add a rule-canary guard that fails CI when load-bearing wording drifts: the `Review status:` triplet (parsed by PR-state automation) and the Iron Law safety invariant. Delivered as a standalone Node script + bash test + GitHub workflow, mirroring the proven `comment-hygiene.yml` pattern.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The canary passes on the current tree (exit 0) and fails (exit 1) on any drift — proven by a negative control.
- Per-file scope: SKILL.md + README.md require the full triplet; changelog + pr_state_dedup require only `COMMENTED`.
- Iron Law locked by minimal shared tokens ("completion claim" + "verification") on the Iron Law line — NO wording edit to SKILL.md / CLAUDE.md.
- Wired as a script + workflow (NOT a vitest — no vitest is CI-gated here).

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

One Node script (`check-rule-copies.js`, ESM, no deps, `--root` override for testability), one bash test (run_case style mirroring `check-comment-hygiene.test.sh`), one workflow (`rule-canary-sync.yml`, pull_request → main). The canary READS the locked files; it never rewrites them. Three new files only; no existing file edited.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surface: OPENCODE. New files: `sk-code-review/scripts/check-rule-copies.{js,test.sh}`, `.github/workflows/rule-canary-sync.yml`. Verification: run the script + test + node --check + alignment-drift + comment-hygiene on the `.js`.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Step 1: Recon the exact `Review status:` strings + per-file scope and the Iron Law lines.
- Step 2: Write `check-rule-copies.js` (INVARIANTS list; exact-substring checks + Iron-Law-line token check; collect all failures; `--root`).
- Step 3: Write `check-rule-copies.test.sh` (PASS on real repo; FAIL on a tampered copy missing the triplet; FAIL on a reworded Iron Law).
- Step 4: Write `rule-canary-sync.yml`.
- Step 5: Run the script, test, node --check, alignment-drift, comment-hygiene; confirm scope.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Real-code verification: `node --check`; run the canary (expect 0); run the test suite (3 cases incl. two failure cases); a negative control pointing the script at a tampered root (expect exit 1); alignment-drift exit 0; comment-hygiene on the `.js` exit 0.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The proven `comment-hygiene.yml` / `prompt-card-sync.yml` script-from-yml CI pattern (mirrored). No new package dependencies. Shares its workflow shape with Phase 4.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the three new files — no existing file changed, so nothing else to revert. The workflow only runs on PRs to main; removing the yml fully disables the gate.

<!-- /ANCHOR:rollback -->
