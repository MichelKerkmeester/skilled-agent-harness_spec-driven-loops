---
title: "Implementation Plan: Phase 2: router-file-tooling"
description: "Build one resolver that finds a skill's machine router in a sibling ROUTER.md and falls back to the SKILL.md section, move router replay, router sync and the dead-route scan onto it, carry ROUTER.md through the Hermes generator, and add the third probe to both advisor freshness signatures with a parity test."
trigger_phrases:
  - "router file tooling plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: router-file-tooling

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, TypeScript, Python 3.9 |
| **Framework** | None |
| **Storage** | None (the advisor reads its own sqlite graph, unchanged here) |
| **Testing** | `node --test`, `unittest`, `vitest` |

### Overview
One new module decides which document holds a skill's machine router and refuses to pick when two documents both declare one. Router replay, router sync and the dead-route scan ask it instead of deciding for themselves, the Hermes generator copies `ROUTER.md` beside `SKILL.md`, and the advisor grows a third per-skill probe in both of its freshness signatures. The proof is the seven commands in the measured-behavior block holding their current numbers, plus a fixture skill per verdict.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`
- [x] `python3 .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify_alignment_drift.py --root .skilled/skills --check-router` prints `Findings: 0` over 5420 files
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One resolver, three callers

### Key Components
- **`router-file-resolver.cjs`**: owns the machine-router heading grammar, the two candidate documents and the verdict. It parses nothing, so router replay and the dead-route scan keep their own extractors.
- **`parseRouter` in `router-replay-lib.cjs`**: keeps its current signature and asks the resolver which text to parse, so its two existing call sites and the test fixtures do not move.
- **`check_router_paths` in `verify_alignment_drift.py`**: repeats the precedence rule across the same two documents, because a Python check cannot require a CommonJS module, and one parity case runs both implementations over the same fixtures.

### Data Flow
For a skill root the resolver probes `ROUTER.md` first. It slices that file from the machine-router heading to the end of the file and tests the slice for an assignment header, the `INTENT_SIGNALS =` or `RESOURCE_MAP =` grammar that `root-router-contract.cjs` already uses. It does the same with the `SKILL.md` text its caller passes in. One declaring document resolves and its slice is returned with the source path. Two declaring documents return the dual-declaration verdict and no text. No declaring document returns no source, and the fallbacks `parseRouter` already carries, first a referenced router doc and then `hub-router.json`, keep running unchanged.

The hub shape is what makes the heading load-bearing. A hub's `ROUTER.md` holds its stage-two map under a `MACHINE-READABLE ROUTER` heading, numbered 3 in six hubs and 9 in sk-code, which never matches the machine-router heading. A hub therefore still resolves through `hub-router.json` exactly as it does today.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the four baselines, Implementation builds the resolver and moves the three readers, then the Hermes copy, then the four advisor changes, and Verification reruns every suite against the live tree.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | One resolver case per verdict, one scan case per document shape, one generator case for the copied file | `node --test`, `python3 ... test_verify_alignment_drift.py` |
| Integration | Router sync and the dead-route scan over the live `.skilled/skills` tree | `verify-router-sync.cjs`, `verify_alignment_drift.py --check-router` |
| Parity | The two freshness signatures over one fixture workspace | `vitest run tests/parity/router-signature-parity.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js 20.19 or newer, the `engines` floor in `.skilled/skills/system-skill-advisor/runtime/package.json` | Internal | Green | The resolver, replay and the generator cannot run |
| Python 3.9 | Internal | Green | The dead-route scan cannot run |
| `vitest` at `.skilled/skills/system-skill-advisor/runtime/node_modules/.bin/vitest` | Internal | Green | The freshness and parity suites cannot run |
| The `## MACHINE ROUTER` heading in phase 003's template | Cross-phase | Pending | Without it, every router that phase 005 moves becomes unreadable to the resolver |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the source probe returns anything other than `{"hub-router.json":7,"inline":6}`, or `verify-router-sync.cjs` reports fewer than 5 checks passing.
- **Procedure**: revert the phase commit. Nothing outside the working tree changes, because this phase writes no generated copy and recaptures no baseline. Regenerate the Hermes copies with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` if the revert leaves copies carrying a `ROUTER.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure of the phase |
<!-- /ANCHOR:phase-deps -->

---
