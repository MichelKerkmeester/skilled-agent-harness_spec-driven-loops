use clap::Parser;

use graphene_cli::cli::Cli;
use graphene_cli::out::Format;
use graphene_cli::run;

fn main() {
    let args = Cli::parse();
    let fmt = Format { human: args.human, quiet: args.quiet };
    std::process::exit(run::dispatch(args, fmt));
}
