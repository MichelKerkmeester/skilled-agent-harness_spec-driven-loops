INDEPENDENT VERIFICATION — read-only. Do not create, modify, move or delete any file.
Do not run git commands that write. Everything below is a claim to be tested, not a fact to trust.

# What to verify

Four fixes were just made in this repository. Confirm or refute each one from the files and from
commands you run yourself. Where a claim is wrong or only partly right, say exactly which part and
show the evidence.

## 1. Route proof survives a re-projection (the main fix)

File: `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs`

Claimed behaviour, all three states:
- the state-log record carries route proof -> passes with no warning;
- the state-log record lacks it but the leaf delta `deltas/iter-NNN.jsonl` carries it -> passes,
  and the result carries a warning naming the delta;
- neither carries it -> fails with `route_proof_missing` (exit 1);
- a missing state-log record still fails with `state_record_missing` (existence must NOT come from
  the delta).

Also claimed: the file-order change did not weaken any other check (delta-file checks, ledger
backing, gateway receipts).

Verify: read the code, then run
`cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/verify-iteration.vitest.ts`
and confirm the three cases above are actually covered by tests. Then judge for yourself whether
reading the delta is stronger or weaker evidence than reading the projection, and say which.

## 2. The prompt pack now asks for the identity the gateway requires

File: `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`

Claimed: the required iteration record now carries `runId`, `sessionId` and `lineageId`, and those
three are exactly what the gateway demands. The rule lives in
`.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts`
(look at `stableTargetIdentity`, `hasStableIdentity`, `hasIterationIdentity`).

Verify: does the template's stated requirement actually satisfy that rule? Does the template still
render (it takes exactly 16 substitution tokens, and an extra token would throw)? Is the delta-file
example consistent with the required record?

## 3. The per-iteration tool-call budget

Claimed: `maxToolCallsPerIteration` is 24 in
`.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` and the workflow
carries `tool_call_budget: { target: 12, max: 24 }`. Verify both files, and find any other place
that still pins the old 12.

## 4. Two documentation defects

- `.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md`: its curated model-family list
  should now cover every id in the enforced allowlist. The allowlist exists twice and both copies
  must agree: `DEVIN_SUPPORTED_MODELS` in
  `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` and
  `DEVIN_ALLOWED_MODELS` in
  `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`. Count the ids named in the
  SKILL.md line and compare them set-for-set with the allowlist.
- `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/spec.md`: its
  continuity block must no longer say "Plan phases 003 to 011" or `completion_pct: 90`, and must
  not claim anything the packet's own `goal.md` does not support.

# Rules for your answer

- Verify from files and commands. Quote the line or the command output behind every verdict.
- Do not accept a summary as evidence, including this one.
- If a claim is false, say so plainly and show what is true instead.
- Also report anything you find broken, stale or inconsistent that this brief did not mention.

# Output

Write your report to `specs/system-deep-loop/050-spec-protocol-ledger-events/scratch/verification-gemini-3-8-flash-high.md` (this is the only file you
may write) and also print it to stdout.

Structure it as: a one-line overall verdict, then a table with one row per claim above
(Claim | Verdict CONFIRMED/WRONG/PARTIAL | Evidence), then "Other findings", then
"Residual risk". End with exactly this final line:
`Verification complete: <n> confirmed, <n> wrong, <n> partial, <n> other findings.`
