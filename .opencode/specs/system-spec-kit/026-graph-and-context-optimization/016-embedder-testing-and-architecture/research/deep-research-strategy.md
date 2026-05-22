---
title: Deep Research Strategy - 016 Coverage and Hygiene Audit
description: Strategy tracker for the 10-iteration cli-codex deep-research run auditing UNSHIPPED, DEAD, BUGGED, and MISSED items across the 016-embedder-testing-and-architecture umbrella.
---

# Deep Research Strategy - Session Tracking

Tracks research progress across iterations for the 016 umbrella coverage+hygiene audit.

## 1. OVERVIEW

### Purpose

Persistent brain for this deep-research session. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** Strategy populated from config + dispatch framing.
- **Per iteration:** cli-codex agent reads Next Focus, writes iteration findings, reducer refreshes machine-owned sections.
- **Mutability:** Mutable. Analyst sections stable, machine sections (3, 6, 7-11) rewritten by reducer.

---

## 2. TOPIC

Coverage and hygiene audit across the entire `016-embedder-testing-and-architecture` umbrella under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/`. In scope: arcs 001 through 008 plus every phase child within them.

The audit framing is distinct from a P0/P1/P2 code review (deep-review owns that). This is a coverage+hygiene lens that surfaces findings in FOUR categories:

1. **UNSHIPPED** — spec/commit messages claim work done but code doesn't actually do it.
2. **DEAD** — unreachable/unused code, env vars, config fields, doc references.
3. **BUGGED** — logic errors or contract drift hiding behind plausible-looking implementations.
4. **MISSED** — spec items that quietly disappeared between original spec and ship.

Output goal: single consolidated table with columns `Finding ID | Category | File:line + grep evidence | Recommended action`, plus short §Overview, §Methodology, §Convergence Status sections.

---

## 3. KEY QUESTIONS (remaining)

- [ ] Q1. UNSHIPPED — Which REQ rows in arc spec.md files are marked complete (or have green status) without corresponding code/tests existing?
- [ ] Q2. UNSHIPPED — Which SC criteria (Success Criteria) in arc spec.md files lack verification evidence in their implementation-summary.md?
- [ ] Q3. UNSHIPPED — Which tasks.md `[x]` rows have no matching code change or commit?
- [ ] Q4. UNSHIPPED — Which decision-record `D-NNN` entries describe behavior the current code doesn't implement?
- [ ] Q5. UNSHIPPED — Which benchmark reports recommend an action that wasn't taken in code?
- [ ] Q6. UNSHIPPED — Are cross-referenced "future packets" (e.g. 007-cpu-mps-tuning named in 008/006 benchmark) actually shipped? Compare named-future-packet references against current arc children.
- [ ] Q7. DEAD — Which functions in the rerank-sidecar, spec-memory, and cocoindex servers have no current caller (only definitions + tests)?
- [ ] Q8. DEAD — Which env vars referenced in spec docs are set at startup but never read at runtime, or vice versa?
- [ ] Q9. DEAD — Which Config dataclass fields are populated but never consumed downstream?
- [ ] Q10. DEAD — Which SKILL.md or README.md references point to files or features that no longer exist?
- [ ] Q11. DEAD — Which backcompat shims are kept "just in case" but have no caller triggering them?
- [ ] Q12. DEAD — Where do docs cite z_archive paths as authoritative?
- [ ] Q13. BUGGED — Where do Config dataclass defaults differ from runtime helper defaults (siblings of the dispatch-default drift fixed in `da33c866d`)?
- [ ] Q14. BUGGED — Where do allowlist gates check the wrong consumer's flag (siblings of the `_ensure_rerank_sidecar_for_mcp` bug fixed in same commit)?
- [ ] Q15. BUGGED — Where do HTTP request fields the producer sends differ from what the consumer ignores or expects?
- [ ] Q16. BUGGED — Where do code comments contradict the code below them?
- [ ] Q17. BUGGED — Where do tests codify the buggy behavior, making it look "tested"?
- [ ] Q18. BUGGED — Where do documented defaults disagree across docs / Config / runtime helpers?
- [ ] Q19. BUGGED — Where do frozen-time hashes (e.g., effective_config_hash) no longer match current content?
- [ ] Q20. MISSED — Which Open Questions in arc spec.md files have never been answered?
- [ ] Q21. MISSED — Which Risks lack a mitigation that was actually implemented?
- [ ] Q22. MISSED — Which "will fix in follow-on packet" promises have no follow-on packet existing?
- [ ] Q23. MISSED — Which manual playbook scenarios marked SKIPPED ("needs MCP infra") have had that infra built and the scenario still left SKIPPED?
- [ ] Q24. MISSED — Which deferred P2 advisories from prior deep-reviews were honored vs. accidentally regressed?

---

## 4. NON-GOALS

- NOT performing severity classification (no P0/P1/P2 ranking) — that is the deep-review lens
- NOT proposing remediation patches — findings only, with `Recommended action` advisory only
- NOT making any source-code edits outside `<target>/research/`
- NOT investigating arcs/packets outside `016-embedder-testing-and-architecture`
- NOT re-validating prior deep-review verdicts (assume they were correct at the time)
- NOT fixing or filing bugs — surface them in findings, that is the entire deliverable

---

## 5. STOP CONDITIONS

- 10 iterations completed (max_iterations cap)
- newInfoRatio rolling-avg below 0.10 for 3 consecutive iterations
- All 24 key questions answered with concrete evidence
- 3 consecutive stuck iterations (no new findings) → STUCK_RECOVERY recovery
- Convergence threshold 0.10 met by composite signal

---

## 6. ANSWERED QUESTIONS

[None yet — populated as iterations answer questions]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

[Populated after iteration 1 completes]

---

## 8. WHAT FAILED

[Populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS

[Approaches that were investigated and definitively eliminated]

---

## 11. NEXT FOCUS

UNSHIPPED-A. Begin with the most recently shipped arc (008-rerank-sidecar-arc) and verify every REQ/SC/D-NNN claim against actual code. Specifically:
- Does packet `008/006-cocoindex-dedup-from-shared-sidecar` (just promoted in `c0941055f`) deliver every REQ in its spec.md? Did the P1 remediation in `da33c866d` and the spec-D-004 reconciliation in `5eb359543` close out everything they touched?
- Does packet `008/007-spec-memory-mps-rerank-promotion` (the `cpu-mps-tuning` follow-on named by `008/004`'s benchmark) actually exist and ship? Inventory `008-rerank-sidecar-arc/` children vs. what its benchmark report named as the follow-on.
- For the multi-model serving commit `9349f5f4a` (rerank-sidecar: multi-model serving + per-consumer model selection), find the spec/REQ rows that justified it and verify the code implements all of them.

Method: read `008-rerank-sidecar-arc/spec.md` + each child's spec.md/implementation-summary.md/decision-record.md, then grep `_skills/system-rerank-sidecar/mcp_server` + `mcp-coco-index/mcp_server/scripts` + `system-spec-kit/mcp_server/src` for the named functions, env vars, and config fields.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Most-recently-touched commits (today, 2026-05-21):
- `9349f5f4a` feat(rerank-sidecar): multi-model serving + per-consumer model selection
- `eb04bc877` feat(rerank-sidecar): re-bench spec-memory default-on + use-model.sh swapper
- `2ac948b19` chore(016/008/006): close 4 deep-review P2 advisories
- `5eb359543` fix(016/008/006): reconcile spec REQ-006/SC-005 with D-004
- `da33c866d` fix(016/008/006): deep-review P1 remediation (dispatch-default drift + _ensure_rerank_sidecar_for_mcp allowlist bug)
- `c0941055f` feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE
- `131838c96` docs(system-rerank-sidecar): feature catalog + manual testing playbook

The `da33c866d` commit is the template for BUGGED-category sibling hunting: Config default differed from runtime helper default; allowlist gate checked wrong consumer's flag.

### Arc inventory (live)

| Arc | Slug | Phase-child count |
|-----|------|-------------------|
| 001 | local-embeddings-foundation | 20 phases (incl. 020-catalog-playbook-alignment-audit) |
| 002 | spec-memory-stack | 19 phases |
| 003 | skill-advisor-stack | 4 phases |
| 004 | code-index-stack | 20 phases |
| 005 | cross-cutting-quality | 6 phases |
| 006 | mcp-launcher-concurrency | 12 phases |
| 007 | ollama-and-bge-promotion | 4 phases |
| 008 | rerank-sidecar-arc | 7 phases (001-007) |

### Naming reconciliation

User dispatch text mentioned `007-cpu-mps-tuning` as a follow-on from 008/006's benchmark. Live arc 008 has `007-spec-memory-mps-rerank-promotion` — verify whether the cpu-mps-tuning slug was renamed at scaffold time, or whether two different follow-on streams exist.

### Resource-map status

`{spec_folder}/resource-map.md` not present — skipping coverage gate. The umbrella's spec.md serves as the entry index.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.10
- Per-iteration budget: 12 tool calls, 25 minutes
- Progressive synthesis: true (research/research.md updated each iteration)
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-05-21T05:31:00Z
- Executor: cli-codex / gpt-5.5 / high reasoning / fast service-tier / 1500s timeout / workspace-write sandbox + network access
- Read-only contract: source code is read-only; writes confined to `<target>/research/`

---

## 14. METHODOLOGY GUIDANCE FOR EACH ITERATION

Per-iteration approach (the agent has full discretion to deviate when evidence demands):

1. **Pick 1-3 unanswered key questions** from §3, prioritizing recent commits and high-risk surfaces.
2. **Read spec docs first**: `spec.md`, `tasks.md`, `plan.md`, `implementation-summary.md`, `decision-record.md` for the targeted arc/phase.
3. **Cross-check claims against code** using:
   - `git log --oneline -- <path>` to verify commits exist matching spec claims
   - `rg -n <token>` for symbol presence + caller count
   - direct Read of the implementation files to confirm behavior matches spec claim
4. **For BUGGED findings**: state the contract (what spec/comment says), then state the code behavior (what runtime does), then provide the discrepancy.
5. **For DEAD findings**: provide caller count = 0 evidence (`rg -c` showing only the definition + tests, no consumers).
6. **For UNSHIPPED findings**: link the spec claim (file:line) to the absence-of-code evidence (grep returning no matches, or only stub).
7. **For MISSED findings**: link the original promise (Open Question, Risk, "follow-on packet" comment) to the absence of resolution (no answer section, no mitigation, no follow-on packet folder).
8. **Write findings to a per-iter table** with columns: `Finding ID | Category | File:line + grep evidence | Recommended action`.
9. **Append findings to `research/iterations/iteration-NNN.md`** plus the JSONL delta + state log records.

### Conservative claim discipline

- Never invent a finding. If grep returns no evidence of the buggy behavior, do not report it.
- "Recommended action" is a one-line advisory (e.g. "Remove field if confirmed unused", "Verify and align defaults", "File follow-on packet"). Do not propose patches.
- If a finding looks compelling but the evidence is thin, mark it `SUSPECTED` rather than `CONFIRMED` and tee up a deeper probe in the next iteration's focus.
