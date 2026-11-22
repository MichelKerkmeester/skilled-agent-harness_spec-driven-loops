# Iteration 004 - Maintainability

## Dispatcher
- Lineage: claude2, session fanout-claude2-1795299580084-7g6zan, generation 1
- Dimension: maintainability
- Review focus coverage: checked the docs the hub-scaffold and Bladebro commits added for durable wording, the three-way vocabulary split between `mode-registry.json`, `hub-router.json` and `graph-metadata.json` that the routing commit carried up to the advisor, and the nested sub-track docs from the system-spec-kit commit against the reader code.
- Sources: steer.md absent.

## Files Reviewed
- `.skilled/skills/mcp-browser-use/SKILL.md`, `ROUTER.md`, `README.md` (label scan)
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:23,33,61,112-116`, `README.md:33`, `references/cli-reference.md:78`, `references/mcp-wiring.md:61`
- `.skilled/skills/mcp-browser-use/graph-metadata.json` (intent_signals, intent_signals_generated)
- `.skilled/skills/mcp-browser-use/mode-registry.json` (mode aliases)
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs`, run with `--check --hub mcp-browser-use`
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:127` (diff)
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md:67-119`
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:131,277-286`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` (symlink coverage grep)

## Findings by Severity

### P0 Findings
- None.

### P1 Findings
- None.

### P2 Findings
1. **The live Bladebro skill names a spec phase number as the owner of the install gate** -- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:116` -- R-SEC-3 says "Installation remains an operator stop-for-yes owned by 006". `006` is the verification child of this packet. A runtime reader loading the skill has no way to resolve it, and the label stops meaning anything once the packet closes. The R-SEC-1..3 ids are defined in the same file, so they are durable. The phase number is the one ephemeral label.
   Finding class: instance-only
   Scope proof: file added by the Bladebro commit.
   Affected surface hints: `mcp-bladebro/SKILL.md` R-SEC-3 sentence
   Case: an agent following R-SEC-3 in a later session cannot tell who owns the install yes, because "006" refers to a closed spec phase.

2. **The folder-structure reference promises a symlink diagnostic that level-2 sub-tracks never emit** -- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:127` -- The doc states "A symlinked sub-track is skipped with one diagnostic in both the working-tree and the commit view". The reader reports a symlink only at level 1. Inside a level-1 sub-track, the working-tree view skips a symlinked entry silently (`track-roots.mjs:131`, `if (entry.isSymbolicLink() || !isDeclaredSubTrack(...)) continue;`). The commit view reports `symlinked folder skipped` only when `depth === 1` (`track-roots.mjs:284`), and at level 2 it drops the link through the `sub.type !== 'tree'` branch. The two views agree with each other; the reference describes behaviour that only level 1 has. `nested-subtrack.vitest.ts` has no level-2 symlink case. Its only `symlinkSync` links `.skilled` into the fixture root (line 290).
   Finding class: instance-only
   Scope proof: both the doc sentence and the depth-gated branches were written by the nested sub-track commit.
   Affected surface hints: `folder-structure.md` sub-track paragraph, `track-roots.mjs` readWorkingTreeSubTracks/readCommitSubTracks, `nested-subtrack.vitest.ts`
   Case: a symlinked folder inside `specs/mcp/mcp-browser-use/` disappears from the sweep with no diagnostic, although the reference says one is printed.

## Traceability Checks
- feature_catalog_code: partial. `track-root-children-lists.md:67-82` matches the reader's two-level rule and the `NESTED_TOO_DEEP` text. The folder-structure reference's symlink sentence (finding 2) does not match.
- playbook_capability: pass. The hub playbook's seven scenarios match the seven canary-backed admission cases reported in iteration 3.

## Integration Evidence
- `generate-router-intent-signals.cjs --check --hub mcp-browser-use` printed `declared= 50 signals= 75 missing= 0 orphans= 0` and `RESULT: PASSED` (exit 0). The advisor-facing `graph-metadata.json` cannot silently drift from `hub-router.json`. The seven hub keywords absent from graph-metadata are discovery-only or spelling variants: `browser automation`, `automate the browser`, `web browser`, `chrome-devtools`, `chrome_devtools_live`, `chrome live manual`, `core web vitals`.

## Edge Cases
- The parent-spec rule "a track or a level-1 sub-track holds numbered packets or declared sub-tracks, never both" is not enforced by the reader: `readWorkingTreeSubTracks` pushes both kinds into `children`. Whether `validate.sh` or the sweep enforces it was not traced within budget, so it is recorded here as unverified rather than as a finding.

## Confirmed-Clean Surfaces
- Vocabulary drift between hub-router and the advisor graph is gated by a checker that passes.
- `mode-registry.json` aliases are a sparse advisor-facing subset, and the compiler states that live scoring reads only `hub-router.json` (`registry-compiler.cjs:93-98`).

## Ruled Out
- Duplicated keyword lists drifting between hub-router.json and graph-metadata.json: ruled out by the passing drift check.

## Next Focus
- Dimension: correctness (cross-cutting second pass)
- Focus area: system-spec-kit writers touched by the nested sub-track commit (`create.sh`, `relocate.mjs`, `archive.sh`, `validate.sh`, `repair-derived.cjs`), and the advisor scorer changes (`explicit.ts`, `skill_advisor.py`).
- Reason: every dimension has had one pass; the last iteration takes the highest-risk unreviewed code.

Review verdict: CONDITIONAL
