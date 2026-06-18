# Memory Learn Presentation Contract

Single source of truth for `/memory:learn` overview, creation, edit, removal, and budget displays.

## 1. Startup Policy

| Input | Display |
| --- | --- |
| Empty | Show overview dashboard. |
| `list` | Show list dashboard. |
| `budget` | Show budget dashboard. |
| `edit` without filename | List rule files and ask for one filename. |
| `remove` without filename | List rule files and ask for one filename. |
| Natural-language text | Treat as proposed rule and qualify it before writing. |

Do not infer a new constitutional rule from prior conversation context.

## 2. Overview Dashboard

```text
MEMORY:LEARN
--------------------------------------------------
Constitutional rules  <count> files

<filename_1>.md  "<title_1>"  ~<tokens> tokens
<filename_2>.md  "<title_2>"  ~<tokens> tokens

Budget  ~<used>/2000 tokens (<pct>%)

Actions: <rule text> | list | budget | edit <file> | remove <file>
STATUS=OK ACTION=overview
```

## 3. Create Qualification Prompt

Use only when one or more qualification answers are no.

```text
MEMORY:LEARN
--------------------------------------------------
This rule may not need constitutional tier.
Constitutional rules appear in every search result and consume the shared budget.

Actions: [y] proceed anyway | [s] use /memory:save instead | [n] cancel
STATUS=AWAITING_INPUT ACTION=qualify
```

## 4. Generated Rule Approval

Show the generated filename and Markdown preview, then wait for approval before writing.

```text
MEMORY:LEARN PREVIEW
--------------------------------------------------
File        <filename>.md
Title       <title>
Triggers    <phrase_1> | <phrase_2> | <phrase_3>

<markdown preview>

Actions: [y] create | [e] edit preview | [n] cancel
STATUS=AWAITING_INPUT ACTION=create-preview
```

## 5. Create Result

```text
MEMORY:LEARN
--------------------------------------------------
Created     <filename>.md
Title       <rule_title>
Tier        constitutional
Indexed     <yes|deferred|failed>

Triggers
<trigger_1> | <trigger_2> | <trigger_3>

Budget      ~<used>/2000 tokens (<count> files)
STATUS=OK ACTION=created
```

## 6. List Dashboard

```text
MEMORY:LEARN LIST
--------------------------------------------------
Constitutional rules  <count> files

1. <filename_1>.md
   "<title_1>"
   Triggers: <phrase_1> | <phrase_2>
   ~<tokens> tokens

2. <filename_2>.md
   "<title_2>"
   Triggers: <phrase_1> | <phrase_2>
   ~<tokens> tokens

Actions: edit <file> | remove <file> | budget
STATUS=OK ACTION=listed
```

## 7. Edit Result

```text
MEMORY:LEARN EDIT
--------------------------------------------------
Updated     <filename>.md
Title       <title>
Indexed     <yes|deferred|failed>

Budget      ~<used>/2000 tokens (<count> files)
STATUS=OK ACTION=edited
```

## 8. Remove Confirmation and Result

```text
MEMORY:LEARN REMOVE
--------------------------------------------------
DESTRUCTIVE  This removes a constitutional rule.
File         <filename>.md
Title        "<title>"

Actions: [y] confirm removal | [n] cancel
STATUS=AWAITING_INPUT ACTION=remove
```

```text
MEMORY:LEARN REMOVE
--------------------------------------------------
Removed     <filename>.md
Re-indexed  <yes|deferred|failed>

Budget      ~<used>/2000 tokens (<count> files)
STATUS=OK ACTION=removed
```

## 9. Budget Dashboard

```text
MEMORY:LEARN BUDGET
--------------------------------------------------
Total budget  ~2000 tokens
Used          ~<used> tokens
Available     ~<available> tokens
Files         <count>

Breakdown
<filename_1>.md  ~<tokens> tokens
<filename_2>.md  ~<tokens> tokens

Status        <OK|WARNING|EXCEEDED>
STATUS=OK ACTION=budget
```

## 10. Error Display

```text
MEMORY:LEARN
--------------------------------------------------
FAIL        <short reason>
Recovery    <next safe action>

STATUS=FAIL ERROR="<message>"
```
