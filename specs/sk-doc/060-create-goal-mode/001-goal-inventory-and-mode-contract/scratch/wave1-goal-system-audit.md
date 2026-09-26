## 1. Anatomy

- The template has YAML frontmatter, a title, and a **Durable Directive** with an objective, decisions, and operator-copy instructions. A goal rendered for `level:phase` also gets a **Binding** section; all goals have **Completion Criteria** and a **Log**. The objective guidance is one sentence about purpose, not method or progress. (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:2-37,46-70,75-105,110-128`)
- The **durable slice** is the body after frontmatter and before the log anchor. The **chat slice** removes comments, anchor markers, dividers, and numbered headings. A third projection, the **objective slice**, contains a packet pointer, a binding sentence for nested packets, and copied criteria. (`.skilled/hooks/goal/lib/goal-slice.cjs:52-79,87-118`)
- A phase parent carries decisions, binding and packet-wide criteria; each child carries its own phase objective and criteria. The parent’s decisions outrank child detail, and a child’s criteria bind as if written in the parent. (`goal.md.tmpl:75-94`; `.skilled/commands/speckit/assets/speckit-plan.yaml:183-187`)
- The validator measures the durable slice and errors above 4,000 characters for phase parents and top-level packets; phase children are unbounded. The code uses `length > errorChars`, with the budget set to 4,000. (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1044-1056`; `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json:24-28`)
- The goal-specific validator checks that binding rows it finds resolve inside the packet; if the binding anchor is absent, it returns. It does not check that every phase is listed or enforce objective quality or the template’s three-to-seven criteria guidance. (`spec-doc-structure.ts:1050-1080`; `goal.md.tmpl:99-105`)
- These file limits are distinct from runtime text caps: raw objectives and generated goal prompts default to 4,000 characters, and injection blocks to 4,800. (`.skilled/hooks/goal/lib/goal-core.cjs:59-61,1321-1328`)

## 2. Tooling

| Tool | What it does | What it does not do |
|---|---|---|
| `create.sh --with-goal` | Adds `goal.md` to standard and subfolder scaffolds through the selected document contract. (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:153-155,444-464,977-989,1714-1727`) | It copies a template; it does not author the objective, decisions, or criteria. The help says phase parents are supported, but the fresh `--phase` path writes the parent’s lean `spec.md` and calls `scaffold_contract_docs` for children. No parent `goal.md` is added on that path. (`create.sh:283-284,1275-1335,1492-1504,1657-1665`) |
| `copy_template` and the inline renderer | `copy_template` selects the template and invokes the renderer. The renderer filters level-gated sections, then writes to `--out-dir` or prints to stdout. (`.skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:67-106,212-250`; `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:184-241,274-302`) | They do not fill the goal placeholders or derive content from a spec. |
| `goal-slice.cjs` | Reads a packet goal, measures its durable slice, checks the manifest budget, and produces the durable, chat, and objective slices plus a hash. (`.skilled/hooks/goal/lib/goal-slice.cjs:59-79,268-299,384-428`) | It does not author or bind a goal. |
| `goal.cjs` and `goal-core.cjs` | `bind` records a packet pointer and derived objective in session state; `set` stores free text as a session objective; `packet` prints the measured size, budget, hash, objective slice, and chat slice. (`.skilled/hooks/goal/bin/goal.cjs:153-173,203-216,233-246`; `goal-core.cjs:1093-1128,1321-1367`) `resent` records the current slice hash; `log` and `packet-log` append progress rows. `show`, `unbind`, `clear`, `complete`, `pause`, `resume`, `history`, `doctor`, `health`, and `legacy-*` manage or inspect runtime state. (`goal.cjs:175-231,248-379,407-425`) | There is no CLI action that authors `goal.md`. The core’s packet-file write is a log append, guarded so it cannot alter the durable slice. (`goal-core.cjs:1216-1272`) |
| Validator | `validateGoalDocument` enforces the durable budget and checks paths in listed binding rows. (`spec-doc-structure.ts:1050-1080`) | It does not assess semantic quality or binding-table completeness. |

## 3. Runtime delivery

| Runtime | Delivery and limits |
|---|---|
| OpenCode | Native plugin injects the bound goal and provides `/goal-opencode` management, verification, and guarded continuation. (`.skilled/hooks/goal/README.md:75-84`; `.skilled/hooks/goal/goal-plugin.md:151-170`) |
| Pi | `input` injects, `session_start` restores, and `turn_end` performs observe-only heuristic verification; `/goal-pi` uses the shared CLI with native session identity. (`README.md:75-77,114-117`) |
| Cursor | `sessionStart` injects. `/goal-cursor` supports a packet read only; the adapter has no mid-session refresh or verification surface. (`README.md:78,84`; `goal-plugin.md:157,167`) |
| Devin | `SessionStart` and `UserPromptSubmit` inject context; the repository documents no management command surface. (`README.md:79,84`; `goal-plugin.md:158`) |
| Claude Code | Uses the host’s native goal command; Speckit workflows render the stripped parent slice for the operator to set. (`README.md:81-82`; `.skilled/commands/speckit/assets/speckit-plan.yaml:188-194`) |
| Codex | Same documented handoff as Claude Code, through its native host goal command. Live host behavior is not verified by the repository files. (`README.md:82`; `goal-plugin.md:159-160`) |

For managed runtimes, the objective slice stored at bind time differs from the chat slice printed for a resend. The working agent owns resending when the parent’s durable content changes; a child change that affects parent decisions or criteria must be applied to the parent first. Log edits do not trigger a resend. (`goal-slice.cjs:96-118`; `goal-set-string-playbook.md:75-99`; `speckit-plan.yaml:195-200`)

## 4. Authoring today

Today’s path scaffolds a placeholder; a human or working agent supplies the goal content. The playbook says the file is not written unasked and distinguishes the packet document from the runtime’s session objective. (`goal.md.tmpl:49,57-70,103-105`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:103-123`)

I sampled three phase-parent goals and child goals. Using the runtime’s slice boundary, read-only measurements found durable lengths of **5,758** characters for `specs/sk-git/028-crawlable-commit-history/goal.md`, **5,513** for `specs/sk-design/019-sk-design-diagram-upgrade/goal.md`, and **2,443** for `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md`. (`goal-slice.cjs:59-63`; sample files: `specs/sk-git/028-crawlable-commit-history/goal.md:44,81-90,118-120`; `specs/sk-design/019-sk-design-diagram-upgrade/goal.md:40,78-90,120-123`; `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:43,65-70,94-98`)

Concrete quality variance:

- Some real child goals retain the template objective placeholder, including `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md:43`.
- One criterion says “Every phase reports its acceptance criteria closeable,” which requires inspecting other files despite the template’s self-contained checkability rule. (`specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:84-90`; `goal.md.tmpl:99-105`)
- A parent criterion says “all six children,” while that parent’s binding table lists phases 001–008. (`specs/sk-git/028-crawlable-commit-history/goal.md:83-90,111`)
- A binding-coverage gap appears in `017-memory-database-decommission`: its goal table ends at phase 006, while the parent spec map includes phase 007. The filesystem search found no phase-007 `goal.md` there. (`specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:66-73`; `specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:164`)
- The three child objectives I inspected describe distinct phase work—research, a format decision, and template/manifest work—rather than merely reporting progress. (`specs/sk-git/028-crawlable-commit-history/001-research/goal.md:43`; `002-format-decision/goal.md:43`; `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/001-manifest-and-goal-template/goal.md:43`)

## 5. Ownership boundary

System-spec-kit owns the template, level rendering, file-budget and listed-row validation, and the set-string guidance. The prior `010-goal-file-addon` packet split that work across template, validator, runtime dispatch, and playbook phases. (`specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/spec.md:113-132`) The `040-goal-parent-single-limit` packet settled the single 4,000-character limit. (`specs/system-speckit/040-goal-parent-single-limit/spec.md:36-53,84-95`)

The hooks own runtime state, binding, projections, injection, and resend reminders. The earlier cross-runtime and isolation packets document the move from runtime adapters to explicit session-scoped goal ownership. (`specs/hooks/003-goal-hooks-cross-runtime/spec.md:58-72`; `specs/hooks/009-goal-isolation/spec.md:48-54,75-101`; `.skilled/hooks/goal/README.md:24-34,65-67,114-122`)

No current owner or automatic gate writes good objectives, derives child goals from phase specs, verifies that every child appears in a binding table, or cuts an over-budget parent. The playbook gives a manual cutting order, and the slice module does render the chat slice; the operator/agent still has to use that output in the host session. (`goal-set-string-playbook.md:61-71,75-99`; `spec-doc-structure.ts:1050-1080`)

The `sk-doc` hub lists fourteen workflow modes and routes new workflows through a registry and packet, but its mode list contains no `sk-create-goal`. My scoped search found only benchmark uses of “goal,” not packet-goal authoring guidance. (`.skilled/skills/sk-doc/SKILL.md:15,25-39,78,172`; `.skilled/skills/sk-doc/sk-create-benchmark/manual-testing-playbook/evidence-and-boundaries/prepare-lane-a-inputs.md:43`)

## 6. Proposed phase split

1. **`contract-and-boundary`** — Define what `sk-create-goal` authors and where its responsibility ends. *Deliverables:* mode contract, input/output boundary, ownership map. *Done check:* routing distinguishes document authoring from runtime binding. (`.skilled/skills/sk-doc/SKILL.md:52,67,172`; `goal-set-string-playbook.md:117-123`)
2. **`authoring-quality-rules`** — Establish checks for purpose-led objectives and independently checkable criteria. *Deliverables:* concise rubric and good/bad examples, including placeholder and stale-criterion cases. *Done check:* fixtures flag those failures and accept phase-specific examples. (`goal.md.tmpl:49,99-105`; `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md:43`; `specs/sk-git/028-crawlable-commit-history/goal.md:111`)
3. **`phase-source-and-binding-map`** — Derive parent and child coverage from the packet’s phase map and child sources. *Deliverables:* source-to-goal map and explicit binding coverage. *Done check:* every phase has a corresponding child goal or a reported exception. (`specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md:66-73`; `spec.md:164`; `spec-doc-structure.ts:1064-1080`)
4. **`parent-and-child-authoring`** — Produce goals with the correct parent/child structure. *Deliverables:* parent directive and binding table, phase-scoped child objectives and criteria. *Done check:* rendered fixtures include binding only at phase-parent level and retain precedence wording. (`goal.md.tmpl:75-94`; `specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md:65-77`)
5. **`budget-and-slice-preflight`** — Keep parent goals within the file budget and expose the right runtime projections. *Deliverables:* size check, chat-slice preview, objective-slice preview. *Done check:* parent fixtures at 4,000 pass, over-budget fixtures fail, and criteria remain in the projections. (`spec-doc-structure.ts:1050-1061`; `goal-slice.cjs:59-79,96-118`)
6. **`validation-and-review`** — Close semantic and structural gaps left by the current validator. *Deliverables:* checks for binding completeness and criterion quality, plus review guidance. *Done check:* negative controls catch omitted phases and uncheckable criteria. (`spec-doc-structure.ts:1064-1080`; `goal.md.tmpl:99-105`)
7. **`runtime-handoff`** — Reuse current packet-print and resend rules without making the mode a runtime controller. *Deliverables:* runtime handoff notes and a parent resend checklist. *Done check:* instructions match the supported runtime matrix and keep chat slice distinct from the bind objective. (`.skilled/commands/speckit/assets/speckit-plan.yaml:188-200`; `.skilled/hooks/goal/README.md:75-84`)
8. **`sk-doc-registration-and-verification`** — Integrate the workflow through the hub’s existing routing structure. *Deliverables:* packet, registry/router entries, examples, and route checks. *Done check:* representative goal-authoring prompts resolve to the new mode and its checks pass. (`.skilled/skills/sk-doc/SKILL.md:52,67,77-82,172`)

## 7. Gaps & Unknowns

- The fresh phase scaffold discrepancy is visible in source: help and playbook claim phase-parent support, but the phase path creates a lean parent spec and scaffolds goals only in child folders. (`create.sh:283-284,1275-1335,1492-1504`; `goal-set-string-playbook.md:105-115`)
- The validator’s goal-specific function cannot detect missing binding rows; the phase-007 sample shows why that matters. Whether other corpus goals have the same omission was not exhaustively checked. (`spec-doc-structure.ts:1064-1080`; `017-memory-database-decommission/goal.md:66-73`; `017-memory-database-decommission/spec.md:164`)
- Claude Code and Codex behavior is documented as native-host delivery, but live host behavior cannot be confirmed from these repository files. (`.skilled/hooks/goal/README.md:81-84`; `.skilled/hooks/goal/goal-plugin.md:159-160`)
- This was a read-only source audit; no validator or live-runtime verification was run.

## 8. Citation self-check

- Re-opened `goal.md.tmpl:46-105`: confirmed the objective/decisions/operator-copy structure, phase binding block, and three-to-seven criteria guidance.
- Re-opened `spec-doc-structure.ts:1050-1080`: confirmed the budget gate and validation of listed binding rows.
- Re-opened `goal.cjs:203-216`: confirmed `packet` prints durable length, budget, hash, objective slice, and chat slice.