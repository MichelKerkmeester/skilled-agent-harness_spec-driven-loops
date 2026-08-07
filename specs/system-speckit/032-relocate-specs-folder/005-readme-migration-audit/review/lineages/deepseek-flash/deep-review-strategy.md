# Deep Review Strategy - Session Tracking

## 1. TOPIC

Review: README migration audit (deepseek-flash lineage)
Review target: specs/system-speckit/032-relocate-specs-folder/005-readme-migration-audit (spec-folder)
Audit of every non-worktree README (incl. root README.md) for content stale after the specs-root topology flip (`specs/` canonical, `.opencode/specs -> ../specs` compat symlink).

---

## 2. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-flash-1786124587346-0du5cu, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-08-07T19:46:00Z
- Stop policy: max-iterations (convergence is telemetry until iteration 10)
<!-- MACHINE-OWNED: END -->

---

## 3. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [x] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [x] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [x] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [x] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

---

## 4. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness | CONDITIONAL | 1 | 21 READMEs teach/use legacy .opencode/specs root post-flip; F001/F002 P1 |
| D2 Security | CONDITIONAL | 2 | F013: integrity guard scoped to legacy alias only |
| D3 Traceability | CONDITIONAL | 3 | F014: REQ-003 dual-executor unmet; F015/F016 census & cross-ref drift |
| D4 Maintainability | CONDITIONAL | 4 | F017: drift-marker symlink pathspec blind spot; F018 doc-family inconsistency |
| Broadened (5-10) | PASS | 5-10 | Negative baseline (F019), historical classification (F020), completeness + adversarial replay |
<!-- MACHINE-OWNED: END -->

---

## 5. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 5 active (F001, F002, F013, F014, F017)
- **P2 (Minor):** 15 active (F003-F012, F015, F016, F018, F019, F020)
- **Delta this iteration:** +0 P0, +0 P1, +0 P2
<!-- MACHINE-OWNED: END -->

---

## 6. NON-GOALS

- Not a general documentation-quality pass (typos, formatting, unrelated broken links).
- Not auditing non-README docs (`references/*.md`, `SKILL.md` bodies, `AGENTS.md`, `CLAUDE.md`, `PUBLIC-RELEASE.md`).
- Not auditing `.worktrees/*` (duplicated checkouts).
- Not auditing historical spec-doc content under `specs/**` that legitimately describes the pre-flip topology as a historical record.

---

## 7. STOP CONDITIONS

- maxIterations (10) reached — hard stop, then synthesize.
- Convergence votes are telemetry under max-iterations policy.

---

## 8. WHAT WORKED

- Grounding every finding against live topology (`readlink .opencode/specs -> ../specs`) before recording (iteration 1).
- Git pathspec asymmetry test (`git diff-tree -- .opencode/specs` = 0 vs `-- specs` = 23) to confirm the drift-marker blind spot (iteration 4).
- Lexical Node resolution test to prove the guard misses canonical-root imports (iteration 2).
- Full 21-file completeness sweep mapping every hit to a finding (iteration 7).

---

## 9. WHAT FAILED

- None materially. `-g 'specs/**'` glob on rg behaved unexpectedly (matched non-specs paths) — avoided by `-g '!specs/**'` exclusions (iteration 3).

---

## 10. EXHAUSTED APPROACHES (do not retry)

### Literal-string scan -- BLOCKED (iterations 1, 3, 7)
- What was tried: repo-wide rg for `.opencode/specs` across READMEs with multiple exclusion sets.
- Why blocked: All 21 literal-hit README.md files fully covered by F001-F020; further string scans yield no new files.
- Do NOT retry: further literal `.opencode/specs` greps on this lineage.

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- Test-fixture README (durability-leak) — intentional negative-test content, not live doc (iteration 1).
- 5 of 6 specs/** README hits — historical z_archive/output artifacts, out of scope (iteration 6).
- Root README directory trees — already canonical `specs/` (iterations 6, 9).
- scripts/config, scripts/graph, scripts READMEs — canonical forms, no finding (iteration 9).
- Secrets exposure across 23 hit READMEs — only placeholders (`your-key-here`) found (iteration 2).

---

## 12. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
Synthesis — compile review-report.md; verdict CONDITIONAL (5 P1, 15 P2, 0 P0).
<!-- MACHINE-OWNED: END -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 21 non-specs literal-hit README.md + root README + representative code (config.ts, check-no-spec-imports.cjs, memory-drift-marker.sh, compiled-route-sync.cjs).
- Behavior claims verified: `specs/` canonical, `.opencode/specs -> ../specs` symlink (readlink confirmed); config.ts `getSpecsDirectories()` returns `['specs', '.opencode/specs']`.
- Reuse/conventions: AGENTS.md:259 labels legacy `.opencode/specs` symlink correctly (phase-8 fix) — the model for fixes; templates/README.md already uses canonical `specs/`.
- Review risks/gaps: 753+ READMEs too large to read exhaustively; prioritization via literal-hit list + targeted sections.
- resource-map.md not present. Skipping coverage gate.

---

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | fail | 1-10 | README topology claims contradict shipped layout; guard + drift-marker scoped to legacy root |
| `checklist_evidence` | core | notApplicable | 1-10 | No checklist.md exists (Level 1 packet) |
| `skill_agent` | overlay | notApplicable | init | Target is spec-folder, not a skill |
| `agent_cross_runtime` | overlay | notApplicable | init | Target is spec-folder, not an agent |
| `feature_catalog_code` | overlay | notApplicable | init | No feature-catalog claims in scope |
| `playbook_capability` | overlay | notApplicable | init | No playbook in scope |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| README.md | D1, D3, D4 | 7 | 1 P2 (F010) | complete |
| system-spec-kit/README.md | D1, D4 | 7 | 1 P1 (F001), 1 P2 (F018) | complete |
| system-spec-kit/scripts/core/README.md | D1 | 7 | 1 P1 (F002) | complete |
| system-spec-kit/scripts/sweep/README.md | D1 | 7 | 1 P2 (F003) | complete |
| system-spec-kit/scripts/kpi/README.md | D1 | 7 | 1 P2 (F004) | complete |
| system-spec-kit/mcp-server/README.md | D1 | 7 | 1 P2 (F005) | complete |
| system-spec-kit/mcp-server/benchmarks/README.md | D1 | 7 | 1 P2 (F005) | complete |
| system-spec-kit/mcp-server/database/migrations/README.md | D1 | 7 | 1 P2 (F011) | complete |
| system-spec-kit/mcp-server/hooks/cursor/README.md | D1 | 7 | 1 P2 (F011) | complete |
| system-spec-kit/mcp-server/hooks/devin/README.md | D1 | 7 | 1 P2 (F011) | complete |
| system-spec-kit/scripts/git-hooks/README.md | D1, D4 | 7 | 2 P2 (F009) | complete |
| bin/README.md | D2 | 7 | 1 P1 (F013) | complete |
| bin/lib/README.md | D1 | 7 | 1 P2 (F008) | complete |
| scripts/git-hooks/README.md | D1, D4 | 7 | 2 P2 (F009) | complete |
| scripts/git-hooks/lib/README.md | D1, D4 | 7 | 2 P2 (F009) | complete |
| sk-design-md-generator/README.md | D1 | 7 | 3 P2 (F006) | complete |
| sk-design-md-generator/backend/README.md | D1 | 7 | 7 P2 (F006) | complete |
| sk-design/styles/scripts/README.md | D1 | 7 | 1 P2 (F011) | complete |
| sk-doc/sk-create-benchmark/shared/README.md | D1 | 7 | 1 P2 (F007) | complete |
| deep-alignment/conformance-benchmark/README.md | D1 | 7 | 2 P2 (F011) | complete |
| memory-drift-marker.sh | D4 | 10 | 1 P1 (F017) | complete |
| check-no-spec-imports.cjs | D2 | 10 | 1 P1 (F013) | complete |
| config.ts | D1, D4 | 10 | 1 P1 (F002) | complete |
| spec.md / tasks.md / plan.md | D3 | 7 | 1 P1 (F014), 3 P2 (F015, F016, F020) | complete |
| orchestration-status.log | D3 | 7 | 1 P1 (F014) | complete |
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 10
- P2 (Suggestions): 30
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `scripts/config/README.md`, `scripts/graph/README.md`, `scripts/README.md` — canonical, no finding. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `scripts/config/README.md`, `scripts/graph/README.md`, `scripts/README.md` — canonical, no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `scripts/config/README.md`, `scripts/graph/README.md`, `scripts/README.md` — canonical, no finding.

### 5 of 6 `specs/**` README hits are in `z_archive` or `output/` artifact trees — genuinely historical, out of scope, no finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: 5 of 6 `specs/**` README hits are in `z_archive` or `output/` artifact trees — genuinely historical, out of scope, no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 5 of 6 `specs/**` README hits are in `z_archive` or `output/` artifact trees — genuinely historical, out of scope, no finding.

### 6 README hits under `specs/**` (z_archive, prompts, output artifacts) — historical spec-doc content explicitly out of scope per spec.md §3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: 6 README hits under `specs/**` (z_archive, prompts, output artifacts) — historical spec-doc content explicitly out of scope per spec.md §3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 6 README hits under `specs/**` (z_archive, prompts, output artifacts) — historical spec-doc content explicitly out of scope per spec.md §3.

### AGENTS.md — out of scope (non-README) and already correctly fixed in phase 8; no finding. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: AGENTS.md — out of scope (non-README) and already correctly fixed in phase 8; no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: AGENTS.md — out of scope (non-README) and already correctly fixed in phase 8; no finding.

### Deep relative links in mcp-server hooks cursor/devin READMEs resolve correctly through the symlink to the canonical packet (`realpath` confirmed both target files exist) — no broken trust boundary. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Deep relative links in mcp-server hooks cursor/devin READMEs resolve correctly through the symlink to the canonical packet (`realpath` confirmed both target files exist) — no broken trust boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deep relative links in mcp-server hooks cursor/devin READMEs resolve correctly through the symlink to the canonical packet (`realpath` confirmed both target files exist) — no broken trust boundary.

### deep-alignment conformance-benchmark README:34 "Source specification: .opencode/specs/..." — pointer target EXISTS at canonical specs/system-deep-loop/035-command-surface-benchmark/ (verified). Stale alias usage, not a broken link — already covered by F011. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: deep-alignment conformance-benchmark README:34 "Source specification: .opencode/specs/..." — pointer target EXISTS at canonical specs/system-deep-loop/035-command-surface-benchmark/ (verified). Stale alias usage, not a broken link — already covered by F011.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: deep-alignment conformance-benchmark README:34 "Source specification: .opencode/specs/..." — pointer target EXISTS at canonical specs/system-deep-loop/035-command-surface-benchmark/ (verified). Stale alias usage, not a broken link — already covered by F011.

### F001/F018 generic placeholders (`specs/[project]/NNN-feature/`) — illustrative paths, no target needed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: F001/F018 generic placeholders (`specs/[project]/NNN-feature/`) — illustrative paths, no target needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: F001/F018 generic placeholders (`specs/[project]/NNN-feature/`) — illustrative paths, no target needed.

### mcp-server hooks README (index) contains no specs-root reference — clean. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: mcp-server hooks README (index) contains no specs-root reference — clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: mcp-server hooks README (index) contains no specs-root reference — clean.

### No finding requires creating a canonical target that does not exist. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No finding requires creating a canonical target that does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No finding requires creating a canonical target that does not exist.

### No P0 upgrade warranted (no demonstrated data loss, breach, or spec-contradiction blocking release). -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No P0 upgrade warranted (no demonstrated data loss, breach, or spec-contradiction blocking release).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P0 upgrade warranted (no demonstrated data loss, breach, or spec-contradiction blocking release).

### No P1 downgrade justified. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No P1 downgrade justified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No P1 downgrade justified.

### No README hit line is uncaptured; all 21 files map to an existing finding or an explicit ruled-out (fixture). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No README hit line is uncaptured; all 21 files map to an existing finding or an explicit ruled-out (fixture).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No README hit line is uncaptured; all 21 files map to an existing finding or an explicit ruled-out (fixture).

### No README pair describes drift-marker behavior contradictorily *within* the same doc; the issue is cross-doc root usage (F018) and functional coverage (F017). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No README pair describes drift-marker behavior contradictorily *within* the same doc; the issue is cross-doc root usage (F018) and functional coverage (F017).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No README pair describes drift-marker behavior contradictorily *within* the same doc; the issue is cross-doc root usage (F018) and functional coverage (F017).

### None. -- BLOCKED (iteration 10, 10 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### Path-escape: sk-design `--output .opencode/specs/<track>/<packet>/output` writes via symlink into `specs/` — functionally contained, no escape (a P2 doc-staleness already captured as F006, not a security issue). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Path-escape: sk-design `--output .opencode/specs/<track>/<packet>/output` writes via symlink into `specs/` — functionally contained, no escape (a P2 doc-staleness already captured as F006, not a security issue).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Path-escape: sk-design `--output .opencode/specs/<track>/<packet>/output` writes via symlink into `specs/` — functionally contained, no escape (a P2 doc-staleness already captured as F006, not a security issue).

### REQ-001 (root README reference): still present at README.md:1303 — captured as F010, disposition pending fix/deferral. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-001 (root README reference): still present at README.md:1303 — captured as F010, disposition pending fix/deferral.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-001 (root README reference): still present at README.md:1303 — captured as F010, disposition pending fix/deferral.

### REQ-004 prose-only staleness: no non-literal prose/diagram staleness found in the deep hunt beyond the literal-hit set; will note explicitly in synthesis (REQ-004 allows "explicitly noted if no such finding exists"). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: REQ-004 prose-only staleness: no non-literal prose/diagram staleness found in the deep hunt beyond the literal-hit set; will note explicitly in synthesis (REQ-004 allows "explicitly noted if no such finding exists").
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: REQ-004 prose-only staleness: no non-literal prose/diagram staleness found in the deep hunt beyond the literal-hit set; will note explicitly in synthesis (REQ-004 allows "explicitly noted if no such finding exists").

### Root README directory trees (lines 108, 219, 249) and Spec Folder Structure diagram use canonical `specs/` — correct, no finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Root README directory trees (lines 108, 219, 249) and Spec Folder Structure diagram use canonical `specs/` — correct, no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Root README directory trees (lines 108, 219, 249) and Spec Folder Structure diagram use canonical `specs/` — correct, no finding.

### Secrets exposure: scanned all 23 non-specs hit READMEs for api_key/secret/token/password patterns — only placeholder values (`your-key-here`) and env-var names documented (VOYAGE_API_KEY, OPENAI_API_KEY, HF_EMBED_AUTH_TOKEN as config docs, not live credentials). No exposure. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secrets exposure: scanned all 23 non-specs hit READMEs for api_key/secret/token/password patterns — only placeholder values (`your-key-here`) and env-var names documented (VOYAGE_API_KEY, OPENAI_API_KEY, HF_EMBED_AUTH_TOKEN as config docs, not live credentials). No exposure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secrets exposure: scanned all 23 non-specs hit READMEs for api_key/secret/token/password patterns — only placeholder values (`your-key-here`) and env-var names documented (VOYAGE_API_KEY, OPENAI_API_KEY, HF_EMBED_AUTH_TOKEN as config docs, not live credentials). No exposure.

### sk-create-benchmark shared README:23 — same class, covered by F007. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: sk-create-benchmark shared README:23 — same class, covered by F007.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-create-benchmark shared README:23 — same class, covered by F007.

### sk-doc `output/README.md:110` is a rendered sample prompt (pre-flip, uses `opencode-go/deepseek-v4-pro`) — output artifact, out of scope. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: sk-doc `output/README.md:110` is a rendered sample prompt (pre-flip, uses `opencode-go/deepseek-v4-pro`) — output artifact, out of scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc `output/README.md:110` is a rendered sample prompt (pre-flip, uses `opencode-go/deepseek-v4-pro`) — output artifact, out of scope.

### sk-doc durability-leak fixture README:7 — intentional negative-test fixture, ruled out in iteration 1. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: sk-doc durability-leak fixture README:7 — intentional negative-test fixture, ruled out in iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: sk-doc durability-leak fixture README:7 — intentional negative-test fixture, ruled out in iteration 1.

### styles/scripts README:112 — pointer to spec packet, covered by F011. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: styles/scripts README:112 — pointer to spec packet, covered by F011.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: styles/scripts README:112 — pointer to spec packet, covered by F011.

### Test-fixture README `.opencode/skills/sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md:7` names `.opencode/specs/temporary-note.md` — intentional negative-test fixture content, not live documentation. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Test-fixture README `.opencode/skills/sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md:7` names `.opencode/specs/temporary-note.md` — intentional negative-test fixture content, not live documentation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Test-fixture README `.opencode/skills/sk-doc/scripts/tests/code-folder/negative/durability-leak/README.md:7` names `.opencode/specs/temporary-note.md` — intentional negative-test fixture content, not live documentation.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis: compile review-report.md from 10 iterations, derive verdict, reconcile findings.

<!-- /ANCHOR:next-focus -->
