---
title: "Implementation Plan: Phase 1: inventory-and-contract"
description: "Enumerates every syntactic reference to the frontmatter template spec and the versioning rules across .opencode/, classifies each as live, internal, frozen or bare-name, confirms no consumer parses either file at run time, and records the ownership boundary the mode inherits. Read-only: no consumer file is edited."
trigger_phrases:
  - "frontmatter consumer inventory"
  - "frontmatter reference probe"
  - "run-time parser sweep"
  - "frontmatter ownership boundary"
  - "frontmatter reference forms"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: inventory-and-contract

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit documentation; the investigation itself was carried out with `grep` and `python3` |
| **Framework** | None — this phase is read-only investigation; no runtime component is built |
| **Storage** | None |
| **Testing** | The reproducible probe command is the check, plus `resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc` for the pre-move link-integrity baseline |

### Overview
This phase enumerates every reference to `.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md`
(939 lines) and `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` (148 lines) across
`.opencode/`, classifies each by written form and by consumer type, and decides which parts of the two
documents the new `sk-create-frontmatter` mode owns outright versus what the shared tier keeps. No
consumer file is touched; the only artifact produced is `inventory/consumer-inventory.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2/§3 states the problem (references written in at least four forms, one script reads the file) and freezes scope to read-only enumeration
- [x] Success criteria measurable — SC-001/002/003 in spec.md are each a countable, checkable claim
- [x] Dependencies identified — read access to the two frontmatter documents and the `.opencode/` tree; no external service or credential was required

### Definition of Done
- [x] All acceptance criteria met — AC-001 through AC-006 in acceptance-criteria.md are all `Met`
- [x] Tests passing (if applicable) — Not applicable: no automated test suite exists for an inventory document; the reproducible probe and its in-session rerun are the check (`inventory/consumer-inventory.md` §1-§3)
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not applicable — this is a read-only research/inventory phase, not a software architecture change. No
MVC/MVVM/Clean Architecture/serverless pattern governs it.

### Key Components
- **The probe** (`inventory/consumer-inventory.md` §1) — `grep -ranI --exclude-dir=.git --exclude-dir=node_modules -E 'frontmatter-(templates|versioning)' .opencode/ | grep -v '/benchmark/reports/'`. The `-a` flag is load-bearing: without it, grep silently skips any file carrying a NUL byte and prints no warning.
- **The five-form classifier** (§3) — a short Python script that sorts every matched line into markdown-link, skill-relative-in-string, repo-absolute, bare-relative or bare-name, so phase 003's rewrite does not assume one written form and miss the other four.
- **The four-bucket partition** (§2, §7c) — live consumer / internal cross-link / frozen history / bare-name mention, covering all 83 matched lines exactly once each.

### Data Flow
The probe runs over `.opencode/` and returns every matching line. The classifier sorts those lines by
written form. The four-bucket partition then sorts the same lines by whether each is a live reference
to repoint, an internal cross-link inside the two moving documents, frozen history, or not a reference
at all. Sections 5a-5d of the inventory list every live and internal reference by file and line; section
7 turns the live set into the owned/shared classification phases 002 and 003 inherit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable — this phase is read-only investigation (spec.md §3 Out of Scope: "Any edit to a
consumer"). It produced one new file, `inventory/consumer-inventory.md`, and changed nothing else. No
producer/consumer inventory of code surfaces is required, because no code surface was touched.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Build the probe

Design a single reproducible grep command that catches every written form of the two filenames across
`.opencode/`, including files carrying a NUL byte, and excludes the three frozen benchmark report
bundles that would otherwise pollute the count.

### Phase 2: Run, classify and decide

Run the probe, classify all 83 matched lines by written form and by consumer type, trace the two named
run-time-parser candidates line by line to answer REQ-002, and decide the ownership boundary between the
new mode and the shared tier.

### Phase 3: Verify and hand off

Capture the pre-move `resolve_skill_markdown_links.py` baseline, reproduce the probe and classification a
second time to confirm the count is stable, and confirm every one of the 83 matched lines lands in
exactly one bucket before writing the phase-003 handoff.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Reproducibility | The probe and classifier return the same 83/40 count and five-form split on a second run within the same investigation | `grep`, `python3` (inventory §1, §2, §3) |
| Completeness | Every matched line resolves to exactly one of four classification buckets | Manual partition sum: 54+4+13+12=83 (inventory §7c) |
| Run-time parser sweep | Every script that could plausibly open either frontmatter document is traced line by line | Manual code read of `quick_validate.py` and `package_skill.py` (inventory §4) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/` tree, read access | Internal | Green — read throughout, nothing written outside `inventory/` | Blocks the entire probe and classification |
| `resolve_skill_markdown_links.py` | Internal (system-spec-kit) | Green — ran clean, reported the 113-failure pre-move baseline | Blocks the Verification baseline in inventory §8 |
| Phase 002 (mode scaffold) | Internal, downstream | Yellow — phase 002 has already begun scaffolding `sk-create-frontmatter/` in the live tree while this phase's docs were being authored | Does not block this phase; changes what a fresh probe rerun returns after this phase closed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: None expected — this phase wrote exactly one file (`inventory/consumer-inventory.md`) and edited no consumer.
- **Procedure**: `git rm specs/sk-doc/049-sk-create-frontmatter/001-inventory-and-contract/inventory/consumer-inventory.md` removes the only artifact this phase produced. No other file needs reverting.
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

Not applicable — no hour-level effort estimates were recorded for this phase. Progress is tracked by
per-task completion in `tasks.md` (T001-T014), not a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — Not applicable: no data store is touched; git history is the recovery point, and this phase added exactly one untracked file
- [x] Feature flag configured — Not applicable: no runtime feature flag governs a read-only documentation phase
- [x] Monitoring alerts set — Not applicable: no runtime/monitoring surface exists for this change

### Rollback Procedure
1. Identify the single artifact this phase produced: `inventory/consumer-inventory.md`.
2. Remove it (the file is untracked, so a plain `rm` suffices; `git rm` if it has since been staged).
3. Confirm `git status` for the phase folder is clean.
4. No stakeholder notification required — internal spec-folder documentation only, no user-facing or runtime surface.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no data store is touched; the phase only creates one version-controlled markdown file.
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
| Phase 1 (Setup) | None | The reproducible probe command | Phase 2 |
| Phase 2 (Implementation) | Phase 1 | `inventory/consumer-inventory.md` — the full 83-line inventory, the run-time parser answer, and the ownership boundary | Phase 3 |
| Phase 3 (Verification) | Phase 2 | The in-session reproduction, the `resolve_skill_markdown_links.py` baseline, and this phase's closure | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Build the probe)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Run, classify, decide)** - Duration: not tracked - CRITICAL
3. **Phase 3 (Verify and hand off)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable — no duration estimates were recorded for this phase.

**Parallel Opportunities**:
- None recorded. The three phases are strictly sequential: classification depends on the probe's output, and verification depends on the classification being final.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Probe built and run | 83 matched lines across 40 files captured (inventory §1-§2) | Complete |
| M2 | Classification and ownership decision | Every line in exactly one of four buckets; ownership boundary recorded (inventory §5-§7) | Complete |
| M3 | Verification and handoff | Link-integrity baseline captured; phase-003 handoff written (inventory §8) | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The mode owns both frontmatter documents whole; three enforcement scripts stay shared

**Status**: Accepted

**Context**: The frontmatter template spec and the versioning rules are each read by more than one
surface. Splitting either document, or moving the three scripts that enforce them, was the alternative
under consideration once phase 001's inventory made every consumer visible.

**Decision**: `frontmatter-templates.md` (939 lines) and `frontmatter-versioning.md` (148 lines) move
whole to `sk-create-frontmatter/assets/` and `sk-create-frontmatter/references/` respectively.
`frontmatter-version.mjs`, `check-frontmatter-versions.sh` and `quick_validate.py` stay in the shared
tier.

**Consequences**:
- The 4 internal cross-links between the two documents survive the move unedited, because `assets/` and `references/` stay siblings (inventory §5d).
- `post-edit-router.cjs:38` keeps resolving `check-frontmatter-versions.sh` at its current shared path; nothing breaks a runtime hook that fires on every qualifying edit from outside the hub.

**Alternatives Rejected**:
- Splitting either document by section: rejected because neither document has a second constituency — the template spec is one eleven-class contract, the versioning rules are one derivation algorithm — so a split would produce two files that each defer to the other.
- Moving the three enforcement scripts alongside the documents: rejected because `post-edit-router.cjs` hard-codes the shared path and resolves it from outside the hub on every qualifying edit; moving the scripts would break a runtime hook to gain nothing.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
