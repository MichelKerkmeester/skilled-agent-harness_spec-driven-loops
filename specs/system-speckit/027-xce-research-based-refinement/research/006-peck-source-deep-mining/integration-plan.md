---
title: "027/006 — Integration & Impact Plan (peck adoptions 009/010/011 + coordination), UX + automation first"
parts: [integration-019-023]
iterations: "019-023 (5, gpt-5.5-fast --variant high, read-only; orchestrator-written)"
session: "2026-06-06-027-peck-source-deep-mining"
status: "integration synthesis — feeds the scaffolded packets 009/010/011 (peck); cross-refs 010 (caura) + 009 (gem-team)"
priorities: "UX and automation are the system's #1 priorities (operator directive)"
---

# Integration & Impact Plan — peck adoptions into spec-kit

How to integrate the peck-derived recommendations (packets **009 verification-discipline**, **010 reviewer-benchmark**, **011 acceptance-coverage-gate**, + coordination into pending 003/004), the **full surface they impact**, and the **UX + automation** design — the operator's top two priorities. Synthesis of integration-research iterations 019-023.

## 1. Integration thesis
1. **Zero new infrastructure.** Every rule plugs into a surface that already exists: completion-freshness + AC coverage ride `validate.sh`/`validator-registry.json`; the 010 benchmark rides **deep-improvement Lane B** (materializer/runner/scorer/report already there); rollout rides the existing `warn→strict` env convention. *(iter 021)*
2. **Automation-first, UX-last.** Ship the invisible automation wins first (freshness check, deep-review-verdict surfacing, validator auto-fix hints); land user-facing blockers last, behind flags + warn-mode. *(iter 023)*
3. **Warn→error graduation, copied from a proven precedent.** `SPECKIT_SAVE_QUALITY_GATE` already does default-on + 14-day warn-only + would-reject logging + persisted activation timestamp — copy it verbatim for freshness + AC coverage. *(iter 022)*
4. **Reuse existing UX surfaces with actionable messages.** Each rule surfaces through `/speckit:complete`, `validate.sh` summary, the deep-review verdict line, or the startup/advisor brief — never a new prompt. *(iter 020)*

## 2. Impact surface (≈40 surfaces — full matrix in `prompts/iteration-019.out`)
Grouped; **UX** = user-facing, **AUTO** = background.

| Cluster | Surfaces | Packet | UX/AUTO |
|---|---|---|---|
| **Completion gate** | `CLAUDE.md` §2 + `AGENTS.md` mirror; `constitutional/verify-before-completion-claims.md`; `/speckit:complete` + `speckit_complete_{auto,confirm}.yaml`; `validate.sh`; `scripts/validation/continuity-freshness.ts`; `mcp_server/lib/validation/spec-doc-structure.ts` (recompute fingerprint) | 009 | UX+AUTO |
| **Validation rules** | `references/validation/validation_rules.md`; `scripts/lib/validator-registry.json` (+ NEW `AC_COVERAGE` rule script); `mcp_server/ENV_REFERENCE.md` (flags) | 009/011 | AUTO |
| **Manifest templates** | `templates/manifest/spec.md.tmpl` (AC-format), `checklist.md.tmpl` (AC table) — **shared with pending 002** | 011 | UX |
| **deep-review** | `deep-review/SKILL.md`; `@deep-review` (+ `.claude` mirror); `deep_start-review-loop_{auto,confirm}.yaml` verdict/legal-stop gates; `manual_testing_playbook` | 009/011 | UX+AUTO |
| **deep-improvement (Lane B)** | `deep-improvement/SKILL.md`; Lane B scripts + model-benchmark assets (NEW reviewer-fixture type + scorer); `/deep:start-model-benchmark-loop` + YAML; `manual_testing_playbook` | 010 | AUTO |
| **sk-code / sk-code-review** | `sk-code/SKILL.md` (escalation gates); `sk-code-review/SKILL.md` + `review_core.md` (numeric note) | 009 | UX |
| **Reviewer/retrieval agents** | `@review`, `@context`, `@deep-research`, `@orchestrate` (+ each `.claude/agents/*` mirror) — read-budget | 009 | UX+AUTO |
| **Hooks / config** | `references/config/hook_system.md`; `references/hooks/skill_advisor_hook.md`; startup/advisor brief; post-mutation UX hook | 009/011 | AUTO |
| **Resume** | `/speckit:resume` + YAML (optional FILES manifest, T13) | optional | UX |

**Runtime-mirror rule:** every `.opencode/agents/*` prompt-contract change needs a `.claude/agents/*` mirror update (or a recorded mirror-lag decision).

## 3. UX integration (per rule — full table in `prompts/iteration-020.out`)
| Rule | Surface to reuse | Message (warn-first, actionable) |
|---|---|---|
| completion-freshness | `/speckit:complete` Step 12 + `validate.sh` summary | "COMPLETION_FRESHNESS: evidence is stale after in-scope edits. Re-run verification, update checklist evidence, retry." + 1 changed file + next command |
| escalation | `/speckit:complete` quality/reviewer gates | "ESCALATION_REQUIRED: impl conflicts with spec. State one-sentence root cause; A) amend spec B) fix impl C) stop." (one consolidated prompt, only after contradiction/3-strike) |
| anti-softening | deep-review verdict line | "VERDICT_LOCK: active P0 ⇒ FAIL. Do not relabel partial/conditional." (exact parseable verdict) |
| reviewer read-budget | `@review`/`@deep-review` budget | "Read reason: verify <X>; not re-reading a new/full file." (non-diff/repeat reads only; P0 rereads exempt) |
| numeric-severity | deep-review report schema | optional advisory `riskScore` field, never a blocker |
| AC coverage | checklist render + validation-rule style | "AC_COVERAGE WARNING: 8/10 ACs have evidence; floor 9/10. Add evidence or mark Manual—infeasible." (lifecycle opt-in) |
| 010 benchmark | deep-improvement Lane B | "REVIEWER_BENCHMARK: fixture stale-verdict expected FAIL, got PASS — rule not safe to promote." |

**Anti-patterns to avoid:** wall-of-errors (aggregate by rule + one top fix) · cryptic failures (every new rule needs `How to Fix` wording) · blocking a fresh scaffold (AC gate honors lifecycle opt-in) · double-prompting (hooks are passive/fail-open) · verdict ambiguity (keep exact PASS/CONDITIONAL/FAIL strings).

## 4. Automation integration (per rule — full table in `prompts/iteration-021.out`)
| Rule | Class | Wiring (reuse existing) | Stays manual |
|---|---|---|---|
| completion-freshness | **FULLY-AUTO** | `validate.sh --strict` via strict-only `CONTINUITY_FRESHNESS`; recompute existing continuity fingerprint; optional pre-commit via `SPECKIT_RULES` | legit clock-drift/dirty-tree exceptions |
| AC coverage | **SEMI-AUTO** | new `AC_COVERAGE` in `validator-registry.json` (warn→error); auto-counts ACs + parses evidence | AC→test semantic classification (reviewer) |
| 010 benchmark | **SEMI-AUTO** | deep-improvement **Lane B** (existing runner/scorer/report) + existing pre-commit/CI prompt-drift gate for reviewer-prompt PRs | live-LLM reviewer runs (opt-in/nightly) |
| escalation / anti-softening / read-budget | **SEMI-AUTO** | auto-detect via loop-state + structured-verdict-field enforcement | "same symptom" / root-cause adequacy / prose softening / read-rationale quality |

**Reuse, don't invent:** `validate.sh` registry loader + strict TS-validator seam · staged-file pre-commit trigger · CI prompt-card-sync/comment-hygiene gate model · post-mutation UX hook · deep-review `warn→strict` env rollout.

## 5. Phased rollout (full table in `prompts/iteration-022.out`)
| Phase | Ships | Gate-to-next | Flag(s) |
|---|---|---|---|
| 0 | Land pending **001/002-self-check-templates** OR lock one shared-template edit window | fresh scaffold passes strict | — |
| 1 | **010** reviewer test-bench | fixtures cover stale-verdict/softened-Fail/over-read/AC | `SPECKIT_REVIEWER_BENCHMARKS` |
| 2 | **009** WARN mode (freshness + escalation + anti-softening + read-budget + numeric-note) | 010 regressions green | `SPECKIT_COMPLETION_FRESHNESS=true`, `..._ENFORCE=false` |
| 3 | **011** phases 1-2 (AC-format + traceability table) | new scaffolds render w/o strict regressions | `SPECKIT_AC_TRACEABILITY_TEMPLATE` |
| 4 | `AC_COVERAGE` WARNING (floor 0.9, L2+/lifecycle-opt-in) | acceptable warn volume, no false ERRORs | `SPECKIT_AC_COVERAGE=true`, `..._ENFORCE=false`, `..._FLOOR=0.9` |
| 5 | Promote freshness + `AC_COVERAGE` to ERROR | warn window expires + fixtures green | flip `..._ENFORCE=true`, rollback via `..._=false` |

**Precedent to copy verbatim:** `SPECKIT_SAVE_QUALITY_GATE` (default-on, 14-day warn-only, would-reject logging, persisted activation timestamp — `save-quality-gate.ts:12-272`).

## 6. UX + automation priorities (ship-rank — full scorecard in `prompts/iteration-023.out`)
**Ship first (low-friction / high-automation / high-value):** ① T6 completion-freshness · ② 010 benchmark · ③ T7 anti-softening · ④ 011 deep-review verdict binding. **Then:** AC_COVERAGE warn · AC-format · AC table · escalation · T12 cap+recurrence · T13 manifest · T14 narrative · read-budget. **Defer:** 011 ERROR promotion, T9 numeric note (docs-only), T11 cheap-model preset, T12(c) prune lifecycle.

**Net-new UX/automation opportunities (added as first-class requirements in 009/011):**
1. **Validator auto-fix hints** — `fix:` lines in failures + JSON so `/speckit:complete` shows "run this / edit this".
2. **Startup/brief freshness + AC indicator** — `completion-freshness: stale|fresh` + `AC coverage: n/m` in the startup/advisor brief (fail-open).
3. **Auto-generate AC stubs** from the `Requirement | Acceptance Criteria` table (no blank authoring).
4. **One-command "refresh completion fingerprint"** helper.
5. **Single deep-review verdict in `/speckit:complete`** Step-12 summary (`reviewVerdict: …`).
6. **Checklist evidence quick-fill** from changed files + test output.

## 7. Mapping to scaffolded packets
- **009-peck-verification-discipline** (L3): completion-freshness (anchor) + escalation + anti-softening + read-budget + numeric-note. Carries net-new opportunities #1, #2, #4, #5, #6. Depends on 010. Coordinates with pending 002 (templates) only indirectly.
- **010-reviewer-prompt-benchmark-substrate** (L2-3): the reviewer-fixture type + scorer in Lane B. **Land first.**
- **011-acceptance-coverage-gate** (L3): AC-format norm + AC table + `AC_COVERAGE` (warn→error) + deep-review binding + lifecycle opt-in. Carries opportunity #3. Depends on 010 + the pending-002 shared-template window.
- **Coordination (NOT new packets):** T12 cap+recurrence → pending **003/004** notes; T14 current-state/narrative → pending **003** notes.
- **Cross-run:** orthogonal to caura **010** (memory-store hardening) and gem-team **009** (already Spec-Scaffolded).

## 8. References
- Per-iteration evidence: `iterations/iteration-019.md` … `023.md` (+ raw `prompts/iteration-0NN.out`).
- Source recommendations: `sub-packet-proposal.md`, `research.md` (this packet).
- Rollout precedent: `mcp_server/lib/validation/save-quality-gate.ts`; `mcp_server/ENV_REFERENCE.md`.
