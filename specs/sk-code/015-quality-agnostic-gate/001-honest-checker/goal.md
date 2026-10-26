---
title: "Goal: Phase 1: honest-checker"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "honest checker goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/001-honest-checker"
    last_updated_at: "2026-10-26T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-001-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: honest-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the comment-hygiene checker, the ceiling report and the post-edit router cover the comment forms and languages they claim, drop the false positives this phase fixes, and wire the two CI rows to the same exit codes, without changing quality doctrine.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The checker stays one Python program, and it reads `Q/assets/comment-syntax.json` from its own real path. |
| D2 | A file's language comes from its shebang when the shebang names one, and from its extension otherwise. Only the first line is read for the shebang. |
| D3 | The `phase 0` and `T\d{3,4}` patterns stay unchanged, so the two pinned suite cases keep exit 1 (ADR-007). |
| D4 | The router resolves its checker from its own real path first, and from the project folder second (ADR-009). |
| D5 | CI and pre-commit keep whole-file scope (ADR-004). |
| D6 | This phase changes no doctrine. Iron Law 3, the UNKNOWN rows, the universal checklist retitle and the verification template wording wait for Phase 4 (ADR-001 and ADR-002). |
| D7 | A comment in changed code states the durable reason only, with no spec path, packet or phase number, requirement, task, ADR or ticket id. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh` exits 0 and prints `All comment hygiene test cases passed`.
- [ ] `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` exits 0 and prints `All ceiling report test cases passed`, and `bash .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh` exits 0 and prints `All typo-flag test cases passed`.
- [ ] `node --test` exits 0 for each of `.skilled/hooks/post-edit-quality/lib/post-edit-router.test.cjs`, `.skilled/hooks/post-edit-quality/codex/post-edit-quality.test.cjs`, `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs` and `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs`.
- [ ] `actionlint .github/workflows/comment-hygiene.yml .github/workflows/sk-code-script-tests.yml` exits 0 with no output.
- [ ] `rg -n -e '\.opencode/specs' -e 'unit test' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints no line.
- [ ] The file `.skilled/skills/sk-code/sk-code-quality/changelog/v1.5.0.0.md` exists, and it names the 6.4 baseline counts per class, which add up to the delta line count.
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
| Authoring of the seven packet documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `decision-record.md`, `implementation-summary.md` and `goal.md` are written. On the final state, `repair-derived.cjs --apply` exits 0, `validate.sh --strict --no-recursive` prints `RESULT: PASSED` with Errors 0 and Warnings 0, and `validate_document.py --type spec` exits 0 on all seven files. `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`. The durable slice is 2839 characters, under the 4000 limit. |
| Implementation steps 1 to 4 | Pending | `tasks.md` T004 to T043 |
| Verification | Pending | `acceptance-criteria.md` AC-001 to AC-028, all Unmet |

### Deviations and findings

| Item | Note |
|------|------|
| Design 5.2 narrows the `phase 0` and `T` patterns, and design 6.3 keeps 26 suite cases | Both narrowings flip pinned cases 47 and 51, so ADR-007 keeps the two patterns. The clean fixture excludes the two residual phrases. |
| Design line citations | Checked at the current tree. None moved for the lines this phase repeats. The two later commits touched the hub README, the hub router and the advisor README, which this phase does not cite. |
| Design 5.7 says no test folder exists under the post-edit hooks | True for a tests folder. Adapter tests exist beside the codex and devin adapters and under `.opencode/plugins/tests/`. The router test is new. |
| The codex and devin fixtures rely on a stub checker at the fixture root | The router-first order breaks their positive control. ADR-009 rewrites both fixtures. |
| CI exit handling | A missing python3 gives exit 127, which the design's rule of failing on exit 3 misses. REQ-012 fails on any code above 2. |
| Design 5.2 lists the playbook claim at line 178 without a phase | Phase 1 takes it as a test-claim fix. |
| The hub metadata gate | `ci-skill-root-metadata.cjs` did not finish within three minutes during authoring, so the hub bump has no gate result yet. |
| Section 2 is absent in this goal | The phase-child template numbers its sections 1, 3 and 4, so `validate_document.py` reports one `non_sequential_numbering` warning and still exits 0. The template numbering is kept. |
| Goal budget reads `unknown` | The goal tool applies the 4000-character budget to top-level packets and phase parents only. This folder is a phase child, and its slice is 2839 characters. |
<!-- /ANCHOR:log -->
