---
title: "Goal: Phase 6: regeneration-and-verification"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/006-regeneration-and-verification"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: regeneration-and-verification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Regenerate every derived router artifact from the post-move tree and prove that routing accuracy and router replay hold at their baseline.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Derived files are regenerated with their generators, never hand-edited. |
| D2 | The trigger index is regenerated last, after the phase's final document write. |
| D3 | Token totals use tiktoken 0.11.0 `o200k_base` and stay provisional, because the authoritative tokenizer is UNKNOWN. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `ci-leaf-manifest-freshness.cjs` prints `checked=13 fresh=13 failed=0`, `sync-skills-hermes.cjs --check` prints `PASS: 65 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints seven fresh hubs, `skill-graph-freshness.cjs --strict` prints `STALE COMPILED: none`, and `generate-trigger-index.mjs --check` exits 0.
- [ ] `capture-scorer-eval-baseline.mjs` reads 155/195 on the full corpus, 49/66 on the holdout and 19/24 on ambiguity slice, with `corpusSha256`, `holdoutSha256` and `ambiguitySha256` unchanged.
- [ ] Router replay reports written before and after regeneration are byte-identical.
- [ ] A per-skill token table holds 54 data rows, with totals printed beside 39,159 router words, 89,931 gross tokens and 88,689 initial-load tokens.
- [ ] `verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, `ci-skill-root-metadata.cjs` prints `checked=13 passed=13 failed=0`, and `generate-router-intent-signals.cjs --check` prints `missing=0`.
- [ ] `validate.sh` on this folder with `--strict`, and on the parent with `--strict --recursive`, each ends with `RESULT: PASSED`.
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
| Regeneration and verification | Not started | Operator status. Child spec and acceptance criteria read Draft and Unmet. |

### Deviations and findings

| Item | Note |
|------|------|
| None | Nothing diverged from the directive. |
<!-- /ANCHOR:log -->
