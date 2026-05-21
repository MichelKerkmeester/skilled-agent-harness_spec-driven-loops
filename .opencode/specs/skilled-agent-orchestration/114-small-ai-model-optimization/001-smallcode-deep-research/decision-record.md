---
title: "Decision Record: deep-research mining smallcode-master for small-model patterns"
description: "Five ADRs locking the research loop's design: executor choice, RQ scope, convergence math, preflight evidence pattern, and post-synthesis follow-on packet structure."
trigger_phrases:
  - "smallcode research ADRs"
  - "deep-research decision record"
  - "executor selection swe-1.6"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/001-smallcode-deep-research"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 001 decision-record.md"
    next_safe_action: "Author 001 implementation-summary.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/skills/cli-devin/SKILL.md"
      - ".opencode/skills/deep-research/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000005"
      session_id: "114-001-decisions-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Decision Record: deep-research mining smallcode-master

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Executor = cli-devin SWE-1.6 (full 20-iter dogfood)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | michelkerkmeester (user), claude main agent (proposer) |

---

<!-- ANCHOR:adr-001-context -->
### Context

We had four viable executor paths for the 20 deep-research iterations: native `@deep-research` (Opus), `cli-opencode + deepseek-v4-pro --reasoning-effort high`, `cli-devin --model swe-1.6`, or a hybrid that splits iters across multiple executors. The decision matters because the executor IS the model we are studying — running this loop on Opus would generate findings about *what Opus thinks small-model optimization looks like* rather than findings grounded in actual small-model behavior.

### Constraints

- 20 iterations × ~15–25 min ceiling per iter = 5–8 hour wall-clock budget
- Pro-quota burn matters: deepseek-v4-pro / kimi-k2.6 / glm-5.1 consume Pro tier; SWE-1.6 is free per cli-devin v1.0.6.2 disclosure
- Cross-model validation already happened in packet 113/007 (RCAF, bundle-gate, anti-hallucination cross-CLI propagation) — this loop targets runtime patterns, not prompt composition
- LEAF-agent constraint: each iter is fresh-context, max 12 tool calls, no nested loops
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Run the full 20-iter loop with `cli-devin --model swe-1.6` — the same model the research aims to optimize.

**How it works**: `research/deep-research-config.json` pins `executor: cli-devin, model: swe-1.6`. Each iter dispatches per `cli-devin/assets/agent-config-deep-research-iter.json` recipe with mandated sequential_thinking, RCAF, medium pre-plan, standard bundle-gate. The preflight context-card (ADR-004) absorbs the smallcode-master reading cost once, so iters read fresh source only for their specific RQ focus — respecting SWE-1.6's smaller context window and dogfooding RQ1's budget thesis directly.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cli-devin SWE-1.6 (chosen)** | Dogfoods target model; free tier; validates RQ1 in flight; surfaces SWE-1.6 reading limits empirically | Lower per-iter quality vs Opus; ~25 min/iter cap | 8/10 |
| native @deep-research (Opus) | Highest synthesis quality; no Pro burn; no hang risk; best at RQ5 architecture | Doesn't dogfood; findings are second-hand for small-model claims | 7/10 |
| cli-opencode + deepseek-v4-pro high | Mid-tier reasoning; bigger context; validated on 013 deep-review | Pro quota burn; ~5-7 hr cost; some hang risk (5-10%) | 6/10 |
| Hybrid (SWE-1.6 iters 1-15, Opus 16-20) | Best of both; Opus owns RQ5 synthesis | ADR-001 complexity; harder to interpret findings; cross-model contamination | 7/10 |

**Why this one**: The whole point is empirical small-model validation. Running on Opus and then claiming "we found these patterns work for small models" would be unfalsifiable. SWE-1.6 dogfood + preflight context-card pattern lets us cite actual observed truncation, citation drift, and synthesis quality from a real small-model executor. The free tier sweetens the choice (no Pro burn over a 6–8 hour run). Trade-off — lower iter quality — is mitigated by the preflight card + RCAF + medium pre-plan + 5-thought sequential_thinking per cli-devin v1.0.6.3 contract.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Findings carry empirical authority (observed on the model we want to optimize, not a frontier proxy)
- RQ1 (context budget) gets validated *during* the loop, not just retrospectively
- Zero Pro-quota cost over a 6–8 hour run (free-tier SWE-1.6)
- Surfaces SWE-1.6 reading-limit failure modes that Opus would silently smooth over

**What it costs**:

- Per-iter quality is lower than Opus on dense Marrowscript source. Mitigation: preflight context-card absorbs the dense-source-reading cost once; iters cite the card.
- ~25 min/iter ceiling vs Opus's ~5–10 min. Mitigation: accepted — total loop fits inside the 8 hr NFR-P02 cap.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| SWE-1.6 misreads dense Marrowscript and emits spurious deltas | M | Preflight context-card pre-structures patterns; per-iter citation requirement (CHK-014) enforces file:line accuracy |
| Cognition pulls SWE-1.6 free tier mid-run | L | Loop is resumable on deepseek-v4-pro via lifecycle `resumed` event with parent_session_id |
| RQ5 (architecture synthesis) is too abstract for SWE-1.6 quality | M | Synthesis pass uses dedicated longer cap (45 min, NFR-P03); fallback to Opus synthesis if checklist CHK-050..054 fail (no ADR needed; treated as recovery, not a re-decision) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without dogfood, findings are second-hand; the whole research target is "what helps SWE-1.6" |
| 2 | **Beyond Local Maxima?** | PASS | All 4 alternatives compared with concrete trade-offs |
| 3 | **Sufficient?** | PASS | One executor, one recipe, one config — simplest possible setup |
| 4 | **Fits Goal?** | PASS | Goal = improve small-model output quality; this executor IS the small model |
| 5 | **Open Horizons?** | PASS | If SWE-1.6 dogfood fails, retry with hybrid is the recovery path (not a re-decision) |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `research/deep-research-config.json`: executor pinned to cli-devin, model swe-1.6, recipe path = `cli-devin/assets/agent-config-deep-research-iter.json`
- Per-iter prompt-pack rendered from `deep-research/assets/prompt_pack_iteration.md.tmpl` with cli-devin v1.0.6.3 contract front-loaded

**How to roll back**: Edit `research/deep-research-config.json`, change executor to native `@deep-research` (Opus), restart loop via lifecycle `restart`. Existing iters archive under `research_archive/{timestamp}/`. Fresh sessionId; generation incremented.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Research Question Scope Freeze (5 RQs)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | michelkerkmeester, claude main agent |

### Context

The original brainstorm produced 10 candidate RQs covering every smallcode-master innovation. With a 20-iter cap, that's 2 iters per RQ which is too thin for synthesis quality. Need to trim to 5–7 RQs and lock the scope before loop start.

### Constraints

- 20-iter cap (ADR-003) puts a hard ceiling on per-RQ depth
- Synthesis pass needs ≥3 citations per RQ (CHK-020/024/030/040/050)
- Already-shipped 113-arc findings must NOT be re-researched
- Each RQ must map to ≥1 candidate skill-delta with file paths

### Decision

**We chose**: 5 RQs. RQ1 Context Budget Engine, RQ2 Output Verification Pipeline, RQ3 Per-Model Profiles & Escalation, RQ4 Structured Scope/Permissions, RQ5 Skill Architecture (synthesis).

**How it works**: Scope is frozen in spec.md §4 and strategy.md. Mid-loop scope drift is forbidden (ADR-002 freeze). If a new high-value RQ surfaces during synthesis, it becomes a follow-on packet, not an in-flight addition.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **5 RQs (chosen)** | ~4 iters per RQ; covers distinct innovations; matches user trim | RQ5 synthesis carries heavy weight | 8/10 |
| 7 RQs (original) | Wider coverage including tool-routing + auto-decompose | ~3 iters per RQ; overlaps with mcp-code-mode and sk-prompt medium-pre-plan | 6/10 |
| 4 RQs (tightest) | ~5 iters per RQ; deeper per-RQ exploration | Drops RQ2 verification pipeline (load-bearing for hard-fail gatekeeper) | 7/10 |
| Open scope (add as you go) | Flexible | Convergence math meaningless; synthesis unbounded | 3/10 |

**Why this one**: Dropped RQs were the most overlap-prone (tool-routing overlaps mcp-code-mode; auto-decompose overlaps sk-prompt medium-pre-plan). The remaining 5 each map to a distinct smallcode innovation with no easy substitute. ~4 iters per RQ is enough to surface ≥3 citations and ≥1 candidate delta per the checklist gates.

### Consequences

**What improves**:

- Synthesis quality per RQ improves with fewer competing topics
- Convergence math is meaningful (defined target set)
- Hand-off package to follow-on packets is scoped (5 candidate target areas, not 10)

**What it costs**:

- Smallcode's tool-routing and auto-decompose patterns are not researched in this packet. Mitigation: if RQ5 architecture verdict surfaces these as needed, follow-on packets can pick them up.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dropped RQ ideas turn out to be load-bearing | M | Follow-on packet can pick them up; nothing here precludes future research |
| 5 still too many → ~4 iters per RQ insufficient | M | Convergence can fire before cap (newInfoRatio<0.15 ×3); CHK-020 etc. enforce minimum citations |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Scope freeze prevents mid-loop drift |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | 5 RQs cover all distinct smallcode innovations |
| 4 | **Fits Goal?** | PASS | Each RQ maps to a concrete skill-delta target |
| 5 | **Open Horizons?** | PASS | Dropped RQs can land in future packets |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `spec.md` §4 lists 5 RQs verbatim. `strategy.md` (created in Phase 1 of the loop) mirrors them.

**How to roll back**: Open ADR-006 amending scope. Requires user approval. Mid-loop drift via implicit synthesis-time scope creep is treated as a violation and corrected, not retrofit into the spec.

---

## ADR-003: Convergence Math (newInfoRatio < 0.15 × 3 OR cap 20)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | michelkerkmeester, claude main agent |

### Context

Need a deterministic stopping rule. Two failure modes: (a) loop runs forever if convergence threshold never trips; (b) loop stops too early if 3 consecutive iters happen to be low-newInfo by accident (e.g., the iter happened to focus on something already covered).

### Constraints

- deep-research workflow exposes `--max-iterations` and convergence threshold knobs (per skill SKILL.md + references/convergence.md)
- Per-RQ minimum citations (CHK-020 etc.) require enough iters to gather evidence
- Cost ceiling (NFR-P02): 8 hours total

### Decision

**We chose**: `newInfoRatio < 0.15` for **3 consecutive** iterations OR iteration cap = 20, whichever comes first. With a forced synthesis pass at end regardless of which triggered.

**How it works**: `reduce-state.cjs` computes newInfoRatio per iter (per references/convergence.md). After 3 consecutive sub-threshold iters, fires `type: converged` event. Synthesis pass runs next. If cap 20 reached without convergence, synthesis still runs (loop completion is unconditional).

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **0.15 × 3 OR cap 20 (chosen)** | Standard deep-research default; balances early-stop vs over-run | If RQ5 needs many iters, synthesis bumps against cap | 8/10 |
| Tighter 0.10 × 3 | More confident convergence | Higher chance of cap-out → less synthesis budget | 6/10 |
| Looser 0.20 × 3 | Earlier exit on diminishing returns | Risk of premature stop (single bad iter masks real new info) | 5/10 |
| No cap, only convergence | "Natural" stopping | Catastrophic risk if loop diverges; cost explosion | 2/10 |

**Why this one**: Matches deep-research/references/convergence.md default; the 113 packets used the same and reached convergence at iter 7–10 typically, leaving ~10 iters for synthesis. Familiar tuning reduces interpretability risk.

### Consequences

**What improves**: Deterministic stopping; cost bounded; synthesis runs unconditionally so research.md is always produced.

**What it costs**: If a RQ is genuinely under-studied at cap-out, synthesis may flag low-confidence on that RQ. Mitigation: CHK-063 enforces confidence tags; recovery is to spawn a follow-on continuation packet, not retrofit this one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Convergence fires before all 5 RQs covered | M | Synthesis pass MUST cover all 5 (CHK-060); if uncovered, force one more synthesis iter |
| Cap 20 reached with low overall quality | M | Restart lifecycle event available; can switch executor and re-run |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without convergence math, loop runs unbounded |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives weighed |
| 3 | **Sufficient?** | PASS | Standard default; well-tested in prior packets |
| 4 | **Fits Goal?** | PASS | Cost bounded; synthesis always runs |
| 5 | **Open Horizons?** | PASS | Continuation packet available if quality low |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `research/deep-research-config.json` sets `convergence: { ratio: 0.15, consecutive: 3 }, maxIterations: 20`.

**How to roll back**: Edit config; restart loop with `lifecycle: restart`. Existing iters archive.

---

## ADR-004: Preflight Context-Card as Ground-Truth Evidence Base

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | michelkerkmeester, claude main agent |

### Context

SWE-1.6 has a smaller context window than DeepSeek-v4-pro or Opus. Each iter re-reading smallcode-master from scratch (PLAN.md, COMPARISON.md, src/governor/*.ms, src/context/budget.ms, etc.) burns most of the iter's token budget before any analysis happens. We need a pre-computed, structured pattern map that iters can cite cheaply.

### Constraints

- Preflight artifact lives at 114/preflight/ (parent level) so it's clearly evidence, not part of 001's templated docs
- Each iter must cite the card OR a specific file:line ref (CHK-014)
- The card itself must be authored under cli-devin's prompt-quality contract (sk-prompt + RCAF + CLEAR 5-check) so its quality is auditable

### Decision

**We chose**: Dispatch a single cli-devin SWE-1.6 preflight pass before the loop starts, capturing structured pattern map to `114/preflight/context-card.md`. Iters reference this card as ground truth; raw smallcode-source reads only for file:line drill-down on a specific RQ focus.

**How it works**: Phase 0 main-agent task: read cli-devin SKILL.md, compose RCAF prompt routing to smallcode-master's high-value files (PLAN.md, COMPARISON.md, src/governor/{verifier,hard_fail,tool_scorer}.ms, src/context/budget.ms, src/model/profiles.ms, bin/escalation.js), dispatch cli-devin SWE-1.6, capture output to context-card.md. Verify per-RQ sections present before loop start.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preflight context-card (chosen)** | Token-efficient; structured; auditable; validates RQ1 in flight | One extra dispatch before loop | 9/10 |
| Each iter reads smallcode fresh | Direct citations; no intermediate artifact to maintain | Burns SWE-1.6 context budget; risk of citation drift | 4/10 |
| Use external/smallcode-master README only | Trivially cheap | Misses 80% of the pattern surface | 3/10 |
| Generate card with Opus, dispatch loop on SWE-1.6 | Best of both | Cross-model contamination in evidence base | 5/10 |

**Why this one**: Cheapest way to give SWE-1.6 iters a high-density, auditable input. The card itself is generated by SWE-1.6 (matching dogfood policy from ADR-001) and gets validated by the main agent before loop start.

### Consequences

**What improves**: Per-iter token budget freed for analysis (not re-reading source); citation consistency across iters; ADR-004 itself validates RQ1's central thesis.

**What it costs**: One additional ~25 min dispatch (Phase 0). Accepted as proportionally small vs 8-hour loop. Card must be re-generated if smallcode-master changes (out of scope here — corpus is frozen at v0.2.2).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Card itself has spurious patterns (SWE-1.6 misread Marrowscript) | M | Main agent reviews card before loop start; manual edit if needed |
| Iters over-rely on card and skip file:line drill-down | L | CHK-014 explicitly allows card OR file:line — both count as valid citation |
| Card goes stale if smallcode-master gets updated | L | Corpus is vendored verbatim; updates require explicit re-vendoring |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, SWE-1.6 burns budget re-reading source |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives weighed |
| 3 | **Sufficient?** | PASS | One pre-computed card; no further intermediate artifacts needed |
| 4 | **Fits Goal?** | PASS | Validates RQ1 in flight; respects dogfood policy |
| 5 | **Open Horizons?** | PASS | Pattern extends to other deep-research packets on dense corpora |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `114/preflight/context-card.md` created in Phase 0. Per-iter prompt template (from `deep-research/assets/prompt_pack_iteration.md.tmpl`) is augmented with a "cite preflight context-card OR specific smallcode file:line" instruction in the RCAF Context block.

**How to roll back**: Delete `114/preflight/context-card.md`; iters revert to reading smallcode source directly (slower, more drift risk). No structural rollback needed; iter prompt template falls back gracefully.

---

## ADR-005: Follow-on Remediation Packets Deferred to Post-Synthesis

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | michelkerkmeester, claude main agent |

### Context

The research output will recommend specific skill-deltas across cli-devin / cli-opencode / sk-prompt / AGENTS.md / possibly a new sk-small-model skill. The temptation is to pre-create stub packets (002-budget-engine, 003-verification-pipeline, etc.) so the structure is visible upfront.

But the RQ5 architecture verdict — new skill vs distributed refs vs hybrid — fundamentally reshapes what those follow-on packets look like. Pre-creating stubs before synthesis would either be misnamed, misnumbered, or carry the wrong scope.

### Constraints

- 114 is a phase-parent; its `graph-metadata.json children_ids` regenerates on every `generate-context.js` run
- Spec-kit memory indexes empty stub folders, polluting search
- Follow-on packets should each carry their own ADRs for the specific skill they're modifying

### Decision

**We chose**: No 002+ packets pre-created. After synthesis lands research.md, a separate planning session enumerates follow-on packets per RQ5 verdict.

**How it works**: 001 ships research.md with per-RQ deltas. Main agent or user reads research.md, then invokes `/spec_kit:plan` (or `/spec_kit:complete`) for each delta-bearing packet, choosing IDs sequentially (002, 003, ...) at that time. 114 phase-parent regenerates children_ids when each new child packet is created.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Defer to post-synthesis (chosen)** | Packets reflect actual research findings; no naming drift | Less visible upfront structure | 9/10 |
| Pre-create stubs with placeholder names | Structure visible | Misnaming risk; pollutes spec memory; stubs may never be filled | 4/10 |
| Pre-create 002 conditionally on "new sk-small-model" | Conditional structure | Branching graph-metadata hard to manage cleanly | 5/10 |
| One mega-packet 002-implement-all-rqs | One follow-on | Defeats Spec Kit's per-packet isolation; massive blast radius | 2/10 |

**Why this one**: Spec-kit philosophy is one-packet-one-purpose. Pre-creating stubs would force premature naming and structure decisions that the synthesis is meant to drive.

### Consequences

**What improves**: Follow-on packets carry accurate names + scope; spec memory stays clean; synthesis-driven architecture decisions land authentically.

**What it costs**: Less visible structure pre-synthesis. Mitigation: 114/spec.md PHASE DOCUMENTATION MAP explicitly notes future packets are deferred + names them speculatively in prose ("002-new-skill-sk-small-model OR 002-cli-devin-budget-engine — depends on RQ5 verdict").

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| User forgets to spawn follow-on packets | L | Synthesis-time CHK-065 lists target follow-on packet IDs |
| Synthesis hand-waves at architecture, leaving 002+ unclear | M | CHK-050 enforces explicit architecture verdict |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Pre-creating stubs commits to structure we don't have yet |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | Defer is the simplest valid choice |
| 4 | **Fits Goal?** | PASS | Synthesis drives structure; structure doesn't drive synthesis |
| 5 | **Open Horizons?** | PASS | Pattern scales: any deep-research packet on architecture questions defers follow-ons |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: 114/spec.md PHASE DOCUMENTATION MAP shows only 001-research-smallcode + a note deferring 002+. 114/graph-metadata.json `children_ids` = [001] only.

**How to roll back**: If post-synthesis stalls, user can pre-create 002+ stubs manually (each with its own spec.md). No code change required; just packet-creation discipline.
