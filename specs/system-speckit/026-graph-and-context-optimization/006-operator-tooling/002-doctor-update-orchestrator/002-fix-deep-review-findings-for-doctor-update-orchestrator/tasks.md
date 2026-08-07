---
title: "Tasks: 003 RM-8 013 Remediation"
description: "Sequential codex-dispatched task list across 4 batches with verification gates"
trigger_phrases:
  - "003 tasks"
  - "013 remediation tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator"
    last_updated_at: "2026-05-11T08:10:00Z"
    last_updated_by: "main-claude-opus-4.7"
    recent_action: "Authored tasks from plan.md"
    next_safe_action: "Dispatch Batch A (T-A01..T-A14) via cli-codex gpt-5.5 high fast"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:003-tasks-2026-05-11"
      session_id: "main-003-2026-05-11"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 003 RM-8 013 Remediation

<!-- SPECKIT_LEVEL: 2 -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[~]` | Deferred (with note) |

---

## Phase A — Doc Honesty (cli-codex gpt-5.5 high fast)

- [ ] T-A01 Run `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '{...}' .opencode/specs/.../001-implement-initial-doctor-command-set` → fixes description.json.specFolder
- [ ] T-A02 Run same on 002-sandbox-testing-playbook → refreshes last_active_child_id
- [ ] T-A03 Restore parent graph-metadata.json: `derived.status: "in_progress"`, preserve `derived.last_active_child_id`, `parent_id`, `manual.depends_on`
- [ ] T-A04 Reconcile `001/implementation-summary.md`: title "COMPLETE" → "COMPLETE (~95%)"; body table Status row → "COMPLETE (~95%)"; continuity `completion_pct: 99` → `95`
- [ ] T-A05 Reconcile `002/implementation-summary.md` continuity `completion_pct: 70` → `95`; reconcile body if any inconsistency remains
- [ ] T-A06 Edit `002/spec.md` SC-001: "25 scenarios" → "23 scenarios"
- [ ] T-A07 Edit parent `spec.md:105` Phase Map: "21 yamls" → actual on-disk count (likely "10 yamls" or "5 new yamls + 5 existing"); cross-check via Glob
- [ ] T-A08 Bulk replace `Status: PLANNED` → `Status: OK` in `001/resource-map.md` and `002/resource-map.md` ONLY for rows whose target file exists on disk (verify each before flip)
- [ ] T-A09 Drop the `.opencode/skill` symlink row from `013/resource-map.md` (path absent on disk)
- [ ] T-A10 Mark `001/checklist.md` items with `[x]` + evidence anchor (handover.md section or implementation-summary section) where verification is documented elsewhere; leave `[ ]` for genuinely incomplete items
- [ ] T-A11 Same as T-A10 for `002/checklist.md`
- [ ] T-A12 Update `001/tasks.md` T-011..T-046: mark ✅ Done for tasks whose output files exist; 🟡 In progress for tasks with files but partial verification
- [ ] T-A13 Drop 4 doc locations in 002 (handover.md + implementation-summary.md + decision-record.md + resource-map.md) claiming `last_active_child_id` set to 002 — replace with "tracked at parent graph-metadata.json"
- [ ] T-A14 Drop ADR-010-obsolete confirm/apply/apply-confirm YAML mentions from `001/implementation-summary.md` Track B1 section
- [ ] T-A-VERIFY `git diff --stat` shows only files in spec.md §3 §Files-to-Change Batch A list; targeted re-grep on R1-P1-001 through R1-P1-008 + R2-P1-001 through R2-P1-006 + R3-P1-001 through R3-P1-006 + R6-P1-001 through R6-P1-003 finds zero hits

---

## Phase B — Security Hardening (cli-codex gpt-5.5 high fast)

- [ ] T-B01 In `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh`: remove `--no-audit` flag from any `npm install` invocation; if audit failures would block bootstrap, add explicit `npm audit --audit-level=high` step after install
- [ ] T-B02 In same file: replace `mkdir <lockdir>` lock primitive with `flock -n <lockfile>` pattern (or `O_EXCL` `mkdir+rename`) — fail gracefully if lock already held
- [ ] T-B03 In sandbox `docker-compose.yml` (path TBC during dispatch): narrow `volumes:` from `.:/workspace:rw` (or equivalent broad mount) to only the paths the sandbox writes to (likely `./logs`, `./scratch`, output dirs); set read-only `:ro` for source paths
- [ ] T-B04 In same compose: add top-level `cap_drop: [ALL]` to the sandbox service; add minimal `cap_add:` list (likely `[CHOWN, SETUID, SETGID]` or empty if not needed)
- [ ] T-B-VERIFY `grep -n "no-audit\|--no-audit" .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` returns zero hits; `grep -n "flock\|cap_drop" <touched files>` returns expected hits

---

## Phase C — Cross-Runtime Mirror (cli-codex gpt-5.5 high fast)

- [ ] T-C01 For each `cmd` in `{memory, causal-graph, deep-loop, cocoindex, update}`: create `.claude/commands/doctor/<cmd>.md` from `.opencode/commands/doctor/<cmd>.md`, adjusting frontmatter for Claude conventions (mainly `allowed-tools` shape)
- [ ] T-C02 For each `cmd`: create `.codex/commands/doctor/<cmd>.toml`, converting YAML frontmatter to TOML, body markdown preserved; honor `feedback_codex_toml_body_drift.md` hand-inspection
- [ ] T-C03 For each `cmd`: create `.gemini/commands/doctor/<cmd>.md` with Gemini frontmatter shape
- [ ] T-C04 Add `<!-- skill_agent: system-spec-kit -->` (or appropriate owner) comment near top of each `.opencode/commands/doctor/<cmd>.md` (5 files)
- [ ] T-C05 Update root `README.md` if it counts commands or runtime mirrors; verify against `feedback_new_agent_mirror_all_runtimes.md` requirements (4 README.txt files + root README.md)
- [ ] T-C-VERIFY `find .opencode .claude .codex .gemini -path '*/commands/doctor/*'` returns exactly 20 entries (5 cmds × 4 runtimes); `grep -l "skill_agent" .opencode/commands/doctor/*.md` returns 5

---

## Phase D — P2 Cleanup (cli-codex gpt-5.5 high fast)

- [ ] T-D01 Refresh `_memory.continuity.last_updated_at` field to today's ISO date across affected packet docs (R9-P2-003, R9-P2-004 — only update those flagged as stale by iter-009)
- [ ] T-D02 If sandbox Dockerfile uses `debian:bookworm`, switch to `debian:bookworm-slim` (R5-P2-001)
- [ ] T-D03 Sandbox guard: locate the guard that returns success-on-cannot-run; change to return SKIP (R5-P2-002)
- [ ] T-D04 Edit parent `spec.md:117` REQ-P-001 acceptance criterion to allow cross-cutting docs (handover.md, resource-map.md) alongside the lean trio (R8-P2-002)
- [ ] T-D05 Fix `packet_pointer` strings in 001 child docs that are missing the `/001-implement-initial-doctor-command-set` suffix (R9-P2-004)
- [ ] T-D06 Address remaining iter-009 P2 findings R9-P2-001..009 case-by-case
- [ ] T-D07 R7-P2-002: 002 SC-001 already fixed in T-A06 — confirm coverage
- [ ] T-D-VERIFY targeted re-grep per P2 ID finds zero unresolved hits; checklist marks each P2 `[x]` or `[~]`

---

## Final Verification + Close-Out

- [ ] T-V01 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-fix-deep-review-findings-for-doctor-update-orchestrator --strict` exits 0
- [ ] T-V02 `checklist.md` shows all P1 + P2 items resolved (`[x]`) or formally deferred (`[~]`)
- [ ] T-V03 `implementation-summary.md` filled with batch-by-batch outcomes; `completion_pct: 100`
- [ ] T-V04 `git status -- .opencode/specs/.../010-doctor-update-orchestrator/` shows only intentional review-related changes; no rogue writes outside Batch A-D scope
- [ ] T-V05 Commit on main with conventional commit message
- [ ] T-V06 Save memory entry for 003 completion
- [ ] T-V07 (optional, operator-decision) Re-run `/deep:start-review-loop:auto` on 013 to confirm PASS verdict

---

## Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`
- **Source-of-truth for findings**: `../review/review-report.md` (commit `8d794afad`)
