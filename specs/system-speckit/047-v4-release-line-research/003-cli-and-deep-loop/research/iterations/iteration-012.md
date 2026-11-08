# Iteration 12 — Unread releases v4.0.0.1, .8, .9, .10, .11 against the CLI + deep-loop cluster

## Focus

Close the five release notes never read in this lineage (v4.0.0.1, v4.0.0.8, v4.0.0.9, v4.0.0.10, v4.0.0.11), restricted to the cluster paths `.skilled/skills/cli-external-orchestration`, `.skilled/skills/cli-classifier`, `.skilled/skills/system-deep-loop`, `.skilled/commands/deep`. Two cluster claims checked per release with `path:line` against the current tree; releases with no cluster claim recorded as verified-empty. Not repeated from the registry: review-focus, `opencode --pure`, dsh branch, lock owner-pid, generation binding.

## Actions Taken

1. Read all five release notes in `.skilled/changelog/skilled/` and extracted every claim naming a cluster path.
2. Census of the "scripts refuse unknown options" claim: `grep -c "nknown option"` across all 27 `system-deep-loop/runtime/scripts/*.cjs`.
3. Read the argv parser of the mandatory append gateway (`append-mode-event.cjs`) against the one guarded script (`status.cjs`).
4. Structural census of the CLI hub: mode folders with `SKILL.md` vs `mode-registry.json` `modes[]` vs `hub-router.json` `routerSignals`, plus alias→`vocabularyClasses` keyword containment.
5. Version conformance: `SKILL.md` / `description.json` / `hub-router.json` / `mode-registry.json` / `ROUTER.md` for both cli hubs; `version:` key presence across 85 changelog entries; `ROUTER.md` presence and `SKILL.md`→`ROUTER.md` reference count for all 9 hub packets.
6. Stale-model and stale-keyword sweeps for the v4.0.0.1 roster and routing claims.

## Findings

### F1 — P1 — bug + drift — the deep-loop scripts do not refuse unknown options, and the mandatory gateway is the worst case

v4.0.0.8 claims: "The same check now covers scripts across the skills: the spec-kit CLI, the skill advisor, **the deep loop**, sk-doc, sk-code, sk-design, sk-git and the shared `.skilled/bin` tools … Each script now names the unknown option and exits with its usage code … **the deep-loop scripts keep their JSON error with exit 3**." Its Upgrade Notes repeat the promise: "Fix calls that pass unknown options."

Measured on the current tree: **7 of 27** `system-deep-loop/runtime/scripts/*.cjs` carry any unknown-option handling (`append-state-record`, `check-documentation-drift`, `check-projection-coverage`, `check-protocol-append-sites`, `codex-dispatch`, `convergence`, `status`). The other **20** have none — including `append-mode-event.cjs`, the gateway every iteration of every deep-loop run is contractually required to call.

That parser accepts any `--token` by assignment with no allowlist:

```
const key = token.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
...
args[key] = next;
```

[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:70] — the accept-anything assignment, inside `parseArgs` opened at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:58]. Only a positional argument ever throws [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:62].

The intended shape is visible in a sibling that does carry the guard, with an explicit accepted-flag list [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/status.cjs:37] and the comment stating that anything not in the list counts as unknown [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/status.cjs:36].

Why P1 and not P2: the deep-loop protocol makes this call mandatory and makes a wrong record type or a wrong `--event-json` target a hard run failure ("Skipping the gateway call … fails the iteration"; `--event-json` must name a single-record file). The one typo class an operator is most likely to make is exactly the one this script absorbs instead of naming. The release note is what an operator will rely on, and it is false for the highest-consequence script in the family.

Confidence: high on the static claim (census + parser read). The behavioural repro that a misspelled optional-looking flag returns exit 0 **was deliberately not run** — the only way to exercise the parser is against a live run directory and would append a ledger event, which is a write outside this iteration's authority. The static evidence is sufficient to falsify the note; the runtime repro is left for a follow-up with write authority.

Verify: `grep -c "nknown option" .skilled/skills/system-deep-loop/runtime/scripts/*.cjs | grep -c ':1'` → `7`; `sed -n '58,76p' .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` shows no allowlist.

### F2 — P2 — extension — one shared argv whitelist would close the 20/27 gap at the source

F1 is not a per-script bug, it is a missing shared primitive: 20 scripts each hand-roll `process.argv` slicing, so the v4.0.0.8 sweep had to be applied 27 times by hand and missed 20. Anything that removes the hand-rolling removes the class, including the next script written tomorrow.

What breaks if nothing is done: every new deep-loop script is born outside the guard and the census silently regresses (it already has, in the same release line that promised the check). Suggested extension, not implemented here: a `parseArgs(argv, {allowed})` helper in `runtime/lib/` that throws the JSON error + exit 3 shape the release note describes, with the 20 unguarded scripts adopting it. Blast radius of the change is confined to the scripts' own entry points; each adoption is independently testable by passing one bogus flag.

Verify: `grep -L "nknown option" .skilled/skills/system-deep-loop/runtime/scripts/*.cjs | wc -l` → `20`.

### F3 — P2 — UX / drift — `ROUTER.md` carries a `version:` that means something different from its siblings

Both cli hubs keep every machine-read version in lockstep with `SKILL.md`, and `ROUTER.md` alone lags:

| file | cli-external-orchestration | cli-classifier |
|---|---|---|
| `SKILL.md` | 1.8.0.0 | 0.8.9.0 |
| `description.json` | 1.8.0.0 | 0.8.9.0 |
| `hub-router.json` | 1.8.0.0 | 0.8.9.0 |
| `mode-registry.json` | 1.8.0.0 | 0.8.9.0 |
| `ROUTER.md` | **1.7.11.0** | **0.8.5.0** |

This is by design, not a validator miss: v4.0.0.9 states "A hub `ROUTER.md` keeps its own version too. The doctor's version check compares only `description.json`, `hub-router.json` and `mode-registry.json` with `SKILL.md`, and `/create:changelog` no longer writes the release version into `ROUTER.md`."

So the field name `version:` now means "current release" in four sibling files and "release that last happened to edit this document" in the fifth, distinguished only by which file you opened. Yesterday's open question — *is there a validator that compares `ROUTER.md`'s version with `SKILL.md`'s?* — is answered: no, deliberately. The residual defect is the ambiguity, and a lag of eleven patch segments is what it looks like in practice: an operator reading the hub's routing contract sees 1.7.11.0 while the hub is 1.8.0.0, with nothing on the page saying the number is scoped to the document.

Confidence: high (file reads on both hubs). Severity P2: no runtime behaviour depends on the field, per the note itself.

Verify: `grep -m1 '^version:' .skilled/skills/cli-external-orchestration/{SKILL.md,ROUTER.md}` → `1.8.0.0` vs `1.7.11.0`.

### Verified-empty / confirmed-true (the other half of the five releases)

- **v4.0.0.11** — no cluster claim at all (sk-git `setup` command, hook install, commit standards). Verified-empty for this cluster.
- **v4.0.0.10** — no cluster claim in the four paths (sk-code surfaces, git hook trust, Commit-Id, Pi Fast Mode). Verified-empty.
- **v4.0.0.1, routing keyword claim** — "a skill that answers judgment questions carried the bare word `run` among its keywords … the keyword is gone." Confirmed: `cli-classifier/description.json` keywords are `cli-classifier, cli-jev, cli-usage, jev, typed judgment, jev-mcp, jev noul, jev choice, jev score, hosted classifier` — no bare `run`.
- **v4.0.0.1, model rosters** — no `gpt-5.6-luna`, `gpt-5.6-sol`, `mimo-v2.5`, `mimo-v2.6-pro-ultraspeed` or `claude-opus-5-4` on any live dispatch surface in the four cluster paths. The only hits are frozen evidence under `cli-external-orchestration/benchmark/reports/compiled-routing/2026-07-21--*`, which record what a past run actually dispatched. Correctly left as history, not stale config.
- **v4.0.0.9, hub-integrity claims** — 7 mode folders with `SKILL.md` = 7 `modes[]` entries = 7 `routerSignals` keys, zero orphans in either direction; every `aliases[]` entry of all 7 modes appears verbatim in a `vocabularyClasses` keyword list (0 misses), matching "every mode alias is lowercase and listed among its router keywords"; all 85 changelog entries across the three audited skills carry a `version:` key (28 + 17 + 40, 0 missing).

## Questions Answered

None ticked. The one key question this iteration came closest to is half-answered and is carried forward split.

## Questions Remaining

- **Hub canon, narrowed twice.** New evidence: 9 of 9 hub packets (7 cli modes + both hubs) ship a `ROUTER.md`, and every `SKILL.md` references it (1–13 references each), so the "each skill routes from its own `ROUTER.md`" rule holds structurally. Still unproven: parent-hub canon under `package_skill.py --strict` for the hub and its seven modes. That is now the only unexplained half.
- **Executor failure handling** — eighth iteration carried. Unread: what a single-executor run records for a devin `resource_exhausted` or a builder throw.
- **F1's runtime repro** needs write authority the leaf does not have: confirm that `--bogus-flag` returns exit 0 through the gateway.
- **Over-engineering** — `runtime-capabilities.json` plus the un-called `dispatchSeat` seam, blast radius still unchecked.
- **UX** — two of three `*-presentation.txt` assets unread; the `deep-research-*` twin never compared against the `deep-review-*` instances in F2/F4 of earlier iterations.
- **Drift method** — F1 is a second instance of "release note claims a sweep, tree shows a partial sweep". A `git log --name-only` pass per tag against each note's headline list would close the class in one action.

## Next Focus

Iteration 13: `package_skill.py --strict` across `cli-external-orchestration` + its seven modes and `cli-classifier` + `cli-jev` (the last unexplained half of hub canon), then the executor-failure question that has now survived eight iterations.

## SCOPE VIOLATIONS

None. All writes stayed inside the lineage `research/` directory; the gateway was invoked as required and no researched file was touched.
