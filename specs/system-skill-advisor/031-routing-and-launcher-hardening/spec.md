---
title: "Feature Specification: Advisor routing and launcher hardening"
description: "Six advisor open ends remain after the doctor releases: substring partial credit in the scorer, the bare environment-variables prompt, inactive deep-loop and MCP doctor bridges, a launcher that reinstalls node_modules for a stale build, an unvalidated advisor playbook and Human Voice Rules blockers in the advisor docs."
trigger_phrases:
  - "routing and launcher hardening"
  - "fix the advisor open ends left after"
  - "scorer substring partial credit"
  - "launcher npm ci wipes node_modules"
  - "advisor playbook validator exclusion"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Advisor routing and launcher hardening

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-17 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor releases left six advisor defects open. Each one was checked against the code before planning:

1. `scoreTokenOverlap` in `runtime/lib/scorer/text.ts` gives 0.45 credit when either 4-plus-character token contains the other. The prompt word `list` scores against the sk-git phrase `push allowlist`, so sk-git carries the broad phrase `push` instead. Restoring `push allowlist` under the current rule flips the labeled row "Review this PR for blocking routing regressions and list findings first." from sk-code to sk-git (observed in a scratch copy of the build).
2. The bare prompt `environment variables` routes to nothing (observed: empty recommendation list).
3. `/doctor:deep-loop` has no activation entry in `scoring-compatibility.json`, and the bridge deriver never reads `mcp_subroutes`, so the advisor cannot suggest either.
4. `buildIfNeeded` in `.skilled/bin/system-skill-advisor-launcher.cjs` runs `npm ci` whenever the build is stale, even when `node_modules` already matches the lockfile. Offline, `npm ci` deletes `node_modules` first and then fails.
5. `playbook-corpus-manifest.json` lists the whole advisor playbook as routing gold, so the package validator checks none of its 61 files (`routing_gold_excluded=61`).
6. `hvr_scan.py` reports 29 hard blockers in the advisor `SKILL.md` and 8 in the advisor playbook index.

### Purpose
Close each open end with a verified fix, or record with evidence why it cannot close, without losing a routing row that passes today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The scorer containment rule in `text.ts`, and restoring `push allowlist` in sk-git's metadata.
- A design that routes `environment variables` to system-spec-kit while `check my environment variables` keeps `/doctor:env` first, or a recorded stop if no design does both.
- Activation of the deep-loop and MCP doctor bridges with three-word phrases.
- The launcher's install step.
- Making the package validator check the advisor playbook, and fixing what it finds.
- The HVR hard blockers in the advisor `SKILL.md` and playbook index, plus the Hermes skill sync.

### Out of Scope
- Changelog entries. The coordinator writes them.
- Files owned by `specs/sk-git/033-git-setup-customization/010-open-ends-cleanup`: `git-setup-check.cjs`, the sk-create-command docs, sk-prompt hub files, `synthesis-closeout.cjs` and the 033 `spec.md`.
- Commits, pushes, the trigger index and track roots.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts` | Modify | Asymmetric containment rule for partial credit |
| `.skilled/skills/sk-git/graph-metadata.json` | Modify | `push` back to `push allowlist` |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three-word deep-loop and MCP phrases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/*` | Modify | MCP sub-routes read by the deriver, activation entries, regenerated projection |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Modify | Read MCP sub-routes the same way the deriver does |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Skip the reinstall when `node_modules` matches the lockfile |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-corpus-manifest.json` | Modify | Drop the advisor whole-tree override |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/**` | Modify | Conform 22 operator scenarios; clear index HVR blockers |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Clear HVR hard blockers |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `runtime/scripts/skill_advisor.py` | Modify | Lead-phrase ordering exception |
| `.skilled/commands/doctor/scripts/route-validate.py` | Modify | Validate `lead_phrases` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The scorer fix ships only if every moved routing row is judged correct, and `push allowlist` replaces `push` only with that fix. |
| REQ-002 | `environment variables` reaches system-spec-kit while doctor-a-05 keeps `/doctor:env` first, or the item stops with evidence that no design does both. |
| REQ-004 | The launcher never leaves `node_modules` worse than it found it when the build is stale and the install would fail. |
| REQ-007 | No routing row that passes today is lost (per-prompt comparison Lost 0, short-prompt probe LOST 0 and CHANGED 0 outside the intended rows). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | `/doctor:deep-loop` and the `/doctor:mcp` sub-actions are suggested by the advisor, each active phrase has three or more words, and a skill keeps first place where one also fits. |
| REQ-005 | The package validator checks every advisor operator scenario against the scenario contract, the routing-gold files stay excluded, and the advisor package passes. |
| REQ-006 | The advisor `SKILL.md` and playbook index have 0 HVR hard blockers, with meaning, code spans, paths and tables unchanged. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full advisor vitest suite, the Python suite and the routing CI steps pass, against a baseline of 144 files, 1184 passed and 6 skipped for vitest and 68 passed for Python.
- **SC-002**: The live CLI routes `push allowlist` to sk-git and the review prompt to sk-code first.
- **SC-003**: Each code fix has a test that fails when the old code is put back.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A scorer change moves routing rows outside the target | High | Score every corpus and the doctor slice in a scratch copy of the build before landing, and report each move |
| Risk | Luna's sandbox wipes `runtime/node_modules` if it runs an install | High | The preamble forbids `npm ci`, `npm install` and the launcher; restore from the lockfile if it happens |
| Dependency | The parallel 033/010 build edits sk-git and sk-prompt files | Med | Diff any shared file before editing and never revert files this packet did not change |
| Risk | Removing baked results from legacy scenarios loses recorded runs | Low | Git history keeps them; scenario truth must not carry run output under the contract |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The launcher's lockfile check reads only the lockfile and each installed package's `package.json`, and runs only when the build is already stale.

### Security
- **NFR-S01**: No new network call. The launcher fix removes a network-dependent step from the stale-build path.

### Reliability
- **NFR-R01**: A failed or skipped install never deletes an installed dependency tree that already matches the lockfile.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Optional platform packages listed in the lockfile but not installed on this platform do not count as a mismatch.
- A missing lockfile keeps the existing `npm install` path.

### Error Scenarios
- Offline install failure: with a matching `node_modules`, no install runs, so nothing is deleted.
- A version mismatch or missing package still runs the install, as today.

### State Transitions
- A doctor bridge with no passing skill still ranks first. A passing skill still ranks above an untyped doctor bridge.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 40 files across the scorer, deriver, launcher, validator manifest and docs |
| Risk | 15/25 | Shared scorer and a shared route manifest; routing rows can move |
| Research | 14/20 | Each scorer variant was measured against four corpora before planning |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Item 2 was resolved by the operator, who approved an authored `lead_phrases` field in `_routes.yaml`. See `plan.md` §3.
<!-- /ANCHOR:questions -->

---
