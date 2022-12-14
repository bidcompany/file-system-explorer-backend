#!/bin/bash

echo "Create necessary certificates..."
mkdir certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -nodes -days 900
echo "Done!"
