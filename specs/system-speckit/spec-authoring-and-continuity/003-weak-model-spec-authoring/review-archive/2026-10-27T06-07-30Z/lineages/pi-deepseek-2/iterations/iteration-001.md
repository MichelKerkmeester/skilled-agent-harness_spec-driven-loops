# Iteration 1 - Parent packet self-consistency (correctness inventory pass)

## Focus

Correctness of the phase parent's own authored surface: `spec.md`, `goal.md`, `description.json` and `graph-metadata.json`, read against each other and against the frozen decisions in `goal.md` D1-D8. This is the inventory pass: it establishes the artifact map the later nine iterations drill into, and it treats every parent-level status, pointer and executor claim as a claim to verify rather than a source of truth.

Scope note: the packet is a phase parent, so only `spec.md` and `goal.md` are authored at this level. The nine phase children, their `acceptance-criteria.md` rows and the implementation surface (`templates/core/*.tmpl`, `runtime/cli/spec/check-placeholders.sh`, `check-example-drift.sh`, `check-card-sync.sh`, `SKILL.md`) are the drill-down targets for iterations 2 to 10.

## Files Reviewed

- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:1-176`
- `specs/system-speckit/054-weak-model-spec-authoring/goal.md:1-173`
- `specs/system-speckit/054-weak-model-spec-authoring/description.json:1-27`
- `specs/system-speckit/054-weak-model-spec-authoring/graph-metadata.json:1-190`
- `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/goal.md:120-145`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/plan.md:437-441`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:108`
- `.skilled/skills/system-spec-kit/references/workflows/auto-mode-contract.md:121,191`
- `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md:30`
- `specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl` (72 rows, counted)

## Findings

### P0 Findings

None. No finding in this iteration breaks a shipped behavior or contradicts a frozen decision in the shipped code path.

### P1 Findings

1. **Obsolete `/spec_kit:` command prefix survives in the shipped phase-parent template and five reference docs, and no ledger row ever owned it** -- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:143` -- The parent spec inherits `- Use \`/spec_kit:resume [parent-folder]/[NNN-phase]/\` to resume a specific phase` from `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:108`, which still carries the same line after all nine phases. The command namespace on disk is `speckit` (`.skilled/commands/speckit/resume.md` exists; `.skilled/commands/spec_kit` does not), so the shipped template teaches a command that cannot resolve. The phase 001 census already knew this: it recorded `NEW-14 ... phase-parent.spec.md.tmpl:108: The resume instruction uses the obsolete /spec_kit:resume command` and `NEW-12`/`NEW-13` for `auto-mode-contract.md` and `nested-changelog.md` in `001-template-drift-census-and-baseline/goal.md:141-143`, each with "Not added because the exact locator and evidence row must be constructed by the owner phase". No owner phase ever constructed them: `rg -n "phase-parent.spec.md.tmpl" .../scratch/ledger/ledger.jsonl` returns zero rows out of 72, and `auto-mode-contract.md:191`, `auto-mode-contract.md:121` and `nested-changelog.md:30` still read `/spec_kit:`. The repair phase therefore closed while the defect class it was handed stayed open in the exact file the packet's own parent document was generated from.
   - Claim: a defect the census verified is still shipped, and the packet's own `spec.md` reproduces it.
   - Evidence refs: `spec.md:143`, `phase-parent.spec.md.tmpl:108`, `auto-mode-contract.md:191`, `nested-changelog.md:30`, `001-template-drift-census-and-baseline/goal.md:143`.
   - Counterevidence sought: a later owner phase adopting the row, and a `spec_kit` command alias anywhere under `.skilled/commands/`. Neither exists.
   - Alternative explanation: `/spec_kit:resume` might be an intentional historical alias kept for old packets. Rejected: the packet's own transition rule targets a live command (`[parent-folder]/[NNN-phase]/` matches `speckit/resume.md`'s phase-resume contract) and every other packet document uses the `speckit` namespace.
   - Final severity: P1, confidence 0.9.
   - Downgrade trigger: a ledger row or commit showing the three locators were repaired in a later phase; or a shipped `spec_kit` command alias in the repo.

2. **The parent spec's launch precondition names `swe-2-max` as the benchmark subject, contradicting its own Out of Scope section and the frozen decision D8** -- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:117` -- Line 117 closes with "The benchmark subject is cli-devin `swe-2-max`." Line 92 of the same document puts "Measuring models other than cli-devin deepseek-v4-1-flash-1017-max for the deciding benchmark" out of scope, and `goal.md:54` (D8) freezes the subject as `deepseek-v4-1-flash-1017-max`. Section 4 of the same spec already records the supersession ("Superseded on 2026-10-25: the operator ruled out the swe-2 models"), so line 117 is the one stale copy. A reader who trusts the launch-precondition list runs the wrong subject, which is the measurement the whole packet is judged by.
   - Claim: two contradictory statements of the deciding benchmark subject inside one frozen-ish section.
   - Evidence refs: `spec.md:117`, `spec.md:92`, `spec.md:165`, `goal.md:54`.
   - Counterevidence sought: any later parent-level amendment that re-names swe-2-max as the subject. `goal.md` section 4 names swe-2-max only as history.
   - Alternative explanation: precondition 4 might be describing only the review executor, leaving the subject to D8. Rejected: the sentence explicitly says "The benchmark subject is ...".
   - Final severity: P1, confidence 0.88.
   - Downgrade trigger: a parent-level decision record or amendment that supersedes D8 for the subject, or a corrected line 117 in a later commit.

### P2 Findings

1. **`graph-metadata.json` contradicts the parent status and still points at phase 004 as the last active child** -- `specs/system-speckit/054-weak-model-spec-authoring/graph-metadata.json:47` -- `derived.status` reads `in_progress` while `spec.md:50` reads `Complete`, and `derived.last_active_child_id` (`graph-metadata.json:183`) names `004-template-section-fill-guidance` with `last_active_at` of `2026-10-24T16:02:41.734Z`, five phases before the packet closed. The file's own `derived.source_fingerprint_docset` and `last_save_at` show it was refreshed on 2026-10-25, so the pointer is stale rather than frozen at creation.

2. **The parent's `Branch` metadata names `main` while every phase ran on the worktree branch** -- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:52` -- `goal.md` records `WORKTREE` as `.worktrees/217-weak-model-spec-authoring` on branch `worktrees/217-weak-model-spec-authoring`, created by `worktree-naming.sh create`, and the parent spec's own branch row still reads `main`. The row is inherited from the phase-parent template, so the drift will repeat in every packet generated from it.

3. **Two parent-spec pointers dangle: `Parent Spec: ../spec.md` resolves to a file that does not exist, and section 4 defers to a phase 003 decision record that was never created** -- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:53` -- `spec.md:53` points at `../spec.md`, which from the packet root is `specs/spec.md` (absent; `specs/system-speckit/spec.md` is also absent). `spec.md:166` states the post-edit scanner question "is decided in the phase 003 decision record", while `find specs/system-speckit/054-weak-model-spec-authoring -name 'decision-record*'` returns nothing and the decision actually lives in `003-versioned-placeholder-gate/plan.md:437` (`### ADR-003: Record two defects in the post-edit scanner and leave the file alone`). Both are template-inherited, so the weak-model failure mode the packet targets (copying a pointer that leads nowhere) is still present.

## Traceability Checks

- `spec_code` (core, partial this pass): the parent's "Files to Change" phase owners were spot-checked against the phase folders that exist (`002, 004`, `003`, `005`, `006`, `007`, `008, 009`, `041-006`). All nine phase folders exist with the documented names. Full spec-to-code mapping is deferred to iterations 2, 3 and 6.
- `checklist_evidence` (core, deferred): phase acceptance rows are not yet audited; deferred to iteration 2.
- Overlay protocols (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`): not applicable to a parent-level document pass; deferred to iterations 6 and 7.
- `description.json`: `level: "2"` agrees with `spec.md:29` `SPECKIT_LEVEL: 2`; `specFolder`, `specId` and `folderSlug` agree with the folder name. `memoryNameHistory` carries one detached-review memory name, which is runtime bookkeeping, not a packet claim.

## Confirmed-Clean Surfaces

- Parent status `Complete` (`spec.md:50`) is consistent with the goal log's final entry: the operator's hold on the status was released once criterion 5 passed on the second fresh set, and every phase row in the phase map reads `Complete`.
- The `Waived`/`Superseded` ADR clause in the acceptance-criteria template is vacuous for this packet: `rg '\| (Waived|Superseded) \|'` over all nine `acceptance-criteria.md` files returns no rows, so the absence of `decision-record.md` in the phase folders does not break the clause. `folder-structure.md:140` also states `decision-record.md` is created on request and skipped silently when absent.
- `D6` ("every phase is Level 3") is not contradicted by the parent's Level 2 marker: the parent is a phase parent and carries no `plan.md`/`tasks.md`, and each phase child declares `Level: 3`.

## Assessment

Dimensions addressed: correctness

Five findings, two of them P1: a repair the census specified and no phase executed, and a benchmark-subject contradiction inside the parent's own scope section. Both are documentation-level defects in the packet that is supposed to make documentation followable, so they land on the packet's central claim rather than on incidental prose. The three P2 items are template-inherited metadata drift; fixing them only in this packet would leave the same defects in every packet scaffolded from the phase-parent template.

## Next Focus

Iteration 2 (traceability, core protocol `checklist_evidence`): audit the seven parent completion criteria in `goal.md` §3 and the nine phase `acceptance-criteria.md` tables against the recorded evidence artifacts — `009-authoring-benchmark-and-closeout/scratch/closeout/criteria.txt`, `criteria-c2.txt`, `criteria-c4c6.txt`, the benchmark reports and the phase 008 report — and check whether each `Met` row's Verification command is reproducible from the shipped tree.

Review verdict: CONDITIONAL
