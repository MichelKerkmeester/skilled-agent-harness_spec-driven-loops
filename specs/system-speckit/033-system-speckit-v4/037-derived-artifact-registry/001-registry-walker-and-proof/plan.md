---
title: "Implementation Plan: Phase 1: registry, walker and proof"
description: "Write one declarative registry for the three derived artifacts, one walker that normalizes the three wrapped tools' exit vocabulary and one staling case per entry so the mapping is proved rather than assumed."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: registry, walker and proof

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM for the walker, JSON for the registry |
| **Framework** | None, standard library only |
| **Storage** | `runtime/cli/lib/derived-artifacts.json` |
| **Testing** | Vitest cases that each build a scratch worktree and stale one source |

### Overview
The design is one declarative file and one reader. The registry names three artifacts, each with its source globs, its generator command and its target paths. The walker expands the sources, runs each entry's check and normalizes the result to one vocabulary: 0 fresh, 1 stale with every stale target named, 2 the check itself failed. The checks reuse what exists: the packet entry recomputes the stored fingerprint recipe that `backfill-graph-metadata.ts` already defines, the routing entry delegates to `compiled-route-guard.cjs` and the trigger entry recomputes the corpus hash recipe the index generator defines. `--write` shells out to each entry's declared generator instead of reimplementing generation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One declarative registry plus one walker, with per-entry checks that delegate to the tool that already owns the artifact.

### Key Components
- **Registry** (`runtime/cli/lib/derived-artifacts.json`): one entry per artifact, each carrying `id`, source globs, a generator command and target paths. It sits beside `validator-registry.json`, the existing precedent for a machine-readable table in that directory.
- **Walker** (`runtime/cli/spec/derive-artifacts.mjs`): `--check` reports and exits, `--write` regenerates through the declared generator, `--json` is not required in this phase.
- **Exit normalization**: the wrapped tools disagree today. `repair-derived.cjs` uses 1 for repairable work, `compiled-route-guard.cjs` uses 1 for drift and `generate-trigger-index.mjs` uses 1 for a malformed corpus, which is a failure rather than staleness. The registry carries the per-entry mapping and the walker reports the normalized result.

### Data Flow
Load the registry, expand each entry's sources, run the entry's check, collect stale target paths sorted by path, print them and exit 0, 1 or 2. `--write` runs only the stale entries' generators and reports each entry's outcome.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is not a bug fix. The section is filled because the phase reads the output of shared generators, and a reader of those generators has to know which side owns the recipe.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/graph/backfill-graph-metadata.ts` | Producer of the stored packet fingerprint | unchanged, the walker only reads what it writes | Staling case compares the walker's verdict with a fixture the generator produced |
| `.opencode/bin/compiled-route-guard.cjs` | Owner of the routing drift check | unchanged, the walker delegates to it | `--check` output on a staled SKILL.md fixture |
| `runtime/cli/retrieval/generate-trigger-index.mjs` | Producer of the index and its recorded corpus hash | unchanged, the walker recomputes the same recipe | Staling case adds a trigger phrase and expects the index target to go stale |
| `.opencode/scripts/git-hooks/pre-commit` | Consumer of the same artifacts through its own gates | unchanged, no gate consumes the registry in this phase | `git status --porcelain` shows no modification to it |

Required inventories:
- Same-class producers: `rg -n 'source_fingerprint|manifestHash|policyHash' .opencode/skills/system-spec-kit/runtime/cli .opencode/bin --glob '*.ts' --glob '*.mjs' --glob '*.cjs'`.
- Consumers of the registry: `rg -n 'derived-artifacts' .opencode --glob '*.ts' --glob '*.mjs' --glob '*.cjs'` returns only the walker and its test.
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
| Unit | Registry schema, source expansion, exit normalization for each entry kind | Vitest |
| Integration | One staling case per entry in a scratch worktree, including the `--write` round trip | Vitest with a temporary tree |
| Manual | Run `--check` before and after staling on a scratch copy, and confirm `git status --porcelain` is unchanged | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/cli/graph/backfill-graph-metadata.ts` | Internal | Green | The packet entry has no fingerprint to recompute against |
| `.opencode/bin/compiled-route-guard.cjs` | Internal | Green | The routing entry has no check to delegate to |
| `runtime/cli/retrieval/generate-trigger-index.mjs` | Internal | Green | The trigger entry has no recipe to reproduce |
| Node 22 standard library | Internal | Green | None, the walker adds no dependency |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The walker misreports on the real tree or its checks disagree with a wrapped tool's own verdict
- **Procedure**: Delete the three new files. Nothing else changed, so no other file needs reversing.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Registry schema ──────┐
                      ├──► Walker ──► Proof cases ──► Exit evidence
Wrapped tools read ───┘
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

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Implementation | Med | 4 to 6 hours |
| Verification | Med | 2 to 3 hours |
| **Total** | | **7 to 10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration, so no backup step applies
- [ ] Confirm the walker's three entries name only files that exist
- [ ] Confirm `--check` is the default and `--write` is opt-in

### Rollback Procedure
1. Delete `runtime/cli/lib/derived-artifacts.json`
2. Delete `runtime/cli/spec/derive-artifacts.mjs`
3. Delete `runtime/tests/derive-artifacts.vitest.ts`
4. Re-run the suite to confirm nothing else referenced them

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Registry entry  │────►│  Walkers check  │────►│  Proof cases    │
│  for one artifact│     │  for that entry │     │  for that entry │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Registry schema | Wrapped tools' outputs | Entry shape | Walker |
| Packet entry check | backfill fingerprint recipe | Stale target list | Proof case |
| Routing entry check | compiled-route-guard.cjs | Stale target list | Proof case |
| Trigger entry check | index corpus hash recipe | Stale target list | Proof case |
| Proof cases | All three checks | Phase exit evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Registry schema and three entries** - 1 hour - CRITICAL
2. **Walker check path plus exit normalization** - 3 hours - CRITICAL
3. **Three staling cases in a scratch worktree** - 3 hours - CRITICAL

**Total Critical Path**: About 7 hours

**Parallel Opportunities**:
- The routing and trigger entry checks can be written independently once the schema is frozen
- The `make -q` evaluation can run before or alongside the registry schema work
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Registry and walker exist | `--check` runs over the real tree and reports a stable set | End of Implementation |
| M2 | Proof cases green | One staling case per entry passes, and each fails when its entry is removed | End of Implementation |
| M3 | Exit evidence recorded | `validate.sh --strict` passes and `git status --porcelain` shows only the three new paths | End of Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep the registry beside the existing validator registry

**Status**: Proposed

**Context**: The repository already carries `runtime/cli/lib/validator-registry.json`, a machine-readable table of validation rules that other tooling reads. The new registry needs a home and the obvious alternatives are a new directory or a Makefile.

**Decision**: Add `runtime/cli/lib/derived-artifacts.json` beside the existing registry, and give the walker the same reader conventions.

**Consequences**:
- One directory holds both policy tables, so a reader looking for either finds the other
- The two registries now share a directory and may drift in schema style, which a review of the schema at plan time is the mitigation for

**Alternatives Rejected**:
- A `Makefile` with target rules: tested against one entry under REQ-007 before this decision is final
- A hardcoded check list inside the walker: it is the private per-artifact shape this phase exists to remove

### ADR-002: Decide `make -q` by measurement, not by argument

**Status**: Proposed

**Context**: One review named `make -q` as the existing solution to target-out-of-date, which is the problem the walker solves. A bespoke walker that reinvents it would be the wrong answer.

**Decision**: Test `make -q` against one registry entry before the check path is implemented. Record the observation and either adopt it or write the reason it does not fit this problem.

**Consequences**:
- The answer is a measurement, so a later reader does not have to re-argue it
- If `make` is rejected, the plan carries the reason rather than an assumption

**Alternatives Rejected**:
- Skipping the test: REQ-007 forbids it, and the review that raised the claim deserves an answer

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm `runtime/cli/lib/validator-registry.json` was read for the schema precedent
- [ ] Confirm the `make -q` test has run and its answer is recorded in ADR-002
- [ ] Confirm no existing file appears in the planned diff

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Freeze the registry schema before any entry check is written, because all three checks read it |
| TASK-SCOPE | Edits stay inside the three new paths. An entry that cannot be checked without editing the wrapped tool stops the phase and is raised instead |

### Status Reporting Format
Report phase status as: `Phase 001 - <Draft|Implementation|Verified> - <entries proved>/3 - blocking on: <none | the named entry>`.

### Blocked Task Protocol
A wrapped tool whose exit vocabulary cannot be normalized without editing that tool stops this phase. The finding names the tool, its observed codes and the mapping that failed, and the phase does not edit the tool.
<!-- /ANCHOR:ai-execution-protocol -->

---

