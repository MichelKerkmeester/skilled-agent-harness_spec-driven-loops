# Iteration 001: Traceability, phase goal criteria against shipped work

## Dimension

traceability (D3), with correctness evidence only where a criterion is command-checkable. Operator review focus carried into this pass: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made. This iteration reads the criteria of all 15 goal documents (parent plus 001 to 014) and re-checks the ones that a read-only command can settle; the 014 fixes and the scorer are opened in more depth in later iterations, and their goal criteria are already partly settled here.

## Sources

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` (parent directive, seven criteria, progress log)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/0*/goal.md` (14 phase criteria blocks)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` (parent metadata and phase map)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/spec.md` (REQ-001 to REQ-020, scope)
- `.skilled/skills/mcp-browser-use/mode-registry.json`, `.skilled/skills/mcp-tooling/mode-registry.json`
- `.skilled/skills/mcp-browser-use/SKILL.md`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh`, `.skilled/skills/mcp-code-mode/scripts/_utils.sh`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh` and its docs
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md`, `mcp-servers/bladebro-mcp/README.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/{README.md,results.csv}`

## Scorecard

- Dimensions covered: traceability (partial: correctness evidence gathered, dimension closes in later passes)
- Files reviewed: 24 read or grepped
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0 (2 of 2 weighted units are new)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Parent goal log still reports phase 014 as In Progress** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:135 -- The parent progress table row reads `014 deep review fixes | In Progress | Phase-added with its binding row. Five fix lanes running`, while the same file's completion criteria are all ticked, its continuity block reads `completion_pct: 100` and `recent_action: "Closed 014: every deep review finding fixed at its source"`, and `spec.md:52` records Status `Complete: phases 001 to 014 are Complete and all seven goal criteria hold`. That is the same class of defect REQ-008 (014 spec) was raised to close, reintroduced by 014's own close-out.
   Case: an operator or evaluator reads the parent progress table to decide whether the epic is done and concludes a fix lane is still running.
   Finding class: instance-only
   Scope proof: `rg -n "In Progress" specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` matches only this row; the phase map in `spec.md` lists 014 as Complete, so the stale row is the single disagreeing surface.
   Affected surface hints: ["parent goal log", "parent spec metadata", "014 close-out"]

2. **Research lane table still offers an ungated `npx -y bladebro` launch** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:57 -- The Bladebro lane row still reads `bladebro mcp / npx -y bladebro mcp via Code Mode when chaining or the binary is unavailable`. REQ-002 (014 spec) requires that no Bladebro doc offers that launch without both an operator yes and the `bladebro@4.8.2` pin, and names this file. The correcting amendment sits in a blockquote after the table at line 61, so the document as a whole discloses the rule, but the normative row is unchanged and is still the line phases 004 and 014 cite as `research.md §4` for the lane rule.
   Case: an agent reads the lane rule from the table row alone and launches `npx -y bladebro mcp` on a host with no binary, which pulls an unpinned package without an operator yes.
   Finding class: instance-only
   Scope proof: `rg -n "npx -y bladebro" specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md` matches the table row and the amendment only; the packet's own SKILL.md, `mcp-servers/bladebro-mcp/README.md` and `004-bladebro-mode/spec.md:82` already carry the pin and the operator yes, so the row is the only ungated form left in a non-historical document. Iteration and delta files under `001-research/research/` are historical records and are excluded by the amendment's own wording.
   Affected surface hints: ["001-research research synthesis", "004-bladebro-mode spec", "mcp-bladebro SKILL.md"]

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | pass | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/goal.md:10, .skilled/skills/mcp-browser-use/mode-registry.json:1 | Hub registry lists exactly the three modes with `packetKind: workflow`, `backendKind: cli-plus-mcp` and `advisorRouting.routingClass`; no transport-axis key is present. |
| checklist_evidence | partial | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:135, specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/research.md:57 | Two ticked criteria are not evidenced by the tree as written; the other re-checked criteria below hold. |
| feature_catalog_code | pass | advisory | .skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/README.md:1 | Catalog tree present for every mode; no contradiction found at this depth. |
| playbook_capability | pass | advisory | .skilled/skills/mcp-browser-use/mcp-chrome-devtools/manual-testing-playbook/manual-testing-playbook.md:1 | All three mode playbook roots exist with scenario folders; run reports dated after 005 exist under each mode's `benchmark/reports/`. |

Criteria re-checked and holding this iteration:

- 002: registry holds three modes with the required kinds (`.skilled/skills/mcp-browser-use/mode-registry.json`); `SKILL.md:28-30` names all three.
- 003: `mcp-tooling` registry lists six modes; `rg` for `mcp-tooling/mcp-chrome-devtools|mcp-tooling/mcp-aside-devtools` under `.skilled` excluding changelog and benchmark reports prints no match, and the same grep over the five named `mcp-tooling` files prints no match.
- 003/014: the two `_utils.sh` copies are byte-identical (`diff` prints nothing), which is REQ-001's parity claim.
- 014: `browser-debugger-cli@0.6.10` is pinned in `scripts/install.sh:30` and carried through SKILL.md, README, INSTALL-GUIDE and the mcp-server README; no `@alpha` match outside changelog and benchmark reports.
- 014: every `npx -y bladebro` line inside the `mcp-bladebro` packet names both the pin and the operator yes.
- 014: the 2026-11-24 replay records 48 PASS of 49, and the failure is a playbook row at stage one only (carried to iteration 002 for a correctness read).

Not independently re-run, and therefore recorded as packet evidence rather than verified evidence: any criterion whose only proof is `validate.sh --strict --recursive`, `parent-skill-check.cjs`, `check-mcp-mutation-class.sh`, `validate-playbook-package.cjs` or `check-goal.cjs`. This lineage is write-bound to its own directory and does not run packet tooling, so those criteria keep their prior packet evidence.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` -- read for the scorer change that 014 shipped; the detailed correctness read is iteration 002's.
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/README.md` -- the two-stage replay that both 014 and the parent criterion 5 rest on.

## Edge Cases

- The parent goal's durable slice is character-capped, so the progress table grows and lags by design. A stale progress row is still a state contradiction, so it is reported at P2 rather than waived.
- `001-research/research/` iteration and delta files keep the ungated `npx` text by design: a research iteration is a historical record and the amendment at `research.md:61` names them explicitly. They are therefore ruled out of finding 2 rather than added to it.
- Severity for finding 2 keeps the lower supported tier: the document discloses the rule in the blockquote, so the reach is a reader who stops at the table, not a document that never states the rule.

## Ruled Out

- Hub mode-registry shape (three modes, kinds, no transport axis): checked directly, holds.
- `mcp-tooling` relocation residue: two distinct greps, no match.
- Installer parity (`_utils.sh`): byte-identical, so REQ-001's premise is met in the tree.
- `browser-debugger-cli@alpha` residue: no match outside changelog and benchmark reports, which 014's criterion excludes.

## Recommended Next Focus

Correctness: the phase 014 fixes as behaviour, not as text. `scripts/install.sh` pin and its launcher verification, the Bladebro installer's lifecycle-script flag and digest check, then the advisor scorer's narrowed task-intent gate against the replay corpus, with the single failing playbook row (MBU-PB-04) read as a routing-vocabulary gap.

Review verdict: PASS
