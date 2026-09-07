---
title: "Tasks: Phase 7: links-scan-registry-rule"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "links scan registry rule tasks"
  - "run check adapter task"
  - "memory name allowlist task"
  - "registry coverage verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: links-scan-registry-rule

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Re-run the scan over the skill and over the full `.opencode/skills` tree to confirm the exact broken-link set and the out-of-scope `mcp-obsidian` finding (.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh)
- [ ] T002 [P] Grep every document that describes `check-links.sh` as standalone-only (.opencode/skills/system-spec-kit/runtime/cli/rules/README.md, .opencode/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md)
- [ ] T003 [P] Read the existing registry rows' `run_check(folder, level)` shape to match the adapter's output-variable contract (.opencode/skills/system-spec-kit/runtime/cli/rules/check-scaffold-never-touched.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Resolve `rename-pattern.md`'s four `[[feedback_*]]` memory-name wikilinks by rewrite or a documented allowlist convention (.opencode/skills/system-spec-kit/references/workflows/rename-pattern.md)
- [ ] T005 Add a `run_check(folder, level)` adapter to `check-links.sh` that scans `.opencode/skills/system-spec-kit` regardless of `$folder`, alongside the existing standalone `main()` (.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh)
- [ ] T006 Add the `LINKS_VALID` row to the registry (.opencode/skills/system-spec-kit/runtime/cli/lib/validator-registry.json)
- [ ] T007 Update the two documents that describe the scan as standalone-only (.opencode/skills/system-spec-kit/runtime/cli/rules/README.md, .opencode/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-validation-rule-engine.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `bash rules/check-links.sh .opencode/skills/system-spec-kit` and confirm zero broken links (.opencode/skills/system-spec-kit/runtime/cli/rules/check-links.sh)
- [ ] T009 Run `tests/validate-runs-every-registry-rule.vitest.ts` and confirm `LINKS_VALID` appears in the entries (.opencode/skills/system-spec-kit/runtime/cli/tests/validate-runs-every-registry-rule.vitest.ts)
- [ ] T010 Run `validate.sh --strict` across a sample of `specs/system-speckit/` packets, including this closure program's own siblings, and confirm none newly fails (.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh)
- [ ] T011 Run the extended validation suite and `npm run check` (.opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh)
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

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-005 present in spec.md §4]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 names the run_check adapter and the fixed scan target]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: 035-.../017-.../implementation-summary.md:61 confirmed as the reason the scan stayed standalone]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `bash -n` on check-links.sh exits 0]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: `bash rules/check-links.sh .opencode/skills/system-spec-kit` prints the clean-pass line]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: the adapter still exits non-zero if the fixed scan target directory is missing, mirroring the standalone main()'s existing guard]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: `run_check()` sets RULE_NAME/RULE_STATUS/RULE_MESSAGE/RULE_DETAILS/RULE_REMEDIATION the same way check-scaffold-never-touched.sh does]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md every row Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: validate.sh --strict run and read on the sampled system-speckit packets]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: the full `.opencode/skills` scan (no argument) still reports the mcp-obsidian finding unresolved, confirming the registry rule's fixed target never touches it]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: a deliberately reintroduced broken `[[feedback_*]]`-style link is confirmed to fail LINKS_VALID before the allowlist or rewrite is reapplied]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: cross-consumer, since the new rule changes what every validate.sh --strict run depends on]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T001's full-skill scan confirms only rename-pattern.md carries the memory-name broken-link pattern]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T002's grep of the two documents describing the scan as standalone, and the registry-coverage test's automatic pickup]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable. No path or parser boundary changes, the scan target is a fixed constant, not user input]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces matrix axes row states no per-folder axis applies, and names why]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. The rule reads a fixed path on disk, no process-wide state]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table names the commit SHA once it lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff review of the adapter and the registry row contains no credential-shaped string]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: the adapter's fixed scan target is a repository-relative constant, not derived from unvalidated input]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: requirement IDs in spec.md match the AC-ID to REQ-ID mapping in acceptance-criteria.md]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: check-links.sh's header comment updated to state the registry row and the fixed scan target]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: rules/README.md's rule count and inventory table updated to 40 rows including LINKS_VALID]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: scan output and grep working files written under this packet's scratch/, not the repo root]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `git status` on scratch/ shows no residue at close]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
