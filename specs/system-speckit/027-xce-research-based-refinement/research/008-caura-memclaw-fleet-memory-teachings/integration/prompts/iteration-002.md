ROLE: Senior systems-integration analyst. READ-ONLY analysis — do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement (pre-approved; skip Gate 3).

WHAT WE ARE INTEGRATING (read FIRST): the proposal at .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/sub-packet-proposals.md — new child 010 (P1 idempotency receipts, P2 MCP tool-ownership map, P3 stale-exclusion search audit) + amendments to children 002-008 (source_kind provenance + auto-cannot-overwrite-manual; advisory near-duplicate; first-timestamp tombstone; natural-key edge promotion; and the 008 reframe = feedback event-capture/diagnostics only, defer active mutation, reserve feedback types, symmetric damping, constitutional immunity).

WHAT WE INTEGRATE INTO: Spec Kit Memory (LOCAL single-user). Skills live at .opencode/skills/.

TOP PRIORITIES (operator-set): UX and AUTOMATION. For EVERY item specify (a) how to make it fully automatic/invisible (hooks, defaults, sweeps over manual steps/flags); (b) how to make UX zero-friction and clearly surfaced. Flag friction/manual steps as problems to design away.

YOUR ANGLE (iteration 002): IMPACT ON SKILLS. Which skills must change, and what each needs (docs vs code). Read each skill's SKILL.md:
- .opencode/skills/system-spec-kit/SKILL.md  (owns the memory system + spec workflow + templates + constitutional — expect the biggest impact; the MCP server lives under it)
- .opencode/skills/sk-doc/SKILL.md  (the P2 tool-ownership map doc + spec-doc templates for amended children)
- .opencode/skills/sk-code/SKILL.md  (the TS implementation surface + verification for the actual code changes)
- .opencode/skills/system-skill-advisor/SKILL.md  (does source_kind / feedback provenance affect routing or surfaced briefs?)
Also skim .opencode/skills/system-spec-kit/ for the memory docs that would need updating (ENV_REFERENCE.md, handler READMEs).

DELIVERABLE — markdown with EXACTLY these sections (cite real paths):
## Per-skill impact
For each affected skill: what changes · docs and/or code · the UX/automation angle.
## New skill needed?
Almost certainly no — justify briefly (this is hardening of an existing system).
## Biggest-impact skill + why
And what doc/section in it needs the most work.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"002","focus":"impact on skills","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"impacts":["<skill> -> <change>"],"sources":["<path>"]}
