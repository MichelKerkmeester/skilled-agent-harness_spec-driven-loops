REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/406-vibe-automatic-handover
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/045-vibe-automatic-handover

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when files exist on disk and the verification command has been run.

ROLE
You are the markdown agent: you edit existing docs in place, in the voice already there.

CONTEXT
Mistral Vibe now hands over automatically, the way Codex does. The facts to write:
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs` holds two parts. The context part runs
  in the `pre_agent` turn-start composer (last part) and in the `post_tool` compaction binding: at a
  turn start it expands a claim seed or withdraws an armed hand-over when the operator types, and at
  either event it nudges once the fill passes the threshold. The arm part runs last in the
  `post_agent` turn-end composer: it arms a pending record and starts the killer, and never denies.
- The fill is the newest measured `input_tokens` in the session journal; the window is Vibe's
  `compaction_threshold`, and `SESSION_HANDOVER_WINDOW_TOKENS` overrides it.
- The switch is `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED` (off by default, like every runtime but
  Claude Code).
- Limit: Vibe gives its tools no session id, so a hand-over the operator starts by typing
  `/speckit-handoff` prepares with a `uuidgen` id, is not armed, and the wrapper prints the claim
  command as before. A nudged hand-over carries the real id and arms.
- Interactive Vibe exits 0 on the killer's SIGTERM.

ACTION
Edit only these places so they state the facts above. Change the sentence or table cell that says
Vibe is command-only or has no idle or compaction event; keep everything else as it is.
1. `.skilled/hooks/README.md`: the Vibe cell of the `session-handover` coverage row becomes
   `✓ covered`.
2. `.skilled/hooks/session-handover/README.md`: the sentence near line 19 naming the runtimes that
   ship on the command trigger, and the Vibe row of the runtime table near line 31.
3. `.vibe/plugins/README.md`: the row near line 135.
4. `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/guards-and-hooks.md`: the
   `session-handover.js` row near line 134 and the first bullet under "What Is Not Portable" (move
   the automatic hand-over out of that list, keep the limit sentence).
5. `.skilled/hooks/session-lifecycle/vibe/README.md`: the description frontmatter, the turn-start,
   turn-end and "no compaction event" paragraphs, and the turn-start, turn-end and
   compaction-post-tool table rows, so each names the hand-over part.

Rules: plain sentences, no em dashes, no semicolons. Never name a spec folder, phase or packet
number in new text. Do not touch any other file.

FORMAT
Run `rg -n -i "no idle or compaction event|command trigger only, no automatic hop because Vibe" .skilled .vibe`
and end your reply with its output (it must print nothing), then the list of files you changed.
