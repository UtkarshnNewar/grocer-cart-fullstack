# Complete Guide: Setting up AWS EC2 and Deploying GrocerCart

This guide documents the steps taken inside the Ubuntu server to secure it, install dependencies, and launch the application using Docker.

## Step 1: Initial Server Setup
First, update the server's package list and install Docker and Docker Compose.

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
```

*(Optional) Add your user to the Docker group so you don't have to type `sudo` before every docker command:*
```bash
sudo usermod -aG docker ubuntu
```

## Step 2: Server Security (Firewall & Fail2ban)
It is critical to secure an internet-facing server. We will use **UFW (Uncomplicated Firewall)** to block all traffic except the specific ports we need, and **Fail2ban** to block hackers trying to brute-force SSH passwords.

### 2.1 Configure UFW
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 3000/tcp    # Frontend
sudo ufw allow 5000/tcp    # Backend
sudo ufw --force enable
```

### 2.2 Install Fail2ban
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Step 3: Cloning the Repository
Pull the code directly from your GitHub repository onto the AWS server.

```bash
git clone https://github.com/UtkarshnNewar/grocer-cart-fullstack.git
cd grocer-cart-fullstack
```

## Step 4: Running the App (Docker Compose)
Use Docker Compose to build the images and run the frontend, backend, and MongoDB containers in the background (`-d`).
*Note: In newer Docker versions on Ubuntu 24.04+, use `docker compose` (with a space) instead of `docker-compose`.*

```bash
sudo docker compose up -d --build
```

## Step 5: Accessing the App
Once the containers have successfully started, you can access your live application by navigating to your EC2 instance's Public IPv4 address in your browser (Nginx will handle routing on port 80):
**http://<YOUR-EC2-PUBLIC-IP>**

## Step 6: Connecting MongoDB Compass via SSH Tunnel
Because your MongoDB database is running securely on the AWS server, you must connect to it using an SSH tunnel instead of opening the port to the public internet.

1. Open **MongoDB Compass**.
2. Click on **Advanced Connection Options** (or the **SSH / Proxy** tab).
3. Go to the **SSH Tunnel** tab and check the box to enable it.
4. Fill in the SSH details:
   - **SSH Hostname:** `<YOUR-EC2-PUBLIC-IP>`
   - **SSH Port:** `22`
   - **SSH Username:** `ubuntu`
   - **SSH Identity File:** Select your `.pem` key file (e.g., `my-server-key.pem`).
5. Go back to the **General** tab and leave the connection string as:
   `mongodb://localhost:27017`
6. Click **Connect**. Compass will securely tunnel into the server and connect to your database!
