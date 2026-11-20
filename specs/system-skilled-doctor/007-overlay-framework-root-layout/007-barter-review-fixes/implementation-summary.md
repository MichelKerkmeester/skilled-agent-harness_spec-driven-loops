---
title: "Implementation Summary"
description: "Barter's commit gate now refuses a commit that stages a vendored path when no overlay manifest is found, every Barter hook finds the overlay folder through the engine's own setting, and one plugin test loads the real bridge. All six Barter findings of the extended deep review are fixed in ai-speckit commit 5dd004f3faa."
trigger_phrases:
  - "barter review fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes"
    last_updated_at: "2026-11-20T16:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the ai-speckit fix commit for the six Barter review findings"
    next_safe_action: "Phase 008 pushes Skilled main; a later ai-speckit session re-pins onto it"
    blockers: []
    key_files:
      - "../review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-007-barter-review-fixes"
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
| **Spec Folder** | 007-barter-review-fixes |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Barter commit can no longer slip past the overlay checks because the manifest moved. With no manifest found, the commit gate refuses any commit that stages a vendored path and names the manifest path it looked for, and every other commit gets one visible skip line.

### Phase 7: barter-review-fixes

The three Barter hooks now find the overlay folder the way the engine does, from `overlayDir` in `skilled/.skilled-overlays.json`, so moving the folder again needs one setting change, not three hook edits. One plugin test loads the real vendored bridge, so the next upstream export rename fails a test instead of silently disabling both plugins. The relayout backup folder is ignored, the last fixture named after the old folder is renamed, and the overlay-first rule quotes the path the guard actually prints.

The work ran in an ai-speckit session, in commit `5dd004f3faa` on `skilled/v4.1.0.0`. This folder is the Skilled-side plan of record; its numbers are quoted from that commit and from ai-speckit's `specs/skilled-barter-overlays/002-spec-tracks-restructure/039-overlays-framework-root-layout/implementation-summary.md`.

| Finding | Fix |
|---------|-----|
| `R2-P1-001` | The commit gate refuses with exit 1 when a vendored path is staged and no manifest is found, and prints `overlay checks skipped: no overlay manifest at <path>` otherwise |
| `R2-P2-001--e1e7b8a500f3` | New `pre-commit.test.cjs` covers the lookup, the skip and the refusal |
| `R14-P2-001` | The edit guard core, the commit gate and the git-write gate read `overlayDir`, with `../overlays` as the fallback |
| `R12-P2-001` | One plugin case imports the applied plugin beside the real `v2-bridge.js` |
| `R3-P2-001` | `.gitignore` and `overlays/README.md` name `overlays/relayout-runs/` |
| `R3-P2-002` | The fixture folder in `compiled-routing-byte-parity.test.cjs` is named `overlays` |
| Guard-path doc drift | `barter-overlay-first.md` quotes `../overlays/...` |

### Files Changed

From `git -C <ai-speckit> show --stat 5dd004f3faa`: 26 files, 705 insertions, 101 deletions. Each overlay source changed together with its applied copy under `skilled/`.

| File | Action | Purpose |
|------|--------|---------|
| `overlays/root/opencode/scripts/git-hooks/pre-commit` | Modified | Fail closed, visible skip, NUL-separated names, `overlayDir` from the setting |
| `overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs` | Created | Lookup, skip and refusal tests |
| `overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` and its test | Modified | Read `overlayDir`; a `"../ovl"` case |
| `overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs` and its test | Modified | Read `overlayDir`; a `"../ovl"` case |
| `overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` | Modified | One case against the real bridge |
| `overlays/framework/repo-rules/barter-overlay-first.md` | Modified | Quote `../overlays/...` |
| `overlays/tests/compiled-routing-byte-parity.test.cjs` | Modified | Fixture folder renamed |
| `.gitignore`, `overlays/README.md` | Modified | `overlays/relayout-runs/` |
| `overlays/overlay-manifest.json`, `overlays/sync-state.json` | Modified | Adopt the new test, refresh the sync hashes |
| `skilled/**` copies of the above | Modified | Re-applied from the sources |
| ai-speckit's 039 record docs | Modified | The remediation record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The ai-speckit session changed each overlay source, applied it onto the vendored tree, ran the new tests, then ran Barter's full gate set and committed once. The commit is local in ai-speckit and on no remote branch. Phase 008 pushed only Skilled, so this commit reaches origin when the operator pushes ai-speckit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| With no manifest, fail closed only when a vendored path is staged | A commit outside the vendored tree has nothing for the engine to guard, so a visible skip is enough there |
| Keep the setting-reading rule in each of the three hooks | They run in bash, CommonJS and ESM with no shared module, and the engine stays the one that validates the value |
| Load the real bridge by importing the applied plugin | The bridge imports `zod`, which resolves only beside the vendored tree, so a copied bridge would not load |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Quoted from ai-speckit's 039 record after `5dd004f3faa`; not re-run in this Skilled session.

| Check | Result |
|-------|--------|
| `overlay-engine.cjs status --audit` | PASS: `RESULT: PASSED`, `in-sync=488`, `checked=136 ok=136 miss=0`, `offLayout=[]` |
| `overlay-engine.cjs pre-commit` | PASS: `allow`, exit 0 |
| Both `overlays/checks` | PASS: `RESULT: PASSED` |
| Overlay test files | 135 tests, 124 pass; the 11 failures are the baseline set |
| `bash tests/run-all.sh` | PASS: exit 0, 8 `PASS` |
| Live commit gate | A throwaway index staging an unowned vendored file makes `pre-commit` exit 1 |
| Git-write gate | Allows a commit; refuses a force-push to `main`, another track, `git config` and another repository |
| `@review` in the ai-speckit session | APPROVED; a second pass approved the fixes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fix commit is local.** `5dd004f3faa` is on no remote branch of ai-speckit. Phase 008's re-pin session pushes it with the re-pin, once the operator approves that push.
2. **The vendored tree still runs the old Skilled pin.** The hooks are fixed in ai-speckit, but the engine fixes from phase 006 reach Barter only after phase 008's re-pin.
<!-- /ANCHOR:limitations -->

---
