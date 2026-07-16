# Iteration 003 - Traceability

Focus: constitutional tool-routing rule versus active project search gates.

## Files Reviewed

- `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md`
- `AGENTS.md`
- Target spec `spec.md`

## Finding

### F003 - P1 - Semantic code-search routing falls back to memory_search even though memory does not index arbitrary code

The constitutional routing table says semantic/concept code search should use Code Graph as primary and `memory_search` as fallback [SOURCE: .opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:41].

The active project instruction says concept code search should use Code Graph structural query plus Grep pattern search [SOURCE: AGENTS.md:89] [SOURCE: AGENTS.md:90]. It then states that `memory_search` is only for spec docs, saved decisions, and memory context, and that it does not index arbitrary project code [SOURCE: AGENTS.md:106].

Impact: when Code Graph is unavailable or weak, following the constitutional fallback can skip the actual source tree and produce false negatives. This matters directly for governance audits because enforcement often lives in scripts and hooks, not memory records.

Fix: update the constitutional semantic-code-search fallback to Grep/Glob plus direct reads when Code Graph is unavailable. Keep `memory_search` under spec-doc continuity and prior-decision retrieval.

## Traceability Checks

| Protocol | Status | Evidence |
| --- | --- | --- |
| spec_code | partial | The target spec asks for constitutional rule enforcement drift; F003 is a confirmed drift between constitutional routing and project gates. |
| checklist_evidence | pass by absence | No `checklist.md` exists in the level-1 target packet, so there are no checked claims to validate. |

## Claim Adjudication Packet

```json
{
  "findingId": "F003",
  "claim": "The constitutional fallback for semantic code search contradicts AGENTS.md and points to a tool that does not index arbitrary project code.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md:41",
    "AGENTS.md:89",
    "AGENTS.md:90",
    "AGENTS.md:106"
  ],
  "counterevidenceSought": "Checked the same constitutional file for later FTS/Grep fallback text and AGENTS.md for code-search fallback after graph unavailability.",
  "alternativeExplanation": "The constitutional table may intend memory_search as a prior-decision fallback, but it is placed under code search and therefore conflicts with the code-search gate.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade if the table is scoped to prior spec decisions rather than source-code discovery, or if memory_search starts indexing arbitrary project code."
}
```

Review verdict: CONDITIONAL
