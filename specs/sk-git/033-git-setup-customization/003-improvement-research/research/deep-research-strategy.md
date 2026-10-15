---
title: Deep Research Strategy
description: Session tracking for the /doctor:git setup improvement research.
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC
How can the read-only /doctor:git setup check and the /doctor:git command family be improved further? Study the shipped work: .skilled/commands/doctor/scripts/git-setup-check.cjs and its test, .skilled/commands/doctor/git.md, _routes.yaml, assets/doctor-git-setup.yaml, assets/doctor-git-presentation.txt, the sk-git skill (.skilled/skills/sk-git/SKILL.md, scripts/, hard-rules.json, feature-catalog/workflow-playbooks/doctor-git-settings.md, manual-testing-playbook DOC-384) and the packets specs/sk-git/033-git-setup-customization (001 research, 002 build) and specs/sk-git/034-standards-template-round-trip. Find concrete improvements: checks still missing, failure modes the battery reads as healthy, repairs that could be wrong, untrusted-repository vectors not yet closed (any git or helper path a repository config can steer), drift between docs and behavior, test gaps, and the deferred items (a per-repository hard-rules.json overlay, the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests). Rank each with impact and effort and cite path:line for every claim. End with proposed implementation phases.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which sk-git settings or failure modes does git-setup-check.cjs still miss, or read as PASS/SKIP when the setting is actually broken (false-healthy readings)?
- [x] Q2: Which untrusted-repository vectors remain open, meaning any git invocation, helper path, hook path, config key or environment the inspected repository can steer while the battery runs?
- [x] Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?
- [x] Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded?
- [ ] Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests (root cause and fix)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any code, skill, command or doc outside this spec folder (research only).
- Re-auditing the 004-final-deep-review lane, which runs in parallel.
- Redesigning sk-git hooks that /doctor:git does not read.

---

## 5. STOP CONDITIONS
- All five key questions answered with path:line evidence and a ranked impact/effort list.
- Max 5 iterations reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which sk-git settings or failure modes does git-setup-check.cjs still miss, or read as PASS/SKIP when the setting is actually broken (false-healthy readings)?
- Q2: Which untrusted-repository vectors remain open, meaning any git invocation, helper path, hook path, config key or environment the inspected repository can steer while the battery runs?
- Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?
- Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- tracing each repair literal into its target workflow exposed mismatches between diagnosis, command behavior, and actual mutation. (iteration 4)
- reading the workflow and producer tests established which local artifacts are relevant without risking a test that might write into the repository. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- none; source reads were sufficient for this static audit. (iteration 4)
- both gh run list calls failed at api.github.com, leaving no run identifiers and no current logs. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### No repair command or test suite was executed in this research iteration. The Gate Inputs fix was checked statically against its test assertions and the recorded packet result. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No repair command or test suite was executed in this research iteration. The Gate Inputs fix was checked statically against its test assertions and the recorded packet result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No repair command or test suite was executed in this research iteration. The Gate Inputs fix was checked statically against its test assertions and the recorded packet result.

### The AI-tool registration repair's section-3 README pointer is specific enough to locate the runtime wiring, so it is not counted as a repair defect [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The AI-tool registration repair's section-3 README pointer is specific enough to locate the runtime wiring, so it is not counted as a repair defect [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The AI-tool registration repair's section-3 README pointer is specific enough to locate the runtime wiring, so it is not counted as a repair defect [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77].

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- The AI-tool registration repair's section-3 README pointer is specific enough to locate the runtime wiring, so it is not counted as a repair defect [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77]. (iteration 4)
- No repair command or test suite was executed in this research iteration. The Gate Inputs fix was checked statically against its test assertions and the recorded packet result. (iteration 5)

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
- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests? (iteration 1)
- Q4: Where do git.md, _routes.yaml, doctor-git-setup.yaml, doctor-git-presentation.txt, the sk-git SKILL.md, feature catalog and DOC-384 drift from the script's actual behavior, and which test gaps leave that behavior unguarded? (iteration 1)
- Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix? (iteration 1)
- Q4: Where do the command docs and skill references drift from script behavior, and which test gaps leave it unguarded? (iteration 2)
- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests? The two identified repository-wide sk-doc cases are statically traced, but the remaining historical failure names and present run status need a successful GitHub API lookup. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests? The two identified repository-wide sk-doc cases are statically traced, but the remaining historical failure names and present run status need a successful GitHub API lookup.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work (continuity ladder):
- 001-deep-research (specs/sk-git/033-git-setup-customization/001-deep-research/research/research.md) produced the design research that led to the setup check.
- 002-doctor-git-setup shipped git-setup-check.cjs (eleven checks: install, hook links, hook trust, saved gate switches, commit/PR/branch contract, remote allowlist, worktree base and provision list, Commit-Id policy, advisory rules, suppression flags, active AI tool advisory registration). It loads helpers from its own install root to resist planted code. Tests: 11 of 11 pass. Three build defects were fixed (installer --status ran repo validator; release branches misreported as refused; wrong repair named for ai-tool-hooks and Commit-Id).
- Known limitations recorded in 002: two pre-existing git-standards.test.cjs failures (owned by the /doctor:git standards packet, see specs/sk-git/034-standards-template-round-trip), advisory check reads one AI tool only, no per-repository hard-rules.json overlay.
- A parallel /deep:review runs in specs/sk-git/033-git-setup-customization/004-final-deep-review; do not touch it.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot
- Source pointers: .skilled/commands/doctor/scripts/git-setup-check.cjs, .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs, .skilled/commands/doctor/git.md, .skilled/commands/doctor/_routes.yaml, .skilled/commands/doctor/assets/doctor-git-setup.yaml, .skilled/commands/doctor/assets/doctor-git-presentation.txt, .skilled/skills/sk-git/SKILL.md, .skilled/skills/sk-git/scripts/, .skilled/skills/sk-git/hard-rules.json (verify path), .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md, sk-git manual-testing-playbook DOC-384.
- Integration points: install-git-hooks.sh, git hook scripts, advisory hook registration per AI runtime, CI workflows for Gate Inputs hook tests and sk-doc Script Tests.
- Constraints: research only; cite path:line for every claim.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Executor: cli-codex gpt-6-luna, reasoning max, service tier fast
- Current generation: 1
- Started: 2026-10-15T13:34:40Z
