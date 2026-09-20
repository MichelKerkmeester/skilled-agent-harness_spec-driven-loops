---
title: "Implementation Summary: Persona-Injection Gap Analysis & Dispatch-Point Inventory"
description: "Records the inventory findings once the cli-devin analysis returns and is verified. Currently a scaffold — the analysis has not yet been dispatched."
trigger_phrases:
  - "persona injection analysis implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/001-analysis-inventory"
    last_updated_at: "2026-08-19T10:48:00Z"
    last_updated_by: "claude"
    recent_action: "cline verified tool-free; cursor P0 correction reconciled into inventory + contract"
    next_safe_action: "Author P2 persona-injection contract (002-persona-injection-contract)"
    blockers: []
    key_files:
      - "scratch/dispatch-point-inventory.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-001-analysis"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-analysis-inventory |
| **Completed** | 2026-08-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dispatch-point inventory covering the three trees, produced by cli-devin (Gemini 3.7 Flash @ high, `context` persona inlined) and verified against source. Key findings:

- **Agent roster (§A):** 13 personas in `.opencode/agents/*.md`, each mapped to a dispatch intent (code→code, review→review, design→design, research→deep-research, context→exploration, etc.).
- **Dispatch points (§B):** every prompt-composition / CLI-invocation point across the hub, all six modes, and sk-prompt — each mode's `SKILL.md` default invocation + `references/agent-delegation.md` + `assets/prompt-templates.md`.
- **Native-vs-inline (§C):** only **`cli-claude-code` `--agent`** natively loads the resolved persona on the non-interactive path (resolving from `.claude/agents/`, mirror-synced with `.opencode/agents/`). The other **5 modes must INLINE** the persona: `cli-opencode` (`mode: subagent` files rejected at top-level `--agent`), `cli-codex` (`.codex/agents/*.toml` is TUI-only, `-p` loads config not persona), `cli-cursor` (auto-imports general rules only, no role personas), `cli-devin` (no persona flag; `.claude/agents` import claim is a doc-vs-installed mismatch), `cli-pi` (no persona system on core `pi -p`). The shared `fanout-run.cjs` runtime passes raw task prompts with no persona.
- **Gap (§D):** 8 dispatch paths currently attach NO persona (all 5 inline-required modes' default paths + `cli-claude-code` without `--agent` + the fanout runtime).
- **Precedents to generalize (§E):** `orchestrate.md` "Agent Loading Protocol (MANDATORY)" (READ the agent file → INCLUDE its content in the prompt), and `DESIGN_DISPATCH_MANIFEST v1` (Rule 14 in each mode — "the child cannot resolve skill paths, so the manifest travels in the payload, not by reference") — the exact inline-payload pattern to reuse.
- **sk-prompt ownership (§F):** `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` is the canonical owner of CLI prompt construction; all six `cli-*/assets/prompt-quality-card.md` thin cards + all six mode SKILLs reference it. This card is the P4 anchor for the persona-injection step.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/dispatch-point-inventory.md` | Created | The analysis artifact (cli-devin/Gemini output, verified) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single read-only cli-devin dispatch (Gemini 3.7 Flash @ high, `context` agent persona inlined into the prompt — dogfooding the rule this packet adds) produced the inventory, followed by a deterministic orchestrator verification pass over the cited `file:line` claims. The planned independent cli-opencode/cline cross-check (DeepSeek V4 Flash @ xhigh) was attempted twice but did not complete (see Verification / Known Limitations); P1 correctness therefore rests on the deterministic pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Dispatch the analysis WITH the persona inlined | Dogfoods the exact rule this packet adds, and produces a higher-signal read than a persona-less generic sweep |
| One coherent inventory, not a fan-out | A single artifact is easier to verify claim-by-claim than fragments; completeness is the risk, not throughput |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| cli-devin analysis produced | PASS — 28 KB, all 6 sections, `INVENTORY_COMPLETE` |
| Cited file:line claims spot-verified (deterministic) | PASS — orchestrate.md protocol, cli-devin invocation + Rules 12–14, sync guard, claude-code `--agent`, opencode subagent rejection, 6-card count |
| All 6 modes + hub + sk-prompt covered | PASS — completeness sweep + mode-registry.json cross-check |
| Independent cline/DeepSeek-Flash cross-check | PASS (tool-free) — REQUEST CHANGES: found + source-confirmed the cli-cursor native-surface P0 correction; reconciled into the inventory + contract |
| `validate.sh --strict` | see below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Independent verify leg now working (tool-free).** The cli-opencode/cline (DeepSeek V4 Flash @ xhigh) cross-check first failed on an invalid `--format text` flag, then on DeepSeek-Flash tool-call markup (`<｜DSML｜…`) leaking on the cline-pass transport. Root cause: the cline-pass endpoint does not parse DeepSeek's tool-call format. Fix: dispatch **tool-free** (inline the inventory + source; no Read/Grep needed). A minimal probe confirmed the model responds cleanly; the tool-free verification then completed and returned a full adversarial review (evidence: `scratch/p1-verification-cline-deepseek.md`).
2. **The verification caught a real P0 the deterministic pass missed:** the inventory wrongly classed `cli-cursor` as inline-only; source confirms cursor has a native subagent surface. Corrected in the inventory's appended "INDEPENDENT VERIFICATION CORRECTIONS" section and in the P2 contract `§3`.
3. **Source-drift finding (P4):** 6 real `cli-*/assets/prompt-quality-card.md` files exist, but the canonical `cli-prompt-quality-card.md` "MIRROR SYNC" section says "three" and the sync-guard header says "4 executors". Recorded for P4.
<!-- /ANCHOR:limitations -->
