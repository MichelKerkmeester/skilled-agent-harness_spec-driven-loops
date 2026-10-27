---
title: "Implementation Summary"
description: "Three advisor misroutes are fixed at their source and a private command now reaches every worktree: /doctor:git hooks leads on its own phrase, a typed /deep:research no longer lends its dependency enough graph support to win, :auto is no longer read as the word auto so draft auto-repair routes to spec-kit again, and worktree provisioning links private local-* commands from the primary checkout."
trigger_phrases:
  - "advisor routing and local install implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/022-advisor-routing-and-local-install"
    last_updated_at: "2026-10-27T08:00:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Fixed all four items, applied the review's one P2, reran every gate"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-022-advisor-routing-and-local-install"
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
| **Spec Folder** | 022-advisor-routing-and-local-install |
| **Status** | Complete |
| **Completed** | 2026-10-27 on `worktrees/217-weak-model-spec-authoring` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Each of the three prompts now routes to what it names, in the live advisor and in the regime CI tests use. The private alignment command now lives in the primary checkout, and any worktree provisioned from it gets a link to it.

### Phase 22: advisor-routing-and-local-install

- **Item 1, doctor-a-08.** sk-code gained a `comment hygiene` signal in an earlier commit, so it passed the threshold on "disable comment hygiene gate". The doctor manifest already documents `lead_phrases` for a doctor command that must lead a passing skill, and the hooks route now carries one. Main landed the same lead phrase in `bfe11fa5a1` while this phase was open, so after the rebase the route change is main's and this phase adds no second copy.
- **Item 2, rr-iter3-168.** In the live advisor the graph lane passed system-deep-loop's own `/deep:research` match on to its dependency system-spec-kit, worth 0.694, and that lifted spec-kit 0.008 above deep-loop. The graph lane now reports how much each seed lent each target. When a typed slash command named the seed, its loan can lift a neighbour up to the seed but never past it. Whether a seed holds a target down is decided on unbounded scores. The cap itself follows the seed's bounded score and repeats until nothing moves, so a command held down by another command still holds its own neighbour below it.
- **Item 3, draft auto-repair.** Every prompt lane, and the Python twin, now drops `:auto`, `:confirm`, `:autopilot` and `:unattended` after a slash command before tokenizing. A mode suffix chooses how a command runs, not what it is about. That made it safe to restore `draft auto-repair` to system-spec-kit's phrases beside `spec docs`.
- **Item 4, private commands in worktrees.** The command existed only in worktree 217, so removing that worktree would have lost it.
  - It is now copied into the primary checkout, where git ignores it.
  - `worktree-naming.sh provision` links every `local-*` entry under the folders the root `.gitignore`'s private-command rules name. It never replaces an existing path, and it never fails provisioning.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | `lead_phrases` on the hooks route |
| `system-skill-advisor/runtime/lib/scorer/projection.ts`, `scripts/command-bridges/command-bridges.generated.json` | Modified | Deriver output carrying the lead phrase |
| `system-skill-advisor/runtime/lib/scorer/lanes/graph-causal.ts`, `lib/scorer/fusion.ts` | Modified | Per-seed support and the slash-command bound |
| `system-skill-advisor/runtime/lib/scorer/text.ts`, `lib/scorer/lanes/{lexical,derived,explicit,semantic-shadow,bm25}.ts` | Modified | `tokenizePrompt` drops mode suffixes |
| `system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | The lead-phrase line and the matching suffix strip |
| `system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts` | Created | Bound, chained bound and suffix tests with controls |
| `system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modified | T243-SA-029 |
| `system-spec-kit/graph-metadata.json`, `system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | `draft auto-repair` restored, graph recompiled |
| `sk-git/scripts/worktree-naming.sh`, `sk-git/scripts/tests/worktree-naming.test.sh` | Modified | `_wn_link_local_commands` and its fixture test |
| `sk-git/SKILL.md`, `.hermes/skills/sk-git/SKILL.md`, `sk-git/changelog/v1.9.7.0.md` | Modified, Created | Rule 8 names the link step; version 1.9.7.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The conductor reproduced each misroute with lane evidence, then fixed items 1 and 4 directly. One Opus medium agent took items 2 and 3 together, because dropping the `auto` token also lowered deep-loop's lexical score on the item 2 prompt. It narrowed its first bound twice after checks showed real regressions: once to typed-command seeds only, once for skills that lend to each other. A fresh Opus medium reviewer then read the code diff with no conclusions attached and confirmed one P2. With two typed commands, a neighbour was capped at its seed's unbounded score. The conductor fixed it, proved the new test fails on the old bound, and reran every gate from the final tree.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Use the manifest's `lead_phrases` for item 1, not a weight change | The manifest documents exactly this case, and it touches one route |
| Bound only seeds a typed slash command named | Applied to every seed, the bound flipped rr-iter3-061 from sk-code, its right answer, to spec-kit; a plain-word seed's neighbour may be the better route |
| Leave the RRF fusion path unbounded | It ranks by lane position, so a lent amount has no meaning there, and it is feature-flagged off |
| Link private commands, not copy them | One copy means an edit in any worktree reaches every other |
| Leave private `local-*` skills out of the link step | Linking them changes which skills the advisor and graph compilers see in a worktree, and so what its tests report |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Advisor suite, final tree | `Test Files  150 passed (150)`, `Tests  1243 passed \| 8 skipped (1251)` |
| Advisor suite, before | `1 failed \| 148 passed (149)`, the failure doctor-routing-slice |
| `typed-command-routing.vitest.ts` | `Tests 5 passed (5)`; with the old bound `1 failed \| 4 passed (5)` |
| Python twin | `Summary: pass=85, fail=0` |
| Live probes | `command-doctor-git-hooks 0.7 \| sk-code 0.617804`; rr-iter3-168 `system-deep-loop 0.564701 \| system-spec-kit 0.5647`; `system-spec-kit 0.763766`; `system-spec-kit 0.814759`; `system-deep-loop 0.738916 \| sk-code 0.656367` |
| Local probes | `command-doctor-git-hooks`, `system-deep-loop`, `system-spec-kit`, `system-spec-kit`, `system-deep-loop` |
| sk-git harness | `PASS=171 FAIL=0`; against the previous script `FAIL=8` |
| Graph and route checks | freshness `SIGNAL DRIFT compiled vs disk: none`; compiler `VALIDATION PASSED`; intent signals `RESULT: PASSED`; route guard `All hubs fresh or excused`; admission `Every hub passes`; skill root, leaf manifest and derived freshness 14 of 14 |
| Bridges and doctor routes | `derive-command-bridges.cjs --check` `"changed": []`; `route-validate.sh` `18 routes validated, 2 warnings` (both existing `--dry-run` notes) |
| Hermes | `PASS: 67 Hermes skill copies in sync` |
| Private name in the tracked diff | none |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The rr-iter3-168 live margin is one millionth.** The bound holds spec-kit just under deep-loop, so the two show the same confidence. The order is pinned by the bound's tests.
2. **The bound checks for slash evidence, not that it names the scored skill.** `/deep:research` also gives command-spec-kit `phrase:/deep:research`. The review found no prompt where this changes a ranking.
3. **Two unaddressed scorer quirks.** Parallel edges from one seed to one target add up in the graph lane, and the `--unattended` flag form is still read as content. Neither misroutes a known prompt.
4. **The first full advisor run had one intermittent failure.** Its file was not captured. Every later full run passed 150 of 150, and the agent saw `daemon-watcher-new-root-ingestion` fail and pass the same way.
5. **The primary checkout's copy came from worktree 217.** Both copies match today, but an edit in 217 does not reach the primary because 217 holds real files, not links.
<!-- /ANCHOR:limitations -->

---
