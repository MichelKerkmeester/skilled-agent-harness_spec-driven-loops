---
title: "Implementation Summary"
description: "Closed the skill-budget audit: every named surface was checked against this checkout, the target was run once read-only, and the two mismatches the audit found were fixed in the route entry and the workflow."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/048-doctor-command-audit/011-skill-budget"
    last_updated_at: "2026-10-02T21:04:43Z"
    last_updated_by: "markdown-agent"
    recent_action: "Closed the phase docs"
    next_safe_action: "Commit the packet files on the phase branch"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/_routes.yaml"
      - ".skilled/commands/doctor/assets/doctor-skill-budget.yaml"
      - "scratch/reality-check.md"
      - "scratch/doctor-run.log"
      - "scratch/proposal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-skill-budget"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-skill-budget |
| **Completed** | 2026-10-02 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: fix. The doctor's description-budget audit was checked against this checkout, and the two places where its manifest and workflow no longer matched the system it runs on are corrected: the route entry now records the audit script it runs, and the workflow names `python3` as the interpreter.

### Phase 11: skill-budget

An operator who runs `/doctor:speckit skill-budget` gets a report that matches this checkout. Every path, flag, constant and exit code the route and `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` name was checked and exercised once read-only, with the full record in `scratch/doctor-run.log`. The audit reported 61 items (14 skills, 35 commands, 12 agents), a project total of 6,774 characters against the 5,600 soft ceiling, and seven items over their soft target with none over the 1,536-character hard cap. The two mismatches were small but real: the route entry omitted the primary audit-script invocation, so `route-validate`'s script-existence check never covered `.skilled/commands/doctor/scripts/audit_descriptions.py`, and the workflow told the executor to run the script without an interpreter while the script is checked in mode 644.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/_routes.yaml` | Modified | Records `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"` in the `skill-budget` route, so the manifest and `route-validate`'s I1 check cover the audit script |
| `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` | Modified | The audit activity names `python3` as the interpreter, matching the canonical form in `scripts/README.md` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase ran as an audit first and an apply second. The audit checked every named surface against the checkout at HEAD `83616db9ba`, ran `/doctor:speckit skill-budget` once read-only, and recorded the inventory, the run and the verdict in `scratch/reality-check.md`, `scratch/doctor-run.log` and `scratch/proposal.md`.

The two fixes were applied in the shared `/doctor:speckit` batch with the other targets by GPT-6 Luna (cli-codex, max, fast), because they share `.skilled/commands/doctor/_routes.yaml`, `speckit.md` and the presentation asset. The orchestrator reviewed the diff and reran the gates itself: `route-validate.sh` exit 0, a YAML parse over every doctor asset, the catalog mirror check, the MCP mutation guard and the doctor script tests. The packet docs were closed from that evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the target and fix the two mismatches | Every path, flag, constant and exit code the workflow assumes exists and behaves; retiring a working target would lose a useful audit |
| Record the audit-script invocation in the route entry | The manifest is the canonical record of what a target runs, and the line brings the script under `route-validate`'s I1 existence check |
| Name `python3` in the workflow instead of changing the script's mode | File modes can be lost by copy tooling; the workflow text cannot, and `scripts/README.md` already documents the `python3` form |
| Keep the target read-only | The audit script has no write calls and the route declares `mutating: read-only`, so no database or frontmatter can be touched |
| Record subsystem defects as findings, not fixes | The description-budget overage, the unmirrored command descriptions and the `:auto` recommendation live in surfaces this phase does not own |
| Apply the fixes in the shared batch | The two files are shared with the other `/doctor:speckit` targets, so one reviewed diff and one gate run cover them together |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0; `OK: route-validate — 9 routes validated, 2 warnings`; `PASS: I1` now resolves the audit script; `PASS: J1` parity holds |
| YAML parse over every doctor asset and `_routes.yaml` | `YAML_OK`, 14 files |
| `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `bash .skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` | `GUARD PASS`, exit 0 |
| `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root .` | exit 0; 61 items; total 6,774; headroom −1,174 |
| Direct execution of the audit script path | exit 126, `Permission denied` — the mismatch the interpreter fix removes |
| Doctor script tests | `skill-advisor-route-contract.test.cjs` passes; the three `parent-skill-check-*.test.cjs` files fail exactly as at baseline |
| Stale-reference scan over the edited doctor files | no matches for `system_skill_advisor.`, `deep_loop_graph_status`, `query(` or `convergence(` |
| Packet validation: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/048-doctor-command-audit/011-skill-budget --strict` | Summary: Errors: 0, Warnings: 0; RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The recorded run used probes, not a live slash-command session.** The orchestrator executed the workflow's steps with Bash, Python and Node, so the interactive menu rendering was not exercised end to end. The recorded steps cover the CLI health probe, the audit runs, the direct-path failure and the route validation.
2. **Recorded finding: the project description budget is over its soft ceiling.** The audit reported a total of 6,774 characters against the 5,600 ceiling, headroom −1,174, with seven items OVER-SOFT: skill `sk-code` 405, agent `design` 267, skill `cli-classifier` 155, skill `cli-external-orchestration` 149, skill `system-spec-kit` 147, skill `sk-doc` 144 and skill `sk-design` 135. No item exceeds the 1,536-character hard cap, so the audit exits 0 without `--fail-over`; CI or pre-commit must pass `--fail-over=5600` to make this state non-zero. Recorded, not fixed: the budget lives in the surfaces the doctor inspects.
3. **Recorded finding: two counted command descriptions are not on the runtime surface the audit names.** `.skilled/commands/goal-opencode.md` (32 chars) and `.skilled/commands/vision.md` (103 chars) have no counterpart under `.claude/commands`, so 135 of the 6,774 characters are authored-surface, not Claude-visible. Either the two files should be mirrored or the audit's purpose sentence should say which surface it counts. Recorded, not fixed.
4. **Recorded finding: the doctor's own reference doc recommends an invocation the doctor rejects.** `frontmatter-templates.md` and `sk-create-skill/references/shared/common-pitfalls.md` say to run `/doctor skill-budget :auto`, but the doctor family contract declares no supported modes and the router rejects unknown flags. The fix belongs to those two sk-doc documents. Recorded, not fixed.
5. **Recorded observations left unfixed.** `doctor-update-presentation.txt:176` describes `/doctor skill-budget` as an "Advisor budget/status helper" when it audits description budgets; `audit_descriptions.py` prints a packet label in its report title and `quick_validate.py` carries one in its docstring; and the audit's Claude Code budget is hardcoded at 8,000 while `SLASH_COMMAND_TOOL_CHAR_BUDGET` is unset in this checkout. Recorded, not fixed.
6. **The three `parent-skill-check-*.test.cjs` fixtures fail in this worktree exactly as at baseline.** They cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js`, so their temporary fixtures report a false FAIL. This is pre-existing, not a regression from this phase.
<!-- /ANCHOR:limitations -->

---


