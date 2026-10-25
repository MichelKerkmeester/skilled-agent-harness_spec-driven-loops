---
title: Deep Research Strategy - sk-code-review modes research
description: Session tracking for the ten-iteration deep-research run on making sk-code-review repo-agnostic, more useful and better integrated with sibling and user-authored modes.
trigger_phrases:
  - "sk-code-review research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - sk-code-review modes research

## 1. OVERVIEW

### Purpose

Persistent brain for this research session. Analyst-owned sections (2, 4, 5, 12, 13) stay stable. Machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
How to make sk-code-review more repo-agnostic, more useful and better integrated with sibling and user-authored modes

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 Repo-bound inventory: which `.skilled/` markers, agent paths, cache locations and stack-specific path patterns does the sk-code-review packet hold, and is each portable, configurable or repo-bound?
- [x] Q2 UNKNOWN-surface path: what does a review do when the surface is UNKNOWN, how much of the baseline stays useful, and how could a repository declare its own surface evidence?
- [x] Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?
- [x] Q4 Usefulness evidence: what does review catch, cost and miss in the repository's own benchmark reports, playbook scenarios and changelog?
- [x] Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming?
- [x] Q6 Review and quality boundary: does review read what the quality gate checked, who reports and who fixes, and how do the shared checklist name and the tie-break order divide the work?
- [x] Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read?
- [x] Q8 Consumers and contracts: which consumers depend on the status line, the CODE-REVIEW prompt prefix and the shared doctrine, and what would a configurable review break?
- [x] Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it?
- [x] Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any file under `.skilled/`. Recommendations are ranked, not applied.
- `sk-code-quality` as a subject. It is read only to describe its boundary with review.
- Relaxing the security and correctness minimums, the three-value final status line or the cache-only `Write` scope. These are fixed inputs. A recommendation that needs one changed says so and is marked as needing a decision.
- Implementing a recommendation, adding tests or running a benchmark.
- Reading anything in the research folder of sibling phase 001 (quality mode). This run is independent of it.

---

## 5. STOP CONDITIONS
- Exactly ten iterations, one angle each, in plan order. Stop policy is `max-iterations`, so convergence is telemetry only and cannot end the run before iteration ten.
- An iteration that writes no record file is a failed iteration, not a converged one.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 Repo-bound inventory: which `.skilled/` markers, agent paths, cache locations and stack-specific path patterns does the sk-code-review packet hold, and is each portable, configurable or repo-bound?
- Q2 UNKNOWN-surface path: what does a review do when the surface is UNKNOWN, how much of the baseline stays useful, and how could a repository declare its own surface evidence?
- Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)?
- Q4 Usefulness evidence: what does review catch, cost and miss in the repository's own benchmark reports, playbook scenarios and changelog?
- Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming?
- Q6 Review and quality boundary: does review read what the quality gate checked, who reports and who fixes, and how do the shared checklist name and the tie-break order divide the work?
- Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read?
- Q8 Consumers and contracts: which consumers depend on the status line, the CODE-REVIEW prompt prefix and the shared doctrine, and what would a configurable review break?
- Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it?
- Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages?

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
### **Re-reading `research.md` as evidence.** Rejected per the strategy's blocked direction: the second-model pass tests claims against disk, not against the prior model's prose. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Re-reading `research.md` as evidence.** Rejected per the strategy's blocked direction: the second-model pass tests claims against disk, not against the prior model's prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading `research.md` as evidence.** Rejected per the strategy's blocked direction: the second-model pass tests claims against disk, not against the prior model's prose.

### **Re-reading `research.md` to check the claims.** Rejected: the point of a second-model pass is to test the claim against disk, not against the prior model's prose. `research.md` was read once for claim text and not used as evidence. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Re-reading `research.md` to check the claims.** Rejected: the point of a second-model pass is to test the claim against disk, not against the prior model's prose. `research.md` was read once for claim text and not used as evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading `research.md` to check the claims.** Rejected: the point of a second-model pass is to test the claim against disk, not against the prior model's prose. `research.md` was read once for claim text and not used as evidence.

### **Reading `mode-registry.json` for E-3.** Deferred to stay inside the tool budget. The hub-router line covers the same question, so the deferred read costs confidence in a citation, not in the conclusion. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Reading `mode-registry.json` for E-3.** Deferred to stay inside the tool budget. The hub-router line covers the same question, so the deferred read costs confidence in a citation, not in the conclusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `mode-registry.json` for E-3.** Deferred to stay inside the tool budget. The hub-router line covers the same question, so the deferred read costs confidence in a citation, not in the conclusion.

### **Reading the whole 562-line `SKILL.md`.** Not attempted: it would have spent the remaining tool budget and left an artifact unwritten. Recorded as NOT TESTED instead of inferred from the section read. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Reading the whole 562-line `SKILL.md`.** Not attempted: it would have spent the remaining tool budget and left an artifact unwritten. Recorded as NOT TESTED instead of inferred from the section read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the whole 562-line `SKILL.md`.** Not attempted: it would have spent the remaining tool budget and left an artifact unwritten. Recorded as NOT TESTED instead of inferred from the section read.

### **Treating the capped grep as evidence.** Rejected. The 80-match cap returned unrelated `extension` hits before the review anchors, so the grep neither confirms nor refutes rank 2's citations. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: **Treating the capped grep as evidence.** Rejected. The 80-match cap returned unrelated `extension` hits before the review anchors, so the grep neither confirms nor refutes rank 2's citations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the capped grep as evidence.** Rejected. The 80-match cap returned unrelated `extension` hits before the review anchors, so the grep neither confirms nor refutes rank 2's citations.

### **Treating the grep's zero-match as proof of no reader.** Rejected as stated, kept as evidence with a caveat: a zero match proves no file *names* those tokens. A reader that consumes the envelope under a different name would not be caught. The conclusion is safe here only because the envelope's own token is distinctive and the producer's surrounding prose names no alias. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Treating the grep's zero-match as proof of no reader.** Rejected as stated, kept as evidence with a caveat: a zero match proves no file *names* those tokens. A reader that consumes the envelope under a different name would not be caught. The conclusion is safe here only because the envelope's own token is distinctive and the producer's surrounding prose names no alias.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the grep's zero-match as proof of no reader.** Rejected as stated, kept as evidence with a caveat: a zero match proves no file *names* those tokens. A reader that consumes the envelope under a different name would not be caught. The conclusion is safe here only because the envelope's own token is distinctive and the producer's surrounding prose names no alias.

### The `extension` alternation polluted the grep. In a hub with several extension tables, a token search cannot surface the absence of an extension rule. Negative claims need the section boundary, not a match count. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: The `extension` alternation polluted the grep. In a hub with several extension tables, a token search cannot surface the absence of an extension rule. Negative claims need the section boundary, not a match count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `extension` alternation polluted the grep. In a hub with several extension tables, a token search cannot surface the absence of an extension rule. Negative claims need the section boundary, not a match count.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Re-reading `research.md` to check the claims.** Rejected: the point of a second-model pass is to test the claim against disk, not against the prior model's prose. `research.md` was read once for claim text and not used as evidence. (iteration 13)
- **Reading `mode-registry.json` for E-3.** Deferred to stay inside the tool budget. The hub-router line covers the same question, so the deferred read costs confidence in a citation, not in the conclusion. (iteration 13)
- **Treating the grep's zero-match as proof of no reader.** Rejected as stated, kept as evidence with a caveat: a zero match proves no file *names* those tokens. A reader that consumes the envelope under a different name would not be caught. The conclusion is safe here only because the envelope's own token is distinctive and the producer's surrounding prose names no alias. (iteration 13)
- **Re-reading `research.md` as evidence.** Rejected per the strategy's blocked direction: the second-model pass tests claims against disk, not against the prior model's prose. (iteration 14)
- **Reading the whole 562-line `SKILL.md`.** Not attempted: it would have spent the remaining tool budget and left an artifact unwritten. Recorded as NOT TESTED instead of inferred from the section read. (iteration 14)
- **Treating the capped grep as evidence.** Rejected. The 80-match cap returned unrelated `extension` hits before the review anchors, so the grep neither confirms nor refutes rank 2's citations. (iteration 14)
- The `extension` alternation polluted the grep. In a hub with several extension tables, a token search cannot surface the absence of an extension rule. Negative claims need the section boundary, not a match count. (iteration 14)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q5 PR-state efficiency gates: how portable and configurable are the content-hash dedup, the minimum-evidence gate and the depth alias for a repository with no remote, a monorepo or other file naming? (iteration 1)
- Q8 Consumers and contracts: which consumers depend on the status line, the CODE-REVIEW prompt prefix and the shared doctrine, and what would a configurable review break? (iteration 1)
- Q3 Output contract: which parts of the review output contract raise signal and which add ceremony or parse risk (Case line, finding class, scope proof, riskScore, Not checked line, final status line)? (iteration 1)
- Q9 User-authored modes: what does a user's workflow or surface mode (for example a security-only reviewer) need from review, what does review need from it, and which of the eleven integration rows carries it? (iteration 1)
- Q2 UNKNOWN-surface path: what does a review do when the surface is UNKNOWN, how much of the baseline stays useful, and how could a repository declare its own surface evidence? (iteration 1)
- Q6 Review and quality boundary: does review read what the quality gate checked, who reports and who fixes, and how do the shared checklist name and the tie-break order divide the work? (iteration 1)
- Q10 Repo-local policy and floors: where could a repository keep severity overrides, mandatory checks and ignore paths without forking the hub, which floors may no recommendation relax, and how would a later change be proven through both routing stages? (iteration 1)
- Q7 Surface packets: how is surface evidence applied in review, does a workflow diff get the CI rules, and could a surface declare the evidence review should read? (iteration 1)
- Q4 Usefulness evidence: what does review catch, cost and miss in the repository's own benchmark reports, playbook scenarios and changelog? (iteration 1)
- Q3 through Q10 remain open. (iteration 2)
- Q2 is separately marked answered and carried forward as open in the reducer state; that status needs clarification. (iteration 3)
- Q4 through Q10 remain open for the scheduled research angles. (iteration 3)
- Q7 Surface packets. (iteration 4)
- Q8 Consumers and contracts. (iteration 4)
- Q2 UNKNOWN-surface path remains carried forward as open despite the reducer summary separately marking it answered. (iteration 4)
- Q10 Repo-local policy and floors. (iteration 4)
- Q9 User-authored modes. (iteration 4)
- Q6 Review and quality boundary. (iteration 4)
- Q3 Output contract. (iteration 4)
- Q5 PR-state efficiency gates. (iteration 4)
- Q6–Q10 remain unchecked in the strategy. (iteration 5)
- Q2–Q4 are carried forward as open by the dispatch context despite being checked in the strategy; that state discrepancy was not reconciled here. (iteration 5)
- Whether the live review runtime follows the documented gates for a no-remote repository or nonstandard sensitive-path naming remains UNKNOWN; confirming it requires a live scenario run. (iteration 5)
- Q7–Q10 remain scheduled and unanswered. This iteration does not change reducer-owned state. (iteration 6)
- Q2–Q5 remain carried-forward open questions in the dispatch context. Q2–Q4 are also marked answered in the strategy, so that state discrepancy remains unresolved here. (iteration 6)
- The dispatch context still carries Q2–Q5 as open despite the strategy marking those questions answered. This iteration leaves reducer-owned state reconciliation untouched. (iteration 7)
- Q8–Q10 remain scheduled for later iterations. (iteration 7)
- Q10 Repo-local policy and floors remains for iteration 10. (iteration 9)
- Whether a real user-authored mode can route into review and exchange its evidence or findings remains UNKNOWN. Confirm with a route replay through both routing stages and a focused review scenario after such a mode exists. (iteration 9)
- **UNKNOWN:** Does the live review runtime already load any repository-owned policy file? Resolve by tracing the review-mode loader and running a focused scenario with a policy file, including floor-preservation and ignored-path cases. (iteration 10)
- The dispatch context still carries Q2–Q9 as open while the strategy marks earlier questions answered. This iteration leaves that reducer/dispatch state discrepancy untouched. (iteration 10)
- Can a real user-authored surface mode route into review and exchange evidence or findings? **UNKNOWN** (carried from iteration 9). (iteration 11)
- Would replacing the two-value surface label (rank 7) break the report-format consumers named in I-7? **Open**; not re-tested here. (iteration 11)
- The dispatch context still carries Q2–Q9 as open while the strategy marks them answered. That reducer/dispatch state discrepancy remains untouched by this iteration. (iteration 11)
- Does the `ROUTER.md` prose stage independently bundle CI for a path-only workflow prompt? **UNKNOWN** (F5). (iteration 11)
- Does the live review runtime load a repository-owned policy file? **UNKNOWN** (carried from iteration 10). (iteration 11)
- Does the `ROUTER.md` prose stage independently bundle CI for a path-only workflow prompt? (iteration 12)
- Would replacing the two-value surface label (rank 7) break the report-format consumers (iteration 12)
- Does the live review runtime load any repository-owned policy file? **Answered negatively (iteration 12)
- Can a real user-authored surface mode route into review and exchange evidence or findings? (iteration 12)
- **Open (carried from iteration 11).** Would replacing the two-value surface label (rank 7) break the report-format consumers named in I-7? Still not re-tested. (iteration 13)
- **Open (carried from iteration 9).** Can a real user-authored surface mode route into review and exchange evidence or findings? E-3's answer is "there is no schema to exchange", which sharpens the question but does not close it. (iteration 13)
- **Open (new).** Rank 6's recommendation row was not read. Its premise is confirmed; its proposed fix, effort and hub-file list are unexamined by this lens and should be re-read in iteration 14 or 15. (iteration 13)
- **UNKNOWN (carried, narrowed).** Does the live runtime bridge any of the three handoffs informally — does an orchestrator paste the envelope into a review prompt, or does a reviewer read the playbook fields by habit? F1–F3 establish that no *file* declares these readers. A live quality-then-review run would decide it. Carried from iterations 6 and 10. (iteration 13)
- **State discrepancy (carried, untouched).** The dispatch context still lists Q2–Q9 as open while the strategy marks them answered. This iteration does not touch reducer-owned state. (iteration 13)
- **Open (carried from iterations 11 and 12).** Would replacing the two-value surface label (rank 7) break the report-format consumers named in I-7? (iteration 14)
- **NOT TESTED (new, rank 2).** Do `SKILL.md:108`, `:418`, `:426` and `code-quality-standards.md:54` say what rank 2 claims, and does the 562-line file contain any consolidated extension rule? One full-file section read answers both. (iteration 14)
- **NOT TESTED (narrowed, rank 5).** Does `references/pr-state-dedup.md` restate or extend the never-skip taxonomy? (iteration 14)
- **Open (carried from iteration 9).** Can a real user-authored surface mode route into review and exchange evidence or findings? (iteration 14)
- **NOT TESTED (narrowed, rank 4).** Is a no-origin fallback documented outside §9.1 — in `references/pr-state-dedup.md` or in runtime code? A read of that reference, or a live no-remote review, answers it. (iteration 14)
- **UNKNOWN (carried, narrowed).** Does the live runtime bridge any handoff informally? A live quality-then-review run would decide it. (iteration 14)
- **Open (carried from iteration 13).** Rank 6's recommendation row — premise confirmed, row text, effort and hub-file list unread. (iteration 14)
- **Rank 2, narrowed.** `SKILL.md:108` and `code-quality-standards.md:54` were not opened, and the full 562-line file was not read, so "no consolidated extension rule" remains partly untested. `:418` and `:426` are now confirmed. (iteration 15)
- **Rank 5, narrowed.** Does `references/pr-state-dedup.md` restate or extend the never-skip taxonomy? Still NOT TESTED. (iteration 15)
- **Live runtime handoffs.** Does a quality-then-review run pass the advisory envelope, and can a real user-authored surface mode route into review and exchange evidence? Both remain UNKNOWN; only a live scenario decides them. (iteration 15)
- **Rank 4, framework-wide.** Is a no-origin M-1 fallback documented outside §9.1 — in `references/pr-state-dedup.md` or runtime code? Still NOT TESTED. (iteration 15)
- **State discrepancy, carried untouched.** The dispatch context still lists Q2–Q9 as open while the strategy marks them answered. This iteration does not touch reducer-owned state. (iteration 15)
- **Rank 10, narrowed.** D4 scoring, cost columns and the 30-versus-31 playbook count were not reopened. (iteration 15)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### The brief (the same for every iteration)

- Subject: `.skilled/skills/sk-code/sk-code-review/` (`SKILL.md`, `references/`, `assets/`, `scripts/`, `benchmark/reports/`, `manual-testing-playbook/`, `changelog/`). Read it as it stands in this checkout.
- Three goals: repo-agnostic (works in a repository with no `.skilled/` tree), useful (to the reader of its findings), integrated (with `sk-code-quality`, `sk-code-skilled`, `sk-code-ci`, the `@review` and `@deep-review` agents, the shared doctrine, and modes a user adds to the hub).
- Evidence labels: every finding carries exactly one of OBSERVED (you read it in a file, cite it), DERIVED (follows from two or more OBSERVED facts, cite them), INFERRED (judgment or outside knowledge, say what would confirm it). Nothing is fetched from the network, so outside knowledge is INFERRED.
- Source tag format: `[SOURCE: <repo-relative path>:<line>]`, path as it is now. Open the file and check the line says what you claim before citing it.
- Each recommendation names: what to change in sk-code-review, why, its evidence label, effort (S, M, L), risk, ready now or needs a decision, the hub files it would touch, and which sibling-mode or external-user-mode integration it affects. A recommendation that changes routing names both stages: `hub-router.json` and `ROUTER.md`.
- The final synthesis has four sections: Repo-Agnostic Findings, Usefulness Findings, Integration Findings (with an External-User Modes subsection) and Ranked Recommendations.

### Angle schedule (frozen by plan.md, goal decision D1)

Paths relative to `.skilled/skills/sk-code/` unless stated. Iteration N takes angle N.

| Iter | Angle | Starting sources |
|------|-------|------------------|
| 1 | Repo-bound inventory (Q1) | `sk-code-review/SKILL.md` lines 223, 472, 502 and 530 to 539, `sk-code-review/references/`, `sk-code-review/assets/`, `sk-code-review/scripts/README.md` |
| 2 | UNKNOWN-surface path (Q2) | `sk-code-review/SKILL.md` lines 52 to 62 and 223 to 241, `shared/references/stack-detection.md` lines 36 and 89, `ROUTER.md` section 8 |
| 3 | Output contract (Q3) | `sk-code-review/SKILL.md` lines 340 to 409, `sk-code-review/references/review-core.md`, `sk-code-review/scripts/check-review-findings.js`, `sk-code-review/scripts/check-review-final-line.js`, `sk-code-review/scripts/review-output-fixture/` |
| 4 | Usefulness evidence (Q4) | `sk-code-review/benchmark/reports/`, `sk-code-review/manual-testing-playbook/`, `sk-code-review/changelog/` |
| 5 | PR-state efficiency gates (Q5) | `sk-code-review/SKILL.md` lines 488 to 558, `sk-code-review/references/pr-state-dedup.md` |
| 6 | Review and quality boundary (Q6) | `sk-code-quality/SKILL.md`, `sk-code-review/assets/code-quality-checklist.md`, `ROUTER.md` line 292, `hub-router.json` line 7 |
| 7 | Surface packets (Q7) | `sk-code-review/SKILL.md` lines 104 to 111, `sk-code-skilled/SKILL.md`, `sk-code-ci/SKILL.md`, `mode-registry.json` line 18 |
| 8 | Consumers and contracts (Q8) | `.skilled/agents/review.md`, `.skilled/agents/deep-review.md`, `sk-code-review/SKILL.md` lines 470 to 474, `sk-code-review/references/review-core.md` |
| 9 | User-authored modes (Q9) | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` sections 6 and 7, `.skilled/repo-rules/skill-hub-routing.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json` |
| 10 | Repo-local policy and floors (Q10) | `specs/sk-code/014-code-modes-research/../013-private-surface-skills/spec.md` (that is `specs/sk-code/013-private-surface-skills/spec.md`), `sk-code-review/SKILL.md` section 4, `sk-code-review/scripts/check-rule-copies.js` |

### Bounded Context Snapshot

- Source pointers: the subject packet and hub routing files listed above. The line numbers in the schedule were written by the packet author and may have drifted, so verify them.
- Integration points: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json` (two routing stages), the `@review` and `@deep-review` agents.
- Constraints: read only. resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stop policy max-iterations)
- Executors: odd iterations `cli-codex` with `gpt-6-luna`, reasoning `max`, service tier `fast`; even iterations `cli-pi` with `llmgateway/deepseek-v4.1-flash-1017`, thinking `max` (parent decision D4)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-10-25T08:49:26Z
