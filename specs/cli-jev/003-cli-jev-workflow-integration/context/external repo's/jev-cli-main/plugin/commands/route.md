---
description: Turn a request into a handler choice plus typed arguments (jev route)
argument-hint: <request or @file> across <handlers>
allowed-tools: Bash(jev:*), Bash(npx jevctl:*), Read, Write
---

Use the `jev` skill's `route` command for: $ARGUMENTS

1. Identify the request text and the set of possible handlers. If handlers need arguments, write a
   handlers JSON file (choice options, yes/no questions, or score levels per argument) and pass it
   with `--handlers-json`; otherwise use `-H name:description,...`. Put the distinguishing rule for
   each handler in its description.
2. Run `jev route @request --handlers-json @handlers.json --json` and parse the result.
3. Report the handler, its confidence, and each argument value. If `action` is `review`, show the
   runner-up handler probability. If `action` is `none`, say no handler fits and show the
   distribution so the user can decide whether to add one.
