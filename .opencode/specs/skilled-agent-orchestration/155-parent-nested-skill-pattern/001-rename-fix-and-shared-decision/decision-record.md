---
title: "Decision Record: shared/ stays in deep-loop-workflows; ai-council mismatch accepted"
description: "ADR-001 keeps the packet-shared shared/ directory in deep-loop-workflows rather than moving it into the frozen deep-loop-runtime backend (moving it would create a runtime→system-spec-kit dependency and is a semantic mismatch). ADR-002 accepts the ai-council folder ≠ SKILL.md name mismatch under one advisor identity, pending the phase-2 research."
trigger_phrases:
  - "shared stays in deep-loop-workflows adr"
  - "deep-loop-runtime frozen boundary shared"
  - "ai-council folder name mismatch accepted"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored shared/-stays and ai-council-mismatch ADRs"
    next_safe_action: "Run the 15-iteration pattern research (parent phase 2)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-001-decision-record"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: shared/ boundary and ai-council naming

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep shared/ in deep-loop-workflows; do not move it into deep-loop-runtime

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |
| **Phase** | 001 (parent-nested-skill-pattern) |

### Context

The merge that created `deep-loop-workflows` left a packet-shared `shared/` directory inside the parent skill — helpers the mode packets use in common, including `shared/synthesis/resource-map.cjs`, which **re-exports the resource-map synthesis from `system-spec-kit`**. The epic asked whether `shared/` should instead live in `deep-loop-runtime`, the frozen MCP-free backend, so that "all shared back-end logic" sits in one place.

### Constraints

- `deep-loop-runtime` is the FULL_ISOLATE_NO_MCP backend: it is frozen and **MCP-free**. "Frozen" means MCP-free — **not** `system-spec-kit`-free: the runtime already depends on `system-spec-kit` by design (`artifact-root.cjs` re-exports `system-spec-kit/shared/review-research-paths.cjs`; `executor-config.ts`/`prompt-pack.ts` import zod; the coverage/council graph DBs import better-sqlite3; the runtime `graph-metadata.json` declares a `depends_on: system-spec-kit` edge).
- Promotions into the runtime (per the 152 runtime-ownership ADR) must be **generic execution primitives** — lock adapters, artifact-root resolution, capability resolution, lifecycle taxonomy — never higher-layer synthesis.

### Decision

**`shared/` stays in `deep-loop-workflows`.** It is not moved into `deep-loop-runtime`.

### Alternatives Considered

| Alternative | Why rejected |
|-------------|--------------|
| Move `shared/` into `deep-loop-runtime` | Rejected on the **execution-vs-synthesis** axis: `deep-loop-runtime/lib` is execution-only (lock / artifact-root / capability / coverage primitives, zero renderers), whereas `emitResourceMap` is workflow output-formatting synthesis. Moving it adds an out-of-class responsibility for **zero dedup gain** (the implementation already lives in `system-spec-kit`; the packet just re-exports it). _(The dependency-based objection originally recorded here was struck — see the Amendment below.)_ |
| Move only the non-synthesis parts of `shared/` | The directory is small and cohesive; splitting it to chase a "backend purity" goal adds indirection for no functional gain and still leaves a workflows-layer concern (synthesis) needing a home. |
| Keep `shared/` in `deep-loop-workflows` (**chosen**) | Keeps synthesis at the workflows layer where it belongs (the runtime is execution-only); consistent with the 152 ADR-001 ruling that `emitResourceMap` stays a workflows-shared synthesis primitive, not a backend module. |

### Consequences

- Positive: the two-skill boundary (workflows = personas + synthesis; runtime = execution primitives) stays semantically honest — the runtime stays execution-only and MCP-free.
- Forward: the real reusable invariant is **exactly one `graph-metadata.json` per parent skill** (all nested dirs are advisor-invisible); the non-discoverable `shared/` is an incidental consequence of nesting, documented in the phase-4 `sk-doc` write-up (the `/create:parent-skill` scaffolder generates one).
- Semantic note: synthesis (assembling resource maps from research output) is a workflows concern; the runtime's job is loop execution. With no dependency-based objection (see Amendment), this semantic separation is the **entire** basis for the decision.

### Amendment (2026-06-15, post phase-2 research)

The original ADR-001 gave **two** reasons to keep `shared/` in workflows; one was factually wrong and is struck. **Struck reason:** "moving `shared/` would *create* a `runtime→system-spec-kit` dependency, violating the frozen boundary." Host verification during the phase-2 research showed that dependency **already exists by design** (`artifact-root.cjs:18` re-exports a `system-spec-kit` path helper; the runtime `graph-metadata.json` declares the `depends_on` edge; zod / better-sqlite3 imports) — "frozen" means MCP-free, not dependency-free. The **decision is unchanged** (`shared/` stays) but now rests **solely** on the execution-vs-synthesis argument, which the research's adversarial pass independently confirmed sufficient (runtime `lib` is execution-only with zero renderers; promoting `emitResourceMap` buys zero dedup). Evidence: `../research/research.md` §"The two Phase-1 corrections" + `../research/iterations/iteration-014.md`.

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: Accept the ai-council folder ≠ SKILL.md name mismatch under one advisor identity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (revisitable by phase-2 research) |
| **Date** | 2026-06-15 |
| **Deciders** | Operator + orchestrator |
| **Phase** | 001 (parent-nested-skill-pattern) |

### Context

Four packet folders were renamed so that folder name == packet `SKILL.md` `name:` (`deep-context`, `deep-research`, `deep-review`, `deep-improvement`). The fifth, `ai-council/`, has `SKILL.md` `name: deep-ai-council`, so its folder name does not match its declared name. The operator chose to keep the folder `ai-council`.

### Constraints

- Under the merged architecture only the hub `deep-loop-workflows/graph-metadata.json` is advisor-discoverable; the mode packets deliberately carry no `graph-metadata.json` (the 152 B5 keystone). Discovery keys on `graph-metadata.json`, not on folder or `SKILL.md` name — so the packet folder name is **not load-bearing for routing**.

### Decision

**Keep the folder `ai-council`** and accept the folder≠`name:` mismatch for now.

### Alternatives Considered

| Alternative | Why rejected (for now) |
|-------------|------------------------|
| Rename `ai-council` → `deep-ai-council` for uniformity | Churns another tranche of path references for zero routing benefit (the folder name is not advisor-load-bearing), and would pre-empt the phase-2 research that is chartered to define the canonical naming/discovery convention. |
| Change `SKILL.md` `name:` to `ai-council` | Diverges from the agent/command naming already shipped by the 152 merge; the mismatch is cosmetic under one-identity, so a forced edit either direction is premature. |
| Accept the mismatch, document it, defer to research (**chosen**) | Honest about the current state; lets the phase-2 research recommend a convention with evidence before any naming is locked framework-wide. |

### Consequences

- The mismatch is a known, accepted, documented exception — not drift.
- The phase-2 research will define the parent-nested-skill naming/discovery convention; if it recommends folder==name uniformly, `ai-council` is revisited then.

<!-- /ANCHOR:adr-002 -->
