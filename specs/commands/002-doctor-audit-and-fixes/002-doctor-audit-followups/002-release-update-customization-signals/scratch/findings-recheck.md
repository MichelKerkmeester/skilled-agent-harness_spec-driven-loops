# Findings re-check (before any engine edit, 2026-10-03)

| Finding | Re-check against the engine before the change | Result |
|---------|-----------------------------------------------|--------|
| Locally regenerated files read as customizations | `classifyFile` had three classes; a regenerated leaf manifest with local != base and release == base was `local-only`, and `unitStatus` turned that into `local` or `customized` | Holds |
| Nothing records a base at install | `baseForUnit` read `recorded` only from `.skilled/release/base.json`, which only `apply` wrote | Holds |
| `provenance_fingerprint` input unread | Now read: `scratch/provenance-input.md` | Resolved by reading |
| Prerelease rule only "excluded unless named" | `tagNames` and `remoteTags` dropped every `-pre` tag before resolution, so no opt-in was possible | Holds |
| `apply` refuses without an alignment run | `latestRun` threw `no release alignment run exists` whenever `--decisions` was absent and no run existed | Holds |
