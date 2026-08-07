ROLE: Senior systems-integration analyst. READ-ONLY analysis — do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement (pre-approved; skip Gate 3).

WHAT WE ARE INTEGRATING (read this FIRST): the caura-memclaw memory-hardening proposal at
  .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md
(detail: ../research.md section 5, teachings T1-T14). In short: a new child packet 010 (P1 idempotency receipts for retryable memory_save/update; P2 a lightweight MCP tool-ownership map; P3 a stale/status hard-exclusion search audit) PLUS amendments to existing children — 002 (source_kind provenance + auto-cannot-overwrite-manual + advisory near-duplicate + automated-mutation audit), 003 (confirm explicit fingerprint design), 004 (first-timestamp-idempotent tombstone + active/purgeable index split + entity!=causal boundary), 005 (natural-key idempotent edge promotion + skip-manual), 006 (idempotency reconciliation), 007 (stale-exclusion audit), and the BIG one 008 (scope feedback reducers DOWN to event-capture + diagnostics only; defer active mutation; reserve system feedback types; symmetric damping; constitutional immunity).

WHAT WE INTEGRATE INTO: the "Spec Kit Memory" system — a LOCAL single-user store. Live surfaces:
- Memory MCP server handlers: .opencode/skills/system-spec-kit/mcp_server/handlers/ (memory-save.ts, save/, mutation-hooks.ts, memory-crud-update.ts, memory-crud-delete.ts, memory-search.ts, memory-triggers.ts, causal-graph.ts, causal-links-processor.ts, memory-retention-sweep.ts)
- Child specs to amend: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/00{2,3,4,5,6,7,8}-*/spec.md
- Constitutional rules: .opencode/skills/system-spec-kit/constitutional/

TOP PRIORITIES (operator-set): UX and AUTOMATION. For EVERY item specify (a) AUTOMATION — how to make it fully automatic/invisible (prefer on-write hooks, good defaults, self-maintaining sweeps, /doctor checks over manual steps/flags/prompts); (b) UX — zero-friction, good defaults the user never sets, clear non-noisy surfacing. Flag anything that adds friction or a manual step as a problem to design away.

YOUR ANGLE (iteration 001): INTEGRATION SURFACE & SEQUENCING MAP. Read the proposal, then explore the memory handlers + the 002-008 child specs + constitutional rules. For EACH proposal item, find the EXACT file/surface where it lands, the change type (new file / edit / config / doc / constitutional rule), whether it is user-visible or invisible, and whether it can be automated. Then give a dependency-ordered integration sequence.

DELIVERABLE — markdown with EXACTLY these sections (cite real file paths):
## Integration map
A table: Item | Target file/surface | Change type | User-visible? | Automatable? | Notes.
## Integration sequence
Dependency-ordered list of what to build first and why.
## UX + automation hooks per item
For the top ~8 items: the automatic trigger + the UX touchpoint.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"001","focus":"integration surface & sequencing map","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"impacts":["<file> <- <item>"],"sources":["<path>"]}
