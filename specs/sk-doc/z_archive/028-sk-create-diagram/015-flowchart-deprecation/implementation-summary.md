---
title: "Implementation Summary: sk-create-flowchart full deprecation"
description: "Final implementation state and evidence for deleting sk-create-flowchart and purging every live reference."
trigger_phrases:
  - "flowchart deprecation summary"
importance_tier: "important"
contextType: "verification"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/015-flowchart-deprecation"
    last_updated_at: "2026-08-13T17:15:00.000Z"
    last_updated_by: "claude"
    recent_action: "Deletion + purge complete, advisor validated clean"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-flowchart-deprecation |
| **Completed** | Deletion and purge complete; advisor validated clean |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`sk-create-flowchart` no longer exists. The skill directory, its command, its command assets, and its cross-runtime prompt mirrors (codex, pi, cursor) are all deleted. Every live hub registry, advisor entry, code path, and documentation surface that referenced it now either points at `sk-create-diagram` or has the dead entry removed outright.

| Area | Result |
|---|---|
| Skill + command deletion | 8 files/dirs deleted across 4 runtimes, plus 1 pre-existing broken changelog symlink |
| Hub JSON registries | `sk-create-flowchart` removed from 4 files; `sk-create-diagram` added where it was silently missing in the same files |
| Advisor Python inventory | `command-create-flowchart` removed, `command-create-diagram` added to `skill_advisor.py` |
| Code-path repointing | 1 facade symlink + 1 hook's checker-path constant and candidate-match predicate |
| Live documentation | 14 files corrected, including 3 self-contradictory lines in `sk-create-diagram/README.md` itself |
| Test fixtures | 5 manual-testing-playbook scenarios mechanically updated; 2 baseline JSONs had 3 stale entries each removed |
| Generated artifacts | `command-bridges.generated.json` + `projection.ts` regenerated via `derive-command-bridges.cjs`; skill advisor index rebuilt |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Survey first: a repo-wide `grep` for the skill's name and command, scoped by file extension, classified every hit into live-surface (fix) or historical-spec-doc (leave alone) before any file was touched. The survey itself surfaced a recurring, unexpected finding — `sk-create-diagram` was completely absent from 8 live doc/registry files that predate this deletion (`sk-doc`'s own `SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, `feature-catalog.md`, `quick-reference.md`, both `agents/markdown.md` command tables, and `commands/README.txt`) — a pre-existing gap from earlier phases, not something the flowchart deletion introduced. Each was fixed alongside removing the dead flowchart entry, not left for a later pass.

Deletion happened only after every dependent code path (the `sk-doc/scripts/` facade symlink, `post-edit-router.cjs`'s hardcoded checker path and its `isFlowchartCandidate()` segment-match predicate) was confirmed repointed at `sk-create-diagram`'s already-shipped (phase 012) equivalent files. `command-bridges.generated.json` was regenerated via its own script rather than hand-edited. The advisor index was force-rebuilt and validated against its full regression bundle for the `sk-doc` slice.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Implementation |
|---|---|
| Delete outright, not de-index-only | Operator's explicit choice via `AskUserQuestion`; the skill directory, command, and mirrors are all gone, not left present-but-unroutable. |
| Fix pre-existing `sk-create-diagram` gaps found along the way | 8 live files were missing `sk-create-diagram` entirely, independent of the flowchart deletion — fixed rather than left as "someone else's problem" while already editing the same lines. |
| Leave historical `specs/` docs untouched | Phase-parent convention treats prior packets' spec docs as append-only history; only this phase's own new spec docs and the packet's own `spec.md` phase-map were updated. |
| Defer 3 out-of-scope findings | `.opencode/bin/lib/compiled-routing/` generated artifacts, `durable-directory-manifest.json`'s 284-entry pre-existing drift, and the repo-wide `.opencode/changelog/sk-doc/*` symlink-prefix bug are all real, separate, larger bodies of work — named explicitly rather than silently expanded into or silently ignored. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result | Evidence |
|---|---|---|
| Skill deletion | PASS | `find .opencode/skills/sk-doc/sk-create-flowchart` returns nothing |
| Command/mirror deletion | PASS | All 8 files confirmed absent |
| Hub JSON validity | PASS | `json.load` on `command-metadata.json`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json` |
| Python syntax | PASS | `python3 -m py_compile skill_advisor.py` |
| Code-path repointing | PASS | `readlink` on the facade symlink; `grep` confirms the router's new path and predicate |
| Advisor rebuild | PASS | `rebuilt: true`, generation `13068` -> `13069` |
| Advisor validation (sk-doc slice) | PASS | `overallAccuracy: 0.8889`; `explicit_skill_top1_regression.passed: true`, 0 regressions; `command_bridge_false_positive_rate: 0` |
| Repo-wide re-sweep | PASS | Only historical `specs/` docs and intentional provenance mentions remain |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/` still contains stale `sk-create-flowchart` references in its compiled/generated artifacts. This is a separate, deep compiled-routing program (packet `sk-doc/019-skill-routing-refactor`); hand-editing generated output there would drift from its own build process. Deferred as a named follow-up.
2. `durable-directory-manifest.json`'s live-vs-frozen reproduction test (`test_readme_manifest.py`) has a pre-existing 284-entry drift, dominated by `cli-external-orchestration` benchmark-report directories — unrelated to this deletion and already broken before this phase started. Only the 3 flowchart-specific stale entries were removed; the broader drift is out of scope.
3. `.opencode/changelog/sk-doc/*` global changelog symlinks have a repo-wide, pre-existing bug: every packet's symlink target is missing its `sk-` prefix (confirmed on both the flowchart and diff entries). Only the dead flowchart symlink itself was removed; the systemic bug affecting every other packet is out of scope.
4. The worktree contains unrelated concurrent edits and untracked spec folders from other work in this session. They were not reverted or modified.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [ ] Regenerate `.opencode/bin/lib/compiled-routing/`'s compiled artifacts through its own build process to drop stale `sk-create-flowchart` references.
- [ ] Re-sync `durable-directory-manifest.json` against the live filesystem (a dedicated, separate packet — 284 entries, not scoped to sk-doc).
- [ ] Fix the repo-wide `.opencode/changelog/sk-doc/*` symlink-prefix bug across every packet, not just flowchart's now-removed entry.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
