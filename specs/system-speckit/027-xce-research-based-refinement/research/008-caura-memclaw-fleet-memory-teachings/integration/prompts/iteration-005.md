ROLE: Senior automation/platform + integration architect. READ-ONLY analysis — do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement (pre-approved; skip Gate 3).

WHAT WE ARE INTEGRATING (read FIRST): the proposal at .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md (new child 010 + amendments to 002-008 + the 008 feedback reframe). Also skim ../research.md section 5 (T1-T14) and section 7 (027-child mapping).

WHAT WE INTEGRATE INTO: Spec Kit Memory (LOCAL single-user). Automation surfaces to study:
- .opencode/skills/system-spec-kit/mcp_server/handlers/mutation-hooks.ts  (on-write hook surface — THE place to auto-run things on every memory write)
- handlers/memory-retention-sweep.ts  (scheduled/maintenance sweeps)
- handlers/memory-index.ts + memory-index-discovery.ts  (the self-maintaining incremental index)
- .opencode/skills/system-spec-kit/references/hooks/  (startup / skill-advisor / session hooks)

THIS ITERATION IS THE OPERATOR'S CO-#1 PRIORITY: AUTOMATION. The guiding principle: NO manual steps. Every behavior should fire automatically from an existing surface (on-write hook, scheduled sweep, startup, /doctor, pre-commit) and be self-maintaining.

YOUR ANGLE (iteration 005): AUTOMATION-FIRST DESIGN + INTEGRATION SYNTHESIS. Two parts:

PART A — Automation design. For EACH behavior (source_kind tagging, idempotency, advisory near-duplicate, feedback-event capture, automated-mutation audit, tombstone, stale-exclusion audit, edge-promotion dedup, tool-ownership lint) specify: the AUTO-TRIGGER (which hook/sweep/surface fires it), whether it can be DEFAULT-ON safely, and what makes it self-maintaining (no human upkeep). Identify what mutation-hooks.ts can already host vs what needs a new hook point.

PART B — Integration synthesis. Produce the full PHASED integration roadmap that ties together the surface map, skills/commands/agents/hooks impact, the UX design, and this automation design.

DELIVERABLE — markdown with EXACTLY these sections (cite real paths):
## Automation design
Per behavior: auto-trigger · default-on? · self-maintaining mechanism.
## Zero-manual principles
3-6 principles for keeping the whole thing automatic.
## INTEGRATION ROADMAP
Phases (e.g. Phase 0 docs/scoping, Phase 1 provenance+audit, Phase 2 idempotency, Phase 3 feedback event log, Phase 4 polish). Each phase: items, target files, the automation trigger, the UX touchpoint, and exit criteria.
## Top risks + mitigations

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"005","focus":"automation-first design + integration synthesis","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"impacts":["<behavior> -> <auto-trigger>"],"sources":["<path>"]}
