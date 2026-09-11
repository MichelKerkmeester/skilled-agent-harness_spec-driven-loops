# Iteration 5: D3 Traceability - the packet's completion claims against the tree

## Focus

- **Dimension(s)**: traceability (primary)
- **Scope investigated**: the target packet `009-deep-review-decommission/{spec.md,plan.md,tasks.md,goal.md,implementation-summary.md,description.json}`, the parent `spec.md` phase documentation map and handoff table, sibling `008-verification-and-closeout/{goal.md,implementation-summary.md,latency-delta.md}`, sibling `007-docs-and-residue-sweep/implementation-summary.md`, and the git record for the retired test suites
- **Brief classes covered**: class 5 (tests that assert a contract this packet removed, and coverage silently lost when a test was retired), plus the two required core traceability protocols (`spec_code`, `checklist_evidence`)
- **Reproduction constraint**: unchanged - read-only probes only (no `validate.sh`, per this lineage's containment)

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.13

## Findings

### P0, Blocker

None. Note the distinction that keeps this iteration at P1 rather than P0: nothing here is a false statement in shipped code. Every item is a completion claim that cannot be verified from the packet, which is a traceability failure, not a correctness failure.

### P1, Required

- **F015**: the packet's completion state is unproven and the cross-skill residue has no owner, `../spec.md:150`, `../spec.md:174-175`, `008-verification-and-closeout/implementation-summary.md:51`, `spec.md:15`, `tasks.md:37`, `implementation-summary.md:31`.

  Three independent gaps, each with line evidence:

  1. **The gate phase never ran.** Phase 008 exists to prove the packet's claims from the final state. Its implementation summary opens:

     ```
     $ rg -n "Not started" 008-verification-and-closeout/implementation-summary.md
     51:Not started. The planning artifacts exist and bind the work.
     ```

     Its goal holds the criteria that decide closure, and none is checked - including "Recursive strict validate over the parent prints RESULT: PASSED and exits 0" and "Every runtime cold-boots with no advisor MCP server and the routing brief still arrives" (`008-verification-and-closeout/goal.md:64-68`). The one artifact the phase did produce, `latency-delta.md`, measures the prompt path and reports it inside budget ("Prompt hook, warm | p50 not above 2096 ms | 819 ms p50, n=7 | Inside"). So the packet has measurements but no closure.

  2. **The phase map never got its scope.** The parent's own map still carries placeholders for this phase and its successor:

     ```
     $ rg -n "009-deep-review-decommission/ \||009-deep-review-decommission \| 010" ../spec.md
     150:| 9 | 009-deep-review-decommission/ | [Phase 9 scope] | Pending |
     174:| 008-verification-and-closeout | 009-deep-review-decommission | [Criteria TBD] | [Verification TBD] |
     175:| 009-deep-review-decommission | 010-deep-research-residue | [Criteria TBD] | [Verification TBD] |
     ```

     The target packet's own documents are unpopulated Level 1 scaffolds: `spec.md:15` is `<!-- SPECKIT_LEVEL: 1 -->` with template placeholders throughout (`REQ-001 | [Requirement description]`), `tasks.md:37` is `- [ ] T001 Create project structure`, and `implementation-summary.md` still carries `completion_pct: 0` in its continuity block. That is expected *before* a phase executes, but it means this review is the first artifact the phase produces, and nothing in the packet yet states what "done" means for it.

  3. **The cross-skill residue has no owning phase.** The review brief's class 3 asks for "interconnected surfaces outside the advisor package". Phase 007's exit record declares "Zero live hits" (`007-docs-and-residue-sweep/implementation-summary.md:132`) - a claim that holds *inside its declared scope* - and then lists stale paths outside that scope as limitations with no owner: "Stale advisor paths survive outside the declared scope. The spec-kit env reference still names `mcp-server/` and `plugin-bridges/` paths in its Source columns, and `.pi` docs and doctor configs were listed by the previous tranche." This review's iterations 1-4 converted that unowned list into line-level findings: F005 (`.pi`), F008/F009/F010 (spec-kit), F001/F002/F003 (doctor), F012 (bin). The parent's phase map gives no phase the job.

  **Impact on the brief's ask**: the auditor cannot "verify claims against the tree" from the packet alone, because the packet's claims are either unchecked (008) or unwritten (`[Phase 9 scope]`). Findings therefore had to be derived from the tree and the brief, which is what iterations 1-4 did.

### P2, Suggestion

- **F016**: phase 007's stated limitations are now partly stale, `007-docs-and-residue-sweep/implementation-summary.md:147`, `:159`.

  ```
  $ rg -n "rename-invariants|Four pre-existing red tests" 007-docs-and-residue-sweep/implementation-summary.md
  147:| `runtime/tests/rename-invariants.vitest.ts:21` | Pre-existing red test | Asserts the retired registration; raised as a defect below, not rewritten |
  159:2. **Four pre-existing red tests, raised not fixed.** `runtime/tests/rename-invariants.vitest.ts` asserts the retired MCP registration (3 failed, 1 passed). `runtime/tests/compat/plugin-bridge.vitest.ts` and `plugin-bridge-smoke.vitest.ts` resolve the removed bridge file by design of their own assertions. ...
  ```

  The file has since been inverted - it now asserts the *opposite* contract - and the two bridge suites named in the same sentence no longer exist:

  ```
  $ rg -n "not.toContain\('system_skill_advisor'\)|existsSync\(resolve\(advisorRoot, 'mcp-server'\)\)" .opencode/skills/system-skill-advisor/runtime/tests/rename-invariants.vitest.ts
  47:      expect(servers, file).not.toContain('system_skill_advisor');
  86:    expect(existsSync(resolve(advisorRoot, 'mcp-server'))).toBe(false);
  $ ls .opencode/skills/system-skill-advisor/runtime/tests/compat/
  README.md  daemon-probe.vitest.ts  python-compat.vitest.ts  redirect-metadata.vitest.ts  shim.vitest.ts
  ```

  A packet that records "four red tests" while the tree now shows neither the failures nor two of the files is a record a closeout would have to correct. This is precisely the claim-versus-tree divergence the review exists to catch, and it is P2 because the direction of the divergence is improvement, not regression.

- **F017**: the retired-coverage accounting lives only in a commit message, `deep-review-config` scope note: no packet document records it.

  The brief's class 5 asks what coverage was lost when a test was retired. The only accounting anywhere is the commit body:

  ```
  $ git show --format="%s%n%b" --stat 9015d00c79 | head -12
  test(skill-advisor): retire the suites that assert the removed contract
  The full suite had 48 failures. Running it at all was the fix: ...
  Twenty-six tested the plugin bridge, a file phase 5 deleted. Three asserted that
  the MCP server is registered ... Those three are inverted rather than deleted ...
  863 passing, up from 828, with the deleted coverage accounted for rather than
  quietly dropped.
  ```

  Two files were deleted outright in that commit (`plugin-bridge.vitest.ts` 234 lines, `plugin-bridge-smoke.vitest.ts` 72 lines) and four suites were modified to migrate their fake daemons to the new protocol (`skill-advisor-cli-dual-client.vitest.ts`, `launcher-bootstrap.vitest.ts`, `skill-graph-diagnostic-redaction.vitest.ts`, `system-skill-advisor-plugin.vitest.ts`). Nothing under `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/` repeats the accounting, so a reader who opens the packet - which is what the completion criteria tell an operator to do - cannot tell whether the 26 retired bridge tests lost coverage or had it replaced. The commit text says it was replaced and the count rose from 828 to 863; that statement should live where the closure claim lives.

  Severity rationale: the coverage question is answered, just not in the packet. Assigning it P2 rather than P1 is deliberate - the evidence exists and is reachable from the branch this packet shipped on.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | `../spec.md:99-108` (files-to-change table) vs iterations 1-4's tree evidence; `008-verification-and-closeout/latency-delta.md:20-27` | The parent spec's *scope* claims hold: the transport is gone from all five configs, the package dir is `runtime/`, the CLI answers, the launcher carries the rehomed env. What fails is the residue claim, and that is recorded as F001-F012 rather than as a spec/code mismatch in the plan. Core protocol now has a definitive status. |
| checklist_evidence | pass | hard | target packet has no `checklist.md` (Level 1 scaffold) -> protocol `notApplicable` within the target, satisfied by the sibling evidence | Ran the equivalent check against the nearest authoritative list: phase 008's goal criteria (`008-verification-and-closeout/goal.md:64-68`). Result: 0 of 5 checked, all unverifiable from the packet, recorded as F015. |
| feature_catalog_code | pass | advisory | `.opencode/skills/system-skill-advisor/feature-catalog/` | Iteration 4 sampled the index and a leaf; group 6 is `COMMAND SURFACE` and the leaves describe CLI invocations. Retained MCP-named directories are a written decision. |
| playbook_capability | pass | advisory | `.opencode/skills/system-skill-advisor/manual-testing-playbook/` | Procedures cite CLI invocations that match the CLI's own usage text; three appended run records keep pre-rewrite quotes as documented. |

## Claim Adjudication

```json
{
  "findingId": "F015",
  "claim": "The packet's completion state cannot be verified from the packet: the gate phase reports 'Not started' with zero of five criteria checked, the parent phase map still holds '[Phase 9 scope]'/'[Criteria TBD]' placeholders for this phase, the target packet is an unpopulated Level 1 scaffold, and the cross-skill residue its review brief targets has no owning phase.",
  "evidenceRefs": [
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout/implementation-summary.md:51",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:150",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/spec.md:174-175",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission/spec.md:15",
    "specs/system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission/tasks.md:37"
  ],
  "counterevidenceSought": "Looked for a completed closeout artifact elsewhere in the parent (008 holds latency-delta.md with real measurements, so the phase did partial work), checked whether the parent's completion criteria table had been filled in the goal file, and checked whether the placeholders were deliberate pending this very review. The last one is partly true - a phase map placeholder before the phase runs is expected - which is why the finding is anchored on the combination of an unstarted gate phase, an unwritten phase scope, and unowned residue rather than on the placeholders alone.",
  "alternativeExplanation": "The packet may be mid-flight by design: phase 9 is the review (this lineage) and phase 10 the research, with phase 8 to run afterwards. Rejected as a reason to downgrade: the parent's handoff table makes 008 the gate for the whole packet and 008's own criteria include the recursive strict validate; with 008 unstarted and this review finding eight active P1s, no packet-level claim of completion is currently supportable, and the brief asks the auditor to verify claims rather than to assume the schedule.",
  "finalSeverity": "P1",
  "confidence": 0.83,
  "downgradeTrigger": "Downgrade to P2 once phase 008 runs and records its criteria with evidence, even if the verdict stays CONDITIONAL - the defect is the unverifiable claim, not the outstanding remediation.",
  "transitions": [
    { "iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 0.13 (severity-weighted new 7.0 over cumulative 53.0 - one P1 at 5.0 plus two P2 at 1.0 each)
- Dimensions addressed: traceability
- Novelty justification: the traceability pass could have degenerated into restating iterations 1-4 with packet citations. Instead it produced three items that exist only at the packet level: the unstarted gate phase, the missing phase scope, and the unowned cross-skill residue. The core protocols both reached a definitive status in this pass, which is the coverage the convergence vote needs.

## Ruled Out

- **`validate.sh` failing on the target packet**: cannot be claimed either way, and the reason is on the record rather than hidden. This lineage is forbidden to run it (it writes packet metadata), so the report carries the check as owed rather than as a pass or a fail. A review that inferred a validator result from a template's appearance would be exactly the kind of claim the brief tells the auditor to reject.
- **The parent's two accuracy gates (`python-ts-parity`, `scorer-eval-baseline-ratchet`)**: excluded by the brief as pre-existing, and independently corroborated by commit `9015d00c79`'s body ("Two failures are left and neither is ours. Both accuracy gates fail identically in an untouched checkout"), so the exclusion is verified rather than accepted on faith.
- **Phase 006's rename claim** ("Nothing outside history resolves a path under the old directory name"): the *code* claim holds - the shim, the launcher, the hook shim and the Pi adapter all resolve `runtime/`. The failures are in documents (F005, F008-F012), which is why they are filed against the documentation surfaces rather than against the rename.
- **Phase 005's deletion claim** ("no runtime config declares the advisor"): verified true from the final state in iteration 2 (`rg` over all five configs, exit 1). The doctor *checks* that look for such a declaration are a different claim and are recorded as F002.

## Dead Ends

- **Reconstructing what the 26 retired bridge tests asserted** to judge whether any behavior lost an assertion: the deleted files are recoverable from git, but the question the brief actually asks - was coverage replaced or dropped - is answered by the commit's count (828 to 863 passing) plus the four migrated suites. Reading 306 deleted lines to re-audit tests of a file that no longer exists would be depth without a decision.

## Recommended Next Focus

Iteration 6 (correctness replay / adversarial verification): re-read the cited evidence for every active P1, attempt to falsify at least one of them from the tree, re-run the evidence, scope and coverage gates against the final finding set, and record the composite convergence computation for the STOP decision.

Review verdict: CONDITIONAL
