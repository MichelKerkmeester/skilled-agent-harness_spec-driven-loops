---
title: "Goal: Phase 2: builtin-runner"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "builtin runner goal"
  - "quality gate runner goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/002-builtin-runner"
    last_updated_at: "2026-10-26T04:14:20Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Put the TAP reporter in the two node --test criteria and recorded the finished log"
    next_safe_action: "Operator reviews the working tree, confirms ADR-011 to ADR-018, then commits the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-builtin-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: builtin-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give any repository one honest quality verdict per change, from a Node runner that runs only built-in checks and the checklists the hub declares.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The runner is `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` in Node. The Python hygiene engine stays Python and runs once per run with `--json` (ADR-001). |
| D2 | The repository root comes from `git rev-parse --show-toplevel`. The hub root comes from the real path of the runner file (ADR-002). |
| D3 | Changed lines block. Untouched lines in a touched file block only when a whole-file layer runs in the repository (ADR-003). |
| D4 | Exit codes are 0, 1, 2, 3 and 4, with precedence 3, 1, 4, 2, 0. No output carries a pass value (ADR-004). |
| D5 | The envelope keeps the `code-quality/v1` keys. The machine verdict is `code-quality-run/v1` (ADR-005). |
| D6 | Checklists come from the quality defaults and hub declarations only. Built-in checks only run. Repository config waits for Phase 3 (ADR-010). |
| D7 | The runner writes nothing to disk. Every spawn is an argv array under a timeout and the content-hash guard (ADR-010). |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` exits 0 and prints `# fail 0`.
- [ ] `node --test --test-reporter=tap --test-name-pattern='^F(0[1-5]|10|1[234]|1[678])' .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# pass 12` and `# fail 0`.
- [ ] `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh --format json | node -p "(v => v.resolved_surface.includes('SKILLED') && !v.findings.some(f => f.rule.startsWith('syntax.')))(JSON.parse(require('fs').readFileSync(0, 'utf8')))"` prints `true`.
- [ ] `ROOT=$(git rev-parse --show-toplevel) && T=$(mktemp -d) && git -C "$T" init -q && printf 'package a\n\n// see ADR-12\nfunc A() {}\n' > "$T/a.go" && (cd "$T" && node "$ROOT/.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs" > "$T/v.json" || echo "exit=$?") && node -p "(v => v.gate === 'BLOCKED' && v.resolved_surface[0] === 'unknown')(require('$T/v.json'))"` prints `exit=1` and then `true`.
- [ ] `node .skilled/bin/compiled-route-sync.cjs --check && node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exits 0.
- [ ] `rg -n '^version: 1\.6\.0\.0$' .skilled/skills/sk-code/sk-code-quality/SKILL.md` and `rg -n '^version: 3\.2\.0\.0$' .skilled/skills/sk-code/SKILL.md` each print one line, and `ls .skilled/skills/sk-code/sk-code-quality/changelog/v1.6.0.0.md .skilled/skills/sk-code/changelog/v3.2.0.0.md` lists both files.
- [ ] `node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --files .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh --format envelope | grep -c 'local-'` prints `0`.

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
| Packet documents authored | Done | `validate.sh --strict --no-recursive` prints `RESULT: PASSED` with zero errors and zero warnings. `validate_document.py --type spec` exits 0 on the five named files |
| 001-honest-checker landed | Done | `tasks.md` T001 printed `phase1-json` |
| Runner core and sensors | Done | The runner suite printed `# tests 27`, `# pass 27`, `# fail 0` after the review fixes |
| Surface declarations and reader row | Done | `tasks.md` T015 to T017 and T027 |
| Docs, changelogs and versions | Done | `tasks.md` T025 to T032 and T044 |
| Self-run and foreign smoke test | Done | `tasks.md` T035 printed `true`, and T036 printed `exit=1` then `true` |

### Deviations and findings

| Item | Note |
|------|------|
| Design citation moved | The sk-git entry-point note sits in `references/worktree-workflows.md:537-539` and `scripts/worktree-naming.sh:470-471`, not in `SKILL.md:307`. The packet cites the real location. |
| Design citation moved | The `local-example` name sits at `stack-detection.md:86`, not `:82`. |
| Design gap | No fixture drives the dist adapter end to end. Phase 3 adds the first declared generated path, so the end-to-end fixture belongs there. |
| Version assumption | Phase 1 takes the packet to 1.5.0.0 and the hub to 3.1.0.0, so the two targets here are the next minor of each. A different Phase 1 landing moves them with it. |
<!-- /ANCHOR:log -->
