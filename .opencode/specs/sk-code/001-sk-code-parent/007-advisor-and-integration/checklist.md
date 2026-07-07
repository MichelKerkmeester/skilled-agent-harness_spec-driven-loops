---
title: "QA Checklist: Phase 7 — advisor and integration"
description: "Verification checklist for the deterministic reference sweep and hub advisor-node integration."
trigger_phrases:
  - "sk-code advisor integration checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/007-advisor-and-integration"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the phase 007 QA checklist with evidence"
    next_safe_action: "phase 008 routing-benchmark-and-review"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# QA Checklist: Phase 7 — advisor and integration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:correctness -->
## Correctness
- [x] Mappings derive from ground-truth git rename pairs (004: 128, 005: 42) plus explicit code-review SKILL.md/README.md fixups — evidence: `scratchpad/rename-map-004.tsv`, `rename-map-005.tsv`, repointer build.
- [x] Every mapping target validated on disk before use — evidence: existence filter in `repoint-007.py`.
- [x] Longest-match resolution (exact-file over derived-directory) — evidence: keys sorted by length desc.
- [x] Ambiguous split dirs correctly produce NO blanket mapping (e.g. `references/webflow/` split into code-implement + shared/webflow-shared) — evidence: derived-mapping single-destination guard.
<!-- /ANCHOR:correctness -->

---

<!-- ANCHOR:completeness -->
## Completeness
- [x] Broken `sk-code-review/` direct path loads repointed (deep-review, deep-loop template, check-rule-copies) — evidence: 0 residual `skills/sk-code-review/` path refs in the live surface.
- [x] 004 external-reference regression fully swept — evidence: 77 files / 225 replacements applied; residual grep clean except intentional fixtures.
- [x] Hub advisor node carries review keywords and no dangling edges — evidence: JSON probe (0 `sk-code-review` edges, review domains/intent_signals present).
- [x] `check-rule-copies.test.sh` REPO_ROOT depth corrected for the deeper location.
<!-- /ANCHOR:completeness -->

---

<!-- ANCHOR:safety -->
## Safety / Scope
- [x] Legacy `sk-code-review` alias preserved (registry, hub-router, hub trigger_phrases) until 009 — evidence: trigger_phrases probe True.
- [x] JS/TS test fixtures excluded (synthetic assertions untouched) — evidence: `code-graph-indexer.vitest.ts` / `doctor-apply-mode-stress.vitest.ts` unchanged.
- [x] Historical `changelog/` and `specs/` archives excluded — evidence: exclusion in the repointer.
- [x] Alias-covered NAME references (agent prose + speckit `baseline:`) intentionally deferred to 009 — evidence: recorded in spec §3 Out of Scope + §8.
- [x] No package.json/lock leak staged — evidence: pre-commit `git checkout`.
<!-- /ANCHOR:safety -->

---

<!-- ANCHOR:load-bearing -->
## Load-Bearing Verification
- [x] Pre-commit comment-hygiene gate restored — `CHECKER` → `code-quality/scripts/check-comment-hygiene.sh` (exists).
- [x] `.claude/settings.json` PostToolUse hook → `code-quality/scripts/hooks/claude-posttooluse.sh` (exists).
- [x] CI workflows (`comment-hygiene.yml`, `rule-canary-sync.yml`) repointed.
- [x] Hub `graph-metadata.json` key_files/entities → existing mode-packet/shared files; valid JSON.
<!-- /ANCHOR:load-bearing -->

---

<!-- ANCHOR:deferred -->
## Deferred (tracked, not blocking this phase)
- [ ] Advisor-graph rebuild (`skill-graph.json` regen) — runs on MAIN post-merge (needs `node_modules/dist`).
- [ ] Memory reindex of the sk-code corpus — runs on MAIN post-merge (DB snapshot first).
- [ ] Alias-covered `sk-code-review` NAME references (agent prose + speckit `baseline:`) — repoint in 009 with alias removal, after 008 validates routing.
- [ ] `parent-skill-check.cjs` + `validate.sh --recursive` — main post-merge (compiled toolchain).
<!-- /ANCHOR:deferred -->
