# ai-bootcamp-sandbox Project Structure

## Overview

This is a lightweight Node.js/TypeScript sandbox library for Claude CLI agent testing.

## Libraries

- All available libraries are located in the `lib/` directory.
- It provides wrappers to fetch data from the API for a business.
- Authentication is handled using environment variables.
- Please DO NOT modify any files in this directory.

## Script Creation

- Please place created scripts under the `tmp/` directory.
- - Make sure the script name is unique. Do not override existing scripts.
- Use `npm run typecheck` to check the script is valid
- In the script, assume the authentication tokens will be in environment variables when it is run, no need to validate or pass them explicitly.