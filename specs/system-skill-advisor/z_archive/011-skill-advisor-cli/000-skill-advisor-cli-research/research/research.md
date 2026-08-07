# Deep Research: Skill-Advisor CLI Feasibility (Synthesis)

- **Date:** 2026-06-06 · **Session:** `dr-20260606T135000-skill-advisor-cli` · **Mode:** single cli-codex lane (gpt-5.5, reasoning high, service tier fast), forced 10 iterations
- **Outcome:** 1/1 lane succeeded, 10/10 iterations, 10/10 KQs answered, stopReason maxIterationsReached
- **Lane report (canonical detail):** `lineages/gpt/research.md` · registry: `lineages/gpt/deep-research-findings-registry.json`

---

## 1. Verdict

**GO — build an additive, generated, handler-backed 9-tool `skill-advisor` CLI over the existing handler/compat stack**, with launcher/IPC auto-spawn for warm daemon access. MCP stays the rich primary transport (dual-stack). **NO-GO — MCP removal or blessing the current Python script as the final CLI.**

## 2. The central question: skill_advisor.py → RECONCILE, not supersede

`skill_advisor.py` (3,642 lines) stays as a **legacy compatibility facade**; the new generated CLI becomes canonical. Evidence:
- Coverage matrix: full for `advisor_recommend` (+batch/force modes/deep-routing), partial `--health`/`--validate-only`, **zero** for `advisor_rebuild` and 4 of 5 `skill_graph_*` tools (lane report §3).
- **Measured scorer parity: 10/10 identical top recommendation** local-vs-native on representative prompts — reconciliation is safe for `advisor_recommend`; it does not satisfy full tool parity.
- Keep the Python parity fixture green as a regression gate (delta D2) until every Gate-2 caller moves or explicitly chooses legacy.

## 3. Measured timings (this host, read-only)

| Path | Median | Verdict |
|---|---:|---|
| `skill_advisor.py --force-local` (one-shot) | 74.9ms | fine for manual fallback |
| `skill_advisor.py --force-native` (one-shot) | **824.8ms** | **kills per-prompt native bridge in hooks** |
| `--health` / `--validate-only` | ~50–74ms | cheap diagnostics |
| batch 10 (local or native) | ~276ms | startup amortizes well |

**Hook verdict is sharp: warm-only is mandatory.** Prompt-submit hooks must use the warm daemon, in-process compat module, or cache — never a one-shot native bridge. Existing cache-hit p95 test bar (<60ms) stays the acceptance gate.

## 4. Daemon-dependency + orphan findings

- Resident services that die per-call: FS watcher auto-rebuild, prompt cache (5-min TTL), trust-state daemon evidence, centralized telemetry sink, IPC bridge handoff (lane report §4).
- **Orphan incident class root-caused**: leak paths sit OUTSIDE normal child-exit cleanup — killed parents, stale lease/no socket, removed worktrees, resident launcher without a caller-owned reap boundary. A CLI auto-spawn path requires: owner token, process-group reaping, stale-socket probe, idle timeout, worktree-aware cleanup (delta D6).
- Graph-mutating commands (`scan`, `propagate-enhances --apply`, `rebuild`) need a trusted-caller gate, failing closed by default (delta D3).

## 5. Prior-art transfer (vs the spec-memory record)

Transfers verbatim: CLI-over-daemon shape, auto-spawn, exit map 0/1/64/69/75, warm-only hook policy, additive dual-stack rollout. Differs: codegen sources are Zod schemas + skill-graph descriptors (closest sibling to spec-memory's path); trusted-caller mutation policy and the Python-facade reconciliation are new delta classes spec-memory did not need.

## 6. Deltas and effort

**D1–D8** fully specified in the lane report §9 (generated registry, Python reconciliation + parity fixture, trusted mutation policy, warm hook path, rebuild/scan job semantics, orphan reaping, config compatibility, exit map). Effort: **medium — 3 implementation packets** (registry/parser/validation + handler-IPC/Python reconciliation + hook/plugin/doctor/lifecycle integration). Integration surface: MCP configs ×3 runtimes, 5 hook adapters (~1,437 lines), OpenCode plugin + bridge, 2 doctor routes (lane report §7).

## 7. Honest residuals

- `advisor_rebuild`/`skill_graph_scan` wall-time under mutation was NOT measured (lane was read-only) — implementation packet measures before finalizing job semantics.
- Live orphan recount blocked by sandbox (`ps` denied) — the six-orphan precedent stands as recorded incident evidence.

<!-- ANCHOR:sources -->
## Sources

- Lane synthesis: `lineages/gpt/research.md` (file:line-cited across `tools/index.ts`, `handlers/*`, `schemas/advisor-tool-schemas.ts`, `lib/daemon/watcher.ts`, `lib/prompt-cache.ts`, `scripts/skill_advisor.py`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, plugin + bridge, hooks/configs ×3 runtimes; 5-sample timing sweeps).
- Per-iteration evidence: `lineages/gpt/iterations/iteration-0{01..10}.md`.
- Orchestration: `orchestration-summary.json` (1/1 succeeded, 6.2 min), `orchestration-status.log`.
- Premise (settled prior art): `../../001-spec-memory-cli/000-spec-memory-cli-research/research/research.md` §1–14.
<!-- /ANCHOR:sources -->
