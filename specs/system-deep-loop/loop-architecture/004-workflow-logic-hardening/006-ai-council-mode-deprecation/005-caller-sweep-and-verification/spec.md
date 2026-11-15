---
title: "Feature Specification: Phase 5: caller-sweep-and-verification"
description: "After the hub, the runtime and the advisor drop the council mode, other skills, hooks, plugins, CI filters and root docs still name the deep command and the mode packet. This child updates those callers, runs the vocabulary sweep against an allowlist and proves the whole phase on the final tree with both routing stages and every baseline gate."
trigger_phrases:
  - "caller sweep and verification"
  - "phase 5 caller sweep and verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: caller-sweep-and-verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-advisor-council-removal |
| **Successor** | None |
| **Handoff Criteria** | The phase parent closes when all five children print `RESULT: PASSED` under `validate.sh --recursive --strict`, the doc drift guard exits 0, the per-hub gate for `system-deep-loop` passes with two modes and no gate in `../scratch/gate-baseline.md` ends worse than its start value. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the ai-council mode deprecation, which retires `ai-council` as a `system-deep-loop` mode and keeps the council as a standalone agent.

**Scope Boundary**: Callers outside the hub, the runtime and the advisor: `system-spec-kit`, `cli-external-orchestration`, `sk-doc`, `sk-prompt`, `.skilled/hooks/`, `.skilled/bin/`, `.opencode/plugins/`, `.github/`, `.env.example`, root `README.md` and the index and playbook files, plus the final verification of the whole phase.

**Dependencies**:
- Child 004 is Complete, so the hub, the runtime and the advisor are at two modes.
- `../scratch/gate-baseline.md` and `../scratch/exceptions.md` from child 001.

**Deliverables**:
- No live file outside the allowlist names the deep council mode or command.
- Both routing stages replayed on the final tree for one council, one research and one review prompt.
- `../scratch/gate-baseline.md` with a final column for every gate, and no gate worse than its start value.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Files outside the three owning skills still name `/deep:ai-council` and the `deep-ai-council` packet: the Gate 3 classifier resume phrase, a dispatch guard comment, plugin guard fixtures, spec-kit tests of deleted packet scripts, CLI skill docs, `sk-doc` templates, CI path filters, two environment variables and the root README. A name search alone missed leftovers in the precedent removal, so the phase is not proven until a vocabulary sweep and both routing stages run on the final tree.

### Purpose
Nothing live outside the allowlist names the deep council mode, and the final tree passes both routing stages and every baseline gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command and its verbatim output:

```text
$ rg -l --hidden 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' . | wc -l; rg -l --hidden 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' -g '!.skilled/skills/system-deep-loop/**' -g '!.skilled/skills/system-skill-advisor/**' -g '!.skilled/commands/deep/**' . | wc -l
     276
      70
```

Run from the repository root at `81faa4614c` on 2026-11-14. 276 files outside `specs/`, changelogs and benchmark folders name the mode vocabulary. 70 of them sit outside the hub, the advisor and the deep command folder, and those 70 are the callers this child edits or allowlists.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the `/deep:ai-council` resume phrase in the Gate 3 classifier with `/speckit:ai-council`, reword the dispatch guard comment and drop the council mode from the plugin guard fixtures.
- Delete the spec-kit tests of removed packet scripts and the matrix script, and keep `multi-ai-council-validator.vitest.ts`.
- Update live docs, templates, allowlists, CI path filters, the two council environment variables, the root README and the index files, then regenerate the trigger index.
- Run the vocabulary sweep and both routing stages on the final tree.
- Rerun every gate in `../scratch/gate-baseline.md`, record the final column and validate the phase parent recursively.

### Out of Scope
- `ai-council/**` artifacts inside any spec folder - parent decision D5 protects them, and the validator tolerance test for them stays.
- Changelog files, dated benchmark reports, spec-copy test fixtures, `cite-drift-redirects.json` and CI ignore paths into archived specs - they record history and stay on the allowlist.
- The agent name `@ai-council` and the `ai-council/**` artifact path - both stay valid.
- Pushing or merging the branch - the operator decides that after the phase closes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` | Modify | Resume phrase names `/speckit:ai-council` |
| `.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`, `.opencode/plugins/tests/system-deep-loop-guard.test.cjs` | Modify | No deep council command or mode |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/` council tests of packet scripts, `test-council-matrix.sh` | Delete | They test deleted scripts |
| Live docs in `cli-external-orchestration/`, `sk-doc/`, `sk-prompt/`, `.skilled/bin/`, `.skilled/skills/README.txt`, command readmes and doctor scenarios | Modify | No deep council command or mode |
| `.github/workflows/`, `.env.example`, `README.md` | Modify | Live path filters, two variables removed, council described as an agent |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its sidecar fixtures | Regenerate | No packet path |
| `../scratch/gate-baseline.md` | Modify | Final column for every gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids come from the requirement list this phase had before it was split, so a requirement keeps its id in the child that owns it. Ids from REQ-018 up were added at the split. A new requirement takes the highest REQ id across the five children plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-004 | D6 replay: for the prompt "convene an ai council to compare three migration plans", `skill_advisor.py` prints no `"mode": "ai-council"`, `"mode": "research"` or `"mode": "review"` row, and `compiled-route.cjs --hub system-deep-loop` prints no `packetId` of `deep-ai-council`, `deep-research` or `deep-review`. |
| REQ-005 | D6 replay: "run a deep research loop on vector index tuning" still routes to mode `research` and "deep review this branch for release readiness" still routes to mode `review`, in both `skill_advisor.py` and `compiled-route.cjs --hub system-deep-loop`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-015 | Sweep: `rg -l --hidden 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' .` prints only files on the allowlist in `scratch/exceptions.md`. |
| REQ-016 | D5: `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing, and `plan.md` names the revert path for every deleted tracked file. |
| REQ-021 | Every gate in `../scratch/gate-baseline.md` has a start and a final value and no final value is worse than its start value, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` exits 0 with `"errors": []`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-002**: A council prompt reaches neither research nor review in either routing stage, and research and review prompts still route to their modes.
- **SC-011**: The vocabulary sweep prints only allowlisted paths and no gate ends worse than its baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Child 004 at Status Complete | The final replay and the gates would run against an advisor that still names the council. | The setup task T098 checks the status before any edit. |
| Risk | A name-based sweep misses council vocabulary, as the precedent found | Med: dead routing phrases survive in advisor boosters or hub metadata | The sweep searches vocabulary such as "planning council" and "council deliberation", not only names. |
| Risk | A history file is edited because it matched the sweep | Med: release history or a dated report is rewritten | The allowlist in `../scratch/exceptions.md` is written before any edit, and every listed path must exist. |
| Risk | A spec-folder council artifact changes during the phase | High: operator-owned history is altered | REQ-016 diffs `specs/**/ai-council/**` against the start SHA and must print nothing. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: this child edits callers and docs and adds no code path.

### Security
- **NFR-S01**: N/A: the Gate 3 classifier change replaces one command name in a resume phrase and changes no gate logic.

### Reliability
- **NFR-R01**: Every gate the baseline lists exits with the same or better status than at the start commit, with the start and final columns in `../scratch/gate-baseline.md`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a spec folder with no `ai-council/` folder still validates, and one with an old `ai-council/` tree still validates under `multi-ai-council-validator.vitest.ts`.
- Maximum input: the sweep covers every file the start inventory lists, and each one ends as edited, deleted or allowlisted.
- Failure path: a sweep hit that is neither on the allowlist nor a line naming the standalone agent keeps AC-015 Unmet and blocks the close.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 70 caller files across six skills, hooks, plugins, CI and root docs, plus the final gates. |
| Risk | 10/25 | Mostly docs and fixtures. One classifier phrase and one hook comment are code. |
| Research | 8/20 | Each sweep hit needs a keep, edit or allowlist call. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
