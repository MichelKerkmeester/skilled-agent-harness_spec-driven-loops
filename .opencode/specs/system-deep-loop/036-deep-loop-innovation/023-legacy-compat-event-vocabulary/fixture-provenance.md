# Real fixture provenance

Captured/replayed on 2026-08-07. The replay suites read the repository artifacts
below directly; they do not construct replacement JSONL rows or rewrite the
source logs.

| Mode | Source artifact | Lines | Bytes | SHA-256 | Recorded run/session identity |
| --- | --- | ---: | ---: | --- | --- |
| Deep research | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl` | 18 | 22,277 | `1f0a00a61b3ac895097da40880baee94a9564f2bfee24d1e9779c87403cbd547` | `fanout-sol-1784463720850-qpa2w1` |
| Deep review | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/review/lineages/luna/deep-review-state.jsonl` | 64 | 107,328 | `1671c5415d988750f38927ab312cfff34474ed555468b04d84f0773a4da76d13` | `fanout-luna-1785948656636-gx83sj` |
| Deep alignment | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/016-whole-system-gate/alignment/deep-alignment-state.jsonl` | 49 | 43,197 | `82f2f0bcc56d13d847d6d0ffeb72c226eba8f937e0122e30d06f59acedd37cc2` | `claude-runner-align-2026-07-30T09-47-39-930Z` |
| AI council live state | `.opencode/specs/system-deep-loop/z_archive/025-deep-loop-gpt-reliability/004-benchmarks-and-verification/001-gpt-verification-smoke/ai-council/session-state.jsonl` | 4 | 2,223 | `8d284ec67de22b620827f808856aa6f4647afffbe9583e9b908f1283367c679b` | `council-session-2026-06-30T21-00-52-770Z` |
| AI council archived rounds | `.opencode/specs/system-deep-loop/z_archive/024-deep-loop-improved/012-deep-loop-divergent-mode/ai-council/ai-council-state.jsonl` | 22 | 6,312 | `2641895b309f249fb3dc48a685c6d25effe1a1cbe42df859210abfeaac943255` | round records carry `round-001`; archive has no session field |
| Deep-improvement common | `.opencode/specs/system-deep-loop/z_archive/013-agent-deep-review-optimization/improvement/improvement-journal.jsonl` | 19 | 5,464 | `aed2cb04f71b7f5a9fac6ee0107e56b9aa8a910551b6413c35bc580c33cef5ae` | `imp-deep-review-20260502T180349Z` in journal details |
| Skill benchmark command output | `.opencode/specs/system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary/fixtures/skill-benchmark-live/skill-benchmark-report.json` | 3,043 | 82,116 | `212f05d6fea022287500b8320613a819228eff748a6906b8604ff15a031bdd0d` | live command completed with `system-deep-loop verdict=PASS aggregate=99 scenarios=21` |

## Producing commands and substitutions

- Research and review artifacts are captured state logs from the recorded fanout
  runs named above.
- Alignment is the captured state log from the named alignment runner; its
  `config` row is the live `sessionId`-only identity case.
- Council uses both a captured session state log and a captured archived round
  log. The current live heartbeat and terminal writers are verified against
  their exact producer shapes in the council ledger-schema suite because the
  selected archived run predates those rows.
- The skill-benchmark fixture was produced by:

  ```text
  node .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs --mode=skill-benchmark --skill=.opencode/skills/system-deep-loop --outputs-dir=.opencode/specs/system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary/fixtures/skill-benchmark-live --trace-mode=router
  ```

  Skill benchmark emits a report directory rather than a dedicated
  `skill_benchmark` JSONL state log. Its shared lifecycle replay therefore uses
  the real common journal above, and the live command report is retained as the
  mode's captured command-output fixture. The low-sample benchmark fixture is
  excluded.

No fixture contains an absolute workstation path. The only report normalization
was replacing the command's local root display with the packet-relative skill
root; event names, scores, scenario rows, and run result were unchanged.
