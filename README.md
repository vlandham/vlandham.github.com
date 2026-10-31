# Jim Vallandingham

This is a [Jekyll](https://jekyllrb.com) powered site and blog. Enjoy!

## Running Locally

Ruby is pinned in `.ruby-version`. With [mise](https://mise.jdx.dev) (or rbenv/asdf):

```bash
mise install
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.

## New Post

```bash
./new.rb "My post title"
```

## Post Front Matter

Optional flags used by the layouts:

- `d3: true` – load D3 v4 globally (only pages that need it).
- `light_only: true` – keep the page in light mode, for embedded visualizations drawn for a white background.
- `js` / `css` – page-specific files in `js/pages/` and `css/pages/`.
- `jquery`, `jslibs`, `zoom` – extra libraries.

## Analytics

Set `cloudflare_analytics_token` in `_config.yml` to enable Cloudflare Web Analytics in production builds.

## Deploying

Pushing to `main` builds and deploys the site via GitHub Actions
(`.github/workflows/pages.yml`). Pull requests run the build only.
