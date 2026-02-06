FROM nginx:alpine

# Remove ALL default nginx configs
RUN rm -f /etc/nginx/conf.d/*.conf

# Copy pre-built static files
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
