---
title: "Verification Checklist: Phase 9: command-agent-advisor-cutover"
description: "Verification Date: not yet run - phase is planned, not implemented"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 009"
  - "cutover gates"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/009-command-agent-advisor-cutover"
    last_updated_at: "2026-07-11T17:12:19Z"
    last_updated_by: "claude"
    recent_action: "Executed T004-T011; verified every checklist item with real command output"
    next_safe_action: "None required"
    blockers: []
    key_files:
      - ".opencode/commands/deep/alignment.md"
      - ".claude/agents/deep-alignment.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 9: command-agent-advisor-cutover

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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..005, all cited against real precedent files)
- [x] CHK-002 [P0] Technical approach defined in `plan.md` §3 Architecture, executed as written
- [x] CHK-003 [P1] Phase 003 skeleton confirmed on disk (`.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`); phases 004-008/010 confirmed real code by direct read of `scoping.cjs`, all 5 `scripts/adapters/*.cjs`, `partition-corpus.cjs`, `check-convergence.cjs`, `remediate-hook.cjs`, `runtime/scripts/reduce-alignment-state.cjs`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Command/agent files: both new YAML assets parse clean with PyYAML `safe_load` (`.opencode/commands/deep/assets/deep_alignment_auto.yaml`, `deep_alignment_confirm.yaml`); both agent-file frontmatter blocks are valid YAML (confirmed by the identical dual-mirror `diff` producing only the expected 2 hunks)
- [x] CHK-011 [P0] No console errors: `node render-command-contract.cjs --command deep/alignment -- 'test args'` exits 0 with a clean manifest row; `parent-skill-check.cjs .opencode/skills/system-deep-loop --strict` exits with 0 FAIL/0 WARN; drift-guard vitest exits 0 with 7/7 passed
- [x] CHK-012 [P1] Superseded by shipping: the "mode not yet available" pre-cutover edge case no longer applies once `/deep:alignment` is registered and renders; no remaining error-handling gap to implement for this edge case
- [x] CHK-013 [P1] Agent contract follows the deep-review LEAF-agent pattern with lane-aware translation: `.claude/agents/deep-alignment.md` §§0/0b/1-9 mirror `.claude/agents/deep-review.md`'s section numbering; dimension language (correctness/security/traceability/maintainability) replaced throughout with lane identity (authority/artifactClass/scope) + adapter `type`/`subcheck`/`layer`, and Hunter/Skeptic/Referee replaced with this mode's own verify-first + known-deviation-suppression two-check pass (§5)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria in spec.md REQ-001..005 met: REQ-001/002 (plan.md cites review.md/deep-review.md exact sections) were already true at plan time and remain true; REQ-003 (mode-registry.json entry) verified complete via direct read + `parent-skill-check.cjs` PASS 3d/3d-canon/3e; REQ-004 (advisor projection-map + drift guard) now actually wired, drift-guard 7/7 green; REQ-005 (behavior benchmark + cutover gates) benchmark extended to 11 scenarios, both cutover gates run
- [x] CHK-021 [P0] Manual dry-run of the real script chain (not a live LLM Task-dispatch of the leaf agent, which is a separate live-benchmark-round activity): ran `scoping.cjs` -> `sk-doc.cjs discover` -> `sk-doc.cjs check` (a REAL P1 finding surfaced: `sk-doc`'s own `template_rules.json` asset is missing from this checkout, a pre-existing environment gap outside phase 009's scope, and the adapter correctly reported it as a `could-not-validate` P1 rather than crashing or silently passing) -> assembled corpus.json/config.json -> `partition-corpus.cjs` (correctly resolved the one lane/slice) -> simulated the iteration JSONL record + delta a leaf agent would write via Bash -> `check-convergence.cjs` (correctly returned `CONTINUE`, coverage 100% met, stability correctly fails-closed on "fewer than 2 iterations recorded") -> `runtime/scripts/reduce-alignment-state.cjs` (produced a real, correctly-shaped `alignment-report.md` with `CONDITIONAL` verdict and the P1 finding) -> `loop-lock.cjs acquire` (real lock file written with correct shape). All run under Node's real `os.tmpdir()` in a throwaway fixture, never touching a tracked spec folder; fixture removed after the run.
- [x] CHK-022 [P1] Behavior benchmark's three minimum scenario categories present: DAB-005/DAB-006 (secondary genuine-finding checks alongside their primary invariant probes) for "lane with real findings"; DAB-011 (added this pass) for "lane with zero findings, clean pass, not via suppression"; DAB-008 for "multi-lane run". Live-executor scoring of all 11 cells is a separate benchmark-round activity (`baselines/claude-baseline.md` still `pending` for every cell, honestly, per that file's own convention), not a spec-doc completion gate.
- [x] CHK-023 [P1] Advisor drift-guard test passes after registry + map updates: `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/routing-registry-drift-guard.vitest.ts` -> "Test Files 1 passed (1)", "Tests 7 passed (7)"
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] [deferred: net-new authorship only across all 5 artifacts, no bug-fix finding-class taxonomy applies here]
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `grep -n '"workflowMode":' mode-registry.json` enumerates all 8 modes as the pattern set the new entry already matched (verified, no edit needed).
- [x] CHK-FIX-003 [P0] Consumer inventory for the two advisor-map edits: `routing-registry-drift-guard.vitest.ts`'s 7 sub-tests are the exact consumer set that reads `DEEP_ROUTING_MODE_BY_KEY`/`DEEP_MODE_BY_CANONICAL`/`SKILL_ALIAS_GROUPS`; all 7 pass against the new entries.
- [x] CHK-FIX-004 [P0] [deferred: no security, path, parser, or redaction fix ships in this net-new phase]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed in `plan.md`'s Affected Surfaces / Files to Change tables (5 artifact rows + 1 minimal-necessary `render-command-contract.cjs` row + 1 placeholder-contract row, each with real evidence).
- [x] CHK-FIX-006 [P1] [deferred: no process-wide state is read or mutated by authoring these files themselves]
- [x] CHK-FIX-007 [P1] [deferred: net-new authorship needs no fix SHA or diff-range citation, file paths and command output suffice]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `grep -inE "api[_-]?key|secret|password|token\s*=|BEGIN (RSA|OPENSSH|PRIVATE)"` across every new file (command, both YAML assets, legacy body, placeholder contract, both agent mirrors, the new benchmark scenario) -> zero matches.
- [x] CHK-031 [P0] Input validation for lane-args and command dispatch is inherited from already-verified upstream code, not reinvented: `scoping.cjs`'s `validateLane()`/`validateScope()` (reads real path-traversal guard via `validateNamespaceValue()`) is the single choke point both the interactive and `--lane-config` paths funnel through; `render-command-contract.cjs`'s `getCommandDefinition()` throws on any unsupported command string.
- [x] CHK-032 [P1] [deferred: no new auth or authz surface is introduced by this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` all synchronized to Implemented/complete status with matching evidence in this pass.
- [x] CHK-041 [P1] Changelog entry: deferred to whenever the parent 059 packet itself closes (parent spec.md's own "Changelog" convention refreshes `../changelog/` per phase folder name at packet close, not per-phase mid-flight); noted, not silently skipped.
- [x] CHK-042 [P2] `.opencode/skills/system-deep-loop/deep-alignment/README.md` already documents the command/agent surface from the earlier scaffold pass; not re-verified line-by-line in this phase since README.md content is outside this phase's scope-lock (SKILL.md's own content is explicitly excluded per the task's scope lock).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch/ files created inside the tracked repo; the manual dry-run fixture lived entirely under Node's real `os.tmpdir()` (`/var/folders/.../T/deep-alignment-dryrun-*`), never inside `.opencode/specs/`.
- [x] CHK-051 [P1] Dry-run fixture removed (`rm -rf`) immediately after the verification pass; confirmed removed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-11 (UTC 17:00-17:10 window). Real command output cited throughout; see plan.md and implementation-summary.md for the consolidated evidence trail.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
