ROLE: Senior systems-integration analyst. READ-ONLY analysis — do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement (pre-approved; skip Gate 3).

WHAT WE ARE INTEGRATING (read FIRST): the proposal at .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md — new child 015 (P1 idempotency receipts, P2 MCP tool-ownership map, P3 stale-exclusion search audit) + amendments to 002-008 (source_kind provenance + auto-cannot-overwrite-manual; advisory near-duplicate; automated-mutation audit; first-timestamp tombstone; natural-key edge promotion; the 008 reframe = feedback event-capture/diagnostics only, defer active mutation, reserve feedback types, symmetric damping, constitutional immunity).

WHAT WE INTEGRATE INTO: Spec Kit Memory (LOCAL single-user).

TOP PRIORITIES (operator-set): UX and AUTOMATION. For EVERY item specify (a) the automatic trigger that makes it invisible; (b) the zero-friction UX. Manual steps/flags = problems to design away.

YOUR ANGLE (iteration 003): IMPACT ON COMMANDS + AGENTS + HOOKS — the automation-heavy angle. Map each proposal item to the command / agent / hook surface that triggers or exposes it.
Read:
- Commands: .opencode/commands/memory/{save,manage,search,learn}.md, .opencode/commands/speckit/{plan,implement,complete,resume}.md, .opencode/commands/doctor/  (where would source_kind, idempotency, feedback-event capture, audit, stale-exclusion, tool-ownership-lint surface?)
- Agents: .opencode/agents/{context,orchestrate,markdown}.md  (which read/write memory)
- HOOKS / automation surfaces (emphasize these): .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts, .opencode/skills/system-spec-kit/references/hooks/, plus any startup / skill-advisor / pre-commit hooks you can find.

DELIVERABLE — markdown with EXACTLY these sections (cite real paths):
## Commands impact
Per command: which proposal item it surfaces + the change (esp. /memory:save = source_kind + idempotency + feedback capture; /memory:search = stale-exclusion; /memory:manage = audit/retention; /memory:learn = constitutional immunity; /speckit:* continuity saves = source_kind; /doctor = new checks).
## Agents impact
## Hooks / automation surfaces
Item -> automatic trigger (on-write hook / scheduled sweep / startup / /doctor / pre-commit) -> surface. This is the most important section — most of the UX/automation lives here.
## UX/automation notes

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"003","focus":"impact on commands + agents + hooks","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"impacts":["<surface> -> <item>"],"sources":["<path>"]}
