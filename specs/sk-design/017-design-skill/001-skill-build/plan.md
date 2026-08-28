---
title: "Implementation Plan: Rework four external UI-design skills into one standalone sk-design skill"
description: "Scaffold a class-S standalone skill, rework four external sources into one SKILL.md plus six references and a token asset, then prove conformance through the authoring gate, the document validators and a link sweep."
trigger_phrases:
  - "sk-design skill implementation plan"
  - "standalone skill scaffold plan"
  - "four source design skill"
  - "class-S skill build"
  - "sk-design plan"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rework four external UI-design skills into one standalone sk-design skill

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON authoring; CSS as a shipped asset |
| **Framework** | `sk-create-skill` class-S standalone skill contract |
| **Storage** | None. The skill is static knowledge with no runtime state |
| **Testing** | `validate_skill_package.py`, `validate_document.py`, `ci-skill-root-metadata.cjs`, a link sweep, and an advisor routing probe |

### Overview

Scaffold the skill root with `init_skill.py --kind standalone`, then replace every scaffolded file with authored content reworked from four external sources. The value systems stay inline in `SKILL.md` because they are needed on every invocation; everything that loads conditionally becomes a reference under an intent in the router. The generated metadata pair is produced by the fleet gate rather than authored, per the class-S contract.
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
- [x] Authoring gate, document validators and link sweep pass
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Progressive disclosure over a single advisor identity. Metadata is always in context, `SKILL.md` loads on activation, references load on scored intent.

### Key Components

- **`SKILL.md`**: the always-loaded surface. Value scales, the seven-step procedure, the hierarchy technique, the router, and the hard rules.
- **`references/`**: six conditionally-loaded documents, one per routed intent, each self-contained enough to act on alone.
- **`assets/`**: the token file plus its explanatory document. `tokens.css` is a copy-paste artifact, not a routable leaf.
- **Root metadata**: `graph-metadata.json` carries advisor identity and edges; `leaf-manifest.config.json` is the single class-S declaration; the manifest and alias projection are generated.

### Data Flow

A prompt is scored against the router's seven intents. The top intent, plus a second when the scores are within one point, selects reference paths from `RESOURCE_MAP`. Every path is scope-guarded to the skill root and checked against a runtime inventory before loading, so a renamed or deleted file degrades to a smaller load rather than an error. Below a confidence floor the router returns a disambiguation checklist instead of guessing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This packet is additive: it creates one new skill root and touches no existing runtime surface, producer, consumer or policy.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the checkboxes and task state. The phases below describe what each one produces and what closes it.

### Phase 1: Source capture

Pull the full text of all four sources. Two of them block direct fetch, so route around it: locate the underlying repository for one and extract the rendered page for the other. Closes when every source is available in full, including per-rule detail beyond the summary lines.

### Phase 2: Scaffold

Create the class-S root with the standalone initializer, then rename it once the four-source scope settles the identity. Closes when the root exists with the final name and the class gate can see it.

### Phase 3: Author

Write `SKILL.md` first, since the six references are written against its section and router structure. Then the references, the token asset, the root metadata, and the README, changelog and playbook. Closes when every cross-source conflict has a stated resolution at its landing point.

### Phase 4: Verify

Generate the derived metadata, then run the class gate, the authoring gate, the document validator and a link sweep, reading each output and exit status. Closes when every gate is green or its failure is recorded with evidence.

### Phase 5: Remediation

Added after the first report, on operator instruction to fix every open note and conflict. Reclaim the `sk-design` name only after proving it collides with nothing live, restore word headroom by moving inline prose into references, import the source categories that are genuinely in-domain and decline the rest with reasons, and make the cross-skill reconciliation reciprocal. Closes when both open questions are answered and every gate is green again from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Root metadata class and generated freshness | `ci-skill-root-metadata.cjs` |
| Package | Frontmatter, required sections, size caps | `validate_skill_package.py` |
| Document | Reference and README structure and frontmatter | `validate_document.py` |
| Integrity | Every relative link resolves on disk | Link sweep over the package |
| Routing | Realistic prompts reach the skill | `advisor_recommend` probes |
| Manual | Operator scenarios for routing, value discipline, conflicts, boundary | `manual-testing-playbook/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-create-skill` class-S contract | Internal | Green | The root cannot be classified or gated |
| Skill advisor daemon | Internal | Yellow | Routing cannot be smoke-tested; metadata correctness is unaffected |
| Four external sources | External | Green | Content already captured; later drift is a documentation concern, not a build one |
| `sk-design-md-generator` | Internal | Green | Only the boundary statement and sibling edge depend on it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the skill misroutes prompts away from a better-fitting skill, or its guidance conflicts with an established project system in practice.
- **Procedure**: delete `.opencode/skills/sk-design/` and rerun `ci-skill-root-metadata.cjs`. The packet is additive, so nothing else needs reverting.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Source capture) ──► Phase 2 (Scaffold) ──► Phase 3 (Author) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source capture | None | Author |
| Scaffold | None | Author |
| Author | Source capture, Scaffold | Verify |
| Verify | Author | Remediation |
| Remediation | Verify | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source capture | Medium | Two sources fetch cleanly, two need a workaround |
| Scaffold | Low | One command plus a rename |
| Core Implementation | High | Nine authored documents plus root metadata |
| Verification | Low | Four automated gates and a routing probe |
| Remediation | Medium | A name reclaim with a collision check, two content moves, two imports and a reciprocal edit to a shipped skill |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] No data changes, so no backup required
- [x] No feature flag; the skill is inert until routed to
- [x] The fleet gate is the standing monitor

### Rollback Procedure

1. Delete the skill root.
2. Rerun `ci-skill-root-metadata.cjs` to confirm the fleet is still clean.
3. Rerun the workspace test gate.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────┐     ┌──────────────┐
│ Phase 1          │────►│ Phase 3      │────►│ Phase 4      │
│ Source capture   │     │ Author       │     │ Verify       │
└──────────────────┘     └──────┬───────┘     └──────────────┘
                                ▲
                    ┌───────────┴──────┐
                    │ Phase 2 Scaffold │
                    └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source capture | None | Four captured corpora | Author |
| Scaffold | None | Root, benchmark and playbook skeletons | Author |
| `SKILL.md` | Source capture, Scaffold | The always-loaded contract | References, Verify |
| References | `SKILL.md` | Six conditional documents | Verify |
| Root metadata | References | Identity, manifest, aliases | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Source capture** - two of four sources block direct fetch and need a route around it - CRITICAL
2. **Author `SKILL.md`** - everything else is written against its section and router structure - CRITICAL
3. **Author the six references** - CRITICAL
4. **Generate root metadata and verify** - CRITICAL

**Parallel Opportunities**:

- Scaffolding runs while sources are being captured.
- The four Refactoring-UI-derived references can be written in any order relative to the three new-source ones.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | All four sources captured | Full text of each source available locally | Phase 1 |
| M2 | Root scaffolded and named | `init_skill.py` output renamed to the final identity | Phase 2 |
| M3 | Authoring complete | Nine documents plus root metadata written | Phase 3 |
| M4 | Gates green | Four automated checks pass and the link sweep is zero | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions for this packet are recorded in `decision-record.md`: one skill rather than four, standalone rather than a hub mode, the final name, scales inline rather than in a reference, conflicts stated rather than reconciled, and the handling of promotional content embedded in a source.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting any task in `tasks.md`:

- Read the target file before editing it. An edit against an unread file is a guess.
- Confirm the task is in scope. The scope table in `spec.md` is frozen; anything outside it is a new task, not an extension of this one.
- Know which gate proves the task. A task with no observable check is not ready to start.
- For a task that reworks external material, have the source open. Restating from memory drifts.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Phases run in order. Within a phase, `[P]` tasks may run in any order |
| TASK-SCOPE | Touch only the files the task names. Adjacent improvement is a separate task |
| TASK-SOURCE | Rework each source rather than copying it. No verbatim third-party text in an authored artifact |
| TASK-CONFLICT | When two sources disagree, stop and record the conflict. Never pick a winner silently |
| TASK-EVIDENCE | A gate counts as passed only after its output and exit status have been read |
| TASK-CAP | Check the `SKILL.md` word count after any edit that adds prose to it |

### Status Reporting Format

Report each task as: task id, what was written or run, the observed result including exit status, and whether the task is done, blocked, or partially complete. Name the file paths. Do not report a gate as passing without quoting what it printed.

### Blocked Task Protocol

A task is BLOCKED when its gate cannot run, a source cannot be reached, or the task would require changing something outside the frozen scope.

On a block: record it against the task in `tasks.md`, state what is blocking it and what would unblock it, and continue with tasks that do not depend on it. Do not mark a blocked task complete, and do not work around a block by widening scope. T023 is the worked example: the advisor daemon was reindexing, so the routing probe could not run, and the task stayed open with the reason recorded rather than being quietly checked off.

---
