---
title: "Implementation Plan: Phase 10: skill-advisor"
description: "Audit `/doctor:speckit skill-advisor` against this checkout, then repair the workflow, its route entry and the presentation in place. The audit checked every path, command, flag and assertion the workflow names; the repairs move the workflow to the CLI front door, make the declared command lines runnable, correct the boost ranges and the phase 0 assertions, and label the target's setup prompt."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: skill-advisor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router, YAML workflow and route manifest, plain-text presentation asset |
| **Framework** | The doctor family's thin-router pattern: a router, a workflow asset, a presentation asset |
| **Storage** | None. The audit reads the skill graph; the only writes are the packet's scratch evidence and the audited doctor files |
| **Testing** | The family's `route-validate.sh`, the packet validator, YAML parses, and one recorded read-only run in `scratch/doctor-run.log` |

### Overview
The phase audits first and applies second. One read-only pass records every path, script, command, flag and assertion the route and workflow name, each checked against this checkout in `scratch/reality-check.md`. The verdict was fix, so the workflow now addresses the advisor through `node .skilled/bin/skill-advisor.cjs`, the route declares runnable command lines and the missing `mcp_tools` key, and the assertions that no longer held are corrected in place.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Audit-then-apply over an existing doctor target. The workflow asset, the route entry, the router text and the presentation are the moving parts; this phase repairs their content, not the pattern.

### Key Components
- **Workflow asset** (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`): the five-phase workflow. The repairs point its four call sites at the CLI front door, give phase 0 a real inventory source, source the skill names from the skill folders and graph metadata, fix the rollback build command and split the boost range per map.
- **Route entry** (`.skilled/commands/doctor/_routes.yaml`): the `skill-advisor` route. Its `cli_commands` now carry the arguments each tool requires, gate 3 names the two author-lane files, and the route declares `mcp_tools: []`.
- **Router and presentation** (`.skilled/commands/doctor/speckit.md`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`): the router owns the target table and field resolution; the presentation gained a labelled skill-advisor scope prompt.
- **Audit evidence** (`scratch/reality-check.md`, `scratch/doctor-run.log`, `scratch/proposal.md`): one row per named item with the command that showed it, the read-only run, and the repair proposal with the recorded findings.

### Data Flow
The read-only run follows the workflow's own steps and stops at every write, so its output records what exists and what drifted. The repairs were applied from that record, then the family validator and the packet validator were rerun over the result.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Workflow asset (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`) | Owns the doctor's five phases and every named path and command | Updated | The YAML parses (`yaml.safe_load` YAML_OK) and no `system_skill_advisor.` reference remains in the edited doctor files |
| Route entry (`.skilled/commands/doctor/_routes.yaml`) | Owns the target's declared commands, write scope and route fields | Updated | `route-validate.sh` exits 0 and every declared command line carries its required arguments |
| Presentation (`.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`) | Owns every visible string, including setup prompts | Updated | `route-validate.sh` J1 parity passes across the manifest, the router table and the presentation displays |
| Skill advisor subsystem (scoring lanes, CLI, graph database) | The subject the doctor inspects | Read only; defects recorded as findings | `scratch/reality-check.md` rows at `:109-122` and the findings list in `implementation-summary.md` |
| Skill inventory (`.skilled/skills/*/graph-metadata.json`) | Supplies skill names and derived trigger phrases | Read only | The inventory holds 14 metadata files and 14 skill folders; the workflow's reads now name the phase-0 skill listing |

Required inventories:
- Same-class producers: all four removed-namespace call sites and the four `.skills` reads were changed together, and `rg` for `system_skill_advisor.` over the edited doctor files returns no matches.
- Consumers of changed symbols: the route, workflow, router text and presentation were re-read after the edits, and `route-validate.sh` J1 parity passed.
- Matrix axes: addressing surface (workflow asset, route entry, presentation) by drift class (transport, command line, assumption). Every reality-check row and every proposal repair covers a cell.
- Algorithm invariant: the workflow may write only `explicit.ts`, `lexical.ts` and per-skill `graph-metadata.json`, only after approval, and may never start a daemon (`--warm-only` guarantees it). Adversarial cases checked: the `tcp://127.0.0.1:9` probe exits 75 without spawning a daemon, and a query without `--queryType` exits 64.
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
| Unit | The route's declared command lines and the workflow's assertions against the live CLI | The recorded run in `scratch/doctor-run.log`; `yaml.safe_load` over every edited YAML |
| Integration | Route, workflow, router and presentation parity | `route-validate.sh`, `command-catalog-mirror-check.cjs` |
| Manual | One read-only pass over the workflow's steps, stopping at every write | `scratch/doctor-run.log` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provisioned worktree | Internal | Green | The scripts the doctor calls cannot run |
| Route manifest and its validator | Internal | Green | The verdict cannot be applied or checked |
| `.skilled/bin/skill-advisor.cjs` and the live advisor daemon | Internal | Green | The CLI front door the repairs target cannot be confirmed |
| `.skilled/skills/*/graph-metadata.json` | Internal | Green | The phase-0 inventory has no source |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A repaired command line or assertion proves wrong on a later run, or the route validator fails after later edits.
- **Procedure**: `git restore --source=HEAD --` the three audited files (`.skilled/commands/doctor/assets/doctor-skill-advisor.yaml`, `.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt`), then rerun `bash .skilled/commands/doctor/scripts/route-validate.sh`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verify |
| Implementation | Setup | Verify |
| Verify | Setup, Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour: read the route, the workflow and the presentation's target sections |
| Core Implementation | Med | One session: the workflow, route and presentation repairs |
| Verification | Med | One session: the read-only run, the family checks and the packet validation |
| **Total** | | **About two sessions across one day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No migration and no data copy; the only writes are the audited doctor files and the packet docs
- [x] Every workflow write stays behind its approval gates, and the route keeps its `mutates` class
- [x] The family and packet validators run before closure

### Rollback Procedure
1. `git restore --source=HEAD --` the three audited files.
2. Rerun `bash .skilled/commands/doctor/scripts/route-validate.sh` and the packet validator.
3. Re-check that the route's command lines still carry their required arguments.
4. Nothing to notify; the command is operator-invoked.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The phase writes no runtime state; the recorded run is read-only.
<!-- /ANCHOR:enhanced-rollback -->

---

