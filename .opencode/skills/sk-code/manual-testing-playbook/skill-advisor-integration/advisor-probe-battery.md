---
title: "SA-001: Skill Advisor Probe Battery"
description: "Run a labeled probe set (>=15 positives + >=5 negatives) through the skill advisor and verify sk-code routing accuracy meets threshold."
version: 3.5.0.9
---

# SA-001: Skill Advisor Probe Battery

## 1. OVERVIEW

This scenario verifies the END-TO-END accuracy of sk-code routing via the skill advisor. Unlike SD-* / LS-* / RD-* scenarios that test single prompts, SA-001 runs a battery of ≥15 positive controls (should win sk-code at ≥0.80) and ≥5 negative controls (should NOT win sk-code).

Baseline: per `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` (2026-05-03), sk-code accuracy is **50%** (4/8 correct), well below deep-research (88.6%) and deep-review (81.8%). This scenario establishes a fresh accuracy measurement against a curated probe set.

---

## 2. SCENARIO CONTRACT

Prompt: this scenario runs the full P1-P15 / N1-N5 probe battery listed below through the skill advisor; there is no single canonical prompt.

### Probe Set Construction Rules

**Positive controls (n=15+)** — should win sk-code at ≥0.80:

| ID | Surface | Sub-language | Prompt |
|---|---|---|---|
| P1 | OPENCODE | TypeScript | `Refactor the parseExecutorConfig function in .opencode/skills/system-spec-kit/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.` |
| P2 | OPENCODE | TypeScript | `Implement a negative-trigger whitelist in gate-3-classifier.ts and run the targeted tests.` (golden set rr-iter2-001) |
| P3 | OPENCODE | Python | `Refactor skill_advisor.py to surface raw ambiguity counts in debug output.` (golden set rr-iter2-004) |
| P4 | OPENCODE | TypeScript | `Write a Vitest covering classifyPrompt() for the resume deep review phrase.` (golden set rr-iter2-006) |
| P5 | OPENCODE | Config | `Configure .vscode/mcp.json to mirror the current codeGraph server inputs.` (golden set rr-iter2-009) |
| P6 | OPENCODE | Python | `Use the OpenCode standards route to clean up this CommonJS helper.` (golden set rr-iter2-059) |
| P7 | OPENCODE | TypeScript | `Add a packet-local helper that formats Gate 3 confusion-matrix rows for the research summary.` (golden set rr-iter3-061) |
| P8 | OPENCODE | Config | `Generate a replacement gate3-baseline.json fixture for the first 100 prompts.` (golden set rr-iter3-064) |
| P9 | OPENCODE | TypeScript | `Refactor the corpus scoring helper so it emits stable JSONL keys in sorted order.` (golden set rr-iter3-065) |
| P10 | OPENCODE | Shell | `Build a tiny script that counts how many prompts mention /speckit:resume.` (golden set rr-iter3-070) |
| P11 | OPENCODE | Shell | `Add set -euo pipefail and a trap to .opencode/skills/system-spec-kit/scripts/spec/validate.sh to clean up the temp dir on exit.` |
| P12 | WEBFLOW | n/a | `Add a Lenis smooth-scroll initializer to src/2_javascript/scroll.js and gate it behind an IntersectionObserver.` |
| P13 | WEBFLOW | n/a | `Wire up a GSAP timeline that animates the hero section on page load with motion.dev fallback.` |
| P14 | WEBFLOW | n/a | `Initialize an HLS.js video player on .video-hero with adaptive bitrate fallback.` |
| P15 | OPENCODE | Python | `Add a --threshold flag to verify_alignment_drift.py that adjusts the failure threshold for missing module headers.` |

**Negative controls (n=5+)** — should NOT win sk-code:

| ID | Expected Top-1 | Why NOT sk-code | Prompt |
|---|---|---|---|
| N1 | sk-doc | doc edit | `Update the sk-code SKILL.md headline section to clarify the two-axis routing model.` (RD-002 prompt) |
| N2 | none | read-only analysis | `Explain how skill_advisor.py computes uncertainty.` (golden set rr-iter2-013) |
| N3 | spec_kit:resume | session continuity | `Resume the deep-review iteration from the last save point.` |
| N4 | sk-doc | doc structure | `Reorganize the cli-opencode README into Quick Start, Architecture, and Reference sections.` |
| N5 | deep-research | research, not code | `Investigate why the gate-3 classifier mis-categorizes resume prompts and report findings as a research summary.` |

### Pass/Fail Aggregate Rules

- **Positive accuracy**: positive controls won at ≥0.80 / total positive controls
- **Negative false-positive rate**: negative controls where sk-code was top-1 / total negative controls

**PASS** iff: positive accuracy ≥ 0.80 (≥12 of 15) AND negative false-positive rate == 0 (0 of 5).
**FAIL** iff: positive accuracy < 0.80 (fewer than 12 of 15) OR negative false-positive rate > 0 (any of the 5 negatives incorrectly won by sk-code).

---

## 3. TEST EXECUTION

### Preconditions

1. Skill advisor binary callable.
2. `skill-graph.json` is at HEAD-of-main; sk-code entry has `signals` array intact.

### Exact Command Sequence

1. **For each prompt in the battery** (P1-P15, N1-N5):
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "<prompt>" --threshold 0.8 >> /tmp/skc-SA001-advisor-results.jsonl
   ```
2. **Parse aggregate** (use `jq` or a small Python script): count positive wins, negative false-positives, compute accuracy.
3. **Compare to baseline**: 50% (per smart-router-measurement-results.jsonl). New accuracy should be measurably higher OR identical (no regression).
4. **Write aggregate report** to `/tmp/skc-SA001-aggregate.md` with:
   - Per-prompt outcome (top-1, score, expected, PASS/FAIL)
   - Total positives won / total positives
   - Total negatives correctly rejected / total negatives
   - Final accuracy %
   - Delta vs 50% baseline

### Expected Signals

| Step | Signal |
|---|---|
| 1 | `/tmp/skc-SA001-advisor-results.jsonl` contains 20+ JSON lines (one per prompt). |
| 2 | Aggregate computed: positive_accuracy and negative_fpr scalars. |
| 3 | New accuracy >= 50% (ideally >= 80%). |
| 4 | Report file written. |

### Pass/Fail Criteria

See aggregate rules above.

Evidence: `/tmp/skc-SA001-advisor-results.jsonl` (per-prompt advisor output) and `/tmp/skc-SA001-aggregate.md` (aggregate report).

### Failure Triage

If positive accuracy < 0.80:
1. Identify which positives lost. Common patterns:
   - Missing surface marker in prompt (e.g. doesn't mention `.opencode/` explicitly)
   - sk-code-review or system-spec-kit captured the prompt due to higher signal weight on shared keywords
2. Propose `signals` array additions to sk-code (Phase E5 gate — DO NOT commit without user approval). Candidate additions based on lost prompts:
   - "verify alignment", "alignment verifier" (covers verify_alignment_drift.py prompts)
   - "executor config", "executor type" (covers cli-opencode config prompts)
   - "Gate 3", "classifier" (covers gate-3-classifier.ts prompts)
3. Or propose adjacency adjustments (e.g. lower `enhances.system-spec-kit` weight to reduce competition).

If negative FPR > 0:
1. Identify which negatives sk-code falsely captured. Common pattern: `Update sk-code SKILL.md ...` should go to sk-doc but sk-code wins because of "sk-code" mention.
2. Propose anti-signals (`negative_keywords`) for sk-code: `["headline", "rewrite section", "SKILL.md update"]`.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` — advisor binary.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill-graph.json` — sk-code signals + adjacency.
- `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/labeled-prompts.jsonl` — golden set source (used for P2-P10).
- `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` — baseline accuracy reference (50% for sk-code per that file's own recorded measurement).

---

## 5. SOURCE METADATA

- Group: Skill Advisor Integration
- Playbook ID: SA-001
- **Created**: 2026-05-04
- **Critical path**: Yes (validates the END-TO-END routing accuracy for sk-code)
- **Destructive**: No (only reads + measures; any skill-graph.json edits gated on Phase E5 user approval)
- **Concurrent-safe**: Yes (advisor probes can run in parallel; cap at 5)
- **Last validated**: pending first manual run against this scenario's current probe set and criteria.

**Note on global impact**: These changes affect global advisor routing across all skills. The N04 prompt ("Reorganize the cli-opencode README into Quick Start, Architecture, and Reference sections") now routes to `sk-doc` (correct) instead of `cli-opencode` — beneficial collateral effect. No regressions detected in v4 vs baseline.
