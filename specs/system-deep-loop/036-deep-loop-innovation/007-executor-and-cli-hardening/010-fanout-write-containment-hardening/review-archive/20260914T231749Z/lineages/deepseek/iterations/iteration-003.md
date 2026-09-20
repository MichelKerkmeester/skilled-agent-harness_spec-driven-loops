# Iteration 3: D3 Traceability — the packet's own record against the shipped state

## Focus

Dimension: **traceability** (D3).
Files: `spec.md`, `acceptance-criteria.md`, `implementation-summary.md`, `tasks.md`, `goal.md`, `handover.md` (packet); `.opencode/skills/system-deep-loop/SKILL.md`, `deep-research/references/protocol/loop-protocol.md`, `deep-review/references/protocol/loop-protocol.md`, `.opencode/commands/deep/assets/deep-review-auto.yaml` and `deep-research-auto.yaml` (migration surfaces, read-only).
Scope: the `spec_code` and `checklist_evidence` protocols — every requirement, acceptance criterion and closure claim checked against the code and docs that exist at HEAD, with the reviewed range's commits as the change boundary.
Static evidence only; no test execution is available in this lineage.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 6 primary + 4 supporting
- New findings: P0=1 P1=2 P2=7
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker

- **F-009**: The spec still mandates the worktree mechanism the packet removed, and reads `Complete`, `spec.md:3, 22, 24, 26, 70, 85, 133, 141-142, 155, 157, 199-200`. The requirement table (`spec.md:133` REQ-005, `:141` REQ-007, `:142` REQ-008) is untouched worktree-era text: REQ-005 mandates a per-lineage worktree with lease, run-keyed publication and reclamation ordering; REQ-007 makes isolation the default with `--worktrees false` / `containment.worktrees: false` opt-outs and an `isolation` tally; REQ-008 mandates the `checkout_write_detected` watch. The phase map on the same page records phase `007-worktree-removal` as **complete** (`spec.md:116`) and commit `ca713e3478` deleted `worktree-lifecycle.ts`, `worktree-lease.ts`, `worktree-paths.ts`, `worktree-publish.ts`, `worktree-reclaim.ts` and their five suites. `implementation-summary.md:61` states the reversal plainly and ADR-007 supersedes the mechanism, but no requirement row, success criterion (SC-003 `:155`, SC-005 `:157`), non-functional bound (NFR-R02 `:200`) or frontmatter claim (`:3`, `:8`, `:22`, `:24`, `:26`) was rescoped. This is a blocker for closure integrity: the packet's contract and its shipped state disagree on three P0/P1 requirements while the packet advertises `Complete`, so the next reader — operator, auditor, or a session asked to "make the spec true" — has no unambiguous answer about which side wins, and the obvious reading reintroduces a deleted subsystem. The spec was edited in the close commit for REQ-004's thresholds and the phase map, which shows the close pass knew how to amend rows; the worktree rows were simply missed.

### P1, Required

- **F-010**: The acceptance-criteria closure gate is stale and its `Met` evidence is false at HEAD, `acceptance-criteria.md:14-17, 50, 71, 74-80, 107`. The file was not modified anywhere in the reviewed range (`git log 5340e39233^..63b633c62f -- acceptance-criteria.md` is empty), still reads `Status: In Progress` (line 50) with `last_updated_at 2026-09-13` (line 14) while `spec.md` and `implementation-summary.md` both read `Complete`, and marks AC-009 and AC-012 through AC-018 `Met`. Their evidence no longer exists: AC-015 cites `runtime/tests/unit/worktree-lifecycle.vitest.ts:531,:547` — a file the change set deleted; AC-009 cites `fanout-run.vitest.ts:4309`, AC-012 `:4400/:4456`, AC-013 `:4504`, AC-014 `:4547`, AC-017 `:4181/:4260/:4395/:3130`, AC-018 `:4184/:4212/:4228` — all beyond the file's current 4374 lines (`wc -l`), while `:4309` now falls inside unrelated content; AC-017's supporting citation `executor-config.vitest.ts:450` covers a `worktrees` schema default the schema no longer has. Line 107 asserts every criterion `Met` "including the worktree default". A closure gate that certifies a deleted mechanism with citations that cannot resolve is worse than an absent one: it is affirmative, structured evidence for a state that does not exist.
- **F-017**: The `cli-opencode` dispatch guard in the review command now throws unconditionally, `deep-review-auto.yaml:1295-1323` (with `:1362-1368` and the step description at `:1424`). In the `if_cli_opencode` branch the guard requires `resolve(repoRoot,'--git-dir') !== '--git-common-dir'` — i.e. `--dir` must be a **linked worktree** (throws `'Unsafe cli-opencode dispatch: --dir must point at an isolated linked worktree'`, `:1308-1310`), then requires the primary `main`/`master` worktree to be clean (`:1321`) and every current-worktree change to be inside the artifact directory (`:1362`), and it records `recovery_baseline` with a `worktree: repoRoot` field (`:1368`). Since commit `ca713e3478` removed the only mechanism that created a lineage worktree, an inline `cli-opencode` dispatch runs with `{repo_root}` = the shared checkout, where `git-dir` equals `common-git-dir` and the guard always throws before dispatch. The command YAML was not touched in the reviewed range (its `git log` in `5340e39233^..63b633c62f` is empty), so the removal commit deleted the precondition of live code in a caller it was required to sweep; the practical effect is that a supported executor kind cannot run this command at all, and the failure looks like a safety refusal rather than the removal's aftermath. Graded P1 rather than P0 because no shipped default path uses `cli-opencode` for this command and the failure is loud and pre-dispatch rather than destructive; graded above P2 because it is a hard break of a supported route introduced by the reviewed change set and contradicts the packet's own removal claim that one shared-checkout path now serves every lane.

### P2, Suggestion

- **F-011**: `implementation-summary.md` is only partly reconciled — one paragraph states the reversal (`:61`) while the document's own claims keep the mechanism alive: frontmatter description "per-lineage worktrees on by default with a per-attempt isolation tally" (`:3`); Files-to-Change row citing the worktree default flip as a modification (`:67`); verification narrative (`:75`); Key Decisions rows for worktrees and the default flip (`:87-88`); Verification rows `Worktree phase, unit level` GREEN (`:103`), the manual worktree run (`:104`), setup cost (`:105`), disk footprint (`:106`), and `Worktree default flip and isolation tally` GREEN (`:109`); Known Limitations 5-10 and 19 (`:124-129`, `:140`). Line 61 announces the reversal but nothing below it was struck, so a reader who scans the tables concludes the mechanism shipped.
- **F-012**: `tasks.md` still records the removed phase as delivered with deleted-suite evidence: T017-T022, T028, T030-T033 (lines 87-103, 124) all `[x]` with evidence text citing `worktree-lifecycle`/`worktree-lease` suites as green, and CHK-002/003/023/100/112/113/121/124/130/151 (lines 168-169, 191, 256, 269-270, 279, 282, 290, 316) assert worktree behaviour as a checked requirement. The file holds 91 checked boxes and zero unchecked; phase 7's removal left no counter-entry marking which of them were superseded.
- **F-013**: `handover.md` still briefs a cold session on the removed mechanism: "Per-lineage git worktrees are off by default, with a per-run opt-in (`--worktrees true`)" (`:37`), the worktree cost measurements (`:41-42`), and a cold-read order that sends the reader to `decision-record.md` "for the worktree-default decision (ADR-004)" (`:100`) without naming ADR-007. The handoff is the first file a resumed session reads (`plan.md` cold-read order), so its staleness propagates.
- **F-014**: `goal.md`'s durable slice was not amended after the reversal: continuity `recent_action` still records "Amended the durable decisions with the worktree default flip and its isolation tally (ADR-004)" (`:16`), the answered question still records ADR-004 turning the default on (`:32`), D5/D6 still describe the detached ephemeral worktree and the `--worktrees true` opt-in as the live design (`:61-62`), and the Implementation status row reads "Done ... per-lineage worktrees, concurrent-editor detection, the worktree default flip" (`:114`, also `:124`). D7 (`:63`) records the removal, so the file contradicts itself in adjacent rows.
- **F-015**: The spec contradicts its own thresholds inside one document: REQ-004 (`spec.md:139`) states the shipped defaults as "three newly dirty paths ... or twelve cumulative", while the section-7 justification REQ-004 points at still reads "Twelve newly-dirty out-of-lineage tracked paths in one heartbeat window ... Forty cumulative for the lane" (`spec.md:192`). The close commit rewrote REQ-004 and left the rationale prose it cites.
- **F-016**: REQ-006's "both loop protocols" clause is half migrated and the sweep claim is contradicted on disk. `deep-research/references/protocol/loop-protocol.md:287-290` carries the complete preserve/restore/quarantine ruleset; `deep-review/references/protocol/loop-protocol.md` contains no containment remedy rules at all (its only containment sentence is the cli-opencode sandbox note at `:280`), and the hub bullet points a deep-review reader at the research file for "both rules" (`.opencode/skills/system-deep-loop/SKILL.md:128`). Two migrated inline call sites still carry the superseded contract in the comments directly above the advisory code — "Revert any NEW out-of-artifact-dir change it made ... fail the iteration fail-closed" at `deep-review-auto.yaml:1517-1519` and `deep-research-auto.yaml:1621-1623` — while AC-011 (`acceptance-criteria.md:73`) records "Sweep across the five documentation surfaces and four command workflows returns zero occurrences of the superseded wording".
- **F-018**: NFR-R01 claims a fail-open property the module does not have: "when git is unavailable, the repo is bare, or the artefact directory is outside the worktree, containment returns empty and never breaks the loop it guards" (`spec.md:199`), while `write-containment.ts` throws when `resolveArtifactScope` returns null but a git toplevel resolves (artifact dir outside the working tree). Pre-existing rather than introduced by this change set, and the throw is unreachable from the shipped callers, which is why it is P2 — but the packet's non-functional table certifies behaviour the code does not implement, and CHK-013 in `tasks.md:180` records the same false claim as verified.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | **fail** | hard | `spec.md:133,141-142` vs `ca713e3478` (worktree modules deleted); `spec.md:192` vs `:139`; `spec.md:199` vs `write-containment.ts` throw | F-009, F-015, F-018; the shipped state contradicts the spec in four places, three of them unreconciled |
| checklist_evidence | not applicable | advisory | no `checklist.md` exists in the packet (nor in any child phase; `git log --diff-filter=D --all` finds none) | The verification checklist lives inside `tasks.md` (91 checked, 0 unchecked) and itself carries the worktree-era rows (F-012) |
| playbook_capability | partial | advisory | `manual-testing-playbook/write-containment/shared-checkout-run.md` | Scenario text was migrated with the change set; its cited expected outcomes should be re-read once the packet's own docs are corrected |

## Assessment

- New findings ratio: 0.55 (ten traceability findings across the packet's contract, closure gate and migration surfaces).
- Dimensions addressed: traceability.
- Novelty justification: this is the first pass over the packet's documentation as a subject rather than as context; F-009 through F-016 are records that were not updated by the change set that invalidated them, and F-017/F-018 are code/doc facts no earlier iteration covered.
- Trajectory: diverging on documentation surface, converging on cause — one removal (phase 7) was performed in code but not propagated to the packet's contract, closure gate, handoff and command caller.

## Claim Adjudication

### F-009

```json
{
  "findingId": "F-009",
  "claim": "The spec mandates the per-lineage worktree mechanism that phase 007 and commit ca713e3478 removed, while the packet reads Complete.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:133",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:141-142",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:116",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/implementation-summary.md:61",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md (ADR-007)"
  ],
  "counterevidenceSought": "Searched for a supersession marker on each worktree requirement, a 'Superseded' status on the requirement table, a note on REQ-005/007/008 pointing at ADR-007, or a spec revision after ca713e3478 outside the phase map. Found the phase map row and ADR-007 only; the requirement rows, scorecard and frontmatter are untouched worktree text.",
  "alternativeExplanation": "The requirement rows may be read as superseded in place by ADR-007, since the decision record is part of the packet and records the removal. Rejected: the packet's own acceptance criteria (line 107) and handoff still describe the mechanism as shipped, so the supersession is not legible anywhere a reader would look first, and half the packet still asserts the opposite.",
  "finalSeverity": "P0",
  "confidence": 0.9,
  "downgradeTrigger": "If the requirement rows, success criteria and frontmatter are marked Superseded-by-ADR-007 (or deleted) and the status stays Complete, downgrade to P2 record-keeping.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P0", "reason": "Confirmed by reading every requirement row against the phase map and the deletion commit; no supersession marker exists" }
  ]
}
```

### F-010

```json
{
  "findingId": "F-010",
  "claim": "The acceptance-criteria stop gate was never reconciled: it remains In Progress and its Met rows cite deleted files and out-of-range line numbers.",
  "evidenceRefs": [
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:50",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:71-80",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:107",
    "git log 5340e39233^..63b633c62f -- .../acceptance-criteria.md (empty)",
    "wc -l .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts (4374)"
  ],
  "counterevidenceSought": "Looked for a superseding criteria file under review/ or review-archive/, a waiver ADR per row, and any commit in the range touching the file. The rows carry no Waived/Superseded status and no waiver cell, and the file is unchanged across the range.",
  "alternativeExplanation": "The criteria may describe intent that the later removal legitimately superseded without a doc edit, with the decision record serving as the audit trail. Rejected as sufficient: the packet's own close rule requires every row to be Met, Waived or Superseded with an ADR in the waiver cell, and these rows are neither waived nor superseded while their evidence cannot be resolved.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If AC-009/011/012-018 are marked Superseded-by-ADR-007 in the waiver cells and the metadata is re-dated against the final state, downgrade to closed.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Every cited line verified against the current files; the citations are stale by construction" }
  ]
}
```

### F-017

```json
{
  "findingId": "F-017",
  "claim": "The removal left a live worktree precondition in the cli-opencode dispatch guard, so that dispatch path now always fails closed.",
  "evidenceRefs": [
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1308-1310",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1321-1323",
    ".opencode/commands/deep/assets/deep-review-auto.yaml:1362",
    ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs (worktree removal in ca713e3478)"
  ],
  "counterevidenceSought": "Searched the command assets for a remaining worktree creator (`git worktree add`, `createWorktree`) — none exists in any of the four YAMLs; searched the reviewed range's log for edits to this YAML — none; checked whether the guard could pass in the shared checkout through an unusual git layout — `git rev-parse --git-dir` equals `--git-common-dir` in a normal checkout by definition.",
  "alternativeExplanation": "The guard could be intentional residual hardening: cli-opencode runs with --dangerously-skip-permissions, so refusing it outside an isolated tree is a conservative posture after the removal. Rejected as the whole story because the packet's stated end state is one shared-checkout code path for every lane and the removal's own criterion claims no worktree dependency remains in the commands; leaving the guard silently changes a supported route into a refusal instead of a decided removal.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the guard is replaced by an explicit deliberate refusal with a message naming the removal (or removed with the worktree check retained for the artifact-dir bounds), downgrade to P2 documentation.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Read the full guard, its branch condition, and confirmed no worktree creator remains in the command assets" }
  ]
}
```

## Ruled Out

- The hub SKILL.md migration: the NEVER bullet at `SKILL.md:128` states the current behaviour (reports, does not revert; lane still completes). Correct.
- The deep-research loop protocol's containment ruleset: complete and current (`loop-protocol.md:287-290`). Correct.
- `decision-record.md`: ADR-006 and ADR-007 record the default flip and the removal as superseding decisions with their rationale. The decision ledger itself is sound; the failure is downstream propagation.
- The manual-testing playbook scenario: describes the preserve remedy and the advisory outcome accurately.

## Dead Ends

- Hunting for a second specification revision outside the packet: `review/lineages/*` contain only run state, no superseding requirement set.
- Searching for a checklist file to run `checklist_evidence` against: none exists in the packet or any child phase, and none was deleted, so the protocol degrades to the `tasks.md` checklist (covered under F-012).

## Recommended Next Focus

D4 Maintainability: comment hygiene, dead code and residue in the migrated surfaces (the two stale comment blocks above advisory calls, the surviving inline containment copies), doc drift inside `decision-record.md`'s earlier ADRs versus its later ones, and test-suite coherence after the worktree-suite deletion.

Review verdict: FAIL
