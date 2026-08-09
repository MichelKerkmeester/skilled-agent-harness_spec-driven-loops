use std::path::PathBuf;

use clap::{Parser, Subcommand};

#[derive(Parser, Debug)]
#[command(
    name = "gr",
    version,
    about = "Graphene — a work-graph engine for agents",
    long_about = "Graphene holds the graph an agent works through and pushes changes to every \
session attached to it.\n\nIt never calls a model and never executes a node: it tracks what is \
ready, claimed, and done, and the agent does the work.\n\nJSON on stdout by default — the primary \
consumer is an agent."
)]
pub struct Cli {
    /// Store to operate on. Defaults to the nearest `.graphene/store.db`.
    #[arg(long, global = true, env = "GRAPHENE_STORE")]
    pub store: Option<PathBuf>,

    /// Session identity for claims and presence.
    #[arg(long, global = true, env = "GRAPHENE_SESSION")]
    pub session: Option<String>,

    /// Render tables for a person, instead of JSON for an agent.
    #[arg(long, global = true)]
    pub human: bool,

    /// Emit nothing; communicate only through the exit code.
    #[arg(long, global = true)]
    pub quiet: bool,

    #[command(subcommand)]
    pub command: Command,
}

#[derive(Subcommand, Debug)]
pub enum Command {
    // ----------------------------------------------------------- workspace
    /// Install the agent skill into a repository, and create the store.
    ///
    /// Run this once per repository. It writes `.claude/skills/graphene/` so an
    /// agent working here knows what `gr` is for, and what order to call it in.
    Init {
        /// Where to install. Defaults to the current directory.
        #[arg(default_value = ".")]
        path: PathBuf,
        /// Overwrite skill files that already exist.
        #[arg(long)]
        force: bool,
    },

    // ------------------------------------------------------------- graphs
    /// Create a graph from a task.
    New {
        #[arg(long)]
        task: String,
        #[arg(long)]
        title: Option<String>,
        #[arg(long)]
        description: Option<String>,
        #[arg(long)]
        tag: Vec<String>,
        #[arg(long)]
        tokens: Option<u64>,
    },
    /// Replace a draft's nodes from a `task.v1` document on stdin.
    Plan {
        graph: String,
        /// Read from a file instead of stdin.
        #[arg(long)]
        file: Option<PathBuf>,
    },
    /// Validate structurally. Exits 3 on failure.
    Check { graph: Option<String> },
    /// Record explicit approval.
    Approve { graph: String },
    /// Begin the run.
    Start { graph: String },
    /// Stop a graph. Outstanding work is skipped and claims released.
    Cancel {
        graph: String,
        #[arg(long)]
        reason: String,
    },
    /// Derive a new graph, carrying completed outputs forward.
    Amend {
        graph: String,
        #[arg(long)]
        reason: String,
    },
    /// Instantiate a completed graph as a template.
    Clone { graph: String },
    /// Graphs not yet terminal, most recent first.
    List {
        #[arg(long)]
        all: bool,
        #[arg(long)]
        state: Option<String>,
        #[arg(long)]
        tag: Option<String>,
        #[arg(long)]
        limit: Option<u32>,
    },
    /// A graph's full folded state.
    Show { graph: String },
    /// The log as newline-delimited JSON, for git and diffing.
    Export { graph: String },
    /// The capability set this workspace plans against. Registering is
    /// additive; gating is one-way.
    Capabilities {
        /// Add a capability so nodes may declare it.
        #[arg(long = "register", value_delimiter = ',')]
        register: Vec<String>,
        /// Mark the registered capabilities irreversible, so every path to one
        /// must pass a human node.
        #[arg(long)]
        gated: bool,
    },

    // -------------------------------------------------------------- nodes
    /// Everything about a node. **The cold-context entry point** for a pasted id.
    Node {
        id: String,
        #[arg(long)]
        graph: Option<String>,
    },
    /// Nodes in a graph, optionally filtered.
    Nodes {
        graph: String,
        #[arg(long)]
        state: Option<String>,
    },
    /// What is claimable right now.
    Next { graph: String },
    /// Take a node, asserting the beliefs the work will rest on.
    Claim {
        node: String,
        #[arg(long)]
        graph: String,
        /// Beliefs this work stands on. A dead one refuses the claim.
        #[arg(long = "assumes", value_delimiter = ',')]
        assumes: Vec<String>,
        #[arg(long, default_value_t = graphene_exec::DEFAULT_LEASE_MS)]
        lease_ms: i64,
    },
    /// Extend a lease.
    Renew {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long, default_value_t = graphene_exec::DEFAULT_LEASE_MS)]
        lease_ms: i64,
    },
    /// Give a node back without finishing it.
    Release {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        reason: Option<String>,
    },
    /// Record progress at an edge crossing. Renews the lease.
    Checkpoint {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        state: String,
    },
    /// Report a result. Validated against the declared schema; fails closed.
    Done {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        output: String,
        #[arg(long, default_value_t = 0)]
        tokens: u64,
        #[arg(long, default_value_t = 0)]
        micros_usd: u64,
    },
    /// Report a failure.
    Fail {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        reason: String,
        #[arg(long)]
        retryable: bool,
    },
    /// Materialize a `forEach` node's children.
    Expand {
        node: String,
        #[arg(long)]
        graph: String,
    },

    // -------------------------------------------------------- human nodes
    /// Put a question to a person. Blocks only this node's dependents.
    Await {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        ask: String,
        #[arg(long, value_delimiter = ',')]
        options: Vec<String>,
        #[arg(long, value_delimiter = ',')]
        context: Vec<String>,
        /// Which dependents an answer releases: `--unblocks approve=gn_a,gn_b`,
        /// repeatable. An answer that names nothing **skips** every dependent —
        /// that is what makes the gate a gate. Omitting it entirely falls back
        /// to the node's own declaration.
        #[arg(long = "unblocks")]
        unblocks: Vec<String>,
        /// `wait`, `expire:<ms>`, or `escalate:<ms>`. No default — silence must
        /// never be indistinguishable from approval.
        #[arg(long)]
        on_timeout: String,
    },
    /// Everything waiting on a person.
    Awaiting { graph: String },

    // ------------------------------------------------------------- review
    /// Review findings, unresolved first.
    Findings {
        graph: String,
        #[arg(long)]
        open: bool,
    },
    /// Apply or reject a finding. **A reason is required** — an unexplained
    /// rejection is indistinguishable from not having read it.
    Finding {
        id: String,
        #[arg(long)]
        graph: String,
        /// `applied` or `rejected`.
        #[arg(long)]
        resolution: String,
        #[arg(long)]
        reason: String,
    },
    /// Record a person's answer.
    Resolve {
        node: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        by: String,
        #[arg(long)]
        choice: String,
        #[arg(long)]
        input: Option<String>,
    },

    // ----------------------------------------------------------- beliefs
    /// Record a belief.
    Believe {
        #[arg(long)]
        graph: String,
        #[arg(long)]
        content: String,
        #[arg(long, default_value = "tool-observation")]
        provenance: String,
        #[arg(long)]
        summary: Option<String>,
        #[arg(long)]
        source: String,
        #[arg(long)]
        shared: bool,
        #[arg(long, value_delimiter = ',')]
        derives_from: Vec<String>,
    },
    /// Stop believing something. Refused on observations — use `contradict`.
    Retract {
        id: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        reason: String,
        #[arg(long, value_delimiter = ',')]
        evidence: Vec<String>,
    },
    /// Record that evidence contradicts a belief, without deleting it.
    Contradict {
        id: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        reason: String,
        #[arg(long, value_delimiter = ',')]
        evidence: Vec<String>,
    },
    /// Withdraw a contradiction.
    Uncontradict {
        id: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        reason: String,
    },
    /// Raise fidelity. The corroborating belief must come from a **distinct**
    /// source — naming a belief rather than a source string is what makes that
    /// checkable instead of assertable.
    Corroborate {
        id: String,
        #[arg(long)]
        graph: String,
        /// The `gb_…` that corroborates it.
        #[arg(long)]
        by: String,
    },
    /// Bring back something that went OUT.
    Reinstate {
        id: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        reason: String,
    },
    /// Replace a belief with a corrected one. On an observation, only
    /// immediately after re-observing.
    Supersede {
        id: String,
        #[arg(long)]
        graph: String,
        #[arg(long)]
        content: String,
        #[arg(long)]
        reason: String,
        /// Evidence of a fresh observation in this turn. Required when
        /// superseding a `tool-observation`.
        #[arg(long)]
        observation_proof: Option<String>,
    },
    /// Record a set that cannot all be true, so it stops being re-proposed.
    Nogood {
        #[arg(long)]
        graph: String,
        #[arg(long, value_delimiter = ',')]
        members: Vec<String>,
        #[arg(long)]
        note: String,
    },
    /// What would fall if this belief went.
    Dependents {
        id: String,
        #[arg(long)]
        graph: String,
    },
    /// Mark a source's observations stale after a write.
    Stale {
        #[arg(long)]
        graph: String,
        #[arg(long)]
        source: String,
    },
    /// A belief's full record.
    Belief {
        id: String,
        #[arg(long)]
        graph: String,
    },
    /// What this rests on, and what falls with it.
    Why {
        id: String,
        #[arg(long)]
        graph: String,
        #[arg(long, default_value_t = 3)]
        depth: u32,
    },
    /// Everything currently contested.
    Contested { graph: String },
    /// Every event touching an id, in order.
    History {
        id: String,
        #[arg(long)]
        graph: String,
    },

    // ---------------------------------------------------------- sessions
    /// Join a graph. Starts the server if none is running.
    Attach {
        graph: String,
        #[arg(long)]
        label: Option<String>,
    },
    /// Leave, releasing anything held.
    Detach { graph: String },
    /// Who is attached, and what they hold.
    Sessions { graph: String },
    /// Where the graph is, and what to do next.
    Status { graph: Option<String> },
    /// **Block until something relevant happens.** How push reaches an agent.
    Wait {
        #[arg(long)]
        graph: String,
        #[arg(long, default_value_t = 300)]
        timeout: u64,
        #[arg(long = "on", value_delimiter = ',')]
        interests: Vec<String>,
    },

    // --------------------------------------------------------- integrity
    /// Run every gate. Exits 3 on failure.
    Validate { graph: Option<String> },
    /// What the accumulated graphs say about the guidance (spec 09 §7).
    ///
    /// Gates nobody declines, capabilities that fail most, plans that keep
    /// needing amendment. Counts over completed work — it says where to look,
    /// not what to conclude.
    Evidence {},
    /// Score the belief layer against the MnemeBrain belief benchmark.
    ///
    /// Drives the benchmark's own scenarios, runner and scoring through
    /// `bench/graphene_adapter.py`, and writes `bench/score.json`. Spec 10 §2:
    /// a number that is not reproducible from a committed harness is not a
    /// number worth publishing.
    Bench {
        #[arg(long)]
        bmb: bool,
    },
    /// Discard every cache and re-derive from the log.
    Rebuild,
    /// State at a point in time — what we believed when a node ran.
    Fold {
        graph: String,
        #[arg(long)]
        up_to: u64,
    },
    /// Collapse records that provably cannot change the fold. Self-verifying.
    Compact,
    /// Import a JSONL log.
    Apply {
        #[arg(long)]
        file: Option<PathBuf>,
    },

    // ---------------------------------------------------------------- ui
    /// Run the server in the foreground. `attach` starts it normally.
    Serve {
        #[arg(long, default_value_t = 0)]
        port: u16,
    },
    /// Open the browser at the running server.
    Ui { graph: Option<String> },
}
