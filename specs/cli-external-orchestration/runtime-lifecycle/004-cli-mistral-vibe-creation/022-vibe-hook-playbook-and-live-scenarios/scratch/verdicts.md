# VIB-HK verdicts

One row per hook scenario this phase owns. `Runner row` is the `vibe` row of the scenario's `matrix.md` as last run. `hand-driven hop` marks the one scenario the runner cannot drive: its verdict comes from a live hop run by hand in a tmux pane and recorded in `hop-record.md`, not from a runner row.

| Scenario | Title | Verdict | Runner row | Evidence |
|---|---|---|---|---|
| VIB-HK-001 | Spec gate classify opens the gate for an unbound write request | PASS | PASS 2/2 | `scratch/live/VIB-HK-001/matrix.md` |
| VIB-HK-002 | Strict spec gate refuses the first write while the gate is open | PASS | PASS 3/3 | `scratch/live/VIB-HK-002/matrix.md` |
| VIB-HK-003 | Turn-start advisor adds the skill advisor brief once | PASS | PASS 2/2 | `scratch/live/VIB-HK-003/matrix.md` |
| VIB-HK-004 | Turn-start delivers the turn-end completion advisory once | PASS | PASS 2/2 | `scratch/live/VIB-HK-004/matrix.md` |
| VIB-HK-005 | Turn start raises the save nudge for a captured answer | PASS | PASS 2/2 | `scratch/live/VIB-HK-005/matrix.md` |
| VIB-HK-006 | Turn start re-injects the goal slice after a compaction | PASS | PASS 4/4 | `scratch/live/VIB-HK-006/matrix.md` |
| VIB-HK-007 | A mid-turn compaction re-injects at the next tool call | PASS | PASS 3/3 | `scratch/live/VIB-HK-007/matrix.md` |
| VIB-HK-008 | Turn end sends a prose option menu back once | PASS | PASS 2/2 | `scratch/live/VIB-HK-008/matrix.md` |
| VIB-HK-009 | Turn-end leaves a completion advisory and never blocks | PASS | PASS 3/3 | `scratch/live/VIB-HK-009/matrix.md` |
| VIB-HK-010 | Env secret guard refuses a dotenv read | PASS | PASS 3/3 | `scratch/live/VIB-HK-010/matrix.md` |
| VIB-HK-011 | Dispatch preflight refuses a dispatch that breaks a hard rule | PASS | PASS 3/3 | `scratch/live/VIB-HK-011/matrix.md` |
| VIB-HK-012 | Overlay guard refuses a write an overlay owns | PASS | PASS 2/2 | `scratch/live/VIB-HK-012/matrix.md` |
| VIB-HK-013 | MCP route guard refuses a native call with a Code Mode manual | PASS | PASS 3/3 | `scratch/live/VIB-HK-013/matrix.md` |
| VIB-HK-014 | Git message gate refuses a bad commit message | PASS | PASS 3/3 | `scratch/live/VIB-HK-014/matrix.md` |
| VIB-HK-015 | Deep-loop guard refuses a dispatch whose mode disagrees with the registry | PASS | PASS 3/3 | `scratch/live/VIB-HK-015/matrix.md` |
| VIB-HK-016 | Post-edit quality returns a comment-hygiene finding in the tool result | PASS | PASS 3/3 | `scratch/live/VIB-HK-016/matrix.md` |
| VIB-HK-017 | Dist freshness warns when an edit leaves a watched package's build behind | PASS | PASS 3/3 | `scratch/live/VIB-HK-017/matrix.md` |
| VIB-HK-018 | Dist freshness warns when a spec validation command trusts a stale build | PASS | PASS 2/2 | `scratch/live/VIB-HK-018/matrix.md` |
| VIB-HK-019 | Injection screen appends its advisory to a fetched page that reads as instructions | PASS | PASS 2/2 | `scratch/live/VIB-HK-019/matrix.md` |
| VIB-HK-020 | An answered question becomes one decision record | PASS | PASS 2/2 | `scratch/live/VIB-HK-020/matrix.md` |
| VIB-HK-021 | Session cleanup writes its log line when the session closes | PASS | PASS 3/3 | `scratch/live/VIB-HK-021/matrix.md` |
| VIB-HK-022 | Rendered home hooks bind every repository hook | PASS | PASS 3/3 | `scratch/live/VIB-HK-022/matrix.md` |
| VIB-HK-023 | A request that needs a repository skill loads it from the .vibe/skills mirror | PASS | PASS 3/3 | `scratch/live/VIB-HK-023/matrix.md` |
| VIB-HK-024 | A request that needs a repository agent spawns it from the .vibe/agents mirror | PASS | PASS 3/3 | `scratch/live/VIB-HK-024/matrix.md` |
| VIB-HK-025 | A mirrored prompt from .vibe/prompts runs by name | PASS | PASS 2/2 | `scratch/live/VIB-HK-025/matrix.md` |
| VIB-HK-026 | The manual relaunch tier hands off and a fresh session claims it | PASS | hand-driven hop | `scratch/live/VIB-HK-026/hop-record.md` |

Counts: 26 PASS, 0 OPERATOR-ONLY, 0 FAIL. 25 come from runner rows and 1 from the hand-driven hop.

Every runner scenario sends two or more user messages, and VIB-HK-026 spans two sessions. VIB-HK-021 and VIB-HK-022 also restart the session between their messages.

- VIB-HK-006 failed first. It passed 4/4 on 2026-11-15 after the reader and watermark fixes (`scratch/live/VIB-HK-006/diagnosis.md`).
- VIB-HK-024 failed first. It passed 3/3 after the generator fix (`scratch/live/VIB-HK-024/diagnosis.md`).
- VIB-HK-007, VIB-HK-013 and VIB-HK-025 were OPERATOR-ONLY until the runner gained `launch_setup`, which changes the Vibe home after the runner writes it and before Vibe starts. VIB-HK-007 pins a 30,000-token probe model, VIB-HK-013 registers a fixture stdio MCP server, and VIB-HK-025 adds an agent profile that names the mirrored prompt. The earlier experiments stay as history: `VIB-HK-013/manual-probe.md` and `VIB-HK-025/restart-run/`.
- VIB-HK-018 was OPERATOR-ONLY until `check-dist-staleness.sh --all` honored `SPECKIT_DIST_WORKSPACE_ROOT`. The scenario now plants a stale build in the scratch project instead of the checkout.
- VIB-HK-001, VIB-HK-002, VIB-HK-008, VIB-HK-019 and VIB-HK-020 each gained a second sent turn that checks a property across turns. These are the gate closing on `D`, the denied write landing after it, no second menu retry, no advisory on a benign page, and one record per answer.
- VIB-HK-026 passed as a live hop driven by hand. It needs `SYSTEM_SESSION_HANDOVER_VIBE_ENABLED=1`, and the printed claim command leaves out `--trust` (`scratch/live/VIB-HK-026/hop-record.md`).
- VIB-HK-009, 010, 011, 014, 015, 016, 017, 021, 022 and 023 each gained a second sent turn on 2026-11-15. These are a second completion claim accepted with the advisory rewritten, a plain file read allowed after a dotenv refusal, an ordinary shell call allowed after a dispatch refusal, a `git status` that finds only a compliant commit, the refusal reason carried into a file, the hygiene finding cleared by the fix, no dist warning for an edit outside the package, the resumed session holding the earlier question, a dotenv refusal logged after the restart, and the skill's prompt carried into a file.
- VIB-HK-014 and VIB-HK-017 failed their new turn on the first run, and both causes were in the scenario, not the hook. In VIB-HK-014 the model committed `a.txt` with a compliant message after the refusal, which the gate allows, so the check now accepts that branch. In VIB-HK-017 the model read "this folder" as the package's `src/`, so the prompt now names the project root. Both reruns passed 3/3.
- VIB-HK-027, the automatic handover tier, came in with the merge of origin/main as `2d4fb4d0f92`. It belongs to the automatic handover work, not this phase, so it has no row here. The same merge cut VIB-HK-006 from four turns to three by dropping its history-offer turn. Its 4/4 row is from the four-turn version, which covered every turn the three-turn version checks.
- After the 2026-11-15 review, the checks of VIB-HK-003, 009, 021, 022 and 024 were tightened. Their live rerun stopped on `402 API budget exhausted` from Mistral, so those five rows still show the PASS from the earlier checks, and the evidence in their folders is from those runs. Task T104 tracks the rerun.
