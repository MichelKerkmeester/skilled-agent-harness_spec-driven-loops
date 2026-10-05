---
title: "Goal: Phase 9: census-hardening"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/009-census-hardening"
    last_updated_at: "2026-10-05T06:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All seven criteria met; the panel settled the disputed rows"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: census-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every class the citation census prints carry a measured accuracy, and make the census faster and rebuildable without changing a correct count. Done when: measurement-protocol.md names every sample size, the seed, the ground-truth rule per class and every threshold, and its timestamp precedes every result file; a citation to REPO RULES.md:88 resolves in the census, a test covers it, and a spaced path that is not a tracked file stays unresolved; each census class has a stratified sample of the protocol's size, and each row's ground truth is a factual check or two model labels; Cohen's kappa between the two labelers is recorded, and the most disputed rows are settled by operator labels or by the model panel decision-record.md records; accuracy per class is recorded with a Wilson 95% interval against the protocol threshold, and the gone class is split by cause; the median of three full census runs is recorded before and after batching the git reads, and the outputs are byte-identical apart from the spaced-path delta; the redirect-table rebuild flag regenerates cite-drift-redirects.json byte-identical at its commit.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The default run makes no model call and writes no file. |
| D2 | No sample size, seed or threshold changes once the first result file exists. |
| D3 | A path with spaces resolves only when the whole path is a tracked file. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] measurement-protocol.md names every sample size, the seed, the ground-truth rule per class and every threshold, and its timestamp precedes every result file
- [x] a citation to REPO RULES.md:88 resolves in the census, a test covers it, and a spaced path that is not a tracked file stays unresolved
- [x] each census class has a stratified sample of the protocol's size, and each row's ground truth is a factual check or two model labels
- [x] Cohen's kappa between the two labelers is recorded, and the most disputed rows are settled by operator labels or by the model panel decision-record.md records
- [x] accuracy per class is recorded with a Wilson 95% interval against the protocol threshold, and the gone class is split by cause
- [x] the median of three full census runs is recorded before and after batching the git reads, and the outputs are byte-identical apart from the spaced-path delta
- [x] the redirect-table rebuild flag regenerates cite-drift-redirects.json byte-identical at its commit
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
| Phase opened | Done | spec, plan, tasks and acceptance criteria written |
| phase 009-census-hardening measurement | Complete 2026-10-05 | guessed class 80.6% (71.5–87.4%) over 93 settled rows, panel verdict; see implementation-summary.md |

### Deviations and findings

| Item | Note |
|------|------|
| Criterion 4 amended 2026-10-05 | The operator asked for a model panel in place of operator labels; ADR-001 records it before any panel label existed |
<!-- /ANCHOR:log -->
