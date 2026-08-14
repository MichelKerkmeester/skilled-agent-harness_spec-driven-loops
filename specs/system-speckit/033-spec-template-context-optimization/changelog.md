---
title: "Changelog: Spec-Template & Context Optimization"
description: "Full record of this packet: the deep-research phase (formerly 033), the four-phase implementation of six verified optimizations (formerly 034), the two adversarial deep-reviews and their remediations, the architecture decisions, and the consolidation of the two packets into one under 033."
---
<!-- SPECKIT_TEMPLATE_SOURCE: packet-changelog | v1 -->
# Changelog: Spec-Template & Context Optimization

> Complete history of this packet, which merges a deep-research phase and its implementation into one record.

---

## 1. 2026-08-14 — CONSOLIDATION (033 + 034 INTO 033)

Two packets that were two halves of one effort are now a single packet under `033`, named `033-spec-template-context-optimization`.

- **Former `033-spec-templates-and-context-reducer`** — the deep-research phase. By merge time it was an empty stub: its findings had already been absorbed into the 034 implementation packet (commit `b904dc578a`), leaving only gitignored raw run-logs.
- **Former `034-spec-template-context-optimizations`** — the implementation phase, complete at 100%.

What the merge did, mechanically:

- `git mv` the full 034 packet (112 tracked files) into this folder — history preserved, 0 deletions. Git recorded high-similarity renames (`spec.md` 98%, `tasks.md` 97%; the sub-100% deltas are the renumber edits below).
- Folded the former 033's 5 stray run-logs (`fanout-run*.log`, `orchestration-status*.log`) into `research/logs/`; removed the empty 033 stub.
- Renumbered the canonical references 034 -> 033: each doc's `packet_pointer`, `description.json` (`specId`, `folderSlug`, `specFolder`), `graph-metadata.json` (`packet_id`, `spec_folder`), and folder-path mentions in the six main docs.
- Updated the two external references: `manual-testing-playbook/tooling-and-scripts/scope-adherence-advisory-rule.md` and the skill `changelog/v3.9.0.0.md`.
- Left the historical `research/` and `review/` run-artifacts and the `session_id` fields unchanged, as an immutable audit trail. Some therefore still name the original `033`/`034` paths — by design.

Commits: `1f4958ac4f` (local) -> `4a6901096a` (on origin/skilled/v4.0.0.0).

---

## 2. RESEARCH PHASE — QUESTION AND METHOD (FORMERLY 033)

**Question:** do the two `context/*.md` source concepts — *Reducer Engineering* and the *$1.2M Agent Engineering harness* — yield concrete in-repo improvements to system-speckit's templates, documentation logic, and context/memory system, for (a) context/token reduction, (b) AI plan adherence, and (c) general optimization?

**Method:** a deep-research loop of 10 iterations across 4 lineages (`pi-flash-a`, `pi-flash-b`, `grok`, `composer`) spanning 3 model families, run with `--stop-policy max-iterations` so convergence was telemetry only and never triggered an early stop. Two original cli-devin lineages (GLM 5.2, SWE 1.7) were replaced after a structural failure. Commit: `43aee5e5ec`.

---

## 3. RESEARCH PHASE — VERDICT AND SIX ACCEPTED GAPS

**Verdict (unanimous across all four lineages):** the two source essays largely describe machinery this repo already ships, often more maturely. The high-value output is a small set of genuine gaps that survived adversarial, multi-model prior-art filtering. The research also corrected the session's own first-pass analysis on two points: raw template LOC (~5,541) is a red herring because level-gating already collapses core docs ~80-85%, and `memory_context` already enforces a token budget.

The six genuine gaps became the ranked implementable shortlist (confidence tiers: verified = re-checked this session; multi = two or more model families; single = one well-cited lineage):

1. **Gate `research.md.tmpl` by level** — verified + unanimous. ~700-800 lines saved per research-scaffolding packet.
2. **Promote `AC_COVERAGE` to default-on** — verified, single-lineage, high-leverage. The one machine-checked plan-adherence gate was dormant.
3. **Consolidate cross-level template duplication** — the four multi-level templates carried duplicated source.
4. **Apply `enforceTokenBudget` to `handleMemorySearch`** — verified, multi. `memory_search` lacked the budget its sibling already enforced.
5. **A rendered-view read path + authoring guard** — agents were reading the raw `.tmpl` instead of the rendered output.
6. **A scope-adherence validator** — scope discipline was prose-only; a research lineage literally wandered out of scope during the research phase.

Ranks 1, 2, 4 were flagged the strongest first packet (low-to-medium blast, verified). Rank for scope-adherence needed a changed-files contract design first.

---

## 4. RESEARCH PHASE — REFUTATION LIST (WHAT NOT TO BUILD)

The research produced a durable refutation list — attractive-looking ideas that must NOT be built because the repo already has them or they are category errors. This list is a hard blocker on any future PR that tries to reinvent shipped machinery:

- **Port `reduce_findings()` into speckit** — already exists (`reduce-state.cjs`, findings-registry, `contradiction-supersession`, `conditional-fanin/reduction.ts`).
- **Add a `memory_context` token budget** — already enforced.
- **Build a new Default-FAIL / fresh-evaluator / progress-handoff framework** — already exists (the Iron Law + `validate.sh --strict`; the deep-review LEAF; `handover.md` + `_memory.continuity`).
- **Re-architect Gate 3 as a token/context reducer** — category error; `gate-3-classifier.ts` is a write-boundary classifier, not in the read path.
- **GraphRAG / Kimi plan-explore-coder split inside speckit** — not applicable; the memory MCP already has vector + FTS + graph recall, and agent topology is owned by deep-loop/orchestrate.
- **Claim-level memory dedup** — deferred, conditional on a duplicate-rate measurement.

---

## 5. IMPLEMENTATION PHASE — THE FOUR PHASES (FORMERLY 034)

The six accepted gaps shipped as four independently-shippable phases, each with its own tests and regression gate. Main commit: `c8c4e79139` (plan `b0d5096bb1`).

**Phase 1 — research-template level-gating (REQ-001).** Restructured `research.md.tmpl` from a single always-true gate into per-level sections. Level 1 now renders 175 lines (was 944); Level 3 / 3+ / phase renders stay byte-identical to baseline. Added `research-template-gating.vitest.ts` (54 lines, new).

**Phase 2 — template consolidation + read safety (REQ-002, REQ-003).** Consolidated `spec.md.tmpl`, `plan.md.tmpl`, `tasks.md.tmpl`, and `implementation-summary.md.tmpl` to one shared core plus per-level gated addenda: 2,931 -> 1,314 source lines, with byte-identical rendered output at every level. `template-guide.md` gained a "Reading a Template (Agents)" read-guard directing agents to the rendered view rather than the raw `.tmpl`.

**Phase 3 — plan-adherence validation gates (REQ-004, REQ-005).** Flipped `check-ac-coverage.sh` to default-on as a non-blocking advisory and updated `validation-rules.md`. Added a new advisory `check-scope-adherence.sh` (166 lines) and registered it in `validator-registry.json`. A follow-up (`cb39cdfd66`) added the `scope-adherence-advisory-rule.md` playbook and formalized the changed-files contract (`MK_SCOPE_CHANGED_FILES` / `MK_SCOPE_BASE`) with a packet-folder-scoped canonical-doc exception.

**Phase 4 — memory_search token budget (REQ-006).** Added search-envelope token-budget enforcement to `memory-search.ts` (mirroring the memory-context handler), with a new 5-test `memory-search-token-budget.vitest.ts` suite.

Also regenerated the `scaffold-golden-snapshots` fixture (`.snap`) after confirming the pre-existing goldens were stale on the original templates.

---

## 6. RUNTIME / SKILL FILES CHANGED

The implementation shipped into the live `system-spec-kit` skill (not just the packet docs). Full inventory:

| File | Change |
|------|--------|
| `templates/manifest/research.md.tmpl` | Level-gated (REQ-001) |
| `templates/manifest/spec.md.tmpl` | Consolidated to shared core + gated addenda (REQ-002) |
| `templates/manifest/plan.md.tmpl` | Consolidated (REQ-002) |
| `templates/manifest/tasks.md.tmpl` | Consolidated (REQ-002) |
| `templates/manifest/implementation-summary.md.tmpl` | Consolidated (REQ-002) |
| `references/templates/template-guide.md` | "Reading a Template (Agents)" read-guard (REQ-003) |
| `mcp-server/handlers/memory-search.ts` | Token-budget enforcement (REQ-006) |
| `mcp-server/tests/memory-search-token-budget.vitest.ts` | New 5-test suite (REQ-006) |
| `scripts/rules/check-ac-coverage.sh` | Flipped default-on (REQ-004) |
| `scripts/rules/check-scope-adherence.sh` | New advisory validator (REQ-005) |
| `scripts/lib/validator-registry.json` | Registered the scope-adherence rule (REQ-005) |
| `references/validation/validation-rules.md` | Documented both new/changed rules (REQ-004/005) |
| `manual-testing-playbook/tooling-and-scripts/scope-adherence-advisory-rule.md` | New playbook + `MK_SCOPE_*` contract (REQ-005) |
| `scripts/tests/research-template-gating.vitest.ts` | New render-gating test (REQ-001) |
| `scripts/tests/check-scope-adherence.vitest.ts` | New/updated scope-rule test (REQ-005) |
| `scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap` | Regenerated goldens |
| `changelog/v3.9.0.0.md` | Skill changelog for the release |

The refutation-list ideas were deliberately NOT built (see Section 4).

---

## 7. HOW IT WAS DELIVERED

The primary writer was deepseek-v4-flash (via the opencode-go provider) under strict write-containment; gpt-5.6-sol (high, fast service tier) made the hard design calls and acted as adversarial verifier. Each phase captured a regression baseline, changed exactly one surface, passed a changed-files sweep that reverted-and-halted on any out-of-scope write or deletion, ran focused tests, and — for the byte-identical claim — diffed rendered output per level against baseline. Containment held across every dispatch: zero out-of-scope writes, zero deletions.

---

## 8. DEEP REVIEWS AND REMEDIATIONS

Two independent adversarial reviews ran against the implementation:

- **`pi-flash-review`** — a 10-iteration deep-review (deepseek-v4-flash) returned CONDITIONAL: P0=0, P1=8, P2=8. Artifacts under `review/lineages/pi-flash-review/`.
- **`grok46-review`** — a second review lineage (commit `478d350256`) whose deferred findings were resolved in `cb39cdfd66`.

Findings remediated:

- **F001** — regenerated the stale golden snapshots (the build-time failures were pre-existing stale fixtures, confirmed by baseline isolation).
- **F005** — kept the `memory_search` budget enforcer as a deliberate mirror of the `memory_context` one rather than forcing a shared helper, after verifying they use different truncation strategies (ADR-005).
- **F006** — reordered so token-budget enforcement runs before feedback telemetry (ADR-006).
- **F010** — clarified a phase-number collision.
- **F013** — added the `research.md.tmpl` per-level render test.
- **F015** — fixed a scope-rule false positive, documented the `MK_SCOPE_CHANGED_FILES` / `MK_SCOPE_BASE` changed-files contract, and recorded the all-zero continuity fingerprint as a grandfathered placeholder (ADR-007).

---

## 9. ARCHITECTURE DECISIONS

Seven ADRs are recorded in `decision-record.md`:

- **ADR-001** — track the six recs as phases within one packet, not as phase folders (loosely-coupled work).
- **ADR-002** — the refutation list is durable non-scope and a hard blocker.
- **ADR-003** — promote `AC_COVERAGE` to default-on as a non-blocking advisory (amended down from a hard "warn" to avoid false completion-blocks on planning-stage packets under `--strict`).
- **ADR-004** — guard template consolidation with a byte-identical render gate (per-level hash comparison).
- **ADR-005** — keep the `memory_search` budget enforcer as a deliberate mirror, not a forced shared helper.
- **ADR-006** — run `memory_search` token-budget enforcement before feedback telemetry.
- **ADR-007** — keep the all-zero continuity fingerprint as the grandfathered placeholder.

---

## 10. VERIFICATION

- Focused suites green: `template-structure` 8/8, `inline-gate-renderer` 12/12, `memory-search-token-budget` 5/5, `research-template-gating` 4/4, `scaffold-golden-snapshots` 6/6 (after regenerating stale goldens).
- Byte-identical render gate: 25/25 per-level render hashes matched baseline for the template consolidation (REQ-002); `research.md.tmpl` L3 / 3+ / phase renders matched baseline for the level-gating (REQ-001).
- Write-containment: zero out-of-scope writes, zero deletions across every dispatch.

---

## 11. STATUS AND OPEN ITEMS

Complete (100%). All six optimizations shipped and verified; see `implementation-summary.md` for the verification evidence and `decision-record.md` for the full decisions. One item is recorded as an open contract note: the scope-rule changed-files contract (`MK_SCOPE_BASE`) is defined and documented but not yet formally locked as a schema. A clean-machine full-suite run is advisable before any onward merge, since the whole scripts suite shows unrelated failures in untouched subsystems under heavy concurrent load.

---

## 12. COMMIT TIMELINE

| Commit | What |
|--------|------|
| `43aee5e5ec` | Deep-research packet (the six gaps + refutation list) |
| `b0d5096bb1` | Phased plan for the six recs |
| `c8c4e79139` | Implementation: optimize templates + add validation and budget gates |
| `4da8e091f4` | Before/after comparison + skill changelog `v3.9.0.0` |
| `478d350256` | Fix: folder-scope SCOPE_ADHERENCE + reconcile packet docs (+ grok46 review) |
| `cb39cdfd66` | Fix: resolve deferred grok findings (scope rule, AC, playbook) |
| `b904dc578a` | Absorb the 033 research packet into 034 |
| `0194a38521`, `13328c971d`, `947f8a6b58`, `e3a66403df` | Cross-session restore / WIP-sync churn around the packet |
| `1f4958ac4f` / `4a6901096a` | This consolidation (033 + 034 -> 033) |
