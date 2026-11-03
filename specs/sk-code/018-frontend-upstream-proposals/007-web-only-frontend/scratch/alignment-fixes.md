# Alignment fixes, web-only pass

`/local-skilled-alignment` ran over the three web-only commits (`1f9a9dea41~1..9cbd8540e8`, 62 files), from a worktree copy of the harness, with the four lanes and the critic on `opencode-go/deepseek-v4.1-flash`. Battery: 79 pass, 0 fail. Probes: 6 pass, 1 fail. The critic kept 18 findings (7 P1, 11 P2), overturned 3 as duplicates, rated 3 pre-existing, raised D-03 to P1 and upheld probe P06. Reports: `alignment-runs/run4-report.md` and `alignment-runs/recheck4.md`.

## Fixed

| Finding | Fix | Commit |
|---|---|---|
| A-001, C-01 | Root README lines 831 and 1576 no longer list "native layout" | `6ab8aa0687` |
| A-002, A-003, C-03 | Replay counts read 66 gold rows and `hub=sk-code gold=9` in both catalog entries and the sk-create-skill changelog | `6ab8aa0687` |
| B-R1, D-02 | The frontend packet's SKILL.md and README name the alone route, where the acting agent applies the guidance | `6ab8aa0687` |
| B-R2 | The two-axis catalog entries say a surface is bundled when a workflow mode scores and routed alone when none does | `6ab8aa0687` |
| C-02, C-04, C-05, C-06 | Hub authoring guides and the review README list all three surfaces, in tie-break order where order matters. Rated pre-existing to the range, fixed because they describe this packet's surface | `6ab8aa0687` |
| C-07 | Seven new changelog entries carry their spec-folder blockquote. Recheck "still open" is a false positive: the old anchor text is part of the new | `6ab8aa0687` |
| D-01 | The surface-hint test comment says web and Figma phrases | `6ab8aa0687` |
| D-03, PRB-01 (P06) | `WEB_A11Y` gains `broken tab order` and `accessible name`; the form-labels prompt routes to the frontend surface; reach stays `outranked=0` on every hub; all seven probes pass | `6ab8aa0687` |
| E-004 | The v1.0.1.0 alias bullet names the two aliases it added; `figma frame check` shipped in v1.0.0.0 | `6ab8aa0687` |
| E-001, E-002 | The parent spec records both React Native decisions and the web-only shape | phase docs commit |
| E-005 | AC-001's command names the six removed intents, so it prints nothing, as its Then clause says | phase docs commit |

## Refuted

| Finding | Why |
|---|---|
| E-003 | The 006 to 007 handoff row states what held when phase 006 handed over, so it cites phase 006's final gates. Phase 007's own gates are its acceptance evidence |
