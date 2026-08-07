SYNTHESIS phase for 027 pt-02 cross-validation deep-research run. All 10 iterations complete + converged event emitted. Now produce 4 final deliverables.

INPUT: read ALL 10 iteration files + ALL 10 delta files + state.jsonl from `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-based-refinement-pt-02/`. Also re-read the 5 phase specs in `027/{001-005}-*/spec.md` to ground amendment proposals.

PRODUCE 4 DELIVERABLES (all written to pt-02/):

### 1. `pt-02/research.md` — second-pass synthesis (~12-17 sections)

Required sections:
- **Executive Summary** (1 paragraph) — what the cross-validation pass found at a glance
- **IRQ1-IRQ10 sections** (one per IRQ) — each section cites ≥2 file:line refs (1 from prior pass-1 spec or phase scaffold + 1 from mcp_server source code), summarizes the IRQ verdict (BLOCKING / CONFIRMED / NO-CHANGE-NEEDED), and links to iteration-NNN.md for detail
- **Cross-cutting risks** — patterns that span multiple IRQs (e.g., schema contract drift surfaced in iter-2 / iter-6 / iter-8)
- **Comparison vs pass 1** — what the deepseek-v4-pro run got right, what it missed
- **Recommended phasing-order amendment** — final recommended order with rationale (per iter-10 finding)
- **Open Questions** — anything unresolved that warrants a third pass (or a different investigation)
- **References** — all file paths cited inline

Target ~300-400 lines. Structured for readability — operator should be able to scan in <30 minutes.

### 2. `pt-02/findings.md` — implementation-risk matrix

Required structure: a single matrix table with rows = phases (001-005) and columns = IRQ1...IRQ10. Each cell contains the verdict for that phase × IRQ pairing: `BLOCKING` / `CONFIRMED` / `NO-CHANGE-NEEDED` / `N/A`.

Below the matrix, list each BLOCKING finding with:
- ID (e.g., `B-iter002-002`)
- Phase affected
- Description (≤2 sentences)
- Spec.md REQ ID it impacts (if any)
- Recommended remediation (1 sentence)

Same for CONFIRMED findings (subset, list ≥3) and NO-CHANGE-NEEDED findings (subset, list ≥3) for verdict diversity coverage.

Target ~150-250 lines.

### 3. `pt-02/sub-packet-amendments.md` — concrete proposed amendments

For EACH of the 5 phase specs (001 / 002 / 003 / 004 / 005), produce a section titled "Phase NNN amendments". Each section contains:
- **Status**: NEEDS_AMENDMENT or NO_CHANGES_NEEDED
- **REQ-level edits**: list each new/changed/removed REQ with the proposed text
- **Plan-level edits**: list each phase-step change with the proposed text
- **Tasks-level edits**: new tasks to add OR existing tasks to remove
- **Risks-level edits**: new risks to register
- **LOC delta estimate**: how much the proposed amendments change the original LOC estimate

These are PROPOSALS — the user reviews + applies them in a follow-on packet, NOT auto-applied.

Target ~250-400 lines.

### 4. `pt-02/resource-map.md` — second-pass path ledger

Required sections:
- **Inputs** (read-only paths used during pass 2) — group by category (027 phase specs / pass-1 artifacts / mcp_server source / cli-opencode references)
- **Outputs** (written paths in pt-02/) — list each iteration file, delta file, deliverable, prompt
- **External references** — any URLs (none expected; this is internal)
- **Cross-packet dependencies** — relationships to pass-1 artifacts and the 5 phase scaffolds
- **Audit trail** (bash one-liners that verify the run)

Target ~120-180 lines.

CONSTRAINTS:
- READ-ONLY against 027/{spec.md, 001-005/, research/} + pt-02/* (you wrote these in iters 1-10) + mcp_server/.
- WRITE pt-02/ ONLY. NEVER touch any phase 001-005 dir, NEVER touch original 027/research/iterations/.
- Cite file:line for every claim. No bare assertions.
- All 4 deliverables written in this single dispatch (max 14 tool calls — synthesis is the highest-budget iter).

After writing all 4, output a final summary line: "SYNTHESIS COMPLETE: research.md=NB, findings.md=NB, sub-packet-amendments.md=NB, resource-map.md=NB" with byte counts.
