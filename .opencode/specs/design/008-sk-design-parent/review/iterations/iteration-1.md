# Deep Review Iteration 1 — Correctness

## Dispatcher

- **Iteration:** 1 of 50
- **Dimension:** correctness
- **Budget Profile:** scan (actual: 17 tool calls — over budget due to deep evidence gathering across 12 phases)
- **Session ID:** 2026-06-30T06:07:52.070Z
- **Lineage:** new, generation 1

## Sampling Strategy

Read parent spec.md fully, then spot-checked 12 phases representing scaffold/planned/complete lifecycle stages: 001, 008, 016, 017, 022, 037 (both), 039, 041 (both), 042, 043. Also read parent graph-metadata.json.

## Files Reviewed

| File | Phase | Purpose |
|------|-------|---------|
| `154-sk-design-parent/spec.md` | parent | Phase map, status, metadata, transition rules |
| `154-sk-design-parent/graph-metadata.json` | parent | Child ID registry, derived status |
| `001-corpus-research/spec.md` | complete | Phase numbering, metadata, frontmatter |
| `001-corpus-research/implementation-summary.md` | complete | Status consistency cross-check |
| `008-nested-parent-conversion/spec.md` | complete | Naming, status claims |
| `016-register-loader-contract/spec.md` | planned | Status accuracy, predecessor/successor |
| `017-real-bugs/spec.md` | planned | Status accuracy |
| `022-mifb-design-research/spec.md` | complete | Post-phase-map phase verification |
| `022-mifb-design-research/implementation-summary.md` | complete | Status cross-check |
| `037-design-context-enforcement/spec.md` | complete | Duplicate 037 evidence |
| `037-design-routing-and-integration-research/spec.md` | complete | Duplicate 037 evidence |
| `039-design-enforcement-build/spec.md` | scaffold | Scaffold state verification |
| `041-design-command-upgrade/spec.md` | scaffold(claimed complete) | Duplicate 041 + template evidence |
| `041-sk-design-overview-conformance/spec.md` | complete | Duplicate 041 evidence |
| `042-design-work-deep-review/` (directory) | empty | No spec docs evidence |
| `043-design-review-remediation/spec.md` | complete | Handoff dependency check |
| `043-design-review-remediation/implementation-summary.md` | complete | Status cross-check |

---

## Findings — New

### P0 Findings

**1. Duplicate Phase Number 037 — Two child phases share number 037**

- **Files:** `037-design-context-enforcement/spec.md` and `037-design-routing-and-integration-research/spec.md`
- **Evidence:** Direct directory listing via strategy §15 (line 182-183) confirms both folders exist under `154-sk-design-parent/`. Read both spec.md files: `037-design-context-enforcement/spec.md:1` (title: "deterministic enforcement for the context-loading contract", Status: Complete, Predecessor: `../036-design-context-hardening`); `037-design-routing-and-integration-research/spec.md:1` (title: "research sk-design routing/utilization guarantees", Status: Complete, Predecessor: `../028-impeccable-design-research`). These are distinct, unrelated phases — one is a build follow-up (enforcement), the other is a 50-iteration research study about routing/integration across six dimensions. They happen to share number 037.
- **Finding class:** instance-only (two instances)
- **Scope proof:** `grep -r "037-" .opencode/specs/design/008-sk-design-parent/` would return both folders. Both exist and are independently addressable.
- **Affected surface hints:** ["phase-parent navigation", "resume-by-number dispatch", "validate.sh --recursive", "graph-metadata.json children_ids"]
- **Recommendation:** Renumber one of the two phases to a unique number (e.g., 037a or renumber the later one to 044+). Update the parent phase map, graph-metadata.json, and all cross-references.

```json
{
  "type": "claim-adjudication",
  "claim": "Duplicate phase number 037 violates structural integrity — two independent, completed phases share the same numeric identifier.",
  "evidenceRefs": [
    "037-design-context-enforcement/spec.md:1 (title + metadata)",
    "037-design-routing-and-integration-research/spec.md:1 (title + metadata)",
    "review/deep-review-strategy.md:182-183 (both listed as distinct rows)"
  ],
  "counterevidenceSought": "Checked whether one is a continuation/supersession of the other. They are not: different titles, different predecessors (036 vs 028), different purposes (enforcement build vs research). No supersession claim found in either spec.",
  "alternativeExplanation": "These were scaffolded in parallel by different processes and both received the next available number 037 because the scaffolder did not check for existing phases at that number.",
  "finalSeverity": "P0",
  "confidence": 0.95,
  "downgradeTrigger": "None — structural integrity of phase numbering is a hard correctness invariant for phase-parent tracks."
}
```

**2. Duplicate Phase Number 041 — Two child phases share number 041, one is an unfilled template**

- **Files:** `041-design-command-upgrade/spec.md` and `041-sk-design-overview-conformance/spec.md`
- **Evidence:** `041-design-command-upgrade/spec.md` is an unfilled scaffold template: line 3 description says "[What is broken, missing, or inefficient? 2-3 sentences...]"; line 62 says "[2-3 sentence high-level overview...]"; line 76 shows `[Draft/In Progress/Review/Complete]`; lines 87-89 contain "[What is broken, missing, or inefficient?]"; the `_memory.continuity.packet_pointer` (line 14) reads `"scaffold/041-design-command-upgrade"` and `session_id` (line 23) reads `"scaffold-scaffold/041-design-command-upgrade"`. In contrast, `041-sk-design-overview-conformance/spec.md` is complete: line 53 shows `Status: Complete`, `completion_pct: 100` (line 28), with fully authored content.
- **Finding class:** instance-only
- **Scope proof:** Both folders verified via strategy §15 (lines 187-188). Direct reads confirm one is an empty template, the other is complete.
- **Affected surface hints:** ["phase-parent navigation", "resume-by-number dispatch", "strategy status claims"]
- **Recommendation:** If 041-design-command-upgrade is intended, renumber it. If it was accidental scaffolding, delete it. The template must be filled or removed — it currently carries placeholder trigger_phrases ("feature", "specification", "name", "template") that would pollute any trigger-based search.

```json
{
  "type": "claim-adjudication",
  "claim": "Duplicate phase number 041 violates structural integrity. One instance is an unfilled template scaffold, the other is a complete implementation phase.",
  "evidenceRefs": [
    "041-design-command-upgrade/spec.md:3,62,76,87 (template placeholders)",
    "041-design-command-upgrade/spec.md:14 (packet_pointer: 'scaffold/...')",
    "041-design-command-upgrade/spec.md:23 (session_id: 'scaffold-scaffold/...')",
    "041-sk-design-overview-conformance/spec.md:53 (Status: Complete)",
    "041-sk-design-overview-conformance/spec.md:28 (completion_pct: 100)"
  ],
  "counterevidenceSought": "Checked whether the template version is a planned replacement for the complete version. They have different titles and purposes — command upgrade vs overview conformance. No evidence of one superseding the other.",
  "alternativeExplanation": "The 041-design-command-upgrade folder was auto-created by a template scaffolding tool and never filled in. It was accidentally left alongside the legitimately created 041-sk-design-overview-conformance.",
  "finalSeverity": "P0",
  "confidence": 0.95,
  "downgradeTrigger": "None."
}
```

### P1 Findings

**3. Parent Phase Documentation Map Truncated at Phase 021**

- **File:** `154-sk-design-parent/spec.md:94-121`
- **Evidence:** The PHASE DOCUMENTATION MAP table (lines 94-121) lists only phases 001–021. Twenty-two phases (022–043) exist on disk but have no row in the parent phase map. The strategy §15 (lines 167-189) documents all of them. The parent `spec.md:62` claims "This spec.md is the ONLY authored document at the parent level" and that child phases hold all details — but the map itself must be complete to serve as the authoritative index.
- **Finding class:** cross-consumer
- **Scope proof:** Strategy §15 lists 43 phases; parent spec.md §PHASE DOCUMENTATION MAP lists 21. `graph-metadata.json` children_ids (lines 6-47) also omits several phases. Direct listing shows folders 022–043 exist.
- **Affected surface hints:** ["parent phase map", "resume routing", "graph-metadata.json children_ids", "validate.sh --recursive"]
- **Recommendation:** Append rows for phases 022–043 to the parent PHASE DOCUMENTATION MAP.

```json
{
  "type": "claim-adjudication",
  "claim": "The parent phase map is incomplete — 22 child phases (022-043) have no documented row in the authoritative phase documentation map.",
  "evidenceRefs": [
    "154-sk-design-parent/spec.md:94-121 (phase map ends at 021)",
    "review/deep-review-strategy.md:167-189 (43 phases listed in strategy)",
    "graph-metadata.json:6-47 (children_ids incomplete)"
  ],
  "counterevidenceSought": "Could there be a documented reason for the truncation? The spec.md §Phase Transition Rules (lines 122-139) only document handoffs up to 006. No text explains why phases 022+ are excluded from the map. No separate index document exists.",
  "alternativeExplanation": "Phases 022+ were added after the parent spec was last updated, so the phase map was never refreshed.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "Could be P2 if the parent spec.md is considered 'frozen as-is' and the graph-metadata.json is the authoritative index — but the spec itself claims to be the phase documentation map."
}
```

**4. Parent "Complete" Status Contradicts Unfinished State**

- **File:** `154-sk-design-parent/spec.md:41,23`
- **Evidence:** Line 41: `**Status** | Complete`. Line 23: `_memory.continuity.completion_pct: 0`. Furthermore, the phase map is incomplete, phases 016–021 are "planned / not started", phase 039 is scaffold-only, phase 042 is empty, and 041-design-command-upgrade is an unfilled template. A parent with incomplete child phases and an incomplete phase map cannot truthfully claim "Complete."
- **Finding class:** cross-consumer
- **Scope proof:** Five pieces of evidence demonstrate unfinished state: (1) completion_pct=0, (2) truncated phase map, (3) planned phases 016-021, (4) empty phase 042, (5) template-only 041.
- **Affected surface hints:** ["parent spec.md status", "graph-metadata.json derived.status", "resume routing", "track-level dashboard"]
- **Recommendation:** Either update status to reflect actual state (e.g., "Active" or "In Progress") and add honest completion notes, OR fix all the documented gaps and then claim Complete.

```json
{
  "type": "claim-adjudication",
  "claim": "Parent spec.md claims 'Complete' status while 5+ pieces of evidence show an unfinished track.",
  "evidenceRefs": [
    "154-sk-design-parent/spec.md:41 (Status: Complete)",
    "154-sk-design-parent/spec.md:23 (completion_pct: 0)",
    "graph-metadata.json:75 (derived.status: 'complete')"
  ],
  "counterevidenceSought": "Could 'Complete' mean the parent's own documentation is complete, not the child phases? The spec says parent validates under 'tolerant phase-parent policy' (line 48), suggesting child phases can be independently incomplete. However, the phase map itself is incomplete, which is the parent's own doc.",
  "alternativeExplanation": "The 'Complete' status was set at initial scaffold time as a placeholder and never updated. The completion_pct=0 is a more honest indicator. The graph-metadata.json derived.status being 'complete' is auto-derived from spec.md and thus inherits the same error.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If phase-parent policy explicitly allows a 'Complete' parent with incomplete children, this drops to P2 as a documentation inconsistency. Current evidence does not support this reading."
}
```

**5. Phase 042 Has No Spec Documents**

- **File:** `042-design-work-deep-review/` (directory listing)
- **Evidence:** `read 042-design-work-deep-review` returns only a `review/` subdirectory. No `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `description.json`, or `graph-metadata.json` exist. The strategy §15 notes "Phase 042 (`042-design-work-deep-review`) has no spec docs — empty scaffold." Phase 043 spec.md refers to 042 as "sibling 042 deep review" (043 spec.md:51) and "CONDITIONAL" (line 50), confirming 042 ran a deep review but its own spec docs were never created.
- **Finding class:** instance-only
- **Scope proof:** Directory listing confirms zero spec docs. 043 spec.md confirms 042 produced review findings (which 043 remediated).
- **Affected surface hints:** ["phase 042 directory", "graph-metadata.json children_ids", "resume routing"]
- **Recommendation:** Either create minimal spec docs for 042 (spec.md at minimum) documenting what the deep review covered, or delete the empty phase and move its review artifacts to 043.

```json
{
  "type": "claim-adjudication",
  "claim": "Phase 042 exists as a directory but has no spec documentation.",
  "evidenceRefs": [
    "042-design-work-deep-review/ (directory: review/ only)",
    "043-design-review-remediation/spec.md:51 (references 042 as sibling review)"
  ],
  "counterevidenceSought": "Could the spec docs be in the review/ subdirectory? No — review/ is for deep-review state, not spec docs. Could 042's docs be in a different location? Checked parent — no alternate location.",
  "alternativeExplanation": "042 was a transient review phase intended to be ephemeral, producing findings for 043 to remediate. The lack of spec docs was intentional — the phase was a review pass, not a build phase.",
  "finalSeverity": "P1",
  "confidence": 0.80,
  "downgradeTrigger": "If 042 is intentionally ephemeral (review-only, with its output captured in 043), this drops to P2 as a documentation gap rather than a structural defect."
}
```

**6. 041-design-command-upgrade Is an Unfilled Scaffold Template — Incorrectly Marked Complete in Strategy**

- **File:** `041-design-command-upgrade/spec.md`
- **Evidence:** The spec.md contains template placeholders throughout: line 3 description is "[What is broken, missing, or inefficient? 2-3 sentences...]"; line 62 EXECUTIVE SUMMARY is "[2-3 sentence high-level overview...]"; line 76 Status is "[Draft/In Progress/Review/Complete]"; lines 87-89 are "What is broken" / "One-sentence outcome statement"; the trigger_phrases (lines 4-9) are template defaults: "feature", "specification", "name", "template", "spec core". The `_memory.continuity.packet_pointer` (line 14) = `"scaffold/041-design-command-upgrade"`. The strategy §15 line 187 lists this phase as "complete" with "spec,plan,tasks,checklist,decision-record,impl-summary" — but the actual phase has no real content.
- **Finding class:** instance-only
- **Scope proof:** Direct read of spec.md confirms placeholder content throughout. `_memory.continuity` confirms scaffold state.
- **Affected surface hints:** ["strategy.md status column", "parent phase map", "resume routing"]
- **Recommendation:** Either fill in the spec.md with real content or remove the phase. The strategy's "complete" claim must be corrected.

```json
{
  "type": "claim-adjudication",
  "claim": "A phase exists as an unfilled scaffold template but is listed as 'complete' in the strategy and may have auto-generated doc shells.",
  "evidenceRefs": [
    "041-design-command-upgrade/spec.md:3,62,76,87-89 (template placeholders)",
    "041-design-command-upgrade/spec.md:4-9 (template trigger_phrases)",
    "041-design-command-upgrade/spec.md:14 (packet_pointer: 'scaffold/...')",
    "review/deep-review-strategy.md:187 (listed as 'complete')"
  ],
  "counterevidenceSought": "Could additional docs (plan.md, tasks.md, etc.) exist with real content making it 'complete'? Did not read those files — the spec.md being an unfilled template is sufficient to show the phase is not truly complete.",
  "alternativeExplanation": "The strategy was auto-generated and misread the presence of doc files as 'complete' without checking content. The phase was never actually built.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "None — an unfilled template with 'complete' status is an active correctness issue."
}
```

**7. graph-metadata.json children_ids Contains Stale/Broken References and Missing Phases**

- **File:** `154-sk-design-parent/graph-metadata.json:6-47`
- **Evidence:** The `children_ids` array contains 37 entries but has multiple correctness issues:
  - **Stale references:** Line 41: `031-design-context-benchmark` — the actual folder is `035-design-context-benchmark`. Line 42: `032-design-context-hardening` — the actual folder is `036-design-context-hardening`.
  - **Missing phases:** `039-design-enforcement-build`, `041-design-command-upgrade`, `041-sk-design-overview-conformance`, `042-design-work-deep-review`, `043-design-review-remediation`, and `037-design-routing-and-integration-research` are absent from children_ids.
  - **Duplicate 037 handling:** Only `037-design-context-enforcement` appears (line 45). The other 037 phase is omitted entirely.
- **Finding class:** matrix/evidence
- **Scope proof:** Compared graph-metadata.json children_ids (37 entries) against strategy phase list (43 entries + parent = 44 total entries). 6+ phases missing, 2 entries have wrong phase numbers.
- **Affected surface hints:** ["graph-metadata.json", "resume routing", "derived.last_active_child_id", "memory indexing"]
- **Recommendation:** Regenerate graph-metadata.json after fixing duplicate phase numbers to ensure all phases are correctly registered.

```json
{
  "type": "claim-adjudication",
  "claim": "graph-metadata.json contains stale child IDs with wrong phase numbers and omits several active phases.",
  "evidenceRefs": [
    "graph-metadata.json:41 (031-design-context-benchmark — should be 035)",
    "graph-metadata.json:42 (032-design-context-hardening — should be 036)",
    "strategy.md:167-189 (full phase list vs truncated children_ids)"
  ],
  "counterevidenceSought": "Could these be aliases or prior names? Checked actual folders — no 031-design-context-benchmark exists, only 035. Same for 032 vs 036. These are stale references to non-existent folders.",
  "alternativeExplanation": "The graph-metadata.json was generated from an earlier state of the track and never regenerated after phases were renumbered or added.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "None — broken graph metadata breaks resume routing and memory indexing for the affected phases."
}
```

### P2 Findings

**8. All Session Dedup Fingerprints Are Zero-Placeholders**

- **Files:** Every sampled spec.md and implementation-summary.md
- **Evidence:** Every `_memory.continuity.session_dedup.fingerprint` field across all sampled files is `"sha256:0000000000000000000000000000000000000000000000000000000000000000"`. Examples: `001-corpus-research/spec.md:20`, `001-corpus-research/implementation-summary.md:21`, `008-nested-parent-conversion/spec.md:28`, `parent spec.md:20`, `016-register-loader-contract/spec.md:23`, `017-real-bugs/spec.md:23`, `022-mifb-design-research/spec.md:25`, `037-design-context-enforcement/spec.md:24`, `037-design-routing-and-integration-research/spec.md:22`, `043-design-review-remediation/implementation-summary.md:23`.
- **Finding class:** matrix/evidence
- **Scope proof:** Spot-checked 10+ files across different lifecycle stages. All show the zero fingerprint. This is not a coincidence — it's a systematic issue suggesting fingerprint generation is broken, disabled, or was never run.
- **Affected surface hints:** ["_memory.continuity.session_dedup", "CONTINUITY_FRESHNESS gate", "validate.sh --strict"]
- **Recommendation:** Run `generate-context.js` on each phase to populate real content-based fingerprints. Without valid fingerprints, the `CONTINUITY_FRESHNESS` gate cannot detect stale content and `SPECKIT_COMPLETION_FRESHNESS` validation will produce unreliable results.

**9. 001-corpus-research spec.md Has Stale Scaffold Artifacts**

- **File:** `001-corpus-research/spec.md:178-189`
- **Evidence:** Lines 178-189 contain `SCAFFOLD_VALIDATION_COUNTS:` comments with orphaned REQ IDs (REQ-003 through REQ-008) and `**Given**` placeholders from the spec template scaffolding process. These were never cleaned up after the spec was authored.
- **Finding class:** instance-only
- **Scope proof:** Grep for `SCAFFOLD_VALIDATION_COUNTS` across the track would identify other phases with the same issue. Only checked 001 — could exist elsewhere.
- **Affected surface hints:** ["001-corpus-research/spec.md trailing lines"]
- **Recommendation:** Remove the scaffold artifact block (lines 178-189) from the completed spec.

---

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | P1 gap | Parent phase map doesn't reflect actual child phases 022-043 |
| `checklist_evidence` | deferred | 24 child phases have checklist.md; not spot-checked this iteration |

---

## Integration Evidence

Not inspected this iteration — correctness dimension focused on structural integrity, not integration surfaces.

---

## Edge Cases

1. **Phase ordering on disk vs phase map:** Phases 022-034 are "complete" while 016-021 are "planned" — the numbering implies sequential dependency but completion happened out of order. This is not a correctness violation per se (research phases can complete before their predecessor build phases if they're independent), but the handoff chain documented in parent spec.md (001→002→003→004→005→006) doesn't address this non-linear completion pattern.

2. **039-design-enforcement-build is a nested phase-parent:** This phase (spec.md line 1-2) is itself a phase parent with six sub-parents (D1-D6) each holding multiple recommendation phases. The parent phase map has no mechanism to represent nested phase-parents within child phases. This is a structural edge case the phase documentation model may not fully support.

3. **graph-metadata.json `derived.status` is "complete"** (line 75): Same contradiction as parent spec.md — auto-derived from the parent spec's status claim, inheriting the same error.

---

## Confirmed-Clean Surfaces

- **Phase naming conventions (general):** The 12 sampled phases all use the correct `NNN-slug-with-hyphens` format. No naming violations detected in slugs (no embedded packet numbers, no generic root slugs).
- **Frontmatter fields:** All sampled spec.md files have the required frontmatter fields (title, description, trigger_phrases, importance_tier, contextType, _memory.continuity). No missing required fields.
- **016 and 017 status accuracy:** Both correctly marked "Planned (not started)" in their spec.md metadata, matching the strategy's assessment.
- **043 referral chain:** 043 correctly references 042 as its source review and documents 14 findings remediation. Status claims in 043 spec.md (Complete, completion_pct=100) are self-consistent with implementation-summary.md.

---

## Ruled Out

- **Phase 008 "plan-only" status confusion:** 008 claims "Status: Planned (plan-only; not implemented)" (line 75) and `completion_pct: 0` (line 31). This appears consistent — the phase documents a plan, not an implementation. The strategy marks it as "complete" which is correct for a plan-only phase (the plan IS the deliverable). No finding warranted.
- **039 having only spec.md:** 039 is explicitly a scaffold parent for ~70 recommendation phases. Having only spec.md at this stage is expected — the children would hold plan/tasks/checklist. The strategy correctly labels it "scaffold." No finding warranted.

---

## Next Focus

| Field | Value |
|-------|-------|
| Dimension | traceability |
| Focus area | Spec-code alignment and checklist evidence verification |
| Reason | Correctness uncovered 7 active findings (2 P0, 5 P1, 2 P2). Moving to traceability to verify spec-code alignment, cross-reference integrity, and checklist evidence before circling back to deeper correctness checks. |
| Rotation status | Normal rotation to next dimension |
| Blocked/Productive carry-forward | Productive approaches: file:line evidence gathering, strategy-vs-reality cross-checking. Blocked: none. |
| Required evidence | Checklist evidence for phases with checklist.md; cross-reference integrity of phase-to-phase handoff claims; spec-code alignment where applicable. |
| Recovery note | Not applicable |

---

Review verdict: **FAIL**

Review verdict: FAIL
