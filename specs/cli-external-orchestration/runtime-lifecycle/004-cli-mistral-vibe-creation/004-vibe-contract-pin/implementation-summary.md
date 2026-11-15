---
title: "Implementation Summary"
description: "Mistral Vibe's headless contract is now pinned by keyed runs: payload shapes, stdin, process names and catalog behavior are observed, not read from source."
trigger_phrases:
  - "vibe contract pin implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin"
    last_updated_at: "2026-11-14T15:10:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Ran the keyed contract-pin dispatches and recorded Q1, Q3, Q4 and Q7"
    next_safe_action: "Carry the four answers into phases 005 to 012"
    blockers: []
    key_files:
      - "evidence/export.json"
      - "evidence/catalog.md"
      - "evidence/stdin.md"
      - "evidence/ancestors.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1, Q3, Q4 and Q7, see goal.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-vibe-contract-pin |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Later phases can now build the Vibe runtime mode on observed behavior. Eight keyed dispatches on `vibe 3.1.2` answered the four questions the research left open.

### Phase 4: vibe-contract-pin

- **Payloads (Q1).** `--output json` prints one JSON array of session entries at the end, and `--output streaming` prints the same entries one per line. Neither carries the exit code, so `export.json` is the verdict.
- **Stdin (Q3).** A piped prompt works only behind a bare `-p`. Without `-p`, Vibe exits 1.
- **Process names (Q4).** The ancestor walk shows `vibe-rs` and `vibe-app-server`, never `vibe`.
- **Catalog (Q7).** Neither roster id resolves without a hand-written model row. The repository's rows use their own aliases, `deepseek-flash` and `glm-flash`, each at `thinking = "max"`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/vibe-model-rows.toml` | Created | The two hand-written model rows |
| `scratch/ancestors.sh` | Created | Ancestor walk run through Vibe's shell tool |
| `scratch/run-start.marker` | Created | Isolation reference time |
| `evidence/` | Created | Export records, payloads, stdin, ancestor and catalog notes |
| `goal.md`, `tasks.md` | Modified | Answers recorded, tasks ticked |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every run used a fresh `VIBE_HOME` and a temp working directory, with the prompt "Reply with exactly the word OK and nothing else." Each verdict was read from `export.json`. One claim in the catalog note was first written from inference, that the built-in free GLM row would capture `--model zai-glm-5-3-flash`. A dispatch disproved it, and the note now records the observed `Unknown model` exit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repository aliases differ from the model ids | The id `zai-glm-5-3-flash` is already the alias of a built-in free row, so a separate alias avoids any ambiguity |
| Session journals left out of `evidence/` | They hold Vibe's system prompt and local paths, and no check reads them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `jq -r .exit_code evidence/export.json` | PASS: `0`, `outcome` finished, model row `deepseek-v4-1-flash-1017` at `max` |
| json and streaming `export.json` | PASS: `0` each |
| `evidence/export-glm.json` | PASS: `0` |
| Key leak, `rg -l -F -- "$MISTRAL_API_KEY" evidence scratch` | PASS: 0 files |
| Home isolation, `find ~/.vibe -newer scratch/run-start.marker` | PASS: 0 entries |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`allowed_models` untested.** Closing the selectable set to the roster is a research claim. Phase 006 should prove it.
2. **Large system prompt.** A one-word answer cost about 8,450 input tokens.
3. **Billing pool still UNKNOWN.** No budget read was taken before and after a run.
<!-- /ANCHOR:limitations -->
