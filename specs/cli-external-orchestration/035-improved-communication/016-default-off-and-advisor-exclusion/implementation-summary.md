---
title: "Implementation Status: Phase 016 Default-Off and Advisor Exclusion"
description: "Communication projection is off by default with a private per-machine opt-in, and sk-communication is held out of advisor routing through an adjustable denylist."
trigger_phrases:
  - "default-off-and-advisor-exclusion"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/016-default-off-and-advisor-exclusion"
    last_updated_at: "2026-08-14T06:14:47.000Z"
    last_updated_by: "claude"
    recent_action: "Completed the default-off and advisor-exclusion evidence packet and parent wiring."
    next_safe_action: "After landing on main, rebuild the advisor dist, reindex, and re-probe to confirm the exclusion."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-016-default-off-20260813"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Projection resolves to off with no opt-in, and the environment variable wins over the git-ignored local file."
      - "A live advisor probe no longer returns sk-communication after the route-exclusion denylist was wired at both seams."
      - "The package gate passes 296 of 296 tests, and the advisor change adds 10 passing tests with 0 new failures."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 016 Default-Off and Advisor Exclusion

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-default-off-and-advisor-exclusion |
| **Status** | Complete |
| **Completed** | 2026-08-13 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Communication projection is now off by default for everyone, opt-in-able privately on one machine, and its skill is held out of advisor routing. Two completed and verified changes deliver this.

### Default-Off Enablement Gate

`src/config/enablement.ts` exports `isProjectionEnabled()`, which defaults to `false`, and a pure `resolveProjectionEnablement(env, localOverride)` that decides enablement from its two arguments without touching the disk. The `COMMUNICATION_PROJECTION_ENABLED` environment variable decides the result when it is set to `1`, `true`, or `on`, which lets CI and tests force either state. When the variable is unset, a git-ignored `enablement.local.json` at the package root opts in when it holds `{ "enabled": true }`. With neither source present, the answer is `false`. The surface is re-exported through `src/config/index.ts` and `src/index.ts`, a committed `enablement.local.json.example` documents the shape, and the package `.gitignore` keeps the real opt-in file out of the repository. Every activation path calls the gate before it projects and returns the exact original when the answer is `false`.

### Adjustable Advisor Route-Exclusion

`lib/routing/route-exclusions.ts` is a fail-safe cached loader that exposes the excluded-skill-id set. A committed `config/route-exclusions.json` holds `{ "excludedSkillIds": ["sk-communication"] }`, the operator-adjustable knob. An optional git-ignored `config/route-exclusions.local.json` fully replaces the committed list when present, including an empty list that re-enables every skill on one machine, and a committed `.example` documents it. `SPECKIT_ADVISOR_ROUTE_EXCLUSIONS_DIR` points the loader at a different config directory, and a reset seam lets tests reload. The set is wired into both routability seams: `isDefaultRoutable` in `lib/scorer/fusion.ts`, the sole production recommend gate, and `filterDefaultRoutable` in `lib/lifecycle/archive-handling.ts` as defense in depth. A missing or malformed config resolves to an empty set and never throws. The root `.gitignore` ignores the local override.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/config/enablement.ts` | Created | Default-off gate and pure resolver |
| `src/config/index.ts`, `src/index.ts` | Modified | Export the enablement surface |
| `enablement.local.json.example`, package `.gitignore` | Created/Modified | Committed opt-in template and git-ignore |
| `lib/routing/route-exclusions.ts` | Created | Fail-safe cached exclusion loader |
| `config/route-exclusions.json`, `config/route-exclusions.local.json.example` | Created | Committed denylist and local-override template |
| `lib/scorer/fusion.ts`, `lib/lifecycle/archive-handling.ts` | Modified | Wire the denylist into both routability seams |
| root `.gitignore` | Modified | Ignore the local override |
| `tests/route-exclusions.vitest.ts` | Created | Ten advisor unit tests |
| `docs/configuration.md`, `SKILL.md`, `config/README.md` | Created/Modified | Operator documentation for default-off and the exclusion |
| `016-default-off-and-advisor-exclusion/` | Created | Preserve the complete Level-3 evidence and continuity |
| Parent and Phase 015 link surfaces | Modified | Add Phase 016 to navigation and graph truth |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The package change and the advisor change were verified on independent lanes and joined by a live routing probe. The package gate covers the enablement rule end to end. The advisor gate covers the loader and both seams, and a negative control isolates the change from the advisor's pre-existing failures. This packet records that completed work as the Level-3 evidence, using system-spec-kit templates and the sibling packets.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate enablement at the activation seam through a pure resolver | Keeps the default off, keeps the opt-in private, and makes the rule exhaustively testable |
| Committed-default-off plus a git-ignored local opt-in | An operator enables projection privately without committing the choice for everyone |
| Build an adjustable denylist rather than deprecate or archive the skill | The advisor had no per-skill exclusion mechanism, and the skill stays valid and manually invokable |
| Committed default plus a git-ignored override that fully replaces it | The exclusion is shared, adjustable, and clearable on one machine |
| Wire the denylist at both routability seams | The production recommend gate suppresses routing, and the archive filter is defense in depth |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: typecheck, build, public-import smoke, and 296/296 tests, which is 289 prior plus 7 new |
| Enablement default | PASS: no environment variable and no local file resolves to `false` |
| Enablement opt-in precedence | PASS: the environment variable wins over the git-ignored local file |
| Advisor build and tests | PASS: typecheck and build green; ten new tests in `route-exclusions.vitest.ts` |
| Live advisor probe | PASS: `make CLI output readable, claudish to english` at threshold 0.5 returns `cli-external-orchestration`, `sk-git`, `sk-design`, `sk-code`, and no longer `sk-communication`; before the change it returned `sk-communication` at confidence 0.95 and score 0.85 |
| Negative control | PASS: an empty exclusions directory makes both edits exact no-ops; the change adds +10 passing and 0 new failures against the 41-failure baseline |
| Fail-safe loader | PASS: a missing or malformed config resolves to an empty set and never throws |
| Operator docs | PASS: `docs/configuration.md`, `SKILL.md`, and `config/README.md` each pass `validate_document.py` |
| Phase 016 strict validation | PASS: zero errors and zero warnings |
| Parent strict validation | PASS: zero errors and zero warnings after phase-map, transition-chain, and graph backfill |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Advisor dist rebuild is required on main**: the advisor runs from compiled output, and the packaged `dist/` is git-ignored with no tracked compiled files. Only source lands. The compiled routing gate takes effect on main only after a rebuild and reindex on the target.
2. **Known advisor failure baseline**: the advisor's full vitest suite shows 41 pre-existing failures from unrelated prior worktree drift. This phase's change adds ten passing tests and zero new failures. Reproduce a failure in isolation before attributing it to this change.
3. **Activation paths must call the gate**: the default-off guarantee depends on every activation path calling `isProjectionEnabled()` before it projects, which the projection contract requires.

### Post-Land Continuation

After this work lands on main:

1. Rebuild the advisor so the compiled gate loads `config/route-exclusions.json`.
2. Reindex the advisor so its skill set reflects the intended routing.
3. Re-probe with `skill_advisor.py "make CLI output readable, claudish to english" --threshold 0.5` and confirm `sk-communication` is absent.
<!-- /ANCHOR:limitations -->
