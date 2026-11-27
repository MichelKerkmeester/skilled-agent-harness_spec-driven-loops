# Third-Party Notices

This file lists every file in the `system-skilled-bots` skill that lifts code or rules from a third-party project, with its source path, its licence and what changed. A later addition appends one section of its own.

## Activity and actor

`runtime/lib/activity.ts` takes its group list from OpenBot, by CopilotKit, at `app/src/lib/bot-lifecycle/activity-groups.ts`.

What was lifted is the seven activity group ids (`needs_you`, `working`, `scheduled`, `done`, `stopped`, `failed`, `recurring`), their titles, their top-to-bottom order and the rule that a group with no rows is left out.

What changed: the ids, the titles and the order are kept as OpenBot has them, and the grouping of this runtime's own run rows, items, leases, requests and schedules is written fresh for this runtime.

The licence is MIT. The full text follows, copied verbatim from the source project's `LICENSE` file.

```text
MIT License

Copyright (c) 2026 CopilotKit

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
