# Deep Review — Iteration 002: Security

## Dimension

Security (D2 of 4) of the new read-only `/doctor:sk-code` setup battery, along the three lines the iteration 1 handoff named: the caller-text → displayed-command rendering path (`--prompt`), the read-only claim (no filesystem writes on any path), and the trust boundary where the battery parses and renders the spawned legs' output.

Read-only review: no target file was executed or modified. Every verdict below rests on a direct read of the listed files and is labeled that way. Doc and contract text were treated as data; no reviewed artifact carried instructions aimed at the reviewer.

## Files Reviewed

| File | Scope read |
|------|------------|
| `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | full, 328 lines |
| `.skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs` | full, 208 lines |
| `.skilled/commands/doctor/sk-code.md` | full, 61 lines |

Run state (not review targets): `deep-review-strategy.md`, `deep-review-state.jsonl`, `iterations/iteration-001.md`, and the shared doctrine `.skilled/skills/sk-code/sk-code-review/references/review-core.md`.

Not read this iteration: `_routes.yaml` rows (route shape verified in iteration 1), the workflow YAML, the presentation contract, and the pre-existing legs the battery calls (strategy §4 non-goals).

## Findings by Severity

### P0 — none

### P1 — none

### P2 — 2

#### R2-P2-001 [P2] Caller-supplied `--prompt` is rendered into report lines unsanitized

- Case: a caller passes a prompt that contains a newline plus report-shaped text (for example `--prompt=$'x"\nPASS  guard  node ...\nSTATUS=OK legs=8'`); the battery interpolates the raw value into the probe row's displayed command and into repair strings, so the printed report carries forged verdict lines next to the real ones.
- File: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:138]
- Evidence: `parsePrompt` accepts any non-empty text after `--prompt=` with no character validation [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:294]; the raw value reaches the probe command display [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:138], the no-decision repair [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:243] and the wrong-action repair [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:251]; `report()` prints these strings verbatim [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:261]. No escaping helper exists anywhere in the file (full read). The command doc declares `--prompt=<text>` the one accepted flag, passed through to the probe [SOURCE: .skilled/commands/doctor/sk-code.md:34].
- User impact: a reader — operator or agent — can be shown PASS and STATUS=OK lines the battery never produced; a first-match consumer of the STATUS line can be told the setup is healthy while the real final line says FAIL.
- Counterevidence sought: the spawn path is an argv array with no shell [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139], so the prompt cannot execute anything; the true STATUS line is appended last [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:282], so a last-line parser is not fooled.
- Alternative explanation: the prompt is operator-typed, so forging one's own report is self-inflicted — true only while every caller types a benign prompt; the doc routes the flag through agent-driven sessions as well.
- Finding class: class-of-bug — three interpolation sites share the single rendering boundary in `report()`.
- Scope proof: the prompt is interpolated only at [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:138], [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:243] and [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:251]; all report lines are emitted by `report()` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:263].
- Confidence: high on the mechanism (direct read); medium on consumer impact. Downgrade trigger: if no consumer beyond a careful human reads the report, this stays advisory; escalate if any automation matches the first STATUS/PASS line.
- Recommendation: reject newlines and control characters in `parsePrompt` (usage error, exit 2) or render the prompt escaped, so a prompt cannot produce a line of its own.

#### R2-P2-002 [P2] Raw leg output is admitted into report lines without control-character filtering

- Case: a failing leg prints a line that begins with `FAIL` and carries terminal control characters (for example a guard echoing a path or identifier taken from the checkout); `failLines` admits it on the prefix alone and `report()` prints it into the operator's terminal.
- File: [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:152]
- Evidence: `failLines` filters only on the `FAIL` prefix and slices to ten lines [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:155]; the survivors are pushed into the report with a fixed indent and no sanitization [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:279]. The JSON-parsed legs are unaffected; the parent-skill and drift-guards legs render raw text through this path.
- Assumption stated: not verified that any current leg echoes attacker-controlled text into `FAIL` lines — the legs are pre-existing and out of scope (strategy §4). The risk matters because the rendering boundary has no filtering at all and the leg set can grow.
- User impact: terminal escape injection (screen manipulation, clipboard writes through OSC sequences) in the operator's terminal when leg output contains such bytes.
- Finding class: class-of-bug — every raw-text leg shares `failLines` and the same rendering path.
- Scope proof: the only detail-producing helpers are `failLines` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:152] and the two JSON branches [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:206] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:227]; only `failLines` output is unsanitized text.
- Confidence: medium-low; downgrade trigger: if no leg can surface text the repository itself did not author, drop to informational.
- Recommendation: strip ANSI/control characters in `failLines` (or render the detail escaped), matching the stricter handling the JSON legs already get.

## Read-Only Claim Verification

The battery's own code has no write path: it imports only `node:child_process` and `node:path` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:30], and its only outputs are `process.stdout.write` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:324] and `process.stderr.write` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:308]. The spawned legs are invoked with check-only flags (`--json`, `--check`, `--format json`) [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:119] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:124] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:134]. One residual trust assumption: `legacyStubRepair()` loads the guard module in-process [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:168] and calls `staleFix`; the guard is a pre-existing leg (non-goal), and the suite exercises its output [SOURCE: .skilled/commands/doctor/scripts/tests/sk-code-setup-check.test.cjs:132]. Within the battery, the `mutating: read-only` classification (route shape verified in iteration 1) holds.

## Ruled Out This Iteration

- Command injection through `--prompt` or any leg argv: all spawns are argv arrays with no shell option [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:76]; the rendered command strings are display-only and never executed.
- `SK_CODE_SETUP_ROOT` as an execution-redirect vector: the override is the documented fixture seam [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:37]; the default root is the repository the battery is meant to inspect, and control of the invocation environment already implies code-execution-equivalent capability.
- PATH hijack of the `bash` leg [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:129] while `node` is pinned via `process.execPath` [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:139]: PATH control already implies equivalent capability; noted as hardening only.
- Repair lines built from child JSON (`entry.fix`, `root.name`) [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:210] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:234]: the legs already execute with the operator's privileges, so their output strings add no capability; the residual risk is a wrong command, a correctness concern already covered in iteration 1.
- Secrets exposure: no environment reads beyond the root override, no secret-bearing output path (full read).
- `require.resolve` of `@spec-kit/shared` with a `paths` option [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:97]: resolution reads package metadata only and does not execute module code.
- Resource exhaustion via a hung leg: already registered as R1-P2-001 in the correctness iteration; not re-reported here to avoid double-counting.

## Traceability Checks

- `spec_code`: deferred this iteration — the strategy marks the direction blocked for re-entry; the traceability dimension will own the recheck.
- `checklist_evidence`: deferred to the traceability iteration, per the iteration 1 record.

## Verdict

No P0, no P1. Two P2 advisories, both on the report rendering boundary — caller text and raw leg output reach printed report lines unfiltered. The read-only claim holds for every path inside the battery. PASS, advisories only (P2).

Telemetry: newFindingsRatio 0.22 = 2 new findings / (2 findings + 7 ruled-out or not-applicable directions).

## Next Dimension

Traceability (D3), per the strategy's planned order.

## SCOPE VIOLATIONS

None. All writes this iteration were confined to the review state files.

Review verdict: PASS
