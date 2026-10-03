# Iteration 009 — Q4a: Rename Mechanics and Reference Sweep for the Rebuilt Command

## Focus

**Q4a**: rename mechanics and reference sweep for the rebuilt command (implementation-level). What must change, and what mechanically detects a missed change, when `/doctor:update` becomes a rebuilt command family (`check` / `apply` / `align` per iterations 5–8) or is otherwise renamed?

## Actions Taken

1. Read the canonical registration surface: `.skilled/commands/doctor/_routes.yaml` standalone block (`:228-240`), `.skilled/commands/doctor/update.md` router contract (`:1-60`), and the asset pair `doctor-update.yaml` / `doctor-update-presentation.txt`.
2. Traced the runtime-mirror mechanism in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`: canonical root constant, the dynamic `listCommandPaths()` walk (`:77-96`), the `EXCLUDED_COMMAND_DIRS` set (`:34`), and the link builder (`:118-135`).
3. Read the enforcement script `.skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` header and tiers — it exists specifically because a rename updates the command file and "none of the copies".
4. Enumerated the non-spec reference set: `rg -l "doctor:update|doctor-update"` excluding `specs/`, `benchmark/`, `changelog/` → 32 files (`/tmp/q4a-refs.txt`), then read the exact lines of the live-doc members (root `README.md`, deep-loop `integration-points.md`, feature-catalog `category-overview.md`, sk-create-command `command-contract.json`).
5. Verified where the standalone trigger phrases live: `rg` for `doctor update orchestrator` / `rebuild all spec-kit databases` / `doctor full sync` outside `specs/` hits only `_routes.yaml:238-240`; elsewhere only the spec-memory trigger-index fixtures.
6. Checked `.opencode/commands` tracking with `git ls-files` — a single tracked entry, not per-file blobs.
7. Recorded the iteration through the append gateway (`GATEWAY_EXIT=0`, ledger sequence 12).

## Findings

### F-iter009-001 — Canonical registration surface is three files plus an asset pair

`/doctor:update` is registered in exactly one place: the `standalone:` block of `.skilled/commands/doctor/_routes.yaml:232-240` (`command`, `file`, `yaml`, `mutating: mutates`, four `trigger_phrases`). The header comment (`:228-231`) states the command does NOT route through `/doctor` and the block exists "for advisor visibility". The router `.skilled/commands/doctor/update.md` is already contract-shaped: frontmatter with `description` and `argument-hint`, `<!-- skill_agent: system-spec-kit -->`, an OWNED ASSETS table naming `doctor-update-presentation.txt` + `doctor-update.yaml`, an EXECUTION TARGETS list, and a presentation boundary (`:1-60`).

**Sweep implication:** a rebuilt family repeats this shape per command (new `<command>.md`, own YAML + presentation assets, own `standalone:`/route entry). The asset naming convention is `doctor-<command>-presentation.txt` / `doctor-<command>.yaml`, so renamed assets follow automatically from the command name.

### F-iter009-002 — Runtime mirrors are derived, not hand-maintained; the walk is dynamic and excludes non-`.md` command dirs

`sync-runtime-mirrors.cjs` takes `.skilled/commands` as the canonical root (`:41`), walks it dynamically (`listCommandPaths`, `:77-96`), skips non-`.md` files and the `EXCLUDED_COMMAND_DIRS` set `{assets, scripts, fixtures}` (`:34`), and emits symlinks to `.claude/commands/<rel>.md` and `.cursor/commands/<flat>.md` (`:126-135`). There is no hardcoded command list to edit, and `.opencode/commands` is a single tracked entry (consistent with a directory link to `.skilled/commands`, not per-file copies).

**Sweep implication:** rename/create/delete propagates to mirrors by re-running the sync; the corresponding `/doctor <runtime-mirrors>` route runs the check-only form and is the drift detector. New command files automatically enter coverage; a deleted `update.md` leaves an orphan the mirror check must be re-run to clear. `.claude/commands/doctor/` currently shows the four command `.md` files only — mirror scope is command files, never `assets/` or `scripts/`.

### F-iter009-003 — The catalog-copy check is the rename's enforcement gate, and it already names this failure mode

`command-catalog-mirror-check.cjs` header: "Adding, renaming or deleting a command updates the file and none of the copies, and nothing notices". It compares copies against the frontmatter tree (never copy-against-copy) with two tiers:

- **Structural (exit 1):** coverage, identity, counts, resolvable resources — a command missing from an index, an index naming a nonexistent command, a stale group count, a metadata entry pointing at nothing.
- **Prose (warning unless `--strict`):** copied description / argument-hint text.

Copies it checks: the repo-wide index `.skilled/commands/README.txt`, per-family indexes beside it, and hub `command-metadata.json` files. Doctor has no per-family `README.txt`; the repo-wide index carries the doctor row (`README.txt:46`, count `4`), the tree listing (`:107`) and the Update row (`:161`). No hub `command-metadata.json` exists for doctor today (`command-metadata.json` files exist only under `system-deep-loop`, `sk-design`, `sk-doc`, and none names a doctor command).

**Sweep implication:** the rebuilt command set must update `README.txt` coverage + count + row in the same change or `/doctor runtime-mirrors` fails structurally. The count is defined as top-level command `.md` files per folder (`README.txt:54`), so a 1→3 split takes doctor from 4 to 6.

### F-iter009-004 — The non-spec reference set is 32 files and splits into four sweep classes

From `rg -l "doctor:update|doctor-update"` (excluding `specs/`, benchmark reports, changelogs):

1. **Canonical (10):** `_routes.yaml`, `update.md`, the two `doctor-update-*` assets, `mcp.md`, `speckit.md`, `doctor-deep-loop.yaml`, `doctor-speckit-retrieval.yaml`, `doctor-speckit-presentation.txt`, `doctor-runtime-bootstrap.sh`.
2. **Index/doc copies (manual sweep):** `.skilled/commands/README.txt`; root `README.md` (`:717`, `:1211`, `:1214`); `system-deep-loop/runtime/references/integration-points.md` (`:160`, `:162` — these carry *line-number anchors* into `update.md`, so a rewrite invalidates them); feature-catalog `doctor-commands/category-overview.md` (`:3`, `:19`, `:27`, `:43`) and `maintenance/doctor-router-and-manifest-dispatch.md`; 9 manual-testing-playbook `doctor-commands/` files plus the playbook index and `manual-testing-playbook.md`; `system-skill-advisor/references/config/db-path-policy.md`.
3. **Contract fixture (live):** `sk-doc/sk-create-command/assets/command-contract.json` (`:207` doctor selector `update` → `doctor-update.yaml`; `:226` `input.required` note; `:239` `invocation_aliases` lists `/doctor:update`). This asset validates router shape and is part of the sweep.
4. **Generated retrieval data (do not hand-edit):** `trigger-index.json`, `phrase-variants.json`, `corpus-manifest.json`, `generation-diagnostics.json` — regenerated artifacts; their hits come from spec-packet titles, not command registration.

### F-iter009-005 — The four trigger phrases are the advisor-visible surface, and they partition cleanly

The phrases "spec-kit version migration", "doctor update orchestrator", "rebuild all spec-kit databases", "doctor full sync" occur outside `specs/` only in `_routes.yaml:237-240` (spec-memory fixtures excluded). No compiled advisor bundle or plugin carries them.

**Sweep implication:** the phrase list is re-partitioned, not reformatted: `check` inherits "spec-kit version migration" and "doctor update orchestrator"; `apply` inherits "rebuild all spec-kit databases" and "doctor full sync"; whichever route retains the DB rebuild keeps the "full sync" flavour. The `mutating:` classification per entry must match the route's mutation class (route-validate.py check K1 binds `mutating: read-only` routes against write activity in their YAML).

## Questions Answered

- **Q4a** — answered at implementation level. The complete rename/split surface is: (a) command `.md` files + the `standalone:` entries in `_routes.yaml`; (b) `doctor-<command>.yaml` + `doctor-<command>-presentation.txt` asset pair per command; (c) `README.txt` row, count, tree; (d) `command-contract.json` fixture; (e) live enumerating docs (root README, feature-catalog, playbook, deep-loop integration-points — including its line-number anchors); (f) mirror re-sync, verified by the runtime-mirrors route; (g) the catalog-copy check as the structural gate. Generated retrieval fixtures are regenerated, not edited. `specs/` history is historical record and is out of scope for the sweep.

## Questions Remaining

- **Q4 (residual):** whether the rebuilt family replaces `/doctor:update` outright or ships it as a deprecated alias for one release. The sweep is identical either way; only whether `update.md` survives changes.
- **Q5 (residual):** EXECUTION TARGETS rows and per-action YAML phase structure for the new commands; `_routes.yaml` registration shape for a 3-command family (three `standalone:` entries vs a new family block).
- **Q1 / Q1a:** release detection and the no-git/no-`gh` degradation path (carried).
- **Q1b:** composite child skills as independent update units (carried).
- **Q1c:** system-skill-advisor frontmatter/changelog mismatch severity (carried).
- **Q3a:** exact hash input of `provenance_fingerprint` (carried, cheap close-out).
- **Q3b:** divergence ledger git-tracked vs gitignored (carried).

## Next Focus (recommendation)

Final iteration: close the carried decision items in one batch (Q1b, Q1c, Q3a, Q3b) and finish Q5's structure with the now-frozen registration shape from this iteration: per-command `standalone:` entries, `doctor-<command>-*` asset naming, README count arithmetic, and the catalog/mirror checks named as the implementation's verification gates. Q4's alias question can be closed with the same batch.

## SCOPE VIOLATIONS

None executed. All research paths were read-only; the only writes were this narrative, the iteration delta, and the gateway's own run-directory writes. Line-number anchors discovered in `integration-points.md:160` are reported as a sweep hazard, not repaired.
