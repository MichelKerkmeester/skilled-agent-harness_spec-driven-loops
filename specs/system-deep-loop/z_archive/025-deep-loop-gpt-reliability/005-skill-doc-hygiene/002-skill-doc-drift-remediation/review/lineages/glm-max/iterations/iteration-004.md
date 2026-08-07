# Iteration 4: Completeness / Maintainability — residual drift + verification reproducibility

## Focus
Maintainability/completeness dimension. Three sub-targets: (1) residual `.toml` drift beyond the stated scope (is the sweep complete, or did the phase miss living instances the way it found 13 extra in T013?); (2) the deep-improvement `08` fixture `.toml` reference — is the phase's deferral rationale sound?; (3) reproducibility of every verification command cited in `checklist.md` (an auditor must be able to re-run them).

## Scorecard
- Dimensions covered: maintainability (full)
- Files reviewed: 9 (checklist.md; deep-improvement fixture setup-cp-sandbox.sh; test-fixtures/060-stress-test check; check-comment-hygiene.sh locations; deep-research/deep-review/deep-ai-council playbooks; repo-wide `.toml` scan)
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.17 (one new P2 weighted 1.0 / ~6.0 cumulative)

## Findings

### P2, Suggestion
- **F002**: CHK-010 verification command is non-reproducible — wrong interpreter and ambiguous path, `.opencode/specs/.../015-skill-doc-drift-remediation/checklist.md:59`. CHK-010 states: "`python3 check-comment-hygiene.sh` exit 0". This cannot reproduce: (a) `python3` is the wrong interpreter — `check-comment-hygiene.sh` is a POSIX **shell** script (`.sh`), so `python3` on it errors rather than exiting 0; (b) the path is ambiguous — no script exists at the implied `system-spec-kit/scripts/spec/` location; the actual scripts live at `.opencode/skills/system-spec-kit/scripts/rules/check-comment-hygiene.sh` and `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`. **Substance holds**: running the real script on `scan-integration.cjs` returned exit 0 (no comment-hygiene violation exists). So this is a *documentation-reproducibility* defect, not an actual hygiene violation — but a downstream CI/audit consumer re-running CHK-010's literal command would fail and lose trust in the checklist. [DIMENSION: maintainability]

## Deferred Items (not active findings — phase correctly documented these)
- **D001**: `deep-improvement/manual_testing_playbook/agent-discipline-stress-tests/setup-cp-sandbox.sh:92` references `${FIXTURE_ROOT}/.opencode/agents/cp-improve-target.toml` (a `.toml` fixture) — but the phase's limitation #1 is **accurate**: the entire `test-fixtures/060-stress-test/` directory is MISSING (verified), so the script fails on the `.md`/`.claude` fixtures at lines 90–91 before ever reaching `.toml`. Pre-existing, broader than the TOML removal, correctly out of scope. Deferred per phase's own Known Limitations.
- **D002**: Minor deferral-consistency note — the phase fixed identical `.toml` playbook refs in deep-research/deep-review (T013) but deferred deep-improvement's. Defensible because fixing only the `.toml` line would not make D001's script functional (whole fixture dir missing). Noted for a future fixture-restoration task, not blocking.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | REQ mapping iteration 3 | all REQs substantively green |
| checklist_evidence | partial | hard | checklist.md:59 (CHK-010) | F002: one cited command non-reproducible; rest verified |

## Assessment
- New findings ratio: 0.17 — low-yield, consistent with a fix-phase review approaching saturation on the maintainability axis. The residual-drift sweep is essentially complete: all repo-wide `.toml` hits outside the stated scope are historical specs (`z_archive`, iteration files) or retired skills (`cli-codex-retired`), correctly preserved per spec NFR; project-config `.toml` (Cargo.toml, pyproject.toml) are unrelated to agent mirrors.
- Dimensions addressed: maintainability. All four dimensions now have ≥1 iteration of coverage.
- Novelty justification: F002 is a genuinely new class (verification reproducibility) not covered by phase 014's clusters. The T013 extension is confirmed holding (zero `.toml` in the three playbooks the phase extended its sweep to).

## Ruled Out
- "Phase missed living `.toml` drift": disproven — repo-wide scan shows only historical/retired/project-config `.toml`, all correctly out of scope. [evidence: rg across .opencode/.claude]
- "CHK-010 hides an actual hygiene violation": disproven — real script exits 0 on scan-integration.cjs. [evidence: bash check-comment-hygiene.sh ... exit 0]

## Dead Ends
- Attempting `npx vitest run --root .../deep-improvement` from the repo root finds no tests (config+tests live under `scripts/`); the correct invocation is `npx vitest run` from the `scripts/` cwd. Not a finding — the phase's 411/413 claim reproduces exactly under the correct cwd (verified iteration 5 will confirm).

## Recommended Next Focus
Iteration 5: adversarial replay of F001 (does it survive scrutiny as P1, or downgrade to P2?) + confirm vitest reproducibility under correct cwd + final breadth pass for any P0 hiding in the cluster-6 routing contract. With maxIterations=5 and stopPolicy=max-iterations, this is the terminal evidence pass before synthesis.

Review verdict: CONDITIONAL
