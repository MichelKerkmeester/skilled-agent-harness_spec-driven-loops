# Review Iteration 5 — maintainability

## Dispatcher

- Mode: review; target agent `@deep-review`; detached fan-out lineage `doctor-install`.
- Session: `fanout-doctor-install-1794550137809-1ecgc7`, generation 1.
- Dimension: maintainability. Budget profile: scan.
- Operator review focus: this iteration covered the sibling-pair risk in the two new hook checks and the two router-table readers, which is the "docs that disagree with code" focus one level down — two implementations of one rule that can drift. No holdout file was opened.

## Files Reviewed

- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:48-67`
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:79-125`
- `.skilled/commands/doctor/scripts/agents-md-check.cjs:789-833`
- `.skilled/commands/doctor/scripts/agents-md-embed.cjs:312-368`
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs`, `.skilled/commands/doctor/scripts/tests/codex-hook-approval-check.test.cjs` (fixtures reviewed for the two sibling behaviors)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. DR1-P1-001 (partial write) and DR4-P1-001 (symlink write-through) remain active.

### P2 Findings

1. **The two sibling hook checks disagree on a value flag whose next token starts with a dash** -- `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs:59` -- `parseArgs` accepts any non-empty next token as the value of `--root`/`--config`, so `--root --json` binds `root = '--json'`; `hook-wiring-check.cjs:87` rejects a value starting with `-` and exits 2. The approval check then looks for `--json/.codex/hooks.json`, finds nothing, and exits 0 with `SKIP no-codex-hooks`, so a typo reads as a clean skip.
   - Case: an operator runs `codex-hook-approval-check.cjs --root --json`; the check reports `SKIP no-codex-hooks` with exit 0, while the sibling check on the same typo refuses with exit 2 and the usage block.
   - Finding class: instance-only
   - Scope proof: `codex-hook-approval-check.cjs:59` tests only `undefined`/`''`; `hook-wiring-check.cjs:87` is the only sibling that tests `startsWith('-')`.
   - Affected surface hints: ["codex approval argument parsing", "hook wiring argument parsing"]
2. **Hook wiring counts a marker anywhere in the event payload, so a mention is read as a wired entry** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:123` -- `wired` is `JSON.stringify(payload).includes(runtime.marker)`. The marker can sit in a comment, a description, a disabled entry or a command that only echoes it, and the runtime reports `ok`.
   - Case: `.claude/settings.json` carries a `UserPromptSubmit` entry whose command is `echo hooks/claude/user-prompt-submit.js` (or a `description` that names the file) and no entry that runs the hook; the check prints `ok claude`.
   - Finding class: instance-only
   - Scope proof: the only structural test is `includes` at `:123`; the function never inspects `hook.type`, `hook.command` or the entry shape the other fixtures use.
   - Affected surface hints: ["hook wiring inspect", "A10-adjacent delivery leg"]
3. **The check and the embed engines read the same router table by different rules, so a malformed row is "missing" to one and "present" to the other** -- `.skilled/commands/doctor/scripts/agents-md-check.cjs:809` -- `parseTableRows` fixes the width at the header and drops a row whose cell count differs (`:809`), while `routerTable` in the embed engine pushes every pipe row without a width check (`agents-md-embed.cjs:361`). A row with an extra `|` inside a summary is therefore reported missing by `/doctor:agents-md check` and treated as present by `/doctor:agents-md embed`, which adds no row.
   - Case: a consumer's `REPO RULES.md` trigger row summary contains a literal `|`; `check` reports A11 `missing trigger row for …` and `embed` prints `NOTHING TO DO` for the router, so the operator has a finding with no repair.
   - Finding class: cross-consumer
   - Scope proof: the two readers are the only implementations of this table grammar (`rg -n "TRIGGER TABLE|INDEX" agents-md-check.cjs agents-md-embed.cjs`), and their row-acceptance conditions differ at `agents-md-check.cjs:809` versus `agents-md-embed.cjs:361`.
   - Affected surface hints: ["A11 router row", "embed addRouterRows", "shared router-table grammar"]

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | The sibling behaviors were compared to the docs that promise them; packet `spec.md` remains unread at this level. |
| checklist_evidence | core | notApplicable | Phased parent has no root `checklist.md`. |
| skill_agent | overlay | notApplicable | No skill or agent definition in scope. |
| agent_cross_runtime | overlay | pass | The two hook checks are the cross-runtime surface; both were executed read-only in iteration 2 and behave as documented on this checkout. |
| feature_catalog_code | overlay | partial | Feature catalog entry not read. |
| playbook_capability | overlay | notApplicable | No playbook file in scope. |

## Integration Evidence

Sibling surfaces named: `codex-hook-approval-check.cjs` and `hook-wiring-check.cjs` are run together by `doctor-setup.yaml:61` (delivery leg) and by `doctor-symlink-check.yaml:60` (hook check), so a divergence between them surfaces in two doctor routes. `agents-md-check.cjs` A11 and `agents-md-embed.cjs` router replacement are the read and write halves of one router contract, called by `/doctor:agents-md check` and `/doctor:agents-md embed` respectively.

## Edge Cases

- A malformed table row is not a shape the presentation contract documents; the finding is scoped to the two readers disagreeing, not to the router format itself.
- The approval check's `--root --json` behavior is reachable only by a mistyped invocation. It is reported as maintainability because no correct invocation reaches it.
- The hook marker could be matched structurally by walking `hooks[].command`, but that is a recommendation, not a new requirement; the docs already say the entry is what matters.

## Confirmed-Clean Surfaces

- `hook-wiring-check.cjs:105-112` handles both nested and top-level event shapes, and tested against this checkout it reports `ok` for all four installed runtimes.
- `codex-hook-approval-check.cjs:131-139` bounds the approval block at the next TOML header, so a `trusted_hash` under another key does not count.
- `agents-md-embed.cjs:377-406` (`addRouterRows`) inserts only missing rows and reports the count per table, matching its doc comment.
- `agents-md-check.cjs:825-833` (`missingRows`) compares the resolved rule path, so a reworded summary is not reported as missing.

## Ruled Out

- **The two hook checks duplicate a whole implementation** — ruled out: they share only the marker constant's text; one checks presence, the other approval state, and their outputs do not overlap.
- **`parseTableRows` and `routerTable` can both be replaced by one helper without behavior change** — not claimed: the embed reader needs line positions for insertion while the check reader does not, so a shared helper must return positions as well as cells. Recorded as a recommendation, not a finding.

## Next Focus

- None: this is the final iteration under `maxIterations: 5`. Synthesis follows.

Review verdict: CONDITIONAL
