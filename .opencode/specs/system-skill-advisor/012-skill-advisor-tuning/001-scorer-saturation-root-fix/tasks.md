---
title: "Tasks: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab"
description: "Forward-looking task list for the shared advisor-scorer saturation-class root fix and Layer 1b projection vocabulary, sequenced by leverage: re-baseline, WS3 ledger, WS1 post-cap demotion + corpus re-run, WS2 executor resolver, WS4/WS5/WS6, verification."
trigger_phrases:
  - "advisor scorer root fix tasks"
  - "post-cap demotion tasks"
  - "executor delegation resolver tasks"
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
# Tasks: Advisor-Scorer Saturation-Class Root Fix (WS1–WS6) + Advisor Projection Vocab

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Readiness: unblock, re-baseline, and make the parity gate honest before touching scorer arithmetic._

- [B] T001 Confirm the advisor-TS lane stood down [small] — the 009 dispatch-hardening + 40-iteration alignment audit must be quiet before touching `lib/scorer/*.ts`
- [ ] T002 Land Layer 1b vocab on sk-code [medium] — add `code audit`, `code review loop`, `findings-first review`, `release readiness`, `audit`, `findings`, `security`, `correctness` to graph-metadata + SKILL frontmatter
- [ ] T003 Land Layer 1b vocab on deep-loop-workflows [small] — drop bare `code audit` and `severity weighted findings`; keep loop/convergence identity
- [ ] T004 Capture a fresh 193-row baseline [medium] — PID-scoped native rebuild via `rebuild-native-modules.sh` if the corpus scan SIGBUSes; record tsCorrect, pythonCorrect, regressions, holdout
- [ ] T005 WS3 ledger the five named regressions [medium] — rr-iter2-016, rr-iter2-060, rr-iter3-093, rr-iter3-100, rr-iter3-104 recorded as reviewed-accepted (or confirmed preserved)
- [ ] T006 WS3 rename the legacy "197-prompt" suite to 193 [small] — align the suite name with the real corpus size
- [ ] T007 WS3 keep force-local parity in CI and re-point evaluation to SQLite/source metadata [medium] — native-first delegation must not mask fallback drift; stop evaluating against the diagnostic `skill-graph.json`

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_The scorer code: root demotion first, then the executor resolver, then the isolated correctness and hardening gaps._

- [ ] T008 WS1 implement Design A post-cap demotion [large] — `score = Math.max(0, Math.min(supportScore, 1) + demotionScore)` in `explicit.ts`; stop `fusion.ts` flooring net-negative evidence
- [ ] T009 WS1 add the verbose-saturation fixture set [medium] — cli-opencode, colon review loop, webflow CMS, benchmark-mode; assert topSkill + demoted candidate contribution
- [ ] T010 [B] WS1 escalate to Design B only if required [medium] — first-class `disambiguationPenalty` channel, gated on whether the scorer must rank by negative evidence
- [ ] T011 WS2 create `executor-delegation.ts` [large] — detect delegation verbs (`use`, `delegate to`, `ask`, `run`, `invoke`, `second opinion`) near an executor alias
- [ ] T012 WS2 build the alias table from metadata [medium] — `graph-metadata.json` (`family:'cli'`/`category:'cli-orchestrator'`) + `model_profiles.json`; MiniMax/Kimi resolve to cli-opencode
- [ ] T013 WS2 suppress the archived codex executor and apply the post-fusion override [medium] — load codex as `lifecycleStatus:'archived'` (abstain/redirect, never default-routable); lift the resolved active executor and suppress sk-code re-saturation
- [ ] T014 [P] WS2 add the shared executor-delegation fixture [medium] — consumed by both TS native tests and Python parity
- [ ] T015 WS4 graph-causal visited-guard order [large] — score-first/traversal-second in `graph-causal.ts:84-114`; replace boolean `seen` with `bestPositiveStrengthByTarget`
- [ ] T016 WS5 eval hardening [large] — empirical ambiguity slice from top-2 margins; schema-enforced buckets with review/memory_save/delegation minN + top1; ratcheted baseline; frozen independent holdout ≥60 rows
- [ ] T017 WS6 semantic_shadow prove-or-freeze [large] — restore one deterministic embedding path; paired 193-row ablation + holdout with pinned providerModelId + fail-on-skip; weight stays low until evidence

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Re-run, guard, and prove routing before any promotion._

- [ ] T018 Re-run the 193-row corpus and count self-resolved regressions [medium] — hand-write rules only for regressions that survive WS1's new arithmetic
- [ ] T019 Verify the WS4 seeded repro [small] — α→β conflicts_with w=1 vs enhances w=0.9 no longer lets the weak first edge win
- [ ] T020 Run the robustness guard [medium] — advisor_validate + per-skill = 0, memory-save + read-only-review buckets = 0, no near-tie increase, no UNKNOWN rise
- [ ] T021 Live warm-probe routing check [small] — single-pass audit → sk-code; iterative convergence → deep-loop-workflows; displayed rank matches route

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Ledger and Escalation Decisions

- [ ] T022 Record the WS1 Design A/B decision [small] — Design A shipped; Design B escalation taken only if ranking by negative evidence is required, with the re-run evidence cited
- [ ] T023 Finalize the divergence ledger [medium] — any parity regression that did not self-resolve is documented reviewed-accepted with rationale

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:phase-5 -->
## Phase 5: Verification and Documentation

- [ ] T024 Record verification evidence in checklist.md [small] — mark each CHK item with real gate output once the work executes
- [ ] T025 Record Files Changed, Verification, and Deviations in implementation-summary.md [medium] — fresh baseline numbers, fixture results, robustness-guard output, warm-probe result
- [ ] T026 Run `validate.sh --strict` and reconcile completion metadata [small] — spec status, checklist, and continuity agree before any completion claim

<!-- /ANCHOR:phase-5 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] WS1 post-cap demotion survives clamp headroom and fusion; verbose-saturation fixtures pass.
- [ ] WS2 resolver replaces the inline regex and routes executors from metadata with a post-fusion override.
- [ ] WS3 parity gate is honest and green (regressions ledgered/preserved; suite renamed; SQLite/source-evaluated).
- [ ] WS4/WS5/WS6 land and the robustness guard is clean.
- [ ] Layer 1b vocab lands on both hubs and the live warm-probe routes correctly.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Design input**: See `research/scorer-fix-recommendation.md`

<!-- /ANCHOR:cross-refs -->
