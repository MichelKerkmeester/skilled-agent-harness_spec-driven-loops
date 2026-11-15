REPOSITORY ROOT: /Users/michelkerkmeester/worktrees/public/413-vibe-history-locator
Every read, write and command uses this root. Your environment block may name a different
"Workspace root folder": ignore it, it is another checkout of the same repository.

GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/046-vibe-history-locator

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when the files are changed on disk and the verification command has run.

ROLE
You are the doc agent. Change only the sentences named below. Keep every other word.

CONTEXT
A claim now mints a history lookup locator for a Vibe sender too. Vibe's session folder is
`$VIBE_HOME/logs/session/unified/<session_id>` (or `~/.vibe/...` when `VIBE_HOME` is unset), and
the folder the session ran in comes from that folder's `meta.json`. A Vibe sender's printed command
starts with `SPECKIT_RUNTIME=vibe `.

ACTION
In each place below, change "Claude Code and Codex" or "Claude Code or Codex" so it names
Vibe as well ("Claude Code, Codex and Vibe", "a Claude Code, Codex or Vibe sender").
1. `.skilled/hooks/session-handover/README.md`, the line that starts "Only Claude Code and Codex senders get a locator."
2. `.skilled/hooks/injection-contract.md`, the sentence "Only Claude Code and Codex senders get a locator."
3. `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`, the sentence "Only a Claude Code or Codex sender gets one,"
4. `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md`:
   the sentence "Only a Claude Code or Codex sender gets a locator," and the paragraph that starts
   "Only Claude Code and Codex have a locator contract." In that paragraph add one sentence after the
   Codex one: Vibe's comes from its session folder, and the folder the session ran in from that
   folder's `meta.json`.
5. `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md`:
   the three places that say "Claude Code or Codex sender", and the sentence about the
   `SPECKIT_RUNTIME=codex ` prefix, which becomes: a Codex or Vibe sender's command carries the
   `SPECKIT_RUNTIME=codex ` or `SPECKIT_RUNTIME=vibe ` prefix, and a Claude sender's carries none.

Rules: no em dash, no semicolon. Do not bump any version field. Do not edit any other file.

FORMAT
Run `rg -n "Claude Code and Codex senders|Claude Code or Codex sender|Only Claude Code and Codex have" .skilled`
and end your reply with its output (expected: nothing) and the files you changed.
