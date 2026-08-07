---
title: "Decision Record: Reasonix-Style Pi Caching Go/No-Go"
description: "Go/No-Go decision for building a Reasonix-style Pi prompt-caching plugin, from Phase 1 research plus live source verification. Verdict: NO-GO on a new plugin because the proposed capability already ships as the pi-cache-optimizer package; conditional GO only for a source audit and controlled benchmark of that existing package. Build phases 3+ are not authored."
trigger_phrases:
  - "pi caching go no-go decision"
  - "reasonix pi decision record"
  - "pi-cache-optimizer audit"
  - "caching build gate closed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/002-synthesis-and-decision"
    last_updated_at: "2026-08-07T06:22:01Z"
    last_updated_by: "spec-author"
    recent_action: "Recorded NO-GO decision from Phase 1 research + live source verification"
    next_safe_action: "Close the packet, or author a pi-cache-optimizer audit spike if the operator wants it"
    blockers: []
    key_files:
      - "decision-record.md"
      - "../001-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-cli-039-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The lumo.md broad Reasonix-parity plugin is a NO-GO; the useful narrow scope already exists as pi-cache-optimizer."
---
# Decision Record: Reasonix-Style Pi Caching Go/No-Go

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: NO-GO on a new Reasonix-style Pi caching plugin

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-06 |
| **Deciders** | Operator; Phase 1 deep-research (3 GPT-5.6 lineages); live source verification |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `lumo.md` capture proposed building a "Reasonix-like" all-in-one Pi plugin (DeepSeek prefix caching, Context Engine v2, MCP, plan mode, checkpoints, cost control) on the strength of uncited figures: a 99.8% cache-hit rate, a $61 to $12 single-day cost drop, and 70 to 90% Pi savings. Phase 1 ran three independent cli-codex lineages (SOL high, TERRA max, LUNA max), 20 non-converging iterations each, to test those claims and scope the real gap. This record turns that evidence into a build decision.

### Constraints

- Reasonix's headline numbers are project-published claims with no request trace, price date, or independent benchmark, so they cannot anchor a product decision.
- Provider cache semantics differ across DeepSeek, Anthropic, and OpenAI-compatible endpoints, so a single provider-agnostic cache engine is not achievable.
- A community package, `pi-cache-optimizer`, already occupies the useful narrow scope (live-verified real at `github.com/jiangge/pi-cache-optimizer` and `pi.dev/packages/pi-cache-optimizer`).
- Phase 1 lineages ran without live web search, so their URLs were model recall; the three decision-critical URLs were independently re-verified live (all real). Remaining citations stay at recall confidence.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: NO-GO on building a new Reasonix-style Pi caching plugin, with a conditional GO only for a source audit and controlled A/B benchmark of the existing `pi-cache-optimizer`.

**How it works**: No build phases (3+) are authored. If the operator wants to pursue caching value, the next step is a small, separate audit spike that pins versions, benchmarks `pi-cache-optimizer` on a real workload, and recommends adopt / contribute-upstream / greenfield only if that audit finds a concrete missing capability (for example final-wire cache diagnostics) that cannot be contributed to the existing package.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **NO-GO on a new plugin; audit the existing package** | Avoids duplicating a maintained MIT package; keeps effort proportional to unproven value | Depends on a follow-up audit to capture any real caching win | 8/10 |
| Broad Reasonix-parity plugin (the lumo.md proposal) | Matches the original ask | MCP, plan mode, context engine, and rewind are separate products; parity claims rest on unverifiable numbers; all three lineages rejected it | 2/10 |
| Narrow greenfield observe-first cache plugin | Focused, useful telemetry scope | `pi-cache-optimizer` already covers stable-prefix ordering, cache-key fallback, proxy warnings, and cache stats; greenfield duplicates it | 4/10 |
| Provider-agnostic cache engine | Attractive on paper | Provider activation and accounting semantics differ; not achievable as a single engine | 1/10 |

**Why this one**: The narrow scope that survives scrutiny already exists as a maintained package, and the broad scope rests on numbers that Phase 1 could not reproduce. Building either a broad clone or a greenfield narrow plugin spends effort against unproven or already-solved value.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No engineering effort is committed to an unproven or duplicated capability.
- The originating `lumo.md` capture is now resolved with cited, partly live-verified evidence instead of marketing figures.

**What it costs**:
- Any genuine caching win stays unrealized until an audit spike runs. Mitigation: the conditional GO defines exactly that spike, ready to author on request.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `pi-cache-optimizer` is unmaintained or unsafe on the target Pi version | M | The audit spike pins versions and inspects source before any adoption |
| A real final-wire diagnostic gap exists that the package cannot cover | L | The audit's greenfield branch fires only on a concrete, un-contributable gap |
| Reasonix numbers turn out reproducible on a specific workload | L | Revisit trigger below reopens the decision with a measured baseline |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | FAIL | No current problem forces a new plugin; the capability exists as `pi-cache-optimizer` |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives scored; three lineages plus live checks explored |
| 3 | **Sufficient?** | PASS | The audit-first path is the simplest that still captures any real value |
| 4 | **Fits Goal?** | PASS | Resolves the lumo.md question without committing speculative build effort |
| 5 | **Open Horizons?** | PASS | Leaves a clean, defined re-entry (the audit spike) if evidence changes |

**Checks Summary**: 4/5 PASS (Necessary intentionally FAIL, which is what drives the NO-GO)
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Parent phase map build gate closes: phases 3+ (design/implement/verify a new plugin) are NOT authored.
- Packet 039 is decision-complete; `lumo.md` is retained as the originating capture.

**How to roll back**: This is a decision, not code, so there is nothing to revert. To reopen, author a new phase child (an audit spike or a build packet) and record a superseding ADR here.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## Claim Resolution (carried from Phase 1 + live checks)

| lumo.md claim | Final status | Basis |
|---|---|---|
| Reasonix exists and is prefix-cache-engineered | Verified (live) | `github.com/esengine/DeepSeek-Reasonix` fetched live; README confirms DeepSeek-native, prefix-cache design |
| `pi-cache-optimizer` exists | Verified (live) | `github.com/jiangge/pi-cache-optimizer` + `pi.dev/packages/pi-cache-optimizer` fetched live; MIT, real package |
| Reasonix ~99.8% cache hit rate | Unverified project claim | Project-published only; no request trace or independent benchmark (research.md §4) |
| Reasonix $61 to $12 cost drop | Unverified project claim | Direction plausible under DeepSeek cache discounts; no billing reconciliation (research.md §4) |
| Pi has provider-agnostic prompt caching | Refuted (overbroad) | Pi exposes provider-aware primitives; wire semantics differ per provider (research.md §4, §6) |
| Pi saves 70 to 90% on repetitive workloads | Refuted as a general claim | No primary Pi benchmark; savings are workload- and provider-specific (research.md §4) |
| Cross-agent cache sharing is automatic | Refuted / conditional unknown | Governed by namespace, routing, privacy, attribution (research.md §4) |
| Pi lacks Context Engine v2 / MCP / plan mode / rewind | Mixed | Pi has sessions, branches, compaction, extensions; MCP and plan mode are intentionally out of core (research.md §4, §8) |

## Build Gate

Phases 3+ are gated on this decision and are **NOT authored** (NO-GO). Re-entry requires a new phase child and a superseding ADR.

## Revisit Triggers

- A measured A/B baseline shows a material caching win on the real target workload that `pi-cache-optimizer` does not already deliver.
- `pi-cache-optimizer` is found unmaintained or unsafe on the target Pi version, and no equivalent package exists.
- A concrete final-wire diagnostic need appears that cannot be contributed upstream.

## Cross-References

- **Upstream evidence**: `../001-research/research/research.md` (claim ledger §4, gap table §8, feasible scope §9, decision inputs §13)
- **Originating capture**: `../lumo.md`
