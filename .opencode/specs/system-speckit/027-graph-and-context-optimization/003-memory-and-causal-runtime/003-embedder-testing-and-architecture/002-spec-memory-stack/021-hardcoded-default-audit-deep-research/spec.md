---
title: "Spec: 016/002/021 Hardcoded-Default Audit Deep-Research — broad sweep across spec-memory, cocoindex, skill-advisor, code-graph, rerank-sidecar"
description: "10-iter deep-research dispatch via cli-opencode + deepseek-v4-pro auditing all subsystems for the same hardcoded-default anti-pattern that 020 just closed in the spec-memory embedder. Scope: code (TS + Python + Rust), config (JSON/YAML/TOML), READMEs, INSTALL_GUIDE.md, doctor commands, skill docs, ENV_REFERENCE.md, agent definitions, manifests. Goal: enumerate every inline default that should be registry-derived (or env-var-driven) and identify ADR-implementation drift like the BAAI / jina-embeddings-v3 leftovers that triggered the 2026-05-23 incident."
trigger_phrases:
  - "hardcoded-default audit deep-research"
  - "drift sweep across subsystems"
  - "follow-on to 020 embedder default drift fix"
  - "10-iter audit cli-opencode deepseek"
  - "016/002/021 audit"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/021-hardcoded-default-audit-deep-research"
    last_updated_at: "2026-05-23T11:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Packet scaffolded; awaiting deep-research loop kickoff via /deep:start-research-loop:auto"
    next_safe_action: "Invoke /deep:start-research-loop:auto with this spec folder and 10-iter convergence target"
    blockers: []
    key_files:
      - "spec.md"
      - "research/deep-research-config.json (will be created by loop init)"
      - "research/deep-research-state.jsonl (will be created by loop init)"
      - "research/iterations/ (loop output)"
      - "research/research.md (final synthesis)"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000020a6"
      session_id: "016-002-021-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which subsystems have similar 'env → DB/config → hardcoded' resolution chains where the hardcoded fallback is unreachable in theory but stale in practice?"
      - "Are there READMEs / INSTALL_GUIDE / doctor commands documenting outdated defaults?"
      - "Do agent definitions reference deprecated model names or paths?"
      - "Does the rerank-sidecar have similar drift (Qwen3-Reranker-0.6B is canonical per CocoIndex arc 2026-05-19, but other rerankers may be hardcoded)?"
      - "Do other 'cascade probe' patterns exist with stale per-tier defaults?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/002/021 Hardcoded-Default Audit Deep-Research

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned (loop scaffolded; iterations pending) |
| Type | Deep-research audit |
| Owner | cli-opencode + deepseek-v4-pro executor (driven by `/deep:start-research-loop:auto` workflow) |
| Parent | `../spec.md` (002-spec-memory-stack) |
| Predecessor | 020-embedder-default-drift-fix (closed the spec-memory embedder leak; this packet audits everywhere else) |
| Iterations | 10 (max) — convergence threshold 0.05 on newInfoRatio |
| Executor flags | `--pure` (DeepSeek tool-name regex compat); `</dev/null` redirect when piping stdout |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 020 found a class of bug: ADR-013/014 migrated the canonical spec-memory embedder to nomic-embed-text-v1.5, but 5 inline defaults in TypeScript code stayed pointing at pre-ADR models (4 × BAAI + 1 × jina). When the resolution chain's primary steps (env var → DB → cascade probe) didn't resolve, the runtime fell through to those stale strings and crashed. Triggered the 2026-05-23 production incident.

The architectural pattern is widespread: "env → config → hardcoded" resolvers exist throughout the codebase. Without a systematic audit, similar drift may be lurking in CocoIndex (different embedder + reranker stack), skill-advisor (its own model defaults?), code-graph (parser engine config?), rerank-sidecar (Qwen3 vs jina-reranker-v3?), doctor commands (probe + repair model assumptions?), READMEs (publicly documented defaults that don't match code?), INSTALL_GUIDE (model pull instructions referencing dead defaults?), agent definitions (model + tool refs?).

Purpose: dispatch a 10-iter deep-research loop with cli-opencode + deepseek-v4-pro to enumerate every inline default across these subsystems, identify ADR-implementation drift, and produce a remediation roadmap. The loop's `research/research.md` synthesis becomes the input to a follow-on remediation packet.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- **Code surfaces**: `.opencode/skills/*/mcp_server/**/*.ts`, `*.py`, `*.rs`, `*.cjs`, `*.js` — every embedder/reranker/parser/model-loading code path
- **Config surfaces**: `opencode.json`, `.mcp.json`, `*.utcp_config.json`, `*.env*` (gitignored ones noted, not dumped), `ENV_REFERENCE.md`, `defaults.json`, `manifests`
- **Doc surfaces**: All `README.md`, `SKILL.md`, `INSTALL_GUIDE.md`, `references/**/*.md` under `.opencode/skills/`
- **Doctor command surfaces**: `.opencode/commands/doctor/**`, doctor route manifests, doctor scripts
- **Agent definitions**: `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`, `.gemini/agents/*.md`
- **ADR drift detection**: cross-reference decision-record.md files against current implementation per subsystem

Subsystems to audit (5):
1. **spec-memory** (`.opencode/skills/system-spec-kit/mcp_server/` + `shared/`) — embedder is fixed by 020, but reranker, parser, search routing may have similar patterns
2. **CocoIndex** (`.opencode/skills/mcp-coco-index/mcp_server/` — Python) — embedder + reranker + chunking + scoring defaults
3. **skill-advisor** (`.opencode/skills/system-skill-advisor/mcp_server/`) — model defaults for scoring/embedding, threshold defaults
4. **code-graph** (`.opencode/skills/system-code-graph/mcp_server/`) — parser engine defaults, indexing skip-list, fallback adapters
5. **rerank-sidecar** (`.opencode/skills/system-rerank-sidecar/`) — Qwen3-Reranker-0.6B canonical per CocoIndex arc; verify no drift

Out of scope:
- Implementing fixes (this is a research/audit packet; remediation is a follow-on)
- CocoIndex Python embedder choice itself (covered by separate ADR in `mcp-coco-index/changelog/` — nomic-CodeRankEmbed is canonical)
- Anti-patterns outside the "hardcoded default" class (e.g., generic dead code, missing tests — defer to other audits)
- Spec-folder doc drift (covered by separate sk-doc audit)
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | Deep-research loop initialized at `research/` with valid `deep-research-config.json`, `deep-research-strategy.md`, `deep-research-state.jsonl` |
| R2 | 10 iterations max, convergence threshold 0.05 on newInfoRatio |
| R3 | Each iteration produces `iterations/iteration-NNN.md` + appended JSONL delta |
| R4 | Executor: cli-opencode + deepseek-v4-pro with `--pure` flag (DeepSeek tool-name regex compatibility) |
| R5 | Per-iteration coverage: at least one of the 5 subsystems per iteration, with iter-001 broad survey and iter-002..010 focused depth |
| R6 | Final `research/research.md` synthesis with: findings table, severity classification (similar to 020's BAAI/jina P0 incident, P1 latent drift, P2 cosmetic), remediation roadmap |
| R7 | `research/resource-map.md` emitted on convergence (loop default unless `--no-resource-map` passed) |
| R8 | Continuity saved via `generate-context.js` to spec-memory MCP index |
| R9 | All loop state files present after convergence: config, JSONL, strategy, registry, dashboard, research.md, resource-map.md |
| R10 | Strict-validate PASS on this packet after loop completes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All R1–R10 satisfied.
- `research/research.md` lists every hardcoded-default site found across the 5 subsystems with severity classification.
- Remediation roadmap recommends per-finding fix shape (Shape C registry-derived helper / Shape B documented LAST_RESORT / Shape A throw-on-unconfigured) following the 020 precedent.
- Memory-graph search retrieves this packet under queries like "hardcoded default audit" and "drift across subsystems".
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Single-step: invoke `/deep:start-research-loop:auto` against this packet's spec folder. The workflow:
1. Reads this spec.md to set scope + iteration goal.
2. Initializes `research/` state files.
3. Loops one iteration at a time via cli-opencode + deepseek-v4-pro (with `--pure`).
4. Each iteration: ONE focused investigation (e.g., iter-001 = repo-wide grep for `DEFAULT_*` constants; iter-002 = CocoIndex Python defaults; etc.).
5. Reducer updates strategy/dashboard/registry after each iteration.
6. Converges on newInfoRatio < 0.05 OR hits 10 iters.
7. Synthesizes `research/research.md` + emits `research/resource-map.md`.

Per memory `feedback_deep_loop_iter_one_at_a_time.md`: one dispatch at a time, SIGKILL between if RAM pressure climbs. cli-opencode + deepseek-v4-pro is REMOTE inference (no local MPS pressure) so should be fine on this Mac.

Per memory `reference_opencode_go_credit_gated.md`: verify opencode-go workspace credit balance before dispatch. If credit-gated, fall back to cli-devin + deepseek-v4-pro (DeepSeek API direct, separate billing surface).

Per memory `feedback_opencode_pure_flag_required_for_deepseek.md`: `--pure` flag is REQUIRED for DeepSeek tool-name regex compatibility.

Per memory `feedback_opencode_run_requires_dev_null_stdin.md`: append `</dev/null` when redirecting stdout/stderr.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

Risks:
- **opencode-go credit exhaustion**: workspace credits may be 0; fallback to cli-devin --model deepseek-v4-pro (DeepSeek API direct).
- **DeepSeek API rate limits**: per-tier rate limits may extend iteration latency. Mitigation: loop is async, can pause and resume.
- **False-positive findings**: deep-research may flag historical defaults that are documented as intentional fallbacks. Mitigation: severity classification + cross-reference against ADRs in each iteration.
- **Coverage gaps**: 10 iters might not cover all 5 subsystems with equal depth. Mitigation: per-iter strategy.md "Next Focus" rotates across subsystems.

Dependencies:
- Packet 020 (precedent for "Shape C" helper pattern) — shipped.
- `/deep:start-research-loop:auto` workflow + YAML — shipped.
- Executor: cli-opencode + opencode-ai 1.14.51 (per memory: 1.15.x has InstanceRef startup bug).
- Spec-memory MCP available (for findings registry + continuity save). Note: MCP may be restarting concurrently in parent execution context.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

(See frontmatter `open_questions` — 5 broad questions the loop is investigating.)

Pre-execution clarifications resolved:
- Executor: cli-opencode + deepseek-v4-pro (user-specified)
- Iterations: 10 (user-specified)
- Scope: code + READMEs + skill docs + doctor commands + agent definitions (user-specified "broad but also focused on code")
- Severity rubric: P0 active incident / P1 latent drift / P2 cosmetic (from 020 precedent)
<!-- /ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## 9. NON-FUNCTIONAL REQUIREMENTS

- **Cost**: cli-opencode + deepseek-v4-pro per-iter ~$0.10–$0.30 estimated; 10 iters ~$1–$3 total.
- **Latency**: Each iter ~5–15 min (DeepSeek model + tool-call overhead). Total ~1–2.5 hours wall-clock.
- **Reliability**: Loop is resumable via `/spec_kit:resume` if interrupted.
- **Observability**: Per-iter dashboard.md, JSONL deltas, strategy.md updates surface progress in real time.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 10. EDGE CASES

- **Convergence before iter-10**: If newInfoRatio < 0.05 hits early, loop stops; `research.md` still synthesizes. Acceptable.
- **Subsystem absent**: If e.g. rerank-sidecar is removed before audit starts, iter notes "subsystem not found" and moves on. Not a failure.
- **DeepSeek API outage mid-iter**: stuck_recovery event fires; loop pauses; resumable.
- **Spec-memory MCP unavailable**: continuity save fails non-blocking; manual save deferred via `/memory:save` post-convergence.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 11. COMPLEXITY

| Dimension | Score | Justification |
|---|---|---|
| Investigation scope | High | 5 subsystems × multiple code/doc surfaces |
| Iterations needed | Medium | 10-iter cap; convergence-driven |
| Executor complexity | Medium | cli-opencode + DeepSeek API + `--pure` flag |
| Synthesis difficulty | Medium | Cross-subsystem patterns require comparison |
| Total | **Medium-High** | Bounded by loop convergence + 10-iter cap |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:cross-links -->
## 12. CROSS-LINKS

- **Predecessor**: `../020-embedder-default-drift-fix/` (the spec-memory embedder fix that motivated this audit)
- **Sibling**: `../004-spec-memory-embedder-bake-off/decision-record.md` (ADR-001..ADR-013 origin)
- **Sibling**: `../015-cascade-reorder-and-nomic-hf-local-default/` (ADR-014)
- **Loop entrypoint**: `/deep:start-research-loop:auto` (canonical invocation)
- **Loop workflow YAML**: `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml`
- **Loop reducer**: `.opencode/skills/deep-research/scripts/reduce-state.cjs`
- **Executor config schema**: `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts`
- **Operational memory**: `feedback_opencode_pure_flag_required_for_deepseek.md`, `feedback_opencode_run_requires_dev_null_stdin.md`, `reference_opencode_go_credit_gated.md`, `feedback_deep_loop_iter_one_at_a_time.md`
<!-- /ANCHOR:cross-links -->
