---
title: "Tasks: Rename /design:design-reference to /design:extract"
description: "Task breakdown for the canonical rename, mirror regeneration, residue delete, and doc-reference updates."
trigger_phrases:
  - "rename design-reference to extract tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/007-rename-design-reference-to-extract"
    last_updated_at: "2026-08-20T19:00:01Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown"
    next_safe_action: "Execute T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Rename /design:design-reference to /design:extract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the pre-change baseline: `find` for every `*interface*design*` mirror file across `.claude`/`.codex`/`.cursor`/`.pi`/`.devin`; `rg` count for literal `design:design-reference`/`design-reference.md` across live surfaces.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 `git mv` the canonical command file `.opencode/commands/design/design-reference.md` -> `extract.md`.
- [x] T003 `git mv` the three owned assets to the `extract-*` naming.
- [x] T004 Rewrite internal literal references inside `extract.md` and the three renamed assets (`/design:design-reference` -> `/design:extract`, asset filenames, headings naming the command); leave "Style Reference DESIGN.md" and `sk-design-md-generator` untouched.
- [x] T005 Run `sync-runtime-mirrors.cjs` (write mode) — regenerates Claude/Cursor/Devin symlinks, removes the orphaned `design-reference` mirrors.
- [x] T006 Run `sync-prompts.cjs` (Codex, write mode) and `sync-prompts-pi.cjs` (Pi, write mode) — regenerates the `design-extract.md` router prompts, removes the stale `interface-design*.md` copies via their own orphan cleanup.
- [x] T007 `git rm -r .claude/commands/interface/` — the one mirror-sync blind spot (broken symlinks with no canonical source to key an orphan scan against).
- [x] T008 Edit `.opencode/agents/design.md` and `.claude/agents/design.md`: `/design:design-reference` -> `/design:extract`.
- [x] T009 Run `sync-agents.cjs` (Codex) and `sync-agents-pi.cjs` (Pi) to regenerate `.codex/agents/design.toml` and `.pi/agents/design.md` from the edited canonical source.
- [x] T010 Edit `sk-design-md-generator/references/creation-contract.md` (title/description/trigger-phrase/table/JSON-command-field literal path references) and `sk-design-md-generator/graph-metadata.json` (`domains`/`key_topics` entries naming the command).
- [x] T011 Edit `.opencode/commands/README.txt` (the stale `commands/interface/` directory-listing row, the command tree diagram, and the invocation-path table row).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-run the Phase 1 `find`/`rg` sweep; diff against baseline — zero residual `interface*design*` mirrors, zero live `design:design-reference` hits outside the documented out-of-scope set.
- [x] T013 `sync-runtime-mirrors.cjs --check`, `sync-prompts.cjs --check`, `sync-prompts-pi.cjs --check` all pass with zero drift.
- [x] T014 `validate.sh` on this phase folder; `validate.sh --recursive --strict` on the `016` packet — both exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 14 tasks (T001-T014) marked `[x]`
- [x] Zero residual `interface:design*` mirrors on any runtime
- [x] `/design:extract` resolves on all six runtimes via regenerated mirrors, none hand-authored
- [x] All three mirror `--check` scripts pass; `validate.sh --recursive --strict` on `016` exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
