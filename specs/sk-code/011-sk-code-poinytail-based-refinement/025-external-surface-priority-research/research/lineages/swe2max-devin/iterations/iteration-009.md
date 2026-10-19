# Iteration 9: Automation coverage, external-user guide, and the X1-X9 re-challenge

## Focus

Operator-added focus, three parts. (a) For each manual step of adding or removing a surface (registry, router signals and vocabulary, tieBreak position, ROUTER.md maps, hub SKILL.md mode table, description keywords, canary cases, leaf manifest, re-mint plus authored copy), does an existing command already do it or could it by extension. (b) Where the external-user guide should live, what it covers, and which doctor messages point at it. (c) Re-challenge rejected ideas X1-X9 against this lineage's evidence, propose new rejections, and rank recommendations. Interpretation chosen: "automation" is judged against `.skilled/commands/create/assets/create-skill-parent-confirm.yaml` (the `:confirm` twin of `:auto`), `/doctor:update`, `generate-leaf-manifest.cjs`, and `compiled-route-manifest.cjs` — the four callers the focus names.

## Actions Taken

- Read `deep-research-config.json`, `deep-research-strategy.md` (Q12 exact text, exhausted approaches), `research/research.md` in full (F1-F33, R1-R5, X1-X9, P1-P4).
- Read `.skilled/commands/create/skill-parent.md` (router contract, §8 what the workflow scaffolds).
- Grepped `create-skill-parent-confirm.yaml` for `surfaces|tieBreak|canary|leaf-manifest|refresh|re-mint` — 12 hits, zero `canary` hits.
- Read `.skilled/repo-rules/prevent-overengineering.md` for the cost test applied to every option below.
- No copy runs this iteration: the automation question is contract coverage, settled by reading the workflow steps; the copy copies were preserved for a later mutation probe if needed.

## Findings

Format: `| class | claim | evidence | severity |`

| Class | Claim | Evidence | Severity |
|-------|-------|----------|----------|
| OK | `/create:skill-parent update --surfaces` generates each surface as a read-only evidence-base packet — bare-noun folder, `packetKind: surface`, `backendKind: evidence-base`, read-only `toolSurface`, `routingClass: metadata`, with its own SKILL.md, README.md, changelog/ — i.e. the packet and registry steps of adding a surface are covered | `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:467` | P1 |
| OK | The same workflow creates or updates `hub-router.json` with routerSignals for every mode, typed vocabularyClasses, and tieBreak "covering all modes", so router signals and vocabulary are covered | `create-skill-parent-confirm.yaml:462` | P1 |
| BREAK | The tieBreak step has no placement rule — "covering all modes" is the whole constraint. Natural execution appends a new surface last, so it loses every keyword tie to `sk-code-skilled`. This is the gap R1's insertion rule must close, and prose alone does not close it when the scaffold itself writes the order | `create-skill-parent-confirm.yaml:462`; strategy exhausted-approaches "Hand-editing tieBreak as part of the command's normal result — the YAML has no placement rule; natural execution appends at end" (strategy:166-169); research.md R1 row (research.md:132) | P1 |
| OK | The leaf-manifest step is covered and correctly scoped: the workflow runs `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --write [skill_root]` (hub-only) and explicitly bars the fleet-wide `ci-skill-root-metadata.cjs --fix` inside this workflow for blast-radius reasons | `create-skill-parent-confirm.yaml:471`, step_5 assertion at `:497` | P1 |
| BREAK | Canary cases are never written by the command: zero `canary` hits in the whole confirm YAML. This matches the observed `5k-canary` gate exit 1 after `update --surfaces` and explains F18's surviving legs | grep `surfaces\|tieBreak\|canary\|leaf-manifest\|refresh\|re-mint` on `create-skill-parent-confirm.yaml` → 12 hits, none containing `canary`; research.md F18 row (research.md:68); strategy:141-144 | P1 |
| BREAK | No re-mint and no authored-copy step exists anywhere in the add flow: the only refresh the YAML names is the advisor refresh, and the handoff block states "refresh status is always NOT RUN — this command never calls skill_graph_scan or advisor_rebuild itself". `compiled-route-manifest.cjs` mint/refresh is absent from the workflow | `create-skill-parent-confirm.yaml:548`; iteration 8 blocked rows (bare refresh exits 2 usage, requires `--hub` + `--skill-root`) | P1 |
| PRESENCE | ROUTER.md stage-2 maps are never synthesized by the command — the router contract says `active` "is authored later with concrete, resolvable leaf paths and is never synthesized by this command". The ROUTER.md map step stays manual for both add and remove | `.skilled/commands/create/skill-parent.md:106` | P2 |
| OK | `/doctor:update` cannot be the removal path: it treats the sk-code tree as one release unit with authored `hub-router.json`/`mode-registry.json` keep-local and generated manifests regenerated — it aligns releases, it does not perform the inverse checklist (carried from F25, reread at research.md:80) | research.md:80 (F25), citing `.skilled/commands/doctor/scripts/release-update.cjs:520`, `.skilled/commands/doctor/update.md:72` | P2 |
| DOC | The external-user guide belongs inside the root README's existing adaptation block, not a new doc: README's steps are the ones external users follow today (F28: surfaces called "ready", told to replace all three including the native opencode; F29: steps name no tieBreak position, no leaf-manifest regeneration, no canary cases, no re-mint, no pointer to `update --surfaces`) | research.md:88-89 (F28, F29), citing `README.md:800`, `:1384`, `:1447-1451` | P1 |
| OK | X1-X9 all hold under re-challenge; no attempted break produced new evidence. X8 is strengthened: `update --surfaces` was observed to exist and run the registry/router/manifest steps (confirm YAML :462-471), so a surface wizard duplicates a live path. X7 is strengthened: F14's 113-failure exit 1 is the desired fail-closed behavior, and a guard stat leg would duplicate parent-skill-check 3c | research.md:144-152 (X1-X9); `create-skill-parent-confirm.yaml:462-471`; `.skilled/commands/create/skill-parent.md:3` | P1 |
| PRESENCE | Coverage of two steps remains unverified: whether `update --surfaces` rewrites the hub SKILL.md mode table and whether it writes `description.json` keywords for a new surface were not observed in this iteration's grep window — the workflow generates the *surface packet's* own docs (:467) but the hub-table edit was not located | `create-skill-parent-confirm.yaml:240`, `:467` (surface packet docs only) | P2 |

## Options

| Option | What it changes, path:line | Cost | Risk | Cheaper move and why it fails |
|--------|----------------------------|------|------|-------------------------------|
| Enforce placement in the scaffold | Amend the tieBreak clause at `create-skill-parent-confirm.yaml:462` (and the auto twin) from "covering all modes" to "covering all modes; new surface modes are inserted ahead of the existing surface modes" | one ordering clause in a step that already rewrites tieBreak | a mis-ordered result is caught loudly by 5e/5i, so blast is contained | Build nothing fails: natural execution appends last and the surface loses every keyword tie (strategy:166-169). Prose-only R1 fails half the job: the scaffold writes the file itself, so a user who never reads the README still gets the wrong order |
| Auto-generate canary cases on update --surfaces | new writer of the canary contract in the scaffold | new code path emitting `fixtures/canary-cases.v1.json` rows | scaffold-time guesses get baked in as expectations before routing is verified — the fixture pins *observed* order (`.skilled/bin/tests/compiled-route-surface-hint.test.cjs:61-65` via research.md:52) | REJECT (X10 candidate): the documented manual fixture step in the R3 checklist is cheaper and keeps expectations authored from real routes |
| A `/remove:surface` (or surface-wizard) command automating the inverse checklist | new command file + YAML + presentation contract | a whole command family for one known caller class (the external adopter, once) | second path to the same mutations, doubles the contract to maintain | REJECT (X11 candidate): R3's documented checklist plus the corrected repair text makes the path verified (P3 gate) without new machinery; `update --surfaces` already owns the add direction (X8) |
| `compiled-route-guard --fix` copying the served manifest back to its authored path | guard becomes a writer | small code change, large semantic change | copies in the wrong direction whenever the served copy is the stale one — hides the authored-drift signal F19 relies on | REJECT (X12 candidate): the manual copy-back is one documented command inside R3; automating it removes the human decision of which side is authoritative |
| Synthesize ROUTER.md stage-2 maps on update --surfaces | generator must invent resolvable leaf paths | new generator for an authored-later contract | mints empty or wrong maps; the contract explicitly reserves `active` maps for later authoring (skill-parent.md:106) | REJECT (X13 candidate): the authored-later handoff already exists; a generator that guesses leaf paths violates the generated-projection contract ROUTER.md maps operate under (research.md:161-164 blocked row) |
| Consolidate the guide in README | extend `README.md:1445-1452` into the full "adapt sk-code to your stack" section (example marker, deletion recipe with re-mint + authored copy, insertion rule, doctor legs that confirm success) + point `parent-skill-check.cjs:496` (3c) and `doctor-update-apply.yaml:160` at it | edits in one existing section + two message strings | doc drift only | A new standalone doc fails: the README block is where external users already start (F28, F29), and a second doc leaves the wrong steps live beside it |
| Re-mint inside the scaffold | make `update --surfaces` run `compiled-route-manifest.cjs refresh --hub <id> --skill-root <root>` + authored copy | new subprocess step + the specs/ dependency inside a create command | fails outright for an external user who pruned `specs/` (F20): the command would exit non-zero at its last step | REJECT (X14 candidate): printing the follow-up in the existing handoff block (:548) always works; running it ties a create command to an archive-closure dependency |

## Questions Answered

- Q12: Do the rejected ideas X1-X9 still hold, and which new ideas should be rejected? — Yes, all nine hold; four new rejection candidates proposed (X10 auto-canary, X11 removal command, X12 guard --fix copy-back, X13/X14 scaffold-side ROUTER.md-map synthesis and in-scaffold re-mint).
- The automation matrix: covered = packet + registry, router signals/vocabulary, leaf manifest (confirm YAML :462/:467/:471). Not covered = tieBreak placement (:462 no rule), canary cases (zero hits), re-mint + authored copy (:548 NOT RUN), ROUTER.md maps (skill-parent.md:106), removal direction entirely.
- The guide: extends `README.md:1445-1452`; pointer targets are `parent-skill-check.cjs:496` (3c) and `doctor-update-apply.yaml:160`.

## Questions Remaining

- Whether `update --surfaces` rewrites the hub SKILL.md mode table and writes `description.json` keywords for a new surface — not located in this iteration's grep window; one targeted read of the confirm-YAML update branch would settle it.
- Whether a registry-scrubbed copy heals the debug-intent defer (carried from iteration 8; COPY_B probe unrun).
- The carried-forward F20 refinement: `sync` trace + `--check` and the guard's authored-drift leg are the real specs/ dependency, not mint (iteration 3).

## Ranked recommendation proposal (for the final synthesis)

1. R1 — strengthened: make the insertion rule behavioral at `create-skill-parent-confirm.yaml:462` (+auto twin), not only prose.
2. R3 — extended: the documented removal path lands inside the README section, and both doctor surfaces (3c message, repair text) point at it.
3. R4 — example markers at SKILL.md:40, README:800/:1384/:1447, sk-code README table.
4. R2 — example-agnostic tooling (verify-router-sync reads registry; hint test off the live order).
5. R8 (new) — extend the handoff block at `create-skill-parent-confirm.yaml:548` to name the three follow-ups it never runs: canary case, re-mint + authored copy. Cheaper move (running the re-mint in the command) fails on the specs/ dependency (F20).
6. R9 (new) — README adaptation section becomes the single external-user guide (supersedes a standalone doc).
7. R5 — operator decision, unchanged.
R6/R7 content was settled in earlier iterations (Q7, Q8); ordering above reflects severity, not sequence.

## Ruled Out

- Re-running copy probes for contract coverage: reading the workflow YAML settles which steps exist; a copy run would re-observe what iteration 2 already measured (5k-canary exit 1, tieBreak-last).
- Broad `rg` for automation hooks: strategy marks the broad surface-name sweep BLOCKED (strategy:156-159); the targeted grep on the confirm YAML was sufficient.

## Dead Ends

- `/doctor:update` as the removal path — wrong tool class (release alignment, not checklist execution); carried F25.
- `compiled-route-sync --check` as a coverage check — already BLOCKED (served-copy check, not map-coverage; strategy:196-199).

## Edge Cases

- Missing evidence: hub SKILL.md mode-table rewrite and `description.json` keyword handling by `update --surfaces` not verified — recorded as remaining questions, not inferred.
- Contradictory evidence: none new.
- Partial success: all three focus parts addressed; the two unverified coverage cells are the limitation.

## Sources Consulted

- `.skilled/commands/create/skill-parent.md:3-113`
- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:131,146,240,283,334,421,462,467,471,497,548,642` (grep window)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md:44-183` (F1-F33, R1-R5, X1-X9, P1-P4)
- `specs/.../lineages/swe2max-devin/deep-research-strategy.md:49-56,100-203`
- `.skilled/repo-rules/prevent-overengineering.md:45-174`

## Assessment

- New information ratio: 0.70 — the automation coverage rows (OK/BREAK on :462/:467/:471/:548 plus zero-canary) are new anchors; the X1-X9 re-challenge is partially new (same verdicts, new strengthening citations); options and new rejections are new.
- Questions addressed: Q12, the automation matrix, the guide placement.
- Questions answered: Q12.

## Reflection

- What worked: a single targeted grep on the confirm YAML answered most of the automation matrix — presence/absence of step names is decisive contract evidence, cheaper than a copy run.
- What did not work: the grep window could not confirm the hub SKILL.md table and `description.json` keyword handling; recorded honestly rather than inferred.
- What I would do differently: one more read of the confirm-YAML update branch (around :240-340) would have settled the two unverified cells inside budget.

## Recommended Next Focus

Iteration 10 (final): adversarial re-verification per the focus plan — reread the anchors the ranked list leans on (`create-skill-parent-confirm.yaml:462`, `:548`; `README.md:1445-1452`; `parent-skill-check.cjs:496`; `doctor-update-apply.yaml:160`), settle the two unverified coverage cells (hub SKILL.md table, `description.json` keywords in the `--surfaces` branch), and freeze the final X10-X14 numbering and R ordering for the synthesis.

## SCOPE VIOLATIONS

None. No mutation outside the two allowed artifact paths was attempted or needed.
