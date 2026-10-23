---
title: "Feature Specification: Phase 3: advisor-vocabulary-cleanup"
description: "The advisor still carries the WEBFLOW and OBSIDIAN surface vocabulary after the hub drops those surfaces, and four directory scans would pull a gitignored local-* private skill into a tracked artifact or a CI gate."
trigger_phrases:
  - "advisor vocabulary cleanup"
  - "phase 3 advisor vocabulary cleanup"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: advisor-vocabulary-cleanup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `deepseekpi` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-hub-surface-removal |
| **Successor** | 004-private-local-skills |
| **Handoff Criteria** | Every affected test suite is green, `skill-graph.json` carries no sk-code surface signal, `validate.sh --strict` prints `RESULT: PASSED`, and the phase commit is pushed to `main` so `004-private-local-skills` starts from it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* private skills that only the operator's local advisor routes specification.

**Scope Boundary**: In scope is the sk-code hub tree, the tracked consumers that name `sk-code-webflow`, `sk-code-obsidian` or the `WEBFLOW` / `OBSIDIAN` surface tokens, and the advisor's sk-code surface vocabulary. Out of scope, kept unchanged: generic Webflow/Obsidian words in other skills, dated historical records and git history (the full boundary is D6 in the parent packet and is repeated in §3).

**Dependencies**:
- `002-hub-surface-removal` merged first: the surfaces and their `mode-registry.json` / `hub-router.json` entries must already be gone, because this phase removes the vocabulary those entries declare and regenerates the tracked fallback graph afterwards.
- The local advisor database built in this worktree (`node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true`). It is gitignored and it is what the advisor tests read; without it `advisor-surface-hint.vitest.ts` fails for an unrelated reason.
- `004-private-local-skills` runs after this phase so that the advisor scan already follows a `local-*` symlink by the time a private skill exists.

**Deliverables**:
- No `WEBFLOW` / `OBSIDIAN` surface vocabulary left in the advisor scorer, plugin, tool schemas or their tests.
- Six directory scans that treat a `local-*` entry by design: the advisor graph scan and the source-signature scan include it, the compiler and the Hermes sync and the CI root-metadata gate and the doctor freshness panel exclude it.
- A regenerated tracked fallback `runtime/scripts/skill-graph.json` with no sk-code surface signals.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 2 removes the Webflow and Obsidian surfaces from the sk-code hub, but the advisor still declares them: the lexical lane carries an `obsidian plugin` hint token for `sk-code`, the OpenCode plugin detects an OBSIDIAN or WEBFLOW workspace, and two tool schemas plus the advisor README advertise `WEBFLOW` as the example surface hint. A prompt for a surface that no longer ships would keep collecting a hint, and the tracked fallback graph keeps the surfaces' trigger phrases. Separately, six scans read `.skilled/skills/` by name: the advisor graph scan and the freshness signature skip a symlinked skill because `Dirent.isDirectory()` is false for a symlink, while the compiler, the Hermes sync, the CI root-metadata gate and the doctor freshness panel would pull a gitignored `local-*` private skill into a tracked file, a committed mirror or a failing gate.

### Purpose
After this phase the advisor speaks only about the surface that still ships, and a `local-*` private skill is either visible to the local advisor or invisible to every tracked artifact, by design rather than by accident.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The advisor's sk-code surface vocabulary: the lexical hint token, the plugin's workspace-surface detection, the `surfaceHint` example in both tool schemas and in the advisor README, and the tests and fixtures that name `WEBFLOW` or `OBSIDIAN`.
- Directory-scan behavior for a top-level `local-*` entry in the advisor graph scan (`skill-graph-db.ts`) and the advisor source signature (`freshness.ts`), which must follow a symlink that resolves to a directory.
- Directory-scan behavior for a top-level `local-*` entry in the compiler (`skill_graph_compiler.py`), the Hermes sync (`sync-skills-hermes.cjs`), the CI root-metadata gate (`ci-skill-root-metadata.cjs`) and the doctor freshness panel (`skill-graph-freshness.cjs`), which must exclude it.
- Regenerating the tracked fallback `runtime/scripts/skill-graph.json` so it no longer carries the surfaces' signals.
- One test per behavior change, each failing before the change and passing after it.

### Out of Scope
- Generic Webflow/Obsidian words in other skills: `mcp-tooling/mcp-obsidian`, `mcp-notion`, the mcp-code-mode Webflow CMS vocabulary at `fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`, the `P1-MCP-002` regression and holdout rows, and the sk-design style bundles — those describe a different product, not the removed sk-code surface.
- Dated historical records: every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks under `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` that name units of the past v4.0.0.2 release, and the `anchor-repair-sample` test fixture — history is not rewritten.
- Git history: removed content stays in history; scrubbing it (filter-repo plus a force push) is an optional operator decision recorded as D7.
- The hub tree itself, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, the playbooks and the compiled-routing fixtures and their test `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` — phase 2 owns those.
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json` — generated data, regenerated by CI after a push, never hand-edited here.
- Creating the private skills and their ignore rules — phases 1 and 4.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` | Modify | Drop the `obsidian plugin` hint token and the comment that justifies it |
| `.opencode/plugins/system-skill-advisor.js` | Modify | `detectWorkspaceSurface` keeps only the SKILLED branch |
| `.opencode/plugins/tests/system-skill-advisor.test.cjs` | Modify | Rename the `webflow` fixture target in the compiled-route summary cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Delete the OBSIDIAN and WEBFLOW detection rows |
| `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts` | Modify | `SURFACE_HINT` becomes `SKILLED` |
| `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` | Modify | `surfaceHint` description example becomes SKILLED |
| `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts` | Modify | Same description text |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | Same sentence in the option list |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts` | No change | Verified: the `webflow` prompt asserts `sk-code`, which stays correct |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modify | Graph scan follows a top-level `local-*` symlink |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts` | Modify | Test for the symlinked `local-*` skill |
| `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts` | Modify | Source signature follows a top-level `local-*` symlink |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modify | Test for the `local-*` symlink in the source signature |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` | Modify | Skip `local-*` entries so they never reach the tracked fallback |
| `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Modify | Compiler test for the `local-*` skip |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Modify | Skip a top-level `local-*` skill so it is never mirrored |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Modify | Test for the `local-*` skip |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` | Modify | Skip `local-*` in `findSkillRoots` |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Modify | Test for the `local-*` skip |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modify | Skip `local-*` in the on-disk read |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` | Modify | Test for the `local-*` skip |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate | Recompiled fallback graph without sk-code surface signals |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No tracked file in scope names `WEBFLOW` or `OBSIDIAN` as a sk-code surface after this phase. |
| REQ-002 | `skill-graph-db.ts` indexes a skill reached through a top-level `local-*` symlink that resolves to a directory, and behavior for every other entry is unchanged. |
| REQ-003 | `freshness.ts` includes a skill reached through a top-level `local-*` symlink in the source signature, and behavior for every other entry is unchanged. |
| REQ-004 | `skill_graph_compiler.py`, `sync-skills-hermes.cjs`, `ci-skill-root-metadata.cjs` and `skill-graph-freshness.cjs` each skip a top-level `local-*` entry, so no private skill reaches the tracked fallback graph, the Hermes mirror, the CI gate or a doctor finding. |
| REQ-005 | The tracked `runtime/scripts/skill-graph.json` is regenerated with the compiler after phase 2 and carries no `webflow` or `obsidian` signal under `sk-code`. |
| REQ-006 | Every behavior change in REQ-002 through REQ-004 has a test that fails before the change and passes after it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `advisor-surface-hint.vitest.ts` uses a surface hint that still exists, so the test proves the argv contract rather than a removed surface. |
| REQ-008 | The `surfaceHint` description in both tool schemas and the advisor README names SKILLED, so no shipped description advertises a surface that no longer ships. |
| REQ-009 | Every no-change decision (the native-scorer `webflow` prompt, the zero-hit surface-id re-check) is recorded with the command that proved it. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -i 'webflow|obsidian'` over the in-scope advisor, plugin, Hermes, CI and doctor files returns only the D6 out-of-scope hits (`fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`).
- **SC-002**: The ten affected suites pass: `skill-graph-db`, `advisor-status`, the Python advisor suite, `sync-skills-hermes`, the root-metadata contract, the freshness panel, the plugin `node:test` suite, the plugin vitest suite, `advisor-surface-hint` and `native-scorer`.
- **SC-003**: `node -e "process.stdout.write(JSON.stringify(require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json').signals['sk-code']))"` contains neither `webflow` nor `obsidian`.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 merged | The compiler regeneration would keep the surfaces' signals, and the plugin would drop a hint the hub still declares | Do not start until `002-hub-surface-removal` is on `main`; re-run the compiler only after it is |
| Dependency | Local advisor database | `advisor-surface-hint.vitest.ts` reads it; a fresh worktree has none, and that file fails for an unrelated reason | Build it first with `advisor_rebuild --trusted --force true`; it is gitignored, so it never enters a commit |
| Risk | Removing the `obsidian plugin` hint moves a score | Low | The hub no longer declares that phrase, so the hint can only hand `sk-code` a phrase no surface owns; the scorer suites prove nothing else moved |
| Risk | A symlink scan recurses somewhere it should not | Medium | The new condition is top-level only (`currentDir === skillDir` in the graph scan, a depth-1 filter in the signature), so no nested `local-*` name changes behavior |
| Risk | A symlink whose target is missing | Low | `statSync` throws; the existing `try`/`catch` in the graph scan and the `existsSync` guards keep the entry out rather than failing the scan |
| Risk | Regenerated `skill-graph.json` diff is larger than expected | Medium | Diff it against the phase-2 tree and accept only removed sk-code signals; any other change means the compiler ran before phase 2 |
| Risk | `.hermes/skills/local-*` written before the D2 ignore rule lands | Medium | The sync skip is defence in depth: it removes the write path, and phase 1's ignore rule removes the tracking path |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The graph scan and the source signature add at most one `statSync` per top-level entry whose name starts with `local-`; a tree with no `local-*` entry performs the same calls as today.
- **NFR-P02**: The compiler, Hermes sync, CI gate and doctor panel do no filesystem work for a skipped `local-*` entry beyond the one directory listing they already make.

### Security
- **NFR-S01**: No content from a `local-*` private skill reaches a tracked file: not `skill-graph.json`, not `.hermes/skills/`, not a test fixture.
- **NFR-S02**: No path from a `local-*` entry is printed by the CI gate or the doctor panel, so a private folder name does not leak into CI logs.

### Reliability
- **NFR-R01**: Every in-scope suite is green on the final commit; no test is skipped or marked todo to reach green.
- **NFR-R02**: A `local-*` symlink with a missing target leaves the scans green, with the entry simply absent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a skills root with no `local-*` entry behaves exactly as today in all six scans.
- Maximum length: the graph scan's recursive walk still descends into a followed `local-*` skill, and only that one level is entered through the symlink.
- Invalid format: a `local-*` entry that is a regular file is not a skill; the compiler's `graph-metadata.json` probe and the Hermes `SKILL.md` probe both reject it without the new condition mattering.

### Error Scenarios
- External service failure: not applicable; every scan is local filesystem work.
- Network timeout: not applicable.
- Concurrent access: the advisor daemon may scan while the graph is rebuilt; the scan is read-only and the D4 change adds no write.

### State Transitions
- Partial completion: a phase left mid-way has red tests only inside the test-then-code pairs of `tasks.md`; the phase is not closeable until the final `validate.sh --strict` passes.
- Session expiry: not applicable; the phase carries no session state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 22 files, four scans plus one vocabulary sweep, no API change |
| Risk | 10/25 | Scoring shifts for one hint token; four tracked artifacts stop accepting a path class |
| Research | 8/20 | Every anchor is verified; the only investigation left is the regenerated graph diff |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. D1 through D7 in the parent packet fix every decision this phase would otherwise have to make.
<!-- /ANCHOR:questions -->

---
