---
title: "Implementation Plan: AI-tell fixture corpus and detection benchmark for the design-audit anti-slop layer"
description: "Plan to create a deterministic AI-tell fixture corpus that resolves every registry fixture_id slug, a detection benchmark asserting expected tell IDs fire on positives with no off-family false positives, and a route-preserving playbook extension."
trigger_phrases:
  - "ai tell fixture corpus plan"
  - "design audit fixture benchmark"
  - "ai fingerprint fixture detection"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/004-ai-tell-fixture-corpus"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan phases complete after fixture corpus, checkers, and playbook edit shipped"
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
# Implementation Plan: AI-tell fixture corpus and detection benchmark for the design-audit anti-slop layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Skill / mode** | `sk-design`, `design-audit` mode (anti-slop layer) |
| **Artifact types** | HTML/CSS fixture samples, a Node ESM detection runner, a parity-checker existence extension, a playbook scenario extension |
| **Runtime** | Node ESM runner (sibling to `shared/scripts/ai-fingerprint-registry-check.mjs`); static HTML fixtures scanned as source text |
| **Validation** | Deterministic detection benchmark (expected tell IDs fire on positives, none on negatives) plus a fixture-existence parity gate; the playbook scenario stays a manual contract |

### Overview
The just-landed registry at `design-audit/assets/ai_fingerprint_registry.json` carries one `fixture_id` slug per AI tell, but the fixture files those slugs name do not exist yet, so the binding is presence-and-format only. This work creates the fixture corpus so every registry `fixture_id` resolves to real files, adds a deterministic detection benchmark that proves each positive fires exactly its own tell ID with no off-family false positives, extends the parity checker to assert fixture-file existence, and extends the AI-fingerprint playbook scenario with the fixture-backed clean-pass / positive / clean-negative shape and expected counts. The change is additive: the registry, prose catalog, and existing assets are preserved, and the corpus mirrors the registry rather than replacing it.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Registry `fixture_id` slugs enumerated from `ai_fingerprint_registry.json` (9 rows: 5 codex, 1 gemini, 3 general)
- [x] Each row's `deterministic_check` read as the per-tell matcher contract
- [x] Real playbook target confirmed as the denumbered `03--slop-hardening/ai-fingerprint-tells.md` (spec/research cite a stale `001-` numbered path)
- [x] No-regression baseline source identified: the playbook IS a hubRoute corpus member via `load-playbook-scenarios.cjs`

### Definition of Done
- [x] A fixture directory exists for every registry `fixture_id` with a clean (faithful) sample and a tell-present (positive) sample
- [x] The detection benchmark asserts every positive fires exactly its registry tell ID and every clean fires none, deterministically
- [x] The parity checker bites (exit non-zero) when any registry `fixture_id` has no fixture files
- [x] The playbook scenario is extended additively with expected counts and stays route-stable; the hubRoute scorer holds its baseline with zero regression

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven fixtures plus a deterministic detector. The registry is the single source of truth: each row's `fixture_id` names a fixture directory, and each row's `deterministic_check` defines one matcher. The corpus is the static evidence layer, the detection runner is the enforceable layer that proves the matchers fire correctly, and the parity checker guarantees the corpus stays complete as the registry grows.

### Key Components
- **Fixture corpus** (`design-audit/assets/ai_fingerprint_fixtures/`): one directory per registry `fixture_id`, each holding `clean.html` (faithful, fires no tell) and `tell.html` (minimal positive, fires exactly its own tell), plus a content-first corpus `README.md` describing the corpus map and the clean-vs-tell contract.
- **Detection runner** (`shared/scripts/ai-fingerprint-fixture-check.mjs`): one deterministic matcher per registry tell ID, derived from each row's `deterministic_check`; scans each fixture's source text, then asserts positives fire exactly their tell ID and cleans fire nothing. Exits non-zero on any miss, off-family false positive, or missing fixture.
- **Parity existence gate** (extend `shared/scripts/ai-fingerprint-registry-check.mjs`): keep today's `fixture_id` presence/format checks and add a file-existence assertion so a registry row without its fixture directory and both samples fails.
- **Playbook scenario extension** (`design-audit/manual_testing_playbook/03--slop-hardening/ai-fingerprint-tells.md`): add the fixture-backed scenario (clean pass + Codex/Gemini positives + clean negatives) and an expected-counts table, preserving the existing prompt, `expected_intent`, and `expected_resources` so the route is unchanged.

### Data Flow
1. The registry enumerates one row per tell with a stable `fixture_id` and a `deterministic_check`.
2. The corpus provides, per `fixture_id`, a clean sample and an isolated tell-present sample.
3. The detection runner loads the registry, builds one matcher per tell ID, scans each fixture, and compares fired tell IDs to the registry-derived expectation (positive = exactly its own tell, clean = none).
4. The parity checker confirms every registry `fixture_id` resolves to real files.
5. The playbook scenario documents the same corpus and expected counts for manual execution without changing its route.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Fixture corpus (positives + clean negatives)
- [x] Create `design-audit/assets/ai_fingerprint_fixtures/<fixture_id>/` for all 9 registry slugs
- [x] Author `tell.html` per fixture as a minimal sample that triggers only its own `deterministic_check`
- [x] Author `clean.html` per fixture as a faithful near-twin that triggers no tell (the clean pass / off-family negative)
- [x] Add a content-first corpus `README.md` mapping each fixture to its tell, family, and clean-vs-tell contract
- [x] Keep fixtures evergreen: no spec/packet IDs, no spec paths, no dimension IDs in any fixture or comment

### Phase 2: Detection benchmark + parity existence gate
- [x] Add `shared/scripts/ai-fingerprint-fixture-check.mjs` with one matcher per registry tell ID derived from `deterministic_check`
- [x] Runner asserts each positive fires exactly its tell ID and each clean fires none; fail closed on miss, off-family false positive, or missing fixture
- [x] Extend `ai-fingerprint-registry-check.mjs` to assert fixture-directory + `clean.html` + `tell.html` existence per registry row
- [x] Confirm the runner and parity checker stay evergreen (no IDs/paths embedded)

### Phase 3: Playbook extension + verification
- [x] Extend `03--slop-hardening/ai-fingerprint-tells.md` with the fixture-backed scenario and an expected-counts table (codex 5 / gemini 1 / general 3 positives, all cleans fire 0)
- [x] Preserve the existing prompt, `expected_intent`, and `expected_resources` so the scenario route is unchanged
- [x] Capture the hubRoute scorer baseline before the edit, re-run after, and confirm zero regression
- [x] Run the detection benchmark green; confirm both negatives (a removed fixture and a corrupted tell sample) bite

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Per-tell matcher fires on its `tell.html`, stays silent on its `clean.html`, and never fires on another tell's fixtures | `ai-fingerprint-fixture-check.mjs` |
| Integration | Full corpus run: 9 positives fire exactly their tell, 18 samples produce zero off-family false positives, parity checker green with fixtures present | Node ESM runners |
| Regression | hubRoute scorer over the full sk-design corpus holds its baseline after the playbook edit | skill-benchmark hubRoute scorer |
| Manual | Playbook scenario reads cleanly; expected counts match the corpus; clean pass is reported as no tells found | Read + audit-mode dry run |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `ai_fingerprint_registry.json` (9 rows, `fixture_id` + `deterministic_check`) | Internal | Green | Fixtures and matchers have no source of truth |
| `ai-fingerprint-registry-check.mjs` parity checker | Internal | Green | No place to add the existence gate |
| Playbook `ai-fingerprint-tells.md` (denumbered, AUDIT-SLOP-002) | Internal | Green | No scenario to extend; note the stale `001-` citation in spec/research |
| hubRoute / skill-benchmark scorer over the sk-design corpus | Internal | Green | No-regression invariant cannot be proven for the playbook edit |
| Node ESM runtime | Internal | Green | Detection runner and parity checker cannot run |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Matchers produce false positives, the corpus diverges from the registry, or the playbook edit regresses a hubRoute route
- **Procedure**: Remove the fixtures directory and the detection runner, revert the parity-checker existence extension and the additive playbook edit; the registry, prose catalog, and existing assets are untouched

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Fixture corpus) ──> Phase 2 (Benchmark + parity gate) ──> Phase 3 (Playbook + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Fixture corpus | Registry rows | Benchmark + parity gate |
| Benchmark + parity gate | Fixture corpus | Playbook + verify |
| Playbook + verify | Benchmark + parity gate | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Fixture corpus (18 samples + README) | Medium | 2-3 hours |
| Detection runner + parity existence gate | Medium-High | 3-4 hours |
| Playbook extension + regression verify | Low-Medium | 1-1.5 hours |
| **Total** | | **6-8.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Detection benchmark green: 9 positives fire exactly their tell, all cleans fire zero, zero off-family false positives
- [x] Parity checker green with fixtures present and biting when a fixture is removed
- [x] hubRoute scorer baseline captured before the playbook edit and held with zero regression after
- [x] Additive scope verified: registry, prose catalog, and existing assets unchanged except the additive playbook content and parity-checker extension

### Rollback Procedure
1. **Immediate**: Stop calling the detection runner and the existence gate in any build or delivery step
2. **Revert files**: Remove the fixtures directory and the detection runner; revert the parity-checker existence extension and the playbook content addition
3. **Verify**: Confirm the parity checker still passes on the registry alone and the playbook scenario still routes to its prior intent
4. **Note**: Record the divergence reason in the implementation summary

### Data Reversal
- **Has data migrations?** No (pure skill assets and static fixtures, no stored state)
- **Reversal procedure**: File removal only; no data to preserve or migrate

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
-->
