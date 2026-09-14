---
title: "Implementation Summary"
description: "The Hermes contract is pinned live: the sanctioned smoke, --query-file round trip, --yolo write, off-roster exit 1 and run-budget expiry all observed through the operator-authorized LLM Gateway provider; the whole-tree skills symlink was rejected on scan evidence, and the --yolo claim was corrected on evidence: ordinary writes run without the flag, only flagged actions are blocked."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin"
    last_updated_at: "2026-09-14T21:45:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Live contract pinned under the authorized provider; findings recorded"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - "goal.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-002-hermes-contract-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Pre-flight errors and gateway errors print to stdout, not stderr"
      - "--run-budget does not bound a stalled provider stream; the caller's timeout does"
      - "A headless run without --yolo writes ordinary files; only tool calls Hermes flags as dangerous are blocked"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-hermes-contract-pin |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet's Hermes claims moved from source-read to observed. Every later phase now builds on exit codes, output channels and a skills-tree verdict that were seen, not inferred.

### Phase 2: contract pin

You get a row per claim in `goal.md` with the exact command, the observed stdout and stderr, the exit status and the elapsed time. The operator authorized four user-level steps in chat (provider block with `key_env` only, `hermes skills trust`, the project-plugin opt-in, `hermes mcp add`), each performed under a named backup and rollback. The pin found four things the research had wrong or missing: gateway errors land on stdout, `--run-budget` cannot bound a silent stream, a whole-tree skills symlink makes every session scan and quarantine the entire `.opencode/skills` tree, and `--yolo` gates only the actions Hermes flags as dangerous while ordinary writes run without it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `goal.md` | Modified | Claim rows, findings, criteria |
| `acceptance-criteria.md` | Modified | Six rows with evidence |
| `~/.hermes/config.yaml` (operator home, authorized) | Modified | provider block, trust grant, `plugins.enabled`, MCP server; backup `config.yaml.bak-20260914-hermes-071` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each claim ran as one `hermes chat` with stdin closed and stdout, stderr and exit code captured separately. The write cases used a scratch file under `/tmp`; the stalled no-yolo run was killed after Hermes's own 600-second stale-stream watchdog had fired and retried.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Key stays in the shell environment | `key_env` is the only field written; no secret lands in `~/.hermes` or the repo |
| Curated per-skill symlinks replace the whole-tree link | The scanner walked the tree for over ten minutes per session and quarantined every hub |
| The `--yolo` claim was corrected rather than kept | Two negative controls showed ordinary writes succeed without the flag and only flagged actions are blocked; the hard rule now states the observed gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Smoke (`-t search,todo`, `--max-turns 1`) | exit 0, `OK`, `session_id:` on stderr, 19 s |
| `--query-file` with quotes, `$(...)`, backticks | verbatim, exit 0 |
| `--yolo` write to a scratch file | file written, exit 0, 116 s |
| Same write without `--yolo` | first attempt stalled on a silent stream (killed at 1214 s); rerun on `glm-5.3-flash`: file written, `DONE`, exit 0, 23 s |
| `rm -rf <scratch dir>` without and with `--yolo` | without: `REFUSED`, `BLOCKED: Command flagged as dangerous ...`, directory kept; with: `DONE`, directory removed; 32 s each |
| Off-roster model id | exit 1, gateway 400 on stdout, 9 s |
| `--run-budget 15` on a long task | exit 0 at 40 s, partial answer, no marker |
| `hermes skills trust` with the whole-tree link | 56 skills reported; scan pegged a core for over ten minutes and quarantined every hub; link removed |
| `-s cli-hermes` with the per-skill link | quoted the packet's first hard rule id |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`medium`, `high`, `xhigh` and `minimal` reasoning levels were checked only through the roster pin**, which never emits them.
2. **`-Q` stdout carries the model's reasoning** before the answer with DeepSeek; a manual caller reads the tail.
<!-- /ANCHOR:limitations -->

---
