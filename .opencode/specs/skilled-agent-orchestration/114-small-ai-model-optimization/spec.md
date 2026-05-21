---
title: "Feature Specification: small-AI-model optimization — mine smallcode-master for cli-devin / cli-opencode / sk-prompt deltas"
description: "Phase parent for the deep-research arc that extracts small-model output-quality patterns (context budget engine, output verification, per-model profiles + escalation, structured permissions, skill architecture) from the external smallcode-master corpus and lands them as concrete deltas across our cli-* and sk-* skills."
trigger_phrases:
  - "small model optimization"
  - "smallcode-master research"
  - "swe-1.6 output quality"
  - "small-ai-model deep research"
  - "cli-devin small-model patterns"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 7 rename packet shipped"
    next_safe_action: "Close arc or start 115"
    blockers: []
    key_files:
      - "spec.md"
      - "007-rename-sk-ai-small-model/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000114"
      session_id: "114-phase-parent-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Executor for the 20-iter research loop: cli-devin SWE-1.6 (full dogfood) — locked via ADR-001 in 001-research-smallcode/decision-record.md"
      - "RQ scope: 5 questions (RQ1 budget, RQ2 verification, RQ3 profiles+escalation, RQ4 structured permissions, RQ5 architecture) — locked via ADR-002"
      - "Convergence math: newInfoRatio<0.15 × 3 OR cap 20 — locked via ADR-003"
      - "RQ5 outcome (post-synthesis): new sk-small-model skill (renamed sk-ai-small-model via Phase 7 on 2026-05-21) with enhances edges to cli-devin + cli-opencode — shipped via 002-foundation-routing"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: small-AI-model optimization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (all 6 phases shipped 2026-05-18) |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../` (skilled-agent-orchestration track root) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 113-cli-devin-prompt-quality-arc |
| **Successor** | TBD (post-synthesis remediation packets) |
| **Handoff Criteria** | 001-research-smallcode validates Level 3 strict; preflight context-card present; deep-research loop ready for user trigger |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Our cli-* dispatch surface (`cli-devin` for SWE-1.6, `cli-opencode` for DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1) and `sk-prompt`'s framework selection got measurably better through the 113 arc — RCAF default, medium pre-plan, standard bundle-gate, cross-model validation. But that arc optimized **prompt composition**. We have not yet addressed **runtime patterns** that small models need to produce reliable output: token-aware context budgets, output verification pipelines, per-model profile registries, escalation policies, and structured (non-prose) permission boundaries.

`smallcode-master` is a fresh, MIT-licensed, terminal-native AI coding agent purpose-built for 7B–20B local models. Its README documents 87% single-file success on Gemma 4 (4B active) — winning against OpenCode/Pi-Agent baselines on a 4× smaller model — via budget engine + 2-stage tool routing + forgiving JSON parser + hard-fail gatekeeper + bayesian tool scoring + auto-decomposition + local→cloud escalation. These are exactly the patterns missing from our small-model story.

### Purpose

This phase decomposition mines smallcode-master systematically (20 deep-research iterations, dogfooded on cli-devin SWE-1.6 to validate the budget thesis in flight), produces a synthesis with per-pattern skill-deltas (file paths + acceptance criteria), then spawns follow-on child packets that ship the deltas: extensions to `cli-devin` and `cli-opencode` references, possible new `sk-small-model` skill with `enhances` edges, AGENTS.md rule additions, and cross-cutting changes to `sk-code` / `mcp-code-mode`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and continuity live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read the entire `external/smallcode-master/` corpus (MIT-licensed, included verbatim under `external/`)
- Run a preflight SWE-1.6 context-gathering dispatch producing `preflight/context-card.md` — a structured pattern map cited by every research iteration
- Author 001-research-smallcode as a Level 3 deep-research target with 5 locked research questions (see 001/spec.md §2)
- Drive 20 `/spec_kit:deep-research` iterations (or fewer on convergence) producing `001/research/research.md` with per-RQ candidate deltas, citations, and acceptance criteria
- Defer all implementation of recommended deltas to post-synthesis follow-on packets (no 002+ stubs pre-created)

### Out of Scope
- Implementation of the recommended skill deltas (lands in separate child packets created after research.md exists)
- Re-litigating the 113 arc findings (SWE-1.6 prompt-quality contract, RCAF default, bundle-gate, sequential_thinking 2-layer) — those are inputs, not subjects of this research
- Forking smallcode-master or contributing upstream — this is an inbound extraction exercise only
- Replacing `mcp-code-mode`, `system-skill-advisor`, or `deep-research` infrastructure; the research may recommend integrations but architectural rewrites are explicitly excluded

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `114/spec.md` | Create | parent | Phase-parent shell (this file) |
| `114/description.json` | Create | parent | Phase-parent metadata (generated) |
| `114/graph-metadata.json` | Create | parent | Parent edges + children_ids (generated) |
| `114/preflight/context-card.md` | Create | parent (Phase 0) | SWE-1.6 evidence artifact (not a templated doc) |
| `114/001-research-smallcode/spec.md` | Create | 001 | Research scope, 5 RQs, methodology |
| `114/001-research-smallcode/plan.md` | Create | 001 | Deep-research workflow + RQ tracking grid |
| `114/001-research-smallcode/tasks.md` | Create | 001 | Preflight → iters 1..20 → synthesis tasks |
| `114/001-research-smallcode/checklist.md` | Create | 001 | Level 3 quality gates |
| `114/001-research-smallcode/decision-record.md` | Create | 001 | ADR-001..005 |
| `114/001-research-smallcode/description.json` | Create | 001 | Child metadata (generated) |
| `114/001-research-smallcode/graph-metadata.json` | Create | 001 | Child edges (generated) |
| `114/001-research-smallcode/research/**` | Create | 001 (deferred to user-triggered loop) | Populated by `/spec_kit:deep-research:auto` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-research-smallcode/` | Deep-research loop: 20 iters of cli-devin SWE-1.6 mining smallcode-master for 5 research questions. Output: `research/research.md` synthesis (1204 lines, HYBRID-with-Anchor verdict, 41 artifacts, 12 follow-on packets indexed). | **Complete** (synthesis shipped 2026-05-18) |
| 002 | `002-foundation-routing/` | Phase A: sentinel `sk-small-model` skill + AGENTS.md rule + per-skill `enhances` edges. P0 (foundation for 003-006). ~6 hrs. | **Complete** (shipped 2026-05-18) |
| 003 | `003-permissions-matrix/` | Phase B: structured permissions-matrix schema + runtime gate for cli-opencode, replacing RM-8 four-layer prose. P0 (RM-8 prevention). ~12 hrs. | **Complete** (shipped 2026-05-18) |
| 004 | `004-cli-devin-quality/` | Phase C: per-model token-budget engine + output-verification pipeline (compile/run/test/lint + hard-fail) for cli-devin SWE-1.6. P1 (daily quality lift). ~28 hrs. | **Complete** (shipped 2026-05-18) |
| 005 | `005-shared-intelligence/` | Phase D: unified model-profile registry + bayesian per-tool scoring + quota-pool-aware FALLBACK engine (NOT small→frontier escalator; user's rotation is small-only). P2. ~20 hrs. | **Complete** (shipped 2026-05-18) |
| 006 | `006-cross-skill-propagation/` | Phase E: propagate budget patterns to cli-opencode + sk-prompt. P3 (lower priority). ~5 hrs. | **Complete** (shipped 2026-05-18) |
| 007 | `007-rename-sk-ai-small-model/` | Post-completion rename: `sk-small-model` skill → `sk-ai-small-model` (filesystem + frontmatter + sibling enhances edges + manual playbooks + root behavioral docs + auto-memory + advisor reindex). Identity-only refactor; behavior unchanged. P1. ~35 min. | **In progress** (started 2026-05-21) |

**Model scope (confirmed 2026-05-18, refined post-implementation)**: Active small-model rotation is **SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1**. Dispatch matrix:
- **cli-devin** runs SWE-1.6 (Cognition free) + DeepSeek-v4-pro / Kimi-k2.6 / GLM-5.1 (Cognition Pro plan).
- **cli-opencode + DeepSeek API provider** runs DeepSeek-v4-pro (direct `DEEPSEEK_API_KEY`; requires `--pure`).
- **cli-opencode + opencode-go provider** runs DeepSeek-v4-pro / Kimi-k2.6 / Qwen3.6 / GLM-5.1 (workspace-wide opencode-go credit pool).
- Optional unverified separate-pool stubs: Claude Haiku (Anthropic), Gemini Flash (Google). Frontier models (Opus, Sonnet, gpt-5.5) are out of scope. Phase D's fallback router is quota-pool-aware and rejects same-pool retries.

**Roadmap**: See `roadmap/follow-on-phases.md` for the full phase-by-phase plan, dependency graph, sequencing rationale, and execution playbook.

**Recommended execution order**: A → B + C (parallel) → D → E. Phase A (002) is the gating foundation; B (003) and C (004) can run in parallel once A's routing is in place. D (005) needs at least one of B/C shipped. E (006) needs C.

**Phase F (007-hardening-ci) was deleted 2026-05-18** per user direction — CI staleness checks and over-broad-glob lints will be handled manually or deferred to a future packet if/when needed. The 007 slot was reused 2026-05-21 by the `sk-ai-small-model` rename packet (Phase 7 row above) — a different scope from the original hardening-CI plan.

### Phase Transition Rules

- 001 MUST pass `validate.sh --strict` independently before any 002+ packet is created
- Convergence of the deep-research loop (`newInfoRatio < 0.15` × 3 consecutive iters, or iteration cap 20) is the gate for synthesis
- Synthesis (`research/research.md`) MUST surface per-RQ candidate deltas with file paths + acceptance criteria before follow-on packets are spec'd
- Use `/spec_kit:resume 114-small-ai-model-optimization/001-smallcode-deep-research` to resume the research loop

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Parent (114) | 001-research-smallcode | Phase-parent lean trio validates; preflight context-card present; 5 RQs locked in 001/spec.md | `validate.sh --strict 114` exit 0; `ls 114/preflight/context-card.md`; `grep -c '^### RQ' 001/spec.md` = 5 |
| 001-research-smallcode | 002+ remediation packets | `research/research.md` exists; per-RQ deltas listed with file paths + acceptance criteria; convergence event in `deep-research-state.jsonl` | `jq '.type' research/deep-research-state.jsonl \| grep converged`; review-report or human read of research.md |
| 006-cross-skill-propagation | 007-rename-sk-ai-small-model | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- RQ5 (skill architecture) outcome: new `sk-small-model` skill with `enhances` edges to cli-devin/cli-opencode, distributed `references/` updates across existing skills, or hybrid? Decision deferred to post-synthesis.
- Whether bayesian tool-scoring (RQ3 component) belongs inside the cli-* skills' agent-config recipes or in `mcp-code-mode`'s tool registry layer.
- Whether `mcp-code-mode` should grow a "small-model" execution path that the skill advisor surfaces alongside cli-devin/cli-opencode when small-model dispatch is detected.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See `001-research-smallcode/` for per-phase spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- **Predecessor**: `../113-cli-devin-prompt-quality-arc/` — the prompt-composition arc this packet builds on
- **Preflight evidence**: `preflight/context-card.md` — SWE-1.6 pattern-extraction map cited by every research iteration
- **External corpus**: `external/smallcode-master/` (MIT, v0.2.2, May 2026) — research target
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
