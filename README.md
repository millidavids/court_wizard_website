# Court Wizard Website

Game website for [Court Wizard](https://courtwizard.blackhearthgames.com). Vanilla HTML/CSS/JS.

## Local Development

```bash
python3 serve.py
# Open http://localhost:8000
```

## Infrastructure

Hosted on Cloudflare Pages. Infrastructure managed with OpenTofu.

```bash
cd infra
export CLOUDFLARE_API_TOKEN="your-token"
tofu init
tofu apply -var="cloudflare_account_id=YOUR_ACCOUNT_ID"
```

Requires the `blackhearthgames.com` DNS zone to exist (managed by the [studio website](https://github.com/millidavids/blackhearth_games_website) infra).

## Deploy

Pushes to `main` automatically deploy via GitHub Actions.

Manual deploy:

```bash
export CLOUDFLARE_API_TOKEN="your-token"
export CLOUDFLARE_ACCOUNT_ID="your-account-id"
./scripts/deploy.sh
```
