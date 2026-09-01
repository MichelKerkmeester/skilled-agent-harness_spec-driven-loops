---
title: "Implementation Plan: Phase 5: command-and-playbook"
description: "Answers the command question against a test derived from the registry rather than invented, and lands on no command: the mode operates on a block another mode owns, so it matches the one sibling that also carries command: null. Then authors an 11-scenario manual testing playbook, resolving a frontmatter conflict between the package validator and the benchmark loader that makes the two P0 requirements mutually exclusive under the obvious reading."
trigger_phrases:
  - "frontmatter command decision"
  - "manual testing playbook package"
  - "playbook validator loader conflict"
  - "routing gold exclusion"
  - "fail closed allowlist enrolment"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: command-and-playbook

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario documents under `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/`; the gates are Node and Python |
| **Framework** | The sk-doc manual-testing-playbook package contract at its `FAIL_CLOSED` tier, plus the skill-benchmark scenario loader |
| **Storage** | None. A playbook package is markdown on disk with no runtime state |
| **Testing** | `validate-playbook-package.cjs` for the package, the skill-benchmark scenario loader for visibility, and `resolve_skill_markdown_links.py` for link integrity |

### Overview
Two pieces of work with one question between them. The command question is answered against a test read
off the registry: every sibling carrying a `/create:*` command produces a new artifact, and the only two
modes with `command: null` are the two that operate on something that already exists. This mode belongs
in the second group, so no command ships. The playbook is then authored as a root document plus 11
scenarios in 3 categories, and its frontmatter shape had to be measured rather than reasoned about,
because the package validator and the benchmark loader disagree about what a scenario may declare.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2 states both gaps (no operator surface, no statement of correct behaviour) and §3 puts "adding a command because the siblings have one" out of scope in advance
- [x] Success criteria measurable — SC-001 is a validator verdict and SC-002 is a loader count against the number of files on disk; both print a readable number
- [x] Dependencies identified — the mode packet from phase 002, its migrated content from phase 003, its registration from phase 004, and the two gates that read the package

### Definition of Done
- [x] All acceptance criteria met — AC-001 through AC-005 in acceptance-criteria.md are all `Met`
- [x] Tests passing (if applicable) — the package reports `PASS ... scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0`, the loader reports `shape=sk-doc scenarios=11 warnings=[]`, and link integrity on the package reports `failures=0`
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not a software architecture. The two structures that govern this phase are the sk-doc command convention,
which decides whether a mode gets a slash command, and the playbook package contract, which decides what a
scenario file must carry. Both are read off what already ships rather than invented here.

### Key Components
- **The command test** — derived from `mode-registry.json` rather than asserted: every sibling that carries a `/create:*` command produces a new artifact (a skill, a hub, a readme, an agent, a command, a feature catalog, a playbook, a benchmark, a changelog, a diff report, a diagram, a repo rule, a voice-rewritten document). Exactly two modes carry `command: null`, and both operate on something that already exists.
- **The playbook package** — `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/`: a root document plus 11 scenarios in 3 kebab-case category directories, `field-and-class-resolution/` (FMC-001 to FMC-003), `description-budget/` (FMB-001 to FMB-003) and `version-derivation/` (FMV-001 to FMV-005).
- **The scenario frontmatter shape** — the one design decision inside the package. Two consumers read the same block under different rules, and the shape that satisfies both is not the shape either one's documentation suggests.
- **The fail-closed allowlist** — `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt`. Enrolment is what makes the package's clean state enforced rather than incidental.

### Data Flow
A scenario file's frontmatter is read twice by two different consumers. The package validator calls
`hasRoutingGoldSignature()` at `validate-playbook-package.cjs:120` and, when the signature is present,
filters the file out of the operator-scenario set at line 534. The benchmark loader reads the same block
for `id`, `expected_intent`, `expected_resources` and `expected_leaf_resources`, and reads
`expected_workflow_mode` only when leaf gold is present. The two readings intersect on one scalar, and that
intersection is where the phase's central finding sits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The playbook package is read by two gates with different rules, so the surfaces are enumerated rather than
assumed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/mode-registry.json` | The mode's identity, including its command slot | Unchanged: `command: null` stands from phase 004, and this phase confirms it is right rather than provisional | The registry test: every `/create:*` command belongs to a mode that produces an artifact; the two `command: null` modes are `sk-create-quality-control` and this one |
| `.opencode/commands/create/**` | The hub's command surface | Not a consumer: no command ships, so no command file and no workflow YAML is added | REQ-003 is a conditional whose antecedent is false; nothing was added and nothing needed to be |
| `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/**` | New: the package | Created: a root document plus 11 scenarios in 3 categories | `PASS package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=11 routing_gold_excluded=0 violations=0 warnings=0` |
| `validate-playbook-package.cjs` | The package validator | Not modified: its behaviour was measured, and the package was shaped to satisfy it | Both frontmatter shapes were run through it; the six-key shape returns `SKIP ... operator=0 routing_gold_excluded=11` at exit 0, the shipped shape returns `PASS` |
| The skill-benchmark scenario loader | The consumer that decides whether the benchmark sees the mode at all | Not modified: the shipped shape keeps every scenario visible to it | `shape=sk-doc scenarios=11 warnings=[]`, with a parsed prompt, `expectedIntent`, `expectedResources` and typed leaf gold on every scenario |
| `playbook-failclosed-allowlist.txt` | The roster of packages whose clean state is enforced | Updated: one line for this package | The fleet run after enrolment reports 39 PASS packages and zero FAIL |
| `codex-executor.cjs:145` | Reads `scenario.expected` to decide whether a missing route declaration is a failure | Not a consumer to change, but a consumer that loses a check under the shipped shape | With the scalar absent, `scenario.expected` is undefined, so `requireRouteDeclaration` stays false; recorded in the package's own "Package shape" section |
| Link integrity across the package | The standing check that every link in the package resolves | Verified | `resolve_skill_markdown_links.py` on the package reports `failures=0` |

Required inventories:
- Same-class producers: every existing playbook package under `.opencode/skills/` is a same-class producer of scenario frontmatter. The two that mattered were read directly: the sk-doc hub package for the shape the loader accepts, and the sibling `sk-create-repo-rule` package for the shape it rejects.
- Consumers of the changed surface: the package validator, the benchmark scenario loader, the fail-closed fleet sweep, the link-integrity scanner, and `codex-executor.cjs` through `scenario.expected`.
- Matrix axes: two frontmatter shapes (six keys including `expected_workflow_mode`, and the same block minus that scalar) crossed with two consumers (validator, loader). Four cells, all four run. Only one cell combination passes both.
- Algorithm invariant: a package may not be reported clean by a gate that never examined it. The `SKIP` at exit 0 is what makes that invariant worth stating, because a sweep grepping for `FAIL` reads a fully-excluded package as passing.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Derive the command test and design the categories

Read the command slot of all fifteen modes out of the registry rather than arguing from the sibling count,
state the property that separates the two groups, and settle the three scenario categories against what the
mode's own documentation actually claims.

### Phase 2: Author the package and settle its frontmatter shape

Write the root document and all 11 scenarios, then measure both candidate frontmatter shapes against both
consumers instead of picking the one the documentation suggests, and record the resolution inside the
package so it is not undone by a later reader.

### Phase 3: Validate, load, enrol and sweep

Run the package validator, the benchmark loader and the link-integrity scanner, enrol the package in the
fail-closed allowlist so its clean state is enforced, and rerun the fleet sweep to confirm the enrolment
did not turn anything else red.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package conformance | Does the package satisfy its own contract at the fail-closed tier | `validate-playbook-package.cjs` on `sk-doc/sk-create-frontmatter` |
| Loader visibility | Does the benchmark see the scenarios, or fall through to an empty read | The skill-benchmark scenario loader, reading `shape`, `scenarios` and `warnings` |
| Shape comparison | Which frontmatter shape satisfies both consumers | Both candidate shapes run through both consumers, four cells in total |
| Link integrity | Does every link in the package resolve | `resolve_skill_markdown_links.py` scoped to the package |
| Fleet regression | Did enrolment break any other package | The fail-closed fleet sweep across all enrolled packages |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002's mode packet | Internal, upstream | Green — the directory exists to hold a `manual-testing-playbook/` child | Nowhere to put the package |
| Phase 003's migrated content | Internal, upstream | Green — the scenarios cite real leaf paths under the mode | `expected_resources` would name files that do not exist |
| Phase 004's registration | Internal, upstream | Green — `command: null` was set there, and this phase confirms it | The command question would be open rather than answered |
| `validate-playbook-package.cjs` | Internal | Green — ran clean, and its exclusion behaviour was measured directly | No package verdict |
| The skill-benchmark scenario loader | Internal | Green — reports 11 scenarios with no warnings | No visibility signal, and REQ-002 unanswerable |
| `playbook-failclosed-allowlist.txt` | Internal | Green — one line added, fleet run 39 PASS and zero FAIL | The package's clean state would be incidental rather than enforced |
| `frontmatter-version.mjs`, `check-frontmatter-versions.sh`, `quick_validate.py`, `package_skill.py`, `check-skill-doc-frontmatter.mjs` | Internal, referenced by scenarios | Yellow — all usable, but five defects were found in them while pricing the scenarios; each is recorded and none was repaired | Scenarios were repriced onto commands that hold, so nothing is blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The package validator goes red, the loader stops seeing the scenarios, or enrolment turns another package red in the fleet sweep.
- **Procedure**: Remove the package directory (`rm -rf .opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/`) and delete its line from `playbook-failclosed-allowlist.txt`. Rerun the fleet sweep and confirm it returns to its pre-enrolment package count with zero FAIL. Nothing else needs reverting, because no command file, no registry entry and no shared script was changed.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Not applicable. No hour-level effort estimate was recorded for this phase; progress is tracked by per-task
completion in `tasks.md` (T001-T016), not against a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — Not applicable: no data store is touched. Git history is the recovery point, and the package is a new directory that can be removed whole
- [x] Feature flag configured — Not applicable: a playbook package is enrolled in the fail-closed allowlist or it is not, and that line is the only toggle
- [x] Monitoring alerts set — the fail-closed fleet sweep is the standing monitoring, and enrolment is what puts this package inside it

### Rollback Procedure
1. Remove `.opencode/skills/sk-doc/sk-create-frontmatter/manual-testing-playbook/`.
2. Delete the package's line from `playbook-failclosed-allowlist.txt`.
3. Rerun the fleet sweep and confirm the package count drops by one with zero FAIL.
4. No stakeholder notification required: the package is internal skill-testing documentation with no user-facing surface.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The package is markdown on disk with no generated or migrated state behind it.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │Implementation│    │ Verification │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Setup) | Phases 002, 003 and 004 | The registry-derived command test and the three scenario categories | Phase 2 |
| Phase 2 (Implementation) | Phase 1 | The root document, 11 scenarios, and the measured frontmatter shape with its rationale recorded in the package | Phase 3 |
| Phase 3 (Verification) | Phase 2 | The validator verdict, the loader count, the link-integrity result, the allowlist enrolment and the fleet sweep | Phase 006's final-state sweep |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Derive the command test and design the categories)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Author the package and settle its frontmatter shape)** - Duration: not tracked - CRITICAL
3. **Phase 3 (Validate, load, enrol and sweep)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable. No duration estimates were recorded for this phase.

**Parallel Opportunities**:
- None taken. The command question had to be settled before deciding whether a command surface was in scope at all, the scenarios had to exist before either consumer could read them, and enrolment is only safe from a package that already passes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Command question answered | The test is read off the registry, and the mode is confirmed to belong with the one sibling that also carries `command: null` | Complete |
| M2 | Package authored | Root document plus 11 scenarios in 3 categories, with the frontmatter shape measured against both consumers | Complete |
| M3 | Both gates green | `PASS ... operator=11 routing_gold_excluded=0 violations=0 warnings=0` and `shape=sk-doc scenarios=11 warnings=[]` | Complete |
| M4 | Enrolled and swept | The package is in the fail-closed allowlist, and the fleet run reports 39 PASS with zero FAIL | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: No command ships; the mode keeps `command: null`

**Status**: Accepted

**Context**: spec.md §4 asks whether the mode warrants a command "on the same test its siblings were held
to", and §3 puts the lazy answer out of scope in advance: a command is not warranted merely because the
siblings have one. The test itself had to come from somewhere other than intuition.

**Decision**: Read the property off the registry. Every sibling carrying a `/create:*` command produces a
new artifact: a skill, a hub, a readme, an agent, a command, a feature catalog, a playbook, a benchmark, a
changelog, a diff report, a diagram, a repo rule, a voice-rewritten document. Exactly two modes carry
`command: null`, and both are the ones that operate on something that already exists:
`sk-create-quality-control`, which validates, scores and optimizes an existing document, and this mode,
which answers a question about a contract and fixes a block inside a document another mode owns. So no
command ships.

**Consequences**:
- `/create:frontmatter` would imply creating a frontmatter file, which is not an artifact anyone asks for. Not shipping it avoids a command whose name misdescribes what it does.
- REQ-003, "If a command ships, it carries the workflow assets its siblings carry", is satisfied vacuously. Its antecedent is false, so the requirement holds without any asset being authored. It is recorded that way in acceptance-criteria.md rather than as an omission.
- The mode stays reachable through the hub router on the 17 qualified keywords phase 004 wired, which is how the other `command: null` mode is reached too.

**Alternatives Rejected**:
- Ship `/create:frontmatter` with the full sibling asset set: rejected because the name asserts creation of an artifact that does not exist, and because the test that separates the two registry groups puts this mode squarely in the second one.
- Ship a command with a different verb, such as `/create:frontmatter-check`: rejected because it leaves the same mismatch in place under a longer name, and because the `create` namespace is for modes that create.

---

### ADR-002: Omit `expected_workflow_mode` from every scenario, and record why inside the package

**Status**: Accepted

**Context**: REQ-001 wants the package validator to pass. REQ-002 wants the benchmark loader to report the
authored scenario count. Under the obvious reading, where a scenario declares every routing key it can, the
two are mutually exclusive. `hasRoutingGoldSignature()` at `validate-playbook-package.cjs:120` returns true
when a scenario carries a non-empty `expected_workflow_mode` **and** a block-form `expected_leaf_resources`
with at least one valid pair. Line 534 then filters every such file out of the operator-scenario set, and
when that set is empty the package status is hard-coded to `SKIP` at line 581 and can never be `PASS`.

This was measured, not reasoned about. With all six keys present the package reported
`SKIP package=sk-doc/sk-create-frontmatter tier=FAIL_CLOSED scenarios=11 categories=3 operator=0
routing_gold_excluded=11 violations=0 warnings=0` and exit 0. The exit code is the dangerous part: a fleet
sweep that greps for `FAIL` reads a fully-excluded package as clean.

**Decision**: Omit only the `expected_workflow_mode` scalar. The loader parses `expected_leaf_resources`
independently and reads that scalar only when leaf gold is present, so every scenario keeps its full typed
leaf gold and its `expected_resources`, and all eleven stay inside the operator contract. The workflow mode
is still carried inside every typed pair and every resource prefix. The reasoning is written into a
"Package shape" section of the playbook root so nobody re-adds the key.

**Consequences**:
- Both P0 requirements are satisfiable at once: `operator=11`, `routing_gold_excluded=0`, `PASS`, and `shape=sk-doc scenarios=11 warnings=[]`.
- One check is lost, and it was verified rather than assumed: with the scalar absent, `scenario.expected` comes back undefined, which leaves `requireRouteDeclaration` false at `codex-executor.cjs:145`, so a missing route declaration is not recorded as a failure.
- The package documents its own shape, which is the only durable defence against a later reader adding the key back because the documentation suggests it.

**Alternatives Rejected**:
- Keep all six keys and accept `SKIP`: rejected because a package no gate examines is not a tested package, and the exit-0 `SKIP` would report as clean in any fleet sweep that greps for `FAIL`.
- Drop `expected_leaf_resources` instead: rejected because the typed leaf gold is the more valuable half. It is what the loader uses to check that a scenario resolves to real leaves, and dropping it would trade a real check for a scalar.
- Change the validator so the two consumers agree: rejected as out of scope. It is a shared script read by every enrolled package, and changing it here would put a fleet-wide behaviour change inside a mode-authoring phase. The conflict is recorded instead, in implementation-summary.md.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
