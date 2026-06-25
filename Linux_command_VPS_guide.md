# Essential Linux Commands for VPS Management

This guide contains the most important Linux commands you will use while managing your Ubuntu VPS and deploying your project.

## 1. Checking System Resources
These commands tell you how your server is performing (RAM, CPU, Hard Drive).

- `free -h` : Shows available and used RAM (Memory) in human-readable format (MB/GB).
- `df -h` : Shows available and used Hard Drive (Disk) space.
- `top` : A live, scrolling view of all running processes and CPU usage (Press `q` to quit).
- `htop` : A much prettier, colorful version of `top` (You might need to install it first by typing `sudo apt install htop`).

## 2. Navigating and Looking Around
How to move around the folders on your server.

- `pwd` : "Print Working Directory" - tells you exactly which folder you are currently inside.
- `ls` : Lists all files and folders in your current directory.
  - `ls -la` : Lists *everything*, including hidden files and exact file permissions.
- `cd <folder_name>` : "Change Directory" - moves you into a folder (e.g., `cd /var/www`).
- `cd ..` : Moves you up one folder level.
- `cd ~` : Instantly takes you back to your user's home directory.

## 3. Working with Files and Folders
How to create, edit, and delete things.

- `mkdir <name>` : Creates a new folder.
- `touch <filename>` : Creates a new, empty file (e.g., `touch index.html`).
- `nano <filename>` : Opens a simple, beginner-friendly text editor right in your terminal. (Save with `Ctrl+O`, then hit `Enter`. Exit with `Ctrl+X`).
- `cat <filename>` : Prints the entire contents of a file to your screen without editing it.
- `rm <filename>` : Deletes a file forever (Be careful!).
  - `rm -rf <folder_name>` : Deletes an entire folder and everything inside it FOREVER. Use with extreme caution!
- `mv <old_name> <new_name>` : Moves a file, or renames it.

## 4. Installing Software (Package Management)
Because you are using Ubuntu, you use the `apt` package manager to install things like Node.js, Python, or Web Servers.

- `sudo apt update` : Downloads the latest list of available software from the internet (Always run this before installing something new).
- `sudo apt upgrade` : Upgrades all your currently installed software to the latest secure versions.
- `sudo apt install <package_name>` : Installs a new piece of software (e.g., `sudo apt install nginx`).

## 5. Managing Background Services (systemd)
When you run a web server or database, it runs as a "service" in the background.

- `sudo systemctl status <service>` : Checks if a service is running and healthy (e.g., `sudo systemctl status nginx`).
- `sudo systemctl start <service>` : Starts a stopped service.
- `sudo systemctl stop <service>` : Stops a running service.
- `sudo systemctl restart <service>` : Restarts a service (useful after you change a configuration file).

## 6. Networking & Troubleshooting
- `ping google.com` : Checks if your server has internet access. (Press `Ctrl+C` to stop).
- `curl <url>` : Downloads a web page or file directly in the terminal (e.g., testing if your API is working locally).

> [!TIP]
> **Pro Tips for the Terminal:**
> - Press the **Up Arrow** on your keyboard to cycle through commands you've typed previously.
> - Press the **Tab** key while typing a file or folder name, and Linux will try to auto-complete the rest of the word for you!
