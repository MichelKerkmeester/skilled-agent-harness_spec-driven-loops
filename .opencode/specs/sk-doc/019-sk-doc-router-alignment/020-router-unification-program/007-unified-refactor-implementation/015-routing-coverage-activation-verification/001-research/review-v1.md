---
title: "Orchestrator Review v1: Routing Coverage, Activation & Verification"
description: "Reconciliation of synthesis-v1 (fresh Opus, 25-iter, 143->47 findings) and verification-v1 (Sonnet adversarial, all 8 spine claims CONFIRMED). Records the verified state, the corrections to fold into the 015 spec tree, the confirmed 002-011 child breakdown, and the authoring directives. Byte-identical + reversible throughout; frozen scorer never edited."
trigger_phrases:
  - "compiled routing orchestrator review"
  - "015 spec authoring directives"
  - "synthesis verification reconciliation"
importance_tier: "critical"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Orchestrator Review v1 — Routing Coverage, Activation & Verification

**Verdict (reconciled): SPEC-READY-WITH-CORRECTIONS.** The 25-iteration research (`synthesis-v1.md`, 47 consolidated findings) is validated by the Sonnet adversarial pass (`verification-v1.md`): all 8 load-bearing spine claims CONFIRMED against live source, two upgraded from INFERRED, frozen-scorer safety + reversibility clean. Authoring proceeds from `synthesis-v1.md` **as corrected below**.

## 1. Verified spine (build the spec on these — all CONFIRMED)
1. **Default-on is a structural no-op end-to-end.** Advisor attaches `compiledRoute` additively (`advisor-recommend.ts:371`); the OpenCode bridge rebuilds recommendations and drops it (`mk-skill-advisor-bridge.mjs:539-551`, 0 grep hits) — plus a **second drop site**: the CLI `subprocess.ts` `AdvisorRecommendation` interface has no `compiledRoute` field. Both must be threaded.
2. **Flag can't reach the daemon** — omitted from BOTH `CHILD_ENV_ALLOWLIST` sets (launcher `:99`, bridge `:58`).
3. **`HUB_CHILD` is a runtime engine-dispatch table** (`011-runtime-engine/lib/compiled-route.cjs:23-31,35-62`; `loadHubEngine` require()s from `006-*`), NOT a removable duplicate — ADR-002 must split eligibility from engine-discovery first.
4. **Runtime reads resolver/activation/engines from the mutable spec tree, fails silent fleet-wide** — ADR-003 promotion is a prerequisite and a *closure* (resolver + engine loader + activation manifests + per-hub bundles).
5. **No per-hub serving-status observability; drifted==broken; the flag is bi-state** (needs tri-state for default-on + kill-switch).
6. **All 7 activation manifests are already `servingAuthority: compiled`** (Sonnet `cat`'d all 7) — mandates per-hub cohort state before any fleet-wide unset=on flip.
7. **The 4 named coverage gaps are downstream** of the P0 activation foundation (a P3 join gate), not parallel busywork.

## 2. Corrections to fold into the spec (from verification-v1)
- **[SAFETY — highest priority] CF-BM-4 verdict sub-state:** implement in the NON-FROZEN orchestrator `run-skill-benchmark.cjs:300-310` (which already maps verdict->exit codes), **never** in the frozen `score-skill-benchmark.cjs`. Every child spec that touches benchmarking MUST restate: the 3 frozen scorer files are byte-identical, edits go in non-frozen siblings/orchestrators.
- **Count:** ~47 consolidated findings (44 CF-IDs + 3 standalone), not 48.
- **009 Phase Map (correct the mischaracterization):** `009-non-hub-rollout/` has 4 children (`001`-`004`); its Phase Map lists only 1 (3 built children are invisible). `mcp-code-mode` is a *separate, wholly unonboarded* non-hub candidate with **no directory** — do NOT invent a `005-mcp-code-mode`. Feeds 010's non-hub policy.
- **Line drift:** treat registry `file:line` as +/-2..10; re-anchor on the SYMBOL at build time (e.g. `subprocess.ts` interface at ~:25 not :16; `hub-router.json` surfaceBundle at ~:11).

## 3. Omissions to add as requirements
- **F-15-3 -> 004:** Lane C compiled-parity must itself exercise flag `unset / 0 / 1 / invalid` states (014 hardcodes flag=1, so it can't today). Add as an explicit 004 requirement.
- **F-16-4 -> 002 (or 008):** add a DURABLE lint/CI rule that fails any FUTURE `require`/import from `.opencode/specs/**` in runtime code — not just fixing the current instance.
- **F-25-8 -> 004/010:** assign explicit ownership for the drift gate (exactly one blocking Lane-C-vs-drift-CI owner; other consumers report its shared classification).

## 4. Confirmed child-spec breakdown (author these under `015-routing-coverage-activation-verification/`)
Full 002-011 DAG (granular; matches the P0->P4 safety graph in `synthesis-v1.md` §5-6). 015 root stays the lean phase-parent trio.
- **002-runtime-promotion-and-status-foundation** (L3) — P0 foundation: promote the closure (ADR-003 binding; delete the residual-coupling branch + correct `012/implementation-summary.md:170`); split eligibility vs `HUB_CHILD` engine-dispatch + cross-check test; ship `compiled-route-status.cjs --all` + wire `advisor_status`/`session_bootstrap`; ENV-REFERENCE flag entry; tri-state flag in both read sites; stderr breadcrumbs; **the durable no-spec-import CI rule (F-16-4)**. Everything else consumes it.
- **003-flag-propagation-and-effective-consumption** (L3) — both `CHILD_ENV_ALLOWLIST` sets; thread `compiledRoute` through `buildNativeBrief` + CLI `subprocess.ts` interface + hook render; cache invalidation; e2e bridge+plugin tests.
- **004-benchmark-compiled-lane-c** (L2) — `compiled-routing-parity.cjs` sibling; `qualifiedIdToLeaf` shape bridge; verdict sub-state in the **non-frozen orchestrator**; render-from-JSON; flag-state matrix (F-15-3); frozen-trio SHA-256 pins; drift-gate ownership (F-25-8).
- **005-playbooks-and-luna-acceptance** (L2-3) — 7-hub serving-authority scenario matrix + evidence contract + strict validators + non-frozen cutover executor; two-plane LUNA-HIGH acceptance (timeout=SKIP, gold-bearing holdouts).
- **006-feature-catalogs** (L2) — 7 hub-root catalogs (or advisor-central) + routing leaf; feature-flag-governance + `advisor-recommend.md` extension; phase-gated wording; durable paths only.
- **007-durable-archiving-and-serving-snapshot** (L2) — `<hub>/benchmark/compiled-routing/<run-label>/` convention; `serving-snapshot.json` + renderer; repo-relative provenance; append-only `flip-history.jsonl`; overwrite fail-closed.
- **008-sk-code-alignment-and-drift-guards** (L2) — real RESOURCE_MAP gate (markdown parser behind `--check-router` OR rename+backlink to `sk-code-router-sync.vitest.ts`); `qualifiedIdToLeaf` bidirectional bijection tests; `run-all-drift-guards.sh`; surfaceBundle e2e; **owns the single code-opencode alignment authority (CF-SC-5)**.
- **009-sk-doc-template-alignment** (L2) — test-type taxonomy 2->12; topology quote-tolerance; catalog `trigger_phrases` routing-claim fix; strict package validator; BOTH create-skill parent templates into the P4 lockstep set.
- **010-rollback-audit-and-non-hub-policy** (L2) — `activate-hub.cjs --rollback`; unconditional `serving-prior` refresh; fence `direction`; append-only audit; explicit non-hub ineligibility policy (per the corrected 009 reality) + negative fixtures; name the P2 canary profile/owner/window/thresholds.
- **011-activation-cutover-p4** (L3) — staged hub-by-hub tri-state flip + lockstep directives/templates/catalog wording; P3 coverage-closure join gate; `=0` kill-switch drill; per-hub stop-on-first-failure. Depends on 002-010.

## 5. Authoring directives (for every 015 child)
- Author via the correct `sk-doc` mode template; validate `bash .../spec/validate.sh <child> --strict` -> Errors:0.
- Consume `synthesis-v1.md` + `verification-v1.md` + this review as upstream evidence; cite CF-IDs, do not restate the full findings.
- HARD invariants restated in each: the 3 frozen scorer files are byte-identical (SHA-256 pinned) and NEVER edited; compiled == legacy on routing fields; every step names a byte-exact/flag-based rollback; no runtime read under `.opencode/specs`.
- Work only in the worktree; commit there; merge is operator-gated.
