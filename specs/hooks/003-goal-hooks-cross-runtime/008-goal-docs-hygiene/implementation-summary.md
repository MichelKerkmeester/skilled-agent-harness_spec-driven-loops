---
title: "Implementation Summary: Goal docs hygiene + cross-runtime contracts"
description: "Completion record for packet 003's docs closeout: fixed 10 stale rename-fallout references, repaired the goal command-path test, and documented the cross-runtime goal hooks across injection-contract.md, goal-plugin.md, the runtime-routing constitutional rule, and the goal concern README."
trigger_phrases:
  - "goal docs hygiene summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/008-goal-docs-hygiene"
    last_updated_at: "2026-08-11T06:43:15.940Z"
    last_updated_by: "claude"
    recent_action: "Decommissioned Devin: removed all commands + goal hook (adapter/registration/docs)"
    next_safe_action: "Commit; optional: reconcile cli-devin COMMANDS scenarios + SYNC §5 narrative"
    blockers: []
    key_files:
      - ".devin/hooks.v1.json"
      - ".devin/SYNC.md"
      - ".opencode/skills/system-spec-kit/scripts/runtime-mirrors/command-scope.cjs"
      - ".opencode/skills/system-spec-kit/references/hooks/goal-plugin.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-008-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope: docs-only closeout phase, no new hook code."
      - "goal-plugin.md hosts the cross-runtime section; no separate sibling doc was created."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-goal-docs-hygiene |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The docs closeout for the cross-runtime goal-hooks packet: the goal command moved into a `commands/goal/` subfolder (invoked `/goal:goal-opencode`), leaving stale references behind, and phases 003/004/005's Devin/Cursor/Pi adapters were undocumented in the hook-injection references. Both are now resolved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `references/hooks/goal-plugin.md` | Modify | Fixed flat command path (3×) + dead RELATED packet path; added a "Cross-Runtime Relationship" section (shared-file model + capability tiers). |
| `references/hooks/injection-contract.md` | Modify | Added the cross-runtime active-goal entry: verbatim `[active_goal]` block + per-runtime channel/visibility (Devin/Cursor `[SYS]`, Pi `[MSG]`). |
| `constitutional/goal-prompting-runtime-specific.md` | Modify | Fixed the `*goal*.md` glob to the subfolder; added the fifth-move history note + a Devin/Cursor/Pi routing section; added `/goal:goal-opencode` trigger. |
| `feature-catalog/ux-hooks/goal-opencode-plugin.md` | Modify | Fixed stale `goal_opencode.md` paths (2×). |
| `README.md` | Modify | `README.md:1063` `/goal_opencode` -> `/goal:goal-opencode`. |
| `plugins/tests/mk-goal-tool-path.test.cjs` | Modify | Test 8 regex -> subfolder path; test 9 -> archived `026-goal-opencode-plugin` graph. |
| `.opencode/hooks/goal/README.md` | Modify | Corrected the stale "no adapter wiring yet" Status/§2 to the built state (devin/cursor/pi adapters present, per-runtime tiers). |
| `SKILL.md`, `feature-catalog/feature-catalog.md`, `references/config/hook-system.md`, `manual-testing-playbook/ux-hooks/goal-opencode-plugin.md` | Modify | **Scope expansion:** the REQ-001 verification grep found 4 more files carrying the same stale flat/underscore command path; all fixed to meet the zero-live-hits acceptance. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ran last in the packet, after phases 001-007 landed, so the docs describe real artifacts. The stale references were located by targeted `grep` (the repo's rg output mangles these specific strings, so `grep -F`-style checks were used). The `commands/{memory,deep,speckit}/*.md -> /namespace:command` convention fixed the correct invocation form as `/goal:goal-opencode`. The verbatim `[active_goal]` block came from the goal concern README's already-authored "WHAT IT DOES AND INJECTS" section.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Host the cross-runtime content in `goal-plugin.md`, not a new `goal-cross-runtime.md` | The added content (shared-file model + a compact capability table + pointers) fit one section; a separate doc would fragment discovery. The open question is resolved. |
| Fix the 4 additional stale references beyond the spec's named 4 | REQ-001's acceptance is "zero live hits"; leaving known-stale live refs to honor a literal 4-file scope would make that claim false. Recorded as a documented scope expansion. |
| Leave the pre-existing "missing overview section" doc-validator warning | It reproduces identically at HEAD on `goal-plugin.md` and the constitutional file (they use "PURPOSE"/"Rule" headings); not introduced here, and renaming those headings is out of scope. |
| Leave `mk-goal-tool-path.test.cjs` tests 1-6 env-gated | They fail only on the absent `@opencode-ai/plugin` dependency in the main tree, not on any rename fallout; the documented baseline confirms they pass where deps are installed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Manual (grep sweep) | PASS | Zero live `goal_opencode` / flat `commands/goal-opencode.md` hits outside the intentional constitutional history and `z_archive`. |
| Unit (`mk-goal-tool-path.test.cjs`) | PASS (rename scope) | The 3 file-read tests (7/8/9) pass after the fixes; tests 1-6 env-gated on the absent `@opencode-ai/plugin` dep (unchanged). |
| Documentation (`validate_document.py`) | PASS (edits) | `injection-contract.md`, `goal/README.md`, both `ux-hooks` docs = 0 issues; `goal-plugin.md` + constitutional carry a pre-existing "missing overview" warning (identical at HEAD). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`mk-goal-tool-path.test.cjs` tests 1-6 remain env-gated** on the `@opencode-ai/plugin` dependency, absent from the main tree's `.opencode/node_modules`. They are unrelated to the rename and pass in the documented environment; running them here would require installing the `.opencode` deps.
2. **Two docs keep a pre-existing "missing overview section" validator warning** (`goal-plugin.md`, the constitutional rule) — present at HEAD, not introduced here; harmonizing their heading convention is a separate cleanup.
3. **The invocation form `/goal:goal-opencode` follows the repo's `folder:command` convention** and the recent memory index; per the constitutional rule's own guidance, the live command filename should still be re-verified before invoking, as it has moved on operator decision before.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Follow-up (operator-directed, 2026-07-29): per-CLI goal command surface

Limitation #3 above anticipated the goal command filename could move again "on operator decision." It did. Documented here per the operator's Gate-3 choice to reuse 008; this extends 008 beyond its original docs-only scope with a small amount of runtime tooling.

**What changed:**
- **Relocated the OpenCode command** `.opencode/commands/goal/goal-opencode.md` → `.opencode/commands/goal-opencode.md` (out of the `goal/` subfolder), reversing 008's earlier move-in. The command is now `/goal-opencode` (filename-derived); the H1 and ~19 live path/name references were updated (`commands/goal/goal-opencode` → `commands/goal-opencode`, `/goal:goal-opencode` → `/goal-opencode`). Historical spec records (032 children, sk-doc/020 census) were left intact.
- **Added one runtime-native goal command per goal-capable runtime**, named for the runtime and driving the runtime-neutral `bin/goal.cjs` manage CLI: `.cursor/commands/goal-cursor.md`, `.devin/skills/goal-devin/SKILL.md`, `.pi/prompts/goal-pi.md`. OpenCode keeps `/goal-opencode` (`mk_goal` tools); Claude reaches it via its whole-directory command symlink; Codex has no goal hook and no goal command.
- **Taught the three mirror generators runtime-exclusive scope** via a shared `.opencode/skills/system-spec-kit/scripts/runtime-mirrors/command-scope.cjs`: `goal-opencode` is not cross-mirrored, and each runtime's hand-authored native command is exempt from orphan-pruning. Removed the stale `goal-goal-opencode` (Cursor/Devin) and `goal-opencode` (Codex/Pi) mirrors the move orphaned.
- **Documented the per-CLI command surface** in `goal-plugin.md` §8.

**Evidence:**
- All three generators PASS `--check` after regen (167 runtime-mirror / 34 codex / 34 pi in sync).
- `goal-core.test.cjs` PASS; the `mk-goal` plugin path assertions (`mk-goal-tool-path.test.cjs`, `mk-goal-capabilities.test.cjs`) were repointed to the top-level path — still env-gated on the absent `@opencode-ai/plugin` dependency, an unchanged baseline.
- Final per-runtime surface verified: OpenCode `goal-opencode` only, Cursor `goal-cursor` only, Devin `goal-devin` only, Pi `goal-pi` only, Codex none, Claude `goal-opencode` (via symlink).

Limitation #3 is now **resolved** — the command lives at the top level and the docs/tests reference it there.
<!-- /ANCHOR:followup -->

---

**Note on invocation form:** the earlier "Known Limitations" §3 mentions the `/goal:goal-opencode` form; that form is now superseded by `/goal-opencode` (top-level, filename-derived) as recorded in this follow-up.

---

<!-- ANCHOR:followup-devin -->
## Follow-up (operator-directed, 2026-07-29): Devin command + goal-hook decommission

Second operator directive: remove **all** commands from the Devin CLI and remove the Devin goal hook entirely. Recorded here per the operator's Gate-3 choice to reuse 008. This reverses the Devin goal-hook phase (032/003) and the `goal-devin` command added earlier the same day.

**What was removed:**
- **Devin's entire command surface** (35 mirrored `.devin/skills/<cmd>/SKILL.md`): dropped the `devin-skills` link generation in `sync-runtime-mirrors.cjs`, removed the `.devin/skills` exemption from `command-scope.cjs`, and let the mirror's orphan cleanup delete all 35. Devin keeps its 13 agent mirrors and its natively-discovered `.opencode/skills/` packets (`/sk-doc`, `/sk-git`, …).
- **The Devin goal hook**: deleted the adapter source `.opencode/hooks/goal/devin/` (goal-inject / goal-session-start / goal-verify + test), unregistered its three entries from `.devin/hooks.v1.json` (SessionStart / UserPromptSubmit / Stop), and let the sync remove the orphaned `.devin/hooks/goal-*.mjs` symlinks. The `goal-devin` command is gone.
- **Docs**: deleted the cli-devin goal-hook playbook + the goal-only cli-devin `benchmark/` tree and de-registered them; removed Devin from the cross-runtime goal docs (`goal-plugin.md` §8 tables, `injection-contract.md`, `hooks/goal/README.md`, `hooks/README.md`, `goal-manage-cli.md`) while preserving Devin's non-goal hook references; updated `.devin/SYNC.md` to drop the mirrored-command surface.

**Preserved (verified):** Cursor and Pi goal hooks plus `/goal-cursor` / `/goal-pi`; OpenCode `/goal-opencode`; Devin's agent roster (`agent-roster-mirror-check` PASS 13/13) and every non-goal Devin hook (spec-gate, advisor, permission, dispatch, mcp-route, post-edit, task-dispatch).

**Evidence:** all three mirror generators PASS `--check` after regen (130 / 34 / 34 in sync); `.devin/skills` emptied and removed; no live reference to the deleted `.opencode/hooks/goal/devin/` remains; `goal-core.test.cjs` PASS.

**Deferred (flagged for operator):** the cli-devin playbook's "COMMANDS AND SKILLS" scenarios (`DV-014..DV-016`) and its "36 slash-command roster" coverage note still describe the removed mirrored-command surface, and `SYNC.md` §5's strict-YAML anecdote references those historical command mirrors. Reconciling them is a broader cli-devin playbook rewrite beyond the "remove commands + goal hook" directive.
<!-- /ANCHOR:followup-devin -->

**Rollback:** every change here is git-tracked; `git revert` of the decommission commit restores Devin's commands and goal hook wholesale.
