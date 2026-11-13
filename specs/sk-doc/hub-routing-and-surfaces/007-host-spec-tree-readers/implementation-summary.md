---
title: "Implementation Summary"
description: "A host repository that vendors Skilled no longer fails the route sync check or the route-gold check for lacking Skilled's spec tree, and one advisor test no longer reads that tree. The sync check prints a SKIP line and exits 0 in a host, the guard notes a skip, and the evidence module sits under the advisor tests."
trigger_phrases:
  - "host spec tree readers implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/007-host-spec-tree-readers"
    last_updated_at: "2026-11-13T20:00:00Z"
    last_updated_by: "orchestrating-session"
    recent_action: "Built and verified, nothing committed"
    next_safe_action: "Commit when the operator asks"
    blockers: []
    key_files:
      - ".skilled/bin/compiled-route-sync.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - ".skilled/bin/tests/compiled-route-sync-host.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-host-spec-tree-readers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-host-spec-tree-readers |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A host that vendors Skilled under `.skilled` and keeps its own `specs/` folder no longer fails two checks for lacking Skilled's authored routing tree. `compiled-route-sync.cjs --check` prints a SKIP line and exits 0 there, and check 3 of `verify-router-sync.cjs` notes a skip where it printed `route-gold not found`. One advisor test no longer imports from a spec folder.

### Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree

You can run the sync check and the router-sync guard in a host without a failure that has nothing to do with the host's own routing. The rebuild still fails everywhere, so a host cannot publish from a tree it does not have. A new exported `authoredRootState` tells the sync script whether the authored folder is present.

The evidence module that the advisor test and the activation matrix test share moved out of the old spec folder into the advisor runtime tests. Both importers now point at the new place, so the vitest run no longer needs a `specs/` path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/compiled-route-sync.cjs` | Modified | New exported `authoredRootState`. `--check` prints a SKIP line and exits 0 in a host with no authored folder |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | `skipNotes` and a host skip for check 3 in place of `route-gold not found` |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modified | One host route-gold case |
| `.skilled/bin/tests/compiled-route-sync-host.test.cjs` | Created | Two tests for the host skip and the own-checkout failure |
| `.skilled/skills/system-skill-advisor/runtime/tests/helpers/activation-matrix-evidence.mjs` | Created | The evidence module, moved from the old spec folder |
| `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix-evidence.mjs` | Deleted | Moved out by `mv` |
| `.skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts` | Modified | Imports the moved module |
| `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` | Modified | Imports the moved module |
| `.skilled/skills/system-skill-advisor/runtime/tests/helpers/README.md`, `.skilled/skills/system-skill-advisor/runtime/tests/README.md` | Modified | Name the moved module |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An Opus agent planned the edits from a decided design. A DeepSeek worker (`dsh --profile headless`, LLM Gateway route) applied them from the literal text in `plan.md`. The orchestrating session read the diff and reran the gates in the worktree. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Skip in a host and fail in Skilled's own checkout | The check still has to fail where the authored folder should exist, so only a host with no authored folder skips |
| The rebuild still fails everywhere | A skip in a check is safe. A skipped rebuild would publish nothing and hide the cause |
| Move the evidence module under the advisor tests | The vitest run needed a path inside the advisor runtime, not one into a spec folder a host does not have |
| Worker used `mv` in place of `git mv` | The worker's sandbox could not write the shared git index. The content is byte-identical and git records the rename at commit time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/bin/tests/` | Before 180 tests, 179 pass, 0 fail, 1 skipped. After 182 tests, 181 pass, 0 fail, 1 skipped, exit 0 |
| `node --test` on `verify-router-sync.test.cjs` | Before 13 of 13. After 16 of 16, exit 0. One case is this packet's and two are from the surface intent fold packet |
| `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | `router-sync: 5/5 checks passed`, exit 0, before and after |
| `node .skilled/bin/compiled-route-sync.cjs --check` | `all 55 served copies match their authored files`, exit 0, before and after |
| `npx vitest run tests/policy-observation-sink.vitest.ts` in the advisor runtime | 5 of 5 pass after the import moved |
| `npm run typecheck` in the advisor runtime | Exit 0 |
| `activation-matrix.test.mjs` in the old spec folder | 4 of 5 pass and 1 fails, before and after. The failure is a missing `ajv` package and this work did not cause it |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The host skip was not run in a real host repository.** Unit tests with temp directories and the planning agent in a throwaway host copy prove it. Run `node .skilled/bin/compiled-route-sync.cjs --check` in the host to confirm.
2. **`compiled-route-guard.cjs` and the pre-commit hook still read the authored folder.** They were out of scope. A host keeps their failure until they get the same skip.
3. **A host on a Node that cannot `require()` an ES module keeps today's failure.** Upgrade the host's Node to remove it.
<!-- /ANCHOR:limitations -->

---


