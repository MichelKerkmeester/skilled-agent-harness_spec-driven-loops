---
title: "Feature Specification: Phase 29: align system-deep-loop runtime code with sk-code-opencode"
description: "The system-deep-loop runtime drifts from sk-code-opencode (131 files without a MODULE header, 147 large files without numbered sections, 9 code folders without a README) and the skill has no ARCHITECTURE.md. This phase also owns the shared prerequisites for the sibling skill-advisor and spec-kit packets: the checker flags, the ARCHITECTURE template, and the DeepSeek loop driver."
trigger_phrases:
  - "deep loop runtime alignment"
  - "sk-code-opencode section dividers deep loop"
  - "deep loop architecture md"
  - "check-sections check-folders"
  - "architecture template sk-create-readme"
  - "deepseek comment alignment loop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 29: align system-deep-loop runtime code with sk-code-opencode

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/070-runtime-code-alignment`, merged to `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 29 of 29 |
| **Predecessor** | 028-cli-lineage-nesting-and-containment-guard |
| **Successor** | None |
| **Handoff Criteria** | Prerequisites A-C land before the sibling packets start their loops |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 29** of the deep-loop-innovation packet. It aligns the system-deep-loop runtime with sk-code-opencode, and it owns the three prerequisites the sibling packets share.

**Scope Boundary**: the system-deep-loop runtime and ARCHITECTURE.md, the `verify_alignment_drift.py` flags, the ARCHITECTURE template in sk-create-readme, and the loop driver in this folder's `scratch/`.

**Dependencies**:
- None upstream. Downstream: `specs/system-skill-advisor/031-align-runtime-code-with-sk-code-opencode` and `specs/system-speckit/046-align-runtime-code-with-sk-code-opencode` wait on prerequisites A-C.

**Deliverables**:
- Checker flags, ARCHITECTURE template, loop driver, deep-loop ARCHITECTURE.md, and the aligned runtime.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Code under `.skilled/skills/system-deep-loop/runtime/` does not follow the sk-code-opencode comment and structure rules in `sk-code-opencode/references/typescript/style-guide/overview-strict-and-naming.md` §2 and §4. The default mode of `verify_alignment_drift.py` reports 0 findings on all three system skills because it never checks section dividers or folder READMEs, so nothing stops the drift. system-spec-kit and system-skill-advisor each have an ARCHITECTURE.md with the same 8-section skeleton; system-deep-loop has none, and sk-doc has no template for one.

Measured on 2026-09-30 (census script over 566 JS/TS files, `node_modules` and `dist` excluded):

| Measure | Count |
|---------|-------|
| JS/TS files (tests) | 566 (186) |
| Files without a `MODULE:`/`COMPONENT:` header in the first 40 lines | 131 |
| `--check-exact-headers` findings | 37 errors |
| Files over 150 lines | 380 |
| ...of those with no numbered section divider | 147 |
| Non-test files over 150 lines / without numbered sections (the in-scope set) | 263 / 68 |
| Files using a non-standard divider shape | 45 |
| Code folders | 72 |
| Code folders with no `README.md` | 9: `lib/authority-root`, `lib/cutover-binding`, `lib/deep-research-authority`, `lib/mode-append-gateway`, `lib/per-mode-authority-flip`, `scripts/tests`, `tests/stress/cli-adapter` and its `fixtures` and `shims` |
| Single-file leaf folders | 5 |

### Purpose
The checker can see the drift, sk-doc owns an ARCHITECTURE template, a cheap loop fixes the comments and READMEs one file or folder at a time, and system-deep-loop gets its ARCHITECTURE.md.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Shared prerequisites**
- A. `--check-sections` and `--check-folders` opt-in flags on `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py`, with tests in `test_verify_alignment_drift.py`. `--check-sections` flags a non-test file over 150 lines with no numbered divider, a non-standard divider shape, or both formats in one file. `--check-folders` flags a code folder without `README.md` and any folder whose name starts and ends with a double underscore (`__tests__`, `__fixtures__`), which the operator forbade on 2026-09-30.
- A2. The forbidden-name rule, written once in the shared sk-code doc and pointed to from each surface:
  - `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` §3 FILE STRUCTURE gains a "Folders and tests" rule for every surface: no folder name starts and ends with a double underscore, and test code lives only under a `tests/` tree, never beside source. The description, now scoped to WEBFLOW and OPENCODE, adds OBSIDIAN. Operator decisions, 2026-09-30.
  - `sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md`: the example tree at line 137 changes `tests/__helpers__/` to `tests/helpers/`, and the doc links the shared rule.
  - `sk-code-obsidian/SKILL.md` (lines 193-194, 215) and `sk-code-obsidian/assets/verification-checklist.md` (lines 70-72) stop prescribing co-located `*.test.ts` and `src/__tests__/`, and state the `tests/`-tree layout with a link to the shared rule. The Obsidian plugin repo sits outside this workspace, so its 49 co-located test files and 2 `__tests__` folders are recorded as known violations for a separate migration; the plugin code itself is not edited here.
- B. An ARCHITECTURE template at `.skilled/skills/sk-doc/sk-create-readme/assets/`, lifted from the 8-section skeleton the two existing ARCHITECTURE.md files share, wired into sk-create-readme's routing.
- C. A loop driver in this folder's `scratch/` that sends one DeepSeek V4.1 Flash (`high`) brief per file or folder through cli-pi, then runs the diff filter, typecheck and checker, and reverts the batch on any failure.

**system-deep-loop alignment**
- MODULE header on every runtime JS/TS file; numbered sections on non-test files over 150 lines.
- Code READMEs for the 9 folders above, minus any merged away.
- Folder merges that the SWE-2 MAX fact-check marks CONFIRMED.
- `.skilled/skills/system-deep-loop/ARCHITECTURE.md`, written from template B.

### Out of Scope
- Behavior changes of any kind.
- Numbered sections inside test files, by operator decision on 2026-09-30.
- The skill-advisor and spec-kit runtimes, which their own packets cover.

### Folder merges (DeepSeek proposal, SWE-2 MAX fact-check 2026-09-30)

Full importer lists: `scratch/investigation/devin-swe2max-merge-factcheck.md`.

| Folder | Target | Verdict | Action |
|--------|--------|---------|--------|
| `lib/cutover-binding/` | `lib/mode-append-gateway/` | CONFIRMED | Merge; 5 importers, not the 1 DeepSeek claimed, including a dynamic `import()` in `scripts/append-mode-event.cjs` |
| `lib/deep-research-authority/` | `lib/per-mode-authority-flip/` | REJECTED | Stays. It has production consumers, and the proposed target is its dependency, not its consumer |
| `scripts/tests/` | `tests/` | CONFIRMED | Merge; two in-file path fixes. It is a `node:test` suite, so vitest still will not run it |
| `tests/fixtures/council-value/data/` | `tests/fixtures/council-value/` | CONFIRMED | Merge; one `require` in `seed-helpers.ts` and README tree rows |

Overlapping sibling names flagged for review, not for automatic merge: `lib/dispatch-receipts` / `lib/receipts-and-effect-recovery`, `lib/result-envelopes` / `lib/event-envelope`, the three `authority` folders, `lib/legacy-projections` / `lib/transactional-projections`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | Two opt-in flags |
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/test_verify_alignment_drift.py` | Modify | Coverage for both flags |
| `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` | Modify | Shared forbidden folder-name rule, all three surfaces |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/code-organization/directory-and-test-conventions.md` | Modify | Example tree fixed; `tests/`-only placement rule; link to shared rule |
| `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` and `assets/verification-checklist.md` | Modify | Stop prescribing `__tests__`; link shared rule |
| `.skilled/skills/sk-doc/sk-create-readme/assets/` (architecture template) | Create | ARCHITECTURE template |
| `.skilled/skills/sk-doc/sk-create-readme/SKILL.md` | Modify | Route to the new template |
| `scratch/` loop driver in this folder | Create | DeepSeek batch loop |
| `.skilled/skills/system-deep-loop/runtime/**/*.{ts,js,cjs,mjs}` | Modify | Header and divider comments only |
| 9 folder READMEs under `.skilled/skills/system-deep-loop/runtime/` | Create | Code READMEs |
| `.skilled/skills/system-deep-loop/ARCHITECTURE.md` | Create | From template B |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No change alters runtime behavior: the typecheck and the full vitest suite pass after every batch, with the same pass count as the baseline taken before the first edit. |
| REQ-002 | Every loop edit touches comment and blank lines only; the driver reverts a batch whose diff changes a code line. |
| REQ-003 | The checker's existing default output is unchanged; the new checks run only behind their flags. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `--check-sections` and `--check-folders` each have a passing and a failing test case. |
| REQ-005 | The ARCHITECTURE template exists in sk-create-readme and deep-loop's ARCHITECTURE.md follows it. |
| REQ-006 | `verify_alignment_drift.py --check-exact-headers --check-sections --check-folders` reports 0 errors on the deep-loop runtime. |
| REQ-007 | Each CONFIRMED merge lands with all importers updated; each REJECTED merge is recorded with its reason. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new flags report the census counts above before the loop and 0 errors after it.
- **SC-002**: Test pass count equals the pre-edit baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go quota for DeepSeek V4.1 Flash | Loop stalls | `cline-pass` route as fallback |
| Risk | DeepSeek edits a code line while adding comments | High | Driver diff filter reverts it |
| Risk | DeepSeek's reports are wrong; 1 claim was false and 1 overstated in the first pass | Med | SWE-2 MAX fact-check before any merge; tests after each |
| Risk | The deep-loop runtime runs the loop driver's own dispatch path | Med | The driver calls `pi` directly, not the deep-loop fan-out |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One brief names one file or one folder and one change.

### Security
- **NFR-S01**: No credentials in briefs.

### Reliability
- **NFR-R01**: The driver records a batch as done only after its checks pass, so a rerun resumes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Shebang lines stay first; the header follows them.
- `dist/` and `node_modules/` are never edited.

### Error Scenarios
- Provider error text in the output (quota, 4xx): the batch stays pending; the exit code is not trusted.

### State Transitions
- A merge that fails tests is reverted in full before the next one starts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 400 files comment-only, plus checker, template, driver |
| Risk | 11/25 | Checker is shared tooling; comment edits are behavior-neutral |
| Research | 6/20 | Measured; merge list awaits fact-check |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Merge verdicts are recorded above.
- Migrating the Obsidian plugin repo's own tests into a `tests/` tree is outside this workspace and needs its own packet in that repo.
<!-- /ANCHOR:questions -->

---
