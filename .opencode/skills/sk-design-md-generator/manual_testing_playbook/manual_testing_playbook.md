---
title: "sk-design-md-generator: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-scenario validation for the sk-design-md-generator skill. Covers live extraction, fidelity validation, the cardinal verbatim-value rule, dark-mode gating, tool setup, and anti-bot escalation."
---

# sk-design-md-generator: Manual Testing Playbook

End-to-end manual testing reference for the sk-design-md-generator skill. Every scenario validates a capability of the skill against its defined behavior. The default set exercises the full three-phase pipeline (extract, write, validate) end to end against a real live URL, plus a negative-control escalation scenario that proves the skill refuses to fabricate tokens. The embedded tool drives a Playwright Chromium crawler, an OKLCH token cluster, and a fidelity validator. Skill version 1.0.0.

> **Cardinal rule (locked decision, read first).** Every hex code, pixel value, font weight, box shadow, border radius, and spacing value in `DESIGN.md` MUST be copied verbatim from `tokens.json`. No estimation, no rounding, no invention. Hex codes must use 6-digit lowercase format. L1 (permanent) and L2 (system) tokens populate the 17 main sections; L3 (campaign) tokens appear with a "Subject to change" annotation; L4 (content) tokens are excluded entirely. The dark-mode section (2.5) appears ONLY when the extractor detected a dark palette. Every scenario below treats this rule as the non-negotiable contract.

---

**EXECUTION POLICY:** Every default scenario in this playbook is SAFE to execute for real: it extracts from a live URL, validates the output, and inspects file content. None of the default scenarios fabricate tokens, overwrite production files, or mutate anything outside the `tool/output/` directory. Run actual commands, inspect real outputs, and call the real embedded tool. Valid statuses are PASS, FAIL, or SKIP with a documented blocker. The escalation scenario exercises the anti-bot refusal gate as a negative control: it proves the skill escalates rather than fabricates. Fabricating tokens in any scenario is a HARD FAIL.

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
| **TOTAL** | **6** | **6 scenarios** |

This playbook defines 6 deterministic scenarios across 6 categories validating the full surface of the `sk-design-md-generator` skill. Each scenario keeps its own ID, is summarized inline in Sections 7-12, and links to a dedicated per-scenario file with the full execution contract, with the cross-reference index in Section 13.

> **Per-scenario files:** The root playbook is the directory, review surface, and orchestration guide, while per-scenario execution detail lives in one file per scenario inside numbered category folders at the playbook root. The cross-reference index in Section 13 lists every scenario file.

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

1. Working directory is the skill root `.opencode/skills/sk-design-md-generator/` (`pwd` shows the skill root). The embedded tool lives at `tool/` and all extraction, validation, and report commands run from `tool/` as the working directory.
2. Node.js `>=18` is on PATH (`node --version`). macOS is the supported baseline; Linux and Windows are experimental and unverified for these scenarios.
3. The embedded tool dependencies are installed: `cd tool && npm install` produces no errors. The Playwright Chromium binary is installed: `cd tool && npx playwright install chromium` completes successfully.
4. For EXTRACT-001, a live, publicly reachable URL that renders JavaScript is required. `https://example.com` is the reference URL for initial smoke tests, but operators may substitute any crawlable site. The scenario ID stays the same.
5. For VALIDATE-001 and FIDELITY-001, a prior extraction must have produced a valid `tokens.json` and a conformant `DESIGN.md`. These scenarios can use the output from EXTRACT-001 or any existing extraction output.
6. For ESCALATE-001, a site that blocks automated crawlers (403/429/bot-wall) is required to exercise the negative control. Operators may use a known anti-bot site or a local mock that returns 403.
7. Output files from extraction land in `tool/output/<domain>/` by default. Do not run extractions that would overwrite a production `DESIGN.md`.

> **Do-not-run note for this playbook author and executors:** Examples in this document that show command output are illustrative, so verify exact flags and output with `npx ts-node scripts/extract.ts --help` and `npx ts-node scripts/validate.ts --help` on the live machine. Never fabricate tokens in any scenario; a fabricated token is a HARD FAIL.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript with exit codes
- User request used
- Orchestrator or agent-facing prompt used
- Phase detection and routing notes (EXTRACT_WRITE, VALIDATE, etc.)
- The live `tokens.json` output (path, file size, valid JSON confirmed)
- The live `DESIGN.md` output (path, section count, hex count)
- The live `validate.ts` output (pass/fail, phantom hex findings, section completeness)
- For SETUP-001: `npm install` output and `npx playwright install chromium` exit code
- For ESCALATE-001: the crawl error message and the escalation text
- Final user-facing response or outcome summary
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

| Type | Notation | Example |
|---|---|---|
| Extract (Phase 1) | `cd tool && npx ts-node scripts/extract.ts <url> [flags]` | `cd tool && npx ts-node scripts/extract.ts https://example.com --fast` |
| Validate (Phase 3) | `cd tool && npx ts-node scripts/validate.ts <DESIGN.md> <tokens.json>` | `cd tool && npx ts-node scripts/validate.ts DESIGN.md output/example.com/tokens.json` |
| Setup | `cd tool && npm install` / `npx playwright install chromium` | `cd tool && npm install && npx playwright install chromium` |
| Vitest suite | `cd tool && npx vitest run` | `cd tool && npx vitest run` |
| Bash | `bash: <command>` | `bash: node --version` |
| File inspection | `read: <path>` | `read: output/example.com/tokens.json` |
| Agent prompt | `agent: <instruction>` | `agent: detect the pipeline phase from the user request` |
| Sequential | `->` separator | `extract.ts https://example.com --fast -> validate.ts DESIGN.md output/example.com/tokens.json` |
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

A scenario is FAIL when any of the above conditions is not met, when a hex value was fabricated or estimated, when an L4 token appeared in DESIGN.md, when a dark-mode section appeared without a detected dark palette, or when `validate.ts` failures were ignored.

A scenario is SKIP only with a documented blocker (for example, no crawlable URL is available, so EXTRACT-001 and its dependents cannot run; record the blocker and skip the dependents).

### Critical-Path Scenarios (BLOCK RELEASE if FAIL)

| ID | Scenario | Why Critical |
|---|---|---|
| EXTRACT-001 | Live extraction produces valid tokens.json | Nothing else is testable until the extractor runs successfully; tokens.json is the ground truth for every downstream phase |
| FIDELITY-001 | Cardinal verbatim-value rule enforced | The skill's entire value proposition is hallucination-proof fidelity; a fabricated or estimated value breaks the contract |
| VALIDATE-001 | Validator detects phantom hexes | An unvalidated DESIGN.md is a draft; the validator is the only automated gate against fabricated values |

### Release Readiness Rule

Release is READY only when no scenario verdict is FAIL, all critical-path scenarios are PASS (or SKIP with a documented environment blocker that the operator accepts), coverage matches the cross-reference index, no tokens were fabricated in any scenario, and no unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put scenario-specific acceptance caveats in the matching per-scenario file (see Section 13).

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
Verify that a real user request to "extract the design system from example.com" triggers the EXTRACT_WRITE pipeline phase, runs `extract.ts --fast` against the live URL, and produces a valid, non-empty `tokens.json` at `output/<domain>/tokens.json` with populated token arrays, plus screenshots and an extraction report.

#### Scenario Contract
Prompt: `"Extract the design system from example.com."`

- Objective: confirm the full extraction phase runs against a live URL and emits valid tokens.json
- Expected execution process: detect the EXTRACT_WRITE phase from the request, verify tool readiness, run `cd tool && npx ts-node scripts/extract.ts https://example.com --fast`, confirm `output/example.com/tokens.json` exists, is valid JSON, and contains non-empty `colorTokens`, `typographyLevels`, `shadowTokens`, `radiusTokens`, and `spacingScale` arrays
- Expected signals: `extract.ts` exits 0; `output/example.com/tokens.json` is a valid JSON file > 1 KB with populated token arrays; screenshots land in `output/example.com/`; an extraction report is written
- Desired user-visible outcome: the agent reports the extraction completed, the output path, and a summary of captured token counts

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| EXTRACT-001 | Live extraction | Verify `extract.ts --fast` against a live URL produces valid tokens.json | `Extract the design system from example.com.` | 1. agent detects EXTRACT_WRITE phase -> 2. verify tool readiness (`node --version`, check `tool/node_modules/`) -> 3. `cd tool && npx ts-node scripts/extract.ts https://example.com --fast` -> 4. `bash: ls -la output/example.com/tokens.json` -> 5. agent reports token counts | Step 1: phase detected as EXTRACT_WRITE. Step 2: Node >= 18, tool dependencies present. Step 3: extract exits 0, crawl output on stdout. Step 4: tokens.json exists, >1 KB, valid JSON. Step 5: agent reports counts from colorTokens, typographyLevels, etc. | Transcript of `extract.ts --fast`, `ls -la` of output, token count summary | PASS if `extract.ts` exits 0 AND `tokens.json` is valid JSON with non-empty token arrays AND agent reports the output correctly. FAIL if extraction exits non-zero OR tokens.json is empty/missing OR agent fabricates token counts | 1. Confirm `--fast` was used (5 pages, 8 concurrency). 2. Confirm `output/example.com/tokens.json` exists and parses as JSON. 3. Confirm token arrays are non-empty. 4. If the site returns 403/429, skip with a blocker (site blocks crawlers) and route to ESCALATE-001. |

> **Feature File:** [01--extract/extract-001.md](01--extract/extract-001.md)

---

## 8. VALIDATE (`VALIDATE-001`)

### VALIDATE-001 | Validator Passes On Faithful DESIGN.md And Flags Phantom Hexes

#### Description
Verify that `validate.ts` PASSES on a faithfully-written DESIGN.md (all hexes trace to tokens.json) and FAILS on a DESIGN.md that contains a phantom hex — a hex value not present in tokens.json. This is both a positive and negative control: the validator must not report false positives and must catch real fabrications.

#### Scenario Contract
Prompt: `"Validate the DESIGN.md I just wrote against its tokens.json."`

- Objective: confirm the validator correctly distinguishes faithful from fabricated output
- Expected execution process: run `validate.ts` against a known-good DESIGN.md + tokens.json pair; confirm PASS with score 100 and zero phantom-hex failures. Then plant a single hex (`#ff0000`) in a copy of the DESIGN.md that does not exist in tokens.json, re-run validation, and confirm a phantom-color failure for that hex
- Expected signals: first run exits 0 with `passed: [...]`, `failures: []`, score 100; second run exits non-zero (or reports failures) with a phantom-color finding for `#ff0000`
- Desired user-visible outcome: the agent reports the faithful DESIGN.md passed validation and the planted phantom hex was correctly flagged

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VALIDATE-001 | Fidelity validation | Verify `validate.ts` passes on faithful DESIGN.md and flags a planted phantom hex | `Validate the DESIGN.md I just wrote against its tokens.json.` | 1. `cd tool && npx ts-node scripts/validate.ts <faithful-DESIGN.md> output/<domain>/tokens.json` -> 2. copy DESIGN.md, append `#ff0000` in a prose line -> 3. `cd tool && npx ts-node scripts/validate.ts <planted-DESIGN.md> output/<domain>/tokens.json` | Step 1: exit 0, score 100, zero `phantom-color` failures. Step 2: phantom hex planted. Step 3: exit non-zero (or failures array non-empty), at least one `phantom-color` finding for `#ff0000` | Transcript of both validation runs, the planted DESIGN.md snippet, and the phantom-color finding | PASS if the faithful run passes with no phantom-hex failures AND the planted run flags `#ff0000` as a phantom color. FAIL if the faithful run reports false positives OR the planted run does not flag the phantom hex | 1. Confirm the faithful DESIGN.md contains only hexes from tokens.json. 2. Confirm the planted hex is not in tokens.json (check manually). 3. Confirm the validator's `checkPhantomColors` produced the expected finding. |

> **Feature File:** [02--validate/validate-001.md](02--validate/validate-001.md)

---

## 9. FIDELITY (`FIDELITY-001`)

### FIDELITY-001 | Cardinal Verbatim-Value Rule Enforced

#### Description
Verify that a DESIGN.md written by the skill copies every hex, pixel, font weight, shadow, and radius verbatim from tokens.json, with no estimation, rounding, or invention. Confirm 6-digit lowercase hex throughout, L4 tokens are absent, and L3 tokens carry a "Subject to change" annotation.

#### Scenario Contract
Prompt: `"Check that the DESIGN.md you wrote copies every value exactly from tokens.json — no estimates, no rounding."`

- Objective: confirm every numeric value in DESIGN.md matches tokens.json verbatim and format rules are satisfied
- Expected execution process: after a successful extraction, read both `tokens.json` and the written `DESIGN.md`; spot-check at least 5 hex values, 3 pixel values, 2 font weights, and 2 shadow definitions across the pair and confirm exact match; verify all hex codes in DESIGN.md are 6-digit lowercase; verify no L4 token (e.g., image-derived colors) appears in DESIGN.md; verify L3 tokens (campaign colors) carry the "Subject to change" annotation
- Expected signals: every sampled value matches exactly; all hex codes use 6-digit lowercase; L4 tokens absent; L3 tokens annotated
- Desired user-visible outcome: the agent confirms fidelity with specific token-to-DESIGN.md pairings, listing the sampled values and their matches

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FIDELITY-001 | Verbatim-value fidelity | Verify DESIGN.md copies values verbatim from tokens.json, no estimation, 6-digit lowercase hex, L4 excluded, L3 annotated | `Check that the DESIGN.md you wrote copies every value exactly from tokens.json — no estimates, no rounding.` | 1. `read: output/<domain>/tokens.json` (extract 5 hex values, 3 px values, 2 font weights, 2 shadows) -> 2. `read: <DESIGN.md>` (find the same values) -> 3. confirm exact match for each pair -> 4. grep DESIGN.md for hex patterns, confirm all are 6-digit lowercase -> 5. `bash: rg -c 'L4' <DESIGN.md>` confirm zero or only in explanatory text, no L4 token values -> 6. `bash: rg 'Subject to change' <DESIGN.md>` confirm present for L3 tokens if any exist | Step 1: token values extracted from JSON. Step 2: same values found verbatim in DESIGN.md. Step 3: all sampled values match. Step 4: all hex codes 6-digit lowercase. Step 5: no L4 token values in DESIGN.md. Step 6: L3 tokens annotated if present | Transcript of the value-matching spot-checks, hex-format grep output, L4/L3 grep output | PASS if every sampled value matches tokens.json verbatim AND all hex codes are 6-digit lowercase AND no L4 token values appear AND any L3 token is annotated. FAIL if any value is estimated/rounded OR a hex uses 3-digit/uppercase format OR an L4 token value appears OR an un-annotated L3 token appears | 1. Pick values from different sections (color, typography, spacing, shadows). 2. If a mismatch is found, check whether tokens.json was edited after extraction. 3. If L4 values appear, check the cluster.ts L4 classification logic. 4. If no L3 tokens exist in the source, the annotation check does not apply (note it). |

> **Feature File:** [03--fidelity/fidelity-001.md](03--fidelity/fidelity-001.md)

---

## 10. DARK MODE (`DARKMODE-001`)

### DARKMODE-001 | Dark-Mode Section Appears Only When Detected

#### Description
Verify the dark-mode gate: section 2.5 (Dark Mode) in DESIGN.md appears ONLY when `tokens.json` contains a detected dark-mode palette (non-empty `darkMode` object), and is omitted when no dark palette was detected. The skill must never derive or fabricate a dark palette from the light tokens.

#### Scenario Contract
Prompt: `"Does the DESIGN.md have a dark-mode section? Show me the condition."`

- Objective: confirm the dark-mode section is conditional on extraction evidence and never fabricated
- Expected execution process: inspect `tokens.json` for the `darkMode` object; if `darkMode` is present and non-empty (has `variableDiff` or `darkTokens`), confirm DESIGN.md §2.5 Dark Mode exists and contains those values verbatim. If `darkMode` is absent or empty, confirm DESIGN.md has no §2.5 Dark Mode section. If the extractor was run with `--no-dark-mode`, confirm §2.5 is absent regardless of whether the site has a dark palette
- Expected signals: DESIGN.md §2.5 exists iff tokens.json.darkMode is present and non-empty; no dark-mode section appears from fabrication or derivation
- Desired user-visible outcome: the agent states the condition, points to the evidence in tokens.json, and confirms the DESIGN.md gate was followed

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DARKMODE-001 | Dark-mode gate | Verify DESIGN.md §2.5 appears only when tokens.json has a detected dark palette and is never fabricated | `Does the DESIGN.md have a dark-mode section? Show me the condition.` | 1. `read: output/<domain>/tokens.json` (inspect `darkMode` field) -> 2. `read: <DESIGN.md>` (search for `## 2.5 Dark Mode` or equivalent) -> 3. correlate — if darkMode present and non-empty, §2.5 must exist with verbatim dark values; if absent/empty, §2.5 must not exist -> 4. agent reports the gate condition and the evidence | Step 1: darkMode present (with variableDiff/darkTokens) or absent/empty. Step 2: §2.5 present or absent. Step 3: presence/absence aligns exactly. Step 4: agent names the evidence, does not fabricate a dark palette | tokens.json darkMode snippet and the corresponding DESIGN.md section 2.5 (or its absence) | PASS if §2.5 exists iff tokens.json.darkMode is non-empty AND no dark-mode section was fabricated from light tokens. FAIL if §2.5 appears without a detected dark palette OR is missing when darkMode is non-empty OR contains derived/invented dark values | 1. Check `dark-mode-detect.ts` detection method in tokens.json (`media-query`, `class-toggle`, etc.). 2. If the site has a dark mode but it was not detected (JS class toggle), note it as a known gap (troubleshooting.md §3) and SKIP the scenario or mark it PASS with a documented gap. 3. Confirm `--no-dark-mode` was NOT used (unless testing that branch explicitly). |

> **Feature File:** [04--dark-mode/dark-mode-001.md](04--dark-mode/dark-mode-001.md)

---

## 11. SETUP (`SETUP-001`)

### SETUP-001 | Tool Readiness From A Fresh Checkout

#### Description
Verify that a fresh checkout of the tool directory requires `npm install` and `npx playwright install chromium` before any extraction or validation can run, and that a missing Chromium binary is reported clearly as a setup requirement, not as a crash or cryptic error.

#### Scenario Contract
Prompt: `"Set up the design extractor tool so I can extract a design system from a URL."`

- Objective: confirm the tool setup path works end to end and errors before setup are clear and actionable
- Expected execution process: confirm Node >= 18; run `cd tool && npm install` and verify zero errors; run `cd tool && npx playwright install chromium` and verify it completes; smoke-test with `cd tool && npx ts-node scripts/extract.ts --help` to confirm the CLI parses; attempt `cd tool && npx ts-node scripts/extract.ts https://example.com --fast` and confirm it runs (or fails with a clear crawl error, not a missing-binary crash)
- Expected signals: `npm install` exits 0; `npx playwright install chromium` exits 0 (or reports "already installed"); `--help` prints usage; extraction either succeeds or fails with a crawl-specific error, never `Executable doesn't exist` or `command not found: ts-node`
- Desired user-visible outcome: the agent confirms the tool is ready and the operator can proceed to EXTRACT-001

#### Test Execution
| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SETUP-001 | Tool readiness | Verify `npm install` + `npx playwright install chromium` prepare the tool, and missing Chromium is reported clearly | `Set up the design extractor tool so I can extract a design system from a URL.` | 1. `bash: node --version` -> 2. `cd tool && npm install` -> 3. `cd tool && npx playwright install chromium` -> 4. `cd tool && npx ts-node scripts/extract.ts --help` -> 5. smoke: `cd tool && npx ts-node scripts/extract.ts https://example.com --fast` | Step 1: Node >= 18. Step 2: npm install exits 0, no errors. Step 3: Playwright Chromium installed or confirmed. Step 4: --help prints usage. Step 5: extract runs (success or clear crawl error, never `Executable doesn't exist`) | Transcript of install steps, `--help` output, and smoke-test outcome | PASS if all setup steps complete without errors AND the smoke test either succeeds or fails with a crawl-specific error (not a missing-binary crash). FAIL if `npm install` or `playwright install` fails fatally OR the smoke test crashes with `Executable doesn't exist` OR `ts-node` is not found after install | 1. If `npm install` fails, check `tool/package.json` for version requirements. 2. If Chromium install fails (disk space, network), note as an environment blocker. 3. If the smoke test crashes with a missing binary, confirm `npx playwright install chromium` completed. 4. If `ts-node` is not found, confirm `npm install` ran in the `tool/` directory. |

> **Feature File:** [05--setup/setup-001.md](05--setup/setup-001.md)

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
| ESCALATE-001 | Anti-bot escalation | Verify a blocked crawl causes a clear escalation and zero tokens are fabricated | `Extract the design system from this site: https://www.cloudflare.com` | 1. NEGATIVE CONTROL: `cd tool && npx ts-node scripts/extract.ts https://www.cloudflare.com --fast` -> 2. observe crawl output (errors, page count) -> 3. inspect `output/cloudflare.com/tokens.json` (if written) -> 4. agent escalates with error + URL + anti-bot conclusion | Step 1: extraction exits non-zero or reports zero pages crawled. Step 2: error messages reference 403/429/empty pages. Step 3: tokens.json is absent, empty, or has zero-page token arrays. Step 4: agent escalation is clear, names the URL and the error, and fabricates nothing | Transcript of the failed extraction, the tokens.json inspection (or confirmation it was not written), and the agent's escalation message | PASS if the extraction failed clearly AND no tokens were fabricated AND the agent escalated with the specific error and URL. FAIL if the skill fabricated any token value OR produced a partial tokens.json from invented data OR silently reported success | 1. Confirm `--fast` was used (the scenario does not require a deep crawl to fail). 2. Confirm no hex, pixel, font-weight, or shadow value appeared that was not measured from a real page load. 3. If the chosen anti-bot site actually rendered crawlable pages (unlikely), pick a different known-blocker and re-run. 4. Confirm the escalation follows SKILL.md §4 ESCALATE IF rule 1 verbatim. |

> **Feature File:** [06--escalation/escalate-001.md](06--escalation/escalate-001.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `tool/scripts/__tests__/cluster.test.ts` | OKLCH clustering and L1-L4 stability classification | FIDELITY-001 |
| `tool/scripts/__tests__/validate.test.ts` | Hex-accuracy and v2 core-section validation | VALIDATE-001 |

The vitest suite (50 tests) covers the deterministic clustering and validation logic. The manual scenarios cover the live-crawl, fidelity, dark-mode gate, setup, and escalation behavior that automated tests cannot exercise end to end.

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

Each scenario maps to exactly one per-scenario file in a numbered category folder at the playbook root, and to its capability area in the feature catalog. Keep the per-scenario filenames stable once published.

| ID | Scenario | Category | Feature File | Catalog File |
|---|---|---|---|---|
| EXTRACT-001 | Live extraction produces valid tokens.json | Extract | [01--extract/extract-001.md](01--extract/extract-001.md) | [../feature_catalog/01--extract/extract.md](../feature_catalog/01--extract/extract.md) |
| VALIDATE-001 | Validator passes on faithful DESIGN.md and flags phantom hexes | Validate | [02--validate/validate-001.md](02--validate/validate-001.md) | [../feature_catalog/04--validate/validate.md](../feature_catalog/04--validate/validate.md) |
| FIDELITY-001 | Cardinal verbatim-value rule enforced | Fidelity | [03--fidelity/fidelity-001.md](03--fidelity/fidelity-001.md) | [../feature_catalog/03--write-design-md/write-design-md.md](../feature_catalog/03--write-design-md/write-design-md.md) |
| DARKMODE-001 | Dark-mode section appears only when detected | Dark Mode | [04--dark-mode/dark-mode-001.md](04--dark-mode/dark-mode-001.md) | [../feature_catalog/06--feature-extractors/feature-extractors.md](../feature_catalog/06--feature-extractors/feature-extractors.md) |
| SETUP-001 | Tool readiness from a fresh checkout | Setup | [05--setup/setup-001.md](05--setup/setup-001.md) | [../feature_catalog/01--extract/extract.md](../feature_catalog/01--extract/extract.md) |
| ESCALATE-001 | Anti-bot site causes clear escalation, never fabricates tokens | Escalation | [06--escalation/escalate-001.md](06--escalation/escalate-001.md) | [../feature_catalog/01--extract/extract.md](../feature_catalog/01--extract/extract.md) |

This index lists 6 scenario IDs and ships 6 per-scenario files. The count of per-scenario files MUST equal the count of IDs in this table (6), so keep them in sync as scenarios are added or revised.

Total: 6 scenarios = 6 per-scenario files.
