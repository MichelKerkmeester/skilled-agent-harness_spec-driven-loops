---
title: Deep Research Strategy — command-surface-router-awareness (dsflashgo)
description: Persistent research plan for the fan-out lineage dsflashgo auditing OpenCode command/tooling surfaces against the root ROUTER.md parent-skill standard.
trigger_phrases:
  - "command surface router awareness"
  - "root ROUTER.md standard audit"
  - "smart-routing legacy path audit"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — Command Surface Router Awareness

## 1. OVERVIEW

### Purpose

Audit whether OpenCode command surfaces and tooling are linked to and aware of the new root
ROUTER.md parent-skill creation standard. Deliverable: a ranked list of surfaces that need
updating (exact file and line, the gap, the minimal fix), separated from surfaces confirmed
conformant. Prioritize functional gaps over cosmetic naming.

### Usage

This is the "persistent brain" for the detached fan-out lineage `dsflashgo`. Read `Next Focus`
per iteration; write iteration evidence to `iterations/iteration-NNN.md`; append JSONL deltas.

### Mutability

Mutable — analyst-owned sections stable; machine-owned sections rewritten after each iteration.

---

## 2. TOPIC

Audit whether OpenCode command surfaces and tooling are linked to and aware of the new root
ROUTER.md parent-skill creation standard (a first-class ROUTER.md at the hub root with
router_state active or stage1-only, replacing the legacy shared/references/smart-routing.md
path). Investigate (1) the create command family under .opencode/commands/create, (2) the
doctor command family under .opencode/commands/doctor, (3) other surfaces (CI scripts, skill
advisor metadata/index, agent definitions, mode-registry and hub-router schema docs,
validators). Concrete leads: five files under .opencode/commands and five under sk-create-skill
still contain the string smart-routing; verify each is a legitimate legacy-rejection list,
migration note, or test fixture versus a stale authoring instruction.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1. Do the create-skill / create-skill-parent commands (auto, confirm, presentation assets) invoke the updated init_skill.py, parent-skill templates, and root-router-contract.cjs, and present root ROUTER.md rather than the legacy reference-folder path?
- [ ] Q2. Do any doctor command routes (doctor-parent-skill.yaml, doctor speckit _routes, doctor-update, doctor-runtime-mirrors, mcp-doctor) still assume shared/references/smart-routing.md or fail to validate the root ROUTER.md two-state contract, and should any doctor route now audit root ROUTER.md across the seven hubs?
- [ ] Q3. Which other surfaces (CI scripts ci-skill-root-metadata.cjs, ci-leaf-manifest-freshness.cjs, ci-skill-derived-freshness.cjs; skill advisor metadata and index; agent definitions; mode-registry and hub-router schema docs; validators) reference the legacy path or lack awareness of root ROUTER.md?
- [ ] Q4. For each of the ten smart-routing string hits (five under .opencode/commands, five under sk-create-skill), is it a legitimate legacy-rejection list, migration note, or test fixture, or a stale authoring instruction that needs updating?
- [ ] Q5. What is the complete ranked surface-update list (exact file+line, gap, minimal fix), and which surfaces are confirmed conformant?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not implementing fixes — findings only; implementation is a separate follow-up step.
- Not auditing content/format of the seven hub ROUTER.md files themselves beyond their two-state contract awareness; the standard itself is treated as ground truth.
- Not evaluating Webflow/sk-design surface evidence packets beyond the seven hub ROUTER.md presence check.
- Not running repo tooling (validate.sh, generate-context.js, git write/checkout/commit) — this is a detached lineage with a bound write surface.

---

## 5. STOP CONDITIONS

- All key questions answered with evidence.
- Max iterations (5) reached.
- Stuck recovery exhausted with gaps documented.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q4 (create-family hits): all five create-family smart-routing hits are legitimate legacy-rejection
  lists, migration notes, or test fixtures (iteration 1).
- Q1 (create-family): create-skill-parent auto/confirm YAMLs bind the root_router_contract with
  six-state classification, load the root ROUTER.md template, gate on root-router-contract.cjs via
  parent-skill-check check 12, and present ROUTER.md state/action; init_skill.py (both copies,
  byte-identical) writes stage1-only ROUTER.md for parent hubs; mirrors in sync (iteration 1).
- Q2 (doctor-family): per-hub check 12 in parent-skill-check.cjs validates root ROUTER.md two-state
  contract; BUT the fleet class gate ci-skill-root-metadata.cjs is ROUTER-blind (zero awareness) and
  no doctor route sweeps the seven hubs' root ROUTER.md contracts (iterations 2).
- Q3 (other surfaces): CI parent-skill gate glob-enrolls all 7 hubs and runs check 12, but ROUTER.md
  is missing from the workflow trigger paths (editing only ROUTER.md bypasses the gate); advisor,
  validators, and compiled-route are intentionally ROUTER-agnostic (conformant); package_skill's
  smart-router markers are a distinct flat-skill section concept, not a legacy hit (iteration 3).
- Q4 (sk-create-skill half): all 8 hit files are legitimate templates/references/contracts/test
  fixtures; the only actionable residue is the COSMETIC filename parent-skill-smart-routing-template.md
  (iteration 4).
- Q5 (surfaces/conformance): all seven hubs carry conformant root ROUTER.md (router_state: active,
  skill_pointer: SKILL.md, four-part version); zero legacy smart-routing.md files on disk;
  conformant: create family, mirrors, advisor, validators, compiled-route, benchmark replay,
  package_skill flat-section markers, playbook content, remaining agents. Gaps: (1) CI workflow
  trigger paths omit ROUTER.md, (2) ci-skill-root-metadata.cjs fleet class gate is ROUTER-blind,
  (3) no doctor route sweeps the seven hubs fleet-wide, (4) sk-code phase-detection.md dangling
  legacy links (lines 40,110), (5) deep-alignment adapter §-citations to relocated file,
  (6) deep-review playbook ANCHOR:smart-routing does not exist (iterations 2,3,5).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Full-context reads of workflow YAMLs rather than grep-hit-only reads (prevented misreading the
  create-family smart-routing hits as scattered legacy refs) (iteration 1)
- Separating per-hub ROUTER.md coverage (check 12, present) from fleet-wide coverage (absent)
  mapped the doctor family to the brief's Q2 (iteration 2)
- Reading the full CI workflow `paths:` blocks — the glob-enrolled hub loop and trigger omission
  were only visible there (iteration 3)
- Reading the ROUTER.md template's own frontmatter (router_state: active) as proof of function (iteration 4)
- Disk-level `find` for legacy files proved migration completeness; separating executed path
  probes (conformant) from documentation citations (stale) (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- The Grep tool's path handling returned sibling-file matches for a single-file query; mitigated
  with direct `grep -n` re-verification on specific scripts (iteration 2)
- `rg` (ripgrep) binary is not on PATH in this shell — all searches routed through the Grep tool (iterations 1-5)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Flat create-skill flow as a ROUTER.md gap (flat skills have no root ROUTER.md) (iteration 1)
- doctor-update.yaml / mcp-doctor as ROUTER.md surfaces (scope-excluded) (iteration 2)
- Skill advisor as a ROUTER.md consumer (by design) (iteration 3)
- package_skill.py SMART ROUTING markers as a legacy hit (distinct flat-skill surface) (iteration 3)
- Renaming parent-skill-smart-routing-template.md now (cosmetic churn) (iteration 4)
- A seventh-hub ROUTER.md gap (all seven active) (iteration 5)
- router-replay.cjs as a legacy authoring hit (ROUTER.md-first fallbacks) (iteration 5)
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

- Whether GAP-3 should be a new doctor route or an extension of the parent-skill route (recommended: extend to mirror CI glob-enrollment)
- Whether ROUTER.md should join the advisor harvest scope (current answer: no)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

COMPLETE — all 5 key questions answered. Synthesized into research.md: ranked gap list
(GAP-1..GAP-7: 3 functional, 3 documentation, 1 cosmetic) and 13 conformant surface groups.
Recommended next step (implementation): land GAP-1 trigger-path fix, then GAP-2 class-gate
ROUTER.md validation, then GAP-3 fleet doctor sweep.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- **Standard ground truth:** Root ROUTER.md at each class-H parent hub root with
  `router_state: active|stage1-only`, `skill_pointer: SKILL.md`, four-part `version`, and
  no coexistence with legacy `shared/references/smart-routing.md` / `references/smart-routing.md`.
  Validator: `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/root-router-contract.cjs`
  (RRC-001..RRC-008; LEGACY_ROUTER_PATHS at lines 73-76). Template:
  `sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md`.
- **Seven hubs with root ROUTER.md:** `.opencode/skills/{sk-prompt, mcp-tooling,
  system-deep-loop, sk-code, sk-design, sk-doc, cli-external-orchestration}/ROUTER.md`.
  sk-doc ROUTER.md has `router_state: active` (line 12) and frontmatter noting relocation
  from shared/references/smart-routing.md (line 3).
- **Grep tool confirms** smart-routing string present in `.opencode/commands` (20 hits,
  5 files: create-skill-parent-auto.yaml, create-skill-parent-confirm.yaml,
  test_skill_parent_router_parity.py, skill-parent.md, doctor parent-skill-check-root-router.test.cjs)
  and in sk-create-skill (13 hits, 8 files: skill-smart-router.md,
  parent-skill-smart-routing-template.md, parent-skill-hub-router-template.json,
  parent-skill-hub-template.md, parent-skills-nested-packets.md, parent-hub-router-schema.md,
  root-router-contract.cjs, root-router-contract.test.cjs).
- **Note:** `rg` (ripgrep) binary is NOT on PATH in this shell; the Grep tool is the
  authoritative search mechanism.
- **Session context:** This is a detached fan-out lineage under
  `specs/sk-doc/031-command-surface-router-awareness/research/lineages/dsflashgo`; all writes
  bound to that directory. Parent orchestrator recorded invocation
  (executor cli-opencode, model opencode-go/deepseek-v4-flash).

### Source pointers

- `.opencode/commands/create/{skill-parent.md, skill.md, agent.md, README.txt, assets/}`
- `.opencode/commands/doctor/{_routes.yaml, speckit.md, update.md, mcp.md, scripts/, assets/}`
- `.opencode/skills/sk-doc/sk-create-skill/{scripts/init_skill.py, scripts/lib/root-router-contract.cjs, assets/parent-skill/, references/parent-skill/}`
- CI: `.opencode/skills/*/scripts/ci-*.cjs` (search needed)

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (treated as telemetry only; broadens review angles instead of early synthesis)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this run)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-08-16T14:30:00Z
