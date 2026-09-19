Plain words: that's a lookup system, not a rulebook.

The repo keeps its rules in separate files under `repo-rules/`. REPO RULES.md itself holds no rules. It is the table of contents. Its only job is to tell you which file to read before you do a thing.

The mechanism. You're about to act. You find that action in the trigger table. The table names the files that govern it. You read them. Then you act. Read first, act second, because a rule read after the edit is just an autopsy.

One example. You're about to overwrite a config file. That's the "delete, overwrite" row, and it points at blast-radius.md. That file tells you to rate what the change can break, write down how to undo it, and wait for a yes on anything irreversible. Now you know the drill before the first edit, not after.

Three boundaries.

If a rule file disagrees with AGENTS.md, AGENTS.md wins and the rule file is wrong. There's a priority ladder for this: AGENTS.md's hard blocks, then your direct instruction, then the rule files, then plain judgment. A rule file can only add strictness, never subtract.

If no trigger matches, you read nothing extra. Don't go hunting for a rule to apply.

If several triggers fire, you load every file they named. They're written to be used together, so three firing at once is normal.

The section 8 part: three of those files are just about how the assistant talks to you.

- communication.md, how the sentences themselves read.
- presenting-decisions.md, how a choice or recommendation gets put in front of you.
- handoff-and-questions.md, what you're told to do when the turn ends.

Those three fire on nearly every reply, not only the big ones. The rest of the pack fires by action: build, test, delegate, delete, debug, confess uncertainty.

What the whole thing covers: how to think and act. How much to build, what counts as proof, when to stop and ask, how a reply reads. What it doesn't cover: which skill or command does the job. That part lives in AGENTS.md and in the skills themselves.

If one part is still the sticking point, name it and I'll redo just that part.
