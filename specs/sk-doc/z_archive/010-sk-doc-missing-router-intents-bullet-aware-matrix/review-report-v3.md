# Review Report v3 — sk-doc Router Coverage Extension

**Packet**: 076-sk-doc-missing-router-intents-bullet-aware-matrix
**Date**: 2026-05-05
**Predecessor**: 072 review-report-v2.md (n=15, extractor v2)
**Scope**: 17 scenarios × 3 CLIs = 51 cells; bullet-aware v3 extractor

---

## 1. EXECUTIVE SUMMARY

Extended the sk-doc router stress matrix from 9-of-11 intent coverage (072 packet) to **all 11 intents** by adding SD-016 (OPTIMIZATION) and SD-017 (INSTALL_GUIDE). Built `extract_metrics_v3.py` with markdown-bullet-aware resource detection. Re-extracted all 51 cells uniformly from stored logs. **The per-CLI ranking from 072 holds**: cli-codex (gpt-5.5/high/fast) leads at 70.6% resource accuracy, cli-opencode (deepseek-v4-pro) follows at 47.5% (claude-opus-4.7) trails at 9.8%. The 6 new cells reproduce the cli-copilot hallucination behavior surfaced as P1-072-001 in 072.

**Recommendation**: SHIP_AS_IS. The intent-coverage extension yields no new architectural findings beyond confirming 072's per-CLI ranking with broader intent coverage.

---

## 2. PER-CLI v3 NUMBERS (n=17 scenarios per CLI)

| Metric | cli-codex | cli-copilot | cli-opencode |
|---|---|---|---|
| Cells | 17 | 17 | 17 |
| Exit-0 rate | 17/17 | 17/17 | 15/17 |
| Intent-pick accuracy | 12/17 (71%) | 8/17 (47%) | 10/17 (59%) |
| Avg duration | 28.1s | 22.2s | 70.7s |
| Avg total tokens | 38,736 | 65,418 | 77,475 |
| **Avg resource accuracy** | **70.6%** | **9.8%** | **47.5%** |
| Avg false-positive refs | 1.47 | 3.88 | 1.65 |

---

## 3. V2 → V3 DELTA (per-CLI accuracy)

| CLI | v2 (072, n=15) | v3 (076, n=17) | Delta |
|---|---|---|---|
| cli-codex | 66.7% | 70.6% | +3.9pp |
| cli-copilot | 11.1% | 9.8% | -1.3pp |
| cli-opencode | 47.2% | 47.5% | +0.3pp |

All three CLIs shifted by less than ±5pp. The bullet-aware parsing methodology yields **comparable per-CLI numbers to v2's flat substring matching**, confirming v2's findings were already accurate and the per-CLI ranking is robust to extraction-method choice. The small uplift for cli-codex (+3.9pp) reflects 2 perfect-accuracy cells from SD-016/SD-017 (n=17 vs n=15 averaging effect).

---

## 4. OPTIMIZATION + INSTALL_GUIDE FINDINGS (6 new cells)

### SD-016 OPTIMIZATION
| CLI | Intent picked | Resource accuracy | False positives | Duration | Tokens |
|---|---|---|---|---|---|
| cli-codex | ✓ OPTIMIZATION | 100% | 0 | 29s | 39,081 |
| cli-copilot | ✓ OPTIMIZATION | **0%** | **5** | 23s | 52,482 |
| cli-opencode | ✓ OPTIMIZATION | 100% | 1 | 60s | 88,333 |

### SD-017 INSTALL_GUIDE
| CLI | Intent picked | Resource accuracy | False positives | Duration | Tokens |
|---|---|---|---|---|---|
| cli-codex | ✓ INSTALL_GUIDE | 100% | 1 | 31s | 40,253 |
| cli-copilot | ✓ INSTALL_GUIDE | **0%** | **5** | 15s | 52,337 |
| cli-opencode | ✓ INSTALL_GUIDE | **0%** | **4** | 36s | 40,978 |

### Findings on the 2 new intents

**F-076-001 (Confirms P1-072-001)**: cli-copilot hallucinates resource paths on the 2 new intents at the same rate as the original 9. 0% resource accuracy with 5 FP each on SD-016 and SD-017. The hallucination pattern is intent-agnostic — copilot's narrative-summary-style output drops fictional canonical-sounding filenames (`optimization_rubric.md`, `mcp_install_template.md`, etc.) regardless of which intent the prompt targets. The 075 caveat in cli-copilot/SKILL.md remains accurate.

**F-076-002**: All 3 CLIs picked the correct intent on both SD-016 and SD-017 (6/6 = 100% intent-pick rate on the new intents). Intent recognition is reliable across CLIs even when resource-path fidelity is poor. The bottleneck for downstream consumers is resource fidelity, not intent dispatch.

**F-076-003 (New)**: cli-opencode scored 0% on SD-017 INSTALL_GUIDE specifically — a regression from its general ~47% average. opencode mentioned generic "install guide" terminology but did not name `install_guide_creation.md` or `install_guide_template.md`. This is a single-cell observation (n=1); not enough to claim a systematic intent-specific weakness, but worth noting for follow-up.

---

## 5. METHODOLOGY NOTES

### Why re-extract instead of re-run
The 45 stored logs from 071 are stable artifacts. Re-running would (a) cost ~30 minutes wall-clock, (b) introduce CLI nondeterminism into the comparison, (c) confound the v2-vs-v3 measurement-method delta with run-to-run noise. **Re-extracting from the same stored logs is the methodology-correct way to compare two extraction methods**.

### Bullet-aware parsing (Pass A + B + C)
- **Pass A** captures full paths under `references/` or `assets/` (e.g., `references/global/optimization.md`).
- **Pass B** captures basenames inside markdown bullet items (`- llmstxt_templates.md`).
- **Pass C** falls back to bare basenames in narrative prose.

Union semantics across the 3 passes ensure no regression vs v2's flat substring; the bullet-pass adds robustness for future extractor extensions without changing measured numbers significantly on the current 51-cell corpus.

### Negative-segment filtering (carried from v2)
Both v2 and v3 strip paragraphs with negative markers (`not loaded:`, `would NOT load`, `excluded:`, etc.) before resource detection. Without this filter, CLIs that emit a "Resources NOT loaded:" section would be penalized for correctly identifying excluded resources.

---

## 6. RECOMMENDATIONS

| Priority | Action |
|---|---|
| **None (P0)** | No P0 findings. Per-CLI ranking is stable across extraction methods and intent coverage. |
| **P1** | None. P1-072-001 (cli-copilot hallucination) reproduces but is already documented in 075's caveat. |
| **P2** | If a future packet wants to test single-cell variance for SD-017 cli-opencode (F-076-003), run that cell 3-5 times. Cost: ~3 min wall-clock. |
| **P2** | If statistical significance is needed across CLIs, design a power-analysis-driven matrix (n>=30 per intent per CLI) in a separate packet. |

---

## 7. CONVERGENCE SIGNAL

The v3 numbers are within ±5pp of v2 across all 3 CLIs. The 2 new intents reproduce the cli-copilot hallucination pattern. These are **convergent observations** — no new architectural surprise. Future packets in this measurement track can either:
- Stop here (the measurement is well-characterized; downstream maintainers have actionable caveats in 075)
- Extend in a different direction (statistical significance, larger matrices, or stress-testing specific scenarios with run-to-run variance)

---

## 8. ARTIFACTS

| Artifact | Path |
|---|---|
| Matrix CSV (51 cells) | `076/matrix_v3.csv` |
| Extractor source | `076/scripts/extract_metrics_v3.py` |
| Dispatcher source | `076/scripts/run-matrix-076.sh` |
| New scenario files | `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/00[45]-*.md` |
| Raw logs (6 new) | `076/logs/SD-016/*.log`, `076/logs/SD-017/*.log` |
| Per-CLI deltas | `076/deltas/*.jsonl` |
| Predecessor v2 report | `072/review-report-v2.md` |
| Caveat in cli-copilot SKILL.md | from 075 |

---

## 9. VERDICT

**SHIP_AS_IS.** Coverage extended to all 11 intents; per-CLI ranking confirmed; methodology documented for reuse.
