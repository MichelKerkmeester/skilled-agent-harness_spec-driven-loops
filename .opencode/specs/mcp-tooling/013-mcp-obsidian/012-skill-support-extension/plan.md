---
title: "Implementation Plan — Phase 12 — Skill support extension"
description: "Plan for deep research on health-md (GPT-5.6 SOL HIGH FAST) and extending the mcp-obsidian mode with the resulting file-layer support."
trigger_phrases:
  - "phase 12 plan"
  - "skill support extension plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/012-skill-support-extension"
    last_updated_at: "2026-08-03T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 12 plan"
    next_safe_action: "Execute T001-T012 (research first, then deepen)"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan — Phase 12 — Skill support extension

<!-- ANCHOR:summary -->
## 1. SUMMARY

Deep-research the health-md plugin (executor: cli-codex GPT-5.6 SOL HIGH FAST) and extend the `mcp-obsidian` mode to v1.2.0.0 with file-layer knowledge: a per-plugin reference set deepened from the findings, router/registry updates, a feature-catalog + playbook entry, an example asset, changelog, and a live OBS-014 run. Reversible: delete the new files/entries; no existing behavior changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Executor | Research dispatched via `/deep:research` with `--executor=cli-codex --model gpt-5.6-sol --reasoning-effort high --service-tier fast`; pre-flight `codex login` passed | cli-codex contract |
| Research state | State packet complete: config, JSONL (append-only, newInfoRatio per record), iterations/ with `[SOURCE: url]` citations, deltas/, findings-registry, dashboard, `research.md`, convergence report | deep-research packet contract |
| Facts | References cite findings or the pinned README/release 2.1.0; no claim beyond the record | — |
| Shape | New reference set mirrors the validated obsidian-tables layout (index/data-model/workflows/troubleshooting) | file listing |
| Versioning | SKILL.md 1.2.0.0 + changelog entry + `version:` in every new frontmatter doc | frontmatter gate |
| Live verdict | OBS-014 executed with PASS/FAIL/SKIP + evidence | playbook contract |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No code changes — research record + documentation and routing metadata only.

- `research/` — deep-research state packet owned by the `/deep:research` command (config, state JSONL, `iterations/`, `deltas/`, findings-registry, dashboard, `research.md`, convergence report).
- `mcp-obsidian/references/plugins/health-md/` — 4 files (index, data-model, workflows, troubleshooting), deepened from findings.
- `references/plugins/plugin-operation-logic.md` — data map 3 → 4 rows.
- `SKILL.md` — triggers, load-on-demand list, version.
- `mode-registry.json` — obsidian aliases (+health terms).
- `hub-router.json` — new vocabulary class `health-md-data` on the obsidian signal.
- `feature-catalog/`, `manual-testing-playbook/` — 1 card + 1 scenario (OBS-014) + index updates.
- `assets/plugins/health-md/` — example data file (not vendored code).
- `changelog/v1.2.0.0.md`.

### Research charter (brief)

Topic: health-md plugin deep dive — data model depth for file-layer operation. Non-goals: UI automation, plugin internals beyond what file-layer operation needs, other health plugins. Stop conditions: convergence (newInfoRatio < 0.05 default) or `--max-iterations`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup (done) | Extract starter facts from the pinned primary source; mirror doc shapes |
| Implementation (done) | Author 4 reference files; update operation-logic map; SKILL.md; registry + router; catalog + playbook; asset; changelog |
| Research | `/deep:research` on health-md via cli-codex GPT-5.6 SOL HIGH FAST → state packet under `research/` |
| Deepen | Reconcile findings vs references; patch references, catalog, playbook, SKILL.md where findings diverge |
| Verification | Live OBS-014 run + verdict; validate.sh; closeout |

Sequenced in tasks.md (T001–T012).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

File-layer verification plus one live run: the example fixture JSON-parses, all `references/plugins/*` pointers in SKILL.md resolve to existing files, OBS-014 executes against a real vault with a recorded verdict, and the phase-level `validate.sh` runs clean. In-app rendering stays out of scope (mode posture).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| cli-codex OAuth | Research cannot dispatch | Pre-flight `codex login`; surface the command, never substitute a model |
| `/deep:research` runtime | Command infra unavailable | Deep-loop packet contract; resume/restart lifecycle |
| Primary-source accuracy | Drift after authoring | Findings cited; sources pinned in the changelog |
| Hub router class collisions | Ambiguity for health queries | Specific `health-md-data` class; generic classes untouched |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the research packet (`research/`), the reference folder, the catalog card, the playbook scenario, the asset, and the changelog entry; revert SKILL.md (version + triggers + resource list), `plugin-operation-logic.md` (data map), `mode-registry.json` (aliases), and `hub-router.json` (one class). All changes are additive — nothing existing is deleted or rewritten except the data-map table and SKILL.md sections. The research packet itself is disposable evidence, not a deliverable.
<!-- /ANCHOR:rollback -->
