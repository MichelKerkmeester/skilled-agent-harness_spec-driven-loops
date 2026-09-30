---
title: "Goal: Phase 36: sk-code-and-sk-doc-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk code and sk doc alignment goal"
  - "alignment audit completion criteria"
  - "header and stderr alignment"
  - "packet doc conformance goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment"
    last_updated_at: "2026-09-30T11:42:56Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the durable directive from the 2026-09-30 audit"
    next_safe_action: "Execute the five batches in tasks.md"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment/plan.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/036-sk-code-and-sk-doc-alignment/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-036-sk-code-and-sk-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 36: sk-code-and-sk-doc-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Bring every file the cli-jev packet created into line with sk-code-opencode and sk-doc, proved by their own validators, with no behavior change.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scope is the files the packet created from `f9d701bd13` to `089693d899`. Code in the deep-loop, skill-advisor and spec-kit runtime trees is left to the session that owns those align packets. Our catalog entries, playbook scenarios and changelogs there stay in scope |
| D2 | `verify_alignment_drift.py --check-exact-headers` sets the header bar. Each file keeps the header style its folder's older files use, so a box stays a box and gains its missing `COMPONENT:` marker (operator, 2026-09-30). The sk-code checklist and style-guide conflicts are recorded |
| D3 | No behavior change: headers, stderr tags and doc text only. Stdout report formats and `cli-deem`'s JSON stderr stay as they are |
| D4 | Recorded run evidence stays byte-identical, including the `raw/` script under the sk-design benchmark report |
| D5 | DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews it, and the reverse for MiMo's writes. No Claude workers. Fix P0 and P1, record P2 |
| D6 | No skill version bump: this is conformance of shipped files. SKILL.md descriptions over the soft length target are recorded, not trimmed, because trimming changes a routing input |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `verify_alignment_drift.py --check-exact-headers --fail-on-warn` over a staged copy of the 34 in-scope code files (the `raw/` evidence script left out) prints `Errors: 0` and `Warnings: 0`
- [ ] Every stderr diagnostic in the 11 scripts findings.md C2 names starts with `[<script-name>]`, and each changed script's test suite passes
- [ ] `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/manual-testing-playbook` exits 0 with status PASS, and `validate_catalog_package.py --json` lists no violation on any of the packet's 28 catalog entries
- [ ] `hvr_scan.py` over the packet's docs reports hard blockers only on the recorded false positives, and `validate_document.py` returns VALID for all 89 docs plus the new `injection-screen/README.md`
- [ ] Comment hygiene reports 0 violations on the 31 scripts, the key grep exits 1, and `validate.sh --strict` prints `RESULT: PASSED` for this phase
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Spec authoring | Done | 2026-09-30, docs only, from `scratch/audit/findings.md` and the operator's ask "Make sure all skills and things we created aligns with sk code opencode and sk doc" plus "Think feature catalogs, playbooks, readme's" and "Use external orchestration". Status Planned, Level 2, priority P1 |
| Scope | Done | 28 files in five groups: C1 9, C2 11, D1 2, D2 4, D3 7, D4 2. The audit exempts `raw/mode-routing-run.sh` from every edit. The 42 code files in the three runtime trees stay with their own align packets (D1) |
| Phase docs | Done | 2026-09-30: the six docs were authored from `scratch/audit/findings.md`. From the final state: `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, `goal.cjs packet` prints `packet_durable_chars=2694` and `packet_budget=unknown`, the standalone placeholder scan prints `PASS`, and `hvr_scan.py` reports 0 hard blockers on each of the six docs |
| Derived metadata | Pending | `repair-derived.cjs --apply` cannot re-derive in this worktree. The write is blocked, not done, and the reason is under Deviations and findings |
| Execution | Pending | T001 to T008 in `tasks.md`: one header batch, one stderr batch, three doc batches, two review tasks and the session's proof run. DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews (D5) |
| Proof | Pending | The five completion criteria above, each run from the final state with its result line recorded in `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Checklist conflict | `javascript-checklist.md` section 2 asks for the retired box, while `javascript/style-guide.md` section 2 and the verifier require the `MODULE:` divider. The style guide and the verifier win here, and the conflict is recorded in `spec.md` section 3 (D2) |
| D2 amendment (2026-09-30) | The operator chose "Minimal fix (Recommended)" for headers. C1 fell from 23 files to 9, and about 20 box headers stay as their folders use them |
| Soft length target | The `cli-classifier` and `cli-deem` `SKILL.md` descriptions sit at 155 and 151 characters against the soft 130 target. Recorded, not trimmed, because a trim changes a routing input (D6) |
| Audit baselines | The audit read at `089693d899` records 10 header errors, 31 of 31 hygiene clean, 89 of 89 docs VALID, two playbook errors, four catalog violations and 20 HVR hard blockers, of which the `reply-harness` path occurrences are false positives |
| Runtime dist unbuilt | `repair-derived.cjs --apply` fails at its re-derive step with `ERR_MODULE_NOT_FOUND` for `@spec-kit/runtime/dist/api/index.js`, because `.skilled/skills/system-spec-kit/runtime/dist` is not built in this worktree. `.skilled/skills/sk-git/scripts/worktree-provision-paths.txt` lists `.skilled/skills/system-spec-kit/runtime` with no build-artifact field, so provision installs its dependencies but never builds it. `description.json` is therefore not written, and `validate.sh --strict` reports 2 errors: `GENERATED_METADATA_INTEGRITY` (`source_fingerprint` missing, `description.json` missing) and `GENERATED_METADATA_DRIFT` (`causal_summary`). The package is built in the main checkout and in worktrees 064 and 070. Remedy: run `npm run build` under `.skilled/skills/system-spec-kit/runtime`, then rerun `repair-derived.cjs --apply`. Fixed by the session the same day: `npm run build` under `runtime` and `runtime/cli`, then `generate-description.js` wrote `description.json`, and `validate.sh --strict` passed. |
<!-- /ANCHOR:log -->
