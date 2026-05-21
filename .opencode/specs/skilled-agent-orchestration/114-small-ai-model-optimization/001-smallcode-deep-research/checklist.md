---
title: "Verification Checklist: deep-research mining smallcode-master for small-model patterns"
description: "Level 3 quality gates covering pre-loop validation, in-loop invariants, post-loop synthesis quality, and per-RQ acceptance criteria. P0 items are hard blockers."
trigger_phrases:
  - "smallcode research checklist"
  - "RQ acceptance criteria"
  - "deep-research quality gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 001 checklist.md"
    next_safe_action: "Author 001 decision-record.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000004"
      session_id: "114-001-checklist-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: deep-research mining smallcode-master

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All 5 RQs locked in spec.md §4 with acceptance criteria
- [ ] CHK-002 [P0] Workflow plan + RQ tracking grid present in plan.md
- [ ] CHK-003 [P0] ADR-001..005 captured (Accepted) in decision-record.md
- [ ] CHK-004 [P0] Preflight context-card exists at ../preflight/context-card.md (non-empty, sections per RQ)
- [ ] CHK-005 [P1] description.json + graph-metadata.json minted for 001 and 114
- [ ] CHK-006 [P1] 114 phase-parent strict-validates (lean trio) exit 0
- [ ] CHK-007 [P1] 001 Level 3 strict-validates exit 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Per-iter prompt rendered from `deep-research/assets/prompt_pack_iteration.md.tmpl` (no hand-rolled prompts)
- [ ] CHK-011 [P0] Each iter writes both iter markdown AND JSONL delta (per deep-research SKILL.md §3 invariants)
- [ ] CHK-012 [P0] State writes route through `reduce-state.cjs` only
- [ ] CHK-013 [P0] Per-iter tool calls ≤ 12 (LEAF constraint)
- [ ] CHK-014 [P1] Each iter cites preflight context-card OR specific smallcode file:line ref
- [ ] CHK-015 [P1] Executor metadata (model, effort, tier) appears in each JSONL record via executor-audit.ts
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

### RQ1 — Context Budget Engine

- [ ] CHK-020 [P0] ≥3 citations to `external/smallcode-master/src/context/budget.ms` with line refs
- [ ] CHK-021 [P0] Per-model token-budget defaults proposed (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, GLM-5.1 at minimum)
- [ ] CHK-022 [P1] Truncation-marker syntax proposed for prompt templates with example
- [ ] CHK-023 [P1] Reference doc location decided (`cli-devin/references/`, `cli-opencode/references/`, or new `sk-small-model/references/`)

### RQ2 — Output Verification Pipeline

- [ ] CHK-024 [P0] ≥3 citations to `external/smallcode-master/src/governor/{verifier,hard_fail,tool_scorer}.ms`
- [ ] CHK-025 [P0] Hard-fail gatekeeper analog proposed for cli-devin deep-loop iter contract
- [ ] CHK-026 [P1] Confidence-scoring rubric defined (compile/execute/test/lint weights)
- [ ] CHK-027 [P1] Integration shape with post-dispatch-validate.ts explicit

### RQ3 — Per-Model Profiles & Escalation

- [ ] CHK-030 [P0] ≥3 citations covering `src/model/profiles.ms`, `src/governor/tool_scorer.ms`, `bin/escalation.js`
- [ ] CHK-031 [P0] Unified model-profile.json schema proposed with ≥6 model entries (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1, plus a frontier reference)
- [ ] CHK-032 [P1] Escalation decision matrix proposed (when_to_downgrade / when_to_escalate / quota_aware)
- [ ] CHK-033 [P1] Bayesian tool-scoring placement decided (cli-* recipes vs mcp-code-mode)

### RQ4 — Structured Scope / Permissions

- [ ] CHK-040 [P0] ≥3 citations to smallcode's structural-permissions analog
- [ ] CHK-041 [P0] permissions-matrix.schema.json shape proposed (file globs × ops × scope)
- [ ] CHK-042 [P0] Migration path from current four-layer prose mitigation (cli-opencode v1.3.3.0 ALWAYS #13)
- [ ] CHK-043 [P1] RM-8 incident counter-example: schema would have prevented the 44-file deletion

### RQ5 — Skill Architecture (synthesis)

- [ ] CHK-050 [P0] Architecture verdict explicit: new skill / distributed refs / hybrid
- [ ] CHK-051 [P0] If new skill: full frontmatter + graph-metadata draft with `enhances` edges weight + threshold reasoning
- [ ] CHK-052 [P0] If distributed: target paths list inside `cli-devin/references/`, `cli-opencode/references/`, etc.
- [ ] CHK-053 [P0] AGENTS.md rule addition draft (sibling rule or new section)
- [ ] CHK-054 [P1] Skill advisor 5-lane score simulated for proposed sk-small-model frontmatter (expected lane contributions)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-060 [P0] research/research.md covers all 5 RQs with `### RQ` headers
- [ ] CHK-061 [P0] Each RQ section in research.md surfaces ≥1 candidate delta with target file path + patch shape + acceptance criteria
- [ ] CHK-062 [P0] No RQ defers to "further investigation" without explicit follow-on packet ID
- [ ] CHK-063 [P1] Each candidate delta has confidence tag (high / medium / low) with rationale
- [ ] CHK-064 [P1] Already-shipped 113-arc findings are not re-proposed (explicit cross-check)
- [ ] CHK-065 [P1] Hand-off package lists target follow-on packet IDs (e.g., 002-, 003-) per delta
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-070 [P1] No credentials, secrets, or API keys captured in iter markdown or research.md
- [ ] CHK-071 [P1] No prompts dispatched with `--dangerously-skip-permissions` (deep-research is read-only; no scope-escape risk)
- [ ] CHK-072 [P2] External corpus license confirmed MIT (no proprietary patterns smuggled in)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-080 [P0] spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md all present and validating
- [ ] CHK-081 [P0] description.json + graph-metadata.json present and indexed (memory_search returns)
- [ ] CHK-082 [P1] implementation-summary.md populated post-synthesis with final state + RQ index
- [ ] CHK-083 [P1] 114 phase-parent spec.md reflects 001 child status (Status column updated)
- [ ] CHK-084 [P2] Optional: handover.md if session boundaries cross
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P0] All canonical docs live at `001-research-smallcode/` root (spec/plan/tasks/checklist/decision-record/implementation-summary + .json metadata)
- [ ] CHK-091 [P0] Research artifacts live ONLY under `research/` subfolder
- [ ] CHK-092 [P0] Preflight context-card lives at `../preflight/context-card.md` (parent level, separate from 001)
- [ ] CHK-093 [P1] No drift between `description.json.specFolder` and actual folder path
- [ ] CHK-094 [P1] graph-metadata.json `parent_id` points to 114, `children_ids` empty (001 is a leaf)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Total checks**: 50+
- **P0 blockers**: 20+
- **P1 required**: 20+
- **P2 optional**: 5+
- **Per-RQ acceptance gates**: 5 × ≥3 P0 checks
- **Pass state for `done` claim**: all P0 checked with evidence, all P1 checked OR user-deferred, P2 documented

> Completion review runs through this entire list before any "claim done" assertion. Skip is permitted ONLY for items the user explicitly defers (record in decision-record.md as a follow-up ADR if needed).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Loop dispatched via `/spec_kit:deep-research:auto` (not hand-rolled bash loops, not direct `@deep-research` Task dispatch)
- [ ] CHK-101 [P0] State packet at `research/` (flat-first per deep-research SKILL.md §2)
- [ ] CHK-102 [P0] Executor pinned in `research/deep-research-config.json` (cli-devin SWE-1.6 per ADR-001)
- [ ] CHK-103 [P1] Strategy.md derived from spec.md §4 RQs verbatim
- [ ] CHK-104 [P1] Convergence event present OR cap reached, both well-formed in JSONL
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Iter wall-clock ≤ 25 min for SWE-1.6 (NFR-P01)
- [ ] CHK-111 [P1] Total loop wall-clock ≤ 8 hours (NFR-P02)
- [ ] CHK-112 [P1] Synthesis pass ≤ 45 min (NFR-P03)
- [ ] CHK-113 [P2] Per-iter context budget under SWE-1.6's actually-usable threshold (evidence for RQ1)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] research.md exists and is ready for follow-on packet authors to read
- [ ] CHK-121 [P0] implementation-summary.md updated post-synthesis with final RQ index
- [ ] CHK-122 [P0] 001 graph-metadata.json children_ids list any sub-phases (none expected; 001 is a leaf)
- [ ] CHK-123 [P1] Memory search returns research findings on small-model queries (validate via `memory_search`)
- [ ] CHK-124 [P1] Continuity ladder is fresh and recovery-ready (`/spec_kit:resume` works cleanly)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] No 113-arc findings re-proposed (cross-check against `feedback_*` memory entries for already-shipped items)
- [ ] CHK-131 [P0] External corpus license respected (MIT, no upstream contribution required)
- [ ] CHK-132 [P1] Strict-validate green at every gate (M0, M2, M4, M5, M6)
- [ ] CHK-133 [P1] No skill body-text references rendered (template invariance per `feedback_skill_docs_no_phase_references`)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P0] All references to smallcode source use `file:line` form, not bare file names
- [ ] CHK-141 [P0] All cli-devin/cli-opencode/sk-prompt references include version number where relevant
- [ ] CHK-142 [P1] Cross-references between this packet's docs are consistent (no stale links)
- [ ] CHK-143 [P1] research.md sections are scannable (clear `## RQ` headers, candidate-delta tables)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Reviewer | Date | Notes |
|------|----------|------|-------|
| Main agent author | claude (Opus 4.7 1M) | 2026-05-18 | Pre-loop spec packet authored, preflight queued |
| Loop executor | cli-devin SWE-1.6 | TBD (post-loop) | Per ADR-001 |
| Synthesis reviewer | claude (Opus 4.7) | TBD (post-synthesis) | Validate research.md RQ coverage + verdict quality |
| User | michelkerkmeester | 2026-05-18 (plan approval) | Approved plan + executor + RQ scope; final research.md acceptance TBD |
<!-- /ANCHOR:sign-off -->
