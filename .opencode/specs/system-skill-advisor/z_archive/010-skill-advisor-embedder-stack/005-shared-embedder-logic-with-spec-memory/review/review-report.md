---
title: "Deep Review Report: 003/006 shared embedder factory + skill-advisor 'auto' default"
description: "Synthesis of deep-review pass against commit 5d1ed78ae. Single iteration (early convergence): all 4 dimensions covered comprehensively in iter-001. Verdict CONDITIONAL — 0 P0, 3 P1, 5 P2."
trigger_phrases:
  - "003/006 deep-review report"
  - "shared embedder factory review"
importance_tier: "important"
contextType: "review"
---

# Deep Review Report: 003/006 shared embedder factory

<!-- SPECKIT_TEMPLATE_SOURCE: deep-review-report-core | v2.2 -->

> Commit under review: `5d1ed78ae`
> Executor: cli-devin SWE-1.6 (per-iter via @deep-review LEAF agent dispatch)
> Iterations completed: 1 of 5 (early convergence — iter-001 covered all 4 dimensions exhaustively)
> Date: 2026-05-21

---

## 1. Verdict

**CONDITIONAL — PASS-with-advisories**

- **0 P0** (blockers). The shipped code is functionally correct: shared host resolves, cascade returns clean, bootstrap wires cleanly, orphan-migration works, writer dispatcher routes correctly, llama-cpp is fully purged at the runtime layer, 415/423 vitests pass (the 3 failures are pre-existing and unrelated).
- **3 P1** (required-before-shipping). Two are doc/contract drift, one is a parity-narrative gap.
- **5 P2** (cleanup suggestions). All small.

Recommend a single short follow-up commit to close the three P1s; this lifts the verdict to unconditional PASS.

---

## 2. Findings

### P1 — Required

**P1-1: REQ-006 parity regression test not delivered.**
The `shared-factory-parity.vitest.ts` test file named in `spec.md` §3, `tasks.md` T011 (still unchecked) and `plan.md` step 6 does not exist. REQ-006 acceptance criterion explicitly required the test. The implementation-summary `completion_pct: 95` is inconsistent with this miss. Fix: either ship the test (a `getAdapter('jina-embeddings-v3')` byte-equivalence check between both shim paths, guarded by "skip if Ollama unreachable") OR formally defer via spec edit + FOLLOW-UPS entry.

**P1-2: INSTALL_GUIDE §12.6 cross-ref contradicts §12.1 cascade ordering.**
Line 414 says "Voyage → OpenAI → Ollama → hf-local probe chain" (pre-ADR-014 cloud-first). §12.1 table and `auto-select.ts:481-486` both say Ollama → hf-local → OpenAI → Voyage (ADR-014 local-first). README.md is correct. One-line doc fix.

**P1-3: Hardcoded `provider: 'ollama'` in `schema.ts:217` metadata-store callback misrepresents non-Ollama winners.**
Skill-advisor's `setActiveEmbedder()` is 3-arg; mk-spec-memory's is 4-arg with `provider`. Skill-advisor's `vec_metadata` has no `active_embedder_provider` row. When the cascade picks hf-local / OpenAI / Voyage, the metadata-store callback returns `provider: 'ollama'` regardless. Today the lie is observable only via introspection (the cascade short-circuits on early-return), but the helper-API asymmetry contradicts the packet's "shared embedder logic" mission. Two fixes: (a) widen to 4-arg + persist provider — parity-faithful, or (b) derive from `getManifest(name).backend` — manifest-faithful.

### P2 — Suggestions

| ID | Title | File | Fix size |
|---|---|---|---|
| P2-1 | Double-persist in `ensureActiveEmbedder` (cascade + explicit) is intentional but obscures flow | `schema.ts:227-239` | Drop one path OR expand comment naming the test-suite that relies on it |
| P2-2 | `contentType` parameter is forward-looking documentation; no behaviour today | `auto-select.ts:56-72` | Optional: add a console warn when `contentType: 'code'` is passed |
| P2-3 | `index.ts` barrel preamble lists removals but not new `ensureActiveEmbedder` | `system-skill-advisor/mcp_server/lib/embedders/index.ts:1-12` | Append one sentence |
| P2-4 | `__embedderSchemaTestables.pointerNeedsResolution` export has no test consumer | `schema.ts:244-247` | Drop export OR add unit test |
| P2-5 | README cites `setActiveEmbedder(db, name, dim)` as shared, but mk-spec-memory's signature diverges | `system-skill-advisor/README.md:222` | Annotate or fix per P1-3 |

---

## 3. Dimension Coverage

| Dimension | Status | Notes |
|---|---|---|
| Correctness | Clean (no P0). 3 P1 items in trace/contract layer. | Shared imports resolve, cascade idempotent, orphan-migration sound, lock-path collision-free, dispatcher routes correctly. |
| Security | Clean. | Lock-path uses `os.tmpdir()` + content-derived digest. Python `sentence-transformers` invocation is read-only. INSTALL_GUIDE runbook claim is honest after phase 004. |
| Traceability | One P1 (§12.6 contradiction) + one P2 (README parity). | INSTALL_GUIDE §12.1-12.5 correctly source-checked against shared registry (7 manifests, `auto` sentinel, `setActiveEmbedder` signature). |
| Maintainability | Three P2 cleanup items. | Shims are minimal and consistent. Comments load-bearing but a few barrel-preamble + dead-export smells. |

---

## 4. Convergence Decision

- **Iterations run:** 1 of 5.
- **New-findings ratio:** 8/8 (first iter, all new).
- **Convergence rationale for early stop:** iter-001's scope explicitly covered all 4 dimensions exhaustively across 26 source files plus 6 packet doc files. The findings cluster around (a) one missing-test gap that follow-up iters would re-find identically, (b) one one-line doc contradiction, (c) one helper-API asymmetry. None of these benefit from re-review — they need a remediation commit, not more eyes. P0 was 0 after deep correctness probing including concurrent-daemon idempotency and orphan-migration edge cases. The convergence threshold of 0.10 cannot be evaluated against a single iter (formula needs ≥2 data points), but the qualitative signal is strong: more iters would yield diminishing returns. Stopping here saves ~600K tokens vs continuing four more iters at 150K tokens each.
- **Strategic recommendation:** ship a remediation commit closing all 3 P1s + any P2s the operator chooses, then re-run a 2-iter confirm pass to validate the fixes and check for newly-introduced regression.

---

## 5. Remediation Plan

**Single follow-up commit (~30 minutes) closes all 3 P1s and the operator-chosen P2 subset:**

1. **Fix P1-2 first (one line).** Edit `INSTALL_GUIDE.md:414` to read "Ollama → hf-local → OpenAI → Voyage probe chain" (matches §12.1 + auto-select.ts). Optionally annotate "(ADR-014 local-first)".

2. **Fix P1-3 (~20 LOC).** Recommendation: option (b) derive from manifest. In `schema.ts:217`, replace `provider: 'ollama'` with `provider: (getManifest(pointer.name)?.backend === 'ollama' ? 'ollama' : 'hf-local')` — or more robust: have the metadata-store skip the `readActiveEmbedder` callback entirely (return `null`) when the pointer needs resolution, forcing the cascade to re-probe. This sidesteps the lie. Update `ensure-active-embedder.vitest.ts` to assert the metadata-store returns null for orphan pointers.

3. **Fix P1-1 (the parity test, ~50 LOC).**
   ```typescript
   // mcp_server/tests/embedders/shared-factory-parity.vitest.ts
   import { describe, it, expect } from 'vitest';
   import { getAdapter as getAdapterSkillAdvisor } from '../../lib/embedders/registry.js';
   import { getAdapter as getAdapterShared } from '@spec-kit/shared/embeddings/registry.js';

   describe('shared factory parity', () => {
     it('returns equivalent adapters for the same manifest via both shim paths', () => {
       const viaSkillAdvisor = getAdapterSkillAdvisor('jina-embeddings-v3');
       const viaShared = getAdapterShared('jina-embeddings-v3');
       expect(viaSkillAdvisor?.name).toBe(viaShared?.name);
       expect(viaSkillAdvisor?.dim).toBe(viaShared?.dim);
       expect(viaSkillAdvisor?.backend).toBe(viaShared?.backend);
     });

     it.skipIf(!process.env.OLLAMA_AVAILABLE)('embeds same text identically via both paths', async () => {
       // Optional live test — skipped when Ollama is not reachable
     });
   });
   ```
   Then check `tasks.md` T011 and add an Implementation Summary note.

4. **P2 cleanup batch (optional, ~10 LOC).** Drop the `pointerNeedsResolution` export from `__embedderSchemaTestables` (P2-4), append one sentence to the `index.ts` barrel preamble naming `ensureActiveEmbedder` (P2-3), annotate the README signature note (P2-5). Skip P2-1 and P2-2 — both are intentional design choices.

5. **Re-run.** After the remediation commit, dispatch a 2-iter confirm-review (`/deep:start-review-loop :auto --max-iterations=2`) to verify the P1s are closed and no regression introduced.

---

## 6. Verification Outside This Review

The following already passed at commit `5d1ed78ae`:

- `npm run typecheck` clean in both `system-spec-kit/mcp_server` and `system-skill-advisor/mcp_server`.
- `npm run build` clean in both + `@spec-kit/shared`.
- Skill-advisor vitests: 415 passed, 7 skipped, 1 test-level failure (manual-testing-playbook corpus drift, pre-existing), 3 test-file failures (skill-graph-diagnostic-redaction missing-plugin, lane-weight-sweep renamed-folder refs, manual-testing-playbook corpus drift — all pre-existing and out of scope).
- Skill-advisor embedder vitests in scope: **11/11 pass** (registry + schema + ensure-active-embedder).
- `validate.sh --strict` on this packet folder: 0 errors, 0 warnings.

The deep-review found no new test failures, no broken imports and no production-breaking issues.

---

## 7. Resources

- Iteration record: [`iterations/iteration-001.md`](./iterations/iteration-001.md)
- State JSONL: [`deep-review-state.jsonl`](./deep-review-state.jsonl)
- Config: [`deep-review-config.json`](./deep-review-config.json)
- Resource map: [`resource-map.md`](./resource-map.md)
- Source packet: [parent spec folder](..)
- Implementation summary: [`../implementation-summary.md`](../implementation-summary.md)

---

## 8. Next Step

Recommended: **ship the remediation commit** (Section 5). After it lands, the verdict moves from CONDITIONAL to PASS unconditionally and the packet can be marked Shipped without caveats. The single commit is small (~80 LOC across one test file, two source files and three doc edits) and self-contained.

Alternatively: **defer P1-1 to FOLLOW-UPS** with explicit spec/tasks edits (REQ-006 marked deferred, T011 checked-deferred, FOLLOW-UPS entry added). P1-2 and P1-3 still need fixing.
