---
title: "Feature Specification: A6 HVR Style Auto-Fix Linter [template:level_2/spec.md]"
description: "The HVR house voice (no em-dashes, no prose semicolons, no Oxford commas) is documented but unenforced on authored spec-docs, so the rule drifts by hand. No fence-aware length-neutral style fixer exists in the live quality machinery."
trigger_phrases:
  - "hvr style"
  - "em-dash linter"
  - "prose semicolon"
  - "oxford comma"
  - "style auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/006-hvr-style-autofix"
    last_updated_at: "2026-07-04T17:11:59.545Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec for A6 HVR style auto-fix linter"
    next_safe_action: "Generate description.json and graph-metadata.json then plan tasks"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: A6 HVR Style Auto-Fix Linter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `006-hvr-style-autofix` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The HVR house voice (no em-dashes, no prose semicolons, no Oxford commas) is a documented authoring rule that no tool enforces, so adherence drifts every time a spec-doc is hand-edited. The live quality machinery in `quality-loop.ts` scores triggers, anchors, budget and structure but carries no prose-style check (grep for em-dash, semicolon, oxford and fence in that file returns only unrelated JSDoc matches), and the destructive `runQualityLoop` auto-fix path is the wrong host because it trims content to an 8000-char budget via `substring` and would silently amputate a 10KB spec.

### Purpose
Ship a fence-aware, length-neutral prose-style fixer that is the one safe content-mutating detector, registered `safe` in the frozen `fixClass` allow-list, so the HVR voice is mechanically enforced on authored spec-docs without ever touching code, frontmatter or document length.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `hvr.style` detector entry on the shared `detector-registry.ts` declaring `{id, surface: 'spec-doc', detect, fixClass: 'safe', fix}`.
- A fence-aware prose-range parser that excludes fenced code blocks, inline code spans and YAML frontmatter from both detection and mutation.
- Three deterministic swap rules over prose ranges only: em-dash to spaced hyphen or sentence split, prose semicolon to sentence split or comma, Oxford comma removal before the terminal conjunction.
- A length-neutrality guard and a `content_hash` idempotency guard so re-running over already-clean prose is a no-op.
- `detect` (report mode) returns issue ranges with no write. `fix` (apply mode) runs only when `'safe'` is in `opts.allowFixClass`, with atomic writes.
- Unit fixtures covering each swap rule, fence exclusion, frontmatter exclusion and idempotency.

### Out of Scope
- The shared `dq-engine.ts` core, the `detector-registry.ts` scaffold and the frozen allow-list mechanism itself - owned by the shared-safe-fix-engine phase (this phase adds one registry entry to it).
- The on-write (A1), scheduled-sweep (B1) and `/doctor` (B2) front doors - this is a detector, not a front door.
- Any auto-rewrite of requirement prose meaning or any body edit beyond the three mechanical style swaps - that crosses the no-body-mutate rail.
- Style enforcement on skill-docs, command docs or context-eng surfaces - this detector is `surface: 'spec-doc'` only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/.../detector-registry.ts` | Modify | Add the `hvr.style` detector entry (registry scaffold owned by 026) |
| `.opencode/skills/system-spec-kit/mcp_server/.../detectors/hvr-style.ts` | Create | The fence-aware prose parser plus the three swap rules and length-neutrality guard |
| `.opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts` | Create | Fixtures for each swap rule, fence and frontmatter exclusion and idempotency |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN the detector runs on a spec-doc, the system SHALL parse the document into prose ranges that exclude fenced code blocks, inline code spans and YAML frontmatter. | A fixture with an em-dash inside a code fence and inside frontmatter yields zero issues from those ranges, and an em-dash in body prose yields one issue. |
| REQ-002 | WHEN the `fix` runs in apply mode over a prose range, the system SHALL replace em-dashes, prose semicolons and Oxford commas per the three deterministic swap rules and SHALL leave all non-prose ranges byte-identical. | A round-trip over a mixed fixture mutates only the flagged prose offsets, and a byte-diff confirms fenced and frontmatter regions are unchanged. |
| REQ-003 | The `fix` SHALL be content-mutating but length-neutral in the sense that it never trims or budgets document content, and SHALL be idempotent under the `content_hash` guard. | Re-running `fix` over its own output produces a no-op (zero applied), and no swap rule deletes or truncates a sentence. |
| REQ-004 | The detector SHALL be registered with `fixClass: 'safe'` and SHALL execute its `fix` only when `'safe'` is present in `opts.allowFixClass`. | In report mode (`allowFixClass` empty), `detect` returns issues and the file is unchanged on disk. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The swap rules SHALL distinguish a prose semicolon from a semicolon inside an inline code span or an HTML entity and SHALL distinguish an Oxford comma from a comma in a code-like list. | Fixtures with `a. B` inside backticks and a list comma inside a fence yield zero issues. |
| REQ-006 | WHERE an em-dash or semicolon swap is ambiguous between a spaced-hyphen and a sentence split, the fixer SHALL apply the deterministic default documented in the detector and SHALL NOT change clause meaning. | The chosen default is documented inline and a fixture asserts the exact output for each ambiguous case. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A spec-doc containing em-dashes, prose semicolons and Oxford commas in body prose is auto-fixed to zero HVR-style issues with all code, inline-code and frontmatter regions byte-identical.
- **SC-002**: Re-running the fixer over already-clean prose applies zero changes (idempotent no-op), proving length-neutrality and the absence of any budget-trim behavior.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 026-shared-safe-fix-engine | The `detector-registry.ts`, `dq-engine.ts` and frozen `fixClass` allow-list must exist before this entry can register | Land the engine phase first. This phase adds exactly one registry entry plus its detector module |
| Risk | Mis-parsing a fence or inline-code boundary | A swap inside code corrupts an authored artifact, breaking the no-body-mutate intent | Parse prose ranges with the same fence-aware approach as the shipped wikilink validator. Fixtures gate every boundary case before `fixClass: 'safe'` is granted |
| Risk | An ambiguous em-dash or semicolon swap changes clause meaning | A length-neutral edit still alters intent, a soft body mutation | Apply only deterministic defaults, document each and assert exact output in fixtures. Keep the swap set frozen and small |
| Risk | Length drift from a swap (sentence split adds a period and capital) | A swap that changes length re-opens budget concerns and breaks idempotency | Treat the rule as length-neutral by intent, not byte-count. Enforce idempotency under `content_hash` so a second pass is a no-op |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A single-document detect plus fix completes well within the existing on-write quality-loop budget, since it is a linear prose scan with no embedding or DB work.

### Security
- **NFR-S01**: The detector reads and writes only the target spec-doc through the engine's atomic write path. It opens no network or DB connection and stays inside the existing local trust boundary.

### Reliability
- **NFR-R01**: The fix is idempotent and deterministic. Identical input always yields identical output, and a second pass applies zero changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a document with no prose ranges yields zero issues and zero applied fixes.
- Maximum length: a 10KB-plus spec is processed whole with no truncation, the explicit contrast with the destructive `runQualityLoop` 8000-char budget.
- Invalid format: a document with an unclosed code fence is treated conservatively (the unclosed region is excluded from mutation) so a parse ambiguity never causes a code-region edit.

### Error Scenarios
- A swap that would change length in a meaning-altering way: the deterministic default is applied and documented, never a heuristic guess.
- A re-run over already-fixed content: a no-op under the idempotency guard.
- A semicolon or comma inside an HTML comment or table cell: parsed as prose only when it is genuinely prose, otherwise excluded.

### State Transitions
- Report mode to apply mode: `detect` never writes. `fix` writes only when `'safe'` is in `allowFixClass`.
- Partial completion: atomic write means a failed mid-fix run leaves the original file intact.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One detector module plus one registry entry plus fixtures, single surface |
| Risk | 12/25 | Content-mutating on an authored body, fence-boundary correctness is the load-bearing safety property |
| Research | 4/20 | Seam confirmed at quality-loop.ts, fence-aware approach already shipped for the wikilink validator |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 11. RESEARCH VERDICT

| Field | Value |
|-------|-------|
| **Tier** | A (on-write, reuse-first, floor-bypassing, ship on cost) |
| **Verdict** | GO-on-cost |
| **fixClass** | `safe` (the one safe content-mutating fix in the frozen allow-list) |
| **Floor relation** | Floor-bypassing. It mutates the authored prose surface, it emits no vector rows, so it pays no re-index or prod@3 tax |
| **Grounding** | research.md section 2 Tier A row A6 (line 23), section 4 frozen fixClass allow-list (line 102: `hvr.style` length-neutral fence-aware swap), confirmed absent from `quality-loop.ts` |
| **Gate** | None. This is a validation-class adherence fix with zero prod-retrieval risk. It is NOT a Tier-C item and is NOT C2-gated |

The single invariant from the research safety model: a detector that touches an authored-doc body is normally never `safe`. A6 is the documented exception precisely because it is length-neutral and fence-aware, so its blast radius is bounded to mechanical prose-style swaps outside code and frontmatter.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the em-dash default be spaced-hyphen everywhere, or sentence-split when the dash joins two independent clauses? The detector must pick one deterministic rule and document it.
- Does the prose parser reuse the shipped wikilink validator's fence detector directly, or does the shared engine expose a single prose-range helper that all body-touching detectors share?
<!-- /ANCHOR:questions -->
