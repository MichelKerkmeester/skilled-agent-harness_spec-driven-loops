---
title: "Feature Specification: Repo rule concision and loading"
description: "Loading a communication rule does not measurably change most of the behaviour it forbids, and the full rule set costs about 27k tokens. Research how to write the rules shorter without losing what enforces them, and how AGENTS.md, Gate 5 or a hook should load them."
trigger_phrases:
  - "repo rule concision"
  - "shorter repo rules"
  - "rules ignored after loading"
  - "gate 5 loading design"
  - "once per compaction rule hook"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repo rule concision and loading

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-advisor-surfacing/spec.md` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 13 repo rules total about 27k tokens and sessions read only a few of them. Where they are read, most measurable prohibitions do not move: long replies carry a table about 20% of the time after `communication.md` is read, against 12% to 17% before it. Only the semicolon ban roughly halves after a read, and it still fails in one reply in six (`prep/evidence-pack.md` §3).

### Purpose
A research verdict on how to write the rules shorter while keeping what makes them bind, why loaded rules are ignored, and how `AGENTS.md`, Gate 5 or a hook should load them without loading the same rule twice between compactions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A concision playbook: which parts of a rule change behaviour, and per-rule compression targets with token estimates.
- An explanation of why loaded rules are ignored, tested against the measured compliance baseline.
- A loading design for `AGENTS.md`, Gate 5 and an optional hook that delivers each rule at most once per compaction window.
- A verdict on whether loading every rule is affordable before and after compression.
- Four lineages (two `cli-devin`, two `cli-codex`), 12 forced iterations in total, steered between iterations, writing only under `research/`.

### Out of Scope
- Rewriting any rule, `AGENTS.md` or `REPO RULES.md` - a later build packet applies the verdict.
- Sharing raw session transcripts with any executor - lineages receive aggregates only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `prep/` | Create | Evidence pack and the compliance measurement script |
| `research/` | Create | Lineage state, iterations, steering files and synthesis |
| `spec.md` | Modify | Generated findings block after synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each lineage completes its assigned iterations: SWE 2 three, DeepSeek four, Luna advocate two, and a second Luna lineage three in place of GLM, whose route was broken | Iteration files on disk per lineage |
| REQ-002 | Every load-bearing claim cites a resolvable `file:line` or a measurement from `prep/` | Orchestrator citation check in the synthesis |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Any compression proposal names what enforcement it keeps and what it drops | Stated per rule in `research/research.md` |
| REQ-004 | Any proposed hook delivers a rule at most once per compaction window | Mechanism and reset event named in the synthesis |
| REQ-005 | Disagreements between lineages are reported, not averaged | Named in the synthesis with each side's evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` gives one recommended loading design and a concision playbook a build packet can apply rule by rule.
- **SC-002**: The full-load question is answered with token numbers, before and after compression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin OAuth, Codex auth for the Luna lineages | A lineage fails mid-run | A failed lineage is reported as a finding |
| Risk | Compression drops the clause that made a rule bind | High | Proposals must name the enforcement they keep, tested against `prep/evidence-pack.md` |
| Risk | Compliance numbers are confounded by session type | Med | Stated as caveats in the evidence pack; lineages must not overstate them |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which parts of a rule change behaviour, and how short can each rule become without losing them?
- Why does reading a rule leave most of its measurable prohibitions unchanged?
- What should `AGENTS.md`, Gate 5 or a hook load, and when, so no rule is loaded twice between compactions?
- Is loading every rule affordable, before and after compression?

### Research Context
Deep research is active for this topic. `research/research.md` is the canonical source of findings; this section receives only a generated summary block.
<!-- BEGIN GENERATED: deep-research/spec-findings -->
- **Verdict:** loading more rule text is not the fix. Reading a rule halves the semicolon rate and leaves the table rate unchanged, so the bottleneck is binding, not volume. Everything at once is about 37k tokens per window with no measured benefit.
- **Concision:** 54% of the corpus is rule statement. A 20% to 28% cut keeps every norm, proven by two drafts with keep/drop ledgers.
- **Cards:** a plain card drops the operative bans in 6 of 13 files. Card plus self-check keeps each norm in checklist form at 18,699 B (17%, about 4.7k tokens) and is the only compressed load worth piloting.
- **Delivery gap:** Devin cuts `AGENTS.md` at 16,384 B, dropping §5 to §10 and the §8 reply-rule load line. Moving those clauses up needs no pilot.
- **Hook:** none now. If a measured miss rate justifies one, it uses the directive-lifecycle window model reset on compaction, plus a per-rule delivered set and transcript-less suppression the machinery lacks.
- **Next step:** instrument rule delivery and eligible actions, then run a same-rule wording test on the table ban and a card-plus-self-check pilot at Gate 5.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
