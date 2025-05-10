# See: https://devblogs.microsoft.com/dotnet/improving-multiplatform-container-support/
# (1) The build environment
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# See: https://docs.docker.com/engine/reference/builder/#automatic-platform-args-in-the-global-scope
ARG TARGETARCH
ARG BUILDPLATFORM

COPY ./signaling ./
RUN dotnet publish ./xeroq-signaling.csproj \
  --output /app/published-app \
  --configuration Release \
  -a $TARGETARCH

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/published-app /app

ENV IS_CONTAINER=true
ENV ASPNETCORE_ENVIRONMENT=Production

# (5) Start our app!
ENTRYPOINT [ "dotnet", "/app/xeroq-signaling.dll" ]
