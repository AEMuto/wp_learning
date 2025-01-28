# WordPress Development Environment with Docker

This repository provides a development environment for WordPress development. The environment uses Docker Compose to ensure consistency and reproducibility across different development machines.

## Prerequisites

It was build specifically for Windows 11 with WSL2, but it should work on other platforms with minor adjustments.
- Windows with WSL2 (Debian recommended) - Provides the Linux environment needed for development
- Docker Desktop with WSL2 backend enabled - Manages our containers
- Visual Studio Code with Remote WSL extension - Enables efficient code editing
- Git for version control
- Basic command line knowledge

## Quick Start

We use Make commands to simplify common operations. Here are the main commands available:

```bash
make up           # Start the development environment
make clean        # Remove all containers, volumes, and WordPress files
sudo make fix     # Fix file permissions if you encounter access issues
```

## Initial Setup

1. Clone and prepare the environment:
```bash
git clone https://github.com/AEMuto/wp-docker-template.git <your-repo-name>
cd <your-repo-name>

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your preferred settings
```

2. Set up permissions and user access:
```bash
# Add yourself to the www-data group
sudo usermod -aG www-data $USER

# IMPORTANT: Log out of WSL completely and log back in
exit
# Then reconnect to WSL and verify groups
groups  # Should show www-data in the list
```

3. Start the environment:
```bash
make up
```

## Environment Structure

Our Docker environment consists of several services working together:

- `wordpress`: The main WordPress container
  - Runs Apache with PHP
  - Mounts local directories for live development
  - Configured with debugging enabled

- `db`: MariaDB database
  - Persists data through Docker volumes
  - Accessible on port 3306 for local tools

- `phpmyadmin`: Database management
  - Provides web interface for database operations
  - Available at http://localhost:8081

- `wp-cli`: WordPress CLI tool
  - Runs initialization tasks
  - Available for ongoing management tasks

## Development Workflow

### Directory Structure

```
.
├── docker-compose.yml    # Container configuration
├── .env                  # Environment variables
├── plugins/              # Plugin development directory
├── themes/               # Theme development directory
├── uploads/              # Media uploads
├── wordpress/           # WordPress core files
├── scripts/             # Utility scripts
└── php-config/          # PHP configuration files
```

### File Permissions

Understanding file permissions is crucial for this setup:
- Directories need 775 permissions (drwxrwxr-x)
- Files need 664 permissions (-rw-rw-r--)
- Files should be owned by your user and the www-data group

If you encounter permission issues, run:
```bash
sudo make fix
```

### Using WP-CLI

The WP-CLI container exits after initialization, but you can run commands anytime:
```bash
# Format: docker compose run --rm wp-cli wp <command>
# Examples:
docker compose run --rm wp-cli wp plugin list
docker compose run --rm wp-cli wp user list
```

### Debugging

The environment includes:
- WordPress debug logging (check wordpress/wp-content/debug.log)
- Xdebug configuration for VS Code
- PHP error reporting enabled

## Troubleshooting

### Common Issues

1. "Operation not permitted" errors:
   - Run `sudo make fix`
   - Verify you're in the www-data group
   - Try cleaning and rebuilding: `make clean && make up`

2. Database connection issues:
   - Wait a few moments after startup
   - Check logs: `docker compose logs db`
   - Verify environment variables in .env

3. Container startup issues:
   - Check port conflicts
   - Verify Docker service is running
   - Review logs: `docker compose logs`

## Best Practices

1. Version Control:
   - Don't commit .env files
   - Don't commit uploaded media

2. Development:
   - Use WordPress coding standards
   - Enable error reporting during development
   - Test with WordPress debug mode enabled

3. Database:
   - Use WP-CLI for database operations
   - Backup before major changes
   - Use proper database prefixes

4. Backups:
   - Regularly back up your database
   - Use version control for code
   - You can use the following command to backup your database:
     ```bash
     docker compose run --rm wp-cli wp db export /backups/backup-$(date +%F).sql
     ```

## Security Notes

1. Development Credentials:
   - Change default passwords in .env
   - Never use development credentials in production
   - Keep .env file secure and untracked

2. File Permissions:
   - Don't use 777 permissions
   - Maintain proper ownership
   - Use group permissions properly


**Remember.** This is a development environment. Configure security measures appropriate for your deployment environment when moving to production.