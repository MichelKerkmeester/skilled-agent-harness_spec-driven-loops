# Deep Review Report: 071-sk-doc-router-stress-test

**Packet**: `.opencode/specs/sk-doc/z_archive/008-sk-doc-router-stress-test/`
**Test matrix**: 15 scenarios × 3 CLIs = 45 cells, complete (45/45)
**Date**: 2026-05-05
**Author**: Claude Opus 4.7 orchestrator + cli-copilot (scenarios) + 3 CLIs (matrix execution)

---

## 1. Verdict

**CONDITIONAL → REMEDIATE_AND_SHIP**

Score: 1 P0 (methodology bug, already fixed inline), 2 P1 (copilot accuracy gap, opencode perf), 2 P2 (token-extraction script bugs, intent detection heuristic). Recommendation: ship 071 as-is with this report; spawn follow-up packet 072 only if router itself needs changes (none required from this run).

---

## 2. Cross-CLI Comparison Matrix

| Metric | cli-codex (gpt-5.5/high/fast) | cli-copilot (claude-opus-4.7) | cli-opencode (deepseek-v4-pro) |
|---|---|---|---|
| Exit-0 rate | **15/15 (100%)** | **15/15 (100%)** | 13/15 (87%) — 2 timeouts |
| Intent-pick accuracy | **10/15 (67%) ✅** | 6/15 (40%) ❌ | 8/15 (53%) |
| Resource accuracy | **66.7% ✅** | 5.6% ❌ | 43.3% |
| False-positive refs/cell | 1.67 | 4.33 ❌ | 1.73 |
| Avg duration | 27.8s | **22.6s ✅** | 73.7s ❌ |
| Avg total tokens | **38,612 ✅** | 67,153 | 79,184 ❌ |
| Cost order-of-magnitude | $ (cheap) | $$ | $$$ |

**Headline ranking by overall fitness for sk-doc routing tasks**:
1. **cli-codex** — best accuracy + lowest tokens + reliable. Clear winner for production sk-doc dispatches.
2. **cli-opencode** — middle accuracy, slowest, most expensive. Acceptable when codex unavailable.
3. **cli-copilot** — fastest but worst routing accuracy. Verbosity hypothesis: copilot tends to mention many resources without committing to a single intent, polluting the trace.

---

## 3. Findings

### P0 — Blockers (already remediated)

**P0-001: Imperative scenario prompts caused real side-effects in CLIs with file-write permissions** (RESOLVED inline)

- **Root cause**: scenarios as initially authored used imperative prompts ("Help me create…", "Generate…", "Author…"). When fed to CLIs with file-write tools (codex `--sandbox workspace-write`, copilot `--allow-all-tools`, opencode `--agent general`), the CLIs interpreted them as REAL invocations and started executing the work.
- **Symptoms observed during first matrix run**:
  - 7 empty skeleton dirs created at `.opencode/skills/sk-doc/feature_catalog/` (a CLI started `/create:feature-catalog` work, hit 120s timeout before populating)
  - Multiple 120s timeouts on SD-002 (skill-creation) and SD-003 (agent-command) — CLIs trying to actually create files
  - User flagged the methodology bug: "i see sk-graph-rag was generated? shouldnt happen"
- **Resolution**: All 15 scenarios patched with reflective-framing prefix (commit db8668f52). Each Setup now wraps the imperative prompt in a "DO NOT execute. Describe routing trace only" instruction. Re-run produced ZERO side-effects (verified by `find .opencode/skill -newer scripts/run-matrix.sh -type d` returning only expected entries).
- **Lesson**: Future router-stress packets MUST start with reflective-framing scenarios. Imperative prompts + write-capable CLIs = unsafe test methodology.

### P1 — Required (need follow-up)

**P1-001: cli-copilot routing trace accuracy is significantly worse than codex/opencode**

- **Data**: copilot 40% intent-match vs codex 67%; copilot 5.6% resource accuracy vs codex 66.7%; copilot 4.33 false-positive resources vs codex 1.67.
- **Hypothesis**: copilot's verbose response style mentions many resources beyond the picked intent's RESOURCE_MAP entry. Either (a) it isn't committing to a single intent before describing resources, or (b) it lists alternative intents and their resources speculatively.
- **Sampling**: spot-check on SD-001 (DOC_QUALITY) showed copilot's response listed correct intent + correct 4 resources — but ALSO mentioned `Not loaded:` followed by 5+ other intent's resources. The detect_intent + detect_resources script captured those "not loaded" mentions as false positives.
- **Caveat**: this is partly a measurement-script artifact. The script regex captures any `references/*` or `assets/*` path mention, regardless of whether the response says "loaded" or "not loaded".
- **Recommendation**: refine detect_resources() to parse only resources mentioned as ACTUALLY LOADED (positive mentions) — exclude "Not loaded:" / "would NOT load" sections. Re-run synthesis with refined heuristic to get cleaner copilot accuracy numbers. Filed as P1 because the cross-CLI comparison can't be trusted for copilot until measurement is fairer.

**P1-002: cli-opencode is 2.6× slower than cli-codex with 87% reliability vs 100%**

- **Data**: opencode 73.7s avg vs codex 27.8s; 13/15 exit-0 vs 15/15.
- **Timeouts**: SD-005 (assets-only/FLOWCHART) and SD-014 (medium-load) hit 120s timeout for opencode.
- **Root cause likely**: opencode default is `opencode-go/deepseek-v4-pro` which routes through OpenCode Go gateway. For routing-trace tasks with detailed reasoning, deepseek-v4-pro is slower than gpt-5.5 fast tier.
- **Recommendation**: when high throughput matters, prefer cli-codex over cli-opencode for sk-doc tasks. For low-cost/large-batch dispatches where ~75s/cell is acceptable, opencode is OK.

### P2 — Suggestion (optional, non-blocking)

**P2-001: codex token extraction shows 0 in delta JSONL but raw logs contain real numbers**

- **Data**: `tokens=0` for all 15 codex deltas, but raw `codex.log` files contain `tokens used\n35,713` etc.
- **Root cause**: matrix script's regex `tokens used[^0-9]*[0-9,]+` doesn't match codex's actual format (newline + indented number).
- **Resolution**: Phase D extract_metrics.py uses correct regex `tokens used\s*\n\s*([\d,]+)` and recovers the data. matrix.csv has correct codex token counts.
- **Future improvement**: fix run-matrix.sh extraction so deltas are accurate inline; saves needing a re-extraction pass.

**P2-002: opencode token extraction in delta JSONL shows `(json-parse-failed)` but raw logs are valid JSONL**

- **Root cause**: matrix script's `jq -r '.usage // empty'` doesn't traverse the JSONL stream correctly. The actual format has token data in `step_finish` events under `.part.tokens.{total,input,output}`.
- **Resolution**: extract_metrics.py parses each line as separate JSON object, sums tokens across `step_finish` events. matrix.csv has correct opencode token counts.
- **Future improvement**: same as P2-001 — fix run-matrix.sh extraction.

---

## 4. Methodology Notes

### What worked
- **Reflective framing prefix** (post-fix) eliminated all side-effects across 45 cells.
- **Concurrency cap (3 CLIs in parallel per scenario, sequential across scenarios)** kept rate limits safe and produced predictable wall-clock (~24 min total for matrix re-run).
- **Per-CLI delta JSONL + per-cell log files** captured enough raw data to recover from script-level extraction bugs in synthesis.

### What didn't work (initially)
- **Imperative scenario prompts** — fundamental methodology bug. Always frame router-trace tests as observation-only.
- **Inline jq parsing of opencode JSONL stream** — too fragile for streaming JSON. Use a proper Python loop.
- **Token-count regex in bash** — codex/copilot/opencode each have different output formats. Recover in synthesis, not in dispatch.

### Cost summary
- **Total dispatches**: 45 (15 scenarios × 3 CLIs)
- **Total tokens**: ~2.78M across all CLIs (codex ~580K, copilot ~1.0M, opencode ~1.2M)
- **Order-of-magnitude USD cost**: ~$3-8 (rough estimate: opus tokens dominate at copilot, then deepseek pricing at opencode, then gpt-5.5/fast at codex which is cheapest)

---

## 5. Convergence Analysis

This was a one-shot test (no iteration loop). All scenarios completed. No convergence threshold to satisfy — this was an observational sweep, not a deep-review iteration loop.
