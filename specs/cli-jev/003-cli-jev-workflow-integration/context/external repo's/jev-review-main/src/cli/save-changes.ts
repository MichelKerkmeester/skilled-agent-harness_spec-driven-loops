import { saveReview } from "./execute.ts";
import { runChangeReview } from "../review/changes.ts";

await saveReview(runChangeReview);
