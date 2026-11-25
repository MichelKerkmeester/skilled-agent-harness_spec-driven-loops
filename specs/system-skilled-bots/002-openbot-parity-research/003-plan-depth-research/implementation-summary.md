---
title: "Implementation Summary"
description: "A 20-iteration depth review of thirteen 003 build phases found four blockers and ninety-eight more findings, and wrote fifteen work orders that close each gap before the build starts."
trigger_phrases:
  - "plan depth research implementation summary"
  - "planning depth review implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/003-plan-depth-research"
    last_updated_at: "2026-11-25T23:50:00Z"
    last_updated_by: "record-run"
    recent_action: "Recorded the finished depth run and its fifteen work orders"
    next_safe_action: "Expand the 003 build plan from WO-01, then WO-02 to WO-14, then WO-15"
    packet_purpose: "Purpose: A verdict for each of the thirteen 003 phases and fifteen work orders that name the files to create or edit, the content each must hold and what it depends on, so the build plan can be expanded before any phase starts."
    blockers: []
    key_files:
      - "specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-plan-depth-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Spec Folder** | 003-plan-depth-research |
| **Completed** | 2026-11-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You now know which 003 phases a builder can finish alone and which need a planning artifact first. Thirteen phases were read against the built runtime and against each other, one is ready as written, and the rest carry a work order that names the exact edit.

### Phase 3: plan-depth-research

`research/research.md` walks the thirteen phases one by one. `004-computer-exposure` is ready as written, and `007-per-bot-apps` is ready pending one operator confirmation [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:45]. `010-conversations` should become a phase parent with three children [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:59], and `011-messaging-channels` with seven [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:60], because each has a user-facing surface and no design artifact [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:40]. The other nine need artifacts. The four blockers are `011`'s width and three direct contradictions between phase documents [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:630]: the proposal sentinel in 005 and 009, the empty `bots inbox --json` shape in 012 and 001, and 014's setup task against its own fallback rule [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:39].

The synthesis then lifts the per-phase gaps into eleven cross-cutting ones, and the largest is that the Shared Records table names an owner per record and never shows its contents [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:249]. Fifteen work orders close them. `WO-01` creates a packet-level `contracts/` folder with nine decisions and the record, envelope, versioning, refusal, prompt and architecture contracts, and every other order cites it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:302]. `WO-15` refreshes the citations across the packet and goes last [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:296]. No two orders edit the same file, so a writer can take one from its entry alone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Merged synthesis of the lineages, 13 phase verdicts, 11 cross-cutting gaps and 15 work orders |
| `research/lineages/` | Created | Four lineages and 20 iteration records |
| `research/findings-registry.json`, `research/resource-map.md` | Created | Merged findings registry of 102 findings, and the resource map |
| `research/steering-log.md`, `research/fanout-attribution.md` | Created | The operator-side run record and the per-lineage attribution table |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modified | Packet docs and continuity |
| `goal.md` | Created | The durable directive and its completion criteria |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One `/deep:research` fan-out in expansive depth mode, with the stop policy set to max iterations. The first config ran one Vibe `deepseek-flash` lineage and one opencode `opencode-go/deepseek-v4.1-flash` lineage at 10 iterations each. The opencode lineage failed on its monthly quota before its first iteration [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/steering-log.md:7], so a second config added two Codex `gpt-6-luna` lineages at xhigh effort and 5 iterations each [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/steering-log.md:85]. Twenty iterations ran across the three live lineages, and the merged registry holds 102 findings [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/fanout-attribution.md:7-10].

A Fable 5.2 high agent then wrote the synthesis and re-checked every finding against its cited line. Of the 102, 76 are confirmed, 19 are weak, 6 are wrong and 1 is not verified [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:618]. The re-check rejected eight findings outright [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:553], downgraded sixteen [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:579] and upgraded two [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:601], and the reason for each regrade is in section 7.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four lineages across two configs, not one | The opencode quota failed at once, so a Codex top-up replaced it and the run kept two model families rather than one |
| Review depth, not design | The 003 phases already carry the design. The run asks only whether a builder would have to decide something, and adds no design |
| Use `003-terminal-screen` as the benchmark | It is the one phase already expanded to Level 3, so it sets the bar the other thirteen are measured against |
| Regrade every finding before it enters the synthesis | The lineages graded 16 findings P0 and the synthesis keeps four, so a severity means the same thing in every row |
| Fifteen work orders, not one per finding | A writer can take one order from its entry alone, and no two orders edit the same file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iteration records | PASS: 20, vibe 10, codex-1 5, codex-2 5 and opencode 0 |
| Merged registry | PASS: 102 key findings from three lineages |
| Citation check | PASS: 76 confirmed, 19 weak, 6 wrong and 1 not verified |
| Phase verdicts | PASS: 13 rows, each naming a work order |
| Work orders | PASS: 15, with a wave order and a dependency per order |
| `validate.sh --strict` | See the final close-out run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No phase was built.** Every "needs artifacts" verdict rests on reading the requirement against the runtime, not on running it. The Rust crate was read, not compiled, and no channel transport was exercised against a provider.
2. **The opencode lineage contributed nothing.** Its quota ran out before its first iteration, so the run rests on one Vibe lineage and two Codex lineages. The Vibe lineage also ran ten iterations in about eight minutes and read a phase's `spec.md` alone in several of them, which is why six of its findings are wrong.
3. **The parent verdicts for 010 and 011 are not scored.** The spec-kit rule needs a phase score and a Level 3 result, and neither script ran. Each work order begins with the check.
4. **Nine operator decisions are open.** Each has a recommended default in `WO-01`, and none of them is the run's to take.
<!-- /ANCHOR:limitations -->

---


