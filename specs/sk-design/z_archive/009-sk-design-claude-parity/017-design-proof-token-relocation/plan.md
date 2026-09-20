---
title: "Implementation Plan: Phase 017 - design_proof_token.md Relocation"
description: "Plan for git-mv'ing design_proof_token.md into shared/, repointing 8 files across 2 skills, and re-verifying D5 connectivity."
trigger_phrases:
  - "phase 017 plan"
  - "design proof token relocation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/017-design-proof-token-relocation"
    last_updated_at: "2026-07-07T04:22:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan.md"
    next_safe_action: "Author tasks.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-proof-token-relocation-017"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 017 - design_proof_token.md Relocation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference docs + JSON hub-router config |
| **Framework** | sk-design hub `shared/` convention (cross-cutting docs live flat in `shared/`, not in a per-topic `references/`) |
| **Storage** | `.opencode/skills/sk-design/{references -> shared}/design_proof_token.md`, plus 7 citing files across `sk-design` and `mcp-open-design` |
| **Testing** | Repo-wide grep sweep (before/after), JSON parse check, skill-benchmark D5 connectivity re-run |

### Overview

A single-file `references/` folder at the sk-design hub root is structural drift: every sibling cross-cutting doc already lives flat in `shared/`. Move the file with `git mv`, fix the 7 files that cite its old path (1 in-skill JSON config, 2 in-skill asset cards, 4 cross-skill docs in `mcp-open-design`, 6 total occurrences), delete the emptied folder, and confirm the automated connectivity gate still passes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Confirmed the file is NOT orphaned — repo-wide grep before the move found 8 live citation sites (1 in-skill JSON + 2 in-skill assets + 4 cross-skill docs with 6 occurrences)
- [x] Read the file's own content to confirm no internal relative links would break (it cites paths in repo-absolute form inside a JSON example, not as markdown relative links)

### Definition of Done
- [x] File moved via `git mv`, `references/` folder removed
- [x] All 7 citing files repointed (8 total path occurrences)
- [x] Repo-wide grep confirms zero live stale hits
- [x] D5 connectivity gate re-run and passing
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure path relocation — no content or behavior change. `references/` and `shared/` are both direct children of `sk-design/`, so the file's own internal repo-absolute path citations are unaffected by the move; only external files that point AT the file need their relative path segment updated.

### Key Components

- **In-skill JSON**: `hub-router.json` `routerPolicy.defaultResource[3]` — literal string swap.
- **In-skill asset cards**: `shared/assets/{proof_of_application_card,context_loaded_card}.md` — relative depth changes from `../../references/` (2 levels up then into `references/`) to `../` (1 level up, since both files now sit under `shared/`).
- **Cross-skill docs**: `mcp-open-design/references/*.md` — relative depth is unchanged (`../../sk-design/`, since both skills are siblings under `.opencode/skills/`); only the trailing `references/` segment becomes `shared/`. Two of these links carry `#anchor` fragments that must be preserved verbatim.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Repo-wide grep for `design_proof_token` across `.md`/`.json`/`.yaml`/`.txt`, classify each hit as live vs. historical/frozen
- [x] Read the target file in full to rule out internal relative links that would break

### Phase 2: Implementation
- [x] `git mv` the file into `shared/`; remove the emptied `references/` folder
- [x] Repoint `hub-router.json`, bump version
- [x] Repoint the 2 `shared/assets/*.md` cards
- [x] Repoint the 4 `mcp-open-design/references/*.md` files (6 occurrences), preserving both `#anchor` fragments

### Phase 3: Verification
- [x] Repo-wide grep confirms zero live stale hits (only the pre-existing changelog/review/closed-phase mentions remain)
- [x] `hub-router.json` JSON-parses cleanly
- [x] Router-mode skill-benchmark re-run: D5 connectivity 100/100, verdict PASS
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep sweep | Every `.md`/`.json`/`.yaml`/`.txt` under `.opencode`, before and after | `grep -rln` |
| JSON syntax | `hub-router.json` | `python3 -c "import json; json.load(open(f))"` |
| Connectivity gate | Full sk-design skill, router mode (fast, no LLM dispatch) | `run-skill-benchmark.cjs --trace-mode router` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `run-skill-benchmark.cjs` D5 connectivity gate | Verification tool | Available, already exercised in phase 016 | Would need manual link-resolution verification instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Grep sweep or D5 gate finds a broken/missed reference after the move.
- **Procedure**: `git mv` the file back to `references/design_proof_token.md`, `git restore` the 7 edited files, re-verify D5 returns to its pre-move baseline.
<!-- /ANCHOR:rollback -->
