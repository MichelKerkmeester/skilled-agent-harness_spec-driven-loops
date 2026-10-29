---
title: "Implementation Summary"
description: "Three research iterations measured the 16 AI Systems skills, their loaders and the gates that read their routing, so phase 008 can move each machine router into a sibling ROUTER.md without breaking a benchmark or a Claude Project."
trigger_phrases:
  - "ai systems research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research"
    last_updated_at: "2026-10-29T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Merged the lineage into research.md and checked the citations in the AI Systems checkout"
    next_safe_action: "Scope phase 008 from the findings"
    blockers: []
    key_files:
      - "specs/sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0271-ai-systems-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-ai-systems-research |
| **Completed** | 2026-10-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The AI Systems move now has a map. Of the 17,935 words in the 16 routing sections, 13,130 are machine data, and two gate families have to change before the first skill moves.

### Phase 7: ai-systems-research

DeepSeek ran three iterations: the per-skill split of prose and machine data, then the loaders and gates, then the four existing routers and the migration. No loader reads a file beside `SKILL.md`, so the pointer link is the load path. Claude Projects are written by hand, so the synthesis recommends one routing knowledge document per Project. The Product Owner hub gate forbids a packet `ROUTER.md` and two benchmark gates slice the prose out of `SKILL.md`; both change first. The move takes about 17,460 tokens out of the skill loads, and the order runs from Media Editor to Product Owner by how quiet each skill has been.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | The merged synthesis, with the conductor's citation check |
| `research/lineages/deepseek/` | Created | Lineage iterations, state and synthesis |
| `research/findings-registry.json`, `fanout-attribution.md`, `resource-map.md`, `deep-research-config.json` | Created | Merge outputs and the root config |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` | Modified | Phase docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `/deep:research` loop ran through its fan-out path with one lineage, finishing at 11:45 UTC after about six minutes. `fanout-merge.cjs` merged 38 findings, the reducer emitted the resource map, and the coordinator wrote the root synthesis, reread the load-bearing citations in the AI Systems checkout and recorded the closeout through the event gateway. Nothing was written in the AI Systems repository.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One routing knowledge document per Claude Project | A Project cannot follow a relative link, and copying every repository `ROUTER.md` in would add cost to every retrieval |
| Gate edits before any move | `check_hub.py` and both `differential.py` gates would fail on the first moved skill |
| Media Editor first, Product Owner last | Media Editor is quiet and ungated; Product Owner has daily commits and a packet gate |
| Cite an RS code with its repository | The vendored copy and this repository number RS-004 and RS-005 differently |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| DeepSeek lineage | 3 iterations, run `completed`, exit 0; one `containment_contested` warning at 11:45:32Z |
| Merge | `merged_lineages: 1`, 38 findings |
| Citation checks | `check_hub.py:58`, `differential.py:268`, `agent-router.md:329`, the Product Owner router headings, `check-route-table.py:35`: all match; `AGENTS.md` corrected from line 119 to 123 |
| AI Systems working tree | Only the two earlier untracked files under `Product Context/Collab Phases/` |
| Closeout gateway | `"status":"ok"` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The citations point into another repository.** The `SOURCE_TAGS` rule resolves paths in this repository only, so it cannot confirm them; the conductor's reread is the check.
2. **Two questions stay open for phase 008.** How many kernel words survive the interlock test, and whether the Moneybird hub gains a router of its own.
<!-- /ANCHOR:limitations -->

---
