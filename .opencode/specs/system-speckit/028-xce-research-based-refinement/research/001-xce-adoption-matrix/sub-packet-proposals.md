---
title: "XCE Research — Sub-Packet Proposals"
packet: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement"
totalProposals: 5
created: "2026-05-08T18:00:00Z"
---

# Sub-Packet Proposals

Five candidate sub-packets cover the 4 ADOPT and 9 ADAPT feature rows from the adoption matrix. This file is the pass-1 proposal set; the implementation child specs now apply the pt-02 cross-validation amendments from `research/027-xce-research-based-refinement-pt-02/sub-packet-amendments.md`.

**Post-pt-02 overlay**:
- Phase 004 should run first because it is the smallest treatment-variable change and now includes high-uncertainty guard fixtures.
- Phase 001 remains the data-contract source for `classifyFileRole(filePath, db)` and deterministic HLD/LLD output.
- Phase 002 must use `CodeNode.filePath` as ownership truth; CONTAINS is display metadata, not the file/module source.
- Phase 003 must aggregate symbol-level edges by file, use incoming TESTED_BY evidence, and keep narrative enrichment disabled unless explicitly configured.
- Phase 005 is Level 3 after subprocess/auth/result-schema hardening and mocked dispatcher stress requirements.

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/sub-packet-proposals.md.
## Proposal 4: `031-skill-advisor-first-action-mandate` — Strengthened Advisor Brief Rendering

**Scope summary**: Implement the render-layer change proposed in RQ6 (F-036), amended by pt-02. Strengthen the `skill_advisor/lib/render.ts` brief from suggestion ("use ${label}") to mandate ("MUST invoke ${label} FIRST (${score}/${uncertainty}) - ${action_hint}") only when confidence and uncertainty thresholds both pass. Add `FIRST_ACTION_HINT` with fallback behavior and migrate old exact-string fixtures to directive-shape assertions. No scorer changes.

**Level estimate**: L1 (~80-120 LOC including fixture updates)
**Files**: 1 edit (`skill_advisor/lib/render.ts` +30 LOC)

**Dependencies**:
- Requires: existing `render.ts` (renderAdvisorBrief, capText, token caps — already shipped)
- Requires: existing `skill-advisor-brief.ts` (integration confirms render.ts is sole prompt-boundary gate)
- Feeds into: `032-eval-harness` (measurement of briefing change impact on token reduction)

**Risk register**:
| Risk | Severity | Mitigation |
|------|----------|------------|
| "MUST invoke" is too strong for low-confidence scenarios | Low | Advisor only fires when confidence ≥ 0.8 (render.ts:124-133). At that threshold, "MUST" is justified. |
| First-action hint for CLI skills is confusing ("MUST invoke cli-claude-code FIRST") | Low | Confidence ≥ 0.8 ensures external CLI skills only surface when the prompt genuinely matches their domain. |
| Brief grows from ~60-80 chars to ~90-180 chars, hitting DEFAULT_TOKEN_CAP | Low | Both old and new formats fit within the 80-token default cap (320 chars). capText() truncation safety net remains. |

**Out of scope**:
- Scorer surgery (scorer/ dir changes) — out of scope per spec.md:129
- Dynamic per-intent first-action selection — current design uses static per-skill hints (dynamic intent→skill routing is the scorer's job)

---

> Code-graph + cocoindex content for this section extracted to 028/research/027-xce-research-pt-01/sub-packet-proposals.md.
