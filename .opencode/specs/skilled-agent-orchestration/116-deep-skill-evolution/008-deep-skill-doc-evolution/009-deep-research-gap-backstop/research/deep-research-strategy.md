---
title: Deep Research Strategy — residual gaps after 008 deep-skill doc-evolution
description: Live strategy file for the 10-iter cli-devin SWE-1.6 residual-gap backstop. Reducer updates Sections 3, 6, 7-11 between iters; analyst owns Sections 1-2, 4-5, 12-13.
---

# Deep Research Strategy — residual gaps after 008 deep-skill doc-evolution

## 1. OVERVIEW

### Purpose

Live state file for the deep-research backstop over the 5 deep-* skills after the 008 doc-evolution pass. The orchestrator + reducer keep this in sync with `deep-research-state.jsonl` and `findings-registry.json`. Read at every iteration to surface focus, key questions, and prior dead-ends.

### Usage

- **Init:** Strategy populated from `009/spec.md` (problem/scope) and the 008 audit record at `008/001-spec-and-resource-map/resource-map.yaml`.
- **Per iteration:** cli-devin SWE-1.6 reads Next Focus + Key Questions, writes the iteration markdown; the driver appends the JSONL telemetry + delta and the reducer refreshes machine-owned sections.
- **Mutability:** Mutable — analyst-owned sections (Topic, Non-Goals, Stop Conditions, Known Context, Research Boundaries) stay stable; machine-owned sections (Key Questions, Answered Questions, What Worked, What Failed, Exhausted Approaches, Ruled Out, Next Focus) refresh after each iter.

---

## 2. TOPIC

Hunt for residual documentation and reference-structure gaps across the 5 deep-* skills (`deep-loop-runtime`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-agent-improvement`) after the 008 manual pass: references subfoldering, sk-doc 1:1 conformance (DQI 94-99), README rewrites, feature_catalog/playbook verify, deep-review SKILL cap fix, thin-ref consolidation, dead-link + sk-doc validator fixes, cross-subfolder pointer tightening, and big-file splits. Record any residual gaps as a DEFERRED backlog in `008/001-spec-and-resource-map/resource-map.yaml` phase5_backlog — do NOT implement fixes in this packet.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 — Are any reference files still mis-sized, mis-placed, orphaned, or duplicated after the subfoldering + splits?
- [x] Q2 — Are there remaining stale or dangling cross-references (skill->skill, agent mirror, command, feature_catalog, manual_testing_playbook) introduced or missed by the 008 moves?
- [x] Q3 — Do the SKILL.md smart routers + READMEs fully and accurately reflect the new subfolder structure (resource maps, intent lists, structure trees)?
- [x] Q4 — Are the feature_catalog + manual_testing_playbook snippets template-conformant with current reference paths?
- [x] Q5 — Does any other deep-* infrastructure (command YAMLs/MDs, agent mirrors, tests, configs) still carry stale paths from the 003 isolation or the 008 moves, beyond the already-fixed deep-research loop driver?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing the discovered fixes (this packet records a DEFERRED backlog only — read-only backstop).
- Re-reporting the already-fixed deep-research loop-driver stale-path bug (`system-spec-kit/mcp_server/lib/deep-loop/` → `deep-loop-runtime/lib/deep-loop/`, committed 273ae52e30).
- Re-litigating 008's accepted deferrals (word soft-caps, `.cjs` validator allowlist noise already addressed) unless a NEW concrete instance surfaces.
- Auditing skills outside the 5 deep-* set.

---

## 5. STOP CONDITIONS

- **Convergence:** `newInfoRatio < 0.05` (rolling average over last 3 iters) AND no new P0/P1 gap in the latest iter.
- **Iteration cap:** 10 iters.
- **Stuck recovery:** 3 consecutive iter failures → halt for manual intervention.
- **Negative-knowledge stop:** if an iter finds nothing new beyond `resource-map.yaml`, that is a valid converging result (low newInfoRatio).

Expect EARLY convergence: the corpus was just exhaustively audited in 008, so residual gaps should be few.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 — Are any reference files still mis-sized, mis-placed, orphaned, or duplicated after the subfoldering + splits?
- Q2 — Are there remaining stale or dangling cross-references (skill->skill, agent mirror, command, feature_catalog, manual_testing_playbook) introduced or missed by the 008 moves?
- Q3 — Do the SKILL.md smart routers + READMEs fully and accurately reflect the new subfolder structure (resource maps, intent lists, structure trees)?
- Q4 — Are the feature_catalog + manual_testing_playbook snippets template-conformant with current reference paths?
- Q5 — Does any other deep-* infrastructure (command YAMLs/MDs, agent mirrors, tests, configs) still carry stale paths from the 003 isolation or the 008 moves, beyond the already-fixed deep-research loop driver?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Dangling references/ links — 0 dangling across 300+ links checked in 5 skills (grep + ls verification) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Dangling references/ links — 0 dangling across 300+ links checked in 5 skills (grep + ls verification)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dangling references/ links — 0 dangling across 300+ links checked in 5 skills (grep + ls verification)

### deep-loop-runtime subfoldering need — confirmed flat-by-design with 4 files and 4 consumers (find + grep verification) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: deep-loop-runtime subfoldering need — confirmed flat-by-design with 4 files and 4 consumers (find + grep verification)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: deep-loop-runtime subfoldering need — confirmed flat-by-design with 4 files and 4 consumers (find + grep verification)

### Mis-sized/mis-placed/orphaned/duplicated reference files — all 5 skills' references/ structures verified clean -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Mis-sized/mis-placed/orphaned/duplicated reference files — all 5 skills' references/ structures verified clean
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mis-sized/mis-placed/orphaned/duplicated reference files — all 5 skills' references/ structures verified clean

### Orphaned reference files — 0 orphans across 5 skills (every on-disk file has inbound links) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Orphaned reference files — 0 orphans across 5 skills (every on-disk file has inbound links)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Orphaned reference files — 0 orphans across 5 skills (every on-disk file has inbound links)

### Other stale infra paths from 003 isolation or 008 moves — resource-map.yaml phase_002b_completion records 0 residual stale refs -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Other stale infra paths from 003 isolation or 008 moves — resource-map.yaml phase_002b_completion records 0 residual stale refs
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Other stale infra paths from 003 isolation or 008 moves — resource-map.yaml phase_002b_completion records 0 residual stale refs

### README structure tree mismatches — all 4 subfoldered skills match on-disk find results exactly (deep-research 13/13, deep-review 10/10, deep-ai-council 15/15, deep-agent-improvement 15/15) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: README structure tree mismatches — all 4 subfoldered skills match on-disk find results exactly (deep-research 13/13, deep-review 10/10, deep-ai-council 15/15, deep-agent-improvement 15/15)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: README structure tree mismatches — all 4 subfoldered skills match on-disk find results exactly (deep-research 13/13, deep-review 10/10, deep-ai-council 15/15, deep-agent-improvement 15/15)

### SKILL.md router + README structure tree mismatches — all routers align with on-disk subfolders -- BLOCKED (iteration 1, 1 attempts)
- What was tried: SKILL.md router + README structure tree mismatches — all routers align with on-disk subfolders
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SKILL.md router + README structure tree mismatches — all routers align with on-disk subfolders

### Stale flat paths in agent mirrors — 0 stale flat references/ patterns in .claude/, .gemini/, .codex/ (grep verification) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Stale flat paths in agent mirrors — 0 stale flat references/ patterns in .claude/, .gemini/, .codex/ (grep verification)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale flat paths in agent mirrors — 0 stale flat references/ patterns in .claude/, .gemini/, .codex/ (grep verification)

### Stale flat paths in command surfaces — 0 stale flat references/ patterns in .opencode/commands/deep/ (grep verification) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Stale flat paths in command surfaces — 0 stale flat references/ patterns in .opencode/commands/deep/ (grep verification)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale flat paths in command surfaces — 0 stale flat references/ patterns in .opencode/commands/deep/ (grep verification)

### Stale or dangling cross-references in SKILL.md RESOURCE_MAP entries — all paths resolve correctly -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale or dangling cross-references in SKILL.md RESOURCE_MAP entries — all paths resolve correctly
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale or dangling cross-references in SKILL.md RESOURCE_MAP entries — all paths resolve correctly

### Stale paths in feature_catalog snippets — spot-checked samples use current subfoldered paths -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale paths in feature_catalog snippets — spot-checked samples use current subfoldered paths
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale paths in feature_catalog snippets — spot-checked samples use current subfoldered paths

### Stale paths in manual_testing_playbook snippets — spot-checked samples use current subfoldered paths -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale paths in manual_testing_playbook snippets — spot-checked samples use current subfoldered paths
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale paths in manual_testing_playbook snippets — spot-checked samples use current subfoldered paths

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Mis-sized/mis-placed/orphaned/duplicated reference files — all 5 skills' references/ structures verified clean (iteration 1)
- Other stale infra paths from 003 isolation or 008 moves — resource-map.yaml phase_002b_completion records 0 residual stale refs (iteration 1)
- SKILL.md router + README structure tree mismatches — all routers align with on-disk subfolders (iteration 1)
- Stale or dangling cross-references in SKILL.md RESOURCE_MAP entries — all paths resolve correctly (iteration 1)
- Stale paths in feature_catalog snippets — spot-checked samples use current subfoldered paths (iteration 1)
- Stale paths in manual_testing_playbook snippets — spot-checked samples use current subfoldered paths (iteration 1)
- Dangling references/ links — 0 dangling across 300+ links checked in 5 skills (grep + ls verification) (iteration 2)
- deep-loop-runtime subfoldering need — confirmed flat-by-design with 4 files and 4 consumers (find + grep verification) (iteration 2)
- Orphaned reference files — 0 orphans across 5 skills (every on-disk file has inbound links) (iteration 2)
- README structure tree mismatches — all 4 subfoldered skills match on-disk find results exactly (deep-research 13/13, deep-review 10/10, deep-ai-council 15/15, deep-agent-improvement 15/15) (iteration 2)
- Stale flat paths in agent mirrors — 0 stale flat references/ patterns in .claude/, .gemini/, .codex/ (grep verification) (iteration 2)
- Stale flat paths in command surfaces — 0 stale flat references/ patterns in .opencode/commands/deep/ (grep verification) (iteration 2)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

### 008 doc-evolution pass (shipped — DO NOT re-propose)

Full audit + completion record: `008-deep-skill-doc-evolution/001-spec-and-resource-map/resource-map.yaml`. Shipped:

1. References subfoldering for 4 skills (deep-loop-runtime intentionally stays flat — 4 files, 4 consumers).
2. sk-doc 1:1 conformance, DQI 94-99 across all 5 skills.
3. README rewrites to `skill_readme_template.md` (9 sections), HVR style.
4. feature_catalog + manual_testing_playbook content-conformance pass.
5. deep-review SKILL.md trimmed under the 500-line house rule; 3 oversized refs split (state_format 948, loop_protocol, convergence) preserving 11 test-asserted tokens.
6. Thin-ref consolidation (3 merges); dead RELATED-RESOURCES link fixes; cross-subfolder pointer tightening.
7. sk-doc `package_skill.py` validator fix (`.cjs`/`.mjs` script extensions + `.md.tmpl` naming).

### Pre-iteration finding (P0, ALREADY FIXED)

The deep-research loop driver referenced the deleted `system-spec-kit/mcp_server/lib/deep-loop/` path (the 003 isolation migrated deep-review's YAMLs/scripts but missed deep-research's). Fixed to `deep-loop-runtime/lib/deep-loop/` across 2 YAMLs + 2 .md citations (commit 273ae52e30). OUT OF SCOPE for this loop.

### Prior research

The `000-release-cleanup` buckets under 116 ran much of this workflow per-skill (uneven status). Their findings are inputs, not subjects.

### resource-map.md status

resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (rolling-average over 3 iters)
- Per-iteration budget: 12 tool calls, 15 minutes (cli-devin SWE-1.6 fast preset)
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-devin --model swe-1.6 --permission-mode auto (one-at-a-time, SIGKILL between iters)
- Per-iter agent-config recipe: `.opencode/skills/cli-devin/assets/agent-config-deep-research-iter.json`
- Current generation: 1
- Started: 2026-05-25T14:05:00Z
