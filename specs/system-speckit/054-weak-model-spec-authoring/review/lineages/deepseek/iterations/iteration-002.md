# Review Iteration 2 — Security

## Dispatcher

- Mode: review · Target agent: deep-review · Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `fanout-deepseek-1793081281038-z2aj1o` · lineage `deepseek` · generation 1 · lineageMode `new`
- Iteration: 2 of 3 · Dimension: security · Stop policy: `max-iterations`
- Operator review focus carried into this iteration: the phases that ship a write or an execution path are 017 (draft metadata auto-repair), 022 (private-command linking on provision) and 021 (the CI gate). This iteration opens each shipped file behind those claims and asks the security question the phase records do not ask: what can these paths write, where do they resolve it, and can untrusted packet or repository content steer them.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` (write path, path confinement, argument parsing)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1531-1700` (repair entry, snapshot, spawn)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs` (citation path confinement)
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh`
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:340-440` (spawn quoting, rule-subset selector)
- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:400-440` (shell-rule spawn, fail-closed registry bridge)
- `.skilled/skills/sk-git/scripts/worktree-naming.sh:614-647, 766` (private-command link step)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh`, `check-example-drift.sh` (argument handling, read-only contract)
- `.github/workflows/changed-packet-validation.yml:40-140` (pull-request-controlled text)
- Phase records read for the claim side: `017-.../spec.md` REQ-004/REQ-005, `017-.../implementation-summary.md`, `022-.../implementation-summary.md`, `021-.../implementation-summary.md`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None raised in this iteration. One P1 raised in iteration 1 stays active and its security reading is recorded here rather than re-raised: the draft auto-repair is reachable from a recursive validation run (`F1-P1-001`), which means an unattended writer is exposed to a command operators run as a check. The repair itself is confined (see Confirmed-Clean Surfaces), so the exposure is scope, not escape.

### P2 Findings

1. **The repair's before/after snapshot reads every top-level packet file whole, twice, with no size guard** -- `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1595` -- `snapshotPacketFiles` calls `fs.readFileSync` on every top-level file and holds the bytes in a `Map`, and `runDraftAutoRepair` takes that snapshot before the repair (`:1639`) and again after it (`:1653`) so `changedPacketFiles` can diff them. Nothing caps a file's size or the number of files. A stale-copy exists only to prove what changed, so peak memory is roughly twice the packet's top-level byte count, charged to a run whose stated purpose is to check a packet. A packet that keeps an evidence archive, a captured log or a screenshot at its root turns a `validate.sh --strict` check into an allocation proportional to it.
   - Finding class: `instance-only`
   - Scope proof: `orchestrator.ts:1595-1606` reads each `isFile()` entry whole with no size or count limit; `:1639` and `:1653` both call it in one repair run.
   - Affected surface hints: `runDraftAutoRepair`, the `--strict` Draft path in `validate.sh`, any packet whose root holds a large evidence file.
   - Case: a Draft packet with a 300 MB capture at its root runs `validate.sh --strict`; the repair path allocates about 600 MB before deciding whether to rewrite a 2 KB `description.json`.
   - Downgrade trigger: a cap in the caller (a `statSync` size filter before the read, or a repair that snapshots only `REWRITE_TARGETS`) would make this a non-issue.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Phase 017's REQ-005 refusal set is present and complete for the cases it names (`orchestrator.ts:1568-1592`), and REQ-009's notice routing is exactly `opts.json || opts.quiet ? process.stderr : process.stdout` (`:1636`). Phase 022's "never replaces an existing path, never fails provisioning" matches `_wn_link_local_commands` (`worktree-naming.sh:637-646`). |
| `checklist_evidence` | core | partial | Phase 017's claim that five sibling tools were switched off so read-only tools stay read-only is confirmed by the five `SPECKIT_DRAFT_AUTO_REPAIR=0` call sites; the recursive path is the omission (iteration 1). |
| `skill_agent` | overlay | notApplicable | No skill/agent routing surface is in the security dimension. |
| `agent_cross_runtime` | overlay | notApplicable | Not reached this iteration. |
| `feature_catalog_code` | overlay | pending | Scheduled for iteration 3. |
| `playbook_capability` | overlay | partial | No playbook scenario names the recursive repair path; `manual-testing-playbook/template-authoring/draft-auto-repair-rewrites-derived.md` covers the single-packet case only. |

## Confirmed-Clean Surfaces

- **Repair write confinement.** `repair-derived.cjs` refuses a symlinked rewrite target (`REWRITE_TARGETS` filtered through `isSymbolicLink`, `:249-251`), refuses a packet document that resolves outside the packet through a link (`isWithinPacketFolder`, `:269-282`), and refuses a target outside `<root>/specs` on both the lexical and the real path (`insideSpecs`, `:652-668`), with `.opencode/specs` accepted only when the real path agrees.
- **Repair write mechanics.** `writeAtomic` (`:323-348`) creates the sibling with `wx` and six random bytes so a pre-planted link cannot receive the write, copies the original mode, and renames over the target — a reader sees the old bytes or the new ones, never a truncated file.
- **Repair argument handling.** `parseArgs` (`:605-631`) fails on an unknown `--flag` and on a bare path, so a dropped `--folder` cannot become a whole-tree rewrite; `--folder` repeats and each path is validated before any read.
- **Repair recursion guard.** The repair child is spawned with `SPECKIT_DRAFT_AUTO_REPAIR=0` in its environment (`orchestrator.ts:1648`), so an inner `validate.sh` cannot start a second repair.
- **Citation confinement.** `check-source-tags-helper.mjs:157` drops any candidate that starts with `../` or is absolute, and `hasSymlinkedParent` (`:173`) refuses a candidate that reaches the worktree through a symlinked parent. A `[SOURCE: ../../../etc/passwd:1]` cannot resolve.
- **Validation spawn quoting.** Every child invocation is an argv array with no shell: `"${ORCHESTRATOR_CMD[@]}" --folder "$FOLDER_PATH"` (`validate.sh:377`), `"${ORCHESTRATOR_CMD[@]}" --folder "$phase_dir"` (`:414`), `spawnSync('bash', [...])` for a shell rule and `spawnSync('node', [...])` for a node rule. A packet folder named with a space, a quote or `$(...)` cannot become a command.
- **Registry bridge fail-closed.** A shell rule that exits non-zero while claiming `pass` is promoted to an error (`orchestrator.ts:339-344`), and an unrecognised `SPECKIT_RULES` name is fatal rather than ignored (`:430-445`), so a narrowed run cannot report a clean pass for a packet nobody checked.
- **Pull-request-controlled text in CI.** The changed-packet workflow interpolates only `github.event_name`, `pull_request.base.sha`, `pull_request.head.sha` and `github.event.before` into its `run:` block (`changed-packet-validation.yml:51-58`) — an enum and three hex SHAs. Packet names, which a pull request does control, are NUL-delimited into a file, line-break-escaped, and `::`-escaped before they reach an annotation (`:74-118`).
- **Private-command linking.** `_wn_link_local_commands` only runs for a standard clone with a primary checkout beside `.git`, only for `.gitignore` rules whose segment shape is `<dot-dir>/(commands|commands/assets|prompts)/local-*`, never replaces an existing path or link, and swallows every failure so provisioning cannot fail on it (`worktree-naming.sh:622-647`).
- **Guard scripts are read-only.** `check-card-sync.sh` and `check-example-drift.sh` open no file for writing; the only process either spawns is `node runtime/cli/utils/template-structure.js compare`, which prints.

## Edge Cases

- **`insideSpecs` on a non-existent alias root.** `.opencode/specs` does not exist in this checkout, so `fs.realpathSync(root)` throws inside the inner `catch`, which returns `false` for that root only; the `specs` root still decides. Confirmed by reading `:652-668`, not by execution.
- **Snapshot read errors.** `snapshotPacketFiles` swallows a read failure (`catch {}`), so an unreadable top-level file is simply absent from both snapshots. That makes the "rewrote" list incomplete rather than wrong, and it is why finding 1 is written against memory, not against attribution.
- **Packet-controlled `.gitignore` in a worktree.** A branch can add a matching rule for an unusual dot-directory, but the source side must already exist in the primary checkout and the link lands in a git-ignored directory the branch already owns. No privilege boundary is crossed.

## Ruled Out

- **Command injection through a crafted packet folder name**: every spawn is an argv array (see Confirmed-Clean).
- **A symlink planted inside a packet diverting a repair write outside it**: refused at three layers (`REWRITE_TARGETS`, `linkedRederiveInputs`, `insideSpecs`).
- **A symlinked `description.json` being rewritten through its target**: `readIfPresent` returns null for a link and `linkedRewriteTargets` reports the packet as refused.
- **Registry rule output forging a pass**: an exit-status mismatch is promoted to an error.
- **Workflow command injection through a packet name**: names are escaped for `::` and line breaks before they reach an annotation.

## Next Dimension

Traceability. Focus: the phase-claims sweep the operator asked for — each phase 001-022's closeout claim against the shipped file it names, including the generated artifacts phase 022 says it recompiled (`derive-command-bridges.cjs --check`, the graph freshness check and the route guard), and the documentation claims phases 012, 014 and 020 make about alignment.

Review verdict: CONDITIONAL
