output "pages_project_name" {
  description = "Cloudflare Pages project name"
  value       = cloudflare_pages_project.site.name
}

output "pages_url" {
  description = "Pages dev URL"
  value       = "https://${cloudflare_pages_project.site.name}.pages.dev"
}

output "site_url" {
  description = "Live site URL"
  value       = "https://${var.domain_name}"
}
