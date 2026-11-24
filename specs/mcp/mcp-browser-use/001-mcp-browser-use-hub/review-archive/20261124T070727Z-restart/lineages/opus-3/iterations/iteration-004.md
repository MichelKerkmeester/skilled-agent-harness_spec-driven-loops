# Iteration 004 — Maintainability

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1
- Dimension: maintainability
- Operator focus (every phase's shipped work against its goal criteria): this pass checked whether the last phase's shipped work (013) left the hub's version and release history in a state later phases can build on. 007's goal set up the changelog topology. 011 and 013 each claim a packet release.
- Sources: no `steer.md` present.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/SKILL.md:5`, `ROUTER.md:105-107`, `mcp-*/SKILL.md:5`
- `.skilled/skills/mcp-browser-use/changelog/`, `.skilled/changelog/mcp-browser-use/` (symlink topology from 007)
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/changelog/` (latest v1.1.12.0)
- Commit `1a350b1512b` (013) file list for both packets
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:126`, `013-.../spec.md:103`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **013 shipped script and behaviour changes in two packets without cutting a release: it rewrote 011's published v1.0.27.0 note and gave Aside no entry** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:1` -- 013 changed 36 Chrome DevTools files, including `scripts/install.sh` (macOS Chrome detection), `scripts/_utils.sh` (Node minimum 18→20) and `scripts/doctor.sh`. It also changed 21 Aside files, including new behaviour claims in `mcp-aside-devtools/SKILL.md` on the model-flag spelling and browser-profile binding for 1.26.626.1517. The Chrome DevTools version stayed 1.0.27.0, the release the parent spec credits to 011 (`spec.md:126`), and 013 edited that existing note in place. Aside stayed at 1.1.12.0 with no new changelog file (last Aside changelog commit `3395b32f6b1`, 2026-11-22). `parent-skill-check.cjs` still passes 13d because it only compares SKILL.md with the newest entry. A reader of either changelog cannot tell that the installer's behaviour changed after 011, and the version-to-content mapping 007 set up no longer holds.
   Finding class: release-history-drift.
   Scope proof: `git show 1a350b1512b --stat` lists `mcp-chrome-devtools/changelog/v1.0.27.0.md` as modified, not added, and no `mcp-aside-devtools/changelog/` path.
   Affected surface hints: `mcp-chrome-devtools/changelog/`, `mcp-aside-devtools/changelog/`, both `SKILL.md` version fields, `.skilled/changelog/mcp-browser-use/` symlinks.
   Case: an operator on Chrome DevTools 1.0.27.0 from before 013 compares versions to decide whether to re-run `install.sh`. The versions match, so they skip the Node-20 and Chrome-detection fixes.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| feature_catalog_code | pass | Bladebro catalog validator reports 0 violations (iteration 3). Parent-skill-check 13d confirms all three packet versions match their newest changelog entry. |
| skill_agent | notApplicable | The hub ships no agent definitions. Routing is skill-level through the advisor and the hub router. |

## Integration Evidence

- `.skilled/changelog/mcp-browser-use/parent` is a symlink to `../../skills/mcp-browser-use/changelog`, and the mode folders mirror the packet changelogs, so 007's topology is one source of truth and not a duplicate.
- `ROUTER.md:107` now states that `mcp-browser-use` serves compiled routing by default. `compiled-route.cjs:38` registers the hub. 005's "legacy sentinel" verification row is historical, and the live state has moved past it, with the advisor returning `compiledRoute.action: route` (iteration 1).

## Edge Cases

- The duplicated `_utils.sh` helper is a deliberate per-skill copy guarded by a lockstep test. Its drift is already R1-P1-001 and is not re-raised here.
- 005's implementation summary still describes stage two as legacy-served. It is a dated record of that phase, and its claim was superseded rather than wrong at the time, so it is not a finding.

## Confirmed-Clean Surfaces

- Hub version 1.1.1.0 is consistent across SKILL.md, the JSON routing files and the newest hub changelog (parent-skill-check 13a/13b).
- The changelog topology from 007 resolves through symlinks with no dangling link in the listed folders.

## Ruled Out

- Duplicate changelog trees: the `.skilled/changelog/mcp-browser-use/*` entries are symlinks.

## Next Focus

- Dimension: correctness (stabilization)
- Focus area: replay the two active P1s against the current files (`_utils.sh` diff, Bladebro SKILL.md:60). Check parent goal criterion 7 and the 001-research criterion (≥10 iteration records, research.md exists), which no pass has run yet.
- Reason: all four dimensions are covered. A stabilization pass confirms the active P1s and closes the remaining parent criterion.
- Rotation status: all canonical dimensions covered once.
- Required evidence: file:line rereads.

## Verdict

No new P0/P1 this iteration. Two P1 findings from iterations 1 and 2 remain active, so the verdict over active findings is CONDITIONAL.

Review verdict: CONDITIONAL
