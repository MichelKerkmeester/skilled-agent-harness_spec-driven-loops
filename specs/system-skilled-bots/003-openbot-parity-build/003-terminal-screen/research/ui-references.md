# UI references for the terminal screen

Source: a web and local sweep on 2026-11-25 of terminal apps and of the products this packet borrows from, looking for screenshots that teach something about our panes, overlays, keys, glyphs, states and tab bar. The images themselves stay local in the gitignored `context/screenshots/` (`web/` and `products/`, listed in its `INDEX.md`). This file holds only source URLs, licenses and the lessons. We copy ideas, never code or text, and from GPL, AGPL, source-available or unlicensed projects we take layout ideas only.

The design docs this file checks against are `001-ux-and-component-map/design/key-map.md`, `glyph-table.md`, `component-inventory.md` and `mockups.md`. A takeaway that agrees with a settled decision says so. A takeaway that would reopen a settled decision is in the avoid list, not the adopt list.

---

## 1. Ranked references

Ranked by how much they teach for our panes and overlays, best first.

| Rank | App | License | Sources | What it teaches us |
|---|---|---|---|---|
| 1 | OpenAI Codex CLI, agent command center (ratatui) | Apache-2.0 | https://github.com/openai/codex/blob/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__command_center__live_center_columns.snap, https://github.com/openai/codex/blob/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__command_center__live_center_keeps_status_order_across_progress_refreshes.snap, https://github.com/openai/codex/blob/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__actions__hiding_tasks_keeps_selection_adjacent_in_display_order.snap, https://github.com/openai/codex/blob/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__command_center__live_center_help_two_columns.snap | Almost our Activity tab. Rows grouped by status with a count per group, a count strip under the title (`All 6  Needs you 2  Working 1  Ready 2  Inactive 1`), `›` on the selected row, a detail column after a `│` rule, and one footer line `? help  esc back  ↑/↓ move  enter open`. Two tests pin what we also need: group order does not change when progress refreshes arrive, and when a row disappears the selection moves to the next row in display order. The help screen is the key table in two or three columns grouped as Navigate, Tasks and View. Codex keeps these ratatui buffer snapshots in insta `.snap` files; we assert the `TestBackend` buffer directly, because insta is not approved (`research/ui-advisory.md`, operator decision 3) |
| 2 | OpenAI Codex CLI, approval overlay (ratatui) | Apache-2.0 | https://github.com/openai/codex/blob/main/codex-rs/tui/src/bottom_pane/snapshots/codex_tui__bottom_pane__approval_overlay__tests__network_exec_prompt.snap, https://github.com/openai/codex/blob/main/codex-rs/tui/src/bottom_pane/snapshots/codex_tui__bottom_pane__approval_overlay__tests__approval_overlay_permissions_prompt.snap, https://github.com/openai/codex/blob/main/codex-rs/tui/src/app/snapshots/codex_tui__app__agents_overview__tests__actions__archive_task_failure.snap | The question in bold, a `Reason:` line, numbered options each ending in its key in brackets (`1. Yes, just this once (y)`), and a dim last line `Press enter to confirm or esc to cancel`. The failure popup has a title, the error, then one plain line on what to do next ("Resume the task to continue, or retry the action"). Two parts conflict with our rules: option 1 is preselected so Enter approves, and the last option is "No" bound to Esc |
| 3 | Claude Code permission prompt | No license (all rights reserved) | https://code.claude.com/docs/en/permissions, image https://mintcdn.com/claude-code/oa7CKjMeIChox26S/images/permission-prompt-bash-light.png | A small, clear order: the kind of action as the title, one line of description, the exact command between two rules, "This command requires approval", the question, numbered options, then a footer of keys. Its option 2 "don't ask again", option 3 "switch to auto mode" and "Tab to amend" are things we do not bind |
| 4 | Hermes Agent TUI and kanban | MIT | https://github.com/NousResearch/hermes-agent/blob/main/website/static/img/docs/tui-session-orchestrator/session-orchestrator.png, https://github.com/NousResearch/hermes-agent/blob/main/website/static/img/kanban-tutorial/11-drawer-gave-up.png, https://github.com/NousResearch/hermes-agent/blob/main/website/static/img/kanban-tutorial/10-drawer-in-flight.png, https://hermes-agent.nousresearch.com/docs/user-guide/cli | The TUI overlay pairs a glyph with a word on every row (`✓ idle`, `✎ draft`) and prints its own keys in two lines inside the overlay. The web kanban has a Blocked lane described as "worker asked for human input" (our needs_you), a count on every lane, "– No tasks –" in an empty lane, the failure reason printed under each failed run, and "No worker log yet (task hasn't spawned or log was rotated away)" where data is absent |
| 5 | claude-tasks (Claude scheduler TUI) | No license (all rights reserved) | https://github.com/kylemclaren/claude-tasks, image https://github.com/user-attachments/assets/476bb9c9-e4d6-4e16-8ee2-9364c6d07aa3 | The closest match to our Routines tab: a "3 task(s) running" line, then Name, Schedule, Status, Next Run, Last Run. Next run is relative when it is close ("in 56s") and a date when it is far ("Jan 21 10:00"); an absent value is `-`. Status words are running, enabled and disabled |
| 6 | OpenMausBot | Apache-2.0 (its `enterprise/` folder is source-available) | https://github.com/milind-soni/OpenMausBot, local `docs/screenshots/approval-card.png`, `moca-282-expired-card-ios.jpg`, `tasks-routines.png`, `automations-journey/01-empty.png`, `docs/verification/images/ui-approval-status/after-stop-sidebar-says-denied.png` | An expired item stays visible and says why ("The routine changed after this proposal was made") and what to do. An answered approval collapses to one outcome line ("✕ Denied") and the list row shows the same word. Empty states teach: "Your bots can do things on their own. Try: every morning, summarize my inbox", and the routines page defines task versus routine in one line. The question card puts lettered choices and a "Type your own answer" field in one card |
| 7 | process-compose | Apache-2.0 | https://github.com/F1bonacc1/process-compose, image https://github.com/F1bonacc1/process-compose/blob/main/imgs/tui.png | A glyph column (● running, ✗ failed, ○ disabled) next to a STATUS word column, plus an exit code column. This is our glyph-table rule (glyph plus word, never colour alone) in a working app |
| 8 | dekit, formerly mprocs | MIT | https://github.com/pvolok/dekit, image https://github.com/pvolok/dekit/blob/master/img/dekit-tui.png | State words right-aligned in the list (UP, DONE, FAILED (1), DOWN), with the exit code inside the failed word. Its one-line help footer is cut off at the right edge, which is the failure our two-line footer exists to prevent |
| 9 | posting | Apache-2.0 | https://github.com/darrenburns/posting, image https://github.com/darrenburns/posting/blob/main/docs/assets/history/empty.png | The best empty state in the sweep: what is missing ("No responses yet"), how to fill it ("Send a request to keep its response here"), and where it lives ("History is saved locally for this collection"). Footer of `^key Label` pairs |
| 10 | gh-dash | MIT | https://github.com/dlvhdr/gh-dash, images https://github.com/dlvhdr/gh-dash/blob/main/docs/src/assets/pr-sections.png and https://github.com/dlvhdr/gh-dash/blob/main/docs/src/assets/help.png | A count on every section tab (`Mine (4) │ Review (0) │ Commented (182)`). Help laid out in columns of `key action`. It already uses `[` and `]` for previous and next tab, which supports our fallback pair |
| 11 | gitui (ratatui) | MIT | https://github.com/gitui-org/gitui, images https://github.com/gitui-org/gitui/blob/master/assets/discard-changes-on-checkout.png, https://github.com/gitui-org/gitui/blob/master/assets/cmdbar.gif, https://github.com/gitui-org/gitui/blob/master/assets/bad-credentials.png, https://github.com/gitui-org/gitui/blob/master/assets/spinner.gif | Tabs drawn with their number (`Status [1] │ Log [2]`), counts in pane titles, and a bottom bar that switches to the open popup's own keys (`Close [⎋] Confirm [⏎]`). Errors open a large red-titled modal, which we do not copy. A spinner shows a background job in flight |
| 12 | btop | Apache-2.0 | https://github.com/aristocratos/btop, images https://github.com/aristocratos/btop/blob/main/Img/tty.png and https://github.com/aristocratos/btop/blob/main/Img/help-menu.png | The tty mode keeps the whole UI readable in 16 colours and puts each box's shortcut digit in its title. The help overlay is a two-column Key and Description table drawn over the app |
| 13 | bottom (ratatui) | MIT | https://github.com/ClementTsang/bottom, image https://github.com/ClementTsang/bottom/blob/main/docs/content/assets/screenshots/process/process_kill_simple.webp | A small centred confirm box: title left in the border, "Esc to close" right in the border, the question names the exact target. It preselects Yes, which we avoid |
| 14 | k9s | Apache-2.0 | https://github.com/derailed/k9s, image https://github.com/derailed/k9s/blob/master/assets/screen_po.png | Key hints in a grid in the header (`<?> Help`, `<ctrl-d> Delete`), the row count in the table title (`Pods(all)[12]`), a STATUS word column. Rows are coloured by state, which alone would break our colour rule |
| 15 | claude-squad | AGPL-3.0 (ideas only) | https://github.com/smtg-ai/claude-squad, image https://github.com/smtg-ai/claude-squad/blob/main/assets/screenshot.png | A numbered instance list with a status dot, an "auto-yes" badge in the header, "? for shortcuts" under the input, and a footer split into groups with `│` (`n new · d kill │ ↵/o open … │ tab switch tab · q quit`) |
| 16 | toad | AGPL-3.0 (ideas only) | https://github.com/batrachianai/toad, image https://github.com/user-attachments/assets/aca51988-359a-466d-bdd1-050dc3d678ac | A plan block with → on the current step and ◌ on pending steps, ✔ on finished tool rows, and a footer of `key Label` pairs with `^p palette` set apart at the right end |
| 17 | rakazo | Apache-2.0 | https://github.com/elie222/rakazo, local `docs/screenshots/readme/routines.png` | A routine as: Active on/off, name, instruction, "Weekdays at 7:00 AM", run history by date, plus "Test run". The four parts our routine row already draws |
| 18 | openhuman TUI demo captures | GPL-3.0 (ideas only) | https://github.com/tinyhumansai/openhuman, local captures in `context/screenshots/openhuman-demo/` | Same family as ours. The bottom line holds state on the left and keys on the right ("Ready · Offline preview" then `Ctrl+P commands · Ctrl+D exit`). The palette is a bordered list with the highlighted command's description at its foot. Demo mode cannot show an approval, so no approval frame exists |
| 19 | agent-deck | MIT | https://github.com/asheshgoplani/agent-deck, image https://github.com/asheshgoplani/agent-deck/blob/main/docs/images/watcher-doorbell.png | The "doorbell" idea: the alert is a short line ("1 unread", under 200 characters) and detail is fetched when the item is opened |
| 20 | Turnstone | Apache-2.0 | https://github.com/turnstonelabs/turnstone, local `docs/diagrams/png/09-workstream-states.png` | A state named ATTENTION, "blocked on user action, tool approval needed", next to RUNNING, EVALUATION and ERROR ("recoverable on next send"). It confirms that waiting-on-a-person is its own state, as needs_you is ours |
| 21 | gemini-cli | Apache-2.0 | https://github.com/google-gemini/gemini-cli, image https://github.com/google-gemini/gemini-cli/blob/main/docs/assets/theme-ansi-dark.png | ▲ and ▼ marks when a list has more rows above or below. An "ANSI" theme that uses only the terminal's own 16 colours, like our System palette. The footer is one plain sentence of keys |
| 22 | aerc | MIT | https://git.sr.ht/~rjarry/aerc, image https://static.lwn.net/images/2024/aerc.png (from https://lwn.net/Articles/993503/) | Account tabs on top, an unread count beside the inbox name ("INBOX 13"), and the connection state in the status line ("[Acme Corp] Connected") |
| 23 | hermes-muse | MIT | https://github.com/xiaohei-info/hermes-muse, local `docs/images/muse-dashboard-overview.png` | Tabs with counts ("Feed 5 · Ideas 4 · Goals 7") and a "Read-only" badge in the header. A deliberately long title used to test wrapping |
| 24 | ratatui examples | MIT | https://github.com/ratatui/ratatui/tree/main/examples, images https://github.com/ratatui/ratatui/blob/images/examples/tabs.gif, https://github.com/ratatui/ratatui/blob/images/examples/popup.gif, https://github.com/ratatui/ratatui/blob/images/examples/table-detail-tea.gif, https://github.com/ratatui/ratatui/blob/images/examples/panic.gif, gallery https://ratatui.rs/showcase/apps/ | The stock Tabs widget (divider and highlight), the Clear-then-draw popup our overlay needs, a table with a detail view written in the update-function style our reducer uses, and the panic hook that restores the terminal |
| 25 | OpenBot | MIT | https://github.com/CopilotKit/OpenBot, https://open.bot/ | No UI screenshots: the repo has architecture diagrams and icons, and the site draws its app screens in HTML. Its plugin catalog image is the only product picture. The local code (`activity-groups.ts`) stays the reference for group order |
| 26 | OpenGhost | MIT | https://github.com/ANDRETRIPOL/OpenGhost, https://andretripol.github.io/OpenGhost/ | Desktop chat and settings screenshots, local only. Little for a terminal list; its card code stays the reference for deny-first and the key lock |
| 27 | Others looked at | MIT unless named | lazygit https://github.com/jesseduffield/lazygit, lazydocker https://github.com/jesseduffield/lazydocker, atuin https://github.com/atuinsh/atuin, television https://github.com/alexpasmantier/television, slumber https://github.com/LucasPickering/slumber, taskwarrior-tui https://github.com/kdheepak/taskwarrior-tui, cronboard (Apache-2.0) https://github.com/antoniorodr/cronboard, pueue (Apache-2.0) https://github.com/Nukesor/pueue, agent-of-empires https://github.com/agent-of-empires/agent-of-empires, opencode https://github.com/anomalyco/opencode, aider (Apache-2.0) https://github.com/Aider-AI/aider, harlequin https://github.com/tconbeer/harlequin, yazi https://github.com/sxyazi/yazi, crush (FSL-1.1-MIT, source-available) https://github.com/charmbracelet/crush, tmuxcc https://github.com/nyanko3141592/tmuxcc | General layout only. pueue's state diagram is a useful check list of job states (queued, paused, killed). agent-of-empires' approval card (Allow, Always, Deny) is a web view. lazygit's feature clips are video, crush's demo is over 5 MB, and yazi and tmuxcc have no still screenshots |

---

## 2. Takeaways by part of the screen

Each line names the reference and the design doc it supports or changes.

### Panes and lists

- Keep group order and the selected row stable across refreshes; when the selected row goes away, select the next row in display order. Codex pins both in tests (rank 1). This supports `key-map.md` §4 and is worth a reducer test of its own.
- A count beside each group header and in the pane title. Codex, Hermes kanban, k9s and gitui all do it. Our mockups already draw `Activity · 7 groups · 12 rows`; a count after each group name (`Needs you 1`) is a small addition.
- The failure reason sits next to the failed row, not only in the status row. Hermes prints it under the failed run, dekit puts the exit code in the word. For us that belongs in the detail column at 120 columns and in the overlay below that.
- Routines rows: next run relative when close, a date when far, `-` when there is none, and a status word (claude-tasks, rank 5). Rakazo and openhuman show the last run's outcome beside the schedule. This fits the routine row in `component-inventory.md` row 5.

### Overlays and the answer flow

- Order inside the decision overlay: what kind of action, one line of description, the exact command or question set apart, a reason line, then the choices, then a footer of keys (Claude Code, Codex). This matches mockup frame 18 (decision overlay, idle) and gives it a tested order.
- Choices numbered, with the key printed in each row (`1. ship it`). Codex prints `(y)` after each option. Our `1-9 pick` is the same idea; printing the digit in the row is enough.
- No preselected answer. Codex, Claude Code and bottom all put the cursor on Yes, so a stray Enter approves. In our overlay Enter is bound only in text mode, where it sends the typed line (`key-map.md` §2 and §3.4), so this already holds; keep it.
- When an answer is refused or the item is gone, say what happened and what to do next in one plain line (Codex failure popup, OpenMausBot expired card). This fills the `refused` and `gone` states (mockup frames 21 and 22).
- After an answer lands, show the outcome word on the row ("Denied", "Approved") until the next refresh drops the item (OpenMausBot). It closes the gap between the in-flight lock and the row leaving the list.
- A short spinner or `sending…` while the answer is in flight (gitui spinner). Mockup frame 20 already has `sending…`.

### Keys and the footer

- `key word` pairs joined by `·`, the key bright and the word dim (Codex, Claude Code, Hermes TUI, toad, claude-tasks, openhuman). This is the footer `keys.rs` generates.
- The footer changes with the open overlay and shows only the overlay's keys (gitui, Hermes TUI). This matches the exclusive contexts in `key-map.md` §1, and the two footers §3.4 draws before and after text mode.
- Give a one-line footer room or wrap it: dekit's is cut off at the right edge. Our two-line footer is the fix; add a test that every label fits at 80 columns.
- `[` and `]` for previous and next tab already exist in gh-dash, which makes our fallback pair less strange to users (`key-map.md` §3.2).

### Glyphs and colour

- Glyph plus word on every row is common in good tools (process-compose, dekit, Hermes TUI). This confirms `glyph-table.md` §1 and §6.
- The tools that colour whole rows by state with no glyph (k9s, aerc) read badly in a monochrome screenshot, which is the Mono test in `glyph-table.md` §6.
- btop's tty mode and gemini-cli's ANSI theme show a full UI in the terminal's own 16 colours. Our System palette should use only named ANSI colours, so it follows the user's terminal theme.
- ▲ and ▼ (gemini-cli) or a scrollbar (ratatui, gitui) when a list has hidden rows. Optional; the page keys already exist.

### States: empty, loading, error, stale

- Empty states in three short lines: what is missing, how it fills, and where it comes from (posting). For Routines, add the one-line definition of a routine (OpenMausBot). This shapes the `empty` row in `component-inventory.md` §2.
- An absent value explains itself ("No worker log yet (task hasn't spawned …)", Hermes) instead of a blank. Same rule as `? missing` in `glyph-table.md` §3.
- Errors do not open a modal (gitui's red Error box blocks the screen). Our rule is the better pattern; keep it: a failed read keeps the rows and puts the first stderr line in the status row (`stale`), or in the body when there were no rows (`error`), per `component-inventory.md` §2.
- Connection state in the status line (aerc "Connected", openhuman "Ready · Offline preview"). Our header's `stale 2m` does the same job.

### Tab bar, banner, palette and help

- A count on the Inbox tab label (gh-dash `Review (0)`, aerc `INBOX 13`, hermes-muse `Feed 5`). This would duplicate the banner's count in the tab row. The operator declined it on 2026-11-25: the tab stays `2 Inbox` and the banner alone carries the count.
- The banner is a short count and a key; details wait until the item opens (agent-deck doorbell). This matches our banner.
- Help as the key table in columns grouped by context, two or three columns when wide and one when narrow (Codex, gh-dash, btop). That fits `palette and help` in `component-inventory.md` row 10.
- The palette shows a one-line description of the highlighted entry at its foot (openhuman demo capture, layout only).

---

## 3. Adopt

1. Stable group order and next-row selection across refreshes, with a reducer test (Codex).
2. The overlay order: kind, description, the command or question set apart, reason, numbered choices with their key, footer of keys (Codex, Claude Code).
3. One plain next-step line in the refused and gone states (Codex, OpenMausBot).
4. The outcome word on the row after an answer, until the next refresh (OpenMausBot).
5. Glyph plus word on every row, and the failure reason or exit code in the detail (process-compose, dekit, Hermes).
6. Three-line empty states, with a routine definition on the Routines tab (posting, OpenMausBot).
7. Routines columns of next run (relative or date), status word and last outcome, `-` for none (claude-tasks, rakazo).
8. A footer of `key word` pairs joined by `·`, overlay keys only while an overlay is open, and an 80-column fit test (Codex, gitui, dekit).
9. Help as the grouped key table in columns (Codex, gh-dash, btop).
10. System palette from named ANSI colours only (btop tty, gemini-cli ANSI).

## 4. Avoid

| Seen in | What | Why we do not |
|---|---|---|
| Claude Code, Codex, agent-of-empires | "Don't ask again", "allow for this session", "Always" | No rule store in this phase; `a` and always are unbound (`key-map.md` §5) |
| Codex | The deny option bound to Esc | Esc closes and writes nothing; only `n` denies (`key-map.md` §3.3) |
| Codex, Claude Code, bottom | The cursor starting on Yes, so Enter approves | In our overlay Enter is bound only in text mode, to send the typed line; a decision needs its own key (`key-map.md` §3.4) |
| claude-squad | An "auto-yes" mode | The screen never answers on its own |
| claude-tasks, claude-squad, dekit | `q` to quit | `Ctrl+D` quits; a bare letter would clash with the palette filter (`key-map.md` §5) |
| Claude Code, gemini-cli, claude-squad, openhuman | Tab to amend, switch scope or cycle focus | No focus ring and no hit testing, so Tab stays unbound (`key-map.md` §5) |
| btop, toad, openhuman | Mouse as a main input | Mouse support is out of scope (`key-map.md` §5) |
| gitui | A full-screen error modal | A failed read keeps the rows and uses the status row, or the body when there are no rows (`component-inventory.md` §2) |
| k9s, aerc | Row colour as the only state signal | Meaning is in the glyph and the word (`glyph-table.md` §6) |
| dekit | A one-line footer that cuts off | Two footer lines, every bound key drawn |
| Codex, toad | Emoji in rows (☁️, 📌, 🔧) | Emoji widths vary between terminals; our glyph set and its ASCII fallback only |
| gitui | Popups stacked on popups | One overlay at a time keeps one context of keys |
