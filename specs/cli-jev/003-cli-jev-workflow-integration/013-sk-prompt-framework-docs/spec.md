---
title: "Feature Specification: Phase 13: sk-prompt framework docs"
description: "sk-prompt promises seven frameworks while its framework registry holds five ids without saying why, and every run reads all 36,580 bytes of patterns-evaluation.md to use one framework. This phase states the registry's scope in the registry and tells the skill to read only the sections a run needs."
trigger_phrases:
  - "sk-prompt framework docs"
  - "sk-prompt 7 against 5 frameworks"
  - "framework-registry subset of seven"
  - "patterns-evaluation section read"
  - "sk-prompt read only chosen framework"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 13: sk-prompt framework docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 17 |
| **Predecessor** | 012-sk-doc-validator-and-reference-fixes |
| **Successor** | 014-sk-design-doc-and-routing-check |
| **Handoff Criteria** | The registry's `description` names CRISPE and CRAFT as frameworks without a scaffold, `SKILL.md` names the three sections a run reads, the largest section read is 9,686 bytes against 36,580 for the whole file, and the sk-doc validators, the card sync guard and the sweep foundation test all pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Owner fixes and follow-ups found during the classifier research specification. The source is the round-3 synthesis, `../007-classifier-deep-research/research/research.md` section 7 ("E: sk-prompt"), its What Not To Build rows 89 and 90 and its citation ledger rows 113 to 117. The research dropped any classifier for sk-prompt and sent two docs fixes to the skill's owner. This phase plans those two fixes.

**Scope Boundary**: Two docs fixes in the `sk-prompt` skill: one sentence of scope in `assets/framework-registry.json` and a section-read rule in `SKILL.md`. No framework is added or removed, `references/patterns-evaluation.md` is not edited and no model is called.

**Dependencies**:
- None blocking. The sibling phase 012 changes the sk-doc validators this phase runs as regression checks, so the build reruns them after 012 lands if 012 lands first

**Deliverables**:
- A registry `description` that says the registry holds code-task benchmark scaffolds for five of the skill's seven frameworks
- A `SKILL.md` rule, in the resource loading section and in the agent rules, to read `patterns-evaluation.md` by section
- A before-and-after byte measurement recorded in `implementation-summary.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt/SKILL.md` promises seven frameworks (lines 3, 12 and 38, rechecked 2026-09-27), and its selection matrix routes to CRISPE and CRAFT (lines 313 and 315). `assets/framework-registry.json` holds five ids, `rcaf`, `race`, `cidi`, `tidd-ec` and `costar`, and its own `description` calls it a "Machine-readable registry of prompt-engineering frameworks", so a reader of the registry cannot tell that five is a deliberate subset. The research read it as an unsettled label set. Separately, a run that loads `references/patterns-evaluation.md` reads all 36,580 bytes of it (measured 2026-09-27), although the run applies one framework and the file's per-framework deep dives take 10,757 of those bytes.

### Purpose
The registry states its own scope, and a run reads only the selection section, the chosen framework's deep dive and the CLEAR section of `patterns-evaluation.md`, at most 9,686 bytes instead of 36,580.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reconcile 7 against 5 by keeping seven frameworks and stating the registry's scope in the registry's `description`. Direction and reasons are decision D1 in `goal.md`, from these owner sources: `patterns-evaluation.md` section 2 and section 3 define all seven, `assets/cli-prompt-quality-card.md` lines 40 and 41 list CRISPE and CRAFT, `README.md` line 214 calls `patterns-evaluation.md` "The seven framework definitions" and line 216 already calls the registry "code-oriented slot templates for a subset of five frameworks". Every registry entry carries `"applies_to": ["code"]`, its only runtime reader is the model-benchmark sweep (`system-deep-loop/deep-improvement/scripts/model-benchmark/sweep-benchmark.cjs` lines 45 to 48) and that sweep's test pins exactly the five ids (`tests/sweep-foundation.vitest.ts` lines 37 and 43 to 45)
- Tell the skill to read `patterns-evaluation.md` by section: `## 2. FRAMEWORK LIBRARY & SELECTION`, the chosen framework's `###` subsection under `## 3. FRAMEWORK DEEP DIVES` and `## 10. CLEAR EVALUATION MASTERY`. The full file stays available on the router's existing on-demand keywords
- Put the same rule in the agent rules of `SKILL.md` section 7, because `@prompt-improver` reads `SKILL.md` before composing (`.skilled/agents/prompt-improver.md` line 181) and the prompt-improver dispatches are the counted use
- A before-and-after byte measurement of what a run reads
- A changelog entry, because the owner records docs changes in `changelog/` (commits `86e99e7fc1` and `239bc805db` both touched `changelog/v3.0.1.0.md`)

### Out of Scope
- Adding CRISPE and CRAFT entries to the registry: they would need code-task templates for frameworks whose "Best For" is strategy and planning, and the sweep test that pins five ids belongs to `system-deep-loop`
- Removing CRISPE and CRAFT from the prose: the selection matrix, the quality card and the agent all route to seven
- Splitting `patterns-evaluation.md` into per-framework files: it would change the leaf manifest, aliases, graph metadata and playbook pointers for a saving the section-read rule already gets
- Trimming `references/depth-framework.md` (21,817 bytes), which a `$improve` run also loads: the research's 59,661-byte figure left it out, and this phase does not add it to scope. It is logged as a finding for the owner
- A classifier or picker over the frameworks and a CLEAR classifier: dropped by research rows 89 and 90
- Any model call, including a live `/prompt:improve` run

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-prompt/assets/framework-registry.json` | Modify | Rewrite the top-level `description` string only: five code-task scaffolds of the skill's seven frameworks, CRISPE and CRAFT without one, `references/patterns-evaluation.md` as the source of the framework set. Entries and ids unchanged |
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | Add the section-read rule under `### Resource Loading Levels` (section 2) and amend the `patterns-evaluation.md` bullet in `### Deterministic Agent Rules` (section 7) |
| `.skilled/skills/sk-prompt/changelog/` | Modify or Create | One entry for this change, in the file and version the owner's changelog convention picks |

All three paths belong to `sk-prompt`, a standalone skill since the completed packet `specs/sk-prompt/008-sk-prompt-standalone-conversion` (its `leaf-manifest.config.json` note: "sk-prompt is a normal skill (no mode-registry.json)"). The build follows the owner's `SKILL.md`, the sk-doc skill standards and the changelog convention. Read-only consumers that must keep passing: the model-benchmark sweep and its test (owner `system-deep-loop`) and `check-prompt-quality-card-sync.sh` (owner `system-skill-advisor`).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Registry scope stated: the registry's `description` says it holds code-task benchmark scaffolds for five of the skill's seven frameworks, names CRISPE and CRAFT as having no scaffold and names `references/patterns-evaluation.md` as the source of the framework set. The five ids and every entry stay byte-identical, and the seven-framework prose in `SKILL.md` stays |
| REQ-002 | Section-read rule: `SKILL.md` tells a run to read `patterns-evaluation.md` by its three headings `## 2. FRAMEWORK LIBRARY & SELECTION`, the chosen framework's subsection of `## 3. FRAMEWORK DEEP DIVES` and `## 10. CLEAR EVALUATION MASTERY`, both in the resource loading section and in the agent rules. A switch of framework mid-run reads the new framework's subsection. The existing on-demand keywords still load the whole file |
| REQ-004 | No regression: `validate_document.py` on `SKILL.md` prints `VALID`, `quick_validate.py` on the skill exits 0, the card sync guard prints `GUARD PASS` and the sweep foundation test exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Byte measurement: `implementation-summary.md` records the before read (SKILL.md 23,081 plus `patterns-evaluation.md` 36,580, 59,661 bytes) and the after read for the smallest and largest framework (TIDD-EC and CRAFT), from the `sed` range counts in `plan.md` |
| REQ-005 | Owner changelog: one changelog entry under `sk-prompt/changelog/` describes both changes, and no other `sk-prompt` file changes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The registry's `description` mentions CRISPE and CRAFT, and its ids still print `rcaf,race,cidi,tidd-ec,costar`.
- **SC-002**: The largest section read of `patterns-evaluation.md` (CRAFT) is 9,686 bytes against 36,580 for the whole file, and `SKILL.md` stays at or under 24,000 bytes, so a run reads at most 34,000 bytes of the two files against 59,661 before.
- **SC-003**: The four regression checks in REQ-004 pass from the final state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 012 changes `validate_document.py` and `quick_validate.py` | If 012 lands first, a check that passes today (both print valid on 2026-09-27) may report a new finding on `SKILL.md` | Rerun both validators after 012 lands and fix a new finding in `SKILL.md` within this phase's two files |
| Risk | A model ignores the section-read rule and reads the whole file | Low: the byte saving is lost for that run, nothing breaks | The rule names the literal headings so a reader can find them with `grep -n`. The measurement proves the read set's size, not that a model obeys it. D1 of the parent bars a live run in this phase |
| Risk | The owner renames a heading the rule names | Med: the rule points at a heading that no longer exists | The build's check greps the three headings in `patterns-evaluation.md` and the same strings in `SKILL.md` |
| Risk | CLEAR scoring quality drops if section 10 is not enough | Low: section 10 holds the dimensions, rubrics and interdependencies, and `depth-framework.md` keeps the floors | The owner can widen the read set later. The rule keeps the on-demand full read |
| Risk | Collision with in-flight sk-prompt work | Low: no open work found | `git log -5 -- .skilled/skills/sk-prompt` shows `ee5852eae6` (2026-09-26, changelogs), `86e99e7fc1` and `239bc805db` (2026-09-24). `HEAD..main` holds no sk-prompt commit and the working tree has no sk-prompt change (checked 2026-09-27). The build rechecks both |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A run that loads `patterns-evaluation.md` reads at most 9,686 bytes of it (CRAFT, the largest deep dive), against 36,580 today.
- **NFR-P02**: `SKILL.md` grows by at most 919 bytes, from 23,081 to at most 24,000.

### Security
- **NFR-S01**: No secret, key or `.env` value enters either file.
- **NFR-S02**: No model call and no network call is part of the build or its checks.

### Reliability
- **NFR-R01**: The registry's five ids and entries stay byte-identical, so the sweep and its pinned test are unaffected.
- **NFR-R02**: Every playbook scenario keeps working, because each of the 23 that cite `patterns-evaluation.md` greps or opens it by path and the file does not change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a `$raw` run loads nothing (`SKILL.md` router, `RAW` maps to an empty list), so the rule never applies to it.
- Maximum length: the largest read set is CRAFT, 9,686 bytes. The smallest is TIDD-EC, 7,554 bytes.
- Invalid format: a framework name that matches no subsection heading falls back to reading all of section 3.

### Error Scenarios
- External service failure: none. The fix is two text edits with no service.
- Network timeout: none. No network call is involved.
- Concurrent access: another session editing `SKILL.md` at build time. The build rechecks `git status` and `git log` on the skill before its first edit.

### State Transitions
- Partial completion: the two edits are independent. If one passes its checks and the other does not, revert only the failing file.
- Session expiry: not applicable. The change is static text.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | Two files plus one changelog entry, under 30 changed lines |
| Risk | 3/25 | Docs only. Two read-only consumers checked by existing tests |
| Research | 4/20 | Direction settled from the owner's own sources, sections measured |
| **Total** | **11/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should the owner trim `references/depth-framework.md` (21,817 bytes) the same way? A `$improve` run loads it as `DEFAULT_RESOURCE`, so a full run reads 81,478 bytes today, not the research's 59,661. This phase does not decide it.
- Should `SWEEP.md` line 31 ("The 5 frameworks as data") say "5 of sk-prompt's 7"? It belongs to `system-deep-loop` and is accurate for the sweep, so this phase leaves it.
<!-- /ANCHOR:questions -->

---

