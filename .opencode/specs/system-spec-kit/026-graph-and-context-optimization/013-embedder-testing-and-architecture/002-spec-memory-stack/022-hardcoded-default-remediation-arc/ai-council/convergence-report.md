# AI Council Convergence Report — Round 001

**Topic:** Execution strategy for remaining 8 phases (002b–010) + convergence of 022-hardcoded-default-remediation-arc.

**Council composition:** 5 seats (RISK-AVERSE, VELOCITY, ARCHITECTURE, FAILURE-MODE, OPERATIONAL). All deliberated inline via sequential_thinking MCP on deepseek-v4-pro.

**Convergence status:** CONVERGED on all 6 deliberation questions.

---

## Adjudicator Verdicts

### Q1: Phase Ordering

**Verdict: 002b → 003 → 004 → 005 → 007 → 006 → 008 → 009 → 010**

OPERATIONAL's executor-batched ordering selected as the convergence winner, with VELOCITY support on 004-early and FAILURE-MODE support on detection chain integration.

**Rationale for this order:**
- **002b + 003 (devin, light):** Momentum phases. 002b closes the 002 deferral (4 P0 reranker doc corrections verified against Qwen3 footprint). 003 resolves the `.codex/agents/` investigation (1 P0 structural). Both ≤60 min, low risk.
- **004 + 005 + 007 (opencode, heavy block):** Executor continuity — one `cli-opencode/SKILL.md` read, one credit check, 3 dispatches with consistent CRAFT framework. 004 closes 14 P0 (largest cluster), 005 extends registry pattern, 007 extracts config-defaults. Logical progression: contract pattern → registry extension → config extraction.
- **006 + 008 + 009 (devin, cleanup):** Lighter phases after heavy opencode work. Python dedup, shell config consolidation, cascade thresholds.
- **010 (devin, governance):** Final phase — ADR writing + doc validator. Depends on 004 (ADR-A references "post phase 004 ship"). Single operator-approval gate at ADR-B.

**Rejected alternatives:**
- RISK-AVERSE (002b→003→006→008→009→005→004→007→010): delays 14 P0 too long (5 extra phases).
- VELOCITY (original plan order): 4 executor switches waste operator time.
- ARCHITECTURE (005+007 before 004): unnecessary prerequisite — plan already defines patterns.
- FAILURE-MODE (devin phases first): overcautious — dispatch reliability verified by preflight checklist.

**Dissent:** RISK-AVERSE flags that 004 at position 3 means the largest blast-radius phase ships early — if it fails, 5 prior phases (002b+003+004's own work) are at risk. Mitigation: 004 dispatches as ONE atomic call with internal wave gating; if it fails, git revert is clean.

---

### Q2: cli-opencode Dispatch Risk for Phase 004

**Verdict: ONE atomic call with internal wave gating + mandatory per-wave verification in prompt.**

The council split 2-2-1 on 1-call vs 4-call. The adjudicator resolves with a hybrid:

- **Dispatch:** ONE `opencode run` command. Operator simplicity, no 4x dispatch overhead.
- **Internal gating:** Prompt BUNDLE GATE language enforces: "After each wave: run typecheck + vitest + ban-list grep. HALT if any wave fails. Do not proceed to next wave."
- **Observability:** Output log shows per-wave verification results. If wave 3 fails, operator sees it and can redispatch with adjusted prompt.
- **Rollback safety:** If atomic call fails, git revert is clean. The prompt instructs the executor to NOT delete previous waves' changes on wave failure (preserve on disk for operator inspection).

**Merged preflight checklist (all seats' contributions):**
1. Kill zombie opencode-go processes: `pkill -f opencode-go` (FAILURE-MODE)
2. Verify Mac memory: `ps aux | awk '{sum+=$6} END {print sum/1024 " MB of RSS"}'` — flag if > 8GB (FAILURE-MODE)
3. Verify opencode credit: `opencode providers list` (RISK-AVERSE)
4. Clear `/tmp` artifacts from prior phases (OPERATIONAL)
5. Read `cli-opencode/SKILL.md` §4 — once per executor batch (OPERATIONAL)
6. Read current `SKILL_ADVISOR_COMPAT_CONTRACT` definition + `ENV_REFERENCE.md` existing env vars (ARCHITECTURE)
7. `npm run typecheck:root` → exit 0 baseline (VELOCITY)
8. sequential_thinking ≥ 5 thoughts before prompt composition (per cli-devin SKILL.md §4)
9. Compose prompt via sk-prompt (CRAFT/TIDD-EC), CLEAR ≥ 40/50
10. Write prompt to `/tmp/004-prompt.md`, dispatch in background
11. Note PID, set 3hr timer

**Abort signal per dispatch:**
- git diff shows 0 files changed (silent revert / nothing done)
- git diff shows files outside declared scope (hallucination)
- Per-wave typecheck or vitest exits ≠ 0
- Per-wave ban-list grep returns >0 hits in production paths

**Rollback contract:** `git restore` on all modified files + `git checkout` on new files. No DB migration, no cascading state.

**Dissent:** FAILURE-MODE maintains that 4 sequential calls would give better per-wave observability. Mitigation accepted: the prompt's per-wave verification reporting in the output log provides equivalent observability.

---

### Q3: ADR-B (ADR-013/014 Amendment) Handling

**Verdict: Option (a) — In-place edit with mandatory backup + diff verification + operator approval gate.**

The council split three ways. Adjudicator resolves for option (a) with FAILURE-MODE's safeguards.

**Protocol:**
1. **Pre-edit:** `cp 004-spec-memory-embedder-bake-off/decision-record.md 004-spec-memory-embedder-bake-off/decision-record.md.pre-amendment`
2. **Edit:** Append amendment section with header: "Amendment (2026-05-23): Verification Clause — This section supersedes §[X] of ADR-013 and §[Y] of ADR-014."
3. **Amendment content:** "No inline model-name default string in any TS/Python file under `.opencode/skills/` shall contradict registry MANIFESTS canonical entries. An invariant test shall assert `profile.ts` and all provider files derive model names from registry. Future model-change audits MUST grep for BOTH `DEFAULT = '...'` AND `|| '...'` patterns."
4. **Post-edit:** `diff decision-record.md decision-record.md.pre-amendment` must show ONLY the amendment section as changed.
5. **Any other change detected → REVERT immediately.**
6. **Operator approval:** Single yes/no question before phase 010 dispatch.

**Why (a) over (b) or (c):**
- (b) Supersession: Creates "which document is authoritative" confusion. The arc is REDUCING governance fragmentation, not adding to it.
- (c) Separate amendment: Splits the verification contract across 3 documents. Both ADR-013 and ADR-014 need the amendment — a single in-place addition is cleaner than cross-references.
- (a) In-place edit: Keeps governance in one discoverable location. The backup + diff safeguard guarantees zero corruption. Git history preserves the original text forever.

**Dissent:** ARCHITECTURE prefers separate amendment (c) to preserve shipped-ADR immutability. Philosophical preference noted; adjudicator overrules for operational simplicity. VELOCITY prefers supersession (b); overruled for governance consolidation.

---

### Q4: Convergence Gate Strength

**Verdict: Add all three proposed additions + cross-ADR consistency check.**

1. **memory_index_scan + code_graph_scan refresh** — 10+ new spec folders, 11 new test files, 4 new ADRs must be discoverable by memory_search.
2. **Stale memory entry update** — `project_2026_05_19_cocoindex_arc_shipped.md` says jina-reranker-v3 is production default; phase 002 discovered Qwen3-Reranker-0.6B is actual. Fix this or future auditors repeat the confusion.
3. **validate-doc-model-refs.js dry-run against ALL changed docs** — the arc's own invariant test. Running against full doc set proves all doc-drift findings are closed.
4. **Cross-ADR consistency check** — Read all 4 ADRs side-by-side at convergence. Verify ADR-A (threshold governance) does not conflict with ADR-C (profile.ts scope). Verify ADR-D (doc validator) does not claim coverage that ADR-A delegates.

**Unanimous on (1)-(3). (4) added from ARCHITECTURE — all seats concur on review.**

---

### Q5: Failure-Mode Plan

**Verdict: Merged hybrid — phase-level rollback with file-aware detection.**

**Rollback:** Phase-level via `git revert <phase-commit>` (OPERATIONAL: simple rule). If single file drifts and operator wants surgical restore: `git restore <specific-file>` (FAILURE-MODE: file-aware option).

**State-of-truth hierarchy:**
1. Git index (`git diff --stat`) — what's actually on disk (primary)
2. spec.md status table — what operator intended (secondary)
3. Continuity frontmatter — what the agent claims (tertiary, authoritative only when in sync with git)

If these disagree: git wins. Code on disk is what runs.

**Detection chain (4 mandatory checks after EACH phase):**
1. `npm run typecheck:root` → exit 0
2. vitest run on phase's new test files → all pass
3. `rg` ban-list grep for the audit pattern the phase was supposed to fix → 0 hits in production paths
4. `git diff --stat` vs phase commit's claimed files → match

**Partial revert detection BEFORE next phase scaffolds:**
- Phase 002b writes `Qwen/Qwen3-Reranker-0.6B` in 4 doc files. Before phase 003 dispatch: `rg "BAAI/bge-reranker-v2-m3" .opencode/skills/mcp-coco-index/` → must be 0 hits.
- Phase 004 wave 1 imports from `SKILL_ADVISOR_COMPAT_CONTRACT`. Before phase 005 dispatch: `rg -n "['\"]?? *0\.8|['\"]?? *0\.35" scorer/ routing/ policy/ prompt-cache.ts subprocess.ts` → must be 0 hits (only contract.ts may contain these values).
- Each subsequent phase re-runs the ban-list grep of ALL prior phases. If a revert happened, it's caught.

---

### Q6: Phase 004 Wave-1 Split

**Verdict: FALLBACK, NOT DEFAULT. Keep 004 as one phase. Split only if wave 2 scope creeps during dispatch.**

**Rationale:**
- The arc plan already specifies 10 phases. Pre-splitting 004 into 004a+004b adds operational overhead (11 phases = more spec folders, commits, summaries) for a hypothetical risk.
- The prompt's BUNDLE GATE enforces "HALT if any wave fails." If wave 2 causes scope creep during dispatch, the operator:
  1. Reads the output log to understand what went wrong
  2. Runs `git diff --stat` to see what wave 1 wrote
  3. If wave 1's changes are correct: commit them as 004a (wave 1 partial ship)
  4. Adjust the plan: rename waves 2-4 to 004b
  5. Redispatch 004b with adjusted prompt

**If split becomes necessary:**
- **004a** = wave 1 only: Consolidate 6 inline 0.8/0.35 sites → import from `SKILL_ADVISOR_COMPAT_CONTRACT`. 14 P0 closed.
- **004b** = waves 2-4: Complete RoutingCalibration interface + wire env-var overrides + externalize prompt-policy. 9 P1 + 2 P2 closed.
- **004b's verification gate MUST re-run 004a's ban-list test:** `rg` for inline `0.8`/`0.35` in production paths → 0 hits. If 004b's wave 3 silently reverts 004a's changes, this catches it.
- **Risk class for 004a alone:** VERY LOW — pure mechanical refactor (replace inline literal with import), no behavior change, import target already exists.
- **Risk class for 004b:** MEDIUM — interface expansion + env-var wiring touches tuned constants; bench-diff recommended.

---

## Council Composition & Scores

| Seat | Strategy Lens | Pre-Critique | Post-Critique | Key Contribution |
|---|---|---|---|---|
| FAILURE-MODE | Detection + recovery | 89 | **88** | Preflight checklist, 4-point detection chain, silent-failure modes surfaced |
| OPERATIONAL | Repeatable dispatch | 87 | **88** | Executor-batched ordering (adopted), simple rollback rules |
| ARCHITECTURE | Interface design | 86 | **85** | Cross-ADR consistency check, amendment header pattern |
| VELOCITY | Speed to close | 81 | **83** | Rebuttal to P0 deferral, atomic dispatch defense |
| RISK-AVERSE | Blast-radius safety | 84 | **82** | Four-call dispatch argument (partial adoption), phase-level rollback |

## Convergence Quality

- **Agreement ratio:** 6/6 questions converged with adjudicator verdict
- **Agreement strength:** Strong on Q1 (clear ordering winner), Q4 (unanimous), Q5 (merged all), Q6 (clear consensus). Moderate on Q2 (hybrid bridges split). Moderate on Q3 (ADR-B — 2/5 seats philosophically dissent but accept verdict).
- **Dissent flagged:** YES — ARCHITECTURE maintains separate-amendment preference for ADR-B (philosophical, not blocking). FAILURE-MODE maintains 4-call preference for observability (accepted mitigation via per-wave verification in prompt).
- **Convergence score:** 0.82 (high — majority agreement on all questions, dissent is philosophical not execution-blocking)

## Recommended Plan Confidence: 82%

- **Execution feasibility:** High — ordering is proven by phase 001/002 precedent, executor batching reduces operator fatigue.
- **Risk coverage:** High — FAILURE-MODE's contributions (preflight, detection chain, silent-failure modes) are integrated.
- **Governance:** Moderate — ADR-B in-place edit is a judgment call with philosophical dissent; operator approval gate mitigates.
- **Unknowns:** Medium — cli-opencode + deepseek-v4-pro MAC memory pressure is unproven on this Mac; phase 003 investigation may downgrade scope.
