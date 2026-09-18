---
title: "Feature Specification: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration"
description: "Close every finding the migration's deep review confirmed: select the source root by its sentinel file through one resolver per language, fix the seven live defects, fix the pre-existing ones and add the missing tests."
trigger_phrases:
  - "source root resolver"
  - "find source root function"
  - "deep review remediation source root"
  - "root assumption defect class"
  - "skilled migration review fixes"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-18 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-verification-and-rollout |
| **Successor** | None |
| **Handoff Criteria** | Every confirmed finding in `../review/review-report.md` is fixed or carries a recorded reason, the new tests pass, the whole gate shows no regression against the baseline, and the fix is pushed with CI watched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the skilled source-root migration specification.

**Scope Boundary**: The findings in `../review/review-report.md` and `../review/findings-extracted.json`, plus whatever the re-run of review angle 10 confirms. No new design: the layout phases 004 to 011 shipped stays as it is.

**Dependencies**:
- Phase 011 shipped the migration at `073e9241e7`, which is the baseline for every regression claim here.
- The global git hooks point at the main checkout's `.skilled/scripts/git-hooks/`, so a hook fix governs commits only once the main checkout carries it.

**Deliverables**:
- One source-root selection per language: `findSourceRoot` in the shared JavaScript resolver, and one sentinel block shared byte for byte by every shell hook, with a test that holds them to it.
- Every caller the review named moved onto that selection.
- The seven live defects, the two pre-existing ones and the four coverage gaps closed.
- Angle 10 re-run and its confirmed findings triaged.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review of the move from `.opencode` to `.skilled` returned verdict CONDITIONAL with 26 distinct findings. Nearly half are one defect: code that picks between `.skilled` and `.opencode` by assuming which name is real, and so breaks in any checkout carrying only one of them. Five instances were fixed by hand during the migration and one of those fixes reintroduced the defect, because each was written from scratch with its own guess.

### Purpose
Every caller that needs the source tree asks one resolver, which recognises the tree by the file `skills/system-spec-kit/SKILL.md` under `.skilled` first and `.opencode` second, and every other confirmed finding is closed with evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **The resolver class** (report §3, §5, §8): `DR-001` follow-through, `HOOK-001`, `HOOK-003`, `HOOK-004`, `HOOK-005`, `GATE-001`, `GATE-002`, `INSTALL-001`, `GEN-001`, `CONSUMER-001`, `CONSUMER-002`.
- **Live defects** (report §4): `CI-001`, `RETIRE-001`, `REF-002`, `COMPAT-002`, `REF-001`, `CI-003`, `RETIRE-003`.
- **Pre-existing** (report §6): `RETIRE-004` with its duplicate `COV-005`, and `CI-002`.
- **Coverage gaps** (report §8): `COV-001`, `COV-002`, `COV-004`.
- **Angle 10**, documentation truthfulness, re-run on the same executor, with each confirmed finding fixed or recorded.
- **Operator-approved additions** (2026-09-18): the 47 broken links and 3 frontmatter violations that fail the two guards `CI-002` moved onto push, and the stale 77-binding pin that kept Spec-Kit Check red. Neither was a review finding.

### Out of Scope
- `HOOK-002` - disproved: the path it names resolves and every migration commit passed that hook.
- `COMPAT-001` - stale: written before the plugins moved into `.opencode/`.
- `RETIRE-002` - by design: changelogs are frozen records.
- Plugin log paths spelled `.skilled/logs` relative to the session directory (`mcp-route-guard.js:33`, `sk-code-post-edit-quality.js:33`, `system-dist-freshness-guard.js:35`) - they write logs rather than read the tree, and none was reported. Recorded as adjacent.
- Hint text in hook messages that names `.opencode/...` for a human to run - it works in every supported layout today and was not reported.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/shared/workspace/repo-root.mjs` | Modify | Add `SOURCE_ROOT_SENTINEL` and `findSourceRoot` |
| `.skilled/skills/system-spec-kit/shared/workspace/repo-root.d.mts` | Modify | Type the new exports |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs` | Modify | Re-export the new exports |
| `.skilled/scripts/git-hooks/{pre-commit,pre-push,post-commit,post-merge,post-rewrite,prepare-commit-msg}` | Modify | Select `SOURCE_ROOT` by sentinel. Build every tree path from it |
| `.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh` | Modify | Write its alert log under the selected root |
| `.skilled/hooks/git/pre-commit`, `.skilled/hooks/git/install-hooks.sh` | Modify | Same selection |
| `.skilled/bin/check-git-hooks.sh` | Modify | Same selection for source, flags and self-heal |
| `.skilled/scripts/install-git-hooks.sh` | Modify | Replace the directory-exists test with the sentinel |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | Create | Hold every copy of the block identical, forbid a root named directly, and prove selection across four layouts |
| `.github/scripts/check-gate-inputs.sh` | Modify | Treat both root names alike in every input branch |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Modify | Missing `.skilled` input fixtures |
| `.github/workflows/gate-inputs.yml` | Modify | Run the hook suites through the root that exists |
| `.github/workflows/spec-kit-check.yml` | Modify | Trigger on `.skilled/package.json` and its lockfile |
| `.github/workflows/{markdown-link-integrity,repo-rules-corpus,rule-canary-sync,skill-doc-frontmatter,playbook-operator-contract,runtime-no-spec-import}.yml` | Modify | Push coverage for `main` and `skilled/**` |
| `.github/workflows/README.md` | Modify | Drop the absent workflows. Correct the push matrix |
| `.skilled/bin/install-codex-hooks.mjs` and its tests | Modify | Rewrite `.skilled/` command paths to the selected root |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`, `generate-trigger-index.mjs` and tests | Modify | Derive corpus roots from the selected root. Refuse without one |
| `.opencode/plugins/{cli-dispatch-audit,sk-git-preflight-advisory,codex-hooks-watchdog,system-skill-advisor}.js` | Modify | Read the tree through the selected root |
| `.skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh` | Modify | Help text names `install.sh` |
| `.skilled/skills/sk-doc/README.md` | Modify | Point at the real flowchart validator |
| `.opencode/SYNC.md`, `PUBLIC-RELEASE.md` | Modify | State what is true of the directory now |
| Three `INSTALL-GUIDE.md` files (mobbin, refero, md-generator) | Modify | Add the sections the validator requires |
| New tests for `RETIRE-003`, `COV-001`, `COV-002`, `COV-004`, `COV-005` | Create | Each fails for the one reason its finding names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No change blocks a commit or push that passes today: the hook suites, the gate-input suite and a real commit through the changed hooks all pass. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | `findSourceRoot(repoRoot)` returns the first of `.skilled`, `.opencode` holding `skills/system-spec-kit/SKILL.md`, or null. A directory without that file never wins. |
| REQ-003 | Every git hook, `check-git-hooks.sh` and both hook installers build tree paths only from a `SOURCE_ROOT` chosen by the sentinel, and a test fails if one names a root directly or its selection block drifts (`HOOK-001`, `HOOK-003`, `HOOK-004`, `HOOK-005`). |
| REQ-004 | The gate-input parser treats `.skilled` and `.opencode` alike in the variable-path, assignment and quoted-command branches, proven by a missing-`.skilled`-input fixture that fails the gate (`GATE-001`). |
| REQ-005 | `gate-inputs.yml` runs the hook suites in a checkout that carries only one root name (`GATE-002`). |
| REQ-006 | The Codex installer writes commands that resolve in a checkout whose only root is `.opencode` (`INSTALL-001`). |
| REQ-007 | The trigger-index generator walks the selected root and refuses to publish when there is none (`GEN-001`). |
| REQ-008 | The dispatch-audit rules, the git preflight advisory and the Codex watchdog read the tree through the selected root (`CONSUMER-001`). |
| REQ-009 | `spec-kit-check.yml` triggers on `.skilled/package.json` and `.skilled/package-lock.json` (`CI-001`). |
| REQ-010 | The Chrome DevTools installer help names only files that exist (`RETIRE-001`). |
| REQ-011 | `sk-doc/README.md` names the flowchart validator at its real path (`REF-002`). |
| REQ-012 | The three install guides pass the validator, and a corpus test validates every `INSTALL-GUIDE.md` (`RETIRE-004`, `COV-005`). |
| REQ-013 | The six guard workflows also run on pushes to `main` and `skilled/**`, or record why one cannot, and the workflows README states the real matrix (`CI-002`). |
| REQ-014 | Tests cover the per-entry compatibility layout (`COV-001`) and the two migrated installers (`COV-002`). |
| REQ-015 | Angle 10 is re-run on GPT-5.6 Luna, and each finding it returns is verified, then fixed or recorded with a reason. |

### P2 - Optional

| ID | Requirement |
|----|-------------|
| REQ-016 | The advisor signature hashes the selected root and is not cached when neither root exists (`CONSUMER-002`). |
| REQ-017 | `.opencode/SYNC.md` (`COMPAT-002`), `PUBLIC-RELEASE.md` (`REF-001`) and the workflows README (`CI-003`) describe only what exists. |
| REQ-018 | A check fails when the two `_utils.sh` copies differ (`RETIRE-003`). |
| REQ-019 | A negative contract test fails if the retired install-guide authoring mode returns (`COV-004`). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A checkout carrying only `.skilled`, and one carrying only `.opencode`, both pass the new selection test for every hook.
- **SC-002**: Every finding id in the report maps to a met, recorded or out-of-scope row, none left silent.
- **SC-003**: The whole local gate, rerun at the fix SHA, shows no new failure against the `073e9241e7` baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The hooks are global, so a hook error blocks commits in every repository on this machine | High | Selection adds no sourced file and no new failure path. Each hook is run on real commits before the main checkout takes it |
| Risk | A path swapped to `SOURCE_ROOT` in a gate the tests do not cover | Med | The selection test forbids any root named directly, so a missed path fails the suite |
| Dependency | Angle 10 needs the Luna executor through `cli-codex` | Med | If the executor is unavailable the requirement is reported blocked, not replaced by another model |
| Risk | Adding push triggers runs more CI on release pushes | Low | Path filters stay. The change is one trigger block per workflow |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Root selection adds at most two file tests per hook run.
- **NFR-P02**: No new process spawn in any hook's common path.

### Security
- **NFR-S01**: No private home-derived path enters a tracked file.
- **NFR-S02**: No gate bypass variable is used to land any change.

### Reliability
- **NFR-R01**: Outside a toolchain repository every hook behaves exactly as before.
- **NFR-R02**: A missing root is reported, never silently treated as success.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Both roots carry the sentinel (today's layout): `.skilled` wins.
- `.skilled` exists as an empty placeholder directory: `.opencode` wins, the case that broke `DR-001`.
- Neither carries it: the caller treats the repository as not a toolchain checkout.

### Error Scenarios
- A gate script is missing under the selected root: the hook reports it as it does today.
- The Codex installer runs where `.skilled` is absent: commands are written under `.opencode`.

### State Transitions
- A partial fix landed on the branch but not in the main checkout: commits still use the old hooks until the fast-forward.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 40 files across hooks, CI, plugins, generators and docs |
| Risk | 15/25 | Global hooks and CI triggers are shared contracts |
| Research | 6/20 | The review already located each defect |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None open. Findings that angle 10 returns are triaged under REQ-015.
<!-- /ANCHOR:questions -->

---
