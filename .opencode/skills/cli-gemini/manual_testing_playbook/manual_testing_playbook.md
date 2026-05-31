---
title: "cli-gemini: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the cli-gemini skill."
---

# cli-gemini: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed for real, not mocked, not stubbed, not classified as "unautomatable". AI agents executing these scenarios must run the actual commands, inspect real files, dispatch the real `gemini` binary and verify real outputs. The only acceptable classifications are PASS, FAIL or SKIP (with a specific sandbox blocker documented). "UNAUTOMATABLE" is not a valid status.

This document combines the full manual-validation contract for the `cli-gemini` skill into a single reference. The root playbook acts as the operator directory, review protocol and orchestration guide while the per-feature files carry the scenario-specific execution truth.

---

This playbook package adopts the Feature Catalog split-document pattern for the `cli-gemini` skill. The root document acts as the directory, review surface and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--cli-invocation/`
- `02--auto-approve-yolo/`
- `03--built-in-tools/`
- `04--agent-routing/`
- `06--integration-patterns/`
- `07--prompt-templates/`

The numeric gap at `05` is intentional. cli-gemini has no first-class session-continuity surface (no analogue to `gemini --resume` exposed as an orchestrator-grade pattern in this skill's references), so position `05` is reserved across the spec 048 cli-* playbook family for skills that do expose that surface. This playbook documents the gap rather than renumbering the remaining categories so cross-CLI position invariants (`01--cli-invocation`, `06--integration-patterns`, `07--prompt-templates`) hold.

---

## 1. OVERVIEW

This playbook provides 19 deterministic scenarios across 6 categories validating the `cli-gemini` skill surface. Each feature keeps its stable `CG-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-04-26): the playbook covers cli-gemini's documented behaviour at SKILL.md v1.2.3, including non-interactive invocation, output formats, the `gemini-3.1-pro-preview` model lock, `--yolo` and approval modes, the three Gemini-only tools (`google_web_search`, `codebase_investigator`, `save_memory`) plus the `@` file-reference syntax, agent routing for `@context` / `@review` / `@deep-research` / `@ai-council` (with documented Task-tool routing for `@debug`), three core integration patterns (generate-review-fix, JSON output processing, parallel background execution) and the two ALWAYS-loaded prompt assets. Position `05` is reserved across the cli-* playbook family for session-continuity surfaces. cli-gemini does not expose one and skips that slot intentionally.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root and has `.git/`.
2. Gemini CLI is installed and resolvable via `command -v gemini`. The version is recent enough to support `-o json`, `--yolo`, `--approval-mode`, `--allowed-tools`, `--include-directories` and the `@<agent>` prefix routing.
3. Authentication is configured (Google OAuth or `GEMINI_API_KEY`) and the operator has remaining quota for the wave being executed.
4. The supported model `gemini-3.1-pro-preview` is reachable from the active auth method (free-tier OAuth, API key or Vertex AI per `references/cli_reference.md` §3 AUTHENTICATION).
5. The cli-gemini skill files (SKILL.md, references/, assets/) are present at `.opencode/skills/cli-gemini/` and unmodified during the test run.
6. Destructive scenarios `CG-004` (YOLO sandboxed write) and `CG-008` (save_memory in sandboxed `HOME`) MUST verify recovery is possible. Both use `/tmp/` sandboxes and tripwire the operator's real project tree (and real `~/.gemini/memory.json` for CG-008) so unintended mutations are caught immediately.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript (full Bash invocation including flags)
- User request used (the human-language ask the operator started from)
- Orchestrator or agent-facing prompt used (the exact text passed to `gemini`)
- Delegation or runtime-routing notes when applicable (which Gemini agent prefix, which `--allowed-tools` allowlist, which `--include-directories` scope)
- Output snippets (saved to `/tmp/cg-NNN*.txt` / `.json` / `.py` per scenario)
- Final user-facing response or outcome summary
- Artifact paths or output references for every captured file
- Scenario verdict (`PASS` / `PARTIAL` / `FAIL` / `SKIP`) with rationale and the highest-severity finding when applicable

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `gemini <flags> "[prompt]"`.
- Bash commands shown as `bash: <command>`.
- Tool calls inside the Gemini envelope surface as `.toolCalls[].name` after `-o json` (e.g. `google_web_search`, `codebase_investigator`, `save_memory`, `read_file`).
- Agent prefixes shown as `As @<agent>: <instruction>` in the prompt body.
- `->` separates sequential steps inside a scenario's Exact Command Sequence.
- All evidence files live under `/tmp/cg-NNN*`. The playbook never writes to project paths outside `/tmp/` sandboxes.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence (command transcripts, captured `/tmp/cg-NNN*` artifacts)
4. Feature-to-scenario coverage map (the §14 FEATURE CATALOG CROSS-REFERENCE INDEX)
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied (auth, quota, sandbox setup).
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable (the `/tmp/cg-NNN*` artifacts exist and contain the documented content).
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete (e.g. supplemental check skipped, but the main 9-column row passed)
- `FAIL`: expected behavior missing, contradictory output or critical check failed
- `SKIP`: a sandbox blocker prevented execution (e.g. no `gemini` binary on the operator's machine). Document the blocker and the remediation step

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rules:
- Any critical-path scenario `FAIL` forces feature verdict to `FAIL`.
- Both destructive scenarios (`CG-004`, `CG-008`) MUST have an empty tripwire diff. A non-empty diff is automatically `FAIL` for the scenario AND escalates regardless of how the rest of the row scored.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES = 19`).
4. No unresolved blocking triage item remains.
5. Both destructive scenarios (`CG-004`, `CG-008`) are PASS with empty tripwire diffs.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put feature-specific acceptance caveats (e.g. CG-006/CG-012 web-grounding sensitivity to rate limits, CG-008 sandbox `HOME` override discipline) in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (verify `gemini` is installed, auth works and quota remains for the planned wave).
2. Reserve one coordinator (the calling AI or operator who reads this playbook).
3. Saturate remaining worker slots with read-only scenarios first (Wave 1).
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run destructive scenarios (`CG-004`, `CG-008`) in a dedicated sandbox-only wave (Wave 3).
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references and evidence paths in the final report.

### Suggested Wave Plan

- **Wave 1, Read-only baseline (parallel-safe)**: `CG-001`, `CG-002`, `CG-003`, `CG-005`, `CG-009`, `CG-010`, `CG-011`, `CG-013`, `CG-017`, `CG-018`. These are read-only or shape-only checks that do not mutate any sandbox.
- **Wave 2, Web-grounded and architecture (rate-limit sensitive)**: `CG-006`, `CG-007`, `CG-012`, `CG-016`. These hit external Google Search or run longer multi-tool calls. Throttle parallelism per `references/integration_patterns.md` §6 RATE LIMIT HANDLING.
- **Wave 3, Destructive sandbox-only (serial)**: `CG-004` (YOLO sandboxed write), `CG-008` (save_memory in sandboxed `HOME`). Run one at a time and verify tripwire diffs are empty after each.
- **Wave 4, Integration-pattern composites**: `CG-014`, `CG-015`. Each touches multiple Gemini calls. Run after Waves 1-3 confirm baseline behaviour.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field with the canonical text for this scenario
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints (e.g. `--include-directories` scoping for sandboxed writes, `HOME` override for memory tests)

---

## 7. CLI INVOCATION

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CG-001 | Direct prompt with text output

#### Description

Confirm `gemini "[prompt]" -o text 2>&1` returns a non-empty plain-text response in a single non-interactive invocation.

#### Scenario Contract

Prompt: `Ask Gemini to summarise the cli-gemini skill in plain text and confirm the call exits without opening a REPL.`

Expected signals: `command -v gemini` resolves to a binary path, the single-shot call exits 0 with a non-empty multi-sentence response in plain text and no REPL banner blocks stdin.

Desired user-visible outcome: a short paragraph (1-3 sentences) summarising cli-gemini's role + a PASS verdict.

#### Test Execution
> **Feature File:** [CG-001](01--cli-invocation/001-direct-prompt-text-output.md)

### CG-002 | JSON output mode

#### Description

Confirm `gemini -o json` returns the documented `{response, stats}` envelope and parses cleanly with `jq`.

#### Scenario Contract

Prompt: `Have Gemini count cli-gemini reference markdown files in JSON mode and report the answer plus token stats.`

Expected signals: command exits 0, stdout begins with `{`, `jq -r '.response'` returns non-empty and `jq -e '.stats.totalInputTokens, .stats.totalOutputTokens'` returns numeric values.

Desired user-visible outcome: a natural-language count answer + a token-stats line.

#### Test Execution
> **Feature File:** [CG-002](01--cli-invocation/002-json-output-mode.md)

### CG-003 | Explicit model selection

#### Description

Confirm `-m gemini-3.1-pro-preview` succeeds and an unsupported model name fails fast with a non-zero exit.

#### Scenario Contract

Prompt: `Pin Gemini to gemini-3.1-pro-preview, prove it answers, then confirm a bogus model fails clearly.`

Expected signals: supported call exits 0 with a parseable JSON answer, unsupported `-m gemini-bogus-model` call exits non-zero with a model-related error in stdout/stderr.

Desired user-visible outcome: PASS verdict with the supported-model answer + a one-line note that the bogus-model call was correctly rejected.

#### Test Execution
> **Feature File:** [CG-003](01--cli-invocation/003-explicit-model-selection.md)

---

## 8. AUTO-APPROVE / YOLO

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CG-004 | YOLO flag with sandboxed file write **(DESTRUCTIVE)**

#### Description

Confirm `--yolo` auto-approves a sandboxed file-write tool call without prompting and without touching project files.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator with explicit sandbox approval, invoke Gemini CLI with --yolo against the cli-gemini skill in this repository. Verify the auto-approve flag lets Gemini perform a documented file-write tool call inside the sandbox directory passed via --include-directories without prompting the operator. Constrain all writes to the provided sandbox directory. Return a concise pass/fail verdict with the main reason and the resulting file path.`

Expected signals: `EXIT=0`, `/tmp/cg-004-sandbox/hello.md` exists with the expected content, `git status --porcelain` diff before vs after is empty (project tree unchanged) and no operator prompt blocked stdin.

Desired user-visible outcome: PASS verdict reporting the absolute sandbox path and approximate file size.

#### Test Execution
> **Feature File:** [CG-004](02--auto-approve-yolo/004-yolo-flag-sandboxed-write.md)

### CG-005 | Approval mode comparison (default vs never)

#### Description

Confirm default approval and `--approval-mode never` both complete a read-only prompt without operator interaction or project mutation.

#### Scenario Contract

Prompt: `Compare default approval and plan mode on a read-only SKILL.md lookup, with no prompt stalls or working-tree changes.`

Expected signals: both calls exit 0, both outputs name `gemini-3.1-pro-preview` (the answer to the read-only probe) and `git status --porcelain` diff is empty.

Desired user-visible outcome: PASS verdict + a one-line comparison noting default and never produced equivalent read-only behaviour.

#### Test Execution
> **Feature File:** [CG-005](02--auto-approve-yolo/005-approval-mode-comparison.md)

---

## 9. BUILT-IN TOOLS

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract.

### CG-006 | Google web search grounding

#### Description

Confirm `google_web_search` fires for an explicit web-grounded prompt and the answer cites at least one URL.

#### Scenario Contract

Prompt: `Use google_web_search to find the current official Node.js LTS major version and include the source URL.`

Expected signals: `EXIT=0`, `.toolCalls[].name` includes `google_web_search`, `.response` contains at least one HTTPS URL and the answer names the queried topic.

Desired user-visible outcome: PASS verdict + the LTS version string + the cited URL.

#### Test Execution
> **Feature File:** [CG-006](03--built-in-tools/006-google-web-search-grounding.md)

### CG-007 | Codebase investigator

#### Description

Confirm `codebase_investigator` fires for a scoped architecture prompt and the response names real local files.

#### Scenario Contract

Prompt: `Use codebase_investigator to map the cli-gemini skill structure and name real reference or asset files.`

Expected signals: `EXIT=0`, `.toolCalls[].name` includes `codebase_investigator` and the response names at least 3 real cli-gemini files from `SKILL.md`, `cli_reference.md`, `integration_patterns.md`, `gemini_tools.md`, `agent_delegation.md`, `prompt_templates.md`, `prompt_quality_card.md`.

Desired user-visible outcome: PASS verdict + a 3-5 line summary identifying SKILL.md as the entry point, references catalog and assets catalog.

#### Test Execution
> **Feature File:** [CG-007](03--built-in-tools/007-codebase-investigator.md)

### CG-008 | save_memory persistence **(DESTRUCTIVE, sandboxed `HOME`)**

#### Description

Confirm `save_memory` persists a marker in a sandboxed `HOME` and a follow-up invocation recalls it without touching the operator's real memory file.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator running an isolated memory-persistence test, invoke Gemini CLI against the cli-gemini skill in this repository with HOME pointed at a disposable sandbox directory. First call: ask Gemini to save_memory the fact 'cli-gemini test marker is CG-008-MARKER'. Second call: ask Gemini to read its saved memory and report whether the marker is present. Verify the sandbox memory file exists after call 1 and call 2 surfaces the marker. Return a concise pass/fail verdict with the main reason and the recalled marker text.`

Expected signals: `EXIT_SAVE=0`, `/tmp/cg-008-sandbox/.gemini/memory.json` exists and contains the marker, `EXIT_RECALL=0`, recall response surfaces `CG-008-MARKER` and the tripwire diff against the operator's real `~/.gemini/memory.json` is empty.

Desired user-visible outcome: PASS verdict reporting the marker was both written and recalled inside the sandbox + the recalled marker text.

#### Test Execution
> **Feature File:** [CG-008](03--built-in-tools/008-save-memory-persistence.md)

### CG-009 | File reference syntax (`@` prefix)

#### Description

Confirm `@path/to/file` resolves and the answer quotes a verifiable string from the referenced file.

#### Scenario Contract

Prompt: `Pass cli-gemini SKILL.md with @ syntax and quote the supported model name back as proof it was read.`

Expected signals: `EXIT=0`, the response contains the literal string `gemini-3.1-pro-preview` and the answer frames it as the only supported model.

Desired user-visible outcome: PASS verdict + a one-line quote naming the supported model.

#### Test Execution
> **Feature File:** [CG-009](03--built-in-tools/009-file-reference-syntax.md)

---

## 10. AGENT ROUTING

This category covers 4 scenario summaries while the linked feature files remain the canonical execution contract. Coverage spans all 6 documented Gemini agents (`@context`, `@review`, `@deep-research`, `@ai-council`, `@debug`). CG-013 documents the `@debug` Task-tool routing path and CG-019 closes the deferred surface gap by exercising an inline `As @debug agent:` dispatch end to end.

### CG-010 | @context agent for codebase exploration

#### Description

Confirm `As @context agent:` produces a read-only exploration that names real reference files without mutating the working tree.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator using Gemini agent routing, dispatch the @context agent against the cli-gemini skill in this repository to produce a structured map of the references/ folder. Verify the answer names at least three real reference files with a one-line purpose for each, and that the working tree is unchanged after the call. Return a concise pass/fail verdict with the main reason and the names of the files Gemini cited.`

Expected signals: `EXIT=0`, response names at least 3 of (`cli_reference.md`, `integration_patterns.md`, `gemini_tools.md`, `agent_delegation.md`) and `git status --porcelain` diff is empty.

Desired user-visible outcome: PASS verdict + a 3-5 line summary listing the cited reference files and their purposes.

#### Test Execution
> **Feature File:** [CG-010](04--agent-routing/010-context-agent-exploration.md)

### CG-011 | @review agent for cross-AI second opinion

#### Description

Confirm `As @review agent:` returns severity-classified findings for an intentionally flawed snippet without mutating the working tree.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator seeking a second opinion, dispatch the @review agent against the cli-gemini skill in this repository to review the small intentionally flawed Python snippet at /tmp/cg-011-snippet.py. Verify the agent returns at least one finding tagged with a severity classifier (P0/P1/P2 or critical/high/medium/low/warning/info) and the working tree is unchanged. Return a concise pass/fail verdict with the main reason and the highest-severity finding.`

Expected signals: `EXIT=0`, response contains at least one severity classifier, the obvious `eval` flaw is identified and the tripwire diff is empty.

Desired user-visible outcome: PASS verdict + the highest-severity finding line.

#### Test Execution
> **Feature File:** [CG-011](04--agent-routing/011-review-agent-second-opinion.md)

### CG-012 | @deep-research agent with web grounding

#### Description

Confirm `As @deep-research agent:` returns a citation-backed comparison and `google_web_search` is recorded in `.toolCalls`.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator delegating a fresh-evidence research task, dispatch the @deep-research agent against the cli-gemini skill in this repository to compare the current Bun and Deno runtime major versions. Verify the response includes at least two HTTPS source URLs and that the JSON toolCalls array records at least one google_web_search invocation. Return a concise pass/fail verdict with the main reason, the comparison answer, and the cited URLs.`

Expected signals: `EXIT=0`, `.toolCalls[].name` includes `google_web_search`, `.response` contains >= 2 distinct HTTPS URLs and the comparison names plausible current major versions for both Bun and Deno.

Desired user-visible outcome: PASS verdict + a 2-3 sentence comparison + the cited URLs.

#### Test Execution
> **Feature File:** [CG-012](04--agent-routing/012-deep-research-agent-grounding.md)

### CG-019 | @debug agent fresh-perspective root cause

#### Description

Verify `As @debug agent:` produces a ranked root-cause analysis with at least 2 root-cause hypotheses, at least 2 diagnostic next steps per hypothesis, and explicit acknowledgment of the prior-attempts context, AND the working tree remains unchanged.

#### Scenario Contract

Prompt: `Spec folder: /tmp/cg-019-sandbox (pre-approved, skip Gate 3). As a cross-AI orchestrator handing off a stuck bug after 3+ failed attempts, FIRST create /tmp/cg-019-snippet.py with a deliberate off-by-one bug, THEN dispatch gemini "As @debug agent: Investigate the off-by-one bug in @./tmp/cg-019-snippet.py. Prior attempts: verified loop bounds twice, checked input data type, confirmed environment. Provide ranked root-cause hypotheses with at least 2 diagnostic next steps each. Distinguish your analysis from the prior attempts." -m gemini-3.1-pro-preview -o text. Verify the response ranks at least 2 root-cause hypotheses, names at least 2 concrete diagnostic next steps per hypothesis, and explicitly distinguishes from the "already tried" set. Return a verdict naming the highest-ranked hypothesis and the diagnostic next-step count.`

Expected signals: dispatch exits 0, response ranks >= 2 hypotheses, each carries >= 2 diagnostic next steps, prior-attempts acknowledgment present, working tree mtime unchanged.

Desired user-visible outcome: PASS verdict plus the highest-ranked hypothesis and the diagnostic step count.

#### Test Execution
> **Feature File:** [CG-019](04--agent-routing/013-debug-agent-root-cause.md)

---

## 11. INTEGRATION PATTERNS

This category covers 3 scenario summaries while the linked feature files remain the canonical execution contract.

### CG-014 | Generate-review-fix cycle **(SANDBOXED)**

#### Description

Confirm two sequential Gemini calls (generate then fix) produce two distinct sandbox artifacts and the fix addresses the orchestrator-supplied review feedback.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator running the generate-review-fix pattern documented in cli-gemini integration_patterns.md, dispatch three sequential Gemini calls against the cli-gemini skill in this repository, all scoped to /tmp/cg-014-sandbox/. First call: generate a small Python module sum_list.py that sums a list of integers. Second call: use the orchestrator-supplied review note 'add explicit handling for empty list (return 0 instead of relying on sum() default)' to ask Gemini to update the same file. Verify the second-pass file differs from the first-pass file and contains explicit empty-list handling. Return a concise pass/fail verdict with the main reason, the diff line count, and a snippet of the empty-list handling.`

Expected signals: both calls exit 0, v1 and v2 sandbox artifacts both exist, `diff v1 v2` produces non-empty output and v2 contains an explicit empty-list check.

Desired user-visible outcome: PASS verdict + the diff line count + a 2-3 line snippet showing the empty-list handling.

#### Test Execution
> **Feature File:** [CG-014](06--integration-patterns/014-generate-review-fix-cycle.md)

### CG-015 | JSON output processing pipeline (jq)

#### Description

Confirm Gemini's `.response`-embedded JSON parses cleanly with `jq` and supports a downstream high-severity count.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator wiring Gemini into a release-gate, invoke Gemini CLI in JSON mode against the cli-gemini skill in this repository to analyse a small Python snippet at /tmp/cg-015-snippet.py. Ask Gemini to return its findings as a JSON array embedded in the response field (each finding has line, severity, description). Verify the orchestrator can parse the embedded JSON with jq and compute the count of severity == "high" findings. Return a concise pass/fail verdict with the main reason, the high-severity count, and the first high finding.`

Expected signals: `EXIT=0`, `.response` contains parseable embedded JSON with a `findings` array, the high-severity count is >= 1 and the first high finding has `line`, `severity`, `description` fields populated.

Desired user-visible outcome: PASS verdict + the high count + the first high finding's description.

#### Test Execution
> **Feature File:** [CG-015](06--integration-patterns/015-json-output-processing-pipeline.md)

### CG-016 | Background execution parallel dispatch

#### Description

Confirm two independent read-only Gemini calls run in parallel via shell backgrounding and both produce non-empty outputs after `wait`.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator running parallel reads, dispatch two independent read-only Gemini CLI calls against the cli-gemini skill in this repository: one summarising SKILL.md and one summarising references/cli_reference.md, both running in the background simultaneously. Verify both calls finish, both write to distinct output files, and the orchestrator can read both summaries after wait. Return a concise pass/fail verdict with the main reason and a one-line summary from each output file.`

Expected signals: both background processes exit 0 (`EXIT1=0` AND `EXIT2=0`), both output files exist and are non-empty after `wait` and first lines of both files are populated.

Desired user-visible outcome: PASS verdict + a one-line summary from each file.

#### Test Execution
> **Feature File:** [CG-016](06--integration-patterns/016-background-execution-parallel.md)

---

## 12. PROMPT TEMPLATES

This category covers 2 scenario summaries while the linked feature files remain the canonical execution contract.

### CG-017 | Prompt template substitution

#### Description

Confirm the Comprehensive Review template substitutes cleanly and Gemini covers >= 3 of the 5 documented review categories.

#### Scenario Contract

Prompt: `Apply the Comprehensive Review template to /tmp/cg-017-snippet.py and verify Gemini covers at least three documented review categories.`

Expected signals: `EXIT=0`, coverage count across the 5 categories is >= 3 and at least one finding includes a line reference and severity label.

Desired user-visible outcome: PASS verdict + the count of covered categories + a one-line example finding.

#### Test Execution
> **Feature File:** [CG-017](07--prompt-templates/017-template-substitution.md)

### CG-018 | CLEAR quality card application

#### Description

Confirm applying RCAF (per the documented framework map) produces an answer that honours the requested Format slot.

#### Scenario Contract

Prompt: `As a cross-AI orchestrator following cli-gemini's prompt-quality discipline, look up the documented framework for a Generation task in assets/prompt_quality_card.md §3 (expect RCAF). Build a single-prompt dispatch using all four RCAF components (Role, Context, Action, Format) and run the CLEAR 5-check before dispatch. Verify Gemini's answer follows the requested Format and addresses the Action without inventing scope. Return a concise pass/fail verdict with the main reason, the framework chosen, and a one-line check that the requested Format was honoured.`

Expected signals: `EXIT=0`, response is a JSON object with exactly the requested keys (`name`, `signature`, `purpose`) and each key has a non-empty value.

Desired user-visible outcome: PASS verdict + a one-line note such as `framework=RCAF; format honoured (JSON keys: name, signature, purpose)`.

#### Test Execution
> **Feature File:** [CG-018](07--prompt-templates/018-clear-quality-card-application.md)

---

## 13. AUTOMATED TEST CROSS-REFERENCE

cli-gemini ships no in-repo automated test suite for the Gemini CLI binary itself (the binary is a third-party Google product and is exercised live during scenario execution). The skill's automated coverage is limited to the smart-router pseudocode and the schema documented in `references/cli_reference.md`. Scenarios in this playbook are therefore the primary regression surface for cli-gemini's documented behaviour.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `references/cli_reference.md` (schema documentation) | Output format envelope, flag table, troubleshooting matrix | CG-001, CG-002, CG-003, CG-004, CG-005 |
| `references/gemini_tools.md` (tool catalog) | google_web_search, codebase_investigator, save_memory, `@` syntax | CG-006, CG-007, CG-008, CG-009 |
| `references/agent_delegation.md` (agent catalog) | All 6 documented agents and the routing table | CG-010, CG-011, CG-012, CG-013 |
| `references/integration_patterns.md` (cross-AI patterns) | Generate-review-fix, JSON processing, background execution | CG-014, CG-015, CG-016 |
| `assets/prompt_templates.md` + `assets/prompt_quality_card.md` | Template substitution, framework selection, CLEAR check | CG-017, CG-018 |

If automated tests for cli-gemini's smart-router pseudocode are added in a future spec, append the test module path here and map overlap to specific `CG-NNN` IDs.

---

## 14. FEATURE CATALOG CROSS-REFERENCE INDEX

### CLI INVOCATION

- CG-001: [Direct prompt with text output](01--cli-invocation/001-direct-prompt-text-output.md)
- CG-002: [JSON output mode](01--cli-invocation/002-json-output-mode.md)
- CG-003: [Explicit model selection](01--cli-invocation/003-explicit-model-selection.md)

### AUTO-APPROVE / YOLO

- CG-004: [YOLO flag with sandboxed file write **(DESTRUCTIVE)**](02--auto-approve-yolo/004-yolo-flag-sandboxed-write.md)
- CG-005: [Approval mode comparison (default vs never)](02--auto-approve-yolo/005-approval-mode-comparison.md)

### BUILT-IN TOOLS

- CG-006: [Google web search grounding](03--built-in-tools/006-google-web-search-grounding.md)
- CG-007: [Codebase investigator](03--built-in-tools/007-codebase-investigator.md)
- CG-008: [save_memory persistence **(DESTRUCTIVE, sandboxed `HOME`)**](03--built-in-tools/008-save-memory-persistence.md)
- CG-009: [File reference syntax (`@` prefix)](03--built-in-tools/009-file-reference-syntax.md)

### AGENT ROUTING

- CG-010: [@context agent for codebase exploration](04--agent-routing/010-context-agent-exploration.md)
- CG-011: [@review agent for cross-AI second opinion](04--agent-routing/011-review-agent-second-opinion.md)
- CG-012: [@deep-research agent with web grounding](04--agent-routing/012-deep-research-agent-grounding.md)
- CG-019: [@debug agent fresh-perspective root cause](04--agent-routing/013-debug-agent-root-cause.md)

### INTEGRATION PATTERNS

- CG-014: [Generate-review-fix cycle **(SANDBOXED)**](06--integration-patterns/014-generate-review-fix-cycle.md)
- CG-015: [JSON output processing pipeline (jq)](06--integration-patterns/015-json-output-processing-pipeline.md)
- CG-016: [Background execution parallel dispatch](06--integration-patterns/016-background-execution-parallel.md)

### PROMPT TEMPLATES

- CG-017: [Prompt template substitution](07--prompt-templates/017-template-substitution.md)
- CG-018: [CLEAR quality card application](07--prompt-templates/018-clear-quality-card-application.md)
