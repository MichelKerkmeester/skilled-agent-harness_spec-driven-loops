---
title: "Feature Specification: Routing Coverage, Activation & Verification"
description: "Phase parent for the program that makes the shipped-but-inert compiled skill-router perfectly integrated, enabled by default (as the phased P4 outcome that 012 settled), and verified through automated tests + benchmarks + manual-testing playbook scenarios (GPT-5.6 LUNA HIGH as the routed test subject), with all routing code aligned to sk-code:code-opencode and every MD authored via the correct sk-doc mode template. A 25-iteration deep-research pass (001-research) proved the load-bearing work is a P0 activation FOUNDATION — the compiled decision is dropped by the OpenCode bridge and the flag is stripped from both daemon env allowlists, so default-on is a structural no-op end-to-end — and that the four named coverage gaps are downstream of it. Ten children build the foundation, then the coverage + verification, then the staged hub-by-hub cutover. Byte-identical to legacy and reversible at every step; the three frozen benchmark scorer files are never edited."
trigger_phrases:
  - "routing coverage activation verification"
  - "compiled router enable by default program"
  - "compiled routing p0 foundation"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN: merge/migration-history narratives; heavy docs (plan/tasks/checklist/decision-record/implementation-summary belong in children).
  REQUIRED: root purpose; the phase map; the shared migration-gate model.
-->

# Routing Coverage, Activation & Verification

## EXECUTIVE SUMMARY

Make the compiled skill-router — BUILT and SHIPPED but held INERT behind default-off `SPECKIT_COMPILED_ROUTING` — **perfectly integrated, enabled by default, and verified**. 012 settled (ADR-001 Accepted) that default-on is a phased P4 *outcome*, not a premature flip; 013/014 planned create-skill + benchmark alignment. A review then found four coverage gaps (feature catalogs 0/24, benchmark legacy-only, manual playbooks 0/39, durable results 0 outside specs). This packet is the real build-out.

A **25-iteration deep-research pass** (`001-research/`; 143 findings → 47 consolidated in `synthesis-v1.md`, adversarially verified in `verification-v1.md`, reconciled in `review-v1.md`) reframed the program: **default-on is a structural no-op end-to-end.** The advisor attaches the compiled decision additively (`advisor-recommend.ts:371`), but the OpenCode plugin bridge rebuilds the recommendation list and drops it (`mk-skill-advisor-bridge.mjs:539-551`), and the flag is stripped from BOTH daemon child-env allowlists — so the compiled decision never reaches an agent, and the flag cannot even reach the daemon. The load-bearing work is therefore a **P0 activation foundation** (promote the resolver/engine/activation closure out of the spec tree; split manifest-eligibility from the `HUB_CHILD` engine-dispatch table; ship a per-hub serving-status probe; tri-state the flag; un-strip it; un-drop the decision). The four named coverage gaps are a **downstream P3 join gate**, not parallel work.

**Hard invariants at every gate:** compiled routing stays **byte-identical to legacy** on all routing fields (this program never changes a routing decision); the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) are SHA-256-pinned and NEVER edited; every step names a byte-exact-manifest or flag-based rollback; no runtime path reads under `.opencode/specs`. All 7 activation manifests are already `servingAuthority: compiled`, so the P4 flip is staged per-hub via cohort state, never a fleet-wide unset=on.

> **Phase-parent note:** this `spec.md` is the ONLY authored document at the parent level. Per-child scope, plans, tasks, requirements, and gates live in the phase children below. Research provenance and the reconciled authoring brief live in `001-research/`.

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Level | Depends on |
|-------|--------|-------|-------|------------|
| — | 001-research/ | The 25-iteration deep-research pass + synthesis + adversarial verification + orchestrator review that this packet is built from | 3 | — |
| P0 | 002-runtime-promotion-and-status-foundation/ | Promote the resolver+engine+activation+bundle closure out of the spec tree (ADR-003 binding); split eligibility from the `HUB_CHILD` engine-dispatch table + cross-check test; ship `compiled-route-status.cjs --all` + wire `advisor_status`/`session_bootstrap`; ENV-REFERENCE flag entry; tri-state the flag; stderr breadcrumbs; durable no-spec-import CI rule. **The foundation every child depends on.** | 3 | — |
| P1 | 003-flag-propagation-and-effective-consumption/ | Add the flag to both `CHILD_ENV_ALLOWLIST` sets; thread `compiledRoute` through the native brief + CLI `subprocess.ts` interface + hook render; cache invalidation; e2e bridge+plugin tests. **Makes the flag reachable and the decision consumable.** | 3 | 002 |
| P1 | 004-benchmark-compiled-lane-c/ | A `compiled-routing-parity.cjs` sibling + orchestrator hooks; `qualifiedIdToLeaf` shape bridge; verdict sub-state in the NON-frozen orchestrator; flag-state matrix; render-from-JSON; frozen-trio pins; drift-gate ownership | 2 | 002 |
| P2 | 005-playbooks-and-luna-acceptance/ | 7-hub serving-authority scenario matrix + evidence contract + strict validators + non-frozen cutover executor; two-plane LUNA-HIGH live acceptance (timeout=SKIP, gold-bearing holdouts) | 2-3 | 002, 004 |
| P3 | 006-feature-catalogs/ | 7 hub-root catalogs (or advisor-central) + routing leaf; feature-flag-governance + advisor-recommend extension; phase-gated wording; durable source paths only | 2 | 002 |
| P2 | 007-durable-archiving-and-serving-snapshot/ | `<hub>/benchmark/compiled-routing/<run-label>/` convention; `serving-snapshot.json` + renderer; repo-relative portable provenance; append-only `flip-history.jsonl`; overwrite fail-closed | 2 | 002, 004 |
| P3 | 008-sk-code-alignment-and-drift-guards/ | Make the RESOURCE_MAP equality gate real (markdown parser behind `--check-router`, or rename+backlink to the vitest); `qualifiedIdToLeaf` bidirectional bijection tests; `run-all-drift-guards.sh`; owns the single code-opencode alignment authority | 2 | 002 |
| P3 | 009-sk-doc-template-alignment/ | Test-type taxonomy 2→12; topology quote-tolerance; catalog `trigger_phrases` routing-claim fix; strict package validator; both create-skill parent templates into the P4 lockstep set | 2 | 002 |
| P1 | 010-rollback-audit-and-non-hub-policy/ | `activate-hub.cjs --rollback`; unconditional `serving-prior` refresh; fence `direction`; append-only audit; explicit non-hub archetype ineligibility policy + negative fixtures; named P2 canary profile/owner/thresholds | 2 | 002 |
| P4 | 011-activation-cutover-p4/ | The staged hub-by-hub tri-state default-on controller: lockstep directives/templates/catalog wording; the P3 coverage-closure join gate; `=0` kill-switch drill; per-hub stop-on-first-failure | 3 | 002-010 |
| P3 | 012-p3-canonical-minter-foundation/ | Canonical initial manifest minter and exact freshness predicate for new registry-driven hubs; additive status visibility and sync durability; no eligibility-map removal or default-on cohort change | 3 | 002, 006 compiler |

## SHARED MIGRATION-GATE MODEL

Every child builds behind the still-off flag and clears the same gates before completion: (1) frozen scorer SHA-256 unchanged; (2) compiled == legacy on all routing fields (legacy Lane C replay byte-identical); (3) `validate.sh --strict` Errors:0; (4) a named, proven rollback (flag=`0` or the byte-exact prior manifest); (5) no runtime read under `.opencode/specs`. P4 adds per-hub, stop-on-first-failure staging with per-hub route-gold parity + compiled-serving status + clean fallback + `=0` drill before that hub's catalog wording is atomically rewritten to default-on. The full P0→P4 safety dependency graph and per-child findings live in `001-research/synthesis-v1.md` §5-6 and `review-v1.md`.
