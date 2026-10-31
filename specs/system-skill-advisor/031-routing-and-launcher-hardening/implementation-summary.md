---
title: "Implementation Summary: Advisor routing and launcher hardening"
description: "The advisor now routes push allowlist and the bare environment-variables prompt correctly, suggests the deep-loop and MCP doctor commands, never lets the launcher wipe a matching node_modules, and checks its own playbook against the scenario contract."
trigger_phrases:
  - "routing and launcher hardening implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/036-routing-and-launcher-hardening"
    last_updated_at: "2026-10-17T12:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All six items shipped and the full gate list passed"
    next_safe_action: "Coordinator writes the changelog and commits"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts"
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs"
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:6d9bd201e2f175808f7ac9ea1c9b48717b12e2e3fc30aff4250c3da0d17697fb"
      session_id: "036-routing-and-launcher-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Item 2 uses an authored lead_phrases field in _routes.yaml, approved by the operator"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Advisor routing and launcher hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-routing-and-launcher-hardening |
| **Completed** | 2026-10-17 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

All six advisor open ends are closed and no routing row that passed before was lost. `push allowlist` routes to sk-git again, the bare `environment variables` prompt reaches system-spec-kit, and `check my environment variables` still puts `/doctor:env` first. The advisor now also suggests `/doctor:deep-loop`, `/doctor:mcp install` and `/doctor:mcp debug`. The launcher no longer reinstalls a dependency tree that already matches its lockfile, and the package validator now checks the advisor's 36 operator scenarios.

### Advisor routing and launcher hardening

- **Scorer partial credit.** A prompt word earns partial credit when it contains the skill word, or when the skill word starts with it. A word sitting inside a longer skill word no longer counts, so `list` stops matching `allowlist` and `spec` stops matching `inspect`.
- **Lead phrases.** A doctor route can now name lead phrases in `_routes.yaml`. A lead phrase puts that doctor command above a passing skill. `/doctor:env` uses one, for `check my environment variables`.
- **New doctor bridges.** The deep-loop and MCP doctor commands are active. Every phrase has three or more words, and a fitting skill keeps first place.
- **Launcher.** When the build is stale but `node_modules` already matches the lockfile, the launcher builds without running `npm ci`. Offline, `npm ci` used to delete the tree and then fail.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/scorer/text.ts` | Modified | Asymmetric containment rule |
| `runtime/lib/scorer/fusion.ts`, `types.ts` | Modified | Lead-phrase ordering exception |
| `runtime/scripts/skill_advisor.py` | Modified | Same lead-phrase exception in the Python scorer, plus regenerated bridges |
| `runtime/scripts/command-bridges/derive-command-bridges.cjs` | Modified | Reads `mcp_subroutes` and `lead_phrases` |
| `runtime/scripts/command-bridges/scoring-compatibility.json` | Modified | Activation for deep-loop, mcp-install, mcp-debug |
| `runtime/scripts/command-bridges/command-bridges.generated.json`, `lib/scorer/projection.ts`, `lib/render.ts` | Regenerated | Deriver output |
| `runtime/scripts/command-bridges/README.md`, `feature-catalog/scorer-fusion/doctor-command-routing.md` | Modified | Document the new bridges and lead phrases |
| `runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | Modified | Six new rows for the new bridges, none changed |
| `runtime/scripts/skill-graph.json` | Regenerated | Graph export |
| `runtime/tests/**` (five files) | Modified/Created | Scorer, ordering, deriver, drift-guard, Python and launcher tests |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Three-word deep-loop and MCP phrases, `lead_phrases` schema and env lead phrase |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Modified | Reads `mcp_subroutes` like the deriver |
| `.skilled/commands/doctor/scripts/route-validate.py`, `tests/route-validate.test.sh` | Modified | Validates `lead_phrases` |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modified | Lockfile-match guard before install |
| `.skilled/skills/sk-git/graph-metadata.json` | Modified | `push` back to `push allowlist` |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modified | Adds `environment variables` |
| `playbook-corpus-manifest.json` | Modified | Drops the advisor whole-tree override |
| `manual-testing-playbook/**` (22 scenarios and the index) | Modified | Scenario contract and HVR |
| advisor `SKILL.md` and its Hermes copy | Modified | HVR punctuation, resynced |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna (`gpt-6-luna`, max, fast) made every edit outside the spec folder, one dispatch at a time. Each dispatch backed up its targets, and afterwards I diffed the result and ran the tests. Scorer variants were scored in a scratch copy of the compiled build before any repository change. Each code fix got a mutation check: putting the old code back made the new test fail.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Asymmetric containment (variant v5) over prefix-only, ratio or length rules | v5 moved no top-1 row. The others moved between 1 and 5 |
| An authored `lead_phrases` field for item 2, approved by the operator | Three general ordering rules each broke doctor-slice rows of the same shape |
| Skip the install only when every non-optional lockfile package matches | Smallest change that never leaves `node_modules` worse. A mismatch still installs as before |
| Conform the 22 legacy scenarios instead of keeping the override | The per-file routing-gold signature already excludes the 25 real gold files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, typecheck | PASS, exit 0 |
| Advisor vitest | 145 files, 1198 passed, 6 skipped (baseline 144, 1184, 6) |
| Python suite | 69 pass, 0 fail (baseline 68) |
| OpenCode plugin suite | 24 files, none failed |
| Per-prompt comparison | lost=0 gained=0, labeled 155/195, holdout 49/66, ambiguity 19/24 |
| Short-prompt probe | TOTAL=59 LOST=0 CHANGED=0 against the current probe set |
| Routing CI steps | all 22 steps exit 0 |
| Graph export and freshness strict | exit 0, no drift |
| doctor-phrase-reach | STATUS=OK phrases=96 bridges=18 |
| Deriver `--check`, route-validate, its tests | fresh, 14 routes OK, 22 passed |
| Runtime mirrors, drift guards, Hermes check | 185 in sync, 4 guards PASSED, 68 copies in sync |
| hvr_scan on every touched doc | 0 hard blockers |
| Playbook validator | advisor PASS operator=36 violations=0, fleet 52 PASS 5 SKIP (was 51 and 6) |
| Mutation checks | scorer, deriver mcp, deriver lead, TS lead, Python lead, launcher: each fails its test |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No nested changelog.** The operator's brief keeps changelog entries with the coordinator.
2. **Legacy run output removed.** The 22 conformed scenarios lost their baked run sections. Git history keeps them.
<!-- /ANCHOR:limitations -->

---
