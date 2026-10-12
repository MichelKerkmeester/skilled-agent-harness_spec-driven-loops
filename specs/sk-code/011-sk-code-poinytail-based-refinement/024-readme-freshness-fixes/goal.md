---
title: "Goal: README freshness fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "readme freshness fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes"
    last_updated_at: "2026-10-12T16:10:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, reviewed and closed the phase"
    next_safe_action: "Orchestrator merges the branch and writes the release notes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-024"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: README freshness fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Apply the README fixes F1 to F23 from the 023 research, each re-verified first, and retire doctor check 13c so a hub README keeps its own version.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A research row is a claim. Each is rerun against the repository before its edit, and a wrong proposal is rewritten to what the repository shows. |
| D2 | The README `version:` lines F24 to F28 name stay as they are (operator ruling: every doc carries its own version). Check 13c is removed instead. |
| D3 | Every edit outside this folder is made by cli-devin with `deepseek-v4-1-flash-max`, and the orchestrator diffs each dispatch against HEAD. |
| D4 | No `version:` line is edited by hand and no skill is released; the pre-commit hook raises changed docs. |
| D5 | Every ledger row ends Fixed with a backticked command proof or Rejected with a reason; out-of-scope items are Remaining rows. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `grep -cE '^\| F([1-9]|1[0-9]|2[0-3]) \| (Fixed|Rejected) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/implementation-summary.md`, run from the repository root, prints 23.
- [x] `grep -E '^\| F[0-9]+ \| Fixed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes/implementation-summary.md | grep -vcF "$(printf '\140')"`, run from the repository root, prints 0.
- [x] `for h in system-spec-kit system-skill-advisor sk-git sk-doc system-deep-loop; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h; done 2>&1 | grep -c 13c-readme-version`, run from the repository root, prints 0.
- [x] `node --test .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs >/dev/null 2>&1 && echo ok`, run from the repository root, prints ok.
- [x] `grep -cE '12 Specialized|Twelve specialized|12 specialized|12 custom|39 command|42 rules|42 validation|19 underlying|CLICKUP_API_KEY' README.md`, run from the repository root, prints 0.
- [x] `git log --no-merges --format= --name-only --diff-filter=A --grep='^Spec: sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes$' -- .skilled/skills | grep -c /changelog/`, run from the repository root, prints 0.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/024-readme-freshness-fixes --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--parent`, `--level 2` and `--with-goal` under the 011 epic |
| Build | Done | Commits `6e8564ff92`, `0861a11c6f` (README fixes), `0e2b905e9f` (13c removal), `3ec902274c` (versioning standard line); every dispatch byte-checked against HEAD plus its replacements |
| Review | Done | `/deep:review :auto`, 5 iterations on cli-devin `deepseek-v4-1-flash-max`: 0 P0, 0 P1, 2 P2, both fixed; CONDITIONAL from two search-debt items closed by observed runs |
| Criteria | Done | 1 prints 23; 2 prints 0; 3 prints 0; 4 ok; 5 prints 0; 6 prints 0; 7 RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Builders on accept-edits | The session refused `devin --permission-mode dangerous`; every builder and review leaf ran with `accept-edits` (edits, no shell), and the orchestrator ran every check and recorded each review iteration through the append gateway |
| Repeats folded in | The same stale claim at README.md `:98`, `:125`, `:147`, `:785` and git hooks README `:20`, `:121` was fixed under its F row |
| Proposals corrected | F11 named only `.opencode/agents/` for Hermes; F16's "All four" would undercount the extended tree |
| Versioning standard | `frontmatter-versioning.md:122` named the retired check and was reworded |
| Baseline | Check 13c FAILs on system-spec-kit, system-skill-advisor and sk-git and WARNs on sk-doc and system-deep-loop, on HEAD `0725425d46` |
<!-- /ANCHOR:log -->
