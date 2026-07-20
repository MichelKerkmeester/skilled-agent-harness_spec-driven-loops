---
title: "Session Handover: 036 deep-loop-innovation — EXECUTION start (parallel cli-codex SOL)"
description: "The 17-phase implementation-planning tree is authored, validated (125/125 strict), reference-repaired, drift-censused, and pushed to v4. Execution of the 178 recs into the shipped system-deep-loop runtime has NOT started. This handover hands the execution frontier to a fresh agent, optimized for maximal parallelization via cli-codex GPT-5.6-SOL xhigh fast (cli-opencode gpt-5.6-sol-fast fallback)."
trigger_phrases:
  - "resume 036 deep-loop innovation execution"
  - "start implementing the 178 deep-loop recs"
  - "deep-loop innovation execution handover"
  - "parallelize deep-loop implementation cli-codex"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored execution handover + goal.md; census/repairs/coupling all on origin"
    next_safe_action: "Pin isolated worktree off origin tip; pin BASE in 003; run 004/002 triage first"
    blockers: []
    key_files:
      - "goal.md"
      - "spec.md"
      - "execution-sequencing-strategy.md"
      - "018-drift-census-and-plan-revalidation/research/research.md"
    completion_pct: 40
    open_questions:
      - "Right-size 013 after 012's cross-mode closures hoist shared logic?"
      - "Serial-single-writer vs satellite-worktrees-per-mode for 013 — decided in 012"
    answered_questions:
      - "Planning is complete and validated (125/125 strict); execution has not started"
      - "Executor = cli-codex GPT-5.6-SOL xhigh fast primary, cli-opencode gpt-5.6-sol-fast fallback"
      - "BASE pins against current HEAD (247 commits past the plan's 2026-07-16 reference)"
---
# Session Handover — 036 Execution Start

The 17-phase tree is authored, validated, repaired, censused, and on `origin/skilled/v4.0.0.0`. **The next
frontier is EXECUTION: implementing the 178 recs into the shipped `system-deep-loop` runtime, one wave at a
time, maximally parallel, on a pinned BASE.** Read `goal.md` (same folder) for the objective + success
criteria; this doc is the operational how-to.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use this handover when:** starting execution of the 036 implementation program, or resuming it mid-wave.
**Status values:** in_progress
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From:** the authoring + census + repair sessions (2026-07-14 → 2026-07-20).
- **To:** a fresh execution agent that will implement runtime code, wave by wave, in parallel.
- **Phase Completed:** PLANNING + VALIDATION + REFERENCE-REPAIR + DRIFT-CENSUS. All on origin.
- **Not started:** EXECUTION. Every phase 003-017 is `Planned`; 0 implementation-summaries exist; the shipped runtime is untouched by 036.
- **Executor mandate (operator):** maximize parallelization via `cli-codex` GPT-5.6-SOL `xhigh` `fast`; `cli-opencode` `openai/gpt-5.6-sol-fast --variant xhigh` as fallback. Operator has authorized N-parallel dispatch.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 The architecture (read `goal.md` §1 for the full spine)
ONE cross-mode spine: typed append-only event ledger + fail-closed transition-authorization gateway + sealed
artifacts + replay fingerprints + receipts/certificates + blinded adjudication. Landed additive-dark → shadow
parity → per-mode cutover → legacy retirement. **No big-bang swap.**

### 2.2 The execution model: waves + write-set conflict graph

The DAG (`goal.md` §3, `execution-sequencing-strategy.md`) defines **wave boundaries**; within a wave, leaves
that touch disjoint write-sets run **in parallel**. Rules:

- **Critical path is serial:** `003 → 004 → 006 → 007 → 008 → 009 → 010 → 011 → 012 → 013 → 014 → 015 → 016 → 017`.
- **005 runs parallel to 006/007** (dispatch-only, no canonical-persistence change).
- **Inside 007** (7 service leaves — receipts, sealed-artifacts, adjudication, budgets, gauges, locks, continuity): largely independent → parallelize behind the 006 envelope contract.
- **Inside 013** (8 modes × 7 leaves = 56): `004-deep-improvement-common` lands FIRST (owns evaluator/canary/promotion its 3 variants reuse); `002-deep-review` and `008-deep-alignment` are **fenced** (shared review-loop backbone); `001-deep-research` and `003-deep-ai-council` run concurrently. **012/004 emits the write-set conflict graph that is the AUTHORITY for what parallelizes in 013 — build 012 before fanning out 013.**
- **Parallel isolation:** dispatch each concurrent leaf in its own `git worktree` off the pinned BASE, or single-writer-serial where the conflict graph shows a shared write-set. The serial-vs-satellite-worktree choice for 013 is decided in 012 once the graph is known (default: serial-single-writer + serial SOL verify).

### 2.3 Per-phase gate contract (every phase, before handoff)
1. `validate.sh --strict` Errors 0 on the phase folder.
2. A **blocking SOL verifier receipt** bound to the exact commit (SOL read-only review; the phase's `checklist.md` carries the contract).
3. For substrate/mode phases: **shadow parity** vs the 003 BASE proven before anything consuming it runs.
4. Artifacts keyed to BASE so non-regression is by ID + semantics, not count.

### 2.4 Files Modified this session (all on origin)
| File | Change | Status |
| ---- | ------ | ------ |
| `018-drift-census-and-plan-revalidation/**` | New drift-census phase: 2-model census, per-phase verdicts | on origin (`919e093196`) |
| ~400 cross-phase refs across the tree | `065→036`, 006/007 service misattribution, leaf-index+3, kebab paths, ledger phase-ID space, manifest identity | on origin (`919e093196`) |
| `003/spec.md` §6 + `018/research.md` §9 | 020 router-unification coupling record | on origin (`9b037b07c2`) |
| `goal.md`, `handover.md` | This handover + the goal doc | pending commit |

### 2.5 Traps & scar tissue (carry these — they bit this session)
| Trap | Trigger | How to avoid re-paying it |
| ---- | ------- | ------------------------- |
| **Shared working tree gets reset by concurrent sessions** | any in-place rebase/checkout; trusting the working tree to persist | Land every commit via `git merge-tree`/`commit-tree` plumbing on `origin/skilled/v4.0.0.0` tip, path-scoped to `036/`; verify the built tree diff before commit; the working tree is disposable |
| **`xargs -a` is unsupported on macOS (BSD)** | `xargs -a filelist git add` silently no-ops → empty commit | use `tr '\n' '\0' < list \| xargs -0` |
| **Destructive stale-file overwrite** | committing a working-tree file that is an OLDER/truncated copy of origin's | run a gutting check (origin size vs local size) before staging any "edited" file; blob-hash compare, don't trust "modified" flags |
| **`description.json` swallows `--level`** | re-running `generate-description.js` over an existing description merges and drops the level field | `rm -f description.json` first, then regenerate with `--level 2` |
| **Metadata integrity fingerprint drift** | editing a doc without regenerating its `description.json` + `graph-metadata.json` | after content edits, run `generate-description.js --level N` + `backfill-graph-metadata.js` **deepest-first**, then `validate.sh --strict` |
| **opencode fanout stalls at 0% CPU** | dispatched child inherits an enforced spec-gate | set `MK_SPEC_GATE_DISABLED=1 AI_SESSION_CHILD=1` and close stdin `</dev/null` (already wired in `fanout-run.cjs:1789`) |
| **CONTINUITY_FRESHNESS race** | each metadata regen bumps the graph stamp past the continuity stamp | set all continuity `last_updated_at` to now in one pass, THEN regenerate metadata |
| **codex effort flag** | `--reasoning-effort` does not exist | use `-c model_reasoning_effort="xhigh"`; `--search` is top-level (`codex --search exec …`) |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session (the execution agent)

### 3.1 Recommended starting point
- **Cold-read order:** `goal.md` → this `handover.md` → `spec.md` (§PHASE MAP + sequencing invariants) → `execution-sequencing-strategy.md` → `004-architecture-coverage-and-transition-contract/001-spine-architecture-adr/plan.md` (the spine ADR) + `004/002-recommendation-ledger-bijective-map/` (the 178-row ledger).
- **First safe action:** create an isolated worktree off `origin/skilled/v4.0.0.0` tip (`sk-git` lifecycle — ASK operator worktree-vs-branch first); pin that SHA as BASE in phase 003.

### 3.2 Priority order (do NOT start at 013)
1. **Pin BASE (003).** Against current HEAD (247 commits past the plan's reference). Record 020's three shipped commits + all kebab renames as pre-existing baseline (see `003/spec.md` §6). Normalize the 5/7/8 taxonomy from the live `mode-registry.json`. Extend the behavior benchmarks.
2. **Run 004/002 (the 178-row bijective ledger + triage) STANDALONE, FIRST, with authority to defer/reject.** This is the single lever that right-sizes the program — expect 178 to fall well below 100. Freeze the transition vocabulary + event namespace + schema-version policy here, before any writer exists.
3. **Ship 005 early** (18 tasks, off critical path, backward-compatible live-tools unblock — the operator's most-requested capability). It validates the whole execution+dispatch model on a small leaf.
4. Then the critical path in waves: 006 (ledger core + gateway, DARK) → 007 (7 parallel service leaves) → 008 (adapters + shadow parity + rollback) → 009 → 010 → 011 → **012 (emit the write-set conflict graph)** → 013 (parallel per the graph) → 014 → 015 → 016 → 017.

### 3.3 The dispatch pattern (parallel implementation)

**Primary — cli-codex GPT-5.6-SOL xhigh fast (implementation, workspace-write):**
```bash
AI_SESSION_CHILD=1 codex exec \
  --model gpt-5.6-sol -c model_reasoning_effort="xhigh" -c service_tier="fast" \
  -c approval_policy=never --sandbox workspace-write \
  "<leaf brief: GATE-3 PRE-RESOLVED spec folder <path>; implement <leaf> per its plan.md/tasks.md; \
   additive-dark; touch only <write-set from 012 graph>; run validate.sh --strict; emit evidence>" \
  > "$LOG" 2>&1 </dev/null &
CODEX_PID=$!   # capture PID; SIGKILL by captured PID when the leaf returns (never blanket pkill)
```

**Blocking SOL verifier (read-only, per phase — the gate receipt):**
```bash
codex exec --model gpt-5.6-sol -c model_reasoning_effort="xhigh" -c service_tier="fast" \
  -c approval_policy=never --sandbox read-only \
  "Verify <phase> against its checklist.md; confirm additive-dark held, shadow parity green, \
   validate.sh --strict Errors 0; return PASS/FAIL + evidence" > "$RECEIPT" 2>&1 </dev/null
```

**Fallback — cli-opencode gpt-5.6-sol-fast (when codex rate-limits / auth fails):**
```bash
MK_SPEC_GATE_DISABLED=1 AI_SESSION_CHILD=1 opencode run \
  --model openai/gpt-5.6-sol-fast --variant xhigh --format json --dir <REPO_ROOT> \
  "<same brief>" </dev/null
```

**Parallelization rules:**
- Operator has authorized N-parallel; run all leaves of a wave whose write-sets are disjoint (per 012's graph) concurrently, each in its own worktree.
- Capture each dispatch PID at launch; SIGKILL only that PID + its orphan children when it returns; **never** `pkill -9 -f "codex exec"` (kills the operator's sessions too).
- Pre-flight once per session: `command -v codex`; `codex login status`. If not logged in, ASK the operator — never substitute a model.
- Each leaf brief must carry `GATE-3 PRE-RESOLVED: <spec folder>` (the child can't answer Gate 3 non-interactively).

### 3.4 Critical context to load
- [ ] `goal.md` — objective, six problems, success criteria, wave order.
- [ ] `018-drift-census-and-plan-revalidation/research/research.md` — per-phase drift verdicts (003/012/013 need refinement) + §9 the 020 coupling.
- [ ] `004/002-recommendation-ledger-bijective-map/` — the 178-row triage that gates 005-007.
- [ ] `012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph/` — the 013 parallel-safety authority.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before this handover is trusted, verify:
- [x] Planning tree validates 125/125 `--strict` (errors 0 warnings 0)
- [x] Census + repairs + 020 coupling all on `origin/skilled/v4.0.0.0`
- [x] Execution has not started (0 implementation-summaries in 003-017)
- [x] Executor policy + dispatch commands recorded (§3.3)
- [x] Traps & scar tissue captured (§2.5)
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

- **Do NOT start at 013.** It is 54% of the program and its extent should shrink after 012's cross-mode closures hoist shared logic and after 004/002's triage defers low-value recs. Build the spine first; re-decide 013's full scope at 012.
- **Additive-dark is the one rule that drives everything.** No commit in this program may leave the running system unable to execute an in-flight loop. The ledger records in parallel but is never authoritative until its mode's cutover (014). Legacy writers die last (015), only after zero-use telemetry.
- **The gateway is fail-closed but lands dark:** it rejects *unauthorized transitions among typed events it records*, while legacy remains the serving authority — it is not a second authority over the live loop until cutover.
- **Shared-branch discipline:** plumbing commits on origin tip, path-scoped to `036/`; never blanket-`pkill` codex/opencode (shared OAuth); expect concurrent sessions to reset the working tree.
- **020 router-unification coupling is live** (`003/spec.md` §6, `018/research.md` §9): do not interleave 020's compiled-router live-activation with 036's 013/014 cutover unannounced; 017's re-census is the catch-net.
<!-- /ANCHOR:session-notes -->
