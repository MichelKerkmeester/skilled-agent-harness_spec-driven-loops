---
title: Official Orca Skill - Per-Workspace Environments
description: Discovery-stub reference for the official orca-per-workspace-env skill, which owns Orca per-workspace environment recipes for cloud sandboxes, VMs, SSH hosts and local containers, with its autonomy envelope and doctor loop.
trigger_phrases:
  - "orca per workspace environment recipe"
  - "orca environmentRecipes"
  - "orca vm recipe doctor"
  - "orca per-workspace env"
  - "orca recipe setup"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Official Orca Skill - Per-Workspace Environments

Local reference for the official `orca-per-workspace-env` skill. The upstream file is a discovery stub: it declares when to engage, then loads the version-matched guide from the Orca executable used for the session, because the real flags live in the binary. Snapshot paths cited below resolve under `specs/cli-orca/002-consolidate-official-orca-skills/context/orca-main/`. This is the heaviest of the eight official skills, so a local task that only needs a worktree should not route here.

---

## 1. OVERVIEW

`orca-per-workspace-env` declares set up, review, debug or validate for an Orca per-workspace environment recipe, the on-demand, disposable runtime, cloud sandbox, VM, SSH host or local container, that Orca creates fresh for each workspace (snapshot: skills/orca-per-workspace-env/SKILL.md, frontmatter). Engage it to stand up a new recipe end to end, fix an `environmentRecipes` entry in `orca.yaml`, scaffold provider lifecycle scripts or resolve an `orca vm recipe doctor` failure (snapshot: skills/orca-per-workspace-env/SKILL.md, frontmatter). Use `orca-cli` for ordinary worktree and workspace creation with no recipe involved (snapshot: skills/orca-per-workspace-env/SKILL.md, frontmatter description).

The stub resolves one executable for the session in this order: the `ORCA_CLI_COMMAND` environment variable when set, then `orca-dev` in a dev checkout that exposes `ORCA_DEV_REPO_ROOT`, then `orca-ide` on Linux outside an Orca-managed terminal, then `orca`. If the selected executable cannot run, report its exact error and stop rather than falling through to another executable (snapshot: skills/orca-per-workspace-env/SKILL.md, Resolve the CLI for this session). The version-matched guide then loads with:

```text
ORCA skills get orca-per-workspace-env
```

Inside the lifecycle scripts the `ORCA` placeholder does not apply, because `orca serve` written there runs on the remote machine's own binary (guide: skill-guides/orca-per-workspace-env.md, header note).

---

## 2. AUTONOMY ENVELOPE

The guide fixes what the agent may do without asking again and where it must stop (guide: skill-guides/orca-per-workspace-env.md, Autonomy envelope):

- Without asking again: read the repo and its `orca.yaml`, detect provider CLIs and their login state and scaffold and edit files under `scripts/orca-vm/`. It may also run `ORCA vm recipe doctor` without `--provision`.
- Explicit OK before each paid step: the base snapshot, the auth snapshot and `--provision`. One OK covers the whole `--provision` fix-and-rerun loop.
- Stop for the interactive agent login, which the agent cannot drive because it has no TTY for `docker exec -it` or `ssh -t`. The user runs the login and reports when it is done (guide: skill-guides/orca-per-workspace-env.md, Autonomy envelope and Agent-auth snapshot).
- Never create an Orca workspace except for the optional step-10 test the user asked for. Do not create Git commits unless asked.
- Preserve actionable provider errors and the failing command. Redact secrets and clean up resources created by a failed step.

The setup workflow runs in a fixed order driven with the user. A `[CHECKPOINT]` label marks a step the autonomy envelope stops for: inspect the repo, interview the user up front without picking choices for them, check prerequisites, scaffold the scripts and state file, build the base snapshot (paid and slow), authenticate the agent (interactive), wire the recipe so `orca.yaml` points create, suspend, resume and destroy at the scripts, dry-run the doctor, run the live `--provision` self-test, then optionally run the workspace test only if asked. The auth snapshot boots from the base snapshot, and `create` boots from the authenticated snapshot it produces (guide: skill-guides/orca-per-workspace-env.md, Setup workflow).

---

## 3. CREDENTIAL AND SNAPSHOT RULES

Credential rules (guide: skill-guides/orca-per-workspace-env.md, Autonomy envelope and Credentials):

- Never write a credential into a script, `userData`, the state file or a commit.
- Never choose a plan or region, or invent a scope, project or billing id. Ask the user.
- The git token is read from `GH_TOKEN` or `GITHUB_TOKEN`, falling back to `gh auth token` and passed to the environment only through the provider's ephemeral `--env`. Inside the environment a `GIT_ASKPASS` helper with `x-access-token` carries it, plus `GIT_TERMINAL_PROMPT=0` so a missing token fails fast instead of hanging. The helper is removed after the clone or fetch.
- Provider auth relies on the provider CLI's logged-in session, not checked-in keys. Agent auth lives in the authenticated snapshot, never in a file the agent writes. The state file holds only non-secret wiring: snapshot ids, scope, project, port, repo URL and ref.

Snapshot rules (guide: skill-guides/orca-per-workspace-env.md, Base snapshot):

- Never snapshot a machine on which the Orca runtime has already run. The first `orca serve` creates the runtime's user-data directory, and everything in it is baked into the image and shared by every environment booted from it: the pairing keypair and device-token registry (`orca-devices.json`, `orca-e2ee-keypair.json`), `agent-session-authority.key`, and the build box's logs, terminal history and orchestration database. Two VMs from one such snapshot emitted identical `deviceToken` and `pairedDeviceId`.
- Snapshot before the runtime has ever run, or delete the resolved user-data directory first, resolved as `ORCA_USER_DATA_PATH` or `${XDG_CONFIG_HOME:-$HOME/.config}/orca`. Resolve symlinks and inspect that path before deleting it. It must be an absolute directory dedicated to Orca runtime data, never `/`, the home directory or an ancestor of home. Empty or relative paths are refused.
- The same rule applies to the auth layer: if `orca serve` ran on the machine to smoke-test it, delete the runtime's user-data directory before re-snapshotting, or every workspace from the image shares one pairing identity (guide: skill-guides/orca-per-workspace-env.md, Agent-auth snapshot).

---

## 4. DOCTOR AND PROVISIONING LOOP

`ORCA vm recipe doctor <recipe-id> --repo-path <repo> --json` validates static wiring only and boots nothing. It checks local-host execution, the repo path, that the recipe id exists, that the create, destroy, suspend and resume command paths resolve, that suspend and resume are paired and that each script is executable, the POSIX exec bit, skipped on Windows (guide: skill-guides/orca-per-workspace-env.md, Doctor).

The free gate is clear only with no `fail` and no `warn`. A `warn` keeps `ok: true`, so `ok` alone proves nothing. Resolve each `warn`, or say why it is accepted, before spending money on `--provision` (guide: skill-guides/orca-per-workspace-env.md, Doctor).

`--provision`, or its synonym `--connect`, runs the recipe end to end: `create`, validation of the returned JSON, then `destroy`, so nothing is left running as long as `destroy` works. Run it as a loop: read the `provisionTranscript` in the failed result, fix the script, re-run, until `ok` is `true`, without waiting for the user to paste errors. The self-test sees only what the scripts print, so confirm separately that the state file holds an authenticated `snapshotId` and that `destroy` is implemented and tested. With `destroy: none` the self-test tears nothing down and cleanup is by hand (guide: skill-guides/orca-per-workspace-env.md, Doctor).

The guide carries five conditional references, `provider-vercel.md`, `ssh-host.md`, `docker-ssh.md`, `windows-scripts.md` and `failure-modes.md`, under a read-at-the-gate protocol: run `ORCA skills get orca-per-workspace-env --reference references/<file>.md` at the gate that needs it and read only that document, with `--references` listing the names, rather than reading them up front. If `--reference` is rejected, run `ORCA skills get orca-per-workspace-env --full` once and read only the named section (guide: skill-guides/orca-per-workspace-env.md, Conditional references).

---

## 5. BOUNDARIES

- Ordinary worktree and workspace creation with no recipe involved belongs to `orca-cli` (snapshot: skills/orca-per-workspace-env/SKILL.md, frontmatter description).
- This is the heaviest official skill. A local task that only needs a worktree should not route here, because a recipe is not involved in that work.

---

## 6. RELATED RESOURCES

- `orca-cli` for ordinary worktree and workspace creation with no recipe involved (snapshot: skills/orca-per-workspace-env/SKILL.md, frontmatter description).
- The version-matched guide served by the binary is authoritative for flags: load it with `ORCA skills get orca-per-workspace-env` (snapshot: skills/orca-per-workspace-env/SKILL.md, guide-loading section).
