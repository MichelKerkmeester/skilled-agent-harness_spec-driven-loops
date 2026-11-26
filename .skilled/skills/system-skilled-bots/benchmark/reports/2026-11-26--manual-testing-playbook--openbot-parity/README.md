# 2026-11-26--manual-testing-playbook--openbot-parity

> system-skilled-bots · manual-testing-playbook--openbot-parity · Mistral Vibe on macOS, node 22, no tty

---

## 1. OVERVIEW

Verdict: SKIP.

Tally: 33 SKIP.

The recorder wrote this folder from `specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/results.csv`. A field the run did not capture reads "not recorded".

---

## 2. RESULTS

| Scenario | File | Runtime | Verdict | Reason | Evidence |
|---|---|---|---|---|---|
| BOT-026 | `conversations/chat-appends-one-message.md` | not recorded | SKIP | the chat verb is absent from the CLI verb table, so the block cannot append a message | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-026.txt |
| BOT-027 | `conversations/at-bot-routing.md` | not recorded | SKIP | the chat verb is absent from the CLI verb table, so the block cannot route a message | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-027.txt |
| BOT-028 | `conversations/park-answer-scope-once.md` | not recorded | SKIP | the chat verb is absent from the CLI verb table, so the block cannot park a run | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-028.txt |
| BOT-029 | `conversations/scope-deny-and-unsupported.md` | not recorded | SKIP | the chat verb is absent from the CLI verb table, so the block cannot reach the scope refusal | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-029.txt |
| BOT-030 | `conversations/grants-on-the-item.md` | not recorded | SKIP | the chat verb is absent from the CLI verb table, so the block cannot park the item it reads | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-030.txt |
| BOT-031 | `conversations/memory-proposal-confirm.md` | not recorded | SKIP | the remember verb is absent from the CLI verb table, so the block cannot write the fact it proposes | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-031.txt |
| BOT-032 | `conversations/skill-proposal-review.md` | not recorded | SKIP | the skill verb is absent from the CLI verb table, so the block cannot draft the proposal | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-032.txt |
| BOT-033 | `conversations/channel-link-and-reply.md` | not recorded | SKIP | the channel verb is absent from the CLI verb table, so the block cannot link a chat | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-033.txt |
| BOT-034 | `conversations/channel-non-approver.md` | not recorded | SKIP | the channel verb is absent from the CLI verb table, so the block cannot read the roster | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-034.txt |
| BOT-035 | `routines/routine-block-renders.md` | not recorded | SKIP | the routines verb is absent from the CLI verb table, so the block cannot render a routine | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-035.txt |
| BOT-036 | `routines/cron-start-fires-at-computed-slot.md` | not recorded | SKIP | the routines verb is absent from the CLI verb table, so the block cannot install a schedule | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-036.txt |
| BOT-037 | `routines/until-outcome-completes.md` | not recorded | SKIP | the routines verb is absent from the CLI verb table, so the block cannot read the until check | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-037.txt |
| BOT-038 | `routines/floor-fifteen-minutes.md` | not recorded | SKIP | the routines verb is absent from the CLI verb table, so the block cannot reach the floor refusal | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-038.txt |
| BOT-039 | `routines/fatigue-after-ten-failures.md` | not recorded | SKIP | the routines verb is absent from the CLI verb table, so the block cannot read the fatigue switch | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-039.txt |
| BOT-040 | `activity/activity-groups-seven-ids.md` | not recorded | SKIP | the activity verb is absent from the CLI verb table, so the block cannot group a row | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-040.txt |
| BOT-041 | `activity/inbox-json-item-fields.md` | not recorded | SKIP | the activity verb is absent from the CLI verb table, so the block cannot read the ten fields | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-041.txt |
| BOT-042 | `activity/actor-on-answer-and-record.md` | not recorded | SKIP | the activity verb is absent from the CLI verb table, so the block cannot read the actor | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-042.txt |
| BOT-043 | `terminal-screen/screen-refuses-without-binary.md` | not recorded | SKIP | the ui verb is absent from the CLI verb table and the bots-tui crate is absent, so the block cannot reach either refusal | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-043.txt |
| BOT-044 | `terminal-screen/inbox-pane-answers.md` | not recorded | SKIP | the ui verb is absent from the CLI verb table and the bots-tui crate is absent, so the block cannot drive the pane | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-044.txt |
| BOT-045 | `terminal-screen/banner-and-overlay.md` | not recorded | SKIP | the ui verb is absent from the CLI verb table and the bots-tui crate is absent, so the block cannot run the render tests | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-045.txt |
| BOT-046 | `working-place/working-place-line.md` | not recorded | SKIP | the prompt builder module is absent, so no working-place line reaches a prompt | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-046.txt |
| BOT-047 | `working-place/status-branch-and-worktree.md` | not recorded | SKIP | the status row carries no branch and no worktree field | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-047.txt |
| BOT-048 | `memory/remember-appends-and-lists.md` | not recorded | SKIP | the remember verb is absent from the CLI verb table, so the block cannot append a line | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-048.txt |
| BOT-049 | `memory/memory-block-injected.md` | not recorded | SKIP | the remember verb is absent from the CLI verb table, so the block cannot write the fact it injects | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-049.txt |
| BOT-050 | `memory/memory-bound-refuses.md` | not recorded | SKIP | the remember verb is absent from the CLI verb table, so the block cannot reach the bound | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-050.txt |
| BOT-051 | `apps/apps-filter-utcp-config.md` | not recorded | SKIP | the apps verb is absent from the CLI verb table, so the block cannot read the filtered config | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-051.txt |
| BOT-052 | `apps/apps-unknown-server.md` | not recorded | SKIP | the apps verb is absent from the CLI verb table, so the block cannot reach the unknown-server refusal | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-052.txt |
| BOT-053 | `vault/secret-set-and-list.md` | not recorded | SKIP | the secret verb is absent from the CLI verb table, so the block cannot store a token | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-053.txt |
| BOT-054 | `vault/secret-reaches-child.md` | not recorded | SKIP | the secret verb is absent from the CLI verb table, so the block cannot name a token for the child | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-054.txt |
| BOT-055 | `vault/secret-in-output-redacted.md` | not recorded | SKIP | the secret verb is absent from the CLI verb table, so the block cannot store the token it prints | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-055.txt |
| BOT-056 | `skills/skills-list-injects-body.md` | not recorded | SKIP | the skill verb is absent from the CLI verb table, so the block cannot reach the skill block | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-056.txt |
| BOT-057 | `skills/skills-over-budget.md` | not recorded | SKIP | the skill verb is absent from the CLI verb table, so the block cannot reach either byte cap | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-057.txt |
| BOT-058 | `channels/queue-unknown-not-retried.md` | not recorded | SKIP | the channel verb is absent from the CLI verb table, so the block cannot queue a send | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-058.txt |

---

## 3. CROSS-LINKS

| File | Contents |
|---|---|
| `results.csv` | The same verdicts, one row per scenario and runtime |
| `source.md` | Where the corpus and the raw evidence live |
