# Deep Review Report — sk-design-md-generator

- **Target:** `.opencode/skills/sk-design-md-generator` (skill)
- **Session:** `skreview-sk-design-md-generator-opus48` · **Executor:** cli-claude-code model=claude-opus-4-8
- **Iterations:** 4 of 5 (converged) · **Dimensions:** correctness, security, spec-alignment/traceability, completeness/maintainability
- **Severity totals:** P0 = 0 · P1 = 1 · P2 = 10
- **Verdict:** **CONDITIONAL** · **Release-readiness:** converged (one P1 to clear before a clean release claim)

---

## 1. Executive Summary

`sk-design-md-generator` is a genuinely solid skill: the embedded TypeScript pipeline is correct, well-commented around its real risks, and the anti-hallucination architecture (deterministic value emitters + a FACTS block + a dual-score validator that gates `claimsScore >= 80` and hard-fails phantom colors / missing sections) is real and well-built. Live verification is green — **68/68 vitest tests pass** and **`tsc --noEmit` exits 0**. Security posture is clean: the output-write guard, opt-in `--insecure`, try/catch'd merges, and absence of `eval`/shell interpolation all hold. **No P0 findings.**

The single blocking issue (**F1, P1**) is a documentation↔code contract conflict, not a code bug: every operational doc tells the operator to run extraction from `backend/` while passing `--output .opencode/specs/<track>/<packet>/output`. From that working directory the path resolves *inside* the skill, and `extract.ts`'s (correct, intentional) guard **refuses** it — so the documented first extraction, and the manual playbook's own critical-path EXTRACT-001/SETUP-001, fail as written. The remaining 10 findings are P2 documentation-accuracy drifts, the most notable being README's claim that Typography is deterministically pre-rendered (it is AI-authored from a FACTS block — **F2**).

**Bottom line:** the engine is release-quality; the *documented usage path and several doc claims* are not yet accurate. Clear F1 (and ideally F2–F3) and this is a clean PASS.

## 2. Planning Trigger

A small, well-scoped documentation-accuracy remediation packet is warranted (no code changes strictly required for any finding except the optional validator hardening F9/F10). Recommended as a **Level 1–2** follow-up packet under the existing `154-sk-design-parent` family. Trigger conditions met: ≥1 P1, a coherent cluster of doc drifts with a shared root cause (cwd/output), and concrete file:line fixes. No architecture change needed.

## 3. Active Finding Registry

| ID | Sev | Category | Title | Evidence (file:line) |
|----|-----|----------|-------|----------------------|
| **F1** | **P1** | spec-code | Documented cwd (`backend/`) + relative `--output` is refused by the output guard; no default output | `extract.ts:258-269,259-263` vs `SKILL.md:392,265`, `manual_testing_playbook.md:65,71,15,196` |
| F2 | P2 | docs-vs-code | README claims Typography is deterministically pre-rendered; it is AI-authored from FACTS | `README.md:26,77` vs `build-write-prompt.ts:54-59,16-25,88-96`, `formatters-v3.ts` (no Typography emitter) |
| F3 | P2 | docs-vs-code | README §4 flag table: `--fast` = "no interaction" (false; contradicts §2 + code) | `README.md:111` vs `extract.ts:131-132,148-151,215` |
| F4 | P2 | docs | Node floor inconsistent (18 vs 20) + false "package.json declares the version range" | `README.md:13`,`INSTALL_GUIDE.md:11`,`manual_testing_playbook.md:66`,`backend/README.md:74`,`package.json:1-47`,`SKILL.md:408` |
| F5 | P2 | traceability | L1 named "Permanent" in docs; classifier emits `"infrastructure"` | `SKILL.md:289`,`README.md:99` vs `cluster.ts:429,472,493,515,541` |
| F6 | P2 | traceability | `graph-metadata.json` stale output path `output/<domain>/` | `graph-metadata.json:78,145` vs `extract.ts:585-588` |
| F8 | P2 | playbook | Stale test count (50 vs 68) + non-existent `scripts/__tests__/` include | `manual_testing_playbook.md:434,379` vs `vitest.config.ts:8-11`, live run (68) |
| F9 | P2 | correctness | validate.ts section-presence uses loose substring matching | `validate.ts:302-303,295` ( `### Layout` satisfies `## Layout`, `formatters-v3.ts:163`) |
| F10 | P2 | correctness | Cardinal-rule scope > validator enforcement (non-hex values untraced) | `SKILL.md:250,313` vs `validate.ts:415-450,393-408` |
| F11 | P2 | docs | `--insecure` undocumented in SKILL.md/README flag lists | `extract.ts:139-140,217`,`backend/README.md:152` vs `SKILL.md:281`,`README.md:108-122` |

> P2 IDs are non-contiguous (no F7) — F7 was merged into F1 as a second manifestation of the same cwd/output root cause.

## 4. Remediation Workstreams

**WS-A — Fix the documented extraction path (clears F1, P1).** Decide the canonical contract and make all docs + the error hint agree:
- Option 1 (recommended): document running `extract.ts` from the **repo root** (`npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts <url> --output .opencode/specs/.../output`), so `.opencode/specs/...` resolves outside the skill. Update SKILL.md §3/§7, README, INSTALL_GUIDE, backend/README, and the playbook accordingly.
- Option 2: keep `cd backend` but require an **absolute** `--output` (or a `../../../…` escaping path) in every example.
- Either way: fix the refusal hint at `extract.ts:267` (it currently suggests the same path that fails from `backend/`), and correct `manual_testing_playbook.md:15,71` ("backend/output default" / "outside backend/output") — there is no default and that path would also be refused.

**WS-B — Doc-accuracy sweep (clears F2, F3, F4, F5, F6, F8, F11).** Mechanical, low-risk edits to the cited lines: correct the README pre-render set + "never emits a value" caveat (F2); fix the `--fast` flag row (F3); reconcile the Node floor and add a `package.json` `engines` field (F4); align L1 naming to `infrastructure` (F5); regenerate the `graph-metadata.json` causal summary (F6); update the playbook test count to 68 and the include glob (F8); add `--insecure` to both flag lists (F11).

**WS-C — Optional validator hardening (F9, F10).** Anchor `checkSectionCompleteness` to line-start (`^##\s+…`) so an h3 cannot satisfy an h2 requirement (F9); add a one-line doc caveat that validation traces hex + Quick Start values only, with non-hex fidelity guaranteed by the WRITE-phase pre-render/FACTS (F10). Neither is release-blocking.

## 5. Spec Seed

> For the follow-up packet `spec.md` (problem statement):

The skill's embedded engine is correct and verified, but its **documented operating contract diverges from the code**: the canonical extraction command fails when run as documented (cwd `backend/` + repo-root-relative `--output` → refused by the skill-internal output guard), and several front-door doc claims are inaccurate (Typography pre-rendering, `--fast` interaction behavior, Node floor, L1 naming, output path, playbook test references). Goal: make every documented invocation succeed verbatim and every load-bearing claim trace to code, without altering the (correct) engine behavior.

## 6. Plan Seed

> For the follow-up packet `plan.md` (ordered work):

1. **WS-A (P1):** choose the cwd/output contract; edit SKILL.md, README, INSTALL_GUIDE, backend/README, playbook; fix `extract.ts:267` hint text. Verify by running the documented command verbatim and confirming `tokens.json` is written. *(Touches docs + 1 string in code.)*
2. **WS-B (P2 batch):** apply the seven cited doc-accuracy edits; regenerate `graph-metadata.json` via the metadata generator. Verify with `validate_document.py` and a re-grep of the corrected claims.
3. **WS-C (optional):** anchor the validator section regex + add a `validate.ts` unit test that a doc with only `### Layout` fails the `## Layout` requirement; add the non-hex caveat. Re-run `npx vitest run` (expect 68+N green) and `npm run typecheck`.
4. Re-run this review lineage to confirm F1 cleared → expect PASS.

## 7. Traceability Status

- **Core `spec_code`:** executed — 9 of 11 findings are doc↔code drift; engine behavior matches the *careful* claims (e.g. SKILL.md §6 "zero hex mismatches" is accurate).
- **Core `checklist_evidence`:** executed — success-criteria signals verified live (vitest 68/68, typecheck exit 0; README §8 verification commands are real).
- **Overlay `skill_agent`:** PASS — routed via `sk-design/SKILL.md:333,350`; no direct command/agent dispatcher (expected for an advisor-routed skill); no orphan/broken entry point.
- **Overlay `feature_catalog_code`:** PASS — catalog claims trace to real code (notably `feature_catalog.md:103` correctly excludes Typography from the pre-render set, contradicting README and corroborating F2); six detectors map to real modules.
- **Overlay `playbook_capability`:** PASS-with-defects — 11 scenarios map to real scripts/flags and verdict logic is sound; defects F1 (preconditions vs guard) and F8 (stale test refs).

## 8. Deferred Items

- Line-level review of the 15 un-read `backend/scripts/*.ts` pipeline stages (crawl, dom-collector, css-analyzer, detectors, report/preview/proof, interaction-capture) — covered indirectly via the feature-catalog overlay + green tests; no finding implicates them. Defer to a dedicated correctness pass if those stages change.
- Runtime extraction smoke test against a live URL (would exercise Playwright/Chromium end-to-end) was **not** run — out of scope for a read-only static review and requires a network/Chromium environment. Recommend the operator run playbook EXTRACT-001 *from the repo root* once WS-A lands.
- `references/examples/**` gold-standard pairs were treated as study artifacts, not validated against current `validate.ts` this pass.

## 9. Audit Appendix

- **Verification baseline (live, this session):** `npx vitest run` → 7 files / 68 tests passed; `npm run typecheck` (`tsc --noEmit -p tsconfig.json`) → exit 0. `backend/node_modules` present.
- **Method:** read-only static review across 4 dimensions over fresh-context iterations; every finding re-read against its cited `file:line`; each iteration ran an adversarial self-check before recording (no P0 survived, no P1 was downgraded incorrectly — F1 confirmed by hand-deriving the path resolution and the guard's `startsWith` test).
- **Non-findings deliberately cleared:** `## Imagery` absent from the validator's required set is *correct* (conditional per `design_md_format.md:296`); `family: sk-code` is the consistent convention across all sk-design siblings; the output guard and `--insecure` are sound security choices.
- **State artifacts:** `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `resource-map.md`, and `iterations/iteration-00{1..4}.md`. (Resource Map Coverage Gate omitted: `resource_map_present == false` at init.)
- **Scope discipline:** no file outside the artifact dir was created, modified, moved, renamed, or deleted; the skill and all repository files were read-only.

---

**Review verdict: CONDITIONAL**
