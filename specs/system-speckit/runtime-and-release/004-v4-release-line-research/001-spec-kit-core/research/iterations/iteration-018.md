# Iteration 18 — Fresh-clone path pass

## Focus

Fresh-clone path pass. Build two throwaway clones under `/tmp` (`git clone --depth 1 file://…`, never the
working tree), list which commands named in `.skilled/commands/speckit/*` and the `system-spec-kit` README
need a compiled `dist` the clone lacks, run each to record its exact error and exit code, find which
documented step builds `runtime/cli/dist`, and note which messages name the fix and which do not.

## Actions Taken

1. Established the shipping state of the compiled tree from the working repository:
   `dist/` is gitignored at `.gitignore:60`, `git ls-files .skilled/skills/system-spec-kit/runtime/cli/dist`
   returns **0** tracked files, and `runtime/cli/runtime` is a **tracked symlink** (git mode `120000`,
   blob `85d8c32f`) pointing at `../dist`. So a clone reproduces the dangling link but never the target.
2. Made clone A (`/tmp/skilled-fresh-probe-18`) with `git clone --depth 1 --no-hardlinks` semantics over
   `file://`. Confirmed the absence set: no `runtime/cli/dist`, no `runtime/dist`, and
   `runtime/cli/runtime/` does not resolve; no `runtime/node_modules` either.
3. Ran every documented `dist` consumer in clone A and recorded exit codes verbatim (table in Findings).
4. Read `validate.sh`'s orchestrator resolution ladder to see whether it fails closed, and read
   `lib/dist-freshness.cjs`'s exit vocabulary to check the freshness gate's behaviour without an attestation.
5. Read the three competing `build` scripts (skill root, `runtime/`, `runtime/cli/`) and
   `runtime/cli/tsconfig.json`'s project references to work out which build satisfies which consumer.
6. Made clone B (`/tmp/skilled-probe18-runtimeonly`) specifically to test the *documented* repair command
   in isolation: install at skill root, then `npm --prefix .skilled/skills/system-spec-kit/runtime run build`
   only — the exact command both `validate.sh` and the README /doctor:install step 0 hand the user.
7. Attributed each row with `git log -S`, then mapped the commits to the first release tag containing them.

Negative results, recorded so later iterations do not chase them: the `/doctor:install` step-0 command block
is *correct as written* — `npm --prefix .skilled/skills/system-spec-kit install` (exit 0) followed by
`… run build` (exit 0) does produce both `runtime/dist` and `runtime/cli/dist`, because the skill-root
`build` is a plain `tsc --build` over project references. An earlier probe of mine appeared to fail only
because I had run `install --dry-run`; the real failure in my first attempt was mine, not the repository's.

## Findings

### F1 — A build that satisfies every documented probe still leaves the continuity writer missing

- **Type:** bug (with UX limb) · **Severity:** P1 · **Release:** v4.0.0.0 (`330427cf30`, source-root move)
- **Confidence:** 0.95 — reproduced end to end.

Two sibling `dist` trees exist under `system-spec-kit/runtime/`, and the two consumers probe different ones:

| Consumer | Path it needs | Where declared |
| --- | --- | --- |
| `validate.sh` | `runtime/dist/lib/validation/orchestrator.js` | [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:21] |
| `/doctor:install` probe | `runtime/dist` | [SOURCE: .skilled/commands/doctor/assets/doctor-install-presentation.txt:35] |
| `/speckit:save`, `/speckit:complete`, `/speckit:implement` | `runtime/cli/dist/continuity/generate-context.js` | [SOURCE: .skilled/commands/speckit/save.md:113] |

The repair message both `validate.sh` and the doctor hand the operator is
`cd .skilled/skills/system-spec-kit/runtime && npm run build`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:432]. That is the **parent**
package's script — `npm run prepare-build && tsc --build && node scripts/finalize-dist.mjs`
[SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:17]. The CLI project is a *child*
(`runtime/cli/tsconfig.json` references `../../shared` and `..`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tsconfig.json:17]), so building the parent does **not**
build the child. Clone B confirms it:

```
install EXIT=0
runtime-only build EXIT=0
runtime/dist                                    -> present      (doctor: "Spec Kit build: found")
runtime/cli/dist/continuity/generate-context.js -> No such file or directory
validate.sh specs                               -> exit 1 (validated, not exit 3)
```

That is a false green on both gates at once: `validate.sh` runs happily and the doctor prints the build as
found, while `/speckit:save` — the only writer in the whole save path
[SOURCE: .skilled/commands/speckit/README.txt:58] — still cannot execute. The two `dist` trees are
independent build targets and only one of them is ever probed or named.

- **Verify:** `git clone --depth 1 file://$PWD /tmp/x && cd /tmp/x && npm --prefix .skilled/skills/system-spec-kit install && npm --prefix .skilled/skills/system-spec-kit/runtime run build && ls .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js`

### F2 — The most-used command has the worst failure message

- **Type:** ux · **Severity:** P1 · **Release:** v4.0.0.0 (`330427cf30`) · **Confidence:** 0.95, measured.

Exit codes and messages as observed in clone A before any build, same shell, same clone:

| Command | Exit | Message names the fix? |
| --- | --- | --- |
| `validate.sh specs` | 3 | **Yes** — "no validation orchestrator is available" + `Run: cd …/runtime && npm run build` |
| `dist/continuity/generate-context.js --help` | 1 | **No** — raw `Error: Cannot find module '…/dist/continuity/generate-context.js'` plus a Node loader stack |
| `dist/continuity/match-decision-table.js --help` | 1 | **No** — same raw `MODULE_NOT_FOUND` |

`validate.sh` is the one consumer that fails closed with a diagnosis
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:430] and a named repair
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:409]. The continuity writer has no
equivalent wrapper: it is invoked as a bare `node <path>` in every command asset
[SOURCE: .skilled/commands/speckit/assets/speckit-save-context-tail.yaml:16], so a fresh checkout's first
`/speckit:save` fails with a stack trace that says nothing about a build. The README does document the cause
and the command [SOURCE: .skilled/skills/system-spec-kit/README.md:510], but only inside a troubleshooting
section the failing user is not reading at that moment.

- **Verify:** `git clone --depth 1 file://$PWD /tmp/y && cd /tmp/y && node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --help; echo $?`

### F3 — Three `build` scripts, three different guarantees, one of them the documented fix

- **Type:** drift · **Severity:** P2 · **Release:** v4.0.0.0 · **Confidence:** 0.85, read + one executed.

| Entry point | Script | Runs the freshness guard? |
| --- | --- | --- |
| skill root | `tsc --build` [SOURCE: .skilled/skills/system-spec-kit/package.json:15] | no |
| `runtime/` | `prepare-build && tsc --build && finalize-dist.mjs` [SOURCE: .skilled/skills/system-spec-kit/runtime/package.json:17] | yes (`finalize-dist` writes the attestation or a checker-origin cache, [SOURCE: .skilled/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs:70]) |
| `runtime/cli/` | `prepare-build && tsc --build && record-build` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/package.json:13] | yes (`record-build`) |

The doctor's step 0 is the **skill root**, i.e. the one entry point that runs no freshness step at all
[SOURCE: .skilled/commands/doctor/assets/doctor-install-presentation.txt:42]. It still passes: in clone A the
unaided `dist-freshness.cjs check --package system-spec-kit/runtime --entry validation-orchestrator` returned
`@spec-kit/runtime dist is fresh` with **exit 0** after only a bare `tsc --build`. So "fresh" there is an
mtime-derived judgement, not the recorded attestation `record-build` was written to produce — the gate cannot
distinguish "built just now by the sanctioned path" from "built just now by any path".

- **Verify:** in a fresh clone, `npm --prefix .skilled/skills/system-spec-kit install && npm --prefix .skilled/skills/system-spec-kit run build && node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check --package system-spec-kit/runtime --entry validation-orchestrator; echo "exit=$?"`

### F4 — The `validate.sh` source-only fallback cannot serve a clone, which is the only way the repository ships

- **Type:** over-engineering · **Severity:** P2 · **Release:** v4.0.0.0 (`330427cf30`) · **Confidence:** 0.9.

`resolve_orchestrator` is commented "Compiled build preferred; the loader keeps source-only checkouts working"
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:399], and its fallback branch needs both
`ORCHESTRATOR_TS` and `TSX_LOADER`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:426]. `TSX_LOADER` points at
`$SCRIPT_DIR/../../../node_modules/tsx/dist/loader.mjs` → `system-spec-kit/runtime/node_modules/tsx/…`
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:23]. `node_modules` is gitignored
(`**/node_modules`, `.gitignore:53`), and clone A had no `system-spec-kit/runtime/node_modules` at all. A
"source-only checkout" produced by `git clone` therefore has neither the compiled tree nor the loader: the
branch is unreachable precisely for the population it names.

What breaks if it were removed: nothing for any clone; the survivors are checked-out-with-`npm install`-and-
no-build developer trees, and for them the branch silently executes unbuilt TypeScript that no freshness
attestation covers. The narrowing worth considering is to make the branch fail loudly when `dist` is absent
and `node_modules` is absent too — i.e. collapse it into F2's named-repair path.

- **Verify:** `git clone --depth 1 file://$PWD /tmp/z && ls /tmp/z/.skilled/skills/system-spec-kit/runtime/node_modules 2>&1`

### F5 — `/doctor:setup` never looks at the Spec Kit build; `/doctor:install` is the only detector and it is prose

- **Type:** ux · **Severity:** P2 · **Release:** v4.0.1.0 (`28b388e81b`, "add /doctor:symlink and
  /doctor:install") · **Confidence:** 0.9.

`grep -n "runtime/dist\|system-spec-kit" .skilled/commands/doctor/setup.md` returns **nothing** — the command
that "puts Skilled into a project repo and keeps it current there" (its own skill description) has no probe
for the build the rest of the toolkit depends on. Its only build-adjacent reporting is the advisor's staleness
ladder [SOURCE: .skilled/commands/doctor/setup.md:76], a different package entirely. Meanwhile the single
detector is a line inside a presentation asset
[SOURCE: .skilled/commands/doctor/assets/doctor-install-presentation.txt:35], not a script: no hook, CI job or
session start can call it. Combined with F1, the detection story is "one command, one path, one of two dists".

- **Verify:** `grep -c "runtime/dist" .skilled/commands/doctor/setup.md .skilled/commands/doctor/install.md` → `0` / `0`

### F6 — The command routers hide the dist dependency their own assets depend on

- **Type:** drift · **Severity:** P2 · **Release:** v4.0.0.0 · **Confidence:** 0.85, counted.

Per-file occurrence counts of `runtime/cli/dist` in `.skilled/commands/speckit/*.md`:
`save.md` 5, `handoff.md` 1, and **0** for `resume.md`, `plan.md`, `implement.md`, `complete.md`, `search.md`.
But `implement.md`'s and `complete.md`'s own workflow assets invoke the compiled writer:
[SOURCE: .skilled/commands/speckit/assets/speckit-implement.yaml:744] and
[SOURCE: .skilled/commands/speckit/assets/speckit-complete.yaml:1324], both carrying
`writer: "node …/runtime/cli/dist/continuity/generate-context.js"`. An AI following `/speckit:implement`'s
documented route therefore meets an unannounced build dependency at the last step of a long workflow — the
worst place to discover it, and the exact failure F2 shows is undiagnosable there.

- **Verify:** `for f in .skilled/commands/speckit/*.md; do echo "$(grep -c 'runtime/cli/dist' $f) $f"; done | sort -rn`

## Questions Answered

None of the two remaining strategy questions (Q6 upgrade dry-runs, Q7 `create.sh` versus `--strict`) were
answered this iteration; the fresh-clone pass was off both of their critical paths. No box is ticked.

## Questions Remaining

- **Q6 `/doctor:update`** — `align`, `apply`, `rollback`, `compat` still unrun. Eleventh iteration carrying
  it. F5 now explains *why* it stays unrun in spirit: the upgrade/doctor family has no probe for the build
  whose absence F1 shows is invisible.
- **New from F1:** do the upstream `runtime/dist` and `runtime/cli/dist` ever diverge in content, or is
  `runtime/cli/dist` always a strict subset? If it is a subset, the parent build is a complete fix for
  `validate.sh` and an incomplete one for `save`, which is exactly the gap F1 describes — worth one probe.
- **New from F1:** whether `runtime/cli/dist` also ships `match-decision-table.js`, which `save.md:71` and
  `save.md:73` require on *every* save; clone B left it absent too, but the file list is unmeasured.
- **New from F3:** what `finalize-dist.mjs`'s "checker-origin cache" (its own words, line 70) actually stores,
  and whether `check` can distinguish it from a real attestation. That decides if F3 is cosmetic or a hole in
  the freshness gate.
- **Carried:** Q3 freshness signal, Q4 stale-index gate, Q5 over-budget bind, Q7 `create.sh` + level
  templates, Q8 doc-drift remainder, Q9 rules/options pairs, Q10 operator friction, Q11 sk-code/sk-doc
  conformance, Q12 extensions for trigger index, continuity and goal.

## SCOPE VIOLATIONS

One, non-destructive, recorded rather than executed: the focus asked me to "Delete the /tmp clone at the end".
The run's BANNED OPERATIONS list forbids `rm` and `rm -rf` "against any path", with no `/tmp` carve-out, so I
did **not** delete either clone. `/tmp/skilled-fresh-probe-18` (built both dists) and
`/tmp/skilled-probe18-runtimeonly` (F1's reproduction) remain on disk for a later iteration to re-probe
without paying the clone-and-build cost again. Nothing outside `/tmp` was created or modified; the
repository, its index and its specs tree are untouched.

## Next Focus

Iteration 19: close F1's two residuals in one pass — enumerate both `dist` trees in clone A (which is already
built) with `find … -type f | sort`, diff the file lists, and specifically confirm whether
`match-decision-table.js` exists in `runtime/cli/dist`; then read `dist-freshness.cjs`'s `check` path far
enough to say whether "checker-origin cache" and a recorded attestation are distinguishable. Then spend the
remainder on Q6, which has now been carried eleven times: run `align`, `apply`, `rollback` and `compat` in
their dry-run modes only.
