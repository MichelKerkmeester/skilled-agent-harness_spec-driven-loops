const fs = require("fs");
const LOG = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a12-probe/env.log";
function rec(hook) {
  try {
    fs.appendFileSync(
      LOG,
      [new Date().toISOString(), hook, "pid=" + process.pid, "ppid=" + process.ppid,
       "ai_child=" + String(process.env.AI_SESSION_CHILD),
       "db=" + String(process.env.OPENCODE_DB),
       "cwd=" + process.cwd()].join(" ") + "\n"
    );
  } catch (e) {}
}
export default {
  id: "probe.env",
  setup(input) { rec("setup"); },
  async server(input) { rec("server"); },
};
