---
title: "Feature Specification: Report and clean up template trigger phrases"
description: "About 195 live spec.md files still carry the spec template's four trigger phrases, and about 394 acceptance-criteria.md files carry that template's own defaults, including acceptance criteria. This phase flags the acceptance criteria defaults, seeds them in new packets, and adds a report tool and a cleanup tool that the operator runs."
trigger_phrases:
  - "template phrase census and cleanup"
  - "phase 11 template phrase census and cleanup"
  - "acceptance criteria template default"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Report and clean up template trigger phrases

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-07 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 010-trigger-index-ci-rebuild |
| **Successor** | 012-template-phrase-cleanup-round-two |
| **Handoff Criteria** | The report lists every carrier, the cleanup's dry run names every file it would change, and the operator has decided on `--apply` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the spec folder tooling parent. The operator chose a report plus a cleanup tool, and chose to flag and fix the `acceptance criteria` phrase.

**Scope Boundary**: the judge class, the seeder, two new tools and, only after the operator approves, the cleanup run.

**Dependencies**:
- Phase 8's single phrase source in `create.sh` and `phrase-judge.mjs`, which this phase extends.

**Deliverables**:
- The acceptance criteria template defaults in the `template-default` class, seeded phrases in new `acceptance-criteria.md` files, a read-only report tool and a dry-run-first cleanup tool.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A packet that keeps a template's default trigger phrases is indexed under words that describe the template, not the work. The phrases `acceptance criteria`, `closure gate`, `ac traceability` and `waiver adr` arrive in every Level 2 packet and match hundreds of documents for any prompt that mentions them.

### Purpose
Search finds a packet by what it is about, in new packets automatically and in old packets once the operator runs the cleanup.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The four default phrases of `templates/addons/acceptance-criteria.md.tmpl` join the `template-default` class, from one source.
- `create.sh` seeds `acceptance-criteria.md` trigger phrases from the packet slug, the way it already seeds `spec.md`.
- A read-only report tool that counts carriers of both template blocks, by track, live and archived.
- A cleanup tool: dry run by default, `--apply` writes, idempotent, touches only the template block in frontmatter, skips `z_archive/` unless asked.

### Out of Scope
- Running `--apply` before the operator has seen the dry run.
- The default phrases of other templates (plan, tasks, implementation summary). The report counts them so a later phase can decide.
- Phase parent `[Trigger phrase N]` placeholders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs` | Modify | Acceptance criteria defaults join the class |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Seed `acceptance-criteria.md` phrases |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-census.mjs` | Create | Read-only report |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Create | Dry-run-first cleanup |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/template-phrase-cleanup.vitest.ts` | Create | Tests for both tools |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | The class lists both template blocks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The judge warns with `template-default` on each of the four acceptance criteria defaults |
| REQ-002 | The cleanup tool writes nothing without `--apply`, and a second `--apply` run changes nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A new Level 2 packet's `acceptance-criteria.md` carries seeded phrases, not the defaults |
| REQ-004 | The report counts carriers of each template block by track, and separates live from archived |
| REQ-005 | The cleanup replaces only the exact template block, and leaves author-written phrases alone |
| REQ-006 | After an approved `--apply`, the trigger index is rebuilt and every touched packet passes strict validation |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dry run names every file it would change and the phrase block it would replace.
- **SC-002**: The existing seeding and judge tests still pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `--apply` edits several hundred packets at once | High | Dry run first, operator approval, one commit that a single revert undoes |
| Risk | A packet whose author kept a default phrase on purpose | Low | Only the exact four-line block is replaced, never a partial match |
| Dependency | Phase 8's single phrase source | Blocks the judge change | This phase starts after that lane lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The report runs over the whole `specs/` tree in under a minute.

### Security
- **NFR-S01**: The tools write only under `specs/` and only frontmatter `trigger_phrases` lines.

### Reliability
- **NFR-R01**: The cleanup is idempotent and reports a before and after hash per file.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A slug that seeds the same phrase as the description: one phrase, not two.
- A packet with the block plus extra author phrases: only the block is replaced.

### Error Scenarios
- A file with malformed frontmatter: reported and skipped, never rewritten.

### State Transitions
- An archived packet: counted, and changed only with `--include-archive`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two new tools, three edited files, a large optional data change |
| Risk | 16/25 | Mass edit, gated by a dry run and approval |
| Research | 4/20 | Counts and approach come from Phase 7 |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether to run `--apply`, and whether to include archived packets. The operator decides after the dry run.
<!-- /ANCHOR:questions -->

---
