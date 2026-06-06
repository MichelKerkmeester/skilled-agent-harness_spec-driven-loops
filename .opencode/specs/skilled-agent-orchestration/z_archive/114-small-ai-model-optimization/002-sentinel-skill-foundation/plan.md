---
title: "Implementation Plan: foundation routing — sentinel sk-small-model + AGENTS.md + enhances edges"
description: "Workflow plan for Phase A: 2 internal packets (sentinel skill creation, routing wiring). Sequential execution; total ~6 hours."
trigger_phrases:
  - "foundation routing plan"
  - "sentinel skill plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/002-sentinel-skill-foundation"
    last_updated_at: "2026-05-18T13:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 002 plan.md L2"
    next_safe_action: "Author 002 tasks.md"
    blockers: []
    key_files:
      - "spec.md"
      - "../001-research-smallcode/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000003"
      session_id: "114-002-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: foundation routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Markdown + JSON (skill metadata) + AGENTS.md edit |
| **No code** | Pure metadata + docs changes; no TypeScript or runtime changes |
| **Validation** | Skill-advisor 5-lane scorer simulation + manual structural review |

### Overview

Ship a thin sentinel `sk-small-model` skill (~200 LOC SKILL.md, ~100 LOC pattern-index.md), edit cli-devin + cli-opencode graph-metadata.json to add reverse enhances edges, and add a "Small-model dispatch rule" to AGENTS.md. The skill-advisor re-indexes after edits so subsequent dispatches surface sk-small-model with confidence ≥ 0.8.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] spec.md L2 strict-validates
- [ ] research.md §RQ5 HYBRID-with-Anchor verdict confirmed as the architecture input
- [ ] Skill-advisor scorer source read (fusion.ts:41-200 understood)

### Definition of Done

- [ ] sk-small-model skill directory created with all 4 required files (SKILL.md, description.json, graph-metadata.json, references/pattern-index.md)
- [ ] AGENTS.md contains "Small-model dispatch rule" with literal text matching the research.md §RQ5 Refined Verdict template
- [ ] cli-devin/graph-metadata.json + cli-opencode/graph-metadata.json have new enhances edges with weight 0.4–0.5 + context strings
- [ ] Skill-advisor re-index ran; simulation on 3 sample prompts confirms sk-small-model in top-3 with confidence ≥ 0.8
- [ ] No regression: existing cli-devin/cli-opencode advisor scores stay within ±0.05 on non-small-model prompts
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Sentinel skill + cross-skill enhances graph. The sentinel holds NO production logic — only philosophy + a pattern-index linking to where the real patterns live in cli-devin/cli-opencode. This is the HYBRID-with-Anchor verdict from research.md §RQ5.

### Key Components

- **sk-small-model/SKILL.md**: 1-paragraph philosophy ("When dispatching to small models, consult these references for budget/verification/permissions guidance") + section listing the linked references with relative paths
- **sk-small-model/graph-metadata.json**: enhances edges to cli-devin (weight 0.5) and cli-opencode (weight 0.5); trigger_phrases include "small model", "swe-1.6", "context budget", "verification pipeline", "permissions matrix", "tool scoring", "escalation"
- **sk-small-model/references/pattern-index.md**: ~50 LOC stub table {pattern_name, current_location, status}; expected to fill out as 003-007 ship
- **cli-devin/graph-metadata.json**: add reverse enhances edge to sk-small-model with context "small-model dispatch surface"
- **cli-opencode/graph-metadata.json**: same
- **AGENTS.md**: new rule under §1 after the existing CLI dispatch rule

### Smart Routing

Skill-advisor's 5-lane scorer (`fusion.ts`) reads trigger_phrases + key_topics + enhances edges. New sk-small-model trigger phrases will pull it into the lexical and derived_generated lanes for any prompt containing small-model keywords. The enhances edges pull sk-small-model into the graph_causal lane whenever cli-devin or cli-opencode are already high-confidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

### Modified Surfaces (this packet)

| Surface | Path | Type | Notes |
|---------|------|------|-------|
| New skill | `.opencode/skills/sk-small-model/` | Create | Sentinel skill, ≤300 LOC total |
| cli-devin metadata | `.opencode/skills/cli-devin/graph-metadata.json` | Modify | Add 1 enhances edge |
| cli-opencode metadata | `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | Add 1 enhances edge |
| AGENTS.md | `AGENTS.md` | Modify | Add 1 rule under §1 |

### Read-only Surfaces

| Surface | Path | Notes |
|---------|------|-------|
| sk-prompt enhances precedent | `.opencode/skills/sk-prompt/graph-metadata.json` | Template for the new edges |
| Skill-advisor scorer | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Read line 41-200 for threshold logic |
| Research synthesis | `../001-research-smallcode/research/research.md` §RQ5 Updated Verdict | Authoritative source for HYBRID-with-Anchor structure |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Sentinel Skill Creation (~4 hours)

- Create `.opencode/skills/sk-small-model/` directory
- Author SKILL.md with frontmatter (name, description, allowed-tools=[], version=0.1.0) + 1-paragraph philosophy body
- Author graph-metadata.json with trigger_phrases + key_topics + enhances edges to cli-devin and cli-opencode
- Author references/pattern-index.md as a stub
- Run generate-context.js to mint description.json

### Phase 2: Routing Wiring (~2 hours)

- Edit cli-devin/graph-metadata.json: add reverse enhances edge to sk-small-model (weight 0.5)
- Edit cli-opencode/graph-metadata.json: same
- Edit AGENTS.md §1: insert "Small-model dispatch rule" under the existing CLI dispatch rule
- Trigger skill-advisor re-index via `python3 .../skill_advisor.py --rebuild`

### Phase 3: Validation (~30 minutes)

- Simulate 3 sample prompts via skill_advisor.py + confirm sk-small-model in top-3 with confidence ≥ 0.8
- Run regression check: existing high-confidence skills on non-small-model prompts stay within ±0.05
- Memory search for "small model optimization patterns" returns sk-small-model
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

### Pre-Loop

- N/A — this is a metadata change, no runtime testing required

### Per-Edit

- After each metadata change: run `jq` to validate JSON well-formed
- After AGENTS.md edit: visual diff to confirm rule placement

### Post-Implementation

- Skill-advisor scorer simulation on 3 prompts: "dispatch SWE-1.6", "cli-devin SWE-1.6 budget", "small model verification pipeline"
- Confirm sk-small-model appears in top-3 with confidence ≥ 0.8 on at least 2/3 prompts
- Regression check: non-small-model prompts (e.g. "code review TypeScript file") don't have sk-small-model in top-3
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Risk if Blocked | Mitigation |
|------------|------|-----------------|------------|
| Skill-advisor MCP running | Internal | Re-index won't propagate | Restart advisor MCP child if needed |
| AGENTS.md current line 39 anchor (existing CLI dispatch rule) | Internal | Insert location unclear | Use search-and-insert-after on existing rule text, not line number |
| sk-prompt enhances precedent | Internal | Template might shift | Confirm precedent structure before authoring new edges |
| cli-devin/cli-opencode graph-metadata.json schema | Internal | Schema may change | Schema is stable per packet 113 commits; safe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

### If Skill-Advisor Re-Index Fails

- Delete `.opencode/skills/sk-small-model/` directory entirely
- Revert cli-devin/cli-opencode graph-metadata.json (git checkout)
- Revert AGENTS.md edit (git checkout)
- Re-run advisor re-index (will succeed; back to baseline)

### If Sentinel Skill Gets Over-Surfaced

- Lower enhances edge weights from 0.5 → 0.3
- Re-index
- Re-test with sample prompts

### If AGENTS.md Edit Conflicts

- Use git stash to save the edit, rebase, re-apply with corrected anchor
- No data loss possible (pure docs change)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (sentinel creation)
  ↓ (sk-small-model directory + 4 files present)
Phase 2 (routing wiring)
  ↓ (metadata edits + re-index complete)
Phase 3 (validation)
  ↓ (scorer simulation green)
```

Phase 1 must complete before Phase 2 (the reverse enhances edges in Phase 2 reference the sk-small-model skill that Phase 1 creates).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort | Owner |
|-------|--------|-------|
| Phase 1 (sentinel creation) | ~4 hours | Implementer (cli-devin SWE-1.6 free tier or human) |
| Phase 2 (routing wiring) | ~2 hours | Implementer |
| Phase 3 (validation) | ~30 minutes | Implementer |
| **TOTAL** | **~6.5 hours** | |

Wall-clock can be compressed if a human authors directly (no SWE-1.6 dispatch overhead).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Selective Rollback

If only the AGENTS.md edit causes problems but the sentinel skill is fine, revert AGENTS.md alone. Sentinel skill + enhances edges can stay.

### Forward Recovery

If sentinel is shipped but downstream phases (003-007) never materialize, the sentinel becomes a dead-end discovery target. Mitigation: pattern-index.md says "see roadmap follow-on-phases.md" so operators have a fallback.

### Data Loss

None — pure docs/metadata changes. No state corruption possible.
<!-- /ANCHOR:enhanced-rollback -->
