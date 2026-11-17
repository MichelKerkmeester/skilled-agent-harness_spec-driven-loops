# Review Iteration 006

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-2`, pass two)
- Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — cross-reference sweep over every open finding and the remaining changed exits
- Operator review focus addressed this iteration: the sweep re-reads every open finding's anchor line, proves the hook diagnostics claim at its exit points, and states the holdout counts without reading holdout text.
- Budget profile: `adjudicate` (9 analysis actions)

## Files Reviewed

- `.opencode/plugins/system-skill-advisor.js:657`, `:669`, `:1704` — orphaned summary and the status field
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:144-150`, `:250-255` — stderr cap and both handlers
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:100` — the changed health-record sentence (withdrawn finding)
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:296-465` — every exit that emits a diagnostic record
- `runtime/scripts/routing-accuracy/command-prompts.jsonl` and `holdout-prompts.jsonl` — line counts only
- Test files already read in iterations 1-5; no new read needed for the sweep

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The five open P2 findings stand as recorded; no new defect and no severity movement.

## Open Finding Re-Check

- **`iter2-P2-inert-bounded-summary-option`** (`.opencode/plugins/system-skill-advisor.js:379`) — re-read: `boundedCompiledRouteSummary` is resolved at `:379-395` from the option or `SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING`, documented at `:1080` as "Bound long compiled-route target lists", and reported at `:1704`; the transform block that consumed it is gone (`:1582-1590`). No reader remains. P2 stands.
- **`iter2-P2-stderr-cap-hides-busy`** (`.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:144`) — re-read: `capOutput` drops bytes after `MAX_OUTPUT_CHARS` on both streams, and the busy marker is read from the accumulated `stderr`. The new test asserts the lost marker. P2 stands.
- **`iter4-P2-advisor-recommend-stale-line-refs`** (`.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33`) — re-read: the five citations stay wrong against `advisor-tool-schemas.ts:295/298/321` and `handlers/advisor-recommend.ts:630-632/705-707`. P2 stands.
- **`iter5-P2-orphaned-route-summary`** (`.opencode/plugins/system-skill-advisor.js:657`) — re-read: `compiledRouteSummary(data)` still runs per delivered brief and the `metadata.compiledRouteSummary` field at `:669` has no reader in `.opencode`. P2 stands.
- **`iter5-P2-field-pass-through-untested`** (`.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:49`) — re-read: the test's command-bearing case sends no `command`/`policy`/`ownerSkillId`, and the plugin tests assert none of the four fields. P2 stands.

No finding is a P0 or P1, so the verdict stays PASS with advisories.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | pass | Every doc claim that changed in this area was checked against its code line; only the citations in finding 3 are wrong. |
| `checklist_evidence` | core | notApplicable | No checklist row governs this code pass. |
| `skill_agent` | overlay | notApplicable | No agent definition in this area. |
| `agent_cross_runtime` | overlay | pass | The six named runtimes resolve to the shared handler (claude/codex/cursor/devin/pi/dsh) or the plugin; both command-label paths carry the same fields. |
| `feature_catalog_code` | overlay | partial | The catalog leaf matches in substance; finding 3 is its citation drift. |
| `playbook_capability` | overlay | pass | The validation playbook's health-record sentence holds at every hook exit (see below). |

## Integration Evidence

- Hook exits that emit a health record: the kill-switch/prompt-gate branches (`user-prompt-submit.ts:302`, `:314`, `:330`), the delivered-brief branch (`:416`), the unhandled-exception branch (`:451`), and the fallback branch (`:514`). Each precedes its `return`, so every prompt path persists one record.
- Holdout hygiene counts: `command-prompts.jsonl` holds 176 rows and `holdout-prompts.jsonl` holds 66. No file in this area opens either fixture; no row text was read or printed in this lineage.
- The `.d.mts.map` artifacts are generated declaration maps; the four `yes` files were not read line by line, as recorded in iteration 5.

## Edge Cases

- **No new edge case.** The sweep found the same two removal residues and the same documentation offsets already recorded; nothing new was admitted.
- **Synthesis cycle.** Convergence at this iteration (no new findings, all four dimensions covered) means the next phase is synthesis, not a seventh iteration.

## Confirmed-Clean Surfaces

- The child-session downgrade is still the only reader of `AI_SESSION_CHILD` in the advisor (`render.ts:529`); tests stub it in both golden files and the fallback envelope test, and the parity case compares it with `isChildSession`.
- The plugin's mapper and the hook fallback mapper agree on the four forwarded fields; the gap is test coverage, not behavior.
- The subprocess cap is the only bounded-output change in this area and both streams pass through it.
- The reader layer's containment is enforced before every read (iteration 3).

## Ruled Out

- **Any of the five open findings is a P0/P1.** Each is advisory: no data loss on a default path, no security boundary crossed, and each has a named concrete input. Verdict PASS.
- **The hook's health record misses a prompt path.** All six emit sites precede their returns, so skipped, delivered, fallback and exception paths all persist.
- **A seventh iteration would find something new.** The remaining unread artifacts are generated declaration maps and tests already read; the changed set is exhausted.

## Next Focus

- Dimension: synthesis
- Focus area: compile the lineage report from the registry and the six iterations; no further code review.
- Reason: convergence reached with all four dimensions covered and five active P2 advisories.
- Rotation status: all four dimensions complete.
- Blocked/productive carry-forward: none.
- Required evidence: the reducer-owned registry, the six iteration files and their deltas.

Review verdict: PASS
