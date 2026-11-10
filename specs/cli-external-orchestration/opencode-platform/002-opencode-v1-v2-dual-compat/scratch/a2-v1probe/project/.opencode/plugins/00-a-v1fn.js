import { appendFileSync } from "node:fs"
const MARK = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v1probe/markers/load.log"
const log = (m) => appendFileSync(MARK, m + "\n")
log("module-eval:00-a-v1fn")
export default async function probeA(input, options) {
  log("A:v1fn-invoked inputKeys=" + (input ? Object.keys(input).join(",") : "null"))
  return { "shell.env": async () => ({ PROBE_A: "1" }) }
}
