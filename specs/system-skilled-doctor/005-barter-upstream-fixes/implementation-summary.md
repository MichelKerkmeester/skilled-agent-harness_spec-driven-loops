---
title: "Implementation Summary"
description: "A vendored Skilled copy can now drop its Code Mode, Pi and hook-wiring overlays, cut Mobbin/Refero to its own line, run the doctor tests green apart from its own symlink overlay, place a marked block before a closing section, and survive a stale shared tree with one Pi notice."
trigger_phrases:
  - "barter upstream fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/005-barter-upstream-fixes"
    last_updated_at: "2026-11-18T16:39:29Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded final gates and set status Complete"
    next_safe_action: "Run strict validation, then commit and fast-forward main"
    packet_purpose: "Purpose: A consumer re-pins Skilled and drops its Code Mode, Pi and Mobbin/Refero overlays, its doctor tests pass on the vendored tree, and a marked block can sit before a closing section."
    blockers: []
    key_files:
      - ".github/workflows/pi-entry-checks.yml"
      - ".skilled/commands/create/assets/create-sk-skill-confirm.yaml"
      - ".skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs"
      - ".skilled/skills/mcp-tooling/mcp-mobbin/INSTALL-GUIDE.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
    session_dedup:
      fingerprint: "sha256:faa41dc843de8a50f1f4ddfa9ddb16aa8730d7a5f15795e32554d53c45439def"
      session_id: "scaffold-005-barter-upstream-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "9d5d9117-89f5-4e61-8c2d-ddc8639dd5d1"
      workspace: "/Users/michelkerkmeester/worktrees/public/473-barter-upstream-fixes"
      savedAt: "2026-11-18T16:39:29Z"
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
| **Spec Folder** | 005-barter-upstream-fixes |
| **Status** | Complete |
| **Completed** | 2026-11-18. Every acceptance criterion is Met |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

A developer with no OAuth tokens no longer gets ClickUp, Mobbin and Refero sign-in tabs when a session starts. A project that vendors Skilled can drop its Code Mode, Pi config and hook-wiring overlays at the next re-pin, its Mobbin and Refero overlays shrink to the one line that is the consumer's own, and its doctor tests no longer fail on facts about the Skilled source repo. When the shared Skilled tree is missing or out of date, Pi now starts with one notice naming the hooks that are off, where it used to print 22 load errors.

### Upstream fixes so Barter can drop four overlays

Code Mode now leaves a manual marked `"disabled": true` out of startup registration, which is what its skill doc already promised. The three OAuth `mcp-remote` manuals ship disabled, and the Mobbin and Refero modes ask before they register on demand, the way ClickUp already did. The Pi config no longer names a private provider. Six doctor test files build their fixtures from shipped sources or skip only the cases that assert the source repo itself. A `marked-section` overlay can now name an `insertBefore` line, so its block lands before a section that must stay last.

### Pi entries that survive a stale tree

`hook-wiring-check.cjs`, which the consumer carried as an overlay, now ships with its test, and `/doctor:setup` and `/doctor:symlink` run it. It names every Pi extension entry that cannot load. The 22 Pi entries are no longer one-line re-exports. `sync-hook-registrations.cjs` renders each from one template that imports the adapter inside an async factory. When that import fails, the entry registers a `session_start` handler instead of the hook, and the first such handler shows one notice for the session: how many entries are off, which ones, the first error, and "run git pull in it, then /doctor:setup". An adapter that throws while it registers is outside the `try`, so Pi still reports it as a load error. The sync check, the parity test, `doctor:git` and the wiring check all read the new shape, and `tsconfig.pi.json` type-checks the template through three entries.

### Follow-ups closed after the first merge

The operator asked for nothing to stay open, so four follow-ups the first round reported were closed too. The Mobbin, Refero and ClickUp docs no longer say the manual loads at startup or that reconnecting Code Mode brings its tools. They now say the ask step's `register_manual` call loads it and opens the sign-in tab. The backup-path test again checks this repository's own `.gitignore`, behind the same source-repo gate the other doctor tests use. A new CI workflow, `pi-entry-checks.yml`, type-checks the Pi entries and runs `hook-wiring-check.cjs`. The `/create:sk-skill` assets now carry the command's own name, which ends the codex command-router drift and drops the advisor scorer's exception for the old stem.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/mcp-code-mode/mcp-server/index.ts` | Modified | Filter disabled manuals before the startup config is validated |
| `.utcp_config.json` | Modified | Mark `clickup_official`, `mobbin` and `refero` disabled |
| `.skilled/skills/mcp-tooling/mcp-mobbin/SKILL.md`, `mcp-refero/SKILL.md` | Modified | Ask-then-register step, and one stale startup line in Mobbin |
| `.pi/settings.json`, `.pi/pi-blackhole-config.json` | Modified | Drop the `llmgateway` default and observer model, set `sessionFallback: true` |
| Six files in `.skilled/commands/doctor/scripts/tests/` | Modified | Host-independent fixtures and source-repo-only skips |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modified | `insertBefore` on apply, rewrite, move and capture |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modified | Five `insertBefore` tests |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modified | Document `insertBefore` |
| `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` and its test, `assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-symlink-check.yaml` | Modified | The consumer's Pi entry load check, then a one-hop follow of a single relative import |
| `.pi/extensions/*.ts` (22 entries) | Modified | Rendered from the template |
| `runtime-mirrors/sync-hook-registrations.cjs`, `hook-registry.json` | Modified | `renderPiEntry`, the byte-equality check and the re-export migration in write mode |
| `runtime/tests/hook-adapter-path-parity.vitest.ts`, `runtime/cli/tests/hook-registration-sync.vitest.ts` | Modified | Template equality for every entry, and the migration test |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` and its test | Modified | Follow the lazy import to the git advisory adapter |
| `tsconfig.pi.json`, `.pi/types/pi-coding-agent.d.ts`, `.pi/types/node-globals.d.ts` | Modified | Three entries in the type gate, a `session_start` overload and `process.stderr` |
| `.pi/SYNC.md`, `.pi/README.md`, `.pi/extensions/README.md`, `.skilled/CROSS-CLI.md` and about 30 hook docs | Modified | Describe the rendered entry and the notice |
| 28 files in `mcp-tooling/mcp-mobbin`, `mcp-refero` and `mcp-click-up` | Modified | Register on demand through the ask step, not at startup |
| `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | Modified | Source-repo case for the `.gitignore` entry |
| `.github/workflows/pi-entry-checks.yml`, `.github/workflows/README.md` | Created, Modified | The Pi entry CI gate and its two README rows |
| `.skilled/commands/create/assets/create-sk-skill-{auto,confirm}.yaml`, `create-sk-skill-presentation.txt` | Renamed | Take the command's own name, as the command contract expects |
| `create/sk-skill.md`, `command-metadata.json`, the asset roster fixture and five tests and docs that name the assets | Modified | Follow the rename |
| `system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | Drop the old-stem exception |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Every symptom was reproduced first on a scratch copy of the consumer's vendored tree, then fixed in the worktree and re-run there. Code Mode was probed with a dummy stdio manual over a real MCP client, against both the patched and the unpatched build. The `insertBefore` tests were run against the old engine to confirm they fail, and the change was applied to the consumer's real review-core entry in scratch. The full doctor runner closed the work. Last, the consumer's re-pin was rehearsed with its own vendored `overlay-engine.cjs repin --stage`, from its pin to a scratch commit of these changes, on a copy of its tree. The first round landed on main as six commits and a merge, pushed as `067d72028ef`. The follow-ups were built in the same worktree, proven on a clean clone where CI was involved, and landed as a fast-forward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Port the consumer's Code Mode filter as written | The client is cached once, so a manual added by `register_manual` survives later calls and no other handler needed a change |
| Match the consumer's Pi overlays byte for byte | A byte match is what lets the overlay go. The operator keeps `llmgateway` through `~/.pi/agent`, which the project file merges over |
| Gate source-repo tests on the origin remote | `sourceStatus` compares the origin remote to the manifest's source repository, and neither the install-state classifier nor the profile loader reads it |
| Leave `symlink-engine.test.cjs` unchanged | Its 9 vendored failures come from the consumer's own overlay of that test, engine and manifest |
| Refuse a missing anchor instead of appending | A silent append would hide that upstream dropped the section the block was meant to precede |
| Move an appended block only when the text before it starts with the base copy | That is exactly the layout an earlier apply wrote, and anything else is refused for a rebase |
| Fail-soft Pi entries rather than a louder check | The operator asked for the easiest install out of the box. Pi has awaited async factories since 0.38.0, so the lazy import keeps every hook on a good tree |
| Catch only the adapter import | An adapter that throws while it registers is a bug, and Pi's own load error is the right report |
| One notice per session through `globalThis`, with a handler per failing entry | Pi evaluates each entry in its own module scope, and a reload can discard the first handler before it runs |
| Read the adapter path back from the entry, not from the registry | The registry has no adapter path, and the entry already names one. Write mode can then migrate an older re-export entry |
| Rename the `/create:sk-skill` assets, not teach the generator an exception | The command contract derives every create asset from the command name, so the old stem was the one outlier. Two tools carried it: the router check flagged it and the advisor scorer special-cased it |
| A new workflow from `/doctor:ci scaffold`, not a job in `pi-extension-tests.yml` | The scaffold never edits a workflow, and the existing one installs each extension package, while this gate needs the repository's own provisioning |
| Type-check three entries, not 22 | Every entry pulls its adapter into tsc, and most adapters use Pi events the local type shim never declared. The three chosen adapters are already in the gate, and the entries differ only in two strings |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Code Mode probe, unpatched | `started at startup: ["live","sleepy"]`, and `register_manual` refuses with "already registered" |
| Code Mode probe, patched | `started at startup: ["live"]`, then `sleepy.sleepy.ping` listed after `register_manual` and still listed on the next call |
| `sk-skill-check` on mcp-mobbin and mcp-refero | `NO FINDINGS (1 UNKNOWN)` for both |
| `cmp` of both `.pi` files against the consumer's overlays | No output, byte-identical |
| Seven doctor test files in the worktree | tests 166, pass 166, fail 0, skipped 0 |
| Six fixed files on the vendored copy | tests 141, pass 133, fail 0, skipped 8 (was 24 failures across seven files) |
| Overlay suites (`overlay-engine-*.test.cjs`, overlay contract) | tests 212, pass 212. The five new tests fail on the old engine |
| Consumer's review-core entry with `insertBefore` in scratch | `1 changed`, then `0 changed`, overlay status `RESULT: PASSED`, C3 PASS once the block is one heading level down |
| `run-all.sh` in the worktree | `7 suite(s) passed, 0 failed`, node:test 1327 pass, 0 skipped |
| Comment hygiene on the eight changed code files | exit 0, no output |
| Pi 1.5.0 and 1.5.2 loader on the rendered entries in scratch | Full tree: 22 loaded, 0 errors, 37 handlers, as before. No `.skilled`: 0 errors, one notice for 22 entries, also after two load passes. One missing dependency: one notice naming `ask-surface-guard.ts`. Throwing adapter: `Failed to load extension: adapter factory boom`. Headless: the notice prints on stderr |
| `sync-hook-registrations.cjs --check` | `PASS ... 22 Pi extensions resolve`. Before the write it listed 22 template drifts |
| Parity vitest, sync vitest | 154/154 and 10/10. The template test fails on an entry put back to one line |
| `git-setup-check.cjs --tool pi`, its suite | `pi (active): registered`, 87/87. Before the fix it reported the advisory unregistered |
| `hook-wiring-check.cjs` | Worktree 22 ok, exit 0. Old tree 21 broken, exit 1. Suite 53/53, and the new lazy test fails on the item-5 script |
| `tsc -p tsconfig.pi.json` | exit 0, `--listFiles` names three entries. A planted `notifyy` fails it |
| Comment hygiene on all 44 changed code files | exit 0, and a planted `REQ-007` comment fails it |
| `run-all.sh` after items 5 and 6 | `7 suite(s) passed, 0 failed`, node:test 1331 pass, 0 skipped (1327 before). The first run failed one test because the advisor dist was stale after the `prompt-advisor.ts` comment edit. Rebuilding it, as the message said, cleared it |
| spec-kit vitest, root project | 111 files, 1495 passed, 13 skipped, exit 0 |
| spec-kit vitest, cli project, first round | 2591 passed, 1 failed, 20 skipped. The failure was the codex command-router drift on `create/sk-skill.md`, closed in the follow-ups |
| Consumer re-pin rehearsal, manifest unchanged | First refused: six doctor test files the consumer edited in place, with no overlay. With those restored from the old pin: `RESULT: BLOCKED`, 12 blocked entries. Six come from main since the consumer's pin. Six are this packet's: the hook registry `json-entry`, Mobbin, Refero and the three item-5 overlays. Five more report `equals-upstream`: both `.pi` files, Code Mode `index.ts`, `doctor-setup.yaml` and its presentation |
| Rehearsal after the drops and rebases | Dropping an entry alone is refused, because its old bytes stay as an unowned edit. Dropped entries restored from the old pin: `RESULT: STAGED`, exit 0. Then `overlay-engine status` `RESULT: PASSED`, `hook-wiring-check` exit 0 with 22 Pi entries ok, `sync --check` PASS on the 37-hook registry, the loader 24 loaded, 0 errors, 0 notices, and `git-setup-check --tool pi` all 11 checks PASS |
| Doctor suite on the re-pinned copy | Before the two consumer fixes: pass 1295, fail 10, skipped 28. Nine failures sit in the consumer's own `symlink-engine` test overlay, one is the stale advisor dist. After the `REPO RULES.md` fixture line and `npm run build`: pass 1305, fail 0, skipped 28, exit 0 |
| Consumer review-core with `insertBefore` after the re-pin | Block placed before `## 10. RELATED RESOURCES`, which stays last, with no stray separator |
| Negative control for dropping the item-5 overlay | With `hooks/shared/hook-flags.mjs` hidden on the re-pinned copy, the consumer's old `hook-wiring-check.cjs` exits 0 and names nothing. The shipped one exits 1 with 16 `pi-extension-broken` lines, and the loader shows one notice naming the same 16 entries |
| Main after the first merge | `run-all.sh` failed one test, which reported the advisor dist stale against the merged source. After `npm run build`: `7 suite(s) passed, 0 failed`, 1331 pass. Strict validation `RESULT: PASSED`. Trigger index `--check` 0 stale documents |
| Push of the first round | GitHub's rule-suite log reads `bypass` for `ee54e3183db..067d72028ef`: pull request, linear history, code scanning, signed commits and the message-contract check failed and were bypassed. All 30 pushes to main that week read `bypass` |
| No-token Code Mode probe on the shipped entries | Shipped dist, empty `HOME`, an `npx` shim that logs each call: `{"tools":[]}` and no `npx` call. With `mobbin` enabled: `npx -y mcp-remote https://api.mobbin.com/mcp`, twice with the retry |
| Live registration after the operator picked Ready | `register_manual` gave `success: true` for `clickup_official` (67 tools), `mobbin` (8) and `refero` (10), all listed again on the next `list_tools`. Each connected from a token cached under `~/.mcp-auth` |
| Pi 1.5.2 live session, RPC mode, `--offline` | A tree with `.pi/` and no `.skilled/`: one `notify` naming 22 entries that are off and no `Failed to load extension`. The full worktree: no notice and no load error |
| Stale-wording grep and `sk-skill-check` on the three modes | No stale claim outside changelogs. `Result: NO FINDINGS (1 UNKNOWN)` on each mode, the same as before the edit. `bash -n` exit 0 on both scripts |
| Backup-path case | Passes with the `.gitignore` line, fails without it |
| CI recipe on a clean clone | Before provisioning: tsc exit 0, wiring check exit 1 naming `packet-purpose.js`. After `provision_worktree`: both exit 0. `ci-report` row with no flags. `check-gate-inputs.sh` `RESULT: PASSED` |
| Router drift after the rename | `routers=42 clean=42 path-drift=0`. `typo-flags.vitest.ts` 34/34, roster tests 15/15, advisor transcript tests 359/359. Before removing the old stem the transcript test failed 2 |
| `run-all.sh` in the worktree after the follow-ups | `7 suite(s) passed, 0 failed`, node:test tests 1332, pass 1332, fail 0, skipped 0, exit 0 |
| spec-kit vitest, cli project, after the follow-ups | 209 files passed, 3 skipped. 2592 tests passed, 20 skipped, 0 failed, exit 0. The first-round codex router failure is closed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The sign-in tab was not seen opening.** The live registrations connected from cached tokens, so the tab path on a first approval is inferred from `mcp-remote` behavior, not observed here.
2. **Cached tokens no longer auto-connect.** ClickUp, Mobbin and Refero register only through each mode's ask step, even for a developer who already approved them.
3. **Numbering in the consumer's block.** A block placed before a numbered RELATED RESOURCES must use headings one level down, or the section numbering check fails.
4. **Fail-soft helps only trees that carry it.** A consumer gets the notice once its `.pi/extensions` entries are the rendered ones. A tree that still has one-line entries keeps the 22 load errors.
5. **A broken adapter in the source repo is a warning.** The notice names it, and `hook-wiring-check.cjs` and `doctor:git` still fail on it, but Pi no longer refuses the extension.
6. **The notice is seen in RPC mode only.** A live Pi 1.5.2 session in RPC mode sent it as one `notify` request. How the TUI draws it is not observed.
7. **The re-pin rehearsal is a stage on a scratch commit.** The stage itself skips the manifest's regenerate and verify steps. The `overlay-engine apply` run afterwards in the staged tree wrote one file, so it ran all ten regenerate steps, none failed, and then the twelve verify checks. Ten passed. The consumer's two checks failed only because `pin.checkout` named the real checkout, and both passed when rerun by hand against the scratch clone. The six blocked entries from main were rebased mechanically, keeping the consumer's copy where `git merge-file` conflicted. The consumer rebases those by hand.
<!-- /ANCHOR:limitations -->

---
