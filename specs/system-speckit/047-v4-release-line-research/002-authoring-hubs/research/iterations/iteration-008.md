# Iteration 8 — Release coverage v4.0.0.2–v4.0.0.16 and the first misalignment finding

## Focus

Close the empty release rows for v4.0.0.2 (Changelogs, Doc Validation), v4.0.0.3 (Documentation Checks, Skill Authoring), v4.0.0.6 (Code Reviews, Code Skill), v4.0.0.9 (Skill Versions, Authoring Validators), v4.0.0.10 (Adapting the Code Skill) and v4.0.0.16 (Code Quality in Any Repository, Code Review, Documentation). For each, test one concrete claim against code rather than the note. Second target: record the `misalignment` type, which had no registry entry, by checking a hub against sk-doc's own parent-hub canon.

## Actions Taken

1. Read the six release notes and extracted every claim that touches the four hub paths.
2. Tested v4.0.0.2's "`SKDOC_SKIP_VALIDATION=1` turns off all twenty sk-doc validators" by counting validator-named scripts under `sk-doc` and which of them import the shared switch helper.
3. Tested v4.0.0.9's retired `sk-doc-template` comment across all four hubs.
4. Tested v4.0.0.16's config move by checking `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` and `.../sk-code-quality/repository/quality.json`, then ran the documented `quality-gate.cjs` in its read-only modes.
5. Tested v4.0.0.10's doctor leg and the canon's named enforcement point by running `parent-skill-check.cjs` and `sk-skill-check.cjs` against `sk-design` and `sk-code`.
6. Compared every hub's `routerPolicy.outcomes` against the canon's enumerated outcome vocabulary.
7. Probed `compiled-route.cjs` on four natural prompts per hub to test routing, not just resolution.

Two candidate findings were killed during this iteration, which is worth recording: (a) `_underscore` script names surviving in `sk-code-skilled/changelog/*.md` looked like a v4.0.0.6 rename miss, but the renamed files exist and only historical changelog prose keeps the old names — correct history, not drift; (b) `compiled-route.cjs` looked like it exited `0` on an unknown option, but that reading came from `head`'s exit status after a pipe. Unpiped, it exits `2`. The observation is withdrawn.

## Findings

### F1 — The canon's named enforcement point cannot be invoked by hub id, and reports `FAIL` before it reports the real error

**Type:** bug (3) · **Severity:** P2 · **Release:** v4.0.0.10 (the `/doctor:sk-code setup` leg that runs the parent-skill doctor, [SOURCE: .skilled/changelog/skilled/v4.0.0.10.md:81]) · **Confidence:** high (repro ran)

sk-doc's canon says "`parent-skill-check` check 5 is the enforcement point for `hub-router.json` validity" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:335]. The natural invocation with a hub id fails:

```
node .skilled/commands/doctor/scripts/parent-skill-check.cjs sk-design
INFO: Parent skill: sk-design
INFO: Resolved:     .../Skilled/sk-design
INFO: Advisory findings: FAIL. Hard failures always FAIL.
ERROR: parent skill directory not found: .../Skilled/sk-design
EXIT=2
```

The id is resolved against the repository root, not `.skilled/skills/`. The sibling checker resolves the same bare id correctly: `node .skilled/commands/doctor/scripts/sk-skill-check.cjs sk-design` prints `Result: PASS` with `C1 Location` first [SOURCE: .skilled/commands/doctor/scripts/sk-skill-check.cjs:20]. The operator-facing damage is the ordering: `Advisory findings: FAIL` prints before the error that explains it, so an operator who greps for `FAIL` concludes the hub fails conformance when the hub was never read.

**Verify:** `node .skilled/commands/doctor/scripts/parent-skill-check.cjs sk-design; echo "EXIT=$?"` → `EXIT=2` with the not-found error; `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design` resolves.

### F2 — sk-design publishes an outcome kind the canon does not define, and check 5 cannot see it

**Type:** misalignment (2) · **Severity:** P2 · **Release:** present at v4.0.2.0 (introducing release not isolated this iteration) · **Confidence:** high for the shape; medium that removal is intended

The canon enumerates the outcome vocabulary as the three base outcomes `single`, `orderedBundle`, `defer`, plus `surfaceBundle` only for a hub with surface packets [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:96]. Key sets at the current tag:

- `sk-code`: `single,orderedBundle,surfaceBundle,defer`
- `sk-doc`: `single,orderedBundle,defer`
- `sk-design`: `single,orderedBundle,defer,none`

`none` is defined nowhere in the canon, referenced by no consumer (`grep -rn "outcomes\.none" .skilled --include=*.cjs` is empty), and is not an outcome any sibling hub declares. The no-signal path does not emit it either — `compiled-route.cjs --hub sk-design --prompt "make me a chart for monthly revenue"` returns `"action":"defer"`. The reason it survived is that the enforcement point checks presence, not membership: `const missingOutcomes = ['single', 'orderedBundle', 'defer'].filter((o) => !outcomes[o]);` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1187]. An extra key is invisible.

**What breaks if removed:** nothing observed — no reader, no emitter, no sibling precedent. This is the weakest kind of schema drift to leave in place precisely because it is harmless today.

**Verify:** `node -e "const o=require('./.skilled/skills/sk-design/hub-router.json').routerPolicy.outcomes;console.log(Object.keys(o))"` → includes `none`; `grep -rn "outcomes\.none" .skilled --include=*.cjs` → no hits.

### F3 — "Every sk-doc validator checks" the off switch is false for three validators, one added after the promise

**Type:** drift (1) · **Severity:** P2 · **Release:** v4.0.0.2 (promise), with a later validator never joining · **Confidence:** high

v4.0.0.2 states `SKDOC_SKIP_VALIDATION=1` "turns off all twenty sk-doc validators" [SOURCE: .skilled/changelog/skilled/v4.0.0.2.md:146]. The shared helper ships the switch [SOURCE: .skilled/skills/sk-doc/shared/scripts/validation-switch.cjs:24], and its README generalises the promise to "the off switch every sk-doc validator checks" [SOURCE: .skilled/skills/sk-doc/shared/scripts/README.md:57]. Twenty scripts do import it. Three validator-named scripts do not:

- [SOURCE: .skilled/skills/sk-doc/sk-create-diff/scripts/validate_report.py:1]
- [SOURCE: .skilled/skills/sk-doc/sk-create-readme/scripts/audit_readmes.py:1]
- [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py:1] (added 2026-11-05, commit `089c2e7f61` — after the promise)

So the invariant is numeric-coincidental at v4.0.0.2 and false at v4.0.2.0: a contributor who sets the documented switch still gets failures from these three, and the error message will not name the switch because the script never reads it.

**Verify:** `for f in $(find .skilled/skills/sk-doc -name 'validate*' -o -name 'check*' -o -name 'audit*' | grep -v test); do grep -q validation_switch "$f" || echo "$f"; done`

### F4 — The off switch is invisible from the hub: absent from sk-doc's `SKILL.md` and `ROUTER.md`

**Type:** drift (1) / UX (5) · **Severity:** P2 · **Release:** v4.0.0.2 · **Confidence:** high for the absence

`grep -n "SKDOC_SKIP_VALIDATION\|SPECKIT_SKIP_VALIDATION" .skilled/skills/sk-doc/SKILL.md .skilled/skills/sk-doc/ROUTER.md` returns nothing. The switch is discoverable only from the shared-scripts README [SOURCE: .skilled/skills/sk-doc/shared/scripts/README.md:57], `.skilled/hooks/hook-flags.env`, and the changelog — none of which a session loads when it loads the hub. The AI user running a validator therefore cannot find the documented escape hatch from the two files it was told to read.

**Verify:** the grep above, run from the repository root.

### F5 — The quality gate's planned mode exits `2`, colliding with the suite's own failure code

**Type:** UX (5) · **Severity:** P2 · **Release:** v4.0.0.16 · **Confidence:** high for behaviour; medium that CI depends on it

v4.0.0.16 documents one verdict per change [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:118] and a quality config a repository can commit, written by `/doctor:sk-code quality` [SOURCE: .skilled/changelog/skilled/v4.0.0.16.md:122]. The config move itself verifies: `.skilled/skills/sk-code/sk-code-quality/repository/quality.json` (748 bytes) and `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` (1657 bytes) both exist at the documented paths. The command also verifies, but its planning mode returns a failing status:

```
node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs --no-run --files .skilled/skills/sk-code/SKILL.md
=> "status":"advisory", "gate":"NOTHING_CHECKED", "exit_code":2   (process exit 2)
```

`--help` documents `0 NO_BLOCKER_FOUND` and `1 BLOCKED` as the outcome codes, so `2` is outside the documented verdict set while `parent-skill-check.cjs` (F1) also uses `2` for an advisory FAIL. A caller cannot distinguish "nothing was checked because you asked for a plan" from "the gate ran and found a degraded result".

**Verify:** the command above; `echo $?` → `2`.

### F6 — A natural chart request defers on sk-design while a synonym routes

**Type:** UX (5) · **Severity:** P2 · **Release:** v4.0.1.0 (consolidated hub) · **Confidence:** medium — one phrasing pair, both runs below

`routerSignals` is keyed by mode and drives scoring [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:149]. Observed on the same hub:

- `--prompt "make me a chart for monthly revenue"` → `defer []`
- `--prompt "chart this data as a bar chart"` → `route ["sk-design-chart"]`
- `--prompt "diagram the auth flow as a sequence"` → `route ["sk-design-diagram"]`

The verb-first phrasing routes; the request-shaped phrasing that a user actually types does not. For contrast, `sk-code` defers on the diagram prompt, which is correct because it has no diagram mode — so the mechanism works and the sk-design vocabulary is the narrow part.

**Verify:** `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "make me a chart for monthly revenue"` → `defer`.

### F7 — Extension: make the switch coverage a checked invariant

**Type:** extension (7) · **Severity:** P2 · **Release:** v4.0.2.0 (gap observable at the current tag) · **Confidence:** high

F3 shows an invariant that was true by count and is now false, with nothing watching it. The cheapest fix reuses what exists: a meta-check that walks the same `validate*|check*|verify*|audit*` set the research used and fails any script that neither imports `validation-switch` nor carries an allowlist row with a reason — the pattern `verify-doc-claims.cjs` already uses for deliberate legacy names (allowlist with reasons, see the v4.0.0.6 guard rewrite [SOURCE: .skilled/changelog/skilled/v4.0.0.6.md:84]). It belongs in the same fleet gate that already enforces root metadata, not in a new script.

### Ruled out this iteration

- **v4.0.0.6 script rename left stale `_underscore` names** — false. `router-replay-lib.cjs`, `verify-doc-claims.cjs` and `verify-router-sync.cjs` all exist under `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/`; the `_underscore` names survive only inside historical changelog prose, which should keep them.
- **v4.0.0.9's retired `sk-doc-template` comment survived** — false. Every remaining mention sits in a `changelog/*.md` entry; no live catalog, template or SKILL.md carries it.
- **v4.0.0.3's version renumbering left sk-code on v2** — false as drift. The note says sk-code went from v4 to v2 [SOURCE: .skilled/changelog/skilled/v4.0.0.3.md:311]; the hub now reads `3.11.4.0`, i.e. it advanced normally afterwards.
- **`compiled-route.cjs` exits 0 on an unknown option** — withdrawn. That reading came from `head` in a pipeline. Unpiped it exits `2`.

## Questions Answered

None fully. Q11 (friction) moved from open to three-quarters evidenced: unclear validator errors (F1, F5), ambiguous mode choice (F6), undocumented escape hatch (F4). The "large mandatory loads" sub-question is still untouched, so the box stays unticked rather than overclaimed.

## Questions Remaining

- **Q11** — "What friction do the operator and the AI user hit in these hubs: ambiguous mode choice, unclear validator errors, large mandatory loads?" Only the mandatory-load half is unexamined.
- Whether `none` in sk-design's outcomes was authored deliberately or left from an earlier schema (F2's release row stays "present at v4.0.2.0" until a path-limited `git log` on `hub-router.json` settles it).

## Next Focus

Measure the mandatory load each hub forces before a first action — the sum of hub `SKILL.md` plus router plus the files each router marks mandatory — and test whether any mode can be entered without loading a file its own contract does not require. That closes Q11 and is the last unexamined friction axis.
