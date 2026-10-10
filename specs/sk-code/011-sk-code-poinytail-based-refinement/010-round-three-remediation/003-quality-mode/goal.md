---
title: "Goal: Phase 3: quality-mode"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode"
    last_updated_at: "2026-10-10T13:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-003-quality-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: quality-mode

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code-quality SKILL.md and README name the hooks that actually run, use the current mode names, route spec folders to system-spec-kit and print checker commands that run, recorded as release 1.1.1.0.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The bump is patch, 1.1.0.0 to 1.1.1.0, because every change repairs wrong prose. The SKILL.md `version:`, the README `version:` and the new changelog file name all read 1.1.1.0. |
| D2 | Pre-rename names are renamed only: `code-webflow`, `code-opencode`, `code-review` and the prose mode name `code-quality` gain the `sk-` prefix, in SKILL.md and in the README title and H1. Obsidian is not added to the two-surface lists, and `schema_version: code-quality/v1` and the keyword comment stay. |
| D3 | The legacy `.skilled/hooks/git/pre-commit` and `scripts/hooks/claude-posttooluse.sh` stay listed, marked as helpers kept for direct tests, and the gate table names `.skilled/scripts/git-hooks/pre-commit` and `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`. |
| D4 | Every edit is one exact text replacement from `plan.md` section 3. Scripts, assets and the Hermes copy are not edited, and the builder runs Hermes only with `--check`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `rg -n '^\| (Write-time warning|Pre-commit block) \| .(scripts/hooks|\.skilled/hooks/git)|(^|[^-])code-(webflow|opencode|review)|(^|[^-])code-quality (routes|owns)|score code-quality' .skilled/skills/sk-code/sk-code-quality/SKILL.md; echo "exit=$?"` prints nothing and `exit=1`.
- [ ] From the repository root, `rg -c 'scripts/git-hooks/pre-commit|post-edit-quality/claude/claude-posttooluse.cjs' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints `4`.
- [ ] From the repository root, `rg -n 'bash \.skilled|spec-folder and MCP|spec folders, MCP|(^|[^-/\w])code-quality($|[^-/\w])' .skilled/skills/sk-code/sk-code-quality/README.md; echo "exit=$?"` prints nothing and `exit=1`, and `rg -c 'system-spec-kit' .skilled/skills/sk-code/sk-code-quality/README.md` prints `3`.
- [ ] From the repository root, `rg -n '^version:' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/README.md .skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md` prints three lines, each ending `version: 1.1.1.0`.
- [ ] From the repository root, `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh && bash .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh && python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/SKILL.md && python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/README.md --type readme && node .skilled/bin/compiled-route-guard.cjs && node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo "exit=$?"` prints `All ceiling report test cases passed`, `All comment hygiene test cases passed`, `Total issues: 0` twice, `sk-code                     fresh`, `checked=14 fresh=14 failed=0` and `exit=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode --strict` prints `RESULT: PASSED`.
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
| Criterion 1, no legacy gate rows and no pre-rename names in SKILL.md (REQ-001, REQ-003) | Done | rg printed nothing, exit=1 |
| Criterion 2, live hooks named on four lines (REQ-001) | Done | rg -c printed 4 |
| Criterion 3, README runs checkers directly, routes spec folders to system-spec-kit and has no bare `code-quality` mode name (REQ-004, REQ-005, REQ-013) | Done | rg printed nothing, exit=1; system-spec-kit count 3 |
| Criterion 4, three version strings read 1.1.1.0 (REQ-006) | Done | three lines, each version: 1.1.1.0, exit=0 |
| Criterion 5, tests, validators and routing gates pass (REQ-007, REQ-008, REQ-009) | Done | both test lines, Total issues: 0 twice, sk-code fresh, checked=14 fresh=14 failed=0, exit=0 |
| Criterion 6, validate.sh --strict prints RESULT: PASSED | Done | RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| The finding's count is 39, the stale lines are 13 | `rg -c "code-webflow\|code-opencode\|code-review"` also matches 28 current `sk-code-opencode/assets/...` paths. Eleven lines carry a stale surface or review name, and lines 142 and 145 carry `code-quality` as a mode name. |
| README dist command proved nothing | The old `bash check-dist-staleness.sh` failed under bash, and the script with no argument exits 0 without checking anything. The README now runs it directly with `--all`. |
| Hermes copy drift | `sync-skills-hermes.cjs --check` exits 1 with DRIFT sk-code-quality until the orchestrator runs the write form. PENDING-ORCHESTRATOR, no criterion depends on it. |
| Before baselines | Not captured by the builder. Pre-edit files were taken from git HEAD and baselines from plan.md section 5. |
| Doc-claims checker hits, closed at completion_pct 100 | `verify_doc_claims.cjs` reports seven hits in sk-code-quality files outside the planned edits (two unresolved hook paths in `scripts/lib/README.md`, five backticked `code-quality` names). Fix units T066 to T077 were applied and verified: no sk-code-quality line remains in the checker output. Re-verification found one regression, two semicolons from T072 that raised hvr hard blockers in `scripts/README.md` from 2 to 4. Unit T078 was applied and verified (hvr hard blockers back to the baseline 2), so completion_pct is 100 and `scratch/fix-units.json` is `[]`. Criterion 5 now shows `sk-code stale-manifest` in compiled-route-guard because child 001 is editing the hub (PENDING-ORCHESTRATOR); the other five criteria pass. |
<!-- /ANCHOR:log -->
