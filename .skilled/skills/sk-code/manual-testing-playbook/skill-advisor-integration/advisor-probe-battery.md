---
title: "SA-001: Skill Advisor Probe Battery"
description: "Run a labeled probe set (12 positives + >=5 negatives) through the skill advisor and verify sk-code routing accuracy meets threshold."
version: 1.5.3.0
---

# SA-001: Skill Advisor Probe Battery

## 1. OVERVIEW

This scenario verifies the END-TO-END accuracy of sk-code routing via the skill advisor. Unlike SD-* / LS-* / RD-* scenarios that test single prompts, SA-001 runs a battery of 12 positive controls (should win sk-code at ≥0.80) and ≥5 negative controls (should NOT win sk-code).

Baseline: `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement-results.jsonl` records 17 sk-code-labelled prompts with 4 routed correctly, an accuracy of about 0.24, well below deep-research and deep-review. This scenario establishes a fresh accuracy measurement against a curated probe set rather than rereading that record.

---

## 2. SCENARIO CONTRACT

Prompt: this scenario runs the surviving P1-P11 and P15 / N1-N5 probe battery listed below through the skill advisor; there is no single canonical prompt.

### Probe Set Construction Rules

**Positive controls (n=12)** — should win sk-code with `passes_threshold` true at the probe's `--threshold 0.8`:

| ID | Surface | Sub-language | Prompt |
|---|---|---|---|
| P1 | SKILLED | TypeScript | `Refactor the parseExecutorConfig function in .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts to throw on missing model when type is cli-opencode.` |
| P2 | SKILLED | TypeScript | `Implement a negative-trigger whitelist in gate-3-classifier.ts and run the targeted tests.` (golden set rr-iter2-001) |
| P3 | SKILLED | Python | `Refactor skill_advisor.py to surface raw ambiguity counts in debug output.` (golden set rr-iter2-004) |
| P4 | SKILLED | TypeScript | `Write a Vitest covering classifyPrompt() for the resume deep review phrase.` (golden set rr-iter2-006) |
| P5 | SKILLED | Config | `Configure .vscode/mcp.json to mirror the current codeGraph server inputs.` (golden set rr-iter2-009) |
| P6 | SKILLED | Python | `Use the OpenCode standards route to clean up this CommonJS helper.` (golden set rr-iter2-059) |
| P7 | SKILLED | TypeScript | `Add a packet-local helper that formats Gate 3 confusion-matrix rows for the research summary.` (golden set rr-iter3-061) |
| P8 | SKILLED | Config | `Generate a replacement gate3-baseline.json fixture for the first 100 prompts.` (golden set rr-iter3-064) |
| P9 | SKILLED | TypeScript | `Refactor the corpus scoring helper so it emits stable JSONL keys in sorted order.` (golden set rr-iter3-065) |
| P10 | SKILLED | Shell | `Build a tiny script that counts how many prompts mention /speckit:resume.` (golden set rr-iter3-070) |
| P11 | SKILLED | Shell | `Add set -euo pipefail and a trap to .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh to clean up the temp dir on exit.` |
| P15 | SKILLED | Python | `Add a --threshold flag to verify_alignment_drift.py that adjusts the failure threshold for missing module headers.` |

**Negative controls (n=5+)** — should NOT win sk-code:

| ID | Expected Top-1 | Why NOT sk-code | Prompt |
|---|---|---|---|
| N1 | sk-doc | doc edit | `Update the sk-code SKILL.md headline section to clarify the two-axis routing model.` (RD-002 prompt) |
| N2 | none | read-only analysis | `Explain how skill_advisor.py computes uncertainty.` (golden set rr-iter2-013) |
| N3 | spec_kit:resume | session continuity | `Resume the deep-review iteration from the last save point.` |
| N4 | sk-doc | doc structure | `Reorganize the cli-opencode README into Quick Start, Architecture, and Reference sections.` |
| N5 | deep-research | research, not code | `Investigate why the gate-3 classifier mis-categorizes resume prompts and report findings as a research summary.` |

### Pass/Fail Aggregate Rules

- **Positive accuracy**: positive controls where sk-code is top-1 with `passes_threshold` true, over the total positive controls
- **Negative false-positive rate**: negative controls where sk-code is top-1, over the total negative controls

**PASS** iff: positive accuracy ≥ 0.80 (≥10 of 12) AND negative false-positive rate == 0 (0 of 5).
**FAIL** iff: positive accuracy < 0.80 (fewer than 10 of 12) OR negative false-positive rate > 0 (any of the 5 negatives incorrectly won by sk-code).

---

## 3. TEST EXECUTION

### Preconditions

1. Skill advisor binary callable.
2. `skill-graph.json` is at HEAD-of-main; sk-code entry has `signals` array intact.

### Exact Command Sequence

1. **For each of the 17 prompts in the battery** (P1-P11, P15, N1-N5) write one parsed record. The advisor prints a pretty-printed JSON array, so a raw append would concatenate arrays into a file that is not JSONL; parse each run and print one object per prompt instead:
   ```
   bash: python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "<prompt>" --threshold 0.8 | python3 -c 'import json,sys; rows=json.load(sys.stdin); top=rows[0] if rows else {}; print(json.dumps({"prompt": sys.argv[1], "top": top.get("skill"), "confidence": top.get("confidence"), "score": top.get("score"), "passes_threshold": top.get("passes_threshold"), "candidates": [r["skill"] for r in rows]}))' "<prompt>" >> /tmp/skc-SA001-advisor-results.jsonl
   ```
   An empty array is a valid advisor answer, so that prompt's record carries `"top": null` instead of failing the step.
2. **Parse aggregate** (a small Python script over the 17 records): count positive wins, negative false-positives, compute accuracy.
3. **Compare to baseline**: `smart-router-measurement-results.jsonl` records 4 of 17 sk-code-labelled prompts correct, about 0.24. New accuracy should be measurably higher OR identical (no regression).
4. **Write aggregate report** to `/tmp/skc-SA001-aggregate.md` with:
   - Per-prompt outcome (top-1, `confidence`, `score`, expected, PASS/FAIL)
   - Total positives won / total positives
   - Total negatives correctly rejected / total negatives
   - Final accuracy %
   - Delta against the recorded baseline

### Expected Signals

| Step | Signal |
|---|---|
| 1 | `/tmp/skc-SA001-advisor-results.jsonl` holds exactly 17 lines, one parsed record per prompt; `wc -l` prints `17`. |
| 2 | Aggregate computed: positive_accuracy and negative_fpr scalars. |
| 3 | New accuracy is at least the recorded baseline and ideally reaches the 0.80 bar. |
| 4 | Report file written. |

A reference run of this battery produced sk-code top-1 with `passes_threshold` true on 11 of the 12 positives and on none of the 5 negatives, giving positive accuracy 0.92 and a negative false-positive rate of 0. The aggregate rule below decides the verdict; the numbers record what that run printed and are not themselves the criterion.

### Pass/Fail Criteria

See aggregate rules above.

Evidence: `/tmp/skc-SA001-advisor-results.jsonl` (per-prompt advisor output) and `/tmp/skc-SA001-aggregate.md` (aggregate report).

### Failure Triage

If the probe printed `Native advisor unavailable ... falling back to local Python scorer`, every record came from the local scorer, which has no `score` field and can disagree with the native path. Run the battery again once the native advisor is restored before reading a regression into the numbers.

If positive accuracy < 0.80:
1. Identify which positives lost. Common patterns:
   - Missing surface marker in prompt (e.g. doesn't mention `.skilled/` explicitly)
   - sk-code-review or system-spec-kit captured the prompt because more of its signal vocabulary matched
2. Propose the change as an edit to the `signals` list of `skill-graph.json`, which is a flat list of strings keyed by skill id. Append the vocabulary the lost prompt should have matched, or remove the entry that captured it. The graph has no per-skill object and no anti-signal field. Any such change alters global advisor routing, so it needs the operator's explicit approval before it lands. Candidate additions based on the lost prompts:
   - "verify alignment", "alignment verifier" (covers verify_alignment_drift.py prompts)
   - "executor config", "executor type" (covers cli-opencode config prompts)
   - "Gate 3", "classifier" (covers gate-3-classifier.ts prompts)
3. Or propose an adjacency adjustment, such as lowering the `enhances.system-spec-kit` weight, to reduce competition.

If negative FPR > 0:
1. Identify which negatives sk-code captured. The common pattern is a doc edit that names sk-code, where sk-doc should win because the deliverable is text.
2. Propose the same kind of edit: remove the sk-code signal that matched, or append the doc-edit vocabulary that should have outranked it.

---

## 4. SOURCE FILES

- `../manual-testing-playbook.md` — Root directory page and scenario summary.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` — advisor binary.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` — sk-code signals + adjacency.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` — golden set source (used for P2-P10).
- `.skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-measurement-results.jsonl` — baseline accuracy reference (4 of 17 sk-code-labelled prompts correct, in that file's own recorded measurement).

Catalog: `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md`, the entry that states the skill advisor routes every code-related prompt to the single identity `sk-code`.

---

## 5. SOURCE METADATA

- Group: Skill Advisor Integration
- Playbook ID: SA-001
- **Created**: 2026-05-04
- **Critical path**: Yes (validates the END-TO-END routing accuracy for sk-code)
- **Destructive**: No (only reads and measures; any `skill-graph.json` edit needs the operator's explicit approval first)
- **Concurrent-safe**: Yes (advisor probes can run in parallel; cap at 5)
- **Last validated**: pending first manual run against this scenario's current probe set and criteria.

**Note on global impact**: These changes affect global advisor routing across all skills. The N4 prompt ("Reorganize the cli-opencode README into Quick Start, Architecture, and Reference sections") routes to `cli-external-orchestration` rather than sk-code, which is the intended negative. The aggregate rule decides, so a routing change to another skill is recorded rather than assumed.
