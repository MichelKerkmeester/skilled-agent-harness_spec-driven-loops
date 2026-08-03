---
title: "Feature Specification: Phase 14 — health-md reference remediation from research findings"
description: "Rewrite the four health-md reference docs per the deep-research remediation order: health-viz fence contract, mock-fallback trap, Apple/Android model, narrowed write authority, privacy boundaries."
trigger_phrases:
  - "health-md reference remediation"
  - "health-viz fence fix"
  - "health-md research findings implementation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/014-health-md-reference-remediation"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 14 spec"
    next_safe_action: "Rewrite the four reference docs per the remediation order"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-health-md-reference-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Phase 14 — health-md reference remediation from research findings

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
| **Predecessor** | `013-iconic-integration` |
| **Successor** | `015-health-md-fixtures-and-blocks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The health-md deep research (phase 012, `research/lineages/codex/research.md`, 6 iterations, all questions answered) found the mode's health-md reference set **partly accurate but not safe to use unchanged**: quick-start examples use the wrong `health-md` fence and invented keys (`type: chart`, `dateRange`), the framing is Apple-only (Android export profiles exist), and the validation path misses the plugin's deterministic bundled mock-data fallback. A rendered chart proves nothing about real data when the default folder is missing. The research's remediation order (§7) lists six concrete corrections plus settings, file-layer, and privacy contracts that the current docs omit.

### Purpose
Rewrite the four reference docs (`references/plugins/health-md/**`) so every claim matches the researched contract: the real `health-viz` fenced render language, the mock-data validation trap, the Apple/Android compatibility model, narrowed AI write authority, and the privacy/safety boundaries. This makes the mode's health-md guidance safe to operate against real vaults.

**End goal:** the reference set passes the research's remediation checklist — no invented fence/keys anywhere, mock-fallback warning present, Apple/Android model explicit, write authority narrowed, workout-note/raw-archive/privacy guidance included, and the accurate v0-v7/nesting/cache/roll-up/dictionary sections retained.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `references/plugins/health-md/health-md.md` (index): real `health-viz` quick start, mock-fallback warning, Apple/Android compatibility summary.
- Rewrite `references/plugins/health-md/data-model.md`: file-layer separation table (daily / roll-ups / dictionary / lossless archives / Android raw snapshots / entry notes), schema v0-v7 retention, roll-up semantics, settings contract (folder, structure, pattern, format, theme/palette, chart dimensions, click behavior, Scan-now diagnostic).
- Rewrite `references/plugins/health-md/workflows.md`: narrowed write authority, authentic-source verification (mock-fallback guard), read-only-first posture, entry-note discovery.
- Rewrite `references/plugins/health-md/troubleshooting.md`: empty-chart distinction matrix (no records / denied permission / disabled export / absent capability / unsupported viz), permission ambiguity, bounded previews.
- Add privacy/safety contract section (research §6) across the docs.

### Out of Scope
- Asset fixtures and render-block examples (Phase 15).
- Playbook scenario + feature-catalog card updates (Phase 16).
- Live validation (Phase 17).
- Non-health-md plugin docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/{health-md,data-model,workflows,troubleshooting}.md` | Rewrite | Remediated per research findings |
| `012-skill-support-extension/tasks.md` | Modify | T009 marked superseded by this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No invented fence or keys remain | Grep finds zero `health-md` code fences and zero `type: chart` / `dateRange` in the reference set; every example uses the `health-viz` fence with a registered renderer (`step-spiral` etc.) and documented keys (`width`, `height`, `from`, `to`, `last`, `clickAction`) |
| REQ-002 | Mock-fallback trap documented | Index + workflows state that an empty/missing default folder renders deterministic bundled example data; verification must identify the actual selected data folder AND an authentic source file |
| REQ-003 | Apple/Android model explicit | Docs cover the three compatibility profiles (Apple v7, Android frozen v4, Android analytical v5), shared chart coverage, iOS-only surfaces (mood, medication), Android gaps (walking symmetry, Stand proxy), and platform distinctions in troubleshooting |
| REQ-004 | Write authority narrowed | Docs state: never fabricate/extrapolate/medically interpret; preserve authentic exports; do not synthesize observations, raw archives, dictionaries, or roll-ups; keep lossless/raw archives out of ingestion |
| REQ-005 | File-layer separation + retention | The 6-layer table present; accurate v0-v7, nesting, cache invalidation, roll-up, dictionary, and compact-archive sections retained from the research |
| REQ-006 | Settings contract complete | Docs cover folder/structure/pattern/format PLUS theme/palette, chart dimensions, data-point click behavior, and the Scan-now diagnostic |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research §7 remediation checklist items 1-6 each verifiable by grep/read in the shipped docs.
- **SC-002**: No reference doc claims anything contradicted by `research.md` (spot-check each section against the source record).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Research accuracy | Rewrites bake in wrong claims | All claims traceable to `research.md` §1-§6 with the cited SOURCE urls |
| Risk | Over-correction loses accurate content | Regression in v0-v7/nesting sections | REQ-005 retention checklist |
| Risk | Fence examples not actually valid | Agents copy broken blocks | Use only the research's tested minimal example (`type: step-spiral`, `last: 7`) + documented keys |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
