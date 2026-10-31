# Iteration 009 — Residue/broadening pass: spot re-verification + untouched prose sweep

- sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
- Window opened: 2026-09-06T23:52:18Z (init) · iteration executed 2026-09-07T01:42Z–01:58Z
- Focus: forced-depth broadening — (a) spot re-read the 3 least-corroborated P1s; (b) sweep untouched prose (MIGRATION.md, phase-definitions.md, template-guide rows); (c) verify citations still hold.
- Status: complete · newInfoRatio: 0.061 (2 new findings / 35 accumulated)
- Novelty justification (1 sentence): first-recorded — the phantom hard-block on decision-record.md and MIGRATION.md's self-contradictory co-location note; the spot re-reads confirmed prior citations without new findings.
- Executor: this process, inline · tool calls: 7 bash evidence + writes = within 12; research actions 5.
- Quality guards: source diversity 9 distinct files; every finding ≥3 records; focus alignment (residue/broadening per plan).

## Focus

Residue pass per strategy §11 (all 8 charted angles answered; iterations 9-10 broaden per the stop policy).

## Actions Taken

1. SPOT RE-VERIFICATION (3 least-corroborated P1s, direct re-reads): (a) f-iter001-001 — spec-kit-docs.json documents[] still declares acceptance-criteria.md owner=author/creationTrigger=scaffold/absenceBehavior=warn (`:152-156`) with zero runtime consumers (angles 1-5 evidence unchanged); (b) f-iter002-002 — README:148-151 rows unchanged ("(optional, warns if absent)" / "Level 2 + decision-record.md (optional, created on request)" / "approval workflow, compliance checkpoints, stakeholder matrix"); (c) f-iter007-001 — the five low-version self-markers re-read verbatim: resource-map v1.1, debug-delegation v1.0, research v1.0, context-index v1.0, handover v1.0. All three citations HOLD. [SOURCE: templates/spec-kit-docs.json:152-156; README.md:148-151; templates/addons/resource-map.md.tmpl:17; templates/addons/debug-delegation.md.tmpl:18; templates/addons/research.md.tmpl:16; templates/packet-types/context-index.md.tmpl:15; templates/addons/handover.md.tmpl:17]
2. MIGRATION.md full read (53 lines): `:14` — "`<!-- Lives at templates/manifest/ (not references/) because it co-locates with the manifest assets it documents. -->`" — the file LIVES at templates/ root (templates/MIGRATION.md), not templates/manifest/; the same directory that does not exist per f-iter007-002 (staleness checker's dead default). Legacy policy confirmed (`:24-27,46-47`: indefinite read support, current-version writes). `:33-38` — legacy document-list derivation includes resource-map.md/context-index.md "when present" and command-owned docs "only when present" — consistent with the hardcoded extras (f-iter008-001). [SOURCE: templates/MIGRATION.md:14,24-27,33-38,46-47; ls templates/ (no manifest/)]
3. phase-definitions.md vs phase contract: thresholds `:59-60` (phase score ≥ 25 of 50; level ≥ 3) + the two-scoring-systems clarification `:62` — consistent with the framework's phase-qualification doctrine; the phase CONTRACT (spec-kit-docs.json levels.phase: requiredCoreDocs=[spec.md], lazy 6) carries no threshold data — no mismatch (the thresholds live in prose+recommend-level.sh by design). [SOURCE: references/structure/phase-definitions.md:59-62; templates/spec-kit-docs.json levels.phase (node dump)]
4. template-guide row sweep: `:27` — "Level 2 (Verification): Level 1 + acceptance-criteria.md (checklist.md optional)" — a FIFTH live checklist.md reference beyond f-iter008-002's four; `:29` — "Level 3 (Full): Level 2 + decision-record.md + optional research/research.md" (ladder model, contradicts flat arrays per f-iter003-002); `:178,225` — "**Enforcement:** Hard block if `decision-record.md` missing" (L3 section); `:555` — handover.md "initial file seeded from the template" by /speckit:save. [SOURCE: references/templates/template-guide.md:27,29,178,225,555]
5. decision-record hard-block verification: `node runtime/cli/utils/template-structure.js docs 3` → [spec.md, plan.md, tasks.md] — decision-record.md NOT in L3 required docs; no registry rule requires it (FILE_EXISTS reads the same helper; registry dump angle 5); check-level-match.sh:222-223 merely WARNS when decision-record.md is present at L1 (the inverse direction); manifest lists decision-record.md in lazyAddonDocs at every level (`:189,565,1059,1613`). The claimed hard block does not exist in any enforcement surface found across the run. [SOURCE: node runtime/cli/utils/template-structure.js docs 3; runtime/cli/lib/validator-registry.json; runtime/cli/rules/check-level-match.sh:222-223; templates/spec-kit-docs.json:189,565,1059,1613]

## Findings

### f-iter009-001 — P1 — fix

`references/templates/template-guide.md:178,225` vs `node runtime/cli/utils/template-structure.js docs 3` + `runtime/cli/lib/validator-registry.json` + `runtime/cli/rules/check-level-match.sh:222-223` — CLAIM: the decision-record.md section states "**Enforcement:** Hard block if `decision-record.md` missing" (Level 3 guidance). FACT: decision-record.md is in NO required bucket (lazyAddonDocs at every level, `:189,565,1059,1613`); FILE_EXISTS requires only spec/plan/tasks (+ lifecycle summary); no registry rule hard-blocks on it; the only level-related signal is an ADVISORY WARNING in the OPPOSITE direction (present-at-L1 → consider upgrading, check-level-match.sh:223). The strongest enforcement phrase in the prose describes a gate that was never wired. SEVERITY: **P1** — authors of L3 work are told a missing file blocks them; nothing does (the opposite of the AC case, where the prose understates a real gate, f-iter004-002). RECOMMENDATION: **fix** — "decision-record.md is a level-agnostic lazy addon: scaffold it with --with-lazy-addons or render manually; absence never blocks" (cross-link f-iter003-001's flag documentation).
[SOURCE: references/templates/template-guide.md:178,225; templates/spec-kit-docs.json:189,565,1059,1613; runtime/cli/lib/validator-registry.json; runtime/cli/rules/check-level-match.sh:222-223; runtime/cli/utils/template-structure.js docs 3 output]

### f-iter009-002 — P2 — fix (or merge into MIGRATION move)

`templates/MIGRATION.md:14` vs the tree (`templates/MIGRATION.md`; no `templates/manifest/`) — CLAIM: the file's own HTML comment says it "Lives at templates/manifest/ (not references/) because it co-locates with the manifest assets it documents". FACT: it lives at templates/ root; the templates/manifest/ directory it names does not exist (the same phantom path the staleness checker reads, f-iter007-002). The comment is residue of an unexecuted (or reverted) relocation, and it is the second document referencing the phantom directory. SEVERITY: **P2**. RECOMMENDATION: **fix** — correct the comment to templates/ (or actually move the file + fix the checker in one change, resolving both f-iter007-002 and this finding).
[SOURCE: templates/MIGRATION.md:14; ls templates/; runtime/cli/spec/check-template-staleness.sh:61-71]

### (telemetry, not a finding) — template-guide.md:27 carries a FIFTH live checklist.md reference ("checklist.md optional" in the L2 line); folded into f-iter008-002's remove list. The template-guide L2/L3 lines (`:27-29`) also repeat the ladder model (f-iter003-002's scope extends here); folded, no new finding.

## Questions Answered

- Residue pass COMPLETE: the 3 spot re-reads confirm f-iter001-001, f-iter002-002, f-iter007-001 unchanged; MIGRATION.md/phase-definitions.md swept (one new P2: f-iter009-002; phase thresholds clean); template-guide sweep surfaced f-iter009-001 (P1) + folds the fifth checklist reference and the ladder-model extension into existing findings.

## Questions Remaining

- None substantive; iteration 10 = final cross-angle consistency + synthesis preparation (forced).

## Ruled Out (do not retry)

- ro-iter009-001: "a hard block on missing decision-record.md exists somewhere not yet searched" — ruled out for the surfaces in scope: FILE_EXISTS (helper docs), the registry (39 rules), check-level-match (warn-only, inverse), AC rules (AC-only scope), create.sh (lazy docs only). [SOURCE: runtime/cli/lib/validator-registry.json; runtime/cli/rules/check-level-match.sh:222-223; runtime/cli/utils/template-structure.js docs 3]
- ro-iter009-002: "phase-definitions thresholds contradict the phase contract" — ruled out: the contract carries no threshold data; the two-scoring-systems note (`:62`) pre-empts the conflation. [SOURCE: references/structure/phase-definitions.md:59-62]

## SCOPE VIOLATIONS

None. Writes: `iterations/iteration-009.md`, `deltas/iter-009.jsonl`, `deltas/event-009.json` + gateway ledger/projection writes — all inside the lineage directory. No packet-level writes, no repo tooling.

## Next Focus

Iteration 10 — final pass: cross-angle consistency sweep over the registry (duplicate/severity-normalization check across the 35 findings), confirm the consolidation ledger's verdicts against the full delta corpus, then hand the synthesis (research.md + resource-map.md + stopReason maxIterationsReached) to phase_synthesis.

## Convergence telemetry (advisory only — stopPolicy=max-iterations)

newInfoRatio = 0.061 → NOT qualifying (bar 0.05 not met); consecutiveQualifying 0/3. Loop continues: 1 iteration remains, forced.
