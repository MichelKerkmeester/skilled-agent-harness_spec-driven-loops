# Review Iteration 004

## Dispatcher

- Mode: review, single iteration, LEAF-only (no sub-agent dispatch)
- Lineage: `vibe-1`, sessionId `fanout-vibe-1-1795511024070-2cuwlj`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model deepseek-flash (in-process; the fan-out lineage is its own executor)
- Dimension: maintainability
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration addressed the focus by checking whether the hub's own documentation set still describes the phase 015 release: the README release index, the changelog set, and the version pins the three packets repeat.
- Sources read this iteration: `steer.md` (absent, so no lead ruling applies), `review-scope-files.txt`, `goal.md`, `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/changelog/` (all five entries), `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md`, `.skilled/skills/mcp-browser-use/benchmark/reports/`, and a version-pin sweep across all three mode packets

## Files Reviewed

- `.skilled/skills/mcp-browser-use/README.md:1-90`
- `.skilled/skills/mcp-browser-use/changelog/v1.0.0.0.md:1`
- `.skilled/skills/mcp-browser-use/changelog/v1.1.0.0.md:1`
- `.skilled/skills/mcp-browser-use/changelog/v1.1.1.0.md:1`
- `.skilled/skills/mcp-browser-use/changelog/v1.1.2.0.md:1`
- `.skilled/skills/mcp-browser-use/changelog/v1.1.3.0.md:1-20`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:96-341`
- `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing/README.md:1`
- `.skilled/skills/mcp-browser-use/benchmark/reports/2026-11-21--manual-testing-playbook--hub-routing--post-review/README.md:1`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hub README's release index stops at 1.1.1.0 and omits the two newest releases, including the one that carries the phase 015 fixes** -- `.skilled/skills/mcp-browser-use/README.md:70` -- Section 4 opens "Releases live in `changelog/` with one file per release, named `v[version].md`" and then lists three rows: 1.1.1.0, 1.1.0.0 and 1.0.0.0. `changelog/` holds five entries: 1.0.0.0, 1.1.0.0, 1.1.1.0, 1.1.2.0 and 1.1.3.0. The two missing rows are the newest two, and `v1.1.3.0.md` is the entry that records the phase 015 fixes this review's operator focus names.
   - Case: a reader opens the hub README to find what changed in the current release, sees 1.1.1.0 as the newest entry, and never reaches `changelog/v1.1.3.0.md`, which is where the three-mode bundle fix, the Aside event-listener correction, the `..` guard and the installer digest pin are recorded.
   - Finding class: instance-only
   - Scope proof: `ls changelog/` lists five files and `grep -n "changelog/v" README.md` returns three rows at `:70-72`, so the gap is exactly two rows in one table. The three mode packets each carry their own complete changelog set, so the defect is confined to the hub README.
   - Affected surface hints: ["README.md release index", "changelog/", "SKILL.md version authority line"]

## Traceability Checks

- `spec_code` -- pass, carried from iteration 3. No new criterion evidence was needed this iteration; the README release index is not one of the seven goal criteria, so this finding does not change the criterion results.
- `checklist_evidence` -- pass, carried from iteration 3. Phase 015's own record at `015-fix-follow-up-review-findings/implementation-summary.md` names `changelog/v1.1.3.0.md` as the release that shipped its fixes, which is what makes the missing README row a real gap rather than a cosmetic one.

## Integration Evidence

- `.skilled/skills/mcp-browser-use/changelog/v1.1.3.0.md:1-20` -- the newest entry, titled "mcp-browser-use v1.1.3.0, all three mode ids route together", records the four phase 015 defects and their fixes. It is the release the README index does not list.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:341` -- the recorded run states "The doctor reports v4.8.3 as available. The run stayed on the pinned 4.8.2." The five `v4.8.3` occurrences in the packet are all inside this transcript, so they are honest recording rather than version drift.

## Edge Cases

- A version-pin sweep found `v4.8.3` five times against `v4.8.2` sixty-three times and `bladebro@4.8.2` twenty-three times. Read as drift at first, then resolved: every `v4.8.3` occurrence is inside the macOS live run transcript, which explicitly says the run stayed on the pin. Not a finding.
- The `bdg` pin (`browser-debugger-cli@0.6.10`, 36 occurrences) and the Aside pin (`Aside 1.26.626`, 45 occurrences) are each single-valued across the packet, so neither carries drift.
- The README's `## 5. VERIFICATION` section names `parent-skill-check.cjs` and `validate_document.py`. Both are read-only checks, and the first was run in iteration 3 and passed, so the section's instruction is accurate.

## Confirmed-Clean Surfaces

- All five hub changelog entries exist and each carries a `version` frontmatter value matching its filename.
- The three mode packets each carry a complete changelog set with no gap between the newest file and the packet `SKILL.md` version, which `parent-skill-check.cjs` `13d-packet-version` confirmed in iteration 3.
- The hub README's mode table, navigation table and tie-break sentence all match `mode-registry.json` and `hub-router.json`.

## Ruled Out

- "Bladebro version drift between v4.8.2 and v4.8.3": ruled out, every `v4.8.3` occurrence is inside the recorded run transcript that says the run stayed on the pin.
- "`bdg` or Aside version drift across the packet": ruled out, each pin is single-valued.
- "The README verification section names a stale checker": ruled out, `parent-skill-check.cjs` exists and passed in iteration 3.

## Next Focus

- Dimension: correctness, second pass
- Focus area: the phase 015 fixes read as behaviour rather than as text -- the three-mode bundle rule in the compiled router, the Aside capability-matrix correction, and the advisor id-noun change's effect on the five probe prompts
- Reason: the first correctness pass read the registries; the phase 015 fixes are behaviour changes in the router and the advisor that a second pass should exercise rather than re-read
- Rotation status: all four dimensions covered once; this is the first second-pass iteration
- Blocked/productive carry-forward: productive -- running the reach instead of arguing it (iteration 3) is the method for this pass too
- Required evidence: the canary case or live advisor output that exercises each phase 015 fix

Review verdict: CONDITIONAL
