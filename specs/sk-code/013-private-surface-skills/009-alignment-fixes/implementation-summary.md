---
title: "Implementation Summary: Alignment fixes for private-skill guards"
description: "Both sk-code surface readers now apply the advisor trusted-root rule, the reader inventory passes, the mirror orphan skip is tested, private-skill-root requests route to the advisor and canary-router.cjs is plain text."
trigger_phrases:
  - "alignment fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/013-private-surface-skills/009-alignment-fixes"
    last_updated_at: "2026-10-27T19:51:43Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed all five alignment findings with fail-before tests"
    next_safe_action: "Conductor reviews and commits the lane diff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-l1-private-guard-fixes"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-alignment-fixes |
| **Status** | Complete |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A private `local-*` link in the skills root now reaches sk-code surface detection only when its real target sits inside a trusted root, in the replay library and in the advisor plugin alike. Before, either reader would read any linked folder, so a link into an undeclared directory could add a surface that outranks SKILLED and hand the quality gate its checklist rows.

### Alignment fixes for private-skill guards

The rule now lives in a plain CommonJS module, `runtime/lib/private-skill-target.cjs`, which the advisor's TypeScript module wraps with types and both readers require, so there is one definition of a trusted link and it loads on Node 20 as well as 22 and 26. When the module cannot load, the readers reject every `local-*` link and write one stderr line, which hides a private surface instead of trusting an unverified one and keeps the loss visible. Beside that, the reader inventory test passes again, the mirror orphan skip has a test that catches its removal, a request about private skill roots routes to the advisor, and `canary-router.cjs` diffs and gates as text.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modified | Outside-surface reader applies the trusted-root rule |
| `.opencode/plugins/system-skill-advisor.js` | Modified | Plugin surface reader applies the same rule |
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.cjs` | Created | The trusted-root rule as plain CommonJS |
| `.skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts`, `runtime/tests/private-skill-target.vitest.ts` | Modified | Typed wrapper over the `.cjs`; the resolution-count test spies on the shared `fs` object |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs` | Modified | Untrusted-link case for both readers |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modified | Linked fixtures declare their root; untrusted case added |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-reader-inventory.test.cjs` | Modified | Include entry, narrowed SCREENED reason |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | Modified | Exports `findOrphans`, entry point guarded |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs` | Created | Orphan and private-entry tests |
| `.skilled/skills/system-skill-advisor/graph-metadata.json`, `runtime/scripts/skill-graph.json` | Modified | Private-skill-root vocabulary, regenerated graph |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` and its authored source | Modified | `'\0'` escape replaces the NUL byte |
| Four skill changelogs and `SKILL.md` versions | Created / Modified | Release notes and version carriers |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its authored copy | Modified | Re-minted, because the `sk-create-skill` version bump changes the sk-doc policy hash |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix ran its test against the HEAD source first and kept the failing output, then against the fix. The inventory test failed at HEAD and passes now. The parity test and the plugin vitest each fail on the HEAD plugin. The orphan test fails with the skip deleted. The advisor regression and validate runs were taken with the HEAD metadata and again with the new metadata, and match. The canary route gold was compared byte for byte.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Move the rule into `private-skill-target.cjs` and make the `.ts` wrap it | A first version required the `.ts` directly, which throws on Node 20.19 and needs a flag before Node 22.18, so a trusted private skill silently lost its surface; a CommonJS module loads everywhere, and `tsc` with `allowJs` emits it into `dist` beside the wrapper |
| Fail closed when the helper cannot load | An unverified target must never become a surface |
| Skip non-`local-*` links too | The advisor's include readers accept only real directories and trusted `local-*` links, and the skills root holds no other link |
| Edit the authored `canary-router.cjs` beside the served copy | The served copy must match its authored file or `compiled-route-manifest.test.cjs` fails |
| Leave the trigger index to its rebuild workflow | It is CI-owned and these spec docs change it again anyway |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Inventory test | PASS, exit 0 (exit 1 at HEAD) |
| Touched node suites | PASS, 718 of 718 |
| Plugin vitest with containment and routing tests | PASS, 109 of 109 on Node 26; plugin 95 of 95 and containment 11 of 11 on Node 20.19.5 |
| Parity test on Node 20.19.5 | PASS 3 of 3; the first version gave `not ok 3` |
| Advisor runtime vitest, full suite | PASS, 1,254 passed, 8 skipped, after rebuilding `dist` |
| Compiled-route tests and sync check | PASS, 95 of 95; 55 of 55 copies match |
| Advisor probe | `system-skill-advisor` top-1 at 0.8666 |
| Advisor regression and validate | Unchanged: 42/42; 0.8103 and holdout 0.75 |
| `validate.sh --recursive --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The private-skill-root probe still reports ambiguous.** `sk-git` stays second at 0.8223 because the prompt names git-ignored and committed; the requirement was top-1 only.
2. **Some advisor tests cannot run on Node 20 in this checkout.** `skill-graph-db`, `daemon-freshness-foundation` and `advisor-status` load `better-sqlite3`, whose native build here targets Node 26, and two node tests use Node 22 APIs. None of them exercises the changed readers.
3. **The committed trigger index is not rebuilt here.** The trigger-index-rebuild workflow regenerates it after merge.
<!-- /ANCHOR:limitations -->

---
