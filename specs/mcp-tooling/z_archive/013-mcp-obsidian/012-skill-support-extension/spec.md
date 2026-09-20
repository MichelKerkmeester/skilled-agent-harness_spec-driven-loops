---
title: "Feature Specification: Phase 12 — Skill support extension (health-md) in mcp-obsidian"
description: "Deep research on the health-md plugin (GPT-5.6 SOL HIGH FAST), then teach the mcp-obsidian mode to operate it at the vault file layer: per-plugin references, router updates, feature-catalog + playbook entries, assets, changelog."
trigger_phrases:
  - "mcp-obsidian health-md support"
  - "skill plugin extension"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/012-skill-support-extension"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 12 spec"
    next_safe_action: "Run /deep:research on health-md (cli-codex GPT-5.6 SOL HIGH FAST)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-skill-support-extension"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 12 — Skill support extension (health-md) in mcp-obsidian

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `011-plugin-installation` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 11 put health-md in every vault, but the `mcp-obsidian` mode knows nothing about it. Without references, an agent asked to "add a health chart" has no contract for the data files health-md renders (Apple Health JSON/CSV/frontmatter in the data folder). The mode's existing per-plugin pattern (beancount-finance, obsidian-tables, obsidian42-brat) proves the file-layer approach; health-md fits the same mold. The packet's precedent (phases 001 and 009) requires a **deep-research artifact** behind every plugin reference set — health-md has none yet.

### Purpose
Run a **deep-research pass on health-md** (executor: cli-codex **GPT-5.6 SOL HIGH FAST**, per operator directive), record it under `research/` in this phase, then use the findings to validate and deepen the mode's health-md references. Ships as references, router updates, a feature-catalog + playbook entry, an asset, a changelog entry, and a live validation run of the playbook scenario.

**End goal:** `mcp-obsidian` at v1.2.0.0 answers health-chart requests with file-layer operations backed by a cited, converged research record — mirroring the quality of the three existing plugin reference sets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Deep research** on health-md under `012-skill-support-extension/research/` via the `/deep:research` command (`:auto`, state packet per the deep-research packet contract: config, state JSONL, iterations/, deltas/, findings-registry, dashboard, `research.md`, convergence report). Executor: `cli-codex` with `--model gpt-5.6-sol --reasoning-effort high --service-tier fast` (web search enabled). Research charter: plugin data model depth (schema v0–v7 semantics, roll-ups, Bases format, render-block options, settings, file-layer edge cases, companion app export format).
- `references/plugins/health-md/`: index, data-model, workflows, troubleshooting (mirrors the obsidian-tables layout) — **deepened from research findings**.
- `references/plugins/plugin-operation-logic.md`: extend the plugin data map from 3 to 4 rows.
- `SKILL.md`: activation triggers, on-demand resource list, routing table plugin row, version bump to 1.2.0.0.
- `feature-catalog/plugins/health-md.md`.
- `manual-testing-playbook/plugin-tie-ins/health-md-data.md` (OBS-014) + playbook index update; **live execution of OBS-014** against a vault and verdict recorded.
- `assets/plugins/health-md/` example file.
- `changelog/v1.2.0.0.md`.

### Out of Scope
- Installing plugins (Phase 11).
- Registering a new hub mode (this extends an existing mode package).
- Implementing plugin features — research reports findings only; the follow-up is documentation (this phase).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `012-skill-support-extension/research/**` | Create | Deep-research state packet (config, JSONL, iterations, deltas, findings-registry, dashboard, research.md, convergence report) |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/**` | Create/Modify | 4 files (index, data-model, workflows, troubleshooting), deepened from findings |
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md` | Modify | Data map 3 → 4 plugins |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modify | Triggers, resource list, routing, version 1.2.0.0 |
| `.opencode/skills/mcp-tooling/mcp-obsidian/feature-catalog/plugins/health-md.md` | Create | Feature catalog card |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/plugin-tie-ins/health-md-data.md` | Create | Playbook scenario (OBS-014) + live verdict |
| `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modify | Index new scenario |
| `.opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/health-md/**` | Create | Example data file |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v1.2.0.0.md` | Create | Changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | health-md deep research completed and recorded | `research/` state packet present: config, state JSONL (append-only, every record has newInfoRatio + novelty justification), iterations/ (non-empty, cited `[SOURCE: url]`), deltas/, findings-registry.json, dashboard, `research.md`, convergence report; executor logged as GPT-5.6 SOL HIGH FAST |
| REQ-002 | health-md reference set authored and deepened from findings | `references/plugins/health-md/` has index + data-model + workflows + troubleshooting; data-model documents the `Health/` folder, JSON/CSV/Markdown/Bases formats, schema v0-v7, roll-ups, and the settings the AI may safely adjust; every claim traceable to the research record or the pinned README |
| REQ-003 | Router + skill doc updated | SKILL.md lists the health-md reference set on demand, adds activation trigger phrases, and bumps to v1.2.0.0; plugin-operation-logic data map covers all 4 plugins |
| REQ-004 | Catalog + playbook entries exist | feature-catalog card + playbook scenario (OBS-014), indexed in the playbook root doc |
| REQ-005 | Example + changelog shipped | `assets/plugins/health-md/` carries a valid example file; `changelog/v1.2.0.0.md` written |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Live OBS-014 run recorded | Scenario executed against a real vault; verdict (PASS/FAIL/SKIP) + evidence written into the scenario file |
| REQ-007 | No regression on existing docs | `validate.sh` passes on the phase and the mode package docs; existing plugin references untouched except the data-map table |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The research record exists with a convergence report and cited findings; no open question in the research charter is left unanswered without an explicit best-effort note.
- **SC-002**: An agent loading the mode can operate health-md data files from the references alone.
- **SC-003**: SKILL.md routing mentions health-md with correct load-on-demand pointers.
- **SC-004**: OBS-014 carries a live verdict with evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex OAuth availability | Cannot dispatch GPT-5.6 SOL | Pre-flight `codex login` check before research; do not substitute a model |
| Dependency | Health.md schema churn (v0-v7) | Stale schema details in the data model | Research pins to primary sources; reference pins to README facts (schema v7 latest, best-effort newer) |
| Risk | Long research runtime | Loop overshoots | `:auto` with `--max-iterations` + `--lineage-timeout-hours` bounds; convergence default 0.05 |
| Risk | Doc drift from the 010 validation findings | Conflicting guidance | Reuse the validated obsidian-tables layout; run validate.sh after authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — research charter (Non-Goals + Stop Conditions) is authored inside the research run's strategy file per the deep-research packet contract.

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
