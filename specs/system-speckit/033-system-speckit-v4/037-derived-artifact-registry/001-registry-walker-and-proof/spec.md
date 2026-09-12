---
title: "Feature Specification: Phase 1: registry, walker and proof"
description: "One registry names every derived artifact with its sources and its generator. One walker answers whether any target is out of date. Each entry carries a staling case that fails when its mapping breaks, so the check is proved rather than assumed."
trigger_phrases:
  - "derived artifact registry"
  - "artifact walker"
  - "source to target map"
  - "registry driven freshness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 1: registry, walker and proof

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Three derived artifacts in this repository are policed by three separate gates: packet metadata, compiled routing manifests and the trigger index. Each gate knows how to detect staleness for the one artifact it owns, so no single place answers the question of what is derived, from what, by which generator. This phase writes that answer down and ships a walker that reads it.

The phase is additive. It creates two tool files and one test file, edits no existing file and changes no gate's behaviour. Every registry entry ends the phase with a staling case that goes red when the entry's mapping breaks.

**Key Decisions**: The registry lives beside `validator-registry.json` in `runtime/cli/lib/`, which already owns machine-readable policy tables. The walker normalizes the exit vocabulary of three tools that do not agree today.

**Critical Dependencies**: None. The three wrapped tools already exist and keep their current owners.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `scaffold/001-registry-walker-and-proof` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-transactional-remint |
| **Handoff Criteria** | Every registry entry has a staling case that fails when its mapping breaks, and two runs of `--check` over one unchanged worktree report the same stale set and the same exit code. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the One registry for every derived artifact, so no artifact owns a private staleness check specification.

**Scope Boundary**: Two new tool files and one new test file. No existing file is edited and no gate consumes the registry in this phase.

**Dependencies**:
- `runtime/cli/graph/backfill-graph-metadata.ts`, the generator whose stored fingerprint the walker recomputes
- `runtime/cli/lib/validator-registry.json`, the precedent for a registry in that directory

**Deliverables**:
- `runtime/cli/lib/derived-artifacts.json` with three entries
- `runtime/cli/spec/derive-artifacts.mjs` with `--check` and `--write`
- `runtime/tests/derive-artifacts.vitest.ts` with one staling case per entry

**Changelog**:
- This packet keeps no changelog folder. Phase closure is recorded by the parent phase map status.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Freshness is defended per artifact, and the artifacts are not unproved. Packet metadata has a tested stale-fingerprint arm in `runtime/tests/generator-hardening.vitest.ts`, routing drift has `routing-registry-drift-guard.vitest.ts` and `compiled-route-manifest.test.cjs` in the advisor package, and the trigger index has `runtime/cli/tests/workflow-trigger-index-freshness.vitest.ts`. What is missing is not proof. It is the single answer to what is derived, from what and by which generator, and one checker that can walk every entry. Without that, the next derived artifact ships with no gate and stales silently until someone validates the right folder, and each existing artifact keeps a private check that only its own tests know about.

### Purpose

That question has one answer, in one file, read by one walker. Each entry's check is proved by a case that stales its source and fails when the check stops noticing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A registry naming each artifact, its source globs, its generator and its target paths
- A walker with `--check`, which writes nothing and exits non-zero listing stale targets, and `--write`, which regenerates through the entry's declared generator
- Three entries to start: packet derived metadata, compiled routing manifests and the trigger index
- One staling case per entry, run in a scratch worktree
- A recorded answer to the review claim that `make -q` already solves this problem

### Out of Scope
- **Consuming the registry from any gate.** This phase is additive. Nothing changes behaviour until a later phase proves the walker against each gate.
- **Deleting or altering any existing gate.** That waits for proof.
- **The other derived artifacts.** Mirrors, dist freshness and the MCP mutation class keep their own gates until the three entries here are proved.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/lib/derived-artifacts.json` | Create | The registry, beside the existing `validator-registry.json` |
| `runtime/cli/spec/derive-artifacts.mjs` | Create | The walker: `--check` reports, `--write` regenerates through each declared generator |
| `runtime/tests/derive-artifacts.vitest.ts` | Create | One staling case per registry entry, each in a scratch worktree |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The registry names each derived artifact with its source globs, its generator and its target paths |
| REQ-002 | `--check` writes nothing, names every stale target and exits 1 when any target is stale and 0 when none is |
| REQ-003 | `--write` runs each stale entry's declared generator rather than reimplementing generation |
| REQ-004 | Exit codes are normalized across the wrapped tools: 0 fresh, 1 stale, 2 the check itself failed |
| REQ-005 | No existing file is edited in this phase |
| REQ-006 | One test case per registry entry, and removing an entry from the registry makes that case fail |
| REQ-007 | The `make -q` claim is tested against one entry and the answer is recorded in the plan either way |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-900 | The phase exit criterion is verified from the final state |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

**SC-001**: Two `--check` runs over one unchanged worktree report the same stale set and exit with the same code
Red when: the second run reports a different set, which any nondeterminism in source expansion or sorting would produce.

**SC-002**: In a scratch worktree whose derived artifacts were regenerated first, touching one packet's `spec.md` adds exactly that packet's `graph-metadata.json` and `description.json` to the stale set, and the exit code is 1
Red when: another packet's targets appear, the touched packet's targets are absent, or the code reads 0 with the touched packet listed.

**SC-003**: `--check` writes nothing, so `git status --porcelain` is byte-identical before and after the run
Red when: any file it should not write appears as modified, added or deleted.

**SC-004**: After `--write` for the staled entry, a second `--check` no longer names that entry's targets and the stale set returns to the pre-staling baseline
Red when: the target remains stale or a new stale target appears.

**SC-005**: The three artifacts are checked from the three declared sources, and the run edits no existing file, so `git status --porcelain` shows only the three new paths
Red when: any modified tracked file appears.

**SC-006**: Deleting one entry from the registry makes its staling case fail
Red when: the case passes without its entry, which means it asserts nothing about the mapping.

**SC-007**: The plan records whether `make -q` was adopted or rejected, with the observation that settled it
Red when: the question is left unanswered in the plan or answered without a tested observation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Racing the session committing to this repository | Med | Three new files only, no existing file edited and re-read before write |
| Risk | Reinventing `make`, which already solves target-out-of-date | Med | One review named `make -q` explicitly. Test that claim before the walker is written, and record the answer either way as REQ-007 |
| Risk | The walker recomputes a fingerprint with a recipe that drifts from the generator's | High | The staling case asserts agreement with the generator's own output on a fixture, so a drifted recipe fails the suite |
| Risk | A check that shells out per packet turns a corpus walk into hours | Med | The packet entry recomputes stored hashes from disk. Only the routing entry shells out, once per hub |
| Dependency | `runtime/cli/graph/backfill-graph-metadata.ts` | Low | It defines the fingerprint the walker must reproduce. Read it before writing a second implementation |
| Dependency | `.opencode/bin/compiled-route-guard.cjs` | Low | It owns the routing check the walker delegates to |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The packet entry recomputes stored hashes instead of running `validate.sh`, so the walk is bounded by file reads rather than by per packet validation

### Security
- **NFR-S01**: The walker has no write path reachable without `--write`, and every path it writes is resolved inside the packet tree

### Reliability
- **NFR-R01**: Two runs over one unchanged tree report identical results, because every set is sorted before it is printed or counted

---

## 8. EDGE CASES

### Data Boundaries
- Empty registry: an empty or missing registry is exit 2 with a named reason, never exit 0, because a walker that reports fresh with nothing to check is worse than one that fails
- A packet with no generated metadata: the state is derived rather than an error, so a packet that never had a fingerprint is reported stale rather than failing the walk

### Error Scenarios
- A malformed fingerprint in a target: exit 2 naming the file, not stale, because a value that cannot be parsed cannot be compared
- A generator missing at `--write`: that entry fails by name and the other entries are left untouched
- A source glob that matches nothing: the entry reports the empty match and fails rather than reporting fresh

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 3 new, LOC: medium, Systems: 3 wrapped tools |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, read-only by default |
| Research | 10/20 | The generator's fingerprint recipe and the exit vocabulary of three tools |
| Multi-Agent | 5/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: none external |
| **Total** | **45/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Walker fingerprint recipe drifts from the generator's | H | M | Staling case asserts agreement with the generator on a fixture |
| R-002 | A check reports fresh when it could not run | H | M | Exit 2 covers failure and is asserted by its own criterion |
| R-003 | The walk becomes too slow to run | M | L | Only the routing entry shells out, once per hub |
| R-004 | A later phase builds on an unproved entry | M | L | One staling case per entry is the handoff criterion |

---

## 11. USER STORIES

### US-001: Know whether any derived artifact is stale (Priority: P0)

**As a** repository maintainer, **I want** one command that reports every stale derived target, **so that** I do not have to guess which gate or which folder to run before a change lands.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Register a new derived artifact in one place (Priority: P1)

**As a** tooling author, **I want** to name a new artifact's sources, generator and targets in one file, **so that** its freshness is checked without writing another bespoke gate.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the stored fingerprint should survive at all is deferred to the parent, which needs the phase 3 sweep before it can be answered.
- The `make -q` question is not left open. REQ-007 requires testing it and recording the answer in this phase.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the ADR section in `plan.md`, this packet carries no `decision-record.md`

---

