# AI Council Strategy — /doctor:update v3.3 Hardening

## Purpose
Debug and harden the spec-kit `/doctor:update` orchestrator for v3.3.0.0 users upgrading to v3.4.1.0+. Converge on prioritized P0/P1/P2 fixes with clear root-cause and proposed remediation.

## Task Framing
- **Type**: Bug Fix + Architecture hybrid
- **Scope**: 7 observed issues from live test session at `/tmp/sk_v3_3_fresh`
- **Deliverable**: 3-round deliberation → council report with remediation packet

## Selected Lenses

| Seat | Strategy Lens | AI Vantage Target | Temperature | Distinct Mandate |
|------|--------------|-------------------|-------------|------------------|
| Seat 1 | Analytical | Deep technical analysis (simulated) | 0.1 | Structural correctness & phase ordering |
| Seat 2 | Critical | Adversarial safety-first (simulated) | 0.2 | Silent failure detection & worst-case scenarios |
| Seat 3 | Pragmatic | Implementation realism (simulated) | 0.3 | Minimal fixes & implementability |

## Evidence Inputs
- `.opencode/commands/doctor/update.md` — command markdown (240 lines)
- `.opencode/commands/doctor/assets/doctor_update.yaml` — YAML workflow (243 lines)
- `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` — migration manifest (302 lines)
- `.opencode/specs/.../010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/spec.md` — spec packet
- `.opencode/specs/.../010-doctor-update-orchestrator/001-implement-initial-doctor-command-set/decision-record.md` — ADR decisions
- `.mcp.json` — workspace MCP config (53 lines)
- `opencode.json` — workspace OpenCode config (67 lines)

## Convergence Rule
Default: two-of-three-agree. If 2 of 3 seats endorse essentially the same plan, declare convergence.

## Known Constraints
- DO NOT propose fixes touching forbidden_targets (spec docs, skills, agents, commands)
- DO NOT propose adding new MCP tools
- Fixes must respect existing 10-phase YAML structure unless new phase unavoidable
- Each fix must be implementable in 1-2 small file edits OR one new script
- Never silent: every migration action visible to user with prompt-or-flag opt-in
