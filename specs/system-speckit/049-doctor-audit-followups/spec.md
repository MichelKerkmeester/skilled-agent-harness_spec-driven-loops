---
title: "Feature Specification: Fix the spec-kit defects the doctor command audit recorded"
description: "Plan the repair of the subsystem defects that the doctor command audit recorded and deliberately did not fix, as three independent phases over the retrieval lane, the release updater and the doctor's own gates."
trigger_phrases:
  - "doctor audit followups"
  - "trigger index freshness"
  - "release update signals"
  - "doctor gates drift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Fix the spec-kit defects the doctor command audit recorded

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-03 |
| **Branch** | `worktrees/079-doctor-command-audit` |
| **Parent Spec** | None (top-level packet) |
| **Parent Packet** | None (top-level packet) |
| **Predecessor** | `system-speckit/048-doctor-command-audit` |
| **Successor** | None |
| **Handoff Criteria** | Every child phase closes with its acceptance criteria Met, Waived or Superseded, and `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The doctor command audit (packet 048) inspected every doctor target against the current checkout and applied its verdicts, but it deliberately recorded the defects it found in the subsystems the doctors inspect instead of fixing them. Those defects now span three areas. The committed trigger index is stale and the retrieval lane's own documents describe paths and classes that no longer exist. The release-aware update engine cannot tell a locally regenerated file from an authored customization, and three of its policy questions were left open. The doctor's gates pass while covering less than they claim: the mutation-class guard reads a manifest that no longer lists three MCP skills, three test fixtures cannot load their shared module, and several tooling texts and counts are wrong. None of this blocks a running system, and all of it silently degrades what the doctors report.

### Purpose
Plan the recorded defects as three independently executable phases, each starting from the finding that recorded it, re-checked against the current tree and paired with the exact command that detected it. The outcome is a build-ready plan for a later session: a fresh index, an update engine that distinguishes generated from authored files, and doctor gates whose coverage and text match the system they inspect.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seven recorded findings and two "Other limitations" items from `048/013-speckit-retrieval` that concern the retrieval lane, including the stale committed index and the unreachable `folder-token-fallback` class.
- The five questions and defects recorded for the release-aware updater in `048/003-update` (research section 12, `scratch/design.md`, limitations 1 and 3), including generated-file classification and the `provenance_fingerprint` hash input.
- The gate, fixture and text defects recorded across `048` phases 001, 005, 006, 007, 009, 011 and 014, plus two corrections to the closed audit packet's own documents.

### Out of Scope
- Re-running the doctor audit or re-auditing targets that recorded no defect.
- Changing an audit verdict rather than applying it.
- Implementing any phase: this packet plans; the later build executes.

### Files to Change
Summary table of files touched across all phases — for audit trail only; per-phase detail lives in each child's plan.md.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Regenerate | 001 | Commit a fresh index through `/doctor:rebuild` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` | Regenerate | 001 | The three generator-written sidecars |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | 001 | Pass per-document folder tokens to the phrase judge |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml` | Modify | 001 | Evidence-backed staleness probe; byte-identical proof owner |
| `.skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md` | Modify | 001 | Root-coverage row and ripgrep version pin |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md` | Modify | 001 | Remove the deleted-symlink claim |
| `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/acceptance-criteria.md` | Modify | 001 | Continuity paths point at the live tree |
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | 002 | Generated-file class, base recording, prerelease policy, apply without align |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | 002 | Cases for each engine change |
| `.skilled/commands/doctor/{update.md,assets/doctor-update-*.yaml}` | Modify | 002 | First-run base recording and policy text |
| `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | Modify | 003 | Read a guard-owned manifest |
| `.skilled/commands/doctor/assets/doctor-mcp-mutation-manifest.yaml` | Create | 003 | The guard's manifest, restored to four skills |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-*.test.cjs` | Modify | 003 | Fixture module resolution |
| `.skilled/commands/doctor/scripts/route-validate.py` | Modify | 003 | Verify workflow activities |
| `.skilled/commands/doctor/assets/doctor-rebuild-presentation.txt` | Modify | 003 | Skill-budget row text |
| `.skilled/commands/doctor/scripts/audit_descriptions.py` | Modify | 003 | Report title and Claude budget source |
| `.skilled/skills/sk-doc/{scripts,shared/scripts}/quick_validate.py` | Modify | 003 | Docstring packet label |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | 003 | Stated variable count |
| `.skilled/skills/system-spec-kit/runtime/cli/metrics/fable-baseline.json` | Modify | 003 | Dead corpus target |
| `.skilled/commands/doctor/assets/doctor-speckit-presentation.txt` | Modify | 003 | Generic `/doctor` forms |
| `specs/system-speckit/048-doctor-command-audit/{003-update/spec.md,013-speckit-retrieval/implementation-summary.md}` | Modify | 003 | Closed-packet corrections |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-trigger-index-freshness/ | Regenerate the committed trigger index and make its staleness, phrase-class and version claims match the system | Complete |
| 2 | 002-release-update-customization-signals/ | Teach the release updater generated-versus-authored files, base recording, and settle its prerelease and apply-only questions | Complete |
| 3 | 003-doctor-gates-and-drift/ | Restore the doctor gates' coverage, fix the failing fixtures, and align the doctor's own text and counts | Complete |
| 4 | 004-doctor-scripts-conformance/ | Bring every doctor script to the sk-code OpenCode standards, remove dead code and put each script under an automated test that CI runs | Complete |
| 5 | 005-doctor-update-research/ | Six iterations of deep research into whether `/doctor:update` and the release-update engine are complete and correct, ending in a ranked fix list | Complete |
| 6 | 006-doctor-update-fixes/ | Fix every finding and recommendation of the doctor-update research, reviewed first by a fresh Opus 5.5 and implemented by cli-codex gpt-6-luna at max on the fast tier | Complete |
| 7 | 007-speckit-router-contract-drift/ | Align the command contract with the merged speckit lifecycle workflows so the router generator check passes, the one check still failing when phase 006 closed | Complete |
| 8 | 008-doctor-ownership-split/ | Split `/doctor:speckit` by owner into `/doctor:skill-advisor`, `/doctor:deep-loop` and `/doctor:runtime-mirrors`, and delete `/doctor:rebuild` and the fable-mode target | Complete |
| 9 | 009-doctor-git/ | Add `/doctor:git`: switch the shipped hook gates on or off in git config, and change the commit, PR and branch rules in the repository's own `.sk-git/` copies | Complete |
| 10 | 010-doctor-router-gates/ | Add the mandatory input gate to `/doctor:skill-advisor` and `/doctor:mcp`, and stop the structure extractor flagging comma-form `allowed-tools` in commands | Complete |
| 11 | 011-changelog-v4003-research/ | Research what the v4.0.0.3 release notes still need about the doctor command changes and the git hook work | Complete |
| 12 | 012-changelog-v4003-update/ | Apply the checked findings to the v4.0.0.3 release notes | Complete |
| 13 | 013-doctor-docs-and-ci-fix/ | Fix the doctor CI install and point the README and targeted skills at the doctor commands | Complete |
| 14 | 014-doctor-playbook-spec-kit/ | Manual test scenarios for `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env` and `/doctor:update` in the system-spec-kit playbook | Complete |
| 15 | 015-doctor-playbook-skill-advisor/ | Manual test scenarios for every `/doctor:skill-advisor` target in the system-skill-advisor playbook | Complete |
| 16 | 016-doctor-playbook-deep-loop/ | Manual test scenarios for `/doctor:deep-loop` in the system-deep-loop playbook | Complete |
| 17 | 017-doctor-playbook-git/ | Manual test scenarios for `/doctor:git` in the sk-git playbook | Complete |
| 18 | 018-doctor-playbook-mcp/ | Manual test scenarios for `/doctor:mcp` in the mcp-code-mode playbook, plus the stale `--server` flag in the route manifest | Complete |
| 19 | 019-doctor-test-environment-research/ | Research the two doctor contract fixes and a long-lived local test environment for the doctor scenarios | Complete |
| 20 | 020-doctor-contract-fixes/ | Report phrase quality as an advisory in `/doctor:speckit`, align its status list, and add the `/doctor:mcp` unknown-flag error | Complete |
| 21 | 021-doctor-test-environments/ | Build the long-lived `/doctor:update` fixture and the current-code doctor environment as local worktrees | Complete |
| 22 | 022-doctor-playbook-environment-migration/ | Point the doctor scenarios at the two environments and add the environment scenario | Complete |
| 23 | 023-release-update-symlink-parent/ | Report a release path below a local symlink as a `symlink-parent` conflict in `/doctor:update` instead of aborting, and drop the fixture workaround | Complete |
| 24 | 024-doctor-docs-alignment/ | Align the root and skill READMEs with the doctor commands and bring the v4.0.0.3 changelog up to date | Complete |
| 25 | 025-doctor-scenario-runs/ | Run all 36 doctor scenarios with DeepSeek in the two environments and record the results | Complete |
| 26 | 026-doctor-run-followups/ | Turn the red sk-doc script test green and stamp the sanitizer version on the curated skill metadata that passes the sanitizer unchanged | Complete |
| 27 | 027-derived-sanitizer-instruction-shape/ | Narrow the derived label sanitizer to instruction phrasing so every curated skill metadata block carries a truthful stamp | Complete |
| 28 | 028-advisor-stress-fixtures/ | Update the two skill-advisor stress tests whose fixtures predate code changes, so the stress suite passes | Complete |
| 29 | 029-main-ci-regenerations/ | Regenerate the derived files behind three red checks on main | Complete |
| 30 | 030-cursor-reconcile-test-exemption/ | Exempt the backgrounded reconcile hook in the Cursor parity assertion so Spec-Kit Check passes | Complete |
| 31 | 031-changelog-v4003-reality-check/ | Check every v4.0.0.3 changelog claim against the code and cover the specs shipped since v4.0.0.2 | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-trigger-index-freshness | 002-release-update-customization-signals | Phase 001's acceptance criteria are Met, Waived or Superseded, and the regenerated index reports fresh | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/001-trigger-index-freshness --strict` prints `RESULT: PASSED`, and `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check --json` exits 0 |
| 002-release-update-customization-signals | 003-doctor-gates-and-drift | Phase 002's acceptance criteria are Met, Waived or Superseded, and the engine suite passes | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/002-release-update-customization-signals --strict` prints `RESULT: PASSED`, and `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` reports `fail 0` |
| 003-doctor-gates-and-drift | 004-doctor-scripts-conformance | Phase 003's acceptance criteria are Met and the doctor gates exit 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/003-doctor-gates-and-drift --strict` prints `RESULT: PASSED` |
| 004-doctor-scripts-conformance | 005-doctor-update-research | Phase 004's acceptance criteria are Met and its commit is on the branch | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance --strict` prints `RESULT: PASSED` |
| 005-doctor-update-research | 006-doctor-update-fixes | `research/research.md` ranks every finding with a fix and a proving test, and phase 005 validates strict | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/005-doctor-update-research --strict` prints `RESULT: PASSED` |
| 006-doctor-update-fixes | 007-speckit-router-contract-drift | Phase 006's acceptance criteria are Met and the doctor suites pass | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/049-doctor-audit-followups/006-doctor-update-fixes --strict` prints `RESULT: PASSED`, and `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` exits 0 once phase 007 lands |
| 007-speckit-router-contract-drift | 008-doctor-ownership-split | Phase 007's acceptance criteria are Met and the router generator check passes | `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` exits 0, and `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 once phase 008 lands |
| 008-doctor-ownership-split | 009-doctor-git | Phase 008's acceptance criteria are Met and the route validator passes across the four routed commands | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0, and `bash .skilled/scripts/git-hooks/tests/gate-config.test.sh` passes once phase 009 lands |
| 009-doctor-git | 010-doctor-router-gates | Phase 009's acceptance criteria are Met and `/doctor:git` passes the shared command validators | `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0, and `python3 -m pytest .skilled/skills/sk-doc/scripts/tests/test_extract_structure_regressions.py` passes once phase 010 lands |
| 010-doctor-router-gates | 011-changelog-v4003-research | Phase 010's acceptance criteria are Met | `research/research.md` exists once phase 011 lands |
| 011-changelog-v4003-research | 012-changelog-v4003-update | `research/research.md` lists the checked findings | `validate_document.py` passes on the v4.0.0.3 entry once phase 012 lands |
| 012-changelog-v4003-update | 013-doctor-docs-and-ci-fix | The v4.0.0.3 entry covers the doctor commands | `run-all.sh` passes from a clean install and every edited doc validates |
| 013-doctor-docs-and-ci-fix | 014-doctor-playbook-spec-kit | The doctor CI job passes | The system-spec-kit playbook validator exits 0 once phase 014 lands |
| 014-doctor-playbook-spec-kit | 015-doctor-playbook-skill-advisor | The DOC- series and scenario shape are set | The skill-advisor playbook inventory test passes once phase 015 lands |
| 015-doctor-playbook-skill-advisor | 016-doctor-playbook-deep-loop | The skill-advisor scenarios are indexed | The deep-loop playbook and topology checks pass once phase 016 lands |
| 016-doctor-playbook-deep-loop | 017-doctor-playbook-git | The deep-loop scenarios are indexed | The sk-git playbook validator exits 0 once phase 017 lands |
| 017-doctor-playbook-git | 018-doctor-playbook-mcp | The git scenarios are indexed | `route-validate.sh` and the doctor suites pass once phase 018 lands |
| 018-doctor-playbook-mcp | 019-doctor-test-environment-research | The doctor scenarios exist in every owning playbook | `research/research.md` gives a cited plan for the fixes and the environment |
| 019-doctor-test-environment-research | 020-doctor-contract-fixes | The research gives a cited plan for both fixes | The new contract tests fail on the old contracts and pass on the new ones |
| 020-doctor-contract-fixes | 021-doctor-test-environments | Both contracts are fixed and tested | A scoped offline check in the fixture classifies the four units as designed |
| 021-doctor-test-environments | 022-doctor-playbook-environment-migration | Both environments exist and reset cleanly | Every changed scenario validates and names its environment and reset step |
| 022-doctor-playbook-environment-migration | 023-release-update-symlink-parent | The update scenarios run on the fixture | An unscoped fixture check finishes with no workaround commit |
| 023-release-update-symlink-parent | 024-doctor-docs-alignment | The engine fix is pushed | Every doc claim about the doctor commands matches the command files |
| 024-doctor-docs-alignment | 025-doctor-scenario-runs | The docs match the commands | Every scenario has a recorded verdict with evidence |
| 025-doctor-scenario-runs | 026-doctor-run-followups | Every scenario has a verdict | The sk-doc script tests pass and the graph validator warns only where the sanitizer would change a label |
| 026-doctor-run-followups | 027-derived-sanitizer-instruction-shape | Seven skills stay unstamped because the sanitizer would drop their labels | All 14 skills pass the sanitizer unchanged and graph validation reports 0 warnings |
| 027-derived-sanitizer-instruction-shape | 028-advisor-stress-fixtures | All 14 skills carry a proven sanitizer stamp | The skill-advisor stress suite passes 64 of 64 |
| 028-advisor-stress-fixtures | 029-main-ci-regenerations | The skill-advisor stress suite passes | Command Tree Parity, sk-doc Script Tests and Deep-Loop Runtime Tests pass on main |
| 029-main-ci-regenerations | 030-cursor-reconcile-test-exemption | Three red checks cleared | Spec-Kit Check passes on main |
| 030-cursor-reconcile-test-exemption | 031-changelog-v4003-reality-check | Main CI is green | The changelog validates with 0 issues and no claim contradicts the code |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does making `folder-token-fallback` reachable at generation need a diagnostics schema change, or can the bucket stay at `schemaVersion: 2`? Phase 001 decides with a fixture.
- Should the generated-file inventory in the release engine be a path allowlist or a content-marker rule? Phase 002 decides from the generator scripts that write each artifact.
- Should the speckit presentation name the registered nested router, or should a root command file be added for the generic `/doctor` form? Phase 003 decides against the command contract's naming rules.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
