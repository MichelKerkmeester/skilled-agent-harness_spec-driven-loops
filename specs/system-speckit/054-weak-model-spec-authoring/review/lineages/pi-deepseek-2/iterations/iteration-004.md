# Iteration 4 - Security and trust boundary of the placeholder gate family and the post-edit hook scan

## Focus

Security dimension applied to the two placeholder readers and the path from the post-edit hook into the broader scan: what a document under review can steer, whether the authoring-time guard still reports what the templates now emit, whether the scan's path handling can be turned against the operator, and whether a legitimate strict-passing packet trips it.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:1-203` (whole file: header contract, argument parsing, skip list, bracket class, two-pass match, JSON output, exit codes)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh:13-25` (the narrower rule's stated division of labour)
- `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:23-40,250-270,410-475` (wiring, spawn, timeout)
- `.skilled/hooks/post-edit-quality/README.md` (row 4: `placeholders`, `n.sh <dir>`, `exit1`)
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/goal.md:112` (OP-2 as a recorded operator item)
- `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate/plan.md:437-441` (ADR-003)
- Probe runs of `check-placeholders.sh` against this packet (read-only): `--json` on the parent, `--verbose` on the parent, on `005-weak-model-authoring-card/` and on `006-speckit-command-and-agent-alignment/`
- `specs/system-speckit/054-weak-model-spec-authoring/005-weak-model-authoring-card/tasks.md:77`, `006-speckit-command-and-agent-alignment/tasks.md:79-81`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:54-56` (the emitted token form)

## Findings

### P0 Findings

None. Nothing found here lets a document execute code, disclose data, or forge a pass on the production validator.

### P1 Findings

1. **The post-edit hook's placeholder scan cannot see the token form the v2.3 templates now emit, so the authoring-time guard went silent at the moment the templates changed** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:99` -- `PLACEHOLDER_BODY="[A-Za-z0-9 /,._<>+%'-]"` has no colon, and both match sites build `\[[A-Z]${PLACEHOLDER_BODY}+\]` from it (`:149`, `:168`). Every core template now writes hints as `[YOUR_VALUE_HERE: ...]`, which carries a colon before the hint text, so no such line can match. Probed directly: the line `| **Language/Stack** | [YOUR_VALUE_HERE: e.g., TypeScript, Python 3.11] |` from `templates/core/plan.md.tmpl:54` returns `SCANNER_BLIND` against this class and `RULE_MATCHES` against `\[YOUR_VALUE_HERE:`. The hook is the only feedback a weak model gets while writing (`post-edit-router.cjs:39` wires this path for spec docs), so an unfilled token now passes the loop silently and is only caught at the end by the orchestrator. The phase knew: `003/goal.md:112` records "After this phase the hook no longer reports unfilled tokens in new packets" as OP-2 and leaves it as a candidate row for a later phase, and `plan.md:441` (ADR-003) fixes the same blindness as a recorded defect of this file.
   - Claim: the only authoring-time placeholder guard is blind to the token spelling the templates emit.
   - Evidence refs: `spec/check-placeholders.sh:99`, `:149`, `:168`; `templates/core/plan.md.tmpl:54`; `post-edit-router.cjs:39`; `003/goal.md:112`.
   - Counterevidence sought: a second guard that catches the token during authoring, and any colon in the bracket class. The rule at `rules/check-placeholders.sh` is sourced only by `validate.sh` and the rule harness, never by the hook, so authoring time has no other guard.
   - Alternative explanation: the colon was left out deliberately so the broad scan stays "soft" and the validator stays authoritative. Rejected as a complete explanation: the file's own header says it exists to catch "any bracket that still looks like a template placeholder", and the packet's objective is a weak model that does not need a frontier model to correct it.
   - Final severity: P1, confidence 0.9.
   - Downgrade trigger: a hook path or authoring-time check that scans `[YOUR_VALUE_HERE:` before validation runs.

2. **The same scan exits 1 on a strict-validated packet's legitimate bracketed content, so the hook fires on this packet 55 times** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:149` -- `bash spec/check-placeholders.sh specs/system-speckit/054-weak-model-spec-authoring --json` prints `{"status":"FAIL","placeholders":55,...}` and exits 1 on a packet whose recursive strict validation prints `RESULT: PASSED`. The matches are documented shell variables and prose, not unfilled templates: `006-speckit-command-and-agent-alignment/tasks.md:79` holds `validate.sh [SPEC_FOLDER] --strict` inside a documented command, `005-weak-model-authoring-card/tasks.md:77` holds `[A-Za-z]` as a regex fragment, and `changelog/changelog-054-006-...md:49` holds `[CONTRACT DRIFT]` as a label. Running the scan on just `005-weak-model-authoring-card/` exits 1 on the single `[A-Za-z]` line, so the failure is reachable by editing one ordinary phase document.
   - Claim: the hook's blocking verdict and the validator's verdict disagree on legitimate content, and the disagreement is systematic rather than incidental.
   - Evidence refs: `spec/check-placeholders.sh:149`, `:168`; `006-.../tasks.md:79`; `005-.../tasks.md:77`; `changelog-054-006-speckit-command-and-agent-alignment.md:49`.
   - Counterevidence sought: an exclusion list covering shell variables, character classes and uppercase labels. The exclusions cover `[x]`, `[ ]`, `[P0..P2]`, `[B]`, `[SPECKIT...]`, `[ANCHOR...]`, `[EVIDENCE...]`, `[NEEDS CLARIFICATION]`, `[W:...]` and `[text](` only (`:153-165`).
   - Alternative explanation: these documents are wrong and should not carry bracketed variables. Rejected: the bracketed form is the repo's own documented convention for a command's folder argument, and the validator accepts it.
   - Final severity: P1, confidence 0.85.
   - Downgrade trigger: an exclusion set that covers `[SPEC_FOLDER]`, regex classes and uppercase labels, or a hook configuration that treats this row as advisory.

### P2 Findings

1. **The scan's stated code-block exclusion only skips the fence delimiter lines, so content inside a fenced example is still scanned** -- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-placeholders.sh:137` -- The header states "Also exclude lines where brackets appear inside code blocks ... Rather than being actual unfilled placeholders" (`:107-109`), and the loop comment says "Skip lines inside code fences" (`:136`). The implementation is `case "$line" in '```'*) continue ;;`, which matches only a line that *starts* with a fence, so the body of a fenced block is scanned line by line. This is the same defect class ADR-003 recorded for this file ("It skips only the lines that start a code fence and not the lines between fences", `003/plan.md:441`), and here it is still present after a phase that read the file.

## Traceability Checks

- Command-injection surface: the hook spawns the checker with `spawnSync(checkerPath, [absFilePath])` and no shell (`post-edit-router.cjs:472`), and the script quotes `"$FOLDER_PATH"` at `:85` and `:177`. No shell metacharacter in a path reaches a shell. Holds.
- Path traversal: `find "$FOLDER_PATH" -name "*.md" -type f` does not follow symlinks (`-type f` is false for a symlink), so a symlinked document outside the folder is not read. Holds.
- Verdict steering from document content: a document cannot buy the Draft warning by crafting a `Status` cell, because the status is read from `spec.md` only and normalized identically in both readers (iteration 3). A document cannot hide a bracket from the *validator*, only from the broad scan, which is finding 1 above.
- `[NEEDS CLARIFICATION]` (no colon) is excluded by the broad scan (`:161`) while the canonical rule requires a colon, so an open question without the colon is invisible to both. Checked for real occurrences: `rg '\[NEEDS CLARIFICATION\]'` outside `scratch/` and `changelog/` finds none, so the gap is latent, not live.
- Overlay protocols: `skill_agent` and `agent_cross_runtime` deferred to iteration 6; `playbook_capability` to iteration 7.

## Confirmed-Clean Surfaces

- The narrower rule (`rules/check-placeholders.sh`) is not the hook's path: it is sourced by `validate.sh` and by the isolated rule tests only, so the false positives above do not affect the production verdict, which is why they are scoped to the hook.
- The JSON output's `folder` field is the only interpolated value (`:182-185`), and the hook does not consume `--json` (`post-edit-router.cjs:472` passes the path only), so the missing escaping cannot corrupt a live consumer. Recorded as clean rather than as a finding.
- The scan skips `memory/`, `scratch/`, `research/`, `review/` and `.backup-*`, so a review packet's own artifacts — including this lineage's iteration files, which intentionally contain `[None yet]`-shaped text — cannot fail it.

## Assessment

Dimensions addressed: security

The gate family is not exploitable, but the hook's guard is wrong in both directions on the same file: blind to the token the templates now emit, and loud about legitimate bracketed text in a strict-passing packet. Both were visible to the packet — OP-2 records the blindness and ADR-003 records the fence defect — and both were deferred, so the packet closed with the only in-loop guard misaligned with the thing it guards. That misalignment is the security-relevant half of the packet's own objective, which is why it is rated P1 rather than advisory.

## Next Focus

Iteration 5 (correctness): the two guard scripts the packet added — `runtime/cli/spec/check-example-drift.sh` and `runtime/cli/spec/check-card-sync.sh` — against what phase 004 and phase 005 claim they guard. Specifically: does the drift guard actually compare examples to templates (or only to a stored copy of itself), does the card-sync guard detect the divergence it names, and would either guard pass if the template changed and the example did not.

Review verdict: CONDITIONAL
