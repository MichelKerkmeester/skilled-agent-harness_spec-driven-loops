---
title: "Decision Record: Smart-Routing Benchmark Program"
description: "Architecture decisions for the smart-routing benchmark program: decentralize sk-code surface-child routing with the parent as an enforced union projection, use per-child sk-doc-shape playbooks (not fixtures) as Type-1 gold, and treat live Mode-B as advisory with a circularity meter."
trigger_phrases:
  - "smart routing benchmark decisions"
  - "decentralize child routing"
  - "union projection drift guard"
  - "playbook vs fixture gold"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program"
    last_updated_at: "2026-07-08T20:40:28Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the full 20-run routing benchmark matrix"
    next_safe_action: "Wire the Mode-A configs + drift guard into a CI job (only remaining follow-up)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts"
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/skills/system-deep-loop/deep-ai-council/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Trim Mode-B to representative-per-family permanently, or run all 10 once the deep-loop hub unblocks?"
    answered_questions:
      - "Both hubs, each child its own router+gold, both modes — locked before build"
---
# Decision Record: Smart-Routing Benchmark Program

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Decentralize sk-code surface-child routing; parent becomes an enforced union projection

**Status**: Accepted

<!-- ANCHOR:adr-001-context -->
**Context**: `sk-code` deliberately centralized resource routing in the parent `shared/references/smart_routing.md` (a two-layer hub run: `hub-router.json` picks the child mode; `loadSurfaceRouter` reads `smart_routing.md`; `assembleResources` slices by the literal `code-webflow/` / `code-opencode/` prefixes against `registryPacketRoots`). That means the surface children (`code-webflow`, `code-opencode`) had only a descriptive REFERENCE MAP — no parseable inline router — so `router-replay --skill <child>` could not score their intra-routing recall in isolation.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
**Decision**: Move each surface child's slice of the parent `RESOURCE_MAP` INTO that child's `SKILL.md` as an inline `## 2b. SMART ROUTING (machine-readable)` block (`INTENT_SIGNALS` + `RESOURCE_MAP` over child-relative paths). Rewrite the parent `smart_routing.md` `RESOURCE_MAP` as the **mechanical union** = each child map re-prefixed with `code-webflow/` / `code-opencode/`, plus the parent-owned universal/shared/Motion tier.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
**Alternatives considered**:
- *Additive duplication* (leave the parent authoritative, copy a router into each child): rejected — it needs bidirectional guards anyway, so it converges on the projection model with more drift surface.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
**Consequences**: The hub run stays **byte-identical** (proven by a P0-vs-P3 baseline diff). A drift guard must now enforce the projection or the two copies silently diverge. `system-deep-loop` is unaffected — it has no `smart_routing.md`; its children already own their routers.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
**Five checks**: (1) *Simplicity* — one authoritative source per child, parent is derived. (2) *Systems* — the drift guard is the only new coupling; the hub run is unchanged. (3) *Bias* — measured (byte-identical baseline), not assumed. (4) *Sustainability* — a future child edit auto-fails CI if the projection drifts. (5) *Scope* — sk-code only; `system-deep-loop` needs no change.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
**Implementation**: child `## 2b` routers in `sk-code/{code-webflow,code-opencode}/SKILL.md`; parent union in `sk-code/shared/references/smart_routing.md`; enforcement in `.../skill-benchmark/tests/sk-code-router-sync.vitest.ts` (7/7 green).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: The drift guard enforces `parent == union(children) + parent-owned tier`

**Status**: Accepted

**Context**: Once routing is duplicated between children and the parent projection, nothing structural stops them from drifting.

**Decision**: Extend `.../skill-benchmark/tests/sk-code-router-sync.vitest.ts` with a describe block that asserts, for the surface set `['code-webflow','code-opencode']`: (1) every child router is self-parseable and non-empty; (2) every child-declared path exists on disk; (3) `parent RESOURCE_MAP == union(re-prefix(child maps)) + PARENT_TIER_ALLOWLIST`. The allowlist enumerates the parent-owned, non-prefixed tier (`references/universal/*`, `shared/assets/patterns/README.md`, `code-review/assets/code_quality_checklist.md`).

**Consequences**: A routing edit to either a child or the parent that breaks the projection fails CI. `parseRouter` takes SKILL.md **text** (not a path) — the guard reads the file then parses, matching the engine's `parseRouter(readFileSync(skillMd), skillRoot)` contract.

---

## ADR-003: Type-1 gold is per-child sk-doc-shape PLAYBOOKS, not fixtures

**Status**: Accepted

**Context**: The engine scores Type-1 recall two ways. `runLegacyFixtures` (`--fixtures-dir`) treats a router-keyword leak in a prompt as a **hard** contamination failure (score 0). `runPlaybook` (the default corpus) treats the same leak as **advisory** (still scores). Type-1 prompts must contain the intent's routing keywords to fire the router — which a fixture would then hard-fail.

**Decision**: Author Type-1 gold as per-child **playbooks** in the sk-doc shape (per-scenario `.md` with frontmatter `id/category/title/expected_intent/expected_resources` + a body `- Prompt:` line). The loader reads `expected_intent` + `expected_resources` from frontmatter and the prompt from the `Prompt:` line; no root index table is required.

**Alternatives considered**:
- *Fixtures with decontaminated prompts*: rejected — decontaminated prompts route to no mode (silent default → `BLOCKED-BY-ROUTING`), and keyword prompts hard-fail contamination. Both directions are unscoreable in router mode.

**Consequences**: `expected_resources` must be the exact child-relative paths copied verbatim from that intent's `RESOURCE_MAP`. Overfitting risk is mitigated by ADR-005's circularity meter.

---

## ADR-004: `code-quality` is a hybrid — thin Type-1 router + target-path unit test

**Status**: Accepted

**Context**: `code-quality` routes primarily by **target path**, not prompt keywords. Fabricating keyword routing from a path table would be dishonest gold.

**Decision**: Add a thin inline Type-1 router over only its prompt-expressible quality intent (`QUALITY` → `assets/code_quality_checklist.md`). Its real target-path precision stays a unit test — NOT a Mode-A dimension. Its parent→child (Type-2) discoverability is the existing hub `quality` signal.

**Consequences**: `code-quality`'s Mode-A D1intra reflects its single thin route (`intentRecall` labels can read low on the single-intent router even when the route fires — confirmed via router-replay); this is an accepted scorer-label nuance, not a routing miss. It is also the target with the largest Mode-A→Mode-B gap (see ADR-005), which correctly flags it as thin rather than a broad capability.

---

## ADR-005: Mode-B (live) is advisory; publish a circularity meter (Mode-A − Mode-B gap)

**Status**: Accepted

**Context**: Type-1 gold is authored from each child's own router, so a high Mode-A score partly measures self-consistency, not real routing capability. A live model that never saw the gold is a harder, more honest probe — but it is nondeterministic and costs a dispatch per scenario.

**Decision**: Run Mode-A (deterministic router-replay) as the CI gate and Mode-B (live `cli-opencode gpt-5.5-fast --variant high`) as advisory only. Publish a **circularity meter** = `Mode-A − Mode-B` per target. A large gap flags an overfit / thin router; a small gap indicates real capability.

**Measured (all 7 un-gated children; live `resourceRecall` in parens)**:
- `deep-research` 91→80 gap **11** (rr 1.00) · `deep-review` 93→71 gap **22** (rr 0.89) · `deep-improvement` 91→62 gap **29** (rr 0.90) — deep-loop routers hold up live (real capability).
- `code-opencode` 84→56 gap **28** (rr 0.70) · `code-webflow` 91→57 gap **34** (rr 0.51) — sk-code surface children partial.
- `code-quality` 89→31 gap **58** (rr 0.00) — thin single-route, live misses it (consistent with ADR-004).
- `code-review` 100→0 gap **100** (rr 0.00) — **most router-overfit**: perfect Mode-A, zero live corroboration.

Two components: (a) a systematic live floor — `intentRecall` is 0 for every child because the live executor never emits the gold `INTENT_SIGNALS` keys, so live `d1intra` is `resourceRecall`-only; (b) `resourceRecall` is the real live signal. The meter working as designed = `code-review`'s 100→0: a perfect deterministic score a live model does not reproduce.

**Consequences**: Mode-B divergence is never gating. If Mode-B cost must be trimmed, keep all Mode-A configs and scope Mode-B to the 2 hubs + 1 representative child per family.

---

## ADR-006: `deep-ai-council` + deep-loop hub Type-2 — deferral raised, then RESOLVED by separability

**Status**: Superseded — deferral resolved; both landed.

**Context**: `deep-ai-council` uses a tuple `INTENT_MODEL` the harness cannot parse; normalizing it to canonical `INTENT_SIGNALS` requires editing its `SKILL.md`, which in the working tree also carries a concurrent `deep-loop-workflows -> system-deep-loop` content migration (not on origin, and carrying a buggy `runtime//`). The initial call was to defer both to avoid clobbering that migration.

**Decision (revised)**: The deferral was too conservative. Two facts un-gated it: **(1) benchmarking only *reads* the `SKILL.md`** — it never requires committing the entangled file, so the runs could proceed immediately; **(2) my normalization and their migration touch *disjoint regions*** (my change = the INTENT block; theirs = prose/script-paths). So the committed `SKILL.md` was built as **origin prose + my INTENT block only** (verified: diff vs origin is INTENT-scoped, zero migration tokens) and staged via a `git hash-object` blob, leaving the working tree's concurrent edits untouched. The deep-loop hub Type-2 likewise scored cleanly against the current working tree (Mode-A 100 / Mode-B 93) — the concurrent `mode-registry.json` edits did not block a clean run.

**Consequences**: The full 20-run matrix shipped. `deep-ai-council` = Mode-A PASS 92 / Mode-B COND 76 (rr 0.91); deep-loop hub = Mode-A PASS 100 / Mode-B PASS 93. SC-004 is met. Lesson: "entangled to commit" ≠ "blocked to measure or to commit a disjoint slice" — separability + read-only benchmarking dissolved a gate that first looked hard.
