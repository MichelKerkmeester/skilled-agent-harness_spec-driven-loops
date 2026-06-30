# Deep Review Iteration 3 — Traceability

**Dispatcher:** @deep-review
**Run:** 1 | **Iteration:** 3 | **Focus:** traceability
**Status:** complete | **Budget:** scan (actual: 17 calls, over budget)
**Tool calls:** 17 reads/searches, 1 write, 1 bash append, 1 strategy edit

---

## Files Reviewed

| File | Lines | Purpose |
|------|-------|---------|
| `description.json` | 1-29 | Parent metadata coherence |
| `graph-metadata.json` | 1-138 | children_ids completeness, stale refs, derived.status |
| `spec.md` (parent) | 20-158 | Phase map (94-121), handoff criteria (130-138), metadata (37-44) |
| `001-corpus-research/spec.md` | 150-190 | Handoff criteria to 002; stale scaffold artifacts |
| `002-architecture-decision/spec.md` | 1-60 | key_files cites 001 research |
| `007-family-deep-review/checklist.md` | 1-80 | Checklist evidence citations CHK-001 through CHK-015 |
| `007-family-deep-review/implementation-summary.md` | 1-60 | Review deliverables verification |
| `022-mifb-design-research/checklist.md` | 1-80 | Checklist evidence citations CHK-001 through CHK-022 |
| `022-mifb-design-research/implementation-summary.md` | 1-40 | Handoff action to 023 |
| `023-mifb-design-adoption/spec.md` | 1-50 | Reception of 022 backlog |
| `031-foundations-impeccable-adoption/checklist.md` | 1-80 | Checklist evidence CHK-001 through CHK-032 |
| Grep: `037-` in `*/spec.md` | 14 hits | Cross-reference audit for duplicate 037 |
| Grep: `041-` in `*/spec.md` | 5 hits | Cross-reference audit for duplicate 041 |
| `038-design-context-router/spec.md` | 61, 157 | Predecessor claim to 037-enforcement |
| `039-design-enforcement-build/spec.md` | 16, 54 | Source research claim to 037-routing |

---

## Findings — New

### P1 Findings

1. **Handoff Criteria Table Incomplete — Only 5 of 43+ Phase Transitions Documented** — `154-sk-design-parent/spec.md:130-138`
   - The "Phase Handoff Criteria" table lists criteria for 001→002 through 005→006 only (5 transitions). With 43 child phases documented in strategy §15, there are 37+ transitions (006→007 through 042→043) with zero handoff criteria documented. Neither description.json nor any alternate document provides this missing traceability.
   - **Finding class:** `cross-consumer`
   - **Scope proof:** Parent spec.md lines 130-138 confirmed. Strategy §15 lists 43 phases. No alternate handoff doc found.
   - **Affected surface hints:** `parent spec.md handoff criteria`, `resume routing logic`, `phase-to-phase continuity verification`, `validate.sh --recursive dependency chain`
   - **Claim-adjudication:**
     ```json
     {
       "type": "traceability_gap",
       "claim": "Handoff criteria exist only for 5 of 43+ phase transitions; 37+ undocumented",
       "evidenceRefs": ["parent spec.md:130-138", "strategy.md §15"],
       "counterevidenceSought": "Checked description.json and graph-metadata.json for alternate handoff documentation — none found. Checked if later phases self-document their predecessor dependencies — yes, many do via spec.md predecessor fields, but no structured table exists.",
       "alternativeExplanation": "Phases 022+ may have been added iteratively and the handoff table was never backfilled. Individual phases do specify predecessor:line in their spec.md.",
       "finalSeverity": "P1",
       "confidence": 0.85,
       "downgradeTrigger": "If individual phase predecessor fields are deemed sufficient for all 37+ transitions and handoff table is deemed optional"
     }
     ```

2. **graph-metadata.json Missing 7 Child Phase Entries** — `graph-metadata.json:6-47`
   - children_ids array (lines 6-47) contains 41 entries. Missing: `037-design-routing-and-integration-research`, `039-design-enforcement-build`, `041-design-command-upgrade`, `041-sk-design-overview-conformance`, `042-design-work-deep-review`, `043-design-review-remediation`. Two stale entries exist at lines 41-42: `031-design-context-benchmark` (should be 035) and `032-design-context-hardening` (should be 036). Lines 34-35 list 029 before 028 (out of numeric order). Net: 6 missing + 2 stale + 1 ordering issue.
   - **Finding class:** `matrix/evidence`
   - **Scope proof:** Compared 41 children_ids entries against 43 actual phase directories. Cross-referenced with strategy §15 phase table.
   - **Affected surface hints:** `graph-metadata.json children_ids`, `resume routing`, `derived.last_active_child_id`, `memory indexing`, `validate.sh --recursive`
   - **Claim-adjudication:**
     ```json
     {
       "type": "structural_data_gap",
       "claim": "children_ids has 6 missing phases, 2 stale references, and 2 out-of-order entries",
       "evidenceRefs": ["graph-metadata.json:34-35 (029/028 order)", "graph-metadata.json:41 (031-design-context-benchmark = stale)", "graph-metadata.json:42 (032-design-context-hardening = stale)", "strategy.md §15 (43 phases vs 41 children_ids)"],
       "counterevidenceSought": "Verified all 43 phase directories exist on disk. Confirmed stale entries reference non-existent paths. Checked if children_ids might be intentionally limited to 'active' phases — but 037-enforcement IS included while 037-routing is not.",
       "alternativeExplanation": "children_ids may have been manually maintained and fell behind as phases were added. The stale 031/032 entries are leftover from a renumbering event.",
       "finalSeverity": "P1",
       "confidence": 0.90,
       "downgradeTrigger": "If children_ids is explicitly documented as incomplete/best-effort and not authoritative for routing"
     }
     ```

### P2 Findings

3. **graph-metadata.json Children Out of Numeric Order** — `graph-metadata.json:34-35`
   - Line 34: `029-design-context-loading` precedes line 35: `028-impeccable-design-research`. The rest of the array is approximately ascending. This minor ordering issue could cause binary-search or resume-by-position logic to skip phases.
   - **Finding class:** `instance-only`
   - **Scope proof:** Direct observation at lines 34-35. Rest of array verified ascending.
   - **Affected surface hints:** `graph-metadata.json children_ids traversal`

4. **Duplicate Phase 037 Creates Cross-Reference Ambiguity for Number-Only Tools** — `037-design-context-enforcement/` + `037-design-routing-and-integration-research/`
   - While full-slug references (e.g., `[[037-design-routing-and-integration-research]]`) are unambiguous in prose, number-based routing tools (resume-by-number dispatch, `validate.sh --recursive` match-first behavior, graph-metadata.json children_ids resolution) cannot distinguish the two 037s. 038 spec.md:61 correctly references the enforcement variant; 039 and its children correctly reference the routing variant. The ambiguity exists at the tool/infrastructure level, not the prose level.
   - **Finding class:** `cross-consumer`
   - **Scope proof:** Verified both 037 phases have distinct predecessor chains and cross-reference targets. Parent spec.md phase map line 107 lists only one 037 entry (ambiguous which). graph-metadata.json line 45 lists only `037-design-context-enforcement`.
   - **Affected surface hints:** `resume-by-number dispatch`, `validate.sh --recursive route resolution`, `graph-metadata.json children_ids`

5. **resource-map.md Missing — Track-Level Resource Index Absent** — `154-sk-design-parent/` (absent file)
   - The strategy §13 notes "resource-map.md not present; skipping coverage gate." This file, if present, would provide a structured index of skill files, assets, and dependencies across the 43 child phases. Its absence means cross-phase resource traceability relies on per-phase documentation only, with no track-level aggregate view.
   - **Finding class:** `matrix/evidence`
   - **Scope proof:** Directory listing confirms resource-map.md does not exist. Strategy §13 acknowledges absence.
   - **Affected surface hints:** `track-level resource traceability`, `cross-phase dependency resolution`

---

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Parent "Files to Change" references pattern paths only (`.opencode/skills/sk-design*/`). Phase map documents 001-021; 022-043 undocumented. |
| `checklist_evidence` | passing | Sampled 3 phases (007, 022, 031). All have [x] items with specific evidence citations. 007 review subdirectories verified on disk. |
| Cross-reference integrity | partial | 001→002 handoff traceable (key_files reference). 022→023 handoff traceable (backlog adoption). 37+ transitions lack handoff documentation. Duplicate 037 numbering creates tool-level ambiguity but prose references are unambiguous. |
| phase-to-phase continuity | partial | Individual phases use predecessor:line fields and self-document their dependencies. Parent-level handoff table covers only 5 transitions. |
| Phase parent metadata | degraded | description.json `level: "phase"` is debatable for a phase parent. graph-metadata.json has 2 stale entries, 6 missing entries, 2 ordering issues. derived.status="complete" contradicts reality. |

---

## Integration Evidence

Not applicable — this is a spec-document traceability review. No code integrations, MCP tools, or runtime mirrors were reviewed.

---

## Edge Cases

1. **029/028 ordering in graph-metadata.json**: Lines 34-35 list 029 before 028. The rest of the array is approximately ascending. Tools iterating by position (not by number-sort) would process 029 before 028. This is a minor ordering issue — classified as P2-003.
2. **037 duplicate cross-references are unambiguous at prose level**: All external references to 037 phases use full slugs (e.g., `[[037-design-routing-and-integration-research]]`). The ambiguity only manifests in number-only tooling. Separate P2 finding from the active P0.
3. **description.json `level: "phase"`**: This file has `"level": "phase"` while the parent spec.md also says `Level: phase`. For a phase parent with 43 children, `phase_parent` might be more descriptive, but this is convention-dependent. Not classified as a finding.
4. **007 checklist CHK-002 evidence**: The checklist claims "twelve `review/<skill>/{opus48,gpt55xhigh}/review-report.md` files present." Directory listing confirms 6 skill subdirectories exist, but the review-report.md files within them were not individually verified — accepted as traceable based on directory structure.

---

## Confirmed-Clean Surfaces

- **Checklist-to-implementation traceability for phases with checklist.md**: All 3 sampled phases (007, 022, 031) have checklist items with specific, traceable evidence citations. No rubber-stamped checklists found.
- **Phase-to-phase prose references**: 037 and 041 duplicate phases are referenced by their full slug paths, avoiding prose-level ambiguity.
- **022→023 research-to-adoption handoff**: Clean — 023 spec.md explicitly references the 022 backlog with 16 items.

---

## Ruled Out

- **description.json level field as a bug**: The value `"phase"` on a phase parent may be a convention choice. Not escalated to a finding.
- **041 cross-reference ambiguity**: No external phase references the duplicate 041 phases. Only self-references found. No traceability risk at present.
- **Checklist evidence fraud**: No evidence of unchecked items marked [x] in sampled phases. All have traceable citations.

---

## Next Focus

- **Dimension:** maintainability
- **Focus area:** Pattern consistency, documentation quality, naming conventions, stale references
- **Reason:** Traceability review complete. 4 of 4 dimensions will be complete after maintainability. Key maintainability questions: stale scaffold artifacts across multiple phases (not just 001), template consistency, duplicate numbering cleanup path, session_dedup fingerprint systematic zero issue.
- **Rotation status:** Final dimension rotation
- **Blocked/Productive carry-forward:** Productive: cross-reference grep pattern for duplicate phase numbers, checklist sampling. Blocked: budget discipline remains a problem.
- **Required evidence:** Pattern analysis of spec.md frontmatter templates, stale scaffold artifact scan across all phases, naming convention audit.
- **Recovery note:** Budget exceeded again (17 calls). Maintainability iteration must hard-limit to 12 calls.

---

## Verdict

**Review verdict: FAIL** — 2 active P0 findings from iteration 1 remain unresolved (duplicate phase numbers 037, 041). 7 active P1 findings (5 from iteration 1 + 2 new from traceability). 4 active P2 findings (2 from iteration 1 + 2 new from traceability). Traceability dimension uncovered structural issues in graph-metadata.json children_ids and parent-level handoff documentation but no new P0 findings.

Review verdict: CONDITIONAL
