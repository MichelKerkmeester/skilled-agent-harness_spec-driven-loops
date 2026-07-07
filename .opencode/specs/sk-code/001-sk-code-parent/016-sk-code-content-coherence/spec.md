---
title: "Feature Specification: Phase 016 sk-code content coherence and reference integrity"
description: "Executed Level 3 closeout for sk-code content coherence: the 143-finding audit predated the 013 two-axis restructure and re-verified as already-satisfied (0 broken refs, STRICT 0/0, vocab-sync 0/0/0); the one shipped change dropped 3 stale merger placeholder fields from sk-code metadata (af1170c663)."
trigger_phrases:
  - "sk-code content coherence"
  - "sk-code reference integrity"
  - "phase 016 headline"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code/001-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/016-sk-code-content-coherence"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase closed by verification; sk-code STRICT 0/0"
    next_safe_action: "124 rollup"
---
# Feature Specification: Phase 016 sk-code content coherence and reference integrity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 016 was the headline sk-code coherence phase after the two-axis restructure. It **closed done-by-verification**: the 143-finding content-coherence audit that scoped it predated the 013 restructure and re-verified as stale. Re-checking the live hub found sk-code already coherent — 0 broken references, `parent-skill-check` STRICT 0/0, `parent-hub-vocab-sync` 0/0/0 — so the audit-driven repair, playbook, benchmark, and relocation tasks were dispositioned **verified already-satisfied** rather than newly executed. The one real remnant was removed in commit `af1170c663`, which dropped 3 stale merger placeholder fields from sk-code metadata.

**Key Decisions**: Treat the pre-013 audit as stale and read the live verification gates as the source of truth; ship only the placeholder-field removal; supersede the hooks relocation (ADR-002) because the sk-code link check is already clean.

**Outcome**: sk-code content coherence is certified by live gate output; phase 019 owns the WARN→FAIL promotion and the 124 rollup.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Phase Role** | Headline sk-code content coherence phase |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The master plan identifies sk-code as structurally canonical but content-incoherent after phase 013. The audit rollup records 30 broken references, 8 useless references, 5 duplicate references, 25 sk-doc-alignment findings, stale playbook and benchmark content, and one spec-kit relocation (`audit-digest.txt` category rollup; master plan phase 016 bullets).

The most load-bearing problems are post-013 path drift, stale manual-testing scenario bodies, stale hub metadata prose, and sub-skill alignment failures. Audit P0 evidence names playbook body path drift (`P0-13`), nonexistent `code_surface_detection.md` citations (`P0-14`), stale checklist asset expectations (`P0-15`), code-quality dead plain-text paths (`P0-16`), and code-verify stack-folder verifier drift (`P0-17`).

### Purpose
Restore sk-code as the trustworthy canon example for parent hubs by making its references, playbooks, benchmark baseline, metadata prose, and sub-skill documentation agree with the current two-axis workflow/surface packet model.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix 30 broken references, 8 useless references, and 5 duplicate references across sk-code sub-skills, including post-013 `../../..` drift, orphan references, and stale `RESOURCE_MAP` paths.
- Re-derive stale manual-testing playbook scenario bodies so expected paths point at nested `webflow/`, `opencode/`, `animation/`, `shared/`, and workflow packet locations rather than flat-era references.
- Refresh sk-code `description.json` and `graph-metadata.json` prose to the two-axis model, including mode-registry, hub-router, workflowMode, packetKind, three surface packets, and surfaceBundle language.
- Close per-sub-skill sk-doc alignment findings for code-quality P0, code-verify P0, and webflow/opencode/animation/shared P1 findings.
- Relocate `.opencode/skills/sk-code/opencode/references/shared/hooks.md` into `.opencode/skills/system-spec-kit/references/` and repoint references.
- Re-derive the stale sk-code benchmark baseline as add-only evidence against the post-013 nested packet paths.

### Out of Scope
- Phase 017 shared validator and bundleRules vocabulary hardening.
- sk-design and deep-loop implementation work from phases 015, 018, and 019.
- Metadata generation for this phase folder; the brief says the orchestrator handles `description.json` and `graph-metadata.json` centrally.
- Any file edits outside phase 016 during this planning pass.

### Files to Change During Future Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/manual_testing_playbook/` | Update | Re-derive stale scenario bodies and path expectations from nested packet layout |
| `.opencode/skills/sk-code/code-quality/SKILL.md` | Update | Replace dead plain-text `assets/opencode-checklists/` paths with current packet paths |
| `.opencode/skills/sk-code/code-verify/assets/scripts/verify_stack_folders.py` | Update | Re-anchor verifier to current hub layout and surface model |
| `.opencode/skills/sk-code/code-verify/SKILL.md` | Update | Repoint verifier guidance after script repair |
| `.opencode/skills/sk-code/code-verify/README.md` | Update | Repoint verifier guidance after script repair |
| `.opencode/skills/sk-code/webflow/` | Update | Close P1 reference and sk-doc alignment findings |
| `.opencode/skills/sk-code/opencode/` | Update | Close P1 reference and sk-doc alignment findings; remove relocated hooks doc |
| `.opencode/skills/sk-code/animation/` | Update | Close P1 reference and sk-doc alignment findings |
| `.opencode/skills/sk-code/shared/` | Update | Close stale shared reference and router-sync coverage findings |
| `.opencode/skills/sk-code/description.json` | Update | Refresh advisor-facing prose to current two-axis canon |
| `.opencode/skills/sk-code/graph-metadata.json` | Update | Refresh skill-graph prose and causal summary to current two-axis canon |
| `.opencode/skills/system-spec-kit/references/` | Create/Update | Receive relocated runtime hooks reference and any required repoints |
| `.opencode/skills/sk-code/benchmark/` | Add-only Update | Re-derive stale baseline package against current paths |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-001 | Repair sk-code reference integrity | `check-markdown-links.cjs` reports 0 broken sk-code references; useless and duplicate reference findings are resolved or justified | Master plan phase 016; audit rollup: 30 broken-ref, 8 useless-ref, 5 duplicate-ref |
| REQ-002 | Re-derive stale playbook scenario bodies | Manual-testing playbook body assertions no longer cite flat `references/webflow`, `references/opencode`, or `references/motion_dev` paths | Audit P0-13, P0-14, P0-15 |
| REQ-003 | Refresh hub metadata as canon reference | `description.json` and `graph-metadata.json` describe the two-axis model and name mode-registry, hub-router, workflowMode, packetKind, three surface packets, and surfaceBundle | Master plan phase 016; hub-root P1 |
| REQ-004 | Close sub-skill alignment P0s | code-quality dead checklist paths and code-verify stack-folder verifier drift are fixed and documented | Audit P0-16, P0-17 |
| REQ-005 | Preserve parent-hub structural conformance | `parent-skill-check` strict remains 0 failures for sk-code after content repairs | Master plan phase 016 verification |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria | Trace |
|----|-------------|---------------------|-------|
| REQ-006 | Close surface and shared P1 alignment findings | webflow, opencode, animation, and shared reference layers match current on-disk packet layout and sk-doc expectations | Audit surface/shared P1 summaries |
| REQ-007 | Relocate misfiled spec-kit hooks document | `opencode/references/shared/hooks.md` moves to system-spec-kit references and all live references point to the new owner | Audit speckit-relocation finding |
| REQ-008 | Re-derive benchmark baseline add-only | sk-code benchmark baseline no longer encodes stale post-013 paths and historical baselines remain untouched | Master plan phase 016 benchmark bullet; audit playbook-benchmark P0 |
| REQ-009 | Strengthen router-sync coverage where needed | Router-sync and vocab-sync vitests cover nested resource enumeration rather than vacuous hub-root scans | Audit x:references-validity and shared summaries |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** — MET: sk-code markdown link check reports 0 broken references. The audit's "30 broken-ref" set predated the 013 restructure and no longer exists on disk. Evidence: `check-markdown-links.cjs`.
- **SC-002** — MET: Router and vocabulary coverage is non-vacuous. `parent-skill-check` 5b matches routerSignals to the 8-mode registry and 5c resolves 21 vocabulary classes; `parent-hub-vocab-sync` reports 0 orphan / 0 collision / 0 drift.
- **SC-003** — MET: `parent-skill-check` STRICT is green for sk-code (all hard invariants pass, 0 warnings, exit 0), including after the `af1170c663` metadata cleanup.
- **SC-004** — MET: Playbook bodies, benchmark baseline, `description.json`, and `graph-metadata.json` describe current nested workflow/surface packet paths. The 013 restructure re-anchored the paths; `af1170c663` removed the last stale placeholder fields; 3d-canon/5f/9b pass.
- **SC-005** — MET (by disposition): sk-code carries 0 broken hooks references, so no live reference points at a stale location. The physical relocation to system-spec-kit (ADR-002) was superseded as an audit-era preference with no live defect to fix.

### Acceptance Scenarios

- **Scenario 1**: Given a sk-code playbook scenario names Webflow evidence, when the scenario body is inspected, then it points to `webflow/references/` or `webflow/assets/` paths that exist.
- **Scenario 2**: Given code-quality routes OpenCode authoring checklist material, when its plain-text paths are checked, then each path resolves under `opencode/assets/checklists/`.
- **Scenario 3**: Given code-verify asks agents to run the stack-folder verifier, when the verifier runs from its current nested script location, then it resolves the sk-code hub and current surface model.
- **Scenario 4**: Given downstream hubs copy sk-code metadata as canon, when they read sk-code hub metadata, then they see the current two-axis parent-hub model, not stale flat-era or placeholder prose.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 017 canon decisions | Metadata refresh may need final vocabulary from shared canon hardening | Sequence metadata prose after phase 017 decisions or keep wording compatible with current two-axis canon |
| Risk | Broad reference repair | Mechanical path rewrites can hide semantic stale content | Re-derive scenario bodies and benchmark content from current files, not only from string replacement |
| Risk | Relocation ownership | Moving the hooks doc can break readers if repoints are incomplete | Treat relocation as a paired move plus reference sweep and link check |
| Risk | Structural regression | Content edits could accidentally break parent-hub invariants | Run parent-skill-check strict after content repairs |
| Risk | Historical benchmark mutation | Updating old benchmark artifacts could erase history | Add a fresh baseline package and leave historical runs untouched |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Verification commands should stay bounded to sk-code and directly related canon tests where possible.

### Security
- **NFR-S01**: No secrets or credentials are introduced into spec docs, skill docs, benchmarks, or playbooks.

### Reliability
- **NFR-R01**: Link, router, vocab, metadata, and parent-hub checks must agree before the phase can be marked complete.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- False-positive markdown-link findings must be documented with evidence rather than silently ignored.
- Path references inside historical changelog entries may remain historical if they are clearly non-live and excluded from live checks.
- Playbook bodies need semantic re-derivation when the old asset has no one-to-one target.

### Error Scenarios
- If router-sync passes while enumerating 0 routable markdown files, execution must repair the test before accepting the result.
- If phase 017 changes metadata vocabulary mid-flight, metadata edits must be reconciled before final verification.

### Concurrent Operations
- The master plan says this phase is safe now, but implementation should still avoid deep-loop dirty files and stay within sk-code plus the one system-spec-kit relocation.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Multiple sk-code sub-skills, manual playbooks, benchmark package, hub metadata, one relocation |
| Risk | 18/25 | Canon reference metadata, link integrity, stale semantic bodies, relocation ownership |
| Research | 16/20 | Audit-derived repairs require current-file re-derivation, not only path rewrites |
| Multi-Agent | 8/15 | Work can split by sub-skill and verification lane, but file ownership must stay coordinated |
| Coordination | 10/15 | Phase 017 metadata decisions and phase 019 rollup depend on this phase staying canonical |
| **Total** | **74/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Metadata refresh lands before canon vocabulary settles | High | Medium | Gate metadata wording on phase 017 decision or use only already-canonical terms |
| R-002 | Link repairs pass mechanically but playbook semantics remain stale | High | Medium | Re-derive bodies from actual nested packet files and run scenario review |
| R-003 | Relocated hooks doc leaves dangling references | Medium | Medium | Pair move with repoint sweep and sk-code/system-spec-kit link checks |
| R-004 | Benchmark baseline overwrites historical evidence | Medium | Low | Add a new baseline package and keep historical artifacts intact |

---

## 11. USER STORIES

### US-001: sk-code maintainer trusts references (Priority: P0)

**As a** sk-code maintainer, **I want** every live reference and playbook path to resolve under the current two-axis packet layout, **so that** future edits do not copy stale flat-era paths.

**Acceptance Criteria**:
1. Given sk-code link and router checks run, When the phase is complete, Then broken references are 0 and router-sync coverage is non-vacuous.

---

### US-002: hub authors copy correct canon metadata (Priority: P0)

**As a** parent-hub author, **I want** sk-code hub metadata to explain the current two-axis model, **so that** sk-design and deep-loop copy the right reference shape.

**Acceptance Criteria**:
1. Given another hub author reads sk-code metadata, When they inspect `description.json` and `graph-metadata.json`, Then they see mode-registry, hub-router, workflowMode, packetKind, surface packets, and surfaceBundle as the canonical model.

---

### US-003: spec-kit owns spec-kit hooks documentation (Priority: P1)

**As a** system-spec-kit maintainer, **I want** the runtime hooks reference under system-spec-kit, **so that** spec-kit content is not misfiled inside the OpenCode surface evidence packet.

**Acceptance Criteria**:
1. Given a reader follows hooks documentation references, When the relocation is complete, Then live references point to system-spec-kit and the old sk-code path is gone or non-live.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- RESOLVED: Phase 017 metadata vocabulary did not need to gate phase 016. sk-code metadata already satisfies the two-axis canon (`parent-skill-check` 3d-canon and 5f pass), so no vocabulary decision was required before the `af1170c663` cleanup.

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
