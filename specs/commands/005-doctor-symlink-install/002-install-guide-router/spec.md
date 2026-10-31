---
title: "Feature Specification: Phase 2: install-guide-router"
description: "A read-only /doctor:install guide that inspects a target repository and prints the ordered commands that put Skilled into it, so a new user never assembles the setup by hand."
trigger_phrases:
  - "install guide router"
  - "phase 2 install guide router"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "commands/005-doctor-symlink-install/002-install-guide-router"
    last_updated_at: "2026-10-31T15:26:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed every criterion: AC-004 superseded by ADR-001, AC-007 added and Met"
    next_safe_action: "Run the generated-metadata refresh, then re-run strict validation"
    blockers:
      - "Strict validation reports two generated-metadata errors; repair-derived.cjs --apply clears them and this closeout does not own that rewrite"
    key_files:
      - ".skilled/commands/doctor/install.md"
      - ".skilled/commands/doctor/assets/doctor-install.yaml"
      - ".skilled/commands/doctor/assets/doctor-install-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-symlink-install-closeout"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Whether the live check must name a broken link outside the manifest"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: install-guide-router

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-31 |
| **Branch** | `worktrees/304-doctor-symlink-install` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-symlink-engine-and-command |
| **Successor** | 003-integration-and-docs |
| **Handoff Criteria** | The router, workflow and presentation exist, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 once the route is registered |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Doctor symlink and install commands: link Skilled into user project repos and guide the first install.

**Scope Boundary**: This phase owns three files under `.skilled/commands/doctor/`: `install.md`, `assets/doctor-install.yaml` and `assets/doctor-install-presentation.txt`. It does not register the route, add the `/doctor:setup` row, activate the advisor bridge, update the command index or touch the README. Phase 003 owns every one of those.

**Dependencies**:
- Phase 001's `symlink-engine.cjs` `check` subcommand, which the guide's inspect step runs
- The route the install contract fixes, added to `_routes.yaml` by phase 003 step 1

**Deliverables**:
- `install.md`, the read-only guide router on the `helper.md` shape
- `assets/doctor-install.yaml`, the five-step workflow
- `assets/doctor-install-presentation.txt`, the prompt, the checklist layout and the caveat line
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A user who wants Skilled in their own project repository has to read the README, work out which runtime folders to link, and run each setup command in the right order from the right directory. `/doctor:symlink` links what the user already knows to ask for, and `/doctor:setup` checks a checkout that is already wired. Nothing inspects an unfamiliar target repository and says what to run next, and the route manifest holds no `/doctor:install`, so `/doctor:helper` cannot name a guide that does not exist.

### Purpose
One read-only command that inspects a target repository and prints the ordered commands that finish the setup, so the operator runs them and the guide never writes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n "doctor:install" .skilled/commands/doctor/_routes.yaml; echo "exit=$?"
exit=1
```

On 2026-10-31 the probe printed no match and `exit=1`. No `/doctor:install` route exists in the manifest, so no router can bind it and no family gate reads this phase's files until phase 003 registers the route.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `install.md`, a read-only router on the `helper.md` shape with one `guide` target and the contract's flags
- Write `assets/doctor-install.yaml` with the five steps in the contract's order
- Write `assets/doctor-install-presentation.txt` with the prompt, the status legend, the ordered checklist and the fixed caveat line

### Out of Scope
- The `_routes.yaml` install route, the `/doctor:setup` row, the advisor bridge and the command index. Phase 003 registers the family.
- The symlink engine and the `/doctor:symlink` router. Phase 001 builds them.
- Running any printed command. The operator runs each one under its own plan and its own yes.
- The project-root defect for linked repositories. Packet `system-speckit/037-symlinked-runtime-root` owns it, and the guide prints a fixed caveat instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/install.md` | Create | Read-only guide router, one `guide` target |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | Create | Five-step workflow behind the `guide` target |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | Create | Prompt, status legend, checklist, caveat and result templates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `/doctor:install` is a read-only router at `.skilled/commands/doctor/install.md`, tagged `system-spec-kit`, with `allowed-tools: Read, Bash`, one `guide` target, and `execution_mode` always `INTERACTIVE` with no `:auto` or `:confirm` suffix |
| REQ-002 | `assets/doctor-install.yaml` runs the contract's five steps in order: locate the checkout and both builds, ask one consolidated question, run the engine's `check` once in place, print the ordered checklist, print the fixed caveat. Every local script the route declares is invoked by the YAML |
| REQ-003 | The guide runs no writing step. Every printed step carries its exact command, the `mutating` class of the route that owns it and one line of why, and the guide adds no argument beyond the values the operator gave |
| REQ-004 | The inspect step works in place against a real target repository: `symlink-engine.cjs check` reports one status line per entry, names a broken link, and writes nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The guide is reachable in the family once registered: the router's target table, the route and the presentation agree, and `/doctor:setup` carries a row for it |
| REQ-006 | The five install phrases and the command's runnable string reach the `/doctor:install` advisor bridge, and none of them lands on `/doctor:mcp install` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A user with a target repository runs `/doctor:install`, answers one prompt, and gets an ordered list whose first step links the chosen runtimes and whose last step confirms the result
- **SC-002**: `route-validate.sh`, `doctor-helper-contract.test.cjs` and `doctor-phrase-reach.cjs` pass with the install route in the manifest
- **SC-003**: The route stays `read-only`: `route-validate.sh` finds no declared write and no mutating advisor command in the workflow
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001's `symlink-engine.cjs check` and its `--json` report | Step 3 has no command to run | The guide prints the checklist without the "already there" framing, and this phase waits |
| Dependency | The `/doctor:install` route in `_routes.yaml`, added by phase 003 step 1 | No family gate reads this phase's files, so its criteria stay Unmet | Register the route before marking this phase complete |
| Risk | The phrases collide with `/doctor:mcp install` | High | Every phrase names a project, a repository or a first install, and `doctor-phrase-reach.cjs` fails on a collision |
| Risk | The read-only route fails `route-validate.sh` K1 because the YAML describes writes | Med | The YAML names no write activity and treats printed commands as data, so `rg -in "write to"` stays empty |
| Risk | An operator reads a printed step as already run | Med | Every line carries its class and a `Why:` line, and the summary counts how many of them write |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One engine `check` run per invocation. The guide never re-scans the target.
- **NFR-P02**: The five steps render in one pass, so the operator waits for no step to finish.

### Security
- **NFR-S01**: The guide reads no secrets file and passes no `--include` value to any command
- **NFR-S02**: A printed command quotes only the values the operator gave and substitutes no path of its own for the target

### Reliability
- **NFR-R01**: A missing build becomes step 0 and never stops the guide
- **NFR-R02**: An engine refusal prints its `ERROR:` line and stops before any checklist, so no partial plan is shown
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `--root` and no `--runtimes` gives one consolidated prompt and a stop. `list`, `?` and `menu` print the steps and load no workflow.
- Maximum input: all seven runtimes with `--link-instructions` produce one checklist, the link step carrying `--link-instructions` and the embed step dropped.
- Failure path: a target that equals, sits inside, or holds the checkout exits 2 with the engine's one-line `ERROR:`, and the guide prints that line with no checklist.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three files under one command folder, one new router, no code |
| Risk | 8/25 | Read-only, but the phrase set and the route class are family-wide |
| Research | 6/20 | The contract, the helper router and the engine's status list are already fixed |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None open on scope or on a criterion. ADR-001 settled the last one: AC-004 asked the live check to name a broken `.pi-subagents` link, and `check` reports the framework's manifest entries only. That link is not one of them and the checkout has no such path, so the row is `Superseded` and AC-007 states the same requirement in the form the command proves. Six rows are `Met`.

One gate is still red, and it is not this phase's content. Strict validation reports `RESULT: FAILED` with 2 errors, `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT`, both against the generated `description.json` and `graph-metadata.json`. `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/commands/005-doctor-symlink-install/002-install-guide-router --apply` rewrites those two files and clears both. That rewrite is outside this closeout's write scope, so the status stays `In Progress` until it runs, even though every criterion is closed.
<!-- /ANCHOR:questions -->
