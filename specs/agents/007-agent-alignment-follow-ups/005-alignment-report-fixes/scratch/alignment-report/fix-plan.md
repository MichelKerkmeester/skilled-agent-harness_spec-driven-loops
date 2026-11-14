# Fix plan

Target: 57531ae8bc..869d4391bf; head: 869d4391bf9441c09ff1e5be713135f59caf43ed

## In scope

### skill:.skilled/skills/sk-doc/sk-create-agent

- [ ] B-1 P1 .skilled/skills/sk-doc/sk-create-agent/SKILL.md:197 Step 13 orders a registry record for every new agent with no directory qualifier, but `.skilled/bin/sync-agent-roster.cjs` enumerates only `.skilled/agents` (line 416) and fails every registry record 
  fix: 13. Add a record for a new agent to `.skilled/agents/agent-registry.json`, copying an existing record as the pattern. A  -> 13. For a new agent under `.skilled/agents/`, add a record to `.skilled/agents/agent-registry.json`, copying an existing
- [ ] C-2 P2 .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md:25 Line 25 says both later steps moved down "with their wording unchanged", but the diff shows the old step 13 became step 14 and gained the `agent file without a registry record: <name>` sentence. The b
  fix: - **Delivery is step 15.** The two later steps moved down by one, with their wording unchanged. -> - **Delivery is step 15.** Both later steps moved down by one. Delivery kept its wording, and validation did not.
- [ ] C-1 P1 .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md:17 The new entry fails sk-create-changelog's shape gate four times, and the standard's §9 says exit 1 blocks the write: line 17 keeps `(Level 1)` on the spec-folder line where §5 item 4 allows the path o
- [ ] CR-2 P2 .skilled/skills/sk-doc/sk-create-agent/SKILL.md:28 The new registry step is absent from the packet's routing vocabulary. The `Keyword triggers:` line and the derived `create-agent-aliases` and hub `intent_signals` carry no `agent registry`, `registry 

### skill:.skilled/skills/system-spec-kit

- [ ] A-1 P2 .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:2 HEAD's corpus no longer matches the committed trigger-index outputs. The head commit edited a corpus document (.skilled/skills/system-spec-kit/changelog/v2.13.1.0.md) after the last regeneration, so a

### unowned

- [ ] CR-1 P2 .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md:61 The harness reference presents the model-facing tool list as complete: `bash`, `write`, `edit` and `subagent`. The phase 2 control run in this change called a `read` tool, recorded as the one `tool_ca
  fix: Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`), so a matcher written for capitalized tool names  -> Harness tool names are lowercase (`bash`, `write`, `edit`, `subagent`, `read`), so a matcher written for capitalized too
- [ ] BAT-01 P2 -:- S6-release-coverage failed (exit 1).

## Pre-existing or outside the scope

### unowned

- [ ] D-1 P2 .skilled/agents/markdown.md:34 The new registry step (sk-create-agent/SKILL.md:197) requires the author to write .skilled/agents/agent-registry.json and run `node .skilled/bin/sync-agent-roster.cjs`, which rewrites .skilled/agents/ (unchanged in range)
- [ ] C-3 P2 .skilled/changelog/skilled/v4.0.2.1.md:273 The branch ships sk-create-agent v1.0.8.0 (SKILL.md bumped plus a new skill changelog), but the newest root release note never names `sk-create-agent`; the component paragraph at line 273 lists the sk (unchanged in range)

### skill:.skilled/skills/sk-doc/sk-create-agent

- [ ] B-3 P2 .skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/manual-testing-playbook.md:31 The playbook's opening blockquote promises coverage of `delivery checks` (line 9), but the six scenarios cover component choice, runtime contract and body validation only (line 31), and no scenario fi (unchanged in range)
- [ ] C-4 P2 .skilled/skills/sk-doc/sk-create-agent/README.md:132 The skill README still describes the output as one validated agent file (frontmatter description line 3, Produces row line 25) and its verification as `validate_document.py` plus the naming checks (li (unchanged in range)

