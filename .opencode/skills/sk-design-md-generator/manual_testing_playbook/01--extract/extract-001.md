---
title: "EXTRACT-001 -- Live Extraction Produces Valid tokens.json"
description: "This scenario validates live extraction for EXTRACT-001. It focuses on confirming extract.ts --fast against a real URL produces a valid, non-empty tokens.json with populated token arrays."
---

# EXTRACT-001 -- Live Extraction Produces Valid tokens.json

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `EXTRACT-001`.

---

## 1. OVERVIEW

This scenario validates live extraction for `EXTRACT-001`. It focuses on confirming `extract.ts --fast` against a live, JavaScript-renderable URL produces a valid `tokens.json` at `output/<domain>/tokens.json` with non-empty `colorTokens`, `typographyLevels`, `shadowTokens`, `radiusTokens`, and `spacingScale` arrays, plus screenshots and an extraction report.

### Why This Matters

Extraction is Phase 1 of the three-phase pipeline. Every downstream artifact — DESIGN.md, the fidelity validation, the visual report — depends on `tokens.json` as ground truth. If extraction fails or produces an empty `tokens.json`, the entire skill is blocked. The failure mode this guards against is a silent crawl failure that produces an empty or partial `tokens.json` without the operator noticing.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `EXTRACT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm the full extraction phase runs against a live URL and emits valid tokens.json
- Real user request: `Extract the design system from example.com.`
- Prompt: `Extract the design system from example.com.`
- Expected execution process: detect the EXTRACT_WRITE phase from the request, verify tool readiness, run `cd tool && npx ts-node scripts/extract.ts https://example.com --fast`, confirm `output/example.com/tokens.json` exists, is valid JSON, and contains non-empty `colorTokens`, `typographyLevels`, `shadowTokens`, `radiusTokens`, and `spacingScale` arrays
- Expected signals: `extract.ts` exits 0; `output/example.com/tokens.json` is a valid JSON file > 1 KB with populated token arrays; screenshots land in `output/example.com/`; an extraction report is written
- Desired user-visible outcome: the agent reports the extraction completed, the output path, and a summary of captured token counts
- Pass/fail: PASS if `extract.ts` exits 0 AND `tokens.json` is valid JSON with non-empty token arrays AND agent reports the output correctly; FAIL if extraction exits non-zero OR tokens.json is empty/missing OR agent fabricates token counts

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Extraction stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. The `tool/node_modules/` directory must exist and `npx playwright install chromium` must have completed. A live, publicly reachable URL is required; `https://example.com` is the default, but operators may substitute any crawlable URL.

1. agent detects EXTRACT_WRITE phase  # -> phase detection output
2. verify tool readiness: `bash: node --version`, glob `tool/node_modules/`  # -> Node >= 18, node_modules exists
3. `cd .opencode/skills/sk-design-md-generator/tool && npx ts-node scripts/extract.ts https://example.com --fast`  # -> exits 0, crawl progress on stdout
4. `bash: ls -la output/example.com/tokens.json`  # -> file exists, > 1 KB
5. `bash: node -e "const t = require('./output/example.com/tokens.json'); console.log('colorTokens:', t.colorTokens?.length, 'typographyLevels:', t.typographyLevels?.length, 'shadowTokens:', t.shadowTokens?.length, 'radiusTokens:', t.radiusTokens?.length, 'spacingScale:', t.spacingScale?.length)"` (run from `tool/`)  # -> all lengths > 0
6. agent reports token counts and output path

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EXTRACT-001 | Live extraction | Verify `extract.ts --fast` against a live URL produces valid tokens.json | `Extract the design system from example.com.` | 1. agent detects EXTRACT_WRITE phase -> 2. verify tool readiness (`node --version`, check `tool/node_modules/`) -> 3. `cd tool && npx ts-node scripts/extract.ts https://example.com --fast` -> 4. `bash: ls -la output/example.com/tokens.json` -> 5. agent reports token counts | Step 1: phase detected as EXTRACT_WRITE. Step 2: Node >= 18, tool dependencies present. Step 3: extract exits 0, crawl output on stdout. Step 4: tokens.json exists, >1 KB, valid JSON. Step 5: agent reports counts from colorTokens, typographyLevels, etc. | Transcript of `extract.ts --fast`, `ls -la` of output, token count summary | PASS if `extract.ts` exits 0 AND `tokens.json` is valid JSON with non-empty token arrays AND agent reports the output correctly. FAIL if extraction exits non-zero OR tokens.json is empty/missing OR agent fabricates token counts | 1. Confirm `--fast` was used (5 pages, 8 concurrency). 2. Confirm `output/example.com/tokens.json` exists and parses as JSON. 3. Confirm token arrays are non-empty. 4. If the site returns 403/429, skip with a blocker (site blocks crawlers) and route to ESCALATE-001. |

### Optional Supplemental Checks

If the user requests a deeper crawl, re-run with `--max-pages 10` (no `--fast`) and confirm more tokens are captured. If the user wants interaction-state tokens, add `--with-interaction` and confirm hover/focus/active tokens appear in the output with `stabilityClass: "L3"`. The `--fast` flag is sufficient for the default scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../tool/scripts/extract.ts` | Extraction orchestrator — parses CLI args, crawls pages, emits tokens.json |
| `../../tool/scripts/crawl.ts` | Playwright crawler — loads pages across 5 viewports, collects computed CSS |
| `../../tool/scripts/cluster.ts` | OKLCH token cluster — classifies tokens L1-L4, merges multi-page token sets |
| `../../tool/scripts/dark-mode-detect.ts` | Dark-mode detection — keys on prefers-color-scheme media query |
| `../../tool/scripts/dom-collector.ts` | DOM collector — gathers element styles from the live page |
| `../../tool/scripts/css-analyzer.ts` | CSS analyzer — extracts computed styles into structured token candidates |
| `../../tool/scripts/icon-detect.ts` | Icon system detection |
| `../../tool/scripts/framework-detect.ts` | Framework marker detection |
| `../../tool/scripts/motion-extract.ts` | Motion/animation token extraction |
| `../../tool/scripts/a11y-extract.ts` | Accessibility data extraction |
| `../../tool/scripts/design-boundary-detect.ts` | Design-system boundary detection |
| `../../tool/scripts/interaction-capture.ts` | Hover/focus/active state capture |
| `../../references/extraction_workflow.md` | Phase 1 operational guide |
| `../../SKILL.md` | §3 HOW IT WORKS — the three-phase pipeline and cardinal fidelity rule |

---

## 5. SOURCE METADATA

- Group: Extract
- Playbook ID: EXTRACT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--extract/extract-001.md`
