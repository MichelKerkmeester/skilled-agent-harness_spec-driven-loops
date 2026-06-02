---
title: "Implementation Summary: /doctor + Install-Guide Alignment"
description: "Aligned the /doctor command surface and the three subsystem install guides to shipped reality via a five-cluster disjoint parallel sweep (25 files), adversarial verification, and orchestrator fix-ups (install-README Ollama-default + a confirmed mcp-doctor.sh inverted-logic bug). Final re-grep clean; opencode.json valid; mcp-doctor.sh bash -n clean."
trigger_phrases:
  - "doctor install alignment summary"
  - "doctor mutation class read-only"
  - "code-graph db path skill-local docs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-doctor-install-alignment"
    last_updated_at: "2026-06-02T20:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Five-cluster sweep + fix-ups shipped; verifiers + re-grep clean"
    next_safe_action: "Generate metadata, validate --strict, commit"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/install_guides/README.md"
      - ".opencode/skills/system-skill-advisor/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-remediation-session"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Implementation Summary: /doctor + Install-Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/131-doctor-install-alignment` |
| **Completed** | 2026-06-02 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Brought the `/doctor` command surface and the three subsystem install guides into exact agreement with shipped reality (~148 audited misalignments), executed as a five-cluster disjoint parallel sweep plus adversarial verification, then orchestrator fix-ups. 25 files were edited (Cluster C made 0 edits by design).

**Cluster A — /doctor command surface (12 files).** `_routes.yaml`, `speckit.md`, `mcp.md`, `update.md`, `assets/{doctor_update,doctor_mcp_install,doctor_mcp_debug,doctor_skill-advisor,doctor_memory,doctor_causal-graph,doctor_deep-loop}.yaml`, `scripts/mcp-doctor.sh`. Themes: R2 mutation-class reconciliation (memory/causal-graph/code-graph/deep-loop overstated `mutates`/`add-only` → `read-only` to match the read-only `doctor.sh` scripts; KEPT skill-advisor=`mutates` because it genuinely applies edits, and install/debug/update=`mutates`); R1 stale code-graph DB path → skill-local; R3 "all 6 MCP servers" → "all 5"; R4 dropped unsupported `:apply`/`:apply-confirm` suffixes and per-subsystem colon-forms but KEPT `/doctor:mcp` and `/doctor:update` (the surviving colon commands — the audit was WRONG to say retire them); R6 fixed `doctor_skill-advisor.yaml` rebuild target (was rebuilding system-spec-kit; now system-skill-advisor) and the stale lane tuple; Node 18+ → >=20.11.

**Cluster B — system-spec-kit docs (7 files).** `README.md`, `mcp_server/README.md`, `mcp_server/INSTALL_GUIDE.md`, `opencode.json`, `feature_catalog/16--tooling-and-scripts/232-...`, `manual_testing_playbook/23--doctor-commands/README.md`, `manual_testing_playbook/manual_testing_playbook.md`. Themes R1/R3/R4/R5/R6: 35→36 tools (incl. `opencode.json:33` note), Node 18→>=20.11, drop phantom v1.8.1, "6 servers"→5, embeddings wording, launcher-vs-backend, invalid MCP-call examples. Preserved the recently-shipped 014 README additions.

**Cluster C — system-code-graph docs: 0 edits.** The only old-path references are legitimate historical/migration context (`INSTALL_GUIDE.md:53,211` + `database_path_policy.md` migration log) that already name skill-local as canonical — preserved, not rewritten.

**Cluster D — system-skill-advisor docs (4 files).** `README.md`, `INSTALL_GUIDE.md`, `references/scoring/advisor_scorer.md`, `references/scoring/lane_weight_tuning.md`. Themes R6/R11: lane ids → `explicit_author/lexical/graph_causal/derived_generated/semantic_shadow`; `semantic_shadow` is LIVE (not shadow-only); "9 public" → "8 public + 1 internal"; embeddings wording (Python sentence-transformers sidecar gone).

**Cluster E — install (2 files).** `system-spec-kit/scripts/setup/install.sh`, `install_guides/README.md`. Themes R1/R3/R5: launcher front-proxy command, counts, embeddings wording.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/doctor/**` (12 files incl. `_routes.yaml`, `scripts/mcp-doctor.sh`) | Modified | Cluster A — R2 mutation classes, R1 path, R3 server count, R4 colon-form, R6 rebuild target |
| `.opencode/skills/system-spec-kit/**` (7 files incl. `opencode.json`) | Modified | Cluster B — counts/version/server/embedding/launcher wording (014 additions preserved) |
| `.opencode/skills/system-code-graph/**` | Unchanged | Cluster C — only historical refs present; preserved by design |
| `.opencode/skills/system-skill-advisor/**` (4 files) | Modified | Cluster D — lane ids, semantic_shadow live, tool count, embedding wording |
| `.opencode/skills/system-spec-kit/scripts/setup/install.sh`, `.opencode/install_guides/README.md` | Modified | Cluster E — launcher, counts, embedding wording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Disjoint-partition parallel sweep: the orchestrator owned scaffolding, reconciliation, verification, and all git writes; five LEAF edit agents owned disjoint subsystem file sets and re-verified each finding against live source before editing. After the sweep, workflow adversarial verifiers reviewed each cluster — A/B/C/D returned pass; E returned issues, which the orchestrator fixed. The orchestrator then made two additional fix-ups (below), and ran a final re-grep across the doctor surface and install README plus structural checks on the two machine-readable files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Downgrade memory/causal-graph/code-graph/deep-loop routes to `read-only`; KEEP skill-advisor + install/debug/update as `mutates` | The `doctor.sh` scripts for the first group only health-check (read-only), so the route declarations were overstated; skill-advisor genuinely applies edits and install/debug/update genuinely mutate, so they stay `mutates`. Aligning docs to reality — NOT building the promised apply/rebuild paths (out of scope). |
| KEEP `/doctor:mcp` + `/doctor:update` colon-forms (audit said retire) | They are the surviving colon commands and route to real workflows; the audit was wrong. Only unsupported `:apply`/`:apply-confirm` and the per-subsystem colon-forms were dropped. |
| Cluster C makes 0 edits | The code-graph old-path references are legitimate historical/migration context that already name skill-local as canonical; rewriting them would destroy migration provenance. |
| install_guides/README.md → Ollama-default local-first + correct HF model name | The sweep left it framing HF Local as the default (contradicting Ollama-default and the fixed install.sh); fixed 4 spots to Ollama → HF Local fallback → opt-in OpenAI/Voyage, and corrected EmbeddingGemma-300m → nomic-ai/nomic-embed-text-v1.5 (verified hf-local.ts is nomic-only). |
| Fix the mcp-doctor.sh inverted-logic bug | The code-graph DB health-check defaulted `db_dir` to the OLD shared path and labeled the skill-local canonical path "legacy", so its auto-migrate message pointed the wrong way; swapped so `db_dir`=skill-local canonical and `legacy_db_dir`=former-shared, corrected the comment. Verified vs config.ts:20 + on-disk reality. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Adversarial verifiers (clusters A/B/C/D) | PASS |
| Adversarial verifier (cluster E) | Issues returned → orchestrator fixed |
| Final re-grep (doctor surface + install README) | CLEAN — no old-path-as-current, no "all 6", no "/doctor code_graph", no hf-local-as-default, no embeddinggemma |
| `opencode.json` | PASS — valid JSON |
| `mcp-doctor.sh` | PASS — `bash -n` clean after inverted-logic fix |
| Historical/migration refs (config.ts, database_path_policy.md) | PASS — preserved (Cluster C 0-edit) |
| 014 README additions | PASS — preserved (Cluster B surgical edits) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Docs/config-doc only.** This packet does not implement the apply/rebuild behaviors that the overstated routes formerly promised — those routes were downgraded to match the read-only `doctor.sh` reality. Building the apply paths is separate feature work, intentionally out of scope.
2. **Launcher `.cjs` deploy untouched.** The install-guide launcher wording aligns docs to the front-proxy launcher; the launcher `.cjs` UTF-8 fix deploy remains a separate, user-gated action tracked outside this packet.

### Downstream

Embedding wording in this packet documents **Ollama default → HF Local fallback → opt-in OpenAI/Voyage**, consuming packet `132-embedding-provider-local-first` (local-first `resolveProvider()`) as ground truth.
<!-- /ANCHOR:limitations -->
