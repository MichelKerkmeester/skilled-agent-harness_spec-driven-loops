# Iteration 005 — Angle 5: checklist.md vs acceptance-criteria.md vs the tasks.md verification checklist — who reads which completion gate

- sessionId: fanout-glm-5-3-flash-templates-1788737392077-m8w16s
- Window opened: 2026-09-06T23:52:18Z (init) · iteration executed 2026-09-07T01:13Z–01:30Z
- Focus: Q5 — are checklist.md, acceptance-criteria.md, and the tasks.md verification checklist three distinct completion-gate surfaces, and which do the validator registry and the completion exposer actually read? (CQ2 residue, CQ6)
- Status: complete · newInfoRatio: 0.235 (4 new findings / 21 accumulated)
- Novelty justification (1 sentence): first-recorded — the discovery-list staleness, the phantom checklist.md input in the hooks stack, the split-brain gate topology, and the reserved-but-unconsumed ENFORCE flag; no restatement of angles 1-4.
- Executor: this process, inline · tool calls: 8 bash evidence + writes = within 12 (registry-first timebox held); research actions 6.
- Quality guards: source diversity 12 distinct files; every finding ≥3 records; focus alignment 100%.

## Focus

Q5 per strategy §3, plus CQ2 residue and CQ6. State read first: state log 5 records, registry 17 findings.

## Actions Taken

1. Full registry dump (`runtime/cli/lib/validator-registry.json`): 39 rules; the file/AC set = FILE_EXISTS (error, rules/check-files.sh), AC_COVERAGE (info), AC_CLOSURE (error), plus native ANCHORS_VALID (error, native:orchestrator) and SPEC_DOC_SUFFICIENCY (error, ts:spec-doc-structure). NO checklist rule, NO completion rule — confirms ro-iter004-001. [SOURCE: runtime/cli/lib/validator-registry.json]
2. `runtime/cli/rules/check-files.sh` read: FILE_EXISTS validates required files per level via `runtime/cli/utils/template-structure.js` helper (`docs <level>` / `lifecycle-docs <level>`) (`:33-34,79-86`); phase-parent early branch requires the lean trio + description.json + graph-metadata.json (`:41-59`); lifecycle docs gated once tasks.md shows a checked item (`:65-80`). No checklist.md, no resource-map.md, no goal.md in its scope (all come from the level contract = the four core docs at L1-3+). [SOURCE: runtime/cli/rules/check-files.sh:33-34,41-59,65-86]
3. `runtime/cli/spec/check-completion.sh` input surface: `checklist_file="$FOLDER_PATH/tasks.md"` HARDCODED (`:441`); requires the `<!-- ANCHOR:protocol -->` marker (`:443`); counts items through ANCHOR:summary/ANCHOR:sign-off (`:124-144`); UNTAGGED = BLOCKING, completed P0/P1 need evidence markers ([EVIDENCE:], | Evidence:, **Evidence**:, checkmark, verified/tested/confirm...) (`:69`); exit 1 on incomplete. ZERO occurrences of checklist.md in the script (rg = 0 hits). [SOURCE: runtime/cli/spec/check-completion.sh:69,124-144,441-452]
4. Consumers of check-completion.sh: `.opencode/plugins/system-speckit-completion.js` (registers the read-only `system_speckit_completion` tool; "checklist P0/P1/P2 completion with evidence gaps" `:7`, tool wiring `:58`) → `runtime/cli/lib/completion-state.cjs` (spawns check-completion.sh `:141,160,241`; "Canonical-doc presence infers the spec level: acceptance-criteria.md raises [the level]" `:45`; file map incl. acceptanceCriteria `:53`); `.opencode/bin/speckit-completion.cjs` (CLI front); `.opencode/hooks/completion/README.md`. The Stop-hook core `runtime/lib/hooks/completion-evidence-sentinel.cjs` spawns check-completion.sh --json (`:160-188`) and falls back to an implementation-summary.md stat for Level 1 (`:227-229`). [SOURCE: .opencode/plugins/system-speckit-completion.js:7,58; runtime/cli/lib/completion-state.cjs:45,53,141,160,241; runtime/lib/hooks/completion-evidence-sentinel.cjs:160-188,227-229; .opencode/bin/speckit-completion.cjs:53-56]
5. checklist.md reality: NOT in `SPEC_DOCUMENT_FILENAMES` (`runtime/lib/config/spec-doc-paths.ts:17-29` — spec, plan, tasks, acceptance-criteria, decision-record, implementation-summary, research, resource-map, handover, review-report, description.json) vs `runtime/README.md:154` claiming discovery "includes `checklist.md`". NOT in the manifest (angle 3, 0 hits). NOT in check-completion.sh (action 3). Prose that still describes it: runtime/README.md:154; `runtime/lib/hooks/README.md:12` ("reads a spec folder's `checklist.md` via `check-completion.sh --json`"); sentinel comments (`:7` "reads ... checklist.md via check-completion.sh --json, or a Level 1 folder's implementation-summary.md"; `:217` "(pre-checked-away) 'checklist.md not found' branch of the script"). [SOURCE: runtime/lib/config/spec-doc-paths.ts:17-29; runtime/README.md:154; runtime/lib/hooks/README.md:12; runtime/lib/hooks/completion-evidence-sentinel.cjs:7,217]
6. CQ6: `SPECKIT_AC_COVERAGE_ENFORCE` — listed in the registry flags (action 1), documented in `references/validation/validation-rules.md` as a RESERVED promotion switch ("current rule remains INFO/advisory"; "changing validation outcome requires a later severity change backed by adoption evidence"), and consumed by NOTHING (rg over runtime outside JSON = 0 hits); ENV-REFERENCE.md:166-167 lists only SPECKIT_AC_COVERAGE and _FLOOR. [SOURCE: runtime/cli/lib/validator-registry.json; references/validation/validation-rules.md; runtime/ENV-REFERENCE.md:166-167]

## Findings

### f-iter005-001 — P2 — fix

`runtime/README.md:154` vs `runtime/lib/config/spec-doc-paths.ts:17-29` — CLAIM: canonical spec-document discovery "includes `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, ...". FACT: the code's `SPEC_DOCUMENT_FILENAMES` has NO checklist.md (11 entries, checklist absent); nothing else in runtime/ discovers it. The README names a file the discovery system does not know. SEVERITY: **P2** — stale doc-list; misleads metadata/grep consumers about what gets indexed. RECOMMENDATION: **fix** — drop checklist.md from the README list (or re-add the filename to the code set if it is meant to return).
[SOURCE: runtime/README.md:154; runtime/lib/config/spec-doc-paths.ts:17-29]

### f-iter005-002 — P1 — fix

`runtime/lib/hooks/README.md:12` + `runtime/lib/hooks/completion-evidence-sentinel.cjs:7,217` vs `runtime/cli/spec/check-completion.sh:441-452` — CLAIM: the sentinel "reads a spec folder's `checklist.md` via `check-completion.sh --json`" (README:12), its header says the same (`:7`), and its parser comments reference a "(pre-checked-away) 'checklist.md not found' branch of the script" (`:217`). FACT: check-completion.sh hardcodes `checklist_file="$FOLDER_PATH/tasks.md"` (`:441`), requires tasks.md's ANCHOR:protocol section (`:443`), and contains ZERO checklist.md logic (0 rg hits) — the branch the comment describes does not exist in the shipped script. Three prose/comment surfaces document a phantom input; the real input (tasks.md's merged verification section) is named nowhere in the hooks docs. SEVERITY: **P1** — a maintainer wiring a Level-1 completion check or debugging the sentinel follows the documented surface and finds nothing. RECOMMENDATION: **fix** — update hooks README + sentinel comments to tasks.md/ANCHOR:protocol reality; keep the Level-1 implementation-summary.md fallback documented (it IS real, `:227-229`).
[SOURCE: runtime/lib/hooks/README.md:12; runtime/lib/hooks/completion-evidence-sentinel.cjs:7,160-188,217,227-229; runtime/cli/spec/check-completion.sh:69,441-452]

### f-iter005-003 — P1 — document (or merge by registering a completion rule)

The completion-gate topology is SPLIT-BRAIN — `runtime/cli/lib/validator-registry.json` (39 rules; no completion/checklist rule) vs `runtime/cli/spec/check-completion.sh:48` + `runtime/cli/lib/completion-state.cjs:45,241` — FACT: TWO live gate surfaces with no shared enforcement path: (a) acceptance-criteria.md is gated INSIDE validate.sh --strict by AC_CLOSURE (error) and scanned by AC_COVERAGE (info), and additionally drives level inference in the completion exposer (`completion-state.cjs:45`); (b) the tasks.md P0/P1/P2 checklist with evidence markers is enforced by check-completion.sh (the "Completion Verification Rule", `:48`), which the completion exposer (plugin tool `system_speckit_completion` → completion-state.cjs:241) and the Stop-hook sentinel (`completion-evidence-sentinel.cjs:160-188`) consume — but which validate.sh NEVER runs (not in the registry). A packet can therefore pass `validate.sh --strict` with an incomplete P0 checklist and no rule notices, and can pass the completion exposer with unmet AC rows (AC_CLOSURE only fires on completion CLAIMS, angle 4). The third surface, checklist.md, is DEAD — kept alive only by the stale prose of f-iter005-001/002. SEVERITY: **P1 (wrong-or-unused)** — the two gate systems are cross-described in README:198 as linked, but they share zero enforcement code. RECOMMENDATION: **document** the split explicitly (validator = AC closure; completion tool + Stop hook = tasks checklist); or **merge** by registering check-completion as a registry rule so --strict sees it.
[SOURCE: runtime/cli/lib/validator-registry.json; runtime/cli/spec/check-completion.sh:48,69; runtime/cli/lib/completion-state.cjs:45,241; .opencode/plugins/system-speckit-completion.js:7,58; runtime/lib/hooks/completion-evidence-sentinel.cjs:160-188; README.md:198]

### f-iter005-004 — P2 — document

`runtime/cli/lib/validator-registry.json` (AC_COVERAGE flags incl. SPECKIT_AC_COVERAGE_ENFORCE) + `references/validation/validation-rules.md` (ENFORCE = "Reserved promotion switch; current rule remains INFO/advisory") vs `runtime/ENV-REFERENCE.md:166-167` (lists only SPECKIT_AC_COVERAGE and _FLOOR) — FACT: the ENFORCE flag is deliberately UNIMPLEMENTED (0 consumption sites in runtime code) and documented as reserved in validation-rules.md, but ENV-REFERENCE — the operator's flag catalog — omits it, and the registry exposes it as if live. CQ6 adjudicated: reserved-by-design, not a bug; the gap is ENV-REFERENCE coverage. SEVERITY: **P2**. RECOMMENDATION: **document** — add the reserved flag to ENV-REFERENCE with its validation-rules.md wording.
[SOURCE: runtime/cli/lib/validator-registry.json; references/validation/validation-rules.md; runtime/ENV-REFERENCE.md:166-167]

## Questions Answered

- **Q5 (angle 5) — ANSWERED**: NOT three live surfaces — TWO live + one dead. acceptance-criteria.md: gated by the validator registry (AC_CLOSURE error, AC_COVERAGE info) and read by the completion exposer for level inference. tasks.md verification checklist: read ONLY by check-completion.sh (UNTAGGED blocks, P0/P1 need evidence), consumed by the completion exposer (plugin tool via completion-state.cjs:241) and the Stop-hook sentinel — outside the validator. checklist.md: dead — absent from SPEC_DOCUMENT_FILENAMES, the manifest, and check-completion.sh; present only in stale prose (runtime/README.md:154, hooks README:12, sentinel comments). The validator registry reads neither the tasks checklist nor checklist.md; the completion exposer reads tasks.md (via check-completion.sh) and acceptance-criteria.md (via file presence).
- **CQ2 (residue) — ADJUDICATED**: no warn producer exists for resource-map.md or context-index.md either — FILE_EXISTS covers only contract-required docs; the validator's addon scan structure-checks only PRESENT addons (orchestrator.ts:507-510, angle 2); nothing in the completion stack warns on absent optional docs. The manifest's absenceBehavior=warn is producerless for ALL THREE claimed documents (acceptance-criteria.md included — angle 4). CQ2 CLOSED: f-iter001-001 + f-iter004-002 + this adjudication.
- **CQ6 — ANSWERED**: SPECKIT_AC_COVERAGE_ENFORCE is reserved-by-design (documented in references/validation/validation-rules.md), unconsumed in code, absent from ENV-REFERENCE — f-iter005-004.

## Questions Remaining

- Q6-Q8 (queued; next: Q6 — the goal addon: render path through inline-gate-renderer.ts, offering commands, phase-parent nested-goal binding in specs/).
- CQ1 (carried, narrows with Q6).

## Ruled Out (do not retry)

- ro-iter005-001: "checklist.md is discovered or enforced anywhere in code" — ruled out: SPEC_DOCUMENT_FILENAMES omits it (spec-doc-paths.ts:17-29), check-completion.sh never mentions it (0 hits), registry has no checklist rule. [SOURCE: runtime/lib/config/spec-doc-paths.ts:17-29; runtime/cli/spec/check-completion.sh:441-452; runtime/cli/lib/validator-registry.json]
- ro-iter005-002: "validate.sh --strict enforces the tasks.md P0/P1/P2 checklist" — ruled out: check-completion.sh is not a registry rule; validate.sh delegates to the registry only (validate.sh:8-10). [SOURCE: runtime/cli/spec/validate.sh:8-10; runtime/cli/lib/validator-registry.json]

## SCOPE VIOLATIONS

None. Writes: `iterations/iteration-005.md`, `deltas/iter-005.jsonl`, `deltas/event-005.json` + gateway ledger/projection writes — all inside the lineage directory. No packet-level writes, no repo tooling.

## Next Focus

Iteration 6 — Angle 6: the goal addon. (a) inline-gate-renderer.ts: how goal.md.tmpl's gates render (IF-level? nested-goal markers?); (b) offering surface: which command/flag produces goal.md (expected: none in create.sh — adjudicate CQ1); (c) the nested-goal binding: phase-parent.spec.md.tmpl + sectionGates goal.md at phase level? and whether phase parents under specs/system-speckit/ (e.g. 033-* children, 035-* parents) carry goal.md with the binding the playbook (goal-set-string-playbook.md:27-93) claims; (d) EXTENSION-GUIDE/goal template cross-check.

## Convergence telemetry (advisory only — stopPolicy=max-iterations)

newInfoRatio = 0.235 → NOT qualifying; consecutiveQualifying 0/3. Loop continues: 5 iterations remain, forced.
