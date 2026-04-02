# ── Cloudflare DNS Zone ──────────────────────────────────────────────────────
# The zone for blackhearthgames.com is managed by the
# blackhearth_games_website infra. We reference it here.

data "cloudflare_zone" "main" {
  filter = {
    name = var.root_domain
  }
}

# ── DNS record pointing subdomain to Cloudflare Pages ───────────────────────

resource "cloudflare_dns_record" "site" {
  zone_id = data.cloudflare_zone.main.zone_id
  name    = var.domain_name
  type    = "CNAME"
  content = "${cloudflare_pages_project.site.name}.pages.dev"
  proxied = true
  ttl     = 1 # Auto TTL when proxied
}
