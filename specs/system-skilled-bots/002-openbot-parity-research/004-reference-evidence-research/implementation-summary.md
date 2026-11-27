---
title: "Implementation Summary"
description: "The 40-iteration reference evidence run finished and its synthesis is written: 121 verified rows across the fourteen build phases, a licence map and sixteen ranked net-new candidates."
trigger_phrases:
  - "reference evidence research implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research"
    last_updated_at: "2026-11-27T08:10:48Z"
    last_updated_by: "generate-context"
    recent_action: "Wrote the verified synthesis and closed the packet"
    next_safe_action: "Review research/research.md before the 003 build starts"
    packet_purpose: "Purpose: A per-phase evidence pack and a ranked list of net-new features, so each build phase starts from cited reference code and known pitfalls."
    blockers: []
    key_files:
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md"
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md"
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/findings-registry.json"
      - "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/scratch/synthesis-inputs/verify-brief.md"
    session_dedup:
      fingerprint: "sha256:8be1ea3090aff2da799b1bd67e8667fd51a568c7d687836c480f27482f643cef"
      session_id: "scaffold-004-reference-evidence-research"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "898906b1-abe5-411a-9d60-305d89889d36"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-27T07:15:00Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 004-reference-evidence-research |
| **Completed** | Not complete. Prepared 2026-11-27, the run has not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The research ran and its synthesis is written. Four lineages completed 10 iterations each, and every one of their 303 findings was re-checked against the line it cites before it entered the synthesis.

### Phase 4: reference-evidence-research

You get `research/research.md`: one evidence section per 003 build phase with the code to lift or mirror, where the plan differs from the references and the pitfalls the plan does not guard against. 121 rows stand, 90 confirmed and 31 weak. The synthesis also covers `openhuman-full`, which holds 21 vendored crates and not the five the preparation counted, all of them GPL-3.0 and so design references only. Sixteen net-new candidates are ranked, and the skip list holds. `research/regrade-log.md` records the 332 rows that were wrong, out of scope, downgraded, corrected or already carried by an earlier run.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md` | Created, then closed | The scope, the invocation, the ordered tasks and the completion criteria of the run, with the status, the ticks and the log of the finished run |
| `scratch/research-topic.txt`, `scratch/frontier-seed.json` | Created | The topic text and the six depth-1 questions the run started with |
| `scratch/preflight.txt`, `scratch/dry-run.txt` | Created | The executor checks, the two provider probes and the dry-run preview |
| `research/lineages/` | Created | Four lineage folders with 10 iteration records each |
| `research/findings-registry.json`, `research/resource-map.md`, `research/orchestration-summary.json` | Created | The merged registry, the referenced paths and the run summary |
| `research/research.md`, `research/regrade-log.md` | Created | The synthesis and the log of every finding that did not enter it unchanged |
| `scratch/synthesis-inputs/` | Created | The verification brief, the citation checker and the seven verified drafts the synthesis was assembled from |
| `../spec.md`, `../goal.md` | Modified | The parent's phase map, status, last criterion and progress row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fan-out ran with the invocation in `plan.md`: two `cli-mistral-vibe` and two `cli-pi` lineages at concurrency 4, all on DeepSeek Flash. It finished in about 17 minutes with no failed lineage. The merge produced one registry. A script then resolved every source tag in the 40 records, and seven Opus workers, one per phase group, opened each cited line, graded the finding, searched the plan for an existing guard and searched the three earlier syntheses for an earlier copy. The synthesis was assembled from their drafts by script, and the orchestrator hand-checked 20 load-bearing citations and four counts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Four lineages of 10 iterations, not one of 40 | Four lineages finish in parallel, and a provider that runs out stops half the seeds instead of the whole run |
| Two providers, Vibe and Pi | The plan-depth run lost three seeds when its one failing provider ran out of usage |
| Seeds written before the run | A running fan-out lineage does not read `research/inbox.jsonl`, so a seed cannot be corrected after spawn |
| `openhuman-full` gets its own seed and its own lineage | It is the only input no earlier run studied, and it is the largest repo in the folder |
| Run on `main` in the primary checkout | The reference repos are gitignored and exist only there |
| Verify per phase group with a stronger model | The lineages ran on a small model, and a third of what they reported was wrong. A resolving tag proves the line exists, not that it says what the finding claims |
| The regrade log is its own file | 332 wide rows would bury the evidence sections. The synthesis carries the counts and the pattern |
| The net-new order is stated as judgment | The rows are verified, the ranking is not a measurement. The synthesis says what would change it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seed admission, executors, provider probes and fan-out preview | PASS: recorded in `scratch/preflight.txt` and `scratch/dry-run.txt` before the run |
| The research run | PASS: `research/orchestration-summary.json` records `total_cli_lineages` 4, `succeeded` 4 and `failed` 0 |
| Iteration records | PASS: the `find` command of the goal prints 40 |
| Phase headings | PASS: `research/research.md` holds a `###` heading for each of the fourteen 003 phase folders |
| `openhuman-full` named | PASS: `grep -c "openhuman-full" research/research.md` prints 67 |
| Source tags in the synthesis and the regrade log | PASS: 616 and 331 tags, all resolve to an existing file and line |
| Source tags in the 40 iteration records | 688 of 718 resolve. The 30 that do not are counted per lineage in section 9 of the synthesis |
| Hand check by the orchestrator | PASS: 20 citations and four counts, all matched their rows |
| Write containment | PASS: `git status --short` lists paths under this packet's parent only |
| Packet validation | PASS: `validate.sh --strict` prints `RESULT: PASSED` for this folder and for the parent with `--recursive` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Each row has one verifying reader.** A worker opened every cited line, and the orchestrator repeated that for 20 citations. No second reader repeated the rest.
2. **An absence is a search, not a proof.** Every "the plan lacks this" names the patterns searched. The workers ran those searches and they were not rerun.
3. **Three rows rest on inference and say so.** That models skip a skill under the current label, that the bots CLI dies on a closed pipe and that shared memory can leak a private fact into a wider chat.
4. **The net-new order is judgment.** It weighs who notices, the size of a file-backed version and the licence.
5. **Five frontier questions stay open.** Section 12 of the synthesis lists them. The run stopped on its iteration budget and did not converge.
6. **Nothing is applied.** The 003 build docs are unchanged. Applying the guards and corrections is work for a later packet.
<!-- /ANCHOR:limitations -->

---
