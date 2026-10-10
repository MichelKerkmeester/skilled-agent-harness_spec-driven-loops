---
title: "Goal: Phase 5: doc-claims-hardening"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening"
    last_updated_at: "2026-10-10T17:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-005-doc-claims-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: doc-claims-hardening

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code documentation claim checker report stale path-shaped link labels and dead anchors, leave conditional loading bullets alone and answer a missing `--root` with a usage error, and clear the semicolons from the OpenCode guardrails text.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Anchors resolve against GitHub's heading slug (lowercase, drop every character but letters, numbers, underscores, spaces and hyphens, one hyphen per space) and against explicit `<a id>` or `<a name>` values. |
| D2 | A path-shaped label passes when it ends its own existing target path or names a real file from the doc's packet, the hub or the doc's folder. |
| D3 | A `### Surface-aware loading` bullet that contains `when`, `if`, `unless`, `only` or `matched` claims nothing, for files and globs alike. The ALWAYS row is never skipped. |
| D4 | A `--root` that is not a directory exits 2, the code the checker already uses for a bad `--checks` value. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_doc_claims.test.cjs` prints `tests 12`, `pass 12` and `fail 0` and exits 0.
- [ ] `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs --root /nonexistent-dir` writes the one stderr line `usage: verify_doc_claims [--root <hub dir>] [--checks paths,names,surfaces,tiers] (--root is not a directory: /nonexistent-dir)` and exits 2.
- [ ] `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs --root specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening/scratch/repro-fixture` prints `doc.md:3: link label is a path that does not resolve: assets/checklists/gone.md`, `doc.md:4: link anchor does not resolve: ./target.md#9-missing-section`, `doc.md:5: anchor does not resolve: sk-code-demo/references/target.md#nope` and `PASS check tiers`, and exits 1.
- [ ] `node .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_doc_claims.cjs | grep -c 'sk-code-opencode/'` prints `0`, and `grep -c ';' .skilled/skills/sk-code/sk-code-opencode/references/shared/workflow-guardrails.md` prints `0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/005-doc-claims-hardening --strict` prints `RESULT: PASSED`.
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
| Checker test file passes 12 of 12 | Pass | Orchestrator rerun after the fix chain: exit 0, `tests 12`, `pass 12`, `fail 0`. The verifier's run before the review fixes gave tests 10, pass 10, and against the HEAD checker those 10 gave pass 6, fail 4 |
| Missing `--root` prints one usage line and exits 2 | Pass | `--root /nonexistent-dir` -> exit 2, one stderr line, `usage: verify_doc_claims [--root <hub dir>] [--checks paths,names,surfaces,tiers] (--root is not a directory: /nonexistent-dir)` |
| Reproduction fixture shows the label and anchor hits and `PASS check tiers` | Pass | exit 1, `doc.md:3` label, `doc.md:4` link anchor and `doc.md:5` anchor lines, `PASS check tiers`, `doc-claims: 3/4 checks passed` |
| No checker hit under `sk-code-opencode/` and no semicolon in the guardrails text | Pass | `grep -c 'sk-code-opencode/'` -> 0, `grep -c ';' workflow-guardrails.md` -> 0. After children 002 and 004 landed their fixes, the live-hub checker prints `doc-claims: 4/4 checks passed`, exit 0 |
| `validate.sh --strict` prints `RESULT: PASSED` | Pass | See the implementation summary verification table |

### Deviations and findings

| Item | Note |
|------|------|
| Whole-tree doc-claims hits | 7 remain at verification time, all in `sk-code-quality/assets/code-quality-checklist/` (5) and `sk-code-webflow/.../systematic-four-phases.md` (2), files children 004 and 002 own. Handoff row `overview-header-and-comments.md:51` already landed. The orchestrator reruns the checker after 002 and 004 land |
| Header comment wrap | The checker's header comment has a one-word dangling line (`match the hub, and`). Written as fix unit R001 and applied as T050 |
| Criterion 1 amended | The parallel reviewer's unit R08 added two test cases, for fenced headings and Setext or indented headings, so the criterion now expects 12 tests instead of 10. Amended by the orchestrator on 2026-10-10 |
| Reviewer findings | Eight findings, R01 to R08, applied as T051 to T060, plus three stale OpenCode labels the whole-hub checker found (T061 to T063) |
| tasks.md repair | The fix-unit insertion pasted the file tail twice, because a shell `$'` sequence in T050's check text was read as a replacement pattern. The orchestrator rebuilt tasks.md from its parts, kept every tick and reran the 14 fix checks |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
