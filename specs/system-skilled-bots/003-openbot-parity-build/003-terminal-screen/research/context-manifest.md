# Context manifest for the terminal screen

This phase's reference material lives in two gitignored folders: `context/` in this phase and `specs/system-skilled-bots/context/` (`.gitignore:417-421` ignores `specs/**/context/`). A builder in a fresh worktree has neither. This file is the tracked record of what was in them, where each piece came from, and how to rebuild them. It carries no third-party image and no capture. It follows operator default A3: commit a manifest instead of the images, and every check that points into `context/` skips by name when the folder is absent.

`research/fable-review-1.md` R13 and section 5 call this file `research/ui-reference-manifest.md`. This is that file under the name the orchestrator chose. Do not create a second one.

**What a builder needs from `context/`: nothing.** The frames, the key map, the glyph table and the component inventory in `001-ux-and-component-map/design/` are tracked and are the contract. Everything below is for a reviewer, the operator, or a later recapture.

How the values here were collected, on 2026-11-25, in the worktree `system-skilled-bots`:

- Every sha256 is the output of `shasum -a 256` on the local file. For a symlink it is the hash of the file the link resolves to.
- Every licence named "read locally" comes from the first lines of that repo's `LICENSE` file. Every licence named "per INDEX" is copied from the gitignored `context/screenshots/INDEX.md` and was not re-checked at the source. It is the project's licence, which is not always a statement about one image.
- In this worktree `specs/system-skilled-bots/context` is a symlink to the same folder in the primary checkout, which is why the reference repos are present here at all.

---

## 1. Reference images

**Inclusion rule.** One row per image that a doc in this phase names, or that the sweep looked at and used for a frame. That is: the four root images `mockups.md` section 5 names, every image named in `research/ui-references.md` section 1, the images `fable-review-1.md` section 5 pairs with frames, and the images INDEX.md marks as seen and used. The other images in `web/` (78 of 112) and in `products/` (68 of 74 links) were collected but informed nothing in the tracked docs. The local INDEX.md lists them.

Paths are relative to `context/screenshots/`. "Rank" is the rank in `research/ui-references.md` section 1. A source URL of UNKNOWN means INDEX.md gives no URL: the file is a symlink into a local repo copy, and the row names the repo path instead. Rebuild those from the repo (section 3, step 3).

| Id | Local path | Source URL | Licence or terms | sha256 | Frame or doc it informed |
|----|------------|------------|------------------|--------|--------------------------|
| I01 | `openmaus-approval-card.png` | UNKNOWN (local repo file `docs/screenshots/approval-card.png`, upstream https://github.com/milind-soni/OpenMausBot) | Apache-2.0 (repo LICENSE, read locally) | `22698859ac78586be8d3690cbc3f1ed660df0a2a98450adafbe61cf394284092` | Frames 18 to 24, the choice overlay order (mockups section 5) |
| I02 | `openmaus-moca-282-expired-card-ios.jpg` | UNKNOWN (local repo file `docs/screenshots/moca-282-expired-card-ios.jpg`, upstream https://github.com/milind-soni/OpenMausBot) | Apache-2.0 (repo LICENSE, read locally) | `7b10dc876a9e84303dfb0cd41a95a178610504857459b5cbc36a34b08b3208c7` | Frame 22 and the expired inbox row (mockups section 5) |
| I03 | `openmaus-tasks-routines.png` | UNKNOWN (local repo file `docs/screenshots/tasks-routines.png`, upstream https://github.com/milind-soni/OpenMausBot) | Apache-2.0 (repo LICENSE, read locally) | `7ec52ae40bb91c10daa98d3ac3fb43e03aba1ea3967bece9eef86d4c7a5849ef` | Frame 14, the Routines empty state (mockups section 5) |
| I04 | `rakazo-routines.png` | UNKNOWN (local repo file `docs/screenshots/readme/routines.png`, upstream https://github.com/elie222/rakazo) | Apache-2.0 (repo LICENSE, read locally) | `548f0d4ab015de066d500cd6427d6f9554690b90ea0d8018cd5ba8115efd3a8f` | Frames 3 and 13 to 16, the trigger summary order (mockups section 5, ui-references rank 17) |
| I05 | `products/OpenMausBot-main/01-empty.png` | UNKNOWN (local repo file `docs/screenshots/automations-journey/01-empty.png`) | Apache-2.0 (repo LICENSE, read locally) | `ca64ee4a452fe5b5be501afbb60acf106636c969115c17123fd7613a38df92c1` | Empty states, frames 6, 10 and 14 (ui-references rank 6) |
| I06 | `products/OpenMausBot-main/after-stop-sidebar-says-denied.png` | UNKNOWN (local repo file `docs/verification/images/ui-approval-status/after-stop-sidebar-says-denied.png`) | Apache-2.0 (repo LICENSE, read locally) | `34b165386705405fa59a3e8de292435abf948c74abb716eef1c95fffecbc491a` | Adopt item 4, the outcome word after an answer (ui-references rank 6) |
| I07 | `products/OpenMausBot-main/moca-148-stop-ios.jpg` | UNKNOWN (local repo file `docs/screenshots/moca-148-stop-ios.jpg`) | Apache-2.0 (repo LICENSE, read locally) | `657d778cfb4a54e2062c25a22cf6b12b3e86c1d143813d676063e22e7e008858` | Seen in the sweep, the working-run state (INDEX section 4) |
| I08 | `products/OpenMausBot-main/18-calendar-needs-you.png` | UNKNOWN (local repo file `docs/screenshots/automations-journey/18-calendar-needs-you.png`) | Apache-2.0 (repo LICENSE, read locally) | `6b0f28b09e5651ca3d13aff30ac1880fefe33fc6b6de303bb60a155c4ad56f78` | Seen in the sweep, scheduled runs (INDEX section 4) |
| I09 | `products/turnstone-main/09-workstream-states.png` | UNKNOWN (local repo file `docs/diagrams/png/09-workstream-states.png`, upstream https://github.com/turnstonelabs/turnstone) | Apache-2.0 (repo LICENSE, read locally) | `d98902e7d9e9ac843fda8d5d2b9705456a5b198ec2739cfe83765d2a17c5e5df` | The needs_you state as its own group (ui-references rank 20) |
| I10 | `products/hermes-muse-main/muse-dashboard-overview.png` | UNKNOWN (local repo file `docs/images/muse-dashboard-overview.png`, upstream https://github.com/xiaohei-info/hermes-muse) | MIT (repo LICENSE, read locally) | `a904596831d485d84ad5772a33441dd33639d3332c8503ce09335f5df3566ee0` | Tab counts, declined for the Inbox tab (ui-references rank 23) |
| I11 | `web/ratatui/tabs.gif` | https://raw.githubusercontent.com/ratatui/ratatui/images/examples/tabs.gif | MIT (project, per INDEX) | `cf8922902bfb3209fa91ab002fd7f1e6127fa1ff8e575b60ce939b8212ec0a4f` | Tab bar, frames 1 to 4 (ui-references rank 24) |
| I12 | `web/ratatui/popup.gif` | https://raw.githubusercontent.com/ratatui/ratatui/images/examples/popup.gif | MIT (project, per INDEX) | `6dc2d3a492970d4c78c25d8de2ee7c0a091115ebd23631eb08f3f25142ac8d3e` | Clear-then-draw overlay, frames 18 to 25 (rank 24) |
| I13 | `web/ratatui/table-detail-tea.gif` | https://raw.githubusercontent.com/ratatui/ratatui/images/examples/table-detail-tea.gif | MIT (project, per INDEX) | `ff884a6598aa35dd48f78288c993f4a913b5f6aa170ed3687029faccb0620e84` | List plus detail and the update loop (rank 24) |
| I14 | `web/ratatui/panic.gif` | https://raw.githubusercontent.com/ratatui/ratatui/images/examples/panic.gif | MIT (project, per INDEX) | `49cf1e551468518390fa1aa5b9255c070cd1f24db55ec630797c866e1354e7b9` | The terminal guard and panic restore in 002 (rank 24, fable-review-1 section 5) |
| I15 | `web/gitui/cmdbar.gif` | https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/cmdbar.gif | MIT (project, per INDEX) | `12702710a8ceafcd56644cb05dd465733cf494f328e06ab0c59233ab8ba70c84` | Footer per context (rank 11) |
| I16 | `web/gitui/discard-changes-on-checkout.png` | https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/discard-changes-on-checkout.png | MIT (project, per INDEX) | `d7ced60940bebbcb8f0d2e75f500dfd9063925e1fd7eff8e7e8f6f3320dca16f` | Footer swaps to the overlay keys (rank 11) |
| I17 | `web/gitui/bad-credentials.png` | https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/bad-credentials.png | MIT (project, per INDEX) | `46feeb36a5b30a33dbb8498889138f67256dab4462ef63ab17d6df8015056244` | Avoid list, no error modal (rank 11) |
| I18 | `web/gitui/spinner.gif` | https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/spinner.gif | MIT (project, per INDEX) | `ec926ba31df13d663f37c8660769ca4b7ea5457442e5ba61fc6c627de5323264` | Frame 20, `sending` (rank 11) |
| I19 | `web/k9s/screen_po.png` | https://raw.githubusercontent.com/derailed/k9s/HEAD/assets/screen_po.png | Apache-2.0 (project, per INDEX) | `ca7db5d265effa61ee7d3e656f108f0edcbdcbc05e62ffabef598eace7628ab3` | Avoid list, colour as the only signal (rank 14) |
| I20 | `web/btop/tty.png` | https://raw.githubusercontent.com/aristocratos/btop/HEAD/Img/tty.png | Apache-2.0 (project, per INDEX) | `22c959eab13416a2bdb9fd8984bfd0566980b9d6897d8fc83523991b1f9dc5f0` | System palette from named ANSI colours (rank 12, adopt item 10) |
| I21 | `web/btop/help-menu.png` | https://raw.githubusercontent.com/aristocratos/btop/HEAD/Img/help-menu.png | Apache-2.0 (project, per INDEX) | `9b2a2b08e3f3c6dc2e67dc4c78fc31d252bfe28d745ad7e5e91daaac35449682` | Help as a key table, frame 26 (rank 12) |
| I22 | `web/bottom/process_kill_simple.webp` | https://raw.githubusercontent.com/ClementTsang/bottom/HEAD/docs/content/assets/screenshots/process/process_kill_simple.webp | MIT (project, per INDEX) | `670dbc90ada18095d695b1631d2314da2b5cc7abdaa93dbd19ba271261c1c437` | Overlay frames 18 to 24, no preselected Yes (rank 13) |
| I23 | `web/gh-dash/pr-sections.png` | https://raw.githubusercontent.com/dlvhdr/gh-dash/HEAD/docs/src/assets/pr-sections.png | MIT (project, per INDEX) | `05f43e7bf738d5a174e1cedf570538c5876787a85eb66879d2ae56383d7e3a9a` | Tab counts, declined (rank 10) |
| I24 | `web/gh-dash/help.png` | https://raw.githubusercontent.com/dlvhdr/gh-dash/HEAD/docs/src/assets/help.png | MIT (project, per INDEX) | `7536f8f0ce22dabe209a5121ed4a51d5f3fa224ddc3bb5fc55e9fa39b495b388` | Frame 25 help in columns and the `[` `]` pair (rank 10, fable-review-1 section 5) |
| I25 | `web/posting/empty.png` | https://raw.githubusercontent.com/darrenburns/posting/HEAD/docs/assets/history/empty.png | Apache-2.0 (project, per INDEX) | `118a3c8a6b58ed31faa97377b5a164f71a83eb5175725b628d42f9eb4d61fbb8` | Empty frames 6, 10 and 14 (rank 9, fable-review-1 section 5) |
| I26 | `web/aerc/aerc.png` | https://static.lwn.net/images/2024/aerc.png | UNKNOWN (hosted by LWN, the MIT in INDEX is the aerc code licence) | `98f1ab7debf7c8992ef5944de91f69e2007d8cb0874adfb354be6879a3703657` | Status line state (rank 22) |
| I27 | `web/codex/codex-cli-splash.png` | https://raw.githubusercontent.com/openai/codex/HEAD/.github/codex-cli-splash.png | Apache-2.0 (project, per INDEX) | `1c366cb14ee604f12365458cc62045c51d5e0edbff43b77aa2e2bb9e2ecea19f` | Footer of `key word` pairs (section 2 of ui-references) |
| I28 | `web/claude-code/permission-prompt-bash-light.png` | https://mintcdn.com/claude-code/oa7CKjMeIChox26S/images/permission-prompt-bash-light.png?fit=max&auto=format&n=oa7CKjMeIChox26S&q=85&s=87585d008a29304873466399f7b476f6 | UNKNOWN (INDEX reads it as no licence, all rights reserved) | `b9594d1d59546e9934bf14e09d7332a8b0ca7da0cd4c9cd5568e6ed460b1d7bd` | Overlay frames 18 to 24 (rank 3, fable-review-1 section 5) |
| I29 | `web/gemini-cli/theme-ansi-dark.png` | https://raw.githubusercontent.com/google-gemini/gemini-cli/HEAD/docs/assets/theme-ansi-dark.png | Apache-2.0 (project, per INDEX) | `5f577b6ac5b32d2678913b565c818c12704a9e7dcae38595fda3295acaaa8cba` | Scroll marks and the System palette (rank 21) |
| I30 | `web/claude-tasks/476bb9c9-e4d6-4e16-8ee2-9364c6d07aa3.png` | https://github.com/user-attachments/assets/476bb9c9-e4d6-4e16-8ee2-9364c6d07aa3 | UNKNOWN (GitHub attachment, the project has no licence per INDEX) | `f775939aeb345f2d13d648e78ab37c367217cc123c9cba4f7215eee86e28e023` | Routines frames 3 and 13 to 16 (rank 5, fable-review-1 section 5) |
| I31 | `web/process-compose/tui.png` | https://raw.githubusercontent.com/F1bonacc1/process-compose/HEAD/imgs/tui.png | Apache-2.0 (project, per INDEX) | `d9c63f7917fd4f4763213d368d470819613e5bd03809cd57039a77af008aa7b6` | Glyph plus word columns in every list (rank 7, fable-review-1 section 5) |
| I32 | `web/dekit/dekit-tui.png` | https://raw.githubusercontent.com/pvolok/dekit/HEAD/img/dekit-tui.png | MIT (project, per INDEX) | `53b6a3f7e7de40309c204623d192fe98fca386c3e82f8df5674812940a5de601` | The two-line footer (rank 8) |
| I33 | `web/pueue/Pueue-State-Diagram.svg` | https://raw.githubusercontent.com/Nukesor/pueue/HEAD/docs/Pueue-State-Diagram.svg | Apache-2.0 (project, per INDEX) | `4b6baf85743cc8c5f12df2fe486a521a918fea87a61911e0278a797dff5a8ed5` | Check list for the activity groups (rank 27) |
| I34 | `web/agent-of-empires/approval.png` | https://raw.githubusercontent.com/agent-of-empires/agent-of-empires/HEAD/docs/assets/structured-view/approval.png | MIT (project, per INDEX) | `a03bddd995301fc6d349565bd71755164ef2029a3eac8bc0fc830b14af28d76a` | Avoid list, "Always" (rank 27) |
| I35 | `web/agent-of-empires/overview.png` | https://raw.githubusercontent.com/agent-of-empires/agent-of-empires/HEAD/docs/assets/structured-view/overview.png | MIT (project, per INDEX) | `9693f2bb54b724d31b2610f54f10ad6fc9a89592393fa1a284930c633dc15718` | Seen in the sweep, counts in a block title (INDEX section 2) |
| I36 | `web/claude-squad/screenshot.png` | https://raw.githubusercontent.com/smtg-ai/claude-squad/HEAD/assets/screenshot.png | AGPL-3.0 (project, per INDEX), ideas only | `d6346d7d458a8f1bf6c472925fcd256635ff82e42dc1776ceb8ccb56e18e731a` | Footer groups, avoid auto-yes (rank 15) |
| I37 | `web/agent-deck/watcher-doorbell.png` | https://raw.githubusercontent.com/asheshgoplani/agent-deck/HEAD/docs/images/watcher-doorbell.png | MIT (project, per INDEX) | `29a7e818594bf3d741ed04d2375cf2abfe69b70a14f01bb7448d6a7a8138a96a` | The banner as a short count (rank 19) |
| I38 | `web/toad/aca51988-359a-466d-bdd1-050dc3d678ac.png` | https://github.com/user-attachments/assets/aca51988-359a-466d-bdd1-050dc3d678ac | UNKNOWN (GitHub attachment, the project is AGPL-3.0 per INDEX) | `657c54f06ccfeb1c5be28b573160e5783b3603ae621a3efadd3380401cab8cf5` | Palette key at the footer end (rank 16) |
| I39 | `web/hermes-agent/session-orchestrator.png` | https://raw.githubusercontent.com/NousResearch/hermes-agent/HEAD/website/static/img/docs/tui-session-orchestrator/session-orchestrator.png | MIT (project, per INDEX) | `45cfb7f3678002a8a88be6fb409ac8b9c23d49018bc23a092450d6a16b4cb02d` | Overlay keys drawn inside the overlay (rank 4) |
| I40 | `web/hermes-agent/11-drawer-gave-up.png` | https://raw.githubusercontent.com/NousResearch/hermes-agent/HEAD/website/static/img/kanban-tutorial/11-drawer-gave-up.png | MIT (project, per INDEX) | `57d37fcc54ff85f83a0a0772d37693f6f28f609eabefdf9413a80d75cad8e205` | Failure reason beside the row, absent-value wording (rank 4) |
| I41 | `web/hermes-agent/10-drawer-in-flight.png` | https://raw.githubusercontent.com/NousResearch/hermes-agent/HEAD/website/static/img/kanban-tutorial/10-drawer-in-flight.png | MIT (project, per INDEX) | `3ae0bb90387ea932b89d6c2e625b1ec399dc308c9fceb316afe371e48e50da28` | Detail fields for a working row (rank 4) |
| I42 | `web/openbot/plugins-3x.png` | https://open.bot/assets/product/plugins-3x.png | UNKNOWN (hosted by open.bot, the MIT in INDEX is the repo licence) | `7cb90c40f08d2e3b96e97c49ff7af68b07e65399bdafce6c79e7252d0c71186d` | No frame, cited as the only product picture (rank 25) |
| I43 | `web/openbot/plugins-3x-dark.png` | https://open.bot/assets/product/plugins-3x-dark.png | UNKNOWN (hosted by open.bot, the MIT in INDEX is the repo licence) | `d59ed070c35fe499dc8db84b3a79f2ed0d44f7766b51ff511809a39a0d2f6fa5` | No frame, cited as the only product picture (rank 25) |
| I44 | `web/openhuman/layer-one.png` | https://tinyhumans.ai/images/openhuman/layer-one.png | UNKNOWN (hosted by tinyhumans.ai, the project is GPL-3.0) | `9e690bbe4dcef3a49952d0bfb3f7099ae62885c11c52642198337023e06dba09` | Last run outcome beside the routine (section 2 of ui-references) |

### References with no local file

Ranks 1 and 2 shaped frames 1, 5 to 8 and 18 to 24, but they are text snapshot files in `openai/codex` (Apache-2.0 per `ui-references.md`), not images, and none was downloaded. They point at `main`, so they move. No commit was recorded.

| Id | Source | Frame it informed |
|----|--------|-------------------|
| S01 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__command_center__live_center_columns.snap | Activity frames 1 and 5 to 8: groups, counts, the selection mark |
| S02 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__command_center__live_center_keeps_status_order_across_progress_refreshes.snap | Adopt item 1, stable group order across refreshes |
| S03 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__actions__hiding_tasks_keeps_selection_adjacent_in_display_order.snap | Adopt item 1, next-row selection |
| S04 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__command_center__live_center_help_two_columns.snap | Frame 26, help in columns |
| S05 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/bottom_pane/snapshots/codex_tui__bottom_pane__approval_overlay__tests__network_exec_prompt.snap | Overlay frames 18 to 24, the order inside the overlay |
| S06 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/bottom_pane/snapshots/codex_tui__bottom_pane__approval_overlay__tests__approval_overlay_permissions_prompt.snap | Overlay frames 18 to 24, the key in each option row |
| S07 | https://raw.githubusercontent.com/openai/codex/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__actions__archive_task_failure.snap | Frames 21 and 22, one next-step line |

`ui-references.md` writes these, and most image sources, as `github.com/.../blob/...` pages. Those return HTML, so the table above and the recipe use the `raw.githubusercontent.com` form.

---

## 2. Reference repos

One row per folder under `specs/system-skilled-bots/context/` that a doc in this phase cites. `buzz-main` is in that folder and no doc in this phase cites it, so it has no row. "Folder date" is the folder's modification time, which is a hint for when it was downloaded, not a recorded download date.

| Repo folder | Upstream URL and where it was found | Commit or version | Licence file | Cited by |
|-------------|-------------------------------------|-------------------|--------------|----------|
| `OpenBot-main` | https://github.com/CopilotKit/OpenBot (its `README.md`) | No commit recorded (no `.git`). `package.json` version 1.1.3. Folder date 2026-11-24 | `LICENSE`: MIT, Copyright (c) 2026 CopilotKit | 001 design files and `tasks.md`, 004 `spec.md` and `tasks.md` |
| `OpenGhost-main` | https://github.com/ANDRETRIPOL/OpenGhost (its `README.md`) | No commit recorded. `package.json` version 1.5.7. Folder date 2026-11-22 | `LICENSE`: MIT, Copyright (c) 2026 Andrew | 001 design files and `tasks.md`, 005 `tasks.md` |
| `openhuman-main` | https://github.com/tinyhumansai/openhuman (its `README.md`) | No commit recorded. Workspace version 0.64.20 (`Cargo.toml:33`). Folder date 2026-11-24. `crates/openhuman-tui/` and `LICENSE` are byte-identical to `openhuman-full` at commit `68b725f3a5382a103a3f48002b23eb6325d61637` (`diff -rq` printed nothing, `diff -q` on `LICENSE` matched), so every pointer into those two may be pinned to that commit. The rest of the tree was not compared | `LICENSE`: GNU General Public License version 3 | Parent `spec.md`, all six children, `fable-review-1.md` |
| `openhuman-full` | https://github.com/tinyhumansai/openhuman (its git `origin`) | Git clone at `68b725f3a5382a103a3f48002b23eb6325d61637`, 2026-11-24, "Merge pull request #8777". Shallow, submodules checked out, clean tree | `LICENSE`: GNU General Public License version 3 | No pointer. It is the build source of the demo frames (section 4) |
| `OpenMausBot-main` | https://github.com/milind-soni/OpenMausBot (its `package.json` and `README.md`) | No commit recorded. `package.json` version 0.1.178. Folder date 2026-11-24 | `LICENSE`: Apache License 2.0. `LICENSING.md` names one carve-out, the `enterprise/` folder, which INDEX.md calls source-available. No cited file is under `enterprise/` | 001 design files, images I01 to I03 and I05 to I08 |
| `rakazo-main` | https://github.com/elie222/rakazo (its `package.json`) | No commit recorded. `package.json` version 0.1.0. Folder date 2026-11-24 | `LICENSE`: Apache License 2.0, with a `NOTICE` file | 001 design files, image I04 |
| `turnstone-main` | https://github.com/turnstonelabs/turnstone (its `README.md` and `pyproject.toml`) | No commit recorded. `pyproject.toml` version 1.9.4. Folder date 2026-11-12 | `LICENSE`: Apache License 2.0, with a `NOTICE` file | 001 design files, 004 `spec.md`, image I09 |
| `tinychannels-main` | https://github.com/tinyhumansai/tinychannels (its git `origin`) | Git clone at `a1d0cfffc8c8cad263d66bce8e361f1da6d1752c`, 2026-11-13, release 0.2.1. That is the same commit `openhuman-full` pins as `vendor/tinychannels` | `LICENSE`: GNU General Public License version 3 | `fable-review-1.md` R12 only (`LICENSE:1`) |
| `hermes-muse-main` | https://github.com/xiaohei-info/hermes-muse (from `ui-references.md` rank 23, and its `README.md` install line names `xiaohei-info/hermes-muse`) | No commit recorded. `plugin.yaml` version 0.5.4. Folder date 2026-11-13 | `LICENSE`: MIT, Copyright (c) 2026 xiaohei-info | Image I10 only |

**Pointer check on 2026-11-25.** I extracted every `specs/system-skilled-bots/context/<path>:<line>` pointer from the 49 markdown files in this phase outside `context/`, which gave 49 unique pointers. Every file exists and no pointer's last line is past the end of its file.

### Phase-local links

This phase's own `context/` holds twelve links into the repos above and one folder of old docs. All twelve resolved on 2026-11-25. Rebuild them with section 3, step 4.

| Link in `context/` | Target |
|--------------------|--------|
| `openbot-activity-groups.ts` | `../../../context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts` |
| `openbot-approvals` | `../../../context/OpenBot-main/app/src/components/approvals` |
| `openbot-needs-you` | `../../../context/OpenBot-main/app/src/components/needs-you` |
| `openbot-routines` | `../../../context/OpenBot-main/app/src/components/routines` |
| `openghost-approval-card.js` | `../../../context/OpenGhost-main/approval-card.js` |
| `openghost-ask-card.js` | `../../../context/OpenGhost-main/ask-card.js` |
| `openhuman-tui` | `../../../context/openhuman-main/crates/openhuman-tui` |
| `openmaus-ActivityPanel.tsx` | `../../../context/OpenMausBot-main/src/components/ActivityPanel.tsx` |
| `openmaus-ApprovalCard.tsx` | `../../../context/OpenMausBot-main/src/components/ApprovalCard.tsx` |
| `rakazo-routine-list.tsx` | `../../../context/rakazo-main/apps/web/src/pages/routines/RoutineList.tsx` |
| `turnstone-cli.py` | `../../../context/turnstone-main/turnstone/cli.py` |
| `turnstone-colors.py` | `../../../context/turnstone-main/turnstone/ui/colors.py` |

`context/legacy-003/` holds the five pre-expansion docs. All five are byte-identical to the versions in git at `6b4031c150e^` (the parent of "expand the terminal screen phase into six planned children"), so `git show 6b4031c150e^:specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/<name>.md` recovers each one. The names are `spec`, `plan`, `tasks`, `acceptance-criteria` and `goal`.

### Read first, per child

From `fable-review-1.md` section 5. On 2026-11-25 every file exists and every cited range ends inside the file.

| Child | File | Lines to read | File length | Licence |
|-------|------|---------------|-------------|---------|
| 002 | `.skilled/bin/bots.cjs` (tracked) | 113 to 148, 292 to 301, 461 to 473 | 549 | ours |
| 002 | `.skilled/skills/system-skilled-bots/runtime/lib/status.ts` (tracked) | 68 to 114 | 491 | ours |
| 002 | `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` (tracked) | 24 to 60 | 346 | ours |
| 002 | `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` (tracked) | 58 to 95 | 120 | ours |
| 002 | `turnstone-main/turnstone/cli.py` | 431 to 447 | 2285 | Apache-2.0 |
| 002 | ratatui panic and popup examples, images I11 to I14 | whole | none | MIT. Not the openhuman guard (R12) |
| 003 | `turnstone-main/turnstone/ui/colors.py` | 4 to 6 | 89 | Apache-2.0 |
| 003 | demo frames `80x24-01-start.txt` and `80x24-06-palette.txt` (section 4) | whole | 24 each | GPL-3.0 program output, layout only |
| 003 | gh-dash, image I24 | whole | none | MIT |
| 004 | `OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts` | 17 to 41 | 199 | MIT |
| 004 | `OpenMausBot-main/src/components/ActivityPanel.tsx` | 34 to 50 | 185 | Apache-2.0 |
| 004 | `OpenBot-main/app/src/components/routines/routines-list.tsx` | 57 to 61 | 344 | MIT |
| 004 | `rakazo-main/apps/web/src/pages/routines/RoutineList.tsx` | 15 to 30 | 222 | Apache-2.0 |
| 004 | `OpenBot-main/app/src/components/needs-you/board.tsx` | 161 | 328 | MIT |
| 005 | `OpenGhost-main/approval-card.js` | 129 to 140, 182 to 190 | 331 | MIT |
| 005 | `OpenGhost-main/ask-card.js` | 264 to 268 | 378 | MIT |
| 005 | `OpenBot-main/app/src/components/approvals/inline-approval.tsx` | 77 to 81 | 265 | MIT |
| 005 | `OpenMausBot-main/src/components/ApprovalCard.tsx` | 93 to 95 | 598 | Apache-2.0 |
| 005 | `turnstone-main/turnstone/cli.py` | 476 to 487 | 2285 | Apache-2.0 |
| 006 | none | | | |

Paths without a leading `.skilled/` are under `specs/system-skilled-bots/context/`. Per R12, a worker that writes `terminal.rs`, `theme.rs` or the overlay is not given any openhuman or tinychannels path.

---

## 3. Fetch recipe

Documentation only. Nobody has run it. It reads the data blocks at the end of this section, so the URLs and the hashes live in one place. A mismatch is reported per file and the recipe keeps going, because most URLs point at `HEAD` or `main` and an upstream change alters the bytes. A mismatch means the image changed upstream, not that the fetch failed.

On this machine the quickest restore is to link the primary checkout's folder (`ln -s "<primary checkout>/specs/system-skilled-bots/context" specs/system-skilled-bots/context`), which is what this worktree does. The steps below are for a machine without one.

````bash
cd "$(git rev-parse --show-toplevel)"
T=specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen
CTX=specs/system-skilled-bots/context
M=$T/research/context-manifest.md
DEST=$T/context/screenshots
TMP=$(mktemp -d)

block() {
  awk -v b="<!-- begin $1 -->" -v e="<!-- end $1 -->" '
    $0 == b { f = 1
      next }
    $0 == e { f = 0 }
    f && $0 !~ /^```/ { print }
  ' "$M"
}

# Step 1. Download the images that have a URL.
mkdir -p "$DEST"
block urls > "$TMP/urls"
while read -r path url
do
  mkdir -p "$DEST/$(dirname "$path")"
  curl -fsSL --max-filesize 5000000 -o "$DEST/$path" "$url" || echo "FETCH-FAILED $path"
done < "$TMP/urls"

# Step 2. Restore the reference repos. No commit is recorded for most,
# so this takes today's default branch and line numbers may have moved.
# openhuman is pinned to the commit the demo frames were built from.
mkdir -p "$CTX"
block repos > "$TMP/repos"
while read -r dir url ref
do
  git clone --quiet "$url" "$CTX/$dir" || echo "CLONE-FAILED $dir"
  if [ "$ref" != "-" ]
  then
    git -C "$CTX/$dir" checkout --quiet "$ref" || echo "CHECKOUT-FAILED $dir $ref"
  fi
done < "$TMP/repos"

# Step 3. Recreate the image links into the repos.
block links > "$TMP/links"
while read -r path target
do
  mkdir -p "$DEST/$(dirname "$path")"
  ln -sfn "$target" "$DEST/$path"
done < "$TMP/links"

# Step 4. Recreate the phase-local links and the old docs.
block phase-links > "$TMP/phase-links"
while read -r name target
do
  ln -sfn "$target" "$T/context/$name"
done < "$TMP/phase-links"
mkdir -p "$T/context/legacy-003"
for name in spec plan tasks acceptance-criteria goal
do
  git show "6b4031c150e^:$T/$name.md" > "$T/context/legacy-003/$name.md"
done

# Step 5. Verify every image hash. Only lines that are not OK print.
block sha256-images > "$TMP/sha"
(cd "$DEST" && shasum -a 256 -c "$TMP/sha" 2>&1) | grep -v ': OK$'

# Step 6. Rerun the pointer check from section 5 edit 1 to see which
# line numbers moved in the repos restored at today's branch.
rm -rf "$TMP"
````

The recipe does not rebuild `INDEX.md` or the 78 images outside the inclusion rule. The demo frames are section 4.

<!-- begin urls -->
```text
web/ratatui/tabs.gif https://raw.githubusercontent.com/ratatui/ratatui/images/examples/tabs.gif
web/ratatui/popup.gif https://raw.githubusercontent.com/ratatui/ratatui/images/examples/popup.gif
web/ratatui/table-detail-tea.gif https://raw.githubusercontent.com/ratatui/ratatui/images/examples/table-detail-tea.gif
web/ratatui/panic.gif https://raw.githubusercontent.com/ratatui/ratatui/images/examples/panic.gif
web/gitui/cmdbar.gif https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/cmdbar.gif
web/gitui/discard-changes-on-checkout.png https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/discard-changes-on-checkout.png
web/gitui/bad-credentials.png https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/bad-credentials.png
web/gitui/spinner.gif https://raw.githubusercontent.com/gitui-org/gitui/HEAD/assets/spinner.gif
web/k9s/screen_po.png https://raw.githubusercontent.com/derailed/k9s/HEAD/assets/screen_po.png
web/btop/tty.png https://raw.githubusercontent.com/aristocratos/btop/HEAD/Img/tty.png
web/btop/help-menu.png https://raw.githubusercontent.com/aristocratos/btop/HEAD/Img/help-menu.png
web/bottom/process_kill_simple.webp https://raw.githubusercontent.com/ClementTsang/bottom/HEAD/docs/content/assets/screenshots/process/process_kill_simple.webp
web/gh-dash/pr-sections.png https://raw.githubusercontent.com/dlvhdr/gh-dash/HEAD/docs/src/assets/pr-sections.png
web/gh-dash/help.png https://raw.githubusercontent.com/dlvhdr/gh-dash/HEAD/docs/src/assets/help.png
web/posting/empty.png https://raw.githubusercontent.com/darrenburns/posting/HEAD/docs/assets/history/empty.png
web/aerc/aerc.png https://static.lwn.net/images/2024/aerc.png
web/codex/codex-cli-splash.png https://raw.githubusercontent.com/openai/codex/HEAD/.github/codex-cli-splash.png
web/claude-code/permission-prompt-bash-light.png https://mintcdn.com/claude-code/oa7CKjMeIChox26S/images/permission-prompt-bash-light.png?fit=max&auto=format&n=oa7CKjMeIChox26S&q=85&s=87585d008a29304873466399f7b476f6
web/gemini-cli/theme-ansi-dark.png https://raw.githubusercontent.com/google-gemini/gemini-cli/HEAD/docs/assets/theme-ansi-dark.png
web/claude-tasks/476bb9c9-e4d6-4e16-8ee2-9364c6d07aa3.png https://github.com/user-attachments/assets/476bb9c9-e4d6-4e16-8ee2-9364c6d07aa3
web/process-compose/tui.png https://raw.githubusercontent.com/F1bonacc1/process-compose/HEAD/imgs/tui.png
web/dekit/dekit-tui.png https://raw.githubusercontent.com/pvolok/dekit/HEAD/img/dekit-tui.png
web/pueue/Pueue-State-Diagram.svg https://raw.githubusercontent.com/Nukesor/pueue/HEAD/docs/Pueue-State-Diagram.svg
web/agent-of-empires/approval.png https://raw.githubusercontent.com/agent-of-empires/agent-of-empires/HEAD/docs/assets/structured-view/approval.png
web/agent-of-empires/overview.png https://raw.githubusercontent.com/agent-of-empires/agent-of-empires/HEAD/docs/assets/structured-view/overview.png
web/claude-squad/screenshot.png https://raw.githubusercontent.com/smtg-ai/claude-squad/HEAD/assets/screenshot.png
web/agent-deck/watcher-doorbell.png https://raw.githubusercontent.com/asheshgoplani/agent-deck/HEAD/docs/images/watcher-doorbell.png
web/toad/aca51988-359a-466d-bdd1-050dc3d678ac.png https://github.com/user-attachments/assets/aca51988-359a-466d-bdd1-050dc3d678ac
web/hermes-agent/session-orchestrator.png https://raw.githubusercontent.com/NousResearch/hermes-agent/HEAD/website/static/img/docs/tui-session-orchestrator/session-orchestrator.png
web/hermes-agent/11-drawer-gave-up.png https://raw.githubusercontent.com/NousResearch/hermes-agent/HEAD/website/static/img/kanban-tutorial/11-drawer-gave-up.png
web/hermes-agent/10-drawer-in-flight.png https://raw.githubusercontent.com/NousResearch/hermes-agent/HEAD/website/static/img/kanban-tutorial/10-drawer-in-flight.png
web/openbot/plugins-3x.png https://open.bot/assets/product/plugins-3x.png
web/openbot/plugins-3x-dark.png https://open.bot/assets/product/plugins-3x-dark.png
web/openhuman/layer-one.png https://tinyhumans.ai/images/openhuman/layer-one.png
```
<!-- end urls -->

<!-- begin repos -->
```text
OpenBot-main https://github.com/CopilotKit/OpenBot -
OpenGhost-main https://github.com/ANDRETRIPOL/OpenGhost -
openhuman-main https://github.com/tinyhumansai/openhuman 68b725f3a5382a103a3f48002b23eb6325d61637
OpenMausBot-main https://github.com/milind-soni/OpenMausBot -
rakazo-main https://github.com/elie222/rakazo -
turnstone-main https://github.com/turnstonelabs/turnstone -
tinychannels-main https://github.com/tinyhumansai/tinychannels a1d0cfffc8c8cad263d66bce8e361f1da6d1752c
hermes-muse-main https://github.com/xiaohei-info/hermes-muse -
```
<!-- end repos -->

<!-- begin links -->
```text
openmaus-approval-card.png ../../../../context/OpenMausBot-main/docs/screenshots/approval-card.png
openmaus-moca-282-expired-card-ios.jpg ../../../../context/OpenMausBot-main/docs/screenshots/moca-282-expired-card-ios.jpg
openmaus-tasks-routines.png ../../../../context/OpenMausBot-main/docs/screenshots/tasks-routines.png
rakazo-routines.png ../../../../context/rakazo-main/docs/screenshots/readme/routines.png
products/OpenMausBot-main/01-empty.png ../../../../../../context/OpenMausBot-main/docs/screenshots/automations-journey/01-empty.png
products/OpenMausBot-main/after-stop-sidebar-says-denied.png ../../../../../../context/OpenMausBot-main/docs/verification/images/ui-approval-status/after-stop-sidebar-says-denied.png
products/OpenMausBot-main/moca-148-stop-ios.jpg ../../../../../../context/OpenMausBot-main/docs/screenshots/moca-148-stop-ios.jpg
products/OpenMausBot-main/18-calendar-needs-you.png ../../../../../../context/OpenMausBot-main/docs/screenshots/automations-journey/18-calendar-needs-you.png
products/turnstone-main/09-workstream-states.png ../../../../../../context/turnstone-main/docs/diagrams/png/09-workstream-states.png
products/hermes-muse-main/muse-dashboard-overview.png ../../../../../../context/hermes-muse-main/docs/images/muse-dashboard-overview.png
```
<!-- end links -->

<!-- begin phase-links -->
```text
openbot-activity-groups.ts ../../../context/OpenBot-main/app/src/lib/bot-lifecycle/activity-groups.ts
openbot-approvals ../../../context/OpenBot-main/app/src/components/approvals
openbot-needs-you ../../../context/OpenBot-main/app/src/components/needs-you
openbot-routines ../../../context/OpenBot-main/app/src/components/routines
openghost-approval-card.js ../../../context/OpenGhost-main/approval-card.js
openghost-ask-card.js ../../../context/OpenGhost-main/ask-card.js
openhuman-tui ../../../context/openhuman-main/crates/openhuman-tui
openmaus-ActivityPanel.tsx ../../../context/OpenMausBot-main/src/components/ActivityPanel.tsx
openmaus-ApprovalCard.tsx ../../../context/OpenMausBot-main/src/components/ApprovalCard.tsx
rakazo-routine-list.tsx ../../../context/rakazo-main/apps/web/src/pages/routines/RoutineList.tsx
turnstone-cli.py ../../../context/turnstone-main/turnstone/cli.py
turnstone-colors.py ../../../context/turnstone-main/turnstone/ui/colors.py
```
<!-- end phase-links -->

<!-- begin sha256-images -->
```text
22698859ac78586be8d3690cbc3f1ed660df0a2a98450adafbe61cf394284092  openmaus-approval-card.png
7b10dc876a9e84303dfb0cd41a95a178610504857459b5cbc36a34b08b3208c7  openmaus-moca-282-expired-card-ios.jpg
7ec52ae40bb91c10daa98d3ac3fb43e03aba1ea3967bece9eef86d4c7a5849ef  openmaus-tasks-routines.png
548f0d4ab015de066d500cd6427d6f9554690b90ea0d8018cd5ba8115efd3a8f  rakazo-routines.png
ca64ee4a452fe5b5be501afbb60acf106636c969115c17123fd7613a38df92c1  products/OpenMausBot-main/01-empty.png
34b165386705405fa59a3e8de292435abf948c74abb716eef1c95fffecbc491a  products/OpenMausBot-main/after-stop-sidebar-says-denied.png
657d778cfb4a54e2062c25a22cf6b12b3e86c1d143813d676063e22e7e008858  products/OpenMausBot-main/moca-148-stop-ios.jpg
6b0f28b09e5651ca3d13aff30ac1880fefe33fc6b6de303bb60a155c4ad56f78  products/OpenMausBot-main/18-calendar-needs-you.png
d98902e7d9e9ac843fda8d5d2b9705456a5b198ec2739cfe83765d2a17c5e5df  products/turnstone-main/09-workstream-states.png
a904596831d485d84ad5772a33441dd33639d3332c8503ce09335f5df3566ee0  products/hermes-muse-main/muse-dashboard-overview.png
cf8922902bfb3209fa91ab002fd7f1e6127fa1ff8e575b60ce939b8212ec0a4f  web/ratatui/tabs.gif
6dc2d3a492970d4c78c25d8de2ee7c0a091115ebd23631eb08f3f25142ac8d3e  web/ratatui/popup.gif
ff884a6598aa35dd48f78288c993f4a913b5f6aa170ed3687029faccb0620e84  web/ratatui/table-detail-tea.gif
49cf1e551468518390fa1aa5b9255c070cd1f24db55ec630797c866e1354e7b9  web/ratatui/panic.gif
12702710a8ceafcd56644cb05dd465733cf494f328e06ab0c59233ab8ba70c84  web/gitui/cmdbar.gif
d7ced60940bebbcb8f0d2e75f500dfd9063925e1fd7eff8e7e8f6f3320dca16f  web/gitui/discard-changes-on-checkout.png
46feeb36a5b30a33dbb8498889138f67256dab4462ef63ab17d6df8015056244  web/gitui/bad-credentials.png
ec926ba31df13d663f37c8660769ca4b7ea5457442e5ba61fc6c627de5323264  web/gitui/spinner.gif
ca7db5d265effa61ee7d3e656f108f0edcbdcbc05e62ffabef598eace7628ab3  web/k9s/screen_po.png
22c959eab13416a2bdb9fd8984bfd0566980b9d6897d8fc83523991b1f9dc5f0  web/btop/tty.png
9b2a2b08e3f3c6dc2e67dc4c78fc31d252bfe28d745ad7e5e91daaac35449682  web/btop/help-menu.png
670dbc90ada18095d695b1631d2314da2b5cc7abdaa93dbd19ba271261c1c437  web/bottom/process_kill_simple.webp
05f43e7bf738d5a174e1cedf570538c5876787a85eb66879d2ae56383d7e3a9a  web/gh-dash/pr-sections.png
7536f8f0ce22dabe209a5121ed4a51d5f3fa224ddc3bb5fc55e9fa39b495b388  web/gh-dash/help.png
118a3c8a6b58ed31faa97377b5a164f71a83eb5175725b628d42f9eb4d61fbb8  web/posting/empty.png
98f1ab7debf7c8992ef5944de91f69e2007d8cb0874adfb354be6879a3703657  web/aerc/aerc.png
1c366cb14ee604f12365458cc62045c51d5e0edbff43b77aa2e2bb9e2ecea19f  web/codex/codex-cli-splash.png
b9594d1d59546e9934bf14e09d7332a8b0ca7da0cd4c9cd5568e6ed460b1d7bd  web/claude-code/permission-prompt-bash-light.png
5f577b6ac5b32d2678913b565c818c12704a9e7dcae38595fda3295acaaa8cba  web/gemini-cli/theme-ansi-dark.png
f775939aeb345f2d13d648e78ab37c367217cc123c9cba4f7215eee86e28e023  web/claude-tasks/476bb9c9-e4d6-4e16-8ee2-9364c6d07aa3.png
d9c63f7917fd4f4763213d368d470819613e5bd03809cd57039a77af008aa7b6  web/process-compose/tui.png
53b6a3f7e7de40309c204623d192fe98fca386c3e82f8df5674812940a5de601  web/dekit/dekit-tui.png
4b6baf85743cc8c5f12df2fe486a521a918fea87a61911e0278a797dff5a8ed5  web/pueue/Pueue-State-Diagram.svg
a03bddd995301fc6d349565bd71755164ef2029a3eac8bc0fc830b14af28d76a  web/agent-of-empires/approval.png
9693f2bb54b724d31b2610f54f10ad6fc9a89592393fa1a284930c633dc15718  web/agent-of-empires/overview.png
d6346d7d458a8f1bf6c472925fcd256635ff82e42dc1776ceb8ccb56e18e731a  web/claude-squad/screenshot.png
29a7e818594bf3d741ed04d2375cf2abfe69b70a14f01bb7448d6a7a8138a96a  web/agent-deck/watcher-doorbell.png
657c54f06ccfeb1c5be28b573160e5783b3603ae621a3efadd3380401cab8cf5  web/toad/aca51988-359a-466d-bdd1-050dc3d678ac.png
45cfb7f3678002a8a88be6fb409ac8b9c23d49018bc23a092450d6a16b4cb02d  web/hermes-agent/session-orchestrator.png
57d37fcc54ff85f83a0a0772d37693f6f28f609eabefdf9413a80d75cad8e205  web/hermes-agent/11-drawer-gave-up.png
3ae0bb90387ea932b89d6c2e625b1ec399dc308c9fceb316afe371e48e50da28  web/hermes-agent/10-drawer-in-flight.png
7cb90c40f08d2e3b96e97c49ff7af68b07e65399bdafce6c79e7252d0c71186d  web/openbot/plugins-3x.png
d59ed070c35fe499dc8db84b3a79f2ed0d44f7766b51ff511809a39a0d2f6fa5  web/openbot/plugins-3x-dark.png
9e690bbe4dcef3a49952d0bfb3f7099ae62885c11c52642198337023e06dba09  web/openhuman/layer-one.png
```
<!-- end sha256-images -->

---

## 4. The openhuman demo frames

`context/screenshots/openhuman-demo/` holds 56 files: a `.txt` and an `.ansi` for each of 28 frames. 8 frames are at 80x24 (numbers 01 to 08) and 20 at 120x40 (01 to 08 and 10 to 21). No frame 09 exists at either size, and no record says why. They stay local: they are the output of a GPL-3.0-only program and carry its interface text (decision Q007, `mockups.md` section 5).

### What is recorded

- **The decision.** Q007 in `decision-record.md:46` and `spec.md:201`, U001 in `001-ux-and-component-map/decision-record.md:37`, and item 4 of `research/ui-advisory.md:10`: build openhuman's `--demo` locally and capture its TUI into the gitignored `context/screenshots/`.
- **The source.** `specs/system-skilled-bots/context/openhuman-full`, a shallow git clone of https://github.com/tinyhumansai/openhuman whose HEAD is `68b725f3a5382a103a3f48002b23eb6325d61637` with a clean tree and its submodules checked out. The build log names no commit, so this is the HEAD at the time of writing, and the clone folder's date (2026-11-25 21:24) puts the clone just before the build. `openhuman-full.clone.log` is empty.
- **The build.** `specs/system-skilled-bots/context/openhuman-full.build.log`, 956 lines, compiles `openhuman-tui v0.64.20` and ends with "Finished `dev` profile [unoptimized + debuginfo] target(s) in 4m 33s". The file is dated 2026-11-25 21:30.
- **The binary.** `specs/system-skilled-bots/context/.openhuman-demo-target/debug/openhuman-tui`, 453,349,472 bytes, dated 2026-11-25 21:30:25, sha256 `19feaf5c3d5efbed2b60ffd3d9ab6eef05c12c851c4fd2f7a821fa19dc8a2ff3`. The repo's own `target/` does not exist, so the build used that folder as its cargo target directory.
- **The run command.** `crates/openhuman-tui/README.md:12-15` gives `bash scripts/ci-cancel-aware.sh cargo build -p openhuman-tui` and `./target/debug/openhuman-tui --demo`. `--demo` is "an offline interactive preview" that starts no core and calls no model (`README.md:17-20`).
- **The captures.** All 56 files are dated 2026-11-25 between 21:30:57 and 21:32:12, within two minutes of the build finishing. Each `.txt` is plain text of exactly the frame height (24 or 40 lines). Each `.ansi` is the same screen with SGR codes for bold and for 256-colour foregrounds.

### What is inferred

These are readings of the files, not records. Each says what would confirm it.

- **Built with a target directory override**, something like `CARGO_TARGET_DIR=specs/system-skilled-bots/context/.openhuman-demo-target cargo build -p openhuman-tui`. Inferred from where the binary is. Whether the `ci-cancel-aware.sh` wrapper ran is UNKNOWN.
- **Captured with tmux.** The pairs match `tmux capture-pane -p` (plain) and `tmux capture-pane -p -e` (with escapes). The file names use tmux key names: `BTab` is tmux's name for Shift+Tab, and `ctrl-a`, `F1` to `F5` and `Tab` are key names too. tmux is installed at `/opt/homebrew/bin/tmux`. A session log or a shell history from that evening would confirm it.

### What is UNKNOWN

- The capture tool and its options, if not tmux.
- The keys sent for `02-tab1-logs` to `05-tab4-settings`, `07-help-or-input` and the five `palette-*` sub-lists (17 to 21). The README's controls table (`README.md:40-51`) names `Ctrl+P` for commands, so `06-palette` is likely `C-p`. That is a guess from the README, not a record.
- Whether each frame started from a fresh session or followed the one before.
- The terminal type, the wait before each capture, and why frame 09 is missing.

### Recapture recipe

Documentation only. Nobody has run it. The keys marked `<key>` are UNKNOWN and must be found in the README controls table or by hand. A recapture may not match the hashes below byte for byte, since the demo's sample content or timing may differ. Compare by eye, as `mockups.md` section 5 already does.

````bash
cd "$(git rev-parse --show-toplevel)"
CTX=specs/system-skilled-bots/context
OUT=specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/screenshots/openhuman-demo
git clone --depth 1 --recurse-submodules --shallow-submodules https://github.com/tinyhumansai/openhuman "$CTX/openhuman-full"
git -C "$CTX/openhuman-full" fetch --depth 1 origin 68b725f3a5382a103a3f48002b23eb6325d61637
git -C "$CTX/openhuman-full" checkout 68b725f3a5382a103a3f48002b23eb6325d61637
git -C "$CTX/openhuman-full" submodule update --init --recursive
CARGO_TARGET_DIR="$PWD/$CTX/.openhuman-demo-target" cargo build --manifest-path "$CTX/openhuman-full/Cargo.toml" -p openhuman-tui > "$CTX/openhuman-full.build.log" 2>&1
BIN="$PWD/$CTX/.openhuman-demo-target/debug/openhuman-tui"
mkdir -p "$OUT"

cap() {
  size=$1
  name=$2
  shift 2
  tmux kill-session -t ohdemo 2>/dev/null
  tmux new-session -d -s ohdemo -x "${size%x*}" -y "${size#*x}" "$BIN --demo"
  sleep 2
  for k in "$@"
  do
    tmux send-keys -t ohdemo "$k"
    sleep 1
  done
  tmux capture-pane -t ohdemo -p > "$OUT/$size-$name.txt"
  tmux capture-pane -t ohdemo -p -e > "$OUT/$size-$name.ansi"
  tmux kill-session -t ohdemo
}

for size in 80x24 120x40
do
  cap "$size" 01-start
  cap "$size" 02-tab1-logs "<key>"
  cap "$size" 03-tab2-chat "<key>"
  cap "$size" 04-tab3-config "<key>"
  cap "$size" 05-tab4-settings "<key>"
  cap "$size" 06-palette C-p
  cap "$size" 07-help-or-input "<key>"
  cap "$size" 08-ctrl-a C-a
done
cap 120x40 10-key-Tab Tab
cap 120x40 11-key-BTab BTab
cap 120x40 12-key-F1 F1
cap 120x40 13-key-F2 F2
cap 120x40 14-key-F3 F3
cap 120x40 15-key-F4 F4
cap 120x40 16-key-F5 F5
cap 120x40 17-palette-sessions C-p "<key>"
cap 120x40 18-palette-agents C-p "<key>"
cap 120x40 19-palette-tools C-p "<key>"
cap 120x40 20-palette-settings C-p "<key>"
cap 120x40 21-palette-approvals C-p "<key>"
(cd "$OUT" && shasum -a 256 -c -) <<'EOF' | grep -v ': OK$'
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-01-start.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-01-start.txt
a73f5802fde4894ce1a0dbeb7e2ea6a92583ca559693dfdff51ff7b8f1f2e1a3  120x40-02-tab1-logs.ansi
312fb008ea1e6412eb4de22639abd4aee3d6580edcd5f61759e58f0e9949b6f2  120x40-02-tab1-logs.txt
e7e9268e4aedea66c8bfcb62d25fc4ae0c48c827979b3783059842a315b281b1  120x40-03-tab2-chat.ansi
4804a42b993bbec19d08f631e7dc85281f09cbd129e0fbead1c3240c7934b75f  120x40-03-tab2-chat.txt
5a975817185791622482dfe6139dd7d5703a6f0a96b38c5f9be933cd40f85846  120x40-04-tab3-config.ansi
06538113cb19cb22651c543e7bb7739de5768f5a74b10d5ac36fa571670c2441  120x40-04-tab3-config.txt
ac8ebd3df63efbc06cc4804bdf64559f0336bc0b1cd571711cc8e39dc8f61243  120x40-05-tab4-settings.ansi
c52a6394a093f424a55172bff79f6c5f3de1a8921622bb52eb281d2c610b016a  120x40-05-tab4-settings.txt
932247ac1dd5b2cec53215a3cc8e7229e77555eb9221271c92e40e8e341b0bfa  120x40-06-palette.ansi
db1a37e151c55fb43d3390074c3b421e81194e959264c8324532a6a6c9f56148  120x40-06-palette.txt
a2ea1fc7b052078ae90f9d719ba2470c82ca46c0b7053aef40eadb87c8ea1831  120x40-07-help-or-input.ansi
8352a63ef217ca0e3d1566fb66fcdb3f3fd28de289f65fc5bfc3b2f7e17b47e8  120x40-07-help-or-input.txt
a2ea1fc7b052078ae90f9d719ba2470c82ca46c0b7053aef40eadb87c8ea1831  120x40-08-ctrl-a.ansi
8352a63ef217ca0e3d1566fb66fcdb3f3fd28de289f65fc5bfc3b2f7e17b47e8  120x40-08-ctrl-a.txt
488a313eb05ef969cf4e240463f605a91bff938ff88c2691e9d74e9a93168767  120x40-10-key-Tab.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-10-key-Tab.txt
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-11-key-BTab.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-11-key-BTab.txt
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-12-key-F1.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-12-key-F1.txt
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-13-key-F2.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-13-key-F2.txt
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-14-key-F3.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-14-key-F3.txt
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-15-key-F4.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-15-key-F4.txt
61747152af27a453992093b54e9d03e7228a4dd7bb8a1ec7af7ba2b50c1c6ee6  120x40-16-key-F5.ansi
95877204da6fee8f8f5a048d3b657c9f00411b5e43db05a60ff82f8d2732cb3a  120x40-16-key-F5.txt
2acc0f2ff96066f1d887e59834f49ce66a24aa34810f8986f11c4efad471d8e3  120x40-17-palette-sessions.ansi
505b991b6169ba1adb6ffd4d12ff34408aef2bbc99d4ab4dc2bcf0040967eb97  120x40-17-palette-sessions.txt
9616dc1406f8678ce666baae2ccef555d8b65048fb56c0aab2759434dea781ef  120x40-18-palette-agents.ansi
034223a74f80a43ad3b51a9d1df73b3fd90f870be691adcb92fa9989d7adab2e  120x40-18-palette-agents.txt
34ec343419bec4351ba70c7e77c926543fa5454aa077294d1a57332ae9c0415d  120x40-19-palette-tools.ansi
84b760aff508c2f759f8d9c3ce230ed3af86c32578962aa9aaf0e26de2306072  120x40-19-palette-tools.txt
5a713bc21273048a36733413b5869326b3cfe53d558c0a5dfb189d0a4158e10f  120x40-20-palette-settings.ansi
83119282711625bf53b6389cfe7ec9966488380498f58a2a1faefdb1f30a4c7d  120x40-20-palette-settings.txt
32fd8cf3049b6bef02305c325168bd34e215a443663de86cb7be43ea32d881b0  120x40-21-palette-approvals.ansi
5576727bbfe1464ab34d5de8f7a90860804df4b77e67432f3e408f54181a6dad  120x40-21-palette-approvals.txt
fa6d5f17ea0b03cad9a5b56b4b639cb79f5d9eb1fda7bff330f0f7d70458bdb5  80x24-01-start.ansi
2a9ae11598a6293a8262824864bb29b8d3e69b88eee190984eb16d6e2690e8a5  80x24-01-start.txt
79207cb6cd8f6fc25291abf49557fb835032aaa05a6d1f68b2c41d97146a4153  80x24-02-tab1-logs.ansi
0528ff97b6f42b334a1479f0e8e50fd282e3b78dda32323158f52e75534bcb9d  80x24-02-tab1-logs.txt
cdcf741260d48cd20089ec9ee74588558d9cbfca76946ddefbd827a18d8477ad  80x24-03-tab2-chat.ansi
c13f4f46600262c3670c69a3b31da55a5456c30d261c785c23b8b435c768ad14  80x24-03-tab2-chat.txt
4d8d1d66f91dcbd301d6809dc1f9f42de510a0c6cfbceb0f30cd9dee519d7fed  80x24-04-tab3-config.ansi
c9ad3ae72692410d97f40f9fae7eb9328cdbc219a1e386187c21934aa98ef72b  80x24-04-tab3-config.txt
d6a3bcbc22a478a62fbf18abe04823849619791520791bb27aa0694624379928  80x24-05-tab4-settings.ansi
bffa9b84632809aefaeecf024f5520aa78e45bb979471c8a844464ac39b06cf4  80x24-05-tab4-settings.txt
d8118fe5180ffdff0d5e61406a6d7ce1537ee85f01bd42768e81c3a688115321  80x24-06-palette.ansi
bcecb0878061a004ef52c4bbd07efe5570b321bb6ab0db503d7b819e55105ea1  80x24-06-palette.txt
f69a9857a778feee77e56088c64ef9a3628f371228caf8e494a9a5657c8608ff  80x24-07-help-or-input.ansi
fb58edb5e2b77f7c1c95b2f0e209d4e37666377af4bb2eee40645b22114f41ca  80x24-07-help-or-input.txt
f69a9857a778feee77e56088c64ef9a3628f371228caf8e494a9a5657c8608ff  80x24-08-ctrl-a.ansi
fb58edb5e2b77f7c1c95b2f0e209d4e37666377af4bb2eee40645b22114f41ca  80x24-08-ctrl-a.txt
EOF
````

The heredoc above holds the sha256 of each of the 56 files as captured on 2026-11-25, paths relative to `openhuman-demo/`.

---

## 5. Edits the other docs need

Others apply these. Line numbers are as read on 2026-11-25 in this worktree while other writers were editing, so match on the quoted text, not the number. Paths are relative to this phase folder. Where the current text holds characters this file may not carry, the edit names the start and end of the span instead of quoting it.

The shared rule for every check below: test `specs/system-skilled-bots/context` with `test -d`, which follows the worktree symlink. When it is present, run the check as now. When it is absent, check nothing that points into it and write a `SKIP context-absent:` line to stderr, so stdout and the expected output stay as written.

**1. `006-hardening-and-proof/tasks.md:118`, T018.** Replace the whole bullet, which starts `- [ ] T018 Prove every design pointer resolves`, with this bullet and its indented block:

````markdown
- [ ] T018 Prove every design pointer resolves, or skips by name when the gitignored reference folder is absent (`$CRATE/design`). Verify: the block below prints the four names `component-inventory.md`, `glyph-table.md`, `key-map.md` and `mockups.md` and nothing else on stdout. When `specs/system-skilled-bots/context` is present the loop prints `DANGLING <path>:<line>` for each pointer whose file is missing or too short, so any such line is a failure. When it is absent the block writes one `SKIP context-absent:` line to stderr naming how many pointers it did not check, and checks nothing else. The `ls` is the first guard, because `rg` on a missing design folder reads no input and the loop alone would pass. The loop compares the line against the file's length because `sed -n` past the end of a file exits 0. How to rebuild the folder: `research/context-manifest.md` section 3.

  ```bash
  ls $CRATE/design
  ctx=specs/system-skilled-bots/context
  if test -d "$ctx"
  then
    rg -o --no-filename "$ctx/[^ :]+:[0-9]+" $CRATE/design | sort -u | while IFS=: read -r p l
    do
      test -f "$p" && test "$l" -le "$(awk 'END{print NR}' "$p")" || printf 'DANGLING %s:%s\n' "$p" "$l"
    done
  else
    n=$(rg -o --no-filename "$ctx/[^ :]+:[0-9]+" $CRATE/design | sort -u | wc -l | tr -d ' ')
    printf 'SKIP context-absent: %s design pointers not checked, see research/context-manifest.md\n' "$n" >&2
  fi
  ```
````

**2. `006-hardening-and-proof/acceptance-criteria.md:65`, AC-011.** In the Evidence cell, replace the span from its first `rg -o --no-filename` up to and including the first `prints nothing,` (the current span holds the T018 loop and cannot be quoted here). Keep the `ls` part before it and the `GPL-3.0` part after it. AC-011 then cites T018 instead of repeating it, so the two cannot drift.

```text
new: the T018 block in `tasks.md` prints no `DANGLING` line, or, when `specs/system-skilled-bots/context` is absent, writes one `SKIP context-absent:` line to stderr,
```

The edits below quote the current text and the new text in `text` blocks, so the backticks inside them read literally.

**3. `006-hardening-and-proof/spec.md:152`, REQ-020.** Two replacements in the same row.

```text
current: resolves to a real line in the cited source under `specs/system-skilled-bots/context/`, and the folder
new:     resolves to a real line in the cited source under `specs/system-skilled-bots/context/` whenever that gitignored folder is present, the check names its skip when it is absent, and the folder
```

```text
current: a missing folder is a failed check
new:     a missing design folder is a failed check
```

**4. `006-hardening-and-proof/spec.md:102`.**

```text
current: every `file:line` pointer in `design/` resolving to a real line.
new:     every `file:line` pointer in `design/` resolving to a real line when the gitignored reference folder is present, with a named skip when it is not.
```

**5. `006-hardening-and-proof/goal.md:62`.**

```text
current: proven by the loop in `tasks.md` T018 printing nothing.
new:     proven by the T018 block printing no `DANGLING` line, or naming its skip when `specs/system-skilled-bots/context` is absent.
```

**6. `001-ux-and-component-map/acceptance-criteria.md:62-72`, the AC-001 command block.** It is the fenced block under `**AC-001**: the four documents exist, and every pointer resolves.` Replace the whole fenced block with the one below. The expected output in row AC-001 (`4` then `0`) does not change. Pointers into the reference folder are skipped only when it is absent, and each skip is named on stderr.

````markdown
```bash
ls $D | wc -l
ctx=specs/system-skilled-bots/context
rg -o --no-filename '\[SOURC[E]: [^]]+\]' $D/*.md $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/goal.md \
  | sed -e 's/^\[SOURCE:[ ]*//' -e 's/\]$//' | sort -u \
  | while IFS= read -r p
    do
      f=${p%%:*}
      r=${p#*:}
      hi=${r##*-}
      if [ "${f#"$ctx"/}" != "$f" ] && [ ! -d "$ctx" ]
      then
        echo "SKIP context-absent $p" >&2
        continue
      fi
      if [ ! -f "$f" ]
      then
        echo "MISSING $p"
        continue
      fi
      n=$(wc -l < "$f" | tr -d ' ')
      [ "$hi" -le "$n" ] || echo "PAST-END $p"
    done | wc -l
```
````

**7. `001-ux-and-component-map/tasks.md:87`, T025.** Replace everything from `Verify:` to the end of the line. T025 then runs the same loop as AC-001 instead of keeping a second copy.

```text
new: Verify: the second command of the AC-001 block in `acceptance-criteria.md` prints 0. When `specs/system-skilled-bots/context` is absent it also writes one `SKIP context-absent` line per skipped pointer to stderr.
```

**8. `001-ux-and-component-map/tasks.md:52`, T004.** Replace everything from `Verify:` to the end of the line.

```text
new: Verify: when `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/screenshots` exists, `ls` of its `*.png` and `*.jpg` files piped to `wc -l` prints 4. When it is absent, `test -d specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/context/screenshots || echo 'SKIP context-absent: screenshots, see research/context-manifest.md' >&2` names the skip, and manifest rows I01 to I04 record the four files.
```

**9. `001-ux-and-component-map/plan.md:41`.** Replace the whole line.

```text
current: - [ ] Every reference source under `specs/system-skilled-bots/context/` resolves in this checkout
new:     - [ ] Every reference source under `specs/system-skilled-bots/context/` resolves in a checkout that has that gitignored folder, and every pointer check names its skip in one that does not
```

**10. `001-ux-and-component-map/plan.md:101`.** In the last cell:

```text
current: A pointer would dangle and the design would lose its evidence
new:     A pointer would dangle and the design would lose its evidence. The folder is gitignored, so a fresh checkout skips the pointer checks by name and rebuilds it from `research/context-manifest.md`
```

**11. `001-ux-and-component-map/spec.md:150`, REQ-001.** Insert before the closing ` |` of the row:

```text
new: Pointers into the gitignored `specs/system-skilled-bots/context/` are checked when it is present and skipped by name when it is absent.
```

**12. `001-ux-and-component-map/spec.md:213`, NFR-R01.** Replace the whole line.

```text
current: - **NFR-R01**: Every `SOURCE` pointer resolves in this checkout, so a reader can follow each claim.
new:     - **NFR-R01**: Every `SOURCE` pointer resolves in a checkout that has the gitignored reference folder, and `research/context-manifest.md` records how to rebuild that folder, so a reader can follow each claim.
```

**13. `001-ux-and-component-map/spec.md:163`, REQ-009.** Insert before the closing ` |` of the row:

```text
new: The files are gitignored, and `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md` records their sources and sha256 values.
```

**14. `001-ux-and-component-map/design/mockups.md:2016`.** Append to the end of the paragraph that starts `The frames above are drawn from the payload shapes`. The added text must not contain the string `screenshots/`, because AC-009 counts lines holding that string in this file and expects 5.

```text
new: The pictures are gitignored and stay local. Rows I01 to I04 and section 4 of `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md` give each one's source and sha256.
```

**15. `001-ux-and-component-map/design/mockups.md:2032`.** Edits 14 and 15 also reach the crate copy, because 002 copies `design/` unchanged.

```text
current: Every pointer below resolves in this checkout.
new:     Every pointer below resolves in a checkout that has the gitignored `specs/system-skilled-bots/context/` folder. Section 2 of `specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md` names each repo's upstream and the commit, where one is recorded.
```

**16. `005-answer-flow/spec.md:272`.**

```text
current: read for shape only
new:     read for shape only. They are gitignored links, rebuilt from section 2 of `research/context-manifest.md`
```

**17. `004-panes/spec.md:262`.**

```text
current: copies no code from
new:     copies no code from. Rebuilt from section 2 of `research/context-manifest.md`
```

**18. `research/ui-references.md:3`.**

```text
current: listed in its `INDEX.md`)
new:     listed in its local `INDEX.md`, and with source URLs and sha256 values in the tracked `research/context-manifest.md`)
```

**Checked and left alone.**

- `001-ux-and-component-map/acceptance-criteria.md` AC-006 greps the design docs for the GPL header text. It never reads `context/`, so it passes the same with or without it. That is not a break, but it means AC-006 proves nothing about the reference sources.
- `validate.sh --strict` has a `SOURCE_TAGS` rule that resolves `path:line` citations in a packet's research and review artifacts, at WARNING severity, so it never fails a run (`.skilled/skills/system-spec-kit/references/validation/validation-rules.md:116`). In a fresh checkout it may warn on the `context/` pointers in `research/` files, and T020 and the child validations still pass. No edit needed.
- No other pointer loop exists in 002 to 005. A search for `PAST-END`, `MISSING ` and `SOURC[E]` outside `context/` and `research/` found only the 001 loops in AC-001 and T025, and the AC-003 label loop, which reads only tracked files.
- AC-009 (`rg -c 'screenshots/' $D/mockups.md` prints 5) reads only the tracked mockups. It holds as long as edit 14 adds no `screenshots/` string.
- The `legacy-003` mentions at `goal.md:122`, `spec.md:280`, `001-ux-and-component-map/spec.md:265`, `002-architecture-and-contracts/spec.md:306`, `004-panes/spec.md:263` and `005-answer-flow/spec.md:273` already say the folder is gitignored. No check reads it. If a pointer is wanted, append the text below to each.

```text
new: , recoverable with `git show 6b4031c150e^:<path>`
```
- Optional, from `fable-review-1.md` section 5: the openhuman rows in `mockups.md` section 6 could carry the permalink beside the local path, in the form `https://github.com/tinyhumansai/openhuman/blob/68b725f3a5382a103a3f48002b23eb6325d61637/crates/openhuman-tui/src/render.rs#L26-L35`. Only openhuman and tinychannels have a recorded commit, so the other repos cannot be pinned yet.
