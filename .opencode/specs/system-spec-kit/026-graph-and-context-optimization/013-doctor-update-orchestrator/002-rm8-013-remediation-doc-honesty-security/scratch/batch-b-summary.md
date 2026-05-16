# Batch B Summary - Security Hardening

Spec folder:
`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-rm8-013-remediation-doc-honesty-security/`

Scope:
- Cluster G: `R4-P1-002`, `R4-P1-004`
- Cluster H: `R5-P1-001`, `R5-P1-002`

## Changes

- Removed `--no-audit` from both `npm ci` / `npm install` paths in `doctor-runtime-bootstrap.sh`.
- Added a soft `npm audit --audit-level=high` warning step after dependency installation.
- Replaced the mkdir lock directory with an FD-held `flock -n` lock file at `/tmp/doctor-runtime-bootstrap.lock`.
- Removed the mkdir-lock cleanup path while preserving existing temporary actions-file cleanup.
- Narrowed the doctor sandbox compose mount to repo read-only plus evidence read-write.
- Added `cap_drop: [ALL]`, minimal `cap_add`, and `no-new-privileges:true`.
- Did not modify the Dockerfile; no cap coordination was needed.

## Requested Verification

```text
$ grep -nE 'no-audit' .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
exit 1, 0 hits as expected

$ grep -nE 'flock' .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
129:if ! flock -n 9; then

$ grep -nE 'cap_drop|cap_add' .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml
12:    cap_drop:
14:    cap_add:

$ grep -nE 'rw|ro' .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml
9:      - ../../../../../..:/workspace:ro
11:      - ./evidence:/workspace/evidence:rw
12:    cap_drop:
21:    environment:

$ bash -n .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
exit 0
```

## Additional Verification

```text
$ python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/commands/doctor/scripts
[alignment-drift] PASS
Scanned files: 4
Findings: 1
Errors: 0
Warnings: 1

Actionable findings:
- .opencode/commands/doctor/scripts/mcp-doctor-lib.sh:1 [SH-STRICT-MODE] [WARN] Missing `set -euo pipefail` strict mode declaration. Fix: Add `set -euo pipefail` near the top of the script.

Note: warnings are non-blocking by default. Use --fail-on-warn to make warnings fail.
```

```text
$ bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-doctor-update-orchestrator/002-rm8-013-remediation-doc-honesty-security --strict
RESULT: FAILED

Errors:
- TEMPLATE_HEADERS: 14 template headers issue(s)
- ANCHORS_VALID: 21 template anchors issue(s)
- FRONTMATTER_MEMORY_BLOCK: 5 frontmatter_memory_block issue(s)

Warnings:
- PRIORITY_TAGS: 61 checklist item(s) have non-standard priority tags

These validation failures are in spec documentation outside the allowed write paths for this batch.
```

## Diff

```diff
diff --git a/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh b/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
index 8a674b3089..43651eb6ba 100755
--- a/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
+++ b/.opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh
@@ -47,7 +47,7 @@ LEGACY_SKILL_DIR="$OPENCODE_DIR/skill"
 KIT_DIR="$SKILLS_DIR/system-spec-kit"
 DB_DIR="$KIT_DIR/mcp_server/database"
 STATE_FILE="$DB_DIR/.doctor-update.bootstrap.json"
-LOCK_DIR="$DB_DIR/.doctor-update.bootstrap.lockdir"
+LOCK_FILE="/tmp/doctor-runtime-bootstrap.lock"
 MCP_DIST="$KIT_DIR/mcp_server/dist/context-server.js"
 GRAPH_BACKFILL_DIST="$KIT_DIR/scripts/dist/graph/backfill-graph-metadata.js"
 DESCRIPTION_DIST="$KIT_DIR/scripts/dist/spec-folder/generate-description.js"
@@ -97,7 +97,6 @@ NODE
 
 cleanup() {
   rm -f "$actions_file"
-  rm -rf "$LOCK_DIR"
 }
 trap cleanup EXIT
 
@@ -126,8 +125,10 @@ if [[ ! -d "$OPENCODE_DIR" ]]; then
 fi
 
 mkdir -p "$DB_DIR"
-if ! mkdir "$LOCK_DIR" 2>/dev/null; then
-  fail "bootstrap lock already exists at $LOCK_DIR"
+exec 9>"$LOCK_FILE"
+if ! flock -n 9; then
+  printf '[doctor-bootstrap] Another bootstrap is in progress (lock %s held). Exiting.\n' "$LOCK_FILE" >&2
+  exit 0
 fi
 
 if [[ ! -d "$SKILLS_DIR" && -d "$LEGACY_SKILL_DIR" && ! -L "$LEGACY_SKILL_DIR" ]]; then
@@ -180,10 +181,13 @@ if [[ "$need_build" == true ]]; then
     (
       cd "$KIT_DIR"
       if [[ -f package-lock.json ]]; then
-        npm ci --no-audit --no-fund --silent
+        npm ci --no-fund --silent
       else
-        npm install --no-audit --no-fund --silent
+        npm install --no-fund --silent
       fi
+      npm audit --audit-level=high || {
+        printf '[doctor-bootstrap] WARNING: npm audit found high-severity issues. Continuing bootstrap; investigate at next opportunity.\n' >&2
+      }
       npm run build --workspace=@spec-kit/mcp-server
       npm run build --workspace=@spec-kit/scripts
     ) >&2
@@ -191,10 +195,13 @@ if [[ "$need_build" == true ]]; then
     (
       cd "$KIT_DIR"
       if [[ -f package-lock.json ]]; then
-        npm ci --no-audit --no-fund --silent
+        npm ci --no-fund --silent
       else
-        npm install --no-audit --no-fund --silent
+        npm install --no-fund --silent
       fi
+      npm audit --audit-level=high || {
+        printf '[doctor-bootstrap] WARNING: npm audit found high-severity issues. Continuing bootstrap; investigate at next opportunity.\n' >&2
+      }
       npm run build --workspace=@spec-kit/mcp-server
       npm run build --workspace=@spec-kit/scripts
     )
diff --git a/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml b/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml
index ec4d2672e6..fc495ca30f 100644
--- a/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml
+++ b/.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/docker-compose.yml
@@ -5,8 +5,19 @@ services:
       context: ../../../../../..
       dockerfile: .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/Dockerfile
     volumes:
-      - ../../../../../..:/workspace
-      - ./evidence:/workspace/evidence
+      # Source paths mounted READ-ONLY
+      - ../../../../../..:/workspace:ro
+      # Only evidence dir is read-write
+      - ./evidence:/workspace/evidence:rw
+    cap_drop:
+      - ALL
+    cap_add:
+      - CHOWN
+      - SETUID
+      - SETGID
+      - DAC_OVERRIDE
+    security_opt:
+      - no-new-privileges:true
     environment:
       - SPECKIT_SANDBOX=1
       - SPECKIT_EVIDENCE_ROOT=/workspace/evidence
```
