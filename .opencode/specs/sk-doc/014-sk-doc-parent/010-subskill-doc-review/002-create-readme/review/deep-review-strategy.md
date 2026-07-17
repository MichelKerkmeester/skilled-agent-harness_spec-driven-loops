# Deep Review Strategy — create-readme

## Target
- Review target: `.opencode/skills/sk-doc/create-readme/`
- Mode: review
- Max iterations: 4
- Convergence threshold: 0.10
- Stop policy: max-iterations

## Dimensions
- [x] correctness — score: 72/100, iteration 002
- [x] security — score: 70/100, iteration 003
- [x] traceability — score: 75/100, iteration 001
- [x] maintainability — score: 82/100, iteration 004

## Running Findings Counts
- P0: 0
- P1: 3
- P2: 2

## Next Focus
- dimension: complete
- focus area: remediation planning for active P1/P2 findings in `install_guide_template.md`
- reason: max-iterations stop policy reached; all requested dimensions have been reviewed
- rotation status: traceability, correctness, security and maintainability complete
- blocked/productive carry-forward: semantic template-contract review was productive; validator-only checks are insufficient for these findings
- required evidence: use the cited source lines in iterations 001-004 as the remediation planning packet

## What Worked
- Initialization authorized by dispatch; packet state created under review boundary.
- Iteration 001: validator baseline, path resolution and script-flag verification quickly separated clean surfaces from template-fidelity issues.
- Iteration 002: comparing the primary workflow, quality reference and template examples found a separate troubleshooting-format correctness issue that validator checks do not catch.
- Iteration 003: targeted security grep plus direct reads found a secret-exposure guidance issue while confirming validator/path/tool-flag checks remain green except for the already-filed broken example link.
- Iteration 004: final maintainability sweep confirmed no P0s, verified all route-proof records and found one additional stale related-resource label.

## What Failed
- Previous attempt aborted before initialization because required state files were absent and first-run initialization was not authorized.
- Iteration 001: the primary install-guide template still carries a copyable section model that diverges from `SKILL.md`'s required sections 0-10.
- Iteration 002: the primary install-guide template teaches bullet-style troubleshooting examples despite the workflow and quality reference requiring a 3-column table.
- Iteration 003: the primary install-guide template tells users to echo an API-key environment variable, creating secret-exposure risk in copied guides.
- Iteration 004: the install-guide template still carries stale `sk-doc SKILL.md - Mode 4` wording in its related-resource footer.

## Exhausted Approaches
- None.

## Edge Cases and Carry-Forward
- The user requested a full `/deep:review:auto` loop, but this leaf executor contract permits one review iteration per execution; additional iterations must be dispatched separately by the loop owner.
- Iteration 001: per-iteration delta JSONL and final synthesized report were not written because this leaf agent may only write the iteration artifact, strategy and canonical state log.
- Iteration 001: one illustrative placeholder-style location pattern was ruled out as not an active broken link; one concrete missing asset example link remains P2.
- Iteration 002: separate delta JSONL was again not written due to the leaf write boundary; canonical JSONL includes the iteration state.
- Iteration 002: README reference overlap was reviewed and ruled genuine overflow, not an active duplicate-workflow finding.
- Iteration 003: the existing broken asset back-link was verified but not re-filed; `sudo` wording was reviewed and ruled out as an active finding.
- Iteration 004: final synthesis is embedded in `iteration-004.md`; no separate review report was written because reports are outside this leaf agent's writable set.

## Integration Follow-up
- Verify route-proof fields in every iteration JSONL record: target_agent, resolved_route, agent_definition_loaded, mode.
- Iteration 001 route-proof fields were written in the state record.
- Iteration 002 route-proof fields were written in the state record.
- Iteration 003 route-proof fields were written in the state record.
- Iteration 004 route-proof fields were written in the state record.
