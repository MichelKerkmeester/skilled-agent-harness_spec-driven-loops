---
title: "md-generator: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-scenario validation for the md-generator skill. Covers live extraction, v3 Style Reference fidelity validation, the cardinal verbatim-value rule, Quick-Start fidelity, dark-mode gating, tool setup, anti-bot escalation, the authoring boundary between measured and non-measured values plus the source-of-truth router card."
version: 1.0.0.11
---

# md-generator: Manual Testing Playbook

End-to-end manual testing reference for the md-generator skill. Every scenario validates a capability of the skill against its defined behavior. The default set exercises the full three-phase pipeline (extract, write, validate) end to end against a real live URL, plus a negative-control escalation scenario that proves the skill refuses to fabricate tokens. The WRITE phase produces a **v3 Style Reference** — a named, role-driven, ship-ready design-system handoff (named colour tokens, a copy-paste Quick Start with CSS + Tailwind, Similar Brands, etc.) — whose deterministic value sections are pre-rendered by `backend/scripts/build-write-prompt.ts` (via `backend/scripts/formatters-v3.ts`) so the writer adds prose only. The embedded tool drives a Playwright Chromium crawler, an OKLCH token cluster, and a fidelity validator that recognizes the v3 schema. Skill version 1.0.0.

> **Cardinal rule (locked decision, read first).** Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in the v3 Style Reference MUST be copied verbatim from `tokens.json`. No estimation, no rounding, no invention. Hex codes must use 6-digit lowercase format. Because the deterministic emitters copy each value verbatim, a measured `max-width: 100%` stays `100%` and is never invented as `100rem`. L1 (permanent) and L2 (system) tokens populate the named token tables; L3 (campaign) tokens appear under a "Subject to change" sub-table; L4 (content) tokens are excluded entirely. The Quick Start is the ship-ready surface: every hex and `--page-max-width` in it must trace back to tokens. Dark-mode values appear ONLY when the extractor detected a dark palette and are never derived from the light tokens. Every scenario below treats this rule as the non-negotiable contract.

---

**EXECUTION POLICY:** Every default scenario in this playbook is SAFE to execute for real: it extracts from a live URL, validates the output, and inspects file content. None of the default scenarios fabricate tokens, overwrite production files, or mutate anything outside the `--output` spec folder passed to extraction. Run actual commands, inspect real outputs, and call the real embedded tool. Valid statuses are PASS, FAIL, or SKIP with a documented blocker. The escalation scenario exercises the anti-bot refusal gate as a negative control: it proves the skill escalates rather than fabricates. Fabricating tokens in any scenario is a HARD FAIL.

---

## 1. OVERVIEW

### Coverage

| Category | Scenarios | IDs |
|---|---|---|
| Extract | 1 | EXTRACT-001 |
| Validate | 1 | VALIDATE-001 |
| Fidelity | 1 | FIDELITY-001 |
| Dark Mode | 1 | DARKMODE-001 |
| Setup | 1 | SETUP-001 |
| Escalation | 1 | ESCALATE-001 |
| Report | 1 | REPORT-001 |
| Interaction | 1 | INTERACT-001 |
| Cluster | 1 | CLUSTER-001 |
| Accessibility | 1 | A11Y-001 |
| Detectors | 1 | DETECT-001 |
| Authoring Boundary | 1 | BOUNDARY-001 |
| Source-of-Truth | 1 | PROVENANCE-001 |
| **TOTAL** | **13** | **13 scenarios** |

This playbook defines 13 deterministic scenarios across 13 categories validating the full surface of the `md-generator` skill. Each scenario keeps its own ID, is summarized inline in Sections 7-19, and links to a dedicated per-scenario file with the full execution contract, with the cross-reference index in Section 21.

> **Per-scenario files:** The root playbook is the directory, review surface, and orchestration guide, while per-scenario execution detail lives in one file per scenario inside numbered category folders at the playbook root. The cross-reference index in Section 21 lists every scenario file.

### Realistic Test Model

1. A realistic user request is given to an orchestrator, for example "extract the design system from example.com."
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI or runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

A scenario PASSES only when both the execution process (correct phase, correct gating, no fabricated values, no unvalidated output) and the user-visible outcome (valid tokens.json, conformant DESIGN.md, clear escalation) are verified.

### What Each Scenario Explains

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including which pipeline phase runs
- The desired user-visible outcome
- The skill rule or reference that justifies the scenario

---

## 2. GLOBAL PRECONDITIONS

All scenarios share these preconditions. Verify before starting any wave.

1. Working directory is the **repo root** (`pwd` shows the repository root). The embedded tool lives at `.opencode/skills/sk-design/design-md-generator/backend/`; run the pipeline scripts (`extract.ts`, `validate.ts`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`) from the repo root with the full script path, so a relative `--output` resolves outside the skill (the output guard refuses skill-internal paths). Run the one-time setup (`npm install`, `npx playwright install chromium`) and the `vitest` suite from the `backend/` directory.
2. Node.js `20 or newer` is on PATH (`node --version`). macOS is the supported baseline; Linux and Windows are experimental and unverified for these scenarios.
3. The embedded tool dependencies are installed: `cd backend && npm install` produces no errors. The Playwright Chromium binary is installed: `cd backend && npx playwright install chromium` completes successfully.
4. For EXTRACT-001, a live, publicly reachable URL that renders JavaScript is required. `https://example.com` is the reference URL for initial smoke tests, but operators may substitute any crawlable site. The scenario ID stays the same.
5. For VALIDATE-001 and FIDELITY-001, a prior extraction must have produced a valid `tokens.json` and a conformant `DESIGN.md`. These scenarios can use the output from EXTRACT-001 or any existing extraction output.
6. For ESCALATE-001, a site that blocks automated crawlers (403/429/bot-wall) is required to exercise the negative control. Operators may use a known anti-bot site or a local mock that returns 403.
7. Extraction output lands in the directory passed to `--output` (required; a spec folder outside the skill, e.g. `.opencode/specs/<track>/<packet>/output`). There is no default output path, and `extract.ts` refuses any `--output` that resolves inside the skill. Do not run extractions that would overwrite a production `DESIGN.md`.

> **Do-not-run note for this playbook author and executors:** Examples in this document that show command output are illustrative, so verify exact flags and output with `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts --help` and `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts --help` (from the repo root) on the live machine. Never fabricate tokens in any scenario; a fabricated token is a HARD FAIL.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript with exit codes
- User request used
- Orchestrator or agent-facing prompt used
- Phase detection and routing notes (EXTRACT_WRITE, VALIDATE, etc.)
- The live `tokens.json` output (path, file size, valid JSON confirmed)
- The live Style Reference `DESIGN.md` output (path, named-section count, hex count, Quick Start present)
- The live `validate.ts` output (pass/fail, phantom hex findings, Quick-Start fidelity findings, section completeness, and the dual values/claims score line)
- For SETUP-001: `npm install` output and `npx playwright install chromium` exit code
- For ESCALATE-001: the crawl error message and the escalation text
- Final user-facing response or outcome summary
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

| Type | Notation | Example |
|---|---|---|
| Extract (Phase 1) | `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts <url> [flags]` | `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` |
| Validate (Phase 3) | `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts <DESIGN.md> <tokens.json>` | `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts DESIGN.md <--output>/tokens.json` |
| Setup | `cd backend && npm install` / `npx playwright install chromium` | `cd backend && npm install && npx playwright install chromium` |
| Vitest suite | `cd backend && npx vitest run` | `cd backend && npx vitest run` |
| Bash | `bash: <command>` | `bash: node --version` |
| File inspection | `read: <path>` | `read: <--output>/tokens.json` |
| Agent prompt | `agent: <instruction>` | `agent: detect the pipeline phase from the user request` |
| Sequential | `->` separator | `extract.ts https://example.com --fast -> validate.ts DESIGN.md <--output>/tokens.json --output .opencode/specs/<track>/<packet>/output` |
| Expected output | `# -> expected` | `npx ts-node scripts/validate.ts ... # -> PASS, score 100` |

All command examples are illustrative, and the executor verifies exact flags and output against the live `--help` text before grading.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-scenario files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (one capture per executed scenario)
4. Scenario-to-rule coverage map (each scenario maps to a SKILL.md rule or reference)
5. Triage notes for all non-pass outcomes

### Scenario Acceptance

A scenario is PASS when all preconditions were verified, every command in the sequence ran (or the negative control produced the expected refusal), all expected signals were observed, the user-visible outcome matches the defined outcome, and no contradictory evidence exists.

A scenario is FAIL when any of the above conditions is not met, when a hex value was fabricated or estimated, when an L4 token appeared in the Style Reference, when a Quick Start hex or `--page-max-width` did not trace to tokens, when dark-mode values appeared without a detected dark palette, or when `validate.ts` failures were ignored.

A scenario is SKIP only with a documented blocker (for example, no crawlable URL is available, so EXTRACT-001 and its dependents cannot run; record the blocker and skip the dependents).

### Critical-Path Scenarios (BLOCK RELEASE if FAIL)

| ID | Scenario | Why Critical |
|---|---|---|
| EXTRACT-001 | Live extraction produces valid tokens.json | Nothing else is testable until the extractor runs successfully; tokens.json is the ground truth for every downstream phase |
| FIDELITY-001 | Cardinal verbatim-value rule enforced | The skill's entire value proposition is hallucination-proof fidelity; a fabricated or estimated value breaks the contract |
| VALIDATE-001 | Validator detects phantom hexes and Quick-Start fabrication | An unvalidated Style Reference is a draft; the validator is the only automated gate against fabricated values, and `checkQuickStartFidelity` is the precise catch for the ship-ready Quick Start (phantom hex, mismatched `--page-max-width`) |

### Release Readiness Rule

Release is READY only when no scenario verdict is FAIL, all critical-path scenarios are PASS (or SKIP with a documented environment blocker that the operator accepts), coverage matches the cross-reference index, no tokens were fabricated in any scenario, and no unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put scenario-specific acceptance caveats in the matching per-scenario file (see Section 21).

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Execution Waves

| Wave | Scenarios | Parallelizable | Constraint |
|---|---|---|---|
| Wave 1 (Setup) | SETUP-001 | No (install is sequential) | Must complete before any extraction or validation |
| Wave 2 (Extract) | EXTRACT-001 | No (single crawl) | Requires Wave 1 PASS and a live crawlable URL |
| Wave 3 (Fidelity) | FIDELITY-001, DARKMODE-001 | Yes (read-only inspection) | Requires Wave 2 tokens.json and a written DESIGN.md |
| Wave 4 (Validate) | VALIDATE-001 | No (requires DESIGN.md + tokens.json) | Requires Wave 2 tokens.json and a written DESIGN.md |
| Wave 5 (Escalation) | ESCALATE-001 | Yes (independent) | Independent of Waves 2-4; requires a site that blocks crawlers |

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Never fabricate tokens in any scenario — a fabricated value is a HARD FAIL.
4. Run ESCALATE-001 as a negative control only: the skill must escalate clearly and produce zero fabricated tokens.
5. After each wave, save context and evidence, then begin the next wave.
6. Record the utilization table, scenario IDs, and evidence paths in the final report.

### What Belongs In Per-Scenario Files

- Real user request
- Prompt field following the Role then Context then Action then Format contract when the actor is an AI orchestrator
- Expected delegation or pipeline-phase routing
- Desired user-visible outcome
- Scenario-specific acceptance caveats or isolation constraints

---

## 7. EXTRACT (`EXTRACT-001`)

### EXTRACT-001 | Live Extraction Produces Valid tokens.json

#### Description
Verify that a real user request to "extract the design system from example.com" triggers the EXTRACT_WRITE pipeline phase, runs `extract.ts --fast` against the live URL, and produces a valid, non-empty `tokens.json` at `<--output>/tokens.json` with populated token arrays, plus screenshots and an extraction report.

#### Scenario Contract
Prompt: `"Extract the design system from example.com."`

- Objective: confirm the full extraction phase runs against a live URL and emits valid tokens.json
- Expected execution process: detect the EXTRACT_WRITE phase from the request, verify tool readiness, run `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output`, confirm `<--output>/tokens.json` exists, is valid JSON, and contains non-empty `colorTokens`, `typographyLevels`, `shadowTokens`, `radiusTokens`, and `spacingScale` arrays
- Expected signals: `extract.ts` exits 0; `<--output>/tokens.json` is a valid JSON file > 1 KB with populated token arrays; screenshots land in `<--output>/`; an extraction report is written
- Desired user-visible outcome: the agent reports the extraction completed, the output path, and a summary of captured token counts

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EXTRACT-001 | Live extraction | Verify `extract.ts --fast` against a live URL produces valid tokens.json | `Extract the design system from example.com.` | 1. agent detects EXTRACT_WRITE phase -> 2. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 3. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast` -> 4. `bash: ls -la <--output>/tokens.json` -> 5. agent reports token counts | Step 1: phase detected as EXTRACT_WRITE. Step 2: Node 20+, tool dependencies present. Step 3: extract exits 0, crawl output on stdout. Step 4: tokens.json exists, >1 KB, valid JSON. Step 5: agent reports counts from colorTokens, typographyLevels, etc. | Transcript of `extract.ts --fast`, `ls -la` of output, token count summary | PASS if `extract.ts --output .opencode/specs/<track>/<packet>/output` exits 0 AND `tokens.json` is valid JSON with non-empty token arrays AND agent reports the output correctly. FAIL if extraction exits non-zero OR tokens.json is empty/missing OR agent fabricates token counts | 1. Confirm `--fast` was used (5 pages, 8 concurrency). 2. Confirm `<--output>/tokens.json` exists and parses as JSON. 3. Confirm token arrays are non-empty. 4. If the site returns 403/429, skip with a blocker (site blocks crawlers) and route to ESCALATE-001. |

> **Feature File:** [01--extract/001-live-extraction.md](01--extract/001-live-extraction.md)

---

## 8. VALIDATE (`VALIDATE-001`)

### VALIDATE-001 | Validator Passes On Faithful DESIGN.md And Flags Phantom Hexes

#### Description
Verify that `validate.ts` recognizes the v3 Style Reference schema, PASSES on a faithfully-written Style Reference (all hexes trace to tokens.json), and FAILS on one that contains a phantom hex — a hex value not present in tokens.json. The v3 `checkQuickStartFidelity` check is the precise backstop for the value-fabrication class: every Quick Start hex must trace to tokens (a phantom Quick Start hex is a `quickstart-phantom-color` critical failure), and a Quick Start `--page-max-width` that disagrees with `tokens.spacingSystem.maxContentWidth` (the "100rem where tokens say 100%" case) is flagged as a `quickstart-maxwidth` warning. `isPass()` now also requires `claimsScore >= 80`, so a document cannot pass on hex-fidelity alone while its prose carries unverified fabrication claims. This is both a positive and negative control: the validator must not report false positives and must catch real fabrications.

#### Scenario Contract
Prompt: `"Validate the Style Reference I just wrote against its tokens.json."`

- Objective: confirm the validator recognizes the v3 schema and correctly distinguishes faithful from fabricated output, including Quick-Start fidelity
- Expected execution process: run `validate.ts` against a known-good v3 Style Reference + tokens.json pair; confirm PASS with values score 100, claims score >= 80, and zero phantom-hex failures. Then plant a single hex (`#ff0000`) in a copy that does not exist in tokens.json, re-run validation, and confirm a phantom-color failure. Then plant a Quick Start hex not in tokens and confirm a critical `quickstart-phantom-color` failure, and plant a `--page-max-width: 100rem` where tokens say `100%` and confirm a `quickstart-maxwidth` warning
- Expected signals: first run exits 0 with `passed: [...]`, `failures: []`, values 100, claims >= 80; planted-hex run exits non-zero with a phantom-color finding for `#ff0000`; planted Quick-Start-hex run reports a `quickstart-phantom-color` critical failure; planted max-width run reports a `quickstart-maxwidth` warning
- Desired user-visible outcome: the agent reports the faithful Style Reference passed validation and each planted fabrication (phantom hex, Quick Start phantom hex, mismatched `--page-max-width`) was correctly flagged

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VALIDATE-001 | Fidelity validation | Verify `validate.ts` recognizes the v3 schema, passes on a faithful Style Reference, and flags a planted phantom hex, a Quick Start phantom hex, and a mismatched `--page-max-width` | `Validate the Style Reference I just wrote against its tokens.json.` | 1. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts <faithful-style-reference.md> <--output>/tokens.json` -> 2. copy it, append `#ff0000` in a prose line -> 3. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts <planted.md> <--output>/tokens.json` -> 4. plant a Quick Start hex not in tokens and a `--page-max-width: 100rem` where tokens say `100%`, re-run | Step 1: exit 0, values 100, claims >= 80, zero `phantom-color` failures. Step 2: phantom hex planted. Step 3: exit non-zero (failures array non-empty), at least one `phantom-color` finding for `#ff0000`. Step 4: `quickstart-phantom-color` critical failure for the planted Quick Start hex AND a `quickstart-maxwidth` warning for the mismatched `--page-max-width` | Transcript of the validation runs, the planted snippets, and the phantom-color / quickstart-phantom-color / quickstart-maxwidth findings | PASS if the faithful run passes with no phantom-hex failures and claims score >= 80 AND the planted runs flag `#ff0000`, the Quick Start phantom hex (critical), and the `--page-max-width` mismatch (warning). FAIL if the faithful run reports false positives OR any planted fabrication is not flagged | 1. Confirm the faithful Style Reference contains only hexes from tokens.json. 2. Confirm the planted hexes are not in tokens.json (check manually). 3. Confirm `checkPhantomColors` and `checkQuickStartFidelity` produced the expected findings, and that `--page-max-width` is compared against `tokens.spacingSystem.maxContentWidth`. |

> **Feature File:** [02--validate/002-phantom-hex-detection.md](02--validate/002-phantom-hex-detection.md)

---

## 9. FIDELITY (`FIDELITY-001`)

### FIDELITY-001 | Cardinal Verbatim-Value Rule Enforced

#### Description
Verify that a v3 Style Reference written by the skill copies every hex, pixel, font weight, shadow, and radius verbatim from tokens.json, with no estimation, rounding, or invention. The deterministic emitters (`formatters-v3.ts`, pre-rendered by `build-write-prompt.ts`) emit every value verbatim, so a measured `max-width: 100%` stays `100%` and is never invented as `100rem`. Confirm 6-digit lowercase hex throughout, L4 tokens are absent, and L3 (campaign) tokens appear under the "Subject to change" sub-table.

#### Scenario Contract
Prompt: `"Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding."`

- Objective: confirm every numeric value in the Style Reference matches tokens.json verbatim and format rules are satisfied
- Expected execution process: after a successful extraction, read both `tokens.json` and the written Style Reference; spot-check at least 5 hex values, 3 pixel values, 2 font weights, and 2 shadow definitions across the pair and confirm exact match; specifically confirm the layout max-width is carried verbatim (e.g. `100%` stays `100%`, never `100rem`); verify all hex codes are 6-digit lowercase; verify no L4 token (e.g., image-derived colors) appears; verify L3 tokens (campaign colors) appear under the "Subject to change" sub-table
- Expected signals: every sampled value matches exactly; the layout max-width is verbatim; all hex codes use 6-digit lowercase; L4 tokens absent; L3 tokens under the "Subject to change" sub-table
- Desired user-visible outcome: the agent confirms fidelity with specific token-to-Style-Reference pairings, listing the sampled values and their matches

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FIDELITY-001 | Verbatim-value fidelity | Verify the v3 Style Reference copies values verbatim from tokens.json, no estimation, 6-digit lowercase hex, L4 excluded, L3 under the "Subject to change" sub-table, and the layout max-width carried verbatim (`100%` not `100rem`) | `Check that the Style Reference you wrote copies every value exactly from tokens.json — no estimates, no rounding.` | 1. `read: <--output>/tokens.json` (extract 5 hex values, 3 px values, 2 font weights, 2 shadows, and `spacingSystem.maxContentWidth`) -> 2. `read: <style-reference.md>` (find the same values) -> 3. confirm exact match for each pair, including the layout max-width -> 4. grep for hex patterns, confirm all are 6-digit lowercase -> 5. `bash: rg -c 'L4' <style-reference.md>` confirm zero or only in explanatory text, no L4 token values -> 6. `bash: rg 'Subject to change' <style-reference.md>` confirm present for L3 tokens if any exist | Step 1: token values extracted from JSON. Step 2: same values found verbatim in the Style Reference. Step 3: all sampled values match, including max-width. Step 4: all hex codes 6-digit lowercase. Step 5: no L4 token values. Step 6: L3 tokens under the "Subject to change" sub-table if present | Transcript of the value-matching spot-checks, hex-format grep output, L4/L3 grep output | PASS if every sampled value matches tokens.json verbatim (including the layout max-width) AND all hex codes are 6-digit lowercase AND no L4 token values appear AND any L3 token is under the "Subject to change" sub-table. FAIL if any value is estimated/rounded (e.g. `100%` rendered as `100rem`) OR a hex uses 3-digit/uppercase format OR an L4 token value appears OR an un-grouped L3 token appears | 1. Pick values from different sections (color, typography, spacing, shadows, layout). 2. If a mismatch is found, check whether tokens.json was edited after extraction. 3. If L4 values appear, check the cluster.ts L4 classification logic. 4. If no L3 tokens exist in the source, the sub-table check does not apply (note it). 5. If max-width is mis-rendered, confirm the deterministic `formatters-v3.ts` emitter is wired through `build-write-prompt.ts`. |

> **Feature File:** [03--fidelity/003-verbatim-value-fidelity.md](03--fidelity/003-verbatim-value-fidelity.md)

---

## 10. DARK MODE (`DARKMODE-001`)

### DARKMODE-001 | Dark-Mode Section Appears Only When Detected

#### Description
Verify the dark-mode gate: dark-mode values in the v3 Style Reference appear ONLY when `tokens.json` contains a detected dark-mode palette (non-empty `darkMode` object), and are omitted when no dark palette was detected. The skill must never derive or fabricate a dark palette from the light tokens. (The v3 schema has no numbered §2.5 section; dark-mode values, when present, appear as named dark tokens / surfaces in the relevant token tables.)

#### Scenario Contract
Prompt: `"Does the Style Reference carry dark-mode values? Show me the condition."`

- Objective: confirm dark-mode values are conditional on extraction evidence and never fabricated
- Expected execution process: inspect `tokens.json` for the `darkMode` object; if `darkMode` is present and non-empty (has `variableDiff` or `darkTokens`), confirm the Style Reference carries those dark values verbatim. If `darkMode` is absent or empty, confirm the Style Reference contains no dark-mode values. If the extractor was run with `--no-dark-mode`, confirm no dark-mode values appear regardless of whether the site has a dark palette
- Expected signals: dark-mode values appear in the Style Reference iff tokens.json.darkMode is present and non-empty; no dark-mode values appear from fabrication or derivation
- Desired user-visible outcome: the agent states the condition, points to the evidence in tokens.json, and confirms the gate was followed

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DARKMODE-001 | Dark-mode gate | Verify the Style Reference carries dark-mode values only when tokens.json has a detected dark palette and never fabricates them | `Does the Style Reference carry dark-mode values? Show me the condition.` | 1. `read: <--output>/tokens.json` (inspect `darkMode` field) -> 2. `read: <style-reference.md>` (search for dark tokens / dark surfaces) -> 3. correlate — if darkMode present and non-empty, dark values must appear verbatim; if absent/empty, no dark values must appear -> 4. agent reports the gate condition and the evidence | Step 1: darkMode present (with variableDiff/darkTokens) or absent/empty. Step 2: dark values present or absent. Step 3: presence/absence aligns exactly. Step 4: agent names the evidence, does not fabricate a dark palette | tokens.json darkMode snippet and the corresponding dark values in the Style Reference (or their absence) | PASS if dark values appear iff tokens.json.darkMode is non-empty AND no dark values were fabricated from light tokens. FAIL if dark values appear without a detected dark palette OR are missing when darkMode is non-empty OR are derived/invented | 1. Check `dark-mode-detect.ts` detection method in tokens.json (`media-query`, `class-toggle`, etc.). 2. If the site has a dark mode but it was not detected (JS class toggle), note it as a known gap (troubleshooting.md §3) and SKIP the scenario or mark it PASS with a documented gap. 3. Confirm `--no-dark-mode` was NOT used (unless testing that branch explicitly). |

> **Feature File:** [04--dark-mode/004-dark-mode-gate.md](04--dark-mode/004-dark-mode-gate.md)

---

## 11. SETUP (`SETUP-001`)

### SETUP-001 | Tool Readiness From A Fresh Checkout

#### Description
Verify that a fresh checkout of the tool directory requires `npm install` and `npx playwright install chromium` before any extraction or validation can run, and that a missing Chromium binary is reported clearly as a setup requirement, not as a crash or cryptic error.

#### Scenario Contract
Prompt: `"Set up the design extractor tool so I can extract a design system from a URL."`

- Objective: confirm the tool setup path works end to end and errors before setup are clear and actionable
- Expected execution process: confirm Node 20+; run `cd backend && npm install` and verify zero errors; run `cd backend && npx playwright install chromium` and verify it completes; smoke-test with `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts --help` to confirm the CLI parses; attempt `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` and confirm it runs (or fails with a clear crawl error, not a missing-binary crash)
- Expected signals: `npm install` exits 0; `npx playwright install chromium` exits 0 (or reports "already installed"); `--help` prints usage; extraction either succeeds or fails with a crawl-specific error, never `Executable doesn't exist` or `command not found: ts-node`
- Desired user-visible outcome: the agent confirms the tool is ready and the operator can proceed to EXTRACT-001

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SETUP-001 | Tool readiness | Verify `npm install` + `npx playwright install chromium` prepare the tool, and missing Chromium is reported clearly | `Set up the design extractor tool so I can extract a design system from a URL.` | 1. `bash: node --version` -> 2. `cd backend && npm install` -> 3. `cd backend && npx playwright install chromium` -> 4. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts --help` -> 5. smoke: `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast --output .opencode/specs/<track>/<packet>/output` | Step 1: Node 20+. Step 2: npm install exits 0, no errors. Step 3: Playwright Chromium installed or confirmed. Step 4: --help prints usage. Step 5: extract runs (success or clear crawl error, never `Executable doesn't exist`) | Transcript of install steps, `--help` output, and smoke-test outcome | PASS if all setup steps complete without errors AND the smoke test either succeeds or fails with a crawl-specific error (not a missing-binary crash). FAIL if `npm install` or `playwright install` fails fatally OR the smoke test crashes with `Executable doesn't exist` OR `ts-node` is not found after install | 1. If `npm install` fails, check `backend/package.json` for version requirements. 2. If Chromium install fails (disk space, network), note as an environment blocker. 3. If the smoke test crashes with a missing binary, confirm `npx playwright install chromium` completed. 4. If `ts-node` is not found, confirm `npm install` ran in the `backend/` directory. |

> **Feature File:** [05--setup/005-tool-readiness.md](05--setup/005-tool-readiness.md)

---

## 12. ESCALATION (`ESCALATE-001`)

### ESCALATE-001 | Anti-Bot Site Causes Clear Escalation, Never Fabricates Tokens

#### Description
Verify that when the extractor encounters a site that blocks automated crawlers (403, 429, bot-wall, or empty pages), the skill escalates clearly — reporting the specific error, the URL, and whether the site requires authentication or blocks crawlers — and NEVER fabricates tokens. This is a NEGATIVE CONTROL: the crawl failure is the expected outcome, and the skill must refuse to produce a `tokens.json`.

#### Scenario Contract
Prompt: `"Extract the design system from this site: https://www.cloudflare.com"` (or any known anti-bot site; operators may substitute a site they know blocks crawlers or a local mock that returns 403).

- Objective: confirm the skill escalates on a blocked crawl and produces zero fabricated tokens
- Expected execution process: run extraction against a site known to block crawlers; observe the crawl errors (403, 429, or empty-page errors); confirm `tokens.json` is either not written, written empty, or contains zero crawlable pages; the agent must escalate with the error, the URL, and a statement that the site is not crawlable — it must never invent, estimate, or fabricate token values
- Expected signals: extraction exits non-zero or reports zero pages crawled; no `tokens.json` is written, or the written file has empty token arrays; the agent escalation message names the error, the URL, and the anti-bot conclusion; zero fabricated values appear anywhere
- Desired user-visible outcome: the agent clearly states the site could not be crawled and escalates without fabricating a single token

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ESCALATE-001 | Anti-bot escalation | Verify a blocked crawl causes a clear escalation and zero tokens are fabricated | `Extract the design system from this site: https://www.cloudflare.com` | 1. NEGATIVE CONTROL: `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://www.cloudflare.com --fast --output .opencode/specs/<track>/<packet>/output` -> 2. observe crawl output (errors, page count) -> 3. inspect `<--output>/tokens.json` (if written) -> 4. agent escalates with error + URL + anti-bot conclusion | Step 1: extraction exits non-zero or reports zero pages crawled. Step 2: error messages reference 403/429/empty pages. Step 3: tokens.json is absent, empty, or has zero-page token arrays. Step 4: agent escalation is clear, names the URL and the error, and fabricates nothing | Transcript of the failed extraction, the tokens.json inspection (or confirmation it was not written), and the agent's escalation message | PASS if the extraction failed clearly AND no tokens were fabricated AND the agent escalated with the specific error and URL. FAIL if the skill fabricated any token value OR produced a partial tokens.json from invented data OR silently reported success | 1. Confirm `--fast` was used (the scenario does not require a deep crawl to fail). 2. Confirm no hex, pixel, font-weight, or shadow value appeared that was not measured from a real page load. 3. If the chosen anti-bot site actually rendered crawlable pages (unlikely), pick a different known-blocker and re-run. 4. Confirm the escalation follows SKILL.md §4 ESCALATE IF rule 1 verbatim. |

> **Feature File:** [06--escalation/006-anti-bot-escalation.md](06--escalation/006-anti-bot-escalation.md)

---

## 13. REPORT (`REPORT-001`)

### REPORT-001 | Report And Preview Generation

#### Description
Confirm all three report-generation scripts run successfully against a tokens.json + DESIGN.md pair and produce valid artifacts.

#### Scenario Contract
Prompt: `Generate a visual report of the extracted design system.`

- Objective: confirm all three report-generation scripts run successfully against a tokens.json + DESIGN.md pair and produce valid artifacts

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| REPORT-001 | Report and preview generation | Verify all three report-generation scripts run and emit valid HTML/visual artifacts | `Generate a visual report of the extracted design system.` | 1. agent detects REPORT phase -> 2. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 3. confirm `tokens.json` and `DESIGN.md` exist -> 4. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts <--output>/tokens.json <--output>/ <--output>/DESIGN.md` -> 5. `ls -la <--output>/report.html` -> 6. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts <--output>/tokens.json <--output>/` -> 7. `ls -la <--output>/preview.html` -> 8. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts https://example.com <--output>/tokens.json <--output>/` -> 9. `ls -la <--output>/proof.html <--output>/proof-data.json` -> 10. agent reports artifact paths and summary | Step 3: tokens.json and DESIGN.md found. Step 4: report-gen exits 0, writes report.html with HTML content > 1 KB. Step 6: preview-gen exits 0, writes preview.html with HTML content > 1 KB. Step 8: proof exits 0, writes proof.html and proof-data.json. Step 10: agent reports counts, score, and fidelity coverage from the artifacts. | Transcript of each script run, `ls -la` of output directory, artifact file size checks, proof-data.json parse validation | PASS if all three scripts exit 0 AND each writes a non-empty artifact file. FAIL if any script exits non-zero OR writes an empty/missing artifact OR agent reports fabricated metrics | 1. Confirm `tokens.json` is valid JSON with non-empty token arrays. 2. Confirm `DESIGN.md` exists and is readable. 3. Check script stderr for parse errors or missing dependency messages. 4. Run `npx ts-node scripts/proof.ts` last since it depends on `preview.html` generated by preview-gen. 5. If the source URL is unreachable (403/429), skip proof.ts with a blocker note and route to ESCALATE-001. |

> **Feature File:** [07--report/007-report-generation.md](07--report/007-report-generation.md)

---

## 14. INTERACTION (`INTERACT-001`)

### INTERACT-001 | Interaction Capture And State Matrix

#### Description
Confirm interaction state capture runs by default and the resulting tokens.json carries interaction data the writer turns into the hover/focus/active states described in the v3 Style Reference's Components section. Interaction capture is default-on (`noInteraction = false`); `--fast` reduces crawl depth but still captures interaction. The opt-out path is `--fast-no-interaction` (fast crawl that also skips interaction) or `--no-interaction`, in which case the captured states are simply absent from Components rather than fabricated. (The v3 schema has no numbered §11 State Matrix; interaction states are characterized inside the named Components.)

#### Scenario Contract
Prompt: `Extract the design system including interaction states from example.com.`

- Objective: confirm a default extraction run captures interaction state and the resulting tokens.json carries interaction data the writer turns into the Components hover/focus/active states, and that an opt-out run (`--fast-no-interaction`) leaves those states absent instead of fabricating them

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| INTERACT-001 | Interaction capture and state matrix | Verify a default run captures hover/focus/active/disabled states folded into `tokens.json` component variants the writer turns into Components hover/focus/active states, and `--fast-no-interaction` leaves those variant fields null | `Extract the design system including interaction states from example.com.` | 1. agent detects EXTRACT_WRITE phase with interaction intent -> 2. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 3. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts https://example.com --fast` (capture is default-on) -> 4. `ls -la <--output>/tokens.json` -> 5. inspect `tokens.json` `components[].variants[]` for folded interaction-state fields -> 6. agent reports token counts and interaction capture summary | Step 1: phase detected as EXTRACT_WRITE with interaction intent. Step 2: Node 20+, tool dependencies present. Step 3: extract exits 0, interaction capture messages on stdout. Step 4: tokens.json exists, > 1 KB, valid JSON. Step 5: at least one `components[].variants[]` entry has a non-null `hoverChanges` / `focusChanges` / `focusVisibleChanges` / `activeChanges` / `disabledStyle`. Step 6: agent reports captured variant count and diff summary. | Transcript of `extract.ts --fast --output .opencode/specs/<track>/<packet>/output`, `ls -la` of output, component-variant interaction-field inspection output | PASS if extract exits 0 AND at least one component variant carries a non-null interaction-state field AND agent reports the interaction capture summary correctly. FAIL if extraction exits non-zero OR no component variant carries any interaction-state field on a default run OR agent fabricates interaction capture counts | 1. Confirm interaction capture is default-on (`noInteraction = false`); `--fast` reduces crawl depth but still captures interaction. Use `--fast-no-interaction` or `--no-interaction` only to opt out (the negative/absence path). 2. Inspect stdout for `[interaction-capture]` log messages confirming the module ran. 3. If no variant carries interaction-state fields on a default run, confirm capture was not disabled by a stray `--no-interaction` / `--fast-no-interaction` flag, and that `cluster.ts` matched captures to components (the lookup keys on `tag|classes`). 4. If the target site has no interactive elements, the variant interaction fields may all be null; this is a PASS with a note. 5. If the site returns 403/429, skip with a blocker and route to ESCALATE-001. |

> **Feature File:** [08--interaction/008-interaction-state-matrix.md](08--interaction/008-interaction-state-matrix.md)

---

## 15. CLUSTER (`CLUSTER-001`)

### CLUSTER-001 | OKLCH Clustering And Stability Classification

#### Description
Confirm clustering and stability classification produce correct L1-L4 assignments and sane role groupings in tokens.json.

#### Scenario Contract
Prompt: `Confirm the color tokens are clustered and stability-classified correctly.`

- Objective: confirm clustering and stability classification produce correct L1-L4 assignments and sane role groupings in tokens.json

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLUSTER-001 | OKLCH clustering and stability classification | Verify cluster.ts groups colors in OKLCH space and assigns L1-L4 stability classes | `Confirm the color tokens are clustered and stability-classified correctly.` | 1. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 2. `cd backend && npx vitest run cluster` -> 3. `ls <--output>/tokens.json` -> 4. `node -e "...` inspect stability.layers -> 5. agent reports cluster pass + stability distribution | Step 1: Node 20+, tool dependencies present. Step 2: vitest exits 0, all cluster tests pass (parseColor, rgbaToHex, wcagContrast, deltaE, splitShadowLayers, classifyShadow, mergeTokenSets). Step 3: tokens.json exists. Step 4: every colorToken has stability.layer (infrastructure/system/campaign/content) with confidence and signals. Step 5: agent reports L1-L4 counts. | Transcript of `vitest run cluster`, node inspect output of tokens.json stability, stability layer distribution | PASS if cluster.test.ts passes AND tokens.json colorTokens[].stability.layer values are all valid AND no token is missing stability. FAIL if vitest fails OR stability is missing on any token OR clustering is degenerate (single cluster for different colors) OR L1/L2 count is zero on a real site | 1. If vitest fails, check `backend/vitest.config.ts` includes `tests/**/*.test.ts`. 2. If stability is missing, confirm the extraction pipeline ran `classifyTokenStability()` after `clusterTokens()`. 3. If all tokens are L3 or L4, the site may be content-heavy with no design system; try a known design-system site (e.g., linear.app, vercel.com). 4. If only one cluster exists, check `deltaE` threshold (should be < 3) and confirm culori OKLCH conversion works. |

> **Feature File:** [09--cluster/009-oklch-clustering.md](09--cluster/009-oklch-clustering.md)

---

## 16. ACCESSIBILITY (`A11Y-001`)

### A11Y-001 | Accessibility Section Fidelity

#### Description
Confirm the v3 Style Reference mirrors a11y-extract.ts output faithfully, never inventing values. In the v3 schema, captured accessibility data surfaces in the Agent Prompt Guide (Quick Color Reference plus any flagged focus/contrast problems) rather than a numbered §9; absent a11y data is noted honestly rather than fabricated. The underlying capture mechanics (`a11y-extract.ts` populating `tokens.accessibility`) are unchanged.

#### Scenario Contract
Prompt: `Does the design system capture accessibility data?`

- Objective: confirm the v3 Style Reference mirrors a11y-extract.ts output faithfully, never inventing values

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| A11Y-001 | Accessibility section fidelity | Verify the v3 Style Reference's Agent Prompt Guide mirrors a11y-extract.ts output, never invents values, and honestly notes absence | `Does the design system capture accessibility data?` | 1. verify both tokens.json and the Style Reference exist -> 2. `node -e "...` inspect accessibility fields from tokens.json -> 3. agent reads the Agent Prompt Guide and any flagged a11y notes -> 4. agent compares field-by-field | Step 1: tokens.json and the Style Reference present. Step 2: node script prints a11y field counts (or NO_ACCESSIBILITY_OBJECT). Step 3: the Style Reference contains either populated a11y data or an explicit absence note. Step 4: every reported a11y value traces to a field in tokens.json | Node inspect output of tokens.json accessibility fields, Style Reference a11y text excerpt, field-by-field comparison table | PASS if the Style Reference faithfully mirrors tokens.json accessibility data (populated when present, honest absence note when absent) with zero invented values. FAIL if it contains a11y values not in tokens.json OR omits a11y data that tokens.json contains OR is missing entirely when a11y data exists | 1. If accessibility object is missing from tokens.json, confirm `extract.ts` calls `extractA11y()` during Phase 1 (contrast + focus + touch-target + ARIA stats from DOM collections). 2. If tabOrder/langAttribute/skipLinkDetected/altTextCoverage are missing, confirm `extract.ts` calls `extractA11yAsync(page)` which runs Playwright page-dependent checks. 3. If the a11y data is missing from the Style Reference, verify the WRITE phase loaded `SKILL.md` §4 ALWAYS rule 7 and the v3 format spec (`references/design_md_format.md`). 4. If the a11y prose fabricates data, rerun the write phase with explicit instruction "every a11y value must come from tokens.json verbatim." |

> **Feature File:** [10--accessibility/010-accessibility-section.md](10--accessibility/010-accessibility-section.md)

---

## 17. DETECTORS (`DETECT-001`)

### DETECT-001 | Framework, Icon, And Motion Detection

#### Description
Confirm all four detectors run during extraction and write populated or honestly-empty fields to tokens.json.

#### Scenario Contract
Prompt: `What framework, icons, and motion did the extractor detect?`

- Objective: confirm all four detectors run during extraction and write populated or honestly-empty fields to tokens.json

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DETECT-001 | Framework, icon, and motion detection | Verify all four detectors run during extraction and populate the output with honest data | `What framework, icons, and motion did the extractor detect?` | 1. agent detects EXTRACT_WRITE phase -> 2. verify tool readiness (`node --version`, check `backend/node_modules/`) -> 3. `npx ts-node .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts <url> --fast` -> 4. `node -e "...` inspect `tokens.json` (`meta.framework`, `iconSystem`, `motionSystem`) and `extraction-report.json` (`designBoundary`) -> 5. agent reports findings | Step 1: phase detected as EXTRACT_WRITE. Step 2: Node 20+, tool dependencies present. Step 3: extract exits 0, crawl output on stdout. Step 4: `meta.framework` present (tailwind/null, uiFramework/null, designSystemUrl/null); `iconSystem` present (null or with library, sizeScale, strokeWidth, colorMode, totalCount); `motionSystem` present (null or with durationScale, primaryTimingFunction, keyframeAnimations); `extraction-report.json` `designBoundary` present (with relationship, overallSimilarity, dimensionScores). Step 5: agent reports findings per detector. | Transcript of `extract.ts --fast`, node inspect output of detector fields, detector field presence/population summary | PASS if extraction exits 0 AND `tokens.json` carries `meta.framework`, `iconSystem`, `motionSystem` AND `extraction-report.json` carries `designBoundary`, with no fabricated data (null is acceptable). FAIL if any detector field is missing entirely OR a detector fabricates data (claims unobserved framework) OR extraction crashes with a detector stack trace | 1. If `meta.framework` is missing, confirm `extract.ts` awaits `detectFramework(page)` during Phase 1. Check `framework-detect.ts` for the detectors array (TAILWIND_PATTERN, UI_FRAMEWORK_CHECKS, DESIGN_SYSTEM_PATHS). 2. If `iconSystem` is missing, confirm `extract.ts` calls `detectIcons(domCollections)` after DOM collection. Check `icon-detect.ts` returns null when fewer than 3 SVGs are found. 3. If `motionSystem` is missing, confirm `extract.ts` calls `extractMotion(cssAnalysis, domCollections)`. Check `motion-extract.ts` returns null when no transitions/animations exist. 4. If `designBoundary` is missing from `extraction-report.json`, confirm it is written after the full crawl. Verify `detectBoundaries(pageGroups)` in `design-boundary-detect.ts`. 5. If a detector fabricates data, inspect the raw DOM/CSS output for that page to confirm what was actually present. |

> **Feature File:** [11--detectors/011-framework-icon-motion-detection.md](11--detectors/011-framework-icon-motion-detection.md)

---

## 18. AUTHORING BOUNDARY (`BOUNDARY-001`)

### BOUNDARY-001 | Authoring Boundary Sorts Values By Origin

#### Description
Verify that a written v3 Style Reference keeps the four value origins legible: measured values (present in `tokens.json`) sit unlabeled in the token tables, brief-provided values (supplied by the user, not the page) stay out of the tables as a stated intent in prose, inferred claims (characterizations of measured values) carry an `[INFERRED]` marker and cite a measured token, while absent values (never captured) are stamped no-data or omitted. The boundary documents the line that keeps the cardinal fidelity rule enforceable by inspection. It adds no capability and routes brief-only forward-authoring out of scope.

#### Scenario Contract
Prompt: `"The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site."`

- Objective: confirm a written Style Reference keeps the four origins legible and never lets a non-measured value pose as a measured one
- Expected execution process: read `tokens.json` and the Style Reference. Confirm every token-table value traces to a measured token. Confirm the brief-provided red and font are NOT placed in a token table and appear only as a stated intent in prose if at all. Confirm every inferred claim carries `[INFERRED]` and cites a measured token. Confirm any uncaptured value is stamped or omitted, never backfilled from the brief
- Expected signals: token tables hold only measured values, all unlabeled. The brief-provided red and font sit outside every token table. Inferred claims are marked `[INFERRED]` with a cited token. Absent sections are stamped or omitted. No brief value is concretized into a measurement
- Desired user-visible outcome: the agent records the brief values as a stated intent in prose, keeps them out of the token tables, sources every tabled value from `tokens.json`, and states plainly that brief-provided values are not measurements

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BOUNDARY-001 | Authoring boundary | Verify the Style Reference keeps measured, brief-provided, inferred and absent values legible, with only measured values in token tables and the brief-provided red/font kept out | `The brief says the brand red is #ff0000 and the body font is Inter. Put those in the design system you extracted from the live site.` | 1. `read: <--output>/tokens.json` (collect measured hexes and font families) -> 2. `read: <style-reference.md>` (locate the brief values) -> 3. confirm `#ff0000` and `Inter` are NOT in any token table -> 4. `bash: rg '\[INFERRED\]' <style-reference.md>` confirm inferred claims cite a measured token -> 5. confirm every token-table value traces to tokens.json -> 6. confirm any absent dimension is stamped or omitted | Step 1: measured set collected. Step 2: brief values located. Step 3: brief values absent from token tables. Step 4: inferred claims marked and cited. Step 5: every tabled value measured. Step 6: absent dimensions stamped or omitted | Transcript of the measured-set listing, the brief-value grep, the token-table trace, the [INFERRED] grep and the absent-section check | PASS if token tables contain only measured values AND the brief-provided red and font are kept out of the tables AND every inferred claim is marked `[INFERRED]` with a cited token AND absent values are stamped or omitted. FAIL if a brief-provided value sits in a token table as if measured OR an inferred claim is unmarked or uncited OR an absent value is backfilled from the brief | 1. If a brief value sits in a token table, move it to prose as a stated intent, because the table is reserved for measurements. 2. If a brief value was also measured, the measured token is the tabled source and the brief value is context. 3. If an inferred claim is unmarked, add `[INFERRED]` and cite the token. 4. If an absent value was backfilled, replace it with a no-data stamp or omit the section. 5. Cross-check against `references/authoring_boundary.md`. |

> **Feature File:** [12--authoring-boundary/012-authoring-boundary.md](12--authoring-boundary/012-authoring-boundary.md)

---

## 19. SOURCE-OF-TRUTH (`PROVENANCE-001`)

### PROVENANCE-001 | Source-Of-Truth Router Card Sorts Each Value

#### Description
Verify that the source-of-truth router card sorts every value bound for a v3 Style Reference into exactly one of four origins before writing: measured (present in `tokens.json`), brief-provided (stated in the brief), inferred (a characterization of a measured value) or absent (not captured). The card routes each origin to its place, records any doubtful value in a table with its origin and the token it traces to or the reason it is absent, then ends with a stop check whose last box confirms this is live-surface extraction rather than brief-only forward-authoring.

#### Scenario Contract
Prompt: `"Walk through each value in this design system and tell me where it came from before we trust it."`

- Objective: confirm the card sorts every doubtful value by origin and routes each origin correctly, so no value is fabricated or backfilled
- Expected execution process: take the Style Reference and `tokens.json`. For each value whose origin is not obvious, walk the card's ordered questions and assign one origin. Confirm measured values trace to a `tokens.json` row, brief-provided values stay in prose, inferred claims carry `[INFERRED]` and cite a measured token, absent values are stamped or omitted. Fill the doubtful-values table. Run the stop check and confirm every box passes
- Expected signals: every token-table value resolves to Measured with a `tokens.json` row. No brief-provided value sits in a token table. Every inference is marked `[INFERRED]` and cites a measured token. Every absent value is stamped or omitted. The doubtful-values table names a real origin for each row. The stop check passes
- Desired user-visible outcome: the agent produces a completed origin sort that names, for each doubtful value, whether it is measured (and which token), brief-provided, inferred (and the cited token) or absent, with no value left as an unexplained invention

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PROVENANCE-001 | Source-of-truth router card | Verify the card sorts each value into measured, brief-provided, inferred or absent, keeps only measured values in token tables and records the doubtful values with their origin | `Walk through each value in this design system and tell me where it came from before we trust it.` | 1. `read: <--output>/tokens.json` (collect the measured set) -> 2. for each doubtful value, walk the card's ordered questions and assign one origin -> 3. `read: <style-reference.md>` confirm token tables hold only measured values -> 4. `bash: rg '\[INFERRED\]' <style-reference.md>` confirm inferences cite a measured token -> 5. fill the doubtful-values table (value, origin, token or reason absent) -> 6. run the card's stop check | Step 1: measured set collected. Step 2: one origin per value, first yes wins. Step 3: token tables measured-only. Step 4: inferences marked and cited. Step 5: doubtful-values table names a real origin per row. Step 6: stop check passes, including the last box | Transcript of the measured-set listing, the per-value origin sort, the token-table trace, the [INFERRED] grep, the completed doubtful-values table and the stop-check result | PASS if every value resolves to exactly one of the four origins AND token tables contain only measured values AND every inference is marked `[INFERRED]` with a cited token AND the doubtful-values table leaves no row as an unexplained invention AND the stop check passes. FAIL if a value cannot name a measured token yet is not honestly brief-provided, inferred or absent OR a brief-provided value sits in a token table OR the stop check's last box fails and the request is treated as in-scope | 1. If a value is an invention, remove it. 2. If a brief-provided value sits in a token table, move it to prose as a stated intent. 3. If an inference lacks a cited token, add the citation or drop the claim. 4. If the stop check's last box fails, this is forward-authoring: route it to the separate design-spec decision and do not loosen fidelity. 5. Cross-check the sort against `references/authoring_boundary.md`. |

> **Feature File:** [13--source-of-truth/013-source-of-truth-card.md](13--source-of-truth/013-source-of-truth-card.md)

---

## 20. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `backend/tests/cluster.test.ts` | OKLCH clustering and L1-L4 stability classification | CLUSTER-001, FIDELITY-001 |
| `backend/tests/validate.test.ts` | Hex-accuracy, v3 Style Reference section recognition, and Quick-Start fidelity validation | VALIDATE-001 |

The vitest suite (68 tests across 7 files) covers the deterministic clustering and validation logic. The manual scenarios cover the live-crawl, fidelity, dark-mode gate, setup, escalation, authoring-boundary and source-of-truth provenance behavior that automated tests cannot exercise end to end. The authoring-boundary and source-of-truth scenarios are judgment checks on value provenance that no unit test replaces.

---

## 21. FEATURE CATALOG CROSS-REFERENCE INDEX

Each scenario maps to exactly one per-scenario file in a numbered category folder at the playbook root, and to its capability area in the feature catalog. Keep the per-scenario filenames stable once published.

| ID | Scenario | Category | Feature File | Catalog File |
|---|---|---|---|---|
| EXTRACT-001 | Live extraction produces valid tokens.json | Extract | [01--extract/001-live-extraction.md](01--extract/001-live-extraction.md) | [../feature_catalog/01--extract/extract.md](../feature_catalog/01--extract/extract.md) |
| VALIDATE-001 | Validator passes on faithful DESIGN.md and flags phantom hexes | Validate | [02--validate/002-phantom-hex-detection.md](02--validate/002-phantom-hex-detection.md) | [../feature_catalog/04--validate/validate.md](../feature_catalog/04--validate/validate.md) |
| FIDELITY-001 | Cardinal verbatim-value rule enforced | Fidelity | [03--fidelity/003-verbatim-value-fidelity.md](03--fidelity/003-verbatim-value-fidelity.md) | [../feature_catalog/03--write-design-md/write-design-md.md](../feature_catalog/03--write-design-md/write-design-md.md) |
| DARKMODE-001 | Dark-mode section appears only when detected | Dark Mode | [04--dark-mode/004-dark-mode-gate.md](04--dark-mode/004-dark-mode-gate.md) | [../feature_catalog/06--feature-extractors/feature-extractors.md](../feature_catalog/06--feature-extractors/feature-extractors.md) |
| SETUP-001 | Tool readiness from a fresh checkout | Setup | [05--setup/005-tool-readiness.md](05--setup/005-tool-readiness.md) | [../feature_catalog/01--extract/extract.md](../feature_catalog/01--extract/extract.md) |
| ESCALATE-001 | Anti-bot site causes clear escalation, never fabricates tokens | Escalation | [06--escalation/006-anti-bot-escalation.md](06--escalation/006-anti-bot-escalation.md) | [../feature_catalog/01--extract/extract.md](../feature_catalog/01--extract/extract.md) |
| REPORT-001 | Report And Preview Generation | Report | [07--report/007-report-generation.md](07--report/007-report-generation.md) | [../feature_catalog/05--report-preview/report-preview.md](../feature_catalog/05--report-preview/report-preview.md) |
| INTERACT-001 | Interaction Capture And State Matrix | Interaction | [08--interaction/008-interaction-state-matrix.md](08--interaction/008-interaction-state-matrix.md) | [../feature_catalog/07--interaction-capture/interaction-capture.md](../feature_catalog/07--interaction-capture/interaction-capture.md) |
| CLUSTER-001 | OKLCH Clustering And Stability Classification | Cluster | [09--cluster/009-oklch-clustering.md](09--cluster/009-oklch-clustering.md) | [../feature_catalog/02--cluster-classify/cluster-classify.md](../feature_catalog/02--cluster-classify/cluster-classify.md) |
| A11Y-001 | Accessibility Section Fidelity | Accessibility | [10--accessibility/010-accessibility-section.md](10--accessibility/010-accessibility-section.md) | [../feature_catalog/06--feature-extractors/feature-extractors.md](../feature_catalog/06--feature-extractors/feature-extractors.md) |
| DETECT-001 | Framework, Icon, And Motion Detection | Detectors | [11--detectors/011-framework-icon-motion-detection.md](11--detectors/011-framework-icon-motion-detection.md) | [../feature_catalog/06--feature-extractors/feature-extractors.md](../feature_catalog/06--feature-extractors/feature-extractors.md) |
| BOUNDARY-001 | Authoring boundary sorts values by origin | Authoring Boundary | [12--authoring-boundary/012-authoring-boundary.md](12--authoring-boundary/012-authoring-boundary.md) | [../feature_catalog/03--write-design-md/write-design-md.md](../feature_catalog/03--write-design-md/write-design-md.md) |
| PROVENANCE-001 | Source-of-truth router card sorts each value | Source-of-Truth | [13--source-of-truth/013-source-of-truth-card.md](13--source-of-truth/013-source-of-truth-card.md) | [../feature_catalog/03--write-design-md/write-design-md.md](../feature_catalog/03--write-design-md/write-design-md.md) |

This index lists 13 scenario IDs and ships 13 per-scenario files. The count of per-scenario files MUST equal the count of IDs in this table (13), so keep them in sync as scenarios are added or revised.

Total: 13 scenarios = 13 per-scenario files.
