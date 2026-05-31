---
title: "Decision Record: Deep-loop fan-out remediation (009)"
description: "The five architecture decisions governing the fan-out remediation: verbatim execution, canonical executor field, env-allowlist reuse, full-anchor docs, and the byte-identical parity gate."
trigger_phrases:
  - "123 phase 009 decisions"
  - "fanout remediation adr"
  - "fanout fix decision record"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored 5 ADRs for the fan-out remediation"
    next_safe_action: "Implement against ADR-001..005; hold the parity gate"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Deep-loop fan-out remediation (009)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: CLI lineage execution — verbatim command vs synthesized prompt

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |
| **Deciders** | Operator + review chain |

<!-- ANCHOR:adr-001-context -->
### ADR-001 Context

Packet 123 §2 decided "Option B: orchestrator shells the existing command per lineage … so the YAML loop runs verbatim." The shipped code instead synthesizes a natural-language prompt (`buildLoopPrompt`, `fanout-run.cjs:122`) and hands it to the CLI executor — a verified divergence (C-03). `lineage.iterations` is also used only to size the timeout, never as a real iteration cap. Constraints: must honor the approved §2 design or formally amend it; for CLI kinds there is a real per-kind command, so synthesizing a prompt leaves parsing/validation/session-binding/iteration-cap to model interpretation.

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### ADR-001 Decision

Implement true verbatim per-CLI-lineage execution — replace prompt synthesis with a real command invocation built from a synthesized per-lineage config; forward `lineage.iterations` as the max-iterations cap.

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### ADR-001 Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Verbatim command (chosen)** | Honors §2; deterministic; no model-interpretation drift; real iteration cap | Largest change (L/High); per-kind command paths | 8/10 |
| Amend §2 to accept prompt-synthesis | Cheap, doc-only | Leaves correctness to model interpretation; contradicts design intent | 5/10 |
| Defer C-03 | Unblocks the rest now | Leaves a known contract violation in shipped code | 4/10 |

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### ADR-001 Consequences

**Positive**: deterministic lineage execution; honors the design; restores the iteration cap.
**Negative**: largest/riskiest change — sequenced last, behind the parity gate, with per-kind tests.
**Risk**: a CLI kind regresses (M) — mitigated by per-kind tests and sequencing after the spawn rewrite stabilizes.

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### ADR-001 Five-Checks Validation

1. **Simplicity** — reuses the existing command paths per kind; no new dispatch framework.
2. **Reversibility** — opt-in layer; revert to prompt synthesis restores prior behavior without data migration.
3. **Scope** — confined to `fanout-run.cjs` lineage build; single-executor path untouched (ADR-005).
4. **Evidence** — grounded in the verified C-03 finding (008 review) and packet §2's written Option-B decision.
5. **Risk** — highest-risk item, so sequenced last and gated by per-kind tests + the parity gate.

<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### ADR-001 Implementation Notes

**Affected**: `scripts/fanout-run.cjs:122-146,315` (`buildLoopPrompt` → verbatim command + config; iteration cap forwarding). **Test**: a CLI lineage invokes the real command with the iteration cap, not a synthesized prompt. **Rollback**: revert to prompt synthesis.

<!-- /ANCHOR:adr-001-impl -->

---

## ADR-002: Canonical executor field name (.kind)

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |

### Context
Three layers disagree (U-01): review command docs write `config.executor.type`; the review YAML predicate reads `config.executor.kind`; the loader (`executor-config.ts:87-112`) renames `type→kind` only inside `parseExecutorConfig`, with no confirmed write-back before the predicate. A default native review can therefore mis-branch into the CLI path. Research is self-consistent on `.type`; review is the broken side.

### Decision
Standardize on `.kind` everywhere — command docs, both YAMLs' predicates, and code — and ensure the predicate reads the loaded/normalized config.

### Alternatives
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`.kind` canonical (chosen)** | Matches loader + schema; least conceptual debt | Touches 6 command files | 8/10 |
| `.type` canonical | Smaller doc churn | Keeps a deprecated name as the surface; fights the loader | 5/10 |

### Consequences
Positive: native default branches correctly; one name across docs/YAML/code. Negative: atomic change across review + research consumers (mitigated by changing both atomically + native-run trace).

### Implementation
**Affected**: `deep_start-{review,research}-loop_{auto,confirm}.yaml`, `start-{review,research}-loop.md`. **Rollback**: revert the field rename as one unit.

---

## ADR-003: Child-process env policy — reuse the existing allowlist

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |

### Context
Each lineage subprocess currently receives the full parent `process.env` (ENV-LEAK, `fanout-run.cjs:345`), bypassing the runtime's env discipline. A reusable allowlist already exists and is used by the single-executor path: `buildExecutorDispatchEnv` (`executor-audit.ts:466`), carrying common-safe vars + per-kind auth prefixes (`CODEX_`/`OPENAI_`/`CLAUDE_`/`DEVIN_`).

### Decision
Replace the blanket `{...process.env}` at the lineage spawn site with `buildExecutorDispatchEnv()` plus the per-kind state vars.

### Alternatives
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse allowlist (chosen)** | Strongest guarantee; least new code; runtime-consistent | Must confirm it carries every needed auth prefix | 9/10 |
| New denylist | Won't drop an unlisted var | Weaker; diverges from the rest of the runtime | 5/10 |

### Consequences
Positive: secrets no longer leak to lineages; fan-out env handling matches single-executor. Negative: if a kind needs an unlisted var, extend the allowlist (one-line). (Supersedes an earlier denylist lean made under the wrong assumption that no helper existed.)

### Implementation
**Affected**: `scripts/fanout-run.cjs:345`. **Rollback**: restore blanket env (opt-in layer).

---

## ADR-004: Author this phase with full Level-3 anchors

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |

### Context
Existing packet-123 children (001–008) are lean docs that fail `validate.sh --strict`. The operator asked for Level-3 docs that pass strict validation. The authoritative anchor set is the per-doc manifest at `templates/manifest/.opencode/manifests/*.md.json` (which diverges from both `spec-kit-docs.json` and the `examples/level_3/` files).

### Decision
Author all 009 docs with the full Level-3 anchor set + ALL-CAPS headers from the per-doc manifest, so `validate.sh --strict` is green — accepting visual divergence from the lean siblings.

### Alternatives
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full anchors (chosen)** | Passes strict; correct Level-3 contract | Diverges from lean siblings | 8/10 |
| Lean, match siblings | Visually consistent | Fails strict like 001–008 | 4/10 |

### Consequences
Positive: 009 is the first strict-passing child; sets the upgrade pattern. Negative: cosmetic divergence (acceptable).

### Implementation
**Affected**: all 009 docs. **Rollback**: n/a (doc authoring).

---

## ADR-005: Single-executor byte-identical parity gate

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-31 |

### Context
Packet 123 §2 made "single-executor default; fan-out opt-in; default path byte-identical" a hard parity gate. The C-01 async-spawn rewrite touches the dispatch hot path and could perturb the default path.

### Decision
Every change must leave the single-executor path byte-identical to pre-change `main` (config, state.jsonl modulo timestamps, iteration md, final report). The C-01 rewrite touches the INNER fan-out worker only; the TSX self-respawn `spawnSync` stays synchronous (N-02).

### Alternatives
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hard parity gate (chosen)** | Protects the default path everyone uses | Constrains the refactor | 10/10 |
| Best-effort parity | More refactor freedom | Risks regressing the default path | 3/10 |

### Consequences
Positive: default users unaffected by fan-out fixes. Negative: the async rewrite must be surgically scoped to the fan-out worker.

### Implementation
**Affected**: `scripts/fanout-run.cjs` (inner worker only). **Verification**: parity diff before completion (CHK-025).
