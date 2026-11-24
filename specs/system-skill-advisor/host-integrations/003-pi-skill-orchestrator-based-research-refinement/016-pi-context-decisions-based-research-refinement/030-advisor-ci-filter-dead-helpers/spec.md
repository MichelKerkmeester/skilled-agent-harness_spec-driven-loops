---
title: "Feature Specification: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers"
description: "The advisor test suite never runs in CI when a change touches only the advisor hooks, and four advisor helpers ship with no production caller while docs and one test describe them as live. This packet widens the CI path filter and deletes the dead helpers with their tests and doc rows."
trigger_phrases:
  - "advisor ci filter dead helpers"
  - "run the advisor suite on hook only changes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Run the advisor suite on hook-only changes and delete the production-dead advisor helpers

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/537-advisor-ci-filter-dead-helpers` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The workflow that runs the advisor test suite, `.github/workflows/skill-advisor-stress.yml`, filters on `runtime/**`, the launcher and the OpenCode plugin, but not on `system-skill-advisor/hooks/**`. A change to `hooks/pi/prompt-advisor.ts` alone therefore never runs the Pi budget parity test that guards it. Separately, `lib/compat/redirect-metadata.ts`, `sanitizeEnvelopeSkillLabel`, `filterDefaultRoutable` and `rollbackDerivedBlock` have no production caller, yet `runtime/config/README.md:72` and the route-exclusions test call `filterDefaultRoutable` a wired filter.

### Purpose
A hooks-only change runs the advisor suite in CI, and no advisor code or doc names a helper that production never calls.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg 'system-skill-advisor/hooks' .github/workflows
(no output, exit 1)

$ rg -n "renderRedirectMetadata|renderRecommendationRedirectMetadata|sanitizeEnvelopeSkillLabel|filterDefaultRoutable|rollbackDerivedBlock|compat/redirect-metadata" \
    .skilled/skills/system-skill-advisor/runtime .skilled/skills/system-skill-advisor/hooks \
    -g '!**/tests/**' -g '!**/stress-test/**' -g '!**/dist/**' -g '!**/node_modules/**' -g '!*.md'
runtime/lib/compat/redirect-metadata.ts:5:import { sanitizeEnvelopeSkillLabel } from '../derived/sanitizer.js';
runtime/lib/compat/redirect-metadata.ts:31:  return sanitizeEnvelopeSkillLabel(value ?? '') ?? null;
runtime/lib/compat/redirect-metadata.ts:41:export function renderRedirectMetadata(input: RedirectMetadataInput): PromptSafeRedirectMetadata {
runtime/lib/compat/redirect-metadata.ts:76:export function renderRecommendationRedirectMetadata(input: RedirectMetadataInput): PromptSafeRedirectMetadata {
runtime/lib/compat/redirect-metadata.ts:77:  return renderRedirectMetadata(input);
runtime/lib/derived/sanitizer.ts:90:export function sanitizeEnvelopeSkillLabel(value: string): string | null {
runtime/lib/lifecycle/rollback.ts:20:export function rollbackDerivedBlock(metadata: Record<string, unknown>): RollbackResult {
runtime/lib/lifecycle/archive-handling.ts:46:export function filterDefaultRoutable<T extends { sourcePath: string; skillId?: string }>(entries: readonly T[]): T[] {
```
Every hit is a definition or a use inside the dead module itself. No barrel re-exports them: `projection.ts` and `df-idf.ts` import other functions from `archive-handling.ts`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Add `.skilled/skills/system-skill-advisor/hooks/**` and `.opencode/skills/system-skill-advisor/hooks/**` to both path filters in `.github/workflows/skill-advisor-stress.yml`.
- Delete `lib/compat/redirect-metadata.ts` and `tests/compat/redirect-metadata.vitest.ts`.
- Delete `sanitizeEnvelopeSkillLabel`, `filterDefaultRoutable` and `lib/lifecycle/rollback.ts` (its only export is `rollbackDerivedBlock`), with the test assertions that exercise only them.
- Remove the doc rows and the NC-005 command argument that name the deleted code.

### Out of Scope
- Other advisor workflows - only `skill-advisor-stress.yml` runs the advisor default suite.
- The live sa-016 assertions on `filterCorpusStatEligible` and `routePolicyForPath` - they cover live code and stay.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/skill-advisor-stress.yml` | Modify | Add the two hooks globs to both filters |
| `.skilled/skills/system-skill-advisor/runtime/lib/compat/redirect-metadata.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/compat/redirect-metadata.vitest.ts` | Delete | Dead module and its only test |
| `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/rollback.ts` | Delete | Its only export has no production caller |
| `.skilled/skills/system-skill-advisor/runtime/lib/derived/sanitizer.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/archive-handling.ts` | Modify | Remove `sanitizeEnvelopeSkillLabel` and `filterDefaultRoutable` |
| `.skilled/skills/system-skill-advisor/runtime/tests/lifecycle-derived-metadata.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/route-exclusions.vitest.ts`, two stress files | Modify | Remove assertions on the deleted functions only |
| `.skilled/skills/system-skill-advisor/runtime/lib/compat/README.md`, `.skilled/skills/system-skill-advisor/runtime/tests/compat/README.md`, `.skilled/skills/system-skill-advisor/runtime/lib/lifecycle/README.md`, `.skilled/skills/system-skill-advisor/runtime/README.md`, `.skilled/skills/system-skill-advisor/runtime/config/README.md`, NC-005 playbook | Modify | Drop rows and arguments naming the deleted code |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both `paths` filters in `skill-advisor-stress.yml` match `.skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts`. |
| REQ-002 | `rg` for the five deleted symbols and `compat/redirect-metadata` over `.skilled`, `.opencode` and `.claude`, outside `specs/`, `dist/` and changelogs, prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | sa-016 still asserts the live `filterCorpusStatEligible` and `routePolicyForPath` results. |
| REQ-004 | The advisor typecheck, build, full suite, stress suite, catalog and playbook validators pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A diff touching only `hooks/pi/prompt-advisor.ts` matches the `skill-advisor-stress.yml` path filter.
- **SC-002**: The advisor runtime builds and tests green with the four helpers gone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | GitHub Actions path-filter globs | A wrong glob silently skips CI again | Check the globs with a local glob match against a hooks path |
| Risk | A hidden consumer of a deleted export | Med | Typecheck and the full suite run after the deletion; the caller scan above found none |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

N/A: this change runs no service. It deletes code and widens a CI filter.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
- Empty input: N/A, no runtime input changes.
- Maximum input: N/A.
- Failure path: a missed consumer fails `npm run typecheck` with a missing-export error, which blocks closure.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | About 14 files, mostly deletions and doc rows |
| Risk | 4/25 | No public API; the deleted exports have no production caller |
| Research | 4/20 | Caller scan done |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
- None.
<!-- /ANCHOR:questions -->

---


