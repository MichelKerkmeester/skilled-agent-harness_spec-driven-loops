# Integration Research: caura-memclaw (008) → Spec Kit (UX + Automation first)

5-iteration deep-research run on **how to integrate the 008 memory-hardening proposal** and **what existing skills / commands / agents / hooks it impacts** — with **UX and automation as the explicit top design priorities**.

- **Integrates:** `../sub-packet-proposals.md` (new child 015 P1-P3 + amendments to 002-008 + the 008 feedback reframe).
- **Into:** Spec Kit Memory (`.opencode/skills/system-spec-kit/mcp_server/`, `commands/{memory,speckit,doctor}`, `agents/`, hooks).
- **Method:** orchestrator-driven parallel fan-out; read-only `cli-opencode openai/gpt-5.5-fast --variant high`; folder-scoped iterations `001-005`.

| Iter | Angle |
|---|---|
| 001 | Integration surface & sequencing map |
| 002 | Impact on skills |
| 003 | Impact on commands + agents + hooks |
| 004 | UX-first design (top priority) |
| 005 | Automation-first design + integration synthesis (top priority) |

Outputs: `research.md` (synthesis) + `integration-plan.md` (actionable roadmap). Read-only research; nothing implemented.
