---
title: "Implementation Summary"
description: "The bots skill now meets the sk-doc package shape, an independent review and an alignment run were verified finding by finding, and named-bot requests reach their mode."
trigger_phrases:
  - "skilled alignment and docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/009-skilled-alignment-and-docs"
    last_updated_at: "2026-11-24T18:41:02Z"
    last_updated_by: "generate-context"
    recent_action: "Checker now runs the posture check; suite 381/381"
    next_safe_action: "Commit and push after operator yes"
    packet_purpose: "Purpose: The skill meets the sk-doc package shape and sk-code standards, and an independent review and a cross-surface alignment run both report no open defect that is not fixed or recorded."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/scripts/bot-check.cjs"
      - ".skilled/skills/system-skilled-bots/assets/bot-template.txt"
      - ".skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts"
      - ".skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts"
      - ".skilled/skills/system-skilled-bots/manual-testing-playbook/bot-authoring/native-runtime-refused.md"
    session_dedup:
      fingerprint: "sha256:ee6ecfb45f1ec580a8a308c6e7868ad5b61d123f61617e2f6a0a9b9dcaff3731"
      session_id: "scaffold-009-skilled-alignment-and-docs"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "335d5a41-9d36-45cb-8bae-6e6010fef894"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-24T18:41:02Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 009-skilled-alignment-and-docs |
| **Completed** | 2026-11-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The bots skill now carries the docs a developer and an operator need: six code-folder READMEs, a 22-entry feature catalog and 17 runtime playbook scenarios, each mapped to its catalog entry. Two outside reads of the epic were verified one finding at a time. A fresh Opus xhigh review found one P0, and an alignment run across every connected surface found 40 findings. Every confirmed finding is fixed with the check that proves it, and the rest are recorded with a reason.

### Phase 9: skilled-alignment-and-docs

You can now orient in `runtime/lib` from its README before editing, and run a real author, run, queue, schedule or status path from the playbook. Each scenario builds its own temp world. A request that names a bot, such as "pause the triage bot until Monday", now reaches the right mode at stage two. The four `/bots:*` commands also rank when typed. A CI workflow now runs the runtime suite when a file under the bots skill changes, or a file it loads from another skill, such as the deep-loop CLI guards or the repository identity script.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/**/README.md`, `scripts/**/README.md` | Created | Code-folder orientation |
| `.skilled/skills/system-skilled-bots/feature-catalog/**` | Created | One entry per shipped capability |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/**` | Created/Modified | Runtime scenarios BOT-009 to BOT-025 and the catalog index |
| `.skilled/skills/system-skilled-bots/runtime/lib/*.ts`, `runtime/tests/*` | Modified | Confirmed review fixes, each with a test |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Renamed | The machine-parsed template leaves the doc gates |
| `.skilled/skills/system-skilled-bots/hub-router.json`, `ROUTER.md`, packet `ROUTER.md` files, `graph-metadata.json` | Modified | Named-bot routing vocabulary |
| Hub-local `router.cjs` and `registry-compiler.cjs` (authored and runtime), canary fixture, compiled artifacts and manifests | Modified | The ordered-word keyword type and its gold |
| `system-skill-advisor` `scoring-compatibility.json` and the regenerated bridges, baseline, frozen pins and `skill-graph.json` | Modified | Active `/bots:*` bridges and a fresh compiled graph |
| system-deep-loop and cli-external-orchestration read-only docs, deep-loop `changelog/v2.2.0.0.md` | Modified | Describe the read-only executor behavior the epic shipped |
| `README.md`, `.skilled/skills/README.txt`, `.skilled/commands/README.txt`, `/bots:*` assets, the hub changelogs | Modified | Counts, the Bots group and literal fixes |
| `.env.example`, `hook-flags.env.example`, `ENV-REFERENCE.md` | Modified | The bots enqueue kill switch |
| `.github/workflows/bots-runtime.yml`, `.github/workflows/README.md` | Created/Modified | CI for the bots runtime |
| `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`, `.github/actions/setup/action.yml` | Modified | New worktrees and the CI dependency cache include the bots `runtime/` folder |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerated | The README durable manifest lists the twelve new bots code folders |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `runtime/tests/python/test_skill_advisor.py` | Modified | Structural ids are checked against an id grammar, so the Python advisor keeps `command-bots-run` |
| `.skilled/commands/deep/**` command docs, presentations, workflow YAMLs and compiled contracts | Modified/Regenerated | The `/deep:*` contracts describe the read-only cli-opencode run the epic shipped |
| `cli-mistral-vibe` `SKILL.md`, `README.md` and the cli-external-orchestration manifest | Modified/Regenerated | A read-only Vibe lineage gets only the read tools. The live manifest was refreshed after the edit |
| The four bots mode `README.md` files, their `references/` and `bots-author/SKILL.md` | Modified | They pass `package_skill.py --check --strict` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The docs came first, committed locally so the alignment scope could see them. The Opus review findings were fixed test-first and committed as `bd474396742`. The alignment run's Devin lanes failed on quota and on read-only permission mode, so the operator switched it to cli-vibe with DeepSeek Flash. Each of its findings was replayed before any fix, and the triage is in `scratch/alignment-triage.md`. The routing fix ran in a delegated agent through the same compiled-routing pipeline 008 used. The orchestrating session then replayed its probes and reran its gates. The CI file went through `/doctor:ci scaffold` with an explicit yes.

A second pass then checked this packet's own uncommitted work. Five read-only lenses (routing engine, cross-surface docs, the Python advisor, the bots docs and the repository) each found defects, a separate refuter tried to disprove every finding, and only the reproduced ones were fixed and verified again. After the rebuild, every pull-request workflow that the changed paths trigger was replayed locally. Four failures there came from this branch: the worktree provision list, the README durable manifest, strict packaging of the four modes and the doc version raise. The first three were fixed in place, and the version raise is applied once the final tree is staged. The rest passed or failed the same way on `origin/main`. The full record is in `scratch/alignment-triage.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rename the template to `.txt` rather than exempt it in the shared checkers | Doc frontmatter would break `parseDefinition`, and an exemption would be a shared-contract edit. A `.txt` asset has precedent |
| Leave the root release notes untouched | Operator: not releasing yet, so no merge with main either |
| Add an ordered-word keyword type, hub-local | Contiguous substrings cannot match "pause the triage bot" without also catching "pause the video" |
| Ordered keywords count only for a mode no plain keyword matched | Otherwise "run the bot" double-scores and existing near-ties turn into single routes |
| Run the bots CI on macos-latest | Bots run only on macOS, and the suite could not be tested on Linux here |
| Count ordered keywords only when no plain keyword matched in any mode | A per-mode fallback let an ordered run match tie another mode's plain match and turned single routes into bundles |
| Turn "drain the bot" and "bot's schedule" into ordered keywords | As plain phrases they matched inside "drain the bottleneck" and "the robot's schedule" |
| Keep the stage-one intent pins for the two retired phrases | Removing them changed no out-of-domain result but lowered in-domain confidence: "drain the bot" 0.8733 to 0.82, "Drain the bot request queue" 0.9275 to 0.8764 and "Remove the bot's schedule and unload its launchd agent" 0.8708 to 0.82 |
| Narrow `~start bot` and `~launch bot` to `~start the bot` and `~launch the bot` | "start writing a bot" and "start building a bot" reached the run mode, the one mode that dispatches an executor |
| Keep ordered keywords out of a prompt holding "authoring", "building", "creating" or "writing" | Operator choice on 2026-11-24. "start writing the bot" reached run. "write", "create" and "build" stay off the list, because "run the triage bot to write a summary" and "launch the build bot" ask for a run |
| Check structural advisor ids against an id grammar, not the free-text screen | The free-text screen matched the word "run" inside `command-bots-run` and dropped the row |
| No `.env.example` row for `SKILLED_BOT_RUN_ID` | The runner sets it on the child. It is not an operator setting |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bots runtime vitest | 35 files, 372 tests passed (baseline 33 / 355) |
| Bots typecheck | exit 0 |
| Checker posture fix (T016) | Bots suite `Tests  381 passed (381)`, baseline 378. Typecheck exit 0. Removing the posture call fails both new defect tests. Playbook validator `violations=0`, catalog `--strict` 0 violations, parent-skill-check 0 warnings, route guard fresh |
| Post-commit harness | 28 passed, 0 failed |
| Frontmatter coverage | `violations=0` |
| Skill graph freshness `--strict` | exit 0 |
| Playbook package | PASS, 25 scenarios, 0 violations, 0 warnings |
| Feature catalog `--strict` | PASS, 0 violations |
| Compiled routing | policy `93ebae9de124`, 69 canary cases, admission `--all` pass, sync `--check` 67 copies match, guard fresh, `compiled-route-*.test.cjs` 117 of 117, parent-skill-check 0 warnings |
| Two-stage replay | stage two routes 14 of 14 in-domain probes and 0 of 50 out-of-domain or adjacent prompts (`scratch/routing-replay.txt`) |
| Advisor and doctor suites | advisor 178 files / 2478 passed (agent log), doctor 1674 of 1674 rerun after the guard |
| CI | ci-report no flags, `check-gate-inputs.sh` `RESULT: PASSED` |
| Final gates from the staged tree | contract drift `OK commands=2`, four `package_skill.py --check --strict` PASS, README manifest reproducible, worktree naming `PASS=174 FAIL=0`, intent signals `RESULT: PASSED`, doc versions "every changed body raised its version" |
| Alignment recheck | 5 resolved, 3 still open by recorded decision, 0 new, 33 judgment findings with dispositions in the triage |
| Strict validation | 009 and the parent `RESULT: PASSED`, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Stage one still misses some named-bot requests.** "Run the release-notes bot now", "Pause the triage bot until Monday" and "launch the triage bot" get no hub at stage one. Fixing that is a shared-scorer change. Workaround: type the `/bots:*` command.
2. **Release notes not written.** `v4.2.0.0.md` does not yet name the bots hub, and line 300 still states the old OpenCode read-only refusal. They wait for the release that ships this branch.
3. **Stage one still ranks the hub first for some prompts outside it.** Stage two defers every one of them, so none reaches a bots mode. Out of domain: "set up a launchd schedule", "install a launchd schedule for my backup script", "write a launchd plist", "pause the launchd agent", "drain the queue", "my launchd agent is broken" and "fix the robot's schedule". Adjacent: "queue a build run", "enqueue a job run for the importer", "put my backup script on a launchd schedule" and "my schedule needs a reinstall". "start the bot-detection service" ranks `command-bots-run` first. A fix belongs in the shared scorer.
4. **"start to write the bot" still routes run.** The infinitive "write" is not an ordered-keyword blocker, because listing it would also defer "run the triage bot to write a summary". Workaround: type `/bots:author`.
5. **A compound request collapses to one mode.** "drain the bot and show bot status" routes status only, "remove the bot's schedule and run the bot" routes run only, and "drain the bot and write a new bot" routes author only. The ordered keyword drops out when another mode's plain keyword matches.
6. **Follow-ups recorded, not fixed.** Opus review P2s R-07, R-08, R-10, R-11, R-12 and R-15. The shared executor's timeout kill. `secrets` posture enforcement. The Devin lane permission mode in the alignment lane runner (`run-lanes.cjs:570`). The `command-bridges/README.md` §5 hub-command row rule. The `command-contract.json` coverage note. Any bot job installed before this branch needs `bots schedule install` once.
<!-- /ANCHOR:limitations -->

---


