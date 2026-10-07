---
title: "Implementation Summary"
description: "A parent goal sent in chat now carries only its directive. One rule in sk-create-goal says what it never contains, the templates lost their author instructions, and system-spec-kit's phase workflows point to /create:goal instead of restating the rules."
trigger_phrases:
  - "goal send and dedupe implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/012-goal-send-and-dedupe"
    last_updated_at: "2026-09-27T07:58:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Every skill changelog linked from the global tree"
    next_safe_action: "Commit when asked, refreshing the README manifest after staging"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md"
      - ".skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:97414d79ae25f1fedaddc22cdf68c8c65a3f8961cff4fcd21631850ea2aa0bdb"
      session_id: "75aab0e6-dcc7-401b-9d10-f48248374023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Older parents are cut at their next amendment, the recommended default, since the operator did not choose otherwise"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-goal-send-and-dedupe |
| **Completed** | 2026-09-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A parent goal sent in chat now carries only its directive. This packet's own parent dropped from 3,995 to 2,944 durable characters without losing a decision, a binding row or a criterion.

### Phase 12: goal-send-and-dedupe

You now find the send rule in one place. Section 4 of `sk-create-goal/references/budget-and-handoff.md` lists what a sent goal never contains: frontmatter, HTML comments and anchor markers, `---` dividers, heading section numbers and author instructions. It sends only at `packet_budget=ok`, and the 4,000 limit is measured on the durable slice. `AGENTS.md`, system-spec-kit's `SKILL.md`, the set-string playbook, five speckit workflows and the resend reminder now point there instead of restating it. Section 3 is the one cut order, and its new step 3 removes instructions an older template left behind.

The bloat is gone at its source. `goal.md.tmpl` and the three asset templates no longer carry the blockquote, the Operator copy section or the criteria introduction, and a `GOAL_AUTHORING` comment points to the mode. The unfilled phase-parent template fell from 3,156 to 1,624 durable characters and from 2,823 to 1,218 in chat. system-spec-kit's phase entry points, meaning `:with-phases`, Option D, `phase-definitions.md`, `phase-system.md`, the quick reference and the `create.sh` help, now send goal authoring to `/create:goal`.

A follow-up pass closed the gaps a second sweep found. Every surface that said the durable slice is injected now names the objective slice. The root README, the goal hooks README and the phase checklist name `/create:goal`. The validator's two goal findings now name their fix in sk-create-goal, and the implement workflow binds an unbound phase through `phase-add`. Two stale `/spec_kit:plan` names, a missing overview section and a broken OpenCode test path were fixed on the way, and the trigger index was regenerated last.

A five-iteration deep review on MiMo v2.6 Pro returned CONDITIONAL with two P1 and nineteen P2 findings, and all twenty-one are fixed. The budget boundary now has one statement, in section 2 of `budget-and-handoff.md`: the cap applies to a top-level packet and to any phase parent, nested or not, and exempts only a phase child that is not itself a phase parent. `check-goal.cjs` draws the same line as `goal.cjs packet` and gained a fifth check, `frontmatter-fence`. The frontmatter match no longer backtracks, so a file that opens with 2,000 comments parses in milliseconds where 26 took 12.6 seconds. `goal.cjs` refuses `--help` instead of storing it as an objective and exits 1 on every failure. `/create:goal` refuses a path outside its workspace and treats packet prose as data. The scenario, changelog, citation and naming fixes brought the mode in line with sk-doc. The Hermes generator now rewrites relative links, and broken links across the copies fell from 530 to 0.

Every runtime without a native goal command was then run live, and four of them had a defect a unit test never caught. Hermes injected its raw goal report, cut before the brief, and rendered the goal before the session bound it. Pi's turn-end nudge restarted a finished `pi -p` run, which then worked on for 18 minutes, and the completion-evidence advisory did the same to a playbook run. An OpenCode bind of a folder name with a line break reported success without binding. Each is fixed at its source with a test that fails on HEAD, and the OpenCode, Pi, Devin and Hermes playbooks now describe what their runtime really does. The per-runtime record is `scratch/runtime-verification/runtime-verification.md`.

All eight playbook scenarios then passed on MiMo v2.6 Pro, recorded in `benchmark/reports/2026-09-26--manual-testing-playbook--create-goal--review-remediation/`. SCG-005 needed three attempts. The first printed a chat slice while the placeholder finding stood, which showed that the handoff step had no gate, so `/create:goal` now stops on any open finding. The second answered correctly and was then restarted by the Pi completion advisory. The third passed clean. SCG-007's reply also showed that the session-goal redirect sent people to `/goal-cursor`, which refuses session actions, so the redirect no longer names it.

Next, the validator stopped scoring `AGENTS.md` as a readme. The file is the framework every runtime here loads at startup, and `~/.claude/CLAUDE.md` links to it, so an overview section written for the validator would load into every Claude Code session. `validate_document.py` now skips a file named exactly `AGENTS.md`, the way it skips templates and fixture trees, and `--no-exclude` still validates it. Their owners have since committed the cli-cursor and deep-review sources, so those two Hermes copies were regenerated as well, and all 71 copies are in sync.

A further pass closed what remained. The operator chose to teach the validator the surface-packet shape rather than restructure the three sk-code surface packets, whose opening heading sk-code/007 phase 012 kept on purpose. A skill that opens with WHEN THE HUB BUNDLES THIS is now held to that section, REFERENCE MAP and SURFACE STANDARDS, and the packets and their Hermes copies went from three or four missing sections each to none. `mcp-tooling/SKILL.md` gained a divider before each of its six sections and its route was re-minted, the cli-pi playbook now states its 36 scenarios, and the frozen README manifest lists the six directories committed since its last refresh. Every changed document outside `specs/` now reports 0 issues, and the sk-doc script suite passes, the rename-tooling test in an isolated clone.

The changelogs came last. The three create-goal entries now follow sk-create-changelog: v1.0.0.0 and v1.1.0.0 keep the compact shape without the test counts and validator results it forbids, and v1.2.0.0, with ten changes, moved to the expanded shape and corrects the earlier claim that every phase child is exempt from the budget. At the operator's choice the remaining-issue pass got its own entries: sk-doc v2.2.0.0, which also records the create-goal mode the hub never had an entry for, mcp-tooling v1.8.0.1 and cli-pi v1.5.11.1. Each skill's version carriers moved with its entry, and its route and Hermes copy were rebuilt.

The operator then asked for the missing changelog links. A sweep found 13 skill changelog folders that no link under `.skilled/changelog/` reached, the four cli ones already named and nine more. Each now has a link named by the tree's rule, and sk-design's single hub link became a folder with a `parent` link and one link per mode, the shape every other hub uses. All 60 folders are now reachable.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` | Modified | The one cut order, the one send rule and the template cost |
| `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl` and `sk-create-goal/assets/goal-*-template.md` | Modified | Author instructions removed, pointer comment added |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated | The rendered goal without the removed text |
| `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | Owner line, pointers, corrected creation section |
| `.skilled/skills/system-spec-kit/SKILL.md`, `README.md` and five references | Modified | `/create:goal` admitted and named, authoring keywords dropped, facts corrected |
| `.skilled/commands/speckit/assets/speckit-*.yaml` (five) | Modified | Pointers, plus `/create:goal` in `:with-phases` and Option D |
| `.skilled/commands/create/assets/create-goal-*.yaml` | Modified | The four cut-order lines point to section 3 |
| `AGENTS.md` | Modified | Three sentences of the rule, a pointer and the authoring owner |
| `.skilled/hooks/goal/lib/goal-slice.cjs`, `goal-slice.test.cjs` | Modified | The reminder keys the send on `packet_budget=ok` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modified | Help and next-step echo text |
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md`, `README.md`, `references/parent-and-nested-goals.md`, `changelog/v1.2.0.0.md` | Modified, Created | Pointers, versions and the release entry |
| `.hermes/skills/*/SKILL.md` | Regenerated | Every copy whose source is committed or this phase's own, with links that resolve |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its authored copy under `specs/sk-doc/019-skill-routing-refactor/` | Re-minted | The sk-doc route went stale when the mode's files changed. Re-minted the way the commit hook does, now `fresh` |
| `README.md`, `.opencode/plugins/README.md`, `.skilled/hooks/goal/README.md`, `feature-catalog/`, `references/config/hook-system.md`, `references/validation/phase-checklists.md` | Modified | Objective slice named as injected, `/create:goal` named |
| `runtime/lib/validation/spec-doc-structure.ts`, `runtime/tests/spec-doc-structure.vitest.ts` | Modified | Fix hints on the two goal findings, asserted |
| `.opencode/plugins/tests/opencode-goal-tool-path.test.cjs` | Modified | Spec path moved to the repository root |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its fixtures | Regenerated | From HEAD plus this phase's files |
| `../goal.md`, `../spec.md`, this phase's docs | Modified, Created | Parent cut, phase map and phase records |
| `.skilled/hooks/goal/lib/goal-slice.cjs`, `goal-slice.test.cjs` | Modified | Review fixes: linear comment match, one-line reminder, missing-path containment, `budgetApplies` exported |
| `.skilled/hooks/goal/bin/goal.cjs`, `goal.test.cjs` | Modified | Review fixes: `UNKNOWN_ACTION` for a stray flag, exit 1 on failure |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` and its tests and fixtures | Modified | Review fixes: shared budget test, `frontmatter-fence` check |
| `.skilled/hooks/goal/README.md`, `goal-plugin.md`, `lib/goal-core.cjs` | Modified | Review fixes: objective slice named, CLI exit documented. Comments only in the core |
| `.skilled/commands/create/goal.md`, `create-goal-*.yaml`, `create-goal-presentation.txt` | Modified | Review fixes: path containment, data-not-instructions, send gate |
| `.skilled/skills/sk-doc/sk-create-goal/` docs, changelogs and playbook | Modified | Review fixes: one budget rule, frontmatter rule, five-check counts, corrected scenarios, enum values |
| `review/` | Created | The deep review's state, iterations and report |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` and its test | Modified | Relative links resolve from `.hermes/skills/` |
| `.hermes/plugins/repo-guards/__init__.py` and its tests | Modified | Bind before the first render, injected brief only, core fallback |
| `.skilled/hooks/goal/pi/goal-context.ts`, `goal-pi.test.mjs` | Modified | The turn-end nudge waits for the next turn |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts`, `runtime/tests/completion-evidence-pi-extension.vitest.ts` | Modified, Created | The advisory waits for the next turn |
| `.opencode/plugins/opencode-goal.js`, `tests/opencode-goal-tool-path.test.cjs` | Modified | A bound path is stored as given |
| cli-opencode, cli-pi, cli-devin and cli-hermes playbooks, the cli-hermes CLI reference and feature catalog | Modified | Each states what its runtime does |
| `scratch/runtime-verification/`, `scratch/playbook-run/` | Created | Live runtime evidence and the MiMo playbook records |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `sk-doc/scripts/tests/test_instruction_file_exclusion.py` | Modified, Created | A file named `AGENTS.md` is skipped as an instruction file |
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `shared/assets/template-rules.json`, `sk-doc/scripts/tests/test_surface_packet_sections.py` | Modified, Created | A surface packet is held to its evidence core |
| `.skilled/skills/mcp-tooling/SKILL.md` and its serving and authored route manifests | Modified, Re-minted | A divider before each section, route `fresh` |
| `.skilled/skills/cli-external-orchestration/cli-pi/manual-testing-playbook/manual-testing-playbook.md` | Modified | States 36 scenarios, the count its files hold |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerated | Lists the directories committed since its last refresh |
| `review/review-report.md` | Modified | Three semicolons reworded |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md` | Modified | Aligned with sk-create-changelog |
| `.skilled/skills/sk-doc/changelog/v2.2.0.0.md` and the sk-doc version carriers | Created, Modified | Hub release for the create-goal mode and the validator changes |
| `.skilled/skills/mcp-tooling/changelog/v1.8.0.1.md` and the mcp-tooling version carriers | Created, Modified | Build entry for the section dividers |
| `.skilled/skills/cli-external-orchestration/cli-pi/changelog/v1.5.11.1.md`, `cli-pi/SKILL.md` | Created, Modified | Build entry for the scenario count |
| Route manifests for sk-doc, mcp-tooling and cli-external-orchestration, and their Hermes copies | Re-minted, Regenerated | Rebuilt after the version bumps |
| `.skilled/changelog/` links for 13 skill changelog folders, and sk-design's link turned into a folder | Created, Modified | Every skill changelog reachable from the global tree |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fresh Opus 5.5 analyst at xhigh effort scoped the work read-only, and the orchestrator spot-checked it before planning. After the operator's go-ahead, the orchestrator made each edit as an exact string replacement that failed if its source text was missing, in the analyst's order: canonical text, templates and snapshot, pointers, YAMLs, `AGENTS.md` and the reminder, `create.sh`, then the parent goal. Every criterion was measured against a baseline taken before the change. The two inferred claims were settled by reading the advisor source and by a scaffold in a scratch repository.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove author instructions from the templates, not from the chat projection | The limit is measured on the durable slice, before the projection, so only a source cut helps it |
| Keep the decisions line and the Read, Precedence and Stop rules | They direct the agent doing the work, and the objective slice repeats the binding sentence |
| Cut older parents at their next amendment | The operator did not choose otherwise, and a renderer strip would delete authored text in `sk-design/018` |
| Regenerate the trigger index last, from HEAD plus this phase's files | It hashes every document, and the shared checkout holds other sessions' uncommitted folders |
| Fix R3-P2-002 in the Hermes generator, and regenerate only copies whose source is safe to render | A per-copy patch would drift on the next sync. A copy whose source carried another session's uncommitted edits waited until that source was committed, as the cli-cursor and deep-review sources were before the phase closed |
| Exit 1 on every `goal.cjs` failure | Pi and Hermes read the output text, not the exit code, so no caller breaks, and a script that reads only the exit status now sees the failure |
| Spare `--budget` from the stray-flag refusal | `goal.cjs --budget 5 <objective>` is a valid bare set today |
| MiMo runs every `agent:` playbook step, and the orchestrator runs every `bash:` step | The mode is what the agent steps exercise, and running the checks directly keeps every output and exit status exact |
| Hold Pi's end-of-turn messages for the next turn with `deliverAs: "nextTurn"` | `triggerTurn: false` also stopped the restart, but it appended the nudge after the answer, and `pi -p` prints only a trailing assistant message, so the answer vanished |
| Store an OpenCode packet path as given | The shared core stores it that way and re-checks containment on every read, and output quoting keeps it on one line |
| Bind the Hermes goal inside the section renderer as well as the session hook | Hermes renders the prompt before the session hook fires and then freezes it |
| Fix the completion-evidence advisory in the same pass | It is the only other Pi sender at the end of a turn, and it pushed SCG-005 into a timeout |
| Drop `/goal-cursor` from the session-goal redirect | `/goal-cursor` refuses every session action with `UNSUPPORTED_SESSION_BINDING` |
| Skip `AGENTS.md` in the validator instead of giving it an overview section | `~/.claude/CLAUDE.md` links to it, so any section added there loads into every Claude Code session. The operator approved the recommendation with "Go" |
| Teach the validator the surface-packet shape instead of restructuring the sk-code packets | The operator chose it. sk-code/007 phase 012 kept the WHEN THE HUB BUNDLES THIS heading on purpose, and a restructure would give read-only evidence packets the routing and workflow sections of a mode they are not |
| Run the rename-tooling test in an isolated clone | It hashes the whole checkout and fails on any write during its 12-minute run, and other sessions write to the shared checkout |
| Refresh the frozen README manifest now and again after staging | It counts tracked files only, so the new benchmark folder joins it once staged |
| Rewrite create-goal v1.2.0.0 in the expanded shape | It carries ten changes, and sk-create-changelog requires the expanded shape at ten |
| Bump sk-doc to v2.2.0.0, a minor release | The hub gained a mode with no hub entry, and a new mode is a significant addition, the contract's minor case. The two validator changes ride along |
| Use build bumps for mcp-tooling and cli-pi | Each fix is a formatting or count correction, the contract's build case |
| Write the cli-pi entry in the skill's own changelog folder | `.skilled/changelog/cli-external-orchestration/` had no cli-pi link, and the changelog workflow never creates a missing component folder. The operator chose this with "All three", then asked for the missing links, so the entry is reachable from the tree too |
| Add all 13 missing links, not only the four cli ones | A sweep found nine more folders of the same kind, and "add missing links" covers them |
| Turn sk-design's single link into a folder | Every other hub keeps a folder with a `parent` link and one link per mode, the modes had no way in otherwise, and no live file cites a path under the old link |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| sk-create-goal tests, parity included | 15 of 15 |
| Scaffold golden snapshot | 12 of 12 after one update |
| `goal-slice` tests, plus Cursor and Devin | 21 of 21, 15 of 15, 3 of 3 |
| Search and measure checks V1 to V26 | Every one prints its target |
| Runtime mirrors, Codex, Pi, Hermes prompts, Hermes skills | 170, 34, 34, 34 and 71 in sync |
| Leaf manifests for system-spec-kit and sk-doc | Both OK |
| Parent goal criterion 3 after the re-mint | A goal-authoring prompt routes to sk-doc, then `[sk-create-goal]`. "Set the goal for this session" defers |
| `validate_document.py` and HVR scan on changed prose | VALID, 0 hard blockers. `AGENTS.md` is skipped as an instruction file |
| Parent goal | 2,944 durable, `packet_budget=ok`, check 4 of 4 |
| Validator tests with the new hints | 30 of 30, HEAD baseline 30 of 30 |
| OpenCode goal plugin test | 15 of 15, from 14 |
| All eleven goal suites after the review fixes | 186 of 186, from a baseline of 179, with no failures |
| New tests against HEAD's code | Each fails on HEAD: 26 comments took 12,568 ms, the reminder split across two lines, `--help` was stored as an objective, and the nested-parent and inner-fence fixtures passed |
| Corpus scan with the fifth check | 312 goals, `frontmatter-fence` 0 findings, every other count equal to HEAD's |
| sk-code drift guards | Both passed, exit 0, no warning on a changed file |
| Playbook package validator | 8 scenarios, 0 violations, 0 warnings |
| Every goal node suite from the final state | 294 of 294, exit 0: OpenCode 148, Pi 22, Cursor 15, Devin 3, CLI 8, core 74, slice 24 |
| Hermes `repo-guards` pytest and the sk-create-goal checker tests | 46 of 46 and 18 of 18 |
| Pi extension vitests, completion evidence and spec gate | 10 of 10, exit 0 |
| Hermes generator test and broken links | 4 of 4. 530 broken links at HEAD, 0 now, and `--check` reports all 71 copies in sync |
| Live runs on each runtime without a native goal command | OpenCode, Pi, Cursor, Devin and Hermes each PASS |
| MiMo playbook run | 8 of 8 PASS, SCG-005 on attempt 3, no write outside the scratch workspaces across 28 sessions |
| sk-code drift guards after the runtime fixes | Both PASS, exit 0, no warning on a file this phase changed |
| Runtime playbook packages, cli-opencode, cli-pi, cli-devin and cli-hermes | 0 violations. The warnings are older census notes, none from this phase |
| Instruction-file test against HEAD's validator | Fails on HEAD with `Missing required section: overview`, then 2 of 2 |
| `validate_document.py AGENTS.md` | `SKIPPED`, exit 0. `--no-exclude` still reports the overview issue |
| sk-doc script suite, before and after the validator change | 22 of 24, then 23 of 25. The same two tests fail both times, and the eleven tests that run the validator pass on the final bytes |
| Drift guards and route guard after the validator change | Both drift guards PASS with no warning on a changed file, and every hub's route is fresh |
| `validate_document.py` on the 95 changed docs outside `specs/` and the three sk-code surface sources | 96 report 0 issues, and `AGENTS.md` and a fixture README are skipped by design |
| Surface-packet test against HEAD's validator | Fails on HEAD with WHEN TO USE, SMART ROUTING and HOW IT WORKS missing, then 2 of 2 |
| sk-code surface packets and their Hermes copies | 4, 4 and 3 missing sections at HEAD for webflow, opencode and obsidian, 0 now, sources and copies alike |
| cli-pi playbook package | 36 scenarios in 11 categories, 0 violations, no census mismatch |
| sk-doc script suite after the remaining-issue pass | 25 of 25 in the shared checkout with the rename test skipped, the README manifest reproducing 825 of 825. The rename test passes in an isolated clone at `05231a01ea` with this phase's files copied in. The clone has no installed packages, so `test_create_skill_contract.py` and `test_root_name_consumer_matrix.py` fail there with `MODULE_NOT_FOUND` and pass in the checkout |
| Route guard, route sync, drift guards and Hermes checks | Every hub fresh, 7 hubs resolve, both drift guards PASS, 71 skills and 34 prompts in sync |
| Goal suites and checks from the final state | 294 of 294, Hermes 46 of 46, checker 18 of 18, check-goal 5 of 5 on the parent and 012, parent 2,944 `ok` |
| create-goal changelogs against sk-create-changelog | All three meet the structure rules, with 0 hard voice findings, 0 validator issues and DQI 85 each |
| New changelog entries | sk-doc v2.2.0.0, mcp-tooling v1.8.0.1 and cli-pi v1.5.11.1 are each next in sequence, with 0 validator issues and 0 hard voice findings |
| Version carriers and hub gates after the bumps | The metadata gate passes all three hubs, the route guard reports all 7 hubs fresh after 3 re-mints, and 71 Hermes copies are in sync with 0 broken links |
| sk-doc tests and drift guards after the bumps | 25 of 25 with the rename test skipped, both drift guards PASS, and a goal-authoring prompt routes to `sk-create-goal` |
| Changelog link tree | 60 of 60 skill changelog folders reached, from 47, with 0 broken links, and the route guard still fresh on every hub |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Older goals keep their old text.** 227 active goals carry the Operator copy section until their next amendment or cut. `AGENTS.md` overrides their resend wording.
2. **Four parents are still over budget.** sk-code/007, sk-design/018, sk-design/019 and sk-git/028 need their owners' cuts.
3. **The README manifest needs one more refresh at commit.** It counts tracked files only, so the new benchmark folder joins it once staged. Running `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py --write` after staging refreshes it.
4. **Hermes caps a prompt section below the brief's bound.** The cap is 4,000 characters and the core bounds a brief at 4,800. The longest of the 308 goals in `specs/` renders 2,558, so none is cut.
5. **A new Pi session reads the brief twice on its first turn.** The session-start restore and the first turn's injection both carry it, as HEAD did and the goal hooks README documents.
6. **The rename-tooling test needs a quiet checkout.** It hashes the whole checkout and fails when anything writes to it during its run. It passes in an isolated clone, and other sessions write to the shared one.
<!-- /ANCHOR:limitations -->

---
