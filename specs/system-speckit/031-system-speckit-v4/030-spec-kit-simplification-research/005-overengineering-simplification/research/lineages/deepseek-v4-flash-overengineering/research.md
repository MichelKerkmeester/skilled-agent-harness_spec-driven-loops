# Research: Overengineering Stress-Test of system-spec-kit — Round Two (post-remediation verification)

Lineage: `deepseek-v4-flash-overengineering` | session `fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq` | generation 1 | 10/10 iterations | stopReason: **maxIterationsReached** (dispatch-mandated cap; convergence treated as telemetry per dispatch instructions)

Executor contract: in-process inline (this lineage is the executor; no nested dispatch). Continuity save via `generate-context.js`: **skipped by design** — the dispatch constrains every write to this lineage directory and names the continuity writer/validate.sh/node tooling as out-of-surface commands; recorded here and in the convergence report as the loop's single documented deviation.

Round-one baseline: `lineages/glm-5-3-flash-overengineering/research.md` (30 findings: 5 P1, 25 P2) → census `research/confirmed-findings.md` → remediation children 011 (`command-surface-contract-realignment`) and 012 (`pre-existing-test-repair`). This round's mandate: (1) verify each remediation landed completely and coherently; (2) find what round one missed, preferring angles it covered in one pass or not at all; (3) re-examine kept rows only with new evidence. Recount everything in this tree; never report a census-fixed row unless the fix is incomplete.

---

## Table of contents

1. Executive summary · 2. Scope, method & evidence boundary · 3. Job 1 — Remediation verification (what holds, what was left behind) · 4. Job 2 — What round one missed (rule bodies, adapter contents, catalog drift, corpus adherence) · 5. Job 3 — Kept-row re-examination · 6. Cross-cutting census & corrections · 7. Recommendations — the round-two ranked plan · 8. Eliminated alternatives · 9. Open questions & UNKNOWNs · 10. Citations & source index · 11. Findings register (15 findings) · 12. Convergence report & loop telemetry · 13. Continuity & continuation

---

## 1. Executive summary

**Verdict: the 011/012 repair program is sound at the command surface and incomplete at the enforcement gate.** All eight workflow-asset touches verified true; all six document claims verified true; the printer fix, the fingerprint definition, the BM25 removal, and both 012 test repairs hold line-by-line. But the repair swept the authored workflow contract (acceptance-criteria.md) without sweeping the **runtime enforcement chain that backstops it**: the completion-evidence sentinel — fired by five runtime adapters on every completion claim — still gates on the retired `checklist.md` via `check-completion.sh`, with **zero references to acceptance-criteria anywhere in the file** (F2-01, P1). And a full-corpus adherence scan found the angle-7 class round one's single-packet sample missed: **27 packets carry human-mnemonic `sha256:<label>` values in the attested fingerprint slot (2 more `null`) — fabricated stamps the freshness checker silently classifies as never-recorded** (F2-14, P1). Two P1s, both at the enforcement layer, both fixes that cost one branch or one if-statement.

**The 13 P2s** decompose: 9 are one doc-coherence sweep over catalog/reference/asset surfaces the 011 sweep did not reach (F2-03, 05, 06, 07, 08, 10-README-claim, 12 + the two name/link items), 2 are mechanical (F2-02 engine, F2-11 cluster wiring), 2 are keep-verified observations (F2-04, F2-09) — and 1 measurement correction (F2-13, F2-15) sharpens the adoption math: **the freshness covenant's actually-exercised population is 412/3,250 (12.7%), not the 37.8% round one recorded** — because its count accepted any `sha256:` prefix and its zero share measured only one of three never-recorded classes.

**Job 3's honest result: zero kept rows re-listed.** F8's attribution claim verified at the message level; F4's off-switch distinctness verified against the narrowing env; F11's keep holds with the duplication now quantified (~70% of four gate-adapter pairs, 12–28% shared transport layer); F13 (census correction) re-confirmed; F23's zero-recorded-promotions re-verified; F31's decision stands on its corrected corpus (17/85 in-boundary).

**The ranked plan (§7): 5 moves, 2 mechanical (M2, M3), 2 low-risk registrations/wiring (M4, M5), 1 low-medium behavior change (M1 — the sentinel merge).** No move drops a documented, validated capability; every P1 fix is smaller than round one's P1 paperwork.

## 2. Scope, method & evidence boundary

- Same boundary as round one plus the round-two manifest: `.opencode/skills/system-spec-kit/**`, `.opencode/commands/speckit/**`, root AGENTS.md/CLAUDE.md/REPO RULES.md, `repo-rules/*.md`, restraint ladder; specs/ admissible for the adherence angle (angle 7's own mandate; corpus paths cited). Deep-loop skill contents = process, not evidence (only cross-referenced, never counted).
- Method: 10 iterations, one focus each; every finding = path:line + concrete cost + what it protects + P1/P2 + labeled recommendation. Counts measured in this tree (3,250 impl-summaries, 157 AC files, 39 registry rows, 28 rule scripts, 144 catalog refs, 85 playbook files — each from a counted pass recorded in the iteration files). 2,838/950-class counts from a validated python census with manual verification of the anomalous bucket (0 false positives: every pseudo-hash inspected in context).
- Non-goals honored: no edits; no recommendation drops a validated capability; no tooling executed (0 node/validate/git invocations — reads, greps and counted python only; dist/ treated as untracked/stale). All 30 writes under this lineage directory.
- Deviation recorded (only one): continuity save skipped (write-surface covenant), as in round one.

## 3. Job 1 — Remediation verification

### 3a. 011 — command-surface contract realignment: PARTIAL (assets ✓, enforcement chain ✗)

**Verified true (each read, not asserted):**
1. All 8 workflow assets: acceptance-criteria closure steps; every template path resolves on disk (0 MISS); zero symbolic `level_contract_*` doc names remain (only real code identifiers: `template-utils.sh:244`, `create.sh:453+`); `recommend-level.sh` wired in 6 asset sites with the "scores … and decides the level" note; ticket-id comment residue = 0. (iterations 001-002)
2. `validate.sh:45-61` printer derives categories from the registry; `validate-help-lists-every-rule.vitest.ts` (48 L) is registry-driven and asserts every id + category. (iter 003)
3. README strict-only count: exactly 3 rows (`strict_only` = CONTINUITY_FRESHNESS, GENERATED_METADATA_INTEGRITY, GENERATED_METADATA_DRIFT) — README:62,593 consistent. (iter 003)
4. Fingerprint definition: `validation-rules.md:113` ⇄ `spec-doc-structure.ts:629-635` (`normalizeForContinuityFingerprint`: CRLF→LF, 6-space `fingerprint:` zeroed to the placeholder, trailing ws stripped) ⇄ `continuity-freshness.ts:339-356` (attestation = implementation-summary.md stored vs recomputed) — three layers, one definition. F30's fix is correct. (iter 003)
5. complete.md:92 presentation boundary: 1 layout + 4 checkpoints (research, deep-context, phase-decomposition, closeout); presentation asset:3 matches. Six-dashboard promise gone. (iter 004)
6. Optimizer README adoption statement (0 promotions; manifest consumers named) — matches disk (0 files in promotion-reports/). (iter 004, 010)
7. resource-map README:64 link → `templates/addons/resource-map.md.tmpl` exists. (iter 004)
8. BM25 residue: only the declared-loss statement (feature-catalog.md:26,36) + changelog history. (iter 004)
9. Comment hygiene: 0 ticket-id patterns in the 8 assets. (iter 004)

**Left behind (incomplete-fix findings — each with file:line in the register):**
- **F2-01 (P1)** — the completion-evidence sentinel (`runtime/lib/hooks/completion-evidence-sentinel.cjs`) still gates `checklist.md` → `check-completion.sh --json` when the file exists, else a bare stat of implementation-summary.md; 0 occurrences of `acceptance-criteria`/`AC_CLOSURE`. Five runtime adapters (claude/codex/cursor/devin/pi) + the OpenCode plugin consume it. The post-011 "both completion gates" (tasks.md checklist + AC closure — SKILL.md:407,469,491,513) are enforced only by workflow steps, never by the mechanical backstop. Also confirmed by the playbook: `manual-testing-playbook/plugins-and-hooks/completion-evidence-sentinel.md` (12 test refs) documents the checklist gate as the tested contract.
- **F2-02 (P2)** — `check-completion.sh` described as THE completion gate in 7+ surfaces (feature-catalog ×3 entries + index, execution-methods.md:56-66, level-specifications.md:76, spec/README.md:64,101,151,163) with callers only sentinel+completion-state; `validate.sh` 0 mentions; command assets 0 mentions post-011.
- **F2-03 (P2)** — `spec-lifecycle-automation.md:37` describes upgrade-level.sh detecting level via checklist.md and creating checklist.md for L2; the actual script (upgrade-level.sh:9-10,212-213,338,769-782) uses acceptance-criteria.md + decision-record.md, 0 checklist references.
- **F2-05, F2-06, F2-07 (P2)** — level/checklist contract still stated in the older voice at quick-reference.md:54,581 + template-guide.md:104,151,203 + level-decision-matrix.md:302,327 (soft-guidance LOC; REQ-007 "checklist"; examples :116-119 "L1 + checklist") + template-composition-system.md:32 ("Level 2 adds checklist.md") + its point 6's "same contract" claim (FILE_EXISTS=3 docs, AC_CLOSURE=AC+cutoff, workflow=4 files).
- **F2-08 (P2)** — `spec-kit-docs.json` `documents[*].creationTrigger/absenceBehavior`: zero consumers in runtime/; `levels["2"].requiredAddonDocs: []` vs the workflow's 4-file required_files (011's "match the manifest" holds only for the workflow's own list).
- **F2-10+F2-12 (P2)** — the 011-adjacent inventory truth: rules/README.md:69's "full rule list" claim is false (28 files, 26 registry rows: `check-doc-pointers.sh` 0 refs; `check-links.sh` opt-in via a flag no one sets); 10 of 144 catalog runtime references point at removed/moved source.

### 3b. 012 — pre-existing test repair: COMPLETE

Fixture edits the hashed document (stale edits append to implementation-summary.md:164,180,196; evidence in tasks.md:52,65; 0 checklist.md in the fixture); manifest suite self-contained for its tracked case (two-entry manifest of test + checker); twin freshness suites complementary (7 core/API cases vs 10 CLI-bridge cases — not a duplication). Recorded-keep: F2-09 (checker + fixture still live in the 036 packet tree — disclosed by 012's own limitation note; the 036 packet is checked in and the test's subject is that checker).

## 4. Job 2 — What round one missed (its one-pass or never-covered angles)

Round one explicitly eliminated "read all 39 rule bodies" (read-budget); counted but never read the adapter contents; sampled the playbook on the wrong tree; sampled 1 adherence packet. This round covered those surfaces:

1. **The rule bodies (iter 5-6):** 28 scripts + 3 helpers, 4,748 LOC — all helpers single-consumer-legitimate (grep-convention's node helper justified: "bash cannot parse YAML honestly", check-grep-convention.sh:12); the graph-metadata 4-way family = 4 distinct failure modes (consistent with the F8-attribution logic kept by the census); the F8 spine verified at message level. New: F2-10 (orphan + false inventory claim), F2-11 (wikilink cluster).
2. **Adapter contents (iter 7):** measured — gate adapters are 68–76% shared text (classify 76–82%, enforce 68–76%), shared.ts only 12–28% (the real transport layer); pi (469 L, core-backed) and the opencode plugin (296 L, "only maps OpenCode's transport") are the in-tree thin shapes; the fat four are the pre-core shape. F11 re-examined; keep holds; phase-2 scope quantified.
3. **Catalog per-entry (iter 8):** 144 catalog runtime refs → 12 missing (10 stale source: 8 removed repo-wide, 1 moved, 1 renamed lint→audit) across 7 entries — the catalog contradicts its own disappearance notice (F2-12).
4. **Playbook provenance (iter 8):** round-one F31's sample file is deep-loop's; the 85-file count is system-spec-kit's (both corpora have 85 files). In-boundary re-measure: 17/85 cite a suite → 68/85 (80%) lack provenance (F2-13).
5. **Adherence at corpus scale (iter 9):** fingerprint census over 3,250 summaries: 412 well-formed (12.7%), 1,888 zero (58.1%), 27 pseudo-hash (0.8%), 2 null, 921 absent (28.3%) → never-recorded 87.3%. Fabricated stamps = F2-14 (P1). AC closure: 19/157 unmarked, 0 of which claim completion (positive). Placeholders: 9 marked docs, all benign (archived or pattern-discussion).
6. **Date-programmed validation (iter 6, observation):** canonical-save helper carries CANONICAL_SAVE_CUTOFF + ALLOWLIST_UNTIL (2026-05-01; allowlist already expired at audit time) — the graduation pattern is designed and documented; kept with a doc-sync note.
7. **Level contract manifest vs workflows (iter 2):** the L2 required set is stated three ways (FILE_EXISTS 3 docs / AC_CLOSURE AC + creation cutoff / workflow 4 files); aggregate-consistent, per-gate different — F2-08 frames the two dead manifest fields + the imprecise "match the manifest" claim.

## 5. Job 3 — Kept-row re-examination (ledger, final)

| Row | New evidence | Outcome |
|---|---|---|
| F4 skip severity | narrowing (`orchestrator.ts:432-453`) = subset-select, fatal on unknown; skip (:102-103,419) = per-row disable without re-listing | keep confirmed |
| F8 10→2 multiplex, attribution | helper `switch(selectedRule)` emits distinct per-row messages (:134-212) | keep confirmed |
| F11 3,582-LOC adapters | 68–76% duplicated gate text; shared.ts 12–28% transport; pi/opencode thin precedent | keep confirmed; phase-2 quantified |
| F13 opencode empty | symlink + README:67,82 "browsability-only" | census right (previously corrected) |
| F23 optimizer tail | 0 promotion reports; README adoption stated; manifest consumers = deep-loop (out-of-boundary, UNKNOWN per boundary) | keep confirmed |
| F31 playbook provenance | corrected corpus; 17/85 in-boundary; decision (no fabricated lines) stands | keep confirmed; numbers corrected |
| F30 fingerprint input unnamed | 3-layer agreement verified (code ⇄ doc ⇄ governance) | fixed correctly |

**No kept row was re-listed.** Two measurement corrections were made (F2-13/F2-15) — corrections of figures, not re-listings of decisions.

## 6. Cross-cutting census & corrections (this tree)

- 39 registry rows (20 authored_template / 13 operational_runtime / 6 structural; 32 error / 5 warn / 2 info; 3 strict-only) — round-one counts unchanged in the current tree.
- Corpus: 3,250 implementation summaries (census main-checkout: 3,247 — 3 more in this worktree); 157 acceptance-criteria files; 85 playbook files; 47 feature-catalog files (33 tooling-and-scripts).
- **Fingerprint adoption corrected:** 12.7% well-formed (round one's 37.8% accepted any `sha256:` prefix — the 27 pseudo-hash stamps + differently-shaped values account for the inflation; the census's 58% zero share is confirmed exactly).
- **Playbook corpus corrected:** two separate 85-file corpora; F31's sample and count came from different trees (round-one data-classification error, corrected).
- All positive controls re-verified: 0 faked AC closures at corpus scale; 0 real placeholder residue; sentinel/check-completion/doctor claims traced to real files.

## 7. Recommendations — the round-two ranked plan

*Verdict first: 2 P1s (F2-01 gate, F2-14 stamps), both at the enforcement layer, both one-branch fixes; 13 P2s — 9 fold into one doc sweep. No capability dropped.*

| # | Move (findings) | Capability preserved | Files touched | Risk | Gain: output / adherence / maintenance |
|---|---|---|---|---|---|
| M1 | Sentinel merges onto acceptance-criteria closure; checklist path → legacy-compat (F2-01, F2-02) | sentinel advise contract; legacy checklist gating; AC_CLOSURE's own rule | sentinel + completion-state (or shared AC read) + sentinel tests + playbook entry + check-completion docs | **LOW-MED** (advisory, fail-open gate; AC evidence = workflow closure rows + AC_CLOSURE format) | completion gate matches the authored contract / claims actually gated / checklist parser + 7 doc sites shrink |
| M2 | Fake-stamp classification + normalization (F2-14) | everything; adds one visible class | `continuity-freshness.ts:345-356` (+1 branch) + 29 stamps → zero placeholder | **TRIVIAL** | — / fake stamps visible; census clean / metrics honest |
| M3 | Doc-coherence sweep: level/checklist/catalog/path alignment (F2-03, 05, 06, 07, 08, 10-README-claim, 12) | nothing (alignment) | 7 reference/catalog/asset files + rules/README.md + manifest dead fields | **TRIVIAL** | — / single voice; scorer-based level choice / the drift class that already produced 2 cross-tree errors dies |
| M4 | Wire the wikilink cluster (F2-11) | wikilink scanning | registry row + `check-links.sh` gate | **LOW** | link integrity actually checked / flag has a gate / cluster gets a caller or explicit manual-only note |
| M5 | Register check-doc-pointers.sh (F2-10) | AGENTS.md-pointer guard | 1 registry row + README claim | **LOW** | the class that misled a lineage fails loud / / inventory claim true |
| — | Keep-list (F2-04, F2-09, F2-13, F2-15 + round-one keeps re-verified) | nested-changelog legacy read; the manifest-checker test subject; the provenance decision; the corrected 12.7% fact | 0 | — | measured non-bloat stays put |

**M1 is the single behavior-changing move; expected effect on the three outcomes: better output (gating matches the contract), better adherence (sentinel + real stamps + scorer-decided levels), lower maintenance (one voice for the level/checklist contract, dead fields gone, inventory claims true).**

## 8. Eliminated alternatives

| Approach | Reason eliminated | Evidence | Iteration |
|---|---|---|---|
| Re-read all 39 rule bodies in full | surface-level + caller-set + duplication-seam analysis sufficed; the F8 attribution was verified at message level without body exegesis | iter 5-6 | 5-6 |
| Re-list F8 | attribution verified TRUE (switch emits distinct per-row text) | check-canonical-save-helper.cjs:134-212 | 6 |
| "The two continuity-freshness suites are a duplicated suite" | FALSE — 7 core/API cases vs 10 CLI-bridge cases, distinct subjects | iter 4 | 4 |
| "The 19 unmarked AC tables are faked closures" | FALSE — 0 of them carry a completion claim | iter 9 | 9 |
| "The 9 placeholder-marked docs are residue" | FALSE — archived + pattern-discussion contexts | iter 9 | 9 |
| "Check-completion.sh is dead code" | PARTLY — live via the sentinel's checklist path (which is why the fix is M1-merge, not delete) | iter 1 | 1 |
| "Round-one number 58%/37.8% is usable as-is" | NO — the 37.8% accepts pseudo-hashes; the never-recorded share is 87.3% | iter 9 | 9 |

## 9. Open questions & UNKNOWNs

1. **Which runtimes actually fire the hook matrix?** The registrations (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/`, `.devin/`, `.pi/`) sit outside the evidence boundary — the in-boundary evidence shows live-shaped adapters (READMEs + tests each) but not firing. Same UNKNOWN round one recorded (its F12 was left UNKNOWN; the census recorded it out of scope). The usage census is the precondition for M1's risk call; until it runs, M1 stays LOW-MED.
2. **Manifest consumers of the optimizer** (deep-research/deep-review configs) — out-of-boundary per the evidence boundary; the README statement (run 4/10) and census record are the only in-boundary attestations. UNKNOWN, as before (F23's own UNKNOWN).
3. **Who wrote the 27 pseudo-hash stamps** — a pre-covenant generator, a migration, or hand-editing? The value shapes (session labels embedded in the hash slot) suggest hand-composition in the z_archive/026-era packets; no legacy format is documented anywhere. UNKNOWN; M2's normalization resolves the data regardless.
4. **F31's deep-loop corpus figure** — round one's 23/85 re-measure was attributed to the wrong tree; the deep-loop playbook's own number was not re-measured in this round (out-of-boundary). The system-spec-kit number 17/85 is the corrected in-boundary value. UNKNOWN for the deep-loop tree.

## 10. Citations & source index

Runtime: `runtime/lib/hooks/completion-evidence-sentinel.cjs` (evaluateCompletionEvidence; 0× acceptance-criteria), `runtime/cli/lib/completion-state.cjs:31,64-72,141-159`, `runtime/cli/spec/check-completion.sh`, `runtime/cli/spec/upgrade-level.sh:9-10,212-213,338,769-782`, `runtime/cli/spec-folder/nested-changelog.ts:655`, `runtime/lib/templates/level-contract-resolver.ts:241-273`, `runtime/cli/utils/template-structure.js:62,167-197,377-381`, `runtime/cli/rules/check-files.sh:33-86`, `runtime/cli/rules/check-ac-closure.sh:11,217-255`, `runtime/cli/rules/check-canonical-save.sh:18-48`, `runtime/cli/rules/check-canonical-save-helper.cjs:13-27,132-212`, `runtime/cli/rules/check-doc-pointers.sh` (0 refs), `runtime/cli/rules/check-links.sh:89-91`, `runtime/cli/check-links.sh:3-11`, `runtime/cli/spec/validate.sh:45-61`, `runtime/cli/validation/continuity-freshness.ts:339-356`, `runtime/cli/validation/generated-metadata-integrity.ts`, `runtime/lib/validation/orchestrator.ts:102-103,295,419,432-453`, `runtime/lib/validation/spec-doc-structure.ts:629-635`. Hooks: `runtime/hooks/{claude 4,249 / codex 1,069 / cursor 1,523 / devin 1,608 / pi 469 / lib ~4,021 / opencode symlink}`, `hooks/README.md:23,67,82,88,140`. Docs: `templates/spec-kit-docs.json` (documents[].creationTrigger/absenceBehavior 0 consumers; levels[2] requiredAddonDocs=[]), `feature-catalog/feature-catalog.md:26,36,130`, `feature-catalog/tooling-and-scripts/{spec-lifecycle-automation.md:21,37,39,57 ; completion-verification-workflow.md:6,19,29,33,64 ; template-composition-system.md:32,48 ; code-standards-alignment.md (6 dead refs) ; session-capturing-pipeline-quality.md ; core-workflow-infrastructure.md ; session-extraction-and-enrichment.md ; strict-validation-addons-continuity-freshness-and-evidence-markers.md ; spec-validation-rule-engine.md}`, `references/workflows/quick-reference.md:54,581`, `references/templates/template-guide.md:104,151,203`, `references/templates/level-specifications.md:76`, `references/workflows/execution-methods.md:56-66`, `references/validation/validation-rules.md:113`, `assets/level-decision-matrix.md:45,53,116-119,262,302,327`, `assets/template-mapping.md:297`, `runtime/cli/optimizer/README.md` + `audit/promotion-reports/` (0), `runtime/cli/resource-map/README.md:64`, `runtime/cli/rules/README.md:57-84`, `runtime/cli/tests/validate-help-lists-every-rule.vitest.ts`, `runtime/tests/continuity-freshness.vitest.ts` + `runtime/cli/tests/continuity-freshness.vitest.ts`, `runtime/cli/tests/recursive-child-manifest.vitest.ts`, `manual-testing-playbook/` (85; 17 vitest-citing; `plugins-and-hooks/completion-evidence-sentinel.md` 12 refs). Governance: `AGENTS.md:280,301,385`. Corpus: 3,250 impl-summaries; 412/1,888/27/2/921 fingerprint shapes; 157 AC files; 19 unmarked (0 claimed).

## 11. Findings register

15 findings — 2 P1 (F2-01, F2-14), 13 P2 (F2-02..F2-13, F2-15). Full statements, costs, protections, severities and labeled recommendations in `findings-registry.json` (replayed from `deltas/iter-00{1..10}.jsonl`). P1→move mapping: F2-01→M1, F2-14→M2. P2→move mapping: F2-02→M1, F2-03/05/06/07/08/10/12→M3, F2-11→M4, F2-10→M5, F2-04/09/13/15→keep-list. No round-one finding is re-reported as new (the round-and-census IDs map 1:1 to the verified row states in §3/§5).

## 12. Convergence report & loop telemetry

- **Stop reason**: `maxIterationsReached` — the dispatch-mandated cap (10/10). Convergence before the cap was telemetry-only; no early synthesis.
- **Total iterations**: 10 × `complete`; 0 timeouts, 0 errors, 0 stuck; stuck count 0 throughout.
- **Questions answered**: 10/10 (KQ-R1a..R3; all answered — the two UNKNOWNs carried to §9, not suppressed).
- **newInfoRatio**: 0.95, 0.85, 0.35, 0.45, 0.80, 0.30, 0.45, 0.75, 0.80, 0.30 (mean 0.60; rolling-10 0.60). Negative knowledge honored: 8 ruled-out/corrected directions persisted in deltas + registry.
- **Convergence math**: convergenceThreshold=3 (dispatch-supplied; above the 0..1 novelty scale → novelty STOP structurally unreachable, recorded as telemetry); compositeStop 0.0 throughout; stuckThreshold=3 never approached. Quality guards (source diversity, focus alignment, weak-source dominance): pass — 45+ distinct in-boundary sources cited, 1 focus/iteration enforced, no single-source finding.
- **Note (single documented deviation)**: continuity save intentionally not executed (write-surface covenant; documented at this file's head and in §2). `config.status` remains `initialized` per SKILL.md NEVER-6 (config read-only after init); completion recorded here + in the terminal event, not by editing the config.

## 13. Continuity & continuation

- **State**: complete. 10/10 iterations; synthesis (this file); terminal event `loop_terminal` `stopReason: "maxIterationsReached"` (last record of `deep-research-state.jsonl`, 12 lines: 1 config + 10 iterations + 1 terminal). Registry: 15 finding records; dashboard: 10-row table; strategy: final.
- **Recovery surface**: `deep-research-state.jsonl` (append-only) + `deltas/iter-00{1..10}.jsonl` (reducer-owned) + `iterations/iteration-001..010.md` (write-once).
- **Continuation**: the 011/012 gap (F2-01, F2-14) is the next child's first work order; M3's sweep is a mechanical follow-up an operator can run in one session; M1's risk call needs the runtime-usage census (§9.1). The corrected 12.7% adoption figure should replace the round-one/census numbers in the packet's implementation summary when the lane next updates.
