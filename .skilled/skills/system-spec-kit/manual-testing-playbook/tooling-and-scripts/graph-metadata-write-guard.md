---
title: "488 -- Graph metadata write guard through a linked specs root"
description: "This scenario validates that a backfill run from a project whose specs folder links into another workspace's track writes graph metadata at the real track path, and that a packet outside both workspaces is refused, using disposable directories under the operating-system temp directory."
version: 1.0.0.0
---

# 488 -- Graph metadata write guard through a linked specs root

This document captures the scratch-project manual validation contract for the graph metadata write guard.

---

## 1. OVERVIEW

This scenario validates the operator-visible write guard for `graph-metadata.json` using disposable directories created under the operating-system temp directory. It builds a project whose `specs` folder links into another workspace's track, runs the backfill from that project, then checks a packet that belongs to neither workspace. It never writes to the checkout's own `specs` or `.opencode` paths.

### Why This Matters

A project checkout can share its packets with another repository by linking its `specs` folder into that repository's track. Metadata writes from that project must reach the track's real location, or the packets it shares stop carrying graph metadata. A packet outside both workspaces must stay refused, because the guard is what keeps a metadata write inside a configured specs root.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `488` and confirm each outcome without contradictory evidence.

- Objective: Prove that a backfill run from a project whose `specs` folder links into another workspace's track writes `graph-metadata.json` at the track's real path, and that a packet outside both workspaces is refused with the specs-root error.
- Real user request: `My project's specs folder links into another repository's track. Run the graph metadata backfill for the demo packet from the project and tell me whether the file landed at the real track path. Then confirm that a packet from an unrelated folder is refused.`
- Prompt: `Run the graph metadata backfill for the demo packet from the project, whose specs folder links into another workspace's track. Confirm that graph-metadata.json lands at the real track path, then confirm that a packet from an unrelated folder is refused with the specs-root error. Return PASS or FAIL with the scratch path and the exit codes.`
- Expected execution process: Build a scratch project and a track owner under the operating-system temp directory, link the project's `specs` folder and its `.skilled` folder, run the backfill CLI from the project for the linked packet and for the stray packet, inspect the files on disk, then run the focused regression set.
- Expected signals: The linked run exits `0`, its summary has an empty `failed` list, and `graph-metadata.json` exists at the track's real path. The stray run exits `1`, its summary names `Refusing to write graph metadata outside a configured specs root`, and no `graph-metadata.json` is written beside the stray packet.
- Desired user-visible outcome: A concise `PASS` with the scratch path and the exit codes, or a `FAIL` that names the first violated check.
- Pass/fail: PASS if every condition in Section 3 Pass / Fail holds, FAIL if any one does not.

---

## 3. TEST EXECUTION

### Prompt

```text
Run the graph metadata backfill for the demo packet from the project, whose specs folder links into another workspace's track. Confirm that graph-metadata.json lands at the real track path, then confirm that a packet from an unrelated folder is refused with the specs-root error. Return PASS or FAIL with the scratch path and the exit codes.
```

### Commands

1. From the repository root, record the repository path and create an isolated scratch directory. Confirm the printed path begins with the operating-system temp directory and is not the repository root.

   ```bash
   export GRAPH_GUARD_REPO="$(pwd -P)"
   export GRAPH_GUARD_PLAYGROUND="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/graph-guard-manual.XXXXXX")" && pwd -P)"
   printf 'GRAPH_GUARD_PLAYGROUND=%s\n' "$GRAPH_GUARD_PLAYGROUND"
   ```

2. Build the track owner, a packet outside both workspaces and the project. The project's `specs` folder links into the track owner's track, and its `.skilled` folder links to this checkout.

   ```bash
   mkdir -p "$GRAPH_GUARD_PLAYGROUND/track-owner/.opencode" \
     "$GRAPH_GUARD_PLAYGROUND/track-owner/repositories/demo/specs/demo/001-demo" \
     "$GRAPH_GUARD_PLAYGROUND/project/.opencode" \
     "$GRAPH_GUARD_PLAYGROUND/elsewhere/specs/901-stray"
   printf '# Demo packet\n' > "$GRAPH_GUARD_PLAYGROUND/track-owner/repositories/demo/specs/demo/001-demo/spec.md"
   printf '# Stray packet\n' > "$GRAPH_GUARD_PLAYGROUND/elsewhere/specs/901-stray/spec.md"
   ln -s "$GRAPH_GUARD_PLAYGROUND/track-owner/repositories/demo/specs" "$GRAPH_GUARD_PLAYGROUND/project/specs"
   ln -s "$GRAPH_GUARD_REPO/.skilled" "$GRAPH_GUARD_PLAYGROUND/project/.skilled"
   ls -l "$GRAPH_GUARD_PLAYGROUND/project"
   ```

3. Run the backfill from the project for the linked packet. Expect exit `0`.

   ```bash
   cd "$GRAPH_GUARD_PLAYGROUND/project" && node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts specs/demo/001-demo > "$GRAPH_GUARD_PLAYGROUND/linked-run.json" 2> "$GRAPH_GUARD_PLAYGROUND/linked-run.err"
   echo "LINKED_EXIT=$?"
   ```

4. Check where the file landed and that the linked summary reports no failure.

   ```bash
   if [ -f "$GRAPH_GUARD_PLAYGROUND/track-owner/repositories/demo/specs/demo/001-demo/graph-metadata.json" ]; then echo "CANONICAL_FILE=present"; else echo "CANONICAL_FILE=absent"; fi
   grep -c '"failed": \[\]' "$GRAPH_GUARD_PLAYGROUND/linked-run.json"
   ```

5. Run the backfill from the project for the stray packet, which belongs to neither workspace. Expect exit `1`, the specs-root refusal in the summary and no file beside the packet.

   ```bash
   cd "$GRAPH_GUARD_PLAYGROUND/project" && node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs .skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts "$GRAPH_GUARD_PLAYGROUND/elsewhere/specs/901-stray" > "$GRAPH_GUARD_PLAYGROUND/stray-run.json" 2> "$GRAPH_GUARD_PLAYGROUND/stray-run.err"
   echo "STRAY_EXIT=$?"
   grep -c 'Refusing to write graph metadata outside a configured specs root' "$GRAPH_GUARD_PLAYGROUND/stray-run.json"
   if [ -e "$GRAPH_GUARD_PLAYGROUND/elsewhere/specs/901-stray/graph-metadata.json" ]; then echo "STRAY_FILE=present"; else echo "STRAY_FILE=absent"; fi
   ```

6. Run the focused regression set from the repository as corroborating evidence. Both commands use their own operating-system temp fixtures and do not target the scratch directory.

   ```bash
   cd "$GRAPH_GUARD_REPO/.skilled/skills/system-spec-kit" && npx vitest run runtime/tests/graph-metadata-schema.vitest.ts --config runtime/vitest.config.ts --root . -t "linked specs root|links into another workspace"
   cd "$GRAPH_GUARD_REPO/.skilled/skills/system-spec-kit" && npx vitest run runtime/cli/tests/symlinked-project-root.vitest.ts --config vitest.config.ts -t "another workspace"
   ```

### Expected

- Step 3 prints `LINKED_EXIT=0`. `linked-run.json` has `"created": 1`, a `"root"` value that ends in `/project/specs`, and an empty `failed` list.
- Step 4 prints `CANONICAL_FILE=present`, and the empty-`failed` count is `1`.
- Step 5 prints `STRAY_EXIT=1`, the refusal count is `1`, and `STRAY_FILE=absent`.
- Step 6 exits `0` for both commands, with no failed test in either summary.

### Evidence

Capture the printed `GRAPH_GUARD_PLAYGROUND` path, the `ls -l` listing from step 2, the `LINKED_EXIT`, `CANONICAL_FILE`, `STRAY_EXIT` and `STRAY_FILE` lines, both summary JSON files with their stderr files, and the Vitest summary line of each step 6 command. Inspect evidence only under the printed scratch path, and do not substitute the checkout's own spec roots.

### Pass / Fail

- **Pass**: `LINKED_EXIT=0`, `CANONICAL_FILE=present`, the linked summary has an empty `failed` list, `STRAY_EXIT=1`, the stray summary names the specs-root refusal, `STRAY_FILE=absent`, and both focused Vitest commands exit `0`.
- **Fail**: the linked run exits non-zero or reports the specs-root refusal, the metadata file is missing from the track's real path, the stray run exits `0` or leaves a `graph-metadata.json`, or either focused Vitest command exits non-zero.

### Failure Triage

1. Read `linked-run.err` and the `failed` entries in `linked-run.json`. A `Refusing to write graph metadata outside a configured specs root` error on the linked packet means the real-location comparison did not admit the track. Check `isWithinConfiguredSpecsRoot` and `realLocationOf` in `runtime/lib/graph/graph-metadata-parser.ts`, and confirm that `project/.opencode` is a real directory.
2. A `target spec folder does not exist`, `target is not a spec folder` or `ERR_MODULE_NOT_FOUND` message in `linked-run.err` points at the setup rather than the guard. Confirm that the packet folder reached through the scratch project's `specs` link contains a spec.md file, that the scratch project's `.skilled` link points at this checkout, and that `.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs` exists.
3. If the stray run exits `0` or writes a file, the guard admitted a destination outside every root. Check that roots still require a real `.opencode` anchor in `getSpecsBasePaths` (`runtime/lib/search/folder-discovery.ts`) and the real-location loop in `isWithinConfiguredSpecsRoot`.
4. If only a focused Vitest command fails, rerun that file alone without the `-t` filter and read its first failing assertion before changing this scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario registration |
| `../../feature-catalog/tooling-and-scripts/graph-metadata-write-guard.md` | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts` | Write guard, real-location comparison, canonical-path writer and the refresh that authorizes against the caller's path |
| `.skilled/skills/system-spec-kit/runtime/cli/graph/backfill-graph-metadata.ts` | Backfill entry point whose JSON summary carries each writer refusal under `failed` |
| `.skilled/skills/system-spec-kit/runtime/tests/graph-metadata-schema.vitest.ts` | Linked-root write, linked refresh and refusal outside both workspaces |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/symlinked-project-root.vitest.ts` | Continuity save of a packet reached through a specs folder that links into another workspace |

Provenance: runtime/tests/graph-metadata-schema.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 488
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/graph-metadata-write-guard.md`
- Destructive: No. The backfill writes only into the disposable directory created by step 1. Step 6 runs the focused test suites, which use their own temporary fixtures.
