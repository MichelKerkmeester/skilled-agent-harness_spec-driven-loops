# Deep Research Iteration 1

## Focus

Card anatomy, typography and spacing. Judge the standalone chart card against the local Vercel, Apple, Carbon, Tremor and shadcn captures.

## Required reads

- Read the current state log and strategy before taking a research action.
- Read the current chart templates and the card contract.
- Inspect the local captures named in the dispatch brief with image inspection where available.
- Use only local files and captures. Do not browse or fetch remote sources.

## Required output

Write `iterations/iteration-001.md` with the brief's six headings, with every finding tied to a local source path and line or capture file. Report measured values, preserve the fixed five card parts where the evidence supports them, name ruled-out directions and select angle 2 as the next focus.

Write `deltas/iter-001.jsonl` with one `type: iteration` record followed by finding and ruled-out records. Append the canonical iteration state event through the deep-research append gateway. Keep route proof fields on the iteration records:

- `mode`: `research`
- `target_agent`: `deep-research`
- `agent_definition_loaded`: `true`
- `resolved_route`: `Resolved route: mode=research target_agent=deep-research`

Do not write outside the bound lineage directory. Do not dispatch another agent or CLI.
