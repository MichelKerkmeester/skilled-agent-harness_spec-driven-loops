---
title: "Feature Specification: v4 changelog in the root README voice"
description: "Rewrite `../CHANGELOG-v4.0.0.0.md` into the root README's presentation style, correct the four counts the tree contradicts, and surface the two late-cycle arrivals in the glance list without changing any other fact."
trigger_phrases:
  - "v4 changelog voice rewrite"
  - "changelog readability"
  - "changelog stale counts"
  - "v4 changelog readme voice"
  - "prose wall rewrite"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/045-v4-changelog-voice-rewrite"
    last_updated_at: "2026-09-21T00:00:00Z"
    last_updated_by: "pi"
    recent_action: "Opened the packet for the changelog voice rewrite"
    next_safe_action: "Rewrite the census walls, then the four count corrections"
    blockers: []
    key_files:
      - "../CHANGELOG-v4.0.0.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-21-v4-changelog-voice"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: v4 changelog in the root README voice

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-21 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-speckit/033-system-speckit-v4 |
| **Phase** | 45 of 45 |
| **Predecessor** | 044-v4-changelog-late-cycle-entries |
| **Successor** | None |
| **Handoff Criteria** | The changelog reads in the README voice, the census returns zero walls, the HVR scan returns zero hard blockers, and the fact extraction differs from the pre-rewrite copy only in the four corrected counts and the two new glance bullets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 45** of the v4 packet set, the last child under `033-system-speckit-v4`.

**Scope Boundary**: `../CHANGELOG-v4.0.0.0.md` and this packet's own documents. The release itself, the root README, and every other child's content stay as they are.

**Dependencies**:
- The tree facts the four corrections rest on: the hub inventory, `mcp-tooling/mode-registry.json` and the compiled-routing activation cohort.
- The late-cycle facts 044 recorded, which are the only source for the two new glance bullets.

**Deliverables**:
- The changelog rewritten into benefit-led bullets and short paragraphs, with every fact preserved.
- The four corrected counts and the two new "What's New at a Glance" bullets.
- This packet: spec, plan, tasks and the implementation summary with its evidence.

**Changelog**: This packet is the changelog entry for the rewrite. No nested changelog file is created.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`../CHANGELOG-v4.0.0.0.md` tells the v4 story in the shape of the draft it grew from, and that shape costs the reader. Forty-two body paragraphs run past four sentences or 500 characters, the worst at 1,437 characters (line 553) and 1,143 (line 352), where the root README spends one benefit-led bullet per idea. Four counts in the document contradict the tree it describes: "Six hubs" where seven carry both router files (line 21), "ten modes" for `mcp-tooling` twice (lines 41 and 511) where the live registry holds nine, and "the other five hubs" in the `sk-design` caveat (line 392) where six hubs resolve the compiled router contract first. The two late-cycle arrivals 044 recorded, the `cli-jev` judgment transport and the `cli-orca` promotion, appear only in "After This Draft" and never reach the summary list a reader skims first.

### Purpose

The changelog presents each change the way the root README does, one idea per bullet with a bold label, so a reader can skim it in one pass and still trust every number in it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the 42 census paragraphs into benefit-led bullets with bold labels or 2-3 sentence paragraphs, keeping the section order and the heading skeleton
- Correct the four stale counts, each re-verified against the tree before the edit
- Add two "What's New at a Glance" bullets for the jev transport hub and the orca promotion, sourced only from the facts 044 recorded
- Record the work in this packet

### Out of Scope
- The root README outside this packet's citation of its voice as the standard
- Any fact the four corrections and the two bullets do not name, including the "After This Draft" content
- Republishing the release or rewriting the changelog's history

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../CHANGELOG-v4.0.0.0.md` | Modify | Voice rewrite, four count corrections, two glance bullets |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Create | The packet and its evidence |
| `../spec.md`, `../timeline.md` | Modify | Phase map row 45 and the timeline milestone |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every census paragraph becomes benefit-led bullets or 2-3 sentence paragraphs | The wall census returns 42 before and 0 after |
| REQ-002 | The prose passes the human voice rules | The scanner reports 0 hard blockers, and every remaining semicolon sits inside an `&nbsp;` entity |
| REQ-003 | No fact changes beyond the enumerated corrections and the two new bullets | The backtick, hex and numeral extraction differs from the pre-rewrite copy only in those deltas |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The four counts match the tree | Seven hubs, nine `mcp-tooling` modes, six compiled-routing hubs, each read from its source |
| REQ-005 | Structure survives the rewrite | 18 H2, 56 H4, 19 `---` and 44 `&nbsp;` before and after |
| REQ-006 | The packet validates | `validate.sh 045-v4-changelog-voice-rewrite --strict` returns `RESULT: PASSED` and the parent stays green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The wall census over `../CHANGELOG-v4.0.0.0.md` returns 0 paragraphs over four sentences or 500 characters
- **SC-002**: `hvr_scan.py` reports 0 hard blockers and `rg ";"` outside `&nbsp;` entities returns no hits
- **SC-003**: The four corrected counts read 7, 9, 9 and 6, matching the hub inventory, the mode registry and the activation cohort
- **SC-004**: The extraction diff against `HEAD` shows only the four corrections and the two new bullets
- **SC-005**: The heading and separator counts are unchanged at 18, 56, 19 and 44
- **SC-006**: Both `validate.sh --strict` runs return `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A rewrite of this size drifts a fact silently | The release notes misstate what shipped | Extract every backtick span, hash and numeral and diff the extraction against `HEAD` |
| Risk | A concurrent writer edits the file mid-rewrite | Lost work or a reverted neighbour's edit | Re-read anchors before each edit and never revert what another session wrote |
| Dependency | The census and the HVR scanner, both run from the repository | No objective gate on the rewrite | Run both before the edit to fix the baseline, then after to prove the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The plan settled the scope, the four corrections and the two bullets.
- What should the v4 changelog keep, merge, move, or drop — and in what order — to serve its audience in the root README voice, given the post-rewrite commits, the 033 specs, and the sk-create-changelog contract? (deep-research run active; implementation deferred)
<!-- /ANCHOR:questions -->

## RESEARCH CONTEXT

Deep-research is active for this topic. `research/research.md` remains the canonical research source.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Research findings

- The changelog's structure — not its sentence shape — is what costs the reader. The voice rewrite holds; the remaining work is structural and factual.
- Recommended order: intro merged with the thesis, a glance list compressed to about 15 bullets, then core (Spec Kit → Deep Loops → Orchestrating → Advisor), families (Code → MCP → Design → Documentation → Prompt), system surfaces, Upgrade Notes, and a collapsed "Under the Hood" appendix; drop "After This Draft".
- Six path fixes are correctness, not style: `.opencode/bin/skill-advisor.cjs` and `.opencode/hooks/` are dead at HEAD, and the blanket "every `.opencode/*` path still resolves" sentence is false as written. Also fix the Six→Seven contradiction, drop "178 recommendations", soften or drop the drifted counts, and reword the blanket alias sentence.
- Contract: the 44 `&nbsp;` separators are mandated by the contract's structure rules and must not be stripped; location, frontmatter and the H1 are recorded deliberate departures.
- Deferred implementation: apply the ordered patch list and outline against the pinned changelog blob (sha256 `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19`), re-running the pin sentinel first. Full evidence: `research/research.md`.
<!-- END GENERATED: deep-research/spec-findings -->

---
