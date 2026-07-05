Deep-review command-flow stress-test executor (CP-052..057). Repo root (cwd): /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. You have --sandbox workspace-write.

HARD GUARDRAIL: WRITE ONLY under /tmp/cp-* sandbox directories. NEVER modify any file under the repo (.opencode/, etc.). The setup script `setup-cp-sandbox.sh` rm -rf's and rebuilds only its own /tmp dir. Read repo files freely; write only to /tmp.

Scenarios (read each in full) under .opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/:
  setup-yaml-handoff.md            (CP-052)
  three-artifact-iteration-contract.md (CP-053)
  resource-map-coverage-gate.md    (CP-054)
  synthesis-save-boundary.md       (CP-055)
  leaf-only-nested-dispatch-refusal.md (CP-056)
  write-boundary-reducer-owned-files.md (CP-057)

Each scenario's "## 3. TEST EXECUTION" has a Recommended Orchestration Process + an exact runnable command sequence (which builds/uses a /tmp sandbox via `setup-cp-sandbox.sh [--sandbox-dir /tmp/cp-...]`, then field-counts / inspects the command-flow contract). The setup script's stale path was just fixed (commands/speckit) so it builds cleanly. A shared sandbox already exists at /tmp/cp-deep-review-sandbox; scenarios may build their own isolated /tmp dirs as documented.

Task — for each CP-052..057: (1) read the scenario; (2) run its documented command sequence (build the /tmp sandbox if the scenario directs, then run its checks); (3) compare observed output to Expected + Pass/Fail; (4) verdict PASS/PARTIAL/FAIL/SKIP with the decisive command + evidence. Clean up /tmp/cp-* dirs you create when done.

Use sequential reasoning internally. Return ONLY:

### BATCH VERDICTS: deep-review/07-cp-stress
| Scenario ID | Verdict | Decisive command | Evidence excerpt (<=8 lines) | Anchor file:line | Notes |
|---|---|---|---|---|---|
(one row each CP-052..057)

### BATCH SUMMARY: <p> PASS / <pa> PARTIAL / <f> FAIL / <s> SKIP
