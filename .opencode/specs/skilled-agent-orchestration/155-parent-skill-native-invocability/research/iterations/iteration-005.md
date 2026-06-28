# Research Iteration 5 — gpt-5.5 (xhigh, fast)
## Slice: 001 reconciliation plan (status, Option E scope, probe claim, fallback)
Dispatched 2026-06-28T08:53:33.931Z | wall 188s

---

Canonical 001 state should be: decision-complete, not build-complete. Option E is Accepted; the runtime probe path is obsolete for this packet; the docs should cite the on-disk hub implementations and keep A/B commands/agents as the explicit fallback if hub routing is later found insufficient.

```json
{
  "verified_facts": [
    {
      "claim": "001 ADR-001 is already Accepted and selects Option E.",
      "status": "confirmed",
      "evidence": ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md:47 \"| **Status** | Accepted |\"; line 70 \"**We chose**: Option E — invokable-hub routing.\""
    },
    {
      "claim": "001 still carries stale proposed/deferred/probe language across spec, plan, tasks, and YAML.",
      "status": "confirmed",
      "evidence": "spec.md:50 \"mechanism choice ... pending Phase 1 research\"; plan.md:288 \"**Status**: Proposed\"; tasks.md:49 \"All tasks below are pending\"; spec.md:27 \"completion_pct: 0\""
    },
    {
      "claim": "The real-runtime-probe claim is false for the current packet state.",
      "status": "confirmed",
      "evidence": "decision-record.md:99 claims \"evidence from a real runtime probe\"; tasks.md:59-63 leaves probe/prototype/decision tasks unchecked; implementation-summary.md:90 says \"Manual `Skill()` reachability probe | Not run\""
    },
    {
      "claim": "Option E has a live deep-loop reference implementation on disk.",
      "status": "confirmed",
      "evidence": ".opencode/skills/deep-loop-workflows/SKILL.md:18 \"Invoke it as `Skill(deep-loop-workflows)`\"; line 36 \"Routing is registry-driven (invokable-hub, Option E)\"; lines 110-115 define success for `Skill(deep-loop-workflows[, hint])` reaching a mode with one graph-metadata."
    },
    {
      "claim": "Option E also exists in the current sk-design implementation.",
      "status": "confirmed",
      "evidence": ".opencode/skills/sk-design/README.md:22 \"Invoke with | `Skill(sk-design)`\"; line 36 \"`Skill(sk-design)` loads the hub, and the hub routes the request to one of five modes through `mode-registry.json`.\""
    },
    {
      "claim": "154/008 records the sk-design adoption and says 155 is satisfied by hub routing, but 154/008 itself was authored as plan-only; current sk-design files are the stronger on-disk proof.",
      "status": "partial",
      "evidence": "154/008 spec.md:64 \"No implementation in this packet\"; 154/008 decision-record.md:181 \"`Skill(sk-design)` is invocable because the hub is a top-level skill\"; .opencode/skills/sk-design/README.md:36 confirms the implemented hub routing now exists."
    },
    {
      "claim": "The parent-skill contract supports a hub-level union grant, which matters when reconciling 001's no-widening prose elsewhere.",
      "status": "confirmed",
      "evidence": ".opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md:53 \"`allowed-tools` is the **union** the modes need\""
    },
    {
      "claim": "SC-002 currently has no Option E fallback; it only frames fallback around runtime enhancement Option D.",
      "status": "confirmed",
      "evidence": "spec.md:132 requires fallback \"if a runtime enhancement is out of reach in-repo\"; decision-record.md:109 gives fallback only for \"Option D is not achievable in-repo\"; decision-record.md:72 says A/B remain complementary, not the explicit fallback."
    },
    {
      "claim": "Parent and child status disagree: parent says 001 accepted; child still says draft/0 percent.",
      "status": "confirmed",
      "evidence": "parent spec.md:49 says 001 \"Mechanism **accepted**\"; child spec.md:62 says \"Status | Draft\"; child graph-metadata.json:61 says \"status\": \"draft\"; child spec.md:27 says \"completion_pct: 0\""
    },
    {
      "claim": "The one-identity invariant holds in the current deep-loop and sk-design hub trees.",
      "status": "confirmed",
      "evidence": "command `find .opencode/skills/deep-loop-workflows .opencode/skills/sk-design -name graph-metadata.json -print` returned only `.opencode/skills/deep-loop-workflows/graph-metadata.json` and `.opencode/skills/sk-design/graph-metadata.json`."
    }
  ],
  "recommended_steps": [
    {
      "id": "S19",
      "action": "Reconcile `decision-record.md` to the canonical state while keeping ADR-001 Accepted: update frontmatter `recent_action` to `Accepted Option E invokable-hub routing`; set `completion_pct` to 100; move the Option-D/runtime-probe question from `open_questions` to `answered_questions`; rewrite Context to say direct `Skill(<mode>)` remains unavailable but `Skill(<parent>)` hub routing is the accepted mechanism; change the alternatives intro from four/preliminary/research-gated to five options with E chosen; remove the false line 99 real-runtime-probe claim; replace the Phase-1/runtime-probe cost with `no code change in 001`; add the Option E fallback in Consequences: if hub routing is insufficient, preserve A/B commands and agents as fallback surfaces, C only with explicit identity cost, D only as a separate runtime enhancement.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md"
      ],
      "rationale": "The decision artifact already chose Option E; the fix is to remove stale deferred/probe language, not reopen the mechanism.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S20",
      "action": "Update child `spec.md` to make 001 decision-complete: set metadata status from Draft to `Completed - mechanism decided`; set YAML `recent_action` to Option E accepted, `next_safe_action` to `No further build in 001; apply downstream packet reconciliation/validation`, and `completion_pct` to 100; rewrite Executive Summary and Key Decisions to say Option E is accepted; add Option E to Scope alongside A-D; update REQ-002 from four A-D/pending to five A-E/Option E accepted; update REQ-003 so the runtime-extensibility probe is obsolete for 001; update SC-002 to include the Option E fallback: A/B commands and agents remain the fallback surfaces if hub routing proves insufficient, C is last-resort with identity cost, D is separate out-of-repo runtime work; update risks/open questions so Option D is not gating 001.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/spec.md"
      ],
      "rationale": "The spec is the main source of the stale A-D/pending/probe narrative and must match the accepted decision.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S21",
      "action": "Update `plan.md` so the plan records the completed decision rather than future research: set frontmatter `completion_pct` to 100 and update `recent_action`/`next_safe_action`; change Overview from `No mechanism is pre-decided` to `Option E is decided`; mark Phase 1 decision work complete and runtime/prototype probe items `N/A - superseded by Option E`; remove probe dependency edges from the critical path; change ADR-001 status from Proposed to Accepted; replace the Deferred decision text with Option E and its A/B fallback; change testing strategy so a live runtime probe is not required for 001 and only belongs to future runtime/per-mode direct-invocation work.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/plan.md"
      ],
      "rationale": "The plan must stop instructing future agents to run obsolete discovery/prototype work before accepting the mechanism.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S22",
      "action": "Update `tasks.md` to close 001 cleanly: add a notation for `N/A-superseded`; set YAML `completion_pct` to 100 and update `recent_action`/`next_safe_action`; change the description away from `all pending`; mark T001-T004 as `N/A-superseded by accepted Option E, no runtime-extensibility probe required`; mark T005 complete and update it to `Produce the A-E decision, choose Option E, and record fallback`; mark Phase 2/3 implementation/runtime-probe tasks as `N/A for 001 - no further build in this packet`; update completion criteria to count completed decision tasks plus N/A-superseded tasks as non-blocking.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/tasks.md"
      ],
      "rationale": "The task list should tell the next agent that the decision work is done and the probe work was intentionally retired.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S23",
      "action": "Update `checklist.md` from all-zero plan-only verification to decision-complete verification: set YAML `completion_pct` to 100 and update `recent_action`/`next_safe_action`; mark documentation/ADR/status-sync items complete with evidence from spec/plan/tasks/decision-record; mark code, implementation, deployment, and runtime-probe checks `N/A - no code/build in 001`; add or strengthen the ADR synchronization check so plan.md and decision-record.md cannot disagree on status; update the Verification Summary counts so verified/N/A items no longer report 0/11 P0, 0/14 P1, 0/2 P2.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/checklist.md"
      ],
      "rationale": "The checklist is currently a false negative for a decision-complete packet and does not catch the ADR status drift that caused the review failure.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S24",
      "action": "Rewrite `implementation-summary.md` as an honest decision-complete summary: set frontmatter description/recent_action/next_safe_action/completion_pct to reflect Option E accepted and no further 001 build; change Spec Folder to the full child path; keep Completed as `Mechanism decided (Option E, Accepted)` but cite both on-disk references (`deep-loop-workflows` and `sk-design`) instead of saying only `spec 154`; remove `mechanism deferred`, `next stage is runtime probe`, and manual probe deferred claims; verification table should say `Reference implementation evidence: PASS via on-disk hubs`, `Manual runtime probe: N/A-superseded, not run`, and `validate.sh --strict: rerun after remediation edits` unless the remediator actually runs it.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md"
      ],
      "rationale": "This is where the packet most visibly contradicts itself: it says completed, deferred, validated, and not probed at once.",
      "risk": "low",
      "reversible": true
    },
    {
      "id": "S25",
      "action": "Reconcile machine-readable and parent status after the doc edits: set child `graph-metadata.json` derived status from `draft` to `completed` or `decision-complete`; regenerate/update child `description.json` and graph metadata through the normal Spec-Kit metadata path if available; update the parent phase-map row for 001 only if desired to replace `validated in practice by the 154 sk-design conversion` with `reference implementations exist in deep-loop-workflows and sk-design; 154 records adoption/satisfaction`; do not mark the whole parent complete while 002 remains under remediation.",
      "files": [
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/graph-metadata.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/001-invocability-mechanism/description.json",
        ".opencode/specs/skilled-agent-orchestration/155-parent-skill-native-invocability/spec.md"
      ],
      "rationale": "Human-readable child status and machine-readable child status must agree, while the phase parent should remain honest about 002 still failing.",
      "risk": "low",
      "reversible": true
    }
  ],
  "open_decisions": [
    {
      "question": "Should remediation run a live runtime probe for 001 now?",
      "options": [
        "A: No; mark probe tasks N/A-superseded because Option E avoids runtime extensibility.",
        "B: Run and cite a live manual probe anyway.",
        "C: Reopen Option D runtime enhancement research."
      ],
      "recommendation": "A. The accepted mechanism is hub routing through an already invocable parent; running a runtime-extensibility probe would reintroduce obsolete work."
    },
    {
      "question": "What completion state should 001 use?",
      "options": [
        "A: 100 percent decision-complete, no further build in 001.",
        "B: Partial because no runtime probe happened.",
        "C: Draft until 002 is repaired."
      ],
      "recommendation": "A. 001 owns the mechanism decision; 002 owns deep-loop alignment remediation."
    },
    {
      "question": "Should 154 remain the sole cited reference implementation?",
      "options": [
        "A: No; cite live deep-loop-workflows and sk-design files, with 154 as adoption/history.",
        "B: Yes; keep the existing spec-154-only wording.",
        "C: Remove sk-design from 001 entirely."
      ],
      "recommendation": "A. 154/008 records that 155 was satisfied, but current on-disk hubs are the stronger evidence."
    }
  ],
  "critique_prior": [
    "The prior ledger is right that Option E is the decision, but `implementation-summary.md` should not keep saying the proof lives only in spec 154; deep-loop-workflows now names Option E directly and sk-design currently implements the same hub-routing pattern.",
    "The review finding about the false runtime probe is valid, but the remediation should remove/supersede the probe narrative rather than perform a probe to justify old wording.",
    "Do not let 001's generic `no advisor merged-identity extension needed` language leak into 002 as a deletion plan. The existing deep-loop advisor projection is a separate 002/R4 concern already covered by S9/S13."
  ]
}
```
