---
title: "INTERACT-001 -- Interaction Capture And State Matrix"
description: "This scenario validates interaction capture for INTERACT-001. Interaction capture is default-on, so a plain extraction run captures hover, focus, active, and disabled states and the resulting tokens.json carries interaction data the writer turns into DESIGN.md section 11 (State Matrix). The opt-out path (--fast-no-interaction / --no-interaction) absence-stamps section 11."
---

# INTERACT-001 -- Interaction Capture And State Matrix

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `INTERACT-001`.

---

## 1. OVERVIEW

This scenario validates interaction capture for `INTERACT-001`. Interaction capture is default-on (`noInteraction = false`), so a plain extraction run triggers the `interaction-capture.ts` module, which simulates hover, focus, focus-visible, active, and disabled states on interactive elements and detects loading, empty, and error states through class/ARIA heuristics. The captured `InteractionData` lands in `tokens.json` under the interaction keys, and the DESIGN.md writer turns that data into `## 11. State Matrix`. `--fast` reduces crawl depth (`maxPages = 5`) but still captures interaction. To opt out, pass `--fast-no-interaction` (fast crawl that also skips interaction — the old `--fast` behavior) or `--no-interaction`; capture is then skipped and the State Matrix section contains only an absence note. `--with-interaction` is still accepted but is now redundant because it is the default.

### Why This Matters

Section 11 (State Matrix) is a required v2 core section of DESIGN.md. The validator checks for its presence and non-empty content. Because capture is default-on, the common path produces real interaction data; the failure mode this guards against is the inverse — an operator (or a stray `--no-interaction` / `--fast-no-interaction` flag) silently suppresses capture, so the State Matrix section is written as an absence note when the operator expected real token data, and the gap is only caught at validation time when section 11 contains only a note instead of real token data.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `INTERACT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a default extraction run captures interaction state and the resulting tokens.json carries interaction data suitable for DESIGN.md section 11, and that an opt-out run (`--fast-no-interaction`) absence-stamps section 11
- Real user request: `Extract the design system including interaction states from example.com.`
- Prompt: `Extract the design system including interaction states from example.com.`
- Expected execution process: detect the EXTRACT_WRITE phase from the request, verify tool readiness, run `cd tool && npx ts-node scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` (interaction capture is default-on; `--fast` reduces crawl depth but still captures interaction), inspect `<--output>/tokens.json` for interaction data under the interaction/captures keys, confirm the interaction payload structure matches the `InteractionData` type exported by `interaction-capture.ts`. To confirm the absence path, re-run with `--fast-no-interaction` and confirm the interaction block is absent so the writer absence-stamps section 11
- Expected signals: `extract.ts` exits 0; `tokens.json` is valid JSON > 1 KB with non-empty token arrays; `tokens.json` contains an interaction data block with a `captures` array where each entry has `element`, `componentType`, `defaultStyle`, and at least one of `hoverDiff`, `focusVisibleDiff`, `focusDiff`, `activeDiff`, or `disabledStyle`; agent confirms interaction data was captured
- Desired user-visible outcome: the agent reports the extraction completed, the output path, a summary of captured token counts, and a count of interactive elements whose states were captured
- Pass/fail: PASS if `extract.ts` exits 0 AND `tokens.json` contains interaction data with at least one non-null state diff AND agent reports the interaction capture summary correctly; FAIL if extraction exits non-zero OR tokens.json contains no interaction data on a default run (no opt-out flag passed) OR agent fabricates interaction capture counts

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Extraction stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. The `tool/node_modules/` directory must exist and `npx playwright install chromium` must have completed. A live, publicly reachable URL is required; `https://example.com` is the default, but operators may substitute any crawlable URL with interactive elements (buttons, links, inputs).

1. agent detects EXTRACT_WRITE phase with interaction intent  # -> phase detection output
2. verify tool readiness: `bash: node --version`, glob `tool/node_modules/`  # -> Node >= 18, node_modules exists
3. `cd .opencode/skills/sk-design-md-generator/tool && npx ts-node scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output`  # -> exits 0, crawl progress on stdout, interaction capture messages on stdout (capture is default-on; `--fast` still captures interaction)
4. `bash: ls -la <--output>/tokens.json`  # -> file exists, > 1 KB
5. `bash: node -e "const t = require('./<--output>/tokens.json'); const ic = t.interaction; console.log('Has interaction data:', !!ic); if (ic && ic.captures) { console.log('Interactive elements captured:', ic.captures.length); const withDiffs = ic.captures.filter((c) => c.hoverDiff || c.focusDiff || c.focusVisibleDiff || c.activeDiff || c.disabledStyle); console.log('Elements with state diffs:', withDiffs.length); }"` (run from `tool/`)  # -> interaction data present, at least one element has a state diff
6. agent reports token counts, interaction capture summary, and output path

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INTERACT-001 | Interaction capture and state matrix | Verify a default run captures hover/focus/active/disabled states and tokens.json carries interaction data for DESIGN.md §11, and `--fast-no-interaction` absence-stamps §11 | `Extract the design system including interaction states from example.com.` | 1. agent detects EXTRACT_WRITE phase with interaction intent -> 2. verify tool readiness (`node --version`, check `tool/node_modules/`) -> 3. `cd tool && npx ts-node scripts/extract.ts https://example.com --fast` (capture is default-on) -> 4. `ls -la <--output>/tokens.json` -> 5. inspect tokens.json for interaction data and state diffs -> 6. agent reports token counts and interaction capture summary | Step 1: phase detected as EXTRACT_WRITE with interaction intent. Step 2: Node >= 18, tool dependencies present. Step 3: extract exits 0, interaction capture messages on stdout. Step 4: tokens.json exists, > 1 KB, valid JSON. Step 5: tokens.json contains interaction data with at least one element showing state diffs. Step 6: agent reports captured element count and diff summary. | Transcript of `extract.ts --fast --output .opencode/specs/<track>/<packet>/output`, `ls -la` of output, interaction data inspection output | PASS if extract exits 0 AND tokens.json contains interaction data with at least one non-null state diff AND agent reports the interaction capture summary correctly. FAIL if extraction exits non-zero OR tokens.json contains no interaction data on a default run OR agent fabricates interaction capture counts | 1. Confirm interaction capture is default-on (`noInteraction = false`); `--fast` reduces crawl depth but still captures interaction. Use `--fast-no-interaction` or `--no-interaction` only to opt out (the negative/absence path). 2. Inspect stdout for `[interaction-capture]` log messages confirming the module ran. 3. If tokens.json has no interaction block on a default run, confirm capture was not disabled by a stray `--no-interaction` / `--fast-no-interaction` flag. 4. If the target site has no interactive elements, the captures array may be empty but the interaction block should still be present; this is a PASS with a note. 5. If the site returns 403/429, skip with a blocker and route to ESCALATE-001. |

### Optional Supplemental Checks

If the operator wants to confirm the full pipeline writes section 11, run the WRITE phase after extraction and inspect the resulting DESIGN.md for `## 11. State Matrix` with populated interaction data tables. Run `validate.ts` against the DESIGN.md + tokens.json pair to confirm section 11 passes the section-completeness check. To exercise the absence path, re-run extraction with `--fast-no-interaction` (or `--no-interaction`) so interaction capture is skipped, then confirm the DESIGN.md section 11 contains an explicit absence note rather than fabricated interaction data.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../tool/scripts/interaction-capture.ts` | Interaction state capture engine -- element discovery, state simulation, style-diff computation, loading/empty/error state detection |
| `../../tool/scripts/extract.ts` | Extraction orchestrator -- interaction capture is default-on (`noInteraction = false`); `--no-interaction` / `--fast-no-interaction` opt out, `--with-interaction` is the redundant default; invokes captureInteractions() when not opted out |
| `../../tool/scripts/validate.ts` | DESIGN.md validator -- checks section 11 (State Matrix) is present and non-empty |
| `../../tool/resources/design_md_format.md` | v2 format specification -- marks section 11 (State Matrix) as required |
| `../../feature_catalog/07--interaction-capture/interaction-capture.md` | Feature catalog entry for interaction-capture.ts |
| `../../SKILL.md` | SS2 SMART ROUTING -- the --with-interaction flag documentation; SS3 HOW IT WORKS -- the three-phase pipeline |

---

## 5. SOURCE METADATA

- Group: Interaction
- Playbook ID: INTERACT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--interaction/interaction-state-matrix.md`
