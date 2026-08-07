# Iteration 007 - Routing Probe

## Metadata

- Iteration: 7
- Date: 2026-05-05
- Executor: cli-codex (gpt-5.5, high, fast)
- Scope: `skill_advisor.py` routing probes only; no MCP tools
- Verdict: FAIL

## Probe Results

| Prompt | Expected top-1 | Behavioral top-1 | Status | Top-3 live / shadow scores |
|---|---:|---:|---|---|
| `iterative review loop for spec folder audit` | `deep-review` | `sk-code-review` | FAIL | `sk-code-review` live 0.942 / shadow 0.819333; `deep-review` live 0.936 / shadow 0.838; `system-spec-kit` live 0.764 / shadow 0.65 |
| `review this PR for code quality` | `sk-code-review` | `sk-code-review` | PASS | `sk-code-review` live 0.959 / shadow 0.874667; `sk-code` live 0.70375 / shadow 0.639; `deep-review` live 0.4045 / shadow 0.375333 |
| `single pass code review with security findings` | `sk-code-review` | `sk-code-review` | PASS | `sk-code-review` live 0.948675 / shadow 0.841567; `cli-codex` live 0.50535 / shadow 0.466133; `cli-gemini` live 0.4941 / shadow 0.451967 |
| `audit findings drift readiness` | `sk-code-review` | `sk-code-review` | PASS | `sk-code-review` live 0.934755 / shadow 0.82634; `deep-review` live 0.385125 / shadow 0.33825 |
| `deep research loop with convergence tracked` | `deep-research` | `deep-research` | PASS | `deep-research` live 0.925725 / shadow 0.8163; `deep-review` live 0.43425 / shadow 0.38 |
| `multi-pass review with convergence detection` | `deep-review` | `deep-review` | PASS | `deep-review` live 0.95685 / shadow 0.8658; `sk-code-review` live 0.74625 / shadow 0.66175; `deep-research` live 0.64725 / shadow 0.5655 |
| `spec folder audit packet` | `deep-review` or `system-spec-kit` | `system-spec-kit` | PASS | `system-spec-kit` live 0.9 / shadow 0.78; `deep-review` live 0.886554 / shadow 0.796607; `sk-code-review` live 0.626732 / shadow 0.556964 |
| `code review findings drift` | `sk-code-review` | `sk-code-review` | PASS | `sk-code-review` live 0.95835 / shadow 0.8578; `cli-codex` live 0.544725 / shadow 0.50905; `cli-gemini` live 0.535444 / shadow 0.492863 |

## Findings

- P0-006 - Primary deep-review routing still fails behaviorally. The prompt `iterative review loop for spec folder audit` returns `sk-code-review` top-1 ahead of `deep-review`, even though shadow scoring has the intended post-fix order (`deep-review` 0.838 > `sk-code-review` 0.819333). The current caller-visible ordering is still live-score ordered, so P1-002 is not fully fixed.

## Regression Notes

No adjacent `sk-code-review` regression was observed. The three direct single-pass/code-quality prompts still rank `sk-code-review` top-1, `deep-research` stays top-1 for its loop prompt, and the broader `spec folder audit packet` result is acceptable because `system-spec-kit` is explicitly allowed.

## Pass/Fail

FAIL - 7/8 probes matched the expected or acceptable top-1; the primary P1-002 probe failed.
