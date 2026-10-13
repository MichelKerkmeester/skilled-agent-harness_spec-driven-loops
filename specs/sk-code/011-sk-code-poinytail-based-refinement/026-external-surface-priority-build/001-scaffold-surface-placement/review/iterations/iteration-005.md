# Deep Review — Iteration 5 (correctness, final pass)

## Dimension

correctness — final confirmation pass on commit `17bb342b1c`. All four dimensions were already covered (correctness, security, traceability, maintainability); this pass re-verified the changed text against spec R1/R8 with fresh evidence and tested one direction earlier iterations had asserted rather than proven: the manual manifest fallback's copy direction.

## Files Reviewed

- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423, 500-501` — step_4 insertion rule; both step_6 follow-up lines
- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:462, 547-548` — the same three line groups
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:12, 87, 290, 331` — version, `tieBreak` table row, tie-break paragraph, validation list
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:12, 224` — version and stage-one tie-break checklist row
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5, 322` — release version and the `tieBreak` checklist line
- `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.4.0.md:1-31` — release entry
- `.hermes/skills/sk-create-skill/SKILL.md:5` — generated copy version
- `.skilled/scripts/git-hooks/pre-commit:589-593` — the hook's own fix text for a blocked re-mint
- `.skilled/bin/compiled-route-manifest.cjs:29-30, 788-799` — `refresh` verb and options
- `.skilled/bin/lib/compiled-route-layout.cjs:50-53` — `AUTHORED_PROGRAM_DIR`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md:73-74, 104-107` — R1/R8 and REQ-001/REQ-004

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

None.

### P2 — Suggestions

No new P2 this iteration. The two open P2s remain active and were re-checked as still applicable to the reviewed commit; both are advisory follow-ups, not regressions:

- **R1-P2-001** (`.skilled/commands/create/assets/create-skill-parent-auto.yaml:423`) — the insertion rule does not define the order among multiple **new** surface modes added in one `--surfaces` run. The rule text is unchanged by this pass; still a wording gap, not a wrong order.
- **R4-P2-001** (`.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py:7-13`) — the new step_4/step_6 line groups sit outside the twin-parity guard. The twins are currently byte-identical (verified below), so this is guard debt, not live drift.

### Verified correct this iteration

- **R1 four-site phrase.** The step_4 lines `[SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:423]` and `[SOURCE: .skilled/commands/create/assets/create-skill-parent-confirm.yaml:462]` are byte-identical; `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:290]` and `[SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:224]` state the same rule. All four carry the exact phrase `ahead of the existing surface modes` (REQ-001).
- **Twin parity of all three changed line groups.** The step_6 lines extracted from both twins are byte-identical, as is the step_4 rule (from the commit diff).
- **R8 both lines present and literal.** The canary line names `canary-cases.v1.json`; the commit line names `install-git-hooks.sh` (REQ-004). The fallback flags are valid: the tool's usage line documents `refresh --hub <hub-id> --skill-root <path>` `[SOURCE: .skilled/bin/compiled-route-manifest.cjs:29]`.
- **Fallback copy direction (new evidence).** `[SOURCE: .skilled/scripts/git-hooks/pre-commit:589]` prints the identical fix for a blocked re-mint — `refresh --hub … --skill-root …`, then "copy the runtime manifest over its authored copy". This matches the follow-up prose (compiled `013-live-activation` manifest copied over the authored `specs/sk-doc/z_archive/...` twin), so the instruction is correctly directed. Iterations 3-4 had asserted this direction; it is now verified against tooling.
- **Schema self-consistency.** The new sentence at `:290` does not contradict the `tieBreak` table row at `:87` (workflow modes first, surface packets after) or the validation list at `:331` (every mode exactly once).
- **Release surface.** `SKILL.md:5` = changelog frontmatter `:10` = `.hermes/skills/sk-create-skill/SKILL.md:5` = `1.5.4.0`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | core | pass | R1 four sites + R8 both lines verified against `spec.md:73-74, 104-107` this iteration; REQ-001/REQ-004 directly checked; REQ-002/REQ-003 carry the builder copy-run proof (P8) |
| checklist_evidence | core | deferred | T012 owns the packet ledger fill and strict validate (SL-013 rationale unchanged; review runs before T012) |
| skill_agent | overlay | pass | carried iterations 1-2; no additional `tieBreak` writer found in this pass |
| agent_cross_runtime | overlay | pass | Hermes copy at 1.5.4.0; carried iterations 1-2 |
| feature_catalog_code | overlay | notApplicable | carried iteration 1 |
| playbook_capability | overlay | notApplicable | carried iteration 1 |

## Verdict

PASS — zero P0 and zero P1 this iteration. The two remaining P2s (R1-P2-001, R4-P2-001) are advisory and do not gate. The reviewed commit satisfies spec R1/R8 in full, including the manual manifest-fallback direction, now confirmed against the hook's own printed fix.

## Next Dimension

None — iteration 5 of 5 reached; the dimension queue (correctness, security, traceability, maintainability) is exhausted and the stop policy `max-iterations` is satisfied. No P0 was ever recorded.

Review verdict: PASS
