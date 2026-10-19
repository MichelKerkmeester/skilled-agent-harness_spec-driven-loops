# Iteration 2: Q9 — does /create:skill-parent update --surfaces perform the five steps a hand-added surface misses?

## Focus

Q9 / F18 re-verification. Read `.skilled/commands/create/skill-parent.md` and `assets/create-skill-parent-auto.yaml`, then observe in two throwaway full-tree copies: (a) a minimal hand-add of stand-in surface `sk-code-myapp` and its `parent-skill-check` failures; (b) a literal execution of the update `--surfaces` YAML steps, recording which legs it fixes, which it leaves, and where `tieBreak` lands.

## Actions Taken

1. Read `skill-parent.md` (router contract, one-identity invariant, ROUTER.md state classification), `create-skill-parent-auto.yaml` (operation_router output scopes, step_4 generation, step_5 gate), and the `3d`/`5k`/`6b`/`10` legs of `parent-skill-check.cjs` (lines 503-736, 1184-1405, CANARY_FIXTURE_ROOT at line 139).
2. Copy1 `$X1=/var/folders/.../r2-swe2max-devin-i2a.noFS` (APFS clone of prepared base): minimal hand-add — `mkdir sk-code-myapp` + bare `SKILL.md`, registry entry cloned from `sk-code-webflow`, `routerSignals` + two `vocabularyClasses` + `tieBreak` append in `hub-router.json`; no README/changelog, no hub SKILL.md row, no description.json keyword, no canary fixture, no leaf-manifest refresh. Ran `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`.
3. Copy2 `$X2=/var/folders/.../r2-swe2max-devin-i2b.*` (fresh clone): literal update `--surfaces` — same registry/router edits plus README.md + `changelog/`, hub SKILL.md mode-table row, description.json keywords (`sk-code-myapp`, `myapp`), then `generate-leaf-manifest.cjs --write` (exit 0, hash `87d3cee…`), then `parent-skill-check` (exit 1), then `compiled-route-sync --check` (exit 0, "all 55 served copies match").

## Findings

| class | claim | evidence | sev |
| --- | --- | --- | --- |
| BREAK | F18 undercounts: a minimal hand-add fails NINE doctor legs, not five — the expected `3d-files`×2 (README.md, changelog/), `6b` (mode absent from hub SKILL.md table), `5k-alias`×2, `5k-packet`, `5k-canary`, PLUS unlisted `10b-byte-drift` (leaf-manifest stale) and `10d-reachability` (registry↔manifest mismatch: "missing from manifest: [sk-code-myapp]"). Corrects/extends F18. | copy `$X1`: `FAIL: 3d-files … README.md`, `FAIL: 3d-files … changelog/`, `FAIL: 6b … [sk-code-myapp]`, `FAIL: 5k-alias`×2, `FAIL: 5k-packet`, `FAIL: 5k-canary`, `FAIL: 10b-byte-drift`, `FAIL: 10d-reachability`, summary "9 invariant failures" | P1 |
| OK | Literal `update --surfaces` execution fixes 4 of the 5 named legs AND both extra legs: `generate-leaf-manifest.cjs --write .skilled/skills/sk-code` (step_4 activity, auto yaml:433) clears 10b/10d; packet SKILL.md+README+changelog clears 3d-files; hub table row clears 6b; description.json keyword clears 5k-packet. | copy `$X2`: `PASS: 5k-alias`, `PASS: 5k-packet`, no 3d-files/6b/10b/10d FAIL lines; `MANIFEST_EXIT=0` | P1 |
| BREAK | `update --surfaces` leaves `5k-canary` failing — `FAIL: 5k-canary: "sk-code-myapp": no canary case routes to it`; gate exits 1. The workflow YAML contains no step that authors a canary case; fixture root is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/<N>-<hub>` — inside `.skilled/`, shipped with the repo, NOT under `specs/` (the F20 prune concern does not apply to the fixture itself). | copy `$X2`: FAIL line + `CHECK_EXIT=1`; `parent-skill-check.cjs:139` CANARY_FIXTURE_ROOT, `1263-1278` canaryDrift; `find` located `compiled-route-*.cjs` under `.skilled/bin/` | P1 |
| ORDER | tieBreak lands the new surface LAST: `[sk-code-quality, sk-code-review, sk-code-skilled, sk-code-obsidian, sk-code-webflow, sk-code-myapp]` — behind `sk-code-skilled`. The YAML instructs only "tieBreak covering all modes" (auto yaml:423) with no placement rule, so the sanctioned command path does NOT satisfy R1's "own surface outranks opencode"; a further hand-edit of `routerPolicy.tieBreak` is still required. | copy `$X2` printed tieBreak; `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423` | P1 |
| DOC | `update` operation `output_scope` omits `<surface>/{SKILL.md,README.md,changelog/}` — surfaces appear only under `create` (auto yaml:205 vs 208-220) — while step_4's surface-generation activity (yaml:428) is not operation-gated. The scope table suggests update cannot scaffold surface packets; the step text says it can. A strict-scope executor could refuse or skip the packet writes on update. | `create-skill-parent-auto.yaml:190-220` (operation_router), `:428` (ungated surface generation) | P2 |
| PRESENCE | The 5k-alias fix is execution-dependent, not contract-guaranteed: the YAML never requires registry aliases to be vocabulary keywords (it passed only because this execution mirrored the existing surfaces' convention — alias phrases registered as class keywords). A literal run that invents natural keywords still fails 5k-alias. | `parent-skill-check.cjs:1197-1216` (aliasDrift walks registry aliases vs class keywords); copy `$X2` PASS relied on hand-mirrored keywords | P2 |
| DOC | "surface folder == bare noun" guidance (auto yaml:136, 261, 389) contradicts sk-code's actual convention — `sk-code-webflow`, `sk-code-obsidian`, and now `sk-code-myapp` folders match `packetSkillName` (`sk-code-<noun>`), not a bare noun. A bare-noun folder would fail `3d-name` unless packetSkillName is also bare. This iteration used the in-repo convention (`sk-code-myapp`), which the 3d-name leg accepted. | registry entries `packet`/`packetSkillName: "sk-code-webflow"`; `parent-skill-check.cjs:536-548` (3d-name); auto yaml:136/261/389 | P2 |
| OK | `compiled-route-sync --check` stays green with the new surface (exit 0, "all 55 served copies match their authored files") — it verifies served copies vs authored files, not ROUTER.md map coverage. No drift signal fires for a surface whose SKILL.md carries no authored leaf map; whether ROUTER.md needs a myapp slice is the Q8/F20 re-mint question, out of this leg's scope. | copy `$X2`: `BARE_SYNC_EXIT=0` | P2 |

## Options and recommendation (feeds R-stream)

| option | what it changes, path:line | cost | risk | cheaper move and why it fails |
| --- | --- | --- | --- | --- |
| Extend the update workflow: (a) add a canary-case authoring step for new routerSignals modes, (b) state a tieBreak placement rule for surfaces (e.g. insert ahead of the default/generic mode), (c) add `<surface>/…` to update's output_scope | `create-skill-parent-auto.yaml:208-220, 423-433` (+ confirm twin); new fixture write under `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/` | Medium: canary-case format lives in the compiled-routing fixture (`fixtures/canary-cases.v1.json`); workflow must write or regenerate it | Low: keeps the single gate green on the sanctioned path | Documenting the residual steps in `skill-parent.md`: fails because the gate still exits 1 (`5k-canary`) on a sanctioned command path — docs can't turn a FAIL into a PASS; user must hand-author an undocumented fixture format |
| Alternative: mark 5k-canary warn-only for newly added surfaces via `VOCABULARY_PARITY_WARN_ONLY` | `parent-skill-check.cjs:1282` warn-only table | Small: one map entry | Masks a real gap — the canary fixture exists to prove each mode routes; blanket warn-only for sk-code weakens the guard for every future surface | Removing the canary leg: loses the route-regression net entirely |

## Ruled Out

- `/create:skill-parent update --surfaces` alone as the complete "add your own surface" path — observed gate exit 1 (5k-canary) and tieBreak-last placement.
- Hand-editing `tieBreak` as part of the command's normal result — the YAML has no placement rule; natural execution appends at end.

## Dead Ends

- None new; `compiled-route-sync --check` verified inapplicable to the surface-add gap (it is a served-copy check, not a map-coverage check).

## Edge Cases

- Ambiguous input: "the minimal way" for the hand-add interpreted as registry+router edits plus a bare packet SKILL.md (the smallest add that makes the surface visible to the registry/router at all); a smaller add (folder only, no registry entry) would fail differently and prove less.
- Partial success: copy1's `CHECK_EXIT` print was masked by the output pipeline (`grep` exit); the "9 invariant failures" summary line is the evidence. Copy2 captured `CHECK_EXIT=1` directly.
- Contradictory evidence: yaml "bare noun" surface-folder guidance vs in-repo `sk-code-<noun>` convention — both cited; the in-repo convention was used and passes 3d-name.

## Sources Consulted

- [SOURCE: .skilled/commands/create/skill-parent.md:19-23,79-93] one-identity invariant, ROUTER.md state classification
- [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:190-220] operation_router output scopes (create lists `<surface>/…`, update does not)
- [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:421-433] step_4 generation incl. `generate-leaf-manifest.cjs --write`
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:139] CANARY_FIXTURE_ROOT `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout`
- [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:567-577,1184-1278,1384-1405] 3d-files, 5k legs, 6b
- Command evidence: copy `$X1` parent-skill-check (9 FAIL lines quoted); copy `$X2` manifest exit 0, check exit 1 with `5k-canary` FAIL, sync exit 0, tieBreak print
- [SOURCE: .skilled/skills/sk-code/mode-registry.json] webflow/obsidian surface entries (packetKind surface, routingClass metadata)
- [SOURCE: .skilled/skills/sk-code/hub-router.json] routerSignals shape `{weight,classes,resources}`, tieBreak order

## Assessment

- New information ratio: 0.75
- Questions addressed: Q9
- Questions answered: Q9 — partially: `update --surfaces` performs 4 of the 5 missing steps (3d-files, 6b, 5k-packet, and 5k-alias only when the executor mirrors aliases as keywords) plus leaf-manifest refresh; it does NOT author the canary case (gate exits 1) and does NOT place the surface ahead of opencode in tieBreak (appends last). F18 corrected: the hand-add baseline fails 9 legs, not 5.

## Reflection

- What worked: running the real `parent-skill-check` in clones converted F18's expected-five into a measured nine, and running the YAML's own mandated `generate-leaf-manifest.cjs` showed the update path clears exactly the legs its steps touch — the residual failure set is precisely the steps the YAML lacks (canary, tieBreak placement, update output_scope).
- What did not: `compiled-route-sync` needed no skill arg (usage error first try); the bare `--check` then showed it doesn't cover ROUTER.md map freshness.
- Do differently: next iteration should check whether a canary-fixture generator exists (admission/sync scripts under `.skilled/bin/`) before recommending workflow changes, and read how existing surfaces' canary cases were authored.

## Recommended Next Focus

Q8/F20: the re-mint dependency — where the authored per-surface map source lives (iteration-1 dead end) and what `compiled-route-*` scripts regenerate; or Q10 stress-test of R1-R4 now that the update path's residual failures (canary, tieBreak-last) are measured.

## SCOPE VIOLATIONS

None. All mutations ran only under throwaway clones `$X1`/`$X2` in `$TMPDIR`; the repository was read-only. `rm`/`mv`/edits were confined to the clones per the throwaway-copy exception.
