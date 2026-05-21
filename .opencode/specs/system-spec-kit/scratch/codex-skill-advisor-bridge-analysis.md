Wrote the report to `/tmp/codex-skill-advisor-bridge-analysis.md`.

Bottom line: parent diagnosis is confirmed, but incomplete. `mk-skill-advisor` has launcher-side bridge code and the OpenCode plugin spawns through `StdioClientTransport`, but `advisor-server.ts`/dist does not start any daemon-side socket listener. I also found a second issue: the OpenCode bridge and skill-advisor launcher env allowlists strip `SPECKIT_IPC_SOCKET_DIR`, so a robust fix needs both daemon-side binding and env propagation.

I verified the repo files remained unchanged.