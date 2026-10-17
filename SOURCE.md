# Source of `ghcr.io/craftgenie-agent/craftgenie-twenty:sha-07a1c62d26ad3ecd68b86fd21628f025a8bd8022`

This tree is the complete corresponding source of that container image: Twenty CRM
**v2.45.8** ([twentyhq/twenty](https://github.com/twentyhq/twenty), built on
upstream tag `twenty/v2.45.6`) with CraftGenie's changes.

- **Licence:** AGPL-3.0 (see `LICENSE`), except files marked `/* @license Enterprise */`,
  which are under Twenty's commercial licence and which CraftGenie has not modified, and
  packages that carry their own licence (MIT).
- **What CraftGenie changed:** every changed file carries a `FORK:` marker
  (`git grep -n "FORK:"`).
- **Build:** `docker build -f packages/twenty-docker/twenty/Dockerfile --target twenty --build-arg APP_VERSION=v2.45.8 .`
- **Left out:** the GitHub Actions workflows (`.github/workflows/`, upstream's and
  CraftGenie's: CI, not the program) and CraftGenie's internal development notes. None of
  them is needed to build, run or modify the program; the Dockerfile and build scripts
  are all here.

CraftGenie commit: `07a1c62d26ad3ecd68b86fd21628f025a8bd8022`.
