FROM php:8.4-fpm

RUN set -eux; \
    apt-get update; \
    apt-get upgrade -y; \
    apt-get install -y --no-install-recommends \
            curl \
            libmemcached-dev \
            libjpeg-dev \
            libpng-dev \
            libfreetype6-dev \
            libssl-dev \
            libwebp-dev \
            libxpm-dev \
            libmcrypt-dev \
            libonig-dev \
            libgmp-dev \
            libicu-dev \
            libzip-dev;

RUN set -eux; \
    docker-php-ext-configure gd \
        --with-jpeg \
        --with-webp \
        --with-xpm \
        --with-freetype; \
    docker-php-ext-install -j$(nproc) \
        bcmath \
        gd \
        gmp \
        intl \
        opcache \
        pdo_mysql \
        pcntl \
        sockets \
        zip;

RUN pecl update-channels; \
    pecl install \
        redis \
        xdebug;

RUN docker-php-ext-enable redis;

# COPY php.ini "$PHP_INI_DIR/php.ini"
# COPY php-fpm.conf /usr/local/etc/php-fpm.conf

WORKDIR /var/www/hyperwaiver

EXPOSE 9000

# CMD ["php-fpm", "-c", "/usr/local/etc/php-fpm.conf"]
CMD ["php-fpm"]