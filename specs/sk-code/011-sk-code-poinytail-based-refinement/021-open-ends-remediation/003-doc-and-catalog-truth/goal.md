---
title: "Goal: Doc and catalog truth"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "doc and catalog truth goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth"
    last_updated_at: "2026-10-11T19:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Built the phase, ran the deep review and fixed its findings"
    next_safe_action: "Operator confirms the bump reading for criterion 4"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-021-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Doc and catalog truth

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `version` mean the skill edition on `SKILL.md` only, with every version surface agreeing, and make the catalog, citation and playbook checks catch the drift the research found.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `version` lives on `SKILL.md` only; child docs carry none. |
| D2 | The new playbook path check and the citation overlap verdict are report-only or advisory. |
| D3 | Every ledger row in `spec.md` ends Fixed with a command proof or Closed with a written reason that prevent-overengineering or an operator decision backs. |
| D4 | Changed behavior gets a test that fails before the change and passes after it. |
| D5 | Each skill with a content or behavior change is bumped once, with one changelog entry. A skill touched only by the `version:` line removal, or by the citation re-anchor that removal forced, is not bumped: sk-doc's changelog records the removal (operator decision, 2026-10-11). |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -cE '^\| (DV|PC)-R[0-9]+ \| (Fixed|Closed) \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/implementation-summary.md`, run from the repository root, prints 17.
- [ ] `grep -E '^\| (DV|PC)-R[0-9]+ \| Fixed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/implementation-summary.md | grep -vcF "$(printf '\140')"` prints 0, and `grep -E '^\| (DV|PC)-R[0-9]+ \| Closed \|' specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/implementation-summary.md | grep -vcE 'prevent-overengineering|operator decision'` prints 0, both run from the repository root.
- [ ] `F=specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth/implementation-summary.md; [ "$(grep -cE '^\| T[0-9]+ \| .+ \| before: exit [1-9][0-9]* \| after: exit 0 \|$' $F)" = "$(grep -cE '^\| T[0-9]+ \|' $F)" ] && grep -qE '^\| T1 \|' $F && echo ok`, run from the repository root, prints ok.
- [ ] `B=$(git log -1 --format=%H --grep='scaffold the open ends remediation phases'); for s in $(git diff --name-only $B HEAD -- .skilled/skills | cut -d/ -f3 | sort -u | grep -vxE 'cli-classifier|cli-external-orchestration|cli-orca|mcp-code-mode|mcp-tooling|sk-code|sk-git|sk-prompt|sk-vision'); do [ "$(git diff --name-only --diff-filter=A $B HEAD -- .skilled/skills/$s/changelog | wc -l | tr -d ' ')" = 1 ] && git diff $B HEAD -- .skilled/skills/$s/SKILL.md | grep -q '^+version:' || echo $s; done`, run from the repository root, prints nothing.
- [ ] `node .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs verify`, run from the repository root, exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/003-doc-and-catalog-truth --strict`, run from the repository root, prints `RESULT: PASSED`.
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
| Packet scaffolded | Done | create.sh phase mode with `--with-goal`; spec.md lists every ledger row |
| Build | Done | DV-R1 to R4, DV-R6 and PC-R3 to R7 Fixed; the seven other rows Closed; ledger and Tests table in `implementation-summary.md` |
| Fleet measures | Done | `frontmatter-version.mjs verify`: exit 1 on 14 of 14 skills before, exit 0 on 14 of 14 after; `gate` and `package_skill.py --check --strict` exit 0 on 14 of 14 before and after |
| Deep review | Done | Five iterations through cli-pi, DeepSeek V4.1 Flash at max effort, stop policy max-iterations; artifacts in `review/` |

### Deviations and findings

| Item | Note |
|------|------|
| Bump reading (D5, REQ-005, criterion 4) | Amended by operator decision on 2026-10-11: the fleet-wide `version:` line removal is housekeeping the sk-doc contract owns. sk-doc is bumped and its changelog explains the removal, and the nine skills touched only by the removal (cli-classifier, cli-external-orchestration, cli-orca, mcp-code-mode, mcp-tooling, sk-code, sk-git, sk-prompt, sk-vision) are not bumped. D5 and criterion 4 now say so, and criterion 4 skips those nine. |
| sk-code re-anchor | The line removal shifted 15 live citations in the sk-code playbook down by one line; a separate commit re-anchored them. sk-code is not bumped for it, under the same reading. |
| `computeForFile` child-doc branch | Left in place and now unreachable, because another phase edits the option parsing in `frontmatter-version.mjs`; this phase changed only `inScope()` and `classify()`. |
| Warning count in two commit messages | `660e23f537` says 226 and `fc8b3a97e0` says 225 backticked-path warnings. The full report, read after the piped-output fix, has 258. History was not rewritten; `implementation-summary.md` records the correct count. |
| Deep review R3-P1-001 | The review rated the bump reading as P1 against D5 and criterion 4. Its downgrade trigger asked for an operator-approved amendment, and the operator approved it on 2026-10-11, so the finding is closed by that decision. Every other finding was fixed; see `implementation-summary.md`. |
| Continuity save | The review workflow's `generate-context.js` save step was not run, because it writes into `implementation-summary.md`, which holds the ledger. This file and `implementation-summary.md` carry the continuity. |
<!-- /ANCHOR:log -->
