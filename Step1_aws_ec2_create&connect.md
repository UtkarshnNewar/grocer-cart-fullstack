# Complete Guide: Launching and Connecting to AWS EC2 from Windows

This guide documents the exact steps we took to launch your Ubuntu server and connect to it using a Windows computer.

## Step 1: Connecting to Aws EC2

1. **Choose AMI**: Select **Ubuntu Server** (e.g., 26.04 LTS).
2. **Instance Type**: Select **t3.micro** (Free tier eligible).
3. **Key Pair**: 
   - Click **Create new key pair**.
   - Name it (e.g., `my-server-key`).
   - Type: **RSA**, Format: **.pem**.
   - Save the downloaded file to a dedicated folder (like `C:\Desktop_New\Vps\VPS-Amazon`).
4. **Network Settings**:
   - **SSH traffic**: Set to **My IP** (Most secure, allows only you to connect).
   - **HTTP/HTTPS**: Check these if you plan to host a website.
5. **Storage**: Leave default (e.g., 8 GiB gp3).
6. **Launch**: Click the **Launch instance** button.

## Step 2: Fixing Windows Key Permissions (The "Bad Permissions" Error)

> [!WARNING]
> Windows SSH is very strict. If your `.pem` file has default Windows permissions, SSH will reject it with an "UNPROTECTED PRIVATE KEY FILE" error. You must run the commands below to lock the file down.

1. Open **PowerShell** on your Windows computer.
2. Navigate to the folder where you saved your `.pem` file:
   ```powershell
   cd C:\Desktop_New\Vps\VPS-Amazon
   ```
3. Run these exact two commands to strip public access and grant exclusive read access to your user account (replace `my-server-key.pem` with your actual file name if different):
   ```powershell
   icacls "my-server-key.pem" /inheritance:r
   icacls "my-server-key.pem" /grant:r "$($env:USERNAME):(R)"
   ```

## Step 3: Connecting to the Server

1. Go back to your AWS Dashboard, right-click your new instance, and select **Connect**.
2. Go to the **SSH client** tab and copy the `ssh` command provided at the bottom under "Example".
3. Paste that command into your PowerShell window (ensure you are still in the folder with your `.pem` file). It will look something like this:
   ```powershell
   ssh -i "my-server-key.pem" ubuntu@ec2-13-60-156-153.eu-north-1.compute.amazonaws.com
   ```
4. The first time you connect, it will ask if you are sure you want to continue. Type `yes` and hit Enter.

> [!SUCCESS]
> You should now see the `ubuntu@ip-...:~$` prompt, meaning you are successfully logged into your server!

5. After that you can use to connect again:
   ```powershell
   ssh -i "my-server-key.pem" ubuntu@13.60.156.153
   ```

## Step 4: Creating a New User (Optional)

By default, you log in as `ubuntu`. If you want to create a new user (e.g., `utkarsh`) with administrator privileges, run these commands inside your server:

1. **Create the user**:
   ```bash
   sudo adduser utkarsh
   ```
   *(Follow the prompts to set a password)*

2. **Grant Administrator (sudo) access**:
   ```bash
   sudo usermod -aG sudo utkarsh
   ```

3. **Switch to the new user to test**:
   ```bash
   su - utkarsh
   ```