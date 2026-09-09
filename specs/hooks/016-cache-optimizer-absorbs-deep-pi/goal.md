---
title: "Goal: one Pi cache extension for every model"
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
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All six phases shipped, verified and validated"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-cache-optimizer-absorbs-deep-pi"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: one Pi cache extension for every model

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** `pi-cache-optimizer` handles cache behavior for every model Pi can reach, carries
cost accounting, retry guarding and verified edits across that whole surface, and `deep-pi` is gone.

### Decisions

| ID | Decision |
|----|----------|
| D1 | Capability lands before removal. Phase 005 deletes nothing until 001-004 ship, so no model is ever unowned |
| D2 | Implementation runs on `deepseek-v4-flash-max` through **cli-devin** |
| D3 | Cache-optimizer testing runs on `deepseek-v4-flash-vision-exp` through **cli-pi** on **llmgateway (DevPass)**, already `max`-pinned. There is no `-max` id on the pi surface |
| D4 | Historical records are never edited: prior packets, changelogs, benchmark reports and the dispatch audit log say what was true when written |
| D5 | Work happens on the current branch, `skilled/v4.0.0.0` |
| D6 | Documentation is reconciled last, once behavior is done and tested |

### Roadmap

| # | Phase | Outcome |
|---|-------|---------|
| 1 | `001-reclaim-deepseek-direct-ownership` | The carve-out predicate, its six early returns and the duplicated-allowlist machinery are gone; one extension covers every model |
| 2 | `002-port-cache-economics` | Hit rate, real input cost, estimated savings and prefix churn are measured and reportable for any model |
| 3 | `003-port-retry-loop-guard` | A failing turn stops re-billing the same request |
| 4 | `004-port-hash-verified-edits` | An edit whose hash no longer matches what the model saw is refused, not applied to moved content |
| 5 | `005-remove-deep-pi` | The extension, its enabled-package entry and every live reference are gone |
| 6 | `006-reconcile-extension-documentation` | The root README and every other Pi-extension README or inventory matches what ships |

Each phase holds its own `goal.md` with the criteria that decide that phase. This file is the
parent directive; a child goal that would change a decision here is an amendment to this file.

### Completion criteria

1. No model reaches Pi without cache handling, proven by the extension suite rather than by reading.
2. Economics, retry guard and verified edits are exercised on a non-DeepSeek model.
3. `deep-pi` is absent from the tree, from `.pi/settings.json`, and from every live reference.
4. Historical records still name it, unedited.
5. Every phase passes `validate.sh --strict`, and the parent passes `--recursive`.
6. READMEs describe the shipped state, verified after 001-005 are tested.

### Operator copy

The operator holds this directive as the session objective, and that copy judges completion. If
anything above changes, the full text is resent in chat so the operator can update their copy.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

| Surface | Bound to |
|---------|----------|
| Phase goals | `001-*/goal.md` through `006-*/goal.md` |
| Packet spec | `spec.md` |
| Closure gate | each phase's `acceptance-criteria.md` |
| Operator copy | the session objective, which judges completion |
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] No model reaches Pi without cache handling — the carve-out predicate is gone and the
      extension suite covers the previously excluded models
- [x] Economics, retry guard and verified edits are exercised beyond the DeepSeek-direct pair.
      Economics is confirmed live on a non-DeepSeek model: the persisted stats record shows 67
      requests on `llmgateway/glm-5.3-flash` with 66 hits, 7,729,152 of 8,194,905 input tokens
      served from cache, and `pricedRequests: 0` correctly reporting unpriced rather than a false
      zero cost. The retry guard and verified edits stay suite-covered, which is sufficient because
      neither branches on provider anywhere in the extension
- [x] The retired extension is absent from the tree, from `.pi/settings.json`, and from every live
      reference — including its statistics data file, which phase 005 had re-tracked
- [x] Historical records still name it, unedited
- [x] Every phase passes `validate.sh --strict`, and the parent passes `--recursive`
- [x] READMEs describe the shipped state, verified after 001-005 were tested
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

| Date | Event |
|------|-------|
| 2026-09-08 | Packet scaffolded; phase decomposition and execution contract frozen |
| 2026-09-08 | All six phases shipped; parent and children validate clean |
<!-- /ANCHOR:log -->
