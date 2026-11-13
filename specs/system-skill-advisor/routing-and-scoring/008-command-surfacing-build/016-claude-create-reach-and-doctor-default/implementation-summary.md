---
title: "Implementation Summary"
description: "Built and verified on 2026-11-13. /create:skill is now /create:sk-skill on every runtime with no alias, and Claude Code lists all 44 tracked commands. The mcp doctor tune row now gets /doctor:helper, the AGENTS.md Gate 2 call reads stdin, five commands carry intent phrases and real holdout rose from 3 to 5 of 44. All 13 acceptance criteria are Met. The work sits in the working tree on top of 087888ec4a and is not committed yet."
trigger_phrases:
  - "claude create reach and doctor default implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/016-claude-create-reach-and-doctor-default"
    last_updated_at: "2026-11-13T16:51:15Z"
    last_updated_by: "generate-context"
    recent_action: "Built and closed phase 016, all gates green"
    next_safe_action: "Run phase 017 from task T001"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/016-claude-create-reach-and-doctor-default/tasks.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/016-claude-create-reach-and-doctor-default/implementation-summary.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/016-claude-create-reach-and-doctor-default/scratch/after.txt"
    session_dedup:
      fingerprint: "sha256:3b637673732c2c94d1d0302c438ee318859a1207f86499c214b10ddb884654f9"
      session_id: "scaffold-016-claude-create-reach-and-doctor-default"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "96fe92f2-be24-4324-9bfc-fe4422c8760b"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-13T16:51:15Z"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-claude-create-reach-and-doctor-default |
| **Completed** | 2026-11-13. AC-001 to AC-013 are `Met` |
| **Commit** | Not committed. The changes sit in the working tree on top of `HEAD` `087888ec4a`, and the coordinator commits them after this close-out |
| **Level** | 2 |
| **Verified on** | `scratch/before.txt` ran at `087888ec4a` before any change. `scratch/after.txt`, `scratch/after-vall.log`, the three real captures and the wave 7 files ran on the working tree over `087888ec4a` with the changes uncommitted. The close-out reran the read-only checks named below from the same tree on 2026-11-13 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/create:skill` is `/create:sk-skill` on every runtime, with no alias. No command file is named `skill.md` now, so Claude Code lists all 44 tracked commands. A doctor prompt that says a tool is not showing up gets `/doctor:helper` beside the skills. The `AGENTS.md` Gate 2 example sends the request on stdin. Four doctor commands and `/speckit:search` carry intent phrases. A brief-cost run keeps its health records inside its own sandbox.

### Phase 16: claude-create-reach-and-doctor-default

The command file moved with `git mv` to `.skilled/commands/create/sk-skill.md`. Its text, its assets, the catalogs, the sk-doc hub, the `sk-create-skill` packet, the bridge entry, the hook guide, the root docs and the `markdown` agent name the new command. The deriver wrote the bridge file and the three marked blocks. The mirror sync and the six prompt and agent generators wrote every runtime copy and deleted the old ones. The old-name scan went from 55 files to 10: the nine kept history files and the new changelog entry.

The mirror check holds no allowlist now. `commandVisibility` and `collapseDrift` lowercase each name before they compare it to `skill.md`, so the check fails on a command file with that name in any capitalisation. On the regenerated tree it prints `visibility claude 44/44, cursor 44/44`, from `32/44`. A live Claude Code listing of a copy of the tree names all 44 expected commands and 13 `create:` names.

`STRONG_PROBLEM_CUE` reads a negated "show up" or "appear" as a strong doctor cue. Two idioms stay out: "appear to" and "up-to-date". The recaptured baseline reads `"offered":true` for `cmd-doctor-mcp-plain-tune-01` and `false` for `cmd-doctor-skill-advisor-plain-tune-01`. The live brief for the mcp row holds `Also: /doctor:helper`, and the CLI returns `["/doctor:helper","run"]` for it.

`AGENTS.md` line 65 reads the stdin form. The manifest and the Cursor rule were regenerated from it, and every history hash recorded at `HEAD` is still recorded. A new manifest test pins the stdin form.

The four doctor routes gained 19 phrases and `/speckit:search` gained 4. None repeats its command's tune prompt. On the real embedder, plain holdout went from 3 of 44 to 5 of 44, with typed 24 of 44 and false offers 0 of 35 in both columns.

The brief-cost script runs each hook child with `TMPDIR` set to its sandbox. One run left the shared health log line-for-line identical.

The `sk-doc` changelog gained `v2.10.0.0`, which records the break, and the four hub version fields read `2.10.0.0`.

### Files Changed

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `DS` is `.skilled/commands/doctor/scripts` and `SC` is `.skilled/skills/system-spec-kit/runtime/cli`. `git -c core.fsmonitor=false diff HEAD --stat -- .skilled .claude .cursor .codex .pi .dsh AGENTS.md README.md CONTRIBUTING.md` prints `64 files changed, 451 insertions(+), 330 deletions(-)`, and six new files are untracked: the five renamed runtime copies and the changelog entry.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/create/sk-skill.md` | Renamed from `create/skill.md` | The command under its new name |
| The three `create-skill-*` assets, `create/README.txt`, `.skilled/commands/README.txt`, `prompt_improve_presentation.txt`, `DS/command-catalog-mirror-check.cjs` | Modified | The new name in the command's own folder and the catalogs |
| Eight sk-doc hub files and seven `sk-create-skill` files | Modified | The new name in metadata, routing, prose and the schema helper's sample |
| `.skilled/skills/sk-doc/description.json` | Modified | The hub version field moved to `2.10.0.0` |
| `.skilled/skills/sk-doc/changelog/v2.10.0.0.md` | Created | Records the rename and the break |
| `ADV/scripts/command-bridges/scoring-compatibility.json`, `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modified | The bridge entry and the hook guide's Claude row |
| `ADV/lib/command-attach.ts`, `ADV/tests/command-attach-guards.vitest.ts` | Modified | A generic comment example and the typed-attach cases under the new name |
| `ADV/lib/scorer/projection.ts`, `ADV/scripts/skill_advisor.py`, `ADV/scripts/command-bridges/command-bridges.generated.json` | Regenerated | Written by `derive-command-bridges.cjs` |
| `ADV/scripts/routing-accuracy/command-prompts.jsonl` | Modified | Four rows expect `/create:sk-skill`. The holdout row changed by a count-only `sed` |
| `ADV/scripts/routing-accuracy/command-routing-baseline.json` | Regenerated | Recaptured by `capture-command-routing-baseline.mjs --write` |
| `ADV/lib/scorer/doctor-helper-handoff.ts`, `ADV/tests/doctor-helper-handoff.vitest.ts`, `ADV/tests/scorer/doctor-handoff-command.vitest.ts` | Modified | The cue, the two kept-out idioms and their cases |
| `SC/runtime-mirrors/sync-runtime-mirrors.cjs`, `SC/tests/sync-runtime-mirrors.test.mjs`, `SC/runtime-mirrors/README.md` | Modified | No allowlist, any capitalisation, and the collapse sample moved to `speckit` |
| `AGENTS.md`, `DS/tests/agents-md-manifest.test.cjs` | Modified | Line 65 in the stdin form and its test |
| `.skilled/commands/doctor/assets/agents-md-manifest.json`, `.cursor/rules/skill-routing.md` | Regenerated | Written by `agents-md-manifest.cjs --write` and `sync-gate1-pointers.cjs` |
| `.skilled/commands/doctor/_routes.yaml`, `.skilled/skills/system-spec-kit/command-metadata.json` | Modified | Intent phrases for five commands |
| `DS/tests/doctor-install-contract.test.cjs` | Modified | The five new install phrases appended to `INSTALL_PHRASES` |
| `ADV/scripts/measure-brief-cost.mjs`, `ADV/tests/measure-brief-cost.vitest.ts`, `ADV/scripts/routing-accuracy/README.md` | Modified | `TMPDIR` in the sandbox and its case |
| `README.md`, `CONTRIBUTING.md`, `.skilled/agents/markdown.md`, `.claude/agents/markdown.md`, the `sk-code` command-authoring checklist, `.codex/SYNC.md` | Modified | The new name in the root docs, the agent and the runtime notes |
| `.claude/commands`, `.cursor/commands`, `.codex/prompts`, `.pi/prompts`, `.dsh/prompts` copies, and the Codex, Pi and DSH `markdown` agent copies | Regenerated | Written by the mirror sync and the six generators. The five old copies were deleted |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-doc/manifest.json` | Regenerated | The sk-doc compiled-route manifest refresh, a step the plan did not list |
| `scratch/` | Created | Before and after numbers, three real captures, the wave 7 records, 17 worker briefs and 34 log files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash max workers ran through OpenCode, one task per worker. `scratch/briefs/` holds 17 briefs, and `scratch/logs/` holds one `.out` and one `.err` file per brief. The coordinator ran every task's Verify command itself.

One independent Opus verifier read the wave 1 diffs, T004 to T013. The coordinator's record of that read is ten PASS. The verifier also found two gaps, which became T030 and T031. The verifier report is not stored in `scratch/`.

T032 came from the build itself. After T019 added the install phrases, the install contract test failed because it pins the route's phrase list one by one. The doctor suite read fail 1 before T032 and fail 0 after.

The coordinator ran T001 to T003, T016 to T018, T020 to T025, T027 and T028, plus the two manifest refreshes. An Opus agent ran T029. Every Vitest command ran as `env -u AI_SESSION_CHILD npx vitest run`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rename the command to `/create:sk-skill` on every runtime with no alias | The operator's choice. An open Claude Code bug (`anthropics/claude-code#85786`) hides a folder's other commands behind any file named `skill.md` in any capitalisation, so the mirror check drops its allowlist and refuses the name everywhere |
| Keep "appear to" and "up-to-date" out of the strong cue (T030) | The verifier showed that "it doesn't appear to cover the routing case" and "don't show up-to-date entries only" read as strong cues with the planned pattern. Neither says a tool is missing |
| Move the collapse test's sample to `speckit` (T031) | The old path `create/skill.md` in that test made the old-name scan list one more file than the kept set |
| Append the install phrases to `INSTALL_PHRASES` (T032) | The install contract test pins the route's phrase list one by one, so it failed on the first new phrase |
| Refresh the sk-doc compiled-route manifest and copy it to its authored twin | After the hub files changed, the manifest read `stale-manifest` and the plain tune floor fell. Phases 006 and 012 of this packet did the same refresh |
| Keep the corpus row ids and the `create-skill-*` asset file names | A holdout row may change only in `expected_command`, so every id keeps one convention. No checker derives the asset names |
| Fix the five commands' phrases before the real holdout count is read | A count read after the phrases are known would stop being out of sample. No phrase changed after T020 read the count |
| Record the rename as `sk-doc` `v2.10.0.0` | The operator chose it in Q3: a minor bump with the break called out in the text |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T027 `FLOOR` | Typed `{"correct":24,"total":44}`, false offers `{"count":0,"total":35}`, typed delivery `{"own":24,"attached":20,"combined":44,"total":44}`, plain tune `{"own":13,"attached":15,"combined":28,"total":45}` and attached false offers `{"count":0,"total":35}`. Before: plain tune `{"own":8,"attached":15,"combined":23,"total":45}`, the rest equal |
| T027 `EVAL` | `[160,50,21,5]`, equal to `scratch/before.txt`. The scorer eval baseline was not recaptured |
| T027 `TC` and `VALL` | `TC` exit 0. `VALL` read 183 files and 1758 passed, 6 skipped, exit 0, from 1755 passed |
| T027 `DALL` and `NMST` | `pass 1189` and `fail 0`, from `pass 1188`. `pass 9` and `fail 0`, from `pass 8` |
| T027 generator checks | `DRV` `{"status":"fresh","changed":[]}`. `SRM` `visibility claude 44/44, cursor 44/44` and `256 mirrors across 10 trees are in sync`. `PSY` 45 three times, `ASY` 11 three times and `AMSC` in sync |
| T027 `AGENTS.md` checks | `AMC` `STATUS=OK rows=12 findings=0 unknown=0`. `MAN` `44 sections, 31 pins` and `Budget: 16108 / 16384 bytes to the last anchor, 27591 / 32768 bytes total, 22 history bodies`. `GPC` and `RCC` pass |
| T027 hub and doctor checks | `CRS` both lines, `PSC` `all hard invariants passed, 0 warnings`, `CCM` `STATUS=OK`, `RV` `32 routes validated, 11 warnings` and `DPR` `STATUS=OK phrases=267 bridges=36`, from 248 |
| Real captures | Read with the `REAL` filter. `scratch/real-head.json` and `scratch/real-before-d.json` each read typed 24 of 44, tune top-1 13 of 45, tune combined 28 of 45, holdout 3 of 44, false offers 0 of 35 twice and `[false,false,false]`. `scratch/real-after-d.json` reads typed 24 of 44, tune top-1 18 of 45, tune combined 33 of 45, holdout 5 of 44, false offers 0 of 35 twice and `[false,false,false]` |
| T028 old-name scan | `OLD` lists ten files: the nine `KEPT` files and `.skilled/skills/sk-doc/changelog/v2.10.0.0.md`. Every `KEPT` file is unchanged |
| T028 boundaries | `git diff --quiet HEAD` exits 0 on `.claude/skills`, `create/skill-parent.md` and `render.ts`. The package diff stat is empty. The label scan prints nothing, and the same pattern matches a control line. `AGENTS.md` numstat reads `1`, `1` and `sed -n 65p AGENTS.md \| wc -c` prints 205 |
| T022 and T023 Claude listing | `scratch/claude-observed.txt` reads `visibility claude 44/44`, 13 entries in `.claude/commands/create` with `sk-skill.md` among them and a `skill.md` count of 0. `scratch/claude-expected.txt` holds 44 lines, and `comm -23` against `scratch/claude-listing.txt` prints nothing. The listing holds 13 `create:` names |
| T024 live doctor | `scratch/doctor-live.txt`: the mcp brief holds `Also: /doctor:helper` and its CLI line is `["/doctor:helper","run"]`. The skill-advisor brief holds no `/doctor:` and its CLI line is empty |
| T025 brief cost | `scratch/brief-cost-run.txt`: exit 2 with `{"error":"degraded_brief","rows":1,"liveRows":0}`. The two listings of the shared metrics folder are identical, 224 files and 6651 lines in total |
| Close-out reruns | `node --check` exits 0 on `MS`, `MBC` and the schema helper. `TC` exits 0. Seven targeted Vitest files report 57 passed, and `tests/measure-brief-cost.vitest.ts` alone reports 3 passed. `NMST` reads `pass 9` and `fail 0`. The manifest test reads `pass 32`, the install contract test `pass 17` and the skill-root contract test `pass 1`, each with `fail 0`. All seven compiled-route hubs read `fresh`. The 23 added phrases overlap the five tune prompts 0 times |
<!-- /ANCHOR:verification -->

---

## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| No file named `skill.md` in any capitalisation sits under `.skilled/commands` (T003, REQ-001) | `find .skilled/commands -iname skill.md \| wc -l` prints 22. All 22 are `SKILL.md` fixtures under `.skilled/commands/doctor/scripts/tests/fixtures/`, and 0 sit outside that folder | They are fixtures of the sk-skill doctor checks, not command files, and no mirror reads them. The check was read as excluding `tests/fixtures` |
| No task refreshes the sk-doc compiled-route manifest | The coordinator ran `compiled-route-manifest.cjs refresh --hub sk-doc --skill-root .skilled/skills/sk-doc` and copied the served manifest to its authored twin under `specs/`, once after the rename and again after T026 | After the hub files changed, the manifest read `stale-manifest` and the plain tune floor read combined 14 of 45. The refresh brought it back to 23. The twin is the one file under `specs/` outside this packet that changed |
| `OLD` lists the nine `KEPT` files | It lists ten | The new changelog entry must name the old command to record the break |
| T023, the live listing, is the operator's | The coordinator ran it, as it ran the G5 listing on 2026-11-12. It used `claude -p` in a throwaway folder outside any repository that held a copy of `.claude/commands` | The listing needed one model session and no operator choice |
| Plain tune combined stays near 23 of 45 | The fixture floor reads own 13, attached 15, combined 28 of 45 | The new intent phrases also reach the lexical lanes. This is tune reach built in, not a gain. The out-of-sample result is real holdout 3 to 5 of 44 |
| Wave 1 and lane D only | T030, T031 and T032 were added | The verifier found T030 and T031. The doctor suite failed on the install contract test, which became T032 |

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rename breaks the old name with no alias.** A reader or a script that types `/create:skill` gets no command and no typed attach. The `v2.10.0.0` entry records the break.
2. **A `Skill.MD` with an upper-case extension never reaches the collapse check.** The command walker in `sync-runtime-mirrors.cjs` keeps only names ending in lower-case `.md`. Such a file is also never mirrored. The verifier observed this.
3. **The live brief cost is still unmeasured.** T025 exited 2 with `degraded_brief` and `liveRows` 0, as phase 015's run did. The health log stayed identical, so the sandbox fix holds, but no live byte number exists yet. The open point from phase 015 stays open.
4. **The skill-advisor wrong-top row stays silent.** Its prompt carries only a weak cue, so the narrow cue does not reach it.
5. **The holdout gain is one real-embedder count.** It was measured once after the phrases were fixed and reads 2 above the before line, the minimum the plan set.
<!-- /ANCHOR:limitations -->
