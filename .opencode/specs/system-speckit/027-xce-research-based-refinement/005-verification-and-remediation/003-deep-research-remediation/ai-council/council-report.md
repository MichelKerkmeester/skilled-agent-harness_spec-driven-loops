---
title: "AI Council Report — 029 Residual-Backlog Closure Roadmap & 027 Epic-Close Verdict"
description: "Verified-genuinely-open residual list, per-cluster DO-NOW/DESIGN-FIRST/DEFER/ESCALATE roadmap, concrete DO-NOW batch, design questions for each design-first item, :637 recommendation, and one strategic verdict on closing the 027 epic."
trigger_phrases:
  - "029 residual roadmap council report"
  - "027 epic close verdict"
importance_tier: "high"
contextType: "implementation"
---
# AI Council Report — 029 Residual Roadmap & 027 Epic-Close Verdict

## Task classification
- Type: architecture / strategic prioritization (decision question; plan-only).
- Council seats: 3 — Pragmatist (0.3), Safety-hawk (0.2), Systems (0.4).
- Dispatch mode: Sequential, Depth-1 inline `sequentialthinking`.
- Vantage integrity: SIMULATED strategy-lens seats. No external `cli-*` and no `Task`/`Agent` sub-dispatch occurred. This is multi-LENS, not multi-AI.
- Convergence: 3/3 on core conclusions (`two-of-three-agree` cleared).
- Plan confidence: 88%. Risk of the close decision: LOW.

---

## 1. Reconciled "genuinely-open" list (after current-code spot-verification)

**Verified ALREADY-CLOSED — exclude from the open queue** (disposition text was stale, exactly as the dispatch warned):
- **tri-123** — env/governance flag drift is now enforced by `mcp_server/tests/env-reference-drift.vitest.ts` (regex-collects every `SPECKIT_*` runtime token, asserts each is documented in ENV_REFERENCE.md or on an explicit ignore-list).
- **tri-124** — `mcp_server/tests/flag-ceiling.vitest.ts:195-213` now has a drift guard that derives live tokens from `search-flags.ts` source and fails on unknowns; the static array was honestly relabeled "original core flags."
- **tri-142** — `.opencode/bin/cli-offline-smoke.cjs:105-135 runCwdIndependenceCheck` spawns each shim's `list-tools` from an unrelated `mkdtemp` dir and asserts offline success + tool count.

(All three were closed in commit `ac22c52fde`; the L9 `disposition.md` "Code queue (open)" line at L28 had not been reconciled.)

**Genuinely OPEN (verified present in current code), grouped by value:**

| Tier | Items | Nature |
|---|---|---|
| Truth-violations wearing P2 labels (highest value) | tri-010 (health green while vector_search drops rows), tri-011 (observe-only flag pauses production TTL deletion) | code-careful semantics/health |
| Safe additive code-small | tri-080 (unsupported-language scan accounting) | code-small |
| Doc-only | tri-081, tri-106, tri-107, tri-139, tri-149, tri-104 (doc-or-retire), L2 P3 nits | doc |
| Shadow/feedback honesty (interlocked L7) | Cluster A tri-007/008/009/103, Cluster B tri-012/133, Cluster C tri-115/136 (tri-011 above) | mixed: honesty patch + design + retire |
| Storage truth | tri-105 (vector SSOT) | code-careful storage |
| Launcher parity | tri-148 (owner-session not front-proxied) | code-careful, daemon-lifecycle delicate |
| Feature gaps / test-infra (lowest urgency) | tri-163 crosswalk (tri-164 = DUPLICATE), tri-129 write-path stress harness, tri-135 live-dim eval harness | feature/test-infra |
| Independents | tri-072, tri-073 (feedback idempotency), tri-119, tri-138 (health token budget) | mixed small |
| Deferred-by-design (already) | L3 replay-time validity (deleted-memory receipt) | design |

---

## 2. Per-cluster recommendation table

| Cluster / item | Disposition | Method | Order | Blast radius | Rationale |
|---|---|---|---|---|---|
| Doc-wave (tri-081, tri-106, tri-107, tri-139, tri-149, tri-104, L2 P3) | **DO-NOW** | Fenced `gpt-5.5-fast xhigh` (DO-NOT-COMMIT) | 1 | none | Pure doc truth alignment; verify-first then orchestrator commits scoped. |
| tri-080 scan accounting | **DO-NOW** | Fenced `gpt-5.5-fast xhigh` | 2 | low (additive counter) | `structural-indexer.ts:2146` confirmed still drops unsupported-extension candidates with no counter; add `unsupportedLanguageSkipped` + warning. |
| L7 Cluster A honesty patch (tri-007/009 runtime + tri-008 tests) | **DO-NOW (honesty half only)** | Additive code + doc; fenced OK for the catalog doc, hand-review the runtime emit | 3 | low if bounded | Convert silent `[]` -> typed `skipped: no-replay-pool` cycle result; mark catalog weekly-replay inert. MUST NOT touch consumption_log schema (`query_text` permanently banned). |
| tri-010 health-truth | **DESIGN-FIRST-FAST** | Hand-implemented + adversarial verify | 4 | medium (health surface) | Resolve `getActiveVectorSourceForQuery` inside `verify_integrity`; small but health-truth-critical. |
| tri-011 retention-pause | **DESIGN-FIRST-FAST** | Hand-implemented + adversarial verify | 5 | medium (deletion path) | Record shadow audit, then fall through to baseline TTL sweep; an observe-only flag must not pause production retention. |
| tri-105 vector SSOT (+ tri-106 doc lands in wave) | **DESIGN-FIRST** | Hand-implemented; design-doc first | 6 | medium (storage/reconcile) | Declare one canonical surface (vec_<dim> BLOB) + derived index (vec_memories vec0); touches repair semantics + historical divergence. |
| L7 Cluster B promotion (tri-012/133) | **DEFER-BY-DESIGN (retire-default)** | Verify-no-consumer then retire + doc | 7 | low | SPECKIT_ADVISOR_SHADOW_MODE already removed dead (tri-039); retire dead promotion plumbing rather than make it computable. |
| L7 Cluster C persistence (tri-115/136) | **DEFER-BY-DESIGN** | Bundle with Cluster C design | 8 | low-med | Shadow pause/persistence — design alongside tri-011. |
| L7 Cluster A replay POOL (tri-007/009/103 second half, feeds L2 tri-022/131) | **ESCALATE-TO-OPERATOR** | Operator decision then hand-implement | 9 | n/a (design) | Prompt-safety auto-reject gate means the agent cannot choose raw retention. |
| tri-148 launcher front-proxy | **ESCALATE-TO-OPERATOR (lean document-the-asymmetry)** | Operator confirms; doc-the-asymmetry is a DO-NOW alternative | 10 | HIGH (daemon-lifecycle) | DB corrupted 3x from dual writers; code-index/advisor launchers EXIT on child SIGTERM; code-index is rebuildable so owner-flap-survival ROI is low. |
| tri-163 crosswalk (+tri-164 dup), tri-129/135 harnesses, tri-072/073/119, tri-138, L3 | **DEFER-BY-DESIGN** | Tracked, no urgency | 11 | low | Feature gaps / hardening / small refinements; none block anything. tri-163 explicitly "do not rush as a patch." |

---

## 3. Concrete DO-NOW batch (orchestrator-executable now, verify-first)

Run as one wave; fenced `cli-opencode openai/gpt-5.5-fast --variant xhigh`, DO-NOT-COMMIT, orchestrator commits scoped on branch `028-mcp-to-cli-tool-transition`. Re-confirm each still-real immediately before, adversarially verify after.

1. **Doc-wave (parallel-safe, one commit):**
   - tri-106 — `database/vectors/README.md`: vec_<dim> = plain BLOB payload table; vec_memories = sqlite-vec vec0 virtual table (swap the mislabeled rows).
   - tri-107 — `INSTALL_GUIDE.md` troubleshooting: bare `apply` converges failed/pending/retry only; add "rerun with `repairSuccessCoverage:true` for success-row coverage gaps."
   - tri-081 — `system-code-graph/README.md`: only B1/B2 tree-sitter crash cohorts are quarantined in `parser_skip_list`; syntax errors surface as parseHealth/parseErrors.
   - tri-139 — reconcile `tool-schemas.ts` advertised memory_health budget (800) with the runtime 1000 (layer-definitions.ts).
   - tri-149 — `system-code-graph/references/runtime/launcher_lease.md`: describe owner-lease acquisition + bridgeOrReportLeaseHeld + reconnecting proxy (post-proxy behavior).
   - tri-148-doc — note in the code-graph launcher reference that ONLY secondary code-index clients are reconnect-protected; owner session is directly attached (pending the escalation decision).
   - tri-104 — mark `getConsumptionStats`/`getConsumptionPatterns` as test/maintenance-only exports (or open a wire-to-operator-surface ticket); document consumption_log as write-only telemetry.
   - L2 P3 doc nits.
2. **tri-080 (safe code-small, separate scoped commit):** add `unsupportedLanguageSkipped` counter in `structural-indexer.ts` (~:2146) and surface a warning when includeGlobs matched out-of-support extensions; thread the count through `scan.ts` accounting.
3. **L7 honesty half (separate scoped commit; hand-review the runtime emit, fenced for the doc):**
   - `shadow-evaluation-runtime.ts` (~:204-211, :423-427): emit a typed `skipped: no-replay-pool` cycle result instead of silent `[]`.
   - `feature_catalog/11--scoring-and-calibration/shadow-feedback-holdout-evaluation.md`: mark the weekly-replay claim inert-pending-design.
   - tri-008: rewrite `tests/shadow-evaluation-runtime.vitest.ts` to assert the clean-schema skipped-cycle path instead of `describe.skip` on the retired PII schema.

Playbook validation for any catalog/governance touch -> MiMo `xiaomi/mimo-v2.5-pro --variant high`.

---

## 4. Design-first items — the key question each must answer before code

- **Replay-pool privacy model (Cluster A, feeds L2 tri-022/131)** — Q: *"What replay corpus is permissible when `query_text` is permanently banned (consumption-logger-privacy.vitest.ts asserts its absence)?"* Direction: **ESCALATE-TO-OPERATOR.** Permissible options: (a) hash-class-keyed synthetic query corpus, (b) explicit opt-in eval-query enrollment, (c) declare scheduled replay permanently disabled and keep only the honesty patch. **Auto-rejected:** any bounded raw-prompt retention unless provably non-reversible. The agent cannot choose (c) vs build — operator owns the product call.
- **Shadow promotion enforceability (Cluster B, tri-012/133)** — Q: *"Post-tri-039 (SPECKIT_ADVISOR_SHADOW_MODE removed dead), is there any live consumer that still expects promotion?"* Direction: **retire-default** — verify no consumer, then delete the dead promotion-criteria plumbing + update docs. Only build computable criteria if a live consumer is found.
- **Launcher front-proxy (tri-148)** — Q: *"Does the code-index OWNER session need flap-survival parity with spec-memory, or is documenting the asymmetry the correct terminal answer?"* Direction: **ESCALATE, lean document-the-asymmetry.** code-index is a rebuildable index (unlike spec-memory's authoritative store), so owner-flap-survival ROI is low against a HIGH-blast-radius daemon-lifecycle change (3x historical DB corruption; launchers EXIT on child SIGTERM). Recommend NOT porting the proxy.
- **Vector SSOT (tri-105)** — Q: *"Which surface is canonical — vec_<dim> BLOB payload or vec_memories vec0 index?"* Direction: declare **vec_<dim> authoritative, vec_memories rebuildable index**; make repair rebuild the derived surface; add explicit divergence health. Hand-implemented, design-doc first (recorded 7771-vs-3808 divergence raises the stakes). Pairs with tri-010.
- **key_files -> COVERED_BY crosswalk (tri-163)** — Q: *"What is the designed join between skill graph-metadata `derived.key_files` and deep-loop COVERED_BY coverage nodes, and where is it surfaced (context report vs session bootstrap)?"* Direction: **DEFER-BY-DESIGN** — read-only crosswalk; explicitly "do not rush as a patch." Low urgency; tri-164 is a duplicate.
- **Eval/stress harnesses (tri-129 write-path stress, tri-135 live-dim eval)** — Q: *"What is the pass/fail contract and fixture topology each harness asserts?"* Direction: **DEFER-BY-DESIGN** — hardening, not a bug; design when the storage SSOT work creates a natural home.

---

## 5. Pre-existing `:637` test recommendation

**DOCUMENT-AND-LEAVE.** `mcp_server/tests/memory-save-extended.vitest.ts:637` (reinforce path, `content_text=NULL`) lives in untouched `pe-gating.ts` and was proven pre-existing via stash-repro — not introduced by this program. Fixing the NULL content_text behavior is a separate correctness investigation in a different subsystem; pulling it into 029-close would violate scope-lock and verify-first (it has not been root-caused). Record it in the follow-on packet as a standalone investigation item.

---

## 6. Strategic verdict

**029 is DONE-ENOUGH to close the 027 epic, with the residual carried as ONE structured follow-on packet. Unanimous (3/3).**

Justification: the entire P0/P1 deep-review queue is closed (round-2 PASS) and all deferred carefuls are handled. The ~24 genuinely-open items (after excluding the 3 verified-already-closed) are all P2/P3 — truth-debt, honesty patches, retire-candidates, and explicit design-first feature gaps. **None is a live P0/P1 regression.** Forcing them to close before epic-close would pressure the most delicate work in the system (launcher daemon-lifecycle, vector storage semantics, prompt-safety replay design) into a rush — inverting the exact risk the hard constraints exist to prevent.

**Nothing must close first to allow 027-close.** However, the follow-on packet should be structured as design-units (not a flat list) and should explicitly carry, as its highest-priority items:
1. **tri-010** (health surface reports green while vector_search silently drops rows) — truth-violation; fix first within the vector-storage unit.
2. **tri-011** (observe-only feedback-retention flag silently pauses production TTL deletion) — semantics-violation; fix within the shadow/feedback unit.
3. **Replay-pool privacy model** — operator-escalation gate (prompt-safety).
4. **tri-148 launcher** — operator-escalation, lean document-the-asymmetry.

Recommended follow-on structure: Unit 2 (vector storage truth: tri-010 -> tri-105), Unit 3 (shadow/feedback honesty: Cluster A patch+escalate, Cluster B retire-default, Cluster C incl. tri-011), Unit 4 (launcher parity: tri-148 escalate), plus a DEFER bucket (tri-163/164, tri-129/135, tri-072/073/119, tri-138, L3, the `:637` investigation).

---

## Dropped alternatives
- **seat-001 (80/100):** pure-velocity "close every P2 first is wasteful, track the rest flat." Not selected as-is — its flat-tracking underweights the interlocks and the tri-010/tri-011 truth-bugs; its close-027 default and DO-NOW framing WERE merged in.

## Risks & mitigations
- Doc patches drift again if the code stays dishonest -> mitigation: pair each doc fix with its code unit in the follow-on (Cluster A doc rides with the runtime emit; tri-106 doc rides toward tri-105 SSOT).
- "Design-first" becoming paralysis -> mitigation: tri-010/tri-011 are tagged DESIGN-FIRST-**FAST** (small, well-scoped, hand-implemented + adversarial verify), not open-ended.
- Cluster B retire-default could delete a still-used path -> mitigation: the design question requires a verify-no-consumer step before any retirement.
- Launcher escalation could be (wrongly) read as "go port the proxy" -> mitigation: explicit recommendation is document-the-asymmetry; porting requires operator sign-off given HIGH blast radius.

## Planning-only boundary
No code or spec files were modified by this council. Only packet-local `ai-council/**` artifacts were written. This report is a recommendation for the orchestrator/operator to execute under verify-first.
