---
title: "Implementation Plan: Phase 3: packet-125-126-refinements"
description: "Execution plan for the 5 WS-B advisory refinements to the 125-cli-external-parent and 126-mcp-tooling-parent planning packets: verify each finding against the live file, apply a targeted additive-prose edit, regenerate phase metadata, and keep both packets' recursive strict validation at 0/0."
trigger_phrases:
  - "packet 125 126 refinements plan"
  - "WS-B refinements plan"
  - "resolution-based move gate plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/003-packet-125-126-refinements"
    last_updated_at: "2026-07-10T05:15:00Z"
    last_updated_by: "claude"
    recent_action: "Executed as planned; both packets stayed 0/0 strict"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-003-packet-125-126-refinements"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: packet-125-126-refinements

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter (spec-kit phase docs) |
| **Framework** | system-spec-kit Level 1/2 templates (`spec.md`/`plan.md`/`tasks.md`) |
| **Storage** | Filesystem - spec docs under `.opencode/specs/skilled-agent-orchestration/{125-cli-external-parent,126-mcp-tooling-parent}/` |
| **Testing** | `validate.sh --recursive --strict` per packet + `generate-description.js`/`backfill-graph-metadata.js` for each edited phase folder |

### Overview
This phase applies 5 additive-prose refinements to already-validated planning packets, re-verifying each finding against the live file before editing, regenerating metadata for every touched phase folder, and re-confirming both packets stay `--recursive --strict` 0/0 with `Status: Planned` unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All 5 findings pre-specified with file:line targets in the fix manifest `phase3-packets.md`.
- [x] Source review report (`125-cli-external-parent/review/review-report.md` §3 WS-B) confirms/plausible-adjudicates all 5 findings.
- [x] Scope boundary is unambiguous: the two packets' spec-kit docs only, no ADR/decision-record edits, no `cli-opencode`/sk-prompt changes.

### Definition of Done
- [x] All 5 refinements applied and re-verified against live files.
- [x] Metadata regenerated for every edited phase folder.
- [x] `validate.sh --recursive --strict` passes 0/0 for both packets; this phase folder passes `--strict` 0/0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted documentation-hygiene refinement - no code, no runtime behavior change, no ADR/decision-record edits; additive prose in `spec.md`/`plan.md`/`tasks.md` only.

### Key Components
- **126 cutover phase (008)**: Deliverables/In-Scope/REQ table in `spec.md`, plus matching `plan.md`/`tasks.md` items, for the ClickUp-drift cutover-visibility gate (R1).
- **126 move phases (004, 005)**: `spec.md` REQ-002 acceptance criteria, `plan.md` Key Components/Phase 3/Testing Strategy, and `tasks.md` Phase 3, for the resolution-based move gate (R2).
- **126 advisor phase (006)**: `spec.md` Phase Context Scope Boundary sentence, for the ADR-005 carve-out cross-reference (R3).
- **125 scaffold phase (003)**: `spec.md` In Scope bullet + Files to Change row, for the explicit no-rebuild-before-006 invariant (R4).
- **125 parent map**: `spec.md` PHASE DOCUMENTATION MAP phase-1 row, for the explicit read-only marker (R5).

### Data Flow
N/A - these are static planning documents read by future execution agents; there is no runtime data flow to trace. The only "flow" is doc-order legibility: a reader of one phase's docs should not need to infer safety invariants that live only in a later phase's docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `126.../008-cutover-and-rollout/{spec,plan,tasks}.md` | Terminal-gate phase, no ClickUp-drift check | Update - add a cutover-visibility gate (Deliverables, In Scope, REQ-004, T007, Phase 2 bullets) | `grep -n "known-deferred ClickUp" spec.md plan.md tasks.md` shows matching entries in all three |
| `126.../{004-onboard-chrome-devtools,005-foldin-clickup-and-figma}/{spec,plan,tasks}.md` | Move gate greps for absent old paths only | Update - add a resolution-based link-resolve check | `grep -n "resolved from its containing file"` / `"Resolution-based move gate"` / `"Resolve every rewritten relative link"` all match in the respective `spec.md`/`plan.md`/`tasks.md` |
| `126.../006-advisor-and-integration/spec.md` | Scope Boundary line denies touching `mcp-code-mode` without naming its own exception | Update - cross-reference the ADR-005 carve-out in place | Line 72 contains "ADR-005 scoped carve-out" |
| `125.../003-scaffold-hub/spec.md` | Creates `graph-metadata.json` without stating the rebuild-timing invariant | Update - state the invariant explicitly | Lines 104 and 121 both contain "no advisor graph rebuild" |
| `125-cli-external-parent/spec.md` | Phase map row 1 says "(no writes)" only | Update - add an explicit "read-only" marker | Line 128 contains "Read-only research gate" |

Required inventories:
- Same-class producers: `grep -rn "known-deferred\|Resolution-based move gate\|ADR-005 scoped carve-out\|no advisor graph rebuild\|Read-only research gate" .opencode/specs/skilled-agent-orchestration/{125-cli-external-parent,126-mcp-tooling-parent}/` (all 5 refinements present, confirmed after editing).
- Consumers of changed symbols: N/A - these are prose clarifications inside planning docs, not code symbols; no script or template parses this specific wording.
- Matrix axes: one axis per finding (R1-R5), independently fixable and independently verifiable; R2 spans two phase folders (004, 005) but is otherwise the same fix pattern applied twice.
- Algorithm invariant: N/A - no parser/resolver/security code touched. The one substantive invariant STATED (not created) by this phase is R4's "no advisor graph rebuild happens before phase 006," which was already true of the underlying plan and is now legible from phase 003 alone.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the fix manifest `phase3-packets.md` and the review report's §3 WS-B table.
- [x] Confirmed all 5 findings via `Read`/`grep` against live files before editing (not the manifest's approximate line numbers alone).

### Phase 2: Core Implementation
- [x] R1: Added the ClickUp-drift cutover-visibility gate to `126.../008-cutover-and-rollout` (`spec.md` Deliverables/In-Scope/REQ-004, `tasks.md` T007 + renumbered T008-T010, `plan.md` Key Components/Phase 2).
- [x] R2: Added the resolution-based move gate to `126.../004-onboard-chrome-devtools` (`spec.md` REQ-002, `plan.md` Key Components/Phase 3/Testing Strategy, `tasks.md` T010) and `126.../005-foldin-clickup-and-figma` (same pattern, `tasks.md` T011).
- [x] R3: Cross-referenced the ADR-005 carve-out at `126.../006-advisor-and-integration/spec.md`'s Scope Boundary line.
- [x] R4: Stated the no-rebuild-before-006 invariant explicitly at `125.../003-scaffold-hub/spec.md`'s In Scope bullet and Files to Change row.
- [x] R5: Marked phase 001 explicitly read-only in `125-cli-external-parent/spec.md`'s phase map.

### Phase 3: Verification
- [x] Synced `_memory.continuity.last_updated_at` and wrote a compact `recent_action` on every edited 125/126 doc.
- [x] Regenerated `description.json` (`generate-description.js`) and `graph-metadata.json` (`backfill-graph-metadata.js`) for all 5 edited phase folders plus the 125 parent root - all 6 runs reported `"failed": []`.
- [x] Ran `validate.sh --recursive --strict` on both packets - both 0 errors / 0 warnings across parent + all 8 phase children each.
- [x] Authored this Level 1 spec-kit packet and ran `validate.sh --strict` against it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All 5 refinements against live file state, post-edit | `grep -n` per finding's distinctive phrase |
| Recursive strict validation | Both target packets (parent + all 8 phase children each) | `validate.sh --recursive --strict` |
| Metadata regeneration | Every edited phase folder + the 125 parent root | `generate-description.js`, `backfill-graph-metadata.js` |
| Spec validation | This phase folder's own frontmatter + task evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Fix manifest (`phase3-packets.md`) | Internal (scratchpad input) | Green | N/A - manifest fully specified every fix; no blocking ambiguity encountered. |
| `generate-description.js` / `backfill-graph-metadata.js` | Internal (system-spec-kit scripts) | Green | Both ran clean for all 6 folders; no failure would have blocked the doc edits themselves, only the metadata freshness. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A refinement found to alter unintended content (e.g., accidentally touching a decision-record.md or flipping a Status field), or `validate.sh --recursive --strict` regresses on either packet after editing.
- **Procedure**: No commit was made this session; every touched file is untracked (`git status --porcelain` shows `??` for both packet folders), so `git diff` is not applicable. A single edit can be undone by re-reading the file and reverting the specific inserted clause via `Edit`; the exact old/new text for each of the 13 edits is enumerated in this phase's `tasks.md`.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
