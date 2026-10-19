# Deep Review Report: Session Relaunch Loop (round 3)

Fan-out review of `specs/hooks/023-session-relaunch-loop` and its code after phase 007, run on 2026-10-19 from main at `4a15d7e66a`.

| Lineage | Executor | Model | Iterations | Verdict |
|---|---|---|---|---|
| deepseek | cli-opencode | `llmgateway/deepseek-v4.1-flash`, variant max | 5 | CONDITIONAL |
| luna | cli-codex | `gpt-6-luna`, effort max, tier fast | 5 | CONDITIONAL |

Merged verdict: **CONDITIONAL**. Active findings: 0 P0, 2 P1, 13 P2. Per-lineage detail is in `lineages/<label>/review-report.md`, and attribution is in `fanout-attribution.md`.

## Verification

The orchestrator checked every finding against the files before accepting it. Each row says what was read.

| ID | Sev | Finding | Verdict | What confirmed it |
|---|---|---|---|---|
| DS-004 | P1 | Phase 007 AC-006 to AC-008 cite `relaunch-run10.log`, which is not in the evidence folder | Confirmed | `git check-ignore` matches `.gitignore:263 *.log`; the evidence folder holds the pane captures and `launch-commands.txt` only |
| P1-001 | P1 | Phase 002 AC-003 is marked Met while its evidence records the plain Pi smoke at rc=1 and the import printing `function`, not `ok` | Confirmed | `002/acceptance-criteria.md:41` against `002/spec.md:120` |
| P2-002 | P2 | Phase 002 implementation summary still says AC-006 Unmet and strict validation FAILED, while the acceptance record says Met and closeable | Confirmed | `002/implementation-summary.md:102-103,135-145` |
| DS-005, P2-003 | P2 | Parent `spec.md` says six children, scope stops at 006, and the 006-to-007 handoff row is `[Criteria TBD]` | Confirmed (one defect, found by both lineages) | `spec.md:39,51,122` |
| P2-004 | P2 | Parent `goal.md` continuity block is still the scaffold state at 0% | Confirmed | `goal.md:14-24` |
| DS-006 | P2 | Phase 006 cites a `/private/tmp` verification table | Confirmed in part | The temp path is real. The missing `../review/review-report.md` is an artifact of this run's restart, which archived the previous review; on main that report is present |
| DS-009 | P2 | `shouldRelaunch` accepts a future `armedAt`, so a backward clock step keeps a record fresh | Confirmed | `relaunch-core.cjs`: only `now - armedAt > limit` is rejected |
| DS-002 | P2 | A second `prepare` leaves the first open note open, and `openNotePathFor` returns the first open match in directory order | Confirmed | `supersedeClaimed` closes claimed notes only; `nudge.cjs` returns the first open note |
| DS-001 | P2 | The nudge plans a note under `handoffs/` but nothing in the nudge path creates that directory | Confirmed, low impact | No `mkdir` in `nudge.cjs`. Live runs passed because the model's write tools create parent directories |
| DS-003 | P2 | Handoff notes are written with default modes, while every other relaunch file is pinned to 0600 or 0700 | Confirmed | The note is written by the model's write tool; `writeHandoffUpdate` keeps the existing mode |
| DS-007 | P2 | `/speckit:handoff` documents exit 3 as outside-the-loop only; `prepare` also returns 3 at the hop cap | Confirmed | `session-relaunch.cjs:381,415` against `handoff.md` Step table |
| DS-008 | P2 | A crash between the stale-lock rename and its removal leaves a `.stale-` entry that the sweep never matches | Confirmed | `killer.cjs` sweep matches `.takeover.stale-` only |
| DS-010 | P2 | `SYSTEM_SPEC_FOLDER` (Pi, OpenCode) and `HERMES_SPEC_FOLDER` are not in the environment reference | Confirmed | No match in `ENV-REFERENCE.md` |
| DS-011 | P2 | Claude and Codex adapter tests never pass a `spec_folder` | Confirmed | No `spec_folder` in `claude-adapters.test.cjs` or `codex-adapters.test.cjs` |

## Run Notes

- The DeepSeek lineage ran under `--dangerously-skip-permissions`, so the run used a fresh worktree. Its scope check found no writes outside `review/` apart from OpenCode bumping `@opencode-ai/plugin` in the worktree's `.opencode/package.json`, which is not part of this review.
- DeepSeek took about 32 minutes for five iterations and finished none in the first 15. Luna finished four in that time.

Review verdict: CONDITIONAL
