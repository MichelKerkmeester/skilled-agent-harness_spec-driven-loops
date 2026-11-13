---
title: "Implementation Summary"
description: "A one-line router block now reads as its own contents at seven pattern sites in five scripts, with the served routing closure rebuilt and byte-checked against its authored files."
trigger_phrases:
  - "router empty block capture implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/doc-validation-tooling/005-router-empty-block-capture"
    last_updated_at: "2026-11-13T12:03:24Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified the router block pattern fix, uncommitted"
    next_safe_action: "Review the diff in worktree 365 and commit it"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs"
      - ".skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs"
    session_dedup:
      fingerprint: "sha256:72311a11ef7d91aed4b8d00a542c784da5f89138155f7344eeb9c9fde7049309"
      session_id: "scaffold-005-router-empty-block-capture"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-router-empty-block-capture |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A router block written on one line no longer pulls later literals into the hub's routing phrases. On the scaffold template's `INTENT_SIGNALS = {}` the pattern now captures 0 characters, where it captured 2792 before.

### Stop the router block patterns from capturing past a one-line empty INTENT_SIGNALS or RESOURCE_MAP block

You can declare an empty block on one line and the generator, both checks and both registry compilers read it as empty. Every multi-line block reads exactly as it did. The comparison over all 57 routers shows one file that differs, the test fixture whose blocks are one line long.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modified | `INTENT_SIGNALS` pattern in `declaredPhrases` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modified | `INTENT_SIGNALS` pattern in `declaredPhrases` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs` | Modified | `INTENT_SIGNALS` and `RESOURCE_MAP` patterns in `parseRouter` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs` | Modified | Both patterns in `parseIntentLayer`, in the authored file |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs` | Modified | The one `RESOURCE_MAP` pattern, in the authored file |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs` | Modified | Served copy, rebuilt by `compiled-route-sync.cjs` |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs` | Modified | Served copy, rebuilt by `compiled-route-sync.cjs` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-router-intent-signals-orphans.test.cjs` | Modified | One case: an empty one-line block generates no signals |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs` | Modified | One case: an empty one-line block declares no phrases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-hub-vocabulary-source.test.cjs` | Modified | One case: empty one-line blocks yield no intent |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four Codex workers on `gpt-6-luna` at xhigh ran in parallel in worktree 365, one per disjoint file set. Each of the three script workers wrote its test first and saw it fail against the old pattern. The orchestrating session read every diff, rebuilt the served closure with `compiled-route-sync.cjs`, ran `--verify`, finalized it and ran `--check`. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edit the registry compilers in their authored files and rebuild the served closure | The served copies are byte-checked against the authored files, so an edit to a served copy alone fails `compiled-route-sync.cjs --check`. The operator chose on 2026-11-13 to include them |
| Finalize the rebuild before running the compiled routing tests | A rebuild holds a publication lock until it is finalized, and 16 of 173 tests fail with `publication-locked` while it is held. `--verify` ran before the finalize |
| Keep seven copies of the pattern | A shared helper would change five scripts' imports across two owners. It is raised in `spec.md` for a later packet |
| Leave `004-compiler-n1-shadow/compiler/source-model.cjs` | It carries the old pattern but is not in the served closure, so nothing runs it at routing time |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` before the edit | 108 tests, 108 passed, 0 failed |
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` after | PASS, 110 tests, 110 passed, 0 failed |
| `scratch/compare-captures.cjs` | PASS, `identical=56 differ=1` for both block names. The one file is `sk-doc/scripts/tests/skill-router/ROUTER.md` |
| New pattern on the template's one-line block | PASS, `captured characters: 0` |
| `generate-router-intent-signals.cjs --check` | PASS, exit 0, output identical to the run before the edit: `checked=7 hub(s), missing=0, orphans=0` |
| `compiled-route-sync.cjs --verify` | PASS, `move-simulation OK: all 7 hubs resolve` |
| `compiled-route-sync.cjs --check` after `--finalize` | PASS, `all 55 served copies match their authored files` |
| `node --test .skilled/bin/tests/` before the edit and after the finalize | PASS, 173 tests, 172 passed, 0 failed, 1 skipped, both times |
| Search for the old pattern under `.skilled` | PASS, no file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A one-line block followed by a trailing comment still over-captures.** `INTENT_SIGNALS = {} # none` is read past its line. No router in the repository writes one. Keep a one-line block free of trailing text.
2. **One authored-only compiler keeps the old pattern.** `004-compiler-n1-shadow/compiler/source-model.cjs` in the archived router program is unchanged, because it is outside the served closure.
3. **The repo-wide drift guard fails for reasons outside this packet.** `run-all-drift-guards.sh` exits 1 on the unmodified main checkout as well, on strict-mode findings in research scripts under `specs/`.
<!-- /ANCHOR:limitations -->

---
