---
title: "Research Plan: Pi Reasonix-Style Caching — Claim Verification + Gap Scoping"
description: "Three independent deep-research lineages (GPT-5.6 SOL high fast, TERRA max fast, LUNA max fast via cli-codex) each running 20 non-converging iterations, with runtime-owned per-lineage iteration logs and a merged research/research.md synthesis after all lineages complete."
trigger_phrases:
  - "pi caching research plan"
  - "reasonix verification protocol"
  - "three executor fan-out"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/001-research"
    last_updated_at: "2026-08-06T11:48:24Z"
    last_updated_by: "spec-author"
    recent_action: "Research plan authored"
    next_safe_action: "Verify cli-codex routes, then launch iteration 1 fan-out"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-cli-039-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Pi Reasonix-Style Caching — Claim Verification + Gap Scoping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Evidence targets** | `lumo.md`; cli-pi skill; Pi docs (`docs/rpc.md`, extension/caching docs); Reasonix docs; DeepSeek prefix-cache API; Anthropic `cache_control`; Open Design daemon agent registry (`reasonixAgentDef`, `piAgentDef`) |
| **Executor A** | GPT-5.6 **SOL**, effort **high**, **fast** mode, via **cli-codex** |
| **Executor B** | GPT-5.6 **TERRA**, effort **max**, **fast** mode, via **cli-codex** |
| **Executor C** | GPT-5.6 **LUNA**, effort **max**, **fast** mode, via **cli-codex** |
| **Iterations** | 20, non-converging; each iteration fans out to A + B + C (≈60 dispatches total) |
| **Outputs** | `research/lineages/{label}/iterations/iteration-NNN.md`, `research/deep-research-state.jsonl`, `research/research.md` (all runtime-owned under `research/`) |

### Overview
Twenty iterations investigate the four research questions. Each iteration dispatches the same focused brief to all three GPT-5.6 executors in parallel (fresh context each), so every iteration yields three independent perspectives. Iterations run their full count regardless of early agreement (no convergence). The parent builds the claim ledger continuously and synthesizes only after all 20 iterations are logged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Research questions RQ1–RQ4 defined (spec REQ-003..REQ-006)
- [ ] Iteration + fan-out protocol defined (this plan)
- [ ] cli-codex SKILL.md preloaded; SOL/TERRA/LUNA routes verified enabled

### Definition of Done
- [ ] Each lineage logged 20 iterations under `research/lineages/{label}/iterations/`
- [ ] `research/research.md` gives every lumo.md claim a verified/refuted/unknown verdict + source
- [ ] `research/research.md` answers RQ1–RQ4 with citations
- [ ] `validate.sh --strict` exits 0 on this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

```
Three independent deep-research lineages (concurrency 3), each a full 20-iteration loop:
  sol-high:  cli-codex GPT-5.6 SOL  (high, fast) ─> research/lineages/sol-high/  ─┐
  terra-max: cli-codex GPT-5.6 TERRA (max, fast) ─> research/lineages/terra-max/ ─┼─> research/research.md
  luna-max:  cli-codex GPT-5.6 LUNA  (max, fast) ─> research/lineages/luna-max/  ─┘   (merged synthesis)
  (no early convergence: --stop-policy=max-iterations forces all 20 per lineage; ≈60 dispatches total)
```

### Iteration Protocol (each iteration, per lineage)

1. Fresh context per dispatch: no conversation carryover between iterations (deep-research runtime guarantee)
2. Fixed evidence checklist per iteration, rotating across:
   - RQ1: a Reasonix caching claim (hit rate / cost delta / DeepSeek prefix-cache coupling) — find a primary source
   - RQ2: Pi caching surface (`cache_control`, provider-agnostic layer, `pi-cache-optimizer` existence)
   - RQ3: one lumo.md "missing in Pi" feature — real gap or already covered?
   - RQ4: one feasibility/complexity/DeepSeek-limit dimension for the plugin
3. Output per iteration: findings (LEAF, ≤12 tool calls) + `[SOURCE: …]` citations with reliability class
4. Runtime writes `research/lineages/{label}/iterations/iteration-NNN.md` + appends the JSONL delta; the reducer refreshes strategy/registry/dashboard

### Key Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D-001 | No early convergence | Full iteration counts guard against false consensus on unverified claims |
| D-002 | Fresh context per dispatch | Prevents anchoring on prior iterations or on lumo.md's framing |
| D-003 | Three independent lineages (SOL/TERRA/LUNA), not one fan-out | Each is a full loop converging independently — three GPT-5.6 perspectives on the same questions |
| D-004 | Refute-by-default when uncitable | A claim with no primary source is "unknown/refuted", never silently accepted |
| D-005 | Runtime owns all `research/` writes | The deep-loop runtime writes lineage iterations + JSONL + synthesis; no hand-rolled logging |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Route Verification
1. Preload cli-codex SKILL.md (dispatch rule); run codex OAuth pre-flight; verify GPT-5.6 SOL/TERRA/LUNA routable via cli-codex
2. Dry-run `/deep:research:auto` to confirm setup resolves and halts before dispatch

### Phase 2: Iterations
1. Launch `/deep:research:auto` with the 3-lineage `--executors` payload, `--max-iterations=20 --stop-policy=max-iterations --concurrency=3`
2. The runtime dispatches each lineage's 20 iterations; per-iteration artifacts land under `research/lineages/{label}/`
3. Do not stop early: `--stop-policy=max-iterations` forces all 20 per lineage even if verdicts stabilize

### Phase 3: Synthesis + Validation
1. The runtime merges the three lineages into `research/research.md` (RQ1–RQ4 answers, gap table, feasibility/cost-benefit)
2. Verify each lineage logged 20 iterations; confirm stop reason is `maxIterationsReached`
3. Run `validate.sh --strict` on this folder; update parent phase map + handoff criteria
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| Iteration completeness | Each `research/lineages/{label}/` holds 20 iteration files (60 total) | After Phase 2 |
| No early convergence | Each lineage's JSONL stop reason is `maxIterationsReached` | After Phase 2 |
| Claim rigor | `research/research.md` gives every claim a verdict + cited source + reliability class | After Phase 3 |
| Synthesis quality | `research/research.md` cites sources for each RQ1–RQ4 answer | After Phase 3 |
| Packet | `validate.sh --strict` on this folder | After Phase 3 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Purpose | Risk if missing |
|-----------|---------|-----------------|
| cli-codex skill + GPT-5.6 SOL route (high) | Executor A | Track A fails; log honestly |
| cli-codex skill + GPT-5.6 TERRA route (max) | Executor B | Track B fails; log honestly |
| cli-codex skill + GPT-5.6 LUNA route (max) | Executor C | Track C fails; log honestly |
| Reasonix + DeepSeek + Anthropic caching docs | RQ1/RQ2 verification | Claims stay "unknown"; recorded honestly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Research-only phase: nothing to roll back. Delete `research/` and `scratch/` to restart (the runtime archives prior trees on `restart`). No repo files outside this phase folder are touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION PATH

1. `research/lineages/{sol-high,terra-max,luna-max}/iterations/`: 20 iteration files each
2. `research/research.md`: every lumo.md claim carries a verdict + cited source
3. `research/research.md`: RQ1–RQ4 answered with citations; gap + feasibility present
4. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/039-pi-caching-like-reasonix/001-research --strict` exits 0
<!-- /ANCHOR:verification -->
