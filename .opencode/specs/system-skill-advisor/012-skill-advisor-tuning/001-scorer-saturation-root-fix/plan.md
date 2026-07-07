---
title: "Implementation Plan: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab"
description: "Forward-looking Level 2 plan for the shared advisor-scorer saturation-class root fix and Layer 1b projection vocabulary: leverage-ordered WS3 ledger → WS1 post-cap demotion → corpus re-run → WS2 resolver → WS4 graph-causal → WS5 eval hardening → WS6 semantic ablation, re-baseline first, gated on the live advisor-TS lane."
trigger_phrases:
  - "advisor scorer root fix plan"
  - "post-cap demotion plan"
  - "leverage-ordered workstream plan"
importance_tier: "high"
contextType: "implementation"
status: "Planned"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/001-scorer-saturation-root-fix"
    last_updated_at: "2026-07-06T12:00:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Pre-implementation spec authored"
    next_safe_action: "Await advisor-lane standdown, then execute WS3→WS1→re-run→WS2/4/5/6"
---
# Implementation Plan: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor scorer (`lib/scorer/*.ts`), Python parity harness, JSON eval fixtures/baselines, skill graph-metadata + SKILL frontmatter |
| **Framework** | system-skill-advisor MCP scorer (explicit lane, fusion, graph-causal lane, semantic_shadow lane), 193-row eval corpus, TS↔Python parity gate |
| **Storage** | Repository filesystem under `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/`, advisor graph-metadata for sk-code and deep-loop-workflows, sk-prompt-models `model_profiles.json` |
| **Testing** | `advisor_validate`, 193-row corpus run (`tsCorrect`/`pythonCorrect`/regressions/holdout), verbose-saturation fixtures, executor-delegation fixture (TS + Python parity), graph-causal repro, WS6 paired ablation |

### Overview
This forward-looking plan sequences the shared advisor-scorer root fix by leverage, not by workstream number. The band-aid `-3.0` offsets are a symptom of a pre-clamp penalty class; the fix caps positive support before subtracting demotion (WS1) and resolves executor delegation from metadata with a post-fusion override (WS2), then closes three confirmed correctness/hardening gaps (WS4 graph-causal order, WS5 eval hardening, WS6 semantic ablation). Because two of the five live parity regressions misroute to deep-loop-workflows, the Layer 1b projection vocabulary lands in the same window and a fresh 193-row baseline is captured before any scorer number is compared. The whole packet is GATED behind the live advisor-TS lane standing down.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The live advisor-TS lane (`lib/scorer/*.ts`, the 009 dispatch-hardening + 40-iteration alignment audit) has stood down so edits do not collide.
- [ ] Layer 1b projection vocabulary has landed and a fresh 193-row baseline is captured (self-capture authorized on unblock, PID-scoped native rebuild if the corpus scan SIGBUSes).
- [ ] The five named parity regressions are confirmed against the fresh run (they may shift as the shared corpus/ledger is edited concurrently).
- [ ] Design A (post-cap demotion) is confirmed as the WS1 starting point; Design B stays deferred pending re-run evidence.

### Definition of Done
- [ ] WS1 post-cap demotion channel ships and the verbose-saturation fixtures assert both `topSkill` and the demoted candidate's effective explicit contribution.
- [ ] WS2 `executor-delegation.ts` replaces the inline regex and resolves active executors from metadata + model profiles with a post-fusion override.
- [ ] WS3 parity gate is honest and green: five regressions ledgered or preserved, suite renamed 197→193, force-local in CI, evaluated against SQLite/source metadata.
- [ ] WS4/WS5/WS6 land: graph-causal order fixed, eval gates hardened with a ratcheted baseline + independent holdout, semantic_shadow proven-or-frozen with a pinned-provider ablation.
- [ ] Layer 1b vocab lands on both hubs, drift-guards stay green, and the live warm-probe routes single-pass audit → sk-code and iterative convergence → deep-loop-workflows.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Durable negative evidence over pre-clamp offsets. Positive lane support is capped first, then a demotion is subtracted (WS1), so disambiguation cannot be absorbed by clamp headroom or floored to zero by fusion. Executor delegation moves out of the explicit lane entirely into a post-fusion routing override (WS2) because explicit penalties are pre-clamp and cannot express a routing decision reliably.

### Key Components
- **Explicit lane + fusion**: `lib/scorer/lanes/explicit.ts` and `lib/scorer/fusion.ts` own the clamp and the `Math.max` floor; WS1 rewrites the demotion arithmetic here.
- **Executor-delegation resolver**: a new `lib/scorer/executor-delegation.ts` owns delegation-verb detection, the metadata-built alias table, archived-executor suppression, and the post-fusion override.
- **Graph-causal lane**: `lib/scorer/lanes/graph-causal.ts` owns BFS traversal; WS4 makes it score-first and swaps the boolean visited set for `bestPositiveStrengthByTarget`.
- **Eval harness**: the ambiguity slice, bucket schema, ratcheted baseline, and independent holdout own the promotion gate; WS6's ablation is gated behind this harness.
- **Advisor projection**: sk-code and deep-loop-workflows `graph-metadata.json` (+ sk-code `SKILL.md`) own the single-pass-audit vs iterative-convergence vocabulary split (Layer 1b).

### Data Flow
A prompt fans out to the lanes. WS1 caps each lane's positive support before subtracting any demotion, so a disambiguation penalty survives into fusion instead of being clamped away. Fusion combines lanes without flooring net-negative evidence to zero. After ranked recommendations are built, WS2's resolver applies a post-fusion override: if a delegation verb sits near an executor alias, the resolved active executor is lifted and sk-code re-saturation is suppressed. Graph-causal contributions are accumulated per target by strength (WS4) rather than first-visited-wins. The 193-row corpus, its ambiguity slice, and the frozen holdout score every change, and no weight promotes unless the robustness guard is clean.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Unblock and Re-Baseline
- [ ] Confirm the advisor-TS lane has stood down.
- [ ] Land Layer 1b projection vocabulary on sk-code (graph-metadata + SKILL frontmatter) and deep-loop-workflows (drop the two bare terms).
- [ ] Capture a fresh 193-row baseline (PID-scoped native rebuild if the scan SIGBUSes); record `tsCorrect`, `pythonCorrect`, regressions, and holdout.

### Phase 2: WS3 Ledger (unblock the parity gate honestly)
- [ ] Ledger the five named regressions as reviewed-accepted (or confirm they will be preserved).
- [ ] Rename the legacy "197-prompt" suite to the real 193 and keep force-local parity in CI.
- [ ] Re-point parity evaluation to SQLite/source metadata instead of the diagnostic `skill-graph.json`.

### Phase 3: WS1 Root Demotion Channel, then Corpus Re-Run
- [ ] Implement Design A post-cap demotion: `score = Math.max(0, Math.min(supportScore, 1) + demotionScore)`.
- [ ] Add the verbose-saturation fixture set (cli-opencode, colon review loop, webflow CMS, benchmark-mode).
- [ ] Re-run the 193-row corpus and count how many of the five regressions self-resolve before hand-writing any rules; escalate to Design B only if ranking by negative evidence is required.

### Phase 4: WS2 Executor Resolver (builds on WS1 machinery)
- [ ] Create `executor-delegation.ts`: delegation-verb detection, metadata-built alias table, archived-codex suppression, post-fusion routing override.
- [ ] Add the shared executor-delegation fixture consumed by both TS native tests and Python parity.

### Phase 5: WS4 Graph-Causal, WS5 Eval Hardening, WS6 Semantic Ablation
- [ ] WS4: score-first/traversal-second in graph-causal; `bestPositiveStrengthByTarget` replaces boolean `seen`; verify the seeded repro.
- [ ] WS5: empirical ambiguity slice, schema-enforced buckets with review/memory_save/delegation thresholds, ratcheted baseline, frozen independent holdout ≥60 rows.
- [ ] WS6: restore one deterministic embedding path; run the paired 193-row ablation + holdout with pinned `providerModelId` and fail-on-skip; keep the weight low until evidence justifies otherwise.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Verbose-saturation fixtures | WS1 demotion survival | Native TS scorer fixtures asserting topSkill + demoted contribution |
| Executor-delegation parity | WS2 resolver | Shared fixture across TS native tests and Python parity |
| Corpus re-run | Whole scorer | 193-row run: tsCorrect, pythonCorrect, regressions, holdout |
| Graph-causal repro | WS4 order bug | Seeded α→β conflicts_with w=1 vs enhances w=0.9 |
| Eval harness | WS5 gates | Ambiguity slice, bucket thresholds, ratcheted baseline, independent holdout |
| Ablation | WS6 semantic_shadow | Paired 5-lane vs disabled run + holdout, pinned providerModelId, fail-on-skip |
| Robustness guard | All weight changes | advisor_validate + per-skill/bucket/near-tie/UNKNOWN invariants |
| Live warm-probe | Routing | Single-pass audit → sk-code; iterative convergence → deep-loop-workflows |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Live advisor-TS lane standdown | Internal | GATED | Concurrent edits to `lib/scorer/*.ts` collide with the 009 lane |
| Fresh 193-row re-baseline | Internal | Pending unblock | Scorer deltas are not comparable without it |
| Layer 1b projection vocabulary | Internal | In this packet | Two regressions keep misrouting to deep-loop until it lands |
| sk-prompt-models `model_profiles.json` | Internal | Available | WS2 alias table cannot resolve MiniMax/Kimi to cli-opencode |
| Deterministic embedding path | Internal | Needs restore | WS6 ablation fails on skip rather than proving keep-vs-drop |
| Native module ABI (`rebuild-native-modules.sh`) | Internal | Conditional | Full corpus scan may SIGBUS; scoped scans are the fallback |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the re-run shows net regressions above the fresh baseline, the robustness guard fails, a weight change increases wrong near-ties or UNKNOWN, or the post-fusion override misroutes a live prompt.
- **Procedure**: revert the offending workstream's commit(s) in isolation (each WS is a separate change), restore `explicit.ts`/`fusion.ts`/`graph-causal.ts`/`executor-delegation.ts` and the eval baseline from the branch tip, re-capture the 193-row baseline, and re-run `advisor_validate` plus the robustness guard before re-attempting a narrower change.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Unblock and Re-Baseline | Advisor-TS lane standdown | Every scorer comparison |
| WS3 Ledger | Fresh baseline + confirmed regressions | Honest parity gate for WS1 re-run |
| WS1 + Corpus Re-Run | WS3 ledger, Design A confirmed | WS2 resolver, hand-written regression rules |
| WS2 Executor Resolver | WS1 post-cap machinery | Correct executor-delegation routing |
| WS4/WS5/WS6 | WS1 landed, WS5 harness before WS6 | Final promotion gate |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Unblock and Re-Baseline | Medium | Blocked on external lane; baseline capture may need a native rebuild |
| WS3 Ledger | Medium | Ledger discipline + suite rename + parity source repoint |
| WS1 + Corpus Re-Run | High | Root arithmetic change on the fusion/clamp path; whole-corpus re-run |
| WS2 Executor Resolver | High | New resolver, metadata alias table, post-fusion override, shared fixture |
| WS4/WS5/WS6 | High | Three independent gaps; WS5 harness gates WS6 |
| **Total** | | **High — shared scorer touched by six workstreams plus a cross-hub vocab change, ≥500 LOC including tests** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm the fresh 193-row baseline is captured and stored before any scorer edit.
- [ ] Confirm each workstream lands as an isolated, independently revertible change.
- [ ] Confirm the robustness guard (per-skill = 0, memory-save + read-only-review buckets = 0, no near-tie increase, no UNKNOWN rise) is wired before any weight change.

### Rollback Procedure
1. Revert the offending workstream commit in isolation.
2. Restore `explicit.ts`, `fusion.ts`, `graph-causal.ts`, `executor-delegation.ts`, and `scorer-eval-baseline.json` from the branch tip as needed.
3. Roll back Layer 1b vocab on both hubs only if the projection change is implicated; otherwise leave it.
4. Re-capture the 193-row baseline and re-run `advisor_validate` + the robustness guard before re-promotion.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Filesystem-only revert of TypeScript scorer modules, JSON eval fixtures/baselines, and advisor graph-metadata/SKILL frontmatter; no persisted data migration is involved. The memory daemon/DB is never touched.

<!-- /ANCHOR:enhanced-rollback -->
