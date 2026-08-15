# Iteration 4: Testability Audit — Untestable and Threshold-Less Acceptance Criteria Across 001, 002, 008, 009

## Focus
Audit the acceptance criteria in 001 (contract/threat baseline), 002 (harness), 008 (documentation), and 009 (release verification) for gap class (d): untestable or unfalsifiable criteria, missing thresholds, missing exit-status contracts, and criteria whose "test" is only documentation or reviewer opinion. Cross-check whether 002's harness can actually prove the claims the other phases make.

## Actions Taken
- Read 001 REQ-001..004, REQ-090..093 and SC-001/SC-002 (001/spec.md:105-117).
- Read 002 REQ-001..004 (002/spec.md:106-114) and its SC-001/SC-002.
- Read 008 REQ-001..005 (008/spec.md, Level 2; requirements at §4).
- Read 009 REQ-001..006 (009/spec.md:105-119) and SC-001/SC-002.
- Checked REQ-090..093 (the shared evidence/rollback/handoff rows) across all phases for consistency of the "version-pinned evidence" claim.

## Findings

### F4.1 — "Fail closed" is used as a criterion without a definition of the closed state or the observable [P0, 002 + all phases]
002 REQ-003 "Security tests fail closed" and the blanket use of "fails closed" across 001 (REQ-003), 003, 004 (REQ-002), 006, 007 — the phrase appears in nearly every phase — but NO spec defines the operational meaning: does "fail closed" mean the capability is disabled, the connection dropped, an error surfaced, a specific exit code returned, or all of these? For a test to be a "failing negative control" (002 REQ-003), the CLOSED state must be observable and asserted. As written, "fails closed" is a slogan, not an acceptance criterion. Remediation: add REQ-029 to 002 (as the shared harness contract): "A named 'closed state' for each boundary — connection terminated, capability disabled, message rejected with a typed error, audit row written — with an asserted observable for every negative control; the definition is shared vocabulary consumed by 001 REQ-003 and 004/006/007 criteria."

### F4.2 — REQ-090 "version-pinned evidence" has no schema: what is recorded, by whom, and validated how? [P1, all phases]
REQ-090 appears identically in every phase ("Every completed claim records exact commands, versions, environment, output, and exit status") — but nothing defines the evidence FORMAT (a JSON envelope? a directory convention? an assertion library?), the recording mechanism (who runs the command and captures output?), or a validation gate (does the harness REFUSE a claim without evidence? does 009 RE-verify?). As written it is a documentation requirement, not a testable contract; a phase could "complete" with screenshots pasted into a markdown file and still satisfy the letter. Remediation: add REQ-030 to 002 (or a 001-level REQ): "Evidence is a machine-readable JSON envelope per claim (command, argv, env hash, exit status, stdout/stderr hashes, duration, host fingerprint) written by the harness runner, with a 009 gate that every completion claim resolves to such an envelope; screenshots/plaintext are supplementary, never the evidence."

### F4.3 — Performance criteria in 009 REQ-005 name metrics but no targets; "measured" without a bound is unfalsifiable [P0, 009]
009 REQ-005: "Relay-added foreground p95 latency, streaming cadence, queue memory, replay size, storage growth, and restart recovery are measured under stated conditions." The criterion is "measured" — but there is no target value for ANY metric (p95 latency below what? storage growth per what?). A phase that measures and records a 30-second p95 satisfies the letter. REQ-005 is a P1, but it feeds the staged-release gates; without targets, the 009 SC-001 "enabled only when their own evidence subset is green" has no green definition for performance. Remediation: add REQ-031 to 009: "Declare numeric targets for each named metric under stated conditions (e.g. relay-added p95 ≤ 250ms over tailnet, storage growth ≤ X MB/hour/session, restart recovery ≤ Y s) in the phase-001 supported-environment annex; the whole gate fails if targets are missing or exceeded."

### F4.4 — 008 documentation criteria are process-shaped, not verifiable; "tested on the target host" needs a test, not a doc [P1, 008]
008 REQ-001 "Every setup, start, stop, backup, restore, revoke, rotate, and rollback sequence is tested on the target host" and REQ-003 "checked against final source and evidence" — but 008 is a documentation phase whose own criteria depend on "tested" without owning a test runner, and REQ-003's "checked" is a manual review. 008 has no acceptance criterion that the docs are machine-verified (e.g. every command in the runbook executes with exit 0 in a fresh environment — which 009 REQ-004 partially covers with the rollback drill, but setup/backup/restore are not in 009's rollback list). Remediation: add REQ-032 to 008: "Every runbook command block carries a machine-executable spec (exact argv + expected exit + idempotency note) consumed by a doc-drill script that executes the sequences in a disposable environment at phase 009; a runbook command that cannot be executed is marked UNVERIFIED, not 'tested'."

### F4.5 — "Supported matrix" rows in 001 REQ-004 and 007 REQ-004 have no completeness contract [P1, 001+007+009]
001 REQ-004 requires "Target OS, deployment identity, iOS/Android/browser rows, and unavailable resources are explicit" and 007 REQ-004 documents "install prerequisites, delivery limits, kill/restart, stale hints, Focus/permission states, and fallback behavior" — but no requirement defines when the matrix is COMPLETE (what columns are mandatory? what is the rule for a row marked 'not tested' — is that allowed, and does it block 009 REQ-003's real-device evidence?). Without a completeness contract, an empty matrix with "unavailable resources" noted satisfies the letter. Remediation: add REQ-033 to 001: "The supported matrix has a fixed schema (OS/version, browser/version, install path, push availability, tested/target/not-tested status, evidence link); every row is either tested with evidence or explicitly not-tested with a blocking note for 009 REQ-003; 'not-tested' rows cannot be claimed as supported."

### F4.6 — 002 REQ-002 crash points enumerate points but not the assertion for each; "asserted durable outcome" is circular [P0, 002]
002 REQ-002: "Each pre-write, post-write, pre-acknowledgement, post-acknowledgement, persistence, broadcast, and reconnect point has an asserted durable outcome." The points are enumerated, but the outcome vocabulary is not defined: what are the legal outcomes (durable, lost, indeterminate, pending, replayed)? 003 REQ-003 introduces "indeterminate" for mutations, but the harness criterion references outcomes without the enum. A harness that asserts "something happened" at each point satisfies the letter. Remediation: add REQ-034 to 002: "Define the outcome enum (durable / lost-by-design / indeterminate / pending-retry / replayed) and require each crash-point test to assert exactly one named outcome and the observable that distinguishes it (e.g. ledger row present + envelope sequence monotonic)."

### F4.7 — SC criteria across phases mix UX aspirations with machine checks; several are unfalsifiable [P1, cross-phase]
Scan of success criteria: 001 SC-001 "a fresh implementer can reproduce every pinned contract" (human-factors, not machine-checkable); 002 SC-001 "the same command proves a regression before and after" (testable); 004 SC-001 "every bypass path remains closed" (negative-space claim — requires an exhaustive attack inventory that no phase owns); 005 SC-002 "retention misses and old epochs force a snapshot barrier" (testable); 006 SC-001 "every stale, altered, duplicate, raced, or unavailable-boundary case denies execution" (testable with a finite case list); 009 SC-002 "produce no hidden blocker or unsupported claim" (unfalsifiable). The 004 "every bypass path" and 009 "no hidden blocker" claims cannot be proven by a finite test suite unless an attack/limitation inventory is a bounded artifact. Remediation: add REQ-035 to 001 (or 002): "Each 'every'/'no' success claim is backed by a bounded, versioned attack/limitation inventory (threat model from 001 REQ-003) that enumerates the finite set the claim covers; claims without an inventory are reworded to 'all enumerated cases'."

## Questions Answered
- KQ-2: comprehensive — the fail-closed vocabulary (F4.1), evidence schema (F4.2), performance targets (F4.3), doc-testing (F4.4), matrix completeness (F4.5), crash-point outcomes (F4.6), universal quantifier claims (F4.7).

## Questions Remaining
- KQ-3 remainder: offline/stale details, multi-device races, retention expiry; KQ-4 remainder: redaction determinism, offline cache privacy, notification privacy — iteration 5.

## Next Focus
Iteration 5: Privacy/security sweep + missing requirements consolidation — redaction determinism and boundaries, offline cache privacy, retention/expiry, backup/restore of device state, plus a severity-ranked consolidated gap list mapped to phases with REQ/ADR remediations (synthesis input).

## Sources Consulted
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/001-contract-and-threat-baseline/spec.md:105-117]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/002-automated-test-harness/spec.md:106-114]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/008-documentation-and-runbooks/spec.md §4]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/009-release-verification-and-rollout/spec.md:105-119]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/004-auth-and-tailnet-boundary/spec.md:105-110]

## Assessment
- newInfoRatio: 0.75 — the testability axis (criteria-as-slogans, evidence schema, matrix completeness) is net-new; some overlap with iter-3 unfalsifiability findings (F3.1) avoided by focusing on the 001/002/008/009 phases rather than 006.
- Confidence: high for F4.1-F4.3, F4.6 (direct criterion-text analysis); medium-high for F4.4-F4.5, F4.7 (structural inference).

## Reflection
What worked: treating every acceptance criterion as a prompt for "what exact command/assertion would prove this?" systematically exposed slogan-criteria.
What failed: cannot enumerate the "every bypass path" inventory myself (that's the 001 threat-model artifact); flagged it as a required bounded artifact instead.
Ruled out: not auditing 003/005/006/007 success criteria in this iteration (covered their acceptance criteria in iterations 1-3); SC-criteria sweep was kept cross-phase but shallow.
