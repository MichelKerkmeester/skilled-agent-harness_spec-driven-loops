---
title: "Deep Review Strategy — specs/sk-doc/062-doc-validation-off-switches"
trigger_phrases: []
---

# Deep Review Strategy

## Review Charter

- Target: `specs/sk-doc/062-doc-validation-off-switches` (spec-folder, Level 2, status Complete)
- Fan-out lineage: `deepseek` (`cli-devin`, model `deepseek-v4-1-flash-max`), artifact dir `specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek`
- Dimensions: correctness, security, traceability, maintainability
- Scope: the packet's five docs plus the 127-file `goal-file-manifest.txt` scope — the validation off switches (`SPECKIT_SKIP_VALIDATION`, `SKDOC_SKIP_VALIDATION`), every reader of `hook-flags.env`, the guarded sk-doc validators, the changelog checks and nested changelog generator, contracts/references/user docs, changelog entries, and the two packets' own docs (061 and 062)
- Stop policy: `max-iterations` (5); convergence signals are telemetry only until iteration 5
- Success criteria: every dimension covered; core protocols (`spec_code`, `checklist_evidence`) executed; findings carry file:line evidence; final report carries the 9 core sections

## Scope Files

127 files from `goal-file-manifest.txt` (validated at init: all present, no duplicates, no traversal):

**Switch implementation and readers (D1/D2 core)**
- `.skilled/hooks/shared/hook-flags.cjs`, `.skilled/hooks/shared/hook-flags.sh`, `.skilled/hooks/shared/hook-flags.test.cjs`
- `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts`
- `.skilled/skills/sk-doc/shared/scripts/validation_switch.py`, `.skilled/skills/sk-doc/shared/scripts/validation-switch.cjs`
- `.skilled/skills/sk-doc/scripts/tests/test_validation_switch.py`

**Guarded validators (D1/D4)**
- 13 Python: `validate_document.py`, `quick_validate.py`, `check_authored_name_kebab.py`, `check_no_hyphenated_catalog_content.py`, `check_no_new_snake_case.py`, `check_no_numbered_categories.py`, `check_no_numbered_snippet_files.py`, `resolve_skill_markdown_links.py`, `validate_catalog_package.py`, `check_derived_readme_counts.py`, `check_readme_references.py`, `validate_skill_package.py`, `hvr_scan.py`
- 7 Node: `frontmatter-version.mjs`, `validate-doc-model-refs.js`, `check-goal.cjs`, `validate-playbook-package.cjs`, `check-repo-rules.cjs`, `validate-compiled-routing-scenarios.cjs`, `validate-playbook-topology.cjs`

**Changelog work (D3/D4)**
- `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts`
- `.skilled/commands/create/assets/create-changelog-auto.yaml`, `create-changelog-confirm.yaml`, `create-changelog-presentation.txt`
- `.skilled/skills/sk-doc/scripts/tests/test_changelog_validator.py`, `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`
- `.skilled/skills/sk-doc/shared/assets/template-rules.json`, `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`
- Changelog entries: `.skilled/changelog/skilled/{README.md,v4.0.0.0.md,v4.0.0.1.md,v4.0.0.2.md}`, `.skilled/skills/system-spec-kit/changelog/v4.{0.0.0,1.0.0,1.1.0,1.2.0,1.3.0}.md`, `.skilled/skills/sk-doc/changelog/v2.{2.1.0,2.2.0,0.0.0}.md`, `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.{2.0.0,3.0.0,3.1.0}.md`, `specs/sk-communication/001-sk-communication-creation/changelog/changelog-035-003-core-normalization-and-assembly.md`

**Contracts, references, user docs (D3/D4)**
- `.opencode/README.md`, `.opencode/SYNC.md`, `.skilled/commands/create/README.txt`
- `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md`
- `.skilled/skills/sk-doc/feature-catalog/document-validation/changelog-entry-frontmatter-check.md`, `feature-catalog/feature-catalog.md`, `hub-router.json`, `mode-registry.json`, `README.md`, `ROUTER.md`
- `.skilled/skills/sk-doc/shared/references/core-standards.md`, `shared/scripts/README.md`
- `.skilled/skills/sk-doc/sk-create-changelog/` package (SKILL.md, README.md, assets, references, manual-testing-playbook)
- `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`, `.skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md`, `.skilled/skills/sk-doc/SKILL.md`, `.skilled/skills/sk-git/references/finish-workflows.md`
- `.skilled/skills/system-spec-kit/feature-catalog/`, `manual-testing-playbook/`, `README.md`, `references/`, `runtime/cli/retrieval/`, `runtime/cli/tests/retrieval-*.vitest.ts`, `runtime/ENV-REFERENCE.md`, `SKILL.md`
- `PUBLIC-RELEASE.md`, `README.md`

**Packets (D3)**
- `specs/sk-doc/061-skilled-release-changelog/` (spec.md + 001/002/003 docs)
- `specs/sk-doc/062-doc-validation-off-switches/` (spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md)

## Cross-Reference Targets

- `spec_paths`: `specs/sk-doc/062-doc-validation-off-switches/{spec.md,plan.md,tasks.md,acceptance-criteria.md,implementation-summary.md}`, `specs/sk-doc/061-skilled-release-changelog/**`
- `code_paths`: the switch implementation, readers, guarded validators, changelog tooling listed above
- `test_paths`: `hook-flags.test.cjs`, `validate-skip-switch.vitest.ts`, `repair-derived.vitest.ts`, `test_validation_switch.py`, `nested-changelog.vitest.ts`, `retrieval-*.vitest.ts`

## Dimension Queue

1. correctness (D1)
2. security (D2)
3. traceability (D3)
4. maintainability (D4)
5. broadening pass (cross-cutting re-verification; max-iterations policy keeps convergence as telemetry)

## Known Context

- `resource-map.md not present; skipping coverage gate` — `specs/sk-doc/062-doc-validation-off-switches/resource-map.md` does not exist at init (checked), so `resource_map_present = false` and no Resource Map Coverage Gate section is emitted.
- No `checklist.md` exists in the packet, so the `AC_COVERAGE` validation signal predicate is inactive (Level 2 folder but `checklist.md` absent; the packet's Verification Checklist lives inside `tasks.md`).
- Packet continuity claims (spec.md `_memory`, acceptance-criteria.md, implementation-summary.md, tasks.md): packet complete 2026-09-28, commit evidence `4f4d25288c..396d26d4ff` plus comment-rule range `079d9cb31e..12c9351b5c` on `main`.
- Bounded Context Snapshot:
  - Target pointers: `SPECKIT_SKIP_VALIDATION` (spec folders) and `SKDOC_SKIP_VALIDATION` (sk-doc validators), both resolvable from environment then `hook-flags.env`; the comment rule (`#` after space/tab ends a value) in four readers.
  - Behavior claims to verify: REQ-001..REQ-008, AC-001..AC-008, SC-001..SC-003; truthy set {1,true,yes,on}; env wins even when `0`/empty; JSON skip report `{"skipped": true, "valid": true, ...}`; writers/self-tests stay live; CI never sees the switches; example lines work uncommented.
  - Reuse/conventions: existing `isHookEnabled` precedence in `hook-flags.cjs`; `hook_flag_on` refusing non-plain names before `eval`; notice on stderr naming the source.
  - Risks/gaps: shared checkout had concurrent writers (rename fixture test ran in a private clone); dead `SPECKIT_SKIP_DOC_MODEL_VALIDATE` mentions recorded as follow-up; BOM asymmetry across readers noted as pre-existing follow-up; graph tooling unavailable to this lineage (no out-of-lineage writes permitted).

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
[All four dimensions covered — iteration 5 runs as a broadening pass.]
<!-- /ANCHOR:review-dimensions -->

## 4. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | PASS | 1 | Precedence, truthy set, comment rule, skip-path ordering and guard placement all correct on read; one P2 parity edge recorded (F001). |
| D2 Security | PASS | 2 | Injection guarded and pinned, all four readers parse text only, CI keeps enforcing (zero matches, positive control shown), file ignored and untracked, skip paths write nothing; one P2 doc-completeness finding (F002). |
| D3 Traceability | PASS | 3 | `spec_code` pass (REQ-001..REQ-008 mapped to evidence); `checklist_evidence` partial (checkable rows pass; suite rows are executed claims); commit ranges verified; retrieval claim executed and holds; one P2 release-line finding (F003). |
| D4 Maintainability | PASS | 4 | Overlay protocols pass (catalog claims resolve in code; both playbook scenarios executable as written); docs coherent except one wording nit (F004); follow-up ledger accurate. |
<!-- /ANCHOR:completed-dimensions -->

## 5. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 4 active (F001, F002, F003, F004)
- **Delta this iteration:** +0 P0, +0 P1, +1 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- /ANCHOR:running-findings -->

## 6. NON-GOALS

- Fixing anything: the loop is observation-only; findings route to `/speckit:plan`.
- CI workflow behavior beyond the "CI keeps enforcing" claim (workflows are only checked for absence of the switches).
- The retired `memory/` paths and unrelated packets.
- `validate_report.py` (out of scope by design: safety check, keeps running).
- Barter coder's separate repository.
- Graph-assisted convergence tooling (not invoked; lineage containment forbids out-of-lineage writes).

## 7. STOP CONDITIONS

- Primary: `maxIterations` (5) reached — `stopPolicy: max-iterations`.
- Convergence (rolling avg <= 0.08, MAD noise floor, dimension coverage 1.0 with stabilization) is telemetry only; a converged early signal broadens the next angle instead of stopping.
- Hard escalation: 3+ consecutive iteration failures, state corruption, or a security vulnerability in production code (report immediately in the iteration file).

## 8. WHAT WORKED

- Reading all three resolver implementations side by side against the cross-reader test table: precedence, truthy set, comment rule and last-line-wins all match on the realistic cases, and the one divergence (F001) fell out of the comparison. (iteration 1)
- Reading the tests as behavior claims and cross-checking each against the implementation they pin (skip-path ordering, guard exemptions, injection refusal) rather than trusting the summary tables. (iteration 1)
- Guard-count verification by file sweep (`exit_if_validation_off|exitIfValidationOff` = 22 files, 20 validators + 2 helpers) confirmed the "13 Python and 7 Node" claim without running the suite. (iteration 1)
- Positive/negative-control pattern for absence claims: the CI grep was shown to match a known instance (`validate.sh`) before the zero-match result over `.github` was accepted, and `git check-ignore` plus `git ls-files` settled the ignore/untracked claim. (iteration 2)
- Reading git history (`git show 4f4d25288c~1:...validate.sh`) confirmed both pre-change skip exits and the semantics change from any-non-empty to the truthy set. (iteration 2)
- Requirement-by-requirement mapping (`spec_code`) with one evidence row per REQ: every requirement resolved without contradiction, and the two documentation gaps (F002, F003) surfaced from the mapping rather than from search alone. (iteration 3)
- Executing the read-only retrieval lookup to verify the 061 findability claim (`sk-git v1.0.0.0` ranks its entry first, score 1.0) — a claim that could be checked without any write. (iteration 3)
- Executing the overlay protocols against concrete artifacts: catalog claims mapped line-by-line into `validate_document.py` and `template-rules.json`; both playbook scenarios' command surfaces checked against the implementations they name. (iteration 4)
- Broadening pass re-verified every carried finding's citation against the files (one citation drift found and corrected, documented) and swept the remaining manifest areas for contradicting claims — none found. (iteration 5)

## 9. WHAT FAILED

- Re-running the test suites to re-derive their results: not attempted — lineage containment forbids commands that write outside the lineage directory (vitest caches, temp fixtures), so suite outcomes stay as read-claims cross-checked against test sources. Recorded as a dead end in iteration 1.

## 10. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
### Suite re-execution — BLOCKED (iterations 1-5)
- What was tried: nothing executable — every attempt to re-derive suite counts was refused by the lineage's write containment (vitest/node test caches and temp fixtures write outside the lineage directory).
- Why blocked: the fan-out lineage contract forbids any command that writes outside `specs/sk-doc/062-doc-validation-off-switches/review/lineages/deepseek`.
- Do NOT retry: re-running the hooks, spec-kit, sk-doc or playbook suites from inside this lineage. The suite rows in `tasks.md` remain executed claims; a later single-writer run outside the lineage can re-derive them.

### Absence-claim sweeps — PRODUCTIVE (iterations 2-5)
- What worked: pairing every zero-match search with a positive control on a known instance (CI grep), and settling ignore/tag/date claims with `git check-ignore`, `git ls-files`, `git rev-parse` and `git log`.
- Prefer for: any future "nothing sets it / nothing reads it / no entry mentions it" claim.
<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- "The packet's spec contradicts the implementation": every REQ resolves to shipped behavior; the two semantics changes are documented. (iteration 3)
- "The pinned commit ranges are wrong": both ranges verified against `git log --oneline`. (iteration 3)
- "A remaining manifest file contradicts the reviewed claims": the swept docs carry no switch/changelog claims or match the verified implementation. (iteration 5)
- "The packet metadata is inconsistent": `description.json` and `graph-metadata.json` agree with the packet docs. (iteration 5)
- "F004 was a phantom finding": the sentence exists at `hooks/README.md:71`; only the line number was wrong and is corrected. (iteration 5)

## 12. NEXT FOCUS
<!-- ANCHOR:next-focus -->
- Synthesis complete — no next iteration. Terminal stop: `maxIterationsReached` (5 of 5). Final verdict: PASS with 4 P2 advisories; report at `review-report.md`.
<!-- /ANCHOR:next-focus -->

## 13. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | REQ-001..REQ-008 each mapped to implementation evidence; no contradictions. |
| `checklist_evidence` | core | partial | 3 | Checkable rows (10) pass by reading; suite-count rows remain the packet's own executed claims under lineage containment. |
| `skill_agent` | overlay | notApplicable | 3 | Spec-folder target; no skill/agent drift observed. |
| `agent_cross_runtime` | overlay | notApplicable | 3 | Spec-folder target. |
| `feature_catalog_code` | overlay | pass | 4 | Both touched catalog entries' claims resolve in code. |
| `playbook_capability` | overlay | pass | 4 | CHG-011 and scenario 458 command sequences executable as written; referenced artifacts exist. |
<!-- MACHINE-OWNED: END -->

## 14. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

Per-file coverage state table -- rows are added as files are actually read and assessed (scope is 127 manifest files; the table tracks the reviewed subset with its findings).

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/hooks/shared/hook-flags.cjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/shared/hook-flags.sh | D1 | 1 | 0 P0, 0 P1, 1 P2 (F001) | complete |
| .skilled/hooks/shared/hook-flags.test.cjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/shared/scripts/validation_switch.py | D1 | 1 | 0 P0, 0 P1, 1 P2 (F001) | complete |
| .skilled/skills/sk-doc/scripts/tests/test_validation_switch.py | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/tests/validate-skip-switch.vitest.ts | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts | D1 | 1 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh | D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/hook-flags.env.example | D2 | 2 | 0 P0, 0 P1, 0 P2 | complete |
| .env.example (adjacent surface, outside manifest) | D2 | 2 | 0 P0, 0 P1, 1 P2 (F002) | complete |
| specs/sk-doc/062-doc-validation-off-switches/spec.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/062-doc-validation-off-switches/plan.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/062-doc-validation-off-switches/tasks.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/062-doc-validation-off-switches/acceptance-criteria.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/062-doc-validation-off-switches/implementation-summary.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/061-skilled-release-changelog/spec.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | partial (root doc read; child docs pending) |
| .skilled/changelog/skilled/README.md | D3 | 3 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/changelog/skilled/v4.0.0.2.md | D3 | 3 | 0 P0, 0 P1, 1 P2 (F003) | complete |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/feature-catalog/document-validation/changelog-entry-frontmatter-check.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/sk-create-changelog/manual-testing-playbook/search-metadata/write-global-entry-metadata.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/nested-changelog-generator.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/hooks/README.md | D4 | 4 | 0 P0, 0 P1, 1 P2 (F004) | complete |
| .skilled/hooks/shared/README.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/shared/scripts/README.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md | D4 | 4 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs | D5 (broadening) | 5 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | D5 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/sk-doc/sk-create-skill/scripts/validate-compiled-routing-scenarios.cjs | D5 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs | D5 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/062-doc-validation-off-switches/description.json + graph-metadata.json | D5 | 5 | 0 P0, 0 P1, 0 P2 | complete |
| specs/sk-doc/061-skilled-release-changelog/003-adjacent-alignment/implementation-summary.md | D5 | 5 | 0 P0, 0 P1, 0 P2 | head-checked (partial) |
| remaining contracts/docs (frontmatter-templates, finish-workflows, create README, PUBLIC-RELEASE, README, .opencode docs, retrieval READMEs) | D5 | 5 | 0 P0, 0 P1, 0 P2 | sweep-checked (no switch/changelog claims) |
<!-- MACHINE-OWNED: END -->

## 15. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1790598126829-x9gy4v, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-09-28T12:24:23Z
<!-- MACHINE-OWNED: END -->
