
# Deep Review Strategy - Scaffold surface placement

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Commit 17bb342b1c on branch worktrees/125-surface-placement: the tieBreak insertion rule in the step_4 hub-router.json activity of both create-skill-parent YAML twins, the two step_6_completion follow-up lines (canary case plus fixture copy; commit with hooks or manual refresh and manifest copy), the same rule in parent-hub-router-schema.md and parent-skills-nested-packets.md, and the sk-create-skill v1.5.4.0 release (SKILL.md version, changelog entry, Hermes copy).

Dimension queue (risk order): correctness, security, traceability, maintainability. Stop policy: max-iterations (5).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The shipped sk-code tieBreak order and routes (D2: unchanged by design).
- Items the spec puts out of scope: README.md:1448, SKILL.md:74, upgrading-a-skill-to-v4.md:161, canary generation inside the scaffold (X10), re-mint inside it (X14), a rank field or doctor leg for position, the example order at parent-hub-router-schema.md:69.

---

## 5. STOP CONDITIONS
- stop_policy=max-iterations: run all 5 iterations; convergence is telemetry only.
- Any confirmed P0 halts for remediation.

---

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
- P1 (Required): 0
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Byte-level diff of the three changed line groups across both YAML twins: proved the identical-in-each requirement without trusting the commit message. (iteration 1)
- One-phrase repo grep plus a per-directory writer search: proved all four sites carry the rule and no tieBreak writer was missed. (iteration 1)
- Existence checks on both follow-up mechanisms and the canary fixture twin: proved the completion lines executable as written. (iteration 1)
- Security pass enumerated the bug classes behind the two new follow-up commands (argv/shell injection, path traversal, gate fail-open) and tested each against the enforcement code rather than the prose alone; the library's hub id pattern guard, the realpath check and the blocking route-remint gate ruled all three out, leaving secrets exposure not applicable. (iteration 2)
- Traceability pass: the REQ-001..REQ-006 -> AC-001..AC-006 -> task -> ledger matrix has no orphan, spec citation anchors resolve, and the packet's P8 ledger fill is deferred to T012 by the packet's own task order rather than treated as a defect. (iteration 3)
- Maintainability pass: the new line groups were checked against the repo's twin-parity harness (scope: root_router_contract only), the sibling changelog convention, the reference-doc version convention, the template/instruction surfaces and the layout-constant ownership; the guard gap is R4-P2-001 and the rest resolved to notes. (iteration 4)
- Final correctness pass: re-verified R1's four sites and R8's two lines against spec.md:73-74,104-107, proved the step_4/step_6 line groups still byte-identical across both twins, and closed the one direction earlier iterations had only asserted: the manual manifest fallback's copy direction matches the hook's own fix text (pre-commit:589-593, "copy the runtime manifest over its authored copy"), so compiled-over-authored is correct. No new findings; R1-P2-001 and R4-P2-001 remain open as advisory. (iteration 5)

---

## 9. WHAT FAILED
- Nothing abandoned this iteration; the one candidate finding survived counterevidence review. (iteration 1)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **agent_cross_runtime — pass.** `.hermes/skills/sk-create-skill/SKILL.md:5` carries 1.5.4.0; its diff against canonical is limited to the generated header block and one rewritten relative link. Only `SKILL.md` lives in the Hermes copy, so no stale mirrored references were possible. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **agent_cross_runtime — pass.** `.hermes/skills/sk-create-skill/SKILL.md:5` carries 1.5.4.0; its diff against canonical is limited to the generated header block and one rewritten relative link. Only `SKILL.md` lives in the Hermes copy, so no stale mirrored references were possible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime — pass.** `.hermes/skills/sk-create-skill/SKILL.md:5` carries 1.5.4.0; its diff against canonical is limited to the generated header block and one rewritten relative link. Only `SKILL.md` lives in the Hermes copy, so no stale mirrored references were possible.

### **agent_cross_runtime — pass.** The Hermes copy carries the same 1.5.4.0 SKILL.md; nothing security-relevant diverges from canonical. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **agent_cross_runtime — pass.** The Hermes copy carries the same 1.5.4.0 SKILL.md; nothing security-relevant diverges from canonical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime — pass.** The Hermes copy carries the same 1.5.4.0 SKILL.md; nothing security-relevant diverges from canonical.

### **checklist_evidence — pass with note.** Security review closes no packet task; tasks.md T003/T006 closure remains with D3 (unchanged from iteration 1). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **checklist_evidence — pass with note.** Security review closes no packet task; tasks.md T003/T006 closure remains with D3 (unchanged from iteration 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence — pass with note.** Security review closes no packet task; tasks.md T003/T006 closure remains with D3 (unchanged from iteration 1).

### **checklist_evidence — pass with note.** tasks.md T003/T006 exist and map 1:1 to the change; both remain unchecked (`- [ ]`), which is expected until the packet's completion gate runs (traceability dimension D3 will own any closure gap). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **checklist_evidence — pass with note.** tasks.md T003/T006 exist and map 1:1 to the change; both remain unchecked (`- [ ]`), which is expected until the packet's completion gate runs (traceability dimension D3 will own any closure gap).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence — pass with note.** tasks.md T003/T006 exist and map 1:1 to the change; both remain unchecked (`- [ ]`), which is expected until the packet's completion gate runs (traceability dimension D3 will own any closure gap).

### **feature_catalog_code — not applicable.** No `tieBreak`, surface-placement, or version references in `.skilled/commands/create/feature-catalog.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **feature_catalog_code — not applicable.** No `tieBreak`, surface-placement, or version references in `.skilled/commands/create/feature-catalog.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code — not applicable.** No `tieBreak`, surface-placement, or version references in `.skilled/commands/create/feature-catalog.md`.

### **feature_catalog_code — not applicable.** No catalog rows describe the changed command surface. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **feature_catalog_code — not applicable.** No catalog rows describe the changed command surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code — not applicable.** No catalog rows describe the changed command surface.

### **playbook_capability — not applicable.** No matching rows in `.skilled/commands/create/manual-testing-playbook.md` or `agent.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **playbook_capability — not applicable.** No matching rows in `.skilled/commands/create/manual-testing-playbook.md` or `agent.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability — not applicable.** No matching rows in `.skilled/commands/create/manual-testing-playbook.md` or `agent.md`.

### **playbook_capability — not applicable.** No playbook rows map to the changed lines. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **playbook_capability — not applicable.** No playbook rows map to the changed lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability — not applicable.** No playbook rows map to the changed lines.

### **skill_agent — pass.** The only `tieBreak` writers under `.skilled/commands/create/assets/` are the two step_4 activities, both updated; the other two mentions (auto:250, confirm:283) are descriptive `quality_standards` text, not writers. Both twins parse as YAML (commit verification) and the three changed line groups are byte-identical between them. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **skill_agent — pass.** The only `tieBreak` writers under `.skilled/commands/create/assets/` are the two step_4 activities, both updated; the other two mentions (auto:250, confirm:283) are descriptive `quality_standards` text, not writers. Both twins parse as YAML (commit verification) and the three changed line groups are byte-identical between them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent — pass.** The only `tieBreak` writers under `.skilled/commands/create/assets/` are the two step_4 activities, both updated; the other two mentions (auto:250, confirm:283) are descriptive `quality_standards` text, not writers. Both twins parse as YAML (commit verification) and the three changed line groups are byte-identical between them.

### **skill_agent — pass.** The security-relevant instruction text in the two twins is identical (step_4 rule and both step_6 lines), so no twin carries a stale or divergent command. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **skill_agent — pass.** The security-relevant instruction text in the two twins is identical (step_4 rule and both step_6 lines), so no twin carries a stale or divergent command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent — pass.** The security-relevant instruction text in the two twins is identical (step_4 rule and both step_6 lines), so no twin carries a stale or divergent command.

### **spec_code — pass.** R8's two follow-up lines are exactly the two lines present in both twins, and the failure modes they name are real: `5k-canary` exists as a doctor leg and `gate:route-remint` as a blocking hook gate. R1's placement rule matches all four sites. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **spec_code — pass.** R8's two follow-up lines are exactly the two lines present in both twins, and the failure modes they name are real: `5k-canary` exists as a doctor leg and `gate:route-remint` as a blocking hook gate. R1's placement rule matches all four sites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code — pass.** R8's two follow-up lines are exactly the two lines present in both twins, and the failure modes they name are real: `5k-canary` exists as a doctor leg and `gate:route-remint` as a blocking hook gate. R1's placement rule matches all four sites.

### **spec_code — pass.** spec.md R1 ("word for word the same in each"; exact shared phrase "ahead of the existing surface modes") and R8 (both follow-up lines name `canary-cases.v1.json` and `install-git-hooks.sh` literally) match the implemented text at all four sites; plan.md:57 names step_4 as the only `tieBreak` writer and plan.md:62 names the `gate:route-remint` copy path the completion line describes. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **spec_code — pass.** spec.md R1 ("word for word the same in each"; exact shared phrase "ahead of the existing surface modes") and R8 (both follow-up lines name `canary-cases.v1.json` and `install-git-hooks.sh` literally) match the implemented text at all four sites; plan.md:57 names step_4 as the only `tieBreak` writer and plan.md:62 names the `gate:route-remint` copy path the completion line describes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code — pass.** spec.md R1 ("word for word the same in each"; exact shared phrase "ahead of the existing surface modes") and R8 (both follow-up lines name `canary-cases.v1.json` and `install-git-hooks.sh` literally) match the implemented text at all four sites; plan.md:57 names step_4 as the only `tieBreak` writer and plan.md:62 names the `gate:route-remint` copy path the completion line describes.

### Activation manifests: the commit updates both `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its `specs/sk-doc/z_archive/...` authored twin to the same new `effectivePolicyHash`, consistent with the `gate:route-remint` copy direction in the follow-up line. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Activation manifests: the commit updates both `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its `specs/sk-doc/z_archive/...` authored twin to the same new `effectivePolicyHash`, consistent with the `gate:route-remint` copy direction in the follow-up line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Activation manifests: the commit updates both `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its `specs/sk-doc/z_archive/...` authored twin to the same new `effectivePolicyHash`, consistent with the `gate:route-remint` copy direction in the follow-up line.

### Follow-ups executable: `install-git-hooks.sh` exists and its header lists the compiled-routing re-mint gate; `compiled-route-manifest.cjs` supports `refresh` (usage line 29); the canary first-leg path resolves to a real file and its authored twin is byte-identical. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Follow-ups executable: `install-git-hooks.sh` exists and its header lists the compiled-routing re-mint gate; `compiled-route-manifest.cjs` supports `refresh` (usage line 29); the canary first-leg path resolves to a real file and its authored twin is byte-identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Follow-ups executable: `install-git-hooks.sh` exists and its header lists the compiled-routing re-mint gate; `compiled-route-manifest.cjs` supports `refresh` (usage line 29); the canary first-leg path resolves to a real file and its authored twin is byte-identical.

### Release surface: SKILL.md 1.5.4.0 ↔ changelog/v1.5.4.0.md ↔ Hermes copy 1.5.4.0; no current-version reference left stale (1.5.3.0 survives only in its own historical changelog; README.md:7 `1.2.0.21` is that child doc's independent version, unchanged since the 2025 rename commits, not a reference to the schema doc). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Release surface: SKILL.md 1.5.4.0 ↔ changelog/v1.5.4.0.md ↔ Hermes copy 1.5.4.0; no current-version reference left stale (1.5.3.0 survives only in its own historical changelog; README.md:7 `1.2.0.21` is that child doc's independent version, unchanged since the 2025 rename commits, not a reference to the schema doc).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Release surface: SKILL.md 1.5.4.0 ↔ changelog/v1.5.4.0.md ↔ Hermes copy 1.5.4.0; no current-version reference left stale (1.5.3.0 survives only in its own historical changelog; README.md:7 `1.2.0.21` is that child doc's independent version, unchanged since the 2025 rename commits, not a reference to the schema doc).

### Shared phrase grep: `rg -ln "ahead of the existing surface"` returns exactly the four changed sites plus the changelog and the spec/research docs — one grep finds every site, as R1 requires. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Shared phrase grep: `rg -ln "ahead of the existing surface"` returns exactly the four changed sites plus the changelog and the spec/research docs — one grep finds every site, as R1 requires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shared phrase grep: `rg -ln "ahead of the existing surface"` returns exactly the four changed sites plus the changelog and the spec/research docs — one grep finds every site, as R1 requires.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- changelog_convention_drift: v1.5.4.0.md matches sibling v1.5.3.0.md frontmatter keys and section order (iteration 4, evidence: changelog/v1.5.4.0.md:1-31, changelog/v1.5.3.0.md:1-33)
- hardcoded_layout_constant: the authored-twin root is the repo layout constant read by the hook from compiled-route-layout.cjs; prose must name a concrete path (iteration 4, evidence: .skilled/scripts/git-hooks/pre-commit:541-548)
- reference_doc_version_drift: both edited references bumped 1.2.0.x -> 1.2.1.0 for the content addition (iteration 4, evidence: parent-hub-router-schema.md:12, parent-skills-nested-packets.md:12)
- template_instruction_drift: template placeholder order and hub-template checklist remain compatible; the insertion rule governs updates of existing hubs (iteration 4, evidence: parent-skill-hub-template.md:188,301)
- release_surface_staleness: carried from iteration 1 — SKILL.md/changelog/Hermes all at 1.5.4.0 (iteration 4, evidence: SKILL.md:5, .hermes/skills/sk-create-skill/SKILL.md:5)
- spec_code_mismatch: R1's exact phrase is in all four sites and R8's two lines name both required literals; twins byte-identical (iteration 5, evidence: spec.md:73-74,104-107, create-skill-parent-auto.yaml:423,500-501, create-skill-parent-confirm.yaml:462,547-548, parent-hub-router-schema.md:290, parent-skills-nested-packets.md:224)
- cross_file_parity: the step_4 rule and both step_6 lines are byte-identical across the twins (iteration 5, evidence: create-skill-parent-auto.yaml:423,500-501, create-skill-parent-confirm.yaml:462,547-548)
- command_executability: `refresh --hub <hub-id> --skill-root <path>` is the documented usage and the hook prints the same fallback with the same compiled-over-authored copy direction (iteration 5, evidence: compiled-route-manifest.cjs:29-30, pre-commit:589-593)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
Phase spec: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/001-scaffold-surface-placement/spec.md (R1, R8; REQ-001..006). Research evidence: specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md section 14 (R1, R8) and F46, F47, F52, F54, F63, F89. Copy-run proof (P8-1..P8-6) recorded by the builder: the auto twin update run wrote tieBreak [quality, review, acme, opencode, obsidian, webflow]; doctor 5e/5i PASS; after the two report follow-ups doctor, guard and sync --check exit 0; tie prompt routes [acme, opencode], and [opencode, acme] with acme appended last.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1,2,3,5 | R1/R8 match all four sites and both follow-up lines; named failure modes real; D3 adds the REQ/AC/task matrix and citation-anchor resolution, no new mismatch; I5 re-verifies R1/R8 against spec.md and confirms the manual fallback copy direction against pre-commit:589-593 |
| `checklist_evidence` | core | pass | 1,2,3 | T003/T006 map 1:1; P8/AC ledger fill still pending and owned by T012, not a defect at review time |
| `skill_agent` | overlay | pass | 1,2 | Only tieBreak writers are the two updated step_4 activities; twins byte-identical |
| `agent_cross_runtime` | overlay | pass | 1,2 | Hermes copy 1.5.4.0; diff limited to generated header and one link rewrite |
| `feature_catalog_code` | overlay | notApplicable | 1 | No tieBreak/surface/version rows in create feature-catalog.md |
| `playbook_capability` | overlay | notApplicable | 1 | No matching rows in create manual-testing-playbook.md or agent.md |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [path/to/file] | [D1, D3] | [N] | [0 P0, 1 P1, 2 P2] | [partial/complete] |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-13T05:59:30.000Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-10-13T05:59:30.000Z
<!-- MACHINE-OWNED: END -->

---

resource-map.md not present; skipping coverage gate
