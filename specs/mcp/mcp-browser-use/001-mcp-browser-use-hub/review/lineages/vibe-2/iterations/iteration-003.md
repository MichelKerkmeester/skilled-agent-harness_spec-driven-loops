# Review Iteration 003

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: traceability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 3 of 7

## Files Reviewed

- `.skilled/skills/mcp-browser-use/README.md:8` -- hub README frontmatter version
- `.skilled/skills/mcp-browser-use/SKILL.md:18` -- the version-authority rule
- `.skilled/skills/mcp-browser-use/mode-registry.json:3` -- registry version
- `.skilled/skills/mcp-browser-use/hub-router.json:3` -- router version
- `.skilled/skills/mcp-browser-use/description.json:1` -- description version
- `.skilled/skills/mcp-browser-use/changelog/` -- five release files, newest v1.1.3.0
- `.skilled/skills/mcp-browser-use/leaf-manifest.json:1` -- 17 declared leaves
- `.skilled/skills/mcp-browser-use/leaf-scopes.json:1` -- declared leaf scopes
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:62` -- playbook run index
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md:1` -- newest Chrome DevTools run
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:1` -- Bladebro run rows
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/results.csv:1` -- Aside run rows
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/goal.md:1` -- phase 006 criteria and log
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes/goal.md:1` -- phase 008 criteria

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The hub README declares a release that has no changelog entry** -- `.skilled/skills/mcp-browser-use/README.md:8` -- the frontmatter reads `version: 1.1.4.0`, while `mode-registry.json:3`, `hub-router.json:3`, `SKILL.md:6` and `description.json` all read `1.1.3.0`, and `changelog/` holds five files whose newest is `v1.1.3.0.md`. `SKILL.md:18` states the invariant this breaks: "This file's `version` matches the newest entry under `changelog/`. The hub metadata files carry the same value." The only other `1.1.4.0` in the tree belongs to the Aside packet's own changelog, so the hub README carries a value copied from a different skill's release line.
   Finding class: traceability
   Scope proof: every file named is hub-owned and inside the declared review target; the invariant is stated by the hub's own SKILL.md.
   Affected surface hints: `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/SKILL.md`, `.skilled/skills/mcp-browser-use/changelog/`
   Case: a release reader or a version-consistency check reads the hub README, sees `1.1.4.0`, and looks for `changelog/v1.1.4.0.md`, which does not exist; the hub appears to ship a release with no record.

   ```json
   {"type":"claim","claim":"The hub README frontmatter version is 1.1.4.0 while every other hub metadata file and the newest changelog are 1.1.3.0, violating the version-authority rule the hub SKILL.md states.","evidenceRefs":["README.md:8","SKILL.md:18","mode-registry.json:3","hub-router.json:3","description.json:1","changelog/ listing: newest v1.1.3.0.md","rg 1.1.4.0 in hub: only README.md:8 plus mcp-aside-devtools files"],"counterevidenceSought":"Checked whether a v1.1.4.0 changelog exists anywhere in the hub (it does not), whether a validator enforces cross-file version equality (parent-skill-check passes and no version-authority checker exists under .skilled/commands/doctor/scripts or .skilled/bin), and whether the 1.1.4.0 value could be a deliberate unreleased bump (no changelog, no other metadata file carries it).","alternativeExplanation":"The README may have been bumped ahead of a release that was never cut. Rejected as a defence: the hub SKILL.md makes the changelog the version authority, so a bump without a changelog entry is the defect rather than a staging step.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 if the hub README version is restored to 1.1.3.0, or if a v1.1.4.0 changelog is added and the other four metadata files are bumped with it."}
   ```

### P2 Findings

2. **The phase 006 log records the older, greener Chrome DevTools run as the mode's playbook evidence** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/goal.md:1` -- the log's "Mode playbook runs" row reads "Chrome DevTools 4 PASS, 1 FAIL (BDG-008, example.com has no `h1`)", which is the 2026-11-21 run. The newest Chrome DevTools run, `2026-11-22--manual-testing-playbook--remaining-live`, records 4 PASS and 13 FAIL across 17 scenarios. The criterion it supports ("Each of the three mode playbooks records a run dated after 005") is met either way, but the evidence row presents a nearly green playbook while the later run is mostly red.
   Finding class: traceability
   Scope proof: the phase 006 goal and the Chrome DevTools benchmark report are both inside the declared review target.
   Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/goal.md`, `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md`
   Case: a reader checking whether the Chrome DevTools playbook is trustworthy reads the phase 006 log, sees 4 PASS and 1 FAIL, and never learns that 13 of 17 scenarios fail in the newest recorded run.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The hub's version-authority invariant is stated at `SKILL.md:18` and broken at `README.md:8` (finding 1). |
| `checklist_evidence` | partial | Phase 006's mode-playbook row cites the 2026-11-21 Chrome DevTools run while a 2026-11-22 run records 13 failures (finding 2). Phase 008's row counts match the files: Bladebro `results.csv` holds 5 rows at 4 PASS and 1 FAIL, and Aside `signed-in-live/results.csv` holds 15 rows at 10 PASS and 5 FAIL. |
| `skill_agent` | pass | `parent-skill-check.cjs` exits 0 and names the hub; `leaf-manifest.json` declares 17 leaves and all 17 resolve on disk. |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | Carried from iteration 2: the Aside install catalog documents an unpinned path that decision D2 forbids. |
| `playbook_capability` | pass | All three modes carry a `manual-testing-playbook/` with a recorded run: Chrome DevTools `2026-11-22--remaining-live` (17 scenarios), Aside `2026-11-22--signed-in-live` (15 rows), Bladebro `2026-11-22--clickup-real-browser` (5 rows, macOS arm64, Bladebro v4.8.2). The parent criterion "a live Bladebro run on macOS included" is met. |

## Integration Evidence

- `.skilled/skills/mcp-browser-use/leaf-manifest.json` was resolved against disk: 17 declared leaves, 17 present, 0 missing.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live` and `2026-11-21--attach-probe--aside-browser`, both cited by the phase 006 log, exist on disk, so the log's cross-references resolve.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv` holds exactly the 5 rows phase 008 claims, at 4 PASS and 1 FAIL.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/results.csv` holds exactly the 15 rows phase 008 claims, at 10 PASS and 5 FAIL.

## Edge Cases

- The Bladebro and Aside `results.csv` files state that raw output was not retained and that each verdict rests on the operator-approved live run the README records. The parent criterion asks for "a recorded run", not retained output, so this is recorded as a limitation of the evidence rather than a finding.
- `leaf-scopes.json` declares leaf scopes for `mcp-chrome-devtools` only. The file is a per-mode scope declaration and the other two modes declare their leaves through `leaf-manifest.json`, so the asymmetry is recorded as an observation rather than a finding.
- The hub playbook index at `manual-testing-playbook.md:62` names `2026-11-21--manual-testing-playbook--hub-routing--post-review` as "the latest recorded playbook run". That sentence is scoped to the hub's own hub-routing playbook, and the three 2026-11-22 runs belong to the mode playbooks, so it is accurate rather than stale.
- The Chrome DevTools 2026-11-22 run attributes most failures to stale scenario text rather than broken tools. That judgement is the run's own and is not re-litigated here.

## Confirmed-Clean Surfaces

- Phase 008's two numeric criteria match the files exactly: Bladebro 5 rows at 4 PASS and 1 FAIL, Aside 15 rows at 10 PASS and 5 FAIL.
- Every leaf declared in `leaf-manifest.json` resolves on disk.
- Both benchmark report folders the phase 006 log cites exist.
- The hub's `changelog/` holds one file per release from v1.0.0.0 through v1.1.3.0 with no gap.
- `mode-registry.json`, `hub-router.json`, `SKILL.md` and `description.json` agree on `1.1.3.0`.

## Ruled Out

- **Broken cross-references in the phase 006 log.** Both cited Bladebro report folders exist on disk.
- **A missing mode playbook.** All three modes carry a `manual-testing-playbook/` tree with scenario files and a recorded run.
- **A missing Bladebro macOS live run.** The 2026-11-22 Bladebro report records a live run on macOS arm64 with Bladebro v4.8.2, and the 2026-11-21 macOS live folder is also present.
- **A gap in the hub changelog series.** Five files cover v1.0.0.0 through v1.1.3.0 with no missing release.

## Next Focus

- Dimension: maintainability
- Focus area: the hub's documentation structure, the mode packet layout against the `mcp-tooling` sibling, and the changelog and README conventions
- Reason: maintainability is the last canonical dimension and the remaining scope is documentation shape rather than behaviour
- Rotation status: correctness, security and traceability reviewed, maintainability next
- Blocked/productive carry-forward: the version-consistency scan was productive and should be repeated across the three mode packets
- Required evidence: file:line citations from the three mode packets' README and changelog files

Review verdict: CONDITIONAL
