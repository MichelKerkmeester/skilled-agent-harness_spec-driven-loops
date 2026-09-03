---
title: "Tasks: Phase 1: trigger-index-replacement"
description: "Ordered tasks for building the trigger index, the ripgrep retrieval contract, and the parity harness."
trigger_phrases:
  - "trigger index tasks"
  - "parity harness tasks"
  - "retrieval replacement tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: trigger-index-replacement

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

- [x] T001 Freeze the parity prompt set at 18 stable cases (`scripts/retrieval/fixtures/prompt-set.json`), each carrying `id`, `class`, `query`, expected behavior and `allowedDivergence`. Record the prompt-set hash too. The classes are exact phrase, uppercase case fold, punctuation separator, three-character partial token, multi-word subset, short-token rule, nine-token truncation, no-hit, scope collision, archived path, expired row, malformed frontmatter, duplicate phrase or path, accented and CJK input, anchor marker, body-only match, generic phrase negative and nested path punctuation (done: `fixtures/prompt-set.json`, 18 cases, SHA-256 ae629454 recorded as the manifest's promptSetHash)
- [x] T002 Capture the live `exactTriggerSearch` output for that set into `fixtures/live-lane-baseline.json` while the daemon is reachable. Record the frozen corpus manifest with it: included relative paths, exclusions, corpus content hash, parser version, index schema version, prompt-set hash and daemon availability at capture time. The daemon is documented as flapping, so this is captured first. An unavailable live arm is recorded as blocked rather than passed (done: the lane is replayed read-only from the main checkout's `context-index.sqlite` (12,224 rows) with the exact SQL and scoring; intersection 5,544 comparable paths recorded in the baseline)
- [x] T003 [P] Measure the emitted index size against a stated budget and decide single-file vs per-track sharding (settles R-001 and ADR-001's open half). **Done.** Schema 1 emitted 37,017,883 bytes with 21.9 MB of that in trigram postings. Schema 2 emits 3,814,726 bytes over 35,481 phrases, 13,597 paths and 45,578 declarations. Verdict: single file, no sharding, recorded as ADR-003 in `plan.md`. Evidence: `.opencode/skills/system-spec-kit/data/trigger-index.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Frontmatter parser: extract `trigger_phrases`, then emit a diagnostic row of `path`, one-based `line`, `category` and `reason` for each of missing frontmatter, malformed or unclosed frontmatter, non-YAML frontmatter, wrong list type, non-string member, valid empty list, `triggerPhrases` alias spelling, generic fallback phrase, duplicate phrase and oversized phrase (`scripts/retrieval/generate-trigger-index.mjs`). **Done.** A strict read-only reader in `scripts/retrieval/lib/frontmatter.mjs`, written rather than reused for the reasons in ADR-004. Measured over 28,555 documents: ok 13,505, missing-frontmatter 14,955, duplicate-phrase 92, valid-empty-list 2, non-yaml-frontmatter 1. Evidence: `scripts/retrieval/fixtures/generation-diagnostics.json`, 15,050 rows
- [x] T005 Corpus walker over `specs/**/*.md` and `.opencode/skills/**/*.md`, excluding `z_archive/` and `node_modules/`, reporting excluded-path variants and any file the manifest does not cover. **Done.** `scripts/retrieval/lib/corpus.mjs` walks both roots, excludes `z_archive/`, `node_modules/`, `scratch/`, `research/lineages/` and `.git`, and records 28,555 included paths, 785 `skippedPaths` and 1 `ignoredPaths` entry with a stated reason. Corpus 232,996,380 bytes. Evidence: `scripts/retrieval/fixtures/corpus-manifest.json`, manifest hash `c0806077f0d2e22ae7b0e9b6f8ab4e17244fac5aef0f6da59c95f7fe0938d370`
- [x] T006 Deterministic index emitter: sorted keys and sorted arrays, no generation timestamp, written to a same-directory temporary file and renamed only after validation, so a failed run leaves the last known-good artifact in place (`data/trigger-index.json`). **Done.** `scripts/retrieval/lib/artifact.mjs` holds `stableStringify` plus the same-directory write, round-trip validate and rename. Schema 2, two-space pretty-print retained. Evidence: `.opencode/skills/system-spec-kit/data/trigger-index.json`, 3,814,726 bytes
- [x] T007 [P] Write `references/retrieval/retrieval-conventions.md`: the concrete ripgrep invocation replacing each of `memory_search`, `memory_context` and `memory_quick_search`, with track and packet scoping, `--no-config`, the `z_archive` and `node_modules` exclusions, the 0/1/2+ exit mapping and the caller-side rank tuple. **Done.** Evidence: `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`. Executing each recipe and recording its exit status stays open under T015
- [x] T008 Parity harness with three arms, legacy, index and `rg`, reporting `legacyOnly` and `indexOnly` separately plus any scope, archive or expiry leakage (`scripts/retrieval/parity-check.mjs`) (done: `scripts/retrieval/parity-check.mjs` with `lib/legacy-lane.mjs` and `lib/rg-lane.mjs`, 31 unit tests in `scripts/tests/parity-check.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Unit tests: well-formed, malformed, absent, valid empty list, alias spelling, generic phrase, duplicate-across-docs, oversized phrase (Vitest). **Done.** 40 tests across ten suites: `normalizeTriggerText`, `queryTokens`, `scorePhrase`, artifact encoding, `stableStringify`, `readTriggerPhrases`, `walkCorpus`, `generate`, `publishJson` and `lookup`. Evidence: `.opencode/skills/system-spec-kit/scripts/tests/trigger-index.vitest.ts`
- [x] T010 Determinism check: run the generator twice over one manifest, require byte equality and matching SHA-256, then run `git diff --exit-code` on the artifact (AC-002). **Done.** Three consecutive runs produced byte-identical and SHA-256 identical output for all three artifacts: `data/trigger-index.json`, `fixtures/corpus-manifest.json` and `fixtures/phrase-variants.json`
- [x] T011 Run the parity harness. Require zero unexplained rows in both directions and no lifecycle leakage across scope, archive and expiry, then commit the report as `fixtures/parity-baseline.json` (AC-001) (done: `fixtures/parity-baseline.json`, 18 PASS, legacyOnly 0, unexplained 0)
- [x] T012 Time single-prompt lookup across at least 30 fresh Node processes. Record p50, p95, p99, max, corpus bytes, index bytes, runtime and platform, then hold p95 and max under 200ms (AC-007). **Done.** 36 measured runs after 2 reported warm-ups, nearest-rank percentiles with no interpolation, Node v26.8.1 on darwin arm64: p50 71.3 ms, p95 83.7 ms, p99 91.0 ms, max 91.0 ms against the 200 ms budget. Corpus 232,996,380 bytes, index 3,814,726 bytes, pinned to the manifest hash. Evidence: `scripts/retrieval/fixtures/latency-report.json` and the harness at `scripts/retrieval/measure-cold-lookup.mjs`
- [x] T013 Stop the `system-spec-memory` daemon and confirm Gate 1 trigger matching still returns results with no network access, recording the commands run and their exit statuses (AC-008) (done: `fixtures/daemon-off-proof.json`, no daemon process, three lookups exit 0)
- [x] T014 Record the decisions T003 and T012 produced, the measured artifact size, the sharding verdict and the latency numbers, then update `spec.md` open questions with those answers. **Done.** `spec.md` §3 Index Artifact Design now carries the schema 2 shape and the before-and-after numbers, §6 and §10 record the closed size risk plus the corpus defect, and §12 answers the sharding and latency questions. `plan.md` carries ADR-003 (compact encoding instead of sharding) and ADR-004 (strict read-only frontmatter reader)
- [x] T015 Execute each documented ripgrep recipe once, read its exit status, then record the 0 match, 1 no match, 2+ error mapping alongside the observed output (AC-005) (done: `fixtures/recipe-execution.json`, nine runs mapping exit 0, 1 and 2 for each recipe)
- [x] T016 Run the semantic paraphrase rows as boundary probes and report them separately from the lexical gate, so a paraphrase miss never counts as a parity failure and never counts as a pass (done: `fixtures/semantic-probes.json`, paraphrase rows labelled semantic-trigger-shadow, reported apart from the lexical verdict)
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
- **Research**: See `../005-ripgrep-retrieval-research/research/lineages/luna-max/research.md`
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
| P0 Items | 14 | 0/14 |
| P1 Items | 18 | 0/18 |
| P2 Items | 10 | 0/10 |

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
| Repository owner | Technical Lead | [ ] Approved | |
| Repository owner | Product Owner | [ ] Approved | |
| Repository owner | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->


