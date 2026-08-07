---
title: "Feature Specification: Skill Documentation Drift Remediation"
description: "Fix phase for the 6 confirmed drift clusters from phase 014's audit: stale ai-council direct-invoke guidance, stale .opencode/agents/*.toml mirror references (docs + deep-improvement scanner code), a stale plugins/README.md entrypoint count, and the orchestrate/cli-opencode routing tension."
trigger_phrases:
  - "skill doc drift remediation"
  - "ai-council direct invoke fix"
  - "toml mirror removal"
  - "plugins readme fix"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/005-skill-doc-hygiene/002-skill-doc-drift-remediation"
    last_updated_at: "2026-07-01T19:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 6 clusters patched and verified; packet complete"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - "../014-skill-doc-drift-audit/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-015-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Cluster 4 (deep-improvement scanner): retire the .opencode/agents/{name}.toml check entirely, matching the 2-runtime-mirror model already established via mirror-sync-verify.cjs earlier this session. Operator confirmed."
      - "Cluster 6: keep orchestrate's @deep-review row (load-bearing); narrow cli-opencode's internal wording instead. Confirmed via dedicated investigation."
---
# Feature Specification: Skill Documentation Drift Remediation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Predecessor** | `../014-skill-doc-drift-audit/` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 014's deep-review + deep-research audit (20 iterations, independently re-verified by fresh Claude Sonnet 5 agents) confirmed 6 real drift clusters across skill documentation and one scanner script, all caused by packet 031's real behavior changes (ai-council `mode: subagent`, orchestrate routing, the mk-deep-loop-guard rename, `.opencode/agents/*.toml` mirror removal). Living docs still describe pre-031 behavior, reference a retired mirror format, or undercount current plugin entrypoints.

### Purpose
Patch every confirmed finding to match current runtime reality, with no new behavior changes beyond what packet 031 already shipped — this is a documentation/scanner-config correction phase, not a fresh feature.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Cluster | Files | Fix |
|---|---|---|
| 1 | `cli-opencode/SKILL.md:31,285`; `README.md:76,164`; `assets/prompt_templates.md:372,386-392`; `manual_testing_playbook.md:417-423`; `agent-routing/multi-ai-council-multi-strategy.md:27-43,51` | Remove/replace direct `--agent ai-council` guidance with `/deep:ai-council` or Task-dispatch routing |
| 2/3 | `deep-research/SKILL.md:17-20` (+`capability_matrix.md:51-55`); `deep-review/SKILL.md:16-20` (+`loop_protocol.md:721-724`); `deep-context/SKILL.md:279-287,302`; `deep-loop-runtime/SKILL.md:253-261`; `deep-ai-council/SKILL.md:431-432` (+`output_schema.md:27-29`) | Remove the `.opencode/agents/*.toml` mirror requirement; describe only canonical `.md` + `.claude/agents/*.md` mirror |
| 4 | `deep-improvement/scripts/agent-improvement/scan-integration.cjs:18`; `README.md:81,161`; `feature_catalog/integration-scanning/runtime-mirrors.md:29`; `references/agent_improvement/integration_scanning.md:42-47,80-85`; `references/agent_improvement/mirror_drift_policy.md:41-43`; `references/shared/promotion_rules.md:94` | Retire the `.toml` mirror check from `MIRROR_TEMPLATES` (code) and its 6 supporting docs — 2-mirror model, matching `mirror-sync-verify.cjs`'s earlier fix this session |
| 5 | `.opencode/plugins/README.md:3,42-50` | Add `mk-deep-loop-guard.js` to the entrypoint count/table (3→6 or updated count, table row added) |
| 6 | `cli-opencode/SKILL.md:292`; `.opencode/agents/orchestrate.md:79` (+`.claude` mirror) | Pending dedicated routing investigation (operator chose to revisit orchestrate's routing rather than narrow cli-opencode's wording) |

### Out of Scope
- Any behavior change beyond what packet 031 already shipped and verified live.
- The pre-existing (non-031) `deep-ai-council` naming mismatch (`@deep-ai-council` playbook expectation vs. registry's `ai-council`) noted in phase 014 — tracked separately, not part of this fix phase.
- Re-running the full 20-iteration audit; this phase trusts phase 014's already-verified findings.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cluster 1 patched | No remaining direct `--agent ai-council` guidance in cli-opencode's SKILL.md/README.md/prompt template/playbook; scoped grep confirms |
| REQ-002 | Clusters 2/3/4 patched | No remaining `.opencode/agents/*.toml` reference in the 5 SKILL.md docs, their 2 referenced sub-docs, or `deep-improvement`'s scanner code + 6 docs; scoped grep confirms |
| REQ-003 | Cluster 5 patched | `plugins/README.md` entrypoint count and table match the real 6-file directory |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Cluster 6 resolved per investigation outcome | Either orchestrate's routing is restricted/reverted, or cli-opencode's wording is narrowed — per the dedicated investigation's recommendation and operator confirmation |
| REQ-005 | No regressions | Comment-hygiene, alignment-drift, and affected vitest suites still pass after edits |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A scoped re-grep for `--agent ai-council`, `.opencode/agents/*.toml`, and the deep-improvement TOML template string returns zero hits in living docs (excluding intentional historical quotes).
- **SC-002**: `deep-improvement`'s scanner code and docs agree with each other (2-mirror model) after the fix.
- **SC-003**: `validate.sh --strict` passes for this phase folder and any touched phase folders.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing `scan-integration.cjs` (real code, not just docs) could change scanner output shape for downstream consumers | Broken agent-improvement tooling | Run `deep-improvement`'s existing vitest suite after the edit; check for any test fixture asserting a 3-mirror shape |
| Risk | Cluster 6 fix direction depends on an investigation not yet complete | Wrong fix picked | Investigation runs before any Cluster 6 edit; other 4 clusters proceed independently since they don't depend on its outcome |
| Dependency | Phase 014's findings (this phase trusts them, doesn't re-verify) | If phase 014 had an undetected false positive, this phase would fix a non-issue | Phase 014 already ran 20/20 independent fresh-agent verifications with zero rejections |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Every edit preserves historical/changelog text that was correctly identified as intentional history (per phase 014's Confirmed Non-Findings), touching only living operational guidance.
- No comment-hygiene violations introduced in `scan-integration.cjs` (no spec-path/task-id embedding per the HARD BLOCK rule).

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A doc references `.opencode/agents/*.toml` inside a dated "Follow-Up" or historical section — preserve verbatim, do not edit.
- `cli-claude-code/SKILL.md:279`'s `--agent ai-council` example is Claude Code syntax with no `mode` concept — confirmed out of scope by phase 014, do not touch.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [18/25] | ~20 files across 4 skills, 1 code file, 1 pending decision |
| Risk | [8/25] | Docs + one scanner script; no runtime-agent behavior change |
| Research | [5/20] | Phase 014 already did the discovery/verification work |
| **Total** | **[31/70]** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Cluster 6 direction — pending dedicated routing investigation (see `_memory.continuity.open_questions`).

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Predecessor Audit**: See `../014-skill-doc-drift-audit/implementation-summary.md`

<!-- /ANCHOR:related-docs -->
