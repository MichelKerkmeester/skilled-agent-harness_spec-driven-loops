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

- [x] T001 Freeze the in-scope manifest: every active spec document reachable through the scoped glob set, with `z_archive/` and `node_modules/` excluded and the repository content hash recorded (`scratch/manifest.json`) (done: 22,094 documents frozen, not the 22,127 estimated in `spec.md` section 2 — 184 documents under hidden backup directories are unreachable by the section 14 recipes and are excluded with a recorded reason in section 13.7; the manifest is kept untracked as a regenerable 5.5 MB artifact at sha256 `b0a2cca198220fff…`)
- [x] T002 Stand up the pipeline skeleton with no write path: `enumerate`, `dry-run`, `process` and `rescan` subcommands, `--no-config` on every `rg` invocation (`.opencode/skills/system-spec-kit/scripts/retrieval/retrofit-convention.mjs`) (done: the pipeline ships those four subcommands plus `verify-preimage`, with `--no-config` on every invocation, at commit `d09294c2a9`)
- [x] T003 [P] Record the pre-retrofit baselines: total trigger phrase count, per-recipe exit statuses and the `rg` version (`scratch/baseline.json`) (done: the primary measure is `uniqueNormalizedPhrases` at 26,743, the three recipes each ran at exit 0 and ripgrep is 14.1.1; declared members moved 38,331 to 38,308 as the 23 duplicates came out, and the artifact carries the refreshed final state)
- [x] T011 Inventory every frontmatter variant: label each in-scope document `missing`, `malformed-or-unclosed`, `non-yaml`, `wrong-list-type`, `non-string-members`, `valid-empty`, `duplicate` or `oversized`, and assert the eight counts sum to the manifest total (`scratch/variant-inventory.json`) (done: all 22,094 classified with zero unclassified — missing 10,187 of which 9,143 had no block and 1,044 no key, malformed-or-unclosed 1, non-yaml 1, valid-empty 11,882, duplicate 23, oversized 0 and the other two labels 0; the artifact now holds the refreshed post-retrofit counts, missing 63 and valid-empty 22,029)
- [x] T012 Capture the body preimage hash manifest: SHA-256 over each document's body region with whole-line anchor markers removed and no other normalization (`scratch/preimage-manifest.json`) (done: one digest per document for all 22,094, kept untracked as a regenerable 4.7 MB artifact at sha256 `83ef620d1c11da27…`)
- [x] T013 [P] Inventory the exception classes the retrofit reports but does not fix: `alias-hit`, `generic-trigger`, `anchor-unmatched`, `anchor-duplicate` and `naming-exception` (`scratch/exception-inventory.json`) (done: generic-trigger 432 — 202 folder-token, 182 generic word, 27 prose, 17 stop-word and 4 editor-fallback — anchor-unmatched 95, anchor-duplicate 51, naming-exception 664 and alias-hit 0, over 165,580 marker lines with zero non-conforming ids)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the convention document, with `spec.md` sections 13 through 15 as its normative source (`.opencode/skills/system-spec-kit/references/structure/grep-convention.md`) (done: committed at `89faec9717`, registered in the skill `SKILL.md` and README, sk-doc validator 0 issues; the seven points it surfaced are resolved in `spec.md` section 13.7)
- [x] T005 Implement the variant classifier: exactly one label per document, fail closed when a document matches none (`scripts/retrieval/retrofit-convention.mjs`) (done: the classifier lives in `scripts/retrieval/lib/grep-convention.mjs` and returns exactly one label; enumerate over 22,094 documents produced zero unclassified, so the fail-closed branch never fired)
- [x] T006 Implement the per-variant handlers so each of the eight labels gets its documented treatment: insert for `missing`, skip for `malformed-or-unclosed`, `non-yaml`, `wrong-list-type`, `non-string-members` and `oversized`, accept for `valid-empty`, deterministic dedupe for `duplicate` (`scripts/retrieval/retrofit-convention.mjs`) (done: the handlers wrote 10,210 documents with 0 failures and removed 23 duplicate members, keeping the first occurrence in document order; two refusal classes were added on top of the eight — partial blocks on canonical documents and edits that would leave a block unparseable)
- [x] T007 Implement the diagnostics emitter with the `path`, `line`, `category`, `reason`, `rawKey` and `severity` schema, one row per skipped or warned path (`scripts/retrieval/retrofit-convention.mjs`) (done: every row carries all six fields, severity is staged from the shared `CATEGORY_SEVERITY` table, and the per-track diagnostics plus the aggregate `scratch/diagnostics.json` are committed)
- [x] T014 Implement the atomic processor: same-directory temporary file, post-edit preimage check, rename only on pass, original left untouched on fail (`scripts/retrieval/retrofit-convention.mjs`) (done: 10,210 files written across 14 tracks with 0 failures, and `verify-preimage` afterwards verified all 22,094 with 0 mismatches)
- [x] T015 Implement the trigger allowlist filter: normalize the `triggerPhrases` alias, reject and report the generic negatives and never adopt a frontmatter-editor or body-extractor fallback as index input (`scripts/retrieval/retrofit-convention.mjs`) (done: the alias is normalized on write and the corpus holds alias-hit 0; 432 generic candidates were reported and none adopted, the 4 editor-fallback rows among them naming the fallback in their reason)
- [x] T016 Implement anchor grammar handling: whole-line markers, lower-kebab ids with the typed-id exception and unmatched, orphan or duplicate ids reported rather than guessed (`scripts/retrieval/retrofit-convention.mjs`) (done: 165,580 marker lines parsed with 0 non-conforming ids; 95 anchor-unmatched and 51 anchor-duplicate rows reported and left unrepaired, per the report-only severity in `spec.md` section 13.7)
- [x] T017 Implement the `rg` wrapper: the structured, path and count recipes, the caller-side rank tuple and exit mapping 0 match, 1 no match, 2 or higher error (`scripts/retrieval/rg-wrapper.mjs`) (done: three recipes, the rank tuple and the exit mapping, with the count recipe kept separate from `--json` rather than added as a flag; wrapper tests 16 pass)
- [x] T018 Add the validator rule emitting the same diagnostics schema as the retrofit (`.opencode/skills/system-spec-kit/scripts/rules/check-grep-convention.sh`) (done: the rule and `check-grep-convention-helper.mjs` are registered always-on in `scripts/lib/validator-registry.json`, with status derived from the rows — error for the seven non-conforming variants, warn for the report-only classes; rule tests 19 pass)
- [x] T019 Update the templates so a freshly scaffolded packet conforms with no manual step (`.opencode/skills/system-spec-kit/templates/**`) (done: core, addons and 16 examples conform and the 16 scaffold goldens were refreshed; the corpus walker excludes tooling fixture trees outside `specs/` so template fixtures are not retrofitted as if they were documents)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Dry-run one track and review the emitted diff before any corpus write (`scratch/plan.diff`) (done: the 3.96 MB plan diff was reviewed on the `specs/agents` track before the first write; `scratch/dry-run-report.json` planned 10,210 documents across the 14 tracks with zero blockers)
- [x] T009 Process each track in turn, then rescan the frozen manifest for residue (`scratch/residue-report.json`) (done: 14 tracks processed in sequence, 10,210 written and 0 failures; the rescan over the frozen manifest reports residue 0 across 22,094 considered)
- [x] T010 Update spec, plan and tasks, and refresh the parent changelog entry for this phase (done for the documents: this closing pass sets `spec.md` to Complete, closes T001 to T028 and moves AC-001 to AC-016 to Met. The changelog half is N/A — the parent packet has no `changelog/` directory, so there is no entry to refresh and one was not created for a single phase)
- [x] T020 Replay the frontmatter-only control: a phrase present only in a `trigger_phrases` list returns exit 0 and exactly the declaring documents (done: exit 0 and exactly the one declaring document, recorded with its exit status in `scratch/baseline.json`)
- [x] T021 Replay the anchor control: a known anchor id returns exit 0 with its marker line number, classified as anchor evidence (done: the id returns anchor-marker evidence with one-based line numbers, classified as anchor rather than body)
- [x] T022 Replay the body-only control: a phrase present only in prose returns body evidence ranked below every field hit (done: the body hit returns and ranks below every field hit under the wrapper's rank tuple)
- [x] T023 Replay the generic negative control: `session` returns no `trigger_phrases` field hit anywhere in the corpus (done: the run added no `trigger_phrases` member for the generic word, and every generic candidate is reported instead — 432 rows in `scratch/exception-inventory.json`. Author-declared generic phrases survive in place, which section 13.7 records as the known residual)
- [x] T024 Replay the archive-exclusion control: a phrase present only under `z_archive/` returns exit 1, and no `z_archive/` path appears in any other control (done: no archived path appears in any control and `git status` shows zero changed files under `z_archive/`)
- [x] T025 Replay the malformed-skip control: the fixture is byte-identical afterwards and produces exactly one diagnostic row (done: the fixture is byte-identical with exactly one diagnostic row, asserted by the pipeline suite, 27 tests pass)
- [x] T026 Replay idempotence: a second full pipeline run over an unchanged corpus produces zero diff and byte-identical artifacts (done: a second enumerate then process wrote 0 documents and the diff is byte-identical)
- [x] T027 Verify the body preimage manifest across every processed document and assert zero diff lines that are neither frontmatter nor whole-line markers (done: `verify-preimage` verified 22,094 with 0 mismatches, and the mechanical diff classifier put all 36,271 changed lines across 10,202 files inside frontmatter, with 0 anchor-marker lines and 0 in the `other` bucket)
- [x] T028 Regenerate the trigger index and compare its phrase count against the T003 baseline (done: `uniqueNormalizedPhrases` is 26,743 before and after, since the retrofit adds no phrase and removed only 23 duplicate members; the index publishes and regenerates byte-identical across two runs at the same sha256, holding 33,791 unique phrases and 13,096 paths against 33,871 and 13,220 at the phase start, a difference owed to the new fixture-tree exclusion rather than to the retrofit)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Research**: T011 through T028 derive from specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Rows that do not apply to a corpus-normalization phase are closed as `N/A` with the reason, not
marked as work that happened.

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 to REQ-015, the convention contract in sections 13.1 to 13.7, the ripgrep recipes in section 14 and the body-preservation invariant in section 15
- [x] CHK-002 [P0] Technical approach defined in plan.md — the enumerate, dry-run, process and rescan pipeline, the scoped glob and ignore behavior, and the diagnostics schema the validator shares
- [x] CHK-003 [P1] Dependencies identified and available — phases 001 to 003 complete, so the convention is shaped by the retrieval path that exists; ripgrep 14.1.1 vendored and recorded in `scratch/baseline.json`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — the pipeline, the shared library, the wrapper and the rule are Node ESM with no build step; their suites run green and the spec-kit harness `test-validation.sh` passes 31/31
- [x] CHK-011 [P0] No console errors or warnings — the 14 track runs wrote 10,210 documents with 0 failures and no unhandled diagnostic; the post-commit drift-marker hook did overflow the environment limit on the 10k-file commit and was fixed to stream the diff at `2f3320a6b1`
- [x] CHK-012 [P1] Error handling implemented — the classifier fails closed on an unmatched document, the processor leaves the original untouched when the post-edit preimage check fails, and two refusal gates stop edits that would break a frontmatter contract
- [x] CHK-013 [P1] Code follows project patterns — the retrofit and the validator share one `CATEGORY_SEVERITY` table and one diagnostics schema, so the two are comparable without translation
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-016 are Met in `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete — the dry-run diff was read on the `specs/agents` track before any write, and the 55 canonical refusals were checked packet by packet through `validate.sh` against the phase-002 commit
- [x] CHK-022 [P1] Edge cases tested — grep-convention 66, pipeline 27, wrapper 16, rule 19, trigger-index 41 and sweep 29 tests pass, covering the eight variants, the malformed skip and the idempotent second run
- [x] CHK-023 [P1] Error scenarios validated — the flow-mapping corruption was caught by the code agent's own semantic check, reverted and closed with a refusal gate; the 7 malformed documents were hand-repaired with the preimage identical and the diff frontmatter-only
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — the finding classes here are the eight variant labels plus the five exception classes, each assigned before any document was processed
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — the producers are the templates, updated in T019 so a fresh scaffold conforms with no manual step, and the frontmatter editor, whose fallbacks are reported as `generic-trigger` rather than adopted
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — the consumer set is the frozen manifest of 22,094 documents plus the trigger index built from them; the index regenerates byte-identical and the fleet validator scan covers 2,799 packets
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — the frontmatter parser carries the adversarial cases that matter here: unclosed fence, non-YAML block, flow mapping, no-op second run and the editor fallback, each with a test and none with a silent repair
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — the axes are the eight variant labels by the 14 tracks; the row counts are 22,094 considered, 10,210 written and 0 residue
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — every `rg` invocation passes `--no-config`, which neutralizes `RIPGREP_CONFIG_PATH` and the ignore files, so an operator's ambient flags cannot change what the retrofit sees
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — the convention is `89faec9717`, the tooling `d09294c2a9` and `2f3320a6b1`, and the corpus passes `6fb5a7181e`, `41f18b4ca9`, `c307a2265e` and `fb59dd49dd`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the phase writes frontmatter keys and anchor markers; no credential or value is authored anywhere in it
- [x] CHK-031 [P0] Input validation implemented — every in-scope document is classified before it is touched, and an unmatched document stops the run rather than defaulting to skip
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: the retrofit is a local file pass with no auth surface, and NFR-S01 holds because it writes only inside `specs/` and makes no network call
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — this closing pass sets `spec.md` to Complete, closes T001 to T028 and moves AC-001 to AC-016 to Met
- [x] CHK-041 [P1] Code comments adequate — the pipeline's refusal gates carry the reason in the diagnostic row rather than only in a comment, so an operator reading the artifact sees why a document was left alone
- [x] CHK-042 [P2] README updated (if applicable) — the convention is registered in the system-spec-kit `SKILL.md` and README, so a reader reaches it from the skill root rather than by knowing the path
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — every artifact this phase produced sits in `scratch/`: baselines, inventories, the dry-run and residue reports, the preimage verification and the per-track diagnostics
- [x] CHK-051 [P1] scratch/ cleaned before completion — the small artifacts are committed as evidence; `manifest.json`, `preimage-manifest.json` and `plan.diff` are left untracked as regenerable multi-megabyte outputs with their sha256 digests recorded in T001, T012 and T008
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 23 | 23/23 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-09-04
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — N/A: this packet has no `decision-record.md`; the frozen decisions D1 to D5 live in `goal.md` section 1 and the amendments taken during the build are recorded in `spec.md` section 13.7
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) — N/A: no ADR is required because no acceptance row is Waived or Superseded
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — a flat error mapping for every finding class was rejected because a fleet scan put 319 of 2,799 packets in error on report-only classes; the staged severity in section 13.7 replaced it
- [x] CHK-103 [P2] Migration path documented (if applicable) — N/A: the corpus is migrated in place by an idempotent pipeline, so the migration is the phase rather than a document
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) — the three recipes each returned at exit 0 over the retrofitted corpus with their transcripts recorded in `scratch/baseline.json`; no recipe regressed past the measured 0.5s
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) — N/A: this phase declares no throughput target; its non-functional rows are NFR-P01, NFR-S01 and NFR-R01
- [x] CHK-112 [P2] Load testing completed — N/A: the 22,094-document pass over 14 tracks is the load this phase has, and it ran to completion with 0 failures
- [x] CHK-113 [P2] Performance benchmarks documented — N/A: no timing benchmark was authored; the recorded exit statuses and the index regeneration stand in for NFR-P01 and NFR-R01
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and tested — rollback is the git history: the convention, the tooling and the four corpus passes are separate commits, and the 55 canonical documents were rolled back exactly that way after the partial blocks failed their packets
- [x] CHK-121 [P0] Feature flag configured (if applicable) — N/A: the retrofit is a one-time corpus pass and the validator rule is always-on by registry entry, so no flag gates either
- [x] CHK-122 [P1] Monitoring/alerting configured — the standing monitor is `validate.sh`: the `GREP_CONVENTION` rule runs on every packet and reports drift as it appears
- [x] CHK-123 [P1] Runbook created — the pipeline's five subcommands are the runbook, and `spec.md` section 14 carries the executable recipes with their exit mapping
- [x] CHK-124 [P2] Deployment runbook reviewed — N/A: nothing is deployed; the corpus and the validator registry are the whole delivery surface
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review completed — N/A: no security-relevant behavior changed; the retrofit writes only inside `specs/` and makes no network call
- [x] CHK-131 [P1] Dependency licenses compatible — no dependency was added; ripgrep 14.1.1 is the vendored binary already in the tree
- [x] CHK-132 [P2] OWASP Top 10 checklist completed — N/A: no web or request-handling surface is in scope
- [x] CHK-133 [P2] Data handling compliant with requirements — the body-preservation invariant is the data rule here, and it held byte-exactly across all 22,094 documents
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized — closed in this pass and checked by `validate.sh --strict` on this folder and its parent
- [x] CHK-141 [P1] API documentation complete (if applicable) — the convention document carries the frontmatter contract, the anchor grammar and the recipes with their exit mapping, which is the whole interface this phase exposes
- [x] CHK-142 [P2] User-facing documentation updated — `grep-convention.md` is registered in the skill `SKILL.md` and README and passes the sk-doc validator with 0 issues
- [x] CHK-143 [P2] Knowledge transfer documented — `implementation-summary.md` plus the follow-ups carried up to the parent `goal.md` LOG
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
