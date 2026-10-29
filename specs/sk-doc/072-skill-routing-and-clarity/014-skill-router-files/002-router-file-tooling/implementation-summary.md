---
title: "Implementation Summary"
description: "Planned, not built. This phase gives six readers one answer to where a skill's machine router lives, then teaches the Hermes generator and the skill advisor to see the router file, so the router move in the parent phase can start."
trigger_phrases:
  - "router file tooling implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling"
    last_updated_at: "2026-10-29T08:40:00Z"
    last_updated_by: "pi"
    recent_action: "Planned the phase and authored its five documents, and no code has changed"
    next_safe_action: "Start at T001 and capture the four baselines before the first edit"
    blockers:
      - "Phase 003's template has to carry the machine-router heading, or a router moved in phase 005 resolves to nothing"
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py"
      - ".skilled/skills/system-skill-advisor/runtime/lib/freshness.ts"
      - ".opencode/plugins/system-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Does any live skill declare its router in two documents today? No, 7 resolve through hub-router.json and 6 resolve inline"
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
| **Spec Folder** | 002-router-file-tooling |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and no file has changed, so the numbers below are baselines captured from the current tree, not results.

### Phase 2: router-file-tooling

The phase builds one resolver that answers a single question for every reader: which document holds this skill's machine router. It looks for a sibling `ROUTER.md` first, reads that file's machine-router section, and falls back to the `SKILL.md` section while the migration is still in progress. When a skill declares assignments in both documents the resolver returns a dual-declaration verdict and no text, so no reader guesses.

Three readers move onto it: router replay in `router-replay-lib.cjs`, router sync in `verify-router-sync.cjs` and the dead-route scan in `verify_alignment_drift.py`. Two more producers learn about the file: the Hermes generator copies `ROUTER.md` into each generated skill folder, and the skill advisor grows a third per-skill probe in `runtime/lib/freshness.ts`, the same probe in `.opencode/plugins/system-skill-advisor.js` and a `router-md` watch target, with one parity test that fails if either signature loses the probe.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs` | Create (planned) | One place decides where a router lives and rejects a dual declaration |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` | Create (planned) | A case per verdict, plus a file with no heading |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify (planned) | `parseRouter` resolves its document through the resolver |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify (planned) | `readSkillRouter` stops building a `SKILL.md` path |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modify (planned) | A router-in-`ROUTER.md` case and a dual-declaration case |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` | Modify (planned) | Declarations read from `ROUTER.md` when it holds the section |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` | Modify (planned) | The same two shapes at the scan level |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modify (planned) | Each generated copy carries `ROUTER.md` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modify (planned) | A source skill with a router file lands it in the copy |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts` | Modify (planned) | A `ROUTER.md` probe beside the `SKILL.md` probe |
| `.opencode/plugins/system-skill-advisor.js` | Modify (planned) | The same probe in `advisorSourceSignature` |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modify (planned) | A `router-md` watch target |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modify (planned) | A discovered `ROUTER.md` becomes a target |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/router-signature-parity.vitest.ts` | Create (planned) | Both signatures change on a router-only edit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not started. The planned order is the four baselines in `tasks.md` phase 1, then the resolver, then the three readers, then the Hermes copy, then the three advisor changes and the parity suite, then both guards over the live tree. Each step has its own verify line, and the phase closes on the strict spec gate printing `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the router from the machine-router section, not from the whole file | A hub's `ROUTER.md` already holds a stage-two map under a `MACHINE-READABLE ROUTER` heading. Reading the whole file would hand that map to `parseRouter` for the 7 hubs and change their route, while the section grammar leaves all 7 on `hub-router.json` |
| Return a verdict instead of throwing on a dual declaration | Replay, sync and the scan each report a problem in their own way. A verdict lets each one surface the rejection in the shape its caller already reads, and a throw would remove the diagnosis |
| Keep `parseRouter`'s signature and let the caller pass the `SKILL.md` text | Its two call sites and their fixtures keep working, and the resolver gains one caller instead of a migration |
| Repeat the precedence rule in `verify_alignment_drift.py` and pin it with a parity test | A Python check cannot require a CommonJS module. Duplicating 15 lines and testing both is smaller than a subprocess inside a pure-Python checker that its unit suite builds from temp trees |
| Keep the packet at Level 1 while it is planned | The acceptance rows are `Unmet` by design. Level 2 turns on the closure gate, and that gate blocks a packet whose rows are `Unmet`, so the level rises when a build can meet them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Baseline recorded at planning: `5/5 checks passed`. Not run against a change, because nothing has changed |
| `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router` | Baseline recorded at planning: `PASS`, 5419 files scanned, 0 findings |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Baseline recorded at planning: 9 passing cases |
| `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` | Baseline recorded at planning: 30 tests, `OK` |
| `vitest run tests/legacy/advisor-freshness.vitest.ts` | Baseline recorded at planning: 12 passing cases |
| `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Baseline recorded at planning: 6 passing cases |
| `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` | Baseline recorded at planning: 42 passing cases |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `ROUTER.md` branch resolves no live skill yet.** The 7 files that exist are hub routers and hold their map under a different heading, so until phase 004 writes a machine-router section and phase 005 gives a flat skill its own file, the new branch is proven by fixtures only. The source probe prints `{"hub-router.json":7,"inline":6}` before and after this phase, and that is the expected result, not a failure.
2. **The heading grammar is a cross-phase contract.** A `ROUTER.md` written without a `## MACHINE ROUTER` heading resolves to nothing. Phase 003's template has to write the heading and phase 004's merge has to keep it, or the readers this phase fixes find no router in the files phases 004 and 005 create.
<!-- /ANCHOR:limitations -->

---
