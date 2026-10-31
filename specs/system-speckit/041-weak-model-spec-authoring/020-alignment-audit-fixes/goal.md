---
title: "Goal: Phase 20: alignment-audit-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "alignment audit fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes"
    last_updated_at: "2026-10-26T20:45:00Z"
    last_updated_by: "closeout-doc-writer"
    recent_action: "Closed out: every completion criterion holds"
    next_safe_action: "None: phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-020-alignment-audit-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: alignment-audit-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make every file packet 054 touched match its standard and the shipped behavior, with each fix backed by the audit's evidence and its check.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Four lanes on disjoint files: A code, B skill docs, catalog and playbook, C READMEs and changelogs, D agents, commands, advisor and the critic's findings. |
| D2 | DeepSeek V4.1 Flash 1017 through cli-pi makes each literal fix from one short brief, Sonnet 5.5 high makes each judgment fix, and a fresh verifier per lane edits nothing. |
| D3 | A file is edited only when a finding or a verifier residual names it, plus the generated mirrors its owner's generator rewrites. |
| D4 | No full test suite: each lane runs the targeted checks its findings name. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx tsx evals/check-no-mcp-lib-imports-ast.ts` from `runtime/cli` prints `AST import policy check passed` and exits 0
- [x] The seven targeted CLI vitest files print `Tests 117 passed (117)`
- [x] `skill-graph-freshness.cjs --strict` exits 0 with `SIGNAL DRIFT compiled vs disk: none`
- [x] `scratch/review.md` records each lane verdict and every residual's outcome
- [x] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Audit | Done | `scratch/audit/findings.json`: 46 findings, 1 P0, 12 P1, 33 P2 |
| Lanes A to D | Done | `scratch/review.md`: A PASS, B PASS, C PASS WITH RESIDUALS, D partially verified then R1 fixed |
| Close gates | Done | v2.12.1.0, Hermes `PASS: 67`, `npm run check` rc 0, trigger index matches the corpus |

### Deviations and findings

| Item | Note |
|------|------|
| First scope list | Matched another 054 packet's trailer; rebuilt as `scope2.txt` and closed by each verifier's re-audit |
| R2 | The speckit YAML declared `guard_scripts_command` and no step ran it; the conductor wired it into all nine `post_write_validation` gates as a non-blocking check |
| Pre-existing em dashes | 75 files hit a literal full-file scan; no added line holds one, so none were removed |
<!-- /ANCHOR:log -->
