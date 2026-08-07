---
title: "Implementation Plan: MiniMax 2.7 prompt-framework benchmark"
description: "Port the 113 eval rig, add a MiniMax dispatch wrapper, run a 5-framework bake-off against coding fixtures with real MiniMax M2.7 calls, then integrate the winner into the cli-opencode dispatch path."
trigger_phrases:
  - "minimax benchmark plan"
  - "minimax eval rig port"
  - "dispatch-minimax"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/019-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark"
    last_updated_at: "2026-05-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-003 plan"
    next_safe_action: "Port rig + write dispatch-minimax.cjs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-minimax-prompt-framework-benchmark"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: minimax-prompt-framework-benchmark

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node `.cjs` rig scripts (ported from 113) + markdown skill docs |
| **Framework** | 113 eval rig + eval loop; cli-opencode dispatch (`opencode run`); claude grader (cli-claude-code) |
| **Storage** | Packet-local `eval-rig/cache/` (sha256) + `eval-loop/state/*.jsonl` |
| **Testing** | `dry-run.cjs` gate (canned outputs) → real MiniMax loop → `jq`/`rg` + `validate.sh --strict` |

### Overview
Copy 113's model-agnostic eval rig + loop into this folder, replace only the dispatch layer with `dispatch-minimax.cjs` (wraps `opencode run --model minimax/MiniMax-M2.7 ... </dev/null`), seed 5 framework variants from `sk-prompt/references/patterns_evaluation.md`, run the bake-off + a few hill-climb iterations under a budget cap, and integrate the winner mirroring 113's cli-devin uplift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reuse-and-swap — the 113 rig is model-agnostic; only the dispatch wrapper changes.

### Key Components
- **eval-rig** (ported): 7 fixtures + 5-dim rubric + `scripts/deterministic/*` + `grader/harness.cjs` + sha256 `cache/` + `dry-run.cjs`
- **eval-loop** (ported): `loop.cjs` / `render-variant.cjs` / `mutate.cjs` / `score-variant.cjs` / `converge.cjs` / `synthesize.cjs`
- **dispatch-minimax.cjs** (new): wraps `opencode run --model minimax/MiniMax-M2.7 --agent general --variant high --format json --dir <repo> "<prompt>" </dev/null` with timeout + 429 backoff + mock mode
- **5 framework variants**: RCAF, RACE, CIDI, TIDD-EC, COSTAR (shared 113 baseline scaffold; only the framework block varies)

### Data Flow
loop → render variant (framework × fixture) → dispatch MiniMax → deterministic D1/D2/D3/D5 + claude grader D4 → weighted variant score → cache + JSONL state → converge → synthesis.md → integration.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

Integration (Phase 4) touches shared skill files + a shared schema (model-profiles.json) + the live model slug, so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/model-profiles.json` | Producer — model registry (consumed by fallback router) | update (slug note + `context_length: 204800`) | `jq .` valid; entry shape unchanged |
| `cli-opencode/SKILL.md` + `references/cli_reference.md` | Docs — model selection (carry the slug) | update (`minimax/minimax-2.7` → `minimax/MiniMax-M2.7`) | `rg "minimax/minimax-2.7"` returns 0; `rg "minimax/MiniMax-M2.7"` present |
| `cli-opencode/assets/prompt_templates.md` + `prompt_quality_card.md` | Docs — prompt guidance (no per-model section yet) | add MiniMax winner section | `rg "MiniMax"` shows new section |
| `sk-prompt-models/references/pattern-index.md` | Sentinel index (link-only) | add MiniMax framework row(s) | `rg "minimax"` shows row pointing to cli-opencode |

Required inventories:
- Slug consumers: `rg -n "minimax/minimax-2.7|minimax/MiniMax-M2.7" .opencode/skills` — every hit must end on the correct-cased slug.
- Registry consumers: `rg -n "model-profiles" .opencode/skills --glob '*.ts' --glob '*.md'`.
- Invariant: model-profiles.json stays valid JSON; the `minimax-2.7` registry `id` (internal key) is unchanged — only the human-facing opencode slug + context_length update.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Port the rig
- [ ] Copy 113 `002-eval-rig/` → `eval-rig/` and `003-eval-loop/scripts/` → `eval-loop/scripts/`
- [ ] Write `dispatch-minimax.cjs`; seed 5 framework variants; retune fix-001 allowlist
- [ ] `dry-run.cjs` passes on canned outputs

### Phase 2: Run the benchmark
- [ ] Run `loop.cjs` — 5 variants × 7 fixtures + hill-climb, budget cap ~60 calls
- [ ] Score (deterministic + claude grader); converge or cap
- [ ] Write `eval-loop/synthesis.md` (ranked + winner)

### Phase 3: Integrate + verify
- [ ] Integrate winner into cli-opencode prompt assets + sentinel + sk-prompt card
- [ ] Correct slug + context_length; changelog + decision-record
- [ ] `validate.sh --strict` on 003 + recursive on 120
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Rig sanity | Scoring pipeline on canned outputs | `dry-run.cjs` |
| Live benchmark | 5 frameworks × 7 fixtures on MiniMax M2.7 | `loop.cjs` + deterministic checks + claude grader |
| Integration | Winner present + slug corrected | `rg` / `jq` / `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 113 eval rig + loop scripts | Internal | Green | Reuse source exists + shipped |
| Live MiniMax M2.7 (cli-opencode) | External | Green | Confirmed via `opencode models minimax` |
| claude grader (cli-claude-code) | External | Yellow | Fall back to deterministic-only scoring if unreachable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Benchmark produces no clear winner, or integration breaks validation/JSON.
- **Procedure**: Rig/state lives only under `120/003/` (additive). Integration edits are to ~6 tracked files — `git checkout -- <files>` reverts. No migrations, no runtime code.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

