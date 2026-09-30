---
title: "Implementation Summary"
description: "The cli-opencode dispatch safety net now snapshots the target's own in-flight paths and records the hash, instead of asking for a clean or fully committed tree."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/078-layer-3-own-paths-baseline"
    last_updated_at: "2026-09-29T07:31:30Z"
    last_updated_by: "claude"
    recent_action: "Reworded the Layer 3 baseline in the reference and rule 15, and set the reference version"
    next_safe_action: "Commit the packet on Code_Environment main and push it"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md"
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
| **Spec Folder** | 078-layer-3-own-paths-baseline |
| **Completed** | 2026-09-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Layer 3 of the cli-opencode dispatch mitigation keeps its recovery baseline and loses its clean-tree requirement. The checklist row said "`git status` clean OR working tree committed", the prose said to commit "any in-flight working-tree state", and rule 15 said "main `git status` clean OR committed". In a shared tree that wording can only be met by committing other sessions' uncommitted work.

### Reword Layer 3 to the target's own paths

In `.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md` the Layer 3 prose now says to commit the dispatch target's own in-flight changes on `main`, staged by explicit path, and to leave every other change alone because in a shared tree it belongs to another session. The command block now reads `git status --short -- <relevant-paths>`, `git add <relevant-paths>`, `git diff --cached --name-only`, then the same commit as before. The baseline sentence gained a case for a target with no in-flight changes, where `git rev-parse HEAD` is the baseline.

The checklist row now reads "the target's own in-flight changes committed by explicit path (staged set checked with `git diff --cached --name-only`, other sessions' changes left alone), recovery commit hash recorded". Rule 15 in `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` carries the same idea in one clause.

The reference's `version:` moved from `1.4.0.14` to `1.4.0.19`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/destructive-scope-violations.md` | Modified | Layer 3 prose, command block, baseline sentence and checklist row, `version:` set |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modified | Layer 3 clause of rule 15 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The operator was asked whether to reword the row to the target's own paths and chose "Reword to own paths (Recommended)". Every Layer 3 statement was read in full, and each old phrase was searched at `HEAD` as a control, then in the working files. Clean-tree and recovery-baseline wording across the skills, commands, repo rules, `.claude` and `.opencode` was read and classified. The version was computed with the versioning engine, then raised by one so the carrying commit is already counted. The change went to `main` on Code_Environment with explicit paths only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the baseline commit and its recorded hash | The 2026-05-04 incident deleted 44 files, and `git restore` is only a one-command recovery for files that were committed before the dispatch. |
| Scope the snapshot to the target's own paths | Other sessions' files are outside the dispatch target, and committing them publishes work the dispatching agent cannot vouch for. |
| Add `git diff --cached --name-only` to the command block | Naming paths is the rule, and printing the staged set is the check that proves nothing else came along. It matches the write recipe and the sk-git examples. |
| Name `git rev-parse HEAD` as the baseline when the target has no in-flight changes | Without it a clean target has nothing to commit and the "hash recorded" step could not be met. This case was added by this packet and was not in the operator's answer. |
| Leave `permissions-matrix.md:288` alone | It says "commit-before-dispatch gives a recovery baseline" and states no clean-tree requirement. |
| Leave the "primary worktree is clean" check in `deep-review-auto.yaml` alone | It is a code-enforced fail-closed gate in the deep-review wrapper, not prose about Layer 3. |
| Leave the `SKILL.md` version at `1.4.12.0` | The engine treats the `SKILL.md` version as the release anchor of record and derives no per-edit count for it. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The two old reference phrases at `HEAD` (control) | Found at lines 129 and 161 |
| The old rule 15 clause at `HEAD` (control) | Found at line 256 |
| The old phrases in the working files | Absent from both |
| The new phrases in the working files | Found in the reference at lines 129, 138 and 162, and in `SKILL.md` at line 256 |
| Em dash, en dash or semicolon in the reworded text | None in the reference's added lines, none in the reworded rule 15 clause |
| Diff size | `SKILL.md` 1 line changed, the reference 6 added and 5 removed |
| Derived version before this change | `1.4.0.18`, from `frontmatter-version.mjs compute`, and the file carries `1.4.0.19` |
| Other clean-tree and recovery-baseline hits across all doc roots | Classified and left, see the decisions table and the limitations below |
| `validate.sh --strict` on this packet | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `deep-review-auto.yaml` "primary worktree is clean" gate is unchanged.** It is enforced by code, and how it behaves when peers hold uncommitted work was not examined here. If it refuses a dispatch for that reason, it needs its own packet.
2. **No `SKILL.md` release was cut.** Its `version:` stays at `1.4.12.0` and no changelog entry was written, because the engine keeps it as the release anchor.
3. **The build segment of the reference is set by hand to one above the derived count.** It reads stale by one if the file's history changes before the commit lands, and `verify` shows it.
4. **The rule 15 line is a single long line with older dashes and list semicolons.** The dash and semicolon check covered the reworded clause only.
5. **The new wording was checked by search, not by an agent dispatching a deep loop with it.** The next real dispatch is the first use.
<!-- /ANCHOR:limitations -->

---
