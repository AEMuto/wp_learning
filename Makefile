# Makefile for WordPress Docker Development
# This Makefile provides common commands for managing the WordPress development environment

# Include environment variables from .env file
include .env

# Default target (running 'make' without arguments)
.PHONY: help
help:
	@echo "Available commands:"
	@echo "  make up          - Start Docker containers"
	@echo "  make clean       - Stop containers and clean workspace"
	@echo "  make fix - Fix permissions for WordPress files"

# Start the development environment
.PHONY: up
up:
	@echo "Starting Docker containers..."
	docker compose up -d
	@echo "Containers are running. WordPress should be available at ${WP_URL}:${WP_PORT}"

# Clean everything and start fresh
.PHONY: clean
clean:
	@echo "Stopping Docker containers..."
	docker compose down
	
	@echo "Removing Docker volumes..."
	docker compose down -v
	
	@echo "Cleaning WordPress directories..."
	# First, ensure .gitkeep files exist
	touch wordpress/.gitkeep plugins/.gitkeep themes/.gitkeep uploads/.gitkeep
	
	# Remove all contents except .gitkeep
	find wordpress/ -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +
	find plugins/ -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +
	find themes/ -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +
	find uploads/ -mindepth 1 ! -name '.gitkeep' -exec rm -rf {} +
	
	@echo "Environment cleaned successfully!"
	@echo "Run 'make up' to start fresh"

# Fix permissions for WordPress directories
.PHONY: fix
fix:
	@echo "Setting WordPress directory permissions..."
	
	# First ensure the directories exist and have .gitkeep files
	mkdir -p wordpress plugins themes uploads
	touch wordpress/.gitkeep plugins/.gitkeep themes/.gitkeep uploads/.gitkeep
	
	# Set directory permissions (775 for directories)
	find wordpress plugins themes uploads -type d -exec chmod 775 {} \;
	
	# Set file permissions (664 for files)
	find wordpress plugins themes uploads -type f -exec chmod 664 {} \;
	
	# Set ownership (assumes www-data group)
	chown -R ${USER}:www-data wordpress plugins themes uploads
	
	@echo "Permissions have been set correctly!"
	@echo "Directories: 775 (drwxrwxr-x)"
	@echo "Files: 664 (-rw-rw-r--)"