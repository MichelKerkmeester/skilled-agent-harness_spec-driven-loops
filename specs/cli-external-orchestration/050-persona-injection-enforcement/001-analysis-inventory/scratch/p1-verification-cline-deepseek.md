---
title: "Focused File Review: CLI External Orchestration Persona-Injection Inventory (dispatch-point verification)"
trigger_phrases: []
---

> build · cline-pass/deepseek-v4-flash

# Focused File Review: CLI External Orchestration Persona-Injection Inventory (dispatch-point verification)

Review mode: adversarial inventory verification against inline source excerpts only. All citations are to the provided SOURCE.inventory text, not disk (tool access disabled on this transport). Confidence: MEDIUM — the two supplied agent-delegation.md source files were NOT provided, so §B rows citing *only* agent-delegation.md could not be line-verified; all materially load-bearing findings below are grounded in the provided SKILL.md/excerpt source.

## Summary

- **Recommendation: REQUEST CHANGES**
- **Score: 75/100** (Correctness 18/30 · Security 22/25 · Patterns 14/20 · Maintainability 12/15 · Performance 9/10)

The inventory is well-structured, mostly accurately cited, and its core native-vs-inline discrimination for opencode/codex/devin/pi is sound. But it affirmatively mischaracterizes `cli-cursor` in a way the provided source directly contradicts, and that error propagates into the central conclusion ("only 1 of 6 modes natively loads personas"). Because that false negative drives the recommended fix ("inline persona wrappers across all 5 remaining dispatchers"), it must be corrected before the inventory is trusted as the planning basis.

## Findings

### P0-1 — cli-cursor native subagent persona loading is mischaracterized; §B misses the dispatch point (Q1/Q2/Q4)
- **Inventory claim:** §C cursor row `"YES (GENERAL RULES ONLY)... cannot load role-specific agent personas (@review, @debug)"`; §D item 4 lists cursor `-p` default/plan/ask as unreservedly "attach NO persona"; §B has no cursor row for native subagent loading; Recommendation: "only 1 of the 6 CLI modes (`cli-claude-code` via `--agent`) natively loads agent personas during non-interactive dispatch."
- **Source contradiction (cli-cursor/SKILL.md, "Repository Rules... and Parity Boundaries" / "#### Custom Subagents" region):** "Cursor CLI loads custom subagents from two places: `.cursor/agents/*.md` (project)... `.claude/agents/*.md` (project, Claude-format auto-import)... A live `cursor-agent --force -p` roster probe lists all 13 repo agents (`ai-council`, `code`, `context`, `debug`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`)... Each `.cursor/agents/<name>.md` is a **symlink** to the canonical `.claude/agents/<name>.md`." That includes `@review` and `@debug` — precisely the two personas the inventory asserts cursor "cannot load."
- **Impact:** The inventory's affirmative "cannot load role-specific agent personas" is factually false per source. The top-level bare `cursor-agent -p` still runs the default agent (nuance the inventory got right in its `-p` rows), so the per-row `NO` verdicts are defensible **at the flag level**. But the broader limitation claim, and the corollary that cursor is in the same "must inline, native loading unavailable" bucket as codex/pi/opencode, is wrong — cursor has a confirmed native subagent roster surface.
- **Adversarial self-check:** Hunter P0. Skeptic — the subagents are triggered by in-session invocation / `--force -p` role naming, not auto-attached to a bare `-p` dispatch, so severity of the *top-level* gap is partially mitigated; the inventory's `-p` rows remain technically true. Referee — Confirmed as a missed §B path (P0 per Q1 rule) with the top-level `-p` nuance noted; **final severity P0 (missed path) with an acknowledged scope qualifier.**
- Evidence: cli-cursor/SKILL.md "Custom Subagents" (source); inventory §C cursor rows; §D item 4; Recommendation ("only 1 of the 6").

### P1-1 — §B omits `codex exec review` and `codex --search exec`, yet §D item 3 names `codex exec review` (Q1/Q4)
- **Source (cli-codex/SKILL.md §3):** "Git diff review uses the built-in subcommand (no `-p`): `codex exec review \"...\" --commit HEAD`." and "enable live web search as `codex --search exec …`."
- **Inventory inconsistency:** §D item 3 explicitly lists "`codex exec review`" as a dispatch path, but §B's cli-codex block never inventories it (nor `--search exec`), claiming the §B enumeration spans default invocation / `-p <profile>` delegation / rules 10–14 / agent-delegation / templates. The path is therefore *known* (in §D) but *not surface in §B*, breaking §B's "dispatch point inventory" contract.
- Adversarial self-check: Hunter P1. Skeptic — §D documents the gap, so this is an internal-consistency defect, not a missed protection gap; arguably covered by §B's "default invocation" umbrella. Referee — Downgraded to **P1** (completeness/consistency), not P0.

### P1-2 — Recommendation overstates a uniform "5 modes must inline" gap that source `run_subagent`/`cursor-agent` native surfaces contradict (Q4)
- **Source:** cli-devin/SKILL.md "Agent Roster Parity" ("All 13 repo agents are dispatchable through `run_subagent`... `.devin/agents/<name>/AGENT.md` symlink to canonical" — already correctly recorded as **YES** in §C); cli-cursor "Custom Subagents" (13-roster native discovery).
- **Inventory recommendation:** "Only 1 of the 6... The remaining 5 modes (cli-opencode, cli-codex, cli-cursor, cli-devin, cli-pi)... dispatch unspecialized sessions without persona guardrails. Reusing the inline injection precedent... will close this gap **uniformly.**"
- **Impact:** "Uniformly" is wrong. Devin (run_subagent) and — per the source, cursor (`.cursor/agents/*.md`/`.claude/agents/*.md`) — already have native persona mechanisms; the injection solution should be mode-split (native where available, inline elsewhere), not one uniform inline wrapper.

### P2-1 — cli-devin inline `run_subagent` roster-parity dispatch example not directly cited in §B
- Source shows an operational dispatch shape: `devin --permission-mode bypass -p "Use the review subagent to review the current diff..."`. §B covers it only via agent-delegation.md ranges (unverifiable here). Suggest a direct §B row.

### P2-2 — §F should flag the canonical card's stale "three" wording instead of silently listing six
- The canonical card's "§7. MIRROR SYNC" reads "All three cli-* cards (`cli-claude-code`, `cli-opencode`, `cli-opencode`)..." (and §8 lists only two delegates). §F enumerates six correctly but does not surface that the *canonical card is itself stale* — useful context for the Q3 drift, currently omitted.

## Positive highlights
- §C `cli-opencode` rows (default NO; `--agent general` rejected NO; `--agent orchestrate`→Task subagent YES; `As @<agent>:` inline-only NO) all match the provided cli-opencode source, including the exact "rejects them at the top level" and "put any agent-profile request in the prompt body" mechanics.
- §C `cli-codex` group — `-p <profile>` "NO (CONFIG ONLY)" and `.codex/agents/*.toml` "NO (TUI ONLY)" exactly match the source's "define personas for the interactive multi-agent TUI, NOT the `-p` flag" and "Profiles may override model/model_reasoning_effort/..." evidence.
- §C `cli-devin` "NO (DOC MISMATCH)" for `.claude/agents/*.md` auto-import is confirmed verbatim by the source's "Installed-Version Import Correction" (installed 3000.2.17 does not import; `.devin/agents/<name>/AGENT.md` required).
- The recommendation's reuse-model — `DESIGN_DISPATCH_MANIFEST v1` and orchestrate.md "Agent Loading Protocol (READ → INCLUDE → SET general)" — is genuinely grounded in the provided orchestrates/skills sources, including the naming "Telling a general agent 'you are @debug' is NOT equivalent to loading debug.md."

## Scoring note
A documented P0 (missed dispatch path) blocks a PASS recommendation regardless of the 75/100 band; findings are repairable (P0-1 via correcting the cursor §B/§C/§D classification), hence REQUEST CHANGES rather than BLOCK.

## Per-question verdicts (Q1–Q4)

| Q | Verdict | Basis |
|---|---------|-------|
| **Q1** Completeness | **CORRECTION-NEEDED** | §B misses the cursor native custom-subagent loading surface (`cli-cursor/SKILL.md` "Custom Subagents"; P0), and the `codex exec review` / `codex --search exec` variants (P1). |
| **Q2** Native-vs-inline | **CORRECTION-NEEDED** | opencode/codex/devin/pi verdicts all supported by source. cli-cursor's per-`-p`-row `NO`s are defensible, but its "cannot load role-specific agent personas" evidence statement is false per source (all 13 roster agents, incl. `@review`/`@debug`, are natively discovered). No wrong-YES; a material wrong-NO. |
| **Q3** Drift | **CONFIRMED** | Source FACT: six `cli-*/assets/prompt-quality-card.md` files present; §F's "six" is correct. The canonical card's "three" is the stale artifact itself (and double-lists `cli-opencode`); it does not refute the inventory's six. |
| **Q4** Gap list | **CORRECTION-NEEDED** | Items 1–3, 5–8 correctly listed; `codex exec review` correctly named but `--search exec` omitted; item 4 (cursor) overstated — source shows native subagent loading exists, so cursor is not unreservedly "unprotected," and the "uniform" gap framing in the Recommendation is wrong (devin/cursor have native surfaces). |

Only findings traceable to the provided source were retained; where the source could not verify an assertion (agent-delegation.md line ranges and the canonical card's §8 related-resource list), the finding was downgraded or marked unverifiable rather than invented.

VERIFY_COMPLETE
