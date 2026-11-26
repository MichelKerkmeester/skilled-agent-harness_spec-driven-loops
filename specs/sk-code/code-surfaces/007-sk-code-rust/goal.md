---
title: "Goal: Rust standards in sk-code, informed by rust-anything"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk code rust goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/code-surfaces/007-sk-code-rust"
    last_updated_at: "2026-11-26T11:53:48Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "833af0cc-38d5-498d-8268-a1869252b4d2"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Rust standards in sk-code, informed by rust-anything

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make sk-code's Rust references and checklist cover a Rust app as well as a Rust binding, with every new rule traced to a line of the rust-anything repository.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rust stays inside the sk-code-skilled surface, with no new surface packet. Amended 2026-11-26 by operator decision: the RUST detection row in `stack-detection.md` and the sk-code routers gain the app-crate vocabulary `clap cli`, `clap crate`, `clap derive`, `clap::`, `ratatui` and `crossterm`. |
| D2 | The research is one `/deep:research` fan-out of three `cli-mistral-vibe` lineages on `deepseek-flash` at max thinking, up to eight iterations each. No Fable or Opus agent runs. |
| D3 | rust-anything is read-only. Its rules are restated in sk-code's own words with a source line, and no file is copied. |
| D4 | The napi-rs and WASM parity rules keep their meaning. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `specs/sk-code/code-surfaces/007-sk-code-rust/research/research.md` exists and ranks edits, each naming a target Rust part and a rust-anything `file:line`
- [x] `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`
- [x] `grep -rl` over `.skilled/skills/sk-code/sk-code-skilled/references/rust` finds `clap`, `ratatui` and `crossterm` at least once each, or research.md names why one is absent
- [x] `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` carries a version above 2.2.3.0 and its changelog folder holds the matching entry
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/code-surfaces/007-sk-code-rust --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Packet scaffolded | Done | `validate.sh --strict` printed `RESULT: PASSED` on 2026-11-26 |
| Research fan-out and synthesis | Done | `research/research.md` ranks 18 edits, each with a rust-anything `file:line` |
| Ranked edits applied | Done | 17 rows applied and row 16 dropped, recorded in research.md section 5. `scratch/cite-check.txt` marks 29 of 29 anchors `ok` |
| Router sync | Done | `verify-router-sync.cjs` printed `router-sync: 5/5 checks passed`, exit 0 |
| Coverage grep | Done | `clap`, `ratatui` and `crossterm` each found in `build-and-organization.md` |
| Version and changelog | Done | `SKILL.md` carries `version: 2.3.0.0`, and `changelog/v2.3.0.0.md` exists |
| Packet validation | Done | `validate.sh --strict` printed `RESULT: PASSED`, 0 errors, 1 warning on Trash paths in a raw lineage file |
| Continuity save | Done | generate-context.js --full-auto exited 0, trigger index regenerated |
| LS-006 replay | Partial | Vibe worker exit 0 finished, Rust loaded in full, typescript/quick-reference not opened |
| LS-006 replay rerun | Done | Run 4 after the loading fix loaded both trios and 7 of 7 TypeScript parts, scratch/ls006-replay.txt |
| Follow-up after the first commit | Done | Review fixes, open-every-file rule, app-crate keywords, LS-007 run 3 meets its criteria, packet docs closed |
| Alignment fix pass | Done | Every finding from both alignment runs fixed. The --recheck resolved 3 rows, found 0 new, and left 4 open rows that pass on main |
| Bots timeout fix and v4.2.0.0 republish | Done | bot-check.cjs loads through one tsx namespace, 17 of 17 workflows green on 82fde07afe1, tag moved and release body updated |

### Deviations and findings

| Item | Note |
|------|------|
| Four rows changed while applying | Rows 13, 16, 17 and 18 would have given wrong guidance as worded. research.md section 5 records each change, and a `cargo clippy` run confirmed the row 17 case |
| One Level 2 packet, not a phase parent | `recommend-level.sh` scored the phase need 10 of 50 against a threshold of 25, and the operator chose one packet on 2026-11-26 |
<!-- /ANCHOR:log -->
