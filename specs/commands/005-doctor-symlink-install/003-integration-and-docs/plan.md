---
title: "Implementation Plan: Phase 3: integration-and-docs"
description: "This phase registers both doctor commands on every surface the family is listed on: route manifest, setup target list, advisor activation lists, helper fixtures, the two command indexes, the two READMEs, the catalog, the playbook and the runtime mirrors."
trigger_phrases:
  - "integration and docs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: integration-and-docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML and JSON, plus the Node CommonJS generators the repository already ships |
| **Framework** | The Skilled doctor command family and the system-skill-advisor bridge deriver |
| **Storage** | None |
| **Testing** | `node:test`, the doctor bash checks, vitest and Python unittest |

### Overview

This phase adds no behavior. It edits the route manifest, the setup target list, the advisor activation lists, the helper fixtures, the two command indexes and the docs, then regenerates every derived copy. It is proved by the route, phrase, catalog, bridge, mirror and strict-validate checks, none of which write to a target repository.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` reports 28 routes and `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry fan-out. One route manifest feeds every derived surface.

### Key Components
- **`_routes.yaml`**: the one route source the helper, the bridge deriver and the route validator read
- **`doctor-setup-presentation.txt`**: the target list the helper contract test compares against the routers
- **`scoring-compatibility.json`**: the activation gate that decides whether a derived bridge routes
- **The deriver and the mirror generators**: turn the manifest into bridges, and `.skilled` into every runtime mirror

### Data Flow
A router file and its manifest route feed `derive-command-bridges.cjs`, which writes the four bridge files that the helper and the advisor scorer read. `doctor-helper-contract.test.cjs` compares the setup presentation against the routers. `command-catalog-mirror-check.cjs` compares each index against the command frontmatter. The mirror generators copy `.skilled` into each runtime tree, and their `--check` mode proves the copy is current.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase fixes no reported finding and touches no bug surface; it registers two new commands on the surfaces that already exist.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the current manifest and index counts and runs the two read-only checks. Implementation edits the routes, setup list, activations, fixtures, indexes and docs, then regenerates every derived copy. Verification runs the doctor, route, phrase, catalog, bridge, mirror and strict-validate checks.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Route manifest, setup presentation and helper fixtures | `node --test` doctor suites |
| Integration | Advisor bridges, routing slices and the Python harness | vitest, Python unittest |
| Manual | The live advisor prompt and both real repositories, read-only | `/doctor:install` and `symlink-engine.cjs check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The two frozen contracts | Internal | Green | The integration edits have no stable interface |
| The bridge deriver | Internal | Green | Both bridges stay inactive |
| node, python3 and bash | Internal | Green | No route, bridge or mirror check can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new routes make `/doctor:helper` rank the wrong command, or a generated mirror disagrees with `.skilled`.
- **Procedure**: Revert the integration commit and rerun each generator. The engine and both routers stay in place and simply stay unreachable from the helper, the setup list and the advisor.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001 engine + router ──┐
                      ├──► 003 routes ──► 003 advisor activation ──► 003 docs ──► 003 verification
002 install guide ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 003 routes | 001 engine and router, 002 install guide | Advisor activation, docs |
| 003 advisor activation | 003 routes | Helper fixtures, phrase reach |
| 003 docs | 003 routes | Mirrors |
| 003 verification | Advisor activation, docs, mirrors | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
