---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

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
.skilled/skills/cli-orca -- the standalone Orca routing skill: its SKILL.md router block, the four CLI references, the eight upstream asset snapshots, the official-skills layer, the feature catalog, the manual testing playbook, and the provenance record. The review also audits the surfaces the skill integrates with: the mcp-tooling hub boundary, the skill advisor identity and routing surfaces, the sk-doc authoring contracts, and the validators that judge them.

### Known Context

**Declared audit surfaces.** resource-map.md present at specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md (53 declared surfaces): Declared audit surfaces for the cli-orca deep review, written before review init so the coverage gate arms. One packet-level map for a root target, aggregating the skill package, the surfaces it integrates with, the contract validators it answers to, and the artifacts the review itself must produce.

**Review Charter addition -- Resource Map Coverage:** cross-check target_files from
`specs/cli-orca/002-consolidate-official-orca-skills/applied/T-*.md` against `specs/cli-orca/002-consolidate-official-orca-skills/resource-map.md` and classify only missed coverage as gaps.

**Executor binding.** `cli-pi` on `deepseek-v4.1-flash` (llmgateway route), reasoning pinned to
max, per-iteration executor timeout 1800s, five iterations, stop policy max-iterations.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- The vendored `context/orca-main` tree beyond the already-redacted client key.
- Live Orca runtime mutation; runtime-dependent playbook scenarios record SKIP when no Orca binary is present.
- Rotation of the upstream client key and any git history rewrite (operator-owned).
- Other skills outside the declared audit surfaces in the packet resource map.

---

## 5. STOP CONDITIONS
- Stop policy is `max-iterations` (5): convergence is telemetry only and never ends the loop early.
- A structural blocker (missing state artifact, failed mechanical iteration check twice for the same iteration, or an unusable executor route) halts for repair instead of continuing.

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
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Full-body shim read: reading `skill-advisor.cjs` end-to-end ruled out shell injection on the advisor surface in one pass (iteration 2)
- Literal acceptance-command replay: re-running AC-014's exact `git grep -E "AIza[0-9A-Za-z_-]{35}"` command plus a JSON validity check turned REQ-014 from spot-checked into confirmed (iteration 2)

---

## 9. WHAT FAILED
- Pattern-sweep-only guidance review: a bare `--force` sweep cannot distinguish a verbatim guide copy from local doctrine; the destructive-example block had to be read in context before it could be classified (iteration 2)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Bare-token routing** — a request containing only `orca`, with no multi-word phrase, matches no keyword and returns `UNKNOWN_FALLBACK` (`SKILL.md:119-123,155-158`). The bare token is not routed; `P1-001` concerns the generic vocabulary, not the token itself. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Bare-token routing** — a request containing only `orca`, with no multi-word phrase, matches no keyword and returns `UNKNOWN_FALLBACK` (`SKILL.md:119-123,155-158`). The bare token is not routed; `P1-001` concerns the generic vocabulary, not the token itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bare-token routing** — a request containing only `orca`, with no multi-word phrase, matches no keyword and returns `UNKNOWN_FALLBACK` (`SKILL.md:119-123,155-158`). The bare token is not routed; `P1-001` concerns the generic vocabulary, not the token itself.

### **Comment hygiene in scoped scripts** — zero hits for `ADR-`/`REQ-`/`CHK-`/task-id/spec-path labels across the eleven scoped scripts (compiled-route pair, doctor script, validators, advisor handlers). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Comment hygiene in scoped scripts** — zero hits for `ADR-`/`REQ-`/`CHK-`/task-id/spec-path labels across the eleven scoped scripts (compiled-route pair, doctor script, validators, advisor handlers).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Comment hygiene in scoped scripts** — zero hits for `ADR-`/`REQ-`/`CHK-`/task-id/spec-path labels across the eleven scoped scripts (compiled-route pair, doctor script, validators, advisor handlers).

### **Core `checklist_evidence`** — AC-014's "Met" status is corroborated by re-running its exact acceptance command (0 hits). Other rows untouched. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Core `checklist_evidence`** — AC-014's "Met" status is corroborated by re-running its exact acceptance command (0 hits). Other rows untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `checklist_evidence`** — AC-014's "Met" status is corroborated by re-running its exact acceptance command (0 hits). Other rows untouched.

### **Core `checklist_evidence`** — AC-014's exact command re-run this iteration; `tasks.md:160-175` re-read; the iteration-3 row-level replay stands unchanged; `P2-004` is the one conflicting row. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Core `checklist_evidence`** — AC-014's exact command re-run this iteration; `tasks.md:160-175` re-read; the iteration-3 row-level replay stands unchanged; `P2-004` is the one conflicting row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `checklist_evidence`** — AC-014's exact command re-run this iteration; `tasks.md:160-175` re-read; the iteration-3 row-level replay stands unchanged; `P2-004` is the one conflicting row.

### **Core `checklist_evidence`** — not re-run in this maintainability pass; the row-level replay from iteration 3 stands unchanged. No contradictory signal appeared in the documents read. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Core `checklist_evidence`** — not re-run in this maintainability pass; the row-level replay from iteration 3 stands unchanged. No contradictory signal appeared in the documents read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `checklist_evidence`** — not re-run in this maintainability pass; the row-level replay from iteration 3 stands unchanged. No contradictory signal appeared in the documents read.

### **Core `checklist_evidence`** — row-level replay this iteration: AC-005, AC-006 and AC-009 each corroborated by direct commands rather than prose; AC-001/002/004 not re-run (prior-iteration evidence only, no contradictory signal); AC-007 metadata presence confirmed (`specs/cli-orca/{description.json,graph-metadata.json}` exist); AC-008's contract-side claim confirmed (`skill-root-metadata-contract.md:54` lists eight class-S roots including `cli-orca`), with the fleet catalog's root count noted as environment-drifted by later unrelated work (cli-jev et al.) and therefore not re-scored. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Core `checklist_evidence`** — row-level replay this iteration: AC-005, AC-006 and AC-009 each corroborated by direct commands rather than prose; AC-001/002/004 not re-run (prior-iteration evidence only, no contradictory signal); AC-007 metadata presence confirmed (`specs/cli-orca/{description.json,graph-metadata.json}` exist); AC-008's contract-side claim confirmed (`skill-root-metadata-contract.md:54` lists eight class-S roots including `cli-orca`), with the fleet catalog's root count noted as environment-drifted by later unrelated work (cli-jev et al.) and therefore not re-scored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `checklist_evidence`** — row-level replay this iteration: AC-005, AC-006 and AC-009 each corroborated by direct commands rather than prose; AC-001/002/004 not re-run (prior-iteration evidence only, no contradictory signal); AC-007 metadata presence confirmed (`specs/cli-orca/{description.json,graph-metadata.json}` exist); AC-008's contract-side claim confirmed (`skill-root-metadata-contract.md:54` lists eight class-S roots including `cli-orca`), with the fleet catalog's root count noted as environment-drifted by later unrelated work (cli-jev et al.) and therefore not re-scored.

### **Core `checklist_evidence`** — tasks.md T035–T038, T045 carry completed status and their named evidence paths exist; T039–T046 are open, matching `Status: In Progress` in `spec.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Core `checklist_evidence`** — tasks.md T035–T038, T045 carry completed status and their named evidence paths exist; T039–T046 are open, matching `Status: In Progress` in `spec.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `checklist_evidence`** — tasks.md T035–T038, T045 carry completed status and their named evidence paths exist; T039–T046 are open, matching `Status: In Progress` in `spec.md`.

### **Core `spec_code`** — `P1-001` re-verified against `SKILL.md:58,101-167,268`. Prior REQ-005 (8/8 snapshots byte-identical), REQ-004/REQ-006 and REQ-009 (32/32 documents) evidence stands; REQ-014's literal command re-run this iteration (`rc=1`, zero hits); REQ-011/012/013 remain unmet by design; the `P2-004` conflict remains recorded. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Core `spec_code`** — `P1-001` re-verified against `SKILL.md:58,101-167,268`. Prior REQ-005 (8/8 snapshots byte-identical), REQ-004/REQ-006 and REQ-009 (32/32 documents) evidence stands; REQ-014's literal command re-run this iteration (`rc=1`, zero hits); REQ-011/012/013 remain unmet by design; the `P2-004` conflict remains recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `spec_code`** — `P1-001` re-verified against `SKILL.md:58,101-167,268`. Prior REQ-005 (8/8 snapshots byte-identical), REQ-004/REQ-006 and REQ-009 (32/32 documents) evidence stands; REQ-014's literal command re-run this iteration (`rc=1`, zero hits); REQ-011/012/013 remain unmet by design; the `P2-004` conflict remains recorded.

### **Core `spec_code`** — REQ-005 re-verified end-to-end: all 8 `assets/*.txt` snapshots are byte-identical to `context/orca-main/skills/<stem>/SKILL.md`. REQ-006 re-verified at probe level: positive Orca prompts rank `cli-orca` first (0.7, confidence 0.8962) and `negative_openorca` returns zero recommendations. REQ-009 re-run: 32/32 documents clean. REQ-010 holds in flight: both prior iterations end on parseable `Review verdict:` lines and 2 `"type":"iteration"` records exist before this append. REQ-003 was settled in iteration 1; REQ-011/012/013 remain Unmet by design (post-remediation work). The one mismatch found is P2-004. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Core `spec_code`** — REQ-005 re-verified end-to-end: all 8 `assets/*.txt` snapshots are byte-identical to `context/orca-main/skills/<stem>/SKILL.md`. REQ-006 re-verified at probe level: positive Orca prompts rank `cli-orca` first (0.7, confidence 0.8962) and `negative_openorca` returns zero recommendations. REQ-009 re-run: 32/32 documents clean. REQ-010 holds in flight: both prior iterations end on parseable `Review verdict:` lines and 2 `"type":"iteration"` records exist before this append. REQ-003 was settled in iteration 1; REQ-011/012/013 remain Unmet by design (post-remediation work). The one mismatch found is P2-004.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `spec_code`** — REQ-005 re-verified end-to-end: all 8 `assets/*.txt` snapshots are byte-identical to `context/orca-main/skills/<stem>/SKILL.md`. REQ-006 re-verified at probe level: positive Orca prompts rank `cli-orca` first (0.7, confidence 0.8962) and `negative_openorca` returns zero recommendations. REQ-009 re-run: 32/32 documents clean. REQ-010 holds in flight: both prior iterations end on parseable `Review verdict:` lines and 2 `"type":"iteration"` records exist before this append. REQ-003 was settled in iteration 1; REQ-011/012/013 remain Unmet by design (post-remediation work). The one mismatch found is P2-004.

### **Core `spec_code`** — REQ-014 verified end-to-end this iteration. AC-014's literal command `git grep -nE "AIza[0-9A-Za-z_-]{35}" -- specs/cli-orca/` exits 1 with no hits; the same pattern over `.skilled/skills/cli-orca` exits 1; the vendored `google-services.json` carries `current_key: REDACTED--removed-from-this-vendored-copy` and still parses as JSON (ADR-009). No high-confidence secret shapes (private keys, AWS, GitHub, OpenAI, Slack tokens) across `cli-orca`, `mcp-tooling`, advisor config/data. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Core `spec_code`** — REQ-014 verified end-to-end this iteration. AC-014's literal command `git grep -nE "AIza[0-9A-Za-z_-]{35}" -- specs/cli-orca/` exits 1 with no hits; the same pattern over `.skilled/skills/cli-orca` exits 1; the vendored `google-services.json` carries `current_key: REDACTED--removed-from-this-vendored-copy` and still parses as JSON (ADR-009). No high-confidence secret shapes (private keys, AWS, GitHub, OpenAI, Slack tokens) across `cli-orca`, `mcp-tooling`, advisor config/data.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `spec_code`** — REQ-014 verified end-to-end this iteration. AC-014's literal command `git grep -nE "AIza[0-9A-Za-z_-]{35}" -- specs/cli-orca/` exits 1 with no hits; the same pattern over `.skilled/skills/cli-orca` exits 1; the vendored `google-services.json` carries `current_key: REDACTED--removed-from-this-vendored-copy` and still parses as JSON (ADR-009). No high-confidence secret shapes (private keys, AWS, GitHub, OpenAI, Slack tokens) across `cli-orca`, `mcp-tooling`, advisor config/data.

### **Core `spec_code`** — sampled: REQ-001 class-S root shape verified (no hub-only `description.json`/`mode-registry.json`/`hub-router.json`; manifest 34 leaves, aliases set-equal, generated from config); REQ-002 hub nine modes verified (registry modes=9, `routerSignals` 9 keys, no Orca key, ROUTER.md clean); REQ-003 verified (all `mcp-orca` hits confined to changelog history, spec narrative and citations of moved evidence); REQ-005 verified byte-level (8/8 assets == vendored source == PROVENANCE `SKILL.md sha256`); REQ-014 spot-checked (no secret-pattern hits in cli-orca assets). REQ-004/REQ-006 rest on captured evidence in `scratch/gate-results.md` and `routing-replays.json` — recorded as claimed-not-reverified this iteration. REQ-013/T044 remain open (`tasks.md:154`), consistent with the in-progress packet state. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Core `spec_code`** — sampled: REQ-001 class-S root shape verified (no hub-only `description.json`/`mode-registry.json`/`hub-router.json`; manifest 34 leaves, aliases set-equal, generated from config); REQ-002 hub nine modes verified (registry modes=9, `routerSignals` 9 keys, no Orca key, ROUTER.md clean); REQ-003 verified (all `mcp-orca` hits confined to changelog history, spec narrative and citations of moved evidence); REQ-005 verified byte-level (8/8 assets == vendored source == PROVENANCE `SKILL.md sha256`); REQ-014 spot-checked (no secret-pattern hits in cli-orca assets). REQ-004/REQ-006 rest on captured evidence in `scratch/gate-results.md` and `routing-replays.json` — recorded as claimed-not-reverified this iteration. REQ-013/T044 remain open (`tasks.md:154`), consistent with the in-progress packet state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `spec_code`** — sampled: REQ-001 class-S root shape verified (no hub-only `description.json`/`mode-registry.json`/`hub-router.json`; manifest 34 leaves, aliases set-equal, generated from config); REQ-002 hub nine modes verified (registry modes=9, `routerSignals` 9 keys, no Orca key, ROUTER.md clean); REQ-003 verified (all `mcp-orca` hits confined to changelog history, spec narrative and citations of moved evidence); REQ-005 verified byte-level (8/8 assets == vendored source == PROVENANCE `SKILL.md sha256`); REQ-014 spot-checked (no secret-pattern hits in cli-orca assets). REQ-004/REQ-006 rest on captured evidence in `scratch/gate-results.md` and `routing-replays.json` — recorded as claimed-not-reverified this iteration. REQ-013/T044 remain open (`tasks.md:154`), consistent with the in-progress packet state.

### **Core `spec_code`** — version consistency verified: `SKILL.md:14`, `README.md:10` and `changelog/v0.1.0.0.md` all carry 0.1.0.0; the manifest configs carry no version field that could drift. Prior REQ-005/REQ-009/REQ-014 evidence is unaffected; the `P2-004` count conflict remains recorded and was not re-verified this iteration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Core `spec_code`** — version consistency verified: `SKILL.md:14`, `README.md:10` and `changelog/v0.1.0.0.md` all carry 0.1.0.0; the manifest configs carry no version field that could drift. Prior REQ-005/REQ-009/REQ-014 evidence is unaffected; the `P2-004` count conflict remains recorded and was not re-verified this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Core `spec_code`** — version consistency verified: `SKILL.md:14`, `README.md:10` and `changelog/v0.1.0.0.md` all carry 0.1.0.0; the manifest configs carry no version field that could drift. Prior REQ-005/REQ-009/REQ-014 evidence is unaffected; the `P2-004` count conflict remains recorded and was not re-verified this iteration.

### **Foreign-owner defer-guard bypass** — `route()` (`SKILL.md:159-161`) defers when a foreign phrase matches and no matched signal starts with `orca`; every phrase in the when-NOT table either has a `FOREIGN_OWNERS` entry or matches no `INTENT_SIGNALS` keyword and falls to `UNKNOWN_FALLBACK`. No foreign request escapes to an Orca lane. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Foreign-owner defer-guard bypass** — `route()` (`SKILL.md:159-161`) defers when a foreign phrase matches and no matched signal starts with `orca`; every phrase in the when-NOT table either has a `FOREIGN_OWNERS` entry or matches no `INTENT_SIGNALS` keyword and falls to `UNKNOWN_FALLBACK`. No foreign request escapes to an Orca lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Foreign-owner defer-guard bypass** — `route()` (`SKILL.md:159-161`) defers when a foreign phrase matches and no matched signal starts with `orca`; every phrase in the when-NOT table either has a `FOREIGN_OWNERS` entry or matches no `INTENT_SIGNALS` keyword and falls to `UNKNOWN_FALLBACK`. No foreign request escapes to an Orca lane.

### **Leaf-root claim** — README's "four leaf roots" claim matches `leaf-manifest.config.json:5-8` exactly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Leaf-root claim** — README's "four leaf roots" claim matches `leaf-manifest.config.json:5-8` exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Leaf-root claim** — README's "four leaf roots" claim matches `leaf-manifest.config.json:5-8` exactly.

### **Overlay `agent_cross_runtime` and `playbook_capability`** — not re-run; both were ruled out in iteration 1 and this iteration found no new cross-runtime or playbook evidence. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Overlay `agent_cross_runtime` and `playbook_capability`** — not re-run; both were ruled out in iteration 1 and this iteration found no new cross-runtime or playbook evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `agent_cross_runtime` and `playbook_capability`** — not re-run; both were ruled out in iteration 1 and this iteration found no new cross-runtime or playbook evidence.

### **Overlay `agent_cross_runtime`** — `.pi/skills` is a symlink to `.skilled/skills`; `cli-orca/SKILL.md` sha256 identical via both paths. No drift. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Overlay `agent_cross_runtime`** — `.pi/skills` is a symlink to `.skilled/skills`; `cli-orca/SKILL.md` sha256 identical via both paths. No drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `agent_cross_runtime`** — `.pi/skills` is a symlink to `.skilled/skills`; `cli-orca/SKILL.md` sha256 identical via both paths. No drift.

### **Overlay `agent_cross_runtime`** — carried pass: `.pi/skills/cli-orca` is content-identical to `.skilled/skills/cli-orca` (`diff -rq` rc=0, zero differing entries); not re-run. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Overlay `agent_cross_runtime`** — carried pass: `.pi/skills/cli-orca` is content-identical to `.skilled/skills/cli-orca` (`diff -rq` rc=0, zero differing entries); not re-run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `agent_cross_runtime`** — carried pass: `.pi/skills/cli-orca` is content-identical to `.skilled/skills/cli-orca` (`diff -rq` rc=0, zero differing entries); not re-run.

### **Overlay `agent_cross_runtime`** — not re-run; prior `diff -rq` parity (rc=0) stands. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Overlay `agent_cross_runtime`** — not re-run; prior `diff -rq` parity (rc=0) stands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `agent_cross_runtime`** — not re-run; prior `diff -rq` parity (rc=0) stands.

### **Overlay `agent_cross_runtime`** — pass, and the earlier rationale is corrected: `.pi/skills/cli-orca` is a real directory, not a symlink, but `diff -rq` against `.skilled/skills/cli-orca` returns rc=0 with zero differing entries. Cross-runtime parity is therefore verified by content, which is the stronger proof; the iteration-1 "single source via symlink" explanation was inaccurate though its conclusion held. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Overlay `agent_cross_runtime`** — pass, and the earlier rationale is corrected: `.pi/skills/cli-orca` is a real directory, not a symlink, but `diff -rq` against `.skilled/skills/cli-orca` returns rc=0 with zero differing entries. Cross-runtime parity is therefore verified by content, which is the stronger proof; the iteration-1 "single source via symlink" explanation was inaccurate though its conclusion held.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `agent_cross_runtime`** — pass, and the earlier rationale is corrected: `.pi/skills/cli-orca` is a real directory, not a symlink, but `diff -rq` against `.skilled/skills/cli-orca` returns rc=0 with zero differing entries. Cross-runtime parity is therefore verified by content, which is the stronger proof; the iteration-1 "single source via symlink" explanation was inaccurate though its conclusion held.

### **Overlay `feature_catalog_code`** — browser ownership matrix consistent across `SKILL.md:51-55`, `mutation-and-browser-boundaries.md:80-86` and `README.md:24,35`: CDP to `mcp-chrome-devtools`, generic agentic browser to `mcp-aside-devtools`, desktop to `computer-use`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Overlay `feature_catalog_code`** — browser ownership matrix consistent across `SKILL.md:51-55`, `mutation-and-browser-boundaries.md:80-86` and `README.md:24,35`: CDP to `mcp-chrome-devtools`, generic agentic browser to `mcp-aside-devtools`, desktop to `computer-use`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `feature_catalog_code`** — browser ownership matrix consistent across `SKILL.md:51-55`, `mutation-and-browser-boundaries.md:80-86` and `README.md:24,35`: CDP to `mcp-chrome-devtools`, generic agentic browser to `mcp-aside-devtools`, desktop to `computer-use`.

### **Overlay `feature_catalog_code`** — carried pass: the catalog index maps to its five per-feature documents and 161 relative links resolve with 0 broken. Resource-map rows for the sub-documents remain missing (`P2-005`). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Overlay `feature_catalog_code`** — carried pass: the catalog index maps to its five per-feature documents and 161 relative links resolve with 0 broken. Resource-map rows for the sub-documents remain missing (`P2-005`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `feature_catalog_code`** — carried pass: the catalog index maps to its five per-feature documents and 161 relative links resolve with 0 broken. Resource-map rows for the sub-documents remain missing (`P2-005`).

### **Overlay `feature_catalog_code`** — catalog subfiles, benchmark report and replay file exist at declared paths; 0 dangling relative links across 32 cli-orca markdown files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Overlay `feature_catalog_code`** — catalog subfiles, benchmark report and replay file exist at declared paths; 0 dangling relative links across 32 cli-orca markdown files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `feature_catalog_code`** — catalog subfiles, benchmark report and replay file exist at declared paths; 0 dangling relative links across 32 cli-orca markdown files.

### **Overlay `feature_catalog_code`** — pass. The catalog index maps its five entries to per-feature documents that exist; the corpus-wide link scan (161 links) resolves every relative markdown link with 0 broken. The map's missing rows for those same documents are captured by P2-005, not repeated here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Overlay `feature_catalog_code`** — pass. The catalog index maps its five entries to per-feature documents that exist; the corpus-wide link scan (161 links) resolves every relative markdown link with 0 broken. The map's missing rows for those same documents are captured by P2-005, not repeated here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `feature_catalog_code`** — pass. The catalog index maps its five entries to per-feature documents that exist; the corpus-wide link scan (161 links) resolves every relative markdown link with 0 broken. The map's missing rows for those same documents are captured by P2-005, not repeated here.

### **Overlay `feature_catalog_code`** — the catalog's routing and safety documents are among the six restatement sites and were scanned in this pass; no matrix string divergence was found between them and SKILL.md/README. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Overlay `feature_catalog_code`** — the catalog's routing and safety documents are among the six restatement sites and were scanned in this pass; no matrix string divergence was found between them and SKILL.md/README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `feature_catalog_code`** — the catalog's routing and safety documents are among the six restatement sites and were scanned in this pass; no matrix string divergence was found between them and SKILL.md/README.

### **Overlay `playbook_capability`** — `hub-deferral-receipt.md` read end-to-end: it is a proper deterministic scenario contract (objective, real user request, expected signals, pass/fail), not run debris. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Overlay `playbook_capability`** — `hub-deferral-receipt.md` read end-to-end: it is a proper deterministic scenario contract (objective, real user request, expected signals, pass/fail), not run debris.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `playbook_capability`** — `hub-deferral-receipt.md` read end-to-end: it is a proper deterministic scenario contract (objective, real user request, expected signals, pass/fail), not run debris.

### **Overlay `playbook_capability`** — carried pass: 8 deterministic scenarios across 4 categories exist on disk; execution verdicts are deferred to the AC-013 post-remediation wave. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Overlay `playbook_capability`** — carried pass: 8 deterministic scenarios across 4 categories exist on disk; execution verdicts are deferred to the AC-013 post-remediation wave.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `playbook_capability`** — carried pass: 8 deterministic scenarios across 4 categories exist on disk; execution verdicts are deferred to the AC-013 post-remediation wave.

### **Overlay `playbook_capability`** — ORCA-002 pins the OpenOrca and generic-worktree holdouts (both defer under the documented algorithm); the generic terminal/browser class is unpinned, which is the fixture gap feeding P1-001. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Overlay `playbook_capability`** — ORCA-002 pins the OpenOrca and generic-worktree holdouts (both defer under the documented algorithm); the generic terminal/browser class is unpinned, which is the fixture gap feeding P1-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `playbook_capability`** — ORCA-002 pins the OpenOrca and generic-worktree holdouts (both defer under the documented algorithm); the generic terminal/browser class is unpinned, which is the fixture gap feeding P1-001.

### **Overlay `playbook_capability`** — pass (structural). The index claims 8 deterministic scenarios across 4 categories, and 8 scenario/receipt files exist across routing (2), runtime (3), ownership (2) and handoffs (1). Execution verdicts are deferred to the AC-013 post-remediation wave by the packet's own plan. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Overlay `playbook_capability`** — pass (structural). The index claims 8 deterministic scenarios across 4 categories, and 8 scenario/receipt files exist across routing (2), runtime (3), ownership (2) and handoffs (1). Execution verdicts are deferred to the AC-013 post-remediation wave by the packet's own plan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `playbook_capability`** — pass (structural). The index claims 8 deterministic scenarios across 4 categories, and 8 scenario/receipt files exist across routing (2), runtime (3), ownership (2) and handoffs (1). Execution verdicts are deferred to the AC-013 post-remediation wave by the packet's own plan.

### **Overlay `skill_agent`** — carried pass: no agent definition pins `cli-orca`; advisor identity live at generation 65 per the replay record. No new evidence. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Overlay `skill_agent`** — carried pass: no agent definition pins `cli-orca`; advisor identity live at generation 65 per the replay record. No new evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `skill_agent`** — carried pass: no agent definition pins `cli-orca`; advisor identity live at generation 65 per the replay record. No new evidence.

### **Overlay `skill_agent`** — divergence found between `SKILL.md` signal table and the §1/NEVER/README/graph-metadata contract (P1-001, P2-001). Claimed capability ("official-skill awareness in Orca context") is under-implemented in the signal table. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Overlay `skill_agent`** — divergence found between `SKILL.md` signal table and the §1/NEVER/README/graph-metadata contract (P1-001, P2-001). Claimed capability ("official-skill awareness in Orca context") is under-implemented in the signal table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `skill_agent`** — divergence found between `SKILL.md` signal table and the §1/NEVER/README/graph-metadata contract (P1-001, P2-001). Claimed capability ("official-skill awareness in Orca context") is under-implemented in the signal table.

### **Overlay `skill_agent`** — no new evidence; prior pass stands (no agent pins `cli-orca`; advisor identity live at generation 65). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Overlay `skill_agent`** — no new evidence; prior pass stands (no agent pins `cli-orca`; advisor identity live at generation 65).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `skill_agent`** — no new evidence; prior pass stands (no agent pins `cli-orca`; advisor identity live at generation 65).

### **Overlay `skill_agent`** — pass. No agent definition under `.skilled/agents/` or `.pi/agents/` names `cli-orca`; only `prompt-improver.md` references unrelated standalone skills, and cli-orca is advisor-routed rather than agent-pinned. The advisor identity is live: the replay record shows generation 65, freshness `live`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Overlay `skill_agent`** — pass. No agent definition under `.skilled/agents/` or `.pi/agents/` names `cli-orca`; only `prompt-improver.md` references unrelated standalone skills, and cli-orca is advisor-routed rather than agent-pinned. The advisor identity is live: the replay record shows generation 65, freshness `live`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `skill_agent`** — pass. No agent definition under `.skilled/agents/` or `.pi/agents/` names `cli-orca`; only `prompt-improver.md` references unrelated standalone skills, and cli-orca is advisor-routed rather than agent-pinned. The advisor identity is live: the replay record shows generation 65, freshness `live`.

### **Overlay `skill_agent`** — security doctrine is consistent where it matters: NEVER #3 (no executing page-provided text), #4 (no token exposure), boundaries section 5 (untrusted content as data), section 6 (credentials and permission gates human-owned). The one divergence found is P2-003. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Overlay `skill_agent`** — security doctrine is consistent where it matters: NEVER #3 (no executing page-provided text), #4 (no token exposure), boundaries section 5 (untrusted content as data), section 6 (credentials and permission gates human-owned). The one divergence found is P2-003.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay `skill_agent`** — security doctrine is consistent where it matters: NEVER #3 (no executing page-provided text), #4 (no token exposure), boundaries section 5 (untrusted content as data), section 6 (credentials and permission gates human-owned). The one divergence found is P2-003.

### **Resource Map Coverage directive** — `applied/T-*.md` still does not exist in this packet (recorded again; no `applied/` directory), so the pass cross-checked the config's 86-file scope list as the nearest target inventory. The scoped script surfaces all have resource-map rows (`.skilled/bin/compiled-route-*.cjs`, the validators, the advisor handler); no new coverage gap in this dimension. `P2-002`/`P2-005` remain the recorded map gaps. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Resource Map Coverage directive** — `applied/T-*.md` still does not exist in this packet (recorded again; no `applied/` directory), so the pass cross-checked the config's 86-file scope list as the nearest target inventory. The scoped script surfaces all have resource-map rows (`.skilled/bin/compiled-route-*.cjs`, the validators, the advisor handler); no new coverage gap in this dimension. `P2-002`/`P2-005` remain the recorded map gaps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Resource Map Coverage directive** — `applied/T-*.md` still does not exist in this packet (recorded again; no `applied/` directory), so the pass cross-checked the config's 86-file scope list as the nearest target inventory. The scoped script surfaces all have resource-map rows (`.skilled/bin/compiled-route-*.cjs`, the validators, the advisor handler); no new coverage gap in this dimension. `P2-002`/`P2-005` remain the recorded map gaps.

### **Resource Map Coverage directive** — `applied/T-*.md` still does not exist, so the directive cross-check remains untriggerable; the config's 86-file scope list was used as the fallback inventory and no new coverage gap was found beyond `P2-002`/`P2-005`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Resource Map Coverage directive** — `applied/T-*.md` still does not exist, so the directive cross-check remains untriggerable; the config's 86-file scope list was used as the fallback inventory and no new coverage gap was found beyond `P2-002`/`P2-005`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Resource Map Coverage directive** — `applied/T-*.md` still does not exist, so the directive cross-check remains untriggerable; the config's 86-file scope list was used as the fallback inventory and no new coverage gap was found beyond `P2-002`/`P2-005`.

### **Route-script copy-paste** — `compiled-route-status.cjs` composes the shared `./lib/compiled-route-manifest.cjs` and `./lib/compiled-route-layout.cjs` modules; the shared helper definitions appear once and are absent from `compiled-route-sync.cjs`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Route-script copy-paste** — `compiled-route-status.cjs` composes the shared `./lib/compiled-route-manifest.cjs` and `./lib/compiled-route-layout.cjs` modules; the shared helper definitions appear once and are absent from `compiled-route-sync.cjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Route-script copy-paste** — `compiled-route-status.cjs` composes the shared `./lib/compiled-route-manifest.cjs` and `./lib/compiled-route-layout.cjs` modules; the shared helper definitions appear once and are absent from `compiled-route-sync.cjs`.

### **Routed-resource guard evasion** — `_guard_in_skill()` (`SKILL.md:134-140`) confines resolution to `SKILL_ROOT` via `relative_to` and rejects non-markdown suffixes; `route()` (`SKILL.md:163-166`) halts when a mapped resource is missing from `discover_markdown_resources()`. No path escape and no unregistered resource load. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Routed-resource guard evasion** — `_guard_in_skill()` (`SKILL.md:134-140`) confines resolution to `SKILL_ROOT` via `relative_to` and rejects non-markdown suffixes; `route()` (`SKILL.md:163-166`) halts when a mapped resource is missing from `discover_markdown_resources()`. No path escape and no unregistered resource load.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Routed-resource guard evasion** — `_guard_in_skill()` (`SKILL.md:134-140`) confines resolution to `SKILL_ROOT` via `relative_to` and rejects non-markdown suffixes; `route()` (`SKILL.md:163-166`) halts when a mapped resource is missing from `discover_markdown_resources()`. No path escape and no unregistered resource load.

### **Secret exposure in the scoped trees** — AC-014's literal pattern re-run over `specs/cli-orca/` and `.skilled/skills/cli-orca/`: rc=1, zero hits. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Secret exposure in the scoped trees** — AC-014's literal pattern re-run over `specs/cli-orca/` and `.skilled/skills/cli-orca/`: rc=1, zero hits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secret exposure in the scoped trees** — AC-014's literal pattern re-run over `specs/cli-orca/` and `.skilled/skills/cli-orca/`: rc=1, zero hits.

### **Snapshot maintenance gap** — assets are pinned by release revision, package digest and sha256, and `PROVENANCE.md` documents the refresh procedure and the mismatch policy (record instead of guessing). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Snapshot maintenance gap** — assets are pinned by release revision, package digest and sha256, and `PROVENANCE.md` documents the refresh procedure and the mismatch policy (record instead of guessing).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Snapshot maintenance gap** — assets are pinned by release revision, package digest and sha256, and `PROVENANCE.md` documents the refresh procedure and the mismatch policy (record instead of guessing).

### **Stale generated graph metadata** — all `path`/`key_files` values in the three scoped `graph-metadata.json` files resolve on disk; the only non-resolving strings are bare `name` display fields and trigger phrases, which are not paths (`cli-orca` metadata 88-117; advisor 103-143; mcp-tooling 198-201). Initial "missing" hits were false positives, verified against `find` output. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Stale generated graph metadata** — all `path`/`key_files` values in the three scoped `graph-metadata.json` files resolve on disk; the only non-resolving strings are bare `name` display fields and trigger phrases, which are not paths (`cli-orca` metadata 88-117; advisor 103-143; mcp-tooling 198-201). Initial "missing" hits were false positives, verified against `find` output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Stale generated graph metadata** — all `path`/`key_files` values in the three scoped `graph-metadata.json` files resolve on disk; the only non-resolving strings are bare `name` display fields and trigger phrases, which are not paths (`cli-orca` metadata 88-117; advisor 103-143; mcp-tooling 198-201). Initial "missing" hits were false positives, verified against `find` output.

### **Version drift** — SKILL.md, README and changelog all record 0.1.0.0. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Version drift** — SKILL.md, README and changelog all record 0.1.0.0.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Version drift** — SKILL.md, README and changelog all record 0.1.0.0.

### `PROVENANCE.md` package-digest column differing from file hashes — column 3 is the upstream package digest; column 5 is the `SKILL.md` sha256 and matches all eight files. Correct by design. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `PROVENANCE.md` package-digest column differing from file hashes — column 3 is the upstream package digest; column 5 is the `SKILL.md` sha256 and matches all eight files. Correct by design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `PROVENANCE.md` package-digest column differing from file hashes — column 3 is the upstream package digest; column 5 is the `SKILL.md` sha256 and matches all eight files. Correct by design.

### `route-exclusions.json` containing only `sk-communication` — Orca probes do not require an advisory exclusion entry; the TS loader is fail-safe. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `route-exclusions.json` containing only `sk-communication` — Orca probes do not require an advisory exclusion entry; the TS loader is fail-safe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `route-exclusions.json` containing only `sk-communication` — Orca probes do not require an advisory exclusion entry; the TS loader is fail-safe.

### Advisor replay contradiction (REQ-006) — the negative holdout probe returns zero recommendations while positive probes rank `cli-orca` first. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Advisor replay contradiction (REQ-006) — the negative holdout probe returns zero recommendations while positive probes rank `cli-orca` first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Advisor replay contradiction (REQ-006) — the negative holdout probe returns zero recommendations while positive probes rank `cli-orca` first.

### Archive-gate authority bypass — the `--force`-does-not-bypass rule and the human-owned override are stated consistently across four documents; P2-003 concerns example annotation, not a contradictory rule. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Archive-gate authority bypass — the `--force`-does-not-bypass rule and the human-owned override are stated consistently across four documents; P2-003 concerns example annotation, not a contradictory rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Archive-gate authority bypass — the `--force`-does-not-bypass rule and the human-owned override are stated consistently across four documents; P2-003 concerns example annotation, not a contradictory rule.

### Broken internal links / stale references in the cli-orca corpus — 161 resolved, 0 broken. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Broken internal links / stale references in the cli-orca corpus — 161 resolved, 0 broken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broken internal links / stale references in the cli-orca corpus — 161 resolved, 0 broken.

### Browser ownership drift — matrix consistent across SKILL.md, boundaries reference and README. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Browser ownership drift — matrix consistent across SKILL.md, boundaries reference and README.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Browser ownership drift — matrix consistent across SKILL.md, boundaries reference and README.

### Command injection in scoped script surfaces — `skill-advisor.cjs` spawns `process.execPath` with a fixed dist path and argv passthrough, no `shell: true` (socket dir created mode 0700); advisor handler and doctor script use list-form `execFileSync`; Python validators use `subprocess.run` list form; nothing routes user text into a shell. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Command injection in scoped script surfaces — `skill-advisor.cjs` spawns `process.execPath` with a fixed dist path and argv passthrough, no `shell: true` (socket dir created mode 0700); advisor handler and doctor script use list-form `execFileSync`; Python validators use `subprocess.run` list form; nothing routes user text into a shell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Command injection in scoped script surfaces — `skill-advisor.cjs` spawns `process.execPath` with a fixed dist path and argv passthrough, no `shell: true` (socket dir created mode 0700); advisor handler and doctor script use list-form `execFileSync`; Python validators use `subprocess.run` list form; nothing routes user text into a shell.

### Credential-output doctrine — section 6 plus NEVER #4 forbid printing tokens or credentials; troubleshooting requires redacting credentials while preserving error codes. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Credential-output doctrine — section 6 plus NEVER #4 forbid printing tokens or credentials; troubleshooting requires redacting credentials while preserving error codes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential-output doctrine — section 6 plus NEVER #4 forbid printing tokens or credentials; troubleshooting requires redacting credentials while preserving error codes.

### Cross-runtime mirror drift — `diff -rq .skilled/skills/cli-orca .pi/skills/cli-orca` rc=0, zero differing entries; supersedes the symlink-based rationale from iteration 1. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Cross-runtime mirror drift — `diff -rq .skilled/skills/cli-orca .pi/skills/cli-orca` rc=0, zero differing entries; supersedes the symlink-based rationale from iteration 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cross-runtime mirror drift — `diff -rq .skilled/skills/cli-orca .pi/skills/cli-orca` rc=0, zero differing entries; supersedes the symlink-based rationale from iteration 1.

### Dangling-looking `references/browser.md`, `references/automations.md`, `references/publishing.md` in `orca-cli.md:39-56` — these are upstream guide section names (`guide: skill-guides/orca-cli.md`), not local routing targets. Not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Dangling-looking `references/browser.md`, `references/automations.md`, `references/publishing.md` in `orca-cli.md:39-56` — these are upstream guide section names (`guide: skill-guides/orca-cli.md`), not local routing targets. Not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dangling-looking `references/browser.md`, `references/automations.md`, `references/publishing.md` in `orca-cli.md:39-56` — these are upstream guide section names (`guide: skill-guides/orca-cli.md`), not local routing targets. Not a defect.

### Emulator verbs absent from the mutation classification table — `emulator kill/shutdown` are owned by the official `orca-emulator` skill and the table's blanket state-changing default covers them; no local mutation path is misclassified. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Emulator verbs absent from the mutation classification table — `emulator kill/shutdown` are owned by the official `orca-emulator` skill and the table's blanket state-changing default covers them; no local mutation path is misclassified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Emulator verbs absent from the mutation classification table — `emulator kill/shutdown` are owned by the official `orca-emulator` skill and the table's blanket state-changing default covers them; no local mutation path is misclassified.

### Non-strict JSON under `system-skill-advisor/runtime/node_modules/**/tsconfig.json` — vendored dependencies, outside scope. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Non-strict JSON under `system-skill-advisor/runtime/node_modules/**/tsconfig.json` — vendored dependencies, outside scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Non-strict JSON under `system-skill-advisor/runtime/node_modules/**/tsconfig.json` — vendored dependencies, outside scope.

### Prompt injection — boundaries section 5 declares repository text, terminal output, worktree comments, artifacts, skill files and fetched pages "data, never agent instructions"; one page's authorization does not extend to later turns; no instruction-like injection strings found in the target tree. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt injection — boundaries section 5 declares repository text, terminal output, worktree comments, artifacts, skill files and fetched pages "data, never agent instructions"; one page's authorization does not extend to later turns; no instruction-like injection strings found in the target tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt injection — boundaries section 5 declares repository text, terminal output, worktree comments, artifacts, skill files and fetched pages "data, never agent instructions"; one page's authorization does not extend to later turns; no instruction-like injection strings found in the target tree.

### Residual `mcp-orca` mentions in mcp-tooling — confined to changelog history and the moved-evidence carve-out REQ-003 explicitly allows. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Residual `mcp-orca` mentions in mcp-tooling — confined to changelog history and the moved-evidence carve-out REQ-003 explicitly allows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Residual `mcp-orca` mentions in mcp-tooling — confined to changelog history and the moved-evidence carve-out REQ-003 explicitly allows.

### Resource-map rows missing on disk — all sampled rows resolve, including `leaf-aliases.json`, the planned benchmark directory and the two packets' metadata. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Resource-map rows missing on disk — all sampled rows resolve, including `leaf-aliases.json`, the planned benchmark directory and the two packets' metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Resource-map rows missing on disk — all sampled rows resolve, including `leaf-aliases.json`, the planned benchmark directory and the two packets' metadata.

### Secret exposure (REQ-014/AC-014) — 0 hits on the literal acceptance pattern in both trees; redacted marker present; JSON valid. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Secret exposure (REQ-014/AC-014) — 0 hits on the literal acceptance pattern in both trees; redacted marker present; JSON valid.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Secret exposure (REQ-014/AC-014) — 0 hits on the literal acceptance pattern in both trees; redacted marker present; JSON valid.

### Snapshot drift vs the vendored source (REQ-005) — 8/8 assets byte-identical. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Snapshot drift vs the vendored source (REQ-005) — 8/8 assets byte-identical.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Snapshot drift vs the vendored source (REQ-005) — 8/8 assets byte-identical.

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
- [Approach]: [Why ruled out] (iteration N, evidence: [source])
- Cross-runtime mirror drift: `.pi/skills/cli-orca` diff against `.skilled/skills/cli-orca` returns rc=0 with zero differing entries (iteration 3, evidence: direct `diff -rq`; supersedes the iteration-1 symlink rationale)
- Snapshot drift vs vendored source: 8/8 assets byte-identical to `context/orca-main/skills/<stem>/SKILL.md` (iteration 3, evidence: byte compare)
- Advisor replay contradiction: `negative_openorca` probe returns zero recommendations while positive Orca probes rank cli-orca first (iteration 3, evidence: routing-replays.json probes)
- Broken internal links / stale references: 161 markdown links across the cli-orca corpus resolve, 0 broken (iteration 3, evidence: link-graph scan)
- Resource-map rows missing on disk: all sampled rows resolve, including leaf-aliases.json and the planned benchmark directories (iteration 3, evidence: path existence sweep)
- Stale graph metadata: false positives - bare name fields and trigger phrases; all path/key_files entries resolve (iteration 4)
- Comment hygiene: 0 ADR/REQ/task-id labels across eleven scoped scripts (iteration 4)
- Route-script copy-paste: helpers extracted to ./lib/compiled-route-manifest.cjs and ./lib/compiled-route-layout.cjs (iteration 4)
- Version drift: 0.1.0.0 consistent across SKILL.md, README, changelog (iteration 4)
- Snapshot maintenance gap: digest-pinned snapshots with documented refresh procedure (iteration 4)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

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
| `spec_code` | core | partial | 3 | REQ-005 8/8 snapshots byte-identical; REQ-006 replay holds both directions; REQ-009 32/32 validators clean; P2-004 = stale corpus count in tasks.md:169 |
| `checklist_evidence` | core | partial | 3 | AC-005/006/009 re-run and corroborated; AC-001/002/004 not re-run; one conflicting row (P2-004) |
| `skill_agent` | overlay | pass | 3 | No agent definition names cli-orca; advisor identity live at generation 65 |
| `agent_cross_runtime` | overlay | pass | 3 | `.pi/skills/cli-orca` content-identical to `.skilled` source (diff rc=0); symlink rationale superseded |
| `feature_catalog_code` | overlay | pass | 3 | Catalog index maps to 5 existing per-feature docs; 161-link corpus scan 0 broken |
| `playbook_capability` | overlay | partial | 3 | 8 scenario/receipt files across 4 categories exist; execution verdicts deferred to AC-013 |
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
- Max iterations: [from config]
- Convergence threshold: [from config]
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=[from config.sessionId], parentSessionId=[from config.parentSessionId], generation=[from config.generation], lineageMode=[from config.lineageMode]
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Severity threshold: [from config.severityThreshold]
- Review target type: [from config.reviewTargetType]
- Cross-reference checks: core=[from config.crossReference.core], overlay=[from config.crossReference.overlay]
- Started: [timestamp]
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```

---

## 10. ITERATION 5 CLOSE-OUT (FINAL)

- Correctness pass re-verified P1-001 with direct evidence: SKILL.md:104 ("embedded browser"), SKILL.md:103 ("read the terminal", "send to the terminal", "terminal receipt"), SKILL.md:150-153 (no qualifier gate), against SKILL.md:58 and NEVER #7 at SKILL.md:268. Finding remains active; the run ends CONDITIONAL.
- No new findings (new-finding ratio 0.0). Resource-map gaps P2-002/P2-005 re-confirmed from resource-map.md:62-65; ledger count P2-004 re-confirmed from tasks.md:169 (checked=31 vs 32).
- Iteration 5 of 5 complete; the dimension cycle is closed; synthesis follows.
- State append: gateway rc=1; state-record writer rc=2; iteration rows now 4.
- State append correction: gateway rc=1 (unrecognized event format, as in iterations 3-4); the dedicated state-record writer requires the state-log path argument and succeeded on the second invocation; iteration rows now 5 (last iteration 5).
