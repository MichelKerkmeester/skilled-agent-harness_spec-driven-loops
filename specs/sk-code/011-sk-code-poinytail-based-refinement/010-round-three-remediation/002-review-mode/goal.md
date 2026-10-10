---
title: "Goal: Phase 2: review-mode"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode"
    last_updated_at: "2026-10-10T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-010-002-review-mode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: review-mode

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code-review mode detect surfaces through the shared sk-code detection contract with an Obsidian surface, check both documented finding shapes, and bring its docs into agreement with each other and the tree, released as version 1.7.0.0.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The detector restates `shared/references/stack-detection.md` section 2 and returns `OPENCODE`, `OBSIDIAN`, `WEBFLOW` or `UNKNOWN`; these four names are also the surface tokens in the output contract. |
| D2 | `check-review-findings.js` reads both the list shape `1. path:line Title` and the heading shape `### 2 [P1] Title`, and the four files in `scripts/review-output-fixture/` prove both shapes through both checkers. |
| D3 | The M-1 cache lives at `${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl`, and the status vocabulary everywhere in the packet is `APPROVED`, `REQUESTED_CHANGES`, `COMMENTED`. |
| D4 | No agent file is edited, and the frontmatter `description`, `Keywords` comment and `code-review` trigger phrase stay as they are. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 -I specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode/scratch/detect-probe.py` prints exactly `generic-node-src: UNKNOWN`, `dependency-bump: UNKNOWN`, `obsidian-prompt: OBSIDIAN`, `hub-file: OPENCODE`, `webflow-path: WEBFLOW` and `obsidian-manifest: OBSIDIAN`, in that order, and exits 0.
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js .skilled/skills/sk-code/sk-code-review/scripts/review-output-fixture/heading-shape-valid.md` prints `OK: findings are numbered once and each carries a Case line` and exits 0, and the same command on `heading-shape-restart.md` prints `FAIL: finding numbers restart or skip: expected 2, found 1` and exits 1.
- [ ] `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh` exits 0, prints 68 lines that start with `PASS`, and ends with `All rule-canary test cases passed`.
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` prints `OK: all rule invariants present (6 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode --strict` prints `RESULT: PASSED`.
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
| Detector probe prints the six target surfaces | Done | `python3 -I scratch/detect-probe.py` -> six lines `UNKNOWN`, `UNKNOWN`, `OBSIDIAN`, `OPENCODE`, `WEBFLOW`, `OBSIDIAN`, exit 0 (reviewer rerun) |
| Findings checker grades both heading-shape fixtures | Done | `check-review-findings.js heading-shape-valid.md` -> `OK: findings are numbered once and each carries a Case line`, exit 0; `heading-shape-restart.md` -> `FAIL: finding numbers restart or skip: expected 2, found 1`, exit 1 |
| Harness exits 0 with 68 PASS lines | Done | `bash check-rule-copies.test.sh` -> exit 0, 68 `PASS` lines, last line `All rule-canary test cases passed` |
| Canary prints the 6 exact-string OK line | Done | `node check-rule-copies.js` -> `OK: all rule invariants present (6 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).`, exit 0 |
| validate.sh --strict prints RESULT: PASSED | Done | `validate.sh <folder> --strict` -> `Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0 (run after `repair-derived.cjs --apply`) |

### Deviations and findings

| Item | Note |
|------|------|
| Review result | PASS after fixes: 3 defects found (unresolved path in `scripts/README.md:22`, missing gsap content markers, `read_text` never passed by the route), fixed by 5 units (now `scratch/fix-units-applied.json`) and re-verified: all five fix checks, both probes and `detect-probe.py` (six lines unchanged), all five goal criteria and the doc validators |
| PENDING-ORCHESTRATOR | Hermes regeneration (`sync-skills-hermes.cjs --check` reports 8 drifted copies including `sk-code-review`); leaf-manifest and compiled sk-code re-mint (`ci-leaf-manifest-freshness.cjs` -> `checked=14 fresh=13 failed=1`, `compiled-route-guard.cjs` -> `sk-code stale-manifest`) |
| PENDING-SIBLING | None. The `mode-registry.json:50` cache path is child 001's unit T167 |
| Deliberate exclusion | f-iter011-002 item (e), pinning AGENTS.md-level floors in the canary, stays out (plan D8): it would fail the canary on routine AGENTS.md edits |
| Before state | `scratch/*-before.txt` baselines were never captured by the builder; the HEAD tree (`git archive HEAD`) stood in: canary 5 exact-string files, harness 54 PASS, probe six old tokens, findings checker vacuous pass, two-space `Not checked:` rejected |
<!-- /ANCHOR:log -->

