---
title: "Implementation Summary: Phase 4 — Drift Guards"
description: "Summary of the agent-mirror-sync gate (executable + pre-commit + CI), STACK_FOLDERS validator, normalizer accuracy fix, and the context/orchestrate drift fixes."
trigger_phrases:
  - "phase 4 summary drift guards"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: .opencode/specs/sk-code/z_archive/010-sk-code-ponytail-based-refinement/004-mirror-stackfolder-drift-guards
    last_updated_at: 2026-06-13T16:30:00Z
    last_updated_by: claude-opus
    recent_action: "Phase 4 implemented + verified; gate + stack-folders + drift fixed"
    next_safe_action: "/speckit:plan Phase 5"
    fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
---
# Implementation Summary: Phase 4 — Drift Guards

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Type** | Implementation (phase child) |
| **Status** | Complete — implemented (Opus 4.8 via claude2) + verified |
| **Parent** | `142-sk-code-ponytail-based-refinement` (phase 4 of 6) |
| **Source recs** | research.md #10 + STACK_FOLDERS check (fixes Bonus Bugs 2 & 3) |
| **Footprint** | 3 new files, 3 edited files (pre-commit, normalizer lib, 1 agent mirror) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

- **`deep-improvement/scripts/check-agent-mirror-sync.cjs`** — a repo-wide executable wrapping the existing `verifyMirrorSync` lib. Takes changed agent paths or `--all`; reports per-runtime drift; exit 1 on any drift.
- **`.opencode/hooks/pre-commit`** — extended with an independent, **staged-agents-only** mirror gate (the comment-hygiene gate is preserved verbatim; fail-safe if node/script missing). Only agents a commit touches are checked, so existing drift never blocks unrelated commits.
- **`.github/workflows/agent-mirror-sync.yml`** — runs the gate over PR-changed agent files (PR → main), mirroring the comment-hygiene CI pattern.
- **`sk-code/assets/scripts/verify_stack_folders.py`** — asserts each declared `STACK_FOLDERS` surface has its `references/<surface>/` + `assets/<surface>/` on disk and flags orphan reference trees.
- **`deep-improvement/scripts/lib/mirror-sync-verify.cjs`** — a surgical `normalizeRuntimeSpecificText` refinement so legitimate per-runtime self-description (the Path Convention line, "this runtime's mirror; canonical lives in …", bare `.md`/`.toml` extensions) no longer reads as drift.
- **`.codex/agents/context.toml`** — fixed real drift: restored the dropped "Structure / Semantic and exact discovery / verify with exact matches and reads" Tool-Inventory row to match canonical (the row had been merged into the memory row).

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two Opus-4.8-via-claude2 dispatches (`bypassPermissions`, Gate-3 pre-approved, scope-locked): (A) the gate + CI + stack-folders + normalizer + pre-commit edit, and (B) the one-row context drift fix. The orchestrator ran a pre-flight audit that discovered the pre-existing drift, diagnosed each case (real vs false-positive), and independently re-verified every result.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Changed-files-scoped gate** (not a hard all-agents gate). The pre-flight audit found context + orchestrate already drifted in committed state; a naive all-agents gate would block every commit. Scoping to staged/changed files (like comment-hygiene) makes the gate shippable and non-disruptive.
- **orchestrate "drift" was a false positive** — each runtime's Path-Convention + self-description text is legitimately per-runtime. Fixed the normalizer (gate accuracy), not the agent text.
- **context "drift" was real** — a merged/dropped Tool-Inventory row; restored to canonical.
- **Normalizer change kept conservative** — a tamper control confirms a genuine extra word still reports drift.
- **Concurrent-session awareness** — unrelated `system-spec-kit/mcp_server/*` working-tree changes belong to another live session; left untouched. A future commit must be scoped (`git commit --only -- <paths>`).

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- `node --check` (gate + lib) + `ast.parse` (py) → clean.
- `check-agent-mirror-sync.cjs --all` → **12 agents checked, all mirrors in sync, exit 0** (orchestrator-run).
- `verify_stack_folders.py` → exit 0 (webflow, opencode, motion_dev all resolve).
- Normalizer conservativeness: tampering a canonical body with a real extra word still yields `allInSync: false`.
- Pre-commit hook tested via a throwaway `GIT_INDEX_FILE` (clean→0, drifted→1) with the real `.git/index` unchanged.
- comment-hygiene on the new `.cjs` → exit 0 (durable-WHY header).
- Scope: only the intended files; the concurrent session's spec-memory changes left untouched.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The mirror gate keys on file paths (so a bare agent name prints "no agent files" — pre-commit/CI always pass paths, which is correct).
- The `.vitest.ts` mirror-sync test couldn't be re-run via the local CLI (repo uses a non-default vitest config); the normalizer behavior was verified directly instead (tamper control + the existing test reported green by the implementer).
- Not committed — sits in the working tree on branch `028-mcp-to-cli-tool-transition`.

<!-- /ANCHOR:limitations -->
