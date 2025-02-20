FROM ubuntu:22.04

# Install wkhtmltopdf and dependencies
RUN apt-get update && apt-get install -y \
    wget \
    fontconfig \
    libfreetype6 \
    libjpeg-turbo8 \
    libpng16-16 \
    libx11-6 \
    libxcb1 \
    libxext6 \
    libxrender1 \
    xfonts-75dpi \
    xfonts-base \
    xvfb \
    x11-xserver-utils \
    nodejs \
    npm \
    && wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6.1-2/wkhtmltox_0.12.6.1-2.jammy_amd64.deb \
    && dpkg -i wkhtmltox_0.12.6.1-2.jammy_amd64.deb \
    && rm wkhtmltox_0.12.6.1-2.jammy_amd64.deb \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Your application setup
WORKDIR /app
COPY . .
# ...rest of your Dockerfile

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the service
CMD ["node", "server.js"]
