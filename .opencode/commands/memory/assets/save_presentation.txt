# Memory Save Presentation Contract

Single source of truth for `/memory:save` startup questions, dashboards, and result displays.

## 1. Startup Question Policy

Use the shortest prompt that resolves the target folder.

| Situation | Display |
| --- | --- |
| Explicit folder in `$ARGUMENTS` | No startup question. Validate the folder and continue. |
| Gate 3 carry-over exists | Announce `Using active spec folder from this session: <folder>` and continue. |
| One clear session folder from touched files | Ask `Save context to <folder>? [Y/n]`. |
| Multiple plausible folders | Ask `Which spec folder should receive this save?` and list only the candidate folders. |
| No plausible folder | Ask for a target spec folder and stop until answered. |

Do not show a long option menu unless there are multiple candidates.

## 2. Save Plan Display

```text
MEMORY:SAVE PLAN
--------------------------------------------------
Folder      <spec_folder>
Mode        plan-only
Route       <route_category>
Targets     <target_1>, <target_2>

Proposed edits
- <edit summary>

Follow-up
- <apply|refresh-graph|reindex|none>

STATUS=OK ACTION=plan TARGET=<spec_folder>
```

## 3. Apply Result Display

```text
MEMORY:SAVE
--------------------------------------------------
Folder      <spec_folder>
Targets     <target_1>, <target_2>, <target_3>
Indexing    <indexed|deferred|failed>

Anchors
- <anchor_1>
- <anchor_2>

Triggers
<phrase_1> | <phrase_2> | <phrase_3>

STATUS=OK TARGETS=<count> ANCHORS=<count>
```

## 4. Trigger Edit Display

```text
MEMORY:TRIGGERS
--------------------------------------------------
Record      #<id> "<spec_doc_title>"

Current triggers
1. <phrase_1>
2. <phrase_2>
3. <phrase_3>

Actions: [a] add | [r] remove number | [s] save | [d] done
STATUS=OK ID=<id> TRIGGERS=<count>
```

## 5. Error Display

```text
MEMORY:SAVE
--------------------------------------------------
FAIL        <short reason>
Recovery    <next safe action>

STATUS=FAIL ERROR="<message>"
```

## 6. Display Rules

- Keep output parseable: stable labels, one status line, no decorative menu dumps.
- Report save quality review issues only when returned by the save script or tool.
- Label deferred indexing honestly; saved documents remain durable even if retrieval is stale.
- End with one concise next action, not an open-ended option list.
