---
title: "Feature Specification: Phase 21: follow-up-defect-fixes"
description: "Fix the pre-existing link, generator, launcher and test defects that phase 020 found and moved here, each with a test that fails on the unfixed code."
trigger_phrases:
  - "follow up defect fixes"
  - "phase 21 follow up defect fixes"
  - "spec folder tooling follow up defects"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: follow-up-defect-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 21 |
| **Predecessor** | 020-deep-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every acceptance row is Met, the open lane work is resolved and `validate.sh --strict` passes on this folder and the 034 parent. Each suite meets the baseline recorded in task T002 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the spec-folder tooling packet. Phase 020 remediated a deep review of phases 016 to 019. While it did that, it found defects that predate it and sit outside its write set. The operator moved them all here with the instruction "fix all of them with tests". Each requirement below names the 020 evidence that found it. Paths in that form are relative to `../020-deep-review-remediation/`.

**Scope Boundary**: The original requirements, their follow-up fixes and the tests that prove them, plus the 016 child-box audit and this packet's documents. The named 016 child task documents are updated only under REQ-026. Nothing in phase 020 or the 034 parent is edited, except the 021 changelog entry at closeout.

**Dependencies**:
- Phase 020 is committed at `7a0f0b4375`. Its evidence under `scratch/evidence/` is read only.
- The operator answered the implementation choices recorded in section 10. The requested follow-up work remains tracked in plan.md, tasks.md and acceptance-criteria.md.

**Deliverables**:
- One red-then-green test per requirement, plus one mutant per changed guard, recorded in `acceptance-criteria.md`.
- The final-state suite runs and the strict validates.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four spec-folder tools still follow a link at a step that writes, reads or moves a file. The healer writes through a linked parent when no root reaches the folder. The graph backfill writes outside the repository it runs from. The archive moves the real folder behind an alias and leaves the alias dangling. Three readers and the repair-derived apply step read through a link. The changelog generator drops rows past the twelfth and leaks HTML comments. The graph rollup can mark a parent complete after it drops a child with missing metadata. Two tests leave residue or fail under load, and the worktree launcher marks every session it starts as a dispatched child.

### Purpose
Close each defect with a test that fails on the code at `7a0f0b4375` and passes after the fix, and with a mutant that shows the new guard is what the test sees.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The defects behind REQ-001 to REQ-017 and REQ-018 to REQ-035 in section 4, grouped into the original code lanes, follow-up lanes, review fixes, the 016 child-box work and closeout gates in plan.md section 3.
- One red, green and mutant record for each changed guard, with any missing red or load run left open in the evidence status.
- The documentation lines that describe changed behavior, including the healer usage and the leaf-manifest script row.
- The deleted deprecated specs/sk-communication track and its impact check under REQ-030.
- The fast-forward from `ba56b03412` to `5d9c970447` and the closeout fixes tracked by REQ-033 to REQ-035.

### Out of Scope
- The 020 changelog, which was completed by hand. Regenerating it would rewrite a phase outside this write set.
- The root `AGENTS.md`, which already names `AI_SESSION_CHILD=1` alone as the child marker (line 86).
- The time-of-check gaps phase 020 accepted (020 Known Limitations items 4 and 5).
- The 016 evidence citations and the phase 018 changelog gap, except the child-box reconciliation explicitly listed in REQ-026.
- The `--roots` realpath check in the healer that no fixture can kill on macOS (`closure-guard-final-gB.txt`, rows not closed, item 2).

### Files to Change

Paths are relative to the repository root. Each lane re-reads its file before editing, because the line numbers below come from the 020 evidence and from a read at `7a0f0b4375`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Lane 1: the no-roots branch of `folderRefusal` (line 914) follows decision 1 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-symlink-containment.vitest.ts` | Modify | Lane 1: the no-roots linked-parent case (row B-11 without roots) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts`, `heal-lane-modes.vitest.ts`, `heal-provenance.vitest.ts`, `anchor-repair-sample.vitest.ts`, `heal-target-parity.vitest.ts` | Modify if needed | Lane 1: pass `--roots` where a fixture outside every repository is healed through `--folder`, only if decision 1 is option 1 and the baseline run shows the case fails |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Lane 1: the healer usage lines state the no-roots rule |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts` | Modify | Lane 2: the CLI confines `--root` to the repository, and `writePruneReportArtifact` checks its root |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/graph-metadata-backfill.vitest.ts` | Modify | Lane 2: the outside-root CLI case and the unanchored report-root case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh` | Modify | Lane 3: the source resolution (lines 273 to 282) follows decision 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts` | Modify | Lane 3: the alias case |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Lane 4: `runCheck` (line 490) refuses a linked manifest |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-scopes.test.cjs` | Modify | Lane 4: the linked manifest `--check` case |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/README.md` | Modify | Lane 4: the generator row states the `--check` refusal |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Lane 5: `readManifestIfExists` (line 450) and `resolveRoots` (line 646) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modify | Lane 5: the linked manifest case and the dot-segment `--roots` case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` | Modify | Lane 6: apply reads refuse links and the re-derive child guard is narrowed to the measured read set |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts` | Modify | Lane 6: the read-recording race case and the parse-echo case |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Modify | Lane 7: the row cut (line 361) and `cleanInlineMarkdown` (line 165) |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts` | Modify | Lane 7: the 13-row case and the inline comment case |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Modify | Lane 8: `derivePhaseParentRollup` counts each child, including one without loadable metadata. The later producer fix also makes `readDoc` refuse linked documents |
| `.skilled/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts` | Modify | Lane 8: the lean parent cases |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts` | Modify | Lane 9: the sweep workspace cleanup (lines 300 to 306 and 412 to 416) |
| `.skilled/skills/system-spec-kit/runtime/tests/folder-discovery-integration.vitest.ts` | Modify | Lane 9: T046-26 (line 873) |
| `.skilled/bin/worktree-session.sh` | Modify | Lane 10 and its follow-up: launcher marker handling, child-only gate enforcement and the shellcheck pattern fix |
| `.skilled/bin/tests/worktree-session.test.sh` | Modify | Lane 10: the launched-session environment case and the no-re-nest case |
| `.hermes/plugins/repo-guards/__init__.py` | Modify | Lane 10: `ORCHESTRATED_LEAF_ENVS` and `_orchestrated_leaf` (lines 80 and 571 to 573) follow decision 4 |
| `.hermes/plugins/repo-guards/tests/test_repo_guards.py` | Modify | Lane 10: `test_the_leaf_gets_the_brief_but_never_the_gate` (line 273) |
| `.skilled/skills/system-spec-kit/runtime/lib/graph/generated-metadata-drift.ts` | Modify | Lane 8 follow-up: skip linked source documents before hashing them |
| `specs/system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups/tasks.md`, `009-doctor-update-compatibility/tasks.md`, `011-anchor-repair-mode/tasks.md` and `015-lane-rules-as-heal-modes/tasks.md` | Modify | Lanes 11 and 12: reconcile the open boxes and child status with their evidence |
| `specs/system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes/` | Modify | Lanes 13 to 19 and fixA to fixE: update this packet's documents and record the closeout evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Each requirement names its source evidence, finding class and lane. Decision-dependent requirements say which choice they follow.

### P0 - Blockers (MUST complete)

| ID | Item | Evidence | Class | Lane | Requirement |
|----|------|----------|-------|------|-------------|
| REQ-001 | A | `scratch/evidence/closure-guard-final-gB.txt` row B-11, fixture `fx-b11a` in the 020 session scratchpad | class-of-bug | 1 | The default healer, run with `--apply` and no `--roots` on a `--folder` that no root reaches, never writes through a link on that folder's path. The rule follows decision 1, answered "Refuse, ask for --roots": with no `--roots` and no anchor, exit 2 with a message to pass `--roots` |
| REQ-002 | B | `scratch/evidence/closure-guard-final-gA.txt`, Extra 2, probe 2 | instance-only | 2 | The backfill CLI refuses a `--root` whose real path lies outside the repository the run resolves, before any write, and writes no `graph-metadata.json` under it |
| REQ-003 | B | `scratch/evidence/closure-guard-final-gA.txt`, Extra 2 and finding 3 | instance-only | 2 | `writePruneReportArtifact` writes only when the report's real parent directory is a configured specs root, the same membership rule the graph metadata writer applies |
| REQ-004 | C | `scratch/evidence/closure-guard-final-summary.txt` section 1.6, 020 Known Limitations item 22 | instance-only | 3 | `archive.sh` never leaves a dangling link behind when its argument reaches the packet through a link inside specs. The rule follows decision 2, answered "Refuse a linked argument": exit 1 before any copy when the argument or a component below specs is a link, and name the real folder |
| REQ-017 | Gate | 020 AC-016 and the final gate evidence when recorded | matrix/evidence | 13 | The CLI suite, the root project, the doctor suites, the hooks suite, the launcher test, the Hermes plugin tests and the leaf tests pass from the final state, and strict validation prints RESULT: PASSED on this folder and on the 034 parent |

### P1 - Required (complete OR user-approved deferral)

| ID | Item | Evidence | Class | Lane | Requirement |
|----|------|----------|-------|------|-------------|
| REQ-005 | D | `scratch/evidence/closure-guard-final-gC.txt` row C5 | instance-only | 4 | `generate-leaf-manifest.cjs --check` refuses a `leaf-manifest.json` that is a link, with exit 2 and the same `symbolic link, not followed` text that `--write` gives, and reads nothing through it |
| REQ-006 | D | `scratch/evidence/closure-guard-final-gE.txt`, second observation | instance-only | 5 | `readManifestIfExists` in `upgrade-legacy.mjs` refuses a reversibility manifest that is a link, and reads nothing through it |
| REQ-007 | D | `scratch/evidence/closure-guard-final-gE.txt`, first observation | instance-only | 5 | `resolveRoots` refuses a `--roots` argument that holds a `..` segment, before any resolution, so `linkOut/../specs` can no longer name `REPO/specs` |
| REQ-008 | E | `scratch/evidence/closure-guard-final-gD.txt`, observation | class-of-bug | 6 | Each repair-derived apply closure refuses a target that became a link after planning before it reads it, so the outside file is never read |
| REQ-009 | E | `scratch/evidence/closure-guard-final-gD.txt`, 020 Known Limitations item 23 | instance-only | 6 | A JSON parse failure during repair-derived apply reports the file name and the failure kind, and never a fragment of the file's content |
| REQ-010 | F | `scratch/evidence/closure-changelog-hand-fix-part4.txt` | instance-only | 7 | The nested changelog generator writes every Files Changed row, with no cut at 12 |
| REQ-011 | F | 020 Known Limitations items 15 and 17 | instance-only | 7 | `cleanInlineMarkdown` removes every HTML comment, so no comment text reaches a generated changelog |
| REQ-012 | F | scratch/evidence/lane-8-lean-parent.txt, sections 4 and 9 | algorithmic | 8 | A child without loadable graph-metadata.json counts as not complete. A phase parent derives complete only when it has at least one child and every child has loadable metadata with status complete. If no child metadata is loadable, the parent keeps its stored status |
| REQ-013 | G | 020 Known Limitations item 26 | test-isolation | 9 | A run of `ci-rule-set-comparison.vitest.ts` leaves no `scratch/` folder at the repository root that the run created |
| REQ-014 | G | 020 Known Limitations item 3, `scratch/evidence/closure-t046-26-benchmark.txt` | test-isolation | 9 | T046-26 judges the median of repeated calls after a warm-up against the 5 ms limit, still fails on a real slowdown and passes under the CPU load that failed it in 020 |
| REQ-015 | H | 020 Known Limitations item 27 | cross-consumer | 10 | A session that `worktree-session.sh` launches does not carry `AI_SESSION_CHILD=1`, and a descendant of that session still does not create a nested worktree. The marker follows decision 3, answered "A dedicated marker": export a launcher-only variable such as `SKILLED_WORKTREE_SESSION`, check it in the nesting guard and stop exporting `AI_SESSION_CHILD` |
| REQ-016 | H | 020 Known Limitations item 28 | cross-consumer | 10 | The Hermes repo-guards plugin and the gate core agree on what marks a dispatched child. The rule follows decision 4, answered "AI_SESSION_CHILD=1 alone" |
| REQ-018 | C | scratch/evidence/lane-3-archive.txt, RESTORE REFUSAL and Mutant M3-b | instance-only | 3 R2 | archive.sh refuses a restore argument that passes through a link below specs before moving the folder. The source and destination remain unchanged |
| REQ-019 | A | scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, GREEN and MUTANTS | class-of-bug | 1 R2 | declaredLevel and levelFromSpec refuse a linked spec.md before reading it. The refusal keeps the healer's established linked-document exit status |
| REQ-020 | E | scratch/evidence/lane-6-repair-derived.txt, Round 2 Measurement and Round 3 Measurement, Green and Mutant M6-d, scratch/evidence/lane-13-inside-links.txt, Test counts before and after and Review fix P2-2 and P2-6 | class-of-bug | 6 R2 and R3, 13 | The re-derive child refuses a measured input whose real path leaves the packet, and follows an input whose real path stays inside. The Round 3 guard matches the measured read set. Lane 13 adds real-path checks for linked directories and passes the upgrade-legacy neighbor suite |
| REQ-021 | H | scratch/evidence/lane-10-child-marker.txt, Follow-up: case pattern, ENFORCE scope, dry-run note | instance-only | 10 R2 | worktree-session.sh passes shellcheck with no SC2088 warning after the tilde pattern fix, with the case behavior unchanged |
| REQ-022 | H | scratch/evidence/lane-10-child-marker.txt, Follow-up: case pattern, ENFORCE scope, dry-run note | cross-consumer | 10 R2 | SYSTEM_SPEC_GATE_ENFORCE=0 is exported only for the AI_SESSION_CHILD=1 dispatched-child path. Launched sessions and linked-worktree sessions keep the operator's setting |
| REQ-023 | A | scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN and MUTANTS | instance-only | 1 R3 | An unknown healer option or a missing --folder or --roots path exits 2 in every healer mode |
| REQ-024 | D | scratch/evidence/lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c | instance-only | 5 R2 | upgrade-legacy refuses with exit 2 while .skilled/release/.apply.lock exists |
| REQ-025 | E | scratch/evidence/lane-8-lean-parent.txt, Linked canonical docs during metadata derivation | class-of-bug | 8 R3 | readDoc refuses a linked canonical document before reading it, and computeSourceDocHashes skips a linked source document like a missing document |
| REQ-026 | Gate | scratch/evidence/lane-11-016-audit.txt:6, scratch/evidence/lane-16-009-compat-run.txt:16, scratch/evidence/lane-17-t022-corpus.txt:117, scratch/evidence/lane-18-hostile-rerun.txt:37, scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:78 and scratch/evidence/lane-23-015-per-mode.txt:426 | matrix/evidence | 11, 12, 16 to 18, 20, 23 | Each open box in 016 children 003, 009, 011 and 015 is evidenced or remains open with a matching child status. The audit, approved 009 run, T022 apply-twice run, residual-box checks and per-mode validation are recorded. 011 goal criterion 3 remains open by design under 011 Known Limitations item 12. The 015 Known Limitations summary correction is complete under fixO. Evidence: scratch/evidence/decision-ledger.txt:90 |
| REQ-027 | D23 | scratch/evidence/lane-13-inside-links.txt, Scope and Test counts before and after | class-of-bug | 13 | readDoc, computeSourceDocHashes and the re-derive guard follow file or directory links whose real path stays inside the packet. They refuse or skip links that leave the packet or dangle. The healer continues to refuse every link |
| REQ-028 | D24 | scratch/evidence/lane-14-removed-flags.txt, Messages, Required CLI test command and Unmutated control | instance-only | 14 | The removed --mode and --json flags exit 2 with messages that name their removal, explain the current behavior and tell the user to drop the flag. Other unknown flags keep the generic message |
| REQ-029 | D25 | scratch/evidence/lane-15-refusal-wording.txt, Plain folder outside the supplied specs root and Outside folder reached through a linked parent | instance-only | 15 | A plain folder outside the supplied specs root is refused with an outside-root reason. A folder reached through a linked parent keeps the symbolic-link reason |
| REQ-030 | D26 | scratch/evidence/decision-ledger.txt:44 | matrix/evidence | 17 prep | The deprecated specs/sk-communication track is deleted before corpus selection. The impact check found all 1072 files tracked, no untracked files and no outside Markdown links into the track. Both metadata-dependent consumer packets still print RESULT: PASSED. Rebuild the trigger index before the final gate |
| REQ-031 | D27 | scratch/evidence/lane-19-opus-review.txt:25, scratch/evidence/lane-13-inside-links.txt:106, scratch/evidence/lane-15-refusal-wording.txt:46, scratch/evidence/lane-3-archive.txt:82 and scratch/evidence/decision-ledger.txt:52 | class-of-bug | 19, fixA to fixE | Fix all seven review findings. P2-1 corrects system-link refusal wording. P2-2 checks linked directories by real path. P2-3 walks every physical archive prefix below specs. P2-4 uses restore-specific wording. P2-5 names upgrade-legacy.manifest.json in both release notes. P2-6 keeps a parent incomplete unless every child loads and is complete. P2-7 corrects the catalog statement about unknown arguments. The Symbolic Links catalog paragraph now names all three folder refusals |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
| REQ-032 | D28 | scratch/evidence/lane-22-fill-description.txt:3, scratch/evidence/lane-22-fill-description.txt:12, scratch/evidence/lane-22-fill-description.txt:15, scratch/evidence/lane-22-fill-description.txt:24, scratch/evidence/lane-22-fill-description.txt:27, scratch/evidence/lane-22-fill-description.txt:28, scratch/evidence/lane-22-fill-description.txt:73, scratch/evidence/lane-22-fill-description.txt:76 and scratch/evidence/lane-22-fill-description.txt:121 | class-of-bug | 22, fixH | Description inference removes each leading frontmatter block before selecting the first body sentence. The fix repairs all 40 affected documents with one line each, rebuilds and re-derives affected packets, and validates them before and after without a packet moving from PASSED to FAILED |
| REQ-033 | G5 | scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63 | class-of-bug | 26, fixL | The backfill CLI imports `getSpecsBasePaths` through `@spec-kit/runtime/api`, so the CLI check's import policy passes without an allowlist entry |
| REQ-034 | D31 | scratch/evidence/lane-27-root-scratch.txt:18, scratch/evidence/lane-27-root-scratch.txt:25 and scratch/evidence/lane-27-root-scratch.txt:52 | test-isolation | 27, fixM | `validation-gate-hardening.vitest.ts` and `strict-pass-freshness.vitest.ts` remove only a repository-root `scratch/` folder the test run created. Both runs leave no root `scratch/` after the fix |
| REQ-035 | D32 | scratch/evidence/lane-28-dangling-manifest.txt:4, scratch/evidence/lane-28-dangling-manifest.txt:10 and scratch/evidence/lane-28-dangling-manifest.txt:22 | instance-only | 28, fixN | `upgrade-legacy` refuses a dangling reversibility-manifest link in dry run and apply. It leaves the link target absent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every row in `acceptance-criteria.md` is Met, and each code row names a red run on the code at `7a0f0b4375`, a green run after the fix and a mutant run that fails.
- **SC-002**: `validate.sh --strict` prints RESULT: PASSED on this folder and on the 034 parent at closeout.
- **SC-003**: Each suite finishes at or above its starting number from task T002, with 0 failed. The root project no longer fails T046-26.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator decisions D1-D28 (section 10) | Design-dependent lanes need an answered choice before execution | Answers recorded in spec.md section 10 |
| Risk | Decision 1 option 1 refuses a `--folder` outside every repository | Healer test files that heal a temporary packet without `--roots` may start failing | Lane 1 runs the seven healer files before the fix and after it, and adds `--roots` only to the cases the run names |
| Risk | Lane 8 changes how every lean phase parent derives status | A later backfill can flip other parents from `in_progress` to `complete` | Lane 8 runs a dry-run backfill over `specs/` and records each parent whose derived status would change. Nothing is applied |
| Risk | Decision 3 removes the child marker from launched sessions | A launched interactive session now sees Gate 3 like any other session | This is the intended change. Lane 10 lists every reader of `AI_SESSION_CHILD` and classes each one before editing |
| Risk | Lane 2 confines the CLI `--root` | An operator who ran the backfill against another checkout from this one can no longer do that | The run from inside that checkout still works, because the repository is resolved from the working directory first |
| Dependency | Phase 020 evidence | The red cases reuse its fixtures and mutant method | The fixtures are rebuilt under this phase's `scratch/`, because the 020 session scratchpad is not kept |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The CLI suite and the root project change in runtime by no more than noise from the T002 starting numbers. T046-26 keeps its 5 ms limit.

### Security
- **NFR-S01**: No changed path writes, reads or moves a file through a link it checks. No error message echoes the content of a file the run refused or failed to parse.

### Reliability
- **NFR-R01**: No test run leaves a folder at the repository root or under the real `specs/` root. The `ls` listing of both is the same before and after the CLI suite.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A folder under `/tmp` or `/var` on macOS reaches its packet through a system link at the top of the path. The healer must keep working for a folder that a root or a repository reaches, whatever decision 1 says about the rest (REQ-001).
- A `--roots` argument of `.` or a plain relative path is still accepted. Only a `..` segment is refused (REQ-007).
- A child with no loadable graph-metadata.json counts as not complete. A parent with no loadable child keeps its stored status (REQ-012).
- A linked input outside the measured re-derive read set does not block the child after lane 6 round 3 narrows the guard (REQ-020).
- A linked canonical document is refused by readDoc and skipped by computeSourceDocHashes before content is read (REQ-025).
- A Files Changed table with exactly 12 rows and one with 13 rows both render every row (REQ-010).
- An HTML comment that spans a line break inside one paragraph is removed as a whole (REQ-011).

- An existing link whose physical path stays inside the packet is allowed by the graph readers and re-derive guard. Outside and dangling links remain refused or skipped, and the healer still refuses every link (REQ-027).
- The deprecated specs/sk-communication track is removed before the 016/015 corpus selection (REQ-030).

### Error Scenarios
- A link planted at a repair-derived target between planning and apply is refused before any read, and the run reports the refusal, not a parse error (REQ-008).
- A `description.json` that is not valid JSON at apply time fails with its file name and no fragment of its bytes (REQ-009).
- A dangling `leaf-manifest.json` link under `--check` is refused like a live one, and does not read as a missing manifest (REQ-005).
- A prune report root that exists but has no .opencode anchor is refused, and no temporary file is left behind (REQ-003).
- archive.sh --restore refuses a path that passes through a link before it moves the archived packet (REQ-018).
- A linked spec.md is refused at both healer level reads with the linked-document exit status recorded in D21 (REQ-019).
- An unknown healer option or a missing path value exits 2 in every healer mode (REQ-023).
- upgrade-legacy refuses to apply while .skilled/release/.apply.lock exists (REQ-024).

- The removed --mode and --json options receive specific guidance, while another unsupported option keeps the generic refusal (REQ-028).
- A plain folder outside the supplied specs root is described as outside the root, while a linked parent keeps the symbolic-link wording (REQ-029).

### State Transitions
- An alias that points at a packet already under `z_archive` is still caught by the archived-folder check (REQ-004).
- A descendant session that changes directory to the main checkout before it calls the launcher is the case that separates decision 3 option 1 from option 2 (REQ-015).
- When this phase's own packet is added, the 034 parent has a child that is not complete, so the parent must still derive in_progress until phase 021 closes (REQ-012).
- A restore link refusal leaves the archive source and destination in place (REQ-018).
- The 016 child audit aligns each open-box status with its evidence. The T022 corpus run and per-mode checks are recorded. The 011 goal criterion 3 remains open by design under 011 Known Limitations item 12. The 015 summary correction is complete under fixO. Evidence: scratch/evidence/decision-ledger.txt:90 (REQ-026).
- A physical path through a linked repository spelling still checks each archive component below specs, and restore names the restore action (REQ-031, P2-3 and P2-4).
- A phase parent with any unloaded or incomplete child cannot derive complete. The release notes name the reversibility manifest, and the catalog text describes unknown flags and all three folder refusals (REQ-031, P2-5 to P2-7).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | Ten code lanes over 12 production files and 13 test files, across bash, Node, TypeScript and Python |
| Risk | 15/25 | Path containment on five tools, a status rule every lean parent reads and the session marker every runtime reads |
| Research | 6/20 | Each defect is located. The four decisions are design choices, not research |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

The first four design choices needed the operator because code and existing policy did not settle them. The later choices recorded here change follow-up behavior or evidence rules. The operator has answered these choices. Their implementation state remains in tasks.md and acceptance-criteria.md.

- **Decision 1 (REQ-001).** What should the healer do with a --folder that no root and no repository reaches, when no --roots is given? Answered "Refuse, ask for --roots": with no --roots and no anchor, exit 2 with a message to pass --roots. Not chosen: judge every link below the first path component, or keep the approved default and pin it with a test.
- **Decision 2 (REQ-004).** What should archive.sh do when its argument reaches the packet through a link inside specs? Answered "Refuse a linked argument": exit 1 before any copy when the argument or a component below specs is a link, and name the real folder. Not chosen: archive the real folder and remove the alias, or retarget the alias into z_archive.
- **Decision 3 (REQ-015).** What should the launcher export so descendants of a launched session do not re-nest? Answered "A dedicated marker": export a launcher-only variable such as SKILLED_WORKTREE_SESSION, check it in the nesting guard and stop exporting AI_SESSION_CHILD. Not chosen: rely on the linked-worktree check alone, or keep AI_SESSION_CHILD=1 and document it.
- **Decision 4 (REQ-016).** Which rule should the Hermes plugin use for a dispatched child? Answered "AI_SESSION_CHILD=1 alone", as the gate core reads it, which is safe because decision 3 removes the marker from launched sessions. Not chosen: keep the pair and document why, or accept either marker.
- **Decision 5 (REQ-012).** What should the graph rollup do when a phase child has no loadable metadata? Answered "Fix the real gap": count that child as not complete, and keep a parent's stored status when no child metadata is loadable. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 4 and 9. Not chosen: "Drop REQ-012".
- **Decision 6 (REQ-026).** What should happen to the open boxes in 016 children 003, 009, 011 and 015? Answered "Audit and reconcile": each box is ticked with evidence or left open with the child's status set to match. The audit, T022 apply-twice run, residual-box checks and per-mode validation are recorded. 011 goal criterion 3 remains open by design under 011 Known Limitations item 12. The 015 summary correction is complete under fixO. Evidence: scratch/evidence/decision-ledger.txt:90. Not chosen: "Leave them as recorded".
- **Decision 7 (REQ-002).** Which repository root determines backfill containment? Answered "Working directory": judge against the repository where the run starts. Evidence: scratch/evidence/lane-2-backfill.txt, section 9. Not chosen: "Tool's own repository".
- **Decision 8 (REQ-014).** Which evidence should settle the T046-26 behavior? Answered "Use real-load evidence". Lane 21 ran 18 busy loops with load averages from 40 to 43. T046-26 passed on the final code and its control, then failed on the 6 ms mutant at 6.69 ms against the 5 ms limit. G7 ran all 19 jobs with 115 of 117 steps returning rc 0. The deep-loop timeout and main's journey-proof failure are recorded as outside this phase. Evidence: scratch/evidence/lane-24-final-gate.txt, sections 4 to 6, and scratch/evidence/lane-29-final-rederive.txt. Not chosen: "the operator running the busy loop". Evidence: scratch/evidence/lane-21-t046-under-load.txt:16, scratch/evidence/lane-21-t046-under-load.txt:25, scratch/evidence/lane-21-t046-under-load.txt:31 and scratch/evidence/lane-21-t046-under-load.txt:37.
- **Decision 9 (REQ-018).** Should restore use the linked-path refusal too? Answered "Refuse on restore too". Evidence: scratch/evidence/lane-3-archive.txt, RESTORE REFUSAL and Mutant M3-b. Not chosen: "Leave restore as is".
- **Decision 10 (REQ-019).** What should the healer do at its two level reads when spec.md is linked? Answered "Refuse links at both reads". Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, GREEN and MUTANTS. Not chosen: "Record only".
- **Decision 11 (REQ-020).** Should the re-derive child read set be measured and guarded? Answered "Measure, fix if it reads". Round 3 narrowed the guard to the measured read set. Lane 13 then added real-path checks for linked directories, including links that stay inside the packet, and the upgrade-legacy neighbor suite passed. Evidence: scratch/evidence/lane-6-repair-derived.txt, Round 2 Measurement and Round 3 Counts and results, scratch/evidence/lane-13-inside-links.txt, Test counts before and after. Not chosen: "Record only".
- **Decision 12 (REQ-021).** What should happen to shellcheck SC2088 in worktree-session.sh? Answered "Fix it". Evidence: scratch/evidence/lane-10-child-marker.txt, Follow-up: case pattern, ENFORCE scope, dry-run note. Not chosen: "Leave it".
- **Decision 13 (REQ-022).** Where should SYSTEM_SPEC_GATE_ENFORCE=0 be exported? Answered "Dispatched child only". Evidence: scratch/evidence/lane-10-child-marker.txt, Follow-up: case pattern, ENFORCE scope, dry-run note. Not chosen: "Keep it on every path".
- **Decision 14 (REQ-026).** What should happen to the three agent-doable 016/011 boxes? Answered "Do all three". Lane 12 records CHK-FIX-004, CHK-FIX-005 and T011. Lane 18 records the hostile TMPDIR rerun for CHK-FIX-006. Evidence: scratch/evidence/decision-ledger.txt:21 and scratch/evidence/lane-18-hostile-rerun.txt:37, scratch/evidence/lane-18-hostile-rerun.txt:42. Not chosen: "Leave them open".
- **Decision 15 (REQ-023).** What should the healer do with unknown flags or missing path values? Answered "Add checks, exit 2". Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM 2, GREEN and MUTANTS. Not chosen: "Accept the convention".
- **Decision 16 (REQ-026).** What should happen to 016/011 T011? Answered "Count it out, tick T011". Evidence: scratch/evidence/lane-12-anchor-repair-boxes.txt, Box 4. The identity backup remains untouched. Not chosen: "repair the backup" or "leave it open".
- **Decision 17 (REQ-026).** Where should 016/015 T022 run? Answered "Run in a throwaway clone". Apply 1 moved passing packets from 4282 of 4335 to 4335 of 4335. Apply 2 planned no changes, changed no files and kept all 4335 packets passing. Evidence: scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:31, scratch/evidence/lane-17-t022-corpus.txt:110, scratch/evidence/lane-17-t022-corpus.txt:112 and scratch/evidence/lane-17-t022-corpus.txt:117. Not chosen: "Leave it as your item".
- **Decision 18 (REQ-026).** How should the 016/009 manual checks run? Answered "Run it with you approving". The sandbox v3 run is complete with both approvals, STATUS=UPGRADED and validate RESULT: PASSED. Evidence: scratch/evidence/lane-16-009-compat-run.txt, Outcome and p8-validate. Not chosen: "Leave it as your item".
- **Decision 19 (REQ-024).** How should upgrade-legacy handle the apply lock? Answered "Add a code check". Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c. Not chosen: "Keep it an instruction".
- **Decision 20 (REQ-025).** Should the link behavior be fixed at the source readers? Answered "Fix at the source too". Evidence: scratch/evidence/lane-8-lean-parent.txt, Linked canonical docs during metadata derivation. Not chosen: "Keep the repair-derived guard only".
- **Decision 21 (REQ-019).** What exit statuses should the healer and repair-derived keep for linked inputs? Answered "Keep both as built". The healer reports its linked spec.md refusal with exit 0. repair-derived exits 2 when a re-derive input is a link. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, and scratch/evidence/lane-6-repair-derived.txt, Round 2 red, green and mutant results. Not chosen: "Healer exits 2 for this too".

- **Decision 22 (REQ-027 to REQ-031, shared lane execution).** Which executor setup should later implementation lanes use? Answered "Use luna max fast instead of haiku", "Use the working 0.160.1 copy", "Let them finish, LUNA from now" and "up to 4 at once, also use deepseek v4.1 flash max cli pi with llmgateway or cline provider". The original lanes and follow-ups used Claude Haiku 5.5 at xhigh. Later implementation lanes used GPT-6 Luna at max effort. The two small documentation lanes, fixD and fixE, used DeepSeek V4.1 Flash at max. Not chosen: Claude Haiku 5.5 at xhigh for later lanes and the Homebrew 0.162.1 build, which hung on every call. The ledger records no separate alternate wording for the concurrency choice. Source: scratch/evidence/decision-ledger.txt:29.
- **Decision 23 (REQ-027).** Which link policy should the graph readers and re-derive guard use? Answered "Refuse only links that leave". File and directory links that resolve inside the packet are allowed. Outside and dangling links remain refused or skipped, and the healer continues to refuse every link. Evidence: scratch/evidence/lane-13-inside-links.txt, Scope and Test counts before and after. Not chosen: "Relax the guard only" or "Refuse every link".
- **Decision 24 (REQ-028).** What should the healer say about removed flags? Answered "Stop and explain (Recommended)". Both removed flags exit 2 with a message that names the removal, explains current behavior and tells the user to drop the flag. Other unknown flags keep the generic message. Evidence: scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command. Not chosen: "Plain stop" or "Keep ignoring them".
- **Decision 25 (REQ-029).** What should change about the plain-folder refusal wording? Answered "Fix it". A plain folder outside the supplied specs root now gets an outside-root reason. Linked-parent wording remains when a link caused the refusal. Evidence: scratch/evidence/lane-15-refusal-wording.txt, Plain folder outside the supplied specs root and Outside folder reached through a linked parent. Not chosen: "Leave it".
- **Decision 26 (REQ-030).** How should the 016/015 corpus run be scoped? Answered "First delete the deprecated sk communication spec track compeltely , than do packets with work to do". The deprecated track was removed after the impact check. The full dry run inspected 4335 packets, with 4282 passing and 53 failing. Apply 1 moved all 4335 packets to passing. Apply 2 planned no changes, changed no files and recorded the same 133 findings. Evidence: scratch/evidence/decision-ledger.txt:44, scratch/evidence/lane-17-t022-corpus.txt:13, scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:110 and scratch/evidence/lane-17-t022-corpus.txt:117. Not chosen: "the full corpus" or "one sample track".
- **Decision 27 (REQ-031).** What should happen to the seven review findings? Answered "Fix all seven (Recommended)". The review fixes cover P2-1 through P2-7, including the two catalog and release-note updates recorded in the D27 fix lanes. Evidence: scratch/evidence/lane-19-opus-review.txt, Verdict and Findings, scratch/evidence/lane-13-inside-links.txt, Review fix P2-2 and P2-6, scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-1 and P2-7, scratch/evidence/lane-3-archive.txt, Review fix P2-3 and P2-4, scratch/evidence/decision-ledger.txt:52. Not chosen: "fix the code findings only" or "record all seven".

Settled in the plan from the code and the existing policies, so it was not asked:
- Lane 2 confines the CLI --root to the repository the run resolves. upgrade-legacy already refuses a root outside the repository (resolveRoots, line 674), and the in-process runBackfill keeps its destination rule for fixture workspaces.
- Lane 4 makes --check refuse a linked manifest, because --write already refuses the same link (line 475).
- Lane 5 refuses a .. segment in --roots rather than resolving it physically, because --roots is joined to the repository root, so .. has no ordinary use there.
- Lane 7 removes the 12-row cut entirely, because the operator completed the 020 table to all 51 rows by hand.
- **Decision 28 (REQ-032).** What should description inference do when a document has leading frontmatter but no description? Answered "Fix code, repair all 40 (Recommended)". The fix removes each leading frontmatter block before sentence extraction and repairs all 40 affected documents with one line each. The affected packets were re-derived and validated before and after, with no previously passing packet becoming failed. Evidence: scratch/evidence/lane-22-fill-description.txt:3, scratch/evidence/lane-22-fill-description.txt:5, scratch/evidence/lane-22-fill-description.txt:73 and scratch/evidence/lane-22-fill-description.txt:76. Not chosen: "Fix code, repair active 2 only" or "Record it for later".
- **Decision 29 (REQ-017).** How should the worktree integrate remote main? Answered "Fast-forward first (Recommended)". The worktree moved from `ba56b03412` to `5d9c970447`. Not chosen: "commit then merge" or "commit then rebase". Evidence: scratch/evidence/decision-ledger.txt:69.
- **Decision 30 (REQ-017).** How should the main-branch `create-journey-proof.test.cjs` failure be handled? Answered "Record it, don't fix (Recommended)". Not chosen: "fix it here" or "hold the push". Evidence: scratch/evidence/decision-ledger.txt:72 and scratch/evidence/decision-ledger.txt:75.
- **Decision 31 (REQ-034).** How should the root scratch residue in two tests be handled? Answered "Fix both the same way (Recommended)". Not chosen: "record only". Evidence: scratch/evidence/decision-ledger.txt:76 and scratch/evidence/lane-27-root-scratch.txt:52.
- **Decision 32 (REQ-035).** How should the missing lane 5 dangling-manifest case be handled? Answered "Add the test (Recommended)". Not chosen: "record the gap". Evidence: scratch/evidence/decision-ledger.txt:77 and scratch/evidence/lane-28-dangling-manifest.txt:22.
- **Decision 34 (REQ-026).** How should the sandbox-test repair be committed? Answered "Bypass for that file only (Recommended)". The sandbox-test repair was committed alone with the remint bypass. Evidence: scratch/evidence/decision-ledger.txt:97. Not chosen: "leave sandbox-test out" or "bypass for the whole commit".
- **Decision 35 (REQ-017).** How should the 15 commits integrate main? Answered "Rebase our 15 (Recommended)". The commits were rebased onto b62e142852 after the fetch moved origin/main. Evidence: scratch/evidence/decision-ledger.txt:99 and :104. Not chosen: "merge origin/main".
- **Decision 36 (REQ-017).** How should verification run after the rebase? Answered "Full gate again (Recommended)". G8 ran on the rebased commits with 118 steps and 116 rc 0. Evidence: scratch/evidence/decision-ledger.txt:100 and scratch/evidence/lane-30-post-rebase-gate.txt, SUMMARY. Not chosen: "touched suites only" or "push and let CI verify".
- **Decision 37 (REQ-017).** How should the mass-deletion push be handled? Answered "Authorize this push (Recommended)". The push completed from b62e142852 to 01db8367c3. Evidence: scratch/evidence/decision-ledger.txt:107 and scratch/evidence/post-push-ci.txt, PUSH. Not chosen: "push without the deletion" or "don't push yet".
<!-- /ANCHOR:questions -->
