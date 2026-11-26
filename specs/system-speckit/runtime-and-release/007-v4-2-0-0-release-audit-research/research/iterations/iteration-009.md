# Iteration 9: Q5 cross-entrypoint ownership and CI parity

## Focus

Audit the cross-entrypoint claims in Q5, focusing on doctor command ownership, runtime mirror CI coverage and the sk-git message-contract adapter. The current strategy leaves Q5 open; the archived synthesis informed overlap avoidance while this pass followed the current Next Focus.

## Actions Taken

1. Read the archived research synthesis to avoid repeating its doctor overlay and worktree findings.
2. Compared the release changelog's doctor ownership claim with the current `system-skilled-doctor` skill and doctor route manifest.
3. Traced agent mirror coverage across `agent-mirror-sync.yml`, `spec-kit-check.yml`, `command-tree-parity.yml` and the agent mirror crosswalk.
4. Compared the documented shared sk-git validator contract with the Pi transport adapter and validator's refusal output path.
5. Read the sk-doc workflow path filters, but did not inspect sk-doc implementation paths or run any CI workflow or test suite.

## Findings

No defect was confirmed in the reviewed slice. The mirror checks are split across workflows: the authored-agent check covers its declared paths, `spec-kit-check` runs the runtime, Codex, Pi, roster and Vibe checks, and `command-tree-parity` runs the DSH and Vibe mirrors on their source/output paths. This matches the crosswalk's description of separate generated-tree checks. [SOURCE: .github/workflows/agent-mirror-sync.yml:5] [SOURCE: .github/workflows/agent-mirror-sync.yml:72] [SOURCE: .github/workflows/spec-kit-check.yml:20] [SOURCE: .github/workflows/spec-kit-check.yml:338] [SOURCE: .github/workflows/command-tree-parity.yml:17] [SOURCE: .github/workflows/command-tree-parity.yml:140] [SOURCE: .github/workflows/command-tree-parity.yml:177] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:56]

The doctor ownership wording also agrees within the inspected sources. `system-skilled-doctor` declares ownership of every doctor command, while the changelog identifies six commands that moved into it and says the playbook moved with them. [SOURCE: .skilled/skills/system-skilled-doctor/SKILL.md:9] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:464] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:466]

The sampled sk-git contract description agrees with the Pi adapter's control flow: the feature catalog names the shared validator and Pi transport, and the adapter calls the shared evaluator and formats unreadable-rule refusals through the common handler. This is a narrow static check, not an execution result. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:29] [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:60] [SOURCE: .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts:13] [SOURCE: .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts:24] [SOURCE: .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts:36] [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:225]

## Questions Answered

None. The checked portions do not establish a full answer to Q5.

## Questions Remaining

- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Ruled Out

- A suspected gap caused by treating `agent-mirror-sync.yml` as the only CI mirror gate was not confirmed; the other reviewed workflows run the generated/runtime mirror checks.
- The six-command move described in the release changelog does not conflict with the current skill's claim to own every doctor command.

## Dead Ends

- None. The sk-doc implementation, sk-code routing and quality surfaces, and the remaining sk-git paths still offer productive follow-up work.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none in the reviewed sources.
- Missing dependencies: none.
- Partial success: Q5 remains open because this pass sampled only the mirror, doctor ownership and one sk-git contract path; it did not review sk-doc or sk-code implementation behavior.

## Sources Consulted

- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-config.json`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-state.jsonl`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md`
- `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research_archive/20261126T112816Z/research.md`
- `.github/workflows/agent-mirror-sync.yml`
- `.github/workflows/spec-kit-check.yml`
- `.github/workflows/command-tree-parity.yml`
- `.github/workflows/sk-doc-rename-harness.yml`
- `.github/workflows/sk-doc-script-tests-filtered.yml`
- `.skilled/bin/agent-mirror-crosswalk.md`
- `.skilled/skills/system-skilled-doctor/SKILL.md`
- `.skilled/skills/system-skilled-doctor/leaf-manifest.json`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/changelog/skilled/v4.2.0.0.md`
- `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md`
- `.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts`
- `.skilled/skills/sk-git/scripts/validate-message.mjs`

## Assessment

- New information ratio: 0.0. No defect findings were added; the pass only clarified how the reviewed mirror checks are distributed.
- Questions addressed: a bounded portion of Q5 covering doctor ownership, mirror CI coverage and one sk-git adapter contract.
- Questions answered: none.
- Questions remaining: Q4 and Q5.

## Reflection

- What worked and why: reading the mirror crosswalk beside all three relevant workflows showed which CI job owns each generated mirror family.
- What did not work and why: this bounded pass did not reach the sk-doc and sk-code implementation paths, so it cannot close the broad Q5 question.
- What I would do differently: use the final iteration to compare the remaining sk-doc and sk-code changed entrypoints directly against their feature catalogs and the root changelog.

## Recommended Next Focus

Finish Q5 by auditing the changed sk-doc validator and rename paths, sk-code routing and quality surfaces, and the remaining sk-git gates against the v4.2.0.0 changelog. Keep Q5 open unless that cross-surface review supports the full question.
