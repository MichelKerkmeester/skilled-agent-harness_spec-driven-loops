# Iteration 3: Post-re-pin regeneration coverage (dsh links, mirrors, hook registrations, trigger index, advisor graph)

## Focus

Test the brief's claim that no post-re-pin regeneration exists, by mapping each regeneration surface a Barter-like tree needs onto the engine's manifest-expressed `layoutLinks` / `regenerate` / `verifyGenerated` blocks and onto the actual scripts' `--check` contracts.

## Findings

1. Barter's manifest already declares a `hook-registrations` pair — a regenerate step and its `--check` verify — pointing at `sync-hook-registrations.cjs`, so the brief's list is wrong on that item: hook registration regeneration is expressible and already expressed. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1394] [SOURCE: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1502]
2. The dsh skill sync is a clean regenerate/verify pair the engine can express today — `sync-skills-dsh.cjs` writes without flags and `--check` reports `MISSING`/`STALE`/`EXTRA` drift and returns 1 — yet Barter's manifest never names it, so `expect: "exit-0"` on `--check` would close the brief's dsh-link gap with no engine change. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs:46] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs:317]
3. `sync-runtime-mirrors.cjs` follows the same shape — no flag writes, `--check` collects `STALE`/`MISSING`/`EXTRA` drift and exits non-zero — so runtime-mirror regeneration is also a manifest entry, not an engine feature. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:70] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:317]
4. The trigger index already has the exact `fresh-true` contract the engine's `verifyGenerated` expects: `generate-trigger-index.mjs --check --json` returns a `fresh` boolean and exits 1 when a document is stale or the corpus is untrusted, so regeneration plus freshness is one manifest pair. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:33] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:565]
5. The advisor graph is the one surface the engine cannot fully express: rebuilding is `skill-advisor.cjs advisor_rebuild` (operator-gated, no freshness output), and the only checkable surface is `skill-graph-freshness.cjs`, which is report-only, exits 0 by default, and gates only under `--strict`; so a manifest can only pair an `advisor_rebuild` regenerate step with a `skill-graph-freshness.cjs --strict` exit-0 verify, never a `fresh-true` expectation. [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:1] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:20]
6. The re-pin workflow's own invariant claims the stage runs every step on a copy, but the engine deliberately strips `regenerate` and `verifyGenerated` from a staged run, so a clean `RESULT: STAGED` report can precede a live re-pin whose regeneration fails; the two contracts disagree and the stage report carries no line saying regeneration was skipped. [SOURCE: .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:40] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2914]
7. Regeneration steps are arbitrary argv run with `cwd` at the tree root and no allowlist, so a vendored repo's manifest is an execution surface: whoever writes `manifest.regenerate` decides what a re-pin runs, which is why a migration should copy a reviewed step list rather than accept one from an untrusted overlay folder. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1478] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1531]
8. Doctor already treats the dsh surfaces as first-class mirrors, with `dsh_skills`, `dsh_prompts` and `dsh_agents` scripted against `.dsh/skills`, `.dsh/prompts` and `.dsh/agents`, so a re-pin that omits `.dsh` from its runtime folders contradicts the doctor model, not just Barter's runbook. [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46]

## Ruled Out

- Assuming the engine needs a new regeneration mechanism: three of the five surfaces (dsh links, runtime mirrors, trigger index) are expressible with manifest entries the engine already supports.
- Assuming the advisor graph can be treated like the others: the rebuild has no read-only freshness mode, so it must be a regenerate step plus a separate report-only gate, and that asymmetry has to be documented rather than papered over.
- Trusting the repin workflow's stage invariant: the engine's stage branch contradicts it, so the workflow text needs the correction, not just the engine.

## Dead Ends

- Looking for an engine-level "post-repin hook": none; `regenerate` runs inside `applyUnderLock` after the copy, which is the post-repin point, so no new hook is needed.
- Looking for an advisor freshness JSON contract: `skill-graph-freshness.cjs` prints a panel, not a `fresh` field, so the `fresh-true` expectation cannot be reused there.

## Edge Cases

- Ambiguous input: "post-repin regeneration" could mean engine-owned steps or runbook steps; both were mapped, and the finding is that the split is a manifest-authoring question rather than an engine capability gap for three of five surfaces.
- Contradictory evidence: the repin workflow invariant and the engine's stage branch are incompatible as written; recorded in finding 6 without halting, per the fan-out contract.
- Missing dependencies: the dsh and runtime-mirror scripts import packages from the vendored tree's own install, so a regeneration step list must assume `.skilled` dependencies are present; a bare copy without `npm ci` would fail those steps.
- Partial success: all reads succeeded; no regeneration command was executed, so the check contracts are cited from source rather than observed.

## Sources Consulted

- /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/barter-overlays/overlay-manifest.json:1394, 1502
- .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs:46, 317
- .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:70, 317
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs:33, 565
- .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:1, 20
- .skilled/commands/doctor/assets/doctor-overlay-repin.yaml:40
- .skilled/commands/doctor/scripts/overlay-engine.cjs:1478, 1531, 2914
- .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46

## Assessment

- New information ratio: 1.0
- Questions addressed: Q3 (regeneration coverage), Q5 partially (workflow documentation accuracy)
- Questions answered: Q3

## Reflection

- What worked and why: reading each script's usage block and exit codes turned "missing regeneration" into a per-script manifest-authoring table, which is directly actionable.
- What did not work and why: assuming the advisor graph behaves like the other generators delayed the finding; its operator-gated rebuild and report-only check are genuinely different.
- What I would do differently: enumerate the generator scripts from the doctor runtime-mirror contract first, then check the manifest against that list.

## Recommended Next Focus

Root-file traps and cross-runtime adoption mechanics (Q4): `AGENTS.md`, `REPO RULES.md`, `.opencode/scripts`, fork-drifted files, and how the doctor install/helper/setup path wires the guard and the engine into a fresh repo.

## SCOPE VIOLATIONS

- No regeneration command was run and no file outside this lineage was touched; the workflow's `spec.md` writeback, `validate.sh` and memory save remain skipped as out of scope for this lineage.
