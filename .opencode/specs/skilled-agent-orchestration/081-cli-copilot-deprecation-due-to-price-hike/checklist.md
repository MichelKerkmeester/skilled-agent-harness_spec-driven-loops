---
title: "Verification Checklist: cli-copilot Total Deprecation"
description: "P0/P1/P2 verification gates for the 081 packet. P0 items HARD BLOCK completion; P1 items REQUIRE either completion or user-approved deferral; P2 items may be deferred without approval. Every checked item carries [E:...] evidence."
trigger_phrases:
  - "cli-copilot checklist"
  - "deprecation verification"
  - "cli-copilot p0 gates"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike"
    last_updated_at: "2026-05-06T12:35:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Author resource-map.md"
    blockers: []
    completion_pct: 45
---

# Verification Checklist: cli-copilot Total Deprecation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- **P0 (Blocker):** MUST be `[x]` with evidence before completion. HARD BLOCK if any P0 incomplete.
- **P1 (Required):** MUST be `[x]` with evidence OR have documented user-approved deferral. SOFT BLOCK if any P1 unaddressed.
- **P2 (Nice-to-have):** Deferral allowed without explicit approval; document deferral reason in `implementation-summary.md`.
- **Evidence format:** `[x] CHK-NNN [Pn] Description [E:file:lines]` or `[E:command output snippet]`. The evidence pointer MUST resolve to a real file or command output.

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] **CHK-001 [P0]** Discovery output captured at `/tmp/cli-copilot-non-skill-hits.txt` with 718 file count from sweep.
- [ ] **CHK-002 [P0]** Predecessor packet `080-multi-ai-council-output-protocol` is complete (`implementation-summary.md` exists).
- [ ] **CHK-003 [P0]** Git branch is `main`; no leftover `081-*` packet branch.
- [ ] **CHK-004 [P0]** spec.md, plan.md, tasks.md, checklist.md, resource-map.md all exist and pass `validate.sh --strict`.
- [ ] **CHK-005 [P0]** cli-codex skill is loadable; dispatch command pattern confirmed.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] **CHK-101 [P0]** Skill folder physically deleted: `[ ! -d .opencode/skills/cli-copilot ]` returns true.
- [ ] **CHK-102 [P0]** Global skill changelog folder physically deleted: `[ ! -d .opencode/changelog/cli-copilot ]` returns true.
- [ ] **CHK-103 [P0]** Hooks deleted: `[ ! -f .github/hooks/spec-kit-copilot-hook.sh ] && [ ! -d .opencode/skills/system-spec-kit/mcp_server/hooks/copilot ]`.
- [ ] **CHK-104 [P0]** Matrix adapter + smoke test deleted: `[ ! -f .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts ] && [ ! -f .opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-copilot.vitest.ts ]`.
- [ ] **CHK-105 [P0]** Copilot-specific feature catalog + playbook docs deleted: `36-copilot-target-authority-helper.md`, `21-shared-provenance-and-copilot-compact-cache-parity.md`, `274-shared-provenance-and-copilot-compact-cache-parity.md`, `030-cli-copilot-target-authority-dispatch.md` (deep-research), `016-cli-copilot-target-authority-dispatch.md` (deep-review).
- [ ] **CHK-106 [P0]** No `.bak`, `.old`, `.deprecated`, or `z_archive/` containing cli-copilot copies created during deletion (DELETE-not-archive policy).
- [ ] **CHK-107 [P0]** No commented-out tombstone blocks left in skill_advisor.py, skill-graph.json, or other edited files.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] **CHK-201 [P0]** Live-config grep gate passes: `grep -rln 'cli-copilot' . [exclude flags]` returns hits ONLY in this packet's spec docs.
- [ ] **CHK-202 [P0]** Skill advisor smoke test: `python3 skill_advisor.py "use copilot cli"` returns zero cli-copilot in top-N recommendations.
- [ ] **CHK-203 [P0]** Skill advisor smoke test: `python3 skill_advisor.py "delegate to copilot for cloud delegation"` returns zero cli-copilot in top-N recommendations.
- [ ] **CHK-204 [P1]** Skill advisor regression battery passes after deletion of P1-CLI-004 line; no other regression case false-positives on cli-copilot.
- [ ] **CHK-205 [P1]** `mcp__spec_kit_memory__skill_graph_scan` returns no cli-copilot node.
- [ ] **CHK-206 [P1]** `mcp__spec_kit_memory__code_graph_scan` reflects deletion (file count drops, edges purged).

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] **CHK-FIX-001 [P0]** Each actionable finding (cli-copilot mention) classified: `instance-only` (single-file mention), `class-of-bug` (systemic peer-list pattern), `cross-consumer` (referenced by another doc/agent/command), `algorithmic` (advisor scoring math), `matrix/evidence` (matrix-runner test fixtures), or `test-isolation` (workflow-invariance allowlist).
- [ ] **CHK-FIX-002 [P0]** Same-class producer inventory completed: every advisor scoring file (skill_advisor.py, skill-graph.json, graph-metadata.json, regression cases JSONL, sync-card script) handled in batch B2.
- [ ] **CHK-FIX-003 [P0]** Consumer inventory completed: sibling cli-* skills, agents, commands, routing docs, playbooks, feature catalogs all enumerated in resource-map.md and assigned to a batch.
- [ ] **CHK-FIX-004 [P0]** Adversarial verification: live-config grep run with multiple exclude variants (with/without specs, with/without changelog) to confirm zero leakage; advisor smoke test with multiple phrasings (use copilot, delegate to copilot, cloud delegation, copilot cli).
- [ ] **CHK-FIX-005 [P1]** Matrix axes listed: 4 runtimes × 7 batches × 6 buckets = full coverage matrix in implementation-summary.md.
- [ ] **CHK-FIX-006 [P1]** Hostile-state variant executed: confirm grep gate behavior when uncommitted edits exist (mirror of project memory rule on dirty worktree); confirm advisor rebuild idempotency on second run.
- [ ] **CHK-FIX-007 [P1]** Evidence pinned to fix SHA: implementation-summary.md cites the commit SHA (or staged diff range) where cli-copilot was removed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] **CHK-301 [P0]** No edits applied to `AGENTS_Barter.md` symlink target (canonical `AGENTS.md` only).
- [ ] **CHK-302 [P0]** No edits applied inside `node_modules/`, `dist/`, `.git/`, `.venv/`, or `z_archive/`.
- [ ] **CHK-303 [P1]** Memory entry `memory/feedback_copilot_concurrency_override.md` annotated with deprecation marker (not deleted).

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] **CHK-401 [P0]** Routing docs (CLAUDE.md, AGENTS.md, README.md, DEPLOYMENT.md, .opencode/skills/README.md, both install_guides) contain zero cli-copilot references.
- [ ] **CHK-402 [P0]** Sibling cli-* skill bodies (cli-claude-code, cli-codex, cli-gemini, cli-opencode — SKILL.md + README.md + graph-metadata.json + manual_testing_playbook + references + assets) contain zero cli-copilot references in current-state prose; historical changelog/v*.md mentions allowed.
- [ ] **CHK-403 [P0]** Agent + command files (multi-ai-council × 4 runtimes; deep-research.md; deep-review.md; spec_kit_deep-research_auto.yaml) contain zero cli-copilot references.
- [ ] **CHK-404 [P1]** Cross-skill manual-testing-playbook + feature-catalog references in sk-doc, sk-code, sk-improve-prompt, deep-research, deep-review, deep-agent-improvement, system-spec-kit/feature_catalog, system-spec-kit/manual_testing_playbook contain zero cli-copilot references in current-state prose.
- [ ] **CHK-405 [P0]** spec.md, plan.md, tasks.md, checklist.md, resource-map.md, implementation-summary.md all author-time-validate cleanly with `validate.sh --strict` (exit 0).

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] **CHK-501 [P0]** Mirror parity: `multi-ai-council` content matches across `.opencode/agents/`, `.claude/agents/`, `.gemini/agents/`, `.codex/agents/` (allowing for runtime-specific format differences).
- [ ] **CHK-502 [P1]** Matrix runner files (run-matrix.ts, matrix-manifest.json, README.md) cleanly drop the cli-copilot adapter; runtime tests still build (no orphaned imports of the deleted adapter file).
- [ ] **CHK-503 [P1]** Skill advisor scoring is internally consistent: TOKEN_BOOSTS keys match PHRASE_BOOSTS keys, skill-graph.json node IDs are valid, no dangling references to a deleted node.
- [ ] **CHK-504 [P2]** Workflow-invariance test (`workflow-invariance.vitest.ts`) passes; if a maintainer-doc legitimately retains "cli-copilot" vocabulary, the path is added to `isAllowedHit()`.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Section | P0 Items | P1 Items | P2 Items |
|---------|----------|----------|----------|
| Pre-Implementation | 5 | 0 | 0 |
| Code Quality | 7 | 0 | 0 |
| Testing | 3 | 3 | 0 |
| Security | 2 | 1 | 0 |
| Documentation | 4 | 1 | 0 |
| File Organization | 1 | 2 | 1 |
| **TOTAL** | **22** | **7** | **1** |

**Completion gate:** All 22 P0 items marked `[x]` with evidence + 7 P1 items marked `[x]` or deferred with documented reason. P2 deferral allowed without approval. `implementation-summary.md` MUST cite this checklist with total counts.

<!-- /ANCHOR:summary -->
