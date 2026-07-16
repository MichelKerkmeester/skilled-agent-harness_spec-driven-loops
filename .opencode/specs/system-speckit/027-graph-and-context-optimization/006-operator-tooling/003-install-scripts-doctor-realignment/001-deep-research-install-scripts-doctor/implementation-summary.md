---
title: "Implementation Summary: deep-research install/scripts/doctor realignment"
description: "A 7-iteration deep-research dive cataloged 45 post-CocoIndex + post-116 drift findings across install guides, scripts, and /doctor (+ .claude mirror), with an authoritative DB-path table and rework phasing."
trigger_phrases:
  - "install scripts doctor research"
  - "post-cocoindex install drift"
  - "116 rename impact install doctor"
  - "deep research 015 install"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor"
    last_updated_at: "2026-05-26T08:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed the 7-iteration deep-research loop and synthesis"
    next_safe_action: "Scaffold rework phases 015/002 install-guide and 015/003 doctor realignment"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "70859d71-f191-429c-96cd-6b73bb9745d8"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1 install guides: 1 P1 live cross-encoder claim + 3 stale code-graph DB rows; coco/ccc install residue ruled out"
      - "Q2 scripts: install.sh help + test-council-matrix sk-ai-council; coco/sidecar/8765 ruled out"
      - "Q3 /doctor: DB paths, advisor MCP ownership, semantic-daemon menu, route-validate, sk-* glob"
      - "Q4 116 impact: advisor fixture + routing corpus (live), optimizer + contract tests, deep-loop DB double-relocation"
      - "Q5 cross-runtime: .claude full doctor mirror SHARED-STALE; .codex correct; .gemini deep cmd drift"
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
| **Spec Folder** | 001-deep-research-install-scripts-doctor |
| **Completed** | 2026-05-26 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet ran a deep-research deep-dive, not a code change. It answers one question: do the operator-facing install guides, setup scripts, and `/doctor` commands still describe a world that the CocoIndex deprecation (014 arc) and the 116 deep-skill-evolution renames already removed? They do, in 45 catalogued places. The full finding catalogue, the authoritative current-truth path table, and the recommended rework phasing live in `research/research.md`; this summary is the index to it.

### The research output

You can now open `research/research.md` and get a segmented, file:line-precise fix list: **CORE** (install guides + scripts + `/doctor`, including its full `.claude` mirror, which is this packet's rework remit) versus **ADJACENT-116** (advisor fixtures, routing corpus, optimizer manifest, contract tests, `.gemini` deep command, which are real 116 casualties on a distinct surface). Two of the adjacent findings (advisor regression fixture + routing-accuracy corpus) are live correctness bugs: the advisor validates and scores itself against `sk-deep-*` skill ids that no longer exist.

### The DB-path resolution (highest value)

Three competing code-graph DB paths and three competing deep-loop DB paths were scattered across docs, configs, and doctor routes. Iteration 7 read the actual DB-open source and settled them: code-graph resolves to `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`; deep-loop resolves to `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`. This inverted two earlier iteration classifications: the doctor route manifest path that iters 3/5 trusted as canonical is itself stale, and a `.codex/config.toml` line flagged as drift is actually correct.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Canonical synthesis: 45 findings, path table, rework phasing |
| `research/resource-map.md` | Created | Reducer-generated resource map from deltas |
| `research/iterations/iteration-00{1..7}.md` | Created | Per-iteration narratives |
| `research/deltas/iter-00{1..7}.jsonl` | Created | Structured per-iteration findings |
| `research/deep-research-{config,state,strategy,dashboard}` + `findings-registry.json` | Created | Loop state machine |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven iterations: six discovery passes dispatched to cli-codex `gpt-5.5` (reasoning=high, service_tier=fast), one orchestrator-run source-of-truth pass for the DB-path logic-sync. Iterations ran one-at-a-time with SIGKILL + RSS check between dispatches (this Mac swap-thrashes on batched deep-loop iters). Each iteration wrote three artifacts (narrative, appended state line, delta) and reduced via `reduce-state.cjs`. Convergence reached at iteration 7 on the "all key questions answered with evidence" criterion (ratio trajectory 0.72, peak 0.74, then 0.31, 0.10).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Converge on question-coverage, not ratio below 0.05 | The ratio rose mid-run because each iteration opened a new surface; once consolidation and verification passes ran, all 5 questions were answered with evidence, which is the legitimate STOP criterion |
| Resolve the DB-path contradiction in-orchestrator (iter 7), not via codex | codex gave conflicting signals across iters 5/6; a LOGIC-SYNC contradiction warranted reading the DB-open source firsthand |
| Segment CORE vs ADJACENT-116 | Advisor/optimizer/test/gemini casualties are real but a distinct surface from install/scripts/doctor; flagged for a sibling phase so this packet stays scoped |
| One-bullet-per-finding narrative format | The state reducer counts every `- ` line in `## Findings` as a finding; structured prose kept the registry accurate (caught a 6 to 29 inflation in iter 1) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop state reduce (7 iters) | PASS, corruptionCount 0; 45 findings / 26 ruled-out |
| Resource-map emit | PASS, `research/resource-map.md` written |
| `validate.sh 001 --strict` | 0 errors (2 continuity warnings cleared by this summary + memory save) |
| DB-path claims | Resolved from source: `readiness-marker.ts:20`, `code-graph-db.ts:264`, `coverage-graph-db.ts:238`, skill READMEs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Find-only.** No surfaces were edited; remediation is the 015/002+ rework phases (see `research.md` section 7).
2. **ADJACENT-116 deferred.** Advisor fixture, routing corpus, optimizer, contract tests, and `.gemini` deep command (A-01..A-07) are catalogued but out of this packet's install/scripts/doctor core. A-01/A-02 are live advisor correctness bugs, so prioritize them in the sibling phase.
3. **Latent system-code-graph config mismatch.** `config.ts:14` `defaultDir` disagrees with the documented `.spec-kit/code-graph/database` default; flagged for a separate follow-up.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
