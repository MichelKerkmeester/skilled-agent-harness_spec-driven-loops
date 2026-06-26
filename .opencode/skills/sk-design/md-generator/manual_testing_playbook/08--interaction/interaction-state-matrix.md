---
title: "INTERACT-001 -- Interaction Capture And State Matrix"
description: "This scenario validates interaction capture for INTERACT-001. Interaction capture is default-on, so a plain extraction run captures hover, focus, active, and disabled states and the resulting tokens.json carries interaction data the writer turns into the v3 Style Reference's Components hover/focus/active states. The opt-out path (--fast-no-interaction / --no-interaction) leaves those states absent rather than fabricating them."
version: 1.0.0.6
---

# INTERACT-001 -- Interaction Capture And State Matrix

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `INTERACT-001`.

---

## 1. OVERVIEW

This scenario validates interaction capture for `INTERACT-001`. Interaction capture is default-on (`noInteraction = false`), so a plain extraction run triggers the `interaction-capture.ts` module, which simulates hover, focus, focus-visible, active, and disabled states on interactive elements and detects loading, empty, and error states through class/ARIA heuristics. The captured `InteractionData` is matched to components during clustering and folded into the component variants — it is NOT written as a top-level interaction block in `tokens.json`. Each matched variant carries the diffs as `hoverChanges`, `focusVisibleChanges`, `focusChanges`, `activeChanges`, and `disabledStyle`, and the v3 writer turns those into the hover/focus/active states described inside the named Components. `--fast` reduces crawl depth (`maxPages = 5`) but still captures interaction. To opt out, pass `--fast-no-interaction` (fast crawl that also skips interaction — the old `--fast` behavior) or `--no-interaction`; capture is then skipped and the Components simply omit interaction states rather than fabricating them. `--with-interaction` is still accepted but is now redundant because it is the default. (The v3 schema has no numbered §11 State Matrix; interaction states are characterized inside the named Components.)

### Why This Matters

In the v3 Style Reference, interaction states are characterized inside the named Components, grounded in the captured `InteractionData`. Because capture is default-on, the common path produces real interaction data; the failure mode this guards against is the inverse — an operator (or a stray `--no-interaction` / `--fast-no-interaction` flag) silently suppresses capture, so the Components omit interaction states when the operator expected real token data, and the gap is only caught when the tokens carry no interaction block.

---

## 2. SCENARIO CONTRACT

Operators run the exact command sequence for `INTERACT-001` and confirm the expected signals without contradictory evidence.

- Objective: confirm a default extraction run captures interaction state and that the captured diffs are folded into the component variants in `tokens.json` (`components[].variants[].hoverChanges` / `focusVisibleChanges` / `focusChanges` / `activeChanges` / `disabledStyle`) — the writer turns those into the Components hover/focus/active states — and that an opt-out run (`--fast-no-interaction`) leaves those variant fields null instead of fabricating them
- Real user request: `Extract the design system including interaction states from example.com.`
- Prompt: `Extract the design system including interaction states from example.com.`
- Expected execution process: detect the EXTRACT_WRITE phase from the request, verify tool readiness, run `npx ts-node .opencode/skills/sk-design/md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` (interaction capture is default-on; `--fast` reduces crawl depth but still captures interaction), then inspect `<--output>/tokens.json` `components[].variants[]` for the folded interaction-state fields. Note: extraction does not write a top-level `tokens.interaction.captures` block — the raw `InteractionData` from `interaction-capture.ts` is matched to components and persisted only as the per-variant `*Changes` / `disabledStyle` fields. To confirm the absence path, re-run with `--fast-no-interaction` and confirm those variant fields are null so the writer leaves the Components interaction states out
- Expected signals: `extract.ts` exits 0; `tokens.json` is valid JSON > 1 KB with non-empty token arrays; at least one entry in `tokens.json` `components[].variants[]` has a non-null `hoverChanges`, `focusVisibleChanges`, `focusChanges`, `activeChanges`, or `disabledStyle`; agent confirms interaction data was captured
- Desired user-visible outcome: the agent reports the extraction completed, the output path, a summary of captured token counts, and a count of component variants whose interaction states were captured
- Pass/fail: PASS if `extract.ts` exits 0 AND at least one component variant in `tokens.json` carries a non-null interaction-state field AND agent reports the interaction capture summary correctly; FAIL if extraction exits non-zero OR no component variant carries any interaction-state field on a default run (no opt-out flag passed) OR agent fabricates interaction capture counts

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local or delegate. Extraction stays local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

PRE: Wave 1 (SETUP-001) must be PASS. The `backend/node_modules/` directory must exist and `npx playwright install chromium` must have completed. A live, publicly reachable URL is required; `https://example.com` is the default, but operators may substitute any crawlable URL with interactive elements (buttons, links, inputs).

1. agent detects EXTRACT_WRITE phase with interaction intent  # -> phase detection output
2. verify tool readiness: `bash: node --version`, glob `backend/node_modules/`  # -> Node 20+, node_modules exists
3. `npx ts-node .opencode/skills/sk-design/md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output`  # -> exits 0, crawl progress on stdout, interaction capture messages on stdout (capture is default-on; `--fast` still captures interaction)
4. `bash: ls -la <--output>/tokens.json`  # -> file exists, > 1 KB
5. `bash: node -e "const t = require('./<--output>/tokens.json'); const variants = (t.components || []).flatMap((c) => c.variants || []); const withDiffs = variants.filter((v) => v.hoverChanges || v.focusChanges || v.focusVisibleChanges || v.activeChanges || v.disabledStyle); console.log('Component variants:', variants.length); console.log('Variants with interaction-state fields:', withDiffs.length);"` (run from the repo root)  # -> at least one component variant carries a non-null interaction-state field
6. agent reports token counts, interaction capture summary, and output path

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INTERACT-001 | Interaction capture and state matrix | Verify a default run captures hover/focus/active/disabled states folded into `tokens.json` component variants the writer turns into Components hover/focus/active states, and `--fast-no-interaction` leaves those variant fields null | `Extract the design system including interaction states from example.com.` | 1. agent detects EXTRACT_WRITE phase with interaction intent -> 2. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 3. `npx ts-node .opencode/skills/sk-design/md-generator/backend/scripts/extract.ts https://example.com --fast` (capture is default-on) -> 4. `ls -la <--output>/tokens.json` -> 5. inspect `tokens.json` `components[].variants[]` for folded interaction-state fields -> 6. agent reports token counts and interaction capture summary | Step 1: phase detected as EXTRACT_WRITE with interaction intent. Step 2: Node 20+, tool dependencies present. Step 3: extract exits 0, interaction capture messages on stdout. Step 4: tokens.json exists, > 1 KB, valid JSON. Step 5: at least one `components[].variants[]` entry has a non-null `hoverChanges` / `focusChanges` / `focusVisibleChanges` / `activeChanges` / `disabledStyle`. Step 6: agent reports captured variant count and diff summary. | Transcript of `extract.ts --fast --output .opencode/specs/<track>/<packet>/output`, `ls -la` of output, component-variant interaction-field inspection output | PASS if extract exits 0 AND at least one component variant carries a non-null interaction-state field AND agent reports the interaction capture summary correctly. FAIL if extraction exits non-zero OR no component variant carries any interaction-state field on a default run OR agent fabricates interaction capture counts | 1. Confirm interaction capture is default-on (`noInteraction = false`); `--fast` reduces crawl depth but still captures interaction. Use `--fast-no-interaction` or `--no-interaction` only to opt out (the negative/absence path). 2. Inspect stdout for `[interaction-capture]` log messages confirming the module ran. 3. If no variant carries interaction-state fields on a default run, confirm capture was not disabled by a stray `--no-interaction` / `--fast-no-interaction` flag, and that `cluster.ts` matched captures to components (the lookup keys on `tag|classes`). 4. If the target site has no interactive elements, the variant interaction fields may all be null; this is a PASS with a note. 5. If the site returns 403/429, skip with a blocker and route to ESCALATE-001. |

### Optional Supplemental Checks

If the operator wants to confirm the full pipeline writes interaction states, run the WRITE phase after extraction and inspect the resulting Style Reference's Components for populated hover/focus/active states grounded in the captured data. Run `validate.ts` against the Style Reference + tokens.json pair to confirm it passes (Components is one of the required v3 sections). To exercise the absence path, re-run extraction with `--fast-no-interaction` (or `--no-interaction`) so interaction capture is skipped, then confirm the Components omit interaction states rather than carrying fabricated interaction data.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../backend/scripts/interaction-capture.ts` | Interaction state capture engine -- element discovery, state simulation, style-diff computation, loading/empty/error state detection |
| `../../backend/scripts/extract.ts` | Extraction orchestrator -- interaction capture is default-on (`noInteraction = false`); `--no-interaction` / `--fast-no-interaction` opt out, `--with-interaction` is the redundant default; invokes captureInteractions() when not opted out |
| `../../backend/scripts/validate.ts` | Style Reference validator -- `checkSectionCompleteness` requires the named v3 sections including `## Components`, where interaction states are characterized |
| `../../references/design_md_format.md` | v3 Style Reference section specification -- §6 Components captures hover/focus states |
| `../../feature_catalog/07--interaction-capture/interaction-capture.md` | Feature catalog entry for interaction-capture.ts |
| `../../SKILL.md` | SS2 SMART ROUTING -- the --with-interaction flag documentation; SS3 HOW IT WORKS -- the three-phase pipeline |

---

## 5. SOURCE METADATA

- Group: Interaction
- Playbook ID: INTERACT-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `08--interaction/interaction-state-matrix.md`
