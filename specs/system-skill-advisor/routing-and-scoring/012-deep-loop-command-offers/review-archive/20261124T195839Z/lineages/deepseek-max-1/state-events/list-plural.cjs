const fs = require("fs");
const cases = JSON.parse(fs.readFileSync(".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json", "utf8")).cases.filter((c) => c.id.startsWith("plural-"));
for (const c of cases) console.log(c.id, "| asks=" + c.asksForLoopRun, "| servedRun=" + (c.servedRun === undefined ? "-" : c.servedRun), "|", c.prompt.slice(0, 60));
