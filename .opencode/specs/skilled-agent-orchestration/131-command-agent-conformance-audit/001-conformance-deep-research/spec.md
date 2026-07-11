---
title: "Feature Specification: Phase 1: Conformance Deep-Research"
description: "Commands, /doctor routes, agents, and presentation assets have drifted from current skill reality: dead slash commands, wrong self-referential paths, undocumented doctor routes, and stale catalogs all ship live. This phase runs one 15-iteration /deep:research investigation across all four surfaces to produce a ranked, file:line-cited findings synthesis that the later remediation phases consume."
trigger_phrases:
  - "conformance deep research"
  - "command agent audit research"
  - "deep-research 15 iterations three models"
  - "command asset drift investigation"
  - "001-conformance-deep-research"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "fable-5"
    recent_action: "Delivered research.md: 30 ranked findings, 15 iterations, 3 models"
    next_safe_action: "Consume research.md findings across phases 002-006"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research/research/research.md"
      - ".opencode/specs/skilled-agent-orchestration/131-command-agent-conformance-audit/001-conformance-deep-research/research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does opencode honor --variant xhigh/max for the openrouter-anthropic and GLM providers? providers honored --variant xhigh/max; smoke-tested before each batch"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: Conformance Deep-Research

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | 002-remediation-slash-commands |
| **Handoff Criteria** | research.md synthesis exists with all findings partitioned by surface (commands / doctor / agents / cross-surface) and severity (P0/P1/P2), each carrying file:line + a concrete fix; all 15 iterations logged in deep-research-state.jsonl (grep count == 15); no batch stopped before its iteration cap. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Command, agent, and asset conformance audit against current skill reality specification.

**Scope Boundary**: This phase is the investigation only — it AUDITS and RANKS, it does not remediate. It reads every `command.md` (42), workflow/route YAML (62), presentation `.txt` (35), and the deep compiled contracts under `.opencode/commands/**`; the entire `/doctor` subsystem; all 12 agents mirrored across `.claude/agents/` + `.opencode/agents/`; and cross-surface logic alignment (command ↔ skill ↔ agent ↔ advisor). READMEs and install-guide catalogs are OUT of scope here — phase `005` owns them. The only files this phase WRITES are its own `research/` artifact tree under this child folder; it changes zero audited source files.

**Dependencies**:
- `/deep:research` (system-deep-loop research mode) and its runtime under `.opencode/skills/system-deep-loop/runtime/`.
- Three executor providers reachable via `cli-opencode`: `openai/gpt-5.6-sol-fast`, `openrouter/anthropic/claude-sonnet-5`, `zai-coding-plan/glm-5.2`.
- The audited surfaces must be on-disk at their current paths (`.opencode/commands/**`, `.opencode/agents/`, `.claude/agents/`, doctor `_routes.yaml`).

**Deliverables** (the deep-research runbook this phase executes):
- ONE `/deep:research` investigation of **15 iterations**, executor rotated in **3 batches of 5**, over the SAME `--spec-folder` = this child folder, producing a single auto-resumed lineage.
- **Batch 1** (iters 1-5, GPT 5.6 Sol high Fast): `/deep:research:auto "<topic>" --spec-folder=<THIS_FOLDER> --max-iterations=5 --executor=cli-opencode --model=openai/gpt-5.6-sol-fast --reasoning-effort=high --executor-timeout=1800`. ("Fast" is the `-fast` model slug, NOT a `--service-tier`; passing `--service-tier` THROWS.)
- **Batch 2** (iters 6-10, Sonnet 5 xhigh): edit `research/deep-research-config.json` only → `config.executor.model="openrouter/anthropic/claude-sonnet-5"`, `config.executor.reasoningEffort="xhigh"`, `maxIterations=10`, `minIterations=10`.
- **Batch 3** (iters 11-15, GLM 5.2 max): edit config only → `config.executor.model="zai-coding-plan/glm-5.2"`, `config.executor.reasoningEffort="max"`, `maxIterations=15`, `minIterations=15`.
- Between batches edit `research/deep-research-config.json` ONLY (`config.executor.model`, `config.executor.reasoningEffort`, `maxIterations`, `minIterations`); keep `topic` + `specFolder` identical so the loop AUTO-RESUMES one lineage (the loop re-reads config each iteration).
- A `research.md` synthesis with findings ranked P0/P1/P2, partitioned by surface (commands / doctor / agents / cross-surface), each with `file:line` and a concrete fix recommendation.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The command, /doctor, agent, and presentation-asset surfaces have drifted out of sync with current skill reality, and the drift ships live: dead slash commands are referenced in shipped command docs, an agent doc points at the wrong mirror directory, doctor route tables omit real routes, and workflow YAML still calls a relocated CLI a standalone "skill." These defects are scattered across ~140 files with no ranked inventory, so remediation cannot start without first knowing exactly what is wrong, where (file:line), and how severe.

### Purpose
Produce a single ranked, file:line-cited `research.md` synthesis of every conformance defect across commands, /doctor, agents, and cross-surface logic — confirmed and expanded via a 15-iteration three-model deep-research loop — so the later phases can remediate from evidence rather than guesswork.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit every `command.md` (42), workflow/route YAML (62), presentation `.txt` (35), and the deep compiled contracts under `.opencode/commands/**`.
- Audit the whole `/doctor` subsystem (router `speckit.md`, `_routes.yaml`, every documented vs. actual route).
- Audit all 12 agents mirrored across `.claude/agents/` + `.opencode/agents/` (self-referential paths, mirror parity, advertised-but-absent directories).
- Audit cross-surface logic alignment: command ↔ skill ↔ agent ↔ advisor (relocated skills, stale slugs, broken references).
- Confirm AND expand the six seed findings below; keep open questions unresolved so the loop cannot short-circuit.

### Out of Scope
- READMEs and install-guide catalogs (e.g. `.opencode/install_guides/README.md`) — phase `005` owns them, so flagging catalog staleness here would duplicate that scope.
- Any remediation / source edits — phases `002`-`006` apply fixes; this phase only investigates and ranks.
- The known-LIVE `codex` tokens in `deep-improvement.md` / `prompt-improver.md` / `orchestrate.md` — they denote the `.codex` runtime mirror and the codex benchmark executor, so treating them as drift would be a false positive.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-conformance-deep-research/research/deep-research-config.json` | Create | Loop config; edited between batches (model, reasoningEffort, maxIterations, minIterations); topic + specFolder held constant. |
| `001-conformance-deep-research/research/deep-research-state.jsonl` | Create | Append-only iteration log; must contain exactly 15 `"type":"iteration"` records at close. |
| `001-conformance-deep-research/research/deep-research-strategy.md` | Create | Strategy seed; re-seeded with fresh per-batch surface-emphasis angles to force broadening. |
| `001-conformance-deep-research/research/deltas/` | Create | Per-iteration delta artifacts emitted by the loop. |
| `001-conformance-deep-research/research/iterations/` | Create | Per-iteration investigation notes emitted by the loop. |
| `001-conformance-deep-research/research/deep-research-dashboard.md` | Create | Regenerated progress dashboard tailed during monitoring. |
| `001-conformance-deep-research/research.md` | Create | Final synthesis: findings ranked P0/P1/P2, partitioned by surface, each with file:line + fix. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 15 iterations across the 3-batch executor rotation over one auto-resumed lineage. | `grep -c '"type":"iteration"' research/deep-research-state.jsonl` returns exactly `15`; `topic` and `specFolder` identical across all iterations; batches used GPT 5.6 Sol Fast (1-5), Sonnet 5 (6-10), GLM 5.2 (11-15). |
| REQ-002 | No batch stops before its iteration cap (no early convergence). | `deep-research-config.json` has `minIterations == maxIterations` AND `convergenceMode:"off"`; open questions remain unresolved so `all_questions_answered` never short-circuits; each batch's iteration span (5/10/15) is present in the state log. |
| REQ-003 | Confirm and EXPAND the six seed findings (do not merely rediscover them). | `research.md` lists each seed finding (a-f) with its stated file:line CONFIRMED or corrected, plus at least one newly discovered adjacent defect per surface; the false-positive `codex` tokens are explicitly NOT flagged. |
| REQ-004 | Emit a `research.md` synthesis with findings partitioned by surface and severity. | `research.md` groups findings under commands / doctor / agents / cross-surface, each ranked P0/P1/P2, and every finding carries a `file:line` + a concrete fix recommendation. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Smoke-test one dispatch per provider before committing each batch, verifying `--variant` handling. | A single dispatch is run for each of the three models and confirmed to accept its reasoning-effort variant (`high`/`xhigh`/`max`); if a provider silently downgrades, record it in `research.md` and Open Questions before proceeding. |
| REQ-006 | Monitor progress every 3-5 min and re-seed strategy per batch. | Monitoring uses `grep -c '"type":"iteration"'` + dashboard tail + `status.cjs --spec-folder <THIS_FOLDER> --loop-type research --session-id <SID>` + `/doctor deep-loop`; `deep-research-strategy.md` shows a fresh surface-emphasis angle seeded per batch. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research.md` exists and contains findings for all four surfaces (commands / doctor / agents / cross-surface), each ranked P0/P1/P2 with a `file:line` and a concrete fix recommendation.
- **SC-002**: `deep-research-state.jsonl` contains exactly 15 iteration records, spanning the three executor batches with no batch cut short.
- **SC-003**: All six seed findings are confirmed-or-corrected with evidence, and the known-LIVE `codex` tokens are explicitly excluded as false positives.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-opencode` provider reach for GPT 5.6 Sol / Sonnet 5 / GLM 5.2 | A batch cannot dispatch if a provider is unreachable | Smoke-test one dispatch per model first (REQ-005); if one provider is down, pause that batch and record the blocker rather than skipping iterations. |
| Risk | Loop short-circuits before 15 iterations (MAD-noise or question-coverage signals stop it) | Fewer than 15 iterations undermines coverage | Set `minIterations == maxIterations` AND `convergenceMode:"off"`; `--convergence=0` alone is insufficient; keep open questions unresolved. |
| Risk | Provider ignores `--variant xhigh/max` and silently downgrades reasoning effort | Weaker analysis than intended without warning | Smoke-test the variant per provider before committing the batch; log any downgrade in `research.md` + Open Questions. |
| Risk | `--service-tier` passed with the `-fast` slug | Dispatch THROWS and the batch fails to start | "Fast" is the model slug only (`openai/gpt-5.6-sol-fast`); never pass `--service-tier`. |
| Risk | Config edited beyond the allowed fields between batches | Breaks lineage auto-resume / forks the run | Edit ONLY `config.executor.model`, `config.executor.reasoningEffort`, `maxIterations`, `minIterations`; keep `topic` + `specFolder` byte-identical. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Both questions are RESOLVED; none remain open at close.

- **RESOLVED** — Does opencode honor `--variant xhigh`/`--variant max` for the `openrouter/anthropic/claude-sonnet-5` and `zai-coding-plan/glm-5.2` providers? The REQ-005 smoke-test confirmed all three providers honored their assigned reasoning-effort variant (`high`/`xhigh`/`max`); no silent downgrade was observed, and each was verified before its batch was committed.
- **RESOLVED** — Do any of the 62 workflow/route YAML files reference other relocated skills beyond the confirmed `deep_research_auto.yaml:1012,1016` `cli-opencode` case? `research.md` CMD-08 confirms this class spans exactly 5 sites (`deep_research_auto.yaml:1016`, `deep_research_confirm.yaml:765`, `deep_review_auto.yaml:1073`, `deep_review_confirm.yaml:840`, plus the `deep_research_auto.yaml:1010-1016` executor-note shorthand); no additional relocated-skill references were surfaced across the 62-file inventory.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
