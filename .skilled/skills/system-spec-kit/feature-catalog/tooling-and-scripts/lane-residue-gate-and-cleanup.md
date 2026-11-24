---
title: "Lane residue gate and cleanup"
description: "sweep-lane-residue.mjs answers with an exit code whether anything of the skill advisor's retired embedding route is left, in the tracked repository or on this machine, and its apply mode removes what this checkout owns."
trigger_phrases:
  - "lane residue gate and cleanup"
  - "sweep-lane-residue.mjs"
  - "lane residue check"
  - "retired embedding route residue"
  - "lane cleanup"
version: 1.0.2.0
---

# Lane Residue Gate and Cleanup (sweep-lane-residue.mjs)

## 1. OVERVIEW

`sweep-lane-residue.mjs` answers with an exit code whether anything of the skill advisor's retired embedding route is left, in the tracked repository or on this machine, and its apply mode removes what this checkout owns.

Two callers depend on it. The blocking `lane-residue` job in `.github/workflows/advisory-checks.yml` runs its repo mode on every pull request and on pushes to `main` and `skilled/**`, and `/doctor:update apply` runs its machine and apply modes as the lane cleanup step after the advisor rebuild prompt. A machine with nothing left answers exit `0` and is not changed.

---

## 2. HOW IT WORKS

### Repo Mode

`repo` lists every tracked file outside `specs/` that names the retired route: by content under two vocabularies, one of code identifiers and one of prose wording, by a lane word in its path, or as a tracked symlink into an embeddings folder. A file named by an exact-path row in `fixtures/lane-residue-allowlist.json` is reported without failing. A row exempts the whole file, so lane text added to an allowlisted file later is not caught. The loader refuses a folder or glob row, so a remnant that later lands beside an allowlisted file still fails. The trigger index and its three sidecar outputs always carry spec history, so they are read by structure instead, and each of their entries is live only when the path it stands for lies outside `specs/` and on no allowlist row. Any live hit exits `1`.

### Machine and Apply Modes

`machine` reports what the route left on this machine: compiled output, installed model modules, vector objects in the advisor database and its backup copies, the model server process and its socket folder, the model cache inside each package folder, the pulled shared model, lane keys in dotenv files, and the first three of those checks again for every linked worktree. Its `askFirst` list holds the question apply would ask, so a caller without a terminal can ask it instead.

`apply` runs the same checks, deletes what this checkout owns without asking and asks before deleting the pulled shared model, on a terminal or through this run's own `--shared-model delete|keep` answer. It then reruns the checks and exits on that second result. Every delete is a fixed name under a resolved root, refused when it is a symlink or resolves outside that root, and a checkout that still holds a lane source gets no change. Exit `0` means nothing is left, `1` means remnants remain, and `2` means an invocation error or, in machine and apply mode, a check that could not run while nothing was found.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs` | Script | Repo, machine and apply modes. |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/lane-residue-allowlist.json` | Shared | Exact-path allowlist, one reason per row. |
| `.github/workflows/advisory-checks.yml` | Script | Blocking `lane-residue` job that runs repo mode. |
| `.skilled/commands/doctor/assets/doctor-update-apply.yaml` | Script | The `/doctor:update apply` step that runs machine and apply mode. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts` | Vitest | Vocabulary, allowlist, repo, machine and apply behavior. |
| `.skilled/commands/doctor/scripts/tests/lane-residue-gate.test.cjs` | Node test | Repo mode passes on this checkout and fails on a planted term. |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/doctor-commands/doctor-update-apply.md` | Manual playbook | The cleanup report inside an update apply run. |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/lane-residue-gate-and-cleanup.md`

Related references:
- [markdown-link-integrity-guard.md](markdown-link-integrity-guard.md) - another repository-wide guard that fails on what a deletion left behind
- [orphan-mcp-sweeper-and-launchagent-template.md](orphan-mcp-sweeper-and-launchagent-template.md) - operator cleanup for stale helper processes
