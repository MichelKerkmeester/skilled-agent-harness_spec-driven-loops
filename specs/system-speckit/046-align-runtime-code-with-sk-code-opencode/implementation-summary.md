---
title: "Implementation Summary: system-spec-kit runtime alignment"
description: "The spec-kit runtime and shared package now meet sk-code-opencode: headers, numbered sections, code READMEs, no double-underscore folders, every test under a tests/ tree, and the completion sentinel moved into hooks/lib."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/046-align-runtime-code-with-sk-code-opencode"
    last_updated_at: "2026-09-30T22:06:54Z"
    last_updated_by: "generate-context"
    recent_action: "Merged to main with the checker at 0 findings and the scoped suite at 2985/0"
    next_safe_action: "Verify nothing remains; the packet is closed"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/vitest.config.ts"
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs"
      - ".skilled/skills/system-spec-kit/ARCHITECTURE.md"
    session_dedup:
      fingerprint: "sha256:324bb93f86052472af1703d4cbe334aaf23c8285b20e5b527f0fcd0ed673bc5e"
      session_id: "scaffold-046-align-runtime-code-with-sk-code-opencode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: system-spec-kit runtime alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 046-align-runtime-code-with-sk-code-opencode |
| **Completed** | 2026-10-01, merged to main as `46fc86c8e8` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The whole system-spec-kit skill, `shared/` included, now passes the sk-code-opencode checker with its three strict flags on. Its test code all lives under a `tests/` tree.

### Comment structure and READMEs

The loop kept 253 of 254 header edits and 64 of 64 section edits in the runtime, then 14 headers, 8 section edits and 10 READMEs across `shared/`, the new `tests/hooks/` and three script folders main added. Seven shell scripts moved from `# SPECKIT:` to `# COMPONENT:`.

### Folder changes

`tests/__helpers__/` became `tests/helpers/` and `tests/embedders/__fixtures__/` became `fixtures/`. The Hermes test moved into `cli/tests/`, and the `tests/deep-loop/` and `tests/graph/` tests moved up into `tests/`. Golden snapshots moved to `cli/tests/snapshots/` through `resolveSnapshotPath`. The completion-evidence sentinel moved from `lib/hooks/` to `hooks/lib/` with its 5 adapters, its test, the Pi fallback and the OpenCode plugin repointed. Fifteen `shared/` tests and seven hook and validation tests that sat beside their source moved into `tests/` trees. The unused `lib/test-helpers/` was deleted.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/**`, `shared/**` | Modified | Headers, sections, READMEs, moves |
| `vitest.config.ts` | Modified | `resolveSnapshotPath` to `snapshots/` |
| `shared/package.json`, `shared/tsconfig.json` | Modified | Test glob and exclude point at `tests/` |
| `ARCHITECTURE.md` | Modified | §2 tree rewritten from the real layout |
| `.opencode/plugins/system-completion-sentinel.js` | Modified | Sentinel path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The deep-loop packet's driver ran with a test gate scoped to spec-kit's own `root` and `cli` vitest projects, because `test:runtime` also runs deep-loop's suites and overran its bound. `ALIGN_SCAN` widened the scan to the skill root once `shared/` came into scope. Opus did each move alone, with a before-and-after run of the affected tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bring `shared/` into scope | The request names system-skill code, and the runtime-rooted census never scanned `shared/` |
| Move tests that sat beside their source | The shared style guide says a test never sits beside the file it covers |
| Set `resolveSnapshotPath` at the root of the config | Vitest ignored it per project and wrote 24 new snapshots |
| Relabel `# SPECKIT:` headers to `# COMPONENT:` | The checker accepts only COMPONENT and MODULE; the shell guide's example now uses COMPONENT too |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Checker, three flags, skill root | Findings 0 on main |
| Typecheck | Exit 0 |
| Vitest `root` + `cli` | 2847 passed and 0 failed through every step (baseline 2847/0); 2985 passed and 0 failed after merging main |
| Shared tests | 18/18 before and after the move |
| Moved node:test files | 167 passes before and after, file by file |
| Snapshot move | One broken line fails the golden test; the restored file passes 12/12 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`profile.test.ts` had been passing on its fallback.** Its source-file candidates never resolved; after the move they point at the real file, so its source checks now run, and they pass.
2. **`runtime/stress-test/` stays a separate tree.** It is a dedicated stress suite rather than a test beside its source.
<!-- /ANCHOR:limitations -->
