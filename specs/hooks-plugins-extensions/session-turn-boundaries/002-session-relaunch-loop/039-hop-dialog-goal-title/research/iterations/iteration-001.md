# Iteration 1: The Mobile Rename

## Focus

The operator reports that a Claude `/rename` made in the mobile app does not carry over a hop. This iteration traces how `prepare` finds a session name, finds every local place a title is stored, checks what a remote rename writes, and gives verdicts on the four parts of the question: what a mobile rename writes and where, whether a `custom-title` entry reaches the local log `prepare` reads, the most likely reason the name is lost on a hop, and what a test or live check needs.

## Actions Taken

1. Read the state files: `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`. Iteration 1, no prior records.
2. Read the name path in the relaunch code:
   - `.skilled/hooks/session-relaunch/lib/context-usage.cjs` (tail search, `settingText`, `readClaudeSettings`, title readers)
   - `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` (`claudeSessionLogPath`, `resolveSessionSettings`, `preparePending`)
   - `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` (prepare name ranking)
   - `.skilled/bin/skilled-loop` (`name_is_replayable`, `name_stem`, `append_name_arguments`, live-name consumption)
3. Read the name tests in `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs` and `tests/session-relaunch-cli.test.cjs`.
4. Surveyed the local Claude stores read-only for entry types and field names only (no conversation text): `~/.claude/projects/**/*.jsonl`, `~/.claude/sessions/*.json`, `~/.claude/history.jsonl`, `~/.claude/transcripts/*.jsonl`.
5. Read vendor documentation for Remote Control, sessions and mobile.
6. Read the recorded limitations of 039/003 and 038/012 to carry them forward.

## Findings

### F1. `prepare` resolves a Claude name from the transcript only -- CONFIRMED

`resolveSessionSettings` sends a Claude session to `claudeSessionLogPath` and then `readClaudeSettings` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:766]. `claudeSessionLogPath` scans `~/.claude/projects/*/<sessionId>.jsonl` and returns the first match [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619]. `readClaudeSettings` takes the last non-empty `custom-title` entry's `customTitle` [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:244] and separately the last non-empty `ai-title` entry's `aiTitle` [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:250]. Both searches use `latestTailEntry`, whose default read is 262144 bytes [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:18] and which widens on a miss up to 16 MiB [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:21] [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:113]. `prepare` then ranks `settings.name || SKILLED_LOOP_NAME || settings.generatedName || null` [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592] and writes the winner as `name` in the pending record [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:976]. Nothing in this path reads any store other than the transcript.

### F2. A second local title store exists and `prepare` never reads it -- CONFIRMED

`~/.claude/sessions/<pid>.json` (observed locally; not in the repository) carries `name`, `nameSource`, `nameSince` and `bridgeSessionId`, alongside `sessionId`, `pid`, `kind`, `entrypoint` and `status`. The only `sessions` directory the relaunch code reads is Codex's rollout folder under `~/.codex/sessions` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:697], not Claude's session store. A grep of `lib/` and `bin/` for `nameSource` returns no hit. So a title that lands only in this store is invisible to `prepare`.

### F3. Vendor: a remote rename updates the local title, with a version floor -- CONFIRMED

The Remote Control page states: "When you rename a session from claude.ai or the Claude app, Claude Code also updates the local title shown in `claude --resume`" [SOURCE: https://code.claude.com/docs/en/remote-control]. The sessions page states the same route and adds: "Requires Claude Code v2.1.221 or later" [SOURCE: https://code.claude.com/docs/en/sessions]. The remote title order is `--name`/`--remote-control`, then `/rename`, then the last meaningful message, then an auto-generated name [SOURCE: https://code.claude.com/docs/en/remote-control]. The vendor says "local title", which is the store in F2; it does not say the rename writes a transcript `custom-title` entry.

### F4. Local evidence: remote-bridged sessions have matching transcript titles, but the client is not marked -- PARTIALLY CONFIRMED

Entry types observed under `~/.claude/projects/`: `custom-title` with keys `customTitle,sessionId`; `ai-title` with keys `aiTitle,sessionId`; `bridge-session` with keys `sessionId,bridgeSessionId,lastSequenceNum,ownerAccountUuid,ownerOrganizationUuid`; plus `last-prompt`, `summary`, `system`, `queue-operation` and the usual turn entries. 58 transcript files contain a `custom-title` entry and there are 33569 `customTitle` field occurrences. Of the 6 live `~/.claude/sessions/*.json` files, all 6 are `kind=interactive` and carry `bridgeSessionId`; `nameSource` is `user` in 5 and `derived` in 1. In all 5 `user` cases the store `name` equals the last transcript `customTitle`; the single `derived` case has no `custom-title`. That proves user names on bridged sessions are mirrored into the transcript on this machine, but no field says whether the rename came from the CLI, the desktop app, claude.ai or mobile, so it does not attribute any sample to a mobile rename. `~/.claude/history.jsonl` and `~/.claude/transcripts/ses_*.jsonl` hold no title field, so they are not alternate sources.

### F5. The version gate is not the cause on this machine -- CONFIRMED

Transcript `version` values locally include 2.1.295, 2.1.296, 2.1.302, 2.1.310, 2.1.316, 2.1.317, 2.1.319 and 2.1.322, all at or above the 2.1.221 floor the vendor gives for a remote rename reaching the CLI [SOURCE: https://code.claude.com/docs/en/sessions]. On a machine below 2.1.221 the remote rename would not reach the local title and the hop would lose it for that reason instead.

### F6. Most likely reason the name is lost -- CONFIRMED as a code gap, UNCONFIRMED as the operator's exact path

There are two failure shapes and the code makes both silent:

1. **Store-only rename.** If the remote client updates the running session's `name`/`nameSource` (the local title the vendor says `--resume` shows) without flushing a `custom-title` entry to the transcript, `prepare` still reads the old transcript value and falls through to `SKILLED_LOOP_NAME` or `ai-title` [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592]. The receiver is then launched with the launch or generated name and the operator's rename is dropped. This is the smallest code-level explanation: one store is written, the other is read.
2. **Cloud-session rename.** If the operator renamed a cloud session (the mobile Code tab also lists cloud sessions and Dispatch sessions, which do not run on this machine) [SOURCE: https://code.claude.com/docs/en/mobile], no local file changes at all and no hop could carry it.

A third, weaker shape is timing: `prepare` snapshots the name when it runs, so a rename made after `prepare` (or after the pending record is armed) cannot be seen. It does not explain a rename made before the turn ended. The deciding live evidence is missing for both main shapes: a read-only check of the transcript and the session store immediately after a mobile rename, compared with the `prepare` record.

### F7. The tail cap is not the mobile-specific cause -- CONFIRMED

The 16 MiB ceiling [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:21] and the widening loop [SOURCE: .skilled/hooks/session-relaunch/lib/context-usage.cjs:113] are the same for CLI and remote renames, and the 038/012 limitation already records that a title older than the cap is missed [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/implementation-summary.md:113]. It can drop any old rename, not a mobile one specifically.

### F8. Smallest change and the test/live check it needs

**Smallest change**: add a Claude session-store reader beside `claudeSessionLogPath` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619]. It should scan `~/.claude/sessions/*.json` (or `$CLAUDE_CONFIG_DIR/sessions`), match the entry whose `sessionId` equals the sender id, require `nameSource === 'user'` and a non-empty `name`, and pick the newest `nameSince` when more than one matches. In `resolveSessionSettings` [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:766] use that value as `name` when the transcript read proves no `custom-title`, keeping `SKILLED_LOOP_NAME` and `generatedName` below it. Reject `nameSource=derived`, a stale file without a matching `sessionId`, and a control-character name (the wrapper already applies `name_is_replayable` [SOURCE: .skilled/bin/skilled-loop:276]). Cost is one directory scan plus one small JSON read per live session, not another transcript tail search, so the 039/003 cost limitation does not grow [SOURCE: specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry/implementation-summary.md:129].

**Unit test**: a fixture with a session store holding `name: 'from app'`, `nameSource: 'user'`, `sessionId` equal to the fixture's log, and a transcript with no `custom-title`; assert `prepare` records `from app`. A second case with both a transcript `custom-title` and the store should pin the precedence. Today the first case fails because no store reader exists. Existing tests cover only the transcript path: the custom-title reader [SOURCE: .skilled/hooks/session-relaunch/tests/context-usage.test.cjs:497], the generated fallback [SOURCE: .skilled/hooks/session-relaunch/tests/context-usage.test.cjs:523], the past-default-tail case [SOURCE: .skilled/hooks/session-relaunch/tests/context-usage.test.cjs:560], and `prepare` ranking [SOURCE: .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2825] [SOURCE: .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2853] [SOURCE: .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2865].

**Live check**: on Claude Code 2.1.221 or later, start a Remote Control session, rename it in the app, then (read-only) check three things: the transcript gains a `custom-title` with the new text, the `sessions/<pid>.json` store shows `nameSource=user` with a fresh `nameSince`, and a following `prepare` records that name with the receiver launched as `--name "<stem> (2)"` per `append_name_arguments` [SOURCE: .skilled/bin/skilled-loop:418]. A single such run decides both failure shapes. It was not run here: the prompt forbids starting a runtime session or running `prepare`.

## Ruled Out

- **Version floor.** Ruled out on this machine, where transcripts show 2.1.295 to 2.1.322, above the 2.1.221 floor (F5). It remains a cause for older installs.
- **`~/.claude/history.jsonl` as a title source.** It holds `display`, `pastedContents`, `timestamp`, `project`, `sessionId`; no title field (F4).
- **`~/.claude/transcripts/ses_*.jsonl` as a title source.** Its entry types are `user`, `assistant`, `tool_use`, `tool_result`; no title field (F4).
- **Reading the store name regardless of `nameSource`.** Rejected as the smallest change: it would carry the auto-generated `derived` title above the launch name and undo the 039/003 ranking [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592].
- **The 16 MiB tail cap as a mobile-specific cause.** It is runtime-agnostic and already recorded by 038/012 (F7).

## Dead Ends

- No repository code path reads `~/.claude/sessions` for Claude, so there is no existing implementation to build on; the change is new code, not a wiring fix.
- The local sample cannot distinguish a mobile rename from a CLI rename: no entry type, field or log carries the client. Attribution needs a live run, not more log mining.

## Edge Cases

- **Ambiguous input**: "mobile rename" can mean a Remote Control rename of a local session or a rename of a cloud session. Both are reported; the first is the only one a hop can carry.
- **Contradictory evidence**: the vendor promises the local title is updated, while the local sample cannot prove the mobile path writes a transcript entry. Both are preserved; the store reader is the change that reconciles them without assuming which write lands first.
- **Missing dependency**: no live runtime was started (operator constraint), so the exact mobile write remains UNCONFIRMED. The smallest missing read-only evidence is: after one mobile rename, diff the transcript tail and the session store.
- **Partial success**: code anchors, vendor statements and local store structure were confirmed; the attribution of the local samples to mobile is not.

## Sources Consulted

- `.skilled/hooks/session-relaunch/lib/context-usage.cjs:18`, `:21`, `:113`, `:234`, `:244`, `:250`
- `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:619`, `:697`, `:766`, `:976`
- `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:592`
- `.skilled/bin/skilled-loop:276`, `:286`, `:418`, `:1436`
- `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs:497`, `:523`, `:560`
- `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2825`, `:2853`, `:2865`
- `.skilled/hooks/session-relaunch/README.md:49`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/012-session-name-carry/implementation-summary.md:110`
- `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/003-generated-title-carry/implementation-summary.md:124`
- Local, not in the repository: `~/.claude/projects/**/*.jsonl` (entry types and field names only), `~/.claude/sessions/*.json` (keys and `nameSource` counts only), `~/.claude/history.jsonl`, `~/.claude/transcripts/*.jsonl`
- https://code.claude.com/docs/en/remote-control
- https://code.claude.com/docs/en/sessions
- https://code.claude.com/docs/en/mobile

## Assessment

- New information ratio: 0.82
- Questions addressed: the mobile-rename key question (all four parts)
- Questions answered: the mobile-rename key question, with the exact mobile write path still UNCONFIRMED

## Questions Answered

- **Mobile-rename key question**: answered in four verdicts. What a mobile rename writes: the vendor confirms it updates the local title shown by `claude --resume` (v2.1.221+), which is the `~/.claude/sessions/<pid>.json` `name`/`nameSource` store. Whether a `custom-title` entry reaches the log: confirmed for user-named bridged sessions locally, but not attributable to mobile. Why the hop loses it: `prepare` reads only the transcript, so a store-only rename falls back to the launch or generated name. What a test needs: a store-only-name fixture plus a precedence case, and one live before/after read.
- The exact mobile write path stays **UNCONFIRMED**; the missing evidence is named in Edge Cases.

## Questions Remaining

- Packet 039 residual gaps (children 001, 002 and 003): real or not, how they fail, smallest change.
- Packet 038 limits by child (001 to 017).
- Packet and parent open ends: the killer test failure, a Codex goal reader, the 002 parent goal binding inside 4,000 characters, phase 033 Draft, and the sk-git `Commit-Id` rebase claim.
- Live proof and ranking: which fixes lack a live hop, the smallest live-run set, and the impact-versus-cost ranking.

## Reflection

- **What worked and why**: reading the name path from the reader down to the launch flag in one pass found the asymmetry that matters -- the vendor names a local "title" store, while `prepare` reads only the transcript. Surveying the local stores with field names only found that store without touching conversation text.
- **What did not work and why**: trying to infer the client from entry types failed because no field records it; more log mining would not answer the question.
- **What I would do differently**: if a live check is ever allowed, capture the transcript tail and the session store immediately before and after one mobile rename; that is one run and it decides the attribution.

## Next Focus

Iteration 2 of the plan: packet 039 child 001 -- whether a pending record Stop cannot arm refuses every question, whether dialogs other than `AskUserQuestion` park a hop, the unreadable-record case, and the same gap on Pi, OpenCode and Codex.

## SCOPE VIOLATIONS

None. All writes landed in the iteration and delta paths; research targets were read-only.
