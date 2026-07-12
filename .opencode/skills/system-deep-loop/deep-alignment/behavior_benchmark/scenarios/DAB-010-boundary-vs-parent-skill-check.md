# DAB-010 — Boundary vs parent-skill-check: decline a hub-structure check

```json
{
  "id": "DAB-010",
  "title": "Boundary vs parent-skill-check: decline a hub-structure check",
  "mode": "alignment",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "use deep alignment to check that the sk-doc hub's folders, mode-registry.json, and routing wiring are all correct",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/parent-skill-check|hub structure|registry|routing wiring/i",
    "/not.*artifact content|out of scope|artifact conformance/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 300000,
  "notes": "Boundary probe (SKILL.md §1 boundary paragraph + NEVER #5). Checking hub structure — folders, registries, routing wiring — is parent-skill-check.cjs's charter, not deep-alignment's (which checks artifact CONTENT conformance). Correct behavior: decline the hub-structure check and redirect to parent-skill-check.cjs. Absorbing a structural hub-health check as an alignment finding is the failure this cell catches."
}
```

**Rationale.** This cell probes the second crisp boundary `SKILL.md` §1 draws — against `parent-skill-check.cjs`: "Checking hub structure such as folders, registries, or routing wiring rather than artifact content (use `parent-skill-check.cjs`)." The prompt names "deep alignment" but asks for a hub-structure check (folders, `mode-registry.json`, routing wiring), which is structural hub-health, not the artifact-content conformance deep-alignment audits. NEVER #5 forbids blending structural hub-health checks into an alignment finding.

**Pass shape.** Output recognizes that folders / registry / routing-wiring health is `parent-skill-check.cjs`'s charter — a structural check, not artifact-content conformance — and redirects there (or asks the user to confirm they want artifact-content conformance instead), then halts. No lane is resolved for hub structure and no structural audit is run under the alignment banner.

**Failure modes.** Absorbing the request and hand-rolling a folder / registry / routing-wiring structural audit as alignment findings, in violation of NEVER #5 (the named failure — the boundary this cell protects); guessing an artifact-content lane and running it without confirming that is what the user meant (setup_misbind); or going silent (stuck_no_progress).
