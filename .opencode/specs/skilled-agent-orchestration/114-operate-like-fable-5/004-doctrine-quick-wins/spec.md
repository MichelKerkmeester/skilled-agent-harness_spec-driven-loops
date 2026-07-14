---
title: "Feature Specification: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline [template:level_2/spec.md]"
description: "Repair the dead AGENTS.md hook pointer and add a fail-loud pointer-resolution check, plant a ten-line efficiency doctrine spine in the byte-synced AGENTS.md/CLAUDE.md twins, and extend the handover template with a scar-tissue traps ledger and numbered cold-read order."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-doctrine-quick-wins"
    last_updated_at: "2026-06-15T14:06:36Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-doctrine-quick-wins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline

<!-- SPECKIT_LEVEL: 2 -->
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
| **Status** | Complete |
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`AGENTS.md:217` points readers at `references/hooks/skill-advisor-hook.md` (hyphens), but the real file is `skill_advisor_hook.md` (underscores), so the pointer resolves to nothing. This is not cosmetic: during the fable-5 efficiency research the `deepseek-v4-pro` lineage searched for the hyphenated name, found nothing, and concluded "OpenCode has no per-turn hook" — a false load-bearing conclusion that the `mimo` lineage (reading the real underscored file) refuted. Beyond that one dead link, the framework carries no automated guard that AGENTS.md `references/*.md` pointers resolve, no durable statement of the efficiency conviction the fable-5 work is steering toward, and a handover template that loses the non-derivable "scar tissue" (where a change blew up, what reanimates the trap, which guards are load-bearing) every time a cold successor takes over.

### Purpose
Land the three cheapest, lowest-blast doctrine wins from the fable-5 recommendation map (A1, A2, A3): the dead pointer resolves and a fail-loud check stops it (or any sibling pointer) from rotting again, the byte-synced AGENTS.md/CLAUDE.md twins carry a compact efficiency doctrine spine, and the handover template hands a cold successor an explicit scar-tissue ledger plus a numbered read order.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A1: Fix the dead hook pointer at `AGENTS.md:217` (`skill-advisor-hook.md` to `skill_advisor_hook.md`) and apply the byte-identical edit to its `CLAUDE.md` twin.
- A1: Create `.opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh`, which asserts that every `references/*.md` pointer cited in AGENTS.md resolves on disk and exits non-zero (fails loud) when one does not.
- A2: Add a ~10-line efficiency doctrine spine to §1 of both AGENTS.md and CLAUDE.md: the root conviction (spend lavishly where confirmation is cheapest to skip), the two-register voice, and letter-vs-intent.
- A3: Extend `.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` with a scar-tissue traps ledger (blast site, what reactivates the trap, load-bearing vs defensive) and a numbered cold-read order.

### Out of Scope
- The governor capsule on the live per-turn hook (B2) - separate mechanism phase; this phase ships only durable doctrine text, not the firing-hook reminder.
- Fail-loud executor provenance (B1) and the subagent prompt-injection channel (B3) - structural TypeScript packets scheduled on their own, not surgical doc drops.
- Editing `skill_advisor_hook.md` itself or any other framework runtime surface - the pointer fix only changes the AGENTS.md/CLAUDE.md citation string, not the target file.
- Wiring `check-doc-pointers.sh` into the pre-commit gate or `validate.sh` - this phase delivers the standalone check; gate wiring is a follow-on decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Line 217: rename pointer `skill-advisor-hook.md` to `skill_advisor_hook.md`; add the ~10-line efficiency doctrine spine to §1. |
| `CLAUDE.md` | Modify | Byte-identical twin edit: same pointer rename and same doctrine spine, preserving AGENTS.md ≡ CLAUDE.md. |
| `.opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh` | Create | Pointer-resolution check: extracts every `references/*.md` path cited in AGENTS.md and fails loud if any does not exist on disk. |
| `.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl` | Modify | Add a scar-tissue traps ledger section and a numbered cold-read order so a cold successor inherits non-derivable context. |
<!-- NOTE: the framework files above are TARGETS of the future implementation phase; this packet only authors the planning docs that describe them. -->


<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The dead hook pointer must resolve. | `grep -n skill_advisor_hook.md AGENTS.md` matches and the hyphenated form is gone; the cited file exists at `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md`. |
| REQ-002 | `check-doc-pointers.sh` must fail loud on a broken pointer and pass on the repaired tree. | Running it against a tree with a known-broken pointer exits non-zero and names the bad path on stderr; running it against the repaired tree exits 0. |
| REQ-003 | AGENTS.md ≡ CLAUDE.md stays byte-synced after both edits. | `diff -q AGENTS.md CLAUDE.md` reports no difference. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The §1 efficiency doctrine spine is present and concrete. | Both twins contain the root conviction, two-register voice, and letter-vs-intent lines in §1; no placeholder text remains. |
| REQ-005 | Both twins stay under the ~500-line budget. | `wc -l AGENTS.md CLAUDE.md` shows each at or below 500 lines after the spine is added (current 424 + ~10). |
| REQ-006 | The handover template carries the scar-tissue ledger and numbered cold-read order. | `handover.md.tmpl` contains a scar-tissue traps section (blast site / reactivation / load-bearing-vs-defensive) and an explicit numbered read order, with every HTML-comment anchor preserved. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dead pointer resolves and `check-doc-pointers.sh` exits 0 against the repaired tree while still exiting non-zero against a deliberately broken pointer.
- **SC-002**: AGENTS.md and CLAUDE.md remain byte-identical, each at or under ~500 lines, and both carry the efficiency doctrine spine and the handover template carries the scar-tissue ledger plus numbered cold-read order.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | None - this phase has no upstream phase dependency. | Can proceed independently of the mechanism (B*) and measurement (C*) phases. | Sequenced first in the land-first shortlist precisely because it is self-contained. |
| Risk | Twin drift: editing one of AGENTS.md / CLAUDE.md but not the other. | Med - breaks the byte-sync invariant the framework relies on. | Apply identical edits to both and gate on `diff -q AGENTS.md CLAUDE.md` before claiming done. |
| Risk | Doctrine spine pushes a twin past the ~500-line budget. | Low - current 424 lines leaves ~76 headroom for a ~10-line spine. | Keep the spine to ~10 lines and verify `wc -l` after the edit. |
| Risk | `check-doc-pointers.sh` over-matches and flags non-pointer text or under-matches and misses real pointers. | Med - a noisy check gets ignored; a blind check fails to catch rot. | Scope the matcher to `references/*.md` citations and prove both directions (broken fails, repaired passes). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `check-doc-pointers.sh` runs as a fast, dependency-free shell pass (grep + filesystem stat); it must complete in well under one second on AGENTS.md so it can sit in a pre-commit gate later.
- **NFR-P02**: The doctrine spine adds no runtime cost; it is read-surface text only, bounded to ~10 lines so AGENTS.md/CLAUDE.md stay at or under ~500 lines.

### Security
- **NFR-S01**: The pointer check only reads files and computes existence; it performs no writes, no network access, and no shell-expansion of matched paths.
- **NFR-S02**: No secrets, tokens, or environment-dependent data are introduced by any of the three changes.

### Reliability
- **NFR-R01**: The check is fail-loud by construction: a missing pointer target produces a non-zero exit and a named bad path, never a silent pass.
- **NFR-R02**: The byte-sync invariant (AGENTS.md ≡ CLAUDE.md) is verifiable deterministically with `diff -q` and is treated as a P0 acceptance gate.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No pointers present: AGENTS.md with zero `references/*.md` citations makes the check pass trivially (nothing to resolve), not fail.
- Pointer inside backticks or inline prose: the matcher must still extract the path (the live pointer at line 217 is wrapped in backticks).
- Relative vs repo-root path: pointers are written repo-root-relative; the check resolves them against the repository root, not the caller's CWD.

### Error Scenarios
- Broken pointer target: exit non-zero, print the missing path to stderr, list every offender rather than stopping at the first.
- AGENTS.md missing or unreadable: exit non-zero with a clear "input not found" message rather than passing vacuously.
- Twin drift detected: `diff -q AGENTS.md CLAUDE.md` reports a difference, blocking the completion claim until the twins match again.

### State Transitions
- Pointer renamed but twin not updated: caught by the byte-sync gate before the phase can be marked done.
- Future pointer added that does not resolve: the standing check turns the rot into an immediate loud failure rather than a latent dead link.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two doc twins, one new ~30-line shell check, one template edit; well under 100 net LOC of the change itself, but touches the most-read surfaces so Level 2 documentation discipline applies. |
| Risk | 10/25 | No breaking API change; main hazards are twin drift and a noisy/blind check, both deterministically gated. |
| Research | 4/20 | Fully specified by the fable-5 recommendation map (A1/A2/A3) and research §8; no open investigation. |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should `check-doc-pointers.sh` later be wired into the pre-commit gate and/or `validate.sh`, or stay a standalone tool invoked on demand? (Deferred to a follow-on; this phase ships the standalone check.)
- Should the pointer check eventually scan CLAUDE.md and the three agent-mirror dirs too, or is AGENTS.md the single source it asserts against given the byte-sync invariant? (Recommendation: assert AGENTS.md and rely on byte-sync for the twin.)
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
