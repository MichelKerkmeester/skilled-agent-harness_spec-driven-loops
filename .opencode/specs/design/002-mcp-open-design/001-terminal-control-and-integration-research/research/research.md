---
title: "Research: driving Open Design from the terminal + sk-design-interface integration"
description: "Synthesis of the wave-1 fleet (2x claude2-opus + 1x gpt-5.5-fast) on how to control the Open Design desktop app from a terminal, how to build the mcp-open-design skill, and how to de-vendor + integrate sk-design-interface with it."
trigger_phrases:
  - "open design terminal control research"
  - "mcp-open-design skill design"
  - "sk-design-interface de-vendor open design"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/001-terminal-control-and-integration-research"
    last_updated_at: "2026-06-14T12:25:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fleet synthesized; both skills shipped and deep-reviewed"
    next_safe_action: "Live od mcp install verify, then push 027"
    blockers: []
    key_files:
      - ".opencode/specs/design/002-mcp-open-design/001-terminal-control-and-integration-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-001-terminal-control-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research: driving Open Design from the terminal + sk-design-interface integration

<!-- SPECKIT_LEVEL: 1 -->

Wave-1 fleet (read-only): Seat A = claude2-opus (OD terminal-control surface), Seat B = claude2-opus (sk-design-interface de-vendor + integration + licensing), Seat C = gpt-5.5-fast (mcp-open-design skill design + adversarial cross-check). Full per-seat detail in `seats/seat-a.findings.md`, `seats/seat-b.findings.md`, `seats/seat-c.out`.

---

## 1. Executive answer — how to drive Open Design from the terminal

Open Design (v0.9.0, Electron + Next.js, `/Applications/Open Design.app`) is driven from a terminal by wiring its **stdio MCP server into your terminal agent** (opencode / Claude Code) and/or calling its **headless `od` CLI verbs**. No in-app chat needed.

Cross-validated corrections to the initial read (Seat A confirmed by reading the bundled code; Seat C agreed adversarially):

- **The `od` CLI is `app/prebundled/daemon/daemon-cli.mjs` run under a Node-compatible runtime — NOT `bin/vela`.** `vela` is the cloud AMR/auth client (`vela agent/login/whoami`, v0.0.9). There is **no global `od` shim** (`/usr/bin/od` is the unrelated octal-dump tool). [SOURCE: seats/seat-a.findings.md Task 1 — ran `--help`/`--version`]
- **`od mcp` registers ~18 tools, not the 8 in `--help`.** The stdio server returns the full `TOOL_DEFS`: 11 read-only, 5 mutating (incl. `start_run` = the headless equivalent of the chat box, which commissions OD to spawn its own inner agent), 2 destructive (`delete_file`, `delete_project`, gated on `confirm:true`). [SOURCE: seats/seat-a.findings.md Task 3b; seats/seat-c.out §3]
- **Daemon transport is Unix-socket discovery + ephemeral loopback HTTP, not a fixed `:7456`.** `7456` is only the default for a standalone `od --no-open` daemon. The desktop sidecar is socket-discovered via `OD_SIDECAR_IPC_PATH`; a live `curl :7456` failed while the sockets existed. [SOURCE: seat-c §5c — live-observed]
- **The desktop daemon is a child Electron sidecar → it dies with the app** (strongly inferred; needs a live close-the-app check). Headless-without-the-app = run a standalone `od --no-open` daemon.

### Exact wiring (this machine)
```
APP="/Applications/Open Design.app"
OD_BIN="$APP/Contents/Resources/app/prebundled/daemon/daemon-cli.mjs"   # this is `od`
OD_NODE_BIN="$APP/Contents/MacOS/Open Design"                          # Electron-as-node (no system node needed)
# Invoke the CLI (either form, both verified):
node "$OD_BIN" --help
ELECTRON_RUN_AS_NODE=1 "$OD_NODE_BIN" "$OD_BIN" --help
# Wire opencode (writes ~/.config/opencode/opencode.json under "mcp.open-design", deep-merge):
node "$OD_BIN" mcp install opencode --print --json   # preview, writes nothing
node "$OD_BIN" mcp install opencode                  # install
# Wire Claude Code (delegates to `claude mcp add --scope user open-design ...`):
node "$OD_BIN" mcp install claude --print --json
```
Installed opencode MCP entry: `{type:"local", command:[<electron>, <daemon-cli.mjs>, "mcp"], enabled:true, environment:{OD_DATA_DIR, OD_SIDECAR_IPC_PATH=/tmp/open-design/ipc/release-stable/daemon.sock, ELECTRON_RUN_AS_NODE=1}}` (exact command[0] and OD_DATA_DIR are INFERRED, confirm via `mcp install --print --json`). The MCP server then auto-discovers the live ephemeral daemon URL from the socket at startup, so configs survive daemon restarts. [SOURCE: seat-a Task 2]

### Headless verb surface (drive work without the chat UI)
`start_run`+`get_run`+`get_artifact` (commission a generation), `od automation` (schedule/fire routines), `od ui respond/prefill` (answer the app's GenUI prompts headlessly), `od artifacts create`, `od media generate`, `od research search`, `od tools design-systems read`, `od memory tree`, `od plugin`.

---

## 2. `mcp-open-design` skill design (phase 002)

Model on the existing `mcp-magicpath` skill. Section layout: WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES / SUCCESS CRITERIA / INTEGRATION POINTS. [SOURCE: seats/seat-c.out §1]

Tool-exposure policy (the spine of the RULES section):
- **Surface freely (read-only):** `list_projects, get_active_context, get_artifact, get_project, get_file, search_files, list_files, list_skills, list_plugins, list_agents, get_run`; `od tools design-systems read`; `od daemon status`/`doctor`.
- **Surface but GATE (require explicit confirmation + explicit project/name + rollback note):** `create_artifact, create_project, start_run, cancel_run`; `od artifacts create`, `od media generate`, `od research search`, `od automation create/run/...`, `od ui respond/revoke/prefill`, `od memory tree edit/move`, `od plugin install/.../publish`, `od diagnostics export`.
- **OMIT from the default path (reference docs only):** `delete_file, delete_project, write_file` (overwrites); `plugin publish/login/trust`; `daemon stop`/`db vacuum`; raw connector execute; desktop import/auth internals.

ALWAYS rules: install via `od mcp install <agent>` (never hardcode `od` on PATH or `:7456`); verify the live `tools/list` before promising the exact tool set; confirm the daemon is running (desktop app open) before tool calls; gate every mutating/destructive verb. NEVER: drive the in-app chat UI; copy/cache OD content into the repo; run destructive verbs without `confirm:true` + user approval.

The three biggest accuracy risks the skill must hedge (Seat C): CLI naming (no `od` shim), daemon transport (socket-discovery not `:7456`), and MCP tool-surface drift (verify live). [SOURCE: seats/seat-c.out §7]

---

## 3. `sk-design-interface` de-vendor + integration (phase 003)

### 3.1 Live licensing defect — FIXED this session
All three license files were deleted in the working tree (out of order): `LICENSE.txt` (Apache-2.0), `LICENSE-ui-ux-pro-max.txt` (MIT), `THIRD-PARTY-NOTICES.md`. **Restored to clean baseline** (`git checkout HEAD --`). `LICENSE.txt` must stay (the kept `design_principles.md` is verbatim Apache-2.0 Anthropic content). [SOURCE: seats/seat-b.findings.md LEAD FINDING; verified live via git status]

### 3.2 Data model + replacement map
OD **design-systems** are far richer than the vendored CSVs: each is a 9-section `DESIGN.md` + a lint-governed paste-ready `tokens.css` (4-layer schema) + real `components.html`. OD **skills**, by contrast, are thin catalogue stubs pointing at upstream repos — no integration value. [SOURCE: seat-b Task 1]

| sk-design-interface CSV | Disposition |
|---|---|
| `colors.csv`, `typography.csv` | Replace with **live OD reads** (richer, compiled tokens) |
| `styles.csv` | Author-original (condense contraindication value) or drop |
| `ui-reasoning.csv`, `products.csv` | Retire / compress to a small authored "named-default" list (their generator-shaped `Recommended_Pattern` is the anti-pattern the skill resists) |
| `landing.csv` | Author-original short section-order list, or map to OD `design-templates/` |
| `ux-guidelines.csv`, `charts.csv`, `app-interface.csv` (quality floor) | **KEEP** as the already-authored `ux_quality_reference.md` (paraphrased, non-copyrightable rules) |

### 3.3 What becomes genuinely unique (not a vendor-swap)
OD is *also* third-party. Uniqueness = (1) the anti-default **judgment** layer (`design_principles.md`, Apache base, kept) + (2) original **dual-use orchestration** — reuse-before-generate grounding AND critique-against, switched by the brief — folded into `claude_design_parity.md`; (3) **live-read-only** sourcing from the user's installed OD app (never cache → no license attaches → the structural win). [SOURCE: seat-b Task 2.2]

### 3.4 Integration contract
Folds into `claude_design_parity.md` §2 (intake: if an OD system matches the brief, read it via `mcp-open-design`) and §3 (reuse-before-generate: reuse its tokens/components). Guardrails that MUST survive: no style chooser (never surface ~150 OD systems as a pick-a-vibe menu), no generator (sk-design-interface only reads OD), OD is input to judgment not authority, live-read only. OD integration stays ON_DEMAND/optional (same posture the CSVs had) and is gated on `mcp-open-design` shipping. [SOURCE: seat-b Task 3]

### 3.5 Ordered de-vendor sequence (legally strict: data first, notices second)
(a) delete `assets/data/*.csv` (9) + `assets/data/README.md` + `scripts/design_search{,_core}.py` (serve only the CSVs, MIT-derivative). (b) THEN delete `LICENSE-ui-ux-pro-max.txt` + `THIRD-PARTY-NOTICES.md` + the MIT clause in SKILL.md frontmatter + dangling references across feature_catalog/manual_testing_playbook. (c) KEEP `LICENSE.txt` + all Anthropic Apache-2.0 attribution + `design_principles.md` header. Full 13-step checklist + 10-row risk table in `seats/seat-b.findings.md`. **Verify before (b):** confirm `ux_quality_reference.md` copied no verbatim `Code Example` snippets from the MIT CSVs (rule-prose is non-copyrightable; copied code strings are not). [SOURCE: seat-b Task 4 + checklist]

---

## 4. Cross-lineage agreement / divergence
- **Agreement (high confidence):** the `od mcp` wiring, the no-`od`-shim / socket-not-7456 / ~18-tool corrections, and the gate-mutations posture were independently reached by Seat A (code read) and Seat C (adversarial) — strong cross-validation.
- **Divergence / open:** none material. Seat C frames more tools as "gate" where Seat A classifies by annotation; the skill should follow Seat C's stricter gating.

## 5. Negative knowledge — what to SKIP / verify live
- SKIP: cloning OD's hosted product, the in-app chat workflow, OD `skills` as a knowledge base (thin stubs), caching OD content into either skill, a style-chooser menu, destructive verbs in the default path.
- NEEDS LIVE VERIFICATION (carry into 002/004): exact `command[0]`/`OD_DATA_DIR` the installer writes (`mcp install --print --json`); whether the daemon truly dies on app-close; whether `od --no-open` gives a working headless daemon; per-verb auth (does `start_run`/`media generate` need a `vela` login); `od mcp live-artifacts` tool set; `install.sh` contents (do not pipe-to-shell); whether `od mcp install` re-derives a `7456` fallback entry when run while the daemon is down versus the socket-mode entry when it is up. [SOURCE: seat-a UNCERTAIN list; seat-c §5]

## 6. Prioritized recommendation (phaseable)
1. **002 — build `mcp-open-design`** (additive, safe): SKILL.md + references + feature_catalog + manual_testing_playbook + changelog v1.0.0.0 + schema-2 graph-metadata, encoding §1–§2 above.
2. **003 — evolve `sk-design-interface`** (destructive — gate on user go): execute §3.5 ordered de-vendor + §3.4 integration; bump changelog.
3. **004 — validate + docs**: live `od mcp install opencode` + `tools/list` verification, resolve the §5 live-verification list, validate `--strict`.

<!-- ANCHOR:references -->
## References
- [SOURCE: seats/seat-a.findings.md] — Open Design terminal-control surface (claude2-opus, code-read + `--help`).
- [SOURCE: seats/seat-b.findings.md] — sk-design-interface de-vendor + integration + licensing (claude2-opus).
- [SOURCE: seats/seat-c.out] — mcp-open-design skill design + adversarial cross-check (gpt-5.5-fast, opencode JSON stream).
- [SOURCE: /Applications/Open Design.app/Contents/Resources/open-design-config.json] — appVersion 0.9.0, daemonCliEntryRelative.
- [SOURCE: https://github.com/nexu-io/open-design] — upstream repo (Open Design, "official open-source local-first Claude Design alternative").
<!-- /ANCHOR:references -->
