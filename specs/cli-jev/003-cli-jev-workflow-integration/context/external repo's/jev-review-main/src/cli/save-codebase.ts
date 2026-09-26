import { saveReview } from "./execute.ts";
import { runCodebaseReview } from "../review/codebase.ts";

await saveReview(runCodebaseReview);
