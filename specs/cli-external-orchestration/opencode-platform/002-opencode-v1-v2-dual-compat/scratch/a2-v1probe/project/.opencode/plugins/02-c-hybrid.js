import { appendFileSync } from "node:fs"
const MARK = "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/scratch/a2-v1probe/markers/load.log"
const log = (m) => appendFileSync(MARK, m + "\n")
log("module-eval:02-c-hybrid")
async function probeC(input) { log("C:called-as-function argType=" + typeof input); return {} }
probeC.id = "probe-c-hybrid"
probeC.setup = async (ctx) => { log("C:setup-invoked ctxKeys=" + (ctx ? Object.keys(ctx).sort().join(",") : "null")) }
export default probeC
