variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "domain_name" {
  description = "Full domain for the game website"
  type        = string
  default     = "courtwizard.blackhearthgames.com"
}

variable "root_domain" {
  description = "Root domain for DNS zone lookup"
  type        = string
  default     = "blackhearthgames.com"
}

variable "pages_project_name" {
  description = "Cloudflare Pages project name"
  type        = string
  default     = "court-wizard-website"
}

variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
  default     = "millidavids"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "court_wizard_website"
}
