---
title: "Deep Review Iteration 5 — Correctness Second Pass (Adversarial Self-Check)"
iteration: 5
dimension: correctness
focus: "Adversarial P0 re-examination + deeper structural correctness scan"
status: complete
---

## Dispatcher

Second correctness pass dispatched by the orchestrator. Focus: adversarial self-check on P0-001 (duplicate 037) and P0-002 (duplicate 041), upgrade potential for active P1s, and deeper scan for missed correctness issues (broken predecessor/successor chains, completion_pct/status contradictions, stale scaffold references, undocumented phase structural validation).

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| 037-design-context-enforcement/spec.md | 1-40 | P0-001 evidence re-read |
| 037-design-routing-and-integration-research/spec.md | 1-40 | P0-001 evidence re-read |
| 041-design-command-upgrade/spec.md | 1-45, 55-114 | P0-002 evidence re-read + deeper template audit |
| 041-sk-design-overview-conformance/spec.md | 1-55 | P0-002 evidence re-read |
| 021-content-topups/spec.md | 1-35 | Strategy-vs-reality status check |
| 013-mdgen-boundary-cleanup/implementation-summary.md | 79, 123 | Predecessor reference verification |
| 012-foundations-motion-audit/implementation-summary.md | 84 | Predecessor reference verification |
| All spec.md frontmatter (grep) | — | completion_pct=100 sweep, session_id:scaffold sweep, Status field sweep |
| All implementation-summary.md (grep) | — | Predecessor chain integrity |

## Findings - New

### P2 Findings

1. **021-content-topups strategy status misalignment** — strategy §15:197 — The strategy table lists 021 as "planned" but the phase frontmatter shows `completion_pct: 100` with `session_id: "author-154-021-content-topups"` and `recent_action: "Completed the per-mode content top-ups and refreshed verification evidence"` (line 15). The phase is substantively complete; the strategy status column is stale.

   Finding class: instance-only
   Scope proof: Direct read of 021/spec.md:26 confirms completion_pct=100. strategy.md §15 line 197 lists "planned".
   Affected surface hints: ["strategy.md status column line 197", "021-content-topups/spec.md:26"]

## P0 Adversarial Self-Check

### P0-001: Duplicate Phase Number 037

**HUNTER (what could go wrong):**
- `validate.sh --recursive` encounters two folders matching `037-*`; whether it handles duplicates correctly is implementation-defined.
- `graph-metadata.json` children_ids can reference only one phase by name — the other is invisible to graph traversal.
- Resume-by-number dispatch (`/speckit:resume 037`) is ambiguous.
- Any future tool that indexes phases by bare number prefix will see a collision.

**SKEPTIC (attempt to disprove):**
- Cross-references in prose always use full slugs ("037-design-context-enforcement", "037-design-routing-and-integration-research"), so path-matching tools resolve correctly.
- The parent phase map (spec.md §PHASE DOCUMENTATION MAP) only lists 001-021, so 037 phases are already undocumented there regardless of duplication.
- Both phases independently validate as complete: `completion_pct: 100`, distinct `packet_pointer`, distinct `session_id`. No data corruption resulted from the duplicate.
- No tool has been demonstrated to break from this duplicate in production — both phases were built and completed independently.

**REFEREE:**
- The uniqueness invariant for phase numbers in a flat directory structure is a **correctness** issue, not a convention. Two distinct pieces of work with the same identifier is a data-model violation.
- While the operational blast radius is limited by full-slug cross-referencing, the structural violation remains. The duplicate was introduced at creation time, not by tool error.
- **P0 UPHELD.** Confidence: 0.85. The structural invariant violation is clear; the limited operational impact does not reduce the correctness severity of violating the uniqueness constraint.
- Alternative explanation considered: Could this be intentional (a phase split across two packets)? Rejected — the phases have different predecessor chains (036 vs 028), different session_ids, and different titles; they are independently authored, not a split.
- Downgrade trigger: If a governing spec explicitly permits duplicate phase numbers, downgrade to P1.

**Claim Adjudication:**
```json
{
  "type": "P0",
  "claim": "Two child phases share the number 037, violating the uniqueness invariant for phase numbers in a flat directory structure.",
  "evidenceRefs": [
    "037-design-context-enforcement/spec.md:12-15 (packet_pointer, session_id, completion_pct=100)",
    "037-design-routing-and-integration-research/spec.md:12-15 (packet_pointer, session_id, completion_pct=100)",
    "directory listing confirms two distinct 037- folders"
  ],
  "counterevidenceSought": [
    "Checked: Are there cross-references using bare '037' that would break? Result: No — all cross-references use full slugs.",
    "Checked: Does any tool currently break? Result: Both phases built and completed independently; no operational break confirmed.",
    "Checked: Could this be a split phase? Result: No — different predecessors (036 vs 028), different domains, independently authored."
  ],
  "alternativeExplanation": "Both phases were assigned 037 by independent authors with no coordination. The numbering collision is an organizational error, not a tool bug.",
  "finalSeverity": "P0",
  "confidence": 0.85,
  "downgradeTrigger": "Governing spec explicitly permits non-unique phase numbers."
}
```

### P0-002: Duplicate Phase Number 041

**HUNTER (what could go wrong):**
- Two 041 phases: one complete (`completion_pct: 100`), one completely unfilled template (`completion_pct: 0`, all placeholders).
- The template phase's `packet_pointer` is `scaffold/041-design-command-upgrade` — not even under the correct track path.
- The template's `session_id` is `scaffold-scaffold/041-design-command-upgrade` — double-"scaffold" confirms this was never intended to persist.
- Any tool building a phase index could pick up the template's placeholder content instead of the real phase.
- The strategy §15 lists both 041 phases as "complete" — the template one is mislabeled.

**SKEPTIC (attempt to disprove):**
- The template phase is so obviously scaffold (packet_pointer starting with `scaffold/`, not `skilled-agent-orchestration/`) that no reasonable indexer would treat it as a real phase.
- Could the template simply be deleted (P2 action) rather than treated as a P0? If the template were removed, only one 041 would remain — no duplicate, no P0.
- No external phase references either 041 by bare number (confirmed in iteration 3).

**REFEREE:**
- The duplicate numbering is the primary P0 concern. The fact that one is a scaffold template makes the situation **worse**, not better — the template isn't just a duplicate, it's invalid content that could be accidentally ingested by tooling.
- The double-scaffold session_id (`scaffold-scaffold/`) at line 23 is a stronger signal of unintentional presence than previously documented.
- **P0 UPHELD.** Confidence: 0.90. The duplicate numbering plus the unfilled template at the same number creates a compound correctness issue.
- Alternative explanation considered: Could the template be a placeholder for future work? Possibly — but it should not share a number with an existing complete phase.
- Downgrade trigger: If the scaffold template is removed (leaving only one 041), downgrade to resolved.

**Claim Adjudication:**
```json
{
  "type": "P0",
  "claim": "Two child phases share the number 041, with one being a completely unfilled scaffold template at a duplicate number.",
  "evidenceRefs": [
    "041-design-command-upgrade/spec.md:14 (packet_pointer='scaffold/041-...'), :23 (session_id='scaffold-scaffold/...'), :25 (completion_pct=0), :62-112 (all template placeholders)",
    "041-sk-design-overview-conformance/spec.md:14 (packet_pointer=correct track path), :28 (completion_pct=100), :53 (Status=Complete)"
  ],
  "counterevidenceSought": [
    "Checked: Do external phases reference either 041 by bare number? Result: No (confirmed in iteration 3).",
    "Checked: Could the template be intentional pre-work? Result: The double-scaffold session_id and scaffold/ packet_pointer indicate accidental persistence, not intentional staging.",
    "Checked: Does the strategy correctly label both? Result: No — strategy §15 line 219 lists 041-command-upgrade as 'complete' despite all template placeholders."
  ],
  "alternativeExplanation": "The template was scaffolded as a placeholder for planned work, but 041-sk-design-overview-conformance was built at the same number independently. The template was never cleaned up.",
  "finalSeverity": "P0",
  "confidence": 0.90,
  "downgradeTrigger": "Removal of the scaffold template, leaving only one 041 phase."
}
```

## P1 Upgrade Assessment

### P1-003: Parent phase map truncated at 021
**Upgrade candidate?** No. This is a documentation gap — the spec.md PHASE DOCUMENTATION MAP doesn't list 022-043. While it affects traceability, no tool breaks from this. The strategy §15 provides the complete list. Remain P1.

### P1-004: Parent "Complete" status contradiction
**Upgrade candidate?** Marginal. `Status: Complete` with `completion_pct: 0` is a factual error, but it only affects the parent spec.md metadata display. Resume routing uses `derived.last_active_child_id` from graph-metadata.json, not the parent status. The review-report dashboard and any status-driven UI would be affected. Remain P1.

### P1-005: Phase 042 has no spec docs
**Upgrade candidate?** No. While concerning (an empty phase directory), 042 is referenced only by 043's prose. No tooling depends on 042 having spec docs for correctness. The empty directory doesn't break anything — it's just missing documentation. Remain P1.

### P1-006: 041-design-command-upgrade unfilled template
**Upgrade candidate?** Already partially covered by P0-002 (which captures the duplicate numbering). The "unfilled" aspect is more P1 than P0 — the template itself isn't a correctness break, just stale scaffolding. Remain P1.

### P1-007: graph-metadata.json stale children_ids
**Upgrade candidate?** No upgrade. The stale references (031→035, 032→036) are traceability errors but don't cause incorrect behavior — they just reference old phase names. If a tool tried to navigate to the old names, it would fail to find them. Remain P1.

### P1-010: Handoff criteria table incomplete
**Upgrade candidate?** No. This is a documentation completeness issue. While important for phase-to-phase continuity, it doesn't affect any automated tooling. Remain P1.

### P1-011: graph-metadata.json missing 7 phases
**Upgrade candidate?** No. Related to P1-007. Missing entries mean those phases are invisible to graph traversal, but since the phases exist and are independently findable, this is a traceability gap, not a correctness break. Remain P1.

## Traceability Checks

| Protocol | Status | Notes |
|----------|--------|-------|
| predecessor/successor chains | **passing** | No bare-number references found. All predecessor mentions use full relative paths in prose (e.g., `../012-foundations-motion-audit`). No broken chains detected. |
| completion_pct vs status | **passing** (confirmed P1-004) | No NEW completion_pct/status contradictions found. Existing P1-004 (parent spec) confirmed. |
| scaffold session_id sweep | **passing** (3 known instances) | 003 (legitimate name-match), 040 (known P2-015), 041-cmd-upgrade (known P1-006). No new instances. |
| packet_pointer integrity | **passing** (except 041-cmd-upgrade) | 041-cmd-upgrade uses `scaffold/041-...` (not the track path). All other phases use correct `design/008-sk-design-parent/...` |

## Integration Evidence

N/A — no integration surfaces inspected this iteration (correctness dimension is internal to the spec-doc data model).

## Edge Cases

1. **Predecessor references are prose, not structural**: The `predecessor:` field is not in spec.md frontmatter. References exist only in implementation-summary.md prose (e.g., `../012-foundations-motion-audit`). This means predecessor/successor chains cannot be machine-validated — they're human-intended but structurally unenforceable. Not a finding, but noted for future traceability improvements.

2. **021-content-topups strategy-vs-reality gap**: Strategy §15 labels 021 as "planned" but the phase is complete (completion_pct=100, substantive content). The phase-level metadata is correct; the strategy status column is stale. Recorded as P2-017.

3. **Double-scaffold in 041 session_id**: The `session_id: "scaffold-scaffold/041-design-command-upgrade"` at line 23 is a stronger signal than `scaffold-session/...` — the double "scaffold" prefix indicates the session_id field itself was template-generated (the template fills `session_id: "scaffold-{session_id}/{packet_pointer}"`, and when session_id was also scaffold, it doubled). This strengthens P1-006 but doesn't change its severity.

## Confirmed-Clean Surfaces

- All phases with `completion_pct: 100` have substantive (non-template) content — confirmed by the fact that no other phase beyond 041-cmd-upgrade has `packet_pointer: "scaffold/..."` plus completion_pct=100.
- No broken predecessor/successor chains: all prose references use valid relative paths that resolve to existing phase directories.
- No false `Status: Complete` claims at the individual phase level beyond P1-004 (parent only).
- 003-scaffold-parent's `session_id` containing "scaffold" is legitimate — "scaffold" is part of the phase name, and the session_id format is `design/008-sk-design-parent/003-scaffold-parent`.

## Ruled Out

1. **Upgrading P1-003 to P0**: The truncated phase map is a documentation gap, not a correctness break. No tool depends on the parent phase map for correct operation. The strategy §15 provides the complete list.

2. **Upgrading P1-005 to P0**: An empty phase directory doesn't break any tool or workflow. 042's absence of spec docs is a documentation gap, not a correctness violation.

3. **Predecessor/successor breakage**: No phase references a non-existent predecessor by path. The two prose references found (012, 013) both resolve correctly.

4. **Systematic completion_pct fraud**: No phase claims completion_pct=100 while having template-only content, beyond 041-cmd-upgrade (which is P1-006 already). All other completion_pct=100 phases have substantive descriptions, proper session_ids, and non-template content.

5. **Downgrading P0-001 or P0-002**: The adversarial self-check confirmed both P0 classifications. The uniqueness invariant for phase numbers is a structural correctness requirement. While the operational impact is limited by full-slug cross-referencing, the data-model violation is real.

## Next Focus

- **Dimension:** cross-dimension synthesis
- **Focus area:** Convergence evaluation — all 4 dimensions complete (correctness second pass done). 17 total findings (2 P0, 7 P1, 8 P2). No new P0/P1 found. The adversarial self-check confirmed both P0 classifications. Deep scan found only 1 new P2 (strategy status misalignment for 021).
- **Reason:** Second correctness pass complete. No P0/P1 upgrades or new P0/P1. Signal is diminishing. Recommend convergence check and synthesis.
- **Rotation status:** All dimensions complete (2/4 via second pass). Correctness double-covered.
- **Blocked/Productive carry-forward:** Productive: batch grep + targeted reads. Blocked: budget discipline (5/5 iterations over budget).
- **Required evidence:** Compute severity-weighted newFindingsRatio for convergence.
- **Recovery note:** N/A — all dimensions covered, adversarial check complete.

Review verdict: FAIL
