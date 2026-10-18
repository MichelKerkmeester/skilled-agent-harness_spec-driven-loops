import { appendFileSync } from "node:fs"
const MARK = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v1probe/markers/load.log"
const log = (m) => appendFileSync(MARK, m + "\n")
log("module-eval:01-b-object")
const plugin = {
  id: "probe-b-object",
  async setup(ctx) { log("B:setup-invoked ctxKeys=" + (ctx ? Object.keys(ctx).sort().join(",") : "null")); return () => log("B:cleanup") },
  server: async () => log("B:server-invoked"),
}
export default plugin
