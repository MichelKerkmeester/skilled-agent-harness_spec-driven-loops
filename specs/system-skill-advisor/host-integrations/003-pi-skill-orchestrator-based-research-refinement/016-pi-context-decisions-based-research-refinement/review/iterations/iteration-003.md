# Iteration 003 - Traceability

## Dispatcher

- Run: 3 of 5, generation 2, lineage `restart`, session `2026-11-23T05:51:03.170Z`.
- Dimension: traceability (D3).
- Iteration number derived from the state log: two prior `type:"iteration"` records, so this is iteration 3, matching the dispatch.
- Operator focus: checked the epic's packet claims against code and tests at HEAD rather than trusting them. Covered the child status metadata for phases 001 to 027, every acceptance-criteria row in the seven children that carry one (018, 019, 020, 022, 025, 026, 027), a rerun of the grep and test commands behind the third-round rows (027), the doctor cleanup contract suite, the phase-003 ship decision, and the catalog and playbook entries for pasted-reply stripping and route receipts.

## Files Reviewed

- Child `spec.md` status rows and `graph-metadata.json` status for 001 to 027; parent phase map `spec.md:143-146` and handoff table `spec.md:189-193`.
- `acceptance-criteria.md` in 018, 019, 020, 022, 025, 026, 027 (status column of every AC row; full text of the 027 rows).
- `003-follow-up-routing-benchmark/tasks.md:70-80` and `implementation-summary.md:53,67,80` (ship-only tasks).
- `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` (run: `tests 21`, `pass 21`, `fail 0`, exit 0).
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md`, `feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md`, `manual-testing-playbook/scorer-fusion/pasted-reply-stripping.md`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1087-1089`, `runtime/lib/prompt-policy.ts:244-267`, `runtime/scripts/skill_advisor.py:5053`, `hooks/dsh/prompt-advisor.mjs:25,108,184,213`, `hooks/vibe/prompt-advisor.mjs`.
- Runs read with output and exit: `validate.sh --strict` on child 007 (`RESULT: PASSED`, Errors 0, Warnings 0); `npx vitest run tests/manual-testing-playbook.vitest.ts` (2 passed); the AC-001, AC-006 and AC-015 `git grep` commands of 027.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Children 007 to 010 still record status Planned while the parent map and their own summaries record them complete** -- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/spec.md:25 -- The metadata table of four shipped children reads `| **Status** | Planned |` [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/spec.md:25] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/008-handler-scored-prompt-consumers/spec.md:25] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/009-crash-fallback-edge-cases/spec.md:26] [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/010-route-receipts-research/spec.md:25], and each `graph-metadata.json` carries `"status": "planned"` (line 38 in 007 and 008, line 39 in 009 and 010). The parent phase map marks all four Complete [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:143-146], the 007 summary records `completion_pct: 100` and "Built 2026-11-18" [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity/implementation-summary.md:24], every real task row is checked, and the code agrees the work shipped: the Python strip mirror exists [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5053] and `rr-paste-208` is gone from the divergence ledger (0 hits in `local-native-approved-divergences.json`). The other 23 children read Complete. Strict validation passes on 007, so the validator does not catch the drift, and a graph or status query over this epic reports four finished phases as not started.
   Finding class: completion-metadata drift (packet docs)
   Scope proof: status grep over all 27 child `spec.md` files; only 007, 008, 009 and 010 differ, all four from the same 2026-11-18 build batch
   Affected surface hints: the four child `spec.md` metadata tables and `graph-metadata.json` `derived.status`; the parent phase map is already right
   Case: a status query over the epic graph lists 007, 008, 009 and 010 as planned although their code, tests and summaries show them built.

2. **Route-receipt catalog entry describes the DSH adapter but lists no DSH source or test, and calls the guard Claude-only** -- .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:16 -- The overview says "The Claude hook holds back a confidence-floored route" [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:16], yet the build put the guard in the shared handler for Claude, Codex, Vibe and DSH (phase 011 SC-001). How It Works then describes the DSH adapter dropping a receipt at session start and clean compaction [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:24], but the Source Files tables list only `route-receipt.ts`, the Claude handler and `route-receipt.vitest.ts` [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:34-41]. The code that does the DSH drop and clock rotation is `dropRouteReceipt` and `advanceBoundary` [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:184] [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:213], tested in `hooks/tests/dsh-prompt-advisor.test.mjs`; neither appears. Documentation traceability only.
   Finding class: catalog-to-code source gap
   Scope proof: the one catalog entry for the receipt guard; the pasted-reply catalog entry matches its code (`scoreAdvisorPrompt` strips first [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1087-1089])
   Affected surface hints: `feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md` overview and Source Files; `feature-catalog/feature-catalog.md` summary row if it repeats "Claude hook"
   Case: an operator tracing why a DSH session dropped its receipt follows the catalog's source table and never reaches `hooks/dsh/prompt-advisor.mjs`.

3. **027 AC-006 records "the grep exited 1" but the same grep prints a line at HEAD** -- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59 -- AC-006 asks that `git grep score-outcome-rerank` outside `specs/` print nothing and records "The grep exited 1" as Met evidence [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/027-epic-review-fixes/acceptance-criteria.md:59]. Rerun at HEAD it prints one hit, `.skilled/skills/system-skill-advisor/changelog/v2.0.1.0.md:32`, a changelog line last touched by the 027 fix commit `c3371f46a6e`. The intent holds (no live code names the deleted script), and AC-001 and AC-015 exclude changelogs explicitly while AC-006 does not, so the row's own command cannot reproduce its recorded evidence.
   Finding class: non-reproducible acceptance evidence
   Scope proof: AC-001 and AC-015 reran clean with their changelog exclusion; AC-006 is the one row of the three that omits it
   Affected surface hints: 027 `acceptance-criteria.md` AC-006 wording or evidence cell
   Case: a closure audit reruns AC-006's grep verbatim at HEAD, gets exit 0 with one changelog line, and cannot confirm the Met mark.

Severity doctrine: loaded `.skilled/skills/sk-code/sk-code-review/references/review-core.md` (P2 = documentation polish or non-blocking follow-up, line 45). None of the three changes runtime behavior or a gate outcome, so none reaches P1 ("spec mismatch" there means code against spec, and code matches spec in all three).

## Traceability Checks

- `spec_code` (pass): the third-round claims now all hold at HEAD. Exclusion reload [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/route-exclusions.ts:94-116] and the offer gate in both runtimes (iteration 1), bridge env parity and the crash fallback (iteration 2), and this iteration the doctor cleanup wiring: the contract suite runs 21 cases, 21 pass, exit 0, including the apply-command and the `delete`/`keep` cleanup cases [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:222]. Lane removal residue: `git grep -i 'ollama|semantic-shadow|embedders'` over the advisor skill outside changelogs finds one hit, an `OLLAMA_` env-prefix entry in `runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1014` (outside `reviewScopeFiles`, a scrub list, not a lane). Phase 003's ship-only tasks T009 to T014 are open by design: the decision rule took the over-suppresses branch [SOURCE: specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/003-follow-up-routing-benchmark/implementation-summary.md:80].
- `checklist_evidence` (partial): 117 AC rows across seven children, all marked Met with no waiver. Reran 027 AC-001 and AC-015 (grep empty, matches) and AC-003/AC-014 (21 of 21 pass, matches); AC-006 does not reproduce verbatim (finding 3). Children 001 to 017, 021, 023 and 024 have no `acceptance-criteria.md`; their closure rests on `tasks.md`, where every real task is checked apart from 003's ship-only rows. Status metadata drift in 007 to 010 (finding 1) keeps this partial.
- `feature_catalog_code` (partial): pasted-reply stripping entry matches code (`stripLeadingPastedReply` at `prompt-policy.ts:267`, called first in `scoreAdvisorPrompt`); route-receipt entry under-lists its sources (finding 2).
- `playbook_capability` (pass): `manual-testing-playbook.vitest.ts` 2 of 2 pass; the pasted-reply playbook's commands name the real build and `advisor_recommend` entry points [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/pasted-reply-stripping.md:55-72].
- `skill_agent` (pass): `SKILL.md` carries trigger phrases for both shipped behaviors [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:26-27]; no agent definition is touched by the epic.

## Integration Evidence

- Doctor command `/doctor` update apply phase to the residue tool: `.skilled/commands/doctor/assets/doctor-update-apply.yaml:222`, covered by `.skilled/commands/doctor/scripts/tests/doctor-update-contract.test.cjs` (21 pass).
- DSH adapter to shared receipt store: `hooks/dsh/prompt-advisor.mjs:25` imports `runtime/dist/hooks/lib/route-receipt.js`; Vibe reaches the guard through the shared handler and keeps only its head receipt.

## Edge Cases

- The scope list built from commit trailers leaves out `sweep-lane-residue.mjs` and `doctor-update-apply.yaml`; both were read as context, no finding raised against them.
- The validator passed child 007 with its stale status, so `RESULT: PASSED` on the parent's handoff criteria is not evidence the child status is right.

## Confirmed-Clean Surfaces

- 027 AC-001 (no calibration override left), AC-015 (no dropped alert-threshold names), AC-003/AC-014 (doctor contract) reproduce at HEAD.
- Phase 003 closure: the open T009 to T014 are conditional and correctly skipped.

## Ruled Out

- Live Ollama or embedding lane code left in the advisor after phase 024: ruled out by grep; only an env-prefix scrub entry remains.
- Unmet or waived AC rows hidden in the seven AC files: none, all 117 read Met.

## Next Focus

- Dimension: D4 maintainability.
- Focus area: TS/Python duplication held only by fixtures (LOOP_WORDING list, allowlist key asymmetry `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` vs `SPECKIT_CODEX_HOOK_TIMEOUT_MS`), `skill_advisor.py` size and the strip mirror, comment hygiene in the files the epic touched.
- Reason: three of four dimensions done; the notes carried from iterations 1 and 2 are maintainability.
- Rotation status: D1, D2, D3 done; D4 pending.
- Carry-forward: R2-P2-001, R3-P2-001, R3-P2-002, R3-P2-003 open; checklist_evidence and feature_catalog_code stay partial.
- Required evidence: file:line for each duplicated rule and where its two copies differ.

Review verdict: PASS
