---
title: Official Orca Skills - Overview
description: Index of the eight official Orca Agent Skills covering the hybrid stub design, version-matched guide loading, install commands, surface boundaries and snapshot provenance.
trigger_phrases:
  - "official orca skills"
  - "orca skills overview"
  - "which orca skill owns this surface"
  - "orca skill boundaries"
  - "install official orca skill"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Official Orca Skills - Overview

Local index of the eight official Orca Agent Skills. Orca publishes each skill as a short discovery stub that tells an agent when to engage Orca and how to load the version-matched guide from the running binary, because the real command flags live in the binary (snapshot: docs/site/content/docs/cli/skills.mdx). Snapshot paths cited below resolve under `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/`. This skill keeps one authored reference per official skill under `references/orca-skills/` plus a verbatim snapshot of every stub as `assets/<name>.txt`.

## 1. OVERVIEW

The eight official skills form one family. Three of them, `orca-cli`, `computer-use` and `orchestration`, are the ones default agent setup usually installs, while the others cover Linear, the two emulator backends and per-workspace environment recipes (snapshot: docs/site/content/docs/cli/skills.mdx). One stub, `linear-tickets`, is a legacy alias rather than a separate surface, so seven install rows cover the eight names (snapshot: skills/linear-tickets/SKILL.md).

---

## 2. THE EIGHT OFFICIAL SKILLS

| Skill | Purpose | Use it for | Local reference |
|---|---|---|---|
| `computer-use` | Drives the GUI of a visible local app window through `orca computer` | Desktop apps via accessibility trees and safe UI actions | `references/orca-skills/computer-use.md` |
| `linear-tickets` | Legacy bundled name for `orca-linear`, kept so existing installs converge | Same Linear surface as `orca-linear` under the legacy name | `references/orca-skills/linear-tickets.md` |
| `orca-cli` | Operates Orca-managed worktrees, terminals, repos, automations, artifacts, skill sharing, worktree comments and the embedded browser through the `orca` CLI | Worktrees, terminals, files, automations, embedded browser | `references/orca-skills/orca-cli.md` |
| `orca-emulator` | iOS Simulator control from inside Orca with the live device view in the emulator pane | iOS Simulator control | `references/orca-skills/orca-emulator.md` |
| `orca-emulator-android` | Android device and emulator control from inside Orca over adb | Android emulator or device via adb | `references/orca-skills/orca-emulator-android.md` |
| `orca-linear` | Linear ticket work through Orca's CLI | Linear ticket read and write through `orca linear` | `references/orca-skills/orca-linear.md` |
| `orca-per-workspace-env` | Per-workspace environment recipes, the on-demand disposable runtime Orca creates fresh for each workspace | Environment recipes in `orca.yaml` | `references/orca-skills/orca-per-workspace-env.md` |
| `orchestration` | Coordinates supervised Orca workers: threaded messages, blocking ask/reply, task dispatch, worker_done/escalation waits, task DAGs, decision gates and coordinator loops | Multi-agent Runs, tasks, supervised workers, messages, gates | `references/orca-skills/orchestration.md` |

Purpose wording comes from each stub's frontmatter (snapshot: skills/`<name>`/SKILL.md) and the "Use it for" wording from the public install table (snapshot: docs/site/content/docs/cli/skills.mdx).

---

## 3. HYBRID STUB DESIGN

Each public install package is a hybrid discovery stub: a short `SKILL.md` that tells the agent when to engage Orca and how to load the full guide from the running CLI, while "Command flags live in the binary so they cannot drift from the app version" (snapshot: docs/site/content/docs/cli/skills.mdx). The orchestration stub states the design most explicitly: "This file is a discovery stub, not the usage guide." and "The full, version-matched Orca orchestration reference is served by the `orca` binary itself" (snapshot: skills/orchestration/SKILL.md).

The stubs for computer-use, orca-cli, orca-emulator, orca-emulator-android, orca-linear and orca-per-workspace-env each open with "This discovery stub loads the version-matched guide from the Orca executable used for this session." (snapshot: skills/orca-cli/SKILL.md, opening line). The linear-tickets stub says it uses the legacy name `linear-tickets` for `orca-linear` and that both use `ORCA linear ...` commands (snapshot: skills/linear-tickets/SKILL.md).

Every stub first resolves one executable for the session, in this order: the `ORCA_CLI_COMMAND` environment variable when set, then `orca-dev` in a dev checkout that exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca`. If the selected executable cannot run, the stub says to report the exact error and stop rather than fall through to another executable, which could silently target a different Orca build (snapshot: skills/orca-cli/SKILL.md, Resolve the CLI for this session).

---

## 4. LOADING A VERSION-MATCHED GUIDE

The full guide is loaded with:

```text
orca skills get <name> --full
```

`orca skills get <name>` prints the compact version-matched guide and `--full` prints the long guide (snapshot: docs/site/content/docs/cli/skills.mdx). Guides with action gates name conditional references, and one reference loads alone:

```text
orca skills get orchestration --reference references/<file>.md
```

`--references` lists the reference names, and the name may be bare, as in `recovery-and-cleanup`, or spelled as the guide writes it (snapshot: skills/orchestration/SKILL.md and docs/site/content/docs/cli/skills.mdx). Add `--json` when an agent needs deterministic output for automation, which the docs establish with `orca skills get orca-linear --json` (snapshot: docs/site/content/docs/cli/skills.mdx). The stubs say to prefer `--json` and to use the selected executable's `--help` for commands or flags the guide does not cover (snapshot: skills/orca-cli/SKILL.md, Load the version-matched guide before running Orca commands). `skills show` is an alias for `skills get` (snapshot: docs/site/content/docs/cli/skills.mdx).

---

## 5. INSTALLING OFFICIAL SKILLS

The public documentation establishes this install form for seven of the eight names (snapshot: docs/site/content/docs/cli/skills.mdx):

```bash
npx skills add https://github.com/stablyai/orca --skill <name> --global
```

The established rows are `orca-cli`, `orchestration`, `computer-use`, `orca-linear`, `orca-emulator`, `orca-emulator-android` and `orca-per-workspace-env`. The docs state that default agent setup usually installs `orca-cli`, `computer-use` and `orchestration` (snapshot: docs/site/content/docs/cli/skills.mdx).

The install table has no row for `linear-tickets`, so its install command is unknown. The docs state that existing `linear-tickets` installs still resolve (snapshot: docs/site/content/docs/cli/skills.mdx).

On headless hosts the docs establish local CLI wrappers that resolve the same `npx` commands, add non-interactive flags and do not need a running Orca runtime (snapshot: docs/site/content/docs/cli/skills.mdx):

```bash
orca skills install --skill orca-cli --skill orchestration
orca skills update --all
```

---

## 6. BOUNDARY MATRIX

| Surface | Owning skill |
|---|---|
| Orca worktrees, terminals, repos, automations, artifacts, skill sharing, worktree comments, agent session search | `orca-cli` |
| Full ownership handoff with no supervision, monitoring or DAG | `orca-cli`, which orchestration routes handoff owners to |
| Supervised coordination: Runs, Tasks, Dispatches, task DAGs, decision gates, coordinator loops | `orchestration` |
| Orca's embedded browser | `orca-cli`, never `computer-use` |
| Desktop GUI of a visible local app window, native apps and external browser windows | `computer-use` |
| iOS Simulator on macOS | `orca-emulator` |
| Android device or emulator over adb | `orca-emulator-android` |
| Linear tickets | `orca-linear`, with `linear-tickets` as the legacy bundled name |
| Per-workspace environment recipes in `orca.yaml` | `orca-per-workspace-env` |
| Ordinary worktree or workspace creation with no recipe involved | `orca-cli` |

Notes behind the matrix:

- The embedded browser boundary is stated by both sides. computer-use's stub says "Do not use for Orca's embedded browser (`orca-cli`)" (snapshot: skills/computer-use/SKILL.md) and orca-cli's guide says to use `orca-cli` for Orca's embedded pages and a page-automation tool such as Playwright or CDP for external pages, where "Desktop control asked for by name is `ORCA computer ...`, never a browser command." (guide: skill-guides/orca-cli.md).
- The handoff boundary: the orchestration stub routes full ownership handoffs to `orca-cli` unless asked to supervise, monitor or coordinate a DAG (snapshot: skills/orchestration/SKILL.md), and orca-cli's guide forbids `orca orchestration task-create`, `orca orchestration dispatch --inject` and `orca orchestration check --wait` for full handoffs (guide: skill-guides/orca-cli.md).
- The emulator boundary: `install`, `launch`, `permissions` and `logcat` are Android-only and fail against an iOS device with `emulator_unsupported`, while `tap`, `type`, `gesture`, `button`, `rotate`, `ax` and `exec` work on both backends (guide: skill-guides/orca-emulator.md and skill-guides/orca-emulator-android.md).
- orca-cli's reference table routes mobile emulator taps, gestures, typing, buttons, camera and permissions to `orca-emulator` (guide: skill-guides/orca-cli.md).

---

## 7. PROVENANCE AND SNAPSHOTS

Every stub's exact upstream wording is stored as `assets/<name>.txt`, with the `.txt` extension so the files stay byte identical to upstream and outside the markdown frontmatter contracts (assets/PROVENANCE.md). Each snapshot file is pinned by release revision and digest in the vendored manifests under the snapshot tree at `resources/skills/`, where `current-manifest.json` records the current `releaseRevision`, `packageDigest`, `gitTreeSha` and `exactSha256` per skill, `snapshot-registry.json` carries the per-revision history and `release-mapping.json` maps app versions onto revisions (assets/PROVENANCE.md, Snapshot source and Per-skill release records). The copies were verified byte for byte with `cmp` and by sha256 against the manifest's `exactSha256`, and all eight checks pass (assets/PROVENANCE.md, Verification). `PROVENANCE.md` also records the refresh procedure for a newer snapshot and says to record a mismatch instead of guessing when a snapshot file cannot be matched to a manifest entry (assets/PROVENANCE.md, Maintenance).
