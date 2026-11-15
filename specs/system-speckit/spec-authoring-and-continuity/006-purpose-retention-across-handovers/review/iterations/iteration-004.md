# Review Iteration 004

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`; execution=single_review_iteration.
- Run: 4 of max 5 (`stopPolicy=max-iterations`), sessionId `2026-11-14T11:01:50.956Z`, generation 1, lineageMode `new`.
- Focus: `maintainability`, the last uncovered dimension.
- Operator focus: sk-code and sk-doc (`create-skill`, `create-command`, `create-readme`) alignment, and whether a manual-testing playbook, feature catalog, README or the root `README.md` needs updating.
- Iteration number: JSONL-derived 4 (three prior `type: "iteration"` records) and the dispatch's 4 agree.
- Budget profile: `scan`; 8 evidence calls before the write phase.
- Scope: the 34 non-spec files in the range diff; `specs/` is cross-reference only.

## Dimension

`maintainability`: documentation quality, comment hygiene, repeated logic that behaves differently, hidden coupling, API-boundary clarity and test maintainability, read with the operator focus above.

## Files Reviewed

| Surface | Lines read | What it showed |
| --- | --- | --- |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts` | 1-185 | The whole new reader: constants, paragraph extraction, resolution, formatters. |
| `.skilled/skills/system-spec-kit/runtime/lib/README.md` | 118 | The index row added for the reader. |
| `.skilled/skills/system-spec-kit/runtime/lib/MODULE-MAP.md` | 136 | The module map row for the reader. |
| `.skilled/skills/system-spec-kit/runtime/lib/spec/README.md` | 31, 52-54 | The folder module table and the exported-function table. |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/README.md` | 28 | The `packet_purpose` writer-owned field description. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | 20 | The compaction hook's purpose/problem row. |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/README.md` | 47 | The Pi compaction hook's purpose/problem row. |
| `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json` | 9-11 | The `phase-parent.spec.md.tmpl` version bump. |
| `git show` documentation diff for `eaba5ab89e 3d237cd97a f0d8c03036 0837fcd5a2 191ce39bad 43bff36f9d e102ba83be f9f96bdc39 e129af3719 fce8b5d81c` | doc paths only | Every README/MODULE-MAP change in the range, with hunk line numbers. |
| Comment-hygiene grep over `.skilled/skills/system-spec-kit/runtime` (`*.ts`, `*.cjs`) | whole tree | Three matches, all fixture paths in unrelated tests. |

Full README bodies were not re-read: the added rows and their line numbers come from the range diff, and the frontmatter is not touched by the range.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The two active P1s, `R1-P1-001` and `R1-P1-002`, remain open with their iteration-1 claim packets and unchanged evidence.

### P2 Findings

1. **The library index still scopes `packet-purpose.ts` to the compaction hop** -- `.skilled/skills/system-spec-kit/runtime/lib/README.md:118` -- the row added by `0837fcd5a2` says the module reads a purpose "for the post-compaction context", but `191ce39bad` later made the same module the source of `packet_purpose` on every continuity write, so the index under-describes the module's consumers.
- Case: A maintainer who wants to find every consumer of the purpose reader reads the library index, sees only the compaction use, and misses the continuity-writer path unless they open `lib/continuity/README.md`.
- File: `.skilled/skills/system-spec-kit/runtime/lib/README.md:118`
- Evidence: the index row was added in `0837fcd5a2` and not touched by `191ce39bad`; that later commit updated `lib/continuity/README.md:28` to say `packet_purpose` is "refreshed on every continuity write" from `lib/spec/packet-purpose.ts`. No other range file rewords the index row.
- User impact: documentation-only. Runtime behavior is unchanged; readers get an incomplete consumer map.
- Finding class: instance-only
- Scope proof: the `git show` documentation diff over all ten commits touches these module docs in `0837fcd5a2`, `191ce39bad` and `fce8b5d81c` only; the index row appears in the first and not the second.
- Affected surface hints: ["runtime/lib index", "continuity writer documentation", "post-compaction recovery docs"]
- Recommendation: name both readers in the row, e.g. "Reads a packet's one-sentence purpose for the post-compaction brief and the continuity envelope."

## Traceability Checks

| Protocol | Level | Status | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | fail | `R1-P1-001` (relaunch rule narrower than the hop rule) and `R1-P1-002` (Pi skips the nearest-spec walk-up) stay active; the doc row does not change code-spec parity. |
| `checklist_evidence` | core | partial | Changed assertions were inspected only; the suite is not executed in this read-only pass, and `nudge.test.cjs:109` still does not assert the wider heading shapes. |
| `skill_agent` | overlay | notApplicable | No skill definition or canonical agent file is in the 34-file target. |
| `agent_cross_runtime` | overlay | fail | Claude's compaction walks up to the nearest `spec.md`; Pi's calls the reader on the raw folder (`R1-P1-002`). |
| `feature_catalog_code` | overlay | partial | Catalog entries exist for the compaction and relaunch hops but omit the purpose/problem rows (iteration-3 evidence; carried under `R2-P2-002`). |
| `playbook_capability` | overlay | partial | No manual-testing playbook scenario names the purpose or problem line (carried under `R2-P2-002`). |

## Integration Evidence

- The three resume surfaces and the handoff rule still carry all three labels and the 300-character cut: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`, `speckit-resume-presentation.txt:118`, `handoff.md:135` (swept in iteration 3, not re-entered).
- Runtime API surface: `.skilled/skills/system-spec-kit/runtime/api/index.ts` does not export the purpose/problem formatters; the deep-import gap is already active as `R3-P2-001`.
- Local module docs updated with the feature: `lib/MODULE-MAP.md:136`, `lib/spec/README.md:31,52-54`, `lib/continuity/README.md:28`, `hooks/claude/README.md:20`, `hooks/pi/README.md:47`.
- Template registry: `templates/spec-kit-docs.json` bumps `phase-parent.spec.md.tmpl` to `v2.3` in the same commit that changes the template.
- Not checked: vitest execution and a manual-testing playbook run. Both are out of bounds for this read-only pass.

## Edge Cases

- The root `README.md`, the manual-testing playbook and the feature catalog sit outside the 34-file code target and are assessed only under the operator focus. The gap is already active as `R2-P2-002`; no duplicate is filed.
- README frontmatter and section order are unchanged in the range, so `sk-doc` create-readme frontmatter compliance is not newly assessed; only the added rows were reviewed.
- The new P2's line number comes from the added hunk in the range diff; the row text is read from that diff, not a separate full-file read.
- The Pi walk-up P1 remains active: the hook README now describes the intended shared behavior while the Pi implementation still differs, so docs and code agree on intent but not on implementation.
- The comment-hygiene grep returned three fixture-path matches in unrelated tests, none in the changed comments.

## Confirmed-Clean Surfaces

- `packet-purpose.ts`: 185 lines; exported functions are short, reads fail soft, no shared mutable state, named constants for the 300-character cap, ancestor depth and scaffold sentence, and no artifact-label comments.
- `lib/MODULE-MAP.md`, `lib/spec/README.md`, `lib/continuity/README.md` and both hook READMEs describe the new reader, the problem formatter and the continuity field.
- Comment hygiene: no phase, packet or finding id in the changed comments.
- Duplication: the per-hop label vocabulary is the D1-mandated contract for independently loaded prompt surfaces; the extraction logic is single-sourced in `packet-purpose.ts`, so no new DRY finding was filed.
- Template registry and template move together.

## Ruled Out

- `sk-doc` create-readme frontmatter/structure regression: frontmatter is untouched in the range and the added content follows the existing tables.
- A new feature-catalog/playbook/root README finding: duplicate of active `R2-P2-002`.
- API-boundary duplication: already active as `R3-P2-001`.
- Surrogate-pair purpose cut: already active as `R1-P2-001`.
- Path traversal, recovered-payload sanitizer bypass, shell injection, secret exposure and state transition: exhausted directions from iterations 1-3.
- Command-label parity: swept in iteration 3.

## Quality Gate Evidence

Evidence gate: pass, the new P2 carries file:line and observed diff evidence. Scope gate: pass, the target stayed read-only and only review state was written. Coverage gate: pass, all four dimensions are now covered.

Rule sources: none. Overrides: none. Refused: none. Ignored: none. Conflicts: none

## Verdict

Active findings at this iteration: 0 P0, 2 P1 (`R1-P1-001`, `R1-P1-002`), 5 P2 (four carried plus `R4-P2-001`). No P0 exists, but an active P1 remains, so the verdict is CONDITIONAL.

## Next Focus

- Dimension: none remaining; iteration 5 is the terminal max-iterations pass.
- Focus area: recheck `R1-P1-001` and `R1-P1-002` against the final code, confirm `R4-P2-001`, and let the reducer refresh the registry.
- Reason: all four dimensions are covered; convergence telemetry is advisory under `max-iterations`.
- Rotation status: complete.
- Blocked/productive carry-forward: carry all six prior findings plus `R4-P2-001`; do not re-enter the swept directions.
- Required evidence: the final `nudge.cjs` and `session-compact-context.ts` purpose rules; test evidence only if the loop permits execution.
- Recovery note: none.

## Next Dimension

None. All four dimensions are covered; iteration 005 is the terminal pass.

Review verdict: CONDITIONAL
