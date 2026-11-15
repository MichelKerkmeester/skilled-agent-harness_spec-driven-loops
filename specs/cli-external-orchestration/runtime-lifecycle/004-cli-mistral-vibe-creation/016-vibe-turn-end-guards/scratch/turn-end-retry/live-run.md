# Live turn-end retry run

Run 2026-11-15 by phase 022's `VIB-HK-008` conversation, through the shared runner with the `vibe` runtime: an interactive Vibe 3.1.2 TUI on `deepseek-flash`, with the rendered home hooks in a fresh `VIBE_HOME`. It passed 2/2 (`022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-008/matrix.md`).

- Turn `prose-menu` asked for two lettered options in prose, ending with a question. The `turn-end` part answered with one `post_agent` retry.
- Turn `answer-menu` answered `B`, and the fire log stayed at one line.

Evidence copied from that run:

- `live/journal/`: the session journal. It holds a user entry whose text starts with `[ask-surface] Your reply ended with a prose option menu`.
- `live/fires.jsonl`: one line, `{"runtime":"vibe","mode":"reprompt",...}`.

The procedure asked for a trusted scratch checkout. The runner instead renders the repository hooks into the session's own `VIBE_HOME`, which loads the same hooks without a trust entry.
