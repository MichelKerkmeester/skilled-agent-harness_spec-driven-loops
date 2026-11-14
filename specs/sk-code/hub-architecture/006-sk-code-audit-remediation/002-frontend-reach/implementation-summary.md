---
title: "Implementation Summary"
description: "A frontend request in plain words now reaches the frontend surface: all 13 everyday probes route to `sk-code-frontend`, where 12 used to return `defer`. A review of a UI component loads the frontend standards beside the review mode, and none of the 8 look-alike prompts is pulled in."
trigger_phrases:
  - "frontend reach implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/002-frontend-reach"
    last_updated_at: "2026-11-14T13:43:36Z"
    last_updated_by: "implement-workflow"
    recent_action: "Routed plain frontend requests to the frontend surface and proved it with the 22 probes"
    next_safe_action: "Start 003-frontend-content"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-frontend-reach"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-frontend-reach |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A frontend request in plain words now reaches the frontend surface: all 13 everyday probes route to `sk-code-frontend`, where 12 used to return `defer`. A review of a UI component loads the frontend standards beside the review mode, and none of the 8 look-alike prompts is pulled in.

### Phase 2: frontend-reach

You can ask for a sticky navbar, a dark mode toggle or a faster landing page and the hub loads the frontend references. Editing a `.css`, `.scss`, `.html`, `.tsx`, `.jsx`, `.vue` or `.svelte` file now detects the `FRONTEND` surface ahead of `SKILLED`. The four bare keywords that matched unrelated sentences (`hover`, `padding`, `animation`, `easing`) are gone, and every frontend keyword is a phrase. Three playbook scenarios, `RD-003` to `RD-005`, hold the result.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/mode-registry.json` | Modified | `FRONTEND` detection block, and aliases equal to the `code-frontend-aliases` class |
| `.skilled/skills/sk-code/hub-router.json` | Modified | 46 added phrases, 4 single words removed, new `code-frontend-review` class |
| `.skilled/skills/sk-code/ROUTER.md`, `sk-code-frontend/ROUTER.md` | Modified | `INTENT_SIGNALS` rows mirror the 162 phrases, and two sentences corrected |
| `.skilled/skills/sk-code/SKILL.md`, `shared/references/stack-detection.md`, `shared/references/phase-detection.md`, `feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` | Modified | The statement that detection never selects the frontend surface is corrected in every copy |
| `.skilled/skills/sk-code/manual-testing-playbook/` | Modified and created | Three scenario files and their root index rows |
| `.skilled/skills/sk-code/graph-metadata.json` | Regenerated | Hub intent signals, written by `generate-router-intent-signals.cjs` |
| `sk-code-quality/scripts/tests/quality-gate-hygiene.test.cjs`, `quality-gate-surfaces.test.cjs`, `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modified | Three expectations that encoded a hub with no specific surface |
| Two `activation/sk-code/manifest.json` files | Regenerated | Policy hash after the vocabulary change |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The vocabulary was designed against a replay of the router's own matching rule, then each edit went to DeepSeek V4.1 Flash at max thinking through cli-pi as one literal brief: 15 dispatches, each diff read before the next. The orchestrating session ran the manifest refresh, the generator the pre-commit gate named, the probe replay, the baseline comparison, the three affected test suites, the drift guards and the quality runner. The code landed as `40b8d7e6b7`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The review bundle rests on one frontend phrase per review prompt | The router bundles two modes only on an equal score, so `accessibility issues` matches the review probe and `react component` was left out on purpose |
| `lazy loading` and `grid layout` were left out | A replay showed both match non-frontend prompts such as lazy loading of Python modules |
| Three test expectations changed, one of them outside `.skilled/skills/sk-code/` | Each test asserted that the hub has no specific surface, which the planned `FRONTEND` block ends. Leaving them red would have made the in-scope change incorrect. Parent decision D5 names files outside sk-code, so the operator is asked to confirm the one line in `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` |
| The prose keyword list in `sk-code-frontend/ROUTER.md` section 2 was not extended | Phase 004 replaces that section with a pointer to the machine block |
| The manifest was refreshed with `compiled-route-manifest.cjs refresh` | `tasks.md` names `compiled-route-sync.cjs`, but that command checks the served engine copies. The stale artifact was the activation manifest, and the guard printed the refresh command |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Probe replay from `plan.md` section 5 | `13 frontend 1`, `8 negative 0`, `1 review 1` |
| Review probe | `surfaceBundle`, `sk-code-review` then `sk-code-frontend` |
| Single-word keyword count | 0 |
| `--prompt "update the stylesheet" --surface-hint FRONTEND` | `sk-code-frontend` |
| First target of every baseline route to a non-frontend packet | 0 changed lines |
| `compiled-route-guard.cjs --json` and `compiled-route-sync.cjs --check` | Both exit 0, no hub `ok: false` |
| `validate-playbook-package.cjs --package .skilled/skills/sk-code/manual-testing-playbook` | `PASS`, 30 scenarios, 0 violations, exit 0 |
| `node --test` on the sk-code-skilled tests, the sk-code-quality tests and `compiled-route-surface-hint.test.cjs` | 53, 154 and 15 pass, 0 fail |
| `run-all-drift-guards.sh` | router-sync, doc-claims and stack-folders PASS. alignment-drift fails on the same 23 files as the baseline |
| `quality-gate.cjs` | `NO_BLOCKER_FOUND` |
| Skill advisor on four probes | `sk-code` is the top hub for each |
| `validate.sh <phase folder> --strict --quiet` | `RESULT: PASSED (errors=0 warnings=0)` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A review bundle needs an exact score tie.** A review prompt that matches two frontend phrases routes to the frontend surface alone. `RD-004` holds the probe, and its triage says which phrase to remove.
2. **`.tsx` now detects FRONTEND first.** A TypeScript component under `.skilled/` reports `FRONTEND` then `SKILLED`. The operator chose `.tsx` and `.jsx` as frontend markers.
3. **The setup battery still ends `STATUS=FAIL`.** Its drift guard fails on 23 files outside sk-code, which phase 005 owns.
<!-- /ANCHOR:limitations -->

---
