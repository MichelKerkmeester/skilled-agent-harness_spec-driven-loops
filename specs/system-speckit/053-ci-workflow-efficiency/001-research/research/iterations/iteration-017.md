# Iteration 017 — sk-code-ci and /doctor:ci as one system

## Focus

How the two halves couple: how `sk-code-review` would apply an `sk-code-ci` standards packet to a
workflow-YAML diff, how `/doctor:ci` scaffolding would read that packet's templates as the single source
of truth, and which of the two must land first. Read-only: no hub file, workflow or script was modified.

## Actions Taken

1. Read `sk-code-review`'s surface-detection contract in the packet itself (the `detect_surface_evidence`
   restatement and the "Surface evidence used" output line) and the shared contract it restates.
2. Read the surface-axis declaration in `mode-registry.json` and the three hub checks that bind it
   (3f, 3g, 5f) plus 3k's command-grant comparison, which has never fired on this hub.
3. Read the doctor route manifest's schema, its "add a new target" procedure, and the route validator's
   non-fixture assertions (B3 unknown router, J1 target-set parity, K1 read-only-mutation policy).
4. Read one live doctor router (`/doctor:sk-code`) to see the command→asset→presentation split a new
   `/doctor:ci` would have to copy.

## Findings

**F17-1 (confirmed) — the surface axis is selected by stack markers, and `.github/` is not one of them,
so a workflow-YAML diff reviews as UNKNOWN today.**
`detect_surface_evidence` is specified as returning exactly SKILLED, OBSIDIAN, WEBFLOW or UNKNOWN
[SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:234], and the marker list lives in the shared
contract's detection order [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:37].
None of the four branches tests `.github/`: SKILLED needs the resolved path inside `.skilled/`, OBSIDIAN
needs plugin root markers, WEBFLOW needs webflow markers, and the generic-Node guard drops everything else
to UNKNOWN [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:83]. Consequence: a review
of `.github/workflows/*.yml` gets baseline security/correctness only, and the report prints
`Surface evidence used: UNKNOWN` [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:375]. The
standards packet therefore cannot be reached by diff path alone; reaching it means either a fifth surface
value in the shared contract or a diff-path conditional inside the review packet.

**F17-2 (confirmed) — the review packet restates the contract and is bound to it, so a fifth surface is
one contract edit plus one restatement, and the two cannot drift by policy.**
The packet states that `detect_surface_evidence` "restates that contract and keeps no rules of its own, so
it changes only when the contract does" [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:58], and
STEP 0 loads baseline plus surface evidence before scoring [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:66].
A `CI` surface is therefore two files in one change — `stack-detection.md` §2 plus the packet's function and
its docstring — but it is also the only coupling path that touches every `sk-code` consumer at once
(quality, review and the three existing surfaces), which is why it is the last step, not the first.

**F17-3 (confirmed) — the surface set is a closed, enumerated list, and a half-declared axis fails loudly.**
`extensions.surface-axis.surfaces` names the three packets explicitly
[SOURCE: .skilled/skills/sk-code/mode-registry.json:19] under the extension that owns the read-only
contract [SOURCE: .skilled/skills/sk-code/mode-registry.json:17]. Check 3f fails when the extension is
declared but no surface mode exists [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:908],
and 5f soft-fails when surface packets exist without the `surfaceBundle` outcome
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1179]. Adding `sk-code-ci` as a surface is
therefore four edits and no outcome change: the mode entry, the extension's `surfaces` array, a
`routerSignals` entry, and a `tieBreak` slot ahead of the native surface.

**F17-4 (confirmed) — a scaffolding command must not declare `command:` on a read-only surface mode, and
3k is the check that would catch it.**
3k reads the mode's `command` field through `COMMAND_PATTERN`
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:163], resolves it to
`.skilled/commands/<dir>/<name>.md`, compares its frontmatter `allowed-tools` against the mode's
`toolSurface.allowed`, and soft-fails on any grant beyond it
[SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:756]. No `sk-code` mode declares `command`
today, so 3k reports "no bound command" and has never compared anything on this hub. A surface is forced by
3g to `backendKind: evidence-base`, `mutatesWorkspace: false` and an allowed set drawn from
`{Read, Bash, Grep, Glob}` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:682] — and a
scaffolder needs `Write` or `Edit`. So: leave `command` off the surface mode, and let the doctor route own
the mutation.

**F17-5 (confirmed) — the doctor route manifest is the mutation authority, and it already carries the
Gate 3 answer for any command that writes.**
Every route declares `mutating` as `read-only | add-only | mutates` [SOURCE: .skilled/commands/doctor/_routes.yaml:29]
and a concrete `gate3_location` for the mutation it performs
[SOURCE: .skilled/commands/doctor/_routes.yaml:30], and live routes demonstrate a mutating route
[SOURCE: .skilled/commands/doctor/_routes.yaml:91]. The validator asserts the key set, asset existence,
duplicate targets, that the named router exists (B3)
[SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:142], target-set parity against the real
routers (J1) [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:69], and a read-only-mutation
policy (K1) that fails a `read-only` route whose own YAML writes
[SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:189]. `/doctor:ci` is therefore a `mutates`
route with a named target file, and its "dry-run default" is a route-level property, not a prompt promise.

**F17-6 (documented) — a new doctor target is a four-step, roughly six-file act, and the advisor bridge is
the slow part.**
The manifest states the procedure: append the route with three-or-more-word trigger phrases
[SOURCE: .skilled/commands/doctor/_routes.yaml:38]; list the target in the owning command's router and
presentation and add its row to `/doctor:setup`'s target list; add its activation entry to **both** the
`typescript` and `python` lists in `scoring-compatibility.json`, because a bridge without one stays
inactive; then rerun `derive-command-bridges.cjs`, `route-validate.sh` and `doctor-phrase-reach.cjs`. A
command that owns one route needs no positional target
[SOURCE: .skilled/commands/doctor/_routes.yaml:13]. Each doctor command is also a thin router that owns a
YAML workflow plus a separate presentation asset
[SOURCE: .skilled/commands/doctor/sk-code.md:4], and is mirrored into four runtime command directories —
`/doctor:runtime-mirrors` exists as its own route for exactly that surface.

**F17-7 (inferred) — the phase order is forced by the gates: standards packet first, `/doctor:ci` second,
review wiring third.**
Reasoning: (a) the packet can land without mutating anything outside `sk-code` — mode entry, extension
array, `routerSignals`, `tieBreak`, leaf-manifest regeneration, `ROUTER.md` — and it is read-only by
contract (F17-3, F17-4), so it carries no blast radius; (b) `/doctor:ci` scaffolding must read the packet's
templates, so the templates have to exist first or the route inlines them and there are two sources of
truth, which is the exact failure the topic asks to avoid; (c) the review wiring edits a shared contract
that four packets restate (F17-2), so it goes last, after the standards stop moving, and it is the only step
that can regress detection for the three existing surfaces. Risk/effort: packet low/low, `/doctor:ci`
medium/medium, review wiring low/medium. What would falsify the ordering: a decision to ship review wiring
with the packet in one change, which is possible but trades a second review cycle for one larger diff.

**F17-8 (inferred) — `/doctor:ci` should split into two routes, not be one mutating command.**
`mutating` is per-route [SOURCE: .skilled/commands/doctor/_routes.yaml:29], not per-command, so one router
file can own a read-only `report`/`list` route and a `mutates` `scaffold` route. That gives "dry-run
default" a structural home — the default target is the read-only one — and keeps K1 satisfied for the
read-only half [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:189]. The toggle half is bounded
by the earlier finding that repository variables are readable but not writable without an admin token, so
its route is at most `add-only` (printed instruction plus a verification read). Ownership split: standards
belong to the `sk-code` surface packet, inventory/report/scaffold belong to the doctor route manifest, and
nothing belongs to `sk-git` except the commit of a scaffolded file.

## Questions Answered

None marked as fully answered; the two open items this iteration targeted are now constrained rather than
closed (F17-1 through F17-8 constrain `/doctor:ci` ownership and give the `sk-code-ci` shape, but the
"who owns it" question still has a residual: a new `/doctor:ci` router versus a `ci` target on an existing
doctor command).

## Questions Remaining

- `/doctor:ci` as a new router file versus a target on an existing doctor command: the route manifest allows
  both [SOURCE: .skilled/commands/doctor/_routes.yaml:13], and the deciding fact is whether the command's
  presentation and `/doctor:setup` row are per-command or per-target.
- **Blocking phase 002, unchanged:** does a job skipped by `if:` satisfy a required status check?
- Carried forward: which jobs duplicate pre-commit hooks?
- Carried forward: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the
  include globs of `.skilled/hooks/vitest.config.ts`?
- How do the ranked recommendations group into ordered implementation phases 002 and later?

## Next Focus

The final iterations should close the phase grouping: fold F17-7's forced ordering into a ranked
recommendation table (saving, risk, effort) and assign each to a phase, and settle the last `/doctor:ci`
ownership residual — new router file versus additional target on an existing doctor command.
