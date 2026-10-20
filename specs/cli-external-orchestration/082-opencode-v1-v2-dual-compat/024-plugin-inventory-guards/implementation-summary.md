---
title: "Implementation Summary"
description: "The v2 plugin tests now read their plugin list from the folder, so a new plugin without the dual export, an unmapped hook or an event name that never reaches OpenCode 2 fails a test instead of shipping untested. A private 2.0.32 host showed which event names arrive, and the docs drop their fixed counts."
trigger_phrases:
  - "plugin inventory guards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/024-plugin-inventory-guards"
    last_updated_at: "2026-10-20T09:00:54Z"
    last_updated_by: "generate-context"
    recent_action: "Closed rows 6, 7, 8 and 30 with mutation proof and eight review rounds"
    next_safe_action: "Verify CI on main after the push"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/helpers/plugin-inventory.cjs"
      - ".opencode/plugins/tests/plugin-inventory.json"
      - ".opencode/plugins/tests/plugin-inventory.test.cjs"
      - "scratch/mutation/README.txt"
    session_dedup:
      fingerprint: "sha256:2d8738e2e9b7da55feeaac4acd7fa99bbcd466286c44cbf5496fd40d1852426f"
      session_id: "scaffold-024-plugin-inventory-guards"
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
| **Spec Folder** | 024-plugin-inventory-guards |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new plugin file can no longer reach OpenCode 2 untested. The v2 suites used to check 12 and 5 plugins named by hand, so coverage depended on someone remembering to add a row. They now take their list from `.opencode/plugins` itself, with sk-vision as the one named exception.

### Phase 24: plugin-inventory-guards

`tests/helpers/plugin-inventory.cjs` reads the folder: a file is bridged when it contains `dualPlugin('<stem>'`, and `tests/plugin-inventory.json` names the exceptions. `tests/plugin-inventory.test.cjs` fails when a file is neither bridged nor listed, when a listed file is missing, when a bridged plugin returns a hook the bridge cannot map (row 7, `cleanup.skippedKeys`), and when a plugin handles an event name that the bridge neither maps nor aliases and the manifest does not list (row 8). The event scan blanks comments, reads quoted and static template literals, case labels and literal Sets and arrays, and fails closed: any other check on an event type must be listed with the events it covers.

A probe plugin on a private OpenCode 2.0.32 host received `session.created` and `session.deleted` under those names, then `location.shutdown` instead of `server.instance.disposed` or `global.disposed`. The manifest files every unrouted name under that observation, and the plugins docs say the disposal branches run only on OpenCode 1. The README and ARCHITECTURE counts are dated or gone, and the two-version proof dates its 16-plugin battery rows (row 30).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/tests/helpers/plugin-inventory.cjs` | Created | Inventory reader and event scan |
| `.opencode/plugins/tests/plugin-inventory.json` | Created | Native-dual exceptions, allowed skips, unscanned checks and event lists |
| `.opencode/plugins/tests/plugin-inventory.test.cjs` | Created | The inventory, skipped-hook and event-name guards |
| `.opencode/plugins/tests/v2-registration.test.cjs` | Modified | Covers every bridged plugin from the inventory |
| `.opencode/plugins/tests/v2-hard-plugins.test.cjs` | Modified | Checks its cases against the inventory |
| `.opencode/plugins/lib/v2-bridge.js` | Modified | Exports its hook and event tables |
| `.opencode/plugins/README.md`, `ARCHITECTURE.md`, `tests/README.md` | Modified | Inventory wording, dated counts, the v2 disposal finding |
| `../011-two-version-proof-and-closeout/proof.md` | Modified | Dates the battery rows |
| This folder and `../spec.md` | Modified | Records and the phase map rows |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash wrote every code and doc change from short briefs, and Luna reviewed read-only through cli-codex after each one. The baseline came first (`scratch/baseline/`). Every new or changed test was proven by a mutation in a temporary copy of the worktree, never in the repository (`scratch/mutation/README.txt`). The v2 battery runs from a clone outside the main checkout, because a nested worktree makes OpenCode 2 also load the main checkout's plugins.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the hard-plugin behavior cases hand-written and check them against the inventory | Their expected registrations are behavior, not coverage; coverage now comes from the folder |
| Make the event scan fail closed | Six review rounds each found one more syntax form; reporting anything unresolved stops an unknown form from passing silently |
| File unrouted event names as observed, not delivered or unverified | Only the private host run is evidence; names that need a model turn could not be observed |
| Run the v2 battery from a clone outside the main checkout | Inside the nested worktree every plugin fails with a duplicate ID, an environment effect CI does not have |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite, baseline at origin/main `8c9a14bd59` | 397 passed, 0 failed (`scratch/baseline/plugins.txt`) |
| Plugin suite after the change | 417 passed, 0 failed, exit 0 (`scratch/after/plugins.txt`): 13 inventory tests, 2 hard-plugin inventory tests, 1 non-empty check and 4 more registration cases (16 plugins instead of 12) |
| Battery v1 in the worktree | exit 0, all 17 discovered and loaded (`scratch/after/battery-v1.txt`) |
| Battery v2 from a clone outside the main checkout | exit 0, all 17 active, 57 skills (`scratch/after/battery-v2-clone.txt`); baseline from a clone of `8c9a14bd59` also exit 0 (`scratch/baseline/battery-v2-clone-origin-main.txt`). PID 46220 kept its start time |
| Mutation probes | m1 to m22 each exit 1 with the intended message, and m2 shows the old pinned suite passing on the same broken copy (`scratch/mutation/README.txt`) |
| v2 event observation | `session.created` and `session.deleted` delivered; `location.shutdown` instead of the two disposal events (`scratch/v2-events/`) |
| Luna review, rounds 1 to 7 | FAIL each round, every P1 fixed: event-scan forms, a doc count, constant checks, call fingerprints, operands, comments and literals, inline collections, bracket access |
| Luna review, round 8 (last) | FAIL on two P1s that are further spellings the static scan cannot see (escaped literals, check-like text in strings); recorded as a known limit under the coordinator's stop rule, with the two-version battery as the authoritative guard. The export wording P2 was fixed; the other P2s are follow-ups below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The event guard is a static scan.** Escaped literals such as `'session\u002eidle'`, check-like text inside a string, case labels under a switch that is not on an event type, and a literal collection changed later by `push` or `add` can still escape it. The two-version doctor battery is the authoritative guard. `.opencode/plugins/ARCHITECTURE.md` records the same limit.
2. **Events that need a model turn are unverified on OpenCode 2.** `session.status`, `session.resumed`, `session.compact`, `permission.*` and `question.*` are listed as unverified, because the private host had no provider credentials.
3. **Follow-up: case labels count under any switch.** Limit them to switches on an event type.
4. **Follow-up: mutated literal collections.** Report a collection that is changed by `push` or `add` as unscanned.
5. **Follow-up: fixed ordinals in the ARCHITECTURE tree.** "15 below" and "the 17th entry" are undated.
6. **The nested-worktree v2 battery failure is out of scope.** Inside a worktree under the main checkout, OpenCode 2 also loads the main checkout's plugins and reports duplicate plugin IDs. CI runs from a fresh clone and is not affected.
7. **No CI job runs the plugin suite.** The inventory test guards the folder only where the suite is run.
<!-- /ANCHOR:limitations -->

---


