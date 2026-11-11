---
title: "Implementation Summary"
description: "Built and measured: the cli lane fell from 397-430 s to 198-219 s. One test file, upgrade-legacy, sets the cli lane's time of about 400 s. Splitting it along its describe blocks lets its pieces run at the same time."
trigger_phrases:
  - "split upgrade legacy implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/runtime-and-release/006-test-cycle-speed/003-split-upgrade-legacy"
    last_updated_at: "2026-11-10T20:34:44Z"
    last_updated_by: "generate-context"
    recent_action: "Split upgrade-legacy into four files; cli lane 397-430 s to 198-219 s over three passing runs"
    next_safe_action: "Commit and push on operator yes, then read the next CI run"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/helpers/upgrade-legacy-harness.ts"
      - ".skilled/skills/system-spec-kit/runtime/scripts/run-cli-tests.sh"
      - ".github/workflows/spec-kit-check.yml"
    session_dedup:
      fingerprint: "sha256:655d750a1f805e9e1e2684c7a81d96da435d749ea2e4f342b18aea63daa752f2"
      session_id: "scaffold-003-split-upgrade-legacy"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      workspace: "/Users/michelkerkmeester/worktrees/public/340-local-test-scope"
      savedAt: "2026-11-10T20:34:44Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 003-split-upgrade-legacy |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`upgrade-legacy.vitest.ts` is now four files, each with its own sandbox, and the cli project runs as one process.

```text
upgrade-legacy-core-a        21 tests   first half of the 'upgrade-legacy' describe
upgrade-legacy-core-b        21 tests   second half
upgrade-legacy-containment   17 tests   link containment (13 + one it.each row) and release apply lock (4)
upgrade-legacy-layout         7 tests   planLayoutMove (6) and layout links (1)
```

The plan said 65 tests. Vitest counts 67, because the 66 `it` declarations include one `it.each` with two rows.

### Measured result

```text
before   cli lane 397-430 s (three runs, set by the upgrade-legacy process)
after    npm run test:cli   198 s, 208 s, 219 s   all exit 0
         206 files passed, 2519 tests passed, 20 skipped
```

The median fell from about 411 s to 208 s, about 49%.

The first full `npm test` after the split failed once. `upgrade-legacy-layout` crashed in its sandbox setup with `ENOENT` on `runtime/.workflow-lock`, the save workflow's lock folder, which other cli files create and remove. Four files now copy the skill side by side, so one copy caught the lock mid-delete. The harness now leaves that folder out of the copy. After the fix:

```text
npm run test:cli   231 s, 226 s, 208 s   all exit 0, 2519 tests passed
npm test           786 s, exit 0         core 418 s, cli 245 s, validation 122 s
                   before the split: 841-911 s
```

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `S/cli/tests/upgrade-legacy.vitest.ts` | Deleted | Replaced by four files |
| `S/cli/tests/upgrade-legacy-{core-a,core-b,containment,layout}.vitest.ts` | Created | The moved tests |
| `S/cli/tests/helpers/upgrade-legacy-harness.ts` | Created | Sandbox setup, reset and helpers, with setters for the one case that relocates the sandbox |
| `S/scripts/run-cli-tests.sh` | Modified | One command for the cli project |
| `.github/workflows/spec-kit-check.yml` | Modified | The same in the CI step |
| Two `feature-catalog/tooling-and-scripts/upgrade-legacy-*.md` rows | Modified | Point at the files that now hold the tests |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash, run through cli-devin, moved the tests. Its first version reached the relocating case through a `vi.mock` Proxy, which only works because of how Vitest rewrites imports. That was replaced with two setter calls. A line-count check against the deleted file showed every test line present in the new files, apart from the helper declarations that gained `export` and those two lines.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Split along describe blocks | Each block keeps its own reset rule, so no order-dependent test is separated |
| Revert unless 10% faster | Two sandboxes copying at once could cost more than they save |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Same tests (REQ-001) | `vitest list --project cli`: 2519 before and after, and the 67 `upgrade-legacy` test names are identical |
| No assertion changes (REQ-002) | Every assertion line survives. One test body changed two lines: `sandbox = movedRoot` and `copy = ...` became `setSandbox(...)` and `setCopy(...)` |
| Stable (REQ-003) | `npm run test:cli` passed three runs in a row before and three after the lock fix; full `npm test` passed once after it |
| Faster (REQ-004) | Median 208 s against 397 to 430 s |
| `validate.sh` on this folder with `--strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CI not yet measured.** The CI step changed too. Its first run after a push will show the effect there.
2. **One test body has two edited lines.** An imported binding cannot be reassigned, so the relocating case calls the harness setters.
<!-- /ANCHOR:limitations -->

---


