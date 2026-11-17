---
title: "Implementation Summary"
description: "The 8 plugin, extension and hook mirror READMEs now follow the runtime plugin template, with every entry checked against its link, its real file and the config that loads it."
trigger_phrases:
  - "runtime plugin readmes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes"
    last_updated_at: "2026-11-17T13:13:51Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 005 docs with the sk-doc suite criterion blocked, as the operator chose"
    next_safe_action: "Review the staged phase 005 paths, commit, push, then start phase 006"
    packet_purpose: "Purpose: Each of the 8 READMEs follows the runtime plugin template, passes the validator and the voice scan with zero hard blockers, and maps every entry to its real file as the folder shows it."
    blockers:
      - "sk-doc suite red on a changelog shape test"
    key_files:
      - "specs/sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes/implementation-summary.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes/tasks.md"
      - "specs/sk-doc/document-standards/006-readme-template-conformance/005-runtime-plugin-readmes/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-runtime-plugin-readmes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "7be91f15-0ff9-421e-8bb3-fd9a453daa38"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-17T13:13:51Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 90
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
| **Spec Folder** | 005-runtime-plugin-readmes |
| **Completed** | 2026-11-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The eight folders a runtime loads entries from now each carry a README on the runtime plugin template, with an entry map that names every entry, what kind of file it is, the event that runs it and the real file behind it. Every one of those claims was checked against the folder, the links and the runtime config.

### Phase 5: runtime-plugin-readmes

The phase covers `.pi/extensions/`, `.opencode/plugins/`, `.dsh/plugins/repo-guards/`, `.vibe/plugins/` and the Claude, Codex, Cursor and Devin hook mirror folders. Before the rewrite, all eight printed `VALID`, but four carried 27 voice hard blockers between them and `.pi/extensions/README.md` had a voice ceiling of 3. After it, all eight print `VALID` with no hard blocker and a ceiling of 100. Reviewers checked 1,329 claims. The main session confirmed every finding against the code and applied all 25. It made 4 more edits so the reference and count checkers pass in three READMEs. The blocking review then added seven findings, all confirmed and applied. No finding was rejected.

Three corrections reach past wording. The old caveat that a compiled ESM entry cannot run through a symlink is false, because `isMainModule` resolves both paths, so the Cursor, Claude and Codex mirrors no longer repeat it. The master switch does not reach `git-message-gate`, which has no switch at all. And three concerns ignore the `SYSTEM_<CONCERN>_DISABLED` spelling, which the Claude switch table now names row by row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/README.md`, `.opencode/plugins/README.md`, `.dsh/plugins/repo-guards/README.md`, `.vibe/plugins/README.md` | Modified | Rewritten to the runtime plugin template with an entry map checked against each entry and its loader |
| `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`, `.devin/hooks/README.md` | Modified | Rewritten as link indexes, with each link's real file, event and kind checked against `readlink` and the runtime config |
| `004-hook-runtime-readmes/tasks.md` | Modified | T013, CHK-051 and its two completion rows ticked after the 004 push |
| `005-runtime-plugin-readmes/` packet docs | Modified | Tasks, checklist, acceptance rows and this summary closed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A canary writer ran first on `.cursor/hooks/README.md`, then the other seven went out in waves of three, each wave's writers before its reviewers. Every session ran DeepSeek V4.1 Flash at max through cli-opencode on the OpenCode Go route, one README per session, and a reviewer never checked a file it wrote. Reviewers were told to check four things for each entry: that the README names it, its kind, its real file and the event and load path in the runtime config.

The main session opened the cited code for every finding before applying it, reran the validator, the voice scan, the link check and each VALIDATION block after every wave, and tested switch claims against the resolver itself with `isHookEnabled`. The canary writer also removed the compiled ESM caveat. The main session confirmed that against `esm-entry.ts` and added the fact to the later writers' briefs so the Claude and Codex mirrors would not repeat it.

The blocking review found three claims that several READMEs shared. The env-secret guard reads both its own switch and the master switch from the environment only, so neither reaches it from `hook-flags.env`. `git-message-gate` refuses a command when the sk-git rulebook exists but cannot be read, so "every error approves" was false. And the Cursor spec gate refuses only under `SYSTEM_SPEC_GATE_ENFORCE=1`, which `.cursor/hooks.json` does not set. It also corrected the Devin exec matchers, the detached-HEAD exit on Devin's `--start` path, what `SYSTEM_DISPATCH_DISABLED` turns off and two entry-kind labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Switch claims tested against the resolver, not only read | The resolver maps some concerns to other canonical names. Running `isHookEnabled` with each spelling set showed which names turn a concern off |
| Vibe plugin map paths written from the repository root | The reference checker resolves a path, and a bare OpenCode file name in the Vibe folder resolves to nothing. A root path resolves and tells the reader where the file lives |
| One allow entry for `plugin.json` in the Vibe README | The README names the manifest Vibe looks for so it can say this folder has none. A file that must not exist cannot resolve |
| Prose counts reworded out | The count checker reads a number beside a noun as a claim about the folder. Naming the two scripts, or dropping a count of suites, keeps the meaning without a number that drifts |
| Mirror READMEs say what the config loads | Every runtime config loads the real `.skilled/` path, never the mirror link, so each mirror README calls its links an index for browsing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Before numbers come from `baseline-005-before.tsv`, taken before the canary ran. After numbers come from `baseline-005-after.tsv`, taken on the final tree.

| Check | Result |
|-------|--------|
| `baseline.sh` on the 8 files | Before: 8 of 8 `✅ VALID`, hard blockers 19 in pi extensions, 3 in opencode plugins, 4 in dsh repo-guards and 1 in the Cursor mirror. After: 8 of 8 `✅ VALID`, `issues=0`, `hard=0` and `emojiH=0` |
| Voice ceilings, before then after | pi extensions 3 to 100, opencode plugins 83 to 100, dsh repo-guards 78 to 100, vibe plugins 100 to 100, Claude mirror 98 to 100, Codex mirror 98 to 100, Cursor mirror 92 to 100, Devin mirror 99 to 100. None ends below its baseline |
| Line counts, before then after | pi extensions 201 to 215, opencode plugins 255 to 184, dsh repo-guards 171 to 208, vibe plugins 176 to 216, Claude mirror 77 to 169, Codex mirror 65 to 147, Cursor mirror 69 to 133, Devin mirror 62 to 169 |
| `h2model.py` against the runtime plugin section model | `EXACT` for vibe plugins, `SUBSET` for the other seven, with `---` above every H2 |
| `check_readme_references.py` and `check_derived_readme_counts.py` | `SUMMARY files=8 pass=8 fail=0` for each |
| `readme_links.py . <8 files>` | Before: `0 problems` over 49 links. After: `checked 62 outbound and 0 inbound anchored links across 8 files, 0 problems` |
| VALIDATION blocks | `vrun.py` reran every block in all 8. Each exit status and output matches its README |
| `goal-doc-contract.test.cjs` | `pass 5`, `fail 0` before and after |
| `check-markdown-links.cjs` | `7820 files, 15212 links checked, 0 broken`, exit 0 |
| `hook-wiring-check.cjs --root .` | `ok` for claude, codex, cursor, devin and vibe, exit 0 |
| `test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty`, exit 0 |
| sk-doc `run-script-tests.sh` | Blocked, exit 1: 57 PASS and 1 FAIL, `test_check_changelog_shape.py::test_the_model_entry_passes_every_rule`. Commit `14926d78a37` from another session changed `.skilled/changelog/skilled/v4.0.2.1.md`, and the changelog checker now gives that entry a glance-order note the test rejects. The entry before that commit gets no note. No README in this phase is read by the test, and goal D3 bars a hand edit to a changelog, so the operator chose to commit with T011 and AC-006 blocked |
| Secret scan over the 8 files | 34 hits on token, secret or API key, all prose about those features. No key-shaped string, no user path and no scratchpad path |
| Scope of the change | `git status` over the eight runtime folders shows exactly the 8 READMEs, beside the operator's own `.pi/settings.json` |
| Blocking `@review` | CHANGES REQUESTED, advisory 90/100, no P0. It sampled all 8 READMEs: 159 link and re-export targets, 137 event and matcher rows and about 80 behavior claims. The main session confirmed its three P1 and four P2 findings in the code and applied all seven across seven READMEs, then reran every gate above |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:review-record -->
## Review Record

One line per README. Every reviewer session was separate from the writer of the file it checked, and every finding was confirmed against the code before it was applied.

- **`.cursor/hooks/`:** 194 claims. Applied 3 (the preflight advisory joins up to three findings into one block, git-preflight-advisory.mjs:46,124-133, the reconcile skips off the live branch and never switches it, git-primary-reconcile.sh:193-196, the drift message names the --check command, which only reports, .cursor/hooks.json sessionStart entry and install-codex-hooks.mjs:215-222). Rejected 0. The writer also removed a false compiled-ESM caveat, confirmed against esm-entry.js isMainModule, which canonicalizes both sides.
- **`.pi/extensions/`:** 219 claims. Applied 3 (the session bridges import the adapter at its real path, session-start-context.ts:9 and session-stop-context.ts:7, so the lib link is for browsing, adapters import Pi types from the @earendil-works/pi-coding-agent package and the git advisory imports cli-dispatch rule checks, ask-surface-guard.ts:14 and git-preflight-advisory.ts:55, the vitest command lists five of the six Pi suites). Rejected 0.
- **`.opencode/plugins/`:** 176 claims. Applied 1 finding as 2 pairs (two entries can write stderr: opencode-goal.js:860-864 under OPENCODE_GOAL_DEBUG and system-skill-advisor.js:757 when the trusted-root rule fails to load). Rejected 0. goal-doc-contract still passes 5. The main session also dropped a prose count of two suites and four plugins.
- **`.dsh/plugins/repo-guards/`:** 234 claims. Applied 4 (an edit through a link lands in the real adapter, the goal action set is in goal/bin/README.md:19, goal-context honors the master switch through describePacketGoal, goal-core.cjs:1286-1287, the MCP route guard suite builds its own harness, dsh-mcp-route-guard.test.mjs:21). Rejected 0.
- **`.vibe/plugins/`:** 150 claims. Applied 4 findings as 5 pairs (only the hook scripts are thin adapters, render-home-hooks.cjs and lib/hook-io.mjs are not, spec-gate and env-secret-guard rows name their match selectors, .vibe/hooks.toml:37 and 45, two of the twelve scripts import no hook-flags, env-secret-guard.mjs and git-message-gate.mjs, SYSTEM_ENV_SECRET_GUARD_DISABLED is read from the environment only, env-secret-guard.cjs:838-845). Rejected 0. The main session also wrote the 20 plugin map paths from the repository root, pointed the dependency line at `repo-guards/lib/hook-io.mjs`, allowed `plugin.json` with a reason and reworded three prose counts.
- **`.claude/hooks/`:** 94 claims. Applied 5 findings as 6 pairs (the diagram box says adapters live under .skilled, 17 of 33 targets are outside .skilled/hooks, git-message-gate checks commit messages, PR bodies and new branch names, git-message-gate.mjs:335-354, the env-secret-guard matcher includes MultiEdit and NotebookEdit, settings.json:133, the master switch skips git-message-gate, which has no switch, mcp-route-guard, git-preflight and post-edit-quality ignore their SYSTEM_ spelling, tested here with isHookEnabled, and the dispatch audit takes both CLI_DISPATCH_AUDIT_DISABLED and SYSTEM_DISPATCH_DISABLED). Rejected 0.
- **`.codex/hooks/`:** 83 claims. Applied 0. Rejected 0 (no findings).
- **`.devin/hooks/`:** 179 claims. Applied 5 (git-message-gate checks commit messages, PR bodies and new branch names, the env-secret matcher is the full list at .devin/hooks.v1.json:133, wider than the reviewer named, git-live-follow.sh:63-64,205 and session-cleanup.sh:186-195 can exit 1, the master switch and the per-concern kill switch skip git-message-gate). Rejected 0. The main session also wrote the `runtime/hooks/devin/` source path from the repository root.
<!-- /ANCHOR:review-record -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Loader behavior rests on this repository's own files.** Two writers noted that the claims "Pi scans `.pi/extensions/` and calls each default export" and "OpenCode loads each top-level `.js` file" come from this repository's tests and READMEs, not from the runtimes' loader source, which is not here.
2. **Effect cells restate each script's own contract.** The mirror READMEs describe what each linked script does from its code and header, not from a live session of each runtime.
3. **`.cursor/SYNC.md` still points at the removed caveat.** Its row for `hooks/README.md` mentions a compiled ESM caveat this phase removed as false. SYNC docs belong to phase 006, which fixes that row.
4. **The sk-doc suite is red for a reason outside this phase.** `test_check_changelog_shape.py` fails on the v4.0.2.1 changelog entry another session is rewriting. T011 and AC-006 stay blocked until that entry or the test changes, and rerunning `run-script-tests.sh` then closes both.
5. **Fact checks sampled each README's claims.** Every claim a reviewer named was checked, but prose can still hold a claim nobody tested.
<!-- /ANCHOR:limitations -->
