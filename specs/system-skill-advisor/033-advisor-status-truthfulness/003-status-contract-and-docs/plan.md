---
title: "Implementation Plan: Phase 3: status-contract-and-docs"
description: "State the trusted-mutation gate on the pages that enforce it, correct the scorer reference against the current source, declare the phrase-boost bound beside the map, settle the routing-phrase source, and add an opt-in fail-soft embeddings health surface to advisor_status."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: status-contract-and-docs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ESM in the advisor runtime; Markdown contracts; HTTP GET against the local model server |
| **Framework** | Advisor CLI over the daemon; Zod schemas; feature-catalog documentation |
| **Storage** | Configuration and runtime state only; no persistence changes |
| **Testing** | Vitest for runtime changes; `rg`-based citation checks for docs; live CLI calls for the health surface |

### Overview
Fix the contracts where they are read. The trusted gate lands on the mutating commands' pages. The scorer reference is re-measured against the current `explicit.ts` at edit time and its examples are corrected. The phrase bound is declared beside `PHRASE_BOOSTS` and pinned by the existing scorer suite. The routing-phrase source decision follows a reader inventory. The embeddings health surface is added as an optional output object, wired through the handler, declared in the CLI manifest (which currently blocks even the existing semantic option), and documented.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract declaration beside the implementation it describes, with an additive optional status surface.

### Key Components
- **Mutating command pages** (`feature-catalog/cli-surface/advisor-rebuild.md`, `skill-graph-scan.md`): state the enforced trust gate.
- **Scoring reference** (`references/scoring/advisor-scorer.md`): cites the current explicit-lane source.
- **`explicit.ts`** (`runtime/lib/scorer/lanes/explicit.ts`): the `PHRASE_BOOSTS` map and the bound declared beside it.
- **Routing-phrase readers** (`metadata-sanitizer.ts`, `doc-frontmatter.ts`, `ci-skill-root-metadata.cjs`): the readers the source decision must cover.
- **`AdvisorStatusOutputSchema` and `readAdvisorStatus`**: the optional embeddings health object.
- **CLI manifest** (`skill-advisor-cli-manifest.ts`): the input contract that must expose the health option.
- **Model server `/api/health`** (`hf-model-server.cjs`): the read-only source of the server half of the health facts.

### Data Flow
Docs and the phrase bound are single-surface edits. For health: a CLI call asks for embeddings health → the handler resolves the provider configuration and probes the model server read-only with a short timeout → the result, ready or unavailable, passes the strict output schema → JSON envelope. The probe never loads a model and never blocks a call that did not ask for it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-rebuild.md`, `skill-graph-scan.md` | Describe the commands without the trust gate | update | `rg -n -- "--trusted" <both pages>` returns the requirement and the exit-64 refusal |
| `references/scoring/advisor-scorer.md` | Cites moved ranges and stale examples | update | re-measure `rg -n "TOKEN_BOOSTS|PHRASE_BOOSTS|review-plus-write-disambiguation" explicit.ts` against the page |
| `explicit.ts` | `PHRASE_BOOSTS` with no declared bound | update | scorer suite check fails on an out-of-bound value |
| Routing-phrase readers | Read graph metadata or reference docs | update only per the recorded decision | `rg -n "trigger_phrases" .skilled/skills/system-skill-advisor/runtime .skilled/skills/sk-doc --glob '*.ts' --glob '*.cjs' --glob '*.py'` |
| `AdvisorStatusOutputSchema` | No embeddings object; `semanticLaneHealth` exists | update (additive optional) | new unit tests parse both present and unavailable states |
| `readAdvisorStatus` | Does not resolve provider or server health | update (fail-soft) | live CLI call with the health option |
| `skill-advisor-cli-manifest.ts` | Accepts only `workspaceRoot` and `checkArtifactIntegrity`, so `includeSemanticHealth` and `debug` are rejected with exit 64 | update | live CLI call no longer returns `Unknown parameter(s)` for the declared option |
| `hf-model-server.cjs` | Serves `/api/health` with `state`, `model`, `dim`, `device`, `loadTimeMs`, `loadStartedAt`, `loadProgressAt`, `lastSuccessfulEmbedAt`, `inFlight`, `queueDepth`, `timing`, `error` | unchanged (consumer) | probe reads the payload without loading a model |

Required inventories:
- Same-class producers: `rg -n -- "--trusted" .skilled/skills/system-skill-advisor --glob '*.md'` and `rg -n "phrase_boost_range" .skilled/commands/doctor/assets/doctor-skill-advisor.yaml`.
- Consumers of changed symbols: `rg -n "semanticLaneHealth|getProviderInfoForResolution|/api/health" .skilled/skills/system-skill-advisor .skilled/bin --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: command × trust state (trusted flag, env var, untrusted); phrase reader × source (frontmatter, graph metadata, both); health state (provider ready/disabled/fallback, server ready/loading/error/unreachable/timeout).
- Algorithm invariant: every status field that claims health is derived from an observed read with a bounded timeout; an unobserved state is reported unavailable, never assumed healthy.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Phrase bound check; embeddings health present and unavailable states; manifest input acceptance | `npm test -- tests/handlers/advisor-status.vitest.ts`; the scorer suite; `npm test -- tests/cli-exit-taxonomy.vitest.ts` |
| Integration | Live status call with the health option and with the server down; untrusted mutation refusal stays exit 64 | `node .skilled/bin/skill-advisor.cjs advisor_status --json "{\"workspaceRoot\":\"$PWD\",\"includeEmbeddingsHealth\":true}" --format json --warm-only`; `node .skilled/bin/skill-advisor.cjs skill_graph_scan --format json` |
| Manual | Read each corrected citation against `explicit.ts`; read the trusted pages against the CLI refusal message | `rg -n` checks named in the affected-surfaces table |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor runtime build | Internal | Green | Schema and handler changes stay invisible; fall back to vitest verification and record the build blocker |
| Model server instance | Internal | Green (may be down) | The populated health state cannot be observed live; the unavailable path is still verifiable and is the contract |
| Doctor proposal range | Internal | Green | The declared bound has no cross-reference; state the value in the map comment and record the divergence risk |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The health surface blocks or delays a plain status call, the phrase check fails on an intentional value, or a documentation change contradicts the enforced behavior.
- **Procedure**: Revert the touched runtime, manifest, test and documentation files; rebuild the runtime; rerun the status call and the scorer suite; confirm the pre-change contract is restored.
<!-- /ANCHOR:rollback -->


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: reader + source inventory) ──► Phase 2 (Docs + bound + health) ──► Phase 3 (Verify: live + rg checks)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implement |
| Implement | Setup | Verify |
| Verify | Implement | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Implement | Medium | 4-7 hours |
| Verification | Low | 2-3 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, no data changes
- [x] Feature flag configured: not applicable, the health surface is opt-in per call
- [x] Monitoring alerts set: not applicable, diagnostic surface

### Rollback Procedure
1. Disable the health option at the call site; the plain status path is unaffected.
2. Revert the touched files with `git checkout -- <paths>` and rebuild the runtime.
3. Rerun the status call, the scorer suite and the documentation checks.
4. Record the rollback and its reason in the phase evidence.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Reader inventory │────►│ Phrase decision  │────►│ Docs aligned     │
└──────────────────┘     └──────────────────┘     └──────────────────┘
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Health schema    │────►│ Handler + manifest│───►│ Tests + live call│
└──────────────────┘     └──────────────────┘     └──────────────────┘
┌──────────────────┐     ┌──────────────────┐
│ Source re-measure│────►│ Scorer reference │
└──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Reader inventory | None | Source-of-truth decision | Docs alignment |
| Health schema | Provider and server shapes | Optional output contract | Handler, tests |
| Handler + manifest | Schema, server probe | Reachable health surface | Live verification |
| Source re-measure | Current `explicit.ts` | Correct citations | Reference close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Embeddings health schema, handler, manifest** - 3-5 hours - CRITICAL
2. **Reader inventory and phrase-source decision** - 1-2 hours - CRITICAL
3. **Reference and trusted-page corrections** - 1-2 hours - CRITICAL
4. **Live and rg verification** - 2-3 hours - CRITICAL

**Total Critical Path**: 7-12 hours

**Parallel Opportunities**:
- Documentation corrections and the runtime health surface touch disjoint files and can run in parallel.
- The phrase-bound check can be added while the reference is being re-measured.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contracts studied | Reader inventory and source re-measure recorded | Setup |
| M2 | Contracts fixed | Trusted pages, reference, bound and health surface implemented | Implement |
| M3 | Evidence observed | Live health call both ways, rg citation checks, suite green | Verify |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Embeddings health is opt-in, fail-soft and separate from the semantic lane object

**Status**: Accepted

**Context**: The retired embeddings doctor expected `data.embeddings.provider` and `data.embeddings.modelServer` from `advisor_status`, which no longer exists; the current `semanticLaneHealth` object carries the embedder's name, coverage and dim check but no provider resolution or model-server state. The CLI manifest does not even accept `includeSemanticHealth`, so the existing object is unreachable through the CLI.

**Decision**: Add an optional `embeddingsHealth` object to the status output, requested by an explicit input option that the CLI manifest declares, built from the provider configuration and a short read-only probe of the model server. When either half is unknown, report an explicit unavailable state with the error class. Plain status calls perform no probe.

**Consequences**:
- The operator can see provider fallback and server state without a separate investigation.
- Status keeps a fail-soft contract and a bounded read; a down server degrades one optional field, never the call.
- The manifest must be updated, which also makes the existing semantic option requestable.

**Alternatives Rejected**:
- **Extend `semanticLaneHealth`**: mixes lane state with provider and server facts and keeps them behind an option the CLI cannot request.
- **Probe on every status call**: adds latency and a hard dependency on the model server to a diagnostic that must work during outages.

