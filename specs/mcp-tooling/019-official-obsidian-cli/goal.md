---
title: "Goal: Official Obsidian CLI"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/019-official-obsidian-cli"
    last_updated_at: "2026-09-02T20:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the parent directive and its phase binding"
    next_safe_action: "Close the open criteria in phase 001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-019-official-obsidian-cli"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Goal: Official Obsidian CLI

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Teach an agent to pick the right Obsidian surface, prove it will answer before depending on it, and read its results correctly.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The official CLI joins the existing surfaces. Neither `notesmd-cli` nor the MCP server is replaced or deprecated |
| D2 | Behavior is captured from the binary, not from vendor documentation, and a claim the binary contradicts is corrected |
| D3 | No wrapper is written. A script that only forwards arguments is indirection with no behavior |
| D4 | Exit status is not the readiness signal. Once the app is running the CLI exits 0 for every outcome |
| D5 | The exhaustive per-command parameter list stays in the binary, so no second source of truth can go stale |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-cli-versus-mcp | `001-cli-versus-mcp/goal.md` |

**Precedence.** Decisions above outrank child detail, and child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `validate.sh --strict --recursive` over this packet prints `RESULT: PASSED` for every folder
- [ ] The skill names one default app-backed surface and the conditions for leaving it, backed by measurement
- [ ] `scripts/doctor.sh` distinguishes app-down from CLI-absent, deciding on output rather than exit status
- [ ] No document in the skill still carries a claim the binary contradicts
- [ ] Every phase reports its acceptance criteria closeable
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Agent-facing usage layer and corrected command surface | Done | `f140793f3a`, `486eb2cb64` and `bb31baa048` across the usage reference, the command index and the router keywords |
| Surface comparison and the default | Done | `dcd2fa62b5 feat(mcp-obsidian): measure the CLI against the MCP server, and pick a default` |
| Follow-up edits landed after the comparison | Done | `10ec4d8b5f docs(mcp-obsidian): land the three edits made after the comparison was committed` |
| Phase 001 open criteria | In Progress | The stale package pin and the voice-blocker count stay open. See `001-cli-versus-mcp/goal.md` |

### Deviations and findings

| Item | Note |
|------|------|
| A read-shaped command turned out to write | `obsidian daily:read` creates today's daily note. Found only because the surface was driven rather than read about, which is the case for D2 |
| The three official-CLI catalog cards already existed as stubs | They carried the false claim and were corrected in place rather than duplicated |
| A concurrent session shares this checkout | It moved HEAD mid-run and swept this packet's scaffold into its own commit. Nothing was rewound, because rewriting shared history was not authorized |
<!-- /ANCHOR:log -->
