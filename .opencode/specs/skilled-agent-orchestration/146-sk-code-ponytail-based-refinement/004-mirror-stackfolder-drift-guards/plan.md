---
title: "Plan: Phase 4 — Drift Guards (agent mirrors + STACK_FOLDERS)"
description: "Implementation plan for the repo-wide agent-mirror-sync gate (executable + pre-commit + CI), the STACK_FOLDERS validator, a normalizer accuracy fix, and the context-mirror drift fix."
trigger_phrases:
  - "phase 4 plan drift guards"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/skilled-agent-orchestration/146-sk-code-ponytail-based-refinement/004-mirror-stackfolder-drift-guards
    last_updated_at: 2026-06-13T16:30:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 4 implemented + verified; gate + stack-folders + drift fixed"
    next_safe_action: "/speckit:plan Phase 5"
---
# Plan: Phase 4 — Drift Guards (agent mirrors + STACK_FOLDERS)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Promote the existing 3-runtime mirror-sync check from a deep-improvement promotion-only gate to a repo-wide, changed-files-scoped gate (executable + pre-commit + CI), add a STACK_FOLDERS-to-disk validator, refine the mirror normalizer to stop flagging legitimate per-runtime self-description, and fix the pre-existing committed mirror drift (context, orchestrate).

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The gate is **changed-files-scoped** in pre-commit + CI — it never blocks commits that don't touch agents (so pre-existing drift in unrelated files can't break the workflow).
- The normalizer fix is conservative: it clears the per-runtime self-description false positive but still catches genuine body drift (proven by a tamper control).
- After the drift fixes, all 12 agents report in-sync.
- The pre-commit hook preserves the existing comment-hygiene gate verbatim and is fail-safe.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`check-agent-mirror-sync.cjs` wraps the existing `mirror-sync-verify.cjs` lib (CJS, since the lib is CJS); takes changed agent paths or `--all`. The pre-commit hook adds an independent mirror gate over staged agent files. A CI workflow runs the gate over PR-changed agent files. `verify_stack_folders.py` parses `STACK_FOLDERS` from sk-code SKILL.md and checks the on-disk binding. The token-set comparison is intentionally structure-tolerant (vocabulary, not byte-equality).

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surface: OPENCODE. New: `deep-improvement/scripts/check-agent-mirror-sync.cjs`, `.github/workflows/agent-mirror-sync.yml`, `sk-code/assets/scripts/verify_stack_folders.py`. Edited: `.opencode/hooks/pre-commit`, `deep-improvement/scripts/lib/mirror-sync-verify.cjs` (normalizer), `.codex/agents/context.toml` (drift fix). Verification: run the gate, the stack-folders check, the pre-commit hook (throwaway index), a normalizer tamper control.

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Step 0: Pre-flight audit — found context + orchestrate already drifted (committed); chose changed-files-scoped design.
- Step 1 (dispatch A): build the gate executable + CI + verify_stack_folders.py + extend the normalizer for per-runtime self-description; extend the pre-commit hook; test the hook via a throwaway git index.
- Step 2 (dispatch B): fix the real context/codex drift (restore the dropped "Structure / Semantic and exact discovery" Tool-Inventory row to match canonical).
- Step 3: confirm all 12 agents in-sync.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --check`; `check-agent-mirror-sync.cjs --all` → exit 0 (all 12 in-sync); `verify_stack_folders.py` → exit 0; pre-commit hook tested via a throwaway `GIT_INDEX_FILE` (clean→0, drifted→1, real index unchanged); a normalizer tamper control (a genuine extra word still yields drift); comment-hygiene on the new `.cjs`/`.py`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The existing `mirror-sync-verify.cjs` lib + its vitest. The proven `comment-hygiene.yml` CI/pre-commit pattern (shared with Phase 3). `.opencode` is `"type":"module"` (wrapper must be `.cjs`).

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the 3 new files; revert the pre-commit + normalizer edits; revert the one-row context.toml fix. The gate is changed-files-scoped, so removing the yml/hook fully disables it with no residual effect.

<!-- /ANCHOR:rollback -->
