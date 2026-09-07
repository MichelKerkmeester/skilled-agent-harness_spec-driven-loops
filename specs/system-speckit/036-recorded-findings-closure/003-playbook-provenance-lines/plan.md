---
title: "Implementation Plan: Phase 3: playbook-provenance-lines"
description: "Audit all 85 playbook files, classify each as suite-backed or manual-only, write one provenance line per file inside its existing Section 4 and add a test that proves every cited path exists."
trigger_phrases:
  - "playbook provenance audit plan"
  - "suite backed manual only classification"
  - "provenance existence test plan"
  - "playbook rollback procedure"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: playbook-provenance-lines

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown content edits plus one new TypeScript test |
| **Framework** | Vitest, matching the runner already at `runtime/cli/tests/manual-playbook-runner.ts` |
| **Storage** | None |
| **Testing** | Vitest (`cli/tests/*.vitest.ts`) plus the cross-skill `playbook-operator-contract.yml` CI gate |

### Overview
Classify each of the 85 playbook files as suite-backed (name a real test file, verified to exist) or manual-only (name the exact hand command), write that classification as one consistent provenance sentence inside the file's existing `## 4. SOURCE FILES` section and add a Vitest suite that walks the tree and fails on any cited path that does not resolve.
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
Documentation-honesty audit plus one additive regression test - no runtime code path changes. The pattern mirrors what round two already did for the 010 (dead-fields) and 020 (rule-headers) children in the parent research packet: read every in-boundary file, classify, write, then add a test that keeps the claim honest going forward.

### Key Components
- **Audit pass**: for each of the 85 files, read Section 2 (Scenario Contract) and Section 3 (Test Execution) to find the real command/tool the scenario exercises, then search the runtime tree for a suite that actually covers it.
- **Provenance line**: one sentence per file, appended to (or normalizing an existing entry in) Section 4, in one of two fixed forms: `Provenance: <suite path>` or `Provenance: manual only - <exact command>`.
- **`playbook-provenance-paths.vitest.ts`**: walks the 85 files, extracts every `Provenance: <path>` line whose value is not `manual only - ...` and asserts `fs.existsSync` for each.

### Data Flow
Audit reads each file's existing content -> classification decision recorded as the new provenance line -> the new test reads the same 85 files -> parses out cited suite paths -> checks each against the filesystem -> fails the suite (and therefore CI) if one is missing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| 85 playbook markdown files | Manual test scenarios, each with its own Section 4 Source Files | Update: add one provenance line each | New `playbook-provenance-paths.vitest.ts` |
| `manual-testing-playbook.md` Section 8 | Names the two existing coverage-tracking mechanisms | Update: add the provenance-line convention as a third | Doc review |
| `sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Cross-skill structural validator. Checks Section 4's heading exists | Not a consumer of this phase's content, only its section shape, which is unchanged | `.github/workflows/playbook-operator-contract.yml` continues passing |
| `runtime/cli/tests/manual-playbook-runner.ts` | Walks the playbook tree for scenario execution, not provenance | Not modified. A separate concern from the new provenance check | Its own suite is unaffected, confirmed by no shared code path with the new test |
| `.github/workflows/playbook-operator-contract.yml` | CI gate over the whole playbook fleet | Not modified. Its trigger is deliberately NOT path-filtered, so it re-runs against this phase's changes automatically | The workflow's own "Verify the gate can actually run" step plus the validator step |

Required inventories:
- Same-class producers: `find .opencode/skills/system-spec-kit/manual-testing-playbook -name "*.md" | wc -l` confirms 85 files across 10 category directories plus the root index.
- Consumers of changed content: `grep -rn "manual-testing-playbook" .opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` confirms this root is fail-closed-enforced, so a structural regression here is caught by CI, not just by this phase's own test.
- Matrix axes: 85 files x 1 classification each (suite-backed or manual-only) = 85 rows. No cross-product beyond that.
- Algorithm invariant: N/A - no path/redaction/parser algorithm changes. The equivalent invariant is: every suite-backed provenance line's cited path exists on disk, enforced by the new test on every future CI run, not just once at authoring time.
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
| New unit test | Every cited provenance path across all 85 files | `playbook-provenance-paths.vitest.ts` (new) |
| Regression | Playbook fleet structural shape (5-section ordering, frontmatter) | `.github/workflows/playbook-operator-contract.yml` via `validate-playbook-package.cjs` |
| Regression | Scenario runner still walks the tree without error | `manual-playbook-runner.vitest.ts` |
| Manual | Spot-check a sample of "manual only" lines against their named command actually running | A handful of the 85 files, chosen across categories, run by hand |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `.github/workflows/playbook-operator-contract.yml` | Internal, cross-skill (owned by sk-doc's validator) | Green | Confirmed enforcing `system-spec-kit/manual-testing-playbook` at allowlist line 58. This phase's content must stay inside the section shape it checks |
| `runtime/cli/tests/manual-playbook-runner.ts` | Internal | Green | Confirmed present at 1,074 lines. Not modified, only read for context |
| `sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md` | Internal, cross-skill, read-only reference | Green | Confirms the Section 4 heading contract this phase writes into |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `playbook-operator-contract.yml` regresses, or the new `playbook-provenance-paths.vitest.ts` itself is found to be unreliable (false-failing on a valid path).
- **Procedure**: `git revert` the content commits. Since this phase only appends/normalizes one line per file and adds one new test file, a revert is a pure content rollback with no schema or registry change to unwind.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (audit all 85 files, classify each) ──┐
                                              ├──► Core (write provenance lines, add the new test) ──► Verify (new test + CI gate + Section 8 update)
Config (fix the provenance-line template)   ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Medium | 3-4 hours (auditing 85 files' Section 2/3 to find or rule out a real backing suite) |
| Core Implementation | Medium | 3-4 hours (writing 85 lines plus the new test) |
| Verification | Low | 1 hour |
| **Total** | | **7-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No data migration. Every touched file stays markdown prose
- [ ] No feature flag needed
- [ ] The new test is additive only. It cannot make an already-passing suite fail by existing

### Rollback Procedure
1. `git revert` the content commits.
2. Confirm `playbook-operator-contract.yml`'s gate still passes against the reverted tree.
3. If only the new test is faulty (not the content), revert just that file rather than the 85 content edits.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
