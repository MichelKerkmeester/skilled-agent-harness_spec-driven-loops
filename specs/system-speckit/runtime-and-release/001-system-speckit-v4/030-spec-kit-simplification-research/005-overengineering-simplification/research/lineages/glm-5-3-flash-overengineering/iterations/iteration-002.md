# Iteration 002 — Duplication pass: which rules fire, which never do, which triple-track vocabulary (KQ2)

Session: fanout-glm-5-3-flash-overengineering-1788746122749-wk19z4 | run 2 | focus: by-`script_path` multiplicities, guard-surface conditioning, freshness checks
Evidence reads: `validator-registry.json` (by-script_path/aliases aggregation, skip-severity census), `check-ai-protocols.sh`, `check-improvement-artifacts.sh` early-return guards, `orchestrator.ts` wrapper + registry-alias mapping. Reads cost: 3 shell + 1 prior-run cite.

## Findings

**F7 [P2 — candidate] 22 of 39 registry rows (56%) are conditioned on flow-specific surfaces — on a plain packet validation, over half the registry is a no-op by its own descriptions.**
- Where: `runtime/cli/lib/validator-registry.json` — 22 rows whose descriptions carry a guard clause (`When |after save|canonical|merge|phase|improvement/|Strict|high-governance`), incl. all 5 CANONICAL_SAVE_* rows ("Ensures canonical saves…"), both GRAPH_METADATA_CHILD_* rows, MERGE_LEGALITY/CROSS_ANCHOR_CONTAMINATION/POST_SAVE_FINGERPRINT ("before generated content is merged", "after save/write flows"), NORMALIZER_LINT ("Strict-only"), IMPROVEMENT_ARTIFACTS ("When a packet contains improvement/"), and AI_PROTOCOLS ("in high-governance specs").
- Cost: 22 of 39 authored+tested+documented rule behaviors execute only transiently (inside save/merge/phase flows or under `--strict`); the remaining unconditional 17 rows are the entire default-vs-real-packet gate. Reads: every rule narrowing conversation (`SPECKIT_RULES` acceptance, fatal-unknown) pays for the full 39-row list even when 22 are structurally unreachable for the packet at hand.
- Protects: transient-state integrity (saves/merges/phases) — real, but note the guard fires exactly when the workflow is already making a checkpoint decision.
- Recommendation: **keep** (transient guards are the documented, validated capability), flagging the 22-row conditioned mass as the candidate for a follow-up "which of these ever fired on the specs/ corpus" census (run 8/9); if the corpus shows flows that never exercised, cut those rows.

**F8 [P2 — candidate] 10 of 39 registry rows (26%) collapse to 2 physical implementations — the 5→1 CANONICAL_SAVE_* multiplex and the 5→1 `ts:spec-doc-structure` grouping.**
- Where: `validator-registry.json` — CANONICAL_SAVE_ROOT_SPEC_REQUIRED, _SOURCE_DOCS_REQUIRED, _LINEAGE_REQUIRED, _PACKET_IDENTITY_NORMALIZED, _DESCRIPTION_GRAPH_FRESHNESS all → `rules/check-canonical-save.sh` (one script, 5 `script_path`-distinct rows); FRONTMATTER_MEMORY_BLOCK, MERGE_LEGALITY, SPEC_DOC_SUFFICIENCY, CROSS_ANCHOR_CONTAMINATION, POST_SAVE_FINGERPRINT all → `ts:spec-doc-structure` (one module, 5 rows dispatched via the native path because "The registry dispatcher cannot spawn that form", `orchestrator.ts:955-958`).
- Cost: 26% of the registry rows are bookkeeping (5× descriptions, 5× report rows, 5× narrowing targets) for 2 implementations; the SPECKIT_CANONICAL_SAVE_RULE env-var round-trip (`orchestrator.ts:152-163`: set → run_check → unset) is the indirection that fails silently — an unset var attributes checks to the wrong rule.
- Recommendation: **merge** — one rule id + subcode per group, or have the registry carry `subrules` so the report/narrowing vocabulary is derived, not duplicated.

**F9 [P2 — candidate] Severity/status vocabulary is triple-tracked: registry JSON, orchestrator TS, validate.sh help printer — and the help printer's copy has already drifted (2 of 3 categories).**
- Where: `validator-registry.json` (`severity`, `strict_only`, `aliases` — 31 of 39 rows carry 1–4 legacy aliases); `orchestrator.ts:109-111` (RegistrySeverity: error|warn|info|skip), `:293-300` (mapShellRuleStatus), `:439` (alias→canonical remap); `validate.sh:46-64` (list_registry_rules: its own node -e re-derivation of the `[severity][strict-only]` display, looping only `["authored_template", "operational_runtime"]`).
- Cost: three files to change for one vocabulary adjustment; the display loop is the demonstrated instance (structural category with 6 rows invisible in that enumeration, incl. both `.ts`-scripted rules — the two GENERATED_METADATA_* rules that also sit in the strict-only trio).
- Recommendation: **merge** — make the help enumeration consume the same summary the report uses (or fold it into orchestrator output), and time-box the 31-row alias map against `migrationWindowDays: 28` (config field already declares the window; no expiry mechanism found in runtime — the alias teardown is a documented, never-executed maintenance task).

**F10 [P2 — candidate] Freshness machinery lands in exactly one non-test TS reader (`continuity-freshness.ts`) plus its registry row and the root-doc paragraphs — a three-surface contract for a check that, under the lineage's own dispatch, runs only when the completion rule passes `--strict`.**
- Where: `runtime/cli/validation/continuity-freshness.ts` (sole SPECKIT_COMPLETION_FRESHNESS consumer, non-test); `validator-registry.json` CONTINUITY_FRESHNESS row ("reports warn by default and escalates to fail… under SPECKIT_COMPLETION_FRESHNESS_ENFORCE"); root governance paragraphs (Completion Verification Rule, freshness clause).
- Cost: three coordinated documentation/contract surfaces (registry row, TS gate, root-doc paragraphs) — any change to freshness semantics is a 3-edit consensus; the warn-vs-enforce duality (SPECKIT_COMPLETION_FRESHNESS vs _ENFORCE) doubles the truth table the agent must hold.
- Protects: stale-continuity detection at completion claims — validated capability, flag-mandated.
- Recommendation: **keep**, with the pairing note from F3 (call-site verification is the adherence risk, not the rule's existence).

## Counts reconciled (closes run 1's provisional)

- 39 registry rows → 31 distinct `script_path` targets; two 5→1 collapses (check-canonical-save.sh; ts:spec-doc-structure) account for 8 of the 9 shared rows; the 9th is pending the run-9 by-script census (flagged, not assumed).
- `RegistrySeverity` declares 4 values; corpus uses 3 (error×32, warn×5, info×2); `skip`×0.
- 31 of 39 rows carry legacy aliases (≈75 alias strings).

## Not pursued here

- Which of the 22 conditioned rows ever fire on the specs/ corpus → folded into the adherence pass (run 8) and cross-cutting census (run 9).
