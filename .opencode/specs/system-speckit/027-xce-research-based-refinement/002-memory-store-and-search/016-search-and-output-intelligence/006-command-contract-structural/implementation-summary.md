---
title: "Implementation Summary: command-contract-structural — deterministic arg-resolution + salience inversion"
description: "Weak models stopped dropping the /memory:search query: arg-presence is now computed in shell, the execute-path leads, and the startup question is gated behind ARGS_PRESENT=false."
trigger_phrases:
  - "memory search command contract"
  - "args_present"
  - "startup question drop"
  - "salience inversion"
  - "command arg resolution"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence/006-command-contract-structural"
    last_updated_at: "2026-06-17T08:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Restructured /memory:search arg handling: shell header + salience inversion + no-ask guard"
    next_safe_action: "FOLLOW-UP: live A/B --command execute-rate run on Kimi/MiMo (cannot run here)"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-006-command-contract-structural"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "How to stop weak models dropping the query? -> compute ARGS_PRESENT/QUERY in shell, invert salience, gate the ask-path."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-command-contract-structural |
| **Completed** | 2026-06-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Weak instruction-followers (Kimi K2.7 always, MiMo v2.5 Pro intermittently) used to drop the `/memory:search` query and fall back to the startup question even when invoked with a real query. The root cause was salience, not transport: the contract made "ask when `$ARGUMENTS` is empty" the first, most imperative instruction, and required the model to actively negate an empty-guard to do its job. This phase moves that branch out of model judgment and into the shell, then re-orders the contract so the execute-path is what a model reads first.

### Deterministic arg-resolution header (recommendation #1, #7)

`/memory:search` now opens with a `` !`…` `` shell block that runs before the model reads any policy. It joins every `$ARGUMENTS` word into one string and emits two ground-truth lines:

```
ARGS_PRESENT=true|false
QUERY="<joined query>"
```

The join fixes the `"$@"` word-split caveat (#7): inside `` !`…` `` injections `$ARGUMENTS` expands one word per argument, so the renderer joins argv itself (`"$*"` after passing the words as positional params to `bash -c`). Embedded double-quotes are escaped (`"` → `\"`) so the `QUERY="…"` line stays well-formed. The `bash -c` wrapper guarantees bash param-expansion regardless of the outer shell.

### Salience inversion (recommendation #2)

The execute-path now leads. Section order changed from `STARTUP ROUTING → RETRIEVAL → ANALYSIS` to `RETRIEVAL (§3) → ANALYSIS (§4) → STARTUP (§5)`. The startup section is physically last and explicitly gated: "Reach this section ONLY IF `ARGS_PRESENT=false`." A populated query can no longer reach the ask-path. The presentation asset's §1 Startup Question Policy got the same gate at its top, so reading the asset first no longer re-anchors the model on the ask-path.

### Imperative no-ask guard (recommendation #3)

Bound to the resolved values: "When `ARGS_PRESENT=true` you MUST execute retrieval (or the analysis route) on `QUERY` now. Do NOT ask the startup question, and do NOT treat a populated `QUERY` as empty." The existing arg echo (`MEMORY:SEARCH "<query>"`) is preserved and a new arg-echo rule makes a dropped query self-correctable: the echoed query MUST equal `QUERY`, else re-emit.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/memory/search.md` | Modified | Added §0 ARGUMENT RESOLUTION shell header + no-ask guard; reordered so RETRIEVAL/ANALYSIS precede the gated STARTUP section; rewrote arg-presence branch to bind on `ARGS_PRESENT`/`QUERY`. |
| `.opencode/commands/memory/assets/search_presentation.txt` | Modified | Gated §1 Startup Question Policy behind `ARGS_PRESENT=false`; replaced `$ARGUMENTS`-empty wording with the resolved-flag wording. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The shell header was authored and tested standalone before being embedded. Two canonical runs (populated + empty) plus two edge cases (embedded double-quote, analysis subcommand) confirm it emits the correct `ARGS_PRESENT`/`QUERY`. The contract was then re-ordered for salience and grepped for cross-file consistency. The output field set and 0–1 two-decimal similarity scale were deliberately left untouched — that is the next phase (007-output-surface-parity / O2).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Compute arg-presence in shell, not in the model | The defect is a salience-driven conditional misfire; moving the branch out of model judgment makes it deterministic instead of relying on each model negating an empty-guard correctly. |
| `bash -c` wrapper with `"$*"` join over relying on `$ARGUMENTS` directly | Inside `` !`…` `` the injection word-splits like `"$@"`; the wrapper joins argv and gives bash-only param expansion (quote-escaping) regardless of the outer shell. |
| Physically move STARTUP to §5, last | Weak models anchor on the first imperative they read; leading with the execute-path is the structural fix the research called for, not a re-wording. |
| Keep bare→ask and the "never infer query from conversation" rule | Explicitly in-scope-forbidden to change; only the gate condition was reworded from `$ARGUMENTS`-empty to `ARGS_PRESENT=false`. |
| Leave output fields / similarity scale alone | O2 (phase 007) owns that; this phase is arg-handling + salience only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

### Shell header — two mandated runs

Standalone evaluation of the embedded header logic (`bash -c 'if [ "$#" -gt 0 ]; then q="$*"; q="${q//\"/\\\"}"; printf "ARGS_PRESENT=true\nQUERY=\"%s\"\n" "$q"; else printf "ARGS_PRESENT=false\nQUERY=\"\"\n"; fi' -- $ARGUMENTS`):

Run A — populated (`$ARGUMENTS` → `deep research remediation handover`):

```
ARGS_PRESENT=true
QUERY="deep research remediation handover"
```

Run B — empty (`$ARGUMENTS` → nothing):

```
ARGS_PRESENT=false
QUERY=""
```

Edge — embedded double-quote (args `fix`, `the "auth"`, `bug`):

```
ARGS_PRESENT=true
QUERY="fix the \"auth\" bug"
```

Edge — analysis subcommand (`preflight specs/foo TASK-1`): emits `ARGS_PRESENT=true QUERY="preflight specs/foo TASK-1"`; §4 routing then detects the `preflight` first-token.

### Contract consistency

| Check | Result |
|-------|--------|
| Execute-path (§3 RETRIEVAL, §4 ANALYSIS) physically precedes gated §5 STARTUP | PASS (grep: §3/§4 at lines 39/81, STARTUP at §5 line ~108) |
| No-ask guard references `ARGS_PRESENT`/`QUERY` | PASS (search.md §0 + §2 + §5) |
| Only `$ARGUMENTS` occurrence is the header block (no stale empty-guard prose) | PASS (grep: lines 13/15 only) |
| Arg echo `MEMORY:SEARCH "<query>"` preserved + must-equal-`QUERY` rule added | PASS |
| Presentation §1 gated behind `ARGS_PRESENT=false` | PASS |
| Output field set + 0–1/2dp similarity scale unchanged | PASS (not edited) |
| `validate.sh … --strict` | PASS (Exit 0, Errors 0 Warnings 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live execute-rate confirmation is the documented FOLLOW-UP and was NOT run here.** The structural claim ("weak models now execute instead of asking") needs a live A/B `--command` run on Kimi K2.7 and MiMo v2.5 Pro measuring execute-rate before/after. That requires dispatching the patched contract through `opencode run --command memory/search …`, which is outside this contract-editing task.
2. **Output fields and similarity scale are intentionally unchanged.** Recommendations #4/#5 (surface-parity, named optional fields) belong to phase 007 (O2); this phase deliberately did not touch them.
3. **COSTAR-register rewrite (#6) not applied.** That is a framing lever, secondary to the structural fix, and out of this phase's scope.
<!-- /ANCHOR:limitations -->
