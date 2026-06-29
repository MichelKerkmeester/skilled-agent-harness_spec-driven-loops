---
title: "Verification Checklist: AI-tell fixture corpus and detection benchmark for the design-audit anti-slop layer"
description: "Verification checklist with priority-tagged items and a fix-completeness section binding every spec acceptance and evidence point to a concrete check for the AI-tell fixture corpus."
trigger_phrases:
  - "ai tell fixture corpus checklist"
  - "design audit fixture benchmark checklist"
  - "ai fingerprint fixture detection checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/004-ai-tell-fixture-corpus"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all checklist items against fixture-check, registry-check, hubRoute 23/5/0"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is per-tell detection runnable now: yes on curated fixtures; catalog exhaustiveness stays advisory"
---
# Verification Checklist: AI-tell fixture corpus and detection benchmark for the design-audit anti-slop layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md PROBLEM, REQUIREMENTS, and SUCCESS CRITERIA read; fixture shape and home resolved against the registry
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md names the fixtures root, the detection runner, the parity gate, and the playbook target
- [x] CHK-003 [P1] Registry `fixture_id` inventory enumerated (9 rows: 5 codex, 1 gemini, 3 general)
  - **Evidence**: slugs read from `ai_fingerprint_registry.json`; parity checker baseline green (catalogTells=9 registryRows=9)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Detection runner parses without error and exits cleanly
  - **Evidence**: `node ai-fingerprint-fixture-check.mjs` runs and `node --check` is clean; human PASS summary emits
- [x] CHK-011 [P0] Fixtures and runner are evergreen — no spec/packet/dimension IDs or spec paths
  - **Evidence**: grep over `ai_fingerprint_fixtures/` and the runner returns no packet IDs or spec paths
- [x] CHK-012 [P1] One deterministic matcher per registry tell ID, derived from `deterministic_check`
  - **Evidence**: matcher count equals registry row count (9); each keyed to a registry tell ID
- [x] CHK-013 [P1] Runner and parity-checker output contracts stay consistent (stage/status/failures shape)
  - **Evidence**: both emit the same PASS/FAIL summary line shape

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every positive fires exactly its own registry tell ID
  - **Evidence**: detection benchmark reports 9/9 positives firing their expected tell (`samples=18`), none missing
- [x] CHK-021 [P0] Every clean sample fires zero tells (clean pass)
  - **Evidence**: detection benchmark reports 0 fires across all 9 `clean.html` samples
- [x] CHK-022 [P0] No off-family false positives across the corpus
  - **Evidence**: no codex fixture fires a gemini/general tell and vice versa; benchmark off-family count = 0
- [x] CHK-023 [P1] Negative cases bite
  - **Evidence**: a removed fixture fails the parity checker (exit 1); a mutated `tell.html` fails the detection benchmark (exit 1, naming the fixture)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

> Every spec ACCEPTANCE and EVIDENCE point binds to a concrete check here.

- [x] CHK-050 [P0] ACCEPTANCE: benchmark asserts expected tell IDs fire on positives (deterministic)
  - **Evidence**: CHK-020 satisfied — 9/9 positives fire their registry tell ID with a fixed, repeatable result
- [x] CHK-051 [P0] ACCEPTANCE: none fire on off-family negatives (deterministic)
  - **Evidence**: CHK-021 and CHK-022 satisfied — cleans fire 0, no off-family false positives
- [x] CHK-052 [P0] FORWARD-DEP: every registry `fixture_id` slug now resolves to real files
  - **Evidence**: parity existence gate green; one fixture directory with `clean.html` + `tell.html` per registry row
- [x] CHK-053 [P0] FORWARD-DEP: parity checker bites when a fixture is missing/wrong
  - **Evidence**: CHK-023 satisfied — removed fixture fails parity; mutated tell fails the benchmark
- [x] CHK-054 [P1] EVIDENCE: the `001-ai-fingerprint-tells.md:30` scenario gap (no fixtures / expected counts) is closed
  - **Evidence**: the real denumbered scenario carries the fixture-backed shape and an expected-counts table (Codex 5, Gemini 1, 2026-general 3, cleans 9)
- [x] CHK-055 [P1] No-regression invariant honored where the skill_benchmark corpus is touched
  - **Evidence**: CHK-030 satisfied — hubRoute 23/5/0 held with zero regression

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] hubRoute scorer holds its baseline with zero regression after the playbook edit
  - **Evidence**: baseline captured before the edit; re-run after shows 23 pass / 5 known-gap / 0 regression (delta 0)
- [x] CHK-031 [P0] Playbook scenario route is preserved
  - **Evidence**: prompt, `expected_intent`, and `expected_resources` unchanged; only additive content added
- [x] CHK-032 [P1] Additive scope respected
  - **Evidence**: registry, prose catalog, and existing assets unchanged except the additive playbook content and parity-checker extension

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three reflect the fixtures root, runner, parity gate, and playbook target
- [x] CHK-041 [P1] Corpus README is content-first and accurate
  - **Evidence**: `ai_fingerprint_fixtures/README.md` maps each fixture to its tell, family, and clean-vs-tell contract; no ID/path leakage
- [x] CHK-042 [P2] Stale path citation noted
  - **Evidence**: implementation-summary records that spec/research cite `001-ai-fingerprint-tells.md` but the real target is the denumbered `ai-fingerprint-tells.md`

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] New files confined to `design-audit/assets/ai_fingerprint_fixtures/` and `shared/scripts/`
  - **Evidence**: 9 fixture dirs (18 samples) + corpus README live under `assets/ai_fingerprint_fixtures/`; the new runner under `shared/scripts/`; the existence extension stays inside the existing registry checker
- [x] CHK-061 [P2] Scratch state cleaned before completion
  - **Evidence**: BITE mutations were restored with sync; the working tree carries only the 9 fixture dirs, the corpus README, and the two named `.mjs`, with no scratch residue

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 10 | 10/10 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent — verified against the delivered corpus, fixture-check, and registry-check (exit 0 at registryRows=9 samples=18 and catalogTells=9 registryRows=9; exit 1 on a mutated tell.html and a missing fixture; hubRoute 23/5/0)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Fix Completeness section binds each spec acceptance/evidence point to a check
-->
