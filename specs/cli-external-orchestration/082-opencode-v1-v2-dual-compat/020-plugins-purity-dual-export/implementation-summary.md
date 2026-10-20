---
title: "Implementation Summary"
description: "Spec-Kit Check was red on main because its Runtime vitest project step, finally unmasked, reported the plugins purity test failing every dual-export plugin as a plain hook object. The test now recognises the dual OpenCode export — require setup, call server, demand a hook key — and the whole Runtime project passes locally."
trigger_phrases:
  - "plugins purity dual export implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/020-plugins-purity-dual-export"
    last_updated_at: "2026-10-20T06:45:07Z"
    last_updated_by: "generate-context"
    recent_action: "Spec-Kit Check passed on main at 457c4ac107, run 39380190180"
    next_safe_action: "None; every repaired check passes on main"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts"
      - "scratch/facts.md"
    session_dedup:
      fingerprint: "sha256:d841d87d2e3ca018cbda2cf3a0babda5b620a28c65ee382ad73fbca3dcf828e5"
      session_id: "scaffold-020-plugins-purity-dual-export"
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
| **Spec Folder** | 020-plugins-purity-dual-export |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Runtime vitest project — the Spec-Kit Check step that failed on main — passes locally again. The purity test learned the one shape it did not know, the dual OpenCode export, and no plugin file changed to get there.

### Phase 20: plugins-purity-dual-export

The CI Spec-Kit Check failed on main commit `22f563b032` (run `39373558502`) in its Runtime vitest project step: `runtime/tests/opencode-plugins-folder-purity.vitest.ts` reported `.skilled/plugins/classifier-injection-screen.js object default export has no recognized OpenCode hook keys`, with 1 failed, 108 passed and 3 skipped test files. The step had never met the dual export before: the CLI vitest project step had failed on every main run since `47371b495f`, so the job, which stops at its first failing step, never reached the Runtime step until `22f563b032`. By then `f7b54c52db` — "load the eleven mechanical plugins on OpenCode 2" — had made the plugins default-export `dualPlugin(id, server)` from `.opencode/plugins/lib/v2-bridge.js`, an object `{ id, server, setup }` where `server` is the v1 factory the host calls. The purity test treated any object default export as a hook object, so every dual plugin failed it; classifier-injection-screen.js was only the first file in sorted order.

The fixed test keeps its two original branches and adds a third: when the default export has a `server` function, it requires a `setup` function, calls `server({})` and requires the returned object to carry a recognised OpenCode hook key — the same call-through commit `27763681f7` used when the session-relaunch conformance suite started calling `default.server`. Three temporary mutation plugins, each written to `.opencode/plugins/zz-mutation-probe.js` and deleted after its run, proved the test still rejects: a dual export whose `server` returns no hook keys failed with "dual plugin server factory returned no recognized OpenCode hook keys", and a dual-shaped object missing `server` as well as a plain object with no hook keys both failed with "object default export has no recognized OpenCode hook keys". The purity test then passes 1 of 1 and the whole Runtime vitest project passes locally: 109 files passed, 3 skipped; 1333 tests passed, 13 skipped.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/tests/opencode-plugins-folder-purity.vitest.ts` | Modified | Adds the dual-export branch — requires `setup`, calls `server({})`, requires a recognised hook key — leaving the plain factory and plain hook-object branches unchanged |
| This folder's `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` | Modified | The phase records, filled from the scaffold |
| `../spec.md` | Modified | The phase 20 row and the 019-to-020 handoff row in the phase map |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every claim rests on `scratch/facts.md`, which names a source for each fact, including the main evidence and the commit chain. The failure was reproduced locally before any edit (`scratch/before/plugins-purity-vitest.txt`), the fix followed the pattern `27763681f7` set in the session-relaunch conformance suite, and the three mutation probes each ran before they were deleted so the new branch is proven to reject, not absorb: a dual export whose `server` returns no hook keys fails "dual plugin server factory returned no recognized OpenCode hook keys" (`scratch/after/mutation-dual-server-no-hooks.txt`), while a dual-shaped object missing `server` and a plain object with no hook keys both fail "object default export has no recognized OpenCode hook keys" (`scratch/after/mutation-dual-missing-server.txt`, `scratch/after/mutation-plain-object-no-hooks.txt`). The after-run and the full Runtime vitest project close the local proof (`scratch/after/plugins-purity-vitest.txt`, `scratch/after/runtime-project-summary.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Teach the test the dual export instead of changing any plugin | The dual export is the shape the bridge ships since `f7b54c52db`, with `server` being the v1 factory the host calls, and `27763681f7` already verified through `default.server` in the session-relaunch conformance suite |
| Require `setup` whenever `server` is present | The dual export carries `{ id, server, setup }`, so the branch verifies the whole shape rather than accepting a partial object |
| Leave the green-on-main claim out of every record | Spec-Kit Check is proven only locally so far; it was red on main at `22f563b032`, and a CI run on main has not shown it green yet |
| Delete each mutation probe after its run | A deliberately bad plugin left in `.opencode/plugins/` would fail every later suite run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduction before the fix | FAIL as expected: 1 failed, exit 1, `classifier-injection-screen.js` reported (`scratch/before/plugins-purity-vitest.txt`) |
| Mutation probe: dual export whose `server` returns no hook keys | FAIL as intended: "dual plugin server factory returned no recognized OpenCode hook keys", exit 1, probe deleted after the run (`scratch/after/mutation-dual-server-no-hooks.txt`) |
| Mutation probe: dual-shaped object missing `server` | FAIL as intended: "object default export has no recognized OpenCode hook keys", exit 1, probe deleted after the run (`scratch/after/mutation-dual-missing-server.txt`) |
| Mutation probe: plain object with no hook keys | FAIL as intended: "object default export has no recognized OpenCode hook keys", exit 1, probe deleted after the run (`scratch/after/mutation-plain-object-no-hooks.txt`) |
| Purity test after the fix | PASS: 1 of 1, exit 0 (`scratch/after/plugins-purity-vitest.txt`) |
| Plugin branch map | All 16 regular plugin files in `.skilled/plugins/` take the dual branch (`scratch/after/plugin-branch-map.txt`) |
| Runtime vitest project | PASS locally: 109 files passed, 3 skipped; 1333 tests passed, 13 skipped; exit 0 (`scratch/after/runtime-project-summary.txt`) |
| Spec-Kit Check on main | RED on main at `22f563b032` (run `39373558502`). Proven only locally so far; no CI run on main has shown it green yet |
| Strict spec validation | The recursive `validate.sh --strict` run over 082 gives 21 of 21 RESULT: PASSED, exit 0, after the continuity save and a `repair-derived.cjs` refresh of the parent metadata (`scratch/after/validate-082-recursive.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Main status** Spec-Kit Check passed on main at 457c4ac107, run 39380190180, after being red on main from 47371b495f through 22f563b032 (run 39373558502).
2. **The `sk-vision.js` gap, unchanged by this fix.** `sk-vision.js` is a symlink to `../skills/sk-vision/vision-runtime/dist/plugin.js`, so its Dirent is not a regular file and the test never scans it. Its built bundle has the dual shape locally. That target is gitignored and Spec-Kit Check does not build sk-vision, so widening the filter to symlinks would make CI import a missing file; the gap is recorded instead.
<!-- /ANCHOR:limitations -->

---
