#!/bin/bash

# Check if HOST_UID is set; default to 1000 if not
UID=${HOST_UID:-1000}
GID=${HOST_GID:-1000}

RUN usermod -u "$UID" www-data
RUN groupmod -g "$GID" www-data

RUN chown -R www-data:www-data /var/www/hyperwaiver \
    && mkdir -p /var/www/hyperwaiver/storage \
    && chmod -R 755 /var/www/hyperwaiver/storage


USER www-data

EXPOSE 9000

exec gosu www-data "$@"