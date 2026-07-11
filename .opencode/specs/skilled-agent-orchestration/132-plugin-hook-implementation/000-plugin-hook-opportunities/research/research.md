# Research Synthesis: Plugin & Hook Opportunities from Existing Skills

> **Method:** two-model deep-research fan-out — `zai-coding-plan/glm-5.2` (reasoning=max, 5 iters, converged) + `openai/gpt-5.6-sol-fast` (reasoning=high, 3 iters, converged), run through the deep-loop `fanout-run` driver. Each lineage ran its own convergent loop; this file merges and cross-checks them.
> **Question:** What additional OpenCode plugins / Claude hooks could we build from existing repo skills, grounded in a real skill and a concrete runtime surface?

---

## 1. Headline

The repo has **~30+ validation/policy scripts locked inside skills that run only in CI or on manual invocation**, and **two OpenCode plugin surfaces are completely unused** (`tool.execute.after`, `tool.register`). The single biggest opportunity is promoting existing, proven checkers to **write-time / lifecycle-boundary hooks** — immediate feedback when a violation is cheapest to fix. Both models independently landed here. The correct shape (GPT's framing, and consistent with the repo's existing `mk-deep-loop-guard` core+adapter): **skill-owned policy cores + thin runtime adapters**, advisory-first, block only deterministic high-confidence violations.

## 2. Cross-model consensus — highest confidence (both models found these independently)

| Candidate | Skill | Surface | Posture | GLM | GPT |
|---|---|---|---|---|---|
| **Git Safety / Commit Guard** | sk-git | Claude `PreToolUse/Bash` + OpenCode `tool.execute.before` | **Enforce** exact destructive forms (force-push main, `--no-verify`), warn nuanced cases; fail-open | C-1 (Tier 1) | **Rank 1** |
| **Post-Edit Quality Router** | sk-code/code-quality (+sk-doc, spec-kit) | Claude `PostToolUse/Write\|Edit` (extend existing) + OpenCode `tool.execute.after` | Advise; cheap path-based checks, deadline-bounded | C-15 (top rec) | Rank 3 |
| **Incremental Code-Graph Freshness** | system-code-graph | OpenCode `tool.execute.after` + Claude `PostToolUse` | Observe; warm-only, debounced changed-file scan | C-4 | Rank 4 |
| **External MCP Route Guard** | mcp-code-mode | OpenCode `tool.execute.before` + Claude `PreToolUse` | Warn-first; native-MCP allowlist from manifest | C-10 | Rank 6 |

These four are the safe, high-ROI core. **Recommended build order starts here.**

## 3. Single-model finds worth keeping (medium confidence — one model, sound reasoning)

**GPT-only (strong — GLM missed these):**
- **Spec Mutation Gate** — enforce the framework's Gate-3 "spec folder before file mutation" at `tool.execute.before` / Claude `UserPromptSubmit`-classify + `PreToolUse` enforce. Deny mutation only when no valid Gate-3 state exists; persist the answer per session. **This is the most valuable candidate GLM did not surface** — it turns a prose rule the framework already mandates into runtime enforcement. GPT rank 2.
- **Completion Evidence Sentinel** — verify recorded completion evidence at OpenCode `session.idle` / extend Claude's existing `Stop` owner (`session-stop.js`); *verify evidence, don't run tests* (latency). Advisory rollout.

**GLM-only (breadth — greenfield surface activation):**
- **Spec-Kit Completion State Exposer** (C-13) — first use of the entirely-unused `tool.register` surface; expose spec completion/level/checklist as a queryable read-only tool.
- **CLI Dispatch Audit Trail** (C-11) — simplest possible `tool.execute.after` activation: append-only audit log of completed `opencode run`/`claude -p` dispatches (cost/observability).
- Plus a long tail (flowchart validator, broken-link checker, frontmatter-version validator, smart-router integrity, worktree health, small-model dispatch advisory) — real but lower-tier; most fold into the unified quality router.

**Explicit disagreement (an adversarial catch):**
- GLM proposed a **Design Anti-Slop PostToolUse advisor** (C-8). GPT **explicitly rejected auto-scoring design from file writes** — sk-design audit *mandates* visual evidence + register context, so a blind post-write score would be noise. **GPT is right; drop C-8** (or reduce it to "flag hard-coded colors/gradients" only, not a design score).

## 4. Unified recommended backlog (decision-ready)

1. **Git Safety Guard** — build first. Clearest deterministic policy, highest destructive-risk reduction, adapter patterns already exist in both runtimes. Establish the **shared policy-core boundary** here and reuse it.
2. **Spec Mutation Gate** — enforce Gate 3 at mutation time (GPT's find; high value, medium effort — needs durable per-session answer state).
3. **Unified Post-Edit Quality Router** — extend the existing `claude-posttooluse.sh`; path-based dispatch subsumes comment-hygiene, frontmatter-version, placeholder, link, flowchart checks into one hook. Add the OpenCode `tool.execute.after` adapter.
4. **Incremental Code-Graph Freshness** — warm-only debounced re-index on edit (directly relevant: the graph is currently empty/stale).
5. **Activate the unused surfaces** — `tool.register` (completion-state exposer) and `tool.execute.after` (CLI dispatch audit) as low-risk greenfield.
6. **Advisory-only trials** — Completion Evidence Sentinel, MCP Route Guard, before considering any denial.

## 5. Architecture guidance (both models, GPT explicit)

- One **runtime-neutral policy/checker core** per candidate under the owning skill; thin OpenCode adapter in `.opencode/plugins/`; Claude entrypoint in `.claude/settings.json`. Mirror the existing `mk-deep-loop-guard` core + `task-dispatch-guard.cjs` split.
- **Block only deterministic, high-confidence violations; advise for semantic ones.** Fail-open on internal hook errors, fail-closed on confirmed destructive ops.
- OpenCode plugins **never** write stdout/stderr (TUI corruption) — bounded context or append-only logs only. Keep prompt/edit hooks bounded, cached, deadline-aware; never cold-start daemons from prompt-time paths.
- **Extend existing Claude owners** (`PostToolUse`, `Stop`) rather than registering duplicate entries.

## 6. Surface & blast-radius shape

- **Unused surfaces to activate:** `tool.execute.after` (0 plugins today), `tool.register` (0 today) — highest-leverage, zero crowding.
- **Saturated (avoid another entry):** `experimental.chat.system.transform` (4 plugins), `session.created`/`event` (6).
- **Blast radius:** portfolio is overwhelmingly observe/advise. Only **2 enforce** candidates (Git Safety, Spec Mutation Gate), both deterministic + fail-open. **Zero** mutate-via-hook candidates proposed. Keep the observe-first posture; gate any enforcement behind opt-in env (the `MK_DEEP_LOOP_GUARD_REJECT` pattern).

## 7. Provenance & confidence

- **Consensus items (§2):** 2/2 models, independent loops → build with confidence.
- **Single-model items (§3):** 1/2 models; Spec Mutation Gate + Completion Sentinel are GPT's and well-grounded; the GLM tail is real but lower priority.
- Both loops passed their own quality guards (source diversity, focus alignment, no weak single source) and converged (GLM 5 iters newInfoRatio 1.0→0.3; GPT 3 iters 1.0→0.72). Full per-iteration detail + citations in `lineages/glm52/` and `lineages/gptsol/`.
- **Not done (out of research scope):** implementation, smoke tests, false-positive measurement — GPT's §13 validation plan is the next-phase checklist.

---

<!-- ANCHOR:sources -->
## Sources

Per-lineage convergent research records and iteration logs this synthesis merges and cross-checks:

- GLM-5.2 lineage: `research/lineages/glm52/research.md` (iterations from `research/lineages/glm52/iterations/iteration-001.md`; driver log `research/lineages/glm52/logs/fanout-lineage.out`)
- GPT-5.6-sol lineage: `research/lineages/gptsol/research.md` (iterations from `research/lineages/gptsol/iterations/iteration-001.md`; driver log `research/lineages/gptsol/logs/fanout-lineage.out`)
<!-- /ANCHOR:sources -->
