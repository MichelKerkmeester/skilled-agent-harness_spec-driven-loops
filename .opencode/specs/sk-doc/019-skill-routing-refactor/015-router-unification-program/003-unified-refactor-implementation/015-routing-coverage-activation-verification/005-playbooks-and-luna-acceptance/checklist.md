---
title: "Checklist: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "QA gate for the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen validators/executor, and the two-plane LUNA-High acceptance stage. Verified against the bounded real-model run plus the archived real full-sweep evidence (13/14 PASS, 1 honest FAIL, 0 SKIP)."
trigger_phrases:
  - "compiled routing playbook checklist"
  - "luna high acceptance QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/005-playbooks-and-luna-acceptance"
    last_updated_at: "2026-07-21T07:50:27Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reran 7-hub LUNA-HIGH sweep with real dispatch: 13/14 PASS, 1 FAIL, 0 SKIP"
    next_safe_action: "Use archived real evidence (luna-high-real-20260721-073315) at next cutover review"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
---
# Checklist: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Upstream evidence consumed before authoring (research reconciled against the actual on-disk `002`/`003`/`004`/`007` implementations, which exist despite their "Planned" summaries).
  - **Verification**: [evidence: sibling contracts read from the real code (`compiled-routing-parity.cjs`, `compiled-route-status.cjs`, `resolve.cjs`, `archive-compiled-routing.cjs`) and field names reconciled.]
- [x] CHK-002 [P0] All writes stay inside the named playbook + shared-script paths plus this phase folder.
  - **Verification**: [evidence: `git status` shows only the 7 compiled-routing dirs, the 2 new + 1 modified validators/executor, the LUNA harness, the 2 test files, the 3 realigned root playbooks, the 007 LUNA archive dirs, and this doc set.]
- [x] CHK-003 [P1] Evidence-contract field names reconciled with `004`'s real `row.compiledParity` shape and `002`'s status probe.
  - **Verification**: [evidence: `servingAuthority`/`manifestDigest`(=`effectivePolicyHash`)/`flagState`(=`classifyFlagState().state`)/`fallbackCause`(≈`causeCode`) mapped to the real contracts.]

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No new external dependency beyond what the existing playbook/benchmark scripts use.
  - **Verification**: [evidence: every new `.cjs` uses only `fs`/`path`/`crypto`/`child_process` and existing sibling modules.]
- [x] CHK-011 [P0] CommonJS/JSON/Markdown-frontmatter syntax valid across every new and changed file.
  - **Verification**: [evidence: `node --check` passes on all new/modified `.cjs`; all 7 scenario frontmatters parse via the content validator and the frozen loader.]
- [x] CHK-012 [P1] The frozen `load-playbook-scenarios.cjs` loader (and the other two frozen files) is never opened for write.
  - **Verification**: [evidence: no `writeFile`/`fs.write` call targets any frozen file; digests identical before/after.]

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 7 eligible hubs have exactly one compiled-routing scenario file, each with a distinct route shape.
  - **Verification**: [evidence: `validate-compiled-routing-scenarios.cjs` reports 7/7 PASS; surfaceBundle (sk-code), ordered-bundle ×3 (distinct rationales), default (sk-prompt), bundle-rules ×2 (distinct rationales).]
- [x] CHK-021 [P0] The content validator rejects id-only and null-criteria scenarios and requires all 7 evidence fields.
  - **Verification**: [evidence: `validate-compiled-routing-scenarios.test.cjs` fixture sweep passes.]
- [x] CHK-022 [P0] The topology validator recurses into per-feature files; the verdict enum is unified (PASS/FAIL/SKIP).
  - **Verification**: [evidence: `compiled-routing-cutover-luna.test.cjs` nested-defect recursion fixture passes; quote-tolerance test still passes.]
- [x] CHK-023 [P0] The cutover executor's PASS/FAIL/SKIP outcome is derived from captured evidence, not a manual assertion.
  - **Verification**: [evidence: 7/7 hub dry run `join-gate: PASS`; branch fixtures cover match/drift/vacuous/defer/skip/throw.]
- [x] CHK-024 [P0] The LUNA-HIGH stage classifies a seeded transport timeout as `SKIP`, never `PASS`/`FAIL`.
  - **Verification**: [evidence: seeded-timeout fixture yields `SKIP` with distinct stdout/stderr fields.]
- [x] CHK-025 [P1] Every hub has >= 1 gold-bearing held-out paraphrase with its route withheld from the prompt.
  - **Verification**: [evidence: all 7 map holdouts audit `withheld=true`; the earlier bounded live holdouts (`sk-code`, `sk-doc`) routed-to-gold; the real full seven-hub follow-up (`luna-high-real-20260721-073315`) obtained a real model response for all 7 holdouts — 6/7 routed-to-gold (generalized correctly), `mcp-tooling` did not (stated `mcp-mobbin`, gold `mcp-refero`), reported as an observed FAIL, not an unresolved SKIP.]

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:step-4-full-sweep -->
## Full Seven-Hub LUNA-HIGH Sweep

- [x] CHK-070 [P0] The complete 7-hub × {routing, holdout} scenario map was exercised with `providerModel=openai/gpt-5.6-luna`, variant `high`, and distinct transport `stdout`/`stderr` fields.
  - **Verification**: [evidence: run label `luna-high-real-20260721-073315`, dispatched from a Claude Code parent runtime (no `cli-codex` self-invocation guard applies to a direct, non-nested `codex exec` child process) — all 14 rows returned a real model response in 21s-129s each; 13/14 PASS, 1 FAIL (`mcp-tooling` holdout), 0 SKIP, 0 fabricated responses.]
- [x] CHK-071 [P1] Every held-out prompt remains a valid generalization probe, and the absence of a model result is reported without a routing claim.
  - **Verification**: [evidence: 7/7 archived holdout rows record `holdoutAudit.withheld=true`; 6/7 resolved correctly to gold via a real stated model routing (not empty/unobserved); `mcp-tooling`'s holdout resolved to a real but incorrect stated route (`mcp-mobbin`, not gold `mcp-refero`) and is reported as `verdict=FAIL` — an observed miss, not an absence of a result.]
- [x] CHK-072 [P0] Every hub's follow-up result is archived durably with repo-relative provenance and a validated serving snapshot.
  - **Verification**: [evidence: `.opencode/skills/<hub>/benchmark/compiled-routing/luna-high-real-20260721-073315/` exists for all seven hubs with `skill-benchmark-report.json`, renderer-derived `skill-benchmark-report.md`, schema-valid `serving-snapshot.json` (validated via `validateServingSnapshot`), and renderer-derived `serving-snapshot.md`; archived reports contain no absolute skill root; the superseded `luna-high-step4-20260721-070659` SKIP-only archive was removed.]
- [x] CHK-073 [P0] The live transport result is separated from deterministic routing correctness.
  - **Verification**: [evidence: `validate-compiled-routing-scenarios.cjs --strict` passes 7/7 hub scenarios, and `cutover-playbook-executor.cjs` reports 7/7 join-gate PASS (deterministic layer, unaffected by the live LUNA plane); six compiled decisions match legacy and `sk-code` conservatively defers to legacy. The live LUNA-HIGH plane's one real FAIL (`mcp-tooling` holdout) is a model-routing observation, not a deterministic cutover regression.]

<!-- /ANCHOR:step-4-full-sweep -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Every scenario's evidence contract reflects its hub manifest's `servingAuthority` at capture time.
  - **Verification**: [evidence: the cutover executor reads `servingAuthority: compiled` from each activation manifest; the fleet-effective `legacy`/`flag-off` from the `002` probe is captured as a diagnostic.]
- [x] CHK-031 [P0] Root-playbook realignment lands for `sk-doc`, `mcp-tooling`, `sk-prompt`.
  - **Verification**: [evidence: sk-doc re-anchored to `mode-registry.json`/`hub-router.json`; `mcp-tooling` Figma+Refero primary row added; `sk-prompt` orderedBundle documented as unproven.]
- [x] CHK-032 [P1] Secondary-authority checks are not duplicated as a second primary matrix.
  - **Verification**: [evidence: the primary matrix stays one scenario per hub; holdouts live in the `luna-acceptance.cjs` orchestrator scenario map, not a duplicate deterministic matrix.]

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing file (`SKILL.md`, `hub-router.json`, `mode-registry.json`) is edited.
  - **Verification**: [evidence: `git status` touches only root playbook Markdown, non-frozen scripts, scenario files, and this doc set.]
- [x] CHK-041 [P0] The frozen `load-playbook-scenarios.cjs` loader and the other two frozen scorer files are untouched.
  - **Verification**: [evidence: `shasum -a 256` identical before/after; not present in `git status`.]
- [x] CHK-042 [P1] The LUNA-HIGH live stage introduces no credential leakage.
  - **Verification**: [evidence: model/transport config flows through the runtime-owned `codex-dispatch.cjs`; no credentials are read or hardcoded.]

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] spec, plan, tasks, checklist, and summary agree on status.
  - **Verification**: [evidence: `validate.sh --strict` STATUS_CROSS_DOC_CONSISTENCY passes; all docs reconciled to Implemented; the consumed siblings noted as on-disk despite their stale "Planned" summaries.]
- [x] CHK-051 [P1] No item is marked verified without an actual command or run.
  - **Verification**: [evidence: every completed item above carries an `[evidence: …]` marker citing a run, fixture, archive, or hash — 27/27 checklist items.]
- [x] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Verification**: [evidence: `bash .../scripts/spec/validate.sh 005-playbooks-and-luna-acceptance --strict` → Errors: 0.]

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] New scenario files land in each hub's `manual-testing-playbook/compiled-routing/`; new scripts land alongside existing validator/executor conventions.
  - **Verification**: [evidence: content validator + topology validator in `sk-doc/create-skill/scripts/`; cutover + LUNA in `system-deep-loop/deep-improvement/scripts/skill-benchmark/`.]
- [x] CHK-061 [P1] The frozen loader, the other two frozen scorer files, and all seven hub activation manifests remain byte-unchanged.
  - **Verification**: [evidence: CHK-041 hashes; no activation manifest in `git status`.]

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 19 | 19/19 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-21.
**Verification Scope**: 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen content/topology validators, the evidence-gated cutover executor, the earlier bounded real-model sample, and the archived full 7-hub two-plane follow-up.
**Completion Boundary**: Implemented and verified. The full follow-up is real and conclusive: all 14 live rows returned a real `gpt-5.6-luna-high` response (run label `luna-high-real-20260721-073315`, dispatched from a Claude Code parent runtime) — 13/14 PASS, 1 honest FAIL (`mcp-tooling` holdout routed to `mcp-mobbin` instead of gold `mcp-refero`), 0 SKIP. The earlier 3-scenario bounded run and this full sweep are now both positive real-model evidence.

<!-- /ANCHOR:summary -->
