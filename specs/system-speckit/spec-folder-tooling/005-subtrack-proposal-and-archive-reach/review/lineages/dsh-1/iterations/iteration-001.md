# Iteration 1 - Correctness: exit-status and next-number documentation

## Dispatcher

- Mode: review
- Dimension: correctness
- Review target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Artifact directory: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/dsh-1`
- Operator focus: manifest-scoped documentation alignment, highest yield on docs stale against phases 006 to 010.
- Budget profile: verify (11-13 tool calls). No nested dispatch was performed.

## Files Reviewed

- `goal-file-manifest.txt` (74 entries, all present and file-typed)
- `006-relocate-resume-and-preflight/goal.md`
- `008-restore-and-phase-numbering/goal.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md`
- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md`
- `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md`
- `.skilled/skills/system-spec-kit/SKILL.md`
- `.skilled/skills/system-spec-kit/references/structure/phase-definitions.md`
- `.skilled/skills/system-spec-kit/README.md`
- `README.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Relocation docs still state the pre-008 exit contract and omit status 3** -- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66` -- The authoritative phase 008 decision adds status 3 for a run whose steps and close sweep landed and whose only failure is a moved packet's own strict validation. The feature page still says status 2 covers "a failed close" and never mentions status 3, so a reader treats a successful, landed relocation as a failed run.

Case: an operator applies a map whose moved packet fails its own strict validation. `relocate.mjs` exits 3 and every move and the sweep have landed; the feature page tells the operator that exit 2 means a failed close and omits the 3 contract, so the operator may rerun the map expecting a failed step or may roll back a landed move. The rerun prints `nothing to do` and exits 0 per the same decision, but the page never tells them that.

- File: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering/goal.md:44]` defines status 3 and the rerun contract; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs:1661]` sets `status = 3` when only the moved packet's validation fails; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:120]` already documents the 0/1/2/3 contract.
- User impact: operators cannot distinguish a landed move with an advisory packet failure from a refused or stopped move, and scripts that branch on exit 2 versus 3 get a contract the docs do not describe.
- Finding class: cross-consumer
- Scope proof: the same pre-008 wording appears in `feature-catalog/feature-catalog.md:690` and `changelog/v2.13.0.0.md:67`; the current contract appears only in `runtime/cli/spec/README.md:120` and the phase goal. `rg -n "Exit 2 means the plan was refused|Status 2 means a rejected|exits 1 when a dry run"` over the three stale surfaces returns all three.
- Affected surface hints: ["feature catalog page", "feature catalog root summary", "changelog", "relocation CLI operator guide"]
- Claim adjudication:

```json
{"type":"claim","claim":"The relocation feature page and changelog state a 0/1/2 exit contract that omits the phase-008 status 3, so a landed run with one failed moved-packet validation is documented as a failed close.","evidenceRefs":["feature-catalog/tooling-and-scripts/spec-packet-relocation.md:66","changelog/v2.13.0.0.md:67","feature-catalog/feature-catalog.md:690","008-restore-and-phase-numbering/goal.md:44","runtime/cli/spec/relocate.mjs:1661","runtime/cli/spec/README.md:120"],"counterevidenceSought":"Checked the command README, the changelog upgrade notes, and the phase 008 goal for an alternate status meaning; the command README is current and the phase goal confirms the third status.","alternativeExplanation":"The three stale surfaces may be a deliberate pre-008 release snapshot; however the package version is still 2.13.0.0 and these are the only feature/changelog surfaces a reader reaches for the current command.","finalSeverity":"P1","confidence":0.96,"downgradeTrigger":"If the feature page and changelog are declared historical snapshots and a current release page carries the 0/1/2/3 contract, downgrade to P2."}
```

2. **The published next-number command ignores archived packets** -- `.skilled/skills/system-spec-kit/SKILL.md:295` -- The quick-reference command lists only `specs/[0-9]*/`, so it computes the next number from live packets alone. Decision D4 and `create.sh` both count `specs/z_archive/` numbers as taken. The reference repeats the omission at `phase-definitions.md:82`.

Case: a root has live `001-a` and archived `z_archive/007-b`. The SKILL command prints `001` as the highest live number and a person following it chooses `002`, colliding with the archived `007` range that `create.sh` would have skipped by selecting `008`. The same guide also presents this command as the quick-reference answer for the next spec number.

- File: `.skilled/skills/system-spec-kit/SKILL.md:295`
- Evidence: `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1644]` iterates both `"$SPECS_DIR"/*` and `"$SPECS_DIR"/z_archive/*`; `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering/goal.md:47]` requires the next phase to clear live and archived children; `[SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:82]` still says "after the highest numbered packet".
- User impact: a manual next-number calculation can reuse a number that a closed/archived packet still owns, which is exactly the collision D4 and phase 008 exist to prevent.
- Finding class: cross-consumer
- Scope proof: `rg -n "Next spec number|next number after the highest numbered packet"` over the changed docs returns the two stale surfaces; `create.sh` is the only producer that implements both live and archived counting. No other changed doc presents a competing command.
- Affected surface hints: ["SKILL quick-reference table", "phase-definitions track creation guide", "create.sh numbering"]
- Claim adjudication:

```json
{"type":"claim","claim":"The SKILL quick reference and the phase-definition guide compute or describe the next packet number without counting archived packets, contrary to D4 and create.sh.","evidenceRefs":["SKILL.md:295","references/structure/phase-definitions.md:82","runtime/cli/spec/create.sh:1644","008-restore-and-phase-numbering/goal.md:47"],"counterevidenceSought":"Searched the remaining changed docs for a note that the command is root-only or that archives are intentionally excluded; no such caveat exists. Checked whether the command's root-only scope avoids the archived case; it does not, because the root z_archive is beside the same root.","alternativeExplanation":"The quick-reference command may be intended as a simplified live-only example rather than a numbering authority, but it is labeled 'Next spec number' and is the only command offered, so readers will use it as the answer.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"If the table is annotated as live-only and points to create.sh as the authoritative counting surface, downgrade to P2."}
```

### P2 Findings

1. **Root and skill READMEs summarize relocation without the status-3 contract** -- `.skilled/skills/system-spec-kit/README.md:639` -- The same pre-008 omission appears in the two user-facing command summaries. Both are short summaries rather than full references, so the omission is advisory, but the summaries are the first place an operator looks.

Case: a reader who starts from the skill README sees only "Dry run by default, `--apply` writes" and has no cue that a landed run can exit 3 with a packet-validation warning.

- File: `.skilled/skills/system-spec-kit/README.md:639`
- Evidence: `[SOURCE: .skilled/skills/system-spec-kit/README.md:639]` and `[SOURCE: README.md:416]` omit status 3; the full contract is at `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:120]`.
- User impact: a first-read operator can miss the one exit status that means "the move landed; inspect the packet, do not rerun blindly".
- Finding class: cross-consumer
- Scope proof: `rg -n "relocate.mjs.*Dry run by default"` finds exactly these two summaries and the feature page; the command README is already correct.
- Affected surface hints: ["skill README command table", "root README spec-management list"]
- Claim adjudication: not required for P2; the same evidence and downgrade reasoning as P1 finding 1 apply.

## Traceability Checks

### Core Protocols

- `spec_code`: partial. The phase 008 goal, `relocate.mjs`, and the command README agree on status 3; the feature page and changelog do not.
- `checklist_evidence`: partial. The packet goal log says all phases are Done, but the changed docs still describe the pre-remediation command.
- `skill_agent`: partial. `SKILL.md` carries a live-only next-number command and does not mention `relocate.mjs` in its quick-reference table.
- `agent_cross_runtime`: notApplicable; no agent file is in the manifest.
- `feature_catalog_code`: fail. The feature page and root catalog omit the status-3 contract.
- `playbook_capability`: pending; scenario 492 is scheduled for a later iteration.

## Integration Evidence

- The authoritative command README at `runtime/cli/spec/README.md:120` is current and needs no change.
- `create.sh:1644` and the phase 008 goal:47 are the producer-side evidence that archived numbers count.
- No source file was modified. No build, test, `validate.sh`, or git write command was run.

## Edge Cases

- A `dry run` that finds work exits 1, and status 3 is only defined after an `--apply` whose steps and sweep passed. The docs must not collapse 1 and 3 into one "work found" status.
- The next-number command is a shell snippet, not a script. It may be intentionally minimal; the finding is scoped to the collision risk in a root that has `z_archive/` entries.
- The phase 006 goal says exit 2 still covers a failed step, while phase 008 adds status 3 for a specific close case. The docs should describe both, not treat 3 as a replacement for 2.

## Confirmed-Clean Surfaces

- `runtime/cli/spec/README.md:120` correctly states statuses 0, 1, 2, and 3 and the rerun behaviour.
- `relocate.mjs:1644-1668` implements sweep-first close semantics and status 3 only when the sweep passed and a packet validation failed.
- `create.sh:1637-1661` counts both live and archived numbers for root/track creation.
- No security-sensitive execution path was introduced by the documentation gap.

## Ruled Out

- A source-code bug in status 3 handling: ruled out by reading `relocate.mjs:1644-1668` and the phase 008 goal; the implementation matches the decision.
- A missing `--include-archive` validation flag: not this dimension; deferred to traceability.
- A root README-only finding: the command README is current, so the gap is limited to the feature/changelog summaries and the two quick-reference surfaces.

## Next Focus

- Dimension: security
- Focus area: archive restore trust boundary and mixed-track refusal documentation; confirm that path refusals and the restore preflight are described where operators act on them.
- Reason: correctness iteration established the status/numbering drift; the next highest-risk surface is the restore path that can leave a track in a forbidden mixed state.
- Required evidence: `archive.sh` restore preflight, `archive-track.vitest.ts` mixed-track cases, phase 008 goal, and every changed archive documentation surface.

## Assessment

Dimensions addressed: correctness

Review verdict: CONDITIONAL
