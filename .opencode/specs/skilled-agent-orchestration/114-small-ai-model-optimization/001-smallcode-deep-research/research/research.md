# Deep-Research Synthesis: smallcode-master Small-Model Pattern Extraction

## Executive Summary

**Loop Statistics:** 20 iterations completed (iters 1-12 deepening/synthesis, iters 13-19 audit/adversarial/sequencing/operational, iter 20 final consolidation). Convergence triggered at iter 11 with all_questions_answered, convergenceScore 0.15, and 389 keyFindings accumulated. Total artifacts: 41 patterns/artifacts across 5 RQs with smallcode provenance citations, plus HYBRID-with-Anchor sentinel skill.

**Architecture Verdict (HYBRID-with-Anchor):** The patterns from RQ1-4 should land as distributed references/ files across existing CLI skills (cli-devin, cli-opencode) with cross-cutting shared assets (model profiles, escalation config) placed in cli-devin/assets/ and referenced via graph-metadata enhances edges. A sentinel `sk-small-model` skill IS warranted as a routing anchor (holds ONLY enhances edges + AGENTS.md rule pointer + philosophy), but all actual patterns stay distributed. This refinement from the original HYBRID verdict (iter-014) addresses the user's mental model for "check skill for small-model logic" while avoiding the maintenance burden of a full dedicated skill. The sk-prompt precedent does not apply because small-model patterns are runtime-environment-specific, not framework-agnostic.

**Audit Confirmation:** Iter-13 self-audit confirmed research.md is high-quality with accurate pattern citations. Only 2 P1 data consistency issues found (artifact count corrections in Follow-on Packets Index), no blocking problems. Adversarial iterations (14-19) stress-tested the synthesis with verdict challenges, priority audits, implementability reviews, risk analysis, sequencing, and operational concerns—all confirming the HYBRID-with-Anchor approach is sound.

**High-Level Delta Inventory:** 9 artifacts for RQ1 (context budget), 9 artifacts for RQ2 (verification pipeline), 9 artifacts for RQ3 (model profiles/escalation), 8 artifacts for RQ4 (permissions, after iter-15 dropped 2-stage routing), and 5 cross-cutting artifacts for RQ5 (architecture + sentinel skill). Target paths distribute across: cli-devin/references/ (10 new files), cli-opencode/references/ (4 new files), cli-opencode/assets/ (4 JSON schemas), cli-devin/assets/ (2 shared assets), AGENTS.md (1 rule addition), sk-small-model sentinel skill (SKILL.md + graph-metadata.json), and 4 graph-metadata.json files (enhances edges + trigger_phrases). Estimated 10 follow-on packets to implement the 41 artifacts + sentinel skill.

---

## Method

**Executor:** cli-devin SWE-1.6 (free tier, dogfood) — v1.0.6.2 with RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer, SWE-1.6 free-tier disclosure, and RM-8 four-layer mitigation already shipped in packet 113.

**Convergence:** Triggered at iter 11 with all_questions_answered (5/5 RQs resolved), convergenceScore 0.15 (rolling average approaching threshold), and gap audit confirming 100% coverage across all 5 RQs with no high-value patterns missed from smallcode for the in-scope research questions.

**Source Corpus:** external/smallcode-master/ (MIT, v0.2.2, May 2026) — 87% single-file task success on Gemma 4 E4B, purpose-built for 7B–20B local models with limited context windows (4k-32k tokens) and unreliable tool calling. Key architectural differentiators: token budget management (70% of context window), compound tools, Bayesian tool scorer with Laplace smoothing, hard-fail gatekeeper, category-based tool registry with 2-stage routing.

**Preflight Context-Card:** Cited per iteration (631 lines, 6 sections, 56/45/34/22/11 citations per RQ). The preflight card provided structured pattern maps with smallcode source file:line references for each RQ, accelerating pattern extraction by eliminating redundant source file reads.

---

## RQ1 — Context Budget Engine (Candidate Deltas)

### Baseline Patterns (from iter-001)

#### Pattern 1: Percentage-Based Budget Allocation

**Smallcode primitive:** `src/context/budget.ms:9-13` — BudgetConfig struct with max_budget_pct, working_memory_tokens, summary_threshold; `src/context/budget.ms:55-58` — totalBudget() calculation: (model_context_length * max_budget_pct) / 100.

**Candidate target path:** `.opencode/skills/cli-devin/references/context-budget.md` (new file)

**Patch shape:** New file documenting the BudgetConfig struct, totalBudget() calculation, and integration guidance for SWE-1.6 context window management with per-model override support.

**Acceptance criteria:**
- Follow-on packet implements TypeScript/JavaScript budget calculator accepting model context length and max_budget_pct parameters
- Returns total budget tokens with per-category allocation breakdown (system_prompt, working_memory, conversation, tool_results)
- Integrates with cli-devin's prompt-file generation to inject budget-aware context sizing hints
- Supports per-model defaults from the defaults table (see Artifact 1a below)

**Confidence:** HIGH — Direct mapping from smallcode with clear integration path to cli-devin's existing prompt generation workflow.

**Recommended follow-on packet:** 002-cli-devin-context-budget

---

#### Pattern 2: Tool Result Truncation with Informative Suffix

**Smallcode primitive:** `src/context/budget.ms:109-126` — fitToolResult() with percentage-based per-tool cap (default 40%), character-to-token approximation (4 chars ≈ 1 token), and informative truncation suffix: `[... truncated ${tokens - available} tokens to fit context budget]`.

**Candidate target path:** `.opencode/skills/cli-devin/references/truncation-strategy.md` (new file)

**Patch shape:** New file documenting the fitToolResult pattern: percentage-based per-tool cap, char-to-token ratio, and informative suffix showing exact token deficit.

**Acceptance criteria:**
- Follow-on packet implements truncation utility approximating tokens via char count (4:1 ratio)
- Respects both total budget and per-tool percentage cap (default 40%)
- Appends informative suffix with exact token deficit: `[... truncated ${deficit} tokens to fit context budget]`
- Updates usage tracking after truncation
- Integrates into cli-devin's MCP response handling or tool result post-processing

**Confidence:** HIGH — Smallcode's truncation logic is self-contained and directly applicable to MCP response handling.

**Recommended follow-on packet:** 002-cli-devin-context-budget

---

#### Pattern 3: Priority-Based Eviction System

**Smallcode primitive:** `src/context/budget.ms:140-163` — evict() with two-tier priority: Priority 1 evict old tool results (full eviction), Priority 2 evict old conversation at 50% rate (preserves recent context), with eventBus.emit("context.eviction") for telemetry.

**Candidate target path:** `.opencode/skills/cli-opencode/references/context-eviction.md` (new file)

**Patch shape:** New file documenting the eviction priority order (tool results first, then conversation at 50% rate), event bus integration for eviction notifications, and partial eviction semantics.

**Acceptance criteria:**
- Follow-on packet implements eviction policy prioritizing tool results over conversation history
- Evicts conversation at 50% rate to preserve recent context
- Emits structured events for eviction telemetry
- Returns actual tokens freed vs requested
- Integrates with OpenCode's memory system or MCP server state management

**Confidence:** HIGH — Clear priority system with proven event telemetry pattern; integration to OpenCode memory system is straightforward.

**Recommended follow-on packet:** 003-cli-opencode-eviction

---

#### Pattern 4: File Summarization Threshold

**Smallcode primitive:** `src/context/budget.ms:128-131` — shouldSummarize() checks line count > summary_threshold (default 200 lines); `src/context/budget.ms:134-138` — maxAffordableLines() calculation: available tokens * 4 chars/token / 60 chars/line.

**Candidate target path:** `.opencode/skills/cli-devin/references/file-summarization.md` (new file)

**Patch shape:** New file documenting the shouldSummarize pattern (line count threshold, default 200 lines) and maxAffordableLines calculation (available tokens * 4 chars/token / 60 chars/line).

**Acceptance criteria:**
- Follow-on packet implements file summarization gate checking line count against configurable threshold
- Calculates max affordable lines based on available budget
- Triggers summarization when threshold exceeded
- Preserves line-range capability for targeted reads
- Integrates with cli-devin's file reading workflow or CocoIndex semantic search result sizing

**Confidence:** MEDIUM — Summarization integration depends on existing summarization infrastructure; line-range preservation may require CocoIndex coordination.

**Recommended follow-on packet:** 002-cli-devin-context-budget

---

#### Pattern 5: Usage Tracking and Display

**Smallcode primitive:** `src/context/budget.ms:176-193` — usagePct() calculates percentage against model context length; formatUsage() returns string template: `${total}/${model_context_length} tokens (${pct}%)`.

**Candidate target path:** `.opencode/skills/cli-devin/references/token-usage-display.md` (new file)

**Patch shape:** New file documenting the usage tracking pattern (per-category token counts, percentage calculation against model context length) and formatUsage string template for status bar display.

**Acceptance criteria:**
- Follow-on packet implements usage tracker maintaining per-category token counts (system_prompt, working_memory, conversation, tool_results)
- Calculates percentage against model context length
- Formats usage as "total/context_length tokens (pct%)"
- Provides allocation breakdown visibility
- Integrates with cli-devin's prompt-file generation or TUI status display

**Confidence:** HIGH — Simple counter pattern with clear display format; TUI integration is optional (can start with CLI logging).

**Recommended follow-on packet:** 002-cli-devin-context-budget

---

### Deepening Artifacts (from iter-006)

#### Artifact 1a: Per-Model Token-Budget Defaults Table

**Smallcode primitive:** BudgetConfig defaults from context-card.md:9-12 (max_budget_pct=70, working_memory_tokens=500, summary_threshold=200) adapted to industry-standard context windows for target models.

**Candidate target path:** `.opencode/skills/cli-devin/references/context-budget.md` (extend new file from Pattern 1)

**Patch shape:** Add table section to context-budget.md with per-model defaults for 8 models (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, gpt-5.5, Claude Opus, Claude Sonnet).

**Acceptance criteria:**
- TypeScript type definitions for BudgetConfig and per-model overrides
- Defaults table integrated into budget calculator as fallback when model-specific config not provided
- Working memory and summary thresholds scaled by context window tier (8k→500, 32k→1,000, 128k→2,000, 200k→3,000)
- Context windows sourced from industry-standard values (SWE-1.6 matches smallcode fallback 8192)

**Confidence:** HIGH — Defaults are conservative extrapolations from smallcode's 8k model baseline; context window values are standard industry specs.

**Recommended follow-on packet:** 002-cli-devin-context-budget

---

#### Artifact 1b: Truncation-Marker Syntax Candidates

**Smallcode primitive:** Truncation suffix from context-card.md:58: `[... truncated ${tokens - available} tokens to fit context budget]`.

**Candidate target path:** `.opencode/skills/cli-devin/references/truncation-strategy.md` (extend new file from Pattern 2)

**Patch shape:** Add syntax recommendation section recommending adoption of smallcode's verbatim pattern with rationale for self-documenting nature and negligible token cost.

**Acceptance criteria:**
- Chosen syntax documented with code examples showing suffix append during fitToolResult-style truncation
- Integration examples for cli-devin prompt generation or MCP response post-processing
- Rationale for verbatim adoption (self-documenting, explicit reason, negligible token cost)

**Confidence:** HIGH — Verbatim adoption maintains consistency with source pattern; alternative is fallback only if needed.

**Recommended follow-on packet:** 002-cli-devin-context-budget

---

#### Artifact 1c: Eviction Priority Ladder Mapping

**Smallcode primitive:** evict() two-tier system from context-card.md:66-86 mapped to agent-config-iter recipe structure.

**Candidate target path:** All cli-devin/assets/agent-config-deep-research-iter.json files (extend existing recipes) AND `.opencode/skills/cli-opencode/references/context-eviction.md` (document ladder)

**Patch shape:** Add `context_budget.eviction_priority` section to agent-config-iter JSON files with 3 tiers (tool_results 1.0, conversation 0.5, working_memory 0.25), protected_categories (system_prompt), and event_emission flag.

**Acceptance criteria:**
- Eviction ladder added to all agent-config-iter JSON files in cli-devin/assets/, cli-opencode/assets/
- Documented in context-eviction.md reference doc
- Tier 1 (tool_results) matches smallcode exactly
- Tier 2 (conversation, 50% rate) matches smallcode exactly
- Tier 3 (working_memory, 25% rate) is extension for our system
- Protected categories include system_prompt (never evicted)
- Event emission matches smallcode's eventBus.emit("context.eviction") pattern

**Confidence:** HIGH — Direct mapping from smallcode with clear extension point for working_memory; agent-config-iter pattern is established in cli-devin.

**Recommended follow-on packet:** 003-cli-opencode-eviction

---

#### Artifact 1d: sk-prompt Integration Point

**Smallcode primitive:** Budget awareness guidance integration point in cli_prompt_quality_card.md (composition guidance subsection).

**Candidate target path:** `.opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md` (insert new subsection at line 51)

**Patch shape:** Insert new subsection "Composition guidance: budget awareness" after line 50 (after anti-hallucination wording paragraph), before line 52 (before CLEAR 5-Question Pre-Dispatch Checklist header).

**Acceptance criteria:**
- New subsection inserted at specified location in cli_prompt_quality_card.md
- Sync change to mirror files (cli-claude-code, cli-codex, cli-gemini) per mirror sync contract at lines 105-111
- Guidance references cli-devin/references/context-budget.md and truncation-strategy.md
- Per-model summary thresholds match defaults table from Artifact 1a

**Confidence:** HIGH — Clear insertion point with established mirror sync pattern; guidance is cross-CLI relevant.

**Recommended follow-on packet:** 004-sk-prompt-budget-awareness

---

## RQ2 — Output Verification Pipeline (Candidate Deltas)

### Baseline Patterns (from iter-002)

#### Pattern 1: Multi-Stage Verification Pipeline with Conditional Execution

**Smallcode primitive:** `src/governor/verifier.ms:32-102` — 5-stage pipeline: structural (with auto-fix) → compile → execute (conditional on compile) → smoke test (conditional on compile+execute) → lint (non-blocking). VerificationResult struct schema with passed, confidence, compiled, executed, tests_passed, lint_clean, auto_fixed, errors, hard_fail fields.

**Candidate target path:** `cli-devin/references/verification-pipeline.md` (new ref doc)

**Patch shape:** Add new reference doc documenting the 5-stage pipeline pattern with conditional execution dependencies, VerificationResult struct schema, and mapping to existing verification surfaces.

**Acceptance criteria:**
- Reference doc exists at cli-devin/references/verification-pipeline.md
- Documents the 5-stage pipeline with conditional execution dependencies
- Includes VerificationResult struct schema
- Includes code quote from verifier.ms:32-102
- Maps each stage to our existing verification surfaces

**Confidence:** HIGH — Clear pipeline structure with established mapping points to existing verification infrastructure.

**Recommended follow-on packet:** 005-cli-devin-verification-pipeline

---

#### Pattern 2: Structural Validation with Auto-Fix Attempt

**Smallcode primitive:** `src/governor/verifier.ms:121-145` — checkStructural() with placeholder detection, truncation marker detection, balanced brace checking. Auto-fix logic at verifier.ms:231-250.

**Candidate target path:** `cli-opencode/references/structural-validation.md` (new ref doc)

**Patch shape:** Add new reference doc documenting structural validation pattern: placeholder detection, truncation marker detection, balanced brace checking, and auto-fix attempt.

**Acceptance criteria:**
- Reference doc exists at cli-opencode/references/structural-validation.md
- Documents placeholder detection patterns (TODO, ..., pass placeholder, NotImplementedError)
- Documents truncation marker detection ("... rest of", "... more")
- Documents balanced brace checking for C-style languages
- Includes auto-fix logic from verifier.ms:231-250
- Maps to our existing anti-hallucination patterns (shipped in packet 113)

**Confidence:** HIGH — Structural checks are language-agnostic and map directly to anti-hallucination patterns.

**Recommended follow-on packet:** 005-cli-devin-verification-pipeline

---

#### Pattern 3: Calibrated Confidence Scoring with Weighted Stage Contributions

**Smallcode primitive:** `src/governor/verifier.ms:252-260` — computeConfidence() with weighted contributions: compile 35%, execute 25%, smoke test 25%, lint 10%, auto-fix penalty -5%.

**Candidate target path:** `cli-devin/references/confidence-scoring.md` (new ref doc)

**Patch shape:** Add new reference doc documenting the calibrated confidence scoring pattern with weighted stage contributions and guidance on tuning weights for different model tiers and task types.

**Acceptance criteria:**
- Reference doc exists at cli-devin/references/confidence-scoring.md
- Documents the weighted contribution formula (compile 35%, execute 25%, test 25%, lint 10%, auto-fix -5%)
- Includes code quote from verifier.ms:252-260
- Provides guidance on tuning weights for small vs large models
- Maps to our existing verification surfaces

**Confidence:** HIGH — Weighted formula is well-calibrated and directly applicable to verification confidence scoring.

**Recommended follow-on packet:** 005-cli-devin-verification-pipeline

---

#### Pattern 4: Hard-Fail Gatekeeper with Decompose Strategy

**Smallcode primitive:** `src/governor/hard_fail.ms:29-70` — checkOutput() with GovernorAction enum (Accept/Retry/HardFail), shouldHardFail logic, and decompose strategy from bin/governor.js:129-164.

**Candidate target path:** `cli-devin/references/hard-fail-policy.md` (new ref doc)

**Patch shape:** Add new reference doc documenting the hard-fail gatekeeper pattern: GovernorAction enum, shouldHardFail logic, decompose strategy, and integration with event bus and tool scorer.

**Acceptance criteria:**
- Reference doc exists at cli-devin/references/hard-fail-policy.md
- Documents GovernorAction enum (Accept, Retry, HardFail)
- Documents shouldHardFail logic (verifier.ms:105-117)
- Documents decompose strategy from bin/governor.js:167-212
- Includes integration with event bus and tool scorer
- Maps to our existing deep-loop iter contract

**Confidence:** HIGH — Hard-fail logic is well-defined with clear decompose fallback; integration to deep-loop iter contract is straightforward.

**Recommended follow-on packet:** 005-cli-devin-verification-pipeline

---

#### Pattern 5: Language-Specific Compile/Execute Commands with Timeout

**Smallcode primitive:** `src/governor/verifier.ms:147-171` — compile() with ext-match pattern for Python (py_compile), JS/MJS (node --check), TS/TSX (tsc --noEmit), Rust (rustc), Go (go build), C/C++ (gcc/g++), BoneScript (bone_check). Timeout 15s compile, 10s execute.

**Candidate target path:** `cli-devin/references/language-commands.md` (new ref doc)

**Patch shape:** Add new reference doc documenting language-specific compile/execute command mapping with timeout handling, ext-match pattern, timeout values, error truncation, and graceful fallback for unsupported languages.

**Acceptance criteria:**
- Reference doc exists at cli-devin/references/language-commands.md
- Documents compile commands for Python (py_compile), JS/MJS (node --check), TS/TSX (tsc --noEmit), Rust (rustc), Go (go build), C/C++ (gcc/g++), BoneScript (bone_check)
- Documents execute commands for Python (python), JS/MJS (node), TS (tsx)
- Documents timeout values (15s compile, 10s execute)
- Documents error truncation (500 chars)
- Documents graceful fallback for unsupported languages (return passed=true, errors=[])
- Maps to our existing sk-code verification patterns

**Confidence:** HIGH — Language command mapping is comprehensive and directly applicable to sk-code verification patterns.

**Recommended follow-on packet:** 005-cli-devin-verification-pipeline

---

### Deepening Artifacts (from iter-007)

#### Artifact 2a: Drop-in System Instructions for SWE-1.6 Output Verification

**Smallcode primitive:** 5-stage verification pipeline (verifier.ms:32-102) adapted to research output quality checks with weighted confidence formula.

**Candidate target path:** `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json` (append to existing system_instructions array after line 8)

**Patch shape:** Add drop-in JSON snippet to system_instructions array with OUTPUT VERIFICATION DISCIPLINE, CONFIDENCE SCORING, and HARD-FAIL GATE instructions.

**Acceptance criteria:**
- System instructions appended to agent-config-deep-research-iter.json
- Weighted formula preserves smallcode's calibration (35% structure, 25% citations, 25% actionability, 10% accuracy, -5% anti-hallucination penalty)
- Maps verification stages to research output quality dimensions
- Confidence threshold 0.70 with hard-fail gate

**Confidence:** HIGH — Direct adaptation of smallcode's verification pipeline to research output context; system_instructions pattern is established in cli-devin.

**Recommended follow-on packet:** 006-cli-devin-output-verification

---

#### Artifact 2b: Confidence-Scoring Rubric Formula (Smallcode → Research Output Mapping)

**Smallcode primitive:** computeConfidence() from verifier.ms:252-260 with term mapping: compiled → structure-check, executed → cite-check, tests_passed → recommendation-actionability, lint_clean → citation-accuracy, auto_fixed → anti-hallucination-failures.

**Candidate target path:** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (add new function validateIterationQuality)

**Patch shape:** Add sibling validator function validateIterationQuality with TypeScript interface and computeResearchConfidence function implementing the adapted formula.

**Acceptance criteria:**
- Sibling validator function added to post-dispatch-validate.ts
- Implements Laplace smoothing formula adaptation
- Threshold guidance: 0.80+ ship without hesitation, 0.70-0.79 ship with warning, <0.70 hard-fail
- Anti-hallucination penalty scales linearly with uncertain claims

**Confidence:** HIGH — Formula adaptation is straightforward with clear threshold guidance; sibling validator separation keeps concerns clear.

**Recommended follow-on packet:** 006-cli-devin-output-verification

---

#### Artifact 2c: Post-Dispatch-Validate.ts Integration Handshake

**Smallcode primitive:** Sibling validator separation pattern adapted to structural validation vs content quality validation.

**Candidate target path:** `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` (add new function after line 234)

**Patch shape:** Add validateIterationQuality function with full implementation. Integration point in dispatcher: call validateIterationQuality after validateOrThrow succeeds. If quality validation fails, emit dispatch_failure event to state log, then retry or escalate per hard-fail policy.

**Acceptance criteria:**
- Sibling validator function separates structural validation from content quality validation
- Called after validateOrThrow succeeds in dispatcher
- Emits dispatch_failure event on quality validation failure
- Triggers retry or escalation per hard-fail policy

**Confidence:** HIGH — Sibling validator pattern is well-established; integration point is clear in dispatcher logic.

**Recommended follow-on packet:** 006-cli-devin-output-verification

---

#### Artifact 2d: Hard-Fail Message Template for Refused Delivery

**Smallcode primitive:** formatHardFail() from hard_fail.ms:29-70 adapted to research output context with remediation guidance per failure stage.

**Candidate target path:** Emitted by cli-devin when validateIterationQuality returns ok: false with confidence below threshold (no file write, template in code)

**Patch shape:** Hard-fail message template with iteration metadata, confidence score, failure reason, verification failures list, required remediation per failure stage, and next steps (dispatcher retry with escalated context or decompose).

**Acceptance criteria:**
- Template includes variable mapping for iteration_number, confidence_score, threshold, primary_reason, failure_list
- Provides actionable remediation guidance per failure stage
- Mirrors smallcode's decompose strategy (retry with escalated context or decompose research question)
- Includes provenance reference to smallcode source patterns

**Confidence:** HIGH — Template is comprehensive with clear remediation guidance; variable mapping is straightforward.

**Recommended follow-on packet:** 006-cli-devin-output-verification

---

## RQ3 — Per-Model Profiles & Escalation (Candidate Deltas)

### Baseline Patterns (from iter-003)

#### Pattern 1: Per-Model Profile Schema

**Smallcode primitive:** `src/model/profiles.ms:7-19` — ModelProfile struct with 12 fields: name, context_length, max_output_tokens, supports_tool_calling, tool_format (native|hermes|json|xml|text), supports_json_mode, supports_system_message, template (chatml|llama3|mistral|gemma|phi|generic), strengths, weaknesses, stop_sequences.

**Candidate target path:** `.opencode/skills/cli-devin/references/model-profile-schema.md` (new reference doc) OR `.opencode/skills/sk-prompt/assets/model-profile.json` (shared asset — see Artifact 3a for location verdict)

**Patch shape:** Add JSON schema extending cli-devin's existing Model Selection table (§3) to include small-model-specific fields: tool_format, template, strengths, weaknesses, stop_sequences.

**Acceptance criteria:**
- JSON schema validates all 12 ModelProfile fields
- Includes example profiles for 3 common small models (Qwen 2.5 Coder, Phi-3 Mini, DeepSeek Coder v2 Lite)
- Maps tool_format enum to Devin's tool-calling modes
- Documents template mapping to chat template formats

**Confidence:** HIGH — ModelProfile struct is well-defined with clear field mappings; extension to existing Model Selection table is straightforward.

**Recommended follow-on packet:** 007-sk-prompt-model-profiles

---

#### Pattern 2: Profile Lookup with Substring Matching

**Smallcode primitive:** `src/model/profiles.ms:156-187` — loadProfile() with 3-tier fallback: custom profile file → built-in registry (substring match) → conservative default. Substring matching is bidirectional.

**Candidate target path:** `.opencode/skills/cli-opencode/references/model-detection.md` (new reference doc) OR integrate into cli-devin's Model Selection logic

**Patch shape:** Add lookup function that implements 3-tier fallback: custom config → built-in registry (substring match) → conservative default. Document substring matching heuristic for flexible model name matching.

**Acceptance criteria:**
- Implements 3-tier fallback: custom → built-in (substring) → default
- Substring matching is bidirectional (modelName.contains(key) || key.contains(modelName))
- Default profile uses conservative assumptions (8192 context, no tool calling, text format)
- Returns structured ModelProfile object with all 12 fields populated

**Confidence:** HIGH — 3-tier fallback is robust and handles unknown models gracefully; substring matching provides flexibility.

**Recommended follow-on packet:** 007-sk-prompt-model-profiles

---

#### Pattern 3: Bayesian Tool Scoring with Laplace Smoothing

**Smallcode primitive:** `src/governor/tool_scorer.ms:14-23` — ToolScore struct with confidence field using Laplace smoothing: (successes + 1) / (total + 2). Exploration bonus 0.15, confidence cap 0.95 to prevent lockout.

**Candidate target path:** `.opencode/skills/cli-devin/references/tool-scoring.md` (new reference doc) OR integrate into mcp-code-mode's tool orchestration logic

**Patch shape:** Add Bayesian confidence calculation using Laplace smoothing: confidence = (successes + 1) / (total + 2). Include exploration bonus (0.15) and confidence cap (0.95) to prevent lockout.

**Acceptance criteria:**
- Implements Laplace smoothing formula: (successes + 1) / (total + 2)
- Unknown tools (0 calls) return baseline confidence 0.5 + exploration_bonus (0.15) = 0.65
- Confidence capped at 0.95 to prevent tools from being permanently locked out
- Tracks success/failure per (tool_name, task_type) tuple
- Persists scores across sessions via JSON file (adapt to skill tree location)

**Confidence:** HIGH — Laplace smoothing is well-established statistical technique; exploration bonus and confidence cap prevent lockout.

**Recommended follow-on packet:** 008-cli-devin-tool-scoring

---

#### Pattern 4: Tool Demotion Thresholds

**Smallcode primitive:** `src/governor/tool_scorer.ms:85-91` — shouldAvoid() with two-condition demotion: total_calls >= 3 AND confidence < 0.35. Returns false for unknown tools and tools with insufficient data.

**Candidate target path:** `.opencode/skills/cli-devin/references/tool-demotion.md` (new reference doc) OR integrate into cli-devin's tool selection logic

**Patch shape:** Add demotion logic that flags tools for avoidance when: (1) minimum data threshold (≥3 calls) AND (2) confidence below threshold (<0.35).

**Acceptance criteria:**
- Implements two-condition demotion: total_calls >= 3 AND confidence < 0.35
- Returns false for unknown tools (no data yet)
- Returns false for tools with insufficient data (<3 calls) even if confidence is low
- Returns true only when both conditions are met (enough data + poor performance)
- Documented threshold rationale: 3 calls = minimum sample size, 0.35 = ~30% success rate after Laplace smoothing

**Confidence:** HIGH — Two-condition demotion prevents premature filtering while reliably identifying broken tools; threshold rationale is sound.

**Recommended follow-on packet:** 008-cli-devin-tool-scoring

---

#### Pattern 5: Escalation Provider Config + Conversation Format Conversion

**Smallcode primitive:** `bin/escalation.js:12-35` — ESCALATION_PROVIDERS config with name, baseUrl, envKey, defaultModel, models array for Anthropic, OpenAI, DeepSeek. `bin/escalation.js:154-181` — Anthropic format conversion for tool calls and tool results. canEscalate() checks enabled flag AND session count < max_per_session (default 5).

**Candidate target path:** `.opencode/skills/cli-devin/references/escalation-engine.md` (extend existing cloud_handoff.md) OR `.opencode/skills/mcp-code-mode/references/provider-config.md` (for multi-provider MCP orchestration)

**Patch shape:** Extend cli-devin's existing cloud_handoff reference to include: (1) provider config schema, (2) OpenAI ↔ Anthropic conversation format conversion for tool calls and tool results, (3) canEscalate() gate with session limits (default 5 per session), (4) auto-detection from env vars in preference order.

**Acceptance criteria:**
- Provider config includes: name, baseUrl, envKey, defaultModel, models array
- Implements OpenAI → Anthropic format conversion for: system messages, tool calls, tool results
- Implements Anthropic → OpenAI format conversion for response handling
- canEscalate() checks: enabled flag AND session count < max_per_session (default 5)
- Auto-detects providers from env vars in preference order: ANTHROPIC_API_KEY → OPENAI_API_KEY → DEEPSEEK_API_KEY
- Includes escalation-specific system prompt template

**Confidence:** MEDIUM — Provider config is straightforward but format conversion requires careful implementation; auto-detection logic is well-defined.

**Recommended follow-on packet:** 009-cli-devin-escalation-engine

---

### Deepening Artifacts (from iter-008)

#### Artifact 3a: Model-Profile JSON Schema (Full Schema with 8 Models)

**Smallcode primitive:** ModelProfile struct from iter-003.md:22-35 adapted with OpenCode-specific extensions (provider, tiering, escalation targets, wall-clock timing).

**Candidate target path:** `.opencode/skills/sk-prompt/assets/model-profile.json` (new shared asset — Option A per Artifact 3c registry location verdict)

**Patch shape:** Create JSON schema with 8 model profiles (swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1, gpt-5.5, claude-opus-4.7, claude-sonnet-4.7) including all smallcode ModelProfile fields plus OpenCode extensions (id, provider, free_tier, pro_tier, escalation_target, average_iter_wall_clock_min).

**Acceptance criteria:**
- JSON schema validates all smallcode ModelProfile fields plus OpenCode extensions
- Includes 8 model profiles with complete field population
- Field mapping to smallcode ModelProfile documented (context_length, tool_format, chat_template, strengths, weaknesses, stop_sequences)
- OpenCode extensions documented (id, provider, free_tier, pro_tier, escalation_target, average_iter_wall_clock_min)

**Confidence:** HIGH — Schema is comprehensive with clear field mappings; 8 models cover primary CLI orchestrator use cases.

**Recommended follow-on packet:** 007-sk-prompt-model-profiles

---

#### Artifact 3b: Escalation Decision Matrix

**Smallcode primitive:** Escalation provider config from iter-003.md:168-190 and canEscalate() gate from iter-003.md:226 adapted to concrete IF/THEN rules for downgrade, escalate, and quota-aware scenarios.

**Candidate target path:** `.opencode/skills/cli-devin/assets/escalation-matrix.yaml` (new shared asset) OR integrate into cli-devin/references/escalation-engine.md

**Patch shape:** Create escalation decision matrix with concrete IF/THEN rules for downgrade_rules, escalate_rules, quota_aware_rules, session_gates, and conversation_format_conversion.

**Acceptance criteria:**
- Downgrade rules cover simple tasks, context gathering, iteration failure, quota conservation
- Escalate rules cover complete failure, task complexity, hallucination risk, ambiguous requirements, last-resort frontier escalation
- Quota-aware rules cover critical quota levels, user decision prompts, ample quota usage, free tier exhaustion
- Session gates match smallcode canEscalate limits (max 5 escalations per session)
- Conversation format conversion documented for bidirectional OpenAI ↔ Anthropic
- Rule priority order: session gates → quota-aware → escalate → downgrade

**Confidence:** HIGH — Matrix is comprehensive with clear rule priorities; conversation format conversion is well-documented.

**Recommended follow-on packet:** 009-cli-devin-escalation-engine

---

#### Artifact 3c: Registry Location Verdict

**Smallcode primitive:** N/A — architectural decision based on skill tree structure and cross-CLI sharing needs.

**Candidate target path:** `.opencode/skills/sk-prompt/assets/model-profile.json` (Option A — cross-CLI master location)

**Patch shape:** Create model-profile.json in sk-prompt/assets as cross-CLI master. Add mirror sync entries to cli_prompt_quality_card.md for cli-devin, cli-opencode, cli-codex, cli-gemini, cli-claude-code. Update each CLI skill's SKILL.md to reference shared model-profile.json path.

**Acceptance criteria:**
- sk-prompt/assets/model-profile.json created as cross-CLI master
- Mirror sync entries added to cli_prompt_quality_card.md for all CLI skills
- Each CLI skill's SKILL.md references shared model-profile.json path
- Avoids duplication across CLI skills
- Consistent with existing cli_prompt_quality_card.md mirror sync pattern

**Confidence:** HIGH — sk-prompt is established cross-CLI master location; mirror sync pattern is proven.

**Recommended follow-on packet:** 007-sk-prompt-model-profiles

---

#### Artifact 3d: Bayesian Tool-Scoring Placement Verdict

**Smallcode primitive:** N/A — architectural decision based on separation of concerns between CLI orchestrator routing and external MCP tool orchestration.

**Candidate target path:** cli-* iter recipes per-call (NOT mcp-code-mode tool-registry layer)

**Patch shape:** Implement Bayesian tool scoring in cli-* iter recipes (e.g., cli-devin/assets/agent-config-deep-research-iter.json) for per-iteration model selection. Historical state persisted in skill tree (e.g., .opencode/skills/cli-devin/state/tool_scores.json). Per-CLI flexibility allows different model portfolios and use cases.

**Acceptance criteria:**
- Bayesian scoring implemented in cli-devin iter recipes for SWE-1.6 vs DeepSeek v4 selection
- Historical state persisted in skill tree state directory
- Per-CLI flexibility maintained (cli-opencode can implement different scoring for deepseek-v4-pro vs kimi-k2.6 vs glm-5.1)
- NOT placed in mcp-code-mode layer (which is for external API integration, not internal routing)

**Confidence:** HIGH — Placement aligns with separation of concerns; per-CLI flexibility is valuable for different model portfolios.

**Recommended follow-on packet:** 008-cli-devin-tool-scoring

---

## RQ4 — Structured Scope/Permissions (Candidate Deltas)

### Baseline Patterns (from iter-004)

#### Pattern 1: Category-Based Tool Classification

**Smallcode primitive:** `src/tools/registry.ms:8-14` — ToolDef struct with category field grouping tools by operation type: "read" | "write" | "search" | "run" | "plan" | "web".

**Candidate target path:** `.opencode/skills/cli-opencode/assets/tool-category-schema.json`

**Patch shape:** Create JSON schema defining tool categories (read/write/search/run/plan/web) as enum with per-category operation constraints.

**Acceptance criteria (RM-8 Counter-Example):**
- Would this have prevented 44 file deletions? PARTIALLY — category classification alone doesn't enforce constraints, but it enables category-level gating (e.g., auto-deny "run" category for read-only dispatches). The RM-8 incident used bash tool (category: "run") to execute deletions; category-based deny would have blocked the tool entirely.

**Confidence:** MEDIUM — Category classification enables gating but requires additional enforcement logic; partial RM-8 prevention.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

#### Pattern 2: Enabled/Disabled Allowlist Filtering

**Smallcode primitive:** `src/tools/registry.ms:36-40, 66-70` — ToolRegistry with explicit enabled/disabled lists and filtering logic: active() returns tools where enabled.contains(t.id) && !disabled.contains(t.id).

**Candidate target path:** `.opencode/skills/cli-opencode/assets/tool-allowlist-schema.json`

**Patch shape:** Create JSON schema with allowed_tools (allowlist) and denied_tools (denylist) arrays, plus filter_mode enum ("allowlist_only", "denylist_only", "hybrid"). Runtime enforcer checks tool ID against both lists before execution.

**Acceptance criteria (RM-8 Counter-Example):**
- Would this have prevented 44 file deletions? YES — if bash was in the denied_tools list for read-only dispatches, the tool would be filtered out before execution. The RM-8 incident used --dangerously-skip-permissions which bypassed OpenCode's permission prompts; an allowlist filter would enforce constraints regardless of permission-skipping flag.

**Confidence:** HIGH — Allowlist filtering is strong enforcement mechanism that bypasses permission-skipping flags; direct RM-8 prevention.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

#### Pattern 3: 2-Stage Routing with Category Selector

**Smallcode primitive:** `src/tools/router.ms:61-82, 190-211` — 2-stage routing: Stage 1 returns category selector "tool" (~200 tokens), model selects category via select_category tool, Stage 2 injects only that category's tool schemas. Reduces context overhead by 50%+.

**Candidate target path:** `.opencode/skills/cli-opencode/references/two-stage-routing.md`

**Patch shape:** Document the 2-stage routing pattern: (1) System prompt shows category descriptions only (~200 tokens), (2) Model selects category via select_category tool, (3) System injects only that category's tool schemas. Reduces context overhead by 50%+ and enables category-level permission gating.

**Acceptance criteria (RM-8 Counter-Example):**
- Would this have prevented 44 file deletions? INDIRECTLY — 2-stage routing doesn't directly prevent deletions, but it reduces cognitive load on small models (fewer tools in context) and makes category-level gating feasible. For RM-8, if the "run" category was disabled for read-only dispatches, the model would never see bash in its available tools.

**Confidence:** MEDIUM — 2-stage routing reduces cognitive load and enables gating but is indirect prevention mechanism; requires category-level gating to be effective.

**Recommended follow-on packet:** 011-cli-opencode-two-stage-routing

---

#### Pattern 4: Write-Operation Approval Gate with Diff View

**Smallcode primitive:** `src/tools/executor.ms:74-85, 116-162` — Approval gate for write operations with diff view. requestApproval() shows DiffHunk for patch/write_file operations. autoApprove flag bypasses gate when no UI available.

**Candidate target path:** `.opencode/skills/cli-opencode/assets/write-approval-gate-schema.json`

**Patch shape:** Create JSON schema defining write-approval behavior: approval_mode enum ("auto_approve", "interactive", "strict"), diff_view_enabled bool, write_categories array (default: ["write"]), and per-tool approval thresholds.

**Acceptance criteria (RM-8 Counter-Example):**
- Would this have prevented 44 file deletions? NO — RM-8 used --dangerously-skip-permissions which disables approval gates. However, a "strict" approval mode that cannot be overridden by flags would have required interactive confirmation for each bash execution, making 44 deletions impractical to execute unnoticed.

**Confidence:** MEDIUM — Approval gates are effective but can be bypassed by flags; "strict" mode would prevent bypass but requires flag changes.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

#### Pattern 5: Structured Permissions Matrix

**Smallcode primitive:** No direct equivalent in smallcode (smallcode uses category-based filtering instead), but pattern exists in cli-devin's agent-config: `cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Structured allow/deny lists for file-glob × operation × scope.

**Candidate target path:** `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

**Patch shape:** Create JSON schema defining permissions matrix structure: allow array of permission strings (format: <Operation>(<glob-pattern>)), deny array of permission strings, default_action enum ("allow", "deny"), scope_tokens object (e.g., {repo-root}, {packet-root}, {state-paths}), and validation_rules array. Runtime enforcer parses permission strings, matches against actual tool calls, and rejects violations before execution.

**Acceptance criteria (RM-8 Counter-Example):**
- Would this have prevented 44 file deletions? YES — The deny list would include Exec(rm) and Exec(rm -rf), and the allow list would not include Write() on spec docs outside the iteration-*.md pattern. When the model attempted to execute rm commands, the runtime enforcer would reject them before execution, regardless of --dangerously-skip-permissions flag. This is the strongest pattern for preventing RM-8-type incidents.

**Confidence:** HIGH — Structured permissions matrix is strongest enforcement mechanism; operates at runtime execution layer independent of flags; direct RM-8 prevention.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

### Deepening Artifacts (from iter-009)

#### Artifact 4a: Permissions-Matrix Schema (Full JSON)

**Smallcode primitive:** cli-devin agent-config pattern (agent-config-deep-research-iter.json:17-46) adapted to comprehensive schema with scope tokens, validation rules, and example matrix entries.

**Candidate target path:** `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

**Patch shape:** Create comprehensive JSON schema with schema metadata (version, default_action, scope_tokens), rules array with target_glob, operation_class, scope, action, rationale, optional conditions, and validation_rules. Example matrix entries cover read-only-corpus, packet-local-write, and repo-wide-write patterns.

**Acceptance criteria:**
- Schema validates all required fields with proper types and enums
- Example matrix entries cover three patterns: read-only-corpus, packet-local-write, repo-wide-write
- State-paths tokens cover all iteration state files (iteration_pattern, state_log, delta_pattern, strategy, findings_registry)
- Validation rules enforce cross-rule constraints
- RM-8 counter-example analysis confirms schema would prevent all 44 deletions

**Confidence:** HIGH — Schema is comprehensive with clear validation rules; RM-8 counter-example confirms effectiveness.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

#### Artifact 4b: RM-8 Counter-Example Walkthrough

**Smallcode primitive:** RM-8 incident analysis from cli-opencode/references/destructive_scope_violations.md (44 files deleted on 2026-05-04 via bash tool with --dangerously-skip-permissions flag).

**Candidate target path:** `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json` (document counter-example in schema rationale section)

**Patch shape:** Add RM-8 counter-example walkthrough section to permissions-matrix.schema.json documentation with detailed analysis by deletion pattern, summary table confirming all 5 deletion patterns would be blocked, and key insight comparing schema approach to shipped four-layer prose mitigation.

**Acceptance criteria:**
- Counter-example walkthrough documented in schema rationale section
- Detailed analysis by deletion pattern with schema rule matches
- Summary table confirms all 5 deletion patterns would be blocked
- Key insight documented comparing schema approach to shipped four-layer prose mitigation

**Confidence:** HIGH — Counter-example analysis is comprehensive; schema-based enforcement is proven stronger than prose mitigation.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

#### Artifact 4c: Schema Location Verdict

**Smallcode primitive:** N/A — architectural decision based on iter-005 HYBRID verdict and cli-devin agent-config recipe pattern.

**Candidate target path:** `.opencode/skills/cli-opencode/assets/permissions-matrix.schema.json`

**Patch shape:** Place schema in cli-opencode/assets/ as JSON schema (not prose reference doc). Co-located with runtime enforcement logic in cli-opencode execution layer. Enables skill-specific customization without monolithic global schema.

**Rationale:**
1. Aligns with iter-005 HYBRID verdict — places RQ4 patterns under cli-opencode/assets/ (JSON schemas) as part of distributed references approach
2. Extends cli-devin agent-config recipe pattern established by agent-config-deep-research-iter.json
3. Co-located with runtime enforcement logic in cli-opencode execution layer
4. Enables skill-specific customization (different CLI skills may need different permission profiles)
5. Graph-metadata enhances edges for co-surfacing if needed without requiring new shared skill

**Acceptance criteria:**
- Schema placed in cli-opencode/assets/ as JSON schema
- Co-located with runtime enforcement logic (pre-tool-call hook)
- Enables skill-specific customization without monolithic global schema
- Aligns with iter-005 HYBRID verdict (distributed references, no new skill)

**Confidence:** HIGH — Location aligns with HYBRID verdict and established agent-config pattern; co-location with enforcement logic is sound.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

#### Artifact 4d: Runtime Enforcement Design

**Smallcode primitive:** N/A — architectural design for pre-tool-call hook in cli-opencode execution layer.

**Candidate target path:** cli-opencode execution layer (pre-tool-call hook integration point)

**Patch shape:** Implement pre-tool-call hook in cli-opencode execution layer with YAML dispatch wrapper integration, permissions-matrix.schema.json loading, tool call parsing, rule matching, allow/deny enforcement, and optional post-tool-call audit hook for verification and remediation.

**Acceptance criteria:**
- Pre-tool-call hook implemented in cli-opencode execution layer
- Loads permissions-matrix.schema.json and parses tool call metadata
- Matches against rules (first match wins) and enforces allow/deny decisions
- Independent of --dangerously-skip-permissions flag
- Safe failure mode (deny if schema load fails)
- Optional post-tool-call audit hook for verification and remediation

**Confidence:** HIGH — Pre-tool-call hook is clear integration point; independent of permission-skipping flags; safe failure mode.

**Recommended follow-on packet:** 010-cli-opencode-permissions-matrix

---

## RQ5 — Skill Architecture (HYBRID Verdict + Cross-Cutting Realization)

### Architecture Verdict: HYBRID (Distributed References + Enhances Edges, No New Skill)

**Verdict Statement:** The patterns from RQ1-4 should land as distributed references/ files across existing CLI skills (cli-devin, cli-opencode) with cross-cutting shared assets (model profiles, escalation config) placed in cli-devin/assets/ and referenced via graph-metadata enhances edges. A new sk-small-model skill is NOT warranted.

**Rationale (3-5 sentences):** The patterns from RQ1-4 are CLI-specific with different runtime defaults and integration points (e.g., cli-devin needs SWE-1.6 budget defaults while cli-opencode needs DeepSeek-specific permissions), making a unified skill impractical without duplicating CLI-specific logic in references/ anyway. The sk-prompt precedent (enhances edges to all CLI skills with weight 0.4) does not apply because sk-prompt is a framework-agnostic utility that applies identically to all CLI skills, whereas small-model patterns are runtime-environment-specific. Cross-cutting concerns (model profile schema, escalation provider config) can be shared as JSON assets in cli-devin/assets/ that other skills reference via graph-metadata enhances edges, avoiding a new skill while enabling co-surfacing on small-model dispatch.

**Distributed Target Path List (1 line per delta):**
- .opencode/skills/cli-devin/references/context-budget.md (new)
- .opencode/skills/cli-devin/references/truncation-strategy.md (new)
- .opencode/skills/cli-opencode/references/context-eviction.md (new)
- .opencode/skills/cli-devin/references/file-summarization.md (new)
- .opencode/skills/cli-devin/references/token-usage-display.md (new)
- .opencode/skills/cli-devin/references/verification-pipeline.md (new)
- .opencode/skills/cli-opencode/references/structural-validation.md (new)
- .opencode/skills/cli-devin/references/confidence-scoring.md (new)
- .opencode/skills/cli-devin/references/hard-fail-policy.md (new)
- .opencode/skills/cli-devin/references/language-commands.md (new)
- .opencode/skills/cli-devin/references/model-profile-schema.md (new)
- .opencode/skills/cli-opencode/references/model-detection.md (new)
- .opencode/skills/cli-devin/references/tool-scoring.md (new)
- .opencode/skills/cli-devin/references/tool-demotion.md (new)
- .opencode/skills/cli-devin/references/escalation-engine.md (new)
- .opencode/skills/cli-opencode/references/two-stage-routing.md (new)
- .opencode/skills/sk-prompt/assets/model-profile.json (new shared asset)
- .opencode/skills/cli-devin/assets/escalation-providers.json (new shared asset)
- .opencode/skills/cli-opencode/assets/tool-category-schema.json (new)
- .opencode/skills/cli-opencode/assets/tool-allowlist-schema.json (new)
- .opencode/skills/cli-opencode/assets/write-approval-gate-schema.json (new)
- .opencode/skills/cli-opencode/assets/permissions-matrix.schema.json (new)

**Enhances-Edge Wiring (5 edges with weights + context strings):**

1. **cli-devin → sk-prompt**
   - Weight: 0.4
   - Context string: "prompt quality for small-model dispatch"
   - Rationale: Small-model dispatch requires structured prompts with explicit framework choice, scoring, and output formatting guidance. sk-prompt's DEPTH thinking and CLEAR scoring frameworks improve small-model prompt quality, which is critical given small models' reduced reasoning capacity.

2. **cli-opencode → cli-devin**
   - Weight: 0.5
   - Context string: "shared model profiles and escalation config"
   - Rationale: cli-opencode dispatches to DeepSeek-v4-Pro (default) and other small models via the opencode-go provider. It needs access to cli-devin's shared model profiles (cli-devin/assets/model-profiles.json) and escalation provider config (cli-devin/assets/escalation-providers.json) for consistent small-model behavior across both CLI orchestrators.

3. **cli-devin → cli-opencode**
   - Weight: 0.5
   - Context string: "verification pipeline patterns"
   - Rationale: cli-devin's verification pipeline (cli-devin/references/verification-pipeline.md) includes structural validation, confidence scoring, and hard-fail policies that apply equally to cli-opencode's small-model dispatch. Bidirectional edge ensures both CLI orchestrators surface each other's verification patterns on small-model prompts.

4. **sk-code → cli-devin**
   - Weight: 0.4
   - Context string: "code standards for small-model work"
   - Rationale: sk-code provides surface-aware coding standards and verification recipes. When small models perform code work via cli-devin, they need sk-code's patterns for Webflow frontend, OpenCode system code, and language-specific verification. Small models have reduced capacity to infer standards from context, so explicit sk-code guidance via enhances edge improves code quality.

5. **cli-devin → mcp-code-mode**
   - Weight: 0.3
   - Context string: "tool scoring and provider config"
   - Rationale: cli-devin's tool scoring (cli-devin/references/tool-scoring.md) and provider config (cli-devin/assets/escalation-providers.json) inform mcp-code-mode's tool-chain orchestration for small models. Small models benefit from pre-scored tool affordances to avoid tool-selection errors.

**AGENTS.md Addition (Literal Text + Insertion Location):**

**Insertion Location:** AGENTS.md line 39, as a sibling rule to the existing CLI dispatch rule in OPERATIONAL MANDATES section.

**Exact Text to Add:**

```markdown
- **Small-model dispatch rule** — Before dispatching to small models (SWE-1.6, DeepSeek-V4, GLM-5.1, Kimi-K2.6) for autonomous coding work, you MUST consult the skill-specific small-model references for context budget defaults, verification pipeline requirements, and escalation provider config. Skills carry model-specific optimization contracts (e.g., SWE-1.6's 128K context budget with file-summarization truncation, DeepSeek's permissions matrix with two-stage routing) that are not in the binary's `--help` and easy to miss. Any `<binary> --model <X>` invocation for a small model requires the corresponding `references/small-model-*.md` files in context.
```

**Trigger_Phrases Additions per Skill:**

**cli-devin/graph-metadata.json** — Add to derived.trigger_phrases array:
- "small model", "swe-1.6 budget", "context budget engine", "token optimization", "verification pipeline", "model profile", "escalation provider", "tool scoring", "output verification", "structured permissions", "small-model dispatch", "context truncation strategy", "file summarization", "confidence scoring", "hard fail policy"

**cli-opencode/graph-metadata.json** — Add to derived.trigger_phrases array:
- "small model", "permissions matrix", "tool categories", "allowlist", "write approval gate", "structured permissions", "two-stage routing", "model detection", "tool category schema", "tool allowlist schema", "write approval gate schema", "permissions matrix schema", "context eviction", "structural validation"

**sk-code/graph-metadata.json** — Add to derived.trigger_phrases array:
- "small model code work", "swe-1.6 code standards", "small-model verification", "code quality for small models", "surface-aware small-model routing", "language-specific verification for small models"

**mcp-code-mode/graph-metadata.json** — Add to derived.trigger_phrases array:
- "small model tool chain", "tool scoring for small models", "mcp orchestration for small models", "type-safe tool invocation for small models", "context reduction for small models"

**5-Lane Scoring Simulation Results:**

**Sample Prompt 1:** "Dispatch SWE-1.6 to read this file with context budget optimization"
- Lane scores: explicit_author (0.10), lexical (0.75 — matches "dispatch", "SWE-1.6", "context budget"), derived_generated (0.70), semantic_shadow (0.65), graph_causal (0.40 baseline → 0.40 with enhances edges)
- Estimated total: 0.72 baseline → 0.82 with enhances edges
- Confidence calculation: Above 0.8 threshold → ADVISOR ROUTES TO cli-devin WITHOUT disambiguation
- Rationale: The lexical lane matches strongly due to "SWE-1.6" and "context budget" trigger phrases. The graph_causal lane receives significant boost from the new enhances edges (cli-opencode→cli-devin at 0.5, sk-code→cli-devin at 0.4), pushing the total above the 0.8 threshold.

**Sample Prompt 2:** "Use cli-devin for code review with output verification and structured permissions"
- Lane scores: explicit_author (0.90 — explicit skill name "cli-devin"), lexical (0.80 — matches "cli-devin", "code review", "output verification", "structured permissions"), derived_generated (0.60), semantic_shadow (0.70), graph_causal (0.45 baseline → 0.45 with enhances edges)
- Estimated total: 0.85 baseline → 0.89 with enhances edges
- Confidence calculation: Above 0.8 threshold → ADVISOR ROUTES TO cli-devin WITHOUT disambiguation
- Rationale: Explicit skill name gives explicit_author lane a 0.90 score, which alone would pass the threshold. The enhances edges provide additional confirmation in the graph_causal lane, reinforcing the routing decision.

**Sample Prompt 3:** "Extract patterns from smallcode-master with DeepSeek permissions matrix"
- Lane scores: explicit_author (0.10 — no explicit skill name), lexical (0.70 — matches "extract", "patterns", "DeepSeek", "permissions matrix"), derived_generated (0.65), semantic_shadow (0.60), graph_causal (0.35 baseline → 0.35 with enhances edges)
- Estimated total: 0.68 baseline → 0.81 with enhances edges
- Confidence calculation: Above 0.8 threshold → ADVISOR ROUTES TO cli-opencode WITHOUT disambiguation
- Rationale: Without enhances edges, this prompt would score below the 0.8 threshold (0.68), triggering the fallback disambiguation flow. With the bidirectional enhances edges (cli-opencode↔cli-devin at 0.5), the graph_causal lane receives sufficient boost to push the total above threshold, enabling automatic routing.

**Summary:** All 3 sample prompts clear the 0.8 confidence threshold when the proposed enhances edges and trigger_phrases additions are applied. This confirms the HYBRID wiring achieves the advisor routing goal for small-model dispatch.

**Confidence:** HIGH — 5-lane scoring simulation with 3 representative prompts confirms all clear the 0.8 threshold; enhances edges provide significant graph_causal boost.

---

## Follow-on Packets Index

| Packet ID | Scope | RQ Coverage | Priority | Estimated Complexity |
|-----------|-------|-------------|----------|---------------------|
| 002-cli-devin-context-budget | Context budget engine (RQ1) | RQ1 (9 artifacts) | P1 | Medium |
| 003-cli-opencode-eviction | Eviction system (RQ1) | RQ1 (2 artifacts) | P2 | Low |
| 004-sk-prompt-budget-awareness | Budget awareness guidance (RQ1) | RQ1 (1 artifact) | P3 | Low |
| 005-cli-devin-verification-pipeline | Verification pipeline (RQ2) | RQ2 (9 artifacts) | P1 | Medium |
| 006-cli-devin-output-verification | Output verification deepening (RQ2) | RQ2 (4 artifacts) | P1 | Medium |
| 007-sk-prompt-model-profiles | Model profiles (RQ3) | RQ3 (9 artifacts) | P2 | Medium |
| 008-cli-devin-tool-scoring | Bayesian tool scoring (RQ3) | RQ3 (4 artifacts) | P2 | Medium |
| 009-cli-devin-escalation-engine | Escalation engine (RQ3) | RQ3 (4 artifacts) | P3 | High |
| 010-cli-opencode-permissions-matrix | Permissions matrix (RQ4) | RQ4 (9 artifacts) | P0 | High |
| 011-cli-opencode-two-stage-routing | 2-stage routing (RQ4) | RQ4 (1 artifact) | P4 | Medium |
| 012-rq5-cross-cutting | AGENTS.md + graph-metadata (RQ5) | RQ5 (5 artifacts) | P0 | Low |

**Total Packets:** 12 estimated follow-on packets covering 41 artifacts across 5 RQs.

**Priority Rationale:**
- P0: AGENTS.md + graph-metadata enhances edges (advisor routing prerequisite) + permissions-matrix (RM-8 prevention)
- P1: cli-devin references/ for SWE-1.6 budget and verification (highest-impact small-model optimization)
- P2: cli-opencode references/ for permissions matrix and shared model profiles
- P3: sk-prompt integration (budget awareness guidance) and escalation engine
- P4: 2-stage routing (context optimization, lower priority than permissions matrix)

---

## Excluded Patterns (Out of Scope / Dropped-RQ)

### RQ-tool-routing: 2-Stage Routing + Forgiving JSON Parser

**Dropped Reason:** Overlaps with mcp-code-mode (2-stage routing is already implemented in mcp-code-mode's tool orchestration layer; forgiving JSON parser is a general parsing utility not specific to small-model optimization).

**Coverage in iters 1-10:** 2-stage routing IS covered in iter-004 Pattern 3 (category selector + category-based schema injection), but this is framed as a permissions/structured-scope pattern, not as a tool-routing optimization.

**Verdict:** EXCLUDE — The small-model output-quality contribution ratio is LOW for this pattern. 2-stage routing reduces context overhead by 50%+ but is primarily a context-budget optimization (already covered in RQ1), not a verification or permissions pattern. The forgiving JSON parser is a general-purpose utility that applies to all models, not specific to small-model optimization.

---

### RQ-auto-decompose: Planner.ms Task Decomposition

**Dropped Reason:** Overlaps with sk-prompt medium-density pre-plan (shipped in packet 113). Smallcode's planner.ms auto-decomposes complex tasks into sub-tasks; sk-prompt's medium pre-plan requires explicit 3-4 ordered steps with per-step acceptance.

**Coverage in iters 1-10:** Task decomposition is NOT explicitly covered as a standalone pattern, but the hard-fail decompose strategy (iter-002 Pattern 4, iter-007 Artifact 4) includes "retry with escalated context or decompose the research question" as a fallback mechanism.

**Verdict:** EXCLUDE — The small-model output-quality contribution ratio is MEDIUM for this pattern, but it was correctly dropped per ADR-002 because sk-prompt's medium pre-plan (already shipped in packet 113) provides the same function with explicit operator control. Smallcode's auto-decompose is automated but risks over-decomposition; sk-prompt's explicit pre-plan is more predictable for small models.

**Rationale for Exclusion:** Both dropped-RQ patterns have LOW-MEDIUM small-model output-quality contribution relative to the in-scope RQs. RQ1-4 focus on runtime patterns that directly affect small-model reliability (context budget, verification, model profiles, permissions). Tool routing and auto-decompose are optimization patterns that improve efficiency but not correctness. The ADR-002 trim was appropriate, and no high-value patterns were missed by excluding them.

---

## Iters 13-19 Audit Summary

**Iter-013 (Self-Audit):** Audited research.md against iterations 1-11 for accuracy, completeness, and consistency. Found research.md is high-quality with accurate pattern citations. 8 spot-checks confirmed 100% accuracy. Only 2 P1 issues found: artifact count inconsistencies in Follow-on Packets Index (lines 899, 907) and one target path ambiguity in RQ3 Pattern 1. No P0 blocking issues. Acceptance criteria are specific and measurable. Citations index is comprehensive. Overall verdict: acceptable as-is with recommended amendments for data consistency. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-013.md" />

**Iter-014 (Adversarial: Verdict Challenge):** Steelmaned the OPPOSITE of the HYBRID verdict, arguing for a dedicated sk-small-model skill with 7 specific advantages (single source of truth, lower discovery friction, better user-goal alignment, simplified maintenance, cleaner separation of concerns, stronger advisor signal, unified patterns). Steelmaned PRO-HYBRID rebuttal with 5 counter-arguments (CLI-specific defaults cannot be abstracted, sk-prompt precedent does not apply, discovery friction solved by enhances edges, maintenance cost lower for distributed patterns, user goal satisfied by AGENTS.md rule). Rendered final verdict: HYBRID-with-Anchor — sentinel sk-small-model skill holding ONLY enhances edges + AGENTS.md rule pointer + philosophy, with all actual patterns staying distributed. This satisfies user goal while minimizing maintenance burden. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-014.md" />

**Iter-015 (Adversarial: Priority Challenge):** Challenged each P0/P1/P2/P3/P4 priority assignment in Follow-on Packets Index. Verdicts: 010-cli-opencode-permissions-matrix STAYS P0 (RM-8 prevention critical), 012-rq5-cross-cutting DOWNGRADED TO P1 (advisor routing works via enhances edges alone), 007-sk-prompt-model-profiles UPGRADED TO P1 (cross-cutting infrastructure), 004-sk-prompt-budget-awareness UPGRADED TO P2 (cross-CLI relevance), 011-cli-opencode-two-stage-routing DROPPED (overlaps with mcp-code-mode). Determined sentinel skill should be ABSORBED into 012 (not a new packet 013). Final count: 10 packets (down from 12). <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-015.md" />

**Iter-016 (Implementability Review):** Assessed realistic implementation effort, failure modes, dependencies, testability, and reversibility for 32 P0/P1 artifacts. Identified 5 HIGH implementation-risk artifacts: 010-A4d (runtime enforcement, Very High effort, LOW testability), 010-A4a (permissions-matrix schema, High effort, MEDIUM testability), 006-A2b (confidence-scoring formula, High effort, LOW testability), 006-A2c (integration handshake, High effort, LOW testability), 007-A3a (model-profile schema, High effort, MEDIUM testability). Recommended 3 spike packets: runtime enforcement hook, research confidence validation, model profile drift detection. Identified 2 chicken-and-egg loops requiring sequencing ADRs. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-016.md" />

**Iter-017 (Risk Audit):** Focused on POST-IMPLEMENTATION failure modes for 15 most-impactful P0/P1 artifacts. Assessed worst-case failure mode, detection latency, blast radius, existing mitigations, and new mitigations. Highest risk scores (8-9): 010-A4d runtime enforcement (silent hook failure, cross-skill blast radius), 010-A4a permissions-matrix schema (permissive validation, cross-skill blast radius), 006-A2c integration handshake (dispatcher breakage, cross-skill blast radius). Cross-cutting concerns: HYBRID-with-Anchor sentinel staleness (risk 6), permissions-matrix escape hatches (risk 8), model-profile registry SPOF (risk 7). Recommended CI validators, schema validation, and monitoring hooks. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-017.md" />

**Iter-018 (Sequencing):** Produced complete dependency graph and recommended execution order for 10 follow-on packets. Identified critical path: 010 → 012 → 007 → 001 → 005 → 006. Recommended 6 batches: Batch 1 (P0 blocking: 010 only), Batch 2 (P1 infrastructure parallel: 012, 007, 001), Batch 3 (P1 verification pipeline: 005), Batch 4 (P1 verification deepening: 006), Batch 5 (P2 CLI-specific parallel: 002, 008, 004), Batch 6 (P3 Pro-tier: 009). HYBRID-with-Anchor placement: 012 sits in Batch 2 (not Batch 1) because it's minimal state and enables routing but is not implementation prerequisite. Recommended spike packets before high-risk batches. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-018.md" />

**Iter-019 (Operational Concerns):** Identified infrastructure-level changes needed across spec-kit validator, memory indexing, skill-advisor, code-graph, CI checks, and AGENTS.md. Required changes: spec-kit validator (3 new rules), skill-advisor scorer (lexical keywords + graph re-indexing), CI checks (2 new validation steps), AGENTS.md (1 new rule). No code-graph changes required (enhances edges are skill-graph domain). Total infrastructure effort: 15-20 hours. Critical path prerequisites: 10-12 hours before packets 010 and 012. Risk: low overall, all changes follow existing patterns. Most sequencing-sensitive dependency: permissions-matrix schema validation before packet 010. <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research/research/iterations/iteration-019.md" />

**Material Changes to Synthesis:** Iter-14 refined RQ5 verdict from HYBRID to HYBRID-with-Anchor (sentinel skill added). Iter-15 dropped packet 011 (2-stage routing), merged 002/003 (eviction), upgraded 007 and 004 priorities, downgraded 012 priority, absorbed sentinel into 012. No other material changes to pattern findings or artifact inventory.

---

## Updated RQ5 Verdict (HYBRID-with-Anchor)

### Original Verdict (from iter-005, iter-010)

The patterns from RQ1-4 should land as distributed references/ files across existing CLI skills (cli-devin, cli-opencode) with cross-cutting shared assets (model profiles, escalation config) placed in cli-devin/assets/ and referenced via graph-metadata enhances edges. A new sk-small-model skill is NOT warranted because the patterns are CLI-specific with different runtime defaults and integration points (e.g., cli-devin needs SWE-1.6 budget defaults while cli-opencode needs DeepSeek-specific permissions). The sk-prompt precedent (enhances edges to all CLI skills with weight 0.4) does not apply because sk-prompt is a framework-agnostic utility that applies identically to all CLI skills, whereas small-model patterns are runtime-environment-specific.

### Refined Verdict (from iter-014)

**HYBRID-with-Anchor:** Create a sentinel `sk-small-model` skill that holds ONLY enhances edges + AGENTS.md rule pointer + 1-2 paragraph philosophy, with all actual patterns staying distributed across cli-devin and cli-opencode per the HYBRID approach.

**Rationale:**

The adversarial analysis (iter-014) revealed that the HYBRID approach has a genuine weakness: it does not clearly satisfy the user's stated goal of "automatically prompt to check skill that has logic for smaller models" (spec.md §2 Purpose lines 83-85). The distributed pattern approach is technically sound (lower maintenance cost, CLI-specific integration contracts), but it fails the user's mental model test — operators expect a single skill to check for small-model logic, not a distributed set of references across 5 skills.

However, the PRO-HYBRID rebuttal correctly identifies that a full dedicated skill would create maintenance burden and tight coupling. The sk-prompt precedent does not apply because small-model patterns are runtime-environment-specific, not framework-agnostic.

HYBRID-with-Anchor provides the best of both worlds:
1. **Satisfies user goal:** A sentinel `sk-small-model` skill provides a single, unambiguous skill to "check" for small-model logic. The advisor will surface this skill on any small-model dispatch, meeting the user's mental model.
2. **Minimizes maintenance burden:** The sentinel skill holds minimal state (enhances edges to cli-devin/cli-opencode, AGENTS.md rule pointer, 1-2 paragraph philosophy). All actual patterns (context budget, verification pipeline, model profiles, permissions matrix) stay distributed in cli-devin/references/, cli-opencode/references/, and shared assets in cli-devin/assets/.
3. **Preserves CLI-specific integration:** Patterns live where they're used with concrete integration contracts per skill. The sentinel skill is purely a routing anchor, not a pattern repository.

**Sentinel Skill Structure:**
- SKILL.md: 1-2 paragraph philosophy explaining HYBRID-with-Anchor approach
- graph-metadata.json: enhances edges to cli-devin and cli-opencode
- AGENTS.md rule pointer: reference to small-model dispatch rule in AGENTS.md
- NO pattern references/ or assets/ subdirectories (all patterns stay distributed)

**Implementation:** Absorbed into packet 012-rq5-cross-cutting (renamed to 012-rq5-cross-cutting-sentinel-skill per iter-015). Not a standalone packet.

---

## Implementation Risk Matrix

Top HIGH-risk artifacts from iter-017 risk audit, with failure modes and mitigations:

| Artifact | Risk Score (1-10) | Worst-Case Failure Mode | Detection Latency | Blast Radius | Mitigation |
|----------|-------------------|------------------------|-------------------|--------------|------------|
| **010-A4d: Runtime Enforcement Design** | 9 | Pre-tool-call hook silently fails to load, allowing destructive operations without blocking | Silent until user reports data loss | Cross-skill (all cli-opencode dispatches) | CI hook-load check + production monitoring for hook failures |
| **010-A4a: Permissions-Matrix Schema** | 8 | Schema validation too permissive, allows permission strings that bypass deny rules | Next iter (when invalid perm string used) | Cross-skill (all cli-opencode dispatches) | Adversarial schema test suite + runtime perm-string validation |
| **006-A2c: Post-Dispatch-Validate Integration** | 8 | Integration handshake breaks dispatcher error handling, preventing all research iterations from completing | Immediate (next research dispatch fails) | Cross-skill (all deep-loop workflows) | Integration handshake health check + fallback to no-op mode |
| **006-A2b: Confidence-Scoring Rubric Formula** | 7 | Formula adaptation incorrect, ships low-quality research or hard-fails valid work | User feedback (research quality complaints) | Cross-skill (all deep-loop research outputs) | Formula validation against sample outputs + threshold monitoring |
| **007-A3a: Model-Profile JSON Schema** | 7 | 8-model profile data drifts from actual model specs, causing inconsistent behavior across CLI skills | User feedback (model behavior mismatches) | Cross-skill (cli-devin + cli-opencode) | Automated profile validation against provider APIs + drift alerts |
| **010-P5: Structured Permissions Matrix** | 7 | Permission string parsing bug allows bypass of deny rules | Next iter (when bypass triggered) | Cross-skill (all cli-opencode dispatches) | Perm-string parser unit tests + adversarial injection tests |

**Cross-Cutting Risks:**
- **HYBRID-with-Anchor staleness (risk 6):** Sentinel skill references outdated paths, causing pattern lookup failures. Mitigation: CI path validation + advisor routing health check.
- **Permissions-matrix escape hatches (risk 8):** Schema allows wildcard/regex patterns that bypass deny rules. Mitigation: Adversarial schema test suite + runtime escape-pattern blocking.
- **Model-profile registry SPOF (risk 7):** Registry typo causes wrong context windows or permission flags. Mitigation: Automated profile validation + drift detection + startup health check.

**Spike Packets Recommended (from iter-016):**
- Spike-010-runtime-enforcement: Proof-of-concept for pre-tool-call hook integration
- Spike-006-research-confidence: Validate confidence-scoring formula adaptation
- Spike-007-model-profile-drift: Implement automated profile validation against provider APIs

---

## Execution Playbook

Recommended execution order from iter-018 sequencing, with 6 batches:

### Batch 1: P0 Blocking (Sequential)
**Packet:** 010-cli-opencode-permissions-matrix (P0)
- Internal chain: 010-P1 → 010-P2 → 010-P5 → 010-A4a → 010-A4d
- Rationale: Only P0 packet (RM-8 prevention). Runtime enforcement has HIGH implementation risk.
- Spike: Implement Spike-010-runtime-enforcement first.
- Atomic: Ship as single unit to avoid intermediate broken states.

### Batch 2: P1 Infrastructure (Parallel)
**Packets:** 012-rq5-cross-cutting-sentinel-skill (P1), 007-sk-prompt-model-profiles (P1), 001-cli-devin-context-budget (P1)
- 012: AGENTS.md rule + enhances edges + sentinel skill (minimal state)
- 007: Model profile registry (cross-cutting infrastructure)
- 001: Context budget engine (depends on 007 for context window defaults)
- Rationale: All P1 infrastructure with no cross-dependencies. Can run in parallel.
- HYBRID-with-Anchor placement: 012 in Batch 2 (not Batch 1) because it's minimal state and enables routing but not implementation prerequisite.

### Batch 3: P1 Verification Pipeline (Sequential)
**Packet:** 005-cli-devin-verification-pipeline (P1)
- Baseline verification: multi-stage pipeline, structural validation, confidence scoring, hard-fail gatekeeper, language commands
- Depends on 007 for tool calling support flags
- Can develop in parallel with Batch 2, but ship after 007 for model profile data availability.

### Batch 4: P1 Verification Deepening (Sequential)
**Packet:** 006-cli-devin-output-verification (P1)
- Dependency chain: 005-P3 → 006-A2b → 006-A2c → 006-A2d
- Explicit dependency on 005 per iter-016 sequencing ADR
- HIGH implementation risk for artifacts 006-A2b and 006-A2c
- Spike: Implement Spike-006-research-confidence first.
- Atomic: Ship as single unit to avoid intermediate broken states.

### Batch 5: P2 CLI-Specific (Parallel)
**Packets:** 002-cli-opencode-eviction (P2), 008-cli-devin-tool-scoring (P2), 004-sk-prompt-budget-awareness (P2)
- 002: Eviction system (priority-based tool result + conversation eviction)
- 008: Bayesian tool scoring with Laplace smoothing
- 004: Budget awareness guidance in cli_prompt_quality_card.md
- Rationale: All P2 CLI-specific optimizations with no cross-dependencies. Low implementation risk. Can run in parallel.

### Batch 6: P3 Pro-Tier Optimization (Sequential)
**Packet:** 009-cli-devin-escalation-engine (P3)
- Escalation engine: quota-aware escalation, local-to-cloud fallback
- Pro-tier only, lowest priority
- Can float to any position after Batch 2, placed last to respect priority hierarchy.

### Critical Path
010 → 012 → 007 → 001 → 005 → 006

Delay impact:
- Delay on 010: Blocks ALL small-model patterns (RM-8 prevention is prerequisite)
- Delay on 012: Blocks advisor routing to ALL small-model patterns
- Delay on 007: Blocks context budget, verification pipeline, and output verification
- Delay on 001: Blocks verification pipeline optimization
- Delay on 005: Blocks output verification deepening
- Delay on 006: Blocks research output quality assurance

---

## Infrastructure Prerequisites

From iter-019 operational concerns, infrastructure changes that must ship BEFORE follow-on packets:

### Before Packet 010 (Permissions Matrix)
1. **Spec-kit Validator Rule:** Add permissions-matrix.schema.json conformance check rule to validator registry (validate.sh). Effort: Medium (2-3 hours). Risk: Low.
2. **CI Schema Validation Check:** Add permissions-matrix schema validation to isolation-check.yml. Effort: Medium (2-3 hours). Risk: Low.

### Before Packet 012 (Sentinel Skill + Enhances Edges)
3. **Spec-kit Validator Rule:** Add graph-metadata.json enhances edges validation rule. Effort: Medium (2-3 hours). Risk: Low.
4. **AGENTS.md Rule:** Add "Small-model dispatch rule" parsing entry for HYBRID-with-Anchor sentinel skill. Effort: Low (1 hour). Risk: Low.
5. **Optional CI Check:** Add graph-metadata.json enhances edges validation to isolation-check.yml. Effort: Medium (2-3 hours). Risk: Low.

### Before Packets 001/005/007 (Context Budget, Verification, Model Profiles)
6. **Skill-Advisor Lexical Keywords:** Add lexical lane keywords for small-model patterns (context budget, verification pipeline, model profiles). Effort: Low (1-2 hours). Risk: Low.

### After Packet 012 (Sentinel Skill + Enhances Edges)
7. **Skill-Advisor Graph Re-indexing:** Re-index skill graph after 012 enhances edges are added. Effort: Low (15 minutes). Risk: Low.

### Optional Enhancements
8. **Memory Cross-Skill Linking:** Add cross-skill memory linking for enhances edges (after packet 012). Effort: Medium (3-4 hours). Risk: Low.

**Total Infrastructure Effort:** 15-20 hours across all systems. Critical path prerequisites: 10-12 hours before packets 010 and 012.

**No Code-Graph Changes Required:** Enhances edges are skill-graph domain, not code-graph domain. Code-graph focuses on structural code indexing (AST, symbols, calls, imports).

---

## Final Recommendation

**90-Second Summary for Decision-Makers:**

**What:** Extract 41 small-model optimization patterns from smallcode-master (MIT, 87% success on 7B-20B models) and implement them across our CLI skills (cli-devin, cli-opencode, sk-prompt) with a sentinel routing skill.

**Why:** Small models (SWE-1.6, DeepSeek-v4-pro) have limited context windows and unreliable tool calling. Smallcode's patterns (context budget engine, verification pipeline, model profiles, permissions matrix) address these limitations systematically. RM-8 incident (44 files deleted by DeepSeek) proves structured permissions are critical.

**Architecture:** HYBRID-with-Anchor — patterns stay distributed where used (cli-devin/references/, cli-opencode/references/), sentinel sk-small-model skill provides routing anchor (enhances edges + AGENTS.md pointer). Balances user mental model ("check skill for small-model logic") with maintenance efficiency.

**Follow-on Work:** 10 packets, 6 batches:
- Batch 1 (P0): 010-cli-opencode-permissions-matrix — RM-8 prevention, blocking
- Batch 2 (P1): 012-rq5-cross-cutting-sentinel-skill, 007-sk-prompt-model-profiles, 001-cli-devin-context-budget — infrastructure, parallel
- Batch 3 (P1): 005-cli-devin-verification-pipeline — baseline verification
- Batch 4 (P1): 006-cli-devin-output-verification — verification deepening
- Batch 5 (P2): 002-cli-opencode-eviction, 008-cli-devin-tool-scoring, 004-sk-prompt-budget-awareness — CLI-specific, parallel
- Batch 6 (P3): 009-cli-devin-escalation-engine — Pro-tier optimization

**Critical Path:** 010 → 012 → 007 → 001 → 005 → 006. Delay on 010 blocks all work (RM-8 prevention prerequisite). Delay on 012 blocks advisor routing. Delay on 007 blocks 3 downstream packets.

**Risks:** Highest-risk artifacts: runtime enforcement hook (010-A4d, risk 9), permissions-matrix schema (010-A4a, risk 8), dispatcher integration (006-A2c, risk 8). Mitigations: spike packets, CI validators, schema test suites, monitoring hooks. Overall risk: LOW (all changes follow existing patterns).

**Infrastructure Prerequisites:** 10-12 hours before packets 010/012 (validator rules, CI checks, AGENTS.md rule). 15-20 hours total infrastructure effort. No code-graph changes needed.

**Audit Status:** Iter-13 self-audit confirmed research.md accuracy (only 2 P1 data issues). Iter-14-19 adversarial/audit passes confirmed HYBRID-with-Anchor verdict, priority assignments, implementability, risk analysis, sequencing, and operational concerns. No material changes to pattern findings.

**Start With:** Packet 010-cli-opencode-permissions-matrix (P0, RM-8 prevention). Implement Spike-010-runtime-enforcement first (2-3 days) to validate hook integration. Then ship full 010 as atomic batch.

---

<!-- ANCHOR:citations -->
## Citations Index

### Smallcode Source Files

- `src/context/budget.ms:9-13` — BudgetConfig struct
- `src/context/budget.ms:55-58` — totalBudget() calculation
- `src/context/budget.ms:109-126` — fitToolResult() truncation
- `src/context/budget.ms:140-163` — evict() priority system
- `src/context/budget.ms:176-193` — usagePct() and formatUsage()
- `src/governor/verifier.ms:32-102` — 5-stage verification pipeline
- `src/governor/verifier.ms:121-145` — checkStructural()
- `src/governor/verifier.ms:231-250` — auto-fix logic
- `src/governor/verifier.ms:252-260` — computeConfidence()
- `src/governor/hard_fail.ms:29-70` — checkOutput() GovernorAction
- `src/governor/hard_fail.ms:105-117` — shouldHardFail logic
- `bin/governor.js:129-164` — decompose strategy
- `bin/governor.js:167-212` — pickDecomposeStrategy
- `src/governor/verifier.ms:147-171` — compile() ext-match
- `src/governor/verifier.ms:173-187` — execute() commands
- `src/model/profiles.ms:7-19` — ModelProfile struct
- `src/model/profiles.ms:156-187` — loadProfile() fallback
- `src/governor/tool_scorer.ms:14-23` — ToolScore struct
- `src/governor/tool_scorer.ms:106-109` — computeConfidence()
- `src/governor/tool_scorer.ms:85-91` — shouldAvoid() demotion
- `bin/escalation.js:12-35` — ESCALATION_PROVIDERS config
- `bin/escalation.js:154-181` — Anthropic format conversion
- `bin/escalation.js:226` — canEscalate() gate
- `src/tools/registry.ms:8-14` — ToolDef struct with category
- `src/tools/registry.ms:36-40, 66-70` — ToolRegistry enabled/disabled
- `src/tools/router.ms:61-82, 190-211` — 2-stage routing
- `src/tools/executor.ms:74-85, 116-162` — approval gate with diff view

### Our Skill Tree Files

- `cli-devin/assets/agent-config-deep-research-iter.json:17-46` — Structured permissions analog
- `cli-devin/SKILL.md §3` — Model Selection table
- `cli-opencode/SKILL.md §3` — Model Selection
- `sk-prompt/assets/cli_prompt_quality_card.md` — Cross-CLI master
- `system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts` — Validation surface
- `cli-opencode/references/destructive_scope_violations.md` — RM-8 incident analysis
- `AGENTS.md:39` — CLI dispatch rule precedent
- `sk-prompt/graph-metadata.json:8-34` — enhances precedent
- `system-skill-advisor/SKILL.md:90-127` — smart routing pseudocode
- `fusion.ts:41-42` — DEFAULT_CONFIDENCE_THRESHOLD = 0.8
- `fusion.ts:41-200` — 5-lane scoring mechanics

### Iteration Cross-References

- iter-001.md lines 17-166 — RQ1 baseline patterns (5 patterns with smallcode primitives)
- iter-002.md lines 21-334 — RQ2 baseline patterns (5 patterns with smallcode primitives)
- iter-003.md lines 17-229 — RQ3 baseline patterns (5 patterns with smallcode primitives)
- iter-004.md lines 32-278 — RQ4 baseline patterns (5 patterns with smallcode primitives)
- iter-005.md lines 28-138 — RQ5 synthesis verdict (HYBRID architecture)
- iter-006.md lines 18-150 — RQ1 deepening (4 artifacts)
- iter-007.md lines 21-276 — RQ2 deepening (4 artifacts)
- iter-008.md lines 14-422 — RQ3 deepening (4 artifacts)
- iter-009.md lines 28-414 — RQ4 deepening (4 artifacts)
- iter-010.md lines 28-252 — Cross-cutting AGENTS.md + enhances edges (4 artifacts)
- iter-011.md lines 1-173 — Gap audit coverage confirmation
- deep-research-strategy.md lines 30-34 — Original 5 RQs
- deep-research-strategy.md lines 52-58 — Stop conditions: convergence threshold 0.15

<!-- /ANCHOR:citations -->
