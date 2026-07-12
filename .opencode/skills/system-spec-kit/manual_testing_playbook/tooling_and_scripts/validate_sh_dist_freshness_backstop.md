---
title: "455 -- validate.sh Dist-Freshness Backstop"
description: "Manual check that validate.sh's Node orchestrator path fails closed with exit 3 and a rebuild instruction when the compiled spec-validation orchestrator is stale relative to its TypeScript source, and passes cleanly once the dist entry is rebuilt (or its mtime restored)."
version: 1.0.0.0
---

# 455 -- validate.sh Dist-Freshness Backstop

## 1. OVERVIEW

This scenario verifies the hard backstop in `run_node_orchestrator()` inside `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`. Before delegating a validation run to the compiled Node orchestrator (`mcp_server/dist/lib/validation/orchestrator.js`), `validate.sh` calls the shared `checkPackageFreshness()` helper from `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` (the same module that backs the CLI shim guard in playbook entry [429](cli_dist_freshness_guard.md)) scoped to the `validation-orchestrator` entry of the `system-spec-kit/mcp_server` package.

Unlike the CLI shims, which are a client convenience, this is a NEW hard backstop: if the compiled orchestrator is stale relative to its TypeScript source (`mcp_server/lib/validation/orchestrator.ts` and its `lib/validation`, `lib/templates`, `lib/spec`, `lib/graph`, `lib/config`, and `lib/description` source trees), `validate.sh` refuses to fall through to the possibly-outdated compiled JS. It prints `ERROR: validate.sh compiled validation orchestrator is stale.`, the freshness checker's own message and rebuild command, and exits **3** — it does not attempt to auto-rebuild, and it does not silently fall back to the shell-only validator path. Auto-rebuild was deliberately rejected here: a validate.sh call under this backstop is often running concurrently with other active editing sessions against the same shared, gitignored `dist/` output, and an automatic rebuild risks compiling in another session's unrelated uncommitted changes into that shared artifact. Failing closed and asking the operator to rebuild explicitly avoids that cross-session contamination risk.

Freshness here is the same pure mtime comparison documented in [429](cli_dist_freshness_guard.md): newest watched source mtime versus the compiled entry's mtime, with a lazily-written same-session hash cache as a performance short-circuit only. `.opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh` is the existing automated equivalent of this manual scenario — it exercises the identical stale-then-fresh sequence against the same source/dist pair and asserts exit 3 then a non-3 passthrough.

## 2. SCENARIO CONTRACT

- Objective: Confirm `validate.sh` fails closed with exit 3 and the rebuild instruction when the compiled validation orchestrator is stale, and passes again once the dist entry is no longer older than the source.
- Real user request: `If someone edits the spec-validation orchestrator's TypeScript and forgets to rebuild, will validate.sh silently run the old compiled version against my spec folder?`
- Prompt: `Make the compiled spec-validation orchestrator stale relative to its TypeScript source, confirm validate.sh exits 3 with the rebuild instruction on a real spec folder, then restore freshness and confirm it passes again.`
- Expected execution process: Snapshot source/dist mtimes, append a trailing newline to `orchestrator.ts` and back-date `dist/lib/validation/orchestrator.js` with `touch -t`, run `validate.sh` against a spec folder (refusal), restore the source content and bring the dist mtime current (or rebuild), rerun `validate.sh` (pass).
- Expected signals: Exit 3 with `ERROR: validate.sh compiled validation orchestrator is stale.` plus the rebuild command on the stale run; a non-3 validation result (0 pass / 1 warnings / 2 rule errors, never 3) on the restored run.
- Desired user-visible outcome: A stale compiled validator can never silently grade a spec folder — the operator is stopped and told exactly what to rebuild.
- Pass/fail: PASS only when the stale run exits exactly 3 with the rebuild instruction, and the restored run exits anything other than 3 with no stale-orchestrator error text.

## 3. TEST EXECUTION

### Prompt

```text
Make the compiled spec-validation orchestrator stale relative to its TypeScript source, confirm validate.sh exits 3 with the rebuild instruction on a real spec folder, then restore freshness and confirm it passes again.
```

### Commands

```bash
SOURCE=.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts
DIST=.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js
FOLDER=<any real spec folder path, e.g. .opencode/specs/<track>/<###-name>>
CACHE_GLOB=.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/.dist-freshness-system-spec-kit-mcp_server-*.json

# snapshot exact mtimes so both files can be restored without a rebuild
SRC_MTIME=$(python3 -c "import os,sys; print(os.stat(sys.argv[1]).st_mtime_ns)" "$SOURCE")
DIST_MTIME=$(python3 -c "import os,sys; print(os.stat(sys.argv[1]).st_mtime_ns)" "$DIST")
BAK=$(mktemp); cp "$SOURCE" "$BAK"                                # exact content backup

printf '\n' >> "$SOURCE"                                          # real, reversible content change
touch -t 202001010000 "$DIST"                                     # force dist older than source
rm -f $CACHE_GLOB                                                 # clear the same-session hash cache

SPECKIT_COMPLETION_FRESHNESS=0 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$FOLDER"; echo "stale_exit=$?"

cp "$BAK" "$SOURCE"; rm -f "$BAK"                                  # restore exact source content
python3 -c "import os,sys; os.utime(sys.argv[1], ns=(int(sys.argv[2]), int(sys.argv[2])))" "$SOURCE" "$SRC_MTIME"
python3 -c "import os,sys; os.utime(sys.argv[1], ns=(int(sys.argv[2]), int(sys.argv[2])))" "$DIST" "$DIST_MTIME"
rm -f $CACHE_GLOB

SPECKIT_COMPLETION_FRESHNESS=0 bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh "$FOLDER"; echo "restored_exit=$?"
```

Operators without a specific spec folder in mind can use the repo's own validator test fixture for a deterministic target: `.opencode/skills/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2` (this is exactly what `test-dist-freshness.sh` exercises).

### Expected

- `stale_exit=3` with stderr containing:
  ```text
  ERROR: validate.sh compiled validation orchestrator is stale.
  @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
  ```
- `restored_exit` is a normal validation result code (0 pass, 1 warnings, or 2 rule errors) — never 3, and stdout contains no `compiled validation orchestrator is stale` line.

### Evidence

Shell transcript with both exit codes, the stale-run stderr block, and the restored run's `RESULT:` line.

### Pass / Fail

- **Pass**: stale run exits exactly 3 with the rebuild instruction; restored run exits non-3 with clean validator output.
- **Fail**: the stale run falls through to the compiled orchestrator anyway (exit code matches a normal validation result instead of 3), the rebuild command is missing from the message, or the restored run still exits 3.

### Failure Triage

If the stale run does not exit 3, confirm `SPECKIT_VALIDATE_LEGACY` and `SPECKIT_RULES` are unset in the shell — both short-circuit `run_node_orchestrator()` before the freshness check runs, per `validate.sh:970-973`. If the restored run still exits 3, the mtime restore likely did not apply — re-run the `python3 os.utime` restore lines, or simply `touch "$DIST"` so its mtime is unambiguously newer than the source, and delete any stray `.dist-freshness-*.json` cache file next to the dist entry. If `git diff` on `orchestrator.ts` is non-empty after the test, the content restore did not land — reapply `cp "$BAK" "$SOURCE"` from the backup before doing anything else.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| [429](cli_dist_freshness_guard.md) | Sibling scenario for the CLI-shim side of the same shared freshness module |
| `../../feature_catalog/tooling_and_scripts/dist_freshness_enforcement.md` | Feature-catalog source describing the shared dist-freshness architecture |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-spec-kit/scripts/spec/validate.sh` | `run_node_orchestrator()` hard backstop (exit 3), lines ~969-1001 |
| `.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs` | Shared `checkPackageFreshness()` module the backstop calls with `--package system-spec-kit/mcp_server --entry validation-orchestrator` |
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Watched TypeScript source for the compiled orchestrator entry |
| `.opencode/skills/system-spec-kit/scripts/tests/test-dist-freshness.sh` | Automated equivalent of this manual scenario (stale-then-fresh assertion pair) |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 455
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/validate_sh_dist_freshness_backstop.md`
