# SET-UP - Code Graph

User-facing diagnostic guide for `/doctor code-graph` (Phase A — diagnostic-only). Audit the code-graph index for stale + missed files and bloat directories without modifying any source files. Phase B (apply mode) is gated on the resilience-research assets.

> **Part of OpenCode Installation.** See the [Master Installation Guide](./README.md) for complete setup.
> **Command:** `/doctor code-graph` (auto + confirm modes) — full reference in `.opencode/commands/doctor/speckit.md`.
> **Phase:** A (read-only). Phase B (apply mode) coming after the resilience-research assets stabilize.

---

## TABLE OF CONTENTS

0. [AI-FIRST PROMPT](#0-ai-first-prompt)
1. [PREREQUISITES](#1-prerequisites)
2. [RUN](#2-run)
3. [WHAT IT TOUCHES](#3-what-it-touches)
4. [UNDERSTANDING THE REPORT](#4-understanding-the-report)
5. [ACTING ON THE REPORT](#5-acting-on-the-report)
6. [TROUBLESHOOTING](#6-troubleshooting)
7. [RESOURCES](#7-resources)

---

## 0. AI-FIRST PROMPT

Paste this into your AI client to run a guided code-graph health diagnostic:

```text
Run the code-graph diagnostic command to audit my code-graph index health.

PREREQUISITE CHECK (verify before proceeding):
- [ ] system-spec-kit MCP server is built (dist/ exists)
- [ ] code_graph_status MCP tool is in your tool list
- [ ] Repo has source files indexed (run code_graph_scan once if not)

If any prerequisite fails: STOP and report which one. Do NOT proceed.

Steps:
1. Invoke /doctor code-graph (or :confirm for the proposal gate review).
2. At setup: scope=A (all) for first run; B/C/D to focus on stale/missed/bloat only.
3. Walk through Phase 0 (Discovery) → Phase 1 (Analysis) → Phase 2 (Proposal report).
4. Read the report at <packet_scratch>/code-graph-diagnostic-<timestamp>.md.
5. Decide manually whether to act on the recommendations (Phase A is read-only).

Phase A invariant: zero mutations to source files. Only the report is written.
```

**Expected duration:** 1–2 minutes for repos with <10k files.

---

## 1. PREREQUISITES

| Requirement | Check |
| --- | --- |
| MCP server is built | `ls .opencode/skills/system-spec-kit/mcp-server/dist/` shows JS |
| `code_graph_status` available | Tool appears in your AI client's tool list |
| Index has been populated at least once | `code_graph_status({})` shows non-zero indexed_count |

**Build first if needed:**
```bash
npm --prefix .opencode/skills/system-spec-kit/mcp-server install
npm --prefix .opencode/skills/system-spec-kit/mcp-server run build
```

**Initial scan if index is empty:**
```bash
# In your AI client:
code_graph_scan({})
```

---

## 2. RUN

| Use case | Command |
| --- | --- |
| First diagnostic | `/doctor code-graph` |
| Review before report | `/doctor code-graph` (pauses at proposal gate) |
| Stale files only | `/doctor code-graph --scope=stale` |
| Missed files only | `/doctor code-graph --scope=missed` |
| Bloat dirs only | `/doctor code-graph --scope=bloat` |
| Apply high-tier excludes (auto rollback if regression) | `/doctor code-graph` |
| Review apply plan before mutating + before keeping | `/doctor code-graph` |
| Apply medium tier (interactive only) | `/doctor code-graph --tier-floor=medium` |

**Diagnostic phases (auto / confirm):**

```
Phase 0 Discovery  → Phase 1 Analysis  → Phase 2 Proposal-as-report
```

**Apply phases (apply / apply-confirm):**

```
Phase 0 Discovery → Phase 1 Analysis → Phase 2 Proposal → Phase 3 Apply (write config + snapshot) → Phase 4 Verify (re-scan + gold battery) → Phase 5 Rollback-if-needed
```

Apply mode mutates `.opencode/code-graph.config.json` only. Pre-apply snapshot lives at `<packet_scratch>/apply-snapshot-<timestamp>.json` and is never auto-deleted.

---

## 3. WHAT IT TOUCHES

**Diagnostic modes (`:auto`, `:confirm`)** mutate only the diagnostic report at `<packet_scratch>/code-graph-diagnostic-<timestamp>.md`.

**Apply modes (`:apply`, `:apply-confirm`)** mutate:
- `.opencode/code-graph.config.json` (the user-level scanner config)
- `<packet_scratch>/apply-snapshot-<timestamp>.json` (rollback snapshot)
- `<packet_scratch>/apply-report-<timestamp>.md` + `verify-<timestamp>.log`

**Never touches (any mode):**
- Any source file in the workspace
- Any code under `.opencode/skills/system-spec-kit/mcp-server/`
- The code-graph SQLite database (mutations happen via `code_graph_scan` only)
- The code-graph resilience assets are read-only reference material

After running diagnostic mode, `git status` should show no diffs outside the packet scratch path. After running apply mode, only `.opencode/code-graph.config.json` should change in the working tree.

---

## 4. UNDERSTANDING THE REPORT

The diagnostic report has four sections:

| Section | Content |
| --- | --- |
| Discovery | indexed_count, file_count, lang_histogram, last_scan_at |
| Analysis | stale_set, missed_set, bloat_set, overlap_set |
| Proposed Recommendations | exclude-rule + language-filter recommendations with confidence tiers |
| Limitations | gaps in detection (what the diagnostic could not verify) |

### Confidence tiers

| Tier | Meaning | Action |
| --- | --- | --- |
| High | Standard pattern that should always be excluded (`node_modules/`, `.git/`, `__pycache__/`) | Apply when ready |
| Medium | Common build-output pattern that usually benefits from exclusion (`dist/`, `build/`) | Review per-repo |
| Low | Custom-named pattern detected via heuristics | Manual decision required |

(Authoritative tier definitions land in the resilience assets once that loop completes.)

---

## 5. ACTING ON THE REPORT

Phase A is diagnostic-only; you decide whether to apply changes manually. To apply an exclude rule today:

1. Read the report and pick recommendations you trust.
2. Edit the scanner config (location depends on your code-graph version).
3. Run `code_graph_scan({})` to re-index with new rules.
4. Run `/doctor code-graph` again to confirm the exclude took effect.

When Phase B ships, this entire flow (apply → verify → rollback if regressed) will run automatically inside the command.

---

## 6. TROUBLESHOOTING

| Problem | Fix |
| --- | --- |
| `"empty repo"` | No source files found; the diagnostic exits cleanly with STATUS=OK |
| `"code_graph_status unavailable"` | Falls back to filesystem-only diagnosis with a warning in the report |
| `"detect_changes unavailable"` | Falls back to git status + index timestamp comparison |
| Report path missing on completion | Check packet scratch directory exists; check disk space |
| Bloat detection over-flags `dist/` | Expected for medium-tier patterns; review per-repo |
| Command not found | Verify `.opencode/commands/doctor/speckit.md` exists; restart your AI client |

---

## 7. RESOURCES

- **Command reference:** `.opencode/commands/doctor/speckit.md`
- **Workflow YAML:** `.opencode/commands/doctor/assets/doctor_code-graph_{auto,confirm}.yaml`
- **Sibling doctor commands:** `/doctor:mcp install`, `/doctor:mcp debug`, `/doctor skill-advisor`
- **Related guides:** [SET-UP - Skill Advisor](./SET-UP%20-%20Skill%20Advisor.md) (sibling 5-phase doctor command pattern)
