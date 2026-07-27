---
title: "Verification Checklist: Pi docs, agents, governance, and closeout"
description: "Verification Date: TBD -- verify against the live tree at implementation time"
trigger_phrases:
  - "cli-pi closeout checklist"
  - "pi governance checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/011-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-27T05:34:01Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md: restoration completeness, devin-backfill, regression guards"
    next_safe_action: "Wait for phases 001-010, then verify against the live tree and mark items with evidence"
    blockers: ["Phases 001-010 must land before most items below have anything to verify against."]
    key_files: [".opencode/skills/cli-external-orchestration/README.md", "README.md", ".opencode/skills/README.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi docs, agents, governance, and closeout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Phases 001-010 confirmed landed before this phase's doc additions begin.
  - **Evidence**: TBD -- review each phase's `implementation-summary.md` at implementation time.
- [ ] CHK-002 [P0] Current-tree touch points and their symmetry tiers (5-of-5 / 4-of-5 / 2-of-5) reconfirmed via `rg`, not this planning pass's snapshot alone.
  - **Evidence**: TBD -- re-run `rg -l 'cli-opencode|cli-claude-code|cli-codex|cli-cursor|cli-devin'` from `spec.md`'s answered_questions immediately before editing.
- [ ] CHK-003 [P0] The devin-backfill decision (spec.md Open Question) is recorded explicitly before any edit to a 4-of-5 or 2-of-5 tier surface.
  - **Evidence**: TBD -- cite the decision and rationale as recorded in `tasks.md` T004.
- [ ] CHK-004 [P1] `dispatch-model.cjs`'s `KNOWN_EXECUTORS` cross-checked against phase 002/009 to determine whether `deep-improvement.md` may claim pi as benchmarkable.
  - **Evidence**: TBD -- cite the live state of `KNOWN_EXECUTORS` and the phase 002/009 evidence reviewed.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every identified surface (hub `README.md`, root `README.md` CROSS-AI section + catalog table, `.opencode/skills/README.md`) gains a `cli-pi` entry consistent with T004's recorded devin-backfill decision -- no surface silently left half-updated.
  - **Evidence**: TBD -- `rg -n "cli-pi"` per file, cross-referenced against the T004 decision.
- [ ] CHK-011 [P0] The conditional `deep-improvement.md` Lane-B edit (if made) is backed by a live `dispatch-model.cjs` confirmation, not an assumption carried over from the master plan's "6th member" framing.
  - **Evidence**: TBD -- cite the `KNOWN_EXECUTORS` state and phase 002/009 evidence reviewed (T003).
- [ ] CHK-012 [P1] Each added `cli-pi` mention matches its siblings' exact phrasing/format in that surface (bold name, "Use it for", dispatch mechanism, availability-gating note).
  - **Evidence**: TBD -- diff the new entry against the confirmed live `cli-cursor`/`cli-devin` entry shape in the same file.
- [ ] CHK-013 [P1] No surface is left claiming a sibling-count number ("N workflow modes", "N of 5") that doesn't match what T004's decision actually produced on that specific surface.
  - **Evidence**: TBD -- per-surface count verification, not a single repo-wide assumed number.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `bash validate.sh .opencode/specs/cli-external-orchestration/031-cli-pi-creation --recursive --strict` returns `Errors: 0` across the phase-parent and all 11 phase children.
  - **Evidence**: TBD -- full command output recorded in `implementation-summary.md`.
- [ ] CHK-021 [P0] `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` reports all hard invariants passed, 0 warnings.
  - **Evidence**: TBD -- command output.
- [ ] CHK-022 [P1] `executor-config.vitest.ts` and `executor-audit.vitest.ts` reviewed and confirmed to NOT assert a stale executor union that excludes `cli-pi`.
  - **Evidence**: TBD -- cite the specific test names/assertions reviewed and the confirming outcome.
- [ ] CHK-023 [P1] Grep sweep confirms `cli-pi` present exactly where T004's recorded decision says it should be, and deliberately absent where it was not extended.
  - **Evidence**: TBD -- `rg -n "cli-pi"` output across every edited file, cross-referenced against the decision.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Addition finding class recorded as `cross-consumer` (hub README, root README x2 locations, skills-catalog README, and the conditional agent-roster surface are independent consumers of the same "cli-pi exists" fact).
  - **Evidence**: TBD -- confirmed by the 6-surface consumer inventory in `plan.md`'s Affected Surfaces table.
- [ ] CHK-FIX-002 [P0] Same-class consumer inventory completed: hub `README.md`, root `README.md` (2 locations), `.opencode/skills/README.md`, `deep-improvement.md` (+ mirror, conditional).
  - **Evidence**: TBD -- the matrix in `plan.md`'s Affected Surfaces section, each row checked off in `tasks.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory confirms no other live doc/code surface still under-reports `cli-pi`'s existence that this phase must also flip.
  - **Evidence**: TBD -- a broader `rg -n "cli-cursor|cli-devin"` review (excluding `.opencode/specs/**` historical content) for any missed live consumer beyond this phase's Files-to-Change table.
- [ ] CHK-FIX-004 [P2] N/A -- no security/path/parser/redaction code changes in this docs-only phase.
  - **Evidence**: N/A by scope; confirmed no code files appear in this phase's Files to Change table.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed: {surface tier} x {devin-backfill decision} across the 4-6 identified surfaces.
  - **Evidence**: TBD -- confirmed against `plan.md`'s Affected Surfaces required-inventories section.
- [ ] CHK-FIX-006 [P2] N/A -- no process-wide or global runtime state is read by this phase's changes.
  - **Evidence**: N/A by scope; this phase edits static docs/rosters only.
- [ ] CHK-FIX-007 [P1] Evidence pinned to the commit SHA created at this phase's completion, not a moving branch-relative range.
  - **Evidence**: TBD -- record the exact commit SHA in `implementation-summary.md` once this phase is executed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets, tokens, or credentials introduced in any edited doc or agent file.
  - **Evidence**: TBD -- `grep -riE "sk-ant|sk-proj|PI_(API_KEY|AUTH_TOKEN)\s*="` against every file this phase edits.
- [ ] CHK-031 [P1] No prescriptive default executor reintroduced into `post-implementation-deep-review.md`.
  - **Evidence**: TBD -- `git diff` on that file is empty (see CHK-040).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `ADVISOR_RUNTIME_VALUES` (`advisor-runtime-values.ts`) and `runtime-parity.vitest.ts` confirmed untouched.
  - **Evidence**: TBD -- `git diff -- .opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/runtime-parity.vitest.ts` is empty.
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md` all describe the identical addition scope and the identical devin-backfill decision, with no drift between the 4 documents.
  - **Evidence**: TBD -- cross-read confirms no drift between the 4 documents' Scope / Open Question / decision language.
- [ ] CHK-042 [P2] No fabricated pi changelog/version-history narrative introduced.
  - **Evidence**: TBD -- `grep -in "changelog|version history"` across every edited file returns no fabricated pi-specific narrative.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No temp files left outside `scratch/`.
  - **Evidence**: TBD -- final `git status --short` review at implementation time.
- [ ] CHK-051 [P1] `scratch/` (if used) cleaned before completion claim.
  - **Evidence**: TBD -- confirm no leftover scratch artifacts in the final diff.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 11 | 0/11 |
| P2 Items | 3 | 0/3 |

**Verification Date**: TBD -- verify against the live tree at implementation time
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/checklist.md`, `../../030-cli-cursor-creation/007-docs-agents-governance-and-closeout/checklist.md` (sibling closeout precedents)
