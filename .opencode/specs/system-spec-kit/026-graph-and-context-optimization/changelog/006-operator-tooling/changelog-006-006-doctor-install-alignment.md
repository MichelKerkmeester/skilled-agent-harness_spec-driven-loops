---
title: "/doctor + Install-Guide Alignment"
description: "Aligned the /doctor command surface and three subsystem install guides to shipped reality (~148 misalignments) via a five-cluster disjoint parallel sweep (25 files), adversarial verification, and orchestrator fix-ups (install-README Ollama-default local-first + a confirmed mcp-doctor.sh inverted-logic bug)."
trigger_phrases:
  - "doctor install alignment"
  - "doctor command alignment"
  - "install guide drift"
  - "code-graph db path docs"
  - "doctor mutation class read-only"
  - "tool count drift 36"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/006-doctor-install-alignment` (Level 2)

### Summary

The `/doctor` command router, its per-target assets, and the three subsystem install guides drifted from shipped reality (~148 audited misalignments across DB paths, mutation classes, tool counts, command syntax, launch instructions, and embedding architecture). A five-cluster disjoint parallel sweep across 25 files corrected all misalignments, with adversarial verification plus two orchestrator fix-ups (install-README Ollama-default framing and a confirmed `mcp-doctor.sh` inverted-logic bug). Final re-grep across the doctor surface and install README returned clean; `opencode.json` is valid JSON; `mcp-doctor.sh` passes `bash -n`.

### Added

- Nothing net-new: this packet is a docs/config-doc alignment pass only; no new features or scripts were introduced.

### Changed

**Cluster A — /doctor command surface (12 files)**

- `_routes.yaml`: reconciled mutation classes for the four subsystem routes — memory, causal-graph, code-graph, deep-loop downgraded from `mutates`/`add-only` to `read-only` (matching their read-only `doctor.sh` scripts); skill-advisor + install/debug/update kept `mutates` (they genuinely apply edits).
- `_routes.yaml`: replaced stale shared `.opencode/.spec-kit/code-graph/` DB path with skill-local `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` everywhere presented as current (R1).
- `_routes.yaml` and per-target assets: retired per-subsystem `/doctor:<name>` colon-forms in favor of argv-positional `/doctor <target>`; dropped unsupported `:apply`/`:apply-confirm` suffixes; kept `/doctor:mcp` and `/doctor:update` (surviving colon commands — the audit's "retire them" was incorrect).
- `scripts/mcp-doctor.sh`: fixed inverted-logic bug — `db_dir` now defaults to the skill-local canonical path; former shared path correctly labeled as `legacy_db_dir` with the auto-migrate message now pointing the right way.
- Per-target YAML assets (`doctor_update`, `doctor_mcp_install`, `doctor_mcp_debug`, `doctor_skill-advisor`, `doctor_memory`, `doctor_causal-graph`, `doctor_deep-loop`): corrected "all 6 MCP servers" → 5; Node 18 → ≥20.11; fixed `/doctor code_graph` → `code-graph`; updated `doctor_skill-advisor.yaml` rebuild target from system-spec-kit to system-skill-advisor and corrected stale lane tuple.

**Cluster B — system-spec-kit docs (7 files)**

- `README.md`, `mcp_server/README.md`, `mcp_server/INSTALL_GUIDE.md`, `opencode.json`: tool count 35 → 36 (reflecting `TOOL_DEFINITIONS.length`); Node 18 → ≥20.11; dropped phantom v1.8.1; "6 servers" → 5 registered; Python `sentence-transformers` sidecar wording → pure-Node `@huggingface/transformers` hf-local; launcher-vs-backend wording corrected; invalid MCP-call examples fixed. The 014 README additions preserved verbatim.
- `feature_catalog/16--tooling-and-scripts/232-...` and `manual_testing_playbook/**`: counts, command syntax, and embedding wording aligned.

**Cluster C — system-code-graph docs (0 edits)**

- No changes made. The only old-path references are legitimate historical/migration context in `INSTALL_GUIDE.md` and `database_path_policy.md` that already name skill-local as canonical; preserved to maintain migration provenance.

**Cluster D — system-skill-advisor docs (4 files)**

- `README.md`, `INSTALL_GUIDE.md`, `references/scoring/advisor_scorer.md`, `references/scoring/lane_weight_tuning.md`: lane ids updated to `explicit_author / lexical / graph_causal / derived_generated / semantic_shadow`; `semantic_shadow` wording corrected to "live" (not shadow-only); "9 public" → "8 public + 1 internal" tool count; embedding wording updated.

**Cluster E — top-level install (2 files)**

- `system-spec-kit/scripts/setup/install.sh`: launcher front-proxy command corrected (was calling `dist/context-server.js` directly).
- `install_guides/README.md`: reframed embedding provider order to Ollama-default → HF Local fallback → opt-in OpenAI/Voyage (was incorrectly framing HF Local as the default in 4 spots); corrected HF model name from `EmbeddingGemma-300m` to `nomic-ai/nomic-embed-text-v1.5` (verified against `hf-local.ts`).

### Fixed

- `mcp-doctor.sh` inverted-logic bug: `db_dir` defaulted to the OLD shared path and labeled the skill-local canonical path "legacy", causing the auto-migrate message to point the wrong way. Swapped so `db_dir` = skill-local canonical and `legacy_db_dir` = former-shared. Verified against `config.ts:20` and on-disk reality.
- `install_guides/README.md`: four occurrences incorrectly presented HF Local as the default embedding provider; corrected to Ollama-default with HF Local as fallback.
- `install_guides/README.md`: wrong HF model identifier (`EmbeddingGemma-300m`) replaced with `nomic-ai/nomic-embed-text-v1.5`.

### Verification

| Check | Result |
|-------|--------|
| Adversarial verifiers (clusters A/B/C/D) | PASS |
| Adversarial verifier (cluster E) | Issues returned → orchestrator fixed |
| Final re-grep (doctor surface + install README) | CLEAN — no old-path-as-current, no "all 6", no `/doctor code_graph`, no hf-local-as-default, no `embeddinggemma` |
| `opencode.json` | PASS — valid JSON |
| `mcp-doctor.sh` | PASS — `bash -n` clean after inverted-logic fix |
| Historical/migration refs (config.ts, database_path_policy.md) | PASS — preserved (Cluster C 0-edit by design) |
| 014 README additions (Cluster B) | PASS — preserved verbatim |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/_routes.yaml` | Modified | R2 mutation classes, R1 DB path, R4 colon-form cleanup, R3 server count |
| `.opencode/commands/doctor/scripts/mcp-doctor.sh` | Modified | Inverted-logic bug fixed (db_dir ↔ legacy_db_dir swap) |
| `.opencode/commands/doctor/speckit.md`, `mcp.md`, `update.md` | Modified | R3/R4/R6 command syntax, counts, colon-form retirement |
| `.opencode/commands/doctor/assets/doctor_{update,mcp_install,mcp_debug,skill-advisor,memory,causal-graph,deep-loop}.yaml` (7 files) | Modified | R2/R3/R6 mutation classes, counts, rebuild targets, lane ids |
| `.opencode/skills/system-spec-kit/README.md` | Modified | R3/R5/R6 tool count 35→36, Node 18→≥20.11, drop v1.8.1, launcher wording, embedding wording |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | R3/R5/R6 counts, server count 6→5, embedding wording |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | R3/R5 Node version, launcher command |
| `.opencode/skills/system-spec-kit/opencode.json` | Modified | R3 tool-count note updated to 36 |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/232-...` | Modified | R3/R6 counts, invalid MCP-call examples |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/README.md` | Modified | R4/R6 command syntax, colon-form retirement |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | R3/R4 counts, command syntax |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | R6 lane ids, semantic_shadow live, tool count 9→8+1 |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modified | R5 embedding wording (Python→Node) |
| `.opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md` | Modified | R6 lane ids updated |
| `.opencode/skills/system-skill-advisor/references/scoring/lane_weight_tuning.md` | Modified | R6 lane ids updated |
| `.opencode/skills/system-spec-kit/scripts/setup/install.sh` | Modified | R5 launcher front-proxy command |
| `.opencode/install_guides/README.md` | Modified | R5 Ollama-default framing, HF model name corrected, 4 embedding-order spots fixed |

### Follow-Ups

- **Apply/rebuild paths for doctor routes**: the four subsystem doctor routes were downgraded to `read-only` to match current `doctor.sh` reality. The overstated `mutates` routes formerly promised apply/rebuild behavior that does not exist. Implementing these paths is separate feature work, intentionally out of scope for this alignment packet.
- **Launcher `.cjs` UTF-8 fix deploy**: the install-guide wording now documents the front-proxy launcher correctly, but the launcher `.cjs` deploy itself remains a separate, user-gated action tracked outside this packet.
