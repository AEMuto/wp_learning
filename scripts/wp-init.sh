#!/bin/bash

# Color codes for better visibility in logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function for logging
log() {
  local level=$1
  local message=$2
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

  case $level in
  "INFO")
    echo -e "${GREEN}[$timestamp] INFO: $message${NC}"
    ;;
  "WARN")
    echo -e "${YELLOW}[$timestamp] WARN: $message${NC}"
    ;;
  "ERROR")
    echo -e "${RED}[$timestamp] ERROR: $message${NC}"
    ;;
  esac
}

# Validate required environment variables
required_vars=(
  "WP_URL"
  "WP_PORT"
  "WP_TITLE"
  "WP_ADMIN_USER"
  "WP_ADMIN_PASSWORD"
  "WP_ADMIN_EMAIL"
  "WORDPRESS_DB_HOST"
  "WORDPRESS_DB_USER"
  "WORDPRESS_DB_PASSWORD"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    log "ERROR" "Required environment variable $var is not set"
    exit 1
  fi
done

# Wait for WordPress files to be present
while [ ! -f /var/www/html/wp-settings.php ]; do
  log "INFO" "Waiting for WordPress files..."
  sleep 1
done

# Enhanced database connection check with timeout
wait_for_db() {
  local timeout=30
  local counter=0

  log "INFO" "Waiting for database connection..."

  while ! mysqladmin ping -h"$WORDPRESS_DB_HOST" -u"$WORDPRESS_DB_USER" -p"$WORDPRESS_DB_PASSWORD" --silent; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
      log "ERROR" "Database connection timeout after ${timeout} seconds"
      exit 1
    fi
    log "WARN" "Database is not ready... waiting (attempt $counter/$timeout)"
    sleep 1
  done

  log "INFO" "Database is ready!"
}

wait_for_db

# Construct the full URL with port if it's not 80
if [ "$WP_PORT" = "80" ]; then
  SITE_URL="${WP_URL}"
else
  SITE_URL="${WP_URL}:${WP_PORT}"
fi

# Only install if not already installed
if ! $(wp core is-installed --path=/var/www/html --allow-root); then
  log "INFO" "Starting WordPress installation..."

  if wp core install \
    --path=/var/www/html \
    --url="$SITE_URL" \
    --title="$WP_TITLE" \
    --admin_user="$WP_ADMIN_USER" \
    --admin_password="$WP_ADMIN_PASSWORD" \
    --admin_email="$WP_ADMIN_EMAIL" \
    --skip-email \
    --allow-root; then

    log "INFO" "WordPress installed successfully!"

    # Additional setup steps could go here
    # For example, setting up default plugins or themes

  else
    log "ERROR" "WordPress installation failed"
    exit 1
  fi
else
  log "INFO" "WordPress is already installed"
fi
