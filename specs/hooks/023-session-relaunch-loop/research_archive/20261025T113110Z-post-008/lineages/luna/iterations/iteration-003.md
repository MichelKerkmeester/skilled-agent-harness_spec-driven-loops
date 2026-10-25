# Iteration 3: Wrapper and handoff failure transitions

## Focus

Trace skilled-loop's decline, signal and consume paths through the CLI, then compare the handoff guarantees in the README with the implementation and existing tests.

## Actions Taken

- Read the wrapper's successful relaunch, manual fallback, invalid-record and runtime-exit branches.
- Traced `should-relaunch` and `consume` output fields and the state-file deletion path.
- Compared the wrapper's consume-failure tests and Gate 3 handoff documentation with those branches. Tests were not run.

## Findings

1. **LUNA-R3-001 — A consume failure loses the carried Gate 3 answer (CONFIRMED control-flow edge).** The wrapper obtains `spec_folder` only from `consume_record`; when that command fails, `consumed_record_json` is empty. The ordinary relaunch path still builds a seed without its `Spec folder:` suffix, and the signal/manual fallback also prints without the suffix. `should-relaunch` returns no `spec_folder`, so the wrapper has no fallback source. The existing consume-failure test uses a note without a packet or Skip answer, while the README promises that the answer carries across the hop. Preserve a validated `spec_folder` before consuming, return it from a read path such as `should-relaunch`, and use it when consume fails; add failing-consume cases for both a packet path and `none`. [SOURCE: .skilled/bin/skilled-loop:68-87] [SOURCE: .skilled/bin/skilled-loop:450-465] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:461-470] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:504-550] [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1353-1373] [SOURCE: .skilled/hooks/session-relaunch/README.md:112]
2. **LUNA-R3-002 — `consume` deletes the relaunch record even when the handoff cannot be read or parsed (CONFIRMED control-flow edge).** The CLI catches note read/parse errors, may leave `specFolder` empty, then unlinks the state file and returns success. `skilled-loop` treats that success as permission to launch a new runtime with a claim seed pointing at the unreadable or invalid note. Reject consumption before unlinking when the handoff is missing or invalid, and make the wrapper retain a recoverable record or print a manual recovery command instead of starting a guaranteed-failing claim. Add missing-file and malformed-note cases. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:504-550] [SOURCE: .skilled/bin/skilled-loop:456-467] [SOURCE: .skilled/hooks/session-relaunch/README.md:105-116]

## Questions Answered

- **Does skilled-loop preserve handoff, claim, save, resume and relaunch behavior under failures?** The reviewed tests cover exit-code preservation and manual fallback for a consume failure, but that fallback has no Gate 3 answer to preserve; static tracing also shows the wrapper proceeds after `consume` reports success even when the note could not be read. No tests were run.

## Workflow Conflicts

- The iteration event was appended through the gateway, but projection again returned `PROJECTION_FAILED` for the existing config-row key set; the path was verified and the same cause had already failed three times in Iteration 2. The gateway recorded this iteration event at ledger sequence 4, while the root state log remains unchanged. Further retries would only repeat the known projection failure; keep the delta artifact as the per-iteration finding record and do not write the state log directly. [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/gateway-refusals.jsonl:4] [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/deep-research-state.jsonl:1-2] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts:204-233]

## Questions Remaining

- Do tests cover the public behavior and edge cases claimed by docs and specs?
- Which document, spec-record or standards gaps need correction?
- Does the core preserve session ownership, file privacy, time-boundary and lock invariants after phase 008?

## Next Focus

Compare the documented test claims and recorded outcomes with available test cases and the sk-code-skilled and sk-doc checklists, focusing on uncovered public edge cases and traceability.
