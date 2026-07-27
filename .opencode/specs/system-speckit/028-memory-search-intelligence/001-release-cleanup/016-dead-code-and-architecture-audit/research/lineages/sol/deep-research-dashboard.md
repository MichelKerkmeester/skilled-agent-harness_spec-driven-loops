# Deep Research Dashboard - Sol Lineage

- Status: complete
- Session: `fanout-sol-1785133613018-3fbdzo`
- Executor: `cli-opencode` / `openai/gpt-5.6-sol`
- Iterations: 10 / 10
- Stop policy: max-iterations
- Stop reason: maxIterationsReached
- Questions answered: 10 / 10 evidence questions
- Open follow-up questions: 3
- Latest ratio: 0.12
- Average ratio: 0.669
- Confirmed findings: 10
- P1: 1
- P2: 8
- P3: 1
- Confirmed CAT-1 dead files: 0
- Confirmed safely deletable CAT-2 files: 0
- Code graph: unavailable (empty index); exact search fallback used
- Blocked stops: 0
- Output: `research.md`
- Next focus: cross-lineage merge and deduplication before remediation authorization

## Iteration Trend

| Iteration | Focus | Ratio | Status | New findings |
|---|---|---:|---|---:|
| 001 | Launchers and daemon serving | 0.92 | complete | 2 |
| 002 | MCP shared contracts | 0.86 | complete | 2 |
| 003 | Deep-loop resume and parity | 0.74 | complete | 1 |
| 004 | Compiled routing | 0.78 | complete | 2 |
| 005 | Deep-command representations | 0.62 | complete | 1 |
| 006 | Agent mirrors | 0.71 | complete | 1 |
| 007 | Root config and DB placement | 0.83 | complete | 1 |
| 008 | Residue and portability | 0.76 | complete | 2 |
| 009 | Dead-code falsification | 0.35 | thought | 0 |
| 010 | Synthesis falsification | 0.12 | thought | 0 |

## Dead Ends

- Guard script orphan hypothesis: false; GitHub Actions invokes it.
- Advisor bridge test-only hypothesis: false; the OpenCode plugin spawns it.
- Legacy command-body deletion hypothesis: false; both injection modes consume the bodies.
- Compiled router deletion hypothesis: false; the runtime engine dynamically loads them.
- Root config duplicate hypothesis: false; mirrors are symlinks.
