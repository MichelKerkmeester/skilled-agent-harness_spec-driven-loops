# Iteration 5 — security (sandbox + test fixtures)

Deep-pass on security of 002-sandbox-testing-playbook Docker sandbox and test fixture scaffolding.

## Files Reviewed

| Path | Classification | Notes |
|------|---------------|-------|
| `002-sandbox-testing-playbook/spec.md:356` | spec-auth | NFR security requirements and edge cases |
| `002-sandbox-testing-playbook/implementation-summary.md:271` | evidence | Known limitations and deferred items |
| `002-sandbox-testing-playbook/decision-record.md:269` | evidence | ADR-004 fixture hosting, ADR-006 harness language |
| `002-sandbox-testing-playbook/checklist.md:314` | evidence | CHK-SEC-001..003 security checkpoints |
| `_sandbox/23--doctor-commands/Dockerfile:26` | impl | Container image definition, user setup |
| `_sandbox/23--doctor-commands/docker-compose.yml:15` | impl-p0 | Volume mounts, env vars, service config |
| `_sandbox/23--doctor-commands/fixtures/manifest.json:46` | impl | Fixture URLs, SHA-256, credentials check |
| `_sandbox/23--doctor-commands/fixtures/fetch-fixtures.sh:152` | impl | Idempotent download + checksum verify |
| `_sandbox/23--doctor-commands/harness/run-all.sh:202` | impl | Orchestrator, dry-run, verdict rollup |
| `_sandbox/23--doctor-commands/harness/reset-state.sh:86` | impl-p0 | Fixture restore, sandbox guard |
| `_sandbox/23--doctor-commands/harness/capture-evidence.sh:147` | impl-p0 | Command execution, evidence capture |
| `_sandbox/23--doctor-commands/harness/assert-signals.sh:150` | impl | Grep-based signal assertions |
| `_sandbox/23--doctor-commands/scenarios/DOC-323-*.sh:31` | impl-sample | Representative scenario wrapper |
| `_sandbox/23--doctor-commands/scenarios/DOC-327-*.sh:31` | impl-sample | Disk-pressure scenario (destructive check) |
| `_sandbox/23--doctor-commands/scenarios/DOC-342-*.sh:31` | impl-sample | Dashboard scenario wrapper |
| `_sandbox/23--doctor-commands/scenarios/DOC-345-*.sh:33` | impl-sample | Version migration scenario wrapper |
| `mcp_server/database/.spec-kit-memory-launcher.json:10` | state | Launcher state, no credentials |
| `002-sandbox-testing-playbook/plan.md:380` | reference | Dispatch design, harness language |
| `002-sandbox-testing-playbook/resource-map.md` | reference | Asset ledger |
| `002-sandbox-testing-playbook/handover.md` | reference | Continuity handoff |
| `002-sandbox-testing-playbook/tasks.md` | reference | Task register |

## Findings by Severity

### P0

No P0 findings. No directly exploitable sandbox escape vectors (no `--privileged`, no `--net=host`, no host-level credential exposure, no shell injection with untrusted input). The non-root user guard and SPECKIT_SANDBOX safety flag provide meaningful defense-in-depth.

### P1

#### R5-P1-001 [P1] Broad read-write repo root mount in docker-compose

- **File**: `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml:8`
- **Evidence**: The volume mount `../../../../../..:/workspace` maps the entire repository root into the container as `/workspace` with default read-write permissions. This includes `.git/`, `.opencode/`, all spec data, and all skill implementation files. While the Dockerfile (line 20) switches to non-root `testuser` and `reset-state.sh:40` guards fixture restoration with a `SPECKIT_SANDBOX=1` check, there is no Docker-level read-only constraint. A buggy or compromised doctor command executing inside the container can write to any file in the mounted repo, including git metadata and configuration.
- **Finding class**: instance-only
- **Scope proof**: `rg "volumes:" -A 5 _sandbox/23--doctor-commands/docker-compose.yml` confirms a single service definition with one broad root mount. No other compose files exist in the sandbox.
- **Affected surface hints**: ["docker-compose.yml", "volume mount", "sandbox isolation"]
- **Recommendation**: Either add `:ro` to the root volume mount (`../../../../../..:/workspace:ro`) with separate targeted read-write mounts for evidence output and fixture state, or drop to `:ro` and rely on the `./evidence:/workspace/evidence` bind mount for writable evidence output. Alternatively, document the intentional full read-write design and add a prominent warning that this sandbox is for disposable/CI workspaces only, not production environments.

#### R5-P1-002 [P1] No Linux capability drops on sandbox container

- **File**: `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml:3-15`
- **Evidence**: The `doctor-sandbox` service definition does not include `cap_drop` to restrict Linux capabilities. While the container runs as non-root `testuser` (Dockerfile:20), Docker's default capabilities (e.g., NET_RAW, CHOWN, SETUID, SETGID, SYS_PTRACE) remain available to the containerized process. None of the sandbox operations (shell scripts, git, curl, jq, sqlite3, tar archive extraction) require elevated capabilities. The security checklist at `002-sandbox-testing-playbook/checklist.md:96` (CHK-SEC-002) only verifies non-root user execution but does not mention capability dropping.
- **Finding class**: instance-only
- **Scope proof**: `rg "cap_|capability" _sandbox/23--doctor-commands/` returns zero matches. Only the non-root user guard is in place.
- **Affected surface hints**: ["docker-compose.yml", "Dockerfile", "container security"]
- **Recommendation**: Add `cap_drop: ["ALL"]` to the service definition in `docker-compose.yml` and explicitly add back only capabilities required (none appear necessary for the current toolset).

#### R5-P1-003 [P1] Unvalidated SPECKIT_DOCTOR_RUNNER env var execution

- **File**: `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml:14` → `harness/capture-evidence.sh:83`
- **Evidence**: `docker-compose.yml:14` passes `SPECKIT_DOCTOR_RUNNER=${SPECKIT_DOCTOR_RUNNER:-}` through from the host environment. In `capture-evidence.sh:83`, this variable is executed as a command: `"$SPECKIT_DOCTOR_RUNNER" "$command_text"`. There is no validation that the value resolves to an expected binary (opencode, codex) and no path restriction. An attacker with host env control could point it to an arbitrary binary inside the container.
- **Finding class**: instance-only
- **Scope proof**: `rg "SPECKIT_DOCTOR_RUNNER" _sandbox/23--doctor-commands/` returns docker-compose.yml line 14 and capture-evidence.sh lines 82-83. No other references exist.
- **Affected surface hints**: ["docker-compose.yml", "capture-evidence.sh", "env injection"]
- **Recommendation**: Validate `SPECKIT_DOCTOR_RUNNER` against a known allowlist (e.g., `opencode`, `codex`) before execution. If unset or unknown, fall back to the built-in discovery chain (opencode → codex → skip) rather than blindly executing the value. Document the injection risk in the sandbox README.

### P2

#### R5-P2-001 [P2] Full Debian base image instead of slim variant

- **File**: `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/Dockerfile:1`
- **Evidence**: `FROM node:20-bookworm` pulls the full Debian image (~380MB) while `node:20-bookworm-slim` (~140MB) provides the same packages and reduces installed binaries by ~60%. The installed tools (python3.11, sqlite3, jq, git, curl, ca-certificates, bash) are all available in slim via `apt-get`. Reduced image size means reduced attack surface.
- **Finding class**: instance-only
- **Scope proof**: Single Dockerfile in the sandbox. The NFR section at `002-sandbox-testing-playbook/spec.md:228-244` does not mention image slimming.
- **Recommendation**: Switch `FROM node:20-bookworm` → `FROM node:20-bookworm-slim` and verify all packages still install correctly.

#### R5-P2-002 [P2] Sandbox guard bypass returns success instead of SKIP

- **File**: `.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/reset-state.sh:43-44, 54`
- **Evidence**: When `require_sandbox_reset()` fails (neither `SPECKIT_SANDBOX=1` nor `SPECKIT_ALLOW_HOST_RESET=1`), it returns exit code 1 at line 44. However, `reset_state()` at line 53-54 catches this and returns 0 (success), allowing the scenario to continue against un-restored workspace state. This can produce misleading PASS results — a scenario that should require a specific fixture state runs against arbitrary host workspace state instead.
- **Finding class**: instance-only
- **Scope proof**: `rg "require_sandbox_reset\|SPECKIT_ALLOW_HOST_RESET\|SPECKIT_SANDBOX" _sandbox/23--doctor-commands/harness/reset-state.sh` confirms the single guard path.
- **Recommendation**: When the sandbox guard blocks fixture restoration, `reset_state()` should set a flag (or return non-zero) that causes the scenario to be classified as SKIP rather than proceeding without fixture restoration. Alternatively, have `require_sandbox_reset` return a special exit code (e.g., 77 for SKIP) that propagates up through `run_scenario()`.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | partial | REQ-007 (Dockerfile parseable), REQ-008 (compose valid YAML) satisfied; NFR-RP-001 (reproducibility) satisfied via SHA-256; CHK-SEC-001 (SHA-256 verify) implemented in fetch-fixtures.sh:110-114; CHK-SEC-002 (non-root user) implemented in Dockerfile:15-20; CHK-SEC-003 (no writes outside sandbox) partially verified — broad mount makes this hard to guarantee |
| checklist_evidence | partial | Security checklist items (CHK-SEC-001..003 at checklist.md:96-98) map to implementation: SHA-256 verify (✓), non-root user (✓), no external writes (⚠️ — broad mount undermines this) |
| skill_agent | not-yet | No @doctor agent definition found that could be security-scanned |
| agent_cross_runtime | not-yet | Security dimension does not require cross-runtime mirror check (deferred to maintainability iteration) |
| feature_catalog_code | partial | resource-map.md references exist; no security-specific entries found |
| playbook_capability | partial | All 23 scenario wrappers follow the same hardened pattern (fixed command strings, no user-input injection); DOC-326 (SIGINT) and DOC-340 (SIGINT) marked UNAUTOMATABLE in spec (edge-cases.md:261-263) — no injection risk from signal handling |

## Verdict

**CONDITIONAL** — 0 P0, 3 P1, 2 P2. The sandbox has meaningful security controls (non-root user, SHA-256 fixture verification, SPECKIT_SANDBOX guard) but the broad read-write repo root mount (R5-P1-001) and missing capability drops (R5-P1-002) weaken the isolation boundary. These are remediable with targeted volume mount scoping and capability restrictions — neither requires architectural rework. The SPECKIT_DOCTOR_RUNNER env injection (R5-P1-003) is a lower-probability host-environment attack surface but should be validated.

## Next Dimension

Continue with **security — doctor command surface deep-scan** on the `001-initial-doctor-commands` YAML assets (`assets/doctor_*.yaml`). The 21 YAML mode assets define `forbidden_targets` globs, field handling policies, and upstream asset declarations. Audit for:
- Path traversal risks in `target_paths` and `forbidden_targets` glob patterns
- Arbitrary code execution via YAML field expansion or template injection
- Missing input validation on mode-specific parameters
- Cross-reference with the migration manifest (`migration-manifest.json`) for SQL injection or schema poisoning risks

This was the second half of the security dimension planned in the strategy (strategy.md:32-33: "Doctor commands touch installation/update flow + Docker sandbox; check for arbitrary command exec, path traversal, privilege escalation, secrets in test fixtures") — the Docker sandbox half is now covered.
