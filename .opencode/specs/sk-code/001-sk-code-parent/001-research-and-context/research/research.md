# Phase 001 — Research & Context Synthesis (decision-ready)

**For:** the 002 architecture-decision human-review gate.
**Tracks merged:** Track R (deep-research, GPT-5.5-fast high via cli-opencode, single lineage, 33 file reads, clean `stop`) + Track C (deep-context, two-scout reconnaissance → `../context/context-map.md`).
**Full Track-R output:** `gpt55-taxonomy-recommendation.md` (9.6 KB, R1–R5 with file:line citations).

---

## Headline recommendation

Convert `sk-code` into a **nested parent hub** (pattern already settled — mirror `sk-design`, not deep-loop) with a **5-mode taxonomy of phase/activity lanes over one shared surface router**, and fold `sk-code-review` in as the `code-review` mode.

| mode | folder | owns | tool-surface |
|------|--------|------|--------------|
| implement | `code-implement` | Phase 0 research + Phase 1 implementation; WEBFLOW/OPENCODE authoring; Motion.dev overlay consumption | mutating (Read, Write, Edit, Bash, Grep, Glob, Task) |
| quality | `code-quality` | Phase 1.5 quality gate; P0/P1/P2 author checks; comment hygiene; surface checklists | mostly mutating (Read, Edit, Bash, Grep, Glob) |
| debug | `code-debug` | Phase 2 root-cause debugging; error recovery; escalation discipline | mutating (Read, Edit, Bash, Grep, Glob, Task) |
| verify | `code-verify` | Phase 3 verification; Iron Law evidence; mutation/falsifier ritual | non-mutating (Read, Bash, Grep, Glob) |
| review | `code-review` | Findings-first review; security/correctness baseline; checklists; output contract; PR-state gates | read-only + review cache (Read, Bash, Grep, Glob, limited Write) |

**Key structural decisions** (Track R, cited in the full output):
- **Surface detection lives in hub `shared/`**, consumed by every mode — the current contract is *surface-first, intent-second*, and OPENCODE-over-WEBFLOW precedence is safety-critical and must exist exactly once (`sk-code/references/smart_routing.md:34-37`, `stack_detection.md:36-58`). Modes own *workflow contracts*, not surface identity.
- **`sk-code-review` → clean `code-review`** (`folder == packetSkillName`), with a **legacy `sk-code-review` alias/redirect preserved through cutover** and removed only after explicit `sk-code-review` prompts resolve to hub + `code-review` mode.
- **Exactly one `graph-metadata.json`** at the hub; none in any mode packet or `shared/` (the one hard advisor invariant).

---

## R1–R5 in brief (full detail + citations in `gpt55-taxonomy-recommendation.md`)

- **R1 taxonomy** — Rejected: activity-lanes-only (loses the load-bearing surface axis + omits the distinct Phase-1.5 gate) and surface-lanes-only (surfaces are *resource/evidence families*, not workflow modes; MOTION_DEV is a peer resource, not a surface). Chosen: **hybrid = phase/mode packets over one shared surface router** (not a Cartesian product).
- **R2 two-axis** — Surface axis → `shared/` (`stack_detection`, language sub-detection, precedence, Motion.dev overlay, resource slicing, default preamble). Phase pipeline → the five modes (Phase 0/1 → implement, 1.5 → quality, 2 → debug, 3 → verify; formal review → code-review).
- **R3 fold-in** — `code-review` owns review_core doctrine, review UX, baseline+surface precedence, the exact final-line status contract, and PR-state dedup gates. Clean folder name; compatibility via hub routing/advisor aliasing, not the packet name.
- **R4 migration** — 10 steps, regression-first: **(1) freeze routing-parity fixtures** (WEBFLOW/OPENCODE/UNKNOWN/Motion/quality/verify/explicit-review) → (2) registry+router → (3) thin hub → (4) surface material to `shared/` → (5) create packets implement→quality→debug→verify→review → (6) move sk-code-review content → (7) one hub graph-metadata → (8) repoint consumers with legacy alias → (9) parity-check vs frozen fixtures → (10) remove legacy route only after explicit-review prompts resolve.
- **R5 native invocability** — parent keeps `name: sk-code` + the single graph-metadata; each mode has its own `SKILL.md` (name/description/allowed-tools/version) and a registry entry with `advisorRouting.routingClass: "metadata"`; no mode-level graph-metadata.

---

## Track C cross-reference (blast radius)

Authoritative map: `../context/context-map.md`. The migration touches ~428 live `sk-code` files + ~119 `sk-code-review` files, concentrated in: agents (`code`, `review`, `orchestrate`, `deep-review` [hardcodes `review_core.md`], `ai-council`) across `.opencode`+`.claude`; speckit YAML cross-skill-load blocks; the advisor (delete `sk-code-review/graph-metadata.json` + merge keywords + regenerate `skill-graph.json`); governance docs; and 4 reverse-edge sources (`sk-git`, `sk-design`, `system-skill-advisor`, self). Advisor de-registration is automatic on packet-move + graph-metadata deletion — the advisor directory-scans, it has no flat registry.

---

## Seed-hypothesis verdict

The 001 seed hypothesis (activity lanes with surface routing *inside* `implement`, ~2–3 modes) is **partially confirmed and refined**: surface routing does move to a shared layer (confirmed), but the research argues the phase pipeline is better expressed as **five first-class modes** than folded into `implement`. This is the one substantive delta for the human to weigh (see below).

---

## Recommended architecture decision for the 002 gate

| Decision | Recommendation | Confidence |
|----------|----------------|------------|
| Structure | Nested parent hub (mirror sk-design) | High (settled pattern) |
| **Mode count** | **5 modes** (implement/quality/debug/verify/review) | Medium — see the open decision |
| Surface detection | Hub `shared/` (one precedence source) | High |
| Review fold-in | `sk-code-review` → clean `code-review` + legacy alias | High |
| Advisor | One hub identity; delete review graph-metadata; rebuild | High |
| Migration | Freeze fixtures first; parity-gated cutover; legacy alias until parity passes | High |

**THE open decision for the user:** **5 modes vs a leaner 2–3.** GPT-5.5 argues each phase is a distinct contract deserving its own packet (and sk-design also ships 5 modes, so it's family-consistent). The leaner alternative — `implement` (+ quality/debug/verify as phases inside it) and `review` — is less maintenance surface but keeps the current monolith-ish shape. This is a taste/maintenance call, not a correctness one; 002 binds it.

---

## Limitations

1. **Single-lineage research.** Track R ran one GPT-5.5-fast lineage (the lean default; pattern was already settled). The 5-mode recommendation is one strong, well-cited opinion — not a multi-model consensus. A cross-check lineage (Opus / a second model) is available if the user wants the mode-count decision stress-tested.
2. **Track C advisor-rebuild is `[INFER]`.** The claim that regenerating `skill-graph.json` cleanly drops the `sk-code-review` node after the move was reasoned from the handler, not executed. Verify empirically in 003/007.
3. **Reported dispatch cost = 0** (plan/oauth-billed); ~108k total tokens, 33 file reads.
```
