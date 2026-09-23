---
title: "Implementation Summary"
description: "New spec packets land in specs/ again. Since 2026-09-20 create.sh had been writing them to a stray .opencode/specs tree that nothing reads, with track numbers restarting at 001."
trigger_phrases:
  - "create.sh canonical specs root"
  - "create.sh writes to .opencode/specs"
  - "spec packet lands in .opencode/specs"
  - "track numbering restarts at 001"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-create-canonical-specs-root"
    last_updated_at: "2026-09-23T18:46:18Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Pointed create.sh at specs/ with the writer test proved red then green"
    next_safe_action: "Decide whether to revive or retire the two dead phase tests"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/create.sh"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-writer-autosave.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-034-create-canonical-specs-root"
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
| **Spec Folder** | 034-create-canonical-specs-root |
| **Completed** | 2026-09-23 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

New spec packets land in `specs/` again. For three days `create.sh` had put them in `.opencode/specs/`, a tree nothing reads since its link to `specs/` was removed, and a track packet there numbered from 001 because the stray tree was empty. The script exited 0 throughout, so the only sign was a packet missing from where every tool looks.

### Make create.sh write new packets under the canonical specs root

The write root is now `specs/`, which is what the canonical resolver, the repository rules and the 121,966 tracked packet files already use. Explicit targets under the legacy root still pass the path guard, so an old packet can still be extended. The writer test that used to assert the legacy root now fails if the script ever targets it again, and a new case checks that a track packet takes the next number from the real track folder.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Write root, comments and help |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/spec-root-writer-autosave.vitest.ts` | Modified | Canonical-root and track tests, corrected legacy-read wording |
| `.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts` | Modified | Line range and description for the root selection |
| `.skilled/skills/system-spec-kit/runtime/cli/references/spec-root-alias-retirement-runbook.md` | Modified | Superseded notice |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The test came first. Rewritten for the canonical root, it failed against the unchanged script in both cases, and the track case showed the defect exactly: `.opencode/specs/demo/001-next-packet` where `specs/demo/008-next-packet` was expected. The one-line root change turned both green, and the related suites ran as a regression pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the guard accepting `.opencode/specs` | An explicit legacy target is a read of old data, which the resolver also allows |
| Mark the runbook superseded instead of rewriting it | It plans the reverse migration, and nothing plans a further one |
| Leave the two phase tests alone | They cannot load in an ES-module package and nothing runs them, so editing their root would change nothing verifiable |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Writer tests against the previous script | FAIL in both new cases, as intended |
| Writer tests against the fixed script | PASS, 3 of 3 |
| Spec-root, scaffold, registry-rule and backfill suites, 17 files | PASS, 99 tests, 1 existing deliberate skip |
| `bash -n create.sh` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two phase tests are dead.** `test-phase-validation.js` and `test-phase-system.js` fail to load because they use `require` in an ES-module package, so they check nothing today.
2. **The empty `.opencode/specs` folder may reappear.** Anything that still writes there by explicit path recreates it, and it is safe to delete while empty.
<!-- /ANCHOR:limitations -->

---
