Tools used in phase 004 (usage contract read before invocation):
- .opencode/bin/compiled-route-manifest.cjs  refresh | freshness --hub <hub> --skill-root .opencode/skills/<hub>
- .opencode/bin/compiled-route-sync.cjs      --check (read-only trace) | default promotion | --verify | --revert <rollback> | --finalize <rollback>
- .opencode/bin/compiled-route-status.cjs    --all [--pretty]
- specs/.../009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs  (owner rebuild)
- specs/.../009-parent-hub-rollout/<entry>/harness/validate-canary.cjs  (owner canary)
- .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict
No activate-hub and no mcp-tooling direct-mirror exception invocation.
