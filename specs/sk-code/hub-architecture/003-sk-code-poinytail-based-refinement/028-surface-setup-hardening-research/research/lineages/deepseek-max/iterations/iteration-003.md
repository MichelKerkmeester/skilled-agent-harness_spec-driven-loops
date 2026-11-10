# Iteration 3: Q4 — the two shapes weighed: new doctor command vs new sk-code hub mode

## Focus

Q4: should the setup surface be a new doctor command (`/doctor sk-code-setup` or a better name) referenced and integrated in the sk-code hub, or a new mode inside the sk-code hub (`sk-code-setup` or better)? The iteration read how the doctor family is built, registered and mirrored (`.skilled/commands/doctor/_routes.yaml`, the command docs, `route-validate.sh`, `command-catalog-mirror-check.cjs`, `sync-runtime-mirrors.cjs`) and how an sk-code mode is registered (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `ROUTER.md`, `SKILL.md`, canary, doctor invariants 3c/5e/5k). For each shape it records the exact files added or touched, where the hub would reference it, what it would run, its invariants, cost and blast radius, and naming candidates. It also judges whether a "set up my surface" prompt would route to a hub mode at all. Read-only; no copy probes were needed because every claim below is a committed-file read, and 0 shell commands were run (the copy recipes remain available for a later iteration).

## Actions Taken

1. Read state (config, state JSONL, strategy, findings registry, iterations 1-2): session `dr-028-deepseek-max-2026-10-13T17:31:23.657Z`, lineage `new`, iteration 3 of 5. Exhausted approaches respected: no whole-repo name grep, no row-by-row F-row reading.
2. Read the doctor route manifest `.skilled/commands/doctor/_routes.yaml` (full) and one doctor doc `.skilled/commands/doctor/runtime-mirrors.md` (full) for the router/presentation structure.
3. Read `route-validate.sh` (full) — its self-test fixtures name the rule set (B2, B3, C1, D1, I1, J1, K1, L1) — and the head of `command-catalog-mirror-check.cjs` for the index-copy contract.
4. Read the sk-code registration files: `mode-registry.json`, `hub-router.json`, `SKILL.md`, `README.md` (all full).
5. Read the root README block `What Adapting \`sk-code\` Looks Like` (README.md:1445-1485) and the head of the scaffolded add path `.skilled/commands/create/assets/create-skill-parent-auto.yaml`.
6. Greps (all read-only): `doctor` in `.skilled/skills/sk-code/` (5 incidental hits, none in SKILL.md/README.md/ROUTER.md); `doctor|sk-code` across `**/command-metadata.json` (0 hits in the three existing files); `doctor` in `.skilled/commands/README.txt` (13 hits); the head of `sync-runtime-mirrors.cjs` for the mirror map.

## Findings

| class | claim | evidence | NEW / ALREADY-COVERED | priority |
|---|---|---|---|---|
| SHAPE | Shape A's contract is documented and gated. A new doctor command needs: a router doc `.skilled/commands/doctor/<topic>.md`; a `_routes.yaml` row carrying all 8 required keys (command, target, yaml, setup_vars, allowed_flags, mutating, gate3_location, mcp_tools, trigger_phrases); an `assets/doctor-<target>.yaml` workflow plus its `-presentation.txt`; and `route-validate.sh` passing. The manifest states the add procedure verbatim: append the route, list it in the owning command's router and presentation, re-run route-validate.sh | [SOURCE: .skilled/commands/doctor/_routes.yaml:22-38]; [SOURCE: .skilled/commands/doctor/_routes.yaml:35-36]; [SOURCE: .skilled/commands/doctor/runtime-mirrors.md:20-26] | NEW (Q4; 025/026/027 never covered the doctor family's construction) | P2 |
| SHAPE | `route-validate.sh` enforces eight rules, each proven by a self-test fixture: B2 required keys, B3 the command must name an existing router, C1 duplicate target, D1 the YAML asset must exist, I1 every `script_invocations` path must exist on disk, J1 target-set parity (the target name must appear in the owning router's `.md`), K1 a read-only route's workflow YAML must not declare a write, L1 activity coverage (every script the route names must be invoked by the workflow) | [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:93-241] (fixtures and `run_fixture` calls), delegation at [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:247-251] | NEW | P2 |
| SHAPE | Shape A overlaps an existing doctor route: `/doctor:skill-advisor parent-skill` already runs `parent-skill-check.cjs "{parent_skill_dir}"` plus `ci-skill-root-metadata.cjs` — exactly the first two commands of the README battery — and its trigger phrases already name "mode-registry drift guard" and "single graph-metadata identity". `/doctor:runtime-mirrors` separately owns mirror parity. Of the battery's six commands, 2 have a doctor home today, 4 (compiled-route-guard, compiled-route-sync --check, run-all-drift-guards.sh, the compiled-route prompt probe) have none | [SOURCE: .skilled/commands/doctor/_routes.yaml:140-160]; [SOURCE: .skilled/commands/doctor/_routes.yaml:195-217]; [SOURCE: README.md:1474-1483] | NEW | P1 |
| SHAPE | Shape B's cost is a 15+-file change plus a contract extension. A hub mode touches: `mode-registry.json` `modes[]` and `extensions.surface-axis.surfaces`; `hub-router.json` `tieBreak` + a `routerSignals` entry + its `vocabularyClasses`; `leaf-manifest.json` regeneration; `ROUTER.md` section 11 (hand-edited — "no command writes it"); the `SKILL.md` surface tables and the "exactly three surfaces" sentence; `stack-detection.md` markers; the root README surface lines; the canary fixture plus its authored twin copy; the compiled manifest re-mint and copy; `graph-metadata.json` and `description.json`; the manual-testing-playbook rows. The scaffolded path `/create:skill-parent update --surfaces` exists but creates a *surface* packet, and the registry's two axes admit only `workflow` (a process mode that acts on code) or `surface` (read-only domain evidence) — a setup mode is neither | [SOURCE: .skilled/skills/sk-code/mode-registry.json:5-9]; [SOURCE: .skilled/skills/sk-code/mode-registry.json:16-21]; [SOURCE: .skilled/skills/sk-code/hub-router.json:7]; [SOURCE: .skilled/skills/sk-code/hub-router.json:20-47]; [SOURCE: .skilled/skills/sk-code/SKILL.md:25-40]; [SOURCE: README.md:1458-1461]; [SOURCE: README.md:1466-1472] | NEW (extends 026 R1: the scaffolded add path exists for surfaces, not for a setup mode) | P1 |
| SHAPE | Shape B is a routing dead end. `discoveryClasses: ["hub-identity"]` are "intentionally referenced by NO mode's scoring classes ... a prompt carrying only it scores zero modes and defers"; every `vocabularyClasses` entry is code-work vocabulary (quality, review, webflow, opencode, obsidian) and none matches setup language; the advisor routes the single identity `sk-code` whose description is "Implement, debug and verify code" and surface packets are advisor-invisible by design. The hub is entered by a code prompt or an explicit mode hint (`Invoke it as sk-code with an optional mode hint such as quality: <request>`). A "set up my surface" prompt would not route to sk-code, and a setup mode would be reachable only by an explicit hint — i.e., not by the users who need setup guidance | [SOURCE: .skilled/skills/sk-code/hub-router.json:17-18]; [SOURCE: .skilled/skills/sk-code/hub-router.json:48-95]; [SOURCE: .skilled/skills/sk-code/SKILL.md:3]; [SOURCE: .skilled/skills/sk-code/SKILL.md:23]; [SOURCE: .skilled/skills/sk-code/SKILL.md:74] | NEW | P1 |
| SHAPE | Naming conventions observed. Doctor commands are `/doctor:<subsystem>` (speckit, skill-advisor, deep-loop, runtime-mirrors, git, mcp, env, update), and route targets are short nouns for the audited object (speckit-retrieval, parent-skill, router-reach, skill-budget, skill-graph-freshness, runtime-mirrors, hooks, standards). Fitting candidates: a target `surface-setup` (or `surfaces`) under a new `/doctor:sk-code` command, or the same target under the existing `/doctor:skill-advisor`; `sk-code-setup` fits the packet-name grammar but no axis. The doctor route manifest notes `trigger_phrases` are inert today — dispatch is presentation-menu/argv-driven, not advisor-driven — so neither shape gains advisor reach | [SOURCE: .skilled/commands/README.txt:161-169]; [SOURCE: .skilled/commands/doctor/_routes.yaml:41-257] (targets); [SOURCE: .skilled/commands/doctor/_routes.yaml:13-20] | NEW | P2 |
| OK | Doctor commands are not advisor-routed and not registered in any hub `command-metadata.json`: a grep for `doctor|sk-code` across the three existing metadata files (sk-design, sk-doc, system-deep-loop) returns 0 hits, and the sk-code hub contains zero doctor references in SKILL.md/README.md/ROUTER.md (5 incidental hits only, in a style guide, a catalog, a changelog and two benchmark reports). Any doctor-side setup surface would be discovered via the README block and the doctor menu, not by routing | grep outputs; [SOURCE: .skilled/skills/sk-code/README.md:116-122] (hub VERIFICATION section exists as a reference site); [SOURCE: README.md:1474-1483] | NEW | P2 |
| OK | The external user's green battery already exists as six documented commands (README.md:1476-1483), and 3c's removal failure names the README block as the closure (iteration 2). The Q4 gap is packaging and a single read-only entry point, not missing checks; the README block's "Verify." step is the natural reference site for any new command | [SOURCE: README.md:1474-1483]; iteration-002 finding 4 (3c message text) | partially NEW (026 R9 built the block; the battery-packaging gap is new) | P2 |
| AUTOMATION | Mirroring a new doctor command is automated: `sync-runtime-mirrors.cjs` walks `.skilled/commands` (excluding assets/scripts/fixtures) and owns the symlink trees, with `.claude/commands` as a mirror target — the runtime-mirrors doctor check then guards it. The manual residue is the index copies: `.skilled/commands/README.txt` group row (count 8), the tree line, and the doctor family section, which `command-catalog-mirror-check.cjs` treats as structural (drift drives exit 1) | [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:34-47]; [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:82-102]; [SOURCE: .skilled/commands/README.txt:46]; [SOURCE: .skilled/commands/README.txt:102]; [SOURCE: .skilled/commands/README.txt:157-169]; [SOURCE: .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:7-42] | NEW | P2 |

## Options (evidence-bound)

| option | what it changes, path:line | failure it prevents today | cost and blast radius | cheaper move and why it fails |
|---|---|---|---|---|
| New read-only doctor target `surface-setup` under `/doctor:skill-advisor`, running the README battery | `_routes.yaml` new route row (~10 lines) + `assets/doctor-skill-advisor-surface-setup.yaml` + presentation row + `skill-advisor.md` execution-targets table; scripts are the six battery commands, all existing | The six-command copy-paste battery with six separate interpretations ([SOURCE: README.md:1477-1482]); after a bare removal the user sees 113 invariant failures and 2 guard failures (iteration 2) with no single entry point that says which setup step is missing | ~4 files inside the doctor family; route-validate (B2/D1/I1/J1/K1/L1) + command-catalog structural tier; no canary/compiled re-mint; no advisor change; blast radius = doctor family + one README.txt prose row | Extending the existing `parent-skill` route in place: its contract is a structural audit of graph-metadata/registry ([SOURCE: .skilled/commands/doctor/_routes.yaml:140-153]), so folding compiled-route and drift-guard failures under it would misreport unrelated failure classes under a structural-audit name and change what a passing `parent-skill` means |
| New standalone doctor command `/doctor:sk-code` (target `surface-setup` or `surfaces`) | New `.skilled/commands/doctor/sk-code.md` router; `_routes.yaml` route; `assets/doctor-*.yaml` + presentation; `.skilled/commands/README.txt:46` (count 8→9), `:102` tree, `:157-169` section; one reference line in the README block and the hub README VERIFICATION section | Same battery friction, plus gives the README block and 3c's message a stable, sk-code-named reference target; the hub currently has zero doctor references | 4-6 new files + 3 index edits; route-validate B2/B3/D1/I1/J1/K1/L1; command-catalog structural tier; mirrors auto-synced; no routing-contract change; blast radius = doctor family + README.txt | Option 1 alone: `/doctor:skill-advisor surface-setup` reads as an advisor concern, so the external user's "sk-code setup" vocabulary never matches the command name; the README reference would have to teach the odd name |
| New hub mode `sk-code-setup` (shape B) | `mode-registry.json:19,22-115`; `hub-router.json:7,20-95`; `leaf-manifest.json`; `ROUTER.md` §11 by hand; `SKILL.md:25-40`; `stack-detection.md`; root README; canary fixture + authored twin; compiled manifest re-mint; `graph-metadata.json`/`description.json`; doctor 3c/5b/5e/5k/10a | Nothing observed: setup prompts do not route to sk-code (finding 4), and a new mode would be advisor-invisible, reachable only by an explicit hint; the registry's two axes admit neither a setup workflow nor a setup surface | 15+ files, a two-axis contract extension, canary/compiled re-mint and the full doctor invariant set — the highest blast radius of the three | Registering it as a `workflow` mode: fails the axis contract (workflow modes are processes that act on code, [SOURCE: .skilled/skills/sk-code/mode-registry.json:5-9]) while 5b/5e still demand a signal and a tieBreak slot, so the cost stays and the routing dead end remains |

Rejection note (Q5 input): shape B is rejected on this evidence — a routing vehicle that cannot be reached by its intended prompt is worse than a named doctor surface, and its cost is an order of magnitude larger. No recommendation re-makes 025/026/027 shipped work; option 1 or 2 is a new, evidence-bound candidate.

## Questions Answered

- Q4: Should the setup be a new doctor command or a new sk-code hub mode, what should it be called, where would it be referenced and what does each cost? — Answered: the doctor side is the viable shape. A new standalone `/doctor:sk-code` command (target `surface-setup`) or a `surface-setup` target under the existing `/doctor:skill-advisor`; it would run the six-command README battery read-only; it would be referenced in the README block's "Verify." step and the hub README VERIFICATION section; the hub mode shape is rejected (routing dead end, 15+-file cost, two-axis contract conflict).

## Questions Remaining

- Q1 remainder: fresh clone from `git clone` to a green battery; scaffolded-removal re-mint behavior (canary fixture, compiled manifest) — not probed.
- Q2: the clone-to-battery journey — partially informed here (the battery is README:1476-1483) but the fresh-clone probe is not done.
- Q3, Q5, Q6 untouched.
- Detail left uncaptured (iteration 2): the identity of the second failed guard in the umbrella run.

## Ruled Out

- Copy probes for Q4: unnecessary — the doctor family's registration, validation and mirroring contracts are all committed files, and every claim above is a path:line read. The recipes remain for the Q2 fresh-clone journey.

## Dead Ends

- None definitive.

## Edge Cases

- Ambiguous input: the two shapes were named explicitly; naming candidates are recorded as candidates only — no name is asserted as chosen (the operator asked for "a better name").
- Contradictory evidence: none encountered this iteration.
- Missing dependencies: none.
- Partial success: none — all planned reads completed; no shell command was needed.

## Sources Consulted

- `.skilled/commands/doctor/_routes.yaml` (full), `.skilled/commands/doctor/runtime-mirrors.md` (full)
- `.skilled/commands/doctor/scripts/route-validate.sh` (full), `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:1-80`
- `.skilled/skills/sk-code/mode-registry.json` (full), `hub-router.json` (full), `SKILL.md` (full), `README.md` (full)
- `README.md:1445-1485` (root, the adapting block and battery), `.skilled/commands/create/assets/create-skill-parent-auto.yaml:1-100`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:1-110`
- `.skilled/commands/README.txt:46,102,157-169`; greps over `.skilled/skills/sk-code/` and `**/command-metadata.json`
- Prior iterations: `iterations/iteration-001.md`, `iterations/iteration-002.md`

## Assessment

- New information ratio: 0.72 (7 fully new findings of 9; 1 partially new; 1 redundant re-confirmation of the hub's zero doctor references; +0.0 simplicity bonus — the shape comparison reduces open Q4 questions to a single recommendation)
- Questions addressed: Q4 (fully)
- Questions answered: Q4

## Reflection

- What worked and why: reading the validator's self-test fixtures gave the doctor route contract's exact rule set (B2-L1) in one file, which made the "files it touches" list falsifiable rather than inferred; reading `mode-registry.json` and `hub-router.json` together showed both the two-axis contract and the routing dead end in two files.
- What did not work and why: the first `What Adapting` grep returned 87 files, dominated by spec archives and lineage prompts — the same noise pattern iteration 1 recorded; targeting README.md directly was decisive.
- What I would do differently: for a known-string lookup, grep the exact target file first instead of a repo-wide pattern.

## Recommended Next Focus

Q2/Q3 with the copy recipes: the fresh-clone journey from `git clone` to a green battery (the six README commands as the battery) recording every friction point, plus the scaffolded-removal re-mint probe as the Q1 tail; then Q5/Q6 classification with the option rows above as input.
