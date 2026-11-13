---
title: "Implementation Summary"
description: "suggest-subtracks.mjs proposes a whole-track sub-track map for a crowded flat track and names the best-fitting sub-track for a new packet, and option C of the spec-folder question now offers a sub-track on every surface."
trigger_phrases:
  - "subtrack proposal implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal"
    last_updated_at: "2026-11-13T10:07:32Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed AC-007 on the create.sh json run and listed the tool in the README"
    next_safe_action: "Start phase 003-subtrack-archive-and-numbering closeout"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-subtrack-proposal"
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
| **Spec Folder** | 002-subtrack-proposal |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

`suggest-subtracks.mjs --track <track>` now prints a whole-track sub-track map for a flat track of 8 or more live packets, in the format `relocate.mjs --map` accepts. With `--describe "<text>"` it names the sub-track a new packet fits, or says none fits. Option C of the spec-folder question offers a sub-track on every surface that carries it.

### Phase 2: subtrack-proposal

You no longer have to notice by eye that a track has outgrown a flat list. Run the tool on a flat track and it groups the packets by the terms their `description.json` and `graph-metadata.json` share, names each group from its two most shared terms and puts the packets that match nothing in a sub-track named `general`. The map names every live packet exactly once, so applying it can never leave the track mixed. Below the threshold it prints why there is no map and exits 0. The tool only reads and prints. Moving stays with `relocate.mjs` after you approve the map.

When you create a packet, `create.sh` prints one advisory line on stderr if the track has grown into clusters, if the packet fits no existing sub-track, or if it fits another sub-track better than the one you named. The line never blocks the scaffold. The structure docs now say when to propose a sub-track and how to create a packet inside one with `--track <track>/<sub>`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs` | Created | The read-only proposal tool: retroactive map and present-time fit |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | `advise_sub_track` prints one advisory stderr line and always returns 0 |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modified | Three option C strings gain `new or existing sub-track` |
| `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs` | Modified | Pinned strings and `plannedHash` follow the new wording |
| `.skilled/commands/speckit/assets/speckit-plan-presentation.txt` | Modified | Option C clause |
| `.skilled/commands/speckit/assets/speckit-complete-presentation.txt` | Modified | Option C clause |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modified | Option C clause in `standard_question` |
| `.skilled/commands/create/assets/` six `create-*-presentation.txt` files (agent, command, feature-catalog, manual-testing-playbook, skill-parent, skill) | Modified | Option C clause |
| `.skilled/commands/deep/assets/` three `deep-*-presentation.txt` files (ai-council, research, review) | Modified | Option C clause |
| `.skilled/commands/deep/assets/compiled/` three `deep-*.contract.markdown` files | Modified | Regenerated with `compile-command-contracts.cjs --write` |
| `AGENTS.md` | Modified | Gate 3 option C names a sub-track of the track |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modified | Regenerated from `AGENTS.md` |
| `.skilled/skills/system-spec-kit/references/memory/trigger-config.md` | Modified | Its copy of option C |
| `.skilled/skills/system-spec-kit/references/workflows/worked-examples.md` | Modified | Its copy of option C |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` | Modified | The parity fixture's copy of the question text |
| `.skilled/skills/system-spec-kit/references/structure/folder-structure.md` | Modified | New section "When to Propose a Sub-Track" |
| `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md` | Modified | Pointer to that section |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Documents `--track <track>/<sub>` |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md` | Modified | Documents `--track <track>/<sub>` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | Lists `suggest-subtracks.mjs` in the tree and in the key-files table |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

DeepSeek V4.1 Flash wrote `suggest-subtracks.mjs` and `advise_sub_track` through the dsh harness on the LLM Gateway route, one change per dispatch. The orchestrator made the wording and doc edits. On the real tree the tool ran in both modes with `git status --porcelain` compared before and after each run: a missing track, `cli-classifier` at the default threshold and at `--threshold 3`, and two `--describe` runs on `system-speckit`. The whole-track proof then ran on a 10-packet fixture track `demo` in a throwaway `git clone --shared` under `/private/tmp`, which was deleted afterwards. Then came `npm test` and the suites that pin the gate wording. The phase baseline is the one phase 001 saved in `../001-relocation-engine/scratch/baseline.txt`. The last proof was a `create.sh --json --skip-branch` run on a 10-packet fixture track `demo` in a throwaway clone at commit 3f2c1f9d61, which closed AC-007. The README entry for the tool was written after that.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Change option C on every surface, not only the five files the spec first listed | The operator decided this during the build. The parity suite requires 17 menu files to contain the shared constant in full, so a partial change would fail it |
| Prove the whole-track map on a fixture track | No real flat track holds 8 or more live packets. The largest, `cli-classifier`, holds 6 |
| Drop terms found in more than 60 percent of a track's packets | Such a term describes the track, not a group inside it, and would make every pair look alike |
| Merge at a Jaccard similarity of 0.2 or more, by union-find | A pair joins only on real overlap, and the result does not depend on the order packets are visited |
| Collect single packets in one remainder sub-track named `general` | The map must cover the whole track, and a one-packet sub-track reads as noise |
| Require a score of 0.2 and at least 2 matched terms in present mode | One shared word is too weak to send a new packet to a sub-track |
| Put the advisory in its own function, `advise_sub_track`, beside `list_recent_track_packets` | It returns 0 on every path, so a missing `node` or a tool failure can never stop a scaffold |
| Regenerate the compiled deep contracts and the AGENTS.md manifest | Both are generated files, and a hand edit would drift from their source |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Real tree: `suggest-subtracks.mjs --track does-not-exist` | Printed `suggest-subtracks: track does-not-exist does not exist`, exit 2 |
| Real tree: `--track cli-classifier` | Printed `track cli-classifier has 6 live packets, below the threshold of 8` and no map, exit 0 |
| Real tree: `--track cli-classifier --threshold 3` | A 6-entry map with sub-tracks completion-directive and general. A `relocate.mjs --map` dry run accepted it |
| Real tree: `--track system-speckit --describe "archive a spec folder"` | Printed `best fit: system-speckit/spec-folder-tooling` |
| Real tree: `--track system-speckit --describe "bake sourdough bread"` | Printed `none fits: propose a new sub-track in system-speckit` |
| Real tree: `git status --porcelain` around every run of the tool | Identical before and after |
| Clone: `suggest-subtracks.mjs --track demo` on the 10-packet fixture | Exit 0, a 10-entry map with billing-invoice, index-query, login-oauth and general |
| Clone: `relocate.mjs --map` dry run on that map | Exit 1, `moves=10 moved=0 rewrites=21 identity=10 roots=5 ledger=10` |
| Clone: `create.sh --track demo` | Printed `[speckit] Track demo has grown into clusters. Consider sub-tracks: ...` |
| `npm test` in `runtime/cli` | Exit 0. Vitest 206 files passed, 3 skipped. 2524 tests passed, 20 skipped. Every legacy stage 0 failed. Identical to the phase 001 baseline |
| spec-gate-core and gate-3-menu-parity node tests | 127 tests, 124 pass, 3 skipped, 0 fail |
| agents-md tests and manifest check | 71 pass, manifest check PASS |
| skill-advisor policy-plan parity tests | 32 pass |
| deep-loop contract tests | 23 pass |
| `bash -n create.sh` | Exit 0 |
| Clone at commit 3f2c1f9d61: `create.sh --json --skip-branch --track demo --short-name probe-json "Probe json"` | Exit 0. stdout parsed with `node -e JSON.parse` and held no `suggest-subtracks` text. stderr line 1 was `[speckit] Track demo has grown into clusters. Consider sub-tracks: node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track demo`. `specs/demo/011-probe-json` was created |
| `rg -c "suggest-subtracks.mjs"` on `runtime/cli/spec/README.md` | Printed 2, the tree line and the key-files row |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **No real track has exercised the whole-track map.** The proof is a fixture, so the clustering constants are untuned against a real crowded track. Read the proposed names before approving a map and rename the ones that read badly.
2. **The tool has no test suite yet.** Phase 005 writes it. Until then the checks above are the only cover.
3. **The `create.sh` advisory was proven for one of its three cases.** The recorded run covers a track that has grown into clusters. The lines for a packet that fits no sub-track and for one that fits another sub-track better have no recorded run. Phase 005 owns the suite that should cover them.
<!-- /ANCHOR:limitations -->

---
