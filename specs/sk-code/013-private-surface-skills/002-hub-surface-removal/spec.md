---
title: "Feature Specification: Phase 2: hub-surface-removal"
description: "Removes the Webflow and Obsidian example surfaces from the shipped sk-code hub: 226 tracked files, their registry and router entries, and every tracked consumer that names them, leaving sk-code-quality, sk-code-review and sk-code-skilled."
trigger_phrases:
  - "hub surface removal"
  - "phase 2 hub surface removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: hub-surface-removal

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

The shipped `sk-code` hub advertises two example surfaces, Webflow and Obsidian, that exist only for the operator's own work: 1.5M and 504K of stack knowledge, 226 tracked files together. This phase deletes both packets, reduces the two routing registries and the machine router to the one shipped surface, regenerates every artifact that has a generator, and strips every tracked consumer that names them. The hub then ships `sk-code-quality`, `sk-code-review` and `sk-code-skilled`, and nothing outside the dated historical records still names the removed surfaces.

**Key Decisions**: Delete here and rebuild privately in phase 4 (ADR-001); hand-edit the two files no generator owns (ADR-002); the Motion.dev scenario families leave with the overlay (ADR-003); keep the four comment-hygiene tag lines and the dated records (ADR-004); the closure boundary is the two greps (ADR-005); generated data comes from its generator and the retrieval index waits for CI (ADR-006).

**Critical Dependencies**: Phase `001-ignore-and-commit-guard` must land first, and the checkout must be hook-trusted so the pre-commit hook re-mints the compiled-routing manifest.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Executor** | OpenCode 2 orchestrator; reviews via the `subagent` tool, agent `review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-ignore-and-commit-guard |
| **Successor** | 003-advisor-vocabulary-cleanup |
| **Handoff Criteria** | `verify-doc-claims.cjs` lists nothing, the hub's own test suites pass, and `validate.sh --strict` prints `RESULT: PASSED`; no tracked path outside the D6 kept records names `sk-code-webflow` or `sk-code-obsidian`, and no bare `WEBFLOW` / `OBSIDIAN` surface token survives outside the four kept tag-vocabulary lines in three files. The handoff grep excludes the CI-generated retrieval data, `runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/*`: CI rebuilds both after the push, so the phase handoff does not wait on them and phase 5 proves their zero count. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* skills that this checkout links to but never tracks, routed only by the operator's local advisor specification.

**Scope Boundary**: D6, copied from the phase decision record. In scope: the sk-code hub tree, tracked consumers that name `sk-code-webflow`, `sk-code-obsidian`, or the `WEBFLOW` / `OBSIDIAN` surface tokens, and the advisor's sk-code surface vocabulary. Out of scope, kept unchanged: generic Webflow/Obsidian words in other skills (mcp-tooling/mcp-obsidian, mcp-notion, mcp-code-mode's Webflow CMS vocabulary at `fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`, the `P1-MCP-002` regression and holdout rows, sk-design style bundles); dated historical records (every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` that name units of the past v4.0.0.2 release, and the `anchor-repair-sample` test fixture); git history.

**Dependencies**:
- Phase order is fixed: `001 -> 002 -> 003 -> 004 -> 005`. This phase runs after `001-ignore-and-commit-guard` because the root `.gitignore` rules and the pre-commit guard must exist before any private copy of the removed content is written by a later phase.
- Base commit for restoring removed content is `42b41dd286`; every anchor in this packet was read on that commit and re-checked at `583316d083`.
- The operator checkout must be provisioned and hook-trusted (`worktree-naming.sh provision .`, `git config --local skilled.trustRepoHooks true`, `install-git-hooks.sh`), because step 9 of the hub README removal procedure relies on the hook re-minting the compiled-routing manifest.

**Deliverables**:
- `.skilled/skills/sk-code/sk-code-webflow/` and `.skilled/skills/sk-code/sk-code-obsidian/` deleted from the tracked tree (226 files).
- `mode-registry.json` and `hub-router.json` reduced to the three shipped packets, with no surface entry, router signal or vocabulary class for the removed surfaces.
- Every generated hub artifact regenerated by its generator, and every hand-authored hub document stripped of the removed surfaces.
- Every tracked consumer outside the hub that names the removed surfaces updated or neutralised.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped `sk-code` hub advertises two example surfaces, Webflow and Obsidian, that exist only for the operator's own work: 1.5M and 504K of stack knowledge, 226 tracked files together. Keeping them public makes every adopter download and index two stacks they never asked for, forces every hub consumer to carry their names, and keeps their vocabulary in the committed trigger index and the advisor's sk-code surface detection. The hub is also the only reason a generic frontend or note-plugin prompt can win a routing tie against this framework's own code.

### Purpose
Reduce the shipped hub to the three packets it needs, `sk-code-quality`, `sk-code-review` and `sk-code-skilled`, with no tracked file, generated artifact or consumer outside the D6 kept records still naming the removed surfaces.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Deleting both surface folders from the tracked tree and from every registry, router, manifest and document that lists them.
- Hand-editing the two files no generator owns: `ROUTER.md` sections 1 to 11 and `graph-metadata.json`'s `causal_summary`.
- Regenerating every artifact that has a generator: `leaf-manifest.json`, the skill-derived files, the README manifest, the Hermes copies and the compiled-routing manifest.
- Removing the example-authored scenarios, checklist pointers, feature-catalog claims, test cases and fixtures that present the two surfaces as live, including the surface-label comment in the canary router.
- Updating the tracked consumers outside the hub that name the surfaces: the doctor's parent-skill check, the sk-doc leaf-resource fixture, the sk-doc upgrade reference, the recorded-picks fixture, the README baseline files, the cite-drift redirects, the playbook fail-closed allowlist and the markdown-link allowlist.
- The hub consumers that still name the surfaces: the hub's own `README.md`, its `shared/README.md` and five `shared/references/*.md` files, four `shared/references/universal/*.md` files, `sk-code-skilled/{README.md,SKILL.md}` and the two live playbook files outside the playbook globs (`design-restraint/design-restraint-ladder.md`, `skill-advisor-integration/advisor-probe-battery.md`).
- The advisor's sk-code surface vocabulary only where it lives inside the hub's own documents; the advisor runtime changes are phase 3.

### Out of Scope
- Every D6 kept record **that survives the two deleted surface folders**: other skills' generic Webflow/Obsidian words, every `changelog/` and `benchmark/reports/` file outside `.skilled/skills/sk-code/sk-code-webflow/` and `.skilled/skills/sk-code/sk-code-obsidian/` (the hub root, `sk-code-quality`, `sk-code-review`, `sk-code-skilled`), `.skilled/changelog/skilled/*.md`, `specs/**/z_archive/**`, the dated `doctor-update-*` playbooks and the `anchor-repair-sample` fixture. They describe past releases and must stay byte-identical. Two authored twins inside `z_archive` are the exception and are **not** kept byte-identical: the canary fixture at `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` and the compiled-routing activation manifest at `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` are live authored sources kept in sync with their generated copies, so T069, T070 and T108 update them and their diff is expected.
- The `WEBFLOW:` platform tag, which is the only bare surface token that stays. It lives in four lines across three files: two lines of `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md` (32 and 119), the line of `shared/references/universal/code-style-guide.md` that also carries `MOTION:` and `LENIS:` (line 151 today), and the allowed-token regex of `sk-code-quality/scripts/check-comment-hygiene.sh` (line 149). It is comment-hygiene tag vocabulary for a code comment, not the removed surface, and it stays.
- Git history. The removed content stays in history; scrubbing it is D7 and an optional operator decision.
- Creating `.skilled/skills/local-webflow/` and `.skilled/skills/local-obsidian/`, their symlinks, their standalone metadata and their links back to `../sk-code/shared/`. Phase 4 owns all of it.
- Advisor runtime vocabulary, tests and the tracked skill-graph fallback (`lexical.ts`, the plugin's `detectWorkspaceSurface`, the `local-*` scan changes). Phase 3 owns them.
- The fresh-clone leak proof, the throwaway advisor DB and the trigger-index rebuild proof. Phase 5 owns them.
- The authored compiled-routing source under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` and the `.opencode/skills` link. Both stay.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-webflow/` | Delete | Whole packet folder, 161 tracked files, 1.5M |
| `.skilled/skills/sk-code/sk-code-obsidian/` | Delete | Whole packet folder, 65 tracked files, 504K |
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Line 5 description; line 19 `surfaces`; mode objects at 60-77 and 97-114 (T005-T008) |
| `.skilled/skills/sk-code/hub-router.json` | Modify | `tieBreak` line 7; `routerSignals` 31-35 and 41-46; `vocabularyClasses` 73-78 and 88-94 (T009-T013) |
| `.skilled/skills/sk-code/leaf-manifest.json` | Modify (generated) | Regenerate; today lines 18, 35-36, 166 and 270-271 name the surfaces (T014) |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | 618 lines today, 152 packet-name lines and 172 case-insensitive surface lines; sections 1, 2, 3, 4, 5, 7, 8, 9, 10 and 11 (T015-T026) |
| `.skilled/skills/sk-code/SKILL.md` | Modify | 209 lines; keyword line 11, intro 15 and 17, surface table 36 and 38, surface list 40, hint and discriminator 63, 70, 74, 82, detection 139, layout 164 and 166, backend 173, related 203 (T027-T029) |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | 156 lines; surface markers, precedence, guard and example tables (T030) |
| `.skilled/skills/sk-code/shared/README.md` | Modify | Pointer rows at 17, 30, 52 and 71 (T031) |
| `.skilled/skills/sk-code/shared/references/phase-detection.md` | Modify | 124 lines; §3 WEBFLOW PHASES and §5 OBSIDIAN PHASES deleted, survivors renumbered (T032) |
| `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` | Modify | Rows at 16, 22, 69 and 91 (T033) |
| `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md` | Modify | 121 lines; rows at 16, 22, 26, 36, 38, 51, 57-71, 90, 106 and 120 (T034) |
| `.skilled/skills/sk-code/shared/references/performance-loading-checklist.md` | Modify | Pointer rows at 98-100 (T035) |
| `.skilled/skills/sk-code/shared/references/universal/code-style-guide.md` | Modify | Lines 3, 58, 87, 139, 194, 204 and 225; line 151 is the kept tag row (T036) |
| `.skilled/skills/sk-code/shared/references/universal/error-recovery.md` | Modify | Lines 3, 43, 88, 89, 108 and 133 (T037) |
| `.skilled/skills/sk-code/shared/references/universal/multi-agent-research.md` | Modify | Lines 50, 172 and 216 (T038) |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` | Modify | Lines 16, 24, 49, 56, 82 and 118 (T039) |
| `.skilled/skills/sk-code/description.json` | Modify | Description line 3 and keywords at 12, 46, 49 and 50 (T040) |
| `.skilled/skills/sk-code/README.md` | Modify | 193 lines; rows at 23, 55, 57, 69, 90, 106, 119, 126, 191 and 193; "Before You Start" at 110-115 and the removal procedure at 117-129 stay (T041) |
| `.skilled/skills/sk-code/sk-code-skilled/{README.md,SKILL.md}` | Modify | `README.md` 36, 91 and 104; `SKILL.md` 55 (T042-T043) |
| `.skilled/skills/sk-code/manual-testing-playbook/surface-detection/{webflow-detection.md,obsidian-detection.md}` | Delete | Two whole scenarios (T044-T045) |
| `.skilled/skills/sk-code/manual-testing-playbook/cross-stack-routing/` | Delete | Seven Motion.dev scenarios (T046) |
| `.skilled/skills/sk-code/manual-testing-playbook/motion-dev-and-animation-regression/` | Delete | Four Motion.dev scenarios (T047) |
| `.skilled/skills/sk-code/manual-testing-playbook/cross-browser-and-performance-gates/` | Delete | Three Motion.dev scenarios (T048) |
| `.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/mixed-marker-ambiguity.md` | Delete | Its premise needs two surfaces (T049) |
| `.skilled/skills/sk-code/manual-testing-playbook/{surface-detection/skilled-detection.md,surface-detection/unknown-fallback.md,compiled-routing/surface-bundle-compiled-routing.md}` | Modify | Token lines and expected bundles (T050-T052) |
| `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` | Modify | 407 lines; three sections, nine rows, four prose lines and the cross-reference rows (T053) |
| `.skilled/skills/sk-code/manual-testing-playbook/{design-restraint/design-restraint-ladder.md,skill-advisor-integration/advisor-probe-battery.md}` | Modify | Precedence sentence at line 13 and the P12-P17 probe rows at 38-43 (T054-T055) |
| `.skilled/skills/sk-code/manual-testing-playbook/doctor-commands/doctor-sk-code-setup.md` | Modify | Expected doctor output at lines 48, 50 and 52 (T056) |
| `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/*.md` | Modify | `naming-init-formatting-and-css.md` 34, 94, 144, 161; `overview-header-and-comments.md` 50-54, 62, 105, 166, 173, 179, 193; `verification-quick-reference-and-related.md` 122-126, 130 (T057-T059) |
| `.skilled/skills/sk-code/sk-code-quality/{SKILL.md,README.md}` | Modify | `SKILL.md` 15, 29, 37, 48, 68, 70, 93, 113, 129-132, 190, 192, 196, 278, 289, 323-326; `README.md` 53, 59, 61, 89, 108, 133 (T060-T061) |
| `.skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` | Modify | Lines 12 and 89-90 minify-webflow case (T062) |
| `.skilled/skills/sk-code/feature-catalog/{feature-catalog.md,two-axis-registry-driven-routing/two-axis-registry-driven-routing.md}` | Modify | `feature-catalog.md` 15 and 35; the two-axis page line 26 (T063-T064) |
| `.skilled/skills/sk-code/sk-code-review/{SKILL.md,README.md,references/review-core.md}` | Modify | `SKILL.md` 39, 42, 58, 224-231, 234, 246-247, 251-264, 375, 499; `README.md` 153, 188; `review-core.md` 68 (T065-T067) |
| `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` | Modify | Lines 22-24 and the assertions at 65, 72, 76, 81, 89, 112 (T068) |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` | Modify | Eleven case objects between lines 59 and 274, then copied over its authored twin (T069-T070) |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Modify | Comment at line 233: the `WEBFLOW` surface-label example becomes `SKILLED` (T071) |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs` | Modify | Lines 485-516 surface prefixes and detection, plus line 610 (T072) |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Lines 33-34 and 135 (T073) |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.cjs` | Modify | `verify-router-sync.test.cjs` 102, 109, 153, 162; `verify-doc-claims.test.cjs` 58 and the fixture lines it owns (T074-T075) |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modify | `SK_CODE_EXAMPLE_SURFACES` at line 1229 and the comment above it (T076) |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modify | Lines 491 and 500 (T077) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` | Modify | Lines 355-392, rename the fixture surface (T078) |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md` | Modify | Lines 72 and 134 (T079) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/fixtures/047-020-recorded-picks.jsonl` | Modify | Lines 28-30 (T080) |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/{baseline-readme-verdicts.json,durable-directory-manifest.json}` | Modify (generated) | Rebuilt by their own `--write` runs (T081, T094) |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` | Modify | Lines 259 and 3960-3961 (T082) |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Modify | Lines 33 and 37 (T083) |
| `.skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs` | Modify | Line 73 allowlist row (T084) |
| `README.md`, `.skilled/skills/README.txt` | Modify | Surface lines at `README.md:796`, `1418`, `1419`, `1481` and `README.txt:60` (T085-T086) |
| `.skilled/skills/sk-code/graph-metadata.json` | Modify | Regenerate, then hand-edit `domains`, `intent_signals`, `derived` and `causal_summary` at line 282 (T087-T092) |
| `.hermes/skills/sk-code*/` | Modify (generated) | Regenerated by `sync-skills-hermes.cjs` (T093) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both surface folders are gone from the tracked tree: `git ls-files` matches nothing under `.skilled/skills/sk-code/sk-code-webflow/` or `.skilled/skills/sk-code/sk-code-obsidian/`, and `git rm -r` (not a plain delete) recorded the removal so the content stays reachable at `42b41dd286`. |
| REQ-002 | `mode-registry.json` and `hub-router.json` name no removed surface: no `sk-code-webflow` / `sk-code-obsidian` mode entry, no `routerSignals` entry, no vocabulary class, `extensions.surface-axis.surfaces` is `["sk-code-skilled"]`, and `routerPolicy.tieBreak` is `["sk-code-quality", "sk-code-review", "sk-code-skilled"]`. |
| REQ-003 | Every artifact with a generator is regenerated by that generator, never hand-edited: `leaf-manifest.json`, the skill-derived files, the README manifest, the Hermes copies and the compiled-routing manifest. |
| REQ-004 | The two hand-owned files are edited by hand and are correct: `ROUTER.md` section 11 has no removed-surface path and no key left with an empty path list, and `graph-metadata.json`'s `causal_summary` describes three packets. |
| REQ-005 | No tracked consumer outside the D6 kept records still names the removed surfaces, by packet name or by bare `WEBFLOW` / `OBSIDIAN` token: the doctor check, the sk-doc fixture and reference, the recorded-picks fixture, the README baseline files, the cite-drift redirects, the playbook allowlist and the markdown-link allowlist all pass their own gates, and the only surviving tokens are the four kept tag-vocabulary lines. |
| REQ-006 | `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` exits 0 and lists nothing, including no dead path into a removed packet and no stale surface count. |
| REQ-007 | The hub's own test suites pass: `compiled-route-surface-hint.test.cjs`, `verify-router-sync.test.cjs`, `verify-doc-claims.test.cjs`, `typo-flags.test.sh`, the doctor invariants test and the sk-doc leaf-resource contract test. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | D6 kept records that survive the two deleted surface folders are byte-identical to `42b41dd286`: the diff is empty for the `changelog/` and `benchmark/reports/` files outside those folders, `.skilled/changelog/`, the dated doctor playbooks and the `anchor-repair-sample` fixture. Inside `specs/**/z_archive/**` the diff is empty too, **except** for the two live authored twins, the canary fixture and the compiled-routing activation manifest, which this phase regenerates and copies and whose diff is expected. |
| REQ-009 | The authored compiled-routing source `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/` and the `.opencode/skills` link still exist, and the canary fixture's authored twin matches the live fixture. |
| REQ-010 | The phase lands as one commit with a prose body, hooks installed, pushed to `main` after the suites, the reviewer and the validator have passed, and `validate.sh --strict` on this folder prints `RESULT: PASSED` from the final state, with `git status --porcelain` empty and `git rev-parse HEAD` equal to `git rev-parse origin/main`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "sk-code-webflow|sk-code-obsidian" .skilled/skills/sk-code .skilled/bin .skilled/commands/doctor .skilled/skills/sk-doc README.md .skilled/skills/README.txt --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` prints nothing, and the same grep over `git ls-files` finds no removed-packet path. The bare surface tokens go too: `rg -n 'WEBFLOW|OBSIDIAN' .skilled/skills/sk-code .hermes/skills/sk-code* --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` prints exactly four lines — two in `manual-testing-playbook/tooling-and-hooks/comment-hygiene-hook.md`, one in `shared/references/universal/code-style-guide.md` (the kept `WEBFLOW:` row that also carries `MOTION:` and `LENIS:`) and one in `sk-code-quality/scripts/check-comment-hygiene.sh` — and nothing under `.hermes/`, so the file-level `rg -l` form lists exactly those three files.
- **SC-002**: The hub still routes: `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"implement a typescript script"}' --format json` returns `sk-code` with `sk-code-skilled` among its targets, and the hub's own suites and doctor check pass with three packets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 must land first | Root ignore rules and the commit guard are the only thing that keeps a later private copy from being staged | Do not start until 001's validator prints `RESULT: PASSED` |
| Dependency | Hook-trusted, provisioned checkout | Without `skilled.trustRepoHooks`, T108's commit does not re-mint the compiled-routing manifest and the phase ships a stale one | Run the three README "Before You Start" commands, then confirm with `git config --local --get skilled.trustRepoHooks` |
| Risk | Hand-editing a generated file | `leaf-manifest.json`, the README manifest or the Hermes copies drift from their source and the next regeneration re-introduces the surfaces | REQ-003: only the named generator writes those files |
| Risk | Deleting folders before consumers are updated | `verify-doc-claims`, the doctor check and the markdown-link check fail on dead paths, and it looks like the deletion was wrong | Order the work: delete, then registry, then generators, then hand-owned docs, then consumers, then run the doc-claims gate |
| Risk | `ROUTER.md` section 11 key left with an empty path list | `verify-router-sync.cjs` fails the parent projection against the union of surface maps | Delete each key left with no paths from both `RESOURCE_MAP` and `INTENT_SIGNALS`, then run the sync test |
| Risk | Canary fixture edited but not copied to its authored twin | The authored source under `015-router-unification-program/` disagrees with the live fixture and the guard fails | Copy the fixture over the twin in the same pass, and prove it with `diff` |
| Risk | Surface counts left stale in prose | `verify-doc-claims.cjs` fails on a count that no longer matches `mode-registry.json` | Let the gate name every count, then fix each one it lists |
| Risk | Motion.dev guidance disappears from the public hub | Adopters lose the cross-stack animation references they could read today | Recorded and accepted: the overlay moves with the Webflow packet into the private skill in phase 4; the public hub keeps only what SKILLED needs |
| Risk | The trigger index still names the surfaces after the push | A reader who greps the committed index sees the old names until CI runs | ADR-006: the handoff grep excludes both retrieval paths, and phase 5 proves the post-rebuild count |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Removing 226 files must not slow the hub's own gates; the full Phase 2 proof set runs in under five minutes on the operator machine.
- **NFR-P02**: `leaf-manifest.json` and the README manifest shrink with the removed packets, so no scan reads a path that no longer exists.

### Security
- **NFR-S01**: Nothing removed in this phase is re-added to a tracked path; the removed content lives only in git history until phase 4 writes it under an ignored `local-*` folder.
- **NFR-S02**: No private content is written by this phase at all, so the commit guard from phase 001 has nothing to catch and its presence is proved, not exercised.

### Reliability
- **NFR-R01**: Every command in the task list is idempotent or has a stated single-run precondition; re-running a regeneration step produces no diff.
- **NFR-R02**: The phase is one commit, so `git revert` restores the whole prior state in one step.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty input: a hub with zero example surfaces is the shipped state; `verify-router-sync.cjs` already filters its surface lists with `onDisk`, so the lists shrink instead of failing.
- Maximum length: `ROUTER.md` section 11 is a single hand-maintained projection; after the edit it must still parse as Python-literal data, which `verify-router-sync.cjs` proves.
- Invalid format: a `RESOURCE_MAP` key left with `[]` is invalid and fails the sync test; the key is deleted, not emptied.

### Error Scenarios
- External service failure: `sync-skills-hermes.cjs` writes `.hermes/skills/`; a failure leaves the old copies in place, so re-run it and confirm `.hermes/skills/sk-code-webflow/` is gone.
- Network timeout: no network step exists in this phase; the trigger-index rebuild is CI's and phase 5's.
- Concurrent access: the compiled-routing manifest is written by the hook at commit time; do not hand-edit it in the same commit.

### State Transitions
- Partial completion: a half-edited `mode-registry.json` breaks every hub command. Stop, restore with `git checkout 42b41dd286 -- .skilled/skills/sk-code/mode-registry.json`, and redo the edit.
- Session expiry: resume from `tasks.md`; the task list is ordered so each task's proof command tells you whether it already ran.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 226 deleted files plus 78 edited files across four skills and six test suites |
| Risk | 16/25 | No runtime behaviour change intended, but a stale generated artifact or an empty router key fails the hub's own gates |
| Research | 8/20 | Every anchor is verified on `42b41dd286` and re-checked at `583316d083`; the remaining work is mechanical |
| Multi-Agent | 6/15 | One writer executes 108 single-change tasks in order; no parallel workstream, because every task reads the file the previous one wrote |
| Coordination | 12/15 | Three dependencies: phase 001 landed, a hook-trusted checkout, and the generators present; each has a stop condition in `tasks.md` |
| **Total** | **60/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A tracked consumer outside the inventory still names a removed surface | H | M | AC-007's two greps cover `.skilled/skills/sk-code`, `.skilled/bin`, `.skilled/commands/doctor`, `.skilled/skills/sk-doc`, the root README and the skill index |
| R-002 | A generated artifact is hand-edited and the next regeneration restores the surfaces | H | M | REQ-003, ADR-006 and TASK-GENERATED: only the named generator writes those files |
| R-003 | `ROUTER.md` section 11 keeps a key whose path list is now empty | H | M | T025 deletes the nine emptied keys by line range; AC-005 runs the sync guard |
| R-004 | The canary fixture and its authored twin disagree | M | M | T069 and T070 run back to back and AC-012 diffs them |
| R-005 | A surface count stays stale in prose | M | H | `verify-doc-claims.cjs` names every count; T095 closes the gate before the suites run |
| R-006 | The compiled-routing manifest is stale because the hooks were not trusted | M | L | T001 proves `skilled.trustRepoHooks` is `true` before any edit |
| R-007 | The trigger index keeps the old names after the push | L | H | ADR-006: CI rebuilds it, the handoff grep excludes it, and phase 5 proves the count |
| R-008 | A playbook scenario expects a reference the router no longer emits | M | M | T044 to T053 delete or rewrite every such scenario; AC-009 runs the sync test whose leg 4 checks each expectation |

## 11. USER STORIES

### US-001: An adopter installs a hub with one surface (Priority: P0)

**As an** adopter who never uses Webflow or Obsidian, **I want** the shipped `sk-code` hub to carry only the surface it needs, **so that** I do not download, index or route two stacks I never asked for.

**Acceptance criteria:** AC-001, AC-002, AC-003, AC-007, AC-013.

---

### US-002: A maintainer trusts the hub's own guards after the removal (Priority: P1)

**As a** maintainer, **I want** every registry, manifest, document and fixture to agree with the one-surface hub, **so that** the doc-claims and router-sync guards pass without a waiver.

**Acceptance criteria:** AC-004, AC-005, AC-006, AC-008, AC-009, AC-010, AC-011, AC-012, AC-014.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- None open. The one judgement call, that the Motion.dev overlay leaves the public hub with the Webflow packet, is recorded in the risks table and decided by D6 plus the phase 4 scope.
- The trigger-index rebuild is deliberately not run here: CI rebuilds it after the push, and phase 5 proves the zero count.
- **Corrected during the Level 3 rewrite.** Four facts in the Level 2 draft were stale and are fixed above: the `mode-registry.json` mode objects sit at lines 60-77 and 97-114 (the draft said 61 and 98); `ROUTER.md` carries 152 packet-name lines and 172 case-insensitive surface lines (the draft called 152 "mentions"); the root README names the example surfaces at 796, 1418, 1419 and 1481 (the draft listed 796 only); and the kept tag vocabulary is four lines in three files (the draft said three places, which read as three lines). The three baselines are stated in `tasks.md`'s Task Notation section, because the planner's 93, the broad grep's 1,303 and T003's 158 measure three different scopes.
<!-- /ANCHOR:questions -->

---
