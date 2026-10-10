---
title: "Goal: Phase 2: webflow-labels-and-playbook"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook"
    last_updated_at: "2026-10-10T17:30:00Z"
    last_updated_by: "claude-sonnet-verifier"
    recent_action: "Verified all completion criteria and recorded results in the LOG"
    next_safe_action: "Orchestrator runs the Hermes generator and the compiled route re-mint"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-011-002-webflow-labels-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: webflow-labels-and-playbook

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every Webflow link label that shows an old underscore file name show the path it opens, and give the Webflow playbook root the overview section the document validator requires, releasing both as sk-code-webflow 1.1.2.0.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each new label is the link's own target in backticks, and no link target changes |
| D2 | Each edit replaces the smallest unique span: the link alone, else its whole line, else the line above plus the line |
| D3 | The playbook root gets `## 1. OVERVIEW` above its intro paragraph and keeps the one `document_type_fallback` warning |
| D4 | The packet moves to 1.1.2.0 with one compact changelog entry, and the builder never regenerates Hermes copies or the compiled route |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n '\[[a-z]+_[a-z_]+\.md\]' .skilled/skills/sk-code/sk-code-webflow --glob '!**/changelog/**'` prints nothing and exits 1.
- [ ] `bash specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook/scratch/check-labels.sh` prints no `BAD` line and `OK=59 BAD=0`.
- [ ] `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook/manual-testing-playbook.md` prints `VALID` and `Total issues: 1` and exits 0, and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/sk-code-webflow/manual-testing-playbook` prints `PASS package=sk-code/sk-code-webflow` with `violations=0 warnings=0` and exits 0.
- [ ] `grep -c '^version: 1.1.2.0$' .skilled/skills/sk-code/sk-code-webflow/SKILL.md .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` prints `.skilled/skills/sk-code/sk-code-webflow/SKILL.md:1` and `.skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md:1`, and `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-webflow/changelog/v1.1.2.0.md` prints `VALID` and exits 0.
- [ ] `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` prints `run-all-drift-guards: all 4 guards PASSED` and exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/002-webflow-labels-and-playbook --strict` prints `RESULT: PASSED`.
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
| Underscore label search prints nothing and exits 1 | Passed | `rg -n '\[[a-z]+_[a-z_]+\.md\]' ... --glob '!**/changelog/**'` printed only `exit=1` |
| Label check prints `OK=59 BAD=0` | Passed | `check-labels.sh` -> `OK=59 BAD=0`, no per-row BAD line |
| Playbook root `VALID` and package validator `PASS` | Passed | `VALID`, `Total issues: 1`, exit 0; `PASS package=sk-code/sk-code-webflow ... violations=0 warnings=0`, exit 0 |
| Version 1.1.2.0 in `SKILL.md` and the changelog, changelog `VALID` | Passed | `grep -c` printed `:1` for both files; changelog `VALID`, 0 hard blockers |
| All 4 drift guards PASSED | Passed | `run-all-drift-guards: all 4 guards PASSED`, exit 0 |
| Strict spec validation `RESULT: PASSED` | Passed | See the T094 evidence in tasks.md |

### Deviations and findings

| Item | Note |
|------|------|
| Handoff | Two links in `systematic-four-phases.md` came from the claim-checker child, so the diff has 27 differing paths, 62 removed and 64 added lines (planned 26, 60, 62 plus the handoff) |
| Pending for the orchestrator | Hermes check reports `DRIFT sk-code-webflow` and the compiled-route guard reports `sk-code stale-manifest` after sibling builds (T075 and T076) |
| Review | The verifier found no defects (`scratch/fix-units.json` is `[]`) |
| Reviewer finding | The changelog description said every Webflow link now shows its path, but 51 links with other labels were never in scope. Reworded by T097 to name only the labels that showed a pre-split file name |
| Changelog bullet for the handoff | The two handoff links in `systematic-four-phases.md` now open their sections, so the changelog gained a bullet for them (T098). Both units passed their checks, and the changelog validates `VALID` with 0 issues |
| Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0 |
<!-- /ANCHOR:log -->
