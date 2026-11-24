---
title: "Implementation Plan: Phase 17: fleet-front-door-stdin"
description: "Rewrite every live --prompt \"<task>\" instruction to a quoted stdin heredoc, re-mint the manifests the edits move, and run every hub's checks."
trigger_phrases:
  - "fleet front door stdin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: fleet-front-door-stdin

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, CommonJS |
| **Framework** | Compiled hub routing |
| **Storage** | None |
| **Testing** | `node --test .skilled/bin/tests/*.test.cjs`, the sk-doc pytest suite, each hub's canary harness, `parent-skill-check` |

### Overview

One mechanical rewrite across the fleet. A script turns each standalone command line into three lines (`--prompt-stdin <<'TASK'`, the task, `TASK`), and each inline mention into the heredoc form with a short note. Three code surfaces are edited by hand: `init_skill.py`, the parity fixture and the bin README table.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- A grep at HEAD lists every live `--prompt "<task>"` line.

### Definition of Done

- Every REQ in `spec.md` is Met in `acceptance-criteria.md`, and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fix at the producer. The sk-doc template and `init_skill.py` produce the callout for new hubs, so they change along with the live hubs.

### Key Components

- `compiled-route.cjs`, which already reads the prompt from stdin under `--prompt-stdin`.
- The activation manifests, which pin each hub's policy hash.

### Data Flow

The agent runs the heredoc. The shell passes the quoted body unchanged on stdin. The front door reads it and routes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Eight hubs' `SKILL.md` and `ROUTER.md` | Instructions an agent runs | Rewrite | Repo grep; heredoc injection check on each hub |
| Template, `init_skill.py`, architecture reference | Producers for new hubs | Rewrite | sk-doc pytest suite |
| Parity fixture | Test of the callout wording | Rewrite | Parity test exit 0 |
| Activation manifests | Consumers of the policy hash | Re-minted | `compiled-route-guard.cjs` 8 fresh |
| Generated intent signals | Advisor vocabulary from `ROUTER.md` | Regenerated | Generator RESULT: PASSED on all eight |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Rewrite the 32 lines.
2. Re-mint the manifests, regenerate intent signals, sync the sk-doc archive word.
3. Run the hub checks, canaries, the sk-doc tests and the bin suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Front door, sync, scaffold | `node --test .skilled/bin/tests/*.test.cjs`; `python3 -m pytest scripts/tests` in sk-doc |
| Integration | Each hub's routing corpus | Eight canary harnesses |
| Manual | Shell injection | A heredoc task holding `"`, `$()` and a backtick on each hub |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `--prompt-stdin` in `compiled-route.cjs` | Internal | Green | None; it shipped before this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit, then re-mint each hub's activation manifest with `compiled-route-manifest.cjs refresh` and copy it to its archive path.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rewrite | None | Re-mint |
| Re-mint and signals | Rewrite | Checks |
| Checks | Both of the above | Closure |
<!-- /ANCHOR:phase-deps -->
