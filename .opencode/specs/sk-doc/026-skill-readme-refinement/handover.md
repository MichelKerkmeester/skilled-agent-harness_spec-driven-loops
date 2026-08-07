# Handover — mcp-obsidian README refinement and the repo-wide skill README program

> Phase-parent packet: `.opencode/specs/sk-doc/026-skill-readme-refinement`. This handover records the original ask, the writing-style directives, exactly what was changed and how, the validation evidence, and the roadmap the phases in this packet execute.

---

## 1. THE ASK (as given)

The user asked, in order:

1. **Rewrite the mcp-obsidian README** (`.opencode/skills/mcp-tooling/mcp-obsidian/README.md`) **"more like root repo README, more descriptive"** — i.e. adopt the narrative, problem-first voice of the repository root `README.md`, and make the document richer than the existing tabular reference-card style.
2. **Correct the reason-for-being.** The stated purpose was wrong: the skill does NOT exist to "route between two CLI profiles". It exists *solely to enable effective AI use inside Obsidian*, with proper plugin knowledge capabilities (the mode knows the data formats behind community plugins and operates them at the file layer).
3. **Check SKILL.md for refinements needed** — the same purpose framing lived in the SKILL.md frontmatter `description` and the H1 intro; both needed the correction.
4. **Adhere to sk-doc** — follow the sk-create-skill README template and the Human Voice Rules, and pass the sk-doc README validator.

Follow-up direction (this packet): every skill README in the repo must be revisited on the same standard, including child (mode) skills — but only after the shared README template is refined, a parent-skill README template exists, and the creation workflow documents both.

---

## 2. WRITING-STYLE DIRECTIVES (distilled from the root README + sk-doc template + HVR)

| Directive | Detail |
|---|---|
| Purpose-first identity | The skill's identity is the outcome it delivers (effective AI inside Obsidian with plugin knowledge), not the tools it routes between. The surfaces are the means. |
| Problem-first OVERVIEW | "Why This Skill Exists" opens with the reader's situation and what goes wrong without the skill, before any feature list. |
| One-line pitch | H1 is followed by a blockquote pitch stating the outcome in plain words a person would say out loud. |
| Narrative prose | Prose carries the explanation. Tables appear only for genuine 4-plus-item lookups. Analogies are used where they clarify, never as decoration. |
| Template structure | Numbered ALL-CAPS H2 sections with `---` dividers; AT A GLANCE first (four rows, one line each); QUICK START with expected outputs; HOW IT WORKS; INTEGRATION & NAVIGATION; TROUBLESHOOTING; FAQ; VERIFICATION; RELATED DOCUMENTS. OVERVIEW is the only required section. |
| Human Voice Rules | No em dashes, no semicolons, no Oxford commas, no banned words, no forced three-item groups, active voice, "you" address, one idea per sentence. |
| Honest boundaries | State what the skill does not own and which sibling skill owns it. |
| Current state only | No spec-packet history in READMEs; document current behavior with stable paths. |

---

## 3. WHAT WAS CHANGED (mcp-obsidian, delivered in phases 018/020)

| Artifact | Change |
|---|---|
| `README.md` | Full rewrite, 13.4 KB, version 1.0.0.0 → 1.1.0.0. New pitch blockquote ("Obsidian is your knowledge base. This skill makes it an AI workspace too..."), AT A GLANCE, problem-first OVERVIEW with corrected purpose, dedicated **Plugin Knowledge Layer** section (Beancount Ledger, Obsidian Tables, BRAT, Health.md, Iconic), QUICK START, HOW IT WORKS (router, file-layer doctrine, safety invariants), INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ (incl. "What does the skill know about my plugins?"), VERIFICATION, RELATED DOCUMENTS (now also linking the feature catalog and the manual testing playbook). |
| `SKILL.md` | Frontmatter `description` reframed from "Routes Obsidian between two CLI profiles..." to "Makes AI use inside Obsidian effective: ... plus deep plugin knowledge (Beancount, Tables, BRAT, Health.md, Iconic) operated at the file layer." H1 intro carries the same corrected message. Version 1.3.1.1 → 1.4.1.0. Routing engine, rules, references, and resource maps untouched. |
| `changelog/v1.4.1.0.md` | New messaging-release entry (NEW / CHANGED / NOT CHANGED sections). |
| Phase 020 docs | `.opencode/specs/mcp-tooling/013-mcp-obsidian/020-readme-and-message-refinement/` — spec, plan, tasks, checklist (all with evidence), implementation summary, description.json, graph-metadata.json. |

### Facts preserved (nothing dropped)

All three surfaces (`notesmd-cli`, official `obsidian` CLI, cyanheads MCP), the four quick-start steps, the MCP config JSON, the six safety invariants, all seven troubleshooting rows, all verification checks, and every FAQ answer. Verified by section-by-section diff before the rewrite landed.

---

## 4. HOW IT WAS DONE (the method to repeat in this packet)

1. **Read the sources first**: repo root `README.md` (voice), `sk-doc/sk-create-skill/assets/skill/skill-readme-template.md` (structure), `sk-doc/shared/references/hvr-rules.md` (voice rules), and the current README + SKILL.md (facts + purpose statements).
2. **Inventory before writing**: every factual claim in the old README was listed; purpose-framing statements were located (SKILL.md description + H1 intro; README "Why This Skill Exists").
3. **Rewrite**: purpose-first narrative README per the template; surgical SKILL.md frontmatter + intro edit in the same pass so both documents tell one story.
4. **Version + changelog**: README 1.1.0.0, SKILL.md 1.4.1.0, changelog entry per house style.
5. **Validate and iterate**: `validate_document.py --type readme` and `--type skill` (0 issues each); HVR grep caught 30 Oxford-comma violations which were fixed scripted; link probes (0 broken); leaf manifest `--check`; phase `validate.sh` errors 0; `git diff --check` clean.

---

## 5. VALIDATION EVIDENCE (mcp-obsidian)

| Check | Result |
|---|---|
| `validate_document.py --type readme` | VALID, 0 issues |
| `validate_document.py --type skill` | VALID, 0 issues |
| HVR grep (em dashes, semicolons, Oxford commas) | 0 in prose (2 TypeScript code-fence lines exempt); 30 Oxford-comma fixes applied |
| README local links + link guard | 0 broken mcp-obsidian links |
| Leaf manifest | fresh (`c45d3c36…`) |
| Phase validate.sh | Errors 0 (1 advisory COMPLEXITY_MATCH, same as sibling phases) |
| `git diff --check` | clean |

---

## 6. ROADMAP FOR THIS PACKET (what the phases execute)

| Phase | Mandate |
|---|---|
| `001-readme-template-refinement` | Refine `sk-create-skill/assets/skill/skill-readme-template.md` with the mcp-obsidian learnings: purpose-first identity, capability sections, HVR enforcement, versioning, stricter validation checklist. |
| `002-parent-skill-readme-template` | Create `sk-create-skill/assets/parent-skill/parent-skill-readme-template.md`: hub-level README template (nested modes/packets, mode-registry, leaf manifest, changelog navigation, per-mode pointers). |
| `003-creation-workflow-update` | Update `sk-create-skill/references/skill/creation-workflow.md` to wire both templates into the create-skill workflow (standalone + parent-hub paths). |
| `004-standalone-readme-revisit` | Revisit every standalone skill README in the repo against the refined template (system-spec-kit, system-skill-advisor, system-deep-loop, sk-code, sk-doc, sk-git, sk-prompt, sk-design, cli-external-orchestration, mcp-tooling hub, and any other standalone roots). |
| `005-mode-child-readme-revisit` | Revisit every child (mode) skill README against the refined template, using mcp-obsidian as the exemplar (mcp-click-up, mcp-refero, mcp-magnific, deep-loop modes, sk-doc child packets with READMEs, etc.). |
| `006-validation-and-closeout` | Fleet-wide validation and closeout: `validate_document.py --type readme` across every README, link guard, HVR grep, per-release changelog entries, phase-doc validation, metadata regen. |
| `007-fix-post-closeout-gates-for-readme-fleet` | Repo-wide gate recovery after closeout: repair historical broken links, add six missing frontmatter versions, align the six CLI mode READMEs. Level 3 phase, delivered 2026-08-05. |

**Ordering constraint**: phases 001–003 are the gate for 004–005. The fleet must not be rewritten against a template that is itself about to change. Phase 006 closes after 004–005.

## 7. HARD RULES FOR THIS PACKET

- Deepseek v4 flash sub-agents scaffold ONLY the phase folders (spec.md, plan.md, tasks.md, checklist.md, jsons). They must NOT author README or template content yet.
- Template and creation-workflow files are writable only in phases 001–003; READMEs only in 004–005; validation only in 006.
- No vault, plugin, or runtime files. Rollback for any phase is `git revert`.
- Completion fingerprints stay un-forged (`completion_pct` 0); the spec-memory daemon is down.

---

## 8. DISPATCH STANDARD (native pi-subagents plugin)

**Status: adopted 2026-08-04.** The hand-rolled `pi -p -nc --append-system-prompt "$(cat .pi/agents/markdown.md)"` child pattern is DEPRECATED. The native plugin was installed all along (`.pi/settings.json` → `packages` includes `npm:pi-subagents`; agent file `.pi/agents/markdown.md` is the project-scope agent).

### Verified facts

- A fresh pi session exposes `subagent`, `subagent_wait`, `subagent_supervisor`, and `intercom` (confirmed via headless tool enumeration).
- The plugin discovers `.pi/agents/markdown.md` as the project `markdown` agent (BINDING/STATUS/DQI contract included).
- `deepseek/deepseek-v4-flash` is in `enabledModels` and is the `defaultModel`; per-task `model:` override is supported.
- Sessions snapshot their toolset at start. A session started before the plugin state changed (e.g. 2026-08-03) lacks the tool; restart pi to pick it up.

### Standard dispatch (replaces the CLI pattern)

```typescript
subagent({
  agent: "markdown",
  model: "deepseek/deepseek-v4-flash",
  task: "<task brief content>",
  context: "fresh",
  async: true
})
// run-to-completion turns:
subagent_wait({ all: true })
```

- Task briefs stay in `/tmp/026-*-task.txt`; pass their content as the `task` field. The agent file is the system prompt, so no `--append-system-prompt` injection.
- Parallel phase scaffolding: `tasks: [...]` with `concurrency`, one task per phase folder, distinct write scopes, no shared output paths.
- Gate suppression: launch the parent process with `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1` exported; plugin children run in the same process tree and inherit env.
- Failure handling: `subagent({ action: "status", id })`, `resume`, `steer`, `interrupt`; no manual relaunch loops.
- One writer per scope. No concurrent writers in the same phase folder.

### Sessions without the tool (bridge)

If the current session predates the plugin state, dispatch a thin fanout session that OWNS the tool and delegates: a headless pi session launched with the env above, tasked with "read the brief file, then `subagent({ agent: "markdown", model: "deepseek/deepseek-v4-flash", task: <brief>, context: "fresh" })`, then `subagent_wait({ all: true })`, then report each child STATUS and the files created; do no file work yourself". This is the plugin-documented delegated-fanout-child pattern and keeps the native machinery in charge of the actual children.

### Per-skill phase structure (2026-08-04)

Phases 004 and 005 are PHASE PARENTS, one child phase per skill, so every skill in the repo owns its own README revisit phase:

- 004-standalone-readme-revisit: 11 children, one per standalone skill root.
- 005-mode-child-readme-revisit: 39 children, one per mode (child) skill.
- Inventory source: `find .opencode/skills -name SKILL.md -not -path '*node_modules*'` = 50 skills total (11 standalone + 39 modes). All 50 have READMEs.
- 013-mcp-obsidian under 005 was VERIFY ONLY. Its conformance scan found two failures, so it received the allowed conditional rewrite and now carries README version 1.6.0.0.

Delivery record: all 50 child phases executed by fresh deepseek-v4-flash markdown agents through native subagent fanout. Waves completed at 11/14/18/7. Every README now has the purpose-first template shape, a version field and a matching changelog entry. Phase 003 wires the standalone and parent-hub templates into the creation workflow. Phase 006 validated 50/50 README files, 602/602 README links and 57/57 packet phase folders with zero errors. Eleven leaf manifests were regenerated. Remaining repository-wide link failures are pre-existing and outside the changed README surfaces. Phase 007 (2026-08-05) then took the remaining repository-wide link and version gaps to zero and aligned the CLI README family; see section 9.


---

## 9. PHASE 007: POST-CLOSEOUT GATE RECOVERY (delivered 2026-08-05)

Level-3 phase `007-fix-post-closeout-gates-for-readme-fleet` under this packet. Scope came from the user after the 006 closeout: the repository-wide link guard still reported historical broken links in unrelated skills, six files still triggered the global frontmatter-version warning, and the CLI orchestration READMEs were not aligned (cli-opencode must mention itself like the others).

### 9.1 Link guard: 96 to 0 broken

- **25 real repairs** across 14 documents in mcp-click-up, sk-code-quality, sk-code-webflow, sk-design-interface and sk-prompt-models. Mostly stale relative depth after reference folders moved (assets/patterns, templates, integrations, animation/performance directory links) plus ClickUp's removed `references/INSTALL-GUIDE.md`, now anchored to the retained root guide with section anchors.
- **11 exact allowlist pairs** in `system-spec-kit/scripts/check-markdown-links.cjs` for copy-time template placeholders whose targets a future consumer creates: benchmark-index templates, behavior-benchmark, conformance-contract, install-guide examples, and the `SOURCE.md` to `source.md` lowercase rename. Entries are exact file-plus-raw-reference pairs, never wildcards.
- **2 fixture path classes excluded** (`/scripts/tests/`, `/scripts/fixtures/`) so deliberately invalid negative-test payloads keep their broken links. Active documentation stays fail-closed.
- Guard self-test `--self-test` passes all cases; final runs report `7391 files, 11242 links, 0 broken` twice deterministically.

### 9.2 Version gate: 6 to 0 missing

Six four-part version fields inserted line-wise with the canonical tool (`frontmatter-version.mjs apply`): deep-alignment conformance-benchmark package index and contract, deep-improvement / deep-research / deep-review stress-test READMEs, system-spec-kit doctor-commands README. Gate now `ok=3233`, zero missing, rerun identical.

### 9.3 CLI README family alignment

- `cli-opencode` README now explicitly positions itself (full project runtime, parallel detached sessions, cross-AI handback) and its Sibling Boundaries table grew from 2 to all 6 modes. Version 1.4.1.0 to 1.4.2.0 with changelog entry.
- `cli-codex` sibling table 3 to 6 modes, version 1.9.1.0. `cli-cursor` sibling table 4 to 6 modes, version 1.2.1.0. Both with changelog entries.
- `cli-claude-code`, `cli-devin`, `cli-pi` already named all six modes and were left untouched. All six README validators exit 0. No SKILL.md or dispatch contract changed.

### 9.4 Phase records and validation

- Full Level-3 record set: spec (REQ-001..REQ-008), plan with AI execution protocol (4/4), tasks T001..T016, checklist CHK-001..CHK-141 (P0 13/13, P1 19/19), decision-record, implementation-summary. All completed items carry substantive evidence.
- `006-validation-and-closeout/spec.md` Successor row updated to 007 (phase-links chain contract).
- Metadata regenerated via the canonical generators for 007 and 006; parent graph backfilled.
- `validate.sh --strict`: 007 Errors 0 Warnings 0 PASSED; parent 026 Errors 0 Warnings 0 PASSED (recursive, 7 phases); `git diff --check` clean.

### 9.5 Anomaly log (important for the next session)

Once during this phase, the 14 repaired link files were reverted on disk by an unidentified process between tool calls (the guard flipped back to 25 broken while the phase validation stayed green). The idempotent replacement pass was re-applied and the final state verified within a single tool snapshot, including a full validate.sh run. If those 25 links ever recur, re-run `scratch/fix-batch1-links.py` in this phase folder (python3, cwd at repo root), then re-run the guard. Root cause not identified; the pattern is documented here for forensics.

### 9.6 Open items

- Formal completion fingerprints stay un-forged (`completion_pct` 0) until the spec-memory daemon is healthy, matching every sibling phase.
- Rollback for the remediation edits is `git restore -- <changed paths>`; the guard policy change is the only code edit and is reviewed as a diff in the decision record.
