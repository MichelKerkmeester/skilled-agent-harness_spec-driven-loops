---
title: "Decision Record: §4.A — Fan-out executor dispatch strategy (packet 123)"
description: "Resolves how each executor kind participates in fan-out: CLI kinds via headless subprocess pool, native via sequential YAML agent dispatches. All kinds supported; mixed configs work."
trigger_phrases:
  - "123 fanout executor dispatch"
  - "fanout native dispatch decision"
  - "4A executor fan-out strategy"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Decision Record: §4.A — Fan-out executor dispatch strategy

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Each executor kind uses its own native dispatch mechanism

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-30 |
| **Deciders** | User + Claude (packet 123 session 3) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Fan-out runs N executor "lineages" in parallel, each converging independently in its own
isolated sub-packet. The blocker: the deep-research/deep-review loop has no headless binary —
it is agent/YAML-orchestrated. Specifically the `native` path in `step_dispatch_iteration`
calls `agent: deep-research/deep-review`, which cannot run unattended in a subprocess pool.

The user's requirement: every executor type (including `native`) must support fan-out using
its OWN native sub-agent mechanism. Configs may mix types freely.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-constraints -->
### Constraints

- Single-executor path must remain byte-identical (hard parity gate at Phase 6).
- No new schema columns in `deep-loop-graph.sqlite` (triggers destructive migration).
- Same-kind replicas must not collide on lockfiles (`SPECKIT_<KIND>_STATE_DIR` isolation).
- Comment hygiene: no spec-path or tracking-id labels in code comments.
<!-- /ANCHOR:adr-001-constraints -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Each executor kind dispatches fan-out lineages via its own native mechanism:**

| Kind | Fan-out mechanism | Parallelism |
|------|-------------------|-------------|
| `cli-codex` | `fanout-run.cjs` spawns N headless `codex exec` subprocesses, each running the full loop with `--artifact-dir-override` | True parallel (pool-capped) |
| `cli-claude-code` | `fanout-run.cjs` spawns N headless `claude -p` subprocesses, each running the full loop | True parallel (pool-capped) |
| `cli-opencode` / `cli-gemini` / `cli-devin` | Same pattern — pool-spawned subprocess per lineage | True parallel (pool-capped) |
| `native` | YAML `step_fanout_spawn_native` dispatches N sequential `agent: deep-research/deep-review` runs with isolated dirs | Sequential (in-context, expected for count 1–3) |

Mixed configs: CLI lineages run via `fanout-run.cjs` pool (background, headless); native
lineages run as sequential YAML agent dispatches. The YAML `step_fanout_spawn` coordinates
both tracks, then jumps directly to `phase_synthesis` (skipping `phase_init` / `phase_main_loop`).

The key enabling mechanism for all types: `config.fanout_lineage_artifact_dir` override.
When present in `step_resolve_artifact_root`, the loop binds `artifact_dir` to the override
directly, writing to `{base_artifact_dir}/lineages/{label}/` without touching other lineages.

"Native codex sub-agents" = headless `codex exec` processes — each subprocess IS a native
codex agent running the loop autonomously. "Native claude sub-agents" = headless `claude -p`
processes. For `native`, the sub-agents are literal `@deep-research`/`@deep-review` agents.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

**Option A (original §4.A plan):** Native stays single-executor only; parallel mode = CLI only.
Rejected because the user requires native fan-out to work.

**Option B-JS-loop (handover §4.A Option B-spawn original):** `fanout-run.cjs` re-implements
loop control-flow in JS (calling runtime pieces as functions/subprocesses per iteration).
Rejected in favour of "invoke the full loop command per lineage" — simpler, reuses the whole
YAML unchanged, no partial reimplementation risk.

**Option C (agent-orchestrated pool):** Orchestrating agent dispatches all lineages as sub-agents.
Rejected for CLI kinds — they're pooled headless subprocesses; not agent dispatches.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- `fanout-run.cjs` is a pool driver that spawns one CLI subprocess per lineage running the
  full loop. Subprocess command is constructed per `resolveClaudePermissionMode` /
  `resolveCodexSandboxMode` from `executor-config.ts`.
- `step_fanout_spawn_native` in all 4 YAMLs handles native lineages sequentially.
- `step_resolve_artifact_root` in all 4 YAMLs gains a `config.fanout_lineage_artifact_dir`
  override branch (single-executor path unchanged when the field is absent).
- Native fan-out is NOT pooled — it's sequential agent dispatches. For high parallelism,
  use CLI executor kinds. Native fan-out is appropriate for 1–3 lineages.
<!-- /ANCHOR:adr-001-consequences -->
