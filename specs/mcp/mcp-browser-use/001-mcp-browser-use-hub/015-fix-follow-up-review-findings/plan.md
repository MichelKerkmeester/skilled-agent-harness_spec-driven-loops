---
title: "Implementation Plan: Phase 15: fix-follow-up-review-findings"
description: "Fix the findings the follow-up deep review confirmed. The hub gets data edits and two script fixes, and the advisor gets one narrower anchor rule. Each change is checked by the canary corpus, the two-stage replay and the advisor's pinned gates."
trigger_phrases:
  - "fix follow up review findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 15: fix-follow-up-review-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON routing data, Markdown, Bash, TypeScript (advisor scorer) |
| **Framework** | Compiled hub routing and the skill advisor scorer |
| **Storage** | None |
| **Testing** | Vitest (advisor suite), `node --test` (installers), the hub canary harness, the two-stage replay script |

### Overview

The hub defects are data and script fixes. A missing alias drops Bladebro from the three-mode bundle, a stale matrix cell offers Aside event listeners, a path guard skips `..`, and an installer pipes curl into bash. The advisor residual is one rule change: the id noun names a skill only beside another shared word. Every change is measured before it lands, and any pinned number that moves goes to the operator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Each finding has a reproduction from the reviewer's own case or a reworded one, recorded in `../review/review-report.md`.

### Definition of Done

- Every REQ in `spec.md` is Met in `acceptance-criteria.md`, and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix each finding at its producer. The bundle drop lives in the router vocabulary, so the fix is an alias, not a scoring change.

### Key Components

- `hub-router.json` and its four vocabulary copies, which the front door compiles.
- The advisor's `confidenceFor` anchor test in `fusion.ts`, and the explicit and lexical lanes.

### Data Flow

A prompt reaches the advisor first (stage one), then the hub's compiled front door (stage two). The scorer change touches only stage one. The vocabulary change touches only stage two, and it re-mints the activation manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hub-router.json` Bladebro aliases | Producer of the mode scores | Update: add `mcp-bladebro` | Canary bundle case; front-door call |
| `ROUTER.md`, `mode-registry.json`, `graph-metadata.json`, `description.json` | Vocabulary copies | `ROUTER.md` updated; the other three already hold the ids | Script diff of the copies prints 0 differences |
| `fusion.ts` `promptNamesIdNoun` | Producer of the id-noun anchor | Update | In-process probes; ratchet and suite |
| `lanes/explicit.ts`, `lanes/lexical.ts` browser entries | Producers of the staging anchor | Update | Probe; replay MBU-N-20 |
| Doctor slice, command slice, divergence ledger, ratchet baseline | Pinned consumers | One doctor row re-pinned (Q009); the rest unchanged | Full advisor suite |
| Hub activation manifest | Consumer of the policy hash | Re-minted | `compiled-route-guard.cjs` 0 stale |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Advisor: probe each id noun, attribute every lift to its anchor clause, then land the rule and the staging edits. Run the whole gate battery.
2. Hub: alias, canary case, matrix cell, path guard and pinned installer.
3. Docs: version 1.1.3.0, changelogs, vocabulary sync, indexes and the follow-up replay.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor scorer and pinned slices | `npx vitest run` in the advisor runtime |
| Integration | Both routing stages | The 52-row two-stage replay and the hub canary harness |
| Manual | The path guard and the installer digest | A stub `aside` on PATH; `shasum -a 256` on the downloaded installer |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The Aside vendor installer at `releases.aside.com` | External | Green | A new script fails the digest check until the pin is bumped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the advisor commit and the hub commit separately. The advisor commit holds only the scorer, its doctor pin and its release note. After reverting the hub commit, re-mint the activation manifest with `compiled-route-manifest.cjs refresh --hub mcp-browser-use`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Advisor rule | The probe attribution | The replay |
| Hub fixes | None | The manifest re-mint |
| Docs and replay | Both of the above | Closure |
<!-- /ANCHOR:phase-deps -->
