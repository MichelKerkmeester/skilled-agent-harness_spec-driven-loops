# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log and strategy file. Regenerated after every iteration evaluation. Never manually edited.

## 1. OVERVIEW

### Purpose

Lineage-local dashboard for glm-devin (cli-devin / glm-5-2).

---

## 2. STATUS
- Topic: Pi native Cursor/Devin model bridge (auth reuse vs provider adapter vs local gateway)
- Started: 2026-08-17T13:19:40Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-glm-devin-1786965580209-8tztea
- Parent Session: dr-045-fanout-20260817-122318
- Lifecycle Mode: new
- Generation: 1
- Stop policy: max-iterations (convergence is telemetry)
- Verdict: **not-feasible-now**

---

## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Pi /model picker + provider hooks | architecture | 1.00 | 8 | complete |
| 2 | Cursor auth, api2.cursor.sh, ToS 1.5 | legal/auth | 0.85 | 7 | complete |
| 3 | Devin OAuth, credentials.toml, session REST, ToS 2.3 | legal/auth | 0.80 | 7 | complete |
| 4 | Local gateway fronting official CLIs vs private proxies | architecture/legal | 0.70 | 7 | complete |
| 5 | Ranked verdict and parent-purpose alignment | synthesis | 0.45 | 6 | complete |

- iterationsCompleted: 5
- keyFindings: 27
- openQuestions: 0
- resolvedQuestions: 5

---

## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: How does Pi's /model picker resolve providers and models? (iteration 1)
- [x] Q2: Can Cursor subscription auth be reused safely? (iteration 2)
- [x] Q3: Can Devin OAuth be reused safely? (iteration 3)
- [x] Q4: Can a local OpenAI-compatible gateway front the vendor CLIs? (iteration 4)
- [x] Q5: Ranked feasible/safe path? (iteration 5)

---

## 5. TREND
- Last 3 ratios: 0.80, 0.70, 0.45
- Sparkline: ▇▆▄
- Ratios: [1.00, 0.85, 0.80, 0.70, 0.45]
- Stuck count: 0
- Guard violations: none
- convergenceScore: (telemetry; stopPolicy=max-iterations)

---

## 6. DEAD ENDS
- Built-in Pi Cursor/Devin provider: absent (iteration 1)
- Oh My Pi / login-token reuse against api2.cursor.sh (iteration 2)
- Private-endpoint OpenAI proxies (iteration 2)
- Pi HTTP from credentials.toml windsurf_api_key (iteration 3)
- api.devin.ai as openai-completions baseUrl (iteration 3)
- Reverse-engineered OpenAI proxies (iteration 4, re-confirmed)

---

## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: Cursor + Devin private-endpoint token reuse; reverse-engineered proxies
- Remaining frontier: none (all questions answered)

---

## 7. NEXT FOCUS
Loop complete. phase_synthesis written: `research/research.md` + `research/resource-map.md`. Next: output `FANOUT_LINEAGE_COMPLETE:glm-devin`.

---

## 8. ACTIVE RISKS
- Residual UNKNOWN: exact Cursor token persistence (keychain vs Chromium) — not dumped.
- Residual UNKNOWN: whether consumer Devin Pro can mint v3 cog_ service-user keys.
- Residual UNKNOWN: whether Cursor staff would bless CLI-spawn gateways (genuine ToS ambiguity).
- Both Cursor ToS (Aug 13 2026) and Cognition ToS (Jun 30 2026) are recent; re-verify before any future implementation.

---

## 9. VERDICT
**Not feasible now.** No path to natively expose Cursor/Devin subscription-backed models in Pi's `/model` picker is both technically clean and account-safe. Four paths ToS-blocked; one (CLI-spawn gateway) technically feasible but ToS-ambiguous, nested-harness, and duplicates existing executor. Track vendor feature requests (Cursor public `/v1/chat/completions`, Devin raw-completions). Keep existing `cli-cursor`/`cli-devin` executor dispatch.
