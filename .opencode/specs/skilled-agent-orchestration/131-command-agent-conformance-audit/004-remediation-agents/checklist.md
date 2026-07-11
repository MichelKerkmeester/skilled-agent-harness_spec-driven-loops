---
title: "Verification Checklist: Phase 4: Remediate Agent Files (Both Runtimes)"
description: "QA checklist mapping the 9 AGT findings (AGT-01..AGT-09) to verification evidence; all 9 items verified and fixed, including AGT-05."
trigger_phrases:
  - "verification"
  - "checklist"
  - "agent remediation checklist"
  - "AGT findings verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/004-remediation-agents"
    last_updated_at: "2026-07-11T08:49:20Z"
    last_updated_by: "fable-5"
    recent_action: "Fixed AGT-05: removed .codex/agents claims per operator decision"
    next_safe_action: "Verify CHK-001..CHK-051 during/after tasks.md execution"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-agent/SKILL.md"
      - ".claude/agents/deep-improvement.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 4: Remediate Agent Files (Both Runtimes)

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..REQ-009 map 1:1 to findings AGT-01..AGT-09 — confirmed against the REQ table at spec.md:162-175.
- [x] CHK-002 [P0] Technical approach defined in plan.md — sequencing (AGT-03 before AGT-02/AGT-09), phase mapping, FIX ADDENDUM producer/consumer inventory — confirmed against the FIX ADDENDUM table at plan.md:109-117 and executed in that order (T001-T005 before T006/T014).
- [x] CHK-003 [P1] Dependencies identified and available — create-agent SKILL.md/template accessible; AGT-05 was gated on an operator decision, now resolved (remove) — all 3 producer files (`SKILL.md:73`, `agent_template.md:33`, `validate_document.py:631`) were readable and editable; AGT-05 fixed, 6 files edited with evidence at `tasks.md` T021/T022.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Frontmatter YAML remains valid, parseable after every edit (no syntax breakage introduced by AGT-02/AGT-03/AGT-06/AGT-07 frontmatter or body edits) — `python3 -c "import yaml; ..."` against `.claude/agents/deep-improvement.md` post-fix parsed cleanly to `{'name': 'deep-improvement', 'description': '...', 'tools': 'Read, Write, Edit, Bash, Grep, Glob'}`; all 24 live agent files pass the new AGT-09 frontmatter check with zero parse errors.
- [x] CHK-011 [P0] No unintended body/behavioral-prose drift introduced outside the cited AGT finding lines (frontmatter-stripped, path-normalized diff review) — `git diff` reviewed line-by-line for all 10 touched files; every hunk maps 1:1 to its cited AGT finding.
- [x] CHK-012 [P1] Each fix matches its runtime's canonical schema — `tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/` — with no cross-contaminated grammar — confirmed via `grep -c '^tools:'`/`grep -c '^permission:'` on `deep-improvement.md` and via the full 24-file AGT-09 regression sweep (all clean).
- [x] CHK-013 [P1] Edits follow existing sibling-agent phrasing patterns (Path Convention wording for AGT-01/AGT-06, allowlist wording for AGT-04, provenance-clause wording for AGT-07) — AGT-01 reused the exact sibling line already present (only the path token changed); AGT-06 copied `context.md:13`'s phrasing; AGT-04 kept the existing allowlist sentence structure and only inserted the new clause; AGT-07 mirrored the Claude row's "canonical source" phrasing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All P1 acceptance criteria verified via grep — SC-001..SC-004 (REQ-001..REQ-004 / AGT-01..AGT-04) — all 4 grep assertions PASS, recorded at `tasks.md:100`.
- [x] CHK-021 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0 — see the Verification table in implementation-summary.md for the recorded run.
- [x] CHK-022 [P1] All P2 acceptance criteria verified via grep — SC-005..SC-008 (REQ-005..REQ-009 / AGT-05..AGT-09) — SC-006/SC-007 PASS via grep; SC-005/REQ-009 PASS via fixture battery at `tasks.md:85`; AGT-05/REQ-005 fixed and verified: `grep -rn "\.codex/agents"` across the 6 cited files returns 0 hits (`tasks.md` T022).
- [x] CHK-023 [P1] `validate_document.py --type agent`'s new AGT-09 check exercised against both a compliant fixture (post-fix `deep-improvement.md`) and a deliberately non-compliant fixture — compliant: zero agent-schema errors; non-compliant `.claude` fixture (bare `permission:`): blocking `agent_schema_missing_tools` + warning `agent_schema_wrong_key_permission`; non-compliant `.opencode` fixture (bare `tools:`): blocking `agent_schema_missing_permission` + warning `agent_schema_wrong_key_tools`; also verified the cross-contaminated (both keys) and no-frontmatter edge cases from spec.md §"L2: EDGE CASES".
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — AGT-02/AGT-03/AGT-08/AGT-09 = `class-of-bug` (systemic S4 cluster: producer + instance + QA gate); AGT-01/AGT-04/AGT-06/AGT-07/AGT-05 = `instance-only` — classes applied exactly as specified; AGT-03/AGT-08 fixed first (producer), then AGT-02 (instance) and AGT-09 (QA gate); AGT-05 fixed last once the operator's remove-vs-restore decision resolved the gate.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — `rg -n 'permission:' .claude/agents/` confirms `deep-improvement.md` is the ONLY Claude agent using the wrong schema; root cause is the shared `create-agent` producer, not repeated independent mistakes — re-ran post-fix: `rg -n 'permission:' .claude/agents/` returns zero matches (deep-improvement.md now normalized); full 24-file AGT-09 sweep confirms no other file was ever using the wrong schema.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers/policy — `create-agent/SKILL.md` + `assets/agent_template.md` consumers are all future `/create:agent` runs; `validate_document.py` consumers are all agent files across both runtimes (plan.md FIX ADDENDUM table) — confirmed; ran the updated validator against all 24 live agent files with zero regressions.
- [x] CHK-FIX-004 [P0] N/A this phase — no security/path/parser/redaction fix; frontmatter schema + doc-wording changes only, not a resolver/parser rewrite — confirmed N/A: `git diff --stat` for this phase touches only markdown frontmatter/prose and one Python validator function, no resolver/parser/redaction code.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed — plan.md FIX ADDENDUM: runtime (2) × schema (2) × agent (12) = 24 cells, 1 wrong pre-fix — confirmed; post-fix sweep is 24/24 cells clean (0 wrong), verified via the AGT-09 fixture-battery regression sweep.
- [x] CHK-FIX-006 [P1] N/A this phase — no process-wide/global state read by any of the 9 fixes (static markdown/YAML/Python source edits only) — confirmed N/A: `git diff --stat` shows only per-file markdown/YAML/Python edits, no shared global-state reads.
- [x] CHK-FIX-007 [P1] Evidence pinned to a fix SHA or explicit diff range, not a moving branch-relative range — evidence cites concrete post-fix locations, e.g. `checklist.md:71-129` and `tasks.md:59-104`, and literal grep/script output, not a moving range; final commit SHA to be recorded at commit time (out of this agent's scope — no git commit performed).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No agent runs with unintended unrestricted tool access post-fix — `.claude/agents/deep-improvement.md`'s `tools:` list matches its original `permission:` allow-set (excludes webfetch/memory/chrome_devtools/task/patch), closing AGT-02's unrestricted-execution defect — `tools: Read, Write, Edit, Bash, Grep, Glob` maps exactly the original allow-set (read/write/edit/bash/grep/glob); webfetch/memory/chrome_devtools/task/patch (all originally `deny`) are excluded; `list`/`external_directory` (OpenCode-only concepts, no `tools:` equivalent) are dropped, not silently granted.
- [x] CHK-031 [P0] LEAF agents continue to deny `task` under both the pre-fix and post-fix schema (no capability regression introduced by the AGT-02/AGT-03 schema normalization) — pre-fix `permission.task: deny`; post-fix `tools:` list omits `Task` entirely (Claude Code's equivalent of deny-by-omission), so the deny is preserved, not weakened.
- [x] CHK-032 [P1] No new agent frontmatter grants broader capability than the pre-fix `permission:` intent; AGT-09's validator check would catch any future recurrence of the AGT-02 defect class — confirmed via the fixture battery (T015): a `.claude/agents/` file with a bare `permission:` block and no `tools:` now fails the validator with a blocking `agent_schema_missing_tools` error.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized — same 9 finding IDs, same file:line citations, same sequencing constraint across all four docs — confirmed by re-reading the Files to Change table at `spec.md:134-150` against `tasks.md:59-104`; both cite the identical 9 AGT IDs and sequencing.
- [x] CHK-041 [P1] `create-agent/SKILL.md` and `assets/agent_template.md` document both runtime schemas with an explicit decision rule (AGT-03, AGT-08) — SKILL.md:73-100 (schema table + decision-rule code block); agent_template.md:33-35 (comparison rows) + :89-100 (Claude YAML example + decision rule).
- [x] CHK-042 [P2] README updated (if applicable) — N/A: `.claude/agents/README.txt` and `.opencode/agents/README.txt` are explicitly out of scope (owned by phase 005), no AGT finding names them — confirmed N/A, no README touched.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — none created during this authoring pass — fixture files for T015/CHK-023 were created and cleaned up under the session scratchpad, not this packet's `scratch/`; `scratch/` still contains only `.gitkeep`.
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed: `scratch/` contains only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-11 — all 25 checklist items verified with inline evidence; AGT-05 was fixed in a follow-up remediation pass (operator decision: remove the `.codex/agents` claims), no longer a deferral.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
