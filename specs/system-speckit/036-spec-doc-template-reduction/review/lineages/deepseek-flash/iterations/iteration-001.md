# Iteration 001: D1 Correctness — Inventory & Scaffold-State Audit

## Focus
Correctness over the full 036 packet inventory: parent spec.md, all 6 child spec.md + plan.md, goal-file-manifest, description.json. Establish the artifact map and identify scaffold residue, phantom ids, and internal contradictions.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 17 (parent spec.md, 001-006 spec.md + plan.md ×12, goal-file-manifest.txt, description.json, graph-metadata.json)
- New findings: P0=0 P1=3 P2=5
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.95

## Findings

### P1, Required
- **F001**: Implementation plans for phases 2-6 are un-authored scaffold templates, `002-tasks-checklist-merge/plan.md:3`, [Description: all five plan.md files (002-006) retain every template default — `[2-3 sentences: what this implements...]` (line 3), `[e.g., TypeScript, Python 3.11]` (line 50), `[Component 1]` (line 83), `[Core feature 1]` (line 121), `[Conditions requiring rollback]` (line 157) — while their sibling spec.md files are fully authored drafts. A 30-line authored spec sits on top of a 170-line placeholder plan; implementation cannot start from these plans.] (dimension: correctness)
- **F002**: Scaffold continuity blocks emit malformed session ids and zeroed fingerprints, `001-analysis/plan.md:22-23`, [Description: every scaffolded plan (001-006) and 001 spec.md carries `session_id: "scaffold-scaffold/<phase>"` (doubled prefix) and `fingerprint: sha256:000...0`. The authored 002 spec.md uses `session_id: "design-036-002-tasks-checklist-merge"` — the same phase's spec and plan disagree on lineage identity. Phase 4 spec names SESSION_LINEAGE as a cross-doc session-id scanner, so this disagreement is observable to tooling.] (dimension: correctness)
- **F003**: 001-analysis spec.md is entirely placeholder despite being the cited research foundation, `001-analysis/spec.md:2-3`, [Description: title/description still carry template defaults (`[template:level-1/spec.md]` tag, "What is broken..." description), METADATA has `[P0/P1/P2]` / `[Draft/In Progress/Review/Complete]` (lines 49-50), Phase Context has three `[To be defined during planning]` (lines 57,67,70), Problem/Purpose/Scope/Requirements are all bracketed, and the trailing SCAFFOLD_VALIDATION_COUNTS block (lines 169-182) lists phantom REQ-003..REQ-008 plus six bare `**Given**` rows. Yet 002-006 specs all cite "001-analysis research (R1/R2/R4/R5/R6)" as their grounding — the normative source document for those recommendations does not exist.] (dimension: correctness)

### P2, Suggestion
- **F004**: Parent phase map uses `[Phase N scope]` placeholders and all-Pending status, `specs/system-speckit/036-spec-doc-template-reduction/spec.md:102-107`, [Description: five of six phases now have authored scope (002-006 Draft specs) but the parent map still shows placeholder scope and "Pending" — the map's purpose is tracking.] (dimension: correctness)
- **F005**: Parent continuity block still carries template defaults, `spec.md:11`, [Description: `packet_pointer: "scaffold/036-spec-doc-template-reduction"` and `session_id: "template-session"` — a Level-2 phase-parent doc whose own continuity was never initialized.] (dimension: correctness)
- **F006**: goal-file-manifest.txt omits sibling review artifacts, `goal-file-manifest.txt:50-61`, [Description: the manifest lists child spec.md/plan.md and the template corpus but not tasks.md, implementation-summary.md, description.json, graph-metadata.json, nor any templates/manifest/*.tmpl implementation file that specs 002-006 claim to change.] (dimension: correctness)
- **F007**: Base L1 plan template unconditionally ships FIX ADDENDUM section, `002-tasks-checklist-merge/plan.md:94-108`, [Description: every scaffolded plan carries a debug-only "FIX ADDENDUM: AFFECTED SURFACES" section gated on `research_intent=fix_bug` conditions — which none of these feature phases satisfy — adding ~15 lines of dead guidance to every L1 plan render.] (dimension: correctness)
- **F008**: Template tag leaks into doc titles, `001-analysis/spec.md:2`, [Description: rendered titles retain `[template:level-1/spec.md]` / `[template:level-1/plan.md]` annotations — template provenance metadata is visible in authored doc frontmatter across all 12 child docs.] (dimension: correctness)

## Claim Adjudication Packets (new P0/P1)

```json
{
  "findingId": "F001",
  "claim": "Plans for phases 2-6 are un-authored scaffold templates while their specs are authored, so no phase has an executable plan.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/plan.md:3",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/plan.md:50-56",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/plan.md:83-88",
    "specs/system-speckit/036-spec-doc-template-reduction/003-template-dedup/plan.md:3",
    "specs/system-speckit/036-spec-doc-template-reduction/004-continuity-single-source/plan.md:3",
    "specs/system-speckit/036-spec-doc-template-reduction/005-comment-extraction/plan.md:3",
    "specs/system-speckit/036-spec-doc-template-reduction/006-verify-rollout/plan.md:3"
  ],
  "counterevidenceSought": "Read all five 002-006 plan.md files in full; checked for any deferral note, planning-gate marker, or partial authoring; checked parent spec and goal-file-manifest for a documented 'plans authored at kickoff' convention. None found.",
  "alternativeExplanation": "Plans may be intentionally deferred until specs are approved (plan-after-spec workflow). Rejected: the scaffold plan files are already in the manifest scope, specs' handoff criteria require planning, and no deferral is documented anywhere in the packet.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If 001-analysis research records an explicit plan-deferral gate that the packet intends to honor, downgrade to P2 and record the gate reference.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

```json
{
  "findingId": "F002",
  "claim": "Scaffolded continuity blocks emit malformed session ids (doubled 'scaffold-scaffold/' prefix) and spec/plan session ids disagree within the same phase, which SESSION_LINEAGE tooling can observe.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/spec.md:22-23",
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/plan.md:22-23",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/plan.md:22-23",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/spec.md:28",
    "specs/system-speckit/036-spec-doc-template-reduction/003-template-dedup/plan.md:22-23",
    "specs/system-speckit/036-spec-doc-template-reduction/004-continuity-single-source/plan.md:22-23",
    "specs/system-speckit/036-spec-doc-template-reduction/005-comment-extraction/plan.md:22-23",
    "specs/system-speckit/036-spec-doc-template-reduction/006-verify-rollout/plan.md:22-23"
  ],
  "counterevidenceSought": "Checked whether the doubled prefix is an artifact of template composition (packet_pointer already containing 'scaffold/') by comparing packet_pointer and session_id values; verified 002 spec.md's authored session id differs from its plan's scaffold id. SESSION_LINEAGE behavior will be re-verified against spec-doc-structure.ts in a later iteration.",
  "alternativeExplanation": "The zeroed fingerprint may be an intentional 'not yet saved' scaffold sentinel. Rejected for the session id itself: a deliberate sentinel would not contain a doubled 'scaffold-scaffold/' prefix.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "If verification of SESSION_LINEAGE shows it scans only implementation-summary.md (not spec/plan), and no consumer reads these session ids, downgrade to P2 as a hygiene issue.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

```json
{
  "findingId": "F003",
  "claim": "The 001-analysis spec.md is 100% scaffold placeholder even though downstream phases 002-006 cite its research recommendations R1-R6 as their normative grounding.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/spec.md:2-3",
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/spec.md:49-50",
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/spec.md:85-88",
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/spec.md:169-182",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/spec.md:66",
    "specs/system-speckit/036-spec-doc-template-reduction/003-template-dedup/spec.md:63",
    "specs/system-speckit/036-spec-doc-template-reduction/004-continuity-single-source/spec.md:62",
    "specs/system-speckit/036-spec-doc-template-reduction/005-comment-extraction/spec.md:62"
  ],
  "counterevidenceSought": "Checked 001-analysis/ for authored content outside spec.md (research/ dir exists with artifacts); checked whether any doc inside the packet mirrors the R1-R6 findings into a normative surface. The recommendations exist only in downstream citations.",
  "alternativeExplanation": "The research/ directory may be the intended deliverable and spec.md a formality. Rejected: the phase map and packet structure designate spec.md as the contract document, and SCAFFOLD_VALIDATION_COUNTS lists phantom REQ-003..REQ-008 that a validator could count.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the research/ directory artifacts are explicitly canonicalized as the phase deliverable in the parent spec or phase map, downgrade to P2 documentation debt.",
  "transitions": [{ "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | 002 spec vs 002 plan scaffold mismatch; 001 spec placeholder vs downstream R1-R6 citations | Inventory stage; deep claim verification deferred to iterations 4-5 |

## Assessment
- New findings ratio: 0.95
- Dimensions addressed: correctness (inventory)
- Novelty justification: first pass over the packet; all 8 findings are direct file observations with line evidence; no overlap with prior lineage (native archive reviewed a different workstream scope)

## Ruled Out
- "Scaffold residue is expected and out of scope": the goal-file-manifest header says impl is scaffold-only, but specs 002-006 ARE authored — the scaffold-vs-authored split inside the same packet is the defect, not the scaffold existence.

## Dead Ends
- Description.json content drift (001 description vs authored phases): no load-bearing contradiction found; revisit in traceability pass.

## Recommended Next Focus
- Dimension: correctness (template corpus)
- Focus area: Read templates/examples/level-1 + level-2 docs and references/templates/level-specifications.md; verify template-source claims (F002 composition, SCAFFOLD_VALIDATION_COUNTS consumer, comment leakage, continuity duplication).

## Review verdict: CONDITIONAL
