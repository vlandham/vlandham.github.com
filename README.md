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

## Deploying

Pushing to `main` builds and deploys the site via GitHub Actions
(`.github/workflows/pages.yml`). Pull requests run the build only.
