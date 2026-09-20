---
title: "Research: Official Orca Skills and the CLI Routing Surface"
description: "Synthesis of the pre-extraction baseline and the three read-only research returns that back the cli-orca routing contract and its official-skill knowledge layer."
trigger_phrases:
  - "orca research"
  - "official orca skills inventory"
  - "orca cli surface"
importance_tier: "important"
contextType: "research"
---
# Research: Official Orca Skills and the CLI Routing Surface

<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->

## QUESTIONS

1. What does each of the eight official Orca skills cover, and where does the binding detail live?
2. Which Orca CLI and runtime surfaces must a local routing contract know about?
3. Which phrases should route to a local Orca CLI skill, and which near-miss phrases must not?
4. What did the repository look like before the extraction, so the after-state can be measured against it?

## METHOD

Baseline capture used the hub parent check, the advisor CLI, the compiled-routing CLI and a filesystem comparison of the two repository copies. The three research questions were then answered by three parallel read-only workers on the rostered research route, each with a bounded read list, a required citation format and no write permission outside its single output path. Returns were saved under `scratch/` with a verification header, and their citations were spot-checked against the source tree before use.

## FINDINGS

### F1. The official skill set is eight skills, not seven

The vendored snapshot ships `computer-use`, `linear-tickets`, `orca-cli`, `orca-emulator`, `orca-emulator-android`, `orca-linear`, `orca-per-workspace-env` and `orchestration`. The public documentation page lists every one of them except `linear-tickets` in its install table, and the snapshot manifest carries a release revision and a package digest for all eight. [SOURCE: `skills/` directory listing, `resources/skills/current-manifest.json`, `docs/site/content/docs/cli/skills.mdx`]

### F2. Each official skill is a discovery stub over a larger guide

The eight `SKILL.md` files are short. They tell an agent when to engage Orca and how to load the full guide from the running CLI. The version-matched detail lives in `skill-guides/`, which is several times larger per subject, and in `docs/reference/`. The design intent is stated directly: command flags live in the binary so they cannot drift from the app version. [SOURCE: `docs/site/content/docs/cli/skills.mdx`; `skill-guides/*.md`; `skills/*/SKILL.md`]

### F3. The subjects split into four groups

Worktrees, terminals, files, automations and the embedded browser belong to `orca-cli`. Multi-agent runs, workers, gates and messages belong to `orchestration`. Ticket workflows belong to `orca-linear`, with `linear-tickets` as a separate official surface for the flag-native CLI path. Simulator and emulator control belong to `orca-emulator` and `orca-emulator-android`, with desktop windows under `computer-use`, and per-workspace environment recipes under `orca-per-workspace-env`. [SOURCE: `skill-guides/*.md`; `skills/*/SKILL.md`]

### F4. Boundaries are explicit in the upstream guides

The upstream guides state their own exclusions. The computer-use guide excludes the embedded browser and points at `orca-cli`. The `orca-cli` guide keeps browser work inside its own `browser` subcommand family rather than sending it to a generic browser tool, and keeps supervised multi-agent work with `orchestration`. [SOURCE: `skill-guides/computer-use.md:14`; `skill-guides/orca-cli.md:33-45`]

### F5. Handoff creation has a documented default shape

An independent handoff is created with `worktree create --name <task> --no-parent --agent <agent> --prompt "<brief>" --json`, and the guide instructs callers to use `--no-parent` and omit `--base-branch` unless stacked work or a specific base is requested. Per-call model and effort flags are not available on the launcher, which forces a two-step path for custom agent arguments. [SOURCE: `skill-guides/orca-cli.md:36-45`]

### F6. Snapshot provenance is independently verifiable

Every official snapshot file has a release revision, a package digest and a tree digest in the snapshot registry, and an exact hash per file in the current manifest. The two repository copies were byte-identical before removal, and the removed tree copy has both an archive and the vendored copy available as rollback. [SOURCE: `resources/skills/current-manifest.json`; `resources/skills/snapshot-registry.json`; `scratch/baseline-pre-extraction.txt`]

### F7. The pre-extraction routing state was asymmetric

The hub itself was healthy: the parent check passed with ten modes and zero warnings. The advisor, however, returned no recommendation at all for an Orca CLI prompt while it did recommend the hub for a transport prompt. Stage-two compiled routing did resolve the same prompt to the Orca mode inside the hub. The post-extraction target is therefore a positive advisor answer for the new root, not a repaired regression. [SOURCE: `scratch/baseline-pre-extraction.txt`]

### F8. The near-miss space is dominated by unrelated labels

The holdout set that must stay unrouted includes unrelated product names, generic worktree and terminal vocabulary, generic browser vocabulary, generic multi-agent orchestration vocabulary and repository-scanning terms. Each group has a better local owner or no owner at all, and the routing contract must name those owners rather than absorbing the phrases. [SOURCE: `scratch/research-routing-boundaries.md`]

## DECISION INPUTS

- The knowledge layer needs both an authored reference and a verbatim snapshot, because the stubs are too thin to serve as the guidance and too official to be edited.
- The routing contract owns Orca CLI vocabulary and explicitly yields generic worktree, terminal, browser, orchestration and repository-scanning vocabulary.
- The contract must name the official skill surfaces as secondary entries rather than treating them as separate local skills.
- Version-matched flag detail is attributed to the guides, never invented locally.

## GAPS AND UNKNOWNS

- The live Orca runtime version differs from the snapshot's declared version, and the local runtime was never probed in this packet because runtime mutation is operator-gated.
- The snapshot records no source commit, so provenance is pinned by revision numbers and digests rather than by a commit identifier.
- The upstream install table omits `linear-tickets`, so the relationship between that skill and `orca-linear` is documented from the snapshot rather than from the public page.
