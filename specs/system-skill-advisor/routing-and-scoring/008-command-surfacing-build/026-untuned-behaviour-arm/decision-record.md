---
title: "Decision Record: Phase 26: untuned-behaviour-arm"
description: "Operator decisions for the untuned behaviour arm: Codex left out, faster models on Pi and OpenCode, the run-size amendment and the stop before any scoring."
trigger_phrases:
  - "026-untuned-behaviour-arm operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/026-untuned-behaviour-arm"
    last_updated_at: "2026-11-15T07:40:00Z"
    last_updated_by: "claude"
    recent_action: "Recorded the operator decisions that ended the arm before scoring"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 26: untuned-behaviour-arm

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Leave Codex out and run the arm on five runtimes. | The `/hooks` approval in the fresh Codex arena did not reach `~/.codex/config.toml`, so the dry run printed `codex-hooks-unapproved` after the first approval. | Arm Design: six runtimes | tasks.md T040 `[B]`, goal log row `Codex arm` |
| Q002 | Run Pi and OpenCode on a faster DeepSeek flash model, and leave Devin and DSH as they are. | The max-effort route took about three minutes a turn on OpenCode. | Arm Design: the arms share the models | Runner commits `2d3944a3d9` and `067c2cf029`, goal log rows `OpenCode model switch` and `Pi and OpenCode model switch` |
| Q003 | Ask a fresh Fable 5.2 medium whether every run is needed, and apply its answer: run 1 of both arms plus a second on-arm run of the 8 decline rows. | The operator asked whether the logic could already be trusted. The advisor-only check showed the expected command offered on 6 of 20 fit rows. | Arm Design: two runs per arm | `scratch/decide-run-size/report.txt`, goal log row `Run-size amendment`, tasks.md T042 |
| Q004 | Stop the arm before any scoring. | "I dont want to run it." | Q003 | tasks.md T042 `[B]`, goal log row `Behaviour arm stopped` |
| ADR-001 | Waive AC-004, AC-010, AC-011 and AC-012. The arm was stopped before any scoring (Q004), so no arm summary, evidence file, verdict, step reader report or B-5 row exists. Claude holds run 1 of both arms (36 off, 36 on). Devin, DSH, Pi and OpenCode hold partial off lines only, so no pooled sign test can run. | Operator stop, 2026-11-15. | Pre-registered Target | acceptance-criteria.md, implementation-summary.md |
<!-- /ANCHOR:operator-decisions -->
