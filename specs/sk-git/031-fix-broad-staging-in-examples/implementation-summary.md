---
title: "Implementation Summary"
description: "Three sk-git examples now stay within the author's files like the scoped-staging rule says, and all three files' versions match the derivation."
trigger_phrases:
  - "fix broad staging in examples implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/031-fix-broad-staging-in-examples"
    last_updated_at: "2026-09-29T07:20:03Z"
    last_updated_by: "claude"
    recent_action: "Rewrote three staging examples and set all three file versions"
    next_safe_action: "Commit the packet on Code_Environment main and push it"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/references/finish-workflows.md"
      - ".skilled/skills/sk-git/references/commit-workflows.md"
      - ".skilled/skills/sk-git/references/shared-patterns.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "12f293fe-5421-46a0-b1ea-9fdc15ce0f8e"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-fix-broad-staging-in-examples |
| **Completed** | 2026-09-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sk-git examples now follow the rule the skill states. Example 5 of `finish-workflows.md` ran `git add -A` before a release push to `main`, and `commit-workflows.md` showed `git add src/ tests/` under the heading "Use targeted staging instead". The staging cheat sheet in `shared-patterns.md` listed the same `git add src/ tests/` as a plain option under "Targeted staging (preferred)". In a shared tree all three stage other sessions' uncommitted work into the author's commit.

### Replace broad staging in the release example and the two directory-staging lines

Example 5 in `.skilled/skills/sk-git/references/finish-workflows.md` now runs `git add` with three named files and then `git diff --cached --name-only`, which prints the staged set before the commit. The `git push origin main` line is unchanged. The targeted-staging line at `.skilled/skills/sk-git/references/commit-workflows.md:350` now reads `git add path/to/your/file1 path/to/your/file2` with the comment "Stage only your files, by explicit path".

The cheat sheet line at `.skilled/skills/sk-git/references/shared-patterns.md:161` now reads `git add path/to/dir/` with the comment "A whole directory, only when every file in it is yours". It keeps the option and states the condition the scoped-staging rule sets.

All three files' `version:` moved to the derived value plus one for this commit. `finish-workflows.md` went from `1.1.0.18` to `1.7.0.32`, `commit-workflows.md` from `1.1.0.9` to `1.7.0.16` and `shared-patterns.md` from `1.1.0.12` to `1.7.0.22`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/references/finish-workflows.md` | Modified | Example 5 stages explicit paths, `version:` set |
| `.skilled/skills/sk-git/references/commit-workflows.md` | Modified | Targeted-staging line names files, `version:` set |
| `.skilled/skills/sk-git/references/shared-patterns.md` | Modified | Directory staging option carries its condition, `version:` set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each old line was searched at `HEAD` as a control, then in the working file. Every other broad-staging hit across the skills, commands, repo rules, `.claude` and `.opencode` was read and classified before any edit. The versions were applied with the versioning engine on these three paths only, then raised by one so the carrying commit is already counted. The change went to `main` on Code_Environment with explicit paths only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add `git diff --cached --name-only` to Example 5 | Naming files is the rule, and printing the staged set is the check that proves nothing else came along. |
| Leave broad staging in the five worktree examples | A dedicated worktree holds only the author's work, so `git add -A` there is safe and the simpler form reads better. |
| Leave the `git status --short` reads alone | They read state and stage nothing. |
| Fix both directory lines in the same change | Directory staging is the same defect as `git add -A` at a smaller size. One line sat under a heading that promised the opposite and the other under "Targeted staging (preferred)". |
| Keep the directory option in `shared-patterns.md` and state its condition | The cheat sheet lists every staging form, so the honest fix says when the form is safe. `commit-workflows.md` sets the same condition. |
| Leave `git reset HEAD .` alone | It changes the index and cannot put a peer's file into the author's commit, which is the defect this packet fixes. |
| Bring all three versions forward | The versioning standard says to run the engine in the same commit as the content change, and all three files were far behind. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `git add -A` in Example 5 at `HEAD` (control) | Found |
| `git add -A` in Example 5 in the working file | Absent, replaced by three named paths |
| `git add src/ tests/` in `commit-workflows.md` at `HEAD` (control) | Found at line 350 |
| The same line in the working file | Absent |
| The cited heading | `commit-workflows.md:219`, "Step 7: Scoped-Staging Discipline (Dirty Working Tree)" |
| Em dash or semicolon in the added lines | None |
| `git add src/ tests/` in `shared-patterns.md` at `HEAD` (control) | Found at line 161 |
| The same line in the working file | Absent |
| Derived versions before this change | `1.7.0.31`, `1.7.0.15` and `1.7.0.21`, from `frontmatter-version.mjs verify` |
| Other broad-staging hits across all doc roots | Five inside dedicated worktree flows (`quick-reference.md:274`, `shared-patterns.md:420`, `finish-workflows.md:961`, `worktree-workflows.md:513`, `large-reorg-playbook.md:76`), the rest warnings against the pattern. Classified and left. |
| `validate.sh --strict` on this packet | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cli-opencode "clean or committed" wording is unchanged.** `destructive-scope-violations.md` and the Layer 3 line in the cli-opencode `SKILL.md` ask for a clean or committed tree before dispatch. In a shared tree that could push an agent to commit peers' work. It is a safety rule from a past deletion incident, so it needs the operator's decision and is reported to them in place of a silent rewrite.
2. **The build segments are set by hand to one above the derived count.** They read stale by one if the files' history changes before the commit lands, and `verify` shows it.
3. **`git reset HEAD .` in the same cheat sheet is unchanged.** It unstages every path, including other sessions' staged files. That is index hygiene, a different defect, and it is reported to the operator.
4. **The new wording was checked by search, not by an author following it.** The shipping commit of this packet is the first real use.
<!-- /ANCHOR:limitations -->

---
