---
title: "Implementation Plan: Remove Routing-Neutral Dead Fields"
description: "Grep-verify then delete three classes of orphan skill-metadata fields, reconcile two duplicate-authority fields, and add one doc note — each step gated by the fleet metadata gate, the Python compiler validator, and the advisor drift-guard vitest suite."
trigger_phrases:
  - "dead field deletes implementation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/007-dead-field-deletes"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "causal_summary disposition gated on phase 003's canonical-derived-owner decision"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-dead-field-deletes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Remove Routing-Neutral Dead Fields

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Delete every field confirmed orphan by the 029 research and this packet's own re-verification, reconcile the two duplicate-authority fields the research found, and add one contract doc note — all data/doc edits, no schema code or scoring logic touched. Each deletion is preceded by a fresh repo-wide grep (not a re-use of the research's stale evidence) and followed by the fleet metadata gate, the Python compiler validator, and the relevant vitest suite, so a regression is caught before it is claimed fixed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Zero-reader proof | Every field deleted has a repo-wide grep (re-run at implementation time, not just cited from research) showing zero non-JSON code readers before its deletion is committed |
| Fleet metadata gate | `node ci-skill-root-metadata.cjs` exit 0 across every touched hub after each deletion batch |
| Per-hub doctor check | `node parent-skill-check.cjs <hub>` clean for `sk-code` and `sk-doc` (the two hubs with the most edits) |
| Python compiler validation | `python3 skill_graph_compiler.py` (validate mode) exit 0 fleet-wide, proving `derived` block edits do not trip required-field checks |
| Drift-guard suite | `npx vitest run routing-registry-drift-guard.vitest.ts` green, covering both the `tieBreak` reconciliation and whichever `advisorRouting.packetSkillName` branch is chosen |
| Scope discipline | `git diff --stat` at completion touches only files named in `spec.md` §3 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No new components. This phase edits static JSON config (`description.json`, `graph-metadata.json`, `hub-router.json`, `mode-registry.json`) and one reference doc (`skill-root-metadata-contract.md`) across the seven skill-hub roots that carry the affected fields, plus (conditionally, per REQ-006) the drift-guard vitest fixture and the `init_skill.py` scaffold literal so newly scaffolded hubs stop reproducing the deleted duplicate. No compiler (`registry-compiler.cjs`), scorer (`scorer/lanes/*.ts`), or Python validator (`skill_graph_compiler.py`) logic is modified except the one annotating comment REQ-004 may add if the Python schema stays canonical. The blast radius is data-only: every consumer that reads these files (the fleet gate, the compiler, the scorer, the doctor checks) already treats missing optional keys as absent, so deletion is the low-risk direction — the opposite direction (adding a reader) is explicitly out of scope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Re-run every repo-wide grep this spec's evidence rests on (`trigger_examples`, `supported_surfaces`, `opencode_languages`, `peer_resource_categories`, `causal_summary`, `packetSkillName`, `tieBreak`) against the current tree, not the research snapshot, and diff the result against the citations in `spec.md` §4. Capture the `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs sk-code`, `parent-skill-check.cjs sk-doc`, `skill_graph_compiler.py`, and `routing-registry-drift-guard.vitest.ts` outputs as the pre-change baseline. Read phase 003's `implementation-summary.md` (or its equivalent decision artifact) to resolve REQ-004's branch before touching any `causal_summary` field.

### Phase 2: Field removal & reconciliation

Delete `description.json` `trigger_examples` (7 hubs, REQ-001) and `supported_surfaces`/`opencode_languages` (`sk-code`, `sk-doc`, REQ-002). Delete `sk-code/graph-metadata.json` `derived.supported_surfaces`/`derived.peer_resource_categories` (REQ-003). Execute the REQ-004 `causal_summary` branch chosen from phase 003's decision. Reorder `sk-doc/hub-router.json`'s `routerPolicy.tieBreak` to match `scoreTieBreakOrder()`'s derived order and add the exception comment (REQ-005). Resolve `advisorRouting.packetSkillName` per the chosen branch, updating `mode-registry.json` fleet-wide and, if deleting, the drift-guard vitest assertion plus the `init_skill.py` scaffold literal so it is not reintroduced (REQ-006). Add the script-name-collision note to `skill-root-metadata-contract.md` (REQ-007).

### Phase 3: Verification

Re-run every quality gate in §2 and compare against the phase-1 baseline: the fleet gate, both doctor checks, the Python compiler validator, and the drift-guard vitest suite must all still pass (or newly pass, where the reconciliation fixed a latent inconsistency). Run `git diff --stat` and confirm it lists only the files named in `spec.md` §3. Update this phase's `implementation-summary.md` and `checklist.md` with the evidence gathered.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | Zero-reader proof for every deleted field, re-run at implementation time | `rg -n '"<field>"' --type ts --type js --type py -g '!**/specs/**' -g '!**/node_modules/**'` against `.opencode/` |
| Structural gate | Fleet-wide skill-root metadata class contract | `node .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` |
| Per-hub doctor | Parent-hub canon conformance for the two most-edited hubs | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-code` and `.../sk-doc` |
| Schema validation | `derived` block still satisfies the Python compiler's required-field checks | `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py` (validate mode, fleet-wide) |
| Regression suite | `tieBreak`/`packetSkillName` drift-guard assertions | `npx vitest run .opencode/skills/system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts` |
| Routing-accuracy spot check | No accuracy regression from the derived-block edits (per research §4's baseline-sensitivity warning, no single global percentage is quoted — compare only the pinned pre/post run against the same corpus hash) | `mcp-server/scripts/routing-accuracy/` corpus run, before and after, same hash |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 canonical-derived-owner decision | Internal (predecessor phase) | Pending — this phase is authored ahead of it | REQ-004 alone defers; REQ-001/002/003/005/006/007 proceed independently, since none of them touch `causal_summary` |
| `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs`, `skill_graph_compiler.py`, `routing-registry-drift-guard.vitest.ts` | Internal (existing tooling) | Green today (fleet is 11/11 per the 124 packet) | If any is already red before this phase starts, that is a pre-existing issue outside this scope — captured as the phase-1 baseline, not attributed to this change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any quality gate in §2 goes red after a deletion batch and the cause traces to this phase's edit, not a pre-existing issue.
- **Procedure**: Every edit in this phase is a data/doc change (JSON field removal, one array reorder, one doc note) with no code-path change except the single optional REQ-004 comment — `git checkout -- <file>` per touched file, or `git revert` the phase's commit(s) wholesale, fully restores prior behavior with no migration or backfill needed. Because deletions only remove keys nothing reads, a revert is always a strict no-op from every consumer's point of view; there is no forward-only state to unwind.
- **Data reversal**: No data migrations. No database, cache, or generated-artifact state depends on the deleted fields (confirmed by the same zero-reader grep this phase's requirements rest on), so reverting the JSON/doc files is sufficient on its own.
<!-- /ANCHOR:rollback -->
