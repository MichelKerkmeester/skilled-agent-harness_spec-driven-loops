# Proposal

## Verdict: fix

The route files and scripts are present at reality-check.md:13-22, and the current parent-skill audit passes at doctor-run.log:20-75. The doctor contract is stale: its YAML describes fewer checks and a narrower packet-kind and strict-mode contract than the checker implements. The route also declares a fleet metadata gate before the parent audit, but the workflow YAML describes only the parent audit. The source comparison is below.

## Minimal edits

1. In .skilled/commands/doctor/assets/doctor-parent-skill.yaml, update parent_skill_doctor_invariant at lines 28-52.

   - Old: packetKind allows only "workflow" or "surface" at lines 31-37. New: include "transport", which the checker accepts at parent-skill-check.cjs:414-416.
   - Old: the nested-identity rule names only graph-metadata.json at line 30. New: include nested description.json, which the checker separately rejects at parent-skill-check.cjs:312-324 and reports at doctor-run.log:30.
   - Old: the documented canon ends with the playbook and benchmark checks at lines 42-48. New: add the leaf-manifest freshness and reachability checks, root metadata class check, root ROUTER.md contract, and routing-version checks. The checker implements them at parent-skill-check.cjs:1206-1234, 1316-1338, 1358-1386, and 1490-1532, and the run reports each passing at doctor-run.log:64-71.
   - Old: PARENT_HUB_CHECK_STRICT=0 is described as downgrading checks 5-9 at lines 42-52. New: say it downgrades checker findings routed through its advisory severity path, while hard failures remain failures. The variable controls softFail at parent-skill-check.cjs:102-106 and 133-137; the same path is used for packet-kind validation at lines 414-416 and the newer checks at lines 1206-1234, 1316-1338, 1369-1380, and 1490-1532.

2. In .skilled/commands/doctor/assets/doctor-parent-skill.yaml, align phase_0_audit and upstream_assets with the route's first script at lines 57-61 and 95-104.

   - Old: upstream_assets names only parent-skill-check.cjs, and phase_0_audit executes only that audit script at lines 59 and 99-101.
   - New: name ci-skill-root-metadata.cjs as the fleet gate, run it before parent-skill-check.cjs without --fix, and capture both exit codes for the final status. The route entry lists that gate first and says it runs before the per-hub audit at _routes.yaml:125-130. The router resolves route script invocations before it executes the workflow at speckit.md:64-68. The gate's no-write behavior is supported by its --fix contract at ci-skill-root-metadata.cjs:28-43 and the executed command's fixed=0 result at doctor-run.log:1-19.

3. In .skilled/commands/doctor/scripts/parent-skill-check.cjs, update the checker description and status label.

   - Old: the usage note says "5-11 as WARN" at line 22, the header enumerates through check 11 at lines 24-30, and the runtime output says "Mode 5-9" at line 254.
   - New: describe the WIP override as applying to advisory canon findings, list the added manifest, root metadata, router, and version checks, and change the runtime label to "Canon mode". The current run visibly prints "Mode 5-9: canon (FAIL)" before reporting the newer checks at doctor-run.log:24 and 64-71.

4. In .skilled/commands/doctor/assets/doctor-speckit-presentation.txt, expand the parent-skill subsystem row at line 100.

   - Old: "Audit parent skill structure, mode registry, and graph metadata."
   - New: "Audit parent-skill structure, routing manifests, root metadata, router contract, and version consistency." The current row omits checks reported at doctor-run.log:64-71. The target's menu answer and help mapping remain aligned at doctor-speckit-presentation.txt:18, 36, and 60.

The route validator itself passes, with two informational duplicate-flag warnings, at doctor-run.log:78-103. Its script-existence assertion checks script_invocations paths at route-validate.py:408-423. The exact search rg -n "audit_script|phase_0_audit|activities" .skilled/commands/doctor/scripts/route-validate.py returned no matches, exit 1; the validator checks script paths and read-only policy at route-validate.py:408-423 and 452-470, so this pass does not verify that workflow activities invoke every route script. The shared --dir flag warning is informational, and the router parses the target before flags at speckit.md:33-35.

## FINDINGS

None observed in the inspected parent skill, .skilled/skills/system-deep-loop. The fleet gate reports 14 roots passed, 0 failed at doctor-run.log:18-19. The parent audit reports every hard invariant passed with 0 warnings at doctor-run.log:26-75. These results are observations from the commands recorded in that log.
