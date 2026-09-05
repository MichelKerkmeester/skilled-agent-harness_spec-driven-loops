---
title: "Tasks: Luna on both DevPass rosters"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "luna devpass"
  - "llmgateway rosters"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/063-devpass-gpt-5-6-luna"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks complete; ten dispatches recorded"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-063-luna-devpass"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Luna on both DevPass rosters

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture Luna's facts live [evidence: `opencode models llmgateway --verbose` — reasoning true, attachment true, temperature **false**, ladder none/low/medium/high/xhigh/max, context 1,050,000, input cap 922,000, output 128,000, $0.20 in / $1.20 out per 1M]
- [x] T002 Classify it against the DevPass fair-use rule [evidence: $1.20/1M output is far under the $15 Premium line, so Standard — no weekly cap]
- [x] T003 Confirm the wire id before writing config [evidence: `"model":"gpt-5.6-luna"` → 200, content `WIRE-LUNA`, upstream `azure/gpt-5.6-luna`]
- [x] T004 Confirm cli-opencode has no DevPass section to add to [evidence: no `llmgateway` string in its catalog before this change]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the Luna model object with its own ladder (`.pi/models.json`)
- [x] T006 Add the fifth picker entry (`.pi/settings.json`) [evidence: five `llmgateway/` entries; both files `JSON.parse` clean; no trailing newline preserved]
- [x] T007 Create the `### llmgateway` section with five rows, the bare-id inversion, the Standard-tier note and the closed-roster bound (`cli-opencode/references/providers-and-models.md`)
- [x] T008 Add the `llmgateway` row to the `--variant` mapping table, stating effort is per-model here (`cli-opencode/references/providers-and-models.md`)
- [x] T009 [P] Add the Luna row and correct the four→five counts (`cli-pi/references/providers-and-models.md`)
- [x] T010 [P] Add the Luna row, the temperature caveat and the counts (`.pi/custom-providers.md`)
- [x] T011 [P] Name the DevPass routes and the bare-id rule in the provider prose (`cli-opencode/SKILL.md`)
- [x] T012 Reconcile packet 060 so its WS1 is not claimed twice
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Luna on both CLIs [evidence: `LUNA-PI-OK` at `--thinking max`; `LUNA-OC-OK` at `--variant max`]
- [x] T014 The other four through cli-opencode, so its rows are tested not inferred [evidence: `OC-deepseek-v4-flash`, `OC-deepseek-v4-flash-vision-exp`, `OC-glm-5.3-flash` at max; `OC-gemini-3.8-flash` at high]
- [x] T015 pi config integrity [evidence: five models in the block; both files parse; operator formatting intact]
- [x] T016 No secret in any tracked file [evidence: `apiKey` remains the `${LLMGATEWAY_API_KEY}` reference]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Independent Review Remediation

Reviewed by a fresh Gemini 3.8 Flash agent at `high` through the DevPass route, briefed with a frozen scope and told to attack four named claims. Verdict **PASS — 0 P0, 1 P1, 3 P2**; all four substantive claims verified independently, including the one most likely to be a P0.

- [x] T017 Verify each finding against the repo before acting [evidence: all four reproduced — `ox-alpha` appears 9x in `.pi/custom-providers.md` and 0x in either `.pi` config; "these four" survives in two files; the cli-opencode per-route summary omits the DevPass route; `.pi/models.json` carries no `temperature` key]
- [x] T018 **P1** — retire every stale Ox Alpha reference in `.pi/custom-providers.md` [evidence: 9 mentions reduced to 1 deliberate retirement note; the §5 verification command at line 127 would have returned `404 model not found` as written]
- [x] T019 **P1 extra, missed by the review** — `enabledModels` carries only two cline entries, not three: `deepseek-v4-pro` is declared in the provider block but never enabled, so it is dispatchable only by explicit `--model`. Now stated
- [x] T020 **P2** — "these four" → "these five" in both files
- [x] T021 **P2** — the cli-opencode per-route GLM summary now names the DevPass route as carrying both `xhigh` and `max`
- [x] T022 **P2** — the Luna temperature claim now attributes the constraint to the provider catalog rather than implying pi's entry declares it
- [x] T023 Confirm no regression [evidence: both `.pi` files still parse; one `ox-alpha` string remains and it is the retirement note]

### Second review round

A second fresh Gemini 3.8 Flash agent reviewed the remediation itself, on the premise that a drift fix is the change most likely to introduce new drift. It was told to derive ground truth from the two `.pi` JSON files before reading any prose, with config winning every disagreement. Verdict **PASS — 0 P0, 2 P1, 2 P2**. It confirmed the first round held: Ox Alpha clean, counts clean, GLM tier ceilings consistent across all five files, and the `enabledModels` asymmetry accurately stated.

- [x] T024 Verify the four new findings before acting [evidence: all four reproduced; the fourth needed care — a grep for "deepseek" in the cline-pass table returns 2, but one is prose, so the table really does carry a single DeepSeek row]
- [x] T025 **P1** — `.pi/custom-providers.md` instructed a `deepseek-v4-pro` dispatch and claimed the cli-pi roster documents it. It does not, and that roster is closed, so the doc was teaching a forbidden dispatch. Now recorded as a config leftover pending removal, with the contradiction between `pi` accepting it and the skill forbidding it stated outright
- [x] T026 **P1** — three "the only vision entry" claims contradicted Luna and Gemini being documented as image-capable in the same tables. Stale residue from before Luna was added; all three corrected to name the three image-capable entries
- [x] T027 **P2** — Luna's pi ladder was written `none`→`max` in opencode's vocabulary; pi's lowest tier is `off`, and `minimal` is unmapped, so the active range is `low`→`max`
- [x] T028 **P2** — "The DeepSeek entries" was plural over a single-row table
- [x] T029 Confirm no regression [evidence: zero exclusivity claims remain; both `.pi` files parse]

### Provider discoverability

A concurrent session reported that DevPass was not mentioned in cli-pi. The report was accurate and the diagnosis was not: everything was pushed and merged, but `cli-pi/SKILL.md` named **no** providers at all, so a grep for `llmgateway` failed there exactly as a grep for `cline-pass` would have.

- [x] T030 Verify the claim against the pushed trees rather than the local checkout [evidence: `llmgateway` hits identical on HEAD, `origin/main` and `origin/skilled/v4.0.0.0` — cli-pi roster 8, cli-opencode roster 11, `.pi/models.json` 2, `.pi/custom-providers.md` 13; zero unpushed commits]
- [x] T031 Survey which mode SKILL.md files name providers [evidence: cli-opencode named all of them **and their model ids**; cli-pi, cli-codex, cli-cursor and cli-devin named none]
- [x] T032 Add a provider inventory to `cli-pi/SKILL.md` — providers named including DevPass, no model ids, roster file cited as the single source, and the two config-declared providers pointed at their setup doc
- [x] T033 Replace the inline model enumeration in `cli-opencode/SKILL.md` with the same shape [evidence: model ids in that file drop to two, both legitimate — the default model and the V4 Pro name inside the destructive-scope incident record]
- [x] T034 Keep the one cross-provider footgun in `cli-opencode/SKILL.md`: id shape differs per provider, and copying a form between them returns a 400
- [x] T035 Re-mint the hub and prove it still routes [evidence: guard reports all hubs fresh; `cli-opencode` and `cli-pi` prompts both return `route`]
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks `[x]` [evidence: T001-T016]
- [x] No `[B]` blocked tasks
- [x] Every catalog row backed by a dispatch on that CLI, not carried across from the other
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
