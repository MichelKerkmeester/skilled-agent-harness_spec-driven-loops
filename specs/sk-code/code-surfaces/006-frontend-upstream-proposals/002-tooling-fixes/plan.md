---
title: "Implementation Plan: Phase 2: tooling-fixes"
description: "Teach the intent-signal generator to report and prune orphan phrases behind a keep marker, and give router reach a default that does not mistake advisor load for unreachable phrases, each proven by a fixture test."
trigger_phrases:
  - "tooling fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: tooling-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts |
| **Framework** | None |
| **Storage** | Hub `graph-metadata.json` files |
| **Testing** | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` |

### Overview
`plan()` in the generator gains an orphan list next to its missing list. `--check` reports and fails on orphans, and `--write` drops them. Reach gets a safer default, chosen by one measured comparison. Fixture tests prove both and fail when the change is reverted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` exits 0 with the new tests listed
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two script branches.

### Key Components
- **`generate-router-intent-signals.cjs`**: owns `plan()`, `write()` and the `--check` gate.
- **`ci-router-vocabulary-reach.cjs`**: owns `DEFAULT_CONCURRENCY` and the retry path that turns failures into `probe-error` rows.

### Data Flow
Router `INTENT_SIGNALS` phrases are read per hub and compared, lower-cased, with the hub's `intent_signals`. Missing phrases are appended as today, and orphans without a keep marker are reported, then removed on `--write`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `generate-router-intent-signals.cjs` | Adds missing phrases only | update | Fixture test for orphans and keep marker |
| `ci-router-vocabulary-reach.cjs` | Defaults to concurrency 8 | update | Test pins the default |
| CI or hooks that call `--check` | Gate on missing phrases | not a consumer of the change, but now also fail on orphans | `rg -n "generate-router-intent-signals" .github .skilled --glob '*.yml' --glob '*.json' --glob '*.sh' --glob '*.cjs'` |
| Hub `graph-metadata.json` files | Hold the live signals | unchanged in this phase | `git diff --stat` shows no hub metadata change |

Required inventories:
- Same-class producers: `rg -n "intent_signals" .skilled/skills/sk-doc/sk-create-skill/scripts`.
- Consumers of changed symbols: `rg -n "DEFAULT_CONCURRENCY|--concurrency" .skilled .github`.
- Matrix axes: orphan present or absent, by keep marker present or absent, by `--check` or `--write`.
- Algorithm invariant: `--write` never removes a phrase a router declares or a phrase with the keep marker.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures reach at both concurrencies and lists callers of `--check`. Implementation changes the two scripts. Verification runs the tests and saves the live orphan report.

**Executors.** Research and verification dispatches go to DeepSeek V4.1 Flash 1017 through opencode-go, with the model literal confirmed from `cli-pi/SKILL.md` and `cli-opencode/references/providers-and-models.md` before the first dispatch. Builds dispatch to `cli-codex --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, never through a gateway.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Orphan computation, keep marker, write order, reach default | `node --test` |
| Integration | `--check` against the live tree | The script itself, output saved to `scratch/orphans.txt` |
| Manual | Reach at concurrency 8 vs the new default on sk-code | `ci-router-vocabulary-reach.cjs --hub sk-code` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js (repository version) | External | Green | None |
| Advisor daemon | Internal | Green | No measured concurrency comparison |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A CI or hook gate starts failing on orphans that turn out to be intentional signals.
- **Procedure**: Revert the generator commit with `git revert`, then mark the intentional signals with the keep marker before reapplying.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (measure, inventory callers) ──► Implementation (generator, reach) ──► Verification (tests, live report)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 closed | Implementation |
| Implementation | The measured reach comparison | Verification |
| Verification | Both script changes | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---
