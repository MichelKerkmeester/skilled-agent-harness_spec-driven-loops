---
title: "Feature Specification: Phase 4: shared-parsers-and-post-run-refresh"
description: "One frontmatter parser and one write-boundary primitive now live in the spec-kit shared package and are used by the spec-kit CLI, the runtime orchestrator and the skill advisor; the fan-out runner refreshes the target packet's generated metadata after every run. Deep-loop and sk-doc adoption is blocked on a missing dependency edge and is recorded, not hacked."
trigger_phrases:
  - "shared parsers post run refresh"
  - "shared frontmatter parser"
  - "shared path containment"
  - "post-run metadata refresh"
  - "no-metadata-refresh flag"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: shared-parsers-and-post-run-refresh

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-hook-markers-and-improvement-family |
| **Successor** | None |
| **Handoff Criteria** | The shared parser and containment helpers exist with tests, every adoptable caller in spec-kit and the advisor uses them, the runner's post-run refresh is tested and flag-guarded, and every blocked adoption names its missing edge |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the integration research remediation.

**Scope Boundary**: the spec-kit shared package, its adopters in `runtime/cli`, `runtime/lib` and the skill advisor, the fan-out runner's post-run step and its unit test, and the advisor's local sqlite declaration. No Python rewrite; no new dependency edge across skills.

**Dependencies**:
- None on the earlier phases.

**Deliverables**:
- `shared/frontmatter/parse-frontmatter.ts` with `parseFrontmatter` and `stringifyFrontmatter` and a script-style test.
- `shared/utils/path-containment.ts` holding the canonical containment primitive, re-exported from the CLI's `path-utils`.
- Nine spec-kit callers, the runtime orchestrator and two advisor modules parsing through the shared function.
- `fanout-run.cjs` post-run metadata refresh with `--no-metadata-refresh` and four unit tests.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Frontmatter parsing was hand-rolled in four skill families across more than twenty files, and path containment existed twice with subtly different symlink semantics. The research also showed that a deep-loop research or review run never refreshes the owning packet's generated metadata, so retrieval kept serving hours-old descriptions. No shared library existed to hold any of it.

**Purpose:** give the helpers one home in the spec-kit shared package, adopt them wherever an import edge exists, record precisely where one does not, and make the runner refresh packet metadata when a run ends.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `shared/frontmatter/parse-frontmatter.ts` using the `js-yaml` the workspace already carries; cases: no fence, CRLF fences, a fence not on line one, `---` inside the body.
- `shared/utils/path-containment.ts` moved verbatim from the CLI; the CLI re-exports it.
- Adoption in spec-kit (`find-predecessor-memory`, `frontmatter-editor`, `title-builder`, `workflow`, `spec-folder-extractor`, `validate-memory-quality`, `spec-affinity`, the runtime orchestrator) and in the skill advisor (`doc-frontmatter`, `skill-markdown`).
- `fanout-run.cjs`: post-run `generate-description.js` and `backfill-graph-metadata.js` for the spec folder, default on, `--no-metadata-refresh` to skip, non-fatal, ledger events.
- The advisor's local `better-sqlite3` declaration, replacing the types package it borrowed from spec-kit before the decommission dropped it.

### Out of Scope
- Deep-loop and sk-doc adoption: neither package has a dependency edge to `@spec-kit/shared`, and installing one is a scoped mutation for a later packet.
- Deep-loop's `canonicalPath`: it deliberately reads through a dangling symlink; unifying it would weaken that guard.
- Python parsers in sk-doc and skill-advisor scripts.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | One exported frontmatter parser with tests for the four edge cases, no new dependency | P1 |
| REQ-002 | Every caller with an import edge parses through it and keeps its behavior; every caller without one is listed with the missing edge | P1 |
| REQ-003 | The containment primitive lives in the shared package and the CLI callers keep their import path | P2 |
| REQ-004 | The runner refreshes the target packet's generated metadata after a run, can be disabled, and never changes the run's exit code | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The parser test passes; spec-kit typecheck and all three builds green; the advisor builds.
- **SC-002**: Adopted callers' suites pass; the count of hand-rolled parsers left is recorded with file and reason.
- **SC-003**: The fan-out unit suite passes with the four refresh tests; `--no-metadata-refresh` parses to off.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| A caller relied on a quirk of its local parser | Behavior change | Medium | Each caller's suite rerun; the compiled orchestrator rebuilt before the generated-metadata suites passed |
| The post-run refresh runs where the CLI dist is absent | Missing metadata | Low | Skips with a warning and a ledger event; never fatal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
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
