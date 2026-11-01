---
title: "Implementation Summary"
description: "A project linked with /doctor:symlink now gets skill advisor answers: the daemon admits a workspace whose .skilled resolves to its own source tree's .skilled."
trigger_phrases:
  - "advisor linked project workspace implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "commands/002-doctor-audit-and-fixes/005-advisor-linked-project-workspace"
    last_updated_at: "2026-11-01T11:30:00Z"
    last_updated_by: "opus-low"
    recent_action: "Admitted linked projects in the advisor allowlist, red to green, both suites passing"
    next_safe_action: "Operator reviews and commits the uncommitted change"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-advisor-linked-project-workspace"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-advisor-linked-project-workspace |
| **Status** | Complete |
| **Completed** | 2026-11-01, uncommitted on `main` at `eed2dd615a` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A project you link with `/doctor:symlink` can now call the skill advisor. Before this change, `advisor_status` from such a project exited 64, because the daemon runs from the source tree and only accepted workspaces inside that tree or a temp folder.

### Phase 5: advisor-linked-project-workspace

The workspace check keeps every prefix it had and adds one case: a path is also accepted when it, or a folder above it, holds a `.skilled` or `.opencode` whose realpath is the source tree's own. A linked project passes because its `.skilled` link resolves into the source tree. A folder with its own copy of `.skilled`, or a link to a different checkout, resolves somewhere else and is still refused. The schema error message now names the linked-project case.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modified | `isWiredToSourceTree()`; `isAllowedWorkspaceRoot()` calls it; error message |
| `.skilled/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts` | Modified | Linked-project admit test and not-wired refuse test |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | The allowlist row names linked projects |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modified | The bounding sentence names linked projects |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two tests went in first and failed against the unmodified schema, and both suites ran as the baseline on that tree. The schema change made the tests pass, the advisor build refreshed `dist/`, and both suites ran again. This checkout's daemon was stopped so the live call from a linked scratch project relaunched it on the new build.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the allowlist owner, not the launcher's spawn `cwd` | One daemon serves its source tree for every linked project, so anchoring it on the source tree is right; the bound was what missed linked projects |
| Compare realpaths of the source-root entry | Only a project actually wired to this checkout matches; a copy or a foreign link does not |
| Walk up from the input | The CLI passes `$PWD`, which can be a subfolder of the linked project |
| No config switch and no wider prefix | Either would admit folders that are not wired to this source |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| New schema tests | Before: `2 failed, 16 passed` (`scratch/red-before-change.md`). After: `18 passed` |
| Advisor suite | Before: `2 failed, 1359 passed, 8 skipped`. After: `1361 passed, 8 skipped`, exit 0 |
| Whole doctor gate | `run-all.sh` `7 suite(s) passed, 0 failed` before and after, exit 0 |
| Typecheck and build | `npm run typecheck` exit 0; `npm run build` recorded the dist attestation; the dist module holds `isWiredToSourceTree` |
| Live proof | `advisor_status` from a scratch project linking only `.skilled`: exit 0, `"status": "ok"` (`scratch/verification-evidence.md`) |
| Strict packet validation | `validate.sh --strict` on this folder and on the parent: `RESULT: PASSED` for both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live call alone does not tell the two rules apart.** The scratch project sits under `/private/tmp`, which the tmp prefix already admits. The discriminating proof is the unit test and the direct `dist/` check, where an unlinked scratch folder is refused by the wiring check and the linked one is accepted.
2. **A running daemon keeps the old rule until it restarts.** The allowlist loads once per daemon, so a checkout that pulls this change sees it after its daemon relaunches.
3. **The Barter coder checkout is not changed here.** It gets the fix when it next re-pins the framework.
<!-- /ANCHOR:limitations -->
