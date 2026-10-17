# craftgenie-twenty-source

The source code of the [Twenty CRM](https://github.com/twentyhq/twenty) builds that CraftGenie runs for its customers, published under the GNU Affero General Public License v3 (AGPL-3.0, section 13).

## Where the source is

Every container image CraftGenie publishes, `ghcr.io/craftgenie-agent/craftgenie-twenty:sha-<commit>`, has its complete corresponding source here as the git tag **`sha-<commit>`**, with the same `<commit>`. The image's `org.opencontainers.image.source` label links to that tag.

```sh
git clone https://github.com/craftgenie-agent/craftgenie-twenty-source.git
cd craftgenie-twenty-source
git tag -l 'sha-*'              # one tag per published image
git checkout sha-<commit>       # SOURCE.md at the top says which Twenty version it is and how to build it
```

Each tag is Twenty as published upstream at [twentyhq/twenty](https://github.com/twentyhq/twenty), plus CraftGenie's changes. Every file CraftGenie changed carries a `FORK:` marker (`git grep -n "FORK:"`). Left out of these trees are all GitHub Actions workflows (`.github/workflows/`, upstream's and CraftGenie's: CI, not the program) and CraftGenie's internal development notes. None of them is needed to build, run or modify the program; the Dockerfile and build scripts are all there. This repository runs no Actions.

## License

Twenty is licensed under the [GNU AGPL v3](https://github.com/twentyhq/twenty/blob/main/LICENSE), except files marked `/* @license Enterprise */`, which are under Twenty's commercial license (CraftGenie does not modify them), and packages that carry their own license (MIT). The full `LICENSE` is in every tag. CraftGenie's changes are released under the AGPL v3 as well.

Twenty is a trademark of its owners; this repository is not affiliated with or endorsed by the Twenty project.

## Upstream

- Source and issues: https://github.com/twentyhq/twenty
- Documentation: https://docs.twenty.com
