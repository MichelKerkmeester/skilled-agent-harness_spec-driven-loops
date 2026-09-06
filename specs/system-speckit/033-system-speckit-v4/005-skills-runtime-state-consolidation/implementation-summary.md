---
title: "Implementation Summary: skills-root state consolidation"
description: "Seven runtime-state directories moved under a single .state parent, so the skills root lists skills instead of mostly machine state."
trigger_phrases:
  - "seven state directories relocated"
  - "state parent implementation outcome"
  - "skills root lists skills only"
  - "daemon restart after state move"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/005-skills-runtime-state-consolidation"
    last_updated_at: "2026-08-28T09:06:37Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Relocated seven state directories under .state"
    next_safe_action: "Commit; restart the pre-change daemons"
    blockers: []
    key_files:
      - ".gitignore"
      - ".opencode/skills/.state/"
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs"
    session_dedup:
      fingerprint: "sha256:a7a2f84ce2b5d8e1ccf3a004f2e15a2f529ddf501aa87a44aff9e6a8282fc379"
      session_id: "038-skills-state-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether a standing guard check should fail the gate on any pre-.state path write"
    answered_questions:
      - "One .state parent rather than seven siblings"
      - "Discard existing state rather than migrate it"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-skills-runtime-state-consolidation |
| **Completed** | 2026-08-28 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.opencode/skills/` is the directory someone opens to see what skills exist. Seven hidden runtime-state directories sat there beside them, so a large share of the entries were machine state that nobody browsing skills wants. All seven now live under one `.state/` parent, one child per owning subsystem, and the skills root lists skills.

### The relocation

Each directory dropped its redundant leading dot and `-state` suffix, since the parent already carries both meanings: `.advisor-state` became `.state/advisor`, `.spec-gate-state` became `.state/spec-gate`, and so on. Seven owning resolvers changed, one per subsystem, and nothing above them is aware of the extra segment.

### What made it more than a rename

Three build outputs compile sources that carry the path, so they were regenerated rather than edited. Fifteen ignore rules collapsed to two. Fifty-seven relative links inside the relocated READMEs needed one more `../`. And two fail-open tests broke because they rebuilt the state directory's parent by hand instead of asking the resolver.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/.state/` | Created | Single parent, seven subsystem children |
| `.opencode/skills/.state/*/README.md` | Moved | Seven docs relocated as renames, relative links re-pointed |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modified | Goal state resolver |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` | Modified | Loop-guard resolver |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Spec-gate resolver |
| `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs` | Modified | Sentinel resolver |
| `.opencode/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts` | Modified | Authority resolver |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/**` | Modified | Advisor lease, watcher, generation, workspace-root |
| `.opencode/skills/system-spec-kit/scripts/observability/*.ts` | Modified | Telemetry writer and analyzer |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modified | Fail-open fixtures derive the parent from the resolved path |
| `.gitignore` | Modified | Fifteen rules replaced by an exclusion plus a negation |
| Nineteen tests, twenty-seven documents | Modified | Path references updated |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Ownership discovery came first, and it started wrong. The `grep` and `rg` available here are wrapped shell functions that returned zero matches for strings that plainly existed, which briefly suggested no code referenced these directories at all. The inventory was rebuilt in Python before anything was edited.

The rewrite ran as a dry run first, then applied to source, tests and documentation. The seven tracked READMEs moved with `git mv` so history follows them; the thirty untracked runtime files were discarded with their directories. A residual scan then returned zero references to any old path.

Three verification steps mattered more than the rest. Each of the seven resolvers was read or called directly and confirmed to report a `.state/` path. The advisor was then exercised for real, and its `skill-graph-generation.json` appeared under `.state/advisor/` — a write observed rather than inferred. Finally the workspace gate ran to zero failures, after the two fail-open fixtures were fixed.

Two surprises are worth recording. An old directory reappeared minutes after deletion; the cause was advisor daemons started the previous day still holding the pre-change resolver in memory, not a missed reference. And staging had to be done by explicit pathspec: three other sessions were working in the same checkout, and a `git add -A` swept in 341 unrelated files before it was reset.

Nothing was committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One `.state/` parent rather than seven siblings | The complaint is about what the skills root shows; grouping fixes it at the smallest blast radius |
| Children drop the dot and the `-state` suffix | The parent already carries both meanings, so repeating them is noise |
| Discard state rather than migrate it | Every file was derived and machine-local; some was held open by a running process |
| Match one level inside `.state` in `.gitignore` | Git cannot re-include a file under an excluded directory, so the obvious rule silently untracked all seven READMEs |
| Fixtures derive the parent from the resolved path | The tests broke because they duplicated knowledge the resolver already had |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Residual scan | PASS. Zero references to any old path outside historical run evidence |
| Resolver reads | PASS. All seven report a path under `.opencode/skills/.state/` |
| Runtime observation | PASS. The advisor wrote `skill-graph-generation.json` under `.state/advisor/` |
| Build outputs | PASS. All three packages rebuilt; zero old-path references in any dist |
| Workspace test gate | PASS. `73 files · 750 pass · 0 fail`; vitest `101 pass · 0 fail` |
| Markdown link guard | PASS. `8561 files, 13956 links checked, 0 broken` |
| Ignore semantics | PASS. Runtime file ignored; README not ignored |
| Rename tracking | PASS. All seven READMEs recorded as `R` renames |
| Staging boundary | PASS. Zero files from three concurrent sessions staged |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-change daemons keep writing the old paths.** Advisor daemons started before the change recreated `.advisor-state` from memory. They pick up the new location on restart. Because the old paths are no longer ignored, a recreated directory shows up as untracked, which is deliberate: the stale process stays visible instead of diverging silently.
2. **No standing guard against a regression.** The residual scan proved the current state once; nothing fails the gate if new code writes a pre-`.state` path. This is the packet's single open question.
3. **Discarded history is gone.** Sentinel dedup entries and open spec-gate session records were not migrated, so one duplicate advisory or one re-asked gate question is possible. Both self-heal.
4. **Historical benchmark evidence still names an old path.** One `system-deep-loop` run report records the pre-change location. It was deliberately left alone; editing it would falsify what that run actually observed.
<!-- /ANCHOR:limitations -->

---
