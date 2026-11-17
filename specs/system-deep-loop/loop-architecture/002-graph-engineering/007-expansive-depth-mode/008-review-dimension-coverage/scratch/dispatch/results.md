# Dispatch results: 008 review dimension coverage

Lane: OpenCode 2.3.0, `opencode-go/deepseek-v4.1-flash#max`, run by `run-go.sh` with a 1200 s PID watchdog and main/worktree status snapshots. Every diff was read and every CHECK rerun by the orchestrator. No brief wrote outside its allowed paths. Main gained only hook README edits from another session during brief E.

| Brief | Task | Exit | Seconds | Orchestrator verdict |
|-------|------|------|---------|----------------------|
| `A-reducer.brief` | T003, T004 reducer universe | 0 | 70 | Diff matched the six edits; four suites pass 40 |
| `B-tests.brief` | T003 reducer cases | 0 | 170 | Three cases; case 2 passed without the fix, so it was sharpened natively to a mixed-dimension iteration; both custom cases then fail before and pass after |
| `C-yaml.brief` | T005 workflow YAML | 0 | 110 | Diff matched; YAML parses; YAML suites pass. The whole-object seed later broke the spec-kit parity pin and was changed natively to literal keys plus a custom-seed token (OD-002) |
| `D-template.brief` | T006 template and tests | 0 | 80 | Diff matched; default render byte-identical |
| `E-stoppath.brief` | T014 stop-path case | 0 | 311 | Case reaches `all_dimensions_clean`; fails against the pre-change reducer |
| `F-pivot.brief` | T015 pivot case | 0 | 170 | Case passes; fails against the pre-change reducer; the `.ts` import extension was dropped natively to match the file's style |

Native work, recorded: T007 agent lines, T008 mirror sync, T009 presentation, T010 mode contract, T011 and T012 doc wording, T013 contract regeneration. Each was a short prose or generator step cheaper to do directly than to brief.
