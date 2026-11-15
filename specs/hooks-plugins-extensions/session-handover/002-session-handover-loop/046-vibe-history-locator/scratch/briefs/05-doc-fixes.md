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
You are the doc agent. Change two sentences. Keep every other word.

ACTION
1. `README.md` at the repository root: the sentence "Only Claude Code and Codex senders get one."
   becomes "Only Claude Code, Codex and Vibe senders get one."
2. `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md`,
   the paragraph that starts "Only Claude Code, Codex and Vibe have a locator contract.": rewrite its
   second and third sentences as these three, in this order:
   "Claude's transcript comes from the session log the runtime keeps, under `CLAUDE_CONFIG_DIR` when that is set, and Codex's from its rollout file."
   "Vibe's comes from its session folder, and the folder the session ran in from that folder's `meta.json`, its `environment.working_directory` or else its `origin_directory`."
   "A sender on another runtime has no transcript to read and gets no locator."

Rules: no em dash, no semicolon. Do not bump any version field. Do not edit any other file.

FORMAT
Run `rg -n "Only Claude Code and Codex senders" README.md .skilled` and end your reply with its
output (expected: nothing) and the two changed lines.
