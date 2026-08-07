---
title: "Feature Specification: deep-research loop mining smallcode-master for small-model output-quality patterns"
description: "Level 3 deep-research target: 20 cli-devin SWE-1.6 iterations against external/smallcode-master, organized around 5 locked research questions (context budget engine, output verification pipeline, per-model profiles + escalation, structured permissions, skill architecture). Output: research/research.md synthesis with per-RQ candidate skill-deltas (file paths + acceptance criteria) ready to spawn follow-on remediation packets."
trigger_phrases:
  - "smallcode-master deep research"
  - "small-model patterns research"
  - "swe-1.6 dogfood loop"
  - "budget engine adoption research"
  - "skill architecture research smallcode"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/001-smallcode-deep-research"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 001 spec.md L3"
    next_safe_action: "Run preflight SWE-1.6 dispatch"
    blockers: []
    key_files:
      - "../preflight/context-card.md"
      - "../external/smallcode-master/PLAN.md"
      - "../external/smallcode-master/src/context/budget.ms"
      - "../external/smallcode-master/src/governor/verifier.ms"
      - "../external/smallcode-master/src/model/profiles.ms"
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/deep-research/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000001"
      session_id: "114-001-research-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "RQ5 outcome — new sk-small-model skill vs distributed references vs hybrid?"
      - "Whether bayesian tool-scoring lives in cli-* skills or mcp-code-mode tool registry"
      - "Per-model token-budget defaults — SWE-1.6 actual context window vs declared, fitToolResult thresholds"
    answered_questions:
      - "Executor = cli-devin SWE-1.6 full 20-iter dogfood (ADR-001)"
      - "RQ scope = 5 questions, dropped tool-routing+forgiving-parsing and auto-decompose (ADR-002)"
      - "Convergence math = newInfoRatio<0.15 × 3 OR cap 20 (ADR-003)"
      - "Preflight context-card is ground-truth evidence base cited per iteration (ADR-004)"
      - "Follow-on packets deferred to post-synthesis (ADR-005)"
---

# Feature Specification: deep-research mining smallcode-master for small-model patterns

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Mine the external `smallcode-master` corpus (MIT, terminal-native AI coding agent purpose-built for 7B–20B local models, 87% single-file success on Gemma 4 4B-active) for runtime patterns that small models like SWE-1.6 need to produce reliable output. Dogfood the research on cli-devin SWE-1.6 across 20 deep-research iterations against 5 locked research questions (context budget engine, output verification pipeline, per-model profiles + escalation, structured permissions, skill architecture). Synthesize `research/research.md` with per-RQ candidate skill-deltas (file paths + acceptance criteria) ready to spawn follow-on remediation packets. The dogfood policy itself validates RQ1's budget-engine thesis in flight, since SWE-1.6's smaller context window forces every iteration to cite the preflight context-card rather than re-read smallcode source from scratch.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | COMPLETE |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (114-small-ai-model-optimization phase parent) |
| **Parent Packet** | sk-prompt/004-sk-prompt-small-model-optimization |
| **Predecessor** | skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation |
| **Successor** | TBD (post-synthesis 002+ remediation packets driven by RQ5 architecture verdict) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 113 arc shipped cli-devin v1.0.6.3 with cross-model-validated prompt composition rules (RCAF default, medium pre-plan, standard bundle-gate, anti-hallucination secondary, sequential_thinking 2-layer). That fixes how we *compose* prompts. It does not fix runtime patterns small models need to deliver reliable output: token-aware context budgets, output verification pipelines that refuse to ship broken code, per-model profile registries, Pro-quota-aware escalation policies, and structured (non-prose) permission boundaries. The RM-8 2026-05-04 incident proved prose-only constraints fail under `deepseek-v4-pro --dangerously-skip-permissions` (44 files deleted before the loop self-corrected). `smallcode-master` (MIT, v0.2.2, May 2026, 87% single-file success on Gemma 4 4B-active beating OpenCode/Pi-Agent baselines on a 4× smaller model) ships exactly those missing runtime patterns.

### Purpose

Run 20 deep-research iterations dogfooded on cli-devin SWE-1.6 against `external/smallcode-master/`, producing `research/research.md` with per-research-question candidate skill-deltas (file paths + acceptance criteria) that follow-on packets implement. The dogfood is itself empirical evidence for RQ1 — every iteration cites the preflight context-card instead of re-reading smallcode source, validating the budget-engine thesis in flight under a real small-model executor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 5 locked research questions (RQ1–RQ5) — see §4 REQUIREMENTS
- Source corpus boundaries: (a) `../external/smallcode-master/` (entire repo, MIT, included verbatim); (b) `.opencode/skills/{cli-devin, cli-opencode, sk-prompt, sk-code, mcp-code-mode, system-skill-advisor, deep-research}` SKILL.md + references + assets; (c) `AGENTS.md` + `CLAUDE.md` at repo root; (d) external web research on small-model output-quality literature for triangulation
- 20-iteration cap with convergence detection (`newInfoRatio < 0.15` for 3 consecutive iters)
- `preflight/context-card.md` as ground-truth evidence base cited per iteration (Phase 0, dispatched separately before loop start)
- `research/research.md` synthesis surfacing per-RQ candidate deltas with: target file path(s), patch shape (new file vs edit existing), acceptance criteria, risk class
- Hand-off package to follow-on remediation packets (file list + delta summary)

### Out of Scope

- Implementing the recommended skill deltas — that lands in follow-on 002+ packets created after research.md exists
- Forking or contributing to smallcode-master upstream — inbound extraction only
- Replacing `mcp-code-mode`, `system-skill-advisor`, or `deep-research` infrastructure — integration recommendations OK, architectural rewrites are excluded
- Re-litigating 113-arc findings (RCAF, medium pre-plan, bundle-gate, sequential_thinking 2-layer) — those are inputs, not subjects
- Multi-language portability concerns (smallcode is JS/Marrowscript; our adoption targets are markdown + JSON skill assets)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research-smallcode/spec.md` | Create | This file |
| `001-research-smallcode/plan.md` | Create | Deep-research workflow + RQ tracking grid |
| `001-research-smallcode/tasks.md` | Create | Preflight → iters 1..20 → synthesis tasks |
| `001-research-smallcode/checklist.md` | Create | Level 3 quality gates |
| `001-research-smallcode/decision-record.md` | Create | ADR-001..005 |
| `001-research-smallcode/description.json` | Create | Generated by generate-context.js |
| `001-research-smallcode/graph-metadata.json` | Create | Generated by generate-context.js |
| `001-research-smallcode/research/**` | Create (deferred) | Populated by `/deep:start-research-loop:auto` at user trigger |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Research Questions (the 5 locked RQs — frozen scope per ADR-002)

#### RQ1 — Context Budget Engine

How do we adopt `external/smallcode-master/src/context/budget.ms` patterns into prompt composition for `cli-devin` (SWE-1.6) and `cli-opencode` (DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1)?

Source patterns: token-aware allocation (`totalBudget = context_length × max_budget_pct / 100`, default 70%), `fitToolResult()` truncation with `[... truncated N tokens]` markers, priority eviction (tool results → conversation), `maxAffordableLines()` heuristic (~60 chars/line), working-memory tokens (default 500), summary thresholds (200 lines).

Deliverables (per the synthesis): per-model token-budget defaults table (SWE-1.6 actual usable, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, Opus); eviction-priority ladder; truncation-marker syntax for prompt templates; reference doc location (`cli-devin/references/`, `cli-opencode/references/`, or new `sk-small-model/references/`).

#### RQ2 — Output Verification Pipeline

How do we layer smallcode's verifier (`src/governor/verifier.ms`) + hard-fail gatekeeper (`src/governor/hard_fail.ms`) onto our agent-config recipe system?

Source patterns: 4-stage pipeline (structural → compile → execute → smoke-test → lint), confidence scoring (`0.35×compiled + 0.25×executed + 0.25×tests_passed + 0.1×lint_clean − 0.05×auto_fixed`), hard-fail refusal message after max retries, tool transparency display (`✓` ≥70% / `~` 40-70% / `✗` <40% confidence).

Deliverables: hard-fail gatekeeper analog for `cli-devin` deep-loop iter contract; per-iter confidence rubric; recipe template additions to `agent-config-deep-research-iter.json` and `agent-config-deep-review-iter.json`; integration with existing `post-dispatch-validate.ts`.

#### RQ3 — Per-Model Profiles & Escalation

Should we build a unified per-model profile registry that cli-* skills consult, with Pro-quota-aware escalation rules?

Source patterns: `src/model/profiles.ms` (per-model context length, tool calling support `native/hermes/json/xml/text`, chat template, strengths/weaknesses); `src/governor/tool_scorer.ms` (Laplace-smoothed Bayesian per-task tool scoring, demotion >50% failure on 3+ calls); `bin/escalation.js` (local → cloud fallback on hard-fail, with conversation format conversion).

Deliverables: unified `model-profile.json` schema covering SWE-1.6 (free tier), DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1 (Pro quota), gpt-5.5, Opus, Sonnet, Gemini; escalation decision matrix (`when_to_downgrade`, `when_to_escalate`, `quota_aware`); home for the registry (a shared skill asset vs a new top-level config). Bayesian scoring left as separate recommendation.

#### RQ4 — Structured Scope / Permissions

Can we replace the four-layer prose mitigation (cli-opencode v1.3.3.0 ALWAYS #13) with a structured permissions matrix (JSON allowlist of file globs × operation classes)?

Source patterns: smallcode's tool registry encodes tool permissions structurally (declared at registry time, not in prose); RM-8 incident proved prose constraints alone insufficient under `deepseek-v4-pro --dangerously-skip-permissions`.

Deliverables: `permissions-matrix.schema.json` — file-glob × operation (`read | write | edit | delete | execute`) × scope (`packet-local | repo-wide | external`) — with allow/deny semantics; integration shape with `cli-opencode` iter dispatches (where the matrix lives, how it's enforced, how violations are detected); migration path from current four-layer prose.

#### RQ5 — Skill Architecture (synthesis question)

Given RQ1–4 deltas, do they become (a) a new `sk-small-model` skill with `enhances` edges to `cli-devin` / `cli-opencode`, (b) per-skill `references/` files inside existing skills, (c) cross-cutting refs in `sk-code` / `mcp-code-mode`, or (d) hybrid?

If a new skill is recommended: define `description.json` + `graph-metadata.json` trigger_phrases, key_topics, entities, source_docs, and `enhances` edges so `system-skill-advisor` 5-lane scorer (explicit_author / lexical / derived_generated / semantic_shadow / graph_causal; threshold 0.8 in `fusion.ts:41`) auto-surfaces the skill on prompts containing "small model", "swe-1.6", "output verification", "budget", "structured permissions", or when `cli-devin` / `cli-opencode` are already high-confidence.

Deliverables: architecture verdict with rationale; if new skill — full frontmatter + graph-metadata draft; if distributed — list of references files + their target paths; if hybrid — what's-where mapping; for any path, the AGENTS.md rule additions that codify the routing.

### Acceptance Criteria

| ID | Criterion | Verification |
|----|-----------|--------------|
| REQ-001 | All 5 RQs explored across ≤20 iters with ≥3 evidence citations per RQ before synthesis | `grep -c '^### RQ' research/research.md` = 5; per-RQ citation count audit |
| REQ-002 | Convergence event present in `research/deep-research-state.jsonl` (`type: converged`) OR iteration cap reached | `jq -r 'select(.type=="converged" or .iteration==20)' research/deep-research-state.jsonl` non-empty |
| REQ-003 | Every iteration delta in `research/deltas/` cites the preflight context-card OR a specific smallcode source file with line refs | grep audit of `cites:` field per delta |
| REQ-004 | `research/research.md` lists per-RQ candidate deltas with target file path, patch shape, acceptance criteria | manual review + line-count check ≥5 sections |
| REQ-005 | Strict-validate passes on 001 throughout the lifecycle (not just at start) | `validate.sh --strict 001-research-smallcode` exit 0 at every gate |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20 iterations (or fewer on convergence) complete with research.md synthesized
- **SC-002**: At least one concrete file-path-bound delta proposed per RQ
- **SC-003**: RQ5 verdict explicit and architecture-grounded — not deferred or hedged
- **SC-004**: Each delta carries acceptance criteria executable by a follow-on packet (no hand-waving "investigate further")
- **SC-005**: SWE-1.6 dogfood produces empirical evidence on at least 2 RQs that wouldn't have surfaced under an Opus-driven loop (e.g., observed truncation behavior, observed citation drift)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-devin SKILL.md v1.0.6.3 contract | Loop quality depends on prompt-quality discipline — RCAF, medium pre-plan, sequential_thinking 2-layer | Per-iter prompts use `agent-config-deep-research-iter.json` recipe with mandated sequential_thinking; CLEAR 5-check before dispatch |
| Dependency | SWE-1.6 free tier availability | If Cognition pulls free tier mid-run, loop costs change | Loop is interruptible; can resume on DeepSeek-v4-pro if needed; preserved as ADR-001 trade-off |
| Risk | SWE-1.6 reading limits on dense JS / Marrowscript source | Misread patterns from smallcode source → spurious deltas | Preflight context-card pre-reads and structures patterns; iters cite the card not raw source for most cases |
| Risk | Convergence detection false-positive (3 low-newInfo iters by accident) | Loop converges before RQ5 synthesis-quality threshold | Synthesis pass MUST cover all 5 RQs; if convergence triggers before all RQs explored, force one more synthesis iter |
| Risk | RQ5 punts to hedge ("further investigation") | No actionable architecture verdict | SC-003 explicitly requires verdict; checklist gate enforces it |
| Risk | Deltas overlap with already-shipped 113 findings | Wasted research budget | Per-iter prompt explicitly excludes the 7 already-shipped items listed in preflight context-card |
| Risk | Pro-quota burn for follow-on remediation packets | Cost overrun across 5+ child packets | Out of scope here; each follow-on packet plans its own executor |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Iter wall-clock ≤ 25 min on SWE-1.6 (per cli-devin v1.0.6.0 preset-reliability note: SWE-1.6 fast)
- **NFR-P02**: Total loop wall-clock ≤ 8 hours for 20 iters (allows session-level monitoring)
- **NFR-P03**: Synthesis pass ≤ 45 min on SWE-1.6 (longer cap; reads all deltas)

### Quality

- **NFR-Q01**: Per-iter `newInfoRatio` reported in JSONL delta with citation count and unique-source count
- **NFR-Q02**: Synthesis confidence-tagged per RQ (`high | medium | low` with rationale)
- **NFR-Q03**: At least one delta per RQ at `high` confidence

### Reliability

- **NFR-R01**: State writer is `reduce-state.cjs` only (per deep-research SKILL.md invariant)
- **NFR-R02**: Loop survives single-iter failure without state corruption (`stuck_recovery` event triggers after 3 consecutive failures)
- **NFR-R03**: All artifacts under `research/` are deterministically reconstructable from `deep-research-state.jsonl` + `iterations/*.md`

### Auditability

- **NFR-A01**: Every delta cites either preflight context-card OR specific smallcode `file:line` references
- **NFR-A02**: Iter prompts logged to `prompts/iter-NNN.md` for replay
- **NFR-A03**: Executor metadata (model, effort, tier) appears in each JSONL record via `executor-audit.ts`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- Empty smallcode source file: iter skips and notes in `newInfoRatio: 0` delta
- Smallcode source file > SWE-1.6 context: iter reads in chunks, summarizes per-chunk, cites composite
- preflight context-card missing or empty: loop refuses to start (Phase 2 enforces non-empty)

### Error Scenarios

- SWE-1.6 hard timeout (>25 min): iter marked `iteration_file_empty`, `stuck_recovery` event after 3 in a row
- Pro-quota exhausted mid-run (n/a for SWE-1.6 free tier, but possible if user switches executor): loop pauses, awaits manual resume
- Invalid embedding dimension on memory index (PE-Gate warning seen during Phase 1 metadata save): non-blocking, indexed-save still completes

### State Transitions

- Resume mid-loop: lifecycle event `resumed` with parent_session_id; `generation` unchanged
- Restart from scratch: lifecycle event `restarted`; archive existing `research/` under `research_archive/{timestamp}/`; mint fresh sessionId
- User trim mid-loop (e.g., abandon RQ3): not supported; ADR-002 freezes scope
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 5 RQs × ~4 iters + synthesis; touches cli-devin, cli-opencode, sk-prompt, possibly mcp-code-mode, possibly new skill |
| Risk | 14/25 | SWE-1.6 reading limits + dogfood-quality risk; ADR-001 trade-off accepted; preflight card mitigates |
| Research | 18/20 | Whole packet IS research; convergence math is well-defined but synthesis quality depends on SWE-1.6 output |
| Coordination | 18/25 | Cross-skill deltas; RQ5 architecture verdict shapes 5+ downstream packets |
| Reversibility | 10/15 | Pure research output (markdown + JSON) — no production code touched here; downstream remediation packets fully reversible |
| **Total** | **78/110** | **Level 3** (≥ 80 would be 3+; this packet sits just below the enterprise governance threshold) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Likelihood | Impact | Mitigation | Owner |
|---------|-------------|-----------|--------|------------|-------|
| R-001 | SWE-1.6 misreads dense Marrowscript source → spurious deltas | M | M | Preflight context-card pre-structures patterns; CHK-014 enforces citation accuracy | main agent (review) |
| R-002 | Cognition pulls SWE-1.6 free tier mid-run | L | M | Loop resumable on DeepSeek-v4-pro via lifecycle `resumed` event | user (executor swap) |
| R-003 | Convergence false-positive (3 low-newInfo iters by accident) | M | M | Synthesis pass MUST cover all 5 RQs; if convergence fires before RQ5 explored, force extra synthesis iter | YAML workflow |
| R-004 | RQ5 punts to "further investigation" with no actionable verdict | M | H | SC-003 + CHK-050 enforce explicit verdict; checklist gates block "done" claim | main agent (synthesis review) |
| R-005 | Deltas overlap with already-shipped 113-arc findings | M | L | Per-iter prompt explicitly excludes the 7 shipped items listed in preflight card | iter prompts |
| R-006 | Stuck recovery > 3 consecutive iter failures | L | H | Manual intervention via `/speckit:resume` with fresh strategy.md focus | user |
| R-007 | Pro-quota burn for follow-on packets (out of scope here) | n/a | n/a | Each follow-on packet plans its own executor | n/a |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

- **US-001 — As a skill author** maintaining cli-devin / cli-opencode, I want a research synthesis with per-RQ candidate skill-deltas (file paths + acceptance criteria) so I can spawn focused follow-on packets without re-doing the smallcode-master analysis.
- **US-002 — As the user driving small-model dispatch**, I want skill-advisor to auto-surface relevant small-model guidance (budget rules, verification patterns, permission schemas) when I invoke cli-devin or cli-opencode, so I don't have to remember to load sk-prompt or other skills manually.
- **US-003 — As an SWE-1.6 iter author** running this research loop, I want a preflight context-card cached at the parent level so each iter cites a structured pattern map instead of re-reading dense Marrowscript source — preserving my context budget for actual analysis.
- **US-004 — As a future packet planner** reading this research output, I want each RQ's recommended delta to include target file path + patch shape + acceptance criteria, so I can convert findings to executable scope without ambiguity.
- **US-005 — As a code-graph consumer** searching for small-model patterns, I want the research synthesis indexed with trigger phrases like "small model", "budget engine", "verification pipeline", "structured permissions", so semantic search surfaces it cleanly.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- RQ5 outcome: new `sk-small-model` skill, distributed references, or hybrid? Decision deferred to synthesis.
- Whether bayesian tool-scoring (RQ3 component) belongs inside cli-* skills' agent-config recipes or `mcp-code-mode` tool registry.
- Per-model token-budget defaults: SWE-1.6 declared context vs actually-usable (truncation onset). Empirical observation from the loop should inform.
- Whether the structured-permissions schema (RQ4) should also extend to `cli-claude-code` / `cli-codex` / `cli-gemini` or stay cli-opencode-scoped initially.
- AGENTS.md placement: add a sibling rule next to the existing CLI dispatch rule (line 39), or carve a new top-level "Small-Model Dispatch" section?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Preflight evidence**: `../preflight/context-card.md` (cited per iter)
- **External corpus**: `../external/smallcode-master/`
- **Predecessor lineage**: `../../113-cli-devin-prompt-quality/` — composition arc this builds on
- **Sibling docs**: `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- **Generated docs**: `description.json`, `graph-metadata.json`, `research/**`
