---
title: "Tasks: AI-tell fixture corpus and detection benchmark for the design-audit anti-slop layer"
description: "Task breakdown for creating the registry-bound AI-tell fixture corpus, the deterministic detection benchmark, the fixture-existence parity gate, and the route-preserving playbook extension."
trigger_phrases:
  - "ai tell fixture corpus tasks"
  - "design audit fixture benchmark tasks"
  - "ai fingerprint fixture detection tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/004-ai-tell-fixture-corpus"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with evidence after fixture-check and registry-check PASS/BITE"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is per-tell detection runnable now: yes on curated fixtures; catalog exhaustiveness stays advisory"
---
# Tasks: AI-tell fixture corpus and detection benchmark for the design-audit anti-slop layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Fixture corpus, 2-3 hours]

### Corpus scaffold
- [x] T001 Create the fixtures root and one directory per registry `fixture_id` (`design-audit/assets/ai_fingerprint_fixtures/<fixture_id>/`) [20m] — 9 fixture dirs present, one per registry `fixture_id`
- [x] T002 Author a content-first corpus `README.md` mapping fixture → tell → family → clean-vs-tell contract (`ai_fingerprint_fixtures/README.md`) [25m] — corpus README present mapping each fixture to tell, family, and clean-vs-tell contract

### Codex tell fixtures (clean + tell per slug)
- [x] T003 [P] ghost-card-border-plus-shadow: `tell.html` (1px solid border + box-shadow blur ≥16px) and `clean.html` (faithful, no pairing) [20m] — tell.html fires ghost-card, clean.html fires none (fixture-check PASS)
- [x] T004 [P] over-rounded-cards: `tell.html` (card border-radius ≥24px) and `clean.html` (12-16px radius) [20m] — tell.html fires over-rounded-cards, clean.html fires none
- [x] T005 [P] sketchy-svg-illustration: `tell.html` (sketch/doodle class or feTurbulence grain) and `clean.html` (no sketch SVG) [20m] — tell.html fires sketchy-svg-illustration, clean.html fires none
- [x] T006 [P] diagonal-stripe-background: `tell.html` (repeating-linear-gradient as background) and `clean.html` (plain surface) [20m] — tell.html fires diagonal-stripe-background, clean.html fires none
- [x] T007 [P] element-tracking-on-display-type: `tell.html` (letter-spacing tighter than -0.04em on a display heading) and `clean.html` (-0.02em) [20m] — tell.html fires element-tracking-on-display-type, clean.html fires none

### Gemini tell fixtures
- [x] T008 [P] image-hover-animation: `tell.html` (:hover transform on img / parent-hover animating a child image) and `clean.html` (hover feedback on the card, not the image) [20m] — tell.html fires image-hover-animation, clean.html fires none

### 2026-general tell fixtures
- [x] T009 [P] cream-or-sand-body-background: `tell.html` (warm-paper token or warm-neutral body bg) and `clean.html` (neutral non-warm bg) [20m] — tell.html fires cream-or-sand-body-background, clean.html fires none
- [x] T010 [P] eyebrow-above-every-section: `tell.html` (small uppercase tracked label above ≥3 headings) and `clean.html` (≤1 deliberate kicker) [20m] — tell.html fires eyebrow-above-every-section, clean.html fires none
- [x] T011 [P] uniform-section-fade-and-rise: `tell.html` (same scroll reveal on most/all sections) and `clean.html` (content-fit motion) [20m] — tell.html fires uniform-section-fade-and-rise, clean.html fires none

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Detection benchmark + parity gate, 3-4 hours]

### Detection runner
- [x] T012 Create the runner shell loading the registry and the fixtures root (`shared/scripts/ai-fingerprint-fixture-check.mjs`) [30m] — runner loads the registry + fixtures root; `node --check` clean
- [x] T013 Implement one deterministic matcher per registry tell ID, derived from each row's `deterministic_check` (`ai-fingerprint-fixture-check.mjs`) [1.5h] — 9 precise content matchers, one per tell ID (`registryRows=9`)
- [x] T014 Assert each positive fires exactly its own tell ID and each clean fires none; fail closed on miss, off-family false positive, or missing fixture [45m] — PASS exit 0 (`samples=18`); mutated tell.html bites exit 1 naming the fixture (cream-or-sand, ghost-card)
- [x] T015 [P] Emit a machine-readable (`--json`) and a human summary mirroring the parity checker's output contract [20m] — human `PASS ai-fingerprint-fixture-check: registryRows=9 samples=18` summary mirrors the registry checker contract

### Parity existence gate
- [x] T016 Extend `ai-fingerprint-registry-check.mjs` to assert per-row fixture directory + `clean.html` + `tell.html` existence, keeping the current presence/format checks (`shared/scripts/ai-fingerprint-registry-check.mjs`) [30m] — existence assertion added; PASS exit 0 with all 9 dirs; `node --check` clean
- [x] T017 Confirm the existence gate bites (exit non-zero) when a registry `fixture_id` has no fixture files [15m] — hidden/missing fixture dir → exit 1 (orchestrator-confirmed)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [Playbook extension + verification, 1-1.5 hours]

### Playbook scenario
- [x] T018 Extend the scenario with the fixture-backed shape: clean pass + Codex/Gemini positives + clean negatives (`03--slop-hardening/ai-fingerprint-tells.md`) [20m] — additive "Fixture-Backed Check" section names the corpus and the clean-then-positive shape (AUDIT-SLOP-002)
- [x] T019 Add an expected-counts table (codex 5 / gemini 1 / general 3 positives fire exactly one tell; all cleans fire 0) [15m] — counts table present: Codex 5, Gemini 1, 2026-general 3, Clean samples 9 fire none
- [x] T020 Preserve the existing `Exact prompt`, `Prompt`, `expected_intent`, and `expected_resources` so the route is unchanged [10m] — prompt and route metadata unchanged; hubRoute holds (23/5/0)

### Verification
- [x] T021 Capture the hubRoute scorer baseline over the full sk-design corpus BEFORE the playbook edit [10m] — baseline 23 pass / 5 known-gap / 0 regression captured pre-edit
- [x] T022 Re-run the hubRoute scorer AFTER the edit and confirm zero regression to the passing routes [10m] — post-edit 23/5/0, delta 0; scenario route-stable, fixtures off-corpus
- [x] T023 Run the detection benchmark green over the full corpus (9 positives correct, 0 off-family false positives) [10m] — PASS exit 0, `registryRows=9 samples=18`, 0 off-family fires
- [x] T024 Run the parity checker green with fixtures present; confirm a removed fixture and a corrupted `tell.html` both bite [10m] — registry-check PASS exit 0 (`catalogTells=9 registryRows=9`); removed fixture → exit 1; corrupted tell.html → fixture-check exit 1
- [x] T025 Grep fixtures and runner code for spec/packet/dimension IDs and paths to confirm evergreen [10m] — no spec/packet/dimension IDs or spec paths in fixtures or runners; stable slugs + skill-relative paths

### Documentation
- [x] T026 Author `implementation-summary.md` with validation evidence and the no-regression delta [20m] — implementation-summary.md authored with PASS/BITE evidence and the hubRoute 23/5/0 delta
- [x] T027 Mark all checklist items with evidence [15m] — checklist.md fully marked with evidence; counts recomputed

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Detection benchmark passes (positives fire their tell, cleans fire none, zero off-family false positives)
- [x] Parity checker passes with fixtures present and bites when one is missing
- [x] hubRoute scorer holds its baseline with zero regression
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->
