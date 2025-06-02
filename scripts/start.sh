#!/bin/sh

# Запускаем бэкенд в фоновом режиме
cd /app/backend && node dist/main.js &

# Запускаем nginx
nginx -g 'daemon off;' 