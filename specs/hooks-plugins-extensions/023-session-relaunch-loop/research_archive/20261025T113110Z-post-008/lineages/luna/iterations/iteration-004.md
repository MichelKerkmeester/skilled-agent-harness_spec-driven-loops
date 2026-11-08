# Iteration 4: Test traceability and standards alignment

## Focus

Compare the test inventory and documented commands with the runtime surfaces, then check the observed edge cases against sk-code-skilled and sk-doc guidance.

## Actions Taken

- Read the JavaScript and universal code checklists, including filesystem safety and edge-case review criteria.
- Read the sk-doc quality-control requirements for structure evidence and DQI claims.
- Compared the session-relaunch test README's directory tree and validation command with the separate OpenCode plugin test and its manual-testing-playbook entry.
- Reviewed the main handoff README's runtime-specific claims against the available adapter tests. No tests or document extractors were run; no DQI score is claimed.

## Findings

1. **LUNA-R4-001 — The test inventory omits a link to the OpenCode plugin suite (CONFIRMED documentation gap).** The session-relaunch test README lists the hook-directory adapter files and its validation command runs only `.skilled/hooks/session-relaunch/tests/*.test.cjs`; the actual OpenCode plugin suite lives at `.opencode/plugins/tests/session-relaunch.test.cjs` and is documented separately in the Pi/OpenCode playbook. Add a distinct OpenCode suite entry and command to the test README, or explicitly label that page as covering only the hook-directory suite and link to the plugin test. This makes the documented regression surface discoverable without changing test ownership. [SOURCE: .skilled/hooks/session-relaunch/tests/README.md:18-38] [SOURCE: .skilled/hooks/session-relaunch/tests/README.md:85-115] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:1-4] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:83-89]

## Questions Answered

- **Do tests cover the public behavior and edge cases claimed by docs and specs?** The adapter suites and playbooks cover the documented runtime paths, including a separate OpenCode plugin suite. The test README does not point readers to that suite, and Iteration 3 identified consume-path edge cases not represented by the shown failure test. No test execution was done.
- **Which document, spec-record or standards gaps need correction?** The parent spec worktree field is stale, and the OpenCode suite needs a discoverable entry in the test inventory. The symlink concern from Iteration 1 also matches the universal checklist's canonical-path and symlink-escape requirement.

## Workflow Conflicts

- The Iteration 4 state event was committed by the append gateway at ledger sequence 5, but projection again refused to replace the legacy config row because its key set would shrink. The event and state paths were verified; the root state log is unchanged. This is the same deterministic projection conflict already retried three times in Iteration 2, so do not repeat the mutation or bypass the gateway. Continue with the lineage delta artifacts and synthesis. [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/gateway-refusals.jsonl:5] [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/deep-research-state.jsonl:1-2] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts:204-233]

## Questions Remaining

- Does the core preserve session ownership, file privacy, time-boundary and lock invariants after phase 008?
- Are the phase 008 acceptance claims consistent with the current code and recorded evidence?

## Next Focus

Make a final independent pass over the shared core's filesystem and state boundaries and the phase 008 closure records; consolidate confirmed drift, static inferences and recommended refinements for synthesis.
