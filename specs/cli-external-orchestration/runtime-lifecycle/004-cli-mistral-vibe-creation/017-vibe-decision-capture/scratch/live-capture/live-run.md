# Live capture run

Run 2026-11-15 by phase 022's `VIB-HK-020` conversation, through the shared runner with the `vibe` runtime: an interactive Vibe 3.1.2 TUI on `deepseek-flash`, with the rendered home hooks in a fresh `VIBE_HOME`. It passed 2/2 (`022-vibe-hook-playbook-and-live-scenarios/scratch/live/VIB-HK-020/matrix.md`).

- Turn `answer-question`: the model asked one `ask_user_question`, which the runner answered. The check found exactly one queue record, keyed `vibe:<session id>:<tool call id>:0`, with that call id in the journal.
- Turn `second-question`: a second question was asked and answered. The queue then held two records with distinct keys, carrying both answers.

Evidence copied from that run:

- `live/queue.jsonl`: the session's queue file, two records.
- `live/journal/`: the session journal.

`pendingRecords(<scratch project>, 1102c1ce-1665-7b3b-89aa-c7700b9f01a1)` prints `2` after both answers. The task's `1` is the count for one answered question, which the first turn's check observed before the second question was asked.
