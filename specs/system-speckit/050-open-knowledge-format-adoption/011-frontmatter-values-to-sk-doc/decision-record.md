---
title: "Decision Record: the frontmatter value list moves to sk-create-frontmatter"
description: "Amends the contextType policy in phase 002: the document values and tiers move to sk-create-frontmatter, which owns the frontmatter contract, and the session list stays in system-spec-kit as a literal."
trigger_phrases:
  - "decision record"
  - "frontmatter value list owner"
  - "contextType policy amendment"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc"
    last_updated_at: "2026-10-04T19:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the owner change for the value list"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files:
      - "../002-baseline-and-decisions/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: the frontmatter value list moves to sk-create-frontmatter

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Move the document values and tiers to sk-create-frontmatter

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, 2026-10-04: "yes please move make phase for it", answering whether the list should live in sk-create-frontmatter with spec-kit referencing it. Drafted by claude-opus-5-5 |
| **Amends** | `002-baseline-and-decisions/decision-record.md` ADR-001 (D1), its owner and its "two named lists in one file" |

---

<!-- ANCHOR:adr-001-context -->
### Context

Phase 002's ADR-001 put both lists in one spec-kit file, with sk-doc consuming it. Phase 003 built that as `system-spec-kit/shared/frontmatter-values.json`, read by four checkers. Two of the three lists describe frontmatter: the document `contextType` values and the `importance_tier` values. `sk-create-frontmatter` owns the frontmatter contract, so sk-doc's own validator reaches into spec-kit to learn what its contract allows. The third list, the 11 session values, classifies saves and drives the project phase and memory type. Only spec-kit reads it.

### Constraints

- The values must not change, and no session behavior may change.
- `@spec-kit/shared` builds to an untracked `dist/` with `rootDir "."`, so a static JSON import from another skill would break the build.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the document values and tiers move to `sk-doc/sk-create-frontmatter/assets/frontmatter-values.json`, and the session list stays in `context-types.ts` as a literal.

**How it works**: the new file holds `contextType` and `importanceTier`, each a canonical list and an alias map. `context-types.ts` reads it at run time, walking up from its own folder to `.skilled/skills`, so the same code works from source and from `dist/`. The rule helper, `validate_document.py` and the advisor checker each point at the new path. The old file is deleted.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Document values and tiers to sk-create-frontmatter, session list stays** | Each list lives with its owner | Two places to look | 8/10 |
| Move the whole file, session list included | One file | sk-doc would own a list only the save runtime uses | 5/10 |
| Leave it in spec-kit | No change | sk-doc's contract depends on another skill's internals | 3/10 |

**Why this one**: each list ends up with the skill whose behavior it defines.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- An author of the frontmatter contract edits one file in their own skill to change what every checker accepts.

**What it costs**:
- spec-kit's shared module reads a file from another skill at run time.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The walk-up finds no file when the module runs from an unexpected folder | M | The read fails with the path it tried, and the build is checked by loading `dist/context-types.js` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | sk-doc's validator reads spec-kit's internals today |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | One file moves, four readers repoint |
| 4 | **Fits Goal?** | PASS | The operator chose it |
| 5 | **Open Horizons?** | PASS | The session list can move later on its own |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The new file, `context-types.ts`, `tsconfig.json`, the three other readers, their tests and the docs that name the path.

**How to roll back**: nothing is committed. Restore the tracked files and recreate the old JSON from the new file plus the 11 session values.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
