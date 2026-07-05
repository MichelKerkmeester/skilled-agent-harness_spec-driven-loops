---
title: "Feature Specification: Skill Documentation Drift Audit (Packet 031 Follow-Up)"
description: "Deep-review + deep-research investigation into whether SKILL.md files, references/, assets/, and READMEs across the repo went stale as a result of the 031-deep-loop-gpt-reliability packet's changes (phases 008-013 plus the mk-deep-loop-guard rename/integration)."
trigger_phrases:
  - "skill doc drift audit"
  - "stale skill docs"
  - "mk-deep-loop-guard integration audit"
  - "031 documentation follow-up"
importance_tier: "high"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/005-skill-doc-hygiene/001-skill-doc-drift-audit"
    last_updated_at: "2026-07-01T17:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase scaffolded; review fan-out about to start"
    next_safe_action: "Wait for both fanouts; verify each iteration with a fresh Sonnet 5 xhigh agent"
    blockers: []
    key_files:
      - "review/review-report.md"
      - "research/research.md"
      - "../011-deep-route-guard-plugin/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-014-init"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Do any of the 45 candidate skill docs below actually describe pre-031 behavior (stale), or were they already consistent?"
    answered_questions: []
---
# Feature Specification: Skill Documentation Drift Audit (Packet 031 Follow-Up)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `../` (deep-loops/031-deep-loop-gpt-reliability) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 031 (phases 008-013) changed real runtime behavior: `ai-council.md` converted from `mode: all` to `mode: subagent`, `orchestrate.md` gained deep-mode routing rows and was later bloat-reduced, a new `mk-deep-loop-guard.js` plugin was added and later renamed (from `deep-route-guard.js`), and `.opencode/agents/*.toml` mirrors were removed as an obsolete requirement. None of these changes have been checked against the repo's `SKILL.md` files, their `references/`/`assets/` trees, or top-level READMEs for drift — a skill doc could still describe pre-031 behavior, reference a removed/renamed file, or document an outdated agent-routing/mode claim.

### Purpose
Run a deep-review pass and a deep-research pass (GPT-5.5 high-fast executor, 10 iterations each) over the candidate skill-doc surface below, independently verified afterward by fresh Sonnet 5 xhigh agents, to produce a definitive, evidence-backed list of stale documentation (if any) plus recommended fixes.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — Candidate Files to Review

Discovered via `grep -rl "ai-council\|orchestrate\|deep-route-guard\|mk-deep-loop-guard\|deep-review\|deep-research\|mode-registry\|mode: all\|mode: subagent" .opencode/skills --include=SKILL.md --include=README.md`, plus top-level docs. `z_archive/` entries are explicitly excluded (already retired, not living docs).

- `.opencode/skills/README.md`
- `.opencode/skills/cli-claude-code/README.md`
- `.opencode/skills/cli-claude-code/SKILL.md`
- `.opencode/skills/cli-opencode/README.md`
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/deep-loop-runtime/README.md`
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-runtime/lib/README.md`
- `.opencode/skills/deep-loop-runtime/lib/council/README.md`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/README.md`
- `.opencode/skills/deep-loop-runtime/scripts/README.md`
- `.opencode/skills/deep-loop-runtime/tests/council/README.md`
- `.opencode/skills/deep-loop-workflows/README.md`
- `.opencode/skills/deep-loop-workflows/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/README.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/README.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/lib/README.md`
- `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/tests/README.md`
- `.opencode/skills/deep-loop-workflows/deep-context/README.md`
- `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/README.md`
- `.opencode/skills/deep-loop-workflows/deep-research/README.md`
- `.opencode/skills/deep-loop-workflows/deep-research/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-research/scripts/README.md`
- `.opencode/skills/deep-loop-workflows/deep-review/README.md`
- `.opencode/skills/deep-loop-workflows/deep-review/SKILL.md`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/README.md`
- `.opencode/skills/deep-loop-workflows/deep-review/scripts/tests/fixtures/blocked-stop-session/README.md`
- `.opencode/skills/mcp-click-up/README.md`
- `.opencode/skills/mcp-code-mode/SKILL.md`
- `.opencode/skills/sk-code-review/README.md`
- `.opencode/skills/sk-code-review/SKILL.md`
- `.opencode/skills/sk-design/README.md`
- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/design-interface/README.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-git/SKILL.md`
- `.opencode/skills/system-skill-advisor/README.md`
- `.opencode/skills/system-skill-advisor/mcp_server/README.md`
- `.opencode/skills/system-spec-kit/README.md`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/constitutional/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/README.md`
- `.opencode/skills/system-spec-kit/mcp_server/tests/search/README.md`
- `.opencode/skills/system-spec-kit/scripts/extractors/README.md`
- `.opencode/plugins/README.md`
- `AGENTS.md`
- `README.md`

Highest-priority subset (directly touched by 031's actual behavior changes): `deep-loop-workflows/SKILL.md`, `deep-loop-workflows/deep-review/SKILL.md`, `deep-loop-workflows/deep-research/SKILL.md`, `deep-loop-workflows/deep-ai-council/SKILL.md`, `deep-loop-workflows/deep-context/SKILL.md`, `deep-loop-runtime/SKILL.md`, `.opencode/plugins/README.md`.

### Out of Scope
- `.opencode/skills/z_archive/**` (retired, not living docs).
- Rewriting any skill doc directly in this investigation phase — findings only. Fixes route through a follow-up implementation phase.
- Spec-kit's own internal docs (`system-spec-kit/SKILL.md` etc.) unless a genuine 031-caused drift is found there too (031 touched agent mirror-sync tooling under `deep-loop-workflows`, not `system-spec-kit` directly).

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run a 10-iteration deep-review fan-out over the candidate file list | `review/lineages/gpt-fast-high/` (or `review/`) reaches synthesis with 10 completed iterations, `stopPolicy: max-iterations` honored |
| REQ-002 | Run a 10-iteration deep-research fan-out on the same investigative question | `research/lineages/gpt-fast-high/` (or `research/`) reaches synthesis with 10 completed iterations |
| REQ-003 | Every iteration independently re-verified before trust | A fresh Claude Sonnet 5 xhigh agent checks each of the 20 iteration files against real current file content |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Findings cite concrete evidence | Every confirmed finding has file:line + the specific 031-phase change it contradicts |
| REQ-005 | Consolidated output | `implementation-summary.md` lists confirmed findings (or confirms none found) |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both fan-outs (review + research) complete all 10 iterations each without a lock/state error.
- **SC-002**: 20/20 iteration files have a fresh-Sonnet-5-xhigh verification verdict attached.
- **SC-003**: The final findings list (or "none found" confirmation) is evidence-cited, not impression-based.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `opencode` CLI + `openai/gpt-5.5-fast` model access | Fan-outs cannot dispatch | Confirmed reachable earlier in packet 031 (phase 012 benchmark used the same executor) |
| Risk | GPT-5.5 CLI latency (3-10x Claude, per phase 012 benchmark) | Long wall-clock before findings are available | Both loops run in parallel via separate `fanout-run.cjs` invocations; run in background |
| Risk | A verifier trusts a hallucinated GPT finding | False-positive "stale doc" claim reaches the consolidated list | Fresh Sonnet 5 xhigh verifier re-reads the actual current file before confirming any finding |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Every finding must cite the stale doc's exact file:line and the specific 031-phase change it contradicts (spec.md/implementation-summary.md evidence), not a general impression.
- Both loops run with `stopPolicy: max-iterations` (exactly 10 iterations each, not early-convergence stop) per explicit operator instruction.
- Every iteration's findings are independently re-verified by a fresh Claude Sonnet 5 xhigh agent against the real current file content before being trusted in the final synthesis.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A doc mentions `mode: all` generically (e.g. explaining the concept) without claiming `ai-council` specifically has that mode — not a finding.
- A doc's reference to `deep-route-guard` is inside a preserved historical quote (research lineage artifacts, or an explicitly-dated "Follow-Up" note) — not a finding; those are intentionally preserved verbatim.
- A doc pre-dates 031 entirely and was never about deep-loop routing — out of scope, no finding.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [15/25] | 45 candidate docs, 2 loop types, no code changes |
| Risk | [5/25] | Read-only investigation; no production paths touched |
| Research | [18/20] | 20 real GPT-5.5 iterations + 20 independent verification passes |
| **Total** | **[38/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Do any of the 45 candidate skill docs actually describe pre-031 behavior (stale), or were they already consistent? **PENDING: awaiting fan-out synthesis + verification.**

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`

<!-- /ANCHOR:related-docs -->
