# Iteration 4 — security (doctor command surface)

## Files Reviewed

| Path | Classification | Notes |
|------|---------------|-------|
| `.opencode/commands/doctor/memory.md:272` | Command spec (read-only) | Setup phase only; mutation delegated to YAML |
| `.opencode/commands/doctor/causal-graph.md:271` | Command spec (read-only) | Add-only edge policy; no deletion paths |
| `.opencode/commands/doctor/deep-loop.md:262` | Command spec (read-only) | Read-only diagnostic; iteration files as inputs |
| `.opencode/commands/doctor/cocoindex.md:256` | Command spec (read-only) | Daemon health gating; snapshot+restart |
| `.opencode/commands/doctor/update.md:256` | Orchestrator spec (mutating) | flock+snapshot+rollback+10-phase workflow |
| `.opencode/commands/doctor/assets/doctor_update.yaml:489` | Orchestrator YAML (execution) | `rm -rf`, `mv`, `ln -s`, `npm`, `pip install -e`, `sqlite3`, `node -e` |
| `.opencode/commands/doctor/assets/doctor_memory.yaml:236` | YAML (diagnostic-only) | Read-only by contract; no mutation phases |
| `.opencode/commands/doctor/assets/doctor_causal-graph.yaml:255` | YAML (diagnostic-only) | Read-only by contract; add-only enforcement |
| `.opencode/commands/doctor/assets/doctor_deep-loop.yaml:259` | YAML (diagnostic-only) | Read-only by contract |
| `.opencode/commands/doctor/assets/doctor_cocoindex.yaml:239` | YAML (diagnostic-only) | Read-only by contract |
| `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:211` | Bootstrap shell script | `npm ci/install/build`, directory rename, symlink create, `mkdir` lock |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh:549` | MCP diagnostic script | `node -e require()`, `chmod`, `npm cache clean`, `npx` |
| `001-doctor-commands/spec.md:352` | Spec (references) | Security NFRs (NFR-OS01..OS04); REQ-005 flock, REQ-006 snapshots |
| `001-doctor-commands/decision-record.md:238` | ADRs (references) | ADR-001 tx model, ADR-005 concurrent dispatch, ADR-002 snapshots, ADR-008 migration safety |
| `001-doctor-commands/implementation-summary.md:309` | Implementation status | completion_pct=99; FIX-12/FIX-13 patched |

## Findings by Severity

### P0

No P0 findings. The doctor command surface has no confirmed exploitable security issues. The design is conservative with mutation boundaries (allowlist + canonical-path validation), flock-based concurrency control, VACUUM INTO snapshots before all mutations, tier-aware interactive prompting, and documented SIGINT cancel-safety (ADR-001, ADR-007). No hardcoded credentials, no user-controlled command injection into shells, no network-facing endpoints that accept untrusted input.

### P1

#### P1-001 [P1] `doctor_update.yaml`: `rm -rf` with dynamic timestamp path in `directory_layout_bridge` — TOCTOU risk under stale flock
- File: `.opencode/commands/doctor/assets/doctor_update.yaml:287`
- Evidence: `rm -rf .opencode/skill_legacy_backup_$(date -u +%Y%m%dT%H%M%SZ) 2>/dev/null` constructs a path from `date` output. If the flock is released prematurely (e.g., due to a SIGKILL leaving no flock cleanup), a subsequent concurrent invocation could delete a legitimate backup directory created between flock acquisition and the `rm -rf`.
- Finding class: cross-consumer (any path into Phase 8 with stale flock)
- Scope proof: `rg -n "rm -rf" .opencode/commands/doctor/assets/doctor_update.yaml` shows single site at line 287. The `rm -rf` is immediately followed by `mv` on line 288. The invariant comment at line 30-32 of the YAML (`update_orchestrator_invariant`) requires `rm -f .doctor-update.flock` before exit on every abort path, which mitigates but does not eliminate the risk since SIGKILL bypasses trap handlers.
- Affected surface hints: ["doctor_update.yaml:287", "directory_layout_bridge", "flock stale-detection"]
- Recommendation: Add a second `flock` re-check immediately before the `rm -rf` in `directory_layout_bridge`, OR use a fixed backup path like `.opencode/skill_legacy_backup` (single directory) instead of a timestamped path, to remove the race window. The timestamp could be embedded in a file inside the backup dir instead.

#### P1-002 [P1] `doctor-runtime-bootstrap.sh`: `npm install --no-audit` suppresses vulnerability scanning during bootstrap
- File: `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:183-186`
- Evidence: `npm install --no-audit --no-fund --silent` and `npm ci --no-audit --no-fund --silent` skip the npm audit step, which means known vulnerabilities in transitive dependencies (e.g., better-sqlite3 native addon, its build dependencies) will not be flagged before the MCP server starts. The bootstrap script runs on every fresh install and after version upgrades.
- Finding class: class-of-bug (npm-based install scripts in this codebase)
- Scope proof: `rg -n "\-\-no-audit" .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` confirms 2 sites (lines 183 and 194). The `--no-audit` flag is also used consistently across the codebase's other install scripts.
- Affected surface hints: ["doctor-runtime-bootstrap.sh:183", "npm install", "supply-chain"]
- Recommendation: Remove `--no-audit` from the npm install commands, or at minimum emit a warning to the operator when `npm audit` reports high/critical vulnerabilities after install. The silent suppression hides security regressions introduced by dependency updates.

#### P1-003 [P1] `doctor_update.yaml`: `cocoindex_venv_check` runs `pip install -e .` on local path — executes package setup code
- File: `.opencode/commands/doctor/assets/doctor_update.yaml:306-307`
- Evidence: `python3 -m venv .opencode/skills/mcp-coco-index/mcp_server/.venv && .opencode/skills/mcp-coco-index/mcp_server/.venv/bin/pip install --quiet -e .opencode/skills/mcp-coco-index/mcp_server` — `pip install -e .` executes the package's `setup.py` or `pyproject.toml` build backend, which runs arbitrary Python code in the package directory. While this is a local workspace path (not fetched from PyPI), a compromised or maliciously modified `setup.py` in the CocoIndex MCP server would execute with the operator's privileges.
- Finding class: instance-only (specific to CocoIndex venv recreation path)
- Scope proof: `rg -n "pip install.*-e" .opencode/commands/doctor/assets/doctor_update.yaml` confirms single site at line 307. The cocoindex venv is the only `pip install` invoked by the doctor command surface.
- Affected surface hints: ["doctor_update.yaml:307", "cocoindex_venv_check", "pip install"]
- Recommendation: Add a pre-check that verifies a known hash or signature of the CocoIndex `setup.py`/`pyproject.toml` before running `pip install -e .`. At minimum, warn the operator with the full `pip install` command before execution (matching the tier-aware prompt policy). The current behavior auto-runs in Phase 8 without operator confirmation.

#### P1-004 [P1] `doctor-runtime-bootstrap.sh`: `mkdir` lock primitive is TOCTOU-raceable with multiple concurrent bootstrap invocations
- File: `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:129`
- Evidence: `if ! mkdir "$LOCK_DIR" 2>/dev/null; then fail "bootstrap lock already exists..."` uses mkdir as an atomic lock, which is correct for a single-node concurrency primitive. However, `doctor_update.yaml` Phase 1 acquires `flock` on `.doctor-update.flock` AFTER Phase 0 bootstrap completes (line 205). If two `/doctor:update` invocations reach the bootstrap phase simultaneously (e.g., two concurrent OpenCode sessions both detecting missing dist), the bootstrap lock only serializes the bootstrap — but after the first bootstrap completes and exits with `restart_required`, the second bootstrap process could take the stale lock and re-run `npm install` concurrently with the first process's `npm build` tail.
- Finding class: class-of-bug (bootstrap concurrency)
- Scope proof: `rg -n "bootstrap.lockdir\|bootstrap_lock\|LOCK_DIR" .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh .opencode/commands/doctor/assets/doctor_update.yaml` shows: bootstrap.sh line 50 defines LOCK_DIR, line 129 acquires, line 100 releases on trap. doctor_update.yaml line 116 references `.doctor-update.bootstrap.lockdir` but does not acquire a flock on it; Phase 0 bootstrap runs BEFORE Phase 1 flock at line 205.
- Affected surface hints: ["doctor-runtime-bootstrap.sh:129", "doctor_update.yaml:205", "bootstrap lock"]
- Recommendation: Move `flock` acquisition to before Phase 0 bootstrap, or have the bootstrap script acquire the same `.doctor-update.flock` before performing any directory/symlink mutations. The current ordering (bootstrap → flock) means the two most destructive phases (directory rename, npm install) run without the orchestrator's concurrency guard.

#### P1-005 [P1] No integrity verification of `migration-manifest.json` before executing migration operations
- File: `.opencode/commands/doctor/update.md:247` and `.opencode/commands/doctor/assets/doctor_update.yaml:280-281`
- Evidence: `Read migration-manifest.json for migration definitions; refuse if missing or gapped` — the YAML instructs the executor to read and parse `migration-manifest.json` but does not specify any integrity verification (hash, signature, or schema validation beyond JSON parse). A corrupted or tampered manifest could declare incorrect legacy file paths for `--cleanup-legacy`, causing the operator to be prompted to delete the wrong files. The manifest is at `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json`, which is a version-controlled file — but no runtime check verifies it matches the expected version.
- Finding class: instance-only (migration manifest consumption)
- Scope proof: `rg -n "migration-manifest.json" .opencode/commands/doctor/update.md .opencode/commands/doctor/assets/doctor_update.yaml` confirms 3 references. The manifest is read but never hash-verified.
- Affected surface hints: ["doctor_update.yaml:280", "migration-manifest.json", "legacy cleanup"]
- Recommendation: Add a JSON schema validation step or maintain a SHA-256 hash of the expected migration-manifest.json in the YAML asset. At minimum, verify that the manifest's declared version matches the codebase version before acting on its contents.

### P2

#### P2-001 [P2] `mcp-doctor.sh` reads `.env` file metadata and `.utcp_config.json` — could confirm environment shape to path traversers
- File: `.opencode/commands/doctor/scripts/mcp-doctor.sh:373-395`
- Evidence: The script checks `.env` file existence (line 389: `[[ -f "$env_file" ]]`) and `.utcp_config.json` parse-ability (line 375: `node -e "JSON.parse(require('fs').readFileSync('$utcp_config','utf8'))"`). Neither reads or logs the actual contents, but confirming which environmental config files exist is a reconnaissance primitive. Impact is low because this is a local CLI tool, not a network service, and the script's output stays within the operator's terminal.
- Finding class: instance-only (local diagnostic)
- Scope proof: `rg -n "\.env\|\.utcp_config\|env_file\|utcp_config" .opencode/commands/doctor/scripts/mcp-doctor.sh` shows references at lines 387-395. The `.env` check merely confirms existence.
- Affected surface hints: ["mcp-doctor.sh:389", "env_file existence check"]
- Recommendation: No code change needed given local-only context. Document in the script's help text that the diagnostic reads filesystem metadata (file existence, timestamps) but not file contents.

#### P2-002 [P2] `doctor-runtime-bootstrap.sh` `--root` flag accepts arbitrary filesystem paths without workspace-boundary validation
- File: `.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh:10-16`
- Evidence: `ROOT="$2"` is accepted verbatim from `--root` argument, then canonicalized via `cd "$ROOT" && pwd` at line 42. The only validation is that `$OPENCODE_DIR` (i.e., `$ROOT/.opencode`) exists at line 123. An operator could pass `--root /tmp/evil` where `/tmp/evil/.opencode/skills/system-spec-kit/package.json` contains malicious build scripts, and the bootstrap would `npm install` inside it. Impact is low because: (a) the operator must intentionally pass a malicious `--root`, (b) the malicious dir would need a full `.opencode` tree structure, (c) npm runs as the operator's user, not elevated.
- Finding class: instance-only (operator-controlled input)
- Scope proof: `rg -n "\-\-root\|ROOT_OVERRIDE\|ROOT=" .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh` shows usage at lines 10-16, 39-42, 123. The path is used in `cd` and `mkdir -p`.
- Affected surface hints: ["doctor-runtime-bootstrap.sh:42", "--root flag"]
- Recommendation: Add a check that `$ROOT` resolves to a path containing a git repository (e.g., `git -C "$ROOT" rev-parse --is-inside-work-tree`) or that it contains expected marker files beyond just `.opencode/`. This prevents accidentally or maliciously bootstrapping a non-project directory.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|---------|
| spec_code | partial | REQ-005 (flock) traced to `doctor_update.yaml:205 phase_1_flock_acquire`; REQ-006 (snapshot) traced to `doctor_update.yaml:369 phase_3_snapshot_all_databases`; REQ-011 (SIGINT) traced to `doctor_update.yaml:459 phase_6_sigint_cancel_contract`. NFR-OS01 (no mutation without snapshot) is enforced by workflow ordering (snapshot Phase 3 before execute Phase 5). NFR-OS02 (no concurrent dispatch) is enforced by flock. Missing trace: REQ-022 (auto-cleanup >30 days) is `doctor_update.yaml:483 phase_10_state_log_unlock_cleanup` — partial (described but cleanup command not explicit). |
| checklist_evidence | not-yet | `checklist.md` references CHK-502..CHK-511 for G4-G9 security smoke tests. Per `implementation-summary.md:224-233`, G4-G9 are all "pending" — no completed verification evidence exists for flock, SIGINT, or concurrent dispatch. |
| skill_agent | partial | `/doctor:update` Markdown references existing `/doctor:code-graph`, `/doctor:skill-advisor`, and `/doctor:skill-budget` commands as related. No `@doctor` agent exists — commands are operator-run via YAML workflows, not dispatched to a skill-owned agent. |
| agent_cross_runtime | not-yet | The doctor commands exist only in `.opencode/commands/doctor/` — no mirror paths in `.claude/`, `.codex/`, `.gemini/`. The `mcp-doctor.sh` checks config wiring across runtimes (lines 486-521) but the doctor commands themselves are OpenCode-surface only. |
| feature_catalog_code | partial | `resource-map.md` lists implementation paths for the 5 commands. Cross-check: memory.md ✅, causal-graph.md ✅, deep-loop.md ✅, cocoindex.md ✅, update.md ✅, doctor_memory.yaml ✅, doctor_causal-graph.yaml ✅, doctor_deep-loop.yaml ✅, doctor_cocoindex.yaml ✅, doctor_update.yaml ✅. Missing from resource-map: `doctor-runtime-bootstrap.sh`, `mcp-doctor.sh`, `mcp-doctor-lib.sh`. |
| playbook_capability | partial | 002-sandbox-testing-playbook references 25 scenarios. Security-specific scenarios (concurrent dispatch, SIGINT cancel, snapshot rollback) listed in 002 spec.md but YAML workflow attestations for these scenarios not found in current review scope (002 implementation-summary.md line ranges don't enumerate per-scenario results). |

## Verdict

**CONDITIONAL** — Active P0: 0, Active P1: 5. No blockers prevent merge, but the five P1 findings represent concrete security improvements that should be addressed before `/doctor:update` is invoked in production. The flock-ordering gap (P1-004) is the most concerning — two concurrent OpenCode sessions could both enter Phase 0 bootstrap concurrently before the flock serializes Phase 1.

## Next Dimension

**Iteration 5 should focus on traceability** — specifically `spec_code` coverage for the 5 remaining P1 findings from iterations 2-3 (R2-P1-001 through R2-P1-006) and `checklist_evidence` verification (G4-G9 gates). The `playbook_capability` overlay should cross-check whether 002 sandbox scenarios actually exercise the security-critical paths identified in this iteration (flock contention, SIGINT cancel, snapshot rollback). The `feature_catalog_code` overlay was partial — 3 implementation scripts are missing from `resource-map.md` and should be flagged.
