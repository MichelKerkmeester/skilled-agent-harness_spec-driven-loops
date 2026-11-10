# Iteration 10: Adversarial re-verification of iterations 1-9 (ORDER / PRESENCE / BREAK / DOC and recommendations)

## Focus
Re-open every ORDER, PRESENCE, BREAK and DOC finding and every recommendation recorded in iterations 1-9, re-read each cited line, and re-run each decisive command — in a throwaway copy where the command deletes anything. Drop or correct anything that does not hold; list what was checked and holds. This is iteration 10 of 10; all six key questions were resolved in iterations 1-9, so this run verifies rather than answers.

## Actions Taken
1. Read `deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`; extracted all 101 class-tagged finding rows across `iterations/iteration-001.md` … `iteration-009.md` (grep `^\| *(ORDER|PRESENCE|BREAK|DOC|OK)` — exit 0, 101 matches).
2. Anchor re-reads (numbered `awk` scans, all exit 0): `hub-router.json` 1-50; `mode-registry.json` 15-120; `SKILL.md` 10-45; `compiled-route.cjs` 75-115; `v4.0.0.4.md` 288-300; `README.md` 798-802, 1382-1386, 1445-1452; `ROUTER.md` 344-348, 553-560, 605-610.
3. Command re-runs in the repo: order-phrase grep (`tieBreak|One Surface Order|then Obsidian|opencode, then`) over `ROUTER.md` → **EXIT:1, 0 matches**; `grep -rin 'obsidian\|webflow' .skilled/commands/doctor` → **EXIT:0, exactly 4 matches**, all in `mcp-mutation-class-manifest.yaml` :80,:81,:82,:87 (MCP-tooling `mcp-obsidian`, not the sk-code surface); `grep -n 'tieBreak'` over `registry-compiler.cjs` → **EXIT:0**, sites :187/:189/:227/:229/:261/:265/:338.
4. Doc anchors re-read (`awk`, exit 0): `parent-skills-nested-packets.md` :170,:218-232; `create-skill-parent-confirm.yaml` :146-147,:171,:240,:262,:467,:489; `create-skill-parent-presentation.txt` :85-86; `create-skill-parent-auto.yaml` :205,:227; `doctor-parent-skill.yaml` :23,:30; `skill-parent.md` :3; canary fixture path confirmed by `find` (`009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`).
5. Throwaway copy created OUTSIDE the worktree with the prescribed recipe:
   `COPY=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i10.ktXa`
   (rsync excluding `node_modules`/`.git`/`specs`/`.worktrees`; empty `specs/`; `git init` + base commit with `core.hooksPath=/dev/null`).
   - First deletion attempt used `.skilled/skills/sk-code-obsidian` and `.skilled/skills/sk-code-webflow` — a **no-op**: the packets are nested at `.skilled/skills/sk-code/sk-code-obsidian` and `.skilled/skills/sk-code/sk-code-webflow`. The no-op pass is itself a datum: with the packets present, `parent-skill-check.cjs` exits 0 ("all hard invariants passed, 0 warnings"). Corrected paths and re-ran.
   - After the correct deletion, in the copy: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` → **EXIT:1**, `FAIL: parent-skill-check — 113 invariant failures, 0 warnings` (3c×2, 5d, 10a-manifest-source `MODE_LEAF_SET_COLLISION`, 12a-router-contract `RRC-006` ×109) — an **exact match** to iteration 4's observation.
   - Fleet gate `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` → **EXIT:1**, `FAIL [H] sk-code`, `MANIFEST_REGENERATION_FAILED … MODE_LEAF_SET_COLLISION` + `RRC-006` lines.
   - Guard `node .skilled/bin/compiled-route-guard.cjs` → **EXIT:0**, "All hubs fresh or excused: serving matches inputs".
   - Front door `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "obsidian plugin db class naming"` → **EXIT:0**, `action:route`, target `sk-code-obsidian` — the deleted packet is still served from the compiled snapshot.

## Findings
| class | claim | evidence | priority |
|---|---|---|---|
| OK | `hub-router.json:7` tieBreak re-read exactly as carried: `["sk-code-quality","sk-code-review","sk-code-skilled","sk-code-obsidian","sk-code-webflow"]` — opencode at index 2 of 5, ahead of both examples; `routerSignals` keys at :31 (webflow), :36 (opencode), :42 (obsidian), each weight 4 | cmd: awk scan hub-router.json 1-50, exit 0; lines 7, 31, 36, 42 | P1 |
| OK | `ROUTER.md` encodes no order anywhere: order-phrase grep returns 0 matches (exit 1); surfaces appear only as scoring class `:346 OBSIDIAN_PLUGIN` and resource lists :554-558, Motion overlay :607 | cmd: `grep -nE 'tieBreak|One Surface Order|then Obsidian|opencode, then' ROUTER.md` → EXIT:1 | P1 |
| OK | The compiler still copies tieBreak verbatim, no ranking code: `buildCompositionRules` :187 (call :338), `buildBundleRules` :227 (call :261), copy :265 | cmd: `grep -n tieBreak registry-compiler.cjs` → EXIT:0 | P1 |
| OK | `mode-registry.json:19` `surfaces` is a declaration list (webflow, opencode, obsidian — not a ranking); webflow mode entry opens at :61; `SKILL.md:40` "exactly three surfaces"; table :34-38, axis paragraph :15 | awk scans mode-registry 15-120 and SKILL.md 10-45, exit 0 | P1 |
| OK | Doctor still names no sk-code surface and no example status: 4 matches only, all `mcp-obsidian` MCP-tooling class (:80,:81,:82,:87); `doctor-parent-skill.yaml` :23/:30 name `packetKind "workflow"\|"surface"\|"transport"` only | cmd: `grep -rin 'obsidian\|webflow' .skilled/commands/doctor` → EXIT:0, 4 matches | P1 |
| OK | `v4.0.0.4.md` :293/:295/:297 re-read — "One Surface Order Everywhere" stated as universal, no example caveat | awk scan 288-300, exit 0 | P1 |
| OK | `README.md` :800 / :1384 / :1447 / :1448-1451 re-read — three shipped surfaces, hand-edit registration steps, no scaffold pointer | awk scans 798-802, 1382-1386, 1445-1452, exit 0 | P1 |
| BREAK (re-observed, exact) | Copy deletion reproduces the carried baseline: `parent-skill-check` EXIT:1 with exactly 113 invariant failures (3c×2, 5d, 10a collision, 12a×109); fleet gate EXIT:1 `FAIL [H] sk-code` + RRC-006; guard EXIT:0 fresh; front door EXIT:0 still serving `sk-code-obsidian` | COPY=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i10.ktXa; commands and exits in Actions Taken item 5 | P1 |
| BREAK (carried, not re-observed) | Addition path: five new FAILs (3d-files, 6b, 5k-alias, 5k-packet, 5k-canary; 113 → 118) | iteration-005.md:24 — not re-run this iteration (wall clock); the scaffold+re-mint cycle is the remaining observation | P1 |
| OK | Scaffold-path anchors re-read: `skill-parent.md:3` `--surfaces`; presentation :85-86; confirm.yaml :146-147 (optional), :171 (bare noun), :240 (`<surface>/{SKILL.md,README.md,changelog/}`), :262 (`canonical_example: .skilled/skills/sk-code`), :467 (generation), :489 (parent-skill-check REQUIRE exit 0); auto.yaml :205/:227 | awk scans, exit 0 | P1 |
| OK | `parent-skills-nested-packets.md` :170 "Canonical live example"; :220-229 table rows #6 (graph-metadata), #7 (SKILL.md), #8 (description.json); no 5k-alias/5k-packet/5k-canary rows | awk scan 218-232, exit 0 | P2 |
| OK | Runtime hint semantics unchanged: export-gated (:82-84), matched-only and validated-then-applied (:99-108), "a call without it serves exactly the compiled order" (:101) | awk scan compiled-route.cjs 75-115, exit 0 | P1 |
| OK | Canary fixture exists at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json` (path confirmed; :117-140 range carried) | cmd: find, exit 0 | P2 |
| OK | `.skilled/bin/compiled-route.cjs` exists (3,481 B) and its head re-read — thin front-door delegate to the single-sourced resolver, legacy sentinel on any failure | `ls` + `sed -n '1,40p'`, exit 0 | P2 |
| R1 (recommendation, anchors hold) | Rank field in `mode-registry.json` surface entries (:61-114) + tieBreak derived when the manifest is minted (`registry-compiler.cjs` :261/:265/:338) | all cited lines re-read this iteration | cost: mint change + canary/hint fixture regeneration; risk: downstream trees serve stale manifests until re-mint | cheaper: docs-only insertion convention — fails (two lists must agree, position unenforced, sibling drift observed) |
| R2 (recommendation, anchors hold) | Shipped-default data edit: examples out of the shipped `tieBreak`/`routerSignals` (`hub-router.json:7,:31,:42`); operator keeps its order via its own ranks | lines re-read | data edit + full-tree re-mint | operator order must be re-expressed | cheaper: leave opencode ahead by position — fails (a user surface still loses every tie; ORDER row) |
| R3 (recommendation, anchors hold) | Doc markers at `SKILL.md:40`, `README.md:800/:1384/:1447`, note `:297` | lines re-read | wording-only | marker with no data change leaves routing unchanged | cheaper: README-only — fails (SKILL.md:40 is the pointer target every other doc defers to) |
| Phase 0 (prerequisite, still unobserved) | Full-tree re-mint verification (the copy recipe excludes `specs/`, so the authored closure cannot resolve) | carried iteration-005.md; not attempted this iteration | one full-tree copy run | gates R1/R2 | cheaper: judge the mint inside the specs-excluded copy — fails (closure unresolvable) |

## Ruled Out
- Re-running the addition half (five new FAILs, 113 → 118): the scaffold + re-mint cycle would exceed the wall clock. Carried, not re-observed (iteration-005.md:24).
- Re-reading the canary fixture :117-140 line range: path confirmed; the range remains carried (time budget).
- Re-asking whether the parent-skill-check failure is deletion-caused: settled directly — exit 0 at baseline with packets present, exit 1 with 113 failures after deletion.

## Dead Ends
- None newly eliminated. The full-tree re-mint observation remains the one open angle (Phase 0, carried from iterations 5-9).

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: none — every re-read anchor matched its carried citation. One method correction recorded: deletion experiments must target `.skilled/skills/sk-code/<packet>`, not `.skilled/skills/<packet>` (the first attempt was a silent no-op).
- Missing dependencies: none.
- Partial success: the deletion baseline and all read anchors were fully re-observed; the addition baseline is carried, not re-run.

## Sources Consulted
- `.skilled/skills/sk-code/hub-router.json` :7, :31, :36, :42
- `.skilled/skills/sk-code/mode-registry.json` :19, :61
- `.skilled/skills/sk-code/SKILL.md` :15, :34-40
- `.skilled/skills/sk-code/ROUTER.md` :346, :554-558, :607
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` :82-84, :99-108
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs` :187, :227, :261, :265, :338
- `.skilled/changelog/skilled/v4.0.0.4.md` :293, :295, :297
- `README.md` :800, :1384, :1447, :1448-1451
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` :80-87; `.skilled/commands/doctor/assets/doctor-parent-skill.yaml` :23, :30
- `.skilled/commands/create/skill-parent.md` :3; `.skilled/commands/create/assets/create-skill-parent-{presentation.txt:85-86,confirm.yaml:146-147,:171,:240,:262,:467,:489,auto.yaml:205,:227}`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` :170, :220-229
- `.skilled/bin/compiled-route.cjs` (head), `.skilled/bin/compiled-route-guard.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`
- Throwaway copy: `/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/s025-dsflash-devin-i10.ktXa` (commands and exits in Actions Taken item 5)
- Lineage files: `iterations/iteration-001.md` … `iteration-009.md` (101 class-tagged rows), `findings-registry.json`, `deep-research-dashboard.md`

## Assessment
- New information ratio: 0.10 — nearly all findings are confirmations of prior claims; new only: the corrected nested-packet deletion path and the copy baseline-pass datum.
- Questions addressed: none (all six resolved in iterations 1-9); this iteration verifies the record rather than answering.
- Questions answered: none.

## Reflection
- What worked and why: re-running the decisive command (copy deletion) rather than re-reading its summary converted the BREAK baseline from carried text into a re-observed fact with an exact failure count (113) — the strongest possible confirmation. The first no-op deletion attempt also proved the value of adversarial method: the path assumption, not the finding, was wrong.
- What did not work and why: the addition half and the canary line range were not re-run — wall clock; both are named as carried so the next reader knows exactly what remains unverified.
- What I would do differently: start the copy experiment first (longest lead time) and batch the anchor scans while rsync runs.

## Recommended Next Focus
None — iteration 10 of 10; all tracked questions are resolved and every load-bearing anchor now holds under re-read. If the loop is extended, the single outstanding observation is Phase 0: a full-tree copy (with `specs/`) re-mint verification, plus the addition-path re-run (five new FAILs, 113 → 118) carried from iteration 5.
