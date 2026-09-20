---
title: "Tasks: Phase 5: playbook-reverification-and-closeout"
description: "Task ledger for the playbook re-run, the documentation reconciliation, the derived-surface regeneration and the program closeout."
trigger_phrases:
  - "phase tasks"
  - "task ledger"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/005-playbook-reverification-and-closeout"
    last_updated_at: "2026-09-20T16:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Task ledger authored at closeout, every entry worked"
    next_safe_action: "Operator decision: commit the working tree, or leave it uncommitted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-005-playbook-reverification-and-closeout"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: playbook-reverification-and-closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Symbol | Meaning |
|--------|---------|
| `[P]` | Parallelizable task |
| `- [ ]` | Pending |
| `- [x]` | Complete |
| `T###` | Task identifier |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Execute the transport corpus

- [x] T001 Capture the pre-run state: `jev --version` and the routing-input hashes, so the run can be tied to a byte-identical hub (`.skilled/skills/cli-jev/`)
- [x] T002 Prove the no-key recipe before the run: the isolated store reports `not stored` while the real store reports `stored`, which is why the unauth half needs `XDG_CONFIG_HOME` (control probe)
- [x] T003 Author the no-key runner from the recorded matrix, adding the store isolation and pointing the absent-file probes at the scratch path (`probe-matrix.sh`)
- [x] T004 Run the 20-scenario matrix and the four credential probes, capturing command, exit status, stdout and stderr per label (`probe-matrix.txt`)
- [x] T005 Author and run the surface pass: subcommand help, three `run` payloads and the `jev-mcp` handshake with its tool list (`probe-surface.sh`, `probe-surface.txt`)
- [x] T006 Compare both captures against the recorded baseline field by field, normalizing only the scratch path (`compare.py`, `compare-surface.py` → 21 labels and 11 sections, 0 differences)
- [x] T007 Run the credential-gated half plainly against the stored `official` key and capture it (`auth-probe.sh`, `auth-probe.txt`)
- [x] T008 Run the value-blind leak check over every capture and confirm the sentinel check inside the matrix (`leak-check.py` → 0 store tokens in any stream)
- [x] T009 Run the dispatch-rule suite on the live file and capture its summary and exit status (`rule-checks.txt` → 20 tests, 20 pass, exit 0)
- [x] T010 Run the audit suite on the live file with quarantine and worktree copies excluded, and record why the naive invocation reports their failures (`dispatch-audit-live.txt` → 1 file, 75 pass)

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Execute the hub corpus and re-probe the gates

- [x] T011 Run the four hub prompts against the compiled front door and capture the route JSON per prompt (`hub-routing.txt`)
- [x] T012 Run the kill-switch control and one end-to-end judgment through the resolved packet (`hub-routing.txt` → sentinel under the flag, `0.86` through the route)
- [x] T013 Probe the dispatch preflight with one violating and one clean command per rule family, capturing each decision (`preflight-probe.txt`)
- [x] T014 Probe the boundaries the first pass raised, including quoted state, `-s -` with and without a close, and the advisory rules, plus the controls (`preflight-probe2.txt`)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Record, reconcile, regenerate, close

- [x] T015 Author the transport report: run identity, the 22-row verdict table, the gate decisions, the raw-evidence index, the delta against baseline and the findings (`skill-benchmark-report.md`)
- [x] T016 Author the hub report: the corpus verdict table, the kill-switch control and the end-to-end row (`benchmark/reports/2026-09-20-hub-routing-baseline/`)
- [x] T017 Collect both runs' raw captures and scripts into their report folders (`raw/` in each report)
- [x] T018 Reconcile the transport playbook root: the stdin-close rule, the run-list wording and the run record with its report link
- [x] T019 Reconcile the hub playbook root: replace `not run` with the run row and its report link
- [x] T020 Fix the refused command in the credential-redaction scenario, in both the command block and the contract table
- [x] T021 Reword the one overclaim — a success criterion that read as an execution claim while the run record said otherwise
- [x] T022 Add the run-index row to the transport reports index
- [x] T023 Verify the doc edits moved no derived artifact: leaf-manifest hash before and after, playbook and catalog validators, doctor, freshness, admission
- [x] T024 Converge the frontmatter versions through the owning engine, twice per its standard, then rewrite the repository manifest and verify (40 ok, 1 no-frontmatter)
- [x] T025 Regenerate the trigger index and confirm the hub's docs surface at the new path
- [x] T026 Run the frozen readme/directory manifest test and the track-root sweep
- [x] T027 Re-run the front-door probes on both hubs, including the old hub's non-regression prompt
- [x] T028 Scan the live tree for the retired packet path and classify every remaining hit as recorded evidence (scoped away from other sessions' quarantine and worktrees)
- [x] T029 Author the phase documents and the child description, then update the parent spec and goal
- [x] T030 Re-derive the folder metadata and validate both packets recursively with `--strict`

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] No blocked or deferred tasks
- [x] Every verdict in the reports cites a capture beside it
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- [Specification](./spec.md)
- [Plan](./plan.md)
- [Implementation Summary](./implementation-summary.md)
<!-- /ANCHOR:cross-refs -->
