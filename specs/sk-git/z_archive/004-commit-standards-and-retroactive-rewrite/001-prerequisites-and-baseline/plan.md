---
title: "Phase 001 Plan: Prerequisites & Baseline"
description: "Install git-filter-repo, capture pre-rewrite baseline bundle + log, pin tool versions."
trigger_phrases:
  - "112-prerequisites-and-baseline plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/z_archive/004-commit-standards-and-retroactive-rewrite/001-prerequisites-and-baseline"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored phase 001 plan"
    next_safe_action: "Execute T-001 through T-017 in tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-plan-2026-05-16"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 001 — Prerequisites & Baseline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Mechanical preflight. Six commands install `git-filter-repo`, capture a full `git bundle --all` snapshot and a text log of HEAD subjects, then write `evidence/tooling-pins.json` with versions. No git refs touched. Output lives entirely in this phase's `evidence/` subdir.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Acceptance |
|------|-------|------------|
| G1 | `git filter-repo --version` exits 0 | Tool installed |
| G2 | `git bundle verify evidence/pre-rewrite.bundle` exits 0 | Backup recoverable |
| G3 | `wc -l evidence/baseline-log.txt` matches current `git rev-list --count HEAD` | Log complete |
| G4 | `jq . evidence/tooling-pins.json` exits 0 | Pins file is valid JSON |
| G5 | `git config --get commit.gpgsign` is empty or `false` | No signing to break |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure side-effect writes into `evidence/` plus a `brew` install. No code, no scripts. The bundle is the load-bearing artifact — `git filter-repo` mistakes would otherwise be unrecoverable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Stage 1 — Tooling
- `which git-filter-repo` → if absent, `brew install git-filter-repo`
- Record versions: `git`, `git-filter-repo`, `devin`, `python3`, `bash`, `node`, `sw_vers -productVersion`

### Stage 2 — Signing check
- `git config --get commit.gpgsign` and `tag.gpgsign` must be empty or `false`
- If either is `true`, halt phase

### Stage 3 — Capture baseline
- `mkdir -p evidence/`
- `git bundle create evidence/pre-rewrite.bundle --all`
- `git bundle verify evidence/pre-rewrite.bundle`
- `git log --pretty=format:'%H %s' > evidence/baseline-log.txt`

### Stage 4 — Pins file
- Write `evidence/tooling-pins.json` with: captured_at, host, tools versions, gpg_signing state, baseline section (HEAD count, all-refs count, bundle path, bundle sha256 via `shasum -a 256`)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No automated tests. Manual verification:
- All 5 gates above pass.
- `jq` parses `tooling-pins.json` without error.
- Bundle sha256 in the pins file matches a recomputed `shasum -a 256` of the bundle file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `git` (already present)
- `git-filter-repo` (`brew install`)
- `devin` CLI (Phase 004/005 will dispatch)
- `sequential_thinking` MCP server (referenced in `opencode.json`)
- `jq`, `shasum` (macOS defaults)
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trivial. `rm -rf evidence/` and uninstall git-filter-repo via `brew uninstall git-filter-repo` if undesired. No git refs touched.
<!-- /ANCHOR:rollback -->
