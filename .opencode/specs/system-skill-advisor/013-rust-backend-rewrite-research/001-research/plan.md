---
title: "Implementation Plan: Phase 1 — Skill-Advisor Scoring Core Rust Rewrite Research"
description: "Configure a single-lineage 16-round deep-research loop over the system-skill-advisor scoring and ranking core, allocating six survey rounds and ten deep-validation rounds to 12 predefined angles before producing residency-aware matrices and a ranked rewrite recommendation."
trigger_phrases:
  - "skill advisor scorer rust research plan"
  - "013 phase 001 research plan"
  - "16 round scorer research"
  - "advisor ranking rewrite allocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-rust-backend-rewrite-research/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Authored the 16-round scoring-core research allocation and executor config"
    next_safe_action: "Confirm cli-codex auth, run a one-round smoke check, then launch the future loop"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-013-001-skill-advisor-scoring-rust-research"
      parent_session_id: null
    completion_pct: 0
    status: "Not Started"
    open_questions:
      - "What is the measured break-even candidate and vocabulary scale for a native scorer kernel?"
      - "Can TypeScript precomputation remove enough work to make Rust unnecessary?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Skill-Advisor Scoring Core Rust Rewrite Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (`/deep:research:auto`) over the TypeScript scorer; Rust is comparison-only |
| **Executor** | `cli-codex` — `gpt-5.6-sol`, `xhigh`, `fast` |
| **Subject** | `system-skill-advisor/mcp_server/lib/scorer/` plus the `advisor_recommend` decision seam |
| **Current Scale** | 18 projected candidates (12 indexed skills + six command bridges), 41 graph edges at charter time |
| **Native Boundary** | SQLite via `better-sqlite3`; prompt embedding via `@huggingface/transformers`/ONNX; JS cosine and scorer math remain in V8 |
| **Storage** | Future loop state and synthesis under local `research/` |
| **Testing** | One-round executor smoke, stage-level latency decomposition, angle coverage, parity discipline, strict packet validation |

### Overview
Run one future deep-research lineage for up to 16 rounds. Rounds 1–6 survey the real decision path, candidate/projection scale, matching lanes, graph/fusion math, and decision tail. Rounds 7–16 deep-validate measured latency, native-module seams, high-cardinality capability, deterministic parity, event-loop tails, and architecture options. A3, A5, A7, and the A10/A11 correctness-tail boundary receive second coverage because they determine whether any Rust boundary can be both useful and safe. The loop must not credit SQLite or ONNX work as a rewrite win [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13-19].
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `codex` is installed, authenticated, and can invoke `gpt-5.6-sol` with `xhigh` reasoning and `fast` service tier.
- [ ] `research/deep-research-fanout-config.json` has one executor, 16 iterations, and concurrency 1.
- [ ] `research/deep-research-strategy.md` contains all 12 angles, the framing invariant, allocation, deliverables, non-goals, stop conditions, and evidence discipline.
- [ ] A one-round smoke check proves the workflow writes a non-empty iteration file and valid JSONL delta.

### Definition of Done
- [ ] Future loop state records convergence or the 16-round cap.
- [ ] `research/research.md` answers every angle with file/line or URL citations.
- [ ] Improvement matrix, new-feature-feasibility matrix, risk register, and ranked recommendation are present.
- [ ] Every latency claim labels execution residency and excludes already-native work from Rust wins.
- [ ] Current and scaled candidate/edge/vocabulary sizes are quantified.
- [ ] Ranking parity covers ordering, rounding, thresholds, ambiguity, abstention, attribution, and delegation.
- [ ] `validate.sh --strict` is run; any parent-generated metadata/summary prerequisites are reported rather than hand-authored by this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage sequential deep research with externalized state. Each round has one predefined focus and must update the evidence ledger. The survey band establishes the measured baseline before the deep-validation band considers an architecture. No loop dispatch occurs while authoring this plan.

### Key Components

| Component | Role |
|-----------|------|
| `research/deep-research-fanout-config.json` | One GPT-5.6-sol xhigh/fast cli-codex lineage, 16 rounds |
| `research/deep-research-strategy.md` | Round-readable framing invariant, 12 angles, allocation, and deliverables |
| `research/deep-research-state.jsonl` | Future append-only per-round state |
| `research/iterations/iteration-*.md` | Future per-round cited findings |
| `research/research.md` | Future merged synthesis and decision artifacts |

### Data Flow
`deep-research-strategy.md` → one angle-focused `cli-codex` round reads the current scorer and evidence → writes one iteration artifact and one JSONL delta → reducer refreshes state → convergence/cap triggers synthesis into `research/research.md`.

#### Round → angle allocation (survey band — Rounds 1–6, angles A1–A6)

| Round | Angle | Primary anchor files | Question the round must close |
|-------|-------|----------------------|-------------------------------|
| 1 | A1 Decision path and residency | `handlers/advisor-recommend.ts`, `lib/prompt-cache.ts`, `lanes/semantic-shadow.ts` | Which stages are JS, native/FFI, mixed, cached, or unmeasured? |
| 2 | A2 Candidate/projection baseline | `lib/scorer/projection.ts`, `mcp_server/package.json` | What are current candidate/edge/vocabulary sizes, and what does SQLite actually own? |
| 3 | A3 Text/vocabulary matching | `lib/scorer/text.ts`, `lanes/explicit.ts` | How many regex/token/phrase operations occur, and which allocations dominate? |
| 4 | A4 Lexical/derived/BM25F lanes | `lanes/lexical.ts`, `lanes/derived.ts`, `lanes/bm25.ts` | What are the per-candidate/per-posting costs and rebuild behavior? |
| 5 | A5 Graph/fusion/ranking math | `lanes/graph-causal.ts`, `fusion.ts`, `lanes/semantic-shadow.ts` | What pure-JS graph, RRF, cosine, and sort work is material? |
| 6 | A6 Decision tail/cache semantics | `scoring-constants.ts`, `ambiguity.ts`, `executor-delegation.ts`, handler rendering | What is costly, what is cache-hidden, and what must remain deterministic? |

#### Round → angle allocation (deep-validation band — Rounds 7–16)

| Round | Angle | Focus |
|-------|-------|-------|
| 7 | A7 Latency decomposition | Define and run/read stage spans for scorer-only versus handler-level p50/p95/p99 |
| 8 | A8 Targeted native kernel | Evaluate `napi-rs`/WASM seams, copies, startup, evidence output, and break-even cost |
| 9 | A9 High-cardinality capability | Model 10x/100x candidates, edges, phrases, docs, and precompiled index options |
| 10 | A10 Deterministic parity | Specify corpus replay and exact ordering/rounding/ambiguity/delegation contracts |
| 11 | A11 Event-loop and tail latency | Compare TypeScript precompute/workers with Rust under concurrent requests |
| 12 | A3 second pass | Quantify compiled phrase automata, regex reuse, token interning, and TS baselines |
| 13 | A5 second pass | Complexity model for graph adjacency reuse, RRF, candidate sort, and JS cosine |
| 14 | A7 second pass | Reconcile measured scorer time with SQLite projection and ONNX/vector boundary time |
| 15 | A10/A11 second pass | Test migration parity and tail-latency risk at the proposed boundary |
| 16 | A12 synthesis | Produce both matrices, risk register, ranked option, first benchmark, and rollback seam |

#### Loop mechanics
- **Convergence**: the workflow's `newInfoRatio`/quality-guard rules, the 16-round cap, or all 12 angles plus four deliverables complete.
- **Evidence**: `[SOURCE: relative/path.ts:line]` for repository claims and `[SOURCE: url]` for external Rust/runtime claims.
- **Residency**: every performance statement says JS-resident, native/FFI-resident, mixed, or unmeasured.
- **Scope**: semantic embedding/vector loading may be timed as boundaries, but their implementation is not redesigned here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `cli-codex` authentication and `gpt-5.6-sol` availability.
- Keep the checked-in fanout config and strategy immutable after loop initialization.
- Run a one-round smoke check through `/deep:research:auto`; do not hand-roll dispatch.

### Phase 2: Core Implementation
- Launch the single lineage through the deep-research command workflow.
- Execute Rounds 1–6 before architecture advocacy; survey evidence gates deep validation.
- Execute Rounds 7–16 or stop legally at convergence.
- Synthesize the required matrices, risk register, and ranked recommendation.

### Phase 3: Verification
- Confirm terminal state and one or more cited findings for every A1–A12 angle.
- Audit every performance claim for execution-residency labels.
- Verify no already-native SQLite/ONNX work is included in a Rust benefit.
- Verify no sibling-owned implementation was redesigned.
- Run strict packet validation and stop for human review.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Evidence |
|-----------|-------|----------|
| Executor smoke | One round writes iteration markdown and JSONL delta | Future loop artifacts |
| State validity | Terminal convergence/cap and valid append-only JSONL | `research/deep-research-state.jsonl` |
| Angle coverage | A1–A12 each answered or explicitly unresolved | Iterations and `research/research.md` |
| Residency audit | No native SQLite/ONNX work counted as scorer rewrite gain | Improvement matrix and latency budget |
| Scale audit | Current and 10x/100x work sizes documented | Measurement/model table |
| Parity audit | Top-k, scores, confidence, uncertainty, ambiguity, evidence, delegation | Deterministic ABI section |
| Structure | Canonical anchors/frontmatter and strict validator output | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Executor**: `cli-codex` with GPT-5.6-sol, `xhigh`, `fast`.
- **Workflow**: `/deep:research:auto`; command-owned state and convergence only.
- **Research subject**: current TypeScript scorer and `advisor_recommend` handler, read-only.
- **Baseline harness**: `mcp_server/bench/scorer-bench.ts`, whose existing gates are references rather than proof of current stage costs [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-bench.ts:15-62].
- **Native boundary**: `better-sqlite3` and `@huggingface/transformers` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13-19].
- **No Rust toolchain dependency**: this phase writes and compiles no Rust.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- This charter task creates only the five requested files inside the phase child. Rollback is deleting those five files before the future loop starts.
- Once a loop runs, preserve this charter and remove/archive only workflow-generated state (`iterations/`, state JSONL, dashboard/registry, and `research.md`) according to the deep-research lifecycle contract.
- No backend source, database schema, Rust artifact, or runtime wiring changes in this phase, so there is no production migration to reverse.
- If the executor fails or research diverges, stop the command-owned loop and resume/restart through its supported lifecycle; never substitute an ad hoc loop.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: `spec.md`
- **Tasks**: `tasks.md`
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
- **Sibling boundary**: `../002-research/`
