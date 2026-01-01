# Dockerfile for testing MCP install scripts in clean environment
# Usage:
#   docker build -t mcp-install-test .opencode/install_scripts/test/
#   docker run -it --rm -v $(pwd):/workspace mcp-install-test

FROM node:20-bookworm

# Install utilities
RUN apt-get update && apt-get install -y \
    bash \
    curl \
    git \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Create workspace directory
WORKDIR /workspace

# Set bash as default shell
SHELL ["/bin/bash", "-c"]

# Create a minimal opencode.json for testing
RUN mkdir -p /workspace && \
    echo '{"mcp": {}}' > /workspace/opencode.json

# Default command - run tests
CMD ["/bin/bash"]
