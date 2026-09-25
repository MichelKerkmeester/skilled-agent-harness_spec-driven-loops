---
title: "Implementation Plan: Pre-v4 spec folder upgrade path"
description: "One dry-run-by-default command runs the existing repair tools in a fixed order over a v3.x specs tree, then records each finding they cannot clear in a per-packet upgrade-baseline.json that the validator reports as a warning. An exit-code fix in the graph backfill makes a failed repair visible."
trigger_phrases:
  - "pre-v4 upgrade plan"
  - "upgrade-legacy command"
  - "upgrade-baseline.json"
  - "recorded upgrade findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Pre-v4 spec folder upgrade path

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 22 ESM (`.mjs`) for the command, TypeScript for the validator change |
| **Framework** | spec-kit CLI tools and the validation orchestrator |
| **Storage** | One JSON file per upgraded packet, `upgrade-baseline.json` |
| **Testing** | Vitest through the skill-root config (`cli` and `root` projects), plus this packet's harness over tags `v3.0.0.0` and `v3.6.0.0` |

### Overview
A new command, `runtime/cli/spec/upgrade-legacy.mjs`, runs the repair tools that already exist in the order research fixed: document edits first, derivation second. It then writes every finding that is still an error into the packet's `upgrade-baseline.json`. The validator reads that file and reports a finding it lists as a warning. A finding the file does not list stays an error, so a new mistake in an upgraded packet still fails `--strict`. Separately, the graph backfill starts exiting non-zero when a folder fails, and that alone lets `repair-derived` report a failed re-derive instead of a repair.

The design comes from `research/research.md` §5, §7, §9 and §10, and from four read-only exploration passes whose citations were opened and checked before use.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` §2 and §3)
- [x] Success criteria measurable (`spec.md` §5: harness counts and a second-run diff)
- [x] Dependencies identified (§6 below)
- [x] Operator decisions recorded: wide recorded-findings scope, no placeholder documents, no Status rewrites (`spec.md` REQ-006 and REQ-007)

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`
- [x] New Vitest files pass, and so do the existing files for every touched tool
- [x] Harness: 170 of 170 (v3.0) and 995 of 995 (v3.6) active packets pass `--strict` after `--apply`, counted by v4's packet rule, and a second `--apply` changes no file
- [x] `validate.sh --strict` on this packet prints `RESULT: PASSED`
- [x] `runtime/cli/spec/README.md` and the v4.0.0.1 release notes name the command
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A thin command that runs existing CLI tools as child processes, plus one policy hook inside the validator.

### Key Components
- **`runtime/cli/spec/upgrade-legacy.mjs` (new).** The command copies the shape of the newest tool in the same folder: a header comment with usage and exit codes, a hand-written argument loop, dry by default with `--apply`, and exit 0 for clean, 1 for pending work, 2 for failure (`refresh-track-roots.mjs:38-61,113-114`). It is a new file because extending `repair-derived.cjs` in place fails. That tool's contract is to repair only facts the validator names as derivable and to refuse authored ones (`repair-derived.cjs:75-94`), and the pre-commit hook runs it on every commit (`.skilled/scripts/git-hooks/pre-commit:512,525`), so a tree-wide upgrade inside it would change what every commit runs.
- **`upgrade-baseline.json` (new, one per upgraded packet).** Its shape is `{ "schema": 1, "recordedBy": "upgrade-legacy", "recordedAt": "<ISO>", "findings": [{ "rule": "...", "detail": "..." }] }`, sorted by rule and then detail. The file lives inside the packet for two reasons. First, no rule, generator or discovery walker reads an unlisted JSON file there (`check-files.sh:85-88`, `graph-metadata-parser.ts:53-65`). Second, it moves with the packet on a rename. A field inside `description.json` or `graph-metadata.json` was rejected because the generators rewrite both files.
- **Recorded-findings hook in `runtime/lib/validation/orchestrator.ts` (modified).** The entry list is final at line 958 and the summary counts it at line 960 (`orchestrator.ts:955-977`). A new function between the two loads the file and turns an `error` entry into `warn` when every one of its details is listed for that rule. An entry with no details is matched on its message instead. Details are compared after line numbers are stripped, because several rules print them (`plan.md:17:`, `line=9`, `at line 117`). The function goes into `orchestrator.ts` rather than a new module because `validateFolder` is its only caller. The command stores raw detail strings, so the normalization exists in one place only.
- **Rules the file may never cover in an active packet.** These are `GENERATED_METADATA_INTEGRITY`, `GENERATED_METADATA_DRIFT`, `METADATA_DISK_PATH_CONSISTENCY`, `CANONICAL_SAVE_LINEAGE_REQUIRED` and `GRAPH_METADATA_CHILD_IDENTITY`. A re-derive clears them. Their detail text also repeats word for word each time metadata goes stale again, so a recorded entry would hide every future regression of that kind. Under `z_archive` or `z_future` they may be recorded, because an archive snapshot keeps its old recorded location on purpose (`repair-derived.cjs:386-388`) and nothing re-derives it.
- **Exit-code fix in `runtime/cli/graph/backfill-graph-metadata.ts` (modified).** A folder that fails goes into `failed[]` (`:653-658`), and `run()` still exits 0 (`:730-743`). The fix sets `process.exitCode = 1` when `failed[]` is non-empty. `repair-derived.cjs:324-331` then reports the failure without any change of its own.

### Data Flow
One run covers the specs roots it is given, `specs/` by default. Amended 2026-09-25 to match what was built: the review of the first build limited every write to packets that fail at the start and replaced the shared frontmatter backfill with a fill-only step, and the operator chose the layout refusal and the per-file report on malformed frontmatter. When the packets still live in `.opencode/specs`, the run stops before any write and prints `rm -f specs && git mv .opencode/specs specs && ln -s ../specs .opencode/specs`.

1. Discover packets with `collectSpecFolders` from the backfill module (`backfill-graph-metadata.ts:452-488`), skipping the spec-tree copies that research, review and context runs keep inside a packet. Only active packets are included unless `--include-archive` is passed.
2. Read-only pass: `validate.sh --strict --json --no-recursive` on each packet. This gives the before count. When a report cannot be read, `--apply` names the reason and writes nothing.
3. Document edits, failing active packets only: the fill step adds the frontmatter keys a spec document lacks without rewriting a value already there, and names each document whose block it cannot read, leaving it byte-identical. Then `heal-spec-docs.cjs --apply --folder <packet>`.
4. Derivation, failing active packets only: `repair-derived.cjs --apply --folder <packet>` edits packet pointers and re-derives graph metadata. Then `migrate-generated-json` runs with one `--only` per packet, which regenerates `description.json` and clears the `.opencode/specs/` prefix in `specFolder` that `repair-derived` never writes.
5. Validate each packet that failed at the start. For one that still fails, write `upgrade-baseline.json` with every copy of every error detail, leaving out the never-covered rules in an active packet. The write is atomic (temp file, then rename). The file keeps its `recordedAt` when the finding set is unchanged, so a rerun leaves it byte-identical.
6. Validate again. A packet that still fails is reported with its remaining rules, and the run exits 2.
7. Print one line per changed packet and a summary: packets inspected, passing before and after, and recorded findings by rule.

With `--include-archive`, archived packets skip steps 3 and 4 and are only recorded, because a snapshot is never rewritten (`research/research.md` §8). A dry run performs steps 1 and 2, lists the steps it would run, and exits 1 when any packet fails.

No step is judged by its exit code alone. Steps 5 and 6 read the verdict from the validator's JSON, because the backfill exits 0 on failure today and `heal-spec-docs.cjs` sets no exit code at all.

### Deviations to confirm with the operator
- **Phase 4 is optional.** Research recommended new structure-only transforms for anchors, continuity placeholders and fingerprint formats (`research/research.md` §5). REQ-002 does not depend on them, because the recorded file covers what they would clear, and none of those details repeats in a way that would hide a new finding. Phase 4 therefore runs only after Phase 3 has measured how many recorded findings each rule leaves, and builds a transform only where that count justifies the code.
- **NFR-R01 is replaced by convergence.** An all-or-nothing update per folder is not reachable while three external tools each write their own files. The plan instead makes every step idempotent, so a rerun after an interruption converges, and writes `upgrade-baseline.json` atomically. The operator approved this amendment on 2026-09-24, and `spec.md` NFR-R01 now reads: "A run interrupted mid-way converges to the same result when run again."
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The exit-code change and the validator hook both touch shared contracts, so every caller is listed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `backfill-graph-metadata.ts` `run()` | Derives graph metadata and reports failures in its JSON summary | Update: exit 1 when `failed[]` is non-empty | New spawn test with a folder that fails |
| `repair-derived.cjs:324-331` | Spawns the backfill and trusts its exit status | Unchanged. Now reports `FAILED` for a failed re-derive | Existing `repair-derived.vitest.ts` rerun |
| `.skilled/scripts/git-hooks/pre-commit:572-600` | Runs `repair-derived` over every packet with staged docs and blocks the commit on a non-zero exit | Unchanged, but stricter in effect: a re-derive that fails now blocks the commit, where before it passed as `repaired`. Bypass: `SPECKIT_SKIP_SPEC_REMINT=1` | Measured on 2026-09-24: a graph refresh fails for 0 of 4,114 packets in this checkout, so no commit today is newly blocked |
| `create.sh:1755-1765` | Spawns the backfill after scaffolding | Unchanged. Prints its existing warning on a non-zero exit | Read: `\|\| echo "Warning: graph metadata derivation skipped"` |
| `fanout-run.cjs:2904-2970` | Spawns the backfill for metadata refresh | Unchanged. Logs `metadata_refresh_failed` with status `warning` | Read: `failed = ... result.status !== 0` |
| `doctor-update.yaml:280` | Runs `--active-only` through `tee` | Unchanged. Its `on_failure` warns | Read |
| `migrate-generated-json.ts:54` and tests | Call `runBackfill` in-process | Not a consumer of `run()` | `rg` inventory below |
| `orchestrator.ts` `validateFolder` | Builds the summary and `passed` | Update: apply recorded findings before the summary | New Vitest cases |
| `.github/workflows/changed-packet-validation.yml:104-145` | Compares `RESULT: PASSED` on head and base | Unchanged. A recorded finding no longer fails head, a new one still does | Harness negative control |

Required inventories:
- **Same-class producers.** `heal-spec-docs.cjs` also finishes with exit 0 whatever happens. It is left as is, because the command takes its verdict from the validator (Data Flow step 6).
- **Consumers.** `rg -n --hidden "backfill-graph-metadata" .skilled .github`, run on 2026-09-24, produced the rows above.
- **Matrix axes.** Packet era (v3.0, v3.6), location (active, `z_archive`, `z_future`), file state (absent, all recorded, one new detail, malformed) and rule class (recordable, never covered). That is 2 × 3 × 4 × 2 = 48 rows. The proof runs cover era by location on real trees, `z_future` only in v3.6, which is the only tag holding it. The hook tests cover every file state and both rule classes, and test the rule-class split in an active and an archived packet. No single test walks all 48 rows.
- **Invariant.** A finding the file does not list is never downgraded. A never-covered rule is never downgraded outside `z_archive` and `z_future`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- **Phase 1, Setup.** Confirm the single-file test commands and capture the before numbers.
- **Phase 2, Validator hook and exit-code fix.** Both changes with their tests, then a dist rebuild.
- **Phase 3, Command.** `upgrade-legacy.mjs` with its tests, then the harness proof over both tags.
- **Phase 4, Optional transforms.** Gated on the counts Phase 3 measures.
- **Phase 5, Docs and closeout.** README, changelog and packet evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Recorded-findings hook in `validateFolder` | Vitest `root` project, in-process as `runtime/tests/generated-metadata-integrity.vitest.ts:281-298` does |
| Integration | `upgrade-legacy.mjs` on a temporary git repo holding a v3-shaped packet | Vitest `cli` project, spawned as `track-roots.vitest.ts:49-60` does |
| Integration | Backfill exit code on a folder that fails | Vitest `cli` project, spawned |
| End to end | Both tags through the harness | `scratch/harness/`: full run, second run, negative control |

### Proof plan
These checks were fixed before implementation, so the result cannot become the standard.

1. After `--apply` in a harness sandbox, `validate-all.cjs` and `agg.cjs` report 170 of 170 (v3.0) and 995 of 995 (v3.6) active packets passing `--strict`. The count follows v4's packet rule (an `NNN-slug` name, no dot-folder on the path), as the operator set on 2026-09-24.
2. A second `--apply` on the same sandbox leaves the path-and-sha256 manifest of the specs root identical.
3. Negative control: one new broken link in an upgraded packet makes `validate.sh --strict` print `RESULT: FAILED` with `SPEC_DOC_INTEGRITY` as an error.
4. With `--include-archive`, 158 of 158 (v3.0) and 895 of 895 (v3.6) archived packets pass, by the same packet rule.
5. A dry run on a fresh sandbox leaves the manifest identical and exits 1.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate.sh` and its compiled orchestrator | Internal | Green | The command cannot verify packets. `validate.sh` exits 3 on a stale dist (`validate.sh:276-299`), so the build must rerun after the orchestrator change |
| `backfill-frontmatter`, `heal-spec-docs`, `repair-derived`, `migrate-generated-json` | Internal | Green | A step fails. Each one runs as a process and the validator checks its effect afterwards |
| Harness sandbox, about 800 MB per tag | Internal | Green | Proof items 1 to 5 cannot run |
| Another session editing this checkout | Process | Yellow | Shared files can change during the build. Stage and commit by explicit path only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the harness shows a v4 packet that passed before and fails after, or CI fails on the orchestrator change.
- **Procedure**: revert the commit and rebuild the dist. A user's specs root is under git, so `git checkout -- <specs root>` undoes a run, and the dry run lists every packet a run would touch.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Validator hook, exit code) ──► Phase 3 (Command, harness proof)
                                                                  │
                                                                  ├──► Phase 4 (Optional transforms)
                                                                  │
                                                                  └──► Phase 5 (Docs, closeout)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Validator hook |
| Validator hook and exit-code fix | Setup | Command |
| Command | Validator hook | Optional transforms, Docs |
| Optional transforms | Command's measured counts | Docs, if built |
| Docs and closeout | Command | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Validator hook and exit-code fix | Med | 2 to 3 hours |
| Command | Med | 4 to 6 hours |
| Harness proof | Med | 2 hours, about 10 minutes per full tag run |
| Optional transforms | Med | 3 to 5 hours, only if built |
| Docs and closeout | Low | 1 hour |
| **Total** | | **10 to 13 hours without Phase 4, 13 to 18 hours with it** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Harness proof items 1 to 5 recorded in `implementation-summary.md`
- [x] No feature flag needed: the hook acts only when a packet holds `upgrade-baseline.json`, and no v4 packet holds one (0 under `specs/` on 2026-09-25)
- [x] Full `cli` and `root` Vitest projects rerun from the final state (2026-09-25: cli 1,550 passed, root 1,274 passed, 0 failed)

### Rollback Procedure
1. Revert the commit that adds the hook, the exit-code fix and the command.
2. Rebuild the dist so `validate.sh` does not exit 3 on a stale orchestrator.
3. Rerun `validate.sh --strict` on this packet and on one current v4 packet.
4. A user who already ran the command restores the specs root from git.

### Data Reversal
- **Has data migrations?** Yes. The command edits the user's spec folders.
- **Reversal procedure**: `git checkout -- <specs root>` restores edited files, and `git clean -n <specs root>` lists the created `upgrade-baseline.json`, `description.json` and `graph-metadata.json` files before they are removed.
<!-- /ANCHOR:enhanced-rollback -->

---
