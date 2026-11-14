---
title: "494 -- Ripgrep archive search"
description: "This scenario validates archive-aware search for `494`. It focuses on rg-wrapper.mjs leaving archived packets out by default and, with --include-archive, marking each archived hit and listing matching archived metadata files."
version: 1.0.1.0
---

# 494 -- Ripgrep archive search

This document captures the scratch-directory manual validation contract for `rg-wrapper.mjs --include-archive`.

---

## 1. OVERVIEW

This scenario validates archive-aware search for `494`. It focuses on `rg-wrapper.mjs` leaving archived packets out by default and, with `--include-archive`, marking each archived hit and listing matching archived metadata files. The fixture lives in a scratch directory under the operating-system temp directory, and the wrapper searches it through `--root`. It never writes to this checkout.

### Why This Matters

An archived packet is finished or abandoned work. Returned unmarked beside live packets it reads as current evidence. Left out with no way back in, it hides the history of a decision. The default search keeps the archive out, and the opt-in search says which hits are archived.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `494` and confirm each outcome without contradictory evidence.

- Objective: Prove that the default recipes skip `z_archive/`, and that `--include-archive` adds the archived hit with an `[archived]` mark, an `archived` field on each JSON row and a `json    :` section naming the archived packet's matching `description.json`.
- Real user request: `Search the specs for ledger reconciliation, and this time include archived packets. Tell me which hits are archived.`
- Prompt: `Search the demo specs for "ledger reconciliation" with rg-wrapper.mjs, first without and then with --include-archive. Tell me which hits are archived. Return PASS or FAIL with the paths and the exit codes.`
- Expected execution process: Build one live packet and one archived packet that both carry the phrase in a scratch directory, run the path recipe without the flag, then run the path, structured and count recipes with it.
- Expected signals: Without the flag the path recipe reports `paths   : 1` and its command carries `--glob '!**/z_archive/**'`. With the flag it reports `paths   : 2`, the archived path ends in `[archived]`, the command no longer carries that glob, and a `json    : 1 archived metadata file(s)` section follows. The count recipe's JSON rows carry `"archived": false` for the live file and `"archived": true` for the archived one.
- Desired user-visible outcome: A concise `PASS` that names the live hit and the archived hit apart, or a `FAIL` that names the first violated check.
- Pass/fail: PASS if every condition in Section 3 Pass / Fail holds, FAIL if any one does not.

---

## 3. TEST EXECUTION

### Prompt

```text
Search the demo specs for "ledger reconciliation" with rg-wrapper.mjs, first without and then with --include-archive. Tell me which hits are archived. Return PASS or FAIL with the paths and the exit codes.
```

### Commands

1. From the repository root, create an isolated scratch directory. Confirm the printed path begins with the operating-system temp directory and is not the repository root.

   ```bash
   export RG_ARCHIVE_DEMO="$(cd "$(mktemp -d "${TMPDIR:-/tmp}/rg-archive-manual.XXXXXX")" && pwd -P)"
   printf 'RG_ARCHIVE_DEMO=%s\n' "$RG_ARCHIVE_DEMO"
   ```

2. Build one live packet and one archived packet. Both carry the phrase in `spec.md`, and the archived packet also carries it in `description.json`.

   ```bash
   mkdir -p "$RG_ARCHIVE_DEMO/specs/demo/001-alpha" "$RG_ARCHIVE_DEMO/specs/demo/z_archive/002-old"
   printf '# Alpha\n\nLedger reconciliation notes. Follow-up work lives in specs/demo/004-beta.\n' > "$RG_ARCHIVE_DEMO/specs/demo/001-alpha/spec.md"
   printf '# Old\n\nLedger reconciliation, first attempt.\n' > "$RG_ARCHIVE_DEMO/specs/demo/z_archive/002-old/spec.md"
   printf '{"level":"task","specFolder":"demo/z_archive/002-old","description":"Ledger reconciliation, first attempt."}\n' > "$RG_ARCHIVE_DEMO/specs/demo/z_archive/002-old/description.json"
   ```

3. Run the path recipe without the flag.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs path "ledger reconciliation" --root "$RG_ARCHIVE_DEMO" --search-root specs
   echo "DEFAULT_EXIT=$?"
   ```

4. Run the path recipe with `--include-archive`.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs path "ledger reconciliation" --root "$RG_ARCHIVE_DEMO" --search-root specs --include-archive
   echo "ARCHIVE_PATH_EXIT=$?"
   ```

5. Run the structured recipe with `--include-archive`.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs structured "ledger reconciliation" --root "$RG_ARCHIVE_DEMO" --search-root specs --include-archive
   echo "ARCHIVE_STRUCTURED_EXIT=$?"
   ```

6. Run the count recipe with `--include-archive` and `--json`.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs count "ledger reconciliation" --root "$RG_ARCHIVE_DEMO" --search-root specs --include-archive --json
   echo "ARCHIVE_COUNT_EXIT=$?"
   ```

7. Run the path recipe with `--include-archive` and `--json`, and print the three fields that mark archived paths.

   ```bash
   node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs path "ledger reconciliation" --root "$RG_ARCHIVE_DEMO" --search-root specs --include-archive --json > "$RG_ARCHIVE_DEMO/path.json"
   echo "PATH_JSON_EXIT=$?"
   node -e 'const r=require(process.argv[1]);console.log(JSON.stringify({includeArchive:r.includeArchive,paths:r.paths,archivedPaths:r.archivedPaths},null,2))' "$RG_ARCHIVE_DEMO/path.json"
   ```

8. Remove the scratch directory.

   ```bash
   rm -rf "$RG_ARCHIVE_DEMO"
   ```

### Expected

Step 3 prints the live packet only and `DEFAULT_EXIT=0`.

```text
recipe  : path
command : rg --no-config --hidden --fixed-strings --ignore-case --files-with-matches --max-count 1 --glob '*.md' --glob '!**/z_archive/**' --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/scratch/**' -- 'ledger reconciliation' specs
exit    : 0 (match)
paths   : 1
  specs/demo/001-alpha/spec.md
```

Step 4 prints both packets, marks the archived one, lists the archived metadata file and prints `ARCHIVE_PATH_EXIT=0`.

```text
recipe  : path
command : rg --no-config --hidden --fixed-strings --ignore-case --files-with-matches --max-count 1 --glob '*.md' --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/scratch/**' -- 'ledger reconciliation' specs
exit    : 0 (match)
paths   : 2
  specs/demo/001-alpha/spec.md
  specs/demo/z_archive/002-old/spec.md  [archived]
json    : 1 archived metadata file(s)
  specs/demo/z_archive/002-old/description.json  [archived]
```

Step 5 prints one ranked row per file with the same mark and `ARCHIVE_STRUCTURED_EXIT=0`.

```text
recipe  : structured
command : rg --no-config --hidden --json --fixed-strings --ignore-case --glob '*.md' --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/scratch/**' -- 'ledger reconciliation' specs
exit    : 0 (match)
ranked  : 2 match(es) in 2 file(s); showing 2 file(s) at limit 20
  body                 specs/demo/001-alpha/spec.md:3
  body                 specs/demo/z_archive/002-old/spec.md:3  [archived]
json    : 1 archived metadata file(s)
  specs/demo/z_archive/002-old/description.json  [archived]
```

Step 6 prints one JSON record and `ARCHIVE_COUNT_EXIT=0`. The record carries these fields among others.

```json
{
  "counts": [
    {
      "archived": false,
      "count": 1,
      "path": "specs/demo/001-alpha/spec.md"
    },
    {
      "archived": true,
      "count": 1,
      "path": "specs/demo/z_archive/002-old/spec.md"
    }
  ],
  "exitCode": 0,
  "fileCount": 2,
  "includeArchive": true,
  "jsonLane": {
    "command": "rg --no-config --hidden --fixed-strings --ignore-case --files-with-matches --max-count 1 --glob '**/z_archive/**/description.json' --glob '**/z_archive/**/graph-metadata.json' --glob '!**/node_modules/**' --glob '!**/.git/**' --glob '!**/scratch/**' -- 'ledger reconciliation' specs",
    "exitCode": 0,
    "outcome": "match",
    "paths": [
      "specs/demo/z_archive/002-old/description.json"
    ],
    "stderr": ""
  },
  "matchCount": 2,
  "outcome": "match",
  "recipe": "count",
  "schemaVersion": 3
}
```

Step 7 prints `PATH_JSON_EXIT=0` and the record below. `paths` stays a list of plain strings with both files, and `archivedPaths` holds only the archived one.

```text
{
  "includeArchive": true,
  "paths": [
    "specs/demo/001-alpha/spec.md",
    "specs/demo/z_archive/002-old/spec.md"
  ],
  "archivedPaths": [
    "specs/demo/z_archive/002-old/spec.md"
  ]
}
```

### Evidence

Capture the printed `RG_ARCHIVE_DEMO` path, the full output of steps 3 to 7 and each `_EXIT` line. Keep the two `command :` lines of steps 3 and 4 side by side, since the missing archive glob is the proof that the flag changed the search and not only the labels.

### Pass / Fail

- **Pass**: step 3 reports `paths   : 1` with no `z_archive` path and no `json    :` section, step 4 reports `paths   : 2` with the archived path marked `[archived]` and the `json    : 1 archived metadata file(s)` section, step 5 marks the archived row and leaves the live row unmarked, step 6 carries `"archived": false` and `"archived": true` on the two rows with a `jsonLane` block, step 7 carries both files in `paths` as plain strings and only the archived file in `archivedPaths`, and every `_EXIT` line reads `0`.
- **Fail**: the default run returns an archived path, an archived path appears without the `[archived]` mark, a live path carries the mark, the metadata section is missing under `--include-archive`, a JSON row lacks the `archived` field, the step 7 record lacks `archivedPaths` or lists the live file in it, or any run exits non-zero.

### Failure Triage

1. If step 3 already lists the archived packet, compare its `command :` line with the one above. A missing `--glob '!**/z_archive/**'` means the default glob set changed in `runtime/cli/retrieval/rg-wrapper.mjs`.
2. If step 4 finds one path only, confirm the archived `spec.md` from step 2 exists and holds the phrase.
3. If the `json    :` section reports `0`, confirm the archived `description.json` carries the phrase. The metadata lane searches only `description.json` and `graph-metadata.json` below a `z_archive/` folder.
4. An `unknown argument` message with exit `2` points at the command line. `--help` is not an accepted argument, and a multi-word phrase must be quoted.
5. Run `npx vitest run runtime/cli/tests/rg-include-archive.vitest.ts` from `.skilled/skills/system-spec-kit` and read its first failing assertion before changing this scenario.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario registration |
| [rg-archive-search.md](../../feature-catalog/retrieval/rg-archive-search.md) | Matching current-state feature reference |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Recipe builders, the archive glob set, the metadata lane and the `[archived]` summary mark |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs` | Shared retrieval lane the wrapper's recipes are held in parity with |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/rg-include-archive.vitest.ts` | Recipe shape and archived-hit marking cases |

Provenance: manual only - node .skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs path "ledger reconciliation" --root "$RG_ARCHIVE_DEMO" --search-root specs --include-archive

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 494
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `retrieval/rg-archive-search.md`
- Destructive: No. The wrapper only reads. The scenario writes its fixture into the scratch directory step 1 created, and step 8 removes that directory.
