---
title: "Implementation Summary"
description: "The command contract had drifted from the tree it describes until 142 of its 155 declared asset paths named files that do not exist. It now names only real files, describes only families that ship, and a new read-only check catches the catalogs and hub metadata when they fall behind command frontmatter."
trigger_phrases:
  - "command contract reconciliation"
  - "command asset naming"
  - "catalog mirror check"
  - "contract drift"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/sk-doc/056-command-contract-reconciliation"
    last_updated_at: "2026-09-04T11:30:00Z"
    last_updated_by: "claude"
    recent_action: "Reconciled the command contract with the shipped tree and added the catalog mirror check"
    next_safe_action: "Register command-catalog-mirror-check.cjs into the doctor route manifest and script index"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-contract.json"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-contract.schema.json"
      - ".opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md"
      - ".opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "056-command-contract-reconciliation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the two hub command-metadata files be reworded to match command frontmatter, or should the check's prose tier be retired?"
      - "Is the prompt family's underscore asset naming an intentional exception or an unfinished migration?"
    answered_questions:
      - "The contract, not the template or the validator, was wrong about the arguments trailer."
      - "Asset naming does differ per family: create, speckit, doctor and deep carry the family prefix; memory and design drop it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 056-command-contract-reconciliation |
| **Completed** | 2026-09-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`command-contract.json` calls itself the single machine-readable source of behavioural truth that templates, validators, benchmark adapters and generated routers read instead of restating. Measured against the tree it describes, 142 of its 155 declared asset paths named a file that does not exist, and one of its six families had no directory at all. The contract now names only real files and only families that ship, and the one tool that reads it went from reporting drift to reporting none.

### The three named misalignments, and which source was wrong

**The arguments trailer — the contract was wrong.** Its create-family loader requirement said `$ARGUMENTS trailer consumed at the router foot`. The router template parses arguments in its MODE ROUTING section, `SKILL.md` carries an explicit argument-echo deprecation, `validate_document.py:1424` warns on a trailing `User request: $ARGUMENTS` line, and no shipped command carries one. Three sources agreed and the contract was the outlier, so the contract changed.

**The owned-asset naming — the contract was wrong, and the answer does differ per family.** The contract wrote create's assets as `<name>_auto.yaml`; the tree ships `create-readme-auto.yaml`. Checking the other families the same way showed two conventions rather than one. Create, speckit, doctor and deep carry the family prefix. Memory and design drop it — `save-presentation.txt`, `extract-auto.yaml` — because their action names already read unambiguously. Both are now recorded in the contract's `metadata.asset_naming` rather than left for a reader to infer. The prompt group is the tree's lone underscore holdout and is out of this packet's scope.

**The create family's argument hint — the contract was wrong.** It carried `/create:skill`'s hint verbatim, down to `--chained`, a flag no other create command has. Every other family writes a shape: deep leads with `<topic>`, speckit with `<feature-description>`, while memory and doctor enumerate per command because their commands genuinely diverge. Create's fourteen commands share a positional, an operation and the mode suffixes, so a shape is right: `<target> [operation] [--path <dir>] [per-command flags] [:auto|:confirm]`.

### Testing the contract's claim to be the source of truth

Every field of every family was checked against disk. The full divergence table is below. Two findings mattered beyond the three named ones. The `interface` family the contract described has no directory; the `design` family occupies its slot with one command, and the schema's own text already said `design`, so the schema was right and the contract was stale. And `/memory:learn` is a deprecated tombstone, while the contract still described it as writing constitutional rules through a tier that was retired.

The contract's claim about consumers also needed testing. Exactly one live tool reads it: `generate-command-routers.cjs`. It had grown a separator-insensitive comparison with a comment saying the contract does not pin the hyphen-versus-underscore convention — a workaround for this drift rather than a report of it. The path shapes here were chosen so that tool's existing expansion rule lands on real filenames, so nothing about the consumer had to change.

### The check that was proposed and refused

A previous pass found both command catalogs stale, rejected generating them from the command metadata because that metadata covers 20 of the 39 shipped commands and is itself a hand-kept copy that had already drifted, and concluded the proportionate guard was a checker in the shape of the agent-roster mirror check. That is what `command-catalog-mirror-check.cjs` is. It reads the command tree once and compares each copy back to frontmatter, never a copy against another copy.

It carries two tiers, because two kinds of disagreement are not the same failure. Structural disagreement drives the exit status: a command missing from an index, an index naming a command that no longer exists, a stale group count, a metadata entry pointing at nothing, a hub covering half a namespace, a choreography resource that does not resolve. Prose disagreement — the description and argument hint a hub copies out of frontmatter — is reported and drives the exit status only under `--strict`, because a hub legitimately phrases its routing description its own way and the metadata convention appends a pre-bound-setup annotation the frontmatter often omits.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | Family-by-family reconciliation; `interface` replaced by `design`; version 1.0.0 to 2.0.0 for the family-key rename |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.schema.json` | Modified | Three descriptions corrected against the tree and the contract's own metadata |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md` | Modified | Hyphenated asset paths in the skeleton and the copy-ready contract example, plus the prefix-drop note |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` | Modified | Hyphenated asset paths in the router-variant tables |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-presentation-template.md` | Modified | Hyphenated presentation-asset path |
| `.opencode/skills/sk-doc/sk-create-command/SKILL.md` | Modified | Hyphenated asset paths, and the naming rule stated with its two prefix-dropping families |
| `.opencode/skills/sk-doc/sk-create-command/README.md` | Modified | Hyphenated asset-kind suffix |
| `.opencode/skills/sk-doc/sk-create-command/references/worked-example.md` | Modified | Hyphenated asset paths through the worked router |
| `.opencode/skills/sk-doc/sk-create-command/references/common-pitfalls.md` | Modified | Hyphenated asset-kind suffixes |
| `.opencode/skills/sk-doc/sk-create-command/references/router-presentation-split.md` | Modified | Hyphenated asset paths |
| `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | Created | Read-only catalog and hub-metadata drift check |
| `specs/sk-doc/056-command-contract-reconciliation/` | Created | This packet |

### Family-by-family divergence

Each row records what the contract declared before this packet against what the tree actually holds.

| Family | Field | Contract said | Tree holds | Resolution |
|--------|-------|---------------|------------|------------|
| create | loader_requirements | `$ARGUMENTS` trailer consumed at the router foot | Arguments resolved in MODE ROUTING; the foot echo is validator-deprecated and appears in no command | Contract corrected |
| create | owned_assets, execution_targets | `<name>_auto.yaml`, `<name>_confirm.yaml`, `<name>_presentation.txt` | `create-<name>-auto.yaml` and siblings, 42 files | Contract corrected; 70 of the before-state's missing paths were create's |
| create | argument_hint | `/create:skill`'s hint verbatim, including `--chained` | Fourteen commands sharing a positional, an operation and the modes | Contract corrected to a family shape |
| design | whole entry | A family named `interface` at `.opencode/commands/interface/*.md` with five aliases | No such directory; `design/extract.md` with three assets | Entry rewritten as `design`, with literal filenames because its assets drop the family prefix |
| speckit | owned_assets, execution_targets | `speckit_<name>_auto.yaml` and siblings | `speckit-plan-auto.yaml` and siblings, 12 files | Contract corrected; 24 missing paths |
| speckit | router_path, mode_matrix, overrides | Four routers, `ask` by default, resume overridden to `confirm` | Matches: `resume.md` defaults to interactive, `plan.md` asks | Confirmed accurate, unchanged |
| memory | owned_assets | `<command>_presentation.txt` | `save-presentation.txt` and siblings — no family prefix | Contract corrected; 4 missing paths |
| memory | execution_targets, destructive_policy | `learn` writes constitutional rules through `memory_save`/`memory_list`/`memory_delete` | `learn.md` is a deprecated tombstone; the tier was retired and its rule files deleted | Entry rewritten as a tombstone with no execution target |
| memory | argument_hint | Enumerated `learn [rule] \| list \| edit \| remove \| budget` | `learn` advertises `(deprecated — no active routes)` | Contract corrected |
| doctor | owned_assets | `doctor_<entry>_presentation.txt`, `doctor_<target>.yaml` | `doctor-mcp-presentation.txt`, `doctor-memory.yaml` and siblings | Contract corrected; 13 missing paths |
| doctor | execution_targets | Already hyphenated `doctor-<target>.yaml` | Matches the ten routes in the manifest | Confirmed accurate; the entry had been internally inconsistent with its own owned_assets |
| doctor | argument_hint | Three of `update`'s flags | `update` advertises six | Contract corrected |
| doctor | input.required | `true` for the family | True for the speckit and mcp routers; `update` takes no positional | Recorded as a loader requirement, since the schema has no per-command input override |
| doctor | routing_source | Absent | Routes come from `_routes.yaml` | Declared `manifest` |
| deep | owned_assets, execution_targets | `deep_<name>_auto.yaml` and siblings | `deep-research-auto.yaml` and siblings, 18 files | Contract corrected; 30 missing paths |
| deep | owned_assets (compiled, legacy) | Generated contract digests and fallback bodies | Both exist and are read by `render-command-contract.cjs` | Confirmed accurate, unchanged |
| deep | invocation_aliases, loader_requirements | `--dry-run` presented as a family-level flag | Only `/deep:research` advertises it | Contract scoped to that one command |
| deep | topology | `mode-pair` | No deep router carries the compiled-stub marker | Confirmed accurate, unchanged |
| all | metadata.purpose | "the six OpenCode command families" | 39 commands ship; the six families cover 31 | `metadata.coverage` added, naming the prompt and rewrite groups and the three root utilities as uncovered |
| schema | router_path description | Create, design and deep "carry an array" | All three carry a glob string; the contract's own metadata said so | Schema corrected |
| schema | owned_assets description | "the `_auto.yaml` / `_confirm.yaml` pair" | Hyphen-joined on disk | Schema corrected |
| schema | workflow_schema_ref description | Asserted confirm equals auto plus checkpoints | The contract's own metadata says that is family-dependent and must not be assumed | Schema corrected to defer to it |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every gate was baselined before the first edit and re-run from the final state, with output redirected to a file and the exit status read from that file rather than through a pipe. The headline measurement is an expansion of every contract asset path across its family's commands, followed by a stat of each result: 155 checked and 142 missing before, 160 checked and 0 missing after. The same numbers show through the live consumer, which went from `routers=31 clean=30 path-drift=1 shape-drift=1` at exit 1 to `routers=32 clean=32 path-drift=0 shape-drift=0` at exit 0. Part of that improvement is not this packet's: a concurrent agent gave `memory/learn.md` the owned-assets section it was missing, which cleared the one pre-existing drift row. The router count rose by one because the design family now resolves to a real directory.

The new check was proved by negative control rather than by assertion. A copy of the command tree was made in a scratch directory with the skills tree symlinked in, the check was pointed at it with `--root`, and five staleness shapes were introduced one at a time: a family catalog row deleted, a repo-wide catalog row deleted, a group count made stale, a command file deleted, and a command file added. Each exited 1 naming the specific disagreement; the restored copy exited 0. The first run of that suite found a real hole in the check rather than in the tree — deleting the chart row from the create index was not caught, because `/create:chart` still appeared in a usage example further down the same file. Coverage is now judged on catalog table rows alone, and the re-run caught it.

Nothing was committed. The one file added outside this packet is the check itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Rewrite the `interface` entry as `design` rather than delete it | The family was renamed and reduced, not removed. The schema's own text already listed `design`, so keeping six families and correcting the name restores agreement instead of shrinking the contract and leaving the tree half-described. |
| Give the design family literal filenames instead of a placeholder template | The one live consumer special-cases the memory family when a placeholder opens the filename. A second prefix-dropping family that it does not special-case would expand to `design_extract-auto.yaml`, so design spells its three assets out. This is recorded in `metadata.path_templates` so the next reader knows why it looks different. |
| Bump the contract to 2.0.0 | Renaming a family key is breaking for any consumer that indexes families by name, and the schema's own rule is to bump major on a breaking change. The only live consumer iterates families generically, so nothing actually broke — but the version should say what happened. |
| Split the new check into a structural tier and a prose tier | Ten metadata fields disagree with frontmatter today in files this packet does not own. Failing on them would ship an always-red diagnostic that readers learn to ignore. Reporting them at exit 0 and failing under `--strict` keeps the finding visible and the check trustworthy. |
| Judge catalog coverage on table rows only | Scanning whole documents let a usage example mask a deleted index row, which the negative control caught. An index lists commands in a table; prose that mentions the same id is not a listing. |
| Leave the two hub `command-metadata.json` files alone | They sit outside this packet's ownership. Editing them would have been a silent scope breach, and the divergence is now reported by the check instead. |
| Leave document frontmatter versions alone | The build segment is git-derived from a file's real edit count and applied by tooling after a commit. Hand-bumping it would have written a number the tool would then disagree with. The version gate passes as the files stand. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Contract asset paths expanded and stat'ed (`scratch/contract-paths.cjs`) | PASS — `checked=160 missing=0`, exit 0. Before: `checked=155 missing=142`, exit 1 |
| `generate-command-routers.cjs --check` | PASS — `routers=32 clean=32 path-drift=0 shape-drift=0`, exit 0. Before: `routers=31 clean=30 path-drift=1 shape-drift=1`, exit 1 |
| Contract against its schema (`jsonschema` Draft-07) | PASS — `schema errors: 0`, exit 0. Same as baseline |
| `validate_document.py` over all 21 mode documents | PASS — 0 non-zero exits, 21 of 21 report `Total issues: 0`. Same as baseline |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | PASS — all hard invariants, 0 warnings, exit 0, including the byte-for-byte leaf-manifest regeneration. Same as baseline |
| `leaf-resource-contract.test.cjs` | PASS — exit 0. Same as baseline |
| `test_emitted_name_contract.py` | PASS — 4 passed, exit 0. Same as baseline |
| `check-frontmatter-versions.sh` on the mode | PASS — `3603 files, ok=3594, skip-no-frontmatter=9`, exit 0. Same as baseline |
| `node --check` on the new script | PASS — exit 0 |
| New check, default mode, live tree | PASS — `STATUS=OK`, exit 0 over 39 commands, 4 catalogs, 2 metadata files |
| New check, negative control, five staleness shapes | PASS — exit 1 on each with the specific disagreement named; exit 0 after restore |
| New check, `--strict` on the live tree | Reports 10 prose divergences, exit 1 — the intended behaviour, and the finding handed to the metadata owner |
| New check, error paths (`--root /tmp`, unknown flag) | PASS — `STATUS=ERROR` with a named cause, exit 2 |
| Underscore asset forms remaining in the mode | PASS — 5 hits, all naming the real `_routes.yaml` file |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The new check is not wired into anything.** Its siblings are registered in the doctor route manifest, the runtime-mirrors workflow asset and the doctor script index — all under `.opencode/commands/`, which this packet does not own beyond the one added file. Until someone adds a route entry and an index row, it runs only when invoked by path.

2. **Ten prose divergences remain between hub command metadata and command frontmatter.** Four in `sk-doc` (`/create:skill-parent` and `/create:diagram` descriptions, `/create:benchmark` and `/create:diagram` argument hints) and six in `system-deep-loop`. The check names each one; repairing them needs the metadata files, which are outside this packet.

3. **The repo-wide command index describes nine doctor subsystems and names `code-graph` among them.** The route manifest carries ten targets, `code-graph` is not one of them, and `skill-graph-freshness` and `runtime-mirrors` are missing from the index's list. That text is a command document owned by a concurrent agent, so it was left alone. Extending the new check to compare that list against `_routes.yaml` is the natural next guard, but it would fail on the tree as it stands.

4. **The contract covers 31 of the 39 shipped commands.** The prompt and rewrite groups and the three root utilities ship no family router and have no contract entry. `metadata.coverage` now says so rather than leaving "the six command families" to imply full coverage, but a reader who wants every command still has to read the tree.

5. **`assetDiscriminator` in the contract consumer is dead code carrying the old convention.** It builds `${family}_${command}` and is never called. It is harmless today and sits in a file this packet does not own, but it will mislead the next reader of that script.
<!-- /ANCHOR:limitations -->

---
