# Deep Research Strategy — deepseek-v4-flash-overengineering

Session: fanout-deepseek-v4-flash-overengineering-1788762836148-1dgwlq | generation 1 | lineageMode: new | stopPolicy: max-iterations (cap 10) | convergenceThreshold: 3 (telemetry-only; see config `_thresholdNotes`)

## Topic

ROUND TWO of the overengineering lane: ten more iterations on the tree AFTER remediation. Round one (GLM 5.3 Flash, lineage `glm-5-3-flash-overengineering`) ran ten iterations against an older tree; its synthesis is `specs/.../lineages/glm-5-3-flash-overengineering/research.md`; the census that judged every row against the real repository is `research/confirmed-findings.md`; every confirmed row was remediated in children 011 (`command-surface-contract-realignment`) and 012 (`pre-existing-test-repair`), whose implementation-summary.md and confirmed-findings disposition were read before the first pass (see Known Context).

Three jobs, in priority order:
1. **Verify remediation completeness**: each remediation landed completely and coherently in the current tree. A fix that left one consumer, one document line, one fixture or one asset behind is a finding.
2. **Find what round one missed**: starting from its open questions (none recorded) — derive the angles round one covered in one pass or not at all, and prefer those. Known round-one blind spots: (a) the 39 rule-body contents were explicitly NOT read (eliminated for read-budget) — only guard surfaces; (b) hook adapter CONTENTS were counted (LOC) but not read; (c) the playbook audit sampled n=1 of 85 scenarios; (d) feature-catalog was counted, not per-entry-verified against code; (e) specs/ adherence sampled 1 packet + 6 fingerprints; (f) the checklist.md retirement touched 8 assets but the catalog/runtime consumers were not censused (this is where iteration 1 already found material).
3. **Re-examine kept rows**: re-list a round-one kept row ONLY with new evidence that its stated reason is wrong (e.g., F8's attribution claim, F4's off-switch claim, F11's registration-contract claim).

## Research Charter

### Role
Systems auditor; a rule, doc, gate, or abstraction earns its keep only by visibly improving one of: better output, better AI adherence in practice, lower maintenance. Absence of harm is not justification. Round-two additions: remediation verifier (job 1) and delta-finder over round-one's one-pass surfaces (job 2).

### Required output shape per finding
`path:line; what exists; its cost (reads, steps, maintenance); what it protects; severity P1|P2; recommendation: remove|merge|fold into a repo rule|keep` — with exact cited evidence. No "feels heavy" claims. No re-reporting of a row confirmed-findings.md marks fixed unless the fix is incomplete. Never reuse a round-one count: recount in this tree.

### Non-Goals
- No edits; research only.
- No recommendation that drops a documented, validated capability.
- No prose-style or tone commentary.
- No tooling execution: do NOT run generate-context.js, validate.sh (especially --recursive), node tooling, or any git write/checkout/commit. Reading and counted greps are the only evidence operations; the compiled dist/ directories are untracked and stale.
- Writes ONLY under the lineage directory `specs/system-speckit/035-spec-kit-simplification-research/005-overengineering-simplification/research/lineages/deepseek-v4-flash-overengineering`.

### Stop Conditions
- 10 iterations completed → synthesis with stopReason `maxIterationsReached` (hard).
- 3 consecutive iteration failures → stuck recovery; if recovery fails, halt to synthesis with gaps documented.

## Key Questions (10 — one per iteration)

1. **KQ-R1a**: Did the checklist.md retirement reach every consumer — the completion gate script (`check-completion.sh`), the level detector (`upgrade-level.sh` / orchestrator inference), the completion-evidence sentinel, the nested-changelog reader, and every catalog/reference line that describes them? Which of those are now dead, and which still run?
2. **KQ-R1b**: Did the template-name and LOC-scorer repairs reach every surface — any remaining symbolic `level_contract_*` names, any remaining "LOC = soft guidance" statements contradicting AGENTS.md's scorer-decides, and does `recommend-level.sh` exist and get called where the assets say?
3. **KQ-R1c**: Are the post-remediation mechanical claims coherent — validate.sh help (39 rules, categories from registry, the test that holds it), README's "three strict-only rules" count, and the freshness fingerprint definition now agreeing across checker code, validation-rules.md, and governance?
4. **KQ-R1d**: Is each remaining 011/012 touch complete — complete.md presentation boundary, optimizer adoption README, resource-map README real path, BM25 zero residue, comment hygiene, and do the 012 test fixes test the rule rather than a stale fixture (no other test still depends on the old fixtures)?
5. **KQ-R2a**: What do the 39 rule bodies actually do — the 28 scripts + 3 helpers under `runtime/cli/rules/` (round one never read them): which duplicate each other, which are unreferenced (`check-doc-pointers.sh` has zero references), which contradict the registry, and what does `rules/README.md` claim vs contain?
6. **KQ-R2b**: The shell-rule implementation spine — the 5→1 `check-canonical-save.sh` + helper, `check-ac-closure.sh`/`check-ac-coverage.sh` (15KB each), `check-grep-convention.sh` + 21KB `.mjs` helper — is the 3-layer execution machinery justified per-script, and does F8's "each row names a distinct failure" attribution claim hold?
7. **KQ-R2c**: Hook adapter contents (angle round one counted but never read): are codex/cursor/devin/pi adapters near-duplicates of claude, what do they actually register, which runtimes are unused, and what does hooks/README.md + the doctor asset claim vs contain?
8. **KQ-R2d**: Manual-testing-playbook + feature-catalog per-entry verification (round one counted, sampled n=1 in the playbook): do entries describe scripts/surfaces that no longer exist (e.g., check-completion.sh as the gate), and does the playbook duplicate the vitest suites it shadows?
9. **KQ-R2e**: Adherence scan inside specs/ in THIS tree (recount, per the mandate): zero-fingerprint share of implementation summaries, placeholder residue, unticked acceptance-criteria rows, packets claiming complete without closure — broad statistical scan rather than round-one's single-packet sample.
10. **KQ-R3**: Kept-row re-examination with run-1..9 evidence: F4 (`skip` severity off-switch), F8 (attribution claim), F11 (adapter registration contracts), F23 (optimizer kept), F31 (playbook provenance) — plus any fixed-row whose fix is incomplete per job 1. Ranked simplification plan for round two.

## Known Context (init reconnaissance, 2026-09-07T08:33Z)

- Current tree = worktree 046 checked out at the post-remediation state; 011/012 changes ARE present (verified: `speckit-complete-auto.yaml` authors acceptance-criteria; `validate.sh:45-61` derives categories from the registry).
- Round one (glm-5-3-flash) verdict: overengineering in the perimeter (5 P1: F1, F11, F14, F18, F23); core on keep-list. Census (confirmed-findings.md) confirmed F1/F11/F14/F18/F23 with adjustments (F13 dropped — symlink; F25 superseded — child 009 removed; F27 re-measured 58%; F30 collision did not reproduce, but the hashed-input half was fixed; F31 23/85 cite).
- 011 fixed: 8 workflow assets (checklist.md→acceptance-criteria closure, real template paths, recommend-level.sh note, comment hygiene), validate.sh help printer + new vitest, complete.md presentation boundary, README 3-strict-only count, validation-rules.md fingerprint definition, optimizer README adoption, resource-map README link, BM25 removal.
- 012 fixed: continuity-freshness.vitest.ts fixture (tasks.md evidence; stale edits on implementation-summary.md), recursive-child-manifest.vitest.ts self-contained manifest.
- Init recon already found (job-1 material): `runtime/cli/spec/check-completion.sh` still exists and is still documented as the checklist gate in 5+ places (feature-catalog ×3 entries, `feature-catalog.md:130`, `references/workflows/execution-methods.md:56-66`, `references/templates/level-specifications.md:76`, `runtime/cli/spec/README.md:64,101,151,163`); `completion-evidence-sentinel.vitest.ts` says "never spawns check-completion.sh" — call graph unknown; `runtime/cli/spec-folder/nested-changelog.ts:655` still reads `checklist.md`; `references/workflows/quick-reference.md:54,581`, `references/templates/template-guide.md:104,151,203`, `assets/level-decision-matrix.md:302,327`, `assets/template-mapping.md:297` still say LOC is "soft guidance"; `runtime/cli/rules/check-doc-pointers.sh` has ZERO references anywhere.
- Round-one numbers to re-verify in this tree, not reuse: 39 rule rows (registry, list-of-39 confirmed at init: 32 error/5 warn/2 info → re-counted above; categories: 20 authored_template + 13 operational_runtime + 6 structural), 28 rules scripts + 3 helpers, 30 rows/54 alias strings (F9 re-measure), 5 hook trees + opencode (F13 symlink), docs volume counts.

## Machine Sections (reducer-owned)

### key-questions
KQ-R1a..KQ-R3 above.

### answered-questions
- (none yet — init recon is not an iteration)

### what-worked
- Init recon confirmed the remediation is present in this tree before any iteration (avoided a whole wasted pass on a stale tree).

### what-failed
- (none yet)

### exhausted-approaches
- (none yet)

### ruled-out-directions
- (none yet)

### divergence-frontier
- (none yet)

### next-focus
1. KQ-R1a — checklist.md retirement completeness at the runtime/catalog level (check-completion.sh call graph, sentinel, upgrade-level.sh, nested-changelog, catalog entries). Iteration 1, begin immediately.

## Active Risks

- convergenceThreshold=3 exceeds the 0..1 novelty scale → novelty STOP unreachable by design; loop runs to the cap (prompt-mandated).
- Read-budget: rule bodies are ~3.8k LOC of shell; spread over two iterations, read only guard surfaces + duplication seams.
- Re-reporting constraint: confirmed-fixed rows must NOT be re-reported unless the fix is incomplete; keep the round-one F-id vocabulary for cross-referencing and number new findings F2-01..F2-NN.

## Loop Completion State (final, reducer channel)

- STATUS: COMPLETE — 10/10 iterations, stopReason maxIterationsReached (dispatch cap; convergence telemetry only).
- Key questions: 10/10 answered (KQ-R1a..KQ-R3); 2 UNKNOWNs carried to research.md §9 (runtime usage census; optimizer out-of-boundary manifest consumers).
- Findings: 15 (2 P1: F2-01 sentinel checklist-gate mismatch, F2-14 fabricated fingerprint stamps; 13 P2). Registry: findings-registry.json; plan: research.md §7 (M1-M5 + keep-list).
- What-worked (round two): verification-first iteration design — 12 of 18 job-1 checks verified true before job-2 angles; the corpus fingerprint census (python shape-classifier) found the angle-7 class round one's single-packet sample structurally could not; measured (not estimated) adapter similarity via difflib.
- What-failed: none (0 errors/stuck/timeouts). 
- Ruled-out-directions (persisted): sentinel-also-checks-AC (counted 0); check-completion in validate.sh (0 mentions); help-test hardcoded (registry-driven); create.sh FILE_EXISTS gap (helper returns core+addon only); F8 re-list (attribution verified); twin-suite duplication (complementary); unmarked-AC fakes (0 claimed); placeholder residue (benign contexts); hash-input unnamed (fixed+verified).
- Exhausted-approaches: none remaining for the mandated scope.
- next-focus: (none — loop complete; continuation work orders in research.md §13: M1 sentinel merge, M2 stamp normalization, M3 doc sweep, plus the runtime-usage census precondition).
