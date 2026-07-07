# Deep Review Strategy

## Dispatcher

- target_agent: deep-review
- resolved_route: /deep:review:auto -> .opencode/agents/deep-review.md
- agent_definition_loaded: true
- mode: review
- target: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/sk-doc/create-command
- maxIterations: 4
- convergenceThreshold: 0.10
- stopPolicy: max-iterations

## Dimensions

- [x] traceability — primary contract completeness and SKILL.md self-sufficiency checked in iteration 001; score: 0 findings, productive.
- [x] maintainability — reference overflow structure and README route-map fidelity checked in iteration 002; score: 0 findings, productive.
- [x] correctness — tool names, flags, scripts, asset names, validator behavior, and section claims checked in iteration 003; score: 0 findings, productive.
- [x] security — least-privilege command guidance and destructive/privileged confirmation gates checked in iteration 004; score: 1 P1 final validation-gate finding, security guidance otherwise clean.

## Running Finding Counts

- P0: 0
- P1: 1
- P2: 0

## What Worked

- Iteration 001: Direct SKILL.md line review plus validator/script checks established the primary workflow as self-sufficient with zero findings.
- Iteration 002: README.md plus references/*.md line review and validator runs established genuine single-concern overflow with zero findings.
- Iteration 003: Claim extraction, direct line reads, path/link checks, asset inventory, and targeted validators established tool/script/flag/section correctness with zero findings.
- Iteration 004: Least-privilege, mandatory-input, destructive-action, and router/presentation gate guidance reviewed clean; final validation cross-check found one P1 validation-gate mismatch in the presentation template asset.

## What Failed

- Initial dispatch failed before initialization because the review packet was absent; first-run initialization is now authorized by dispatcher.
- Iteration 001: Full reference deduplication and all-doc validation were intentionally deferred to later iterations to preserve the single-focus leaf contract.
- Iteration 002: `validate_document.py --type reference` emitted warnings for numbered headings inside fenced examples in worked_example.md and router_presentation_split.md; exit status remained VALID, so this was recorded as validator noise rather than an active finding.
- Iteration 003: Token-based path extraction produced false positives for placeholders and illustrative output paths; direct line reads adjudicated them as non-links/non-existence claims.
- Iteration 004: Current all-target-doc validation contradicted prior clean validation state: `assets/command/command_presentation_template.md` is invalid as `--type reference` because it lacks a required overview section. The dispatcher also requested review-report.md and registry writes, but those are outside this leaf agent's writable contract.

## Exhausted Approaches

- Iteration 004: Security guidance review for least-privilege tools, mandatory user-input boundaries, destructive confirmation gates, and router/presentation permission preservation is complete.

## Edge Cases And Carry-Forward

- stop_policy=max-iterations means convergence is telemetry only until iteration 4.
- Target files are read-only; all fixes are recommendations only.
- Validation plan: run `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type skill|readme|reference` with `type=skill` for SKILL.md, `type=readme` for README.md, and `type=reference` for reference docs.
- Iteration 001 carry-forward: reference overflow structure, README route-map fidelity, every relative path, section claims, and full README/reference validation remain unchecked.
- Iteration 002 carry-forward: reference overflow structure, README route-map fidelity, relative links, and README/reference validation are checked clean. Correctness review should next verify executable example claims, command-template contracts, and validator flag behavior against actual assets/scripts.
- Iteration 003 carry-forward: correctness checks for tool names, flags, script paths, asset names, section claims, validator behavior, and relative links are checked clean. Security review should next verify least-privilege and destructive/privileged-action guidance.
- Iteration 004 carry-forward: all planned dimensions are reviewed. One active P1 remains: `assets/command/command_presentation_template.md` fails the declared `--type reference` validation gate due to missing overview. Final report and findings-registry refresh remain owner/reducer responsibilities, not leaf-writable artifacts.

## Next Focus

- dimension: final synthesis / remediation planning
- focus area: address the active P1 validation-gate mismatch, rerun target-doc validation, and let the owning workflow refresh reducer-owned registry and review-report.md.
- reason: iteration 4 reached maxIterations=4 and completed the remaining security dimension; the only active issue is a gate-relevant validation failure in the presentation template asset.
- rotation status: final iteration complete under stop_policy=max-iterations; all planned dimensions reviewed.
- blocked/productive carry-forward: productive security review; blocked final report/registry writes because this leaf may write only iteration artifact, strategy, and JSONL.
- required evidence: valid shared-validator output for SKILL.md, README.md, references/*.md, and assets/command/*.md after remediation.
