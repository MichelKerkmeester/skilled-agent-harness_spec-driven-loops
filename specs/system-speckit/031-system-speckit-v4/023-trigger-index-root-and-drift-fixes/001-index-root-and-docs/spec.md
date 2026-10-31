---
title: "Feature Specification: Phase 1: index-root-and-docs"
description: "The trigger-index generator resolved the repository root one directory short after the CLI nested under runtime/, so the published index carried spec documents only; the skill README also claimed a 46-rule registry against 37 real entries. Both are fixed with tests that pin them."
trigger_phrases:
  - "index root docs"
  - "trigger index repo root"
  - "skill docs missing from index"
  - "rule registry count"
  - "runtime api boundary"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: index-root-and-docs

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-metadata-drift-and-rules |
| **Handoff Criteria** | The published index lists documents under every corpus root, a test pins the repo-root derivation, and the README's rule count matches the registry with a test that keeps it so |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the integration research remediation.

**Scope Boundary**: the trigger-index generator and its data file, the retrieval regression test, the skill README and the runtime API README. No validator rule, no hook config, no shared helper.

**Dependencies**:
- None. This phase repairs a Gate 1 blind spot and runs first.

**Deliverables**:
- A repo-root derivation that walks up to the directory holding `.opencode` and `specs` instead of counting hops.
- A regenerated `runtime/data/trigger-index.json` that covers `.opencode/skills`, `.opencode/install-guides` and `specs`.
- Tests pinning the root and the README's rule count.
- A README note fixing the rule count and one stating what `@spec-kit/runtime/api` is for.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`DEFAULT_REPO_ROOT` in the trigger-index generator counted five parent hops from its own file. When the CLI moved from `scripts/` to `runtime/cli/`, five hops landed on `.opencode` instead of the repository, and the `.opencode/specs` symlink hid the error: the index kept every spec document and silently lost all 1,958 skill documents that declare trigger phrases. Gate 1's lookup could not surface a single skill doc. The skill README separately claimed a 46-rule registry when the registry holds 37.

**Purpose:** restore the index's coverage in a way that cannot drift with the directory depth again, and make the README's count self-checking.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `runtime/cli/retrieval/generate-trigger-index.mjs`: `findRepoRoot()` walks up to the first directory holding both `.opencode` and `specs`, or a git checkout, and falls back to the hop count only at the filesystem root.
- Regenerate the tracked index and its fixture outputs; prove two runs hash identically.
- `runtime/cli/tests/retrieval-repo-root.vitest.ts` and `runtime/cli/tests/validator-registry-doc-count.vitest.ts`.
- `README.md` rule count, the same count in `tests/test-validation-extended.sh`'s header, and the `runtime/api/README.md` boundary paragraph.

### Out of Scope
- The changelog entry that records the count as it was when written.
- Retrieval exclusion policy; phase 003 of packet 054 owns it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | The generator's default repository root is the directory that holds both `.opencode` and `specs`, independent of the generator's depth | P0 |
| REQ-002 | The published index contains documents under `.opencode/skills`, `.opencode/install-guides` and `specs`, and two consecutive runs produce the same index hash | P0 |
| REQ-003 | Every "<N>-rule registry" phrase in the skill docs equals the registry's length, enforced by a test | P1 |
| REQ-004 | The runtime API README states that the API is the internal runtime-to-CLI boundary, not a repo-wide library | P2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `walkCorpus(repoRoot)` yields files under each of the three corpus roots; the index lists 1,864 skill documents.
- **SC-002**: `grep -c "46-rule" README.md` prints 0 and the count test passes.
- **SC-003**: Typecheck, CLI build and dist freshness stay green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| A nested directory that also holds `.opencode` and `specs` would stop the walk early | Wrong root | Low | The walk was checked against every intermediate directory; none carries both anchors |
| A larger index changes lookup ranking | Different Gate 1 hits | Medium | Expected: skill docs were always meant to be reachable; parity tests stayed green |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:ai-protocol -->
## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Read `generate-trigger-index.mjs` and `retrieval/lib/corpus.mjs` before touching the root derivation.
- Confirm the index is regenerated from the repository root, never from a subdirectory.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Root derivation | Anchor on `.opencode` plus `specs`; never count hops |
| Index data | Regenerate twice and compare hashes before committing |
| Documented counts | Every "<N>-rule registry" phrase must equal the registry length |

### Status Reporting Format
Report the root printed by the generator, the index hash of two runs, the per-root path counts, and the result lines of the new tests.
<!-- /ANCHOR:ai-protocol -->
