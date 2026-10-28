---
title: "Feature Specification: Phase 1: deep research on skill routing shape and clarity"
description: "Ten iterations of deep research across every skill and hub under .skilled/skills to map each routing mechanism, the checks that pin it, the right routing shape per skill type, and where the docs read poorly."
trigger_phrases:
  - "skill routing deep research"
  - "router.md versus json routing"
  - "skill routing restatement inventory"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: deep research on skill routing shape and clarity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/254-skill-routing-and-clarity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 11 |
| **Predecessor** | None |
| **Successor** | 002-baseline-and-routing-correctness |
| **Handoff Criteria** | `research/research.md` exists with a verdict per skill type and a phased plan, and the orchestrator has checked its load-bearing citations against the files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the skill routing and clarity program. It decides what the later phases are.

**Scope Boundary**: research and planning only. Nothing outside `specs/` changes in this phase.

**Dependencies**:
- The sk-code advisor report, which supplies the starting hypothesis: one hub `ROUTER.md`, JSON for stage one, script resolvers for the rest, and a short routing section per mode.
- `/deep:research` in `:auto` mode with DeepSeek V4.1 Flash at max reasoning on two executors, cli-pi and cli-devin.

**Deliverables**:
- `research/research.md`, the merged synthesis of ten iterations.
- A confirmed phase plan that the parent's phase table and child folders 002 onward are built from.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator finds the sk-code mode skills hard to read, and suspects they carry too many kinds of routing. The advisor's report on sk-code found the same routing decision written down in two to six places, with drift between the copies, and routing prose filling 37 to 54 percent of the mode `SKILL.md` files. Nobody has checked whether that pattern holds for the other thirteen skills and hubs.

### Purpose
Decide, with file and line evidence, which routing shape each kind of skill should use and in what order to change them, so later phases can do the work without re-deciding it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls -d .skilled/skills/*/ | wc -l
      14
$ find .skilled/skills -name ROUTER.md -not -path "*/node_modules/*" | sort
./cli-classifier/ROUTER.md
./cli-external-orchestration/ROUTER.md
./mcp-tooling/ROUTER.md
./sk-code/ROUTER.md
./sk-design/ROUTER.md
./sk-doc/ROUTER.md
./system-deep-loop/ROUTER.md
$ find .skilled/skills -name SKILL.md -not -path "*/node_modules/*" | wc -l
      56
$ grep -rl "^## [0-9]*\.* *SMART ROUTING" --include=SKILL.md .skilled/skills | wc -l
      54
```
Seven hubs carry `hub-router.json`, `mode-registry.json` and a root `ROUTER.md`. Seven skills are standalone. 54 of 56 `SKILL.md` files carry a SMART ROUTING section.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory every routing mechanism per skill, hub and mode packet, and every place one routing decision is restated.
- List the checks, parsers, templates, generators, benchmarks and runtime mirrors that pin the current shape, and what each proposed change would break.
- Give a verdict per skill type (hub, mode packet, standalone skill) on per-mode `ROUTER.md`, one hub `ROUTER.md`, the advisor's hybrid, and JSON-only.
- Record readability findings per skill with quoted passages.
- Propose a phased implementation plan with order, risk and rollback.

### Out of Scope
- Editing any skill, command, agent, check or generator. Later phases do that.
- Advisor scoring and `graph-metadata.json` trigger tuning, beyond noting where they restate a routing decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/research/` | Create | Loop state, lineage iterations and the merged `research.md` |
| `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/*.md` | Modify | Phase docs updated with the outcome |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The loop runs through `/deep:research:auto` with `--stop-policy max-iterations`, and the lineage state logs record ten iterations in total. |
| REQ-002 | `research/research.md` answers questions (a) to (e) from the research charter, with `path:line` citations. |
| REQ-003 | The orchestrator reads the cited line behind every finding used in the phase plan, and marks each one confirmed or unconfirmed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The verdict covers each of the three skill types separately, and names the checks a JSON-only shape would break. |
| REQ-005 | Readability findings quote the passage they judge. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The lineage state logs under `research/lineages/` hold ten `type: iteration` records in total.
- **SC-002**: The parent's phase table lists the phases the confirmed plan names, and `validate.sh --recursive --strict` prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass (`llmgateway`) for Pi and Devin account OAuth | A lineage fails without a provider | Preflight both before launch and read each lineage's output, not its exit code |
| Risk | A flash model cites a line that does not say what it claims | High: a wrong citation could steer a whole phase | The orchestrator reads every cited line used in the plan before it becomes a phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each lineage finishes inside the fan-out runner's four-hour lifetime ceiling.

### Security
- **NFR-S01**: Lineages write only inside their own lineage directory. The fan-out write-containment guard reports anything else.

### Reliability
- **NFR-R01**: A lineage that fails is reported with its output, never retried silently past the runner's own retry budget.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with no SMART ROUTING section is recorded as having none, not skipped.
- Maximum input: sk-doc has 15 `SKILL.md` files; iterations may split it across lineages.
- Failure path: if one lineage fails, synthesis runs on the surviving lineage and the gap is named in `research.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Reads 14 skills and their checks; writes only research artifacts |
| Risk | 4/25 | No code or skill change in this phase |
| Research | 18/20 | Cross-skill inventory with line-level evidence |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The two questions this phase opened with are answered in `research/research.md`: standalone skills keep a short inline router because the class contract forbids hub files for them, and `sync-skills-hermes.cjs` writes the Hermes copies.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md` (10 iterations, stop reason maxIterationsReached):
- Hubs keep one hub-root `ROUTER.md`, JSON for stage one and script resolvers for the rest. Per-mode `ROUTER.md` and JSON-only are both rejected by named checks.
- Mode packets keep an 8 to 12 line SMART ROUTING section and a final machine-router appendix, or no block where the hub names the leaves. sk-doc already runs 9 of 14 packets this way.
- Standalone skills keep a short inline router plus generated leaf manifest and aliases. No `ROUTER.md`.
- Each routing decision is restated in two to five places. Correctness defects go first: system-skill-advisor's discovery roots and HOOK leaf, sk-code `ROUTER.md` drift, the mcp-obsidian stage gap.
- Phases 002 to 011: baseline and correctness, canon and tooling, single vocabulary source, one phase per hub group, standalone skills, prose clarity, regeneration and verification.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
