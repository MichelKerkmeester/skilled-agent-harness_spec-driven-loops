---
title: "Implementation Summary"
description: "Implementation and verification evidence for the legacy Skilled router converter."
trigger_phrases:
  - "convert legacy skilled implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled"
    last_updated_at: "2026-10-30T08:21:36Z"
    last_updated_by: "codex"
    recent_action: "Implemented the review fixes and expanded verification"
    next_safe_action: "No further implementation action"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
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
| **Spec Folder** | 003-convert-legacy-skilled |
| **Status** | Complete |
| **Completed** | 2026-10-30 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The legacy Skilled converter now plans and applies an in-place router move. It preserves the `name` and `description` frontmatter lines, pads versions to four parts when needed, normalizes non-flow `allowed-tools` values, preserves existing flow sequences byte-for-byte, writes a sibling router from the shipped template, and adds the Smart Routing link. Apply mode backs up `SKILL.md`, snapshots only router-parser inputs, creates `ROUTER.md` exclusively, and rolls back if the router semantics differ from the staged snapshot.

### Phase 3: convert-legacy-skilled

`sk-skill-convert.cjs` provides read-only `plan` and `apply` subcommands. `apply` writes only with `--apply`; preflight uses the phase 001 checker and shared surface collision inspector, and the router resolver supplies the exact source section. Refusals retain distinct codes, transform errors exit 1, and unavailable prerequisites exit 2. A skill whose router already lives in `ROUTER.md` still receives V2 frontmatter normalization without a V3 move. The golden test copies the committed pre-move `sk-git` fixture and compares the converted machine section with its committed expected router; a separate history check skips with a reason when its parent commit is absent.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Added | V0 preflight, plan/apply gate, backups, exclusive create, semantic parser proof and rollback |
| `.skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Added | Pure frontmatter normalization and legacy router move |
| `.skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Added | Fixture golden, shallow-history skip, strict-package, idempotence, refusal, no-replace, snapshot cleanup and rollback coverage |
| `.skilled/commands/doctor/scripts/tests/fixtures/sk-skill-convert/` | Added | Pre-move `sk-git` source and routed resources plus expected post-move `ROUTER.md` |
| `.skilled/commands/doctor/scripts/lib/sk-skill-surface.cjs` | Updated | Skips `.state`, so a converter backup is not read as a second skill declaring the same name |
| `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Updated | Recorded review fixes, acceptance evidence and verification |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The golden test first runs `plan` and checks that no fixture bytes change. `apply` then backs up the original `SKILL.md`, snapshots only `SKILL.md` and sibling `ROUTER.md` when present, exclusively creates `ROUTER.md`, and proves routing equivalence. A forced parser mismatch verifies rollback; pre-write content mismatch and router-create failure verify that empty backups are removed. The tests check strict package validation, name/description preservation, exact machine-section bytes, V2-only behavior for an existing router, and a no-op second apply. Test roots use `os.tmpdir()` without changing `TMPDIR`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compare content output and resolved routing separately | The full text-parser result is deep-equal on the pre-edit snapshot and new router text. On actual roots, `routerSource` necessarily changes from `inline` to `ROUTER.md`; all routing-semantic fields remain deep-equal. |
| Keep the golden fixture in the test fixture folder and history comparison separate | CI may have only one commit; committed inputs keep the byte-equality test stable while the optional history check skips cleanly when its parent is unavailable. |
| Skip `.state` in the shared skill-file scan | A converter backup copies `SKILL.md` verbatim, so reading state records would make one skill look like a duplicate of itself in every caller, not only in the converter. The converter still delegates persona and duplicate-name findings to `inspectCollisions`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Exit 0 |
| `node --check .skilled/commands/doctor/scripts/lib/sk-skill-convert-transforms.cjs` | Exit 0 |
| `node --check .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Exit 0 |
| `PYTHON=/usr/bin/python3 node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` | Exit 0; 27/27 passed |
| `PATH="$PATH" PYTHON=/usr/bin/python3 node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` on a checkout without `ca10a236d2^` | The history test skips with its missing-parent reason, and every other case runs from the committed fixture |
| `PYTHON=/usr/bin/python3 node --test .skilled/commands/doctor/scripts/tests/sk-skill-check.test.cjs` | Exit 0; 32/32 passed |
| Check on a converted skill in an `os.tmpdir()` copy, after `apply --apply` | Exit 0; row C12 `PASS`, no duplicate-name finding with a backup on disk |
| `package_skill.py --check --strict` on converted variants holding a router helper fence, a map outside SMART ROUTING, a fenced pointer and an inline-code pointer | Exit 0 with `Result: PASS` and no RS-002 or RS-005 in every case |
| `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | Exit 0; 65 Hermes copies in sync |
| Advisor fixture-discovery inspection | Exit 0; advisor scans direct `.skilled/skills` children for `graph-metadata.json`, and the converter fixture has none |
| Golden `package_skill.py --check --strict` assertion | Exit 0; `Result: PASS`; no RS-002, RS-004 or RS-005 |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/075-doctor-sk-skill-command/003-convert-legacy-skilled --strict` | `RESULT: PASSED`; 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Input scope.** This phase converts older Skilled skills in place. Plain skills and cross-surface integration remain in later phases.
2. **Parser provenance.** Actual-root `routerSource` changes by design; the converter deep-compares the full text-parser output and separately checks actual-root routing semantics.
3. **History proof in shallow checkouts.** The fixture-based golden remains authoritative; the Git history comparison skips with an explicit reason when `ca10a236d2^` is unavailable.
<!-- /ANCHOR:limitations -->

---
