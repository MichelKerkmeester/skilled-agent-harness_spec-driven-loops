# Iteration 3: D3 Traceability + D4 Maintainability — the remediated tree against its own records

## Focus

Dimension: **traceability** (D3) with a joint **maintainability** (D4) pass.
Files: `spec.md`, `acceptance-criteria.md`, `tasks.md`, `goal.md`, `handover.md`, `implementation-summary.md` of the parent packet; the six remediation phase docs; the four command YAMLs under `.opencode/commands/deep/assets/`; `runtime/scripts/fanout-run.cjs`.
Scope: the packet's own records and the caller envelope read against the remediated runtime, plus the maintainability residue the six phases did not sweep. Static evidence only.

## Scorecard

- Dimensions covered: traceability, maintainability (4/4 by completion)
- Files reviewed: 7 packet docs + 4 command YAMLs + 1 runtime script
- New findings: P0=0 P1=2 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60

## Findings

### P0, Blocker

None. Every worktree-era requirement row that would mandate the removed mechanism carries a supersession marker (REQ-005 `spec.md:140`, REQ-007 `:148`), and the closure gate supersedes the two worktree acceptance rows (`acceptance-criteria.md:71`, `:79`), so no active requirement tells a reader to build worktrees. What remains is contradictory-but-non-normative text (F-301) and a closure gate whose own metadata and evidence are stale (F-302) — graded P1, not P0, because the normative mandate is superseded and the closure gate already names ADR-007.

### P1, Required

- **F-301**: The spec still mandates the worktree mechanism it removed, in every section except the two requirement rows, `specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:3` (frontmatter description), `:8` (trigger phrase "per-lineage worktree containment"), `:22` (executive summary "run each CLI lineage in its own git worktree"), `:24` (key decisions "each lineage gets an ephemeral detached worktree"), `:26` (critical dependencies: sk-git worktree grammar), `:57` (purpose "a lineage that runs in its own worktree makes the attribution question disappear"), `:85-89` (files table: "worktree lifecycle", "worktree-lifecycle cases"), `:162` (SC-003), `:164` (SC-005), `:207` (NFR-R02), `:220-221` (failure modes), `:245-246` (risks). The packet reads `Status: Complete` (`:36`); phase 007 removed the mechanism (`ca713e3478` deleted the five worktree modules and their suites), and the remediation's own record claims the parent-doc findings were "fixed directly" (`goal.md:119`). Only REQ-005 and REQ-007 were actually marked.

**Claim adjudication (P1)**
- *claim*: The parent spec still presents per-lineage worktrees as shipped in its framing, success criteria, non-functional requirements, failure modes and risks, contradicting the tree that phase 007 shipped and the packet's Complete status.
- *evidenceRefs*: `spec.md:3`, `:8`, `:22`, `:24`, `:26`, `:57`, `:85-89`, `:162`, `:164`, `:207`, `:220-221`, `:245-246`, `:36`; counter-markers at `:140`, `:148`; `goal.md:119`.
- *counterevidenceSought*: grepped every "worktree" occurrence in the file (31 hits) and checked each for a supersession marker; checked whether a global "historical" note exists above the sections (none); checked whether `decision-record.md` ADR-007 declares the mechanism removed (it does, and the AC file cites it), and whether the corresponding AC rows are superseded (they are, F-302).
- *alternativeExplanation*: The requirement table is the normative part and it is marked; a reader who starts at §4 will not build worktrees. But the frontmatter description and executive summary are the packet's own abstract, and SC-003/SC-005 sit in the closure contract's supporting document — a reader reconciling spec against code still meets two unmarked criteria that can never pass.
- *finalSeverity*: P1 — degraded and contradictory documentation of a removed mechanism, no longer normative.
- *confidence*: 0.85.
- *downgradeTrigger*: downgrade to P2 if the SC/NFR rows gain supersession markers in a follow-up edit (the fix this finding recommends); upgrade review if the packet is reopened for implementation, where framing text becomes requirements again.

- **F-302**: The closure gate is still `In Progress` and its `Met` rows cite deleted or shifted evidence, `specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:50` (Status In Progress, dated 2026-09-08 at `:51`), `:77` (AC-015, `Met`, cites `runtime/tests/unit/worktree-lifecycle.vitest.ts:531`/`:547` — the file does not exist), `:80` (AC-018, `Met`, cites `runtime/tests/unit/fanout-run.vitest.ts:4184`/`:4212`/`:4228`; the file grew from 4374 to 4791 lines in the remediation and those lines are now unrelated test scaffolding), `:107` (closure says every criterion is Met or Superseded). Prior F-010 reported this class; the remediation updated the phase docs and marked AC-009/AC-017 superseded but the parent gate was never re-anchored or re-dated.

**Claim adjudication (P1)**
- *claim*: The packet's closure gate carries a non-terminal status and certifies two `Met` criteria with evidence that no longer resolves to the behaviour it names.
- *evidenceRefs*: `acceptance-criteria.md:50`, `:51`, `:77`, `:80`, `:107`; `runtime/tests/unit/` has no worktree-lifecycle suite; `wc -l` on `runtime/tests/unit/fanout-run.vitest.ts` = 4791.
- *counterevidenceSought*: verified the deleted suite by directory listing; read the cited lines at HEAD (4184 is a spawn-argument list, 4212 an opencode `--variant` test, 4228 closing braces); checked whether a newer AC file exists elsewhere in the packet tree (none found); checked the prior review's registry, which recorded the same class as F-010.
- *alternativeExplanation*: A closure gate is a historical document; its own metadata says In Progress, which is at least honest. But the row-level `Met` claims are evidence assertions that no longer hold, and the packet's completion criterion depends on the gate being actionable.
- *finalSeverity*: P1 — stale closure evidence on the packet's own decision document.
- *confidence*: 0.85.
- *downgradeTrigger*: downgrade to P2 if the AC rows are re-anchored or the file is marked historical by the operator; upgrade if a release decision were taken from the gate as written.

### P2, Suggestion

- **F-303**: The parent phase map was never completed and still renders the remediation phases as pending, `spec.md:104-107` (table header) vs `:117-124` (rows). The rows for 008–013 are field-shifted — `| 007-worktree-removal | 008-quarantine-destination-canonical | [Criteria TBD] | [Verification TBD] |` — while every child's metadata reads `Status: Complete` (`008-.../spec.md:25`, `013-.../spec.md:25`) and the map's own sentence still says "the last removes the worktree mechanism". `goal.md:16` compounds it: the durable continuity field still records the worktree default flip (ADR-004) as the recent action. `decision-record.md:240` keeps ADR-003 `Status: Proposed` although the mechanism it describes was implemented in phase 4 and deleted in phase 7, while ADR-004/005/006/007 all carry supersession notes (prior F-021 residue).
- **F-304**: Residual worktree claims outside the sections fixed above, `implementation-summary.md:3` (frontmatter description), `:55`, `:67`, `:75`, `:87-88`, `:98-106` (21 mentions presenting worktrees and the isolation tally as shipped) against the one removal paragraph at `:61`; `tasks.md:88` (a checked task whose evidence names the deleted worktree-lifecycle and worktree-lease suites); `handover.md:100` (cold-read order names ADR-004 for "the worktree-default decision" and never names ADR-007, though `:37` was corrected). Prior F-011/F-012/F-013 class; only the handover's status line was updated.
- **F-305**: The remediation did not sweep the caller envelope's duplication and diagnostics residue. Ten byte-identical inline containment call blocks remain — `deep-research-auto.yaml` 4, `deep-research-confirm.yaml` 1, `deep-review-auto.yaml` 4 (`:1521`, `:1615`, `:1705`, `:1795`), `deep-review-confirm.yaml` 1 — and `drainGitContentionWarnings` is still exported only to be drained at one site, `runtime/scripts/fanout-run.cjs:3323`, so an exhausted retry budget in an inline iteration is recorded and silently discarded. Prior F-019/F-020, still active and not bound to any remediation phase.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | fail (packet docs vs shipped tree) | hard | `spec.md:162`, `:164`, `:207` vs the post-phase-007 tree; `acceptance-criteria.md:77` cites a deleted suite | F-301, F-302; the runtime slice graded partial in iterations 1–2 |
| checklist_evidence | notApplicable | hard | no `checklist.md` in the packet | the AC file is the closure gate here |
| feature_catalog_code | partial | overlay | hub entry migrated by `ca713e3478` (`runtime/feature-catalog/fanout/fanout-run.md` was touched in `69647ce714`), runtime entry not re-checked against the remediation | prior F-023 class; no new finding registered |
| skill_agent / agent_cross_runtime / playbook_capability | notApplicable | overlay | not in this lineage's scope; phase 014 owns the cross-surface alignment review | recorded, not scored |

## Assessment

- New findings ratio: 0.60.
- Dimensions addressed: traceability and maintainability; all four configured dimensions now have a full iteration.
- Novelty justification: F-301 and F-302 are the remediated residue of prior P0/P1 findings — the remediation fixed the requirement rows and two AC rows and left the framing, SC/NFR rows, the closure metadata and the evidence anchors untouched; F-303–F-305 are the parent-doc and caller-envelope residue the six phases did not touch.

## Claim Adjudication

Both P1 findings carry full packets above; no new P0.

## Ruled Out

- ADR supersession chain (prior F-021): ADR-004 (`decision-record.md:379`), ADR-005 (`:470`), ADR-006 (`:534`) and ADR-007 (`:544-546`) carry their supersession notes. ADR-003 alone still reads `Status: Proposed` (`:240`) and is folded into F-303 rather than re-registered as its own finding.
- `deep-review/references/protocol/loop-protocol.md` containment ruleset (prior F-016): the remediation's phase 012 touched the research protocol and its compiled contract; the review protocol state was not re-checked here and is deferred to phase 014's SKILL.md dimension.
- `runtime/feature-catalog/fanout/fanout-run.md` (prior F-023): the file was modified in `69647ce714`; its current accuracy against the remediation is deferred to phase 014.
- Review-reducer anchor handling (prior F-006): unchanged and out of the remediation's six phases; carried in the appendix.

## Dead Ends

- `validate.sh --strict` on the packet: explicitly out of scope for this lineage; completion verification belongs to the operator.
- Reading the concurrent `luna` lineage's artifacts for a cross-check: none present in this lineage's write surface; not read.

## Recommended Next Focus

Loop complete — three iterations under the max-iterations policy. Synthesis compiles the registry and `review-report.md`; the remediation of F-201/F-301/F-302 is a planning-packet follow-up, and the unremediated prior P2 carry-overs are listed in the report appendix.

Review verdict: CONDITIONAL
