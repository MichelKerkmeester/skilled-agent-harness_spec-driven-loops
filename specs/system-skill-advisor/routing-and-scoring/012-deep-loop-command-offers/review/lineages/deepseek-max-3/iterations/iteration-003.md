# Iteration 3 - Maintainability

## Dispatcher

Dimension: maintainability. Operator focus: check every REQ against its code or decision. This iteration reads the in-scope documentation against the gate as built, and keeps the REQ sweep open. It raises one P2 on a routed-mode rule the two in-scope docs do not describe.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` (the `command-attach.ts` row)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` (the `attachCommand()` paragraph), `:41`, `:63` (shared-file row)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:23`, `:63`, `:106`, `:111`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:117` (`DEEP_LOOP_OFFER_COMMANDS`), `:250` (offer text)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1690` (`servedMode`), `:1747` (`routedLoopMode`)

## Findings

### P0 Findings

(none)

### P1 Findings

(none)

### P2 Findings

1. **Both in-scope docs omit the routed-mode substitution, so they describe a routed deep-loop route as serving the route's mode** -- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` -- the catalog says `attachCommand()` names a command "only when the generated `MODE_COMMANDS` table maps that hub and `workflowMode` to a command", and its shared-file row (`:63`) describes the layer as "name the slash command for a single routed mode, plus `deferredLoopCommand()` for a deferred deep-loop route". `runtime/lib/README.md:146` describes the same layer as naming a command "for a hub recommendation whose compiled route picks one `workflowMode`". Neither mentions `routedLoopMode` (`command-attach.ts:1747`): a routed single-target route whose workflowMode the ask does not name gives way to the mode the ask does name (`servedMode`, `:1690`), which REQ-042 states and AC-050 checks. A maintainer who reads the catalog and then reads a served head for "run a deep loop to review the research loop config" sees `/deep:review` where the catalog's model predicts the route's research mode, or no command at all.
   Finding class: instance-only (two documentation sentences, one rule).
   Scope proof: both documents are listed in `review-scope-files.txt`, and the code path they describe is in `command-attach.ts` at the cited lines.
   Affected surface hints: `feature-catalog/cli-surface/advisor-recommend.md` paragraph 33 and row 63; `runtime/lib/README.md` row 146; the rule itself in `command-attach.ts` `routedLoopMode`.
   Case: a maintainer changes or debugs the routed rule from the catalog alone and concludes a routed route is authoritative for its mode.

## Traceability Checks

- `spec_code` (core): `partial`, carried. The routed-mode rule REQ-042 states is implemented (`command-attach.ts:1747`) and pinned by the guard case at `command-attach-guards.vitest.ts:1176`; the documentation gap is the P2 above. The remaining REQs are iteration 4.
- `checklist_evidence` (core): not run this iteration; iteration 5 owns it.

## Integration Evidence

- The feature catalog is the surface `/create:feature-catalog` maintains for the advisor, and its `:63` row is the shared-file table a maintainer reads before touching `command-attach.ts`.
- `runtime/lib/README.md` is the module map the advisor runtime links from its own directory; its row 146 is the only description of `attachCommand()` in that map.

## Edge Cases

- The two docs are accurate for the deferred route (`deferredLoopCommand`) and for the no-edit exception (`NO_EDIT_REQUEST` plus `READ_ONLY_LOOP_MODES`), which T121 corrected; the gap is only the routed substitution.
- `render.ts:117` keeps a two-command set (`DEEP_LOOP_OFFER_COMMANDS`) beside the generated `MODE_COMMANDS`/`TRACKED_COMMANDS` tables. It is a display set, not a command table, and a rename of a deep command fails the fixture and the render tests loudly; recorded here as a noted coupling rather than a finding.
- The docs' claim that a native lineage is refused in fan-out could not be checked against the workflow from these files alone; it is outside this iteration's dimension and is left to the traceability pass.

## Confirmed-Clean Surfaces

- The playbook's statement of the no-edit rule (`:23`) matches the code: a writing command is withheld, and a read-only deep-loop run keeps its command.
- The catalog's account of the compiled-route guard (`:33`, first half) matches `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:363`): a bundle or multi-target route carries no command, and a legacy sentinel carries no `compiledRoute`.
- The catalog's doctor-row statements (`:41`) match `attachCommand`'s stuck branch and `withholdDeepLoopDoctorWithoutRun` as the fixture's `doctorWithheld` rows pin them.
- No comment in the reviewed files carries a requirement id, a decision id or a spec path; comment hygiene holds on every file read this iteration.

## Ruled Out

- "The docs still state the pre-T121 no-edit rule" -- ruled out: both the README row and the catalog paragraph name the read-only exception, and the playbook states the same rule.
- "The feature catalog misdescribes the doctor row" -- ruled out: its withhold conditions match `withholdDeepLoopDoctorWithoutRun` and the shared fixture's `doctorWithheld` rows.
- "The module README describes a deferred-route command that is not built" -- ruled out: `deferredLoopCommand` is present and the guard cases pin it.

## Next Focus

Dimension: traceability
Focus area: the full `spec_code` sweep: every REQ-001 to REQ-059 against the code or decision that records it, starting with the REQ-047 parity clause the fixture's `servedRun` column scopes to the deferred route.
Reason: the operator focus leads with traceability and iterations 4 to 7 are reserved for it; the REQ sweep is the largest open obligation.
Required evidence: one `traceabilityChecks.results[]` entry for `spec_code` with the checked range, and file:line evidence for every clean claim and every contradiction.

Review verdict: CONDITIONAL
