# Iteration 2 - Security: restore trust boundary and mixed-track refusal

## Dispatcher

- Mode: review
- Dimension: security
- Review target: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach`
- Artifact directory: `specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/review/lineages/dsh-1`
- Operator focus: manifest-scoped documentation alignment, with the restore boundary and forbidden mixed-track state as the highest-risk surface this pass.
- Budget profile: verify (11-13 tool calls). No nested dispatch was performed.

## Files Reviewed

- `008-restore-and-phase-numbering/goal.md`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-lifecycle-automation.md`
- `.skilled/skills/system-spec-kit/README.md`
- `.skilled/skills/system-spec-kit/changelog/v2.13.0.0.md`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Renumbered restore docs say every relocation failure exits 1, but status 3 is a successful restore** -- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45` -- Phase 008 decision D2 says a renumbering restore that ends on relocation status 3 exits 0 and names the packet in a warning. The feature-catalog lifecycle page says "If `relocate.mjs` is missing or its run fails, the restore exits with status 1 and prints the command to rerun." That sentence covers the status-3 case as a failure and gives the wrong exit code.

Case: a track archive holds `001-old`, a live packet holds its number, and the restored packet fails its own strict validation. `archive.sh` moves the packet to the next free number and exits 0 with a warning; the feature page says a failed relocation exits 1, so the caller treats a completed restore as aborted and may issue the rerun command against an already-moved packet.

- File: `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering/goal.md:45]` defines the status-3 restore as exit 0 plus a warning; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:437]` exits 0 on status 3; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:442]` exits 1 only for a nonzero status that is not 3.
- User impact: automation wrapping `archive.sh --restore` will misread a completed restore as a failure, and an operator will be told to rerun a relocation whose source is gone.
- Finding class: cross-consumer
- Scope proof: `rg -n "restore exits with status 1|renumbered restore|status 3"` over the changed docs returns the lifecycle feature page and the archive implementation. The command README at `runtime/cli/spec/README.md:114` omits the status-3 branch rather than contradicting it; the feature page is the only changed doc that asserts a blanket exit-1 rule.
- Affected surface hints: ["feature catalog lifecycle page", "archive restore command reference", "archive.sh --help", "changelog restore section"]
- Claim adjudication:

```json
{"type":"claim","claim":"The lifecycle feature page documents a failed relocation during restore as exit 1, while archive.sh treats relocation status 3 as a successful restore and exits 0 with a warning.","evidenceRefs":["feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45","008-restore-and-phase-numbering/goal.md:45","runtime/cli/spec/archive.sh:437","runtime/cli/spec/archive.sh:442"],"counterevidenceSought":"Read archive.sh's status capture and the archive-track tests; the tests assert a status-3 restore reports done, so the implementation is deliberate. Checked the command README for a status-3 carve-out; it has none.","alternativeExplanation":"The phrase 'run fails' could be read as 'nonzero and not status 3', but the page gives no such carve-out and immediately says the restore exits 1. A reader has no way to infer the exception.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the page adds the status-3 exception and a warning example, downgrade to P2."}
```

2. **The archive command reference and lifecycle docs omit the mixed-track restore refusal** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114` -- Phase 008 decision D3 makes `archive.sh --restore` ask the relocation preflight and refuse a destination that would leave a flat packet beside sub-tracks. The command reference describes restore only as returning a folder to its home or taking the next free number, so the only documented restore failures are collisions and path/symlink problems.

Case: `specs/demo` has a declared sub-track and `specs/demo/z_archive/009-old` is archived. A restore into the track's flat root would mix flat packets and sub-tracks, so `archive.sh` prints `Restore refused: track specs/demo would hold flat packets` and exits 1. A reader following the command reference expects the restore to land beside the sub-track or to take the next number; nothing predicts the refusal or the suggested `--to <track>/<sub>/...` recovery.

- File: `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114`
- Evidence: `[SOURCE: specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/008-restore-and-phase-numbering/goal.md:46]` defines the mixed-track restore refusal; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:363]` implements the preflight read; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:394]` prints the refusal and exits 1; `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts:645]` covers the refusal.
- User impact: an operator can lose a restore attempt and mis-diagnose the failure, and a caller cannot preflight the only restore condition that protects the track from a forbidden mixed layout.
- Finding class: cross-consumer
- Scope proof: `rg -n "mixed-track|would hold flat packets|track left mixed"` over the changed docs returns only the relocation preflight language and the tests; none of the archive-facing docs names the restore refusal. The same omission appears in `feature-catalog/tooling-and-scripts/spec-lifecycle-automation.md:45`, `changelog/v2.13.0.0.md:145`, and `.skilled/skills/system-spec-kit/README.md:638`.
- Affected surface hints: ["archive command reference", "feature catalog lifecycle page", "changelog restore section", "skill README command table", "archive.sh --help"]
- Claim adjudication:

```json
{"type":"claim","claim":"The archive command reference and lifecycle docs do not document the mixed-track restore refusal, although archive.sh asks the relocation preflight and exits 1 when the restore would leave flat packets beside sub-tracks.","evidenceRefs":["runtime/cli/spec/README.md:114","008-restore-and-phase-numbering/goal.md:46","runtime/cli/spec/archive.sh:363","runtime/cli/spec/archive.sh:394","runtime/cli/tests/archive-track.vitest.ts:645"],"counterevidenceSought":"Searched the command reference, feature catalog lifecycle page, changelog, skill README and archive help for the mixed-track line; only the relocation docs mention a mixed-track refusal, and they apply it to a map, not to archive restore.","alternativeExplanation":"The refusal is a new guard, not a broadly useful operator feature; however it changes the restore exit contract and adds a recovery command, so omitting it leaves the documented command incomplete.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"If the archive docs expose a link to the relocation preflight reference and explicitly say restore can be refused for mixed-track, downgrade to P2."}
```

### P2 Findings

1. **`archive.sh --help` omits both new restore outcomes** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:83` -- The built-in help still says only that restore returns a spec to its home and that a taken number lands on the next free one. It does not mention the mixed-track refusal or the status-3 success warning. The help is a user-facing surface in the manifest, not just an implementation comment.

Case: an operator runs `archive.sh --help` before a restore and gets the pre-008 notes; the two conditions that now decide whether the restore lands or is refused are absent.

- File: `.skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:83`
- Evidence: `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:77]` through `:95` lists the notes; no mixed-track or status-3 note is present. `[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/archive.sh:363]` and `:437` are the behaviours.
- User impact: the command's own help is less accurate than the implementation, and an operator may not know the recovery command for the mixed-track case.
- Finding class: instance-only
- Scope proof: the help heredoc is the only command-level help block for `archive.sh`; the command README is a separate surface and is covered by the P1 above.
- Affected surface hints: ["archive.sh --help", "archive command reference"]
- Claim adjudication: not required for P2.

## Traceability Checks

### Core Protocols

- `spec_code`: partial. The archived-packet restore path and the mixed-track guard are implemented, but two changed docs state the wrong exit contract.
- `checklist_evidence`: partial. Phase 008's completion criteria name the mixed-track restore and status-3 restore; the changed lifecycle docs do not reflect them.
- `skill_agent`: partial. The skill README summary at `README.md:638` describes restore without either new branch.
- `agent_cross_runtime`: notApplicable; no agent file is in the manifest.
- `feature_catalog_code`: fail. The lifecycle feature page's blanket exit-1 sentence contradicts status 3.
- `playbook_capability`: pending; the archive lifecycle manual scenario still needs comparison in a later iteration.

## Integration Evidence

- `archive-track.vitest.ts:645-662` proves the mixed-track restore exits 1 and leaves the folder archived.
- `archive.sh:437-440` proves a status-3 renumbering restore exits 0 with a warning.
- The security boundary itself is sound: `archive.sh:363-395` reads only the relocate preflight's mixed-track line, and `archive.sh:379-382` captures the status without letting `set -e` end the script.
- No source file was modified. No build, test, `validate.sh`, or git write command was run.

## Edge Cases

- A flat track with no sub-tracks still restores (covered by `archive-track.vitest.ts:666`); the refusal is only for a track that already has a sub-track and would become mixed.
- A restore after an archive without an intervening commit still proceeds; the preflight's dirty-tree verdict is ignored except for the mixed-track line (`archive-track.vitest.ts:681`).
- Status 3 is not a general relocation failure; it means the steps and sweep landed and only the moved packet's own strict validation failed.

## Confirmed-Clean Surfaces

- `archive.sh:358-395` implements the phase 008 D3 rule without keeping a second copy of the sub-track predicate.
- `archive.sh:437-446` maps status 3 to a successful restore and every other nonzero status to exit 1 with a rerun command.
- `archive-track.vitest.ts:641-693` covers both sides of the mixed-track restore boundary.
- No shell eval or untrusted path interpolation was introduced on the restore path.

## Ruled Out

- A code defect in the mixed-track refusal: ruled out by the test at `archive-track.vitest.ts:645`, which asserts exit 1, the refusal text, and an unchanged archived folder.
- A missing `--include-archive` or symlink guard: ruled out; the symlink and dot-segment guards are documented and tested.
- A claim that status 3 should be treated as exit 2: ruled out by phase 008 D1 and D2.

## Next Focus

- Dimension: traceability
- Focus area: archive path JSON (`archivedPaths`), the non-`NNN-slug` proposal refusal, and the phase-007 bare-name/pre-archive rewrite contract.
- Reason: the security pass found the restore boundary docs lag; the next pass follows the same producer-to-doc comparison through the remaining explicit phase 006-010 behaviors.
- Required evidence: `rg-wrapper.mjs`, `suggest-subtracks.mjs`, `relocate.mjs` bare-name/pre-archive code, their tests, and every changed doc that describes the path record or proposal.

## Assessment

Dimensions addressed: security

Review verdict: CONDITIONAL
