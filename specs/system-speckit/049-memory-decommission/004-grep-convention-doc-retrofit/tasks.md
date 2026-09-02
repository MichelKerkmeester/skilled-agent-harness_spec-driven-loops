---
title: "Tasks: Phase 4: grep-convention-doc-retrofit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "grep convention"
  - "spec doc retrofit"
  - "frontmatter normalization"
  - "greppable spec docs"
  - "task breakdown"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: grep-convention-doc-retrofit

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Freeze the in-scope manifest: every active spec document reachable through the scoped glob set, with `z_archive/` and `node_modules/` excluded and the repository content hash recorded (`scratch/manifest.json`)
- [ ] T002 Stand up the pipeline skeleton with no write path: `enumerate`, `dry-run`, `process` and `rescan` subcommands, `--no-config` on every `rg` invocation (`.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs`)
- [ ] T003 [P] Record the pre-retrofit baselines: total trigger phrase count, per-recipe exit statuses and the `rg` version (`scratch/baseline.json`)
- [ ] T011 Inventory every frontmatter variant: label each in-scope document `missing`, `malformed-or-unclosed`, `non-yaml`, `wrong-list-type`, `non-string-members`, `valid-empty`, `duplicate` or `oversized`, and assert the eight counts sum to the manifest total (`scratch/variant-inventory.json`)
- [ ] T012 Capture the body preimage hash manifest: SHA-256 over each document's body region with whole-line anchor markers removed and no other normalization (`scratch/preimage-manifest.json`)
- [ ] T013 [P] Inventory the exception classes the retrofit reports but does not fix: `alias-hit`, `generic-trigger`, `anchor-unmatched`, `anchor-duplicate` and `naming-exception` (`scratch/exception-inventory.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write the convention document, with `spec.md` sections 13 through 15 as its normative source (`.opencode/skills/system-spec-kit/references/structure/grep-convention.md`)
- [ ] T005 Implement the variant classifier: exactly one label per document, fail closed when a document matches none (`scripts/retrieval/retrofit-convention.mjs`)
- [ ] T006 Implement the per-variant handlers so each of the eight labels gets its documented treatment: insert for `missing`, skip for `malformed-or-unclosed`, `non-yaml`, `wrong-list-type`, `non-string-members` and `oversized`, accept for `valid-empty`, deterministic dedupe for `duplicate` (`scripts/retrieval/retrofit-convention.mjs`)
- [ ] T007 Implement the diagnostics emitter with the `path`, `line`, `category`, `reason`, `rawKey` and `severity` schema, one row per skipped or warned path (`scripts/retrieval/retrofit-convention.mjs`)
- [ ] T014 Implement the atomic processor: same-directory temporary file, post-edit preimage check, rename only on pass, original left untouched on fail (`scripts/retrieval/retrofit-convention.mjs`)
- [ ] T015 Implement the trigger allowlist filter: normalize the `triggerPhrases` alias, reject and report the generic negatives and never adopt a frontmatter-editor or body-extractor fallback as index input (`scripts/retrieval/retrofit-convention.mjs`)
- [ ] T016 Implement anchor grammar handling: whole-line markers, lower-kebab ids with the typed-id exception and unmatched, orphan or duplicate ids reported rather than guessed (`scripts/retrieval/retrofit-convention.mjs`)
- [ ] T017 Implement the `rg` wrapper: the structured, path and count recipes, the caller-side rank tuple and exit mapping 0 match, 1 no match, 2 or higher error (`scripts/retrieval/rg-wrapper.mjs`)
- [ ] T018 Add the validator rule emitting the same diagnostics schema as the retrofit (`.opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh`)
- [ ] T019 Update the templates so a freshly scaffolded packet conforms with no manual step (`.opencode/skills/system-spec-kit/templates/**`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Dry-run one track and review the emitted diff before any corpus write (`scratch/plan.diff`)
- [ ] T009 Process each track in turn, then rescan the frozen manifest for residue (`scratch/residue-report.json`)
- [ ] T010 Update spec, plan and tasks, and refresh the parent changelog entry for this phase
- [ ] T020 Replay the frontmatter-only control: a phrase present only in a `trigger_phrases` list returns exit 0 and exactly the declaring documents
- [ ] T021 Replay the anchor control: a known anchor id returns exit 0 with its marker line number, classified as anchor evidence
- [ ] T022 Replay the body-only control: a phrase present only in prose returns body evidence ranked below every field hit
- [ ] T023 Replay the generic negative control: `session` returns no `trigger_phrases` field hit anywhere in the corpus
- [ ] T024 Replay the archive-exclusion control: a phrase present only under `z_archive/` returns exit 1, and no `z_archive/` path appears in any other control
- [ ] T025 Replay the malformed-skip control: the fixture is byte-identical afterwards and produces exactly one diagnostic row
- [ ] T026 Replay idempotence: a second full pipeline run over an unchanged corpus produces zero diff and byte-identical artifacts
- [ ] T027 Verify the body preimage manifest across every processed document and assert zero diff lines that are neither frontmatter nor whole-line markers
- [ ] T028 Regenerate the trigger index and compare its phrase count against the T003 baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: T011 through T028 derive from specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | [X] | [ ]/[X] |
| P1 Items | [Y] | [ ]/[Y] |
| P2 Items | [Z] | [ ]/[Z] |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (if applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Response time targets met (NFR-P01)
- [ ] CHK-111 [P1] Throughput targets met (NFR-P02)
- [ ] CHK-112 [P2] Load testing completed
- [ ] CHK-113 [P2] Performance benchmarks documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested
- [ ] CHK-121 [P0] Feature flag configured (if applicable)
- [ ] CHK-122 [P1] Monitoring/alerting configured
- [ ] CHK-123 [P1] Runbook created
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed
- [ ] CHK-131 [P1] Dependency licenses compatible
- [ ] CHK-132 [P2] OWASP Top 10 checklist completed
- [ ] CHK-133 [P2] Data handling compliant with requirements
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] API documentation complete (if applicable)
- [ ] CHK-142 [P2] User-facing documentation updated
- [ ] CHK-143 [P2] Knowledge transfer documented
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| [Name] | Technical Lead | [ ] Approved | |
| [Name] | Product Owner | [ ] Approved | |
| [Name] | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


