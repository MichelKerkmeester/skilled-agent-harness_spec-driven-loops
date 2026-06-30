---
title: "Upstream auto-review package research (20 iter cli-devin SWE-1.6)"
description: "20-iteration deep-research investigation of the upstream dzianisv/opencode-plugins auto-review package on branch issue-136-package-auto-review. Goal: extract reusable patterns (event-driven activation, cross-AI reviewer selection, loop-prevention markers, dedup, boundary detection, structured prompt contract) and propose concrete improvements to sk-code-review, deep-review, deep-research, deep-agent-improvement, and the mk-skill-advisor / mk-code-graph plugin ecosystem."
trigger_phrases:
  - "106 upstream auto-review research"
  - "dzianisv auto-review analysis"
  - "opencode-plugins auto-review teachings"
  - "session.idle auto-review pattern"
  - "cross-AI reviewer plugin"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research"
    last_updated_at: "2026-05-16T06:00:00Z"
    last_updated_by: "claude-opus-4-7-106-scaffold"
    recent_action: "packet_scaffolded_with_20_detailed_iter_prompts"
    next_safe_action: "dispatch_iteration_001_via_cli_devin_swe_1_6"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-state.jsonl"
      - "research/prompts/iteration-001.md..iteration-020.md"
      - "research/iterations/"
      - "research/review-report.md (final synthesis target)"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-106-upstream-auto-review"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Upstream auto-review package research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 (research-only; informs future remediation packets) |
| **Status** | Planned — awaiting iteration 001 dispatch |
| **Created** | 2026-05-16 |
| **Branch** | `main` (per memory; no feature branch) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The upstream `dzianisv/opencode-plugins` repository ships an `auto-review` OpenCode plugin (branch `issue-136-package-auto-review`) that automatically dispatches a cross-model review session whenever an OpenCode session goes idle. The plugin demonstrates several design choices we have not adopted in our own ecosystem: event-driven activation via `session.idle` hooks, dynamic provider/model discovery via the OpenCode SDK, deterministic cross-AI family ranking, marker-based loop prevention, abort-race handling, and a structured PASS/FAIL/UNKNOWN checklist contract. We need to evaluate whether any of these patterns would improve our local skills (`sk-code-review`, `deep-research`, `deep-review`, `deep-agent-improvement`) and the OpenCode plugin ecosystem (`mk-skill-advisor`, `mk-code-graph`).

### Purpose
Produce a `research/review-report.md` containing executive verdict, per-mechanism extraction tables, gap-analysis vs our local skills, ranked teaching list, reject list, and remediation packet recommendation — enabling a subsequent packet (107+ if pursued) to implement the highest-impact teachings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read every file in upstream `packages/auto-review/` (6 files: README.md, auto-review.example.json, auto-review.ts, index.ts, package.json, tsconfig.json)
- Extract every non-trivial mechanism into a named teaching with file:line evidence
- Gap-analyze against `sk-code-review`, `deep-research`, `deep-review`, `deep-agent-improvement`, `mk-skill-advisor.js`, `mk-code-graph.js`
- Rank teachings by reusability + impact (HIGH/MEDIUM/LOW)
- Produce final adjudication + remediation packet recommendation
- All work confined to `research/` subdirectory and packet spec docs

### Out of Scope
- Implementing any extracted teaching (deferred to follow-on packet 107+)
- Modifying upstream code (read-only investigation only)
- Modifying local source code outside packet boundary

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/iterations/iteration-{001..020}.md` | Create | Per-iter dispatch outputs |
| `research/review-report.md` | Create | Final synthesis (iter 020 target) |
| `research/deep-research-state.jsonl` | Append | Campaign-start + 20 iter events |
| `implementation-summary.md` | Update | Post-synthesis fill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Read every file in upstream `packages/auto-review/` (6 files) | All 6 file contents documented in iter 001-006 outputs |
| REQ-002 | Extract every non-trivial mechanism into a named teaching | Iters 007-015 produce one extraction-table-row per mechanism |
| REQ-003 | Gap-analyze against our skills | Iters 016-018 produce comparison tables for sk-code-review, deep-{review,research,agent-improvement}, plugins |
| REQ-004 | Rank teachings by reusability + impact | Iter 019 produces a ranked table with implementation-cost column |
| REQ-005 | Produce final adjudication + remediation recommendation | Iter 020 writes synthesis to `research/review-report.md` |
| REQ-006 | All findings cite upstream file:line or upstream commit SHA | Every claim in review-report.md backed by concrete pointer |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20/20 iteration files exist in `research/iterations/` with non-empty content.
- **SC-002**: `research/deep-research-state.jsonl` has ≥ 21 entries (1 campaign_start + 20 iteration events).
- **SC-003**: `research/review-report.md` authored with executive verdict + per-mechanism extraction tables + gap-analysis + ranked teaching list + remediation recommendation.
- **SC-004**: Strict validate (Level 1) returns exit 0.
- **SC-005**: At least 3 concrete teachings ranked HIGH-impact with implementation paths cited (file:line in our codebase + change description).
- **SC-006**: At least 1 reject-list entry documenting an upstream choice that doesn't fit our model.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | cli-devin SWE-1.6 hallucinates plausible file/line references in upstream | Wasted recommendations on non-existent code | Each iter MUST fetch the upstream file via WebFetch / `gh` API and cite exact line ranges. Final synthesis cross-checks. |
| Risk | Iteration drift — later iters duplicate earlier findings | Convergence stalls | Each iter has a specific dimension assigned; no overlapping scopes. Iter 020 synthesis dedups. |
| Risk | Upstream branch could change during research (PR merge / rebase) | Findings reference a moving target | Pin the commit SHA at iter 001 and require all subsequent iters to use the SAME ref. |
| Risk | Gap-analysis claims teachings without confirming our skill state | False "we don't have X" findings | Iters 016-018 MUST grep our codebase for the mechanism before claiming absence. |
| Dependency | cli-devin SWE-1.6 + network access to GitHub raw | Required for full 20-iter run | Verify at iter 001 prerequisites. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Does the `session.idle` auto-trigger pattern fit OpenCode (yes, that's what the upstream plugin targets) OR could it also fit Claude Code / Codex / Gemini / Devin via their hook surfaces? — Resolved by iter 016+.
2. **Q2**: Should we open packet 107 for remediation, or fold teachings into existing skills incrementally? — Resolved by iter 020 synthesis.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN (20 cli-devin SWE-1.6)

| # | Focus | Tier |
|---|-------|------|
| 001 | Pin upstream commit SHA + read README.md (purpose, install, config schema) | File read |
| 002 | Read auto-review.example.json (config schema sample) | File read |
| 003 | Read auto-review.ts part 1 (imports, types, config loading, debug logger) | File read |
| 004 | Read auto-review.ts part 2 (model resolution, inference, prompt builder) | File read |
| 005 | Read auto-review.ts part 3 (event handler, abort race, runReview flow) | File read |
| 006 | Read index.ts + package.json + tsconfig.json (entry + deps + build config) | File read |
| 007 | Event-driven activation: session.idle + session.error lifecycle + abort cooldowns | Mechanism extraction |
| 008 | Cross-model selection: inferReviewModels ranking algorithm + fallback chain | Mechanism extraction |
| 009 | Loop-prevention markers + reviewSessionIDs set + dedup map | Mechanism extraction |
| 010 | Boundary detection (findLastRelevantUserBoundaryIndex) + min-tool-call gate | Mechanism extraction |
| 011 | Prompt template structure: scope contract, checklist, final-line PASS/FAIL contract | Mechanism extraction |
| 012 | Config 3-tier (JSON file > env vars > defaults) + dynamic provider discovery | Mechanism extraction |
| 013 | Diagnostic logging (workspace/.reflection/debug.log) + lazy dir init pattern | Mechanism extraction |
| 014 | Child-session model (session.create with parentID) + isolation guarantees | Mechanism extraction |
| 015 | Aggregated cost model: how expensive is "auto-review every idle"? | Mechanism extraction |
| 016 | Gap analysis vs sk-code-review skill | Comparison |
| 017 | Gap analysis vs deep-research + deep-review + deep-agent-improvement | Comparison |
| 018 | Gap analysis vs mk-skill-advisor + mk-code-graph (OpenCode plugin ecosystem) | Comparison |
| 019 | Ranked teaching list with implementation cost + reject list | Synthesis |
| 020 | Final adjudication + remediation packet recommendation → write `research/review-report.md` | Synthesis |
<!-- /ANCHOR:iteration-plan -->

---

## 9. RELATED DOCUMENTS

- Upstream package: <https://github.com/dzianisv/opencode-plugins/tree/issue-136-package-auto-review/packages/auto-review>
- Pattern reference: 015 global security sweep (proven 20+5-iter cli-devin + cli-opencode workflow)
- Local skills under comparison: `.opencode/skills/{sk-code-review,deep-research,deep-review,deep-agent-improvement}/SKILL.md`
- Local plugin reference: `.opencode/plugins/{mk-skill-advisor.js,mk-code-graph.js}`
- cli-devin skill: `.opencode/skills/cli-devin/SKILL.md`
- deep-research skill: `.opencode/skills/deep-research/SKILL.md`
