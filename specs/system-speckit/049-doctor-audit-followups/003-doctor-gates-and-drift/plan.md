---
title: "Implementation Plan: Phase 3: doctor-gates-and-drift"
description: "Restore the mutation-class guard's coverage with a guard-owned manifest, fix the parent-skill fixture module resolution, extend route-validate to workflow activities, and correct the doctor's texts, counts and closed-packet statements."
trigger_phrases:
  - "guard manifest"
  - "fixture resolution"
  - "route validator activities"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: doctor-gates-and-drift

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash and Python 3 (doctor scripts), Node CJS/ESM (guard tests, fable wrapper) |
| **Framework** | None — script gates invoked by the pre-commit hook and by hand |
| **Storage** | YAML manifests, JSON baselines, Markdown presentation text |
| **Testing** | `node --test`, `route-validate.sh --self-test`, the pre-commit hook's own test |

### Overview
Give the mutation-class guard its own manifest so its coverage stops depending on the Code Mode workflow, fix the three parent-skill test fixtures so they resolve the shared package the way the real tree does, extend `route-validate` from script paths to workflow activities, and correct the doctor's remaining wrong text, counts and closed-packet statements. The Codex hook parity comparison is recorded, not repaired.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every finding is re-checked against the current tree and still holds, or is marked resolved
- [x] The old guard manifest rows are recovered from git history for the three skills
- [x] The three failing test suites are captured with their exact error

### Definition of Done
- [x] All acceptance criteria met with the named command output
- [x] The guard, the three test suites, `route-validate.sh --self-test`, and both edited closed packets pass
- [x] The recorded parity comparison is in `scratch/`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Independent script gates over shared manifests: each gate reads a manifest it owns, scans the files the manifest names, and exits with a named rule id.

### Key Components
- **`check-mcp-mutation-class.sh`**: scans read-only doctors for unguarded mutations and asserts installers are labeled `mutating`.
- **Parent-skill checker and its contract libraries**: resolve a hub's contracts relative to the target; the tests copy those libraries into fixtures.
- **`route-validate.py` / `.sh`**: enforce manifest, router and presentation parity.
- **`fable-mode-check.cjs`**: reads the baseline's aggregate and compares live metrics.
- **Presentation and tooling texts**: the operator-facing surface that must match the tools.

### Data Flow
Manifest → guard scan → exit code; fixture copy → checker load → PASS/FAIL; routes manifest + workflow YAML + presentation → validator → exit code; baseline JSON + corpus → wrapper → metric rows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-mcp-mutation-class.sh:49` | Reads `doctor-mcp-install.yaml` | Update: read the guard-owned manifest | `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` lists four skills |
| `.skilled/scripts/git-hooks/pre-commit:301` | Invokes the guard | Unchanged; the guard's default path must keep resolving | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` |
| `parent-skill-check-*.test.cjs` fixture helpers | Copy contract libraries without a resolvable `node_modules` | Update: give the fixture an explicit `@spec-kit` resolution | `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-root-router.test.cjs` |
| `route-validate.py:18,422-430` | Asserts `script_invocations` paths only | Update: assert workflow activities | `bash .skilled/commands/doctor/scripts/route-validate.sh --self-test` |
| `doctor-speckit-presentation.txt:3,31,41,79,86` | Uses generic `/doctor` forms | Update: name the registered command | `rg -n "/doctor[^:]" .skilled/commands/doctor/assets/doctor-speckit-presentation.txt` |
| `audit_descriptions.py:69,290` | Hardcoded 8000; packet label in title | Update: read `SLASH_COMMAND_TOOL_CHAR_BUDGET`; drop the label | `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --help` and a run |
| `quick_validate.py` (two copies) | Docstring carries a packet label | Update: drop the label | `rg -n "packet 086" .skilled/skills/sk-doc/` finds none |
| `ENV-REFERENCE.md:34` | States 144 variables | Update: recount by the stated method | A recount script over the `Variable`-column tables |
| `fable-baseline.json:2` | Points at a deleted corpus | Update: repoint or mark retired | `node .skilled/commands/doctor/scripts/fable-mode-check.cjs --dir <corpus>` |
| `048/003-update/spec.md` Phase Context, `048/013/implementation-summary.md` | Describe the pre-redesign state | Update: two targeted corrections | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet> --strict` |

Required inventories:
- Same-class producers: `rg -n "install_script|doctor_script" .skilled/commands/doctor/assets/doctor-mcp-install.yaml .skilled/skills/mcp-tooling/*/scripts/`.
- Consumers of changed symbols: `rg -n "check-mcp-mutation-class|route-validate|fable-baseline|SLASH_COMMAND_TOOL_CHAR_BUDGET" .skilled --glob '!node_modules'`.
- Matrix axes: manifest present/absent × script present/missing × class read-only/mutating; workflow activity present/absent × route script named/unnamed.
- Algorithm invariant: every manifest-listed script is scanned with its declared class, and no route script invocation goes unaccounted in its workflow.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Guard scan over the restored rows; route activity assertion | `check-mcp-mutation-class.sh`, `route-validate.sh --self-test` |
| Integration | The three parent-skill suites; the pre-commit hook test | `node --test`, `pre-commit.test.sh` |
| Manual | Codex hook parity; fable wrapper; the skill-budget audit run | The commands named in the acceptance criteria |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pre-commit hook | Internal | Green | The guard change cannot be proven end to end |
| Route validator | Internal | Green | Presentation edits cannot be verified |
| Closed packets 048/003 and 048/013 | Internal | Green | Their corrections cannot be validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a restored guard row fails on a current script, or a closed packet's validation breaks.
- **Procedure**: revert the changed file, rerun its gate, and record the failing row rather than loosening the manifest.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (re-check + recover rows) ──► Core (guard + fixtures + validator + texts) ──► Verify (gates + packets)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 2 hours |
| Core Implementation | Med | 6-9 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **10-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] The three failing suites' output is captured
- [x] The old manifest rows are recovered from git history
- [x] The current presentation text is captured before rewording

### Rollback Procedure
1. Revert the changed scripts and texts
2. Rerun the guard, the three suites, and `route-validate.sh`
3. Rerun strict validation on both edited closed packets
4. Report the failing gate with its output

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable — all changes are tracked files
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│    Core     │────►│   Verify    │
│ re-check +  │     │ guard +     │     │ gates +     │
│ row recover │     │ fixtures +  │     │ packets     │
│             │     │ validator + │     │             │
│             │     │ texts       │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                     ┌─────▼─────┐
                     │ Presentation│
                     │  naming    │
                     │   ADR      │
                     └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Row recovery | None | Old manifest rows | Guard manifest |
| Guard manifest | Row recovery | Restored coverage | Verification |
| Fixture fix | None | Passing suites | Verification |
| Activity assertion | None | Extended validator | Verification |
| Text corrections | None | Aligned surface | Verification |
| Closed-packet edits | None | Corrected statements | Packet validation |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Row recovery and re-check** - 2 hours - CRITICAL
2. **Guard manifest and guard update** - 2-3 hours - CRITICAL
3. **Fixture resolution fix** - 2-3 hours - CRITICAL
4. **Gates and packet validation** - 2-3 hours - CRITICAL

**Total Critical Path**: 8-11 hours

**Parallel Opportunities**:
- The activity assertion and the text corrections are independent of the guard work
- The Codex hook parity recording is a single command
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Findings re-checked | Each finding marked holds/resolved in `scratch/`; old rows recovered | Setup complete |
| M2 | Gates restored | Guard lists four skills; three suites pass; validator self-test covers activities | Core complete |
| M3 | Verified and recorded | All named gates exit 0; both closed packets validate; parity recorded | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The generic /doctor forms adopt the registered nested command name

**Status**: Accepted (the presentation, `_routes.yaml` header and rebuild presentation now say `/doctor:speckit`)

**Context**: The presentation uses `/doctor <target>`, `/doctor list` and `/doctor [suggested-target]` (`doctor-speckit-presentation.txt:3,31,41,79,86`), but no root `.skilled/commands/doctor.md` or `.opencode/commands/doctor.md` exists. The router file is `.skilled/commands/doctor/speckit.md`, and the command contract lists it among the doctor family's routers; sibling files such as `speckit/save.md` register as `/speckit:save`.

**Decision**: Reword the presentation and its supporting docs to the invocation the loader registers for that file, and keep the nested router as the single entry point. Do not add a root command file.

**Consequences**:
- The documented form resolves to a file that exists.
- The presentation, the route header comment and the README row must change together, and `route-validate.sh` proves parity.
- A future operator who wants `/doctor <target>` must add a root router deliberately, with the catalog count updated.

**Alternatives Rejected**:
- Adding a root `doctor.md`: duplicates the router, and changes the command count the catalog gates assert.
- Leaving the text: documents an invocation no file registers.

---

### ADR-002: The mutation-class guard owns its manifest

**Status**: Accepted, with one change: the file is `assets/mcp-mutation-class-manifest.yaml`, because the planned `doctor-mcp-mutation-manifest.yaml` name falls inside the `assets/doctor-mcp-*.yaml` set another packet owns

**Context**: The guard reads `servers:` and `cli_skill_diagnostics:` from `doctor-mcp-install.yaml`. Narrowing that workflow to Code Mode removed the Figma, Chrome DevTools and ClickUp rows, so the guard silently stopped checking them even though their scripts still exist.

**Decision**: Create `.skilled/commands/doctor/assets/doctor-mcp-mutation-manifest.yaml` as the guard's own source of truth, carrying Code Mode plus the three CLI skills with their install and doctor classes, and point the guard at it.

**Consequences**:
- Coverage no longer depends on what a workflow happens to declare.
- The manifest is a second list to maintain; the guard fails closed when a listed script is missing.
- The workflow keeps its own `servers:` block for installation; the two lists serve different consumers.

**Alternatives Rejected**:
- Restoring rows inside `doctor-mcp-install.yaml`: couples the guard to a Code Mode-only workflow again.
- Discovering classes from the scripts themselves: there is no in-script declaration to read.
- Dropping the guard: loses the check that caught two real shipped bugs.

---

### ADR-003: The fixture supplies the shared package through an explicit resolution path

**Status**: Accepted (each suite's helper symlinks the real package; the build also found a second fixture gap, a missing four-part SKILL.md version for check 13a, and fixed it in the same helpers)

**Context**: The three suites copy `root-router-contract.cjs` and its siblings into a temp hub, then load them through the checker. The copied contract library requires `@spec-kit/shared/frontmatter/parse-frontmatter.js`; from a temp directory that resolution fails, which is the observed `FAIL: 12-lib` message. The real tree resolves it through `.skilled/skills/sk-doc/node_modules/@spec-kit`.

**Decision**: Make the fixture create the same resolution the real tree has, by placing a `node_modules/@spec-kit` entry beside the copied `sk-doc` tree (a copy or symlink of the built shared package), rather than relying on ambient `NODE_PATH` or weakening the assertion.

**Consequences**:
- The suites test the same module graph the checker uses in production.
- The fixture helper carries the resolution setup, so all three suites share it.
- If the shared package build is missing, the fixture fails loudly with the module error instead of a false FAIL.

**Alternatives Rejected**:
- `NODE_PATH` in the spawn environment: ambient global state the production path does not use.
- Weakening the assertion to tolerate a missing library: hides the real failure.
- Changing the contract library's `require`: production behavior changes for a test concern.

---

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md (sections 1-3)
**Duration**: ~60s
**Agent**: Primary

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Plan Agent | plan.md | Technical approach |
| Checklist Agent | tasks.md | Verification items |
| Requirements Agent | spec.md (4-6) | Requirements detail |

**Duration**: ~90s (parallel)

### Tier 3: Integration
**Agent**: Primary
**Task**: Merge outputs, resolve conflicts
**Duration**: ~60s

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target files match the workstream file ownership below
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order; parallel work stays inside one workstream |
| TASK-SCOPE | Touch only the files the task names; report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->
