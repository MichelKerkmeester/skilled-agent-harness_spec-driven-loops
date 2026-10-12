---
title: "Implementation Summary"
description: "Records implemented follow-up fixes, operator decisions, available evidence and remaining work."
trigger_phrases:
  - "follow up defect fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes"
    last_updated_at: "2026-10-11T12:16:56Z"
    last_updated_by: "generate-context"
    recent_action: "Closed on push 01db8367c3 with CI green except main's corpus pin"
    next_safe_action: "Monitor main CI and reopen only for a new tooling defect"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes/scratch/evidence/post-push-ci.txt"
      - "specs/system-speckit/034-spec-folder-tooling/021-follow-up-defect-fixes/scratch/evidence/decision-ledger.txt"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs"
    session_dedup:
      fingerprint: "sha256:ee52943b8602c41345ae8fa984697a9ee382fdc688f1fb7642257564553a16a7"
      session_id: "scaffold-021-follow-up-defect-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-follow-up-defect-fixes |
| **Completed** | 2026-10-11 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The recorded fixes address link handling, graph status derivation, changelog generation, launcher behavior and test hygiene. The packet closed after its evidence was pinned, the commits were pushed and CI completed.

### Phase 21: follow-up-defect-fixes

This packet tracks defects found during phase 020. The 016 child audit, approved 009 run, hostile rerun and 015 T022 run are recorded. G7 had 115 of 117 steps at rc 0. G8 had 116 of 118 steps at rc 0. Lane 30 explains both G8 failures. The pushed range is b62e142852..01db8367c3. CI completed with 13 of 14 workflows successful.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs, its tests and .skilled/skills/system-spec-kit/runtime/cli/spec/README.md | Modified | Add the no-root refusal, refuse linked spec.md level reads and give removed --mode and --json flags specific guidance. Evidence: scratch/evidence/lane-1-healer.txt, GREEN and LANE 1 ADDENDUM, plus scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command. |
| .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts and its tests | Modified | Confine backfill writes to the repository and validate prune-report roots. Evidence: scratch/evidence/lane-2-backfill.txt, Green and Mutants. |
| .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh and its tests | Modified | Refuse linked archive and restore arguments before moving folders. Evidence: scratch/evidence/lane-3-archive.txt, Green, RESTORE REFUSAL and Mutant M3-b. |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs, tests and README | Modified | Refuse linked manifests in check mode. Evidence: scratch/evidence/lane-4-leaf-check.txt, Green, Mutant M4-a and Hub check. |
| .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs and its tests | Modified | Refuse linked manifests and dot-segment roots. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, Green and Mutants. |
| .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs and its tests | Modified | Refuse apply reads through links, avoid parse-content leaks and guard the measured re-derive inputs. The neighbor behavior remains open. Evidence: scratch/evidence/lane-6-repair-derived.txt, Green, Round 2 and Round 3. |
| .skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts and its tests | Modified | Preserve every Files Changed row and strip inline HTML comments. Evidence: scratch/evidence/lane-7-changelog.txt, Green and Mutants. |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts, .skilled/skills/system-spec-kit/runtime/lib/graph/generated-metadata-drift.ts and tests | Modified | Count children without metadata as incomplete and handle linked canonical docs at the source readers. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 9 and 10. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/ci-rule-set-comparison.vitest.ts and .skilled/skills/system-spec-kit/runtime/tests/folder-discovery-integration.vitest.ts | Modified | Clean test scratch output and measure T046-26 after warm-up. The real-load run remains open. Evidence: scratch/evidence/lane-9-test-hygiene.txt, Green, Red (b) and Mutant M9-b. |
| .skilled/bin/worktree-session.sh, .skilled/bin/tests/worktree-session.test.sh, .hermes/plugins/repo-guards/__init__.py and its tests | Modified | Keep dispatched-child and launcher markers separate and fix the shellcheck pattern. Evidence: scratch/evidence/lane-10-child-marker.txt, Green, Mutants and Follow-up. |
| spec.md, plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md | Modified | Record decisions, cite lane evidence and leave unresolved work pending. |

| .skilled/changelog/skilled/v4.0.0.4.md and .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md | Modified | Name upgrade-legacy.manifest.json and correct the Linked Paths and Lean Parents text. Add the frontmatter-fill entry. Both validate VALID with 0 issues. Evidence: scratch/evidence/decision-ledger.txt:52 and the release-note headings at .skilled/changelog/skilled/v4.0.0.4.md:202, .skilled/changelog/skilled/v4.0.0.4.md:208, .skilled/changelog/skilled/v4.0.0.4.md:224, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:196, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:202 and .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:218. |
| .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md | Modified | Correct the unknown-argument sentence and name all three folder refusals. The document validates VALID with 0 issues. Evidence: scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-7, scratch/evidence/decision-ledger.txt:52. |
| .skilled/skills/system-spec-kit/runtime/api/index.ts and backfill-graph-metadata.ts | Modified | Export getSpecsBasePaths and import it through the public runtime API. The CLI check passes its import policy. Evidence: scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63. |
| validation-gate-hardening.vitest.ts and strict-pass-freshness.vitest.ts | Modified | Remove only root scratch created by each test run. Evidence: scratch/evidence/lane-27-root-scratch.txt:18, scratch/evidence/lane-27-root-scratch.txt:25 and scratch/evidence/lane-27-root-scratch.txt:52. |
| upgrade-legacy.vitest.ts | Modified | Add the dangling reversibility-manifest case for dry run and apply. Evidence: scratch/evidence/lane-28-dangling-manifest.txt:4, scratch/evidence/lane-28-dangling-manifest.txt:10 and scratch/evidence/lane-28-dangling-manifest.txt:22. |
| .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts, .skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-schema.ts, .skilled/skills/system-spec-kit/runtime/tests/identity-resolver-merge-safety.vitest.ts, .skilled/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts and .skilled/skills/system-spec-kit/runtime/cli/rules/check-metadata-disk-consistency-helper.cjs | Modified | Treat a stored text-null parent id as JSON null in the merge and at schema parse, so every reader sees no parent and METADATA_DISK_PATH_CONSISTENCY passes. A stored real parent is still kept and flagged when the re-derive finds none. The merge test covers a spaced and capitalised value and the path-check detail quotes the stored parent. A fresh Opus high read-only review found no P0 or P1 and three P2s, all fixed. Evidence: scratch/evidence/lane-text-null-parent.txt and scratch/evidence/lane-text-null-review-fixes.txt. |
| specs/sk-communication/ | Deleted | Remove the deprecated track before corpus selection. The impact check covered 1072 tracked files. Evidence: scratch/evidence/decision-ledger.txt:44. |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The first ten implementation lanes and their follow-ups used Claude Haiku 5.5 at xhigh. D22 moved later implementation lanes to GPT-6 Luna at max effort on the operator's instruction. The four exact answers were "Use luna max fast instead of haiku", "Use the working 0.160.1 copy", "Let them finish, LUNA from now" and "up to 4 at once, also use deepseek v4.1 flash max cli pi with llmgateway or cline provider". The working codex-cli copy was 0.160.1 because the Homebrew 0.162.1 build hung on every call. fixD, fixE and fixI to fixK used DeepSeek V4.1 Flash at max. Source: scratch/evidence/decision-ledger.txt:29 for the executor choices. The copied ledger records fixF and fixG at lines 55 and 56 but has no entries for fixI, fixJ or fixK.

Lane 16 completed the approved 009 compatibility run in a sandbox v3 checkout. It returned STATUS=UPGRADED, with passing before=0/1 and after=1/1, and validate RESULT: PASSED with 0 errors and 7 warnings. Evidence: scratch/evidence/lane-16-009-compat-run.txt, Outcome and p8-validate. Lane 18 passed 59 tests with a plain non-default TMPDIR and 122 tests in the hostile run. Evidence: scratch/evidence/lane-18-hostile-rerun.txt, Plain run and Hostile run output.

The fresh review found no P0 or P1 findings. It found seven P2 findings, six confirmed by a run and one confirmed by reading. Fix lanes fixA to fixE closed the findings. The P2-5 release-note correction and the Symbolic Links catalog paragraph are recorded in scratch/evidence/decision-ledger.txt:52. Evidence: scratch/evidence/lane-19-opus-review.txt, Verdict and Findings, scratch/evidence/lane-15-refusal-wording.txt, Review fix P2-1 and P2-7, scratch/evidence/lane-13-inside-links.txt, Review fix P2-2 and P2-6, scratch/evidence/lane-3-archive.txt, Review fix P2-3 and P2-4.

Lane 17 completed the 015 T022 corpus apply twice in a throwaway clone. Apply 1 moved passing packets from 4282 of 4335 to 4335 of 4335. Apply 2 planned no changes, changed no files and recorded the same 133 findings. The repository packets outside this phase that the dry run found failing were unchanged. Evidence: scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:31, scratch/evidence/lane-17-t022-corpus.txt:112 and scratch/evidence/lane-17-t022-corpus.txt:117.
Lane 21 ran T046-26 under load from 40 to 43. It passed on the final code and control and failed on the 6 ms mutant at 6.69 ms against the 5 ms limit. Evidence: scratch/evidence/lane-21-t046-under-load.txt:16, scratch/evidence/lane-21-t046-under-load.txt:25, scratch/evidence/lane-21-t046-under-load.txt:31 and scratch/evidence/lane-21-t046-under-load.txt:37.

Lane 20 rechecked the 016 residual boxes. Four boxes are ticked and 011 goal criterion 3 remains open by design under 011 Known Limitations item 12. Lane 23 applied each of the five 015 modes alone and strict validation passed after each apply. Evidence: scratch/evidence/lane-20-016-residual-boxes.txt:11, scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:78, scratch/evidence/lane-23-015-per-mode.txt:167, scratch/evidence/lane-23-015-per-mode.txt:252, scratch/evidence/lane-23-015-per-mode.txt:330 and scratch/evidence/lane-23-015-per-mode.txt:426.

G5 found an import-policy regression this phase made and a deep-loop load flake. fixL exported `getSpecsBasePaths` from the runtime API and changed the backfill CLI to import it through `@spec-kit/runtime/api`. The orchestrator reran the CLI check and the policy passed. Evidence: scratch/evidence/decision-ledger.txt:66, scratch/evidence/lane-26-import-policy.txt:4 and scratch/evidence/lane-26-import-policy.txt:63.

The worktree fast-forwarded from `ba56b03412` to `5d9c970447` under D29. G6 then found main's `create-journey-proof.test.cjs` failure, the root scratch residue and the missing lane 5 dangling-manifest case. D30 records the choice to leave main's failure alone. fixM closed both scratch leaks and fixN added the dangling-manifest test. G7 later ran all 19 jobs with 115 of 117 steps returning rc 0. The two failures are recorded as outside this phase. Lane 29 then re-derived and validated the packet and both parents. Evidence: scratch/evidence/decision-ledger.txt:69, scratch/evidence/decision-ledger.txt:72, scratch/evidence/decision-ledger.txt:75, scratch/evidence/decision-ledger.txt:76, scratch/evidence/decision-ledger.txt:77, scratch/evidence/lane-27-root-scratch.txt:52 and scratch/evidence/lane-28-dangling-manifest.txt:22.

fixF restored the 009 CHK-023 move-step and manifest-refusal coverage and relabelled seven checked boxes from OPEN to Was open in the 009 and 011 task files. Evidence: scratch/evidence/decision-ledger.txt:55 and ../016-research-recommendations/009-doctor-update-compatibility/tasks.md:130. fixG corrected the 003 plan box and 011 Known Limitations wording while leaving goal criterion 3 open. Evidence: scratch/evidence/decision-ledger.txt:56 and scratch/evidence/lane-20-016-residual-boxes.txt:40. fixI updated Linked Paths and Lean Parents and added the frontmatter-fill entry in both release notes. fixJ updated Known Limitations items 5 and 11 in 015. fixK corrected the relative evidence prefixes in four 016 child files. The ledger records fixI at scratch/evidence/decision-ledger.txt:83, fixJ at :84 and fixK at :85. Evidence: .skilled/changelog/skilled/v4.0.0.4.md:202, .skilled/changelog/skilled/v4.0.0.4.md:208, .skilled/changelog/skilled/v4.0.0.4.md:224, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:196, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:202, .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:218, ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194, ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:200, ../016-research-recommendations/009-doctor-update-compatibility/tasks.md:62, ../016-research-recommendations/011-anchor-repair-mode/plan.md:180, ../016-research-recommendations/015-lane-rules-as-heal-modes/tasks.md:69 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:190.

fixH fixed description inference and repaired all 40 affected descriptions one line each. The corrected mutant proof passed on the control and failed on both reverted cases. Nineteen packets passed validation before and after and the same two failed before and after. Evidence: scratch/evidence/lane-22-fill-description.txt:73, scratch/evidence/lane-22-fill-description.txt:76 and scratch/evidence/lane-22-fill-description.txt:121.

The 15 commits were rebased onto b62e142852 and pushed as b62e142852..01db8367c3. The sandbox-test repair was committed alone as f179c28be6 with the file-only remint bypass (Decision 34). G8 had 116 of 118 steps at rc 0. The j18 rerun passed six of six steps. The deep-loop suite and create-journey-proof test passed in G8. The mass-deletion push to main succeeded. All 14 CI workflows completed on 01db8367c3. Thirteen succeeded. Routing Registry Drift Guard failed on main's corpus pin. Evidence: scratch/evidence/lane-30-post-rebase-gate.txt and scratch/evidence/post-push-ci.txt. The changelog is ../changelog/changelog-034-021-follow-up-defect-fixes.md.

The post-closeout follow-up cleared a stored text-null parent id in `mergeGraphMetadata`. Three new cases in `identity-resolver-merge-safety.vitest.ts` failed 1 of 18 before the fix and all 18 passed after it. The file with `graph-metadata-schema.vitest.ts` passed 71 tests and `repair-derived.vitest.ts` passed 36, with typecheck and build at exit 0. The probe on `specs/system-speckit/027-xce-research-based-refinement` wrote JSON null and validation printed `METADATA_DISK_PATH_CONSISTENCY` passing and `RESULT: PASSED`, against `RESULT: FAILED` with the old parser. A second fresh Opus high read-only review found no P0 or P1 and three P2s, and the operator chose to fix all three. The review fixes add a stored " NULL " case to the merge test, quote the stored parent in the path-check detail and normalize the text at parse in `graph-metadata-schema.ts`, so every reader sees no parent. The merge and schema files then passed 72 tests at exit 0 against a red control of 1 failed and 71 passed, and `validation-gate-hardening.vitest.ts` passed 7, with typecheck and build at exit 0. Evidence: scratch/evidence/lane-text-null-parent.txt for the first fix and scratch/evidence/lane-text-null-review-fixes.txt for the review fixes.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Decision 1, healer with no root: "Refuse, ask for --roots". With no --roots and no anchor, the healer exits 2 with a message to pass --roots | The operator chose it on 2026-10-10. It leaves no link unjudged and matches the healer's refusal when --roots is given. Evidence: scratch/evidence/lane-1-healer.txt, GREEN. |
| Decision 2, archive alias: "Refuse a linked argument". Exit 1 before any copy when the argument or a component below specs is a link, and name the real folder | The operator chose it on 2026-10-10. Archive refuses every link it checks and leaves no dangling alias. Evidence: scratch/evidence/lane-3-archive.txt, Green. |
| Decision 3, launcher marker: "A dedicated marker". Export a launcher-only variable such as SKILLED_WORKTREE_SESSION, check it in the nesting guard and stop exporting AI_SESSION_CHILD | The operator chose it on 2026-10-10. Descendants still do not re-nest and a launched session no longer reads as a dispatched child. Evidence: scratch/evidence/lane-10-child-marker.txt, Green. |
| Decision 4, Hermes rule: "AI_SESSION_CHILD=1 alone" | The operator chose it on 2026-10-10. The plugin reads a dispatched child the way the gate core does. Evidence: scratch/evidence/lane-10-child-marker.txt, Green. |
| D5, REQ-012: "Fix the real gap" | A child without loadable metadata counts as incomplete. A parent with no loadable child keeps its stored status. Two parents change on their next re-derive and neither was re-derived here. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 9 and 10. |
| D6, REQ-026: "Audit and reconcile" | Lane 11, lane 16, lane 17, lane 18, lane 20 and lane 23 record the audit and follow-up evidence. 011 goal criterion 3 remains open by design. The 015 summary records the resolved phase 13 item and verification status. Evidence: scratch/evidence/lane-11-016-audit.txt:6, scratch/evidence/lane-16-009-compat-run.txt:16, scratch/evidence/lane-17-t022-corpus.txt:117, scratch/evidence/lane-18-hostile-rerun.txt:37, scratch/evidence/lane-20-016-residual-boxes.txt:40, scratch/evidence/lane-23-015-per-mode.txt:426 and ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:194, ../016-research-recommendations/015-lane-rules-as-heal-modes/implementation-summary.md:200. |
| D7, REQ-002: "Working directory" | Judge containment against the repository where the run starts. Evidence: scratch/evidence/lane-2-backfill.txt, section 9. |
| D8, REQ-014: "Use real-load evidence" | Lane 21 records green evidence under load from 40 to 43. T046-26 passed on the final code and its control and failed on the 6 ms mutant. G7 ran with load sampled and logged 115 of 117 steps rc 0. The two failed steps are outside this phase. Evidence: scratch/evidence/lane-21-t046-under-load.txt:16, :25, :31 and :37. G7 is recorded in scratch/evidence/lane-24-final-gate.txt, sections 4 to 6. |
| D9, REQ-018: "Refuse on restore too" | Refuse a linked restore path before moving the folder. Evidence: scratch/evidence/lane-3-archive.txt, RESTORE REFUSAL and Mutant M3-b. |
| D10, REQ-019: "Refuse links at both reads" | Refuse a linked spec.md at declaredLevel and levelFromSpec. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, GREEN and MUTANTS. |
| D11, REQ-020: "Measure, fix if it reads" | Lane 13 applies real-path checks to linked directories, allows links that stay inside the packet and passes the upgrade-legacy neighbor suite. Evidence: scratch/evidence/lane-6-repair-derived.txt, Round 3 and Neighbor check, scratch/evidence/lane-13-inside-links.txt, Test counts before and after. |
| D12, REQ-021: "Fix it" | Fix SC2088 while preserving the tilde path case. Evidence: scratch/evidence/lane-10-child-marker.txt, Follow-up: case pattern. |
| D13, REQ-022: "Dispatched child only" | Export SYSTEM_SPEC_GATE_ENFORCE=0 only for the AI_SESSION_CHILD=1 path. Evidence: scratch/evidence/lane-10-child-marker.txt, Follow-up: ENFORCE scope. |
| D14, REQ-026: "Do all three" | Lane 12 records CHK-FIX-004, CHK-FIX-005 and T011. Lane 18 records the hostile rerun that closes CHK-FIX-006. Evidence: scratch/evidence/decision-ledger.txt:21 and scratch/evidence/lane-18-hostile-rerun.txt, Hostile run output. |
| D15, REQ-023: "Add checks, exit 2" | Lane 1 evidence records green argument checks and mutants. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM 2. |
| D16, REQ-026: "Count it out, tick T011" | Leave the identity backup untouched. Evidence: scratch/evidence/lane-12-anchor-repair-boxes.txt, Box 4. |
| D17, REQ-026: "Run in a throwaway clone" | Apply 1 and apply 2 are recorded in lane 17. Apply 2 planned no changes and changed no files. Evidence: scratch/evidence/lane-17-t022-corpus.txt:110, scratch/evidence/lane-17-t022-corpus.txt:112 and scratch/evidence/lane-17-t022-corpus.txt:117. |
| D18, REQ-026: "Run it with you approving" | The 009 sandbox run completed with both approvals and validate RESULT: PASSED. Evidence: scratch/evidence/lane-16-009-compat-run.txt, Outcome and p8-validate. |
| D19, REQ-024: "Add a code check" | Lane 5 evidence records four focused lock cases and a mutant. Evidence: scratch/evidence/lane-5-upgrade-legacy.txt, section 2, Test counts and Mutant M5-c. |
| D20, REQ-025: "Fix at the source too" | readDoc refuses linked canonical docs and computeSourceDocHashes skips linked source docs. The folder-discovery description reader was left unchanged. Evidence: scratch/evidence/lane-8-lean-parent.txt, section 10. |
| D21, REQ-019 and REQ-020: "Keep both as built" | The healer's linked spec.md refusal keeps exit 0 and repair-derived refuses a linked re-derive input with exit 2. Evidence: scratch/evidence/lane-1-healer.txt, LANE 1 ADDENDUM, and scratch/evidence/lane-6-repair-derived.txt, Round 2. |
| D22, shared lane execution: "Use luna max fast instead of haiku", "Use the working 0.160.1 copy", "Let them finish, LUNA from now", "up to 4 at once, also use deepseek v4.1 flash max cli pi with llmgateway or cline provider" | Later implementation lanes used GPT-6 Luna at max effort. fixD and fixE used DeepSeek V4.1 Flash at max for two small documentation changes. Not chosen: Claude Haiku 5.5 at xhigh for later lanes and the Homebrew 0.162.1 build, which hung on every call. Source: scratch/evidence/decision-ledger.txt:29. |
| D23, REQ-027: "Refuse only links that leave" | Graph readers and the re-derive guard follow links whose real path stays inside the packet. Outside and dangling links remain refused or skipped, and the healer still refuses every link. Evidence: scratch/evidence/lane-13-inside-links.txt, Scope and Test counts before and after. |
| D24, REQ-028: "Stop and explain (Recommended)" | The removed flags receive specific guidance and other unknown flags keep the generic message. Evidence: scratch/evidence/lane-14-removed-flags.txt, Messages and Required CLI test command. |
| D25, REQ-029: "Fix it" | A plain folder outside the supplied specs root gets an outside-root reason. A linked parent keeps the symbolic-link reason. Evidence: scratch/evidence/lane-15-refusal-wording.txt, Plain folder and linked-parent cases. |
| D26, REQ-030: "First delete the deprecated sk communication spec track compeltely , than do packets with work to do" | The track was removed after its impact check. The dry run inspected 4335 packets, with 4282 passing and 53 failing. Apply 1 moved all 4335 packets to passing. Apply 2 planned no changes, changed no files and recorded the same 133 findings. Evidence: scratch/evidence/decision-ledger.txt:44, scratch/evidence/lane-17-t022-corpus.txt:13, scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:110 and scratch/evidence/lane-17-t022-corpus.txt:117. Not chosen: "the full corpus" or "one sample track". |
| D27, REQ-031: "Fix all seven (Recommended)" | fixA to fixE close P2-1 through P2-7. The release notes name upgrade-legacy.manifest.json and the Symbolic Links catalog paragraph names all three folder refusals. Evidence: scratch/evidence/lane-19-opus-review.txt:25, scratch/evidence/lane-13-inside-links.txt:106, scratch/evidence/lane-15-refusal-wording.txt:46, scratch/evidence/lane-3-archive.txt:82 and scratch/evidence/decision-ledger.txt:52. Not chosen: "fix the code findings only" or "record all seven". |
| D28, REQ-032: "Fix code, repair all 40 (Recommended)" | The fix removes every leading frontmatter block before description inference and repairs all 40 affected documents one line each. The before-and-after validations show no previously passing packet became failed. Evidence: scratch/evidence/lane-22-fill-description.txt:3, scratch/evidence/lane-22-fill-description.txt:5, scratch/evidence/lane-22-fill-description.txt:73 and scratch/evidence/lane-22-fill-description.txt:76. Not chosen: "Fix code, repair active 2 only" or "Record it for later". |
| D29, REQ-017: "Fast-forward first (Recommended)" | The worktree fast-forwarded from ba56b03412 to 5d9c970447 before the final gate. Not chosen: "commit then merge" or "commit then rebase". Evidence: scratch/evidence/decision-ledger.txt:69. |
| D30, REQ-017: "Record it, don't fix (Recommended)" | The create-journey-proof failure came from main and stays outside this phase. Not chosen: "fix it here" or "hold the push". Evidence: scratch/evidence/decision-ledger.txt:72 and scratch/evidence/decision-ledger.txt:75. |
| D31, REQ-034: "Fix both the same way (Recommended)" | fixM changed both tests to remove only root scratch that they created. Not chosen: "record only". Evidence: scratch/evidence/decision-ledger.txt:76 and scratch/evidence/lane-27-root-scratch.txt:52. |
| D32, REQ-035: "Add the test (Recommended)" | fixN added the dangling reversibility-manifest case and the target stays absent. Not chosen: "record the gap". Evidence: scratch/evidence/decision-ledger.txt:77 and scratch/evidence/lane-28-dangling-manifest.txt:22. |
| Accepted deviation: heal-target-parity "alone" case | The accepted setup uses the fixture root as its working directory. Source: scratch/evidence/decision-ledger.txt:33. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Lane evidence | Red, green and mutant results are recorded per lane where available. Open work is listed in Known Limitations. |
| G7 final gate | 19 job wrappers exited 0. 115 of 117 steps returned rc 0. The two failures are listed in Known Limitations 10 and 11. |
| CLI suite | T002: 176 files, 1,953 passed, 20 skipped. G7: 177 files, 2,012 passed, 20 skipped, 0 failed. |
| Root project | T002: 1,306 passed, 1 failed, 13 skipped. G7: 1,316 passed, 0 failed, 13 skipped. T046-26 now passes. |
| Deep-loop | T002: 2,879 passed, 0 failed, 8 skipped. G7: 2,895 passed, 1 failed, 8 skipped. The whole job passed alone with 2,896 passed and 8 skipped. |
| Hooks | T002: 186 passed, 0 failed. G7: 186 passed, 0 failed. |
| Doctor | T002: 7 suites passed. G7: 7 suites passed, 0 failed, plus 11 of 11 Vitest tests. |
| Hostile environment | T002: 13 files. 345 passed, 2 skipped. 3 files. 159 passed. Validation 148 passed. G7: 17 files. 445 passed, 2 skipped. 4 files. 211 passed. Validation 148 passed, 0 failed. |
| Lint | T002 rc 0. G7 every step rc 0. |
| Trigger index | Rebuild and --check returned 0 obsolete paths and 0 untrusted docs. |
| Strict validation after re-derive | Lane 29: 021 RESULT: PASSED. 016 parent: 17 passed, 0 failed and 1 warning. 034 parent: 22 passed, 0 failed and 0 warnings. |
| T002 comparison | Every suite this phase touches met or beat its starting number. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Two phase parents are expected to change from complete to in_progress on their next re-derive. Neither was re-derived here. Evidence: scratch/evidence/lane-8-lean-parent.txt, sections 8 and 9.
2. Lane 9's 20.7 load average on 18 cores was its baseline before the fix. Lane 21 supplies under-load green and mutant evidence. G7 ran with load sampled and every suite this phase touches met or beat T002. Two gate steps failed outside this phase. Evidence: scratch/evidence/lane-21-t046-under-load.txt:16, :25 and :37. See scratch/evidence/lane-24-final-gate.txt, sections 4 to 6.
3. Only Bash 3.2.57 was available. The Bash 5.2 check was not run. The restore red was reproduced by its mutant in a mirror and was not run against the unfixed repository. Evidence: scratch/evidence/lane-3-archive.txt, Bash check and restore refusal note.
4. The backfill CLI was not run end to end on a fixture and other folder-discovery callers were not assessed further. Evidence: scratch/evidence/lane-8-lean-parent.txt, section 10, folder-discovery finding and Limit.
5. The 016 child document pass and the 015 T022 corpus apply-twice run are recorded. The dry run inspected 4335 packets, with 4282 passing and 53 failing. 011 goal criterion 3 remains open by design. Evidence: scratch/evidence/lane-17-t022-corpus.txt:13, scratch/evidence/lane-17-t022-corpus.txt:30, scratch/evidence/lane-17-t022-corpus.txt:117 and scratch/evidence/lane-20-016-residual-boxes.txt:40.
6. The healer parser does not accept --flag=value for existing flags. The removed --mode and --json flags now receive specific messages. Evidence: scratch/evidence/lane-14-removed-flags.txt, parser note and Messages.
7. Lane 24 records G7 and the trigger-index rebuild. Lane 29 records pre-push validation. Lane 30 records G8. Post-push CI and the nested changelog are recorded. This summary's continuity block awaits the later save. Evidence: scratch/evidence/lane-24-final-gate.txt, scratch/evidence/lane-29-final-rederive.txt, scratch/evidence/lane-30-post-rebase-gate.txt and scratch/evidence/post-push-ci.txt.
8. The corpus apply ran in a throwaway clone (D17). In the repository itself, the packets outside this phase that the dry run found failing are unchanged.
9. 016/011 goal criterion 3 stays open by design. See 011 Known Limitations item 12.
10. The deep-loop fanout-run test "lets the --containment-mode flag override the fan-out config value, and rejects an unknown value" timed out under full gate load in G5 at 30,253 ms, in G6 at 30,253 ms and in G7 at 30,060 ms against a 30,000 ms limit. After G7, three verbose runs passed in 21,310 ms, 20,354 ms and 19,779 ms. The whole file passed 167 of 167 twice after G5 and twice after G6. The whole deep-loop job passed alone after G7 with 2,896 passed and 8 skipped. The suite passed in G8 with 2,690 tests and 8 skipped. No system-deep-loop file changed. Evidence: scratch/evidence/lane-24-final-gate.txt, section 6. The G8 result appears in scratch/evidence/lane-30-post-rebase-gate.txt, SUMMARY.
11. The sk-doc create-journey-proof.test.cjs failure no longer reproduces after main's 4ce75d6fe1 change aligned registry aliases and router keywords. The test passed in G8. Evidence: scratch/evidence/lane-30-post-rebase-gate.txt, SUMMARY.
12. Main's Routing Registry Drift Guard failed in post-push CI with "CORPUS DRIFTED FROM PIN". Main's holdout-prompts.jsonl changed in e052417268 without a new pin. The 15 pushed commits do not touch .skilled/skills/system-skill-advisor. Main failed the same step before this push. Evidence: scratch/evidence/post-push-ci.txt, THE ONE FAILURE. Lane 30 records the hash comparison in SUMMARY item 2.
<!-- /ANCHOR:limitations -->
