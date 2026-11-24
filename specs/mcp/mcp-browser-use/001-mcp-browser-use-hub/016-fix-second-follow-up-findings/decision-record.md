---
title: "Decision Record: Phase 16: fix-second-follow-up-findings"
description: "Decision record template for documenting architectural choices, alternatives, consequences and implementation notes."
trigger_phrases:
  - "fix second follow up findings decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/016-fix-second-follow-up-findings"
    last_updated_at: "2026-11-24T09:36:46Z"
    last_updated_by: "template-author"
    recent_action: "Recorded ADR-001 and Q010"
    next_safe_action: "Decide the fleet-wide front-door callout change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-fix-second-follow-up-findings"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 16: fix-second-follow-up-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: A keyword match inside a longer match counts once

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Operator (Q010), Claude |

---

<!-- ANCHOR:adr-001-context -->
### Context

Each mode lists its full id and its short alias, for example `mcp-chrome-devtools` and `chrome devtools`. The full id folds to a string that contains the alias, so a prompt naming the id matched both and scored twice. With `ambiguityDelta` 1, that dropped any mode named by its alias from the bundle. 015 added `mcp-bladebro` to Bladebro's aliases, which fixed only the prompt naming all three ids.

### Constraints

- The canary corpus and the replay must hold.
- The fix stays inside this hub's router.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: drop a matched keyword when another matched keyword of the same mode contains it.

**How it works**: `scoreModes` dedupes the folded matches, then filters out each one that is a substring of another match, and scores the rest.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Drop contained matches** | Fixes every id and alias pair at once | Changes the scorer | 8/10 |
| Add more aliases per pair | Data only | Fixes one prompt shape per edit, as 015 showed | 3/10 |
| Raise `ambiguityDelta` | One number | Turns single-mode prompts into bundles | 2/10 |

**Why this one**: it removes the cause rather than one prompt shape.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Any mix of ids and aliases routes the named modes together.

**What it costs**:
- A prompt that names a mode by its full id scores one hit lower than before. Mitigation: the canary corpus and the replay show no route change.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A single-mode prompt becomes a bundle | L | 56-row replay, 18 canary cases |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The reviewer's prompt reproduced the drop |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | One filter in one function |
| 4 | **Fits Goal?** | PASS | The operator chose to fix all five findings |
| 5 | **Open Horizons?** | PASS | New aliases need no extra entries |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `router.cjs` `scoreModes` and its authored archive copy.
- Canary cases `mixed-id-and-alias-bundle` and `aside-in-prose`.

**How to roll back**: revert the phase commit, then re-mint the activation manifest and copy it to its archive path.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q010 | Open phase 016 and fix all five confirmed generation-4 P1 findings, then verify and commit when green without pushing. | Not stated. | None | spec.md scope, ADR-001 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q010
<!-- source: claude:f7099de4-e8ec-43e6-a849-849dabb1c94c:gen4-result-016:0 -->

Question (condensed from the text asked):
```text
The DeepSeek re-review (generation 4) found no P0 and five confirmed P1s. How should I proceed?
```

Options:
```text
Phase 016: fix all 5 (Recommended)
Fix 1, 2, 4, 5; ask on 3
Record and stop
```

Answer:
```text
Phase 016: fix all 5 (Recommended)
```
<!-- /ANCHOR:operator-answers-verbatim -->
