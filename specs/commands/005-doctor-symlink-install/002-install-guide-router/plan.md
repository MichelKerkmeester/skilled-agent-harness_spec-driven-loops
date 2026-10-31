---
title: "Implementation Plan: Phase 2: install-guide-router"
description: "Three files under the doctor command folder: a read-only router with one guide target, a five-step workflow that inspects the target and prints the ordered setup commands, and the presentation that owns every visible word."
trigger_phrases:
  - "install guide router plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: install-guide-router

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router, one YAML workflow, one plain-text presentation |
| **Framework** | The doctor command contract and `_routes.yaml` |
| **Storage** | None |
| **Testing** | `route-validate.sh`, `doctor-helper-contract.test.cjs`, `doctor-phrase-reach.cjs`, the engine's live dry run |

### Overview
The guide is three files. A router binds one `guide` target and loads the other two. A workflow runs five steps: probe the two builds, ask once, inspect the target with the phase 001 engine, print the checklist, print the caveat. A presentation owns every visible string, and the guide ends there, because every writing step is handed to the operator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met, each proved by the command it names
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the install route in the manifest
- [ ] `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/commands/005-doctor-symlink-install/002-install-guide-router --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One router, one workflow, one presentation. The router binds the route, the workflow owns the order, the presentation owns the wording.

### Key Components
- **`install.md`**: the router. Declares the `guide` target, the flags `--root`, `--runtimes` and `--json`, and the `list`, `?` and `menu` shortcut. It loads the presentation first and the workflow second.
- **`assets/doctor-install.yaml`**: the five steps. It probes the spec-kit build directory and the advisor CLI, asks once for the four missing answers, runs the engine check once, then prints the checklist and the caveat.
- **`assets/doctor-install-presentation.txt`**: every visible string. The argument failure, the build block, the prompt, the status legend, the ordered steps, the caveat and the result templates live here and nowhere else.
- **`scripts/symlink-engine.cjs`** (phase 001, read-only here): the `check` subcommand behind the inspect step and the `--json` report behind `--json`.

### Data Flow
The router reads its route, resolves the flags against `allowed_flags`, and loads the YAML. The YAML probes the two builds, binds `--root` and `--runtimes`, asks for the remaining answers, runs `check` once, and renders the presentation. The operator copies each printed command out and runs it. The guide stops after the caveat line.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a router rather than repairing one, so the surfaces below are the files it creates and the family copies that must learn about them.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `install.md` | New router, no consumer yet | create | `route-validate.sh` B3 and F2 |
| `assets/doctor-install.yaml` | New workflow behind the `guide` target | create | `route-validate.sh` D1, L1 and K1 |
| `assets/doctor-install-presentation.txt` | New presentation the router loads before the workflow | create | `route-validate.sh` J1 |
| `_routes.yaml` `/doctor:install` route | Names the command's target, class and phrases | update in phase 003 | `route-validate.sh` J1, then `doctor-phrase-reach.cjs` |
| `assets/doctor-setup-presentation.txt` section 2 | The family's target list | update in phase 003 | `doctor-helper-contract.test.cjs` |

Required inventories:
- Same-class producers: `rg -n "doctor-(setup|helper)\.yaml" .skilled/commands/doctor` to keep this workflow's shape in line with the two read-only siblings.
- Consumers of the route: `rg -n "doctor:install" .skilled --glob '!_routes.yaml'` before completion, to find any caller that assumed the command already existed.
- Matrix axes: `--root` (absent, a directory, a refused path), `--runtimes` (absent, one, all seven), link shape (auto, whole, merge), instruction choice (embed, link), root state (absent, linked, merge, foreign).
- Invariant: no execution path in the workflow calls a writing subcommand. A printed command is data, never an action.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the install contract, the sibling `helper.md` router and the engine's status list. Implementation writes the router, the workflow and the presentation. Verification runs the manifest gate, the helper contract suite, the phrase probe and the engine dry run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The workflow parses and its steps keep the contract order | `python3` YAML load, `rg` over the step text |
| Integration | Router, route, presentation and setup row agree | `route-validate.sh`, `doctor-helper-contract.test.cjs` |
| Manual | The inspect step against a real repository, then the printed checklist read against the contract | `symlink-engine.cjs check --root` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 engine `check` and its `--json` report | Internal | Green when phase 001 lands | Step 3 and the `--json` object have no source |
| The `/doctor:install` route in `_routes.yaml` | Internal | Red until phase 003 step 1 | No family gate reads these files, so the criteria stay Unmet |
| `python3` with PyYAML | External | Green | `route-validate.sh` exits 3 |
| `node` with the `yaml` module | External | Green | The helper contract suite cannot parse the manifest |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guide writes anything, or an install phrase reaches `/doctor:mcp install` first
- **Procedure**: Delete the three files and the `/doctor:install` route, then rerun `route-validate.sh`. No data moves, so the revert is the whole rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (contract and sibling router) ──► Implementation (router, workflow, presentation) ──► Verification (family gates)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation and phase 003's route | None |
<!-- /ANCHOR:phase-deps -->
