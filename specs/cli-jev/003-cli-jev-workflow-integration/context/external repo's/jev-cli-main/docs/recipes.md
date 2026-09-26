# Recipes

Copy, adjust thresholds, ship.

## Gate a pull request on its own description

One claim per line in `claims.txt`, checked against the diff:

```bash
git diff origin/main...HEAD | jev verify --claims @claims.txt --evidence - --fail-on contradicted,unsupported
```

## Guard an agent's web fetches

```bash
page=$(curl -s "$url")
if printf '%s' "$page" | jev screen --purpose "$task" --fail-on block,review,skip -q; then
  printf '%s' "$page" | my-agent --context -
fi
```

## Route a support ticket in a shell script

```bash
team=$(jev classify @ticket.txt -l billing,technical,sales --other --json | jq -r .label)
```

## Label a whole backlog, flag the uncertain ones

```bash
jev batch classify -i @issues.jsonl -o labeled.jsonl -- -l bug,feature,question,docs --other --fail-on review
jq -r 'select(.failed) | .id' labeled.jsonl
```

## Pull fields from every email in a folder

```bash
for f in inbox/*.eml; do jq -n --arg id "$f" --arg text "$(cat "$f")" '{id:$id,text:$text}'; done \
  | jev batch extract -i - -- --want sender=email:the sender --want reply_by=date:the reply deadline --want amount
```

## Rerank search results before answering from them

```bash
my-search "$q" --json | jev rerank "$q" -c - --min 0.6 --json | jq '.kept'
```

## Dedupe a contact export, review only the unclear pairs

```bash
jev match --dedupe @contacts.json --kind "customer contacts" --json \
  | jq -r '.results[] | select(.decision=="unclear") | "\(.left) ~ \(.right)"' > needs-review.txt
```

## Route chat messages to typed handlers in a bot

```bash
jev route "$message" --handlers-json @handlers.json --fail-on unrouted --json | jq '{handler, args}'
```

## Find the right file, then open it

```bash
jev find "where is retry logic configured" --files src/**/*.ts --json | jq -r '.top[0].id' | xargs code
```

## Check that a knowledge base actually answers a question

```bash
jev find "$question" --lines @faq.txt --fail-on absent,partial --json
```

## Compact a Claude Code session offline and inspect what would go

```bash
jev compact @~/.claude/projects/-Users-me-repo/$SESSION.jsonl --json \
  | jq '.decisions[] | select(.action != "keep") | {id, tool, action}'
```
