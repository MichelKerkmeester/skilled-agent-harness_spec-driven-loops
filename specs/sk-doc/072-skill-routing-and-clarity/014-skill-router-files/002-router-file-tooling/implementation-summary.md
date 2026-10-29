---
title: "Implementation Summary"
description: "Built, not planned. One resolver now decides where a skill's machine router lives, three readers ask it, the Hermes generator carries ROUTER.md beside SKILL.md, and both advisor freshness signatures carry a third probe. The 47 flat skills have not moved yet, which is later phases."
trigger_phrases:
  - "router file tooling implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/002-router-file-tooling"
    last_updated_at: "2026-10-29T10:56:00Z"
    last_updated_by: "pi"
    recent_action: "Built the router file resolver and moved its readers onto it"
    next_safe_action: "Build 003-check-and-template-canon"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs"
      - ".skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py"
      - ".skilled/skills/system-skill-advisor/runtime/lib/freshness.ts"
      - ".opencode/plugins/system-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does any live skill declare its router in two documents today? No, 7 resolve through hub-router.json and 6 resolve inline"
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
| **Spec Folder** | 002-router-file-tooling |
| **Completed** | 2026-10-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One new module answers a single question for every reader: which document holds this skill's machine router. `router-file-resolver.cjs` probes a sibling `ROUTER.md` first, reads only that file's machine-router section, falls back to the `SKILL.md` section while the migration is still running, and returns `dual-declaration` with no text when a skill declares in both documents. It parses nothing itself, so the section is handed back whole to whichever extractor asked for it.

Three readers moved onto it. `parseRouter` in `router-replay-lib.cjs` asks the resolver which text to parse and keeps its return shape, so its two call sites and their fixtures did not move. `readSkillRouter` in `verify-router-sync.cjs` now calls `lib.parseRouter(null, dir)` and builds no `SKILL.md` path of its own. `check_router_paths` in `verify_alignment_drift.py` reads declarations from whichever document declares them and reports `ROUTER-DUAL-DECLARATION` instead of picking a side.

Two producers learned about the file. The Hermes generator copies `ROUTER.md` into each generated folder whose source skill has one, prunes a copy whose source lost it, and reports drift on it. The skill advisor grew a third per-skill probe in `runtime/lib/freshness.ts` and the same probe in `.opencode/plugins/system-skill-advisor.js`, wrote the file into a `router-md` watch target, and gained one parity suite that fails when either signature loses the probe.

The heading grammar is what keeps the seven hubs where they were. A hub's `ROUTER.md` holds its stage-two map under a `MACHINE-READABLE ROUTER` heading that never matches `## MACHINE ROUTER`, so all 7 keep resolving through `hub-router.json` and the source probe prints `{"hub-router.json":7,"inline":6}` before and after this phase.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-file-resolver.cjs` | Created | One place decides where a router lives and rejects a dual declaration |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` | Created | A case per verdict, plus a hub-shaped file that declares nothing |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modified | `parseRouter` resolves its document through the resolver |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modified | `readSkillRouter` stops building a `SKILL.md` path |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | Modified | A router-in-`ROUTER.md` case and a dual-declaration case |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs` | Modified | The fixture hub carries the new module the guard requires |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py` | Modified | Declarations read from `ROUTER.md` when it holds the section, and a dual declaration is reported |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` | Modified | The same two document shapes at the scan level |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/README.md` | Modified | The folder index lists the new module |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modified | Each generated copy carries `ROUTER.md`, and drift covers it |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modified | A source router file lands in the copy, and an edited or missing copy reports drift |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts` | Modified | A `ROUTER.md` probe beside the `SKILL.md` probe |
| `.opencode/plugins/system-skill-advisor.js` | Modified | The same probe in `advisorSourceSignature`, reached as a hidden property of the plugin object |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modified | A `router-md` watch target |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modified | A discovered `ROUTER.md` becomes a target |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/router-signature-parity.vitest.ts` | Created | Both signatures change on a router-only edit and restore when the file goes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In the order `tasks.md` sets: the four baselines, then the resolver and its unit set, then the three readers, then the Hermes copy, then the four advisor changes and the parity suite, then both guards over the live tree. Every step reran its own command, and the phase closed on the strict spec gate.

The advisor signature reaches its parity test through the plugin's default export. The host reads that export and a loader guard holds the module to that one key, so `advisorSourceSignature` hangs off the plugin object as a non-enumerable property instead of a second named export.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `router-replay-lib.cjs` requires the resolver at the top of the file | The work first loaded it lazily with a fallback, and a missing resolver would silently parse `SKILL.md` for a skill whose router lives only in `ROUTER.md`. A top-level require makes that fault loud, and the guard's timeout test now copies `router-file-resolver.cjs` into its fixture hub so the guard can load |
| The dual-declaration verdict returns no paths, with `source` null and `text` null | A caller derives both paths from the `skillRoot` it passed, so naming one document in the verdict would invite a reader to use it. Returning nothing keeps the refusal complete |
| `verify_alignment_drift.py` repeats the precedence rule in Python | A Python check cannot import the CommonJS resolver. The rule is small enough to repeat, and the suite pins each document shape so the two copies cannot part quietly |
| A `DEFAULT_RESOURCE` assignment counts as a declaration, and a skill that declares in `SKILL.md` or nowhere is scanned over its whole `SKILL.md` | The review found that the first version stopped checking 8 sk-doc modes whose router names only `DEFAULT_RESOURCE`, while still printing `Findings: 0`. The scan now extracts the same 713 router leaves as before the change |
| A heading inside a fenced block, or one that only follows a Unicode line separator, opens no section, in both readers | A skill can show the router grammar as a fenced example. Splitting on newline alone in both languages keeps the JS and Python verdicts identical on all 54 live skills and on 14 edge-case inputs |
| `ci-hub-vocabulary-source.cjs` joins the screened list in `skill-root-reader-inventory.test.cjs` | That test already failed on main: the reader skips private skills by a prefix it builds from parts, so the test's name rule never matched. It reads through `Dirent.isDirectory()` and keeps only hubs, which is safe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | `router-sync: 5/5 checks passed` |
| `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router` | `[alignment-drift] PASS`, `Scanned files: 5420`, `Findings: 0` |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-file-resolver.test.cjs` | `pass 7 fail 0` |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs` | `pass 11 fail 0`, up from 9 |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs` | `pass 1 fail 0` |
| `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/test_verify_alignment_drift.py` | `Ran 36 tests`, `OK`, up from 30 |
| `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | `pass 7 fail 0`, up from 6 |
| `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` | `pass 42 fail 0` |
| `vitest` over the freshness, watcher and parity suites | `3 files, 20 tests passed` |
| `npm run typecheck` and `npm run build` in the advisor runtime | both exit 0 |
| Live Hermes sync and `--check` | wrote 7 of 65 copies, and `--check` printed `PASS: 65 Hermes skill copies in sync` |
| The `node -e` source probe from `spec.md` section 2 | `{"hub-router.json":7,"inline":6}`, the same string as the baseline |
| `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-replay-lib-resolver.test.cjs` | `pass 2 fail 0`: `parseRouter` reports `ROUTER.md` and `dual-declaration` |
| JS and Python verdicts over every live skill | 54 skills, 0 mismatches: `skill-md` 44, `none` 10 |
| Router leaves the dead-route scan extracts, before and after | 713 and 713, the same sorted list |
| `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | `pass 1 fail 0`, from `fail 1` on main |
| Fresh Opus medium review | Round 1: one P1 and one P2, both fixed. Round 2: no P0 or P1, one P2 on control characters, fixed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 47 flat skills have not moved.** 54 `SKILL.md` files carry a machine-router section and 7 skills carry `ROUTER.md`, so 47 skills still declare inline. Phases 004 and 005 move them, and until then the `ROUTER.md` branch is proven by fixtures only. The source probe printing `{"hub-router.json":7,"inline":6}` after the change is the expected result, not a regression.
2. **The heading grammar is a cross-phase contract.** A `ROUTER.md` written without a `## MACHINE ROUTER` heading resolves to nothing. Phase 003's template has to write the heading and phase 004's merge has to keep it, or the readers this phase fixed find no router in the files those phases create.
3. **The precedence rule is written twice.** `verify_alignment_drift.py` cannot import the CommonJS resolver, so it repeats the rule. The two copies are pinned by the scan suite rather than by a shared implementation.
<!-- /ANCHOR:limitations -->

---
