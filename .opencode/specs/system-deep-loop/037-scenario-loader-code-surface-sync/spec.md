---
title: "Feature Specification: Make the Lane-C scenario loader parse code-<surface>/ packet paths"
description: "The Lane-C scenario loader and live-result parser recognized only references/, assets/, and ../shared/ path prefixes, so post-rename gold naming code-webflow/code-opencode/code-animation packet resources was silently stripped to references/… — breaking gold↔router matching for every surface scenario. This packet teaches the four path extractors the code-<surface>/ prefix and adds a regression guard. Companion to the router-replay surface-slice sync; together they unblock the sk-code gold refresh + Lane-C re-baseline."
trigger_phrases:
  - "scenario loader code surface paths"
  - "load-playbook extractPaths code prefix"
  - "benchmark gold parser code-webflow"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-scenario-loader-code-surface-sync"
    last_updated_at: "2026-07-06T08:41:30.599Z"
    last_updated_by: "claude-opus"
    recent_action: "Loader parsers re-synced to code-<surface>/; regression guard added; harness vitests green"
    next_safe_action: "Close out, push; unblocks the sk-code gold translation + Lane-C re-baseline (021)"
---
# Feature Specification: Make the Lane-C scenario loader parse code-<surface>/ packet paths

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Related work** | Companion to `036-router-replay-surface-slice-sync` — same code-\<surface\>/ rename breakage, two different harness sites; together they unblock the sk-code gold refresh + Lane-C re-baseline |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Lane-C benchmark parses each playbook scenario's expected-resource gold (and, in live mode, the model's observed resource reads) with path-extraction regexes that recognized only the `references/`, `assets/`, and `../shared/` prefixes. After the two-axis split, sk-code's per-surface resources live under `code-webflow/`, `code-opencode/`, and `code-animation/` packet folders. A gold entry such as `code-animation/references/decision_matrix.md` was therefore silently truncated by the extractor to `references/decision_matrix.md` — a path that neither exists nor matches what the corrected router emits. The mismatch depressed discovery/recall for every surface scenario without any loud failure, so the benchmark could not measure post-rename routing even once the router-replay slicing was fixed and the gold paths were made current.

### Purpose
Teach the four code-*-blind path extractors the `code-<surface>/` packet prefix so packet paths parse whole, and add a regression guard so a future packet-folder rename cannot silently reintroduce the truncation. This is the companion harness fix to the router-replay surface-slice sync; together they let the sk-code playbook gold be refreshed and the Lane-C benchmark honestly re-baselined (a separate follow-up packet owns that gold work).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `code-<surface>/` prefix to the two gold/forbidden extractors in `load-playbook-scenarios.cjs` (`extractPaths`, `extractForbiddenPrefixes`) and the two live-result extractors in `live-executor.cjs` (prose fallback + observed-reads).
- Export `extractForbiddenPrefixes` so the forbidden-prefix parse is unit-testable.
- Add a regression guard test asserting packet paths parse whole (never collapse to `references/`).
- Verify no regression to the existing harness vitest suite.

### Out of Scope
- Translating the sk-code playbook gold paths to the code-<surface>/ layout and regenerating the benchmark baseline (the sk-code gold refresh is the separate follow-up packet).
- The pre-existing, unrelated harness test failure asserting `res.intents` contains `implement` (an intent/mode-projection expectation, a different subsystem).
- `router-replay.cjs`'s referenced-router-doc finder (it locates the router doc under `references/`, not surface gold, and is not on the sk-code hub path).

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs` | Modify | Teach `extractPaths` + `extractForbiddenPrefixes` the code-<surface>/ prefix; export the latter |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/live-executor.cjs` | Modify | Teach the prose-fallback + observed-reads extractors the code-<surface>/ prefix |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/code-surface-path-parse.vitest.ts` | Create | Regression guard: packet paths parse whole, never stripped to references/ |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | The gold extractors recognize code-<surface>/ paths | `extractPaths` / `extractForbiddenPrefixes` return `code-webflow|code-opencode|code-animation` paths whole, never truncated to `references/` | problem |
| REQ-002 | End-to-end unblock verified | With the extractors fixed and the gold translated, gold↔router recall rises from ~0 to a real non-trivial value | purpose |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-003 | Live-mode extractors aligned | The prose-fallback and observed-reads parsers in `live-executor.cjs` also recognize the code-<surface>/ prefix | scope |
| REQ-004 | Regression guard added and green; no new failures | The new guard passes and the harness suite shows no failure introduced relative to the captured baseline | scope |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-005 | Completeness sweep recorded | The harness was swept for other code-*-blind path matchers so no third one remains hidden | root-cause discipline |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four extractors parse code-<surface>/ packet paths whole. [EVIDENCE: extractPaths returns `code-animation/references/decision_matrix.md` intact and does not emit `references/decision_matrix.md`]
- **SC-002**: The regression guard passes and the harness suite has no new failure. [EVIDENCE: baseline 1 failed / 104 passed → post-fix 1 failed / 106 passed; the single failure is the same pre-existing, out-of-scope intents assertion]
- **SC-003**: The fix demonstrably unblocks the downstream gold refresh. [EVIDENCE: with extractors fixed + gold translated, recall 0 → 66% and the sk-code router verdict recovers 47 FAIL → 71 CONDITIONAL, then reverted for the follow-up packet to own]

### Acceptance Scenarios

- **Scenario 1**: **Given** a scenario whose gold names `code-webflow/references/x.md`, **when** the loader parses it, **then** the parsed gold is the full path, not `references/x.md`.
- **Scenario 2**: **Given** the extractors are fixed and the gold is translated, **when** the router benchmark runs, **then** discovery/recall rises materially over the pre-fix baseline.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broader prefix regex over-captures | Wrong paths parsed for other skills | The added alternative is anchored (`code-[a-z]+/`); the universal `references/`/`assets/`/`../shared/` tiers still match unchanged; full suite re-run confirms no new failures |
| Risk | A fifth code-*-blind matcher stays hidden | Another silent gold mismatch | A completeness sweep across the harness enumerated every references/assets path matcher before fixing |
| Dependency | Downstream sk-code gold translation + re-baseline | Blocked until this lands | Sequenced as the follow-up packet against the corrected loader |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The whole-path parsing behavior is locked by a deterministic, offline regression test so the invariant survives future renames.

### Maintainability
- **NFR-M01**: The fix keeps the durable rationale in a comment (packet paths sit alongside the universal tiers) without embedding ephemeral artifact identifiers.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Universal-tier gold (`references/universal/*`, `../shared/*`) and sk-doc-style `references/` gold continue to parse exactly as before; the change is purely additive.

### Error Scenarios
- If a future rename moves the surface packets again, the guard's whole-path assertion fails loudly instead of the extractor silently truncating packet paths.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Four one-line regex prefixes + one export + a guard test |
| Risk | 11/25 | Shared harness parser affecting all benchmarked skills; mitigated by additive change + full suite re-run |
| Research | 7/20 | Root cause diagnosed against the real loader output + end-to-end recall proof |
| **Total** | **24/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking. The sk-code gold translation + Lane-C re-baseline proceeds as the follow-up packet against the corrected loader.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Loader under repair**: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs`, `live-executor.cjs`
- **Companion harness fix**: `system-deep-loop/036-router-replay-surface-slice-sync`
- **Follow-up**: sk-code playbook gold translation + Lane-C re-baseline

<!-- /ANCHOR:related-docs -->
