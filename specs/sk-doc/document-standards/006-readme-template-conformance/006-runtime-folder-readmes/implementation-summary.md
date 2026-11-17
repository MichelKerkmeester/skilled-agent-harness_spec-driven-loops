---
title: "Implementation Summary"
description: "The 7 runtime folder READMEs and 8 SYNC manifests now follow the runtime folder template, .vibe/ has its first README, and every inventory row, command and check was tested against the folder it describes."
trigger_phrases:
  - "runtime folder readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes"
    last_updated_at: "2026-11-17T17:07:56Z"
    last_updated_by: "generate-context"
    recent_action: "Closed the sk-doc suite criterion after the changelog test passed again"
    next_safe_action: "None: the phase is complete"
    packet_purpose: "Purpose: Each runtime folder README and sync manifest follows its scaffold in the runtime folder template, passes the validator and the voice scan with zero hard blockers, and states only surfaces, commands and checks the folder confirms."
    blockers: []
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes/implementation-summary.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes/tasks.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/006-runtime-folder-readmes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-runtime-folder-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "bc5a2770-b42a-4bfd-acf3-067a3f926fe2"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T17:07:56Z"
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
| **Spec Folder** | 006-runtime-folder-readmes |
| **Completed** | 2026-11-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Each runtime folder now explains itself twice, as the template asks. The README tells someone using that runtime what they get and how to check the folder, and the SYNC manifest tells someone changing a source which surface it feeds and which check catches drift. `.vibe/` had only a manifest before this phase and now has a README too.

### Phase 6: runtime-folder-readmes

The phase covers the README in `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.dsh/`, `.opencode/` and `.pi/`, the `SYNC.md` in those and in `.vibe/`, and a new `.vibe/README.md`. Before the rewrite all fifteen existing files printed `VALID`, but the eight manifests carried 91 voice hard blockers between them, and `.pi/SYNC.md` had a voice ceiling of 0. After it, all sixteen print `VALID` with no hard blocker, and every manifest ceiling is 100. Reviewers checked 1,452 claims and raised 41 findings. The main session confirmed every one in the code and applied all of them. The blocking review then sampled 150 claims and raised ten more, all confirmed and applied. No finding was rejected.

Three corrections reach past wording. `/doctor:runtime-mirrors` never runs the hook-registration check, so the READMEs that said it runs every check now say to run that one from the shell. The dsh composition commands in `.dsh/SYNC.md` were written on continued lines, which the repository's own dispatch preflight denies in an agent session, so they are now single lines. And the dsh README no longer calls the OpenCode Go route unproven, because a keyed run proved it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.claude/README.md`, `.codex/README.md`, `.cursor/README.md`, `.devin/README.md`, `.dsh/README.md`, `.opencode/README.md`, `.pi/README.md` | Modified | Rewritten to the runtime folder README scaffold, with the At a Glance table and a health block whose commands were rerun |
| `.vibe/README.md` | Created | The first README for the Vibe folder, on the same scaffold |
| `.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.dsh/SYNC.md`, `.opencode/SYNC.md`, `.pi/SYNC.md`, `.vibe/SYNC.md` | Modified | Rewritten to the sync manifest scaffold, with every inventory row checked against the folder and every drift check rerun |
| `005-runtime-plugin-readmes/tasks.md` | Modified | T013, CHK-051 and the commit row ticked after the 005 push |
| `006-runtime-folder-readmes/` packet docs | Modified | Tasks, checklist, acceptance rows and this summary closed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A canary writer ran first on `.opencode/SYNC.md`, then the other fifteen went out in waves of three, each wave's writers before its reviewers. Every session ran DeepSeek V4.1 Flash at max through cli-opencode on the OpenCode Go route, one file per session, and a reviewer never checked a file it wrote. The drive that dispatched the waves ran detached, so it outlived a session hop in the middle of wave 2.

After each wave the main session read every handback, opened the cited code for every finding before applying it, and reran the validator, the voice scan, the link check, the section model and both reference checkers. It also ran each manifest's read-only drift checks, 34 runs in all, and a new check that every README opens OVERVIEW with the four-row At a Glance table. That check fails on a three-row table and on a missing one, so its passes mean something. After the last wave it diffed `git status` against the snapshot from before the wave, to confirm each writer touched only its own file.

A blocking `@review` agent then sampled 150 claims across all sixteen files. It found that the doctor command skips the hook-registration check, that the dsh composition blocks trip the dispatch preflight, and that the agent check's output was described backwards, plus seven smaller faults. The main session confirmed each one, ran the dispatch rule check on the old and new dsh blocks, applied all ten and reran every gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The README says to run the hook-registration check from the shell | The doctor YAML lists no registration step, so a reader who trusts the doctor alone would miss a stale `hooks.json` |
| dsh composition commands written on one line with literal patch paths | `evaluateDispatch()` gives the continued form block-severity violations and the one-line form none, and the one-line form exits 0 with empty stderr |
| Doctor rows in the drift tables renamed to name what the doctor runs | Under "Everything at once" a reader would take it to cover the rows above it, and it skips several of them |
| Names of files that must not exist allowed with a reason | `CLAUDE.md`, `main.md`, `plugin.json` and `.vibe/commands/` are named to say they are absent, so a path cannot resolve. Each allow entry fails if its cause goes away |
| A stale comment in a dsh route patch recorded, not fixed | Goal D3 keeps runtime configs unchanged in this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Before numbers come from `baseline-006-before.tsv`, taken before the canary ran. After numbers come from `baseline-006-after.tsv`, taken on the final tree after the blocking review's fixes.

| Check | Result |
|-------|--------|
| `baseline.sh` on the 16 files | Before: 15 of 15 `✅ VALID`, hard blockers 14 in Claude SYNC, 14 in Codex SYNC, 12 in Cursor SYNC, 16 in Devin SYNC, 4 in dsh SYNC, 7 in OpenCode SYNC, 21 in Pi SYNC and 3 in Vibe SYNC. After: 16 of 16 `✅ VALID`, `hard=0` and `emojiH=0` |
| Voice ceilings, before then after | READMEs: Claude 98 to 99, Codex 98 to 98, Cursor 98 to 100, Devin 98 to 100, dsh 96 to 98, OpenCode 97 to 98, Pi 98 to 98, Vibe new at 96. Manifests: Claude 29, Codex 29, Cursor 40, Devin 17, dsh 80, OpenCode 63, Pi 0 and Vibe 85, all to 100. None ends below its baseline |
| `validate_document.py --type readme` on the 8 manifests | `Total issues: 0` for each. The plain run's single issue is the expected `document_type_fallback` warning |
| `h2model.py` against the two section models | `EXACT` for all 8 READMEs, `EXACT` for 7 manifests and `SUBSET` for `.opencode/SYNC.md`, with `---` above every H2 |
| At a Glance check on the 8 READMEs | `PASS rows=4` for each, with the labels Use it for, Start with, Works on and Checked by |
| `.opencode/SYNC.md` structure | `## 2. SURFACE INVENTORY` is the second H2 and `## 3.` follows it |
| `check_readme_references.py` and `check_derived_readme_counts.py` | `SUMMARY files=16 pass=16 fail=0` for each |
| `readme_links.py . <16 files>` | Before: `0 problems`. After: `checked 157 outbound and 0 inbound anchored links across 16 files, 0 problems` |
| Health blocks and drift checks | All 15 command blocks under CHECKING IT IS HEALTHY in the 8 READMEs and all 34 read-only drift-table commands in the 8 manifests exit 0 with the line each file states |
| `opencode-compat-layout.test.cjs` | `pass 21`, `fail 0` before and after |
| `check-markdown-links.cjs` | `7821 files, 15212 links checked, 0 broken`, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty`, 1,246 files |
| sk-doc `run-script-tests.sh` | At commit: exit 1, 57 PASS and 1 FAIL in `test_check_changelog_shape.py`, a changelog test outside this phase. Rerun 2026-11-17 after that test was fixed elsewhere: 58 PASS, `all sk-doc script tests passed`, exit 0 |
| Secret scan over the 16 files | 6 hits on token, secret or API key, all prose about those features. No key-shaped string, no user path and no scratchpad path |
| Scope of the change | `git status` over the eight runtime folders shows exactly the 15 modified files and the new `.vibe/README.md` |
| Blocking `@review` | CHANGES REQUESTED, 150 claims sampled. Three P1 and seven P2 findings, all confirmed in the code and applied across twelve files, then every gate above was rerun |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-record -->
## Review Record

One line per file. Every reviewer session was separate from the writer of the file it checked, and every finding was confirmed against the code before it was applied.

- **`.opencode/SYNC.md`:** 68 claims. Applied 4 findings as 3 pairs (the write run repairs every mirror link it owns and prints a `[runtime-mirror-sync]` prefix, sync-runtime-mirrors.cjs:193-219 and 440, local-* commands are left out of the written set but a checkout can carry them as links, sync-runtime-mirrors.cjs:129, no plugin imports the SDK at runtime, only JSDoc type imports, opencode-goal.js:3550 and system-skill-advisor.js:1054). Rejected 0. `opencode-compat-layout.test.cjs` still passes 21.
- **`.claude/README.md`:** 74 claims. Applied 1 (`check-agent-mirror-sync.cjs --all` prints one line per compared mirror, two per agent, check-agent-mirror-sync.cjs:131-133). Rejected 0. Two further findings concern `.claude/SYNC.md` counts and went to that file's triage. The main session also allowed `CLAUDE.md` and `skill.md` for the reference checker, with reasons.
- **`.codex/README.md`:** 55 claims. Applied 2 findings as 2 pairs (`sandbox_mode` comes from the generator's per-agent table for every shipped agent, sync-agents.cjs:33-52 and 200-203, so `review.toml` is read-only despite `bash: allow`). Rejected 0.
- **`.cursor/README.md`:** 84 claims. Applied 3 (`/doctor:runtime-mirrors` runs only the mirror and roster checks, doctor-runtime-mirrors.yaml:34-37, `.cursor/mcp.json` is a real-file copy identical to `.claude/mcp.json`, the routing rule names 8 packets, skill-routing.md:9-16). Rejected 0. The main session also wrote `deep/research.md` as its real path under `.skilled/commands/` so the reference checker resolves it.
- **`.devin/README.md`:** 56 claims. Applied 2 (`hooks/` holds 29 links and one authored `README.md`, the `hooks/` mirror is rebuilt by `sync-runtime-mirrors.cjs` from `hooks.v1.json`, sync-runtime-mirrors.cjs:59-63 and 213-216). Rejected 0. A third finding, the missing `repo-rules` row, belongs to `.devin/SYNC.md` and went to that file's triage.
- **`.dsh/README.md`:** 90 claims. Applied 3 (`adapters/` holds one authored `README.md` beside the links, the OpenCode Go route is proven, as commit `e3a22728fc1` and providers-and-models.md:46 record, and the top reasoning effort is proven only for LLM Gateway, providers-and-models.md:106). Rejected 0. The main session also allowed `CLAUDE.md` and `.local.md` for the reference checker, with reasons.
- **`.opencode/README.md`:** 88 claims. Applied 4 (`commands/` links skip git-ignored names and never write or prune `local-*` links, sync-runtime-mirrors.cjs:126-131 and .gitignore:251-252, the suite reports `fail 0` before its summary lines, the hand-over plugin also turns on through the global switch while the OpenCode switch is unset, hook-flags.cjs:269-284). Rejected 0.
- **`.pi/README.md`:** 79 claims. Applied 2 (`prompts/goal-pi.md` is authored and the generator never writes or prunes it, sync-prompts-pi.cjs:158-163, the extensions have adapter behavior suites, extensions/README.md:171-192). Rejected 0.
- **`.claude/SYNC.md`:** 121 claims. Applied 3 (`local-*` command links are still checked and written, only the prune pass skips them, sync-runtime-mirrors.cjs:91-110, 196-206 and 320-327, 17 of the 33 hook links are whole programs or skill-owned scripts, `readlink` over `.claude/hooks/`, `Explore.md` has no twin). Rejected 0. The main session also reworded a prose count and allowed `CLAUDE.md`. The old file's wrong command and hook counts are gone, because the rewrite states neither.
- **`.codex/SYNC.md`:** 118 claims. Applied 4 (`sync-prompts.cjs --check` reports an orphan stub as `EXTRA`, sync-prompts.cjs:137, while `validate-command-references.cjs` checks command-asset YAMLs, :172-182 and 481-490, the link check prints a visibility line before its PASS line, sync-runtime-mirrors.cjs:395-396, `/doctor:mcp` checks the Code Mode registration in `config.toml`, mcp-doctor-lib.sh:243-283). Rejected 0. The main session reran all six drift-table commands, and each exited 0 with the stated line.
- **`.cursor/SYNC.md`:** 124 claims. Applied 4 (`agents/` and `commands/` are real folders of per-file links, sync-runtime-mirrors.cjs:193-207, `hooks/README.md` is authored and the prune pass skips it, sync-runtime-mirrors.cjs:324, the rendered `hooks.json` keeps event names and drops only the concern, sync-hook-registrations.cjs:200-213, the runtime-mirrors README covers the registry, the renderer and the link generator). Rejected 0. The rewrite dropped the false compiled-ESM caveat row. The main session gave `hook-registry.json` its full path, reworded two prose counts and reran the four drift checks, each exit 0.
- **`.devin/SYNC.md`:** 141 claims. No findings. The `repo-rules` row the README review asked for is present. The main session gave `hook-registry.json` its full path and reran the three drift checks, each exit 0.
- **`.dsh/SYNC.md`:** 96 claims. Applied 1 (the mirror writer prints `Drift detected:` lines rather than `FAIL`, sync-runtime-mirrors.cjs:387-390, while the three tree generators print `FAIL`). Rejected 0. The rewrite no longer calls the OpenCode Go route unverified. The main session allowed the `hooks/dsh/` folder pattern and reran the six drift checks, each exit 0.
- **`.pi/SYNC.md`:** 96 claims. No findings. The main session named the two declaration files instead of counting them and reran the four drift checks, each exit 0.
- **`.vibe/SYNC.md`:** 102 claims. Applied 5 (a row for the new `README.md`, `session-cleanup.mjs` loads `.opencode/plugins/session-cleanup.js`, session-cleanup.mjs:25, a guard's core lives under `.skilled/` or `.opencode/plugins/`, plugins/README.md:90-95, the skill prune keeps `local-*` links, sync-skills-vibe.cjs:372, the roster line is padded). Rejected 0. The main session allowed `main.md`, `plugin.json` and `.vibe/commands/` as names of things that must not exist, linked the new README and reran the four drift checks, each exit 0.
- **`.vibe/README.md`:** a new file, 60 claims. Applied 3 findings as 2 pairs (the suites build their payloads inline, dispatch-preflight.test.mjs:33-41, the CI job runs only for `main` and `skilled/**`, command-tree-parity.yml:5-6 and 30-31). Rejected 0. The main session reran the health block: three PASS lines and `pass 26`, `fail 0`.
- **Blocking review, all 16 files:** 150 claims. Applied 10 across twelve files (`/doctor:runtime-mirrors` runs no hook-registration check, doctor-runtime-mirrors.yaml:146-186, in the Claude, Devin and Pi READMEs and the doctor rows of all eight manifests, the dsh composition commands rewritten as single lines after `evaluateDispatch()` gave the continued form block violations, the agent check prints lines only for mirrors it does not compare, check-agent-mirror-sync.cjs:129-135, two Pi config files are git-ignored state, .gitignore:360-362, Devin's `config.local.json` is untracked, Devin's 29 hook links serve 31 commands, the doctor's agents-md check reads only a root `CLAUDE.md`, Devin's mode is `dangerous` with `bypass` as an alias, the installer's canonical switch is `SYSTEM_HOOK_INSTALL_DISABLED`). Rejected 0.
<!-- /ANCHOR:review-record -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The template still says `.vibe/` has no README.** `runtime-folder-template.md:36` reads "`.vibe/` has only a `SYNC.md` so far", which this phase makes false. Goal D3 bars a template edit here, so the line waits for a template change.
2. **The sk-doc suite was red for a while for a reason outside this phase.** `test_check_changelog_shape.py` failed on a changelog entry another session was rewriting, so T011 and AC-006 stayed blocked at commit time. The suite passes again as of 2026-11-17, and both rows are now closed.
3. **One dsh route patch comment is stale.** `.dsh/patches/route-opencode-go-deepseek.patch.yml:2` still calls the endpoint unverified after the keyed run that proved it. Goal D3 keeps runtime configs unchanged, so the README states the proven fact and the comment waits.
4. **Two doctor commands check less than a reader might expect.** `/doctor:runtime-mirrors` runs no hook-registration or pointer check, and `/doctor:agents-md` reads only a root `CLAUDE.md`, so it reports a missing pointer on a machine that keeps it in `~/.claude/CLAUDE.md`. The docs now say both. The commands themselves are outside this phase.
5. **Fact checks sampled each file's claims.** Every claim a reviewer named was checked, but prose can still hold a claim nobody tested.
<!-- /ANCHOR:limitations -->

---


