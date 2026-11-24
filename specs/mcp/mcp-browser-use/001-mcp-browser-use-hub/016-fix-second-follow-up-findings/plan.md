---
title: "Implementation Plan: Phase 16: fix-second-follow-up-findings"
description: "Fix the five confirmed findings at source: router scoring, Aside install docs, Aside vocabulary, front-door input and the Node version, each with its own check."
trigger_phrases:
  - "fix second follow up findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: fix-second-follow-up-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS router, JSON routing data, Markdown, Bash |
| **Framework** | Compiled hub routing |
| **Storage** | None |
| **Testing** | The hub canary harness, the two-stage replay, `node --test` over `.skilled/bin/tests`, the advisor ratchet and suite |

### Overview

One scoring change and four doc fixes. The router counts a keyword match once when a longer match in the same prompt contains it, which fixes the id-versus-alias gap for every mode at once. The rest are doc and vocabulary edits, each checked by its own command.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Each finding has a check row in `../review/review-report.md`.

### Definition of Done

- Every REQ in `spec.md` is Met in `acceptance-criteria.md`, and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix at the producer. 015 fixed the three-id case with an alias, which treated one symptom. The cause is the scorer counting a contained match, so this phase changes `scoreModes`.

### Key Components

- `scoreModes` in the hub's compiled router, and its authored archive copy that `compiled-route-sync.cjs` checks.
- Aside's vocabulary class in `hub-router.json`, mirrored in `ROUTER.md`.

### Data Flow

The front door folds the prompt, matches each mode's keywords, drops contained matches, then scores and selects near ties. Only stage two changes; the advisor is untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `router.cjs` `scoreModes` | Producer of mode scores | Update | Canary harness with and without the change |
| Authored archive copies of the router and fixture | Sync source | Copied from served | `compiled-route-sync.cjs --check` lists no hub file |
| Aside vocabulary | Producer of the Aside score | Add `in aside` | Out-of-domain "aside" prompts still defer |
| Aside install docs and doctor hint | Instructions an agent runs | Point at the wrapper | Repo grep for the pipe |
| Hub activation manifest | Consumer of the policy hash | Re-minted | `compiled-route-guard.cjs` 0 stale |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Router: contained-match rule, canary cases, sync the archive copies.
2. Vocabulary and docs: `in aside`, Aside install surfaces, stdin heredoc, Node 20.
3. Release 1.1.4.0, manifest re-mint and the 56-row replay.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Compiled-route and installer tests | `node --test .skilled/bin/tests/compiled-route-*.test.cjs .skilled/bin/tests/mcp-installers.test.cjs` |
| Integration | Both routing stages | The 56-row replay and the canary harness |
| Manual | Shell injection through the front door | A heredoc task holding `$()` and a backtick |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The lockstep parity test's pinned callout | Internal | Green | The `ROUTER.md` callout keeps `--prompt "<task>"` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit, then re-mint the activation manifest with `compiled-route-manifest.cjs refresh --hub mcp-browser-use` and copy it to its archive path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Router rule | None | Canary cases |
| Vocabulary and docs | None | Manifest re-mint |
| Release and replay | Both of the above | Closure |
<!-- /ANCHOR:phase-deps -->
