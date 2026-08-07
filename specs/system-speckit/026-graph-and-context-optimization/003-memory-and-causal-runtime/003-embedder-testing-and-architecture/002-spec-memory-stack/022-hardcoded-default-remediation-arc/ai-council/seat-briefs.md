# AI Council Seat Briefs — Round 001

**Topic:** Execution strategy for remaining 8 phases (002b–010) + convergence of 022-hardcoded-default-remediation-arc.

---

## Seat 001: RISK-AVERSE (Temperature: 0.1)

**Mandate:** Smallest blast radius per phase; accept more phases for safer rollback.

### Q1 — Phase Ordering

**Recommendation:** 002b → 003 → 006 → 008 → 009 → 005 → 004 → 007 → 010

**Rationale:** Defer the heaviest phase (004, 14 P0, 2-4hr) to position 7 so the Mac has established dispatch rhythm and the operator has proven 6 lighter phases first. 010 stays last (governance cleanup, single operator-approval gate). 005 and 007 act as cli-opencode warmup before the BIG 004. Trade-off: delays closing 14 P0 findings by ~4-5 extra hours, but risk is distributed — if 004 fails, only 3 prior phases need rollback instead of 7.

### Q2 — cli-opencode Dispatch Risk

**Recommendation:** FOUR sequential calls for phase 004 waves.

**Rationale:** Each wave is independently rollback-able. If wave 3 silently reverts wave 1's changes, the git diff between waves isolates the failure. One atomic 4-wave call is a single 2-4hr failure domain.

**Preflight checklist:**
1. `opencode providers list` (credit check)
2. Clear `/tmp/<phase>-prompt.md` and `/tmp/<phase>-out.log`
3. Read `cli-opencode/SKILL.md` §4
4. sequential_thinking ≥ 5 thoughts
5. Compose via sk-prompt (CRAFT/TIDD-EC), CLEAR ≥ 40/50
6. Dispatch in background

**Abort signal:** git diff shows 0 files changed OR files outside declared scope. Rollback: `git restore` on all modified files.

### Q3 — ADR-B Handling

**Recommendation:** Option (a) — In-place edit with explicit amendment header: "ADR-013/014, Version 2.0, Amended 2026-05-23: Verification Clause." Git history preserves the original text. Operator approval gate before phase 010 dispatch.

### Q4 — Convergence Gate

**Recommendation:** Add all three proposed additions: memory_index_scan + code_graph_scan refresh, stale memory entry update (`project_2026_05_19_cocoindex_arc_shipped.md`), validate-doc-model-refs.js dry-run against ALL changed docs.

### Q5 — Failure-Mode Plan

- **Rollback:** Phase-level via `git revert` on phase commit.
- **State-of-truth:** Git index primary, spec.md status secondary, continuity tertiary.
- **Detection:** `git diff --stat` vs phase commit; files in implementation-summary.md must match git.

### Q6 — Phase 004 Wave Split

**Recommendation:** Split 004 into 004a (wave 1 only, 14 P0) + 004b (waves 2-4). Gives clean checkpoint after critical fix. Risk class: LOW — wave 1 is pure mechanical refactor.

**Confidence:** 85

---

## Seat 002: VELOCITY (Temperature: 0.3)

**Mandate:** Close findings fastest; accept larger atomic phases when bundle-gate is solid.

### Q1 — Phase Ordering

**Recommendation:** Plan order AS-IS: 002b → 003 → 004 → 005 → 006 → 007 → 008 → 009 → 010

**Rationale:** Phase 004 (14 P0) ships IMMEDIATELY after 003. Every hour 004 is deferred is an hour 14 P0 remain unfixed. Deferring the highest-value phase means risk from OTHER phases accumulates before you reach it. Phase 005 logically builds on 004's contract work — same executor, same subsystem family. Trade-off: accepts executor context-switching overhead to close findings faster.

### Q2 — cli-opencode Dispatch Risk

**Recommendation:** ONE atomic call for waves 1-4.

**Rationale:** Four waves share file context — one call is more token-efficient. Verification gates enforced by prompt BUNDLE GATE, not operator-split dispatches. Four dispatches = ~40 min overhead, and each dispatch has its own failure surface (credit check failure, API rate limit).

**Additional preflight:** `npm run typecheck:root` → exit 0 BEFORE dispatch (baseline health check).

### Q3 — ADR-B Handling

**Recommendation:** Option (b) — New ADR-015 superseding ADR-013/014.

**Rationale:** In-place edit of shipped ADR is a governance anti-pattern. Shipped means read-only. ADR-015 with "Supersedes: ADR-013, ADR-014" header is discoverable. Both old ADRs gain "Superseded by: ADR-015" footer. Preserves audit trail perfectly.

### Q4 — Convergence Gate

**Recommendation:** Add all three. The arc's success criteria include "zero re-grep hits" — stale memory entry is a re-grep hit by different means.

### Q5 — Failure-Mode Plan

- **Rollback:** File-level for small phases (≤5 files modified), phase-level for large (004, 005, 007, 010).
- **State-of-truth:** Git index primary.
- **Detection:** `git diff --stat` vs commit.

### Q6 — Phase 004 Wave Split

**Recommendation:** Fallback only — ship wave 1 as partial 004 if wave 2 scope creeps. Risk class: LOW.

**Confidence:** 75

---

## Seat 003: ARCHITECTURE (Temperature: 0.2)

**Mandate:** Proper interface design; RoutingCalibration completeness; ADR governance.

### Q1 — Phase Ordering

**Recommendation:** 002b → 003 → 005 → 007 → 004 → 006 → 008 → 009 → 010

**Rationale:** Phases 005 (registry consolidation) and 007 (code-graph config extraction) are ARCHITECTURAL PREREQUISITES for 004: 005 establishes the "all constants derive from registry" pattern; 007 establishes the config-object pattern. Phase 004 wave 2 (RoutingCalibration completion) should CONFORM to these patterns rather than INVENTING them. Doing 005+007 first means 004 builds on established architecture. Trade-off: delays 14 P0 closure by ~4-5 hours but produces cleaner interfaces.

### Q2 — cli-opencode Dispatch Risk

**Recommendation:** ONE atomic call, but with internal wave gating for interface consistency.

**Rationale:** All 4 waves modify the same interface space. Splitting across dispatches risks inconsistent interface design. One call ensures all waves see the same file state. ARCHITECTURE addition to preflight: read current SKILL_ADVISOR_COMPAT_CONTRACT definition and ENV_REFERENCE.md existing env-var naming conventions BEFORE dispatch to ensure SPECKIT_ADVISOR_* naming aligns.

### Q3 — ADR-B Handling

**Recommendation:** Option (c) — Separate "verification clause amendment" ADR referencing 013/014 without editing.

**Rationale:** ADR-013/014 are SHIPPED architecture decisions. Editing post-ship undermines the very governance the arc is establishing. A separate amendment ADR preserves immutability of shipped decisions while adding the verification requirement. ADR-013/014 remain "accepted, verified-by-ADR-015."

### Q4 — Convergence Gate

**Recommendation:** Add all three, PLUS (d): cross-ADR consistency check — read all 4 ADRs side-by-side to verify no contradictions. ADR-A (threshold governance) must not conflict with ADR-C (profile.ts scope).

### Q5 — Failure-Mode Plan

- **Rollback:** Arc-level for architectural refactors (004/005/007 share registry.ts + contract.ts), file-level for mechanical edits.
- **State-of-truth:** spec.md status table (authoritative for "what shipped"), git index (for "what's on disk"), continuity (for "what's next").
- **Detection:** Cross-reference spec.md status table vs git log.

### Q6 — Phase 004 Wave Split

**Recommendation:** PRE-SPLIT by default: 004a (wave 1: mechanical consolidation) + 004b (waves 2-4: interface design). Different work types with different risk profiles should be different phases. Risk class: VERY LOW for 004a (pure refactor, no behavior change).

**Confidence:** 82

---

## Seat 004: FAILURE-MODE (Temperature: 0.2)

**Mandate:** Detection + recovery; surface silent-failure modes before they happen.

### Q1 — Phase Ordering

**Recommendation:** 002b → 003 → 006 → 008 → 009 → 005 → 007 → 004 → 010 (INTERLEAVED by executor)

**Rationale:** Surfacing silent dispatch failures EARLY. Cli-devin phases first (002b+003+006+008+009) to test dispatch reliability on the Mac before committing to cli-opencode deepseek-v4-pro. If cli-devin silently fails on 003, we catch it before spending 2-4hr on a deepseek dispatch with the same root cause (Mac resource contention). Identified 3 concrete silent-failure modes: Mac memory pressure causing opencode-go OOM, 002b writing wrong reranker model name without disk footprint verification, phase 010 validator false negatives from too-tight regex.

### Q2 — cli-opencode Dispatch Risk

**Recommendation:** FOUR sequential calls. Each wave modifies different file clusters — with isolated diffs, operator can verify wave 1's changes persist through wave 3.

**Additional preflight (FAILURE-MODE unique):**
- Kill zombie opencode-go processes: `pkill -f opencode-go`
- Verify RSS < 4GB before dispatch
- Verify `/tmp` has ≥ 1GB free
- Post-dispatch: `git diff <file>` must show ONLY expected changes

### Q3 — ADR-B Handling

**Recommendation:** Option (a) with mandatory pre-edit backup.

**Rationale:** `cp decision-record.md decision-record.md.pre-amendment` before edit. Post-edit: `diff` must show ONLY the amendment section changed. Any other change → revert immediately. Compromise: option (a) for governance simplicity but with FAILURE-MODE protection against corruption.

### Q4 — Convergence Gate

**Recommendation:** Add all three, PLUS (d): run `npm run typecheck:root` AFTER convergence (not just per-phase — bash→TS dependencies like sidecar-config.sh env var name changes could break typecheck).

### Q5 — Failure-Mode Plan (detailed)

- **Rollback:** File-level with phase-scope awareness. 1 file wrong → restore file. 3+ files wrong → phase rollback.
- **State-of-truth:** `git log --oneline -1` + `git diff --stat` + spec.md status MUST agree.
- **Detection chain (4 checks after each phase):**
  1. `npm run typecheck:root`
  2. vitest run on new test files
  3. `rg` ban-list grep for audit pattern
  4. `git diff --stat` vs claimed files

### Q6 — Phase 004 Wave Split

**Recommendation:** Wave 1 CAN ship as partial 004 but with mitigation: 004b's verification gate MUST re-run 004a's ban-list test. If 004b's wave 3 silently reverts 004a's changes, ban-list test catches it.

**Confidence:** 88

---

## Seat 005: OPERATIONAL (Temperature: 0.3)

**Mandate:** Repeatable dispatch pattern; reduce per-phase cognitive load for human operator.

### Q1 — Phase Ordering

**Recommendation:** 002b → 003 → 004 → 005 → 007 → 006 → 008 → 009 → 010 (GROUP BY EXECUTOR)

**Rationale:** The original plan has 4 executor switches (devin→opencode→devin→opencode→devin). This ordering reduces to 2 switches (devin→opencode at 003→004, opencode→devin at 007→006). Each switch costs ~5-10 min (re-read SKILL.md, re-verify credit, re-compose prompt in right framework). Saves ~15-20 min overhead. Batch 1: 002b+003 (devin, light). Batch 2: 004+005+007 (opencode, heavy). Batch 3: 006+008+009+010 (devin, cleanup+governance). 010 after 004 (ADR-A dependency). Trade-off: P0 closure velocity slightly delayed by interleaving 006 into the devin batch, but operational simplicity wins.

### Q2 — cli-opencode Dispatch Risk

**Recommendation:** ONE atomic call. Operator managing 9 phases — 4 separate dispatches for one phase = operational fatigue. Strong BUNDLE GATE language in prompt.

**Operational preflight:** Morning dispatch check: `date`, `uptime`, `free -h`. Note PID, set timer for expected wall-clock.

### Q3 — ADR-B Handling

**Recommendation:** Option (a) — In-place edit. Operator knows ADR-013/014 live in one location. Simple yes/no approval question.

### Q4 — Convergence Gate

**Recommendation:** Add all three. More verification at convergence = less follow-up debugging.

### Q5 — Failure-Mode Plan

- **Rollback:** Phase-level for everything. Simple rule, no exceptions.
- **State-of-truth:** spec.md status table — the one document the operator maintains.
- **Detection:** `bash validate.sh <phase> --strict` before next phase.

### Q6 — Phase 004 Wave Split

**Recommendation:** Keep 004 as one phase. Pre-splitting adds operational overhead (11 phases instead of 10 = more spec folders, commits, summaries). Operator decision at dispatch time if scope creeps.

**Confidence:** 80
