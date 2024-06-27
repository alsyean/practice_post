#!/bin/bash

# Set variables
NAMESPACE="harbor"
HELM_REPO="https://helm.goharbor.io"
HELM_CHART="harbor/harbor"
RELEASE_NAME="harbor"
VALUES_FILE="values.yaml"
HARBOR_ADMIN_PASSWORD="YourHarborAdminPassword"

# Check if the namespace exists, if not create it
if ! kubectl get namespace $NAMESPACE > /dev/null 2>&1; then
  kubectl create namespace $NAMESPACE
  echo "Namespace '$NAMESPACE' created."
else
  echo "Namespace '$NAMESPACE' already exists."
fi

# Add Harbor Helm repository
helm repo add harbor $HELM_REPO
helm repo update

# Create a values.yaml file
cat <<EOF > $VALUES_FILE
externalURL: "https://localhost"
harborAdminPassword: "$HARBOR_ADMIN_PASSWORD"
persistence:
  persistentVolumeClaim:
    registry:
      size: 5Gi
    chartmuseum:
      size: 5Gi
    jobservice:
      size: 1Gi
    redis:
      size: 1Gi
    trivy:
      size: 5Gi
    database:
      size: 1Gi
EOF

# Install Harbor using Helm
helm install $RELEASE_NAME harbor/harbor --namespace $NAMESPACE -f $VALUES_FILE

# Check the status of the installation
if [ $? -eq 0 ]; then
  echo "Harbor installed successfully."
  echo "You can access Harbor at https://localhost:30002"
else
  echo "Failed to install Harbor."
  exit 1
fi

# Optionally, you can wait for the pods to be ready
echo "Waiting for Harbor pods to be ready..."
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=harbor --namespace $NAMESPACE --timeout=600s

# Output the status of the Harbor services
kubectl get svc -n $NAMESPACE
