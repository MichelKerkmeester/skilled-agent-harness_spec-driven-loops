# Iteration 4 - Cross-repo references: every listing of the doctor surface

## Dispatcher

- Mode: review (fan-out lineage `deepseek-max`), iteration 4 of 5, stop policy `max-iterations`
- Focus: `traceability` over the five cross-repo entries, plus a repo-wide sweep for every listing
  of doctor commands, sk-git surfaces and `/doctor:git` targets (the steer's explicit ask)
- Executor: this process (iterations run inline; no nested dispatch)

## Files Reviewed

- `README.md` (root) — doctor section (lines 1233-1290), the sk-git adaptation section
  (lines 1495-1512) and the git-hook section read; every `/doctor:git` mention inspected
- `.skilled/commands/README.txt` — doctor table read (lines 155-176)
- `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` — full read (65 lines)
- `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` — full read (105 lines)
- `.hermes/skills/sk-git/SKILL.md` — compared against `.skilled/skills/sk-git/SKILL.md` with the
  generated banner dropped and link rewrites normalized (diff = banner + path rewrites only)

Repo-wide sweep (read-only) beyond the manifest:

- `rg -l "doctor:git"` across the repo (excluding `node_modules`/`z_archive`); every file with a
  target listing checked: `doctor-setup.yaml` + `doctor-setup-presentation.txt` (17 rows = 14
  routes + update/env/mcp, all four `/doctor:git` rows present), `doctor-env` assets,
  `.skilled/scripts/git-hooks/README.md`, `git-hooks/lib/README.md`, `git-hooks/lib/gates.tsv`,
  `sk-create-command/assets/command-contract.json`
- Advisor bridge reach: `command-bridges.generated.json` entry `command-doctor-git-setup` carries
  the four manifest trigger phrases verbatim and `/doctor:git setup` as its marker
- `route-validate.sh` (iterations 2): 14 routes, targets in parity with router and presentation;
  `generate-command-routers.cjs`: 34/34 routers clean

## Findings

### P0 Findings

No P0 findings.

### P1 Findings

No P1 findings.

### P2 Findings

1. **Doctor category overview never mentions `/doctor:sk-code`** -- `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:17` -- the overview's §1 enumeration presents the shipped doctor surface and ends "`/doctor:mcp install|debug`, `/doctor:env` and `/doctor:git <hooks|standards|setup>` complete the set", but `/doctor:sk-code [setup]` exists as a route (`.skilled/commands/doctor/_routes.yaml:221-222`), a command file, and a README bullet; §2's "The other commands are tested where they belong" mapping also omits `/doctor:sk-code` in the sk-code playbook, and the §3 implementation table omits `sk-code.md` while listing every other command file. The release edited this file twice yet left the omission.
   Finding class: traceability / listing completeness
   Scope proof: the overview is a manifest entry; the missing command is verified in the route manifest, the commands README table, and the system-spec-kit playbook README (which does name `/doctor:sk-code`, DOC-382/383).
   Affected surface hints: feature-catalog category overview; the sk-code command family's discoverability from the sys-spec-kit catalog; `_routes.yaml` parity checks do not cover prose enumerations.
   Case: a reader who reaches the doctor surface through this overview never learns `/doctor:sk-code setup` exists, while the root README and the commands table list ten commands.

2. **Root README gives the new setup command two different verdict sets, one of them incomplete** -- `README.md:1262` -- the `/doctor:git setup` bullet says "It prints PASS, FAIL, SKIP or UNKNOWN for each", while the same README's verification paragraph (line 1507) says "prints PASS, FAIL, SKIP, UNKNOWN or DEGRADED for each" and the implementation emits DEGRADED (gate saved off) with exit 3 (iteration 1). The bullet's vocabulary makes a DEGRADED row look impossible and drops the exit-3 case from the command summary.
   Finding class: traceability / documentation accuracy
   Scope proof: both lines are in `README.md`, a manifest entry; the five verdicts and the exit-3 mapping are verified against `git-setup-check.cjs` in iteration 1 and stated consistently in the YAML, presentation and catalog sibling docs.
   Affected surface hints: root README command summary and verification paragraph; any user scripting against the documented verdict set.
   Case: a user reading the command list prepares for PASS/FAIL/SKIP/UNKNOWN only and misreads a gate-saved-off `STATUS=DEGRADED` run, even though the same page's Verify section documents it.

## Traceability Checks

- `spec_code` (core): partial — cross-repo prose checked against the route manifest, the battery and
  the generated advisor bridges; divergences are findings 1-2.
- `checklist_evidence` (core): partial — validation this iteration is the route manifest read, the
  bridge JSON, the Hermes normalization diff and the repo-wide sweep, all cited above.
- `skill_agent` (overlay): partial — the Hermes mirror is content-identical to the canonical
  sk-git SKILL.md (banner and link rewrites only).
- `agent_cross_runtime` (overlay): pass — `.hermes/skills/sk-git/SKILL.md` was diffed against the
  canonical source; no content drift.
- `feature_catalog_code` (overlay): partial — the category overview's enumeration is incomplete
  (finding 1).
- `playbook_capability` (overlay): pass — the system-spec-kit doctor-commands README maps every
  command to its own playbook and names the sk-git DOC-369..DOC-384 range correctly.

## Integration Evidence

- `.skilled/commands/doctor/assets/doctor-setup-presentation.txt:19-35` lists 17 rows — all 14
  `_routes.yaml` routes plus `/doctor:update`, `/doctor:env list` and `/doctor:mcp` — and the
  `/doctor:git` rows name `setup`, `hooks` and `standards` with correct mutation classes.
- `.skilled/commands/doctor/assets/doctor-setup.yaml:52-53` runs the sk-git setup battery as a
  leg and names `/doctor:git setup` as its repair, matching the battery's exit contract.
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json:250,262` pins
  `/doctor:git setup` as read-only and lists `/doctor:git <hooks|standards|setup>` in the
  family's invocation aliases.
- Advisor bridge reach: `command-bridges.generated.json` entry `command-doctor-git-setup`
  carries all four manifest trigger phrases and the `/doctor:git setup` marker, so the new
  target is routable through the advisor.
- `.skilled/scripts/git-hooks/README.md:30`, `lib/README.md:43` and `lib/gates.tsv:6` point gate
  configuration work at `/doctor:git hooks`, which exists and matches `git-hook-gates.cjs`.
- The system-spec-kit playbook README (line 26) maps `/doctor:git` to sk-git DOC-369 to DOC-374
  and DOC-384, matching the sk-git playbook's own doctor README and the index.

## Edge Cases

- The sweeps rely on lexical search; a listing that spells the command with a wildcard or splits
  it across lines would not be found. The route manifest and the advisor bridge JSON provide the
  machine-checked side.
- `doctor-env` assets mention `/doctor:git hooks` without `setup`; that is correct in context
  (gate settings pointer), not a missing-target listing.
- The root README's "Ten commands ... the eight routed ones share the manifest" count was checked
  once against the manifest (7 commands carry routes; mcp's companion rows also live in the file),
  read as deliberate, and not filed.

## Confirmed-Clean Surfaces

- Root README pointers: the command list names `/doctor:git <hooks|standards|setup>`; the sk-git
  adaptation section routes users to `standards`, `hooks` and the `setup` verification with the
  battery's exact invocation; the git-hook section names `standards` and `hooks`.
- `.skilled/commands/README.txt` lists ten command files with `/doctor:git <hooks|standards|setup>`
  and `/doctor:sk-code [setup]` present.
- The Hermes mirror is content-identical to the canonical sk-git SKILL.md; all differences are the
  generated banner and link rewrites.
- `category-overview.md` names `/doctor:git <hooks|standards|setup>` in all three of its git
  mentions, including the source table row for `git.md`.

## Ruled Out

- "A stale advisor bridge cannot route `/doctor:git setup`": ruled out — the generated bridge
  carries the setup entry and its four phrases.
- "The umbrella `/doctor:setup` listings miss the git setup target": ruled out — both YAML and
  presentation name it.
- "The Hermes skill mirror drifted from the canonical SKILL.md": ruled out — normalized diff clean.

## Next Focus

- Dimension: traceability + maintainability (changelogs and final cross-check)
- Focus area: `.skilled/skills/sk-git/changelog/v1.9.0.0.md` and
  `.skilled/changelog/skilled/v4.0.0.11.md`; verify each changelog against the
  `sk-create-changelog` contract and against the release commits, then re-check the run's
  earlier findings for still-active status
- Reason: charter order, and the changelog is the release's own claim sheet — every claim in it
  is checkable against the artifacts reviewed in iterations 1-4
- Required evidence: changelog validator; the release commits (`de67ec1678`, `3a0e17414e`,
  `45c79baac1`, `6c2c3304d3`); re-read of iterated findings for P0/P1 status
- Rotation status: cross-repo surface complete; findings 1-2 stand unless disproved.

## Verdict

Review verdict: CONDITIONAL
