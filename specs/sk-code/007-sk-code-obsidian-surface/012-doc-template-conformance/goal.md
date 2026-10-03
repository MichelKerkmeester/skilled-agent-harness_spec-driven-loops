---
title: "Goal: Doc-Template Conformance"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/012-doc-template-conformance"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Doc-Template Conformance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run the real `sk-doc` validators, `validate_skill_package.py`, `validate-playbook-package.cjs` and `validate_document.py`, against the `sk-code-obsidian` packet, record every result exactly as returned, and decide each finding as a genuine defect or as a validator limitation or class-wide divergence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase audits and records only: no `SKILL.md`, reference, playbook or asset file changes, and no validator script changes. |
| D2 | `## 1. WHEN THE HUB BUNDLES THIS` is not renamed in isolation. If the SURFACE-packet class adopts the generic section vocabulary, this packet follows in that same change. |
| D3 | The `Detected kind: standalone` result is a validator classification finding. No `graph-metadata.json` is added to the surface packet. |
| D4 | The audit uses the validators `sk-doc` ships; no `/doc:quality` substitute is invented. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `validate_skill_package.py` against `sk-code-obsidian` returns rc 0 and PASS, with `Detected kind: standalone` recorded as a validator finding
- [x] `validate-playbook-package.cjs --package` against `sk-code-obsidian/manual-testing-playbook/` returns rc 0 and PASS with strict on, `tier=FAIL_CLOSED`, 7 scenarios, 0 violations and 0 warnings
- [x] `validate_document.py` across every non-symlinked packet markdown file reports 34 PASS and 3 `missing_required_section` failures, each named with its missing sections
- [x] The same `validate_document.py` run against `sk-code-mobile-cli`, `sk-code-webflow` and `sk-code-opencode` reports 3, 4 and 4 missing sections, leaving `sk-code-obsidian` joint-best of the four
- [x] The withheld header rename is recorded with its reasoning and its reversal condition in both `spec.md` and `implementation-summary.md`
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
| Three validators run; sibling comparison run | Done (2026-08-28) | `tasks.md` T010 to T013 |
| Ranking, rename decision, reversal condition recorded | Done | `tasks.md` T020 to T023, CHK-020 to CHK-023 |
| Phase status | Complete | `spec.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Parent criterion names `/doc:quality` | No `/doc:quality` command exists in this runtime and `sk-create-quality-control` ships no script, so the audit ran the three `sk-doc` validators instead |
| Findings left unfixed | The 3 `missing_required_section` findings and the `standalone` classification stay open by design; fixing them needs a class-wide header change or a shared validator change |
<!-- /ANCHOR:log -->
