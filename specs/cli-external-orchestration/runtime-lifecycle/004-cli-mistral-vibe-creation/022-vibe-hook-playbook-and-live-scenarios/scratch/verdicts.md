# VIB-HK verdicts

One row per hook scenario. `Runner row` is the `vibe` row of the scenario's `matrix.md` as last run, and `-` means the runner was not used. An OPERATOR-ONLY row carries a `procedure.md` that names why the runner cannot drive the scenario and the steps an operator runs instead.

| Scenario | Title | Verdict | Runner row | Evidence |
|---|---|---|---|---|
| VIB-HK-001 | Spec gate classify opens the gate for an unbound write request | PASS | PASS 1/1 | `scratch/live/VIB-HK-001/matrix.md` |
| VIB-HK-002 | Strict spec gate refuses the first write while the gate is open | PASS | PASS 1/1 | `scratch/live/VIB-HK-002/matrix.md` |
| VIB-HK-003 | Turn-start advisor adds the skill advisor brief once | PASS | PASS 2/2 | `scratch/live/VIB-HK-003/matrix.md` |
| VIB-HK-004 | Turn-start delivers the turn-end completion advisory once | PASS | PASS 2/2 | `scratch/live/VIB-HK-004/matrix.md` |
| VIB-HK-005 | Turn start raises the save nudge for a captured answer | PASS | PASS 2/2 | `scratch/live/VIB-HK-005/matrix.md` |
| VIB-HK-006 | Turn start re-injects the goal slice after a compaction | PASS | PASS 4/4 | `scratch/live/VIB-HK-006/matrix.md` |
| VIB-HK-007 | A mid-turn compaction re-injects at the next tool call | OPERATOR-ONLY | SKIP 0/2 | `scratch/live/VIB-HK-007/procedure.md` |
| VIB-HK-008 | Turn end sends a prose option menu back once | PASS | PASS 1/1 | `scratch/live/VIB-HK-008/matrix.md` |
| VIB-HK-009 | Turn-end leaves a completion advisory and never blocks | PASS | PASS 2/2 | `scratch/live/VIB-HK-009/matrix.md` |
| VIB-HK-010 | Env secret guard refuses a dotenv read | PASS | PASS 2/2 | `scratch/live/VIB-HK-010/matrix.md` |
| VIB-HK-011 | Dispatch preflight refuses a dispatch that breaks a hard rule | PASS | PASS 2/2 | `scratch/live/VIB-HK-011/matrix.md` |
| VIB-HK-012 | Overlay guard refuses a write an overlay owns | PASS | PASS 2/2 | `scratch/live/VIB-HK-012/matrix.md` |
| VIB-HK-013 | MCP route guard refuses a native call with a Code Mode manual | OPERATOR-ONLY | - | `scratch/live/VIB-HK-013/procedure.md` |
| VIB-HK-014 | Git message gate refuses a bad commit message | PASS | PASS 2/2 | `scratch/live/VIB-HK-014/matrix.md` |
| VIB-HK-015 | Deep-loop guard refuses a dispatch whose mode disagrees with the registry | PASS | PASS 2/2 | `scratch/live/VIB-HK-015/matrix.md` |
| VIB-HK-016 | Post-edit quality returns a comment-hygiene finding in the tool result | PASS | PASS 2/2 | `scratch/live/VIB-HK-016/matrix.md` |
| VIB-HK-017 | Dist freshness warns when an edit leaves a watched package's build behind | PASS | PASS 2/2 | `scratch/live/VIB-HK-017/matrix.md` |
| VIB-HK-018 | Dist freshness warns when a spec validation command trusts a stale build | OPERATOR-ONLY | SKIP 0/2 | `scratch/live/VIB-HK-018/procedure.md` |
| VIB-HK-019 | Injection screen appends its advisory to a fetched page that reads as instructions | PASS | PASS 1/1 | `scratch/live/VIB-HK-019/matrix.md` |
| VIB-HK-020 | An answered question becomes one decision record | PASS | PASS 1/1 | `scratch/live/VIB-HK-020/matrix.md` |
| VIB-HK-021 | Session cleanup writes its log line when the session closes | PASS | PASS 2/2 | `scratch/live/VIB-HK-021/matrix.md` |
| VIB-HK-022 | Rendered home hooks bind every repository hook | PASS | PASS 2/2 | `scratch/live/VIB-HK-022/matrix.md` |
| VIB-HK-023 | A request that needs a repository skill loads it from the .vibe/skills mirror | PASS | PASS 2/2 | `scratch/live/VIB-HK-023/matrix.md` |
| VIB-HK-024 | A request that needs a repository agent spawns it from the .vibe/agents mirror | PASS | PASS 3/3 | `scratch/live/VIB-HK-024/matrix.md` |
| VIB-HK-025 | A mirrored prompt from .vibe/prompts runs by name | OPERATOR-ONLY | FAIL 2/3 | `scratch/live/VIB-HK-025/procedure.md` |
| VIB-HK-026 | The manual relaunch tier hands off and a fresh session claims it | OPERATOR-ONLY | SKIP 0/1 | `scratch/live/VIB-HK-026/procedure.md` |

Counts: 21 PASS, 5 OPERATOR-ONLY, 0 FAIL.

- VIB-HK-006 failed first. It passed 4/4 on 2026-11-15 after the reader and watermark fixes (`scratch/live/VIB-HK-006/diagnosis.md`).
- VIB-HK-024 failed first. It passed 3/3 after the generator fix (`scratch/live/VIB-HK-024/diagnosis.md`).
- VIB-HK-025's runner row is FAIL 2/3. Its `procedure.md` shows the runner cannot place a prompt into a new session's system input, so the verdict is OPERATOR-ONLY, not FAIL.
- VIB-HK-007, VIB-HK-018 and VIB-HK-026 recorded SKIP. VIB-HK-013 has no runner row, because the runner cannot build a home with an MCP server row.
