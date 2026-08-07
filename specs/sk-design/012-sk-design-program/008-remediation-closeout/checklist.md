---
title: "Checklist: sk-design remediation closeout"
description: "Verification checklist for the five planned items. All items unchecked pending execution."
trigger_phrases:
  - "sk-design remediation closeout checklist"
  - "styles sha256 verification checklist"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/008-remediation-closeout"
    last_updated_at: "2026-07-27T09:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Verified Phases 1-4 against real evidence; Phase 5 items remain pending operator approval"
    next_safe_action: "Await operator go/no-go on Phase 5; separately triage pre-existing vitest lock-retry failure"
    blockers:
      - "Phase 5 requires an explicit operator go/no-go before any file is restored"
    key_files:
      - ".opencode/specs/sk-design/012-sk-design-program/006-design-mode-consolidation/scratch/styles.sha256.before"
      - ".opencode/skills/system-spec-kit/mcp-server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-008-remediation-closeout-session"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Restore the eleven AI-tell fixture pairs, ai-fingerprint-registry.json, and the two parity scripts (not the rubric)? Recommendation on record: yes. Awaiting operator go/no-go."
    answered_questions: []
---
# Checklist: sk-design remediation closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Each of the five items traced to its origin
  - **Evidence**: `spec.md` §2, §Related Documents — four items trace to `007-consolidation-remediation/checklist.md` CHK-028/CHK-029/CHK-043; Item 4 surfaced during this packet's own authoring
- [x] CHK-002 [P0] Root cause isolated for Item 3 and Item 4 before planning the fix, not left as "investigate later"
  - **Evidence**: Confirmed against the live tree at execution and fixed — Item 3 (`spec-doc-structure.ts:982`, `parsed.anchors.some(...)` false on zero anchors), Item 4 (`folder-discovery.ts:238-249`, `pickIncomingAuthoredOptionalFields` omitted `level`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Item 4's fix is a single-line addition to an existing picker function, matching its existing pattern — no new mechanism introduced
  - **Evidence**: `folder-discovery.ts:247` — `if (desc.level !== undefined) authored.level = desc.level;`, matching the existing four-line pattern
- [x] CHK-011 [P1] No item adds a mode, command, schema, alias, adapter, or template
  - **Evidence**: Confirmed — Item 1 a checksum read, Item 2 an edit to `design-mode-pairing-before-run.md` (no benchmark run needed), Item 3 a fallback scan in `spec-doc-structure.ts:982`, Item 4 a one-line addition in `folder-discovery.ts:247`, Item 5 not executed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] Item 1 styles SHA-256 equality check run
  - **Evidence**: Run against all 7,812 files vs. `006/scratch/styles.sha256.before` — 7,811 identical, 1 delta (`styles/README.md`, a known-deliberate 007 edit)
- [x] CHK-021 [P2] Item 2 benchmark re-run against the current topology
  - **Evidence**: Not executed — premise corrected: no live route-gold exists to regenerate. Full-playbook audit run instead; `TV-001`/`SR-002` confirmed correct, one residual fixed (`design-mode-pairing-before-run.md`)
- [x] CHK-022 [P1] Item 3 `006 --strict` reaches Warnings 0
  - **Evidence**: Re-run 2026-07-27 — Errors 0, Warnings 0 (was Errors 0, Warnings 1 `SPEC_DOC_SUFFICIENCY` before the fix)
- [x] CHK-023 [P1] Item 4 `--level` persistence verified on a real folder, workspace suite green
  - **Evidence**: Strip/regenerate test on a real folder confirms persistence. Workspace suite re-run: no new failures from this change; carries one pre-existing, unrelated failure (`handler-memory-save.vitest.ts` lock-retry test, confirmed identical with/without the fix)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P2] Item 1 — styles SHA-256 equality confirmed or a mismatch escalated
  - **Evidence**: 7,811/7,812 identical; the single delta traced to a known-deliberate prior edit, not escalated as drift
- [x] CHK-FIX-002 [P2] Item 2 — benchmark regenerated, all historical records byte-unchanged
  - **Evidence**: No regeneration needed (no live gold to regenerate against); historical `sk-design/benchmark/{baseline,after-*,compiled-routing}/**` confirmed untouched
- [x] CHK-FIX-003 [P1] Item 3 — 006 validation warning cleared without rewriting research content
  - **Evidence**: `spec-doc-structure.ts:981-989` fallback-scan fix; `research.md` content unchanged; `006 --strict` Warnings 0
- [x] CHK-FIX-004 [P1] Item 4 — `--level` flag fixed, verified, and its repo-wide blast radius flagged
  - **Evidence**: `folder-discovery.ts:247` one-line fix; strip/regenerate proof; blast radius flagged in `spec.md` §3 Files to Change and `implementation-summary.md`
- [ ] CHK-FIX-005 [P2] Item 5 — fixture-restoration decision recorded; executed only on operator approval
  - **Evidence**: Still pending — open question stands in `spec.md` §7, awaiting operator go/no-go
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Item 4's fix does not widen any write boundary — it only forwards an already-parsed value through an existing, already-validated schema field
  - **Evidence**: `description-schema.ts:25-31,68` already declared `level` as a known authored optional field; the fix only forwards it, adds no new field
- [ ] CHK-031 [P2] Item 5's restored fixtures and parity scripts introduce no secrets or write-path changes — they are static HTML test fixtures and read-only comparison scripts
  - **Evidence**: Not applicable — Item 5 not executed, pending operator approval
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized, all marked In Progress (Phases 1-4 complete, Phase 5 Planned)
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` all updated 2026-07-27 with matching status
- [x] CHK-041 [P1] `implementation-summary.md` records status honestly — 4/5 phases complete with evidence, Phase 5 explicitly still Planned, no premature completion claim on Item 5
  - **Evidence**: `implementation-summary.md` §Metadata, §Verification
- [x] CHK-042 [P2] Open Question (Item 5) recorded and awaiting operator response
  - **Evidence**: `spec.md` §7 — unchanged, still open
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only files named in `spec.md`'s Files to Change table are in scope for eventual execution
  - **Evidence**: `spec.md` §3 — Phases 1-4 touched exactly the named files (styles read-only, `design-mode-pairing-before-run.md`, `spec-doc-structure.ts`, `folder-discovery.ts`); Phase 5 not executed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 3 | 3/3 |
| P1 Items | 10 | 10/10 |
| P2 Items | 6 | 4/6 (CHK-FIX-005, CHK-031 not applicable — Phase 5 not executed) |

**Verification Date**: 2026-07-27
**Verified By**: Executing agent (Phases 1-4); Phase 5 remains unverified and unexecuted, pending operator approval
<!-- /ANCHOR:summary -->
