FROM php:8.2-fpm-alpine

RUN set -eux; \
    apk update && apk add --no-cache \
            curl \
            libmemcached-dev \
            zlib-dev \
            postgresql-dev \
            jpeg-dev \
            libpng-dev \
            freetype-dev \
            openssl-dev \
            libwebp-dev \
            libxpm-dev \
            libzip-dev \
            oniguruma-dev

RUN docker-php-ext-configure gd \
        --with-jpeg \
        --with-webp \
        --with-xpm \
        --with-freetype \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo \
        pdo_mysql \
        mysqli \
        zip

# Clean up dev dependencies
RUN apk del --no-cache \
    freetype-dev \
    libjpeg-turbo-dev \
    libpng-dev \
    && rm -rf /tmp/* /var/cache/apk/*

COPY php.ini "$PHP_INI_DIR/php.ini"
COPY php-fpm.conf /usr/local/etc/php-fpm.conf

WORKDIR /var/www/hyperwaiver

EXPOSE 9000

CMD ["php-fpm"]