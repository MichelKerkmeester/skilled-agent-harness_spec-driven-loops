---
title: "Feature Specification: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes"
description: "Three hub registry compilers emit one composition rule for every subset of two or more modes, and the list is rebuilt, hashed and validated on each route call. The count doubles with each mode, so a hub with 18 modes carries 262,125 rules and a route call takes seconds. A bundle is capped at four modes and a test bounds the rule count."
trigger_phrases:
  - "compiled route rule growth"
  - "cap the mode subset size the hub registry"
  - "max bundle modes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/367-advisor-route-growth-and-node-plans` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The registry compilers of sk-code, mcp-tooling and sk-design emit one composition rule for every subset of two or more modes in the hub's tie-break order. Nothing stores the result, so every route call rebuilds, hashes and validates the whole list. The count doubles with each mode. Barter's sk-code hub has 18 modes, which gives 262,125 rules, a route call of 4.5 to 7.8 seconds and an advisor that times out on every prompt routed to sk-code. Those Barter figures come from Barter's handover and were not rerun here.

### Purpose
A compiled route call stays fast as a hub gains modes, and a test fails before a hub's rule count grows large again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node specs/sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth/scratch/measure-rule-counts.cjs
001-sk-code modes=5 rules=26 bySize={"2":10,"3":10,"4":5,"5":1}
003-mcp-tooling modes=8 rules=247 bySize={"2":28,"3":56,"4":70,"5":56,"6":28,"7":8,"8":1}
009-sk-design modes=3 rules=4 bySize={"2":3,"3":1}

$ node --test .skilled/bin/tests/
tests 173
pass 172
fail 0
skipped 1

In Barter's vendored tree, whose sk-code hub has 18 modes and already carries a cap of four:
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this pull request and fix the failing typescript test"
run1 156ms, run2 154ms, run3 159ms
modes 18 rules 4029 {"2":153,"3":816,"4":3060}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `MAX_BUNDLE_MODES` constant of 4 to the sk-code, mcp-tooling and sk-design registry compilers, and skip every subset larger than it in `buildCompositionRules` and `buildBundleRules`.
- Correct the comments in those compilers and in the three routers that say every subset has a rule.
- Rebuild the served copies under `.skilled/bin/lib/compiled-routing` from the edited authored files.
- Refresh the activation manifest of each hub whose policy hash changes.
- Add one test file that fails when a rule holds more than four targets or a hub holds more than 5,000 rules. Extending `compiled-route-sk-design-tie.test.cjs` fails, because it loads only the sk-design snapshot and the bound has to hold for all three hubs.

### Out of Scope
- A closed-form rule that replaces the rule list - the operator chose the cap on 2026-11-13. It would change the compiled policy schema, the shared decision check and every policy hash.
- A compiled snapshot stored on disk - with the cap a route call on 18 modes takes about 155 ms, so there is no measured cost left for it to remove.
- The unused `nonEmptySubsets` helper in the sk-code compiler - nothing calls it, and removing it is a separate change.
- Barter's tree - Barter drops its own overlay when it re-pins to the Skilled commit that carries this change.

### Files to Change

`A` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout`. The files under `.skilled/bin/lib/compiled-routing` are served copies and change only through the sync step.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `A/001-sk-code/lib/registry-compiler.cjs` | Modify | Add the constant, cap both builders, correct the comment |
| `A/003-mcp-tooling/lib/registry-compiler.cjs` | Modify | Add the constant, cap both builders, correct the comment |
| `A/009-sk-design/lib/registry-compiler.cjs` | Modify | Add the constant, cap both builders, correct the comment |
| `A/001-sk-code/lib/canary-router.cjs` | Modify | Correct the comment above `exactBundle` |
| `A/003-mcp-tooling/lib/router.cjs` | Modify | Correct the comment above `exactBundle` |
| `A/009-sk-design/lib/canary-router.cjs` | Modify | Correct the comment above `exactBundle` |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/{sk-code,mcp-tooling}/manifest.json` | Modify | Refreshed for the new policy hash |
| `.skilled/bin/lib/compiled-routing/**` | Modify | Served copies and activation manifests, rewritten by `compiled-route-sync.cjs` and `compiled-route-manifest.cjs` |
| `.skilled/bin/tests/compiled-route-rule-bound.test.cjs` | Create | Bound on targets per rule and rules per hub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No compiled rule holds more than four targets | `node specs/sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth/scratch/measure-rule-counts.cjs` prints `rules=25 bySize={"2":10,"3":10,"4":5}` for sk-code, `rules=154 bySize={"2":28,"3":56,"4":70}` for mcp-tooling and `rules=4 bySize={"2":3,"3":1}` for sk-design |
| REQ-002 | The served copies match the authored files | `node .skilled/bin/compiled-route-sync.cjs --check` exits 0 and prints `all 55 served copies match their authored files` |
| REQ-003 | The bin tests pass with the new test file | `node --test .skilled/bin/tests/` reports `fail 0` and 176 tests |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The activation manifests of sk-code and mcp-tooling are fresh | `node .skilled/bin/compiled-route-manifest.cjs freshness --hub sk-code --skill-root .skilled/skills/sk-code` prints `"fresh":true`, and the same command for mcp-tooling prints `"fresh":true` |
| REQ-005 | A compiled route still answers for sk-code | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this pull request and fix the failing typescript test"` prints a line containing `"action":"route"` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The measurement script prints 25, 154 and 4 rules for the three hubs, with no bundle size above 4.
- **SC-002**: The new test fails against the uncapped compilers and passes after the cap, and `node --test .skilled/bin/tests/` reports `fail 0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `compiled-route-sync.cjs` rebuild, verify and finalize steps | The served copies stay on the old compilers and the sync check fails | Run the three steps in order and keep the rollback path the rebuild prints until the check passes |
| Risk | A near tie across five or more modes no longer has a rule. `exactBundle` returns null, the policy check throws `BUNDLE_NOT_IN_POLICY` and the front door prints the legacy sentinel | Med | This is the accepted trade-off. sk-code loses 1 rule and mcp-tooling loses 93. If a canary or parity case needs a wider rule, stop and report the case instead of raising the cap |
| Risk | The policy hash of sk-code and mcp-tooling changes, so their activation manifests go stale | Med | Check freshness after the rebuild and refresh each stale manifest. T002 records how the authored and served manifests are kept equal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Why 4? Decision: it is the value Barter's overlay runs on 18 modes, where a route call measured about 155 ms with 4,029 rules.
- Why a bound of 5,000 rules? Decision: it admits the largest known hub, 4,029 rules at 18 modes, and fails at 19 modes, which give 5,035. This is a chosen bound, not a measured limit.
- How do the authored and served manifests stay equal? Decision: the rebuild refuses to run while a hub's manifest is stale, so each stale manifest is refreshed in the authored tree first, with `compiled-route-manifest.cjs refresh --runtime-root` pointed at the authored root. The rebuild then copies it to the served tree.
<!-- /ANCHOR:questions -->

---
