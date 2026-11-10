# Iteration 3 - Phase 003 versioned placeholder gate behavior and implementation parity

## Focus

Correctness of the shipped gate against its own four-cell contract, and parity between the two implementations the packet says mirror each other. The contract under test, stated in `003-versioned-placeholder-gate/implementation-summary.md:54` and in both file headers: a doc stamped `v2.3` or later defers an unfilled `[YOUR_VALUE_HERE: ...]` token to a warning while `spec.md` has the Status `Draft`, errors at any other status, a doc with an older stamp keeps its error, and `[NEEDS CLARIFICATION:` is an error everywhere.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:505-519` (`validationDocsForLevel`)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:525-535` (`stripFences`)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:661-762` (`carriesTokenGateStamp`, `specStatusIsDraft`, `validatePlaceholders`)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:18-45` (stamp and status helpers)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:86-159` (scan loop, fence filter, three patterns)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:188-204` (result mapping)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/status-classifier.sh:13-80` (`speckit_status_trim`, `extract_status_table_value`)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts:1-140`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:1-35,323-353`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/implementation-summary.md:54,63,119`
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/plan.md:437-441`

## Findings

### P0 Findings

None. The four contract cells hold on the production path: the test asserts `warn` for a v2.3 Draft, `error` for a v2.3 at a non-Draft status, `error` for a v2.2 Draft, and `error` for an open question in a v2.3 Draft, and it drives both `validate.sh` and the shell rule for each cell.

### P1 Findings

None.

### P2 Findings

1. **The two placeholder implementations disagree on the marker set: the orchestrator flags the legacy `<YOUR_VALUE_HERE:` form and the shell mirror never sees it** -- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:665` -- `PLACEHOLDER_MARKER_RE` covers `<YOUR_VALUE_HERE:`, `[YOUR_VALUE_HERE:`, `[NEEDS_CLARIFICATION:` and `[NEEDS CLARIFICATION:`. The mirror's Pattern 1 scans only `grep -E '\[YOUR_VALUE_HERE:'` (`rules/check-placeholders.sh:134`) and Pattern 2 only `\[NEEDS[_ ]CLARIFICATION:`, so the angle-bracket form is invisible to it. The file header of the rule claims "Parity: mirrors the runtime orchestrator validatePlaceholders" (`rules/check-placeholders.sh:22`), and the phase summary records the parity gap as closed ("The review found one parity gap, which is fixed: the legacy `<YOUR_VALUE_HERE:` form is no longer deferred to a warning", `003/implementation-summary.md:54`) — but the close was made on the orchestrator side only. The parity test compares the two implementations on four cells, every one of them using the bracket token (`placeholder-token-gate.vitest.ts:33`), so nothing catches a doc that uses the angle form: the mirror reports `pass` and production reports `error`.
2. **Fence detection differs between the two implementations, and within one file, so a token inside a fenced example is code for one reader and a placeholder for another** -- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:729` -- `validatePlaceholders` toggles on `/^\s*```/u`, with a comment claiming it is "matching check-placeholders.sh awk behavior". The mirror's awk toggles on `/^```/` (`rules/check-placeholders.sh:117`), which does not match an indented fence, so a token inside a fence indented by two or four spaces is inside code for the orchestrator and outside code for the mirror. The same file already ships a stricter helper: `stripFences` (`orchestrator.ts:529`) recognises both ```` ``` ```` and `~~~` with optional indentation and is what the anchor rule uses, while `validatePlaceholders` keeps its own narrower loop. Two consequences: the parity comment is false as written, and a `~~~`-fenced example carrying a token is stripped for the anchor check and flagged as an unfilled placeholder by the gate.

## Traceability Checks

- **D2 "new docs only"** (`parent goal.md:36`, phase 003 decision): a doc with an older stamp keeps the error it always had, and `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` are scanned only when they carry the token-gate stamp (`rules/check-placeholders.sh:107-111`, `orchestrator.ts:720-723`). No existing packet gains a failure. Holds.
- **Status classifier parity**: `speckit_status_trim` (`status-classifier.sh:13-33`) and `specStatusIsDraft` (`orchestrator.ts:694-712`) both strip bold/backticks, quotes, case, repeated spaces and trailing `.,;:!`. Both read the first `| Status |` row only. Holds.
- **Stamp reader parity**: both scan the first 70 lines and both compare major/minor numerically rather than lexically, so `v2.10` outranks `v2.3`. Holds.
- **`validate.sh` is a front-end only**: its header states it "implements no rules", and it resolves `dist/lib/validation/orchestrator.js` with a freshness check (`validate.sh:21-22,323-353`). The production verdict is therefore the orchestrator's, which is why finding 1 is scoped as a mirror/harness divergence rather than a wrong production verdict.
- **Post-edit scanner untouched** by design (`003/goal.md:50` D7, `plan.md:437-441` ADR-003), so its two recorded defects are not restated here; its security surface is iteration 4's subject.
- Overlay protocols: `skill_agent` and `agent_cross_runtime` remain deferred to iteration 6.

## Confirmed-Clean Surfaces

- The gate does not fire on the templates themselves: `templates/` paths are skipped by the rule's path filter and the token templates live under `templates/core/`.
- No core template carries an indented fence (`grep -cE '^[[:space:]]+```'` prints 0 for all four), so finding 2 cannot be triggered by a scaffolded packet as shipped — it needs an author to indent an example fence.
- The `[NEEDS CLARIFICATION:` escalation inside a Draft is not bypassable by putting both markers on one line: the shell tests the line for the clarification pattern before deferring (`rules/check-placeholders.sh:128`), and the orchestrator tests `CLARIFICATION_MARKER_RE` on the whole line (`orchestrator.ts:743`).
- A Draft deferral is per packet, not per document, and both implementations read the packet's `spec.md` status, so an unfilled token in `plan.md` of a Draft packet warns in both.

## Assessment

Dimensions addressed: correctness

The gate itself is sound and its four cells are genuinely pinned by a test that runs both implementations. The two P2 findings are narrower: the "mirror" is not a mirror on two marker and fence classes, and the test that compares them only compares the four contract cells. Both matter because the isolated rule harness is what the extended validation suite drives, so a future change could pass it and fail production.

## Next Focus

Iteration 4 (security): the trust boundary around the placeholder gate and the post-edit scanner — `runtime/cli/spec/check-placeholders.sh` (recorded defects OP-2), path handling in the scan loop, whether a doc under review can steer its own verdict (a Status cell or stamp line crafted to buy the Draft warning), and whether any hook passes untrusted content into either script.

Review verdict: PASS
