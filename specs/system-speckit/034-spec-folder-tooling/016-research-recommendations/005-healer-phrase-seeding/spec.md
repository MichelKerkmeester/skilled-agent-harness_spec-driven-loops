---
title: "Feature Specification: Phase 5: healer-phrase-seeding"
description: "Stop the upgrade path from writing trigger phrases that phrase-judge rejects: heal-spec-docs refills empty lists from the slug seeder and inferTriggerPhrases emits only admissible phrases."
trigger_phrases:
  - "healer phrase seeding"
  - "phase 5 healer phrase seeding"
  - "stop healer writing rejected phrases"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: healer-phrase-seeding

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 16 |
| **Predecessor** | 004-trigger-index-rebuild-hardening |
| **Successor** | 006-evidence-gated-provenance |
| **Handoff Criteria** | Upgrade output never graded template-default by phrase-judge. Tests pass. Artifact prepared before SH-08 lands. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`heal-spec-docs.cjs` at line 45 defines `TEMPLATE_DEFAULTS`, placeholder trigger phrases from the plan.md, tasks.md and implementation-summary.md templates per document class. When it refills an empty trigger_phrases list, it uses these exact phrases. However, `phrase-judge.mjs` at line 121 grades these same phrases as `template-default`, a negative class meaning they name no topic. The upgrade path runs heal-spec-docs with --apply at line 394 of `upgrade-legacy.mjs`, so old packets with empty lists emerge from the upgrade carrying rejected phrases. This contradicts the target that healers must never write phrases the judge rejects.

Evidence: Section 5.6 of the research, verified at .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:45, .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs:121, .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:392.

A second producer sits in the same pipeline. `upgrade-legacy.mjs` runs its fill-frontmatter step before the healer, and for a document with no `trigger_phrases` key that step calls `inferTriggerPhrases` in `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts:985`. It writes single title tokens (line 1000) and falls back to `memory`, `indexing` and `context` (line 1020), which the judge grades `single-token`, `generic-workflow-word` and `editor-fallback`.

### Purpose
Ensure the upgrade path never writes a trigger phrase that phrase-judge grades in any negative class, so the rule "healers never write what the checker rejects" holds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `TEMPLATE_DEFAULTS` from heal-spec-docs.cjs
- Refill an empty trigger_phrases list with the exact output of `seededPhrases` in `template-phrase-cleanup.mjs`, the same seeder `create.sh` mirrors
- Make `inferTriggerPhrases` in frontmatter-migration.ts emit no phrase that phrase-judge grades in a negative class
- Add a test to upgrade-legacy.vitest.ts that the upgrade writes no phrase in any negative judge class
- Pin heal-spec-docs output to the seeder output in a test
- Give the compiled build a loadable import path to phrase-judge, because `inferTriggerPhrases` now calls the judge (package export plus type declarations)

### Out of Scope
- Reconstructing documents with missing trigger phrases
- Changing phrase-judge itself
- Changing which phrases templates define

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Delete TEMPLATE_DEFAULTS, refill empty lists from the slug seeder |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/template-phrase-cleanup.mjs` | Modify | Export `seededPhrases` so the healer can call it |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/frontmatter-migration.ts` | Modify | `inferTriggerPhrases` emits no negative-class phrase |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-root-numbering.vitest.ts` | Modify | Pin heal-spec-docs refill output to the seeder output |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Assert the upgrade writes no phrase in any negative judge class |
| `.skilled/skills/system-spec-kit/runtime/package.json` | Modify | Export `./cli/retrieval/lib/phrase-judge.mjs`, because the compiled build could not load a relative `.mjs` import of the judge |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/phrase-judge.d.mts` | Create | Type declarations for `judgeTriggerPhrase`, so the TypeScript import of the build-free judge typechecks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `TEMPLATE_DEFAULTS` is deleted, and heal-spec-docs.cjs writes none of its phrases to any document |
| REQ-002 | `upgrade-legacy --apply` writes no trigger phrase that phrase-judge grades in any negative class |
| REQ-003 | heal-spec-docs refills an empty list with exactly the output of `seededPhrases`, pinned by a test |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `inferTriggerPhrases` in frontmatter-migration.ts emits no phrase that phrase-judge grades in a negative class |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: validate.sh --strict passes on this packet
- **SC-002**: New or modified tests in create-root-numbering.vitest.ts and upgrade-legacy.vitest.ts pass
- **SC-003**: Code diff shows TEMPLATE_DEFAULTS deleted and the healer calling the slug seeder
- **SC-004**: A healed or filled fixture carries no phrase in any negative judge class
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | SH-05 must land before SH-08 | External repo upgrade path cannot ship a healer that writes rejected phrases | Build both SH-05 and SH-06 before SH-08 |
| Risk | heal-spec-docs is CommonJS and the seeder is an ES module | The healer cannot import it directly | Load it with `require()`, which Node runs synchronously for an ES module with no top-level await, and pin the output in a test |
| Risk | A title yields no admissible phrase in `inferTriggerPhrases` | The field stays empty | Leave it empty so validation reports it and upgrade-legacy records it, rather than writing a rejected phrase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

## 10. OPEN QUESTIONS

None open. Decided 2026-10-08 by the operator:

- **Empty lists are refilled from the slug seeder.** heal-spec-docs writes the exact output of `seededPhrases` (`template-phrase-cleanup.mjs:125`), for example `<slug> plan`. The seeder is deterministic and its phrases pass the judge. It is the value `create.sh` and the Phase 12 cleanup already write. Recording the list as unknown was considered and rejected, because it leaves the document unfindable by its own phrases.
- **`TEMPLATE_DEFAULTS` is deleted, not pinned.** A list whose only use is writing rejected phrases has nothing worth pinning.
- **Scope widened to `inferTriggerPhrases`.** The fill-frontmatter step writes rejected phrases too, so this phase covers it, and the upgrade test checks every negative judge class, not only `template-default`.

Questions answered during the build:

- **The healer loads the seeder with `require()`, not dynamic `import()`.** `template-phrase-cleanup.mjs` guards its entry point with `isDirectRun` and has no top-level await, so Node loads it from CommonJS synchronously. The create-root-numbering case runs the real `heal-spec-docs.cjs` and compares its output to `seededPhrases`.
- **A title with no admissible phrase leaves the field empty.** `inferTriggerPhrases` now returns `undefined` when the judge rejects every candidate, which its `string[] | undefined` signature already allowed. The `memory`, `indexing`, `context` fallback is gone.
- **The compiled build needed an import path for the judge.** The first version imported `phrase-judge.mjs` by a relative path, which broke the compiled output with `ERR_MODULE_NOT_FOUND` for `dist/retrieval/lib/phrase-judge.mjs`, because the build holds no copy of that `.mjs` file. The orchestrator found it. The import is now `@spec-kit/runtime/cli/retrieval/lib/phrase-judge.mjs`, backed by a new export in `runtime/package.json` and a `phrase-judge.d.mts` type surface. That adds two files to Files to Change.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Compliance
- **NFR-C01**: Convention "judge cannot rewrite rejected phrases" must hold across all heal paths
- **NFR-C02**: Trigger phrase seeding must be consistent across all four sources: templates, judge, create.sh, heal-spec-docs

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Document States
- Document with an empty trigger_phrases list: refilled with the slug seeder output, never template defaults
- Old document with no trigger_phrases key: fill-frontmatter adds only phrases the judge admits, or leaves the field empty for validation to report
- Document with non-empty phrases: heal step skips, no change

### Upgrade Paths
- `upgrade-legacy --apply` with empty lists or missing keys: no written phrase falls in a negative judge class
- Second run of upgrade: idempotent, produces same output

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three source files and two tests, no schema changes |
| Risk | 5/25 | Low: syntax fix, guard already exists in phrase-judge |
| Research | 2/20 | Verified from codebase, no new investigation |
| **Total** | **15/70** | **Level 2 small** |
<!-- /ANCHOR:complexity -->

---


