---
title: "Feature Specification: Compiled Routing — Flag Propagation & Effective Consumption"
description: "Make SPECKIT_COMPILED_ROUTING reach the advisor daemon child and make the compiled decision survive to the injected system-context, so that when 002 has promoted the closure and tri-stated the flag, default-on stops being a structural no-op end-to-end. Today the flag is stripped by BOTH child-env allowlists (launcher mk-skill-advisor-launcher.cjs:99 and bridge mk-skill-advisor-bridge.mjs:58, zero flag hits in each) so it never reaches the spawned daemon, and the compiled decision the advisor attaches additively (handlers/advisor-recommend.ts:371) is dropped at TWO independent rebuild sites: the OpenCode plugin bridge rebuilds the recommendation list through a field allowlist that omits compiledRoute (buildNativeBrief, mk-skill-advisor-bridge.mjs:539-551, zero compiledRoute hits) and the CLI AdvisorRecommendation interface (subprocess.ts) has no compiledRoute field either (zero hits). This phase (CF-ACT-1, CF-ACT-2, and the CF-ACT-10 cache slice) adds the flag to both allowlists; threads compiledRoute (or a top-level metadata.compiledRouteSummary) through the native brief builder AND the OpenCode bridge rebuild AND the CLI subprocess interface AND the hook render so the 4-action compiled outcome (route/clarify/defer/reject) survives to system-context injection; incorporates a manifest/serving-state fingerprint into the advisor-brief and engine cache keys so a manifest flip or =0 never serves a stale compiled brief; and adds e2e bridge+plugin tests with a real compiled decision (native AND no-dist launcher fallback) plus a =0 propagation kill test. Depends on 002. Additive only: routing decisions stay byte-identical to legacy, the three frozen scorer files are never edited, every step names a byte-exact/flag-based rollback, and no runtime path reads under .opencode/specs."
trigger_phrases:
  - "compiled routing flag propagation effective consumption"
  - "SPECKIT_COMPILED_ROUTING child env allowlist"
  - "compiledRoute bridge subprocess hook threading"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled to the implemented+committed state (code landed in a1cdb65d90)"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers:
      - "None for this child (implemented in a1cdb65d90); the program-level default-on cutover stays operator-gated (P4/011)."
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "None blocking — the child scope is complete; cutover timing is an operator decision (P4/011)."
    answered_questions:
      - "Thread the full compiledRoute object or a top-level metadata.compiledRouteSummary? Settled: a top-level metadata.compiledRouteSummary (implemented in a1cdb65d90)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Compiled Routing — Flag Propagation & Effective Consumption

## EXECUTIVE SUMMARY

The compiled skill-router is built and shipped, all seven hubs' activation manifests already read `servingAuthority: compiled`, and `SPECKIT_COMPILED_ROUTING` gates whether the runtime consumes that state. The 015 research pass (25 iterations, `001-research/synthesis-v1.md`, adversarially re-verified in `verification-v1.md`, reconciled in `review-v1.md`) proved that **default-on is a structural no-op end-to-end** for two reasons this phase owns:

1. **The flag can't reach the daemon (CF-ACT-2).** `SPECKIT_COMPILED_ROUTING` is absent from BOTH `CHILD_ENV_ALLOWLIST` sets — the native launcher (`mk-skill-advisor-launcher.cjs:99`) and the OpenCode plugin bridge (`mk-skill-advisor-bridge.mjs:58`) — so the standard `.env` operator path silently strips it from the spawned advisor child. A canary is impossible until both allowlists include it (CONFIRMED: zero flag hits in each file this session).
2. **The compiled decision can't reach the agent (CF-ACT-1).** The advisor attaches `compiledRoute` as an additive sibling field (`handlers/advisor-recommend.ts:371`, `{ ...recommendation, compiledRoute }`), but that field is dropped at **two independent rebuild sites**: the bridge's `buildNativeBrief` rebuilds each recommendation through an explicit field allowlist that omits `compiledRoute` (`mk-skill-advisor-bridge.mjs:539-551`, CONFIRMED zero `compiledRoute` hits), and the CLI `AdvisorRecommendation` interface in `subprocess.ts` has no `compiledRoute` field either (CONFIRMED zero hits — the second drop site). The compiled decision is destroyed before any agent boundary.

This phase makes the flag **reachable** and the decision **consumable**. It adds the flag to both allowlists; threads `compiledRoute` (or a top-level `metadata.compiledRouteSummary`) through the native brief builder, the OpenCode bridge rebuild, the CLI `subprocess.ts` interface, and the hook render so the compiled decision's 4-action outcome (route / clarify / defer / reject) survives to the injected system-context; incorporates a manifest/serving-state fingerprint into the advisor-brief and engine cache keys so a manifest flip or `=0` never serves a stale compiled brief (the CF-ACT-10 cache slice); and proves it with e2e bridge+plugin tests carrying a real compiled decision (native AND no-dist launcher fallback) plus a `=0` propagation kill test.

**This phase is P1 in the 015 DAG and depends on 002** (`002-runtime-promotion-and-status-foundation`), which promotes the resolver/engine/activation closure out of the spec tree and tri-states the flag in both read sites. Un-stripping the flag and un-dropping the decision is meaningless while the resolver still reads under `.opencode/specs` and the flag is bi-state. Every change here is **additive**: routing decisions stay byte-identical to legacy, the three frozen scorer files are never edited, every step names a byte-exact or flag-based rollback, and no runtime path this phase touches reads under `.opencode/specs`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 (P1 in the 015 P0→P4 DAG; the effectiveness prerequisite) |
| **Status** | Implemented — landed in `a1cdb65d90`, behind the still-off `SPECKIT_COMPILED_ROUTING` flag. Both allowlists updated and the compiled decision threaded through the native brief, the CLI `subprocess.ts` interface, and the hook render; routing byte-identical to legacy. The staged default-on cutover stays operator-gated (P4/011). |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Migration stage** | P1 — un-strip the flag in both child-env allowlists; un-drop the compiled decision through bridge + CLI + hook; still behind the default-off flag |
| **Blast radius** | Medium. Touches the advisor process-spawn env plumbing and the brief-render path that reaches an agent's system-context. Additive by construction (new allowlist entries, new fields, new cache-key inputs, new tests); reversible by removing those additions. No routing decision changes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

With the flag on and a hub compiled-serving, `SPECKIT_COMPILED_ROUTING` today changes zero routing decisions AND surfaces nothing, for two structural reasons this phase is scoped to fix:

1. **Dual flag-strip (CF-ACT-2).** Both spawn paths filter the child environment through an explicit `Set` allowlist that omits the flag. The native launcher builds the child env by `Object.entries(sourceEnv).filter(([key]) => CHILD_ENV_ALLOWLIST.has(key) ...)` (`mk-skill-advisor-launcher.cjs:99` declaration, `:269` filter); the OpenCode bridge does the same (`mk-skill-advisor-bridge.mjs:58` declaration, `:212` filter). Neither Set contains `SPECKIT_COMPILED_ROUTING` and neither uses prefix matching, so there is no indirect path for the flag to reach either spawned child. An operator who sets the flag in `.env` sees it silently dropped at the process boundary.
2. **Dual decision-drop (CF-ACT-1).** The advisor's `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:357`) attaches the compiled decision additively — `{ ...recommendation, compiledRoute }` (`:371`) — and returns `undefined` for a legacy sentinel (`:351`), so the field exists on the recommendation the bridge receives. But `buildNativeBrief` rebuilds the recommendation list via `data.recommendations.map((recommendation) => ({ ... }))` with a hand-listed field allowlist (`skill, kind, confidence, uncertainty, score, passes_threshold, reason, ambiguousWith`) that omits `compiledRoute` (`mk-skill-advisor-bridge.mjs:539-551`). The CLI path is a **second, independent drop**: the `AdvisorRecommendation` TypeScript interface in `subprocess.ts` declares no `compiledRoute` field, so anything routed through the CLI brief loses it too. The compiled decision never survives to the brief a hook injects into an agent's system-context.

A consequence for correctness (the CF-ACT-10 cache slice): once the decision does flow, a cached advisor brief keyed only on the prompt (`mk-skill-advisor.js` `cacheKeyForPrompt`, `:271`) and an engine cache with no invalidation hook (`011-runtime-engine/lib/compiled-route.cjs:33` `engineCache = new Map()`) would serve a stale compiled decision after a manifest flip or a `=0` kill. The cache keys must incorporate a manifest/serving-state fingerprint so consumption tracks the currently-served authority.

### Purpose

Make `SPECKIT_COMPILED_ROUTING` reach the advisor daemon child and make the compiled decision survive — through the native brief, the OpenCode bridge rebuild, the CLI interface, and the hook render — to the injected system-context, so that when 002 has promoted the closure and tri-stated the flag, flipping default-on does something legacy cannot: it delivers a consumed compiled decision to an agent boundary. Do it additively, so a matched hub's routing decision stays byte-identical to legacy and the whole change reverts to today's no-op by removing the additions.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Flag propagation (CF-ACT-2).** Add `SPECKIT_COMPILED_ROUTING` to BOTH `CHILD_ENV_ALLOWLIST` sets: `mk-skill-advisor-launcher.cjs:99` and `mk-skill-advisor-bridge.mjs:58`. The flag reaches the spawned daemon through native and fallback subprocess chains.
- **Decision threading through the native brief builder (CF-ACT-1).** Carry `compiledRoute` (or a top-level `metadata.compiledRouteSummary`) through the bridge's `buildNativeBrief` rebuild (`mk-skill-advisor-bridge.mjs:539-551`) so the field survives the recommendation-list `.map()`.
- **Decision threading through the OpenCode bridge rebuild.** The same brief the OpenCode plugin injects must carry the compiled decision, not a rebuilt copy that strips it.
- **Decision threading through the CLI `subprocess.ts` interface (second drop site).** Add the field to the `AdvisorRecommendation` interface in `subprocess.ts` so the CLI brief path preserves it.
- **Hook render of the 4-action outcome.** The hook render (`.opencode/plugins/mk-skill-advisor.js`) surfaces the compiled decision's route / clarify / defer / reject outcome in the brief it injects into system-context, before injection.
- **Manifest-fingerprint cache invalidation (CF-ACT-10 slice).** Incorporate an effective-serving-state / manifest fingerprint into the advisor-brief cache key (`cacheKeyForPrompt`) and the engine cache (`compiled-route.cjs:33`) so a manifest flip or `=0` invalidates a stale compiled brief.
- **e2e bridge+plugin tests** with a real compiled decision, exercised through the native path AND the no-dist launcher fallback; plus a `=0` propagation kill test proving the flag disables consumption end-to-end.

### Out of Scope

- Any change to routing **decisions** — [why] compiled must stay byte-identical to legacy; this program never changes what routes, only whether the flag and the compiled decision reach their consumers.
- Editing the three frozen benchmark scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — [why] SHA-256-pinned and non-negotiable across the whole program; consumed read-only only.
- Promoting the resolver/engine/activation closure out of the spec tree, splitting eligibility from the `HUB_CHILD` engine-dispatch table, the serving-status probe, and tri-stating the flag in the two read sites — [why] delivered by the upstream P0 foundation `002-runtime-promotion-and-status-foundation`, which this phase depends on and consumes.
- Flipping `SPECKIT_COMPILED_ROUTING` to a repo default — [why] the P4 staged cutover (`011-activation-cutover-p4`); this phase keeps the flag default-off and merely makes it reachable and consumable.
- The Lane C compiled-parity harness, playbooks, catalogs, and durable archiving — [why] downstream 004–010 children that consume this phase's now-flowing decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | Add `SPECKIT_COMPILED_ROUTING` to the `CHILD_ENV_ALLOWLIST` Set (`:99`) so the native launcher forwards it to the daemon child |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | Modify | Add the flag to the bridge `CHILD_ENV_ALLOWLIST` (`:58`); carry `compiledRoute`/`metadata.compiledRouteSummary` through the `buildNativeBrief` rebuild (`:539-551`) |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts` | Modify | Add `compiledRoute` (optional) to the `AdvisorRecommendation` interface — the CLI-path second drop site |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Render the compiled 4-action outcome into the injected brief; add the serving-state fingerprint to `cacheKeyForPrompt` (`:271`) |
| `011-runtime-engine/lib/compiled-route.cjs` | Modify | Add a manifest-fingerprint invalidation input to `engineCache` (`:33`) so a flip/kill does not serve a stale engine (coordinated with 002's promoted closure) |
| `003-flag-propagation-and-effective-consumption/{spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md}` | Create | This Level-3 planning set (authored now; implementation is future work) |
| e2e test fixtures (path chosen at build time, non-frozen) | Create | Bridge+plugin e2e with a real compiled decision (native + no-dist fallback) and the `=0` propagation kill test |

> This packet authors planning documentation only. No runtime file, `SKILL.md`, manifest, or scorer is edited while authoring this set. The runtime edits above are the Planned work this spec governs. The exact `compiled-route.cjs` invalidation seam is coordinated with 002's promoted-closure location and must not reintroduce a read under `.opencode/specs`.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add `SPECKIT_COMPILED_ROUTING` to BOTH `CHILD_ENV_ALLOWLIST` sets so the flag reaches the spawned advisor daemon child through native and fallback chains. | The flag is present in both Sets (`mk-skill-advisor-launcher.cjs:99`, `mk-skill-advisor-bridge.mjs:58`). A child-process env probe shows the flag inside the daemon child under the native launcher AND the no-dist fallback path. `unset`/`0`/`1` each propagate the intended value; no prefix widening is introduced. |
| REQ-002 | Thread the compiled decision through the native brief builder so it survives the recommendation-list rebuild. | `buildNativeBrief` (`mk-skill-advisor-bridge.mjs:539-551`) carries `compiledRoute` (or a top-level `metadata.compiledRouteSummary`) rather than dropping it; an e2e bridge test with a real compiled decision shows the field present in the built brief. |
| REQ-003 | Thread the compiled decision through the CLI `subprocess.ts` `AdvisorRecommendation` interface — the confirmed second drop site. | The `AdvisorRecommendation` interface declares an optional `compiledRoute` (or the summary) field; the CLI brief path preserves it; the TypeScript build/typecheck passes; a grep for `compiledRoute` in `subprocess.ts` is no longer zero. |
| REQ-004 | Render/consume the compiled 4-action outcome (route / clarify / defer / reject) in the hook render before system-context injection. | The injected system-context (`.opencode/plugins/mk-skill-advisor.js` render path) reflects the compiled decision's outcome when one is served; when no compiled decision is present, the brief is byte-identical to today's legacy brief. |
| REQ-005 | Incorporate a manifest / effective-serving-state fingerprint into the advisor-brief cache key and the engine cache so a manifest flip or `=0` does not serve a stale compiled brief (CF-ACT-10 cache slice). | `cacheKeyForPrompt` (`mk-skill-advisor.js:271`) includes a serving-state fingerprint; the `engineCache` (`compiled-route.cjs:33`) keys or invalidates on the same fingerprint; a flip/`=0` fixture proves the previously-cached compiled brief is not re-served. |
| REQ-006 | Prove propagation and consumption with e2e bridge+plugin tests carrying a real compiled decision (native AND no-dist launcher fallback), plus a `=0` propagation kill test. | The e2e suite shows: flag present in the daemon env; `compiledRoute` survives to the injected brief on both spawn paths; and with `SPECKIT_COMPILED_ROUTING=0` the flag propagates as `0` and consumption is disabled end-to-end (behavior returns to today's no-op). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Preserve routing-decision identity: every change is additive and the compiled decision is byte-identical to legacy on all routing fields. | Legacy Lane C route-gold replay is byte-identical before and after (consumed read-only from the frozen scorer); only additive `compiledRoute`/metadata differs; the three frozen scorer SHA-256 digests are unchanged pre/post. |
| REQ-008 | Name and prove a rollback that returns behavior to today's end-to-end no-op. | Removing the two allowlist entries and the brief/interface threading reverts consumption to the current behavior; a documented, byte-scoped revert exists and is exercised; `SPECKIT_COMPILED_ROUTING=0` remains a live kill path throughout. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SPECKIT_COMPILED_ROUTING` reaches the spawned advisor daemon child on both the native launcher and the no-dist fallback path — a canary is now mechanically possible where it was impossible before (CF-ACT-2 closed).
- **SC-002**: A real compiled decision survives from `enrichCompiledRoutes` through the bridge `buildNativeBrief` rebuild, the CLI `subprocess.ts` interface, and the hook render into the injected system-context — both confirmed drop sites are closed (CF-ACT-1 closed).
- **SC-003**: The compiled decision's 4-action outcome (route / clarify / defer / reject) is legible in the brief an agent receives; absent a compiled decision, the brief is byte-identical to today.
- **SC-004**: A manifest flip or `=0` invalidates a stale compiled brief; the advisor-brief and engine caches track the currently-served authority (CF-ACT-10 cache slice closed).
- **SC-005**: Routing decisions are byte-identical to legacy before and after (additive only), the three frozen scorer digests are unchanged, no touched runtime path reads under `.opencode/specs`, and a named byte-scoped rollback plus the `=0` kill path are both proven.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Allowlist widening leaks unintended env into the daemon | A prefix or broad entry could forward secrets to the child | Add the exact literal `SPECKIT_COMPILED_ROUTING` key only; no prefix matching; keep both Sets explicit |
| Risk | Threading the decision alters a routing field | A rebuild that recomputes rather than passes through could change what routes | Pass `compiledRoute` through untouched as an additive field; never recompute `skill`/`workflowMode` in the brief; REQ-007 byte-identical parity gate |
| Risk | Stale compiled brief served after a flip or `=0` | A cache keyed only on prompt re-serves a decision the manifest no longer backs | REQ-005 folds a serving-state fingerprint into both cache keys; flip/kill fixture proves invalidation |
| Risk | Divergent behavior between native and no-dist fallback paths | One spawn path forwards the flag or the field, the other does not | REQ-006 exercises BOTH the native launcher and the no-dist launcher fallback in the e2e suite |
| Risk | Second (CLI) drop site missed | Fixing only the bridge leaves `subprocess.ts` silently dropping the field | REQ-003 names the `AdvisorRecommendation` interface explicitly; verification confirmed the second drop site |
| Dependency | `002-runtime-promotion-and-status-foundation` (P0) | Threading is meaningless while the resolver reads under `specs` and the flag is bi-state | Sequence 003 after 002 is green; consume 002's tri-stated flag and promoted closure, do not re-implement them |
| Dependency | Frozen benchmark scorer (three pinned files) | Any edit invalidates the parity baseline the whole program rests on | Consumed read-only; SHA-256 re-hashed pre/post every step; never edited |
| Dependency | Line-number drift in cited sources | Citations may be ±2–10 lines off between checkouts (e.g. `subprocess.ts` interface at `:16` here vs `:25` in the review checkout) | Re-anchor on the SYMBOL (`CHILD_ENV_ALLOWLIST`, `buildNativeBrief`, `interface AdvisorRecommendation`, `cacheKeyForPrompt`) at build time, not the number |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reversibility
- **NFR-R01**: Every change is additive (allowlist entries, brief/interface fields, cache-key inputs, tests); removing the additions reverts to today's end-to-end no-op. `SPECKIT_COMPILED_ROUTING=0` stays a live kill path throughout.
- **NFR-R02**: Because compiled routing is byte-identical to legacy on routing fields, any rollback is behavior-neutral by construction, not merely by test.

### Determinism
- **NFR-D01**: Whether the flag reaches the child and whether the decision survives to the brief are pure functions of (allowlist membership, brief field set, interface shape) — not of timing or process ordering.
- **NFR-D02**: Cache behavior is deterministic under the serving-state fingerprint: identical (prompt, served-authority) inputs yield the same cached brief; a fingerprint change is a guaranteed miss.

### Security
- **NFR-S01**: The allowlist additions forward exactly one literal key and no prompt content or secret; the child-env filter stays an explicit Set with no prefix widening.

### Performance
- **NFR-P01**: The serving-state fingerprint reuses a hash already computed by the serve-time path; it adds no unbounded per-request work and stays off the hot decision path except as a cache-key input.

## 8. EDGE CASES

### Propagation
- Flag set only in `.env`, native launcher path: must appear in the daemon child (today it is stripped at `:269`).
- Flag set, no-dist launcher fallback path: must appear in the child on the fallback chain too, not only the native path.
- `SPECKIT_COMPILED_ROUTING=0`: propagates as `0`; consumption disabled end-to-end; brief byte-identical to legacy.

### Consumption
- Compiled decision present, native brief: `compiledRoute` survives `buildNativeBrief`'s `.map()` rebuild into the injected brief.
- Compiled decision present, CLI brief: survives the `subprocess.ts` `AdvisorRecommendation` interface (second drop site).
- Legacy sentinel (`servingAuthority: legacy` → `undefined` at `advisor-recommend.ts:351`): no `compiledRoute` attached; brief byte-identical to today — the additive path degrades cleanly.
- 4-action outcome rendering: each of route / clarify / defer / reject renders a distinct, legible line in the injected system-context.

### Cache
- Manifest flip while a prompt's brief is cached: the serving-state fingerprint changes → cache miss → fresh brief.
- `=0` after a compiled brief was cached: kill takes effect immediately; the stale compiled brief is not re-served.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Two allowlist edits, threading across three consumer surfaces (native brief, CLI interface, hook render), a cache-key change, and an e2e suite spanning two spawn paths |
| Risk | 17/25 | Sits directly on the path that reaches an agent's system-context and on the process-spawn env boundary; additive by construction, but a mistake could change what an agent sees or leak env into the child |
| Research | 8/20 | Both drop sites and both strip sites CONFIRMED against source this session; residual is implementation and cache-seam coordination with 002, not investigation |
| **Total** | **37/70** | **Level 3** — multi-surface threading with an effectiveness-critical, agent-facing consequence sets the level, not authoring volume |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|------------|-------|
| The two spawn paths diverge (one forwards, one strips) | Medium | High | e2e exercises both native and no-dist fallback; both allowlists edited in one change | 003 owner |
| Brief rebuild recomputes and changes a routing field | Low | High | Pass-through only; REQ-007 byte-identical route-gold parity gate; frozen digests re-hashed | 003 owner |
| CLI second drop site left unfixed | Medium | High | REQ-003 names `subprocess.ts` `AdvisorRecommendation` explicitly; grep-for-field gate | 003 owner |
| Stale compiled brief re-served after flip/`=0` | Medium | Medium | REQ-005 serving-state fingerprint in both cache keys; flip/kill fixture | 003 owner |
| Cache seam reintroduces a read under `.opencode/specs` | Low | High | Coordinate the `compiled-route.cjs` invalidation input with 002's promoted closure; no-spec-read assertion | 002/003 owners |
| Frozen scorer edited, invalidating the parity baseline | Low | High | Consumed read-only; SHA-256 re-hash gate aborts on drift; never edited | Whole program |

## 11. USER STORIES

- **US-001 (operator running a canary).** As the operator enabling `SPECKIT_COMPILED_ROUTING=1` in one profile, I want the flag to actually reach the advisor daemon child, so my canary exercises the compiled path instead of being silently stripped at the process boundary.
- **US-002 (agent consuming a route).** As an agent receiving an injected skill-advisor brief, I want the compiled decision's route / clarify / defer / reject outcome to appear in my system-context when a hub is compiled-serving, so the compiled router can do something legacy cannot.
- **US-003 (release owner flipping the kill-switch).** As the owner of the `=0` kill-switch, I want a manifest flip or a `=0` to immediately stop a stale compiled brief from being served, so the kill-switch is a real control and not defeated by a prompt-keyed cache.
- **US-004 (maintainer).** As a maintainer, I want the fix to be byte-identical to legacy on routing fields and reversible by removing the additions, so enabling consumption never risks changing what routes and can be backed out cleanly.

## 12. OPEN QUESTIONS

- **Q1.** Thread the full `compiledRoute` object through every surface, or a compact top-level `metadata.compiledRouteSummary`? (See `decision-record.md` ADR-001. Recommendation: a top-level summary keyed for the brief, with the full object available where a consumer needs it, to minimize the field surface crossing the CLI interface.)
- **Q2.** Where does the serving-state fingerprint come from — 002's serving-status probe output, or a locally recomputed hash? (See ADR-002. Recommendation: consume 002's probe/fingerprint so there is one source of serving truth; do not add a second recompute.)
- **Q3.** Does the hook render the 4-action outcome as an additive brief line, or as a structured field the runtime interprets? (See ADR-003. Recommendation: an additive, human-legible line that leaves the legacy brief byte-identical when no compiled decision is present.)
- **Q4.** Is the `compiled-route.cjs` engine-cache invalidation owned here or folded into 002's promoted closure? (Coordinate with 002 to avoid a duplicate cache or a re-introduced spec-tree read.)

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Upstream evidence (25-iter research)**: `../001-research/synthesis-v1.md` (§2.1 CF-ACT-1, CF-ACT-2; §5 graph; §7 step 2), `../001-research/verification-v1.md` (both drop sites CONFIRMED, incl. the CLI `subprocess.ts` second site), `../001-research/review-v1.md` (§1 spine, §4 row 003)
- **Phase parent**: `../spec.md` (015 phase map; 003 is P1, depends on 002)
- **Upstream dependency (P0 foundation)**: `../002-runtime-promotion-and-status-foundation/`
- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Decisions (what to thread, fingerprint source, render form)**: See `decision-record.md`
- **Completion record (Planned state)**: See `implementation-summary.md`
- **Flag strip sites**: `.opencode/bin/mk-skill-advisor-launcher.cjs` (`CHILD_ENV_ALLOWLIST`), `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` (`CHILD_ENV_ALLOWLIST`)
- **Decision drop sites**: `mk-skill-advisor-bridge.mjs` (`buildNativeBrief`), `.opencode/skills/system-skill-advisor/mcp-server/lib/subprocess.ts` (`AdvisorRecommendation`)
- **Attach point (upstream)**: `.opencode/skills/system-skill-advisor/mcp-server/handlers/advisor-recommend.ts` (`enrichCompiledRoutes`, additive attach `:371`)
- **Hook render + cache**: `.opencode/plugins/mk-skill-advisor.js` (`cacheKeyForPrompt`)
