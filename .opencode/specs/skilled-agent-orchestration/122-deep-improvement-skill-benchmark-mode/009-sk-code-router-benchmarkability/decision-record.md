---
title: "Decision Record: sk-code Router Benchmarkability"
description: "Why the Lane C harness was taught to follow a referenced router doc (Option 3a-structured) instead of scraping prose tables or inlining a router into sk-code SKILL.md, and the documented limits of the flat projection."
trigger_phrases:
  - "sk-code router benchmarkability decision"
  - "3a-structured reference-following decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/122-deep-improvement-skill-benchmark-mode/009-sk-code-router-benchmarkability"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded ADR-001 (reference-following) + ADR-002 (empty-gold fixtures)"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-router-benchmarkability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: sk-code Router Benchmarkability

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

## ADR-001: Teach the harness to follow a referenced router doc (Option 3a-structured)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | User (chose Option 3, then 3a-structured), Claude |

### Context

The Lane C parser literal-scans only `SKILL.md` for `INTENT_SIGNALS`/`RESOURCE_MAP`. `sk-code` delegates its authoritative router to `references/smart_routing.md` as a deliberate "template customization surface" design, so it reported `router_unparseable` → `BLOCKED-BY-STRUCTURE` and could not be benchmarked.

### Constraints

- Must not change inline-router skills' behavior (`cli-*`, `deep-improvement`).
- Must keep genuinely router-less skills gating (a real, useful signal).
- User constraint: prefer fixing the harness over forcing `sk-code/SKILL.md` to inline a router.

### Decision

**We chose**: make `parseRouter` reference-following — when `SKILL.md` has no inline dictionaries, locate the referenced router doc (explicit pointer near a routing keyword, else conventional `references/smart_routing.md`) and parse the same dictionaries from it; and add one machine-readable `INTENT_SIGNALS`/`RESOURCE_MAP` block to `smart_routing.md` as the single source its prose tables already describe.

**How it works**: inline parse runs first and always wins; the fallback fires only when inline is empty and a `skillRoot` is supplied; the referenced block must itself yield dictionaries or the skill stays `parseable:false`. `skillRoot` is threaded to all three `parseRouter` call sites.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3a-structured (chosen)** | Robust (no fragile parsing); single source of truth; uses the exact format the harness already parses | Adds a block to a `sk-code` reference file (lightly bends "zero sk-code change") | 9/10 |
| 3a-scrape (parse prose markdown tables) | Truly zero sk-code change | Fragile: path shorthand → false dead-paths; surface-flatten guesswork; prose-sensitive | 5/10 |
| Option 1/2 (inline router into SKILL.md) | No harness change | Second source of truth / drift; fights the template-customization design | 4/10 |
| Option 4 (accept; wait for live Mode B) | Zero risk | No automated routing score today | 3/10 |

**Why this one**: it unlocks Mode A scoring deterministically while keeping the prose maps authoritative for humans and not duplicating the router into `SKILL.md`.

### Consequences

**What improves**:
- sk-code benchmark: `BLOCKED-BY-STRUCTURE` → `CONDITIONAL`; D5 `0 → 91`; `router_unparseable` `1 → 0`; orphans `94 → 3`.
- Any skill that delegates its router to a referenced doc is now benchmarkable, not just sk-code.

**What it costs**:
- The structured block is a second representation of the prose maps. Mitigation: a drift guard (`sk-code-router-sync.vitest.ts`) fails CI if the block points at a missing file, stops covering any routable doc, or omits an explicit prose-map path; the 3 router-internal docs remain honest orphans.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared parser change regresses inline skills | H | Inline-first; fallback guarded; full 218-test suite re-run green |
| Block drifts from prose maps | M | Automated drift guard `sk-code-router-sync.vitest.ts` (filesystem + explicit-prose-path coverage), not just a manual sync note |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | sk-code was unbenchmarkable |
| 2 | Beyond Local Maxima? | PASS | 4 options weighed; scrape variant rejected for fragility |
| 3 | Sufficient? | PASS | Additive fallback; minimal surface area |
| 4 | Fits Goal? | PASS | Directly enables "benchmark and optimize sk-code" |
| 5 | Open Horizons? | PASS | Generalizes to all reference-delegated routers |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `router-replay.cjs` (`parseRouter` + `findReferencedRouterDoc`), `d5-connectivity.cjs`, `contamination-lint.cjs`, `sk-code/references/smart_routing.md` §11.

**How to roll back**: `git revert` the 3 harness-script edits; the §11 block and fixtures become inert (no behavior change to sk-code itself).

---

## ADR-002: Empty-gold fixtures for sk-code Mode A

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Claude (mirrors the shipped deep-improvement fixture convention) |

### Context

Mode A replays **prompt text only**, but sk-code routes primarily on CWD + target file paths (surface detection FIRST). Worse, the contamination linter bans every router token, so a contamination-clean prompt by construction matches no router keyword and routes only to `DEFAULT_RESOURCE`. Positive intent/resource gold therefore cannot be fairly scored in Mode A.

### Decision

**We chose**: ship 2 lint-clean fixtures with **empty** `intentKeys`/`resources` gold (the shipped `deep-improvement` convention), documenting the ideal routing in each private `notes` and deferring positive gold to live Mode B.

**How it works**: empty gold is non-penalizing for D1-intra/D2 (treated as 1.0). The resulting `D3=0` is the empty-array over-routing artifact, explicitly flagged as NOT a real efficiency measurement.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Empty gold (chosen)** | Honest; non-misleading; matches shipped convention | Doesn't exercise positive recall (needs Mode B) | 8/10 |
| Non-empty "ideal" gold | Shows the routing gap | Reads as sk-code "fails" — misleading (prompt-only artifact) | 4/10 |
| Omit `resources` key | D3=1 → PASS@100 | Vacuous PASS — overclaims | 2/10 |

**Why this one**: it produces a real, non-blocked verdict (`CONDITIONAL`) without overclaiming or maligning sk-code's actual routing.

### Consequences

**What improves**: the pipeline runs end-to-end on sk-code (contamination-lint → router-replay → score → aggregate), proving the optimization works.

**What it costs**: D1-intra/D2/D3 are not yet a true routing-quality measure for sk-code. Mitigation: documented as a live-Mode-B follow-on; the structured block already encodes the gold mapping for when Mode B lands.

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Needed ≥1 scored scenario for a non-blocked verdict |
| 2 | Beyond Local Maxima? | PASS | 3 gold strategies weighed |
| 3 | Sufficient? | PASS | 2 fixtures prove the pipeline |
| 4 | Fits Goal? | PASS | Demonstrates the benchmark now functions on sk-code |
| 5 | Open Horizons? | PASS | Gold mapping ready for Mode B |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**: `sk-code/benchmark/fixtures/sk-code/*.json` (2 pairs; skill-local, runs pass `--fixtures-dir`).

**How to roll back**: delete the fixtures dir; sk-code then reports `NO-SCENARIOS` with the D5 gate still passing.
