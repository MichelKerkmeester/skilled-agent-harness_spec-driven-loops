# Deep Research Synthesis — 077 system-spec-kit + mcp-coco-index + sk-code OpenCode audit

**Packet**: 077-spec-kit-coco-sk-code-research
**Date**: 2026-05-05
**Iterations**: 10/10 (no early convergence — every iteration surfaced new P1 findings)
**Executor**: cli-codex (gpt-5.5/high/fast)
**Wall-clock**: ~30 min total (iter 1: 3min; iters 2-10: 27min)
**Total findings**: 22 P1 + 20 P2 = 42 distinct issues across 3 surfaces + cross-cutting

---

<!-- ANCHOR:summary -->
## 1. EXECUTIVE SUMMARY

The audit found that all three surfaces are **healthy at their cores** but share a common architectural gap: **no first-class authoring-time integration path between them**. system-spec-kit, mcp-coco-index, and sk-code each work well in isolation, but the workflow that ties them together — spec-folder writes that touch `.opencode/skills/sk-code/` code, expecting sk-code patterns to load AND CocoIndex to index AND spec-kit validators to enforce — has no canonical recipe. The result: each surface assumes the others handle the integration, and small drift accumulates at the seams.

Source iterations: `iteration-001` through `iteration-010` under `077/research/iterations/`.

**Top-level patterns:**

1. **system-spec-kit drift is concentrated in the validator + MCP-tool surface**, not the templates. The strict validator misses graph-metadata shape errors and phase-parent edge cases (registry-owned phase rules, active-child pointer drift). The MCP server advertises tools whose dispatch is incomplete. None of these are correctness bugs that break shipped flows; they're observability + completeness gaps that mask real drift.

2. **mcp-coco-index search effectiveness depends on local config**, not skill defaults. The default `DEFAULT_EXCLUDED_PATTERNS` excludes `**/.*` which would skip `.opencode/skills/sk-code/` entirely; the user's local repo settings override this but new clones won't. CLI vs MCP parity is incomplete — only `search` is exposed via MCP; init/index/status/reset/daemon stay CLI-only.

3. **sk-code OpenCode side has the largest surface gap**: claims to cover skills/agents/commands authoring but ships only language-level checklists. No spec-folder writing recipe, no skills/agents/commands authoring checklists, no canonical OpenCode-side resource manifest, no machine-readable STACK_FOLDERS contract. The references are present but the assets directory is language-checklist-only.

4. **Cross-cutting**: spec-kit `/spec_kit:complete` flows load sk-code at review time (after code is written), not at authoring time (before). A single canonical authoring recipe — loaded by `/spec_kit:complete` when the implementation target is `.opencode/` — would close the loop and let CocoIndex prefer canonical resources over manual_testing_playbook scenarios.

**Recommendation: SHIP_REMEDIATION_AS_PHASES.** The remediation sequence is well-defined (see §5) and should be 4-5 dedicated phase children under a new packet, not a single bundled commit.
<!-- /ANCHOR:summary -->

---

## 2. PER-SURFACE FINDINGS

### 2.1 system-spec-kit (skill + MCP server)

| ID | Severity | Surface | Summary |
|---|---|---|---|
| F-001-001 | P1 | SKILL.md ROLLOUT_FLAGS | Maps to a directory `feature_catalog/19--feature-flag-reference/`; `_guard_in_skill` rejects non-`.md`. Structurally incompatible. |
| F-002-001 | P1 | validator | Default `validate.sh --strict` does not parse `graph-metadata.json` shape — drift like missing `derived.last_known_status` slips through. |
| F-002-002 | P1 | validator | Node validator omits registry-owned phase rules (phase-parent vs phase-child detection paths diverge). |
| F-002-003 | P2 | metadata | Mandatory `description.json` + `graph-metadata.json` only enforced for phase parents; root specs without them slip through. |
| F-002-004 | P2 | metadata | Phase-parent `derived.last_active_child_id` drift unvalidated — pointers can stale-redirect. |
| F-003-001 | P1 | MCP server | Listed CocoIndex MCP tools advertised in skill but not dispatched (registry mismatch). |
| F-003-002 | P1 | MCP server | `memory_save` advertises routed continuity writes; public schema can't request the full-auto path. |
| F-003-003 | P2 | MCP server | MCP reference table stale relative to runtime registry. |

**Hot-spot**: `scripts/spec/validate.sh` + Node `validate.js` shape-check coverage. Adding a JSON-schema-style validator for `graph-metadata.json` and `description.json` would catch most of these.

### 2.2 mcp-coco-index (skill + MCP server)

| ID | Severity | Surface | Summary |
|---|---|---|---|
| F-001-002 | P1 | settings | `DEFAULT_EXCLUDED_PATTERNS` includes `**/.*` → `.opencode/skills/sk-code/` resources skipped under defaults. Local override masks the bug. |
| F-001-003 | P2 | MCP refresh | `refresh_index=true` default + known `ComponentContext` concurrency issue → freshness/perf hotspot. |
| F-004-001 | P1 | MCP coverage | CocoIndex maintenance (init/reset/daemon/status) has no MCP owner — only `search` is exposed. |
| F-004-002 | P1 | telemetry | Search telemetry docs overstate emitted fields (drift between docs and runtime). |
| F-004-003 | P2 | startup | MCP startup indexing can race the default refresh path. |
| F-004-004 | P2 | CLI/MCP | CLI path scoping differs from MCP and is underdocumented. |
| F-005-001 | P1 | settings/portability | sk-code ingestion works locally but depends on repo-specific settings; new clones may silently fail to ingest. |
| F-005-002 | P1 | rank quality | Unscoped queries polluted by mirror/spec material despite scoped sk-code rank being usable. |
| F-005-003 | P2 | provider-change | Provider-change safety documented but not enforced by daemon restart path. |
| F-005-004 | P2 | rank pollution | CocoIndex surfaces `manual_testing_playbook` paths as sk-code standards evidence — wrong canonical priority. |

**Hot-spot**: `DEFAULT_EXCLUDED_PATTERNS` semantics + canonical-resource preference. CocoIndex needs a way to mark certain folders as "preferred canonical" so they outrank exploratory test scaffolds.

### 2.3 sk-code OpenCode side (references + assets)

| ID | Severity | Surface | Summary |
|---|---|---|---|
| F-001-004 | P2 | scope/assets | OpenCode scope claims skills/agents/commands; assets are language-checklist-only. |
| F-001-005 | P2 | references | `references/opencode/shared/universal_patterns.md` has stale `../../assets/checklists/` link (real path: `../../assets/opencode/checklists/`). |
| F-006-001 | P2 | router | JavaScript OpenCode route declared but not covered by language-sub-detection scenarios. |
| F-006-002 | P1 | references | Skills/agents/commands lack first-class authoring references / checklists despite claimed scope. |
| F-006-003 | P2 | references | OpenCode directory convention reference still shows pre-domain paths. |
| F-006-004 | P2 | references | system-spec-kit integration is named but stays at path-safety level — no spec-folder write guidance. |
| F-007-001 | P1 | assets | OpenCode asset surface is language-only despite broader OPENCODE scope. |
| F-007-002 | P1 | assets | Spec-folder validation named in references but not operationalized as a loaded recipe. |
| F-007-003 | P2 | assets | Alignment automation can't cover the Markdown-heavy assets that are missing checklists. |
| F-007-004 | P2 | assets | Manual routing scenarios expect only language assets; integration assets would not be tested. |
| F-007-005 | P2 | assets | CocoIndex has a retrieval-priority target: canonical assets before unvalidated playbook scenarios. |
| F-008-001 | P1 | router | Live router no longer has a machine-readable `STACK_FOLDERS` contract (regressed to inline strings). |
| F-008-002 | P1 | router | OpenCode intent taxonomy is broader than the OpenCode resource map. |
| F-008-003 | P2 | router | Verifier cannot catch Markdown/resource-map drift. |
| F-008-004 | P1 | router | Spec-folder writes named in verification but not loaded as an OpenCode recipe. |
| F-008-005 | P2 | router | CocoIndex has no canonical OpenCode authoring/spec resource target to prefer. |

**Hot-spot**: `assets/opencode/` tree. Adding 4-6 canonical authoring checklists (skill, agent, command, mcp-server, spec-folder, javascript-sub-detection) closes most P1 gaps in this surface.

---

## 3. CROSS-CUTTING INTEGRATION FINDINGS

| ID | Severity | Theme | Summary |
|---|---|---|---|
| F-009-001 | P1 | timing | system-spec-kit requires sk-code for code updates but `/spec_kit:complete` loads it at review time (after writes), not authoring time (before). |
| F-009-002 | P1 | contract | sk-code has spec-folder invariants but no first-class SPEC_FOLDER or IMPLEMENTATION OpenCode load path. |
| F-009-003 | P2 | indexing | CocoIndex ingests sk-code resources locally but excludes spec packets by design — fine, but no smoke test confirms this on fresh clones. |
| F-009-004 | P2 | testing | The missing cross-surface smoke test is a rank test, not another path-existence test (we have plenty of those). |
| F-010-001 | P1 | sequencing | Authoring-time sk-code loading is the first remediation dependency — everything else builds on it. |
| F-010-002 | P1 | sequencing | Validator + graph-metadata coverage remain P1 but should sequence AFTER integration fixes (otherwise validator chases a moving target). |
| F-010-003 | P1 | sequencing | CocoIndex maintenance/refresh parity should follow canonical resource creation (otherwise we're indexing a moving target). |
| F-010-004 | P1 | manifest | sk-code needs a canonical OpenCode authoring/spec-folder resource manifest. |

**Pattern**: the three surfaces collectively need ONE canonical "OpenCode authoring recipe" that:
1. Lives in `sk-code/assets/opencode/` (canonical home)
2. Is loaded by `/spec_kit:complete` when the implementation target is `.opencode/`
3. Is preferentially indexed by CocoIndex
4. Is checked by `validate.sh --strict` for shape compliance

---

## 4. ANSWERED VS REMAINING QUESTIONS

| ID | Question | Status |
|---|---|---|
| Q1 | Where does system-spec-kit have the greatest doc/code drift? | Answered: validator graph-metadata shape, MCP tool dispatch coverage, ROLLOUT_FLAGS routing. |
| Q2 | Test-coverage gaps in validators? | Answered: graph-metadata shape, phase-parent edge cases, registry-owned phase rules. |
| Q3 | mcp-coco-index CLI/MCP routing match decision tree? | Answered: only `search` exposed via MCP; maintenance ops are CLI-only; documented but parity-incomplete. |
| Q4 | Is CocoIndex ingesting sk-code resources? | Answered: locally yes (override), defaults exclude `**/.*`; portable behavior unclear without smoke test. |
| Q5 | What OpenCode references/assets are missing? | Answered: skills/agents/commands authoring checklists, spec-folder write recipe, machine-readable STACK_FOLDERS contract, sub-detection scenarios for JS. |
| Q6 | Does STACK_FOLDERS match on-disk? | Answered: STACK_FOLDERS regressed to inline strings; no machine-readable contract. |
| Q7 | Is sk-code loaded during `/spec_kit:complete` writes inside `.opencode/`? | Answered: at review time, not authoring time — gap motivates F-009-001. |

All 7 key questions resolved.

---

## 5. PRIORITIZED REMEDIATION ROADMAP

The findings sequence into **4 dependent remediation phases**, each appropriate as a separate Level 1 packet child under a new parent (e.g. `078-opencode-authoring-recipe`):

### Phase 1 — sk-code OpenCode authoring recipe (foundation)

**Closes**: F-006-002, F-007-001, F-007-002, F-008-002, F-008-004, F-010-001, F-010-004, F-009-002

- Add `assets/opencode/checklists/{skill,agent,command,mcp-server,spec-folder}_authoring.md` (5 new files)
- Add `assets/opencode/recipes/spec_folder_write.md` (new file)
- Restore machine-readable STACK_FOLDERS contract in SKILL.md
- Update SKILL.md OpenCode resource map to point to new authoring assets
- Fix F-001-005 stale relative link in `references/opencode/shared/universal_patterns.md`

### Phase 2 — `/spec_kit:complete` authoring-time sk-code load (integration)

**Closes**: F-009-001, F-009-002, F-008-004, F-006-004

- Modify `/spec_kit:complete:auto` YAML to load sk-code at Phase 1 (before code writes), not just review
- Add OpenCode-target detection: when implementation target is under `.opencode/`, dispatch with sk-code authoring recipe pre-loaded
- Update `system-spec-kit/SKILL.md` to document the cross-skill load contract

### Phase 3 — CocoIndex canonical-priority + portability (indexing layer)

**Closes**: F-001-002, F-005-001, F-005-002, F-005-004, F-007-005, F-008-005, F-009-003, F-009-004

- Add `CANONICAL_RESOURCE_PATHS` setting that outranks regular search
- Add a smoke test asserting `.opencode/skills/sk-code/assets/opencode/` is ingested on a fresh clone
- Update `DEFAULT_EXCLUDED_PATTERNS` semantics so canonical paths under `**/.*` are explicitly opt-in
- Document the rank-priority contract in mcp-coco-index/SKILL.md

### Phase 4 — system-spec-kit validator + MCP tool drift (cleanup)

**Closes**: F-001-001, F-002-001, F-002-002, F-002-003, F-002-004, F-003-001, F-003-002, F-003-003, F-004-001, F-004-002, F-008-003, F-010-002

- Add `graph-metadata.json` JSON-schema-style validator to `validate.sh --strict`
- Add `description.json` shape check
- Audit ROLLOUT_FLAGS (and similar dir-typed RESOURCE_MAP entries) for `_guard_in_skill` compatibility
- Sync MCP tool registry vs SKILL.md docs (both directions)
- Refresh search telemetry doc to match runtime fields

### Phase 5 (optional) — refinements

**Closes**: P2 polish

- F-001-003: MCP `refresh_index=false` default + concurrent-refresh guard
- F-004-003 / F-004-004: startup-race + CLI scoping doc
- F-005-003: daemon restart on provider-change
- F-006-001 / F-006-003: JS sub-detection scenarios + post-domain path refs
- F-007-003 / F-007-004: alignment automation extension to Markdown assets

---

## 6. NEGATIVE KNOWLEDGE / RULED-OUT DIRECTIONS

| Direction | Why ruled out |
|---|---|
| Re-running stress matrix in this packet | Out of scope; prior 071/072/076 packets already characterize router behavior. |
| Touching motion_dev/ assets | Just shipped in 069 / sk-code v3.1.0.0; immutable for this packet. |
| Webflow stack changes | Out of scope by user request. |
| barter/coder/ mirror sync | Separate packet concern. |
| Modifying cli-* skills (codex/copilot/opencode/gemini/claude-code) | Out of scope; focus is the 3 named surfaces + their integration. |

---

## 7. ARTIFACTS

| Artifact | Path |
|---|---|
| 10 iteration narratives | `077/research/iterations/iteration-{001..010}.md` |
| Per-iteration deltas | `077/research/deltas/iter-{001..010}.jsonl` |
| Canonical state log | `077/research/deep-research-state.jsonl` (12 lines: 1 config + 1 init event + 10 iter records) |
| Strategy + machine-owned sections | `077/research/deep-research-strategy.md` |
| Findings registry | `077/research/findings-registry.json` |
| Iteration prompts | `077/research/prompts/iter-{001..010}.md` |
| Codex stdout per iter | `077/research/prompts/iter-{001..010}.codex.log` |
| This synthesis | `077/research/research.md` |
| Resource map | `077/research/resource-map.md` |
| Spec docs | `077/{spec,plan,tasks,implementation-summary}.md` |

---

## 8. VERDICT

**SHIP_REMEDIATION_AS_PHASES**: This research surfaced a coherent 4-phase remediation roadmap (with optional Phase 5) totaling ~25 P1+P2 finding closures. Each phase is independently shippable as a Level 1 packet child. Phase 1 (sk-code authoring recipe) is the foundation everything else builds on; Phase 4 (validator/MCP cleanup) is most independent and can be parallelized.

**Recommended next step**: User decides whether to scaffold `078-opencode-authoring-recipe` parent + 4 phase children, or to ship the remediation as a single bundled packet, or to defer until other priorities clear. This research packet (077) is complete and self-contained as a planning input.
