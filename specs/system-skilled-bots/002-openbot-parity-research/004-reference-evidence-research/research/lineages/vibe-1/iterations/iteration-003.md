# Iteration 3: Phase 003-terminal-screen — the built openhuman-tui crate

## Focus

Phase 003-terminal-screen, which no frontier node covers. The topic says `openhuman-full` carries "a built openhuman-tui crate that openhuman-main lacks", so this iteration tested that premise and then read the crate for what the screen's six children should lift or mirror.

Scope read: `context/openhuman-full/crates/openhuman-tui/src/` (53 files, 9,601 lines), `context/openhuman-main/crates/openhuman-tui/`, `context/openhuman-full.build.log`, `003-openbot-parity-build/003-terminal-screen/spec.md` and its `002-architecture-and-contracts` and `003-shell-and-navigation` children.

## Findings

1. **The topic's premise is half wrong, and the correction matters for every later iteration: `openhuman-main`'s `vendor/` holds 21 empty directories, and the `openhuman-tui` source is byte-identical in both checkouts.** `diff -rq openhuman-main/crates openhuman-full/crates` prints nothing, and `diff -rq openhuman-main/crates/openhuman-tui openhuman-full/crates/openhuman-tui` prints nothing, so the TUI crate is the same 53 files and 9,601 lines in both. What `openhuman-full` adds is the vendored crate *sources*: every one of `openhuman-main/vendor/*` holds 0 files, while `openhuman-full/vendor/*` holds the real crates [SOURCE: specs/system-skilled-bots/context/openhuman-full.build.log:950] [SOURCE: specs/system-skilled-bots/context/openhuman-full.build.log:956]. The build log proves `openhuman-tui v0.64.20` compiled in `openhuman-full` in 4m 33s, so "built" is true as a build event and false as a source difference. The 001 synthesis's claim that openhuman "ships the only full terminal client" stands; the claim that the full checkout adds a TUI does not. (observed)

2. **The reference's transcript reducer ignores events for another `client_id`, so one process-wide broadcast bus can be drained safely — the guard a multi-bot screen needs.** `TranscriptState::apply_event` folds a typed `WebChannelEvent` into the transcript and "events for a different `client_id` are ignored, so a process-wide broadcast bus can be drained safely" [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/state.rs:1-12]. Phase 003's `002-architecture-and-contracts` child creates an event source and a pure reducer but states no filter for an event that belongs to another bot or another run [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md:60]. A screen that draws several bots from one bus needs that filter, and the reference's rule is one line. (observed)

3. **The reference stamps every transcript entry with a monotonic revision so the renderer can skip what did not change; the plan's only draw optimisation is row windowing.** `Entry` carries a `revision: u64` taken from a process-wide `AtomicU64` [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/state.rs:21-24] [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/state.rs:45-51]. Phase 003's `004-panes` child tests "a 2,000-row draw that visits only the rows its body holds", which bounds the work by the visible window and not by what changed [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md:3]. The two are complementary: windowing bounds the rows visited, a revision bounds the cells redrawn inside them. (observed)

4. **The reference's status vocabulary has six values and distinguishes cancelled from failed and stale from unknown; the plan's seven activity groups fold both away.** `Status` is `Running`, `Success`, `Error`, `Waiting`, `Cancelled`, `Unknown`, each with a `label()` and a `marker()`: running/"·", done/"✓", failed/"✗", needs input/"!", cancelled/"–", stale/"?", where `Unknown` is labelled "stale" [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs:5-35]. Phase 001's seven groups are `needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:112], so a cancelled run has no group of its own and a stale read has no marker at all. The reference's `stale` is the one worth adding: it is the state a screen shows when its data is older than the runtime, which is exactly what phase 001's refresh-on-read can fail to do. (observed)

5. **The reference's four tabs are a closed cycle with `ALL`, `title`, `next` and `previous`, and its order is declared part of the CLI UX contract; the plan's key map has six exclusive contexts and no cycle.** `AppTab` is `Logs`, `Chat`, `Config`, `Settings`, with `ALL: [Self; 4]`, `title()`, and `next`/`previous` wrapping by modulo [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/ui_state.rs:8-36]. Phase 003's key map has six exclusive contexts and binds typing only in the overlay and palette contexts [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:181-196]. The reference's cycle is the cheaper model and the plan's contexts are the more precise one; the evidence supports keeping the plan's contexts and adding the reference's `ALL`-array-plus-`next` shape so the tab order has one declaration rather than one per key binding. (observed)

6. **The reference filters control characters out of drawn text; the plan replaces each with `?`, and the plan's side is the better one.** `safe_text` keeps every character that is not a control character and keeps `\n` [SOURCE: specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs:88-93]. Phase 003's `theme::printable` replaces each control character with `?` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/spec.md:150]. A filter makes a corrupted string look clean and hides that anything was removed; a replacement shows the reader that a byte was there. The evidence supports the plan, and the reference is the counter-example worth citing in the phase so a builder does not "simplify" to a filter. (observed)

## Ruled Out

- **Reading `openhuman-main`'s TUI as a different, older crate.** It is byte-identical to `openhuman-full`'s, so there is no second version to compare and no "built" source to prefer.
- **Lifting the reference's `AppTab` set as the screen's tabs.** Its four tabs are Logs, Chat, Config and Settings; the plan's screen draws activity, inbox, routines and chat, so only the cycle shape transfers, not the tab list.
- **Treating the missing `target/` directory as evidence the crate was never built.** The build log records the compile and the link warning; the target directory is simply not in the checkout.

## Dead Ends

- A second TUI implementation in `openhuman-full`: `crates/` is identical to `openhuman-main`'s and the only other UI surface is `crates/openhuman-app` (a desktop app), so there is no second terminal client to compare.
- The reference's `cockpit.rs` overlay and approval banner: read for the approval surface, but phase 003's `005-answer-flow` child already specifies the banner and the overlay, so nothing there is new.

## Edge Cases

- Ambiguous input: the topic's premise about `openhuman-full` conflicts with the checkout. Resolved by measuring both trees and recording the correction as finding 1 rather than deferring it.
- Contradictory evidence: the topic says `openhuman-full` has a built TUI that `openhuman-main` lacks; the trees say the source is identical and the build log says it compiled. Both are recorded; the build log is the better evidence for "built" and the diff is the better evidence for "lacks".
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- specs/system-skilled-bots/context/openhuman-full.build.log:950, 956
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/state.rs:1-12, 21-24, 45-51
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/activity.rs:5-35
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/ui_state.rs:8-36
- specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui/src/theme.rs:88-93
- specs/system-skilled-bots/context/openhuman-main/vendor/ (21 directories, 0 files each)
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:237-247
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/spec.md:60, 144
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/003-shell-and-navigation/spec.md:150, 212
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/004-panes/spec.md:3, 44
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:112
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:181-196
- specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md (absent at read time)

## Assessment

- New information ratio: 0.92
- Questions addressed: phase 003-terminal-screen (no frontier node covers it)
- Questions answered: none of the tracked questions; this is a broadening iteration

## Reflection

- What worked and why: measuring the premise before reading the code. Two `diff -rq` calls and one `find` turned the topic's central claim about `openhuman-full` into a precise statement — the vendored sources are the difference, not the TUI — which changes what every later iteration should read in that checkout.
- What did not work and why: looking for a second TUI implementation. `crates/` is identical between the checkouts, so the search had one possible answer and cost two calls.
- What I would do differently: check `vendor/` file counts before reading any crate under `openhuman-main`, so an empty directory is never mistaken for a missing feature.

## Recommended Next Focus

Phases 006-approval-grants and 007-per-bot-apps together: `OpenBot-main/shared/tool-name.ts` and `docs/approvals.md` for the ladder, `OpenGhost-main/rules.js` for the hook-compatible rules engine, and rakazo's per-bot app and secret layer.
