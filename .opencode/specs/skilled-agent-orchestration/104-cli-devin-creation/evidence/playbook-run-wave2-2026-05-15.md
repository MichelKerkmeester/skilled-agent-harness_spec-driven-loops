# cli-devin Playbook — Wave 2 SKIP-Promotion Run — 2026-05-15T11:47:44Z

**Binary:** `devin 2026.5.6-8 (66645c2)`
**Auth:** Logged in (via Devin) — Codeium / Windsurf / Devin bridge, basic Pro tier
**Sibling CLIs available:** codex (0.130.0), claude (2.1.142), gemini (0.37.1), opencode (1.14.48)
**Devin cloud surface:** accessible (`devin cloud drs` subcommand visible under basic Pro)

This run revisits all 13 wave-1 SKIPs and produces a per-scenario disposition decision (FIX / KEEP-AS-SKIP / REPLACE / DELETE).

---

## Wave-2 results per previously-skipped scenario

| ID | Wave-1 Verdict | Wave-2 Verdict | Disposition | Rationale |
|---|---|---|---|---|
| DV-003 stdin redirect `</dev/null` | SKIP | **PASS** (with finding) | **FIX** — promote to runnable | Both with-redirect and without-redirect runs completed cleanly (3/3 each). Devin **does not exhibit** the silent-stdin-theft failure mode that cli-codex / cli-opencode docs describe. The family-inherited ALWAYS rule #5 in SKILL.md is overcautious for Devin — `</dev/null` is harmless to keep but the documented rationale is wrong. Candidate v1.0.2.0 doc correction: soften the rule and note Devin's stdin behavior differs. |
| DV-007 bypass mode | SKIP (binary has no bypass) | Re-purposed in v1.0.1.0 → **PASS** via `--sandbox` flag | **DONE in v1.0.1.0** | Already re-purposed to validate the real `--sandbox` flag (OS-level seatbelt/bwrap). No further action. |
| DV-012b `devin skills show <name>` | SKIP (profile may be empty) | **PASS** (`/sk-git:sk-git` shown) | **FIX** — promote to runnable | Profile is non-empty; pick first skill from `devin skills list` output, then `devin skills show <name>` works. |
| DV-013b `devin mcp add/login` lifecycle | SKIP (profile pollution) | **PASS** (clean add → get → remove cycle) | **FIX** — promote to runnable | `devin mcp` has full lifecycle subcommands: `add`, `get`, `list`, `remove`, `disable`, `enable`, `login`, `logout`. Add syntax: `devin mcp add <NAME> -- <COMMAND> [ARGS...]` (uses `--` separator). Remove leaves clean post-state. |
| DV-015 `devin --resume <id>` | SKIP (needs id capture) | **PASS** (via `devin list --format json`) | **FIX** — promote to runnable | `devin list --format json` emits structured session list with `id` field. **NEW FINDING**: session ids are human-friendly kebab-case slugs (e.g. `paint-bean`), NOT UUIDs as cli-devin docs describe. Candidate v1.0.2.0 doc correction. |
| DV-017 5-check gate (NEGATIVE) | SKIP (calling-AI behavior) | **SKIP** (unchanged) | **KEEP-AS-SKIP** | Tests cli-devin's smart-router gate logic which runs at the calling-AI orchestrator layer, not via the `devin` binary. Meaningful operator-runnable manual test; not shell-automatable. Strengthen the blocker rationale in the scenario file (currently vague). |
| DV-018 Cloud handoff round-trip | SKIP (TUI + entitlement + multi-hour) | **PARTIAL PASS** (cloud surface accessible) | **SPLIT into 018a + 018b** | `devin cloud --help` returns subcommand surface (`drs` Declarative Repo Setup) under basic Pro — so surface accessibility IS testable. Full async round-trip (laptop close → PR return) still requires interactive TUI handoff initiation + paid entitlement check + multi-hour wait — keep that as operator-driven. **Recommendation**: split DV-018 into DV-018a (cloud surface accessibility, shell-runnable) and DV-018b (live round-trip, operator-driven manual). |
| DV-019 Self-invocation guard | SKIP (calling-AI behavior) | **SKIP** (unchanged) | **KEEP-AS-SKIP** | Same as DV-017 — orchestrator-layer test. Strengthen the blocker rationale. |
| DV-020 Cloud-handoff exception | SKIP (calling-AI behavior) | **SKIP** (unchanged) | **KEEP-AS-SKIP** | Same as DV-017/DV-019 — orchestrator-layer test. Strengthen the blocker rationale. |
| DV-021 Dispatch from cli-codex | SKIP (integration test) | **PASS** (rc=0; python function returned through codex) | **FIX** — promote to runnable | `codex exec --model gpt-5.5 --sandbox workspace-write` can shell out to `devin`. Output round-trips cleanly. |
| DV-022 Dispatch from cli-claude-code | SKIP (integration test) | **PASS** (implicit) | **FIX** — annotate as implicit-PASS | Every Claude Code → devin dispatch in this session (including the original 16 wave-1 PASSes) IS this scenario by construction. cli-claude-code's contract is for non-Claude AIs calling Claude; we are IN Claude Code, so we validate the Claude-Code-side of the chain on every dispatch. |
| DV-023 Dispatch from cli-opencode | SKIP (integration test) | **PASS** | **FIX** — promote to runnable | `opencode run --pure --print-logs` can shell out to `devin`; output round-trips. |
| DV-024 Dispatch from cli-gemini | SKIP (integration test) | **PASS** | **FIX** — promote to runnable | `gemini --yolo -p "<prompt>"` can shell out to `devin`; output round-trips. |

---

## Summary tally (combined wave 1 + wave 2)

| Verdict | Count | Change |
|---|---|---|
| PASS | **24** | +8 (was 16) — promoted DV-003, DV-012b, DV-013b, DV-015, DV-021, DV-022, DV-023, DV-024; DV-007 was already promoted to PASS in v1.0.1.0 |
| PARTIAL | **2** | +1 — DV-018 (cloud surface accessible; full round-trip still operator-driven). DV-002a unchanged. |
| FAIL | **0** | unchanged |
| SKIP | **3** | -10 — only the 3 calling-AI orchestrator-layer tests (DV-017, DV-019, DV-020) remain as legitimate SKIP |

Coverage: 29 scenario rows (26 scenario IDs, with DV-002/012/013/014 split into a/b sub-runs) → 24 PASS + 2 PARTIAL + 3 SKIP = 29 (100% addressed).

---

## Recommended scenario-file updates (for a v1.0.2.0 release)

### FIX (promote to runnable; update scenario files)

For each of the 8 promoted scenarios, update §3 TEST EXECUTION command sequence to the working invocation:
- **DV-003**: use `devin -p "<prompt>" --permission-mode auto --model swe-1.6` (positional prompt goes AFTER `-p`)
- **DV-012b**: parse first skill name from `devin skills list` then `devin skills show <name>`
- **DV-013b**: use `devin mcp add <NAME> -- <command> [args...]` syntax (`--` separator), followed by `get` + `remove` + post-list grep check
- **DV-015**: use `devin list --format json` and extract `.id` field for session-id capture
- **DV-018a (NEW)**: `devin cloud --help` for surface accessibility (shell-runnable)
- **DV-018b (REPLACES DV-018)**: live cloud round-trip — keep current scenario as operator-driven manual test
- **DV-021**: `codex exec --model gpt-5.5 --sandbox workspace-write` shell-out pattern
- **DV-022**: annotate as IMPLICITLY-VERIFIED-by-every-Claude-Code-dispatch
- **DV-023**: `opencode run --pure --print-logs` shell-out pattern
- **DV-024**: `gemini --yolo -p "<prompt>"` shell-out pattern

### KEEP-AS-SKIP (strengthen blocker rationale)

DV-017, DV-019, DV-020 — orchestrator-layer tests. Update each scenario file's §1 "Why This Matters" and §2 SCENARIO CONTRACT to clarify these are **operator-runnable manual tests of cli-devin's smart-router logic, not shell-automatable binary tests**. They validate cli-devin behavior, not devin binary behavior.

### DELETE — NONE

Every scenario tests something real. No deletions recommended.

---

## New v1.0.x doc corrections discovered during wave 2

1. **stdin-theft failure mode**: SKILL.md ALWAYS rule #5 inherits from cli-codex / cli-opencode pattern. Devin's binary does **not** reproduce silent stdin theft. Soften to "recommended for consistency with family convention" rather than "required to avoid stdin theft."

2. **Session-id format**: cli_reference.md and SKILL.md describe session ids as UUIDs. Real format is human-friendly kebab-case slugs (e.g. `paint-bean`). Update §3 Subcommand Map and §4 Flags accordingly.

3. **`devin list --format json` flag**: cli_reference.md §3 doesn't mention `--format json` for `devin list`. Add it — it's the canonical non-interactive parseable shape.

4. **`devin mcp` full lifecycle**: cli_reference.md §3 mentions `add` / `list` / `login`. Real binary has `add` / `list` / `get` / `remove` / `login` / `logout` / `enable` / `disable`. Document the full lifecycle.

5. **`devin cloud drs` subcommand**: cli_reference.md doesn't mention `drs` (Declarative Repo Setup — environment blueprints, sandbox sessions, builds). Add to subcommand map.

6. **MCP `add` syntax**: requires `--` separator before stdio command (`devin mcp add <NAME> -- <CMD> [ARGS]`). Document.

These are candidates for a v1.0.2.0 doc-correction pass alongside the scenario-file fixes.
