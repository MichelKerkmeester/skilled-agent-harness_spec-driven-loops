# Deep Review Report v2: 072-sk-doc-router-rerun-refined-extraction

**Packet**: `.opencode/specs/skilled-agent-orchestration/z_archive/060-sk-doc-router-rerun-refined-extraction/`
**Predecessor**: 071-sk-doc-router-stress-test (commit 46a63f9c1)
**Source data**: 071's 45 raw cell logs (no new dispatches — re-extraction only)
**Date**: 2026-05-05

---

## 1. Verdict

**PASS hasAdvisories=true** — measurement refined, qualitative ranking from 071 confirmed (cli-codex > cli-opencode > cli-copilot for sk-doc routing tasks). Surprise finding: cli-copilot hallucinates resource names (cites files that don't exist in sk-doc's filesystem) — this is a more concerning behavior than 071 first reported.

---

## 2. v1 (071) → v2 (072) Per-CLI Deltas

| CLI | Metric | v1 (071) | v2 (072) | Δ | Direction |
|---|---|---|---|---|---|
| **codex** | Resource accuracy | 66.7% | 66.7% | 0.0pp | unchanged ✓ |
| **codex** | False-positive refs/cell | 1.67 | 1.60 | −0.07 | tiny improvement |
| **codex** | Intent accuracy | 67% | 67% | 0pp | unchanged |
| **copilot** | Resource accuracy | 5.6% | **11.1%** | **+5.5pp** | corrected (still last) |
| **copilot** | False-positive refs/cell | 4.33 | **3.73** | **−0.60** | corrected |
| **copilot** | Intent accuracy | 40% | 40% | 0pp | unchanged |
| **opencode** | Resource accuracy | 43.3% | **47.2%** | **+3.9pp** | corrected |
| **opencode** | False-positive refs/cell | 1.73 | 1.53 | −0.20 | corrected |
| **opencode** | Intent accuracy | 53% | 53% | 0pp | unchanged |

Other metrics (duration, tokens, exit-rate) unchanged — same raw logs, just better extraction.

### What v2 changed

1. **Negative-segment exclusion**: paragraphs starting with negative markers ("Not loaded:", "would NOT load", "excluded:", etc.) are dropped before resource detection. This catches the "lists what's NOT loaded" sections cli-copilot tends to write.

2. **Basename matching**: instead of requiring full paths like `references/global/core_standards.md`, the extractor now matches both full paths AND short filenames (`core_standards.md`) against the basename of expected_resources. This was the bigger fix — many CLIs cite resources by basename only after a section header (`References (references/):` then bare `foo.md` lines).

---

## 3. Headline finding (NEW in v2): cli-copilot hallucinates resource paths

Spot-check on SD-001 (DOC_QUALITY) cli-copilot response:

```
References (`references/`):
- `core_standards.md` — baseline doc quality rules
- `workflows.md` — workflow/process guidance referenced in the request
- `dqi_rubric.md` (or equivalent DQI scoring reference) — for DQI checks

Assets (`assets/`):
- DQI checklist / scoring template (e.g., `dqi_checklist.md` or `dqi_score_template.md`)
```

**Reality check**: sk-doc's actual `references/global/` contains validation.md, workflows.md, core_standards.md, evergreen_packet_id_rule.md, optimization.md, hvr_rules.md, quick_reference.md. **`dqi_rubric.md`, `dqi_checklist.md`, and `dqi_score_template.md` do NOT exist** anywhere in sk-doc.

cli-copilot is citing plausible-sounding but FABRICATED file names. This is:
- **Different from "verbose"** (which 071 hypothesized): not just over-listing real resources, but inventing nonexistent ones.
- **Actually worse than 071's 5.6%** suggests: a user trusting copilot's routing trace would attempt to load `dqi_rubric.md`, fail, and have to debug. The 11.1% v2 accuracy slightly underweights how confidently incorrect the response is.
- **A hallucination signature**: claude-opus-4.7 may be primed by sk-doc's "DQI" terminology to invent supporting filenames; codex (gpt-5.5/high) and opencode (deepseek-v4-pro) are more conservative — they stick to real paths.

cli-codex's 1.60 false-positive average (and 66.7% accuracy) means most of its mentions are real expected resources or genuinely-relevant siblings. cli-opencode 1.53 FP is similar. cli-copilot 3.73 FP is dominated by hallucinated paths.

---

## 4. Confirmed Recommendations (071 → 072)

| Recommendation | 071 verdict | 072 verdict | Action |
|---|---|---|---|
| cli-codex as preferred default for sk-doc dispatches | ✓ | ✓ STRONGER | Document in cli-codex README + sk-doc invocation hints |
| cli-opencode acceptable for cost-tolerant batch | ✓ | ✓ | No action |
| cli-copilot's verbosity makes it a poor fit | ✓ | ✓ STRONGER + UPDATED | New angle: cli-copilot also HALLUCINATES resource names. Not just verbose — confidently incorrect |
| Refine measurement script | (P1) | DONE in v2 | extract_metrics_v2.py shipped |
| Raise opencode timeout to 180s | (P1) | (carry forward) | Future packet |
| OPTIMIZATION + INSTALL_GUIDE intent coverage | (gap) | (gap, unchanged) | Future packet |

---

## 5. Updated Findings (post-v2)

### P0 (resolved in 071, no new)
None.

### P1 (refined or new)

**P1-072-001 (NEW): cli-copilot hallucinates resource paths** — confidence-incorrect citations of nonexistent files (`dqi_rubric.md` etc.). Mitigation: prefer cli-codex for sk-doc routing; if cli-copilot must be used, treat its routing-trace output as advisory and verify against the actual sk-doc file tree before relying on it.

### P2 (advisory)

**P2-072-001**: v2 detect_resources_v2() basename matching is fairer but still imperfect. Tighter heuristic could parse markdown bullet lists explicitly and weight LIST-item mentions higher than prose mentions. Future packet candidate.

**P2-072-002**: 9 of 11 sk-doc intents covered by 071's 15 scenarios; OPTIMIZATION + INSTALL_GUIDE deferred. Future packet candidate.

---

## 6. Files

- `072/scripts/extract_metrics_v2.py` — refined extractor (basename matching + negative-segment filtering)
- `072/matrix_v2.csv` — 45 rows × 19 cols, refined accuracy numbers
- `072/review-report-v2.md` — this report
- `072/{spec,plan,tasks,implementation-summary}.md` — packet docs

Source data (read-only, not modified):
- `071/002-matrix-execute/logs/SD-NNN/{cli}.log` — 45 raw cell logs
- `071/003-synthesize/scripts/extract_metrics.py` — v1 extractor for comparison

---

## 7. Verdict (final)

**PASS hasAdvisories=true** — packet 072 is a clean measurement-refinement follow-up. cli-codex remains the preferred default; cli-copilot's hallucination signature (NEW finding) makes it riskier than 071 originally suggested for any sk-doc workflow that consumes routing-trace output. No further follow-up required, but P1-072-001 (copilot hallucination) deserves a documentation note in cli-copilot's README + sk-doc's invocation hints — flagged for any maintainer doing routine cli-* docs work, not a separate packet.
