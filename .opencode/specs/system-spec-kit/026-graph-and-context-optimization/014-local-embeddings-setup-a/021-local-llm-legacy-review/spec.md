---
title: "Feature Specification: Local-LLM legacy and outdated-docs/config-drift review (post-014)"
description: "Review packet owning a 20-iter /spec_kit:deep-review:auto run that hunts residue from the local-LLM and embedding-default migration shipped in 014-local-embeddings-setup-a (code + docs + JSON/configs + assets), then surfaces a remediation plan."
trigger_phrases:
  - "local-llm legacy review"
  - "post-014 legacy hunt"
  - "embedding default drift"
  - "voyage residue"
  - "qwen3 residue"
  - "deep-review 015"
importance_tier: "normal"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "026-graph-and-context-optimization/014-local-embeddings-setup-a/021-local-llm-legacy-review"
    last_updated_at: "2026-05-13T13:07:09Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded L2 review packet for post-014 legacy hunt"
    next_safe_action: "Dispatch /spec_kit:deep-review:auto with cli-codex gpt-5.5 high fast, 20 iters, convergence 0.05"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/spec.md"
      - ".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
      - ".opencode/skills/mcp-coco-index/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-local-llm-legacy-review"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Local-LLM legacy and outdated-docs/config-drift review (post-014)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent track** | `026-graph-and-context-optimization` |
| **Source migration packet** | `026-graph-and-context-optimization/014-local-embeddings-setup-a` (18 child phases shipped) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 014 shipped a default-LLM and embedding-stack migration (Voyage → EmbeddingGemma-300m hf-local q8 for Memory MCP; google/embeddinggemma-300m sentence-transformers for CocoIndex; llama-cpp demoted to opt-in with auto-migrate; ONNX rejected). Pre-flight scan finds ~147 active-file residue surface across code, docs, JSON/configs, and assets where old defaults are still asserted or referenced (e.g. `ENV_REFERENCE.md` still claims "prefers voyage-4 then openai then hf-local"; `mcp-coco-index/INSTALL_GUIDE.md` still names voyage-code-3 primary; multiple READMEs still recommend `text-embedding-3-small`). No one has audited which references are stale vs intentional historical context.

### Purpose
Produce an authoritative findings list (P0/P1/P2) of code/doc/config residue that contradicts post-014 canonical defaults, and recommend either close-as-PASS-with-advisories or scaffold a `022-local-llm-legacy-remediation` packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (read-only review of these surfaces)

1. **Code** — `.ts`, `.py`, `.cjs` under `shared/`, `.opencode/skills/`, `scripts/`, `mcp_server/`, `cocoindex_code/`
2. **Markdown docs** — `SKILL.md`, `README*.md`, `INSTALL_GUIDE*.md`, references and assets under `.opencode/skills/**/references/**`, `.opencode/skills/**/assets/**`, `.opencode/install_guides/`, root
3. **JSON / config** — `description.json`, `graph-metadata.json` (per packet), `package.json`, `.utcp_config.json`, `.claude/mcp.json`, root `.mcp.json`, `opencode.json`, `_routes.yaml`, `.codex/config.toml`, `.gemini/settings.json`, `pyproject.toml`, `requirements*.txt`, `.opencode/settings*.json`, `.claude/settings*.json`
4. **Assets / templates / fixtures** — `assets/config_templates.md`, prompt packs, test fixtures, frozen sample text
5. **Resource maps** — `resource-map.md` files where relevant

### Out of Scope (intentional historical context — note but DO NOT flag as residue)
- `014-local-embeddings-setup-a/**` migration narrative — references to Voyage/Qwen3/MiniLM/ONNX are correct historical record
- `factory.ts` provider fallback chain (Voyage → OpenAI → hf-local) — this is a LIVING resolver, not legacy; if no key present, hf-local is reached, which is the correct behavior
- `doctor_memory.yaml` and `_routes.yaml` provider-detection branches — required for `/doctor` route diagnostics
- Vitest test fixtures that exercise Voyage/OpenAI fallback paths — regression protection
- Code-graph entries / spec memory rows that still contain the strings (data, not source)

### Files to Change (this packet)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `021-local-llm-legacy-review/review/iterations/iteration-NNN.md` | Create (per iter) | Per-iteration findings, owned by `/spec_kit:deep-review:auto` |
| `021-local-llm-legacy-review/review/deep-review-state.jsonl` | Append | State log |
| `021-local-llm-legacy-review/review/review-report.md` | Create | Final verdict + finding tables |
| `021-local-llm-legacy-review/implementation-summary.md` | Update | Post-run summary + verdict + next-step rec |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 20 iterations (or convergence) of `/spec_kit:deep-review:auto` | `deep-review-state.jsonl` contains complete iteration records up to convergence or 20-cap |
| REQ-002 | Produce `review-report.md` with verdict + P0/P1/P2 finding tables | File exists, non-empty, verdict ∈ {PASS, CONDITIONAL, FAIL} |
| REQ-003 | Executor must be cli-codex gpt-5.5 reasoning=high service_tier=fast | All iteration log entries record `executor.kind=cli-codex`, `executor.model=gpt-5.5`, `executor.serviceTier=fast` |
| REQ-004 | Read-only against repo (no rm/sed -i/mv outside `review/` artifacts) | `git status --porcelain` outside `021-local-llm-legacy-review/` unchanged vs baseline `5e7095d3336510b5756ba5cac383a8e08d1d79db` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Discriminate true residue from intentional historical context | Each P1/P2 finding's `disposition` field is one of `confirmed-residue \| intentional-historical \| ambiguous-needs-human` |
| REQ-006 | Hand-validate ≥3 P1 findings against source post-run | Reviewer confirms file:line evidence is real, not hallucinated |
| REQ-007 | Surface next-step recommendation | `implementation-summary.md` ends with either "PASS-with-advisories, close packet" or "Scaffold 022-local-llm-legacy-remediation packet" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` produced with non-empty findings tables and one of PASS/CONDITIONAL/FAIL
- **SC-002**: Verdict accuracy spot-check: ≥3 P1 findings hand-validated against source code/docs
- **SC-003**: Zero git mutations outside `021-local-llm-legacy-review/` (RM-8 scope discipline holds)
- **SC-004**: Run total walltime ≤ 5h (20 iters × 900s codex timeout ceiling)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex availability | Iteration dispatch fails | Codex quota check before dispatch; fallback executor is cli-claude-code |
| Risk | False-positive on factory fallback chain | Findings list noise | Pre-bound out-of-scope list in prompt body explicitly excludes factory.ts living-resolver lines |
| Risk | Premature convergence on shallow surface | Run stops at iter 4-6 with incomplete sweep | `--convergence=0.05` (tighter than default 0.10) |
| Risk | cli-codex sandbox blocks subprocess network | N/A for this review (no network needed) | Review is read-only against local filesystem |
| Risk | RM-8 destructive-scope violation | Files outside packet deleted/mutated | Prompt-pack BANNED OPERATIONS + scope-violation-as-finding protocol (Layer 1 mitigation) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes within 900s codex timeout
- **NFR-P02**: Total walltime ≤ 5h end-to-end

### Security
- **NFR-S01**: No `--dangerously-skip-permissions` style escalation; cli-codex `workspace-write` sandbox is the ceiling
- **NFR-S02**: No secrets/credentials read or surfaced in iteration files

### Reliability
- **NFR-R01**: Convergence detection runs every iteration via rolling-avg + MAD
- **NFR-R02**: P0 finding overrides early-stop (no premature pass)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty `review_target` glob: workflow refuses to start (Tier-3 fail-fast)
- Spec folder missing description.json/graph-metadata.json: scaffold step backfills before iter-1
- Iteration produces 0 findings: counts toward stuck_count

### Error Scenarios
- cli-codex timeout: iteration record marks `status=timeout`, next iter retries with same scope
- Codex API quota exhausted: workflow halts with explicit error; resumable later
- Discovered P0 mid-run: convergence is blocked; full 20 iters can run

### State Transitions
- Mid-run interruption: state log is append-only JSONL → resumable from last iteration record
- Convergence reached early (<20 iters): workflow emits `review-report.md` and exits cleanly
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~147 active files across code/docs/configs/assets; 5 surface families |
| Risk | 8/25 | Read-only; RM-8 layers in place; cli-codex sandbox bound |
| Research | 12/20 | Discrimination of residue vs intentional history requires judgment per finding |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Should `factory.ts` Voyage shadow-guard error message text count as residue if no user is on Voyage? (lean: intentional-historical, retained for future re-enable)
- Are `_routes.yaml` provider-detection branches considered up-to-date or pending narrowing post-014? (lean: living code, do not flag)
<!-- /ANCHOR:questions -->
