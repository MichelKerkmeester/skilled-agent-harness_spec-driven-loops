# ROBUST Verdict Gates

023B defines the measurable release gates for flipping the retrieval stack from regression-grade evidence to a ROBUST verdict.

| Gate | Requirement | Verification source | Status in this packet |
|---|---|---|---|
| GATE-1 | Repeated benchmark runs hold `n >= 3` with mean hit rate at least `14/18` on the original corrected fixture and no regression on the expanded fixture. | `run-expanded-bench.sh --runs 3`, per-run JSON, aggregate CI95. | Harnessed, long run deferred. |
| GATE-2 | Expanded fixture hit rate is at least `60%` until an operator chooses a stricter release threshold. | `evidence/expanded-calibration-summary.md` after full run. | Threshold defined; sample smoke is not a release verdict. |
| GATE-3 | p95 search latency remains below `10s` for bounded valid inputs. | Per-run JSON `latency_ms.p95`; 023E owns hard input caps. | Harness records p95. |
| GATE-4 | Model, license, prompt, index, and effective config metadata are visible in `ccc status` / `ccc doctor`. | 023A1, 023A2, 023D, 023C summaries and live status/doctor output. | Prerequisite verified by shipped packets. |
| GATE-5 | Reranker fallback, candidate, fanout, and boost-flip counters are observable. | 023C `RetrievalDiagnostics` fields and residual taxonomy classifier. | Prerequisite verified by 023C summary and harness taxonomy hook. |

Release interpretation: all five gates must be green before claiming ROBUST. A sample smoke run can prove the harness still executes, but it cannot satisfy GATE-1 or GATE-2.
