# Deep Research Strategy - GLM Lineage

## 2. TOPIC
Implications of relocating the root `.opencode/specs` folder to a top-level `specs/` directory outside `.opencode`: spec-kit tooling path assumptions, cross-runtime mirror behavior, git/.gitignore interactions, Spec Kit Memory MCP server path resolution, and the scale/risk of repointing in-repo path references.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which spec-kit tooling scripts hardcode the `.opencode/specs` path and would break or need patching if `specs/` moved to repo root? (track: tooling) — ANSWERED iter 1; carried-forward: discovery caller for backfill-graph-metadata, source generate-description.js
- [x] Q2: How do the cross-runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`, `.pi`) resolve or mirror the specs folder, and which would need their own `specs` symlink or path update? (track: cross-runtime) — ANSWERED iter 5: NO mirror carries a specs symlink; sync-runtime-mirrors.cjs has no specs logic; only 2 prose refs; back-symlink covers mirrors automatically; resolves spec §7 (no mirror needs its own specs symlink)
- [x] Q3: What are the git/.gitignore interactions: the existing root `specs` symlink, the `!specs` and `!.opencode/` negation rules, and `~/.gitignore_global`'s `/specs` and `/.opencode/` ignores for downstream symlinked repos? (track: git) — ANSWERED iter 3: specs is a tracked symlink (mode 120000); negations form-agnostic; global ignore path-keyed for downstream repos; git layer does NOT force relocation decision — the in-repo reference scale does (F3.6)
- [x] Q4: How does the Spec Kit Memory MCP server resolve the specs path, and would relocation break its path resolution or require config changes? (track: memory-mcp) — ANSWERED iter 2: LARGELY relocation-ready (dual-root scan L1306-1307, dual-root classifier L136, cwd-relative config); 2 narrow hardcoded literals remain (L1979 medium, L242 low)
- [x] Q5: What is the scale and risk of repointing in-repo path references to `.opencode/specs` (count, distribution, blast radius)? (track: scale-risk) — ANSWERED iter 4: 15,020 files / 476,239 lines; 99.6% are specs self-refs; back-symlink `.opencode/specs -> ../specs` neutralizes 99.6%; real work = symlink flip + ~5-7 hardcoded literal patches; Option A/B converge (F4.5)
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do NOT move, symlink, or reconfigure any real path during this research phase.
- Do NOT decide the migration approach (literal rename vs. keep `.opencode/specs` as the real tree with `specs/` as a convenience symlink) — that is a later-phase decision informed by these findings.
- Do NOT implement fixes; report findings only.
- Do NOT modify files outside the lineage artifact_dir.

---

## 5. STOP CONDITIONS
- newInfoRatio <= 0.05 for the convergence gate (after minIterations=3).
- All 5 key questions answered with source citations.
- maxIterations (10) reached.
- 3 consecutive stuck/timeout iterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Targeted grep + line-keyed reads on the four named scripts (iter 1): produced concrete file:line evidence for create.sh, validate.sh, backfill-graph-metadata.ts, generate-description.js quickly.
- Distinguishing "validation accepts both roots" vs "default/strip hardcoded" for create.sh (iter 1): reframed Q1 from blanket-hardcoded to a small literal set.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Populated as iterations eliminate approaches]
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
[Populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
COMPLETE — all 5 key questions answered (stop: all_questions_answered). Synthesis written to `research.md`; convergence report in `convergence-report.md`. Recommendation: PROCEED-WITH-CAVEATS (flip architecture + patch ~5-7 literals). Carried-forward items for a later phase: Q1-discovery-caller, Q1-source-generate-description, downstream-repo verification, spec-gate-core.mjs:852.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot
- Source pointers: `.opencode/skills/system-spec-kit/` (tooling), `.opencode/skills/system-spec-kit/scripts/` (validate.sh, create.sh, generate-description.js, backfill-graph-metadata.js), `.gitignore` (root), `~/.gitignore_global`, root `specs` symlink, `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.pi/` mirror dirs, Spec Kit Memory MCP server config.
- Reuse candidates: existing grep/glob tooling for path-reference enumeration; the spec-kit scripts themselves are the subject, not reuse.
- Integration points: every runtime mirror that resolves specs; the MCP server path resolver; git tracking of the symlinked tree.
- Constraints and risks: research-only — no mutations; large in-repo reference count may make exhaustive enumeration expensive (sample + estimate); downstream symlinked repos inherit `~/.gitignore_global` rules.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (newInfoRatio)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-08-06T11:18:00+02:00
