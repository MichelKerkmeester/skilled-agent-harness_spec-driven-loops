# Deep Research Strategy — glm52-max lineage

## 2. TOPIC
Concrete, prioritized improvements to the `create-command` authoring canon (SKILL.md + `command_router_template.md` + `command_template.md`) and to every OpenCode command that uses those templates and routing logic (`create/*`, `design/*`, `speckit/*`, `memory/*`, `doctor/*`, `deep/*`), grounded in the 066 command-surface benchmark findings and the create-benchmark completeness work. Five research questions (RQ1–RQ5). Output: per-finding evidence (file:line) + candidate delta (target path + acceptance criterion). Research/synthesis only; no implementation, no shipped-runtime edits.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] RQ1 — Canon completeness: which gaps in the create-command canon (6-section router vocabulary, asset triads for workflow-YAML vs direct-dispatch families, template shape) let non-conformant commands author "correctly" against an incomplete rule?
- [ ] RQ2 — Per-family conformance: which divergences across create/design/speckit/memory/doctor/deep are recurring canon gaps a canon change would close wholesale vs one-off authoring errors?
- [ ] RQ3 — Validator + benchmark coverage: which real command-surface defects do `validate_document.py --type command` + the 066 benchmark fail to catch, and what deterministic checks would catch them?
- [ ] RQ4 — Router/dispatch logic: argument-hint grammar, `$ARGUMENTS`/`$1..$N` handling, `:auto`/`:confirm` resolution, dual-runtime opencode/codex/claude parity.
- [ ] RQ5 — Authoring ergonomics: template/logic changes that reduce recurring authoring failures (fat monoliths, missing loader-gating frontmatter, prose drift).
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change to shipped canon or commands (deltas only seed follow-on packets).
- Touching shipped runtime.
- Memory-DB reindex (deferred per operator directive).
- Re-running the generic doc validator as a fix.
- A universal driver×leaf cross-product matrix (out of 066 scope).

---

## 5. STOP CONDITIONS
- Max iterations (5) reached — primary stop for this lineage (stopPolicy: max-iterations).
- All five RQs have evidence-backed answers with at least one candidate delta each.
- Otherwise: continue broadening review angles; convergence is telemetry only and must NOT trigger early synthesis.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] RQ1 — canon completeness gaps (6 gaps F1.1–F1.6; answered iterations 1–2)
- [x] RQ2 — per-family conformance (recurrence matrix; 4 wholesale, 1 borderline, 1 isolated; iteration 2)
- [x] RQ3 — validator+benchmark coverage (6 checks C3.1–C3.6; C3.6 keystone; iteration 3)
- [x] RQ4 — router/dispatch logic (5 deltas C4.1–C4.5; iteration 4)
- [x] RQ5 — authoring ergonomics (3 deltas C5.1–C5.3 + consolidated backlog; iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading one command per topology (workflow-YAML speckit, direct-dispatch memory, route-manifest doctor) + the validator source together — exposed canon↔validator drift that canon-only reads miss. (iteration 1)
- Citing each gap with both the canon rule line AND a corpus command that violates it while passing validation. (iteration 1)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Shell family-loop with unquoted `$f` path produced `0/0` router-core counts; re-ran with `find -exec grep`. Minor cost. (iteration 2)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Rewrite canon from the validator" — wrong direction; canon is richer than validator, validator is the leak. Fix = make validator enforce canon + close canon silence. (iteration 1, evidence: iteration-001.md F1.1-F1.6)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Saturated: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**COMPLETE.** stopReason `maxIterationsReached` (5/5; convergence telemetry-only). All five RQs answered with evidence-backed candidate deltas. Canonical synthesis written to `research.md`. Hand-off: parent session cross-reconciles glm52-max with the gpt56-sol-high-fast lineage, then seeds follow-on remediation packets from the Tier 0/1/2 backlog (start with the C3.6 keystone).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot (pointers only)

**Canon (the thing to improve):**
- `.opencode/skills/sk-doc/create-command/SKILL.md:96-394` — creation workflow Steps 1–13 (command type, frontmatter, mandatory gate, router as first-class type Step 11, validation Step 13).
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md:39-116` — canonical numbered router skeleton + 3 variants (workflow-YAML-backed, direct-dispatch-script, compiled-stub).
- `.opencode/skills/sk-doc/create-command/assets/command_template.md:816-846` — presentation/router split families; line 839 lists canonical router shape; 066 marks this prose as under-specified.
- `.opencode/skills/sk-doc/shared/assets/template_rules.json:109-198` — validator command rules: required `purpose`,`instructions`; router detect `presentation_boundary` OR 2+ of `{router_contract,owned_assets,mode_routing,execution_targets}`; router blocking core `owned_assets`+`presentation_boundary`; aliases normalize synonyms (warnings only, not errors).

**Validators (what they catch / miss — RQ3 core):**
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py:417-515` — section presence + router detection; does NOT enforce frontmatter (description/argument-hint/allowed-tools), mandatory-gate, $ARGUMENTS, :auto/:confirm, loader-gating, or presentation-leak prose.
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py:70-204` — separate frontmatter check (description single-line, no `< >`, allowed-tools array form, length soft-target 110 chars for commands). Runs independently; not wired into `--type command` section validation.
- `.opencode/commands/scripts/validate-command-references.cjs` — command-reference integrity (066 reuses this).

**Command corpus (the ~37 commands measured):**
- `create/*` (12): workflow-YAML-backed router family — full _auto/_confirm/_presentation triads.
- `speckit/*` (4), `deep/*` (8): workflow-YAML-backed router families.
- `design/*` (5): workflow-YAML-backed routers.
- `memory/*` (4): direct-dispatch routers — presentation only, no workflow YAML.
- `doctor/*` (3 .md + `_routes.yaml` + per-route assets): argv-router + per-route yaml (the unnumbered→numbered class flagged in 066 RQ3).
- `.opencode/commands/agent_router.md`, `goal_opencode.md`, `prompt-improve.md` — non-namespace standalone commands.

**066 benchmark findings (grounding):**
- `066/spec.md:66-107` — two-axis benchmark; deterministic sk-doc-command adapter S1–S5 + behavioral DAB-012–027; out of scope explicitly: re-running generic `validate_document.py --type command` as a fix.
- `066/010-scorecard-and-closeout` — two-axis scorecard + remediation backlog (planned; the improvement backlog this research feeds).
- `066/011-create-benchmark-completeness-remediation` — create-benchmark completeness work (evidence/ has review-fable, review-sol, review-sol-ultra-rereview).

### Constraints and risks
- Lineage boundary: write ONLY under `research/lineages/glm52-max/`; never touch shipped runtime or other paths.
- Forced non-convergence: run all 5 iterations, broaden angles, synthesize only at the end.
- Canon vs validator drift: the canon states rules (e.g. mandatory gate, allowed-tools least-privilege) that the validator does not check — this drift is itself the central RQ3 finding.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (stopPolicy max-iterations; convergence telemetry only)
- Convergence threshold: 0.05 (NOT a stop trigger for this lineage)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis (written once at phase_synthesis)
- Machine-owned sections: reducer controls Sections 3, 6, 7–11A
- Executor: cli-opencode / zai-coding-plan/glm-5.2 / reasoning max
- Started: 2026-07-16T07:45:00Z
