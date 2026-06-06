ROLE: Senior product/UX + systems analyst. READ-ONLY analysis — do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement (pre-approved; skip Gate 3).

WHAT WE ARE INTEGRATING (read FIRST): the proposal at .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md — new child 015 (idempotency receipts, MCP tool-ownership map, stale-exclusion audit) + amendments to 002-008 (source_kind provenance + auto-cannot-overwrite-manual; advisory near-duplicate; automated-mutation audit; tombstone delete; the 008 feedback reframe = event-capture/diagnostics only).

WHAT WE INTEGRATE INTO: Spec Kit Memory — a LOCAL single-user store driven through MCP tools and slash commands by an AI coding agent on behalf of ONE developer.

THIS ITERATION IS THE OPERATOR'S #1 PRIORITY: UX. The guiding principle: the developer should get all the safety/quality benefits with essentially ZERO added friction — great defaults they never set, useful signals surfaced without noise, and nothing that turns a one-step save into a multi-step chore.

YOUR ANGLE (iteration 004): UX-FIRST DESIGN. For EACH new user-facing behavior, design the UX. Behaviors: source_kind tagging; idempotency (retry-safe save); advisory near-duplicate hint; feedback-event capture + diagnostics; automated-mutation audit; tombstone delete; stale-exclusion in search; the MCP tool-ownership map. Ground it by reading the actual command + handler output shapes:
- .opencode/commands/memory/save.md, .opencode/commands/memory/search.md
- .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts (result/output shape), handlers/memory-search.ts

For EACH behavior specify: DEFAULT (auto-inferred, never asked — e.g. source_kind inferred from caller/context); WHERE IT SURFACES (save output line, search result hint, dashboard, /doctor, /memory:manage) and how to keep it NON-NOISY; FRICTION BUDGET (must stay zero added steps on the hot path); OPT-OUT (if any); ERROR/EDGE messaging (helpful, not alarming).

DELIVERABLE — markdown with EXACTLY these sections (cite real paths):
## Per-behavior UX design
Per behavior: default · surfacing · friction-budget · opt-out · errors.
## UX principles for this integration
3-6 crisp principles (e.g. "infer, don't ask"; "surface on demand, not by default").
## Friction anti-patterns to avoid
Concrete things in the proposal that, done naively, would add friction — and the zero-friction alternative.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"004","focus":"UX-first design","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"impacts":["<behavior> -> <ux default>"],"sources":["<path>"]}
