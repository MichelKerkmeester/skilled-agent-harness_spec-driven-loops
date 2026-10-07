# Iteration 8: Q3 - where corpus healing slots into /doctor:update, and the reversibility gap

## Focus

Read the doctor-update apply and check workflows end to end; locate the exact integration point for corpus migration; assess upgrade-legacy's reversibility against the release engine's rollback discipline.

## Actions Taken

1. Re-read `steer.md`.
2. Read `doctor-update-apply.yaml` in full (225 lines): phases, mutation boundaries, post-apply battery, state log.
3. Read `doctor-update-check.yaml` in full (161 lines): engine contract, generated class, next-steps routing.
4. Read `upgrade-legacy.mjs` lines 478-596: apply gate, archive repair filter, damage detection, reporting, exit codes.

## Findings

1. The post-apply battery is a `when:`-gated check list where each check declares `command` plus a `repair` run only "With approval" - a corpus check fits the pattern exactly: `when` the system-spec-kit skill unit applied, `command` = upgrade-legacy dry run, `repair` = upgrade-legacy --apply under the same per-check approval the other battery repairs use. CONFIRMED [SOURCE: .skilled/commands/doctor/assets/doctor-update-apply.yaml:146-198]
2. Apply's mutation boundary permits "Exact documented write counterparts in the post-apply battery, only after separate approval" - so a corpus-heal repair step is legal inside the existing boundary without loosening it. CONFIRMED [SOURCE: doctor-update-apply.yaml:67-83]
3. The engine's rollback discipline - `rollback.json` written BEFORE the first target-file write, plan digest re-verified at apply, a lock released in `finally`, and rollback-first recovery - has NO counterpart in upgrade-legacy: it writes packet files directly and relies on git for reversal, with no clean-tree precondition and no rollback manifest. CONFIRMED gap [SOURCE: doctor-update-apply.yaml:131-144 (engine guarantees); upgrade-legacy.mjs:491-565 (apply path writes via repair steps with no record)]
4. upgrade-legacy's apply aborts entirely when ANY packet's first validation is unreadable ("nothing was written", exit 2) - a fail-safe that keeps half-blind sweeps from writing. CONFIRMED [SOURCE: upgrade-legacy.mjs:481-489]
5. `--include-archive` widens discovery, validation and baseline recording to archives but NEVER repair: the repair filter is `!packet.archived`. So the shipped archive contract is "recorded, not repaired" - which means phase 013's archive specFolder rewrite departed from the tool's own semantics, while the README's "archived trees are skipped" claim is also wrong (they are censused, validated and baselined under the flag). CONFIRMED [SOURCE: upgrade-legacy.mjs:491-494,80,202-205; repair-derived.cjs:386-389; README-repair-derived.md:135-137]
6. Damage detection is built in: a packet that passed before repair but fails at mid-validation is never recorded in the baseline - "Recording it would hide the damage" - so a repair step that broke a packet stays an error. CONFIRMED [SOURCE: upgrade-legacy.mjs:498-502]
7. check's `generated` file class already exempts graph-metadata derived blocks (plus trigger index, leaf manifests, compiled routes) from counting as customization - a release bump never marks a packet customized because its generated metadata drifted. CONFIRMED [SOURCE: doctor-update-check.yaml:123; doctor/update.md:70]
8. check handles the vendored/pre-release-record tree via `baseRecording.needed` -> `record-base` routing; the corpus analog (a repo whose packets predate the current contract entirely) has no equivalent signal in the check report. CONFIRMED [SOURCE: doctor-update-check.yaml:145; update.md:72]

## Ruled Out

- A corpus step inside `release-update.cjs` itself: the engine's unit model is checkout files under .skilled, not specs/; a corpus pass belongs to the orchestrating YAML's battery, not the engine's plan.
- An unconditional corpus repair in the battery: the boundary grants repair writes only under approval, and corpus scale argues for the same.

## Dead Ends

None.

## Edge Cases

- The baseline file is written INSIDE archived folders (recordFindings writes <folder>/upgrade-baseline.json even when archived) - the only write the archive boundary permits. A "pristine archive" policy would need an exception or a sidecar location.

## Recommendations

| ID | Recommendation | Q | Where it lives | Effort | Risk | Files touched | Evidence | Standing |
|----|----------------|---|----------------|--------|------|---------------|----------|----------|
| R8.1 | Add a `corpus_drift` check to the apply battery: `when` = system-spec-kit unit in appliedUnits or followUps; `command` = `node .../spec/upgrade-legacy.mjs` (dry); `repair` = approved `--apply`; result mapped like other battery checks | Q3 | doctor-update-apply.yaml phase_5 + presentation txt | M | Low-Med: battery slot exists; repair is opt-in per existing pattern | apply YAML, presentation.txt | apply.yaml:146-198 pattern; upgrade-legacy.mjs:589 dry-run output | CONFIRMED fit |
| R8.2 | Add corpus guidance to check's next-steps routing: when units include system-spec-kit updates, name upgrade-legacy dry run and `--include-archive` for recorded-not-repaired census | Q3 | doctor-update-check.yaml phase_4 routing + presentation | S | Low: text routing only | check YAML, presentation.txt | check.yaml:136-146 routing slots | CONFIRMED |
| R8.3 | Give upgrade-legacy --apply a reversibility precondition: require a clean git tree for the roots (or write a rollback manifest of path+sha256 before the first write, engine-style) and refuse otherwise | Q3 | upgrade-legacy.mjs apply gate | M | Med: adds a precondition that could block legitimate dirty-tree use; make manifest the fallback, not refusal-only | upgrade-legacy.mjs | apply.yaml:137 (rollback.json first) as the model; upgrade-legacy lacks any equivalent | CONFIRMED gap |
| R8.4 | Document the shipped archive contract - "validated and baselined, never repaired" - in README-repair-derived.md and MIGRATION.md, resolving the phase-013-vs-tool contradiction prospectively and naming when --include-archive recording is appropriate | Q2, Q3 | the two docs | S | Low: docs only | 2 docs | finding 5 | CONFIRMED |

Idempotency/reversal/meaning: R8.1 reuses the existing approval pattern (check is dry; repair approved). R8.2 is guidance text. R8.3 adds a precondition or manifest (reversal = git or manifest-restore). R8.4 docs. No document meaning changed; no history invented.

## Sources Consulted

- `steer.md`
- `.skilled/commands/doctor/assets/doctor-update-apply.yaml` (full)
- `.skilled/commands/doctor/assets/doctor-update-check.yaml` (full)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` (lines 478-596, completing the file)
- `.skilled/commands/doctor/update.md` (prior read)

## Assessment

- New information ratio: 0.85 (all 8 findings carry new evidence; 5 refines the iteration-4/6 archive conflict)
- Questions addressed: Q3 integration point fully specified (battery slot + check routing + reversibility precondition)
- Questions answered: Q1 (iteration 7), Q3's detection+integration legs; remaining Q3 leg = the pre-v4 detection consolidation (iteration 9)

## Reflection

- What worked: reading the apply YAML's battery section before writing gave the exact slot shape (when/command/repair) instead of a vague "add a step".
- What did not: nothing.
- Do differently: should have read upgrade-legacy's tail in iteration 4 - the archive record-vs-repair nuance changes finding framing.

## Recommended Next Focus

Iteration 9 (Q3 residual): consolidate the pre-v4 detection story - what signals distinguish a v3/prev4 checkout (`.opencode/specs`, absent markers, absent description.json, no generated metadata), and whether the branch commits introduce any detection the corpus work needs.
