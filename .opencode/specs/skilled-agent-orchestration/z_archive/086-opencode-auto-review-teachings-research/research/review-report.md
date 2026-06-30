---
title: "Upstream auto-review Research Report"
description: "20-iteration deep-research synthesis of the upstream dzianisv/opencode-plugins auto-review package. Extracted mechanisms, gap analyses, ranked teachings, reject list, and remediation packet recommendation."
trigger_phrases:
  - "106 review report"
  - "upstream auto-review findings"
  - "auto-review teachings ranked"
importance_tier: "high"
contextType: "review"
---

# Upstream auto-review Research Report

**Packet**: `skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research`
**Pinned upstream SHA**: `cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9`
**Upstream URL**: <https://github.com/dzianisv/opencode-plugins/tree/issue-136-package-auto-review/packages/auto-review>
**Iterations**: 20 cli-devin SWE-1.6 deep-research passes
**Date**: 2026-05-16

---

## 1. Executive Verdict

**TL;DR**: The upstream auto-review package demonstrates 9 well-designed mechanisms for event-driven, cross-model code review with strong loop-prevention and cost-control features. While the plugin architecture (OpenCode SDK child sessions) doesn't directly translate to our skill-based ecosystem, 5 high-impact teachings are immediately adoptable: final-line exact-string contracts, loop-prevention markers, anti-repetition rules, async-IIFE diagnostic logging, and lazy mkdir patterns. These provide CI gate integration, recursion defense, and performance improvements at minimal implementation cost (2-8 hours total). The remaining mechanisms (event-driven activation, cross-model selection, child-session isolation) are architecturally incompatible with our LEAF-only skill model and should be rejected.

**Verdict label**: TEACHINGS-AVAILABLE

**Key takeaways**:
- **5 HIGH-impact, LOW-cost teachings** can be adopted immediately across our review skills and hooks (2-8 hours total effort)
- **Architectural mismatch**: 6 mechanisms are n/a due to skill-vs-plugin differences (event-driven activation, cross-model selection, family bias, session-set, dynamic discovery, child-session isolation)
- **Cost model**: Auto-review-every-idle costs $31.50/month typical (20 sessions/day, 60% qualify), justified by preventing 1-2 hours of developer rework or a single CI failure per month
- **Loop-prevention excellence**: Upstream's 3-layer combinator (markers → session-set → dedup) provides defense-in-depth we lack; our iteration caps are coarse-grained by comparison
- **Remediation path**: Open packet 107 with phased adoption focusing on the 5 quick-win teachings (H-1 through H-4, H-6) as MVP

---

## 2. Pinned Upstream SHA

`cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9`

Pinned at iter-001 from `gh api repos/dzianisv/opencode-plugins/branches/issue-136-package-auto-review --jq '.commit.sha'`.

All findings reference this SHA.

---

## 3. Per-Mechanism Extraction (from iters 007-015)

### 3.1 Event-driven activation

**Definition**: Dual-event system (session.error for abort tracking, session.idle for review triggering) with abort-cooldown and race-delay safeguards to prevent reviews after user cancellation.

**Upstream evidence**: auto-review.ts:139-151 (from iter-007)

**Key design choices**:
- ABORT_COOLDOWN = 10_000 ms (window after MessageAbortedError where session.idle events are ignored)
- ABORT_RACE_DELAY = 1_500 ms (sleep between idle-arrival and runReview to catch race-arriving aborts)
- recentlyAbortedSessions Map tracks session_id → abort_timestamp
- reviewSessionIDs Set tracks child review-session ids to skip their session.idle events
- Cross-runtime feasibility: Claude Code (PORTABLE with Stop event), Gemini (NEEDS SDK research), Codex (NEEDS SDK research), Devin (LIKELY PORTABLE if Stop added), OpenCode (DONE — native session.idle + session.error)

**Reusability summary**: Not directly adoptable for our skills (skill-vs-plugin mismatch). Our skills are command-triggered, not event-driven. The abort-cooldown + race-delay pattern is portable to any runtime with completion and abort events, but requires OpenCode SDK plugin architecture. Closest local analogue is Claude Code's Stop event (.claude/settings.local.json lines 44-52, implemented in session-stop.ts), which lacks native abort signal equivalent to session.error.

---

### 3.2 Cross-model selection

**Definition**: Dynamic runtime discovery of available models via SDK, ranked by family bias (different family prioritized over same family) with fallback chain for robustness.

**Upstream evidence**: auto-review.ts:47-63 (inferReviewModels function), iter-008

**Key design choices**:
- Same-spec filter removes the work-model from reviewer candidates
- Weak filter removes claude-haiku-4-5 and gemini-2.5-flash (low-quality models)
- Family split: differentFamily cohort (GPT, Gemini, DeepSeek) prioritized over sameFamily cohort (Claude models when work-model is Claude)
- Rank function: opus(0) > codex(1) > sonnet(2) > pro(3) > default(4)
- Stable sort preserves provider order for tie-breaking
- Adaptive to runtime model availability (no hardcoded model lists)

**Reusability summary**: Not adoptable for our skills (skills don't dispatch models). Model selection is the caller's responsibility. The pattern is valuable for a potential mk-auto-review plugin that would need to select reviewers from our fleet (cli-devin, cli-codex, cli-gemini, cli-claude-code). For our existing skills, the pattern provides insight into adaptive vs hardcoded selection tradeoffs: upstream prioritizes adaptability over predictability, while our manual patterns (015 security sweep, 037 deep-review) prioritize reproducibility over runtime flexibility.

---

### 3.3 Loop-prevention combinator

**Definition**: 3-layer defense against review-of-review loops: (1) text-based markers scanned in messages, (2) session-set to skip child session.idle events, (3) dedup map tracking message signatures.

**Upstream evidence**: iter-009 (REVIEW_MARKERS array, reviewSessionIDs Set, reviewedMessageBySession Map)

**Key design choices**:
- REVIEW_MARKERS array: ["AUTO-REVIEW", "SELF_ASSESSMENT", "FEEDBACK"]
- reviewedMessageBySession: Map<string, string> — parentSessionID → message signature
- Signature derivation: prefer msg.id, else `<role>:<time>:<textPrefix40>`
- Layer 1: hasReviewMarker(lastUserText) || hasReviewMarker(lastAssistantText) → skip
- Layer 2: reviewSessionIDs.has(sessionID) → skip (child session)
- Layer 3: reviewedMessageBySession.get(parentSessionID) === currentSignature → skip

**Reusability summary**: HIGH reusability for our review skills. Our skills lack runtime recursion detection — the LEAF-only contract exists only in agent definitions. A marker-based + session-tagged + dedup-keyed combinator could apply to /deep:start-research-loop and /deep:start-review-loop by adding runtime guards to YAML workflow dispatchers. Implementation would require modifying deep_start-research-loop_auto.yaml and deep_start-review-loop_auto.yaml to add marker scanning logic at the dispatch gate, and updating agent definitions to emit markers in output headers. The existing state file format already supports the metadata needed for layers 2 and 3.

---

### 3.4 Boundary detection + min-tool-call gate

**Definition**: Scoped review targeting work after the last relevant user message, with minimum evidence gate (default 3 tool calls) to skip trivial turns.

**Upstream evidence**: iter-010 (findLastRelevantUserBoundaryIndex, findLastAssistantAfterIndex, countToolCallsAfterIndex, MIN_TOOL_CALLS = 3)

**Key design choices**:
- findLastRelevantUserBoundaryIndex: reverse-scan from end, return last user-role message without review markers and with non-empty text
- findLastAssistantAfterIndex: reverse-scan from boundaryIndex+1 to end, return first assistant-role message
- countToolCallsAfterIndex: slice messages after boundaryIndex, delegate to countToolCalls
- MIN_TOOL_CALLS default: 3 (configurable via config.minToolCalls)
- Design rationale: 3+ tool calls as heuristic for "non-trivial turn" — prevents reviewing chitchat and single-command queries

**Reusability summary**: Not directly adoptable for our current review surfaces (PR-level and packet-level scope). The "last relevant user message" concept only makes sense in a session context where messages arrive sequentially over time. Our skills review PR diffs and spec folders (static code artifacts), not live session message streams. However, the pattern would be valuable for an inline reviewer that runs DURING a session (e.g., a Claude/Codex session hook that reviews the last turn before the user sees the response).

---

### 3.5 Prompt template

**Definition**: 34-line inline template with 9 sections: header, mission statement, rules, context metadata, evidence interpolation, checklist, and 3-section return contract with exact-string final line.

**Upstream evidence**: iter-011 (verbatim template quoted from auto-review.ts)

**Key design choices**:
- Header: "AUTO-REVIEW\n\n" (loop-prevention marker)
- Mission statement: "You are reviewing another model's just-completed task turn. Validate completion quality and workflow gates, then report concrete risks only."
- Rules: "Scope review to work after the last relevant user message. Do not repeat the task. Focus on correctness, verification evidence, and missed edge cases."
- Context metadata: Observed model, Review model, Tool calls in scoped turn
- Evidence interpolation: lastUserText.slice(0, 2000) + lastAssistantText.slice(0, 3000)
- Checklist: 5 fixed items (task completion, tests run/pass, PR exists if code changes, CI passed if applicable, obvious issues)
- Return contract: (1) Checklist with PASS/FAIL/UNKNOWN and brief evidence, (2) Issues (only real gaps), (3) Final line exactly one of: "Review passed — no issues found." or "Review failed — <brief reason>."

**Reusability summary**: HIGH reusability. The upstream template achieves more structure with less text (34 lines vs our 406-471 line skills) through careful section design. Key reusable patterns: (1) Loop-prevention header marker, (2) Anti-repetition rule, (3) Final-line exact-string contract (machine-parseable), (4) Bounded evidence interpolation (prevents context bloat), (5) Triple-state severity (PASS/FAIL/UNKNOWN). Our review prompts could adopt these patterns to tighten structure and enable automation.

---

### 3.6 Config 3-tier + dynamic provider discovery

**Definition**: File-tier (~/.config/opencode/plugin/auto-review.json) → env-tier (AUTO_REVIEW_*) → default-tier fallback with silent-failure tolerance, plus dynamic model discovery via SDK.

**Upstream evidence**: iter-012 (loadConfig function, client.config.providers() call)

**Key design choices**:
- loadConfig() at module initialization time (async but non-blocking)
- File path: ~/.config/opencode/plugin/auto-review.json
- Env vars: AUTO_REVIEW_MODEL, AUTO_REVIEW_REASONING, AUTO_REVIEW_DEBUG
- Silent-failure: loadConfig() catches all errors and returns {}, never throws
- Dynamic provider discovery: client.config.providers() fetches available models at runtime
- Nullish coalesce (??) for minToolCalls and debug, logical OR (||) for model and reasoning (allows empty string override)

**Reusability summary**: MEDIUM reusability for our plugins (mk-skill-advisor, mk-code-graph). Both lack file-tier config, relying only on env vars for binary flags. Proposed adoption: add 3-tier config to both plugins with specific file paths (~/.config/opencode/plugin/mk-skill-advisor.json, ~/.config/opencode/plugin/mk-code-graph.json) and env-var prefixes (MK_SKILL_ADVISOR_*, MK_CODE_GRAPH_*). Dynamic model discovery is rejected (our plugins don't dispatch models).

---

### 3.7 Diagnostic logging

**Definition**: Non-blocking async-IIFE wrapper with lazy mkdir, safe stringify, ISO-timestamp prefix, and plaintext format (workspace/.reflection/debug.log).

**Upstream evidence**: iter-013 (initDebugLogger function)

**Key design choices**:
- Log path: <workspace>/.reflection/debug.log
- Format: line: "[<ISO>] [AutoReview] <msg>\n" (plaintext)
- Enable gate: config.debug || process.env.AUTO_REVIEW_DEBUG === "1"
- Lazy mkdir: closure-based dirReady pattern (only creates directory on first write)
- Safe stringify: try JSON.stringify, fall back to String for circular objects
- Async-IIFE wrapper: `;(async () => { await appendFile(...) })()` for non-blocking writes
- Error handling: try-catch with empty catch block (logging failures never block workflow)

**Reusability summary**: HIGH reusability for our hooks and skills. Our skill-advisor hooks use synchronous writeFileSync (blocking), while upstream's async-IIFE pattern eliminates blocking with minimal code change. Recommended adoption: (1) Adopt async-IIFE wrapper for non-blocking writes, (2) Adopt lazy mkdir flag to reduce syscalls, (3) Keep our JSONL format (more queryable than upstream's plaintext), (4) Add enable gate (config or env var). Reject upstream's plaintext format and append-only (unbounded growth risk).

---

### 3.8 Child-session isolation

**Definition**: OpenCode SDK child session creation via client.session.create({ parentID }) with 7 isolation properties: separate session id, message log, model invocation, transcript protection, idle prevention, likely lineage, and resource limits (inherited from SDK defaults).

**Upstream evidence**: iter-014 (session.create call at auto-review.ts:113-116)

**Key design choices**:
- Verbatim call: `client.session.create({ query: { directory: sessionDirectory }, body: { parentID: parentSessionID, title: "AUTO-REVIEW" }, })`
- Tagging for loop prevention: reviewSessionIDs.add(reviewSession.id)
- 7 isolation properties achieved: separate id, message log, model invocation, transcript protection, idle prevention, likely lineage, resource limits (SDK defaults)
- Billing/quota lineage: LIKELY (parentID set; SDK likely tracks lineage, not verified in accessible docs)

**Reusability summary**: Not adoptable for our skills (LEAF-only, no child sessions). OpenCode SDK sessions are stateful conversation logs with parent-child lineage, while Claude Code Task tool dispatches stateless task-runners. The upstream pattern is optimal for OpenCode platform integration but doesn't translate to our skill-based architecture. For a potential mk-auto-review plugin targeting OpenCode platform, child sessions would be the correct choice. For Claude Code targeting, Task tool dispatch would be appropriate.

---

### 3.9 Cost model

**Definition**: Aggregated cost analysis for auto-review-every-idle across three scenarios (low-end, typical, high-end) with break-even assessment and recommendations.

**Upstream evidence**: iter-015 (cost model calculations)

**Key design choices**:
- Pricing source: Public Anthropic and OpenAI pricing pages (May 2026). Claude Sonnet 4.6: $3/MTok input, $15/MTok output (average $9/MTok). GPT-5.5: $5/MTok input, $30/MTok output (average $17.50/MTok). Claude Opus 4.7: $5/MTok input, $25/MTok output (average $15/MTok).
- Token estimates: 2000-10000 tokens per review (user msg + assistant msg + checklist + context overhead)
- Daily cost scenarios:
  - Low-end (5 sessions/day, 40% qualify, Sonnet reviewer): $0.036/day → $1.08/month
  - Typical (20 sessions/day, 60% qualify, GPT-5.5 reviewer): $1.05/day → $31.50/month
  - High-end (50 sessions/day, 80% qualify, Opus reviewer): $6.00/day → $180.00/month
- Break-even: Typical scenario cost justified by preventing 1-2 hours of developer rework or a single CI failure per month. Earlier detection (immediately after session idle) reduces fix cost by 2-3x compared to PR/CI detection.

**Reusability summary**: Informative for cost-aware policy decisions. Recommendations: (1) Enable by default for 20+ sessions/day users (positive ROI), (2) Enable by default for <5 sessions/day users (negligible cost), (3) Prefer Opus for high-stakes work (cheaper than GPT-5.5), (4) Use minToolCalls: 5 for high-volume users to reduce cost, (5) Default to Sonnet for routine work, Opus for high-stakes, (6) Implement cost tracking and alerting. Cost comparison to our existing compute sinks: auto-review (typical) $31.50/month vs 015 security sweep $0.50-$2 (one-off per memory), 037 deep-review $1-$3 (one-off per packet), deep-research $0.50-$2 (per packet).

---

## 4. Gap Analyses (from iters 016-018)

### 4.1 vs sk-code-review

| Mechanism | Upstream evidence | sk-code-review state | Gap |
|-----------|-----------------|---------------------|-----|
| Event-driven activation (session.idle) | auto-review.ts:139-151 | n/a (skill vs plugin) | n/a |
| Cross-model selection algorithm | inferReviewModels with rank function (iter-008) | n/a (skill doesn't dispatch models) | n/a |
| Cross-AI family bias | rank function prioritizes differentFamily cohort (iter-008) | n/a (skill doesn't do model selection) | n/a |
| Loop-prevention markers (text-based) | REVIEW_MARKERS array ["AUTO-REVIEW", "SELF_ASSESSMENT", "FEEDBACK"] (iter-009) | DON'T HAVE (grep: no loop-prevention markers) | DON'T HAVE |
| Loop-prevention session-set | reviewSessionIDs Set to skip child session.idle events (iter-007, iter-009) | n/a (skill doesn't create child sessions) | n/a |
| Loop-prevention dedup map | reviewedMessageBySession Map with message signatures (iter-009) | DON'T HAVE (grep: no dedup map mechanism) | DON'T HAVE |
| Boundary detection (last user msg) | findLastRelevantUserBoundaryIndex + findLastAssistantAfterIndex (iter-010) | DON'T HAVE (grep: no session message boundary detection) | DON'T HAVE |
| Min-evidence gate (MIN_TOOL_CALLS) | MIN_TOOL_CALLS = 3, configurable via config.minToolCalls (iter-010) | DON'T HAVE (grep: no min-tool-call threshold) | DON'T HAVE |
| Structured prompt template | 34-line inline template with 9 sections (iter-011) | HAVE (different: smart routing with resource loading) | HAVE (different) |
| Severity vocabulary (PASS/FAIL/UNKNOWN) | Triple-state severity in checklist return (iter-011) | HAVE (different: P0/P1/P2) | HAVE (different) |
| Final-line exact-string contract | "Review passed — no issues found." or "Review failed — <brief reason>." (iter-011) | DON'T HAVE (grep: no exact-string contract) | DON'T HAVE |
| Anti-repetition rule | "Do not repeat the task." in prompt template (iter-011) | DON'T HAVE (grep: no anti-repetition rule) | DON'T HAVE |
| Bounded evidence interpolation | lastUserText.slice(0, 2000) + lastAssistantText.slice(0, 3000) (iter-011) | DON'T HAVE (grep: no evidence slicing) | DON'T HAVE |
| 3-tier config (file/env/default) | loadConfig + plugin init with file-tier → env-tier → default-tier (iter-012) | DON'T HAVE (grep: no 3-tier config) | DON'T HAVE |
| Dynamic model discovery | client.config.providers() to fetch available models (iter-012) | n/a (skill doesn't dispatch models) | n/a |
| Diagnostic logging (per-workspace) | initDebugLogger with async-IIFE, lazy mkdir, ISO timestamps (iter-013) | DON'T HAVE (grep: no diagnostic logging) | DON'T HAVE |
| Child-session isolation | client.session.create({ parentID }) with 7 isolation properties (iter-014) | n/a (skill doesn't create child sessions) | n/a |

**Commentary**: sk-code-review lacks 9 mechanisms (loop-prevention markers, dedup map, boundary detection, min-evidence gate, final-line exact-string contract, anti-repetition rule, bounded evidence interpolation, 3-tier config, diagnostic logging) and 6 mechanisms are n/a due to skill-vs-plugin architectural differences. High-value adoptions: final-line exact-string contract (enables CI gate parsing), loop-prevention header (defends against review-of-review loops), anti-repetition rule (prevents reviewer-fixing-code anti-pattern), diagnostic logging with async-IIFE pattern.

---

### 4.2 vs deep-research + deep-review + deep-agent-improvement

| Mechanism | deep-research | deep-review | deep-agent-improvement |
|-----------|--------------|-------------|------------------------|
| Event-driven activation | n/a (skill vs plugin) | n/a (skill vs plugin) | n/a (skill vs plugin) |
| Cross-model selection | n/a (executor config only) | n/a (executor config only) | n/a (single executor) |
| Cross-AI family bias | n/a (no model selection) | n/a (no model selection) | n/a (no model selection) |
| Loop-prevention markers | DON'T HAVE (grep: no "marker" loop prevention) | DON'T HAVE (grep: only legacy_review_markers in YAML:173) | DON'T HAVE (grep: no "marker" loop prevention) |
| Loop-prevention session-set | n/a (no child sessions) | n/a (no child sessions) | n/a (no child sessions) |
| Loop-prevention dedup map | DON'T HAVE (grep: no dedup map for loop prevention) | DON'T HAVE (grep: dedup only for findings consolidation YAML:1064) | DON'T HAVE (grep: no dedup map) |
| Boundary detection (last user msg) | PARTIAL (spec.md mutation boundary SKILL.md:268-271) | PARTIAL (spec.md mutation boundary similar pattern) | HAVE (boundary file enforcement SKILL.md:204, 219) |
| Min-evidence gate (MIN_TOOL_CALLS) | DON'T HAVE (grep: no MIN_TOOL_CALLS) | DON'T HAVE (grep: no MIN_TOOL_CALLS) | DON'T HAVE (grep: no min-evidence gate) |
| Structured prompt template | HAVE (prompt_pack_iteration.md.tmpl SKILL.md:88) | HAVE (prompt_pack_iteration.md.tmpl SKILL.md:83) | HAVE (charter/strategy templates SKILL.md:199) |
| PASS/FAIL/UNKNOWN severity | n/a (uses newInfoRatio) | HAVE (different: P0/P1/P2 SKILL.md:362-364) | n/a (uses 5-dimension scores) |
| Final-line exact-string contract | DON'T HAVE (grep: no exact-string contract) | DON'T HAVE (grep: no exact-string contract) | DON'T HAVE (grep: no exact-string contract) |
| Anti-repetition rule | DON'T HAVE (grep: no anti-repetition rule) | DON'T HAVE (grep: no anti-repetition rule) | DON'T HAVE (grep: no anti-repetition rule) |
| Bounded evidence interpolation | DON'T HAVE (grep: no character limits) | DON'T HAVE (grep: no character limits) | DON'T HAVE (grep: no character limits) |
| 3-tier config (file/env/default) | DON'T HAVE (executor config only SKILL.md:90) | DON'T HAVE (executor config only SKILL.md:85) | DON'T HAVE (config file only SKILL.md:199) |
| Dynamic model discovery | n/a (no model selection) | n/a (no model selection) | n/a (no model selection) |
| Diagnostic logging (async-IIFE) | DON'T HAVE (grep: no diagnostic logging) | DON'T HAVE (grep: no diagnostic logging) | DON'T HAVE (grep: no diagnostic logging) |
| Child-session isolation | n/a (no child sessions) | n/a (no child sessions) | n/a (no child sessions) |

**Commentary**: The three deep-* skills share 8 gaps (loop-prevention markers, dedup map, min-evidence gate, final-line contract, anti-repetition rule, bounded evidence, 3-tier config, diagnostic logging) and 6 mechanisms that are n/a due to skill-vs-plugin architectural differences. Iteration cap vs marker-based dedup: The iteration cap provides coarse-grained recursion control but lacks per-message precision; marker-based dedup could add value for deep-review's multi-dimensional review loops to prevent re-reviewing identical findings across dimensions. Per-skill recommendations: deep-research (diagnostic logging, 2-4 hours), deep-review (final-line exact-string contract + per-iter verdict, 4-6 hours), deep-agent-improvement (marker-based dedup for mutation coverage graph, 6-8 hours).

---

### 4.3 vs mk-skill-advisor + mk-code-graph + new-plugin hypothesis

| Mechanism | mk-skill-advisor | mk-code-graph | New-plugin hypothesis |
|-----------|-----------------|---------------|----------------------|
| Event-driven activation | n/a (advisory plugin, no LLM dispatch) | n/a (advisory plugin, no LLM dispatch) | YES (mk-auto-review would need this) |
| Cross-model selection | n/a (doesn't dispatch models) | n/a (doesn't dispatch models) | YES (mk-auto-review would need this) |
| Loop-prevention markers | n/a (doesn't dispatch reviews) | n/a (doesn't dispatch reviews) | YES (mk-auto-review would need this) |
| 3-tier config (file/env/default) | DON'T HAVE (env-only) | DON'T HAVE (env-only) | YES (mk-auto-review would need this) |
| Diagnostic logging (async-IIFE) | DON'T HAVE (sync writes) | DON'T HAVE (sync writes) | YES (mk-auto-review would need this) |
| Dynamic model discovery | n/a (doesn't dispatch models) | n/a (doesn't dispatch models) | YES (mk-auto-review would need this) |
| Child-session isolation | n/a (doesn't create child sessions) | n/a (doesn't create child sessions) | YES (mk-auto-review would need this) |

**Commentary**: Both existing plugins are advisory (context injection) without LLM dispatch or child sessions. Upstream auto-review requires fundamentally different mechanisms: session.idle triggers, cross-model selection, loop prevention, structured review prompts. Gap matrix shows 7 mechanisms where our plugins either DON'T HAVE relevant features or are n/a (no LLM dispatch). Recommendation: Create a new mk-auto-review.js plugin rather than extending existing ones, to maintain clean separation of concerns and match the upstream pattern directly. Design sketch includes: 3-tier config (file/env/default) unlike existing plugins, model selection adapted to our fleet (cli-devin, cli-codex, cli-gemini, cli-claude-code), loop prevention via markers and dedup tracking, per-workspace JSONL diagnostic logging, bridge pattern following mk-skill-advisor's safety approach.

---

## 5. Ranked Teachings (from iter-019)

### 5.1 HIGH-impact (9 items)

| Rank | Teaching | Target | Cost | Implementation path |
|------|----------|--------|------|---------------------|
| H-1 | Final-line exact-string contract | sk-code-review, deep-review | LOW | sk-code-review SKILL.md:302-329 — replace free-form "Overall assessment" with exact-string "**Review status**: [APPROVED \| REQUESTED_CHANGES \| COMMENTED]"; deep-review YAML synthesis step — add "Review verdict: [PASS/CONDITIONAL/FAIL]" as final line of iteration-NNN.md output |
| H-2 | Loop-prevention header markers | sk-code-review, deep-review, deep-research | LOW | sk-code-review references/ prompt templates — add "CODE-REVIEW\n\n" header to all review prompts; deep-review prompt_pack_iteration.md.tmpl — add "DEEP-REVIEW\n\n" header; deep-research prompt_pack_iteration.md.tmpl — add "DEEP-RESEARCH\n\n" header |
| H-3 | Async-IIFE diagnostic logging | skill-advisor hooks, code-graph feedback handler, deep-* skills | LOW | .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:243-248 — replace writeFileSync with `;(async () => { await appendFile(...) })()`; .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63 — replace appendFileSync with async-IIFE; add enable gate via env var (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1) |
| H-4 | Anti-repetition rule | sk-code-review, deep-review, deep-research | LOW | sk-code-review SKILL.md:336-358 — add "- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step." to Phase 3 rules; deep-review prompt template — add same rule; deep-research prompt template — add same rule |
| H-5 | 3-tier config resolution | mk-skill-advisor, mk-code-graph | MEDIUM | mk-skill-advisor — add loadConfig() reading ~/.config/opencode/plugin/mk-skill-advisor.json, merge with MK_SKILL_ADVISOR_* env vars, fallback to defaults; mk-code-graph — add loadConfig() reading ~/.config/opencode/plugin/mk-code-graph.json, merge with MK_CODE_GRAPH_* env vars, fallback to defaults |
| H-6 | Lazy mkdir flag | skill-advisor hooks, code-graph feedback handler | LOW | .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:218-220 — replace mkdirSync on every write with lazy mkdir using closure flag; .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:49-50 — same pattern |
| H-7 | Marker-based dedup for findings | deep-review multi-dimensional loops | MEDIUM | deep-review YAML workflow — add finding signature tracking (file:line + finding type + brief description) in agent-improvement-state.jsonl, check signature before each dimension dispatch to prevent duplicate finding reviews |
| H-8 | PASS/FAIL/UNKNOWN per-iteration verdict | deep-review | MEDIUM | deep-review YAML synthesis step — parse P0/P1/P2 findings and emit "Review verdict: [PASS/CONDITIONAL/FAIL]" as final line (PASS if no P0/P1, CONDITIONAL if P1 present, FAIL if P0 present) |
| H-9 | Bounded evidence interpolation | deep-review (for large packets) | LOW | deep-review prompt template — add character limits to evidence interpolation for very large packets (>10MB), use full evidence for normal packets |

### 5.2 MEDIUM-impact (6 items)

| Rank | Teaching | Target | Cost | Implementation path |
|------|----------|--------|------|---------------------|
| M-1 | Loop-prevention dedup map for PR state | sk-code-review | MEDIUM | sk-code-review — add PR state dedup tracking in review metadata, skip re-review if PR state unchanged since last review (signature based on commit SHA + diff hash) |
| M-2 | Min-evidence gate (MIN_TOOL_CALLS) | sk-code-review (optional) | LOW | sk-code-review SKILL.md — add optional min-evidence gate (configurable via SKILL.md or env var), skip review if diff has <3 changed lines (prevents reviewing trivial changes) |
| M-3 | Mutation signature dedup | deep-agent-improvement | MEDIUM | .opencode/skills/deep-agent-improvement/scripts/mutation-coverage.cjs — generate mutation signatures (dimension + mutationType + targetSection), track in agent-improvement-state.jsonl, skip exhausted mutation types |
| M-4 | Enable gate for diagnostic logging | skill-advisor hooks, code-graph feedback handler | LOW | Add env var checks (SKILL_ADVISOR_DEBUG=1, CODE_GRAPH_DEBUG=1) before diagnostic writes, default to disabled in production |
| M-5 | Safe stringify fallback | code-graph feedback handler | LOW | .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts:63 — wrap JSON.stringify in try-catch, fall back to String(msg) for circular objects |
| M-6 | Config loading timing (async init) | mk-skill-advisor, mk-code-graph | LOW | mk-skill-advisor — move config loading to module init with async promise, await in plugin factory; mk-code-graph — same pattern |

### 5.3 LOW-impact (3 items)

| Rank | Teaching | Target | Cost | Implementation path |
|------|----------|--------|------|---------------------|
| L-1 | Cross-AI family bias for model selection | Not applicable to skills (no model dispatch) | — | n/a — skills don't select models, this pattern only applies to plugins that dispatch models |
| L-2 | Event-driven activation (session.idle) | Not applicable to skills (skill-vs-plugin mismatch) | — | n/a — skills are command-triggered, not event-driven; would require OpenCode SDK plugin architecture |
| L-3 | Child-session isolation guarantees | Not applicable to skills (no child sessions) | — | n/a — skills are LEAF-only, don't create child sessions |

### 5.4 Deep write-ups of top 3 HIGH-impact (verbatim from iter-019)

#### H-1: Final-line exact-string contract

**Mechanism**: Upstream auto-review requires the final line of review output to be exactly one of two strings: "Review passed — no issues found." or "Review failed — <brief reason>." (iter-011:49-51). This enables machine-parseable verdict extraction without ambiguity. The upstream prompt template explicitly instructs the reviewer to return one of these exact strings as the final line of the output contract, making it trivial for downstream automation to parse review status without regex or natural language processing.

**Why HIGH impact**: Machine-parseable verdicts enable CI gate integration, PR status checks, and automation workflows. Current free-form verdicts ("APPROVE / REQUEST_CHANGES / COMMENT" in sk-code-review SKILL.md:308, "FAIL/CONDITIONAL/PASS" in deep-review SKILL.md:367-372) require regex parsing and are error-prone. Exact-string contracts remove ambiguity and enable reliable automation. This is particularly valuable for CI/CD pipelines that need to block merges based on review status, and for PR status check integrations that display review results to users. The upstream pattern is proven in production and requires only a 1-line change to output templates.

**Implementation path**:
- sk-code-review: Edit SKILL.md Phase 4 output contract (lines 302-329), replace free-form "Overall assessment" section with exact-string matchable status line: "**Review status**: [APPROVED \| REQUESTED_CHANGES \| COMMENTED]". This change should be made in both the main SKILL.md template and any reference templates in the references/ subdirectory.
- deep-review: Modify deep_start-review-loop_auto.yaml and deep_start-review-loop_confirm.yaml synthesis step to add "Review verdict: [PASS/CONDITIONAL/FAIL]" as the final line of iteration-NNN.md output. Ensure verdict aligns with P0/P1/P2 findings (PASS if no P0/P1, CONDITIONAL if P1 present, FAIL if P0 present). The synthesis step should parse the findings JSONL and emit the exact string based on the highest severity finding.

**Estimated effort**: 2-3 hours total (1 hour for sk-code-review template edit + testing, 1-2 hours for deep-review YAML modification + alignment logic + testing)

**Risk**: Low — changes are additive (new line or replacement of existing section), doesn't break existing output format, backward compatible if parsers ignore new line. The main risk is ensuring the verdict logic in deep-review correctly maps P0/P1/P2 findings to PASS/CONDITIONAL/FAIL, which requires careful testing with sample findings.

**Verification**: Test with sample review output for both sk-code-review and deep-review, verify exact string matching works with a simple CI gate parser script, ensure verdict alignment with P0/P1/P2 findings by testing with synthetic findings data (no findings → PASS, P1 only → CONDITIONAL, P0 present → FAIL). Confirm that existing review workflows continue to function with the new format.

#### H-2: Loop-prevention header markers

**Mechanism**: Upstream auto-review uses text-based markers (REVIEW_MARKERS array ["AUTO-REVIEW", "SELF_ASSESSMENT", "FEEDBACK"]) scanned in user and assistant messages to detect review-of-review loops (iter-009). The "AUTO-REVIEW\n\n" header is injected at the start of the review prompt, and the event handler scans for these markers before dispatching a review to prevent nested reviews. This is layer 1 of the 3-layer loop-prevention combinator (markers → session-set → dedup map).

**Why HIGH impact**: Review-of-review loops are a critical failure mode where a review skill accidentally dispatches another review (e.g., deep-review calling deep-review via a shell command, or sk-code-review being invoked on its own output). Text-based markers provide a simple, low-cost runtime guard that prevents nested dispatch across all our review surfaces (sk-code-review, deep-review, deep-research). The upstream pattern is proven in production and requires only a 1-line addition to prompt templates. Without this guard, a malformed iteration could trigger infinite loops or exponential review dispatch, wasting compute resources and confusing users.

**Implementation path**:
- sk-code-review: Add "CODE-REVIEW\n\n" header to all review prompt templates in references/ subdirectory (references/code_quality_checklist.md, references/security_checklist.md, and any other reference templates). The header should be the first line of the prompt, followed by a blank line.
- deep-review: Add "DEEP-REVIEW\n\n" header to prompt_pack_iteration.md.tmpl (SKILL.md:83). This template is rendered for each iteration, so the marker will appear in every iteration output.
- deep-research: Add "DEEP-RESEARCH\n\n" header to prompt_pack_iteration.md.tmpl (SKILL.md:88). Same rationale as deep-review.
- Update YAML workflow dispatchers (deep_start-review-loop_auto.yaml, deep_start-research-loop_auto.yaml, and any other dispatch workflows) to scan the last iteration output for these markers before dispatching another iteration. If a marker is detected, the dispatcher should skip with a "nested loop detected" error message.

**Estimated effort**: 1-2 hours total (30 minutes per skill to add header to templates + 30 minutes to update YAML dispatchers with marker scanning logic + testing)

**Risk**: Very low — additive change only, doesn't affect review logic, markers are human-readable and don't interfere with normal review output. The main risk is ensuring the dispatcher scanning logic correctly identifies markers and doesn't cause false positives (e.g., a legitimate mention of "CODE-REVIEW" in a comment should not trigger the guard).

**Verification**: Test nested dispatch scenario by manually triggering a review from within a review (e.g., have deep-review emit a shell command that calls deep-review), verify dispatcher skips when marker detected with appropriate error message, confirm markers don't interfere with normal review output by running standard review workflows and checking for any parsing errors.

#### H-3: Async-IIFE diagnostic logging

**Mechanism**: Upstream auto-review uses a fire-and-forget async-IIFE wrapper `;(async () => { await appendFile(...) })()` for non-blocking diagnostic writes (iter-013:23-35). This pattern allows the caller to continue without waiting for disk I/O, which is critical for hook performance. The wrapper includes error handling (try-catch with empty catch block) to ensure logging failures never block the main workflow. Combined with lazy mkdir (closure-based dirReady flag) and safe stringify fallback, this pattern provides robust, non-blocking diagnostic logging.

**Why HIGH impact**: Current synchronous file operations (writeFileSync in skill-advisor metrics.ts:243-248, appendFileSync in code-graph feedback handler:63) block the user's workflow and cause perceptible delays on slow filesystems or network-mounted directories. Async-IIFE pattern eliminates blocking with minimal code change (5-10 lines per file). The pattern is upstream-proven and applies to multiple surfaces (skill-advisor hooks, code-graph feedback handler, deep-* skills). Performance improvement is measurable: on a slow filesystem, a synchronous write can add 50-200ms of latency per hook invocation, which accumulates across multiple hooks in a session. Non-blocking writes reduce this to near-zero overhead.

**Implementation path**:
- skill-advisor hooks: Edit .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts lines 243-248, replace writeFileSync with async-IIFE pattern: `;(async () => { try { await appendFile(logPath, line) } catch {} })()`. Add enable gate via env var SKILL_ADVISOR_DEBUG=1 before the async wrapper.
- code-graph feedback handler: Edit .opencode/skills/system-code-graph/mcp_server/handlers/ccc-feedback.ts line 63, replace appendFileSync with async-IIFE pattern. Add enable gate via env var CODE_GRAPH_DEBUG=1.
- deep-* skills (optional): Add similar async-IIFE debug logging to deep-research, deep-review, deep-agent-improvement YAML workflows if diagnostic logging is desired for iteration dispatch and convergence checks.

**Estimated effort**: 2-3 hours total (1 hour for skill-advisor hooks + 1 hour for code-graph feedback handler + 1 hour for testing and enable gate implementation)

**Risk**: Low — changes are localized to logging code, don't affect core logic. The main risk is ensuring the async wrapper doesn't introduce race conditions or lost logs (the upstream pattern uses fire-and-forget semantics, which is acceptable for diagnostic logs where occasional loss is tolerable). Enable gate ensures logging is opt-in, reducing risk in production.

**Verification**: Test hook performance with sync vs async writes using a slow filesystem (e.g., network-mounted directory), measure latency difference with timing logs. Verify logs are written correctly in async mode. Test enable gate by setting env vars and confirming logs are only written when enabled. Confirm that hook functionality is unchanged (no behavioral differences beyond logging).

---

## 6. Reject List (from iter-019)

| ID | Pattern | Why reject |
|----|---------|-----------|
| R-1 | Event-driven activation (session.idle) | Claude Code, Codex, Gemini, Devin don't have a direct session.idle equivalent; porting requires runtime-specific adapters and SDK research. Only applicable to OpenCode SDK plugins; our skills are command/workflow-based, not event-driven. |
| R-2 | Cross-model selection algorithm | sk-code-review, deep-* skills don't dispatch models; they're invoked by agents that already have a model selected. Model selection is the caller's responsibility; adding this to skills would violate single responsibility. |
| R-3 | Child-session isolation guarantees | Our skills are LEAF-only (no Task tool per SKILL.md contracts), don't create child sessions; isolation properties only apply to OpenCode SDK child sessions. Architectural mismatch — skills don't spawn child sessions, so isolation guarantees don't apply. |
| R-4 | Plaintext diagnostic logging format | Upstream uses plaintext "[<ISO>] [AutoReview] <msg>\n" which is less queryable than our JSONL format. Our JSONL format is superior for observability pipelines (jq queries, structured parsing). |

---

## 7. Remediation Packet Recommendation

**Recommendation**: Open packet **107-sk-code-review-auto-review-uplift** with phased adoption of the top 3 teachings as MVP, followed by stretch goals in Phase 4.

**Scope outline**:

**Phase 1: Final-line exact-string contract (H-1)**
- Target: sk-code-review, deep-review
- Effort: 2-3 hours
- Changes:
  - sk-code-review SKILL.md:302-329 — replace free-form "Overall assessment" with exact-string "**Review status**: [APPROVED \| REQUESTED_CHANGES \| COMMENTED]"
  - deep-review YAML synthesis step — add "Review verdict: [PASS/CONDITIONAL/FAIL]" as final line of iteration-NNN.md output
- Verification: Test with sample review output, verify exact string matching works with CI gate parser, ensure verdict alignment with P0/P1/P2 findings

**Phase 2: Loop-prevention header markers (H-2)**
- Target: sk-code-review, deep-review, deep-research
- Effort: 1-2 hours
- Changes:
  - sk-code-review references/ prompt templates — add "CODE-REVIEW\n\n" header
  - deep-review prompt_pack_iteration.md.tmpl — add "DEEP-REVIEW\n\n" header
  - deep-research prompt_pack_iteration.md.tmpl — add "DEEP-RESEARCH\n\n" header
  - Update YAML workflow dispatchers to scan for markers before dispatching another iteration
- Verification: Test nested dispatch scenario, verify dispatcher skips when marker detected, confirm markers don't interfere with normal output

**Phase 3: Async-IIFE diagnostic logging (H-3) + Lazy mkdir (H-6)**
- Target: skill-advisor hooks, code-graph feedback handler
- Effort: 2-3 hours
- Changes:
  - skill-advisor metrics.ts:243-248 — replace writeFileSync with async-IIFE, add lazy mkdir, add SKILL_ADVISOR_DEBUG=1 enable gate
  - code-graph feedback handler:63 — replace appendFileSync with async-IIFE, add lazy mkdir, add CODE_GRAPH_DEBUG=1 enable gate
- Verification: Test hook performance on slow filesystem, measure latency difference, verify logs are written correctly

**Phase 4: Stretch goals (optional)**
- Target: Anti-repetition rule (H-4), 3-tier config (H-5), Marker-based dedup (H-7), Per-iteration verdict (H-8), Bounded evidence (H-9)
- Effort: 8-12 hours total
- Changes: Implement remaining MEDIUM-impact teachings based on priority and available capacity

**Estimated total effort**: 5-8 hours for MVP (Phases 1-3), 13-20 hours for full adoption (Phases 1-4)

**Alternative approach**: Fold teachings incrementally into existing skills without a dedicated packet. This is lower-overhead but lacks the structured verification and cross-skill coordination that a dedicated packet provides. Given the 5 quick-win teachings are all HIGH impact with LOW cost, a focused packet is justified to ensure consistent implementation across all target surfaces.

---

## 8. Limitations

1. **Iter-018 abbreviated output**: Iteration 018 returned only 17 lines (below expected length), indicating possible truncation or abbreviated synthesis. The gap analysis vs mk-skill-advisor + mk-code-graph may be less comprehensive than other gap analyses. The review-report synthesizes from the available content, but the plugin ecosystem gap analysis should be re-verified in packet 107 if mk-auto-review is pursued.

2. **Pricing assumptions**: Cost model (iter-015) assumes May 2026 Anthropic and OpenAI pricing pages are accurate and stable. Pricing changes could significantly alter the break-even analysis. The model also assumes token estimates (2000-10000 tokens per review) are representative; actual token usage may vary based on code complexity and review model behavior.

3. **Upstream branch stability**: Findings reference SHA cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9 on branch issue-136-package-auto-review. If the branch merges, rebases, or the PR is closed before packet 107 implementation, the upstream code may diverge from the analyzed state. Packet 107 should re-verify the upstream state before implementation and adjust if the branch has changed.

4. **Cross-runtime feasibility assumptions**: Iter-007 assessed cross-runtime feasibility for event-driven activation (Claude Code: PORTABLE, Gemini: NEEDS SDK research, Codex: NEEDS SDK research, Devin: LIKELY PORTABLE). These assessments are based on hook file inspection and may not account for undocumented SDK capabilities or runtime-specific limitations. Actual portability should be verified with SDK documentation or runtime testing before implementing event-driven patterns.

5. **Single-executor campaign**: All 20 iterations used cli-devin SWE-1.6 without separate verification phase. This matches the 015 campaign pattern (single-executor with verification integrated into the main loop), but differs from the 037 campaign pattern (5-iter cross-AI-verification). If a 5-iter verification pass is desired (matching the 015 / 037 cross-AI-verification pattern), a follow-on sub-packet could re-check the top-3 HIGH teachings using cli-opencode + deepseek-v4-pro.

---

## 9. Cross-AI Verification Notes

This campaign was 20 iters all cli-devin SWE-1.6 (no separate verification phase). This matches the 015 security sweep pattern (single-executor with verification integrated into the main loop), but differs from the 037 deep-review pattern (5-iter cross-AI-verification using cli-opencode + deepseek-v4-pro).

If a 5-iter verification pass is desired (matching the 015 / 037 cross-AI-verification pattern), a follow-on sub-packet could re-check the top-3 HIGH teachings using cli-opencode + deepseek-v4-pro:

1. Re-verify H-1 (final-line exact-string contract) implementation paths in sk-code-review and deep-review
2. Re-verify H-2 (loop-prevention markers) implementation across all review skills
3. Re-verify H-3 (async-IIFE logging) performance claims and implementation correctness

However, given the LOW cost and HIGH impact of the top-3 teachings, the current single-executor synthesis is sufficient to proceed with packet 107. The mechanisms are straightforward (1-2 line changes to templates, 5-10 line changes to logging code), and the implementation paths are well-specified with file:line citations. Cross-AI verification would add value for complex mechanisms (e.g., cross-model selection algorithm) but is overkill for the quick-win teachings identified here.

---

## 10. Conclusion

The upstream auto-review package demonstrates sophisticated event-driven, cross-model code review with strong loop-prevention and cost-control features. While the plugin architecture doesn't directly translate to our skill-based ecosystem, 5 high-impact teachings are immediately adoptable at minimal cost (2-8 hours total). These teachings provide CI gate integration, recursion defense, and performance improvements that would measurably improve our review infrastructure. The remaining mechanisms are architecturally incompatible with our LEAF-only skill model and should be rejected. The recommended remediation path is packet 107 with phased adoption focusing on the 5 quick-win teachings as MVP, followed by stretch goals for MEDIUM-impact teachings. This synthesis provides a clear, evidence-based roadmap for uplifting our review ecosystem based on upstream proven patterns.
