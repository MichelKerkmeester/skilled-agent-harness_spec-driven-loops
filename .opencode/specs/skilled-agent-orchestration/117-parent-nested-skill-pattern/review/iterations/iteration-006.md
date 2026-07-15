# Review Iteration 006 — sk-doc §10 accuracy

- **Model**: opus-4.8 (claude2)
- **Seat**: r06
- **clean**: False
- **findings**: 2

## Analysis

I've completed my audit. All the load-bearing invariant claims in §10 verify clean against the shipped code. I found two consistency defects, both in how §10/templates describe the worked example's packet↔backend topology.

## Review summary — r06/10: sk-doc §10 accuracy vs shipped code

**Verified accurate (no defect):**
- The one-identity mechanism — §10:1047 cites `discoverGraphMetadataFiles` (recursive, confirmed `skill-graph-db.ts:601-626`), `isSkillGraphMetadata` keying on `skill_id`/`family`/`edges` (`:644-646`), the throw on `skill_id != folder` (`parseSkillMetadata` `:656-657`), and family-set rejection (`:660-662`, `ALLOWED_FAMILIES = {cli,mcp,sk-code,deep-loop,sk-util,system}` `:133-139`). All correct.
- The four `routingClass` values (§10:1071-1076) match the registry contract (`mode-registry.json:11`) and drift-guard (`:68`).
- Python `DEEP_ROUTING_MODE_BY_KEY` = 3 lexical (`skill_advisor.py:2320-2324`); TS `DEEP_MODE_BY_CANONICAL` = those 3 + `deep-improvement→agent-improvement` (`aliases.ts:96-101`). Matches §10's lexical/alias-fold split and the "no runtime read" C-plus claim (§10:1085-1089).
- `advisorDefaultMode` fold (§10:1080), grandfathered ai-council (§10:1109), exactly one hub `graph-metadata.json` (`skill_id=deep-loop-workflows`, `family=deep-loop`) — all confirmed.
- Registry **template** vs real `advisorRoutingContract`: identical 6-field schema; discriminator and per-class advisorRouting shapes match. No schema divergence.
- §10 is fully consistent with `parent-skill-check.cjs` and `research.md` (Model A via C-plus). All cross-ref links resolve.

**Defects found (2):**

**F1 (P1):** §10:1024 calls the worked example "five mode packets over the frozen `deep-loop-runtime` backend." The registry's own `backendKind` discriminator contradicts this: only **4** packets run over `runtime-loop-type` (deep-loop-runtime); the `deep-improvement` packet's modes run over `improvement-host` (3), explicitly NOT deep-loop-runtime (`mode-registry.json:8`, modes at `:84,103,118`). The hub template reinforces the same single-backend assumption ("All modes consume `[backend]`", `parent_skill_hub_template.md:126-127`). Note: the skill's own registered description uses the same loose phrasing, so it's a sanctioned simplification — but it's still inaccurate against the authoritative registry §10 documents.

**F2 (P2):** §10's anatomy (`:1033-1035`) and naming standard "folder == packetSkillName == deep-<mode>" (`:1042`) imply a 1-mode-per-packet mapping. The cited worked example has **7 modes across 5 packets**: `deep-improvement` hosts 3 modes (agent-improvement, model-benchmark, skill-benchmark), none named `deep-improvement`, so `deep-<mode>` can't resolve for that packet. The many-to-one packet case is never surfaced (only the ai-council folder/name grandfather exception is, `:1109`).

No P0s — no invariant is broken or misdescribed.

===REVIEW-JSON===
{"slice":"sk-doc §10 accuracy vs shipped parent-skill code","findings":[{"severity":"P1","path":".opencode/skills/sk-doc/references/skill_creation.md:1024","issue":"§10 says the worked example is 'five mode packets over the frozen deep-loop-runtime backend', but mode-registry.json's backendKind discriminator shows only 4 packets use runtime-loop-type (deep-loop-runtime); the deep-improvement packet runs over improvement-host (3 modes), NOT deep-loop-runtime (mode-registry.json:8,84,103,118). The hub template repeats the single-backend assumption ('All modes consume [backend]', parent_skill_hub_template.md:126-127).","fix":"Qualify to 'five mode packets, four over the frozen deep-loop-runtime backend and the deep-improvement packet over improvement-host', consistent with the two backendKinds the registry defines.","confidence":"med"},{"severity":"P2","path":".opencode/skills/sk-doc/references/skill_creation.md:1042","issue":"§10 anatomy (:1033-1035) and naming standard 'folder == packetSkillName == deep-<mode>' (:1042) imply one packet per mode, but the cited worked example has 7 workflowModes across 5 packets: deep-improvement hosts 3 modes (agent-improvement/model-benchmark/skill-benchmark), none named deep-improvement, so 'deep-<mode>' cannot resolve. The many-modes-to-one-packet case is never surfaced (only ai-council's grandfather exception is).","fix":"Add a sentence noting a packet may host multiple modes (deep-improvement hosts 3) and clarify the naming standard applies to single-mode packets; the multi-mode packet keeps one packetSkillName.","confidence":"high"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/skills/sk-doc/references/skill_creation.md:1024",
    "issue": "\u00a710 says the worked example is 'five mode packets over the frozen deep-loop-runtime backend', but mode-registry.json's backendKind discriminator shows only 4 packets use runtime-loop-type (deep-loop-runtime); the deep-improvement packet runs over improvement-host (3 modes), NOT deep-loop-runtime (mode-registry.json:8,84,103,118). The hub template repeats the single-backend assumption ('All modes consume [backend]', parent_skill_hub_template.md:126-127).",
    "fix": "Qualify to 'five mode packets, four over the frozen deep-loop-runtime backend and the deep-improvement packet over improvement-host', consistent with the two backendKinds the registry defines.",
    "confidence": "med"
  },
  {
    "severity": "P2",
    "path": ".opencode/skills/sk-doc/references/skill_creation.md:1042",
    "issue": "\u00a710 anatomy (:1033-1035) and naming standard 'folder == packetSkillName == deep-<mode>' (:1042) imply one packet per mode, but the cited worked example has 7 workflowModes across 5 packets: deep-improvement hosts 3 modes (agent-improvement/model-benchmark/skill-benchmark), none named deep-improvement, so 'deep-<mode>' cannot resolve. The many-modes-to-one-packet case is never surfaced (only ai-council's grandfather exception is).",
    "fix": "Add a sentence noting a packet may host multiple modes (deep-improvement hosts 3) and clarify the naming standard applies to single-mode packets; the multi-mode packet keeps one packetSkillName.",
    "confidence": "high"
  }
]
```
