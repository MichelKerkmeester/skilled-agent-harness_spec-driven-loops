---
title: "Implementation Plan: deep-research mining smallcode-master for small-model patterns"
description: "Workflow plan for the 20-iter cli-devin SWE-1.6 dogfood loop driving 5 locked research questions against the smallcode-master corpus. Defines preflight, iteration cadence, convergence detection, and synthesis hand-off to follow-on remediation packets."
trigger_phrases:
  - "smallcode research plan"
  - "deep-research workflow plan"
  - "RQ tracking grid"
  - "swe-1.6 dogfood plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/001-research-smallcode"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 001 plan.md L3"
    next_safe_action: "Author remaining 001 docs"
    blockers: []
    key_files:
      - "spec.md"
      - "../external/smallcode-master/"
      - "../preflight/context-card.md"
      - ".opencode/skills/deep-research/SKILL.md"
      - ".opencode/skills/deep-research/assets/deep_research_config.json"
      - ".opencode/skills/deep-research/assets/prompt_pack_iteration.md.tmpl"
      - ".opencode/skills/deep-research/references/convergence.md"
      - ".opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000002"
      session_id: "114-001-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: deep-research mining smallcode-master

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `/spec_kit:deep-research:auto` (LEAF iter agent, fresh context per pass) |
| **Executor** | `cli-devin --model swe-1.6` (full 20-iter dogfood, free tier — ADR-001) |
| **Agent-config recipe** | `cli-devin/assets/agent-config-deep-research-iter.json` |
| **Prompt-quality contract** | cli-devin v1.0.6.3 ALWAYS #8/#12/#14 (sk-prompt + RCAF default + medium pre-plan + standard bundle-gate + 5-thought sequential_thinking) |
| **State writer** | `reduce-state.cjs` (only writer per deep-research SKILL.md invariant) |
| **Convergence** | `newInfoRatio < 0.15` × 3 consecutive iters OR iteration cap 20 (ADR-003) |
| **Storage** | `research/` under this spec folder (flat-first per deep-research SKILL.md §2) |

### Overview

Dogfood cli-devin SWE-1.6 on its own optimization research. The preflight pass (Phase 0, dispatched separately before the loop starts) produces `../preflight/context-card.md` — a structured pattern map of smallcode-master with file:line refs. Every loop iteration cites that card as ground truth and pulls fresh smallcode source only for its specific RQ focus, conserving SWE-1.6's context budget (validating RQ1's thesis in flight). Iterations are ~4 per RQ. Synthesis produces `research/research.md` with per-RQ candidate skill-deltas (target file path + patch shape + acceptance criteria + risk class), ready to spawn follow-on remediation packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `spec.md` Level 3 strict-validates
- [ ] `../preflight/context-card.md` exists and is non-empty with sections per RQ1–5
- [ ] `decision-record.md` ADR-001 through ADR-005 captured (Accepted)
- [ ] `description.json` + `graph-metadata.json` generated and indexed
- [ ] 114 phase-parent strict-validates

### Definition of Done

- [ ] All 5 RQs covered (≥3 evidence citations per RQ)
- [ ] `research/deep-research-state.jsonl` contains `type: converged` event OR iteration cap reached
- [ ] `research/research.md` synthesizes per-RQ candidate deltas with file path + patch shape + acceptance criteria
- [ ] RQ5 architecture verdict explicit (new skill / distributed refs / hybrid)
- [ ] `checklist.md` all P0 / P1 items checked with evidence
- [ ] `validate.sh --strict 001-research-smallcode` exit 0
- [ ] Memory continuity updated with next-step pointer to follow-on remediation packets
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Autonomous iterative research loop (deep-research workflow) with externalized state and convergence detection. LEAF-agent constraint: each iter is one fresh-context pass (max 12 tool calls), no nested loops, state mutations through `reduce-state.cjs` only.

### Key Components

- **Preflight context-card** (`../preflight/context-card.md`): Pre-computed pattern map; every iter cites it
- **Strategy file** (`research/strategy.md`): The 5 RQs, sub-questions, source-corpus boundaries, convergence criteria
- **Iter prompt** (rendered from `deep-research/assets/prompt_pack_iteration.md.tmpl`): RCAF-framed, medium-pre-plan, sequential_thinking-mandated; piped to `cli-devin run --model swe-1.6` per agent-config-deep-research-iter recipe
- **Iter markdown** (`research/iterations/iter-NNN.md`): Per-iter narrative + citations + candidate deltas
- **Iter delta JSONL** (appended to `research/deep-research-state.jsonl`): `type/iteration/newInfoRatio/status/focus` (+ optional `graphEvents`)
- **Reducer** (`reduce-state.cjs`): Single state writer; rolls deltas → strategy updates → convergence detection
- **Synthesis pass** (final iter or dedicated synthesis): Consolidates iters → `research/research.md` with per-RQ deltas + acceptance criteria

### Smart Routing

`/spec_kit:deep-research:auto` is the entry point. The skill's YAML workflow owns dispatch. Native `@deep-research` is the default LEAF; cli-devin SWE-1.6 routing is configured via `--executor cli-devin --model swe-1.6` flags or `deep_research_config.json` overrides (ADR-001 commits us to the latter).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

### Modified Surfaces (this packet)

| Surface | Path | Type | Notes |
|---------|------|------|-------|
| Spec docs | `001-research-smallcode/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Create | Level 3 baseline |
| Spec metadata | `001-research-smallcode/{description,graph-metadata}.json` | Create | Generated |
| Research artifacts | `001-research-smallcode/research/**` | Create (deferred to loop) | YAML workflow owns |
| Phase-parent metadata | `../graph-metadata.json` | Modify (via generate-context) | children_ids picks up 001 |
| Phase-parent spec | `../spec.md` | (Already authored, no further edits expected) | Phase-parent lean trio |

### Read-only Surfaces (cited by iters)

| Surface | Path | Notes |
|---------|------|-------|
| External corpus | `../external/smallcode-master/` (all subdirs) | MIT-licensed, included verbatim |
| Preflight evidence | `../preflight/context-card.md` | Cited per iter, primary ground truth |
| cli-devin contract | `.opencode/skills/cli-devin/SKILL.md` + assets/references | Iter prompts conform |
| cli-opencode contract | `.opencode/skills/cli-opencode/SKILL.md` + references | Target of RQ4 deltas |
| sk-prompt contract | `.opencode/skills/sk-prompt/SKILL.md` + assets | Target of cross-cutting RQ deltas |
| Skill advisor surface | `.opencode/skills/system-skill-advisor/**` | Target of RQ5 deltas |
| Deep-research contract | `.opencode/skills/deep-research/**` | Workflow invariants |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0 — Preflight Context Card (one-shot, dispatched before loop)

- Read `.opencode/skills/cli-devin/SKILL.md` (CLI dispatch rule)
- Compose RCAF prompt via sk-prompt + CLEAR 5-check
- Dispatch: `devin run --model swe-1.6` reading smallcode-master and emitting structured pattern map
- Capture output to `../preflight/context-card.md`

### Phase 1 — Strategy & Bootstrap

- Author `research/strategy.md` (5 RQs verbatim + sub-questions + source boundaries + convergence math)
- Init `research/deep-research-state.jsonl` (lifecycle event `new`)
- Mint `research/deep-research-config.json` with executor pinned to cli-devin SWE-1.6

### Phase 2 — Iteration Loop (up to 20 iters)

- Each iter: render prompt-pack → dispatch cli-devin SWE-1.6 → capture iter markdown + JSONL delta
- Reducer rolls deltas, updates strategy.md focus, checks convergence math
- Sequential: dispatched serially (LEAF constraint); no parallel iters
- Per-iter max 12 tool calls; iter markdown non-empty; JSONL delta has required fields

### Phase 3 — Convergence & Synthesis

- Detect convergence (`newInfoRatio < 0.15` × 3) OR cap reached
- Synthesis pass: consolidate iters → `research/research.md` per-RQ structure
- Emit lifecycle event `synthesized` in JSONL
- Author final reconciliation: update continuity, regenerate description.json + graph-metadata.json

### Phase 4 — Hand-off (post-loop, user-driven)

- User triggers follow-on packet creation per RQ verdict
- This packet's `implementation-summary.md` gets filled with final state, citations, and per-RQ recommendations index
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Pre-Loop

- Phase-parent strict-validate (114): exit 0
- Child strict-validate (001): exit 0 with all Level 3 docs
- Preflight context-card non-empty + per-RQ sections present
- Sample iter dispatch: dry-run prompt-pack render, confirm RCAF + sequential_thinking + medium pre-plan all present

### During Loop

- After each iter: validate JSONL append + iter markdown non-empty (per deep-research SKILL.md §3 invariants)
- After every 5 iters: spot-check that citations are real (file:line exists in smallcode source or preflight card)
- Stuck recovery: 3 consecutive failures trigger `stuck_recovery` event — manual intervention required

### Post-Loop

- Verify `research/research.md` covers all 5 RQs with ≥3 citations each
- Verify RQ5 architecture verdict is explicit (not deferred)
- Strict-validate 001 final state
- Memory search returns synthesized findings on small-model queries
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Risk if Blocked | Mitigation |
|------------|------|-----------------|------------|
| cli-devin SWE-1.6 free-tier availability | External | Loop cost changes if pulled mid-run | Loop is resumable on DeepSeek-v4-pro |
| `/spec_kit:deep-research:auto` YAML workflow | Internal | Loop won't dispatch | Workflow is stable since 1.6.2.0 |
| `cli-devin/assets/agent-config-deep-research-iter.json` recipe | Internal | Iter dispatch malformed | Recipe is locked v1.0.6.3 |
| Sequential-thinking MCP (`mcp__sequential_thinking__*`) | Internal | Iters can't apply 5-thought mandate | User-scope registration verified per cli-devin v1.0.6.3 ALWAYS #14 |
| `external/smallcode-master/` corpus | Read-only | n/a — already vendored | MIT-licensed, verbatim |
| Preflight context-card | Internal | Iters waste budget re-reading source | Phase 0 produces before loop start |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### If Loop Diverges (no convergence + bad synthesis quality)

- Mark current generation as `divergent` in JSONL
- Use `restart` lifecycle event: archive `research/` → `research_archive/{timestamp}/`, mint fresh sessionId
- Reconsider strategy: tighten RQ scope, switch to native @deep-research executor, increase per-iter token budget

### If Strict-Validate Fails Mid-Loop

- Identify which anchor / file failed (use `--verbose`)
- Patch the file (do not skip validate)
- Resume loop via `/spec_kit:resume 001-research-smallcode`

### If smallcode-master Patterns Already Shipped

- Strike the affected RQ candidates from synthesis (record as `superseded_by: <packet-id>`)
- Continue with remaining deltas
- Document in `decision-record.md` as ADR-006 (if material) or `implementation-summary.md` (if minor)
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (preflight)
  ↓ (context-card.md must exist)
Phase 1 (strategy)
  ↓ (strategy.md + config.json present)
Phase 2 (iter loop, 1..20 sequential)
  ↓ (convergence event OR cap)
Phase 3 (synthesis)
  ↓ (research.md per-RQ deltas present)
Phase 4 (hand-off — out of scope for this packet)
```

- Phase 0 has NO dependencies inside the loop infrastructure (it just needs cli-devin reachable)
- Phase 1 depends on Phase 0's output existing
- Phase 2 iters are strictly serial (LEAF constraint)
- Phase 3 cannot start until Phase 2 emits a convergence or cap event
- Phase 4 follow-on packets cannot start until Phase 3 ships research.md
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Wall-clock | SWE-1.6 cost | Owner | Notes |
|-------|------------|--------------|-------|-------|
| Phase 0 (preflight) | 15–25 min | Free tier | main agent → cli-devin | One-shot dispatch |
| Phase 1 (strategy) | 5–10 min | Free tier | main agent → cli-devin | Strategy.md authoring within the loop's bootstrap |
| Phase 2 (20 iters) | 5–8 hours (NFR-P02 cap) | Free tier | YAML workflow | Serial; ~15–25 min per iter (cli-devin v1.0.6.0 reliability note) |
| Phase 3 (synthesis) | 45 min (NFR-P03 cap) | Free tier | YAML workflow → cli-devin | Longer cap; reads all iters |
| Phase 4 (hand-off) | n/a — separate packets | n/a | n/a | Out of scope |
| **TOTAL** | **~6–9 hours** | **$0 (free tier)** | | Resumable; can stretch across sessions |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Loop Rollback

- Delete `research/` if it was created erroneously
- Reset 001 docs to pre-loop state (git revert if committed)
- Strict-validate to confirm clean slate

### Mid-Loop Rollback (between iters)

- Save current state snapshot: `cp -r research/ research_snapshot_{timestamp}/`
- Apply mitigation (e.g., adjust strategy.md focus)
- Resume via `/spec_kit:resume`

### Post-Synthesis Rollback

- If research.md quality is unacceptable: invoke `restart` lifecycle, fresh sessionId, archive existing tree under `research_archive/{timestamp}/`
- Re-author strategy.md with refined scope
- Re-run with new generation number incremented

### Catastrophic Rollback (lose entire packet)

- The packet is read-only research output. No production code is touched here.
- Worst case: delete `001-research-smallcode/`, re-create as fresh packet; 114 phase-parent regenerates `children_ids` via generate-context.js.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

### Upstream (this packet depends on)

| Source | What we consume |
|--------|----------------|
| 113-cli-devin-prompt-quality-arc (predecessor) | RCAF default, medium pre-plan, bundle-gate cross-model finding, sequential_thinking 2-layer pattern, free-tier disclosure |
| cli-devin v1.0.6.3 SKILL.md + assets | Prompt-quality contract, agent-config recipes, prompt-quality-card |
| sk-prompt v1.3.1.0 | DEPTH framework, CLEAR scoring, cli_prompt_quality_card |
| deep-research v1.6.2.0 | Loop YAML workflow, convergence math, state writer |
| external/smallcode-master MIT corpus | Source patterns (budget engine, verifier, profiles, escalation) |

### Downstream (depends on this packet)

| Consumer | What they consume |
|---------|-------------------|
| Future 002-* remediation packets | research.md per-RQ deltas (file paths, acceptance criteria) |
| Possible new sk-small-model skill | RQ5 architecture verdict + frontmatter + graph-metadata draft |
| AGENTS.md update packet | RQ5 dispatch-rule recommendations |
| cli-devin / cli-opencode reference updates | RQ1/RQ2/RQ3/RQ4 patch shapes |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The loop's critical path is **Phase 0 → Phase 1 → Phase 2 (iters serial) → Phase 3 (synthesis)**. Each iter depends on the previous iter's reduced state. Convergence math is the gating function for Phase 3 entry. Synthesis quality (specifically RQ5 verdict explicitness) is the gating function for Phase 4 readiness.

Single point of failure: if Phase 2 stalls in `stuck_recovery` after iter ~5–10, the entire loop blocks until manual intervention. Mitigation: resume from snapshot, switch executor temporarily, or trim RQ scope (last resort; would require ADR-006).
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Trigger | Verification |
|-----------|---------|--------------|
| M0: Spec packet ready | All 001 docs authored + strict-validate green | `validate.sh --strict 001-research-smallcode` exit 0 |
| M1: Preflight complete | `../preflight/context-card.md` exists, non-empty, sections per RQ | `wc -l ../preflight/context-card.md` > 50; `grep -c '^## RQ' ../preflight/context-card.md` = 5 |
| M2: Loop bootstrapped | `research/strategy.md` + `research/deep-research-config.json` present, `lifecycle: new` event in JSONL | `jq -r 'select(.type=="lifecycle" and .event=="new")' research/deep-research-state.jsonl` non-empty |
| M3: First 5 iters complete | `iter-001..005.md` exist, JSONL has 5 deltas, `newInfoRatio` declining | Per-iter JSONL audit |
| M4: Convergence detected OR cap reached | `type: converged` event OR `iteration == 20` reached | `jq -r 'select(.type=="converged" or .iteration==20)' research/deep-research-state.jsonl` |
| M5: Synthesis shipped | `research/research.md` covers all 5 RQs with deltas | manual review + section count audit |
| M6: Hand-off ready | `implementation-summary.md` populated with per-RQ recommendations index | `grep -c '^### RQ' implementation-summary.md` = 5 |
<!-- /ANCHOR:milestones -->

---

## RQ TRACKING GRID (populated during loop)

| RQ | Status | Iter count | Citations | Candidate deltas | Confidence |
|----|--------|------------|-----------|------------------|------------|
| RQ1 — Context Budget Engine | not-started | 0 | 0 | 0 | n/a |
| RQ2 — Output Verification Pipeline | not-started | 0 | 0 | 0 | n/a |
| RQ3 — Per-Model Profiles & Escalation | not-started | 0 | 0 | 0 | n/a |
| RQ4 — Structured Scope/Permissions | not-started | 0 | 0 | 0 | n/a |
| RQ5 — Skill Architecture (synthesis) | not-started | 0 | 0 | 0 | n/a |

> Loop will update this grid as deltas accumulate. Final values feed `implementation-summary.md`.
