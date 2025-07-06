# Use the official Node.js 14 LTS dev container as base
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:0-14

# Avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install core tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl \
      unzip \
      git \
      gnupg2 \
      lsb-release && \
    rm -rf /var/lib/apt/lists/*

# Install Terraform
RUN curl -fsSL https://apt.releases.hashicorp.com/gpg | apt-key add - && \
    apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main" && \
    apt-get update && \
    apt-get install -y terraform && \
    rm -rf /var/lib/apt/lists/*

# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip" && \
    unzip /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install && \
    rm -rf /tmp/aws /tmp/awscliv2.zip

# Install global JS/TS CLIs
RUN npm install -g expo-cli supabase

# Set default workdir
WORKDIR /workspace

# Ensure permissions for vscode user
RUN chown -R vscode:vscode /workspace

USER vscode
