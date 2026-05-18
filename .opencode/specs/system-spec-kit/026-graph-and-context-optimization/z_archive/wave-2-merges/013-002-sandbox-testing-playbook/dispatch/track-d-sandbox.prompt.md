# Codex dispatch: Track D — Sandbox harness for 25 doctor command scenarios

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author the Docker sandbox harness for the 25 manual testing playbook scenarios authored in Phase B (DOC-323..DOC-347). Single dispatch, full file set in scope (33 files): Dockerfile + docker-compose.yml + fixture-fetch + manifest + 4 harness scripts + 25 per-scenario shell wrappers.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

## CANONICAL TEMPLATE SOURCES (read first; treat as locked)

1. **`.opencode/specs/z_future/agentic-system-upgrade/001-research-agentic-systems/002-babysitter-main/external/Dockerfile`** — Dockerfile fork starting point (Node 20-bookworm + non-root user + workspace mount).
2. **`.opencode/skills/system-spec-kit/scripts/tests/test-validation.sh`** — bash 3.2 harness conventions (`set -euo pipefail`, color guards `[[ -t 1 ]]`, function-based modular structure).
3. **`.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`** — root playbook execution policy (PASS/FAIL/SKIP/UNAUTOMATABLE classification, real-execution rule).
4. **All 25 scenario `.md` files** at `.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[3-9],3[0-6],3[7-9],4[0-7]}-*.md` — the per-scenario contracts to wrap.

## RUNTIME UNDER TEST

- 5 `/doctor:*` commands: `.opencode/commands/doctor/{memory,causal-graph,deep-loop,cocoindex,update}.md`
- 21 mode YAMLs: `.opencode/commands/doctor/assets/doctor_*_*.yaml` (already polished with upstream_assets, _invariant, field_handling, inline comments)
- Migration manifest: `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json`

## IN_SCOPE_FILES (33 files)

All under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/`:

### Container infrastructure (2)
- `Dockerfile`
- `docker-compose.yml`

### Fixture infrastructure (3)
- `fixtures/fetch-fixtures.sh`
- `fixtures/manifest.json`
- `fixtures/.gitkeep`

### Harness scripts (4)
- `harness/run-all.sh`
- `harness/reset-state.sh`
- `harness/capture-evidence.sh`
- `harness/assert-signals.sh`

### Per-scenario shell wrappers (25)
- `scenarios/DOC-323-doctor-memory-fresh-install.sh`
- `scenarios/DOC-324-doctor-memory-drift-detection.sh`
- `scenarios/DOC-325-doctor-memory-long-pole-rebuild.sh`
- `scenarios/DOC-326-doctor-memory-sigint-cancellation.sh`
- `scenarios/DOC-327-doctor-memory-disk-pressure.sh`
- `scenarios/DOC-328-doctor-causal-graph-low-coverage.sh`
- `scenarios/DOC-329-doctor-causal-graph-confidence-threshold.sh`
- `scenarios/DOC-330-doctor-causal-graph-add-only.sh`
- `scenarios/DOC-331-doctor-deep-loop-lazy-init.sh`
- `scenarios/DOC-332-doctor-deep-loop-empty-no-source.sh`
- `scenarios/DOC-333-doctor-deep-loop-convergence.sh`
- `scenarios/DOC-334-doctor-cocoindex-daemon-healthy.sh`
- `scenarios/DOC-335-doctor-cocoindex-daemon-zombie.sh`
- `scenarios/DOC-336-doctor-cocoindex-daemon-unreachable.sh`
- `scenarios/DOC-337-doctor-update-G4-auto-fresh.sh`
- `scenarios/DOC-338-doctor-update-G5-confirm-failure-injection.sh`
- `scenarios/DOC-339-doctor-update-G6-concurrent.sh`
- `scenarios/DOC-340-doctor-update-G7-sigint.sh`
- `scenarios/DOC-341-doctor-update-G8-migration-gap.sh`
- `scenarios/DOC-342-doctor-update-G9-dashboard.sh`
- `scenarios/DOC-343-doctor-update-apply-full-chain.sh`
- `scenarios/DOC-344-doctor-update-tier-aware-default.sh`
- `scenarios/DOC-345-version-migration-3.3.0.0-to-3.4.1.0.sh`
- `scenarios/DOC-346-version-migration-cleanup-legacy.sh`
- `scenarios/DOC-347-version-migration-no-op.sh`

If `_sandbox/23--doctor-commands/` (and subdirs `fixtures/`, `harness/`, `scenarios/`) do not exist, create them.

## OUT_OF_SCOPE (forbidden)

- DO NOT modify any /doctor:* command Markdown or YAML asset
- DO NOT modify any spec packet docs
- DO NOT modify any scenario .md file in `23--doctor-commands/` (Phase B output)
- DO NOT modify root `manual_testing_playbook.md` (Phase C handles)
- DO NOT touch other category folders (01-22)

## HARD CONSTRAINTS

1. **Dockerfile parseable + uses Node 20-bookworm + python3.11 + sqlite3 + jq + git + curl + non-root `testuser:testuser`.**
2. **docker-compose.yml is valid YAML** (`python3 -c "import yaml; yaml.safe_load(open('docker-compose.yml'))"` exit 0).
3. **fixtures/manifest.json is valid JSON** with required per-fixture fields: `url`, `sha256`, `size`, `version`, `description`. Declare 4 fixtures (v3.3.0.0, v3.4.0.0, empty, partial).
4. **All scripts pass `bash -n`** syntax check (no execution; just parse).
5. **All scripts use bash 3.2 compatible syntax** — `set -euo pipefail`, color guards `[[ -t 1 ]]`, function-based, NO bash 4+ features (no associative arrays, no `mapfile`).
6. **`harness/run-all.sh --dry-run` exits 0** without invoking docker (just script linting + path resolution).
7. **`harness/run-all.sh` emits a Markdown rollup at the end** with per-scenario PASS/FAIL/SKIP/UNAUTOMATABLE classification.
8. **`harness/capture-evidence.sh` snapshots stdout, exit code, file deltas, snapshot files** into `evidence/<scenario>/`.
9. **`harness/assert-signals.sh` is grep-based** and consumes the matching scenario .md "Expected" / "Pass / Fail" sections.
10. **`fixtures/fetch-fixtures.sh` is idempotent** — skips already-fetched + checksum-matched files.
11. **Per-scenario `.sh` wrappers map 1:1 to matching .md scenarios** in `23--doctor-commands/`. Each wrapper invokes the canonical `/doctor:*` command exactly as documented in 001's Markdown entrypoint (no parallel reimplementation).
12. **Each per-scenario wrapper sources** `harness/reset-state.sh` and `harness/capture-evidence.sh` and `harness/assert-signals.sh` to keep behavior consistent.

## DESIGN GUIDANCE

### Dockerfile (fork from Babysitter)

```dockerfile
FROM node:20-bookworm
RUN apt-get update && apt-get install -y python3.11 sqlite3 jq git curl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN useradd -m -s /bin/bash -u 1001 testuser && mkdir -p /workspace && chown -R testuser:testuser /workspace
USER testuser
WORKDIR /workspace
ENV PATH="/home/testuser/.local/bin:$PATH"
# Volume mount expected: -v $REPO_ROOT:/workspace
ENTRYPOINT ["bash", "/workspace/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  doctor-sandbox:
    build:
      context: ../../../../../..  # resolve to repo root
      dockerfile: .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/Dockerfile
    volumes:
      - ../../../../../..:/workspace
      - ./evidence:/workspace/evidence
    environment:
      - SPECKIT_SANDBOX=1
      - SPECKIT_FAIL_STEP=${SPECKIT_FAIL_STEP:-}  # for failure-injection scenarios (DOC-338)
    working_dir: /workspace
```

### fixtures/manifest.json

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "doctor-commands-sandbox-fixtures",
  "version": "1.0.0",
  "fixtures": {
    "v3.3.0.0-state": {
      "url": "https://github.com/<owner>/<repo>/releases/download/v3.3.0.0-fixtures/v3.3.0.0-state.tar.gz",
      "sha256": "PLACEHOLDER_SHA256_v3.3.0.0",
      "size": 0,
      "version": "3.3.0.0",
      "description": "Pre-populated databases at v3.3.0.0 schema (legacy memory/*.md, no graph-metadata.json)"
    },
    "v3.4.0.0-state": { ... similar ... },
    "empty-state": { ... empty baseline; no databases ... },
    "partial-state": { ... mid-rebuild crash state for recovery tests ... }
  },
  "metadata": {
    "consumed_by": "fetch-fixtures.sh",
    "authored_by": "packet 026/013/002 sandbox-testing-playbook",
    "placeholder_urls": true,
    "placeholder_note": "Real URLs to be populated when fixture publishing pipeline lands (out of scope for this packet)"
  }
}
```

### fixtures/fetch-fixtures.sh (idempotent)

```bash
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANIFEST="${SCRIPT_DIR}/manifest.json"
STATES_DIR="${SCRIPT_DIR}/states"
mkdir -p "$STATES_DIR"
# For each fixture in manifest, check if already-fetched + checksum-matched, skip if yes
# Else download + verify SHA-256
# Print summary at end
# Exit 0 if all OK, 1 if any fixture failed verification
```

### harness/run-all.sh

```bash
#!/usr/bin/env bash
set -euo pipefail
# --dry-run flag supported: parse scenarios/, validate paths, exit without docker
# Iterate scenarios/DOC-*.sh in numeric order
# Source reset-state.sh + capture-evidence.sh + assert-signals.sh once
# Per scenario: reset → invoke wrapper → capture → assert → record verdict
# Final: emit Markdown rollup with per-scenario PASS/FAIL/SKIP/UNAUTOMATABLE
```

### Per-scenario wrapper template

```bash
#!/usr/bin/env bash
set -euo pipefail
SCENARIO_ID="DOC-NNN"
SCENARIO_MD="../23--doctor-commands/NNN-feature-id-slug.md"
# Source harness lib
source "$(dirname "${BASH_SOURCE[0]}")/../harness/reset-state.sh"
source "$(dirname "${BASH_SOURCE[0]}")/../harness/capture-evidence.sh"
source "$(dirname "${BASH_SOURCE[0]}")/../harness/assert-signals.sh"
# Restore fixture state per scenario preconditions
reset_state "<fixture-name>"
# Invoke canonical /doctor:* command (cite the matching Markdown entrypoint)
capture_evidence "$SCENARIO_ID" /doctor:<command> :<mode> [<flags>]
# Assert expected signals from scenario .md
assert_signals "$SCENARIO_ID" "$SCENARIO_MD"
```

## VERIFICATION (run after authoring; paste output)

```bash
SANDBOX=.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands

echo "=== File counts ==="
echo "  Dockerfile + docker-compose.yml: $(ls $SANDBOX/Dockerfile $SANDBOX/docker-compose.yml 2>/dev/null | wc -l | tr -d ' ') / 2"
echo "  fixtures: $(ls $SANDBOX/fixtures/* 2>/dev/null | wc -l | tr -d ' ') / 3 (manifest.json, fetch-fixtures.sh, .gitkeep)"
echo "  harness: $(ls $SANDBOX/harness/*.sh 2>/dev/null | wc -l | tr -d ' ') / 4"
echo "  scenarios: $(ls $SANDBOX/scenarios/*.sh 2>/dev/null | wc -l | tr -d ' ') / 25"

echo ""
echo "=== bash -n on all .sh files ==="
PASS=0; FAIL=0
for s in $SANDBOX/**/*.sh $SANDBOX/*.sh; do
  [ -f "$s" ] || continue
  bash -n "$s" 2>&1 > /dev/null && PASS=$((PASS+1)) || { FAIL=$((FAIL+1)); echo "  FAIL: $s"; }
done
echo "  Pass: $PASS / Fail: $FAIL"

echo ""
echo "=== docker-compose.yml + manifest.json syntax ==="
python3 -c "import yaml; yaml.safe_load(open('$SANDBOX/docker-compose.yml'))" 2>&1 && echo "  docker-compose.yml: VALID" || echo "  docker-compose.yml: INVALID"
python3 -m json.tool < "$SANDBOX/fixtures/manifest.json" > /dev/null 2>&1 && echo "  manifest.json: VALID" || echo "  manifest.json: INVALID"

echo ""
echo "=== harness/run-all.sh --dry-run ==="
bash "$SANDBOX/harness/run-all.sh" --dry-run 2>&1 | head -20
echo "  exit code: $?"

echo ""
echo "=== Per-scenario wrapper count by ID range ==="
for range in '32[3-7]' '32[8-9],330' '33[1-6]' '3{3[7-9],4[0-7]}'; do
  echo "  IDs $range: $(ls $SANDBOX/scenarios/DOC-${range}-*.sh 2>/dev/null | wc -l | tr -d ' ')"
done
```

## OUTPUT REQUIREMENT

1. Files created with one-line rationale each (33 total).
2. Verification block output pasted.
3. Constraint compliance yes/no per Hard Constraint 1-12.
4. Halt-and-report on any constraint violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~12 lines): file count summary (Dockerfile, compose, fixtures, harness, scenarios), bash -n pass/fail count, docker-compose + manifest syntax status, dry-run exit, deviations, recommended next track (Phase C root playbook update, then Phase E verification).
