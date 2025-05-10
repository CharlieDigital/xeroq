set -e

gcloud config set account chen.charles.c@gmail.com

docker buildx build \
  --push \
  --platform linux/amd64 \
  -t us-east4-docker.pkg.dev/xeroq-app/xeroq-docker/xeroq-signaling \
  -f Dockerfile .

# Deploy image
gcloud run deploy xeroq-signaling \
  --image=us-east4-docker.pkg.dev/xeroq-app/xeroq-docker/xeroq-signaling:latest \
  --allow-unauthenticated \
  --min-instances=0 \
  --max-instances=1 \
  --timeout=15m \
  --region=us-east4 \
  --cpu-boost \
  --cpu=2 \
  --memory=2Gi \
  --concurrency=250 \
  --use-http2 \
  --project=xeroq-app \
  --set-env-vars=DOTNET_SYSTEM_NET_HTTP_SOCKETSHTTPHANDLER_HTTP3SUPPORT=false
