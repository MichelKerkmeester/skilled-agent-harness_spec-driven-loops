# Review Iteration 003 — Traceability

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Iteration: 3 of 5, mode `review`, dimension `traceability`
- Session: `2026-11-14T11:01:50.956Z`, generation 1, lineage `new`
- Target: the 34 non-spec files changed by commits `eaba5ab89e 3d237cd97a f0d8c03036 0837fcd5a2 191ce39bad 43bff36f9d e102ba83be f9f96bdc39 e129af3719 fce8b5d81c`, `specs/` excluded
- Prior state: P0=0 P1=2 P2=3; `correctness` and `security` complete; `traceability` next
- Operator focus: sk-code alignment, sk-doc `create-skill` / `create-command` / `create-readme` alignment, and whether a manual-testing playbook, feature catalog, README or the root README needs updating for the purpose-carry feature

## Dimension

Traceability, read through the decisions the purpose-carry work must satisfy:

1. D1 label and sentence parity across resume, relaunch, compaction and continuity save;
2. D2 reader coverage of the shapes live specs use;
3. D3 problem-sentence carry on the compaction hop only;
4. the public runtime API and the module boundary both compaction adapters compile against;
5. completion-criteria evidence in the phase goals and check scripts, as cross-reference only;
6. the operator-focus documentation surfaces: feature catalog, manual-testing playbook, local READMEs and root README.

The iteration does not re-enter the security directions swept in iterations 1 and 2.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:22-31,83-130,148-185`
- `.skilled/skills/system-spec-kit/runtime/api/index.ts:124-126`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:39,228-250,410-422`
- `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:66-93`
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:614-629`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:67,303,1228-1252`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:145,227`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:185-191`
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-33`
- `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:105-112`
- `.skilled/commands/speckit/assets/speckit-resume-auto.yaml:139`
- `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml:158`
- `.skilled/commands/speckit/assets/speckit-resume-presentation.txt:118-128`
- `.skilled/commands/speckit/handoff.md:135-138`
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:61-72`
- `.skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts:47-116`
- `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts:190,322-337`
- `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts:129-184`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts:323-334`
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:29`
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:15-19`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:285-305,332`
- `README.md:45-47,522-548`

Read-only cross-reference outside the 34-file target, used only to prove or disprove a traceability claim:

- `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:1088-1116` (catalog entries for the two touched hops)
- The three linked hop scenarios under `manual-testing-playbook/plugins-and-hooks/` and `manual-testing-playbook/retrieval/`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Two prior P1s remain active and are carried unchanged:

- `R1-P1-001` — the relaunch purpose rule is narrower than the shared hop rule (`[SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:25]`).
- `R1-P1-002` — Pi compaction skips the nearest-`spec.md` walk-up the Claude compaction uses (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80]`).

### P2 Findings

1. **The Pi compaction adapter duplicates the purpose interface and reaches past the runtime API for the problem formatter** -- `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:72]` -- The adapter redeclares `PacketPurpose` structurally and casts a dynamic import of the internal module to that local shape (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:73]`). The public runtime API exports only `formatPacketPurpose` and `resolvePacketPurpose` (`[SOURCE: .skilled/skills/system-spec-kit/runtime/api/index.ts:126]`); `formatPacketProblem` and the exported `PacketPurpose` interface (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:22]`) are absent from it even though both compaction adapters consume the problem line (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:39]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:88]`). The Pi adapter's structural cast compiles even when the lib interface gains a field, and its catch-all (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:90]`) turns a failed import into a missing purpose section rather than an error. The two adapters therefore do not compile against one shared contract.
   Finding class: cross-consumer
   Scope proof: every cited file is in the 34-file target — `api/index.ts` (export surface), `session-prime.ts` and `session-compact-context.ts` (the two compaction consumers), and `packet-purpose.ts` (the exported interface and formatter).
   Affected surface hints: Pi `session_compact`; Claude SessionStart compact; the runtime API consumers that follow `api/index.ts`; the continuity writer that imports the same helpers through the public API (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:614]`).
   Case: a later change adds a required field to `PacketPurpose` or moves `packet-purpose.ts`; the Claude adapter's static import fails at build or test time, while the Pi adapter's local type still type-checks and its caught dynamic import silently omits the `## Packet Purpose` section after a Pi compaction.
   Claim adjudication:
   ```json
   {
     "type": "api_contract_traceability",
     "claim": "The public runtime API is not the contract the two compaction adapters compile against: the Pi adapter redeclares PacketPurpose and deep-imports the internal module, and formatPacketProblem is used by both adapters without a public export.",
     "evidenceRefs": ["session-compact-context.ts:72", "session-compact-context.ts:73", "api/index.ts:126", "session-prime.ts:39", "packet-purpose.ts:22"],
     "counterevidenceSought": "Checked whether runtime hooks conventionally deep-import lib modules and whether formatPacketProblem is exported under another name; api/index.ts exports only formatPacketPurpose and resolvePacketPurpose, and the Pi adapter's local type is the only shape it compiles against.",
     "alternativeExplanation": "The dynamic import may be deliberate to avoid loading node:fs at Pi hook startup; that explains the import style but not the duplicated interface or the missing public export.",
     "finalSeverity": "P2",
     "confidence": 0.75,
     "downgradeTrigger": "If deep imports are the documented convention for runtime hooks and the inline structural type is deliberate, the impact narrows to an API-documentation advisory."
   }
   ```

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | fail | D1's three labels are produced by one formatter (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:173]`) and quoted by both resume assets (`[SOURCE: .skilled/commands/speckit/assets/speckit-resume-auto.yaml:139]`, `[SOURCE: .skilled/commands/speckit/assets/speckit-resume-confirm.yaml:158]`) and the presentation (`[SOURCE: .skilled/commands/speckit/assets/speckit-resume-presentation.txt:118]`). D2's widened headings are present (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:42]`). D3's problem sentence is consumed only by the two compaction adapters (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:248]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:88]`). Hop parity still fails on `R1-P1-001` and `R1-P1-002`. |
| `checklist_evidence` | partial | Assertions were inspected, not executed (read-only iteration boundary). Label shapes and the compaction section are asserted (`[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts:47]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts:190]`), and the Pi section is asserted (`[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts:155]`). No assertion covers the API-contract gap in `R3-P2-001`. |
| `skill_agent` | notApplicable | No skill definition or canonical agent file is among the 34 changed files. The changed resume YAML, presentation and `handoff.md` are edits inside an existing command, not a new skill or command folder. |
| `agent_cross_runtime` | fail | Claude imports the shared module with a source-relative specifier (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:39]`); Pi imports the `dist` module and redeclares the interface (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:72]`). `R1-P1-002` also remains active. |
| `feature_catalog_code` | fail | Catalog entries exist for both touched hops (`[SOURCE: .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md:29]`, `[SOURCE: .skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md:19]`), but neither entry names the purpose row. The gap is already reported as `R2-P2-002`; this iteration records the confirming catalog evidence and does not file a duplicate. |
| `playbook_capability` | fail | The three linked hop scenarios contain no purpose assertion; the gap remains `R2-P2-002` (`[SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:303]`). |

## Integration Evidence

Named surfaces checked, not inferred:

- Resume hop: both workflow YAML assets (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`), the presentation (`speckit-resume-presentation.txt:118,128`) and `handoff.md:135-138` state the same three labels and the 300-character cut; `test-phase-command-workflows.js:143` asserts the YAML carries `purpose_row` and the parent label.
- Relaunch hop: `nudge.cjs:24-33` builds the game row; the prior P1 remains at `nudge.cjs:25` because the rule still names only the `### Purpose` subheading and the labelled paragraph, not the full reader shape.
- Compaction hop: Claude builds the section in `session-prime.ts:228-250` and unshifts it at `:417-421`; Pi builds it in `session-compact-context.ts:70-93` and prepends it to the recovered sections.
- Continuity save: `workflow.ts:614-615` resolves and formats the purpose on every save; `thin-continuity-record.ts:1228,1252` normalizes and stores `packet_purpose`; `authored-continuity-snapshot.ts:145,227` preserves and exposes it; `generate-context.ts:185-191` documents the writer-owned rule.
- Public API: `api/index.ts:126` is the only purpose export line; the gap is `R3-P2-001`.
- Completion evidence: the phase goals and check scripts are under `specs/` and are cross-reference only; the changed code's assertions are inspected, not run.
- Operator-focus docs: the feature catalog entries, the playbook table and linked scenarios, the root `README.md` continuity sections, and the six changed module README/MODULE-MAP files.

## Edge Cases

- Iteration 1 said no feature-catalog entry describes the touched hooks; iteration 2 said entries exist. Direct read resolves the contradiction: entries exist under `feature-catalog/context-preservation/` for both the relaunch loop and the compaction history lookup, but neither names the purpose row. The iteration 2 statement is the current one.
- The scaffold template now writes `### Purpose` and `### Problem Statement` (`[SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:65]`, `[SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:68]`), so a newly created phase parent can author a purpose and phase 011's backfill is not recreated. The template is confirmed clean.
- The changed resume assets and `nudge.cjs` still mention the scaffold sentence as a skip guard; that is text, not a scaffold output. It does not violate the completion criterion, which scans `specs/` only.
- The Pi dynamic import is inside a broad `try/catch` by design; `R3-P2-001` is scoped to the API-contract traceability it actually proves, not to a live failure in the current tree.
- The eleven phase goal files and their check scripts were not re-run; they are under `specs/` and outside the code target. Their evidence is cited only as cross-reference context.
- The 300-character cut and the surrogate-pair boundary remain carried as `R1-P2-001`; they were not re-reviewed here.
- The residual symlink case in the compaction containment check was ruled out in iteration 1 and is not re-entered.

## Confirmed-Clean Surfaces

- Phase-parent scaffold: `### Purpose` with one-sentence placeholder and `### Problem Statement` are present; no `Keep parent documentation lean` layout sentence (`[SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:65]`).
- D1 label formatter: `Purpose:`, `Parent purpose (<repo-relative folder>):` and `Goal objective:` are all produced in one place (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:173]`).
- D2 reader coverage: `### Purpose`, `## PROBLEM & PURPOSE`, `## ROOT PURPOSE`, numbered headings, a labelled `Purpose:` paragraph and `goal.md` Objective are all read (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:42]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:101]`); tests cover the labelled, combined-heading, root-purpose, numbered and scaffold cases (`[SOURCE: .skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts:47]`).
- D3 separation: `formatPacketProblem` is called only by the Claude and Pi compaction adapters (`[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:248]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:88]`); the continuity record stores only `packet_purpose` (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:1228]`).
- Continuity writer ownership: the purpose is recomputed on every save (`[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:614]`), normalized and dropped when invalid (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:1252]`), and preserved by the authored snapshot (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/authored-continuity-snapshot.ts:145]`).
- Resume surfaces: both workflow assets and the presentation state the three labels and the 300-character cut (`[SOURCE: .skilled/commands/speckit/assets/speckit-resume-presentation.txt:128]`), and `handoff.md` matches them (`[SOURCE: .skilled/commands/speckit/handoff.md:135]`).
- Module docs: the new module and the continuity field are documented (`[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/spec/README.md:31]`, `[SOURCE: .skilled/skills/system-spec-kit/runtime/lib/MODULE-MAP.md:136]`).
- API surface used by the save writer: `formatPacketPurpose` and `resolvePacketPurpose` are exported (`[SOURCE: .skilled/skills/system-spec-kit/runtime/api/index.ts:126]`); the missing problem formatter is the new P2, not a broken save path.
- No new skill, command folder or agent definition was added, so the sk-doc `create-skill` / `create-command` / `create-readme` surfaces have no missing artifact to review; the changed resume assets are edits to an existing command.

## Ruled Out

- **Phase-parent scaffold regression.** The template now writes `### Purpose` and `### Problem Statement` and no layout sentence (`phase-parent.spec.md.tmpl:65-69`). New parents do not need the phase 011 backfill. Not a finding.
- **Resume label mismatch.** Both workflow assets and the presentation carry all three labels and the 300-character cut (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`). Not a finding.
- **D3 problem-line leak into resume or continuity.** Only the two compaction adapters call `formatPacketProblem`; the continuity record stores only `packet_purpose`. Not a finding.
- **Path traversal from `lastSpecFolder` / the compact brief.** Already swept in iteration 1 with containment evidence at `session-prime.ts:236-238` and `session-compact-context.ts:80-83`; not re-entered.
- **Recovered-payload sanitizer bypass.** Already ruled out in iteration 2 (`shared-provenance.ts:88,109`); not re-entered.
- **Shell injection through the purpose or handoff date.** Already ruled out in iteration 2 (`nudge.cjs:330`, `nudge.test.cjs:620`); not re-entered.
- **Secret exposure through `packet_purpose`.** Already ruled out in iteration 2; not re-entered.
- **State transition / stale continuity purpose.** Already ruled out in iteration 1 (`workflow.ts:614-615`, `thin-continuity-record.ts:759-767`); not re-entered.

## Next Focus

- Next dimension: `maintainability`.
- Focus: sk-code and sk-doc alignment of the changed READMEs, module docs and command assets; comment hygiene and module-boundary duplication; and whether the new `R3-P2-001` API-surface gap is better fixed by exporting `formatPacketProblem` and the `PacketPurpose` type or by documenting deep imports as the hook convention. Carry `R1-P1-001`, `R1-P1-002`, `R1-P2-001`, `R2-P2-001`, `R2-P2-002` and `R3-P2-001`.
- Operator focus: the feature-catalog, playbook and root README gap is already recorded as `R2-P2-002` and confirmed with catalog paths here; do not file another duplicate unless a missing README artifact appears.
- Do not re-enter: path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure, state transition, phase-parent scaffold, resume label parity, or the traceability protocols already swept here.

## Verdict

- FAIL: none; no active P0.
- CONDITIONAL: two active P1s remain (`R1-P1-001`, `R1-P1-002`), carried unchanged.
- New this iteration: one P2 (`R3-P2-001`); `hasAdvisories=true`.

Review verdict: CONDITIONAL
