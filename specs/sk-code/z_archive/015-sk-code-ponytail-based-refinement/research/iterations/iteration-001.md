# Iteration 1 — Wave 1 (generate) — seat opus-1 (claude-opus-4-8)

- Lens: decision-ladder-transplant
- Status: complete | exit=0 | duration=301s | findings=6 | newInfoRatio=0.7
- Focus: Can ponytail's 6-rung lazy ladder be encoded as a pre-implementation gate in sk-code, and where?
- Dispatch: claude account-2 CLI, --model opus --permission-mode plan (read-only)

## Seat output

This is a read-only research deliverable, so I will not call `ExitPlanMode` (its contract explicitly excludes research/information-gathering tasks), and no requirements are ambiguous enough to need `AskUserQuestion`. The analysis below is the iteration-001 output; I've also persisted it to the plan file.

---

## Decision-Ladder Transplant — sk-code ← ponytail (seat opus-1)

**Q1 — Where the gate sits.** sk-code's lifecycle is Phase 0 Research (optional) → 1 Implementation → 1.5 Quality → 2 Debugging → 3 Verification (`SKILL.md` §1 lines 37-45; `phase_detection.md` §2 lines 45-52). Ponytail's ladder is explicitly pre-write — "Before writing any code, stop at the first rung that holds" (`AGENTS.md:5`, ponytail `SKILL.md:30`). The precise attach point is the **0→1 transition** (`phase_detection.md` §6 line 96: "0 -> 1: enough context and plan exists"), augmented to "…and the laziest viable rung has been selected." **Not** a new Phase 0.5 — a transition guard avoids renumbering the Iron-Law table. Gate it to fire only when intent includes IMPLEMENTATION.

**Q2 — Surface interaction.** Surface detection is STEP 0 / primary key (`SKILL.md` §2; `smart_routing.md` §1 "surface-first, intent-second"). The ladder runs **after** surface+intent, because its rungs are surface-flavored (rung 3 native = CSS-over-JS / `<input type=date>` for WEBFLOW — ponytail's own examples at `SKILL.md:34`; rungs 2/4 stdlib + installed-dep = Node/Python + `package.json` for OPENCODE). It **consumes** the surface result, never competing with OPENCODE>WEBFLOW>UNKNOWN precedence. No conflict.

**Q3 — Artifact (minimal).** A ~15-line "Design Restraint Ladder" subsection appended to `references/universal/code_quality_standards.md` — already always-loaded via `DEFAULT_RESOURCE` (`smart_routing.md` §11 lines 311-316) — plus a one-line precondition in `phase_detection.md` §6 and one Phase Overview row. **Not** a new file/`RESOURCE_MAP` key: that trips the router-sync drift guard (`sk-code-router-sync.vitest.ts`, §11 lines 300/335-458) for 15 lines — itself a ladder violation.

**Q4 — Already present? (honest).** The *principle* exists in three reactive/post-write places: CLAUDE.md "ANTI-PATTERNS" table, CLAUDE.md "ANALYSIS LENSES" (CLARITY/SCOPE), and the `sk-code-review` baseline. **None** is an ordered, stop-at-first-rung, *pre-write* search procedure. Not redundant — but reference the CLAUDE.md table, don't restate it. The value is ordering + upfront timing + placement inside sk-code's flow.

**Q5 — Integration risk.** Iron Law is a post-condition → orthogonal, complementary. Two real tensions: (a) ponytail's "a reflex, not a research project" must be reframed as a *post-read* reflex or it collides with the READ-FIRST Four Law (rungs 2/4 in fact require reading what exists); (b) "challenge the requirement / YAGNI skip" must route through the SCOPE-LOCK amendment/escalation protocol, never silent scope-cutting.

```json
{
  "seat": "opus-1",
  "lens": "decision-ladder-transplant",
  "findings": [
    {
      "id": "F1",
      "title": "Attach ladder at the 0->1 transition, not a new Phase 0.5",
      "ponytail_source": "external/ponytail-main/AGENTS.md (L5) + skills/ponytail/SKILL.md (L30)",
      "target": "sk-code:references/phase_detection.md#6-transitions (0->1) + SKILL.md#1-phase-overview",
      "mechanism": "Ponytail runs the 6-rung ladder BEFORE any code is written ('stop at the first rung that holds').",
      "recommendation": "Augment '0 -> 1: enough context and plan exists' to '...and the laziest viable rung has been selected', plus one Phase Overview row. Gate to intent=IMPLEMENTATION. No new Phase 0.5 number (avoids renumbering the Iron-Law table).",
      "value": "high",
      "effort": "S",
      "integration_risk": "Phase 0 is optional but the ladder must be unconditional-yet-cheap; encode as a transition guard, not a mandatory research phase.",
      "redundant_with": "none",
      "confidence": "high"
    },
    {
      "id": "F2",
      "title": "Ladder consumes surface result; runs after surface+intent routing",
      "ponytail_source": "external/ponytail-main/skills/ponytail/SKILL.md (L33-37 rungs 2-4)",
      "target": "sk-code:SKILL.md#2-smart-routing + references/smart_routing.md#1 (surface-first, intent-second)",
      "mechanism": "Ponytail's rungs are platform-flavored (native = CSS-over-JS / <input type=date>; stdlib/installed-dep = Node/Python).",
      "recommendation": "Run the ladder AFTER STEP 0 surface detection + intent scoring so rung vocabulary is surface-correct. It consumes, never overrides, OPENCODE>WEBFLOW>UNKNOWN precedence. Gate by intent=IMPLEMENTATION.",
      "value": "medium",
      "effort": "S",
      "integration_risk": "No precedence conflict; risk only if placed before surface detection (would pick wrong rung vocabulary).",
      "redundant_with": "none",
      "confidence": "high"
    },
    {
      "id": "F3",
      "title": "Minimal artifact = subsection in an existing always-tier universal doc, not a new file",
      "ponytail_source": "external/ponytail-main/skills/ponytail/SKILL.md (L28-50, ladder + rules)",
      "target": "sk-code:references/universal/code_quality_standards.md (in DEFAULT_RESOURCE, smart_routing.md#11 L311-316)",
      "mechanism": "The ladder + core rules are ~25 lines of prose; ponytail itself is ~90 lines.",
      "recommendation": "Append a ~15-line 'Design Restraint Ladder' subsection to references/universal/code_quality_standards.md (loaded on EVERY route). Do NOT add a new references file or RESOURCE_MAP key.",
      "value": "high",
      "effort": "S",
      "integration_risk": "A new routable doc trips the router-sync drift guard (sk-code-router-sync.vitest.ts, smart_routing.md#11 L300/335-458), forcing RESOURCE_MAP + test churn for ~15 lines — itself a ladder violation (rung 4/6).",
      "redundant_with": "none",
      "confidence": "high"
    },
    {
      "id": "F4",
      "title": "Repo has the principle but lacks the ordered pre-write search procedure",
      "ponytail_source": "external/ponytail-main/skills/ponytail/SKILL.md (L28-40 ordered ladder)",
      "target": "sk-code:references/universal/code_quality_standards.md (reference CLAUDE.md, do not duplicate)",
      "mechanism": "Ponytail's contribution is a RANKED stop-at-first-rung build-order, applied upfront.",
      "recommendation": "Add only the ordered pre-write search order (stdlib->native->installed-dep->one-liner->custom) and cross-reference the CLAUDE.md anti-pattern table instead of restating it.",
      "value": "high",
      "effort": "S",
      "integration_risk": "If restated verbatim it duplicates CLAUDE.md's detector and creates two drifting sources of truth.",
      "redundant_with": "CLAUDE.md 'ANTI-PATTERNS' table + 'ANALYSIS LENSES' (CLARITY/SCOPE) + sk-code-review baseline — all reactive/post-write, none an ordered pre-write procedure",
      "confidence": "high"
    },
    {
      "id": "F5",
      "title": "Upfront 'don't write code' gate is compatible with Iron Law and READ-FIRST if reframed",
      "ponytail_source": "external/ponytail-main/skills/ponytail/SKILL.md (L39 'reflex not a research project', L48 challenge-the-requirement)",
      "target": "sk-code:SKILL.md#4-rules (Four Laws / Escalation Discipline L254-259) + #1-iron-law",
      "mechanism": "Ponytail short-circuits work pre-write and may challenge the requirement (YAGNI skip).",
      "recommendation": "Frame the ladder as running AFTER read-first (rungs 2/4 require reading existing code/deps, so it reinforces research-first). Route 'challenge the requirement / YAGNI skip' through the escalation + amendment protocol as a surfaced recommendation, never silent scope-cutting.",
      "value": "high",
      "effort": "M",
      "integration_risk": "Iron Law is post-condition (orthogonal). Real risks: (a) importing 'not a research project' literally collides with READ-FIRST Four Law; (b) YAGNI-skip must not violate SCOPE-LOCK / amendment protocol.",
      "redundant_with": "none",
      "confidence": "high"
    },
    {
      "id": "F6",
      "title": "Adopt the simplification-comment CONTENT, drop the ponytail: brand prefix",
      "ponytail_source": "external/ponytail-main/skills/ponytail/SKILL.md (L50 ponytail: comment convention)",
      "target": "sk-code:SKILL.md#3 OPENCODE workflow (Phase 1.5 comment hygiene, L216) + check-comment-hygiene.sh",
      "mechanism": "Ponytail marks deliberate simplifications with a comment naming the ceiling + upgrade path.",
      "recommendation": "Encourage 'name the known ceiling + upgrade path' comments (a durable WHY the hygiene rule already preserves) WITHOUT the literal 'ponytail:' brand prefix, which reads as a perishable/cargo-cult label.",
      "value": "medium",
      "effort": "S",
      "integration_risk": "The brand prefix sits near the comment-hygiene 'no perishable labels' line; keep content, drop brand.",
      "redundant_with": "partial — comment-hygiene already mandates durable WHY; this adds the ceiling+upgrade-path shape",
      "confidence": "medium"
    }
  ],
  "newInfoRatio": 0.7,
  "negative_knowledge": [
    "Do NOT import ponytail's intensity-mode state machine (lite/full/ultra + 'persists until session end') — the least-lazy part of ponytail and over-engineering for a per-task skill gate.",
    "Do NOT import 'a reflex, not a research project' literally — it collides with sk-code's READ-FIRST Four Law; reframe as a post-read reflex.",
    "Do NOT create a new references/ file or RESOURCE_MAP entry for the ladder — it trips the router-sync drift guard for ~15 lines, violating ponytail rungs 4 and 6.",
    "Do NOT restate the CLAUDE.md anti-pattern table — only the ordered pre-write search order is genuinely new; reference, don't duplicate.",
    "Do NOT let 'challenge the requirement / YAGNI skip it' become silent scope-cutting — route it through the SCOPE-LOCK amendment / escalation protocol.",
    "Do NOT adopt the literal 'ponytail:' comment brand prefix — keep the ceiling+upgrade-path content, drop the brand label."
  ]
}
```
