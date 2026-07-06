---
title: "Feature Specification: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab"
description: "Pre-implementation Level 2 spec for the shared advisor-scorer saturation-class root fix: six leverage-ordered workstreams (post-cap demotion channel, metadata-driven executor-delegation resolver, TS/Python parity ledger, graph-causal visited-guard order, eval hardening, semantic_shadow ablation) plus the Layer 1b advisor projection vocabulary. GATED on the live advisor-TS lane standing down and a fresh 193-row re-baseline. Layer 2 + Layer 1b of the sk-code routing + shared-advisor-scorer program; Layer 1 shipped as packet 024."
trigger_phrases:
  - "advisor scorer saturation root fix"
  - "explicit lane demotion channel"
  - "executor delegation resolver"
  - "advisor projection vocab"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-scorer-saturation-root-fix"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Pre-implementation spec authored"
    next_safe_action: "Await advisor-lane standdown, then execute WS3→WS1→re-run→WS2/4/5/6"
---
# Feature Specification: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned / Not started — GATED |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor scorer treats explicit-lane disambiguation penalties as pre-clamp additive offsets and floors net-negative lane matches to zero, so a shipped penalty never survives as durable negative evidence and any saturating positive support erases the demotion. Concretely, explicit-lane scores clamp with `Math.min(score, 1)` at `lib/scorer/lanes/explicit.ts:355`, and fusion floors a lane match with `Math.max(existing.rawScore, match.score)` at `lib/scorer/fusion.ts:270`; together they mean a `-3.0` or `-0.6` disambiguation offset is absorbed by clamp headroom the moment ordinary surface tokens re-saturate a candidate. The shipped `-3.0` cli-opencode widening and the `+3.0`/`-0.6` colon-review and webflow-cms offsets are band-aids on this architectural class, not a fix. Compounding the routing gap, sk-code's advisor-facing metadata never authored single-pass audit, review, or release-readiness vocabulary, so deep-loop-workflows monopolizes those lanes and single-pass "audit the code" prompts misroute.

### Purpose
Replace the pre-clamp penalty class with a durable post-cap demotion channel and a metadata-driven executor-delegation resolver, close the four correctness and hardening gaps the two research rounds confirmed (TS/Python parity, graph-causal visited-guard order, loose eval gates, unproven semantic_shadow), and give sk-code the single-pass audit/review projection vocabulary it lacks — so disambiguation survives as real negative evidence, the corpus re-baselines honestly, and single-pass code-audit prompts route to sk-code while iterative convergence prompts stay with deep-loop-workflows.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **WS1 — Explicit-lane demotion channel [ROOT]**: cap positive support first, then subtract demotion, so a penalty cannot be absorbed by clamp headroom. Design A (post-cap demotion) first: `score = Math.max(0, Math.min(supportScore, 1) + demotionScore)`. Escalate to Design B (a first-class `disambiguationPenalty` channel on `LaneMatchIndexEntry` + contribution assembly, subtracted from effective raw score, weighted score, RRF sort, and confidence inputs) only if the scorer must rank *by* negative evidence rather than merely suppress.
- **WS2 — Metadata-driven executor-delegation resolver**: a new `lib/scorer/executor-delegation.ts` that replaces the inline `-3.0` OpenCode regex, detects delegation verbs near an executor alias, builds its alias table from `graph-metadata.json` (`family:'cli'` / `category:'cli-orchestrator'`) plus sk-prompt-models `model_profiles.json`, and applies a **post-fusion routing override** lifting the resolved active executor and suppressing sk-code re-saturation.
- **WS3 — TS↔Python parity ledger**: record the five named live regressions (rr-iter2-016, rr-iter2-060, rr-iter3-093, rr-iter3-100, rr-iter3-104) as reviewed-accepted, rename the legacy "197-prompt" suite to the real 193, keep force-local parity in CI, and evaluate parity against SQLite/source metadata rather than the diagnostic `skill-graph.json`.
- **WS4 — Graph-causal visited-guard order fix**: in `lib/scorer/lanes/graph-causal.ts:84-114`, move scoring before the visited guard (score-first, traversal-second) and replace the boolean `seen` set with `bestPositiveStrengthByTarget` so a weak/negative first edge no longer suppresses a later stronger edge to the same target.
- **WS5 — Eval hardening**: an empirical ambiguity slice from top-2 margins (frozen `ambiguity-prompts.jsonl`), schema-enforced `bucket`/`source_type` with `review`/`memory_save`/`delegation` bucket minN + top1 thresholds, a ratcheted `scorer-eval-baseline.json`, and a frozen independent holdout of ≥60 rows (or 25%, prompt-family-deduped).
- **WS6 — semantic_shadow prove-or-freeze**: restore one deterministic embedding path, run a paired 193-row ablation (5-lane baseline vs `disabledLanes:['semantic_shadow']`) plus holdout with pinned `providerModelId`, fail-on-skip, and keep the weight low until evidence justifies it.
- **Layer 1b — Advisor projection vocabulary**: sk-code `graph-metadata.json` + `SKILL.md` frontmatter gain `code audit`, `code review loop`, `findings-first review`, `release readiness`, `audit`, `findings`, `security`, and `correctness`; deep-loop-workflows drops bare `code audit` and `severity weighted findings`, keeping its loop/convergence identity.

### Out of Scope
- Any sk-code-local, advisor-scorer-independent routing discovery already shipped as Layer 1 (packet 024, commits `ec014f95c6` code + `852ee387cc` docs/rollup) — CWV/accessibility smart-routing vocabulary, router-replay acronym boundaries, and the Lane-C D3 empty-gold proxy fix.
- Rewriting deep-loop-workflows' loop/convergence doctrine or its benchmark harness beyond the two advisor-metadata vocab deletions named above.
- Editing the memory daemon, its database, or any embedding provider infrastructure beyond restoring one deterministic embedding path for the WS6 ablation.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modify | WS1: cap positive support before applying demotion so penalties survive clamp headroom |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | WS1: stop the `Math.max` floor from erasing net-negative lane evidence |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` | Create | WS2: metadata-driven executor-delegation resolver with post-fusion routing override |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` | Modify | WS4: score-first/traversal-second; `bestPositiveStrengthByTarget` replaces boolean `seen` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/eval/scorer-eval-baseline.json` | Modify | WS5: ratcheted baseline replacing fixed floors |
| `.opencode/skills/sk-code/graph-metadata.json` | Modify | Layer 1b: add single-pass audit/review/release-readiness projection vocabulary |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Layer 1b: mirror the audit/review vocabulary in advisor-facing frontmatter |
| `.opencode/skills/deep-loop-workflows/graph-metadata.json` | Modify | Layer 1b: drop bare `code audit` and `severity weighted findings`, keep loop/convergence identity |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | WS1 post-cap demotion channel [ROOT] | Positive support is capped before demotion is subtracted; a verbose-saturation fixture set (cli-opencode, colon review loop, webflow CMS, benchmark-mode) asserts both `topSkill` and the demoted candidate's effective explicit contribution; no penalty is absorbed by clamp headroom | problem |
| REQ-002 | WS2 metadata-driven executor-delegation resolver | The inline `-3.0` regex is removed; `executor-delegation.ts` resolves cli-claude-code, minimax, and kimi to their active executor from metadata + model profiles, treats archived codex as `lifecycleStatus:'archived'` (abstain/redirect, never default-routable), and applies a post-fusion routing override | scope |
| REQ-003 | WS3 parity gate honest and green | The five named regressions are ledgered reviewed-accepted OR preserved; the "197-prompt" suite is renamed to 193; force-local parity runs in CI; parity evaluates against SQLite/source metadata, not `skill-graph.json` | scope |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-004 | WS4 graph-causal visited-guard order | Signed contributions are computed before any visited guard; `bestPositiveStrengthByTarget` replaces boolean `seen`; the seeded repro (α→β conflicts_with w=1 and α→β enhances w=0.9) no longer lets the weak first edge win | scope |
| REQ-005 | WS5 eval hardening | Empirical ambiguity slice from top-2 margins; schema-enforced `bucket`/`source_type` with review/memory_save/delegation minN + top1; ratcheted baseline; frozen independent holdout ≥60 rows or 25%, prompt-family-deduped | scope |
| REQ-006 | WS6 semantic_shadow prove-or-freeze | One deterministic embedding path restored; paired 193-row ablation (5-lane vs disabled) + holdout with pinned `providerModelId` and fail-on-skip; weight stays low until evidence justifies a change | scope |
| REQ-007 | Layer 1b advisor projection vocabulary | sk-code gains the eight single-pass audit/review/release terms in graph-metadata + SKILL frontmatter; deep-loop-workflows drops the two bare terms; drift-guards stay green | scope |

### P2 - Optional

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-008 | WS1 Design B escalation | Only if the scorer must rank by negative evidence: extend `LaneMatchIndexEntry` + contribution assembly with a first-class `disambiguationPenalty` subtracted from raw score, weighted score, RRF sort, and confidence/directScore inputs | risks |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 193-row `tsCorrect` is greater than or equal to the fresh re-baseline captured after Layer 1b metadata lands (numbers are not comparable to the pre-Layer-1b run because two of the five regressions misroute to deep-loop-workflows until the projection changes).
- **SC-002**: Parity regressions equal 0, or every surviving regression is explicitly ledgered as reviewed-accepted in the divergence ledger.
- **SC-003**: The robustness guard is clean: per-skill regressions = 0, the memory-save and read-only-review buckets show 0 regressions, wrong near-ties do not increase, and the UNKNOWN count does not rise.
- **SC-004**: Live warm-probe routing is correct — "iterative code audit with convergence tracking" routes to deep-loop-workflows; single-pass "review and fix the code" and "code audit" route to sk-code (win, or a tie within margin); and the displayed confidence rank matches the chosen route.

### Acceptance Scenarios

- **Scenario 1**: **Given** a verbose "use cli-opencode gpt-5.5 high to review and fix the code" prompt that re-saturates sk-code surface tokens, **when** the scorer fuses lanes, **then** the executor-delegation resolver's post-fusion override keeps the active executor top-ranked and the sk-code demotion survives instead of being erased by clamp headroom.
- **Scenario 2**: **Given** the single-pass prompt "audit the code for correctness and security findings", **when** the advisor projects intents after Layer 1b, **then** sk-code fires its audit/findings vocabulary and wins or ties within margin while deep-loop-workflows no longer monopolizes the audit lane.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hand-writing WS3 regression rules in the explicit lane before the WS1 re-run | Re-introduces the exact pre-clamp offset class WS1 exists to kill, inheriting a fresh migration burden | Ledger the five divergences first, ship WS1's post-cap channel, re-run the corpus, and hand-write rules only for regressions that survive |
| Risk | Comparing scorer numbers before re-baselining | Two of five regressions misroute to deep-loop; pre-Layer-1b numbers are not comparable | RE-BASELINE FIRST: capture a fresh 193-row run after Layer 1b metadata lands, then compare against it |
| Risk | Two-axis sk-code hub adds saturating fuel | Verbose executor prompts have more saturating surface vocabulary than when the corpus was captured, raising WS1 urgency | WS1 post-cap demotion is leverage-first in the sequence |
| Dependency | Live advisor-TS lane (`lib/scorer/*.ts`) | The 009 dispatch-hardening + 40-iteration alignment audit is actively editing these files; concurrent edits collide | GATED — do not start until the lane stands down and a fresh re-baseline is captured |
| Dependency | Fresh 193-row re-baseline after Layer 1b | Scorer deltas are meaningless without it | Pre-authorized on unblock: self-capture the baseline (run `rebuild-native-modules.sh`, PID-scoped, if the corpus scan SIGBUSes on the native ABI) |
| Dependency | sk-prompt-models `model_profiles.json` | WS2 builds its executor alias table from it | Read-only consumption; MiniMax/Kimi resolve to their primary executor (cli-opencode) |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Parity is deterministic and force-local in CI; native-first delegation must not mask fallback drift, so parity evaluates against SQLite/source metadata rather than the diagnostic `skill-graph.json`.
- **NFR-R02**: No weight change (WS6 or otherwise) promotes unless `advisor_validate` passes, per-skill regressions = 0, the memory-save and read-only-review buckets show 0 regressions, wrong near-ties do not increase, and UNKNOWN does not rise.

### Maintainability
- **NFR-M01**: WS2 builds its alias table from metadata (`graph-metadata.json` + `model_profiles.json`), never a hardcoded list, so a new or renamed executor is picked up without editing the resolver.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- The archived codex executor must abstain or redirect on "use codex" and must never be default-routable; it loads as `lifecycleStatus:'archived'` and suppresses the sk-code fallback rather than resolving to a live executor.
- MiniMax and Kimi have no primary executor of their own; they resolve to cli-opencode. The resolver must not leave them unresolved or route them to sk-code.

### Error Scenarios
- If the full 193-row corpus scan SIGBUSes on a native ABI mismatch, capture the baseline via scoped scans after `rebuild-native-modules.sh` rather than abandoning the re-baseline.
- If the WS6 embedding provider is missing, the ablation fails on skip rather than silently reporting an unproven keep-vs-drop verdict.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | The shared scorer is touched by six workstreams plus a cross-hub vocab change; ≥500 LOC including tests and fixtures |
| Risk | 20/25 | Root arithmetic change to the fusion/clamp path affects every route; gated on a live lane and a re-baseline |
| Research | 14/20 | Two GPT-5.5 research rounds (diagnosis + fix design) already pair 1:1; the WS6 keep-vs-drop verdict remains an experiment |
| **Total** | **56/70** | **Level 2 (high end)** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- **WS1 Design A vs B** — start with post-cap demotion (Design A); the decision to escalate to a first-class disambiguation channel (Design B) is pending the corpus re-run evidence, specifically whether the scorer must rank by negative evidence rather than merely suppress it.
- **Regression rule survival** — how many of the five named parity regressions self-resolve under WS1's new arithmetic is unknown until the post-WS1 re-run; only survivors get hand-written rules.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Design input**: `research/scorer-fix-recommendation.md` (verbatim copy of the two-round GPT-5.5 synthesis that defines WS1–WS6)
- **Plan**: `plan.md` · **Tasks**: `tasks.md` · **Checklist**: `checklist.md` · **Implementation Summary**: `implementation-summary.md`
- **Parent**: `../spec.md` (`system-skill-advisor` phase parent)
- **Layer 1 predecessor**: packet 024 (`skilled-agent-orchestration/124-sk-code-parent/024-sk-code-advisor-routing-and-discovery`), commits `ec014f95c6` + `852ee387cc`

<!-- /ANCHOR:related-docs -->
