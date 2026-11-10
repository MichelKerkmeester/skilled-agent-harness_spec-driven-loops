VERDICT: FIX

- [P1] .skilled/skills/sk-code/sk-code-skilled/assets/checklists/typescript-checklist.md:95 | 1 | The finding shortened line 104 to `Same rule as JavaScript.`, but its added `Explain reasoning, not mechanics` sub-bullet was restored with the frozen checklist block, so that instruction now appears nowhere in the file | keep line 104 as `Same rule as JavaScript.` and, after the WHY Comments block's closing fence at line 96, add `Explain reasoning, not mechanics.` followed by a blank line, before `### Numbered ALL-CAPS Sections`
- [P1] .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md:294 | 1 | The Do bullet drops the HEAD condition `For frequently imported JS modules`, so the rule now reads as applying to every JS module instead of frequently imported ones | replace line 294 with:
  ```markdown
  - **Do**: for frequently imported JS modules, add a `.d.ts` declaration file co-located with the JS module and sharing its exact basename.
  ```

**Justified skips (no change required).** Each prescribed edit below lands inside a fenced code or JSON block, which the rubric freezes ("Keep the whole ... code blocks, JSON blocks ... exactly"). `guard-1.txt` records `BLOCK-CHANGED ... edited=1` for these eleven files and a final `restored` run; the current `code-blocks.py` sweep reports `code_blocks_changed=0 block_count_mismatch=0`. Applying any of them would raise `code_blocks_changed` above zero and itself be a FIX.

| File:line | Prescribed edit | Why skipped |
|---|---|---|
| `assets/checklists/rust-checklist/p2-evidence-validation-and-resources.md:130` | replace the dead `rust_checklist.md` citation | inside the §3 REVIEW EVIDENCE ````markdown```` fence |
| `assets/checklists/typescript-checklist.md:95` | add the sub-bullet inside WHY Comments | inside the ````markdown```` fence; the surviving prose sentence is restored in the first bullet above |
| `assets/scripts/README.md:99` | replace the transient expected-output line | inside the §6 USAGE EXAMPLES ````text```` fence |
| `references/config/quick-reference.md:301-311` | replace the FILE LOCATIONS tree | inside a fenced tree |
| `references/config/style-guide.md:323-327` | remove the duplicate `$schema` key | inside the ````jsonc```` schema block |
| `references/javascript/quick-reference.md:241` | correct the `path.resolve` safety label | inside the ````javascript```` one-liners block |
| `references/javascript/style-guide.md:430-431` | add the TODO/FIXME owner | inside the ````javascript```` example block |
| `references/python/quick-reference.md:403` | add `Consistent string quotes` | inside the §11 ````markdown```` checklist block |
| `references/python/style-guide.md:74` | close the 78-column header box | inside the ````python```` header example block |
| `references/rust/quality-standards/build-and-organization.md:271` | add `"crates/sidecar",` | inside the ````toml```` workspace block |
| `references/shared/hooks.md:224` | point at `Cross-Runtime Parity` | inside the §7 maintenance ```` ```` checklist block |

**Checks.** `render_*` warnings are zero across all 55 changed files (`JEV_FEATURES=0 validate_document.py --json`), as are `frontmatter_changed` and `citations_missing`. Every anchor in `inbound-anchors.txt` holds: `SKILL.md` now cites §5 for QUALITY CHECKLIST MAP and §2 for SMART ROUTING at the listed sites, `workflow-guardrails.md` keeps §2, §3 and §4, and `organization-security-and-examples.md` §2 and `naming-and-commenting.md` §4 are untouched. The two line-target deviations in `fix-1.log` (SKILL.md SMART ROUTING at §2, shell P0 File Header before Strict Mode) match the findings' stated outcomes and the templates.
