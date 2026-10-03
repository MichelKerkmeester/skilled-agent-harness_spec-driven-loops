# Findings re-check (before any edit, 2026-10-03)

| Finding | Re-check | Result |
|---------|----------|--------|
| Committed index stale | `generate-trigger-index.mjs --check --json` exit 1: 177 stale documents, 176 missing, 0 obsolete, 23,055 scanned (`baseline-check.json`) | Holds (counts moved since planning) |
| `folder-token-fallback` unreachable at generation | `generate-trigger-index.mjs` called `judgeTriggerPhrase(normalized)` with no context; the committed bucket had no `folder-token-fallback` key (`baseline-phrase-quality.json`) | Holds |
| Doctor staleness signal is mtime-only | `doctor-speckit-retrieval.yaml` phase 0 stat'ed the index and phase 1 compared mtimes; no `--check` activity existed | Holds |
| §9 names a `.opencode/specs` symlink | `ls .opencode/specs` reports no such file; `lib/corpus.mjs` still folds the alias when present | Holds |
| `README.md:94` claims `CLAUDE.md` is a symlink | Still present; `sync-gate1-pointers.cjs:7` says Claude reads `AGENTS.md` directly | Holds |
| Conventions pin ripgrep 14.1.1 | Host runs 15.2.0; both pins present at §2.5 and §4 | Holds |
| Acceptance packet continuity paths | `033/017/001/acceptance-criteria.md` still lists `.opencode/skills/system-spec-kit/{scripts,data}` paths | Holds; the file is outside this build's owned files (handed off) |
| Byte-identical proof unowned | `pass_policy.index_regenerates_byte_identical` named no owner | Holds |

`/doctor:rebuild`'s generator leg (`doctor-rebuild.yaml`, `execute.trigger-index.action`) runs `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` with no arguments after a backup snapshot, and its post-run validation runs the same script with `--check`. That one invocation writes the index and all three sidecars.
