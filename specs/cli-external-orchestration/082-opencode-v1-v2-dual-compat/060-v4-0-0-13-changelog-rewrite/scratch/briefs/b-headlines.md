ROLE: Release-notes writer for the Skilled framework.

TASK: Rewrite the two headline sections of the v4.0.0.13 changelog into `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/fragments/b-headlines.md`.

CONTENT:
1. `&nbsp;` then `## In-Session Handover`, rewritten from before.md's section of that name.
   - Open with one short lead paragraph, with no heading, that says what you get, the way v4.0.0.0's topical sections open.
   - Then at most 6 H4 items. Candidates:
     - the hand-over at 80 percent;
     - the fresh session that picks up the note;
     - which runtimes hop on their own;
     - the stuck hop and the hop history, merged into one item;
     - a session outside the loop and sub-agents, merged if it reads naturally;
     - the live proof.
   - Keep every fact a user acts on or notices:
     - the 80 percent reminder and the second one 5 percent later;
     - the hop cap of ten and the ten-minute freshness limit;
     - the 30-second watcher timeout and its notification title;
     - the hop-history path and the history command;
     - `SESSION_RELAUNCH_NOTIFY_HOPS=1`;
     - the keep command for a session outside the loop;
     - which runtimes are pointed back to the note after compaction;
     - the thirteen situations and the four faults.
2. `&nbsp;` then `## OpenCode 1 and 2`, rewritten from before.md's section of that name.
   - Same shape: a short lead paragraph, then at most 7 H4 items. Keep it about the same length as the handover section.
   - Keep these facts:
     - one source for all 17 plugins through the bridge, with the mapping in one sentence;
     - the seven plugins that loaded on OpenCode 2 but did nothing, and sk-vision on v2;
     - one set of agents, one set of commands and one `opencode.json`;
     - the `.markdown` rename of the 12 non-command files, with the 40 and 42 command counts;
     - dispatch that follows the installed version: `--version`, `opencode2` before `opencode`, `OPENCODE_BIN`, `run --standalone` and `provider/model#variant`;
     - the side-by-side setup script with its four modes, and the `opencode2` launcher with `OPENCODE_DB`;
     - one default model on both versions;
     - the guards that know the version, and Pi's plain-text authorization rule;
     - testing: the live proof run twice, the three CI checks and what the battery fails on, the 323-file review with all 5 critical and 47 high-severity findings fixed, the independent read-only review, and the suite table, kept as a table because the operator asked to show the testing;
     - what still differs between the versions.

Write the default model exactly as before.md states it: `llmgateway/deepseek-v4.1-flash` at `max`. Do not mention any newer model.

Make each section tighter than before.md by roughly a third.
